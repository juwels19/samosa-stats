import moment from "moment";
import prisma from "@prisma/index";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import createEventsForSeason from "@/utils/createEventsForSeason";
import EventCard from "@/components/EventCard";
import ErrorModal from "@/components/common/modals/ErrorModal";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Setup(props) {
  const { currentSeason, events, year, isApprover } = props;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [_currentSeason, setCurrentSeason] = useState(currentSeason);
  const [_events, setEvents] = useState(events);

  const onCreateSeasonClick = async () => {
    setIsLoading(true);
    const fetchDistrictsResult = await fetch(
      `/api/tba-fetch-districts/${year}`,
      { method: "GET" }
    );

    if (!fetchDistrictsResult.ok) {
      onModalOpen();
      setIsLoading(false);
      return;
    }
    let districts = await fetchDistrictsResult.json();
    districts = districts.body;

    let newSeasonBody = {};
    for (const district of districts) {
      if (district.abbreviation !== "ont") {
        continue;
      }
      newSeasonBody = {
        year: year,
        district: district.display_name,
        districtKey: district.key,
      };
      break;
    }

    const createSeasonResult = await fetch("api/create-season", {
      method: "POST",
      body: JSON.stringify(newSeasonBody),
    });
    if (!createSeasonResult.ok) {
      onModalOpen();
      setIsLoading(false);
      return;
    }
    let season = await createSeasonResult.json();
    season = season.body;

    const events = await createEventsForSeason(season.districtKey, season.id);
    if (events.length === 0) {
      onModalOpen();
      setIsLoading(false);
      return;
    }
    setCurrentSeason([season]);
    setEvents(events.body);

    setIsLoading(false);
  };

  return (
    <div className="z-10 py-8 px-10 flex flex-col max-w-5xl items-center text-center justify-between gap-8">
      <Head>
        <title>Setup | Samosa Stats</title>
      </Head>
      <div className="grid grid-cols-2 grid-flow-row justify-center gap-4">
        <Button
          onClick={() => router.push("/dashboard")}
          color="primary"
          radius="sm"
        >
          Go to dashboard
        </Button>
        {isApprover && (
          <Button
            onClick={() => router.push("/approvals")}
            color="primary"
            radius="sm"
          >
            Go to approvals
          </Button>
        )}
      </div>
      {_currentSeason.length === 0 ? (
        <>
          <p className="font-semibold text-xl md:text-2xl">
            The {moment().year()} season has not been created yet...
          </p>
          <Button
            color="primary"
            size="lg"
            isLoading={isLoading}
            onPress={onCreateSeasonClick}
          >
            Click to create season
          </Button>
          {isLoading && (
            <p>This might take a while, so go eat some samosas...</p>
          )}
        </>
      ) : (
        <>
          <p className="font-semibold text-xl md:text-2xl">
            {_currentSeason[0].year} {_currentSeason[0].district} District
            Events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {_events.map((event) => {
              return (
                <div key={event.name} className="flex flex-row justify-center">
                  <EventCard
                    name={event.name}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    eventCode={event.eventCode}
                    isSetup={event.isSetup}
                    isAdminCard
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
      <ErrorModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        headerText="Season Creation Error"
        bodyText="There was an error in creating the season. Please try again, or contact Julian for more help."
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  if (!user.privateMetadata.admin) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  const year = moment().year();
  // const year = 2024;
  const currentSeason = await prisma.season.findMany({
    where: {
      year: year,
    },
  });

  var seasonId = -1;
  var events = [];
  if (currentSeason.length !== 0) {
    seasonId = currentSeason[0].id;
    events = await prisma.event.findMany({
      where: {
        season: {
          is: {
            id: seasonId,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }
  return {
    props: {
      currentSeason: currentSeason,
      isApprover: user.privateMetadata.approver,
      seasonId: seasonId,
      events: events,
      year: year,
    },
  };
}

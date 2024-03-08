import EventCard from "@/components/EventCard";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import prisma from "@prisma/index";
import moment from "moment";
import Head from "next/head";
import { Button } from "@nextui-org/react";

export default function Dashboard(props) {
  const {
    setupEvents,
    submissionClosedEvents,
    completeEvents,
    isAdmin,
    isApprover,
    isApproved,
  } = props;

  const router = useRouter();

  return (
    <div className="z-10 py-8 px-4 flex flex-col max-w-5xl items-center justify-between gap-8">
      <Head>
        <title>Dashboard | Samosa Stats</title>
      </Head>
      {!isApproved && (
        <>
          <p className="text-3xl text-center">
            Number one rule of Samosa Stats... Don&apos;t talk about Samosa
            Stats.
            <br />
            <br />
            JKJK just message @fxdx on Discord to request access and check back
            soon.
          </p>
        </>
      )}
      {isApproved && (
        <>
          <div
            className={`grid grid-flow-row justify-center gap-4 ${
              isAdmin ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {isAdmin && (
              <Button
                onClick={() => router.push("/setup")}
                color="primary"
                radius="sm"
              >
                Go to event setup
              </Button>
            )}
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
          {!setupEvents.length &&
            !submissionClosedEvents.length &&
            !completeEvents.length && (
              <div>
                <p className="text-3xl text-center mb-10">
                  Nothing to see here yet...
                </p>
              </div>
            )}
          <div>
            {setupEvents.length > 0 && (
              <>
                <p className="text-3xl text-center">
                  Events open for submission:
                </p>
                <div
                  className={`grid grid-cols-1 ${
                    setupEvents.length > 1 ? "md:grid-cols-2" : ""
                  } gap-6`}
                >
                  {setupEvents.map((event) => (
                    <EventCard
                      key={event.name}
                      name={event.name}
                      startDate={event.startDate}
                      endDate={event.endDate}
                      eventCode={event.eventCode}
                      hasSubmitted={event?.picks.length > 0}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {submissionClosedEvents.length > 0 && (
            <>
              <p className="text-3xl text-center">
                Events closed for submission:
              </p>
              <div
                className={`grid grid-cols-1 ${
                  submissionClosedEvents.length > 1 ? "md:grid-cols-2" : ""
                } gap-6`}
              >
                {submissionClosedEvents.map((event) => (
                  <EventCard
                    key={event.name}
                    name={event.name}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    eventCode={event.eventCode}
                    isComplete={true}
                    isSubmissionClosed={event.isSubmissionClosed}
                    hasSubmitted={event?.picks.length > 0}
                  />
                ))}
              </div>
            </>
          )}
          {completeEvents.length > 0 && (
            <>
              <p className="text-3xl text-center">Completed events:</p>
              <div
                className={`grid grid-cols-1 ${
                  completeEvents.length > 1 ? "md:grid-cols-2" : ""
                } gap-6`}
              >
                {completeEvents.map((event) => (
                  <EventCard
                    key={event.name}
                    name={event.name}
                    startDate={event.startDate}
                    endDate={event.endDate}
                    eventCode={event.eventCode}
                    isComplete={true}
                    isSubmissionClosed={event.isSubmissionClosed}
                    hasSubmitted={event?.picks.length > 0}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  const season = await prisma.season.findMany({
    where: { year: parseInt(moment().year()) },
  });
  const setupEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isSetup: true,
      isSubmissionClosed: false,
      isComplete: false,
    },
    orderBy: {
      startDate: "asc",
    },
    include: {
      picks: {
        where: {
          userId: userId,
        },
      },
    },
  });
  const submissionClosedEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isSetup: true,
      isSubmissionClosed: true,
      isComplete: false,
    },
    include: {
      picks: {
        where: {
          userId: userId,
        },
      },
    },
  });
  const completeEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isSetup: true,
      isSubmissionClosed: true,
      isComplete: true,
    },
    include: {
      picks: {
        where: {
          userId: userId,
        },
      },
    },
  });
  return {
    props: {
      isAdmin: user.privateMetadata.admin ? true : false,
      isApprover: user.privateMetadata.approver ? true : false,
      isApproved: user.privateMetadata.approved ? true : false,
      setupEvents: setupEvents,
      completeEvents: completeEvents,
      submissionClosedEvents: submissionClosedEvents,
    },
  };
}

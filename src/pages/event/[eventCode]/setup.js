import TeamList from "@/components/common/TeamList";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { Tabs, Tab } from "@nextui-org/tabs";
import prisma from "@prisma/index";
import CategoryList from "@/components/common/CategoryList";
import { categoryOptions } from "@/data/categories";
import EventSetupForm from "@/components/common/forms/EventSetupForm";
import Head from "next/head";

export default function EventSetupPage(props) {
  const { event } = props;
  console.log(event.picks);
  return (
    <div className="z-10 pt-6 pb-12 flex flex-col max-w-5xl items-center justify-between gap-6">
      <Head>
        <title>Event Setup | Samosa Stats</title>
      </Head>
      <p className="font-semibold text-2xl text-center">
        {event.name} Setup Page
      </p>
      <Tabs aria-label="Setup Tabs" color="primary">
        <Tab key="teams" title="Teams">
          <TeamList eventCode={event.eventCode} />
        </Tab>
        <Tab key="categories" title="Categories">
          <CategoryList categories={categoryOptions} />
          <EventSetupForm
            event={event}
            numberOfTeamPicks={event.numberOfTeamPicks}
            numberOfCategoryPicks={event.numberOfCategoryPicks}
          />
        </Tab>
      </Tabs>
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
  // Get and return the event from the DB
  const { eventCode } = context.query;
  const event = await prisma.event.findMany({
    where: {
      eventCode: eventCode,
    },
    include: {
      picks: true,
    },
  });
  return {
    props: {
      event: event[0],
    },
  };
}

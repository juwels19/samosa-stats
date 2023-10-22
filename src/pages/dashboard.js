import EventCard from "@/components/EventCard";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import prisma from "@prisma/index";
import moment from "moment";

export default function Dashboard(props) {
  const { setupEvents, completeEvents } = props;

  return (
    <div className="z-10 py-8 px-4 flex flex-col max-w-5xl items-center justify-between gap-8">
      <p className="text-3xl text-center">Events open for submission:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {setupEvents.map((event) => (
          <EventCard
            key={event.name}
            name={event.name}
            startDate={event.startDate}
            endDate={event.endDate}
            eventCode={event.eventCode}
          />
        ))}
      </div>
      <p className="text-3xl text-center">Completed events:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {completeEvents.map((event) => (
          <EventCard
            key={event.name}
            name={event.name}
            startDate={event.startDate}
            endDate={event.endDate}
            eventCode={event.eventCode}
            isComplete={true}
            isSubmissionClosed={event.isSubmissionClosed}
          />
        ))}
      </div>
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
      isComplete: false,
    },
    orderBy: {
      startDate: "asc",
    },
  });
  const completeEvents = await prisma.event.findMany({
    where: {
      season: season.id,
      isComplete: true,
    },
  });
  return {
    props: {
      isAdmin: user.privateMetadata.admin ? true : false,
      setupEvents: setupEvents,
      completeEvents: completeEvents,
    },
  };
}

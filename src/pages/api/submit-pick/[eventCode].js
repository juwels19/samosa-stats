import moment from "moment";
import prisma from "@prisma/index";

export default async function handler(req, res) {
  const { eventCode } = req.query;

  if (req.method === "POST") {
    const { userId, userFullname, displayName, teams, categories } =
      await JSON.parse(req.body);

    // Save the pick to the DB
    const event = await prisma.event.findUnique({
      where: {
        eventCode: eventCode,
      },
    });
    const createPickRes = await prisma.pick.upsert({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: parseInt(event.id),
        },
      },
      update: {
        displayName: displayName,
        answersJSON: JSON.stringify({
          teams: teams,
          categories: categories,
        }),
      },
      create: {
        userId: userId,
        createdAt: moment().format(),
        userFullname: userFullname,
        displayName: displayName,
        answersJSON: JSON.stringify({
          teams: teams,
          categories: categories,
        }),
        event: {
          connect: {
            eventCode: eventCode,
          },
        },
      },
    });
    res.status(200).json({ message: "Pick Created Successfully" });
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

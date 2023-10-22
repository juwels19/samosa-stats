import prisma from "@prisma/index";
import moment from "moment";

export default async function handler(req, res) {
  const { events } = JSON.parse(req.body);

  if (req.method === "POST") {
    var _events = [];
    for (const event of events) {
      const res = await prisma.event.create({
        data: {
          createdAt: moment().format(),
          name: event.name,
          season: {
            connect: {
              id: parseInt(event.seasonId),
            },
          },
          eventCode: event.eventCode,
          startDate: moment(event.startDate).format(),
          endDate: moment(event.endDate).format(),
        },
      });
      _events.push(res);
    }

    if (events.length === _events.length) {
      res.status(201).json({ message: "Events created", body: _events });
    } else {
      res.status(500).json({ message: "Events not created successfully" });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

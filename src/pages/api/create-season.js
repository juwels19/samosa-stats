import prisma from "@prisma/index";
import moment from "moment";

export default async function handler(req, res) {
  const { year, district, districtKey } = JSON.parse(req.body);

  if (req.method === "POST") {
    const newSeason = await prisma.season.create({
      data: {
        createdAt: moment().format(),
        year: year,
        district: district,
        districtKey: districtKey,
      },
    });
    res.status(201).json({ message: "Season created", body: newSeason });
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

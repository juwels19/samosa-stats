import { tbaEndpoint } from "src/constants";

export default async function handler(req, res) {
  const { districtKey } = req.query;

  if (req.method === "GET") {
    // First query TBA
    const eventsResult = await fetch(
      `${tbaEndpoint}/district/${districtKey}/events/simple`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_READ_KEY,
        },
      }
    );

    if (eventsResult.ok) {
      const body = await eventsResult.json();
      res
        .status(200)
        .json({ message: "Events successfully fetched", body: body });
    } else {
      res.status(500).json({ message: "TBA Error - Events not fetched." });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

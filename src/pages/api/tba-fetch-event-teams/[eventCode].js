import { tbaEndpoint } from "src/constants";

export default async function handler(req, res) {
  const { eventCode } = req.query;

  if (req.method === "GET") {
    // First query TBA
    const teamsResult = await fetch(
      `${tbaEndpoint}/event/${eventCode}/teams/simple`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_READ_KEY,
        },
      }
    );

    if (teamsResult.ok) {
      // Now that we have all of the events, save them to the db
      const body = await teamsResult.json();
      res.status(200).json({
        message: "Teams successfully fetched",
        body: body,
      });
    } else {
      res.status(500).json({ message: "TBA Error - Teams not fetched." });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

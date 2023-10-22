import { tbaEndpoint } from "src/constants";

export default async function handler(req, res) {
  const { year } = req.query;
  if (req.method === "GET") {
    const districtsResult = await fetch(
      `${tbaEndpoint}/districts/${parseInt(year)}`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_READ_KEY,
        },
      }
    );
    if (districtsResult.ok) {
      const body = await districtsResult.json();
      res
        .status(200)
        .json({ message: "Districts successfully fetched", body: body });
    } else {
      res.status(500).json({ message: "TBA Error - Districts not fetched." });
    }
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}

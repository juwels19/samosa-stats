const createEventsForSeason = async (districtKey, seasonId) => {
  // Get events for the district from TBA
  const eventsFetchResult = await fetch(
    `/api/tba-fetch-district-events/${districtKey}`,
    { method: "GET" }
  );
  if (!eventsFetchResult.ok) return [];
  let events = await eventsFetchResult.json();
  events = events.body;

  const newEventsBody = { events: [] };
  for (const event of events) {
    newEventsBody.events.push({
      name: event.name,
      seasonId: seasonId,
      eventCode: event.key,
      startDate: event.start_date,
      endDate: event.end_date,
    });
  }
  // Attempt to save the events to the db
  const eventCreationResult = await fetch(`api/create-events`, {
    method: "POST",
    body: JSON.stringify(newEventsBody),
  });
  if (!eventCreationResult.ok) return [];
  let savedEvents = await eventCreationResult.json();
  savedEvents = savedEvents.body;

  return savedEvents;
};

export default createEventsForSeason;

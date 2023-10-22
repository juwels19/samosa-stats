const getTeamsForEvent = async (eventCode, setLoadingState) => {
  setLoadingState(true);
  const teamsFetchResult = await fetch(
    `/api/tba-fetch-event-teams/${eventCode}`,
    { method: "GET" }
  );
  if (!teamsFetchResult.ok) {
    setLoadingState(false);
    return [];
  }
  let teamsFetched = await teamsFetchResult.json();
  teamsFetched = teamsFetched.body;

  let teams = [];
  for (const team of teamsFetched) {
    teams.push({ name: team.nickname, number: team.team_number });
  }

  const sortedTeams = teams.sort((a, b) => {
    return a.number > b.number ? 1 : -1;
  });

  setLoadingState(false);
  return sortedTeams;
};

export default getTeamsForEvent;

import { useState, useEffect } from "react";
import getTeamsForEvent from "@/utils/getTeamsForEvent";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";

export default function TeamList(props) {
  const { eventCode } = props;

  const [areTeamsLoading, setAreTeamsLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeamsForEvent(eventCode, setAreTeamsLoading).then((result) =>
      setTeams(result)
    );
  }, []);

  return areTeamsLoading ? (
    <Spinner size="lg" />
  ) : (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-col justify-start gap-4 px-10 w-1/2">
          {teams.slice(0, Math.ceil(teams.length / 2)).map((team) => (
            <p key={team.number}>
              {team.number} - {team.name}
            </p>
          ))}
        </div>
        <div className="flex flex-col justify-start gap-4 px-10 w-1/2">
          {teams.slice(Math.ceil(teams.length / 2)).map((team) => (
            <p key={team.number}>
              {team.number} - {team.name}
            </p>
          ))}
        </div>
      </div>
      <Button
        color="primary"
        size="lg"
        onPress={() => {
          getTeamsForEvent(eventCode, setAreTeamsLoading).then((result) =>
            setTeams(result)
          );
        }}
        className="w-1/2"
      >
        Refresh Team List
      </Button>
    </div>
  );
}

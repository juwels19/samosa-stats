import { useState, useEffect } from "react";
import getTeamsForEvent from "@/utils/getTeamsForEvent";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import ErrorModal from "../modals/ErrorModal";
import { useDisclosure } from "@nextui-org/react";

export default function TeamSelectionForm(props) {
  const {
    eventCode,
    teams,
    selectedTeams,
    setSelectedTeams,
    numTeamsSelected,
    setNumTeamsSelected,
    maxNumTeams,
    areTeamsLoading,
    getTeamsForEvent,
  } = props;

  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  const handleTeamClick = (index) => {
    if (selectedTeams[index] === true) {
      // This means the user is deselecting the team, so decrement the count of selected teams
      setNumTeamsSelected(numTeamsSelected - 1);
    } else {
      // This means the user is selecting the team, so increment the count of selected teams
      if (numTeamsSelected === maxNumTeams) {
        // This if block catches the case where the user is trying to add a team even though they're at the cap
        onErrorModalOpen();
        return;
      }
      setNumTeamsSelected(numTeamsSelected + 1);
    }
    setSelectedTeams((oldTeamsSelected) => {
      var newTeams = oldTeamsSelected.slice();
      newTeams[index] = !newTeams[index];
      return newTeams;
    });
  };

  const handleClearAllTeamPicks = async () => {
    setNumTeamsSelected(0);
    const clearedTeamSelection = [];
    for (let i = 0; i < selectedTeams.length; i++) {
      clearedTeamSelection[i] = false;
    }
    setSelectedTeams(clearedTeamSelection);
  };

  useEffect(() => {
    if (selectedTeams.length === 0) {
      for (var i = 0; i < teams.length; i++) {
        selectedTeams[i] = false;
      }
    }
  }, []);

  return areTeamsLoading ? (
    <Spinner size="lg" />
  ) : (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex flex-row justify-evenly gap-2">
        <div className="flex flex-col justify-start gap-4 w-1/2">
          {teams.slice(0, Math.ceil(teams.length / 2)).map((team, index) => (
            <Button
              key={team.number}
              variant={selectedTeams[index] ? "solid" : "light"}
              color={selectedTeams[index] ? "success" : ""}
              className={`justify-start whitespace-normal md:truncate md:text-lg ${
                selectedTeams[index]
                  ? ""
                  : "hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
              size="sm"
              onPress={() => handleTeamClick(index)}
            >
              {team.number} - {team.name}
            </Button>
          ))}
        </div>
        <div className="flex flex-col justify-start gap-4 w-1/2">
          {teams.slice(Math.ceil(teams.length / 2)).map((team, index) => (
            <Button
              key={team.number}
              variant={
                selectedTeams[index + Math.ceil(teams.length / 2)]
                  ? "solid"
                  : "light"
              }
              color={
                selectedTeams[index + Math.ceil(teams.length / 2)]
                  ? "success"
                  : ""
              }
              className={`justify-start whitespace-normal md:truncate md:text-lg ${
                selectedTeams[index + Math.ceil(teams.length / 2)]
                  ? ""
                  : "hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
              size="sm"
              onPress={() =>
                handleTeamClick(index + Math.ceil(teams.length / 2))
              }
            >
              {team.number} - {team.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-4 md:gap-6">
        <Button
          color="primary"
          size="md"
          onPress={getTeamsForEvent}
          className="w-1/2 text-left"
        >
          Refresh Team List
        </Button>
        <Button
          color="danger"
          size="md"
          onPress={handleClearAllTeamPicks}
          className="w-1/2"
        >
          Clear Selected Teams
        </Button>
      </div>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
        headerText="Team Selection Error"
        bodyText="Maximum number of teams reached. You must deselect a team in order to pick another one."
      />
    </div>
  );
}

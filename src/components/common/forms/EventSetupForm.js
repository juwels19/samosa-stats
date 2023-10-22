import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";

export default function EventSetupForm(props) {
  const [event, setEvent] = useState(props.event);

  const [isTeamsInvalid, setIsTeamsInvalid] = useState(false);
  const [isCategoriesInvalid, setIsCategoriesInvalid] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(event.isSetup);

  const [numTeams, setNumTeams] = useState(event.numberOfTeamPicks);
  const [numCategories, setNumCategories] = useState(
    event.numberOfCategoryPicks
  );

  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure();

  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  const onTeamsInputChange = (value) => {
    if (parseInt(value) <= 0) {
      setIsTeamsInvalid(true);
      return;
    }
    setIsTeamsInvalid(false);
    setNumTeams(parseInt(value));
  };

  const onCategoriesInputChange = (value) => {
    if (parseInt(value) <= 0) {
      setIsCategoriesInvalid(true);
      return;
    }
    setIsCategoriesInvalid(false);
    setNumCategories(parseInt(value));
  };

  const onUpdateClick = async () => {
    setIsUpdateLoading(true);
    if (isTeamsInvalid || isCategoriesInvalid) {
      setIsUpdateLoading(false);
      onErrorModalOpen();
      return;
    }
    const body = {
      numberOfTeamPicks: numTeams,
      numberOfCategoryPicks: numCategories,
    };
    const editEventResult = await fetch(`/api/event-setup/${event.eventCode}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!editEventResult.ok) {
      setIsUpdateLoading(false);
      onErrorModalOpen();
      return;
    }
    let _event = await editEventResult.json();
    _event = _event.body;
    setEvent(_event);
    setIsSetup(_event.isSetup);
    setIsUpdateLoading(false);
    onSuccessModalOpen();
  };

  return (
    <div className="flex flex-col justify-start gap-4 mt-8 px-10 w-full">
      <Input
        type="number"
        label="Number of Teams"
        className="w-full"
        defaultValue={numTeams}
        isInvalid={isTeamsInvalid}
        errorMessage={
          isTeamsInvalid ? "Number of teams must be greater than 0" : ""
        }
        onChange={(event) => onTeamsInputChange(event.target.value)}
      />
      <Input
        type="number"
        label="Number of Categories"
        className="w-full"
        defaultValue={numCategories}
        isInvalid={isCategoriesInvalid}
        errorMessage={
          isCategoriesInvalid
            ? "Number of categories must be greater than 0"
            : ""
        }
        onChange={(event) => onCategoriesInputChange(event.target.value)}
      />
      <Button
        color="success"
        variant="ghost"
        size="lg"
        isLoading={isUpdateLoading}
        onPress={onUpdateClick}
      >
        {!isSetup ? "Setup Event" : "Update Event"}
      </Button>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
        headerText="Event Update Error"
        bodyText="There was an error in updating this event. Please try again, or contact Julian for more help."
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onSuccessModalClose}
        headerText="Event Update Successful"
        bodyText={`The ${event.name} was updated successfully.`}
      />
    </div>
  );
}

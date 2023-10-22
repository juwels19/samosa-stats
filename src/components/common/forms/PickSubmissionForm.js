import { categoryOptions as categories } from "@/data/categories";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Input, useDisclosure } from "@nextui-org/react";
import SuccessModal from "../modals/SuccessModal";

export default function PickSubmissionForm(props) {
  const {
    teams,
    selectedTeams,
    numTeamsSelected,
    selectedCategories,
    numCategoriesSelected,
    maxNumTeams,
    maxNumCategories,
    userId,
    userFullname,
    eventName,
    eventCode,
    displayName,
    setDisplayName,
    isComplete,
    isSubmissionClosed,
  } = props;

  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure();

  const [isDisplayNameInvalid, setIsDisplayNameInvalid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisplayNameChange = (value) => {
    if (displayName.length < 100) {
      setIsDisplayNameInvalid(false);
    } else {
      setIsDisplayNameInvalid(true);
    }
    setDisplayName(value);
  };

  const handleSubmitPicks = async () => {
    setIsSubmitting(true);
    let _teams = [];
    let _categories = [];

    for (let i = 0; i < teams.length; i++) {
      if (selectedTeams[i]) {
        _teams.push(teams[i].number);
      }
    }
    for (let i = 0; i < categories.length; i++) {
      if (selectedCategories[i]) {
        _categories.push(categories[i]);
      }
    }

    const body = {
      displayName: displayName,
      userId: userId,
      userFullname: userFullname,
      teams: _teams,
      categories: _categories,
    };
    const submitPickResult = await fetch(`/api/submit-pick/${eventCode}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    onSuccessModalOpen();
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex flex-row justify-evenly gap-2 px-2">
        <div className="flex flex-col justify-start gap-4 w-1/2">
          <p className="font-semibold text-lg md:text-xl">Teams Selected:</p>
          {selectedTeams.map((team, index) => {
            if (!team) return;
            const _team = teams[index];
            return (
              <p key={_team.number} className="text-sm md:text-lg">
                {_team.number} - {_team.name}
              </p>
            );
          })}
          {numTeamsSelected !== maxNumTeams && (
            <p className="text-red-400 text-sm md:text-lg">{`* Select ${
              maxNumTeams - numTeamsSelected
            } more team${maxNumTeams - numTeamsSelected > 1 ? "s" : ""}`}</p>
          )}
        </div>
        <div className="flex flex-col justify-start gap-4 w-1/2">
          <p className="font-semibold text-lg md:text-xl">
            Categories Selected:
          </p>
          {selectedCategories.map((category, index) => {
            if (!category) return;
            const _category = categories[index];
            return (
              <p key={_category} className="text-sm md:text-lg">
                {_category}
              </p>
            );
          })}
          {numCategoriesSelected !== maxNumCategories && (
            <p className="text-red-400 text-sm md:text-lg">{`* Select ${
              maxNumCategories - numCategoriesSelected
            } more categor${
              maxNumCategories - numCategoriesSelected > 1 ? "ies" : "y"
            }`}</p>
          )}
        </div>
      </div>
      <Input
        labelPlacement="outside"
        type="text"
        label="Optional - Pick Display Name"
        defaultValue={displayName}
        className="px-5 md:px-0 pt-4"
        isInvalid={isDisplayNameInvalid}
        isDisabled={isComplete && isSubmissionClosed}
        onChange={(event) => handleDisplayNameChange(event.target.value)}
        description={
          isComplete || !isSubmissionClosed
            ? `${100 - displayName.length} characters remaining`
            : ""
        }
      />
      {!isComplete && !isSubmissionClosed && (
        <Button
          color="success"
          onClick={handleSubmitPicks}
          isLoading={isSubmitting}
          isDisabled={
            numTeamsSelected !== maxNumTeams ||
            numCategoriesSelected !== maxNumCategories ||
            isDisplayNameInvalid
          }
        >
          Submit Picks
        </Button>
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onSuccessModalClose}
        headerText="Pick Submission Successful"
        bodyText={`Your picks ${eventName} were saved successfully.`}
      />
    </div>
  );
}

import prisma from "@prisma/index";
import { useState } from "react";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

import { Tabs, Tab } from "@nextui-org/tabs";
import TeamSelectionForm from "@/components/common/forms/TeamSelectionForm";
import CategorySelectionForm from "@/components/common/forms/CategorySelectionForm";

import getTeamsForEvent from "@/utils/getTeamsForEvent";
import PickSubmissionForm from "@/components/common/forms/PickSubmissionForm";

import { categoryOptions } from "@/data/categories";
import {
  tbaEndpoint,
  tbaEventBasePath,
  statboticsEventBasePath,
} from "@/constants";
import { Button } from "@nextui-org/button";
import Head from "next/head";

export default function EventPage(props) {
  const { event, userId, userFullname } = props;

  const numTeams = event.numberOfTeamPicks;
  const numCategories = event.numberOfCategoryPicks;

  const [teams, setTeams] = useState(props.teams);
  const [selectedTeams, setSelectedTeams] = useState(props.teamsSelected);
  const [selectedCategories, setSelectedCategories] = useState(
    props.categoriesSelected
  );

  const [numTeamsSelected, setNumTeamsSelected] = useState(
    parseInt(props.numTeamsSelected)
  );
  const [numCategoriesSelected, setNumCategoriesSelected] = useState(
    parseInt(props.numCategoriesSelected)
  );

  const [displayName, setDisplayName] = useState(props.displayName);

  const [areTeamsLoading, setAreTeamsLoading] = useState(false);

  return (
    <div className="z-10 pt-6 pb-12 flex flex-col max-w-5xl items-center justify-between gap-2">
      <Head>
        <title>Submit Picks | Samosa Stats</title>
      </Head>
      <p className="font-semibold text-2xl text-center px-8 pb-4">
        Submit your picks for {event.name}
      </p>
      <div className="grid grid-flow-row md:grid-flow-col gap-2 text-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${tbaEventBasePath}${event.eventCode}`}
        >
          <Button className="mb-4 bg-tba-blue text-white">
            View Event on The Blue Alliance
          </Button>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${statboticsEventBasePath}${event.eventCode}`}
        >
          <Button className="mb-4 bg-tba-blue text-white">
            View Event on Statbotics
          </Button>
        </a>
      </div>

      {!event.isComplete && !event.isSubmissionClosed ? (
        <Tabs
          aria-label="Tabs for Picks"
          color="primary"
          classNames={{ tabList: "mb-2" }}
        >
          <Tab key="teams" title="Teams">
            <TeamSelectionForm
              eventCode={event.eventCode}
              teams={teams}
              selectedTeams={selectedTeams}
              setSelectedTeams={setSelectedTeams}
              numTeamsSelected={numTeamsSelected}
              setNumTeamsSelected={setNumTeamsSelected}
              maxNumTeams={numTeams}
              areTeamsLoading={areTeamsLoading}
              getTeamsForEvent={() =>
                getTeamsForEvent(event.eventCode, setAreTeamsLoading).then(
                  (result) => setTeams(result)
                )
              }
            />
          </Tab>
          <Tab key="categories" title="Categories">
            <CategorySelectionForm
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              numCategoriesSelected={numCategoriesSelected}
              setNumCategoriesSelected={setNumCategoriesSelected}
              maxNumCategories={numCategories}
            />
          </Tab>
          <Tab key="submit" title="Submit">
            <PickSubmissionForm
              teams={teams}
              selectedTeams={selectedTeams}
              selectedCategories={selectedCategories}
              numTeamsSelected={numTeamsSelected}
              maxNumTeams={numTeams}
              numCategoriesSelected={numCategoriesSelected}
              maxNumCategories={numCategories}
              userId={userId}
              userFullname={userFullname}
              eventName={event.name}
              eventCode={event.eventCode}
              displayName={displayName}
              setDisplayName={setDisplayName}
              isComplete={event.isComplete}
              isSubmissionClosed={event.isSubmissionClosed}
            />
          </Tab>
        </Tabs>
      ) : (
        <PickSubmissionForm
          teams={teams}
          selectedTeams={selectedTeams}
          selectedCategories={selectedCategories}
          numTeamsSelected={numTeamsSelected}
          maxNumTeams={numTeams}
          numCategoriesSelected={numCategoriesSelected}
          maxNumCategories={numCategories}
          userId={userId}
          userFullname={userFullname}
          eventName={event.name}
          eventCode={event.eventCode}
          displayName={displayName}
          setDisplayName={setDisplayName}
          isComplete={event.isComplete}
          isSubmissionClosed={event.isSubmissionClosed}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  if (!user.privateMetadata.approved) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  // Get and return the event from the DB
  const { eventCode } = context.query;
  const event = await prisma.event.findUnique({
    where: {
      eventCode: eventCode,
    },
  });
  // Determine if the user has already picked for this event
  const pick = await prisma.pick.findUnique({
    where: {
      userId_eventId: {
        userId: userId,
        eventId: parseInt(event.id),
      },
    },
  });

  const teamsResult = await fetch(
    `${tbaEndpoint}/event/${eventCode}/teams/simple`,
    {
      method: "GET",
      headers: {
        "X-TBA-Auth-Key": process.env.TBA_READ_KEY,
      },
    }
  );

  let teamsFetched = [];
  if (teamsResult.ok) teamsFetched = await teamsResult.json();

  let teams = [];
  for (const team of teamsFetched) {
    teams.push({ name: team.nickname, number: team.team_number });
  }

  const sortedTeams = teams.sort((a, b) => {
    return a.number > b.number ? 1 : -1;
  });

  if (!pick) {
    return {
      props: {
        event: event,
        userId: userId,
        userFullname: user.firstName + " " + user.lastName,
        displayName: "",
        teams: sortedTeams,
        teamsSelected: [],
        numTeamsSelected: 0,
        categoriesSelected: [],
        numCategoriesSelected: 0,
      },
    };
  }

  const answers = await JSON.parse(pick.answersJSON);
  const _teams = answers.teams;
  const _categories = answers.categories;
  let _teamsIdx = 0;
  let teamsSelected = [];

  for (let i = 0; i < sortedTeams.length; i++) {
    if (parseInt(sortedTeams[i].number) === parseInt(_teams[_teamsIdx])) {
      teamsSelected.push(true);
      _teamsIdx += 1;
    } else {
      teamsSelected.push(false);
    }
  }

  let _categoriesIndex = 0;
  let categoriesSelected = [];
  for (let i = 0; i < categoryOptions.length; i++) {
    if (categoryOptions[i] === _categories[_categoriesIndex]) {
      categoriesSelected.push(true);
      _categoriesIndex += 1;
    } else {
      categoriesSelected.push(false);
    }
  }

  return {
    props: {
      event: event,
      userId: userId,
      userFullname: user.firstName + " " + user.lastName,
      displayName: pick.displayName,
      teams: teams,
      teamsSelected: teamsSelected,
      numTeamsSelected: _teams.length,
      categoriesSelected: categoriesSelected,
      numCategoriesSelected: _categories.length,
    },
  };
}

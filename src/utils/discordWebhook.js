import { discordWebhookUrl, testDiscordWebhookUrl } from "@/constants";
import moment from "moment";

const sendDiscordMessage = async (embed) => {
  const body = {
    content: "🚨@here🚨",
    embeds: [embed],
  };

  await fetch(testDiscordWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const generateEventSubmissionsOpenMessage = (eventName) => {
  const embed = {
    title: `${eventName} is now open for picks!`,
    description:
      "Login to Samosa Stats and submit your picks!\n\n[samosastats.com](https://samosastats.com)",
    color: "6316287",
  };
  sendDiscordMessage(embed);
};

export const sendEventSubmissionReminder = (eventName, eventStartDate) => {
  const embed = {
    title: `Reminder to submit your picks for the ${eventName}!`,
    description: `Login to Samosa Stats and submit your picks!\n\nSubmissions will close at 11:59pm on ${moment(
      eventStartDate
    )
      .add(1, "day")
      .format("MMMM Do")}.\n\n[samosastats.com](https://samosastats.com)`,
    color: "6316287",
  };
  sendDiscordMessage(embed);
};

export default sendDiscordMessage;

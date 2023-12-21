import { discordWebhookUrl, testDiscordWebhookUrl } from '@/constants';

const sendDiscordMessage = async (embed) => {
  const body = {
    content: '🚨@here🚨',
    embeds: [embed],
  };

  await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export const generateEventSubmissionsOpenMessage = (eventName) => {
  const embed = {
    title: `${eventName} is now open for picks!`,
    description:
      'Login to Samosa Stats and submit your picks!\n\n[samosastats.com](https://samosastats.com)',
    color: '6316287',
  };
  sendDiscordMessage(embed);
};

export default sendDiscordMessage;

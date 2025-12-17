require('dotenv').config();

async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    console.log('Successfully installed global commands');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Command Definitions
const PEROLA_COMMAND = {
  name: 'perola',
  description: 'Adicionar uma nova pérola',
  options: [
    {
      type: 3, // STRING
      name: 'amigo',
      description: 'Quem falou essa pérola? (ex: @usuario ou nome)',
      required: true,
    },
    {
      type: 3, // STRING
      name: 'conteudo',
      description: 'O que foi dito?',
      required: true,
    },
  ],
  type: 1,
};

const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, PEROLA_COMMAND];

module.exports = {
  DiscordRequest,
  InstallGlobalCommands,
  ALL_COMMANDS
};

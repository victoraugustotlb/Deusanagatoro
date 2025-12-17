require('dotenv').config();
const { InstallGlobalCommands, ALL_COMMANDS } = require('./discord-utils.js');

// Run the registration
InstallGlobalCommands(process.env.APPLICATION_ID_BOT, ALL_COMMANDS);

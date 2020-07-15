const Discord = require('discord.js');
const Config = require('config');
const CommandService = require('./command/CommandService');

const client = new Discord.Client();

const commandService = new CommandService(client, Discord, Config);

console.log('Loading environment variables from ".env"...');
require('dotenv').config();
console.log('Environment variables loaded.');

console.log('Loading commands...');
commandService.loadCommands();
commandService.registerCommandHandler();
console.log('Commands loaded.')

client.on('ready', () => {
    console.log(`Logged in as "${client.user.tag}" successfully.`);
});


client.login(process.env.BOT_TOKEN);
var commands = [];

const Colors = require('colors');

module.exports = class CommandService {  
    constructor(client, discord, config) {
        this.client = client;
        this.discord = discord;
        this.config = config;
    }

    registerCommandHandler = () => {
        let commandPrefix = this.config.get("command.prefix");
        this.client.on("message", message => {
            if(message.guild) {
                var text = message.content;
                if(text.startsWith(commandPrefix)) {
                    var args = text.substring(commandPrefix.length, text.length).split(" ");
                    
                    var executed = false;
                    this.commands.forEach(command => {
                        if(command.tag.toLowerCase() == args[0].toLowerCase()) {
                            command.handler.execute(this.discord, this.client, this.config, message, args);
                            executed = true;
                        }
                    });

                    console.log('['.white + 'COMMAND'.bgWhite.black + '] '.white + 'Got command "' + (executed ? args[0].yellow:args[0].red) + '" from user "'.white + message.author.tag.cyan + '".'.white);
                }
            }
        });
    }

    loadCommands = () => {
        this.commands = [];

        this.config.get("command.commands").forEach(commandObject => {
            try {
                var command = {
                    tag: commandObject.tag,
                    handler: require('./commands/' + commandObject.handler)
                };
                this.commands.push(command);
            } catch(e) {
                console.error(e);
            }
        });
    }
}
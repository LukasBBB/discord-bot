const url = "https://bravefm.stream.laut.fm/bravefm";
const StreamController = require('./../../music/StreamController');
const channels = [];

var controller;

module.exports.execute = (discord, client, config, message, args) => {
    if(!controller) {
        controller = new StreamController(client, config);
        controller.loadStreams();
    }
        
    switch (args[0].toLowerCase()) {
        case "join":
            if (message.member.voice.channel) {
                message.member.voice.channel.join().then(connection => {
                    message.reply('Starting playback...');
                    controller.getStreams().forEach(stream => {
                        message.channel.send('Loading stream information...', {
                            embed: stream.embed
                        }).catch(console.error);
                        connection.play(stream.broadcast);
                    });
                    channels.push(message.member.voice.channel.id)
                });
            } else {
                message.reply('You need to be in a voice channel.');
            }
            break;
        case "pause":

            break;
        case "stop":
            if (channels.includes(message.member.voice.channel.id)) {
                message.member.voice.channel.leave();
                message.reply('Playback stopped.');
            } else {
                message.reply('You need to be in a voice channel.');
            }
            break;
    }


}
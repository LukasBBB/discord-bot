const url = "https://bravefm.stream.laut.fm/bravefm";

module.exports.execute = (discord, client, config, message, args) => {
    message.channel.send('The current ping is: /ms')
        .then(msg => msg.edit('The current ping is: ' + client.ws.ping + 'ms'))
        .catch(console.error);


    if (!message.guild) return;
    if (message.member.voice.channel) {
        message.member.voice.channel.join().then(connection => {
            connection.play(url);
        });
    } else {
        message.reply('You need to be in a voice channel.');
    }
}
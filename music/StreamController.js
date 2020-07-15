const Discord = require('discord.js');
const request = require('request');

if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

module.exports = class StreamController {

    constructor(client, config) {
        this.client = client;
        this.config = config;

        this.broadcasts = [];
    }

    loadStreams = () => {
        this.config.get('music_streams').forEach(streamInfo => {
            switch (streamInfo.type.toLowerCase()) {
                case "lautfm":

                    var url = "https://api.laut.fm/station/" + streamInfo.url;
                    request(url, (err, res, body) => {
                        if (err) {
                            console.error(err);
                        } else {
                            var response = JSON.parse(body);
                            var embed = this.generateLautFMEmbed(response);
                            let bc = this.client.voice.createBroadcast();
                            var streamUrl = "https://" + streamInfo.url + ".stream.laut.fm/" + streamInfo.url
                            bc.play(streamUrl);
                            this.broadcasts.push({
                                name: streamInfo.name,
                                embed: embed,
                                broadcast: bc
                            });
                        }
                    });

                    break;
                default:
                    console.error(`Couldn't find type "${streamInfo.type}"`)
                    break;
            }
        });
    };

    getStreams = () => {
        return this.broadcasts;
    }

    generateLautFMEmbed = (info) => {
        var thirdParties = "";
        var flip = false;
        Object.keys(info.third_parties).forEach(name => {
            var thirdParty = info.third_parties[name];
            var username = thirdParty.name;
            var url = thirdParty.url;
    
            var icon = this.getIcon(name);

            thirdParties += (flip ? "\n" : "") + icon + name.substring(0, 1).toUpperCase() + name.substring(1, name.length) + ": " + (isEmptyString(url) ? formatString(username) : ("[" + formatString(username) + "](" + url + ")"));
    
            if (!flip) flip = true;
        });
    
        /*info.third_parties.forEach(thirdParty => {
            thirdParties += (flip ? ", " : "") + "[" + thirdParty.name.substring(0, 1).toUpperCase() + thirdParty.name.substring(1, thirdParty.name.length) + "](" + thirdParty.url + ")";
    
            if (!flip) flip = true;
        });*/
    
        return new Discord.MessageEmbed().setTitle(info.display_name)
            .setURL("https://laut.fm/" + info.name)
            .setColor(isEmptyString(info.color) ? "#000000" : info.color)
            .setAuthor("Playback Information", "", "https://github.com/LukasBBB/discord-bot")
            .setThumbnail(info.images.station)
            .addField("Description", formatString(info.description))
            .addField("DJs", formatString(info.djs))
            .addField("Genres", info.genres.join(", "))
            .addField("Third parties", thirdParties);
    };
    
    getIcon = (name) => {
        var icont = "";
        this.config.get("social_icons").forEach(icon => {
            if (icon.name == name) {
                icont = icon.icon;
            } 
        });
        return icont;
    }

}



formatString = (input) => {
    return isEmptyString(input) ? "N/A" : input;
};

isEmptyString = (input) => {
    return (input == null || input == undefined || input.trim() == "");
};
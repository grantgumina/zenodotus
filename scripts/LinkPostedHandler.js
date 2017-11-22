/*
* Description:
*   <description of the scripts functionality>
*
* Dependencies:
*   "<module name>": "<module version>"
*
* Configuration:
*   LIST_OF_ENV_VARS_TO_SET
*
* Commands:
*   hubot <trigger> - <what the respond trigger does>
*   <trigger> - <what the hear trigger does>
*
* Notes:
*   <optional notes required for the script>
*
* Author:
*   <github username of the original script author>
*/

const StorageManager = require('./Utilities/StorageManager.js');
const Helpers = require('./Utilities/Helpers.js');

class LinkPostedHandler {

    constructor(robot) {
        this.robot = robot;
        let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        
        robot.hear(urlRegex, this.storeLink);
        robot.respond(/list-links/i, this.listLinks);
        robot.respond(/delete-link (.*)/i, this.deleteLink);
    }

    storeLink(msg) {
        let user = msg.user;
        let domain = msg.robot.server.domain || "shouting.online";
        let room = msg.message.room;
        let id = msg.message.id;

        let links = Helpers.extractLinks(msg.message.text);
        let tags = Helpers.extractTags(msg.message.text);

        var self = this;
        // Add tags to link
        links.forEach(function(link, index) {
            // Create new link entry if one doesn't already exist
            if (!self.robot.brain.data.links[link]) {
                self.robot.brain.data.links[link] = { tags: [] };
            }
            console.log(self.robot.brain.data.links[link].tags);
            // Iterate through the tags and add it if it doesn't exist
            tags.forEach(function(tag, index) {
                if (self.robot.brain.data.links[link].tags.indexOf(tag) == -1) {
                    self.robot.brain.data.links[link].tags.push(tag);
                }

                if (self.robot.brain.data.tags.indexOf(tag) == -1) {
                    self.robot.brain.data.tags.push(tag);
                }
            });
        });

        let deeplink = domain + '/channel/' + room + '?msg=' + id;
        msg.send('deeplink: ' + deeplink);
    }

    listLinks(msg) {
        let links = this.robot.brain.data.links;
        var linkString = "";
        let keys = Object.keys(links);
        let lastLink = keys[keys.length - 1];

        for (var link in links) {
            let linkObject = links[link];
            
            // Get tags for the link
            var tagString = "";
            let tags = linkObject.tags
            for (var tagIndex in tags) {
                let tag = tags[tagIndex];
                tagString += tag + ' ';
            }

            // Create the string
            if (link == lastLink) {
                linkString += link;
                linkString += ' [ ' + tagString + '], ';
            } else {
                linkString += link + ' [' + tagString + ']' + ', ';
            }
        }        

        msg.send('Here are the links you\'ve saved: ' + linkString);
    }

    deleteLink(msg) {
        msg.send('Link deleted');
    }
}

module.exports = function(robot) {
    return new LinkPostedHandler(robot);
}
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

function extract(regex, text) {
    // found on stackoverflow
    var foundItems = text.match(regex);
    foundItems = foundItems ? foundItems : [];
    
    foundItems.forEach(function(item, index) {
        foundItems[index] = item.trim();
    });
    
    return foundItems;
}

function extractLinks(messageText) {
    let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    // "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))" ,
    return extract(urlRegex, messageText);
}

function extractTags(messageText) {
    let tagRegex = /%([^\s][^0-9][a-z]*)/g;
    return extract(tagRegex, messageText);
}

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

        let links = extractLinks(msg.message.text);
        let tags = extractTags(msg.message.text);

        var self = this;
        // Add tags to link
        links.forEach(function(link, index) {
            // Create new link entry if one doesn't already exist
            if (!self.robot.brain.data.links[link]) {
                self.robot.brain.data.links[link] = { tags: [] };
            }
            
            // Iterate through the tags and add it if it doesn't exist
            tags.forEach(function(tag, index) {
                if (!(tag in self.robot.brain.data.links[link].tags)) {
                    self.robot.brain.data.links[link].tags.push(tag);
                }

                if (!(tag in self.robot.brain.data.tags)) {
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
            if (link == lastLink) {
                linkString += link;
            } else {
                linkString += link + ', ';
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
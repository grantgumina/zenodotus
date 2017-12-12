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

const StorageManager = require('zenodotus-storage-manager'); // PROD
// const StorageManager = require('./Utilities/StorageManager.js'); // TEST
const Constants = require('./Utilities/Constants.js');
const Helpers = require('./Utilities/Helpers.js');

class MessageHandler {

    constructor(robot) {
        this.robot = robot;
        robot.hear(Constants.TAGREGEX(), this.storeMessage);
        robot.respond(/list-links/i, this.listLinks);
    }

    storeMessage(msg) {
        let user = msg.user;
        let domain = msg.robot.server.domain || "shouting.online";
        let room = msg.message.room;
        let id = msg.message.id;
        let deeplink = domain + '/channel/' + room + '?msg=' + id;

        // Remove the tags from the message
        let body = msg.message.text.replace(Constants.TAGREGEX(), '');
        let sender = msg.message.user.name;
        let channel = msg.message.room;

        let links = Helpers.extractLinks(msg.message.text);
        let tags = Helpers.extractTags(msg.message.text);

        var self = this;

        Promise.all([StorageManager.createMessage(body, sender, channel, deeplink), 
            StorageManager.createTags(tags), 
            StorageManager.createLinks(links)])
        .then(function([messageId, tagIds, linkIds]) {
            let allTagIds = tagIds.new.concat(tagIds.old);
            
            if(allTagIds.length == 0) {
                return null;
            }

            // Create tagged-messages entries
            return StorageManager.createTaggedMessage(messageId, allTagIds).then(insertedIds => {
                return {
                    tagIds: tagIds,
                    linkIds: linkIds
                };
            });
        }).then(data => {
            if (data == null) {
                return null;
            }

            console.log(data);

            // Create tagged-links entries          
            let allLinkIds = data.linkIds.new.concat(data.linkIds.old);
            let allTagIds = data.tagIds.new.concat(data.tagIds.old);
            
            if (allLinkIds.length == 0 || allTagIds == 0) {
                return null;
            }
            
            return StorageManager.createTaggedLinks(allLinkIds, allTagIds);
        }).catch(error => {
            console.log(error);
        });

        // msg.send('deeplink: ' + deeplink);
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
}

module.exports = function(robot) {
    return new MessageHandler(robot);
}
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

class TagHandler {

    constructor(robot) {
        this.robot = robot;
        robot.brain.data.tags = [];
        robot.brain.data.links = {};
        robot.respond(/tag-link (.*) (.*)/i, this.tagLink);
        robot.respond(/create-tag (.*)/i, this.createTag);
        robot.respond(/delete-tag (.*)/i, this.deleteTag);
        robot.respond(/list-tags/i, this.listTags);
    }

    tagLink(msg) {
        let url = msg.match[1];
        let newTag = msg.match[2];
        let sender = msg.message.user;
        let date = new Date();
        // todo - strip down link to basic form
        
        // Check if this link is brand new
        if (!this.robot.brain.data.links[url]) {
            var newLink = {
                sender: sender,
                tags: [newTag],
                date: date
            };

            this.robot.brain.data.links[url] = newLink;
        } else {
            // Check if link has already been tagged
            if (this.robot.brain.data.links[url].tags.indexOf(newTag) != -1) {
                return msg.send('Link has already been tagged with "' + newTag + '"');
            }

            // Add new tag to the existing link
            this.robot.brain.data.links[url].tags.push(newTag);
        }

        msg.send('Link tagged');        
        console.log(this.robot.brain.data.links);

    }

    createTag(msg) {
        let tagName = msg.match[1];
        let indexOfTag = this.robot.brain.data.tags.indexOf(tagName);
        if (indexOfTag != -1) {
            return msg.send('Tag "' + tagName + '" already exists.'); 
        }

        this.robot.brain.data.tags.push(tagName);
        msg.send('Tag created: ' + tagName);
    }

    deleteTag(msg) {
        let tagName = msg.match[1];
        let indexOfTag = this.robot.brain.data.tags.indexOf(tagName);

        if (indexOfTag == -1) {
            return msg.send('Tag "' + tagName + '" does not exist.');
        }

        this.robot.brain.data.tags.splice(indexOfTag, 1);
        msg.send('Tag deleted: ' + tagName);
    }

    listTags(msg) {
        let tags = this.robot.brain.data.tags;
        var tagsString = "";
        for (var i = 0; i < tags.length; i++) {
            let tag = tags[i];
            
            // Check if this is the last element of the array
            if (i == tags.length - 1 && tags.length == 1) {
                tagsString += tag;
            } else if (i == tags.length - 1) {
                tagsString += ' ' + tag;
            } else {
                tagsString += ' ' + tag + ',';
            }
        }

        msg.send('Here are the tags available:\n' + tagsString);
    }
}

module.exports = function(robot) {
    return new TagHandler(robot);
}
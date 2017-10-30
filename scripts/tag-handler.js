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
        robot.respond(/create-tag (.*)/i, this.createTag);
        robot.respond(/delete-tag (.*)/i, this.deleteTag);
        robot.respond(/list-tags/i, this.listTags);
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
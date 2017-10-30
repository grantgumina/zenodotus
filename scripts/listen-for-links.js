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

class LinkPostedHandler {

    constructor(robot) {
        this.tags = null;
        let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        
        robot.hear(urlRegex, this.respondToLink);
    }

    respondToLink(msg) {
        let user = msg.user;
        let domain = msg.robot.server.domain || "shouting.online";
        let room = msg.message.room;
        let id = msg.message.id;

        let deeplink = domain + '/channel/' + room + '?msg=' + id;
        msg.send('deeplink: ' + deeplink);
    }

    generateTagOptions(msg) {
    
    }

}

module.exports = function(robot) {
    return new LinkPostedHandler(robot);
}
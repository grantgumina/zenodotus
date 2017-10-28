/*
* Description:
*   Store all links posted into a chat into a database 
*
* Commands:
*   None
*
*/

module.exports = function(robot) {
    robot.respond(/foobar/i, function(msg) {
        msg.reply("FOOBAR");
    });
}

function ScrapeLink(robot) {
    
    let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

    robot.hear(urlRegex, (msg) => {
        msg.send('I found a link: ' + msg.match[0]);
    });
}
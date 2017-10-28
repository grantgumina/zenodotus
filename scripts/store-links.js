/*
* Description:
*   Store all links posted into a chat into a database 
*
* Commands:
*   None
*
*/

function ScrapeLink(robot) {

    var urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;

    robot.hear(urlRegex, function(msg) {
        // msg.send('I found a link: ' + msg.match[0]);
        msg.send('I found a link');
    });
}

module.exports = ScrapeLink(robot);

// module.exports = function(robot) {
//     let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
//     robot.respond(urlRegex, function(msg) {
//         msg.reply('I found a link: ' + msg.match[0]);
//     });

//     robot.hear(/foobar/i, function(msg) {

//     })
// }
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
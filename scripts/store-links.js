/*
* Description:
*   Store all links posted into a chat into a database 
*
* Commands:
*   None
*
*/

module.exports = function(robot) {
    var urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
    
    robot.hear(urlRegex, function(msg) {
        // msg.send('I found a link: ' + msg.match[0]);
        var room = msg.server.domain;
        var room = msg.message.room;
        var id = msg.message.id;

        var deeplink = 'pp__' + domain + '/channel/' + room + '?msg=' + id;
        msg.send('deeplink: ' + deeplink);
    });
}

// / https://shouting.online/channel/bot-proving-ground?msg=Z3QASsvEYD7ERDSPX
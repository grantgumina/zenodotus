/*
* Description:
*   A class that configures the Zeno bot
*
* Dependencies:
*   "hubot-redis-brain": "latest"
*   
* Author:
*   grantgumina
*/

class ZenoSetup {
    constructor(robot) {
        this.robot = robot;
        robot.brain.data.tags = [];
        robot.brain.data.links = {};
    }
}

module.exports = function(robot) {
    return new ZenoSetup(robot);
}
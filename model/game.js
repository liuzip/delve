var Role = require("./role");

var Game = function(){
    this.user = new Role({
        name: "Player",
        HP: 10,
        point: [5, 6]
    });
    this.level = new Array(5);
    this.current = 0;

    this.level[0] = new Array(3);
    for(var i = 0; i < this.level[0].length; i ++){
        this.level[0][i] = new Role({
            name: "僵尸" + i + "号",
            HP: 5,
            point: [6]
        });
    }

    this.level[1] = new Array(5);
    for(var i = 0; i < this.level[1].length; i ++){
        this.level[1][i] = new Role({
            name: "aaa" + i + "号",
            HP: 5,
            point: [6]
        });
    }
}

Game.prototype.getCurrentMonsters = function(){
    return this.level[this.current];
}

module.exports = Game;

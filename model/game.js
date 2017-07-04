const Monster = require("./monster");
const User = require("./user");
const Dice = require("./dice");

var Game = function(){
    this.user = new Array(4);
    this.level = new Array();
    this.current = 0;
    this.diceList = new Array(6);
    this.rollTimes = 1;

    for(var i = 0; i < this.diceList.length; i ++){
        this.diceList[i] = new Dice();
        this.diceList[i].roll();
    }
}

Game.prototype.getCurrentMonsters = function(){
    return this.level[((this.current > (this.level.length - 1))?(this.level.length - 1):this.current)];
}

Game.prototype.initGame = function(){
    this.user[0] = new User({
        name: "海盗",
        type: "pirate",
        HP: 6,
        point: [5, 6]
    });

    this.user[1] = new User({
        name: "小偷",
        type: "thief",
        HP: 3,
        point: [4]
    });

    this.user[2] = new User({
        name: "护士",
        type: "nurse",
        HP: 3,
        point: [3]
    });

    this.user[3] = new User({
        name: "巫师",
        type: "wizard",
        HP: 1,
        point: [1, 2]
    });


    this.level[0] = new Array(3);
    for(var i = 0; i < this.level[0].length; i ++){
        this.level[0][i] = new Monster({
            name: "僵尸" + i + "号",
            HP: 5,
            point: [6]
        });
    }

    this.level[1] = new Array(5);
    for(var i = 0; i < this.level[1].length; i ++){
        this.level[1][i] = new Monster({
            name: "aaa" + i + "号",
            HP: 5,
            point: [6]
        });
    }
}


module.exports = Game;

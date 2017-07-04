const tools = require("../util/common/tools");
const Game = require("../model/game");
const Role = require("../model/role");

var handler = {};

handler.example = function(){
    return "example";
};

handler.initGame = function(game){
    game.user[0] = new Role({
        name: "海盗",
        type: "pirate",
        HP: 6,
        point: [5, 6]
    });

    game.user[1] = new Role({
        name: "小偷",
        type: "thief",
        HP: 3,
        point: [4]
    });

    game.user[2] = new Role({
        name: "护士",
        type: "nurse",
        HP: 3,
        point: [3]
    });

    game.user[3] = new Role({
        name: "巫师",
        type: "wizard",
        HP: 1,
        point: [1, 2]
    });

    return {
        success: true
    };
};

handler.getDices = function(game){
    return {
        rollTimes: game.rollTimes,
        list: game.diceList
    };
};


handler.getUser = function(game){
    return game.user;
};

handler.rollDices = function(game, list){
    var diceList = game.diceList;
    if(game.rollTimes != 3){
        for(var i = 0; i < diceList.length; i ++){
            diceList[i].locked = false;
            for(var j = 0; j < list.length; j ++){
                if(i == list[j]){
                    diceList[i].locked = true;
                    break;
                }
            }

            diceList[i].roll();
        }

        game.rollTimes ++;
    }
    else{
        for(var i = 0; i < diceList.length; i ++){
            diceList[i].locked = false;
            for(var j = 0; j < list.length; j ++){
                if(i == list[j]){
                    diceList[i].locked = true;
                    break;
                }
            }
        }
    }

    return {
        rollTimes: game.rollTimes,
        list: game.diceList
    };
};

handler.getCurrentMonsters = function(game){
    return game.getCurrentMonsters();
};

handler.attackMonster = function(game, data){
    var list = new Array(6);
    for(var j = 0; j < list.length; j ++){
        list[j] = game.diceList[j].dump();
    }

    var user = game.user,
        monsters = game.getCurrentMonsters(),
        ret = [];

    for(var i = 0; i < user.length; i ++){
        var damanage = game.user[i].damanage(list);
        monsters[data.index].handleDamanage(damanage);

        ret.push({
            name: game.user[i].name,
            monsters: monsters[data.index].name,
            hp: monsters[data.index].currentHP,
            damanage: damanage
        })
    }

    return ret;
};

handler.attackUser = function(game, data){
    var monsters = game.getCurrentMonsters(),
        damanageList = [];

    for(var i = 0; i < monsters.length; i ++){
        if(!(monsters[i].isDied())){
            var damanage = monsters[i].damanage();
            for(var j = 0; j < game.user.length; j ++){
                if(!game.user[j].isDied()){
                    game.user[j].handleDamanage(damanage);

                    damanageList.push({
                        name: game.user[j].name,
                        monsters: monsters[i].name,
                        damanage: damanage
                    });
                    break;
                }
            }
        }
    }

    if(damanageList.length == 0){
        game.current ++;
    }

    game.rollTimes = 1;
    for(var i = 0; i < game.diceList.length; i ++){
        game.diceList[i].roll();
        game.diceList[i].locked = false;
        game.diceList[i].used = false;
    }

    return damanageList;
};


handler.generateMonsterDanamage = function(game, data){
    var monsters = game.getCurrentMonsters(),
        damanageList = [];

    for(var i = 0; i < monsters.length; i ++){
        if(!(monsters[i].isDied())){
            var damanage = monsters[i].damanage();
            for(var j = 0; j < game.user.length; j ++){
                if(!game.user[j].isDied()){
                    game.user[j].handleDamanage(damanage);

                    damanageList.push({
                        name: game.user[j].name,
                        monsters: monsters[i].name,
                        damanage: damanage
                    });
                    break;
                }
            }
        }
    }

    if(damanageList.length == 0){
        game.current ++;
    }

    game.rollTimes = 1;
    for(var i = 0; i < game.diceList.length; i ++){
        game.diceList[i].roll();
        game.diceList[i].locked = false;
        game.diceList[i].used = false;
    }

    return damanageList;
};

module.exports = handler;

const tools = require("../util/common/tools");

var handler = {};

handler.example = function(){
    return "example";
};

handler.getDices = function(game){
    return {
        rollTimes: game.user.rollTimes,
        diceList: game.user.diceList
    };
};

handler.getUser = function(game){
    return game.user;
};

handler.rollDices = function(game, list){
    var diceList = game.user.diceList;
    if(game.user.rollTimes != 3){
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

        game.user.rollTimes ++;
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
        rollTimes: game.user.rollTimes,
        diceList: game.user.diceList
    };
};

handler.getCurrentMonsters = function(game){
    return game.getCurrentMonsters();
};

handler.attackMonster = function(game, data){
    var list = new Array(6);
    for(var j = 0; j < list.length; j ++){
        list[j] = game.user.diceList[j].dump();
    }

    var damanage = game.user.damanage(list),
        monsters = game.getCurrentMonsters();

    monsters[data.index].handleDamanage(damanage);

    return {
        name: game.user.name,
        monsters: monsters[data.index].name,
        hp: monsters[data.index].currentHP,
        damanage: damanage
    }
};

handler.attackUser = function(game){
    var monsters = game.getCurrentMonsters(),
        damanageList = [];

    for(var i = 0; i < monsters.length; i ++){
        if(!(monsters[i].isDied())){
            for(var j = 0; j < monsters[i].diceList.length; j ++){
                monsters[i].diceList[j].roll();
            }
            var list = new Array(6),
                damanage = 0;
            for(var j = 0; j < list.length; j ++){
                list[j] = monsters[i].diceList[j].dump();
            }

            damanage = monsters[i].damanage(list);
            game.user.handleDamanage(damanage);

            damanageList.push({
                name: game.user.name,
                monsters: monsters[i].name,
                damanage: damanage
            });
        }
    }

    if(damanageList.length == 0){
        game.current ++;
    }

    game.user.rollTimes = 1;
    for(var i = 0; i < game.user.diceList.length; i ++){
        game.user.diceList[i].roll();
        game.user.diceList[i].locked = false;
        game.user.diceList[i].used = false;
    }

    return damanageList;
};

module.exports = handler;

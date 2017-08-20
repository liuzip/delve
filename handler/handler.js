const tools = require("../util/common/tools");
const Game = require("../model/game");

var handler = {};

handler.example = function(){
    return "example";
};

handler.initGame = function(game){
    game.initGame();

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
        var damage = game.user[i].damage(list);
        monsters[data.index].handleDamage(damage);

        ret.push({
            name: game.user[i].name,
            monsters: monsters[data.index].name,
            hp: monsters[data.index].currentHP,
            damage: damage
        })
    }

    return ret;
};

handler.generateMonsterDamage = function(game){
    var monsters = game.getCurrentMonsters(),
        damage = 0;

    for(var i = 0; i < monsters.length; i ++){
        damage += monsters[i].generateDanamage();
    }

    return {
        damage: damage
    };
};

handler.getAvailableSkills = function(game){
    var list = new Array(6);
    for(var j = 0; j < list.length; j ++){
        list[j] = game.diceList[j].dump();
    }

    var user = game.user,
        monsters = game.getCurrentMonsters(),
        ret = [];

    for(var i = 0; i < user.length; i ++){
        if(user[i].isDied()){
            continue;
        }

        for(var j = 0; j < user[i].skills.length; j ++){
            var damage = user[i].skills[j].checkAvailable(list);
            if(damage.points > 0){
                ret.push({
                    user: user[i].name,
                    skill: user[i].skills[j].name,
                    description: user[i].skills[j].description,
                    damage: damage
                })
            }
        }
    }

    return ret;
}

handler.userHandleDamage = function(game, data){
    var damageList = [],
        monsters = game.getCurrentMonsters(),
        oneAlived = false;

    for(var i = 0; i < data.length; i ++){
        for(var j = 0; j < game.user.length; j ++){
            if(game.user[j].type == data[i].type){
                game.user[j].handleDamage(data[i].damage);

                damageList.push({
                    name: game.user[j].name,
                    damage: data[i].damage
                });
                break;
            }
        }
    }

    for(var i = 0; i < monsters.length; i ++){
        if(!monsters[i].isDied()){
            oneAlived = true;
            break;
        }
    }

    if(!oneAlived){
        game.current ++;
    }

    game.rollTimes = 1;
    for(var i = 0; i < game.diceList.length; i ++){
        game.diceList[i].roll();
        game.diceList[i].locked = false;
        game.diceList[i].used = false;
    }

    return damageList;
};

module.exports = handler;

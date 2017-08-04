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

    this.user[0].addSkill({
        name: "冲锋1",
        description: "消耗1个6，造成1点伤害",
        checkAvailable: function(diceList){
            var availableFlag = false;
            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].value == 6 && diceList[i].used == false){
                    availableFlag = true;
                    break;
                }
            }

            return availableFlag;
        }
    });

    this.user[0].addSkill({
        name: "冲锋2",
        description: "消耗2个6，造成2点伤害",
        checkAvailable: function(diceList){
            var availableFlag = false,
                diceCount = 0;
            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].value == 6 && diceList[i].used == false){
                    diceCount ++;
                }
            }

            if(diceCount > 1){
                availableFlag = true;
            }

            return availableFlag;
        }
    });

    this.user[1] = new User({
        name: "小偷",
        type: "thief",
        HP: 3,
        point: [4]
    });

    this.user[1].addSkill({
        name: "偷袭",
        description: "每一个1造成1点伤害",
        checkAvailable: function(diceList){
            var availableFlag = false;
            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].value == 1 && diceList[i].used == false){
                    availableFlag = true;
                    break;
                }
            }

            return availableFlag;
        }
    });

    this.user[1].addSkill({
        name: "要害攻击",
        description: "2个加3个相同的数字（例如44555），造成第6个骰子点数的伤害",
        checkAvailable: function(diceList){
            var valueList = new Array(6),
                threeDices = false,
                twoDices = false;
            for(var i = 0; i < 6; i ++){
                valueList[i] = {
                    amount: 0,
                    seq: []
                }
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1].amount ++;
                    valueList[diceList[i].value - 1].seq.push(i);
                }
            }

            for(var i = 0; i < 6; i ++){
                if(valueList[i].amount >= 5){
                    threeDices = true;
                    twoDices = true;
                    break;
                }
                else if(valueList[i].amount >= 3){
                    threeDices = true;
                }
                else if(valueList[i].amount == 2){
                    twoDices = true;
                }
            }

            if(threeDices && twoDices){
                return true;
            }
            else{
                return false;
            }
        }
    });

    this.user[2] = new User({
        name: "护士",
        type: "nurse",
        HP: 3,
        point: [3]
    });

    this.user[2].addSkill({
        name: "次级治疗术",
        description: "4个连续数，回复2点血，可作用在不同的冒险者身上",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = false;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] = true;
                }
            }

            for(var i = 0; i < 3; i ++){
                var seqAvailable = true;
                for(var j = i; j < (i + 4); j ++){
                    if(!valueList[j]){
                        seqAvailable = false;
                        break;
                    }
                }

                if(seqAvailable){
                    return true;
                }
            }

            return false;
        }
    });

    this.user[2].addSkill({
        name: "治疗术",
        description: "5个连续数，回复第6个骰子点数的血量，可作用在不同的冒险者身上",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = false;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] = true;
                }
            }

            for(var i = 0; i < 2; i ++){
                var seqAvailable = true;
                for(var j = i; j < (i + 5); j ++){
                    if(!valueList[j]){
                        seqAvailable = false;
                        break;
                    }
                }

                if(seqAvailable){
                    return true;
                }
            }

            return false;
        }
    });

    this.user[2].addSkill({
        name: "奇迹",
        description: "6个连续数，复活所有冒险者，并满血",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = false;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] = true;
                }
            }

            var seqAvailable = true;
            for(var i = 0; i < 6; i ++){
                if(!valueList[i]){
                    seqAvailable = false;
                    break;
                }
            }

            if(seqAvailable){
                return true;
            }

            return false;
        }
    });

    this.user[3] = new User({
        name: "巫师",
        type: "wizard",
        HP: 1,
        point: [1, 2]
    });

    this.user[3].addSkill({
        name: "冰冻射线",
        description: "3个相同数，本回合，怪物少掷2个骰子",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = 0;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] ++;
                }
            }

            for(var i = 0; i < 6; i ++){
                if(valueList[i] >= 3){
                    return true;
                }
            }

            return false;
        }
    });

    this.user[3].addSkill({
        name: "闪电链",
        description: "4个相同数，所有怪物遭受1点伤害",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = 0;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] ++;
                }
            }

            for(var i = 0; i < 6; i ++){
                if(valueList[i] >= 4){
                    return true;
                }
            }

            return false;
        }
    });

    this.user[3].addSkill({
        name: "火球术",
        description: "5个相同数，造成6点伤害，可以作用在不同的怪物身上",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = 0;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] ++;
                }
            }

            for(var i = 0; i < 6; i ++){
                if(valueList[i] >= 5){
                    return true;
                }
            }

            return false;
        }
    });

    this.user[3].addSkill({
        name: "即死",
        description: "6个相同数，杀死本场战斗中的所有怪物",
        checkAvailable: function(diceList){
            var valueList = new Array(6);

            for(var i = 0; i < 6; i ++){
                valueList[i] = 0;
            }

            for(var i = 0; i < diceList.length; i ++){
                if(diceList[i].used == false){
                    valueList[diceList[i].value - 1] ++;
                }
            }

            for(var i = 0; i < 6; i ++){
                if(valueList[i] >= 6){
                    return true;
                }
            }

            return false;
        }
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

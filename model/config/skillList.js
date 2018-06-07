var skillList = {
    // 如果有指定骰子个数，且为指定点数个骰子，造成指定骰子个数的伤害
    specificNumWithCount: function(opt){
        this.targetCount = opt.count;
        this.targetNum = opt.num;
    },
    // 如果有指定点数，造成指定点数的骰子个数伤害
    specificNumWithoutCount: function(opt){
        this.targetNum = opt.num;
    },
    // 如果形如指定格式的骰子布局，例如aabb，则造成剩余骰子点数总和的伤害
    aabbDamage: function(opt){
        this.aabbCountList = opt.list.sort(function(a, b){return b - a;});
    },
    // 如果连续若干数，则造成指定的治疗
    sequenceAndCure: function(opt){
        this.seqCount = opt.count;
        // 大于0则为指定的值，小于0为剩余骰子点数和，等于0则为全部复活并满血
        this.cure = opt.curePoint;
    }
}

var makeDamage = function(diceList, target){
    // 如果能够造成伤害，并且提供的对象
    if(typeof target != "undefined" && damage.points > 0){
        for(var i = 0; i < damage.dices.length; i ++){
            diceList[damage.dices[i]].used = true;
        }

        target.currentHP -= diceList.points;
    }
}

var cureTarget = function(diceList, target){

}

skillList.aabbDamage.prototype.checkAvailable = function(diceList, target){
    var diceLength = diceList.length,
        list = new Array(),
        valueList = new Array(6),
        availableFlag = true,
        damage = {
            points: 0,
            forMonster: true,
            dices: []
        };

    // 获得要求aabb要求的骰子数总和
    for(var i = 0; i < this.aabbCountList.length; i ++){
        list.push({
            count: this.aabbCountList[i],
            used: false
        })
    }

    for(var i = 0; i < valueList.length; i ++){
        valueList[i] = {
            points: (i + 1),
            amount: 0, // 实际上，该点数有多少个骰子
            left: 0, // 经过计算，扣除消耗后剩余多少个骰子
            seq: []
        }
    }

    for(var i = 0; i < diceList.length; i ++){
        if(diceList[i].used == false){
            valueList[diceList[i].value - 1].amount ++;
            valueList[diceList[i].value - 1].left ++;
            valueList[diceList[i].value - 1].seq.push(i);
        }
    }

    for(var i = 0; i < list.length; i ++){
        for(var j = 0; j < list.length; j ++){
            if(list[j].used == false){
                for(var k = 0; k < valueList.length; k ++){
                    // 如果当前点数可以消耗要求的骰子，则先消耗掉
                    if(valueList[k].left >= list[j].count && list[j].used == false){
                        valueList[k].left -= list[j].count; // 该点数下，消耗了指定骰子数
                        list[j].used = true;
                    }
                }
            }
        }
    }

    // 确保所有格式都已经检查过，并且为true
    for(var i = 0; i < list.length; i ++){
        if(list[i].used == false){
            availableFlag = false;
            break;
        }
    }

    // 计算伤害值
    if(availableFlag){
        for(var i = 0; i < valueList.length; i ++){
            // 计算未消耗的点数和
            damage.points += valueList[i].points * valueList[i].left;
            // 记录被消耗了骰子的序号
            damage.dices = damage.dices.concat(valueList[i].seq.splice(0, (valueList[i].amount - valueList[i].left)));
        }
    }

    makeDamage(diceList, target);

    return damage;
}

skillList.specificNumWithCount.prototype.checkAvailable = function(diceList, target){
    var damage = {
        points: 0,
        forMonster: true,
        dices: []
    };
    for(var i = 0; i < diceList.length; i ++){
        if(diceList[i].value == this.targetNum && diceList[i].used == false && damage.dices.length < this.targetCount){
            damage.dices.push(i);
        }
    }

    if(damage.dices.length > 1){
        damage.points = this.targetCount;
    }

    makeDamage(diceList, target);

    return damage;
}

skillList.specificNumWithoutCount.prototype.checkAvailable = function(diceList, target){
    var damage = {
        points: 0,
        forMonster: true,
        dices: []
    };
    for(var i = 0; i < diceList.length; i ++){
        if(diceList[i].value == this.targetNum && diceList[i].used == false){
            damage.points ++;
            damage.dices.push(i);
        }
    }

    makeDamage(diceList, target);

    return damage;
}

skillList.sequenceAndCure.prototype.checkAvailable = function(diceList, target){
    var curePoints = {
            points: 0,
            forMonster: false,
            dices: []
        },
        sequenceAvailable = true,
        valueList = new Array(6);

    for(var i = 0; i < valueList.length; i ++){
        valueList[i] = {
            points: (i + 1),
            amount: 0, // 该点数有多少个骰子
            seq: []
        }
    }

    for(var i = 0; i < diceList.length; i ++){
        if(diceList[i].used == false){
            valueList[diceList[i].value - 1].amount ++;
            valueList[diceList[i].value - 1].seq.push(i);
        }
    }

    for(var i = 0; i < (6 - this.seqCount + 1); i ++){
        for(var k = i; k < (i + this.seqCount); k ++){
            if(valueList[i].amount == 0){
                sequenceAvailable = false;
                break;
            }
        }

        if(sequenceAvailable){
            break;
        }
    }

    return curePoints;
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = skillList;
}

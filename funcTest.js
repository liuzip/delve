var checkAvailable = function(diceList, aabbCountList){
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
    for(var i = 0; i < aabbCountList.length; i ++){
        list.push({
            count: aabbCountList[i],
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
    console.log(valueList)

    for(var i = 0; i < list.length; i ++){
        for(var j = 0; j < list.length; j ++){
            if(list[j].used == false){
                for(var k = 0; k < valueList.length; k ++){
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

    console.log(valueList)

    return damage;
}


var diceList = [
    {
        value: 1,
        used: false
    },
    {
        value: 2,
        used: false
    },
    {
        value: 1,
        used: false
    },
    {
        value: 1,
        used: false
    },
    {
        value: 1,
        used: false
    },
    {
        value: 1,
        used: false
    },
    {
        value: 1,
        used: false
    }
],
aabbCountList = [1, 4]


console.log(checkAvailable(diceList, aabbCountList))

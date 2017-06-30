/*
var me = new Role({
        name: "Player",
        HP: 10,
        point: [5, 6]
    }),
    monster = new Array(3),
    leftRollTimes = 3,
    userDices = new Array(6),
    logAppend = function(text){
        $("#logArea").append(text + "</br>");
        document.getElementById('logArea').scrollTop = document.getElementById('logArea').scrollHeight;
    },
    updateLock = function(){
        for(var i = 0; i < userDices.length; i ++){
            if(userDices[i].locked){
                $("#dice" + (i + 1)).append("<img class='lock' src='assets/img/lock.png'>");
            }
            else{
                $("#dice" + (i + 1)).find(".lock").remove();
            }
        }
    },
    rollDice = function(){
        if(leftRollTimes == 0){
            return;
        }
        else{
            leftRollTimes --;
            $("#leftRollTimes").text(leftRollTimes);
        }

        for(var i = 0; i < userDices.length; i ++){
            userDices[i].roll();
            $("#dice" + (i + 1) + " img").attr("src", "assets/img/dice" + userDices[i].value + ".png");
        }

        updateLock();
    };

$("#myName").text(me.name);
$("#myHP").text("HP: " + me.currentHP);

logAppend("初始化中...");
logAppend("初始化完毕！");

for(var i = 0; i < userDices.length; i ++){
    userDices[i] = new Dice();
}


var updateMonsterList = function(monster){
    var monsterNameTR = $("<tr></tr>"),
        monsterHPTR = $("<tr></tr>");

    for(var i = 0; i < monster.length; i ++){
        var monsterNameTD = $("<td index='" + i + "'>" + monster[i].name + "</td>"),
            monsterHPTD = $("<td index='" + i + "'>" + monster[i].currentHP + "/" + monster[i].maxHP + "</td>"),
            clickHandler = function(){
                var index = parseInt($(this).attr("index")),
                    list = new Array(6);
                for(var j = 0; j < list.length; j ++){
                    list[j] = userDices[j].dump();
                }

                var damanage = me.damanage(list);

                monster[index].handleDamanage(damanage);
                logAppend(me.name + "对" + monster[index].name + "造成了" + damanage + "点伤害");

                for(var j = 0; j < userDices.length; j ++){
                    userDices[j].locked = false;
                }
                leftRollTimes = 3;
                rollDice();

                if(monster[index].isDied()){
                    logAppend(monster[index].name + "挂了");
                }

                for(var m = 0; m < monster.length; m ++){
                    for(var j = 0; j < list.length; j ++){
                        list[j] = new Dice();
                        list[j].roll();
                    }

                    if(!monster[m].isDied()){
                        var damanage = monster[m].damanage(list);

                        me.handleDamanage(damanage);
                        logAppend(monster[m].name + "对" + me.name + "造成了" + damanage + "点伤害");
                    }

                    if(me.isDied()){
                        logAppend(me.name + "挂了");
                    }

                    $("#myName").text(me.name);
                    $("#myHP").text("HP: " + me.currentHP);
                }
                
                updateMonsterList(monster);
            };

        if(monster[i].isDied()){
            monsterNameTD.css("backgroundImage", "url(assets/img/dead.png)");
        }

        monsterNameTD.click(clickHandler);
        monsterHPTD.click(clickHandler);

        monsterNameTR.append(monsterNameTD);
        monsterHPTR.append(monsterHPTD);
    }

    $(".monsterDetailZone").html(monsterNameTR);
    $(".monsterDetailZone").append(monsterHPTR);
}

for(var i = 0; i < monster.length; i ++){
    monster[i] = new Role({
        name: "僵尸" + i + "号",
        HP: 5,
        point: [6]
    });
}
updateMonsterList(monster);

$(".diceDiv").each(function(){
    $(this).click(function(){
        var index = parseInt($(this).attr("id").split("")[4]) - 1;
        userDices[index].locked = !(userDices[index].locked);
        updateLock();
    });
});

rollDice();

$("#roll").click(function(){
    rollDice();
});
*/

(function(){
    if(connector == undefined || connector.connected == false){
        setTimeout(arguments.callee, 100);
        return;
    }

    var user = {},
        monsters = [],
        logAppend = function(text){
            $("#logArea").append(text + "</br>");
            document.getElementById('logArea').scrollTop = document.getElementById('logArea').scrollHeight;
        },
        updateDices = function(diceList){
            for(var i = 0; i < diceList.length; i ++){
                $("#dice" + (i + 1) + " img").attr("src", "assets/img/dice" + diceList[i].value + ".png");
                if(diceList[i].locked){
                    $("#dice" + (i + 1)).append("<img class='lock' src='assets/img/lock.png'>");
                }
                else{
                    $("#dice" + (i + 1)).find(".lock").remove();
                }
            }
        },
        updateMonsterList = function(monsters, user){
            var monsterNameTR = $("<tr></tr>"),
                monsterHPTR = $("<tr></tr>"),
                attackMonster = function(param){
                    var dtd = $.Deferred(); 
                    connector.sendMsg("attackMonster", param, function(data){
                        logAppend(data.name + "对" + data.monsters + "造成了" + data.damanage + "点伤害");
                        if(data.hp <= 0){
                            logAppend(data.monsters + "挂了");
                        }
                        dtd.resolve();
                    });
                    return dtd.promise();
                };

            for(var i = 0; i < monsters.length; i ++){
                var monsterNameTD = $("<td index='" + i + "'>" + monsters[i].name + "</td>"),
                    monsterHPTD = $("<td index='" + i + "'>" + monsters[i].currentHP + "/" + monsters[i].maxHP + "</td>"),
                    clickHandler = function(){
                        var index = parseInt($(this).attr("index"));

                        $.when(attackMonster({
                            index: index
                        })).done(function(){
                            connector.sendMsg("attackUser", function(list){
                                for(var i = 0; i < list.length; i ++){
                                    logAppend(list[i].monsters + "对" + list[i].name + "造成了" + list[i].damanage + "点伤害");
                                }

                                updateAllState();
                            });
                        });
                    };

                if(monsters[i].currentHP <= 0){
                    monsterNameTD.css("backgroundImage", "url(assets/img/dead.png)");
                }

                monsterNameTD.click(clickHandler);
                monsterHPTD.click(clickHandler);

                monsterNameTR.append(monsterNameTD);
                monsterHPTR.append(monsterHPTD);
            }

            $(".monsterDetailZone").html(monsterNameTR);
            $(".monsterDetailZone").append(monsterHPTR);
        },
        updateUser = function(){
            var dtd = $.Deferred(); 
            connector.sendMsg("getUser", function(data){
                user = data;
                $("#myName").text(user.name);
                $("#myHP").text("HP: " + user.currentHP);
                $("#leftRollTimes").text(3 - user.rollTimes);
                updateDices(user.diceList);
                dtd.resolve();
            });
            return dtd.promise();
        },
        updateAllState = function(){
            $.when(updateUser()).done(function(){
                connector.sendMsg("getCurrentMonsters", function(data){
                    monsters = data;
                    updateMonsterList(monsters, user);
                });
            });
        };

    logAppend("初始化中...");
    logAppend("初始化完毕！");

    updateAllState();

    $(".diceDiv").each(function(){
        $(this).click(function(){
            var index = parseInt($(this).attr("id").split("")[4]) - 1;
            user.diceList[index].locked = !(user.diceList[index].locked);
            updateDices(user.diceList);
        });
    });

    $("#roll").click(function(){
        var lockedList = [];
        for(var i = 0; i < user.diceList.length; i ++){
            if(user.diceList[i].locked){
                lockedList.push(i);
            }
        }
        connector.sendMsg("rollDices", lockedList, function(data){
            user.diceList = data.diceList;
            $("#leftRollTimes").text(3 - data.rollTimes);
            updateDices(data.diceList);
        });
    });
})();

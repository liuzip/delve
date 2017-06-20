var me = new Player({
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
                $("#dice" + (i + 1)).append("<img class='lock' src='img/lock.png'>");
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
            $("#dice" + (i + 1) + " img").attr("src", "img/dice" + userDices[i].value + ".png");
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
            monsterNameTD.css("backgroundImage", "url(img/dead.png)");
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
    monster[i] = new Player({
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


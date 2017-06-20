var me = new Player({
        name: "Player",
        HP: 10,
        point: [5, 6]
    }),
    monster = new Player({
        name: "哥布林",
        HP: 5,
        point: [6]
    }),
    leftRollTimes = 3,
    userDices = new Array(6),
    logAppend = function(text){
        $("#logArea").append(text + "</br>");
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
    }

$("#myName").text(me.name);
$("#myHP").text("HP: " + me.currentHP);

$("#monsterName").text(monster.name);
$("#monsterHP").text("HP: " + monster.currentHP);

logAppend("初始化中...");
logAppend("初始化完毕！");

for(var i = 0; i < userDices.length; i ++){
    userDices[i] = new Dice();
}

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

$("#attack").click(function(){
    var list = new Array(6);
    for(var i = 0; i < list.length; i ++){
        list[i] = userDices[i].dump();
    }

    var damanage = me.damanage(list);

    monster.handleDamanage(damanage);
    logAppend(me.name + "对" + monster.name + "造成了" + damanage + "点伤害");

    for(var i = 0; i < userDices.length; i ++){
        userDices[i].locked = false;
    }
    leftRollTimes = 3;
    rollDice();

    if(monster.isDied()){
        logAppend(monster.name + "挂了");
    }

    $("#monsterName").text(monster.name);
    $("#monsterHP").text("HP: " + monster.currentHP);

    for(var i = 0; i < list.length; i ++){
        list[i] = new Dice();
        list[i].roll();
    }

    var damanage = monster.damanage(list);

    me.handleDamanage(damanage);
    logAppend(monster.name + "对" + me.name + "造成了" + damanage + "点伤害");

    if(me.isDied()){
        logAppend(me.name + "挂了");
    }

    $("#myName").text(me.name);
    $("#myHP").text("HP: " + me.currentHP);
});

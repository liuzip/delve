var me = new Player({
    name: "Player",
    HP: 10,
    point: [5, 6]
});


var monster = new Player({
    name: "哥布林",
    HP: 5,
    point: [6]
});

$("#myName").text(me.name);
$("#myHP").text("HP: " + me.currentHP);

$("#monsterName").text(monster.name);
$("#monsterHP").text("HP: " + monster.currentHP);

var logAppend = function(text){
    $("#logArea").append(text + "</br>");
}

logAppend("初始化中...");
logAppend("初始化完毕！");

$("#attack").click(function(){
    var list = new Array(6);
    for(var i = 0; i < list.length; i ++){
        list[i] = new Dice();
        list[i].roll();
    }

    var damanage = me.damanage(list);

    monster.handleDamanage(damanage);
    logAppend(me.name + "对" + monster.name + "造成了" + damanage + "点伤害");

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

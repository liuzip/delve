(function(){
    if(connector == undefined || connector.connected == false){
        setTimeout(arguments.callee, 100);
        return;
    }

    var gUsers = [],
        gMonsters = [],
        gDices = {},
        logAppend = function(text){
            $("#logArea").append(text + "</br>");
            document.getElementById('logArea').scrollTop = document.getElementById('logArea').scrollHeight;
        },
        updateDices = function(diceList){
            var setListToHTML = function(diceList){
                for(var i = 0; i < diceList.list.length; i ++){
                    $("#dice" + (i + 1) + " img").attr("src", "assets/img/dice" + diceList.list[i].value + ".png");
                    if(diceList.list[i].locked){
                        $("#dice" + (i + 1)).append("<img class='lock' src='assets/img/lock.png'>");
                    }
                    else{
                        $("#dice" + (i + 1)).find(".lock").remove();
                    }
                }

                $("#leftRollTimes").text(3 - diceList.rollTimes);
            }

            if(diceList == undefined){
                var dtd = $.Deferred();
                connector.sendMsg("getDices", function(data){
                    gDices = data;
                    setListToHTML(gDices);
                    dtd.resolve();
                });
                return dtd.promise();
            }
            else{
                setListToHTML(diceList);
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
                gUsers = data;
                for(var i = 0; i < gUsers.length; i ++){
                    $("#" + gUsers[i].type + "Name").text(gUsers[i].name);
                    $("#" + gUsers[i].type + "HP").text(gUsers[i].currentHP + "HP");
                }
                
                dtd.resolve();
            });
            return dtd.promise();
        },
        updateAllState = function(){
            $.when(updateUser(),
                updateDices()).done(function(){
                connector.sendMsg("getCurrentMonsters", function(data){
                    gMonsters = data;
                    updateMonsterList(gMonsters, gUsers);
                });
            });
        };

    logAppend("初始化中...");

    connector.sendMsg("initGame", function(data){
        logAppend("初始化完毕！");
        updateAllState();
    });
    

    $(".diceDiv").each(function(){
        $(this).click(function(){
            var index = parseInt($(this).attr("id").split("")[4]) - 1;
            gDices.list[index].locked = !(gDices.list[index].locked);
            updateDices(gDices);
        });
    });

    $("#roll").click(function(){
        var lockedList = [];
        for(var i = 0; i < gDices.list.length; i ++){
            if(gDices.list[i].locked){
                lockedList.push(i);
            }
        }
        connector.sendMsg("rollDices", lockedList, function(data){
            gDices = data;
            updateDices(gDices);
        });
    });
})();

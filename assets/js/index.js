(function(){
    if(connector == undefined || connector.connected == false){
        setTimeout(arguments.callee, 100);
        return;
    }

    var gUsers = [],
        gMonsters = [],
        gDices = {},
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
                monsterHPTR = $("<tr></tr>");

            for(var i = 0; i < monsters.length; i ++){
                var monsterNameTD = $("<td index='" + i + "'>" + monsters[i].name + "</td>"),
                    monsterHPTD = $("<td index='" + i + "'>" + monsters[i].currentHP + "/" + monsters[i].maxHP + "</td>");

                if(monsters[i].currentHP <= 0){
                    monsterNameTD.css("backgroundImage", "url(assets/img/dead.png)");
                }

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
        },
        userAvailableSkills = function(){
            var dtd = $.Deferred();
            connector.sendMsg("userAvailableSkills", function(data){
                var table = $("<table></table>");
                for(var i = 0; i < data.length; i ++){
                    var tr = $("<tr>" +
                        "<td style='width: 10%; text-align: center;'><input type='radio' name='chooseUserSkills'></td>" +
                        "<td style='width: 15%; text-align: center;'>" + data[i].user + "</td>" +
                        "<td>" + data[i].description + "</td>" +
                        "</tr>");
                    tr.click(function(){
                        table.find("input[type=radio]").each(function(){$(this).prop("checked", false);});
                        $(this).find("input[type=radio]").prop("checked", true);
                    });

                    if(i == 0){
                        tr.find("input[type=radio]").prop("checked", true);
                    }
                    table.append(tr)
                }

                dialog({content: table})
                dtd.resolve();
            });
            return dtd.promise();
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

    $("#attack").click(function(){
        
        userAvailableSkills();
/*
                attackMonster = function(param){
                    var dtd = $.Deferred(); 
                    connector.sendMsg("attackMonster", param, function(data){
                        for(var i = 0; i < data.length; i ++){
                            logAppend(data[i].name + "对" + data[i].monsters + "造成了" + data[i].damage + "点伤害");
                            if(data[i].hp <= 0){
                                logAppend(data[i].monsters + "挂了");
                            }
                        }
                        dtd.resolve();
                    });
                    return dtd.promise();
                }

                        // need choose the user's skill first

                        var index = parseInt($(this).attr("index"));

                        $.when(attackMonster({
                            index: index
                        })).done(function(){
                            connector.sendMsg("generateMonsterDamage", function(data){
                                var userTbl = $("<table id='handleMonsterDamage'></table>");
                                userTbl.append("<tr>" +
                                    "<td colspan = '5'>对方共造成" + data.damage + "点伤害，请选择角色来承受</td>" +
                                    "</tr>");
                                userTbl.append("<tr>" +
                                    "<td colspan = '5' tdType = 'left' left = '" + data.damage + "'>剩余" + data.damage + "点伤害</td>" +
                                    "</tr>");
                                for(var i = 0; i < gUsers.length; i ++){
                                    userTbl.append("<tr>" +
                                        "<td>" + gUsers[i].name + "</td>" +
                                        "<td>" + gUsers[i].currentHP + "HP</td>" +
                                        "<td tdType = 'minus'>-</td>" +
                                        "<td userType = '" + gUsers[i].type + "' tdType = 'result'>0</td>" +
                                        "<td tdType = 'plus'>+</td>" +
                                        "</tr>");
                                }

                                userTbl.css({
                                    width: "100%",
                                    textAlign: "center"
                                });

                                userTbl.find("td[tdType=minus]").each(function(){
                                    $(this).click(function(){
                                        var currentPoint = parseInt($(this).next().text());
                                        if(currentPoint > 0){
                                            $(this).next().text(currentPoint - 1);
                                            var left = parseInt($("#handleMonsterDamage").find("td[tdType=left]").attr("left"));
                                            $("#handleMonsterDamage").find("td[tdType=left]").attr("left", left + 1);
                                            $("#handleMonsterDamage").find("td[tdType=left]").text("剩余" + (left + 1) + "点伤害")
                                        }
                                    });
                                });

                                userTbl.find("td[tdType=plus]").each(function(){
                                    $(this).click(function(){
                                        var left = parseInt($("#handleMonsterDamage").find("td[tdType=left]").attr("left"));
                                        if(left > 0){
                                            $(this).prev().text(parseInt($(this).prev().text()) + 1);
                                            $("#handleMonsterDamage").find("td[tdType=left]").attr("left", left - 1);
                                            $("#handleMonsterDamage").find("td[tdType=left]").text("剩余" + (left - 1) + "点伤害")
                                        }
                                    });
                                });

                                dialog({
                                    content: userTbl,
                                    confirm: function(){
                                        var left = parseInt($("#handleMonsterDamage").find("td[tdType=left]").attr("left"));
                                        if(left > 0){
                                            alert("需要将伤害分配完毕!");
                                            return false;
                                        }

                                        var handleDamageList = [];
                                        $("#handleMonsterDamage").find("td[tdType=result]").each(function(){
                                            handleDamageList.push({
                                                type: $(this).attr("userType"),
                                                damage: parseInt($(this).text())
                                            });
                                        });
                                        connector.sendMsg("userHandleDamage", handleDamageList, function(list){
                                            for(var i = 0; i < list.length; i ++){
                                                logAppend(list[i].name + "受到了" + list[i].damage + "点伤害");
                                            }
                                            updateAllState();
                                        });

                                        return true;
                                    }
                                })
                            });
                        });
                        */
    });
})();

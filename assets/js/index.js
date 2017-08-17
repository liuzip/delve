(function(){
    if(connector == undefined || connector.connected == false){
        setTimeout(arguments.callee, 100);
        return;
    }

    var gData = new Vue({
        el: "#backgroundFramework",
        data: {
            monsters: [],
            users: [],
            dices: []
        },
        methods: {
            lockDice: function(e) {
                var seq = parseInt($(e.currentTarget).attr("seq"))
                this.dices.list[seq].locked = !(this.dices.list[seq].locked);
            },
            rollDice: function(){
                var lockedList = [];
                for(var i = 0; i < this.dices.list.length; i ++){
                    if(this.dices.list[i].locked){
                        lockedList.push(i);
                    }
                }
                connector.sendMsg("rollDices", lockedList, function(data){
                    for(var i = 0; i < data.list.length; i ++){
                        data.list[i].imageURL = "assets/img/dice" + data.list[i].value + ".png";
                    }
                    gData.dices = data;
                });
            }
        }
    });

    var updateAllState = function(){
        var updateDices = function(){
            var dtd = $.Deferred();
            connector.sendMsg("getDices", function(data){
                for(var i = 0; i < data.list.length; i ++){
                    data.list[i].imageURL = "assets/img/dice" + data.list[i].value + ".png";
                }
                gData.dices = data;
                dtd.resolve();
            });
            return dtd.promise();
        },
        updateUser = function(){
            var dtd = $.Deferred();
            connector.sendMsg("getUser", function(data){
                gData.users = data;
                dtd.resolve();
            });
            return dtd.promise();
        }

        $.when(updateUser(),
            updateDices()).done(function(){
            connector.sendMsg("getCurrentMonsters", function(data){
                gData.monsters = data;
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

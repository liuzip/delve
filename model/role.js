var Dice = require("./dice");

var Role = function(opt){
    this.name = opt.name;
    this.maxHP = opt.HP;
    this.currentHP = opt.HP;
    this.attackPoint = opt.point;
    this.rollTimes = 1;
    this.diceList = new Array(6);

    for(var i = 0; i < this.diceList.length; i ++){
        this.diceList[i] = new Dice();
        this.diceList[i].roll();
    }
}

Role.prototype.damanage = function(list){
    var damanage = 0;

    if(this.currentHP == 0){
        return 0;
    }

    for(var i = 0; i < list.length; i ++){
        for(var j = 0; j < this.attackPoint.length; j ++){
            if(this.attackPoint[j] == list[i].value &&
                list[i].used == false){
                list[i].used = true;
                damanage ++;
            }
        }
    }

    return damanage;
}

Role.prototype.isDied = function(){
    if(this.currentHP <= 0){
        return true;
    }
    else{
        return false;
    }
}

Role.prototype.handleDamanage = function(damanage){
    this.currentHP -= damanage;
    if(this.currentHP < 0){
        this.currentHP = 0;
    }
}


if(typeof module !== 'undefined' && module.exports){
    module.exports = Role;
}


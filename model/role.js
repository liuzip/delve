var Dice = require("./dice");

var Role = function(opt){
    this.name = opt.name;
    this.maxHP = opt.HP;
    this.currentHP = opt.HP;
    this.attackPoint = opt.point;
    this.type = opt.type;
    this.state = []; // frozen
}

Role.prototype.removeState = function(i){
    if(this.state[i] != undefined){
        this.state[i].idle --;
        if(this.state[i].idle == 0){
            this.state.splice(i, 1);
        }
    }
}

Role.prototype.damanage = function(list){
    var damanage = 0,
        frozen = false;

    if(this.currentHP == 0){
        return 0;
    }

    if(list == undefined){
        for(var i = 0; i < this.state.length; i ++){
            if(this.state[i] == "frozen"){
                frozen = true;
            }
        }

        if(frozen){
            list = new Array(4);
        }
        else{
            list = new Array(6);
        }

        for(var j = 0; j < list.length; j ++){
            list[j] = new Dice();
            list[j].roll();
        }
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


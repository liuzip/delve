var Dice = require("../common/dice");

var Monster = function(opt){
    this.name = opt.name;
    this.maxHP = opt.HP;
    this.currentHP = opt.HP;
    this.attackPoint = opt.point;
    this.type = opt.type;
    this.state = []; // frozen
    this.damanage = 0;
}

Monster.prototype.removeState = function(i){
    if(this.state[i] != undefined){
        this.state[i].idle --;
        if(this.state[i].idle == 0){
            this.state.splice(i, 1);
        }
    }
}

Monster.prototype.generateDanamage = function(){
    if(this.currentHP == 0){
        return 0;
    }

    var diceList = [],
        damage = 0;

    for(var i = 0; i < this.currentHP; i ++){
        diceList[i] = new Dice();
        diceList[i].roll();
    }

    for(var i = 0; i < this.currentHP; i ++){
        for(var j = 0; j < this.attackPoint.length; j ++){
            if(this.attackPoint[j] == diceList[i].value){
                damage ++;
            }
        }
    }

    this.damage = damage;
    return damage;
}

Monster.prototype.isDied = function(){
    if(this.currentHP <= 0){
        return true;
    }
    else{
        return false;
    }
}

Monster.prototype.handleDamage = function(damage){
    this.currentHP -= damage;
    if(this.currentHP < 0){
        this.currentHP = 0;
    }
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = Monster;
}


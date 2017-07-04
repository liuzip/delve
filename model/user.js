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

Role.prototype.damage = function(list){
    var damage = 0,
        frozen = false;

    if(this.currentHP == 0){
        return 0;
    }

    for(var i = 0; i < list.length; i ++){
        for(var j = 0; j < this.attackPoint.length; j ++){
            if(this.attackPoint[j] == list[i].value &&
                list[i].used == false){
                list[i].used = true;
                damage ++;
            }
        }
    }

    return damage;
}

Role.prototype.isDied = function(){
    if(this.currentHP <= 0){
        return true;
    }
    else{
        return false;
    }
}

Role.prototype.handleDamage = function(damage){
    this.currentHP -= damage;
    if(this.currentHP < 0){
        this.currentHP = 0;
    }
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = Role;
}

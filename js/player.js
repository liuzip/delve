var Player = function(opt){
    this.name = opt.name;
    this.maxHP = opt.HP;
    this.currentHP = opt.HP;
    this.attackPoint = opt.point;
}

Player.prototype.damanage = function(list){
    var damanage = 0;
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

Player.prototype.isDied = function(){
    if(this.currentHP <= 0){
        return true;
    }
    else{
        return false;
    }
}

Player.prototype.handleDamanage = function(damanage){
    this.currentHP -= damanage;
}

var Monster = function(opt){
    this.name = opt.name;
    this.maxHP = this.HP;
    this.currentHP = this.HP;
    this.attackPoint = this.point;
}

Monster.prototype.damanage = function(list){
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


Monster.prototype.isDied = function(){
    if(this.currentHP <= 0){
        return true;
    }
    else{
        return false;
    }
}

Monster.prototype.handleDamanage = function(damanage){
    this.currentHP -= damanage;
}


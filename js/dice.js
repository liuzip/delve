var Dice = function(){
    this.value = 1
    this.used = false;
}

Dice.prototype.roll = function(){
    this.value = Math.floor(Math.random() * 6) + 1;
}

Dice.prototype.dump = function(){
    var newDice = new this;
    return newDice;
}


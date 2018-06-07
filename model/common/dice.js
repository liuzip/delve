var Dice = function(){
    this.value = 1;
    this.used = false;
    this.locked = false;
}

Dice.prototype.roll = function(){
    if(!this.locked){
        this.value = Math.floor(Math.random() * 6) + 1;
    }
}

Dice.prototype.dump = function(){
    var newDice = {
        value: this.value,
        used: this.used
    };
    return newDice;
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = Dice;
}

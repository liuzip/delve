require("./role");

var Game = function(){
    this.user = new Role();
    this.monster = new Array(5);
    this.current = 0;
}

Game.prototype.getCurrent = function(){
    return this.monster[this.current];
}

module.exports = Game;

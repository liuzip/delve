// http://www.jianshu.com/p/551f02f95727
var Skill = function(opt){
    this.name = opt.name;
    this.description = opt.description;
    this.checkAvailable = opt.checkAvailable;
    this.makeDamage = opt.makeDamage;
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = Skill;
}


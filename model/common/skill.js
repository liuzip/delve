// http://www.jianshu.com/p/551f02f95727
var skillList = require("../config/skillList");


var Skill = function(opt){
    this.name = opt.name;
    this.description = opt.description;
    if(opt.skillName){
        this.skill = new skillList[opt.skillName](opt.skillParam);
        console.log(this.skill, opt.name, opt.skillName)
        this.checkAvailable = this.skill.checkAvailable;
        this.makeDamage = this.skill.checkAvailable;
    }
    else{
        this.checkAvailable = opt.checkAvailable;
        this.makeDamage = opt.checkAvailable;
    }
}





if(typeof module !== 'undefined' && module.exports){
    module.exports = Skill;
}


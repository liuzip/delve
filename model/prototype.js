module.exports = function(){
    if(typeof ((new Array()).ifHave) == "undefined"){
        Array.prototype.ifHave = function(cb){
            if(typeof cb != "function"){
                return false;
            }
            var val = this.filter(cb);
            return ((val.length > 0)?true:false);
        }
    }

};



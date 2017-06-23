var Tools = {};

Tools.calculateToken = function(){
    var len = 32,
        dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        maxLen = dict.length,
        token = "";
    for(var i = 0; i < len; i ++) {
        token += dict.charAt(Math.floor(Math.random() * maxLen));
    }
    return token;
}


module.exports = Tools;

var dialog = function(opt){
    if(typeof opt.content == "string" || opt.content instanceof jQuery){
        $("#dialog .content").html(opt.content);
    }
    else{
        $("#dialog .content").html(content());
    }

    $("#dialogBackground").css("display", "block");

    $("#dialogConfirm").click(function(){
        if(opt.confirm != undefined &&
            typeof opt.confirm == "function"){
            if(!opt.confirm()){
                return;
            }
        }

        $("#dialogBackground").css("display", "none");
        $(this).unbind("click");
    });

    $("#dialogCancel").click(function(){
        if(opt.cancel != undefined &&
            typeof opt.cancel == "function"){
            opt.cancel();
        }

        $("#dialogBackground").css("display", "none");
        $(this).unbind("click");
    });
}

var logAppend = function(text){
    $("#logArea").append(text + "</br>");
    document.getElementById('logArea').scrollTop = document.getElementById('logArea').scrollHeight;
}


var warnning = function(content){
    if(typeof content == "string" || content instanceof jQuery){
        $("#warnning .content").html(content);
    }
    else{
        $("#warnning .content").html(content());
    }

    $("#warnningBackground").css("display", "block");

    $("#warnningConfirm").click(function(){
        $("#warnningBackground").css("display", "none");
        $(this).unbind("click");
    });
}
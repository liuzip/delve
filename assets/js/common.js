var doDialog = function(content, clickHandler){
    if(typeof content == "string" || content instanceof jQuery){
        $("#dialog .content").html(content);
    }
    else{
        $("#dialog .content").html(content());
    }

    $("#dialogBackground").css("display", "block");

    $("#dialogConfirm").click(function(){
        if(clickHandler != undefined &&
            typeof clickHandler == "function"){
            clickHandler();
        }

        $("#dialogBackground").css("display", "none");
        $(this).unbind("click");
    });

}
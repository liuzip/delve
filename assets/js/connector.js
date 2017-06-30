window.connector = {
    connected: false,
    sendMsg: function(){},
    pools: {}
};

protobuf.load("./util/proto/packet.proto", function(err, root) {
    if (err)
        throw err;

    var PKTModel = root.lookupType("packet.packetModel"),
        clock = new Date(),
        encode = function(msg){
            console.log(msg);
            var errMsg = PKTModel.verify(msg);
            if (errMsg)
                throw Error(errMsg);
            return PKTModel.encode(PKTModel.create(msg)).finish();
        },
        randomMsgID = function(cmd){
            return cmd + "_" + Math.floor(Math.random() * 10000) + clock.getTime();
        };

    var wss = new WebSocket("ws://127.0.0.1:8000");
    wss.onmessage = function(evt){
        var reader = new FileReader();
        reader.onload = function(evt){
            if(evt.target.readyState == FileReader.DONE){
                var data = new Uint8Array(evt.target.result),
                    msg = PKTModel.decode(data)
                console.log(msg);
                if(window.connector.pools[msg.msgID]){
                    if(window.connector.pools[msg.msgID].callback){
                        window.connector.pools[msg.msgID].callback(msg.content);
                    }
                    delete window.connector.pools[msg.msgID];
                }
            }
        }
        reader.readAsArrayBuffer(evt.data);
    }

    wss.onopen = function(){
        window.connector.connected = true;
        console.log("onopen");
        connector.sendMsg("example");
    }

    wss.onclose = function(){
        window.connector.connected = false;
        console.log("onclose");
    }

    window.connector.sendMsg = function(cmd, data, callback){
        console.log(window.connector.connected, cmd)
        if(window.connector.connected){
            var msg = {
                msgID: randomMsgID(cmd),
                cmd: cmd
            };

            this.pools[msg.msgID] = {
                timestamp: Math.floor((new Date()).getTime() / 1000),
                callback: callback
            };

            if(data != undefined){
                msg.content = ((typeof data == "object")?(JSON.stringify(data)):data);
            }

            wss.send(encode(msg));
        }
    }
});

setInterval(function(){
    var now = Math.floor((new Date()).getTime() / 1000);
    for(var i in window.connector.pools){
        if(window.connector.pools[i].timestamp + 30 < now){
            delete window.connector.pools[i];
        }
    }
},
1000);


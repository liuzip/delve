window.connector = {
    connected: false,
    sendMsg: function(){},
    pools: {}
};

protobuf.load("./util/proto/packet.proto", function(err, root) {
    if (err)
        throw err;

    var PacketModel = root.lookupType("packet.packetModel"),
        clock = new Date(),
        encode = function(msg){
            var errMsg = PacketModel.verify(msg);
            if (errMsg)
                throw Error(errMsg);
            return PacketModel.encode(PacketModel.create(msg)).finish();
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
                    msg = PacketModel.decode(data)
                console.log(msg);
                if(window.connector.pools[msg.msgID]){
                    if(window.connector.pools[msg.msgID].callback){
                        window.connector.pools[msg.msgID].callback(JSON.parse(msg.content));
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
    }

    wss.onclose = function(){
        window.connector.connected = false;
        console.log("onclose");
    }

    window.connector.sendMsg = function(cmd, data, callback){
        if(window.connector.connected){
            if(typeof data == "function"){
                callback = data;
                data = undefined;
            }

            var msg = {
                msgID: randomMsgID(cmd),
                cmd: cmd
            };

            this.pools[msg.msgID] = {
                timestamp: Math.floor((new Date()).getTime() / 1000),
                callback: callback
            };

            if(data != undefined){
                msg.content = ((typeof data == "object" || typeof data == "array")?(JSON.stringify(data)):data);
            }

            console.log(msg);

            wss.send(encode(msg));
        }
        else{
            setTimeout(function(){
                this.sendMsg(cmd, data, callback);
            },
            100);
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


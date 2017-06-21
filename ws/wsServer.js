const PORT = 8000;
const WebSocket = require('ws'); // https://github.com/websockets/ws
const wss = new WebSocket.Server({ port: PORT });
const protobuf = require("protobufjs"); // https://github.com/dcodeIO/protobuf.js
var handler = require("./handler/handler")
var UserModel = null;

protobuf.load("../util/proto/test.proto", function(err, root) {
    if (err)
        throw err;
    var TestModel = root.lookupType("test.testModel");
    var sendMsg = function(ws, msg){
        var errMsg = TestModel.verify(msg);
        if (errMsg)
            throw Error(errMsg);

        var message = TestModel.create(msg),
            buffer = TestModel.encode(message).finish();

        ws.send(buffer);
    }

    wss.on("connection", function(ws){
        ws.on("message", function(message){
            var testVal = TestModel.decode(message);
     
            console.log(JSON.stringify(testVal));
        });

        sendMsg(ws, {
            name: "test",
            age: 28,
            male: true
        })
    });

    console.log("WS server runing at port: " + PORT + ".");
});



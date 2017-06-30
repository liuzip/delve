const WEBPORT = 8090;
const http = require("http");
const url = require("url");
const fs = require("fs");
const mine = require("./mine").types;
const path = require("path");

const WSPORT = 8000;
const WebSocket = require('ws'); // https://github.com/websockets/ws
const wss = new WebSocket.Server({ port: WSPORT });
const protobuf = require("protobufjs"); // https://github.com/dcodeIO/protobuf.js

const handler = require("./handler/handler");

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    pathname = (pathname == "/")?"/index.html":pathname;
    var realPath = path.join("./", pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : "unknown";
    fs.exists(realPath, function (exists) {
        if(!exists){
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        }
        else{
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.end(err);
                }
                else{
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        "Content-Type": contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(WEBPORT);
console.log("WEB server runing at port: " + WEBPORT + ".");

protobuf.load("./util/proto/packet.proto", function(err, root) {
    if (err)
        throw err;
    var PKTModel = root.lookupType("packet.packetModel");
    var sendMsg = function(ws, msg){
        var errMsg = PKTModel.verify(msg);
        if (errMsg)
            throw Error(errMsg);

        var message = PKTModel.create(msg),
            buffer = PKTModel.encode(message).finish();

        ws.send(buffer);
    }

    wss.on("connection", function(ws){
        ws.on("message", function(data){
            var msg = PKTModel.decode(data);
     
            sendMsg(ws, {
                msgID: msg.msgID,
                cmd: msg.cmd,
                content: handler[msg.cmd](msg.content)
            })
        });
    });

    console.log("WS server runing at port: " + WSPORT + ".");
});


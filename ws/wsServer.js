const PORT = 8000;

const WebSocket = require('ws'); // https://github.com/websockets/ws
const wss = new WebSocket.Server({ port: PORT });
const protobuf = require("protobufjs"); // https://github.com/dcodeIO/protobuf.js

wss.on("connection", function(ws){
	ws.on("message", function(message){
		console.log("received: %s", message);
	});

	ws.send("example");
});

console.log("WS server runing at port: " + PORT + ".");

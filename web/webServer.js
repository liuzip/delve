const PORT = 8090;
const http = require("http");
const url = require("url");
const fs = require("fs");
const mine = require("./mine").types;
const path = require("path");

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    pathname = (pathname == "/")?"/index.html":pathname;
    pathname = (pathname.substr(-8) == "proto.js")?("../../" + pathname):pathname;
    var realPath = path.join("assets", pathname);

    // console.log(realPath);
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
server.listen(PORT);
console.log("WEB server runing at port: " + PORT + ".");

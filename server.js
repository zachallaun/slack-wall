var http = require("http");
var fs = require('fs');
var port = 3000;
var serverUrl = "localhost";
var counter = 0;
var path = require("path");



var server = http.createServer(function(req, res) {
    var filename = req.url;

    if(filename === null || filename === "/") {
    filename = "/index.html"
    };
    var localPath = path.join(__dirname, filename);

    var fileExtensions = {
      ".html" : "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".txt": "text/plain",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".png": "image/png"
    };
    var ext = path.extname(filename);
    var mimeType = fileExtensions[ext];

    if(mimeType) {
        fs.exists(localPath, function(exists) {
          if(exists) {
            console.log("Serving file: " + filename);
            getFile(localPath, res, mimeType);
          }
          else {
            console.log("File not found: " + localPath);
            res.writeHead(404);
            res.end("File not found [" + filename + "]");
          }
        });
      }
      else {
        console.log("Invalid file extension detected [" + ext + "]");
        res.writeHead(500);
        res.end("Invalid file extension detected");
      }
    });

    function getFile(localPath, res, mimeType) {

      fs.readFile(localPath, function(err, contents) {
        if(err) {
          console.log("ERROR: " + err);
          res.writeHead(500);
          res.end();
        }
        else {
          res.setHeader("Content-Length", contents.length);
          res.setHeader("Content-Type", mimeType);
          res.statusCode = 200;
          res.end(contents);
        }
      });

    }

    console.log("Starting web server at " + serverUrl + ":" + port);
    server.listen(port, serverUrl);




//
//
//   counter++;
//   console.log("Request: " + req.url + " (" + counter + ")");
//   if(req.url === "/index.html") {
//     fs.readFile("index.html", function(err, text){
//       res.setHeader("Content-Type", "text/html");
//       res.end(text);
//     });
//     return;
//
//   }
//   res.setHeader("Content-Type", "text/html");
//   res.end("<p>Hello World. Request counter: <b>" + counter + "</b>.</p>");
//
// });
//
// console.log("Starting web server at " + serverUrl + ":" + port);
// server.listen(port, serverUrl);

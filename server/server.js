var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mysql = require('./mysqlTool.js');

function start(route) {
	http.createServer(function(request, response) {
		var filename = request.url || "index.html";
		var ext = path.extname(filename);
		var localPath = "../client";
		var validExtensions = {
			".html" : "text/html",
			".js": "application/javascript",
			".css": "text/css",
			".txt": "text/plain",
			".jpg": "image/jpeg",
			".gif": "image/gif",
			".png": "image/png"
		}
		var isValidExt = validExtensions[ext];
		if (isValidExt) {
			localPath += filename;
			fs.exists(localPath, function(exists) {
				if(exists) {
					console.log("Serving file: " + localPath);
					getFile(localPath, response, isValidExt);
				} else {
					console.log("File not found: " + localPath);
					response.writeHead(404);
					response.end();
				}
			});

		} else {
			var pathname = url.parse(request.url).pathname;
			console.log("Request for " + pathname + " received");
			switch(pathname) {
				case "/init": //Load projects in sorted order by likes
					console.log("Routed to init");
					// Get top 18 projects
					fs.readFile("../client/index.html", function(error, htmlContent) {
						if(error) {
							console.log("Error page");
							response.writeHead(404,{"Content-Type":"text/plain"});
							response.end("Sorry the page was not found");
						} else {
							mysql.connect(function(err) {
								if(err) {
									response.writeHead(404,{"Content-Type":"text/plain"});
									response.end("Sorry the page was not found");
								} else {
									var query = "SELECT * FROM ece464.projects P ORDER BY likes DESC LIMIT 1";
									console.log("Querying MySQL");
									mysql.makeQuery(query, function(rows) {
										// Wrap JSON
										response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
										for(var i=0; i<rows.legnth; i++) {
											response.write(JSON.stringfy(rows[i]));
										}
										response.end();
									});
								}
							});
						}
							
					});
				break;
			}
		}

	}).listen(8080);
	console.log("Server has started");
}

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			res.setHeader("Content-Type", mimeType);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

exports.start = start;
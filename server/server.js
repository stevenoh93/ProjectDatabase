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
					// console.log("Serving file: " + localPath);
					getFile(localPath, response, isValidExt);
				} else {
					// console.log("File not found: " + localPath);
					response.writeHead(404);
					response.end();
				}
			});

		} else {
			var pathname = url.parse(request.url).pathname;
			console.log("Request for " + pathname + " received");
			if(pathname == "/init") {//Load projects in sorted order by likes
				console.log("Routed to init");
				var query = "SELECT pid, coverPhotoPath, pname,projectDesc FROM ece464.projects P ORDER BY likes DESC LIMIT 6";
				mysql.makeQuery(query, function(rows) {
					// Wrap JSON
					response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
					for(var i in rows) {
						response.write(JSON.stringify(rows[i]) + ";;;");
					}
					response.end();
				});
				//mysql.end();
			}
			else if(pathname.indexOf("/proj") == 0) {
				var params = pathname.split("/");
				var names = [];
				var values = [];
				for(var i=2; i<params.length; i++) {
					names.push(params[i].split("=")[0]);
					values.push(params[i].split("=")[1]);
				}
				query = "SELECT * FROM ece464.projects WHERE ";
				for(var i=0; i<names.length-1; i++)
					query += names[i] + "='" + values[i] +"', ";
				query += names[i] + "='" + values[i] +"';";
				mysql.makeQuery(query, function(rows) {
					// Wrap JSON
					response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
					for(var i in rows) {
						response.write(JSON.stringify(rows[i]) + ";;;");
					}
					response.end();
				});
				// mysql.end();
			}
			else if(pathname.indexOf("/stu") == 0) {
				var params = pathname.split("/");
				var names = [];
				var values = [];
				for(var i=2; i<params.length; i++) {
					names.push(params[i].split("=")[0]);
					values.push(params[i].split("=")[1]);
				}
				query = "SELECT * FROM ece464.students WHERE sid IN ( " +
							"SELECT sid FROM ece464.participation WHERE pid=" + values[0] + ");"
				mysql.makeQuery(query, function(rows) {
					// Wrap JSON
					response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
					for(var i in rows) {
						response.write(JSON.stringify(rows[i]) + ";;;");
					}
					response.end();
				});		
				//mysql.end();
			}
		}
	}).listen(8888);
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
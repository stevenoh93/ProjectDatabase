var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');

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
		var connection = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'skdml!Tjqjdlek'
		});
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
			if(pathname.indexOf("/load") == 0) {//Load projects in sorted order by likes
				var params = pathname.split("/");
				var pageNum = params[2].split("=")[1];
				console.log("Send pg " + pageNum);
				var query = "SELECT pid, coverPhotoPath, pname,projectDesc FROM ece464.projects P ORDER BY likes DESC LIMIT 120";
				connection.query(query, function(err, rows, fields) {
					// Wrap JSON
					if(err)
						console.log("Err with query");
					else {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						for(var i=(pageNum-1)*6; i<pageNum*6 + 6; i++) {
							response.write(JSON.stringify(rows[i]) + ";;;");
						}
						response.end();
					}
				});
			}
			else if(pathname.indexOf("/proj") == 0) {  // Loading a project.html with project info
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
				connection.query(query, function(err, rows, fields) {
					// Wrap JSON
					if(err)
						console.log("Err with query");
					else {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						for(var i in rows) {
							response.write(JSON.stringify(rows[i]) + ";;;");
						}
						response.end();
					}
				});
				// mysql.end();
			}
			else if(pathname.indexOf("/stu") == 0) {  // Loading a project.html with student info
				var params = pathname.split("/");
				var names = [];
				var values = [];
				for(var i=2; i<params.length; i++) {
					names.push(params[i].split("=")[0]);
					values.push(params[i].split("=")[1]);
				}
				query = "SELECT * FROM ece464.students WHERE sid IN ( " +
							"SELECT sid FROM ece464.participation WHERE pid=" + values[0] + ");"
				connection.query(query, function(err, rows, fields) {
					// Wrap JSON
					if(err)
						console.log("Err with query");
					else {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						for(var i in rows) {
							response.write(JSON.stringify(rows[i]) + ";;;");
						}
						response.end();
					}
				});		
				//mysql.end();
			}
			else if(pathname.indexOf("/stu") == 0) {  // Check password to edit a project
				var params = pathname.split("/");
				var names = [];
				var values = [];
				for(var i=2; i<params.length; i++) {
					names.push(params[i].split("=")[0]);
					values.push(params[i].split("=")[1]);
				}
				query = "SELECT CAST(AES_Decrypt(pwd,'d5f92dcae90ec87247840df8a76a195aa1cd0f7fe996b1d79eb6f9da2294338a556b46cfd64e0fe3a00b71952e17a72880b01540485924150fbb5448098e6853') AS Char(50)) pwd \
							 FROM ece464.projects WHERE pid='" + values[0]; + "';";
				connection.query(query, function(err, rows, fields) {
					// Wrap JSON
					if(err)
						console.log("Err with query");
					else {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						for(var i in rows) {
							response.write(JSON.stringify(rows[i]) + ";;;");
						}
						response.end();
					}
				});		
			}
		}

		connection.on('error', function(err) {
			if(err.code === 'PROTOCOL_CONNECTION_LOST') {
				// Connection lost by error. Reconnect
				connection = mysql.createConnection(connection.config);
				console.log('Connection closed unexpectedly. Reconnected.')
			} else {
				console.log('Connection closed normally');
			}
		});
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
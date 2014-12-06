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
			else if(pathname.indexOf("/pwd") == 0) {  // Check password to edit a project
				var params = pathname.split("/");
				var names = [];
				var values = [];
				for(var i=2; i<params.length; i++) {
					names.push(params[i].split("=")[0]);
					values.push(params[i].split("=")[1]);
				}
				query = "SELECT CAST(AES_Decrypt(pwd,SHA2('masterkey',512)) AS Char(50)) pwd \
							 FROM ece464.students WHERE sid IN ( \
							 	SELECT sid FROM ece464.participation WHERE pid=" + values[0] + ");";
				connection.query(query, function(err, rows, fields) {
					// Wrap JSON
					if(err) {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						response.write("Wrong password");
						response.end();
					}
					else {
						response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
						for(var i in rows) {
							response.write(JSON.stringify(rows[i]) + ";;;");
						}
						response.end();
					}
				});		
			}
			else if(pathname.indexOf("/getNames") == 0) {
				var params = pathname.split("/");
				var name = params[2].split("=")[1].split("_");
				query = "SELECT email FROM ece464.students WHERE UPPER(firstName)=UPPER('" + name[0] + "') AND UPPER(lastName)=UPPER('" + name[1] + "');";
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
			else if(pathname.indexOf("/edit") == 0) {
				var cs = [];
				request.on('data', function(chunk) {
					cs.push(chunk);
				});
				request.on('end', function() {
					console.log("Request done");
					var content = ""
					for(var ch in cs)
						content += cs[ch].toString();
					var aContents = JSON.parse(content);
					var keys = Object.keys(aContents);
					query = "UPDATE ece464.projects SET ";
					var curKey;
					for(var k=0; k<keys.length-1; k++) {
						curKey = keys[k];
						if(curKey != "pid" && curKey != "participants")
							query += curKey + "='" + aContents[curKey] + "', ";
					}
					curKey = keys[k];
					query += curKey + "='" + aContents[curKey] + "' WHERE pid=" + aContents["pid"] + ";";
					// query = "UPDATE ece464.projects SET \
					// 						coverPhotoPath = :coverPhotoPath, \
					// 						projectDesc = :projectDesc, \
					// 						pname = :pname, \
					// 						term = :term, \
					// 						docPath = :docPath, \
					// 						status = :status, \
					// 						pcategory = :pcategory WHERE pid = :pid ;"
					connection.query(query, function (err, result) {
						if(err) {
							console.log(result);
							console.log(err);
							response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
							response.write("fail");
							response.end();
						} else {
							console.log(result);
							response.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Credentials' : 'true'});
							response.write("success");
							response.end();
						}
					});
				});
			}
			else if(pathname.indexOf("/add") == 0) {
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
var msConn = require('./mysqlTool.js');


msConn.connect;
var query = "SELECT * FROM ece464.projects P ORDER BY likes DESC LIMIT 1";
msConn.makeQuery(query, function(rows) {
	var res = rows;
	console.log(rows);
	var jsonres = JSON.stringify(res);
	console.log(jsonres);
});

msConn.end;
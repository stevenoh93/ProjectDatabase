var msConn = require('./mysqlTool.js');


msConn.connect;
msConn.makeQuery("SELECT * FROM ece464.courses;", function(rows) {
	var res = rows;
	console.log(rows);
});
msConn.makeQuery("SELECT * FROM ece464.faculty F WHERE F.firstname='Paul';", function(rows) {
		var res2 = rows;
		console.log(res2);
});

msConn.end;
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'skdml!Tjqjdlek'
});

function connect(cb) {
	connection.connect();
	cb(1);
}

function makeQuery(query, cb) {
	connection.query(query, function(err, rows, fields) {
		if (err)
			return console.log(err);
		else {
			cb(rows);
		}
	});
}

function endConnection() {
	connection.end();
}

exports.connect = connect;
exports.makeQuery = makeQuery;
exports.end = endConnection;
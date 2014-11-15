var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'skdml!Tjqjdlek'
});

function connect(cb) {
	connection.connect();
	console.log('Connected!');
	cb(1);
}

function makeQuery(query, cb) {
	console.log('Query string: ' + query);
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
	console.log("Connection ended");
}

exports.connect = connect;
exports.makeQuery = makeQuery;
exports.end = endConnection;
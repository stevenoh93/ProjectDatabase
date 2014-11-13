var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'Skdml!fovxkqdlek'
});

connection.connect();

console.log('Connected!');

connection.query('SELECT * FROM Test.user', function(err, rows, fields) {
	if (err)
		return console.log(err);
	for(var i=0; i<rows.length; i++) {
		console.log(rows[i].name);
	}
});

connection.end();
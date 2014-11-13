var http = require('http');
var url = require('url');

function start(route) {
	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.")

		route(pathname, request, response);	
		response.end();
	}).listen(8888);
	console.log("Server has started");
}

exports.start = start;
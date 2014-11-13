var http = require('http');
var url = require('url');

function start(route) {
	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.")
		var body = 'hello world';
		response.writeHead(200, {'Content-Type': 'text/plain',
									 'Trailer': 'Content-MD5'  });
		response.write('Hello World');
		response.addTrailers({'Content-MD5': "7895bf4b8828b55ceaf47747b4bca667"});
		route(pathname, request, response);	
		response.end();
	}).listen(8888);
	console.log("Server has started");
}

exports.start = start;
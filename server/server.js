var http = require('http');
var url = require('url');

function start(route) {
	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.")
		var body = 'hello world';
		response.writeHead(200, {'Content-Type': 'text/plain' });
									 // 'Trailer': 'Content-MD5'  });
		response.write(body);
		switch(pathname) {
			case "/init":
				console.log("Routed to init");
				response.write('This is changed in router');
				//response.addTrailers({'Content-MD5': "7895bf4b8828b55ceaf47747b4bca667"});
				response.end();
				break;
		}
		response.end();
	}).listen(8888);
	console.log("Server has started");
}

exports.start = start;
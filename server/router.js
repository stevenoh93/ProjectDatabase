function route(pathname,request, response) {
	console.log("About to route a request for " + pathname);
	
	if(pathname == '/init')
		console.log("blabhablh");
}

exports.route = route;
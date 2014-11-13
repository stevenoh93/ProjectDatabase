function route(pathname) {
	console.log("About to route a request for " + pathname);
	switch(pathname) {
		case "init":
			console.log("Routed to init");
			break;
	}
}

exports.route = route;
jQuery(document).ready(function($) {
	makeCORSRequest('GET','http://72.76.204.54:8888/list', function(data) {
		// data already sorted
		for(var i=0; i<data.length-1; i++) {
			// if first letter changes, move to next partition
			var curData = JSON.parse(data[i]);
			var char0 = curData.lastName.toLowerCase().charAt(0);
			if(i == 0)
				var curChar = char0;
			else 
				if(curChar != char0) {curChar = char0;}
			
			$('#letter-'+curChar).append("<li><a href='student.html?sid="+curData.sid+"'> "+ curData.lastName + ", " + curData.firstName + " </a></li>");
		}
		$('#letter-'+curChar).append('<li><a href="#" class="to-list"> Return to list</a></li>');
	});
});

// Make CORS request
function makeCORSRequest(method, url, cb) {
	var xhr = createCORSRequest(method, url);
	if (!xhr) {
		alert('CORS not supported');
		cb('err');
	}
	xhr.onload = function() {
		var text = xhr.responseText.split(";;;");
		cb(text);
	};
	xhr.onerror = function() {
		alert('Woops, there was an error making the request to the server.');
	};

	xhr.send();
}


function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	
	return xhr;
}

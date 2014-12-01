// Update content to latest listings
jQuery(document).ready(function($) {
	var curP = $('#light-pagination').pagination('getCurrentPage');
	loadProjs(curP);
});

function loadProjs(pageNum) {	
	// Get current page number
	console.log("Page changed to " + pageNum);
	makeCORSRequest('GET','http://72.76.204.54:8888/load/pg=' + pageNum, function(data) {
		if(data == 'err')
			alert('Something went wrong');
		else {
			// Load initial data to page
			var ids = $(".blocks-thumbs li");
			for(var i=0; i<6; i++) {
				var curItem = ids[i];
				var curData = JSON.parse(data[i]);
				var newhref = '"project.html?pid=' + curData.pid.toString() + '"';
				console.log(curData.coverPhotoPath);
				curItem.innerHTML = ' \
					<a href=' + newhref + ' class="thumb" title="An image"><img src="' + curData.coverPhotoPath +'" alt="img not found" width="300" height="200"/></a> \
					<div class="excerpt"> \
						<a href=' + newhref + ' class="header">'+ curData.pname +'</a> \
						<a href=' + newhref + ' class="text">'+ curData.projectDesc +'</a> \
					</div> \
					<input class="button" type="submit" name="submit" onClick=promptPassword('+curData.pid+') value="Edit"> \
				';
			}
		}
	});
}

// Make CORS request
function makeCORSRequest(method, url, cb) {
	var xhr = createCORSRequest(method, url);
	if (!xhr) {
		alert('CORS not supported');
		cb('err');
	}
	xhr.onload = function() {
		var text = xhr.responseText.split(";;;");
		// for(var d in text) {
		// 	console.log(JSON.parse(text[d]).pid);
		// }
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
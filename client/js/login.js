$(function() {
	$('.myform').submit( function() {
		var xhr = createCORSRequest("POST",'http://72.76.204.54:8888/login');
		if (!xhr) {
			alert('CORS not supported');
			return false;
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState==4 && xhr.status==200) {
	    		if(xhr.responseText == "success") {
					alert('Incorrect credentials');
					return false;
				} else {
					var prevLoc = window.location.href.split("/");
					var toLoc="";
					for(var i=0; i<prevLoc.length-1;i++)
						toLoc+=prevLoc[i]+'/';
					toLoc+='upload.html?pid=' + 'new';
					window.location.href=toLoc;
				}
			} else {
				alert('Could not connect to the database');
			}
		};
		xhr.onerror = function() {
			alert('Woops, there was an error making the request to the server.');
			return false;
		};
		xhr.setRequestHeader("Content-type","application/JSON");
		var content = {
			email : $("#email").val(),
			pwd : $('#pwd').val()
		};
		xhr.send(JSON.stringify(content));
	});
});

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

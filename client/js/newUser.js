// $(function() {
// 	$('.myform').submit( function() {
// 		var url="http://72.76.204.54:8888/newAccount"
// 		var xhr = createCORSRequest("POST", url);
// 		xhr.onreadystatechange=function() {
// 			if (xhr.readyState==4 && xhr.status==200) {
// 	    		if(xhr.responseText == "success") {
// 	    			//Redirect to login
// 					var prevLoc = window.location.href.split("/");
// 					var toLoc="";
// 					for(var i=0; i<prevLoc.length-1;i++)
// 						toLoc+=prevLoc[i]+'/';
// 					toLoc+='login.html';
// 					window.location.href=toLoc;
// 	    		} else if(xhr.responseText == "duplicate") {
// 	    			alert("This email account already exists");
// 	    		} else {
// 	    			alert("There was a problem connecting to the database. Please try again later.");
// 	    		}
// 	    	}
// 		}
// 		xhr.onerror = function() {
// 			alert('Woops, there was an error making the request to the server.');
// 			return false;
// 		};
// 		/******************** Convert to JSON **********************/
// 		var content = {
// 			firstName : $('#fname').val(),
// 			lastName : $('#lname').val(),
// 			email : $('#email').val(),
// 			pwd : $('#pwd').val(),
// 			gradYear : $("#year option:selected").val(),
// 			dname : $('#major option:selected').val()
// 		};
// 		xhr.setRequestHeader('Content-type', "application/JSON");
// 		xhr.send(JSON.stringify(content));
// 		/******************** END Convert to JSON **********************/
// 	});
// });

function submit() {
	var url="http://72.76.204.54:8888/newAccount"
	var xhr = createCORSRequest("POST", url);
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4 && xhr.status==200) {
    		if(xhr.responseText == "success") {
    			//Redirect to login
				var prevLoc = window.location.href.split("/");
				var toLoc="";
				for(var i=0; i<prevLoc.length-1;i++)
					toLoc+=prevLoc[i]+'/';
				toLoc+='login.html';
				window.location.href=toLoc;
				return false;
    		} else if(xhr.responseText == "duplicate") {
    			alert("This email account already exists");
    			return false;
    		} else {
    			alert("There was a problem connecting to the database. Please try again later.");
    			return false;
    		}
    	}
	}
	xhr.onerror = function() {
		alert('Woops, there was an error making the request to the server.');
		return false;
	};
	/******************** Convert to JSON **********************/
	var content = {
		firstName : $('#fname').val(),
		lastName : $('#lname').val(),
		email : $('#email').val(),
		pwd : $('#pwd').val(),
		gradYear : $("#year option:selected").val(),
		dname : $('#major option:selected').val()
	};
	xhr.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
	xhr.send(JSON.stringify(content));
	/******************** END Convert to JSON **********************/
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

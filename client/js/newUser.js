function submit() {
	var url="http://72.76.204.54:8888/newAccount"

	var fn = $('#fname');
	var ln = $('#lname');
	var em = $('#email');
	var pwd = $('#pwd');
	var gy = $("#year option:selected");
	var dn = $('#major option:selected');

	if(fn.val().length==0 || ln.val().length==0 || em.val().length==0 || pwd.val().length==0) {
		alert('All fields are required');
		return false;
	}
	if(em.val().indexOf("@") < 0 || em.val().indexOf(".") < 0) {
		em.focus();
		alert("Enter a valid mail address");
		return false;
	}
	if(pwd.val().length < 8) {
		pwd.focus();
		alert('Password length must be greater than 7');
		return false;
	}
	if(fn.val().indexOf("\\")>=0 || ln.val().indexOf("\\")>=0 || em.val().indexOf("\\")>=0 || pwd.val().indexOf("\\")>=0) {
		alert("Please refrain from using backslashes");
		return false;
	}

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
		firstName : fn.val(),
		lastName : ln.val(),
		email : em.val(),
		pwd : pwd.val(),
		gradYear : gy.val(),
		dname : dn.val()
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

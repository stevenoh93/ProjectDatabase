jQuery(document).ready(function($) {
	var pid = getURLParam('pid');
	if(pid==='new'){

	} else {
		var url = 'http://72.76.204.54';   // Home server
		makeCORSRequest('GET',url+':8888/proj/pid=' + pid, function(data) {
			if(data == 'err')
				alert('Something went wrong');
			else {
				// makeCORSRequest('GET',url+':8888/stu/pid=' + pid, function(stuInfo) {
				// 	if(stuInfo == 'err')
				// 		alert('Something went wrong');
				// 	else {
				// 		// Load img and description
				// 		var curData = JSON.parse(data[0]);
				// 		$("div.img-holder").html('<img src="' + curData.coverPhotoPath + '" alt="Image" class="attachment-post-thumbnail" width=620 height=350 />');
				// 		$("h3.p-title").html(curData.pname);
				// 		$("p").html(curData.projectDesc);
				// 		//Get stu info
				// 		var stus = "";
				// 		for(var i=0; i<stuInfo.length-2; i++) {
				// 			var curD = JSON.parse(stuInfo[i]);
				// 			stus += curD.firstName + " " + curD.lastName + ", ";
				// 		}
				// 		curD = JSON.parse(stuInfo[i]);
				// 		stus += curD.firstName + " " + curD.lastName;
				// 		// Load sidebar
				// 		$("td.first-detail").html(stus);
				// 		$("td.second-detail").html(curData.term.toString());
				// 		$("td.third-detail").html('<a href="' + curData.docPath + '">' + curData.docPath+'</a>');
				// 	}
				// });
			}
		});
	}
});

$("#fileToUpload").change(function(){
	console.log('here');
    readURL(this);
});


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function getURLParam(name) {
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    if(results === null) {
    	return 'new';
    } else
    	return results[1] || 0;
}

// Make AJAX request
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
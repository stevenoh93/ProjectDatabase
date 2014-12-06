// Load existing project on project edit, leave blank else
jQuery(document).ready(function($) {
	var pid = getURLParam('pid');
	if(pid==='new'){
		document.getElementById('deleteButton').style.visibility = 'hidden';
	} else {
		var url = 'http://72.76.204.54:8888/';   // Home server
		makeCORSRequest('GET',url+'proj/pid=' + pid, function(data) {
			if(data == 'err')
				alert('Something went wrong');
			else {
				makeCORSRequest('GET',url+'stu/pid=' + pid, function(stuInfo) {
					if(stuInfo == 'err')
						alert('Something went wrong');
					else {
						// Load information about the project and contributers
						var curData = JSON.parse(data[0]);
						$("div.preview-wrap").html('<img id="preview" class="preview" src="' + curData.coverPhotoPath + '" alt="No image found" />');
						$("#pname").attr('value',curData.pname);
						$("#projComments").html(curData.projectDesc);
						$("#pterm option:selected").val(curData.term);
						$("#pterm option:selected").text(curData.term);
						$("#purl").val(curData.docPath);
						$("#pstatus option:selected").val(curData.status);
						$("#pstatus option:selected").text(curData.status);
						document.getElementById('deleteButton').style.visibility = 'visible';
						var checkBoxes = $(".ptag input").toArray();
						var curCat = curData.pcategory;
						for(var i=0; i<checkBoxes.length; i++) 
							if(curCat.indexOf(checkBoxes[i].value) > -1)
								$("#"+checkBoxes[i].id).prop('checked',true);
						//Get stu info
						var stus = "";
						for(var i=0; i<stuInfo.length-2; i++) {
							var curD = JSON.parse(stuInfo[i]);
							stus += curD.firstName + " " + curD.lastName + "\n";
						}
						curD = JSON.parse(stuInfo[i]);
						stus += curD.firstName + " " + curD.lastName;
						$("#sid").html(stus);
					}
				});
			}
		});
	}
});

// UPDATE or INSERT
function submitNewProj() {
	var pid = getURLParam('pid');
	var url = 'http://72.76.204.54:8888/';   // Home server
	var reader = new FileReader();
	var image = document.getElementById("fileToUpload");
	var imgURL;
	reader.onload = function (e) {
        imgURL = e.target.result;
    }
    reader.readAsDataURL(image.files[0]);
	/************** Form validation **************/
	// Project Description
	var desc = $("#projComments").html();
	if(desc == ""){
		$("#projComments").focus();
		return false;
	}
	// Project Name
	var name = $("input#pname").val();
	if(name == ""){
		$("input#pname").focus();
		return false;
	}
	// Contributers
	var sid = $("#sid").html();
	if(sid == "" || sid == "Separate Names By Enter"){
		$("#sid").focus();
		return false;
	}
	var imgext = $("#fileToUpload").val();
	imgext = imgext.substring(imgext.length-3,imgext.length);
	if(!(imgext.toLowerCase() == 'jpg' || imgext.toLowerCase() == 'png' || $("#preview").attr('src').length >0)) {
		$("#fileToUpload").focus();
		alert("This type of file is not supported");
		return false;
	}
	/************** END form validation **************/

	/************** Check duplicate contributer name **************/
	var emails = [];
	var contributers = $("#sid").html().split("\n");
	for(var c in contributers) {
		makeCORSRequest("GET",url+'getNames/name=' + contributers[c].replace(" ","_"), function(data) {
			if(data == 'err')
				alert('Something went wrong');
			else {
				if(data.length > 2) {
					var promptString = "We've found the following users with the name " + contributers[c] + ". Please select one or another email: \n";
					for(var i; i<data.length-1; i++)
						promptString += data[i] + "\n";
					emails.push(prompt(promptString));
				} else {
					emails.push(data[0]);
				}
			}
			// Make request type
			var reqEnd="";
			if(pid==='new'){
				reqEnd = "add/";
			} else {
				reqEnd = "edit/";
			}
			var xhr = createCORSRequest("POST",url + reqEnd);
			xhr.onreadystatechange=function() {
				if (xhr.readyState==4 && xhr.status==200) {
		    		console.log(xhr.responseText);
		    	}
			}
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	/******************** Convert to JSON **********************/
			var checkBoxes = $(".ptag input").toArray();
			var cats = "";
			for(var i=0; i<checkBoxes.length; i++) 
				if($("#"+checkBoxes[i].id).prop('checked'))
					cats += checkBoxes[i].value + ".";
			var content = {
				pid : pid,
				coverPhotoPath : imgURL,
				projectDesc : $("#projComments").html(),
				pname : $("#pname").attr('value'),
				term : $("#pterm option:selected").val(),
				docPath : $("#purl").val(),
				status : $("#pstatus option:selected").val(),
				pcategory : cats
			};
	/******************** END Convert to JSON **********************/
			xhr.send(JSON.stringify(content));
		});
	}
	/************** END Check duplicate contributer name **************/




	



	//Make request

	// Redirect to main
	// alert("Upload processeed.");
	// var prevLoc = window.location.href.split("/");
	// var toLoc="";
	// for(var i=0; i<prevLoc.length-1;i++)
	// 	toLoc+=prevLoc[i]+'/';
	// toLoc+='index.html';
	// window.location.href=toLoc;
}

function deleteProj() {
	var pid = getURLParam('pid');
	console.log("Delete " + pid);
	var surely = confirm("Are you sure you want to delete this project?");
	console.log(surely);
	// Redirect to main
	if(surely) {
		// TODO: DELETE
		var prevLoc = window.location.href.split("/");
		var toLoc="";
		for(var i=0; i<prevLoc.length-1;i++)
			toLoc+=prevLoc[i]+'/';
		toLoc+='index.html';
		window.location.href=toLoc;
	}
}

// Load preview
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
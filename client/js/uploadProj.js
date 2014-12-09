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
    if(image.files && image.files[0])
    	reader.readAsDataURL(image.files[0]);
    else
    	imgURL = $("#preview").attr('src');
	/************** Form validation **************/
	// Project Description
	var desc = $("#projComments").val();
	if(desc == ""){
		$("#projComments").focus();
		alert("You must have project description.");
		return false;
	}
	// Project Name
	var name = $("input#pname").val();
	if(name == ""){
		$("input#pname").focus();
		alert("You must have a project name.");
		return false;
	}
	// Contributers
	var sid = $("#sid").val();
	if(sid == "" || sid == "Separate Names By Enter"){
		$("#sid").focus();
		alert("You must have at least one contributer");
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
	var contributers = document.getElementById("sid").value.split("\n");
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
				} else if (data[0] && data[0].length>=0) {
					var p = JSON.parse(data[0]).email;
					if(emails.indexOf(p) < 0) 
						emails.push(p);
				} else {
					alert(contributers[c] +" is not a registered user. You cannot add a non-registered user.");
					return false;
				}
			}
			if(emails.length == contributers.length) { // Went through all the contributers
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
			    		if(xhr.responseText == "success") {
			    			//Redirect to main
							alert("Upload processeed.");
							var prevLoc = window.location.href.split("/");
							var toLoc="";
							for(var i=0; i<prevLoc.length-1;i++)
								toLoc+=prevLoc[i]+'/';
							toLoc+='index.html';
							window.location.href=toLoc;
			    		} else {
			    			alert("There was a problem connecting to the database. Please try again later.");
			    		}
			    	}
				}
				xhr.onerror = function() {
					alert('Woops, there was an error making the request to the server.');
					return false;
				};
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				/******************** Convert to JSON **********************/
				var checkBoxes = $(".ptag input").toArray();
				var cats = "";
				for(var i=0; i<checkBoxes.length; i++) 
					if($("#"+checkBoxes[i].id).prop('checked'))
						cats += checkBoxes[i].value + ",";
				var parts = "";
				for(var e in emails)
					parts += emails[e] + ",";
				var content = {
					pid : pid,
					participants : parts,
					coverPhotoPath : imgURL,
					projectDesc : $("#projComments").val(),
					pname : $("#pname").val(),
					term : $("#pterm option:selected").val(),
					docPath : $("#purl").val(),
					status : $("#pstatus option:selected").val(),
					pcategory : cats
				};
				xhr.send(JSON.stringify(content));
				/******************** END Convert to JSON **********************/
			}
		});
	}
	/************** END Check duplicate contributer name **************/
}

function deleteProj() {
	var pid = getURLParam('pid');
	var url = 'http://72.76.204.54:8888/';   // Home server		
	var surely = confirm("Are you sure you want to delete this project?");
	// Redirect to main
	if(surely) {
		// TODO: DELETE
		makeCORSRequest("GET",url+"del/pid=" + pid, function(result) {
			if(result=='fail') {
				alert("There was an error connecting to the database");
			} else {
				var prevLoc = window.location.href.split("/");
				var toLoc="";
				for(var i=0; i<prevLoc.length-1;i++)
					toLoc+=prevLoc[i]+'/';
				toLoc+='index.html';
				window.location.href=toLoc;
			}
		});
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
//Script to load projects
$( document ).ready(function() {
	
	loadXMLDoc();
	$("#Item1").html(' \
		<a href="project.html" class="thumb" title="An image"><img src="img/dummies/300x200.gif" alt="Post" /></a> \
							<div class="excerpt"> \
								<a href="project.html" class="header">Lorem ipsum dolor</a> \
								<a href="project.html" class="text">CHANGE</a> \
								<div class="meta">Admin on 23 Jun, 2010</div> \
							</div> \
	');
});

function loadXMLDoc() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else {
	  // code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		$("#Item1").html(xmlhttp.responseText);
	  }
	}
	xmlhttp.open("GET","test.txt",true);
	xmlhttp.send();
	
}


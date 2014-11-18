// Jquery with no conflict
// var mysql = require('mysql');

jQuery(document).ready(function($) {
	
	// Slides ------------------------------------------------------ //
	
	$(function(){
		$('#headline').slides({
			preload: true,
			generatePagination: false,
			autoHeight: true,
			effect: 'slide',
			generateNextPrev: true
		});
	});
		
	// Poshytips ------------------------------------------------------ //
	
  //   $('.poshytip').poshytip({
  //   	className: 'tip-twitter',
		// showTimeout: 1,
		// alignTo: 'target',
		// alignX: 'center',
		// offsetY: 5,
		// allowTipHover: false
  //   });
    
    
    // Poshytips Forms ------------------------------------------------------ //
    
 //    $('.form-poshytip').poshytip({
	// 	className: 'tip-yellowsimple',
	// 	showOn: 'focus',
	// 	alignTo: 'target',
	// 	alignX: 'right',
	// 	alignY: 'center',
	// 	offsetX: 5
	// });
	
	// // Superfish menu ------------------------------------------------------ //
	
	// $("ul.sf-menu").superfish({ 
 //        animation: {height:'show'},   // slide-down effect without fade-in 
 //        delay:     800 ,              // 1.2 second delay on mouseout 
 //        autoArrows:  false
 //    });
    
    // Scroll to top ------------------------------------------------------ //
    
	$('.to-top').click(function(){
		$.scrollTo( '0px', 300 );
	});
	
	// Scroll to list ------------------------------------------------------ //
    
	$('.to-list').click(function(){
		$.scrollTo( '0px', 300 );
	});
	

	// Submenu rollover --------------------------------------------- //
	
	$("ul.sf-menu>li>ul li").hover(function() { 
		// on rollover	
		$(this).children('a').children('span').stop().animate({ 
			marginLeft: "3" 
		}, "fast");
	} , function() { 
		// on out
		$(this).children('a').children('span').stop().animate({
			marginLeft: "0" 
		}, "fast");
	});
	
	
	// tabs ------------------------------------------------------ //
	
	$("ul.tabs").tabs("div.panes > div", {effect: 'fade'});
	
	// Thumbs rollover --------------------------------------------- //
	
	$('.thumbs-rollover li a img').hover(function(){
		// on rollover
		$(this).stop().animate({ 
			opacity: "0.5" 
		}, "fast");
	} , function() { 
		// on out
		$(this).stop().animate({
			opacity: "1" 
		}, "fast");
	});
		
	
	
	// Sidebar rollover --------------------------------------------------- //

	$('#sidebar>li>ul>li').hover(function(){
		// over
		$(this).children('a').stop().animate({ marginLeft: "5"	}, "fast");
	} , function(){
		// out
		$(this).children('a').stop().animate({marginLeft: "0"}, "fast");
	});
	
	
	// pretty photo  ------------------------------------------------------ //
	
	$("a[rel^='prettyPhoto']").prettyPhoto();


	// Project gallery over --------------------------------------------- //
	
	$('.project-gallery li a img').hover(function(){
		// on rollover
		$(this).stop().animate({ 
			opacity: "0.5" 
		}, "fast");
	} , function() { 
		// on out
		$(this).stop().animate({
			opacity: "1" 
		}, "fast");
	});
		
	// Footer menu rollover --------------------------------------------------- //

	$('#footer .col .page_item').hover(function(){
		// over
		$(this).children('a').stop().animate({ marginLeft: "5"	}, "fast");
	} , function(){
		// out
		$(this).children('a').stop().animate({marginLeft: "0"}, "fast");
	});
	
	
	// Scroll to letter ------------------------------------------------------ //
    	
	$('#tags-filter li a').click(function(){ 
		var n = $(this).attr('class');
		n = n.substr(3);
		$.scrollTo( '#letter-'+ n, 300 ); 
	});
	
	// Update content to latest listings
	
	$("#Item1").html(' \
		<a href="project.html" class="thumb" title="An image"><img src="img/dummies/300x200.gif" alt="Post" /></a> \
							<div class="excerpt"> \
								<a href="project.html" class="header">Lorem ipsum dolor</a> \
								<a href="project.html" class="text">CHANGE</a> \
								<div class="meta">Admin on 23 Jun, 2010</div> \
							</div> \
	');
	
	loadJSONDoc();
	
});
	
// Make AJAX request
function loadJSONDoc() {
	// var xmlhttp;
	// if (window.XMLHttpRequest) {
	//   // code for IE7+, Firefox, Chrome, Opera, Safari
	//   xmlhttp=new XMLHttpRequest();
	// }
	// else {
	//   // code for IE6, IE5
	//   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	// }
	// xmlhttp.onreadystatechange=function() {
	//   if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	//   	var resParse = JSON.parse(xmlhttp.responseText);
	//   	console.log(resParse);
	// 	$("#Item1").html(resParse);
	//   }
	// }
	// xmlhttp.open("GET","http://72.76.204.54:8080/init",true);
	// //xmlhttp.open("GET","http://:8080/init",true);
	// xmlhttp.send(null);

	var method = 'GET'
	var url = 'http://72.76.204.54:8888/init'
	
	var xhr = createCORSRequest(method, url);
	if (!xhr) {
		alert('CORS not supported');
		return;
	}
	xhr.onload = function() {
		var text = xhr.responseText;
		console.log(text);
	};
	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
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
	
// search clearance	

function defaultInput(target, string){
	if((target).value == string){(target).value=''}
}

function clearInput(target, string){
	if((target).value == ''){(target).value=string}
}


// Skin changer (for demo only)

function changeSkin(skin){
	document.getElementById('css-skins').href = 'skins/'+skin+'.css';
}


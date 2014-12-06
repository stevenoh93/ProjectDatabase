// Jquery with no conflict

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
	
});	
	
	
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

function selectPage() {
	var curP = $('#light-pagination').pagination('getCurrentPage');
	loadProjs(curP);
}

// In upload.html
function promptPassword(pid, i) {
	var curState = document.getElementById('pwdButton'+i).value;
	if(curState === 'Edit') {
		document.getElementById('edit-pwd'+i).style.visibility = 'visible';
		document.getElementById('pwd'+i).focus();
		document.getElementById('pwd'+i).select();
		document.getElementById('pwdButton'+i).value = 'Submit';
	}
	else {
		document.getElementById('edit-pwd'+i).style.visibility = 'hidden';
		document.getElementById('pwdButton'+i).value = 'Edit';
		var pwd = document.getElementById('pwd'+i).value;
		document.getElementById('pwd'+i).value="";
		console.log("pid " + pid);
		if(pwd != null) {
			makeCORSRequest('GET','http://72.76.204.54:8888/pwd/pid=' + pid, function(data) {  // Returns a set of passwords
				if(data == 'err')
					alert('Something went wrong');
				else {
					var correctPwd = false;
					// Check against passwords of all contributers
					for(var i=0; i<data.length-1; i++) {
						console.log(data[i]);
						var curData = JSON.parse(data[i]);
						if(curData.pwd === pwd) {
							// Go on to edit page 
							correctPwd=true;
							var prevLoc = window.location.href.split("/");
							var toLoc="";
							for(var i=0; i<prevLoc.length-1;i++)
								toLoc+=prevLoc[i]+'/';
							toLoc+='upload.html?pid=' + pid;
							window.location.href=toLoc;
						} 
					} 
					if(!correctPwd) {
						alert("Incorrect Password!");
					}
				}
			});
		}
	}
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

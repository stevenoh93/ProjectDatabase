jQuery(document).ready(function($) {

	// on submit...
	$("#submitButton").click(function() {
		
		//required:
		
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
		if(comments == "" || comments == "Separate Names By Enter"){
			$("#sid").focus();
			return false;
		}
		
	});  
		
    return false;
});


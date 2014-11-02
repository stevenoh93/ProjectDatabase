//Script to load projects
window.onload = loadMainPage

function loadMainPage() {
	document.getElementById("Item1").innerHTML = 
		'<a href="project.html" class="thumb" title="An image"><img src="img/dummies/300x200.gif" alt="Post" /></a> \
			<div class="excerpt"> \
				<a href="project.html" class="header">Lorem ipsum dolor</a> \
				<a href="project.html" class="text">Changed content with javascript again!</a> \
				<div class="meta">Admin on 23 Jun, 2010</div> \
			</div>'
}

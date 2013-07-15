/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

Textual.viewFinishedLoading = function()
{
	Textual.fadeInLoadingScreen(1.00, 0.95);
	
	setTimeout(function() {
		Textual.scrollToBottomOfView()
	}, 500);
}

Textual.viewFinishedReload = function()
{
	Textual.viewFinishedLoading();
}

Textual.newMessagePostedToView = function(lineNumber) 
{
	/* The how far away from the left message wrapping should be. */
	messageLineLeftMargin = 145;
	
	/* Find lines. The line ID changed in version 3.1.0 of Textual so we must
	query the new design as well as the old. */
	
	/* First we look for the old. */
	messageLine = document.querySelector("#line" + lineNumber + ".text .message");
	lineWrapper = document.querySelector("#line" + lineNumber + ".text p");
	
	/* Look for newer ones if the old are not found. */
	if (messageLine == undefined) {
		messageLine = document.querySelector("#line-" + lineNumber + ".text .message");
	}
	
	if (lineWrapper == undefined) {
		lineWrapper = document.querySelector("#line-" + lineNumber + ".text p");
	}
	
	/* Get timestamp width calculated by Textual stored in baseLayout.mustache. */
	timestampWidth = document.getElementById("timestampWidth").innerHTML;
	
	/* Only continue if we have all the information we need. */
	if (messageLine && lineWrapper && timestampWidth) {
		/* Set math of our wrapper line. This is the paragraph <p> right after
		our top most <div> */
		lineWrapper.style.marginLeft = messageLineLeftMargin;
		lineWrapper.style.textIndent = -(messageLineLeftMargin);
		
		/* Set the padding right of the message text. We set the padding here so that
		the timestamp does not get obstructed. */
		messageLine.style.paddingRight = timestampWidth;
	}
}

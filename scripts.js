/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

Whisper = {
	
	mappedSelectedUsers : [],
	
	getLine: function(lineNum) {
		return document.getElementById('line-' + lineNum);
	},

	getSender: function(line) {
		if (line) {
			return line.querySelector('.sender');
		} else {
			return null;
		}
	},
	
	getInnerMessage : function(line) {
		if (line) {
			return line.querySelector('.innerMessage');
		} else {
			return null;
		}
	},

	getSenderNick: function(sender) {
		if (sender) { return sender.getAttribute('nickname'); }
	},

	getPreviousLine: function(line) {
		var prevLine = line.previousElementSibling;
		if (prevLine && prevLine.classList && prevLine.classList.contains('line')) {
			return prevLine;
		}
	},

	getLineType: function(line) {
		return line ? line.getAttribute('ltype') : null;
	},

	coalesceLines: function(lineNum) {
		var line = Whisper.getLine(lineNum);
		var prevLine = Whisper.getPreviousLine(line);

		var sender = Whisper.getSender(line);
		var prevSender = Whisper.getSender(prevLine);

		var senderNick = Whisper.getSenderNick(sender);
		var prevSenderNick = Whisper.getSenderNick(prevSender);

		var type = Whisper.getLineType(line);
		var prevType = Whisper.getLineType(line);


		if (!sender || !prevSender ) { return; }

		if (senderNick === prevSenderNick && type === 'privmsg' && prevType === 'privmsg') {
			line.classList.add('coalesced');
			sender.innerHTML = '';
		}
	},
	
	enableEmoticonIfSet : function(lineNum){
		var line = Whisper.getLine(lineNum);
		var innerMessage = Whisper.getInnerMessage(line);
		
		if (innerMessage){
			var text = innerMessage.innerHTML; 
			if (text.indexOf("!whisper emoticons on") > -1){
				app.styleSettingsSetValue("enableEmoticon", true);
			}
			
			if (text.indexOf("!whisper emoticons off") > -1){
				app.styleSettingsSetValue("enableEmoticon", false);
			}
		}
	},
	
	
	updateNicknameAssociatedWithNewMessage: function(e)
	{
		/* We only want to target plain text messages. */
		var elementType = e.getAttribute("ltype");
	
		if (elementType == "privmsg" || elementType == "action") {
			/* Get the nickname information. */
			var senderSelector = e.querySelector(".sender");
	
			if (senderSelector) {
				/* Is this a mapped user? */
				var nickname = senderSelector.getAttribute("nickname");
	
				/* If mapped, toggle status on for new message. */
				if (this.mappedSelectedUsers.indexOf(nickname) > -1) {
					this.toggleSelectionStatusForNicknameInsideElement(senderSelector);
				}
			}
		}
	},
	
	toggleSelectionStatusForNicknameInsideElement: function(e)
	{
		/* e is nested as the .sender so we have to go three parents
		 up in order to reach the parent div that owns it. */
		var parentSelector = e.parentNode.parentNode.parentNode.parentNode;
	
		parentSelector.classList.toggle("selectedUser");
	},
	
	userNicknameSingleClickEvent: function(e)
	{
		/* This is called when the .sender is clicked. */
		var nickname = e.getAttribute("nickname");
	
		/* Toggle mapped status for nickname. */
		var mappedIndex = this.mappedSelectedUsers.indexOf(nickname);
	
		if (mappedIndex == -1) {
			this.mappedSelectedUsers.push(nickname);
		} else {
			this.mappedSelectedUsers.splice(mappedIndex, 1);
		}
	
		/* Gather basic information. */
		var documentBody = document.getElementById("body_home");
	
		var allLines = documentBody.querySelectorAll('div[ltype="privmsg"], div[ltype="action"]');
	
		/* Update all elements of the DOM matching conditions. */
		for (var i = 0, len = allLines.length; i < len; i++) {
			var sender = allLines[i].querySelectorAll(".sender");
	
			if (sender.length > 0) {
				if (sender[0].getAttribute("nickname") === nickname) {
					this.toggleSelectionStatusForNicknameInsideElement(sender[0]);
				}
			}
		}
	}
};

Emoticons = {
	
	list : {
		";)"        : "Wink.png",
		"X)~"        : "Facial.png",
		"&GT;:D"    : "Angry Face.png",
		":)"        : "Smile.png",
		"(:"        : "Smile.png",
		":@"        : "Angry Face.png",
		":["        : "Blush.png",
		":S"        : "Undecided.png",
		":&APOS;("  : "Crying.png",
		":|"        : "Foot In Mouth.png",
		":("        : "Frown.png",
		":O"        : "Gasp.png",
		":D"        : "Grin.png",
		"D:"        : "Gasp.png",
		" D:"        : "Gasp.png",
		"O:)"       : "Halo.png",
		"&LT;3"     : "Heart.png",
		"8)"        : "Wearing Sunglasses.png",
		":*"        : "Kiss.png",
		":$"        : "Money-mouth.png",
		":P"        : "Sticking Out Tongue.png",
		":\\"       : "Undecided.png",
		"(N)"       : "Thumbs Down.png",
		"(Y)"       : "Thumbs Up.png",
		"(NL)"      : "nl.png",
		"(OKEANOS)" : "okeanos.png",
		"(DRUDGE)"  : "drudge.png",
		"(CALTSAR)" : "caltsar.png"
	},
	
	replaceEmoticonFromText : function (text) {
		
		if (text.match(/color:/ig)) {
			return text;
		}
		
		text = text.replace(/(^D-?:)|\s(D-?:)|(X-?\)~|&gt;:d|;-?\)|:-?\)|\(-?:|(:-?@)|:-?\[|:-?s|:&apos;-?\(|:-?\||:-?\(|:-?o|:-?D|o:-?\)|&lt;3|8-?\)|:-?\*|:-?&apos;\(|(:-?\$|:-?p|:-?\\|\(N\)|\(Y\)|\(NL\)|\(OKEANOS\)|\(DRUDGE\)|\(CALTSAR\)))/ig, function(emote){ return Emoticons.imageForEmoticon(emote) } );
		
		return text;
	},
	
	
	
	imageForEmoticon : function (emote){
		window.console.log('emote = "' + emote + '"');
		var result = emote;
		var imageName = Emoticons.list[emote.replace('-', '').toUpperCase()];
	
		if (imageName == null) return emote;
	
		switch(emote){
			case ' D:':
				result = '&nbsp;<img src="img/emoticons/' + imageName + '" class="emoticon" alt="'+emote+'" onclick="removeEmoticon(this, \'' + emote.replace('&apos;', 'WHISPERAPOS') + '\');" />';
			default:
				result = '<img src="img/emoticons/' + imageName + '" class="emoticon" alt="'+emote+'" onclick="removeEmoticon(this, \'' + emote.replace('&apos;', 'WHISPERAPOS') + '\');" />';
		}
	
		return result;
	},
	
	replaceTextWithEmoticons : function (lineNum) {
		var line = Whisper.getLine(lineNum);
		var innerMessage = Whisper.getInnerMessage(line);
		
		if (innerMessage){
			var textWithEmoticon = Emoticons.replaceEmoticonFromText(innerMessage.innerHTML);
			innerMessage.innerHTML = textWithEmoticon;	
		}
		
	},
	
	isEnabled : function() {
		return app.styleSettingsRetrieveValue("enableEmoticon");
	}
	
}

Textual.viewFinishedLoading = function()
{
	Textual.fadeOutLoadingScreen(1.00, 0.95);

	setTimeout(function() {
		Textual.scrollToBottomOfView();
	}, 500);
};

Textual.viewFinishedReload = function()
{
	Textual.viewFinishedLoading();
};

Textual.newMessagePostedToView = function (lineNum) {
	Whisper.coalesceLines(lineNum);
	//Whisper.enableEmoticonIfSet(lineNum);
	// if(Emoticons.isEnabled()) {
	// 	Emoticons.replaceTextWithEmoticons(lineNum);
	// }
	
	var element = document.getElementById("line-" + lineNum);
	Whisper.updateNicknameAssociatedWithNewMessage(element);
};

Textual.nicknameSingleClicked = function(e)
{
	Whisper.userNicknameSingleClickEvent(e);
}

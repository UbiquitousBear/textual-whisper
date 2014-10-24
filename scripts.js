/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

Whisper = {
	
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
	Textual.fadeInLoadingScreen(1.00, 0.95);

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
	Whisper.enableEmoticonIfSet(lineNum);
	if(Emoticons.isEnabled()) {
		Emoticons.replaceTextWithEmoticons(lineNum);
	}
};

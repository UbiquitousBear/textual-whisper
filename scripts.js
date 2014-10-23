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
	}
};

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
};

$(function() {
	chrome.runtime.sendMessage({check: 'check'});

	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
	{
		if (typeof sender.tab === 'undefined')
		{
			if (msg.returnCheck)
			{
				$('#disconnect').hide();

				$('#ok').show();
			}
		}
	});

	setTimeout(function()
	{
		$('#modal_overlay').fadeOut();
	}, 300);

});
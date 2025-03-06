window.onload = function()
{
	chrome.storage.sync.get('isExtensionOn', function(result)
	{
		document.getElementById('extension').checked = result.isExtensionOn;
	});

	document.getElementById('extension').onclick = function()
	{
		chrome.storage.sync.set({'isExtensionOn': document.getElementById('extension').checked});
	}

	chrome.tabs.query({ currentWindow: true, active: true }, function (foundTabs)
	{
		if (foundTabs.length > 0)
		{
			var hostname = getHostName(foundTabs[0].url);

			chrome.storage.sync.get(hostname, function(result)
			{
				if (typeof result[hostname] === 'undefined')
				{
					document.getElementById('website').checked = true;
				}	
			});

			document.getElementById('website').onclick = function()
			{
				if (document.getElementById('website').checked)
				{
					chrome.storage.sync.remove(hostname);
				}
				else
				{
					chrome.storage.sync.set({[hostname]: false});
				}
			}
		}
	});
}

var getHostName = function(url)
{
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
};

$(function()
{
	$(document).on('click', '#open_site a', function(e)
	{
		e.preventDefault();

		chrome.tabs.query({ currentWindow: true, active: true }, function(foundTabs)
		{
			var tab = foundTabs[0],
			data = window.btoa(JSON.stringify({title: tab.title, file: tab.url, type: 'iframe', width: tab.width, height: tab.height}));

			chrome.runtime.sendMessage({data: data});
		});
	});
        
        $(document).on('click', '#check_extension a', function(e)
	{
		e.preventDefault();

		chrome.tabs.create({url: '/check.html'});
	});

	$(document).on('click', '#report a', function(e)
	{
		e.preventDefault();

		$('#report_content').toggle(0);
	});

	$(document).on('submit', '#report_content form', function(e)
	{
		e.preventDefault();
		var form = $(this);

		chrome.tabs.query({ currentWindow: true, active: true }, function(foundTabs)
		{
    		$.post(form.attr('action'), form.serialize() + '&' + $.param({url: foundTabs[0].url}), function(data)
			{
				$('#report_content').hide();
				$('#report a').hide();

				$('#success').show();

				setTimeout(function()
				{
					$('#success').hide();
					$('#report').css('margin-top', 0);
				}, 3000);
			});
		});
	});
});
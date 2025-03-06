$(function()
{
	$(document).on('click', 'a.native-messaging', function(e)
	{
		e.preventDefault();

		var data = $(this).data('data');

        var timer = setTimeout(function()
        {
            console.log('Gameload is not installed');
            $( ".gameload_not_working" ).show();
            $( ".gameload_check_video" ).show();
        }, 4000);

        chrome.runtime.sendMessage({data: data}, function(response)
        {
            if (response)
            {
                clearTimeout(timer);
                
                console.log('Gameload is running');
            }
        });
	});
        
        $(document).on('click', '.gameload_not_working a', function(e)
	{
		e.preventDefault();
                
                var userAgent = navigator.userAgent.toLowerCase();
                chrome.runtime.sendMessage({install_gameload: true, useragent: userAgent});
	});

    // chrome.runtime.sendMessage({hostname: window.location.hostname});

        /*
        if ($('#unityPlayer').length > 0) {
            // find and replace unity embed
            var unity_width = 800;
            var unity_height = 600;
            var unity_title;
            var unity_file;
            var unity_data;
            var html_content;

            $("#unityPlayer embed").hide();
            $("#unityPlayer .missing").hide();
            $("#unityPlayer .broken").hide();
            $("#ChromeMissingUnityPlayer").hide();

            unity_title = document.getElementsByTagName("title")[0].innerHTML;        
            html_content = $("html").html().replace(/\s+/g, '');

            var regExp = /u.initPlugin\(jQuery\("#unityPlayer"\)\[0\],"(.*?)"/gi;
            unity_file = regExp.exec(html_content);
            
            if (unity_file != null) {

                var regExp2 = /varconfig={width:(.*?),/gi;
                var config_width = regExp2.exec(html_content);

                if (config_width != null) {
                    var regExp3 = new RegExp('varconfig={width:' + config_width[1] + ',height:(.*?),', 'gi');
                    var config_height = regExp3.exec(html_content);
                    
                    if (config_height != null) {
                        if (!isNaN(config_width[1]) || !isNaN(config_height[1])) {
                            unity_width = config_width[1];
                            unity_height = config_height[1];
                        }
                    }
                }
                
                var myJsonString = JSON.stringify({ title: unity_title, file: unity_file[1], type: "unity", width: unity_width, height: unity_height });        
                unity_data = window.btoa(myJsonString);

                $("#unityPlayer").append('<div style="margin: auto;width:' + unity_width + 'px;height:' + unity_height + 'px;"><a class="native-messaging" href="#" data-data="' + unity_data + '">Play Game</a></div>')

                console.log(unity_data);
            }
        }*/
});

chrome.storage.sync.get('isExtensionOn', function(extension_result)
{
    if (extension_result.isExtensionOn)
    {
        chrome.storage.sync.get(window.location.hostname, function(website_result)
        {
            if (typeof website_result[window.location.hostname] === 'undefined')
            {
                var s = document.createElement('script');
                s.src = chrome.extension.getURL('unity.js');
                s.onload = function() {
                    this.parentNode.removeChild(this);
                };
                (document.head||document.documentElement).appendChild(s);
                
                //special
                var s = document.createElement('script');
                s.src = chrome.extension.getURL('special.js');
                s.onload = function() {
                    this.parentNode.removeChild(this);
                };
                (document.head||document.documentElement).appendChild(s);
            }
        });
    }
});

// var s = document.createElement('script');
// s.src = chrome.extension.getURL('unity.js');
// s.onload = function() {
//     this.parentNode.removeChild(this);
// };
// (document.head||document.documentElement).appendChild(s);
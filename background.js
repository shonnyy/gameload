chrome.storage.sync.get('isExtensionOn', function(result)
{
    if (typeof result.isExtensionOn === 'undefined')
    {
        chrome.storage.sync.set({'isExtensionOn': true});
    }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
    if (msg.data)
    {
        chrome.runtime.sendNativeMessage('com.ant_media.game_load', {data: msg.data}, function(response)
        {
            sendResponse(response.check);
        });

        return true;
    }

    if (msg.check)
    {
        chrome.runtime.sendNativeMessage('com.ant_media.game_load', {data: 'eyJ0aXRsZSI6IiIsImZpbGUiOiIiLCJ0eXBlIjoiY2hlY2siLCJ3aWR0aCI6MCwiaGVpZ2h0IjowfQ=='}, function(response)
        {
            if (response.check)
            {
                chrome.runtime.sendMessage({returnCheck: true});
            }
        });
    }
    if (msg.ua_change && msg.hostname)
    {
      chrome.storage.sync.get('isExtensionOn', function(extension_result)
        {       
            if (extension_result.isExtensionOn)
            {
                var hostname = msg.hostname;
                chrome.storage.sync.get(hostname, function(website_result)
                {
                    if (typeof website_result[hostname] === 'undefined')
                    {
                        sendResponse({ua_change_status: true});
                    }
                    else
                    {
                        sendResponse({ua_change_status: false});
                    }
                });
            }
            else
            {
                sendResponse({ua_change_status: false});
            }
        });
        
        return true;
    }
        
});

chrome.runtime.onInstalled.addListener(function(details)
{
    chrome.runtime.getPlatformInfo(function(info)
    {
        if (info.os == 'win' || info.os == 'mac')
        {
            if (details.reason === 'install')
            {
                chrome.tabs.create({url: '/check.html'});
            }
        }
        else
        {
            alert('Your operation system is not supported.');
            chrome.management.uninstallSelf();
        }
    });
});

chrome.contextMenus.create({
    title: 'Open this site in GameLoad',
    contexts: ['all'],
    onclick: function(info, tab)
    {
        var data = window.btoa(JSON.stringify({title: tab.title, file: tab.url, type: 'iframe', width: tab.width, height: tab.height}));

        chrome.runtime.sendNativeMessage('com.ant_media.game_load', {data: data});
    }
});

// chrome.webRequest.onBeforeRequest.addListener(
//         function(details) { return {cancel: true}; },
//         {urls: ["*://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js", "*://ssl-webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js",
//         "*://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject.js", "*://ssl-webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject.js"]},
        
//         ["blocking"]
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//     function(info) {
//         var headers = info.requestHeaders;
//         headers.forEach(function(header, i) {
//             if (header.name.toLowerCase() == 'user-agent') { 
//                 header.value = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0';
//             }
//         });
//         return {requestHeaders: headers};
//     },
//     {
//         urls: ["http://*/*", "https://*/*"]
//         // urls: ["*://www.google.sk/*", "*://stackoverflow.com/*"] filter pre konkretne domeny
//     }, ["requestHeaders", "blocking"]
// );






chrome.tabs.onActivated.addListener(function(activeInfo)
{
    chrome.tabs.get(activeInfo.tabId, function(tab)
    {
        runCallback(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab)
{
    chrome.tabs.query({'active': true}, function(activeTabs)
    {
        var activeTab = activeTabs[0];

        if (activeTab.url == updatedTab.url)
        {
            runCallback(activeTab);
        }
    });
});

function runCallback(tab)
{
    var hostname = getHostName(tab.url);
    console.log(hostname);
    chrome.storage.sync.get('isExtensionOn', function(extension_result)
    {
        if (extension_result.isExtensionOn)
        {
            console.log('extensionON');
            chrome.storage.sync.get(hostname, function(website_result)
            {
                if (typeof website_result[hostname] === 'undefined')
                {
                    console.log('websiteON: ' + hostname);

                    // vykonanie kodu
                    hostnameFilters = ['www.y8.com', 'www.kongregate.com', 'a.kongregate.com', 'www.kogama.com', 'www.miniplay.com', 'www.minijuegos.com', 'www.macrojuegos.com', 'www.crazygames.com', 'criticalstrikeportable.com'];

                    if (hostnameFilters.indexOf(hostname) == -1)
                    {
                        blockWebplayer();
                        console.log('hostnameON: ' + hostname);
                    }
                    else {
                        chrome.webRequest.onBeforeRequest.removeListener(blockWebplayerListener);
                        console.log('hostnameOFF: ' + hostname);
                    }

                    chrome.webRequest.onBeforeSendHeaders.addListener(
                        function(info) {
                            var headers = info.requestHeaders;
                            headers.forEach(function(header, i) {
                                if (header.name.toLowerCase() == 'user-agent') { 
                                    header.value = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0';
                                }
                            });
                            return {requestHeaders: headers};
                        },
                        {
                            urls: ['*://www.gamevial.com/*', '*://www.kogama.com/*', '*://www.miniplay.com/*', '*://www.minijuegos.com/*']
                        }, ["requestHeaders", "blocking"]
                    );

                }
                else {
                    chrome.webRequest.onBeforeRequest.removeListener(blockWebplayerListener);
                    console.log('websiteOFF: ' + hostname);
                }
            });
        }
        else {
            chrome.webRequest.onBeforeRequest.removeListener(blockWebplayerListener);
            console.log('extensionOFF');
        }
    });
}

var getHostName = function(url)
{
    var a = document.createElement('a');
    a.href = url;
    return a.hostname;
};

var blockWebplayerListener = function(details) { return {cancel: true}; };

var blockWebplayer = function() {
    chrome.webRequest.onBeforeRequest.addListener(blockWebplayerListener,
            {urls: ["*://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js", "*://ssl-webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js",
            "*://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject.js", "*://ssl-webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject.js"]},

            ["blocking"]
    );
};
chrome.runtime.sendMessage({ua_change: true, hostname: window.location.hostname}, function(response) {

if (response.ua_change_status) {
    
    
document.addEventListener('beforeload', function()
{
    hostnameFilters = ['www.kongregate.com', 'a.kongregate.com', 'www.gamevial.com', 'www.kogama.com', 'poki.com', 'www.gamesfreak.net', 'www.clickjogos.com.br']; // filter
    if (hostnameFilters.indexOf(window.location.hostname) != -1)
    {
        Object.defineProperty(window.navigator, 'userAgent',
        { 
            get: function()
            { 
                return ('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0'); 
            } 
        });
    }
    
    hostnameFilters = ['www.kogama.com', 'www.newgrounds.com']; // filter
    if (hostnameFilters.indexOf(window.location.hostname) === -1)
    {
        var isUnityInstalled = false;                                    
        for (var i = 0; i < navigator.plugins.length; i++)
        {
            if (navigator.plugins[i].name === 'Unity Player') isUnityInstalled = true;
        }

        if (!isUnityInstalled) 
        {
            var unityMimeTypes = function()
            {
                var setting = {enabledPlugin: true, description: 'Unity Player datafile', suffixes: 'unity3d', type: 'application/vnd.unity'};
                return setting;
            };
            var unityPlugin = function()
            {
                var setting = {name: 'Unity Player', description: 'Unity Player 5.2.2f1', filename: 'npUnity3D32.dll', version: '5.2.2.22320'};
                return setting;
            };

            var unityMimeTypes = new unityMimeTypes();
            var unityPlugin = new unityPlugin();
            
            navigator.mimeTypes['application/vnd.unity'] = unityMimeTypes;
            navigator.plugins['Unity Player'] = unityPlugin ;
        }
    }
}, true);

var a = document.createElement('script');
a.type = 'text/javascript';
a.innerText += 'if(hostnameFilters=["www.kongregate.com","a.kongregate.com","www.gamevial.com","www.kogama.com","poki.com","www.gamesfreak.net","www.clickjogos.com.br"],-1!=hostnameFilters.indexOf(window.location.hostname)&&Object.defineProperty(window.navigator,"userAgent",{get:function(){return"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0"}}),hostnameFilters=["www.kogama.com","www.newgrounds.com"],-1===hostnameFilters.indexOf(window.location.hostname)){for(var isUnityInstalled=!1,i=0;i<navigator.plugins.length;i++)"Unity Player"===navigator.plugins[i].name&&(isUnityInstalled=!0);if(!isUnityInstalled){var unityMimeTypes=function(){var n={enabledPlugin:!0,description:"Unity Player datafile",suffixes:"unity3d",type:"application/vnd.unity"};return n},unityPlugin=function(){var n={name:"Unity Player",description:"Unity Player 5.2.2f1",filename:"npUnity3D32.dll",version:"5.2.2.22320"};return n},unityMimeTypes=new unityMimeTypes,unityPlugin=new unityPlugin;navigator.mimeTypes["application/vnd.unity"]=unityMimeTypes,navigator.plugins["Unity Player"]=unityPlugin}}';
//document.documentElement.insertBefore(a, document.documentElement.firstChild);

if( document.getElementsByTagName('head')[0].length !== 0 )
{
    document.getElementsByTagName('head')[0].appendChild(a);
}

}

});
function GameLoadInstalled() {
    return true;
}

GLhostnameFilters = ['www.y8.com', 'www.kongregate.com', 'a.kongregate.com', 'www.kogama.com', 'www.gamevial.com', 'www.miniplay.com', 'www.minijuegos.com', 'www.macrojuegos.com', 'www.crazygames.com', 'criticalstrikeportable.com'];

if (GLhostnameFilters.indexOf(window.location.hostname) == -1)
{
    var UnityObject2 = function(config) {
        
        this.initPlugin = function(aj, al) {
            var options = [aj, al, config.width, config.height, 'unity'];
            GLdocReady(GLreplaceUnity, options);
            console.log('UnityObject2 ' + window.location.hostname);
        }

        this.observeProgress  = function(aj) {
        }

        this.installPlugin  = function(aj) {
            return null;
        }

        this.getUnity  = function() {
            return null;
        }
    };

    if (typeof unityObject == "undefined") {
        var unityObject = function() {    
            return {
                embedUnity: function(aR, aT, aP, aO, an, aS, aQ) {
                    var options = [aR, aT, aP, aO, 'unity'];
                    GLdocReady(GLreplaceUnity, options);
                    console.log('unityObject ' + window.location.hostname);
                },
                
                detectUnity: function(aO, an) {
                    console.log('detectUnity' + window.location.hostname);
                    return "installed";
                }
            }
        }();
    }
}
 
// try find embed with type = application/vnd.unity
if (window.attachEvent) {window.attachEvent('onload', GLFind);}
else if (window.addEventListener) {window.addEventListener('load', GLFind, false);}
else {document.addEventListener('load', GLFind, false);}

var GLmousemove = true;
   
function GLFind() {
    
    document.addEventListener("mousemove", GLmouseUnity, false);
    function GLmouseUnity() {
        var mouse_unity = document.querySelectorAll('[type="application/vnd.unity"]');
        for (var i=0;i<mouse_unity.length;i++){
            mouse_unity[i].addEventListener("mousemove", GLmouseunityFound, false);
        }
    }

    var meta_tag = GLFindMetaTag();

    if ((typeof meta_tag === 'object') && (meta_tag !== null))
    {
        var options = [document.querySelector(meta_tag.divId), meta_tag.file, meta_tag.width, meta_tag.height, meta_tag.type];
        GLreplaceUnity(options);
    }
    else
    {
        var find_embed = GLFindByAttributeValue("type","application/vnd.unity");
        if (typeof(find_embed) != 'undefined' && find_embed != null)
        {
            var find_file = find_embed.getAttribute('src');
            if (!find_file) find_file = find_embed.getAttribute('data');
            
            var find_unity_div = find_embed.parentElement;
            /*var find_unity_id = find_unity_div.getAttribute('id');
            if (find_unity_id != undefined && find_unity_id != null && find_unity_id != "") {
                find_unity_id = 'UnityParentDiv';
                find_unity_div.setAttribute('id', find_unity_id);
            }*/
            var options = [find_unity_div, find_file, find_unity_div.clientWidth, find_unity_div.clientHeight, 'unity'];
            GLreplaceUnity(options);
        }
    }
} 

// Replace unity embed with my link
/* URLs with troubles:
 * http://www.y8.com/games/madalin_stunt_cars_multiplayer
 * http://www.superhry.cz/hra/9181-mini-kingdom
 * http://www.kongregate.com/games/HyperHippoGames/adventure-capitalist?haref=HP_MPG_adventure-capitalist
 * */

function GLreplaceUnity(options) {  //unity div id, url, width, height, type  
    
    var unity_title = 'Online Game';
    //var unity_div_id = '#' + jQuery(options[0]).attr("id");
    if( typeof options[0] === 'string' ) {
        var unity_html_element = document.getElementById(options[0]);       
    }else {
        var unity_html_element = options[0]; 
    }
    
    //protect before replace all website
    var dangerous_tags = ["body", "html", "head"];
    if (dangerous_tags.indexOf(unity_html_element.tagName.toLowerCase()) === -1) {

        if (document.getElementsByTagName("title").length > 0) unity_title = encodeURI(document.getElementsByTagName("title")[0].innerHTML);

        /*var missing_div = document.querySelectorAll(unity_div_id + " .missing");
        for(var i = 0; i < missing_div.length; i++) missing_div[i].style.display = 'none';

        var broken_div = document.querySelectorAll(unity_div_id + " .broken");
        for(var i = 0; i < broken_div.length; i++) broken_div[i].style.display = 'none';

        var unsupported_div = document.querySelectorAll(unity_div_id + " .unsupported");
        for(var i = 0; i < unsupported_div.length; i++) unsupported_div[i].style.display = 'none';*/

        unity_html_element.style.display = 'block';
        unity_html_element.style.visibility = 'visible';

        if (!isNaN(options[2]) && !isNaN(options[3])) {
            if (options[2] <= 0 || options[3] <= 0) {
                var unity_width = 800;
                var unity_height = 600;
                var unity_width_style = '100%';
                var unity_height_style = '100%';
            } else {
                var unity_width = options[2];
                var unity_height = options[3];
                var unity_width_style = unity_width + 'px';
                var unity_height_style = unity_height + 'px';
            }
        } else {
            var unity_width = 800;
            var unity_height = 600;
            var unity_width_style = '100%';
            var unity_height_style = '100%';
        }

        // if it is relative path, change it to absolute
        var link = document.createElement("a");
        link.href = options[1];
        var unity_file = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
        var myJsonString = JSON.stringify({ title: unity_title, file: unity_file, type: options[4], width: unity_width, height: unity_height });
        unity_data = window.btoa(myJsonString);

        var myJsonString = JSON.stringify({ title: unity_title, file: window.location.href, type: "iframe", width: 980, height: 700 });
        page_data = window.btoa(myJsonString);

        unity_html_element.innerHTML = '<div class="gameload_window" style="width:' + unity_width_style + ';height:' + unity_height_style + ';"><div class="gameload_content"><a class="native-messaging gameload_playgame" href="#" data-data="' + unity_data + '"></a><a class="native-messaging gameload_playpage" href="#" data-data="' + page_data + '">Or open the whole site</a><p class="gameload_not_working">If <strong>"PLAY"</strong> button is not working, try to reinstall <strong><a href="#">GameLoad program</a></strong>.</p><p class="gameload_check_video"><a href="https://www.youtube.com/watch?v=KEpCShgsBMU" target="_blank">Check the video tutorial</a></p></div></div>';
        
        console.log(unity_data);
        console.log(options);

        console.log(window.location.hostname);
        
    }
}

// Doc Ready
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "GLdocReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("GLdocReady", window);

function GLFindByAttributeValue(attribute, value)    {
  var All = document.getElementsByTagName('*');
  for (var i = 0; i < All.length; i++)       {
    if (All[i].getAttribute(attribute) == value) { return All[i]; }
  }
}

function GLFindMetaTag()
{
    // <meta data-unity-replace="true" data-div-id="" data-file="" data-width="111" data-height="111" />
    var x = document.querySelectorAll('[data-unity-replace="true"][data-div-id][data-file]');
    if (typeof x[0] !== 'undefined' && x[0].getAttribute("data-div-id") != "" && x[0].getAttribute("data-file") != "")
    {
        var divIdValue = x[0].getAttribute("data-div-id"),
            fileValue = x[0].getAttribute("data-file"),
            widthValue = x[0].getAttribute("data-width"),
            heightValue = x[0].getAttribute("data-height"),
            fileType = x[0].getAttribute("data-type");

        return {
            divId: divIdValue,
            file: fileValue,
            width: ((widthValue == null || widthValue == "") ? 800 : widthValue),
            height: ((heightValue == null || heightValue == "") ? 600 : heightValue),
            type: ((fileType == null || fileType == "") ? "unity" : fileType)
        };
    }
    else return false;
}

function GLmouseunityFound()
{
    if (GLmousemove) {
        GLmousemove = false;
        GLFind();
    }
}  
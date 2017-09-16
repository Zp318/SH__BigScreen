(function() {
    var isWinRT = (typeof Windows === "undefined") ? false : true;
    var r = new RegExp("(^|(.*?\\/))(SuperMap.Include\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'),
    src, m, baseurl = "";
    for(var i=0, len=s.length; i<len; i++) {
        src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                baseurl = m[1];
                break;
            }
        }
    }
    function inputScript(inc){
        if (!isWinRT) {
            var script = '<' + 'script type="text/javascript" src="' + inc + '"' + '><' + '/script>';
            document.writeln(script);
        } else {
            var script = document.createElement("script");
            script.src = inc;
            document.getElementsByTagName("HEAD")[0].appendChild(script);
        }
    }
    function inputCSS(style){
        if (!isWinRT) {
            var css = '<' + 'link rel="stylesheet" href="' + baseurl + '../theme/default/' + style + '"' + '><' + '/>';
            document.writeln(css);
        } else { 
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href =  "/theme/default/" + style;
            document.getElementsByTagName("HEAD")[0].appendChild(link);
        }
    }
    //加载类库资源文件
    function loadSMLibs() {
        inputScript(baseurl+'SuperMap-6.1.3-10426.js');
        inputCSS('style.css');
    }

    //引入汉化资源文件
    function loadLocalization() {
        inputScript(baseurl + 'Lang/zh-CN.js');
    }

    //异步批量加载脚本，并且根据数组urlArray中的url顺序来加载
    function attachScript1(urlArray, callback, id) {
        if(urlArray && ((typeof urlArray) == "object"))
        {
            if(urlArray.constructor == Array)
            {
                if(urlArray.length>1)
                {
                    var array = urlArray.splice(0,1);
                    return function(){
                        var dataScript = document.createElement('script');
                        dataScript.type = 'text/javascript';
                        if(dataScript.readyState) { //IE
                            dataScript.onreadystatechange = function() {
                                if(dataScript.readyState == 'complete'|| dataScript.readyState == 'loaded'){
                                    dataScript.onreadystatechange = null;
                                    attachScript1(urlArray,callback,id)();
                                }
                            }
                        } else { //standers
                            dataScript.onload = function() {
                                attachScript1(urlArray,callback,id)();
                            }
                        }
                        dataScript.src = array[0];
                        dataScript.id = id;
                        document.body.appendChild(dataScript);
                    }
                }
                else if(urlArray.length == 1)
                {
                    return function(){
                        var dataScript = document.createElement('script');
                        dataScript.type = 'text/javascript';
                        if(dataScript.readyState) { //IE
                            dataScript.onreadystatechange = function() {
                                if(dataScript.readyState == 'complete'|| dataScript.readyState == 'loaded'){
                                    dataScript.onreadystatechange = null;
                                    callback();
                                }
                            }
                        } else { //standers
                            dataScript.onload = function() {
                                callback();
                            }
                        }
                        dataScript.src = urlArray[0];
                        dataScript.id = id;
                        document.body.appendChild(dataScript);
                    }
                }
            }
        }
    }

    loadSMLibs(); loadLocalization();

})();

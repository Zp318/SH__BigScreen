/**
 * @fileOverview  
 * <pre>
 * sweet业务组件总入口，动态加载业务组件的css、js文件
 * 2014/1/30
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

var businessDebug = false; // 是否debug，默认false
var SweetBusniessLoad = {
    /**
     * @private
     * @description debug标识名
     * @type {String}
     */
    _debugFlagName: "businessDebug",
    /**
     * @private
     * @description 该文件名称
     * @type {String}
     */
    _fileName: "business-cmp-all.js",
    /**
     * @description 动态加载css、js文件
     * @param {String} path 文件相对路径
     * @param {Array} arrFiles 文件列表
     */
    dynaInclude: function(path, arrFiles) {
        var files = typeof arrFiles === "string" ? [arrFiles] : arrFiles,
                name, nameArr, suffix, isCSS, tagName, tagAttr, link;
        for (var i = 0; i < files.length; i++) {
            name = files[i].replace(/^\s|\s$/g, "");
            nameArr = name.split('.');
            suffix = nameArr[nameArr.length - 1].toLowerCase();
            isCSS = suffix === "css";
            tagName = isCSS ? "link" : "script";
            tagAttr = isCSS ? " type='text/css' rel='stylesheet' " : " ";
            link = (isCSS ? "href" : "src") + "='" + path + name + "'";
            document.write("<" + tagName + tagAttr + link + "></" + tagName + ">");
        }
    },
    /**
     * @description 动态加载文件
     */
    include: function() {
        var url = document.URL,
                pos = url.indexOf("?"),
                params,
                tempParam,
                tempObj;
        if (-1 !== pos) {
            params = url.substr(pos + 1).split("&");
            for (var i = 0; i < params.length; i++) {
                tempParam = params[i].split("=");
                if (this._debugFlagName === tempParam[0]) {
                    businessDebug = ("true" === tempParam[1] ? true : false);
                    break;
                }
            }
        }

        /**
         * @description 获取文件相对路径及相关配置信息
         */
        function getRelativeInfo() {
            var regex = /\.\./g,
                    flag = false,
                    relativePath = "",
                    layers = 0,
                    tempArr,
                    isMap = false,
                    tempAttrs,
                    tempValue,
                    tempNodeName,
                    tempName,
                    temp,
                    scripts = document.getElementsByTagName("script");
            // 计算相对路径深度
            for (var i = 0; i < scripts.length; i++) {
                tempAttrs = scripts[i].attributes;
                if (!tempAttrs) {
                    continue;
                }
                for (var j = 0; j < tempAttrs.length; j++) {
                    tempNodeName = tempAttrs[j].nodeName.toLowerCase();
                    tempValue = tempAttrs[j].nodeValue;
                    if (!tempValue && "src" !== tempNodeName && "map" !== tempNodeName) {
                        continue;
                    }

                    if ("src" === tempNodeName) {
                        tempName = tempValue.substr(tempValue.lastIndexOf("/") + 1);
                        if (SweetLoad._fileName === tempName) {
                            // 如果采用http或https方式引用
                            if (0 === tempValue.indexOf("http")) {
                                // 截取域名和应用名
                                tempArr = tempValue.split("/");
                                relativePath = tempArr[0] + "//" + tempArr[2] + "/" + tempArr[3] + "/" + tempArr[4] + "/";
                            } else {
                                temp = tempValue.replace(regex, "");
                                layers = (tempValue.length - temp.length) / 2;
                                for (var k = 0; k < layers; k++) {
                                    relativePath += "../";
                                }
                                //tomcat分步式后，每个应用下都放有一份sweetui，外面引用的相对路径需要加上sweet文件夹名称
                                relativePath += "sweet/";
                            }
                        }
                    }
                }
            }

            return {"path": relativePath};
        }

        tempObj = getRelativeInfo();
        // 获取页面的相对路径
        this.businessBasePath = tempObj.path;
       
        if (businessDebug) {
            // 加载公共css文件
            this.dynaInclude(this.businessBasePath + 'business-cmp/themes/css/', ['business-cmp.css']);
            
            // 加载国际化文件
            this.dynaInclude(this.businessBasePath + 'business-cmp/i18n/', ['business.i18n.js']);
			this.dynaInclude(this.businessBasePath, ['business-cmp/business.js']);
            // 加载component文件
            this.dynaInclude(this.businessBasePath + 'business-cmp/components/', [
				'functions.js',
                "business.cmp.timeRange.js",
                "business.cmp.area.js",
                "business.cmp.more.js",
                "business.cmp.queryCondition.js",
                "business.cmp.conditionManage.js",
				"business.cmp.failCauseReport.js",
                "business.cmp.line.js",
                "business.cmp.column.js",
                "business.cmp.grid.js",
                "business.cmp.report.js",
                "business.cmp.page.js",
                "business.cmp.queryModel.js"
            ]);
        } else {
            // 加载公共css文件
            this.dynaInclude(this.businessBasePath + 'business-cmp/themes/css/', ['business-cmp.css']);
            // 加载component组件
            this.dynaInclude(this.businessBasePath, ['business-cmp/business-cmp.min.js']);
        }
    }
};

// 加载css、js文件
SweetBusniessLoad.include();
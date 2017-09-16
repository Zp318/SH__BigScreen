/**
 * @fileOverview  
 * <pre>
 * sweet组件总入口，动态加载css、js文件
 * 2013/1/30
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

var sweetDebug = false; // 是否debug，默认false
var SWEET_JS_BASE_PATH = "";
var SweetLoad = {
    /**
     * @private
     * @description debug标识名
     * @type {String}
     */
    _debugFlagName: "sweetDebug",
    /**
     * @private
     * @description 该文件名称
     * @type {String}
     */
    _fileName: "sweet-ui-all.js",
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
                    sweetDebug = ("true" === tempParam[1] ? true : false);
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
                    } else if ("map" === tempNodeName) {
                        if ("true" === tempValue) {
                            isMap = true;
                        }
                    }
                }
            }

            return {"path": relativePath, "isMap": isMap};
        }

        tempObj = getRelativeInfo();
        // 获取页面的相对路径
        SWEET_JS_BASE_PATH = this.basePath = tempObj.path;
        this.isMap = tempObj.isMap;

        // 公共加载文件
        // 加载继承基类
        this.dynaInclude(this.basePath + 'lib/base/', ['base.js']);
        //加载Amcharts画图表的组件
        this.dynaInclude(this.basePath + 'lib/amcharts/amcharts/', ['amcharts-min.js']);
		//加载图片导出svg转换成canvas组件
		this.dynaInclude(this.basePath + 'lib/canvg/', ['canvg.js','rgbcolor.js']);
        this.dynaInclude(this.basePath + 'lib/json/', ['json2.js']);

        if (this.isMap) {
            // 加载超图文件
            this.dynaInclude(this.basePath + 'lib/supermap/', ['SuperMap.Include.js']);
            this.dynaInclude(this.basePath + 'lib/supermap/', ['Supermap-js-flex.js']);
            this.dynaInclude(this.basePath + 'lib/supermap/', ['swfobject.js']);
            this.dynaInclude(this.basePath + 'lib/supermap/layer/', ['SphericalMercator.js',
                'FixedZoomLevels.js',
                'EventPane.js',
                'Google.js',
                'Google.v3.js']);
            this.dynaInclude(this.basePath + 'lib/theme/default/', ['google.css']);
        }
        
		this.dynaInclude(this.basePath + 'lib/jqueryui/themes/css/', ['jquery-ui.css']);
		
        if (sweetDebug) {
            // 加载公共css文件
            this.dynaInclude(this.basePath + 'themes/default/', ['cssreset-min.css', 'sweet.css']);
            // 加载core css文件
            this.dynaInclude(this.basePath + 'themes/default/core/', ['sweet.form.css',
                'sweet.combobox_v1.css',
                'sweet.grid.css',
                'sweet.dialog.css',
                'sweet.panel.css',
                'sweet.menu.css',
                'sweet.chart.css',
                'sweet.bxCarousel.css',
                'sweet.calculator.css',
                'sweet.list.css',
                'sweet.optimizeList.css',
                'sweet.ratioindicator.css',
                'sweet.listbox.css',
                'sweet.tree.css',
                'sweet.tree_v1.css',
                'sweet.portal.css',
                'sweet.slider.css',
                'sweet.arrayindicator.css',
                'sweet.errorInterface.css',
                'sweet.progress.css',
                'sweet.scoreCard.css',
                'sweet.stateItem.css',
                'sweet.numCard.css']);
            // 加载components css文件
            this.dynaInclude(this.basePath + 'themes/default/components/', ['sweet.listwindown.css',
                'sweet.treewindown.css',
                "sweet.officedirection_v1.css",
                'sweet.busyhour.css',
				'sweet.appManager.css',
                'sweet.holiday.css']);
            // 加载raphaeljs绘图组件
            this.dynaInclude(this.basePath + 'lib/raphael/', ['raphael.js']);
            // 加载jquery组件
            this.dynaInclude(this.basePath + 'lib/jquery/', ['jquery-1.9.1.js']);
            // 加载jquery ui组件
            this.dynaInclude(this.basePath + 'lib/jqueryui/', ['jquery-ui-1.10.2.custom.js']);
            // 加载第三方插件
            this.dynaInclude(this.basePath + 'lib/jquery/plugins/easing/', ['jquery.easing.1.3.js',
                'jquery.easing.compatibility.js']);
            // 加载国际化文件
            this.dynaInclude(this.basePath + 'sweet/i18n/', ['sweet.core.i18n.js',
                'sweet.components.i18n.js',
                'sweet.business.i18n.js']);
            // 加载扩展jquery插件
            this.dynaInclude(this.basePath + 'sweet/plugins/', ['jquery.sweetmask.js', 'jquery.sweettip.js',
                'jquery.sweetdrag.js',
                'jquery.sweetutil.js']);
            // 加载sweet文件
            this.dynaInclude(this.basePath + 'sweet/', ['sweet.util.js', 'sweet.js']);
            // 加载sweet配置文件
            this.dynaInclude(this.basePath + 'sweet/', ['sweet.config.js']);
            // 加载sweet util文件
            this.dynaInclude(this.basePath + 'sweet/util/', ['jquery.sweettask.js']);
            // 加载sweet core文件
            this.dynaInclude(this.basePath + 'sweet/core/', ['jquery.sweet.widget.js', 'jquery.sweet.widget.dialog.js',
                "jquery.sweet.widget.menu.js",
                "jquery.sweet.widget.form.js",
                "jquery.sweet.widget.form.input.js",
                "jquery.sweet.widget.form.label.js",
                "jquery.sweet.widget.form.password.js",
                "jquery.sweet.widget.form.textfield.js",
                "jquery.sweet.widget.form.syntax.js",
                "jquery.sweet.widget.form.numberfield.js",
                "jquery.sweet.widget.form.ipfield.js",
                "jquery.sweet.widget.form.hexfield.js",
                "jquery.sweet.widget.form.spinner.js",
                "jquery.sweet.widget.form.date.js",
                "jquery.sweet.widget.form.textarea.js",
                "jquery.sweet.widget.form.selector.js",
                "jquery.sweet.widget.form.searchfield.js",
                "jquery.sweet.widget.form.cellSelect.js",
                "jquery.sweet.widget.form.fileUploadField.js",
                "jquery.sweet.widget.form.colorpicker.js",
                "jquery.sweet.widget.grid.js",
				"jquery.sweet.widget.bigGrid.js",
                "jquery.sweet.widget.chart.js",
                "jquery.sweet.widget.chart.speedometer.js",
                "jquery.sweet.widget.chart.topology.js",
                "jquery.sweet.widget.chart.dashLine.js",
                "jquery.sweet.widget.chart.line.js",
                "jquery.sweet.widget.chart.pie.js",
                "jquery.sweet.widget.chart.indicator.js",
                "jquery.sweet.widget.chart.simpletopology.js",
                "jquery.sweet.widget.chart.gridLegend.js",
                "jquery.sweet.widget.chart.tiles.js",
		        "jquery.sweet.widget.chart.sequenceChart.js",
                "jquery.sweet.widget.chart.fishbone.js",
                "jquery.sweet.widget.form.button.js",
                "jquery.sweet.widget.form.radio.js",
                "jquery.sweet.widget.form.radiogroup.js",
                "jquery.sweet.widget.form.checkbox.js",
                "jquery.sweet.widget.form.checkboxgroup.js",
                "jquery.sweet.widget.form.label.js",
                "jquery.sweet.widget.form.labelfield.js",
                "jquery.sweet.widget.form.labelItem.js",
                "jquery.sweet.widget.container.js",
                "jquery.sweet.widget.container.panel.js",
                "jquery.sweet.widget.container.gridpanel.js",
                "jquery.sweet.widget.container.accordionpanel.js",
                "jquery.sweet.widget.container.borderpanel.js",
                "jquery.sweet.widget.container.tabpanel.js",
                "jquery.sweet.widget.container.Hpanel.js",
                "jquery.sweet.widget.container.Vpanel.js",
                "jquery.sweet.widget.container.portal.js",
                "jquery.sweet.widget.container.wizardpanel.js",
                "jquery.sweet.widget.container.flowpanel.js",
                "jquery.sweet.widget.container.gridportal.js",
                "jquery.sweet.widget.container.widgetlist.js",
                "jquery.sweet.widget.container.date.js",
                "jquery.sweet.widget.container.cardpanel.js",
                "jquery.sweet.widget.calculator.js",
                "jquery.sweet.widget.bxCarousel.js",
                "jquery.sweet.widget.errorInterface.js",
                "jquery.sweet.widget.tree.js",
				"jquery.sweet.widget.optimizeTree.js",
                "jquery.sweet.widget.tree.kqitree.js",
                "jquery.sweet.widget.tree.tree.js",
                "jquery.sweet.widget.tree.tree_v1.js",
                "jquery.sweet.widget.form.combobox.js",
                "jquery.sweet.widget.form.combobox_v1.js",
                "jquery.sweet.widget.list.js",
                "jquery.sweet.widget.list.list.js",
        		"jquery.sweet.widget.list.optimizeList.js",
                "jquery.sweet.widget.window.js",
                "jquery.sweet.widget.form.labelItem.js",
                "jquery.sweet.widget.form.labelImage.js",
                "jquery.sweet.widget.listbox.js",
                "jquery.sweet.widget.arrayindicator.js",
                "jquery.sweet.widgetpanel.js",
                "jquery.sweet.widget.ratioindicator.js",
                "jquery.sweet.widget.map.js",
                "jquery.sweet.widget.statuBar.js",
		        "jquery.sweet.widget.slider.js",
                "jquery.sweet.widget.scoreCard.js",	
                "jquery.sweet.widget.numCard.js",	
                "jquery.sweet.widget.stateItem.js",	
                "jquery.sweet.widget.progressBar.js",
                "sweet.base.js",
                "sweet.reader.js",
                "sweet.reader.jsonReader.js",
                "sweet.store.js",
                "sweet.store.gridStore.js",
                "sweet.store.chartStore.js",
                "sweet.socket.js"
            ]);
            // 加载sweet core文件
            this.dynaInclude(this.basePath + 'sweet/components/', [
                'jquery.sweet.cmp.js',
                'jquery.sweet.cmp.listwindow.js',
                'jquery.sweet.cmp.listwindow_v1.js',
                'jquery.sweet.cmp.treewindow.js',
                'jquery.sweet.cmp.optimizeListWindow.js',
                "jquery.sweet.cmp.timeschedule.js",
                "jquery.sweet.cmp.holiday.js",
                "jquery.sweet.cmp.fileupload.js",
                "jquery.sweet.cmp.secondaryStat.js",
                "jquery.sweet.cmp.officeDirection.js",
                "jquery.sweet.cmp.officeDirection_v1.js",
				"jquery.sweet.cmp.appManager.js"
            ]);
        } else {
            // 加载公共css文件
            this.dynaInclude(this.basePath + 'themes/default/', ['cssreset-min.css', 'sweet.min.css']);
            // 加载core css文件
            this.dynaInclude(this.basePath + 'themes/default/core/', ['sweet.core.min.css']);
            // 加载components css文件
            this.dynaInclude(this.basePath + 'themes/default/components/', ['sweet.components.min.css']);
            // 加载raphaeljs绘图组件
            this.dynaInclude(this.basePath + 'lib/raphael/', ['raphael-min.js']);
            // 加载jquery组件
            this.dynaInclude(this.basePath + 'lib/jquery/', ['jquery-1.9.1.min.js']);
            // 加载jquery ui组件
            this.dynaInclude(this.basePath + 'lib/jqueryui/', ['jquery-ui-1.10.2.custom.min.js']);
            // 加载第三方插件
            this.dynaInclude(this.basePath + 'lib/jquery/plugins/easing/', ['jquery.easing.min.js',
                'jquery.easing.compatibility.js']);
            // 加载sweet组件
            this.dynaInclude(this.basePath, ['sweet-all.min.js']);
            // 加载sweet配置文件
            this.dynaInclude(this.basePath, ['sweet.config.js']);
        }
    }
};

// 加载css、js文件
SweetLoad.include();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--区域，包括：区域下拉框、按钮、window和双向列表
 * 2014-4-10
 * </pre>
 * @version 1.0
 */
 

(function() {

    var INDICATOR = BusinessI18N.cmp.more.indicator;

    Business.more = function(params) {
        //初始参数设置
        this.config = {
            winWidth : 600, // 默认、外部more都可按需配置
            winHeight : 500, // 默认、外部more都可按需配置
            // 按钮上的text、tabPanel的title
            buttonText : BusinessI18N.cmp.more.windowTitle, // 默认、外部more都可按需配置
            // 默认more的请求
            url : Business.url.moreData, // 默认more按需配置
            // 外部组件时需要设置的属性(defaultType为false时)
            defaultType : true, // 外部more必须配置
            outerCmpName : "", // 外部more必须配置
            // 点击more按钮的回调函数
            clickMoreFunc : function() {return null;}, // 外部more按需配置
            // 获取请求参数
            getParamsFunc : function() {return null;} // 框架内部使用，不用配置
        };
        
        this.config = $.extend(this.config, params);
        
        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 区域下拉框chagne时的回调
     */
    Business.more.prototype.areaChangeFunc = function(val){
        var me = this;
        var config = me.config;

        if(config.defaultType) {
            return me._areaChangeFunc(val);
        } else {
            return me._outerMore.areaChangeFunc(val);
        }
    };

    /**
     * @description 返回多tab页参数
     * @returns {Object} result 容器
     */
    Business.more.prototype.getTabInfo = function(){
        var me = this;
        var config = me.config;

        if(config.defaultType) {
            return me._getTabInfo();
        } else {
            return me._outerMore.getTabInfo();
        }
    };

    /**
     * @description 返回各个组件
     * @returns {Object} result 容器
     */
    Business.more.prototype.getItems = function(){
        return this.items;
    };

    /**
     * 获取各个组件的原始value
     * @return {Object} {areaType: ,areaList: ,isTopN: ,topN}
     * @returns {Object} result 返回各个组件的原始value
     */
    Business.more.prototype.getOriginalValue = function() {
        var me = this;
        var config = me.config;

        var result = {};
        if(config.defaultType) {
            result = me._indicatorTree.getValue();
        } else {
            result = me._outerMore.getOriginalValue();
        }
        
        return result;
    };

    /**
     * 获取值
     * @returns {Object} result 返回给后台用于查询的value
     */
    Business.more.prototype.getValue = function(){
        var me = this;
        var config = me.config;
        
        var result = {};
        if(config.defaultType) {
            // 多tab页不一样的参数统一放在数组diffTabInfoArr中，page中将其分配到每个tab页中
            var diffTabInfoArr = [];
            var indicator = me._indicatorTree.getValue();

            indicator = Business.functions.getLeafNodeObj(indicator);
            for (var i = 0; i < indicator.length; i++) {
                diffTabInfoArr.push({indicator: indicator[i].value, indicatorName: indicator[i].text, indicatorNameEn: indicator[i].data});
            }
            result.diffTabInfoArr = diffTabInfoArr;
        } else {
            result = me._outerMore.getValue();
        }
            
        return result;
    };

    /**
     * 设置值，只有回填(切换模板)才会调用该方法
     */
    Business.more.prototype.setValue = function(obj){
        
        var me = this;
        var config = me.config;

        if(config.defaultType) {
            if(obj.length>0){
                var treeData = me._getIndicatorTreeData(config);
                obj = me._resetTreenew(obj, treeData);
            }
            me._indicatorTree.setValue(obj);
            me.indicatortemplate = {};
            me.indicatortemplate[config.getParamsFunc().areaType] = obj;
        } else {
            if(!config.defaultType && config.outerCmpName){
                if(!$.isNull(obj)){                
                    me._outerMore._requestData(me.config.getParamsFunc().areaType,true);
                    var kpidata = me._outerMore.resKpidata;
                    me._outerMore.resetKpidata(kpidata,obj);
                }
            me._outerMore.setValue(obj);
            }else{
                me._outerMore.setValue(obj);
            }
        }
    };

    /**
     * @private
     * 初始化组件 
     */
    Business.more.prototype._init = function() {
        
        var me = this;
        var config = me.config;
        var winTitle = config.buttonText;
        
        me.isLoad = {};
        me.items = [];
        if("false" === config.defaultType || false === config.defaultType) {
            config.defaultType = false;
        } else {
            config.defaultType = true;
        }

        if(config.defaultType) {
            me._initDefault();
            config.defaultType = true;
        } else if(!config.defaultType && config.outerCmpName){
            var outerCmpFunc = eval(config.outerCmpName);
            if("function" === typeof (outerCmpFunc)) {
                me._outerMore = new outerCmpFunc(me);
                me._morePanel = me._outerMore.getPanel();
                config = $.extend(config, me._outerMore.getConfig());
            } else {
                return;
            }
                
        } else {
            return;
        }
        
        //more window窗口
        me._moreWin = new Sweet.Window({
            width: config.winWidth,
            height: config.winHeight,
            header: config.header,
            widgetClass: " moreWindow",
            title: winTitle,
            content: me._morePanel,
            buttons: config.buttons || null,
            listeners: {
                "ok": function() {
                    if(config.defaultType) {
                        //
                    } else {
                        me._outerMore.clickOkBtn();
                    }
                },
                "cancel": function(event) {
                    if(config.defaultType) {
                        //
                    } else {
                        me._outerMore.clickCancelBtn(event);
                    }
                }
            }
        });
        
        //more按钮
        me._moreButton = new Sweet.form.Button({
            width: 85,
            widgetClass: "fontBolder",
            value: {value: "more", text: winTitle},
            click: function() {
                if(config.defaultType) {
                    me._requestDefaultData(config.getParamsFunc());
                } else {
                    config.clickMoreFunc(config.getParamsFunc());
                }
                me._moreWin.show();
                if(me._indicatorTree){
                    me._indicatorTree.doLayout(true);
                }
            }
        });

        me.items.push(me._moreButton);
    };
    
    /**
     * @private
     * 初始化组件默认组件
     */
    Business.more.prototype._initDefault = function() {
        
        var me = this;
        var config = me.config;
        
        me.isLoad = {};
        me.items = [];

        //指标树
        me._indicatorTree = new Sweet.cmp.TreeWindow({
            width: config.winWidth - 22,
            height: config.winWidth - 205,
            title: INDICATOR,
            widgetClass: "indicatorTree",
            tip: true,
            useArrows: false,
            valueKeys: ["value", "text", "data"],            
            icon: false,
            fromTitle: BusinessI18N.cmp.area.listWindowLeftTitle,
            toTitle: BusinessI18N.cmp.area.listWindowRightTitle
        });
        
        //more窗口左侧tabPanel
        me._morePanel = new Sweet.panel.TabPanel({
            width: "100%",
            height: "100%",
            padding: [0,5,0,5],
            items: [me._indicatorTree],
            style: 2
        });
    };

    /**
     * 按钮的点击事件：打开弹出框
     * @private
     * @param {String} requestParams 请求所需的参数
     */
    Business.more.prototype._requestDefaultData = function(requestParams) {
        var me = this;
        var config = me.config;

        if(me.areaType && me.areaType === requestParams.areaType) {
            return;
        }
        me.areaType = requestParams.areaType;

        // 请求后台，获取双向列表数据
        Sweet.Ajax.request({
            url : config.url,
            loadMask : true,
            async : false,
            data : requestParams,
            timeout : 300000,
            success : function(result) {

                me._indicatorTree.setData(result);

                if(me.indicatortemplate && me.indicatortemplate[me.areaType]) {
                    me._indicatorTree.setValue(me.indicatortemplate[me.areaType]);
                } else {
                }
                me.indicatortemplate = null;

            },
            error  : function() {
                me.indicatortemplate = null;
                $.error("Business.more() request listWindow's data error!");
            }
        });
    };

    /**
     * @description 返回各个组件
     * @returns {Object} result 容器
     */
    Business.more.prototype._getTabInfo = function(){
        var me = this;
        var config = me.config;
        var result = [];

        var valObj = me.getOriginalValue();
        valObj.forEach(function(treeNode, index, arr){
            var obj = {
                graphKey: "STARTTIME,AREA_NAME,AREA_ID",
                graphType: "line",
                text_zh: treeNode.text,
                text_en: treeNode.data,
                type: "list"
            };

            result.push(obj);
        });

        if(!result || 1 > result.length) {
            Sweet.Dialog.warn({
                width: 330,
                height: 130,
                message: BusinessI18N.cmp.more.selectKpi
            });
            return null;
        }

        return result;
    };

    /**
     * @description 区域下拉框change时的回调
     * @returns {Object} result 容器
     */
    Business.more.prototype._areaChangeFunc = function(val){
    	var me = this;
    	if(me._indicatorTree) {
            me._indicatorTree.setValue(null);
        }
        return null;
    };

    /**
     * 获取KPI
     * @private
     * @param {String} requestParams 请求所需的参数
     */
    Business.more.prototype._getIndicatorTreeData = function(config) {
        var me = this;
        var treeData=[];
        // 请求后台，获取双向列表数据
        Sweet.Ajax.request({
            url : config.url,
            loadMask : true,
            async : false,
            data : config.getParamsFunc(),
            timeout : 300000,
            success : function(result) {
                treeData = result;
            },
            error  : function() {
                me.indicatortemplate = null;
                $.error("Business.more() request listWindow's data error!");
            }
        });
        return treeData;
    };
    Business.more.prototype._resetTreenew = function(data,treeData) {
    var me = this;
    var res = [];
        for(var i=0;i<data.length;i++)
        {
            var node = data[i];
            for(var j=0;j<treeData.length;j++)
            {
                var trees = treeData[j];
                if(node.value == trees.value)
                {
                    if(node.children){
                        var treeChildren = trees.children;
                        var nodeChildren = node.children;
                        me._resetTreeNext(nodeChildren,treeChildren,trees);
                    }
                    res.push(trees);
                }
            }
        };
        return res;
    };
    Business.more.prototype._resetTreeNext = function(data,treeData,treeNode) {
        var me = this;
        var childrens =[]
        for(var i=0;i<data.length;i++)
        {
            var node = data[i];
            for(var j=0;j<treeData.length;j++)
            {
                var trees = treeData[j];
                if(node.value == trees.value)
                {
                    if(node.children){
                        me._resetTreeNext(node.children,trees.children,trees)
                    }
                    childrens.push(trees);
                }
            }
        };
        treeNode.children=childrens;
    };
})();
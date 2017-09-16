/**
 * @fileOverview
 * 
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */

(function() {

    Business.page = function(module, feature) {

        var pageConfig = this._initPageConfig(module, feature);

        this.config = {
            module : module,
            feature : feature
        };

        this.config = $.extend(this.config, pageConfig);

        if (!this.config) {
            return;
        }
        // 加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.page.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 初始化页面参数配置
     * 
     * @private
     */
    Business.page.prototype._initPageConfig = function(module, feature) {
        var me = this;

        var config = {};

        // 请求后台
        Sweet.Ajax.request({
            url : Business.url.getPageConfig,
            contentType : "application/json;chartset=UTF-8",
            async : false,
            data : JSON.stringify({
                module : module,
                feature : feature
            }),
            timeout : 300000,
            success : function(result) {
                if ($.isNull(result)) {
                    $.error("Business.page() _initPageConfig result is null!");
                }
                config = result;
            },
            error : function() {
                $.error("Business.page() _initPageConfig error!");
            }
        });
        return config;
    };

    /**
     * 初始化组件
     * 
     * @private
     */
    Business.page.prototype._init = function() {
        var me = this;
        var config = me.config;
        
        // 创建查询表头
        var queryConditionConfig = {};
        var conditionCmps = config.queryCondition.cmps.split(",");
        var cmp;
        for (var i = 0; i < conditionCmps.length; i++) {
            var cmp = conditionCmps[i];
            queryConditionConfig[cmp] = config.queryCondition[cmp] || {};
        }
        queryConditionConfig.moduleId = config.module + config.feature;

        queryConditionConfig.queryFunc = function(params) {
            me._queryData(params);
        };
        
        if(me.config["queryCondition"] && me.config["queryCondition"]["validatorFunc"]){
            var validatorFunc = eval(me.config["queryCondition"]["validatorFunc"]);
            if("function" == typeof(validatorFunc)){
                queryConditionConfig.validatorFunc = validatorFunc;
            }
        }
        
        me.queryCondition = new Business.queryCondition(queryConditionConfig);
        me._queryPanel = me.queryCondition.getPanel();

        // 创建tabpanel
        me._tabPanel = new Sweet.panel.TabPanel({
            width : "100%",
            height : "100%",
            items : [],
            visible : false,
            portion : "center",
            style : 2
        });

        // 整个页面布局panel
        me._mainPanel = new Sweet.panel.BorderPanel({
            width : "100%",
            height : "100%",
            items : [me._queryPanel, me._tabPanel],
            renderTo : "mainPanel"
        });

        // 页面刷新后，导入查询条件（最后一次的查询条件）
        me.queryCondition.getConditionManage().importLastQuery(queryConditionConfig.moduleId);

        // tab页切换的事件监控
        me._tabPanel.addListener("tabchanged", function(ptab, ntab) {
            var tabIndex = me._tabPanel.getActiveTab();
            // 发送请求
            if (!me._reportArr[tabIndex].isLoaded()) {
                me._reportArr[tabIndex].requestData();
            }
        });

    };

    /**
     * 查询方法
     */
    Business.page.prototype._queryData = function(queryParams) {
        var me = this;
        var config = me.config;

        queryParams.sort = "";
        queryParams.isPaging = 0;
        queryParams.currentPage = 0;
        queryParams.pageSize = 5000;

        var params = me._getTabInfo(queryParams);
        
        if (!params || params.length <= 0) {
            $.error("get query params is null!");
            return;
        }

        me._tabPanel.removeItems();
        me._tabPanel.hide();

        me._reportArr = [];
        var reportPanelArr = [];
        for (var i = 0; i < params.length; i++) {
            var report = new Business.report(params[i].reportConfig,
                    params[i].queryParams);
            me._reportArr.push(report);
            reportPanelArr.push(report.getPanel());
        }
        me._reportArr[0].requestData();
        me._tabPanel.addItems(reportPanelArr);
        me._tabPanel.show();
        if(report.getPanel()){
            report.getPanel().doLayout(true);
        }
    };
    
    /**
     * 获取查询结果tab页参数和配置信息
     */
    Business.page.prototype._getTabInfo = function (queryParams){
        var me = this;
        var config = this.config;
        if(config.param.depend) {
            config.param.tabs = eval("me.queryCondition._"+config.param.depend+".getTabInfo()");
        }
        if($.isNull(config.param.tabs) || config.param.tabs.length === 0){
            $.error("Business.page() -- _getTabInfo -- config.param.tabs is null");
            return null;
        }
        
        var tabInfoArr = [];
        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
        for (var i = 0; i <config.param.tabs.length; i++){
            var tabInfo = {};
            var tabConfig = config.param.tabs[i];
            
            tabInfo.queryParams = $.objClone(queryParams);
            // 多tab页不一样的参数统一放在数组diffTabInfoArr中，此处将其分配到每个tab页中
            if(queryParams.diffTabInfoArr) {
                tabInfo.queryParams = $.extend(tabInfo.queryParams, queryParams.diffTabInfoArr[i]);
                delete tabInfo.queryParams.diffTabInfoArr;
            }
            tabInfo.queryParams.module = config.module;
            tabInfo.queryParams.feature = config.feature;
            tabInfo.queryParams.type = tabConfig.type;
            tabInfo.queryParams.dbType = config.param.dbType;
            tabInfo.queryParams.transform = me._getTransformParam(tabConfig.type);
        
            var dataKeys = me._getDataKey(tabConfig.graphKey, tabConfig.type, tabInfo.queryParams);
            var tabInfoQueryParam = tabInfo.queryParams;

            tabInfo.reportConfig = {
                title : tabConfig["text_" + locale],
                exportName : tabConfig["text_en"],
                graphType : tabConfig.graphType,
                columnLabelRotation : parseInt(tabConfig.columnLabelRotation) || 0,
                graphIntegersOnly : tabConfig.graphIntegersOnly,
                graphDataKeys : dataKeys,
                gridColumns : me._getColumns(tabConfig.type, tabInfo.queryParams, dataKeys[0]),
                tabInfoQueryParam: tabInfoQueryParam,
                gridDbClickDrillFunc: tabConfig["gridDbClickDrillFunc"],
                gridDrillFunc : function(drillParams){
                    var drillType = drillParams.type.value;
                    var columns;
                    var _tabInfoParamClone = $.objClone(this.tabInfoQueryParam);
                    if(drillType !== "xdr"){
                        columns = me._getColumns(drillType, this.tabInfoQueryParam, dataKeys[0]);
                        _tabInfoParamClone.transform = me._getTransformParam(drillType);
                    }
                    var counterArr = me._getCounters(tabConfig.type, _tabInfoParamClone);
                    var counterWithXdrTotalArr = [];
                    counterArr.forEach(function(obj, index, arr) {
                        if(obj.xdrTotal && "off" === obj.xdrTotal) {
                            counterWithXdrTotalArr.push(obj.name);
                        }
                    });
                    
                    // 请求的参数中，不需要areaListObj，不删除导致请求过长报错
                    delete _tabInfoParamClone.areaListObj;
                    Business.functions.drillFunc(drillParams, _tabInfoParamClone, columns, counterWithXdrTotalArr);
                }
            };
            
            tabInfoArr.push(tabInfo);
        }
        return tabInfoArr;
    };

    Business.page.prototype._getDataKey = function(graphKey, type, queryParams){
        var me = this;
        var config = me.config;
        
        var dataKeys = [];
        var dim = graphKey.split(",");
        var hasTransform = dim.some(function(item, index, arr) {
            return config.dim[item] && config.dim[item].transform;
        });
        if(hasTransform){
            dataKeys.push("FORMAT_" + graphKey);
        }else{
            dataKeys.push(graphKey);
        }

        if(config.index) {
            var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
            for (var key in config.index) {
                dataKeys.push([key, config.index[key]["text_" + locale]]);
            };
            return dataKeys;
        }
        
        var counterArr = me._getCounters(type, queryParams);
        for(var i = 0; i < counterArr.length; i++){
            dataKeys.push([counterArr[i].name, counterArr[i].text]);
        }
        return dataKeys;
    };
    
    Business.page.prototype._getTransformParam = function(type){
        var me = this;
        var config = this.config;
        var dimArr = config.type[type].dims.split(",");
        if($.isNull(dimArr)){
            return null;
        }
        
        var transformParam = {};
        var dimName;
        var transform;
        for(var i = 0; i < dimArr.length; i++){
            dimName = dimArr[i];
            transform = config.dim[dimName].transform;
            if($.isNull(transform)){
                continue;
            }
            
            if($.isNull(transformParam[transform])){
                transformParam[transform] = dimName;
            }else{
                transformParam[transform] = transformParam[transform] + "," +dimName;
            }
        }
    
        // couter也支持配置transform
        var counterArr = config.type[type].counters;
        var counterName;
        for(var i = 0; i < counterArr.length; i++){
            counterName = counterArr[i].name;
            transform = counterArr[i].transform || "";
            if($.isNull(transform)){
                continue;
            }
            
            if($.isNull(transformParam[transform])){
                transformParam[transform] = counterName;
            }else{
                transformParam[transform] = transformParam[transform] + "," +counterName;
            }
        }

        return transformParam;
    };
    
    Business.page.prototype._getColumns = function(type, queryParams, time){
        var me = this;
        var config = this.config;
        
        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
        
        var columnArr = [];
        var column;
        var dimArr = config.type[type].dims.split(",");
        var startTime = "";
        var areaName = "";

        if(time) {
            startTime = $.objClone(time).split(",")[0];
            areaName = $.objClone(time).split(",")[1];
        }
    
        if(!$.isNull(dimArr)){
            var dimName;
            var dimText;
            var depend;
            for(var i = 0; i < dimArr.length; i++){
                dimName = dimArr[i];
                depend = config.dim[dimName].depend; 
                if($.isNull(depend)){
                    dimText = config.dim[dimName]["text_" + locale];
                }else{
                    if($.isNull(config.dim[dimName][queryParams[depend]])){
                        continue;
                    }
                    dimText = config.dim[dimName][queryParams[depend]]["text_" + locale];
                }
        
                var name = $.isNull(config.dim[dimName].transform) ? dimName : "FORMAT_" + dimName;
                //DTS2014072300898
                var sortable = (false ===config.dim[dimName].sortable || "false" ===config.dim[dimName].sortable) ? false : true;
                //过滤可配置，不配置默认为可过滤，DTS2014081202140
                var filter = (false ===config.dim[dimName].filter || "false" ===config.dim[dimName].filter) ? false : true;
                var filterType = "list";
                var filterList = null;
                if(name === "STARTTIME" || name === "FORMAT_STARTTIME") {
                    filterType = "date";
                }

                column = {
                    name :  name,
                    header : dimText,
                    tooltip : dimText,
                    height : 30,
                    sortable : sortable,
                    dataType : "string" ,
                    filter : filter,
                    filterType : filterType,
                    hidden : false,
                    tip : true
                };
                columnArr.push(column);
            }    
        }
        
        var counterArr = me._getCounters(type, queryParams);
        if(!$.isNull(counterArr)){
            var counter;
            var drillTypeArr;
            for(var i = 0; i < counterArr.length; i++){
                counter = counterArr[i];
                column = {
                    name : counter.name,
                    header : counter.text,
                    tooltip : counter.text,
                    height : 30,
                    sortable : counter.sortable,
                    dataType : "number" ,
                    filter : counter.filter,
                    filterType : "number",
                    transform : counter.transform,
                    hidden : (true===counter.hidden || "true"===counter.hidden) ? true : false,
                    tip : true
                };
                // 如果存在隐藏counter，在columns设置属性记录，表格创建时增加counterCheckBox
                if((!columnArr.counterHiddened) && counter.hidden){
                    columnArr.counterHiddened = counter.hidden;
                }
                
                if ($.isNotNull(counter.drillType)) {
                    column.menus = [];
                    drillTypeArr = counter.drillType.split(",");
                    for (var j = 0; j < drillTypeArr.length; j++) {
                        column.menus.push({
                            value : drillTypeArr[j],
                            text : config.drillType[drillTypeArr[j]]["text_" + locale]
                        });
                   }

                }
                if(counter["unDrillDatas"]){
                	var _tempUnDrillDatas = [];
                	column["unDrillDatas"] = JSON.parse(counter["unDrillDatas"]);
                	//转化成字符串
                	if($.isArray(column["unDrillDatas"]) && column["unDrillDatas"].length > 0){
                		for(var j = 0; j < column["unDrillDatas"].length; j++){
                			_tempUnDrillDatas.push("" + column["unDrillDatas"][j]);
                		}
                		column["unDrillDatas"] = _tempUnDrillDatas;
                	}else{
                		delete counter["unDrillDatas"];
                	}
                }
                columnArr.push(column);
            }
        }
        return columnArr;
        
    };
    
    Business.page.prototype._getCounters = function(type, queryParams){
        var me = this;
        var config = this.config;
        
        var counterArr = config.type[type].counters;
        if($.isNull(counterArr) || counterArr.length === 0){
            $.error("Business.page() -- _getCounters -- counterArr is null,type is " + type);
            return null;
        }
        
        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
        var counterName, depend, resultCounter = [];
        for(var i = 0; i < counterArr.length; i++){
            counterName = counterArr[i].name;
            depend = config.counter[counterName].depend; 
            if($.isNull(depend)){
                counterArr[i].text = config.counter[counterName]["text_" + locale];
            }else{
                if($.isNull(config.counter[counterName][queryParams[depend]])){
                    continue;
                }
                counterArr[i].text = config.counter[counterName][queryParams[depend]]["text_" + locale];
            }

            //排序可配置，不配置默认为可排序，DTS2014072300898
            if(false === config.counter[counterArr[i].name]["sortable"] ||
                "false" === config.counter[counterArr[i].name]["sortable"]) {
                counterArr[i].sortable = false;
            } else {
                counterArr[i].sortable = true;
            }
            
            //过滤可配置，不配置默认为可过滤，DTS2014081202140
            if(false === config.counter[counterArr[i].name]["filter"] ||
                "false" === config.counter[counterArr[i].name]["filter"]) {
                counterArr[i].filter = false;
            } else {
                counterArr[i].filter = true;
            }
	    
            resultCounter.push(counterArr[i]);
        }
        return resultCounter;
    };
    
    /**
     * 销毁组件 对外接口
     */
    Business.page.prototype.destroy = function() {
        
    };

})();
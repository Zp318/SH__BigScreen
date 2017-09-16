/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */
 

(function() {
    var format = "yyyy-MM-dd hh:mm:ss";
    var FORMAT = "FORMAT_";

    Business.column = function(params) {
        
        //初始参数设置
        this.config = {
            graphType : "column", // column,column_obj,column_index,column_both
            graphIntegersOnly : [false],
            dataKeys : ["text"],
            objBox : false, // 柱图是否带对象下拉框，graphType为column时才有效
            indexBox : false, // 柱图是否带指标下拉框，graphType为column时才有效
            drillFunc : function() {
                return null;
            },
            toggleFunc :  function() {
                return null;
            },
            portion : "north",
            chartType : "chart",
            labelRotation : 0
        };

        this.config = $.extend(this.config, params);
        // graphType不为"column_*"时，需设置objBox和indexBox
        if("column_obj" === this.config.graphType) {
            this.config.objBox = true;
            this.config.indexBox = false;
        } else if("column_index" === this.config.graphType) {
            this.config.objBox = false; 
            this.config.indexBox = true;
        } else if("column_both" === this.config.graphType) {
            this.config.objBox = true; 
            this.config.indexBox = true;
        }
        this.config.graphType = "column";
        // 不为数组：为字符串，变成数组；其余统一为[false]
        var graphIntegersOnly = this.config.graphIntegersOnly;
        if(!(graphIntegersOnly instanceof Array)) {
            if("string" === typeof(graphIntegersOnly)) {
                this.config.graphIntegersOnly = ("true" === graphIntegersOnly) ? [true] : [false];
            } else {
                this.config.graphIntegersOnly = [false];
            }
        }
        this._lineDataKeys = params.dataKeys;
      
        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.column.prototype.getPanel = function(){
        return this._panel;
    };
    
    /**
     * 获取值
     * @returns {Object}
     */
    Business.column.prototype.getValue = function(){
        var me = this;

        return me._line.getValue();
    };

    /**
     * 下拉框change时，请求数据
     * @param {Object} params 从form查询头获取的小区数据和区域类型
     * @param {Object} requestParams 请求数据的
     */
    Business.column.prototype.requestLineData = function(params, requestParams){
    
        var me = this;
        var config = me.config;
        me._requestParams = requestParams;
        me._setobjBoxData(params);
    };

    /**
     * 设置值
     * @param {Object} params 值
     */
    Business.column.prototype.setData = function(val){
        var me = this;

        if(val){
            me._line.setData(val);
            me._line.doLayout(true);
            me._data = val.data;
        }
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} objValue 多个对象
     */
    Business.column.prototype.setTopNObj = function (objValue) {
        var me = this;

        // 设置多对象对比中的下拉框数据
        me._objBox.setData(objValue);
        var value = objValue.length >= 5 ? objValue.slice(0, 5) : objValue;
        me._multiObjBox.setValue(value);

        // 设置历史对比中的下拉框数据
        me._toPNObjValue = objValue;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.column.prototype.destroy = function () {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };
    
    /**
     * 初始化组件
     * @private
     */
    Business.column.prototype._init = function() {
        
        var me = this;
        var config = me.config;

        var panelConfig = {
            width: "100%",
            header: true,
            title: BusinessI18N.cmp.line.chartDisplay,
            toggle : config.toggleFunc,
            portion : config.portion,
            datakeys : me._lineDataKeys,
            height: 300, // 下拉框高度 + line高度 + 35 = panel高度
            items : me._creatColumnLine()
        };

        me._panel = new Sweet.panel.VPanel(panelConfig); 
    };

    /**
     * 多对象对比
     * @private
     */
    Business.column.prototype._creatColumnLine = function() {

        var me = this;
        var config = me.config;
        var items = [];
        var hPanelItem = [];

        // 对象下拉框
        if("true" === config.objBox || true === config.objBox) {
            me._objBox = new Sweet.form.ComboBox_v1({
                width : BusinessI18N.cmp.line.size.objBoxWidth,
                multi : false,
                maxRemains: 5,
                errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
                tip: true,
                label : true,
                labelText : BusinessI18N.cmp.line.selectObject,
                labelWidth : BusinessI18N.cmp.line.size.objBoxLabelWidth
            });
            
            hPanelItem.push(me._objBox);
        }

        // 指标下拉框
        if("true" === config.indexBox || true === config.indexBox) {
            me._indexBox = new Sweet.form.ComboBox_v1({
                name : "interval",
                width : BusinessI18N.cmp.line.size.indexWidth,
                height : 25, // 下拉框高度 + line高度 + 35 = panel高度
                label : true,
                labelText : BusinessI18N.cmp.line.indexLabelText,
                labelWidth : BusinessI18N.cmp.line.size.indexLabelWidth,
                multi : false,
                tip : true
            });

            hPanelItem.push(me._indexBox);
        }

        // 下拉框所在的hpanel
        if(0 < hPanelItem.length) {
            me._hPanel = new Sweet.panel.HPanel({
                width: "100%",
                height: 25, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
                items: hPanelItem,
                visible : true,
                itemExtend: false
            });
            items.push(me._hPanel);
        }
        
        // 柱状图
        me._line = new Sweet.chart.Line({
            height: 240, // 下拉框高度 + line高度 + 35 = panel高度
            width : "100%",
            isLegend : false,
            isScrollbar : false,
            legendTips : true,
            definedColor : false,
            graphType : config.graphType,
            labelRotation : config.labelRotation,
            integersOnly : config.graphIntegersOnly
        });

        me._line.addListener("click", function(event, val){
            // 钻取
            me._lineDrill(val);
        });
        items.push(me._line);

        return items;
    };

    /**
     * 设置柱图的对象、指标、周期下拉框及折线图的数据
     * @param {Object} data 从form查询头获取的小区数据和区域类型
     */
    Business.column.prototype._setobjBoxData = function(data){

        var me = this;
        var areaList = data.areaList;
        var indexBoxDatas;
        areaList = areaList ? areaList : [];

        // 设置对象下拉框数据
        if(me._objBox) {
            me._objBox.setData(areaList);
            var value = areaList.length >= 5 ? areaList.slice(0, 5) : areaList;
            me._objBox.setValue(value);

            // 注册change事件
            me._objBox.addListener("change", function(event, val) {
                me._objBoxChange();
            });
        }

        if(me._indexBox) {
        	indexBoxDatas = me._getIndexBoxData();
            me._indexBox.setData(indexBoxDatas);
            if(!indexBoxDatas || indexBoxDatas.length <= 1){
            	me._indexBox.setDisabled(true);
            }else{
            	me._indexBox.setDisabled(false);
            }
            me._indexBox.addListener("change", function(event, val){
                me._indexBoxChange();
            });
        }

        // 请求数据()
        me._objBoxChange();

    };

    /**
     * 对象下拉框change事件
     * @private
     */
    Business.column.prototype._objBoxChange = function() {
        
        var me = this;
        var config = me.config;

        var params = {};
        if(me._objBox) {
            params.areaList = Business.functions.getLeafArray($.objClone(me._objBox.getValue())).value;

            if(!params.areaList) {
                return;
            }
        }
        
        me._requestData(params, function(data){
            if(me._indexBox) {
                me._indexBoxChange(data);
                return;
            }

            me._setColumnData(data);
        }, true);
        
    };

    /**
     * 指标下拉框change事件：构造datakeys
     * @private
     */
    Business.column.prototype._indexBoxChange = function(data) {
        var me = this;
        var val = me._indexBox.getValue();
        var dataKeys = [me._lineDataKeys[0].split(",")[0], [val.value, val.text]];

        data = data ? data : [];
        
        me._line.setData({
            data : data,
            dataKeys : dataKeys,
            leftUnit : val.data
        });
        me._line.doLayout(true);
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} data 表格当前页的数据
     */
    Business.column.prototype._setColumnData = function (data) {
        var me = this;
        var config = me.config;
        var dataKeys = [me._lineDataKeys[0].split(",")[0], me._lineDataKeys[1]];

        me._line.setData({
            data : data,
            dataKeys : dataKeys,
            leftUnit : me._objBox.getValue().data || ""
        });
        me._line.doLayout(true);
        
    };

    /**
     * 获取“指标”下拉框的数据
     * @private
     */
    Business.column.prototype._getIndexBoxData = function() {
        
        var me = this;
        
        var value = [];
        if(me._lineDataKeys) {
            var key = me._lineDataKeys.slice(1);
            key.forEach(function(item, index, arry) {
                var str = item[1];
                var startIndex = str.indexOf("(");
                var text = (0 <= startIndex ? str.slice(0, startIndex) : str);
                var data = (0 <= startIndex ? str.slice(startIndex+1, str.length-1) : "");
                value.push({value : item[0], text : text, data : data});
            });
        }
        
        return value;
    };

    /**
     * 钻取
     * @private
     * @param {Object} params 返回给回调函数的值
     */
    Business.column.prototype._lineDrill = function(val) {
        
        var me = this;
        var config = me.config;
        
        config.drillFunc(val);
    };

    /**
     * 下拉框change时，请求line的数据
     */
    Business.column.prototype._requestData = function(params, callFun, async){
    
        var me = this;
        var config = me.config;

        var lineParams = $.extend($.objClone(me._requestParams), params);
        lineParams.isTopN = false;
        // 用于区分表格的请求
        lineParams.type = config.chartType;
        // 请求后台
        Sweet.Ajax.request({
            url : Business.url.getData,
            async : async,
            contentType : "application/json;chartset=UTF-8",
            data : JSON.stringify(lineParams),
            timeout : 300000,
            success : function(result) {
                callFun(result.list);
            },
            error : function() {
                $.error("Business.column() request line's data error!");
            }
        });

    };

})();
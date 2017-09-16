/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */
 

(function() {

    Business.report = function(config, params) {
        
        //初始参数设置
        this.config = {
            // report外层panel的title
            title : "report-title",
            // grid导出文件的名称，只能为英文
            exportName : "report-title",
            // line
            graphType : "line", // "line", "column"
            columnLabelRotation : 0,
            graphDataKeys : ["text"],
            chartType : "chart",
            graphDrillFunc : function() {
                return null;
            },
            // grid
            gridColumns : [],
            gridDrillFunc : function(drillParams) {
                return null;
            },
            gridDbClickDrillFunc : function(drillParams) {
                return null;
            }
        };
        
        this._lineObjData = $.objClone(params.areaListObj);
        delete params.areaListObj;
        this.params = params;

        this.config = $.extend(this.config, config);
        
        if(!this.config) {
            return;
        }

        if("line" === this.config.graphType) {
            this._AREATYPE_NAME = this.config.graphDataKeys[0].split(",")[1] || "";
            this._AREATYPE_ID = this.config.graphDataKeys[0].split(",")[2] || "";
        }
        
        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.report.prototype.getPanel = function(){
        return this._panel;
    };
    
    /**
     * 请求数据
     */
    Business.report.prototype.requestData = function(){
    
        var me = this;
        var config = me.config;

        me._isLoaded = true;

        // 折线图单独请求数据
        me._line.requestLineData({areaList: me._lineObjData}, $.objClone(me.params));

        // 请求后台
        Sweet.Ajax.request({
            url : Business.url.getData,
            contentType : "application/json;chartset=UTF-8",
            data : JSON.stringify(me.params),
            timeout : 300000,
            success : function(result) {
                var data = (result.list ? result.list : []);
                var resultColumns = Business.functions.creatGridFilterList($.objClone(data), $.objClone(config.gridColumns));

                me._grid.setData({
                    data : data,
                    columns : resultColumns
                });

                // topN时，表格中对象过滤中的数据来源于此
                if((!config.graphType || "line" === config.graphType) && me.params.isTopN) {
                    // 从表格数据中获取对象，构造dimFilterLists的数据
                    var objValue = [];
                    var objValueObj = {};
                    data.forEach(function(item, index, arr) {
                        if(!objValueObj[item[me._AREATYPE_ID]]) {
                            objValueObj[item[me._AREATYPE_ID]] = item[me._AREATYPE_NAME];
                            objValue.push({text: item[me._AREATYPE_NAME],value: item[me._AREATYPE_ID]});
                        }
                    });
                    me._line.setTopNObj(objValue);
                }
            },
            error : function() {
                $.error("Business.report() request grid's data error!");
            }
        });
        
    };
    
    /**
     * 是否已经加载数据
     */
    Business.report.prototype.isLoaded = function(){
        var me = this;
        if($.isNull(me._isLoaded)){
            return false;
        }
        return me._isLoaded;
    };
    
    
    /**
     * 初始化组件
     * @private
     */
    Business.report.prototype._init = function() {
        
        var me = this;
        var config = me.config;

        // line/column
        me._line = me._creatDiffLine();
        if(!me._line) {
            $.error("Business.report() has not support the type of chart!");
            return;
        }
       
        // 业务grid
        var gridConfig = {
            columns : config.gridColumns,
            title : config.exportName,
            drillFunc : config.gridDrillFunc,
            dbDrillFunc : config.gridDbClickDrillFunc,
            multiColumnSort: !config.hideMultiColumnSort,
            // 多tab页钻取表格，当前tab页的参数
            tabInfoQueryParam: config.tabInfoQueryParam
        };
        me._grid = new Business.grid(gridConfig);
        
        // panel
        var panelConfig = {
            title : config.title,
            width: "100%",
            height: "100%",
            items: [me._line.getPanel(), me._grid.getPanel()]
        };
        if(config.renderTo) {
            panelConfig.renderTo = config.renderTo;
        }
        me._panel = new Sweet.panel.BorderPanel(panelConfig);
    };

    /**
     * 销毁组件 对外接口
     */
    Business.report.prototype.destroy = function () {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

    /**
     * 创建line
     * @private
     * @param {Object} data 表格当前页的数据
     */
    Business.report.prototype._creatDiffLine = function () {
        var me = this;
        var config = me.config;
        var line = null;
        var lineConfig = {
            graphType : config.graphType, // 默认为折线图
            dataKeys : config.graphDataKeys,
            graphIntegersOnly : config.graphIntegersOnly,
            drillFunc : config.graphDrillFunc,
            toggleFunc : function(flag){
                 // 默认是展开的
                var lineHeight = me._line.getPanel().getHeight();
                if(!flag) {
                    lineHeight = 30;
                }
                me._panel.setItemSize("north", null, lineHeight);
            }
        };

        if("line" === config.graphType) {
            lineConfig.graphType = "line";
            line = new Business.line(lineConfig);
        } 
        else if(-1 != config.graphType.indexOf("column")) {
            lineConfig.chartType = config.chartType;
            lineConfig.labelRotation = config.columnLabelRotation;
            line = new Business.column(lineConfig);
        } else {
            //
        }

        return line;
    };


})();
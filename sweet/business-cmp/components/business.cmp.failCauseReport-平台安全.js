/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */
 

(function() {
    Business.failureReport = function(config, params) {
        
        //初始参数设置
        this.config = {
            renderTo : "",
            // 饼图上方panel的左边title
            panelTitle : BusinessI18N.cmp.failCause.baseTitle,
            // 饼图上方panel的右边title
            panelToolText:"需要添加" + ':' + "业务相关信息" + "" + ':',
            // 左饼图提示的格式
            leftBalloonText : "",
            // 右饼图提示的格式
            rightBalloonText : "",
            // 左右饼的数据字段
            pieKeys : {
                leftPieId: "FAILCAUSE_AIU_CLASS",
                leftPieName: "FAILCAUSE_AIU_CLASS_ZH",
                rightPieId: "FAILCAUSE_AIU_PD",
                rightPieName: "FAILCAUSE_AIU_PD_ZH",
                pieValue: "FAILCOUNT_ID_SUM"
            },
            // 表格的配置
            gridConfig : {
                columns : "",
                title : "导出表格的文件名",
                panelTitle : BusinessI18N.cmp.failCause.baseTitle,//表格外层panel的title
                drillFunc : "",
                dbDrillFunc : "",
                // 多tab页钻取表格，当前tab页的参数
                tabInfoQueryParam: ""
            },
            beforeSetGridData : function(data) {
                return data;
            }
        };

        this.config = $.extend(this.config, config);
        this.params = params;

        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.failureReport.prototype.getPanel = function(){
        return this._panel;
    };
    
    /**
     * 请求数据
     */
    Business.failureReport.prototype.requestData = function(callFun){
    
        var me = this;
        var config = me.config;

        Sweet.Ajax.request({
            url : Business.url.getData,
            async : false,
            contentType : "application/json;chartset=UTF-8",
            data : JSON.stringify(me.params),
            timeout : 300000,
            success : function(result) {
                callFun(result.list);
            },
            error : function() {
                $.error("Business.line() request line's data error!");
            }
        });
    };  
    
    /**
     * 初始化组件
     * @private
     */
    Business.failureReport.prototype._init = function() {
        
        var me = this;
        var config = me.config;

        me._creatDoublePie();
        me._creatGrid();

        // panel
        var panelConfig = {
            width: "100%",
            height: "100%",
            items: [me._piePanel, me._grid.getPanel()],
            renderTo : config.renderTo || ""
        };
        me._panel = new Sweet.panel.BorderPanel(panelConfig);

        // data
        me._initData();
    };

    /**
     * 初始化pie
     * @private
     */
    Business.failureReport.prototype._creatDoublePie = function() {
        var me = this;
        var config = me.config;

        me._leftPie = new Sweet.chart.Pie({
            width : "50%",
            heigth : "100%",
            balloonText : config.leftBalloonText,
            precision : 2,
            switchable : false,
            isSortForData : false,
            pullOutOnlyOne : true,
            title : BusinessI18N.cmp.failCause.leftPieTitle,
            position : "left",
            dataKeys : ['text', 'value'] ,
            data : []
        });

        me._rightPie = new Sweet.chart.Pie({
            width : "50%",
            heigth : "100%",
            balloonText : config.rightBalloonText,
            precision : 2,
            switchable : false,
            isSortForData : false,
            pullOutOnlyOne : true,
            title : BusinessI18N.cmp.failCause.rightPieTitle,
            position : "right",
            dataKeys : ['text', 'value'] ,
            data : []
        });

        me._failureInfo = new Sweet.form.Label({
            align: Sweet.constants.align.RIGHT,
            symbol : false,
            width: 'auto',
            pading: '10px,10px,10px,10px',
            value : {
                text : config.panelToolText,
                value : "",
                data : null
            }
        });

        me._piePanel = new Sweet.panel.HPanel({
            width : "100%",
            height : 400,
            items : [me._leftPie, me._rightPie],
            portion : "north",
            header : true,
            title : config.panelTitle,
            tools : [me._failureInfo],
            collapsible : false
        });

        me._leftPieIsOpen = false;//默认关闭
        me._leftPie.addListener("click", function(event, data) {
            me._leftPieChange(event.dataItem.pulled, data);
            me._leftPieIsOpen = event.dataItem.pulled;
        });
        me._rightPie.addListener("click", function(event, data) {
            me._rightPieChange(event.dataItem.pulled, data);
        });

    };

    /**
     * 初始化grid
     * @private
     */
    Business.failureReport.prototype._creatGrid = function() {
        
        var me = this;
        var config = me.config;
        me._grid = new Business.grid(config.gridConfig);
    };

    /**
     * 销毁组件 对外接口
     */
    Business.failureReport.prototype._initData = function () {
        var me = this;
        var config = me.config;
        var pieKeys = me.config.pieKeys;

        me.requestData(function(data) {
            if ($.isNull(data)) {
                return;
            }
            var leftPieData = me._getPieData({
                pieId: pieKeys.leftPieId, 
                pieName: pieKeys.leftPieName, 
                pieValue: pieKeys.pieValue
            }, data);
            var rightPieData = me._getPieData({
                pieId: pieKeys.rightPieId, 
                pieName: pieKeys.rightPieName, 
                pieValue: pieKeys.pieValue,
                fatherKey: pieKeys.leftPieId
            }, data, true);
            
            me._leftPie.setData(leftPieData);
            me._rightPie.setData(rightPieData);
            //重新渲染右饼，解决右饼显示不全问题
            me._rightPie.doLayout(true);
            
            data = config.beforeSetGridData(data);
            // DTS2014081202056 百分比从前台计算
            me.allData = $.objClone(data);
            me._grid.setData({
                data : data,
                columns : config.gridConfig.columns
            });
        });
    };

    /**
     * 左pie的数据
     * @private
     */
    Business.failureReport.prototype._getPieData = function(pieKeys, data, isTop) {
        
        var me = this;
        var config = me.config;
        var keyArr = pieKeys.pieId.split(",");
        var keyLen = keyArr.length;
        var nameArr = pieKeys.pieName.split(",");

        var resultObj = {};
        data.forEach(function(obj, index, arr) {
            // 左饼由三列字段决定
            var key = "";
            for (var i = 0; i < keyLen; i++) {
                key += obj[keyArr[i]];
                if(i !== keyLen-1) {
                    key += ",";
                }
            };
            var name = isTop ? obj[nameArr[0]]+":"+obj[nameArr[1]]+"("+obj[nameArr[2]]+")" : obj[nameArr[0]];
            if(!resultObj[key]) {
                resultObj[key] = {
                    text: name, 
                    value: parseInt(obj[pieKeys.pieValue]) || 0, 
                    filterKey: pieKeys.pieId, 
                    filterValue: key,
                    fatherKey: pieKeys.fatherKey || "",
                    fatherValue: pieKeys.fatherKey ? obj[pieKeys.fatherKey] : ""
                };
            } else {
                resultObj[key].value = parseInt(resultObj[key].value) 
                    + (parseInt(obj[pieKeys.pieValue]) || 0);
            }
        });

        var result = [];
        for(var key in resultObj) {
            result.push(resultObj[key]);
        }

        // 排序
        result = me._sortPieData(result);

        if(isTop) {
            result = me._getTopNData(result);
        }

        return result;
    };

    /**
     * 右pie的数据若超过topn，则处理为other
     * @private
     */
    Business.failureReport.prototype._sortPieData = function(data) {
        
        var me = this;
        var config = me.config;

        // 排序
        function compare(obj1, obj2) {
            var compareKey = "value";
            if(obj1[compareKey] < obj2[compareKey]) {
                return 1;
            } else if(obj1[compareKey] > obj2[compareKey]) {
                return -1;
            } else {
                return 0;
            }
        }
        data.sort(compare);

        return data;
    };

    /**
     * 右pie的数据若超过topn，则处理为other
     * @private
     */
    Business.failureReport.prototype._getTopNData = function(data) {
        
        var me = this;
        var config = me.config;

        var keyArr = config.pieKeys.rightPieId.split(",");
        var keyLen = keyArr.length;
        

        // 处理topN以外的数据
        var TOPN = 10;
        if (data.length > TOPN){
            var other = {
                text: 'other', //@国际化
                value: 0,
                filterKey: config.pieKeys.rightPieId, // 仅右饼有other
                filterValue: [],
                fatherKey: config.pieKeys.leftPieId,
                fatherValue: []
            };
            for(var j = TOPN; j < data.length; j++){
                // 左饼由三列字段决定
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += data[j][keyArr[i]];
                    if(i !== keyLen-1) {
                        key += ",";
                    }
                };
                other.filterValue.push(data[j].filterValue);
                other.fatherValue.push(data[j].fatherValue);
                other.value += data[j].value;
            }
            data[TOPN] = other;
            data.length = TOPN + 1;
        }

        return data;
    };

    /**
     * 左pie的change
     * @private
     */
    Business.failureReport.prototype._leftPieChange = function(isOut, data) {
        
        var me = this;
        var config = me.config;
        var pieKeys = me.config.pieKeys;
        var rightPieData = [];
        var result = [];

        var keyArr = config.pieKeys.leftPieId.split(",");
        var keyLen = keyArr.length;
                

        // 左饼要关闭
        if(!isOut) {
            result = me.allData;
        }
        // 左饼要打开
        else {
            me.allData.forEach(function(obj, index, arr) {
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += obj[keyArr[i]];
                    if(i !== keyLen-1) {
                        key += ",";
                    }
                };
                if(data.filterValue === key) {
                    result.push(obj);
                }
            });
        }

        rightPieData = me._getPieData({
            pieId: pieKeys.rightPieId, 
            pieName: pieKeys.rightPieName, 
            pieValue: pieKeys.pieValue, 
            pieValue: pieKeys.pieValue,
            fatherKey: pieKeys.leftPieId
        }, result, true);

        me._rightPie.setData(rightPieData);
        me._grid.setData({
            data : result,
            columns : config.gridConfig.columns
        });
    };

    /**
     * 右pie的change
     * @private
     */
    Business.failureReport.prototype._rightPieChange = function(isOut, data) {
        
        var me = this;
        var config = me.config;
        var result = [];

        // 右饼要关闭
        if(!isOut) {
            // 左饼处于关闭状态
            if(!me._leftPieIsOpen) {
                result = me.allData;
            } else {
                // 左饼处于打开状态
                me.allData.forEach(function(obj, index, arr) {
                    // 处理others,数组data.fatherValue中的值应该都一样，故取第0个
                    if(data.fatherValue === obj[data.fatherKey] || data.fatherValue[0] === obj[data.fatherKey]) {
                        result.push(obj);
                    }
                });
            }
        }
        // 右饼要打开
        else {
            var keyArr = config.pieKeys.rightPieId.split(",");
            var keyLen = keyArr.length;
                
            me.allData.forEach(function(obj, index, arr) {
                // 右饼的分类由多个字段决定，获取多个字段的值组成key
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += obj[keyArr[i]];
                    if(i !== keyLen-1) {
                        key += ",";
                    }
                };

                if(data.filterValue === key) {
                    result.push(obj);
                } else {
                    // 处理others
                    if(Array.isArray(data.filterValue)) {
                        var flag = data.filterValue.some(function(id, index, arr) {
                            return id === key;
                        });
                        if(flag) {
                            result.push(obj);
                        }
                    }
                }
            });
        }

        me._grid.setData({
            data : result,
            columns : config.gridConfig.columns
        });
    };

    /**
     * 销毁组件 对外接口
     */
    Business.failureReport.prototype.destroy = function () {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

})();
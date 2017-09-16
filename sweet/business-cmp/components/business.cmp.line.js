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
    var NEED_AREA_PAIR = "area_pair";

    Business.line = function(params) {
        
        //初始参数设置
        this.config = {
            graphType : "line", // 默认为折线图
            dataKeys : ["text"],
            drillFunc : function() {
                return null;
            },
            toggleFunc :  function() {
                return null;
            },
            portion : "north",
            chartType : "chart"
        };

        this.config = $.extend(this.config, params);

        this._lineDataKeys = params.dataKeys;

        this._STARTTIME = params.dataKeys[0].split(",")[0] || "";
        this._AREATYPE_NAME = params.dataKeys[0].split(",")[1] || "";
        this._AREATYPE_ID = params.dataKeys[0].split(",")[2] || "";
        this._lineDataKeys = params.dataKeys;
        this._lineDataKeys[0] = this._STARTTIME;
      
        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.line.prototype.getPanel = function(){
        return this._panel;
    };
    
    /**
     * 获取值
     * @returns {Object}
     */
    Business.line.prototype.getValue = function(){
        var me = this;

        return me._line.getValue();
    };

    /**
     * 下拉框change时，请求line的数据
     * @param {Object} params 从form查询头获取的小区数据和区域类型
     * @param {Object} requestParams 请求数据的
     */
    Business.line.prototype.requestLineData = function(params, requestParams){
    
        var me = this;
        var config = me.config;
        me._requestParams = requestParams;
        var areaListObj = params;

        // 如果需要请求后台的区域对，则发请求
        if(params.areaList && params.areaList.toString() === NEED_AREA_PAIR) {
            var lineParams = $.objClone(me._requestParams);
            lineParams.isTopN = false;
            lineParams.type = NEED_AREA_PAIR;
            // 请求后台
            Sweet.Ajax.request({
                url : Business.url.getData,
                async : false,
                contentType : "application/json;chartset=UTF-8",
                data : JSON.stringify(lineParams),
                timeout : 300000,
                success : function(result) {
                areaListObj = {}
                    areaListObj = {};
                    areaListObj.areaList = result.list;
                },
                error : function() {
                    $.error("Business.line() request line's data error!");
                }
            });
        }
        me._setObjBoxData(areaListObj);
        
    };

    /**
     * 设置值
     * @param {Object} params 值
     */
    Business.line.prototype.setData = function(val){
        var me = this;

        if(val){
            me._line.setData(val);
            me._data = val.data;
        }
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} objValue 多个对象
     */
    Business.line.prototype.setTopNObj = function (objValue) {
        var me = this;

        // 设置多对象对比中的下拉框数据
        me._multiObjBox.setData(objValue);
        var value = objValue.length >= 5 ? objValue.slice(0, 5) : objValue;
        me._multiObjBox.setValue(value);

        // 设置历史对比中的下拉框数据
        me._toPNObjValue = objValue;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.line.prototype.destroy = function () {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };
    
    /**
     * 初始化组件
     * @private
     */
    Business.line.prototype._init = function() {
        
        var me = this;
        var config = me.config;

        // 当前时段的line数据
        me._data_multi_sort = null;
        // 历史line数据
        me._data_his_sort = null;
        me._data_hisPeriod_sort = null;

        me._creatMultiObjPanel();
        me._creatHisPanel();
        me._creatAnalysisTypeRadio();

        // panel
        var panelConfig = {
            width: "100%",
            height: 350, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            header: true,
            title: BusinessI18N.cmp.line.chartDisplay,
            toggle : config.toggleFunc,
            portion : config.portion,
            items : [
                me._multiObjHpanel, 
                me._multiLine, 
                me._hisObjHpanel, 
                me._hisLine
            ],
            padding: 0,
            tools : [me._analysisTypeRadio],
            itemExtend: false
        };

        me._panel = new Sweet.panel.VPanel(panelConfig); 
    };

    /**
     * 多对象对比
     * @private
     */
    Business.line.prototype._creatMultiObjPanel = function() {
        var me = this;
        var config = me.config;

        // 多对象对比
        me._multiObjBox = new Sweet.form.ComboBox_v1({
            width : BusinessI18N.cmp.line.size.objBoxWidth,
            multi : true,
            maxRemains: 5,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label : true,
            labelText : BusinessI18N.cmp.line.selectObject,
            labelWidth : BusinessI18N.cmp.line.size.objBoxLabelWidth
        });

        // 指标
        me._multiIndexBox = new Sweet.form.ComboBox_v1({
            width : BusinessI18N.cmp.line.size.indexWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label : true,
            labelText : BusinessI18N.cmp.line.indexLabelText,
            labelWidth : BusinessI18N.cmp.line.size.indexLabelWidth
        });

        // panel
        me._multiObjHpanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 25,
            items: [
                me._multiObjBox, 
                me._multiIndexBox
            ],
            itemExtend: false
        });

        // line
        me._multiLine = new Sweet.chart.Line({
            height: 290,
            width : "100%",
            graphType : config.graphType,
            isLegend : true
        });     
            
        me._multiLine.addListener("click", function(event, val){
            // 钻取
            me._lineDrill(val);
        });
    };

    /**
     * 历史对比
     * @private
     */
    Business.line.prototype._creatHisPanel = function() {
        var me = this;
        var config = me.config;

        // 对象
        me._hisObjBox = new Sweet.form.ComboBox_v1({
            width : BusinessI18N.cmp.line.size.objBoxWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label : true,
            labelText : BusinessI18N.cmp.line.selectObject,
            labelWidth : BusinessI18N.cmp.line.size.objBoxLabelWidth
        });

        // 指标
        me._hisIndexBox = new Sweet.form.ComboBox_v1({
            width : BusinessI18N.cmp.line.size.indexWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label : true,
            labelText : BusinessI18N.cmp.line.indexLabelText,
            labelWidth : BusinessI18N.cmp.line.size.indexLabelWidth
        });

        // 历史周期
        me._hisPeriodBox = new Sweet.form.ComboBox_v1({
            width : BusinessI18N.cmp.line.size.periodWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label : true,
            labelText : BusinessI18N.cmp.line.selectPeriod,
            labelWidth : BusinessI18N.cmp.line.size.periodLabelWidth
        });

        // panel
        me._hisObjHpanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 25, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            items: [
                me._hisObjBox, 
                me._hisIndexBox,
                me._hisPeriodBox
            ],
            visible : false,
            itemExtend: false
        });

        // line
        me._hisLine = new Sweet.chart.Line({
            height: 290, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            width : "100%",
            graphType : config.graphType, // 默认为折线图
            isLegend : true,
            visible : false
        });

        me._hisLine.addListener("click", function(event, val){
            // 钻取
            me._lineDrill(val);
        });
    };

    /**
     * 多对象和历史对比单选按钮
     * @private
     */
    Business.line.prototype._creatAnalysisTypeRadio = function() {
        var me = this;
        var config = me.config;

        //分析类型的单选切换按钮 --默认多对象
        me._analysisTypeRadio = new Sweet.form.RadioGroup({
            width: BusinessI18N.cmp.line.size.radioWidth,
            height: 30,
            columns: "auto",
            data: [
                {
                    text: BusinessI18N.cmp.line.multiObject,
                    value: "1",
                    data: null,
                    checked: true
                },
                {
                    text: BusinessI18N.cmp.line.history,
                    value: "2",
                    data: null,
                    checked: false
                }
            ]
        });

        me._analysisTypeRadio.addListener("change", function(event, val) {
            if("1" === val.value) {
                me._multiObjHpanel.show();
                me._multiLine.show();
                me._hisObjHpanel.hide();
                me._hisLine.hide();
            }
            else if("2" === val.value) {
                me._multiObjHpanel.hide();
                me._multiLine.hide();
                me._hisObjHpanel.show();
                me._hisLine.show();
                me._firstClickHisFlag = ("undefined" === typeof me._firstClickHisFlag) ? true : false;
                if(me._firstClickHisFlag) {
                    me._hisObjChange();
                    if(me._toPNObjValue) {
                        me._hisObjBox.setData(me._toPNObjValue);
                        me._toPNObjValue = null;
                    }
                }
            }
            else {
                return;
            }
        });
    };

    /**
     * 设置对象、指标、周期下拉框及折线图的数据
     * @param {Object} data 从form查询头获取的小区数据和区域类型
     */
    Business.line.prototype._setObjBoxData = function(data){

        var me = this;
        var areaList = data.areaList;

        areaList = areaList ? areaList : [];

        // 设置多对象对比中的下拉框数据
        me._multiObjBox.setData(areaList);
        var value = areaList.length >= 5 ? areaList.slice(0, 5) : areaList;
        me._multiObjBox.setValue(value);
        me._multiIndexBox.setData(me._getIndexBoxData());

        // 设置历史对比中的下拉框数据
        me._hisObjBox.setData(areaList);
        me._hisPeriodBox.setData(me._getPerioBoxData());
        me._hisIndexBox.setData(me._getIndexBoxData());

        // set折线图数据
        if(0 < areaList.length) {
            me._multiObjChange();
        }

        // 注册change事件
        me._multiObjBox.addListener("change", function(event, val) {
            me._multiObjChange();
        });
        me._multiIndexBox.addListener("change", function(event, val){
            me._multiIndexChange();
        });
        me._hisObjBox.addListener("change", function(event, val) {
            me._hisObjChange();
        }); 

        me._hisIndexBox.addListener("change", function(event, val){
            me._hisIndexBoxChange(val);
        });

        me._hisPeriodBox.addListener("change", function(event, val){
            me._hisPeriodBoxChange(val);
        });
    };

    /**
     * 对象下拉框change事件
     * @private
     */
    Business.line.prototype._multiObjChange = function() {
        
        var me = this;
        var config = me.config;

        var params = {};
        params.areaList = Business.functions.getLeafArray($.objClone(me._multiObjBox.getValue())).value;
        if(!params.areaList) {
            return;
        }
        me._requestData(params, function(data){
            me._data_multi_sort = me._sortLineData(data);
            me._multiIndexChange();
        }, true);
        
    };

    /**
     * 指标下拉框change事件：构造datakeys
     * @private
     */
    Business.line.prototype._multiIndexChange = function() {
        
        var me = this;

        // 构造datakeys
        var objArr = $.objClone(me._multiObjBox.getValue());
        var indicator = $.objClone(me._multiIndexBox.getValue());
        var dataKeys = [me._STARTTIME];

        objArr.forEach(function(item, index, arr) {
            dataKeys.push([item.value + "_" + indicator.value, item.text]);
        });
        
        me._multiLine.setData({
            data : (me._data_multi_sort && me._data_multi_sort.data) || [],
            dataKeys : dataKeys,
            leftUnit : indicator.data
        });
        me._multiLine.doLayout(true);
    };

    /**
     * 对象下拉框change事件，请求对象
     * @private
     */
    Business.line.prototype._hisObjChange = function() {
        
        var me = this;
        var config = me.config;

        var params = {};
        params.areaList = $.objClone(me._hisObjBox.getValue()).value;

        if(!params.areaList) {
            return;
        }
        // 首次切换到历史对比需要请求数据
        me._firstClickHisFlag = ("undefined" === typeof me._firstClickHisFlag) ? true : false;
        me._requestData(params, function(data){
            me._data_his_sort = me._sortLineData(data);
        }, false);

        me._hisPeriodBoxChange();
        me._firstClickHisFlag = false;
    };

    /**
     * 周期下拉框change事件，请求历史周期的数据
     * @private
     */
    Business.line.prototype._hisPeriodBoxChange = function() {
        
        var me = this;

        me._requestHisPeriodData();

        me._hisIndexBoxChange();
    };

    /**
     * 周期下拉框change事件，请求历史周期的数据
     * @private
     */
    Business.line.prototype._requestHisPeriodData = function() {
        
        var me = this;
        var config = me.config;

        var his = me._hisPeriodBox.getValue().value;
        var params = {};
        params.areaList = $.objClone(me._hisObjBox.getValue()).value;

        if(!params.areaList) {
            return;
        }

        var startTime = $.objClone(me._requestParams.startTime);
        startTime = new Date(startTime.replace(/-/g, "/"));
        startTime.setDate(startTime.getDate() - his);
        startTime = $.date.format(startTime, format);

        var endTime = $.objClone(me._requestParams.endTime);
        endTime = new Date(endTime.replace(/-/g, "/"));
        endTime.setDate(endTime.getDate() - his);
        endTime = $.date.format(endTime, format);

        params.startTime = startTime;
        params.endTime = endTime;

        me._requestData(params, function(data){
            me._data_hisPeriod_sort = me._sortLineData(data,  me._hisPeriodBox.getValue().value);
        }, false);
    };

    /**
     * 指标下拉框change事件，重构line的数据
     * @private
     * @param {Object} val 对象下拉框当前选中的值
     */
    Business.line.prototype._hisIndexBoxChange = function() {
        
        var me = this;
        var config = me.config;

        // 构造datakeys
        var objArr = $.objClone(me._hisObjBox.getValue());
        var indicator = $.objClone(me._hisIndexBox.getValue());
        var period = $.objClone(me._hisPeriodBox.getValue());
        var dataKeys = [me._STARTTIME];
        var attribute = objArr.value + "_" + indicator.value;
        dataKeys.push([attribute, BusinessI18N.cmp.line.currentPeriod]);
        dataKeys.push([attribute + "_his", period.text]);
        
        // 合并时间并排序
        var timeMap = $.objClone(me._data_his_sort.map);
        timeMap = $.extend(timeMap, me._data_hisPeriod_sort.map);
        var timeMapKeyArr = [];

        for(var key in timeMap) {
            timeMapKeyArr.push(key);
        }
        timeMapKeyArr = timeMapKeyArr.sort();

        var lineData = [];
        timeMapKeyArr.forEach(function(time, index, arr) {
            var dataItem = {};
            
            dataItem[me._STARTTIME] = time;

            if(0 <= me._data_his_sort.map[time]) {
                var _index = me._data_his_sort.map[time];
                var item = me._data_his_sort.data[_index];
                if(item[attribute] || 0 == item[attribute]) {
                    dataItem[attribute] = item[attribute];
                }
            }

            if(0 <= me._data_hisPeriod_sort.map[time]) {
                var _index = me._data_hisPeriod_sort.map[time];
                var item = me._data_hisPeriod_sort.data[_index];
                if(item[attribute] || 0 == item[attribute]) {
                    dataItem[attribute +"_his"] = item[attribute];
                }
            }

            lineData.push(dataItem);
            
        });

        me._hisLine.setData({
            data : lineData,
            dataKeys : dataKeys,
            leftUnit : indicator.data
        });
        me._hisLine.doLayout(true);
    };

    /**
     * 构造line数据
     * @private
     * @param objArr 对象
     * @param indicator 指标
     * @param val 折现图原始数据
     * @returns json格式的对象
     */
    Business.line.prototype._sortLineData = function(val, his) {
        
        var me = this;
        val = val.list;
        var data = [];
        var map = {};
        var intervalArr = me._requestInterval();
        
        // 没有数据，只显示时间
        if(!val || !val.length) {
            // 优先用请求回来的时间粒度数据
            if(intervalArr && 0 < intervalArr.length) {
                intervalArr.forEach(function(timeStr, strIndex, strArr) {
                    var emptyObj = {};
                    emptyObj[me._STARTTIME] = timeStr;
                    data.push(emptyObj);
                    map[timeStr] = strIndex;
                });
                return {data: data, map: map};
            }

            // 如果请求回来的时间粒度数组无效，则默认只有起始时间和结束时间
            var startTime = me._requestParams.startTime;
            var endTime = me._requestParams.endTime;
            var obj1 = {};
            obj1[me._STARTTIME] = startTime;
            data.push(obj1);
            map[startTime] = 0;
            if(startTime !== endTime) {
                var obj2 = {};
                obj2[me._STARTTIME] = endTime;
                data.push(obj2);
                map[endTime] = 1;
            }
            return {data: data, map: map};
        }

        // 按照UTC时间升序重新排序
        function compare(val1, val2) {
            var compareKey = (0 === me._STARTTIME.indexOf(FORMAT) ? 
                me._STARTTIME.slice(FORMAT.length) : me._STARTTIME);
            if(val1[compareKey] < val2[compareKey]) {
                return -1;
            } else if(val1[compareKey] > val2[compareKey]) {
                return 1;
            } else {
                return 0;
            }
        }
        val.sort(compare);

        // 构造数据
        var i = 0;
        val.forEach(function(dataObj, index2, arr) {
            
            var obj = {};
            // obj的属性，由对象value+每个指标value组成；值为该对象的该指标值
            me._lineDataKeys.forEach(function(key, index3, arr) {
                if(index3 > 0) {
                    // 对象value
                    var objValue = dataObj[me._AREATYPE_ID];
                    obj[objValue + "_" + key[0]] = dataObj[key[0]];
                }
            });

            var timeColumn = dataObj[me._STARTTIME];
            if(his) {
                timeColumn = new Date(timeColumn.replace(/-/g, "/"));
                timeColumn.setDate(timeColumn.getDate() + his);
                timeColumn = $.date.format(timeColumn, format);
                // 只替换年月日
                timeColumn = timeColumn.slice(0, 10) + dataObj[me._STARTTIME].slice(10);
            }

            // 合并时间相同的两项
            if(data.length > 0 && data[data.length-1][me._STARTTIME] === timeColumn) {
                data[data.length-1] = $.extend(data[data.length-1], obj);
            } else {

                obj[me._STARTTIME] = timeColumn;
                data.push(obj);

                // 时间和下标index对应关系map
                map[timeColumn] = i;
                i++;
            }
            
        });

        var result = {data: data, map: map};
        // 从后台没有拿到时间粒度数组
        if(!intervalArr || 1 > intervalArr.length) {
            return result;
        }

        result = {data : [], map : {}};
        intervalArr.forEach(function(timeStr, strIndex, strArr) {
            if(0 <= map[timeStr]) {
                result.data.push(data[map[timeStr]]);
            } else {
                var emptyObj = {};
                emptyObj[me._STARTTIME] = timeStr;
                result.data.push(emptyObj);
            }
            result.map[timeStr] = strIndex;
        });
        return result;
    };

    /**
     * 获取“指标”下拉框的数据
     * @private
     */
    Business.line.prototype._getIndexBoxData = function() {
        
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
     * 获取“选择周期”下拉框数据
     * @private
     * @param {Object} params 下拉框数据
     */
    Business.line.prototype._getPerioBoxData = function() {
        
        var me = this;
        var val = BusinessI18N.cmp.line.timeDate;
    
        var periodData = [];
        val.forEach(function(item, index, arry) {
            periodData.push({value : item[0], text : item[1]});
        });

        return periodData;
    };

    /**
     * 钻取
     * @private
     * @param {Object} params 返回给回调函数的值
     */
    Business.line.prototype._lineDrill = function(val) {
        
        var me = this;
        var config = me.config;
        
        config.drillFunc(val);
    };

    /**
     * 下拉框change时，请求line的数据
     */
    Business.line.prototype._requestData = function(params, callFun, async){
    
        var me = this;
        var config = me.config;

        var lineParams = $.extend($.objClone(me._requestParams), params);
        lineParams.isTopN = false;
        lineParams.type = config.chartType;
        // 请求后台
        Sweet.Ajax.request({
            url : Business.url.getData,
            async : async,
            contentType : "application/json;chartset=UTF-8",
            data : JSON.stringify(lineParams),
            timeout : 300000,
            success : function(result) {
                callFun(result);
            },
            error : function() {
                $.error("Business.line() request line's data error!");
            }
        });

    };

    /**
     * 请求时间间隔
     */
    Business.line.prototype._requestInterval = function(){
    
        var me = this;
        var config = me.config;

        var timeList = [];

        // 请求后台
        Sweet.Ajax.request({
            url : Business.url.getTimeList,
            async : false,
            contentType : "application/json;chartset=UTF-8",
            data : JSON.stringify(me._requestParams),
            timeout : 300000,
            success : function(result) {
                timeList = result;
            },
            error : function() {
                $.error("Business.line() request timeList's data error!");
            }
        });

        return timeList;
    };

})();
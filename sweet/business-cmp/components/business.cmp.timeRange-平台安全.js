/**
 * @fileOverview  
 * <pre>
 * 业务组件--时间范围组件，包括：开始时间、结束时间、时间粒度和忙时选择
 * 2014-1-5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2014, All rights reserved 
 * </pre>
 * @version 1.0
 */
 

(function() {

    Business.timeRange = function(params) {
        
        //初始参数设置
        this.config = {
            // label的宽度
            labelWidth : BusinessI18N.cmp.timeRange.size.timeLableWidth,
            // 粒度下拉框的宽度
            timeBoxWidth : 160,
            // 是否需要粒度组件
            timeUnit : true,
            // 是否需要忙时组件
            timeschedule : true,
            // 忙时组件的宽度
            timescheduleWidth : 128,
            // 是否隐藏
            hidden: false,
            // 
            business : "csnpm",
            // 日期格式
            format : "yyyy-MM-dd hh:mm:ss",
            // 粒度数据
            intervalData : Business.interval.day+","+Business.interval.hour+","+Business.interval.minutes,
            // 渲染ID
            renderTo : null,
            // 是否跨天
            isOneDay : false,
            // 日期组件支持输入
            editable : false
        };
        
        this.config = $.extend(this.config, params);
        
        //初始化存储时长
        this._initStoreDuration(true);
        
        //加载组件
        this._init();
        
        return this;
    };
    
    /**
     * @description 返回各个组件
     * @returns {Object}
     */
    Business.timeRange.prototype.getItems = function(){
        return this.items;
    };

    /**
     * @description 返回模板面板。不建议使用该方法，以后会将其删掉
     * @returns {Object}
     */
    Business.timeRange.prototype.getPanel = function(){
        var me = this;
        var config = me.config;

        var temp = {
            height : 35,
            items : me.items,
            itemExtend : false,
            padding : 5,
            margin : [5, 0, 0, 0]
        };
        if(config.renderTo){
            temp.renderTo = config.renderTo;
        }
        me.panel = new Sweet.panel.HPanel(temp);

        return this.panel;
    };

    /**
     * 获取时间范围组件数据
     */
    Business.timeRange.prototype.getValue = function(){
        var me = this;
        var config = me.config;

        if(me._valid()){
            var value = {};
            //时间范围
            value.startTime = me._startTimeBox.getValue().value;
            value.endTime = me._endTimeBox.getValue().value; 

            //时间粒度
            if(config.timeUnit && config.timeUnit !== "false"){
                var interval = me._intervalBox.getValue().value;
                value.interval = interval;

                // 15分钟粒度，分钟可选故需要规整，起始时间向过去的时间上规整，结束时间向未来的时间上规整
                var startTime = new Date(value.startTime.replace(/-/g, "/"));
                var endTime = new Date(value.endTime.replace(/-/g, "/"));
                var format = config.format;
                if(interval.toString() === Business.interval.minutes.toString()){
                    // 必须加该判断，否则多次调用getValue()方法，导致规整好多次后出错
                    if(0 !== startTime.getMinutes() % 15) {
                        startTime.setMinutes(parseInt(startTime.getMinutes() / 15) * 15);
                        me._startTimeBox.setValue({value: $.date.format(startTime, format), text: "time"});
                        me._startTimeBox.setRegularization(parseInt(interval));
                        value.startTime = me._startTimeBox.getValue().value;
                    }
                    
                    if(0 !== endTime.getMinutes() % 15) {
                        endTime.setMinutes((parseInt(endTime.getMinutes() / 15) + 1) * 15);
                        me._endTimeBox.setValue({value: $.date.format(endTime, format), text: "time"});
                        me._endTimeBox.setRegularization(parseInt(interval));
                        value.endTime = me._endTimeBox.getValue().value;
                    }
                }

            }
            //自定义时间
            if(config.timeschedule && config.timeschedule !== "false"){
                value.schedule = me._timeschedule.getValue();
            }
            return value;
        }else{
            return null;
        }
    };
     
    /**
     * 设置时间范围组件
     *@param {Object} obj 数据信息对象
     */
    Business.timeRange.prototype.setValue = function(obj){
        if($.isNull(obj)){
            return;
        }
        var me = this;
         
        //时间粒度赋值
        if($.isNotNull(obj.interval) && $.isNotNull(me._intervalBox)){
            me._intervalBox.setValue({
                value : obj.interval,
                text : BusinessI18N.cmp.timeRange["interval_" + obj.interval]
            });
        }
        
        //自定义范围赋值
        if($.isNotNull(obj.schedule) && $.isNotNull(me._timeschedule)){
            me._timeschedule.setValue(obj.schedule);
        }
    };
    
    /**
     * 初始化组件 
     */
    Business.timeRange.prototype._init = function() {
        
        var me = this;
        var config = me.config;
        
        me.items = [];

        //开始时间、结束时间
        var serverDate = new Date(Date.parse(me._getServerDate().replace(/-/g, "/")));
        var serverTime = serverDate.getTime() / 1000;
        var endTime = null;
        var startTime = null;
        if(!config.timeUnit || config.timeUnit === "false"){
            endTime = serverTime;
            startTime = endTime - 3600;
        }
        if(config.isOneDay) {
            if(0 === serverDate.getHours() &&　
                0 === serverDate.getMinutes() && 
                0 === serverDate.getSeconds()) {
                startTime = serverDate.setDate(serverDate.getDate - 1).getTime() / 1000;
            } else {
                serverDate.setHours(0);
                serverDate.setMinutes(0);
                serverDate.setSeconds(0);
                startTime = serverDate.getTime() / 1000;
            }
        }
                
        //开始时间
        var labelWidth = config.labelWidth;
        
        var timeBoxWidth = config.timeBoxWidth;
        
        me._startTimeBox = new Sweet.form.Date({
            name : "startTime",
            editable : config.editable,
            width : timeBoxWidth + labelWidth,
            label : true,
            labelText : BusinessI18N.cmp.timeRange.timeRange,
            labelWidth : labelWidth,
            format : config.format,
            value  : startTime ? {value  : startTime, text  : "time"} : {value  : null},
            beforePopDatePanel  : function() {
                me._setStoreRange();
            }
        });
        me.items.push(me._startTimeBox);
        var timeLabel = new Sweet.form.Label({
            align : Sweet.constants.align.Center,
            width : 5,
            value:{text : "-", value : "", data : null}
        });
        me.items.push(timeLabel);
         
        //结束时间
        me._endTimeBox = new Sweet.form.Date({
            name : "endTime",
            editable : config.editable,
            width : timeBoxWidth,
            label : false,
            format : config.format,
            value  : endTime ? {value  : endTime, text  : "time"} : {value  : null},
            beforePopDatePanel  : function() {
                me._setStoreRange();
            }
        });
        me.items.push(me._endTimeBox);
    
        
        //时间粒度
        if(config.timeUnit  && config.timeUnit !== "false"){
            // 粒度对时间规整，format只能为"yyyy-MM-dd hh:mm"
            config.format = "yyyy-MM-dd hh:mm";
            me._startTimeBox.setFiledType("S");
            me._endTimeBox.setFiledType("S");
            //构造时间粒度选择数据
            var intervalBoxData = [];
            var intervalData = config.intervalData.split(",");
            for (var i = 0, len = intervalData.length; i < len; i++) {
                intervalBoxData.push({
                    value : intervalData[i],
                    text : BusinessI18N.cmp.timeRange["interval_" + intervalData[i]]
                });
            }
            
            me._intervalBox = new Sweet.form.ComboBox_v1({
                name : "interval",
                width : BusinessI18N.cmp.timeRange.size.intervalWidth,
                label : true,
                labelText : BusinessI18N.cmp.timeRange.interval,
                labelWidth : BusinessI18N.cmp.timeRange.size.intervalLableWidth,
                multi : false,
                visible: (true === config.hidden || "true" === config.hidden) ? false : true,
                tip : true
            });
            me._intervalBox.addListener("change", function(event, val) {
                me._setTimeUnit(val);
            });
            
            me.items.push(me._intervalBox);

            me._startTimeBox.addListener("click", function(event, val){
                me._setDisableTimePart(me._startTimeBox);
                
            });
            me._endTimeBox.addListener("click", function(event, val){
                me._setDisableTimePart(me._endTimeBox);
                
            });
        }
        
        //忙时组件
        if(config.timeschedule && config.timeschedule !== "false"){
            me._timeschedule = new Sweet.cmp.TimeSchedule({
                name : "timeschedule",
                width : config.timescheduleWidth,
                type : 2,
                tip : true
           });
           me.items.push(me._timeschedule);
        }

        if(me._intervalBox) {
            me._intervalBox.setData(intervalBoxData);
        }
    };

    /**
     * 置灰时分秒
     * @param {Object} timeCmp 日期组件
     */
    Business.timeRange.prototype._setDisableTimePart = function(timeCmp) {
        var me = this;

        var key = me._intervalBox.getValue().value.toString();
        var temp = "";
        if(key === Business.interval.day.toString()){
            temp = "yyyy-MM-dd";
        }
        else if(key === Business.interval.hour.toString()){
            temp = "yyyy-MM-dd hh";
        }
        else if(key === Business.interval.minutes.toString()){
            temp = "yyyy-MM-dd hh:mm";
        }
        else{
            temp = "yyyy-MM-dd hh:mm:ss";
        }
        if($.isNotNull(temp) && key){
            timeCmp.setDisableTimePart(temp);
        }
    };
    
    /**
     * 设置时间粒度
     * @param {Object} obj 选择的时间粒度对象
     */
    Business.timeRange.prototype._setTimeUnit = function(obj) {
        var me = this;
        var format = me.config.format;
        
        //时间粒度
        var interval = obj.value;
        
        //设置忙时组件是否可用
        if(me.config.timeschedule && me.config.timeschedule !== "false"){
            //大于等于天粒度，忙时组件不可用
            var disabled =  interval >= Business.interval.day;
            me._timeschedule.setDisabled(disabled);
        }
        //获取可选时间范围
        var dateRange = me._getMinMaxDate();
        var endTime = dateRange.maxDate;
        // 重新设置时间
        me._endTimeBox.setValue({value: $.date.format(endTime, format), text: "time"});
        
        if(me.config.isOneDay) {
            if(0 === endTime.getHours() &&　
                0 === endTime.getMinutes() && 
                0 === endTime.getSeconds()) {
                endTime.setDate(endTime.getDate - 1);
            } else {
                endTime.setHours(0);
                endTime.setMinutes(0);
                endTime.setSeconds(0);
            }
        } else {
            endTime.setDate(endTime.getDate() - 7);
        }
        me._startTimeBox.setValue({value: $.date.format(endTime, format), text: "time"});
        //设置时间格式
        me._endTimeBox.setRegularization(parseInt(interval));
        me._startTimeBox.setRegularization(parseInt(interval));
    };
    
    /**
     * 根据存储时长，设置时间组件可选范围
     */
    Business.timeRange.prototype._setStoreRange = function() {
        var me = this;
        
        //获取可选时间范围
        var dateRange = me._getMinMaxDate();
        
        //设置开始时间可选范围
        me._startTimeBox.setMinDate(dateRange.minDate.getTime() / 1000);
        me._startTimeBox.setMaxDate(dateRange.maxDate.getTime() / 1000);
        //设置结束时间可选范围
        me._endTimeBox.setMinDate(dateRange.minDate.getTime() / 1000);
        me._endTimeBox.setMaxDate(dateRange.maxDate.getTime() / 1000);
    };
    
    /**
     * 根据存储时长，设置时间组件可选范围
     */
    Business.timeRange.prototype._getMinMaxDate = function() {
        var me = this;
        
        //获取选择粒度
        var interval = me.config.business;
        if(me.config.timeUnit && me.config.timeUnit !== "false"){
            interval = me._intervalBox.getValue().value;
        }
        //获取存储时长
        var storeDays = me._getStoreDuration(interval);
        //获取服务器时间
        var serverDate = me._getServerDate();
        var date = new Date(Date.parse(serverDate.replace(/-/g, "/")));
        
        var minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - storeDays);
        var maxDate = date;
        if(interval.toString() === Business.interval.day.toString()){
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }else if(interval.toString() === Business.interval.hour.toString()){
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 1);
        }else if(interval.toString() === Business.interval.minutes.toString()){
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), (parseInt(date.getMinutes() / 15) - 1) * 15);
        }
        
        return {
            minDate : minDate,
            maxDate : maxDate
        };
    };
    
    
    /**
     * 获取服务时间，返回2000-10-10 12:20:23格式字符串
     */
    Business.timeRange.prototype._getServerDate = function(){
        var me = this;
        var serverDate = "";
         //请求后台，获取服务器时间
         Sweet.Ajax.request({
             url : Business.url.serverDate,
             contentT : "application/json;chartset=UTF-8",
             async : false,
             loadMask : false,
             timeout : 300000,
             success : function(result) {
                 serverDate = result.serverDate;
             },
             error  : function() {
                 throw new Error("Business.timeRange() request serverDate error!");
             }
        });
        return serverDate;
    };
    
    /**
     * 获取业务数据存储时长
     *@param {Number} interval 时间粒度
     */
     Business.timeRange.prototype._getStoreDuration = function(interval){
         var me = this;
         //如果参数中指定存储时长，则根据该存储时间设置时间范围
         if($.isNotNull(me.config.storeDays)){
             return parseInt(me.config.storeDays);
         }
         
         if($.isNull(me._storeDuration)){
             //请求后台，获取业务数据存储时长
             me._initStoreDuration(false);
         }
         var storeDays = me._storeDuration[interval];
         if($.isNull(storeDays)){
             //默认存储时长数据
             if(interval === Business.interval.minutes){
                 return 7;
             }else if(interval === Business.interval.hour){
                 return 30;
             }else {
                 return 60;
             }
         }
         return parseInt(storeDays);
     };
     
     /**
     * 初始化数据存储时长
     *@param {Boolean} async 是否是异步请求
     */
     Business.timeRange.prototype._initStoreDuration = function(async){
         var me = this;
         //请求后台，获取业务数据存储时长
         Sweet.Ajax.request({
             url : Business.url.storeDuration,
             contentT : "application/json;chartset=UTF-8",
             async : async,
             loadMask : false,
             timeout : 300000,
             success : function(result) {
                 me._storeDuration = {};
                 var intervalData = me.config.intervalData.split(",");
                 if($.isNull(intervalData)){
                      me._storeDuration[me.config.business] = result[me.config.business];
                 }else{
                     for(var interval in intervalData){
                         me._storeDuration[interval] = result[me._getIntervalStoreKey(interval)];
                     }
                 }
                 
             },
             error  : function() {
                 throw new Error("Business.timeRange() request storeDuration error!");
             }
        });
     };
     
     /**
     * 界面选择数据校验
     */
     Business.timeRange.prototype._getIntervalStoreKey = function(interval){
         if($.isNull(interval)){
             return "";
         }
         if(Business.interval.day === interval){
             return me.config.business + "day";
         }
         
         if(Business.interval.hour === interval){
             return me.config.business + "hour";
         }
         
         if(Business.interval.minutes === interval){
             return me.config.business + "minute";
         }
         return "";
     };
    
    /**
     * 界面选择数据校验
     */
     Business.timeRange.prototype._valid = function(){
         var me = this;
         //获取可选时间范围
         var dateRange = me._getMinMaxDate();
         var startTime = me._startTimeBox.getValue().data;
         var endTime = me._endTimeBox.getValue().data;
         if(startTime < dateRange.minDate.getTime() / 1000){
             Sweet.Msg.error(BusinessI18N.cmp.timeRange.timeStoreMsg.replace("{0}", $.date.format(dateRange.minDate,"yyyy-MM-dd"))); 
             return false; 
         }else if(endTime> dateRange.maxDate.getTime() / 1000 || startTime >= endTime){
             Sweet.Msg.error(BusinessI18N.cmp.timeRange.finalTimeMsg); 
             return false; 
         }
         return true; 
     };

})();
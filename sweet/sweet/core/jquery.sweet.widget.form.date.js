/**
 * @fileOverview  
 * <pre>
 * form组件--日期组件
 * 2013/1/9
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * 保存组件对象
     */
    var monthDivClass = "sweet-form-date-float-panel-spinner-month",
            yearDivClass = "sweet-form-date-float-panel-spinner-year",
            timeDivClass = "sweet-form-date-float-south-panel",
            spinnerUpClass = "sweet-form-date-float-panel-up",
            spinnerDownClass = "sweet-form-date-float-panel-down",
            spinnerUpGrayClass = "sweet-form-date-float-panel-up-gray",
            spinnerDownGrayClass = "sweet-form-date-float-panel-down-gray",
            dayCurrent = "current",
            dayInvalid = "invalid",
            invalidCls = "currentMonthInvalid",
            dayRest = "rest",
            dataTextCls = "sweet-form-date-text",
            datePicClass = "sweet-form-date-pic-field",
            dataPicGrayClass = "sweet-form-date-pic-field-gray",
            dateParentGrayClass = "sweet-form-date-input-field-gray",
            dateParentClass = "sweet-form-date-input-field",
            datePicDisabledClass = "sweet-form-date-input-pic-disabled",
            //客户端时区
            custmTzone = new Date().getTimezoneOffset() / 60 * (-1),
            // 微调器类型 1：月 2：年 3：时间
            spinnerType = [1, 2, 3],
            // 微调器上下翻类型 1：上翻 2：下翻
            spinnerFlipType = [1, 2],
            // 微调器时间类型 1：小时 2：分钟 3：秒
            spinnerTimeType = [1, 2, 3],
            // 小时数组
            spinnerHourArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            // 分钟数组
            spinnerMinuteArr = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
            // 秒数组
            spinnerSecondArr = [0, 10, 20, 30, 40, 50],
            // 年上下翻类型 1：上翻 2：下翻
            yearFilpType = [1, 2],
            // 月份面板表格天数，最多42格
            dayGridNum = 42,
            // 面板类型 1: 年 2:月3：时间
            floatPanelType = [1, 2, 3];

    $.widget("sweet.widgetFormDate", $.sweet.widgetFormInput, /** @lends Sweet.form.Date.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-date]",
        type: 'text',
        baseChars: "0123456789:-",
        months: $.objClone(Sweet.constants.MONTHS),
        eventNames: /** @lends Sweet.form.Date.prototype*/{
            /**
             * @event
             * @description 日期值改变事件,参数为两个(event, data)
             */
            "change": "改变值事件",
            /**
             * @event
             * @description 图片点击事件,参数为两个(event, data)
             */
            click: "图片点击事件"
        },
        /**
         * @private
         * @description 日期组件配置参数
         * @type object
         */
        options: /** @lends Sweet.form.Date.prototype*/{
            /**
             * @description 设置时间格式
             * @type {String/Number}
             * @default "yyyy-MM-dd hh:mm:ss"
             */
            format: "yyyy-MM-dd hh:mm:ss",
            /**
             * @description 设置时间输入框是否可编辑
             * @type {Bollean}
             * @default true
             */
            editable: true,
            /**
             * @description 设置默认时区
             * @type {String/Number}
             * @default ""
             */
            timeZone: "",
            /**
             * @description 最大时间,日期字符串或utc秒数
             * @type {String/Number}
             * @default ""
             */
            maxDate: "",
            /**
             * @description 最小时间,日期字符串或utc秒数
             * @type {String/Number}
             * @default ""
             */
            minDate: "",
            /**
             * @description 是否只显示当月日期
             * @type {String/Number}
             * @default false
             */
            showDays: false,
            /**
             * @description 外部接口,弹出日期框前调用
             * @type {function}
             * @default $.noop
             */
            beforePopDatePanel: $.noop
        },
        /**
         * @public
         * @description 设置组件的时区
         * @param {Number} data 时区
         */
        setTimeZone: function(data) {
            var me = this;
            if($.isNotNull(data) && $.isNumber(data)){
                me.options.timeZone = data;
                me._isTimeZoneNull = null;
            } else {
                me.options.timeZone = new Date().getTimezoneOffset() / 60 * (-1);
                me._isTimeZoneNull = true;
            }
        },
        /**
         * @public
         * @description 设置组件时间部分的置灰
         * @param {String}data：4种类型，分别是：
         * "yyyy-MM-dd hh:mm:ss","yyyy-MM-dd hh:mm","yyyy-MM-dd hh","yyyy-MM-dd"
         */
        setDisableTimePart: function(data) {
            var me = this;

            if($.isNotNull(data)){
                if(me.options.format === "yyyy-MM-dd hh:mm"){
                    me._setTimeElStyle(me, data);
                }
            }
        },

        /**
         * @public
         * @description 对外提供设置时间控件屏蔽类型的接口 HMS,MS,S
         * @param {String/Number} data 时间限制的类型
         * @default Null
         */
        setFiledType: function(data) {
            var me = this,
                options = me.options;
            var val = me.formElement.val();
            if (!$.isNull(data)) {
                if (data === "HMS") {
                    me.options.format = "yyyy-MM-dd";
                }
                if (data === "MS") {
                    me.options.format = "yyyy-MM-dd hh";
                }
                if (data === "S") {
                    me.options.format = "yyyy-MM-dd hh:mm";
                }
            }
            if ($.isNotNull(val)) {
                if (me.options.format === "yyyy-MM-dd hh") {
                    me.formElement.val($.date.format(new Date(val.replace(/-/g, "/")),
                        me.options.format) + ":00");
                } else {
                    me.formElement.val($.date.format(new Date(val.replace(/-/g, "/")),
                        me.options.format));
                }
            }
        },
        /**
         * @public
         * @description 设置日期最大值
         * @param {String/Number} data 日期字符串或utc秒数
         */
        setMaxDate: function(data) {
            var me = this,
                options = me.options,
                value = me.formElement.val();
            if ($.isNotNull(data)) {
                // 如果设置最大时间,对最大时间进行自动纠错和格式转换
                options.maxDate = me._findError(data);
                var _tZone = options.timeZone;
                if (me._isTimeZoneNull) {
                    _tZone = me._getTempZone(String(value.replace(/-/g, "/")));
                }
                var selectDateUtc = $.date.dateToUTC(String(value.replace(/-/g, "/")), _tZone);
                // 设置最大时间后对文本框的内容进行校验，若不在所设置范围，默认取最大时间为文本框的值
                me._setUtcTimefield(selectDateUtc);
            }
        },
        /**
         * @public
         * @description 设置日期最小值
         * @param {String/Number} data 日期字符串或utc秒数
         */
        setMinDate: function(data) {
            var me = this,
                options = me.options,
                value = me.formElement.val();
            if ($.isNotNull(data)) {
                // 如果设置最小时间,对最小时间进行自动纠错和格式转换
                options.minDate = me._findError(data);
                var _tZone = options.timeZone;
                if (me._isTimeZoneNull) {
                    _tZone = me._getTempZone(String(value.replace(/-/g, "/")));
                }
                var selectDateUtc = $.date.dateToUTC(String(value.replace(/-/g, "/")), _tZone);
                // 设置最小时间后对文本框的内容进行校验，若不在所设置范围，默认取最小时间为文本框的值
                me._setUtcTimefield(selectDateUtc);
            }
        },
        /**
         * @public
         * @description 根据粒度时间向后规整，此方法不包含时间置灰处理
         * @param {Number} intervalSeconds :规整粒度的秒数
         * @param {Number} currentUTC 当前UTC秒数
         * @return {Number} tempVal 返回规整后的UTC时间，单位：秒
         */
        setRegularization: function(intervalSeconds, currentUTC) {
            var me = this,
                tempStr = "",
                options = me.options;
            if ($.isNull(intervalSeconds)) {
                return;
            }

            // 获取当前客户端UTC时间
            var currnetUtc = currentUTC || parseInt($.date.getMilliseconds() / 1000, 10);
            // 获取时间组件当前时间
            var val = me.formElement.val();
            var _tZone = options.timeZone,
                    tempVal = 0,
                    valUtc = 0;
            if (me._isTimeZoneNull) {
                _tZone = me._getTempZone(String(val.replace(/-/g, "/")));
                valUtc = $.date.dateToUTC(String(val.replace(/-/g, "/")), _tZone);
            //对时间向后规整
                tempVal = $.date.setDateAfterOrder(intervalSeconds, valUtc, currnetUtc);
                tempVal += (_tZone - (-new Date(tempVal * 1000).getTimezoneOffset() / 60)) * 3600;
            } else {
                valUtc = $.date.dateToUTC(String(val.replace(/-/g, "/")), _tZone);
                //对时间向后规整
                tempVal = $.date.setDateAfterOrder(intervalSeconds, valUtc, currnetUtc, _tZone);
            }
            // 判断规整后的时间是否在设置的时间范围中，若超出时间范围则取规整后的最大或最小边界值为组件当前值
            tempVal = me._checkMaxMin(tempVal);

            // 时间规整后重新设置时间文本框的值
            me._setUtcTimefield(tempVal);
            return tempVal;
        },
        /**
         * @public
         * @description 根据粒度时间向后规整，推荐使用新接口setRegularization
         * @param {Number} intervalSeconds :规整粒度的秒数
         * @param {Number} currentUTC 当前UTC秒数
         * @return {Number} tempVal 返回规整后的UTC时间，单位：秒
         */
        setInterval: function(intervalSeconds, currentUTC) {
            var me = this,
                tempStr = "",
                options = me.options;
            if ($.isNull(intervalSeconds)) {
                return;
            }
            options.intervalSeconds = intervalSeconds;
            // 根据规整粒度对组件的时分秒输入框进行限制
            switch (intervalSeconds) {
                case 300 :
                case 900 :
                    me.options.format = "yyyy-MM-dd hh:mm";
                    me.setFiledType("S");
                    break;
                case 3600 :
                    me.options.format = "yyyy-MM-dd hh";
                    me.setFiledType("MS");
                    break;
                case 86400 :
                    me.options.format = "yyyy-MM-dd";
                    me.setFiledType("HMS");
                    break;
                default :
                    break;
            }
            // 获取当前客户端UTC时间
            var currnetUtc = currentUTC || parseInt($.date.getMilliseconds() / 1000, 10);

            // 获取时间组件当前时间
            var val = me.formElement.val();
            var _tZone = options.timeZone,
                    tempVal = 0,
                    valUtc = 0;
            if (me._isTimeZoneNull) {
                _tZone = me._getTempZone(String(val.replace(/-/g, "/")));
                valUtc = $.date.dateToUTC(String(val.replace(/-/g, "/")), _tZone);
            //对时间向后规整
                tempVal = $.date.setDateAfterOrder(intervalSeconds, valUtc, currnetUtc);
                tempVal += (_tZone - (-new Date(tempVal * 1000).getTimezoneOffset() / 60)) * 3600;
            } else {
                valUtc = $.date.dateToUTC(String(val.replace(/-/g, "/")), _tZone);
                //对时间向后规整
                tempVal = $.date.setDateAfterOrder(intervalSeconds, valUtc, currnetUtc, _tZone);
            }

            // 判断规整后的时间是否在设置的时间范围中，若超出时间范围则取规整后的最大或最小边界值为组件当前值
            tempVal = me._checkMaxMin(tempVal);

            // 时间规整后重新设置时间文本框的值
            me._setUtcTimefield(tempVal);
            return tempVal;
        },
        /**
         * @private
         * @description 对最大/最小时间进行自动纠错和格式转换
         * @param {String/Number} data 日期字符串或utc秒数
         * @return {String} 日期字符串
         */
        _findError: function(data) {
            var me = this,
                formatDate,
                options = me.options,
                ymdhReg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2})$/;
            // 对时间进行自动纠错和格式转换
            if ("string" === typeof data) {
                var strTime = data,
                    strTimeData = strTime.split(" "),
                    strdateData = strTimeData[0].split("-"),
                    year = strdateData[0],
                    month = strdateData[1] - 1,
                    day = strdateData[2],
                    strtimeData = (strTimeData[1] === undefined) ? ["00", "00", "00"] :
                    strTimeData[1].split(":"),
                    hour = (strtimeData[0] === undefined) ? "00" : strtimeData[0],
                    minute = (strtimeData[1] === undefined) ? "00" : strtimeData[1],
                    second = (strtimeData[2] === undefined) ? "00" : strtimeData[2];
                formatDate = me._initFormElVal(year, month, day, hour, minute, second);
            }
            else if ($.isNumeric(data)) {
                formatDate = me._getTimeStrByUtc(data);
            }
            formatDate = (formatDate.match(new RegExp(ymdhReg)) === null) ? formatDate : formatDate + ":00";
            return formatDate;
        },
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            var me = this;
            // 调用父类_destroyWidget函数销毁文本框
            me._super();
            // 销毁浮动框
            me.floatEl ? me.floatEl.empty().remove() : "";
            me.datePicEl ? me.datePicEl.unbind() : "";

            delete me.regMap;
        },
        /**
         * @private
         * @param {Object} value： UTC秒数, 形如：1368685830
         * @description 转换UTC秒数为日期组件显示的指定时区时间
         */
        _setUtcTimefield: function(value) {
            var me = this,
                utc = parseInt(value, 10),
                dateVal;
            if ($.isNumeric(utc)) {
                utc = me._checkMaxMin(utc);
                dateVal = me._getTimeStrByUtc(utc);
                me.formElement.val(dateVal);
            }
        },

        /**
         * @private
         * @param utc 秒数
         * @description 根据utc转换为指定时区的日期字符串
         * @return {String} 日期字符串，形如："yyyy-MM-dd hh：mm"
         */
        _getTimeStrByUtc : function(utc){
            var tempUtc;
            if($.isString(utc)){
                utc = $.string.toNumber(utc);
            }
            var me = this, newVal,
                format = me.options.format,
                    tZone = me.options.timeZone,
                    custTimeZone = -new Date(utc * 1000).getTimezoneOffset() / 60,
                    temp,
                    cusUtc;
            if (me._isTimeZoneNull) {
                tZone = custTimeZone;
            }
            temp = custTimeZone - tZone;
                cusUtc = utc - 3600 *  temp;

            if (me.options.format === "yyyy-MM-dd hh") {
                newVal = $.date.millisecondsToDate(cusUtc * 1000, format) + ":00";
            } else {
                newVal = $.date.millisecondsToDate(cusUtc * 1000, format);
            }

            return newVal;
        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} obj 形如{value: 日期值, text: 文本: data: utc秒数}
         */
        _setValue: function(obj) {
            var me = this,
                dateVal,
                options = me.options;

            //如果data节点的值存在，首先用data节点的UTC设置组件显示的值
            if ($.isNotNull(obj.data)) {
                me._setUtcTimefield(obj.data);
            }
            else if ($.isNotNull(obj.value)) {
                var value = obj.value;
                // 是否数字
                if ($.isNumeric(value)) {
                    me._setUtcTimefield(value);
                } else {
                    // 不直接使用new Date,防止日期中参数超出范围如："2013-21-11 00:00:00"时返回NAN
                    var strTime, selectDateUtc2;
                    // 当obj.value是string类型时
                    if ("string" === typeof obj.value) {
                        strTime = obj.value;
                        var req = /\//g, tempStr =  strTime.match(req);

                        if($.isNotNull(tempStr)){
                            strTime = strTime.replace(req, "-");
                        }

                        var strTimeData = strTime.split(" "),
                            strdateData = strTimeData[0].split("-"),
                            year = strdateData[0],
                            month = strdateData[1] - 1,
                            day = strdateData[2],
                            strtimeData = (strTimeData[1] === undefined) ? ["00", "00", "00"] : strTimeData[1].split(":"),
                            hour = (strtimeData[0] === undefined) ? "00" : strtimeData[0],
                            minute = (strtimeData[1] === undefined) ? "00" : strtimeData[1],
                            second = (strtimeData[2] === undefined) ? "00" : strtimeData[2];
                        me.formElement.val(me._initFormElVal(year, month, day, hour, minute, second));
                        // 当obj.value是一个时间对象格式时
                    } else if ("object" === typeof obj.value) {
                        strTime = $.date.format(new Date(obj.value), me.options.format);
                        selectDateUtc2 = $.date.dateToUTC(String(strTime.replace(/-/g, "/")), options.timeZone);
                        me._setUtcTimefield(selectDateUtc2);
                    }
                }
                $.data(me.formElement[0], "value", obj);
            }
            else {
                // 设置数据为空时，清空日期组件
                me.formElement.val("");
            }
            me._checkFun();

            dateVal = me.formElement.val();
            //只有disabled为false时才触发用户监听的事件
            if (me.oldValue !== dateVal && !options.disabled) {
                me._triggerHandler(null, "change", me._getValue());
                me.oldValue = dateVal;
            }
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用
         */
        _setDisabled: function(disabled) {
            var me = this,
                formDiv2El = me.formDiv2El,
                datePic = me.datePicEl,
                defPaddingDisableCls = me.defaultPaddingDivDisabledClass,
                defPaddingCls = me.defaultPaddingDivClass;

            if (disabled) {
                formDiv2El.removeClass(dateParentClass).addClass(dateParentGrayClass);
                datePic.removeClass().addClass(dataPicGrayClass);
                me.emptyDiv ? me.emptyDiv.hide() : "";

                if (!formDiv2El.hasClass(defPaddingCls)) {
                    return;
                }
                formDiv2El.removeClass(defPaddingCls).addClass(defPaddingDisableCls);
            } else {
                formDiv2El.removeClass(dateParentGrayClass).addClass(dateParentClass);
                datePic.removeClass().addClass(datePicClass);

                if (!formDiv2El.hasClass(defPaddingDisableCls)) {
                    return;
                }
                formDiv2El.removeClass(defPaddingDisableCls).addClass(defPaddingCls);
            }
        },
        /**
         * @private
         * @description 获取最大值的utc
         * @param {Boolean} data 返回字符串标记，true：表示返回时间字符串，false或者空：表示默认返回utc秒数
         * @return maxUtc 当前组件最大值utc
         */
        _getMaxUtc:function(data){
            var me = this, options = me.options, tzone = options.timeZone, format = options.format,
                    result = "", maxDate = options.maxDate, maxDateFormat = "", _tDate;
            if($.isNotNull(maxDate)){
                if(!data){
                    if("number" === typeof(maxDate)){
                        result = maxDate;
                    }
                    if("string" === typeof(maxDate)){
                        _tDate = new Date(maxDate.replace(/-/g, "/"));
                        maxDateFormat = $.date.format(_tDate, me.options.format);
                        if (me._isTimeZoneNull) {
                            tzone = -_tDate.getTimezoneOffset() / 60;
                        }
                        result = $.date.dateToUTC(String(maxDateFormat.replace(/-/g, "/")), tzone);
                    }
                }else{
                    if("number" === typeof(maxDate)){
                        result = me._getTimeStrByUtc(maxDate);
                    }
                    if("string" === typeof(maxDate)){
                        result = $.date.format(new Date(maxDate.replace(/-/g, "/")), me.options.format);
                    }
                    if (me.options.format === "yyyy-MM-dd hh") {
                        result = result + ":00";
                    }
                }
            }

            return result;
        },
        /**
         * @private
         * @description 获取最小值的utc
         * @param {Boolean} data 返回字符串标记，true：表示返回时间字符串，false或者空：表示默认返回utc秒数
         * @return minUtc 当前组件最小值utc
         */
        _getMinUtc:function(data){
            var me = this, options = me.options, tzone = options.timeZone, minDateFormat="",
                    result = "", minDate = options.minDate, format = options.format, _tDate;
            if($.isNotNull(minDate)){
                if(!data){
                    if("number" === typeof(minDate)){
                        result = minDate;
                    }
                    if("string" === typeof(minDate)){
                        _tDate = new Date(minDate.replace(/-/g, "/"));
                        minDateFormat = $.date.format(_tDate, me.options.format);
                        if (me._isTimeZoneNull) {
                            tzone = -_tDate.getTimezoneOffset() / 60;
                        }
                        result = $.date.dateToUTC(String(minDateFormat.replace(/-/g, "/")), tzone);
                    }
                }
                else{
                    if("number" === typeof(minDate)){
                        result = me._getTimeStrByUtc(minDate);
                    }
                    if("string" === typeof(minDate)){
                        result = $.date.format(new Date(minDate.replace(/-/g, "/")), me.options.format);
                    }
                    if (me.options.format === "yyyy-MM-dd hh") {
                        result = result + ":00";
                    }
                }
            }
            return result;
        },
        /**
         * @private
         * @description 判断所取时间是否在设定的时间范围
         * @return val 当前组件默认UTC时间
         */
        _checkMaxMin: function(selectDateUtc) {
            var me = this, options = me.options, val, tzone = options.timeZone,
                maxDate = options.maxDate, minDate = options.minDate;
            // 同时设置时间最大值和最小值
            if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                var maxDateUtc = me._getMaxUtc(),
                    minDateUtc = me._getMinUtc();
                // 如果当前设置时间在限定范围，取当前所取时间生成输入域默认时间
                if (maxDateUtc >= selectDateUtc && selectDateUtc >= minDateUtc) {
                    val = selectDateUtc;
                }
                // 如果当前设置所取时间不在限定范围，若超过最大值取最大时间生成输入域默认时间
                else if (maxDateUtc < selectDateUtc) {
                    val = maxDateUtc;
                }
                // 如果当前设置所取时间不在限定范围，若小于最小值取最小时间生成输入域默认时间
                else if (minDateUtc > selectDateUtc) {
                    val = minDateUtc;
                }
            }
            // 只设置时间最大值
            else if ($.isNotNull(maxDate) && $.isNull(minDate)) {
                var maxDateUtc1 = me._getMaxUtc();
                // 如果当前所取时间在限定范围，取当前所取时间生成输入域默认时间
                if (maxDateUtc1 >= selectDateUtc) {
                    val = selectDateUtc;
                }
                // 如果当前所取时间不在限定范围，取最大时间生成输入域默认时间
                else {
                    val = maxDateUtc1;
                }
            }
            // 只设置时间最小值
            else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                var minDateUtc1 = me._getMinUtc();
                // 如果当前所取时间在限定范围，取当前所取时间生成输入域默认时间
                if (minDateUtc1 <= selectDateUtc) {
                    val = selectDateUtc;
                }
                // 如果当前所取时间不在限定范围，取最大时间生成输入域默认时间
                else {
                    val = minDateUtc1;
                }
            }
            // 时间最大值和最小值都没有设置
            else {
                val = selectDateUtc;
            }
            return val;
        },
        /**
         * @private
         * @description 获取组件值
         */
        _getValue: function() {
            var me = this,
                options = me.options,
                val = me.formElement.val(),
                reg = (me.options.format === "yyyy-MM-dd hh") ? me.regMap["yyyy-MM-dd hh:mm"] : me.regMap[options.format],
                    regObj = new RegExp(reg),
                    tzone = options.timeZone;
            if ($.isNull(val)) {
                return null;
            }
            //日期验证
            if (val.match(regObj) === null) {
                me._error("The format of the time is wrong!");
                return null;
            } else {
                if (me._isTimeZoneNull) {
                    tzone = me._getTempZone(String(val.replace(/-/g, "/")));
                }
                var utcDate = $.date.dateToUTC(String(val.replace(/-/g, "/")), tzone);
                if ($.isNotNull(options.value)) {
                    return {"value": val, "text": options.value.text, "data": utcDate};
                } else {
                    return {"value": val, "text": "time", "data": utcDate};
                }
            }
        },
        /**
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            var me = this;
            me._super();

            // 发生布局刷新时，要把弹出层关闭
            me._closeFloatPanel();
        },
        /**
         * @private
         * @description 关闭日期浮动面板
         */
        _closeFloatPanel: function() {
            var me = this;
            if (!me.floatEl) {
                return;
            }

            if (!me.openDropDownFlag && $.isVisiable(me.floatEl)) {
                me.floatEl.fadeOut(150);
                // 关闭日期面板上的浮动面板
                me._closeDateFloatPanel();
            }
            me.openDropDownFlag = false;
        },
        /**
         * @private
         * @description 关闭日期面板上的浮动面板
         */
        _closeDateFloatPanel: function() {
            var me = this;
            me.northMonthSpinnerEl.find("." + monthDivClass).hide();
            me.northYearSpinnerEl.find("." + yearDivClass).hide();
            me.southSpinnerEl.find("." + timeDivClass).hide();
        },
        /**
         * @private
         * @description 创建日期输入域
         */
        _createInputField: function() {
            var me = this,
                options = me.options,
				vid = $.isNotNull(options.vID) ? options.vID : (options.id + "_date_input"),
                formDiv2Class = "sweet-form-input-date",
                formElement = me.formElement = $("<input>").addClass(me.defaultInputClass),
                formDiv1El = me.formDiv1El.appendTo(me.formEl),
                formDiv2El = me.formDiv2El = $("<div>").addClass(me.defaultPaddingDivClass + " " + formDiv2Class)
                    .appendTo(formDiv1El),
                datePicEl = me.datePicEl = $("<span>").addClass(datePicClass);
            
            formElement.attr("id", vid);
            
            me.formEl.css({position: "relative"});
            //如果配置中没有配时区，那么默认采用客户端本地(系统)时区
            if($.isNull(options.timeZone)){
                me._isTimeZoneNull = true;
                options.timeZone = custmTzone;
            }

            datePicEl.appendTo(formDiv2El);
            formElement.attr("type", me.type)
                       .bind("click", {"me": me}, me._onDatePicClick)
                       .appendTo(formDiv2El);
            // 如果设置最大时间,对最大时间进行自动纠错
            if (!$.isNull(options.maxDate)) {
                options.maxDate = me._findError(options.maxDate);
            }
            // 如果设置最小时间,对最小时间进行自动纠错
            if (!$.isNull(options.minDate)) {
                options.minDate = me._findError(options.minDate);
            }
            var regMap = {},
                regArr = [/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/,
                          /^(\d{4})-(\d{2})-(\d{2}) (\d{2})$/, /^(\d{4})-(\d{2})-(\d{2})$/],
                formatArr = ["yyyy-MM-dd hh:mm:ss", "yyyy-MM-dd hh:mm", "yyyy-MM-dd hh", "yyyy-MM-dd"];
            for (var i = 0; i < regArr.length; i++) {
                regMap[formatArr[i]] = regArr[i];
            }
            me.regMap = regMap;
            // 日期图片绑定事件
            me.datePicEl.bind("click", {"me": me}, me._onDatePicClick);
        },

        /**
         * @private
         * @description 点击日期图片时触发，弹出日期面板
         * @param event {Object} 图片事件对象
         */
        _onDatePicClick: function(event) {
            var me = event.data.me,
                options = me.options,
                disabled = options.disabled,
                maxZIndex, left, top;
            if(disabled){
                me.floatEl ? me.floatEl.hide() : "";
                return;
            }

            if ($.isFunction(options.beforePopDatePanel)) {
                options.beforePopDatePanel();
            }
            // 延迟创建
            if (!me.floatEl) {
                me._createDateFloatPanel();
            }

            if ($.isNull(me.oldValue)) {
                me.oldValue = me.formElement.val();
            }
            maxZIndex = $.getMaxZIndex(me.floatEl.css("z-index"));
            me.floatEl.css("z-index", maxZIndex);
            // 关闭日期面板上的浮动面板
            me._closeDateFloatPanel();
            if ("block" === me.floatEl.css("display")) {
                event.stopImmediatePropagation();
                return;
            }

            // 设置日期值
            me._getCurrentDate(me);
            // 设置月面板
            me._changeDateMidContent(me);
            //设置浮动窗口年月日的显示
            me._setFloatPanelDateVal(me);

            me._setTimeElStyle(me, options.format);
            //外面的点击图片的监听
            me._triggerHandler(event, "click", me.formElement.val());

            // 使用getFloatOffset()方法实现浮动框在页面上的定位
            left = $.getFloatOffset(me.formDiv2El, me.floatEl, true).left;
            top = $.getFloatOffset(me.formDiv2El, me.floatEl).top;
            me.floatEl.css("left", left).css("top", top - 1);
            if (!disabled) {
                me.floatEl.fadeIn(150);
            }
            me.openDropDownFlag = true;
        },


        /**
         * @private
         * @description 设置浮动窗口年月日的显示
         */
        _setFloatPanelDateVal:function(me){
            // 设置月
            me.northMonthSpinnerEl.find("input").val($.string.lpad(me.month, 2, "0"));
            // 设置年
            me.northYearSpinnerEl.find("input").val($.string.lpad(me.year, 4, "0"));
            // 设置日
            me._setDayEl(null, me, me.day);
        },
        /**
         * @private
         * @description 点击日期图片时触发，修改时间输入框的样式
         * @param me {Object} 时间组件对象, tempFormat:组件的格式
         */
        _setTimeElStyle: function(me, tempFormat) {
            var timeEl, ZERO = "00";
            // 设置时间,根据不同format条件限制时间输入域
            if (tempFormat === "yyyy-MM-dd") {
                timeEl = me.southSpinnerEl.find("input");
                $(timeEl[0]).val($.string.lpad(ZERO, 2, "0"));
                $(timeEl[1]).val($.string.lpad(ZERO, 2, "0"));
                $(timeEl[2]).val($.string.lpad(ZERO, 2, "0"));
                me.inputHourEl.attr("disabled", true);
                me.inputMinuteEl.attr("disabled", true);
                me.inputSecondEl.attr("disabled", true);
                me.timeUpEl.removeClass(spinnerUpClass);
                me.timeDownEl.removeClass(spinnerDownClass);
                me.timeUpEl.addClass(spinnerUpGrayClass);
                me.timeDownEl.addClass(spinnerDownGrayClass);
            } else {
                // 设置上下翻按钮的样式
                me.timeUpEl.removeClass(spinnerUpGrayClass);
                me.timeDownEl.removeClass(spinnerDownGrayClass);
                me.timeUpEl.addClass(spinnerUpClass);
                me.timeDownEl.addClass(spinnerDownClass);
            }
            if (tempFormat === "yyyy-MM-dd hh") {
                timeEl = me.southSpinnerEl.find("input");
                $(timeEl[0]).val($.string.lpad(me.hour, 2, "0"));
                $(timeEl[1]).val($.string.lpad(ZERO, 2, "0"));
                $(timeEl[2]).val($.string.lpad(ZERO, 2, "0"));
                me.inputHourEl.attr("disabled", false);
                me.inputMinuteEl.attr("disabled", true);
                me.inputSecondEl.attr("disabled", true);
            }
            if (tempFormat === "yyyy-MM-dd hh:mm") {
                timeEl = me.southSpinnerEl.find("input");
                $(timeEl[0]).val($.string.lpad(me.hour, 2, "0"));
                $(timeEl[1]).val($.string.lpad(me.minute, 2, "0"));
                $(timeEl[2]).val($.string.lpad(ZERO, 2, "0"));
                me.inputHourEl.attr("disabled", false);
                me.inputMinuteEl.attr("disabled", false);
                me.inputSecondEl.attr("disabled", true);
            }
            if (tempFormat === "yyyy-MM-dd hh:mm:ss") {
                timeEl = me.southSpinnerEl.find("input");
                $(timeEl[0]).val($.string.lpad(me.hour, 2, "0"));
                $(timeEl[1]).val($.string.lpad(me.minute, 2, "0"));
                $(timeEl[2]).val($.string.lpad(me.second, 2, "0"));
                me.inputHourEl.attr("disabled", false);
                me.inputMinuteEl.attr("disabled", false);
                me.inputSecondEl.attr("disabled", false);
            }
        },
        /**
         * @private
         * @description 获取当前日期值
         * @param {Object} me 当前日期对象
         */
        _getCurrentDate: function(me) {
            var opt = me.options,
                newVal, valueFormat, valueUtc,
                value = me.formElement.val(),
                reg = (me.options.format === "yyyy-MM-dd hh") ? me.regMap["yyyy-MM-dd hh:mm"] : me.regMap[me.options.format],
                    regObj = new RegExp(reg),
                    _timeZone = opt.timeZone;
            if ($.isNull(value.match(regObj))) {
                value = new Date();
            }else {
                value = $.isNull(value) ? new Date() : new Date(value.replace(/-/g, "/"));
            }
            valueFormat = $.date.format(new Date(value), me.options.format);
            if (me._isTimeZoneNull) {
                _timeZone = me._getTempZone(String(valueFormat.replace(/-/g, "/")));
            }
            valueUtc = $.date.dateToUTC(String(valueFormat).replace(/-/g, "/"), _timeZone);
            valueUtc = me._checkMaxMin(valueUtc);
            newVal = me._getTimeStrByUtc(valueUtc);

            value = new Date(newVal.replace(/-/g, "/"));
            me.year = value.getFullYear();
            me.month = value.getMonth() + 1;
            me.day = value.getDate();
            me.hour = value.getHours();
            me.minute = value.getMinutes();
            me.second = value.getSeconds();
            return value;
        },
        /**
         * @private
         * @description 创建日期浮动面板
         */
        _createDateFloatPanel: function() {
            var me = this,
                floatClass = "sweet-form-date-float-panel",
                floatEl = me.floatEl = $("<div>").addClass(floatClass + " " + me.floatBgClass).hide();
            me._createDateNorthItem();
            me._createDateMiddlleItem();
            me._createDateSouthItem();
            floatEl.bind("click", function(event) {
                // 关闭日期面板上的浮动面板
                me._closeDateFloatPanel();
                // 阻止事件冒泡，防止点击日期面板时日期面板关闭
                event.stopImmediatePropagation();
            }).appendTo("body");
        },
        /**
         * @private
         * @description 创建日期浮动窗口顶部，包括上下年、月选择
         */
        _createDateNorthItem: function() {
            var me = this,
                northItemClass = "sweet-form-date-float-panel-north",
                northPreYearClass = "sweet-form-date-float-panel-preyear",
                northNextYearClass = "sweet-form-date-float-panel-nextyear",
                northPreMonthClass = "sweet-form-date-float-panel-premonth",
                northNextMonthClass = "sweet-form-date-float-panel-nextmonth",
                northItemEl = me.northItemEl = $("<div>").addClass(northItemClass),
                northPreYearEl = me.northPreYearEl = $("<span>").addClass(northPreYearClass),
                northNextYearEl = me.northNextYearEl = $("<span>").addClass(northNextYearClass),
                northPreMonthEl = me.northPreMonthEl = $("<span>").addClass(northPreMonthClass),
                northNextMonthEl = me.northNextMonthEl = $("<span>").addClass(northNextMonthClass),
                northMonthSpinnerEl = me.northMonthSpinnerEl = me._createDateSpinner(spinnerType[0]),
                northYearSpinnerEl = me.northYearSpinnerEl = me._createDateSpinner(spinnerType[1]);
            // 上一年
            northPreYearEl.bind("click", {"me": me}, me._onPreYearClick).appendTo(northItemEl);
            // 上一月
            northPreMonthEl.bind("click", {"me": me},
                    function(event){
                        var monthJq = me.northMonthSpinnerEl.find("input"),
                            month = monthJq[0].value;
                        if(parseInt(month, 10) === 1){
                            me.month = 12;
                        }
                        me._onPreMonthClick(event);
                    }
                ).appendTo(northItemEl);
            // 月选择微调器
            northMonthSpinnerEl.appendTo(northItemEl);
            // 年选择显示框
            northYearSpinnerEl.appendTo(northItemEl);
            // 下一月
            northNextMonthEl.bind("click", {"me": me},
                function(event){
                    var monthJq = me.northMonthSpinnerEl.find("input"),
                        month = monthJq[0].value;
                    if(parseInt(month, 10) === 12){
                        me.month = "01";
                    }
                    me._onNextMonthClick(event);
                }
                ).appendTo(northItemEl);
            // 下一年
            northNextYearEl.bind("click", {"me": me},  me._onNextYearClick).appendTo(northItemEl);
            northItemEl.appendTo(me.floatEl);
        },
        /**
         * @private
         * @description 前一年
         * @param {Object} event 前一年按钮事件对象
         */
        _onPreYearClick: function(event) {
            var me = event.data.me;
            // 触发年微调器的下翻事件
            me.northYearSpinnerEl.find("." + spinnerDownClass).click();

        },
        /**
         * @private
         * @description 下一年
         * @param {Object} event 下一年按钮事件对象
         */
        _onNextYearClick: function(event) {
            var me = event.data.me;
            // 触发年微调器的上翻事件
            me.northYearSpinnerEl.find("." + spinnerUpClass).click();
        },
        /**
         * @private
         * @description 上一月
         * @param {Object} event 前一月按钮事件对象
         */
        _onPreMonthClick: function(event) {
            var me = event.data.me,
                monthJq = me.northMonthSpinnerEl.find("input"),
                month = monthJq[0].value;
            if(parseInt(month, 10) === 1){
                var tempShowVal = 13;
                monthJq.val(tempShowVal);
                me._onPreYearClick(event);
            }

            // 触发月微调器的下翻事件
            me.northMonthSpinnerEl.find("." + spinnerDownClass).click();
        },
        /**
         * @private
         * @description 下一月
         * @param {Object} event 下一月按钮事件对象
         */
        _onNextMonthClick: function(event) {
            var me = event.data.me,
                monthJq = me.northMonthSpinnerEl.find("input"),
                month = monthJq[0].value;
            if(parseInt(month, 10) === 12){
                var tempShowVal = 0;
                monthJq.val(tempShowVal);
                me._onNextYearClick(event);
            }
            // 触发月微调器的上翻事件
            me.northMonthSpinnerEl.find("." + spinnerUpClass).click();
        },
        /**
         * @private
         * @description 创建日期浮动窗口输入文本框
         * @param {String} type 类型  1：月  2：年 3：时间
         * @return {Object} 返回微调器对象
         */
        _createDateSpinner: function(type) {
            var me = this,
                spanClass = "sweet-form-date-float-panel-span",
                inputClass = "sweet-form-date-float-panel-input",
                inputNorthClass = "sweet-form-date-float-panel-input-north",
                inputSouthClass = "sweet-form-date-float-panel-input-south",
                spinnerClass = "sweet-form-date-float-panel-spinner",
                spinnerNorthClass = "sweet-form-date-float-panel-spinner-north",
                spinnerSouthClass = "sweet-form-date-float-panel-spinner-south",
                spanEl = $("<span>").addClass(spanClass),
                upEl = $("<a>").addClass(spinnerUpClass),
                downEl = $("<a>").addClass(spinnerDownClass),
                spinnerEl = $("<div>").addClass(spinnerClass);
            upEl.appendTo(spanEl);
            downEl.appendTo(spanEl);
            spanEl.appendTo(spinnerEl);
            // 月/年
            if (spinnerType[0] === type || spinnerType[1] === type) {
                var inputEl = me.inputEl = $("<input>").attr("type", "text").keydown(function() {return false;})
                        .addClass(inputClass)
                        .addClass(inputNorthClass)
                        .appendTo(spinnerEl),
                    floatPanelEl,
                    panelType;
                if (spinnerType[0] === type) {
                    inputEl.attr({"maxlength": 2, "max": 12, "min": 1});
                    panelType = floatPanelType[1];
                    floatPanelEl = me._createMonthPanel(me);
                    me.floatMonthPanelEl = floatPanelEl;
                } else {
                    // 微调器最大最小值
                    inputEl.attr({"maxlength": 4, "max": 9999, "min": 1900});
                    panelType = floatPanelType[0];
                    floatPanelEl = me._createYearPanel(inputEl);
                    me.floatYearPanelEl = floatPanelEl;
                }
                floatPanelEl.appendTo(spinnerEl);
                spinnerEl.addClass(spinnerNorthClass);

                // 点击文本框，弹出年/月选择窗口
                inputEl.bind("click", {"me": me, "inputObj": inputEl, "panelObjs": [floatPanelEl], "type": panelType},
                    me._onInputClick);
                // 文本框失去焦点时的事件
                inputEl.blur(function() {
                    me.year = $.string.toNumber(me.northYearSpinnerEl.find("input").val());
                    me.month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val());
                    me._changeDateMidContent(me);
                });
                // 上翻
                upEl.bind("click", {"me": me, "type": spinnerFlipType[0], "objs": inputEl, "spinnerType": type},
                me._onSpinnerFlipClick);

                // 下翻
                downEl.bind("click", {"me": me, "type": spinnerFlipType[1], "objs": inputEl, "spinnerType": type},
                me._onSpinnerFlipClick);
            }

            // 时间
            else if (spinnerType[2] === type) {
                var emElClass = "sweet-form-date-float-south-time-em",
                    inputAttrs = {"type": "text", "maxlength": 2},
                    inputHourEl = me.inputHourEl= $("<input>").attr(inputAttrs).keydown(function() {return false;})
                        .addClass(inputClass)
                        .addClass(inputSouthClass),
                    inputMinuteEl = me.inputMinuteEl = $("<input>").attr(inputAttrs).keydown(function() {return false;})
                        .addClass(inputClass)
                        .addClass(inputSouthClass),
                    inputSecondEl = me.inputSecondEl = $("<input>").attr(inputAttrs).keydown(function() {return false;})
                        .addClass(inputClass)
                        .addClass(inputSouthClass),
                    emEl1 = $("<em>").addClass(emElClass).text(Sweet.constants.symbol.COLON),
                    emEl2 = $("<em>").addClass(emElClass).text(Sweet.constants.symbol.COLON),
                    floatHourPanelEl,
                    floatMinutePanelEl,
                    floatSecondEl,
                    panelObjs = [];

                // 小时
                floatHourPanelEl = me._createTimePanel(me, spinnerHourArr, inputHourEl);
                me.floatHourPanelEl = floatHourPanelEl;
                floatHourPanelEl.appendTo(spinnerEl);

                // 分钟
                floatMinutePanelEl = me._createTimePanel(me, spinnerMinuteArr, inputMinuteEl);
                me.floatMinutePanelEl = floatMinutePanelEl;
                floatMinutePanelEl.appendTo(spinnerEl);

                // 秒
                floatSecondEl = me._createTimePanel(me, spinnerSecondArr, inputSecondEl);
                me.floatSecondEl = floatSecondEl;
                floatSecondEl.appendTo(spinnerEl);
                panelObjs = [floatHourPanelEl, floatMinutePanelEl, floatSecondEl];
                spinnerEl.addClass(spinnerSouthClass);
                inputHourEl.attr({"max": 23, "min": 0, "timeType": spinnerTimeType[0]})
                        .bind("click",{"me": me, "inputObj": inputHourEl, "hourObj": inputHourEl, "panelObjs": panelObjs},
                me._onInputClick)
                        .appendTo(spinnerEl);
                me.inputHourEl = inputHourEl;
                emEl1.appendTo(spinnerEl);
                inputMinuteEl.attr({"max": 59, "min": 0, "timeType": spinnerTimeType[1]})
                        .bind("click",{"me": me, "inputObj": inputMinuteEl, "hourObj": inputHourEl, "panelObjs": panelObjs},
                me._onInputClick)
                        .appendTo(spinnerEl);
                me.inputMinuteEl = inputMinuteEl;
                emEl2.appendTo(spinnerEl);
                inputSecondEl.attr({"max": 59, "min": 0, "timeType": spinnerTimeType[2]})
                        .bind("click",{"me": me, "inputObj": inputSecondEl, "hourObj": inputHourEl, "panelObjs": panelObjs},
                me._onInputClick)
                        .appendTo(spinnerEl);
                me.inputSecondEl = inputSecondEl;
                // 上翻
                upEl.bind("click",{"me": me, "type": spinnerFlipType[0], "objs": [inputHourEl,inputMinuteEl,inputSecondEl],
                        "spinnerType": type}, me._onSpinnerFlipClick);
                me.timeUpEl = upEl;
                // 下翻
                downEl.bind("click", {"me": me, "type": spinnerFlipType[1], "objs": [inputHourEl,inputMinuteEl, inputSecondEl],
                        "spinnerType": type}, me._onSpinnerFlipClick);
                me.timeDownEl = downEl;
            } else {
                me._error("Unsupported type. type=" + type);
                return;
            }
            return spinnerEl;
        },
        /**
         * @private
         * @description 日期面板输入文本框单击事件
         * @param {type} event 文本框对象
         */
        _onInputClick: function(event) {
            var data = event.data,
                me = data.me,
                panelObjs = data.panelObjs,
                inputEl = data.inputObj,
                panelType = data.type,
                floatPanelEl, position, top = 0,
                left = 0, weight = 0, height = 0,
                inputElVal = inputEl.val();

            if (1 === panelObjs.length) {
                me.floatHourPanelEl.hide();
                me.floatMinutePanelEl.hide();
                me.floatSecondEl.hide();
                // 当点击年输入框时,重新计算年面板的年份并绘制年面板
                if (floatPanelType[0] === panelType) {
                    me.floatMonthPanelEl.hide();
                    inputEl.select();
                    me._changeYearPanel(me, inputElVal, inputEl);
                }
                // 当点击月输入框时,重新计算月面板的月份并绘制月面板
                if (floatPanelType[1] === panelType) {
                    me.floatYearPanelEl.hide();
                    inputEl.select();
                    me._changeMonthPanel(me, inputElVal, inputEl);
                }
                floatPanelEl = panelObjs[0];
                // 计算组件相对位置
                position = inputEl.position();
                height = inputEl.height() - 1;
            } else {
                var objResult = me._onInputTimeElClick(event);
                floatPanelEl = objResult.floatPanelEl;
                height = objResult.height;
                weight = objResult.weight;
                position = objResult.position;
            }

            // 实现浮动框在页面上的定位
            top = position.top + height + 3;
            left = position.left + weight;
            floatPanelEl.css({"top": top, "left": left}).show();
            event.stopImmediatePropagation();
        },
        /**
         * @private
         * @description 日期面板的时分秒输入文本框单击事件
         * @param {Object} event 事件对象
         */
        _onInputTimeElClick: function(event) {
            var data = event.data,
                me = data.me,
                panelObjs = data.panelObjs,
                inputEl = data.inputObj,
                floatPanelEl, position, weight = -3, height = 0,
                hourObj = data.hourObj, innerHeight;

            me.floatYearPanelEl.hide();
            me.floatMonthPanelEl.hide();
            me.spinnerTimeType = inputEl.attr("timeType") ? parseInt(inputEl.attr("timeType"), 10) : null;
            inputEl.select();
            me._changeTimePanel(me, inputEl.val(), inputEl, me.spinnerTimeType);
            if (spinnerTimeType[0] === me.spinnerTimeType) {   // 小时
                innerHeight = 84;
                floatPanelEl = panelObjs[0].height(innerHeight);
                panelObjs[1].hide();
                panelObjs[2].hide();
            } else if (spinnerTimeType[1] === me.spinnerTimeType) {   // 分钟
                innerHeight = 42;
                floatPanelEl = panelObjs[1].height(innerHeight);
                panelObjs[0].hide();
                panelObjs[2].hide();
            } else if (spinnerTimeType[2] === me.spinnerTimeType) {    // 秒
                innerHeight = 20;
                floatPanelEl = panelObjs[2].height(innerHeight);
                panelObjs[0].hide();
                panelObjs[1].hide();
            } else {
                me._error("_onInputClick() Unsupport time type. not 1/2/3. type=" + me.spinnerTimeType);
                return;
            }

            // 根据所点击的输入框的状态该变上下翻按钮的样式
            if (floatPanelEl[0].disabled) {
                me.timeUpEl.removeClass(spinnerUpClass).addClass(spinnerUpGrayClass);
                me.timeDownEl.removeClass(spinnerDownClass).addClass(spinnerDownGrayClass);
            }
            height = -innerHeight - 11;
            position = hourObj.position();
            return {"floatPanelEl": floatPanelEl, "height": height, "weight": weight, "position": position};
        },
        /**
         * @private
         * @description 当点击月/年输入框微调器时，根据时间范围重新设定微调器的值范围
         * @param {Object} me 时间组件对象
         * @param {Number} spinnerTypes 输入框类型
         * @param {Object} objs 输入框对象
         */
        _clickMYInputSpinner: function(me, spinnerTypes, objs) {
            var opt = me.options,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                currentYear = $.string.toNumber(me.northYearSpinnerEl.find("input").val()),
                currentMonth = $.string.toNumber(me.northMonthSpinnerEl.find("input").val()),
                maxDateMonth = new Date(maxDate.replace(/-/g, "/")).getMonth() + 1,
                minDateMonth = new Date(minDate.replace(/-/g, "/")).getMonth() + 1,
                maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear();

            // 当点击月输入框微调器时，根据时间范围重新设定微调器的值范围
            if (spinnerType[0] === spinnerTypes) {
                // 同时设置最大时间和最小时间
                if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (maxDateYear === minDateYear) {
                        objs.attr({"maxlength": 2, "max": maxDateMonth, "min": minDateMonth});
                    } else {
                        if (maxDateYear === currentYear) {
                            objs.attr({"maxlength": 2, "max": maxDateMonth, "min": 1});
                        } else if (minDateYear === currentYear) {
                            objs.attr({"maxlength": 2, "max": 12, "min": minDateMonth});
                        } else {
                            objs.attr({"maxlength": 2, "max": 12, "min": 1});
                        }
                    }
                }
                // 只设置时间最大值
                else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                    if (currentYear === maxDateYear) {
                        objs.attr({"maxlength": 2, "max": maxDateMonth, "min": 1});
                    } else {
                        objs.attr({"maxlength": 2, "max": 12, "min": 1});
                    }
                }
                // 只设置时间最小值
                else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (currentYear === minDateYear) {
                        objs.attr({"maxlength": 2, "max": 12, "min": minDateMonth});
                    } else {
                        objs.attr({"maxlength": 2, "max": 12, "min": 1});
                    }
                }
                // 时间最大值和最小值都没有设置
                else {
                    objs.attr({"maxlength": 2, "max": 12, "min": 1});
                }
            }

            //当点击年输入框微调器时，根据时间范围重新设定微调器的值范围
            if (spinnerType[1] === spinnerTypes) {
                objs.attr({"maxlength": 4, "max": ($.isNotNull(maxDate)) ?
                            new Date(maxDate.replace(/-/g, "/")).getFullYear() : 9999,
                    "min": ($.isNotNull(minDate)) ? new Date(minDate.replace(/-/g, "/")).getFullYear() : 1900});
            }
        },
        /**
         * @private
         * @description 当点击时间输入框微调器时，根据时间范围重新设定微调器的值范围
         * @param {Object} me 时间组件对象
         * @param {Number} spinnerTypes 输入框类型
         * @param {String} type 类型  1：月  2：年 3：时间
         * @return {Boolean} true/false 在时间范围内返回true，否则返回false
         */
        _clickTimeInputSpinner: function(me, spinnerTypes, type) {
            if (spinnerType[2] === spinnerTypes) {
                var stepNumber = 1,
                    selectFormat, selectUtc,
                    opt = me.options, tzone = opt.timeZone,
                    maxDate = opt.maxDate, minDate = opt.minDate,
                    maxDateUtc = me._getMaxUtc(),
                    minDateUtc =  me._getMinUtc(),
                    year = me.northYearSpinnerEl.find("input").val(), // 年
                    month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val()) - stepNumber, // 月
                    day = me.dayEl.val(), // 日
                    timeEl = me.southSpinnerEl.find("input"),
                    hour, // 时
                    minute, // 分
                    second;// 秒
                // 点击时微调器
                if (spinnerTimeType[0] === me.spinnerTimeType) {
                    if (spinnerFlipType[0] === type) {
                        hour = $.string.toNumber($(timeEl[0]).val()) + stepNumber; // 时
                    }
                    if (spinnerFlipType[1] === type) {
                        hour = $.string.toNumber($(timeEl[0]).val()) - stepNumber; // 时
                    }
                    minute = "00"; // 分
                    second = "00"; // 秒 
                    // 点击分微调器
                } else if (spinnerTimeType[1] === me.spinnerTimeType) {
                    if (spinnerFlipType[0] === type) {
                        minute = $.string.toNumber($(timeEl[1]).val()) + stepNumber; // 分
                    }
                    if (spinnerFlipType[1] === type) {
                        minute = $.string.toNumber($(timeEl[1]).val()) - stepNumber; // 分
                    }
                    hour = $(timeEl[0]).val(); // 时
                    second = "00"; // 秒 
                    // 点击秒微调器
                } else if (spinnerTimeType[2] === me.spinnerTimeType) {
                    if (spinnerFlipType[0] === type) {
                        second = $.string.toNumber($(timeEl[2]).val()) + stepNumber; // 秒
                    }
                    if (spinnerFlipType[1] === type) {
                        second = $.string.toNumber($(timeEl[2]).val()) - stepNumber; // 秒
                    }
                    hour = $(timeEl[0]).val(); // 时
                    minute = $(timeEl[1]).val(); // 分
                }
                selectFormat = me._initFormElVal(year, month, day, hour, minute, second);
                if (me._isTimeZoneNull) {
                    tzone = me._getTempZone(String(selectFormat.replace(/-/g, "/")));
                }
                selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
                // 同时设置最大时间和最小时间
                if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    // 点击微调器后的时间浮动面板的值若不在设定的值范围，则return；否则继续
                    if (maxDateUtc < selectUtc || minDateUtc > selectUtc) {
                        return false;
                    } else {
                        return true;
                    }
                }
                // 只设置时间最大值
                else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                    // 点击微调器后的时间浮动面板的值若不在设定的值范围，则return；否则继续
                    if (maxDateUtc < selectUtc) {
                        return false;
                    } else {
                        return true;
                    }
                }
                // 只设置时间最小值
                else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    // 点击微调器后的时间浮动面板的值若不在设定的值范围，则return；否则继续
                    if (minDateUtc > selectUtc) {
                        return false;
                    } else {
                        return true;
                    }
                }
                // 时间最大值和最小值都没有设置
                else {
                    me.inputSecondEl.attr({"max": 59, "min": 0, "timeType": spinnerTimeType[2]});
                    me.inputHourEl.attr({"max": 23, "min": 0, "timeType": spinnerTimeType[0]});
                    me.inputMinuteEl.attr({"max": 59, "min": 0, "timeType": spinnerTimeType[1]});
                    return true;
                }
            } else {
                return true;
            }
        },
        /**
         * @private
         * @description 微调器上下翻事件
         * @param {Object} event 微调器对象
         */
        _onSpinnerFlipClick: function(event) {
            var data = event.data,
                me = event.data.me,
                type = data.type,
                timeType = me.spinnerTimeType,
                objs = data.objs,
                obj1 = objs.length > 1 ? (spinnerTimeType[0] === timeType ? objs[0]
                : (spinnerTimeType[1] === timeType ? objs[1]:(spinnerTimeType[2] === timeType ? objs[2]:null))):objs,
                obj = (obj1 === null) ? objs[2] : obj1,
                spinnerTypes = data.spinnerType,
                max,
                min,
                value,
                preValue,
                nextValue;

            // 初始化时间输入框，默认选择小时输入框
            obj = (obj1 === null) ? objs[0] : obj1;
            me.spinnerTimeType = (obj1 === null) ? spinnerTimeType[0] : timeType;

            value = obj.val();

            // 当点击月/年输入框微调器时，根据时间范围重新设定微调器的值范围
            me._clickMYInputSpinner(me, spinnerTypes, objs);

            // 当点击时间输入框微调器时，根据时间范围重新设定微调器的值范围
            if (!me._clickTimeInputSpinner(me, spinnerTypes, type)) {
                return;
            }
            if ($.isNull(value)) {
                me._error("_onSpinnerFlipClick(): Can't get value.");
                return;
            }

            max = parseInt(obj.attr("max"), 10);
            min = parseInt(obj.attr("min"), 10);
            value = $.string.toNumber(value);
            preValue = value - 1;
            nextValue = value + 1;

            // 增加
            if (spinnerFlipType[0] === type) {
                if (nextValue > max) {
                    return;
                }
                if (obj[0].disabled) {
                    return;
                }
                var opt = me.options, tzone = opt.timeZone,
                maxDate = me._getMaxUtc(true),
                maxDateUtc = me._getMaxUtc(),
                year = me.northYearSpinnerEl.find("input").val(), // 年
                month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val())-1, // 月
                day = me.dayEl.val(), // 日
                timeEl = me.southSpinnerEl.find("input");
                var v = $.string.lpad(nextValue, 2, "0");
                // 小时
                if ($.isNotNull(maxDate) && spinnerTimeType[0] === me.spinnerTimeType) {
                    var sFormat = me._initFormElVal(year, month, day, v, $(timeEl[1]).val(), $(timeEl[2]).val());
                    if (me._isTimeZoneNull) {
                        tzone = me._getTempZone(String(sFormat.replace(/-/g, "/")));
                    }
                    var sUtc = $.date.dateToUTC(String(sFormat).replace(/-/g, "/"), tzone); 
                    if(sUtc > maxDateUtc){
                        $(timeEl[1]).val("00");
                        $(timeEl[2]).val("00");
                    }
                    // 分钟
                } else if ($.isNotNull(maxDate) && spinnerTimeType[1] === me.spinnerTimeType) {
                    var sFormat = me._initFormElVal(year, month, day, $(timeEl[0]).val(), v, $(timeEl[2]).val());
                    if (me._isTimeZoneNull) {
                        tzone = me._getTempZone(String(sFormat.replace(/-/g, "/")));
                    }
                    var sUtc = $.date.dateToUTC(String(sFormat).replace(/-/g, "/"), tzone); 
                    if(sUtc > maxDateUtc){
                        $(timeEl[2]).val("00");
                    }
                }
                obj.val(v);
            // 减少
            } else if (spinnerFlipType[1] === type) {
                if (preValue < min) {
                    return;
                }
                if (obj[0].disabled) {
                    return;
                }
                obj.val($.string.lpad(preValue, 2, "0"));
            } else {
                me._error("_onSpinnerFlipClick(): Unsupported type. Type equals 1 or 2. type=" + type);
                return;
            }

            // 说明是月或年微调器变化
            if (1 === objs.length) {
                // 点击月面板微调器
                if (spinnerType[0] === spinnerTypes) {
                    me.year = $.string.toNumber(me.northYearSpinnerEl.find("input").val());
                    me.month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val());
                    me._changeDateMidContent(me);
                    me._setDayEl(null, me, me.day);
                }
                //点击年面板微调器，判断当前所选的月份是否在时间范围
                else {
                    me._changeMonthInput();
                    me._setDayEl(null, me, me.day);
                }
            }
        },
        /**
         * @private
         * @description 创建月面板
         * @param {Object} me 日期组件对象
         * @return {Object} 返回面板对象
         */
        _createMonthPanel: function(me) {
            var monthAEl = [],
                monthLiEl,
                monthUlEl,
                monthDivEl = me.monthDivEl = $("<div>").addClass(monthDivClass + " " + me.floatBgClass).hide();
            for (var i = 0, j = 0; i < 12; i++, j++) {
                if (0 === i || 6 === i) {
                    monthLiEl = $("<li>");
                    monthUlEl = $("<ul>");
                    monthLiEl.appendTo(monthUlEl);
                    monthUlEl.appendTo(monthDivEl);
                }
                monthAEl[j] = $("<a>").val(i + 1).text(Sweet.core.i18n.month[i]);
                monthAEl[j].appendTo(monthLiEl);
            }
            monthUlEl.appendTo(monthDivEl);
            me.monthAEl = monthAEl;
            monthDivEl.bind("click", function(event) {
                event.stopImmediatePropagation();
            });
            return monthDivEl;
        },
        /**
         * @private 
         * @description 修改月面板
         * @param {Object} me 日期组建对象
         * @param {Number/String} month 月
         * @param {Object} inputEl 输入框对象
         */
        _changeMonthPanel: function(me, month, inputEl) {
            if ($.isNull(month)) {
                me._error("_changeYearPanel() The input parameter 'month' is null.");
                return;
            }
            var opt = me.options, tzone = opt.timeZone, fmt = me.options.format, selectFormat, selectUtc,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                currentYear = parseInt(me.northYearSpinnerEl.find("input").val(), 10),
                maxDateMonth = new Date(maxDate.replace(/-/g, "/")).getMonth() + 1,
                minDateMonth = new Date(minDate.replace(/-/g, "/")).getMonth() + 1,
                maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear(),
                maxDateFormat = $.date.format(new Date(maxDateYear, maxDateMonth - 1, "01", "00", "00", "00"), me.options.format),
                maxDateUtc = $.date.dateToUTC(String(maxDateFormat).replace(/-/g, "/"), tzone),
                minDateFormat = $.date.format(new Date(minDateYear, minDateMonth - 1, "01", "00", "00", "00"), me.options.format),
                minDateUtc = $.date.dateToUTC(String(minDateFormat).replace(/-/g, "/"), tzone);

            function addMonthBind(j) {
                me.monthAEl[j].bind("click", function() {
                    var aEl = $(this);
                    inputEl.val($.string.lpad(aEl.val(), 2, "0"));
                    me.monthDivEl.hide();
                    // 点击选中月份，重新绘制天数面板
                    me.year = $.string.toNumber(me.northYearSpinnerEl.find("input").val());
                    me.month = $.string.toNumber(inputEl.val());
                    me._changeDateMidContent(me);
                    me._setDayEl(null, me, me.day);
                });
            }
            function addMonthUnbind(j) {
                me.monthAEl[j].removeClass().unbind("click").select(function() {
                    return false;
                });
            }
            for (var i = 0, j = 0; i < 12; i++, j++) {
                addMonthUnbind(j);
                selectFormat = $.date.format(new Date(currentYear, i, "01", "00", "00", "00"), me.options.format);
                selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
                // 同时设置最大和最小时间
                if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (selectUtc <= maxDateUtc && selectUtc >= minDateUtc) {
                        addMonthBind(j);
                    } else {
                        me.monthAEl[j].addClass(dataTextCls);
                    }
                }
                // 只设置最大时间
                else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                    if (selectUtc <= maxDateUtc) {
                        addMonthBind(j);
                    } else {
                        me.monthAEl[j].addClass(dataTextCls);
                    }
                }
                // 只设置最小时间
                else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (selectUtc >= minDateUtc) {
                        addMonthBind(j);
                    } else {
                        me.monthAEl[j].addClass(dataTextCls);
                    }
                }
                // 最大时间和最小时间都不设置
                else {
                    addMonthBind(j);
                }
                me.monthAEl[j].val(i + 1).text(Sweet.core.i18n.month[i]);
            }
        },
        /**
         * @private 
         * @description 点击年微调器或年面板时根据时间范围动态修改月份输入框的值
         */
        _changeMonthInput: function() {
            var me = this,
                opt = me.options,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                northYearSpinnerEl = me.northYearSpinnerEl.find("input"),
                northMonthSpinnerEl = me.northMonthSpinnerEl.find("input"),
                currentYear = $.string.toNumber(northYearSpinnerEl.val()),
                currentMonth = $.string.toNumber(northMonthSpinnerEl.val()),
                maxDateMonth = new Date(maxDate.replace(/-/g, "/")).getMonth() + 1,
                minDateMonth = new Date(minDate.replace(/-/g, "/")).getMonth() + 1,
                maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear();
            // 同时设置最大时间和最小时间
            if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                if (maxDateYear > minDateYear) {
                    if (maxDateYear === currentYear) {
                        if (currentMonth > maxDateMonth) {
                            northMonthSpinnerEl.val($.string.lpad(maxDateMonth, 2, "0"));
                        }
                    } else if (minDateYear === currentYear) {
                        if (currentMonth < minDateMonth) {
                            northMonthSpinnerEl.val($.string.lpad(minDateMonth, 2, "0"));
                        }
                    }
                }
            }
            // 只设置时间最大值
            if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                if (maxDateYear === currentYear) {
                    if (currentMonth > maxDateMonth) {
                        northMonthSpinnerEl.val($.string.lpad(maxDateMonth, 2, "0"));
                    }
                }
            }
            // 只设置时间最小值
            if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                if (minDateYear === currentYear) {
                    if (currentMonth < minDateMonth) {
                        northMonthSpinnerEl.val($.string.lpad(minDateMonth, 2, "0"));
                    }
                }
            }
            me.year = $.string.toNumber(northYearSpinnerEl.val());
            me.month = $.string.toNumber(northMonthSpinnerEl.val());
            me._changeDateMidContent(me);
            me._changeTimeInput(me);
        },
        /**
         * @private
         * @description 创建年面板
         * @param {Object} inputObj 输入对象
         * @return {Object} 返回面板对象
         */
        _createYearPanel: function(inputObj) {
            var me = this,
                value = inputObj.val() || 2013,
                yearPicPreClass = "sweet-form-date-float-panel-spinner-year-pre",
                yearPicCenterClass = "sweet-form-date-float-panel-spinner-year-center",
                yearPicNxtClass = "sweet-form-date-float-panel-spinner-year-nxt",
                yearPicItemClass = "sweet-form-date-float-panel-spinner-year-item",
                yearUlEl = $("<ul>"),
                yearLiEl,
                yearPicDivEl,
                yearPicPreEl,
                yearPicCenterEl,
                yearPicNxtEl,
                beginYear,
                endYear,
                yearDivEl = me.yearDivEl = $("<div>").addClass(yearDivClass + " " + me.floatBgClass).hide(),
                yearAEl = [];
            if ($.isNull(value) || !$.isNumeric(value)) {
                me._error("_createYearPanel(): The value is null or not a number! value=" + value);
                return;
            }
            if ("number" !== typeof value) {
                value = parseInt(value, 10);
            }

            // 创建年面板
            beginYear = value - 5;
            endYear = value + 5;
            for (var i = beginYear, j = 0; i < endYear; i++, j++) {
                if (beginYear === i || value === i) {
                    yearLiEl = $("<li>").appendTo(yearUlEl);
                }
                yearAEl[j] = $("<a>").val(i).text(i);
                yearAEl[j].appendTo(yearLiEl);
            }
            yearUlEl.appendTo(yearDivEl);

            // 创建年面板上下翻图片
            yearPicDivEl = $("<div>").addClass(yearPicItemClass).appendTo(yearDivEl);
            yearPicPreEl = $("<a>").addClass(yearPicPreClass).appendTo(yearPicDivEl)
                    .bind("click", {"me": me, "type": yearFilpType[0], "objs": yearAEl, "inputObj": inputObj},
                        me._onNorthYearFilp);
            yearPicCenterEl = $("<a>").addClass(yearPicCenterClass).appendTo(yearPicDivEl).bind("click", function(event) {
                // 关闭浮动面板
                yearDivEl.hide();
            });
            yearPicNxtEl = $("<a>").addClass(yearPicNxtClass).appendTo(yearPicDivEl)
                    .bind("click", {"me": me, "type": yearFilpType[1], "objs": yearAEl, "inputObj": inputObj},
                        me._onNorthYearFilp);
            yearDivEl.bind("click", function(event) {
                event.stopImmediatePropagation();
            });
            me.yearAEl = yearAEl;
            me.yearUlEl = yearUlEl;
            return yearDivEl;
        },
        /**
         * @private
         * @description 年浮动面板上的年上下翻图片点击事件
         * @param {Object} event 上下翻图片对象
         */
        _onNorthYearFilp: function(event) {
            var data = event.data,
                me = data.me,
                type = data.type,
                objs = data.objs,
                inputObj = data.inputObj,
                beginYear, endYear,
                opt = me.options,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear();
            if (yearFilpType[0] === type) {
                beginYear = parseInt(objs[0].val(), 10) - 10;
            } else if (yearFilpType[1] === type) {
                beginYear = parseInt(objs[0].val(), 10) + 10;
            } else {
                me._error("_onNorthYearFilp(): Unsupported type. Type equals 1 or 2. type=" + type);
                return;
            }
            endYear = beginYear + 10;
            // 同时设置最大时间和最小时间
            if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                if (endYear < minDateYear || beginYear > maxDateYear) {
                    return;
                } else {
                    me._addYearRange(me, inputObj, beginYear, endYear);
                }
            }
            // 只设置最大时间
            else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                if (beginYear > maxDateYear) {
                    return;
                } else {
                    me._addYearRange(me, inputObj, beginYear, endYear);
                }
            }
            // 只设置最小时间
            else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                if (endYear < minDateYear) {
                    return;
                } else {
                    me._addYearRange(me, inputObj, beginYear, endYear);
                }
            }
            // 最大时间和最小时间都不设置
            else {
                me._addYearRange(me, inputObj, beginYear, endYear);
            }
        },
        /**
         * @private
         * @description 根据是否添加时间范围，重新绘制年浮动面板
         * @param {Object} me 日期组建对象
         * @param {Object} inputObj 输入对象
         * @param {String/Number} beginYear 年浮动面板的起始
         * @param {String/Number} endYear 结束年
         */
        _addYearRange: function(me, inputObj, beginYear, endYear) {
            var opt = me.options,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear();
            function addYearBind(j) {
                me.yearAEl[j].bind("click", function() {
                    var aEl = $(this);
                    inputObj.val(aEl.val());
                    me.yearDivEl.hide();
                    // 点击选中年份，重新设置月输入框的值
                    me._changeMonthInput();
                    // 点击选中年份，重新绘制天数面板
                    me.year = $.string.toNumber(inputObj.val());
                    me.month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val());
                    me._changeDateMidContent(me);
                    me._setDayEl(null, me, me.day);
                });
            }
            function addYearUnbind(j) {
                me.yearAEl[j].removeClass().unbind("click").select(function() {
                    return false;
                });
            }
            for (var i = beginYear, j = 0; i < endYear; i++, j++) {
                addYearUnbind(j);
                // 同时设置最大时间和最小时间
                if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (minDateYear > i || maxDateYear < i) {
                        me.yearAEl[j].addClass(dataTextCls);
                    } else {
                        addYearBind(j);
                    }
                }
                // 只设置最大时间
                else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                    if (maxDateYear < i) {
                        me.yearAEl[j].addClass(dataTextCls);
                    } else {
                        addYearBind(j);
                    }
                }
                // 只设置最小时间
                else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                    if (minDateYear > i) {
                        me.yearAEl[j].addClass(dataTextCls);
                    } else {
                        addYearBind(j);
                    }
                }
                // 最大时间和最小时间都不设置
                else {
                    addYearBind(j);
                }
                me.yearAEl[j].val(i).text(i);
            }
        },
        /**
         * @private
         * @description 修改年浮动面板
         * @param {Object} me 日期组建对象
         * @param {Number/String} year 年
         * @param {Object} inputEl 输入框对象
         */
        _changeYearPanel: function(me, year, inputEl) {
            if ($.isNull(year)) {
                me._error("_changeYearPanel() The input parameter 'year' is null.");
                return;
            }
            if ("string" === $.type(year)) {
                year = parseInt(year, 10);
            }
            var beginYear = year - 5, endYear = year + 5;
            me._addYearRange(me, inputEl, beginYear, endYear);
        },
        /**
         * @private
         * @description 创建日期浮动窗口中间部分，月选择面板
         */
        _createDateMiddlleItem: function() {
            var me = this,
                dateContentClass = "sweet-form-date-float-middle-content",
                weekClass = "sweet-form-date-float-middle-week",
                middleItemEl = me.middleItemEl = $("<div>").appendTo(me.floatEl),
                dateContentEl = me.dateContentEl = $("<div>").addClass(dateContentClass).appendTo(middleItemEl),
                weekEl = $("<div>"),
                i18nObj = Sweet.core.i18n;
            weekEl.html("<em>" + i18nObj.week[6] +
                    "</em><em>" + i18nObj.week[0] +
                    "</em><em>" + i18nObj.week[1] +
                    "</em><em>" + i18nObj.week[2] +
                    "</em><em>" + i18nObj.week[3] +
                    "</em><em>" + i18nObj.week[4] +
                    "</em><em>" + i18nObj.week[5] +
                    "</em>")
                    .addClass(weekClass).appendTo(dateContentEl);

            // 绘制日期面板
            me._createDateMidContent();
        },
        /**
         * @private
         * @description 创建浮动面板上的日期列表
         * @param {Object} event 月面板上下翻按钮对象
         */
        _createDateMidContent: function(event) {
            var monthClass = "sweet-form-date-float-middle-month",
                monthOtherClass = "sweet-form-date-float-middle-month-other",
                data = (event && event.data) ? event.data : null,
                me = (data && data.me) ? data.me : this,
                ulEl = $("<ul>").appendTo(me.dateContentEl),
                liEl,
                emEl,
                dateEmEl = me.dateEmEl = [];

            // 生成月面板，固定42格
            for (var i = 0; i < dayGridNum; i++) {
                if (0 === i % 7) {
                    liEl = $("<li>").addClass(monthClass + " " + monthOtherClass).appendTo(ulEl);
                }
                emEl = $("<em>").appendTo(liEl);
                dateEmEl[i] = emEl;
            }
        },

        /**
         * @private
         * @description 动态改变月面板显示天数
         * @param {Object} me 当前日期组件对象
         */
        _changeDateMidContent: function(me) {
            var year = me.year,
                month = me.month,
                months = me.months,
                currentDate = new Date(year, month - 1, 1),
                beginDay = currentDate.getDay(),
                endDay,
                currentDays,
                preDays,
                nextDays,
                days = [],
                dateEmEl = me.dateEmEl,
                opt = me.options, format = opt.format,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                tzone = opt.timeZone;
            if ($.date.isLeapYear(year)) {
                months[1] = 29;
            } else {
                // 不为闰年，应该恢复2月份天数为28天。问题单号：DTS2013072606986
                months[1] = 28;
            }
            currentDays = months[month - 1];
            endDay = beginDay + currentDays - 1;

            // 计算上个月天数
            preDays = (1 === month ? months[11] : months[month - 2]);

            // 计算下个月天数
            nextDays = (12 === month ? months[0] : months[month]);

            var maxDateYear = new Date(maxDate.replace(/-/g, "/")).getFullYear(),
                maxDateMonth = new Date(maxDate.replace(/-/g, "/")).getMonth() + 1,
                maxDateDate = new Date(maxDate.replace(/-/g, "/")).getDate(),
                minDateYear = new Date(minDate.replace(/-/g, "/")).getFullYear(),
                minDateMonth = new Date(minDate.replace(/-/g, "/")).getMonth() + 1,
                minDateDate = new Date(minDate.replace(/-/g, "/")).getDate(),
                maxDateFormat = $.date.format(new Date(maxDateYear, maxDateMonth - 1,
                maxDateDate, "00", "00", "00"), me.options.format),
                maxDateUtc = $.date.dateToUTC(String(maxDateFormat).replace(/-/g, "/"), tzone),
                minDateFormat = $.date.format(new Date(minDateYear, minDateMonth - 1,minDateDate, "00", "00", "00"), me.options.format),
                minDateUtc = $.date.dateToUTC(String(minDateFormat).replace(/-/g, "/"), tzone),
                sourVal = me._getValue() ? me._getValue().value : "",
                tempStr = sourVal ? sourVal.split(" ") : "",
                time = tempStr.length === 2 ? tempStr[1] : "00:00:00",
                selectFormat, selectUtc, newVal,newUtc,invalidTestResult;
            if(isNaN(maxDateYear) || isNaN(maxDateMonth) || isNaN(maxDateDate)){
                maxDateUtc = null;
            }
            if(isNaN(minDateYear) || isNaN(minDateMonth) || isNaN(minDateDate)){
                minDateUtc = null;
            }

            function _addDayUnbind(j) {
                dateEmEl[j].removeClass().unbind("click").select(function() {
                    return false;
                });
            }

            // 计算月份面板上的天数，并赋值
            for (var i = 0, j = 0, k = 0; i < dayGridNum; i++) {
                _addDayUnbind(i);
                
                if (i < beginDay) {
                    days[i] = preDays - beginDay + i + 1;

                    if(month > 1){
                        newVal = year + "/" + (month-1) + "/" + days[i] + " " + time;
                        newUtc = $.date.dateToUTC(newVal, tzone);
                    }
                    if(month === 1){
                        newVal = (year-1) + "/" + 12 + "/" + days[i] + " " + time;
                        newUtc = $.date.dateToUTC(newVal, tzone);
                    }

                    invalidTestResult = me._isDayValid(maxDateUtc, minDateUtc, newUtc);
                    if(invalidTestResult){
                        dateEmEl[i].addClass(dayInvalid);
                    }
                    else{
                        dateEmEl[i].addClass(invalidCls);
                    }

                    if (!opt.showDays) {
                        dateEmEl[i].text(days[i]).val(days[i]);
                        if(invalidTestResult){
                            
                            dateEmEl[i].bind("click", {"me": me, "dayEl": dateEmEl[i], "invalidType":"up","minUtc":minDateUtc, "jumpUpUtc":newUtc},
                                me._setInvalDayEl);
                        }
                    } else {
                        dateEmEl[i].text("").val(days[i]).removeClass(dayInvalid).addClass(invalidCls);
                    }

                } else if (i > endDay) {
                    var jumpVal, jumpUtc,tempYear, tempMonth;
                    days[i] = ++j;
                    if(month < 12){
                        tempYear = year;
                        tempMonth = month+1;
                        newVal = year + "/" + tempMonth + "/" + days[i] + " " + "00:00:00";
                        jumpVal = year + "/" + tempMonth + "/" + days[i] + " " + time;
                        newUtc = $.date.dateToUTC(newVal, tzone);
                        jumpUtc = $.date.dateToUTC(jumpVal, tzone);

                    }
                    if(month === 12){
                        tempYear = year+1;
                        tempMonth = 1;
                        newVal = tempYear + "/" + 1 + "/" + days[i] + " " +  "00:00:00";
                        jumpVal = tempYear + "/" + 1 + "/" + days[i] + " " + time;
                        newUtc = $.date.dateToUTC(newVal, tzone);
                        jumpUtc = $.date.dateToUTC(jumpVal, tzone);
                    }
                    invalidTestResult = me._isDayValid(maxDateUtc, minDateUtc, newUtc);
                    if(invalidTestResult){
                        dateEmEl[i].addClass(dayInvalid);
                    }
                    else{
                        dateEmEl[i].addClass(invalidCls);
                    }

                    if (!opt.showDays) {
                        dateEmEl[i].text(days[i]).val(days[i]);
                        if(invalidTestResult){
                            var tempDay = {"year": tempYear, "month":tempMonth , "day":days[i]};
                            dateEmEl[i].bind("click",
                                {"me": me, "dayEl": dateEmEl[i], "invalidType":"down", "maxUtc": maxDateUtc, "jumpDownUtc":jumpUtc, "jumpDownDay":tempDay},
                                me._setInvalDayEl);
                        }
                    } else {
                        dateEmEl[i].text("").val(days[i]).removeClass(dayInvalid).addClass(invalidCls);
                    }
                } else {
                    days[i] = ++k;
                    selectFormat = $.date.format(new Date(year, month - 1, days[i], "00", "00", "00"), me.options.format);
                    selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
                    if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                        if (selectUtc <= maxDateUtc && selectUtc >= minDateUtc) {
                            dateEmEl[i].bind("click", {"me": me, "dayEl": dateEmEl[i]}, me._setDayEl);
                            if (0 === i % 7 || 6 === i % 7) {
                                dateEmEl[i].addClass(dayRest);
                            }
                        } else {
                            dateEmEl[i].addClass(invalidCls);
                        }
                    }
                    // 只设定最大时间
                    else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                        if (selectUtc <= maxDateUtc) {
                            dateEmEl[i].bind("click", {"me": me, "dayEl": dateEmEl[i]}, me._setDayEl);
                            if (0 === i % 7 || 6 === i % 7) {
                                dateEmEl[i].addClass(dayRest);
                            }
                        } else {
                            dateEmEl[i].addClass(invalidCls);
                        }
                    }
                    // 只设定最小时间
                    else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                        if (selectUtc >= minDateUtc) {
                            dateEmEl[i].bind("click", {"me": me, "dayEl": dateEmEl[i]}, me._setDayEl);
                            if (0 === i % 7 || 6 === i % 7) {
                                dateEmEl[i].addClass(dayRest);
                            }
                        } else {
                            dateEmEl[i].addClass(invalidCls);
                        }
                    }
                    // 没有设置最大时间和最小时间
                    else {
                        dateEmEl[i].bind("click", {"me": me, "dayEl": dateEmEl[i]}, me._setDayEl);
                        if (0 === i % 7 || 6 === i % 7) {
                            dateEmEl[i].addClass(dayRest);
                        }
                    }
                    dateEmEl[i].text(days[i]).val(days[i]);
                }
            }
        },

        /**
         * @private
         * @description 检查所选的日期是否合理
         * @param maxUtc 日期最大值的utc秒数
         * @param minUtc 日期最小值的utc秒数
         * @param testUtc 被检测的日期utc秒数
         * @returns {Boolean} true 被检测的日期合理，false 被检测的日期不合理
         */
        _isDayValid:function(maxUtc, minUtc, testUtc){
            var me = this,
                maxVal = me._getMaxUtc(true),
                minVal = me._getMinUtc(true);

            if($.isNotNull(testUtc)){
                if($.isNotNull(maxVal) && $.isNotNull(maxUtc) && $.isNull(minUtc)){
                    if(maxUtc < testUtc){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else if($.isNotNull(minUtc) && $.isNotNull(minVal) && $.isNull(maxUtc)){
                    if(minUtc > testUtc){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
                else if($.isNotNull(maxVal) && $.isNotNull(minVal) && $.isNotNull(maxUtc) && $.isNotNull(minUtc)){
                    if(maxUtc >= testUtc && minUtc <= testUtc){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return true;
                }
            }
        },
        /**
         * @private
         * @description 点击灰色日期时设置选中天
         * @param event 单击置灰色的天时触发
         * @param me 日期组件对象
         * @param day 设置天时传入
         */
        _setInvalDayEl: function(event, me, day) {
            if (event) {
                var data = event.data,
                    self = data.me,
                    dayEl = data.dayEl[0].value,
                    invalType = data.invalidType,
                    minDate = self._getMinUtc(true),
                    northMonthSpinnerEl = self.northMonthSpinnerEl.find("input"),
                    year = parseInt(self.northYearSpinnerEl.find("input").val(), 10), // 年
                    month = parseInt($.string.toNumber(northMonthSpinnerEl.val()), 10); // 月;

                if($.isNull(year) && $.isNull(month)){
                    var tempDay = new Date();
                    year = tempDay.getFullYear();
                    month = parseInt((tempDay.getMonth()+1), 10);
                }

                if("up" === invalType){
                    if(month > 1){
                        self.day = dayEl;
                        self._onPreMonthClick(event);
                        self._setInvalidClickDayEi(self, self.day);
                    }
                    if(month === 1){
                        self.day = dayEl;
                        self.month = 12;
                        northMonthSpinnerEl.val(self.month);
                        self._onPreYearClick(event);

                        self._setInvalidClickDayEi(self, self.day);
                    }
                    if(data.minUtc && data.jumpUpUtc && (data.jumpUpUtc < data.minUtc)){
                        //若调整的时间utc小于组件的最小值，修改分钟和秒数的显示值为00
                        var timeEl1 = self.southSpinnerEl.find("input");
                        var tempMin, tempSec, tempMinAndSec, tempMinStr, tempMinAndSecArr;
                        if("string" === typeof(minDate)){
                            tempMinStr = minDate;
                        }
                        if("number" === typeof(minDate)){
                            tempMinStr = me._getTimeStrByUtc(minDate);
                        }
                        tempMinAndSecArr = tempMinStr.split(" ");
                        tempMinAndSec = tempMinAndSec[1].split(":");
                        tempMin = tempMinAndSec[0];
                        tempSec = tempMinAndSec[1];
                        $(timeEl1[0]).val(tempMin); // 设置小时输入框
                        $(timeEl1[1]).val(tempSec); // 设置分输入框
                        $(timeEl1[2]).val("00");// 设置秒输入框
                    }
                }
                if("down" === invalType){
                    if(month < 12){
                        self.day = dayEl;
                        self._onNextMonthClick(event);
                        self._setInvalidClickDayEi(self, self.day);
                    }
                    if(month === 12){
                        self.day = dayEl;
                        self.month = "01";
                        northMonthSpinnerEl.val(self.month);
                        self._onNextYearClick(event);

                        self._setInvalidClickDayEi(self, self.day);
                    }
                    if(data.maxUtc && data.jumpDownUtc && (data.jumpDownUtc > data.maxUtc)){
                        //若调整的时间utc大于组件的最大值，修改分钟和秒数的显示值为00
                        var timeEl1 = self.southSpinnerEl.find("input");
                        $(timeEl1[0]).val("00"); // 设置小时输入框
                        $(timeEl1[1]).val("00"); // 设置分输入框
                        $(timeEl1[2]).val("00");// 设置秒输入框
                    }
                }
            }
        },

        /**
         * @private
         * @description 点击非本月的天，对此天设置选中样式
         * @param me
         * @param day
         */
        _setInvalidClickDayEi:function(me, day){
            var temp,tempObjVal;

            for(var i = 0; i < me.dateEmEl.length; i++){
                temp = me.dateEmEl[i];
                tempObjVal = parseInt(temp[0].innerHTML, 10);
                if(!temp.hasClass(invalidCls) && !temp.hasClass(dayInvalid) && tempObjVal === parseInt(day,10)){
                    temp.addClass(dayCurrent);
                    break;
                }
            }
        },

        /**
         * @private
         * @description 设置天选中
         * @param {Object} event 天组件对象，单击天时触发
         * @param {Object} me 日期组件对象
         * @param {Number} day 设置天时传入
         */
        _setDayEl: function(event, me, day) {
            if (event) {
                var self = event.data.me, dayEl = event.data.dayEl;
                $.each(self.dateEmEl, function(index, obj) {
                    obj.removeClass(dayCurrent);
                });
                dayEl.addClass(dayCurrent);
                self.dayEl = dayEl;
                self.day = parseInt(dayEl[0].value,10);
                //若所选的日期+时间超出最大值，需要修正时间值
                var timeEl1event = self.southSpinnerEl.find("input"),
                    eformat = self.options.format,
                    etzone = self.options.timeZone,
                    northMonthSpinnerEl = self.northMonthSpinnerEl.find("input"),
                    eyearInput = parseInt(self.northYearSpinnerEl.find("input").val(), 10), // 年
                    emonthInput = parseInt($.string.toNumber(northMonthSpinnerEl.val()), 10), // 月;
                    emaxUtc = self._getMaxUtc(),
                    tempHour = $(timeEl1event[0]).val(), // 时
                    tempMini = $(timeEl1event[1]).val(), // 分
                    tempSec = $(timeEl1event[2]).val(),// 秒
                    currentUtc, currentDate;
                currentDate = $.date.format(new Date(eyearInput, emonthInput - 1, self.day, tempHour, tempMini, tempSec), self.options.format),
                currentUtc = $.date.dateToUTC(String(currentDate).replace(/-/g, "/"), etzone);
                if($.isNotNull(emaxUtc)){
                    var emax = self._getMaxUtc(true),
                        etempMax = new Date(String(emax.replace(/-/g, "/"))),
                        emaxYear = etempMax.getFullYear(),
                        emaxMonth = etempMax.getMonth() + 1,
                        emaxDay = etempMax.getDate();
                    if(emaxYear === eyearInput && emaxMonth === emonthInput && emaxDay === self.day && currentUtc > emaxUtc){
                        $(timeEl1event[0]).val("00");
                        $(timeEl1event[1]).val("00");
                        $(timeEl1event[2]).val("00");
                    }
                }

                self._changeTimeInput(self);
            } else {
                var max = me._getMaxUtc(true),
                    min = me._getMinUtc(true),
                    objVal,maxDay, minDay, curMonthDays, minYear,minMonth, maxYear,maxMonth, tempMin, tempMax,
                    northMonthSpinnerEl = me.northMonthSpinnerEl.find("input"),
                    yearInput = parseInt(me.northYearSpinnerEl.find("input").val(), 10), // 年
                    monthInput = parseInt($.string.toNumber(northMonthSpinnerEl.val()), 10), // 月;
                    year = me.year,
                    month = me.month,
                    months = me.months;
                if ($.date.isLeapYear(year)) {
                    months[1] = 29;
                } else {
                    // 不为闰年，应该恢复2月份天数为28天
                    months[1] = 28;
                }
                // 计算当月天数
                curMonthDays = parseInt((1 === month ? months[11] : months[month - 1]), 10);
                day = parseInt(day,10);

                if(day > curMonthDays){
                    //若次月不存在某日期，默认选中每月的1号
                    day = 1;
                    me.day = day;
                }
                if($.isNotNull(max)){
                    tempMax = new Date(String(max.replace(/-/g, "/")));
                    maxYear = tempMax.getFullYear();
                    maxMonth = tempMax.getMonth() + 1;
                    maxDay = tempMax.getDate();
                    if(yearInput === maxYear && monthInput === maxMonth && day > maxDay){
                        //所选值超过最大值纠正为最大日期值
                        day = maxDay;
                        me.day = day;

                        //所设置的年月日超出最大值时，修改时间显示为00:00:00
                        var timeEl1 = me.southSpinnerEl.find("input"),
                            format = me.options.format,
                            tzone = me.options.timeZone,
                            maxUtc = me._getMaxUtc(),
                            hour1 = $(timeEl1[0]).val(), // 时
                            minute1 = $(timeEl1[1]).val(), // 分
                            second1 = $(timeEl1[2]).val(),// 秒
                                selectFormat = $.date.format(new Date(maxYear, maxMonth - 1, day, hour1, minute1, second1), me.options.format),
                            selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
                        if(maxUtc && selectUtc > maxUtc){
                            $(timeEl1[0]).val("00");
                            $(timeEl1[1]).val("00");
                            $(timeEl1[2]).val("00");
                        }
                    }
                }
                if($.isNotNull(min)){
                    tempMin = new Date(String(min.replace(/-/g, "/")));
                    minYear =  tempMin.getFullYear();
                    minMonth = tempMin.getMonth() + 1;
                    minDay = tempMin.getDate();
                    if(yearInput === minYear && monthInput === minMonth && day < minDay){
                        //所选值小于最小值纠正为最小日期值
                        day = minDay;
                        me.day = day;
                    }
                }

                $.each(me.dateEmEl, function(index, obj) {
                    if($.isNotNull(obj.html())){
                        objVal = $.string.toNumber(obj.html());
                    }

                    if((!obj.hasClass(dayInvalid))&&(!obj.hasClass(invalidCls))&& $.isNotNull(objVal) &&objVal === day){
                        me.dayEl ? me.dayEl.removeClass(dayCurrent) : "";

                        obj.addClass(dayCurrent);
                        me.dayEl = obj;
                    }
                });
                me._changeTimeInput(me);
            }
        },
        /**
         * @private
         * @description 创建时间微调器面板
         * @param {Object} me 日期组件对象
         * @param {Array} arr 面板上呈现的数组
         * @param {Object} inputObj 输入文本框对象
         */
        _createTimePanel: function(me, arr, inputObj) {
            var timeAEl = [],
                timeLiEl,
                timeUlEl,
                timeDivEl = me.timeDivEl = $("<div>").addClass(timeDivClass + " " + me.floatBgClass).hide();
            for (var i = 0; i < arr.length; i++) {
                timeLiEl = $("<li>");
                timeUlEl = $("<ul>");
                timeLiEl.appendTo(timeUlEl);
                timeUlEl.appendTo(timeDivEl);
                timeAEl[i] = $("<a>").val(arr[i]).text(arr[i]).appendTo(timeLiEl);
            }
            timeUlEl.appendTo(timeDivEl);
            timeDivEl.bind("click", function(event) {
                event.stopImmediatePropagation();
            });
            switch(arr.length){
                case spinnerHourArr.length:
                    me.timeHourAEl = timeAEl;
                    me.timeHourDivEl = timeDivEl;
                    break;
                case spinnerMinuteArr.length:
                    me.timeMiniteAEl = timeAEl;
                    me.timeMiniteDivEl = timeDivEl;
                    break;
                case spinnerSecondArr.length:
                    me.timeSecondAEl = timeAEl;
                    me.timeSecondDivEl = timeDivEl;
                    break;
            }

            return timeDivEl;
        },
        /**
         * @private
         * @description 修改时间面板
         * @param {Object} me 日期组建对象
         * @param {Number/String} time 输入框的值
         * @param {Object} inputEl 输入框对象
         * @param {Number/String} spinnerTimeTypes 点击的输入框类型
         */
        _changeTimePanel: function(me, time, inputEl, spinnerTimeTypes) {
            if ($.isNull(time)) {
                me._error("_changeYearPanel() The input parameter 'time' is null.");
                return;
            }
            var opt = me.options, format = opt.format,tzone = opt.timeZone,
                maxDate = me._getMaxUtc(true),
                minDate = me._getMinUtc(true),
                maxDateUtc = me._getMaxUtc(),
                minDateUtc = me._getMinUtc(),
                selectFormat, selectUtc, arr = [],
                currentBlueDay, currentBluebJq,
                year = me.northYearSpinnerEl.find("input").val(), // 年
                month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val())-1, // 月
                day, // 日
                timeEl = me.southSpinnerEl.find("input"),
                hour, // 时
                minute, // 分
                second; // 秒
            me.dayEl ? day = me.dayEl.val() : day = "1";
            for(var k = 0; k < me.dateEmEl.length; k++){
                if(me.dateEmEl[k].hasClass(dayCurrent)){
                    currentBluebJq = me.dateEmEl[k];
                    currentBlueDay =  parseInt(currentBluebJq[0].value,10);
                    break;
                }
            }
            if(currentBlueDay){
                day = currentBlueDay;
            }
            else{
                day = me.dayEl.val();
            }
            function addTimeBind(i) {
                me.timeAEl[i].bind("click", function() {
                    var aEl = $(this),
                            v = $.string.lpad(aEl.val(), 2, "0");
                    // 小时
                    if ($.isNotNull(maxDate) && spinnerTimeType[0] === spinnerTimeTypes) {
                        var sFormat = $.date.format(new Date(year, month, day, v, $(timeEl[1]).val(), $(timeEl[2]).val()), me.options.format);
                        var sUtc = $.date.dateToUTC(String(sFormat).replace(/-/g, "/"), tzone); 
                        if(sUtc > maxDateUtc){
                            $(timeEl[1]).val("00");
                            $(timeEl[2]).val("00");
                        }
                        // 分钟
                    } else if ($.isNotNull(maxDate) && spinnerTimeType[1] === spinnerTimeTypes) {
                        var sFormat = $.date.format(new Date(year, month, day, $(timeEl[0]).val(), v, $(timeEl[2]).val()), me.options.format);
                        var sUtc = $.date.dateToUTC(String(sFormat).replace(/-/g, "/"), tzone); 
                        if(sUtc > maxDateUtc){
                            $(timeEl[2]).val("00");
                        }
                    }
                    inputEl.val(v);
                    me.timeDivEl.hide();
                });
            }
            function addTimeUnBind(i) {
                me.timeAEl[i].removeClass().unbind("click").select(function() {
                    return false;
                });
            }
            // 小时
            if (spinnerTimeType[0] === spinnerTimeTypes) {
                me.timeAEl = me.timeHourAEl;
                me.timeDivEl = me.timeHourDivEl;
                selectArr(spinnerHourArr);
                // 分钟
            } else if (spinnerTimeType[1] === spinnerTimeTypes) {
                me.timeAEl = me.timeMiniteAEl;
                me.timeDivEl = me.timeMiniteDivEl;
                selectArr(spinnerMinuteArr);
                // 秒
            } else if (spinnerTimeType[2] === spinnerTimeTypes) {
                me.timeAEl = me.timeSecondAEl;
                me.timeDivEl = me.timeSecondDivEl;
                selectArr(spinnerSecondArr);
            }
            function selectArr(arr) {
                for (var i = 0; i < arr.length; i++) {
                    addTimeUnBind(i);
                    // 小时
                    if (spinnerTimeType[0] === spinnerTimeTypes) {
                        hour = arr[i], // 时
                                minute = "00", // 分
                                second = "00"; // 秒
                        // 分钟
                    } else if (spinnerTimeType[1] === spinnerTimeTypes) {
                        hour = $(timeEl[0]).val(), // 时
                                minute = arr[i], // 分
                                second = "00"; // 秒 
                        // 秒
                    } else if (spinnerTimeType[2] === spinnerTimeTypes) {
                        hour = $(timeEl[0]).val(), // 时
                                minute = $(timeEl[1]).val(), // 分
                                second = arr[i];// 秒 
                    }
                    selectFormat = $.date.format(new Date(year, month, day, hour, minute, second), me.options.format);
                    selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
                    // 同时设置最大时间和最小时间
                    if ($.isNotNull(maxDate) && $.isNotNull(minDate)) {
                        if (selectUtc <= maxDateUtc && selectUtc >= minDateUtc) {
                            addTimeBind(i);
                        } else {
                            me.timeAEl[i].addClass(dataTextCls);
                        }
                    }
                    // 只设置时间最大值
                    else if ($.isNotNull(maxDate) && !$.isNotNull(minDate)) {
                        if (selectUtc <= maxDateUtc) {
                            addTimeBind(i);
                        } else {
                            me.timeAEl[i].addClass(dataTextCls);
                        }
                    }
                    // 只设置时间最小值
                    else if (!$.isNotNull(maxDate) && $.isNotNull(minDate)) {
                        if (selectUtc >= minDateUtc) {
                            addTimeBind(i);
                        } else {
                            me.timeAEl[i].addClass(dataTextCls);
                        }
                    } else {
                        addTimeBind(i);
                    }
                    me.timeAEl[i].val(arr[i]).text(arr[i]);
                }
            }
        },
        /**
         * @private
         * @description 当年月日发生改变时修改时间输入框的值
         * @param {Object} obj 日期组建对象
         */
        _changeTimeInput: function(obj) {
            var me = obj,
                selectFormat,
                selectUtc,
                format = me.options.format,
                tzone = me.options.timeZone,
                year1 = me.northYearSpinnerEl.find("input").val(), // 年
                month1 = $.string.toNumber(me.northMonthSpinnerEl.find("input").val()) - 1, // 月
                day1, // 日
                timeEl1 = me.southSpinnerEl.find("input"),
                hour1 = $(timeEl1[0]).val(), // 时
                minute1 = $(timeEl1[1]).val(), // 分
                second1 = $(timeEl1[2]).val();// 秒
            if(me.dayEl && $.isNotNull(me.dayEl.val())){
                day1 = me.dayEl.val();
            }
            else{
                day1 = new Date().getDate();
                if ((String(day1)).length < 2)
                {
                    day1 = "0" + day1;
                }
            }
            if("0" === month1){
                month1 = 1;
            }
            selectFormat = me._initFormElVal(year1, month1, day1, hour1, minute1, second1);
            if (me._isTimeZoneNull) {
                selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), me._getTempZone(String(selectFormat.replace(/-/g, "/"))));
            } else {
            selectUtc = $.date.dateToUTC(String(selectFormat).replace(/-/g, "/"), tzone);
            }
            var val = me._checkMaxMin(selectUtc),
                value = me._getTimeStrByUtc(val).replace(/-/g, "/"),
                strTimeData = value.split(" "),
                strdateData = strTimeData[0].split("/"),
                year = strdateData[0],
                month = strdateData[1] - 1,
                day = strdateData[2],
                strtimeData = (strTimeData[1] === undefined) ? ["00", "00", "00"] : strTimeData[1].split(":"),
                hour = (strtimeData[0] === undefined) ? "00" : strtimeData[0],
                minute = (strtimeData[1] === undefined) ? "00" : strtimeData[1],
                second = (strtimeData[2] === undefined) ? "00" : strtimeData[2];
            $(timeEl1[0]).val(hour), // 设置小时输入框
            $(timeEl1[1]).val(minute), // 设置分输入框
            $(timeEl1[2]).val(second);// 设置秒输入框
        },
        /**
         * @private
         * @description 创建日期浮动窗口底部，时间选择
         */
        _createDateSouthItem: function() {
            var me = this,
                i18nObj = Sweet.core.i18n.date,
                COLON = Sweet.constants.symbol.COLON,
                options = me.options,
                southItemClass = "sweet-form-date-float-south",
                southLabelClass = "sweet-form-date-float-south-label",
                spanElClass = "sweet-form-date-float-button-span",
                okButtonElClass = "sweet-form-date-float-button-ok",
                fmt = options.format,
                southItemEl = me.southItemEl = $("<div>").addClass(southItemClass).appendTo(me.floatEl),
                spanEl = $("<span>").addClass(spanElClass).appendTo(southItemEl),
                okButtonEl = me.okButtonEl = $("<button>").addClass(okButtonElClass).text(i18nObj.okButton).appendTo(spanEl),
                labelEl = $("<label>").text(i18nObj.time + COLON).addClass(southLabelClass).appendTo(southItemEl),
                southSpinnerEl = me.southSpinnerEl = me._createDateSpinner(spinnerType[2]).appendTo(southItemEl);

            // 注册确定按钮单击事件
            okButtonEl.bind("click", function(event) {
                var year = me.northYearSpinnerEl.find("input").val(), // 年
                    month = $.string.toNumber(me.northMonthSpinnerEl.find("input").val()) - 1, // 月
                    day = me.dayEl.val(), // 日
                    dateVal,
                    timeEl = me.southSpinnerEl.find("input"),
                    hour = $(timeEl[0]).val(), // 时
                    minute = $(timeEl[1]).val(), // 分
                    second = $(timeEl[2]).val();// 秒
                me.formElement.val(me._initFormElVal(year, month, day, hour, minute, second));
                me.formElement.blur();
                me.openDropDownFlag = false;
                me._closeFloatPanel();
                me._checkFun();
                dateVal = me.formElement.val();
                if (me.oldValue !== dateVal) {
                    me.oldValue = dateVal;
                }
            });
        },

        /**
         * @private
         * @description 置灰/亮日期图片
         * @param {Boolean} disabled ture/false
         */
        __setDisabled: function(disabled) {
            var me = this;
            if (disabled) {
                me.datePicEl.removeClass(datePicClass).addClass(datePicDisabledClass);
            }
            else {
                me.datePicEl.removeClass(datePicDisabledClass).addClass(datePicClass);
            }
            me.datePicEl.attr("disabled", disabled);
        },
        /**
         * @private
         * @description 校验
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _checkAllFun: function(justGetResult) {
            var me = this,
                val = me.formElement.val(),
                returnResult;

            if (me._super(justGetResult) === false) {
                returnResult = false;
            }
            if ($.isNull(val)) {
                returnResult = true;
            }

            // 日期格式验证
            returnResult = me._setRightTimeValue(me);

            return returnResult;
        },
        /**
         * @private
         * @description 组件创建后，纠正错误日期后的日期值
         */
        _setRightTimeValue: function(that) {
            var me = that,
                opt = me.options,
                tzone = opt.timeZone,
                val = me.formElement.val(),
                reg = (me.options.format === "yyyy-MM-dd hh") ? me.regMap["yyyy-MM-dd hh:mm"] : me.regMap[me.options.format],
                    regObj = new RegExp(reg),
                    _tZone1 = tzone,
                    _tZone2 = tzone;
            // 日期格式验证
            if (val.match(regObj) === null) {
                if($.isNull(val) && $.isNull(opt.maxDate) && $.isNull(opt.minDate) && !opt.required){
                    me.formElement.val("");
                }
                else if ($.isNotNull(me.oldValue)) {
                    if (me._isTimeZoneNull) {
                        _tZone1 = me._getTempZone(String(me.oldValue.replace(/-/g, "/")));
                    }
                    var odlValDateUtc = $.date.dateToUTC(String(me.oldValue.replace(/-/g, "/")), _tZone1);
                    me._setUtcTimefield(odlValDateUtc);
                }
            } else {
                val = me._findError(val);
                if (me._isTimeZoneNull) {
                    _tZone2 = me._getTempZone(String(val.replace(/-/g, "/")));
                }
                var selectDateUtc = $.date.dateToUTC(String(val.replace(/-/g, "/")), _tZone2);
                me._setUtcTimefield(selectDateUtc);
                me.closeTip();
            }
            return true;
        },
        /**
         * @private
         * @description 组件创建后，添加其他功能：禁用输入法切换、禁止粘贴
         */
        _afterCreateFormWidget: function() {
            var me = this;
            me.allowdChars = me.baseChars;
            me.formElement.focus(function() {
                me.oldValue = me.formElement.val();
            });
            me.formElement.keypress({"me": me}, me._onKeyPress);
            me.formElement.keydown({"me": me}, me._onKeyDown);
        },
        /**
         * @private
         * @description 只允许输入数字、英文冒号、减号
         * @param {type} event 数值输入框对象
         */
        _onKeyPress: function(event) {  // 退格键、回车键、其他功能键，空格，不做处理
            if (Sweet.constants.keyCode.BACKSPACE === event.which ||
                Sweet.constants.keyCode.SPACE === event.which ||
                Sweet.constants.keyCode.ENTER === event.which || 0 === event.which) {
                return;
            }
            var me = event.data.me,
                options = me.options,
                ch = String.fromCharCode($.e.getCharCode(event)),
                charRe = new RegExp("[" + me.allowdChars + "]");

            if (!charRe.test(ch)) {
                event.preventDefault();
                return;
            }
        },
        /**
         * @private
         * @description 解决谷歌下能输入中文的问题
         * @param {type} event 数值输入框对象
         */
        _onKeyDown: function(event) {
            var me = event.data.me,
                sKeyCode = Sweet.constants.keyCode,
                eKeyCode = event.keyCode,
                key = event.charCode || eKeyCode,
                ch = String.fromCharCode($.e.getCharCode(event));
            // 退格键、回车键、删除键、上下左右方向键，不做处理
            if (sKeyCode.BACKSPACE === eKeyCode || sKeyCode.ENTER === eKeyCode ||
                sKeyCode.DELETE === eKeyCode || sKeyCode.LEFT === eKeyCode ||
                sKeyCode.RIGHT === eKeyCode || sKeyCode.DOWN === eKeyCode ||
                sKeyCode.UP === eKeyCode || sKeyCode.TAB === eKeyCode) {
                return;
            }
            if (key > 47 && key < 58 || key > 95 && key < 106 || // 数字键
                    16 === key || 186 === key || 59 === key || // shift、冒号
                    189 === key || 109 === key || 173 === key ||  32 === key) { // 减号,空格
                return;
            } else {
                event.preventDefault();
            }
        },
        /**
         * @private
         * @description 设置VALUE时,如果有夏令时则需要处理
         * @param {Number} year 年
         * @param {Number} month 月
         * @param {Number} day 日
         * @param {Number} hour 小时
         * @param {Number} minute 分钟
         * @param {Number} second 秒
         * return {String} 返回矫正后的字符串
         */
        _initFormElVal: function(year, month, day, hour, minute, second) {
            var me = this,
                    sDstSwitchDate;
            sDstSwitchDate = $.date.getSDstSwitchDate(year);
            if (sDstSwitchDate && sDstSwitchDate[0] == parseInt(year) && sDstSwitchDate[1] == parseInt(month) && sDstSwitchDate[2] == parseInt(day)
                        && sDstSwitchDate[3] == parseInt(hour) && sDstSwitchDate[4] <= parseInt(minute)) {
                    hour = parseInt(hour) + 1;
                }
                if (me.options.format === "yyyy-MM-dd hh") {
                    return ($.date.format(new Date(year, month, day, hour, minute, second), me.options.format) + ":00");
                } else {
                    return $.date.format(new Date(year, month, day, hour, minute, second), me.options.format);
            }
            return "";
        },
        /**
         * @private
         * @description 通过日期字符串获得时区
         * @param {String} strTime 日期字符串
         * return {Number} 返回该日期字符串对应的时区
         */
        _getTempZone: function(strTime) {
            var me = this,
                    custmTzone = new Date().getTimezoneOffset() / 60 * (-1);
            if ($.isNull(strTime)) {
                return custmTzone;
            }
            if ("string" !== typeof strTime) {
                return custmTzone;
            }
            var strTimeData = strTime.split(" "),
                    strDateData = strTimeData[0].split("/"),
                    strYear = strDateData[0],
                    strMonth = strDateData[1] - 1,
                    strDay = strDateData[2],
                    strTimeData1 = !strTimeData[1] ? ["00", "00", "00"] : strTimeData[1].split(":"),
                    strHour = !strTimeData1[0] ? "00" : strTimeData1[0],
                    strMinute = !strTimeData1[1] ? "00" : strTimeData1[1],
                    strSecond = !strTimeData1[2] ? "00" : strTimeData1[2];
            return new Date(strYear, strMonth, strDay, strHour, strMinute, strSecond, 0).getTimezoneOffset() / 60 * (-1);
        }
    });

    /**
     * 创建日期组件
     * @name Sweet.form.Date
     * @class 
     * @extends Sweet.form.Input
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * </pre>
     * @example 
     * <pre>
     * sweetDate = new Sweet.form.Date({
     *         width : 300,
     *         label : true,
     *         labelText : 'Date',
     *         value : {value: "2013/1/16 14:30:30", text: "time"},
     *         renderTo : "sweet-date"
     * });
     * </pre>
     */
    Sweet.form.Date = $.sweet.widgetFormDate;
}(jQuery));

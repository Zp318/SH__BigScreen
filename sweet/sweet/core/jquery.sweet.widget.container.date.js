/**
 * @fileOverview  
 * <pre>
 * 面板上的日期组件
 * 2012/12/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var defaultDateClass = "sweet-container-date",
            defaultDateTitleClass = "sweet-container-date-title",
            defaultDateTitleNumClass = "sweet-container-date-title-num",
            defaultDateTitleMonthClass = "sweet-container-date-title-month",
            defaultDateContentClass = "sweet-container-date-content",
            defaultDateContentWeekClass = "sweet-container-content-week",
            defaultDateContentNumListClass = "sweet-container-content-num sweet-container-content-num-others";

    $.widget("sweet.widgetContainerDate", $.sweet.widgetContainer, /** @lends Sweet.panel.Date.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-date]:",
        months: $.objClone(Sweet.constants.MONTHS),
        eventNames: /** @lends Sweet.panel.Date.prototype*/{
            /**
            * @event
            * @description 日期点击事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            "click": "日期点击事件",
            /**
            * @event
            * @description 日期变化时触发
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            change: "日期变化时触发"
        },
        options: {
            /**
             * 年
             * @type number
             * @default 2012
             */
            year: 2012,
            /**
             * 月份,默认一月, 1到12的值
             * @type number
             * @default 1
             */
            month: 1
        },
        /**
         * @private
         * @description 设置日期
         * @param {Array} arrVal 待设置日期, 为数组格式. 例如["2012-12-8", "2012-12-9", "2012-12-10"]
         */
        _setValue: function(arrVal) {
            if (!(arrVal instanceof Array)) {
                $.error("setValue(): The input argument must be an array type!");
                return;
            }

            var me = this,
                    emEl, arr, options = this.options,
                    defaultClassName = defaultClassName,
                    year = options.year,
                    month = options.month;
            $.each(arrVal, function(index, value) {
                arr = value.split("-");
                if ((year === $.string.toNumber(arr[0])) &&
                        (month === $.string.toNumber(arr[1]))) {
                    emEl = me.dateEmEl[$.string.toNumber(arr[2])];
                    // 判断日期是否被选中
                    if (!emEl.hasClass(defaultClassName)) {
                        emEl.click();
                    }
                }
            });
        },
        /**
         * @private
         * @description 获取选中日期值
         * @return 返回日期数组 ["2012-12-8", "2012-12-9", "2012-12-10"]
         */
        _getValue: function() {
            var value = [];
            for (var key in this.value) {
                value.push(this.value[key]);
            }
            this._info("getValue(): " + value);
            return value;
        },
        /**
         * @private
         * @description 日期组件渲染
         */
        _widgetRender: function() {
            if (this.containerEl) {
                this.dateEl.appendTo(this.containerEl);
            }
        },
        /**
         * @private
         * @description 创建日期面板
         */
        _createContainer: function() {
            var me = this,
                    dateEl = me.dateEl = $("<div>"),
                    options = me.options;
            // 初始化对象, 保存日期
            me.value = {};
            me.length = 0;
            // 判断是否闰年
            if ($.date.isLeapYear(options.year)) {
                me.months[1] = 29;
            }  else {
                // 不为闰年，应该恢复2月份天数为28天。问题单号：DTS2013072606986 
                me.months[1] = 28;
            }
            me._createDateTitle();
            me._createDateContent();
            dateEl.addClass(defaultDateClass + " " + options.widgetClass);
        },
        /**
         * @private
         * @description 创建日期标题
         */
        _createDateTitle: function() {
            var dateTitleEl = this.dateTitleEl = $("<div>"),
                    options = this.options,
                    numEmEl = $("<em>"),
                    monthEmEl = $("<em>");
            numEmEl.html(options.month).addClass(defaultDateTitleNumClass).appendTo(dateTitleEl);
            monthEmEl.html(Sweet.core.i18n.month[options.month - 1]).addClass(defaultDateTitleMonthClass)
                    .appendTo(dateTitleEl);
            dateTitleEl.addClass(defaultDateTitleClass).appendTo(this.dateEl);
        },
        /**
         * @private
         * @description 创建日期标题
         */
        _createDateContent: function() {
            var me = this,
                    dateContentEl = this.dateContentEl = $("<div>"),
                    options = this.options,
                    months = this.months,
                    weekEl = $("<div>"),
                    ulEl = $("<ul>"),
                    liEl,
                    emEl,
                    dateEmEl = this.dateEmEl = {},
                    date = new Date(options.year, options.month - 1, 1),
                    day = date.getDay(),
                    days = months[options.month - 1],
                    rows = Math.ceil((day + days) / 7),
                    numCount = 0;
            weekEl.html("<em>" + Sweet.core.i18n.week[6] +
                    "</em><em>" + Sweet.core.i18n.week[0] +
                    "</em><em>" + Sweet.core.i18n.week[1] +
                    "</em><em>" + Sweet.core.i18n.week[2] +
                    "</em><em>" + Sweet.core.i18n.week[3] +
                    "</em><em>" + Sweet.core.i18n.week[4] +
                    "</em><em>" + Sweet.core.i18n.week[5] +
                    "</em>")
                    .addClass(defaultDateContentWeekClass).appendTo(dateContentEl);
            // 处理日期
            for (var i = 0; i < rows; i++) {
                liEl = $("<li>");
                if (0 === i) {
                    for (var j = 0; j < 7; j++) {
                        emEl = $("<em>");
                        if (j < day) {
                            emEl.html("&nbsp;").appendTo(liEl);
                        } else {
                            emEl.text(++numCount)
                                    .addClass("num")
                                    .bind("click", {self: me}, this._dateNumClick)
                                    .appendTo(liEl);
                            if (0 === j || 6 === j) {
                                emEl.addClass("rest");
                            }
                            dateEmEl[numCount] = emEl;
                        }
                    }
                } else if (i === rows - 1) {
                    for (var m = 0; m < 7; m++) {
                        emEl = $("<em>");
                        if (numCount >= days) {
                            emEl.html("&nbsp;").appendTo(liEl);
                        } else {
                            emEl.text(++numCount)
                                    .addClass("num")
                                    .bind("click", {self: me}, this._dateNumClick)
                                    .appendTo(liEl);
                            if (0 === m || 6 === m) {
                                emEl.addClass("rest");
                            }
                            dateEmEl[numCount] = emEl;
                        }
                    }
                } else {
                    for (var n = 0; n < 7; n++) {
                        emEl = $("<em>");
                        emEl.text(++numCount)
                                .addClass("num")
                                .bind("click", {self: me}, this._dateNumClick)
                                .appendTo(liEl);
                        if (0 === n || 6 === n) {
                            emEl.addClass("rest");
                        }
                        dateEmEl[numCount] = emEl;
                    }
                }
                liEl.addClass(defaultDateContentNumListClass).appendTo(dateContentEl);
            }
            dateContentEl.addClass(defaultDateContentClass).appendTo(this.dateEl);
        },
        /**
         * @private
         * @description 日期数字绑定事件
         * @param {Object} event 日期数字对象
         */
        _dateNumClick: function(event) {
            var me = $(this),
                    self = event.data.self,
                    options = self.options,
                    oldLength = self.length,
                    defaultClassName = "current",
                    day = me.text(),
                    date = options.year + "-" + options.month + "-" + day,
                    selected = false;

            if (me.hasClass(defaultClassName)) {
                selected = false;
                me.removeClass(defaultClassName);
                delete self.value[day];
                self.length--;
                self._info("_dateNumClick() Pop: " + date);
            } else {
                selected = true;
                me.addClass(defaultClassName);
                self.value[day] = date;
                self.length++;
                self._info("_dateNumClick() Push: " + date);
            }
            
            // 触发click监听
            self._triggerHandler(event, "click", {"value": date, "selected": selected});
            
            // 触发change事件
            if (oldLength !== self.length) {
                self._triggerHandler(event, "change", {"value": self.value});
            }
        },
        /**
         * @private
         * @description 触发注册的事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据对象
         */
        _triggerHandler: function(e, eName, data) {
            var me = this;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    func.call(null, e, data);
                }
            });
        }
    });

    /**
     * @description 日期面板
     * @class
     * @extends Sweet.container
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * </pre>
     * @example
     * 创建日期面板：
     */
    Sweet.panel.Date = $.sweet.widgetContainerDate;
}(jQuery));

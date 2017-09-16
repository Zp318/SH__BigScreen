/**
 * @fileOverview
 * <pre>
 *比率指示灯组件
 * 2013/7/2
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    var colorCommonClass = "sweet-ratioIndicator-color-common",
            colorGreenLeftClass = "sweet-ratioIndicator-color-green-left",
            colorYellowLeftClass = "sweet-ratioIndicator-color-yellow-left",
            colorShadowClass = "sweet-ratioIndicator-color-shadow",
            colorGrayRightClass = "sweet-ratioIndicator-color-gray-right",
            loadingClass = "sweet-ratioIndicator-loading",
            colorGreenAllClass = "sweet-ratioIndicator-color-green-all",
            colorGrayAllClass = "sweet-ratioIndicator-color-gray-all",
            colorRedAllClass = "sweet-ratioIndicator-color-red-all",
            colorRedClass = "sweet-ratioIndicator-color-red-left",
            yellowTextClass = "yellowtext",
            loadingTextClass = "sweet-ratioIndicator-loading-text";

    $.widget("sweet.widgetRatioIndicator", $.sweet.widget, /** @lends Sweet.RatioIndicator.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-ratioindicator]:",
        type: "ratioindicator",
        eventNames: /** @lends Sweet.RatioIndicator.prototype*/{
            /**
             * @event
             * @description 比率指示灯数据改变事件
             */
            change: "比率指示灯数据改变事件"
        },
        // ratioindicator组件公共配置参数
        options: /** @lends Sweet.RatioIndicator.prototype*/{
            /**
             * @description 组件值
             * @param {Number}
             * @default null
             */
            value: null,
            /**
             * @description 最大值
             * @param {Number}
             * @default 100
             */
            maxValue: 100,
            /**
             * @description 阈值，如果只配置threshhold，则只显示红绿两种显示条
             * @param {Number}
             * @default null
             */
            threshhold: null,
            /**
             * @description 阈值，如果配置secondThreshhold，则显示红黄绿三种显示条
             * @param {Number}
             * @default null
             */
            secondThreshhold: null,
            /**
             * @description 值标签
             * @param {String}
             * @default ""
             */
            valueLabel: "",
            /**
             * @description 最大值标签
             * @param {String}
             * @default ""
             */
            maxValueLabel: "",
            /**
             * @description 组件默认宽度
             * @type {Number}
             * @default 287px
             */
            width: 287,
            /**
             * @description 大于阈值显示红色，还是显示绿色（从红色开始，还是从绿色开始）,参数提供"red"、 "green"
             * 默认是绿色
             * @type {String}
             * @default  "green"
             */
            from: "green"
        },
        /**
         * @description 组件属性动态改变时使用此方法，如果只有value改变，使用setValue方法
         * @param {object} data 参数是一个对象，属性是类提供的属性值，如：threshhold，value等
         */
        setData: function(data) {
            if ($.isNull(data) || $.isArray(data)) {
                return;
            }
            var me = this,
                    temp = $.objClone(data);
            //如果除value属性外其它属性也改变时，更新所有改变的属性值
            for (var key in data) {
                me.options[key] = temp[key];
            }
            //需要避开options中的width，使用用户更新的width，否则不变
            if (!$.isNull(data.width)) {
                me.width = data.width;
            }
            me._setValue(me.options.value);
        },
        /**
         * @description 设置组件的值
         * @private
         * @param {Number} value 组件对应的数据 
         */
        _setValue: function(value) {
            if ($.isNull(value)) {
                return;
            }
            var me = this;
            //数据有改变发生change事件
            if (!$.equals(me.currentValue, value)) {
                if (!$.isNull(me.eventMap.change)) {
                    me.eventMap.change.call(null, null, value);
                }
            }
            me.currentValue = value;
            //移除添加的div
            me.ratioIndicatorLeftDivEl.remove();
            me.ratioIndicatorRightDivEl.remove();
            me.ratioIndicatorContentEl.remove();
            //重新生成Div
            me._createRatioIndicator();
        },
        /**
         * @description 获取组件的值
         * @private
         * @return {Number} 返回获取的值
         */
        _getValue: function() {
            var me = this;
            return me.options.value;
        },
        /**
         * @private
         * @description 重绘组件
         */
        _doLayout: function() {
            var me = this,
                    options = me.options,
                    width = me.width,
                    ratioIndicatorEl = me.ratioIndicatorEl;
            ratioIndicatorEl.width(width);
        },
        /**
         * @private
         * @description 创建RatioIndicator组件总入口
         */
        _createSweetWidget: function() {
            if (this.renderEl) {
                return;
            }
            var me = this,
                    options = me.options,
                    ratioIndicatorEl = me.ratioIndicatorEl = $("<div>");
            me.eventMap = [];
            //记录宽度，因为options中的宽度会改变
            me.width = options.width;
            ratioIndicatorEl.addClass(options.widgetClass + " " + loadingClass)
                    .width(options.width)
                    .attr("id", options.id);
            // 创建ratioIndicator组件
            me._createRatioIndicatorWidget();
        },
        /**
         * @private
         * @description 创建RatioIndicator组件
         */
        _createRatioIndicatorWidget: function() {
            var me = this,
                    options = me.options,
                    contentEl;
            contentEl = me.contentEl = $("<div>").appendTo(me.ratioIndicatorEl)
                    .addClass(options.widgetClass)
                    .width(me.width);

            me._createRatioIndicator();
        },
        /**
         * @private
         * @description 创建RatioIndicator组件
         */
        _createRatioIndicator: function() {
            var me = this,
                    options = me.options,
                    ratioIndicatorLeftDivEl,
                    ratioIndicatorContentEl,
                    value = options.value,
                    threshhold = options.threshhold,
                    dataError = false,
                    valueLabel = $.htmlEscape(options.valueLabel),
                    maxValueLabel = $.htmlEscape(options.maxValueLabel),
                    maxValue = $.htmlEscape(options.maxValue),
                    textValue = $.htmlEscape(value.value),
                    secondThreshhold = options.secondThreshhold,
                    leftWidth,
                    rightWidth,
                    ratioIndicatorRightDivEl;
            //判断value是否为空或者不是数字
            if ($.isNull(value) || $.isNull(value.value) || !$.isNumeric(value.value)) {
                dataError = true;
                value = {"value": 0, "text": null};
            }
            //参数校验
            if (value.value > maxValue || threshhold > maxValue || 0 > value.value) {
                dataError = true;
            }
            //阈值，如果未配置与maxValue相等
            if ($.isNull(threshhold)) {
                threshhold = options.maxValue;
            }
            // 设置第二个阈值,判断阈值是否越界
            if (!$.isNull(secondThreshhold)) {
                if (secondThreshhold < threshhold || secondThreshhold > maxValue) {
                    dataError = true;
                }
            }
            //保存当前value
            me.currentValue = $.objClone(value);
            //计算比率指示灯左右侧的宽度
            if (0 === value.value || 0 === options.maxValue || 0 === threshhold) {
                leftWidth = 0;
                rightWidth = me.width;
            } else {
                leftWidth = me.width * (value.value / options.maxValue);
                rightWidth = me.width * ((options.maxValue - value.value) / options.maxValue);
            }

            //创建比率指示灯左侧
            me.ratioIndicatorLeftDivEl = ratioIndicatorLeftDivEl = $("<div>").appendTo(me.contentEl)
                    .width(leftWidth)
                    .addClass(colorCommonClass)
                    .addClass(colorShadowClass);
            //创建比率指示灯右侧
            me.ratioIndicatorRightDivEl = ratioIndicatorRightDivEl = $("<div>").appendTo(me.contentEl)
                    .width(rightWidth)
                    .addClass(colorCommonClass)
                    .addClass(colorGrayRightClass);
            //创建比率指示灯下面文字
            me.ratioIndicatorContentEl = ratioIndicatorContentEl = $("<div>").appendTo(me.contentEl)
                    .width(me.width)
                    .html(valueLabel + "/ " + maxValueLabel +
                    "<em>" + textValue + "</em>/" + maxValue)
                    .addClass(loadingTextClass);

            //错误数据的显示
            if (dataError) {
                ratioIndicatorRightDivEl.addClass(colorGrayAllClass);
                ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                        "--" + "/" + "--");
                return;
            }
            //当前值为0 
            if (0 === value.value) {
                ratioIndicatorRightDivEl.addClass(colorGrayAllClass);
                ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                        textValue + "/" + maxValue);
                return;
            }
            //创建RatioIndicator组件内容
            me._createRatioIndicatorContent();
        },
        /**
         * @private
         * @description 创建RatioIndicator组件内容
         */
        _createRatioIndicatorContent: function() {
            var me = this,
                    options = me.options,
                    ratioIndicatorLeftDivEl = me.ratioIndicatorLeftDivEl,
                    ratioIndicatorContentEl = me.ratioIndicatorContentEl,
                    value = options.value,
                    from = options.from,
                    threshhold = options.threshhold,
                    valueLabel = $.htmlEscape(options.valueLabel),
                    maxValueLabel = $.htmlEscape(options.maxValueLabel),
                    maxValue = $.htmlEscape(options.maxValue),
                    textValue = $.htmlEscape(value.value),
                    secondThreshhold = options.secondThreshhold;
            if ("green" === from) {
                //如果当前值等于最大值，from参数为green ，显示全部绿色，
                if (value.value === maxValue) {
                    ratioIndicatorLeftDivEl.addClass(colorGreenAllClass);
                    ratioIndicatorContentEl.html(maxValueLabel + "：" + "<em>" + textValue + "</em>");
                    return;
                }
                if (value.value <= threshhold) {
                    //如果value小于阈值,from参数为green ，显示左边 绿色，右边显示灰色
                    ratioIndicatorLeftDivEl.addClass(colorGreenLeftClass);
                    ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                            "<em>" + textValue + "</em>/" + maxValue);
                }
                //如果存在第二个阈值
                if (!$.isNull(secondThreshhold)) {
                    if (value.value > threshhold && value.value < secondThreshhold) {
                        ratioIndicatorLeftDivEl.addClass(colorYellowLeftClass);
                        ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                                "<span class = " + yellowTextClass + ">" + textValue + "</span>/" + maxValue);
                        return;
                    }
                }
                //如果value大于阈值,from参数为green ，显示左边红色，右边显示灰色
                if (value.value > threshhold) {
                    ratioIndicatorLeftDivEl.addClass(colorRedClass);
                    ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                            "<i>" + textValue + "</i>/" + maxValue);
                }
            } else {
                //如果当前值等于最大值，from参数为green ，显示全部绿色，
                if (value.value === maxValue) {
                    ratioIndicatorLeftDivEl.addClass(colorRedAllClass);
                    ratioIndicatorContentEl.html(maxValueLabel + "：" + "<i>" + textValue + "</i>");
                    return;
                }
                //如果value小于阈值,from参数为red ，显示左边红色，右边显示灰色
                if (value.value < threshhold) {
                    ratioIndicatorLeftDivEl.addClass(colorRedClass);
                    ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                            "<i>" + textValue + "</i>/" + maxValue);
                }
                //如果存在第二个阈值
                if (!$.isNull(secondThreshhold)) {
                    if (value.value > threshhold && value.value < secondThreshhold) {
                        ratioIndicatorLeftDivEl.addClass(colorYellowLeftClass);
                        ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                                "<span class = " + yellowTextClass + ">" + textValue + "</span>/" + maxValue);
                        return;
                    }
                }
                //如果value大于阈值,from参数为red ,左边显示绿色，右边显示灰色
                if (value.value > threshhold) {
                    ratioIndicatorLeftDivEl.addClass(colorGreenLeftClass);
                    ratioIndicatorContentEl.html(valueLabel + "/ " + maxValueLabel + "：" +
                            "<em>" + textValue + "</em>/" + maxValue);
                }
            }
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String}
         *        id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.ratioIndicatorEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 销毁calculator组件
         */
        _destroyWidget: function() {
            if (this.ratioIndicatorEl) {
                this.ratioIndicatorEl.remove();
            }
        },
        /**
         * @description 取消事件
         * @private
         */
        _removeListener: function() {
            var me = this;
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(eventName, func) {
                if ("change" === eventName) {
                    me.eventMap.change = null;
                    delete me.handlers.change;
                    me.eventMap.length--;
                }
            });
        },
        /**
         * @description 注册事件
         * @private
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if ("change" === eventName) {
                    me.eventMap.change = func;
                    me.eventMap.length++;
                }
            });
        }
    });

    /**
     * 创建比率指示灯组件
     * @name Sweet.RatioIndicator
     * @class
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * sweetCalculator =new Sweet.RatioIndicator({
     *      width: 480,
     *      value: {"value": 600, "text": null},
     *      maxValue: 1000,
     *      renderTo: "sweet-indicator"
     * });
     * </pre>
     */
    Sweet.RatioIndicator = $.sweet.widgetRatioIndicator;
}(jQuery));

/**
 * @fileOverview  
 * <pre>
 * form组件--微调器
 * 2012/12/19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    /**
     * 组件全局变量定义
     */
    var spinnerChangeValue = "sweet-form-spinner-changeValue",
        spinnerChangeValSpan = "sweet-form-spinner-changeValSpan",
        spinnerChangeValTop = "sweet-form-spinner-changeValTop",
        spinnerChangeValDown = "sweet-form-spinner-changeValDown",
        spinnerChangeValueDisabled = "sweet-form-spinner-changeValue-disabled",
        spinnerChangeValTopDisabled = "sweet-form-spinner-changeValTop-disabled",
        spinnerChangeValDownDisabled = "sweet-form-spinner-changeValDown-disabled",
        spinnerClass = "sweet-form-spinner",
        hrefJs = "javascript:void(0);",
        flipType = [1, 2]; // 1 增加  2 减少

    $.widget("sweet.widgetFormSpinner", $.sweet.widgetFormNumberfield, /** @lends Sweet.form.Spinner.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-spinner]",
        type: 'text',
        eventNames: /** @lends Sweet.form.Spinner.prototype*/{
            /**
             * @event
             * @description 改变值事件,参数为两个(event, data)
             */
            change: "改变值事件"
        },
        /**
         * @private
         * @description 微调器组件公共配置参数
         * @type object
         */
        options: /** @lends Sweet.form.Spinner.prototype*/{
            /**
             * @description 步进单位
             * @type {Number}
             * @default 1
             */
            step: 1,
            /**
             * @description 起始值
             * @type {Number}
             * @default 0
             */
            start: 0
        },
        /**
         * @description 重新计算并绘制页面
         * @private
         */
        _doLayout: function() {
            this._super();
        },
        /**
         * @private
         * @description 创建微调器上下翻按钮
         */
        __afterCreateFormWidget: function() {
            var me = this,
                spanEl = me.spanEl = $("<span>").addClass(spinnerChangeValue).insertBefore(me.formElement),
                upEl = me.upEl = $("<span>").attr("href", hrefJs)
                    .addClass(spinnerChangeValTop + " " + spinnerChangeValSpan)
                    .appendTo(spanEl),
                downEl = me.downEl = $("<span>").attr("href", hrefJs)
                    .addClass(spinnerChangeValDown + " " + spinnerChangeValSpan)
                    .appendTo(spanEl);

            me.formDiv2El.addClass(spinnerClass);
            me._setRange();
        },

        /**
         * @private
         * @description 上下翻
         * @param {Object} event 上下翻图片对象
         */
        _onFilp: function(event) {
            var me = event.data.me,
                options = me.options,
                type = event.data.type,
                obj = event.data.obj,
                value = obj.val(),
                temp;
            if(options.disabled){
                return;
            }
            if (!me.editable) {
                return;
            }
            me.oldValue1 = obj.val();
            if ($.number.isFloat(value)) {
                value = parseFloat(value);
            } else {
                value = parseInt(value, 10);
            }
            // 增加
            if (flipType[0] === type) {
                temp = value + options.step;
                if ($.isNotNull(options.maxValue)) {
                    if (temp <= options.maxValue) {
                        obj.val(temp);
                        me._triggerHandler(event, "change", me.getValue());
                    }
                } else {
                    obj.val(temp);
                    me._triggerHandler(event, "change", me.getValue());
                }
                me._setRange();
                // 减少
            } else if (flipType[1] === type) {
                temp = value - options.step;
                if ($.isNotNull(options.minValue)) {
                    if (temp >= options.minValue) {
                        obj.val(temp);
                        me._triggerHandler(event, "change", me.getValue());
                    }
                } else {
                    obj.val(temp);
                    me._triggerHandler(event, "change", me.getValue());
                }
                me._setRange();
            } else {
                me._error("_onFilp(): Unsupported type. Type equals 1 or 2. type=" + type);
            }
            event.stopImmediatePropagation();
        },

        /**
         * @private
         * @description 根据微调器值范围改变上下翻按钮样式
         */
        _setRange: function() {
            var me = this,
                options = me.options,
                value, formEI = me.formElement,
                maxValue = options.maxValue, minValue = options.minValue;
            value = me.formElement.val();
            if ($.number.isFloat(value)) {
                value = parseFloat(value);
            } else {
                value = parseInt(value, 10);
            }
            if (!options.disabled) {
                // 微调器只有最大值限制时
                if ($.isNotNull(maxValue) && $.isNull(minValue)) {
                    if (value === maxValue || (value + options.step) > maxValue) {
                        me.upEl.removeClass(spinnerChangeValTop).addClass(spinnerChangeValTopDisabled);
                        me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
                        me.upEl.unbind("click");
                        me.downEl.bind("click", {"me": me, "type": 2, "obj": formEI}, me._onFilp);
                    } else {
                        me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                        me.upEl.bind("click", {"me": me, "type": 1, "obj": formEI}, me._onFilp);
                        me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
                        me.downEl.bind("click", {"me": me, "type": 2, "obj": formEI}, me._onFilp);
                    }
                    // 微调器只有最小值限制时
                } else if ($.isNull(maxValue) && $.isNotNull(minValue)) {
                    if (value === minValue || (value - options.step) < minValue) {
                        me.downEl.removeClass(spinnerChangeValDown).addClass(spinnerChangeValDownDisabled);
                        me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                        me.downEl.unbind("click");
                        me.upEl.bind("click", {"me": me, "type": 1, "obj": formEI}, me._onFilp);
                    } else {
                        me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
                        me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                        me.upEl.bind("click", {"me": me, "type": 1, "obj": formEI}, me._onFilp);
                        me.downEl.bind("click", {"me": me, "type": 2, "obj": formEI}, me._onFilp);
                    }
                    // 微调器同时设置最大值和最小值
                } else if ($.isNotNull(maxValue) && $.isNotNull(minValue)) {
                    if (value === maxValue || (value + options.step) > maxValue) {
                        me.upEl.removeClass(spinnerChangeValTop).addClass(spinnerChangeValTopDisabled);
                        me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
                        me.upEl.unbind("click");
                        me.downEl.bind("click", {"me": me, "type": 2, "obj": formEI}, me._onFilp);
                    } else if (value === minValue || (value - options.step) < minValue) {
                        me.downEl.removeClass(spinnerChangeValDown).addClass(spinnerChangeValDownDisabled);
                        me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                        me.downEl.unbind("click");
                        me.upEl.bind("click", {"me": me, "type": 1, "obj": formEI}, me._onFilp);
                    } else {
                        me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                        me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
                        me.upEl.bind("click", {"me": me, "type": 1, "obj": formEI}, me._onFilp);
                        me.downEl.bind("click", {"me": me, "type": 2, "obj": formEI}, me._onFilp);
                    }
                } else {
                    me.upEl.bind("click", {"me": me, "type": 1, "obj": me.formElement}, me._onFilp);
                    me.downEl.bind("click", {"me": me, "type": 2, "obj": me.formElement}, me._onFilp);
                }
            }
        },
        /**
         * @private
         * @description 置灰微调器上、下翻图片
         * @param {Boolean} disabled ture/false
         */
        __setDisabled: function(disabled) {
            var me = this;
            if (disabled) {
                me.spanEl.removeClass(spinnerChangeValue).addClass(spinnerChangeValueDisabled);
                me.upEl.removeClass(spinnerChangeValTop).addClass(spinnerChangeValTopDisabled);
                me.downEl.removeClass(spinnerChangeValDown).addClass(spinnerChangeValDownDisabled);
            } else {
                me.spanEl.removeClass(spinnerChangeValueDisabled).addClass(spinnerChangeValue);
                me.upEl.removeClass(spinnerChangeValTopDisabled).addClass(spinnerChangeValTop);
                me.downEl.removeClass(spinnerChangeValDownDisabled).addClass(spinnerChangeValDown);
            }
            me.spanEl.attr("disabled", disabled);
            me.upEl.attr("disabled", disabled);
            me.downEl.attr("disabled", disabled);
        }
    });

    /**
     * 创建微调器
     * @name Sweet.form.Spinner
     * @class 
     * @extends Sweet.form.NumberField
     * @requires  
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * jquery.sweet.widget.form.textfield.js
     * jquery.sweet.widget.form.numberfield.js
     * </pre>
     * @example 
     * <pre>
     * sweetSpinner = new Sweet.form.Spinner({
     *     label : true,
     *     width : 200,
     *     labelText : 'spinner',
     *     value : {value:5, text:'spinner'},
     *     maxValue : 10,
     *     step : 2,
     *     minValue : 0,
     *     tooltip : "这是tip测试",
     *     renderTo :　"sweet-text"
     * });
     * </pre>
     */
    Sweet.form.Spinner = $.sweet.widgetFormSpinner;

}(jQuery));

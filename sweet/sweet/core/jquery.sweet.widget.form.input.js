/**
 * @fileOverview  
 * <pre>
 * form组件-输入类组件
 * 2013/1/9
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 创建输入类组件
 * @name Sweet.form.Input
 * @class 
 * @extends Sweet.form
 * @requires 
 * <pre>
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.sweet.widget.js
 *  jquery.sweet.widget.form.js
 * </pre>
 */
(function($, undefined) {

    var inputContentClass = "sweet-form-content";

    $.widget("sweet.widgetFormInput", $.sweet.widgetForm, /** @lends Sweet.form.Input.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-input]",
        defaultElement: "<input>",
        type: "text",
        eventNames: /** @lends Sweet.form.Input.prototype*/{
            /**
             * @event
             * @description 值改变的事件
             */
            change: "改变值事件",
            /**
             * @event
             * @description 获得焦点事件
             */
            focus: "获得焦点事件"
        },
        defaultPaddingDivClass: "sweet-form-input",
        defaultPaddingDivDisabledClass: "sweet-form-input-disabled",
        defaultInputClass: "sweet-form-input-text",
        defaultInputPaddingClass: "sweet-form-input-text-padding",
        defaultInputEmptyDivClass: "sweet-form-input-emptyDiv",
        defaultInputEmptyDivDisabledClass: "sweet-form-empty-disabled",
        // form类输入组件公共配置参数
        options: /** @lends Sweet.form.Input.prototype*/{
            /**
             * @description 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default null
             */
            emptyText: null,
            /**
             * @description 输入类组件高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 是否可编辑
             * @type {Boolean}
             * @default true
             */
            editable: true,
            /**
             * @description 是否有label
             * @type {Boolean}
             * @default false
             */
            label: false,
            /**
             * @description label文字
             * @type {String}
             * @default null
             */
            labelText: null,
            /**
             * @description label宽度
             * @type {String/Number}
             * @default 0.3
             */
            labelWidth: 0.3,
            /**
             * @description 是否必选项
             * @type {Boolean}
             * @default false
             */
            required: false,
            /**
             * @description 错误提示的显示模式
             * @type {String}
             * @default "side"
             */
            errorModel: Sweet.constants.tipAttr.MODEL_SIDE,
            /**
             * @description 错误提示的内容
             * @type {String}
             * @default ""
             */
            tooltip: "",
            /**
             * @description 最小长度
             * @type {Number}
             * @default 0
             */
            minLength: 0,
            /**
             * @description 最大长度
             * @type {Number}
             * @default Number.MAX_VALUE
             */
            maxLength: Number.MAX_VALUE,
            /**
             * @description label文字是否显示符号
             * @type {Boolean}
             * @default true
             */
            symbol: true,
            /**
             * @description 是否包含空白字符
             * @type {Boolean}
             * @default true
             */
            blank: true,
            /**
             * @description 错误提示出现的条件，使用时自己定义
             * @type {Function}
             * @default false
             */
            validateFun: function() {
                return {"success": true};
            }
        },
        /**
         * @description 设置输入类组件LabelText
         * @param {String} text: Label Text
         */
        setLabelText: function(text) {
            var me = this, opt = me.options;
            if (opt.symbol) {
                text += Sweet.constants.symbol.COLON;
            }
            if (opt.required) {
                me.label.children("label")[0].lastChild.textContent = text;
            } else {
                me.label.text(text);
            }
        },
        /**
         * @description 返回输入类组件LabelText
         * @return {String} text: Label Text
         */
        getLabelText: function() {
            var me = this;
            if (me.options.required) {
                return me.label.children("label")[0].lastChild.textContent;
            } else {
                return me.label.text();
            }
        },
        /**
         * @description 校验
         * @return {Boolean} 校验是否通过
         */
        validate: function() {
            var me = this;
            return me.check();
        },
        /**
         * @deprecated Function validate can be used instead
         * @description 内部校验（非空、长度等）
         * @return {Boolean} 校验是否通过
         */
        check: function() {
            var me = this,
                    options = me.options,
                    fun = options.validateFun,
                    eventName = fun.eventName || "blur";
            //disabled状态下不做校验
            if (me.getDisabled()) {
                return;
            }
            // 常规校验通过后，才进行外部注册的blur校验事件
            if (me._checkFun()) {
                if ("object" !== typeof fun || eventName !== "blur") {
                    me.tipType = null;
                    me._showNormalTip();
                    return true;
                }
                return me._checkOuterFun();
            } else {
                return false;
            }
        },
        /**
         * @description 显示提示框
         * @param {Boolean} isCheckEmpty 是否为非空校验
         */
        showTip: function(isCheckEmpty) {
            var me = this, formEI = me.formElement,
                    options = this.options,
                    tipTitle = me.tipTitle,
                    tipType = me.tipType,
                    errorModel = options.errorModel;
            // 普通提示
            if (!tipType) {
                tipType = me.tipType = Sweet.constants.tipAttr.TYPE_NORMAL;
            }
            // 非空校验提示，tipType固定为"error",errorModel由外部设置，提示字符写死。
            if (isCheckEmpty) {
                tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                tipTitle = Sweet.core.i18n.tip.EMPTY_TITLE;
            }
            // 提示
            if (tipType && tipTitle) {
                // 若更换了提示内容
                if (!me.oldTipTitle || me.oldTipTitle !== tipTitle) {
                    if (me.oldTipTitle && me.oldTipTitle !== tipTitle) {
                        // 清除之前所有的提示
                        formEI.sweettip();
                        formEI.sweettip("destroy");
                    }
                    // 显示新的提示
                    formEI.sweettip();
                    formEI.attr({tiptype: tipType, errormodel: errorModel, title: tipTitle});
                    me.oldTipTitle = tipTitle;
                    // 立刻出现红色边框
                    if ("error" === tipType && "none" === errorModel) {
                        formEI.sweettip("showErrorBorder");
                    }
                    // 立刻出现错误提示，而不用鼠标移上去触发
                    if ("error" === tipType && "side" === errorModel) {
                        formEI.sweettip("open");
                    }
                }
            }
        },
        /**
         * @description 关闭提示框
         */
        closeTip: function() {
            if (!this.formElement) {
                return;
            }
            var me = this;
            me.formElement.attr("title", "");
            me.formElement.sweettip();
            me.formElement.sweettip("destroy");
            me.oldTipTitle = null;
        },
        /**
         * @description 设置组件只读
         * @param {Boolean} editable: true/false
         */
        setEditable: function(editable) {
            if (this.disabled) {
                return;
            }
            this.formElement.removeAttr("readonly").removeAttr("disabled");
            this.formElement.attr("readOnly", !editable);
            this.editable = editable;
            this._setEditable(editable);
        },
        /**
         * @private
         * @description 注册事件
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if (eventName === "change") {
                    //监听关闭时间面板
                    $(me.formElement).blur(function(event) {
                        if (me.oldValue !== me.formElement.val() && func) {
                            var val = me.getValue();
                            func.call(this, event, val);
                        }
                    });
                } else if (eventName === "focus") {
                    //focus事件
                    $(me.formElement).focus(function(event) {
                        func.call(this, event, me.getValue());
                    });
                }
            });
        },
        /**
         * @private
         * @description 清除事件
         */
        _removeListener: function(eName) {
            var me = this;
            me.handlers = me.handlers || {};
            if (!eName || eName === "") {
                if (me.formElement) {
                me.formElement.unbind();
                }
            } else {
                $.each(me.handlers, function(eventName, func) {
                    if (eName === eventName) {
                        me.formElement.unbind(eventName);
                    }
                });
            }
        },
        /**
         * @description 设置值(内部调用)
         * @param {Object} value 值对象
         * @param {Boolean} isCheck 设置值时是否要检查
         */
        _setValue: function(value, isCheck) {
            var me = this,
                    inputText;
            if ($.isEmptyObject(value)) {
                value = {value: ""};
            }
            inputText = me._textCmpSetValue(value);
            me.formElement.val(inputText);
            me.closeTip();
            if (true === isCheck || "true" === isCheck) {
                me.check();
            }
        },
        /**
         * @description 设置值
         * @param {Object} value 值对象
         * @param {Boolean} isCheck 设置值时是否要检查
         */
        setValue: function(value, isCheck) {
            var me = this,
                    timeBegin,
                    timeEnd;
            if ($.isEmptyObject(value)) {
                value = {value: ""};
            }
            timeBegin = $.date.getMilliseconds();
            me.options.value = $.objClone(value);
            me._setValue(value, isCheck);
            timeEnd = $.date.getMilliseconds();
            me._info("Set value. Time-consuming = " + (timeEnd - timeBegin) + "ms");
        },
        /**
         * @private
         * @description 创建基本文本框对象
         */
        _createFormWidget: function() {
            var me = this,
                    options = this.options;
            // 创建label标签
            me._createLabel();

            // 创建form组件
            me._createInputContainer();
            me._createInputField();

            // 校验
            me._check();
            me._focus();
            // 鼠标移上去，出现提示
            if (options.tooltip) {
                me.tipTitle = options.tooltip;
                me.showTip();
            }
            // 设置默认值
            if (!$.isEmptyObject(options.value)) {
                me._setValue(options.value);
            }
            // 是否只读
            me.setEditable(options.editable);
            // 设置为空时显示的字符
            me._setEmptyText();
        },
        /**
         * @description 创建输入区域容器 formDiv1El
         * @private
         */
        _createInputContainer: function() {
            "use strict";
            this.formDiv1El = $("<div>");
            this.formDiv1El.addClass(inputContentClass).appendTo(this.formEl);
        },
        /**
         * @private
         * @description 创建基本文本框前label标签
         */
        _createLabel: function() {
            if (!this.options.label) {
                return;
            }
            var me = this,
                    options = me.options,
                    labelClass = "sweet-form-label",
                    label = me.label = $("<label>").addClass(labelClass),
                    labelText = '';
            if (!$.isNull(options.labelText)) {
                labelText += $.htmlEscape(options.labelText);
                if (options.symbol) {
                    labelText += Sweet.constants.symbol.COLON;
                }
            } else {
                return;
            }
            var labelHtml = "<label><font class=\"sweet-form-label-required\" color=\"red\"";
            // 是否必选项
            if (options.required) {
                labelText = labelHtml + ">&nbsp;*&nbsp;</font>" + labelText;
            } else {
                if (options.blank) {
                    labelText = labelHtml + " style=\"visibility:hidden\">&nbsp;*&nbsp;</font>" + labelText;
                }
            }
            label.html(labelText).appendTo(me.formEl);
        },
        /**
         * @description Input类组件布局刷新基本处理
         * @private
         */
        _doLayout: function() {
            "use strict";
            var formElWidth = this.formEl.width() - $.getPaddingRight(this.formEl) - $.getPaddingLeft(this.formEl),
                    labelWidth = this.labelWidth = this._doLabelLayout(formElWidth);

            if (this.formDiv1El) {
                this.formDiv1El.css("left", labelWidth);
            }
        },
        /**
         * @private
         * @description 计算label宽度
         * @param {Number} width 外层容器宽度
         */
        _doLabelLayout: function(width) {
            var me = this,
                    options = me.options,
                    labelWidth;
            if (me.label) {
                // 按百分比设定
                if (1 > options.labelWidth) {
                    labelWidth = Math.floor(width * options.labelWidth);
                } else {
                    labelWidth = options.labelWidth;
                }
            } else {
                labelWidth = 0;
            }

            return labelWidth;
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         */
        _setDisabled: function(disabled) {
            var me = this,
                    emptyDivCls = me.defaultInputEmptyDivClass,
                    emptyDisableDivCls = me.defaultInputEmptyDivDisabledClass,
                    defPaddingCls = me.defaultPaddingDivClass,
                    defDisablePaddingCls = me.defaultPaddingDivDisabledClass;
            if (me.emptyDiv) {
                if ($.isVisiable(me.emptyDiv)) {
                    if (disabled) {
                        if (!me.emptyDiv.hasClass(emptyDivCls)) {
                            return;
                        }
                        me.emptyDiv.removeClass(emptyDivCls).addClass(emptyDisableDivCls);
                    } else {
                        if (!me.emptyDiv.hasClass(emptyDisableDivCls)) {
                            return;
                        }
                        me.emptyDiv.removeClass(emptyDisableDivCls).addClass(emptyDivCls);
                    }
                }
            }
            if (disabled) {
                //问题单：DTS2013121403316 
                me.formElement.attr("disabled", true);
                me.formDiv2El.removeClass(defPaddingCls).addClass(defDisablePaddingCls);
            } else {
                //问题单：DTS2013121403316 
                me.formElement.attr("disabled", false);
                me.formDiv2El.removeClass(defDisablePaddingCls).addClass(defPaddingCls);
            }
            me.__setDisabled(disabled);
        },
        /**
         * @private
         * @description 子类实现，置灰除输入框以外其他控件
         */
        __setDisabled: $.noop,
        /**
         * @private
         * @description 绑定获取焦点事件
         */
        _focus: function() {
            var me = this;
            me.formElement.focus(function() {
                me.oldValue = me.formElement.val();
            });
        },
        /**
         * @private
         * @description 绑定校验事件，子类继承实现
         */
        _check: function() {
            var me = this;
            me.formElement.blur({"me": me}, me._onBlur);
        },
        /**
         * @private
         * @description 文本框失去焦点时触发
         * @param {Object} event 文本框事件对象
         */
        _onBlur: function(event) {
            var me = event.data.me;
            function delayCheck() {
                // 失去焦点之后，还有其他动作，这两个函数应该在最后调用
                me.validate();
            }

            //对于时间组件，失去焦点后就对时间纠错，防止change发生时拿到错误的时间值
            if (me.sweetWidgetName === "[widget-form-date]") {
                me._setRightTimeValue(me);
            }
            if (!me.getDisabled()) {
                me.delayCheckTimerInput = setTimeout(delayCheck, 500);
            }
        },
        /**
         * @private
         * @returns {Boolean} true 校验通过，false 校验不通过
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         */
        _checkFun: function(justGetResult) {
            var me = this;
            justGetResult = false;
            if (false === me._checkAllFun(justGetResult)) {
                return false;
            }
            if (!justGetResult) {
                me.closeTip();
            }

            return true;
        },
        /**
         * @private
         * @returns {Boolean} true 校验通过，false 校验不通过
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         */
        _checkAllFun: function(justGetResult) {
            if (!this.formElement) {
                return;
            }
            var me = this,
                    options = me.options,
                    val = me.formElement.val(),
                    len = val.length;
            //非空校验，校验不通过直接返回，不进行长度校验
            if (options.required) {
                if (!val) {
                    if (!justGetResult) {
                        me._error("Can not be empty!");
                        me.showTip(true);
                    }
                    return false;
                }
            }
            // 长度校验
            if (len > options.maxLength || len < options.minLength) {
                if (!justGetResult) {
                    me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                    me.tipTitle = Sweet.core.i18n.tip.LENGTH_RANGE_1 +
                            options.minLength + Sweet.core.i18n.tip.LENGTH_RANGE_2 +
                            options.maxLength + Sweet.core.i18n.tip.LENGTH_RANGE_3;
                    me.showTip();
                }
                return false;
            }
        },
        /**
         * @description 文本框为空时设置显示的字符
         * @param {String} text 待设置的值
         */
        setEmptyText: function(text) {
            var me = this,
                    formElement = me.formElement;
            if (!formElement) {
                return;
            }
            if ($.isNull(text)) {
                me.options.emptyText = null;
                formElement.removeAttr("placeholder");
            } else {
                me.options.emptyText = text;
                formElement.attr("placeholder", text);
            }
        },
        /**
         * @description 文本框为空时设置显示的字符
         * @private
         * @param {Boolean} flag 是否由获得焦点事件触发
         */
        _setEmptyText: function(flag) {
            var me = this,
                    emptyText = me.options.emptyText,
                    formElement = me.formElement;
            if (!formElement || !me.options.emptyText) {
                return;
            }
            if (!flag) {
                if (emptyText) {
                    formElement.attr("placeholder", emptyText);
                }
            } else {
                formElement.removeAttr("placeholder");
            }
        },
        /**
         * @private
         * @description 组件创建后执行的操作
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    options = me.options,
                    fun = options.validateFun,
                    eventName;
            if ("object" !== typeof fun) {
                return;
            }
            eventName = fun.eventName || "blur";
            if (eventName === "keypress" ||
                    eventName === "keyup" ||
                    eventName === "keydown" ||
                    eventName === "blur" ||
                    eventName === "focus") {
                me.formElement.bind(eventName, {"me": me}, me._filterCharacter);
            }
        },
        /**
         * @private
         * @description 数值输入框，键盘按下时触发，过滤用户指定的字符
         * @param {type} event 数值输入框对象
         */
        _filterCharacter: function(event) {
            var me = event.data.me,
                    options = me.options,
                    fun = options.validateFun,
                    type = event.type;

            // 防止重复执行外部注册的blur事件。
            // _onBlur()-->check()-->_checkOuterFun()-->fun.fun.call()，
            if ("blur" === type) {
                return;
            }
            var funResult = fun.fun.call(this, event, me.getValue(), fun.params);

            function delayFilterCharacter() {
                // 按照函数校验
                if (funResult && !funResult.success) {
                    me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                    me.tipTitle = funResult.message;
                    me.showTip();
                    return false;
                } else {
                    me.closeTip();
                    return true;
                }
            }
            setTimeout(delayFilterCharacter, 800);
        },
        /**
         * @private
         * @description 执行外部注册的校验函数
         * @param {type} event 数值输入框对象
         */
        _checkOuterFun: function() {
            var me = this,
                    options = me.options,
                    fun = options.validateFun;
            var funResult = fun.fun.call(this, null, me.getValue(), fun.params);
            // 按照函数校验
            if (funResult && !funResult.success) {
                me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                me.tipTitle = funResult.message;
                me.showTip();
                return false;
            } else {
                me.closeTip();
                me.tipType = null;
                me._showNormalTip();
                return true;
            }
        },
        /**
         * @private
         * @description 执行外部注册的校验函数
         * @param {type} event 数值输入框对象
         */
        _showNormalTip: function() {
            var me = this,
                    options = me.options;

            me.showTipTimerInput = setTimeout(function() {
                // 若为普通tip提示，仍然需要提示
                if (options.tooltip && !me.tiptype) {
                    me.tipTitle = options.tooltip;
                    me.showTip();
                }
            }, 600);
        },
        /**
         * @private
         * @description 销毁form组件
         */
        _destroyWidget: function() {
            var me = this;
            me._super();
            // 关闭定时器
            if (me.delayCheckTimerInput) {
                clearTimeout(me.delayCheckTimerInput);
            }
            if (me.showTipTimerInput) {
                clearTimeout(me.showTipTimerInput);
            }
        },
        /**
         * @private
         * @description 创建form组件
         */
        _createInputField: $.noop,
        /**
         * @private
         * @description 设置是否可编辑
         */
        _setEditable: $.noop
    });
}(jQuery));

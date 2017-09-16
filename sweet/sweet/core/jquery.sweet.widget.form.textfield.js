/**
 * @fileOverview
 * <pre>
 * form组件--简单文本框
 * 2012/11/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    var textFieldClass = "sweet-form-textfield",
            textFieldInputParentErrorClass = "sweet-tips-inputParent",
            textFieldInputErrorClass = "sweet-tips-input";

    $.widget("sweet.widgetFormTextfield", $.sweet.widgetFormInput, /** @lends Sweet.form.TextField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-textfield]",
        type: 'text',
        /**
         * @private
         * @description 文本框组件公共配置参数
         * @type {object}
         */
        options: /** @lends Sweet.form.TextField.prototype*/{
            /**
             * @type {String}
             * @description ip校验配置参数。"v4"表示ipv4校验，"v6"表示ipv6校验，"v"表示校验是否符合ipv4或ipv6规则,
             *              可选值："v4"、"v6"、"v"。
             * @default null
             */
            IPVersion: null,
            /**
             * @description 是否显示输入框内容的提示
             * @type {Boolean}
             * @default false
             */
            tip: false
        },
        /**
         * @description 组件重绘
         * @private
         */
        _doLayout: function() {
            this._super();
        },
        /**
         * @private
         * @description 创建文本输入域
         */
        _createInputField: function() {
            var me = this,
                    options = me.options,
                    formElement = me.formElement = $("<input>"),
                    formDiv1El = me.formDiv1El,
                    formDiv2El = me.formDiv2El = $("<div>"),
                    value = $.nullToString(options.value);

            formDiv2El.addClass(me.defaultPaddingDivClass).addClass(textFieldClass).appendTo(formDiv1El);
            formElement.attr("type", me.type)
                    .addClass(me.defaultInputClass);
            if ($.isNotNull(options.vID)) {
                formElement.attr("id", options.vID);
            }
            formElement.appendTo(formDiv2El);
            if (options.maxLength < Number.MAX_VALUE) {
                formElement.attr("maxLength", options.maxLength);
            }

            //配置tip为true并且tooltip为""时，显示输入框的合法内容
            if (options.tip) {
                var formEI = me.formElement,
                        formParentEl = me.formDiv2El;
                formEI.mouseover(function() {
                    if ($.isNull(options.tooltip) && !options.disabled) {
                        if ((formParentEl && formParentEl.hasClass(textFieldInputParentErrorClass)) || formEI.hasClass(textFieldInputErrorClass)) {
                            return;
                        }
                        var tempText = "";
                        tempText = formEI.val();
                        if ($.isNull(tempText)) {
                            tempText = "";
                        }
                        formEI.attr("title", tempText);
                        me.tipTitle = tempText;
                        me.showTip();
                    }
                });
            }
        },
        /**
         * @description 重载父类校验方法
         * @override
         * @private
         * @returns {Boolean} true 校验通过，false 校验不通过
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         */
        _checkAllFun: function(justGetResult) {
            var returnResult = true,
                    me = this,
                    options = me.options,
                    val = me.formElement.val();
            if (me._super(justGetResult) === false) {
                returnResult = false;
            } else {
                //IP地址规则校验
                if (options.IPVersion === Sweet.constants.ipType.VERSION4) {
                    if (!me._isIPv4Fun(val)) {
                        me._checkHandler(justGetResult);
                        returnResult = false;
                    }
                } else if (options.IPVersion === Sweet.constants.ipType.VERSION6) {
                    if (!me._isIPv6Fun(val)) {
                        me._checkHandler(justGetResult);
                        returnResult = false;
                    }
                } else if (options.IPVersion === Sweet.constants.ipType.VERSION) {
                    if (!me._isIPv6Fun(val) && !me._isIPv4Fun(val)) {
                        me._checkHandler(justGetResult);
                        returnResult = false;
                    }
                }
            }
            return returnResult;
        },
        /**
         * @description IPv6校验
         * @private
         * @param {String} val IPv6地址
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _isIPv6Fun: function(val) {
            var ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|[0-1]?\d\d?)(\.(25[0-5]|2[0-4]\d|[0-1]?\d\d?)){3}))|:)))(%.+)?\s*$/;
            return ipv6.test(val);
        },
        /**
         * @description IPv4校验
         * @private
         * @param {String} val IPv4地址
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _isIPv4Fun: function(val) {
            var ipv4 = /^\s*((25[0-5]|2[0-4]\d|[0-1]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[0-1]?\d\d?)\s*$/;
            return ipv4.test(val);
        },
        /**
         * @description 校验不通过处理方法
         * @private
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         */
        _checkHandler: function(justGetResult) {
            var me = this;
            if (!justGetResult) {
                me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                me.tipTitle = Sweet.core.i18n.tip.IP_TIP_TITLE;
                me.showTip();
            }
        }
    });

    /**
     * 文本框
     * @name Sweet.form.TextField
     * @class 
     * @extends Sweet.form.Input
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.widget.form.js
     *  jquery.sweet.widget.form.input.js
     * </pre>
     * @example 
     * <pre>
     * sweetTextField = new Sweet.form.TextField({
     *       required: true,
     *       label : true,
     *       width : "20%",
     *       labelText : 'User Name',
     *       editable : true,
     *       tooltip : "这是tip测试",
     *       renderTo : "sweet-text0"
     *   });
     * </pre>
     */
    Sweet.form.TextField = $.sweet.widgetFormTextfield;
}(jQuery));

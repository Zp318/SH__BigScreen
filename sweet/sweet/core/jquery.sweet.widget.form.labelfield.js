/**
 * @fileOverview  
 * <pre>
 * Label Field组件
 * 2013/3/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    var labelFieldDiv2Class = "sweet-form-labelfield",
            labelFieldDiv2Border = "sweet-form-labelfield-border",
            formContentClass = "sweet-form-content",
            labelClass = "sweet-form-labelfield-label",
            labelColonClass = "sweet-form-colon";

    $.widget("sweet.widgetFormLabelfield", $.sweet.widgetForm, /** @lends Sweet.form.LabelField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-labelfield]",
        defaultElement: "<div>",
        // labelField组件公共配置参数
        options: /** @lends Sweet.form.LabelField.prototype*/{
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
             * @description label宽度,值小于按百分比设定
             * @type {String/Number}
             * @default 0.3
             */
            labelWidth: 0.3,
            /**
             * @description 组件高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description label呈现样式类型，1：输入框呈现样式 2：无边框
             * @param {Number}
             * @default 1
             */
            type: 1,
            /**
             * @description 是否显示选项的提示
             * @type {Boolean}
             * @default false
             */
            tip: false
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
            me._createLabelField();
            // 设置默认值
            me._setValue(options.value);
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
                    labelContent = options.labelText,
                    labelText = $.isNull(labelContent) ?
                    "" : "&nbsp;&nbsp;&nbsp;" + $.htmlEscape(labelContent) + Sweet.constants.symbol.COLON;
            me.label = $("<label>").addClass(labelClass).html(labelText)
                    .attr("title", labelContent).appendTo(me.formEl);
            me.labelColon = $("<label>").addClass(labelColonClass)
                    .text(Sweet.constants.symbol.COLON).appendTo(me.formEl);
        },
        /**
         * @private
         * @description 创建文本输入域
         */
        _createLabelField: function() {
            var me = this,
                    options = me.options,
                    value = $.nullToString(options.value),
                    text = (value && value.text) ? value.text : "",
                    tipText = "",
                    formDiv1El = me.formDiv1El = $("<div>").addClass(formContentClass).appendTo(me.formEl),
                    formDiv2El = me.formDiv2El = $("<div>").addClass(labelFieldDiv2Class).appendTo(formDiv1El)
                    .addClass(1 === options.type ? labelFieldDiv2Border : "");
            if (value && !(undefined === value["qtip"] || null === value["qtip"])) {
                tipText = value["qtip"];
            } else {
                tipText = text;
            }
            me.formElement = $("<div>").html(text).val(text)
                    .appendTo(formDiv2El).attr("title", options.tip ? tipText : "");

            if($.isNotNull(options.vID)){
                me.formElement.attr("id", options.vID);
            }
        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 组件值，格式为{value: 值, text: 文本,data : 值}
         */
        _setValue: function(value) {
            var me = this,
                    options = me.options,
                    value = $.nullToString(value),
                    tempText = (value && value.text) ? value.text : "",
                    tipText = "";
            if (value && !(undefined === value["qtip"] || null === value["qtip"])) {
                tipText = value["qtip"];
            } else {
                tipText = tempText;
            }
            me.formElement.html(tempText).val(tempText)
                    .attr("title", options.tip ? tipText : "");
        },
        /**
         * @description 组件重绘
         * @private
         */
        _doLayout: function() {
            var me = this,
                    formElWidth = me.formEl.width(),
                    labelWidth = me._doLabelLayout(formElWidth),
                    label = me.label,
                    colon = me.labelColon;
            if (label) {
                var labelW = parseInt(label.css("width")),
                        colonW = parseInt(colon.css("width"));
                if (labelW < labelWidth - colonW/2) {
                    colon.hide();
                } else {
                    colon.show();
                    label.css("overflow", "hidden").css("text-overflow", "ellipsis");
                }
                label.css("width", labelWidth - colonW);
            }
            me.formDiv1El.css("left", labelWidth);
        },
        /**
         * @private
         * @description 计算label宽度
         * @param {Number} width 外层容器宽度
         */
        _doLabelLayout: function(width) {
            var me = this,
                    options = me.options,
                    labelWidth = options.labelWidth;

            labelWidth = labelWidth < 1 ? Math.floor(width * labelWidth) : labelWidth;
            labelWidth = me.label ? labelWidth : 0;
            return labelWidth;
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            var me = this;
            //销毁tip提示
            me.formElement.trigger("mouseout");
            if (me.label) {
                me.label.trigger("mouseout");
            }
        }
    });
    /**
     * LabelField
     * @name Sweet.form.LabelField
     * @class 
     * @extends Sweet.form.Label
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example 
     * <pre>
     * sweetLabelField = new Sweet.form.LabelField({
     *           width : 500,
     *           height : 50,
     *           label : true,
     *           tip : true,
     *           labelWidth : 0.3,
     *           labelText : 'User Name',
     *           type : 2,
     *           value : {
     *                       text: 'Hello,world!',
     *                       value: 'button'
     *                   },
     *           renderTo : "sweet-labelfield"
     * </pre>
     */
    Sweet.form.LabelField = $.sweet.widgetFormLabelfield;
}(jQuery));

/**
 * @fileOverview
 * <pre>
 * form组件--文本域
 * 2012/12/15
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    var textAreaClass = "sweet-form-textarea",
        TextAreaGrayClass = "sweet-form-textarea-gray",
        textAreaErrorRedBorderClass = "sweet-form-textarea-errorRedBorder";

    $.widget("sweet.widgetFormTextarea", $.sweet.widgetFormInput, /** @lends Sweet.form.TextArea.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-textarea]",
        type: 'textarea',
        // 文本域组件配置参数
        options: /** @lends Sweet.form.TextArea.prototype*/{},
        /**
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            this._super();
        },
        /**
         * @private
         * @description 创建输入域
         */
        _createInputField: function() {
            var me = this,
                options = me.options,
                formElement = me.formElement = $("<textarea>").addClass(textAreaErrorRedBorderClass),
                formDiv1El = me.formDiv1El,
                formDiv2El = me.formDiv2El = $("<div>").appendTo(formDiv1El),
                value = $.nullToString(options.value);
            formElement.val(value);
            if($.isNotNull(options.vID)){
                formElement.attr("id", options.vID);
            }
            formElement.appendTo(formDiv2El);
            formDiv2El.addClass(me.defaultPaddingDivClass).addClass(textAreaClass);
            if(options.maxLength < Number.MAX_VALUE) {
                formElement.attr("maxLength", options.maxLength);
            }
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         */
        _setDisabled: function(disabled) {
            var me = this;
            if (disabled) {
                me.formDiv2El.addClass(TextAreaGrayClass);
            } else {
                me.formDiv2El.removeClass(TextAreaGrayClass);
            }
            me.__setDisabled(disabled);
        }
    });
    /**
     * 文本域
     * @name Sweet.form.TextArea
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
     * sweetTextArea = new Sweet.form.TextArea({
     *     width : 400,
     *     height : 150,
     *     label: true,
     *     labelText : 'Description',
     *     renderTo : "sweet-text"
     * });
     * </pre>
     */
    Sweet.form.TextArea = $.sweet.widgetFormTextarea;

}(jQuery));

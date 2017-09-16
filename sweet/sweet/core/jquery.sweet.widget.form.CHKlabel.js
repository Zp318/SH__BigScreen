/**
 * @fileOverview  
 * <pre>
 * form组件--带复选框的label组件
 * 2012/12/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function( $, undefined ) {
    $.widget( "sweet.widgetFormCHKlabel", $.sweet.widgetFormLabel, /** @lends Sweet.form.CHKLabel.prototype*/{
        version : "1.0",
        sweetWidgetName : "[widget-form-CHKlabel]",
        defaultElement : "<input>",
        // ComboBox组件公共配置参数
        options : /** @lends Sweet.form.CHKLabel.prototype*/{
            /**
             * @description 复选框位置
             * @type {String}
             * @default "left"
             */
            align : "left"
        },
    
        /**
         * @description label元素插入前添加
         * @private
         */
        _addBeforeLabel : function() {
            var checkboxEl = this.checkboxEl = $("<input type=\"checkbox\">"),
                options = this.options;
            if (Sweet.constants.align.Left === options.align) {
                this.checkboxEl.appendTo(this.formParentEl);
            }
        },
    
        /**
         * @description label元素插入后添加
         * @private
         */
        _addAfterLabel : function() {
            var options = this.options;
            if (Sweet.constants.align.Right === options.align) {
                this.checkboxEl.appendTo(this.formParentEl);
            }
        }
    });

    /**
     * 创建下拉框
     * @name Sweet.form.CHKLabel
     * @class 
     * @extends Sweet.form.Label
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.widget.form.js
     *  jquery.sweet.widget.form.label.js
     * </pre>
     * @example 
     * <pre>
     * CHKLabel = $.sweet.widget_form_CHKlabel()
     * </pre>
     */
    Sweet.form.CHKLabel = $.sweet.widgetFormCHKlabel;

}( jQuery ) );

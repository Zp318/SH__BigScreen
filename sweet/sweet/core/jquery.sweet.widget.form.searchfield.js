/**
 * @fileOverview  
 * <pre>
 * form组件--搜索框
 * 2012/12/19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    var searchClass = "sweet-from-searchfield",
        searchDisabledClass = "sweet-from-searchfield-disabled",
        searchClassA = "sweet-from-searchfield-a",
        eClick = "click",
        eKeyup = "keyup",
        hrefJs = "javascript:void(0);";

    $.widget("sweet.widgetFormSearchfield", $.sweet.widgetFormTextfield,/** @lends Sweet.form.SearchField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-searchfield]",
        type: 'text',
        eventNames: /** @lends Sweet.form.SearchField.prototype*/{
            /**
             * @event
             * @description 搜索按钮单击事件,参数为两个(event, data)
             */
            click: "搜索按钮单击事件",
            /**
             * @event
             * @description 搜索框的keyup事件,参数为两个(event, data)
             */
            keyup: "搜索框的keyup事件"
        },
        /** 
         * @private
         * @description 查询框组件公共配置参数
         */
        options: /** @lends Sweet.form.SearchField.prototype*/{},
        /**
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            this._super();
        },
        /**
         * @private
         * @description 创建搜索按钮
         */
        _afterCreateFormWidget: function() {
            var me = this,
                    fEi = me.formElement,
                    searchPicEl = me.searchPicEl = $("<a>").attr("href", hrefJs).insertBefore(fEi);
            me.searchPicEl.bind("click", {"me": me}, me._onClick);
            fEi.bind("keyup", {"me": me}, me._onKeyup);
            me.formDiv2El.addClass(searchClass);
            searchPicEl.addClass(searchClassA);
        },
        /**
         * @private
         * @description 搜索按钮图片点击事件
         * @param {Object} event 搜索按钮图片点击对象
         */
        _onClick: function(event) {
            var me = event.data.me;
            me._triggerHandler(event, eClick, me.getValue());
        },
        /**
         * @private
         * @description 文本框的回车事件
         * @param {Object} event 搜索按钮图片点击对象
         */
        _onKeyup: function(event) {
            var me = event.data.me;
            var key = event.charCode || event.keyCode;
            // 回车
            if(13 === key) {
                me._triggerHandler(event, eClick, me.getValue());
            } else {
                me._triggerHandler(event, eKeyup, me.getValue());
            }
        },

        /**
         * @private
         * @description 置灰微调器上、下翻图片
         * @param {Boolean} disabled ture/false
         */
        __setDisabled: function(disabled) {
            var me = this,
                searchPicEI = me.searchPicEl,
                formDiv2EI = me.formDiv2El;
            if (disabled) {
                searchPicEI.removeClass(searchClassA);
                formDiv2EI.addClass(searchDisabledClass);
            } else {
                searchPicEI.addClass(searchClassA);
                formDiv2EI.removeClass(searchDisabledClass);
            }
            searchPicEI.attr("disabled", disabled);
        }
    });

    /**
     * 搜索框
     * @name Sweet.form.SearchField
     * @class 
     * @extends Sweet.form.TextField
     * @requires  
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * jquery.sweet.widget.form.textfield.js
     * </pre>
     * @example 
     * <pre>
     * 创建搜索框：
     * var sweetSearchField = new Sweet.form.SearchField({
     *     label : true,
     *     width : 200,
     *     labelText : 'Search'
     * });
     * </pre>
     */
    Sweet.form.SearchField = $.sweet.widgetFormSearchfield;

}(jQuery));

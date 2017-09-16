/**
 * @fileOverview
 * <pre>
 * form组件--选择器
 * 2013/11/7
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var sweetButtonClass = "sweet-form-button",
            sweetButtonDisabledClass = "sweet-form-button-disabled",
            formButtonClass = "sweet-form-selector-button";
    $.widget("sweet.widgetFormSelector", $.sweet.widgetFormTextfield, /** @lends Sweet.form.Selector.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-selector]",
        eventNames: /** @lends Sweet.form.Selector.prototype*/{
            /**
             * @event
             * @description 单击按钮事件
             */
            buttonClick: "单击按钮事件"
        },
        options: /** @lends Sweet.form.Selector.prototype*/{
            /**
             * @description 是否有label
             * @type {Boolean}
             * @default false
             */
            label: false,
            /**
             * @description 是否可编辑
             * @type {Boolean}
             * @default false
             */
            editable: false
        },
        /**
         * @private
         * @description 创建选择器组件
         */
        _afterCreateFormWidget: function() {
            var me = this,
                formButton = me.formButton = $("<input type='button'>").attr("value", '...')
                    .addClass(sweetButtonClass)
                    .insertAfter(me.formDiv2El)
                    .bind("click", function() {
                    if (!me.options.disabled) {
                        me._triggerHandler(null, "buttonClick");
                    }
            });
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         */
        __setDisabled: function(disabled) {
            var me = this;
            me.options.disabled = disabled;
            if (disabled) {
                me.formButton.removeClass(sweetButtonClass).addClass(sweetButtonDisabledClass);
            } else {
                me.formButton.removeClass(sweetButtonDisabledClass).addClass(sweetButtonClass);
            }
        },
        /**
         * @description 组件布局刷新基本处理
         * @private
         */
        _doLayout: function() {
            var me = this,
                formButton = me.formButton,
				preDiv1Width = me.formDiv1El.width(),
				btnLeft = 0,
				nextDiv1Width = 0;
			//在父类input的_dolayout中计算text的left
            me._super();
			//因为设置为100%或auto时，formDiv1El的宽度会自动改变（preDiv1Width ！== nextDiv1Width），而固定宽度时需要我们手动设置
			nextDiv1Width = me.formDiv1El.width();
			//固定宽度时需要我们手动设置
			if(preDiv1Width === nextDiv1Width){
				me.formDiv1El.width(nextDiv1Width - me.labelWidth);
				btnLeft = me.formDiv1El.width();
			} else {
				//30是formButton的样式中的宽度
				btnLeft = nextDiv1Width - 30;
				me.formDiv1El.width(btnLeft);
			}
            formButton.css("left", btnLeft);
            formButton.addClass(formButtonClass);
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.formEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.formEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.formDiv1El.externalWidth(width - 30);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.formDiv1El.externalHeight(height);
        }
    });
    /**
     * 选择器
     * @name Sweet.form.Selector
     * @class 
     * @extends Sweet.form.TextField
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.widget.form.js
     *  jquery.sweet.widget.form.input.js
     *  jquery.sweet.widget.form.TextField.js
     * </pre>
     * @example 
     * <pre>
     * sweetSelector = new Sweet.form.Selector({
     *       width: 250,
     *       renderTo : "selectorDiv"
     *   });
     *  sweetSelector.addListener("buttonClick", function() {
     *      $.log("click happend!");
     *  });
     * </pre>
     */
    Sweet.form.Selector = $.sweet.widgetFormSelector;
}(jQuery));



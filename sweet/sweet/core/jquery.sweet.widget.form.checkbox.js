/**
 * @fileOverview  
 * <pre>
 * form组件 -- 复选按钮
 * 2012/12/28
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * 保存组件对象
     */
    var checkboxClass = "sweet-form-checkbox",
        checkboxLabelClass = "sweet-form-checkbox-label",
        checkboxLiClass = "sweet-form-checkbox-li",
        autoClass = "sweet-form-autoWid-autoHeight",
        checkboxUnCheckedClass = "sweet-form-checkbox-unchecked",
        checkboxCheckedClass = "sweet-form-checkbox-checked",
        checkboxUnCheckedDisabledClass = "sweet-form-checkbox-unchecked-disabled",
        checkboxCheckedDisabledClass = "sweet-form-checkbox-checked-disabled",
        checkboxLabelDivCls = "sweet-form-checkbox-labelDiv",
        hrefValue = "javascript:void(0);";

    $.widget("sweet.widgetFormCheckbox", $.sweet.widgetForm, /** @lends Sweet.form.CheckBox.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-checkbox]",
        defaultElement: "<a>",
        type: "checkbox",
        eventNames: /** @lends Sweet.form.CheckBox.prototype*/{
            /**
             * @event
             * @description 单击事件,参数为两个(event, checked)
             */
            click: "单击事件",
            /**
             * @event
             * @description change事件,参数为两个(event, data)
             */
            change: "change事件"
        },
        // 复选按钮配置参数
        options: /** @lends Sweet.form.CheckBox.prototype*/{
            /**
             * @description 是否选中
             * @type {Boolean}
             * @default false
             */
            checked: false,
            /**
             * @description 高度
             * @type {String/Number}
             * @default 18px
             */
            height: 18,
            /**
             * @description 宽度
             * @type {String/Number}
             * @default 18px
             */
            width: 18,
            /**
             * @description 是否显示提示
             * @type {Boolean}
             * @default false
             */
            tip: false
        },
        /**
         * @description 设置组件状态，选中还是未选中
         * @param {Boolean} checked true/false
         */
        setChecked: function(checked) {
            var me = this;
            if ("boolean" !== typeof checked) {
                me._error("setChecked() Input parameter is not a Boolean type!");
                return;
            }
            me.options.checked = checked;
            if (checked) {
                me.formElement.removeClass(checkboxUnCheckedClass).addClass(checkboxCheckedClass);
            } else {
                me.formElement.removeClass(checkboxCheckedClass).addClass(checkboxUnCheckedClass);
            }
        },
        /**
         * @description 返回当前组件的选中状态
         * @returns {boolean}  当前组件的状态：true，表示当前是选中状态；false,表示当前是非选中状态
         */
        isChecked: function() {
            return this.options.checked;
        },
        /**
         * @description 组件重绘
         * @private
         */
        _doLayout: function() {
            var me = this;

            if (!me.rendered) {
                return;
            }

            // 缓存内容，避免每次都计算
            if (typeof me._checkBoxSize === 'undefined') {
                me._checkBoxSize = {
                    width: me.formElement.externalWidth(),
                    height: me.formElement.externalHeight()
                };
            }

            // 检查是否需要重新计算
            var formElHeight = me.formEl.height();
            if (typeof me._formElHeight === 'undefined') {
                me._formElHeight = formElHeight;
            }
            else if (me._formElHeight === formElHeight) {
                return;
            }

            // 重新计算布局
            var top = Math.floor((formElHeight - me._checkBoxSize.height) / 2);
            me.formElement.css({"margin-top": top});
            me.divEl.css({"line-height": me._formElHeight + "px"});
        },
        /**
         * @description 创建复选按钮
         * @private
         */
        _createFormWidget: function() {
            var me = this,
                options = me.options,
                ulEl = me.ulEl = $("<ul>").addClass(autoClass).appendTo(me.formEl),
                liEl = me.liEl = $("<li>").addClass(checkboxLiClass).appendTo(ulEl),
                formElement = me.formElement = $("<a>").attr("href", hrefValue).addClass(checkboxClass)
                    .bind("click", {"me": me}, me._onClick)
                    .appendTo(liEl),
                divEl = me.divEl = $("<div>").addClass(checkboxLabelDivCls),
                labelEl = me.labelEl = $("<label>").addClass(checkboxLabelClass);
            if($.isNotNull(options.vID)){
                formElement.attr("id", options.vID);
            }
            // 是否选中
            me.setChecked(options.checked);
            // 缓存数据
            $.data(formElement[0], "value", options.value);
            // 是否复选框后有文字
            if (options.value.text) {
                divEl.appendTo(liEl);
                labelEl.html(options.value.text).appendTo(divEl);
            }
            if (options.tip) {
                labelEl.attr("title", options.value.text);
            }
            // 是否复选框后有文字
            if (options.value.text && !options.disabled) {
                me.labelEl.bind("click", {"me": me}, me._onClick);
            }
        },

        /**
         * @description 单击事件
         * @private
         * @param {Object} event 按钮单击对象
         */
        _onClick: function(event) {
            var me = event.data.me, opt = me.options, result, value = null;
            if(!opt.disabled){
                value = me._getValue();
                if (me.formElement.hasClass(checkboxCheckedClass)) {
                    me.setChecked(false);
                } else {
                    me.setChecked(true);
                }
                if(opt.click && $.isFunction(opt.click)){
                    result = me._trigger("click", me, opt.checked);
                }
                result = me._triggerHandler(event, "click", opt.checked);
                // 返回false时，阻止事件冒泡
                if ("boolean" === $.type(result) && !result) {
                    event.stopImmediatePropagation();
                }
            }
        },
        /**
         * @description 给组件设置值
         * @private
         * @param {Object} obj 设置值，格式为{value: 值, text: 文本, data: Object}
         */
        _setValue: function(obj) {
            var me = this;
            me.oldValue = me.getValue();
            if (obj.text) {
                me.divEl.appendTo(me.liEl);
                me.labelEl.html(obj.text).appendTo(me.divEl);
                $.data(me.formElement[0], "value", obj);
                me.options.value = obj;
            }
            if (!$.equals(me.oldValue, obj)) {
                me._triggerHandler(null, "change", me.getValue());
            }
        },
        /**
         * @description 返回组件值
         * @private
         * @return {Object} 返回值，格式为{value: 值, text: 文本, data: Object}
         */
        _getValue: function() {
            var me = this;
            return me.options.checked ? $.data(me.formElement[0]).value : null;
        },
        /**
         * @description 设置组件禁用时样式
         * @private
         * @param {Boolean} disabled true禁用 false可用
         */
        _setDisabled: function(disabled) {
            var me = this, formEI = me.formElement;

            if (disabled) {
                if (formEI.hasClass(checkboxCheckedClass)) {
                    formEI.removeClass(checkboxCheckedClass).addClass(checkboxCheckedDisabledClass);
                } else if (formEI.hasClass(checkboxUnCheckedClass)) {
                    formEI.removeClass(checkboxUnCheckedClass).addClass(checkboxUnCheckedDisabledClass);
                }
            } else {
                if (formEI.hasClass(checkboxCheckedDisabledClass)) {
                    formEI.removeClass(checkboxCheckedDisabledClass).addClass(checkboxCheckedClass);
                } else if (formEI.hasClass(checkboxUnCheckedDisabledClass)) {
                    formEI.removeClass(checkboxUnCheckedDisabledClass).addClass(checkboxUnCheckedClass);
                }
            }
        },

        /**
         * @description 删除注册监听事件
         * @private
         * @param {String} eventName 事件名称
         */
        _removeListener: function(eventName) {
            var me = this, formEI = me.formElement, optVal = me.options.value;

            if (!$.isNull(eventName)) {
                formEI.unbind(eventName);
                if (optVal.text) {
                    me.labelEl.unbind(eventName);
                }
            } else {
                $.each(me.handlers, function(eventName, func) {
                    formEI.unbind(eventName);
                    if (optVal.text) {
                        me.labelEl.unbind(eventName);
                    }
                });
            }
        },
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            var me = this,
                fEl = me.formElement,
                labelEl = me.labelEl;
            fEl ? fEl.unbind() : "";
            labelEl ? labelEl.unbind() : "";
        }
    });

    /**
     * 复选按钮
     * @name Sweet.form.CheckBox
     * @class
     * @extends Sweet.form
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example
     * <pre>
     * var checkbox = new Sweet.form.CheckBox ({
     *       checked: true,
     *       renderTo : "sweet-checkbox",
     *       value :{"value":"1", "text":"P2P"},
     *       width: 40
     * })
     * checkbox.addListener("click", function(event, val){
     *     $.log("click happend! check is:" + val);
     * });
     * </pre>
     */
    Sweet.form.CheckBox = $.sweet.widgetFormCheckbox;
}(jQuery));

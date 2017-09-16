/**
 * @fileOverview  
 * <pre>
 * form组件--单选按钮
 * 2013/1/14
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var radioClass = "sweet-form-radio",
        radioLabelClass = "sweet-form-radio-label",
        autoClass = "sweet-form-autoWid-autoHeight",
        radioboxLiClass = "sweet-form-radiobox-li",
        radioCheckedClass = "sweet-form-radio-checked",
        radioUnCheckedClass = "sweet-form-radio-unchecked",
        radioCheckedDisabledClass = "sweet-form-radio-checked-disabled",
        radioUnCheckedDisabledClass = "sweet-form-radio-unchecked-disabled",
        hrefJs = "javascript:void(0);";
    $.widget("sweet.widgetFormRadio", $.sweet.widgetForm, /** @lends Sweet.form.Radio.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-radio]",
        type: "radio",
        eventNames: /** @lends Sweet.form.Radio.prototype*/{
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
        options: /** @lends Sweet.form.Radio.prototype*/{
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
         * @param {Boolean} checked: true表示选中，false表示未选中
         */
        setChecked: function(checked) {
            var me = this;
            if ("boolean" !== $.type(checked)) {
                me._error("setChecked() Input parameter is not a Boolean type!");
                return;
            }
            me.options.checked = checked;
            if (checked) {
                me.formElement.removeClass(radioUnCheckedClass).addClass(radioCheckedClass);
            } else {
                me.formElement.removeClass(radioCheckedClass).addClass(radioUnCheckedClass);
            }
        },
        /**
         * @description 返回组件选中还是未选中状态
         * @return {Boolean} true： 选中，false：未选中
         */
        getChecked:function(){
            return this.options.checked;

        },
        /**
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            var me = this,
                options = me.options,
                labelEl = me.labelEl,
                formElement = me.formElement,
                liEl = me.liEl,
                labelW = 0,
                labelH = 0,
                aW = 0,
                aH = 0,
                liW = 0,
                liH = 0,
                radioWidth = me.formElement.width();
            if (options.value.text) {
                me.divEl.css("padding-left", radioWidth + 6);
            }
            labelW = labelEl.width();
            aW = formElement.width();
            labelH = labelEl.height();
            aH = formElement.height();
            liW = labelW + aW;
            liH = labelH > aH ? labelH : aH;
            liEl.css("height", liH);
            liEl.css("min-height",liH);
        },
        /**
         * @private
         * @description 创建复选按钮
         */
        _createFormWidget: function() {
            var me = this,
                options = me.options,
                val = options.value,
                ulEl = me.ulEl = $("<ul>").addClass(autoClass).appendTo(me.formEl),
                liEl = me.liEl = $("<li>").addClass(radioboxLiClass).appendTo(ulEl),
                formElement = me.formElement = $("<a>").attr("href", hrefJs).addClass(radioClass)
                    .bind("click", {"me": me}, me._onclick)
                    .appendTo(liEl),
                divEl = me.divEl = $("<div>"),
                labelEl = me.labelEl = $("<label>").addClass(radioLabelClass);
            if($.isNotNull(options.vID)){
                formElement.attr("id", options.vID);
            }
            // 是否选中
            me.setChecked(options.checked);
            // 缓存数据
            $.data(formElement[0], "value", val);
            // 是否复选框后有文字
            if (val.text) {
                divEl.appendTo(liEl);
                labelEl.html(val.text).appendTo(divEl);
            }
            if (options.tip) {
                labelEl.attr("title", val.text);
            }
            // 是否复选框后有文字
            if ($.isNotNull(val.text) && !options.disabled) {
                me.labelEl.bind("click", {"me": me}, me._onclick);
            }
        },

        /**
         * @private
         * @description 单击事件
         * @param {Object} event 按钮单击对象
         */
        _onclick: function(event) {
            var me = event.data.me, value = null,
                opt = me.options, result;
            if(!opt.disabled){
                value = me._getValue();
                if (me.formElement.hasClass(radioCheckedClass)) {
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
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled true禁用 false可用
         */
        _setDisabled: function(disabled) {
            var me = this, fomrEI = me.formElement;

            if (disabled) {
                if (fomrEI.hasClass(radioCheckedClass)) {
                    fomrEI.removeClass(radioCheckedClass).addClass(radioCheckedDisabledClass);
                }
                else if (fomrEI.hasClass(radioUnCheckedClass)) {
                    fomrEI.removeClass(radioUnCheckedClass).addClass(radioUnCheckedDisabledClass);
                }
            } else {
                if (fomrEI.hasClass(radioCheckedDisabledClass)) {
                    fomrEI.removeClass(radioCheckedDisabledClass).addClass(radioCheckedClass);
                }
                else if (fomrEI.hasClass(radioUnCheckedDisabledClass)) {
                    fomrEI.removeClass(radioUnCheckedDisabledClass).addClass(radioUnCheckedClass);
                }
            }
        },

        /**
         * @private
         * @description 删除注册监听事件
         * @param {String} eventName 事件名称
         */
        _removeListener: function(eventName) {
            var me = this, formEI = me.formElement, optVal = me.options.value;

            if (!$.isNull(eventName)) {
                formEI.unbind(eventName);
                // 是否复选框后有文字
                if (optVal.text) {
                    me.labelEl.unbind(eventName);
                }
            } else {
                $.each(me.handlers, function(eventName, func) {
                    formEI.unbind(eventName);
                    // 是否复选框后有文字
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
     * 单选按钮
     * @name Sweet.form.Radio
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
     * var sweetRadio = new Sweet.form.Radio({
     *     width : 300,
     *     height : 20,
     *     renderTo : "sweet-radiobox",
     *     value : {"value":"1", "text":"P2P"}
     * });
     * sweetRadio.addListener("click", function(event, val){
     *     $.log("click happend! check is:" + val);
     * });
     * </pre>
     */
    Sweet.form.Radio = $.sweet.widgetFormRadio;

}(jQuery));

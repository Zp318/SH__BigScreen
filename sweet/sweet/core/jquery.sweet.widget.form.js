/**
 * @fileOverview  
 * <pre>
 * form组件基类
 * 2012/11/25
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 创建form组件基类
 * @name Sweet.form
 * @class 
 * @extends Sweet.widget
 * @requires  
 * <pre>
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.sweet.widget.js
 * </pre>
 */
(function($, undefined) {
    var formBaseClass = "sweet-form-widget",
            textGrayClass = "sweet-form-combobox-textGray";

    $.widget("sweet.widgetForm", $.sweet.widget, /** @lends Sweet.form.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form]",
        defaultElement: "<input>",
        type: "text",
        widgetClass: "sweet.widgetForm", // 表明是Form类组件
        // form组件公共配置参数
        options: /** @lends Sweet.form.prototype*/{
            /**
             * @description 组件是否不可用
             * @type {Boolean}
             * @default false
             */
            disabled: false,
            
            /**
             * @description 组件值
             * @type {String/Number}
             * @default ""
             */
            value: ""
        },
        
        /**
         * @description 返回widget对象
         */
        widget: function() {
            return this.formEl;
        },
        
        /**
         * @description 设置组件是否可用
         * @param {Boolean} disabled true不可用 false可用
         */
        setDisabled: function(disabled) {
            var me = this, formEI = me.formElement;
            if ("boolean" !== typeof disabled) {
                me._error("setDisabled() Input parameter is not a Boolean type!");
                return;
            }

            formEI.removeAttr("readonly").removeAttr("disabled");
            formEI.attr("readonly", disabled);
            if (disabled) {
                formEI.addClass(textGrayClass);
            } else {
                formEI.removeClass(textGrayClass);
            }
            me.options.disabled = disabled;
            me._setDisabled(disabled);
            me.disabled = disabled;
            if(!disabled) {
                // 若配置了editable，再设置disabled不起作用
                if(false === me.editable) {
                    me.setEditable(false);
                }
            }
        },

        /**
         * @description 获取组件是否可用状态
         */
        getDisabled: function(){
            return this.options.disabled;
        },

        /**
         * @private
         * @description 获取form组件对象，返回jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        _getWidgetEl: function(original) {
            return original ? this.formEl[0] : this.formEl;
        },
        
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            if(me.formEl){
            me.formEl.externalWidth(width);
            }
        },
        
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            if(me.formEl){
            me.formEl.externalHeight(height);
            }
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
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me._setWidth(width);
            me._setHeight(height);
        },
        /**
         * @description 刷新布局，子类继承实现，并调用super
         * @private
         */
        _doLayout: function () {
        },
        /**
         * @private
         * @description 获取组件值
         * @param {Object} value 组件值，格式为{value: 值, text: 文本， data: 值}
         */
        _setValue: function(value) {
            var me = this, inputText;
            if ($.isNull(value)) {
                return;
            }
            inputText = me._textCmpSetValue(value);
            me.formElement.val(inputText);
        },
        /**
         * @private
         * @description 文本框类组件在setValue时支持匹配不同的数据类型
         * @param {Object} value 组件值，格式为{value: 值, text: 文本, data: 值}
         * @return 返回值，String类型
         */
        _textCmpSetValue: function(value) {
            var me = this,
                    options = me.options,
                    inputText;
            // 先判断text
            if(!value ) {
                return "";
            }
            if(0 === value.text) {
                inputText = value.text;
            } else if($.isNull(value.text)) {
                inputText = "";
            } else {
                inputText = value.text;
            }

            // inputText为"",再判断value
            if("" === inputText) {
                if(0 === value.value) {
                    inputText = 0;
                } else if($.isNull(value.value)) {
                    inputText = "";
                } else {
                    inputText = value.value;
                }
            }
            // 若value中，只有text或只有value
            if(0 !== value.value && !value.value) {
                options.value = {value: value.text, text: value.text ,data: value.data};
            } else if (0 !== value.text && !value.text) {
                options.value = {value: value.value, text: value.value, data: value.data};
            } else {
                options.value = value;
            }
            return inputText;
        },

        /**
         * @private
         * @description 设置组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this,
                    tempData = null,
                    options = me.options;
            var val = this.formElement.val();
            // 若手动输入内容
            if(options.value){
                tempData = options.value.data;
            }
            if(!options.value || (options.value && val !== options.value.text)) {
                options.value = {text: val, value: val, data: tempData};
            }
            return $.objClone(options.value);
        },
        
        /**
         * @private
         * @description 创建form组件总入口
         */
        _createSweetWidget: function () {
            if (this.renderEl) {
                return;
            }
            var me = this,
                formEl = me.formEl = $("<div>"),
                options = me.options;

            formEl.width(options.width)
                .height(options.height)
                .attr("id", options.id)
                .addClass(formBaseClass)
                .addClass(options.widgetClass);

            me._beforeCreateFormWidget();
            me._createFormWidget();
            me._afterCreateFormWidget();

            // 禁用
            me.disabled = false;
            me.setDisabled(options.disabled);
        },
        /**
         * @private
         * @description 创建form组件前操作，子类继承实现
         */
        _beforeCreateFormWidget: $.noop,
        
        /**
         * @private
         * @description 创建form组件
         */
        _createFormWidget: $.noop,
        
        /**
         * @private
         * @description 创建form组件后操作，子类继承实现
         */
        _afterCreateFormWidget: $.noop,
        
        /**
         * @private
         * @description 设置组件不可用样式，子类继承实现
         */
        _setDisabled: $.noop,
        
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.formEl.appendTo(me.renderEl);
            me.rendered = true;

            me._afterRenderFormWidget();
            return true;
        },

        /**
         * @private
         * @description 渲染form组件后操作，子类继承实现
         */
        _afterRenderFormWidget: $.noop,
        
        /**
         * @private
         * @description 销毁form组件
         */
        _destroyWidget: function() {
            if (this.renderEl) {
                this.renderEl.find("*").unbind();
                this.renderEl.empty();
            }
        }
    });
}(jQuery));

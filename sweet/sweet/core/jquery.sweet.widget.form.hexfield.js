/**
 * @fileOverview  
 * <pre>
 * form组件--十六进制文本框
 * 2012/2/19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    /**
     * 保存组件对象
     */
    var disabledInputMethodClass = "sweet-form-input-method-disabled",
        formDiv2ElPadding = "sweet-form-hexfield-formDiv2Padding",
        hexFieldClass = "sweet-form-hexfield",
        prefix = "0x";

    $.widget("sweet.widgetFormHexfield", $.sweet.widgetFormTextfield, /** @lends Sweet.form.HEXField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-hexfield]",
        type: 'text',
        /** 
         * @description 数值组件默认字符集
         * @private
         */
        baseChars: /[^0123456789ABCDEFabcdef]/, 
        /** 
         * @private
         * @description form组件公共配置参数
         * @type {object}
         */
        options: /** @lends Sweet.form.HEXField.prototype*/{},
        
        /**
         * @private
         * @description 重新计算并绘制页面
         */
        _doLayout: function() {
            this._super();
        },
        
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 设置数值，格式为{value: 值, text: 文本}
         */
        _setValue : function (value) {
            var me = this,
                options = me.options,
                charRe = new RegExp(me.allowdChars),
                ch = me._textCmpSetValue(value);
            if ($.isNull(value)) {
                this.options.value = {value: "", text: ""};
                me.formElement.val("");
                return;
            }
            // 是否有前缀
            if(prefix !== ch.slice(0, 2)) {
                me._error("Invalid hexadecimal number:" + ch + ".");
                options.value = {value: "", text: ""};
                return;
            } else{
                ch = ch.slice(2);
            }
            // 是否为十六进制数
            if (me._checkFormat(ch, charRe)) {
                me.formElement.val(ch);
            } else {
                me._error("Invalid hexadecimal number: " + ch + ".");
                me.formElement.val("");
                options.value = {value: "", text: ""};
            }
        },
        
        /**
         * @private
         * @description 设置组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this,
                options = me.options,
                charRe = new RegExp(me.allowdChars),
                ch = this.formElement.val();
            if (ch && me._checkFormat(ch, charRe)) {
                ch = prefix + ch;
                // 若手动输入内容
                if(!options.value || ch !== options.value.text) {
                    options.value = {text: ch, value: ch};
                }
                return options.value;
            } else {
                me._error("Invalid hexadecimal number: " + ch + ".");
                return {value: "", text: ""};
            }
        },
        
        /**
         * @private
         * @description 组件创建前，准备数值型文本框合法字符集
         */
        _beforeCreateFormWidget: function() {
            var me = this;
            me.allowdChars = me.baseChars;
        },
        
        /**
         * @private
         * @description 组件创建后，添加其他功能：禁用输入法切换、禁止粘贴
         */
        _afterCreateFormWidget: function() {
            var me = this;
            // 添加禁用输入法样式
            me.formElement.addClass(disabledInputMethodClass);
            // 禁止粘贴
            me.formElement.on("paste", function(){return false;});
            me.__afterCreateFormWidget();
        },
        
        /**
         * @private
         * @description 给组件添加校验：包括数值型校验、最大最小值校验
         */
        _check: function() {
            var me = this;
            me._super();
            me.formElement.keypress({"me": me}, me._onKeyPress);
        },
        
        /**
         * @private
         * @description 数值输入框，键盘按下时触发
         * @param {type} event 数值输入框对象
         */
        _onKeyPress: function(event) {
            var keyCode = Sweet.constants.keyCode,
                evtCode = event.keyCode,
                me = event.data.me,
                charRe = new RegExp( me.allowdChars),
                ch = String.fromCharCode($.e.getCharCode(event));
            // 退格键、回车键、删除键、上下左右方向键，不做处理
            if (keyCode.BACKSPACE === evtCode || keyCode.ENTER === evtCode ||
                keyCode.DELETE === evtCode || keyCode.LEFT === evtCode ||
                keyCode.RIGHT === evtCode || keyCode.DOWN === evtCode ||
                keyCode.UP === evtCode || keyCode.TAB === evtCode) {
                return;
            }

            if(!me._checkFormat(ch, charRe)){
                event.preventDefault();
                return;
            }
        },
        
        /**
         * @private
         * @description 检查格式
         * @param {Object} me 数值框对象
         * @param {Number} val 将设置的数值
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _checkFormat : function (ch, hexNum) {
            var me = this;
            if(hexNum.test(ch)){
                // 出现错误提示
                me.showTip();
                return false;
            }
            // 关闭错误提示
            me.closeTip();
            return true;
        },
        
        /**
         * @private
         * @description 创建微调器上下翻按钮
         */
        __afterCreateFormWidget: function() {
            var me = this;
            me.formDiv2El.prepend(prefix).addClass(hexFieldClass);
        }
    });

    /**
     * 十六进制文本框
     * @name Sweet.form.HEXField
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
     * var hexfield = new Sweet.form.HEXField () 
     */
    Sweet.form.HEXField = $.sweet.widgetFormHexfield;

}(jQuery));

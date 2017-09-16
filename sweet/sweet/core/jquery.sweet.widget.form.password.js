/**
 * @fileOverview  
 * <pre>
 * form组件--密码框
 * 2012/12/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
 
(function($, undefined) {
    var passwordClass = "sweet-form-password";

    $.widget("sweet.widgetFormPassword", $.sweet.widgetFormInput,/** @lends Sweet.form.Password.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-password]",
        type: 'text',
        replacement: '%u25CF',
        // 密码框组件配置参数
        options: /** @lends Sweet.form.Password.prototype*/{
            /**
             * @description 延迟出现密码的时间（ms）
             * @type {Number}
             * @default 0
             */
            duration : 0
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
                formDiv2El = me.formDiv2El = $("<div>").addClass(me.defaultPaddingDivClass)
                    .addClass(passwordClass)
                    .appendTo(formDiv1El),
                value = $.nullToString(options.value.value);

            // 如果延迟时间为0,使用原生密码控件
            var type = me.options.duration === 0 ? "password" : "text";
            formElement.attr("type", type).addClass(me.defaultInputClass).val(value);
            formElement.appendTo(formDiv2El);

            me.value = [];
        },
        /**
         * @private
         * @description 组件创建后，添加其他功能：添加延时
         */
        _afterCreateFormWidget: function() {
            var me = this;
            me.__afterCreateFormWidget();
        },
        /**
         * @private
         * @description 组件创建后动作，子类继承实现
         */
        __afterCreateFormWidget: function(){
            var me = this;
            if (me.options.duration > 0) {
                me.formElement.keyup({"me": me}, me._onKeyDown);
            }
            me.formElement.bind("paste", {"me": me, "obj": me.formElement}, me._onPaste);
        },
        /**
         * @private
         * @description 延时出现密码
         * @param {Object} event 事件
         */
        _onKeyDown: function(event){
            var me = event.data.me,
                options = me.options,
                value = me.formElement.val(),
                lenVal = value.length,
                lenArr = me.value.length,
                pos = $.cursor.getSelection(me.formElement[0]),
                ch = value[pos.start-1] || "",
                key = event.charCode || event.keyCode,
                index = pos.start,
                deleteNum = 0;
            //删除键
            if(key === 46 || key === 8 ) {
                if(lenArr - lenVal >= 1) {
                    deleteNum = lenArr - lenVal;
                }
                if(me.value[index]) {
                    me.value.splice(index, deleteNum);
                    me.value.length = lenArr - deleteNum;
                }
                return;
            }
            //字符
            if(ch && ch !== unescape(me.replacement)) {
                if(lenArr + 1 > lenVal) {
                    deleteNum = lenArr - lenVal + 1;
                }
                me.value.splice(pos.start-1,deleteNum,ch);
                me.value.length = lenArr - deleteNum + 1;
                if(lenVal >= 2 && unescape(me.replacement) !== value[lenVal-2]) {
                    clearTimeout(me.timer);
                    me._convertLastChar(me, pos.start-1, ch, false);
                }
                var convertLastChar = function() {
                    me._convertLastChar(me, pos.start-1, ch, true);
                };
                me.timer = setTimeout(convertLastChar, options.duration);
                return;
            }
        },
        /**
         * @private
         * @description 粘贴事件
         * @param {Object} event 事件
         */
        _onPaste : function(event) {
            //不支持粘贴
            event.preventDefault();
        },
        /**
         * @private
         * @description 转换为密码
         * @param {Object} me 该组件对象
         * @param {Number} charPos 当前字符的位置
         * @param {String} ch 当前字符
         * @param {Boolean} isFormTimer 是否为定时
         */
        _convertLastChar: function(me, charPos, ch, isFormTimer) {
            if (me.formElement.val() === '') {
                return;
            }
            var tmp = '', lenVal = me.formElement.val().length;
            if(lenVal === 1) {
                me.formElement.val(unescape(me.replacement));
                return;
            }

            for (var i = 0; i < lenVal-1; i++) {
                tmp = tmp + unescape(me.replacement);
            }
            ch = (isFormTimer ? unescape(me.replacement) : ch);
            tmp = tmp.slice(0, charPos) + ch + tmp.slice(charPos);
            me.formElement.val(tmp);
        },
        /**
         * @private
         * @description 获取密码
         * @return {String} 密码
         */
         _getValue: function() {
            var me = this,
                options = me.options,
                value = "";

            // 如果使用的原生密码控件，直接返回结果
            if (options.duration === 0) {
                value = me.formElement.val();
                return {text: value, value: value};
            }

            for (var i = 0; i < me.value.length; i++) {
                value = value + me.value[i];
            }
            // 若手动输入内容
            if(!options.value || value !== options.value.text) {
                options.value = {text: value, value: value};
            }

            return $.objClone(options.value);
         },

         /**
         * @private
         * @description 设置密码
         * @param {Object} value 设置数值，格式为{value: 值, text: 文本}
         */
         _setValue: function(value) {
            var me = this,
                options = me.options,
                inputText,
                temp = "";

            inputText = me._textCmpSetValue(value);

            // 如果使用的原生密码控件，不需要转换文本
            if (options.duration === 0) {
                me.formElement.val(inputText);
                return;
            }

            if ($.isNull(inputText)) {
                me.formElement.val(temp);
                options.value = {value: "", text: ""};
                return;
            }
            
            me.value = [];
            for (var i = 0; i < inputText.length; i++) {
                me.value[i] = inputText[i];
                temp = temp + unescape(me.replacement);
            }
            me.formElement.val(temp);
         }
    });

    /**
     * 密码框
     * @name Sweet.form.Password
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
     * sweetPassword = new Sweet.form.Password({
     *      label : true,
     *      width : 200,
     *      height : 25,
     *      labelText : 'Password',
     *      required : true,
     *      renderTo : "sweet-text"
     * });
     * </pre>
     */
    Sweet.form.Password = $.sweet.widgetFormPassword;

}(jQuery));

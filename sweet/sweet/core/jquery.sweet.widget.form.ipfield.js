/**
 * @fileOverview  
 * <pre>
 * form组件--ip文本框
 * 2012.2.19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    //var disabledInputMethodClass = "sweet-form-input-method-disabled";
    var ipFieldClass = "sweet-form-ipfield";

    $.widget("sweet.widgetFormIpfield", $.sweet.widgetFormInput, /** @lends Sweet.form.IPField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-ipfield]",
        type: 'text',
        eventNames: /** @lends Sweet.form.IPField.prototype*/{
            /**
             * @event
             * @description 值改变的事件
             */
            change: "改变值事件"
        },
        // 数值组件默认字符集
        baseChars: /^((?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
        /** 
         * @private
         * @description 组件公共配置参数
         * @type object  
         */
        options: /** @lends Sweet.form.IPField.prototype*/{
            /**
             * @description 显示错误提示的内容
             * @type String
             * @default null
             */
            tooltip: Sweet.core.i18n.tip.IP_TIP_TITLE
        },
        /**
         * @private
         * @description组件重绘
         */
        _doLayout: function() {
            this._super();
       },
        /**
         * @private
         * @description 注册事件
         */
        _addListener: function() {
            var me = this,
                    options = me.options;
            $.each(me.handlers, function(eventName, func) {
                if (eventName === "change") {
                    //监听
                    $(document).bind("click", function() {
                        var val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                                me.inputElement3.val() + "." + me.inputElement4.val();
                        if (me.oldValue !== val && func) {
                            func.call(this, me.getValue());
                        }
                    });
                }
            });
        },
        /**
         * @private
         * @description 创建文本输入域
         */
        _createInputField: function() {
            var me = this,
                    inputArr = me.inputArr = [],
                    formElement = me.formElement = $("<input>"),
                    formDiv2Class = "sweet-form-ipfield-formDiv2",
                    formDiv1El = me.formDiv1El,
                    formDiv2El = me.formDiv2El = $("<div>"),
                    inputElement1 = me.inputElement1 = $("<input>").attr("type", me.type)
                    .keydown({"me": me, "inputIndex": 0}, me._onKeyDown),
                    inputElement2 = me.inputElement2 = $("<input>").attr("type", me.type)
                    .keydown({"me": me, "inputIndex": 1}, me._onKeyDown),
                    inputElement3 = me.inputElement3 = $("<input>").attr("type", me.type)
                    .keydown({"me": me, "inputIndex": 2}, me._onKeyDown),
                    inputElement4 = me.inputElement4 = $("<input>").attr("type", me.type)
                    .keydown({"me": me, "inputIndex": 3}, me._onKeyDown);

            formDiv2El.addClass(me.defaultPaddingDivClass)
                    .addClass(ipFieldClass)
                    .appendTo(formDiv1El);

            inputElement1.appendTo(formDiv2El);
            formDiv2El.append(".");
            inputElement2.appendTo(formDiv2El);
            formDiv2El.append(".");
            inputElement3.appendTo(formDiv2El);
            formDiv2El.append(".");
            inputElement4.appendTo(formDiv2El);
            inputArr[0] = (inputElement1);
            inputArr[1] = (inputElement2);
            inputArr[2] = (inputElement3);
            inputArr[3] = (inputElement4);
        },
        /**
         * @private
         * @description 绑定获取焦点事件
         */
        _focus: function() {
            var me = this;
            me.inputElement1.focus(function() {
                var val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                        me.inputElement3.val() + "." + me.inputElement4.val();
                me.oldValue = val;
            });
            me.inputElement2.focus(function() {
                var val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                        me.inputElement3.val() + "." + me.inputElement4.val();
                me.oldValue = val;
            });
            me.inputElement3.focus(function() {
                var val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                        me.inputElement3.val() + "." + me.inputElement4.val();
                me.oldValue = val;
            });
            me.inputElement4.focus(function() {
                var val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                        me.inputElement3.val() + "." + me.inputElement4.val();
                me.oldValue = val;
            });
        },
        /**
         * @description 显示提示框
         */
        showTip: function() {
            return;
        },
        /**
         * @description 关闭提示框
         */
        closeTip: function() {
            return;
        },
        /**
         * @description 设置组件只读
         * @param {Boolean} editable true/false
         */
        setEditable: function(editable) {
            this.inputElement1.attr("readOnly", !editable);
            this.inputElement2.attr("readOnly", !editable);
            this.inputElement3.attr("readOnly", !editable);
            this.inputElement4.attr("readOnly", !editable);
            return;
       },
        /**
         * @description 设置组件是否可用
         * @param {Boolean} disabled true可用 false不可用
         */
        setDisabled: function(disabled) {
            var me = this;
            if ("boolean" !== typeof disabled) {
                me._error("setDisabled() Input parameter is not a Boolean type!");
                return;
            }
            me.inputElement1.attr("disabled", disabled);
            me.inputElement2.attr("disabled", disabled);
            me.inputElement3.attr("disabled", disabled);
            me.inputElement4.attr("disabled", disabled);
            me.options.disabled = disabled;
            if (disabled) {
                if (!me.formDiv2El.hasClass(me.defaultPaddingDivClass)) {
                    return;
                }
                me.formDiv2El.removeClass(me.defaultPaddingDivClass).addClass(me.defaultPaddingDivDisabledClass);
            } else {
                if (!me.formDiv2El.hasClass(me.defaultPaddingDivDisabledClass)) {
                    return;
                }
                me.formDiv2El.removeClass(me.defaultPaddingDivDisabledClass).addClass(me.defaultPaddingDivClass);
            }
            //me._setDisabled(disabled);
       },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 设置数值，格式为{value: 值, text: 文本}
         */
        _setValue: function(value) {
            var me = this,
                    options = me.options,
                    inputText = me._textCmpSetValue(value),
                    charArr = inputText.split(".");

            if ($.isNull(inputText)) {
                options.value = {value: "", text: ""};
                return;
            }
            if (charArr.length === 4 &&
                    me._checkFormat(charArr[0]) &&
                    me._checkFormat(charArr[1]) &&
                    me._checkFormat(charArr[2]) &&
                    me._checkFormat(charArr[3])) {
                me.inputElement1.val(charArr[0]);
                me.inputElement2.val(charArr[1]);
                me.inputElement3.val(charArr[2]);
                me.inputElement4.val(charArr[3]);
            } else {
                this._error("Invalid IP address：" + inputText + ".");
                me.inputElement1.val("");
                me.inputElement2.val("");
                me.inputElement3.val("");
                me.inputElement4.val("");
                options.value = {value: "", text: ""};
            }
        },
        /**
         * @private 
         * @description 获取组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this,
                    options = me.options,
                    val = "";
            if (me.inputElement1.val() && me._checkFormat(me.inputElement1.val()) &&
                    me.inputElement2.val() && me._checkFormat(me.inputElement2.val()) &&
                    me.inputElement3.val() && me._checkFormat(me.inputElement3.val()) &&
                    me.inputElement4.val() && me._checkFormat(me.inputElement4.val())) {
                val = me.inputElement1.val() + "." + me.inputElement2.val() + "." +
                        me.inputElement3.val() + "." + me.inputElement4.val();
                // 若手动输入内容
                if (!options.value || val !== options.value.text) {
                    options.value = {text: val, value: val};
                }
                return $.objClone(options.value);
            }
            this._error("Invalid IP address：" + val + ".");
            return {value: "", text: ""};
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
            // 禁止粘贴
            me.__afterCreateFormWidget();
        },
        /**
         * @private
         * @description 给组件添加校验：包括数值型校验、最大最小值校验
         */
        _check: function() {
            var me = this;
        },
        /**
         * @private
         * @description 数值输入框，键盘按下时触发
         * @param {type} event 数值输入框对象
         */
        _onKeyDown: function(event) {
            var me = event.data.me,
                    index = event.data.inputIndex,
                    indexNext = index + 1,
                    indexLast = index - 1,
                    ch = String.fromCharCode($.e.getCharCode(event)),
                    txt = event.target.value,
                    val = txt + ch,
                    key = event.charCode || event.keyCode,
                    pos = $.cursor.getSelection(me.inputArr[index][0]);

            // 当前输入的字符是数字
            if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
                //小键盘上的数字键
                if (key >= 96 && key <= 105) {
                    ch = key - 96;
                    val = txt + ch;
                }
                // 文本框的数值超出范围
                if (!me._checkFormat(val)) {
                    event.preventDefault();
                    if (index < 3) {
                        setTimeout(function() {
                            me.inputArr[indexNext].focus();
                        }, 200);
                    }
                    return;
                }
                // 数值长度为3
                if (val.length === 3 && index < 3) {
                    setTimeout(function() {
                        me.inputArr[indexNext].focus();
                    }, 200);
                }
                return;
            } else if (13 === key) {
                //回车
                nextInputFocus();
            } else if (39 === key) {
                //right
                rightInputFocus();
            } else if (37 === key) {
                //left
                leftInputFocus();
            } else if (8 === key) {
                //backspace
                lastBackspace();
            } else if (46 === key) {
                //delete
                nextDelete();
            } else if (110 === key || 190 === key) {
                //小键盘的"."和主键盘的"."
                pointNextFocus();
            } else if (38 === key) {
                //up
                changNumber(1);
            } else if (40 === key) {
                //down
                changNumber(-1);
            } else if (8 === key) {
                //backspace
                event.preventDefault();
            } else {
                event.preventDefault();
                return;
            }

            // 下一个文本框获得焦点
            function nextInputFocus() {
                if (index > 2) {
                    return;
                }
                me.inputArr[indexNext].focus();
                return;
            }
            // right
            function rightInputFocus() {
                if (index > 2) {
                    return;
                }
                if (pos.start === txt.length) {
                    me.inputArr[indexNext].focus();
                    me.inputArr[indexNext][0].selectionStart = 0;
                    return;
                }
            }
            // left
            function leftInputFocus() {
                if (index < 1) {
                    return;
                }
                if (pos.end === 0) {
                    me.inputArr[indexLast].focus();
                    me.inputArr[indexLast][0].selectionStart = val.length;
                    return;
                }
            }
            // 向后删除
            function nextDelete() {
                if (index > 2) {
                    return;
                }
                if (!me.inputArr[index].val()) {
                    me.inputArr[indexNext].val("");
                    me.inputArr[indexNext].focus();
                    return;
                }
                return;
            }
            // 向前删除
            function lastBackspace() {
                if (index < 1) {
                    return;
                }
                if (!me.inputArr[index].val()) {
                    me.inputArr[indexLast].val("");
                    me.inputArr[indexLast].focus();
                    return;
                }
                return;
            }
            // 小数点
            function pointNextFocus() {
                if (index > 2) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                me.inputArr[indexNext].focus();
                return;
            }
            // 值变化
            function changNumber(step) {
                if (!txt) {
                    txt = 0;
                }
                if ($.number.isFloat(txt)) {
                    txt = parseFloat(txt);
                } else {
                    txt = parseInt(txt, 10);
                }
                if (me._checkFormat(txt + step)) {
                    me.inputArr[index].val(txt + step);
                    return;
                }
                if (256 === txt + step) {
                    me.inputArr[index].val(0);
                    return;
                }
                if (-1 === txt + step) {
                    me.inputArr[index].val(255);
                    return;
                }
            }
        },
        /**
         * @private
         * @description 格式校验
         * @param {Object} char 被验证的字符串
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _checkFormat: function(ch) {
            var me = this,
                    ip = new RegExp(me.allowdChars);
            if (ip.test(ch)) {
                me.closeTip();
                return true;
            } else {
                me.showTip();
                return false;
            }
        },
        /**
         * @private
         * @description 组件创建后动作，子类继承实现
         */
        __afterCreateFormWidget: function() {
            var me = this;
            me.inputElement1.bind("paste", {"me": me, "obj": me.inputElement1}, me._onPaste);
            me.inputElement2.bind("paste", {"me": me, "obj": me.inputElement2}, me._onPaste);
            me.inputElement3.bind("paste", {"me": me, "obj": me.inputElement3}, me._onPaste);
            me.inputElement4.bind("paste", {"me": me, "obj": me.inputElement4}, me._onPaste);
        },
        /**
         * @private
         * @description 粘贴事件
         */
        _onPaste: function(event) {
            var me = event.data.me,
                    obj = event.data.obj,
                    oldVal = obj.val();
            function checkFormat() {
                var val = obj.val();
                if ($.isNull(val)) {
                    return;
                }
                if (!me._checkFormat(val)) {
                    me._error("Invalid IP address：" + val + ".");
                    obj.val(oldVal);
                }

            }
            setTimeout(checkFormat, 10);
        }
    });

    /**
     * ip文本框
     * @name Sweet.form.IPField
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
     * var ipfield = new Sweet.form.IPField () 
     */
    Sweet.form.IPField = $.sweet.widgetFormIpfield;

}(jQuery));

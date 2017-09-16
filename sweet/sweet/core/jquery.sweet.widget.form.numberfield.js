/**
 * @fileOverview  
 * <pre>
 * form组件--数字文本框
 * 2012/12/19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    var disabledInputMethodClass = "sweet-form-input-method-disabled",
        numberFieldClass = 'sweet-form-numberfield';

    $.widget("sweet.widgetFormNumberfield", $.sweet.widgetFormTextfield,/** @lends Sweet.form.NumberField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-numberfield]",
        type: 'text',
        // 数值组件默认字符集
        baseChars: "0123456789",
        /** 
         * @private
         * @description form组件公共配置参数
         * @type object  
         */
        options: /** @lends Sweet.form.NumberField.prototype*/{
            /**
             * @description 是否允许小数
             * @type {Boolean}
             * @default false
             */
            allowDecimals: false,
            /**
             * @description 小数间隔符
             * @type {String}
             * @default “.”
             */
            decimalSeparator: ".",
            /**
             * @description 小数位数
             * @type {Number}
             * @default 2
             */
            decimalPrecision: 2,
            /**
             * @description 是否允许负数
             * @type {Boolean}
             * @default true
             */
            allowNegative: true,
            /**
             * @description 上限值
             * @type {Number}
             * @default 正无穷
             */
            maxValue: Number.POSITIVE_INFINITY,
            /**
             * @description 下限值
             * @type {Number}
             * @default 负无穷
             */
            minValue: Number.NEGATIVE_INFINITY
        },
        /**
         * @description 组件隐藏，覆盖父类方法触发mouseout事件，避免tips不消失
         */
        hide: function() {
            this.renderEl.hide();
            this.formElement.trigger("mouseout");
        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 设置数值，格式为{value: 值, text: 文本}
         */
        _setValue : function (value) {
            if ($.isNull(value)) {
                return;
            }
            var me = this, inputText;

            inputText = me._textCmpSetValue(value);
			//设置值时，如果有小数，一定要将decimalHasExsited设置为true，否则keypress时不能对保留小数进行限定
            me.decimalHasExsited = (String(inputText).indexOf(me.options.decimalSeparator) !== -1) ? true : false;
            if (me._checkRange(me, inputText)) {
                me.formElement.val($.number.fixPrecision(inputText, me.options.decimalPrecision));
            } else {
                me.formElement.val("");
            }
            me._checkAllFun(false);
        },
        
        /**
         * @private
         * @description 获取组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this,
                options = me.options,
                val = me.formElement.val();
            // 若手动输入内容
            if(options.value && (val === ("" + options.value.text))) {
                return $.objClone(options.value);
            }
            options.value = {text: val, value: val};
            return $.objClone(options.value);
        }, 
        
        /**
         * @private
         * @description 组件创建前，准备数值型文本框合法字符集
         */
        _beforeCreateFormWidget: function() {
            var me = this, options = me.options;
            me.allowdChars = me.baseChars;
            if (options.allowDecimals) {
                me.allowdChars += options.decimalSeparator;
            }
        },
        
        /**
         * @private
         * @description 组件创建后，添加其他功能：禁用输入法切换、禁止粘贴
         */
        _afterCreateFormWidget: function() {
            var me = this;
            // 组件标志
            me.formDiv2El.addClass(numberFieldClass);

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
            me.formElement.keypress({"me": me}, me._onKeyPress).blur({"me": me}, me._onBlur);
            // 解决谷歌下能输入中文的问题
            me.formElement.keydown({"me": me}, me._onKeyDown);
        },
        /**
         * @private
         * @description 数值输入框，键盘按下时触发
         * @param {type} event 数值输入框对象
         */
        _onKeyPress: function(event) {  // 退格键、回车键、其他功能键，不做处理
            if (Sweet.constants.keyCode.BACKSPACE === event.which || 
                    Sweet.constants.keyCode.ENTER === event.which || 
                    0 === event.which) {
                return;
            }
            var me = event.data.me,
                options = me.options,
                charRe,
                allowdChars1 = me.allowdChars,
                ch = String.fromCharCode($.e.getCharCode(event)),
                val = me.formElement.val(),
                len = val.length,
                pos = $.cursor.getSelection(me.formElement[0]);

            if(val.indexOf(options.decimalSeparator) === -1) {
                me.decimalHasExsited = false;
            }
            // 首字符不能为小数点、减号后不能跟小数点、小数点最多只能有一个
            if((val === "" || 
                    (len === 1 && val === "-") || 
                    0 === pos.start || 
                    (pos.start === 1 && "-" === val.charAt(0)) || 
                    len - pos.start > options.decimalPrecision || 
                    me.decimalHasExsited) && 
                    options.decimalSeparator === ch) {
                event.preventDefault();
                return;
            }
            // 小数点后保留的位数
            if(options.allowDecimals && me.decimalHasExsited) {
                var index = val.toString().indexOf(options.decimalSeparator);
                // 小数点后位数已经足够，则阻止小树点之后的输入
                if(len - index > options.decimalPrecision && pos.start > index) {
                    event.preventDefault();
                    return;
                }
            }
            if (val === "" && me.options.allowNegative) {
                allowdChars1 += "-";
            }
            if (val !== ""){
                var $t = $(me.formElement)[0];
                if (!$t.selectionStart && options.allowNegative) {
                    allowdChars1 += "-";
                }
            }
            charRe = new RegExp("[" + allowdChars1 + "]");        
            
            if (!charRe.test(ch)) {
                event.preventDefault();
                return;
            }
            // 存在小数点后，则打标记
            if(options.decimalSeparator === ch) {
                me.decimalHasExsited = true;
            }
        },

        /**
         * @private
         * @description 数值输入框，键盘按下时触发
         * @param {type} event 数值输入框对象
         */
        _onKeyDown: function(event) {
            var key = event.charCode || event.keyCode,
                sKeyCode = Sweet.constants.keyCode,
                evtCode = event.keyCode;

            // 退格键、回车键、删除键、上下左右方向键，不做处理
            if (sKeyCode.BACKSPACE === evtCode || sKeyCode.ENTER === evtCode ||
                sKeyCode.DELETE === evtCode || sKeyCode.LEFT === evtCode ||
                sKeyCode.RIGHT === evtCode || sKeyCode.DOWN === evtCode ||
                sKeyCode.UP === evtCode || sKeyCode.TAB === evtCode) {
                return;
            }
            if(key > 47 && key <58 || key >95 && key < 106 || // 数字键
                    190 === key || 110 === key || // 小数点
                    189 === key || 109 === key || 173 === key){ // 减号
                return;
            } else {
                event.preventDefault();
            }
        },
        
        /**
         * @private
         * @description 数值输入框，文本框失去焦点时触发
         * @param {Object} event 文本框事件对象
         */
        _onBlur : function (event) {
            var me = event.data.me,
                value = $.string.reviseNumber(me.formElement.val());
            
            // 2013.7.3修改文本框输入000.100的问题，单号DTS2013070403986 --start
            me.formElement.val(value);
            // 2013.7.3修改文本框输入000.100的问题，单号DTS2013070403986 --end
            
            function delayCheck() {
                me.validate();
                if (me.validate()) {
                    me._checkRange(me);
                }
            }
            setTimeout(delayCheck, 500);
        },
        
        /**
         * @private
         * @param {Object} me 数值框对象
         * @param {Number} val 将设置的数值
         * @returns {Boolean} true 校验通过，false 校验不通过
         */
        _checkRange : function (me, val) {
            var options = me.options,
                obj = me.formElement,
                value = val;
            if ($.isNull(value)) {
                me._info("Can not be empty!");
                return false;
            }
            if (!$.isNumeric(value)) {
                me._error("The input value is not a number!");
                // 2013.6.28修改问题：IE下报错微调器组件不可用
                if (me.rendered) {
                    obj.focus();
                }
                return false;
            }
            // 转换成数值型
            // 小数
            if (-1 !== value.toString().indexOf(options.decimalSeparator)) {
                value = parseFloat(value);
            } else {
                value = parseInt(value, 10);
            }
            return true;
        },
        
        /**
         * @private
         * @returns {Boolean} true 校验通过，false 校验不通过
         * @param {Object} justGetResult 只获取校验结果，不显示提示
         */
        _checkAllFun : function (justGetResult) {
            if(!this.formElement){
                return;
            }
            var me = this,
                options = me.options,
                val = me.formElement.val(),
                len = val.length;
            me.closeTip();
            if (me._super(justGetResult) === false){
                return false;
            }
            if (options.maxValue < parseFloat(val)) {
                me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                me.tipTitle = Sweet.core.i18n.tip.NUMBERFEILD_MAX_TIP + options.maxValue;
                options.errorModel = Sweet.constants.tipAttr.MODEL_NORMAL;
                me.showTip();
                return false;
            }
            if (options.minValue > parseFloat(val)) {
                me.tipType = Sweet.constants.tipAttr.TYPE_ERROR;
                me.tipTitle = Sweet.core.i18n.tip.NUMBERFEILD_MIN_TIP + options.minValue;
                options.errorModel = Sweet.constants.tipAttr.MODEL_NORMAL;
                me.showTip();
                return false;
            }
        },
        /**
         * @private
         * @description 设置上限值
         * @param {Number} value 设置数值
         */
        setMaxValue : function (value) {
            var me = this;
            me.options.maxValue = parseFloat(value);
            if (isNaN(me.options.maxValue)) {
                me.options.maxValue = Number.POSITIVE_INFINITY;
            }
            me._checkAllFun(false);
        },
        /**
         * @private
         * @description 设置下限值
         * @param {Number} value 设置数值
         */
        setMinValue : function (value) {
            var me = this;
            me.options.minValue = parseFloat(value);
            if (isNaN(me.options.minValue)) {
                me.options.maxValue = Number.NEGATIVE_INFINITY;
            }
            me._checkAllFun(false);
        },
        /**
         * @private
         * @description 组件创建后动作，子类继承实现
         */
        __afterCreateFormWidget: $.noop
    });

    /**
     * 数字文本框
     * @name Sweet.form.NumberField
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
     * sweetNumberField = new Sweet.form.NumberField({
     *     label : true,
     *     width : 250,
     *     labelText : "NumberField",
     *     maxValue : 100,
     *     minValue : 0,
     *     renderTo : "sweet-text",
     *     tooltip : "这是tip测试"
     * });
     * </pre>
     */
    Sweet.form.NumberField = $.sweet.widgetFormNumberfield;

}(jQuery));

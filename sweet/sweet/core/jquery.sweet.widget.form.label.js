/**
 * @fileOverview  
 * <pre>
 * label组件
 * 2012/12/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    // label标签默认样式
    var defaultWidgetClass = "sweet-form-label",
            //对齐方式
            align = Sweet.constants.align,
            alignClassObj = {};
    alignClassObj[align.CENTER] = "sweet-form-label-center";
    alignClassObj[align.RIGHT] = "sweet-form-label-right";

    $.widget("sweet.widgetFormLabel", $.sweet.widgetForm, /** @lends Sweet.form.Label.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-label]",
        defaultElement: "<label>",
        // form组件公共配置参数
        options: /** @lends Sweet.form.Label.prototype*/{
            /**
             * @description 组件内容对齐方式,可选值有三种：Sweet.constants.align.LEFT，Sweet.constants.align.CENTER，Sweet.constants.align.RIGHT
             * @type {String}
             * @default 默认左对齐
             */
            align: align.LEFT,
            /**
             * @description 标题文字后是否显示符号,暂只支持冒号
             * @type {Boolean}
             * @default false
             */
            symbol: false,
            /**
             * @description 组件值
             * @type {String/Number}
             * @default {text:"", value:"",data: null} text为标签文本值
             */
            value: {text: "", value: "", data: null},
            /**
             * @description 输入类组件高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 是否显示提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
			required : false,
            /**
             * @description 是否包含空白字符
             * @type {Boolean}
             * @default false
             */
            blank: false
        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} obj 格式为{value: 值, text: 文本, data: 值}
         */
        _setValue: function(obj) {
            if ($.isNull(obj)) {
                return;
            }
            //基类widget的setValue方法已将obj克隆给options.value
            var me = this,
                    options = me.options,
                    value = options.value,
                    text = $.isNull(value.text) ? "" : value.text;
            //设置标签文本
            me._setText(text);
        },
        /**
         * @private
         * @description 创建基本文本框对象
         */
        _createFormWidget: function() {
            var me = this;
            // 创建label标签
            me._createLabel();
        },
        /**
         * @private
         * @description 创建label标签
         */
        _createLabel: function() {
            var me = this,
                    options = me.options,
                    alignClass = alignClassObj[options.align] || "",
                    formParentEl = me.formParentEl =
                    $("<div class=" + "\'" + defaultWidgetClass + " " + alignClass + "\'" + ">").appendTo(me.formEl);

            me.formElement = $("<label>").appendTo(formParentEl);
            if($.isNotNull(options.vID)){
                me.formElement.attr("id", options.vID);
            }
            //子类实现, label元素插入前添加
            me._addBeforeLabel();
            //生成标签文字
            me._createLabelText();
            //子类实现, label元素插入后添加
            me._addAfterLabel();
        },
        /**
         * @private
         * @description 生成标签文字
         */
        _createLabelText: function() {
            var me = this,
                    options = me.options,
                    value = options.value,
                    text = $.isNotNull(value) && $.isNotNull(value.text) ? value.text : "";
            //配置空白符和符号
            me._setText = me._config();
            //设置标签文本
            me._setText(text);
        },
        /**
         * @private
         * @description 配置空白符和符号    
         * @return {function}  返回设置标签文本函数
         */
        _config: function() {
            var me = this,
                    options = me.options,
                    //将文字前添加隐藏的字符串" * "，生成空白符
                    front = options.blank ?
                    "<font class=\"sweet-form-label-required\"\n\
         color=\"red\" style=\"visibility:hidden\">&nbsp;*&nbsp;</font>" : "",
                    // 文字后追加符号处理
                    behind = options.symbol ? Sweet.constants.symbol.COLON : "";
					front = options.required && !options.blank ? "<font class=\"sweet-form-label-required\"\n\
         color=\"red\">&nbsp;*&nbsp;</font>" : front;
            return function(text) {
                var content = text;
                //label标签不解析html标签,因此将content转义，
                //由于front包含需要被解析的html标签因此用formElement调用html方法
                text = front + $.htmlEscape(content) + behind;
                me.formElement.html(text).val(content)
                        .attr("title", options.tip ? $.nullToString(content) : "");
            };
        },
        /**
         * @private
         * @description 刷新布局
         */
        _doLayout: function() {
            if (!this.rendered) {
                return;
            }
            this._super();
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            var me = this;
            //销毁tip提示
            me.formElement.trigger("mouseout");
            me._super();
        },
        /**
         * @private
         * @description 设置标签文本
         */
        _setText: $.noop,
        /**
         * @private
         * @description 子类实现, label元素插入前添加
         */
        _addBeforeLabel: $.noop,
        /**
         * @private
         * @description 子类实现, label元素插入后添加
         */
        _addAfterLabel: $.noop
    });
    /**
     * 创建Label
     * @name Sweet.form.Label
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
     *  sweetLabel = new Sweet.form.Label({
     *           align: Sweet.constants.align.Center,
     *           width : 100,
     *           height : 20,
     *           tip: true,
     *           value : {text:'User Name', value:'User Name',data: null},
     *           renderTo : "sweet-label"
     *       });
     * </pre>
     */
    Sweet.form.Label = $.sweet.widgetFormLabel;
}(jQuery));

/**
 * @fileOverview  
 * <pre>
 * form组件--标记条
 * 2013/4/3
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * 保存组件对象
     * 
     */
    var imgObj = {},
            type = Sweet.constants.imgType,
            listboxClass = "sweet-form-labelItem-listbox",
            newaddClass = "sweet-form-labelItem-listbox_newadd",
            formElClass = "sweet-form-labelItem-formEl",
            deleteImgClass = "sweet-form-labelItem-listbox-deleteImg";
    imgObj[type.INDEX] = "sweet-form-labelItem-table_ope_kpi_pic";
    imgObj[type.DIM] = "sweet-form-labelItem-table_ope_dim_pic";
    imgObj[type.CUSTOM_INDEX] = "sweet-form-labelItem-table_ope_userkpi_pic";
    $.widget("sweet.widgetFormLabelItem", $.sweet.widgetForm, /** @lends Sweet.form.LabelItem.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-labelItem]",
        type: "labelItem",
        eventNames: /** @lends Sweet.form.LabelItem.prototype*/{
            /**
             * @event
             * @description 删除事件,参数为两个(event, data)
             */
            close: "删除事件"
        },
        // 按钮类组件公共配置参数
        options: /** @lends Sweet.form.LabelItem.prototype*/{
            /**
             * @description 按钮高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 按钮宽度
             * @type {String/Number}
             * @default 70px
             */
            width: 70,
            /**
             * @description 图片类型 可选值：index 指标;dim 维度;customizedIndex 自定义指标
             * @type {String}  
             * @default "" 
             */
            imageType: "",
            /**
             * @description 图片位置 可选值：left 居左; right 居右
             * @type {String} 
             * @default ""
             */
            imagePos: "left",
            /**
             * @description 是否可关闭
             * @type {Boolean}
             * @default true
             */
            closable: true,
            /**
             * @description 是否显示提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * @description 组件值
             * @type {String/Number}
             * @default {value: "", text: "", data:null}
             */
            value: {value: "", text: "", data: null}
        },
        /**
         * @description 新建指标样式
         */
        addIndex: function() {
            var me = this,
                    formDiv2El = me.formDiv2El,
                    formerImageEl = me.formerImageEl,
                    indexClass = imgObj[type.INDEX];
            if (!formDiv2El.hasClass(newaddClass)) {
                formDiv2El.removeClass().addClass(newaddClass);
            }
            if (!formerImageEl.hasClass(indexClass)) {
                formerImageEl.removeClass().addClass(indexClass);
            }
        },
        /**
         * @description 设置labelItem是否显示提示
         * @param {Boolean} show
         */
        setTip: function(show) {
            var me = this,
                    options = me.options,
                    formElement = me.formElement;
            //show和tip值相等时则不需任何操作
            if (show ^ options.tip) {
                if (show) {
                    formElement.attr("title", options.value.text);
                    options.tip = true;
                } else {
                    // 先关闭提示，然后取消提示的内容
                    formElement.trigger("mouseout");
                    formElement.removeAttr("title");
                    options.tip = false;
                }
            }
        },
        /**
         * @private
         * @description 创建LabelItem组件总入口
         */
        _createFormWidget: function() {
            var me = this,
                    options = me.options,
                    value = $.nullToString(options.value),
                    text = (value && value.text) ? value.text : "",
                    imageType = imgObj[options.imageType] || "",
                    formDiv1El = me.formDiv1El = $("<div>").addClass(formElClass).appendTo(me.formEl),
                    formDiv2El = me.formDiv2El = $("<div>").addClass(listboxClass)
                    .css("text-align", imageType ? "left" : "center").appendTo(formDiv1El);

            me.formElement = $("<em>").html(text).val(text)
                    .attr("title", options.tip ? text : "").appendTo(formDiv2El);
            if($.isNotNull(options.vID)){
                me.formElement.attr("id", options.vID);
            }
            if (imageType) {
                me.formerImageEl = $("<span>").addClass(imageType)
                        .css("float", options.imagePos).appendTo(formDiv2El);
            }
            if (options.closable) {
                me.afterImageEl = $("<a>").bind("click", {"me": me}, me._clickDeleteImg)
                        .addClass(deleteImgClass).appendTo(me.formDiv2El);
            }
        },
        /**
         * @private
         * @description 删除图片的单击事件
         * @param {Object} event 按钮单击对象
         */
        _clickDeleteImg: function(event) {
            var me = event.data.me,
                    val = me._getValue();
            me._triggerHandler(event, "close", val);
            me._trigger("close", event, val);
            me.destroy();
        },
        /**
         * @description 给组件设置值
         * @private
         * @param {Object} obj 设置值，格式为{value: 值, text: 文本, data: Object}
         */
        _setValue: function(obj) {
            if ($.isNull(obj)) {
                return;
            }
            var me = this,
                    options = me.options,
                    text = $.isNull(obj.text) ? "" : obj.text;
            me.formElement.html(text).val(text).attr("title", options.tip ? text : "");
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            var me = this;           
            me.afterImageEl.unbind("click");
            //销毁tip提示
            me.formElement.trigger("mouseout");
        }
    });

    /**
     * LabelItem
     * @name Sweet.form.LabelItem
     * @class 
     * @extends Sweet.form
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.widget.form.js
     * </pre>
     * @example 
     * <pre>
     * sweetLabelItem = new Sweet.form.LabelItem({
     *      width : 130,
     *      imageType: "index",
     *      closable : true,
     *      tip: true,
     *      value : {value: 2, text: "指标1234567897894561230"},
     *      renderTo : "sweet-LabelItem"
     * });
     * </pre>
     */
    Sweet.form.LabelItem = $.sweet.widgetFormLabelItem;
}(jQuery));

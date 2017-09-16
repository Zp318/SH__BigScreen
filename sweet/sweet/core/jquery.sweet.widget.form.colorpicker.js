/**
 * @fileOverview
 * <pre>
 * 组件--颜色选择器
 * 2013.9.16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    var textButtonClass = "sweet-form-colorpicker-textButtonDiv",
        inputParentClass = "sweet-form-colorpicker-inputParent",
        normalClass = "sweet-form-colorpicker-normal",
        grayClass = "sweet-form-colorpicker-gray",
        imageButtonClass = "sweet-form-colorpicker-imageButton",
        inputElClass = "sweet-form-colorpicker-input",
        textGrayClass = "sweet-form-timeschedule-textGray",
        divPanelClass = "sweet-form-colorpicker-panel",
        divPanelULClass = "sweet-form-colorpicker-ul",
        divPanelLiClass = "sweet-form-colorpicker-li",
        cellClass = "sweet-form-colorpicker-cell";

    $.widget("sweet.widgetColorPicker", $.sweet.widgetFormInput, /** @lends Sweet.form.ColorPicker.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-colorpicker]",
        type: "colorpicker",
        defaultElement: "<div>",
        eventNames: /** @lends Sweet.form.ColorPicker.prototype*/{
            /**
             * @event
             * @description 改变值事件
             */
            change: "改变值事件"
        },
        // form组件公共配置参数
        options: /** @lends Sweet.form.ColorPicker.prototype*/{
            /**
             * @description colorPicker宽度
             * @type {String/Number}
             * @default 80px
             */
            width: 80,
            /**
             * @description colorPicker高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 是否可编辑
             * @type {Boolean}
             * @default false
             */
            editable: false,
            /**
             * @description 颜色值 {value: "#00c90d", text: "", data: ""}
             * @param {Object}
             * @default null
             */
            value: null,
            /**
             * @description 颜色值 {value: "#00c90d", text: "", data: ""}
             * @param {Object}
             * @default null
             */
            colorSource : [
                ["#00c90d","#369cd8","#1099a2","#cf7a37","#7c3ac1"],
                ["#90cc19","#60b2df","#38abb3","#f2a14e","#be53be"],
                ["#b7e042","#7ec8eb","#51c4cc","#ebb36e","#c870c8"],
                ["#c7ea69","#9ebecd","#6bd6dd","#debb91","#ce89ce"]
            ],
            /**
             * @description 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default "请选择..."
             */
            emptyText: Sweet.core.i18n.combobox.pleaseCheck
        },

        /**
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled :true:禁用, false:不禁用
         */
        _setDisabled: function(disabled) {
            var me = this;

            if(disabled) {
                if(me.formElement) {
                    me.formElement.addClass(textGrayClass);
                    me.formDiv2El.removeClass(normalClass).addClass(grayClass);
                    me.imageButton.removeClass(normalClass).addClass(grayClass).addClass(textGrayClass);
                    if($.isNotNull(me.options.value)){
                        me._setEmptyText(true);
                    }
                    else{
                        me._setEmptyText();
                    }
                }  
            }
            else {
                if(me.formElement) {
                    me.formElement.removeClass(textGrayClass);
                    me.formDiv2El.removeClass(grayClass).addClass(normalClass);
                    me.imageButton.removeClass(textGrayClass).removeClass(grayClass).addClass(normalClass);
                    if($.isNotNull(me.options.value)){
                        me._setEmptyText(true);
                    }
                    else{
                        me._setEmptyText();
                    }
                }
            }
        },
        /**
         * @private
         * @description 设置颜色值
         * @param {Object} data :{value: "", text: "", data:""}
         */
        _setValue: function(data) {
            if(!this.formElement) {
                return;
            }

            var me = this, oldRgb, newVal;
            oldRgb = me.formElement.css("background-color");

            me.oldValue = me._getHexColorValue(oldRgb);

            if($.isNotNull(data) && $.isNotNull(data.value)){
                if (me.oldValue !== data.value) {
                    newVal = data.value;
                    me.formElement.css({"background-color": newVal});
                    me.options.value = data;
                    // 触发change事件
                    me._triggerHandler(null, "change", me._getValue());
                    me.oldValue = newVal;
                }
                me._setEmptyText(true);
            }else{
                me.formElement.css("background-color", "");
                me._setEmptyText();
            }
        },

        /**
         * @private
         * @description 设置自定义的颜色值
         * @param [Object] rangeColor :  [
            ["","","","",""],
            ["","","","",""],
            ["","","","",""],
            ["","","","",""]
           ];
         * @param {Object} val : {"valueRangeColor":rangeColor}
         */
        setColorRange: function(data) {
            if(!this.formElement) {
                return;
            }
            
            var me = this;
            var line = {rows: 4, columns: 5};

            // 更改已经创建Cells的颜色值
            for (var row = 0; row < line.rows; row++) {
                // 寻找此行的列,为其更换颜色
                for (var col = 0; col < line.columns; col++) {
                   var idCellName = "#" + me.options.id + row + col;
                    $(idCellName).css({background: data.valueRangeColor[row][col]});
                }
            }
        },

        /**
         * @private
         * @description 获取颜色值
         * @return {Object}{value: "", text: "", data:""}
         */
        _getValue: function() {
            return this.options.value;
        },

        /**
         * @private
         * @description 关闭浮动面板
         */
        _closeFloatPanel: function() {
            var me = this;
            if(!me.openPanelElFlag && $.isVisiable( me.divPanelEl)) {
                me.divPanelEl.hide();
            }
            me.openPanelElFlag = false;
        },

        /**
         * @private
         * @description 创建form组件总入口
         */
        _createInputField: function() {
            var me = this;

            //创建颜色选择浮动面板
            me._createColorPickerPanel();

            //创建显示颜色文本框和选择颜色按钮
            me._createTextField();
        },

        /**
         * @private
         * @description 创建文本框和按钮
         */
        _createTextField: function() {
            var me = this,
                textButtonDiv = me.textButtonDiv = $("<div>").addClass(textButtonClass).appendTo(me.formDiv1El),
                formDiv2El = me.formDiv2El = $("<div>").addClass(inputParentClass).appendTo(textButtonDiv);

            me.formElement = $("<input>").addClass(inputElClass).appendTo(formDiv2El);
            if($.isNotNull(me.options.vID)){
                me.formElement.attr("id", me.options.vID);
            }
            me.imageButton = $("<span>").text("···").addClass(imageButtonClass).appendTo(textButtonDiv);
        },

        /**
         * @private
         * @description 创建颜色选择浮动面板
         */
        _createColorPickerPanel: function() {
            var me = this,
                ulEl, liEl, cellEl,
                line = {rows: 4, columns: 5},
                divPanelEl = me.divPanelEl = $("<div>").addClass(divPanelClass + " " + me.floatBgClass).hide()
                    .appendTo("body");

            // 创建Cells
            for (var row = 0; row < line.rows; row++) {
                // 添加一行
                ulEl = $("<ul></ul>").addClass(divPanelULClass).appendTo(divPanelEl);
                // 添加此行的列
                for (var col = 0; col < line.columns; col++) {
                    var idCellName =  me.options.id + row + col;
                    liEl = $("<li>").addClass(divPanelLiClass).appendTo(ulEl);
                    cellEl = $("<div>").addClass(cellClass).attr('id', idCellName).appendTo(liEl);
                    cellEl.css({background: me.options.colorSource[row][col]});
                }
            }

            // 绑定事件
            me.divPanelEl.bind("click", function (event) {
                if($.isVisiable(me.divPanelEl)){
                    event.stopImmediatePropagation();
                }
                if ($(event.target).hasClass(cellClass)) {
                    me._onCellClick(event);
                }
            });
        },

        /**
         * @private
         * @description 鼠标在单元格上点击时，更新颜色选择
         * @param event
         */
        _onCellClick: function (event) {
            var me = this,
                val = me.options.value,
                item, itemRgbVal,itemVal;

            item = $(event.target)[0];
            itemRgbVal = item.style.backgroundColor;
            itemVal = me._getHexColorValue(itemRgbVal);

            // 更新value
            if($.isNotNull(val)){
                if($.isNotNull(val.data)){
                    me.options.value = {"value":itemVal,"text":val.text,"data":val.data};
                }
                else{
                    me.options.value = {"value":itemVal,"text":val.text};
                }
            }
            else{
                me.options.value = {"value":itemVal,"text":""};
            }

            me._setValue(me.options.value);
            me._setEmptyText(true);
            me._closeFloatPanel();
        },

        /**
         * @private
         * @description 鼠标在单元格上点击时，更新选择信息
         * @param {String} data : 形如："rgb(158, 190, 205)"
         * @returns {String}16进制颜色表示
         */
        _getHexColorValue: function (data) {
            var me = this,
                str = data.split(","),
                redStr = str[0].split("("),
                redHex = redStr[1],
                greenHex = str[1],
                blueHex = str[2],
                result = "";

            result = "#" + $.number.toHex(redHex) + $.number.toHex(greenHex) + $.number.toHex(blueHex);
            return result;
        },

        /**
         * @private
         * @description 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget : function() {
            var me = this,
                left, top,
                options = me.options;

            me.setEditable(options.editable);
            me.setDisabled(options.disabled);
            if(me.imageButton) {
                me.imageButton.bind("click", function(event){
                    if(me.imageButton.hasClass(grayClass)) {
                        return;
                    }

                    if (me.divPanelEl && $.isVisiable(me.divPanelEl)) {
                        return;
                    }
                    me.openPanelElFlag = true;

                    // 计算位置
                    left = $.getFloatOffset(me.formDiv1El, me.divPanelEl, true).left;
                    top = $.getFloatOffset(me.formDiv2El, me.divPanelEl).top;
                    me.divPanelEl.css({"left": left, "display":"block"}).css("top", top - 1);
                });
            }
        },

        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            var me = this;

            me._super();

            me.divPanelEl ? me.divPanelEl.remove() : "";
            me.divPanelEl ? me.divPanelEl.unbind() : "";
            me.imageButton ? me.imageButton.unbind() : "";
        }
    });

    /**
     * 颜色选择器
     * @name Sweet.form.ColorPicker
     * @class
     * @extends Sweet.form.Input
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * var sweetColorPicker = Sweet.form.ColorPicker({
     *     width: 120
     * });
     * sweetcolorPicker.addListener("change", function(event, val){
     *     $.log("color changed!!!");
     * });
     */
    Sweet.form.ColorPicker = $.sweet.widgetColorPicker;
}(jQuery));

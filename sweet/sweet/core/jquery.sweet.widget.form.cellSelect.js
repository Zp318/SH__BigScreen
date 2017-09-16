/**
 * @fileOverview
 * <pre>
 * CellSelect组件
 * 2013/7/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    "use strict";

    // 样式定义
    var widgetClass = "sweet-form-cell-select",
        cellClass = "sweet-form-cs-cell",
        cellUsedClass = "sweet-form-cs-used",
        cellOldClass = "sweet-form-cs-old",
        cellRmvClass = "sweet-form-cs-rmv",
        cellNewClass = "sweet-form-cs-new",
        cellSelectingClass = "sweet-form-cs-selecting";

    $.widget("sweet.widgetFormCellSelect", $.sweet.widgetForm, /** @lends Sweet.form.CellSelect.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-cellselect]",
        defaultElement: "<div>",
        eventNames: /** @lends Sweet.form.CellSelect.prototype*/{
            /**
             * @event
             * @description 改变值事件
             */
            change: "改变值事件"
        },
        // 组件公共配置参数
        options: /** @lends Sweet.form.CellSelect.prototype*/{
            /**
             * @description 组件值, {text: "", value: {rows:x, cols:y}, data: null}
             * @type {Object}
             * @default null
             */
            value: null,
            /**
             * @description 组件宽度
             * @type {String/Number}
             * @default 100%
             */
            width: "100%",
            /**
             * @description 组件高度
             * @type {String/Number}
             * @default 100%
             */
            height: "100%",
            /**
             * @description 可选择行数
             * @type {Number}
             * @default 4
             */
            rows: 4,
            /**
             * @description 可选择列数
             * @type {Number}
             * @default 5
             */
            columns: 5,
            /**
             * @description 单元格间距
             * @type {Number}
             * @default 3
             */
            padding: 3
        },
        /**
         * @private
         * @description 设置组件描述
         * @param {Object} value 组件值
         */
        _setValue: function (value) {
            var item,
                me = this,
                info;

            if ($.isNull(value)) {
                return;
            }

            // 记录值
            me.options.value = value;

            // 更新状态
            me.formElement.find("." + cellClass).each(function (index, el) {
                item = $(el);
                info = me._getCellInfo(item);

                // 清理样式
                item.removeClass(cellNewClass).removeClass(cellRmvClass);

                // 如果在范围内，设置选择区域样式
                if (info.row < value.value.rows && info.col < value.value.columns) {
                    item.addClass(cellOldClass);
                }
                // 否则，清除原来显示的已设置值
                else {
                    item.removeClass(cellOldClass);
                }
            });

            // 触发事件
            me._onValueChange();
        },
        /**
         * @private
         * @description 设置组件值
         * @return Object 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function () {
            return this.options.value;
        },
        /**
         * @description 获取单元格的信息
         * @private
         */
        _getCellInfo: function (cell, col) {
            var item;

            if (typeof col === 'undefined') {
                item = $(cell);
            }
            else {
                item = this.formElement.find(".row-" + cell + " .col-" + col);
            }

            return {
                row: parseInt(item.attr("_row"), 10),
                col: parseInt(item.attr("_col"), 10),
                old: item.hasClass(cellOldClass),
                "new": item.hasClass(cellNewClass),
                used: item.hasClass(cellUsedClass)
            };
        },
        /**
         * @private
         * @description 创建基本文本框对象
         */
        _createFormWidget: function () {
            var width, height,
                ulEl, liEl, cellEl,
                value, me = this,
                opt = me.options;

            // 最外层的DIV
            me.formElement = $("<div>").addClass(widgetClass).appendTo(this.formEl);

            // 计算单元格的宽高
            width = Math.round(100 / opt.columns) + "%";
            height = Math.round(100 / opt.rows) + "%";

            // 缺省值
            value = opt.value ? opt.value.value : {rows: 0, columns: 0};

            // 创建Cells
            for (var row = 0; row < opt.rows; row++) {
                // 添加一行
                ulEl = $("<ul></ul>").height(height).appendTo(me.formElement);
                ulEl.addClass("row-" + row);

                // 添加此行的列
                for (var col = 0; col < opt.columns; col++) {
                    liEl = $("<li>").width(width).appendTo(ulEl);
                    cellEl = $("<div>").addClass(cellClass).appendTo(liEl);

                    // 记录额外的信息，便于后续处理
                    cellEl.addClass("row-" + row).addClass("col-" + col);
                    cellEl.attr("_row", row).attr("_col", col);

                    // 设置缺省值
                    if (row < value.rows && col < value.columns) {
                        cellEl.addClass(cellOldClass);
                    }
                }
            }

            // 绑定事件
            me.formElement.unbind()
                .bind("mousemove", function (event) {
                    if ($(event.target).hasClass(cellClass)) {
                        me._onCellHover(event);
                    }
                })
                .bind("click", function (event) {
                    if ($(event.target).hasClass(cellClass)) {
                        me._onCellClick(event);
                    }
                })
                .hover(null, function () {
                    me.formElement.find("." + cellClass).removeClass(cellSelectingClass);
                });
        },
        /**
         * @description 刷新布局
         * @private
         */
        _doLayout: function () {
            if (!this.rendered) {
                return;
            }

            this._super();
        },
        /**
         * @description 鼠标在单元格上悬停时，更新选择信息
         * @param event
         * @private
         */
        _onCellHover: function (event) {
            var cell = $(event.target),
                me = this,
                cellInfo = me._getCellInfo(cell),
                item, itemInfo;

            // 更新样式
            me.formElement.find("." + cellClass).each(function (index, el) {
                item = $(el);
                itemInfo = me._getCellInfo(item);

                // 如果在选择范围内，设置样式
                if (itemInfo.row <= cellInfo.row && itemInfo.col <= cellInfo.col) {
                    item.addClass(cellSelectingClass);
                }
                // 否则，清除样式
                else {
                    item.removeClass(cellSelectingClass);
                }
            });
        },
        /**
         * @description 鼠标在单元格上点击时，更新选择信息
         * @param event
         * @private
         */
        _onCellClick: function (event) {
            var cell = $(event.target),
                me = this,
                cellInfo = me._getCellInfo(cell),
                item, itemInfo;

            // 更新样式
            me.formElement.find("." + cellClass).each(function (index, el) {
                item = $(el);
                itemInfo = me._getCellInfo(item);

                // 如果在选择范围内，设置样式
                if (itemInfo.row <= cellInfo.row && itemInfo.col <= cellInfo.col && !item.hasClass(cellOldClass)) {
                    item.addClass(cellNewClass);
                }
                // 否则，清除样式
                else {
                    item.removeClass(cellNewClass);
                }

                // 如果在选择范围之外，并且是原value选择的，设置删除样式
                if ((itemInfo.row > cellInfo.row || itemInfo.col > cellInfo.col) && item.hasClass(cellOldClass)) {
                    item.addClass(cellRmvClass);
                }
                else {
                    item.removeClass(cellRmvClass);
                }
            });

            // 更新value
            me.options.value.value = {rows: cellInfo.row + 1, columns: cellInfo.col + 1};

            // 触发事件
            me._onValueChange();
        },

        /**
         * @description 选择值改变事件
         * @private
         */
        _onValueChange: function () {
            var me = this,
                value, oldValue, newValue;

            // 如果没有注册监听，直接返回
            if ($.isNull(me.handlers)) {
                return;
            }

            // 查找change事件的监听，并执行
            $.each(me.handlers, function(eventName, func) {
                if(eventName === "change"){
                    value = me._getValue();
                    newValue = value ? value.value : {};
                    oldValue = me.oldValue ? me.oldValue.value : {};

                    // 新旧值都是空，没有变化
                    if ($.isNull(newValue.rows) && $.isNull(oldValue.rows)) {
                        return;
                    }

                    // 新旧值不同，触发事件回调函数
                    if(oldValue.rows !== newValue.rows || oldValue.columns !== newValue.columns) {
                        if ($.isFunction(func)) {
                            func.call(this, null, value);
                        }
                        me.oldValue = $.objClone(value);
                    }
                }
            });
        }
    });

    /**
     * 创建CellSelect
     * @name Sweet.form.CellSelect
     * @class
     * @extends Sweet.form
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example
     * var sweetCS = new Sweet.form.CellSelect({
     *      width: "100%",
     *      height: "100%",
     *      value: {text: '', value: {rows: 2, columns: 2}, data: null},
     *      renderTo: "cells"
     * });
     * sweetCS.addListener("change", function(event, val){
     *      $.log("change happend!");
     * });
     * <pre>
     * </pre>
     */
    Sweet.form.CellSelect = $.sweet.widgetFormCellSelect;
}(jQuery));

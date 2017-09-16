/**
 * @fileOverview  
 * <pre>
 * 图--表格形图表
 * 2013/8/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 表格图例
 * @name Sweet.chart.GridLegend
 * @class 
 * @extends Sweet.chart
 * @requires <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.sweet.widget.js
 * jquery.sweet.widget.chart.js
 * </pre>
 */

(function($, undefined) {
    "use strict";

    var chartClass = "sweet-chart-gridlegend",
        titleClass = "title",
        markerClass = "marker",
        labelClass = "label",
        valueClass = "value";

    $.widget("sweet.widgetChartGridLegend", $.sweet.widgetChart, /** @lends Sweet.chart.GridLegend.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-chart-gridlegend]:",
        eventNames: {},
        options: /** @lends Sweet.chart.GridLegend.prototype*/{
            /**
             * 组件数据
             * @type Array
             * @default []
             */
            data: [],
            /**
             * 数据键。形如：[{value: xxx, text: xxx, unit: xxx},...]
             * @type Array
             * @default []
             */
            dataKeys: [],
            /**
             * 垂直对齐方式： top/middle/bottom
             * @type String
             * @default "top"
             */
            verticalAlign: "top",
            /**
             * 是否从颜色序列中跳跃选择颜色
             * @type Boolean
             * @default true
             */
            skipColor: true
        },
        /**
         * @description 设置组件值
         * @param {Object} data 数据
         */
        setData: function(data) {
            var me = this;
            me.options.data = data;
            me._createItems();
            me._doLayout();
        },
        /**
         * @parivate
         * @description 创建js对象
         */
        _createJsChart: function() {
            // chartEl
            // -> div
            //   -> ul
            //     -> li
            //       -> label(unit)
            //       -> [span, label, value]]
            this.legendEl = $("<div>").addClass(chartClass).appendTo(this.chartEl);
            this.listEl = $("<ul>").appendTo(this.legendEl);

            // 创建内容
            this._createItems();
        },
        /**
         * 创建列表项
         * @private
         */
        _createItems: function () {
            var data = this.options.data;
            var item, marker, label, value;
            var labelKey, valueKey, color;

            // check data
            if (data.length === 0 || this.options.dataKeys.length === 0) {
                return;
            }

            // clear
            this.listEl.empty();

            // title
            if (this.options.dataKeys[1].unit) {
                item = $("<li>").addClass(titleClass).appendTo(this.listEl);
                item.text(this.options.dataKeys[1].unit);
            }

            labelKey = this.options.dataKeys[0].value;
            valueKey = this.options.dataKeys[1].value;

            // data
            for (var i = 0; i < data.length; i++) {
                item = $("<li>").appendTo(this.listEl);
                marker = $("<span>").addClass(markerClass).appendTo(item);
                label = $("<span>").addClass(labelClass).appendTo(item);
                value = $("<span>").addClass(valueClass).appendTo(item);

                color = this._getColor(data.length, i, this.options.skipColor);
                marker.css("background-color", color);
                label.text(data[i][labelKey]).attr("title", data[i][labelKey]);
                value.text(data[i][valueKey]);
            }
        },
        /**
         * @private
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _doLayout: function() {
            var liEl, value, label, left, width, height, outerHeight;
            var me = this;

            if (!this.rendered || !this.listEl) {
                return;
            }

            // label宽度
            width = me.listEl.width();
            this.listEl.children().each(function (idx, li) {
                liEl = $(li);

                if (idx === 0) {
                    return;
                }

                label = liEl.children().eq(1);
                value = liEl.children().eq(2);
                left = left || label.position().left;

                label.width(width - left - value.width() - 5);
            });

            // 如果垂直居中，或下对齐，通过调整margin来实现
            if (this.options.verticalAlign === "middle") {
                height = this.listEl.height();
                outerHeight = this.legendEl.height();

                if (height < this.legendEl.height()) {
                    this.listEl.css("margin-top",  (outerHeight - height) / 2 + "px");
                }
                else {
                    this.listEl.css("margin-top",  0);
                }
            }
            else if (this.options.verticalAlign === "bottom") {
                height = this.listEl.height();
                outerHeight = this.legendEl.height();

                if (height < this.legendEl.height()) {
                    this.listEl.css("margin-top",  (outerHeight - height) + "px");
                }
                else {
                    this.listEl.css("margin-top",  0);
                }
            }
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            this.legendEl.remove();
            this._super();
        }
    });

    // 表格图表
    Sweet.chart.GridLegend = $.sweet.widgetChartGridLegend;
}(jQuery));

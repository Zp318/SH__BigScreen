/**
 * @fileOverview  
 * <pre>
 * 图--瓦片图例
 * 2013/8/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    "use strict";

    var chartClass = "sweet-chart-tiles",
        titleClass = "title",
        labelClass = "label",
        valueClass = "value",
        unitClass = "unit",
        topClass = "top",
        bottomClass = "bottom",
        cornerClass = "corner";

    $.widget("sweet.widgetChartTiles", $.sweet.widgetChart, /** @lends Sweet.chart.Tiles.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-chart-tiles]:",
        eventNames: {},
        options: /** @lends Sweet.chart.Tiles.prototype*/{
            /**
             * 标题
             * @type String
             * @default ""
             */
            title: "",
            /**
             * 组件数据
             * @type Object
             * @default {}
             */
            data: {},
            /**
             * 数据键,color是自定义颜色值(特别是超过9种颜色值时需要自己定义颜色值)。形如：[{value: xxx, text: xxx, unit: xxx, color:"#ededed"},...]
             * @type Array
             * @default []
             */
            dataKeys: [],
            /**
             * 垂直对齐方式： top/middle/bottom
             * @type String
             * @default "top"
             */
            verticalAlign: "middle",
            /**
             * 是否从颜色序列中跳跃选择颜色
             * @type Boolean
             * @default false
             */
            skipColor: false,
            /**
             * 最小字体
             * @type Number
             * @default 14
             */
            minFont: 14,
            /**
             * 最大字体
             * @type Number
             * @default 40
             */
            maxFont: 40
        },
        /**
         * @description 设置组件值
         */
        _updateData: function() {
            this._createItems();
            this._doLayout();
        },
        /**
         * 通过setData修改图的属性发生改变时调用
         * @private
         */
        _setChangeProperty: function () {
            this._createItems();
            this._doLayout();
        },
        _getCanvasObject : function(){
            var me = this,
                    i = 0,
                    id = me.options.id;
            //must rendered
            if(!me.rendered){
                return null;
            }
            var ulEl = me.chartEl.find("ul");
            if(ulEl.length <= 0){
                return null;
            }
            ulEl = $(ulEl[0]);
            var ulMarginTop = parseInt(ulEl.css("margin-top"));
            var h = me.chartEl.height(),
                    w = me.chartEl.width(),
                    ulH = ulEl.height(),
                    ulW = ulEl.width(),
                    canvH = ulH > h ? ulH : h,
                    canvW = ulW > w ? ulW : w;
            //返回的canvas对象
            var canvs = $("<canvas>").attr({
                width : canvW,
                height : canvH
            });
            canvs = canvs[0];
            var ctx = canvs.getContext("2d"),
                    liEls = ulEl.find("li"),
                    x = 8, y = ulMarginTop;
            for(i = 0; i < liEls.length; i++){
                var _t = $(liEls[i]),
                        _label = _t.find("." + labelClass),
                        _cornerEl = _t.find("." + cornerClass),
                        _cornerW = 20,//_cornerEl.width(),
                        _text = _label.text(),
                        _bgColor = _label.css("background-color"),
                        _textColor = _label.css("color"),
                        _width = _t.width(), _height = _t.height();
                ctx.save();
                //画背景
                ctx.fillStyle = ctx.strokeStyle = _bgColor;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + _width, y);
                ctx.lineTo(x + _width - _cornerW, y + _height);
                ctx.lineTo(x, y + _height);
                ctx.closePath();
                ctx.fill();
                //画文字内容
                ctx.fillStyle = ctx.strokeStyle = _textColor;
                ctx.font = "12px Tahoma";
                var _txtcalc = me._calcText(ctx, _text, "12px Tahoma", _width-_cornerW-x);
                ctx.fillText(_txtcalc, x+3, y+15);
                ctx.restore();
                y += _height + 8;
            }
            return canvs;
        },
		_calcText : function(ctx, txt, font, width){
            var suffix = "...",
                    hasModifyed = false,
                    result = txt;
            ctx.save();
            ctx.font = font;
            while(true){
                var w = ctx.measureText(result).width;
                if(w > width){
                    var index = Math.floor((width*result.length)/w);
                    result = result.substr(0, index);
                    hasModifyed = true;
                } else {
                    break;
                }
            }
            var afterCalcWidth = ctx.measureText(result).width;
            if(hasModifyed && afterCalcWidth < width){
                result += suffix;
            }
            ctx.restore();
            
            return result;
        },
        /**
         * @parivate
         * @description 创建js对象
         */
        _createJsChart: function() {
            // chartEl
            // -> div
            //   -> title
            //   -> ul
            //     -> li
            //       -> value + unit
            //       -> text
            this.tilesEl = $("<div>").addClass(chartClass).appendTo(this.chartEl);
            this.listEl = $("<ul></ul>").appendTo(this.tilesEl);

            // 创建内容
            this._createItems();
        },
        /**
         * 创建列表项
         * @private
         */
        _createItems: function () {
            var data = this.options.data;
            var dataKeys = this.options.dataKeys;
            var item, unit, label, value, corner, top, bottom;
            var colorCount, labelText, valueKey, unitText, color;

            // check data
            if ($.isNull(data) || dataKeys.length === 0) {
                return;
            }

            // clear
            this.listEl.empty();

            // decide colors serial
            colorCount = dataKeys.length;

            // data
            for (var i = 0; i < dataKeys.length; i++) {
                labelText = dataKeys[i].text;
                valueKey = dataKeys[i].value;
                


                // data item
                item = $("<li>").appendTo(this.listEl);
                bottom = $("<div>").addClass(bottomClass).appendTo(item);

                label = $("<span>").addClass(labelClass).appendTo(bottom);
                corner = $("<div>").addClass(cornerClass).appendTo(bottom);

                // text
                label.text(labelText).attr("title", labelText);

                // style
                if (colorCount > 0 && colorCount <= this.maxPacket-1) {
                    color = this._getColor(colorCount, i, this.options.skipColor);
                } else if(this.options.dataKeys[i].color){
                    color = this.options.dataKeys[i].color;
                }
                label.css("background-color", color);
                corner.css("border-top-color", color);
            }
        },
        /**
         * @private
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _doLayout: function() {
            var width, height, outerHeight, outerWidth, step;
            var me = this,
                font,
                ratio = 0.625,
                values,
                units,
                margin,
                minFont = this.options.minFont,
                maxFont = this.options.maxFont;

            if (!this.rendered || !this.listEl) {
                return;
            }

            function _getMaxWidth () {
                var m = 0, w, divEl;

                me.listEl.find("." + topClass).each(function (i, div) {
                    divEl = $(div);
                    w = divEl.children("." + valueClass).outerWidth() + divEl.children("." + unitClass).outerWidth();
                    if (w > m) {
                        m = w;
                    }
                });

                return m;
            }

            // 动态调整Value的字体大小

            outerWidth = this.tilesEl.width();
            outerHeight = this.tilesEl.height();
            height = this.listEl.height();
            




            // 如果垂直居中，或下对齐，通过调整margin来实现
            if (this.options.verticalAlign === "middle") {
                height = this.listEl.height();
                outerHeight = this.tilesEl.height();

                if (height < this.tilesEl.height()) {
                    this.listEl.css("margin-top",  (outerHeight - height) / 2 + "px");
                }
                else {
                    this.listEl.css("margin-top",  0);
                }
            }
            else if (this.options.verticalAlign === "bottom") {
                height = this.listEl.height();
                outerHeight = this.tilesEl.height();

                if (height < this.tilesEl.height()) {
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
            Sweet.Task.Delay.stop("sweet.chart.tiles.layout-" + this.options.id);
            this.tilesEl.remove();
            this._super();
        }
    });

    /**
     * 瓦片图例
     * @name Sweet.chart.Tiles
     * @class
     * @extends Sweet.chart
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.chart.js
     * </pre>
     */
    Sweet.chart.Tiles = $.sweet.widgetChartTiles;
}(jQuery));

/**
 * @fileOverview 饼图
 * @date 2013/03/17
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建饼图
 * @name Sweet.chart.CPie
 * @class 
 * @extends Sweet.chart
 * @requires 
 * <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.sweet.widget.js
 * jquery.sweet.widget.chart.js
 * </pre>
 * @example 
 * <pre>
 *  var data = [{"value":1, "text": "ONE"}, 
 *                  {"value":2, "text": "TWO"}, 
 *                  {"value":1, "text": "eww"}, 
 *                  {"value":1, "text": "Four"},
 *                  {"value":1, "text": "Five"},
 *                  {"value":1, "text": "Six"}];
 *  sweetTopo = new Sweet.chart.CPie({
 *      width : "100%",
 *      height : 600,
 *      data : data,
 *      renderTo : "sweet-cpie"
 * });
 * </pre>
 */
(function($, undefined) {
    var sweetPieDivClass = "sweet-pie-el";
    var tipsDivClass = "sweet-arrayindicator-infoDiv";
    var white = "#ffffff",
            black = "#000000";
    var noData = [{text: Sweet.core.i18n.chart.noDataTips}];
    /**
     * 饼图支持颜色集合
     */
    var pieColors = [["#369cd8"],
        ["#369cd8", "#b7e042"],
        ["#369cd8", "#b7e042", "#cf7a37"],
        ["#369cd8", "#b7e042", "#cf7a37", "#9a53e4"],
        ["#369cd8", "#63ccd3", "#b7e042", "#cf7a37", "#9a53e4"],
        ["#369cd8", "#63ccd3", "#b7e042", "#f2a14e", "#cf7a37", "#9a53e4"],
        ["#369cd8", "#63ccd3", "#b7e042", "#f2a14e", "#cf7a37", "#d07dd0", "#9a53e4"],
        ["#369cd8", "#60b2df", "#63ccd3", "#b7e042", "#f2a14e", "#cf7a37", "#d07dd0", "#9a53e4"],
        ["#369cd8", "#60b2df", "#63ccd3", "#b7e042", "#90cc19", "#f2a14e", "#cf7a37", "#d07dd0", "#9a53e4"],
        ["#369cd8", "#60b2df", "#63ccd3", "#b7e042", "#90cc19", "#f2a14e", "#cf7a37", "#cf4737", "#d07dd0", "#9a53e4"],
        ["#369cd8", "#60b2df", "#63ccd3", "#b7e042", "#90cc19", "#f2a14e", "#cf7a37", "#cf4737", "#d07dd0", "#9a53e4",
            "#a5a5a5"]];
    $.widget("sweet.widgetChartCPie", $.sweet.widgetChart, /** @lends Sweet.chart.CPie.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-chart-cpie]:",
        eventNames: /** @lends Sweet.chart.CPie.prototype*/{
            /**
             * @event
             * @description 饼图块单击事件
             * @param {Event} evt 事件对象
             * @param {Object} data 点击的节点的数据信息
             */
            click: "饼图块单击事件"
        },
        options: /** @lends Sweet.chart.CPie.prototype*/{
            /**
             * 组件数据, 默认要求数据格式为[{"text":one, "value":1, "data" : "用户自定义数据"},{"text":two, "value":2}]
             * @type Array
             * @default []
             */
            data: [],
            /**
             * 饼图组件数据key值，组件提供的接口是"text"和"value"，必须转换为此接口
             * @type Array
             * @default ['text', 'value']
             */
            dataKeys: ['text', 'value'],
            /**
             * 饼图中tips与饼之间的距离,设置为负值，表示tip在饼图中显示
             * @type number
             * @default 5
             */
            labelRadius: 5,
            /**
             * 是否显示图例,如果整个饼图宽度太小(小于最小半径的圆时，强制不显示图例)
             * @type boolean
             * @default true
             */
            isLegend: true,
            /**
             * 饼图的标题内容
             * @type string
             * @default ""
             */
            title: "",
            /**
             * 图例的位置，使用的值为"right","left"
             * @type string
             * @default "right"
             */
            position: "right",
            /**
             * 饼图上的文字，一般显示饼图的百分占比，如果不显示，设置为""
             * @type String
             * @default "[[percents]]%"
             */
            labelText: "[[percents]]%",
            /**
             * 饼图内圆的半径，如果设置此值，内圆的填充颜色为白色，即形成空心饼图
             * @type Number
             * @default 0
             */
            innerRadius: 0,
            /**
             * 如果百分比小于此数值，就不显示相应的label,UI规范的值为6
             * @type number
             * @default 6
             */
            hideLabelsPercent: 6,
            /**
             * 饼图的最小半径，默认为30px
             * @type Number
             * @default 3
             */
            minRadius: 30,
            /**
             * 图例的的纵向之间的距离
             * @type number
             * @default 8
             */
            verticalGap: 8,
            /**
             * 图例的大小，默认为15px
             * @type Number
             * @default 15
             */
            legendSize: 15,
            /**
             * 保留小数点后多少位小数,最多支持两位小数
             * @type number
             * @default 2
             */
            precision: 2,
            /**
             * 图例区域的宽度
             * @type number
             * @default 120
             */
            legendWidth: 120,
            /**
             * 每次点击饼图的一块时，其它点击过的都不显示在外面，即任何时候只有一块饼图pullout
             * @type boolean
             * @default true
             */
            pullOutOnlyOne: true,
            /**
             * 是否对传入的数据进行从大到小的排序，默认组件排序，如果用户自己排序，请设置此值为false
             * @type boolean
             * @default true
             */
            isSortForData: true,
            /**
             * 如果设置了innerRadius>0,需要在圆中显示内容时，可设置此属性为显示的内容,如果用户不设置此值，
             * 默认显示的是所有饼图的总和值, 如果设置为空，则什么都不显示
             * @type string
             * @default "sum"
             */
            innerText: "sum",
            /**
             * 图的图例是否可以点击，以隐藏或显示 相应图形
             * @type boolean
             * @default true
             */
            switchable: true,
            /**
             * 没数据时图的颜色
             * @type String
             * @default #A5A5A5
             */
            noDataColor: "#A5A5A5"
        },
        /**
         * @description 对饼图或环图重新设置数据，参数是对象类型，可重新设置任何的属性值
         * @param {Object} data 设置的数据值，是对象类型，可以更改其中的数据及其它的属性值
         */
        setData: function(data) {
            if (!data) {
                return;
            }
            var me = this;
            if ($.isPlainObject(data)) {
                for (var key in data) {
                    me.options[key] = $.objClone(data[key]);
                }
            }
            if (!me._ready()) {
                return;
            }
            me.items = [];
            me._readyDrawPie();
        },
        /**
         * @parivate
         * @description 创建js版饼图
         */
        _createJsChart: function() {
            var me = this,
                    opt = me.options,
                    pieId,
                    canvasEl,
                    maskCanvasEl,
                    w = opt.width,
                    h = opt.height;
            me.legendInfo = [];
            pieId = me.pieId = opt.id + "-pieEl";
            //定义一个div放canvas元素，可能还需要放其它的div元素，如果后来没有，可直接删除此div
            me.pieEl = $("<div>").attr("id", pieId).width(w).height(h)
                    .addClass(sweetPieDivClass)
                    .appendTo(me.chartEl);
            //创建canvas,放在父类定义的chartEl中
            canvasEl = me.canvasEl = $("<Canvas>").attr({id: pieId + "-canvas", width: w, height: h})
                    .appendTo(me.pieEl);
            maskCanvasEl = me.maskCanvasEl = $("<Canvas>").attr({id: pieId + "-canvas-mask", width: w, height: h});
            canvasEl.bind("click", {"me": me, "type": "click"}, me._fireEvent)
                    .bind("mousemove", {"me": me, "type": "mousemove"}, me._fireEvent)
                    .bind("mouseout", {"me": me, "type": "mouseout"}, me._fireEvent);
            me.context = canvasEl.get(0).getContext('2d');
            me.maskContext = maskCanvasEl.get(0).getContext('2d');
        },
        /**
         * @private
         * @description 饼图的点击事件处理
         * @param {Event} e 点击事件的事件对象
         * @param {Object} item 点击时的饼图块的信息
         * @param {boolean} clickLegend 点击的是否是饼图块
         */
        _onClick: function(e, item, clickLegend) {
            this._removeTipDiv();
            if (!item) {
                return;
            }
            var me = this,
                    opt = me.options,
                    switchable = opt.switchable,
                    innerR = me.options.innerRadius;
            //图例可点击且点击在图例上时，将根据点击的图例状态重新画图，将隐藏或返原点击的图块
            if (switchable && clickLegend) {
                if (item.show) {
                    item.show = false;
                } else {
                    item.show = true;
                }
            } else {
                //点击在饼图上或图例的文字上时，只出现提示并将相应图块或伸或缩
                if (item.pullout) {
                    item.pullout = false;
                    item.cx = me.x;
                    item.cy = me.y;
                } else {
                    if (me.options.pullOutOnlyOne) {
                        for (var i = 0; i < me.items.length; i++) {
                            me.items[i].pullout = false;
                            me.items[i].cx = me.x;
                            me.items[i].cy = me.y;
                        }
                    }
                    item.pullout = true;
                    var pullRadius = (me.radius - innerR) * 0.1;
                    var radin = (item.startAngle + item.endAngle) / 2;
                    item.cx = me.x + pullRadius * Math.cos(radin);
                    item.cy = me.y + pullRadius * Math.sin(radin);
                }
            }
            //重绘
            me._drawPie();
            //通过addListener注册的回调函数
            if ($.isFunction(me.options.click)) {
                me._trigger("click", e, item);
            }
            me._triggerHandler(e, "click", item);
        },
        _onMousemove: function(e, item) {
            var me = this;
            me._removeTipDiv();
            if (item && item.show) {
                var text = item.text + ": " + item.percents + "%" + "(" + item.value + ")";
                me._showTip(e, text, item.color);
            }
        },
        _fireEvent: function(e) {
            var me = e.data.me,
                    opt = me.options,
                    item,
                    clickLegend = false,
                    type = e.data.type,
                    offset;
            me.canvasEl.css("cursor", "default");
            offset = $.windowToCanvas(me.canvasEl.get(0), e.clientX, e.clientY);
            var scope = me._isScope(offset.x, offset.y, me.legendInfo);
            if (scope.isScope === "legend" || scope.isScope === "legendTxt") {
                if (opt.switchable && scope.isScope === "legend") {
                    clickLegend = true;
                    me.canvasEl.css("cursor", "pointer");
                }
                item = scope.node;
                if (item) {
                    var mx = item.cx + ((item.radius + me.options.innerRadius) / 2) * Math.cos(item.midAngle);
                    var my = item.cy + ((item.radius + me.options.innerRadius) / 2) * Math.sin(item.midAngle);
                    e.pageX = mx;
                    e.pageY = my + 10;
                }
            } else {
                item = me._getItemByPosition(offset.x, offset.y);
            }

            if (type === "click") {
                me._onClick(e, item, clickLegend);
            } else if (type === "mousemove") {
                me._onMousemove(e, item);
            } else {
                me._removeTipDiv();
            }
        },
        _isScope: function(cx, cy, nodes) {
            var temp, i = 0;
            //根据鼠标当前坐标是否在其相应的坐标范围内
            for (i = 0; i < nodes.length; i++) {
                temp = nodes[i];
                var legend = temp.legend;
                var lt = temp.lText;
                //如果移动到图例区域
                if (cx >= legend.left && cx <= legend.left + legend.width &&
                        cy >= legend.top && cy <= legend.top + legend.height) {
                    return {
                        isScope: "legend",
                        node: temp.item
                    };
                }
                //如果移动到图例的文字区域中
                if (cx >= lt.left && cx <= lt.left + lt.width &&
                        cy >= lt.top && cy <= lt.top + lt.height) {
                    return {
                        isScope: "legendTxt",
                        node: temp.item
                    };
                }
            }
            return {isScope: "none"};
        },
        _showTip: function(event, text, color) {
            var me = this,
                    text = text.split("\n").join("<br>"),
                    maxzindex = $.getMaxZIndex(undefined, tipsDivClass);
            me.tipDiv = $("<div>").addClass(tipsDivClass)
                    .css({
                "border": "2px solid " + color,
                "z-index": maxzindex,
                "max-width": me.chartEl.width() - 10
            }).appendTo("body");
            $("<div>").css({
                "word-wrap": "break-word",
                "word-break": "normal",
                "color": Sweet.constants.chart.titleCfg.labelColor,
                "margin": "5px 5px"
            }).html(text).appendTo(me.tipDiv);
            me.tipDiv.position({
                my: "center bottom-10", //left+5 bottom-10",
                of: event,
                collision: "flipfit",
                within: me.chartEl
            });
        },
        _removeTipDiv: function() {
            var me = this;
            if (!$.isNull(me.tipDiv)) {
                me.tipDiv.remove();
                me.tipDiv = null;
            }
        },
        _closeFloatPanel: function() {
            this._removeTipDiv();
        },
        _findRadiuByWidth: function(r, w) {
            var me = this,
                    calcWidth = 0;

            calcWidth = (r + me._MARGIN + me.xoffset + r * 0.2 + me.labelTextWidth) * 2 + me._LEGEND_WIDTH;
            if (calcWidth >= w - 5 && calcWidth <= w) {
                return r;
            } else {
                var temp = 0;
                if (calcWidth > w) {
                    temp = r + (w / 2 - r) / 2;
                } else {
                    temp = r + (w / 2 - r) / 2;
                }
                me._findRadiuByWidth(temp, w);
            }
        },
        _findRadiuByHeight: function(r, h) {
            var me = this,
                    calcHeight = 0;

            calcHeight = (r + me._MARGIN + me.xoffset + r * 0.2) * 2 + (me.titleHeight + me._MARGIN);
            if (calcHeight >= h - 5 && calcHeight <= h) {
                return r;
            } else {
                var temp = r + (h / 2 - r) / 2;
                me._findRadiuByHeight(temp, h);
            }
        },
        _ready: function() {
            var me = this,
                    ctx = me.context,
                    titleH = 0,
                    opt = me.options;

            me._MARGIN = 10;
            //此值为labelText的线的平行上的宽度
            me.xoffset = 5;
            me.labelTextWidth = 0;
            me.titleHeight = 0;
            me._LEGEND_WIDTH = opt.isLegend ? opt.legendWidth : 0;
            me.pageFont = "12px Tahoma";//微软雅黑";
            me.titleFont = "bold 15px Tahoma";//微软雅黑";//Tahoma";
            me.largeFont = "bold 24px Tahoma";//微软雅黑";
            var w = me.canvasWidth = me.pieEl.width();
            var h = me.canvasHeight = me.pieEl.height();
            me.canvasEl.attr({width: w, height: h});
            me.maskCanvasEl.attr({width: w, height: h});
            //这_LEGEND_WIDTH个px留给存放图例
            w = w - me._LEGEND_WIDTH - me._MARGIN * 2;
            //如果w还小于最半径的圆，则说明用户给的宽度或高度太小了
            if (w <= (opt.minRadius + me._MARGIN) * 2) {
                return false;
            }
            me.pieWidth = w;
            //如果有title，计算中心点时需要考虑title的高度和行数
            if (opt.title) {
                //title的字体加间隔的高度
                me.titleHeight = 20;
                //如果有用户定义的换行，进行换行的处理，如果没有，则自动进行换行处理
                var titleArr = opt.title.split("\n");
                var txt = {};
                if (titleArr.length === 1) {
                    txt = me._dealText(ctx, titleArr[0], me.titleFont, me.pieWidth);
                } else {
                    txt = {
                        rows: titleArr.length,
                        text: titleArr
                    };
                }
                me.titleText = txt;
                titleH = me.titleText.rows * me.titleHeight;
            }
            var labelLen = 0;
            //计算labelText时，所占用的最大宽度
            if (!$.isNull(opt.labelText)) {
                //用户设置的labelText伸出来的线长
                if (opt.labelRadius > 0) {
                    labelLen += opt.labelRadius;
                }
                ctx.save();
                ctx.font = me.pageFont;
                me.maxWidth = ctx.measureText("444.44%").width;
                ctx.restore();
                labelLen += me.maxWidth + me.xoffset;
            }
            var pulloutRadiu = 10;
            //计算半径
            if (w > h) {
                pulloutRadiu = (h / 2 - me._MARGIN * 2 - titleH) * 0.15;
                me.radius = h / 2 - me._MARGIN * 2 - titleH - pulloutRadiu;
            } else {
                pulloutRadiu = (w / 2 - labelLen) * 0.15;
                me.radius = w / 2 - labelLen - pulloutRadiu;
            }
            if (me.radius < opt.minRadius) {
                me.radius = opt.minRadius;
                pulloutRadiu = me.radius * 0.2;
            }
            //饼图的圆心坐标
            me.x = me._MARGIN + w / 2;
            me.y = h / 2;
            //如果有title，计算title的坐标值
            if (opt.title) {
                me.titleX = me.x;
                //20为文字自己的高度，me._MARGIN为title和边框之间的间距
                me.titleY = 20 + me._MARGIN;
            }
            //图例的起始坐标
            me.lgX = w + me._MARGIN;
            if (opt.position === "left") {
                me.lgX = me._MARGIN;
                me.x = me.x + me.lgX / 2 + me._LEGEND_WIDTH;
                if (opt.title) {
                    me.titleX = me.x;
                }
            }
            var tempLGy = me.y - (me.radius + me._MARGIN * 2);
            if (opt.data && opt.data.length > 0) {
                tempLGy = me.y - opt.data.length * (opt.legendSize + opt.verticalGap) / 2;
            }
            me.lgY = tempLGy;
            return true;
        },
        /**
         * @private
         * @description 随机生成颜色值，只有饼图大于11块时才调用此函数生成随机颜色值
         */
        _randomColor: function() {
            return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
        },
        _getMaskColor: function(index) {
            var hex;
            hex = (index + 1).toString(16);
            hex = "000000".substr(0, 6 - hex.length) + hex;
            return "#" + hex;
        },
        _getItemByPosition: function(x, y) {
            var me = this, imageData, pixel;
            var i, hex;
            var r, g, b;

            imageData = me.maskContext.getImageData(x - 1, y - 1, 1, 1);
            pixel = imageData.data;

            r = pixel[0].toString(16);
            if (r.length < 2) {
                r = "0" + r;
            }

            g = pixel[1].toString(16);
            if (g.length < 2) {
                g = "0" + g;
            }

            b = pixel[2].toString(16);
            if (b.length < 2) {
                b = "0" + b;
            }
            hex = "#" + r + g + b;

            for (i = 0; i < me.items.length; i++) {
                if (hex === me.items[i].maskColor) {
                    return me.items[i];
                }
            }

            return null;
        },
        /**
         * @private
         * @description 真正绘画饼图，主要分有数据和无数据的情况，最多11块饼图，大于11块颜色随机
         */
        _readyDrawPie: function() {
            var me = this,
                    opt = me.options,
                    temp,
                    i = 0,
                    valueField,
                    textField,
                    color,
                    data = opt.data,
                    len = data ? data.length : 0,
                    dataKeys = opt.dataKeys;

            me.valueField = valueField = $.isArray(dataKeys[1]) ? dataKeys[1][0] : dataKeys[1];
            me.textField = textField = dataKeys[0];
            me.sum = 0;
            me.items = [];
            me._dbPI = 2 * Math.PI;
            if ($.isArray(data) && len > 0) {
                // 如果不需要排序，用户自己传入的顺序为主，否则对传入数据由大到小进行排序
                if (opt.isSortForData) {
                    data.sort($.objSort(valueField, Sweet.constants.sortType.DESC));
                }

                //计算整个数据的和
                for (i = 0; i < len; i++) {
                    me.sum += Number(data[i][valueField]);
                }
                //数据之和为0或小于0时
                if (me.sum <= 0) {
                    me._drawNodataPie();
                    return;
                }

                var startValue = 0;
                //针对每个进行画饼
                for (i = 0; i < len; i++) {
                    temp = data[i];
                    //取color值
                    if ($.isNotNull(temp.color)) {
                        color = temp.color;
                    } else if (i <= 10) {
                        color = pieColors[len - 1][i];
                    } else {
                        color = me._randomColor();
                    }
                    var value = Number(temp[valueField]);
                    var item = {
                        index: i,
                        value: value,
                        text: temp[textField],
                        data: temp.data,
                        cx: me.x,
                        cy: me.y,
                        pullout: false,
                        show: true,
                        hideColor: "#AAB3B3",
                        percents: ((value / me.sum) * 100).toFixed(opt.precision > 2 ? 2 : opt.precision),
                        color: color,
                        radius: me.radius,
                        start: startValue,
                        end: value + startValue,
                        startAngle: -Math.PI / 2 + (startValue * me._dbPI) / me.sum,
                        endAngle: -Math.PI / 2 + ((value + startValue) * me._dbPI) / me.sum,
                        midAngle: -Math.PI / 2 + ((startValue + value / 2) * me._dbPI) / me.sum,
                        maskColor: me._getMaskColor(i + i * 1000)
                    };
                    me.items.push(item);
                    startValue += value;
                }

                me._drawPie();
            } else {
                //如果没有数据，画一个默认的黄色的圆，显示为无数据，无图例
                me._drawNodataPie();
            }
        },
        _dealItems: function() {
            var me = this,
                    opt = me.options,
                    items = me.items,
                    i = 0, temp,
                    len = items.length;
            //先计算总和
            me.sum = 0;
            for (i = 0; i < len; i++) {
                temp = items[i];
                //只对显示的图块计算总和
                if (temp.show) {
                    me.sum += Number(temp.value);
                }
            }

            //再对items中的角度等值进行重新计算
            var startValue = 0;
            for (i = 0; i < len; i++) {
                temp = items[i];
                var value = temp.value;
                //只对显示的块进行计算
                if (temp.show) {
                    me.items[i].percents = ((value / me.sum) * 100).toFixed(opt.precision > 2 ? 2 : opt.precision);
                    me.items[i].startAngle = -Math.PI / 2 + (startValue * me._dbPI) / me.sum;
                    me.items[i].endAngle = -Math.PI / 2 + ((value + startValue) * me._dbPI) / me.sum;
                    me.items[i].midAngle = -Math.PI / 2 + ((startValue + value / 2) * me._dbPI) / me.sum;
                    startValue += value;
                }
            }
        },
        _drawNodataPie: function() {
            var me = this,
                    radiu = me.radius,
                    //没有数据时饼图的颜色
                    color = me.options.noDataColor,
                    w = me.canvasWidth,
                    h = me.canvasHeight,
                    ctx = me.context,
                    maskCtx = me.maskContext;
            me.canvasEl.attr({width: w, height: h});
            me.maskCanvasEl.attr({width: w, height: h});
            //先添加title
            me.setTitle();
            me._drawRoundPie(ctx, color, radiu);
            me._drawRoundPie(maskCtx, color, radiu);
            me._text(noData[0].text, me.x, me.y, "center", white, me.titleFont, true);
        },
        _drawPie: function() {
            var me = this,
                    opt = me.options,
                    items = me.items,
                    i = 0,
                    w = me.canvasWidth,
                    h = me.canvasHeight,
                    ctx = me.context,
                    maskCtx = me.maskContext;

            me.canvasEl.attr({width: w, height: h});
            me.maskCanvasEl.attr({width: w, height: h});
            ctx.save();
            maskCtx.save();

            //先添加title
            me.setTitle();
            me.legendInfo = [];
            //重新计算sum,因为有可能隐藏或显示相应的饼图块,重新计算图块的角度等
            me._dealItems();
            for (i = 0; i < items.length; i++) {
                if (items[i].value <= 0) {
                    continue;
                }
                me._drawSlice(items[i], ctx, false);
                me._drawSlice(items[i], maskCtx, true);
                //画图例
                if (opt.isLegend) {
                    me._drawLegend(items[i], ctx, false);
                    me._drawLegend(items[i], maskCtx, true);
                }
            }

            //画饼图上的百分比
            if (!$.isNull(opt.labelText)) {
                for (i = 0; i < items.length; i++) {
                    if (items[i].value <= 0) {
                        continue;
                    }
                    me._drawText(items[i]);
                }
            }
            //如果配置innerRadius，为空心饼图
            if (opt.innerRadius > 0 && opt.innerRadius < me.radius) {
                var innerTxt = opt.innerText;
                if ($.isNull(opt.innerText)) {
                    innerTxt = "";
                } else if (opt.innerText === "sum") {
                    innerTxt = me.sum;
                }
                me._text(innerTxt, me.x, me.y, "center", Sweet.constants.chart.titleCfg.labelColor, me.largeFont, false, opt.innerRadius * 2 - 10);
            }
            ctx.restore();
            maskCtx.restore();
        },
        _text: function(text, x, y, textAlign, fillStyle, font, shadow, maxWidth) {
            var me = this,
                    font = font || me.pageFont,
                    shadow = shadow || false,
                    ctx = me.context;

            ctx.save();
            ctx.textAlign = textAlign;
            ctx.fillStyle = fillStyle;
            ctx.font = font;
            if (shadow) {
                ctx.shadowBlur = 3;
                ctx.shadowColor = black;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 3;
            }
            if (maxWidth) {
                ctx.fillText(text, x, y, maxWidth);
            } else {
                ctx.fillText(text, x, y);
            }
            ctx.restore();
        },
        _drawRoundPie: function(ctx, fillColor, radiu) {
            var me = this;
            ctx.save();
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = fillColor;
            ctx.beginPath();
            ctx.arc(me.x, me.y, radiu, 0, me._dbPI, true);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        },
        _drawSlice: function(item, ctx, mask) {
            var me = this,
                    color = mask ? item.maskColor : item.color,
                    startAngle = item.startAngle,
                    endAngle = item.endAngle,
                    radius = item.radius,
                    opt = me.options,
                    cx = item.cx,
                    cy = item.cy;
            if (!item.show) {
                return;
            }
            //计算起始弧度的坐标值
            var tox = cx + radius * Math.cos(startAngle);
            var toy = cy + radius * Math.sin(startAngle);

            //如果配置innerRadius，为空心饼图
            if (opt.innerRadius > 0 && opt.innerRadius < this.radius) {
                //画饼图的内圆的两个坐标
                var sirx = cx + opt.innerRadius * Math.cos(startAngle);
                var siry = cy + opt.innerRadius * Math.sin(startAngle);
                var eirx = cx + opt.innerRadius * Math.cos(endAngle);
                var eiry = cy + opt.innerRadius * Math.sin(endAngle);
                ctx.save();
                ctx.fillStyle = color;
                ctx.strokeStyle = white;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(sirx, siry);
                ctx.lineTo(tox, toy);
                ctx.arc(cx, cy, radius, startAngle, endAngle, false);
                ctx.lineTo(eirx, eiry);
                ctx.arc(cx, cy, opt.innerRadius, endAngle, startAngle, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            } else {
                //画饼图的块
                ctx.save();
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(tox, toy);
                ctx.arc(cx, cy, radius, startAngle, endAngle, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

        },
        _drawLegend: function(item, ctx, mask) {
            var me = this,
                    opt = me.options,
                    text = item.text,
                    index = item.index,
                    color = mask ? item.maskColor : (item.show ? item.color : item.hideColor),
                    legendSize = opt.legendSize,
                    maxTextWidth = 0,
                    labelColor = Sweet.constants.chart.titleCfg.labelColor,
                    tempText = text;

            var sx = me.lgX;
            var sy = me.lgY + index * (legendSize + opt.verticalGap);
            maxTextWidth = opt.legendWidth - legendSize * 3 / 2;
            //画图例
            ctx.save();
            ctx.lineJoin = "round";
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 0;
            ctx.beginPath();
            ctx.strokeRect(sx, sy, legendSize, legendSize);
            ctx.fillRect(sx, sy, legendSize, legendSize);
            ctx.restore();

            //图例只有show时才画switchable
            if (opt.switchable && item.show) {
                //定义"V"的4个点坐标
                var vArr = [], padding = 3;
                vArr.push({x: sx + padding, y: sy + padding});
                vArr.push({x: sx + legendSize / 2, y: sy + legendSize - padding});
                vArr.push({x: sx + legendSize - padding, y: sy + padding});
                vArr.push({x: sx + legendSize / 2, y: sy + legendSize / 2});
                ctx.save();
                ctx.strokeStyle = white;
                ctx.fillStyle = white;
                ctx.lineWidth = 0;
                ctx.beginPath();
                ctx.moveTo(vArr[0].x, vArr[0].y);
                ctx.lineTo(vArr[1].x, vArr[1].y);
                ctx.lineTo(vArr[2].x, vArr[2].y);
                ctx.lineTo(vArr[3].x, vArr[3].y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            ctx.save();
            ctx.fillStyle = item.show ? labelColor : item.hideColor;
            ctx.font = me.pageFont;
            var textWidth = ctx.measureText(text).width;
            if (textWidth > maxTextWidth) {
                var count = 1;
                while (true) {
                    tempText = String(text).substr(0, count) + "...";
                    var tw = me._measureTextWidth(tempText, ctx, me.pageFont, labelColor);
                    if (tw >= maxTextWidth) {
                        break;
                    }
                    count++;
                }
            }
            ctx.fillText(tempText, sx + legendSize * 3 / 2, sy + legendSize * 4 / 5, maxTextWidth);
            ctx.restore();
            //记录图例的信息，方便点击和移动到图例上时的事件使用
            var finnalWidth = me._measureTextWidth(tempText, ctx, me.pageFont, labelColor);
            me.legendInfo.push({
                legend: {
                    left: sx, top: sy, width: legendSize, height: legendSize
                },
                lText: {
                    left: sx + legendSize * 3 / 2, top: sy, width: finnalWidth, height: legendSize
                },
                item: item
            });
        },
        _measureTextWidth: function(text, ctx, font, fill) {
            var width = 0;
            ctx.save();
            ctx.fillStyle = fill;
            ctx.font = font;
            width = ctx.measureText(text).width;
            ctx.restore();
            return width;
        },
        _drawText: function(item) {
            var me = this,
                    opt = me.options,
                    hideLabelsPercent = opt.hideLabelsPercent,
                    radius = item.radius,
                    percentValue = item.percents,
                    ctx = me.context,
                    cx = item.cx,
                    cy = item.cy,
                    txtWidth = 0;
            if (!item.show) {
                return;
            }
            //画相关的饼图块的数据
            var labelRadiu = opt.labelRadius,
                    tangle = item.midAngle,
                    //开始点的坐标
                    sx = cx + radius * Math.cos(tangle),
                    sy = cy + radius * Math.sin(tangle),
                    //中间点的坐标
                    mx = cx + (radius + labelRadiu) * Math.cos(tangle),
                    my = cy + (radius + labelRadiu) * Math.sin(tangle);
            //百分率显示字体
            var tempTxt = percentValue + "%";
            //百分比文字的坐标
            var txtY = my + 5;
            var txtX = mx;
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle = Sweet.constants.chart.titleCfg.labelColor;
            ctx.font = me.pageFont;
            txtWidth = ctx.measureText(tempTxt).width;
            if (labelRadiu > 0 && percentValue >= hideLabelsPercent) {
                var xoffset = me.xoffset,
                        lastPointX = mx + (sx > cx ? xoffset : -xoffset);
                txtX = sx > cx ? lastPointX : lastPointX - txtWidth;
                ctx.save();
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(mx, my);
                ctx.lineTo(lastPointX, my);
                ctx.restore();
            } else {
                ctx.textAlign = "center";
            }
            if (percentValue >= hideLabelsPercent) {
                ctx.fillText(tempTxt, txtX, txtY, me.maxWidth);
            }
            ctx.stroke();
            ctx.restore();
        },
        _dealText: function(ctx, text, font, maxWidth) {
            var tw = 0, len = 0, rows = 1,
                    i = 0, rowTextNum = "",
                    arr = [], temp = "";
            ctx.save();
            ctx.font = font;
            tw = ctx.measureText(text).width;
            ctx.restore();
            //行数
            rows = Math.ceil(tw / maxWidth);
            //全文的字数
            len = text.length;
            //每一行平均多少个字
            rowTextNum = Math.ceil(len / rows);
            //截取成一行一行的数据
            for (i = 0; i < rows; i++) {
                temp = text.substr(i * rowTextNum, rowTextNum);
                arr.push(temp);
            }

            return {
                width: tw,
                rows: rows,
                text: arr
            };
        },
        /**
         * @private
         * @description 更新饼图的title 
         * @param {string} str title值
         */
        setTitle: function(str) {
            var me = this,
                    cc = Sweet.constants.chart,
                    ctx = me.context,
                    opt = me.options,
                    title = str ? str : opt.title;

            if (!$.isNull(title)) {
                if (!me.titleX || !me.titleY) {
                    if (!me._ready()) {
                        return;
                    }
                }

                var x = me.titleX;
                var y = me.titleY;
                for (var i = 0; i < me.titleText.text.length; i++) {
                    var temp = me.titleText.text[i];
                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.fillStyle = ctx.strokeStyle = cc.titleCfg.labelColor;
                    ctx.font = me.titleFont;
                    ctx.fillText(temp, x, y);
                    ctx.restore();
                    y = y + me.titleHeight;
                }
            }
        },
        /**
         * @parivate
         * @description 渲染饼图到相应的到div
         */
        _chartRender: function() {
            var me = this;
            if (me.rendered) {
                return;
            }
            //进行准备，例如设置margin,确定坐标等
            if (!me._ready()) {
                return;
            }
            //再设置数据，并根据数据进行画图
            me._readyDrawPie();
        },
        /**
         * @parivate
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _doLayout: function() {
            var me = this;
            if (!me.rendered) {
                return;
            }
            //进行准备，例如设置margin,确定坐标等
            if (!me._ready()) {
                return;
            }
            //再设置数据，并根据数据进行画图
            me._readyDrawPie();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            this.chartEl.externalWidth(width);
            this.pieEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            this.chartEl.externalHeight(height);
            this.pieEl.externalHeight(height);
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            this._super();
        }
    });

// 饼图组件
    Sweet.chart.CPie = $.sweet.widgetChartCPie;

}(jQuery));

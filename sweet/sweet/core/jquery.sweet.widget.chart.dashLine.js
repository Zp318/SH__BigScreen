/**
 * @fileOverview 折线图
 * @date 2013/02/20
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建dashboard专用的折线，柱图，堆积图，面积图等
 * @name Sweet.chart.DashLine
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
 <pre>
 *  var data = [{
 *               text: "1950-01-03 16:00",
 *               value: 150000000,
 *               value1: 560000000
 *           }, {
 *               text: "1951-01-03 17:00",
 *               value: 330000000,
 *               value1: 100000000
 *           }, {
 *               text: "1952-01-03 18:00",
 *               value: 250000000,
 *               value1: 550000000
 *           }];
 *  var reader = new Sweet.Reader.JsonReader();
 *           var store = new Sweet.Store({
 *               url : "../data/line.jsp",
 *               reader : reader
 *           });
 *           line = new Sweet.chart.DashLine({
 *               store : store,
 *				chartTitle : "Test Chart",
 *               height : "100%",
 *               width : "100%",
 *				xThresholdValue : "2013",
 *               yThresholdValue : "214500200",
 *				graphType : "line",
 *               stackType : "none",
 *               data: [],
 *				leftUnit : "times",
 *               rightUnit : "count",
 *               dataKeys: ["text", ["value", "Tuanjie11"], ["value1", "tesddjdkdk"]]});
 *           line.render("sweet-chart-line");
 *           store.load();
 * </pre>
 */
(function( $, undefined ) {

var fillGraphPath = Sweet.libPath + 'themes/default/core/images/chart/';
// 折线图配置数据
var lineConfData = {
    // 绘制图形描述信息
    graph : {
        bullet : "round",
        type : "line",
        lineThickness : 2
    },
    // 提示配置
	balloon : {
		adjustBorderColor : true,
		fillColor : "#ffffff",
		pointerWidth : 5,
		cornerRadius : 0
	},
    // cursor鼠标滑动时配置
    cursor : {
        cursorPosition : "mouse",
        corsorColor : "#777d8b",
        //这里使用渐变颜色
		categoryBalloonColor : ["#717581", "#454e5f"]
    },
    // legend图例配置
    legend : {
        position : "bottom",
        align : "center",
        markerType : "square"
    },
    // 阈值线配置
    guide : {
        lineColor : ["#f5c245", "#DA6263"],
        lineAlpha : 1,
        fillAlpha : 0.2,
        dashLength : 2,
        inside : true,
        labelRotation : 90
    },
    axisColor : "#777d8b",
	//只给柱状图和面积图使用有效
	stackType : ["regular", "100%", "3d", "none"],
    textureMap: {
        '#369CD8': fillGraphPath + 'texture_369CD8.png',
        "#60B2DF": fillGraphPath + 'texture_60B2DF.png',
        "#63CCD3": fillGraphPath + 'texture_63CCD3.png',
        "#B7E042": fillGraphPath + 'texture_B7E042.png',
        "#90CC19": fillGraphPath + 'texture_90CC19.png',
        "#F2A14E": fillGraphPath + 'texture_F2A14E.png',
        "#CF7A37": fillGraphPath + 'texture_CF7A37.png',
        "#CF4737": fillGraphPath + 'texture_CF4737.png',
        "#D07DD0": fillGraphPath + 'texture_D07DD0.png',
        "#9A53E4": fillGraphPath + 'texture_9A53E4.png',
        "#A5A5A5": fillGraphPath + 'texture_A5A5A5.png',
        "#777D8B": fillGraphPath + 'texture_777D8B.png',
        "#F77007": fillGraphPath + 'texture_F77007.png'
    },
    bar: {
        maxLeftMargin: 150
    }
};
var noData = [{text : Sweet.core.i18n.chart.noDataTips}];

    var chartClass = "sweet-chart-dashline",
        rangeTipClass = "sweet-chart-dashline-range-tip",
        arrowClass = "tip-arrow",
        labelClass = "tip-label";

$.widget( "sweet.widgetChartDashLine", $.sweet.widgetChart, /** @lends Sweet.chart.DashLine.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget_chart_dashLine]:",
    eventNames : /** @lends Sweet.chart.DashLine.prototype*/{
        /**
         * @event
         * @description 图上的节点或柱的单击事件，需要在数据中配置drillable属性：drillable=" "(值为空字符，不是没有)
         * @param {Event} evt 事件对象
         * @param {Object} data 点击的节点的数据信息
         */
        click: "图的单击事件"
    },
    maxPacket : 10,
    toolHeight : 25,
	options : /** @lends Sweet.chart.DashLine.prototype*/{
        /**
         * 是否显示鼠标滑过效果
         * @type boolean
         * @default true
         */
        isCursor : true,
        /**
         * 是否显示滚动效果
         * @type boolean
         * @default true
         */
        isScrollbar : true,
        /**
         * 是否显示图例
         * @type boolean
         * @default true
         */
        isLegend : true,
        /**
         * 设置category上的label的旋转角度，默认不旋转
         * @type number
         * @default 0
         */
        labelRotation : 0,
        /**
         * 图中值和key的实例，由于历史原因，现在是二维数组：["text",["value","NSC1","left","%","#ededed"],...]
         * 其中第一个"text"代表x轴的数据在data中对应的value；从第二个数组数据，才代表每个图的信息，其中包含与data中对应的
         * value和图的title,依次顺序代表为：图对应的value，图的名称，此图属于左轴还是右轴，单位，自定义颜色
         * @type Array
         * @default ["text"]  x轴的field
         */
        dataKeys : ["text"],
        /**
         * 图的类型
         * @type string
         * @default "line" 不设置此值，默认为折线图
         */
        graphType : Sweet.constants.graphType.LINE,
        /**
         * stack图的类型
         * @type string
         * @default undefined ,可使用的值不"regular", "100%", "3d", "none"
         */
        stackType : undefined,
        /**
         * 折线图的风格
         * @type number
         * @default 1  1表示节点显示为圆圈，2表示节点直接连接
         */
        style : 1,
        /**
         * 鼠标在图上移动时，图例位置是否出现数据提示
         * @type boolean
         * @default true  true表示带数据提示，默认值; false表示不带提示
         */
        legendTips : true,
        /**
         * 日期是否使用组件解析的形式
         * @type boolean
         * @default false  如果设置为true,在数据中x轴的数据必须为日期对象
         */
        parseDate : false,
        /**
         * x轴上日期显示的格式，只有parseDate设置为true时才有效
         * @type string
         * @default "hh"  默认为"hh"表示小时，其它为fff - milliseconds, ss - seconds, mm - minutes, 
         * hh - hours, DD - days, MM - months, YYYY - years.
         */
        xDateFormat : "hh",
        /**
         * 鼠标移动到点时，x轴上提示的日期显示的格式，只有parseDate设置为true时才有效
         * @type string
         * @default "YYYY MMM DD JJ:NN"  所有全显示格式为： "YYYY MMM DD JJ:NN:SS"
         */
        categoryBalloonDateFormat : "YYYY MMM DD JJ:NN",
        /**
         * 是否应用dashboard的样式
         * @type Boolean
         * @default false
         */
        dashboard: false,
        /**
         * 左侧Y轴的单位
         * @type String
         * @default ""
         */
        leftUnit: "",
        /**
         * 右侧Y轴的单位
         * @type String
         * @default ""
         */
        rightUnit: "",
        /**
         * 图表的边距
         * @type Object
         * @default {top: 15, right: 5, bottom: 28, left: 35}
         */
        chartMargin: {
            top: 15,
            right: 5,
            bottom: 28,
            left: 35
        },
        /**
         * 是否显示图的工具栏，默认不显示
         * @type Boolean
         * @default false
         */
        showTools : false,
        /**
         * 图的提示(当鼠标移动到图上时出现的提示)是全部显示还是只显示一个，true:只显示一个；false:显示全部折线的提示
         * @type Boolean
         * @default false
         */
        oneBalloonOnly : false,
        /**
         * 每点所需最小宽度。横向点密度小于此值，自动显示缩放条
         * @type Number
         * @default 23
         */
        pointDensityThreshold: 23
    },
    /**
     * @private
     * @description 注册事件
     */
    _addListener : function(){
        var me = this;
        $.each(me.handlers, function (eventName, func) {
            if (eventName === "click") {
                me.chartElement.addListener("clickGraphItem", function (evt) {
                    me._onClick(evt, me, func);
                });
            }
        });
    },
	/**
	 * @private
	 * @description 去激活注册事件
     * @param {string} eName 去除的事件的名称，不传或为空时，去除全部的注册事件
	 */
	_removeListener: function(eName) {
        var me = this;
        me.handlers = me.handlers || {};

        //删除所有的事件
        if (!eName || eName === "") {
            $.each(me.handlers, function (eventName, func) {
                me.chartElement.removeListener(me.chartElement, eventName, func);
            });
        }
        else {
            //单独去除相应的事件
            $.each(me.handlers, function (eventName, func) {
                if (eName === eventName) {
                    me.chartElement.removeListener(me.chartElement, eventName, func);
                }
            });
        }
    },
    /**
     * @private
     * @description 绑定图的单击事件
     */
    _bindEvent : function() {
        var me = this;

        // 监听点击事件，以实现钻取
        me.chartElement.addListener("clickGraphItem", function(evt){
            me._onClick(evt, me);
        });

        //监听roll over事件，以改变item的颜色
        me.chartElement.addListener("rollOverGraphItem", function(evt){
            me._onOverItem(evt, me);
        });

        //监听roll out事件，以恢复item的颜色
        me.chartElement.addListener("rollOutGraphItem", function(evt){
            me._onOutItem(evt, me);
        });

        // 监听zoom事件，显示tooltip
        me.chartElement.addListener("zoomed", function(evt){
            if(!me.options.showTools){
                me._onZoom(evt);
            }
        });

        // 监听滚动条事件，更新tooltip
        me.chartEl.bind("scrollBar", function (evt, data) {
            me._onScrollBar(evt, data);
        });
    },
    /**
     * @private
     * @description 当鼠标在图的item上时，改变此item的颜色
     * @param {object} evt   amchart事件返回的相应的对象
     * @param {object} me    此图的对象
     */
    _onOverItem : function(evt, me){
        //添加选中时的颜色样式
        var dItem = evt.item,
            chart = evt.chart,
            len,
            bulletFillColor = chart.balloon.bulletFillColor;  //此颜色现在是设置好的bulletFillColor值
        var fill;

        if (dItem.columnSprite && dItem.columnSprite.children && bulletFillColor) {
            len = dItem.columnSprite.children.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    fill = dItem.columnSprite.children[i].getAttr("fill");
                    fill = this._adjustLuminosity(fill, -0.2);

                    //设置相应的颜色
                    dItem.columnSprite.children[i].setAttr("fill", fill);
                    dItem.columnSprite.children[i].setAttr("stroke", fill);
                }
            }
        }
    },
    /**
     * @private
     * @description 当鼠标在图的item之外时，恢复此item的颜色
     * @param {object} evt   amchart事件返回的相应的对象
     * @param {object} me    此图的对象
     */
    _onOutItem : function(evt, me){
        //添加选中时的颜色样式
        var dItem = evt.item,
            chart = evt.chart,
            len,
            graph = evt.graph;

        if (dItem.columnSprite && dItem.columnSprite.children && chart.balloon.bulletFillColor) {
            len = dItem.columnSprite.children.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    //恢复此item的颜色
                    dItem.columnSprite.children[i].setAttr("fill", graph.fillColors);
                    dItem.columnSprite.children[i].setAttr("stroke", graph.fillColors);
                }
            }
        }
    },
    /**
     * @private
     * @description 图的点击事件,支持折线图的钻取，柱状图的点击
     * @param {Object} event 图点击区域对象的信息
     * @param {Object} me 此图的对象引用
     * @param {function} func (event, data) 通过addListener注册的单击元事件回调函数
     */
    _onClick : function(event, me, func) {
        var originalData = {};
        originalData.item = $.objClone(event.item.dataContext);
        try{
            if (true === me.options.parseDate || "true" === me.options.parseDate) {
                var dataKeys0 = me.options.dataKeys[0],
                    tData,
                    dateFromat = "yyyy-MM-dd hh:mm:ss";
                if (originalData.item && originalData.item[dataKeys0]) {
                    tData = originalData.item[dataKeys0];
                    if (Date == tData.constructor) {
                        //如果转换异常,则不转换
                        originalData.item[dataKeys0] = $.date.format(tData, dateFromat);
                    }
                }
            }  
        }catch(e){}
        //当前点击点所在的legend对象的值，用legendValue表示
        originalData.legendValue = event.item.graph.title;

        //点击这个点的值，用data表示
        originalData.data = event.item.values.value;
        originalData.valueField = event.graph.valueField;

        if ($.isFunction(func)) {
            func(event, originalData);
        }
        else {
            me._trigger("click", event, originalData);
        }
    },
    /**
     * 处理缩放事件，设置起始、结束值，显示提示
     * @param event
     * @private
     */
    _onZoom: function (event) {
        var me = this;
        var start, end, fmt, startDate, endDate;
        var catKey = "$" + me.options.dataKeys[0] + "$";

        if (!me.rangeTipEl) {
            return;
        }

        // 获取起止值
        start = me.options.data[event.startIndex][catKey];
        end = me.options.data[event.endIndex][catKey];

        if (!start || !end) {
            start = event.startValue;
            end = event.endValue;
        }

        // 如果是日期，格式化后显示
        if (me.options.parseDate) {
            startDate = start;
            endDate = end;

            if ($.type(startDate) === "date" && $.type(endDate) === "date") {
                if (startDate.getSeconds() !== 0 || endDate.getSeconds() !== 0) {
                    fmt = "hh:mm:ss";
                }
                else if (startDate.getMinutes() !== 0 || endDate.getMinutes() !== 0) {
                    fmt = "hh:mm";
                }
                else if (startDate.getHours() !== 0 || endDate.getHours() !== 0) {
                    fmt = "MM-dd hh:mm";
                }
                else {
                    fmt = "yyyy-MM-dd";
                }

                start = $.date.format(startDate, fmt);
                end = $.date.format(endDate, fmt);
            }
        }

        // zoomed事件可以得到当前start/end
        this._setRangeTipValue({start: start, end: end});
        this._showRangeTip("zoomed");
    },
    /**
     * 处理滚动条变化事件，设置提示的位置
     * @param event
     * @param data
     * @private
     */
    _onScrollBar: function (event, data) {
        if (!this.rangeTipEl) {
            return;
        }

        if (data.type === "changed") {
            this.rangeTipEl.data("data", {left: data.left, width: data.width});
        }

        this._showRangeTip(data.type);
    },
    /**
     * 设置提示的开始、结束值
     * @param value
     * @private
     */
    _setRangeTipValue: function (value) {
        var me = this;

        if (value.start) {
            me.startEl.find("." + labelClass).text(value.start);
        }
        if (value.end) {
            me.endEl.find("." + labelClass).text(value.end);
        }
    },
    /**
     * 显示范围提示
     * @param type
     * @private
     */
    _showRangeTip: function (type) {
        var me = this;
        var delayId = "sweet.widget.chart.dashline.tip-" + me.options.id;
        var margin = this.options.chartMargin;
        var top, left, offset, width;
        var data = this.rangeTipEl.data("data");
        var startLabel, endLabel;

        // 内容为空时，不显示
        if ($.isNull(me.startEl.find("." + labelClass).text()) ||
            $.isNull(me.endEl.find("." + labelClass).text())) {
            me.rangeTipEl.stop(false, true);
            return;
        }

        // 判断触发事件
        if (type === "hover") {
            this._scrollbarHovered = true;
        }
        else if (type === "out") {
            this._scrollbarHovered = false;
        }

        // 显示
        me.rangeTipEl.stop(false, true).show();

        // 刷新位置
        offset = this.lineEl.offset();

        left = offset.left + margin.left + data.left;
        top = offset.top + margin.top - 3;
        this.startEl.css({left: left, top: top});

        left = offset.left + margin.left + data.left + data.width;
        top = offset.top + margin.top - 3;
        this.endEl.css({left: left, top: top});

        // 设置文本的位置，并且防止重叠
        startLabel = this.startEl.find("." + labelClass);
        endLabel = this.endEl.find("." + labelClass);
        width = startLabel.outerWidth() + endLabel.outerWidth();
        if (width / 2 > data.width - 5) {
            offset = (width / 2 - data.width + 5) / 2;
        }
        else {
            offset = 0;
        }

        startLabel.css({left: 0 - startLabel.outerWidth() / 2 - offset});
        endLabel.css({left: 0 - endLabel.outerWidth() / 2 + offset});

        // 如果不是hover触发的显示，显示一段时间后关闭
        if (!this._scrollbarHovered) {
            Sweet.Task.Delay.start({
                id: delayId,
                run: function() {
                    me.rangeTipEl.fadeOut(200);
                },
                delay: 1000
            });
        }
        // 否则，停止延时定时器
        else {
            Sweet.Task.Delay.stop(delayId);
        }
    },
    /**
     * 创建范围提示
     * @private
     */
    _createRangeTip: function () {
        var me = this;
        if (me.rangeTipEl) {
            return;
        }

        // 提示容器
        me.startEl = $("<div>").addClass(rangeTipClass).appendTo(document.body);
        me.endEl = $("<div>").addClass(rangeTipClass).appendTo(document.body);

        // 箭头、文本
        this.rangeTipEl = me.startEl.add(me.endEl);
        this.rangeTipEl.each(function (i, el) {
            $("<div>").addClass(labelClass).appendTo($(el));
            $("<div>").addClass(arrowClass).appendTo($(el));
        });

        this.rangeTipEl.hide();
    },
    /**
     * 删除类别轴范围提示
     * @private
     */
    _removeRangeTip: function () {
        var me = this;

        if (me.rangeTipEl) {
            me.rangeTipEl.remove();
            me.rangeTipEl = null;
        }
    },
    /**
     * @private
     * 调整16进制颜色的亮度
     * // http://www.sitepoint.com/javascript-generate-lighter-darker-color/
     * @param hex
     * @param lum
     * @returns {string}
     */
    _adjustLuminosity: function(hex, lum)
    {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6)
        {
            hex = String(hex[0])+String(hex[0])+String(hex[1])+String(hex[1])+String(hex[2])+String(hex[2]);
        }

        lum = lum || 0;

        var rgb = "#", c, i;
        for (i = 0; i < 3; i++)
        {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }
        return rgb;
    },
    _closeFloatPanel : function(){
        if(this.viewEl){
            this.viewEl.hide();
            this.viewImgEl.removeClass("sweet-chart-tools-view-image-clicked").addClass("sweet-chart-tools-view-image");
        }

        if(this.zoomEl){
            this.zoomEl.hide();
        }
    },
    _onViewClick : function(e){
        var me = e.data.me,
            options = me.options;

        if(!me.viewEl){
            var h = 60;
            var viewId = options.id + "-tools-view-panel";
            me.viewEl = $("<div>").attr("id", viewId).addClass("sweet-chart-tools-view").css("z-index", 1024)
                .bind("click", function(e){
                    e.stopPropagation();
                })
                .width(me.chartEl.width()).height(h).hide()
                .appendTo(document.body);

            var legendBox =  new Sweet.form.CheckBox({ 
                width: "100%",
                value :{"value":"1", "text":Sweet.core.i18n.chart.legend}
            });
            legendBox.addListener("click", function(e, isChecked){
                if(isChecked){
                    me.hideLegend();
                } else {
                    me.showLegend();
                }
            });
            me._legendBox = legendBox;
            var balloonBox =  new Sweet.form.CheckBox({ 
                width: "100%",
                value :{"value":"1", "text":Sweet.core.i18n.chart.balloon}
            });
            balloonBox.addListener("click", function(e, isChecked){
                if(isChecked){
                    me.oneBalloonShow();
                } else {
                    me.allBalloonShow();
                }
            });
            me._balloonBox = balloonBox;
            var vp = new Sweet.panel.VPanel({
                width: me.chartEl.width(),
                height: h,
                padding: 10,
                items : [legendBox, balloonBox],
                renderTo : viewId,
                margin: [10,0,0,0]
            });
        } else {
            if(me.viewEl.is(":visible")){
                me.viewEl.hide();
                return;
            }
        }
        me.viewEl.width(me.toolsEl.width());
        var offset = me.subLineEl.offset();
        var left = offset.left;
        var top = offset.top;
        me.viewEl.css({left: left, top: top});
        me.viewImgEl.removeClass("sweet-chart-tools-view-image").addClass("sweet-chart-tools-view-image-clicked");
        me.viewEl.slideDown("slow");
        e.stopPropagation();
    },
    _onZoomClick : function(e){
        var me = e.data.me,
            options = me.options,
            id = options.id + "-zoom",
            zoomPanelId = options.id + "-zoom-panel";

        if(!me.zoomEl){
            var h = 160;
            me.zoomEl = $("<div>").attr("id", zoomPanelId).addClass("sweet-chart-tools-view")
                .bind("click", function(e){
                    e.stopPropagation();
                }).css("margin-left","100px")
                .width(35).height(h).hide()
                .appendTo(document.body);
            var zoomOut = $("<div>").addClass("sweet-chart-zoom-out")
                .css({
                        "margin-top": "5px",
                        "margin-left": "10px"
                    })
                .bind("click", function(e){
                    //减号，是图变小，值越大
                    var _t = $( "#"+me.sliderId );
                        var curValue = _t.slider("value");
                        curValue = curValue + 0.2;
                        me.zoomValue = curValue;
                        _t.slider("value", curValue);
                        me.zoom(curValue);
                }).appendTo(me.zoomEl);
            

            var jji = options.id+"-zoom-iuo";
            me.sliderId = jji;
            $("<div>").attr("id", jji).width(11).height(90)
                .css("margin-left", "10px")
                .css("margin-top", "30px")
                .appendTo(me.zoomEl);
            //滑动杆对象，最大提供3倍，默认1倍正常大小，每次步长0.2
            $( "#"+jji ).slider({
              orientation: "vertical",
              range: "max",
              step : 0.2,
              min: 1,
              max: 3,
              value: 1,
              slide: function( event, ui ) {
                me.zoomValue = ui.value;
                me.zoom(ui.value);
              }
            });

            var zoomIn = $("<div>").addClass("sweet-chart-zoom-in")
                    .css({
                        "margin-top": "8px",
                        "margin-left": "9px"
                    }).bind("click", function(e){
                        //加号，是图变大，值越小
                        var _t = $( "#"+me.sliderId );
                        var curValue = _t.slider("value");
                        curValue = curValue - 0.2;
                        me.zoomValue = curValue;
                        _t.slider("value", curValue);
                        me.zoom(curValue);
                    }).appendTo(me.zoomEl);

        } else {
            if(me.zoomEl.is(":visible")){
                me.zoomEl.hide();
                return;
            }
        }
        me.zoomEl.width(35);
        var offset = me.subLineEl.offset();
        var left = offset.left;
        var top = offset.top;
        me.zoomEl.css({left: left, top: top});
        me.zoomEl.slideDown("slow");
        e.stopPropagation();
        
    },
    zoom : function(num){
        var me = this;
        if(me.chartElement){
            if(me.yAxis){
                //更新y轴的minMaxMultiplier值
                if(me.yAxis.left){
                    me.yAxis.left.minMaxMultiplier = num;
                }
                if(me.yAxis.right){
                    me.yAxis.right.minMaxMultiplier = num;
                }
            }
            me.chartElement.validateNow()
        }
    },
    /**
     * @parivate
     * @description 创建js版折线图
     */
    _createJsChart : function() {
        var me = this,
            options = me.options,
            lineEl;

        // 创建工具栏容器
        if(me.options.showTools){
            me.toolsEl = $("<div>").attr("id", options.id + "-tools")
                    .width(options.width).height(me.toolHeight).addClass("sweet-chart-tools")
                    .appendTo(me.chartEl);
            
            me.viewTextEl = $("<div>").addClass("sweet-chart-tools-view-text")
                    .text(Sweet.core.i18n.chart.view).bind("click", {"me": me}, me._onViewClick)
                    .appendTo(me.toolsEl);

            me.viewImgEl = $("<a>").addClass("sweet-chart-tools-view-image")
                .bind("click", {"me": me}, me._onViewClick).appendTo(me.toolsEl);
            //分隔线
            $("<span>").addClass("sweet-chart-tools-divid-line").appendTo(me.toolsEl);
            me._zoomTextEl = $("<div>").addClass("sweet-chart-tools-zoom-text")
                    .text(Sweet.core.i18n.chart.zoom)//.bind("click", {"me": me}, me._onViewClick)
                    .appendTo(me.toolsEl);
            me.zoomImgEl = $("<a>").attr("id",options.id+"-zoom").addClass("sweet-chart-tools-zoom-image")
                .bind("click", {"me": me}, me._onZoomClick).appendTo(me.toolsEl);
        }
        //创建Chart的容器
        me.lineId = options.id + "-lineEl";
        lineEl = me.lineEl = $("<div>").attr("id", me.lineId)
                .width("100%").height("100%")
                .addClass(chartClass)
                .appendTo(me.chartEl);
        if(me.options.showTools){
            me.subLineId = me.lineId + "-sub";
            me.subLineEl = $("<div>").attr("id", me.subLineId)
                    .width("100%").height("100%").appendTo(me.lineEl);
        }

        // 创建序列图对象
        var chartElement = me.chartElement = new AmCharts.AmSerialChart();

        // 配置属性
        me._setChartOptions();

		//设置CategoryAxis信息及上面的阈值线
		me._setCategoryAxis();
		
		//设置valueAxis信息及上面的阈值线
		me._createValueAxis();
		
        // 绘图
		me._createGraphs();
        
        // 设置cursor
        me._createJsCursor(options.oneBalloonOnly);

        // 设置Scrollbar
        me._createJsScrollbar();

        // 设置legend
        me._createJsLegend();
		
        //绑定事件
        me._bindEvent();

        // 注册事件
        me.addListener();
    },

    /**
     * 创建Chart对象后，配置基本属性
     * @private
     */
    _setChartOptions: function () {
        var me = this;
        var options = this.options;
        var chartElement = this.chartElement;
        var margin = options.chartMargin;

        // 基本配置
        chartElement.pathToImages = Sweet.amchartsImagePath;
        chartElement.categoryField = options.dataKeys[0];
        chartElement.plotAreaBorderColor = lineConfData.axisColor;
        chartElement.plotAreaBorderAlpha = 0;
        chartElement.color = me.textColor;
        chartElement.balloon.bulletFillColor = "#f77007";
        chartElement.showFirstLabel = true;

        // 数值格式
        chartElement.numberFormatter = {
            precision: -1,
            decimalSeparator: '.',
            thousandsSeparator: ','
        };

        // 字体
        chartElement.fontSize = me.fontSizeNormal;
        chartElement.fontFamily = me.chartFontFamily;

        // 柱子的相对宽度
        chartElement.columnWidth = 0.6;

        // 阴影及底纹
        chartElement.shadow = false;
        //chartElement.textureMap = this.options.dashboard ? {} : $.objCopy(lineConfData.textureMap);

        // dashboard风格
        if (this.options.dashboard) {
            chartElement.autoMargins = false;
            chartElement.marginLeft = margin.left;
            chartElement.marginRight = margin.right;
            chartElement.marginTop = margin.top;
            chartElement.marginBottom = margin.bottom;
            chartElement.columnSpacing = 2;
            chartElement.prefixesOfSmallNumbers = [];

            // 条形图最右一个类别文本可能显示不全，所以加大边距
            if (options.graphType === Sweet.constants.graphType.BAR) {
                chartElement.marginRight = 50;
            }
        }
    },

	/**
     * @private
     * @description 创建阈值线
	 * @param {Object} axis 坐标轴对象
	 * @param {String} axisType 坐标轴类型valueAxis或categoryAxis
	 * @param {Array/String/Number} guideValues 阈值线的值，可以是数组，创建多个阈值线
     */
	_createGuide: function(axis, axisType, guideValues){
        var config = lineConfData.guide,
            guide,
            values,
            isObject = false,
            dir = 0,
            value, text, unit, color,
            i;

        // 检查参数
		if($.isNull(axis) || $.isNull(guideValues)){
			return;
		}
		
        // 转成数组
        if ($.isArray(guideValues)) {
            values = guideValues;
        }
        else {
            values = [guideValues];
        }

        // 判断value是否对象形式
        isObject = $.isPlainObject(values[0]);

        // 判断方向
        if (values.length > 1) {
            if (axisType === Sweet.constants.axisType.CATEGORY) {
                dir = 1;
            }
            else if (isObject) {
                dir = values[0].value < values[1].value ? 1 : -1;
            }
            else {
                dir = values[0] < values[1] ? 1 : -1;
            }
        }

        // 添加guide
        for (i = 0; i < values.length; i++) {
            value = values[i];

            // 创建guide对象
            guide = new AmCharts.Guide();

            // 确定颜色序号
            color = i % config.lineColor.length;

            // 取具体数据
            if (isObject) {
                text = value.text ? value.text + ": " : "";
                unit = value.unit || "";
                value = value.value;
            }
            else {
                text = unit = "";
            }

            // 数值轴和类别轴的属性值不同，要分开处理
            if (axisType === Sweet.constants.axisType.VALUE) {
                guide.value = value;
                guide.toValue = value;
            }
            else if (axisType === Sweet.constants.axisType.CATEGORY) {
                guide.category = value;
                guide.toCategory = value;
            }

            // 阈值线的样式值
            guide.lineColor = config.lineColor[color];
            guide.lineAlpha = config.lineAlpha;
            guide.fillColor = config.lineColor[color];
            guide.fillAlpha = config.fillAlpha;
            guide.dashLength = config.dashLength;
            guide.balloonText = text + value + unit;

            // 添加到座标轴对象
            axis.addGuide(guide);
        }
	},
	
	/**
     * @private
     * @description 置categoryAxis的配置信息和阈值线
     */
	_setCategoryAxis: function() {
        var me = this,
            options = me.options,
            categoryAxis = me.chartElement.categoryAxis;

        // 日期使用自动解析的方式,且一定要有数据，否则使用noData时会报错
        if (options.parseDate && options.data.length > 0) {
            categoryAxis.parseDates = true;
            categoryAxis.isParseDate = true;
            categoryAxis.minPeriod = options.xDateFormat;
            categoryAxis.equalSpacing = true;
            categoryAxis.dateFormats = [
                {period: 'fff', format: 'JJ:NN:SS'},
                {period: 'ss', format: 'JJ:NN:SS'},
                {period: 'mm', format: 'JJ:NN'},
                {period: 'hh', format: 'JJ:NN'},
                {period: 'DD', format: 'MM-DD'},
                {period: 'MM', format: 'YYYY-MM'},
                {period: 'YYYY', format: 'YYYY'}
            ];
        } else {
            categoryAxis.parseDates = false;
            categoryAxis.isParseDate = false;
            categoryAxis.minPeriod = "DD";
            categoryAxis.equalSpacing = false;
        }

        // 如果设置了旋转角度或步长，则使用用户设置的
        if (Number(options.labelRotation) !== 0) {
            categoryAxis.labelRotation = Number(options.labelRotation);
        }

        categoryAxis.axisColor = lineConfData.axisColor;
        categoryAxis.gridPosition = "start";

        // 面积图时从axis开始显示
        if (options.graphType === Sweet.constants.graphType.AREA) {
            categoryAxis.startOnAxis = false;
        }
        else {
            categoryAxis.startOnAxis = false;
        }
        categoryAxis.autoGridFrequency = options.graphType === Sweet.constants.graphType.BAR ? true : false;
        // dashboard风格
        if (this.options.dashboard) {
            categoryAxis.axisAlpha = 0;
            categoryAxis.gridAlpha = 0;
        }

        // 设置X轴的阈值
        if (options.xThresholdValue) {
            me._createGuide(categoryAxis, Sweet.constants.axisType.CATEGORY, options.xThresholdValue);
        }
    },
	
	/**
     * @private
     * @description 创建并设置valueAxis的配置信息和阈值线
     */
	_createValueAxis: function() {
        var me = this,
            options = me.options,
            yAxis = {},
            categoryAxis = me.chartElement.categoryAxis;

        // 创建之前，先清空其中已有的值
        if (me.yAxis) {
            if (me.yAxis.left) {
                me.chartElement.removeValueAxis(me.yAxis.left);
            }
            if (me.yAxis.right) {
                me.chartElement.removeValueAxis(me.yAxis.right);
            }
            me.yAxis = {};
            me.chartElement.valueAxes = [];
        }

        // 对不同的图形设置特殊的valueAxis的属性
        var valueAxis = new AmCharts.ValueAxis(),
            a,
            b,
            rightValueAxis;

        valueAxis.axisColor = lineConfData.axisColor;
        valueAxis.minMaxMultiplier = me.zoomValue || 1;

        // 面积图的类型: "100%", "regular", "3d", "none"
        if (options.graphType === Sweet.constants.graphType.AREA) {
            a = lineConfData.stackType[1];
            b = lineConfData.stackType[0];
            valueAxis.stackType = options.stackType === a ? a : b;
        }
        // bar图时，不设置Y轴的labelFrequency，恢复为默认值1
        else if (options.graphType === Sweet.constants.graphType.BAR) {
            categoryAxis.labelFrequency = 1;
        }
        else if (options.graphType === Sweet.constants.graphType.COLUMN) {
            //100%的柱状堆积图，valueAxis是100%
            if (options.stackType === lineConfData.stackType[1]) {
                valueAxis.stackType = lineConfData.stackType[1];
            }
            else if (options.stackType === lineConfData.stackType[0]) {
                //一般的柱状堆积图
                valueAxis.stackType = lineConfData.stackType[0];
            }
        }
        else if (options.graphType === Sweet.constants.graphType.MIX_COLUMN_LINE) {
            //混合图("columnline")时的情况，有两个Y轴
            rightValueAxis = new AmCharts.ValueAxis();
            rightValueAxis.axisColor = lineConfData.axisColor;
            rightValueAxis.position = "right";
            rightValueAxis.minimum = 0;

            me.chartElement.addValueAxis(rightValueAxis);
            yAxis.right = rightValueAxis;
        }

        // dashboard 风格
        if (this.options.dashboard) {
            valueAxis.dashLength = 5;
            valueAxis.usePrefixes = true;
            valueAxis.offset = -7;
            valueAxis.axisAlpha = 0;

            if (rightValueAxis) {
                rightValueAxis.axisAlpha = 0;
                rightValueAxis.dashLength = 5;
                rightValueAxis.usePrefixes = true;
                rightValueAxis.offset = -7;
                me.chartElement.marginRight = options.chartMargin.left;
            }
        }

        // 设置Y轴的阈值
        if (options.yThresholdValue) {
            me._createGuide(valueAxis, Sweet.constants.axisType.VALUE, options.yThresholdValue);
        }
        me.chartElement.addValueAxis(valueAxis);

        // 默认为左边的竖轴
        yAxis.left = valueAxis;
        me.yAxis = yAxis;
	},
	
	/**
     * @private
     * @description 添加unit单位或者图的title
     */
	_addUnitTitle: function() {
        var me = this,
            options = me.options,
            unitText,               // 100%unit表示
            leftUnitText,           // 左边单位的表示
            rightUnitText,          // 右边单位的表示
            marginRight,            // 右边单位到右边的间距
            xUnit = me.chartElement.marginLeft + 5,
            yUnit = me.chartElement.marginTop - me.fontSizeNormal - 10; // y的值需要减去fontsize，再减去上下各5pix

		// 添加title或label时，先清除已经有的
        me.chartElement.clearLabels();

		// title
        if (!$.isNull(options.chartTitle) && me.preTitle !== options.chartTitle) {
            //30为title的高度
            me.chartElement.titles = [];
            me.chartElement.addTitle(options.chartTitle, me.fontSizeLarger,
                me.labelColor, me.labelAlpha, me.chartFontFamily);
            me.preTitle = options.chartTitle;   //记录title
        }

        // 加55的来历：其中30为title原来增加的，另外25是title底部到图的间隔(小于真正的这段距离)
        if (me.preTitle) {
            yUnit += 55;
        }
        if (yUnit < 0) {
            yUnit = this.chartElement.marginTop;
        }

        // dashboard样式，放在最上边
        if (options.dashboard) {
            yUnit = 0;
        }
        var i;
        var showUnitLeft = true, showUnitRight = true;

        // 如果dataKeys里也指定了单位，必须和leftUnit/rightUnit匹配，否则不显示单位信息
        for (i = 1; i < options.dataKeys.length; i++) {
            if ($.isNull(options.dataKeys[i][2])) {
                continue;
            }

            if (options.dataKeys[i][3] !== "right" && options.dataKeys[i][2] !== options.leftUnit) {
                showUnitLeft = false;
            }
            else if (options.dataKeys[i][3] === "right" && options.dataKeys[i][2] !== options.rightUnit) {
                showUnitRight = false;
            }
        }

		// 如果是stackType为100%,不管是否设置了单位，单位一定有且为%
		if(options.stackType === lineConfData.stackType[1]){
			unitText = "%";
			me.chartElement.addLabel(xUnit, yUnit, unitText, "left", me.fontSizeNormal, me.textColor, 0, 1);
		}
		// 增加左侧的axis的单位
		else if(options.leftUnit && options.leftUnit !== "" && showUnitLeft) {
			leftUnitText = options.leftUnit;
            me.chartElement.addLabel(xUnit, yUnit, leftUnitText, "left", me.fontSizeNormal, me.textColor, 0, 1);
		}
        
        // 右侧Y轴的单位
        if(options.rightUnit && options.rightUnit !== "" && showUnitRight) {
            marginRight = me.chartElement.marginRight;
            xUnit = me.chartEl.width() - marginRight - 5;
            rightUnitText = options.rightUnit;
			me.chartElement.addLabel(xUnit, yUnit, rightUnitText, "right", me.fontSizeNormal, me.textColor, 0, 1);
        }
	},
		
	/**
     * @private
     * @description 创建graphs
     */
	_createGraphs: function() {
        var me = this,
            options = me.options,
            lineNum = options.dataKeys.length - 1;

        me.chartElement.graphs = [];
		me._addGraphs(lineNum);
	},
	
    /**
     * @private
     * @description 循环将各个实例图加入到整个图中去
     * @param {type} lineNum  图的个数
     */
    _addGraphs: function (lineNum) {
        var me = this,
            options = me.options,
            graph,
			tempTValue = "",
			tipValue = "[[value]]",
			tipPercent = "[[percents]]%",
			tipTitle = "[[title]]: ",
			composeTP = tipTitle + tipPercent + " (" + tipValue + ")",
			composeTV = tipTitle + tipValue,
            unit,
            side,
            attr,
            defaultOptions = {
                connect: false,
                bulletSize: 5,
                fillAlphas: 1,
                lineAlphas: 1,
                lineThickness: 1,
                /**
                 * "drillable"是dataprovider中field，表示此数据item是否可以进行钻取的标志
                 * 如果可以钻取，drillable=" "(值为空字符，不是没有)；如果不能钻取，则不设置此值。
                 */
                drillField: "drillable"
            };
		
        for (var i = 0; i < lineNum; i++) {
            unit = options.dataKeys[i + 1][2];
            side = options.dataKeys[i + 1][3] || "left";

            if (typeof unit === 'undefined') {
                unit = options.leftUnit;
            }

            // 创建Graph
            graph = new AmCharts.AmGraph();
            graph.valueField = options.dataKeys[i + 1][0];
            graph.title = options.dataKeys[i + 1][1];
            graph.type = lineConfData.graph.type;

            for (attr in defaultOptions) {
                graph[attr] = defaultOptions[attr];
            }

            // 支持用户配置自定义图的提示定义
            if (options.balloonText) {
                graph.balloonText = options.balloonText;
            }
            else {
				tempTValue = unit ? (composeTV + " " + unit) : composeTV;
                graph.balloonText = (options.stackType === lineConfData.stackType[1]) ? composeTP : tempTValue;
            }

            // 图例的提示格式
            if (options.stackType === lineConfData.stackType[1]) {
                graph.legendValueText = tipPercent;
            }
            else {
                graph.legendValueText = tipValue + " " + (options.leftUnit ? options.leftUnit : "");
            }

            // 序列数小于maxPacket，按预定义颜色序列显示；否则不指定，由amcharts自行决定
            if (lineNum > 0 && lineNum <= me.maxPacket-1) {
                graph.lineColor = me._getColor(lineNum, i, true);
            } else if(options.dataKeys[i+1][4]){
                graph.lineColor = options.dataKeys[i+1][4];
            }

            //如果指定为面积图
            if (options.graphType === Sweet.constants.graphType.AREA) {
                graph.fillAlphas = 0.6;
                graph.bullet = lineConfData.graph.bullet;

                if (!$.isNull(graph.lineColor)) {
                    graph.bulletBorderColor = graph.lineColor;
                }
            }
            else if (options.graphType === Sweet.constants.graphType.COLUMN) {
                graph.type = Sweet.constants.graphType.COLUMN;
                graph.labelText = "";
            }
            else if (options.graphType === Sweet.constants.graphType.BAR) {
                me.chartElement.rotate = true;
                graph.type = Sweet.constants.graphType.COLUMN;
                graph.labelText = "[[value]]" + unit;
            }
            else if (options.graphType === Sweet.constants.graphType.LINE && options.style === 1) {
                graph.lineThickness = lineConfData.graph.lineThickness;
                graph.fillAlphas = 0;

                if (lineNum > 0 && lineNum < me.maxPacket) {
                    graph.bullet = lineConfData.graph.bullet;
                    if (!$.isNull(graph.lineColor)) {
                        graph.bulletBorderColor = graph.lineColor;
                    }
                }
            }
            else if (options.graphType === Sweet.constants.graphType.MIX_COLUMN_LINE) {
                graph.lineThickness = 1;

                // 混合图的情况，有两个Y轴。需要在dataKeys中指定在哪个轴上
                if (side === "left") {
                    graph.type = Sweet.constants.graphType.COLUMN;
                    graph.valueAxis = me.yAxis.left;
                }
                else {
                    graph.fillAlphas = 0;
                    graph.bullet = lineConfData.graph.bullet;
                    if (!$.isNull(graph.lineColor)) {
                        graph.bulletBorderColor = graph.lineColor;
                    }

                    graph.legendValueText = tipValue + " " + (options.rightUnit ? options.rightUnit : "");
                    graph.valueAxis = me.yAxis.right;
                    graph.balloonText = tipValue + unit;
                }
            }

            me.chartElement.addGraph(graph);
        }
    },
    /**
     * @private
     * @description 改变了图中的属性时调用
     * 由chart基类在setData时调用。基类调用这个函数后，不会再调用_updateData
     */
    _setChangeProperty : function(){
        var me = this,
            options = me.options;

        // dataKeys为空时的情况
        if($.isNull(options.dataKeys) || (!$.isNull(options.dataKeys) && options.dataKeys.length === 0)){
            options.dataKeys = ["text"];
        }
        
        //应该在setNoData之前更新categoryField，因为setNoData中用到了categoryField
        me.chartElement.categoryField = me.options.dataKeys[0];

        // data为空时的情况
        if($.isNull(options.data) || (!$.isNull(options.data) && options.data.length === 0)){
            me._setNoData();
        }

        me.chartElement.dataProvider = me.options.data;

        // 设置CategoryAxis信息及上面的阈值线
		me._setCategoryAxis();
		
		//设置valueAxis信息及上面的阈值线
		me._createValueAxis();

        me._addUnitTitle();

        me._createGraphs();

        me._createJsCursor(options.oneBalloonOnly);

        // 更新数据
        me._updateData();
    },
    /**
     * @private
     * @description 只更新数据 
     */
    _updateData : function(){
        var me = this;

        me.chartElement.dataProvider = me.options.data;

        if (me.rendered) {
            me._doLayout();
        }
    },
    /**
     * @private
     * @description 创建cursor
     */
    _createJsCursor : function(oneBalloonOnly) {
        var me = this;
        var chartCursor;

        if (me.options.isCursor) {
            me.chartElement.removeChartCursor();

            chartCursor = new AmCharts.ChartCursor();
            chartCursor.bulletsEnabled = true;
            //如果已经有了就使用已经选中的状态来更新数据
            if(me._balloonBox && $.isFunction(me._balloonBox.isChecked)){
                oneBalloonOnly = me._balloonBox.isChecked() ? true : false;
            }
            chartCursor.oneBalloonOnly = oneBalloonOnly;
            if (me.options.parseDate) {
                chartCursor.categoryBalloonDateFormat = me.options.categoryBalloonDateFormat;
            }

            //UI规范的内容
            chartCursor.cursorPosition = lineConfData.cursor.cursorPosition;
            chartCursor.cursorColor = lineConfData.cursor.corsorColor;
            chartCursor.dashLength = 8;
            chartCursor.categoryBalloonColor = lineConfData.cursor.categoryBalloonColor;
            me.chartElement.addChartCursor(chartCursor);
        }
    },
    
    /**
     * @private
     * @description 创建scrollbar
     * @param {Boolean} force 自动计算后强制显示
     */
    _createJsScrollbar : function(force) {
        var me = this;
        if (me.options.isScrollbar || force === true) {
            var chartScrollbar = new AmCharts.ChartScrollbar();
			//UI规范的内容
			chartScrollbar.backgroundColor = "#e2ebf4";
			chartScrollbar.scrollbarHeight = 7;
            me.chartElement.addChartScrollbar(chartScrollbar);

            if (!this.rangeTipEl) {
                this._createRangeTip();
            }
        }
    },

    /**
     * @description 删除Scrollbar
     * @private
     */
    _removeJsScrollBar: function() {
        if (this.chartElement) {
            this.chartElement.removeChartScrollbar();

            if (this.rangeTipEl) {
                this._removeRangeTip();
            }
        }
    },
    oneBalloonShow : function(){
        var me = this;
        if(me.chartElement){
            me.chartElement.removeChartCursor();
            me._createJsCursor(true);
            me.chartElement.validateNow()
        }
    },
    allBalloonShow : function(){
        var me = this;
        var me = this;
        if(me.chartElement){
            me.chartElement.removeChartCursor();
            me._createJsCursor(false);
            me.chartElement.validateNow()
        }
    },
    hideLegend : function(){
        var me = this;
        if(me.subLineEl){
            var subDiv = $(me.subLineEl).children("div");
            if(subDiv.length > 1){
                $(subDiv[1]).hide();
                me.chartElement.invalidateSize();
            }
        }
    },
    showLegend : function(){
        var me = this;
        if(me.subLineEl){
            var subDiv = $(me.subLineEl).children("div");
            if(subDiv.length > 1){
                $(subDiv[1]).show();
                me.chartElement.invalidateSize();
            }
        }
    },
    /**
     * @private
     * @description 创建legend
     */
    _createJsLegend : function() {
        var me = this;
        if (me.options.isLegend) {
            var legend = new AmCharts.AmLegend();
            legend.position = lineConfData.legend.position;
            me.legend = legend;
			//UI规范的内容
            legend.align = lineConfData.legend.align;
            legend.valueAlign = "left";
            legend.markerType = lineConfData.legend.markerType;
			legend.color = me.textColor;
			legend.valueWidth = 110;
			legend.switchType = "v";
            if(me.options.showTools){
                legend.isScroll = true;
                legend.autoMargins = false;
                legend.marginLeft = 0;
                legend.marginRight = 0;
            }

            if(!me.options.legendTips){
                legend.valueText = "";
                legend.valueWidth = 0;
            }

            // dashboard 样式
            if (!me.options.showTools && this.options.dashboard) {
                legend.position = "absolute";
                legend.top = 0;
                legend.left = 0;
                legend.align = "right";
                legend.autoMargins = false;
                legend.marginLeft = 10;
                legend.marginTop = 0;
                legend.marginRight = 10;
                legend.backgroundAlpha = 0.2;
                legend.maxColumns = 1;
                legend.markerSize = 15;
                legend.markerLabelGap = 2;
                legend.verticalGap = 0;
                legend.valueText = "";
                legend.valueWidth = 0;
                legend.switchable = true;
            }

            me.chartElement.addLegend(legend);
        }
    },
    
    /**
     * @public
     * @description 设置图的类型，并按设置的类型重绘图(图形切换使用)
     * @param {string} chartType 图的类型,例如: "line", "column", "area"等
     * @param {string} stackType 图的stackType类型，例如："100%", "regular"等
     */
    setChartType : function(chartType, stackType){
        var me = this,
            options = me.options;

        // 如果没有变化，不需要处理
        if (chartType === options.graphType && stackType === options.stackType) {
            return;
        }

        options.graphType = chartType;
        options.stackType = stackType;

        // 此属性很重要，设置为原来的值false，如设置过bar，此值为true，不还原将一直为true
        me.chartElement.rotate = false;

        // 更新各个和chart type相关的属性设置
        // 设置CategoryAxis信息及上面的阈值线
		me._setChangeProperty();
    },
    /**
     * @private
     * @description 专门用来设置没有数据时的显示内容 
     */
    _setNoData : function(){
        var me = this;
        var temp;

        if($.isNull(me.chartElement.categoryField)){
            me.chartElement.categoryField = "text";
        }

        // 因为没有数据时x轴显示为"没有数据"，所有parseDates为false才能显示
        if(!me.options.parseDate){
            temp = {};
            temp[me.chartElement.categoryField] = Sweet.core.i18n.chart.noDataTips;
            me.options.data = [temp];
        }
        else {
            me.options.data = [];
        }
    },
    /**
     * @private
     * @description 当没有数据时，各自图设置自己格式的默认数据
     */
    _setDefaultData : function(){
        var me = this;
        me._setNoData();
        me._updateData();
    },
	/**
     * @parivate
     * @description 渲染折线图到相应的到div
     */
    _chartRender : function() {
        var me = this;
        var temp = {},
            data = me.options.data;

		if(me.rendered || !me.chartElement){
			return;
		}
        if(me.options.showTools){
            me.lineEl.css("height", "calc(100% - " + me.toolHeight + "px)");    
        }
        
        // 设置配置时给定的数据
        if(data.length === 0){
            temp[me.options.dataKeys[0]] = Sweet.core.i18n.chart.noDataTips;
            me.options.data = [temp];
        }
        me.chartElement.dataProvider = data;

        //渲染图
        var renderId = me.options.showTools ? me.subLineId : me.lineId;
        me.chartElement.write(renderId);

        
        // 重新布局
        me._doLayout();

    },
	
	/**
     * @parivate
     * @description 组件宽度、高度发生变化后调用，进行页面重绘。
     */
    _doLayout : function() {
		var me = this;
		if(!me.options.renderTo || me.options.renderTo === "" || !me.chartElement){
			return;
		}

        // 延迟重绘
        Sweet.Task.Delay.start({
            id: "sweet.widget.chart.dashline.layout-" + this.options.id,
            run: function() {
                // 计算数据点密度，如果超过阀值，显示缩放条
                var count = me.options.data.length;
                var width = me.chartEl.width();
                if (count > 0 && width > 0 && me.options.graphType !== Sweet.constants.graphType.BAR) {
                    if (width / count < me.options.pointDensityThreshold) {
                        me._createJsScrollbar(true);
                    }
                    else {
                        me._removeJsScrollBar();
                    }
                }

                // 重绘
                me._reDraw();
            },
            delay: 100
        });
	},

    /**
     * @private
     * @description 容器改变大小后，重新绘制图
     */
    _reDraw : function(){
        var me = this;

        // 重新布局类别轴的标签
        me._layoutLabels();

        // 单位需要重新计算位置
        me._addUnitTitle();

        // 调整图例，避免遮挡图形
        if (!me.options.showTools && me.options.isLegend) {

            // 图例有两个时，增加marginTop
            if (me.options.dataKeys.length > 2) {
                me.chartElement.marginTop = me.options.chartMargin.top + 20;
            }
            else {
                me.chartElement.marginTop = me.options.chartMargin.top;
            }
        }

        if(me.options.showTools){
            me.legend.updateMaxHeight(me.subLineEl.height()/3);
        }
        
        // 刷新数据
        me.chartElement.validateData();

        // 重绘
        me.chartElement.validateNow();
        if(me.options.showTools && me.subLineEl){
            var subDiv = $(me.subLineEl).children("div");
            if(subDiv.length > 1){
                var legendDiv = $(subDiv[1]);
                legendDiv.css({
                        "overflow-y" : "auto",
                        "overflow-x" : "hidden"
                });
            }
        }
    },
            
    /**
     * @parivate
     * @description 创建flash版event图
     */
    _createFlashChart : function() {
        $.error("chart.DashLine doesn't support current browser!");
    },

    /**
     * 根据label重新计算外边距、间隔等
     * @private
     */
    _layoutLabels: function () {
        var me = this;
        var height, label, unit, graph, dataLen;
        var i;

        // 条形图比较特殊，要做一些特殊处理
        if (me.options.graphType === Sweet.constants.graphType.BAR) {
            me._interInfo = me._calcLabelInter();
            me.chartElement.marginLeft = me._interInfo.maxWidth + 10;

            // 如果数据序列特别多，Bar的Label会叠在一起，应该把label隐藏掉
            dataLen = me._interInfo.dataLen > 0 ? me._interInfo.dataLen : 1;
            height = me._interInfo.plotSize * me.chartElement.columnWidth / dataLen;
            if (me.options.dataKeys.length > 2) {
                height = height / (me.options.dataKeys.length - 1);
            }

            // 足够放下12px的文本而不会重叠的高度
            if (height < 13) {
                label = null;
            }
            else {
                label = "[[value]]";
            }

            for (i = 0; i < me.chartElement.graphs.length; i++) {
                graph = me.chartElement.graphs[i];
                unit = me.options.dataKeys[i + 1][2];

                if (label) {
                    graph.labelText = label + unit;
                }
                else {
                    graph.labelText = "";
                }
            }
        }
    },

    /**
     * 计算类别label间隔。目前仅对bar图有效
     * @returns {Object}
     * @private
     */
    _calcLabelInter: function () {
        "use strict";
        var i, inter = 1;
        var maxWidth = 0, totalSize = 0, avgSize = 0;
        var plotSize = this.chartEl.width();
        var buffer, span;
        var data = this.options.data;
        var dataLen = data.length;
        var catKey = this.options.dataKeys[0],
            category;
        var padding = 10;
        var bar = (this.options.graphType === Sweet.constants.graphType.BAR);
        var margin = this.options.chartMargin;


        // 条形图
        if (bar) {
            plotSize = this.chartEl.height() - margin.top - margin.bottom;
        }

        // 无数据
        if (dataLen === 0 || plotSize <= 10) {
            return {maxWidth: maxWidth, inter: inter, plotSize: plotSize, dataLen: dataLen};
        }

        // 避免重复计算
        if (this._interInfo &&
            this._interInfo.plotSize && this._interInfo.plotSize === plotSize &&
            this._interInfo.dataLen === dataLen) {
            return this._interInfo;
        }

        /**
         * 原理：根据文本创建Dom元素，计算元素的宽度。如果总宽度大于width，增加间隔，直到可以在width中放下
         */
        buffer = $("<div>").appendTo("body");
        buffer.css({
            position: "absolute",
            top: "-200px",
            width: "2000px",
            height: "200px",
            display: "block",
            "font-size": this.fontSizeNormal,
            "font-family" : this.chartFontFamily
        });

        // 创建label元素
        for (i = 0; i < dataLen; i++) {
            span = $("<span>");
            span.css({
                display: "block",
                "float": "left",
                "padding-left": i === 0 ? "0" : padding + "px"
            });

            // 如果是类别是日期对象，按照提示balloon的大小来计算
            if (this.options.parseDate) {
                category = this.options.categoryBalloonDateFormat;
            }
            else {
                category = data[i][catKey];
            }

            span.text(category).appendTo(buffer);
        }

        // 计算
        function _calc () {
            var count = 0;
            var width = 0, height = 0;

            buffer.children().each(function (index, span) {
                if (index % inter !== 0) {
                    return;
                }

                count ++;
                width = $(span).outerWidth(true);
                height = $(span).outerHeight(true);

                if (bar) {
                    totalSize += height;
                }
                else {
                    totalSize += width;
                }

                if (width > maxWidth) {
                    maxWidth = width;
                }
            });

            avgSize = plotSize / count;
        }
        _calc();

        // 是否需要间隔，如果需要，尝试增加间隔
        while ((bar && totalSize + (Math.floor(dataLen / inter) - 1) * padding > plotSize && inter < dataLen) ||
            (!bar && (maxWidth > avgSize + padding * 2 || totalSize > plotSize) && inter < dataLen)) {

            maxWidth = avgSize = totalSize = 0;
            inter += 1;

            _calc();
        }

        buffer.remove();

        // 条形图里label宽度不允许超过最大宽度
        if (bar) {
            //“没有数据”不能显示全
            maxWidth += 10;
            if(maxWidth > lineConfData.bar.maxLeftMargin){
               maxWidth = lineConfData.bar.maxLeftMargin; 
            }
        }

        return {maxWidth: maxWidth, inter: inter, plotSize: plotSize, dataLen: dataLen};
    },
    /**
     * @private
     * @description 组件销毁
     */
    _destroyWidget: function() {
        this._removeRangeTip();

        Sweet.Task.Delay.stop("sweet.widget.chart.dashline.tip-" + this.options.id);
        Sweet.Task.Delay.stop("sweet.widget.chart.dashline.layout-" + this.options.id);

        this._removeJsScrollBar();
        this._removeListener(null);
        this.chartElement.clearLabels();
        this.chartElement.removeLegend();

        if (this.chartElement) {
            this.chartElement.clear();
        }

        this._super();
    }
});

// 折线图，面积图，条形图，柱状图组件
Sweet.chart.DashLine = $.sweet.widgetChartDashLine;

}( jQuery ) );

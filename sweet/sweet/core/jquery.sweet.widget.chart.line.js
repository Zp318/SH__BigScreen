/**
 * @fileOverview 图形组件
 * @date 2013/02/20
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建折线，柱图，堆积图，面积图等
 * @name Sweet.chart.Line
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
*           line = new Sweet.chart.Line({
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

var lineColors = Sweet.constants.colors;

/**
 * 图形组件的样式的配置数据，推荐最多同时显示5种数据，大于5种时，颜色将随机产生
 */
var config = {
    colors : [lineColors[0], lineColors[3], lineColors[5], lineColors[7],lineColors[8], lineColors[9], lineColors[1], lineColors[6],lineColors[2], lineColors[4], lineColors[10]],
    /**
     * 绘制图形描述信息
     */
    graph : {
        bullet : "round",
        type : "line",
        lineThickness : 2
    },
    /**
     * 提示的样式配置
     */
	balloon : {
		adjustBorderColor : true,
		fillColor : "#ffffff",
		pointerWidth : 5,
		cornerRadius : 0
	},
    /**
     * cursor鼠标滑动时样式配置
     */
    cursor : {
        cursorPosition : "mouse",
		categoryBalloonColor : "#526f9f"
    },
    /**
     * legend图例样式配置
     */
    legend : {
        position : "bottom",
        align : "center",
        markerType : "square"
    },
    /**
     * 阈值线样式配置
     */
    guide : {
        lineColor : "#d72e2e",
        lineAlpha : 1,
        dashLength : 2,
        inside : true,
        labelRotation : 90
    },
	/**
     * 只给柱状图和面积图使用有效
     */
	stackType : ["regular", "100%", "3d", "none"]
};
$.widget( "sweet.widgetChartLine", $.sweet.widgetChart, /** @lends Sweet.chart.Line.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget-chart-line]:",
    eventNames : /** @lends Sweet.chart.Line.prototype*/{
        /**
         * @event
         * @description 图上的节点或柱的单击事件，需要在数据中配置drillable属性：drillable=" "(值为空字符，不是没有)
         * @param {Event} evt 事件对象
         * @param {Object} data 点击的节点的数据信息
         */
        click: "图的单击事件"
    },
    maxPacket : 11,
	options : /** @lends Sweet.chart.Line.prototype*/{
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
         * 设置category(x轴)上的label的旋转角度，默认不旋转
         * @type number
         * @default 0
         */
        labelRotation : 0,
        /**
         * 图中值和key的实例，由于历史原因，现在是二维数组：["text",["value","NSC1","left","line/column"],...]
         * 其中第一个"text"代表x轴的数据在data中对应的value；从第二个数组数据，才代表每个图的信息，其中包含与data中对应的
         * value和图的title,依次顺序代表为：图对应的value，图的名称，此图属于左轴还是右轴，此图的类型
         * 重要：现在在"图的类型"后面再添加"descriptionField"项，用来表示不同图的描述信息(用户自定义)，和value使用方法一样；
         * @type Array
         * @default ["text"]  x轴的field
         */
        dataKeys : ["text"],
        /**
         * 图的类型，其值有: "area","line","column","columnline","bar"
         * @type string
         * @default "line" 不设置此值，默认为折线图,其它值参看Sweet.constants.graphType
         */
        graphType : Sweet.constants.graphType.LINE,
        /**
         * stack图的类型,配合graphType可产生面积堆积图、柱状堆积图等
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
         * 图的图例是否可以点击，以隐藏或显示 相应图形
         * @type boolean
         * @default true
         */
        switchable : true,
        /**
         * 用户自定义颜色值，只对条形图，柱状图有效，其它图形颜色值设置无效
         * 颜色值请使用下面的值，如果没有相应的值，请找UCD zhaoting 给合适的值
         * 颜色：红:"#f56161",黄:"#f1b32c",绿:"#57aa4f"，灰:"#97A9B6"
         * 需要在数据中配置指定color:[{text : "2013-10-12", value : "254", color : "#57aa4f"},...]
         * 当设定为true且data中配置color属性时，才生效，
         * @type boolean
         * @default false
         */
        definedColor : false,
        /**
         * 无数据时，折线是否连接起来，而不是断开
         * @type boolean
         * @default false
         */
        connect : false,
        /**
         * 左边Y轴的最大数值
         * @type number
         * @default null
         */
        maxnumLeft : null,
        /**
         * 右边Y轴的最大数值
         * @type number
         * @default null
         */
        maxnumRight : null,
        /**
         * y轴的值从什么地方开始（最小值），如果设置值，使用数组，第一个为左轴的，第二值为右轴的，
         * @type Array
         * @default ["", ""]
         */
        minimum : ["", ""],
        /**
         * y轴上的数值是否只显示整数的形式，默认不是只显示整数，由于支持两个轴，所以是数组，第一个代表左轴的配置，第二个代表右轴的配置
         * @type Array
         * @default [false, false]
         */
        integersOnly : [false, false],
        /**
         * 鼠标移动到图上时，提示框中的文字的布局方向，支持："middle", "left", "right"
         * @type String
         * @default "middle"
         */
        balloonTextAlign : "middle",
        /**
         * 鼠标移动到图上时，提示框中的内容的格式，主要用于用户自定义时用，一般使用组件默认的即可；一般用到的格式为："[[title]]: [[percents]]% ([[value]])"
         * title对应图例的名称；percents对应当前数值的百分比；value对应当前的值；还可以添加上"[[description]]",其值与value的一样，需要在dataKeys中配置才能生效；
         * 所以在data数据中和dataKeys中都要配置对应关系，最后在balloonText中配置显示格式；
         * @type String
         * @default "" 
         */
        balloonText : "",
		/**
         * 鼠标移动到图上时，只显示当前鼠标移动到的点的提示内容，即只显示一个提示(isCursor必须为true才有效果)
         * @type boolean
         * @default false
         */
        oneBalloonOnly : false
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
		originalData.item = JSON.parse(JSON.stringify(event.item.dataContext));
		/* 当前点击点所在的legend对象的值，用legendValue表示 */
		originalData.legendValue = event.item.graph.title;
		/* 点击这个点的值，用data表示 */
		originalData.data = event.item.values.value;
        originalData.valueField = event.graph.valueField;
		
        if(func){
            func(event, originalData);
        } else {
            me._trigger("click", event, originalData);
        }
    },
    
	/**
	 * @private
	 * @description 去激活注册事件
     * @param {string} eName 去除的事件的名称，不传或为空时，去除全部的注册事件
	 */
	_removeListener: function(eName) {
		var me = this;
		me.handlers = me.handlers || {};
        if(!eName || eName === ""){
            $.each(me.handlers, function(eventName, func) {
                me.chartElement.removeListener(me.chartElement, eventName, func);
            });
        } else {
            $.each(me.handlers, function(eventName, func) {
                if(eName === eventName){
                    me.chartElement.removeListener(me.chartElement, eventName, func);
                }
            });
        }
	},
		
	/**
     * @private
     * @description 注册事件
     */
	_addListener : function(){
		var me = this;
        $.each(me.handlers, function(eventName, func) {
            if(eventName === "click"){
                me.chartElement.addListener("clickGraphItem", function(evt){
                    me._onClick(evt, me, func);
                });
            }
        });
	},
    
    /**
     * @parivate
     * @description 创建js版折线图
     */
    _createJsChart : function() {
        var me = this,
            options = me.options,
            lineEl,
            temp = {},
            chartElement,
            data = options.data;
        if(!$.isNull(options.dataKeys) && options.dataKeys.length === 0){
            options.dataKeys = ["text"];
        }
        if(data.length === 0 && !options.parseDate){
            temp = {};
            temp[options.dataKeys[0]] = Sweet.core.i18n.chart.noDataTips;
            me.options.data = [temp];
        }
        me.lineId = options.id + "-lineEl";
        lineEl = me.lineEl =  $("<div>").attr("id", me.lineId)
                .width(options.width).height(options.height)
                .appendTo(me.chartEl);
        /* 绘制折线图 */
        chartElement = me.chartElement = new AmCharts.AmSerialChart();
        chartElement.pathToImages = Sweet.amchartsImagePath;
        chartElement.categoryField = options.dataKeys[0];
        chartElement.dataProvider = data;
		chartElement.numberFormatter = {
            precision: -1, 
            decimalSeparator: '.', 
            thousandsSeparator: ','
        };
		/* balloon的设置，使用默认值 */
		chartElement.balloon.adjustBorderColor = config.balloon.adjustBorderColor;
		chartElement.balloon.fillColor = config.balloon.fillColor;
		chartElement.balloon.cornerRadius = 5;
		chartElement.balloon.pointerWidth = config.balloon.pointerWidth;
        chartElement.balloon.showBullet = true;
        chartElement.balloon.textAlign = options.balloonTextAlign;
		chartElement.color = chartElement.balloon.color = 
                chartElement.balloon.textShadowColor = me.textColor;
		/* 图的字体大小和形式 */
		chartElement.fontSize = me.fontSizeNormal;
		chartElement.fontFamily = me.chartFontFamily;
		if(options.graphType === Sweet.constants.graphType.COLUMN || 
                options.graphType === Sweet.constants.graphType.MIX_COLUMN_LINE){
            chartElement.columnWidth = 0.5;
        }
        
		/* 设置CategoryAxis和valueAxis信息及上面的阈值线 */
		me._setCategoryAxis();
		me.yAxis = me._createValueAxis();
		
        /* 绘图和添加图例等 */
		me._createGraphs();
        me._createJsCursor();
        me._createJsScrollbar();
        me._createJsLegend();
            if (options.graphType === Sweet.constants.graphType.BAR) {
                me._doAddUnitTitleFun = function() {
                    me._addUnitTitle();
                };
                me.chartElement.addListener("rendered", me._doAddUnitTitleFun);
            }
    },
    /**
     * @private
     * @description 创建具体的阈值线
     * @param {Object} axis 坐标轴对象
	 * @param {String} axisType 坐标轴类型valueAxis或categoryAxis
	 * @param {String/Number} guideValue 阈值线的值
     * @returns {object} axis 返回axis对象
     */
    _guide : function(axis, axisType, guideValue){
        var threshold = new AmCharts.Guide();
        var _lineColor = config.guide.lineColor,
                _guideValue = guideValue,
                _dashLength = config.guide.dashLength;
        if (guideValue && guideValue["color"]) {
            _lineColor = guideValue["color"];
        }
        if (guideValue && guideValue["value"]) {
            _guideValue = guideValue["value"];
        }
        if (guideValue && guideValue["dashLength"]) {
            _dashLength = guideValue["dashLength"];
        }
        /* 判断是横轴还是竖轴 */
        if (axisType === Sweet.constants.axisType.VALUE) {
            threshold.value = _guideValue;
        } else if (axisType === Sweet.constants.axisType.CATEGORY) {
            threshold.category = _guideValue;
        }
        /* 阈值线的样式值 */
        threshold.lineColor = _lineColor;
        threshold.lineAlpha = config.guide.lineAlpha;
        threshold.dashLength = _dashLength;
        threshold.inside = config.guide.inside;
        threshold.labelRotation = config.guide.labelRotation;
        threshold.balloonText = _guideValue;
        if (guideValue && guideValue["label"]) {
            threshold.label = guideValue["label"];
        }
        axis.addGuide(threshold);

        return axis;
    },
    
	/**
     * @private
     * @description 创建阈值线
	 * @param {Object} axis 坐标轴对象
	 * @param {String} axisType 坐标轴类型valueAxis或categoryAxis
	 * @param {Array/String/Number} guideValues 阈值线的值，可以是数组，创建多个阈值线
     */
	_createGuide : function(axis, axisType, guideValues){
        var me = this;
		if(!guideValues || guideValues === ""){
			return;
		}
		
        /* 设置guide时支持数组一次设置多个 */
		if(guideValues instanceof Array){
			for(var i = 0; i < guideValues.length; i++){
				me._guide(axis, axisType, guideValues[i]);
			}
		} else {
            /* 只设置一个guide时 */
			me._guide(axis, axisType, guideValues);
		}
	},
	
	/**
     * @private
     * @description 置categoryAxis的配置信息和阈值线
     */
	_setCategoryAxis : function() {
        var me = this,
            options = me.options,
            categoryAxis = me.chartElement.categoryAxis;
        /* 日期使用自动解析的方式,且一定要有数据，否则使用noData时会报错 */
        if(options.parseDate){
            categoryAxis.parseDates = true;
            categoryAxis.isParseDate = true;
            categoryAxis.minPeriod = options.xDateFormat;
            categoryAxis.equalSpacing = true;
        } else {
            categoryAxis.parseDates = false;
            categoryAxis.isParseDate = false;
            categoryAxis.minPeriod = "DD";
            categoryAxis.equalSpacing = false;
        }
        
        /* x轴的显示文字不进行截取 */
        categoryAxis.isPieText = false;
		categoryAxis.gridPosition = "start";
        /* 面积图时从axis开始显示 */
        categoryAxis.startOnAxis = options.graphType === Sweet.constants.graphType.AREA ? true : false;
		/*DTS2013121002395  start*/
		categoryAxis.autoGridFrequency = options.graphType === Sweet.constants.graphType.BAR ? true : false;
		/*DTS2013121002395 end*/
        /* 如果设置了旋转角度或步长，则使用用户设置的 */
        if(Number(options.labelRotation) !== 0){
            categoryAxis.autoGridFrequency = true;
            categoryAxis.labelRotation = Number(options.labelRotation);
        }
		/* 判断是否需要设置X轴的阈值 */
		if(options.xThresholdValue){
			me._createGuide(categoryAxis, Sweet.constants.axisType.CATEGORY, options.xThresholdValue);
		}
	},
	
	/**
     * @private
     * @description 创建并设置valueAxis的配置信息和阈值线
     */
	_createValueAxis : function() {
		var me = this,
            options = me.options,
            categoryAxis = me.chartElement.categoryAxis;
		
        /* 创建之前，先清空其中已有的值 */
        if(me.yAxis){
            if(me.yAxis.left){
                me.chartElement.removeValueAxis(me.yAxis.left);
            }
            if(me.yAxis.right){
                me.chartElement.removeValueAxis(me.yAxis.right);
            }
            me.yAxis = {};
            me.chartElement.valueAxes = [];
        }
        var yAxis = {},
            rightValueAxis,
            graphType = Sweet.constants.graphType,
		    /* 对不同的图形设置特殊的valueAxis的属性 */
            valueAxis = new AmCharts.ValueAxis();
            options.maxnumLeft ? valueAxis.maximum = options.maxnumLeft : "";
            //支持左y轴只显示整数值
            if(options.integersOnly && options.integersOnly[0]){
                valueAxis.integersOnly = options.integersOnly[0];
            }
        switch(options.graphType){
            case graphType.AREA :
            case graphType.BAR :
            case graphType.COLUMN :
            case graphType.MIX_COLUMN_LINE :
				options.stackType ? valueAxis.stackType = options.stackType : "";
                if(options.graphType === graphType.BAR){
                    /* bar图时，不设置Y轴的labelFrequency，恢复为默认值1 */
                    categoryAxis.labelFrequency = 1;
                } else if(options.graphType === graphType.MIX_COLUMN_LINE){
                    /* 混合图("columnline")时的情况，有两个Y轴 */
                    rightValueAxis = new AmCharts.ValueAxis();
                    rightValueAxis.position = "right";
                    //支持右y轴只显示整数值
                    if(options.integersOnly && options.integersOnly[1]){
                        rightValueAxis.integersOnly = options.integersOnly[1];
                    }
                    if(options.minimum[1] && $.type(options.minimum[1]) === "number"){
                        rightValueAxis.minimum = options.minimum[1];
                    }
                    options.maxnumRight ? rightValueAxis.maximum = options.maxnumRight : "";
                    me.chartElement.addValueAxis(rightValueAxis);
                    yAxis.right = rightValueAxis;
                }
                break;
        }
		
		/* UI规范中图Y轴必须从0开始,但有些场景趋势不明显，所以用户可以自己设置 */
        if(options.minimum[0] && $.type(options.minimum[0]) === "number"){
            valueAxis.minimum = options.minimum[0];
        }
        
		/* 判断是否需要设置Y轴的阈值 */
		if(options.yThresholdValue){
			me._createGuide(valueAxis, Sweet.constants.axisType.VALUE, options.yThresholdValue);
		}
		me.chartElement.addValueAxis(valueAxis);
        /* 默认为左边的竖轴 */
        yAxis.left = valueAxis;
        return yAxis;
	},
	
	/**
     * @private
     * @description 添加unit单位或者图的title
         * @param {Boolean} isCreateTitle 是否创建title
     */
        _addUnitTitle: function(isCreateTitle) {
        var me = this,
            options = me.options,
            unitText,
            leftUnitText,
            marginRight,
            rightUnitText,
            offset = 20,
            /* unit*/
            xUnit = offset,//(me.chartElement.marginLeft - offset)/2 + offset,
            /* y的值需要减去fontsize，再减去上下各5pix */
            yUnit = me.chartElement.marginTop - me.fontSizeNormal - 10;
		/* 添加title或label时，先清除已经有的,但不能清除title */
        me.chartElement.clearLabels();
		/* title */
            if (!$.isNull(options.chartTitle) && (me.preTitle !== options.chartTitle || isCreateTitle)) {
            /* 30为title的高度 */
            me.chartElement.titles = [];
            me.chartElement.addTitle(options.chartTitle, me.fontSizeLarger, 
                me.labelColor, me.labelAlpha, me.chartFontFamily);
            me.preTitle = options.chartTitle;   //记录title
		}
        /* 加55的来历：其中30为title原来增加的，另外25是title底部到图的间隔(小于真正的这段距离) */
		if(me.preTitle){
            yUnit += 33;
        }
        
		if(yUnit < 0){
			yUnit = 0;
		}
        
		/* 如果是stackType为100%,不管是否设置了单位，单位一定有且为% */
		if(options.stackType === config.stackType[1]){
			unitText = "%";
			me.chartElement.addLabel(xUnit, yUnit, unitText, "left", me.fontSizeNormal, me.textColor, 0, 1);
		}
		/* 增加左侧的axis的单位 */
		else if(options.leftUnit && options.leftUnit !== "") {
			leftUnitText = options.leftUnit;
                if (options.graphType === Sweet.constants.graphType.BAR) {
                    xUnit = $("#" + me.options.id).width() - offset;
                    me.chartElement.addLabel(xUnit, yUnit, leftUnitText, "right", me.fontSizeNormal, me.textColor, 0, 1);
                } else {
			me.chartElement.addLabel(xUnit, yUnit, leftUnitText, "left", me.fontSizeNormal, me.textColor, 0, 1);
		}
            }
        
        /* 右侧Y轴的单位 */
        if(options.rightUnit && options.rightUnit !== "") {
                if (options.graphType === Sweet.constants.graphType.BAR) {
                    yUnit += me.chartElement.plotAreaHeight + 33;
                }
            xUnit = $("#" + me.options.id).width() - offset;
            rightUnitText = options.rightUnit;
			me.chartElement.addLabel(xUnit, yUnit, rightUnitText, "right", me.fontSizeNormal, me.textColor, 0, 1);
        }
	},
		
	/**
     * @private
     * @description 创建graphs
     */
	_createGraphs : function() {
        var me = this,
            options = me.options,
            /* 图的个数 */
            lineNum = options.dataKeys.length - 1,
            /* 如果折线数超过maxPacket，将不对颜色进行指定 */
            colors = config.colors;
            
        me._addGraphs(lineNum, colors);
	},
	
    /**
     * @private
     * @description 循环将各个实例图加入到整个图中去
     * @param {type} lineNum  图的个数
     * @param {type} colors  图的颜色集合
     */
    _addGraphs : function(lineNum, colors){
        var me = this,
        options = me.options,
        graph,
        cEl = me.chartElement,
        graphType = Sweet.constants.graphType,
        sType = options.stackType,
        cfgSTpye = config.stackType[1],
        tempTValue = "",
        tipValue = "[[value]]",
        tipPercent = "[[percents]]%",
        tipTitle = "[[title]]: ",
        composeTP = tipTitle + tipPercent + " (" + tipValue + ")",
        composeTV = tipTitle + tipValue;
        me._graphs = {};
        for (var i = 1; i <= lineNum; i++) {
            graph = new AmCharts.AmGraph();
            graph.valueField = options.dataKeys[i][0];
            graph.descriptionField = options.dataKeys[i][4];
            graph.title = options.dataKeys[i][1];
            graph.type = config.graph.type;
            graph.connect = options.connect;
			/**"drillable"是dataprovider中field，表示此数据item是否可以进行钻取的标志
			*如果可以钻取，drillable=" ";(值为空字符，不是没有)如果不能钻取，则不设置此值。
			*/
			graph.drillField = "drillable";
			
			/* 支持用户配置自定义图的提示定义 */
			if(options.balloonText){
				graph.balloonText = options.balloonText;
			} else {
                tempTValue = options.leftUnit ? (composeTV + " " + options.leftUnit) : composeTV;
                graph.balloonText = (sType === cfgSTpye) ? composeTP : tempTValue;
			}
			/* 图例的提示格式 */
			graph.lineThickness = config.graph.lineThickness;
			/* 如果折线数超过maxPacket，将不对颜色进行指定 */
            if(lineNum > 0 && lineNum <= me.maxPacket){
                graph.lineColor = colors[i-1];
            }
            
            /* 用户自定义颜色值 */
            if(options.definedColor){
                graph.colorField = "color";
                graph.lineThickness = 0;
                delete graph.lineColor;
            }
            switch (options.graphType) {
                case graphType.AREA :
                    graph.lineAlphas = 1;
                    graph.fillAlphas = 0.6;
                    break;
                case graphType.BAR :
                case graphType.COLUMN :
                    /* 如果不是折线图,是柱状图，需要设置填充alphas为1 */
                    graph.fillAlphas = 1; 
                    graph.type = graphType.COLUMN;
                    options.graphType === graphType.BAR ? cEl.rotate = true : graph.labelText= "";
                    break;
                case graphType.LINE :
                    if(options.style === 1){
                        if(lineNum > 0 && lineNum <= me.maxPacket){
                            /* 折线图时，bullet的样式颜色 */
                            if(!$.isNull(graph.lineColor)){
                                graph.bulletBorderColor = graph.lineColor;
                            }
                            graph.bulletColor = "#ffffff";
                        }
                        graph.bullet = config.graph.bullet;
                    }
                    break;
                case graphType.MIX_COLUMN_LINE :
                    /* 混合图的情况，有两个Y轴，dataKeys[i][1]对应左轴，dataKeys[i][2]对应右轴,dataKeys[i][3]对应相应轴是line还是column */
                    var ttype = options.dataKeys[i][3];
                    if(ttype === graphType.LINE){
                        graph.type = graphType.LINE;
                    } else if(ttype === graphType.COLUMN || ttype === graphType.BAR){
                        graph.type = graphType.COLUMN;
                        graph.fillAlphas = 1;
                        options.graphType === graphType.BAR ? cEl.rotate = true : graph.labelText= "";
                    } else if(ttype === graphType.AREA){
                        graph.lineAlphas = 1;
                        graph.fillAlphas = 0.6;
                    }
                    
                    if(options.style === 1 && ttype === graphType.LINE){
                        graph.bullet = config.graph.bullet;
                        if(!$.isNull(graph.lineColor)){
                            graph.bulletBorderColor = graph.lineColor;
                        }
                        graph.bulletColor = "#ffffff";
                    }
                    
                    if(options.dataKeys[i][2] === "left"){
                        if($.isNull(ttype)){
                            graph.type = graphType.COLUMN;
                            graph.fillAlphas = 1;
                        }
                        graph.valueAxis = me.yAxis.left;
                    } else {
						/* 支持用户配置自定义图的提示定义 */
                        if(options.balloonText){
                            graph.balloonText = options.balloonText;
                        } else {
                            tempTValue = options.rightUnit ? (composeTV + " " + options.rightUnit) : composeTV;
                            graph.balloonText = (sType === cfgSTpye) ? composeTP : tempTValue;
                        }
                        graph.valueAxis = me.yAxis.right;
                    }
                    break;
            }
			me._graphs[graph.valueField] = graph;
            cEl.addGraph(graph);
        }
    },
    /**
     * @private
     * @description 改变了图中的属性时调用
     * @param {Boolean} isClear 设置数据时是否destroy图表
     */
    _setChangeProperty: function(isClear) {
        var me = this,
                options = me.options;
        //DTS2013081300532 add start
        /* dataKeys为空时的情况 */
        if ($.isNull(options.dataKeys) || (!$.isNull(options.dataKeys) && options.dataKeys.length === 0)) {
            options.dataKeys = ["text"];
        }
        
        me.chartElement.categoryField = me.options.dataKeys[0];
        /* data为空时的情况 */
        if ($.isNull(options.data) || (!$.isNull(options.data) && options.data.length === 0)) {
            me._setNoData();
        }
            if (me._doAddUnitTitleFun) {
                me.chartElement.removeListener(me.chartElement, "rendered", me._doAddUnitTitleFun);
                me._doAddUnitTitleFun = null;
            }
        //图性能优化
        if(isClear){
            if(me.chartElement){
                me.chartElement.destroy();
            }
            if(me.chartEl){
                me.chartEl.empty();
            }
            me._createJsChart();
			me._addListener();
            me.chartElement.dataProvider = me.options.data;
            me.rendered = false;
            me._chartRender(me.options.renderTo);
            me.rendered = true;
            me.chartElement.invalidateSize();
                if (me._doAddUnitTitleFun) {
                    me.chartElement.removeListener(me.chartElement, "rendered", me._doAddUnitTitleFun);
                    me._doAddUnitTitleFun = null;
                }
            /* 对单位进行重新定位 */
                if (options.graphType === Sweet.constants.graphType.BAR) {
                    if (!$.isNull(options.chartTitle) && (me.preTitle !== options.chartTitle)) {
                        me.chartElement.titles = [];
                        me.chartElement.addTitle(options.chartTitle, me.fontSizeLarger,
                                me.labelColor, me.labelAlpha, me.chartFontFamily);
                        me.preTitle = options.chartTitle;
                    }
                    me._doAddUnitTitleFun = function() {
                me._addUnitTitle(true);
                    };
                    me.chartElement.addListener("rendered", me._doAddUnitTitleFun);
                } else {
                    me._addUnitTitle(true);
                }
            return;
        }
        //DTS2013081300532 add end
        me.chartElement.dataProvider = me.options.data;
        /* 设置CategoryAxis信息及上面的阈值线 */
        me._setCategoryAxis();

        /* 设置valueAxis信息及上面的阈值线 */
        me.yAxis = me._createValueAxis();
        me._createGraphs();
        me.chartElement.invalidateSize();
            if (options.graphType === Sweet.constants.graphType.BAR) {
                if (!$.isNull(options.chartTitle) && (me.preTitle !== options.chartTitle)) {
                    me.chartElement.titles = [];
                    me.chartElement.addTitle(options.chartTitle, me.fontSizeLarger,
                            me.labelColor, me.labelAlpha, me.chartFontFamily);
                    me.preTitle = options.chartTitle;
                }
                me._doAddUnitTitleFun = function() {
        me._addUnitTitle();
                };
                me.chartElement.addListener("rendered", me._doAddUnitTitleFun);
            } else {
                me._addUnitTitle();
            }
    },
    /**
     * @private
     * @description 只更新数据 
     */
    _updateData : function(){
        var me = this;
        me.chartElement.dataProvider = me.options.data;
        me.chartElement.validateData();
    },
    /**
     * @private
     * @description 创建cursor
     */
    _createJsCursor : function() {
        var me = this;
        if (me.options.isCursor) {
            var chartCursor = new AmCharts.ChartCursor();
            chartCursor.bulletsEnabled = true;
			chartCursor.oneBalloonOnly = me.options.oneBalloonOnly;
            if(me.options.parseDate){
                chartCursor.categoryBalloonDateFormat = me.options.categoryBalloonDateFormat;
            }
			/* UI规范的内容 */
            chartCursor.cursorPosition = config.cursor.cursorPosition;
            chartCursor.dashLength = 8;
			chartCursor.cursorColor = chartCursor.categoryBalloonColor = config.cursor.categoryBalloonColor;
            me.chartElement.addChartCursor(chartCursor);
        }
    },
    
    /**
     * @private
     * @description 创建scrollbar
     */
    _createJsScrollbar : function() {
        if (this.options.isScrollbar) {
            var chartScrollbar = new AmCharts.ChartScrollbar();
			/* UI规范的内容 */
			chartScrollbar.backgroundColor = "#e2ebf4";
			chartScrollbar.scrollbarHeight = 15;
            this.chartElement.addChartScrollbar(chartScrollbar);
        }
    },
    /**
     * @private
     * @description 创建legend
     */
    _createJsLegend: function() {
        var me = this;
        if (me.options.isLegend) {
            var legend = new AmCharts.AmLegend();
            legend.position = config.legend.position;
            //UI规范的内容
            legend.align = config.legend.align;
            legend.valueAlign = "left";
            legend.markerType = config.legend.markerType;
            legend.color = me.textColor;
            legend.valueWidth = 110;
            legend.switchType = "v";
            legend.switchable = me.options.switchable;
            if (!me.options.legendTips) {
                legend.valueText = "";
            }
            //Begin----------add for DTS2014031407008
            legend.addListener("hideItem", function(e) {
                if (!me._graphs) {
                    return;
                }
                me._graphs[e.dataItem.valueField].hidden = true;
            });
            legend.addListener("showItem", function(e) {
                if (!me._graphs) {
                    return;
                }
                me._graphs[e.dataItem.valueField].hidden = false;
            });
            //End----------add for DTS2014031407008
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
        if(!$.isNull(chartType)){
            options.graphType = chartType;
        }
        
        /* stack可以为undefined */
        options.stackType = stackType;
        me.chartElement.rotate = false;
        /* 更新各个和chart type相关的属性设置,设置CategoryAxis信息及上面的阈值线 */
		me._setChangeProperty();
    },
    /**
     * @private
     * @description 专门用来设置没有数据时的显示内容 
     */
    _setNoData : function(){
        var me = this;
        if($.isNull(me.chartElement.categoryField)){
            me.chartElement.categoryField = "text";
        }
        /* 因为没有数据时x轴显示为"没有数据"，所有parseDates为false才能显示 */
        if(!me.options.parseDate){
            var temp = {};
            temp[me.chartElement.categoryField] = Sweet.core.i18n.chart.noDataTips;
            me.options.data = [temp];
        } else {
            me.options.data = [];
        }
    },
    
    /**
     * @private
     * @description 当没有数据时，各自图设置自己格式的默认数据
     */
    _setDefaultData : function(){
        var me = this;
        //DTS2013081300532 add  start
        me._setNoData();
        //DTS2013081300532 add  end
        me._updateData();
    },
	/**
     * @parivate
     * @description 渲染折线图到相应的到div
     */
    _chartRender : function() {
        var me = this;
		if(me.rendered || !me.chartElement){
			return;
		}
        
        /* 渲染图*/
        me.chartElement.write(me.lineId);
        /* 添加unit或者title */
        me._addUnitTitle();
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
        
        me.chartElement.invalidateSize();
        /* 对单位进行重新定位 */
        me._addUnitTitle();
        }
});

/**
 * 折线图，面积图，条形图，柱状图组件
 */
Sweet.chart.Line = $.sweet.widgetChartLine;

}( jQuery ) );

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
 * @name Sweet.chart.Pie
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
 *  sweetTopo = new Sweet.chart.Pie({
 *      width : "100%",
 *      height : 600,
 *      data : data,
 *      renderTo : "sweet-pie"
 * });
 * </pre>
 */
(function( $, undefined ) {
/**
 * 饼图支持颜色集合
 */
var colorsPie = [["#369cd8"],
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
var fillGraphPath = Sweet.libPath + 'themes/default/core/images/chart/';
var pieConfigData = {
    // 3D属性描述
    depth3D : 0,
    angle : 0,
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
    }
};
var noData = [{text : Sweet.core.i18n.chart.noDataTips}];
    var noDataColor = "#A5A5A5";
$.widget( "sweet.widgetChartPie", $.sweet.widgetChart, /** @lends Sweet.chart.Pie.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget-chart-pie]:",
    eventNames : /** @lends Sweet.chart.Pie.prototype*/{
        /**
        * @event
        * @description 饼图块单击事件
        * @param {Event} evt 事件对象
        * @param {Object} data 点击的节点的数据信息
        */
        click: "饼图块单击事件"
    },
	options : /** @lends Sweet.chart.Pie.prototype*/{
        /**
         * 组件数据, 默认要求数据格式为[{"text":one, "value":1},{"text":two, "value":2}]
         * @type Array
         * @default []
         */
        data : [],
        /**
         * 饼图组件数据key值
         * @type Array
         * @default ['text', 'value']
         */
        dataKeys : ['text', 'value'],
        /**
         * 饼图中tips与饼之间的距离,设置为负值，表示tip在饼图中显示
         * @type number
         * @default 15
         */
		labelRadius : 15,
        /**
         * 是否显示图例
         * @type boolean
         * @default true
         */
        isLegend : true,
        /**
         * 饼图的填充是否使用颜色图片，否则使用纯色进行填充
         * @type boolean
         * @default false  默认为false，dashborad现在使用的true
         */
        fillGraph : false,
        /**
         * 饼图的标题内容
         * @type string
         * @default ""
         */
        title : "",
        /**
         * 表示是3D还是2D图
         * @type number
         * @default 2
         */
        depth3D : 2,
        /**
         * 图旋转的角度
         * @type number
         * @default 0
         */
        angle : 0,
        /**
         * 图例的位置，使用的值为"right","left","top","bottom"
         * @type string
         * @default "right"
         */
        position : "right",
        /**
         * 饼图上的文字，一般显示饼图的百分占比，如果不显示，设置为""
         * @type String
         * @default "[[percents]]%"
         */
        labelText : "[[percents]]%",
        /**
         * 点击饼图时，是否一直只有一块饼在out
         * @type boolean
         * @default false
         */
        pullOutOnlyOne : false,
        /**
         * 饼图是否自动根据屏幕分辨率显示相应的样式，具体：在<=1024时，饼图上不显示label提示；
         * 在<=1350的情况下，最小半径为30px，并且图例间的垂直间隔各不相同。
         * @type boolean
         * @default false
         */
        autoScreenDisplay : false,
        /**
         * 图例的中文最多显示多少个字符，多于的添加"...",不出提示，在饼图上提示
         * @type Number
         * @default 10
         */
        maxLegendTextZH : 10,
        /**
         * 图例的英文最多显示多少个字符，多于的添加"...",不出提示，在饼图上提示
         * @type Number
         * @default 20
         */
        maxLegendTextEN : 20,
        /**
         * 饼图的最小半径
         * @type Number
         * @default 10
         */
        minRadius : 10,
        /**
         * 饼图上的百分比数据保留的小数位数，0表示全部取整,负数表示不处理全部显示
         * @type Number
         * @default 2
         */
        precision : 2,
        /**
         * 是否应用dashboard的样式
         * @type Boolean
         * @default false
         */
        dashboard: false,
        /**
         * 鼠标移动到饼图时的提示信息的格式
         * @type string
         * @default "[[title]]: [[percents]]% ([[value]])"
         */
        balloonText : "[[title]]: [[percents]]% ([[value]])",
        /**
         * 饼图中描述信息的key值,例如：可以在balloonText提示信息中使用"[[title]]: [[percents]]% ([[description]])"
         * @type String
         * @default ""
         */
        descriptionField : "",
        /**
         * 图的图例是否可以点击，以隐藏或显示 相应图形
         * @type boolean
         * @default true
         */
        switchable : true,
        /**
         * 是否对传入的数据进行从大到小的排序，默认组件排序，如果用户自己排序，请设置此值为false
         * @type boolean
         * @default true
         */
        isSortForData : true,
		/**
         * 饼图上的百分比小于此值时会隐藏不显示label，默认值为6(UCD给出的最佳数值)
         * @type Number
         * @default 6
         */
		hideLabelsPercent : 6
    },
    
    /**
     * @private
     * @description 饼图的点击事件,如果有配置钻取信息，则点击出菜单进行钻取
     * @param {Object} evt 饼图点击区域事件对象
	 * @param {object} me 饼图对象
     * @param {function} func (event, data) 通过addListener注册的回调函数
     */
    _onClick : function(evt, me, func) {
		var x = evt.chart.mouseX,
            y = evt.chart.mouseY,
            dataContext = evt.dataItem.dataContext,
            chartData = evt.chart.dataProvider,
            tempData,
            menuItem;
		/**取得当前点击块是否有钻取菜单信息*/
		for(var i = 0; i < chartData.length; i++){
            tempData = chartData[i];
            if(!$.isNull(tempData.menu)){
                menuItem = JSON.parse(JSON.stringify(tempData.menu));
                delete tempData.menu;
                var isEqual = $.equals(tempData, dataContext);
                tempData.menu = menuItem;
                if(isEqual){
                    break;
                } else {
                    menuItem = null;
                }
            }
		}
		
		/**点击图中任何位置，需要先去掉已经存在的menu*/
		if(me.menu){
			me.menu.hide();
		}
		
		/**如果有钻取菜单，点击需要显示菜单*/
		if(menuItem){
            var menuDivId = me.options.id + "-pie-menu",
                menuDiv;
            if($("#" + menuDivId).length === 0){
                menuDiv = $("<div>").attr("id", menuDivId);
            } else {
                menuDiv = $("#" + menuDivId);
            }
            menuDiv.appendTo($("#" + me.options.renderTo));
			me.menu = new Sweet.menu.Menu({
				renderTo: menuDivId,
				X: x,
				Y: y,
				items: menuItem,
				itemSelect: function(itemEvent, itemInfo){
                    var temp = {
                        "event": itemEvent, 
                        "itemInfo": itemInfo,
                        "value": dataContext
                    };
                    //通过addListener注册的回调函数
                    if(func){
                        func(evt, temp);
                    } else {
                        me._trigger("click", evt, temp);
                    }
				}
			});
		} else {
            //通过addListener注册的回调函数
            if(func){
                func(evt, dataContext);
            } else {
                me._trigger("click", evt, dataContext);
            }
		}
    },
	
	/**
	 * @private
	 * @description 关闭浮动窗口(饼图钻取弹出的menu菜单),框架统一调用。
	 */
	_closeFloatPanel: function(){
	},
	
	/**
	 * @private
	 * @description 去激活注册事件
     * @param {Sting} eName 去除的事件的名称，不传或为空时，去除全部的注册事件
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
    _addListener : function() {
		var me = this;
        $.each(me.handlers, function(eventName, func) {
            if(eventName === "click"){
                me.chartElement.addListener("clickSlice", function(evt){
                    me._onClick(evt, me, func);
                });
            }
        });
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
     * @parivate
     * @description 创建js版饼图
     */
    _createJsChart : function() {
        var me = this,
            options = me.options,
            pieId,
            pieEl,
            w = options.width,
            h = options.height,
            cc = Sweet.constants.chart,
            chartElement;
        
        pieId = me.pieId = me.options.id + "-pieEl";
        pieEl = me.pieEl = $("<div>").attr("id", pieId).height(h).width(w)
                .appendTo(me.chartEl);
        chartElement = me.chartElement = new AmCharts.AmPieChart();
        chartElement.balloonText = options.balloonText;
        var scW = window.screen.width,
                fontSize = cc.fontSize.larger,
                markerSize = 16,
                legendverticalGap = 10;
        if(options.autoScreenDisplay){
            if(scW < 1280){
                markerSize = 12;
                fontSize = cc.fontSize.normal,
                legendverticalGap = 0;
                chartElement.minRadius = 30;
                chartElement.labelsEnabled = false;
                chartElement.pullOutRadius = "10%";
                chartElement.balloonText = "[[percents]]%([[value]])";
            } else if(scW <= 1680 && scW >= 1280){
                fontSize = cc.fontSize.normal;
                chartElement.minRadius = 30;
                legendverticalGap = 2;
                markerSize = 14;
            } else if(scW > 1680){
                legendverticalGap = 3;
            }
        }
        me.fontSize = fontSize;
        me.pageFontSize = fontSize - 2 < cc.fontSize.normal?cc.fontSize.normal:fontSize - 2;
            chartElement.labelText = options.labelText;
        me._setChartProperty();
        chartElement.depth3D = options.depth3D;
        chartElement.pullOutOnlyOne = options.pullOutOnlyOne;
        chartElement.angle = options.angle;
		chartElement.labelRadius = options.labelRadius;
        chartElement.fontSize = me.pageFontSize;
        chartElement.fontFamily = cc.fontFamily;
        chartElement.hideLabelsPercent = options.hideLabelsPercent;
        chartElement.marginBottom = 0;
        chartElement.marginTop = 0;
        chartElement.numberFormatter = {
            precision: -1, 
            decimalSeparator: '.', 
            thousandsSeparator: ','
        };
        chartElement.percentFormatter = {
            precision: options.precision, 
            decimalSeparator: '.', 
            thousandsSeparator: ','
        };
        //balloon的设置，使用UI规范设置的值
		chartElement.balloon.adjustBorderColor = true;
		chartElement.balloon.fillColor = "#ffffff";
		chartElement.balloon.cornerRadius = 0;
		chartElement.balloon.pointerWidth = 5;
        //======= add DTS2014041806537==============================
        chartElement.balloon.isPieBalloon = true;
        //======= add DTS2014041806537==============================
		chartElement.color = chartElement.balloon.color = 
                chartElement.balloon.textShadowColor = cc.textColor;
        //设置填充颜色还是图片
        if(options.fillGraph){
            chartElement.textureMap = $.objCopy(pieConfigData.textureMap);
        }
        
        // 设置legned
        if (options.isLegend) {
			//除了在此设置的，其它属性值使用amChart的默认值
			var legend = new AmCharts.AmLegend();
			legend.switchType = "V";
            legend.switchable = me.options.switchable;
            legend.textClickEnabled = me.options.switchable ? false : true;
            legend.fontSize = me.pageFontSize;
			legend.color = cc.textColor;
			//legend的位置，使用的值为"right","left","top","bottom"
            legend.position = options.position;
            legend.maxLegendTextZH = options.maxLegendTextZH;
            legend.maxLegendTextEN = options.maxLegendTextEN;
            legend.graphType = "pie";
			legend.valueText = "";
            legend.verticalGap = legendverticalGap;
            legend.marginRight = 0;
            legend.marginLeft = 0;
            legend.markerSize = markerSize;
            chartElement.addLegend(legend);
        }
    },
    /**
     * @private
     * @description 更新饼图的title 
     */
    _addTitle : function(){
        var me = this,
                cc = Sweet.constants.chart,
                options = me.options;
        if(!$.isNull(options.title) && me.title !== options.title) {
            me.chartElement.titles = [];
			me.chartElement.addTitle(options.title, me.fontSize,
                    cc.titleCfg.labelColor, cc.titleCfg.labelAlpha, cc.fontFamily);
            me.title = options.title;
		}
    },
    /**
     * @private
     * @description 改变了图中的属性时调用
     */
    _setChangeProperty : function(){
        var me = this;
        me._setChartProperty();
        me.chartElement.validateData();
        //由于amchart本身的原因，在饼图图例文字变短且宽度和高度固定时，需要dolayout
        me._doLayout();
    },
    /**
     * @private
     * @description 只更新数据 
     */
    _updateData : function(){
        var me = this;
        me._setChartProperty();
        me.chartElement.dataProvider = me.options.data;
        me.chartElement.validateData();
    },
    /**
     * @private
     * @description 设置饼图的data和datakeys及title
     */
    _setChartProperty : function(){
        var me = this,
            options = me.options,
                    dataLength = 0,
                    valueField,
                    colors = [],
                    noDataTxt = Sweet.core.i18n.chart.noDataTips,
                    iData,
                    tData;
            options.data = options.data || [];
            dataLength = options.data.length;
        me.chartElement.titleField = options.dataKeys[0];
        if($.isArray(options.dataKeys[1])){
            valueField = options.dataKeys[1][0];
        } else {
            valueField = options.dataKeys[1];
        }
        me.chartElement.valueField = valueField;
        if(options.descriptionField){
            me.chartElement.descriptionField = options.descriptionField;
        }
        
        // 对传入数据由小到大进行排序
        if(options.isSortForData){
            options.data.sort($.objSort(valueField, Sweet.constants.sortType.DESC));
        }

        // 设置颜色,最多11块，否则不指定颜色
        if(dataLength <= 11){
            if (options.dashboard) {
                    if (1 == dataLength) {
                        colors = colorsPie[dataLength - 1];
                    } else {
                for (var i = 0; i < dataLength; i++) {
                    colors.push(me._getColor(dataLength, i, true));
                        }
                }
                me.chartElement.colors = colors;
            }
            else {
                    if (dataLength <= 0) {
                        me.chartElement.colors = colors;
                    } else {
                me.chartElement.colors = colorsPie[dataLength-1];
            }
        }
            }
            if (!options.data || options.data.length <= 0) {
                me.chartElement.balloonText = noDataTxt;
                me.chartElement.labelText = noDataTxt;
                iData = {};
                iData[me.chartElement.titleField] = noDataTxt;
                iData["color"] = noDataColor;
                tData = [iData];
            } else {
                me.chartElement.balloonText = options.balloonText;
                me.chartElement.labelText = options.labelText;
                tData = options.data;
            }
            me.chartElement.dataProvider = tData;
        me._addTitle();
    },
	/**
     * @parivate
     * @description 渲染饼图到相应的到div
     */
    _chartRender : function() {
        var me = this;
		if(me.rendered){
			return;
		}
        
        //渲染饼图
        me.chartElement.write(me.pieId);
    },

	/**
     * @parivate
     * @description 组件宽度、高度发生变化后调用，进行页面重绘。
     */
    _doLayout : function() {
		var me = this;
		if(!me.rendered){
			return;
		}
        
        // 延迟重绘
        Sweet.Task.Delay.start({
            id: "sweet.widget.chart.pie.layout-" + this.options.id,
            run: function() {
                me._reDraw();
            },
            delay: 100
        });
	},
	
    /**
     * @description 容器改变大小后，重新绘制图
     * @returns {undefined}
     */
    _reDraw : function(){
        var me = this;
        // 重新绘制以适应容器大小
        me.chartElement.invalidateSize();
    },
    /**
     * @private
     * @description 组件销毁
     */
    _destroyWidget: function() {
        Sweet.Task.Delay.stop("sweet.widget.chart.pie.layout-" + this.options.id);

        this._super();
    }
});

// 饼图组件
Sweet.chart.Pie = $.sweet.widgetChartPie;

}( jQuery ) );

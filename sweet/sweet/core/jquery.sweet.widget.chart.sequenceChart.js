/**
 * @fileOverview 码流流程图
 * @date 2013/08/31
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建码流流程图
 * @name Sweet.chart.SequenceChart
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
 *  var data = [];
 *  sequenceChart = new Sweet.chart.SequenceChart({
 *      width : "100%",
 *      height : 600,
 *      data : data,
 *      renderTo : "sweet-sequenceChart"
 * });
 * </pre>
 */
(function( $, undefined ) {
    var flowDivClass = "SequenceChart-sequence",
        tipsDiv = "sweet-arrayindicator-infoDiv";
$.widget( "sweet.widgetChartSequenceChart", $.sweet.widgetChart, /** @lends Sweet.chart.SequenceChart.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget-chart-sequence-chart]:",
    eventNames : /** @lends Sweet.chart.SequenceChart.prototype*/{
        /**
         * @event
         * @description 横线上的文字的点击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 此横线上的所有数据信息
         */
        click : "click点击事件"
    },
	options : /** @lends Sweet.chart.SequenceChart.prototype*/{
        /**
         * 节点的宽度
         * @type number
         * @default 160
         */
        columnWidth : 160,
        /**
         * 组件的宽度
         * @type number
         * @default 1280
         */
        width : 1280,
        /**
         * 组件的高度
         * @type number
         * @default 800
         */
        height : 800,
        /**
         * 码流图的数据
         * @type object
         * @default {}
         */
        data : {}
    },
    /**
     * @description 为码流图设置数据
     * @param {object} data 设置的数据对象, 如果设置为空对象：{}
     */
    setData : function(data){
        if($.isNull(data)){
            return;
        }
        var me = this,
            options = me.options;
        me._initData();
        options.data = JSON.parse(JSON.stringify(data));
        me._dealNEInfo();
        me._setCanvasWH();
        me._createSequenceChart();
    },
    /**
     * @public
     * @description 码流图中的网元顺序发生改变时，调用此函数重绘码流图
     * @param {Array} neArr 顺序发生改变后的网元的名称集合，将以此顺序重绘图
     */
    sortChange : function(neArr){
        var me = this;
        if($.isNull(neArr) || neArr.length === 0 || neArr.length !== me.neInfo.length){
            return;
        }
        me.neInfo = JSON.parse(JSON.stringify(neArr));
        me.neCount = me.neInfo.length;
        me._setCanvasWH();
        me._createSequenceChart();
    },
    _createJsChart : function(){
        var me = this,
            options = me.options;
        
        //canvas画布对象id
        me.flowCanvasId = options.id + "-canvas";
        me.flowEl = $("<div>").attr({id : options.id+"-flow"})
                .height(options.height).width(options.width)
                .addClass(flowDivClass).css({"overflow" : "auto"});
        //创建canvas
        me.flowCanvasEl = $("<Canvas>").attr({id : me.flowCanvasId, width: options.width, height : options.height})
                .appendTo(me.flowEl);
        me.context = me.flowCanvasEl.get(0).getContext('2d');
        me._readyGo();
        me._bindEvent();
        //根据数据来判断是否需要往下画图
        if(!$.isNull(options.data) && !$.isNull(options.data.result) && options.data.result.length > 0){
            //找到有多少个网元，计算网元所占有的宽度，以此来设置flowCanvasEl的宽度
            me._dealNEInfo();
            me._setCanvasWH();
            me._createSequenceChart();
        }
    },
    /**
     * @private
     * @param {Event} evt 事件对象
     * @param {Array} nodes 所有实线上的文字坐标等记录的集合
     * @returns {object} 返回鼠标是否在指定的node范围内
     */
    _isScope : function(evt, nodes){
        var me = this, cx = 0, cy = 0, temp, i = 0;
        if($.isFirefox()){
            cx = evt.pageX - me.flowCanvasEl.offset().left;
            cy = evt.pageY - me.flowCanvasEl.offset().top;
        } else if($.isChrome() || $.isIE()){
            cx = evt.offsetX;
            cy = evt.offsetY;
        }
        //根据鼠标当前坐标是否在其相应的坐标范围内
        for(i = 0; i < nodes.length; i++){
            temp = nodes[i];
            if(cx >= temp.left && cx <= temp.left + temp.width && 
                cy >= temp.top && cy <= temp.top + temp.height){
                return {
                    isScope : true,
                    node : JSON.parse(JSON.stringify(temp))
                };
            }
        }
        return false;
    },
    _bindEvent : function(){
        var me = this, ctx = me.context;
        //绑定点击事件
        me.flowCanvasEl.bind("click", function(evt){
            //根据文字的坐标范围找到相应点击的文字信息
            var info = me._isScope(evt, me.textOnLineInfo);
            if(info && info.isScope){
                //说明在范围内，调用用户注册的click事件,同时需要改变字体样式
                if(!$.isNull(me.eventMap.click) && $.isFunction(me.eventMap.click)){
                    me.eventMap.click(evt, info.node.line);
                }
            }
        });
        //绑定mousemove事件，改变鼠标移动上去的样式为手形,同时显示网元和线上文字的tips提示
        me.flowCanvasEl.bind("mousemove", function(evt){
            var info = me._isScope(evt, me.textOnLineInfo);
            var neInfo = me._isScope(evt, me.netElementsInfo);
            if(!$.isNull(me.tipDiv)){
                me.tipDiv.remove();
            }
            if(info && info.isScope){
                //说明在范围内，改变鼠标样式为手形
                me.flowCanvasEl.css("cursor", "pointer");
                me.tipDiv = $("<div>").addClass(tipsDiv).appendTo("body");
                $("<span>").html(info.node.line.name).appendTo(me.tipDiv);
                me.tipDiv.position({
                    my : "left+5 bottom-10",
                    of : evt,
                    collision : "flipfit"
                });
            } else if(neInfo && neInfo.isScope){
                //说明在范围内，改变鼠标样式为手形
                me.tipDiv = $("<div>").addClass(tipsDiv).appendTo("body");
                $("<span>").html(neInfo.node.neDesc).appendTo(me.tipDiv);
                me.tipDiv.position({
                    my : "right+5 bottom-10",
                    of : evt,
                    collision : "flipfit"
                });
            } else {
                if(!$.isNull(me.tipDiv)){
                    me.tipDiv.remove();
                }
                me.flowCanvasEl.css("cursor", "default");
            }
        });
        me.flowCanvasEl.bind("mouseout", function(evt){
            if(!$.isNull(me.tipDiv)){
                me.tipDiv.remove();
            }
        });
    },
    _setCanvasWH : function(){
        var me = this,
            options = me.options,
            textWidth = 0, cWidth = 0, cHeight = 0,
            i = 0, count = me.neCount, colWidth = options.columnWidth,
            data = options.data,
            result = data.result?data.result:[],
            len = result.length;
        
        me.timeTextMaxWidth = 0;
        for(i = 0; i < len; i++){
            me.context.save();
            me.context.font = "12px Tahoma";
            textWidth = me.context.measureText(result[i].time).width;
            me.context.restore();
            //记录左边text最大的宽度
            if(textWidth > me.timeTextMaxWidth){
                me.timeTextMaxWidth = textWidth;
            }
        }
        if(me.timeTextMaxWidth > me.maxTextWidth){
            //如果大于最大值，就使用最大值
            me.timeTextMaxWidth = me.maxTextWidth;
        }
        cWidth = me.leftMargin*2 + me.timeTextMaxWidth + me.textToChart + ((count===0?1:count)-1)*colWidth;
        //30表示底部空出的部分
        cHeight = ((len===0?1:len)-1)*me.rowSpace + me.headerHeight+30;
        me.flowCanvasEl.attr({width: cWidth, height : cHeight});
    },
    /**
     * @private
     * @description 解析网元信息，计算网元个数并将网元名称存储起来
     */
    _dealNEInfo : function(){
        var me = this,
            i = 0,
            temp,
            tempne = {},
            options = me.options,
            data = options.data,
            result = data.result?data.result:[],
            len = result.length;
        
        me.neInfo = [];
        me.neCount = 0;
        for(i = 0; i < len; i++){
            temp = result[i];
            if(me.neInfo.length === 0){
                me.neInfo.push(temp.srcname);
                me.neInfo.push(temp.destname);
                tempne[temp.srcname] = 1;
                tempne[temp.destname] = 1;
                me.neCount = 2;
            } else {
                if($.isNull(tempne[temp.srcname])){
                    tempne[temp.srcname] = 1;
                    me.neInfo.push(temp.srcname);
                    me.neCount++;
                }
                if($.isNull(tempne[temp.destname])){
                    tempne[temp.destname] = 1;
                    me.neInfo.push(temp.destname);
                    me.neCount++;
                }
            }
        }
    },
    _createSequenceChart : function(){
        var me = this,
            options = me.options,
            data = options.data,
            result = data.result?data.result:[],
            len = result.length,
            i = 0,
            //文字的宽度
            textWidth = 0,
            x = me.leftMargin, y = 0;
        
        me.timeTextMaxWidth = 0;
        for(i = 0; i < len; i++){
            //画左边的时间文字
            x = me.leftMargin;
            y = me.rowSpace * i + me.headerHeight;
            textWidth = me._createText(result[i].time, x, y, {
                fillStyle : "#3c3c3c",
                textAlign : "start",
                maxTextWidth : me.maxTextWidth,
                font : "12px Tahoma"
            });
            //记录左边text最大的宽度
            if(textWidth > me.timeTextMaxWidth){
                me.timeTextMaxWidth = textWidth;
            }
        }
        if(me.timeTextMaxWidth > me.maxTextWidth){
            //如果大于最大值，就使用最大值
            me.timeTextMaxWidth = me.maxTextWidth;
        }
        
        me._createNEAndText();
        me._drawLineAndName();
    },
    _createNEAndText : function(){
        var me = this,
            options = me.options,
            neInfo = me.neInfo,
            i = 0,
            temp, left = 0,
            p1 = {},
            p2 = {},
            x = 0, y = 0, textWidth = 0, maxWidth = options.columnWidth;
        me.netElsXY = [];
        me.netElementsInfo = [];
        for(i = 0; i < neInfo.length; i++){
            //网元名称
            temp = neInfo[i];
            x = me.leftMargin + me.timeTextMaxWidth + me.textToChart + i*options.columnWidth;
            y = Math.floor(me.headerHeight/2);
            textWidth = me._createText(temp, x, y, {
                maxTextWidth : maxWidth,
                textAlign : "center",
                font : "16px Tahoma"
            });
            if(textWidth > maxWidth){
                textWidth = maxWidth;
            }
            //记录每个网元的坐标信息和网元名称
            me.netElsXY.push({
                name : temp,
                x : x,
                y : y
            });
            p1 = {
                x : x,
                y : me.headerHeight - 23
            };
            p2 = {
                x : x,
                y : (options.data.result.length-1)*me.rowSpace + me.headerHeight
            };
            //网元下的竖直直线
            me._drawLine(p1, p2, "#d2d2d2", false);
            left = x - textWidth/2;
            me.netElementsInfo.push({
                //此行相关的信息集合
                neDesc : temp,
                //重绘时文字x的坐标
                tx : x,
                //重绘时文字y的坐标
                ty : y,
                //重绘时文字的最大值
                maxWidth : maxWidth,
                //判断范围时的top
                top : y-15,
                //判断范围时的left
                left : left,
                //判断范围时txet的宽度
                width : textWidth,
                //判断范围时txet的高度
                height : 15
            });
        }
    },
    _drawLineAndName : function(){
        var me = this,
            options = me.options,
            data = options.data,
            result = data.result?data.result:[],
            len = result.length,
            //网元个数
            netLen = me.netElsXY.length,
            i = 0, temp,
            p1 = {}, p2 = {},
            src = {}, dest = {},
            color = "blue",
            x = 0, y = 0;
        me.textOnLineInfo = [];
        for(i = 0; i < len; i++){
            temp = result[i];
            y = me.rowSpace * i + me.headerHeight - 4;
            //y-4是为了虚线画在文字的中间,找到第一个网元和最后一个网元，画出两者之间的虚线
            p1 = {x : me.netElsXY[0].x, y : y};
            p2 = {x : me.netElsXY[netLen-1].x, y : y};
            me._drawDotLine(p1, p2, false, "#647796");
            
            //下面画实线，先设置坐标信息
            src.x = me._findByName(temp.srcname).x;
            dest.x = me._findByName(temp.destname).x;
            //修正箭头的位置
            if(src.x < dest.x){
                dest.x = dest.x - me.arrowHeight;
            } else {
                dest.x = dest.x + me.arrowHeight;
            }
            src.y = dest.y = y;
            //取得颜色值
            color = me._getColor(temp);
            //画带箭头的实线
            me._drawLine(src, dest, color, true);
            //画实线上的文字
            var dirIndex = me._getDirectionSpaceIndex(temp);
            var maxWidth = dirIndex.space*options.columnWidth;
            var textColor = "#3c3c3c", font = "12px Tahoma";
            if(temp.isErrorColor === "1"){
                textColor = !$.isNull(temp.textColor) ? temp.textColor : "red";
                font = "12px Tahoma solid";
            } else {
                textColor = "#3c3c3c";
            }
            var tX = 0, tY = y - 6, textWidth = 0,left = 0;
            if(dirIndex.direction === "left"){
                tX = dest.x + maxWidth/2;
            } else {
                tX = src.x + maxWidth/2;
            }
            textWidth = me._createText(temp.name, tX, tY, {
                maxTextWidth : maxWidth,
                fillStyle : textColor,
                textAlign : "center",
                font : font
            });
            if(textWidth > maxWidth){
                textWidth = maxWidth;
            }
            left = tX - textWidth/2;
            //保存text的坐标、范围等信息，以便事件时使用到
            me.textOnLineInfo.push({
                //此行相关的信息集合
                line : temp,
                //重绘时文字x的坐标
                tx : tX,
                //重绘时文字y的坐标
                ty : tY,
                //重绘时文字的最大值
                maxWidth : maxWidth,
                //判断范围时的top
                top : tY-10,
                //判断范围时的left
                left : left,
                //判断范围时txet的宽度
                width : textWidth,
                //判断范围时txet的高度
                height : 10
            });
        }
    },
    /**
     * @private
     * @param {object} node 实线信息对象
     * @returns {object} 返回当前实线的方向:向左或向右，以及两者之间的间隔个数
     */
    _getDirectionSpaceIndex : function(node){
        var me = this, i = 0, sIndex = 0, eIndex = 0;
        for(i = 0; i < me.netElsXY.length; i++){
            if(node.srcname === me.netElsXY[i].name){
                sIndex = i;
            }
            if(node.destname === me.netElsXY[i].name){
                eIndex = i;
            }
        }
        return {
            direction : eIndex - sIndex < 0 ? "left" : "right",
            space : Math.abs(sIndex-eIndex)
        };
    },
    /**
     * @private
     * @description 取得实线的颜色值
     * @param {object} node  实线的信息
     * @returns {String} 返回实线的颜色值
     */
    _getColor : function(node){
        var me = this, i = 0, direction;
        //使用指定的颜色值
        if(node.isErrorColor === "1"){
            return node.color;
        } else if(node.isErrorColor === "0"){
            direction = me._getDirectionSpaceIndex(node).direction;
            //向左："#90cc19" 向右："#369cd8"
            return direction === "right" ? "#369cd8" : "#90cc19";
        }
        return "#000000";
    },
    _findByName : function(name){
        var me = this, i = 0;
        for(i = 0; i < me.netElsXY.length; i++){
            if(name === me.netElsXY[i].name){
                return me.netElsXY[i];
            }
        }
    },
    
    _createText : function(text, x, y, attr){
        var me = this,
            textWidth = 0,
            tempText = text,
            tempLen = 0,
            ctx = me.context;
        if($.isNull(attr)){
            attr = {};
        }
        ctx.save();
        ctx.textAlign = attr.textAlign ? attr.textAlign : "start";
        ctx.fillStyle = attr.fillStyle ? attr.fillStyle : "#3c3c3c";
        ctx.font = attr.font ? attr.font : "12px Tahoma";
        ctx.translate(x, y);
        if($.isNull(attr.maxTextWidth)){
            ctx.fillText(tempText, 0, 0);
        } else {
            textWidth = ctx.measureText(text).width;
            if(textWidth > attr.maxTextWidth){
                tempLen = Math.ceil(text.length*attr.maxTextWidth/textWidth);
                tempText = String(text).substr(0, tempLen-4)+"...";
            }
            ctx.fillText(tempText, 0, 0, attr.maxTextWidth);
        }
        ctx.restore();
        return textWidth;
    },
    _initData : function(){
        var me = this;
        //最左边时间text的最大宽度
        me.timeTextMaxWidth = 0;
        //网元信息：名称，按此顺序进行排列
        me.neInfo = [];
        //网元个数
        me.neCount = 0;
        //网元的名称和坐标信息
        me.netElsXY = [];
        //实线上的文字相关信息(范围、坐标等)，主要用于文字的点击事件等使用
        me.textOnLineInfo = [];
        //网元信息的提示时使用的信息集合，ne是网元的缩写
        me.netElementsInfo = [];
    },
    _readyGo : function(){
        var me = this;
        me.eventMap = {};
        //距离左边的间距
        me.leftMargin = 30;
        //text允许的最大宽度
        me.maxTextWidth = 200;
        //时间text右边到第一个网元的间距
        me.textToChart = 24;
        //网元元素的所占的高度
        me.headerHeight = 60;
        //行间距，UI规范规定为26，加上字体高度大约是8
        me.rowSpace = 26+8;
        //箭头的高度
        me.arrowHeight = 6;
        me._initData();
        var CCD = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
        if (CCD.lineTo) {
            CCD._dottedLine = function(x, y, x2, y2, dashArr) {
                if (!dashArr){
                    dashArr = [4,2];
                } 
                var me = this, dx = (x2-x), dy = (y2-y), len = 0,
                    rotate = Math.atan2(dy, dx);
                len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                me.save();
                me.translate(x, y);
                me.moveTo(0, 0);
                me.rotate(rotate);       
                var dc = dashArr.length, di = 0, draw = true;
                x = 0;
                while (len > x) {
                    x += dashArr[di++ % dc];
                    if (x > len){
                        x = len;
                    }
                    if(draw){
                        me.lineTo(x, 0);
                    } else {
                        me.moveTo(x, 0);
                    }
                    draw = !draw;
                }       
                me.restore();
            };
        }
    },
    _drawDotLine : function(p1, p2, bArrow, color){
        var me = this, ctx = me.context;
        //保持状态
        ctx.save();
        //是否需要画箭头
        if(bArrow){
            me._drawArrow(ctx, p1, p2, color);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        //画虚线
        ctx._dottedLine(p1.x, p1.y, p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
            
    _drawLine : function(p1, p2, color, bArrow){
        var me = this,
            lineWidth = 3,
            context = me.context;
        if(bArrow){
            me._drawArrow(context, p1, p2, color);
        }
        context.save();
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.stroke();
        context.closePath();
        context.restore();
    },
    
    _drawArrow : function(ctx, start, end, color){
        var me = this,
            transX = 0,
            arrowHeight = me.arrowHeight;
        ctx.save();
        ctx.fillStyle = ctx.strokeStyle = color;
        if(start.x <= end.x){
            transX = end.x + arrowHeight;
        } else {
            transX = end.x - arrowHeight;
        }
        ctx.translate(transX, end.y);
        if(end.y - start.y >= 0){
            ctx.rotate(Math.atan((end.x - start.x)/(end.y - start.y)));
        } else {
            ctx.rotate(Math.PI + Math.atan((end.x - start.x)/(end.y - start.y)));
        }
           
        ctx.beginPath();
        ctx.lineTo(-arrowHeight, arrowHeight); 
        ctx.lineTo(0, arrowHeight); 
        ctx.lineTo(arrowHeight, arrowHeight); 
        ctx.lineTo(0, 0); 
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    },
            
    _addListener : function(){
        var me = this;
        $.each(me.handlers, function(eventName, func){
           if(eventName === "click"){
               me.eventMap.click = func;
           } 
        });
    },
    
    _removeListener: function(eName) {
        var me = this;
        if($.isNull(eName)){
            me.handlers = {};
            me.eventMap = {};
        } else {
            if(eName === "click" && !$.isNull(me.eventMap.click)){
                delete me.eventMap.click;
            }
        }
    },
    _chartRender : function(){
        var me = this;
        if(me.rendered || $.isNull(me.flowEl)){
            return;
        }

        me.flowEl.appendTo(me.chartEl);
    }
});

// 码流图组件
Sweet.chart.SequenceChart = $.sweet.widgetChartSequenceChart;
}( jQuery ) );

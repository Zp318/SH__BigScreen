/**
 * @fileOverview 拓扑图
 * @date 2013/06/27
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建简单非交叉拓扑图
 * @name Sweet.chart.SimpleTopology
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
                    id: "node0",
                    text: "test1",
                    textOutUp : "95Mbps",
                    clickable: "false",
                    to : [{
                            id : "node1"
                    }]
                },
                {
                    id: "node1",
                    text: "test2",
                    textOutUp : "95Mbps",
                    clickable: "true",
                    to : [{
                            id : "node2"
                    }]
                },
                {
                    id: "node2",
                    text: "test3",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    textOutUp : "90Mbps",
                    textOutDown : "21w",
                    clickable: "true",
                    to : [{
                            id : "node3"
                        },
                        {
                            id : "node4"
                        },
                        {
                            id : "node5"
                        },
                        {
                            id : "node6"
                    }]
                },
                {
                    id: "node3",
                    text: "test4",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    textOutUp : "85Mbps",
                    textOutDown : "21w",
                    clickable: "false",
                    to : [{
                            id : "node7"
                    }]
                },
                {
                    id: "node4",
                    text: "test5",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    textOutUp : "85Mbps",
                    textOutDown : "21w",
                    clickable: "true",
                    to : [{
                            id : "node8"
                    }]
                },
                {
                    id: "node5",
                    text: "test6",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    textOutUp : "85Mbps",
                    textOutDown : "21w",
                    clickable: "true",
                    to : [{
                            id : "node8"
                    }]
                },
                {
                    id: "node6",
                    text: "test7",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    clickable: "true"
                },{
                    id: "node7",
                    text: "test9",
                    clickable: "false"
                },{
                    id: "node8",
                    text: "test8",
                    textInUp : "95Mbps",
                    textInDown : "24w",
                    clickable: "true"
                }]
 *  sweetTopo = new Sweet.chart.SimpleTopology({
 *      width : "100%",
 *      height : 600,
 *      data : data,
 *      renderTo : "sweet-topo"
 * });
 * </pre>
 */
(function( $, undefined ) {
var SVG_NS = "http://www.w3.org/2000/svg";   //svg的命名空间地址
var SVG_XLINK = "http://www.w3.org/1999/xlink";
var padding = 20;
/**
* 节点是矩形时的矩形的填充颜色
* @private
* @type string
* @default ["#a1a8b8","#747f97"]
*/
var rectColor = ["#a1a8b8","#747f97"];
/**
* 节点是矩形时且已经选中此节点时矩形的填充颜色
* @private
* @type string
* @default ["#7cadeb", "#3f87e1"]
*/
var rectselectedColor = ["#7cadeb", "#3f87e1"];
var topoUUID = 1;
var presuffix = "topo-blank-node-";
$.widget( "sweet.widgetChartSimpleTopology", $.sweet.widgetChart, /** @lends Sweet.chart.SimpleTopology.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget-chart-simple-topology]:",
    eventNames : /** @lends Sweet.chart.SimpleTopology.prototype*/{
        /**
         * @event
         * @description 节点的点击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前点击的节点的数据信息
         */
        nodeclick: "nodeclick",
        /**
         * @event
         * @description 节点的双击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前点击的节点的数据信息
         */
        nodedblclick : "nodedblclick",
        /**
         * @event
         * @description 节点的单击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前连线的数据信息
         */
        lineclick : "lineclick",
        /**
         * @event
         * @description 连线的双击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前连线的数据信息
         */
        linedblclick : "linedblclick"
    },
	options : /** @lends Sweet.chart.SimpleTopology.prototype*/{
        /**
         * 节点的宽度
         * @type number
         * @default 150
         */
        nodeWidth : 150,
        /**
         * 节点的高度
         * @type number
         * @default 50
         */
        nodeHeight : 50,
        /**
         * 列与列之间的间距
         * @type number
         * @default 150
         */
        levelSpace : 150,
        /**
         * 节点与节点之间竖直的间距
         * @type number
         * @default 50
         */
        nodeSpace : 50,
        /**
         * 节点连线的颜色
         * @type string
         * @default "black"
         */
        lineColor : "#cccccc",
        /**
         * 节点是否可以被选中
         * @type boolean
         * @default true
         */
        selectable : true
    },
    
    _createSVGElement : function(name){
        return document.createElementNS(SVG_NS, name);
    },
    
    _createJsChart : function(){
        var me = this,
            options = me.options;
        
        me.topoId = options.id + "-topo";
        me.topoEl = $("<div>").attr({id : me.topoId})
                .height(options.height).width(options.width).css("overflow", "auto");
        me.eventMap = {}; 
        me._readySVG();
        if(0 < options.data.length){
            me._draw();
        }
    },
    
    _readySVG : function(){
        var me = this;
        me.preClickRectId = "";
        me.rects = {};
        //保存所有node的svg dom对象<g>，key是节点的id
        me.nodes = {};
        //一列中最多的节点个数
        me.maxLevelNodes = 0; 
        //布局后最大高度
        me.maxHeight = 0;
        //布局后的最大宽度
        me.maxWidth = 0;
        //其中存放的是所有竖直的直线对象
        me.vpath = me._createSVGElement("g");
        //S中存储的是svg的dom结构及对象
        me.S = {};
        me.S.svg = me._createSVGElement("svg");
        me.S.group = me._createSVGElement("g");
        me.S.group.appendChild(me.vpath);
        me.S.defs = me._createSVGElement("defs");
        //创建直线的箭头
        me.marker = me._createMarker();
        me.S.defs.appendChild(me.marker);
        me.linearGradientId = me.options.id + "-linearGradient";
        //创建节点的渐变内容
        me.linearGradient = me._createLinearGradient(rectColor, me.linearGradientId);
        me.S.defs.appendChild(me.linearGradient);
        if(me.options.selectable){
            me.selectedlinearGradId = me.options.id + "-linearGradient-selected";
            //创建节点被选中后的渐变颜色
            me.selectedlinearGrad = me._createLinearGradient(rectselectedColor, me.selectedlinearGradId);
            me.S.defs.appendChild(me.selectedlinearGrad);
        }
        me.S.svg.appendChild(me.S.defs);
        me.S.svg.appendChild(me.S.group);
        me.topoEl.append(me.S.svg);
    },
    
    /**
     * @description 为拓扑图设置数据
     * @param {Array} data 设置的数据, 如果没有请设置空数组：[]
     */
    setData : function(data){
        if($.isNull(data) || !$.isArray(data)){
            return;
        }
        var me = this,
            options = me.options;
        
        options.data = JSON.parse(JSON.stringify(data));
        //清除所有的dom对象
        me.topoEl.empty();
        me._readySVG();
        me._draw();
    },
    
    /**
     * @description 设置节点为被选中状态(其它节点为非选中状态，不支持多个节点被选中)，在设置完数据后再使用此方法
     * @param {string} id 节点的id
     */
    setSelected : function(id){
        var me = this;
        if($.isNull(id) || $.isNull(me.rects[id]) || !me.options.selectable){
            return;
        }
        me.rects[id].setAttribute("fill", "url(#" + me.selectedlinearGradId + ")");
        //如果原来有选中的节点，则去除原来选中节点的样式
        if(!$.isNull(me.preClickRectId)){
            me.rects[me.preClickRectId].setAttribute("fill", "url(#" + me.linearGradientId + ")");
        }
        //记录当前点击节点的id
        me.preClickRectId = id;
    },
            
    /**
     * @description 取得节点为被选中状态的节点
     * @return {object} 返回被选中的节点，如果没有，则返回-1
     */
    getSelectedNode : function(){
        if($.isNull(me.preClickRectId)){
            return -1;
        }
        var me = this;
        return me._findById(me.preClickRectId);
    },

    _chartRender : function(){
        var me = this;
        if(me.rendered || $.isNull(me.topoEl)){
            return;
        }

        me.topoEl.appendTo(me.chartEl);
    },

    _createMarker : function(){
        var me = this,
            marker,
            path,
            markerId = me.topoId + "-marker";
        me.markerId = markerId;
        marker = me._createSVGElement("marker");
        marker.setAttribute("id", markerId);
        marker.setAttribute("viewBox", "0 0 10 10");
        marker.setAttribute("refX", 0);
        marker.setAttribute("refY", 5);
        marker.setAttribute("markerUnits", "strokeWidth");
        marker.setAttribute("markerWidth", 4);
        marker.setAttribute("markerHeight", 3);
        marker.setAttribute("fill", me.options.lineColor);
        marker.setAttribute("orient", "auto");
        path = me._createSVGElement("path");
        path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
        marker.appendChild(path);
        
        return marker;
    },
    /**
    * @private
    * @description 计算字符串的宽度
    * @param {object} attr  字体大小和字体体系等信息
    * @param {string} text  字符串
    * @returns {Object} 返回字符串占有的宽度和高度
    */
    textSize : function(attr, text) {
        var me = this,
            bb,
            result = {};
        var ff = me._createSVGElement("text");
        var te = document.createTextNode(text);
        var tt = me._createSVGElement("tspan");
        tt.appendChild(te);
        ff.appendChild(tt);
        ff.setAttribute("text-anchor", "middle");
        ff.setAttribute("x", attr.x);
        ff.setAttribute("y", attr.y);
        ff.setAttribute("font-size", attr.fontSize);
        ff.setAttribute("font-family", attr.fontFamily);
        me.S.svg.appendChild(ff);
        bb = ff.getBBox();
        if($.isNull(bb)){
            result = {
                width : 0,
                height : 0
            };
        } else {
            result = {
                width : bb.width,
                height : bb.height
            };
        }
        me.S.svg.removeChild(ff);
        return result;
    },
    _createText : function(text, attrs, rowWidth, dir){
        var me = this,
            temp = String(text).replace(/\n/g, "<br>").split("<br>"),
            attr = $.isNull(attrs) ? {} : attrs,
            textNode, i = 0,
            svgText = me._createSVGElement("text"),
            svgTspan,
            fontSize = attr.fontSize?attr.fontSize : 14,
            fontFamily = attr.fontFamily?attr.fontFamily : "Tahoma",
            fillColor = attr.fillColor ? attr.fillColor : "#666666",
            x = attr.x ? attr.x : 0,
            y = attr.y ? attr.y : 0;
        
        var textSize = me.textSize({
            x : x,
            y : y,
            fontSize : fontSize,
            fontFamily : fontFamily
        }, text);
        if(textSize.width > rowWidth && temp.length === 1){
            var textLength = String(text).length;
            var rowCount = Math.floor(textLength*rowWidth/textSize.width)-2;
            var row = Math.ceil(textLength/rowCount);
            var arr = [];
            for(i = 0; i < row; i++){
                arr.push(String(text).substr(i*rowCount, rowCount)); 
            }
            temp = arr;
        }
        
        //如果有多行显示，进行换行处理
        var len = temp.length;
        var tempy = 0;
        var ty = y;
        if(len > 1 && !dir){
            ty = y - me.options.nodeHeight/2 + fontSize + 5;
        }
        for(i = len - 1; i >= 0; i--){
            textNode = document.createTextNode(temp[(len-1) - i]);
            svgTspan = me._createSVGElement("tspan");
            svgTspan.appendChild(textNode);
            svgTspan.setAttribute("x", x);
            if(dir === "down"){
                tempy = y + fontSize*((len-1) - i);
            } else if(dir === "up"){
                tempy = y - fontSize*i;
            } else {
                
                tempy = ty + fontSize*((len-1) - i);
            }
            svgTspan.setAttribute("y", tempy);
            svgTspan.setAttribute("fill", fillColor);
            svgText.appendChild(svgTspan);
        }
        //对字体设置样式和坐标值
        svgText.setAttribute("text-anchor", "middle");
        svgText.setAttribute("x", x);
        svgText.setAttribute("y", y);
        svgText.setAttribute("font-size", fontSize);
        svgText.setAttribute("font-family", fontFamily);
        //设置提示值
        svgText.setAttribute("title", text);
        if(!$.isNull(attr.fontWeight)){
            svgText.setAttribute("font-weight", attr.fontWeight);
        }

        return svgText;
    },
    
    _createLinearGradient : function(color, id){
        var me = this,
            tempStop,
            linearGrad;
        linearGrad = me._createSVGElement("linearGradient");
        linearGrad.setAttribute("id", id);
        linearGrad.setAttribute("x2", "0%");
        linearGrad.setAttribute("y2", "100%");
        for(var i = 0; i < color.length; i++){
            tempStop = me._createSVGElement("stop");
            tempStop.setAttribute("offset", (i+1)/color.length);
            tempStop.setAttribute("stop-color", color[i]);
            linearGrad.appendChild(tempStop);
        }
        return linearGrad;
    },
    
    _addListener : function(){
        var me = this;
        $.each(me.handlers, function(eventName, func){
           if(eventName === "nodeclick"){
               me.eventMap.nodeClick = func;
           } 
        });
    },
    
    _removeListener: function(eName) {
        var me = this;
        if($.isNull(eName)){
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(eventName, func) {
                me.eventMap = {};
            });
        } else {
            if(eName === "nodeclick" && !$.isNull(me.eventMap.nodeClick)){
                delete me.eventMap.nodeClick;
            }
        }
    },
    _doNodeText : function(node, rectg, tempg){
        var me = this,
            fontSize = 14,
            inSpace = 48,
            outSpace = 42,
            space = 35,
            lx = node.lpoint.x,
            rx = node.rpoint.x,
            lry = node.lpoint.y,
            levelSpace = me.options.levelSpace,
            nodeWidth = me.options.nodeWidth,
            nodeHeight = me.options.nodeHeight,
            rextx = lx + levelSpace/2,
            rexty = lry + nodeHeight/2,
            mainText,textInUp,textInDown,textOutUp,textOutDown;
        
        if(!$.isNull(node.text)){
            mainText = me._createText(node.text, {x:rextx + nodeWidth/2, y : lry, 
                fontWeight : "bold", fillColor : "#ffffff"}, nodeWidth);
            rectg.appendChild(mainText);
        } else {
            tempg.removeChild(rectg);
            var nullPath = me._createPath(rextx, lry, rextx+nodeWidth, lry, false);
            tempg.appendChild(nullPath);
        }
        if(!$.isNull(node.textInUp)){
            space = inSpace;
            var linel = node.lLength ? parseInt(node.lLength) : levelSpace/2;
            textInUp = me._createText(node.textInUp, {x:rextx-space, y : lry-fontSize/2},linel, "up");
            tempg.appendChild(textInUp);
        }
        if(!$.isNull(node.textInDown)){
            space = inSpace;
            var linel = node.lLength ? parseInt(node.lLength) : levelSpace/2;
            textInDown = me._createText(node.textInDown, {x:rextx-space, y : lry+fontSize},linel,"down");
            tempg.appendChild(textInDown);
        }
        if(!$.isNull(node.textOutUp)){
            var linel = node.rLength ? parseInt(node.rLength) : levelSpace/2;
            space = linel < outSpace ? linel/2 : outSpace;
            textOutUp = me._createText(node.textOutUp, {x:rextx+nodeWidth+space, y : lry-fontSize/2}, 
                linel, "up");
            tempg.appendChild(textOutUp);
        }
        if(!$.isNull(node.textOutDown)){
            var linel = node.rLength ? parseInt(node.rLength) : levelSpace/2;
            space = linel < outSpace ? linel/2 : outSpace;
            textOutDown = me._createText(node.textOutDown, {x:rextx+nodeWidth+space, y : lry+fontSize}, 
                linel, "down");
            tempg.appendChild(textOutDown);
        }
    },
    _createNode : function(node){
        var me = this,
            tempg,
            rectg,
            rect,
            levelSpace = me.options.levelSpace,
            nodeWidth = me.options.nodeWidth,
            nodeHeight = me.options.nodeHeight,
            left = node.lpoint.x + levelSpace/2,
            top = node.lpoint.y - nodeHeight/2;
        
        tempg = me._createSVGElement("g");
        rectg = me._createSVGElement("g");
        rect = me._createSVGElement("rect");
        rect.setAttribute("x", left);
        rect.setAttribute("y", top);
        rect.setAttribute("width", nodeWidth);
        rect.setAttribute("height", nodeHeight);
        rect.setAttribute("rx", 10);
        //如果有多个颜色值，则使用渐变,现只支持线性渐变
        rect.setAttribute("fill", "url(#" + me.linearGradientId + ")");
        rectg.appendChild(rect);
        tempg.appendChild(rectg);
        
        //节点的点击事件
        if(node.clickable && "true" === node.clickable){
            if(me.options.selectable){
                rectg.setAttribute("cursor", "pointer");
            }
            rectg.addEventListener("click", function(evt){
                //改变选中的节点的样式
                if(me.options.selectable){
                    if(!$.isNull(me.preClickRectId) && node.id !== me.preClickRectId){
                        me.rects[me.preClickRectId].setAttribute("fill", "url(#" + me.linearGradientId + ")");
                        rect.setAttribute("fill", "url(#" + me.selectedlinearGradId + ")");
                    } else {
                        rect.setAttribute("fill", "url(#" + me.selectedlinearGradId + ")");
                    }
                }
                me.preClickRectId = node.id;
                if(!$.isNull(me.eventMap.nodeClick)){
                    var params = JSON.parse(JSON.stringify(node));
                    me.eventMap.nodeClick(evt, params);
                }

            }, true);
        }

        //为node中的创建字符显示信息
        me._doNodeText(node, rectg, tempg);
        var start = {},end = {},lpath,rpath,isNeedArrow=false;
        if((!$.isNull(node.from) && node.from.length > 0) || 
                $.isNotNull(node.textInUp) || $.isNotNull(node.textInDown)){
            var ll = levelSpace/2;
            start.x = node.lpoint.x;
            start.y = node.lpoint.y;
            end.x = node.lpoint.x + ll;
            end.y = start.y;
            if(!$.isNull(node.text)){
                isNeedArrow = true;
            }
            lpath = me._createPath(start.x, start.y, end.x, end.y, isNeedArrow);
            tempg.appendChild(lpath);
        }
        if((!$.isNull(node.to) && node.to.length > 0) || 
                $.isNotNull(node.textOutUp) || $.isNotNull(node.textOutDown)){
            var ll = levelSpace/2;
            start.x = node.rpoint.x - ll;
            start.y = node.rpoint.y;
            end.x = node.rpoint.x;
            end.y = start.y;
            rpath = me._createPath(start.x, start.y, end.x, end.y);
            tempg.appendChild(rpath);
        }
        me.S.group.appendChild(tempg);
        //保存所有node的svg dom对象，key是节点的id
        me.nodes[node.id] = tempg;
		me.rects[node.id] = rect;
    },
            
    _createPath : function(x1, y1, x2, y2, arrow){
        var path, pathStr, me = this,
            pArr = ["M",x1,y1,"L",x2,y2];
        pathStr = pArr.join(" ");
        path = me._createSVGElement("path");
        path.setAttribute("stroke", me.options.lineColor);
        path.setAttribute("stroke-width", 3);
        if(arrow){
            path.setAttribute("marker-end", "url(#" + me.markerId + ")");
            pArr = ["M",x1,y1,"L",x2-8,y2];
            pathStr = pArr.join(" ");
        }
        path.setAttribute("d", pathStr);
        return path;
    },
    
    _layout : function(){
        var me = this,
            options = me.options,
            nodes = me.topoNodes;
        
        var xoffset = 0,
                temp,
                inhasInText = false;
        me.endOutOffset = 0;
        //只看第一层，即入口节点是否有输入流量
        for(var k = 0; k < nodes.length; k++){
            if(k === 0){
                for(var h = 0; h < nodes[k].length; h++){
                    temp = me._findById(nodes[k][h]);
                    if(temp.textInUp || temp.textInDown){
                        inhasInText = true;
                        break;
                    }
                }
            }
            if(k === nodes.length - 1){
                for(var g = 0; g < nodes[k].length; g++){
                    temp = me._findById(nodes[k][g]);
                    if(temp.textOutUp || temp.textOutDown){
                        me.endOutOffset = options.levelSpace/2;
                        break;
                    }
                }
            }
        }
        if(inhasInText){
            xoffset = options.levelSpace/2;
        }
        me.xoffset = xoffset;
        var ls = options.levelSpace;
        //nodes是二维数组，其中每个元素代表一列元素的id集合
        for(var i = 0; i < nodes.length; i++){
            var item = nodes[i];
            var count = item.length;
            //沿着me.centerY将每一列数据分隔成三部分，top, middle, bottom
            var top = [], middle = [], bottom = [];
            var f = Math.floor(count/2);
            var modifY = options.nodeSpace/2 + options.nodeHeight/2;
            var step = 0;
            if(count%2 === 1){
                if(count === 1){
                    middle.push(item[0]);
                } else {
                    middle.push(item[f]);
                }
                
                modifY = 0;
                step = 1;
            }
            for(var q = 0; q < f; q++){
                top.push(item[q]);
            }
            for(var q = f + step; q < count; q++){
                bottom.push(item[q]);
            }
            
            //对top, middle, bottom中的节点计算相应的x,y坐标值
            for(var z = 0; z < top.length; z++){
                var t = me._findById(top[z]);
                var spc = modifY === 0 ? top.length - z : top.length - 1 - z;
                var y = me.centerY - modifY - (options.nodeHeight + options.nodeSpace)*spc;
                t.lpoint = {x : xoffset + (ls + options.nodeWidth)*i, y : y};
                t.rpoint = {x : xoffset + (ls + options.nodeWidth)*(i + 1), y : y};
            }
            for(var s = 0; s < middle.length; s++){
                var t = me._findById(middle[s]);
                var y = me.centerY;
                t.lpoint = {x : xoffset + (ls + options.nodeWidth)*i, y : y};
                t.rpoint = {x : xoffset + (ls + options.nodeWidth)*(i + 1), y : y};
            }
            for(var c = 0; c < bottom.length; c++){
                var t = me._findById(bottom[c]);
                var spc = modifY === 0 ? c + 1 : c;
                var y = me.centerY + modifY + (options.nodeHeight + options.nodeSpace)*spc;
                t.lpoint = {x : xoffset + (ls + options.nodeWidth)*i, y : y};
                t.rpoint = {x : xoffset + (ls + options.nodeWidth)*(i + 1), y : y};
            }
        }
        me._move();
        me._deal1toMore();
        me._dealMoreto1();
        for(var i = 0; i < me.options.data.length; i++){
            me._createNode(me.options.data[i]);
        }
    },
    _move : function(){
        var me = this,
            options = me.options,
            temp,
            data = options.data;
        
        for(var i = 0; i < data.length; i++){
            if(!$.isNull(data[i].to) && data[i].to.length > 0){
                temp = data[i].to;
                var tolen = temp.length;
                if(tolen === 1){
                    var tonode = me._findById(temp[0].id);
                    //两个直接相连的点的y坐标值不相同时，对相应的点进行移动
                    if(tonode && tonode.from && tonode.from.length === 1 && data[i].id === tonode.from[0]){
                        var movey = data[i].rpoint.y - tonode.lpoint.y;
                        if(movey === 0){
                            continue;
                        } else {
                            tonode.lpoint.y = tonode.rpoint.y = data[i].rpoint.y;
                        }
                    }
                }
            }
        }
    },
    _deal1toMore : function(){
        var me = this,
            options = me.options,
            temp,
            startNode,
            endNode,
            path,
            data = options.data;
        
        for(var i = 0; i < data.length; i++){
            if(!$.isNull(data[i].to) && data[i].to.length > 0){
                temp = data[i].to;
                var toLen = temp.length;
                if(toLen > 1){
                    //如果此节点的层级中有多个节点时
                    //从所有from节点中找出y坐标最大值和最小值，再将他们相同的连接点移动到他们的中间位置
                    var min = {y:100000}, max = {y:0};
                    for(var n = 0; n < toLen; n++){
                        var tn = me._findById(temp[n].id);
                        //如果分叉出去的节点有多个from节点，说明分叉节点有多个输入
                        if(tn.from && tn.from.length > 1){
                            continue;
                        }
                        if(tn.lpoint.y > max.y){
                            max["id"] = tn; 
                            max.y = tn.lpoint.y;
                        }
                        if(tn.lpoint.y < min.y){
                            min["id"] = tn; 
                            min.y = tn.lpoint.y;
                        }
                    }
                    startNode = min.id;
                    endNode = max.id;
                    //如果节点的y坐标在后继所有节点之外，这时不移动此节点，移动后面的节点
                    if(data[i].lpoint.y > endNode.lpoint.y){
                        endNode.lpoint.y = endNode.rpoint.y = data[i].lpoint.y + (options.nodeSpace + options.nodeHeight)/2;
                    } else if(data[i].lpoint.y < startNode.rpoint.y){
                        var __y = data[i].lpoint.y - (options.nodeSpace + options.nodeHeight)/2;
                        if(__y < data[i].lpoint.y){
                            __y = data[i].lpoint.y;
                        }
                        startNode.lpoint.y = startNode.rpoint.y = __y;
                    }
                    //目标是不移动前面的节点，只移动后面的节点
                    if(startNode.id === endNode.id){
                        var _curnodey = data[i].rpoint.y + 10;
                        startNode.lpoint.y = startNode.rpoint.y = _curnodey;
                        endNode.lpoint.y = endNode.rpoint.y = _curnodey;
                        //连接此节点到startnode
                        path = me._createPath(data[i].rpoint.x - options.levelSpace/2, _curnodey, 
                            endNode.lpoint.x, endNode.lpoint.y);
                    } else {
                        path = me._createPath(startNode.lpoint.x, startNode.lpoint.y, 
                            endNode.lpoint.x, endNode.lpoint.y);
                    }
                    me.vpath.appendChild(path);
                }
            }
        }
    },
    _dealMoreto1 : function(){
        var me = this,
            options = me.options,
            temp,
            startNode,
            endNode,
            path,
            data = options.data;
            
        for(var i = 0; i < data.length; i++){
            if(!$.isNull(data[i].from) && data[i].from.length > 0){
                temp = data[i].from;
                var fromLen = temp.length;
                if(fromLen > 1){
                    //从所有from节点中找出y坐标最大值和最小值，再将他们相同的连接点移动到他们的中间位置
                    var min = {y:100000}, max = {y:0};
                    for(var m = 0; m < fromLen; m++){
                        var tn = me._findById(temp[m]);
                        if(tn.rpoint.y > max.y){
                            max["id"] = tn; 
                            max.y = tn.rpoint.y;
                        }
                        if(tn.rpoint.y < min.y){
                            min["id"] = tn; 
                            min.y = tn.rpoint.y;
                        }
                    }
                    startNode = min.id;
                    endNode = max.id;
                    var _ty = (endNode.lpoint.y + startNode.lpoint.y)/2;
                    data[i].lpoint.y = data[i].rpoint.y = _ty;
                    path = me._createPath(startNode.rpoint.x, startNode.rpoint.y, 
                            endNode.rpoint.x, endNode.rpoint.y);
                    me.vpath.appendChild(path);
                }
            }
        }
    },
    _findById : function(id){
        if($.isNull(id)){
            return -1;
        }
        var me = this,
            data = me.options.data;
        for(var i = 0; i < data.length; i++){
            if(id === data[i].id){
                return data[i];
            }
        }
        return -1;
    },
    _createBlankNode : function(id, to){
        return {
            id : id,
            text : "",
            "textInUp" : "",
            "textInDown" : "",
            "textOutUp" : "",
            "textOutDown" : "",
            "clickable" : "false",
            "to" : [{id: to, text : ""}]
        };
    },
    _draw : function(){
        var me = this,
            options = me.options,
            data = options.data;
        if($.isNull(data) || data.length <= 0){
            return;
        }
        
        //根据数据的关系将数据分层，topoNodes是一个二维数组，它的元素就是每一层的node的id
        me.topoNodes = me._parseData(data);
        //将data中的数据顺序转化成topoNodes中出现的顺序
        var tempData = [];
        me.maxLevel = {count: 0, index : 0};
        for(var g = 0; g < me.topoNodes.length; g++){
            for(var f = 0; f < me.topoNodes[g].length; f++){
                if(me.topoNodes[g].length > me.maxLevel.count){
                    me.maxLevel.count = me.topoNodes[g].length;
                    me.maxLevel.index = g;
                }
                var tn = me._findById(me.topoNodes[g][f]);
                if(tn !== -1){
                    tn.level = g + 1;
                    tempData.push(tn);
                } else {
                    
                }
            }
        }
        options.data = data = JSON.parse(JSON.stringify(tempData));
        
        me._parseFromNode(data);
        for(var i = 0; i < me.topoNodes.length; i++){
            if(me.topoNodes[i].length > me.maxLevelNodes){
                me.maxLevelNodes = me.topoNodes[i].length;
            }
        }
        
        //布局从中间开始，先根据最大的列求出最大的x,y值，找到中间值，定义好y方向的offset
        me.svgHeight = (me.maxLevelNodes-1)*options.nodeSpace + me.maxLevelNodes*options.nodeHeight;
        me.centerY = Math.floor(me.svgHeight/2);
        
        
        me._layout();
        me.maxHeight = padding + (me.maxLevelNodes-1)*options.nodeSpace + 
                me.maxLevelNodes*options.nodeHeight + padding;
        me.maxWidth = padding + (me.topoNodes.length-1)*options.levelSpace + 
                me.topoNodes.length*options.nodeWidth + padding + me.xoffset + me.endOutOffset;
        me.S.group.setAttribute("transform", "translate(" + (padding - options.levelSpace/2) + "," + padding + ")");
        var style = " width:" + me.maxWidth + "px; height: " + me.maxHeight + "px";
        me.S.svg.setAttribute("style", style);
        me.S.svg.setAttribute("version", "1.1");
    },
    
    _parseFromNode : function(data){
        var temp,
            temp1;
        for(var i = 0; i < data.length; i++){
            temp = data[i];
            //为每一个节点找到它相连的进入点
            temp.from = [];
            for(var j = 0; j < data.length; j++){
                temp1 = data[j].to;
                if(temp.id === data[j].id || $.isNull(temp1)){
                    continue;
                }
                for(var k = 0; k < temp1.length; k++){
                    if(temp.id === temp1[k].id){
                        temp.from.push(data[j].id);
                        break;
                    }
                }
            }
        }
    },
    _parseData : function(data){
        //将数据在这里进行分层处理，且只支持横向展示的布局
        var topoNodes = [],
            me = this,
            groupNodesId = [],
            tempNodes = [],
            hasNode = false,
            isEnd = false,
            i=0,
            j=0,
            k=0,
            temp;
        //先找出所有的有进入的点
        for(i = 0; i < data.length; i++){
            temp = data[i];
            if(!$.isNull(temp.to) && temp.to.length > 0){
                for(j = 0; j < temp.to.length; j++){
                    tempNodes.push(temp.to[j]);
                }
            }
        }
        
        //找出第一行的nodes， 即找出没有进入的点
        for(i = 0; i < data.length; i++){
            temp = data[i];
            hasNode = false;
            for(j = 0; j < tempNodes.length; j++){
                if(temp.id === tempNodes[j].id){
                    //找到有进入的点，没有进入的点就是第一行的点
                    hasNode = true;
                    break;
                }
            }
            if(!hasNode){
                //第一行的点
                groupNodesId.push(temp.id);
            }
        }
        
        if(groupNodesId.length > 0){
            //将第一行的点添加到topoNodes中
            topoNodes.push(groupNodesId);
        } else {
            return [];
        }
        
        while(!isEnd){
            var tempGroup = {};
            isEnd = true;
            for(i = 0; i < groupNodesId.length; i++){
                for(j = 0; j < data.length; j++){
                    if(data[j].id === groupNodesId[i]){
                        if(!$.isNull(data[j].to) && data[j].to.length > 0){
                            isEnd = false;
                            for(k = 0; k < data[j].to.length; k++){
                                tempGroup[data[j].to[k].id] = data[j].to[k].id;
                            }
                        }
                    }
                }
            }
            
            groupNodesId = [];
            for(var key in tempGroup){
                groupNodesId.push(key);
            }
            if(groupNodesId.length > 0){
                //将第一行的点添加到topoNodes中
                topoNodes.push(groupNodesId);
            }
        }
        
        var graobj = {};
        for(var i = topoNodes.length - 1; i >= 0; i--){
            var t = topoNodes[i];
            for(var j = 0; j < t.length; j++){
                if(!graobj[t[j]]){
                    graobj[t[j]] = {id: t[j], level: i+1};
                } else {
                    //找出这个点的前面连接的点，并修改前面点to中的这个点为空白节点的id
                    for(var n = 0; n < topoNodes[i-1].length; n++){
                        var qq = me._findById(topoNodes[i-1][n]);
                        if(qq.to && qq.to.length > 0){
                            for(var r = 0; r < qq.to.length; r++){
                                if(qq.to[r].id === t[j]){
                                    qq.to[r].id = presuffix + topoUUID;
                                }
                            }
                        }
                    }
                    for(var m = 0; m < graobj[t[j]].level - 1 - i; m++){
                        var bnId = presuffix + topoUUID;
                        topoUUID++;
                        topoNodes[i+m].push(bnId);
                        //创建空白的节点
                        var toId = "";
                        if(m + 1 === graobj[t[j]].level - 1 - i){
                            toId = t[j];
                        } else {
                            toId = presuffix + topoUUID;
                        }
                        var bn = me._createBlankNode(bnId, toId);
                        me.options.data.push(bn);
                    }
                    t.splice(j, 1);
                    j--;
                }
            }
        }
        
        return topoNodes;
    }
});

// 拓扑图组件
Sweet.chart.SimpleTopology = $.sweet.widgetChartSimpleTopology;

}( jQuery ) );



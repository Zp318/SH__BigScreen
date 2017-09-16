/**
 * @fileOverview  
 * <pre>
 * 状态块组件
 * 2013/9/22
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

$(function($, undefined){
    "use strict";
    var tipsDivClass = "sweet-arrayindicator-infoDiv";
    $.widget("sweet.widgetStatuBar", $.sweet.widget, /** @lends Sweet.StatuBar.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-StatuBar]:",
        eventNames : /** @lends Sweet.StatuBar.prototype*/{
            /**
             * @event
             * @description 点击事件,只有注册了些事件，鼠标移动到上面时才显示为手型，表示可点击
             * @param {Event} evt 点击事件对象
             * @param {Object} data 当前点击的小方块的对象数据信息
             */
            click: "小方块点击事件"
        },
        type: "StatuBar",
        options : /** @lends Sweet.StatuBar.prototype*/{
            /**
             * 状态组件的高度
             * @type number
             * @default 10px
             */
            height : 10,
            /**
             * 状态组件的宽度
             * @type number
             * @default 100%
             */
            width : "100%",
            /**
             * 每一个小状态块的宽度
             * @type number
             * @default 10px
             */
            barWidth : 10,
            /**
             * 每一个小状态块的高度
             * @type number
             * @default 10px
             */
            barHeight : 10,
            /**
             * 画状态块的方向：从左往右/从右往左
             * @type string
             * @default "right"   可选值为: "left","right"
             */
            direction : "right",
            /**
             * 状态行数据信息，结构如下：[{value : "11",text : "aa", color : "#f56161",data:[]},...]
             * @type Array
             * @default []
             */
            data : [],
            /**
             * 鼠标移动到方格中时显示提示信息，提示信息来自data中的text
             * @type boolean
             * @default false
             */
            tip : false,
            /**
             * 状态块前面的文字描述,只支持direction:"left"的情况
             * @type string
             * @default ""
             */
            label : "",
            /**
             * 如果有文字，此值有效，表示文字与状态块之间的间距
             * @type number
             * @default 30
             */
            labelSpaceWidth : 30,
			/**
             * 如果有文字，此值有效，表示文字的一些样式，具体参看其中的值
             * @type object
             * @default {labelWidth : 100,color : "#3c3c3c", font : "12px Tahoma"}
             */
			lableStyle : {
				/**
				 * 如果有文字，此值有效，表示文字的宽度，大于此宽度，出"..."加提示，且要配置tip为true
                 * @type number
                 * @default 100
				 */
				labelWidth : 100,
				/**
				 * 如果有文字，此值有效，表示文字的颜色值，轻易不要修改
                 * @type string
                 * @default "#3c3c3c"
				 */
				color : "#3c3c3c",
				/**
				 * 如果有文字，此值有效，表示文字大小和字体，一般只需要修改大小，不要修改字体
                 * @type string
                 * @default "12px Tahoma"
				 */
				font : "12px Tahoma"
			},
            /**
             * 状态块中是否有半透明遮罩
             * @type boolean
             * @default false
             */
            isShadow : false,
            /**
             * 半透明遮罩的起始位置信息和宽度信息
             * @type object
             * @default null
             */
            shadowPosInfo : null,
			/**
             * 用户自己定义的数据，在发生点击事件时带给用户
             * @type object
             * @default null
             */
			userData : null
        },
        /**
         * @public
         * @description 更新或设置状态块的状态，必须为array,红:"#f56161",黄:"#f1b32c",绿:"#57aa4f"
         * @param {Array} data 状态块的数据，值应为Array: [{value : "11",text : "aa", color : "#f56161",data:[]},...]
		 * @param {String} label 可选项，如果有label或者需要更新或者重新设置label，请配置此值
         */
        setData : function(data, label){
            var me = this,
                options = me.options;
            //防止提示不消失的情况
            if(!$.isNull(me.tipDiv)){
                me.tipDiv.remove();
            }
            if($.isNull(data) || !$.isArray(data)){
                return;
            }
            options.data.length = 0;
            options.data = $.objClone(data);
			options.label = label; 
            /** 清空状态块信息，重绘时再添加*/
            me.nodeInfo.length = 0;
            me.preInfo = null;
            me._drawStatuBar();
        },
		/**
         * @public
         * @description 用户自己定义的数据，在发生点击事件时带给用户
         * @param {Object} data 
         */
		setUserData : function(data){
			this.options.userData = data ? $.objClone(data) : data;
		},
        /**
         * @public
         * @description 滑动块移动时设置更新状态块的位置
         * @param {Object} pos 状态块的位置信息,例如： {left:200, top: 10}
         */
        setPosition : function(pos){
            var me = this;
            
            if(!$.isNull(pos)){
                if(!$.isNull(pos.left)){
                    me.canvasEl.css("left", pos.left + "px");
                }
                
                if(!$.isNull(pos.top)){
                    me.canvasEl.css("top", pos.top + "px");
                }
            }
        },
        /**
         * @private
         * @description 子类继承实现, 绘制组件
         */
        _createSweetWidget: function(){
            var me = this,
                    space = 10,
                    options = me.options,
                    sbarId = options.id+"-canvas";
            /** 宽度减去10px，主要是为了适应将此组件放在grid中时，grid的单元格设置有padding为5px*/
            options.width = options.width - space;
            /** 此变量存储每一个小方块的坐标信息，高度和宽度，方便小方块的点击事件时使用*/
            me.nodeInfo = [];
            /** 为小方块绑定事件的集合*/
            me.eventMap = {};
			if(options.height - options.barHeight < space){
				options.height = options.barHeight + space;
			}
            me.sbarEl = $("<div>").attr({id : options.id})
                    .height(options.height).width(options.width)
                    .css("overflow", "hidden").css("position","relative");
            /** 定义canvas对象*/
            me.canvasEl = $("<Canvas>")
                    .attr({id : sbarId, height: options.height, width : options.width})
                    .appendTo(me.sbarEl);
            /** 取得context对象*/
            me.c = me.canvasEl.get(0).getContext('2d');
            /** 为画布绑定事件*/
            me._bindEvent();
            /** 画相应的状态块*/
            me._drawStatuBar();
        },
        /**
        * @private
        * @param {Event} evt 事件对象
        * @param {Array} nodes 所有实线上的文字坐标等记录的集合
        * @returns {object} 返回鼠标是否在指定的node范围内
        */
        _isScope : function(evt, nodes){
            var me = this,cx = 0, cy = 0, temp, i = 0;
            if($.isFirefox()){
                cx = evt.pageX - me.canvasEl.offset().left;
                cy = evt.pageY - me.canvasEl.offset().top;
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
                       node : temp
                   };
               }
           }
           return false;
        },
        _onClick : function(e){
            var me = e.data.me;
            //说明在范围内，调用用户注册的click事件,同时需要改变字体样式
            if($.isFunction(me.eventMap.click)){
                //根据文字的坐标范围找到相应点击的文字信息
                var info = me._isScope(e, me.nodeInfo);
                if(info && info.isScope && info.node.clickable){
                    //说明在范围内，调用用户注册的click事件,同时需要改变字体样式
					var d = info.node.node;
					if(me.options.isShadow){
						d = {
							userData : me.options.userData,
							data : me.options.data,
							curNode : info.node.node
						};
					}
                    me.eventMap.click(e, d);
                }
            }
        },
        _onMousemove : function(e){
            var me = e.data.me,
                    tip = me.options.tip;
            var info = me._isScope(e, me.nodeInfo);
            me._removeTipDiv();
            if(info && info.isScope){
                //说明在范围内且注册了点击事件，改变鼠标样式为手形
                if($.isFunction(me.eventMap.click) && info.node.clickable){
                    me.canvasEl.css("cursor", "pointer");
                }
                //如果有text信息且配置需要显示提示信息时，显示提示信息
                if(tip && info.node && info.node.node && !$.isNull(info.node.node.text)){
                    var maxzindex = $.getMaxZIndex(undefined, tipsDivClass);
                    me.tipDiv = $("<div>").addClass(tipsDivClass).css("z-index", maxzindex).appendTo("body");
                    $("<span>").html(info.node.node.text).appendTo(me.tipDiv);
                    me.tipDiv.position({
                        my : "left+5 bottom-10",
                        of : e,
                        collision : "flipfit"
                    });
                }
            }else {
                me._removeTipDiv();
                me.canvasEl.css("cursor", "default");
            }
        },
        _onMouseout : function(e){
            var me = e.data.me;
            me._removeTipDiv();
        },
        _bindEvent : function(){
            var me = this;
            //绑定点击事件
            me.canvasEl.bind("click", {"me": me}, me._onClick)
            //绑定mousemove事件，改变鼠标移动上去的样式为手形,同时显示网元和线上文字的tips提示
                    .bind("mousemove", {"me": me}, me._onMousemove)
                    .bind("mouseout", {"me": me}, me._onMouseout);
        },
        _removeTipDiv : function(){
            var me = this;
            if(!$.isNull(me.tipDiv)){
                me.tipDiv.remove();
                me.tipDiv = null;
            }
        },
        _closeFloatPanel : function(){
            this._removeTipDiv();
        },
        /**
         * @private
         * @description 如果最大宽度存在且文字实际宽度大于最大宽度，返回最大宽度，否则返回实际宽度
         * @param {string} label   文字
         * @param {number} maxWidth   限制的最大宽度
         * @returns {Number} 返回文字的宽度
         */
        _calcLabelWidth : function(label, maxWidth){
            var me = this,
                    c = me.c,
                    temp;
			c.save();
            c.textAlign = "start";
			c.fillStyle = me.options.lableStyle.color;
            c.font = me.options.lableStyle.font;
            temp = c.measureText(label).width;
			c.restore();
            //如果最大宽度存在且文字实际宽度大于最大宽度，返回最大宽度
            if($.isNotNull(maxWidth) && temp > maxWidth){
                temp = maxWidth;
            }
            return temp;
        },
        /**
         * @private
         * @description 根据数据画相应的状态块
         */
        _drawStatuBar : function(){
            var me = this,
                    options = me.options,
                    dir = options.direction,
                    c = me.c, len = options.data.length,
                    sbel = me.sbarEl,
                    cw = sbel.width(), ch = sbel.height(),
                    w = options.barWidth, h = options.barHeight, space = w + 1,
                    i = 0, x = 0, y = (ch-h)/2, lw = 0,
                    padding = 5, hp = h/2,labelW = 0,
                    temp;
            /** 重新设置canvas的宽度和高度, 同时清除画布上的内容*/
            //如果有文字，先计算文字长度
            if($.isNotNull(options.label)){
                labelW = padding + options.lableStyle.labelWidth;
                lw = labelW + options.labelSpaceWidth;
            }
            me.cw = cw = len*space + lw;
            me.canvasEl.attr({height: ch, width : cw});
            //如果有文字，先画文字
            if($.isNotNull(options.label)){
                me._createText(options.label, x+padding, y+hp, {maxTextWidth : options.lableStyle.labelWidth});
				me.nodeInfo.push({
                    node : {value : options.label, text : options.label},
                    left : x+padding,
                    top : y,
                    width : labelW,
                    height : h,
					clickable : false
                });
				x = x + lw;
            }
            if(dir === "right"){
                me.canvasEl.css("position", "relative");
                me.canvasEl.css("left", -me.canvasEl.attr("width")+me.sbarEl.width() + "px");
                space = -space;
                x = cw + space;
            }
            for(i = 0; i < len; i++){
                temp = options.data[i];
                /*** 颜色值用户自己指定*/
                c.fillStyle = temp.color;
                c.fillRect(x, y, w, h);
                /** 保留相关信息，在小方块点击事件时需要使用*/
                me.nodeInfo.push({
                    node : temp,
                    left : x,
                    top : y,
                    width : w,
                    height : h,
					clickable : true
                });
                /** 准备下一个方块的坐标值*/
                x += space;
            }
            /** 只有设置需要半透明遮罩时才画半透明遮罩 */
            if(options.isShadow){
                me.drawShadow({
                    /** 半透明遮罩的宽度 */
                    width : options.shadowPosInfo ? options.shadowPosInfo.width : space*8,
                    /** 半透明遮罩的起始位置 */
                    left : options.shadowPosInfo ? options.shadowPosInfo.left : 0
                });
            }
        },
        /**
         * @description 每次点击slider的时间范围时，进行半透明遮罩范围的切换
         * @param {object} info 设置半透明遮罩的起始位置(x轴的值)和宽度:{left : 324, width: 88},宽度默认为88px
         */
        drawShadow : function(info){
            var me = this,
                    w = info.width ? info.width : 88,
                    ch = me.sbarEl.height(),
                    x = me.cw - Math.abs(info.left?info.left:0) - w,
                    c = me.c;
            me.options.shadowPosInfo = info;
            if(me.preInfo && me.preInfo.imgData){
                c.putImageData(me.preInfo.imgData, me.preInfo.x, me.preInfo.y);
                delete me.preInfo;
            }
            //记录当前半透明遮罩的imageData和位置信息
            me.preInfo = {
                imgData : c.getImageData(x, 0, w, ch),
                x : x,
                y : 0,
                width : w,
                height : ch
            };
            c.fillStyle = "black";
            c.globalAlpha = 0.2;
            c.fillRect(x, 0, w, ch);
        },
        _createText : function(text, x, y, attr){
            var me = this,
                    textWidth = 0,
                    tempText = text,
                    tempLen = 0,
                    c = me.c;
            attr = attr || {};
            c.save();
            c.textAlign = attr.textAlign ? attr.textAlign : "start";
            c.fillStyle = me.options.lableStyle.color;
            c.font = me.options.lableStyle.font;
			c.textBaseline = attr.textBaseline ? attr.textBaseline : "middle";
            c.translate(x, y);
            if($.isNull(attr.maxTextWidth)){
                c.fillText(tempText, 0, 0);
            } else {
                textWidth = c.measureText(text).width;
                if(textWidth > attr.maxTextWidth){
                    tempLen = Math.ceil(text.length*attr.maxTextWidth/textWidth);
                    tempText = String(text).substr(0, tempLen-4)+"...";
                }
                c.fillText(tempText, 0, 0, attr.maxTextWidth);
            }
            c.restore();
            return textWidth;
        },
        /**
         * @private
         * @description layout时进行重新绘制
         */
        _doLayout : function(){
            var me = this;
            me._drawStatuBar();
        },
        /**
         * @private
         * @description 返回图组件最外层jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        _getWidgetEl : function(original){
            this.renderEl = this.sbarEl;
            return original ? this.sbarEl[0] : this.sbarEl;
        },
        /**
         * @private
         * @description 注册小方块的点击事件
         */
        _addListener: function(){
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if(eventName === "click"){
                    me.eventMap.click = func;
                }
            });
        },
        /**
         * @private
         * @description 删除小方块的点击事件
         */
        _removeListener: function(){
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if(eventName === "click"){
                    delete me.eventMap.click;
                }
            });
        },
        _destroyWidget : function(){
            var me = this;
            if(me.canvasEl){
                me.canvasEl.unbind();
            }
            me._removeTipDiv();
        },
        /**
         * @private
         * @description 组件渲染
         * @param {string} id 渲染到相应容器的id
         */
        _render: function(id){
            var me = this;
            if($.isNull(id) || me.rendered){
                return;
            }
            
            if (!me.renderEl) {
                me._createRenderEl(id);
            }
            me.sbarEl.appendTo(me.renderEl);
            me.options.renderTo = id;
            me.rendered = true;
        }
    });
    /**
     * @description 以行显示状态块
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.widget
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建滑动块组件：
     * var sBar = Sweet.StatuBar({
     * });
     */
    Sweet.StatuBar = $.sweet.widgetStatuBar;
}(jQuery));
/**
 * @fileOverview  
 * <pre>
 * 滑动块组件
 * 2013/9/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

$(function($, undefined){
    "use strict";
    var perWidth = 10, timer;
    var stickContentClass = "sweet-slider-stick",
        containerCalss = "sweet-slider-container",
        sliderContentClass = "sweet-slider",
        ticksDivClass = "sweet-tick-div",
        sliderTickClass = "sweet-slider-tick",
        sliderTextClass = "sweet-text-div",
        textContentClass = "sweet-text-content",
        sliderBlockClass = "sweet-slider-block",
        sliderShadowClass = "sweet-slider-shadow",
        moveAllClass = "sweet-all-move-slider",
        moveAllRealClass = "sweet-all-move-real-slider";
        
    $.widget("sweet.widgetSlider", $.sweet.widget, /** @lends Sweet.Slider.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-slider]:",
        eventNames : /** @lends Sweet.Slider.prototype*/{
            /**
             * @event
             * @description 点击Slider的事件
             * @param {Event} evt 事件对象
             * @param {Object} data 滑块移动的坐标值
             */
            clickSlider: "点击Slider的事件",
            /**
             * @event
             * @description 滑块拖动事件
             * @param {Event} evt 事件对象
             * @param {Object} data 滑块移动的坐标值
             */
            move: "滑块拖动事件"
        },
        type: "slider",
        options : /** @lends Sweet.Slider.prototype*/{
            /**
             * 滑块的高度
             * @type number
             * @default 60
             */
            height : 60,
            /**
             * 滑动块的宽度
             * @type number
             * @default 100%
             */
            width : "100%",
            /**
             * 刻度上的文字描述信息，例如：["00:00","01:00","02:00","03:00","04:00",...]
             * @type Array
             * @default []
             */
            data : [],
            /**
             * 滑动块下面一起移动的遮罩的高度,因为一般和表格一起使用，表格数据行数乘以行高30
             * @type number
             * @default 300
             */
            shadowHeight: 300,
            /**
             * 滑动块下面一起移动的遮罩的顶点到滑块的距离，需要自己设置合适的值
             * @type number
             * @default 0
             */
            offsetTop : 0,
            /**
             * 刻度的步长， 1表示刻度为1小时, 2表示刻度为天，现在只支持小时
             * @type number
             * @default 1
             */
            step : 1,
            /**
             * 时间粒度,以秒数表示，900表示15分钟，现在只支持15分钟
             * @type number
             * @default 900 
             */
            interval : 900,
            /**
             * 设置时间的跨度值，默认为一天(即一天内的数据值展现)
             * @type Number
             * @default 1
             */
            dayCount : 1
        },
        /**
         * @description 取得用户设置的所有数据
         * @returns {Array} 返回用户原来设置的数据
         */
        getData : function(){
            return JSON.parse(JSON.stringify(this.options.data || []));
        },
        /**
         * @description 更新设置刻度上的文字描述值，例如：["00:00","01:00","02:00","03:00","04:00",...]
         * @param {Array} data 刻度的文字描述值
         */
        setData : function(data){
            var me = this;
            if($.isNull(data) || !$.isArray(data)){
                return;
            }
            me.options.data = JSON.parse(JSON.stringify(data));
            me.textEl.empty();
            me.tickEl.empty();
            me._createTicks();
            //恢复滚动条等到最右边初始情况
            me.containerEl.css("left",me.sliderEl.width()-me.blockWidth*me.intervalCount+"px");
            me.moveAllEl.scrollLeft(me.moveAllEl.get(0).scrollWidth);
            me.blockEl.css("left", "0px");
            /** 触发事件进行 */
            me._triggerHandler(null, "clickSlider", {
                left : 0,
                width : me.blockWidth,
                times : me.options.data,
                startTime : me.options.data[1],
                endTime : me.options.data[0]
            });
            me.preStart = undefined;
        },
        /**
         * @public
         * @description 取得当前滑动块的位置，用于更新状态块的位置
         * @return {object} {left : 44}   无top值，因为top值现在无用
         */
        getPosition : function(){
            var me = this;
            return {
                left : parseFloat(me.containerEl.css("left"))
            };
        },
        /**
         * @description 返回时间slider的位置信息，包含left和width的信息
         * @returns {Object} 返回时间slider的位置信息，包含left和width的信息
         */
        getTimeRangPos : function(){
            return {
                left : this.preStart,
                width : this.blockWidth
            };
        },
        /**
         * @private
         * @description 子类继承实现, 绘制具体组件
         */
        _createSweetWidget: function(){
            var me = this,
                options = me.options,
                sliderId = options.id;
           /** 刻度*/
            me.ticks = [];
            me.tickHeight = 4;
            me.stickHeight = 15;
            me.textHeight = options.height-25-me.stickHeight-me.tickHeight;
            me.sliderHeight = options.height;
            options.width = options.width - 10;
            /** 整个slider对象*/
            me.sliderId = sliderId;
            me.sliderEl = $("<div>").attr({id : sliderId}).height(me.sliderHeight).width(options.width)
                    .addClass(sliderContentClass);
            /** 创建滑杆,刻度和刻度上的文字*/
            me._createStick();
            /** 创建滑块*/
            me._createBlock();
            /** 创建刻度*/
            me._createTicks();
        },
        /**
         * @private
         * @description 创建滑动轴,文字描述，刻度的容器对象
         */
        _createStick : function(){
            var me = this,
                sWidth = 0,
                options = me.options;
            
            me.blockWidth = 20;
            /** 一天24小时，但是2个小时显示一个刻度，总共12个刻度*/
            me.intervalCount = 12 * options.dayCount;
            /** 2个小时为一个刻度，15分钟粒度，故2个小时内共8个15分钟*/
            me.count = 8;
            /** 计算滑块的宽度，主要根据时间粒度和刻度值来计算*/
            if(options.step === 1){
                if(options.interval === 900){
                    me.blockWidth = (perWidth + 1) * me.count;
                }
            }
            
            /** 计算滑杆的长度(需要根据数据来计算)*/
            me.realWidth = sWidth = me.blockWidth*me.intervalCount;
            me.containerEl = $("<div>").attr({id: options.id + "-container"}).width(sWidth)
                    .addClass(containerCalss).appendTo(me.sliderEl).css("left",me.sliderEl.width()-sWidth+"px");
            me.textEl = $("<div>").height(me.textHeight).width(sWidth)
                    .addClass(sliderTextClass).appendTo(me.containerEl);
            me.tickEl = $("<div>").height(me.tickHeight).width(sWidth)
                    .addClass(ticksDivClass).appendTo(me.containerEl);
            /** 滑杆对象，高度一般为10px，也可以用户配置*/
            me.stickEl = $("<div>").attr({id : me.sliderId+"-stick"}).height(me.stickHeight).width(sWidth)
                    .addClass(stickContentClass).appendTo(me.containerEl)
                    .css("cursor", "pointer")
                    .bind("click", function(e){
                        var x = e.pageX;
                        var moveToRight = sWidth - Math.abs(me.stickEl.offset().left);
                        var offX = moveToRight - x;
                        var count = Math.ceil(offX/me.blockWidth);
                        var start = (count - 1) * me.blockWidth;
                        var left = -start;
                        if(start !== me.preStart){
                            me.blockEl.css("left", left+"px");
                            /** 触发事件进行 */
                            me._triggerHandler(e, "clickSlider", {
                                left : left,
                                width : me.blockWidth,
                                times : options.data,
                                startTime : options.data[count],
                                endTime : options.data[count-1]
                            });
                        }
                        me.preStart = start;
                    });
        },
        /**
         * @description 取得移动滚动条的位置信息
         * @returns {number} 返回移动滚动条的位置，和move事件传递的位置信息一样
         */
        getMoveBarPos : function(){
            return this.moveBarPos;
        },
        /**
         * @private
         * @description 创建滑块对象
         */
        _createBlock : function(){
            var me = this,
                    options = me.options;
            /** 滑块对象*/
            me.blockEl = $("<div>").addClass(sliderBlockClass).attr({id : me.sliderId+"-block"})
                    .height(me.stickHeight).width(me.blockWidth).appendTo(me.stickEl);
            //创建全部的滑块，宽度保持和options.width一致
            me.moveAllEl = $("<div>").width(options.width).addClass(moveAllClass)
                    .scroll(function(e){
                        var left = $(e.target).scrollLeft();
                        var info = {
                            left : -left
                        };
                        me._triggerHandler(e, "move", info);
                        me.moveBarPos = info;
                        /* containerEl的left的值*/
                        me.containerEl.css("left", -left);
                    }).appendTo(me.sliderEl);
            
            me.moveRealEl = $("<div>").width(me.realWidth)
                    .addClass(moveAllRealClass).appendTo(me.moveAllEl);
        },
        /**
         * @private
         * @description 创建文字描述内容和相应的刻度
         */
        _createTicks : function(){
            var me = this,
                options = me.options,
                texts = options.data,
                i = 0, w = 0,
                temp, temp1;
            me.textDivs = [];
            me.curText = [];
            for(i = 0; i < me.intervalCount; i++){
                /** 创建文字描述内容*/
                temp1 = $("<div>").attr({id : i+"-text"}).addClass(textContentClass).text(texts[i])
                        .height(me.textHeight).width(me.blockWidth).appendTo(me.textEl);
                /** 创建刻度对象*/
                temp = $("<div>").attr({id : i+"-tick"}).addClass(sliderTickClass)
                        .height(me.tickHeight).width(me.blockWidth-1).appendTo(me.tickEl);
            }
        },
        /**
         * @private
         * @description 组件渲染
         * @param {string} id 渲染的id
         */
        _render: function(id){
            var me = this;
            if($.isNull(id) || me.rendered){
                return;
            }
            
            if (!me.renderEl) {
                me._createRenderEl(id);
            }
            me.sliderEl.appendTo(me.renderEl);
            me.options.renderTo = id;
            me.rendered = true;
            me.moveAllEl.scrollLeft(me.moveAllEl.get(0).scrollWidth);
        }
    });
    /**
     * @description 滑动块组件
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
     * var sweetSlider = Sweet.Slider({
     * });
     */
    Sweet.Slider = $.sweet.widgetSlider;
}(jQuery));
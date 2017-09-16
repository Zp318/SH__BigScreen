/**
 * @fileOverview
 * <pre>
 * 组件--鱼骨图
 * 2013.9.16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    var fboneStartClass = "sweet-chart-fishbone-head",
        fbonePointClass = "sweet-chart-fishbone-point",
        fboneEndClass = "sweet-chart-fishbone-end",
        fboneMidUpArrowClass = "sweet-chart-fishbone-middle-upArrow",
        fboneMidDownArrowClass = "sweet-chart-fishbone-middle-downArrow",
        fboneStartUpLabOutClass = "sweet-chart-fishbone-up-outLabel",
        fboneStartUpLabClass = "sweet-chart-fishbone--up-label",
        fboneStartDownLabClass = "sweet-chart-fishbone-down-label",
        upTabelEIClass = "sweet-chart-fishbone-upTable",
        downTabelEIClass = "sweet-chart-fishbone-downTable",
        fboneMajorClass = "sweet-chart-fishbone-midAll",
        fboneWidgetClass = "sweet-chart-fishbone-widget";

    $.widget("sweet.widgetFishbone", $.sweet.widgetChart, /** @lends Sweet.chart.Fishbone.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-fishbone]",
        // Fishbone组件公共配置参数
        options: /** @lends Sweet.chart.Fishbone.prototype*/{
            /**
             * @description Fishbone宽度
             * @type {String/Number}
             * @default "100%"
             */
            width: "100%",
            /**
             * @description Fishbone高度
             * @type {String/Number}
             * @default 500px
             */
            height: 500,
            /**
             * @description 鱼骨图数据
             * @param {Array}
             * @default null
             */
            data: null,
            /**
             * @description 鱼头部分下箭头说明
             * @param {Array}
             * @default null
             */
            desc: null,
            /**
             * @description 上下箭头的控件
             * @param {Array}
             * @default null
             */
            items: null
        },

        /**
         * @public
         * @description 设置鱼骨图数据
         * @param {Array} data 数据
         * data数据结构为[
         *                {value: "110515\n100.00%", "text": "CM Service\nRequest", data: Object},
         *                ...
         *              ]
         */
        setData: function(data) {
            if($.isNull(data)){
                return;
            }

            var me = this;
            //先删除原来的表格对象
            me._destroyWidget();

            if ($.isArray(data)){
                me.options.data = data;
            }
            me.fishBoneEI.empty();

            //创建fishbone
            me._createFishWidget();
            //先dolayout给表格渲染的div设置宽度和高度，后面再调用表格渲染
            me._doLayout();
            //创建箭头所指的表格
            me._creatFishArrowTable();
        },
        /**
         * @private
         * 组件渲染
         * @param {String} id 宿主ID
         * @return {Boolean} true:创建成功 false:创建失败
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }

            me.chartEl.appendTo(me.renderEl);
            //创建箭头所指的表格
            me._creatFishArrowTable();
            me.rendered = true;
            return true;
        },

        /**
         * @private
         * @description 创建fishbone组件总入口
         */
        _createJsChart: function() {
            var me = this,
                    opt = me.options;

            me.fishBoneEI = $("<div>").appendTo(me.chartEl)
                    .width(opt.width).height(opt.height).addClass(fboneWidgetClass);

            //创建fishbone
            me._createFishWidget();
            
        },

        /**
         * @private
         * @description 创建fishbone
         */
        _createFishWidget:function(){
            var me = this,
                data = me.options.data;
            me.fboneMajor = $("<div>").appendTo(me.fishBoneEI).addClass(fboneMajorClass);
            
            //存放上面的table对象
            me.upTables = [];
            //存放下面的table对象
            me.downTables = [];
            if($.isNull(data)){
                //创建鱼头
                me._createFishHead();
                //创建鱼尾
                me._createFishEnd();
            }
            else{
                if($.isArray(data)){
                    //创建鱼头
                    me._createFishHead();

                    //创建鱼身
                    me._createFishMiddle();

                    //创建鱼尾
                    me._createFishEnd();
                }
            }
        },

        /**
         * @private
         * @description 创建鱼头
         */
        _createFishHead:function(){
            var me = this,
                fishHeadEI = me.fishHeadEI=  $("<div>").addClass(fboneStartClass),
                headDownLabel,
                headUpLabel,
                fishHeadUpEI = me.fishHeadUpEI= $("<div>").appendTo(fishHeadEI).addClass(fboneStartUpLabOutClass),
                fishHeadUpLab = me.fishHeadUpLab = $("<div>").appendTo(fishHeadUpEI).addClass(fboneStartUpLabClass),
                fishHeadDownLab = me.fishHeadDownLab = $("<div>").appendTo(fishHeadEI).addClass(fboneStartDownLabClass);

            if($.isNotNull(me.options.desc)){
                headUpLabel = (me.options.desc)[0].replace(/\n/g,"<br>");
                headDownLabel = (me.options.desc)[1].replace(/\n/g, "<br>");
            }

            fishHeadUpLab.html(headUpLabel);
            fishHeadDownLab.html(headDownLabel);
            fishHeadEI.appendTo(me.fboneMajor);
        },

        /**
         * @private
         * @description 创建鱼身
         */
        _createFishMiddle:function(){
            var me = this,
                options = me.options,
                data = options.data || [],
                len = data.length,
                fishMiddleEI,
                fishMidPointEI,
                fishMidPointUpLabOutEI,
                fishMidPointUpLabEI,
                fishMidPointDownLabEI,
                upPointText,
                downPointText,
                tempData,
                tempWid;

            me.data = data;

            fishMiddleEI = me.fishMiddleEI =$("<div>").appendTo(me.fboneMajor);
            tempWid = 150;
            if($.isNotNull(data) && 0 < len){
                for(var i = 0; i < len; i++){
                    tempData = data[i];
                    downPointText = tempData.value.replace(/\n/g,"<br>");
                    upPointText = tempData.text.replace(/\n/g,"<br>");

                    fishMidPointEI = me.fishMidPointEI= $("<div>").appendTo(fishMiddleEI).addClass(fbonePointClass);
                    fishMidPointUpLabOutEI =$("<div>").appendTo(fishMidPointEI).addClass(fboneStartUpLabOutClass);
                    fishMidPointUpLabEI = $("<div>").appendTo(fishMidPointUpLabOutEI).addClass(fboneStartUpLabClass);
                    fishMidPointDownLabEI =$("<div>").appendTo(fishMidPointEI).addClass(fboneStartDownLabClass);
                    fishMidPointUpLabEI.html(upPointText);
                    fishMidPointDownLabEI.html(downPointText);

                    if($.isArray(tempData.data) && tempData.data.length > 0){
                        var tdlen = tempData.data.length;
                        tempWid += (tdlen+1)*100;
                        var preid = options.id + "-chart";
                        for(var k = 0; k < tdlen; k++){
                            var griddata = tempData.data[k].options.data;
                            var h = 30;
                            if($.isFunction(tempData.data[k].options.contentDescriptionFunc)){
                                h += 27;
                            }
                            if(griddata.data && griddata.data.length >0){
                                h += griddata.data.length*28;
                            } else {
                                h += 30;
                            }
                            
                            if(k%2 === 0 && i%2 === 0){
                                var upArrowEl = $("<div>").appendTo(fishMiddleEI).addClass(fboneMidUpArrowClass);
                                var upChartEl = $("<div>").appendTo(upArrowEl);
                                upChartEl.realh = h;
                                me.upTables.push(upChartEl);
                                var id = preid + "-up-" + i + k;
                                tempData.data[k].fishRenderId = id;
                                upChartEl.addClass(upTabelEIClass).attr("id", id);
                            } else {
                                var downArrowEl = $("<div>").appendTo(fishMiddleEI).addClass(fboneMidDownArrowClass);
                                var downChartEl = $("<div>").appendTo(downArrowEl);
                                downChartEl.realh = h;
                                me.downTables.push(downChartEl);
                                var id = preid + "-down-" + i + k;
                                tempData.data[k].fishRenderId = id;
                                downChartEl.addClass(downTabelEIClass).attr("id", id);
                            }
                        }
                    } else {
                        if(i === len - 1){
                            tempWid += 100;
                        } else {
                            tempWid += 200;
                            $("<div>").appendTo(fishMiddleEI).addClass("sweet-chart-fishbone-blank");
                        }
                    }
                }
            }
            fishMiddleEI.css("width",tempWid+20);
        },

        /**
         * @private
         * @description 创建箭头布局
         */
        _creatFishArrowTable:function(){
            var me = this,
                options = me.options,
                data = options.data,
                len = data.length,
                temp;
            
            for(var i = 0; i < len; i++){
                var temp = data[i].data;
                if(!temp){
                    continue;
                }
                for(var j = 0; j < temp.length; j++){
                    temp[j].render(temp[j].fishRenderId);
                }
            }
        },

        /**
         * @private
         * @description 创建鱼尾
         */
        _createFishEnd:function(){
            var me = this,
                fishEndEI = me.fishEndEI= $("<div>").addClass(fboneEndClass);

            fishEndEI.appendTo(me.fboneMajor);
        },

        /**
         * @private
         * @description 刷新布局
         */
        _doLayout:function(){
            var me = this,
                    width = me.fishBoneEI.width(),
                    height = me.fishBoneEI.height(),
                    top = Math.floor((height-100)/2);
            
            //set the fish bone position
            me.fboneMajor.css({top: top});
            var padding = (width-me.fboneMajor.width())/2;
            if(padding < 0){
                padding = 0;
            }
            me.fishBoneEI.css({
                    "padding-left": padding
                });
           
           //代码中所有使用100的地方，100代表每一个图片的宽度，除了鱼头的图片宽度是50px
           //下面的10代表的是间隔，让图看起来不拥挤
           var padding = 10;
           var h = top - padding;
            for(var i = 0; i < me.upTables.length; i++){
                var realh = me.upTables[i].realh;
                var tabh = h > realh ? realh : h;
                me.upTables[i].css("top", -tabh).css("height", tabh);
            }
            for(var i = 0; i < me.downTables.length; i++){
                var realh = me.downTables[i].realh;
                var tabh = h > realh ? realh : h-10;
                me.downTables[i].css("top", 100+10).css("height", tabh);
            }
        },
        _setHeight : function(h){
            this.fishBoneEI.externalHeight(h);
        },
        _setWidth : function(w){
            this.fishBoneEI.externalWidth(w);
        },
        _setWH : function(w, h){
            this.fishBoneEI.externalWidth(w);
            this.fishBoneEI.externalHeight(h);
        },
        _getHeight : function(){
            return this.fishBoneEI.externalHeight();
        },
        _getWidth : function(){
            return this.fishBoneEI.externalWidth();
        },
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            var me = this,
                options = me.options,
                data = options.data,
                len = data.length,
                temp;
            
            for(var i = 0; i < len; i++){
                var temp = data[i].data;
                if(!temp){
                    continue;
                }
                for(var j = 0; j < temp.length; j++){
                    $.isFunction(temp[j].destroy) ? temp[j].destroy() : "";
                }
            }
        }
    });

    /**
     * @description 鱼骨对象
     * @name Sweet.chart.Fishbone
     * @class
     * @extends Sweet.chart
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建鱼骨：
     * var sweetFishbone= Sweet.chart.Fishbone({
     *     width: 350,
     *     height: 150
     * });
     */

    Sweet.chart.Fishbone = $.sweet.widgetFishbone;
}(jQuery));

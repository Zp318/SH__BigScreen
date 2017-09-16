/**
 * @fileOverview
 * <pre>
 * 地图组件
 * 2013/09/01
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var mapContainClass = "sweet-mapContainer-cls";
    $.widget("sweet.widgetMap", $.sweet.widget, /** @lends Sweet.Map.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-map]",
        eventNames:/** @lends Sweet.Map.prototype*/{
            /**
             * @event
             * @description 单击事件,一般参数为两个(evt, data)
             */
            click:"单击事件",
			/**
             * @event
             * @description 地图已加载事件,一般参数为两个(evt, data)
             */
			MapIsOk:"地图已加载完事件",

            /**
             * @event
             * @description 地图层级放大缩小事件,一般参数为两个(evt, data)
             */
            mapZoomEnd:"地图层级放大缩小事件",

            /**
             * @event
             * @description 指标切换事件一般参数为两个(evt, data)
             */
            kqiChange:"指标切换事件"
        },
        //地图组件公共配置参数
        options:/** @lends Sweet.Map.prototype*/{
            /**
             * 地图宽度
             * @type {String/Number}
             * @default 660px
             */
            width: 600,
            /**
             * 地图高度
             * @type {String/Number}
             * @default 600px
             */
            height: 600,
            /**
             * 小区的集合信息，例如：[{"value":"01","text":"成功率：96%，通话率：98%，拥塞率：0.00%","data":["x":"112" , "y":"115", "angle":null, "color":"#adadad"]}]
             * @type Array
             * @default []
             */
            cellData : [],
            /**
             * 地图的业务图层的编号id
             * @type number
             * @default null
             */
            layerId : null,
            /**
             * 具体图层的数据及提示信息及图层指定的颜色，及多指标时着色指标的名称
             * @example [{"value":"1190","text":"成功率:96%,通话率:98%,拥塞率:0.00%","data":{"kpiname":"通话率","color":"0xA1D9F0"}},...]
             * @type Array
             * @default []
             */
            layerData : [],
            /**
             * 图层的默认颜色值
             * @type String
             * @default ""
             */
            layerDefaultColor : "",
			
			/**
             * 图层的图例,图例的顺序，从左到右依次对应数组的0,1,2
			 * @example [{"color":"0xFF0000","text":"严重告警"},{"color":"0xFFA500","text":"一般告警"},{"color":"0x00FF00","text":"正常"}]
             * @type Array
             * @default []
             */
			 layerLengedInfo : [],
			 
			 
			/**
             * 图层的kqiList
			 * @example [{"text":"指标1"},{"text":"指标1"},{"text":"指标1"},{"text":"指标1"}]
             * @type Array
             * @default []
             */
			 kqiList : [],
             /**
             * 图层是否添加过滤查询控件
             * @type Boolean
             * @default false
             */
            isFilter : false,
			 /**
             * 图层是否已点显示控件
             * @type Boolean
             * @default false
             */
			isCircle : false,
             /**
             * 图层自动切换集合
             * @type Boolean
             * @default false
             */
            dashboardMapLayer : {}
        },
        /**
         * @description 清除地图的当前图层
         */
        clearLayer : function(){
            var me = this;
            if(me.mapObj){
                me.mapObj.clearLayer();
            }
        },
		/**
         * @description 清除地图的当前图层
         */
		 setKqiList : function(data){
			var me = this;
            if(me.mapObj){
                me.mapObj.setKqiList(data);
            }
		 },
		/**
          * 图层的图例,图例的顺序，从左到右依次对应数组的0,1,2
		  * @example [{"color":"0xFF0000","text":"严重告警"},{"color":"0xFFA500","text":"一般告警"},{"color":"0x00FF00","text":"正常"}]
          * @type Array
          * @default []
         */
        setLenged : function(data){
            var me = this;
            if(me.mapObj){
                me.mapObj.setLenged(data);
            }
        },
        /**
         * 给地图设置或更新数据(图层更新或指标tips提示信息更新，图层的颜色，小区信息)
         * @param {Object/Array} data 
         */
        setData : function(data){
            var me = this;
            if($.isArray(data)){
                me.options.layerData = $.objClone(data);
            } else {
                for(var key in data){
                    me.options[key] = JSON.parse(JSON.stringify(data[key]));
                }
            }
            
            if(me.mapObj){
                me.mapObj.setLayerId(me.options.layerId);
				if(me.options.layerDefaultColor){
					me.mapObj.setLayerDefaultCorlor(me.options.layerDefaultColor);
				}
                me.mapObj.setLayerData(me.options.layerData);
            }
        },
        /**
         * @private
         * @description 设置组件宽度，子类继承实现
         * @param {number} w description
         */
        _setWidth: function(w){
            this.mapContainerEl.externalWidth(w);
            if(this.mapObj){
                this.mapObj.setWidth(w);
            }
        },
        /**
         * @private
         * @description 设置组件高度，子类继承实现
         * @param {number} h description
         */
        _setHeight: function(h){
            this.mapContainerEl.externalHeight(h);
            if(this.mapObj){
                this.mapObj.setHeight(h);
            }
        },
        /**
         * @private
         * @description 设置组件宽度、高度，子类继承实现
         * @param {number} w description
         * @param {number} h description
         */
        _setWH: function(w, h){
            this._setWidth(w);
            this._setHeight(h);
        },
        /*
         * @description 获取小区信息
         */
        getCellData: function(){
            return $.objClone(this.options.cellData);
        },
        /*
         * @public
         * @description  生成小区的扇形图
         * @param {Array} data 小区的信息 value:小区id, text:小区提示显示 ,data:小区经纬度，例如：
         * data = [{"value":"01","text":"成功率：96%，通话率：98%，拥塞率：0.00%","data":["x":"112" , "y":"115", "angle":null]}]
         */
        creatPointLayer:function(data){
            var me = this;
            //调用flex中的添加小区方法
            me.options.cellData = $.objClone(data);               
            if(me.mapObj){
                me.mapObj.addCell(data,"noTest");
            }
        },
		
		/*
         * @public
         * @description  生成线图
         * @param {Array} data 小区的信息 id:线id, color:线颜色 ,alpha:线透明度，weight：线宽度，points:坐标数组{x:x坐标，y：坐标}例如：
		 * data =[{"id":"1","color":"0x2E8B57","alpha":"1","weight":"5","points":[{"x":"39820745.83898479","y":"21406294.299312293"},{"x":"39818157","y":"21408233"}]},{"id":"2","color":"0x2E8B57","points":[{"x":"39900130.60206777","y":"21395739.383323033"},{"x":"39897717.542758045","y":"21394142.77265194"}]}]
         */
		addLine:function(data){
		var me = this;
            //调用flex中的添加线方法                        
            if(me.mapObj){
                me.mapObj.addLine(data);
            }
		},
		
		/*
         * @public
         * @description  刷新线样式
         * @param {Array} {Array} data 小区的信息 id:线id, color:线颜色 ,alpha:线透明度，weight：线宽度，例如：
         * data = [{"id":"1","color":"0x2E8B57","alpha":"1","weight":"5"},{"id":"2","color":"0x2E8B57"}]
         */
		reFreshLine:function(data){
		var me = this;
            //调用flex中的刷新线方法                        
            if(me.mapObj){
                me.mapObj.reFreshLine(data);
            }
		},
		
        /*
         * @public
         * @description  刷新cell样式
         * @param {Array} {Array} data 小区的信息 id:线id, color:线颜色 ,alpha:线透明度，weight：线宽度，例如：
         * data = [{"id":"1","color":"0x2E8B57","alpha":"1","weight":"5"},{"id":"2","color":"0x2E8B57"}]
         */
        reFreshCell:function(data){
        var me = this;
            //调用flex中的刷新线方法                        
            if(me.mapObj){
                me.mapObj.reFreshCell(data);
            }
        },


		/**
         * @public
         * @description 移除线图层
         *
         */
        clearLine:function(){
            var me = this;
            //调用flex中的移除小区
            if(me.mapObj){
                me.mapObj.clearLine();
            }
        },
        /**
         * @public
         * @description 移除点图层
         *
         */
        removePointLayer:function(){
            var me = this;
            //调用flex中的移除小区
            if(me.mapObj){
                me.mapObj.removePointLayer();
            }
        },

        /**
         * @public
         * @description 业务地图cell区域定位
         * @param {String/Number} layerId 当前图层的recid
         */
        setPosition: function(layerId){
            var me = this;
            if($.isNull(layerId)){
                return;
            }
            if(me.mapObj){
                me.mapObj.setPosition(layerId);
            }
        },
		
		/**
         * @public
         * @description 业务地图区域(BSC,RNC,SGSN...)定位
         * @param {String/Number} layerId 当前图层的recid
         */
		setPositionLayer:function(layerId){
		var me = this;
            if($.isNull(layerId)){
                return;
            }
            if(me.mapObj){
                me.mapObj.setPositionLayer(layerId);
            }
		},
		
		
		
        /**
         * @private
         * @description 组件渲染, 子类继承实现
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.mapContainerEl.appendTo(me.renderEl);
            me.rendered = true;
            me.options.renderTo = id;
            me._createMapWidget();
            return true;
        },
        /**
         * @private
         * @description 创建map组件总入口
         */
        _createSweetWidget: function() {
            if (this.renderEl) {
                return;
            }

            var me = this,
                    opt = me.options;
            me.mapContainerEl = $("<div>").attr("id", opt.id)
                    .width(opt.width)
                    .height(opt.height)
                    .addClass(opt.widgetClass);
            me.mapId = opt.id + "-map";
            me.mapEl = $("<div>").attr("id", me.mapId)
                    .width(opt.width)
                    .height(opt.height)
                    .appendTo(me.mapContainerEl);
        },
        
        /**
         * @private
         * @description 创建map组件
         */
        _createMapWidget: function() {
            var me = this,
                    opt = me.options,
                    w = opt.width,
                    h = opt.height;
            //此处嵌入地图flex工程
            me.mapObj = new Supermapflex(me, me.mapId, me.mapId, w, h, opt.cellData,opt.layerLengedInfo,opt.kqiList,opt.isCircle,opt.isFilter,opt.dashboardMapLayer);
            if(me.mapObj && me.options.layerId){
                me.mapObj.setLayerId(me.options.layerId);
				if(me.options.layerDefaultColor){
					me.mapObj.setLayerDefaultCorlor(me.options.layerDefaultColor);
				}
                me.mapObj.setLayerData(me.options.layerData);
            }
        },
        /**
         * @private
         * @description 销毁MAP组件
         */
        _destroyWidget: function() {
        },
        /**
         * @private
         * @description 组件布局刷新基本处理
         */
        _doLayout:function(){
            var me = this,
                    w = me.mapContainerEl.width(),
                    h = me.mapContainerEl.height();
                
            me._setWH(w, h);
            //给地图添加border，如果在setWidth,height之前加，计算出来的宽度和高度会小于实际的宽度和高度
            //me.mapContainerEl.addClass(mapContainClass);
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth:function(){
            return this.mapContainerEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight:function(){
            return this.mapContainerEl.externalHeight();
        }
    });

    /**
     * @description 地图
     * @class
     * @extends jquery.sweet.widget
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建地图：
     * var sweetmap = new Sweet.Map({
     *      width : 600,
     *      height : 400,
     *      renderTo : "map-div"
     * });
     */
    Sweet.Map = $.sweet.widgetMap;
}(jQuery));

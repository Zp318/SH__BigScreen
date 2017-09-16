/**
 * @fileOverview
 * <pre>
 * char组件基类
 * 2012/11/28
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * </pre>
 * @version 1.0
 */

/**
 * char组件
 * @name Sweet.chart
 * @class
 * @extends Sweet.widget
 * @requires 
 * <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.sweet.widget.js
 * </pre>
 */
(function($, undefined) {
    $.widget("sweet.widgetChart", $.sweet.widget, /** @lends Sweet.chart.prototype*/{
        version: "1.0",
        /**
         * @private
         * 组件名称
         */
        sweetWidgetName: "[widget-chart]:",
        /**
         * @private
         * 图形最大支持分组个数
         */
        maxPacket: 10,
        /**
         * 颜色序列
         */
        colors: {
            colors1: ["#97A9B7"],
            colors2: ["#97a9b6", "#3281cb"],
            colors: ["#448bce", "#60a2e0", "#76b6f1", "#378838", "#4bb54d",
                     "#7ece56", "#c26e37", "#db8349", "#e6a05c", "#d5dae0"]//["#369cd8", "#b7e042", "#cf7a37", "#8e4beb", "#5adbd3","#ffb940", "#98458b", "#ff5ce5", "#69db08", "#cf4737", "#a5a5a5"]
        },
        options: /** @lends Sweet.chart.prototype*/{
            /**
             * 图的数据
             * @type Array
             * @default []
             */
            data: [],
            /**
             * 组件数据key值, 约定第一个是文本key, 之后全部为数据key
             * @type Array
             * @default []
             */
            dataKeys: [],
            /**
             * 图形组件的store
             * @type object
             * @default null
             */
            store : null
        },
        labelColor : Sweet.constants.chart.titleCfg.labelColor,
        labelAlpha : Sweet.constants.chart.titleCfg.labelAlpha,
        fontSizeLarger : Sweet.constants.chart.fontSize.larger,
        fontSizeNormal : Sweet.constants.chart.fontSize.normal,
        textColor : Sweet.constants.chart.textColor,
        chartFontFamily : Sweet.constants.chart.fontFamily,
        /**
         * @description 返回组件对象
         */
        widget: function() {
            return this.chartElement;
        },
        /**
         * @description 设置组件数据
         * @param {Object} dataInfo  数据对象 {chartTitle:"", data: [{},{}...], dataKeys: []}
         * @param {Boolean} isClear 设置数据时是否destroy图表
         * @return {boolean} 判断dataKeys的值，如果不合要求，返回false
         */
        setData: function(dataInfo, isClear) {
            var me = this,
                //对象个数
                index = 0,
                //表示是否有除数据外的其它属性改变
                isPropertyChanged = false;
            if($.isNull(dataInfo)){
                $.log("set data is null");
                return;
            }
            // 校验
            if ($.isFunction(me._validate) && !me._validate(dataInfo)) {
                return;
            }

            // 更新options中的配置数据
            if ($.isArray(dataInfo)) {
                me.options.data = dataInfo;
                //表示只更新数据
                isPropertyChanged = true;
            } else {
                //Begin----------add for DTS2014031407008
                //判断是否只更新数据，只有一个对象属性，且为data属性; 或data和dataKey且dataKey较上次一样
                if (me._isUpdateData(dataInfo)) {
                    isPropertyChanged = true;
                }
                //end----------add for DTS2014031407008
            }
            
            //没有数据时，设置自己格式的数据
            if($.isNull(me.options.data)){
                me.options.data = [];
            }
            if(me.options.data.length === 0 && isPropertyChanged && me._setDefaultData){
                me._setDefaultData();     //各自的子类实现
            } else {
                if($.isFunction(me._setChangeProperty) && isClear){
                    me._setChangeProperty(isClear);
                    return;
                }
                //除了更新数据，还要更新其它属性时，调用_setChangeProperty
                if(!isPropertyChanged){
                    //当图的属性发生改变时，调用各子类的方法更新属性值
                    if($.isFunction(me._setChangeProperty)){
                        me._setChangeProperty();     //各子类实现
                    }
                } else {
                    //仅仅只更新数据
                    if($.isFunction(me._updateData)){
                        me._updateData();     //各子类实现
                    }
                }
            }
        },
        _getCanvasObject : function(){
            var me = this,
                    id = me.options.id;
            //must rendered
            if(!me.rendered){
                return null;
            }
            var h = me.chartEl.height(),
                    w = me.chartEl.width();
            //
            var canvs = $("<canvas>").attr({
                width : w,
                height : h
            });
            //first find all svg or canvas in component id
            var div = me.chartEl.get(0),
                    svgsPos = [],
                    th = 0, tw = 0, x = 0, y = 0,
                    svgs = div.getElementsByTagName('svg');
            var remember = {
                x: 0,
                y: 0
            };
            if(!svgs || svgs.length <= 0){
                var canvas = div.getElementsByTagName('canvas');
                var d = null;
                if(canvas && canvas.length > 0){
                    d = canvas[0];
                }
                return d;
            }
            //对所有的svg的位置进行解析，并计算出最终图占用的宽度和高度
            for(var i = 0; i < svgs.length; i++){
                var temp = svgs[i],
                        parent = temp.parentNode,
                        svgX = Number(parent.style.left.slice(0, -2)),
                        svgY = Number(parent.style.top.slice(0, -2));
                if (parent.style.position == 'relative') {
					x = svgX ? svgX : x;
					y = svgY ? svgY : y;
				} else {
					x = svgX + remember.x;
					y = svgY + remember.y;
				}
                svgsPos.push({
                    svg : $.dealAttrSVG(temp.cloneNode(true)),
                    offset : {
                        x : x, 
                        y : y
                    }
                });
                if ( svgY && svgX ) {
                } else {
                    y += svgY ? 0 : parent.offsetHeight;
                    th += parent.offsetHeight;
                }
            }
            canvs.attr({
                width : w,
                height : th > h ? th : h
            });
            var fcanvas = canvs.get(0);
            for(var i = 0; i < svgsPos.length; i++){
                var svg = svgsPos[i].svg,
                        offset = svgsPos[i].offset,
                        str = new XMLSerializer().serializeToString(svg);
                canvg(fcanvas, str, {
                    offsetX: offset.x,
                    offsetY: offset.y,
                    ignoreMouse: true,
                    ignoreAnimation: true,
                    ignoreDimensions: true,
                    ignoreClear: true
                });
            }
            return fcanvas;
        },
        /**
         * @private
         * @description 是否走更新数据操作
         * @param {Object} dataInfo  数据对象 {chartTitle:"", data: [{},{}...], dataKeys: []}
         * @return {boolean} 如果走更新则返回true,否则返回false
         */
        _isUpdateData: function(dataInfo) {
            var me = this,
                    keyCount = 0,
                    keys = {},
                    KEYNAME_DATA = "data",
                    KEYNAME_DATAKEYS = "dataKeys",
                    oldDataKeys = me.options[KEYNAME_DATAKEYS];
            if (!dataInfo) {
                return false;
            }
            for (var key in dataInfo) {
                keyCount++;
                me.options[key] = dataInfo[key];
                keys[key] = key;
            }
            if (keyCount > 2) {
                return false;
            }
            if (keyCount <= 0) {
                return false;
            }
            if (1 == keyCount) {
                if (keys[KEYNAME_DATA]) {
                    return true;
                }
                if (keys[KEYNAME_DATAKEYS] && !me._isDataKeysChange(dataInfo[KEYNAME_DATAKEYS], oldDataKeys)) {
                    return true;
                }
            }
            if (2 == keyCount && keys[KEYNAME_DATA] && keys[KEYNAME_DATAKEYS]) {
                if (me._isDataKeysChange(dataInfo[KEYNAME_DATAKEYS], oldDataKeys)) {
                    return false;
                }
                return true;
            }
            return false;
        },
        /**
         * @private
         * @description 更新数据时判断前后dataKey是否有变化
         * @param {Array} newDataKeys  新的dataKey
         * @param {Array} oldDataKeys  旧的dataKey
         * @return {boolean} 如果前后dataKey有变化则返回true,否则返回false
         */
        _isDataKeysChange: function(newDataKeys, oldDataKeys) {
            var keyLength = 0,
                    startIndex = 0,
                    flag = false;
            try
            {
                if (newDataKeys.length == oldDataKeys.length) {
                    keyLength = newDataKeys.length;
                    for (var i = 0; i < keyLength; i++) {
                        if (startIndex == i) {
                            if (newDataKeys[i] != oldDataKeys[i]) {
                                flag = true;
                                break;
                            }
                        } else {
                            if (newDataKeys[i][0] != oldDataKeys[i][0]) {
                                flag = true;
                                break;
                            }
                        }
                    }
                    if (flag) {
                        return true;
                    }
                    return false;
                }
                return true;
            } catch (e) {
                return true;
            }
        },
        /**
         * @private
         * @description 图的点击事件
         */
        _click: $.noop,
        /**
         * @private
         * @description 为组件注册事件, 子类实现
         */
        _addListener: $.noop,
        /**
         * @private
         * 删除注册监听事件，子类继承实现
         */
        _removeListener: $.noop,
        /**
         * @private
         * @description 数据校验
         * @param {Object} data 进行校验的数据集合
         */
        _validate: function(data) {
            if ($.isNull(data)) {
                this._error("Input parameter must not be empty!");
                return false;
            }

            // 图最多支持的分组,暂不限制

            if (!this.__validate()) {
                return false;
            }

            return true;
        },
        /**
         * @private
         * @description 供子类实现各自特有校验规则
         */
        __validate: function() {
            return true;
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            this.chartEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            this.chartEl.externalHeight(height);
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            this._setWidth(width);
            this._setHeight(height);
        },
        /**
         * @description 返回组件宽度
         * @return {Number} 返回组件宽度
         */
        _getWidth: function() {
            return this.chartEl.externalWidth();
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        _getHeight: function() {
            return this.chartEl.externalHeight();
        },
        /**
         * @description 返回图组件最外层jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        _getWidgetEl: function(original) {
            return original ? this.chartEl[0] : this.chartEl;
        },
        /**
         * @private
         * @description 绘制饼图 
         */
        _createSweetWidget: function() {
            // 校验
            if (!this._validate(this.options.data)) {
                return;
            }

            var me = this,
                    options = me.options;

            // 图的容器对象
            me.chartEl = $("<div>").width(options.width)
                    .height(options.height)
                    .attr("id", options.id)
                    .addClass(options.widgetClass);
            
            //如果配置了store，设置store的setData事件，进行数据的更新
            if(!$.isNull(options.store)){
                options.store.addListener({"setData": me.setData, "scope": this});
            }
            
            // not support flash chart any longer

            this._createJsChart();
        },
        /**
         * @private
         * @description 创建js版饼图
         */
        _createJsChart: $.noop,
        /**
         * @private
         * @description 渲染饼图到相应的到div
         * @param {String} id 目标元素ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.chartEl.appendTo(me.renderEl);
            me.options.renderTo = id;
            me._chartRender();
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 图形类子组件继承实现
         */
        _chartRender: $.noop,
        /**
         * @private
         * @description 组件宽度、高度发生变化后调用，进行页面重绘，子类继承实现。
         */
        _doLayout: $.noop,
        /**
         * @private
         * @description 关闭浮动窗口，子类继承实现。框架统一调用。
         */
        _closeFloatPanel: $.noop,
        /**
         * @private
         * @description 创建flash版饼图
         */
        _createFlashChart: $.noop,
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            if (this.chartEl) {
                this.chartEl.remove();
            }
        },
        /**
         * 根据序列总数，及序列索引，取得颜色值
         * @param {Number} count 总数据数
         * @param {Number} idx 数据索引
         * @param {Boolean} skip 是否跳跃选择
         * @returns {string}
         * @private
         */
        _getColor: function (count, idx, skip) {
            var colors = {};

            // 取得颜色序列
            if (count <= this.maxPacket) {
                colors = this.colors["colors" + (count <= 2 ? count : "")];
            }
            else {
                return;
            }

            // 从颜色序列中间隔取颜色
            if (idx > 0 && count > 2 && skip) {
                idx = Math.floor(colors.length / count) * idx;
            }

            return colors[idx];
        }
    });
}(jQuery));

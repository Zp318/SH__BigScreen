/**
 * @fileOverview  
 * <pre>
 * 图--指示灯
 * 2013/4/10
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 创建指示灯
 * @name Sweet.chart.Indicator
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
 *  indicator1 = new Sweet.chart.Indicator({
 *      width: 300,
 *      data: {"major": 2, "minor": 3, "normal": 5},
 *      renderTo: "sweet-chart-indicator1",
 *      click: function(e, data) {
 *          console.log("clicK: current value is " + 
 *              data.currentVal + ", and this indicator's value is " + 
 *              data.value.major + "," + data.value.minor + ","  + data.value.normal);
 *      }
 *  });
 * </pre>
 */

(function($, undefined) {
    var indicatorDiv1Cls = "sweet-chart-indicator-div1",
            indicatorColorCommon = "sweet-chart-indicator-color-common",
            indicatorRedLeft = "sweet-chart-indicator-red-left",
            indicatorRedAll = "sweet-chart-indicator-red-all",
            indicatorYellowAll = "sweet-chart-indicator-yellow-all",
            indicatorYellowLeft = "sweet-chart-indicator-yellow-left",
            indicatorYellowMiddel = "sweet-chart-indicator-yellow-middle",
            indicatorYellowRight = "sweet-chart-indicator-yellow-right",
            indicatorGreenAll = "sweet-chart-indicator-green-all",
            indicatorGreenRight = "sweet-chart-indicator-green-right",
            indicatorGrayAll = "sweet-chart-indicator-gray-all";
    $.widget("sweet.widgetChartIndicator", $.sweet.widgetChart, /** @lends Sweet.chart.Indicator.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-chart-indicator]:",
        eventNames: /** @lends Sweet.chart.Indicator.prototype*/{
            /**
            * @event
            * @description 指示灯单击事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            click: "指示灯单击事件"
        },
        options: /** @lends Sweet.chart.Indicator.prototype*/{
            /**
             * 组件高度
             * @type Number
             * @default 21
             */
            height: 21,
            /**
             * 组件数据, 默认要求数据格式为{"major": 2, "minor": 1, "normal": 3}
             * @type Object
             * @default {}
             */
            data: {}
        },
        /**
         * @description 设置组件值
         * @param {Object} data 数据
         */
        setData: function(data) {
            var me = this;
            me.options.data = data;
            me._doLayout();
        },
        /**
         * @private
         * @description 去激活注册事件
         * @param {Sting} eName 去除的事件的名称，不传或为空时，去除全部的注册事件
         */
        _removeListener: function(eName) {
            var me = this;
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(eventName, func) {
                me.indicatorDiv1El.unbind(eventName);
            });
        },
        /**
         * @private
         * 组件注册监听事件
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if ("click" === eventName && me.indicatorDiv1El) {
                    me.indicatorDiv1El.bind(eventName, {"me": me, "func": func}, me._onClick);
                }
            });
        },
        /**
         * @parivate
         * @description 创建js版饼图
         */
        _createJsChart: function() {
            var me = this,
                    options = me.options,
                    data = options.data;
            
            // 红、黄、绿组件
            var indicatorDiv1El = me.indicatorDiv1El = $("<div>").appendTo(me.chartEl),
                    indicatorLeftEl = me.indicatorLeftEl = $("<div>").appendTo(me.indicatorDiv1El),
                    indicatorMiddelEl = me.indicatorMiddelEl = $("<div>").appendTo(me.indicatorDiv1El),
                    indicatorRightEl = me.indicatorRightEl = $("<div>").appendTo(me.indicatorDiv1El);
            me.indicatorLeftEl.data({type: "major"});
            me.indicatorMiddelEl.data({type: "minor"});
            me.indicatorRightEl.data({type: "normal"});
            // 注册事件
            me.addListener();
            me._creatDiffIndicator();
        },
        /**
         * @private
         * @description 计算比例，默认最小应占到 1/4
         * @param {Number} proportion 所占比例
         * @param {Number} total 总值
         * @param {Number} width 外层组件宽度
         */
        _creatDiffIndicator: function() {
            var me = this,
                    options = me.options,
                    data = options.data;

            // 数据格式校验
            if (data.major === undefined || data.major < 0 ||
                    data.minor === undefined || data.minor < 0 ||
                    data.normal === undefined || data.normal < 0) {
                if(!data.options || data.options.gray === undefined) {
                    return;
                }
                me._creatGrayIndicator();
            } else {
                me._madeColorElCss();
            }
        },
        /**
         * @private
         * @description 计算比例，默认最小应占到 1/4
         * @param {Number} proportion 所占比例
         * @param {Number} total 总值
         * @param {Number} width 外层组件宽度
         */
        __caculateWidth: function(proportion, total) {
            if (0 === proportion) {
                return 0;
            }
            return (proportion / total) * 100;
        },
        /**
         * @parivate
         * @description 修改不同颜色组合的样式
         */
        _madeColorElCss: function() {
            var me = this,
                    data = me.options.data;
            
            var segmentWidth = me._getColorSegmentWidth(),
                    majorSize = segmentWidth.majorSize,
                    normalSize = segmentWidth.normalSize,
                    minorSize = segmentWidth.minorSize;

            // 颜色组合分类
            // 有红色
            if (data.major !== 0) {
                // 有黄色
                if (data.minor !== 0) {
                    // 1、 红-黄-绿
                    if (data.normal !== 0) {
                        me.indicatorLeftEl.html(data.major)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorRedLeft)
                                .width(majorSize);
                        me.indicatorMiddelEl.html(data.minor)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorYellowMiddel)
                                .width(minorSize);
                        me.indicatorRightEl.html(data.normal)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorGreenRight)
                                .width(normalSize);
                    }
                    // 2、红-黄
                    else {
                        me.indicatorLeftEl.html(data.major)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorRedLeft)
                                .width(majorSize);
                        me.indicatorRightEl.html(data.minor)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorYellowRight)
                                .width(minorSize);
                    }
                }
                // 无黄色
                else {
                    // 3、红-绿
                    if (data.normal !== 0) {
                        me.indicatorLeftEl.html(data.major)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorRedLeft)
                                .width(majorSize);
                        me.indicatorRightEl.html(data.normal)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorGreenRight)
                                .width(normalSize);
                    } // 4、红
                    else {
                        me.indicatorLeftEl.html(data.major)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorRedAll)
                                .width(majorSize);
                    }
                }
            }
            // 无红色
            else {
                if (data.minor !== 0) {
                    if (data.normal !== 0) {
                        // 5、黄-绿
                        me.indicatorLeftEl.html(data.minor)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorYellowLeft)
                                .width(minorSize);
                        me.indicatorRightEl.html(data.normal)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorGreenRight)
                                .width(normalSize);
                    } else {
                        // 6、黄
                        me.indicatorLeftEl.html(data.minor)
                                .removeClass()
                                .addClass(indicatorColorCommon + " " + indicatorYellowAll)
                                .width(minorSize);
                    }
                } else {
                    // 7、只有绿色数值或三个数据都为0，都有绿色表示，宽度为100%
                    me.indicatorLeftEl.html(data.normal)
                            .removeClass()
                            .addClass(indicatorColorCommon + " " + indicatorGreenAll)
                            .width(me.chartEl.width());
                }
            }
            if (data && data["unClick"]) {
                if ("true" === data["unClick"]["major"] || true === data["unClick"]["major"]) {
                    if (me.indicatorLeftEl) {
                        me.indicatorLeftEl.css({cursor: "default"});
                    }
                }
                if ("true" === data["unClick"]["minor"] || true === data["unClick"]["minor"]) {
                    if (me.indicatorMiddelEl) {
                        me.indicatorMiddelEl.css({cursor: "default"});
                    }
                }
                if ("true" === data["unClick"]["normal"] || true === data["unClick"]["normal"]) {
                    if (me.indicatorRightEl) {
                        me.indicatorRightEl.css({cursor: "default"});
                    }
                }
            }
        },
        /**
         * @parivate
         * @description 计算红黄绿各占的像素值
         */
        _getColorSegmentWidth: function() {
            var me = this,
                    data = me.options.data,
                    width = me.chartEl.width();

            data.major = parseInt(data.major, 10);
            data.minor = parseInt(data.minor, 10);
            data.normal = parseInt(data.normal, 10);

            var total = data.major + data.minor + data.normal;
            var majorSize = me.__caculateWidth(data.major, total);
            var minorSize = me.__caculateWidth(data.minor, total);
            var normalSize = me.__caculateWidth(data.normal, total);

            var majorFlag = (majorSize < 25 && majorSize > 0);
            var minorFlag = (minorSize < 25 && minorSize > 0);
            var normalFlag = (normalSize < 25 && normalSize > 0);

            var num = 0;
            num = majorFlag ? num + 1 : num;
            num = minorFlag ? num + 1 : num;
            num = normalFlag ? num + 1 : num;

            if(1 === num) {
                var tot = 0;
                var wid = 0;
                if(majorFlag) {
                    majorSize = Math.round(25 / 100 * width);
                    tot = data.minor + data.normal;
                    wid = width - majorSize;
                    minorSize = Math.round(me.__caculateWidth(data.minor, tot) / 100 * wid);
                    normalSize = wid - minorSize;
                }
                if(minorFlag) {
                    minorSize = Math.round(25 / 100 * width);
                    tot = data.major + data.normal;
                    wid = width - minorSize;
                    majorSize = Math.round(me.__caculateWidth(data.major, tot) / 100 * wid);
                    normalSize = wid - majorSize;
                }
                if(normalFlag) {
                    normalSize = Math.round(25 / 100 * width);
                    tot = data.minor + data.major;
                    wid = width - normalSize;
                    minorSize = Math.round(me.__caculateWidth(data.minor, tot) / 100 * wid);
                    majorSize = wid - minorSize;
                }
            } else if(2 === num) {
                majorSize = Math.round(25 / 100 * width);
                minorSize = Math.round(25 / 100 * width);
                normalSize = Math.round(25 / 100 * width);
                if(!normalFlag) {
                    normalSize = Math.round(50 / 100 * width);
                }
                if(!minorFlag) {
                    minorSize = Math.round(50 / 100 * width);
                }
                if(!majorFlag) {
                    majorSize = Math.round(50 / 100 * width);
                }
            } else {
                majorSize = Math.round(majorSize / 100 * width);
                minorSize = Math.round(minorSize / 100 * width);
                normalSize = Math.round(normalSize / 100 * width);
            }

            var widthValue = {"majorSize": majorSize, "minorSize": minorSize, "normalSize": normalSize};
            return me._correctWidthValue(widthValue, width);
        },
        /**
         * @parivate
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _creatGrayIndicator: function() {
            var me = this,
                    options = me.options,
                    data = options.data;
            
            me.indicatorLeftEl.html(data.options.gray)
                .removeClass()
                .addClass(indicatorColorCommon + " " + indicatorGrayAll)
                .width(me.chartEl.width());
            if (data && data["unClick"]) {
                if ("true" === data["unClick"]["major"] || true === data["unClick"]["major"]) {
                    if (me.indicatorLeftEl) {
                        me.indicatorLeftEl.css({cursor: "default"});
                    }
                }
            }
        },
        /**
         * @parivate
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _doLayout: function() {
            if (!this.rendered) {
                return;
            }
            var me = this;
            me.indicatorLeftEl.width(0).text("").removeClass();
            me.indicatorMiddelEl.width(0).text("").removeClass();
            me.indicatorRightEl.width(0).html("").removeClass();
            me._creatDiffIndicator();
        },
        /**
         * @parivate
         * @descrption 重新设置数据
         * @param {object} val 组件data值
         */
        _setValue: function(val) {
            this._error("Nothing to do!");
            return;
        },
        /**
         * 获取组件值
         * @private
         * @return {Object} 
         */
        _getValue: function() {
            this._error("Nothing to do!");
            return;
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget: function() {
            var me = this;
            if (me.indicatorDiv1El) {
                me.indicatorDiv1El.bind("click", {"me": me}, me._onClick);
            }
        },
        /**
         * @parivate
         * 点击事件
         * @param {Object} event 按钮单击对象
         */
        _onClick: function(event) {
            var me = event.data.me,
                    obj = $(event.target),
                    currentType = obj.data("type"),
                    data = me.options.data,
                    params = {currentVal: obj.html(), currentType: currentType, value: data},
            func = event.data.func;
            if (data && data["unClick"]) {
                if ("true" === data["unClick"][currentType] || true === data["unClick"][currentType]) {
                    return false;
                }
            }
            if (func) {
                func.call(this, $.objClone(params));
            } else {
                me._trigger("click", event, $.objClone(params));
            }
        },
        /**
         * @private
         * @description 组件销毁
         */
        _destroyWidget: function() {
            var me = this;
            if (me.indicatorLeftEl) {
                me.indicatorLeftEl.remove();
            }
            if (me.indicatorMiddelEl) {
                me.indicatorMiddelEl.remove();
            }
            if (me.indicatorRightEl) {
                me.indicatorRightEl.remove();
            }
            if (me.indicatorDiv1El) {
                me.indicatorDiv1El.unbind();
                me.indicatorDiv1El.remove();
            }
            me._super();
        },
        /**
         * @private
         * @description 对计算的三个像素值处理
         * @param {Object} jsonData,红黄绿各占的像素值
         * @param {Object} totolWidth,组件的宽度
         * @return {Number} 返回最大值的位置 
         */
        _correctWidthValue: function(jsonData, totalWidth) {
            var result = jsonData,
                    addWidth = jsonData.majorSize + jsonData.minorSize + jsonData.normalSize,
                    diff = addWidth - totalWidth,
                    max = {
                        name: "majorSize",
                        value: jsonData.majorSize
                    };
            if(0 === addWidth) {
                return result;
            }
            for(var key in jsonData){
                if(jsonData[key] > max.value){
                    max = {
                        name: key,
                        value: jsonData[key]
                    };
                }
            }
            result[max.name] = result[max.name] - diff;
            return result;
        }
    });

// 饼图组件
    Sweet.chart.Indicator = $.sweet.widgetChartIndicator;

}(jQuery));

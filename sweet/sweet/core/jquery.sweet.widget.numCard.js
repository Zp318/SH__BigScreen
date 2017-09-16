/**
 * @fileOverview
 * <pre>
 * 分数卡组件
 * 2013/9/13
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var cardMainPanelClass = "sweet-numcard-panel",
            cardBodyClass = "sweet-numcard-body",
            cardLabelPanelClass = "sweet-numcard-label-panel",
            cardLabelTextClass = "sweet-numcard-label-text",
            cardBodyActiveClass = "sweet-numcard-body-active",
            numBodyClass = "sweet-numcard-num-body",
            numPanelClass = "sweet-numcard-num-panel",
            numItemClass = "sweet-numcard-num-item",
            cardTitleClass = "sweet-numcard-title",
            cardTitleDataClass = "sweet-numcard-titledata",
            eventClick = "click",
            KEY_VALUE = "value",
            KEY_TEXT = "text",
            KEY_TITLEDATA = "titleData",
            KEY_COLOR = "color",
            KEY_TIP = "tip",
            KEY_TEXTALIGN = "textAlign",
            KEY_LABEL = "label",
            KEY_ISLABELTIP = "isLabelTip",
            KEY_ISLABESYMBOL = "isLabelSymbol",
            KEY_LABELWIDTH = "labelWidth",
            SYMBOLTEXT = ":",
            //考虑到渐变色,其每个color值为一数组,若无渐变色则这个数组给一个值
            NUM_COLOR = {
                "0": ["#f17268", "#ec3b2d"],
                "1": ["#51bd51", "#0ca20c"],
                "2": ["#F5F32B", "#F6DC04"]
            },
            //无数据时给的一个默认数据
            NUM_VALUE = {
                value: [
                    [
                        {value: "", color: "0"},
                        {value: "", color: "1"}
                    ],
                    [
                        {value: "", color: "0"},
                        {value: "", color: "1"}
                    ]
                ],
                text: "",
                textAlign: "top",
                label: "",
                isLabelTip: false,
                isLabelSymbol: false,
                labelWidth: 0
            },
            STYLE = {
                //label宽
                labelWidth: 80,
                //显示块间的间距
                itemMargin: 5,
                //第一个显示块距外层左侧的间距
                paddingLeft: 10
            };
    $.widget("sweet.widgetNumCard", $.sweet.widget, /**lends Sweet.NumCard.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-NumCard]",
        eventNames: /** @lends Sweet.NumCard.prototype*/{
            /**
             * @event
             * @description 单击时事件,一般两个参数(evt, data)
             */
            click: "单击事件"
        },
        options: /** @lends Sweet.NumCard.prototype*/{
            /**
             * 宽度
             * @type {Number}
             * @default 205
             */
            width: 262,
            /**
             * 高度
             * @type {Number}
             * @default 252
             */
            height: 105,
            /**
             * 分数卡显示的值和指标名称
             * @type {Object}
             * @default {text: "", value: [{value: "", color: "0"}, {value: "", color: "1"}], tip: null}
             */
            data: {
                /**
                 * 分数卡值
                 * @type Array
                 * @default []
                 */
                value: [{value: "", color: "0"}, {value: "", color: "1"}],
                /**
                 * 分数卡显示的指标名称
                 * @type String
                 * @default ""
                 */
                text: "",
                /**
                 * 分数卡TIP提示信息
                 * @type String
                 * @default null
                 */
                tip: null,
                /**
                 * 指标名称的位置,默认显示在上方
                 * @type String
                 * @default "top"
                 */
                textAlign: "top",
                /**
                 * 指标名称前的label提示
                 * @type Array
                 * @default []
                 */
                label: [],
                /**
                 * label提示的宽
                 * @type Number
                 * @default 80
                 */
                labelWidth: STYLE.labelWidth,
                /**
                 * label是否有提示
                 * @type Boolean
                 * @default false
                 */
                isLabelTip: false,
                /**
                 * label文本后是否有":"
                 * @type Boolean
                 * @default false
                 */
                isLabelSymbol: false
            },
            /**
             * 分数卡颜色
             * @type {Object}
             * @default {"0": ["#f17268", "#ec3b2d"], "1": ["#51bd51", "#0ca20c"], "2": ["#FFCC00", "#FFA500"]}
             */
            color: NUM_COLOR
        },
        /**
         * @description 更新分数卡数据信息
         * @param {Array} data 组件对应的数据，格式和配置数据一样
         */
        setData: function(data) {
            var me = this;
            me.options.data = data;
            me._createNumCard(data);
            me._doLayout();
        },
        /**
         * @description 设置分数卡值,和更新时数据格式一样
         * @param {Array} value 组件对应的数据，格式和配置数据一样
         */
        setValue: function(value) {
            var me = this;
            me.setData(value);
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 组件值
         */
        getValue: function() {
            var me = this;
            return $.objClone(me.options.data);
        },
        /**
         * @private
         * @description 获取组件数据
         * @return {Object} 组件数据
         */
        getData: function() {
            var me = this;
            return $.objClone(me.options.data);
        },
        /**
         * @private
         * @description 激活或去掉激活
         * @param {Boolean} isActive 是否激活
         */
        active: function(isActive) {
            var me = this;
            isActive = (true == isActive || "true" == isActive) ? true : false;
            if (!me.numCardEl) {
                return;
            }
            if (isActive) {
                me.numCardEl.addClass(cardBodyActiveClass);
                me._triggerHandler(null, eventClick, {"me": me, data: me.getValue()});
            } else {
                me.numCardEl.removeClass(cardBodyActiveClass);
            }
        },
        /**
         * @private
         * @description 获取当前状态,是否是激活
         * @returns {Boolean} active 是否激活
         */
        isActive: function() {
            var me = this;
            if (!me.numCardEl) {
                return false;
            }
            return me.numCardEl.hasClass(cardBodyActiveClass);
        },
        /**
         * @private
         * @description 设置数据显示块颜色
         * @param {Object} color 颜色值
         */
        setColor: function(color) {
            var me = this;
            if (!color) {
                color = {};
            }
            me.options.color = color;
            me.setData(me.options.data);
        },
        /**
         * @private
         * @description 获取组件宽度
         * @returns {Number/String} width 组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.options.width;
        },
        /**
         * @private
         * @description 获取组件高度
         * @returns {Number/String} height 组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.options.height;
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.options.width = width;
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.options.height = height;
        },
        /**
         * @private
         * @description 设置宽度、高度
         * @param {String/Number} width 宽度
         * @param {String/Number} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me.options.width = width;
            me.options.height = height;
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.numCardPanelEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createSweetWidget: function() {
            var me = this;
            //创建分数卡组件
            me._createNumCard(me.options.data);
        },
        /**
         * @private
         * @description 数据校验
         * @param {Object} data 数据信息
         * @returns {Array} data 校验后的数据信息
         */
        _initData: function(data) {
            var me = this,
                    resultData;
            resultData = $.objClone(data);
            //数据校验
            if (!resultData) {
                resultData = NUM_VALUE;
                return resultData;
            }
            if (!resultData[KEY_TEXT]) {
                resultData[KEY_TEXT] = "";
            }
            if (!resultData[KEY_VALUE] || resultData[KEY_VALUE].length <= 0) {
                resultData[KEY_VALUE] = NUM_VALUE[KEY_VALUE];
            }
            if (!resultData[KEY_LABEL]) {
                resultData[KEY_LABEL] = [];
            }
            if (resultData[KEY_TEXTALIGN] && "BOTTOM" == resultData[KEY_TEXTALIGN].toUpperCase()) {
                resultData[KEY_TEXTALIGN] = "bottom";
            } else {
                resultData[KEY_TEXTALIGN] = "top";
            }
            if (resultData[KEY_ISLABELTIP] && (true == resultData[KEY_ISLABELTIP] || "true" == resultData[KEY_ISLABELTIP])) {
                resultData[KEY_ISLABELTIP] = true;
            } else {
                resultData[KEY_ISLABELTIP] = false;
            }
            if (resultData[KEY_ISLABESYMBOL] && (true == resultData[KEY_ISLABESYMBOL] || "true" == resultData[KEY_ISLABESYMBOL])) {
                resultData[KEY_ISLABESYMBOL] = true;
            } else {
                resultData[KEY_ISLABESYMBOL] = false;
            }
            resultData[KEY_LABELWIDTH] = parseInt(resultData[KEY_LABELWIDTH]);
            if (isNaN(resultData[KEY_LABELWIDTH])) {
                resultData[KEY_LABELWIDTH] = STYLE.labelWidth;
            }
            return resultData;
        },
        /**
         * @private
         * @description 创建分数卡组件
         * @param {Object} data 组件信息
         */
        _createNumCard: function(data) {
            var me = this,
                    tempData,
                    tempLabelTextEl;
            me.labelTextEls = [];
            me.itemEls = [];
            if (me.numCardPanelEl) {
                me.numCardPanelEl.remove();
            }
            me.data = tempData = me._initData(data);
            //主DIV
            me.numCardPanelEl = $("<div>").attr("id", me.options.id).addClass(cardMainPanelClass);
            if (me.options.widgetClass && "" != me.options.widgetClass) {
                me.numCardPanelEl.addClass(me.options.widgetClass);
            }
            //如果配置了label则创建
            me.numLabelEl = $("<div>").addClass(cardLabelPanelClass).appendTo(me.numCardPanelEl);
            if (tempData[KEY_LABEL] && tempData[KEY_LABEL].length > 0) {
                for (var i = 0; i < tempData[KEY_LABEL].length; i++) {
                    tempLabelTextEl = $("<span>").addClass(cardLabelTextClass).addClass(cardLabelTextClass + "-00" + (i + 1)).appendTo(me.numLabelEl);
                    if (tempData[KEY_ISLABESYMBOL]) {
                        tempLabelTextEl.text(tempData[KEY_LABEL][i] + SYMBOLTEXT);
                    } else {
                        tempLabelTextEl.text(tempData[KEY_LABEL][i]);
                    }
                    if (tempData[KEY_ISLABELTIP]) {
                        tempLabelTextEl.attr("title", (tempData[KEY_LABEL][i] ? tempData[KEY_LABEL][i] : ""));
                    }
                    me.labelTextEls.push(tempLabelTextEl);
                }
            }
            //最外层容器DIV
            me.numCardEl = $("<div>").addClass(cardBodyClass)
                    .bind(eventClick, {"me": me, data: me.getValue()}, me._onClick)
                    .appendTo(me.numCardPanelEl);
            if (tempData[KEY_TIP]) {
                me.numCardEl.attr("title", tempData[KEY_TIP]);
            }
            //label
            me.numTitlelEl = $("<div>").text(tempData[KEY_TEXT]).addClass(cardTitleClass);
            //数据显示容器DIV
            me.numBodyEl = $("<div>").addClass(numBodyClass);
            if ("bottom" == tempData[KEY_TEXTALIGN]) {
                me.numBodyEl.appendTo(me.numCardEl);
                if (!(typeof tempData[KEY_TITLEDATA] === "undefined")) {
                    me.numTitleDataEl = $("<div>").text(tempData[KEY_TITLEDATA]).addClass(cardTitleDataClass);
                    me.numTitleDataEl.appendTo(me.numCardEl);
                }
                me.numTitlelEl.appendTo(me.numCardEl);
            } else {
                me.numTitlelEl.appendTo(me.numCardEl);
                if (!(typeof tempData[KEY_TITLEDATA] === "undefined")) {
                    me.numTitleDataEl = $("<div>").text(tempData[KEY_TITLEDATA]).addClass(cardTitleDataClass);
                    me.numTitleDataEl.appendTo(me.numCardEl);
                }
                me.numBodyEl.appendTo(me.numCardEl);
            }

            //数值显示块EL集合
            for (var i = 0; i < tempData[KEY_VALUE].length; i++) {
                me.itemEls.push(me._createItemEls(tempData[KEY_VALUE][i]));
            }
            if (me.rendered) {
                me.numCardPanelEl.appendTo(me.renderEl);
            }
        },
        /**
         * @private
         * @description 单击事件
         * @param {Object} e 事件对象
         */
        _onClick: function(e) {
            var me = e.data.me;
            me.active(true);
        },
        /**
         * @private
         * @description 创建分数卡值显示部分
         * @param {Object} datas 组件信息
         * @returns {Array} itemEls 显示部分EL的集合
         */
        _createItemEls: function(datas) {
            var me = this,
                    itemValue,
                    itemColorKey,
                    color = me.options.color,
                    sColor,
                    eColor,
                    tempColor,
                    itemTip,
                    tempItemEls,
                    itemEls = [],
                    numPanel;
            if (!color) {
                color = NUM_COLOR;
            }
            numPanel = $("<div>").addClass(numPanelClass).appendTo(me.numBodyEl);
            for (var i = 0; i < datas.length; i++) {
                itemValue = ("" + datas[i][KEY_VALUE]) || "";
                itemColorKey = datas[i][KEY_COLOR] || ("" + i);
                itemTip = datas[i][KEY_TIP] || itemValue;
                tempItemEls = $("<div>").addClass(numItemClass)
                        .text(itemValue)
                        .attr("title", itemTip);
                tempColor = color[itemColorKey];
                //如果有颜色则设置渐变颜色
                if (tempColor && tempColor.length > 0) {
                    //如果只有一种则用这一种
                    sColor = tempColor[0];
                    if (tempColor[1]) {
                        eColor = tempColor[1];
                    } else {
                        eColor = sColor;
                    }
                    tempItemEls.css({"background": "-moz-linear-gradient(center top , " + sColor + ", " + eColor + ") repeat scroll 0 0 transparent"});
                    tempItemEls.css({"background": "-webkit-linear-gradient(top , " + sColor + ", " + eColor + ") repeat scroll 0 0 transparent"});
                }
                tempItemEls.addClass(numItemClass).appendTo(numPanel);
                itemEls.push(tempItemEls);
            }
            return itemEls;
        },
        //组件重绘
        _doLayout: function() {
            var me = this,
                    tempData = me.data,
                    itemEls = me.itemEls,
                    itemWidth,
                    itemHeight,
                    width = parseInt(me.options.width),
                    height = parseInt(me.options.height),
                    titleHeight = me.numTitlelEl.externalHeight(),
                    titleDataHeight = 0,
                    labelWidth = 0,
                    labelHeight = 0,
                    borderWidth = 2,
                    numCardBodyHeight,
                    numCardBodyWdith,
                    isTop = true;
            if (tempData) {
                labelWidth = tempData[KEY_LABELWIDTH] ? tempData[KEY_LABELWIDTH] : 0;
                if ("bottom" == tempData[KEY_TEXTALIGN]) {
                    isTop = false;
                }
            }
            if (me.numTitleDataEl) {
                titleDataHeight = me.numTitleDataEl.externalHeight();
            }
            labelHeight = numCardBodyHeight = height - titleHeight - titleDataHeight;
            if (me.labelTextEls && me.labelTextEls.length > 0) {
                me.numLabelEl.width(labelWidth).height(labelHeight);
                if (isTop) {
                    me.numLabelEl.css({"padding-top": (titleHeight + titleDataHeight)});
                    me.numBodyEl.css({"padding-bottom": STYLE.itemMargin});
                } else {
                    me.numLabelEl.css({"padding-top": (2 * STYLE.itemMargin)});
                    me.numBodyEl.css({"padding-top": STYLE.itemMargin});
                }
            } else {
                me.numLabelEl.width(0).height(0);
            }
            labelWidth = me.numLabelEl.externalWidth();
            me.numCardPanelEl.width(width).height(height);
            numCardBodyWdith = width - labelWidth - borderWidth;
            me.numCardEl.width(numCardBodyWdith - 1).height(height);
            if (itemEls && itemEls.length > 0) {
                if (itemEls[0] && itemEls[0].length > 0) {
                    itemWidth = Math.floor((numCardBodyWdith - (2 * STYLE.paddingLeft)) / itemEls[0].length);
                }
                itemHeight = Math.floor((numCardBodyHeight - (itemEls.length * STYLE.itemMargin) - STYLE.itemMargin) / itemEls.length);
                for (var i = 0; i < itemEls.length; i++) {
                    if (itemEls[i] && itemEls[i].length > 0) {
                        for (var j = 0; j < itemEls[i].length; j++) {
                            if (isTop) {
                                itemEls[i][j].width(itemWidth).height(itemHeight).css({"line-height": (itemHeight + "px"), "margin-bottom": (STYLE.itemMargin + "px")});
                            } else {
                                itemEls[i][j].width(itemWidth).height(itemHeight).css({"line-height": (itemHeight + "px"), "margin-top": (STYLE.itemMargin + "px")});
                            }

                        }
                    }
                }
            }
            if (me.labelTextEls && me.labelTextEls.length > 0) {
                for (var i = 0; i < me.labelTextEls.length; i++) {
                    me.labelTextEls[i].height(itemHeight).css({"line-height": (itemHeight + "px")});
                }
            }
        }
    });

    /**
     * 分数卡
     * @name Sweet.NumCard
     * @class 
     * @extends Sweet.widget
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * sweetNumCard = new Sweet.NumCard({
     *     data: {
     *         text: "语音",                                    //title
     *         titleData: "0%",
     *         value: [                                         //数据为二维数组,控制渲染多少行与每行多少个
     *                  [{value: "171"}, {value: "0"}],
     *                  [{value: "258"}, {value: "30"}]
     *         ],
     *         data: "这是用户自定义数据",                       //用户自定义数据
     *         tip: "这是组件的tip提示信息",                     //组件TIP提示   
     *         label: ["2014-04-01", "Select Time Period"],     //组件前label信息
     *         labelWidth: 120,                                 //label宽度    
     *         isLabelSymbol: true,                             //label文本后面是否加上":"
     *         isLabelTip: true                                 //label是否出提示    
     *     }
     * });
     * </pre>
     */
    Sweet.NumCard = $.sweet.widgetNumCard;
}(jQuery));
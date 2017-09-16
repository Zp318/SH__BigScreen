/**
 * @fileOverview
 * <pre>
 * 记分卡组件
 * 2013/9/13
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var unitClass = "sweet-scoreCard-unit",
            offsetClass = "sweet-scoreCard-offset",
            diffClass = "sweet-scoreCard-diff",
            textORClass = "sweet-scoreCard-textOR",
            textTRClass = "sweet-scoreCard-textTR",
            cardClass = "sweet-scoreCard-card",
            cardClassClick = "sweet-scoreCard-card-click",
            numClass = "sweet-scoreCard-num",
            valueClass = "sweet-scoreCard-value",
            iconClass = "sweet-scoreCard-icon",
            iconClass2 = "sweet-scoreCard-icon2",
            noValueClass = "sweet-scoreCard-noValue",
            noValueClass2 = "sweet-scoreCard-noValue2",
            colorObj = {},
            iconTypeObj = {};
    colorObj[Sweet.constants.numColor.YELLOW] = "sweet-scoreCard-yellow";
    colorObj[Sweet.constants.numColor.GREEN] = "sweet-scoreCard-green";
    colorObj[Sweet.constants.numColor.RED] = "sweet-scoreCard-red";
    iconTypeObj[Sweet.constants.differType.EQUAL] = "sweet-scoreCard-equal";
    iconTypeObj[Sweet.constants.differType.INCREASE] = "sweet-scoreCard-increase";
    iconTypeObj[Sweet.constants.differType.DECREASE] = "sweet-scoreCard-decrease";
    $.widget("sweet.widgetScoreCard", $.sweet.widget, /**lends Sweet.ScoreCard.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-ScoreCard]",
        eventNames: /** @lends Sweet.form.ComboBox.prototype*/{
            /**
             * @event
             * @description 值改变的事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            click: "点击事件"
        },
        options: /** @lends Sweet.ScoreCard.prototype*/{
            /**
             * 文字描述的位置，可选值为: "down","up", 默认为"down"
             * @type String
             * @default "down"
             */
            textPosition : "down",
            /**
             * 记分卡显示的值和指标名称
             * @type {Object}
             * @default {value:"", text:"",data:{unit:""},options:{color:"",trend:"",offset:"",microLine:[]}}
             */
            value: {
                /**
                 * 记分卡值
                 * @type string
                 * @default undefined
                 */
                value: undefined,
                /**
                 * 记分卡显示的指标名称
                 * @type string
                 * @default ""
                 */
                text: "",
                /**
                 * 业务相关信息，其中unit代表单位
                 * @type {Object}
                 * @default {unit:""}
                 */
                data: {unit: ""},
                options: {
                    /**
                     * 记分卡值的颜色，没有配置默认为绿色,可选值：green/red/yellow
                     * @type string
                     * @default ""
                     */
                    color: "",
                    /**
                     * 走向值，在图上使用三角表示，可选值：equal/increase/decrease
                     * @type string
                     * @default ""
                     */
                    trend: "",
                    /**
                     * 相对于上周期的增值,例如"+1,234"、"-234"
                     * @type string
                     * @default undefined
                     */
                    offset: undefined
                }
            }
        },
        /**
         * @private
         * @description 设置记分卡显示的值和指标名称等
         * @param {Object} value 记分卡显示的值和指标名称
         */
        _setValue: function(value) {
            if ($.isNull(value)) {
                return;
            }
            var me = this;
            me.options.value = JSON.parse(JSON.stringify(value));
            me._clearWidget();
            me._createScoreCard();
            me._doLayout();
        },
        /**
         * 获取组件值
         * @private
         * @return {Object} 组件值
         */
        _getValue: function() {
            var me = this,
                    options = me.options;
            
            return options.value;
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            if (!id || this.rendered) {
                return;
            }
            if (!this.renderEl) {
                // 创建宿主元素               
                this._createRenderEl(id);
            }
            this.cardEl.appendTo(this.renderEl);
            this.rendered = true;
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createSweetWidget: function() {
            var me = this,
                options = me.options,
                width = options.width;
            me.cardEl = $("<div>").addClass(cardClass)
                .addClass(options.widgetClass)
                .attr("id", me.options.id)
                .css("width", width);
            //创建记分卡组件
            me._createScoreCard();
        },
        /**
         * @private
         * @description 创建记分卡组件
         */
        _createScoreCard: function() {
            var me = this,
                    options = me.options.value,
                    option = options.options,
                    value = options.value,
                    txtPos = me.options.textPosition,
                    data = options.data;
            //添加名称部分
            if (txtPos === "up" && $.isNotNull(options.text)) {
                me.titleEl = $("<div>").appendTo(me.cardEl)
                        .text(options.text)
                        .attr("title", options.text)
                        .addClass(textORClass);
            }
            //添加值部分
            if (!$.isUndefined(value)) {
                me._addValueEl();
                me.numEl = $("<span>").appendTo(me.valueEl);
                if (value !== "") {
                    me.numEl.text(value).addClass(numClass);
                    if ($.isNotNull(option) && $.isNotNull(option.color)) {
                        me.numEl.addClass(colorObj[option.color]);
                    } else {
                        me.numEl.addClass(colorObj[Sweet.constants.numColor.GREEN]);
                    }
                    //value为空，显示"--"
                } else {
                    me.numEl.text(Sweet.constants.scoreCard.NO_VALUE).addClass(noValueClass);
                }
            }
            //添加单位部分
            if ($.isNotNull(data)) {
                if ($.isNotNull(data.unit)) {
                    me._addValueEl();
                    me.unitEl = $("<span>").appendTo(me.valueEl)
                            .text(data.unit)
                            .addClass(unitClass);
                }
            }
            if ($.isNotNull(option)) {
                //添加折线图部分
                //添加增值部分
                if (typeof(option.offset) !== 'undefined') {
                    me._addOffsetEl();
                    me.diffNumEl = $("<span>").appendTo(me.offsetEl);
                    if (option.offset !== "") {
                        me.diffNumEl.text(option.offset)
                                .addClass(offsetClass);
                        //若offset为空，则显示"--"
                    } else {
                        me.diffNumEl.text(Sweet.constants.scoreCard.NO_VALUE)
                                .addClass(noValueClass2);
                    }
                }
                //添加图标部分
                if ($.isNotNull(option.trend)) {
                    me._addOffsetEl();
                    me.iconEl = $("<span>").appendTo(me.offsetEl)
                            .addClass(iconTypeObj[option.trend]);
                    if (typeof(option.offset) !== 'undefined') {
                        me.iconEl.addClass(iconClass);
                    }
                    else {
                        me.iconEl.addClass(iconClass2);
                    }
                }
            }
            
            //添加名称部分
            if (txtPos === "down" && $.isNotNull(options.text)) {
                me.titleEl = $("<div>").appendTo(me.cardEl)
                        .text(options.text)
                        .attr("title", options.text)
                        .addClass(textORClass);
            }
        },
        //组件重绘
        _doLayout: function() {
            var me = this,
                    options = me.options,
                    valueW = 0,
                    cardH = 0,
                    valueH = 0,
                    offsetH = 0,
                    titleH2 = 0,
                    numW = 0,
                    unitW = 0,
                    textH = 0,
                    titleT = 0,
                    titleW = 0,
                    titleL = 0,
                    subLength = 0,
                    titleH = 0,
                    numW2 = 0,
                    numT = 0,
                    numL = 0,
                    subLen = 0,
                    numText = "",
                    titleText = 0;
            if (me.valueEl) {
                valueW = me.valueEl.width();
            }
            if ($.isNotNull(options.value.value)) {
                numW = me.numEl.width();
            }
            if ($.isNotNull(options.value.data) && $.isNotNull(options.value.data.unit)) {
                unitW = me.unitEl.width();
            }
            //单行溢出文本显示省略号"..."
            if (valueW < numW + unitW) {
                numW2 = valueW - unitW;
                numT = me.numEl.text();
                numL = numT.length;
                subLen = Math.floor((numL * numW2) / numW - Sweet.constants.scoreCard.CHAR_NUM);
                numText = numT.substr(0, subLen) + "...";
                me.numEl.attr("title", numT)
                        .text(numText);
            }
            if ($.isNotNull(options.value.text)) {
                //一行文字的高度
                textH = me.titleEl.height();
                titleT = me.titleEl.text();
                titleW = me.titleEl.width();
            }
            titleL = titleT.length;
            //粗略估计两行文本能容纳的字符数
            subLength = (Sweet.constants.scoreCard.ROW * me.cardEl.width() * titleL) / titleW;
            //使文本自动换行
            if ($.isNotNull(options.value.text)) {
                me.titleEl.addClass(textTRClass);
                titleH = me.titleEl.height();
            }
            //最多显示两行，超出两行显示省略号"..."
            if (titleH > Sweet.constants.scoreCard.ROW * textH) {
                titleText = titleT.substr(0, subLength - 10) + "...";
                if ($.isNotNull(options.value.text)) {
                    me.titleEl.text(titleText)
                            .attr("title", titleT);
                    titleH = me.titleEl.height();
                }
            }
            //绘制折线图
            //动态设定组件高度
            if ($.isNotNull(options.value.text)) {
                titleH2 = me.titleEl.outerHeight();
            }
            if (me.offsetEl) {
                offsetH = me.offsetEl.outerHeight();
            }
            if (me.valueEl) {
                valueH = me.valueEl.outerHeight();
            }
            cardH = titleH2 + offsetH + valueH;
            me.cardEl.css("height", cardH);
        },
        /**
         * @private
         * @description 添加第一行DIV
         */
        _addValueEl: function() {
            var me = this;
            if (!me.valueEl) {
                me.valueEl = $("<div>").appendTo(me.cardEl)
                        .addClass(valueClass);
            }
        },
        /**
         * @private
         * @description 添加第二行DIV
         */
        _addOffsetEl: function() {
            var me = this;
            if (!me.offsetEl) {
                me.offsetEl = $("<div>").appendTo(me.cardEl)
                        .addClass(diffClass);
            }
        },
        /**
         * @private
         * @description 清空組件
         */
        _clearWidget: function() {
            var me = this;
            me.cardEl.empty();
            me.valueEl = null;
            me.offsetEl = null;
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.cardEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.cardEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.cardEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.cardEl.externalHeight(height);
        },

        /**
         * @private
         * @description 触发注册事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据
         */
        _triggerHandler: function(e, eName, data) {
            var me = this,
                    result;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    result = func.call(null, e, data);
                }
            });

            return result;
        },

        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    options = me.options;

            me.cardEl.bind("click", function() {
                me._triggerHandler(null, "click", me.getValue());
            });
        }
    });

    /**
     * 记分卡
     * @name Sweet.ScoreCard
     * @class 
     * @extends Sweet.widget
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sparkline.js
     * </pre>
     * @example 
     * <pre>
     * sweetScoreCard = new Sweet.ScoreCard({
     *     value:{
     *         value:"5335",
     *         text:"Page Response Delay",
     *         data:{unit:"ms"},
     *         options:{
     *             color:"red",
     *             trend:"increase",
     *             offset:"+1,234",
     *             microLine:[23,4,54,3,32]
     *         }
     *     }
     * });
     * </pre>
     */
    Sweet.ScoreCard = $.sweet.widgetScoreCard;
}(jQuery));


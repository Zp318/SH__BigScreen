/**
 * @fileOverview  
 * <pre>
 * 组件--阵列指示灯
 * 2013.7.1
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    "use strict";
    /**
     * 保存组件对象
     * 
     */
    var arrComponent = "sweet-arrayindicator-widget",
        arrContent = "sweet-arrayindicator-content",
        arrImage = "sweet-arrayindicator-image",
        arrServerGreen = "sweet-arrayindicator-serverGreen",
        arrServerRed = "sweet-arrayindicator-serverRed",
        arrServerGray = "sweet-arrayindicator-serverGray",
        arrRaidGreen = "sweet-arrayindicator-raidGreen",
        arrRaidRed = "sweet-arrayindicator-raidRed",
        arrRaidGray = "sweet-arrayindicator-raidGray",
        arrInfoDiv = "sweet-arrayindicator-infoDiv",
        arrInfoTable = "sweet-arrayindicator-infoUl",
        arrinfoTr = "sweet-arrayindicator-infoTr",
        arrInfoTrName = "sweet-arrayindicator-infoTrName",
        arrInfoTrValue = "sweet-arrayindicator-infoTrValue",
        arrInfoTrValueGreen = "sweet-arrayindicator-infoTrValue-green",
        arrInfoTrValueRed = "sweet-arrayindicator-infoTrValue-red",
        arrInfoLabelClassServer = "sweet-arrayindicator-label-server",
        arrInfoLabelClassRaid = "sweet-arrayindicator-label-raid";
        
    $.widget("sweet.widgetArrayIndicator", $.sweet.widget, /** @lends Sweet.ArrayIndicator.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-bxCarousel]",
        type: "bxCarousel",
        eventNames: /** @lends Sweet.ArrayIndicator.prototype*/{
            /**
            * @event
            * @description 点击图片事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            click: "点击图片事件"
        },
        options: /** @lends Sweet.ArrayIndicator.prototype*/{
            /**
             * 基础数据
             * @type Number
             * @default auto
             */
            height: "auto",
            /**
             * 基础数据
             * @type Object
             * @default null
             */
            data: null,
            /**
             * @description 是否有label
             * @type Boolean
             * @default false
             */
            label: true,
           
            /**
             * @description label文字
             * @type String
             * @default null
             */
            labelText: null,
            /**
             * @description label宽度
             * @type String/Number
             * @default 0.2
             */
            labelWidth: 0.2,
            /**
             * @description 显示类型，1：表示服务器, 2：表示磁阵
             * @type Number 
             * @default 1 
             */
            type: 1,
            /**
             * @description label文字是否显示符号
             * @type Boolean
             * @default :
             */
            symbol: true
        },
        /**
         * 重新设置基础数据
         * @param {object} 组件data值
         */
        setData : function(data) {
            var me = this,
                    options = me.options;

            options.data = data || options.data;
            me._removeTips();
            me._initData();
            me.arrayIndicatorUl.text("");
            me._createArrayIndicatorLi();
            me._doLayout();
        },

        /**
         * @description 设置输入类组件LabelText
         * @param {String} text Label Text
         */
        setLabelText: function(text) {
            var me = this;
            if (me.options.symbol) {
                text += Sweet.constants.symbol.COLON;
            }
            me.label.text(text);
        },

        /**
         * @description 返回输入类组件LabelText
         * @return {String} text Label Text
         */
        getLabelText: function() {
            var me = this;
            return me.label.text();
        },

        /**
         * @private
         * @description 创建组件总入口
         */
        _createSweetWidget: function() {
            var me = this,
                options = this.options,
                arrayIndicatorEl = me.arrayIndicatorEl = $("<div>").addClass(arrComponent).attr("id", options.id);
            // 数据初始化
            me._initData();
            // 创建label标签
            me._createLabel();
            // 创建组件
            me._createArrayIndicator();
        },

        /**
         * @private
         * @description 数据初始化
         */
        _initData: function() {
            var me = this,
                    options = me.options,
                    data = options.data,
                    dataMap = me.dataMap = {},
                    liObjMap = me.liObjMap = {};

            if(!$.isArray(data) || 1 > data.length) {
                return;
            }

            $.each(data, function(index, val) {
                dataMap[val.value] = val;
            });
        },

        /**
         * @private
         * @description 创建基本文本框前label标签
         */
        _createLabel: function() {
            if (!this.options.label) {
                return;
            }
            var me = this,
                    options = me.options,
                    label = me.label = $("<label>"),
                    labelText = '';
            if (!$.isNull(options.labelText)) {
                labelText += $.htmlEscape(options.labelText);
                if (options.symbol) {
                    labelText += Sweet.constants.symbol.COLON;
                }
            } else {
                return;
            }

            label.html(labelText).appendTo(me.arrayIndicatorEl);
        },

        /**
         * @private
         * @description 创建阵列指示灯组件
         */
        _createArrayIndicator: function() {
            var me = this,
                    options = me.options,
                    data = options.data,
                    arrayIndicatorDiv = me.arrayIndicatorDiv = $("<div>").addClass(arrContent)
                        .appendTo(me.arrayIndicatorEl),
                    arrayIndicatorUl = me.arrayIndicatorUl = $("<ul>").appendTo(arrayIndicatorDiv);
            
            me._createArrayIndicatorLi();
        },

        /**
         * @private
         * @description 创建Li
         */
        _createArrayIndicatorLi: function() {
            var me = this,
                    options = me.options,
                    data = options.data;
            
            if(!$.isArray(data) || 1 > data.length) {
                return;
            }
            var imageClass = "";
            $.each(data, function(index, val) {
                imageClass = me._getImageClass(val);
                var liEl = $("<li>").data("info", val.text)
                        .data("value", val.value)
                        .addClass(imageClass)
                        .bind("click", {"me":me}, me._clickImage)
                        .bind("mouseover", {"me":me}, me._showInfo)
                        .bind("mouseout", {"me":me}, me._closeInfo)
                        .appendTo(me.arrayIndicatorUl);
                me.liObjMap[val.value] = liEl;
            });
        },

        /**
         * @private
         * @description 计算图片的样式
         * @param {Object} value
         * @return {String} 样式名称
         */
        _getImageClass: function(value) {
            var me = this,
                    options = me.options,
                    imageClass = arrImage + " ",
                    status = parseInt(value.status, 10);

            if(1 === options.type) {
                if(1 === status) {
                    imageClass += arrServerGreen;
                } else if(2 === status) {
                    imageClass += arrServerRed;
                } else {
                    imageClass += arrServerGray;
                }
                if(me.label) {
                    me.label.addClass(arrInfoLabelClassServer);
                }
            } else {
                if(1 === status) {
                    imageClass += arrRaidGreen;
                } else if(2 === status) {
                    imageClass += arrRaidRed;
                } else {
                    imageClass += arrRaidGray;
                }
                if(me.label) {
                    me.label.addClass(arrInfoLabelClassRaid);
                }
            }
            return imageClass;
        },

        /**
         * @private
         * 点击图片事件
         * @param {Object} event
         */
        _clickImage: function(event) {
            var me = event.data.me,
                    options = me.options,
                    obj = $(event.currentTarget),
                    value = me.dataMap[obj.data("value")];

            me._triggerHandler(event, "click", value);
        },

        /**
         * @private
         * 显示状态信息
         * @param {Object} event
         */
        _showInfo: function(event) {
            var me = event.data.me,
                    options = me.options,
                    obj = $(event.currentTarget),
                    infoObj = obj.data("info");

            if(!$.isArray(infoObj) || 1 > infoObj.length) {
                return;
            }

            var infoDiv = $("<div>").addClass(arrInfoDiv).appendTo("body");
            var infoUl = $("<table>").addClass(arrInfoTable).appendTo(infoDiv);
            var status = 0;
            $.each(infoObj, function(index, info) {
                var infoTr = $("<tr>").addClass(arrinfoTr).appendTo(infoUl);
                var infoTrName = $("<td>").html(info.label).addClass(arrInfoTrName).appendTo(infoTr);
                var infoTrValue = $("<td>").html(info.desc).addClass(arrInfoTrValue).appendTo(infoTr);
                status = parseInt(info.status, 10);
                // 只有"状态"才会彩色显示
                if(1 === status) {
                    infoTrValue.addClass(arrInfoTrValueGreen);
                } else if(2 === status) {
                    infoTrValue.addClass(arrInfoTrValueRed);
                }
            });
            infoDiv.position({
                my: "left-20 top",
                at: "right bottom",
                of: obj,
                collision: "flipfit flipfit"
            });
            obj.data("infoDiv", infoDiv);
        },

        /**
         * @private
         * 显示状态信息
         * @param {Object} event
         */
        _closeInfo: function(event) {
            var me = event.data.me,
                    obj = $(event.currentTarget);
            if(obj.data("infoDiv")) {
                obj.data("infoDiv").remove();
            }
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
        _afterCreateSweetWidget : function() {
            var me = this;
            return;
        },

        /**
         * 组件渲染
         * @private
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.arrayIndicatorEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },

        /**
         * 设置组件值
         * @private
         * @param {object} 组件值
         */
        _setValue : function(data){
            var me = this,
                    valObj = [];
            if(!$.isArray(valObj)) {
                valObj.push(data);
            } else {
                valObj = data;
            }
            var imageClass = "";
            $.each(valObj, function(index, val) {
                if(!me.liObjMap[val.value]) {
                    return;
                }
                imageClass = me._getImageClass(val);
                var liEl = me.liObjMap[val.value].data("info", val.text)
                        .removeClass()
                        .addClass(imageClass);
                me.dataMap[val.value] = val;
                me.liObjMap[val.value] = liEl;
            });
        },

        /**
         * 获取组件值
         * @private
         * @return {function} me._getSelectedText()
         */
        _getValue : function() {
            var me = this;
            return;
        },

        /**
         * Input类组件布局刷新基本处理
         * @private
         */
        _doLayout: function () {
            var me = this,
                    options = me.options;
            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }
            
            var arrayIndicatorElWidth = me.arrayIndicatorEl.width() - $.getPaddingRight(me.arrayIndicatorEl) - 
                    $.getPaddingLeft(me.arrayIndicatorEl),
                labelWidth = me.labelWidth = me._doLabelLayout(arrayIndicatorElWidth);

            if(me.label) {
                me.label.width(labelWidth);
            }
            me.arrayIndicatorDiv.width(arrayIndicatorElWidth - labelWidth);
            if("auto" === options.height) {
                me.arrayIndicatorEl.height(me.arrayIndicatorDiv.height());
            } else {
                me.arrayIndicatorDiv.height(options.height);
            }
        },

        /**
         * @private
         * @description 计算label宽度
         * @param {Number} width 外层容器宽度
         */
        _doLabelLayout: function(width) {
            var me = this,
                    options = me.options,
                    labelWidth;
            if (me.label) {
                // 按百分比设定
                if (1 > options.labelWidth) {
                    labelWidth = Math.floor(width * options.labelWidth);
                } else {
                    labelWidth = options.labelWidth;
                }
            } else {
                labelWidth = 0;
            }

            return labelWidth;
        },
        
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.arrayIndicatorEl.externalWidth(width);
        },
        
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.arrayIndicatorEl.externalWidth();
        },
        
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.arrayIndicatorEl.externalHeight();
        },
        
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me._setWidth(width);
            me._setHeight(height);
        },

        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.arrayIndicatorEl.externalHeight(height);
        },

        /**
         * @private
         * @description 移除提示
         */
        _removeTips: function() {
            var me = this;
            // 取消提示
            if(!$.isNull(me.liObjMap)) {
                $.each(me.liObjMap, function(index, obj) {
                    obj.trigger("mouseout");
                });
            }
        },
        /**
         * 销毁组件
         * @private
         */
        _destroyWidget: function() {
            var me = this;
            me._removeTips();
            me.arrayIndicatorEl.remove();
            delete me.liObjMap;
            delete me.dataMap;
        }
    });

    /**
     * 阵列指示灯
     * @name Sweet.ArrayIndicator
     * @class 
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     */
    Sweet.ArrayIndicator = $.sweet.widgetArrayIndicator;
}(jQuery));

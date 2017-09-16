/**
 * @fileOverview  
 * <pre>
 * 面板上的日期组件
 * 2012/12/15
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    $.widget("sweet.cmpHoliday", $.sweet.widget, {
        version: "1.0",
        sweetWidgetName: "[cmp-holiday]",
        defaultElement: "<div>",
        type: "holiday",
        eventNames: {"click": "日期点击事件", change: "日期变化时触发"},
        options: {
            // 指定年
            year: 2012
        },
        /**
         * @description 返回widget对象
         */
        widget: function() {
            return this.holidayPanel;
        },
        /**
         * @description 设置组件值
         * @param {Object} obj 设置日期, 格式为{12: ["2012-12-1", "2012-12-2", ...], ...}
         */
        setValue: function(obj) {
            if ($.isNull(obj)) {
                $.error("setValue(): Input parameter must not be empty! ");
                return;
            }

            var me = this;
            // 循环设置值
            $.each(obj, function(index, val) {
                me.holidayItems[$.string.toNumber(index) - 1].setValue(val);
            });
        },
        /**
         * @description 获取组件值
         * @param {String} 组件值, 返回值格式{12: ["2012-12-1", "2012-12-2", ...], ...}
         */
        getValue: function() {
            var value = {};
            for (var i = 0; i < this.holidayItems.length; i++) {
                value[i + 1] = this.holidayItems[i].getValue();
            }

            return value;
        },
        /**
         * @private
         * @description 创建假日组件入口
         */
        _createSweetWidget: function() {
            this._createHolidayCmp();
        },
        /**
         * @private
         * @description 创建假日组件
         */
        _createHolidayCmp: function() {
            var holidayPanel,
                    holidayItems = this.holidayItems = [],
                    datePanel,
                    options = this.options;
            // 循环12个月
            for (var i = 0; i < 12; i++) {
                datePanel = new Sweet.panel.Date({
                    year: options.year,
                    month: i + 1,
                    height: 250
                });
                holidayItems[i] = datePanel;
            }

            holidayPanel = this.holidayPanel = new Sweet.panel.GridPanel({
                id: options.id,
                name: options.name,
                title: Sweet.cmp.i18n.holiday,
                width: "100%",
                height: "100%",
                widgetClass: "sweet-cmp-holiday",
                layoutOptions: {
                    rows: 3,
                    columns: 4
                },
                items: holidayItems
            });
            holidayPanel.render(options.renderTo);
        },
        /**
         * @private
         * @description 注册监听事件
         */
        _addListener: function() {
            var me = this;
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(handlerName, func) {
                $.each(me.holidayItems, function(index, obj) {
                    obj.addListener(handlerName, func);
                });
            });
        },
        /**
         * @private
         * @description 销毁假日组件
         */
        _destroyWidget: function() {
            if (this.holidayPanel) {
                this.holidayPanel.destroy();
            }
        },
        /**
         * @description 渲染组件
         * @param {String} id 组件ID
         */
        _render: function(id) {
            var me = this;
            if (!id || me.rendered) {
                return false;
            }
            me.holidayPanel.render(id);
            return true;
        }
    });

    /**
     * @description 节假日组件
     * @class
     * @extends jquery.ui.widget.js
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * jquery.sweet.widget.container.panel.js
     * jquery.sweet.widget.container.date.js
     * </pre>
     * @example
     * 创建节假日组件：
     */
    Sweet.cmp.Holiday = $.sweet.cmpHoliday;
}(jQuery));

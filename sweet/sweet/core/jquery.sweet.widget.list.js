/**
 * @fileOverview  
 * <pre>
 * 列表组件
 * 2012/12/6
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    // 保存组件对象
    var defalutWidgetClass = "sweet-list-list-con";

    $.widget("sweet.widgetList", $.sweet.widget, {
        version: "1.0",
        sweetWidgetName: "[widget-list]:",
        options: {
            // 组件数据格式[{"value":"1", "text":"ONE", "data":{}}...]
            data: [],
            /**
             * 组件的最大高度
             * @type {Number}
             * @default null
             */
            maxHeight: null,
            /**
             * 组件最小高度
             * @type {Number}
             * @default null
             */
            minHeight: null
        },
        /**
         * @private
         * @description 列表组件
         */
        _createSweetWidget: function() {
            var options = this.options,
                    listEl = this.listEl = $("<div>");
            listEl.addClass(options.widgetClass).width(options.width).attr("id", options.id);
            // height与maxHeight互斥
            if ($.isNotNull(options.maxHeight)) {
                listEl.css("max-height", options.maxHeight);
                if ($.isNotNull(options.minHeight)) {
                    listEl.css("min-height", options.minHeight);
                }
            } else {
                listEl.height(options.height);
            }
            this._createListWidget();
        },
        /**
         * @private
         * @description 创建列表组件, 子类可覆盖
         */
        _createListWidget: function() {
            var listDivStr = "",
                    tempText,
                    data = this.options.data;
            // 添加列表数据
            $.each(data, function(index, val) {
                tempText = $.htmlEscape(val.text) || "";
                listDivStr += "<div>" + tempText + "</div>";
            });
            this.listEl.html(listDivStr);
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String}
         *        id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.listEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            if (this.listEl) {
                this.listEl.remove();
            }
        }
    });

    /**
     * 列表组件
     * @name Sweet.list
     * @class 
     * @extends Sweet.widget
     * @requires  
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     * </pre>
     */
    Sweet.list = $.sweet.widgetList;

}(jQuery));

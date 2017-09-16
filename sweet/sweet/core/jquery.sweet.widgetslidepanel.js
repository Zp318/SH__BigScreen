/**
 * @fileOverview
 * <pre>
 * DashboardWidget组件-portal
 * 2013/2/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */


/**
 * 创建widgetpanel组件类
 * @name Sweet.widgetslipepanel
 * @class
 * @extends Sweet.widget
 * @requires 
 * <pre>
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.sweet.widget.js
 * </pre>
 */
(function($, undefined) {

    $.widget("sweet.widgetslidepanel", $.sweet.widget, /** @lends Sweet.WidgetslidePanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-slidepanel]",
        //panel 类输入组件公共配置参数
        options: /** @lends Sweet.WidgetslidePanel.prototype*/{
            /**
             * 每页多少列
             * @type number
             * @default 3
             */
            columnperpage: 3, //每页多少列
            /**
             * 每页宽度
             * @type number
             * @default 300
             */
            pagewidth: "300",
            /**
             * 每页高度
             * @type number
             * @default 100
             */
            pageheight: "100",
            /**
             * 当前的索引
             * @type number
             * @default 0
             */
            currentindex: 0
        },
        /**
         * @private
         * @description 生成Guid函数
         * @param 无
         */
        _newGuid: function() {
            var guid = "", n;
            for (var i = 1; i <= 32; i++) {
                n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((8 === i) || (12 === i) || (16 === i) || (20 === i)) {
                    guid += "-";
                }
            }
            return guid;
        },
        /**
         * @private
         * @description 创建widgetslidepanel模板
         * @param 无
         */
        _createSweetWidget: function() {
            var me = this;
            me.container = $("<div style='width: 100%;height: 100%;'>");
            me.sweetEl = {};
            me.sweetEl.id = me._newGuid();
            me.sweetEl.Dom = $("<div class='PageDom'>");
            me.sweetEl.Pages = $("<div class='Pages'>");
            me.container.attr("id", me.options.id).append(me.sweetEl.Dom);
            me.sweetEl.Dom.append(me.sweetEl.Pages);
        },
        /**
         *@private
         * @description  定义所有dom的css
         *
         */
        _widgetSlideCSS: function() {
            var me = this;
            me.sweetEl.Dom.css({position: "relative", overflow: "hidden",
                width: me.options.pagewidth, height: me.options.pageheight});
            me.sweetEl.page[0].css({width: me.options.pagewidth, height: me.options.pageheight});
            me.sweetEl.page[1].css({width: me.options.pagewidth, height: me.options.pageheight});
            me.sweetEl.page[2].css({width: me.options.pagewidth, height: me.options.pageheight});
        },
        /**
         * @public
         * @description 添加sweet控件，一般为图表展示控件
         * @param item  为sweet类对象数组
         */
        addItems: function(item) {
            var me = this;
            me.sweetEl.page = [];

            me.sweetEl.page[0] = $("<div class='Page'>").html("a1");
            me.sweetEl.page[1] = $("<div class='Page'>").html("a2");
            me.sweetEl.page[2] = $("<div class='Page'>").html("a3");

            me.sweetEl.Pages
                    .append(me.sweetEl.page[0])
                    .append(me.sweetEl.page[1])
                    .append(me.sweetEl.page[2]);
        },
        /**
         * @private
         * @description 注册控件内部事件，外部调用该函数注册
         * @param 无
         */
        _addEvent: function() {
            var me = this;
            me.sweetEl.Dom.mousedown(function(event) {
                var orix = event.clientX;
                var tarx = event.clientX;

                var oril = me.options.currentindex * me.sweetEl.Dom.innerWidth();

            });



        },
        _destroyWidget: function() {
            var me = this;
            me.container.remove();
        },
        /**
         * @public
         * @description 修改widgetslidepanel长宽
         * @param 长宽对象,{"width":"100","height":"50"}
         */

        reSize: function(data) {
            var me = this;
            var pWidth = data.width,
                    pHeight = data.height;

            me.renderEl.width(data.width);
            me.renderEl.height(data.height);
        },
        _doLayout: function() {
            var me = this;
            if (!me.rendered) {
                return;
            }
            var curW = me.container.width();
            var curH = me.container.height();

            me.sweetEl.Dom.externalWidth(curW);
            me.sweetEl.Dom.externalHeight(curH);



        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            return this.container.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            return this.container.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            if ($.type(width) === "string") {
                this.container.onResize(function() {
                    me.doLayout();
                });
            }
            me.container.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            if ($.type(height) === "string") {
                this.container.onResize(function() {
                    me.doLayout();
                });
            }
            me.container.externalHeight(height);
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
         * @parivate
         * @description 渲染饼图到相应的到div
         * @param {String} id 目标元素ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.renderEl.append(me.container);

            var WH = $.isNull(me.options.width) || (me.options.width === "100%") ? "100%" : me.options.width + "px";
            var HT = $.isNull(me.options.height) || (me.options.width === "100%") ? "100%" : me.options.height + "px";

            me.renderEl.width(WH);
            me.renderEl.height(HT);

            // 记录当前渲染时容器的宽度和高度
            me.preWH = {
                width: me.renderEl.width(),
                height: me.renderEl.height()
            };
            me.sweetEl.Dom.externalWidth(me.preWH.width);
            me.sweetEl.Dom.externalHeight(me.preWH.height);

            me._widgetSlideCSS();
            
            me.rendered = true;
            return true;
        }
    });
    Sweet.WidgetslidePanel = $.sweet.widgetslidepanel;
})(jQuery);



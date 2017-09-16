/**
 * @fileOverview
 * <pre>
 * 容器组件-手风琴布局容器
 * 2013/2/25
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    'use strict';

    var defaultContentClass = "sweet-panel-content";
    var defaultPanelClass = "sweet-panel-accordionpanel";
    var activeClass = "accordion-active";
    var expandedClass = "accordion-expanded";

    $.widget("sweet.widgetContainerAccordionpanel", $.sweet.widgetContainerPanel,
    /** @lends Sweet.panel.AccordionPanel.prototype*/
    {
        version: "1.0",
        sweetWidgetName: "[widget-container-accordionpanel]:",
        type: "accordionPanel",
        options: /** @lends Sweet.panel.AccordionPanel.prototype*/
        {},
        panelContentEl: null, // 布局容器
        maxAreaHeight: 0, // 内容区最大允许高度
        /**
         * 获取活动可用的最大高度
         * @private
         */
        _getAreaHeight: function () {
            var me = this;
            var headersHeight = 0;
            var maxAreaHeight = 0;

            // 计算所有标题栏高度和
            $.each(me.panelContentEl.children("h3"), function (index, obj) {
                headersHeight += $(obj).externalHeight();
            });

            // 区域可用最大高度
            maxAreaHeight = me.panelContentEl.height() - headersHeight;
            if (maxAreaHeight < 0) {
                maxAreaHeight = 0;
            }

            return maxAreaHeight;
        },
        /**
         * @private
         * @descripition 重新计算布局
         */
        _doLayout: function () {
            var me = this;
            var items = me.options.items;
            var maxHeight = 0;
            var maxWidth = 0;
            var i = 0;

            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }

            // 调用父类的_doLayout，调整panelContentEl的大小
            this._super();

            // 内容区域最大可用高度
            maxHeight = me._getAreaHeight();
            maxWidth = me.panelContentEl.width();

            // 布局
            for (i = 0; i < items.length; i++) {
                var id = me.options.id + "-content-" + i;
                var area = $("#" + id);

                // 先调整容器宽度
                area.externalWidth(maxWidth);
                area.css("overflow-x", "auto");

                // 再调整容器高度
                area.externalHeight(maxHeight);
                area.css("overflow-y", "auto");

                // 调用子组件的doLayout
                try {
                    items[i].doLayout();
                }
                catch (e) {}
            }
        },
        /**
         * 渲染一个内部组件
         * @param {Number} index 子组件索引
         */
        __renderItem: function (index) {
            if (index < 0 || index >= this.options.items.length) {
                return;
            }
            
            var id = this._contentIdPrefix + index;
            var item = this.options.items[index];

            // item is removed
            if (item === null) {
                return;
            }
            // item is html
            else if ($.isPlainObject(item) && !$.isNull(item.html)) {
                $("#" + id).html(item.html);
            }
            // item is sweet object
            else {
                item.render(id);
            }
        },
        /**
         * 创建一个子组件的容器
         * @param {Number} index 子组件索引
         */
        __createItemArea: function (index) {
            if (index < 0 || index >= this.options.items.length) {
                return;
            }

            var me = this;
            var options = me.options;
            var panel = me.panelContentEl;
            var items = options.items;
            var headerEl = null;
            var contentEl = null;
            var title = "";
            var item = items[index];
            
            // 取标题
            if (item === null) {
                return;
            }
            else if ($.isPlainObject(item)) {
                title = item.title;
            }
            else {
                title = item.options.title;
            }

            // 创建标题
            headerEl = $("<h3>").text(title);
            headerEl.attr("id", this._headerIdPrefix + index).prepend("<i>").appendTo(panel);

            // 创建内容容器
            contentEl = $("<div>");
            contentEl.attr("id", this._contentIdPrefix + index);
            contentEl.appendTo(panel);

            // 设置第一个内容为活动状态
            if (index === 0) {
                headerEl.addClass(activeClass);
                contentEl.addClass(expandedClass);
            }
            else {
                contentEl.hide();
            }

            // 设置展开、折叠功能
            headerEl.click(me._headerClicked);
        },
        /**
         * 
         */
        __removeItem: function (index) {
            if (index < 0 || index >= this.options.items.length) {
                return;
            }

            var me = this;
            var options = me.options;
            var item = options.items[index];
            var id = "";
            
            // 防止重复删除
            if (item === null) {
                return;
            }

            // 销毁子组件
            try {
                item.destroy();
            }
            catch (e) {}
            finally {
                options.items[index] = null;
            }
            
            // 删除标题
            id = "#" + this._headerIdPrefix + index;
            $(id).unbind().remove();
            
            // 删除内容容器
            id = "#" + this._contentIdPrefix + index;
            $(id).remove();
        },
        /**
         * 添加项目
         * @param {Object} item 子组件
         */
        __addItem: function (item) {
            if (item === null) {
                return;
            }

            var index = this.options.items.length;
            this.options.items.push(item);

            // 创建容器
            this.__createItemArea(index);

            // 渲染
            this.__renderItem(index);

            // layout
            this._doLayout();
        },
        /**
         * @private
         * @description 渲染布局和内部对象
         */
        _widgetRender: function () {
            var me = this;
            if (me.containerEl) {
                this._super();
                var items = me.options.items;

                // 将组件附着到容器内
                $.each(items, function (index) {
                    me.__renderItem(index);
                });
            }
        },
        /**
         * @private
         * @description 点击标题栏时，展开/折叠区域
         * @param {Event} event jQuery点击事件对象
         */
        _headerClicked: function (event) {
            var active = null;
            var headerKey = "header";
            var contentKey = "content";

            // 当前标题
            var target = event.currentTarget;

            // 点击了展开的标题
            if (target.className.indexOf(activeClass) >= 0) {
                $("#" + target.id.replace(headerKey, contentKey)).slideUp(200);
                $(target).removeClass(activeClass);
            }
            // 点击了折叠的标题
            else {
                // 折叠已经打开的区域
                active = $(target).parent().children("." + activeClass);
                if (active.length > 0) {
                    active = active[0];
                    $("#" + active.id.replace(headerKey, contentKey)).slideUp(200);
                    $(active).removeClass(activeClass);
                }

                // 展开当前区域
                $("#" + target.id.replace(headerKey, contentKey)).slideDown(200);
                $(target).addClass(activeClass);
            }
        },
        /**
         * @private
         * @description 创建布局
         */
        _createPanelContent: function () {
            var me = this;
            var options = me.options;
            var panel = me.panelContentEl = $("<div>");
            var items = options.items;
            var i = 0;

            // header/content的id前缀
            this._headerIdPrefix = options.id + "-header-";
            this._contentIdPrefix = options.id + "-content-";

            // 创建所有内容
            for (i = 0; i < items.length; i++) {
                me.__createItemArea(i);
            }

            // 设置panel样式名
            panel.addClass(defaultContentClass).addClass(defaultPanelClass);
        },
        /**
         * @description 动态添加组件
         * @param {Object/Array} items 组件对象或组件对象数组
         */
        _addItems: function(items) {
            var me = this;
            var i;

            if ($.isNull(items)) {
                return;
            }

            // 循环添加
            for (i = 0; i < items.length; i++) {
                me.__addItem(items[i]);
            }
        },
        /**
         * 删除项目
         * @param {Array} items 可见的子组件的索引
         */
        _removeItems: function (items) {
            var me = this;
            var i = 0;
            var j = 0;
            var id;
            var count;

            // 如果输入参数为空，删除所有
            if ($.isNull(items)) {
                // 删除所有
                for (i = me.options.items.length - 1; i >= 0; i--) {
                    me.__removeItem(i);
                }
                return;
            }

            // 删除指定索引的Tab
            items.sort();
            for (i = items.length - 1; i >= 0; i--) {
                id = items[i];
                if (id >= me.options.items.length) {
                    return;
                }

                // 查找对应的实际索引
                count = -1;
                for (j = 0; j < me.options.items.length; j++) {
                    // 已删除子组件不计算索引
                    if (me.options.items[j] === null) {
                        continue;
                    }

                    count += 1;
                    if (count === id) {
                        break;
                    }
                }
                this.__removeItem(j);
            }
        },

        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            this._removeItems();
            this._super();
        }
    });

    /**
     * @description Accordion布局容器
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.container.Panel
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * jquery.sweet.widget.container.panel.js
     * </pre>
     * @example
     * 创建Accordion布局容器：
     * var sweetAccordionPanel = Sweet.panel.AccordionPanel();
     */
    Sweet.panel.AccordionPanel = $.sweet.widgetContainerAccordionpanel;
}(jQuery));

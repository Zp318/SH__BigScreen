/**
 * @fileOverview  
 * <pre>
 * 容器组件-垂直布局容器
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($) {
    'use strict';

    var defaultPanelContentClass = "sweet-panel-content";
    var defaultItemPanelClass = "sweet-v-panel-item-panel";
    var uuid = 1000;
    var idPrefix = "sweet-v-panel-item-";

    $.widget("sweet.widgetContainerVpanel", $.sweet.widgetContainerPanel, /** @lends Sweet.panel.VPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-Vpanel]:",
        type: "VPanel",
        options: /** @lends Sweet.panel.VPanel.prototype*/{
            /**
             * 组件间垂直间距
             * @type {Number} 组件间垂直间距
             * @default 默认5px
             */
            padding: 5
        },
        /**
         * @description 将指定id(此id是组件的配置项中的id属性值)的item移动到VPanel的顶端
         * @param {String} id 需要移动的item的id
         * @public
         */
        moveItemByIdToHeader : function(id){
            var me = this,
                   opt = me.options,
                   items = opt.items;
            if($.isNull(items) || items.length <= 0 || $.isNull(id)){
                return;
            }

            var itemPanels = me.gridPanelEl.children("div");
            if($.isNull(itemPanels) || itemPanels.length <= 1){
                return;
            }
            var headerItemDom = itemPanels.get(0);
            $.each(itemPanels, function(index, obj){
                var cur = $(itemPanels[index]);
                var it = cur.children("div");
                if(it.length > 0 && $(it[0]).attr("id") === id){
                    cur.insertBefore(headerItemDom);
                    //同时要调整options.items中的顺序
                    var curItem = null;
                    for(var i = 0; i < items.length; i++){
                        if(id == items[i].options.id){
                            curItem = items[i];
                            items.splice(i, 1);
                            break;
                        }
                    }
                    if($.isNotNull(curItem)){
                        items.unshift(curItem);
                        me._doLayout();
                    }
                    
                    return true;
                }
            });
        },
        _getCanvasObject : function(){
            var me = this,
                    result = null,
                    opt = me.options,
                    len = opt.items ? opt.items.length : 0;
            if(len === 1){
                result = opt.items[0].getCanvasObject();
            } else if(len > 1){
                //因为会出横向滚动条，所以要拿table的宽度
                var vdEl = me.renderEl.find("." + defaultPanelContentClass),
                        containerEl = vdEl.children(),
                        h = containerEl.height(),
                        w = containerEl.width();
                result = $("<canvas>").attr({
                    width : w,
                    height : h
                });
                result = result[0];
                //将容器中的组件按flowpanel来进行布局并整合到result这个canvas上
                var padding = opt.padding,
                        x = 0, y = 0,
                        resultc = result.getContext("2d");
                for(var i = 0; i < len; i++){
                    var item = opt.items[i],
                            itw = item.getWidth(),
                            ith = item.getHeight(),
                            itemCanvs;
                    itemCanvs = item.getCanvasObject();
                    if($.isNotNull(itemCanvs) && $.isFunction(itemCanvs.getContext)){
                        var imgc = itemCanvs.getContext("2d"),
                                imgd = imgc.getImageData(0, 0, itw, ith);
                        //将每一个canvs放在result上，这里要计算坐标位置
                        resultc.putImageData(imgd, x, y);
                        y += ith + (i === len -1 ? 0: padding);
                    }
                }
            }
            return result;
        },
        /**
         * @private
         * @descripition 重新计算绘制垂直布局
         */
        _doLayout: function() {
            var me = this;
            var options = me.options;
            var panelWidth;
            var panelHeight;
            var obj;
            var area;
            var width;
            var height;

            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }

            // 调用父类的_doLayout，调整panelContentEl的大小
            me._super();

            // 如果折叠或隐藏，不需要处理子组件
            if (me.panelContentEl.is(":hidden")) {
                return;
            }
            
            me.gridPanelEl.width("100%").height("auto");
            panelWidth = me.gridPanelEl.width();
            panelHeight = me.panelContentEl.height();

            // 修正容器大小
            var itemPanels = me.gridPanelEl.children("div");
            var maxHeight = 0;
            var maxWidth = 0;

            $.each(itemPanels, function (index, item) {
                obj = options.items[index];
                if(obj){
                    area = $(item);

                    // 添加间距
                    if (index > 0 && me.options.padding) {
                        area.css("padding-top", me.options.padding);
                    }
                    else {
                        area.css("padding-top", "0px");
                    }

                    // 宽度固定
                    area.externalWidth(panelWidth);

                    // 高度设定，为百分比特殊处理
                    height = obj._initConfig.height;
                    if ($.type(height) === "string" && /\d+%/.test(height)) {
                        height = parseInt(height, 10);
                        height = Math.floor(panelHeight * height / 100);

                        obj.setHeight(height);
                        area.height(height);
                    }

                    // 子组件刷新，子组件的高度需要自行设置
                    if ($.isFunction(obj.doLayout)) {
                        obj.doLayout();
                    }

                    // 记录高度
                    maxHeight += area.externalHeight();
                    width = area.externalWidth();
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                }
                
            });

            // 修正容器尺寸
            panelHeight = me.panelContentEl.height();
            if (me.options.height === "auto") {
                me._setHeight(me.getHeight() + maxHeight - panelHeight);
                me.panelContentEl.externalHeight(maxHeight);
            }
            else {
                // 如果子组件超过容器范围，出现滚动条
                panelWidth = me.panelContentEl.width();
                panelHeight = me.panelContentEl.height();
                if (maxHeight > panelHeight) {
                    if (me.panelContentEl.css("overflow-y") !== "auto") {
                        me.panelContentEl.css("overflow-y", "auto");
                        me._doLayout();
                    }
                }
                else {
                    me.panelContentEl.css("overflow-y", "hidden");
                }

                if (maxWidth > panelWidth) {
                    if (me.panelContentEl.css("overflow-x") !== "auto") {
                        me.panelContentEl.css("overflow-x", "auto");
                        me._doLayout();
                    }
                }
                else {
                    me.panelContentEl.css("overflow-x", "hidden");
                }

                // 自定义滚动条
            }
        },
        /**
         * @private
         * @description 面板渲染
         */
        _widgetRender: function() {
            var me = this;
            if (me.containerEl) {
                this._super();
                var options = me.options,
                    items = options.items;

                // 将组件附着到容器内
                var itemPanels = me.gridPanelEl.children("div");
                $.each(itemPanels, function(index, obj) {
                    me._renderItem(items[index], obj.id);
                });
            }
        },
        /**
         * @private
         * @description 创建垂直布局
         */
        _createPanelContent: function() {
            var me = this;
            var options = me.options;
            var rows = options.items.length;
            me.panelContentEl = $("<div>").addClass(defaultPanelContentClass);
            me.gridPanelEl = $("<div>").appendTo(me.panelContentEl);

            // 循环生成垂直布局
            for (var i = 0; i < rows; i++) {
                me._addItemPanel();
            }
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            // 删除所有子组件
            this._removeItems();

            this._super();
        },
        /**
         * @description 创建一个子组件的容器
         * @returns {string} 创建的容器的id
         * @private
         */
        _addItemPanel: function () {
            var me = this;

            var rowId = idPrefix + me.options.id + "-" + (++uuid);
            var itemPanelEl = $("<div>").attr("id", rowId).addClass(defaultItemPanelClass);
            itemPanelEl.appendTo(me.gridPanelEl);

            return rowId;
        },
        /**
         * @description 把items渲染到指定id的容器内
         * @param {Object} item 子组件
         * @param {String} id 容器的id
         * @private
         */
        _renderItem: function (item, id) {
            var panel = $("#" + id);
            if (panel.length === 0) {
                return;
            }

            if ($.isPlainObject(item)) {
                item.options = $.objCopy(item);
                item._initConfig = $.objCopy(item);

                if (typeof item.html === "string") {
                    panel.html(item.html);
                }
            }
            else {
                try {
                    item.render(id);
                }
                catch (e) {}
            }
        },
        /**
         * @description 向布局动态添加子组件
         * @param {Object/Array} items 待添加的子组件
         * @private
         */
        _addItems: function (items) {
            if ($.isNull(items)) {
                return;
            }

            var me = this;
            var options = me.options;
            var id;

            // 保存到列表
            options.items = options.items.concat(items);

            // 添加到布局中
            for (var i = 0; i < items.length; i++) {
                id = me._addItemPanel();
                me._renderItem(items[i], id);
            }
        },
        /**
         * @description 从布局动态删除子组件
         * @param {Object/Array} items 待删除的子组件索引
         * @private
         */
        _removeItems: function (items) {
            var me = this;
            var allAreas = me.gridPanelEl.children("div");
            var item;
            var area;
            var id;

            // 如果输入参数为空，删除所有内容
            if ($.isNull(items)) {
                $.each(me.options.items, function (index, item) {
                    if ($.isFunction(item.destroy)) {
                        item.destroy();
                    }
                });
                me.options.items = [];
                me.gridPanelEl.empty();

                return;
            }

            // 按指定索引删除
            items.sort();
            for (var i = items.length - 1; i >= 0; i--) {
                id = items[i];
                if (id >= me.options.items.length) {
                    continue;
                }

                area = allAreas.eq(id);
                item = me.options.items[id];

                // 销毁
                if ($.isFunction(item.destroy)) {
                    item.destroy();
                }

                me.options.items.splice(id, 1);
                area.remove();
            }
        }
    });

    /**
     * @description 垂直布局容器
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
     * 创建表格布局容器：
     * var sweetHPanel = Sweet.panel.VPanel({
     * });
     */
    Sweet.panel.VPanel = $.sweet.widgetContainerVpanel;
}(jQuery));

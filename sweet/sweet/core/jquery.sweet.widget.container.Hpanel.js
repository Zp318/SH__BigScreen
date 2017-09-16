/**
 * @fileOverview
 * <pre>
 * 容器组件-水平布局容器
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {

    var defaultPanelContentClass = "sweet-panel-content",
        defaultGridPanelClass = "sweet-h-panel",
        defaultGridTableClass = "sweet-h-panel-table",
        uuid = 1000;
    var gridIdPrefix = "sweet-h-panel-";

    $.widget("sweet.widgetContainerHpanel", $.sweet.widgetContainerPanel, /** @lends Sweet.panel.HPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-Hpanel]:",
        type: "HPanel",
        options: /** @lends Sweet.panel.HPanel.prototype*/{
            /**
             * 子组件间距
             * @type Number
             * @default 5(px)
             */
            padding: 5,
            /**
             * 扩展子组件，按个数均分布局的宽度，扩展适应布局的高度
             * @type Boolean
             * @default true
             */
            itemExtend: true,
            /**
             * 水平对齐方式
             * @type String
             * @default "left"
             */
            align: Sweet.constants.align.LEFT,
            /**
             * 垂直对齐方式
             * @type String
             * @default "top"
             */
            verticalAlign: Sweet.constants.align.TOP,
            /**
             * 超出范围后的处理方式, hidden/auto
             * @type String
             * @default "hidden"
             */
            overflow: Sweet.constants.overflow.HIDDEN
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
                var tableEl = me.renderEl.find("." + defaultGridTableClass),
                        h = tableEl.height(),
                        w = tableEl.width();
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
                        x += itw + (i === len -1 ? 0: padding);
                    }
                }
            }
            return result;
        },
        /**
         * @private
         * @descripition 重新计算绘制水平布局
         */
        _doLayout: function () {
            var me = this;
            var options = me.options;
            var columns = options.items.length;

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

            // 修正内层容器大小
            var panelWidth = me.panelContentEl.width();
            var panelHeight = me.panelContentEl.height();

            me.gridPanel.externalWidth(panelWidth).externalHeight(panelHeight);
            var gridWidth = me.gridPanel.width();
            var gridHeight = me.gridPanel.height();
            var paddingWidth = (columns - 1) * options.padding;

            // 重新设置子组件大小
            var width = Math.floor((gridWidth - paddingWidth) / columns);
            var height = gridHeight;
            var w;
            var h;

            $.each(options.items, function (index, obj) {
                // 均分子组件，直接设置组件大小
                if (options.itemExtend) {
                    obj.setWH(width, height);
                    return;
                }

                // 如果组件大小为百分比，需要特殊处理
                w = obj._initConfig.width;
                if ($.type(w) === "string" && /\d+%/.test(w)) {
                    w = parseInt(w, 10);
                    w = Math.floor((gridWidth - paddingWidth) * w / 100);
                }

                h = obj._initConfig.height;
                if ($.type(h) === "string" && /\d+%/.test(h)) {
                    h = parseInt(h, 10);
                    h = Math.floor(gridHeight * h / 100);
                }
                obj.setWH(w, h);
            });

            // 子容器间隔
            me.itemsParentEl.children().each(function (index, td) {
                if (index === 0) {
                    $(td).css("padding-left", 0);
                }
                else {
                    $(td).css("padding-left", me.options.padding);
                }
            });

            // 对齐的处理
            var tableEl = me.gridPanel.children().first();
            if (options.itemExtend === false) {
                // 水平对齐，通过调整Table的位置来实现
                tableEl.width("auto");
                w = tableEl.externalWidth();

                if (options.overflow !== Sweet.constants.overflow.HIDDEN && w > gridWidth) {
                    tableEl.css("margin-left", 0);
                }
                else if (options.align === Sweet.constants.align.LEFT) {
                    tableEl.css("margin-left", 0);
                }
                else if (options.align === Sweet.constants.align.RIGHT) {
                    tableEl.css({"position": "absolute", "right": "0"});
                    me.containerEl.css("float", "right");  // 避免BorderPanel中无法居右
                }
                else if (options.align === Sweet.constants.align.CENTER) {
                    tableEl.css("margin-left", Math.floor((gridWidth - w) / 2));
                    me.containerEl.css("margin", "0 auto");  // 避免BorderPanel中无法居中
                }

                // 垂直对齐，通过设置td的垂直对齐实现
                if (options.verticalAlign === Sweet.constants.align.TOP ||
                    options.verticalAlign === Sweet.constants.align.BOTTOM ||
                    options.verticalAlign === Sweet.constants.align.MIDDLE) {
                    me.itemsParentEl.children().css("vertical-align", options.verticalAlign);
                }
            }
        },
        /**
         * @private
         * @description 面板渲染
         */
        _widgetRender: function () {
            var me = this;

            if (me.containerEl) {
                this._super();

                var options = me.options,
                    item,
                    items = options.items;

                // 将组件附着到容器内
                me.itemsParentEl.children().each(function (index, obj) {
                    if (index < items.length) {
                        item = items[index];
                        me._renderItem(item, obj.id);
                    }
                });
            }
        },
        /**
         * @private
         * @description 创建水平布局
         */
        _createPanelContent: function () {
            var me = this;
            var options = me.options;
            var columns = options.items.length;
            var gridPanel;
            var tableEl = $("<table>");
            var trEl;
            var tdId;
            me.itemsParentEl = $();

            // 主容器
            me.panelContentEl = $("<div>").addClass(defaultPanelContentClass);

            // 二层容器（内部放一个Table）
            gridPanel = me.gridPanel = $("<div>");
            if(options.overflow !== Sweet.constants.overflow.HIDDEN){
                gridPanel.css("overflow-x", options.overflow);
            }

            // 循环生成表格布局
            me.itemsParentEl = trEl = $("<tr>");
            for (var j = 0; j < columns; j++) {
                tdId = me._addArea();
            }
            trEl.appendTo(tableEl);

            // 组装起来
            tableEl.addClass(defaultGridTableClass).appendTo(gridPanel);
            gridPanel.addClass(defaultGridPanelClass).appendTo(me.panelContentEl);
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            this._removeItems();
            this._super();
        },
        /**
         * @description 创建TD元素，附加到TR中，做为子组件的容器
         * @returns {string} TD元素的ID
         * @private
         */
        _addArea: function () {
            var me = this;
            var tdEl;
            var tdId;

            tdId = gridIdPrefix + me.options.id + "-" + (++uuid);
            tdEl = $("<td>").attr("id", tdId).appendTo(me.itemsParentEl);

            return tdId;
        },
        /**
         * @description 渲染item到指定id的容器中
         * @param {Object} item 子组件对象
         * @param {String} id 子组件容器id
         * @private
         */
        _renderItem: function (item, id) {
            if ($.isFunction(item.render)) {
                item.render(id);
            }
            else if (!$.isNull(item.html)) {
                $("#" + id).html(item.html);

                // 构造虚拟接口，后续和真实组件对象统一操作
                item.setWH = $.noop;
                item._initConfig = $.objCopy(item);
            }
            else {
                this._error("item is invalid:" + item);
            }
        },
        /**
         * @description 删除指定索引的item
         * @param {Number} index 索引
         * @private
         */
        _removeItem: function (index) {
            var me = this;
            var item;
            var area;

            if (index < 0 || index >= me.options.items.length) {
                return;
            }

            area = me.itemsParentEl.children().eq(index);
            item = me.options.items[index];

            // 从items列表中删除
            if ($.isFunction(item.destroy)) {
                item.destroy();
            }
            me.options.items.splice(index, 1);

            // 删除子容器
            area.remove();
        },
        /**
         * @description 向布局动态添加子组件
         * @param {Object/Array} items 待添加的子组件
         * @private
         */
        _addItems: function (items) {
            if (!$.isArray(items)) {
                return 0;
            }

            var me = this;
            var item;
            var tdId;
            var i;

            // 渲染所有内容
            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (!$.isNull(item)) {
                    tdId = me._addArea();
                    me._renderItem(item, tdId);

                    // 保存到items中
                    me.options.items.push(item);
                }
            }
        },
        /**
         * @description 从布局动态删除子组件
         * @param {Object/Array} items 待删除的子组件索引
         * @private
         */
        _removeItems: function (items) {
            var me = this;
            var i;
            var index;

            // 如果没有输入参数，删除所有内容
            if (typeof items === 'undefined') {
                items = [];
                for (i = 0; i < me.options.items.length; i++) {
                    items.push(i);
                }
            }

            // 按指定索引删除
            items.sort();
            for (i = items.length - 1; i >= 0; i--) {
                index = items[i];
                me._removeItem(index);
            }
        }
    });

    /**
     * @description 水平布局容器
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
     * 创建水平布局容器：
     * var sweetHPanel = Sweet.panel.HPanel();
     */
    Sweet.panel.HPanel = $.sweet.widgetContainerHpanel;
}(jQuery));

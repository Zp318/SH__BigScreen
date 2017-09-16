/**
 * @fileOverview
 * <pre>
 * 容器组件-流式布局容器
 * 2013/2/27
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {

    var defaultPanelContentClass = "sweet-panel-flow",
        defaultPanelContentLiClass = "sweet-panel-flow-li",
        defaultPanelContentLeftClass = "sweet-panel-flow-left",
        defaultPanelContentRightClass = "sweet-panel-flow-right",
        uuid = 1000;
    var FlowIdPrefix = "sweet-panel-flow-";

    $.widget("sweet.widgetContainerFlowpanel", $.sweet.widgetContainerPanel,
        /** @lends Sweet.panel.FlowPanel.prototype*/{
            version: "1.0",
            sweetWidgetName: "[widget-container-flowpanel]:",
            type: "FlowPanel",
            options: /** @lends Sweet.panel.FlowPanel.prototype*/{
                /**
                 * 组件对齐方式。[left/right]
                 * @param {String}
                 * @default left
                 */
                align: Sweet.constants.align.LEFT,
                /**
                 * 组件垂直对齐方式 [top/middle/bottom]
                 * @type String
                 * @default "middle"
                 */
                verticalAlign: Sweet.constants.align.TOP,
                /**
                 * 子组件间距
                 * @type Number
                 * @default 5(px)
                 */
                padding: 5,
                /**
                 * 组件高度。为"auto"时，高度适应子组件高度
                 * @type Number/String
                 * @default "auto"
                 */
                height: "auto"
            },
            _getCanvasObject : function(){
                var me = this,
                        result = null,
                        opt = me.options,
                        len = opt.items ? opt.items.length : 0;
                if(len === 1){
                    result = opt.items[0].getCanvasObject();
                } else if(len > 1){
                    var h = me.renderEl.height(),
                            w = me.renderEl.width();
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
                            //flowpanel中，大于容器宽度后，另起一行
                            if(x > w){
                                x = 0;
                                y = padding + ith;
                            }
                            //将每一个canvs放在result上，这里要计算坐标位置
                            resultc.putImageData(imgd, x, y, itw, ith);
                            x += itw;
                        }
                    }
                }
                return result;
            },
            /**
             * @private
             * @descripition 重新计算流式布局
             */
            _doLayout: function () {
                var me = this,
                    childElHeight = 0,
                    paddingTop,
                    allLiEl;
                var width;
                var height;
                var liEl;
                var panelWidth;
                var panelHeight;
                var ulEl;

                // 渲染前禁止进入
                if (!me.rendered) {
                    return;
                }

                // 调用父类的_doLayout，调整panelContentEl的大小
                this._super();

                // 如果折叠或隐藏，不需要处理子组件
                if (me.panelContentEl.is(":hidden")) {
                    return;
                }

                // 如果没有子组件，不再处理
                if (!me.itemsParentEl || me.options.items.length === 0) {
                    return;
                }
                allLiEl = me.panelContentEl.find(">ul>li");
                if (allLiEl.length === 0) {
                    return;
                }

                // 如果容器宽度为0,当前不显示，不需要处理
                if (me.panelContentEl.width() === 0) {
                    return;
                }

                // 当前Panel大小
                panelWidth = me.panelContentEl.width();
                panelHeight = me.panelContentEl.height();

                // 初始化子组件的上Padding
                allLiEl.each(function (index, item) {
                    liEl = $(item);
                    liEl.css("padding", 0);

                    // 如果子组件的大小设置为百分比，要应用到Li节点上
                    width = me.options.items[index]._initConfig.width;
                    height = me.options.items[index]._initConfig.height;
                    if ($.type(width) === "string" && /\d+%/.test(width)) {
                        width = parseInt(width, 10);
                        width = Math.floor(width * panelWidth / 100);
                    }

                    if ($.type(height) === "string" && /\d+%/.test(height)) {
                        height = parseInt(height, 10);
                        height = Math.floor(height * panelHeight / 100);
                    }
                    me.options.items[index].setWH(width, height);

                    // 添加间距
                    if (width !== panelWidth && index !== allLiEl.length - 1) {
                        liEl.css("padding-right", me.options.padding);
                    }
                });

                // 开始处理可见的子组件
                allLiEl = me.panelContentEl.find(">ul>li:visible");
                if (allLiEl.length === 0) {
                    return;
                }
                var top = allLiEl.first().position().top;

                // 折行的子组件设置padding-top
                allLiEl.each(function (index, item) {
                    if ($(item).position().top !== top) {
                        // 换行后，设置配置的Padding
                        $(item).css("padding-top", me.options.padding);
                    }
                });

                // 设置Padding后，重新计算子组件高度
                ulEl = me.panelContentEl.find(">ul");
                childElHeight = ulEl.height();

                // 子组件高度已经超过FlowPanel的可用区域，调整容器高度为实际高度
                var containerHeight = me.panelContentEl.height();
                if (childElHeight !== containerHeight && me.options.height === "auto") {
                    me._setHeight(me.getHeight() + childElHeight - containerHeight);
                    me._super();
                }
                else if (childElHeight < containerHeight && me.options.height !== "auto") {
                    // 容器高度足够，子组件对齐
                    if (me.options.verticalAlign === Sweet.constants.align.MIDDLE) {
                        paddingTop = Math.floor((containerHeight - childElHeight) / 2);
                    }
                    else if (me.options.verticalAlign === Sweet.constants.align.BOTTOM) {
                        paddingTop = containerHeight - childElHeight;
                    }
                    else {
                        paddingTop = 0;
                    }
                    ulEl.css("padding-top", paddingTop);
                }
            },
            /**
             * 动态添加项目
             * @param items
             * @private
             */
            _addItems: function (items) {
                var me = this;
                var options = me.options;
                var itemsParentEl = me.itemsParentEl;
                var tempId = "";
                var liEl = null;
                var ulEl = me.panelContentEl.children("ul");
                var item;

                // 记录到列表中
                me.options.items = me.options.items.concat(items);

                // 创建容器并插入流式布局
                for (var i = 0; i < items.length; i++) {
                    item = items[i];

                    // 如果是PlainObject，转一下结构，便于后续统一处理
                    if ($.isPlainObject(item) && $.isNull(item.options)) {
                        item.options = $.objClone(item);
                    }

                    tempId = FlowIdPrefix + options.id + "-" + (++uuid);
                    liEl = $("<li>").attr("id", tempId)
                        .addClass(defaultPanelContentLiClass)
                        .appendTo(ulEl);
                    itemsParentEl.push({"id": tempId, "parentEl": liEl});

                    // 渲染
                    item.render(tempId);
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
                var item;
                var liEl;
                var ulEl;
                var index;

                ulEl = me.panelContentEl.children("ul");

                // 如果输入为空，表示删除所有组件。构建一个全索引
                if ($.type(items) === 'undefined') {
                    items = [];
                    for (i = 0; i < me.options.items.length; i++) {
                        items.push(i);
                    }
                }

                // 删除内容
                items.sort();
                for (i = items.length - 1; i >= 0; i--) {
                    index = items[i];

                    item = me.options.items[index];
                    liEl = ulEl.children().eq(index);

                    // 销毁子组件
                    if (item && $.isFunction(item.destroy)) {
                        item.destroy();
                    }
                    me.options.items.splice(index, 1);

                    // 删除子容器
                    liEl.remove();
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
                    $.each(me.itemsParentEl, function (index, obj) {
                        item = items[index];

                        // 如果是PlainObject，转一下结构，便于后续统一处理
                        if ($.isPlainObject(item) && $.isNull(item.options)) {
                            item.options = $.objClone(item);
                        }

                        item.render(obj.id);
                    });
                }
            },
            /**
             * @private
             * @description 创建流式布局
             */
            _createPanelContent: function () {
                var me = this,
                    options = me.options,
                    length = options.items.length,
                    panelContentEl = me.panelContentEl = $("<div>").addClass(defaultPanelContentClass),
                    ulEl = $("<ul>"),
                    liEl,
                    itemsParentEl = [],
                    alignClass;

                if (Sweet.constants.align.LEFT === options.align) {
                    alignClass = defaultPanelContentLeftClass;
                }
                else if (Sweet.constants.align.RIGHT === options.align) {
                    alignClass = defaultPanelContentRightClass;
                }
                else {
                    alignClass = defaultPanelContentLeftClass;
                }

                // 循环生成流式布局
                for (var i = 0, tempId; i < length; i++) {
                    tempId = FlowIdPrefix + options.id + "-" + (++uuid);
                    liEl = $("<li>").attr("id", tempId)
                        .addClass(defaultPanelContentLiClass)
                        .appendTo(ulEl);
                    itemsParentEl[i] = {"id": tempId, "parentEl": liEl};
                }
                ulEl.addClass(alignClass).appendTo(panelContentEl);
                me.itemsParentEl = itemsParentEl;
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
     * @description 流式布局容器
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
     * 创建流式布局容器：
     * var sweetHPanel = Sweet.panel.FlowPanel();
     */
    Sweet.panel.FlowPanel = $.sweet.widgetContainerFlowpanel;
}(jQuery));

/**
 * @fileOverview
 * <pre>
 * 容器组件-Widget列表布局容器
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    "use strict";

    var defaultContentClass = "sweet-panel-content",
        containerClass = "sweet-widgetlist-container",
        contentClass = "sweet-widgetlist-panel",
        scrollLeftClass = "sweet-widgetlist-scroll-left",
        scrollRightClass = "sweet-widgetlist-scroll-right",
        scrollDisabledClass = "sweet-widgetlist-scroll-disabled",
        widgetListClass = "sweet-widgetlist-list",
        widgetItemClass = "sweet-widgetlist-item",
        itemDraggingClass = "sweet-widgetlist-item-dragging",
        itemInfoClass = "sweet-widgetlist-item-info",
        itemNameClass = "sweet-widgetlist-item-name",
        itemDetailClass = "sweet-widgetlist-item-detail",
        idPrefix = "list-item-",
        flatClass = "sweet-widgetlist-flat",
        uuid = 1000;
    var scrollAnimationDuration = 500;

    $.widget("sweet.widgetContainerWidgetlist", $.sweet.widgetContainerPanel,
        /** @lends Sweet.panel.WidgetList.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-widgetlist]:",
        type: "WidgetList",
        eventNames: /** @lends Sweet.panel.WidgetList.prototype*/{
            /**
             * @event
             * @description 开始拖动事件
             */
            drag: "开始拖动",
            /**
             * @event
             * @description 正在拖动事件
             */
            dragging: "正在拖动",
            /**
             * @event
             * @description 拖动结束事件
             */
            drop: "拖动结束"
        },
        options: /** @lends Sweet.panel.WidgetList.prototype*/{
            /**
             * 布局行数。暂时只支持2行
             * @type Number
             * @default 2
             */
            rows: 2,
            /**
             * 子组件间距
             * @type Number
             * @default 8
             */
            padding: 8,
            /**
             * 子组件宽度
             * @type Number
             * @default 180
             */
            cellWidth: 180,
            /**
             * 是否扁平样式
             * @type Boolean
             * @default false
             */
            flat: false
        },
        /**
         * @private
         * @descripition 重新计算绘制表格布局
         */
        _doLayout: function () {
            var me = this;

            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }

            // 调用父类的_doLayout，调整panelContentEl的大小
            me._super();

            var options = me.options;
            var rows = options.rows;
            var padding = options.padding;

            me.widgetList.externalHeight(me.panelContentEl.height());
            var listHeight = me.widgetList.height();

            var width = options.cellWidth;
            var height = Math.floor((listHeight - padding * (rows - 1)) / rows);
            var offsetX;
            var area;

            // 瀑布式排列
            offsetX = 0;
            var items = [];
            var deal = {};

            // 所有待排列item放到队列中
            $.each(options.items, function (index, obj) {
                if (obj.colSpan <= 0) {
                    obj.colSpan = 1;
                }
                if (obj.rowSpan <= 0) {
                    obj.rowSpan = 1;
                }
                items.push(obj);
            });

            /**
             * @private
             * @param {Number} type 类型
             * @param {Array} exclude 排序列表
             * @returns {Object} 取得的item
             */
            function getItem (type, exclude) {
                var obj;
                var excludeList = [];

                if (!$.isArray(exclude)) {
                    excludeList.push(exclude);
                }
                else {
                    excludeList = exclude;
                }

                // 按顺序找
                for (var i = 0; i < items.length; i++) {
                    obj = items[i];

                    // 跳过已经摆放好的widget
                    if (typeof(deal[obj.__containerId]) !== 'undefined') {
                        continue;
                    }

                    // 跳过不想找到的对象
                    if ($.inArray(obj, excludeList) >= 0) {
                        continue;
                    }

                    // 区域类型
                    // 1:1x1, 2:2x1, 3:1x2, 4:2x2
                    if (type === 1 && obj.colSpan === 1 && obj.rowSpan === 1) {
                        return obj;
                    }
                    else if (type === 2 && obj.colSpan === 1 && obj.rowSpan === 2) {
                        return obj;
                    }
                    else if (type === 3 && obj.colSpan === 2 && obj.rowSpan === 1) {
                        return obj;
                    }
                    else if (type === 4 && obj.colSpan === 2 && obj.rowSpan === 2) {
                        return obj;
                    }
                }

                return null;
            }

            var obj;
            var index = 0;
            var count = 0;
            var item1, item2, item3, item4, item5;

            /**
             * 开始摆放，容器的高度是2,宽度无限。目标是瀑布式排列，中间不存在空洞
             * 算法：
             * 1：从队列中按顺序取一个未摆放的item，并直接摆放在最后位置
             * 2：如果item的高度是2（2x2或2x1),不会导致出现空洞，继续按顺序取下一个未摆放的item
             * 3：如果item高度是1（1x2或1x1）,为防止出现空洞，则
             * 3.1：如果item宽度为2（1x2）
             *        如果队列中有相同类型的未摆放item，放在同一列（无空洞）
             *        否则，如果队列中有两个1x1的未摆放item，取两个放在第二行（无空洞）
             *        否则：如果队列中有一个1x1的未摆放item，取一个放在第二行（出现空洞）
             *        否则：出现空洞
             *        转步骤1继续处理
             * 3.2：如果item宽度为1（1x1）
             *        如果队列中有未摆放的1x1、1x2的item，各取一个，1x1的放在右侧，1x2的放在第二行（无空洞）
             *        否则，如果列表中只有未摆放的1x1的item，取出一个，放在第二行（无空洞）
             *        否则，如果列表中只有未摆放的1x2的item，取出一个，放在第二行（出现空洞）
             *        否则：出现空洞
             *        转步骤1继续处理
             */

            /**
             * 2*2，直接摆放
             * @private
             */
            function _place2x2() {
                area = $('#' + obj.__containerId);
                area.externalWidth(width * 2 + padding).externalHeight(height * 2 + padding);
                area.css({'left': offsetX, 'top': 0});

                deal[obj.__containerId] = obj;
                offsetX += (width + padding) * 2;
                count++;
            }

            /**
             * 2*1，直接摆放
             * @private
             */
            function _place2x1() {
                area = $('#' + obj.__containerId);
                area.externalWidth(width).externalHeight(height * 2 + padding);
                area.css({'left': offsetX, 'top': 0});

                deal[obj.__containerId] = obj;
                offsetX += width + padding;
                count++;
            }

            /**
             * 1*2
             * 尽量两个相同的摆放在同一列
             * 否则，尽量找两个1*1的摆放在第二行
             * @private
             */
            function _place1x2() {
                item1 = getItem(3, obj);
                item2 = getItem(1);
                item3 = getItem(1, item2);
                item4 = getItem(2);
                item5 = getItem(4);

                if ((item1 === null && (item2 === null || item3 === null)) &&
                    (item4 !== null || item5 !== null)) {
                    items.push(obj);
                    return;
                }

                // 第一行
                area = $('#' + obj.__containerId);
                area.externalWidth(width * 2 + padding).externalHeight(height);
                area.css({'left': offsetX, 'top': 0});
                deal[obj.__containerId] = obj;
                count++;

                item1 = getItem(3, obj);
                if (item1 !== null) {
                    // 第二行
                    area = $('#' + item1.__containerId);
                    area.externalWidth(width * 2 + padding).externalHeight(height);
                    area.css({'left': offsetX, 'top': height + padding});

                    deal[item1.__containerId] = item1;
                    count++;
                }
                else {
                    item1 = getItem(1, obj);
                    item2 = getItem(1, [item1, obj]);

                    // 第二行有两个1*1
                    if (item1 !== null && item2 !== null) {
                        // 左下
                        area = $('#' + item1.__containerId);
                        area.externalWidth(width).externalHeight(height);
                        area.css({'left': offsetX, 'top': height + padding});

                        // 右下
                        area = $('#' + item2.__containerId);
                        area.externalWidth(width).externalHeight(height);
                        area.css({'left': offsetX + width + padding, 'top': height + padding});

                        deal[item1.__containerId] = item1;
                        deal[item2.__containerId] = item2;
                        count += 2;
                    }
                    else if (item1 || item2 !== null) {
                        // 第二行只能摆放一个
                        item1 = item1 || item2;

                        area = $('#' + item1.__containerId);
                        area.externalWidth(width).externalHeight(height);
                        area.css({'left': offsetX, 'top': height + padding});

                        deal[item1.__containerId] = item1;
                        count++;
                    }
                }

                // 必须向右偏移2位置
                offsetX += (width + padding) * 2;
            }

            /**
             * 1*1
             * 尽量摆放成：第一行 1*1 1*1；第二行 2*1
             * 否则分成两行摆放
             * @private
             */
            function _place1x1() {
                item1 = getItem(1, obj);
                item2 = getItem(3);
                item3 = getItem(2);
                item4 = getItem(4);

                // 如果摆放导致不整齐，且有x*2的item，先放它
                if (((item1 === null && item2 !== null) || (item1 === null && item2 === null)) &&
                    (item3 || item4) !== null) {
                    items.push(obj);
                    return;
                }

                // 左上
                area = $('#' + obj.__containerId);
                area.externalWidth(width).externalHeight(height);
                area.css({'left': offsetX, 'top': 0});
                deal[obj.__containerId] = obj;
                count++;

                if (item1 !== null && item2 !== null) {
                    // 右上
                    area = $('#' + item1.__containerId);
                    area.externalWidth(width).externalHeight(height);
                    area.css({'left': offsetX + width + padding, 'top': 0});

                    // 下方
                    area = $('#' + item2.__containerId);
                    area.externalWidth(width * 2 + padding).externalHeight(height);
                    area.css({'left': offsetX, 'top': height + padding});

                    deal[item1.__containerId] = item1;
                    deal[item2.__containerId] = item2;
                    count += 2;
                    offsetX += (width + padding) * 2;
                }
                else if (item1 !== null) {
                    // 下方
                    area = $('#' + item1.__containerId);
                    area.externalWidth(width).externalHeight(height);
                    area.css({'left': offsetX, 'top': height + padding});

                    deal[item1.__containerId] = item1;
                    count++;
                    offsetX += width + padding;
                }
                else if (item2 !== null) {
                    // 下方
                    area = $('#' + item2.__containerId);
                    area.externalWidth(width * 2 + padding).externalHeight(height);
                    area.css({'left': offsetX, 'top': height + padding});

                    deal[item2.__containerId] = item2;
                    count++;
                    offsetX += (width + padding) * 2;
                }
                else {
                    offsetX += width + padding;
                }
            }

            // 从队列中取item处理
            while (true) {
                if (count >= options.items.length) {
                    break;
                }
                obj = items[index];

                // 可能前面已经处理过，不重复处理
                if (typeof(deal[obj.__containerId]) !== 'undefined') {
                    index ++;
                    continue;
                }

                // 取一个item，在界面上摆放
                if (obj.colSpan === 2 && obj.rowSpan === 2) {
                    // 2*2，直接摆放
                    _place2x2();
                }
                else if (obj.colSpan === 1 && obj.rowSpan === 2) {
                    // 2*1，直接摆放
                    _place2x1();
                }
                else if (obj.colSpan === 2 && obj.rowSpan === 1) {
                    // 1*2
                    // 尽量两个相同的摆放在同一列
                    // 否则，尽量找两个1*1的摆放在第二行
                    _place1x2();
                }
                else if (obj.colSpan === 1 && obj.rowSpan === 1) {
                    // 1*1
                    // 尽量摆放成：第一行 1*1 1*1；第二行 2*1
                    // 否则分成两行摆放
                    _place1x1();
                }

                // 下一个
                index ++;
            }

            // 根据内容，修正容器宽度
            this.widgetList.externalWidth(offsetX);

            // 更新滚动按钮状态
            this._updateScrollButton();

            // 调整图片位置
        },
        /**
         * @description 调整item中的图片位置，使其居中
         * @private
         */
        _layoutImage: function () {
            var _this = this;
            var image, area;
            var delay = false;

            // 水平居中通过margin-left/margin-right设置为auto来实现
            // 这里只需要计算垂直偏移，并设置margin-top，使图片垂直居中
            $.each(this.options.items, function (index, item) {
                if (delay) {
                    return;
                }

                // 取得图片对象
                area = $('#' + item.__containerId);
                image = area.find(">img").first();
                if ($.isNull(image)) {
                    return;
                }

                // 计算偏移
                if (image.height() > 0) {
                    image.css("margin-top", Math.floor((area.height() - image.height()) / 2));
                }
                else {
                    // 如果取不到高度，需要延迟一段时间再重新执行
                    delay = true;
                }
            });

            // 延迟执行
            if (delay) {
                window.setTimeout(function () {
                    _this._layoutImage();
                }, 200);
            }
        },
        /**
         * @description 更新滚动按钮状态
         * @private
         */
        _updateScrollButton: function () {
            var me = this;
            var listWidth = me.widgetList.externalWidth();
            var containerWidth = me.panelContentEl.width();
            var left;

            if (listWidth > containerWidth) {
                me.scrollLeft.show();
                me.scrollRight.show();

                // 根据已存在的偏移，切换滚动按钮显示状态
                left = this.widgetList.position().left;
                if (left >= 0) {
                    me.scrollLeft.addClass(scrollDisabledClass);
                }
                else {
                    me.scrollLeft.removeClass(scrollDisabledClass);
                }

                if (left + listWidth <= containerWidth) {
                    me.scrollRight.addClass(scrollDisabledClass);
                }
                else {
                    me.scrollRight.removeClass(scrollDisabledClass);
                }
            }
            else {
                me.scrollLeft.hide();
                me.scrollRight.hide();
                this.widgetList.css('left', 0);
            }
        },
        /**
         * @private
         * @description 面板渲染
         */
        _widgetRender: function () {
            var me = this;
            if (me.containerEl) {
                if (me.panelTitleEl) {
                    me.panelTitleEl.appendTo(me.containerEl);
                }
                me.containerEl.addClass(containerClass);
                me.panelContentEl.appendTo(me.containerEl);
                me.scrollLeft.appendTo(me.containerEl);
                me.scrollRight.appendTo(me.containerEl);

                if (me.options.flat) {
                    me.containerEl.addClass(flatClass);
                }

                // 将组件渲染到布局中
                $.each(me.options.items, function (index, item) {
                    me._renderItem(item);
                });

                // 配置滚动按钮事件
                me._addEvents();
            }
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            // 删除所有子组件
            this._removeItems();

            // 解除事件绑定
            this.scrollLeft.unbind();
            this.scrollRight.unbind();
            this.widgetList.draggable('destroy');

            this._super();
        },
        /**
         * @description 配置事件
         * @private
         */
        _addEvents: function () {
            var me = this;

            var leftPushing = false;
            var rightPushing = false;
            var scrolling = false;

            // 事件：向左滚动
            function _scrollLeft () {
                me.widgetList.stop(false, true);

                var pos = me.widgetList.position().left;
                var offset = pos + (me.options.cellWidth + me.options.padding) * 2;

                if (pos >= 0) {
                    return false;
                }
                if (offset >= 0) {
                    offset = 0;
                }

                scrolling = true;
                me.widgetList.animate({
                    'left': offset
                }, {
                    duration: scrollAnimationDuration,
                    easing: "easeOutCirc",
                    complete: function () {
                        scrolling = false;

                        // 更新滚动按钮状态
                        me._updateScrollButton();

                        // 持续滚动
                        if (leftPushing && me.scrollLeft.is(":visible")) {
                            _scrollLeft();
                        }
                    }
                });

                return true;
            }

            // 事件：向右滚动
            function _scrollRight () {
                me.widgetList.stop(false, true);

                var contentWidth = me.panelContentEl.width();
                var pos = me.widgetList.position().left;
                var width = me.widgetList.externalWidth();
                var offset = pos - (me.options.cellWidth + me.options.padding) * 2;

                if (width + pos <= contentWidth) {
                    return false;
                }

                scrolling = true;
                me.widgetList.animate({
                    'left': offset
                }, {
                    duration: scrollAnimationDuration,
                    complete: function () {
                        scrolling = false;

                        // 更新滚动按钮状态
                        me._updateScrollButton();

                        // 持续滚动
                        if (rightPushing && me.scrollRight.is(":visible")) {
                            _scrollRight();
                        }
                    }
                });

                return true;
            }

            // 事件绑定
            me.scrollLeft.unbind()
                .bind('mousedown', function() {
                    leftPushing = true;
                    rightPushing = false;
                    _scrollLeft();
                })
                .bind('mouseup mouseleave', function () {
                    leftPushing = false;
                });

            me.scrollRight.unbind()
                .bind('mousedown', function() {
                    leftPushing = false;
                    rightPushing = true;
                    _scrollRight();
                })
                .bind('mouseup mouseleave', function () {
                    rightPushing = false;
                });

            // 滚轮事件
            me.containerEl.onMouseWheel(me.containerEl.get(0), function (event, data) {
                var delta = data.delta;

                // delta大于0,向左滚动；否则向右滚动
                if (delta > 0) {
                    _scrollLeft();
                }
                else {
                    _scrollRight();
                }

                return false;
            });
        },
        /**
         * @description 绑定外部关注的事件
         * @private
         */
        _addListener: function () {
            if (this.__dragRegistered) {
                return;
            }
            else {
                this.__dragRegistered = true;
            }

            var me = this;
            var widget = null;

            // 事件：拖动
            this.widgetList.draggable({
                containment: 'body',
                appendTo: 'body',
                distance: 5,
                cursorAt: {left: 0, top: 0},
                helper: function (event) {
                    var target = event.target;
                    var obj = null;
                    var helper = null;
                    var id = '';

                    // 找到拖动的widget
                    me.widgetList.children().each(function (index, div) {
                        if ($.isNull(div)) {
                            return;
                        }

                        if (target.id === div.id || $.contains(div, target)) {
                            obj = $(div);
                        }
                    });

                    // 如果尝试拖动Widget，创建一个helper
                    if (obj) {
                        helper = obj.clone();
                        helper.addClass(itemDraggingClass);
                        if (me.options.flat) {
                            helper.addClass(flatClass);
                        }
                        me.widgetList.draggable('option', 'cursorAt',
                            {left: helper.width() / 2, top: helper.height() / 2});

                        // 找到对应的item
                        id = obj.attr('id');
                        for (var i = 0; i < me.options.items.length; i++) {
                            if (me.options.items[i].__containerId === id) {
                                widget = me.options.items[i];
                                break;
                            }
                        }
                    }
                    else {
                        widget = null;
                        helper = null;
                    }

                    return helper;
                },
                start: function (event) {
                    me._trigger('drag', event, widget);
                },
                stop: function (event) {
                    me._trigger('drop', event, widget);
                },
                drag: function (event) {
                    me._trigger('dragging', event, widget);
                }
            });
        },
        /**
         * @description 触发事件
         * @param {String} eventName 事件名
         * @param {Object} event 事件对象
         * @param {Object} args 参数
         * @private
         */
        _trigger: function (eventName, event, args) {
            if ($.isNull(this.handlers)) {
                return;
            }

            // 查找回调函数
            var fn = this.handlers[eventName];
            if (!$.isFunction(fn)) {
                return;
            }

            // 执行回调
            fn(event, args);
        },
        /**
         * @private
         * @description 创建布局
         */
        _createPanelContent: function () {
            var me = this;
            var widgetList;

            // 一级容器
            me.panelContentEl = $("<div>").addClass(contentClass).addClass(defaultContentClass);

            // 二级容器，放置Table
            widgetList = me.widgetList = $("<div>");

            // 设置样式
            widgetList.addClass(widgetListClass).appendTo(me.panelContentEl);

            // 滚动按钮
            me.scrollLeft = $("<div>").addClass(scrollLeftClass);
            me.scrollRight = $("<div>").addClass(scrollRightClass);
        },
        /**
         * @description 渲染item到容器中
         * @param {Object} item 子组件对象
         * @private
         */
        _renderItem: function (item) {
            if ($.isNull(item)) {
                return;
            }

            var tip = "<" + item.name + ">";
            if (!$.isNull(item.desc)) {
                tip += "<br>" + item.desc;
            }

            var id = idPrefix + (++uuid);
            var area = $("<div>");
            area.attr('id', id).addClass(widgetItemClass).appendTo(this.widgetList);

            var image = $("<img>");
            image.attr('src', item.imagePath).appendTo(area);

            var info  = $("<div>");
            info.attr("title", tip).addClass(itemInfoClass).appendTo(area);

            var name = $("<span>");
            name.html(item.name).addClass(itemNameClass).appendTo(info);

            var desc = $("<span>");
            desc.html(item.desc).addClass(itemDetailClass).appendTo(info);

            item.__containerId = id;
        },
        /**
         * @description 动态添加组件
         * @param {Object/Array} items 组件对象或组件对象数组
         */
        _addItems: function (items) {
            var item;

            for (var i = 0; i < items.length; i++) {
                item = items[i];
                this.options.items.push(item);
                this._renderItem(item);
            }
        },
        /**
         * @description 从布局动态删除子组件
         * @param {Array} items 待删除的子组件索引
         * @private
         */
        _removeItems: function (items) {
            var id;
            var item;

            if ($.isNull(items)) {
                this.options.items = [];
                this.widgetList.empty();
            }
            else {
                items.sort();
                for (var i = items.length - 1; i >= 0; i--) {
                    for (var j = 0; j < this.options.items.length; j++) {
                        id = items[i];
                        item = this.options.items[j];

                        if (($.type(id) === "string" && id === item.name) ||
                            ($.type(id) === "number" && id === j)) {
                            this.widgetList.find("#" + item.__containerId).remove();
                            this.options.items.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        },
        /**
         * @event
         * @description 开始拖动事件
         * @name Sweet.panel.WidgetList#drag
         * @param {Object} event 事件对象
         * @param {Object} widget 拖动的item对象
         */
        drag: function (event, widget) {
            $.log(event + "," + widget);
        },
        /**
         * @event
         * @description 正在拖动事件
         * @name Sweet.panel.WidgetList#dragging
         * @param {Object} event 事件对象
         * @param {Object} widget 拖动的item对象
         */
        dragging: function (event, widget) {
            $.log(event + "," + widget);
        },
        /**
         * @event
         * @description 拖动结束事件
         * @name Sweet.panel.WidgetList#drop
         * @param {Object} event 事件对象
         * @param {Object} widget 拖动的item对象
         */
        drop: function (event, widget) {
            $.log(event + "," + widget);
        }
    });

    /**
     * @description Widget列表布局容器
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
     * 创建布局容器：
     * var sweetWidgetList = Sweet.panel.WidgetList();
     */
    Sweet.panel.WidgetList = $.sweet.widgetContainerWidgetlist;
}(jQuery));

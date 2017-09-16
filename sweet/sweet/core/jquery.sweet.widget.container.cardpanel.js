/**
 * @fileOverview
 * <pre>
 * 容器组件-Card布局容器
 * 2014/3/3
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {

    var contentClass = "sweet-panel-card",
        cardClass = "sweet-panel-card-item",
        cascadCardClass = "sweet-panel-card-cascad",
        visibleClass = "sweet-panel-card-visible",
        invisibleClass = "sweet-panel-card-invisible",
        maskClass = "sweet-panel-card-mask",
        uuid = 1000;

    $.widget("sweet.widgetContainerCard", $.sweet.widgetContainerPanel, /* @lends Sweet.panel.CardPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-cardpanel]:",
        type: "FlowPanel",
        options: /** @lends Sweet.panel.CardPanel.prototype*/{
            /**
             * Card切换方式。default:普通方式，cascad:层叠方式
             * @type String
             * @default "default"
             */
            style: "default",
            /**
             * 层叠切换方式下，上层的Card相对下层的Card的偏移
             * @type Number
             * @default 100
             */
            cardIndent: 100,
            /**
             * 子组件数组。注：在层叠显示方式下，须严格按照显示先后顺序保存子组件
             * @type Array
             * @default []
             */
            items: null
        },
        /**
         * 切换到指定序号的Card。非层叠方式下，先自动隐藏当前显示的Card，再显示指定的Card
         * @param index Card的序号，从0开始
         */
        showCard: function (index) {
            var items = this.options.items;
            if (index < 0 || !$.isArray(items) || index >= items.length) {
                return;
            }

            var style = this.options.style;
            var cards = this.panelContentEl.children("div." + cardClass);
            var card;
            var width, offset, count;

            // 不同切换方式，分开处理
            if (style === "default") {
                // 隐藏
                cards.removeClass(visibleClass).addClass(invisibleClass);

                // 显示指定的
                $(cards.get(index)).removeClass(invisibleClass).addClass(visibleClass);
            }
            else if (style === "cascad") {
                card = $(cards.get(index));
                count = this.panelContentEl.children("div." + cascadCardClass).length;

                // 如果目标Card已经可见，隐藏其后的可见Card
                if (card.hasClass(visibleClass)) {
                    for (var i = cards.length - 1; i > index; i--) {
                        card = $(cards.get(i));
                        if (card.hasClass(cascadCardClass)) {
                            this.hideCard();
                        }
                    }
                }
                // 如果目标Card不可见，显示出来
                else {
                    // 处理偏移
                    offset = (count + 1) * this.options.cardIndent;
                    width = this.panelContentEl.width();

                    // 从右侧滑入
                    card.css({left: width + "px", right: 0 - (width - offset) + "px"});
                    card.addClass(cascadCardClass).removeClass(invisibleClass).addClass(visibleClass);
                    card.animate({
                        left: offset + "px",
                        right: "0px"
                    }, 200);
                }

                // 可见Card超过一个，增加遮罩
                count = this.panelContentEl.children("div." + cascadCardClass).length;
                if (count > 0) {
                    this.maskEl.detach();
                    card.before(this.maskEl);
                }
            }

            // 刷新切换到最前的子组件
            var item = items[index];
            if ($.isFunction(item.doLayout)) {
                item.doLayout();
            }
        },
        /**
         * 在层叠方式下可用，隐藏最上层的Card
         */
        hideCard: function () {
            var me = this;
            var cards, card, preCard;
            var width, offset;

            if (this.options.style !== "cascad") {
                return;
            }

            var count = this.panelContentEl.children("div." + cascadCardClass).length;
            if (count < 1) {
                this.maskEl.detach();
                return;
            }

            // 隐藏最后一个可见的Card
            width = this.panelContentEl.width();
            offset = count * this.options.cardIndent;
            cards = $(this.panelContentEl.children("div." + cascadCardClass));
            card = cards.last();

            card.removeClass(cascadCardClass);
            card.animate({
                left: width + "px",
                right: 0 - (width - offset) + "px"
            }, 200, function () {
                card.removeClass(visibleClass).addClass(invisibleClass);
            });

            // 移动遮罩
            this.maskEl.detach();
            if (count > 1) {
                preCard = $(cards.get(cards.length - 2));
                preCard.addClass(cascadCardClass).before(this.maskEl);
            }
        },
        /**
         * @private
         * @descripition 重新计算流式布局
         */
        _doLayout: function () {
            var me = this;
            var panelWidth;
            var panelHeight;
            var item;

            // 渲染前不处理
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
            if (me.options.items.length === 0) {
                return;
            }

            // 如果容器大小为0，不需要处理
            if (me.panelContentEl.width() < 1 || me.panelContentEl.height < 1) {
                return;
            }

            // 当前Panel大小
            panelWidth = me.panelContentEl.width();
            panelHeight = me.panelContentEl.height();

            // 调用子组件的dolayout
            for (var i = 0; i < me.options.items.length; i++) {
                item = me.options.items[i];
                if ($.isFunction(item.doLayout)) {
                    item.doLayout();
                }
            }
        },
        /**
         * 动态添加项目
         * @param items
         * @private
         */
        _addItems: function (items) {
            var options = this.options;
            var item;

            // 记录到列表中
            options.items = options.items.concat(items);

            // 创建容器并插入
            for (var i = 0; i < items.length; i++) {
                item = items[i];
                me._renderItem(item, this._addCard());
            }
        },
        /**
         * @description 添加一个card容器
         * @returns {string}
         * @private
         */
        _addCard: function () {
            var me = this;
            var id = me.options.id + "-card-" + (uuid++);
            var cardEl = $("<div></div>");

            cardEl.attr("id", id).addClass(cardClass).appendTo(me.panelContentEl);

            // 缺省显示第一个
            if (me.panelContentEl.children("." + cardClass).length > 1) {
                cardEl.addClass(invisibleClass);
            }
            else {
                cardEl.addClass(visibleClass);
            }
            return id;
        },
        /**
         * 渲染一个子组件
         * @param item
         * @param id
         * @private
         */
        _renderItem: function (item, id) {
            if ($.isFunction(item.render)) {
                item.render(id);
            }
            else if (!$.isNull(item.html)) {
                $("#" + id).html(item.html);
                item.options = $.extend({}, item.options, item);
            }
            else {
                this._error("item is invalid:" + item);
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
            var card;
            var cards;
            var index;

            cards = me.panelContentEl.children("div." + cardClass);

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
                card = cards.children().eq(index);

                // 销毁子组件
                if (item && $.isFunction(item.destroy)) {
                    item.destroy();
                }
                me.options.items.splice(index, 1);

                // 删除子容器
                card.remove();
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

                // 将组件附着到容器内
                $.each(me.options.items, function (index, item) {
                    me._renderItem(item, me._addCard());
                });
            }
        },
        /**
         * @private
         * @description 创建流式布局
         */
        _createPanelContent: function () {
            this.maskEl = $("<div></div>").addClass(maskClass);
            this.panelContentEl = $("<div>").addClass(contentClass);

            if (this.options.items === null) {
                this.options.items = [];
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
    Sweet.panel.CardPanel = $.sweet.widgetContainerCard;
}(jQuery));


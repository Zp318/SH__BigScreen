/*
 * @fileOverview tabpanel组件
 * @date 2012/12/18
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.sweet.widget.js
 *  jquery.sweet.widget.container.js
 *
 * @history
 */
(function ($, undefined) {
    'use strict';

    var defaultPanelContentClass = "sweet-panel-content";
    var tabPanelClass = "sweet-tabpanel";
    var tabHeaderClass = "tab-navigator";
    var tabCardClass = "tab-card";
    var tabCardSlideClass = "tab-card-slide";
    var tabContentClass = "tab-content";
    var tabLeftClass = "tab-left";
    var tabRightClass = "tab-right";
    var tabListClass = "tab-list";
    var tabCloseClass = "tab-list-close-button";
    var tabSeperatorClass = "tab-list-seperator";
    var tabAllClass = "tab-all";
    var tabAllListClass = "sweet-tabpanel-all-list";
    var activeClass = "active";
    var hoverClass = "hover";
    var invisibleClass = "invisible";

    var selectorLIVisible = "li[visible!=false]",
        selectorLIInvisible = "li[visible=false]";

    var TAB_SYSTEM = 1;
    var TAB_LEFT = 10;          // 索引大于等于10,标签在左侧
    var MAX_TITLE_LENGTH = 25;  // 标签文本最大长度

    $.widget("sweet.widgetContainerTabpanel", $.sweet.widgetContainerPanel,
        /**@lends Sweet.panel.TabPanel.prototype*/{
            version: "1.0",
            sweetWidgetName: "[widget-container-tabpanel]:",
            eventNames: /**@lends Sweet.panel.TabPanel.prototype*/{
                /**
                * @event
                * @description Tab标签切换
                * @param {Object} tab1 前一个tab对象
                * @param {Object} tab2 当前tab对象
                */
                tabchanged: "Tab标签切换",
                tabclosed: "Tab标签关闭"
            },
            options: /**@lends Sweet.panel.TabPanel.prototype*/{
                /**
                 * 是否可关闭
                 * @type Boolean
                 * @default false
                 */
                closable: false,
                /**
                 * 活动面板ID
                 * @type Number
                 * @default 0
                 */
                activeTab: 0,
                /**
                 * 样式序号，1~4
                 * @type Number
                 * @default 1
                 */
                style: TAB_SYSTEM,
                /**
                 * 子组件列表
                 * @type Array
                 * @default []
                 */
                items: [],
                /**
                 * 监听事件列表。不建议使用，请以addListener代替
                 * @type Array
                 * @default []
                 * @deprecated
                 */
                listeners: [],
                /**
                 * 容器是否需要style为11时的背景，如果不需要11风格下的背景则设置为"none"
                 * @type string
                 * @default "yes"
                 */
                bgColor : "yes"
            },
            /**
             * @description 设置活动面板
             * @param {Number} id 面板序号
             */
            setActiveTab: function (id) {
                var item;
                var i;

                // 激活面板
                if ($.type(id) === 'string') {
                    for (i = 0; i < this.options.items.length; i++) {
                        item= this.options.items[i];
                        if ((item.options && item.options.id === id) || (item.id && item.id === id)) {
                            this._activeTab(i);
                            break;
                        }
                    }
                }
                else if ($.type(id) === 'number') {
                    this._activeTab(id);
                }
                else {
                    this._error('target id is invalide[' + id + ']');
                }
            },

            /**
             * @description 返回活动面板序号
             * @return {Number} 返回活动面板序号
             */
            getActiveTab: function () {
                return this.options.activeTab;
            },
            /**
             * @description 获取item
             * @param {Number/String} id 索引或id
             * @returns {Object}
             */
            getItem: function (id) {
                var item;
                var i;

                // 根据id查找
                if ($.type(id) === 'string') {
                    for (i = 0; i < this.options.items.length; i++) {
                        item= this.options.items[i];
                        if ((item.options && item.options.id === id) || (item.id && item.id === id)) {
                            return item;
                        }
                    }
                    return null;
                }
                // 根据序号查找
                else if ($.type(id) === 'number') {
                    if (id < 0 || id >= this.options.items.length) {
                        return null;
                    }
                    else {
                        return this.options.items[id];
                    }
                }

                return null;
            },
            /**
             * 添加Tab项。废弃，不再对外公开
             * @param {Object} item 待添加的项目
             * @deprecated
             * @private
             */
            addTab: function (item) {
                var me = this;
                var options = me.options;

                if (item === null) {
                    return;
                }

                // 添加
                me.options.items.push(item);
                me._addTab(item);

                // 激活
                me._activeTab(options.items.length - 1);
            },
            /**
             * @private
             * @descripition 重新计算布局
             */
            _doLayout: function () {
                var me = this;

                // 渲染前禁止进入
                if (!me.rendered) {
                    return;
                }

                // 调用父类的_doLayout，调整panelContentEl的大小
                me._super();

                if (me.tabListEl === null) {
                    return;
                }

                // 调整tabList，计算是否显示滑动按钮
                if (me.options.style < TAB_LEFT) {
                    me._tablistLayoutHorizontal();
                }
                else {
                    me._tablistLayoutVertical();
                }

                // 调用内部组件的layout
                var item = me.options.items[me.options.activeTab];
                if (!$.isNull(item) && $.isFunction(item.doLayout)) {
                    item.doLayout();
                }
            },
            /**
             * @description 刷新Tab标签布局，自动计算是否需要显示滑动按钮。只适用于水平的Tab排布
             * @private
             */
            _tablistLayoutHorizontal: function () {
                var me = this;
                var tabListWidth = 0;
                var extra = 5;
                var panelWidth = me.panelContentEl.width() - extra;
                var width = 0;
                var buttonVisible = false;

                // 计算标签总长度
                me.tabListEl.find("li").each(function (index, item) {
                    tabListWidth += $(item).externalWidth();
                });

                // 检查当前按钮是否可见
                if (!me.tabLeftEl.hasClass(invisibleClass)) {
                    buttonVisible = true;
                }

                // 如果长度超过可视范围，显示滑动按钮
                if (tabListWidth > panelWidth && !buttonVisible) {
                    me.tabLeftEl.removeClass(invisibleClass);
                    me.tabRightEl.removeClass(invisibleClass);
                    me.tabAllEl.removeClass(invisibleClass);

                    // 确保激活的Tab完全可见
                    var tab = me.getActiveTab();
                    if (tab === me.options.items.length - 1) {
                        me._activeTab(tab);
                    }
                }
                // 否则隐藏滑动按钮
                else if (tabListWidth <= panelWidth && buttonVisible) {
                    me.tabLeftEl.addClass(invisibleClass);
                    me.tabRightEl.addClass(invisibleClass);
                    me.tabAllEl.addClass(invisibleClass);

                    // 滑动标签，确保全部可见
                    me._scrollList("right", 65535);
                }

                // 改变按钮状态后，重新计算列表宽度
                width = panelWidth - me.tabLeftEl.externalWidth();
                width -= me.tabRightEl.externalWidth();
                width -= me.tabAllEl.externalWidth();

                // 标签宽度
                me.tabListEl.externalWidth(width);

            },
            /**
             * @description 刷新Tab标签布局，自动计算是否需要显示滑动按钮。只适用于垂直的Tab排布
             * @private
             */
            _tablistLayoutVertical: function () {
                var me = this;
                var tabListHeight = 0;
                var panelHeight = me.panelContentEl.height();
                var width, height;
                var buttonVisible = false;
                var cardEl;
                var scrollDiv = me.tabListEl.children("div").first();

                // 计算标签总高度
                me.tabListEl.find("li").each(function (index, item) {
                    tabListHeight += $(item).externalHeight();
                });

                // 检查当前按钮是否可见
                if (!me.tabLeftEl.hasClass(invisibleClass)) {
                    buttonVisible = true;
                }

                // 如果高度超过可视范围，显示滑动按钮
                if (tabListHeight > panelHeight) {
                    me.tabLeftEl.removeClass(invisibleClass);
                    me.tabRightEl.removeClass(invisibleClass);

                    // 不需要滚动的时候，也要隐藏按钮
                    if (scrollDiv.position().top >= 0) {
                        me.tabLeftEl.addClass(invisibleClass);
                    }
                    if (scrollDiv.position().top + tabListHeight <= panelHeight) {
                        me.tabRightEl.addClass(invisibleClass);
                    }

                    // 确保激活的Tab完全可见
                    var tab = me.getActiveTab();
                    if (tab === me.options.items.length - 1) {
                        me._activeTab(tab);
                    }
                }
                // 否则隐藏滑动按钮
                else if (tabListHeight <= panelHeight) {
                    me.tabLeftEl.addClass(invisibleClass);
                    me.tabRightEl.addClass(invisibleClass);

                    // 滑动标签，确保全部可见
                    me._scrollList("right", 65535);
                }

                // 修正滑动容器的高度
                width = me.cardPanelEl.width();
                height = me.cardPanelEl.height();
                me.cardSlideEl.width(width).height(height * me.options.items.length);

                // 显示所有内容
                me.cardSlideEl.children().each(function (index, card) {
                    cardEl = $(card);
                    cardEl.externalWidth(width).externalHeight(height).show();

                    // style10,预先渲染所有内容
                    if (cardEl.children().length === 0) {
                        me._renderItem(me.options.items[index], cardEl.attr('id'));
                    }

                    // 刷新子组件布局
                    if ($.isFunction(me.options.items[index].doLayout)) {
                        me.options.items[index].doLayout();
                    }
                });

            },
            /**
             * @private
             * @description 面板渲染
             */
            _widgetRender: function () {
                var options = this.options;
                var self = this;

                if (!self.containerEl) {
                    return;
                }

                this._super();

                // 注册事件
                $.each(options.listeners, function (eventName, callback) {
                    self.addListener(eventName, callback);
                });

                // 渲染标签头
                $.each(options.items, function (index, item) {
                    self._addTab(item);
                });

                // 激活默认面板
                if ($.isNull(this.options.activeTab)) {
                    this._activeTab(0);
                }
                else {
                    this._activeTab(this.options.activeTab);
                }
            },

            /**
             * @private
             * @description 创建tab布局
             */
            _createPanelContent: function () {
                var self = this;

                // 初始化属性
                this.tabLeftEl = null;
                this.tabRightEl = null;
                this.tabListEl = null;
                this.tabAllEl = null;
                this.tabHeaderEl = null;
                this.cardPanelEl = null;
                this.tabMenuEl = null;
                this.tabItemId = 100;

                var panelContentEl = self.panelContentEl = $("<div>");
                var ds = "<div><span></span></div>";
                var tabLeftEl = this.tabLeftEl = $(ds);
                var tabRightEl = this.tabRightEl = $(ds);
                var tabListEl = this.tabListEl = $("<div><div><ul></ul></div></div>");
                var tabAllEl = this.tabAllEl = $(ds);
                var tabHeadEl = this.tabHeaderEl = $("<div>");
                var tabCardEl = this.cardPanelEl = $("<div>");
                var tabCardSlideEl = this.cardSlideEl = null;

                // 创建左侧滚动按钮
                tabLeftEl.addClass(tabLeftClass)
                    .bind("mousedown", function() {
                        self.leftPushing = true;
                        self.rightPushing = false;
                        self._onLeftClick();
                    })
                    .bind("mouseup mouseleave", function() {
                        self.leftPushing = false;
                    })
                    .appendTo(tabHeadEl);

                // 创建Tab标签列表
                tabListEl.addClass(tabListClass).appendTo(tabHeadEl);
                tabListEl.children("div").css("left", "0px");

                // 注册鼠标滚轮事件监听
                tabListEl.attr("id", this.options.id + "-tab-list");
                tabListEl.onMouseWheel(tabListEl.get(0), function (event, data) {
                    self._wheelScrollList(event, data);
                    return false;
                });

                // 创建所有Tab列表按钮
                tabAllEl.addClass(tabAllClass)
                    .bind("click", {'self': self}, self._onAllClick)
                    .appendTo(tabHeadEl);

                // 创建右侧滚动按钮
                tabRightEl.addClass(tabRightClass)
                    .bind("mousedown", function() {
                        self.leftPushing = false;
                        self.rightPushing = true;
                        self._onRightClick();
                    })
                    .bind("mouseup mouseleave", function() {
                        self.rightPushing = false;
                    })
                    .appendTo(tabHeadEl);

                // 加到DOM树中
                tabHeadEl.addClass(tabHeaderClass).appendTo(panelContentEl);

                // 创建组件Card容器
                tabCardEl.addClass(tabCardClass).appendTo(panelContentEl);
                if(self.options.style === 11 && self.options.bgColor === "none"){
                    panelContentEl.addClass(defaultPanelContentClass)
                        .addClass(tabPanelClass + "-" + self.options.style)
                        .addClass(tabPanelClass + "-bg-color-" + 12);
                } else {
                    panelContentEl.addClass(defaultPanelContentClass)
                        .addClass(tabPanelClass + "-" + self.options.style)
                        .addClass(tabPanelClass + "-bg-color-" + self.options.style);
                }

                if (this.options.style >= TAB_LEFT) {
                    tabCardSlideEl = this.cardSlideEl = $("<div>");
                    tabCardSlideEl.addClass(tabCardSlideClass).appendTo(tabCardEl);
                    this.tabListSliderEl = this.tabAllEl;

                    tabLeftEl.detach().appendTo(panelContentEl);
                    tabRightEl.detach().appendTo(panelContentEl);
                    tabAllEl.unbind();
                }
            },
            /**
             * @description 销毁组件
             * @private
             */
            _destroyWidget: function () {
                // 删除所有标签和子组件
                this._removeItems();

                // 解除事件绑定
                if (this.tabLeftEl) {
                    this.tabLeftEl.unbind();
                }
                if (this.tabRightEl) {
                    this.tabRightEl.unbind();
                }
                if (this.tabAllEl) {
                    this.tabAllEl.unbind();
                }

                this._super();
            },
            /**
             * @description 渲染项目到指定ID的容器中
             * @param {Object} item 子项目
             * @param {String} id 容器的ID
             * @return {Boolean} 是否渲染成功
             * @private
             */
            _renderItem: function (item, id) {
                // 渲染
                if (item.render) {
                    item.render(id);
                }
                else if (!$.isNull(item.url)) {
                    var html = '<iframe frameborder="0" style="width:100%; height:100%;" src="' +
                        item.url + '" allowtransparency="true"></iframe>';

                    $("#" + id).css("overflow", "hidden").html(html);
                }
                else if (!$.isNull(item.html)) {
                    $("#" + id).html(item.html);
                }
                else {
                    this._error("Invalid item object in tab, " + id);
                    return false;
                }

                return true;
            },
            /**
             * @description 激活指定面板
             * @param {Number} id 面板序号
             * @private
             */
            _activeTab: function (id) {
                if ($.isNull(id)) {
                    this._error("_activeTab(): id is invalid[" + id + "]");
                    return;
                }

                if (id < 0 || id >= this.options.items.length) {
                    return;
                }

                var me = this;
                var options = this.options;
                var elId = "#" + me.tabListEl.find("li").eq(id).attr("id");
                var tabListEl = me.tabListEl.children("div").first();
                var targetId = $(elId).attr("target");
                var contentId = null;
                var liEl = null;
                var count = 0;
                var pId = null;

                // 第一次激活时，渲染内容
                if ($("#" + targetId).children().length === 0) {
                    me._renderItem(options.items[id], targetId);
                }

                // 去激活其它Tab
                this.tabListEl.find("li").each(function (index, item) {
                    if (!$(item).hasClass(activeClass)) {
                        return;
                    }

                    // 记录原来激活的Tab的索引
                    pId = index;

                    // 修改样式
                    $(item).removeClass(activeClass);
                    contentId = $(item).attr("target");

                    if (options.style < TAB_LEFT) {
                        $("#" + contentId).css('left', -10000);
                    }
                });

                // 激活点击的Tab
                options.activeTab = id;
                liEl = $(elId);

                if (options.style >= TAB_LEFT) {
                    me.tabListSliderEl.stop().animate({
                        "top": $(elId).position().top + tabListEl.position().top
                    }, 100, function() {
                        liEl.addClass(activeClass);
                    });
                }
                else {
                    liEl.addClass(activeClass);
                }

                // 如果激活的标签不可见，要向右滚动列表直到可见
                if (liEl.attr("visible") === "false") {
                    if (options.style < TAB_LEFT) {
                        $("#" + targetId).css('left', "");
                    }
                    else {
                        this._switchCard(targetId, 'slide');
                    }

                    while (liEl.attr("visible") === "false") {
                        count++;
                        liEl = liEl.next();
                    }

                    me._scrollList("right", count);
                }
                else if (options.style < TAB_LEFT) {
                    $("#" + targetId).css('left', "");

                    // 如果标签在右侧不可见范围内，要向左移动列表，直到完全可见
                    var offset = liEl.position().left + $.externalSize(liEl).width +
                        me.tabListEl.children("div").first().position().left - me.tabListEl.width();
                    var movedOffset = 0;

                    if (offset > 0 && me.tabListEl.width() > 0 && me.tabLeftEl.is(":visible")) {
                        liEl = me.tabListEl.find(selectorLIVisible).first();
                        while (movedOffset < offset) {
                            movedOffset += $.externalSize(liEl).width;
                            count++;
                            liEl = liEl.next();
                        }

                        me._scrollList("left", count);
                    }
                }
                else if (options.style >= TAB_LEFT) {
                    this._switchCard(targetId, 'slide');
                }

                // 显示后，调用子组件doLayout
                if ($.isFunction(options.items[id].doLayout)) {
                    options.items[id].doLayout(true);
                }

                // 记录当前激活的tab索引
                me.options.activeTab = id;

                // 事件处理
                if (pId !== id) {
                    me._onTabChange(pId, id);
                }
            },
            /**
             * 添加一个Tab项
             * @param {Object} item 待添加的项目
             * @return {Number} 添加后的索引
             * @private
             */
            _addTab: function (item) {
                var self = this;
                var options = this.options;
                var areaEl = $("<div>");
                var liEl = null;
                var spanEl1 = null;
                var spanEl2 = null;
                var title = "";
                var index = self.tabItemId++;

                // 获取title
                if ($.isPlainObject(item) && $.isNull(item.options)) {
                    item.options = $.objClone(item);
                }
                title = item.options.title;

                // 创建tab标签
                liEl = $("<li unselectable='on'></li>");
                spanEl1 = $("<span>").addClass(tabCloseClass);
                spanEl2 = $("<span>").addClass(tabSeperatorClass);

                liEl.text(title.length > MAX_TITLE_LENGTH ? title.substr(0, MAX_TITLE_LENGTH - 3) + "..." : title)
                    .attr("id", options.id + "-tab-" + index)
                    .attr("target", options.id + "-content-" + index)
                    .attr("title", title)
                    .bind("click", {"self": self}, self._onTabClick)
                    .hover(
                    function () {
                        if ($(this).hasClass(activeClass) === false) {
                            $(this).addClass(hoverClass);
                        }
                    },
                    function () {
                        $(this).removeClass(hoverClass);
                    })
                    .appendTo(self.tabListEl.find("ul"));

                // 水平标签不显示提示
                if (options.style >= 10) {
                    liEl.attr("title", null);
                }

                // 渲染按钮
                spanEl1.appendTo(liEl);
                spanEl2.appendTo(liEl);

                // 目前只支持顶部tab标签显示关闭按钮
                if (options.style < TAB_LEFT) {
                    if (options.closable === true) {
                        spanEl1.bind("click", {"self": self}, self._onTabClose);
                        liEl.bind("contextmenu", {self: self}, self._onTabContextMenu);
                    }
                    else {
                        spanEl1.hide();
                    }
                }

                // 创建组件容器
                areaEl.attr("id", options.id + "-content-" + index)
                    .addClass(tabContentClass)
                    .appendTo(this.cardSlideEl || this.cardPanelEl);

                // 隐藏方式不同
                if (options.style < 10) {
                    areaEl.css('left', -10000);
                }

                return index;
            },
            /**
             * 关闭一个标签
             * @param {Number} id 要关闭的标签的索引
             */
            _closeTab: function (id) {
                var self = this;
                var isActive = false;
                var liEl = null;
                var target = null;
                var index = id;

                // 取得标签对象
                liEl = self.tabListEl.find("li").eq(index);
                if (liEl.length === 0) {
                    return;
                }
                target = liEl.attr("target");

                // 判断是否激活态的标签
                if (liEl.hasClass(activeClass)) {
                    isActive = true;
                }

                function __close() {
                    // 删除tab标签、options.items中的对象、内容容器
                    liEl.remove();
                    try {
                        var item = self.options.items[index];
                        self.options.items.splice(index, 1);
                        if ($.isFunction(item.destroy)) {
                            item.destroy();
                        }
                    }
                    catch (e) {}
                    $("#" + target).remove();

                    // 如果关闭的标签是激活态，或只剩一个标签，需要激活下一个标签
                    if (isActive || self.options.items.length === 1) {
                        if (self.options.items.length <= index) {
                            index--;

                            // 找到非隐藏状态的下一个
                            while (index >= 0 && self.tabListEl.find("li").hasClass(invisibleClass)) {
                                index --;
                            }
                            if (index < 0) {
                                self.tabListEl.find("li").each(function(idx, obj) {
                                    if (index >= 0) {
                                        return;
                                    }
                                    if (!$(obj).hasClass(invisibleClass)) {
                                        index = idx;
                                    }
                                });
                            }
                        }
                        if (index >= 0) {
                            self._activeTab(index);
                        }
                    }

                    // 调整tabList，计算是否显示滑动按钮
                    if (self.options.style < TAB_LEFT) {
                        self._tablistLayoutHorizontal();
                    }
                    else {
                        self._tablistLayoutVertical();
                    }

                }

                if(!$.isNull(this.handlers) && !$.isNull(this.handlers['tabclosed'])){
                    this.handlers['tabclosed'].call(this.treeEl, new Event('tabclosed'), self.options.items[index]);
                }

                // 启动动画
                if (index < self.options.items.length - 1 && self.options.items.length > 1) {
                    liEl.animate({
                        "width": "0px",
                        "opacity": 0
                    }, {
                        duration: 200,
                        complete: __close
                    });
                }
                else {
                    // 如果是最右侧的标签，不需要动画效果
                    __close();
                }
            },
            /**
             * 鼠标滚轮事件，滚动tab标签
             * @param {Object} event 滚轮事件对象
             * @param {Object} data 事件数据，其中delta表示滚动方向和偏移
             * @private
             */
            _wheelScrollList: function (event, data) {
                var delta = data.delta;

                if (delta > 0) {
                    if (this.tabLeftEl.hasClass(invisibleClass) === false) {
                        this._onLeftClick();
                    }
                }
                else {
                    if (this.tabRightEl.hasClass(invisibleClass) === false) {
                        this._onRightClick();
                    }
                }
            },
            /**
             * 移动标签列表
             * @param {String} dir 方向
             * @param {Number} count 移动tab个数
             * @private
             */
            _scrollList: function (dir, count) {
                var self = this;
                var listEl = null;
                var liEl = null;
                var offsetX = 0;
                var offsetY = 0;
                var tabEl = null;
                var i = 0;
                var factor = -1;

                // 待移动的容器
                listEl = self.tabListEl.children("div").first();

                // 设置可见性
                if (dir === "left") {
                    tabEl = listEl.find(selectorLIVisible).first();
                    while (tabEl.length !== 0 && i < count) {
                        tabEl.attr("visible", "false");
                        tabEl = tabEl.next();
                        i++;
                    }
                }
                else {
                    tabEl = listEl.find(selectorLIInvisible).last();
                    while (tabEl.length !== 0 && i < count) {
                        tabEl.attr("visible", "true");
                        tabEl = tabEl.prev();
                        i++;
                    }
                }

                // 计算列表新的偏移
                liEl = listEl.find(selectorLIVisible).first();
                if (liEl.length > 0) {
                    if (this.options.style < TAB_LEFT) {
                        offsetX = liEl.position().left;
                        offsetX = offsetX * factor;
                    }
                    else {
                        offsetY = liEl.position().top;
                        offsetY = offsetY * factor;
                    }

                    // 以Slide动画效果移动容器
                    listEl.stop().animate({
                        "left": offsetX + "px",
                        "top": offsetY + "px"
                    }, {
                        duration: 200,
                        complete: function () {
                            // 左侧标签需要动态调整按钮状态
                            if (self.options.style >= 10) {
                                self._tablistLayoutVertical();
                            }

                            // 如果按住按钮，持续滚动
                            if (self.leftPushing) {
                                self._onLeftClick();
                            }
                            else if (self.rightPushing) {
                                self._onRightClick();
                            }
                        }
                    });

                    // 左侧标签，激活的标签的背景跟随移动
                    if (self.options.style >= TAB_LEFT) {
                        if (listEl.find("li." + activeClass).length > 0) {
                            this.tabListSliderEl.stop().animate({
                                "top": listEl.find("li." + activeClass).first().position().top + offsetY
                            }, 200);
                        }
                    }
                }
            },
            /**
             * @description 切换容器区
             * @param {String} domId 容器的ID
             * @param {String} animation 切换效果
             * @private
             */
            _switchCard: function (domId, animation) {
                var offsetY = 0;

                var target = $("#" + domId);

                // 滑动效果
                if (animation === 'slide') {
                    if (this.cardSlideEl === null) {
                        return;
                    }

                    offsetY = target.position().top;

                    // 滑动
                    this.cardSlideEl.animate({
                        'top': -offsetY
                    }, {
                        duration: 300,
                        easing: "easeOutCirc"
                    });
                }
                else {
                    this._error("animation effect is not supported: " + animation);
                    return;
                }

                return;
            },
            /**
             * @private
             * @desc 切换tab页
             */
            _onTabClick: function (event) {
                var self = event.data.self,
                    me = $(this);

                // 取序号
                var id = 0;
                var elId = me.attr("id");
                self.tabListEl.find("li").each(function (index, item) {
                    if ($(item).attr("id") === elId) {
                        id = index;
                    }
                });

                // 激活tab
                self._activeTab(id);
            },
            /**
             * 点击左箭头，向右滚动
             * @private
             */
            _onLeftClick: function () {
                var self = this;

                if (self.tabListEl.find(selectorLIInvisible).length > 0) {
                    self._scrollList("right", 1);
                }
            },
            /**
             * 点击右箭头，向左滚动
             * @private
             */
            _onRightClick: function () {
                var self = this;
                var visibleWidth = 0;
                var visibleHeight = 0;

                // 计算可见宽度
                self.tabListEl.find(selectorLIVisible).each(function (index, item) {
                    visibleWidth += $(item).externalWidth();
                    visibleHeight += $(item).externalHeight();
                });

                // 动画隐藏第一个可见元素
                if ((self.options.style < TAB_LEFT && visibleWidth > self.tabListEl.width()) ||
                    (self.options.style >= TAB_LEFT && visibleHeight > self.tabListEl.height())) {
                    self._scrollList("left", 1);
                }
            },
            /**
             * 显示所有标签列表
             * @param event
             * @private
             */
            _onAllClick: function (event) {
                var self = event.data.self;
                var htmlDiv = "<div><ul></ul></div>";
                var htmlLi = "<li>";
                var menuEl = $(htmlDiv);
                var srcItem = self.tabAllEl;
                var liEl = null;
                var left = 0;
                var top = 0;

                // 添加项目
                self.tabListEl.find("li").each(function (index, item) {
                    if ($(item).hasClass(invisibleClass)) {
                        return;
                    }

                    liEl = $(htmlLi).text($(item).text())
                        .attr("target", item.id)
                        .attr("index", index)
                        .appendTo(menuEl.children("ul"));

                    if ($(item).hasClass(activeClass)) {
                        liEl.addClass(activeClass);
                    }
                });

                // 样式处理，渲染到页面
                menuEl.addClass(tabAllListClass).appendTo("body");

                // 放置到合适位置
                left = srcItem.offset().left + srcItem.outerWidth() - menuEl.outerWidth();
                top = self.cardPanelEl.offset().top - 5;
                menuEl.css("top", top + "px").css("left", left + "px");

                function itemClicked(event) {
                    var target = event.target;

                    // 点击菜单背景，不需处理
                    if (target === menuEl[0] || target === menuEl.children("ul")[0]) {
                        return;
                    }

                    // 如果点击菜单项，转到对应的tab页
                    menuEl.find("li").each(function (index, item) {
                        if (item === target) {
                            self._activeTab(parseInt($(item).attr("index"), 10));
                        }
                    });

                    // 关闭菜单
                    menuEl.remove();
                    $("body").unbind("click", itemClicked);
                }

                // 事件处理
                $("body").bind("click", {self: self}, itemClicked);

                // 停止冒泡，避免itemClicked立即被调用
                return false;
            },
            /**
             * Tab标签上点击右键弹出上下文菜单
             * @param event
             * @private
             */
            _onTabContextMenu: function (event) {
                var self = event.data.self;
                var liEl = $(event.currentTarget);
                var id = liEl.attr("id");
                var index = -1;
                var tabCount = 0;
                var menuId = self.options.id + "-tab-contextmenu";

                // 确定tab索引
                self.tabListEl.find("li").each(function (idx, item) {
                    if ($(item).attr("id") === id) {
                        index = idx;
                    }
                    tabCount++;
                });

                if (index < 0) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();

                // 操作函数
                // 关闭当前标签
                function __closeCurrent() {
                    self._closeTab(index);
                }

                // 关闭其它标签
                function __closeOthers() {
                    self._activeTab(index);
                    var liList = self.tabListEl.find("li");

                    for (index = liList.length - 1; index >= 0; index--) {
                        if ($(liList.get(index)).attr("id") !== id) {
                            self._closeTab(index);
                        }
                    }

                    // 滚动列表到最开始
                    self._scrollList("right", 65535);
                }

                // 关闭所有标签
                function __closeAll() {
                    self._activeTab(0);
                    var liList = self.tabListEl.find("li");

                    // 从右侧关闭
                    for (index = liList.length - 1; index >= 0; index--) {
                        self._closeTab(index);
                    }

                    // 滚动列表到最开始
                    self._scrollList("right", 65535);
                }

                // 显示菜单
                var menuItems = [
                    {
                        "value": "1",
                        "text": Sweet.core.i18n.tab.menu.closeCurrent
                    }
                ];

                if (tabCount > 1) {
                    menuItems.push({
                        "value": "2",
                        "text": Sweet.core.i18n.tab.menu.closeOthers
                    });
                    menuItems.push({
                        "value": "3",
                        "text": Sweet.core.i18n.tab.menu.closeAll
                    });
                }

                if (!$.isNull(self.tabMenuEl)) {
                    try {
                        self.tabMenuEl.destroy();
                    }
                    catch (e) {
                    }
                }
                if ($("#" + menuId).length === 0) {
                    $("<div>").attr("id", menuId).appendTo("body");
                }

                self.tabMenuEl = new Sweet.menu.Menu({
                    renderTo: menuId,
                    X: event.clientX,
                    Y: event.clientY,
                    items: menuItems,
                    itemClick: function (evt, data) {
                        if (data.value === "1") {
                            __closeCurrent();
                        }
                        else if (data.value === "2") {
                            __closeOthers();
                        }
                        else if (data.value === "3") {
                            __closeAll();
                        }
                    }
                });

                return false;
            },
            /**
             * @private
             * @desc 关闭tab页
             */
            _onTabClose: function (event) {
                var self = event.data.self;

                // 阻止事件冒泡
                event.stopPropagation();

                var liEl = $(event.currentTarget).parent();
                var index = 0;

                // 取得序号
                self.tabListEl.find("li").each(function (i, item) {
                    if ($(item).attr("id") === liEl.attr("id")) {
                        index = i;
                    }
                });
                // 关闭
                self._closeTab(index);
                return;
            },
            /**
             * 子类实现标准的添加子组件接口
             * @param {Object/Array} items 子组件（列表）
             * @private
             */
            _addItems: function (items) {
                var me = this;
                var i;
                var j;
                var id;
                var item;

                // 添加
                for (i = 0; i < items.length; i++) {
                    // 取新增item的id，考虑自定义对象的情况
                    if ($.isPlainObject(items[i])) {
                        id = items[i].id;
                    }
                    else {
                        id = items[i].options.id;
                    }

                    // 如果item.options.id重复，取得重复的索引
                    for (j = 0; j < me.options.items.length; j++) {
                        item = me.options.items[j];
                        if (item.options.id === id) {
                            break;
                        }
                    }

                    // 如果发现重复的ID，只需要激活重复的tab页
                    if (j < me.options.items.length) {
                        me._activeTab(j);
                    }
                    else {
                        me.options.items = me.options.items.concat(items[i]);
                        me._addTab(items[i]);

                        // 激活新增的第一个
                        if (i === 0) {
                            me._activeTab(me.options.items.length - 1);
                        }
                    }
                }
            },
            /**
             * @description 动态删除指定索引的tab
             * @param {Array} items 索引
             * @private
             */
            _removeItems: function (items) {
                var me = this;
                var id;
                var i;

                // 如果输入参数为空，删除所有
                if ($.type(items) === "undefined") {
                    // 删除所有
                    for (i = me.options.items.length - 1; i >= 0; i--) {
                        me._closeTab(i);
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
                    this._closeTab(id);
                }
            },
            /**
             * @description tab标签切换事件
             * @param {Number} ptab 切换前的Tab索引
             * @param {Number} tab 切换后的Tab索引
             * @private
             */
            _onTabChange: function (ptab, tab) {
                var me = this;
                var tab1 = null;
                var tab2 = null;
                var tabs = me.options.items;
                var liEl = null;
                var iframe = null;

                if ($.type(ptab) === 'number' && ptab >= 0 && ptab < tabs.length) {
                    tab1 = tabs[ptab];
                }
                if ($.type(tab) === 'number' && tab >= 0 && tab < tabs.length) {
                    tab2 = tabs[tab];
                }

                // 如果内部是iframe，调用缺省的接口，通知iframe激活或去激活
                if (tab1 !== null && tab1.url) {
                    liEl = me.tabListEl.find("li").eq(ptab);
                    iframe = $("#" + liEl.attr("target")).children("iframe");
                    if (iframe.length > 0) {
                        try {
                            iframe.get(0).contentWindow.tabDeactivated();
                        }
                        catch (e) {}
                    }
                }
                if (tab2 !== null && tab2.url) {
                    liEl = me.tabListEl.find("li").eq(tab);
                    iframe = $("#" + liEl.attr("target")).children("iframe");
                    if (iframe.length > 0) {
                        try {
                            iframe.get(0).contentWindow.tabActivated();
                        }
                        catch (e) {}
                    }
                }

                // 处理注册的事件回调
                if ($.isNull(me.handlers)) {
                    return;
                }

                if ($.isFunction(me.handlers.tabchanged)) {
                    me.handlers.tabchanged(tab1, tab2);
                }
            },
            /**
             * @description 绑定注册的事件到Dom
             * @private
             */
            _addListener: function () {
                // 目前只有一个tabchange事件，不需要绑定到具体的Dom对象
            },
            /**
             * @description 解除已绑定的事件
             * @param eventName
             * @private
             */
            _removeListener: function (eventName) {
                eventName = eventName;
                // 目前只有一个tabchange事件，不需要绑定到具体的Dom对象
            },
            /**
             * @description 显示标签
             * @param {String/Number} id 子组件ID
             * @private
             */
            _showItem: function (id) {
                var index = -1;

                // 根据id查找
                if ($.type(id) === 'string') {
                    index = this._getIndexById(id);
                }
                else if ($.type(id) === "number") {
                    index = id;
                }
                else {
                    $.error("hideItem指定的参数不正确");
                    return;
                }

                if (index < 0 || index >= this.options.items.length) {
                    return;
                }

                // 显示
                this.tabListEl.find("li").eq(index).removeClass("invisible");
            },
            /**
             * @description 隐藏标签
             * @param {String/Number} id 子组件ID
             * @private
             */
            _hideItem: function (id) {
                var index = -1;

                // 根据id查找
                if ($.type(id) === 'string') {
                    index = this._getIndexById(id);
                }
                else if ($.type(id) === "number") {
                    index = id;
                }
                else {
                    $.error("hideItem指定的参数不正确");
                    return;
                }

                if (index < 0 || index >= this.options.items.length) {
                    return;
                }

                // 如果要隐藏的tab是激活状态，激活其它tab
                if (index === this.getActiveTab()) {
                    if (index > 0) {
                        this.setActiveTab(index - 1);
                    }
                    else {
                        this.setActiveTab(index + 1);
                    }
                }

                // 隐藏
                this.tabListEl.find("li").eq(index).addClass("invisible");
            },
            /**
             * @description 根据子组件ID，取得索引
             * @param {String} id 组件id
             * @private
             */
            _getIndexById: function (id) {
                var i, item;

                for (i = 0; i < this.options.items.length; i++) {
                    item= this.options.items[i];
                    if ((item.options && item.options.id === id) || (item.id && item.id === id)) {
                        return i;
                    }
                }
                return -1;
            },
            /**
             * @event
             * @description Tab标签切换事件
             * @name Sweet.panel.TabPanel#tabchanged
             * @param {Object} ptab 切换前的tab对象
             * @param {Object} ntab 切换后的tab对象
             */
            tabchanged: function (ptab, ntab) {
                $.log(ptab + "," + ntab);
            }
        });

    /**
     * @description Tab布局容器
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
     * 创建Tab布局容器：
     * var sweetTabPanel = Sweet.panel.TabPanel({
     * });
     */
    Sweet.panel.TabPanel = $.sweet.widgetContainerTabpanel;
}(jQuery) );

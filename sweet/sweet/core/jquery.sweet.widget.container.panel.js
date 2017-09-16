/**
 * @fileOverview  
 * <pre>
 * 容器组件-面板
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var defaultPanelTitleClass = "sweet-panel-title";
    var toolsContainerClass = "sweet-panel-tools";
    var panelTitleInfoClass = "sweet-panel-info";
    var toggleIconClass = "sweet-panel-toggle-icon";
    var titleLabelClass = "sweet-panel-title-label";
    var expandedClass = "expanded";
    var collapsedClass = "collapsed";

    $.widget("sweet.widgetContainerPanel", $.sweet.widgetContainer, /** @lends Sweet.container.Panel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-panel]:",
        type: "gridPanel",
        options: /** @lends Sweet.container.Panel.prototype*/{
            /**
             * 是否创建标题
             * @type Boolean
             * @default false
             */
            header: false,
            /**
             * panel标题文本
             * @type String
             * @default ""
             */
            title: "",
            /**
             * panel标题tip文本
             * @type String
             * @default null
             */
            titleTips: null,
            /**
             * 在标题栏右侧显示的组件列表
             * @type Array
             * @default []
             */
            tools: [],
            /**
             * 标题栏样式, 从1开始，奇数有背景，下一个偶数背景透明
             * @type Number
             * @default 1
             */
            headerStyle: 1,
            /**
             * 直接显示的HTML内容，不能与item同时配置
             * @type String
             * @default ""
             */
            html: "",
            /**
             * 子组件数组
             * @type Array
             * @default []
             */
            items: []
        },
        /**
         * 动态设置标题栏标题
         * @param {String} title 标题文本
         * @param {String} titleTips 标题提示文本,如果不设置则用历史TIP,如果设置为false则不提示
         */
        setTitle: function(title, titleTips) {
            // 在没有标题栏的情况下，设置标题无效
            if (!this.options.header) {
                return;
            }
            var titleEl = this.panelTitleEl.find("." + titleLabelClass);
            // 记录标题
            if ($.isNull(title)) {
                title = "";
            }
            titleEl.removeAttr("title");
            this.options.title = title;
            if (titleTips) {
                this.options.titleTips = titleTips;
            } else {
                if (false === titleTips) {
                    this.options.titleTips = null;
                }
            }
            if (this.options.titleTips) {
                if (true === this.options.titleTips || "true" === this.options.titleTips) {
            // 更新文本
                    titleEl.text(title).attr("title", title);
                } else {
                    titleEl.text(title).attr("title", this.options.titleTips);
                }
            }
            // 更新文本
            titleEl.text(title);
        },
        /**
         * 获取内部所有Form类组件的值
         * @return {Object}
         */
        getFormData: function () {
            var me = this;
            var data = {};
            var name;
            var value;

            // 组件列表
            var widgets = me._getFormWidgets();
            $.each(widgets, function (i, widget) {
                if ($.isNull(widget.options.name)) {
                    me._info("Form widget " + widget.options.id + " has no 'name' attribute");
                    return;
                }

                name = widget.options.name;
                value = widget.getValue();

                data[name] = value;
            });

            return data;
        },
        /**
         * 设置内部Form组件的值
         * @param {Object} data 组件的值
         */
        setFormData: function (data) {
            var me = this;
            var name;
            var value;
            var widgets;

            // 组件列表
            widgets = me._getFormWidgets();
            $.each(widgets, function (i, widget) {
                name = widget.options.name;
                value = data[name];

                if (typeof value === "undefined") {
                    return;
                }
                else if ($.isFunction(widget.setValue)) {
                    try {
                        widget.setValue(value);
                    }
                    catch (e) {
                        me._info("Widget " + widget.options.id + " setValue failed");
                    }
                }
            });

            return;
        },
        /**
         * @description 校验内部所有Form组件
         * @return {Boolean}
         */
        validateForm: function () {
            var me = this;
            var flag = true;
            var ret;

            var widgets = me._getFormWidgets();
            for (var i = 0; i < widgets.length; i++) {
                if ($.isFunction(widgets[i].check)) {
					//disabled状态的组件不进行校验
					if($.isFunction(widgets[i].getDisabled) && widgets[i].getDisabled()){
						continue;
					}
                    try {
                        ret = widgets[i].check();
                        if (ret === false) {
                            flag = false;
                        }
                    }
                    catch (e) {
                        me._info("widget " + widgets[i].sweetWidgetName + " check throw exception.");
                    }
                }
            }

            return flag;
        },
        /**
         * @description 动态添加组件
         * @param {Object/Array} items 组件对象或组件对象数组
         */
        addItems: function(items) {
            var me = this;
            var tempItems;

            // 如果之前是渲染的HTML，则不允许动态增加Items
            if (me.options.html !== "" && me.options.items.length === 0) {
                me._error("Cannot add items while initialized by HTML");
                return;
            }

            // 检查输入参数
            if ($.isArray(items)) {
                tempItems = items;
            } else if ("object" === typeof items) {
                tempItems = [];
                tempItems.push(items);
            } else {
                me._error("Unsupport data type: " + typeof items);
                return;
            }

            // 如果还没有渲染，缓存item，待渲染后再添加
            if (!me.rendered) {
                if ($.isNull(me._itemBufferBeforeRender)) {
                    me._itemBufferBeforeRender = [];
                }
                me._itemBufferBeforeRender = me._itemBufferBeforeRender.concat(items);
                return;
            }

            // 调用子类实现
            me._addItems(tempItems);
            me._doLayout();
        },
        /**
         * @description 动态添加组件，子类继承实现
         * @private
         */
        _addItems: $.noop,
        /**
         * @description 动态删除组件
         * @param items
         */
        removeItems: function (items) {
            var me = this;
            var tempItems;

            // 检查输入参数
            if (typeof items === "undefined") {
                tempItems = null;
            }
            else if ($.isArray(items)) {
                tempItems = items;
            }
            else {
                tempItems = [];
                tempItems.push(items);
            }
            //清空缓存
            if (tempItems === null && me._itemBufferBeforeRender) {
                me._itemBufferBeforeRender = null;
            }
            // 调用子类实现
            if (tempItems === null) {
                me._removeItems();
            }
            else {
                me._removeItems(tempItems);
            }

            me._doLayout();
        },
        /**
         * @description 动态删除组件，子类继承实现
         * @private
         */
        _removeItems: $.noop,
        /**
         * 显示Item
         * @param {String} item 子组件id
         */
        showItem: function (item) {
            "use strict";
            this._showItem(item);
        },
        /**
         * @description 显示子组件，子类继承实现
         * @private
         */
        _showItem: $.noop,
        /**
         * 隐藏Item
         * @param {String} item 子组件id
         */
        hideItem: function (item) {
            "use strict";
            this._hideItem(item);
        },
        /**
         * @description 隐藏子组件，子类继承实现
         * @private
         */
        _hideItem: $.noop,
        /**
         * @description 设置content的HTML内容
         * @param {String} html HTML内容
         */
        setHTML : function (html) {
            // 仅在当前Items不为空时，才允许设置HTML
            if (this.options.items.length === 0) {
                this.panelContentEl.html(html);
            }
        },
        /**
         * 折叠面板，只显示标题栏
         */
        collapse: function () {
            // 隐藏content
            this.containerHeight = this.containerEl.externalHeight();
            this.panelContentEl.hide();
            this.containerEl.externalHeight(this.panelTitleEl.externalHeight());

            // 调整标题栏样式
            var spanEl = this.panelTitleEl.find("span." + toggleIconClass);
            spanEl.removeClass(expandedClass).addClass(collapsedClass);

            this._expanded = false;

            // 回调
            if ($.isFunction(this.options.toggle)) {
                this.options.toggle(false);
            }
        },
        /**
         * 展开面板
         */
        expand: function () {
            // 展开content
            this.panelContentEl.show();
            this.containerEl.externalHeight(this.containerHeight);

            // 调整标题栏样式
            var spanEl = this.panelTitleEl.find("span." + toggleIconClass);
            spanEl.removeClass(collapsedClass).addClass(expandedClass);

            this._expanded = true;

            // 刷新布局
            this.doLayout(true);
            this._layoutChildren(true);

            // 回调
            if ($.isFunction(this.options.toggle)) {
                this.options.toggle(true);
            }
        },
        /**
         * @private
         * @description 创建容器
         */
        _createContainer: function() {
            var me = this,
                    options = this.options;
            // 创建面板标题
            if (options.header) {
                me._createPanelTitle();
            }
            // 创建面板内容
            me._createPanelContent();

            // 有Items配置时，不处理HTML配置
            if (options.items.length === 0 && options.html !== "") {
                me.panelContentEl.html(options.html);
            }

            // 冻结子组件，避免在创建时自动调用doLayout
            this._freezeChildren(true);
        },
        /**
         * @description 创建标题栏自定义工具
         * @private
         */
        _createPanelTools: function () {
            var tools = this.options.tools;

            if ($.isNull(tools) || tools.length === 0) {
                return;
            }

            // 创建水平容器
            this.panelToolsEl = $("<div>");
            this.panelToolsEl.attr("id", this.options.id + "-tools")
                .addClass(toolsContainerClass)
                .appendTo(this.panelTitleEl);
        },
        /**
         * @description 渲染标题栏工具
         * @private
         */
        _renderPanelTools: function () {
            if (this.panelToolsContainer || $.isNull(this.panelToolsEl)) {
                return;
            }

            // 创建容器
            this.panelToolsContainer = new Sweet.panel.HPanel({
                itemExtend: false,
                align: "right",
                verticalAlign: "bottom",
                items: this.options.tools,
                renderTo: this.panelToolsEl.attr("id"),
                width: "auto",
                height: "100%", 
                margin: [0, 5, 0, 0]
            });
        },
        /**
         * @description 刷新工具布局
         * @private
         */
        _layoutPanelTools: function () {
            if ($.isNull(this.panelToolsContainer) || $.isNull(this.panelToolsEl)) {
                return;
            }

            // 刷新布局
            this.panelToolsContainer.doLayout();
        },
        /**
         * @private
         * @description 创建面板标题
         */
        _createPanelTitle: function() {
            var me = this;

            // 不允许同时配置Fieldset和Panel的Label，前者优先级更高
            if (me.options.fieldset) {
                return;
            }

            var options = me.options;
            var titleClass = defaultPanelTitleClass + " title-style-" + this.options.headerStyle;
            var panelTitleEl = me.panelTitleEl = $("<div>").addClass(titleClass);

            // 创建工具栏（先创建工具栏，使其z-index小于标题文本）
            this._createPanelTools();

            // 创建标题
            var infoEl = $("<div>").addClass(panelTitleInfoClass).appendTo(panelTitleEl);

            // 展开折叠按钮
            if (options.collapsible) {
                var spanEl = $("<span>").addClass(toggleIconClass).appendTo(infoEl).append($("<i>"));
                spanEl.addClass(expandedClass);

                // 绑定事件
                spanEl.bind("click", {self: me}, function () {
                    var span = $(this);

                    if (span.hasClass(expandedClass)) {
                        me.collapse();
                    }
                    else {
                        me.expand();
                    }
                });
            }
            if (this.options.titleTips) {
                if (true === this.options.titleTips || "true" === this.options.titleTips) {
                    // 更新文本
                    $("<label>").html(this.options.title).attr("title", this.options.title).addClass(titleLabelClass).appendTo(infoEl);
                } else {
                    $("<label>").html(this.options.title).attr("title", this.options.titleTips).addClass(titleLabelClass).appendTo(infoEl);
                }
            } else {
            // 标题文本
            $("<label>").html(this.options.title).addClass(titleLabelClass).appendTo(infoEl);
            }
        },
        /**
         * @private
         * @description 创建布局，子类继承实现
         */
        _createPanelContent: $.noop,
        /**
         * @description 渲染组件，只处理panel公共内容
         * @private
         */
        _widgetRender: function () {
            if (this.panelTitleEl) {
                this.panelTitleEl.appendTo(this.containerEl);
            }
            this.panelContentEl.appendTo(this.containerEl);

            // 渲染tools
            this._renderPanelTools();

            // 折叠面板
            if (this.options.collapse) {
                this.collapse();
            }
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            if (this.panelToolsContainer) {
                this.panelToolsContainer.destroy();
            }

            this._super();
        },
        /**
         * @description 刷新布局，子类继承实现，并调用super
         * @private
         */
        _doLayout: function () {
            var me = this;
            var contentWidth;
            var contentHeight;
            var items;

            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }

            // 渲染缓存的子组件
            if ($.isArray(me._itemBufferBeforeRender)) {
                items = me._itemBufferBeforeRender;
                me._itemBufferBeforeRender = null;
                me.addItems(items);
            }

            // 刷新工具栏布局
            this._layoutPanelTools();

            // 修正Content区域高度
            if (!$.isNull(me.panelTitleEl)) {
                contentWidth = me.containerEl.width();
                contentHeight = me.containerEl.height() - me.panelTitleEl.externalHeight();
            }
            else if (!$.isNull(me.fieldsetEl)) {
                var fsContentEl = me.fieldsetEl.children("div").first();
                var fsTitleEl = fsContentEl.children("div").first();

                fsContentEl.externalHeight(me.fieldsetEl.height());
                me.containerEl.externalWidth(fsContentEl.width());
                me.containerEl.externalHeight(fsContentEl.height() - fsTitleEl.externalHeight());

                contentWidth = me.containerEl.width();
                contentHeight = me.containerEl.height();
            }
            else {
                contentWidth = me.containerEl.width();
                contentHeight = me.containerEl.height();
            }

            // 修正折叠高度
            if (this._expanded === false) {
                this.containerEl.externalHeight(this.panelTitleEl.externalHeight());
            }

            // 设置Content区域大小
            if (me.panelContentEl && !me.panelContentEl.is(":hidden")) {
                me.panelContentEl.externalWidth(contentWidth);
                me.panelContentEl.externalHeight(contentHeight);
            }

            // 解除对子组件的冻结
            this._freezeChildren(false);
        },
        /**
         * @description 递归获取内部所有Form类的Widgets对象
         * @return {Array} 对象数组
         * @private
         */
        _getFormWidgets: function () {
            var me = this;
            var widgets = [];
            var item;

            // 获取所有子组件
            me.panelContentEl.find("*").each(function (i, dom) {
                if ($.isNull(dom.id)) {
                    return;
                }

                // 确保是Sweet组件
                item = Sweet._widgets[dom.id];
                if ($.isNull(item)) {
                    return;
                }

                // 确保是Form组件
                if (item.widgetClass !== "sweet.widgetForm") {
                    return;
                }

                widgets.push(item);
            });

            return widgets;
        },
        /**
         * 冻结子组件，不允许执行doLayout
         * @param {Boolean} flag 标志
         * @private
         */
        _freezeChildren: function (flag) {
            "use strict";

            if (flag && this.__childrenIsFrozen) {
                return;
            }
            else if (!flag && !this.__childrenIsFrozen) {
                return;
            }
            else {
                this.__childrenIsFrozen = flag;
            }

            if (!$.isArray(this.options.items)) {
                return;
            }

            var item;
            for (var i = 0; i < this.options.items.length; i++) {
                item = this.options.items[i];
                if (item && $.isFunction(item._freeze)) {
                    item._freeze(flag);
                }
            }
        }
    });
    /**
     * @description 所有Panel的基类，不能直接使用
     * @class
     * @extends Sweet.container
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * </pre>
     */
    Sweet.container.Panel = $.sweet.widgetContainerPanel;
}(jQuery));

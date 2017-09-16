/**
 * @fileOverview
 * <pre>
 * DashboardWidget组件-portal
 * 2013/2/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 * @history zhanglie@2013/4/20 重构适应Sweet风格
 */

(function ($, undefined) {
    "use strict";

    var containerClass = "sweet-widgetpanel-container",         //外部盒子div样式
        titleClass = "sweet-widgetpanel-title",                 //标题div样式
        toolsClass = "sweet-widgetpanel-tools",                 // 工具组
        contentClass = "sweet-widgetpanel-content",             // 内容区域
        titleTextClass = "sweet-widgetpanel-header",            // 标题文本
        stateClass = "sweet-widgetpanel-state",
        alwaysShowToolClass = "sweet-widgetpanel-tools-always-show",
        arrowClass = "sweet-widgetpanel-arrow",
        widgetPanelUlParentClass = "sweet-widgetpanel-ulParent",
        widgetPanelSelectWinRadio = "sweet-widgetpanel-selectWinRadio",
        increments = 0;

    var toolItemWidth = 21; // 每个工具按钮占用的宽度

    $.widget("sweet.widgetpanel", $.sweet.widget, /** @lends Sweet.WidgetPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-widgetpanel]",
        eventNames: /** @lends Sweet.WidgetPanel.prototype*/{
            /**
             * @event
             * @description 工具按钮点击事件
             */
            tool: "工具按钮点击事件",
            /**
             * @event
             * @description 切换标题事件
             */
            switchTitle: "切换标题事件"
        },
        type: "WidgetPanel",
        //panel 类输入组件公共配置参数
        options: /** @lends Sweet.WidgetPanel.prototype*/{
            /**
             * 组件宽度
             * @type Number/String
             * @default '100%'
             */
            width: '100%',
            /**
             * 组件高度
             * @type Number/String
             * @default '100%'
             */
            height: '100%',
            /**
             * 组件标题
             * @type String/Array
             * @default ''
             */
            panelTitle: '',
            /**
             * 工具栏图标，现在只支持setting、close
             * @type Array
             * @default ['zoom','refresh', 'setting', 'close']
             */
            tools: ['zoom','refresh', 'setting', 'close'],
            /**
             * 工具栏图标是否自动隐藏，鼠标移上去后再显示出来
             * @type Boolean
             * @default true
             */
            autoHideTools: true,
             /**
             * 标题是否可切换
             * @type Boolean
             * @default false
             */
            switchable : false,
            /**
             * 子组件
             * @type Array
             * @default null
             */
            items: null
        },
        /**
         * @description 更新工具按钮
         * @param {Array} tools 工具名称数组
         * @param {Boolean} autoHide 是否自动隐藏
         */
        updateTools : function(tools, autoHide){
            var me = this;
            var tool, toolEl;
            var tools2Show = [], tools2Hide = [];

            if(!me.toolsEl) {
                return;
            }

            if (tools !== null) {
                // 根据新列表刷新按钮显示状态
                var count = 0;
                me.toolsEl.children().each(function(index, el) {
                    toolEl = $(el);
                    tool = toolEl.attr("tool");
                    if (tools.indexOf(tool) >= 0) {
                        count++;
                        toolEl.show();
                    }
                    else {
                        toolEl.hide();
                    }
                });
                
                // 如果所有工具都不显示，隐藏整个工具栏
                if (count > 0) {
                    me.toolsEl.css("opacity", ""); // 用透明度来实现，避免和setState冲突
    
                    // 个数变化后，重新计算按钮区域宽度
                    me.toolsEl.width(count * toolItemWidth);
                }
                else {
                    me.toolsEl.css("opacity", "0");
                }
            }

            // 是否自动隐藏
            if (autoHide === true) {
                me.options.autoHideTools = autoHide;
                me.toolsEl.removeClass(alwaysShowToolClass);
            }
            else if (autoHide === false) {
                me.options.autoHideTools = autoHide;
                me.toolsEl.addClass(alwaysShowToolClass);
            }
        },
        /**
         * @description 修改组件标题文本
         * @param title
         */
        setTitle: function(title) {
            if ($.isNull(title)) {
                return;
            }
            
            var text = "";
            if (Array.isArray(title)) {
                title.forEach(function(item) {
                    if (item.isDefault) {
                        text = item.text;
                    }
                });
                this.list.setData(title);
                this._listDoLayout();
            } else {
                text = title;
            }

            this.titleEl.find(">em").attr("title", text).text(text);
            this.options.panelTitle = title;
            
            this.list.setValue({"text" : text ,"value" : text});
        },
                
        /**
         * @param switchable
         * @description 切换标题功能的开关
         */        
        setSwitchable : function(switchable) {
            var me = this;
            
            if (switchable === true) {
                me.downArrow.show();
                me._downArrowHide = false;
            } else if (switchable === false) {
                me.downArrow.hide();
                me._downArrowHide = true;
            }
            me._listDoLayout();
        },
        _getCanvasObject : function(){
            var me = this,
                    result = null,
                    opt = me.options,
                    item = opt.items[0];
            if($.isNotNull(item) && $.isFunction(item.getCanvasObject)){
                result = item.getCanvasObject();
            }
            return result;
        },
        /**
         * @private
         * @description 创建widgetpanel模板
         */
        _createSweetWidget: function () {
            var me = this,
                i18n = Sweet.core.i18n.widgetPanel,
                panelTitle = me.options.panelTitle,
                    title = "",
                    valueTitle = null;

            if (me.options.items === null) {
                me.options.items = [];
            }

            if (Array.isArray(panelTitle)) {
                panelTitle.forEach(function(item) {
                    if (item.isDefault) {
                        title = item.text;
                        valueTitle = $.objClone(item);
                    }
                });
            } else {
                title = panelTitle;
            }

            // 一级容器
            me.container = $("<div>").attr("id", me.options.id).addClass(containerClass);

            // 标题栏
            var titleEl = me.titleEl = $("<div>");
            titleEl.addClass(titleClass).appendTo(me.container);

            // 标题文本
            var headerEl = me.headerEl = $("<em>");
            headerEl.text(title).addClass(titleTextClass).appendTo(titleEl).attr("title", title);

            //标题下拉箭头
            var downArrow = me.downArrow = $("<span>");
            downArrow.addClass(arrowClass)
                    .bind("click", {"me": me}, me._showDropDownList)
                    .appendTo(titleEl);
            me._downArrowHide = false;
            if (!Array.isArray(panelTitle) || !me.options.switchable) {
                downArrow.hide();
                me._downArrowHide = true;
            }
             
            //Dashboard有可能创建不带tools的组件
            var toolsEl = me.toolsEl = $("<div>");
            toolsEl.addClass(toolsClass).appendTo(titleEl);
            // 工具栏
            if ($.isArray(me.options.tools) && me.options.tools.length > 0) {
                $.each(me.options.tools, function (index, tool) {
                    $("<span>").addClass(tool).attr("title", i18n[tool] || "").attr("tool", tool).appendTo(toolsEl);
                });

                toolsEl.width(toolItemWidth * me.options.tools.length);

                if (!me.options.autoHideTools) {
                    toolsEl.addClass(alwaysShowToolClass);
                }
            }

            // 状态图标
            me.stateEl = $("<div><span></span></div>").addClass(stateClass).appendTo(titleEl).hide();

            // 内容
            var contentEl = me.contentEl = $("<div>");
            contentEl.addClass(contentClass).attr('id', me.options.id + "-content").appendTo(me.container);
            
            //创建下拉框
            var dropDownElId = "widgetPanelDropdown" + increments++,
                dropDownEl = me.dropDownEl = $("<div>").attr({"tabindex": -1})
                .hide()
                .appendTo("body");
            
            $("<div>").attr({"id": dropDownElId})
                      .appendTo(dropDownEl).addClass(widgetPanelUlParentClass);
            
            var list = me.list = new Sweet.list.OptimizeList({
                multi: false,
                data: Array.isArray(panelTitle) ? panelTitle : [],
                tip: true,
                width: 103,
                renderTo: dropDownElId
            });
            if (valueTitle) {
                list.setValue(valueTitle);
            }
            list.addListener("change", function(event, val) {
                me._switchTitle(val.text);
                dropDownEl.hide();
            });
            list.addListener("nodeClick", function(node, data) {
                dropDownEl.hide();
            });
             $("body").bind("click", function(e , data) {
                if ($(e.target).hasClass(arrowClass) === false) {
                    dropDownEl.hide();
                }
            });
            dropDownEl.addClass(widgetPanelSelectWinRadio);
        },
        /**
         * @parivate
         * @description 渲染到相应的到div
         * @param {String} id 目标元素ID
         */
        _render: function (id) {
            var me = this;

            if (!me._super(id)) {
                return false;
            }

            // 把创建的Dom附着到渲染容器
            me.container.appendTo(me.renderEl);

            if ($.isArray(me.options.items) && me.options.items.length > 0) {
                var item = me.options.items[0];

                if ($.isFunction(item.render)) {
                    item.render(me.options.id + "-content");
                }
            }
            
            me.rendered = true;
            return true;
        },

        /**
         * @description 登记事件
         * @param {String} eventName 事件名称
         * @returns {boolean}
         * @private
         */
        _addListener: function (eventName) {
            var evt = '';
            var me = this;

            if ($.type(eventName) === 'undefined') {
                evt = 'tool';
            }
            else {
                evt = eventName;
            }

            // 目前只支持tool消息
            if (evt === 'tool') {
                if ($.isNull(this.toolsEl)) {
                    return false;
                }

                this.toolsEl.children().unbind().bind('click', function (event) {
                    me._trigger('tool', event, event.target.className);
                });
            }
            else {
                return false;
            }

            return true;
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
            fn(event, args, this);
        },

        /**
         * @description 添加sweet控件，一般为图表展示控件
         * @param {Object/Array} items 为sweet类对象
         */
        addItems: function (items) {
            var me = this;
            var item;

            if (typeof items !== 'object') {
                return false;
            }
            if (!$.isArray(me.options.items)) {
                me.options.items = [];
            }

            if (me.options.items.length > 0) {
                me._error('widgetpanel can only hold 1 sub item. #' + me.options.id);
                return false;
            }

            if ($.isArray(items) && items.length >= 1) {
                item = items[0];
            }
            else {
                item = items;
            }

            if (this.rendered) {
                item.render(me.options.id + "-content");
            }
            me.options.items.push(item);

            return true;
        },

        /**
         * @description 删除子组件
         */
        removeItems: function () {
            var item;

            if (this.options.items.length === 0) {
                return;
            }
            else {
                item = this.options.items[0];
            }

            // 销毁子组件
            if ($.isFunction(item.destroy)) {
                try {
                    item.destroy();
                }
                catch (e) {
                    this._error(e);
                }
            }

            // 清除列表
            this.options.items = [];
        },

        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            var me = this;

            // 释放定时器
            if (this.stateTimer && this.stateTimer >= 0) {
                window.clearInterval(this.stateTimer);
                this.stateTimer = -1;
            }
            //使tip消失
            if(this.toolsEl.children(".close")){
                 this.toolsEl.children(".close").trigger("mouseout");
            }
            // 解除事件绑定
            this.toolsEl.children().unbind();

            // 销毁子组件
            $.each(me.options.items, function (index, item) {
                if ($.isFunction(item.destroy)) {
                    try {
                        item.destroy();
                    }
                    catch (e) {
                    }
                }
            });

            // 清理组件对象列表和Dom
            me.options.items = [];
            me.container.remove();
        },
        /**
         * @description 刷新布局
         * @private
         */
        _doLayout: function () {
            var me = this;
            if (!me.rendered) {
                return;
            }

            $.each(this.options.items, function (index, item) {
                if ($.isFunction(item.setWH)) {
                    item.setWH(me.contentEl.width(), me.contentEl.height());
                }
            });
            me._listDoLayout();
        },
        /**
         * @description 刷新list布局
         * @private
         */
        _listDoLayout: function() {
            var me = this,
                    listDatas,
                    _liHeight = 22,
                    _titleElHeight = me.titleEl.outerHeight(true),
                    _containerHeight = me.container.height(),
                    _containerWidth = me.container.width(),
                    _toolsElWidth = me.toolsEl.outerWidth(),
                    _listHeight = _containerHeight - _titleElHeight - _liHeight,
                    _listDataLength = 0,
                    _maxWidth,
                    _tWidth,
                    _padW10 = 10,
                    _padW6 = 6,
                    dwrW = 13;
            if (!me.list) {
                return;
            }
            listDatas = me.list.getData();
            if (_listHeight <= 0) {
                _listHeight = _liHeight;
            } else {
                _listDataLength = listDatas.length;
                if ((_listHeight >= _listDataLength * _liHeight)) {
                    _listHeight = "auto";
                }
            }
            _maxWidth = me._getLiMaxWidth(listDatas);
            _tWidth = (_maxWidth + 4 * _padW10 + dwrW) - (_containerWidth - _toolsElWidth - _padW10);
            if (_tWidth > 0) {
                _tWidth = _maxWidth - _tWidth;
            } else {
                _tWidth = _maxWidth;
            }
            me.downArrow.css({left: _tWidth + 4 * _padW10 + _padW6});
            me.list.setWH(_tWidth + 4 * _padW10 + dwrW + _padW6, _listHeight);
            if (!me._downArrowHide) {
                me.headerEl.width(_tWidth + 3 * _padW10 + _padW6);
            } else {
                me.headerEl.css({"width": "calc(100% - 20px)"});
            }
        },
        /**
         * @private
         * @description 获取区域中li最宽的宽度
         * @param {Array} datas 数据
         */
        _getLiMaxWidth: function(datas) {
            var maxWidth = 60,
                    tempWidth = 0,
                    _span;
            _span = $("<span>").css({left: "-10000px", position: "absolute"}).appendTo("body");
            for (var i = 0; i < datas.length; i++) {
                _span.text(datas[i].text);
                tempWidth = _span.outerWidth();
                if (tempWidth > maxWidth) {
                    maxWidth = tempWidth;
                }
            }
            _span.remove();
            return maxWidth;
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function () {
            return this.container.externalWidth();
        },

        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function () {
            return this.container.externalHeight();
        },

        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function (width) {
            var me = this;
            me.container.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function (height) {
            var me = this;
            me.container.externalHeight(height);
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function (width, height) {
            this._setWidth(width);
            this._setHeight(height);
        },
        /**
         * 展开下拉框
         * @private
         * @param {Object} 事件
         */
        _showDropDownList : function(event) {
            var me = event.data.me;
            
            if (!$.isVisiable(me.dropDownEl)) {
                var maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                    me.dropDownEl.css("z-index", maxIndex);
                    
                var pos = $.getFloatOffset(me.titleEl, me.dropDownEl);
                
                me.dropDownEl.css({"left": pos.left, "top": pos.top});
                me.dropDownEl.show();
                if (me.list) {
                    me.list.doLayout(true);
                }
            } else {
                 me.dropDownEl.hide();
            }
           
        },
        /**
         * 切换title
         * @param {type} state
         * @returns {undefined}
         */
        _switchTitle : function(val) {
            var me = this;
            
            if (val !== me.options.panelTitle) {
                me.setTitle(val);
                me.options.panelTitle = val;
                me._trigger('switchTitle', null, val);
            }
        },
        /**
         * 设置状态
         * @param {String} state 状态名
         */
        setState: function (state) {
            if (state === "loading") {
                this.toolsEl.hide();
                this.stateEl.show();

                if (this.stateTimer && this.stateTimer >= 0) {
                    window.clearInterval(this.stateTimer);
                    this.stateTimer = -1;
                }

                var offset = 0;
                var stateEl = this.stateEl.children().first();

                stateEl.addClass(state);
                stateEl.css("background-position", "0px");
                this.stateTimer = window.setInterval(function () {
                    offset += 22;
                    if (offset >= 22 * 8) {
                        offset = 0;
                    }

                    stateEl.css("background-position", -offset + "px");
                }, 100);
            }
            else {
                this.toolsEl.show();
                this.stateEl.hide();

                if (this.stateTimer && this.stateTimer >= 0) {
                    window.clearInterval(this.stateTimer);
                    this.stateTimer = -1;
                }
            }
        },
        /**
         * @event
         * @description 工具按钮点击事件
         * @name Sweet.WidgetPanel#tool
         * @param {Event} event 事件对象
         * @param {String} tool 按钮名称
         * @param {Object} panel WidgetPanel对象
         */
        tool: function (event, tool, panel) {
            $.log(event + "," + tool + "," + panel);
        }
    });

    /**
     * 创建widgetpanel组件类
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.widget
     * @requires <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建WidgetPanel容器：
     * var sweetWidgetPanel = Sweet.WidgetPanel({});
     */
    Sweet.WidgetPanel = $.sweet.widgetpanel;
})(jQuery);



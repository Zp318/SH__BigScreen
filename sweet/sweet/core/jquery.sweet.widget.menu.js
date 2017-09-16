/**
 * @fileOverview
 * <pre>
 * menu菜单组件
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    /**menu菜单的样式名称*/
    var mClass = "sweet-widget-menu",
            mAlphaClass = "sweet-widget-menu-alpha",
            mColorClass = "sweet-widget-menu-color",
            mhiddenClass = "sweet-widget-menu-hidden",
            mListClass = "sweet-widget-menu-list",
            mListItemClass = "sweet-widget-menu-list-item",
            mItemClass = "sweet-widget-menu-item",
            mItemArrowClass = "sweet-widget-menu-item-arrow",
            mItemIconClass = "sweet-widget-menu-item-icon",
            mItemTextClass = "sweet-widget-menu-item-text",
            mItemDisabledClass = "sweet-widget-menu-item-disabled",
            mItemActiveClass = "sweet-widget-menu-item-active",
            mItemMouseoverDisableClass = "sweet-widget-menu-item-mouseover-disabled",
            /**菜单显示的距离上下左右的最小距离*/
            defaultDistance = 10,
            menuDefaultImage = Sweet.libPath + "themes/default/core/images/menu/s.gif";

    $.widget("sweet.widgetMenu", $.sweet.widget, /** @lends Sweet.menu.Menu.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-menu]",
        type: "menu",
        eventNames: /** @lends Sweet.menu.Menu.prototype*/{
            /**
             * @event
             * @description 菜单选项选择,参数为两个(event, data)
             */
            itemClick: "菜单选项选择事件"
        },
        // menu类输入组件公共配置参数
        options: /** @lends Sweet.menu.Menu.prototype*/{
            /**
             * @description 菜单项内容
             * @type Array
             * @default []
             */
            items: [],
            /**
             * @description 菜单的左上角的x坐标
             * @type number
             * @default 0
             */
            X: 0,
            /**
             * @description 菜单的左上角的y坐标
             * @type number
             * @default 0
             */
            Y: 0,
            /**
             * @description 菜单的每一项的高度
             * @type number
             * @default 26
             */
            itemHeight: 26,
            /**
             * @description 菜单的宽度
             * @type number
             * @default 150
             */
            itemWidth: 150,
            /**
             * @description 是否透明，true：透明 false：不透明
             * @param {Boolean}
             * @default false
             */
            transparent: false
        },
        /**
         * @public
         * @description 设置menu中的含禁用项的菜单数据
         * @param {Array} items 具体的数据
         */
        setDisabled: function(items) {
            if ($.isNull(items) || items.length <= 0) {
                return;
            }
            var me = this,
                    id = me.options.renderTo;
            if (items instanceof Array) {
                for (var i = 0; i < items.length; i++) {
                    $("#" + id).find("#" + items[i].value).addClass(mItemDisabledClass);
                }
            }
        },
        /**
         * @public
         * @description 为menu重新设置数据项
         * @param {Array} data 具体的数据
         */
        setData: function(data) {
            if ($.isNull(data) || data.length <= 0) {
                return;
            }

            var me = this;
            if (me.menuEl) {
                me.menuEl.remove();
            }
            me.options.items = data;
            me._createSweetWidget();
            me.rendered = false;
            me._render(me.options.renderTo);
            me._doLayout();
        },
        /**
         * @private
         * @description 创建menu组件
         */
        _createSweetWidget: function() {
            var me = this,
                    options = me.options,
                    /**menu显示时的绝对坐标*/
                    menuX = Number(options.X),
                    menuY = Number(options.Y),
                    pixSuff = "px",
                    itemCount = options.items.length,
                    divHeight = itemCount * options.itemHeight + 2,
                    menuId = me.menuId = options.id,
                    menuEl = me.menuEl = $("<div>").attr("id", menuId),
                    bcWidth = document.body.clientWidth,
                    bcHeight = document.body.clientHeight,
                    scrollTop = $(document).scrollTop(),
                    menuW = options.width;
            //问题单：DTS2013122504067
            /**修正menu的坐标位置*/

            /**menu div*/
            menuEl.addClass(mClass);
            if (options.transparent) {
                menuEl.addClass(mAlphaClass);
            } else {
                menuEl.addClass(mColorClass);
            }
            /**创建menu*/
            me._createMenuItems();
        },
        /**
         * @private
         * @description 创建具体的每一个menu item
         */
        _createMenuItems: function() {
            var me = this,
                    tempItem,
                    options = me.options,
                    items = options.items,
                    itemCount = items.length,
                    itemHeight = options.itemHeight,
                    ulHeight = itemCount * itemHeight + 2,
                    /**创建<ul></ul>*/
                    menuUl = me.menuUl = $("<ul>").addClass(mListClass)
                    .attr("id", "sweet-menu-ul-" + options.id)
                    .css({"height": ulHeight}),
            hasChild, tempItemValue, disabled, menuLi, menuA, icon, menuImage, menuText, tempId;

            for (var i = 0; i < itemCount; i++) {
                tempItem = items[i];
                hasChild = false;
                tempItemValue = tempItem.value;
                tempId = options.id + "-" + i;
                /**判断此item menu是否有子菜单*/
                if (tempItem.children && tempItem.children.length > 0) {
                    hasChild = true;
                }

                //判断此menu项是否是禁用状态
                disabled = false;
                if (tempItem.disabled || tempItem.disabled === "true") {
                    disabled = true;
                }

                /**如果value值为空或没有，设置默认值*/
                if (!tempItemValue || tempItemValue === "") {
                    tempItemValue = "sweet-menu-item" + (i + 1);
                }

                /**创建<li></li>*/
                menuLi = $("<li>").addClass(mListItemClass)
                        .attr("id", tempItemValue)
                        .css({"height": itemHeight})
                        .bind("click", {"me": me, "hasChild": hasChild, "disabled": disabled}, me._itemClick)
                        .bind("mouseover", {"id": tempItemValue,
                    "me": me, "index": (i + 1),
                    "disabled": disabled,
                    "children": items[i].children
                }, me._mouseOver)
                        .bind("mouseout", {"id": tempItemValue, "hasChild": hasChild, "me": me}, me._mouseOut);
                if (options.itemWidth > 150) {
                    menuLi.width(options.itemWidth);
                }
                /**创建<a></a>*/
                menuA = $("<a>").attr({"id": "sweet-menu-a-" + tempId, "href": "#"})
                        .addClass(mItemClass);
                /**如果此menu还有子节点*/
                if (hasChild) {
                    menuA.addClass(mItemArrowClass);     // 添加子节点样式
                }
                if (disabled) {
                    menuLi.addClass(mItemDisabledClass);
                }

                menuA.appendTo(menuLi);

                /**创建menu icon, 如果没有设置icon,使用默认的icon*/
                icon = items[i].icon && items[i].icon !== "" ? items[i].icon : menuDefaultImage;
                menuImage = $("<img>").attr({"id": "sweet-menu-img-" + tempId, "src": icon})
                        .addClass(mItemIconClass).appendTo(menuA);

                /**创建<span></span>*/
                menuText = $("<span>").attr({"id": "sweet-menu-text-" + tempId})
                        .addClass(mItemTextClass)
                        .text(items[i].text)
                        .appendTo(menuA);

                menuUl.append(menuLi);
            }

            menuUl.appendTo(me.menuEl);
        },
        /**
         * @private
         * @description 鼠标悬浮在菜单事件
         * @param {Object}evt:当前鼠标所指菜单对象
         */
        _mouseOver: function(evt) {
            // 当前item的id
            var tempData = evt.data,
                    menuLiId = tempData.id,
                    itemInfo = tempData.me.options.items,
                    // 当前menu对象
                    parentMenu = tempData.me,
                    itemHeight = tempData.me.options.itemHeight,
                    // 当前item的索引
                    index = tempData.index,
                    disabled = tempData.disabled,
                    // menu的宽度
                    liWidth = parentMenu.menuEl.width() - 1,
                    // 子菜单相对于主菜单的
                    overHeight = (index - 1) * itemHeight,
                    tempMenu = tempData.me.subMenu,
                    temp, child,
                    bcWidth = document.body.clientWidth,
                    bcHeight = document.body.clientHeight;

            while (tempMenu) {
                tempMenu._destroyWidget();
                tempMenu = tempMenu.subMenu;
            }

            /**移除此item所在的menu上的activeclass*/
            for (var i = 0; i < itemInfo.length; i++) {
                temp = itemInfo[i].value;
                if (!temp || temp === "") {
                    temp = "sweet-menu-item" + (i + 1);
                }

                $("#" + temp).removeClass(mItemActiveClass + " " + mItemMouseoverDisableClass);
            }

            if (disabled) {
                $("#" + menuLiId).addClass(mItemActiveClass).addClass(mItemMouseoverDisableClass);
            }
            else {
                $("#" + menuLiId).addClass(mItemActiveClass);
            }

            /**如果有子菜单，鼠标移动上来时，应该显示出子菜单来*/
            child = tempData.children;
            if (child && child.length > 0 && !disabled) {
                /**计算menu显示的xy值*/
                var pMenuOpt = parentMenu.options,
                        menux = 0, menuy = 0;
                menux = pMenuOpt.X + liWidth;
                menuy = pMenuOpt.Y + overHeight;
                tempData.me.subMenu = new Sweet.menu.Menu({
                    X: menux,
                    Y: menuy,
                    renderTo: pMenuOpt.renderTo,
                    items: child,
                    transparent: pMenuOpt.transparent,
                    itemClick: function(ievent, idata) {
                        parentMenu._trigger("itemClick", ievent, idata);
                        parentMenu._destroyWidget();
                    }
                });
            }
        },
        /**
         * @private
         * @description 鼠标移出菜单事件
         * @param {Object}evt:鼠标移出的菜单对象
         */
        _mouseOut: function(evt) {
            if (!evt.data.hasChild) {
                $("#" + evt.data.id).removeClass(mItemActiveClass);
            }
        },
        /**
         * @private
         * @description menu组件的菜单选择事件
         * @param {object} evt item选择事件
         */
        _itemClick: function(evt) {
            var itemData = {}, data = evt.data, me = data.me, hasChild = data.hasChild,
                    options = me.options, func = data.func, disabled = data.disabled;
            itemData.text = evt.currentTarget.textContent;
            itemData.value = evt.currentTarget.id;

            if (disabled || hasChild) {
                //置灰或者有子菜单的不关闭菜单
                evt.stopPropagation();
                return;
            }

            for (var i = 0; i < options.items.length; i++) {
                if (itemData.value === options.items[i].value) {
                    itemData.data = options.items[i].data;
                    break;
                }
            }

            /**如果有子菜单，则不触发事件*/
            if (!hasChild) {
                if (func) {
                    func(evt, itemData);
                } else {
                    me._trigger("itemClick", evt, itemData);
                }
            }

            if (me.subMenu) {
                me.subMenu._destroyWidget();
            }
            me._destroyWidget();
            return false;
        },
        /**
         * @private
         * @description 点击页面时关闭menu
         */
        _closeFloatPanel: function() {
            var me = this;
            me._destroyWidget();
        },
        /**
         * @private
         * @description 删除menu
         */
        _destroyWidget: function() {
            if (this.menuEl) {
                this.menuEl.empty().remove();
            }
        },
        /**
         * @private
         * @description 去激活注册事件
         * @param {String} eName 去除的事件的名称，不传或为空时，去除全部的注册事件
         */
        _removeListener: function(eName) {
            var me = this;
            me.handlers = me.handlers || {};
            //去除所有的绑定的事件
            if (!eName || eName === "") {
                $.each(me.handlers, function(eventName, func) {
                    $("#" + me.options.renderTo + " ." + mListItemClass).unbind(eventName);
                });
            } else {
                $.each(me.handlers, function(eventName, func) {
                    //只去除特定的绑定事件
                    if (eName === eventName) {
                        me.chartElement.removeListener(me.chartElement, eventName, func);
                    }
                });
            }
        },
        /**
         * @private
         * @description 注册事件
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                $("#" + me.options.renderTo + " ." + mListItemClass).bind(eventName, {"func": func}, function(evt) {
                    me._itemClick(evt);
                });
            });
        },
        /**
         * @private
         * @description 渲染menu组件
         * @param {string} id 渲染的id
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }

            me.menuEl.appendTo(me.renderEl);
            me.rendered = true;
            me._doLayout();
            return true;
        },
        _getWidth: function() {
            return this.menuEl.width();
        },
        _getHeight: function() {
            return this.menuEl.height();
        },
        /**
         * @parivate
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         */
        _doLayout: function() {
            var renderTo = this.options.renderTo;
            if (!renderTo || renderTo === "") {
                return;
            }
            var me = this;
            var mx = me.options.X,
                    pixSuff = "px",
                    options = me.options,
                    my = me.options.Y,
                    itemCount = options.items.length,
                    tPadding = 10,
                    divHeight = itemCount * options.itemHeight + 2 + tPadding,
                    bcWidth = window.document.body.scrollWidth, 
                    bcHeight = window.document.body.scrollHeight,
                    scrollTop = $(document).scrollTop(),
                    documentW = $(document).width(),
                    menuW = me.menuEl.width(),
                    _tMenuW = me.menuEl.outerWidth(),
                    menuH = me.menuEl.outerHeight();
            if (documentW > bcWidth) {
                bcWidth = documentW;
            }
            if (_tMenuW > menuW) {
                menuW = _tMenuW;
            }
            /**修正menu的坐标位置*/
            if (mx + menuW >= bcWidth) {
                var prev = $("#" + options.id).prev();
                if (prev.length > 0) {
                    var first = $("#" + renderTo + " > div").eq(0);
                    var prevx = parseInt(prev.css("left"));
                    var firstx = parseInt(first.css("left"));
                    if (prevx < firstx) {
                        mx = prevx - menuW;
                    } else if (prevx === firstx) {
                        mx = firstx - menuW;
                    }
                } else {
                    mx = bcWidth - menuW - defaultDistance;
                }
            }
            if (menuH > divHeight) {
                divHeight = menuH;
            }
            if (my - scrollTop + divHeight > bcHeight) {
                //往上再移10像素
                my = bcHeight - divHeight <= 0 ? scrollTop : bcHeight - divHeight + scrollTop - tPadding;
                if (my < 0) {
                    my = 0;
                }
            }
            me.menuEl.css({"left": mx + pixSuff, "top": my + pixSuff});
        }
    });

    /**
     * 菜单
     * @name Sweet.menu.Menu
     * @class
     * @extends Sweet.widget
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * <pre>
     *  menu = new Sweet.menu.Menu({
     *       renderTo : "sweet-menu",
     *       X: 60,
     *       Y: 40,
     *       itemClick : function(evt, data){
     *           alert(data.text);
     *       },
     *       items: [
     *           {"value":1, "text": "ONE", "icon": "可选", disabled : true},
     *           {"value":2, "text": "TWO", "icon": "可选"},
     *           {"value":3, "text": "Three", "icon": "可选"},
     *           {"value":7, "text": "Seven", "icon": "可选", "children":[{"text":"test1","value":"test1","children":[
     *           {"text":"test3","value":"test3"},{"text":"test4","value":"test5"}]},
     *           {"text":"test2","value":"test2"}]},
     *           {"value":5, "text": "Five", "icon": "可选"}
     *   ]});
     * </pre>
     */
    Sweet.menu.Menu = $.sweet.widgetMenu;
}(jQuery));

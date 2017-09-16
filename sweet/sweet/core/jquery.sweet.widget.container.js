/**
 * @fileOverview  
 * <pre>
 * 容器组件
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var defaultContainerClass = "sweet-container";

    $.widget("sweet.widgetContainer", $.sweet.widget, /** @lends Sweet.container.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container]:",
        widgetClass: "sweet.widgetContainer", // 表明是布局类组件
        options: /** @lends Sweet.container.prototype*/{
            width: "auto",
            /**
             * 是否有fieldset
             * @type {Boolean} 是否有fieldset
             * @default false
             */
            fieldset: false,
            /**
             * fieldset标题
             * @type {String} fieldset标题
             * @default ""
             */
            fieldsetTitle: "",
            /**
             * fieldset右侧增加html内容
             * @type {String}
             * @default ""
             */
            fieldsetHTML: "",
            /**
             * 是否可折叠
             * @type {Boolean} 是否可折叠
             * @default true
             */
            collapsible: true,
            /**
             * 主体内容是否收起, 默认展开
             * @type {Boolean} 主体内容是否收起
             * @default false
             */
            collapse: false,
            /**
             * 点击fieldset标题时折叠、展开面板时的回调函数，参数flag表示是否展开
             * @type Function
             * @default null
             */
            toggle: null,
            /**
             * 容器外边距,其值为如100， 也可以是数组，如[200, 10, 100, 20],  分别对应：[top, right, bottom,left]
             * @type Number/Array
             * @default 0
             */
            margin: 0
        },
        /**
         * @description 组件隐藏
         */
        hide: function() {
            this.renderEl.hide();
            this.visible = false;
        },
        /**
         * @description 组件显示
         */
        show: function() {
            this.renderEl.show();
            this.visible = true;
            this.doLayout(true);
            this._layoutChildren(true);
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            if (this.fieldsetEl) {
                this.fieldsetEl.externalWidth(width);
            }
            else {
                this.containerEl.externalWidth(width);
            }
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            if (this.fieldsetEl) {
                this.fieldsetEl.externalHeight(height);
            }
            else {
                this.containerEl.externalHeight(height);
            }
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            this._setWidth(width);
            this._setHeight(height);
        },
        /**
         * @description 返回组件宽度
         * @return {Number} 返回组件宽度
         */
        _getWidth: function() {
            if (this.fieldsetEl) {
                return this.fieldsetEl.externalWidth();
            }
            else {
                return this.containerEl.externalWidth();
            }
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        _getHeight: function() {
            if (this.fieldsetEl) {
                return this.fieldsetEl.externalHeight();
            }
            else {
                return this.containerEl.externalHeight();
            }
        },
        /**
         * @description 渲染组件
         * @param {String} id 组件ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            if (me.fieldsetEl) {
                me.fieldsetEl.appendTo(me.renderEl);
            } else {
                me.containerEl.appendTo(me.renderEl);
            }
            me._widgetRender();
            me.rendered = true;
            return true;
        },
        /**
         * @description 子类渲染
         */
        _widgetRender: $.noop,
        /**
         * @description 点击fieldset标题，折叠或展开container区域
         * @param {Boolean} flag 展开(true)，或关闭(false)
         * @private
         */
        _toggleFieldSet: function(flag) {
            var me = this;

            var container = me.containerEl;
            var fieldset = me.fieldsetEl;
            var content = fieldset.children().first();
            var title = content.children().first();

            if (flag) {
                container.show();
                content.height(title.externalHeight() + me.containerHeight);
                fieldset.height(content.externalHeight());
                me.doLayout(true);
                me._layoutChildren(true);
            }
            else {
                container.hide();
                // 记录container高度
                me.containerHeight = container.externalHeight();
                content.height(title.outerHeight());
                fieldset.height(content.externalHeight());
            }

            // 回调
            if ($.isFunction(me.options.toggle)) {
                me.options.toggle(flag);
            }
        },
        /**
         * @private
         * @description 创建组件
         */
        _createSweetWidget: function() {
            var me = this;
            var options = this.options;
            var containerEl = this.containerEl = $("<div>");

            containerEl.addClass(defaultContainerClass);
            if ($.isNull(containerEl.attr("id"))) {
                containerEl.attr("id", options.id);
            }

            if (options.fieldset) {
                this._error("#" + this.options.id + " fileset option is deprecated!");

                var fieldsetElClass = "sweet-container-fieldset";
                var fieldsetContentElClass = "sweet-container-fieldset-content";
                var fieldsetTitleElClass = "sweet-container-fieldset-title";
                var fieldsetTitleCollapsibleClass = "sweet-container-fieldset-title-collapsible";
                var fieldsetTextElClass = "sweet-container-fieldset-text";
                var fieldsetPicElClass = "sweet-container-fieldset-pic";
                var fieldSetPicFoldClass = "sweet-container-fieldset-pic-fold";
                var fieldSetPicUnfoldClass = "sweet-container-fieldset-pic-unfold";
                var fieldSetHTMLClass = "sweet-container-fieldset-html";
                var fieldsetEl = me.fieldsetEl = $("<div>")
                        .addClass(fieldsetElClass + " " + options.widgetClass);
                var fieldsetContentEl = $("<div>").addClass(fieldsetContentElClass);
                var fieldsetTitleEl = $("<div>").addClass(fieldsetTitleElClass);
                var fieldsetTitleContentEl = $("<div>");
                var fieldsetTextEl = $("<em>").addClass(fieldsetTextElClass);
                var fieldsetPicEl = $("<a>").addClass(fieldsetPicElClass);
                var fieldsetHTMLEl = $("<div>").addClass(fieldSetHTMLClass);

                fieldsetTextEl.html(options.fieldsetTitle).appendTo(fieldsetTitleContentEl);
                // 是否可折叠
                if (options.collapsible) {
                    fieldsetTitleEl.addClass(fieldsetTitleCollapsibleClass);
                    fieldsetTitleContentEl.bind("click", function() {
                        if (fieldsetPicEl.hasClass(fieldSetPicFoldClass)) {
                            fieldsetPicEl.removeClass(fieldSetPicFoldClass).addClass(fieldSetPicUnfoldClass);
                            me._toggleFieldSet(true);
                        } else if (fieldsetPicEl.hasClass(fieldSetPicUnfoldClass)) {
                            fieldsetPicEl.removeClass(fieldSetPicUnfoldClass).addClass(fieldSetPicFoldClass);
                            me._toggleFieldSet(false);
                        }
                    });
                    fieldsetPicEl.appendTo(fieldsetTitleContentEl);
                    // 是否展开
                    if (options.collapse) {
                        fieldsetPicEl.addClass(fieldSetPicFoldClass);
                        containerEl.hide();
                    } else {
                        fieldsetPicEl.addClass(fieldSetPicUnfoldClass);
                    }
                }
                fieldsetHTMLEl.html(options.fieldsetHTML).appendTo(fieldsetTitleEl);
                fieldsetTitleContentEl.appendTo(fieldsetTitleEl);
                fieldsetTitleEl.appendTo(fieldsetContentEl);
                fieldsetContentEl.appendTo(fieldsetEl);
                containerEl.appendTo(fieldsetContentEl);

                me._setMargin(fieldsetEl);
                fieldsetEl.externalHeight(options.height).externalWidth(options.width);
            } else {
                me._setMargin(containerEl);
                containerEl.addClass(options.widgetClass)
                        .externalHeight(options.height)
                        .externalWidth(options.width);
            }
            // 创建容器
            me._createContainer();
        },
        /**
         * @private
         * @description 创建容器, 子类继承实现
         */
        _createContainer: $.noop,
        /**
         * @private
         * @description 设置元素margin
         * @param {Object} obj 将设置的目标元素
         */
        _setMargin: function(obj) {
            var options = this.options,
                    margin = options.margin;
            var marginAttrs = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];

            // 以padding实现
            if ($.isNumeric(margin) && 0 !== margin) {
                obj.css('padding', margin);
            }
            else if ($.isArray(margin)) {
                for (var i = 0; i < margin.length && i < marginAttrs.length; i++) {
                    if (0 !== margin[i]) {
                        obj.css(marginAttrs[i], margin[i]);
                    }
                }
            }
        },
        /**
         * @private
         * @description 子类继承实现。缺省的处理：销毁子组件、解除事件绑定、删除dom元素
         */
        _destroyWidget: function() {
            // 解除事件绑定，并删除Dom元素
            if (this.fieldsetEl) {
                this.fieldsetEl.find("*").unbind();
                this.fieldsetEl.remove();
            }
            else if (this.containerEl) {
                this.containerEl.find("*").unbind();
                this.containerEl.remove();
            }
        },
        /**
         * 递归刷新所有子组件布局
         * @param {Boolean} flag 强制刷新标志
         * @private
         */
        _layoutChildren: function(flag) {
            "use strict";
            var item;

            if ($.isArray(this.options.items)) {
                for (var i = 0; i < this.options.items.length; i++) {
                    item = this.options.items[i];

                    // 子组件
                    if ($.isFunction(item.doLayout)) {
                        item.doLayout(flag);
                    }

                    // 孙子组件
                    if ($.isFunction(item._layoutChildren)) {
                        item._layoutChildren(flag);
                    }
                }
            }
        }
    });
    /**
     * @description 容器布局类的基类，不能直接使用
     * @class
     * @extends Sweet.widget
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     */
    Sweet.container = $.sweet.widgetContainer;
}(jQuery));

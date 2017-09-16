/**
 * @fileOverview
 * <pre>
 * win组件
 * 2013/3/7
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    'use strict';

    var titleClass = "sweet-dialog-title",
        titleCloseClass = "sweet-dialog-title-close",
        contentClass = "sweet-dialog-content",
        contentHeadlessClass = "sweet-dialog-content-headless",
        bottomClass = "sweet-dialog-bottom",
        buttonClass = "sweet-form-button",
        visibleClass = "sweet-window-visible-",
        invisibleClass = "sweet-window-invisible-";

    // 容器显示隐藏动画的时长
    var toggleDuration = {
        normal: 0,
        rotateY: 700
    };

    $.widget("sweet.widgetWindow", $.sweet.widget, /** @lends Sweet.Window.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-win]",
        defaultElement: "<div>",
        defaultWindowBg: "sweet-dialog-bg",
        // window组件公共配置参数
        options: /** @lends Sweet.Window.prototype*/{
            /**
             * window宽度
             * @type String/Number
             * @default 330px
             */
            width: 330,
            /**
             * win高度
             * @type String/Number
             * @default 137px
             */
            height: 137,
            /**
             * 是否模态窗口
             * @type Boolean
             * @default true
             */
            modal: true,
            /**
             * 自定义底部按钮，如果不指定，缺省显示ok/cancel;如果不需要底部按钮，buttons : []
             * @type Array
             * @default null
             */
            buttons: null,
            /**
             * 窗口显示内容对象
             * @type Object
             * @default null
             */
            content: null,
            /**
             * 窗口显示、隐藏方式。当前支持：normal/rotateY
             * @type String
             * @default "normal"
             */
            toggleMethod: "normal",
            /**
             * 缺省按钮点击事件的回调函数。可以指定ok/cancel监听缺省按钮和关闭按钮的点击事件
             * @type Array
             * @default []
             */
            listeners: [],
            /**
             * 是否显示标题栏
             * @type Boolean
             * @default true
             */
            header: true,
            /**
             * 窗口内补丁，顺序是上、右、下、左
             * @type Array
             * @default null, 由CSS指定，SweetUI2.0的缺省值是[20, 10, 20, 10]
             */
            padding: null,
            /**
             * 指定遮罩住的元素id(默认遮罩住整个body，这里可以用户自己指定，以便保留出现在body上的滚动条)
             * @type String
             * @default ""
             */
            maskId : ""
        },
        /**
         * @description 设置弹出窗口标题
         * @param {String} title 标题
         */
        setTitle: function(title) {
            if ($.isString(title)) {
                var me = this;
                me.titleTextEl.text(title);
            }
        },
        /**
         * @description 显示win
         */
        show: function (x, y) {
            var self = this,
                zIndex = 0;
            var maskConfig;
            var toggleMethod = this.options.toggleMethod;
            var duration = toggleDuration[toggleMethod] || 0;
            
            // 是否模态对话框
            if (self.options.modal) {
                // 如果显示方式为动画方式，需要遮罩以淡入淡出的效果显示和隐藏，以配合窗口的旋转效果
                maskConfig = {
                    maskAll: true,
                    duration: duration
                };

                // 显示遮罩
                if(self.options.maskId && $("#"+self.options.maskId)){
                    maskConfig.maskAll = false;
                    $("#"+self.options.maskId).sweetMask(maskConfig);
                } else {
                    self.winEl.sweetMask(maskConfig);
                }
            }

            // 保证窗口在最上显示
            zIndex = $.getMaxZIndex();
            self.winEl.css("z-index", zIndex);

            // 切换为“可见”样式
            self.winEl.addClass(visibleClass + toggleMethod);
            self._doLayout(x, y);

            self.visible = true;
            
            // 允许按ESC关闭
            $(window).unbind("keydown", self._onKeyDown).bind("keydown", {me: self}, self._onKeyDown);
        },
        /**
         * @description 隐藏win
         */
        hide: function () {
            this._closeWindow();
        },
        /**
         * @description 关闭窗口
         */
        close: function (event) {
            var self = this;
            if (event) {
                self = event.data.me || self;
            }

            self._closeWindow();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            if (this.winEl) {
                this.winEl.externalWidth(width);
            }
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            if (this.winEl) {
                this.winEl.externalHeight(height);
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
            if (this.winEl) {
                return this.winEl.externalWidth();
            }
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        _getHeight: function() {
            if (this.winEl) {
                return this.winEl.externalHeight();
            }
        },
        /**
         * @private
         * @description 重新绘制window窗口
         */
        _doLayout: function (x, y) {
            var me = this,
                options = me.options,
                width = options.width,
                height = options.height,
                doc = $("body"),
                docWidth,
                docHeight,
                top,
                left;

            // 窗口隐藏状态不调用doLayout
            if (!me.winEl.hasClass(visibleClass + options.toggleMethod)) {
                return;
            }

            // 组件初始化调用时document还未完成，捕获异常，不做处理
            try {
                docWidth = doc.width();
                docHeight = doc.height();
            }
            catch (e) {
                return;
            }

            // 居中显示
            if (typeof x === 'undefined' || typeof y === 'undefined') {
                top = Math.floor((docHeight - height) / 3) + doc.scrollTop();
                left = Math.floor((docWidth - width) / 2) + doc.scrollLeft();
            }
            else {
                top = y;
                left = x;
            }

            me.winEl.css({"top": top < 0 ? 0 : top, "left": left}).width(width).height(height);

            // 调整content区域（宽度为Auto，不处理）
            height = me.winEl.height() - me.titleEl.externalHeight();
            if (options.buttons === null || options.buttons.length > 0) {
                var bottomOffset = parseInt(me.bottomEl.css("bottom"), 10);
                if (isNaN(bottomOffset)) {
                    bottomOffset = 0;
                }
                height = height - me.bottomEl.externalHeight() - bottomOffset;
            }
            me.contentEl.externalHeight(height);

            // 刷新内部子组件
            if (options.content) {
                try {
                    options.content.doLayout();
                }
                catch (e) {}
            }
        },
        /**
         * 渲染窗口到页面
         * @private
         */
        _render: function () {
            var me = this;
            var options = me.options;
            var bottomEl = me.bottomEl;
            var buttonCss = {"width": "65px", "margin-left": "5px"};
            var id = options.id + "-content-div";

            // 插入DOM
            me.winEl.appendTo("body");
            
            // 创建内容
            if (options.content !== null) {
                if (!$.isNull(options.content.html)) {
                    // 创建html内容
                    me.contentEl.html(options.content.html);
                }
                else {
                    // 渲染子组件
                    options.content.render(id);
                }
            }

            // 创建按钮
            // 缺省按钮
            if ($.isNull(options.buttons)) {
                var id = options.vID ? options.vID : options.id;
                var okButtonEl = me.okButtonEl = $("<button>").attr("id", id + "_ok")
                        .addClass(buttonClass);
                var cancelButtonEl = me.cancelButtonEl = $("<button>").attr("id", id + "_cancel")
                        .addClass(buttonClass);

                okButtonEl.css(buttonCss).text(Sweet.core.i18n.dialog.ok).appendTo(bottomEl);
                cancelButtonEl.css(buttonCss).text(Sweet.core.i18n.dialog.cancel).appendTo(bottomEl);

                me.okButtonEl.unbind().bind("click", {"me": me}, me._onOK);
                me.cancelButtonEl.unbind().bind("click", {"me": me}, me._onCancel);
            }
            else {
                // 自定义按钮
                for (var i in options.buttons) {
                    var btn = options.buttons[i];
                    //添加判空
                    if(btn && $.isFunction(btn.render)){
                        var btnId = options.id + "-btn-" + i;
                        $("<div></div>").attr("id", btnId)
                            .css("float", "left")
                            .css("margin-left", "5px")
                            .appendTo(bottomEl);
                        btn.render(btnId);
                    }
                }
            }

            // 增加拖动功能
            if (me.options.header === true) {
                me.winEl.draggable({
                    handle: "#" + me.titleId,
                    containment: "document",
                    scroll: false,
                    start: function () {
                        // 开始拖动时，向Body发送click事件，以关闭容器内的浮动层
                        $("body").trigger("click");
                    }
                });
            }

            // 缺省隐藏窗口
            me.winEl.css({"top": -2000, "z-index": -1});
        },
        /**
         * 按下ESC键，调用关闭处理
         * @param e
         * @private
         */
        _onKeyDown: function (e) {
            var me = e.data.me;
            var key = e.which;
            var visible = me.isVisible();
            // 27是ESC键的编码
            if (key === 27 && visible) {
                me._onCancel(e);
            }
        },
        /**
         * @private
         * @description 确定事件
         * @param {Object} e
         */
        _onOK: function(e) {
            var me = e.data.me,
                    okFun = me.options.listeners.ok || $.noop,
                    result;
            result = okFun.call(null, e);
            if (false === result) {
                return;
            }
            me.close(e);
        },
        /**
         * @private
         * @description 取消事件
         * @param {Object} e
         */
        _onCancel: function(e) {
            var me = e.data.me,
                    cancelFun = me.options.listeners.cancel || $.noop,
                    result;
            result = cancelFun.call(null, e);
            if (false === result) {
                return;
            }
            me.close(e);
        },
        /**
         * @private
         * @description 关闭win
         */
        _closeWindow: function () {
            var me = this;
            var modal = this.options.modal;
            var toggleMethod = this.options.toggleMethod;
            var duration = toggleDuration[toggleMethod] || 0;

            // 切换样式，使窗口不可见
            this.winEl.removeClass(visibleClass + toggleMethod);
            //隐藏需要设置visible
            this.visible = false;
            // 延迟1秒，调整窗口的top/z-index，防止覆盖其它内容
            setTimeout(function() {
                me.winEl.css({"top": -2000, "z-index": -1});
            }, duration);
            
            //关闭window上面的浮动框
            if(Sweet._closeFloatPanel){
                setTimeout(Sweet._closeFloatPanel, 20);
            }
            // 关闭遮罩
            if (modal) {
                if(me.options.maskId && $("#"+me.options.maskId)){
                    $("#"+me.options.maskId).unSweetMask();
                } else {
                    me.winEl.unSweetMask();
                }
            }
        },
        /**
         * @private
         * @description 绘制对话框组件
         */
        _createSweetWidget: function () {
            var me = this,
                options = me.options,
                winEl = me.winEl = $("<div>");

            winEl.addClass(me.defaultWindowBg + " " + options.widgetClass)
                .height(options.height)
                .width(options.width)
                .attr("id", me.options.id);

            winEl.addClass(invisibleClass + this.options.toggleMethod);

            // 添加标题
            me._createTitle();

            // 添加提示内容
            me._createContent();

            // 添加按钮
            me._createButtons();
        },
        /**
         * @private
         * @description 创建win标题
         */
        _createTitle: function () {
            var me = this,
                options = me.options,
                titleEl = me.titleEl = $("<div>"),
                closeSpan = me.closeSapn = $("<span>").addClass(titleCloseClass),
                titleTextEl = me.titleTextEl = $("<em>"),
                titleId = me.titleId = options.id + "-win-title";

            closeSpan.unbind().bind("click", {"me": me}, me._onCancel).appendTo(titleEl);

            titleTextEl.text(options.title).appendTo(titleEl);
            titleEl.attr("id", titleId)
                .addClass(titleClass)
                .appendTo(this.winEl);

            if (this.options.header !== true) {
                titleEl.height(0).hide();
            }
        },
        /**
         * @private
         * @description 添加win主体内容
         */
        _createContent: function () {
            var me = this,
                options = me.options,
                contentEl = me.contentEl = $("<div>");

            var id = options.id + "-content-div";
            contentEl.attr("id", id).addClass(contentClass).appendTo(me.winEl);
            if ($.isArray(options.padding)) {
                var attrs = ["padding-top", "padding-right", "padding-bottom", "padding-left"];
                for (var i = 0; i < options.padding.length && i < attrs.length; i++) {
                    contentEl.css(attrs[i], options.padding[i] === 0 ? "0" : options.padding[i] + "px");
                }
            }

            if (me.options.header !== true) {
                contentEl.addClass(contentHeadlessClass);
            }
        },
        /**
         * @private
         * @description 给win添加按钮
         */
        _createButtons: function () {
            var me = this;
            me.bottomEl = $("<div>").addClass(bottomClass).appendTo(me.winEl);
        },
        /**
         * 销毁组件
         * @private
         */
        _destroyWidget: function () {
            // 关闭遮罩
            if (this.options.modal) {
                if(this.options.maskId && $("#"+this.options.maskId)){
                    $("#"+this.options.maskId).unSweetMask();
                } else {
                    this.winEl.unSweetMask();
                }
            }
            // 解除事件绑定
            this.closeSapn.unbind();
            if ($.isNull(this.options.buttons)) {
                this.okButtonEl.unbind();
                this.cancelButtonEl.unbind();
            }
            else {
                $.each(this.options.buttons, function(index, button) {
                    if ($.isFunction(button.destroy)) {
                        button.destroy();
                    }
                });
            }

            $(window).unbind("keydown", this._onKeyDown);

            // 删除子组件
            if (this.options.content) {
                if ($.isFunction(this.options.content.destroy)) {
                    this.options.content.destroy();
                }
            }

            // 销毁Dom元素
            this.winEl.remove();
        }
    });

    /**
     * @description window对象
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.widget
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建提示对话框：
     * var sweetWnd = new Sweet.Window({
     *     width: 500,
     *     height: 300,
     *     modal: false,
     *     listeners: {
     *         "ok": function() {
     *             alert("prompt OK");
     *             sweetWnd.close();
     *         }
     *     }
     * });
     */
    Sweet.Window = $.sweet.widgetWindow;
}(jQuery));

/**
 * @fileOverview
 * <pre>
 * 为jQuery扩展的一些常用功能，使用方法与使用jquery的方法一致
 * 2013.3.19
 * http://www.huawei.com
 * Huawei Technologies Co., Ltd. Copyright 1988-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function ($){
    'use strict';

    /**
     * 设置、获取外部宽度，包括margin/border/padding
     * @param width
     * @return {*}
     */
    jQuery.fn.externalWidth = function (width) {
        var obj = this;

        // 如果输入参数为空，返回当前宽度
        if ($.isNull(width)) {
            return obj.outerWidth(true);
        }

        // 如果输入参数为数字，直接设置
        if (typeof width === "number") {
            obj.outerWidth(width, true);
            return obj;
        }

        // 如果输入参数是auto，设置为auto
        if (width === "auto") {
            obj.width(width);
            return obj;
        }

        // 如果输入参数是百分比，计算实际值
        if (typeof width === 'string' && /\d+%/.test(width)) {
            // 如果没有margin/border/padding，不需要计算绝对值，使用百分比即可
            if (obj.outerWidth(true) - obj.width() === 0) {
                obj.width(width);
            }
            else {
                try {
                    var r = parseInt(width, 10);
                    obj.outerWidth(obj.parent().width() * r / 100, true);
                }
                catch (e) {
                    $.log(e);
                }
            }
            return obj;
        }

        // 最终返回obj，避免异常
        return obj;
    };

    /**
     * 设置、获取外部高度，包括margin/border/padding
     * @param height
     * @return {*}
     */
    jQuery.fn.externalHeight = function (height) {
        var obj = this;

        // 如果输入参数为空，返回当前高度
        if ($.isNull(height)) {
            return obj.outerHeight(true);
        }

        // 如果输入参数为数字，直接设置
        if (typeof height === "number") {
            obj.outerHeight(height, true);
            return obj;
        }

        // 如果输入参数是auto，设置为auto
        if (height === "auto") {
            obj.height(height);
            return obj;
        }

        // 如果输入参数是百分比，计算实际值
        if (typeof height === 'string' && /\d+%/.test(height)) {
            // 如果没有margin/border/padding，不需要计算绝对值，使用百分比即可
            if (obj.outerHeight() - obj.height() === 0) {
                obj.height(height);
            }
            else {
                try {
                    var r = parseInt(height, 10);
                    obj.outerHeight(obj.parent().height() * r / 100, true);
                }
                catch (e) {
                    $.log(e);
                }
            }

            return obj;
        }

        // 最终返回obj，避免异常
        return obj;
    };

    // 记录需要监控尺寸变化的对象列表
    var resizeObjects = [];
    // 监控开关
    var monitor = false;
    var monitorId = "jquery.sweetutil.obj_size_monitor";

    /**
     * @private
     * 页面不活动的情况下，监控尺寸的活动只持续5秒，超过则停止检查，减少CPU占用
     */
    function _enableSizeMonitor () {
        monitor = true;
        Sweet.Task.Delay.start({
            id: monitorId,
            run: function() {
                monitor = false;
            },
            delay: 5000
        });
    }

    // 页面加载后5秒钟内允许监控
    $(function () {
        $("body").bind("mousedown mouseup keydown", function () {
            _enableSizeMonitor();
        });
        $(window).resize(function () {
            _enableSizeMonitor();
        });

        _enableSizeMonitor();
    });

    /**
     * 扩展resize方法
     * @type {function}
     */
    $.fn.onResize = function(fn) {
        // 立即启动监控
         _enableSizeMonitor();
         
        var temp,
                a,
                b;
        for (var i = 0; i < resizeObjects.length; i++) {
            temp = resizeObjects[i].obj;
            a = temp[0];
            b = this[0];
            //原来对象直接比较相等是不可能的，所以比较他们的id
            if (a && b && a.id === b.id) {
                if ($.isNull(fn)) {
                    resizeObjects.splice(i, 1);
                    i--;
                } else {
                    resizeObjects[i].handler = fn;
                }
                return;
            }
        } 
        
        var size = {width: this.width(), height: this.height()};
        resizeObjects.push({obj: this, handler: fn, size: size});
    };

    /**
     * 每隔100毫秒，检查登记resize事件的Dom，如果大小发生变化，调用登记的回调函数
     */
    window.setInterval(function () {
        if (!monitor) {
            return;
        }
        var handlers = [];
        $.each(resizeObjects, function (index, item) {
            if (item.obj.is(":hidden")) {
                return;
            }

            if (item.obj.width() !== item.size.width || item.obj.height() !== item.size.height) {
                // 如果有刷新，延长监控时间
                _enableSizeMonitor();

                // 记录新大小
                item.size.width = item.obj.width();
                item.size.height = item.obj.height();

                if ($.isFunction(item.handler)) {
                    handlers.push(item);
                }
            }
        });
        var temp;
        for(var i = 0; i < handlers.length; i++){
            temp = handlers[i];
            temp.handler(temp.obj);
        }
    }, 100);

    /* 鼠标滚轮事件的处理 */
    var _mouseWheelListeners = [];

    /**
     * 鼠标滚动事件的处理
     * @param event
     */
    function wheel(event) {
        var delta = 0;
        var data, obj, callback, element;

        if (!event) {
            /* For IE. */
            event = window.event;
        }

        if (event.wheelDelta) {
            /* IE/Opera. */
            delta = event.wheelDelta / 120;
        }
        else if (event.detail) {
            /**
             * Mozilla case.
             * In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            delta = -event.detail / 3;
        }

        /**
         * If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta) {
            for (var i = 0; i < _mouseWheelListeners.length; i++) {
                obj = _mouseWheelListeners[i].obj;
                callback = _mouseWheelListeners[i].callback;

                // 检查事件来源，只处理当前元素的事件
                element = event.originalTarget || event.srcElement;
                if (element && element.id !== obj.attr('id') && !$.contains(obj.get(0), element)) {
                    continue;
                }

                // 执行注册的回调函数
                if ($.isFunction(callback)) {
                    data = {
                        ui: obj,
                        delta: delta
                    };

                    // 如果回调函数返回false，禁止事件冒泡
                    if (callback(event, data) === false) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        event.returnValue = false;
                    }
                }
            }
        }
    }

    /**
     * 向Window对象注册滚轮事件
     */
    function startWheelListener () {
        // 鼠标滚轮事件
        if (window.addEventListener) {
            /** DOMMouseScroll is for mozilla. */
            window.addEventListener('DOMMouseScroll', wheel, false);
        }
        else {
            /** IE/Opera. */
            window.onmousewheel = wheel;
        }
    }

    // 启动监听
    startWheelListener();

    /**
     * 为指定元素增加鼠标滚轮事件
     * @param obj
     * @param callback
     */
    jQuery.fn.onMouseWheel = function (obj, callback) {
        // 检查是否重复
        for (var i = 0; i < _mouseWheelListeners.length; i++) {
            if ($(obj).attr("id") === _mouseWheelListeners[i].obj.attr("id")) {
                // 如果callback没有指定，删除监听。否则更新callback
                if (typeof callback === 'undefined') {
                    _mouseWheelListeners.splice(i, 1);
                }
                else {
                    _mouseWheelListeners[i].callback = callback;
                }
                return this;
            }
        }

        // 新注册
        _mouseWheelListeners.push({
            obj: $(obj),
            callback: callback
        });

        obj.onmousewheel = wheel;
        return this;
    };

    /**
     * 为Div增加自定义滚动功能
     * 要求容器内容全部放在一个div中，此div类名包含sweet-scroll-content（可自定义）
     * @param dir
     * @param opt
     * @returns {*}
     */
    jQuery.fn.scrollPanel = function (dir, opt) {
        var me = this;
        var baseOffset = 5;
        var minBarSize = 10;

        var width = this.width();
        var height = this.height();
        var contentWidth;
        var contentHeight;
        var barSize;
        var obj;
        var dragging = false;
        var VERTICAL = "vertical",
            HORIZON = "horizon",
            BOTH = "both";

        var config = {
            thick: 6,
            radius: 3,
            color: '#7E838B',
            opacity: 0.5,
            contentClass: "sweet-scroll-content"
        };

        $.extend(config, opt);

        // 修正样式
        var position = this.css("position");
        if (position !== 'absolute' && position !== "relative") {
            this.css("position", "relative");
        }
        this.css("overflow", "hidden");

        /**
         * 根据类名，获取内容Div
         * @returns {*}
         */
        function getContent() {
            var child = me.find(">." + config.contentClass);
            if (child.length > 0) {
                return child.first();
            }
            else {
                return me.children().first();
            }
        }

        /**
         * 拖动滚动条滚动开始事件的处理
         * @param scrollDir
         */
        function startScroll(scrollDir) {
            if (scrollDir === VERTICAL) {
                me.__verticalScrollBar.css("opacity", 1);
            }
            else if (scrollDir === HORIZON) {
                me.__horizonScrollBar.css("opacity", 1);
            }

            dragging = true;
        }

        /**
         * 拖动滚动条滚动结束事件的处理
         * @param scrollDir
         */
        function endScroll(scrollDir) {
            if (scrollDir === VERTICAL) {
                me.__verticalScrollBar.css("opacity", config.opacity);
            }
            else if (scrollDir === HORIZON) {
                me.__horizonScrollBar.css("opacity", config.opacity);
            }

            dragging = false;
        }

        /**
         * 按指定偏移，移动滚动条和内容Div
         * @param left
         * @param top
         * @returns {boolean}
         */
        function scroll(left, top) {
            var ret = false;
            contentWidth = getContent().externalWidth();
            contentHeight = getContent().externalHeight();
            width = me.width();
            height = me.height();

            // 垂直方向
            if ($.isNumeric(top) && me.__verticalScrollBar && contentHeight > height) {
                // 防止滚动超出范围
                if (top < baseOffset) {
                    top = baseOffset;
                }

                var maxTop = me.height() - baseOffset - me.__verticalScrollBar.outerHeight(true);
                if (top > maxTop) {
                    top = maxTop;
                }

                // 判断是否需要滚动
                var oldTop = parseInt(me.__verticalScrollBar.css("top"), 10) || 0;
                if (top !== oldTop) {
                    me.__verticalScrollBar.css("top", top);

                    // 滚动内容div
                    top = Math.ceil(((top - baseOffset) / (maxTop - baseOffset)) * (contentHeight - height));
                    getContent().css("top", 0 - top);

                    ret = true;
                }
            }

            // 水平方向
            if ($.isNumeric(left) && me.__horizonScrollBar) {
                // 防止滚动超出范围
                if (left < baseOffset) {
                    left = baseOffset;
                }

                var maxLeft = me.width() - baseOffset - me.__horizonScrollBar.outerWidth(true);
                if (left > maxLeft) {
                    left = maxLeft;
                }

                // 判断是否需要滚动
                var oldLeft = parseInt(me.__horizonScrollBar.css("top"), 10) || 0;
                if (left !== oldLeft) {
                    me.__horizonScrollBar.css("left", left);

                    // 滚动内容div
                    left = Math.ceil(((left - baseOffset) / (maxLeft - baseOffset)) * (contentWidth - width));
                    getContent().css("left", 0 - left);

                    ret = true;
                }
            }

            return ret;
        }

        /**
         * 创建滚动条div
         * @param {String} dir 方向
         */
        function createScoller (dir) {
            var width, height;
            var right = null,
                bottom = null,
                top = null,
                left = null;
            var scroller;

            // 创建div
            if (dir === VERTICAL && !me.__verticalScrollBar) {
                width = config.thick;
                height = 0;
                right = 3;
                top = baseOffset;
                scroller = me.__verticalScrollBar = $("<div>");
            }
            else if (dir === HORIZON && !me.__horizonScrollBar) {
                width = 0;
                height = config.thick;
                bottom = 3;
                left = baseOffset;
                scroller = me.__horizonScrollBar = $("<div>");
            }
            else {
                return;
            }

            // 设置属性
            scroller.css("width", width)
                .css("border-radius", config.radius)
                .css("background-color", config.color)
                .css("opacity", config.opacity)
                .css("z-index", 10)
                .css("position", "absolute")
                .css("top", top)
                .css("right", right)
                .css("bottom", bottom)
                .css("left", left)
                .appendTo(me);

            // 拖动滚动条事件
            scroller.sweetDrag(
                function () {
                    startScroll(dir);
                },
                function () {
                    endScroll(dir);
                },
                function (event, offsetX, offsetY) {
                    if (dir === VERTICAL) {
                        scroll(null, offsetY);
                    }
                    else {
                        scroll(offsetX, null);
                    }
                    return false;
                }
            );

            // 悬停事件
            scroller.hover(function() {
                scroller.css("opacity", 1);
            }, function() {
                scroller.css("opacity", config.opacity);
            });
        }

        /**
         * 更新滚动条大小
         * @param {String} dir 方向
         */
        function updateScrollerSize (dir) {
            var width, height;
            var contentWidth, contentHeight;

            // 垂直滚动条
            if (dir === VERTICAL) {
                contentHeight = getContent().outerHeight(true);
                height = me.height();

                // 内容高度超出容器高度，显示滚动条；否则，隐藏滚动条
                if (contentHeight > height) {
                    barSize = Math.floor((height - baseOffset * 2) * height / contentHeight);
                    if (barSize < minBarSize && minBarSize < height) {
                        barSize = minBarSize;
                    }
                    me.__verticalScrollBar.outerHeight(barSize, true)
                        .show();
                }
                else {
                    me.__verticalScrollBar.hide();
                    getContent().css('top', 0);
                }

            }
            // 水平滚动条
            else if (dir === HORIZON) {
                contentWidth = getContent().outerWidth(true);
                width = me.width();

                // 内容宽度超出容器宽度，显示滚动条；否则，隐藏滚动条
                if (contentWidth > width) {
                    barSize = Math.floor((width - baseOffset * 2) * width / contentWidth);
                    if (barSize < minBarSize && minBarSize < width) {
                        barSize = minBarSize;
                    }
                    me.__horizonScrollBar.outerWidth(barSize, true)
                        .show();
                }
                else {
                    me.__horizonScrollBar.hide();
                    getContent().css('left', 0);
                }
            }
        }

        // 如果输入参数为空，隐藏滚动条
        if ($.type(dir) === 'undefined' || dir === null) {
            if (this.__verticalScrollBar instanceof $) {
                this.__verticalScrollBar.hide();
                scroll(null, -2000);
            }
            if (this.__horizonScrollBar instanceof $) {
                this.__horizonScrollBar.hide();
                scroll(-2000, null);
            }

            return this;
        }

        // 内容区域修改为绝对定位
        getContent().css("position", "absolute");

        // 垂直滚动条
        if (dir === VERTICAL || dir === BOTH) {
            // 创建垂直滚动条，并绑定事件
            if ($.type(this.__verticalScrollBar) === 'undefined') {
                createScoller(VERTICAL);

                // 鼠标滚轮事件（暂时只支持垂直方向）
                obj = this.get(0);
                this.onMouseWheel(obj, function (event, data) {
                    var delta = (parseInt(me.__verticalScrollBar.css("top"), 10) || 0) - data.delta * 10;
                    if (scroll(null, delta) === true) {
                        return false;
                    }
                });
            }

            // 刷新滚动条大小
            updateScrollerSize(VERTICAL);
        }

        // 水平滚动条
        if (dir === HORIZON || dir === BOTH) {
            // 创建水平滚动条，并绑定事件
            if ($.type(this.__horizonScrollBar) === 'undefined') {
                createScoller(HORIZON);
            }

            // 刷新滚动条大小
            updateScrollerSize(HORIZON);
        }

        return this;
    };
})(jQuery);

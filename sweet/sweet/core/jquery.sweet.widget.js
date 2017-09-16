/*
 * jQuery UI sweet.widget 1.0
 * 所有组件的基础
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function($, undefined) {

    /**
     * 扩展jquery ui功能，使单个组件可以分解多个
     * @param {String} name 名称
     * @param {Function} fn 扩展的功能函数
     */
    $.widget.addExtendListener = function(name, fn) {
        var temp=name.split( "." ),
                $prototype = $[temp[0]][temp[1]].prototype;
        if ($prototype) {
            $prototype._extendHandlers.push(fn);
        } else {
            $prototype = [];
            $prototype._extendHandlers.push(fn);
        }
    };

    // 保存组件对象
    var uuid = 1000;

    $.widget("sweet.widget", /** @lends Sweet.widget.prototype */{
        version: "1.0",
        sweetWidgetName: "[widget]:",
        /**
         * @private
         * 子类支持事件名称，由子类填写
         */
        eventNames: /** @lends Sweet.widget.prototype*/{
            /**
             * @event
             * @description 渲染完毕事件(me)
             */
            rendered: "渲染完毕事件"
        },
        /**
         * @private
         * 浮动窗口背景色样式
         */
        floatBgClass: "sweet-float-bg",
        winBgClass: "sweet-win-bg",
        options: /** @lends Sweet.widget.prototype */{
            /**
             * @description 组件ID，如果不填，则由系统自动生成
             * @type {String}
             * @default null
             */
            id: null,
            /**
             * @description 获取值的id
             * @type {String}
             * @default null
             */
            vID: null,
            /**
             * @description 组件名称
             * @type {String}
             * @default null
             */
            name: null,
            /**
             * @description 组件宽度，可设定百分比或绝对像素值
             * @type {String/Number}
             * @default 100%
             */
            width: "100%",
            /**
             * @description 组件高度，可设定百分比或绝对像素值
             * @type {String/Number}
             * @deault 100%
             */
            height: "100%",
            /**
             * @description 组件是否显示
             * @type {Boolean}
             * @default true
             */
            visible: true,
            /**
             * @description 样式名称，只允许添加padding,margin等样式，不允许添加颜色，图片等资源
             * @type {String}
             * @default ""
             */
            widgetClass: "",
            /**
             * @description 组件渲染的目标标签ID
             * @type {String}
             * @default null
             */
            renderTo: null,
            /**
             * @description 组件监听事件
             * @type {Object}
             * @default null
             */
            listenerEvents: null
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
            this.doLayout();
        },
        /**
         * @description 判断当前组件是隐藏还是显示状态: true:显示， false:隐藏状态
         * @returns {boolean} 返回当前组件是隐藏还是显示状态
         */
        isVisible : function(){
            return this.visible;
        },
        /**
         * @description 组件渲染
         * @param {String} id 组件ID
         */
        render: function(id) {
            var me = this;
            // 是否已创建
            if (me.rendered) {
                return;
            }
            var timeBegin = $.date.getMilliseconds(), timeEnd, options = me.options;
            // 渲染失败，直接返回，后续的设置毫无意义
            if (!me._render(id)) {
                return;
            }
            me.setWH(options.width, options.height);
            timeEnd = $.date.getMilliseconds();
            me._info("Render. Time-consuming = " + (timeEnd - timeBegin) + "ms");
            if (me.rendered) {
                me._triggerHandler(me, "rendered");
            }
        },
	/**
         * @description 取得组件中的图片的Canvas对象(原生DOM对象)，如果是容器，返回的是容器中的所有图片整合成一起的图片
         * @returns {Object} return the canvas object of the image
         */
        getCanvasObject : function(){
            var me = this;
            
            return me._getCanvasObject();
        },
        /**
         * @private
         * @description 如果没有实现的子类，返回null，表示没有此类对象
         * @returns {Object} 返回null，表示没有此类对象
         */
        _getCanvasObject : function(){
            return null;
        },
        /**
         * @description 组件宽度、高度发生变化后调用，进行页面重绘。
         * @param {Boolean} force 是否强制刷新，不管大小是否发生变化
         */
        doLayout: function(force) {
            // 不允许执行doLayout的情况
            // 1. 渲染之前也不应该进行doLayout
            // 2. 隐藏状态下，不需要doLayout，此时不能取到正确的DOM尺寸
            if (!this.rendered || !this.renderEl.is(":visible")) {
                this.lastLayoutWidth = 0;
                this.lastLayoutHeight = 0;
                return;
            }

            // 避免在同一尺寸下重复执行无谓的doLayout
            var width = this.getWidth();
            var height = this.getHeight();
            
            // 如果宽度、高度有一个为0，返回
            if (0 === width || (0 === height && this.options.height !== "auto")) {
                return;
            }

            if (this.lastLayoutWidth === width && this.lastLayoutHeight === height) {
                if (force !== true) {
                    return;
                }
            }
            else {
                this.lastLayoutWidth = width;
                this.lastLayoutHeight = height;
            }

            // 启动容器大小变化监控
            $("body").onResize();

            var timeBegin = $.date.getMilliseconds(), timeEnd, options = this.options;
            this._doLayout();
            timeEnd = $.date.getMilliseconds();
            this._info("Do Layout. Time-consuming = " + (timeEnd - timeBegin) + "ms");
        },
        /**
         * @description 设置值
         * @param {Object/Array} obj 值对象
         */
        setValue: function(obj) {
            if ($.isUndefined(obj)) {
                return;
            }
            this._hideEmptyText(obj);
            var timeBegin = $.date.getMilliseconds(), timeEnd;
            this.options.value = $.objClone(obj);
            this._setValue(obj);
            timeEnd = $.date.getMilliseconds();
            this._info("Set value. Time-consuming = " + (timeEnd - timeBegin) + "ms");
        },
        /**
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        setWidth: function(width) {
            var me = this;

            // 登记resize事件
            if ($.type(width) === "string" && me.renderEl) {
                me.renderEl.onResize(function () {
                    me.doLayout();
                });
            }

            me.options.width = width;

            // 更改_initConfig记录的width/height的情况：
            // 1. 修改百分比
            // 2. 修改绝对值
            // 3. 绝对值修改为百分比
            // 另，如果修改了百分比值，需要手动调用父级容器的doLayout刷新布局
            if ($.type(width) === "string" ||
                ($.type(width) === "number" && $.type(me._initConfig.width) === "number")) {
                me._initConfig.width = width;
            }

            me._setWidth(width);
            me.doLayout();
        },
        /**
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        setHeight: function(height) {
            var me = this;

            // 登记Resize事件
            if ($.type(height) === "string" && me.renderEl) {
                me.renderEl.onResize(function () {
                    me.doLayout();
                });
            }

            me.options.height = height;

            // 更改_initConfig记录的width/height的情况：
            // 1. 修改百分比
            // 2. 修改绝对值
            // 3. 绝对值修改为百分比
            // 另，如果修改了百分比值，需要手动调用父级容器的doLayout刷新布局
            if ($.type(height) === "string" ||
                ($.type(height) === "number" && $.type(me._initConfig.height) === "number")) {
                me._initConfig.height = height;
            }

            me._setHeight(height);
            me.doLayout();
        },
        /**
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        setWH: function(width, height) {
            var me = this;

            // 登记Resize事件
            if (($.type(width) === "string" || $.type(height) === "string") && me.renderEl) {
                me.renderEl.onResize(function () {
                    me.doLayout();
                });
            }

            me.options.width = width;
            me.options.height = height;

            // 更改_initConfig记录的width/height的情况：
            // 1. 修改百分比
            // 2. 修改绝对值
            // 3. 绝对值修改为百分比
            // 另，如果修改了百分比值，需要手动调用父级容器的doLayout刷新布局
            if ($.type(width) === "string" ||
                ($.type(width) === "number" && me._initConfig && $.type(me._initConfig.width) === "number")) {
                me._initConfig.width = width;
            }

            if ($.type(height) === "string" ||
                ($.type(height) === "number" && me._initConfig && $.type(me._initConfig.height) === "number")) {
                me._initConfig.height = height;
            }

            me._setWH(width, height);
            me.doLayout();
        },
        /**
         * @description 设置组件相对整个文档的上下左右偏移值
         * @param {String} h 水平方向位置，可选left/right
         * @param {String} v 垂直方向位置，可选top/bottom
         * @param {Object} offset 偏移值，格式为{"top": number, "left": number}，例如{"top": 10, "left": 10}
         */
        setOffset: function(h, v, offset) {
            var me = this,
                    logPrefix = "Function setOffset(): ";
            if ($.isNull(offset)) {
                me._error(logPrefix + "The parameter is null!");
                return;
            }
            
            function _offset() {
                var top,
					align = Sweet.constants.align,
                    left;
                if (align.LEFT === h) {
                    left = offset.left;
                    if (align.TOP === v) {
                        top = offset.top;
                    } else if (align.BOTTOM === v) {
                        top = $(document).height() - me.getHeight() - offset.top;
                    } else {
                        me._error(logPrefix + "Unsupported parameter. v = " + h);
                        return;
                    }
                } else if (align.RIGHT === h) {
                    left = $(document).width() - me.getWidth() - offset.left;
                    if (align.TOP === v) {
                        top = offset.top;
                    } else if (align.BOTTOM === v) {
                        top = $(document).height() - me.getHeight() - offset.top;
                    } else {
                        me._error(logPrefix + "Unsupported parameter. v = " + h);
                        return;
                    }
                } else {
                    me._error(logPrefix + "Unsupported parameter. h = " + h);
                    return;
                }

                me.renderEl.css({"position": "absolute", "top": top, "left": left});
            }
            
            _offset();
            $(document).onResize(function(){
                Sweet.Task.Delay.start({
                    id: "sweet-setoffset-delay",
                    run: function() {
                        _offset();
                    },
                    delay: 350
                });
            });
        },
        /**
         * @description 返回组件宽度
         * @return {Number} 返回组件宽度
         */
        getWidth: function() {
            var me = this,
                    width;
            width = me._getWidth();
            
            return "number" !== typeof width ? 0 : width;
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        getHeight: function() {
            var me = this,
                    height;
            height = me._getHeight();
            
            return "number" !== typeof height ? 0 : height;
        },
        /**
         * @description 获取值
         * @return {Object/Array} obj 返回值
         */
        getValue: function() {
            var timeBegin = $.date.getMilliseconds(), timeEnd, obj;
            obj = this._getValue();
            timeEnd = $.date.getMilliseconds();
            this._info("Get value. Time-consuming = " + (timeEnd - timeBegin) + "ms");
            return obj;
        },
        /**
         * 注册监听事件，只支持一次注册，第二次注册会覆盖第一次的注册
         * @param {String} eventName 事件名称
         * @param {Object} callBack 回调函数
         */
        addListener: function(eventName, callBack) {
            var me = this, handlers = {};
            if (!$.isNull(eventName)) {
                handlers[eventName] = callBack;
            }
            me.handlers = $.extend({}, handlers, me.handlers);
			// 组件支持事件类型校验,组件非禁用状态时，不触发事件，由子类控制
			$.each(handlers, function(handlerName, func){
				if ($.isNull(me.eventNames[handlerName])) {
					throw new Error("Unsupport event! Event name: " + handlerName);
				}
			});
			me._addListener(eventName, callBack);
        },
        /**
         * 删除注册监听事件
         * @param {String} eventName 事件名称
         */
        removeListener: function(eventName) {
            var me = this;
            me.handlers = me.handlers || {};
			me._removeListener(eventName);
			if($.isNull(eventName)){
				delete me.handlers;
			} else {
				delete me.handlers[eventName];
			}
        },
        /**
         * @description 返回组件的jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        getWidgetEl: function(original) {
            var me = this, obj;
            if (me.renderEl) {
                obj = original ? me.renderEl[0] : me.renderEl;
            } else {
                obj = me._getWidgetEl(original);
            }
            
            // 标识，垃圾回收使用
            me.getWidgetElFlag = true;
            
            return obj;
        },
        /**
         * @private
         * @description 隐藏emptyText，需要子组件实现
         */
        _hideEmptyText: $.noop,
        /**
         * @private
         * @description 返回组件jquery对象，适用于未指定渲染ID时返回对象，需要子组件实现
         */
        _getWidgetEl: $.noop,
        /**
         * @private
         * 子类扩展实现注册监听
         */
        _addListener: $.noop,
        /**
         * @private
         * 删除注册监听事件，子类继承实现
         */
        _removeListener: $.noop,
        /**
         * @private
         * @description 组件配置属性校验，比如属性间互斥等
         */
        _optionsValidate: $.noop,
        /**
         * @private
         * @description 组件渲染, 子类继承实现
         * @param {String} id 宿主ID
         * @return {Boolean} true:渲染成功 false:渲染失败
         */
        _render: function(id) {
            var me = this;
            if (!id || me.rendered) {
                return false;
            }
            if (!me.renderEl) {
                // 创建宿主元素
                if (!me._createRenderEl(id)) {
                    return false;
                }
            }
            
            return true;
        },
        /**
         * @private
         * @description 组件宽度、高度发生变化后调用，进行页面重绘，子类继承实现。
         */
        _doLayout: $.noop,
        /**
         * @private
         * @description 关闭浮动窗口，子类继承实现。框架统一调用。
         */
        _closeFloatPanel: $.noop,
        /**
         * @private
         * @description 设置值, 子类继承实现
         */
        _setValue: $.noop,
        /**
         * @private
         * @description 获取值, 子类继承实现
         */
        _getValue: $.noop,
        /**
         * @private
         * @description 设置组件宽度，子类继承实现
         */
        _setWidth: $.noop,
        /**
         * @private
         * @description 设置组件高度，子类继承实现
         */
        _setHeight: $.noop,
        /**
         * @private
         * @description 设置组件宽度、高度，子类继承实现
         */
        _setWH: $.noop,
        /**
         * @private
         * @description 返回组件宽度，子类继承实现
         */
        _getWidth: $.noop,
        /**
         * @private
         * @description 返回组件高度，子类继承实现
         */
        _getHeight: $.noop,
        /**
         * @private
         * 组件创建前，初始化操作，子类继承实现
         */
        _beforeCreateSweetWidget : $.noop,
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget : $.noop,
        /**
         * @private
         * @description 创建组件
         */
        _create: function() {
            // 是否已创建
            if (this.rendered) {
                return;
            }

            var me = this, timeBegin = $.date.getMilliseconds(), timeEnd, options = me.options, listeners;
            // 标志是否允许进行自动doLayout
            me._frozen = false;
            me.__frozenDoLayout = $.noop;
            me.__frozenDoLayout2 = $.noop;
            
            me.visible = me.options.visible;
            if (!me.handlers) {
                me.handlers = {};
            }
            // id不存在, 随机分配
            if ($.isNull(options.id)) {
                options.id = "sweet-" + uuid++;
            }

            if (!$.isNull(Sweet._widgets[options.id])) {
                me._error("Duplicate ID! id=" + options.id);
                return;
            }
            listeners = options["listenerEvents"];
            if (!$.isEmptyObject(listeners)) {
                $.each(listeners, function(eventName, callback) {
                    me.addListener(("" + eventName), callback);
                });
            }
            // 保存初始配置信息
            me._initConfig = $.objCopy(me.options);

            // 创建
            me._beforeCreateSweetWidget();
            me._createSweetWidget();
            me._afterCreateSweetWidget();
            
            // 提供组件扩展功能，将大组件拆分成多个小组件，业务也可以基于此扩展组件
            if (me._extendHandlers) {
                $(me._extendHandlers).each(function(){
                    this.call(me);
                });
            }
            
            // 渲染
            me._render(options.renderTo);

            // 渲染后设置大小才生效
            me.setWH(options.width, options.height);

            // 保存组件
            Sweet._widgets[options.id] = me;

            timeEnd = $.date.getMilliseconds();
            me._info("Create widget. Time-consuming = " + (timeEnd - timeBegin) + "ms");
            if (me.rendered) {
                me._triggerHandler(me, "rendered");
            }
        },
        /**
         * @private
         * @description 创建容器, 子类继承实现
         * @param {String} id 页面原始ID
         * @return {Boolean} true:创建成功 false:创建失败
         */
        _createRenderEl: function(id) {
            var me = this,
                    options = me.options;
            if (id && !me.renderEl) {
                me.renderEl = $("#" + id);
                if (0 === me.renderEl.length) {
                    return false;
                }
                me.options.renderTo = id;
            }
            if (!options.visible) {
                me.renderEl.hide();
            }
            
            return true;
        },
        /**
         * @private
         * @description 子类继承实现, 绘制具体组件
         */
        _createSweetWidget: $.noop,
        /**
         * @description 销毁组件, 释放资源
         */
        destroy: function() {
			var me = this;
            // 频繁调用destroy时，减少tooltip.reset的调用
            Sweet.Task.Delay.start({
                id: "sweet-widgets-destroy-reset-tooltip",
                run: function() {
                    Sweet.ToolTip.reset();
                },
                delay: 100
            });
			me.removeListener();
			//子类实现销毁bind的事件等，dom销毁统一在_destroyDom中进行
            me._destroyWidget();
			me._destroyDom();
            if(!$.isNull(me.options)){
                delete Sweet._widgets[me.options.id];
            }
			//删除对象的所有属性
            for (var v in me) {
                if (me.hasOwnProperty(v)) {
					delete me[v];
                }
            }
        },
        /**
         * @description 销毁Dom, 区别于destroy
         * @private
         */
        _destroyDom: function() {
            var me = this;
            if(me.renderEl) {
                me.renderEl.empty();
                me.renderEl = null;
                me.rendered = false;
            }
        },
        /**
         * @private
         * @description 子类继承实现
         */
        _destroyWidget: $.noop,
        /**
         * 设置是否允许执行doLayout，包括doLayout和_doLayout
         * @param {Boolean} flag 标志
         * @private
         */
        _freeze: function (flag) {
            "use strict";
			var me = this;
            // 不需要重复设置同一状态
            if (me._frozen === flag) {
                return;
            }
            else {
                me._frozen = flag;
            }

            // 替换doLayout函数，以屏蔽原处理
            if (flag) {
                me.__frozenDoLayout = me.doLayout;
                me.__frozenDoLayout2 = me._doLayout;
                me.doLayout = $.noop;
                me._doLayout = $.noop;
            }
            else {
                me.doLayout = me.__frozenDoLayout;
                me._doLayout = me.__frozenDoLayout2;
                me.__frozenDoLayout = $.noop;
                me.__frozenDoLayout2 = $.noop;
            }
        },
        /**
         * @private
         * @description 触发body上的click事件
         */
        _triggerBodyClick: function() {
            $(document.body).click();
        },
        /**
         * @private
         * @description 触发注册事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据
         */
        _triggerHandler: function(e, eName, data) {
            var me = this,
                    result;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    result = func.call(null, e, data);
                }
            });
            return result;
        },
        /**
         * @private
         * @description 禁止选中
         */
        _unselectable: function() {
            return false;
        },
        /**
         * @private
         * @description error级别日志打印
         * @param {String} msg 打印信息
         */
        _error: function(msg) {
            if (!sweetDebug) {
                return;
            }
            $.error("[ERROR]" + this.sweetWidgetName + msg);
        },
        /**
         * @private
         * @description info级别日志打印
         * @param {String} msg 打印信息
         */
        _info: function(msg) {
            if (!sweetDebug) {
                return;
            }
            if (Sweet.constants.logLevel.INFO === Sweet.logLevel) {
                $.log("[INFO]" + this.sweetWidgetName + msg);
            }
        }
    });
    /**
     * @description SweetUI组件基类，不能直接使用
     * @name Sweet.widget
     * @class
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * </pre>
     */
    Sweet.widget = $.sweet.widget;
}(jQuery));

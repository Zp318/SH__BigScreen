/**
 * @fileOverview
 * <pre>
 * 建立socket连接组件
 * 2013/8/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 * @history
 * <pre>
 * </pre>
 */
(function ($, undefined) {
    var SS_IDLE = 0,            // 空闲，未创建
        SS_CONNECTING = 1,      // 正在连接
        SS_CONNECTED = 2,       // 已连接
        SS_CLOSED = 3,          // 无端关闭
        SS_UNSUPPORTED = -1;    // 不支持Web Socket

    var SocketID = 0;

    /**
     * @description 建立Web Socket链接
     * @name Sweet.Socket
     * @class
     * @extends base.js
     * @requires <pre>
     * base.js
     * sweet.base.js
     * </pre>
     * @example
     */
    Sweet.Socket = Sweet.Base.extend(/** @lends Sweet.Socket.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Socket]",
        /**
         * @private
         * @description 定义事件名称
         */
        eventNames: /** @lends Sweet.Socket.prototype*/{
            /**
             * @event
             * @description 连接建立成功
             * @param {Object} event 事件对象
             */
            open: "连接建立成功",
            /**
             * @event
             * @description 接收到消息
             * @param {Object} event 事件对象
             * @param {String} message 消息内容
             */
            message: "接收到消息",
            /**
             * @event
             * @description 连接关闭
             * @param {Object} event 事件对象
             */
            close: "连接关闭",
            /**
             * @event
             * @description 发生异常
             * @param {Object} event 事件对象
             */
            error: "发生异常"
        },
        /**
         * @description 设置建立链接的数据
         * @param {Object} param
         */
        init: function (param) {
            if ($.isNull(param)) {
                return;
            }

            this.options = /** @lends Sweet.Socket.prototype*/{
                /**
                 * Web Socket服务地址，不包含host部分
                 * @type String
                 * @default ""
                 */
                url: "",
                /**
                 * 是否自动重新连接
                 * @type Boolean
                 * @default true
                 */
                autoRetry: true,
                /**
                 * 自动重试次数，-1表示无限次
                 * @type Number
                 * @default -1
                 */
                retryTimes: -1,
                /**
                 * 自动重试间隔，单位秒
                 * @type Number
                 * @default 5
                 */
                retryInterval: 5
            };

            this.options = $.extend({}, this.options, param);
            this.socket = null;
            this.status = SS_IDLE;
            this.handlers = {};

            this.retryTimer = "Sweet.Socket-" + (SocketID++);
            this.retried = 0;
        },

        /**
         * 建立链接
         * @returns {boolean} 是否成功
         */
        connect: function () {
            var me = this,
                url = "";

            if (me.socket) {
                return true;
            }
            me.status = SS_CONNECTING;

            // 构造web socket链接
            if (window.location.protocol === 'http:') {
                url = 'ws://' + window.location.host + me.options.url;
            }
            else {
                url = 'wss://' + window.location.host + me.options.url;
            }

            // 创建web socket
            // 注：如果指定的连接地址不正确，socket会先后触发error和close事件
            if ("WebSocket" in window) {
                me.socket = new WebSocket(url);
            }
            else if ("MozWebSocket" in window) {
                me.socket = new MozWebSocket(url);
            }
            else {
                me._error('WebSocket is not supported by this browser.');
                me.status = SS_UNSUPPORTED;
                return false;
            }

            // 注册事件处理
            me.socket.onopen = function (event) {
                me._onOpen(event);
            };
            me.socket.onclose = function (event) {
                me._onClose(event);
            };
            me.socket.onmessage = function (event) {
                me._onMessage(event);
            };
            me.socket.onerror = function (event) {
                me._onError(event);
            };

            return true;
        },

        /**
         * 主动断开链接
         */
        close: function () {
            var me = this;

            me._stopRetry();
            me.status = SS_IDLE;

            if (null !== me.socket) {
                me.socket.close();
                me.socket = null;
            }
        },

        /**
         * 发送消息
         * @param {string} 发送的消息内容
         */
        send: function (message) {
            var me = this,
                socket = me.socket;

            if (socket && me.status === SS_CONNECTED) {
                try {
                    socket.send(message);
                    return message.length;
                }
                catch (e) {
                    me._error("Send message failed, detail:" + e);
                    return 0;
                }
            }
            else {
                me._error("Web Socket is not connected yet.");
                return -1;
            }
        },

        /**
         * @description 注册监听
         * @param {String} event 事件名称
         * @param {Object} handler 注册监听，格式为{eventName: Function, scope: }
         */
        addListener: function (event, handler) {
            var me = this;

            if ($.isPlainObject(event) && !handler) {
                me.handlers = $.extend({}, me.handlers || {}, handler);
            }
            else {
                me.handlers[event] = handler;
            }
        },
        /**
         * @description 删除监听
         * @param {String} eventName 事件名称
         */
        removeListener: function (eventName) {
            delete this.handlers[eventName];
        },

        /**
         * @private
         * @description 触发注册事件
         * @param {String} name  事件名称
         * @param {Object} event 事件对象
         * @param {Object} data 数据
         */
        _trigger: function (name, event, data) {
            var me = this,
                result;

            if ($.isNull(me.handlers)) {
                return;
            }

            $.each(me.handlers, function (key, handler) {
                // 回调注册事件
                if (name === key && $.isFunction(handler)) {
                    result = handler(event, data);
                    return false;
                }
            });

            return result;
        },

        /**
         * 连接成功事件处理
         * @param event
         * @private
         */
        _onOpen: function (event) {
            this.status = SS_CONNECTED;
            this.retried = 0;
            this._stopRetry();
            this._trigger("open", event, null);
        },

        /**
         * 接收到消息事件处理
         * @param event
         * @private
         */
        _onMessage: function (event) {
            if (this.status !== SS_CONNECTED) {
                this.status = SS_CONNECTED;
                this._stopRetry();
            }
            this._trigger("message", event, event.data);
        },

        /**
         * 关闭事件处理
         * @param event
         * @private
         */
        _onClose: function (event) {
            var me = this;

            // 主动关闭时，socket对象为空，且status为IDLE
            if (!me.socket || me.status === SS_IDLE) {
                return;
            }

            me.socket = null;
            me.status = SS_CLOSED;
            me._trigger("close", event, null);

            // 自动重连
            if (me.options.autoRetry) {
                me._startRetry();
            }
        },

        /**
         * 发生错误/异常
         * @param event
         * @private
         */
        _onError: function (event) {
            this._trigger("error", event, null);
        },

        /**
         * 重试连接
         * @private
         */
        _startRetry: function () {
            var me = this;

            // 判断重试次数
            if (me.options.retryTimes >= 0 && me.retried >= me.options.retryTimes) {
                me._stopRetry();
                return;
            }

            // 启动定时器
            // 注：Timeout是自动重复执行的，但是允许重复调用start，不需要先执行stop
            Sweet.Task.Timeout.start({
                id: me.retryTimer,
                run: function () {
                    me.retried++;
                    me.connect();
                },
                scope: me,
                interval: me.options.retryInterval * 1000
            });
        },

        /**
         * 停止重试连接
         * @private
         */
        _stopRetry: function () {
            Sweet.Task.Timeout.stop(this.retryTimer);
        }
    });
}(jQuery));
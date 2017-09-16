/**
 * @fileOverview  
 * <pre>
 * 数据处理类组件
 * 2013/4/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * @description 数据处理类组件基类
     * @name Sweet.Base
     * @class
     * @extends base.js
     * @requires
     * <pre>
     * base.js
     * </pre>
     * @example
     */
    Sweet.Base = Class.extend(/** @lends Sweet.Base.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Base]",
        /**
         * @description 注册监听
         * @param {Object} handler 注册监听，格式为{eventName: Function, scope: }
         */
        addListener: function(handler) {
            this.handlers = $.extend({}, this.handlers||{}, handler);
        },
        /**
         * @description 删除监听
         * @param {String} eventName 事件名称
         */
        removeListener: function(eventName) {
            if($.isNull(eventName)){
                this.handlers = null;
            } else {
                delete this.handlers[eventName];
            }
        },
        /**
         * @description 销毁组件, 释放资源
         */
        destroy: function() {
            this.removeListener();
            this._destroyWidget();
            for (var v in this) {
                if (this.hasOwnProperty(v)) {
                    this[v] = null;
                }
            }
        },
        /**
         * @private
         * @description 子类继承实现
         */
        _destroyWidget: $.noop,
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
}(jQuery));
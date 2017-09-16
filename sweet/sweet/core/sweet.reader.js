/**
 * @fileOverview  
 * <pre>
 * 解析数据类组件
 * 2013/4/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var beforeReadKey = "beforeRead",
            afterReadKey = "afterRead";

    /**
     * @description 解析类组件基类
     * @name Sweet.Reader
     * @class
     * @extends Sweet.Base
     * @requires
     * <pre>
     * base.js
     * sweet.base.js
     * </pre>
     * @example
     */
    Sweet.Reader = Sweet.Base.extend(/** @lends Sweet.Reader.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Reader]",
        /**
         * @description 初始化对象时调用，用于设置解析参数格式，由子类继承实现
         */
        init: function() {
        },
        /**
         * @description 解析数据
         * @param {Object} data 待处理数据
         */
        read: function(data) {
            // 触发beforeRead事件
            var tempData = this._beforeRead(data);
            var tempCloneData = $.objClone(tempData);
            tempCloneData = this._parse(tempCloneData);
            // 触发afterRead事件
            this._afterRead($.objClone(tempCloneData));
            return tempCloneData;
        },
        /**
         * @private
         * @description 数据返回前预处理
         * @param {Object} data 待处理数据
         */
        _beforeRead: function(data) {
            var tempData = data;
            if (this.handlers) {
                var beforeReadFunc = this.handlers[beforeReadKey];
                if (beforeReadFunc && $.isFunction(beforeReadFunc)) {
                    tempData = beforeReadFunc.call(this, data);
                }
            }
            return tempData;
        },
        /**
         * @private
         * @description 数据返回后处理
         * @param {Object} data 处理后数据
         */
        _afterRead: function(data) {
            if (this.handlers) {
                var afterReadFunc = this.handlers[afterReadKey];
                if (afterReadFunc && $.isFunction(afterReadFunc)) {
                    afterReadFunc.call(null, data);
                }
            }
        },
        /**
         * @private
         * @description 解析数据，由子类扩展具体解析功能
         * @param {Object} data 待处理数据
         */
        _parse: function(data) {
            return data;
        }
    });
}(jQuery));
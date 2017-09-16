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
    /**
     * @description 解析JSON格式组件
     * @name Sweet.Reader.JsonReader
     * @class
     * @extends Sweet.Reader
     * @requires
     * <pre>
     * base.js
     * sweet.base.js
     * sweet.reader.js
     * </pre>
     * @example
     */
    Sweet.Reader.JsonReader = Sweet.Reader.extend(/** @lends Sweet.Reader.JsonReader.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Reader-JsonReader]",
        /**
         * @description 设置解析JSON格式
         * @param {Object} format 格式
         */
        init: function(format) {
            if ($.isNotNull(format)) {
                this.format = format;
            } else {
                // 采用默认格式定义
                this.format = {
                    "root": "root",
                    "data": [
                        {"name": "text", mapping: "text"},
                        {"name": "value", mapping: "value"},
                        {"name": "data", mapping: "data"},
                        {"name": "children", mapping: "children", "children": true}
                    ]
                };
                // 是否采用默认格式
                this.defaultFormat = true;
            }
        },
        /**
         * @private
         * @description 解析JSON格式数据
         * @param {Object} data 待处理数据
         */
        _parse: function(data) {
            var me = this;
            if ($.isNull(data)) {
                this._error("Input data is null.");
                return;
            }

            // 如果采用默认格式，不需要再次解析
            if (this.defaultFormat) {
                return data;
            }

            // 解析转换数据
            var destData = data[this.format.root];
            var tempData = [];
            me._parseData(destData, tempData);

            return tempData;
        },
        /**
         * @private
         * @description 解析JSON格式数据
         * @param {Object} data 待处理数据
         * @param {Object} destData 处理后目标数据
         */
        _parseData: function(data, destData) {
            var me = this;
            if (!me.format.data) {
                return;
            }
            $.each(data, function(index, dataObj) {
                var tempObj = {};
                $.each(me.format.data, function(index, fObj) {
                    // 递归遍历子节点
                    if (fObj.children && dataObj[fObj.mapping]) {
                        var tempData = [];
                        me._parseData(dataObj[fObj.mapping], tempData);
                        tempObj[fObj.name] = tempData;
                    } else {
                        if ($.isNotNull(dataObj[fObj.mapping])) {
                            tempObj[fObj.name] = dataObj[fObj.mapping];
                        }
                    }
                });
                destData.push(tempObj);
            });
        }
    });
}(jQuery));
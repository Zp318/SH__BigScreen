/**
 * @fileOverview  
 * <pre>
 * 获取存储数据类组件，适用于图表组件
 * 2013/10/19
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * @description 获取存储数据组件，适用于图表组件
     * @name Sweet.Store.ChartStore
     * @class
     * @extends Sweet.Store
     * @requires
     * <pre>
     * base.js
     * sweet.base.js
     * sweet.store.js
     * </pre>
     * @example
     */
    Sweet.Store.ChartStore = Sweet.Store.extend(/** @lends Sweet.Store.ChartStore.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Store-ChartStore]",
        /**
         * @private
         * @description 对返回数据处理，判断是否追加数据
         * @param {Boolean} add true 追加
         * @param {Object/Array} data 数据
         */
        _pretreatmentData: function(data, add) {
            // 缓存请求加载的数据
            var me = this,
                    tempData = me.reader.read(data) || [];
            if (add) {
                me.allData = me.data.concat(tempData);
            } else {
                me.allData = tempData;
            }
            me.data = $.objClone(tempData);
        },
        /**
         * @private
         * @description 处理数据，区分缓存加载和后台加载
         */
        _dealData: function() {
            var me = this,
                    data;

            if (me.cache) {
                var start,
                        limit,
                        params = {},
                        tempData = me.data || [];
                // 优先查看this.params参数
                if (me.params && !$.isUndefined(me.params.start)) {
                    params = me.params;
                    // 再查看this.baseParams参数
                } else if (me.baseParams && !$.isUndefined(me.baseParams.start)) {
                    params = me.baseParams;
                }
                start = params.start || 0;
                limit = params.limit || me.data.length;
                data = tempData.slice(start, start + limit);
            } else {
                data = me.data || [];
            }

            return data;
        }
    });
}(jQuery));
/**
 * @fileOverview  
 * <pre>
 * 获取存储数据类组件，适用于表格组件
 * 2013/4/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var symbol = Sweet.constants.symbol;

    /**
     * @description 获取存储数据组件，适用于表格组件
     * @name Sweet.Store.GridStore
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
    Sweet.Store.GridStore = Sweet.Store.extend(/** @lends Sweet.Store.GridStore.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Store-GridStore]",
        /**
         * @description 设置当前页
         * @param {Number} currentPage 当前页
         */
        setCurrentPage: function(currentPage) {
            this._currentPage = currentPage;
        },
        /**
         * @description 返回操作后的数据，如过滤或排序后的数据
         * @returns {Array} 返回操作后的数据，如过滤或排序后的数据
         */
        getCurrentData : function(){
            var me = this;
            if (me.data && me.data.data) {
                return $.objClone(me.data.data);
            }
            return null;
        },
        /**
         * @description 加载数据
         * @param {Object} params 发送请求时可以追加参数
         * @param {Boolean} add 追加还是覆盖，默认覆盖
         * @param {String} eventName 指定触发的事件名称，可选
         * @param {Object} anotherParams 传递给注册函数的参数
         */
        load: function(params, add, eventName, anotherParams) {
            var me = this,
                filters, 
				orders;
                
            me._beforeLoad();
            if (me.cache && !me.isRequest) {
                me._resetParams(params);
				if($.isNotNull(params)){
					filters = params.filter;
					orders = params.order;
				}
                /**
                 * 如果有过滤，先进行过滤
                 */
                if($.isNotNull(filters) && filters.length > 0){
                    me.filter(params);
                    me.curFilters = filters;
                } else {
                    //如果清空过滤时，数据应该为缓存的所有数据
                    me.data.data = $.objClone(me.allData.data);
                    me.curFilters = [];
                }
                /**
                 * 如果有排序，进行排序
                 */
                if($.isNotNull(orders) && orders.length > 0){
                    me.sort(params);
                    me.curOrders = orders;
                } else {
                    me.curOrders = [];
                }
                /**
                 * 加载数据
                 */
                me.loadRecords(params);
            } else {
                if(me.cache){
                    me.isRequest = false;
                }
                /**
                 * 如果设置了cache，只发一次请求
                 */
                me._loadRemoteData(params, add, eventName, anotherParams);
            }
        },
        clearFilters : function(){
            var me = this;
            me.curFilters = [];
        },
        clearOrders : function(){
            var me = this;
            me.curOrders = [];
        },
        /**
         * @private
         * @description 设置数据分页信息
         * @param {Object} page 分页信息
         */        
        _setPage: function(page) {
            var me = this;
            $.extend(me.baseParams, {"start": page.start, "limit": page.limit});
        },
        /**
         * @private
         * @description 设置数据分页信息
         * @param {Object} page 分页信息
         */
        _setDataPage: function(page) {
            var me = this;
            $.extend(me.data.page, page);
            me._setPage(page);
        },
        /**
         * @private
         * @description 设置数据分页信息
         * @param {Object} page 分页信息
         */
        setDataPage: function(page) {
            var me = this;
            me._setDataPage(page);
        },
        /**
         * @private
         * @description 处理数据，区分缓存加载和后台加载
         */
        _dealData: function() {
            var me = this;

            if (me.cache) {
                var start, limit, params = {};
                var data;
                var tempData = me.data.data || [];
                var finalData;
                
                //更新total值
                if(me.data.page){
                    me.data.page.total = tempData.length;
                }
                // 先删除me.data的数据部分
                delete me.data.data;
                finalData = $.objClone(me.data);

                // 优先查看this.params参数
                if (me.params) {
                    params = me.params;
                    // 再查看this.baseParams参数
                } else if (me.baseParams) {
                    params = me.baseParams;
                }
                start = params.start || 0;
                limit = params.limit || tempData.length;
                
                // 如果是第一页
                if (me._currentPage && 1 === me._currentPage) {
                    start = 0;
                    me._currentPage = null;
                    if (!finalData.page) {
                        finalData.page = {};
                    }
                    finalData.page.currentPage = 1;
                } else if (finalData.page && 1 === finalData.page.currentPage) {
                    start = 0;
                }
                
                data = tempData.slice(start, start + limit);
                finalData.data = data;
                me.data.data = tempData;

                return finalData;
            }

            return me.data;
        },
        /**
         * @private
         * @description 对返回数据处理，判断是否追加数据
         * @param {Boolean} add true 追加
         * @param {Object/Array} data 数据
		 * @param {String} eventName 事件名称
         */
        _pretreatmentData: function(data, add, eventName) {
            // 缓存请求加载的数据
            var me = this,
                    tempData = me.reader.read(data) || [];
            me._saveAllData(tempData, add);
            me._saveCurrentData(tempData, add, eventName);
            if(add){
                var filters = me.curFilters;
                var orders = me.curOrders;
                /**
                 * 如果有过滤，对追加完成的先进行过滤
                 */
                if($.isNotNull(filters) && filters.length > 0){
                    me.filter({filter : filters});
                }
                /**
                 * 如果有排序，进行排序
                 */
                if($.isNotNull(orders) && orders.length > 0){
                    me.sort({order : orders});
                }
            }
        },
        /**
         * @private
         * @description 保存所有数据
         * @param {Object/Array} data 数据
         * @param {Boolean} add true 追加
         */
        _saveAllData: function(data, add) {
            var me = this, temp = JSON.parse(JSON.stringify(data));
            if (add) {
                // 保存所有数据
                if ($.isPlainObject(me.allData)) {
                    if ($.isPlainObject(temp)) {
                        me.allData.data = me.allData.data.concat(temp.data);
                    } else {
                        me.allData.data = me.allData.data.concat(temp);
                    }
                } else {
                    if ($.isPlainObject(temp)) {
                        me.allData = me.allData.concat(temp.data);
                    } else {
                        me.allData = me.allData.concat(temp);
                    }
                }
            } else {
                me.allData = temp;
            }
        },
        /**
         * @private
         * @description 保存所有数据
         * @param {Object/Array} data 数据
         * @param {Boolean} add true 追加
		 * @param {String} eventName 事件名称
         */
        _saveCurrentData: function(data, add, eventName) {
            var me = this, temp = data;
            if (add && eventName !== "setTreeData") {
                // 保存所有数据
                if ($.isPlainObject(me.data)) {
                    if ($.isPlainObject(temp)) {
                        me.data.data = me.data.data.concat(temp.data);
                    } else {
                        me.data.data = me.data.data.concat(temp);
                    }
                } else {
                    if ($.isPlainObject(temp)) {
                        me.data = me.data.concat(temp.data);
                    } else {
                        me.data = me.data.concat(temp);
                    }
                }
            } else {
                me.data = temp;
            }
        },
        /**
         * @description 返回过滤后的数据
         * @param {Object} obj 参数，格式为
         *  {
         *      start: {Number},
         *      limit: {Number},
         *      filter: [Array],  例[{name: , type: , value: {symbol: , value: }}, ...]
         *      order: [Array]    例[{name: , order: }, ...]
         *  }
         * @return {Array} 返回过滤后的数据
         */
        filter: function(obj) {
            this._beforeLoad();
            var me = this, i = 0, j = 0, filters = obj.filter, type,value, key,temp,text,
                    dataType = Sweet.constants.dataType,
                    tempData = me.allData.data || [];
            
            if(me.cache){
                if(tempData.length === 0){
                    tempData = me.data.data || [];
                }
                for(i = 0; i < filters.length; i++){
                    temp = filters[i];
                    key = temp.name;
                    type = temp.type;
                    value = temp.value;
                    text = temp.text;
                    switch(type) {
                        // 列表
                        case dataType.LIST : 
                            if($.isNotNull(text)){
                                var fdata = [];
                                for(j = 0; j < tempData.length; j++){
                                    var tv = tempData[j][key];
                                    if($.isPlainObject(tv)){
                                        tv = tv.text;
                                    }
                                    //由于前台过滤，value使用其中的text，后台时使用其中的value
                                    if(me._filterList(tv, text.value)){
                                        fdata.push(tempData[j]);
                                    }
                                }
                                tempData = fdata;
                            }
                            break;
                        // 字符串
                        case dataType.STRING : 
                            if($.isNotNull(value)){
                                var fdata = [];
                                for(j = 0; j < tempData.length; j++){
                                    var tv = tempData[j][key];
                                    if($.isPlainObject(tv)){
                                        tv = tv.text;
                                    }
                                    if(me._filterString(tv, value.symbol, value.value)){
                                        fdata.push(tempData[j]);
                                    }
                                }
                                tempData = fdata;
                            }
                            break;
                        // 数值
                        case dataType.NUMBER : 
                            if($.isNotNull(value)){
                                var fdata = [];
                                for(j = 0; j < tempData.length; j++){
                                    var tv = tempData[j][key];
                                    if($.isPlainObject(tv)){
                                        tv = tv.text;
                                    }
                                    if(me._filterNumber(tv, value)){
                                        fdata.push(tempData[j]);
                                    }
                                }
                                tempData = fdata;
                            }
                            break;
                        // 日期
                        case dataType.DATE : 
                            if($.isNotNull(value)){
                                var fdata = [];
                                for(j = 0; j < tempData.length; j++){
                                    var tv = tempData[j][key];
                                    if($.isPlainObject(tv)){
                                        tv = tv.text;
                                    }
                                    if(me._filterDate(tv, value)){
                                        fdata.push(tempData[j]);
                                    }
                                }
                                tempData = fdata;
                            }
                            break;
                        default : 
                            me._error("Unsupported filter type [" + type +"].");
                    }
                }
                //如果清空过滤时，数据应该为缓存的所有数据
                me.data.data = tempData;
                if(me.data.page){
                    //更新page中的total,并且跳转到第一页
                    me.setCurrentPage(1);
                    me.data.page.total = tempData.length;
                    me.data.page.currentPage = 1;
                }
            }
        },
        /**
         * @description 实现表格数据排序功能
         * @param {Object} obj 参数
         */
        sort: function(obj) {
            this._beforeLoad();
            var me = this,
                    sorts = obj.order,
                    len = $.isNotNull(sorts) ? sorts.length : 0,
                    sort, tempData = me.data.data || [];
            // 对me.data数据进行排序
            // TODO 暂支持单列，需要扩展支持多列排序
            if (me.cache && len > 0) {
                if (1 === len) {
                    sort = sorts[0];
                    if ("number" === sort.dataType) {
                        tempData.sort($.objNumberSort(sort.name, sort.order));
                    } else {
                        tempData.sort($.objSort(sort.name, sort.order));
                    }
                }
                // 多列排序
                else {
                    tempData.sort($.objMultiSort(sorts));
                }
                me.data.data = tempData||[];
            }
        },
        /**
         * @private
         * @description 过滤list
         * @param {String/Number/Object} data 数据
         * @param {Array} list 列表
         * @return {Boolean} true：存在，false：不存在
         */
        _filterList: function(data, list) {
            var value;

            /**
             * @private
             * @description 比较value在list中是否存在
             * @param {String/Number} value 值
             * @param {Array} list 列表
             * @return {Boolean} true：存在，false：不存在
             */
            function compare(value, list) {
                for (var i = 0; i < list.length; i++) {
                    if (value === list[i]) {
                        return true;
                    }
                }

                return false;
            }

            /**
             * 处理列显示值与实际值不一致情况，例如列可能显示省份名称，实际比较的是省份ID，
             * 此种数据推荐使用{value:, text:}表示
             */
            if ($.isPlainObject(data)) {
                value = data.value;
            }

            return compare(data, list);
        },
        /**
         * @private
         * @description 字符串过滤
         * @param {String} data 数据
         * @param {String} s 符号
         * @param {String} value 比较值
         * @return {Boolean} true条件成立，false不成立
         */
        _filterString: function(data, s, value) {
            var result = false, patt;
            switch (s) {
                case symbol.EQUAL:
                    if (data === value) {
                        result = true;
                    }
                    break;
                case symbol.LIKE:
                    patt = new RegExp($.regExp.escape(value), "i");
                    if ($.isNotNull(data) && patt.test(data)) {
                        result = true;
                    }
                    break;
                case symbol.NOTEQUAL:
                    if (data !== value) {
                        result = true;
                    }
                    break;
                case symbol.EQNULL:
                    if ($.isNull(data)) {
                        result = true;
                    }
                    break;
                case symbol.NOTNULL:
                    if ($.isNotNull(data)) {
                        result = true;
                    }
                    break;
                default:
                    break;
            }

            return result;
        },
        /**
         * @private
         * @description 数值型比较
         * @param {Number} data 数据
         * @param {Array} value 数值
         * @returns {Boolean} true条件成立，false不成立
         */
        _filterNumber: function(data, value) {
            var me = this,
                    result = false, i = 0,
                    len = value.length;
            
            if (typeof data !== "number"){
				data = parseFloat(data);
				if(isNaN(data)){
					return false;
				}
			}
            // 只有一条，认为是
            if (1 === len) {
                if (value[0].symbol === symbol.EQUAL && data === Number(value[0].value)) {
                    result = true;
                }else if (value[0].symbol === symbol.GT && data > Number(value[0].value)) {
                    result = true;
                }else if (value[0].symbol === symbol.LT && data < Number(value[0].value)) {
                    result = true;
                }
            } else {
                /**
                 * //由于等于只能单独存在，所以最多只有两个且一定是大于和小于
                 */
                result = me._numberBetween(data, value[0], value[1]);
            }

            return result;
        },
        /**
         * @private
         * @description 判断值是否在两个值之间或者在两个值之外
         * @param {number} data
         * @param {object} v1  值1
         * @param {object} v2  值2
         * @returns {Boolean} 返回true,表示值是否在两个值之间或者在两个值之外; false表示都不满足
         */
        _numberBetween : function(data, v1, v2){
            var me = this, s1 = v1.symbol, s2 = v2.symbol,
                   n1 = Number(v1.value), n2 = Number(v2.value),
                   result = false, r;
            
            if((symbol.GT === s1 && n1 > n2) || (symbol.LT === s1 && n1 < n2)){
                /**
                 * 第二种情况: x > 500 || x < 222 , 取两头的值
                 */
                r = me._minMax(n1, n2);
                if (data < Number(r[0]) || data > Number(r[1])) {
                    result = true;
                }
            } else if((symbol.LT === s1 && n1 > n2) || (symbol.GT === s1 && n1 < n2)){
                /**
                 * 第一种情况: 222 < x < 500, 过滤交集
                 */
                r = me._minMax(n1, n2);
                if (data < Number(r[1]) && data > Number(r[0])) {
                    result = true;
                }
            }
            
            return result;
        },
        /**
         * @private
         * @description 日期比较
         * @param {Number} data 数据
         * @param {Array} value 数值
         * @returns {Boolean} true条件成立，false不成立
         */
        _filterDate: function(data, value) {
            var me = this,
                    result = false,
                    r = me.__getMaxMin(value, "text");
			if(data){
                data = $.date.format(new Date(String(data).replace(/-/g, "/")), "yyyy-MM-dd hh:mm:ss");
            }
			
            if (data < r[0] && data >= r[1]) {
                result = true;
            }

            return result;
        },
        /**
         * @private
         * @description 返回数组 [小值，大值]
         * @param {type} v1 值1
         * @param {type} v2 值2
         * @returns {Array} 返回数组 [小值，大值]
         */
        _minMax : function(v1, v2){
            v1 = Number(v1);
            v2 = Number(v2);
            return v1 > v2 ? [v2, v1] : [v1, v2];
        },
        /**
         * 
         * @param {Array} value 数值
         * @return {Object} 返回最大最小值，格式{max: , min: }
         */
        __getMaxMin: function(value, key) {
            var max, min;
            key = key || "value";
            if (symbol.GT === value[0].symbol) {
                min = value[0][key];
                max = value[1][key];
            } else {
                max = value[0][key];
                min = value[1][key];
            }

            return [max, min];
        }
    });
}(jQuery));
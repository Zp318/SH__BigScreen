/**
 * @fileOverview  
 * <pre>
 * 获取存储数据类组件，并对数据进行管理,其中allData和data需要说明：allData是所有的数据，是原始数据;而data是对allData
 * 进行操作后的数据，比如翻页或过滤后的数据。而getData接口是返回的allData
 * 2013/4/16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var beforeLoadKey = "beforeLoad",
        afterLoadKey = "afterLoad",
        defaultContentType = "application/json;charset=UTF-8";

    /**
     * @description 获取存储数据组件
     * @name Sweet.Store
     * @class
     * @extends Sweet.Base
     * @requires
     * <pre>
     * base.js
     * sweet.base.js
     * </pre>
     * @example
     */
    Sweet.Store = Sweet.Base.extend(/** @lends Sweet.Store.prototype*/{
        /**
         * @private
         * @description 组件名称
         */
        sweetWidgetName: "[Sweet-Store]",
        eventNames: /** @lends Sweet.Store.prototype*/{
            /**
             * @event 填充组件值事件
             */
            setData: "填充组件值"
        },
        /**
         * @description 设置发送请求数据
         * @param {Object} params JSON格式参数，格式
         *  {
         *      baseParams: baseParams,     // 基本参数，每次请求都会携带
         *      reader: reader,             // 解析数据reader
         *      url: url,                   // 请求URL
         *      timeout : null,             //默认不设置超时时间
         *      loadMask: true,             // 是否有遮罩，默认有且是全局遮罩，局部遮罩由各widget单独实现
         *      contentType: "",            // conetentType，默认application/json;charset=UTF-8
         *      async: true,                // 是否异步请求
         *      failCallBack : function(){},//发送请求时，如果返回error中时的回调处理函数
         *      cache: Boolean,             // 是否需要缓存数据，默认false，如果设置为true，store只会发送一次请求
         *                                  // 约定设置为cache后，需要在baseParams或params中设置start、limit值
         *      beforeSend ： function,     //为了满足发送ajax请求时，需要拼不同的参数时，注册的回调
         *      isRequest : boolean         //只有设置cache : true时才有效，表示store是否需要发送一次请求
         *                                  //false : 不发送一次请求，数据全由用户设置到store中
         *                                  //true : 只发送一次请求
         *  }
         */
        init: function(params) {
            if ($.isNull(params)) {
                return;
            }
            this.baseParams = params.baseParams;
            this.params = null;
            this.reader = params.reader;
            this.url = params.url;
            this.failCallBack = params.failCallBack;
            this.loadMask = (undefined !== params.loadMask) ? params.loadMask : true;
            this.contentType = params.contentType || defaultContentType;
            this.async = $.isUndefined(params.async) ? true : params.async;
            this.cache = (undefined !== params.cache) ? params.cache : false;
            /**
             * 只有设置cache : true时才有效，表示store是否需要发送一次请求
             * false : 不发送一次请求，数据全由用户设置到store中
             * true : 只发送一次请求
             */
            this.isRequest = (undefined !== params.isRequest) ? params.isRequest : true;
            /**
             * 为了满足发送ajax请求时，需要拼不同的参数时，注册的回调
             */
            this.beforeSend = $.isNull(params.beforeSend) ? "" : params.beforeSend;
            this.timeout = $.isNull(params.timeout) ? "" : params.timeout;
            this.data = [];
            this.allData = [];
            this.handlers = {};
        },
        /**
         * @private
         * @description 主要是给gridStore继承实现使用，进行清空过滤值
         */
        clearFilters : $.noop,
        /**
         * @private
         * @description 主要是给gridStore继承实现使用，进行清空排序值
         */
        clearOrders : $.noop,
        /**
         * @description 更新store中的基础参数，如果不再需要baseParams，设置为{}即可
         * @param {Object/Array} baseParams 基础的参数
         */
        setBaseParams : function(baseParams){
            this.baseParams = baseParams;
        },
        /**
         * @private
         * @description 发送请求，加载数据
         * @param {Object} params 提交参数
         * @param {Boolean} add 追加还是覆盖，默认覆盖
         * @param {String} eventName 指定触发的事件名称
         * @param {Object} anotherParams 传递给注册函数的参数
         */
        _loadRemoteData: function(params, add, eventName, anotherParams) {
            var me = this,
                    config = {},
                    tempParams;
            if (params) {
                me.params = params;
            }
            tempParams = $.extend({}, me.baseParams, me.params);
            if(!$.isNull(me.beforeSend) && $.isFunction(me.beforeSend)){
                tempParams = me.beforeSend(tempParams);
            }
            config = {
                url: me.url,
                async: me.async,
                loadMask: me.loadMask,
                data: defaultContentType === me.contentType ? JSON.stringify(tempParams) : tempParams,
                contentType: me.contentType,
                success: function(data) {
                    me._pretreatmentData(data, add, eventName);
                    me._callBack(eventName, anotherParams);
                },
                error: function(XMLHttpRequest, status, errorThrown) {
                    if(me.failCallBack && $.isFunction(me.failCallBack)){
                        me.failCallBack(XMLHttpRequest, status, errorThrown);
                    }
                }
            };
            if(!$.isNull(me.timeout)){
                config.timeout = me.timeout;
            }
            // 发送请求
            Sweet.Ajax.request(config);
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
                    tempData1 = me.reader.read(data),
                    tempData2 = me._dealForList(tempData1);
            if (add) {
                if ($.isPlainObject(me.allData)) {
                    me.allData = me.allData.data.concat(tempData2);
                } else {
                    me.allData = me.allData.concat(tempData2);
                }
            } else {
                me.allData = tempData2;
            }
            me.data = tempData1;
        },
        /**
         * @private
         * @description list延迟加载时，返回{total: 100, data: []}结构数据
         * @param {Object/Array} data 数据
         */
        _dealForList: function(data) {
            if ($.isNull(data)) {
                return [];
            }
            if ($.isPlainObject(data)) {
                return data.data;
            } else {
                return data;
            }
        },
        /**
         * @private
         * @description 构造list延迟加载返回数据，返回{total: 100, data: []}结构数据
         */
        _returnForList: function(data) {
            var me = this;
            if ($.isPlainObject(me.data)) {
                return {"total": me.data.total, "data": data};
            } else {
                return data;
            }
        },
        /**
         * @private
         * @description 回调注册的函数
         * @param {String} eventName 指定触发的事件名称
         * @param {Object} anotherParams 传递给注册函数的参数
         * @param {Boolean} add 是否不刷新表格,否则如果有分页条只刷新分页信息
         */
        _callBack: function(eventName, anotherParams, add) {
            var me = this,
                    data = me._dealData();
            //如果是filter调用
            if (anotherParams && anotherParams[0] && anotherParams[0].filter) {
                data = anotherParams[0].data;
            }
            // 优先触发指定的事件
            if (me.handlers[eventName]) {
                if (anotherParams && anotherParams[0].filter) {
                    me.handlers.scope.options.expand = true;
                } else {
                    me.handlers.scope.options.expand = false;
                }
                anotherParams = undefined;
                me.handlers[eventName].call(me.handlers.scope, data, anotherParams);
            } else if (me.handlers.setData) {
                me.handlers.setData.call(me.handlers.scope, data, anotherParams, add);
            }
            
            me._afterLoad();
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
                        tempData = me._dealForList(me.data);
                // 优先查看this.params参数
                if (me.params && !$.isUndefined(me.params.start)) {
                    params = me.params;
                    // 再查看this.baseParams参数
                } else if (me.baseParams && !$.isUndefined(me.baseParams.start)) {
                    params = me.baseParams;
                }
                start = params.start || 0;
                limit = params.limit || tempData.length;
                data = tempData.slice(start, start + limit);
            } else {
                data = me._dealForList(me.data);
            }

            return me._returnForList(data);
        },
        /**
         * @description 加载数据，该方法必须在load、loadData、reload方法之后调用
         * @param {Object} params 参数
         * @param {Boolean} add 追加还是覆盖，默认覆盖
         * @param {String} eventName 指定触发的事件名称
         * @param {Object} anotherParams 传递给注册函数的参数
         */
        loadRecords: function(params, add, eventName, anotherParams) {
            var me = this;
            me.params = params;
            if (me.cache) {
                me._callBack(eventName, anotherParams, add);
            } else {
                me.load(params, add, eventName, anotherParams);
            }
        },
        /**
         * @description 为组件注入数据
         * @param {Array} data 数据
         * @param {Boolean} add 追加还是覆盖，默认覆盖
         * @param {String} eventName 指定触发的事件名称
         * @param {Object} anotherParams 传递给注册函数的参数
         * @param {boolean} isResetParams 是否不重置翻页信息(表格翻页时设置的值)，默认重置:false，如果不需要重置，设置true
         */
        loadData: function(data, add, eventName, anotherParams, isResetParams) {
            var me = this;
            //前台缓存，但用户自己发请求使用loadData设置数据，且监控翻页后仍然需要显示当前页面时使用
            if(!isResetParams){
                me._resetParamStart();
            }
            me._pretreatmentData(data, add);
            me._callBack(eventName, anotherParams, add);
        },
        /**
         * @description 加载数据
         * @param {Object} params 发送请求时可以追加参数
         * @param {Boolean} add 追加还是覆盖，默认覆盖
         * @param {String} eventName 指定触发的事件名称，可选
         * @param {Object} anotherParams 传递给注册函数的参数
         */
        load: function(params, add, eventName, anotherParams) {
            var me = this;
            me._beforeLoad();
            me._loadRemoteData(params, add, eventName, anotherParams);
        },
        /**
         * @description 重新加载数据，无参数，参数是上一次load时传递的参数
         */
        reload: function() {
            this._resetParamStart();
            this._beforeLoad();
            this._loadRemoteData(this.params);
        },
        /**
         * @description 返回所有的数据
         */
        getData: function() {
            if (this.allData) {
                return $.objClone(this.allData);
            }
            return null;
        },
        /**
         * @description 删除数据
         * @param {Object} data 待删除数据
         */
        removeData: function(data) {
            var me = this;
            // 如果参数为空，进行全部删除操作
            if ($.isNull(data)) {
                me.allData = [];
            } else {
                $.each(me.allData, function(index, obj) {
                    if (obj && obj.value === data.value) {
                        me.allData.splice(index, 1);
                    }
                });
            }
        },
        /**
         * @description 返回过滤后的数据
         * @param {String} field 将过滤的目标字段
         * @param {String/RegExp} value 过滤值或正则
         * @param {Boolean} filterDir description
         * @param {Array} data 传入过滤的数据
         * @return {Array} 返回过滤后的数据
         */
        filter: function(field, value, filterDir, data) {
            var me = this,
                    filter = true,
                    testResult,
                    text,
                    allNull;
            filterDir = filterDir || false;
            me._beforeLoad();
            if ($.isNull(data)) {
                data = $.objClone(me.allData);
            }

            $.each(data, function(index, childData) {
                if (!$.isNull(childData))
                {
                    if (childData.children && childData.children.length > 0) {
                        //filterDir:true为带目录过滤，否则为叶子节点过滤
                        if (filterDir) {
                            //判断目录是否匹配
                            testResult = false;
                            text = childData.text;
                            testResult = value.test(text);
                            //判断是否包含过滤字符串
                            if (testResult) {
                                return;
                            } else {
                                me.filter(field, value, filterDir, childData.children);
                            }
                        } else {
                            me.filter(field, value, filterDir, childData.children);
                        }
                        //判断chilData.children是否都为空
                        allNull = false;
                        $.each(childData.children, function(index, child) {
                            if (!$.isNull(child)) {
                                allNull = true;
                            }
                        });
                        //删除没有叶子的节点
                        if (!allNull) {
                            delete data[index];
                        }
                    } else {
                        testResult = false;
                        text = childData.text;
                        testResult = value.test(text);
                        //判断是否包含过滤字符串
                        if (!testResult) {
                            delete data[index];
                        }
                    }
                }
            });
            
            me.data = data;
            me._callBack("setData", [{"data": $.deleteUndefinedData(data), "filter": filter}]);
        },
        /**
         * @TODO 待实现
         * @description 实现数据排序功能
         * @param {String/Array} field 排序目标字段或数组，如果是数组，格式约定为[{key: , order: }, ...]
         * @param {String} order 排序类型，取值范围 ASC:升序，DESC:降序，默认升序
         */
        sort: function(field, order) {
            this._beforeLoad();
            var me = this;
            var sorts = [];
            var sortType = order || Sweet.constants.sortType.ASC;

            if ("string" === $.type(field)) {
                sorts.push({"key": field, "order": sortType});
            } else if ("array" === $.type(field)) {
                sorts = field;
            } else {
                throw new Error("Store.sort() Unsupported type!");
            }

            // 将start值清零
            me._resetParamStart();

            // 对me.data数据进行排序
            // TODO 暂支持单列，需要扩展支持多列排序
            if (me.cache) {
                me.data.sort($.objSort(field, sortType));
            }

            // 加载数据
            me.loadRecords({"orders": sorts});
        },
        /**
         * @private
         * @description 加载数据前处理，可以修改提交参数，直接覆盖this.baseParams和this.params即可
         */
        _beforeLoad: function() {
            if (this.handlers) {
                var beforeLoadFunc = this.handlers[beforeLoadKey];
                if (beforeLoadFunc && $.isFunction(beforeLoadFunc)) {
                    beforeLoadFunc.call(this);
                }
            }
        },
        /**
         * @private
         * @description 加载数据后处理
         */
        _afterLoad: function() {
            if (this.handlers) {
                var afterLoadFunc = this.handlers[afterLoadKey];
                if (afterLoadFunc && $.isFunction(afterLoadFunc)) {
                    afterLoadFunc.call(this);
                }
            }
        },
        /**
         * @private
         * @description 重新设置params参数值
         * @param {Object} obj 参数
         */
        _resetParams: function(obj) {
            var me = this;
            // 将start值清零
            if (me.params) {
                if (me.params.start && me.params.limit) {
                    me.params.start = obj.start;
                    me.params.limit = obj.limit;
                }
            }
        },
        /**
         * @private
         * @description 将开始值清零
         */
        _resetParamStart: function() {
            var me = this;
            // 优先查看this.params参数
            if (me.params) {
                if (me.params.start) {
                    me.params.start = 0;
                }
            }
            // 再查看this.baseParams参数
            else if (me.baseParams) {
                if (me.baseParams.start) {
                    me.baseParams.start = 0;
                }
            }
        }
    });
}(jQuery));
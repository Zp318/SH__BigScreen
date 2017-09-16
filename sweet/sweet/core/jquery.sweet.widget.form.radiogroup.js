/**
 * @fileOverview  
 * <pre>
 * form组件--单选按钮组
 * 2013/4/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    /**
     * 保存组件对象
     */
    var radioGroupClass = "sweet-form-radioGroupEl",
        autoClass = "sweet-form-autoWid-autoHeight",
        radioboxUnCheckedClass = "sweet-form-radioGroup-unchecked",
        radioboxCheckedClass = "sweet-form-radioGroup-checked",
        radioboxLiClass = "sweet-form-radiobox-li",
        checkboxLabelDivCls = "sweet-form-checkbox-labelDiv",
        labelClass = "sweet-form-checkbox-label",
        radioCheckedDisabledClass = "sweet-form-radio-checked-disabled",
        radioUnCheckedDisabledClass = "sweet-form-radio-unchecked-disabled",
        _UUID = 0;

    $.widget("sweet.widgetFormRadiogroup", $.sweet.widgetForm, /** @lends Sweet.form.RadioGroup.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-radioboxgroup]",
        eventNames: /** @lends Sweet.form.RadioGroup.prototype*/{
            /**
             * @event
             * @description 单击事件,参数为两个(event, data)
             */
            click: "单击事件",
            /**
             * @event
             * @description change事件,参数为两个(event, data)
             */
            change: "change事件"
        },
        options: /** @lends Sweet.form.RadioGroup.prototype*/{
            /**
             * @description 是否平均高度
             * @type {Boolean}
             * @default true
             */
            averageHeight: true,
            /**
             * @description 基础数据
             * @type {Array}
             * @default []
             */
            data: [],
            /**
             * @description 列数
             * @type {String/Number}
             * @default auto
             */
            columns: "auto",
            /**
             * @description 是否垂直排列
             * @type {Boolean}
             * @default false
             */
            vertical: false,
            /**
             * @description item行间距
             * @type {Number}
             * @default 5
             */
            padding: 5,
            /**
             * @description 是否显示选项的提示
             * @type {Boolean}
             * @default false
             */
            tip: false
        },
        /**
         * @description 重新设置基础数据
         * @param {object} data 组件data值
         */
        setData: function(data) {
            this._removeItems();
            this.options.data = data;
            this._createRadioboxGroup();
            this._doLayout();
        },
        /**
         * @description 重置组件，只支持选项为文字的情况
         */
        reset: function() {
            var me = this;
            if (me._arrHasObject(me.originalData)) {
                return;
            }
            me.setData(me.originalData);
        },
        /**
         * @description 设置是否可编辑属性
         * @private
         * @param {Boolean} disabled true:禁用, false:可用
         */
        setDisabled: function(disabled) {
            var me = this,
                data = me.options.data,
                liEl, aLiEi, liElLabelID,
                allLiEl = me.ulEl.children("li");
            me.options.disabled = disabled;
            me.disabled = disabled;

            //外部组件
            $.each(data, function(index, val) {
                if ("object" === typeof val.text && $.isFunction(val.text.setDisabled) && "boolean" === $.type(disabled)) {
                    val.text.setDisabled(disabled);
                }
            });

            allLiEl.each(function(index, el) {
                liEl = $(el);
                aLiEi = liEl.children("a");

                if (disabled) {
                    if (aLiEi.hasClass(radioboxCheckedClass)) {
                        aLiEi.removeClass(radioboxCheckedClass).addClass(radioCheckedDisabledClass);
                    }
                    else if (aLiEi.hasClass(radioboxUnCheckedClass)) {
                        aLiEi.removeClass(radioboxUnCheckedClass).addClass(radioUnCheckedDisabledClass);
                    }
                } else {
                    if (aLiEi.hasClass(radioCheckedDisabledClass)) {
                        aLiEi.removeClass(radioCheckedDisabledClass).addClass(radioboxCheckedClass);
                    }
                    else if (aLiEi.hasClass(radioUnCheckedDisabledClass)) {
                        aLiEi.removeClass(radioUnCheckedDisabledClass).addClass(radioboxUnCheckedClass);
                    }
                }
            });
        },
        /**
         * @description 组件重绘
         */
        _doLayout: function() {
            var me = this,
                options = me.options,
                data = options.data,
                liElHeight,
                aELHeight,
                allLiEl = me.ulEl.children("li"),
                cmpHeight, cmpHeightBuf, marginTop, liEl;

            if (!me.rendered) {
                return;
            }

            /* 注：
             * 每个item的宽度通过百分比控制，在create时就已经确定，这里不再计算；
             * 这里只进行高度的处理：
             *   1. 如果averageHeight=true，高度通过百分比控制，在创建时确定，这里不需要再处理
             *   2. 否则，这里需要计算高度
             *     1. li高度以最高的那个内容div来确定
             *     2. 行间距由options.padding确定
             * 两种情况下，都要对LI内部的内容进行垂直居中的处理
             */

            // 处理LI的高度
            liElHeight = 0;
            cmpHeightBuf = [];

            if (options.averageHeight !== true) {
                // 首先确定最大的高度
                allLiEl.each(function(index, el) {
                    liEl = $(el);
                    cmpHeight = liEl.children("div").children("div").height();
                    if (cmpHeight > liElHeight) {
                        liElHeight = cmpHeight;
                    }
                    cmpHeightBuf.push(cmpHeight);
                });

                // 统一高度
                if (liElHeight < 20) {
                    liElHeight = 20;
                }
                allLiEl.height(liElHeight + options.padding);
            }
            else {
                liElHeight = allLiEl.eq(0).height();
            }

            /* 下面，处理垂直居中 */

            // li下面的check图标居中
            aELHeight = allLiEl.eq(0).children("a").height();
            marginTop = liElHeight > aELHeight ? (liElHeight - aELHeight) / 2 : 0;
            allLiEl.children("a").css("margin-top", marginTop);

            // 外部组件上下居中
            allLiEl.each(function(index, el) {
                liEl = $(el);
                cmpHeight = cmpHeightBuf[index] || liEl.children("div").children("div").height();
                marginTop = liElHeight > cmpHeight ? (liElHeight - cmpHeight) / 2 : 0;
                liEl.children("div").css({"padding-top": marginTop});
            });

            // 外部组件的layout
            $.each(data, function(index, val) {
                if ("object" === typeof val.text && $.isFunction(val.text.doLayout)) {
                    val.text.doLayout();
                }
            });
        },
        /**
         * @description 生成按钮
         * @private
         */
        _createFormWidget: function() {
            var me = this,
                options = me.options,
                data = options.data,
                ulEl = me.ulEl = $("<ul>").addClass(autoClass).appendTo(me.formEl);

            // 重置时需要的数据
            me.originalData = data;

            // 生成多选框组
            me._createRadioboxGroup();
        },
        /**
         * @description 渲染内容
         * @private
         */
        _afterRenderFormWidget: function() {
            this._renderItems();
        },
        /**
         * @description 渲染子组件
         * @private
         */
        _renderItems: function() {
            var me = this,
                innerDiv,
                innerDivId,
                data = me.options.data,
                liList = me.ulEl.children("li");

            if (!me.rendered) {
                return;
            }

            $.each(data, function(index, val) {
                innerDiv = liList.eq(index).children("div");
                innerDivId = innerDiv.attr("id");
                // 对象
                if ("object" === typeof val.text) {
                    val.text.render(innerDivId);
                }
                // 文字
                else {
                    var optionDdivEl = $("<div>").html(val.text).addClass(labelClass).appendTo(innerDiv);
                    if (me.options.tip) {
                        optionDdivEl.attr("title", val.text);
                    }
                }
            });
        },
        /**
         * @description 销毁所有子组件
         * @private
         */
        _removeItems: function() {
            var me = this,
                allLi,
                data = me.options.data;

            // 销毁子对象
            $.each(data, function(index, val) {
                // 对象
                if ("object" === typeof val.text && $.isFunction(val.text._destroyDom)) {
                    val.text._destroyDom();
                }
            });

            // 清除LI
            allLi = me.ulEl.find("li");
            allLi.remove();

            // 保存多选组的div对象
            me.dataObj = {};
            me.dataObj.length = 0;

            // 保存li对象
            me.liArrayObj = {};
            me.liArrayObj.length = 0;
        },
        /**
         * @description 更换图片
         * @private
         */
        _createRadioboxGroup: function() {
            var me = this,
                options = me.options,
                data = options.data,
                rows, columns, width, height,
                liElList;

            if (data.length < 1) {
                return;
            }

            // 保存多选组的div对象
            me.dataObj = {};
            me.dataObj.length = 0;

            // 保存li对象
            me.liArrayObj = {};
            me.liArrayObj.length = 0;
            me.haveChecked = null;
            $.each(data, function(key, value) {
                me._createOneRadiobox(value, key);
            });
            me.haveChecked = null;
            // 设置li宽高。用百分比来控制宽度，性能更好
            if ("number" === typeof options.columns) {
                columns = options.columns;
                rows = parseInt(data.length / columns, 10);
                rows = (columns * rows === data.length) ? rows : rows + 1;
            }
            else {
                if (!options.vertical) {
                    columns = data.length || 1;
                    rows = 1;
                } else {
                    columns = 1;
                    rows = data.length;
                }
            }

            if (options.all) {
                rows += 1;
            }

            liElList = this.ulEl.children("li");
            options.rows = rows;
            width = Math.floor(100 / columns) + "%";
            if (options.all) {
                liElList.slice(1).css("width", width);
            }
            else {
                liElList.css("width", width);
            }

            // 高度的处理
            if (options.averageHeight === true) {
                height = Math.floor(100 / rows) + "%";
                liElList.css("height", height);
            }

            // 渲染
            me._renderItems();
        },
        /**
         * @description 创建一个radio组件
         * @private
         * @param {object} val 一条数据
         * @param {number} index 索引
         */
        _createOneRadiobox: function(val, index) {
            var me = this,
                liEl = $("<li>").addClass(radioboxLiClass).appendTo(me.ulEl),
                aEl = $("<a>").addClass(radioGroupClass).appendTo(liEl),
                innerDiv = $("<div>").addClass(checkboxLabelDivCls).appendTo(liEl),
                aCls = radioboxUnCheckedClass,
                idPrefix = "sweet-form-checkboxgroup-uiCmp-",
                innerDivId = idPrefix + _UUID++;

            innerDiv.attr("id", innerDivId);
            me.dataObj[val.value] = {value: val, checked: false};
            // 初始化时，只能有一个被选中
            if (val.checked && !me.haveChecked) {
                aCls = radioboxCheckedClass;
                me.dataObj[val.value] = {value: val, checked: val.checked};
                me.dataObj.length++;
                me.haveChecked = true;
            }
            if($.isNotNull(me.options.vID)){
                aEl.attr("id", me.options.vID + "_" + index);
            }
            aEl.attr("value", val.value)
                    .addClass(aCls)
                    .bind("click", {"me": me, "obj": aEl}, me._onSingleClick);
            me.liArrayObj[val.value] = liEl;
            me.liArrayObj.length++;
        },
        /**
         * @private
         * @description 点击radiobox事件
         * @param {Object} e 事件对象
         */
        _onSingleClick: function(e) {
            var me = e.data.me,
                obj = e.data.obj,
                value,
                checked;
            me.oldValue = me.getValue();
            if(!me.options.disabled){
                me._changImage(obj);
                value = me.getValue();
                me._triggerHandler(e, "click", {value: value, checked: checked});
                if(!$.equals(me.oldValue, value)){
                    me._triggerHandler(e, "change", value);
                }
            }
        },
        /**
         * @description 更换图片
         * @private
         * @param {Object} obj 单选框对象
         * @return {Boolean} true选中 false未选中
         */
        _changImage: function(obj) {
            var me = this;
            if (obj.hasClass(radioboxCheckedClass)) {
                return;
            }
            else if (obj.hasClass(radioboxUnCheckedClass)) {
                // 去掉上一次选中的
                var lastCheckedObj = me.ulEl.children("li")
                        .children("a." + radioboxCheckedClass);
                if (lastCheckedObj.length > 0) {
                    var lastCheckedValue = lastCheckedObj.attr("value");
                    me.dataObj[lastCheckedValue].checked = false;
                    lastCheckedObj.removeClass(radioboxCheckedClass)
                            .addClass(radioboxUnCheckedClass);
                }
                // 选中当前的
                obj.removeClass(radioboxUnCheckedClass).addClass(radioboxCheckedClass);
                me.dataObj[obj.attr("value")].checked = true;
            }
            else {
                me._error("Unsupport type.");
            }
            return;
        },
        /**
         * @description 获取值
         * @private
         * @return {Array} 值
         */
        _getValue: function() {
            var me = this,
                data = [];

            for (var value in me.dataObj) {
                if ("length" !== value && me.dataObj[value].checked) {
                    data.push(me.dataObj[value].value);
                }
            }
            return data[0];
        },
        /**
         * @description 设置值
         * @private
         * @param {project} data 值
         */
        _setValue: function(data) {
            var me = this,
                val, liObj,
                val1, liObj1,
                lastCheckedObj;
            if ($.isNull(data) || data.length < 1 || me.options.disabled) {
                return;
            }
            me.oldValue = me.getValue();
            
            // 去掉上一次选中的
            lastCheckedObj = me.ulEl.children("li").children("a." + radioboxCheckedClass);
            if (lastCheckedObj && 0 < lastCheckedObj.length) {
                var lastCheckedValue = lastCheckedObj.attr("value");
                me.dataObj[lastCheckedValue].checked = false;
                lastCheckedObj.removeClass(radioboxCheckedClass)
                        .addClass(radioboxUnCheckedClass);
            }

            // 设置对勾
            for (var i = 0; i < data.length; i++) {
                val = data[i];
                liObj = me.dataObj[val.value] ? me.dataObj[val.value].value : null;
                // 若数据一致，才进行设置
                if (liObj) {
                    me.liArrayObj[val.value].children("a")
                            .removeClass()
                            .addClass(radioGroupClass + " " + radioboxCheckedClass);
                    me.dataObj[val.value].checked = true;
                }
            }

            // 设置选中
            val1 = data;
            liObj1 = me.dataObj[val1.value] ? me.dataObj[val1.value].value : null;
            // 若数据一致，才进行设置
            if (liObj1) {
                me.liArrayObj[val1.value].children("a")
                        .removeClass(radioboxUnCheckedClass)
                        .addClass(radioboxCheckedClass);
                me.dataObj[val1.value].checked = true;
            }
            //为setValue时添加change事件
            if(!me.options.disabled){
                var value = me.getValue();
                if(!$.equals(me.oldValue, value)){
                    me._triggerHandler(null, "change", value);
                }
            }
        },
        /**
         * @description 判断数据中是否有对象
         * @private
         * @param {Object} data 数据
         */
        _arrHasObject: function(data) {
            var me = this,
                hasObject = false;
            data = data || [];
            $.each(data, function(index, val) {
                // 对象
                if ("object" === typeof val.text) {
                    hasObject = true;
                }
            });
            return hasObject;
        }
    });

    /**
     * 单选按钮组
     * @name Sweet.form.RadioGroup
     * @class 
     * @extends Sweet.form
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example 
     * <pre>
     * var data = [
     *      {text: "第一个", value: "1", data: null, checked: false},
     *      {text: "第二个", value: "2", data: null, checked: true},
     *      {text: "第三个", value: "3", data: null, checked: false},
     *      {text: "第四个", value: "4", data: null, checked: false}
     *     ];
     * sweetRadioGroup = new Sweet.form.RadioGroup({
     *     width : 300,
     *     height : 20,
     *     data: data,
     *     renderTo : "sweet-radiobox"
     * });
     * sweetRadioGroup.addListener("change", function(event, val){
     *     $.log("change happend!");
     *});
     * </pre>
     */
    Sweet.form.RadioGroup = $.sweet.widgetFormRadiogroup;

}(jQuery));

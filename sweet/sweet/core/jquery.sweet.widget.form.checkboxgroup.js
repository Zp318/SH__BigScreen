/**
 * @fileOverview  
 * <pre>
 * form组件 -- 复选按钮组
 * 2013/1/18
 * http://www.huawei.com
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    /**
     * 保存组件对象
     */
    var checkboxClass = "sweet-form-checkboxgroup",
        checkboxUnCheckedClass = "sweet-form-checkbox-unchecked",
        checkboxCheckedClass = "sweet-form-checkbox-checked",
        checkboxLiClass = "sweet-form-checkbox-li",
        checkboxLabelDivCls = "sweet-form-checkbox-labelDiv",
        labelClass = "sweet-form-checkbox-label",
        autoClass = "sweet-form-autoWid-autoHeight",
        checkboxUnCheckedDisabledClass = "sweet-form-checkbox-unchecked-disabled",
        checkboxCheckedDisabledClass = "sweet-form-checkbox-checked-disabled",
        _UUID = 0;

    $.widget("sweet.widgetFormCheckboxgroup", $.sweet.widgetForm, /** @lends Sweet.form.CheckboxGroup.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-checkboxgroup]",
        eventNames: /** @lends Sweet.form.CheckboxGroup.prototype*/{
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
        options: /** @lends Sweet.form.CheckboxGroup.prototype*/{
            /**
             * @description 是否平均高度
             * @type {Boolean}
             * @default true
             */
            averageHeight: true,
            /**
             * @description 是否可全选
             * @type {Boolean}
             * @default false
             */
            all: false,
            /**
             * @description 基础数据
             * @type {Object}
             * @default null
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
            tip :false
        },
        /**
         * @description 重新设置基础数据
         * @param {object} data 组件data值
         */
        setData: function(data) {
            this._removeItems();
            this.options.data = data;
            this._createCheckboxGroup();
            this._doLayout();
        },
        /**
         * @description 重置组件，只支持选项为文字的情况
         */
        reset: function() {
            var me = this;
            if(me._arrHasObject(me.originalData)) {
                return;
            }
            me.setData(me.originalData);
        },
        /**
         * @description 设置是否可编辑
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
                    if (aLiEi.hasClass(checkboxCheckedClass)) {
                        aLiEi.removeClass(checkboxCheckedClass).addClass(checkboxCheckedDisabledClass);
                    }
                    else if (aLiEi.hasClass(checkboxUnCheckedClass)) {
                        aLiEi.removeClass(checkboxUnCheckedClass).addClass(checkboxUnCheckedDisabledClass);
                    }
                } else {
                    if (aLiEi.hasClass(checkboxCheckedDisabledClass)) {
                        aLiEi.removeClass(checkboxCheckedDisabledClass).addClass(checkboxCheckedClass);
                    }
                    else if (aLiEi.hasClass(checkboxUnCheckedDisabledClass)) {
                        aLiEi.removeClass(checkboxUnCheckedDisabledClass).addClass(checkboxUnCheckedClass);
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
                allLiEl.each(function (index, el) {
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
            allLiEl.each(function (index, el) {
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
        _createFormWidget: function () {
            var me = this,
                options = me.options,
                data = options.data,
                ulEl = me.ulEl = $("<ul>").addClass(autoClass).appendTo(me.formEl),
                allEl, allAEl, allDivEl, textEl;
            // 重置时需要的数据
            me.originalData = data;

            // 是否有全选
            if (options.all) {
                allEl = me.allEl = $("<li>").addClass(checkboxLiClass);
                allAEl = me.allAEl = $("<a>").addClass(checkboxClass).appendTo(allEl);
                allDivEl = $("<div>").addClass(checkboxLabelDivCls).appendTo(allEl);
                textEl = $("<div>").addClass(labelClass).appendTo(allDivEl);
                if($.isNotNull(options.vID)){
                    allAEl.attr("id", options.vID + "_" + "all");
                }
                allAEl.bind("click", function (e) {
                    me._onAllClick(e, $(this));
                });

                textEl.text(Sweet.core.i18n.combobox.checkAll);
                allEl.appendTo(ulEl);
            }

            // 生成多选框组
            me._createCheckboxGroup();

            // 初始是否全选
            if (options.all) {
                me._setImage(allAEl, me.dataObj.length === me.checkedLength);
            }
        },
        /**
         * @description 渲染内容
         * @private
         */
        _afterRenderFormWidget: function () {
            this._renderItems();
        },
        /**
         * @description 渲染子组件
         * @private
         */
        _renderItems: function () {
            var me = this,
                innerDiv,
                innerDivId,
                data = me.options.data,
                liList = me.ulEl.children("li"),
                offset = me.options.all ? 1 : 0;

            if (!me.rendered) {
                return;
            }

            $.each(data, function(index, val) {
                innerDiv = liList.eq(index + offset).children("div");
                innerDivId = innerDiv.attr("id");
                // 对象
                if ("object" === typeof val.text) {
                    val.text.render(innerDivId);
                }
                // 文字
                else {
                    var optionDdivEl = $("<div>").html(val.text).addClass(labelClass).appendTo(innerDiv);
                    if(me.options.tip) {
                        optionDdivEl.attr("title", val.text);
                    }
                }
            });
        },
        /**
         * @description 销毁所有子组件
         * @private
         */
        _removeItems: function () {
            var me = this,
                data = me.options.data,
                allLi;

            // 销毁子对象
            $.each(data, function(index, val) {
                // 对象
                if ("object" === typeof val.text && $.isFunction(val.text._destroyDom)) {
                    val.text._destroyDom();
                }
            });

            // 清除LI
            allLi = me.ulEl.find("li");
            if (me.options.all) {
                allLi = allLi.slice(1);
            }
            allLi.remove();

            // 保存多选组的div对象
            me.dataObj = {};
            me.dataObj.length = 0;

            // 保存li对象
            me.liArrayObj = {};
            me.liArrayObj.length = 0;
        },
        /**
         * @private
         * @description 点击全选时触发
         * @param {Object} e 事件对象
         * @param {Object} self 复选框对象
         */
        _onAllClick: function(e, self) {
            var me = this,
                checked = false;
            if(!me.options.disabled){
                checked = me._changImage(self);
                // 选中
                if (checked) {
                    me.checkedLength = me.dataObj.length;
                    me._setDataObj(checked);
                }
                else {
                    me.checkedLength = 0;
                    me._setDataObj(checked);
                }

                me._triggerHandler(e, "click", {value: me.getValue(), checked: checked});
                me._triggerHandler(e, "change", me.getValue());
            }
        },
        /**
         * @private
         * @description 设置数据选中状态
         * @param {Boolean} checked 是否选中
         */
        _setDataObj: function(checked) {
            var me = this;
            for (var value in me.dataObj) {
                if ("length" !== value) {
                    me.dataObj[value].checked = checked;
                    me._setImage(me.liArrayObj[value].children("a"), checked);
                }
            }
        },
        /**
         * @description 更换图片
         * @private
         */
        _createCheckboxGroup: function() {
            var me = this,
                options = me.options,
                data = options.data,
                rows, columns, width, height,
                liElList;

            // checkbox选中个数
            me.checkedLength = 0;
            if (data.length < 1) {
                return;
            }

            // 保存多选组的div对象
            me.dataObj = {};
            me.dataObj.length = 0;

            // 保存li对象
            me.liArrayObj = {};
            me.liArrayObj.length = 0;
            $.each(data, function(key, value) {
                me._createOneCheckbox(value, key);
            });

            // 如果有全选，判断全选是否选中
            if (me.allEl) {
                me._setImage(me.allAEl, me.dataObj.length === me.checkedLength);
            }

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

            liElList = me.ulEl.children("li");
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
         * @description 更换图片
         * @private
         * @param {object} val 一条数据
         * @param {number} index 索引
         */
        _createOneCheckbox: function (val, index) {
            var me = this,
                liEl = $("<li>").addClass(checkboxLiClass).appendTo(me.ulEl),
                aEl = $("<a>").addClass(checkboxClass).appendTo(liEl),
                innerDiv = $("<div>").addClass(checkboxLabelDivCls).appendTo(liEl),
                aCls = checkboxUnCheckedClass,
                idPrefix = "sweet-form-checkboxgroup-uiCmp-",
                innerDivId = idPrefix + _UUID++;
            
            innerDiv.attr("id", innerDivId);
            if (val.checked) {
                aCls = checkboxCheckedClass;
                this.checkedLength++;
            }
            if($.isNotNull(me.options.vID)){
                aEl.attr("id", me.options.vID + "_" + index);
            }
            aEl.attr("value", val.value)
                .addClass(aCls)
                .bind("click", {"me": me, "obj": aEl}, me._onSingleClick);
            me.dataObj[val.value] = {value: val, checked: val.checked};
            me.dataObj.length++;
            me.liArrayObj[val.value] = liEl;
            me.liArrayObj.length++;
        },
        /**
         * @private
         * @description 单个checkbox点击事件
         * @param {Object} e 事件对象
         */
        _onSingleClick: function(e) {
            var me = e.data.me,
                obj = e.data.obj,
                value = $(e.target).attr("value"),
                checked;
            if(!me.options.disabled){
                checked = me._changImage(obj);
                if (checked) {
                    me.dataObj[value].checked = true;
                    me.checkedLength++;
                }
                else {
                    me.dataObj[value].checked = false;
                    me.checkedLength--;
                }

                // 如果有全选，判断全选是否选中
                if (me.allEl) {
                    me._setImage(me.allAEl, me.dataObj.length === me.checkedLength);
                }
                me._triggerHandler(e, "click", {value: me.dataObj[value].value, checked: checked});
                me._triggerHandler(e, "change", me.getValue());
            }
        },
        /**
         * @private
         * @description 设置是否选中图片
         * @param {Object} obj 复选框对象
         * @param {Boolan} checked 是否选中
         */
        _setImage: function(obj, checked) {
            if (checked) {
                obj.removeClass(checkboxUnCheckedClass).addClass(checkboxCheckedClass);
            }
            else {
                obj.removeClass(checkboxCheckedClass).addClass(checkboxUnCheckedClass);
            }
        },
        /**
         * @description 更换图片
         * @private
         * @param {Object} obj 复选框对象
         * @return {Boolean} true选中 false未选中
         */
        _changImage: function(obj) {
            var checked = false;
            if (obj.hasClass(checkboxCheckedClass)) {
                obj.removeClass(checkboxCheckedClass).addClass(checkboxUnCheckedClass);
            }
            else if (obj.hasClass(checkboxUnCheckedClass)) {
                obj.removeClass(checkboxUnCheckedClass).addClass(checkboxCheckedClass);
                checked = true;
            }
            else {
                this._error("Unsupport type.");
            }
            
            return checked;
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
            return data;
        },
        /**
         * @description 设置值
         * @private
         * @param {project} data 值
         */
        _setValue: function(data) {
            var me = this,
                val, liObj;
            if (!data || data.length < 1) {
                return;
            }
            me.checkedLength = 0;
            me.oldValue = me.getValue();

            // 去掉所有图片上的对勾
            me.ulEl.children("li")
                .children("a")
                .removeClass()
                .addClass(checkboxClass)
                .addClass(checkboxUnCheckedClass);

            // 将所有选中标志置为false
            for (var value in me.dataObj) {
                if ("length" !== value) {
                    me.dataObj[value].checked = false;
                }
            }

            // 设置对勾
            for (var i = 0; i < data.length; i++) {
                val = data[i];
                liObj = me.dataObj[val.value] ? me.dataObj[val.value].value : null;
                // 若数据一致，才进行设置
                if (liObj) {
                    me.liArrayObj[val.value].children("a")
                        .removeClass()
                        .addClass(checkboxClass)
                        .addClass(checkboxCheckedClass);
                    me.dataObj[val.value].checked = true;
                    me.checkedLength++;
                }
            }

            // 如果有全选，判断全选是否选中
            if (me.allEl) {
                me._setImage(me.allAEl, me.dataObj.length === me.checkedLength);
            }
            if(!$.equals(me.oldValue, data)){
                me._triggerHandler(null, "change", me.getValue());
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
     * 复选按钮组
     * @name Sweet.form.CheckboxGroup
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
     * var data = [{text: "饼图饼图饼图", value: "bingtu", data: null, checked: false},
     *             {text: "面积图", value: "mianjitu", data: null, checked: true},
     *             {text: "条形图", value: "tiaoxingtu", data: null, checked: false},
     *             {text: "拓扑图", value: "tuoputu", data: null, checked: true}
     *           ];
     * var checkboxGroup = new Sweet.form.CheckboxGroup({
     *      all: true,
     *      width: "100%",
     *      height: "100%",
     *      data: data,
     *      renderTo : "sweet-checkboxgroup",
     *      averageHeight: true,
     *      tip: true
     *});
     * checkboxGroup.addListener("change", function(event, val){
     *     $.log("change happend!");
     *});
     */
    Sweet.form.CheckboxGroup = $.sweet.widgetFormCheckboxgroup;

}(jQuery));

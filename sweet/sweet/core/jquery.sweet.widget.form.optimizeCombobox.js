/**
 * @fileOverview  
 * <pre>
 * form组件--下拉框
 * 2013/1/27
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    /**
     * 保存组件对象
     * 
     */
    var comboboxInputClass = "sweet-form-combobox-element",
            comboboxArrowClass = "sweet-form-combobox-arrow",
            comboboxArrowGrayClass = "sweet-form-combobox-arrow-gray",
            comboboxParentClass = "sweet-form-combobox",
            comboboxParentGrayClass = "sweet-form-combobox-gray",
            textFieldFormClass = "sweet-form-combobox-formEl",
            comboboxUlParentClass = "sweet-form-combobox-ulParent",
            comboboxExpandTextBlue = "sweet-form-combobox-selected",
            comboboxExpandText = "sweet-form-combobox-selectWinText",
            comboboxSelectWinRadio = "sweet-form-combobox-selectWinRadio",
            checkboxImage = "sweet-form-checkbox-image",
            checkboxImageSelect = "sweet-form-checkbox-imageSelect",
            comboboxMultiSpan = "sweet-form-combobox-dropDownSpan",
            comboboxEmptyTextClass = "sweet-form-combobox-emptyDiv",
            comboboxBigDataImageClose = "sweet-form-combobox-bigDataImage-delete",
            comboboxPartitionLineClass = "sweet-form-combobox-partitionLine",
            increments = 0,
            CONSTANT = 1,
            componentHeight = 25,
            itemLimitNumber = 10,
            liHeight = 22,
            eventAfterSetData = "afterSetData",
            eventAfterSetValue = "afterSetValue",
            ALL_TEXT = Sweet.core.i18n.combobox.checkAll;

    $.widget("sweet.widgetFormOptCombobox", $.sweet.widgetFormInput, /** @lends Sweet.form.OptimizeCombobox.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-optimizeCombobox]",
        type: 'text',
        eventNames: /** @lends Sweet.form.OptimizeCombobox.prototype*/{
            change: "改变值事件",
            afterSetData: "调用完setData方法后事件",
            afterSetValue: "setValue执行后触发",
            beforeCheckboxClick: "点击checkBox之前的事件(checkBox未选中的时候触发)",
            afterCloseFloatWin: "关闭浮动窗口后的事件"
        },
        options: /** @lends Sweet.form.OptimizeCombobox.prototype*/{
            /**
             * 基础数据
             * @type Object
             * @default null
             */
            data: [],
            /**
             * 组件值
             * @type {Object/String}
             * @default null
             */
            value: null,
            /**
             * 多选属性
             * @type Boolean
             * @default false
             */
            multi: false,
            /**
             * 多选下拉框是否配置all选项
             * @type Boolean
             * @default true
             */
            all: false,
            /**
             * 是否显示选项的提示
             * @type Boolean
             * @default false
             */
            tip: false,
            /**
             * 是否为树
             * @type Boolean
             * @default false
             */
            tree: false,
            /**
             * @description 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default 请选择
             */
            emptyText: Sweet.core.i18n.combobox.pleaseCheck,
            /**
             * 多选时，必须保留选中的个数
             * @type {Number}
             * @default 0
             */
            minRemains: 0,
            /**
             * 多选时，最多保留选中个数
             * @type {Number}
             * @default Number.MAX_VAULE
             */
            maxRemains: Number.MAX_VALUE,
            /**
             * 是否接受输入，且仅在单选时有意义，多选时此值不起作用
             * @type boolean
             * @default false
             */
            write : false
        },
        /**
         * 重新设置基础数据
         * @param {object} data 组件data值
         */
        setData: function(data) {
            var me = this,
                    options = me.options;
            options.data = data || [];
            //问题单:DTS2013121002439
            me.oldInputText2 = "";
            // 问题单：DTS2013080802325
            options.value = null;
            // 修改问题：浮动框打开时setData，会执行_closeFloatPanel()将me.needSetDefaultVal置为true，
            // 然后在afterSetData事件中设置默认值遇到为true设置默认值失败，故在setData()时应将浮动框关闭
            if ("block" === me.dropDownEl.css("display")) {
                me.dropDownEl.hide();
            }

            if (!(me.list || me.tree)) {
                return;
            }

            if (me.options.tree) {
                me.tree.setData(data);
            } else {
                me.list.setData(data);
            }
        },
        /**
         * 销毁组件
         * @private
         */
        _destroyWidget: function() {
            var me = this;
            if (me.list) {
                me.list.destroy();
            } else if (me.tree) {
                me.tree.destroy();
            }
            // 销毁展开框，包括销毁dom节点，清除data中缓存数据
            if (me.dropDownEl) {
                me.dropDownEl.remove();
            }
            // 调用父类_destroyWidget函数销毁文本框
            me._super();
        },
        /**
         * 刷新弹出层内的布局
         * @private
         */
        _doLayoutFloat: function() {
            "use strict";
            var me = this,
                    listHeight = 0,
                    tData = me.options.data,
                    liNum = tData.length;
            // 定位展开框位置
            me.dropDownEl.addClass(comboboxSelectWinRadio).externalWidth(me.formDiv2El.outerWidth(true));

            // 展开框中的项数大于10个，则固定高度、增加滚动条
            listHeight = liHeight * (liNum > itemLimitNumber ? itemLimitNumber : liNum);
            me.ulParentEl.css("overflow", "hidden");
            // 设置树的大小
            if (me.tree) {
                me.tree.setHeight(listHeight);
            } else {
                me.list.setHeight(listHeight);
            }

            // 展开框在页面上定位
            me._setDropDownPos();
        },
        /**
         * 组件重绘
         * @private
         */
        _doLayout: function() {
            this._super();
            
            // 刷新布局时，关闭弹出层
            this._closeFloatPanel();
        },
        /**
         * @private
         * @description 关闭展开框时主要做下面几件事：1.隐藏下拉框；2.更新输入框中的内容和记录；3.决定是否触发change事件；
         * 4.如果是操作后(过滤)，需要还原到原来的面貌；
         */
        _closeFloatPanel: function(isNeedClearSelectedValue) {
            var me = this,
                    isclear = isNeedClearSelectedValue === "notClear" ? false : true,
                    opt = me.options;
            if (!me.openDropDownFlag && "block" === me.dropDownEl.css("display")) {
                me.dropDownEl.hide();
                
                //防止关闭时的操作影响关闭下拉框的速度和卡住，延后处理
                Sweet.Task.Delay.start({
                    id: opt.id + "-drop-close-delay",
                    run: function() {
                        //是否是正在过滤时关闭
                        var isFiltering = false;
                        //正在过滤时，恢复默认箭头图片
                        if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                            isFiltering = true;
                            me.downArrow.removeClass(comboboxBigDataImageClose)
                                    .addClass(comboboxArrowClass);
                        }

                        //关闭时，设置input的显示文字内容
                        var txt = "";
                        //优先判断是否有"all"存在
                        if(opt.all && opt.multi && me.list && me.list.isAll()){
                            txt = ALL_TEXT;
                        } else {
                            txt = me._getInputText();
                        }
                        //设置文本框内容和提示
                        //不是过滤时，肯定要设置输入域的值
                        if(!isFiltering){
                            me.formElement.val(txt).attr("title", txt);
                        } else {
                            //如果是过滤且是可输入时
                            if(opt.write && !opt.multi){
                                txt = me.formElement.val();
                                //清空原来所有选择的内容
                                if(isclear){
                                    me.list.setValue({});
                                }
                            } else {
                                //如果是多选或不可输入，肯定要写入
                                me.formElement.val(txt).attr("title", txt);
                            }
                        }
                        
                        if (me.rendered) {
                            me.formElement.blur();
                        }
                        
                        if(me.oldInputTxt !== txt){
                            //更新上一次的数据
                            me.oldInputTxt = txt;
                            //触发change事件
                            me._triggerHandler(null, "change", me.getValue());
                        }
                        
                        //如果是正在过滤时情况下关闭的，需要恢复原来的情况
                        if(isFiltering){
                            var ttemp = opt.tree ? me.tree : me.list;
                            ttemp.setWidth(me.formDiv2El.outerWidth(true)-8);
                            ttemp.filter("");
                        }
                    },
                    delay: 50
                });
            }
            me.openDropDownFlag = false;
            me.tabopen = false;
        },
        /**
         * 设置组件值
         * @private
         * @param {object} value 组件值
         */
        _setValue: function(value) {
            var me = this,
                    opt = me.options;
            if (!value) {
                me._setEmptyText();
                return;
            }
            
            if (me.options.tree) {
                me.tree.setValue(value);
            } else {
                me.list.setValue(value);
            }
            
            //再对combobx设置label显示内容
            var txt = "";
            //优先判断是否有"all"存在
            if(opt.all && opt.multi && me.list && me.list.isAll()){
                txt = ALL_TEXT;
            } else {
                txt = me._getInputText();
            }
            //设置文本框内容和提示
            if(!opt.tree && opt.write && $.isPlainObject(value) && value.data && value.data.write){
                txt = value.text;
            }
            me.formElement.val(txt).attr("title", txt);
        },
        /**
         * 获取组件值
         * @private
         * @return {Object} 组件值
         */
        _getValue: function() {
            var me = this,
                    opt = me.options,
                    value = null;
            if (opt.tree) {
                value = me.tree.getValue();
            } else {
                value = me.list.getValue();
            }
            
            //如果是可输入且单选且value值为空
            if(!opt.tree && opt.write && !opt.multi && ($.isEmptyObject(value) || $.isNull(value))){
                value = me.formElement.val();
                value = {
                    value : value,
                    text : value,
                    data : {
                        write : true
                    }
                };
            }
            return value;
        },
        /**
         * @private
         * 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用
         */
        _setDisabled: function(disabled) {
            var me = this,
                    formDiv2El = me.formDiv2El,
                    downArrow = me.downArrow,
                    arrowCls = "";

            formDiv2El.removeClass(comboboxParentClass)
                    .removeClass(comboboxParentGrayClass);
            if (disabled) {
                formDiv2El.addClass(comboboxParentGrayClass);
                arrowCls = comboboxArrowGrayClass;
                // setValue()与setDisabled()连用，setValue()后为空时，
                // 接着setDisabled时，emptyText还没出现就隐藏，隐藏后才出现
                if (me.hideEmptyTextTimer) {
                    clearTimeout(me.hideEmptyTextTimer);
                }
                me.hideEmptyTextTimer = setTimeout(function() {
                    if (me.emptyDiv) {
                        me.emptyDiv.hide();
                    }
                }, 800);
                if (!me.formDiv2El.hasClass(me.defaultPaddingDivClass)) {
                    return;
                }
                formDiv2El.removeClass(me.defaultPaddingDivClass).addClass(me.defaultPaddingDivDisabledClass);
            } else {
                formDiv2El.addClass(comboboxParentClass);
                arrowCls = comboboxArrowClass;
                if (me.emptyDiv && me.rendered) {
                    me.formElement.blur();
                }
                if (!formDiv2El.hasClass(me.defaultPaddingDivDisabledClass)) {
                    return;
                }
                formDiv2El.removeClass(me.defaultPaddingDivDisabledClass).addClass(me.defaultPaddingDivClass);
            }
            downArrow.removeClass().addClass(arrowCls);
            me.__setDisabled(disabled);
        },
        /**
         * @private
         * 设置组件不可编辑
         * @param {Boolean} editable 是否可编辑
         */
        _setEditable: function(editable) {
            var me = this;

            if (!editable) {
                // setValue()与setDisabled()连用，setValue()后为空时，
                // 接着setDisabled时，emptyText还没出现就隐藏，隐藏后才出现
                if (me.hideEmptyTextTimer) {
                    clearTimeout(me.hideEmptyTextTimer);
                }
                me.hideEmptyTextTimer = setTimeout(function() {
                    if (me.emptyDiv) {
                        me.emptyDiv.hide();
                    }
                }, 800);
            } else {
                if (me.emptyDiv && me.rendered) {
                    me.formElement.blur();
                }
            }
        },
        /**
         * @private
         * @description 创建输入域，下拉三角，下拉框并注册下拉点击事件，并处理过滤事件
         */
        _createInputField: function() {
            var me = this,
                    formDiv1El = me.formDiv1El,
                    formDiv2El = me.formDiv2El = $("<div>").appendTo(formDiv1El)
                    .attr("tabindex", -1),
                    formElement = me.formElement = $("<input>"),
                    downArrow = me.downArrow = $("<span>");
            
            //右边的下拉倒三角图标及点击事件
            downArrow.addClass(comboboxArrowClass)
                    .bind("click", {"me": me}, me._showDropDownList)
                    .appendTo(formDiv2El);
            //显示的label对象
            formElement.attr("type", me.type)
                    .addClass(comboboxInputClass)
                    .appendTo(formDiv2El);
            if (!me.options.editable) {
                formElement.attr("disabled", true);
            }

            formDiv2El.addClass(me.defaultPaddingDivClass).addClass(comboboxParentClass);
            formElement.bind("keyup", function(event) {
                var key1 = event.charCode || event.keyCode;
                //Tab键的特殊处理
                if (Sweet.constants.keyCode.TAB === key1) {
                    if (me.disabled) {
                        return;
                    }
                    if ("none" === me.dropDownEl.css("display")) {
                        me.tabopen = true;
                        // 刷新弹出层的布局
                        me._doLayoutFloat();
                        // 在页面上定位
                        me._setDropDownPos();
                        var maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                        me.dropDownEl.css({"z-index": maxIndex});
                        me.dropDownEl.show();
                        me.openDropDownFlag = false;
                        me.formElement.select();
                        return;
                    }
                }
                //延迟进行过滤事件的处理
                Sweet.Task.Delay.start({
                    id: me.options.id + "-combobox-filter-delay",
                    run: function(args) {
                        if ("none" !== me.dropDownEl.css("display")) {
                            me._filterItems(args[0], args[1]);
                        }
                    },
                    args: [event, me],
                    delay: 350
                });
            });

            // 创建展开框
            var dropDownElId = me.dropDownElId = "comboboxDropdown" + increments++,
                    dropDownEl = me.dropDownEl = $("<div>").addClass(me.floatBgClass)
                    .attr({"tabindex": -1})
                    .hide()
                    .appendTo("body");
            me.ulParentEl = $("<div>").attr({"id": dropDownElId})
                    .addClass(comboboxUlParentClass)
                    .appendTo(dropDownEl);
            //根据配置创建List或Tree,并且监控相应的事件
            me._createCmps();
        },
        /**
         * @private
         * @description 展开下拉框,主要处理的事为：1.disabled时不打开；2.过滤时打开，阻止事件冒泡；
         * 3.非过滤时打开下拉框，调整位置和宽度、高度
         * @param {Object} 事件
         */
        _showDropDownList: function(event) {
            var me = event.data.me;
            //如果是disabled，不处理
            if (me.downArrow.hasClass(comboboxArrowGrayClass)) {
                return;
            }
            //过滤的情况
            if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                me.downArrow.removeClass(comboboxBigDataImageClose)
                        .addClass(comboboxArrowClass);
                if ("none" === me.dropDownEl.css("display")) {
                    me.dropDownEl.show();
                }
                event.stopImmediatePropagation();
            } else {
                me.dropDownEl.css("z-index", $.getMaxZIndex(me.dropDownEl.css("z-index")));
                // 是否要打开展开框标志
                me.openDropDownFlag = false;
                //展开框没有打开的情况
                if (!$.isVisiable(me.dropDownEl)) {
                    // 在页面上定位
                    me._setDropDownPos();
                    me.dropDownEl.addClass(comboboxSelectWinRadio).show();
                    me.openDropDownFlag = true;
                }
                // 刷新弹出层的布局
                me._doLayoutFloat();
            }
        },
        /**
         * 异步生成list或tree，并注册事件
         * @private
         */
        _createCmps: function() {
            var me = this;
            // 创建展开框
            me._createDropDown();
            me._doLayoutFloat();
        },
        /**
         * 创建下拉列表
         * @private
         */
        _createDropDown: function() {
            var me = this,
                    options = me.options,
                    dropDownEl = me.dropDownEl;
            dropDownEl.css({"height": "auto"});
            if (me.list || me.tree) {
                return;
            }
            if (!options.tree) {
                // 创建list下拉列表（区分于树）
                me._creatDropDownList();
            } else {
                // 创建tree拉列表
                me._creatDropDownTree();
            }
            // 防止点击展开框时，导致展开框关闭
            dropDownEl.click(function(event) {
                event.stopImmediatePropagation();
            });
        },
        /**
         * 创建下拉列表（list）
         * @private
         */
        _creatDropDownList: function() {
            var me = this,
                    opt = me.options,
                    data = opt.data;
            // 创建list
            me.list = new Sweet.list.OptimizeList({
                multi: opt.multi,
                data: data,
                value: opt.value,
                tip: opt.tip,
                all : opt.all,
                tools : opt.tools,
                renderTo: me.dropDownElId,
                minRemains: opt.minRemains,
                maxRemains: opt.maxRemains
            });
            // 单选list
            me.list.addListener("nodeClick", function(node, data) {
                if (!opt.multi) {
                    me._closeFloatPanel("notClear");
                }
            });
        },
        /**
         * 创建下拉列表（tree）
         * @private
         */
        _creatDropDownTree: function() {
            var me = this,
                    opt = me.options;

            // 创建树形下拉列表OptimizeTree
            var tree = me.tree = new Sweet.tree.Tree({
                multi: opt.multi,
                data: opt.data,
                value: opt.value,
                renderTo: me.dropDownElId
            });
            // nodeClick，监听节点点击事件
            tree.addListener("nodeClick", function(event, flag) {
                if (!opt.multi) {
                    me._closeFloatPanel();
                }
            });
            // nodeExpand，监听节点展开事件
            tree.addListener("nodeExpand", function(event, flag) {
                me._setDropDownPos();
            });
            me.dropDownElRended = false;
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    opt = me.options;
            me._super();
            //渲染tree
            if (me.tree && !me.dropDownElRended) {
                me.tree.render(me.dropDownElId);
                me.dropDownElRended = true;
            }
            me.formElement.bind("click", {"me": me}, me._showDropDownList)
                    .bind("focusout", function() {
                        if ("block" === me.dropDownEl.css("display") && me.tabopen) {
                            me._closeFloatPanel();
                        }
                    });
        },
        /**
         * @private
         * @description 注册事件
         */
        _addListener: function() {
            var me = this,
                    options = me.options;
            $.each(me.handlers, function(eventName, func) {
                // 添加beforeCheckboxClick事件的监听
                if (eventName === "beforeCheckboxClick") {
                    if (options.tree) {
                        //树
                        me.tree.addListener("beforeCheckboxClick", func);
                    } else {
                        me.list.addListener("beforeCheckboxClick", func);
                    }
                }
            });
        },
        /**
         * @description 删除注册监听事件
         * @private
         * @param {String} eventName 事件名称
         */
        _removeListener: function(eventName) {
            var me = this,
                    options = me.options;
            if (!$.isNull(eventName)) {
                // 去除beforeCheckboxClick事件的监听
                if (eventName === "beforeCheckboxClick") {
                    if (options.tree) {
                        //树
                        me.tree.removeListener("beforeCheckboxClick");
                    } else {
                        me.list.removeListener("beforeCheckboxClick");
                    }
                }
            }
        },
        /**
         * 获取tree或list的value数据的text（只获取叶子节点）
         * @private
         * @param {Object} valueObj 数组对象
         * @return {String} 对象中的所有text
         */
        _getInputText: function(valueObj) {
            var me = this;
            valueObj = valueObj || me.getValue();
            var valueArr = me._oneObjToArray(valueObj);
            var leafVal = me._getLeafNodeObj(valueArr);
            return me._objArrToObj(leafVal).text;
        },
        /**
         * 将tree返回的数据转换为对象数组（只获取叶子节点）
         * @private
         * @param {Object} treeValue 对象数组 
         * @return {object} [{"text":"1", "value":"ONE"},{"text":"2", "value":"TWO"}]
         */
        _getLeafNodeObj: function(treeValue, obj) {
            var me = this;
            obj = obj || [];
            if (!treeValue) {
                return;
            }
            for (var i = 0; i < treeValue.length; i++) {
                if (treeValue[i].children) {
                    me._getLeafNodeObj(treeValue[i].children, obj);
                } else {
                    obj.push(treeValue[i]);
                }
            }
            return obj;
        },
        /**
         * 将对象数组转换为一个对象
         * @private
         * @return {object} {"text":"1,2", "value":"ONE,TWO"}
         */
        _objArrToObj: function(data) {
            var me = this, obj = {}, text = "", value = "", tempText = "";
            if (!data) {
                obj.text = text;
                obj.value = value;
                return obj;
            }
            var arr = me._oneObjToArray(data);
            for (var i = 0; i < arr.length; i++) {
                tempText = $.isUndefined(arr[i].text) ? arr[i].value : arr[i].text;
                value = value + "," + arr[i].value;
                text = text + "," + tempText;
            }
            obj.text = text.substring(1, text.length);
            obj.value = value.substring(1, value.length);
            return obj;
        },
        /**
         * 统一数据格式，对象转换为数字
         * @param {Object} data 对象或数组
         * @return {object} 数组如[{"text":"1", "value":"ONE"}]
         * @private
         */
        _oneObjToArray: function(data) {
            if (!data) {
                return null;
            }
            var value = [];
            // 对象转换为数字
            if ($.isArray(data)) {
                value = data;
            } else {
                if (!$.isUndefined(data.value) && !$.isUndefined(data.text)) {
                    value.push(data);
                }
            }
            return value;
        },
        /**
         * 过滤选项
         * @private
         */
        _filterItems: function(event, obj) {
            var me = obj,
                    options = me.options,
                    key = event.charCode || event.keyCode,
                    filterChar = me.formElement.val();
            // 文本框不可编辑时，不过滤
            if (false === me.editable || Sweet.constants.keyCode.TAB === key) {
                return;
            }
            // 手动输入时，换成小叉图片
            if (me.downArrow.hasClass(comboboxArrowClass)) {
                me.downArrow.removeClass(comboboxArrowClass)
                        .addClass(comboboxBigDataImageClose);
            }
            // 树过滤
            if (options.tree) {
                me.tree.filter(filterChar);
            } else {
                me.list.filter(filterChar);
            }

            if ("none" === me.dropDownEl.css("display")) {
                me.downArrow.click();
                me.dropDownEl.show();
            }
            // 展开框在页面上定位
            me._setDropDownPos();
        },
        /**
         * 定位展开框位置
         * @private
         */
        _setDropDownPos: function() {
            var me = this;
            // 展开框在页面上定位
            var pos = $.getFloatOffset(me.formDiv2El, me.dropDownEl);
            me.dropDownEl.css({"left": pos.left, "top": pos.top});
        },
        /**
         * 改变提示内容
         * @private
         */
        _setTitle: function() {
            var me = this,
                    options = me.options,
                    val = me.formElement.val(),
                    tip = options.tip;
            if (tip && val !== " ") {
                options.tooltip = val;
            }
        }
    });

    /**
     * 创建下拉框
     * @name Sweet.form.ComboBox
     * @class 
     * @extends Sweet.form.Input
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * </pre>
     * @example 
     * <pre>
     *  var value1 = [{"value":"1", "text":"ONE"},
     *                {"value":"2", "text":"TWO"},
     *                {"value":"3", "text":"THREE"},
     *                {"value":"4", "text":"FOUR"}];
     *  sweetCombobox = new Sweet.form.OptimizeCombobox({
     *      label : true,
     *      width : "30%",
     *      height : 40,
     *      data : value1,
     *      labelText : 'combobox',
     *      value : {"value":"2", "text":"TWO"},
     *      multi : false,
     *      renderTo : "sweet-combobox"
     * });
     * </pre>
     */
    Sweet.form.OptimizeCombobox = $.sweet.widgetFormOptCombobox;

}(jQuery));

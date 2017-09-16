/**
 * @fileOverview  
 * <pre>
 * form组件--下拉框
 * 2013/5/5
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

    $.widget("sweet.widgetFormCombobox", $.sweet.widgetFormInput, /** @lends Sweet.form.ComboBox.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-combobox]",
        type: 'text',
        eventNames: /** @lends Sweet.form.ComboBox.prototype*/{
            /**
             * @event
             * @description 值改变的事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            change: "改变值事件",
            /**
             * @event
             * @description 调用完组件的setData方法后事件
             */
            afterSetData: "调用完setData方法后事件",
            /**
             * @event
             * @description 调用完组件的setValue执行后触发
             */
            afterSetValue: "setValue执行后触发",
            /**
             * @event
             * @description 点击checkBox之前的事件(checkBox未选中的时候触发)
             */
            beforeCheckboxClick: "点击checkBox之前的事件(checkBox未选中的时候触发)",
            /**
             * @event
             * @description 关闭浮动窗口后的事件
             */
            afterCloseFloatWin: "关闭浮动窗口后的事件"
        },
        options: /** @lends Sweet.form.ComboBox.prototype*/{
            /**
             * 基础数据
             * @type Object
             * @default null
             */
            data: [],
            /**
             * 组件选中值
             * @type {Object/String}
             * @default null
             */
            value: null,
            /**
             * 多选属性
             * @type {Boolean}
             * @default false
             */
            multi: false,
            /**
             * 多选下拉框是否配置all选项
             * @type {Boolean}
             * @default true
             */
            all: false,
            /**
             * 是否支持手动输入
             * @type {Boolean}
             * @default false
             */
            write: false,
            /**
             * 是否显示选项的提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * 是否为树
             * @type {Boolean}
             * @default false
             */
            tree: false,
            /**
             * 是否延迟加载数据
             * @type {Boolean}
             * @default false
             */
            lazyLoad: false,
            /**
             * 每次加载记录数
             * @type {Number}
             * @default 50
             */
            limit: 50,
            /**
             * 是否是后台搜索
             * @type {Boolean}
             * @default false
             */
            remote: false,
            /**
             * 数据源
             * @type Object
             * @default null
             */
            store: null,
            /**
             * @description 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default 请选择
             */
            emptyText: Sweet.core.i18n.combobox.pleaseCheck,
            /**
             * 为空时，是否默认全部选择
             * @type {Boolean}
             * @default false
             */
            emptyAll: false,
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
             * 单选列表数据中，是否有“请选择”选项
             * @type {Boolean}
             * @default false
             */
            pleaseSelect: false,
            /**
             * 单选列表数据中，pleaseSelect属性为true时，配置列表出现的提示字样
             * @type {String}
             * @default 请选择
             */
            pleaseSelectText: Sweet.core.i18n.combobox.pleaseSelect
        },
        /**
         * @description 判断下拉框是否是全选的状态
         * @returns {boolean} 返回是否是全选的状态
         */
        isAll : function(){
            var me = this;
            if(me.options.all && me.options.multi && me.formElement.val() === ALL_TEXT){
                return true;
            }
            return false;
        },
        /**
         * 重新设置基础数据
         * @param {object} data 组件data值
         */
        setData: function(data) {
            var me = this;
            me._setData(data);
        },
        /**
         * 重新设置基础数据
         * @param {object} data 组件data值
         * @param {boolean} flag 是否为自已内部调用
         */
        _setData: function(data, flag) {
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
                me.setDataFlag = data;
                return;
            }
            if (me.formElement && !(true === flag)) {
                me.formElement.val("");
            }
            me.setDataFlag = null;
            
            if (me.options.tree) {
                me.tree.setData(data);
            } else {
                // 防止没有数据时出现all，setData之后，重新判断是否添加all
                me._deleteAllItem();
                if (options.multi && options.all && (data && data.length > 0)) {
                    me._creatAllItem();
                }
                // 文本框为空时，是否要设置为all
                if (options.emptyAll) {
                    me.inputShowAll = true;
                }
                me.list.setData(data);
            }
            if (me.formElement && !(true === flag)) {
                me.formElement.attr("title", "");
				options.tooltip = "";
            }
        },
        /**
         * @description 设置是否后台搜索
         * @param {Boolean} remote true：后台搜索，false：前台搜索
         */
        setRemote: function(remote) {
            var me = this;
            me.options.remote = remote;
            if (me.list) {
                me.list.setRemote(remote);
            }
        },
        /**
         * @description 设置是否延迟加载
         * @param {Boolean} lazyLoad 延迟加载
         */
        setLazyLoad: function(lazyLoad) {
            var me = this;
            me.options.lazyLoad = lazyLoad;
            if (me.list) {
                me.list.setLazyLoad(lazyLoad);
            }
        },
        /**
         * 销毁组件
         * @private
         */
        _destroyWidget: function() {
            var me = this;
            // 调用父类_destroyWidget函数销毁文本框
            me._super();
            if (me.list) {
                me.list.destroy();
            } else if (me.tree) {
                me.tree.destroy();
            }
            // 销毁展开框，包括销毁dom节点，清除data中缓存数据
            if (me.dropDownEl) {
                me.dropDownEl.remove();
            }
        },
        /**
         * 刷新弹出层内的布局
         * @private
         */
        _doLayoutFloat: function() {
            "use strict";
            var me = this,
                    liNum = 0,
                    listHeight = 0,
                    tData,
                    maxHeight = 0;
            if ($.isNotNull(me.options.store)) {
                tData = me.options.store._dealData();
            } else {
                tData = me.options.data;
            }
            // 定位展开框位置
            me.dropDownEl.addClass(comboboxSelectWinRadio).externalWidth(me.formDiv2El.outerWidth(true));

            // 设置树的大小
            if (me.tree) {
                me.tree.setWidth(me.formDiv2El.width(true));
                me.tree.setHeight("auto");
            } else {
                // 展开框中的项数大于9个，则固定高度、增加滚动条
                liNum = me.dropDownEl.find("li").length;
                if (9 < liNum) {
                    maxHeight = liHeight * (itemLimitNumber - 1);
                    me.ulParentEl.css({"max-height": maxHeight});
                }
                if ((!$.isPlainObject(tData)) && me.options.lazyLoad && $.isNotNull(me.options.store)) {
                    liNum -= 2;
                } else if ($.isPlainObject(tData) && me.options.lazyLoad && $.isNotNull(me.options.store)) {
                    var tempdata = tData.total,
                            dWidth = 0,
                            tempWidth = 0,
                            digits = 1;
                    while (tempdata >= 10) {
                        tempdata /= 10;
                        digits++;
                    }
                    tempWidth = me.dropDownEl.width();
                    dWidth = 125 + 7 * (digits - 1) * 2;
                    if (tempWidth < dWidth) {
                        me.dropDownEl.css("width", dWidth);
                    }
                }
                listHeight = liHeight * liNum;
                if (($.isPlainObject(tData)) && me.options.lazyLoad && $.isNotNull(me.options.store)) {
                    listHeight -= 15;
                }
                me.ulParentEl.css("overflow", "hidden");
                me.list.setHeight(0 === maxHeight ? listHeight : maxHeight);
                me.list.doLayout(true);
            }

            // 展开框在页面上定位
            me._orientDropDown();
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
         * @description 关闭展开框(多选时才会调用)
         */
        _closeFloatPanel: function() {
            var me = this;
            if (!me.openDropDownFlag && "block" === me.dropDownEl.css("display")) {
                me.dropDownEl.hide();
                var hasWrited = false;
                me._triggerHandler(null, "afterCloseFloatWin",
                        {value: me.getValue(), changed: me.beforCloseFloatWinInput !== me.formElement.val()});
                //恢复默认箭头图片
                if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                    hasWrited = true;
                    me.downArrow.removeClass(comboboxBigDataImageClose)
                            .addClass(comboboxArrowClass);
                }
                
                var valueObj = me.getValue();
                // 没有writer属性，且getValue()无值，关闭时应该将数据恢复，文本框内容清除
                // DTS2013090407624 不可编辑单选下拉框切换数据时，文本框内容应该跟着更新
                if (!me.options.write) {
                    // 过滤后恢复数据
                    if (me.options.tree) {
                        if (!valueObj || !me._getInputText(valueObj)) {
                            // 此处的过滤只是为了恢复数据，过滤后需要清除文本框内容
                            me.needSetDefaultVal = false;
                            me.tree.filter("");
                        }
                    } else {
                        // list过滤结束后不设置默认值
                        me.needSetDefaultVal = true;
                        // 文本框为空时，是否要设置为all，延迟加载不会过滤和设置以前的值，所以不会重新设置文本框内容
                        if (me.options.emptyAll && !me.options.lazyLoad && !me.options.remote) {
                            me.inputShowAll = true;
                        }
                        // 延迟加载时，不进行过滤
                        if (!me.options.lazyLoad && !me.options.remote) {
                            if (hasWrited) {
                                var td = me.list.getValue();
                                me.list._triggerHandler(null, eventAfterSetValue, td);
                                me.list.filter("");
                                if (me._afterFilter && ($.isEmptyObject(td) || $.isNull(td))) {
                                    me._afterFilter();
                                }
                            } else {
                                if (!me.options.multi) {
                                    var td = me.list.getValue();
                                    me.list._triggerHandler(null, eventAfterSetValue, td);
                                    me.list.filter("");
                                }
                            }
                        } else {
                            var txt = me._getInputText();
                            // 若关闭浮动框时，不过滤和设置前一次的值，则文本框值要判断是否为all
                            if (me.options.emptyAll && !txt) {
                                txt = ALL_TEXT;
                            }
                            if ($.isNull(txt)) {
                                me.formElement.val(me.oldInputText2);
                            } else {
                                me.formElement.val(txt);
                            }
                            me.formElement.attr("title", me.formElement.val());
                        }
                    }
                } else {
                    var temptxt = me.list.getValue(),
                            text = me._getInputText(temptxt),
                            newInputText = me.formElement.val();
                    if (temptxt && !($.isArray(temptxt) && 1 > temptxt.length) && !$.isEmptyObject(temptxt) &&
                            text !== me.lastSelectedVal) {
                        me.formElement.val(text);
                    } else {
                        if (me.oldInputText2 !== newInputText) {
                            me._triggerHandler(null, "change", newInputText);
                        }
                        me.formElement.val(newInputText);
                    }
                    me._setTitle();
                }
                if (me.rendered) {
                    me.formElement.blur();
                }
            }
            me.openDropDownFlag = false;
            me.tabopen = false;
        },
        /**
         * @private
         * @description 注册事件
         */
        _addListener: function() {
            var me = this,
                    options = me.options;
            $.each(me.handlers, function(eventName, func) {
                if (eventName === "change") {
                    if (options.tree) {
                        //树
                        me.tree.addListener("change", func);
                    } else {
                        me.list.addListener("change", function(event, val) {
                            if (!options.write && $.isEmptyObject(val) && !$.isArray(val)) {

                            } else {
                                func(event, val);
                            }
                        });
                    }
                }
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
                if (eventName === "change") {
                    if (options.tree) {
                        //树
                        me.tree.removeListener("change");
                    } else {
                        me.list.removeListener("change");
                    }
                }
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
         * 设置组件值
         * @private
         * @param {object} value 组件值
         */
        _setValue: function(value) {
            var me = this,
                    options = me.options;
            if (!value) {
                me.formElement.val("");
                me.formElement.attr("title", "");
                options.tooltip = "";
                return;
            }
            // 支持像文本框一样的使用
            if (options.write && value.write) {
                // 清除选中的值
                if (me.options.tree) {
                    // 此处的过滤只是为了清除选中的值，过滤后不需要清除文本框内容
                    me.needSetDefaultVal = true;
                    me.tree.filter("");
                } else {
                    // list过滤结束后不设置默认值
                    me.needSetDefaultVal = true;
                    me.list.filter("");
                    me.formElement.val("");
                }
                me.formElement.val(value.text);
                me._setTitle();
                me._triggerHandler(null, "change", value);
                return;
            }
            // 正常的下拉框
            // 防止没有任何操作，list和tree都没创建就setValue()
            // setValue()时，应该让所有的数据都出来，否则setValue出错或者不全
            me._showAllLine();

            if (me.options.tree) {
                me.tree.setValue(value);
            } else {
                me.list.setValue(value);
            }

            if (me.tree) {
                if (me.timerGetValue) {
                    clearInterval(me.timerGetValue);
                }
            }

            // 改变all选项的样式
            me._setAllItem();
        },
        /**
         * 获取组件值
         * @private
         * @return {Object} 组件值
         */
        _getValue: function() {
            var me = this,
                    options = me.options,
                    value = null;
            // 防止没有任何操作，list和tree都没创建就setValue()
            if (me.options.tree) {
                value = me.tree.getValue();
            } else {
                value = me.list.getValue();
                // 多选list若配置emptyAll，且文本框为all、getValue()为空数组时，则返回null
                if (options.multi && options.emptyAll &&
                        (me.formElement.val() === ALL_TEXT) &&
                        (!value || ($.isArray(value) && 1 > value.length))) {
                    return null;
                }
            }
            if (options.write &&
                    me.formElement.val() &&
                    (!value || ($.isArray(value) && 1 > value.length) || $.isEmptyObject(value))) {
                value = {"value": me.formElement.val(),
                    "text": me.formElement.val(),
                    "write": true};
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
                if (!me.formDiv2El.hasClass(me.defaultPaddingDivClass)) {
                    return;
                }
                formDiv2El.removeClass(me.defaultPaddingDivClass).addClass(me.defaultPaddingDivDisabledClass);
            } else {
                formDiv2El.addClass(comboboxParentClass);
                arrowCls = comboboxArrowClass;
                if (me.rendered) {
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
            } else {
                if (me.rendered) {
                    me.formElement.blur();
                }
            }
        },
        /**
         * @private
         * @description 组件配置属性校验，比如属性间互斥等
         */
        _optionsValidate: function() {
            var me = this,
                    o = me.options;
            // 延迟加载时不能全选
            if (o.all && o.lazyLoad) {
                me._error("Lazy loading can not select all!");
                return false;
            }

            return true;
        },
        /**
         * @private
         * @description 创建输入域
         */
        _createInputField: function() {
            var me = this,
                    formDiv1El = me.formDiv1El,
                    formDiv2El = me.formDiv2El = $("<div>").appendTo(formDiv1El)
                    .attr("tabindex", -1),
                    formElement = me.formElement = $("<input>"),
                    downArrow = me.downArrow = $("<span>");
            //暂时屏蔽此功能，后续修改好后再开放此属性，现在即使设置也不起作用
            if (!me._optionsValidate()) {
                return;
            }

            downArrow.addClass(comboboxArrowClass)
                    .bind("click", {"me": me}, me._showDropDownList)
                    .appendTo(formDiv2El);
            formElement.attr("type", me.type)
                    .addClass(comboboxInputClass)
                    .appendTo(formDiv2El);
            if (!me.options.editable) {
                formElement.attr("disabled", true);
            }
            if($.isNotNull(me.options.vID)){
                formElement.attr("id", me.options.vID);
            }

            formDiv2El.addClass(me.defaultPaddingDivClass).addClass(comboboxParentClass);
            formElement.click(function(event) {
                if ("block" === me.dropDownEl.css("display")) {
                    event.stopImmediatePropagation();
                }
            }).bind("keyup", function(event) {
                var key1 = event.charCode || event.keyCode;
                //问题单：DTS2013122005038
                if (Sweet.constants.keyCode.TAB === key1) {
                    if (me.disabled) {
                        return;
                    }
                    if ("none" === me.dropDownEl.css("display")) {
                        me.tabopen = true;
                        // 刷新弹出层的布局
                        me._doLayoutFloat();
                        // 在页面上定位
                        me._orientDropDown();
                        var maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                        me.dropDownEl.css({"z-index": maxIndex});
                        me.dropDownEl.show();
                        me.beforCloseFloatWinInput = me.formElement.val();
                        me.openDropDownFlag = false;
                        me.formElement.select();
                        return;
                    }
                }
                /*避免在输入时忽然跳转显示all*/
                me.inputShowAll = false;
                if (!me.options.tree) {
                    me.list.setFilter(me.formElement.val());
                }
                Sweet.Task.Delay.start({
                    id: me.options.id + "-combobox-filter-delay",
                    run: function(args) {
                        if ("none" !== me.dropDownEl.css("display")) {
                            me._afterFilter = me._filterItems(args[0], args[1]);
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
                    .appendTo("body"),
                    ulParentEl = me.ulParentEl = $("<div>").attr({"id": dropDownElId})
                    .addClass(comboboxUlParentClass)
                    .appendTo(dropDownEl);
            me._asynOperations();
            if (me.options.emptyAll) {
                me.inputShowAll = true;
            }
        },
        /**
         * 展开下拉框
         * @private
         * @param {Object} 事件
         */
        _showDropDownList: function(event) {
            var me = event.data.me;
            if (me.downArrow.hasClass(comboboxArrowGrayClass)) {
                return;
            }
            if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                me.downArrow.removeClass(comboboxBigDataImageClose)
                        .addClass(comboboxArrowClass);
                // 过滤后恢复数据
                //如果needSetDefaultVal为true，表示需要list或tree重新恢复数据，如果为flase，表示不用了
                me.needSetDefaultVal = true;
                if (me.options.tree) {
                    me.tree.filter("");
                } else {
                    me.list.filter("");
                }
                if ("none" === me.dropDownEl.css("display")) {
                    me.dropDownEl.show();
                    me.beforCloseFloatWinInput = me.formElement.val();
                }
                event.stopImmediatePropagation();
            } else {
                // 调节展开框高度
                me._resizeDropDownHeight();
                var maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                me.dropDownEl.css("z-index", maxIndex);
                // 是否要打开展开框标志
                me.openDropDownFlag = false;
                //展开框没有打开
                if (!$.isVisiable(me.dropDownEl)) {
                    // 在页面上定位
                    me._orientDropDown();
                    me.dropDownEl.addClass(comboboxSelectWinRadio);
                    me.dropDownEl.show();
                    me.openDropDownFlag = true;
                    me.beforCloseFloatWinInput = me.formElement.val();
                    if (me.rendered) {
                    }
                }
                // 刷新弹出层的布局
                me._doLayoutFloat();
            }
            me._showAllLine();
        },
        /**
         * 异步生成list或tree，并注册事件
         * @private
         */
        _asynOperations: function() {
            var me = this,
                    options = me.options;
            if (!me.finishedCreatingDropdown) {
                // 创建展开框
                me._createDropDown();
                me._doLayoutFloat();
                if (me.setDataFlag) {
                    me._setData(me.setDataFlag, true);
                }
                // 注册事件
                me._registInitEvent();
                me.finishedCreatingDropdown = true;
            }
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
                    options = me.options,
                    data = options.data;
            // 多选出现all
            if (options.multi) {
                // 出现全选
                if (options.all) {
                    me._creatAllItem();
                }
            }
            // 创建list
            var list = me.list = new Sweet.list.List({
                multi: options.multi,
                data: data,
                store: options.store,
                lazyLoad: options.lazyLoad,
                limit: options.limit,
                remote: options.remote,
                tip: options.tip,
                renderTo: me.dropDownElId,
                minRemains: options.minRemains,
                maxRemains: options.maxRemains,
                _pleaseSelect: options.pleaseSelect,
                _pleaseSelectText: options.pleaseSelectText
            });
        },
        /**
         * 创建下拉列表（tree）
         * @private
         */
        _creatDropDownTree: function() {
            var me = this,
                    options = me.options;

            // 创建树形下拉列表
            var tree = me.tree = new Sweet.tree.Tree({
                height: "auto",
                multi: options.multi,
                data: options.data,
                store: options.store,
                value: options.value,
                lazyLoad: options.lazyLoad,
                lazyLoadRows: options.limit,
                backSearch: options.remote,
                backEndLoad: true,
                searchDir: options.searchDir,
                renderTo: me.dropDownElId,
                icon : options.icon,
                // 单选树
                nodeClick: function(node, data) {
                    if (!tree.options.multi && (!data.children || data.children.length < 1)) {
                        me.dropDownEl.hide();
                        var valueObj = me.tree.getValue();
                        me.formElement.val(data.text);
                        me._setTitle();
                        // 恢复所有的节点
                        me._triggerHandler(null, "afterCloseFloatWin",
                                {value: me.getValue(), changed: me.beforCloseFloatWinInput !== me.formElement.val()});
                        if (me.rendered) {
                            me.formElement.blur();
                        }
                        // 恢复默认箭头图片
                        if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                            me.downArrow.removeClass(comboboxBigDataImageClose)
                                    .addClass(comboboxArrowClass);
                        }
                    }
                },
                // 多选树
                nodeCheck: function(event, data) {
                    if (tree.options.multi) {
                        var txt = me._getInputText();
                        me.formElement.val(txt);
                        me._setTitle();
                        if (me.rendered) {
                            me.formElement.blur();
                        }
                    }
                },
                // 多选树
                nodeUnCheck: function(event, data) {
                    if (tree.options.multi) {
                        var txt = me._getInputText();
                        me.formElement.val(txt);
                        me._setTitle();
                        if (me.rendered) {
                            me.formElement.blur();
                        }
                    }
                }
            });
            me.dropDownElRended = false;
        },
        /**
         * 注册事件(list)
         * @private
         */
        _registInitEvent: function() {
            var me = this;
            if (me.list) {
                me._registInitEventList();
            } else if (me.tree) {
                me._registInitEventTree();
            } else {
                return;
            }
        },
        /**
         * 注册事件(list)
         * @private
         */
        _registInitEventList: function() {
            var me = this,
                    options = me.options,
                    list = me.list;

            // 设置默认值
            list.addListener("afterSetData", function(event, data) {
                // 如果外部注册了afterSetData
                me._triggerHandler(null, eventAfterSetData, data);
                // 多选list配置了emptyAll属性且没有选择的值时，则不设置默认值，文本框出现all
                var tv = list.getValue();
                var hasVle = true;
                if (tv) {
                    if ($.isArray(tv) && tv.length > 0) {
                        hasVle = false;
                    }
                    if ($.isPlainObject(tv) && (tv.value || tv.text)) {
                        hasVle = false;
                    }
                }
                if (options.multi && options.emptyAll) {
                    if (!hasVle) {
                        return;
                    }
                    // 设置文本框的值
                    if (me.inputShowAll) {
                        me.formElement.val(ALL_TEXT);
                        me.formElement.attr("title", me.formElement.val());
                        me.inputShowAll = false;
                    }
                    me._setTitle();
                    return;
                }
                // 过滤的时候，会setData()，此时不要设置默认值
                if (me.needSetDefaultVal) {
                    me.needSetDefaultVal = false;
                    return;
                }
                // 默认值为第一条数据
                var value = (data && data.length > 0) ? data[0] : [];

                if (options.value) {
                    value = options.value || value;
                } else {
                    if(options.multi){
                        return;
                    }
                }
                
                if ($.isArray(value) && (value.length < 1 || value.length > data.length)) {
                    // 多选且配置emptyAll属性，设置的值为空时，文本框应该为all
                    if (options.multi && options.emptyAll) {
                        me.formElement.val(ALL_TEXT);
                    } else {
                        me.formElement.val("");
                    }
                    me._setTitle();
                    if (me.rendered) {
                        me.formElement.blur();
                    }
                    return;
                }
                me._setTitle();
                // 有长度的数组或一个对象
                list.setValue(value);
                me.needSetDefaultVal = false;
                options.value = value;
            });

            // 设置文本框内容
            list.addListener("afterSetValue", function(event, data) {
                var inputText;
                // 问题单：DTS2013080802325
                if ((!options.value || !options.value.value ||
                        ($.isArray(options.value) && 1 > options.value.length)) &&
                        (!data || ($.isArray(data) && 1 > data.length))) {
                    // 多选且配置emptyAll属性，设置的值不存在时，文本框应该为all
                    var tempCfg = options.multi && options.emptyAll;
                    var vtxt = tempCfg ? ALL_TEXT : "";
                    me.formElement.val(vtxt);
                    me._setTitle();
                    //多选时，不默认选择第一个
                    if (!options.multi) {
                        list._setFirstValue();
                    }
                    return;
                }
                if (me.notSetInpueVal) {
                    me.notSetInpueVal = false;
                    return;
                }
                // 单选，且选择了请选择选项
                var isPlsSlt = Boolean(!options.multi && data &&
                        options.pleaseSelectText === data.value && options.pleaseSelect);
                if (isPlsSlt) {
                    inputText = "";
                } else {
                    inputText = me._objArrToObj(data).text;
                    // 多选list，判断all是否需要选中
                    me._setAllItem();
                    if (me.allLiEl && me._allIsClicked()) {
                        inputText = ALL_TEXT;
                    }
                }
                //如果设置的值和显示的值一样，不需要再设置了
                if (me.formElement.val() === inputText) {
                    return;
                }
                // 设置文本框的值
                if ($.isNull(inputText) && !isPlsSlt) {
                    me.formElement.val(me.oldInputText2);
                } else {
                    me.formElement.val(inputText);
                }
                if (me.rendered) {
                    me.formElement.blur();
                }
                me._setTitle();
                // 如果外部注册了afterSetValue
                me._triggerHandler(null, eventAfterSetValue, data);
            });

            // 单选list
            list.addListener("nodeClick", function(node, data) {
                if (!options.multi) {
                    // DTS2013090204662
                    // 问题：下拉框过滤之后再点击下拉框显示的是过滤的内容（应该为全部数据）
                    me._closeFloatPanel();
                    me.notSetInpueVal = false;
                }
            });

            // 多选list
            list.addListener("checkboxClick", function(node, data) {
                if (options.multi) {
                    var valueObj = list.getValue();
                    var txt = me._objArrToObj(valueObj).text;
                    // DTS2013090301740 
                    me.notSetInpueVal = false;
                    // 选中all上的对勾
                    if (me.allLiEl) {
                        if (list.isAll()) {
                            me.allLiEl.children("a")
                                    .removeClass()
                                    .addClass(checkboxImageSelect);
                            txt = ALL_TEXT;
                        } else {
                            me.allLiEl.children("a")
                                    .removeClass()
                                    .addClass(checkboxImage);
                        }
                    }
                    // 没有选择数据，而且配置emptyAll，文本框应该显示all
                    if (!txt && options.emptyAll) {
                        me.formElement.val(ALL_TEXT);
                    } else {
                        me.formElement.val(txt);
                    }
                    me._setTitle();
                    if (me.rendered) {
                        me.formElement.blur();
                    }
                }
            });
        },
        /**
         * 注册事件(tree)
         * @private
         */
        _registInitEventTree: function() {
            var me = this,
                    options = me.options,
                    tree = me.tree;
            // nodeExpand，定位展开框位置
            tree.addListener("nodeExpand", function(event, flag) {
                me._orientDropDown();
            });

            // afterSetValue
            tree.addListener("afterSetValue", function(event, data) {
                var inputText = me._getInputText(data);
                // 设置文本框的值
                me.formElement.val(inputText);
                me._setTitle();
                if (me.rendered) {
                    me.formElement.blur();
                }
                // 如果外部注册了afterSetValue
                me._triggerHandler(null, eventAfterSetValue, data);
            });

            // 如果外部注册了afterSetData
            tree.addListener("afterSetData", function(event, data) {
                // 过滤后的setData()，不要清除文本框内容，其他的setData()需要清除
                if (!me.needSetDefaultVal) {
                    me.formElement.val("");
                    me._setTitle();
                }
                me.needSetDefaultVal = false;
                me._triggerHandler(null, eventAfterSetData, data);
            });
        },
        /**
         * @private
         * @description 触发注册事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据
         */
        _triggerHandler: function(e, eName, data) {
            var me = this,
                    result;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    result = func.call(null, e, data);
                }
            });

            return result;
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    options = me.options;
            me._super();
            //渲染tree
            if (me.tree && !me.dropDownElRended) {
                me.tree.render(me.dropDownElId);
                me.dropDownElRended = true;
            }
            me.formElement.bind("click", {"me": me}, me._showDropDownList);
            me.formElement.bind("focus", function() {
                //问题单：DTS2013122005038
                var tempVal;
                if (me.list) {
                    tempVal = me.list.getValue();
                }
                me.oldInputText = me.formElement.val();
                me.oldInputText2 = me.formElement.val();
                me.lastSelectedVal = me._getInputText(tempVal);

            });
            me.formElement.bind("focusout", function() {
                if ("block" === me.dropDownEl.css("display") && me.tabopen) {
                    me._closeFloatPanel();
                }
            });
            // 解决问题：配置store时，组件在store.load()后，也应该将文本框内容置为all
            // DTS2013083001723 
            if (options.store && options.emptyAll) {
                options.store.addListener({"beforeLoad": function() {
                        me.inputShowAll = true;
                        if (me.notSetInpueVal) {
                            me.inputShowAll = false;
                        }
                    }});
            }
        },
        /**
         * 创建all和线
         * @private
         */
        _creatAllItem: function() {
            var me = this;
            // 增加all选项
            var liEl = me.allLiEl = $("<li>");
            var aDom = $("<a>");
            var spanDom = $("<span>").addClass(comboboxMultiSpan);
            var partitionLine = me.partitionLine = $("<div>").addClass(comboboxPartitionLineClass);
            liEl.addClass(comboboxExpandText)
                    .prependTo(me.dropDownEl);
            aDom.addClass(checkboxImage)
                    .appendTo(liEl);
            liEl.bind("click", function() {
                me._clickAllImage(aDom.get(0));
            });
            spanDom.attr("value", "All")
                    .text(ALL_TEXT)
                    .appendTo(liEl);
            partitionLine.insertBefore(me.ulParentEl);
        },
        /**
         * 删除all和线
         * @private
         */
        _deleteAllItem: function() {
            var me = this;
            if (me.allLiEl) {
                me.dropDownEl.find("li").remove();
                me.partitionLine.remove();
                me.allLiEl = null;
            }
        },
        /**
         * 全选是否被修改样式
         * @private
         */
        _setAllItem: function() {
            var me = this;
            // 有all选项
            if (me.allLiEl) {
                // 全选
                if (me._allIsClicked()) {
                    me.allLiEl.children("a").removeClass(checkboxImage)
                            .addClass(checkboxImageSelect);
                } else {
                    me.allLiEl.children("a")
                            .removeClass(checkboxImageSelect)
                            .addClass(checkboxImage);
                }
            }
        },
        /**
         * 判断多选下拉框是否被全选
         * @private
         * @return {boolean} 
         */
        _allIsClicked: function() {
            var me = this,
                    options = me.options;
            var isAll = false;
            if (me.list && me.list.isAll()) {
                isAll = true;
            }
            return isAll;
        },
        /**
         * 隐藏all和线
         * @private
         */
        _hideAllLine: function() {
            var me = this;
            if (me.allLiEl) {
                me.allLiEl.hide();
                me.partitionLine.hide();
            }
        },
        /**
         * 显示all和线
         * @private
         */
        _showAllLine: function() {
            var me = this;
            if (me.allLiEl) {
                me.allLiEl.show();
                me.partitionLine.show();
            }
        },
        /**
         * 点击all事件
         * @param {Object} nodeName dom节点
         * @private
         */
        _clickAllImage: function(nodeName) {
            var me = this,
                    options = me.options;
            var oldImageClass = nodeName.className;
            var newImageClass = (oldImageClass === checkboxImage ? checkboxImageSelect : checkboxImage);
            me.allLiEl.children("a")
                    .removeClass(oldImageClass)
                    .addClass(newImageClass);
            if (newImageClass === checkboxImageSelect) {
                me.list.all(true);
                me.formElement.val(ALL_TEXT);
                me._setTitle();
            } else {
                me.list.all(false);
                // 没有选择数据，而且配置emptyAll，文本框应该显示all
                if (options.emptyAll) {
                    me.formElement.val(ALL_TEXT);
                } else {
                    me.formElement.val("");
                }
                me._setTitle();
            }
            if (me.rendered) {
                me.formElement.blur();
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
            if (false === me.editable) {
                return;
            }
            if (Sweet.constants.keyCode.TAB === key) {
                return;
            }
            // 手动输入时，换成小叉图片
            if (me.downArrow.hasClass(comboboxArrowClass)) {
                me.downArrow.removeClass(comboboxArrowClass)
                        .addClass(comboboxBigDataImageClose);
            }
            // 输入值与上一次的输入值相同，不过滤
            if (me.oldInputText === filterChar) {
                return;
            }
            me.oldInputText = filterChar;
            // 过滤的时候，会setData()，此时不要设置默认值
            me.needSetDefaultVal = true;
            me.notSetInpueVal = true;
            // 树过滤
            if (options.tree) {
                me.tree.filter(filterChar);
                if ("none" === me.dropDownEl.css("display")) {
                    me.downArrow.click();
                }
                return;
            } else {
                //存放过滤前list选中的值
                var lastSelectVal = me.list.getValue();
                me.list.filter(filterChar);
                if ("none" === me.dropDownEl.css("display")) {
                    me.downArrow.click();
                }
                //修改问题：comboBox配置write为true，列表选中一个值，删除输入框中的值，getValue拿到的是删除以前的值
                //如果write为true，文本框输入值时将上一次单选列表选中的值清空
                if (options.write && !options.multi) {
                    me.list.setValue("");
                }
                return function() {
                    //修改问题：单选列表comboBox配置write为false，编辑文本框，保留list上一次选中的值；
                    if (!options.multi && !options.write) {
                        me.list.setValue(lastSelectVal);
                    }
                };
            }

            // 是否显示all
            if (filterChar) {
                me._hideAllLine();
            } else {
                me._showAllLine();
            }

            // 调节展开框高度
            me._resizeDropDownHeight();
            if ("none" === me.dropDownEl.css("display")) {
                me.dropDownEl.show();
                me.beforCloseFloatWinInput = me.formElement.val();
            }
            // 展开框在页面上定位
            me._orientDropDown();
        },
        /**
         * 过滤后，重新调整展开框的高度
         * @private
         */
        _resizeDropDownHeight: function() {
            var me = this;
            // 展开框中的项数大于10个，则固定高度、增加滚动条
            if (me.list) {
                if (me.allLiEl &&
                        (("display" === me.dropDownEl.css("display") &&
                                "display" === me.allLiEl.css("display")) ||
                                "none" === me.dropDownEl.css("display"))) {
                    me.ulParentEl.css({"max-height": ((itemLimitNumber - 1) * liHeight) + "px"});
                } else {
                    if (me.list.lazyLoadEl) {
                        if (me.options.lazyLoad && !$.isVisiable(me.list.lazyLoadEl)) {
                            me.ulParentEl.css({"max-height": ((itemLimitNumber - 1) * liHeight - 18) + "px"});
                        }
                    }
                }
            }
        },
        /**
         * 定位展开框位置
         * @private
         */
        _orientDropDown: function() {
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
        },
        /**
         * @description 过滤后处理
         * @private
         */
        _afterFilter: $.noop
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
     *  sweetCombobox = new Sweet.form.ComboBox({
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
    Sweet.form.ComboBox = $.sweet.widgetFormCombobox;

}(jQuery));

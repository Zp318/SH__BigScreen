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
    var comboboxInputClass = "sweet-form-comboboxv1-input",
            comboboxArrowClass = "sweet-form-comboboxv1-arrow",
            comboboxArrowGrayClass = "sweet-form-comboboxv1-arrow-gray",
            comboboxParentClass = "sweet-form-comboboxv1",
            comboboxParentGrayClass = "sweet-form-comboboxv1-gray",
            comboboxWinClass = "sweet-form-comboboxv1-win",
            comboboxWinBodyClass = "sweet-form-comboboxv1-win-body",
            comboboxWinBodyResizeElClass = "sweet-form-body-resizeEl",
            comboboxWinBodyResizeXYElClass = "sweet-form-body-resizeXYEl",
            comboboxWinBodyResizeXlElClass = "sweet-form-body-resizeXlEl",
            comboboxWinBodyResizeXrElClass = "sweet-form-body-resizeXrEl",
            comboboxWinBodyResizeYtElClass = "sweet-form-body-resizeYtEl",
            comboboxWinBodyResizeYbElClass = "sweet-form-body-resizeYbEl",
            comboboxBigDataImageClose = "sweet-form-comboboxv1-bigDataImage-delete",
            comboboxTreeFloatPanelClass = "sweet-form-comboboxv1-tree-win",
            eventAfterSetData = "afterSetData",
            eventAfterSetValue = "afterSetValue",
            eventChange = "change",
            eventBeforeSearch = "beforesearch",
            eventSearch = "search",
            eventNodeClick = "nodeClick",
            eventClick = "click",
            eventBeforeCheckboxClick = "beforeCheckboxClick",
            eventBeforeCheckChange = "beforecheckchange",
            eventCollapse = "collapse",
            eventExpand = "expand",
            eventCheckChange = "checkchange",
            eventCheckboxClick = "checkboxClick",
            eventCheckboxAllClick = "checkboxAllClick",
            eventResizeLayout = "resizeLayout",
            eventResizeElMove = "resizeElMove",
            increments = 0,
            itemLimitNumber = 10,
            LIHEIGHT = 22,
            ALL_TEXT = Sweet.core.i18n.combobox.checkAll;

    $.widget("sweet.widgetFormCombobox_v1", $.sweet.widgetFormInput, /** @lends Sweet.form.ComboBox_v1.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-combobox-v1]",
        type: 'text',
        eventNames: /** @lends Sweet.form.ComboBox_v1.prototype*/{
            /**
             * @event
             * @description 值改变的事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            change: "改变值事件",
            /**
             * @event
             * @description 查询前事件,如果返回为false则不做过滤处理,一般两个参数({filter: xxxx}, me)
             */
            beforesearch: "查询前事件",
            /**
             * @event
             * @description 过滤事件,一般两个参数(data, me)
             */
            search: "过滤事件",
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
             * @description 树节状态改变前事件,一般参数为({node: node, checked: checked}, tree/list, me)
             */
            beforecheckchange: "树节状态改变前事件",
            /**
             * @event
             * @description 关闭浮动窗口后的事件
             */
            collapse: "下拉列表关闭后的事件",
            /**
             * @event
             * @description 下拉列表展开前的事件
             */
            expand: "下拉列表展开前的事件",
            /**
             * @event
             * @description 勾选状态发生变化时的事件
             */
            checkchange: "勾选状态发生变化时的事件",
            /**
             * @event
             * @description 单选节点单击时触发的事件
             */
            click: "单选节点单击时触发的事件",
            /**
             * @event
             * @description 缩放刷新后事件,一般两个参数(renderEl, me)
             */
            resizeLayout: "缩放刷新后事件",
            /**
             * @event
             * @description 虚线框缩放事件,一般两个参数({offset: offset, resizeInfo: resizeInfo, resizeType: "xy"}, me)
             */
            resizeElMove: "虚线框缩放事件"
        },
        options: /** @lends Sweet.form.ComboBox_v1.prototype*/{
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
             * 是否支持手动输入
             * @type Boolean
             * @default false
             */
            write: false,
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
             * 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default 请选择
             */
            emptyText: Sweet.core.i18n.combobox.pleaseCheck,
            /**
             * 为空时，是否默认全部选择
             * @type Boolean
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
             * 行工具栏图标，现在只支持delete
             * @type {Array}
             * @default null
             */
            tools: null,
            /**
             * 查看已选择操作条
             * @type {Boolean}
             * @default false
             */
            sViewBar: false,
            /**
             * 是否显示树节点的图标
             * @type {Boolean}
             * @default false
             */
            icon: false,
            /**
             * 是否显示节点之间的连线
             * @type {Boolean}
             * @default true
             */
            useArrows: true,
            /**
             * 下拉时是否显示清除过滤信息图标
             * @type {Boolean}
             * @default false
             */
            isClearFilter: false,
            /**
             * 单选下拉时,是否让数据第一条默认选中
             * @type {Boolean}
             * @default true
             */
            isSelectFirst: true,
            /**
             * 以毫秒表示的从开始输入到发出查询语句过滤下拉列表的时长, 默认350毫秒  
             * @type {Number}
             * @default 350
             */
            queryDelay: 350,
            /**
             * 下拉框是否支持缩放,支持三种情况: 全缩放(true/"xy"),宽度缩放"x",高度缩放"y"
             * @type {Boolean}
             * @default false
             */
            resizAble: false
        },
        /**
         * @description 判断下拉框是否是全选的状态,只针对多选list型
         * @returns {Boolean} 返回是否是全选的状态
         */
        isAll: function() {
            var me = this;
            //这里只针对多选list,分两种:1.全选;2.一个都没选且emptyAll为true
            if (me.options.multi && !(true == me.options.tree || "true" == me.options.tree)) {
                if (me.list && (me.list.isAll() || (me.options.emptyAll && me.list.getValue().length <= 0))) {
                    return true;
                }
            }
            return false;
        },
        /**
         * @description 设置基础数据
         * @param {Object} data 组件data值
         * @param {Boolean} isAppend 是否追加(只针对列表,树不做此处理)
         * @param {Boolean} isOriginalState 是否保持当前状态,如下拉框是否为展开,过滤信息是否清空等等
         * @param {Number} total 总条数
         */
        setData: function(data, isAppend, isOriginalState, total) {
            var me = this;
            if (me.disabled) {
                return;
            }
            if (me._resizeInfo) {
                me._resizeInfo = null;
            }
            if (isOriginalState) {
                me._updateData(data, isAppend, total);
            } else {
                me._setData(data, isAppend, total);
            }
            me._doLayoutFloat();
            //setData和setValue后,第一次show时强制刷新
            me._isDoLayout = true;
        },
        /**
         * @private
         * @description 设置基础数据处理
         * @param {Object} data 组件data值
         * @param {Boolean} isAppend 是否追加(只针对列表,树不做此处理)
         * @param {Number} total 总条数
         */
        _updateData: function(data, isAppend, total) {
            var me = this,
                    _length = 0;
            data = me._objToArray(data);
            //记录之前的数据长度,用追加datalength用
            _length = me._dataLength;
            me._dataLength = data.length;
            if (true == me.options.tree || "true" == me.options.tree) {
                me.tree.setData(data);
            } else {
                if (isAppend) {
                    me._dataLength = _length + me._dataLength;
                }
                me.list.setData(data, isAppend, total);
            }
        },
        /**
         * @private
         * @description 设置基础数据处理
         * @param {Object} data 组件data值
         * @param {Boolean} isAppend 是否追加(只针对列表,树不做此处理)
         * @param {Number} total 总条数
         */
        _setData: function(data, isAppend, total) {
            var me = this,
                    _length = 0;
            data = me._objToArray(data);
            //记录之前的数据长度,用追加datalength用
            _length = me._dataLength;
            me._dataLength = data.length;
            if (me.dropDownEl && "block" === me.dropDownEl.css("display")) {
                me.dropDownEl.hide();
            }
            //清空显示框信息
            me._setTitle("");
            //恢复下拉图标
            me._initFilterImageState();
            if (true == me.options.tree || "true" == me.options.tree) {
                me.tree.setData(data);
            } else {
                if (isAppend) {
                    me._dataLength = _length + me._dataLength;
                }
                me.list.setData(data, isAppend, total);
                if (me.options.multi) {
                    // 文本框为空时，是否要设置为all
                    if (me.options.emptyAll && me._dataLength > 0) {
                        me._setTitle(ALL_TEXT);
                    }
                } else {
                    //单选时默认第一个选中
                    if (me.options.isSelectFirst && data.length > 0) {
                        me.setValue(data[0]);
                    }
                }
            }
        },
        _setValue: $.noop,
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 组件值
         * @param {Boolean} isOriginalState 是否保持当前状态,如下拉框是否为展开,过滤信息是否清空等等
         * @param {Boolean} isFillValue 针对下拉列表型setValue时,是否通过value值从原数据中补全本次设置值
         */
        setValue: function(value, isOriginalState, isFillValue) {
            var me = this,
                    showTxt = "";
            if (!me.tree && !me.list) {
                return;
            }
            if (me.disabled) {
                return;
            }
            me._isDoLayout = true;
            value = me._objToArray(value);
            if (isOriginalState) {
                //组件设置值
                if (true == me.options.tree || "true" == me.options.tree) {
                    me.tree.setValue(value);
                } else {
                    me.list.setValue(value, isFillValue);
                }
                me._triggerHandler(null, eventChange, me.getValue());
                return;
            }
            //恢复下拉图标
            me._initFilterImageState();
            // 清除过滤信息,还原数据
            if (me._isFilterAfterReloadData) {
                if (true == me.options.tree || "true" == me.options.tree) {
                    // 此处的过滤只是为了清除选中的值，过滤后不需要清除文本框内容
                    me.tree.filter("");
                } else {
                    // list过滤结束后不设置默认值
                    me.list.filter("");
                }
                me._isFilterAfterReloadData = false;
            }
            // 支持像文本框一样的使用   
            if (me.options.write && value.write && me.list && !me.options.multi) {
                //下拉图标设置为delete
                if (me.downArrow) {
                    me.downArrow.removeClass(comboboxArrowClass)
                            .addClass(comboboxBigDataImageClose);
                }
                showTxt = value["text"] || "";
                me._setTitle(showTxt);
                me.list.setValue(value, isFillValue);
                me._triggerHandler(null, eventChange, value);
                me.check();
                return;
            }
            //组件设置值
            if (true == me.options.tree || "true" == me.options.tree) {
                me.tree.setValue(value);
                me._doTreeSetText();
            } else {
                me.list.setValue(value, isFillValue);
                me._doListSetText();
            }
            me._triggerHandler(null, eventChange, me.getValue());
            me.check();
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 组件值
         */
        _getValue: function() {
            var me = this,
                    value = null;
            if (!me.tree && !me.list) {
                return [];
            }
            if (true == me.options.tree || "true" == me.options.tree) {
                value = me.tree.getValue();
            } else {
                //如果为全选,则取全部的数据
                if (me.isAll()) {
                    value = me.list.getData();
                } else {
                    value = me.list.getValue();
                    if (value && value["data"] && (true == value["data"]["write"] || "true" == value["data"]["write"])) {
                        delete value["data"];
                        value.write = true;
                    }
                }
            }
            return value;
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用
         */
        _setDisabled: function(disabled) {
            var me = this,
                    comboCDiv = me.comboCDiv,
                    downArrow = me.downArrow,
                    arrowCls = "";
            comboCDiv.removeClass(comboboxParentClass)
                    .removeClass(comboboxParentGrayClass);
            if (disabled) {
                me.formElement.attr("disabled", true);
                comboCDiv.addClass(comboboxParentGrayClass);
                arrowCls = comboboxArrowGrayClass;
                // setValue()与setDisabled()连用，setValue()后为空时，
                if (!me.comboCDiv.hasClass(me.defaultPaddingDivClass)) {
                    return;
                }
                comboCDiv.removeClass(me.defaultPaddingDivClass).addClass(me.defaultPaddingDivDisabledClass);
            } else {
                me.formElement.removeAttr("disabled");
                comboCDiv.addClass(comboboxParentClass);
                arrowCls = comboboxArrowClass;
                if (!comboCDiv.hasClass(me.defaultPaddingDivDisabledClass)) {
                    return;
                }
                comboCDiv.removeClass(me.defaultPaddingDivDisabledClass).addClass(me.defaultPaddingDivClass);
            }
            downArrow.removeClass().addClass(arrowCls);
            me.__setDisabled(disabled);
        },
        /**
         * @private
         * @description 设置组件不可编辑
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
         * @description 组件配置属性校验，比如属性间互斥等(后续需要完善此规则)
         * @return {Boolean} 配置是否正确
         */
        _optionsValidate: function() {
            var me = this,
                    o = me.options,
                    isTree = false;
            isTree = (true == o.tree || "true" == o.tree) ? true : false;
            // 当为下拉树时不提供全选 emptyAll write
            if ((o.all || o.emptyAll || o.write) && isTree) {
                me._error("tree config is error!");
                return false;
            }

            // 多选下拉LIST不提供write
            if ((o.multi || o.sViewBar) && o.write && !isTree) {
                me._error("list config is error!");
                return false;
            }

            // 多选下拉LIST且有全选才可以配置emptyAll
            if (o.emptyAll && !(o.all && o.multi && !isTree)) {
                me._error("list config is error!");
                return false;
            }
            return true;
        },
        /**
         * @private
         * @description 销毁组件
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
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            var me = this;
            me._super();
            // 刷新布局时，关闭弹出层
            me._closeFloatPanel();
        },
        /**
         * @private
         * @description 创建输入框
         */
        _createInputField: function() {
            var me = this,
                    formDiv1El = me.formDiv1El,
                    comboCDiv = me.comboCDiv = $("<div>").attr("tabindex", -1).appendTo(formDiv1El),
                    formElement = me.formElement = $("<input>"),
                    downArrow = me.downArrow = $("<span>"),
                    dropDownEl = me.dropDownEl = $("<div>").addClass(comboboxWinClass),
                    comBodyEl = me.comBodyEl = $("<div>"),
                    queryDelay = 350;
            //配置信息的校验
            if (!me._optionsValidate()) {
                return;
            }
            //过滤延时处理
            queryDelay = parseInt(me.options.queryDelay);
            if (isNaN(queryDelay)) {
                queryDelay = 350;
            }
            if (queryDelay < 0) {
                queryDelay = 0;
            }
            //展开按钮
            downArrow.addClass(comboboxArrowClass)
                    .bind("click", {"me": me}, me._showFloatPanel)
                    .appendTo(comboCDiv);
            //显示框
            formElement.attr("type", me.type)
                    .addClass(comboboxInputClass)
                    .appendTo(comboCDiv);
            if (!me.options.editable) {
                formElement.attr("disabled", true);
            }
            //combobox最外层容器DIV
            comboCDiv.addClass(me.defaultPaddingDivClass).addClass(comboboxParentClass);

            //输入框绑定的事件处理
            formElement.bind("click", {"me": me}, function(event) {
                if ("block" === me.dropDownEl.css("display")) {
                    event.stopImmediatePropagation();
                    return;
                }
                me._showFloatPanel(event);
            }).bind("keyup", function(event) {
                //过滤时延迟350毫秒过滤
                Sweet.Task.Delay.start({
                    id: me.options.id + "-combobox-filter-delay",
                    run: function(args) {
                        me._doInputKeyUp(args);
                    },
                    args: event,
                    delay: queryDelay
                });
            }).bind("focusout", function() {
                if ("block" === me.dropDownEl.css("display") && me._isTabKeydown) {
                    me._closeFloatPanel();
                }
            });

            // 下拉弹出框
            me.dropDownElId = me.options.id + "-sweet-form-combobox-body-" + (increments++);
            dropDownEl.addClass(me.floatBgClass)
                    .attr({"tabindex": -1})
                    .hide()
                    .appendTo("body");
            comBodyEl.attr({"id": me.dropDownElId})
                    .addClass(comboboxWinBodyClass)
                    .appendTo(dropDownEl);
            //缩放处理
            if (me.options.resizAble) {
                me.__doCreateResizeEl();
            }
        },
        /**
         * @private
         * @description 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    listeners;
            me._super();
            listeners = me.options["listeners"];
            if (!$.isEmptyObject(listeners)) {
                for (var key in listeners) {
                    me.addListener(("" + key), listeners[key]);
                }
            }
            // 创建展开框
            me._createFloatPanel();
            // 注册事件
            me._registInitEvent();
        },
        /**
         * @private
         * @description 创建下拉列表
         */
        _createFloatPanel: function() {
            var me = this,
                    dropDownEl = me.dropDownEl;
            dropDownEl.css({"height": "auto"});
            me.options.data = me._objToArray(me.options.data);
            me._dataLength = me.options.data.length;
            if (!(true == me.options.tree || "true" == me.options.tree)) {
                // 创建list下拉列表
                me._creatListFloatPanel(me.options.data);
            } else {
                // 创建tree下拉列表
                me._creatTreeFloatPanel(me.options.data);
            }
            //由于list或tree组件中保存了一份数据,为了减少内存开支,这里清空data
            me.options.data = [];
            // 防止点击展开框时，导致展开框关闭
            dropDownEl.click(function(event) {
                event.stopImmediatePropagation();
            });
        },
        /**
         * @private 
         * @description 创建下拉列表（list）
         * @param {Array} data 数据
         */
        _creatListFloatPanel: function(data) {
            var me = this;
            //数据格式的统一
            //设置不符就使用默认值
            me.options.all = (true == me.options.all || "true" == me.options.all) ? true : false;
            me.options.multi = (true == me.options.multi || "true" == me.options.multi) ? true : false;
            me.options.sViewBar = (true == me.options.sViewBar || "true" == me.options.sViewBar) ? true : false;
            me.options.tip = (true == me.options.tip || "true" == me.options.tip) ? true : false;
            me.options.tools = me.options.tools ? me.options.tools : null;

            //数据格式的统一
            me.options.value = me._objToArray(me.options.value);
            if (me.options.value.length <= 0 && me._dataLength > 0) {
                //如果为单选,则取第一条数据
                if (!me.options.multi) {
                    if (me.options.isSelectFirst) {
                        me.options.value = data[0];
                    }
                } else {
                    //如果有ALL,且为空时全选,则设置value为data
                    if (me.options.all && me.options.emptyAll) {
                        me.options.value = data;
                    }
                }
            }
            // 创建list
            me.list = new Sweet.list.OptimizeList({
                height: me._getListFloatBodyHeight(),
                data: data,
                //主要是如果用户配置了minRemains时会有问题
                value: me.options.value,
                all: me.options.all,
                multi: me.options.multi,
                tools: me.options.tools,
                sViewBar: me.options.sViewBar,
                tip: me.options.tip,
                renderTo: me.dropDownElId,
                minRemains: me.options.minRemains,
                maxRemains: me.options.maxRemains
            });
            me._doListSetText();
            me._triggerHandler(null, eventChange, me.getValue());
        },
        /**
         * @private
         * @description 创建下拉列表（tree）
         * @param {Array} data 数据
         */
        _creatTreeFloatPanel: function(data) {
            var me = this;
            //设置不符就使用默认值
            me.options.multi = (true == me.options.multi || "true" == me.options.multi) ? true : false;
            me.options.useArrows = (false == me.options.useArrows || "false" == me.options.useArrows)
                    ? false : true;
            me.options.icon = (true == me.options.icon || "true" == me.options.icon) ? true : false;

            // 创建树形下拉列表
            me.tree = new Sweet.tree.Tree_v1({
                height: me._getTreeFloatBodyHeight(),
                widgetClass: comboboxTreeFloatPanelClass,
                multi: me.options.multi,
                search: false,
                tip: me.options.tip,
                icon: me.options.icon,
                useArrows: me.options.useArrows,
                renderTo: me.dropDownElId
            });
            me.tree.setData(data);
            me.options.value = me._objToArray(me.options.value);
            if (me.options.value.length > 0) {
                me.setValue(me.options.value);
            }
        },
        /**
         * @private
         * @description 注册事件
         */
        _registInitEvent: function() {
            var me = this;
            if (me.list) {
                me._registEventList();
            } else if (me.tree) {
                me._registEventTree();
            } else {
                return;
            }
        },
        /**
         * @private
         * @description 注册事件(list)
         */
        _registEventList: function() {
            var me = this,
                    options = me.options,
                    list = me.list,
                    nodeCfg,
                    isChecked;
            // 设置数据后调用的事件处理(不推荐使用)
            list.addListener(eventAfterSetData, function(event, data) {
                // 如果外部注册了afterSetData
                me._triggerHandler(null, eventAfterSetData, data);
            });
            // 设置值后调用的事件处理(不推荐使用)
            list.addListener(eventAfterSetValue, function(event, data) {
                // 如果外部注册了afterSetValue
                me._triggerHandler(null, eventAfterSetValue, data);
            });
            // 单选list,节占点击后关闭弹出框
            list.addListener(eventNodeClick, function(e, data) {
                if (!options.multi) {
                    me._triggerHandler($.objClone(data), eventClick);
                    me._closeFloatPanel();
                }
            });
            //checkchange处理
            list.addListener(eventCheckboxClick, function(e, data) {
                nodeCfg = $.objClone(data);
                isChecked = nodeCfg["checked"];
                delete nodeCfg["checked"];
                me._triggerHandler(nodeCfg, eventCheckChange, isChecked);
            });
            list.addListener(eventCheckboxAllClick, function(e, data) {
                nodeCfg = $.objClone(data);
                isChecked = nodeCfg["checked"];
                delete nodeCfg["checked"];
                delete nodeCfg["data"];
                me._triggerHandler(nodeCfg, eventCheckChange, isChecked);
            });
        },
        /**
         * @private
         * @description 注册事件(tree)
         */
        _registEventTree: function() {
            var me = this,
                    tree = me.tree,
                    nodeCfg;
            tree.addListener(eventCheckChange, function(data, treeCmp) {
                if ($.isEmptyObject(data)) {
                    me._triggerHandler(null, eventCheckChange, false);
                    return;
                }
                nodeCfg = $.objClone(data["node"]);
                me._triggerHandler(nodeCfg, eventCheckChange, data["checked"]);
            });
            tree.addListener(eventClick, function(data, treeCmp) {
                if (!me.options.multi) {
                    if (data.leaf) {
                        me._closeFloatPanel();
                    }
                    me._triggerHandler($.objClone(data), eventClick);
                }
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
         * @description 注册事件
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                // 添加beforeCheckboxClick事件的监听
                if (eventName === eventBeforeCheckboxClick) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.addListener(eventBeforeCheckChange, function(node, tree) {
                            if ("function" === typeof(func)) {
                                func(node, me);
                            }
                        });
                    } else {
                        me.list.addListener(eventBeforeCheckboxClick, function(e, node) {
                            if ("function" === typeof(func)) {
                                func(e, me);
                            }
                        });
                    }
                }
                if (eventName === eventBeforeCheckChange) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.addListener(eventBeforeCheckChange, function(node, tree) {
                            if ("function" === typeof(func)) {
                                func(node, me);
                            }
                        });
                    } else {
                        me.list.addListener(eventBeforeCheckChange, function(node, list) {
                            if ("function" === typeof(func)) {
                                func(node, me);
                            }
                        });
                    }
                }
                if (eventName === eventSearch) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.addListener(eventSearch, function(data, tree) {
                            if ("function" === typeof(func)) {
                                func(data, me);
                            }
                        });
                    } else {
                        me.list.addListener(eventSearch, function(data, list) {
                            if ("function" === typeof(func)) {
                                func(data, me);
                            }
                        });
                    }
                }
            });
        },
        /**
         * @private
         * @description 删除注册监听事件
         * @param {String} eventName 事件名称
         */
        _removeListener: function(eventName) {
            var me = this;
            if (!$.isNull(eventName)) {
                // 去除beforeCheckboxClick事件的监听
                if (eventName === eventBeforeCheckboxClick) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.removeListener(eventBeforeCheckChange);
                    } else {
                        me.list.removeListener(eventBeforeCheckboxClick);
                    }
                }
                if (eventName === eventBeforeCheckChange) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.removeListener(eventBeforeCheckChange);
                    } else {
                        me.list.removeListener(eventBeforeCheckChange);
                    }
                }
                if (eventName === eventSearch) {
                    if (true == me.options.tree || "true" == me.options.tree) {
                        me.tree.removeListener(eventSearch);
                    } else {
                        me.list.removeListener(eventSearch);
                    }
                }
            }
        },
        /**
         * @private
         * @description 刷新弹出层内的布局
         */
        _doLayoutFloat: function() {
            "use strict";
            var me = this,
                    listBodyWidth = 0,
                    listBodyHeight = 0,
                    tempTreeWidth = 15,
                    listBodyHeight = 0,
                    tempHeight = 10,
                    tempPadding = 6;
            // 定位展开框位置
            listBodyWidth = me.comboCDiv.outerWidth(true);
            if (!me._resizeInfo) {                
                me.dropDownEl.externalWidth(listBodyWidth);                
                
            // 设置树的大小
            if (me.tree) {
                listBodyHeight = me._getTreeFloatBodyHeight();
                me.tree.setWH((me.comboCDiv.width() + tempTreeWidth), listBodyHeight);
                me.comBodyEl.css({"max-height": listBodyHeight, "overflow": "hidden"});
            } else {
                listBodyHeight = me._getListFloatBodyHeight();
                if (listBodyHeight == "auto") {
                    me.comBodyEl.css({"max-height": "none", "overflow": "hidden", padding: "3px 0"});
                    me.list.setWH((me.comboCDiv.innerWidth() - tempPadding), listBodyHeight);
                } else {
                    me.comBodyEl.css({"max-height": listBodyHeight, "overflow": "hidden", padding: "0 0 3px 0"});
                    me.list.setWH((me.comboCDiv.innerWidth() - tempPadding), (listBodyHeight - tempHeight));
                }
                }
            }
            //强制刷新
            if (me._isDoLayout) {
                if (me.tree) {
                    me.tree.doLayout(true);
                } else {
                me.list.doLayout(true);
                }
                me._isDoLayout = false;
            }
            me.dropDownEl.unbind("resize");
            // 展开框在页面上定位
            me._orientDropDown();
        },
        /**
         * @private
         * @description 展开下拉框
         * @param {Object} event 事件对象
         */
        _showFloatPanel: function(event) {
            var me = event.data.me,
                    maxIndex,
                    tVal;
            if (me.downArrow.hasClass(comboboxArrowGrayClass)) {
                return;
            }
            if (me.options.isClearFilter) {
                me.formElement.removeAttr("placeholder");
                //清除过滤信息
                if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                    me._isFilterAfterReloadData = true;
                    me._isReSetShowTxt = true;
                    me.formElement.val("");
                    // 恢复默认箭头图片
                    me._initFilterImageState();
                } else {
                    tVal = me.formElement.val();
                    if (tVal && "" != tVal.trim()) {
                        me.downArrow.removeClass(comboboxArrowClass)
                                .addClass(comboboxBigDataImageClose);
                    }
                    maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                    me.dropDownEl.css("z-index", maxIndex);
                    //展开框没有打开
                    if (!$.isVisiable(me.dropDownEl)) {
                        me._triggerHandler(me, eventExpand);
                        //记录下拉时的显示信息
                        me._saveShowFloatPanelValue();
                        me.dropDownEl.show();
                    }
                    // 刷新弹出层的布局
                    me._doLayoutFloat();
                }
                me._isShowFloatPanel = true;
                me._initResizeInfo();
                return;
            }
            if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                me._isFilterAfterReloadData = false;
                //标志位: 点了清除, 收起时重新设置title
                me._isReSetShowTxt = true;
                // 恢复默认箭头图片
                me._initFilterImageState();
                me._setTitle("");
                if (true == me.options.tree || "true" == me.options.tree) {
                    me.tree.filter("");
                } else {
                    me.list.filter("");
                }
                if ("none" === me.dropDownEl.css("display")) {
                    me._triggerHandler(me, eventExpand);
                    //记录下拉时的显示信息
                    me._saveShowFloatPanelValue();
                    me.dropDownEl.show();
                }
                event.stopImmediatePropagation();
            } else {
                maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                me.dropDownEl.css("z-index", maxIndex);
                // 标志位: 是否要打开展开框标志
                me._isShowFloatPanel = false;
                //展开框没有打开
                if (!$.isVisiable(me.dropDownEl)) {
                    me._triggerHandler(me, eventExpand);
                    //记录下拉时的显示信息
                    me._saveShowFloatPanelValue();
                    me.dropDownEl.show();
                    me._isShowFloatPanel = true;
                }
                // 刷新弹出层的布局
                me._doLayoutFloat();
            }
            me._initResizeInfo();
        },
        /**
         * @private
         * @description 关闭展开框
         */
        _closeFloatPanel: function() {
            var me = this,
                    isChange = false,
                    newValue,
                    changeValue = null,
                    writeTxt = "",
                    tempKey = "value";
            if (!me._isShowFloatPanel && "block" === me.dropDownEl.css("display")) {
                me.dropDownEl.hide();
                if (me.options.isClearFilter) {
                    if (me.options.emptyText) {
                        me.formElement.attr("placeholder", me.options.emptyText);
                    }
                }
                changeValue = me.getValue();
                //是否发生change
                if (me.list) {
                    //如果支持可输入
                    if (me.options.write && !me.options.multi && !me.options.sViewBar) {
                        if (me._isFilterAfterReloadData) {
                            writeTxt = me.formElement.val();
                            if ("" == writeTxt) {
                                changeValue = {};
                                me.list.setValue(null);
                            } else {
                                //说明不存在
                                if (writeTxt != changeValue["text"]) {
                                    changeValue = {value: writeTxt, text: writeTxt, data: {write: true}};
                                    me.list.setValue(changeValue);
                                }
                            }
                        }
                        newValue = {data: me._objToArray(changeValue), isAll: false};
                    } else {
                        newValue = {data: me._objToArray(changeValue), isAll: me.isAll()};
                    }
                    tempKey = "value";
                } else {
                    newValue = {data: me._getArrayOfLeafNodesInfo(me._objToArray(changeValue)), isAll: false};
                    tempKey = "treeId";
                }
                isChange = me._closeFloatPanelIsChange(me._beforeShowValue, newValue, tempKey, me.formElement.val());

                //恢复默认箭头图片
                me._initFilterImageState();

                //收起时如果有过滤则清除过滤信息,还原数据
                if (me._isFilterAfterReloadData) {
                    if (me.list) {
                        //list的处理 
                        me.list.filter("");
                        me._doListSetText();
                    } else {
                        //tree的处理 
                        me.tree.filter("");
                        me._doTreeSetText();
                    }
                    me._isFilterAfterReloadData = false;
                    me._isDoLayout = true;
                } else {
                    //如果点了清除过滤信息或者较展开前发生change,则重置显示信息
                    if (me.list) {
                        //list处理
                        if (me._isReSetShowTxt) {
                            me._isReSetShowTxt = false;
                            me._doListSetText();
                        } else {
                            if (isChange) {
                                me._doListSetText();
                            }
                        }
                    } else {
                        //树的处理
                        if (me._isReSetShowTxt) {
                            me._isReSetShowTxt = false;
                            me._doTreeSetText();
                        } else {
                            if (isChange) {
                                me._doTreeSetText();
                            }
                        }
                    }
                }

                //触发change事件
                if (isChange) {
                    me._triggerHandler(null, eventChange, changeValue);
                }
                //触发关闭窗口后事件
                me._triggerHandler(null, eventCollapse, {value: changeValue, changed: isChange});
                if (me.rendered) {
                    me.formElement.blur();
                }
            }
            me._isShowFloatPanel = false;
            me._isTabKeydown = false;
            if (me._resizeInfo && me._resizeInfo._$moveEl) {
                me._resizeInfo._$moveEl.remove();
                me._resizeInfo._$moveEl = null;
                me._resizeInfo.isMouseDown = false;
            }
        },
        /**
         * @private
         * @description list下拉框收起时是否触发change
         * @param {Object} oldValue show时前的值
         * @param {Object} newValue hidden时的值
         * @param {String} vKey 用那个KEY的值去比较
         * @param {String} txt 当前输入框显示的文本
         */
        _closeFloatPanelIsChange: function(oldValue, newValue, vKey, txt) {
            var oldKeys = {},
                    newKeys = {};
            oldValue = oldValue || {data: [], isAll: false};
            newValue = newValue || {data: [], isAll: false};
            //先根据length来判断
            if (oldValue.data.length <= 0 && newValue.data.length <= 0) {
                return false;
            }
            if (oldValue.data.length != newValue.data.length) {
                return true;
            }
            //如果都是全选
            if (true === oldValue["isAll"] && true === newValue["isAll"]) {
                if ("" != txt) {
                    return false;
                } else {
                    return true;
                }
            }
            //判断前后是否有变化
            for (var k = 0; k < oldValue.data.length; k++) {
                oldKeys[oldValue.data[k][vKey]] = "";
            }
            for (var k = 0; k < newValue.data.length; k++) {
                newKeys[newValue.data[k][vKey]] = "";
            }
            for (var key in newKeys) {
                if ("" != oldKeys[key]) {
                    oldKeys = null;
                    newKeys = null;
                    return true;
                }
            }
            oldKeys = null;
            newKeys = null;
            return false;
        },
        /**
         * @private
         * @description 输入框keyup事件处理
         * @param {Object} event 事件对象
         */
        _doInputKeyUp: function(event) {
            var me = this,
                    keyCode,
                    maxIndex;
            if (me.disabled) {
                return;
            }
            // 文本框不可编辑时，不过滤
            if (false === me.editable) {
                return;
            }
            keyCode = event.charCode || event.keyCode;
            if (Sweet.constants.keyCode.TAB === keyCode) {
                if ("none" === me.dropDownEl.css("display")) {
                    //标志位: 用于TAB按键来控制下拉框的展开与收起
                    me._isTabKeydown = true;
                    // 刷新弹出层的布局
                    maxIndex = $.getMaxZIndex(me.dropDownEl.css("z-index"));
                    me.dropDownEl.css({"z-index": maxIndex});
                    me._triggerHandler(me, eventExpand);
                    //记录下拉时的显示信息
                    me._saveShowFloatPanelValue();
                    me.dropDownEl.show();
                    me._isShowFloatPanel = false;
                    me.formElement.select();
                    me._doLayoutFloat();
                    me._initResizeInfo();
                    return;
                }
            }
            me._doFilter(me.formElement.val());
        },
        /**
         * @private
         * @description 过滤处理
         * @param {String} filterStr 过滤的字符串
         */
        _doFilter: function(filterStr) {
            var me = this,
                    flag,
                    tFilter;
            //标志位: 当过滤时置为true,下拉框收起时置为false;此标志位用于过滤后下拉框收起时还原数据用
            me._isFilterAfterReloadData = true;
            // 手动输入时，换成小叉图片
            if (!filterStr || "" == filterStr) {
                if (me.downArrow.hasClass(comboboxBigDataImageClose)) {
                    me.downArrow.removeClass(comboboxBigDataImageClose)
                            .addClass(comboboxArrowClass);
                }
            } else {
                if (me.downArrow.hasClass(comboboxArrowClass)) {
                    me.downArrow.removeClass(comboboxArrowClass)
                            .addClass(comboboxBigDataImageClose);
                }
            }
            tFilter = {filter: filterStr};
            flag = me._triggerHandler(tFilter, eventBeforeSearch, me);
            if (false === flag || "false" === flag) {
                return;
            }
            filterStr = tFilter["filter"];
            //list的过滤
            if (!(true == me.options.tree || "true" == me.options.tree)) {
                me.list.filter(filterStr);
                if ("none" === me.dropDownEl.css("display")) {
                    me.downArrow.click();
                }
            } else {
                me.tree.filter(filterStr);
                if ("none" === me.dropDownEl.css("display")) {
                    me.downArrow.click();
                }
                return;
            }
            if ("none" === me.dropDownEl.css("display")) {
                me._triggerHandler(me, eventExpand);
                //记录下拉时的显示信息
                me._saveShowFloatPanelValue();
                me.dropDownEl.show();
            }
            // 展开框在页面上定位
            me._orientDropDown();
            me._initResizeInfo();
        },
        /**
         * @private
         * @description 存储展开前的值,用于收起时是否要change
         */
        _saveShowFloatPanelValue: function() {
            var me = this;
            //存储展开前的值,用于收起时是否要change
            if (me.list) {
                if (me.list.totalAEl) {
                    me.list.totalAEl.click();
                    me._isDoLayout = true;
                }
                me._beforeShowValue = {data: me._objToArray(me.getValue()), isAll: me.isAll()};
            } else {
                me._beforeShowValue = {data: me._getArrayOfLeafNodesInfo(me._objToArray(me.getValue())), isAll: false};
            }
        },
        /**
         * @private
         * @description 下拉list设置显示框中的值
         */
        _doListSetText: function() {
            var me = this,
                    options = me.options,
                    valueObj,
                    showTxt = "";
            valueObj = me.list.getValue();
            showTxt = me._arrayToObj(valueObj)["text"];
            // 没有选择数据，而且配置emptyAll，文本框应该显示all
            if ((!showTxt || "" == showTxt.trim()) && options.emptyAll && options.multi
                    && me._dataLength > 0) {
                showTxt = ALL_TEXT;
            } else {
                if (me.list.isAll() && me.options.all) {
                    showTxt = ALL_TEXT;
                }
            }
            me._setTitle(showTxt);
            if (me.rendered) {
                me.formElement.blur();
            }
        },
        /**
         * @private
         * @description 下拉树设置显示框中的值
         */
        _doTreeSetText: function() {
            var me = this,
                    txt;
            txt = me._getShowText();
            me._setTitle(txt);
            if (me.rendered) {
                me.formElement.blur();
            }
        },
        /**
         * @private
         * @description 获取tree或list的value数据的text（只获取叶子节点）
         * @param {Object} valueObj 数组对象
         * @return {String} 对象中的所有text
         */
        _getShowText: function(valueObj) {
            var me = this,
                    valueArr,
                    leafVal;
            valueObj = valueObj || me.getValue();
            valueArr = me._objToArray(valueObj);
            leafVal = me._getArrayOfLeafNodesInfo(valueArr);
            return me._arrayToObj(leafVal).text;
        },
        /**
         * @private
         * @description 将tree返回的数据转换为对象数组（只获取叶子节点）
         * @param {Object} treeValue 对象数组 
         * @param {Object} obj 对象 
         * @param {String} treeId 节点唯一ID 
         * @return {Object} [{"text":"1", "value":"1"},{"text":"2", "value":"2"}]
         */
        _getArrayOfLeafNodesInfo: function(treeValue, obj, treeId) {
            var me = this;
            obj = obj || [];
            if (!treeValue) {
                return obj;
            }
            //Begin----------add for DTS2014091901114
            for (var i = 0; i < treeValue.length; i++) {
                if (!treeId) {
                    treeId = "";
                }
                treeId += treeValue[i]["value"];
                treeValue[i]["treeId"] = treeId;
                if (treeValue[i].children) {
                    me._getArrayOfLeafNodesInfo(treeValue[i].children, obj, treeId);
                } else {
                    obj.push(treeValue[i]);
                }
            }
            //End----------add for DTS2014091901114
            return obj;
        },
        /**
         * @private
         * @description 将对象数组转换为一个对象
         * @param {Array} data value数组 
         * @return {Object} {"text":"1,2", "value":"ONE,TWO"}
         */
        _arrayToObj: function(data) {
            var me = this,
                    text = "",
                    value = "",
                    tempText = "",
                    tempArrayData,
                    obj = {value: "", text: ""};
            if (!data) {
                return obj;
            }
            tempArrayData = me._objToArray(data);
            for (var i = 0; i < tempArrayData.length; i++) {
                if (i > 0) {
                    value += ",";
                    text += ",";
                }
                tempText = $.isUndefined(tempArrayData[i].text) ? tempArrayData[i].value : tempArrayData[i].text;
                value += tempArrayData[i].value;
                text += tempText;
            }
            obj = {value: value, text: text};
            return obj;
        },
        /**
         * @private
         * @description 将数据转成数组
         * @param {Object} data 待转化的数据
         * @return {Object} 转化后的数组[{"text":"1", "value":"1"}, ...]
         */
        _objToArray: function(data) {
            var value = [];
            if (!data) {
                return value;
            }
            // 对象转换为数组
            if ($.isArray(data)) {
                value = data;
            } else {
                if (!$.isUndefined(data.value)) {
                    value.push(data);
                }
            }
            return value;
        },
        /**
         * @private
         * @description 根据配置信息获得下拉框高度
         */
        _getListFloatBodyHeight: function() {
            var me = this,
                    limitCount = itemLimitNumber,
                    listBodyHeight = 10,
                    tempAllHeight = 38,
                    tempNoDatasHeight = 10,
                    viewBarHeight = 28,
                    dataLength = me._dataLength;
            if (dataLength > 0 && dataLength <= limitCount) {
                return "auto";
            }
            //如果有ALL,则加上ALL的高度
            if (me.options.all && me.options.multi) {
                listBodyHeight = tempAllHeight;
            }
            //如果没有配置ALL且无数据,则给一个10的高度
            if (!(true == me.options.all || "true" == me.options.all) && dataLength <= 0) {
                listBodyHeight = tempNoDatasHeight;
            }
            if (dataLength > limitCount) {
                listBodyHeight = limitCount * LIHEIGHT + listBodyHeight;
            }
            if (true == me.options.sViewBar || "true" == me.options.sViewBar) {
                listBodyHeight += viewBarHeight;
            }
            return listBodyHeight;
        },
        /**
         * @private
         * @description 根据配置信息获得下拉框高度(tree)
         */
        _getTreeFloatBodyHeight: function() {
            var me = this,
                    limitCount = itemLimitNumber,
                    listBodyHeight = 10,
                    tempNoDatasHeight = 5,
                    tempTreeHeight = 3,
                    dataLength = me._dataLength;
            //如果无数据,则给一个5的高度
            if (dataLength <= 0) {
                listBodyHeight = tempNoDatasHeight;
            } else {
                listBodyHeight = limitCount * LIHEIGHT + tempTreeHeight;
            }
            return listBodyHeight;
        },
        /**
         * @private
         * @description 改变提示内容
         * @param {String} txt 提示内容
         */
        _setTitle: function(txt) {
            var me = this,
                    isTip = me.options.tip;
            txt = txt || "";
            if (me.formElement) {
                if ("" == txt && me.options.emptyAll && me.options.multi && me._dataLength > 0) {
                    txt = ALL_TEXT;
                }
                me.formElement.val(txt);
                if (isTip) {
                    me.formElement.attr("title", txt);
                }
                me.options.tooltip = txt;
            } else {
                me.options.tooltip = "";
            }
        },
        /**
         * @private
         * @description 恢复默认箭头图片
         */
        _initFilterImageState: function() {
            var me = this;
            if (me.downArrow && me.downArrow.hasClass(comboboxBigDataImageClose)) {
                me.downArrow.removeClass(comboboxBigDataImageClose)
                        .addClass(comboboxArrowClass);
            }
        },
        /**
         * @private 
         * @description 缩放处理:生成相关dom
         */
        __doCreateResizeEl: function() {
            var me = this,
                    dropDownEl = me.dropDownEl,
                    resizeXYEl,
                    resizeElXl,
                    resizeElXr,
                    resizeElYt,
                    resizeElYb;
            if (true == me.options.resizAble || "true" == me.options.resizAble || "xy" == me.options.resizAble) {
                resizeXYEl = $("<div>").addClass(comboboxWinBodyResizeXYElClass)
                        .appendTo(dropDownEl);
                resizeElYt = $("<div>").addClass(comboboxWinBodyResizeYtElClass)
                        .appendTo(dropDownEl);
                resizeElXr = $("<div>").addClass(comboboxWinBodyResizeXrElClass).css({height: "calc(100% - 10px)"})
                        .appendTo(dropDownEl);
                resizeElYb = $("<div>").addClass(comboboxWinBodyResizeYbElClass).css({width: "calc(100% - 10px)"})
                        .appendTo(dropDownEl);
                resizeElXl = $("<div>").addClass(comboboxWinBodyResizeXlElClass)
                        .appendTo(dropDownEl);
                me.__registResizeEvent(resizeXYEl, "xy");
                me.__registResizeEvent(resizeElYt, "yt");
                me.__registResizeEvent(resizeElXr, "xr");
                me.__registResizeEvent(resizeElYb, "yb");
                me.__registResizeEvent(resizeElXl, "xl");
            } else if ("x" == me.options.resizAble) {
                resizeElXr = $("<div>").addClass(comboboxWinBodyResizeXrElClass)
                        .appendTo(dropDownEl);
                resizeElXl = $("<div>").addClass(comboboxWinBodyResizeXlElClass)
                        .appendTo(dropDownEl);
                me.__registResizeEvent(resizeElXr, "xr");
                me.__registResizeEvent(resizeElXl, "xl");
            } else if ("y" == me.options.resizAble) {
                resizeElYt = $("<div>").addClass(comboboxWinBodyResizeYtElClass)
                        .appendTo(dropDownEl);
                resizeElYb = $("<div>").addClass(comboboxWinBodyResizeYbElClass)
                        .appendTo(dropDownEl);
                me.__registResizeEvent(resizeElYt, "yt");
                me.__registResizeEvent(resizeElYb, "yb");
            } else {
                //如果不是以上配置则不做处理
                return;
            }
        },
        /**
         * @private
         * @description 缩放处理:注册鼠标事件
         * @param {Object} rEl el对象
         * @param {String} type 类型: x, y, xy
         */
        __registResizeEvent: function(rEl, type) {
            var me = this;
            if (!rEl) {
                return;
            }
            rEl.bind("mousedown", {"me": me, "rEl": rEl, "type": type}, me._doResizeElMousedown);
            rEl.bind("mousemove", {"me": me, "rEl": rEl, "type": type}, me._doResizeElMousemove);
            rEl.bind("mouseup", {"me": me, "rEl": rEl, "type": type}, me._doResizeElMouseup);
            rEl.bind("mouseover", {"me": me, "rEl": rEl, "type": type}, me._doResizeElMouseover);
        },
        /**
         * @private
         * @description 缩放处理:鼠标点下去事件
         * @param {Object} e 事件对象
         */
        _doResizeElMousedown: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    obj = self.get(0),
                    type = e.data.type,
                    winOffer,
                    wWin,
                    hWin,
                    bW = 0,
                    _css;
            if (!me._resizeInfo) {
                var listBodyWidth = me.comboCDiv.outerWidth();
                if ($.isVisiable(me.dropDownEl)) {
                    listBodyWidth = me.dropDownEl.externalWidth();                
                }                
                me._resizeInfo = {
                    initWidth: listBodyWidth,
                    width: listBodyWidth,
                    initHeight: me.dropDownEl.outerHeight(),
                    height: me.dropDownEl.externalHeight()
                };
            }
            me._resizeInfo.isMouseDown = true;
            //记录点下时的X坐标值
            me._resizeInfo.leftWidth = e.pageX;
            me._resizeInfo.topHeight = e.pageY;
            if (obj.setCapture) {
                obj.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.MOUSEDOWN);
            }
            //防止在滑动时,选择中其它内容
            me.dropDownEl.find("*").css({
                "-moz-user-select": "none",
                "-webkit-user-select": "none",
                "-ms-user-select": "none",
                "-khtml-user-select": "none",
                "user-select": "none"
            });
            if (me._resizeInfo && me._resizeInfo._$moveEl) {
                me._resizeInfo._$moveEl.remove();
                me._resizeInfo._$moveEl = null;
            }
            winOffer = me.dropDownEl.offset();
            wWin = me.dropDownEl.width() + bW;
            hWin = me.dropDownEl.height() + bW;
            //虚线框
            if ("xl" == type) {
                _css = {
                    "width": wWin,
                    "height": hWin,
                    "right": me.dropDownEl.css("right"),
                    "top": winOffer.top,
                    "z-index": me.dropDownEl.css("z-index")
                };
            } else if ("yt" == type) {
                _css = {
                    "width": wWin,
                    "height": hWin,
                    "left": winOffer.left,
                    "bottom": me.dropDownEl.css("bottom"),
                    "z-index": me.dropDownEl.css("z-index")
                };
            } else {
                _css = {
                    "width": wWin,
                    "height": hWin,
                    "left": winOffer.left,
                    "top": winOffer.top,
                    "z-index": me.dropDownEl.css("z-index")
                };
            }
            me._resizeInfo._$moveEl = $("<div>").addClass(comboboxWinBodyResizeElClass).css(_css).appendTo("body");
            return false;
        },
        /**
         * @private
         * @description 缩放处理:鼠标滑动事件
         * @param {Object} e 事件对象
         */
        _doResizeElMousemove: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    type = e.data.type,
                    _twh2 = 2,
                    _twh5 = 5,
                    initLeft = 0,
                    initTop,
                    tempOffset,
                    tempWidth,
                    tempHeight,
                    pgX,
                    pgY,
                    tw,
                    th,
                    mH,
                    cTop,
                    cBottom,
                    dH,
                    dW,
                    flag;
            if (me._resizeInfo && me._resizeInfo.isMouseDown) {
                tempOffset = me.dropDownEl.offset();
                //用于外部适配宽高限制
                flag = me._triggerHandler({offset: tempOffset, resizeInfo: me._resizeInfo, resizeType: type, event: e}, eventResizeElMove, me);
                if (false == flag || "false" == flag) {
                    return;
                }
                dH = $(document).innerHeight();
                dW = $(document).innerWidth();
                initLeft = tempOffset.left;
                initTop = tempOffset.top;
                cTop = me.comboCDiv.offset().top;
                cBottom = dH - me.comboCDiv.outerHeight() - cTop;
                mH = cTop;
                if (mH < cBottom) {
                    mH = cBottom;
                }
                mH -= _twh5;
                pgX = e.pageX;
                pgY = e.pageY;
                tw = dW - _twh5;
                th = dH - _twh5;
                if (pgX > tw) {
                    pgX = tw;
                }
                if (pgY > th) {
                    pgY = th;
                }
                if (pgY <= _twh5) {
                    pgY = _twh5;
                }
                if (pgX <= _twh5) {
                    pgX = _twh5;
                }
                //刷新宽度
                if ("xy" == type || "xr" == type || "xl" == type) {
                    //计算宽度
                    if ("xl" == type) {
                        tempWidth = me._resizeInfo.width + initLeft - pgX;
                    } else {
                        tempWidth = pgX - initLeft;
                    }
                    //如果小于最小宽度值,则设置成最小宽度值
                    if (tempWidth < me._resizeInfo.initWidth) {
                        me._resizeInfo._$moveEl.width(me._resizeInfo.initWidth - _twh2);
                    } else {
                        me._resizeInfo._$moveEl.width(tempWidth);
                    }
                }
                //刷新高度
                if ("xy" == type || "yt" == type || "yb" == type) {
                    //计算宽度
                    if ("yt" == type) {
                        tempHeight = me._resizeInfo.height + initTop - pgY;
                    } else {
                        tempHeight = pgY - initTop;
                    }
                    if (mH > 0 && tempHeight > mH) {
                        tempHeight = mH;
                    }
                    //如果小于最小高度值,则设置成最小高度值
                    if (tempHeight < me._resizeInfo.initHeight) {
                        me._resizeInfo._$moveEl.height(me._resizeInfo.initHeight - _twh2);
                    } else {
                        me._resizeInfo._$moveEl.height(tempHeight);
                    }
                }
            }
            return false;
        },
        /**
         * @private
         * @description 缩放处理:鼠标移上去事件
         * @param {Object} e 事件对象
         */
        _doResizeElMouseup: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    type = e.data.type,
                    obj = self.get(0),
                    _tpd8 = 8,
                    _tpd5 = 5,
                    _tpd2 = 2,
                    _tWidth = -1,
                    _tHeight = -1,
                    listBodyHeight,
                    _h,
                    _tpw = 0,
                    _th = 0,
                    _cW,
                    _cH;
            me._resizeInfo.isMouseDown = false;
            if (obj.releaseCapture) {
                obj.releaseCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            if (me._resizeInfo && me._resizeInfo._$moveEl) {
                _tWidth = me._resizeInfo._$moveEl.outerWidth();
                _tHeight = me._resizeInfo._$moveEl.outerHeight();
                me._resizeInfo._$moveEl.remove();
                me._resizeInfo._$moveEl = null;
            }
            //还原防止在滑动时,选择中其它内容
            me.dropDownEl.find("*").css({
                "-moz-user-select": "",
                "-webkit-user-select": "",
                "-ms-user-select": "",
                "-khtml-user-select": "",
                "user-select": ""
            });
            if (_tWidth < 0 || _tHeight < 0) {
                return;
            }
            if (_tWidth < me._resizeInfo.initWidth) {
                _tWidth = me._resizeInfo.initWidth;
            }
            if (_tHeight < me._resizeInfo.initHeight) {
                _tHeight = me._resizeInfo.initHeight;
                _h = "auto";
            }
            _cW = me._resizeInfo.width - _tWidth;
            _cH = me._resizeInfo.height - _tHeight;
            if (_cW >= -1 && _cW <= 1 && _cH >= -1 && _cH <= 1) {
                return;
            }
            me._resizeInfo.width = _tWidth;
            me._resizeInfo.height = _tHeight;
            if ("xl" == type) {
                me.dropDownEl.css({left: "0px"});
            } else if ("yt" == type) {
                me.dropDownEl.css({top: "0px"});
            }
            me.dropDownEl.externalWidth(me._resizeInfo.width);
            if (me.tree) {
                me.tree.resizeLayout(me._resizeInfo.width - _tpd8, me._resizeInfo.height - _tpd2);
                me.comBodyEl.css({"max-height": me._resizeInfo.height - _tpd2, "width": me._resizeInfo.width - _tpd8, "overflow": "hidden"});
            } else {
                listBodyHeight = me._getListFloatBodyHeight();
                if (listBodyHeight == "auto") {
                    _tpw = 3;
                    me.comBodyEl.css({padding: "3px 0"});
                } else {
                    _tpw = 0;
                    me.comBodyEl.css({padding: "0 0 3px 0"});
                }
                if (_h == "auto" && listBodyHeight == "auto") {
                    me.comBodyEl.css({"max-height": "none", "width": me._resizeInfo.width - _tpd8, "overflow": "hidden"});
                    me.list.setWH(me._resizeInfo.width - _tpd8, _h);
                } else {
                    me.comBodyEl.css({"max-height": me._resizeInfo.height - _tpd2, "width": me._resizeInfo.width - _tpd8, "overflow": "hidden"});
                    if (me.options.all) {
                        _th = 2;
                        _h = me._resizeInfo.height - _tpd5;
                    } else {
                        _th = -1;
                        _h = me._resizeInfo.height - _tpd8;
                    }
                    if (me.options.sViewBar) {
                        _h -= _th;
                    }
                    _h -= _tpw;
                    me.list.resizeLayout(me._resizeInfo.width - _tpd8, _h);
                }
            }
            me.dropDownEl.unbind("resize");
            // 展开框在页面上定位
            me._orientDropDown();
            me._triggerHandler(me.renderEl, eventResizeLayout, me);
            return false;
        },
        /**
         * @private
         * @description 缩放处理:鼠标移上去事件
         * @param {Object} e 事件对象
         */
        _doResizeElMouseover: function(e) {
            var me = e.data.me,
                    self = $(e.target);
        },
        /**
         * @private 
         * @description定位展开框位置
         */
        _orientDropDown: function() {
            var me = this,
                    _left,
                    _top,
                    pos;
            if (true == me.options.resizAble || "true" == me.options.resizAble || "xy" == me.options.resizAble
                    || "x" == me.options.resizAble || "y" == me.options.resizAble) {
                var tw1,
                        maxShown = $(document).innerHeight(),
                        maxVShown = $(document).innerWidth(),
                        targetElOffset = me.comboCDiv.offset(),
                        targetElHeight = me.comboCDiv.outerHeight(true),
                        floatElWidth = me.dropDownEl.outerWidth(true),
                        floatElHeight = me.dropDownEl.outerHeight(true);
                _top = targetElOffset.top + targetElHeight;
                _left = targetElOffset.left;
                tw1 = maxVShown - (floatElWidth + targetElOffset.left);
                if (tw1 <= 0) {
                    _left = _left + tw1;
                }
                // 下面显示不下浮动框，且上面可以显示下浮动框，才选择在上面显示
                if (maxShown - targetElOffset.top - targetElHeight <= floatElHeight) {
                    if (targetElOffset.top >= floatElHeight) {
                        _top = targetElOffset.top - floatElHeight;
                    }
                }
                me.dropDownEl.css({"left": _left, "top": _top});
            } else {
            // 展开框在页面上定位
                pos = $.getFloatOffset(me.comboCDiv, me.dropDownEl);
            me.dropDownEl.css({"left": pos.left, "top": pos.top});
            }
        },
        /**
         * @private 
         * @description 下拉框展开时刷新缩放信息
         */
        _initResizeInfo: function() {
            var me = this,
                    listBodyWidth;
            if (true == me.options.resizAble || "true" == me.options.resizAble || "xy" == me.options.resizAble
                    || "x" == me.options.resizAble || "y" == me.options.resizAble) {
                listBodyWidth = me.comboCDiv.outerWidth(true);
                if (!me._resizeInfo) {
                    me._resizeInfo = {
                        initWidth: listBodyWidth,
                        width: listBodyWidth,
                        initHeight: me.dropDownEl.outerHeight(),
                        height: me.dropDownEl.externalHeight()
                    };
                } else {
                    me._resizeInfo.initWidth = listBodyWidth;
                    me._resizeInfo.leftWidth = 0;
                    me._resizeInfo.topHeight = 0;
                    me._resizeInfo.isMouseDown = false;
                    if (me._resizeInfo && me._resizeInfo._$moveEl) {
                        me._resizeInfo._$moveEl.remove();
                        me._resizeInfo._$moveEl = null;
                    }
                }
            }
        }
    });

    /**
     * 创建下拉框
     * @name Sweet.form.ComboBox_v1
     * @class 
     * @extends Sweet.form.Input
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * jquery.sweet.widget.optimizeTree.js
     * jquery.sweet.widget.list.optimizeList.js
     * </pre>
     * @example 
     * <pre>
     *  var data = [{"value":"1", "text":"test-1"},
     *                {"value":"2", "text":"test-2"},
     *                {"value":"3", "text":"test-3"},
     *                {"value":"4", "text":"test-4"}];
     *  sweetCombobox = new Sweet.form.ComboBox_v1({
     *      label : true,
     *      width : 300,
     *      data : data,
     *      labelText : 'combobox',
     *      value : [{"value":"2", "text":"test-2"}],
     *      multi : true,
     *      renderTo : "sweet-combobox"
     * });
     * </pre>
     */
    Sweet.form.ComboBox_v1 = $.sweet.widgetFormCombobox_v1;
}(jQuery));

/**
 * @fileOverview  
 * <pre>
 * listBox组件
 * 2013/04/03
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    var listBoxDiv2Cls = "sweet-listbox-div2",
            listBoxLiCls = "sweet-listbox-li",
            listBoxClearPicCls = "sweet-listbox-clearPic",
            defaultEmptyDivClass = "sweet-listbox-emptyDiv",
            increments = 0;

    $.widget("sweet.widgetListBox", $.sweet.widget, /** @lends Sweet.ListBox.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widgetListBox]",
        defaultElement: "<input>",
        widgetClass: "sweet.widgetListBox", // 表明是listBox类组件
        // listBox组件公共配置参数
        options: /** @lends Sweet.ListBox.prototype*/{
            /**
             * @description 组件宽度
             * @type {String/Number}
             * @default 25px
             */
            width: 650,
            /**
             * @description 组件高度
             * @type {String/Number}
             * @default 25px
             */
            height: 100,
            /**
             * @description 是否支持去不删除
             * @type {Boolean}
             * @default true
             */
            clearAll: true,
            /**
             * @description 为空显示的文字
             * @type {String}
             * @default ""
             */
            emptyText: "",
            /**
             * @description 子组件
             * @type {Array}
             * @default ""
             */
            items: [],
            /**
             * @description 是否有label
             * @type Boolean
             * @default false
             */
            label: false,
            /**
             * @description label文字
             * @type {String}
             * @default null
             */
            labelText: null,
            /**
             * @description label宽度
             * @type {String/Number}
             * @default 0.3
             */
            labelWidth: 0.3,
            /**
             * @description 是否显示tip提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * box内的组件是否可以拖动
             * @type boolean
             * @default true
             */
            draggable: true,
            /**
             * @description 关闭的回调函数，使用时自己定义
             * @type Function
             * @default false
             */
            closeItem: function() {
                return false;
            }
        },
        /**
         * @description 添加指标或维度
         * @param {Object} value 数据
         */
        addItems: function(value) {
            var me = this;
            if ("object" !== typeof value) {
                return;
            }
            if (!value.length) {
                me._addOneItem(value);
            } else {
                for (var i = 0; i < value.length; i++) {
                    me._addOneItem(value[i]);
                }
            }
            me._setEmptyText();
        },
        /**
         * @description 删除所有的lableItem
         * @param {String} itemID labelItemID
         */
        removeItems: function(itemID) {
            var me = this;
            if (itemID) {
                if (me.btnObj[itemID]) {
                    me.btnObj[itemID].renderEl.remove();
                    delete me.btnObj[itemID];
                }
            } else {
                for (var id in me.btnObj) {
                    me.btnObj[id].renderEl.remove();
                    delete me.btnObj[id];
                }
                me.btnObj = {};
            }
            if ($.isEmptyObject(me.btnObj)) {
                me._setEmptyText();
            }
        },
        /**
         * @description 返回widget对象
         */
        widget: function() {
            return this.boxElement;
        },
        /**
         * @description 获取ofrm组件对象，返回jquery对象
         */
        getContainerObj: function() {
            return this.boxElement;
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;

            if ($.type(width) === "string") {
                this.listBoxEl.onResize(function() {
                    me.doLayout();
                });
            }

            me.listBoxEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;

            if ($.type(height) === "string") {
                this.listBoxEl.onResize(function() {
                    me.doLayout();
                });
            }

            me.listBoxEl.externalHeight(height);
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.listBoxEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.listBoxEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me._setWidth(width);
            me._setHeight(height);
        },
        /**
         * @private
         * @description 获取组件值
         * @param {Object} value 组件值，格式为{value: 值, text: 文本}
         */
        _setValue: function(value) {
            if ($.isNull(value)) {
                return;
            }
            this.boxElement.val(value.value);
        },
        /**
         * @private
         * @description 设置组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this;
            var val = [];
            for (var id in me.btnObj) {
                val.push(me.btnObj[id].getValue());
            }
            return val;
        },
        /**
         * @description 刷新布局，子类继承实现，并调用super
         * @private
         */
        _doLayout: function() {
            var me = this,
                    options = me.options,
                    listBoxElWidth = me.listBoxEl.width(),
                    listBoxElHieght = me.listBoxEl.height(),
                    labelWidth = me.labelWidth = me._doLabelLayout(listBoxElWidth),
                    listBoxDiv1ElWidth = listBoxElWidth,
                    listBoxClearPicWidth = 0;
            me.listBoxDiv1El.css({"padding-left": labelWidth, "position": "relative"})
                    .externalWidth(listBoxDiv1ElWidth)
                    .externalHeight(listBoxElHieght);
            if (me.options.clearAll) {
                listBoxClearPicWidth = me.clearAllBtn.externalWidth();
            }
            me.listBoxDiv2El.externalWidth(me.listBoxDiv1El.width() - listBoxClearPicWidth)
                    .externalHeight(me.listBoxDiv1El.height());
            me.boxElement.css("overflow", "auto").externalWidth("100%")
                    .externalHeight("100%");
        },
        /**
         * @private
         * @description 创建listBox组件总入口
         */
        _createSweetWidget: function() {
            if (this.renderEl) {
                return;
            }
            var me = this,
                    listBoxEl = me.listBoxEl = $("<div>"),
                    options = me.options;

            listBoxEl.width(options.width)
                    .height(options.height)
                    .attr("id", options.id);

            me._beforeCreateBoxWidget();
            me._createListBoxWidget();
            me._afterCreateBoxWidget();
        },
        /**
         * @private
         * @description 支持box内组件的拖动
         * @param {bool} draggable 是否支持拖动，默认支持
         * @param {object}liId：被拖动li对象
         * @param {object}labelItemObj 被拖动的item对象
         */
        _createDraggable: function(draggable, liId, labelItemObj) {
            var me = this;
            var itemNode = liId;
            //支持box内组件的拖动
            if (draggable) {
                itemNode.parent().sortable({
                    start: function(event, ui) {
                        if (!me.options.tip) {
                            return;
                        }
                        for (var key in labelItemObj) {
                            labelItemObj[key].setTip(false);
                        }
                    },
                    stop: function(event, ui) {
                        if (!me.options.tip) {
                            return;
                        }
                        for (var key in labelItemObj) {
                            labelItemObj[key].setTip(true);
                        }
                        var liObjs = me.boxElement.children("li").children("div"),
                                tempBtnObj = {},
                                id;
                        for (var i = 0; i < liObjs.length; i++) {
                            id = liObjs[i].id;
                            tempBtnObj[id] = me.btnObj[id];
                        }
                        me.btnObj = tempBtnObj;
                    }
                });
                itemNode.parent().disableSelection();
            }
        },
        /**
         * @private
         * @description 创建listBox组件
         */
        _createListBoxWidget: function() {
            var me = this,
                    options = me.options;
            // 创建label标签
            me._createLabel();
            // 创建listBox组件
            me._createBoxField();
        },
        /**
         * @private
         * @description 创建基本文本框前label标签
         */
        _createLabel: function() {
            if (!this.options.label) {
                return;
            }
            var me = this,
                    options = me.options,
                    labelClass = "sweet-form-label",
                    label = me.label = $("<label>").addClass(labelClass),
                    labelText = '';
            if (!$.isNull(options.labelText)) {
                labelText += options.labelText + Sweet.constants.symbol.COLON;
            } else {
                return;
            }
            label.html($.nullToString(labelText)).appendTo(me.listBoxEl);
        },
        /**
         * @private
         * @description 创建listBox组件
         */
        _createBoxField: function() {
            var me = this,
                    options = me.options,
                    // 外层div
                    listBoxDiv1El = me.listBoxDiv1El = $("<div>").appendTo(me.listBoxEl),
                    // 里层div
                    listBoxDiv2El = me.listBoxDiv2El = $("<div>").addClass(listBoxDiv2Cls),
                    // box div
                    boxElement = me.boxElement = $("<ul>").appendTo(listBoxDiv2El);
            // clear button
            if (me.options.clearAll) {
                me.clearAllBtn = $("<a>").attr("title", Sweet.core.i18n.listbox.clearAll)
                        .addClass(listBoxClearPicCls)
                        .appendTo(listBoxDiv1El);
            }
            listBoxDiv2El.appendTo(listBoxDiv1El);
            me.emptyDiv = $("<div>").html(me.options.emptyText).addClass(defaultEmptyDivClass)
                    .appendTo(me.listBoxDiv2El);
        },
        /**
         * @private
         * @description 计算label宽度
         * @param {Number} width 外层容器宽度
         */
        _addOneItem: function(val) {
            if (!val.data) {
                return;
            }

            var me = this,
                    liId = "listBox-li-" + increments,
                    labelItemId = "listBox-labelItem-" + increments++,
                    liObj = $("<li>").attr("id", liId)
                    .addClass(listBoxLiCls)
                    .appendTo(me.boxElement),
                    itemClosable = val.data.closable === false ? false : true;

            var labelItem = me.labelItem = new Sweet.form.LabelItem({
                id: labelItemId,
                value: val,
                imageType: val.data.type,
                closable: itemClosable,
                width: 150,
                tip: me.options.tip,
                renderTo: liId,
                close: function(e, data) {
                    labelItem.renderEl.remove();
                    delete me.btnObj[labelItemId];
                    // delete应该在回调之前，这样保证业务人员在回调中使用getValue时，得到删除后的值
                    // 单号：DTS2013090202615
                    me.options.closeItem.call(this, data);
                    me._setEmptyText();
                }
            });
            labelItem.options.value = val;
            me.btnObj[labelItemId] = labelItem;

            //支持组件内拖动
            me._createDraggable(me.options.draggable, liObj, me.btnObj);
        },
        /**
         * @private
         * @description 计算label宽度
         * @param {Number} width 外层容器宽度
         */
        _doLabelLayout: function(width) {
            var me = this,
                    options = me.options,
                    labelWidth;
            if (me.label) {
                // 按百分比设定
                if (1 > options.labelWidth) {
                    labelWidth = Math.floor(width * options.labelWidth);
                } else {
                    labelWidth = options.labelWidth;
                }
                me.label.width(labelWidth).height(options.height);
            } else {
                labelWidth = 0;
            }

            return labelWidth;
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.listBoxEl.appendTo(me.renderEl);
            // 初始化
            if (me.options.items) {
                me.addItems(me.options.items);
            }
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 销毁listBox组件
         */
        _destroyWidget: function() {
            if (this.renderEl) {
                this.renderEl.remove();
            }
        },
        /**
         * @private
         * @description 创建listBox组件前操作，子类继承实现
         */
        _beforeCreateBoxWidget: function() {
            var me = this;
            me.btnObj = {};
        },
        /**
         * @private
         * @description 创建listBox组件后操作，子类继承实现
         */
        _afterCreateBoxWidget: function() {
            var me = this;
            // 全部删除
            if (!me.options.clearAll) {
                return;
            }
            // 清除按钮点击事件
            me.clearAllBtn.bind("click", function() {
                var value = me.getValue();
                me.removeItems();
                me.options.closeItem.call(this, value, true);
            });
        },
        /**
         * @private
         * @description 创建listBox组件后操作，子类继承实现
         */
        _setEmptyText: function() {
            var me = this;
            if (me.boxElement.html()) {
                me.emptyDiv.hide();
            } else {
                me.emptyDiv.show();
            }
        }
    });

    /**
     * 创建listBox组件基类
     * @name Sweet.ListBox
     * @class 
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * var value = [{value: "dim", text: "维度", data: {type: "dim"}}, 
     *              {value: "index", text: "指标", data: {type: "index"}}];
     *  sweetListBox = new Sweet.ListBox({
     *      width : "60%",
     *      height: 100,
     *      clearAll: true,//默认就为true
     *      items: value,
     *      emptyText : "请拖动一个组件过来...",
     *      label : true,
     *      labelText : '维度/指标',
     *      labelWidth: 70,
     *      tip: true,
     *      renderTo: "sweet-listbox"
     * });
     * </pre>
     */
    Sweet.ListBox = $.sweet.widgetListBox;
}(jQuery));

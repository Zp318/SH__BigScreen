/**
 * @fileOverview
 * <pre>
 * 容器组件-表格布局容器
 * 2013/2/4
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {

    var defaultPanelContentClass = "sweet-panel-content",
        defaultGridPanelClass = "sweet-panel-grid",
        defaultGridTableClass = "sweet-panel-grid-table",
        gridIdPrefix = "sweet-grid-panel-",
        uuid = 1000;

    $.widget("sweet.widgetContainerGridpanel", $.sweet.widgetContainerPanel,
        /** @lends Sweet.panel.GridPanel.prototype*/{
            version: "1.0",
            sweetWidgetName: "[widget-container-gridpanel]:",
            type: "gridPanel",
            options: /** @lends Sweet.panel.GridPanel.prototype*/{
                /**
                 * 表格行、列数配置
                 * @type Object
                 * @default {rows: 1, columns: 1}
                 */
                layoutOptions: {
                    rows: 1,
                    columns: 1
                },
                /**
                 * 子组件间距
                 * @type Number
                 * @default 5
                 */
                padding: 5,
                /**
                 * 扩展子组件，适应布局的宽、高
                 * @type Boolean
                 * @default true
                 */
                itemExtend: true
            },
            /**
             * @description 查询当前布局中的行数
             * @returns {Number} 行数
             */
            getRowCount: function () {
                return this.options.layoutOptions.rows;
            },
            /**
             * @description 查询当前布局中的列数
             * @returns {Number} 列数
             */
            getColumnCount: function () {
                return this.options.layoutOptions.columns;
            },
            /**
             * @description 添加一行
             * @param {Array} items 一组子组件
             * @param {Function} callback 参数为回调函数，有效时为异步处理
             */
            addRow: function (items, callback) {
                var me = this;
                var count = 0;
                var i, item;
                var async = $.isFunction(callback);

                if (!$.isArray(items) || items.length === 0) {
                    return;
                }

                function __add () {
                    if ($.isArray(items[0])) {
                        if (!async) {
                            for (i = 0; i < items.length; i++) {
                                me._addRow(items[i]);
                                me._doLayout(false, items[i].length);
                            }
                        }
                        else {
                            item = items[count++];
                            me._addRow(item);
                            me._doLayout(false, item.length);

                            if (count < items.length) {
                                window.setTimeout(__add, 5);
                                return;
                            }
                        }
                    }
                    else {
                        me._addRow(items);
                        me._doLayout();
                    }

                    // 异步处理的回调处理
                    if (async) {
                        callback();
                    }
                }

                if (async) {
                    window.setTimeout(__add, 5);
                }
                else {
                    __add();
                }
            },
            /**
             * @description 添加一行
             * @param {Array} items 一组子组件
             */
            _addRow: function (items) {
                var me = this;
                var count;
                var i;
                var colCount = me.getColumnCount();
                var item;

                if (!$.isArray(items)) {
                    return;
                }

                // 检查个数是否OK
                count = 0;
                for (i = 0; i < items.length; i++) {
                    item = items[i];

                    // 检查item类型
                    if ($.isPlainObject(item) && $.isNull(item.options)) {
                        item.options = $.objCopy(item);
                    }

                    // 如果指定了colspan属性，按colspan属性计算列数
                    if ($.isNull(item.options.colSpan)) {
                        item.options.colSpan = 1;
                    }
                    count += item.options.colSpan;
                }

                if (count !== colCount) {
                    me._error("Items count is incorrect!");
                    return;
                }

                // 按行添加
                var trEl = $("<tr>").appendTo(me.tableEl.children().first());
                var tdEl;
                var tdId;

                for (i = 0; i < items.length; i++) {
                    item = items[i];

                    // 添加TD
                    tdEl = me._addTd(item.options.colSpan, null);
                    tdEl.appendTo(trEl);
                    tdId = tdEl.attr("id");

                    // 渲染
                    if (me.rendered) {
                        me._renderItem(item, tdId);
                    }

                    // 记录映射关系
                    item.__gridContainerId = tdId;

                    // 保存items
                    me.options.items.push(item);
                }

                // 修正行数
                me.options.layoutOptions.rows++;
            },
            /**
             * @description 删除指定的行
             * @param {Number/Array} items 一个或一组行号（从0开始的索引），为空或null时，表示删除所有行
             * @param {Function} callback 参数为回调函数，有效时为异步处理
             */
            removeRow: function (items, callback) {
                var me = this;
                var i, j;
                var index;
                var item;
                var trEl, trElList;
                var async = $.isFunction(callback);

                // 如果输入参数为空，表示删除所有内容
                if (typeof items === 'undefined' || items === null) {
                    items = [];

                    for (i = 0; i < me.options.layoutOptions.rows; i++) {
                        items.push(i);
                    }
                }

                if ($.isNumeric(items)) {
                    items = [items];
                }

                if (!$.isArray(items)) {
                    return;
                }

                // 删除item
                function __removeItem (col, td) {
                    // 查找item
                    for (j = 0; j < me.options.items.length; j++) {
                        item = me.options.items[j];

                        if (item.__gridContainerId === td.id) {
                            break;
                        }
                    }

                    if (j >= me.options.items.length) {
                        me._error("TD#" + td.id + " contains none item!");
                        return;
                    }

                    // 销毁item
                    if ($.isFunction(item.destroy)) {
                        item.destroy();
                    }

                    // 从items中删除
                    me.options.items.splice(j, 1);
                }

                trElList = me.tableEl.find(">tbody>tr");
                function __remove (index) {
                    // 找到行
                    trEl = trElList.eq(index);

                    // 找到并删除对应的item
                    trEl.children().each(__removeItem);

                    // 删除行元素
                    trEl.remove();

                    // 修正行数
                    me.options.layoutOptions.rows--;
                }

                // 找到指定的行并删除
                items.sort(function(a, b) {return b - a;});

                if (!async) {
                    for (i = 0; i < items.length; i++) {
                        index = items[i];
                        __remove(index);
                    }

                    // 重新布局
                    me._doLayout();
                }
                else {
                    i = 0;
                    function __removeAsync () {
                        index = items[i++];
                        __remove(index);

                        if (i >= items.length) {
                            me._doLayout();
                            callback();
                        }
                        else {
                            window.setTimeout(__removeAsync, 5);
                        }
                    }
                    window.setTimeout(__removeAsync, 5);
                }
            },
            /**
             * @private
             * @descripition 重新计算绘制表格布局
             * @param {Boolean} force 是否强制刷新 
             * @param {Number} count 想要刷新的新增的item个数
             */
            _doLayout: function (force, count) {
                var me = this;

                // 渲染前禁止进入
                if (!me.rendered) {
                    return;
                }

                // 调用父类的_doLayout，调整panelContentEl的大小
                me._super();

                var options = me.options;
                var rows = options.layoutOptions.rows;
                var columns = options.layoutOptions.columns;
                me.containerWidth = me.containerEl.width();
                me.containerHeight = me.containerEl.height();
                count = $.type(count) === "number" ? count : 0;

                // 修正内层容器大小
                me.gridPanel.externalWidth("100%").externalHeight("100%");
                var gridWidth = me.gridPanel.width();
                var gridHeight = me.gridPanel.height();

                // 表格的大小
                me.tableEl.width("auto").height("auto");

                // 修正子组件大小
                var paddingWidth = options.padding * (columns - 1);
                var paddingHeight = options.padding * (rows - 1);
                var width = me.averageWidth = Math.floor((gridWidth - paddingWidth) / columns);
                var height = me.averageHeight = Math.floor((gridHeight - paddingHeight) / rows);
                var w;
                var h;
                var tdId;

                $.each(options.items, function (index, obj) {
                    // 扩展子组件。注：itemExtend为true时，不支持colSpan/rowSpan
                    if (me.options.itemExtend === true) {
                        obj.setWH(width, height);
                        return;
                    }

                    // 如果指定了刷新的item个数，只刷新最后count个item
                    if (count > 0 && index + count < options.items.length) {
                        return;
                    }

                    // 由于可能存在colSpan/rowSpan，需要重新计算间隔
                    // 约束：每行、每列，只支持一个item携带colSpan/rowSpan属性大于1
                    tdId = obj.__gridContainerId;
                    columns = $("#" + tdId).parent().children().length;
                    rows = me.tableEl.find(">tbody>tr").length - obj.options.rowSpan;

                    paddingWidth = options.padding * (columns - 1);
                    paddingHeight = options.padding * (rows - 1);

                    // 如果指定大小为百分比，需要重新计算
                    w = obj._initConfig.width;
                    if ($.type(w) === "string" && /\d+%/.test(w)) {
                        w = parseInt(w, 10);
                        w = Math.floor((gridWidth - paddingWidth) * w / 100);
                    }

                    h = obj._initConfig.height;
                    if ($.type(h) === "string" && /\d+%/.test(h)) {
                        h = parseInt(h, 10);
                        h = Math.floor(gridHeight * h / 100);
                    }
                    obj.setWH(w, h);
                });

                // 设置子组件间隔
                var paddingTop, paddingLeft;
                me.tableEl.find(">tbody>tr").each(function (row, tr) {
                    $(tr).children().each(function (col, td) {
                        // 行间距
                        if (row > 0) {
                            paddingTop = me.options.padding;
                        }
                        else {
                            paddingTop = 0;
                        }

                        // 列间距
                        if (col > 0) {
                            paddingLeft = me.options.padding;
                        }
                        else {
                            paddingLeft = 0;
                        }

                        // 应用到TD
                        $(td).css({"padding-top": paddingTop, "padding-left": paddingLeft});
                    });
                });

                // table大小超出gridPanel的处理
                var tableWidth = me.tableEl.externalWidth();
                var tableHeight = me.tableEl.externalHeight();

                if (tableWidth > gridWidth) {
                    if (me.panelContentEl.css('overflow-x') !== "auto") {
                        me.panelContentEl.css('overflow-x', "auto");
                        me._doLayout();
                    }
                }
                else {
                    me.panelContentEl.css('overflow-x', "hidden");
                }

                if (tableHeight > gridHeight) {
                    if (me.panelContentEl.css('overflow-y') !== "auto") {
                        me.panelContentEl.css('overflow-y', "auto");
                        me._doLayout();
                    }
                }
                else {
                    me.panelContentEl.css('overflow-y', "hidden");
                }
            },
            /**
             * @private
             * @description 面板渲染
             */
            _widgetRender: function () {
                var me = this;
                if (me.containerEl) {
                    this._super();
                    var options = me.options;

                    // 将组件渲染到表格中
                    $.each(options.items, function (index, item) {
                        me._renderItem(item, item.__gridContainerId);
                    });
                }
            },
            /**
             * @private
             * @description 创建表格布局
             */
            _createPanelContent: function () {
                var me = this;
                var options = me.options;
                var rows = options.layoutOptions.rows;
                var columns = options.layoutOptions.columns;
                var gridPanel;
                var tableEl;
                var trEl;
                var tdEl;
                var index;
                var item;
                var rowSpanInfo = [];
                var rowSpan;
                var i;
                var j;

                // 一级容器
                me.panelContentEl = $("<div>").addClass(defaultPanelContentClass);

                // 二级容器，放置Table
                gridPanel = me.gridPanel = $("<div>");

                // 布局表格
                tableEl = me.tableEl = $("<table>");

                // 循环生成表格布局
                index = 0;
                for (i = 0; i < rows; i++) {
                    trEl = $("<tr>");

                    j = 0;
                    rowSpan = rowSpanInfo.length;

                    while (j < columns - rowSpan) {
                        if (index >= options.items.length) {
                            break;
                        }

                        // 取对应的item，判断其colspan
                        item = options.items[index];
                        if ($.isPlainObject(item) && $.isNull(item.options)) {
                            item.options = $.objCopy(item);
                        }

                        if ($.isNull(item.options.colSpan)) {
                            item.options.colSpan = 1;
                        }

                        if ($.isNull(item.options.rowSpan)) {
                            item.options.rowSpan = 1;
                        }

                        // 创建td
                        tdEl = me._addTd(item.options.colSpan, item.options.rowSpan);
                        tdEl.appendTo(trEl);
                        item.__gridContainerId = tdEl.attr("id");

                        // items列表索引
                        index++;

                        // 处理rowSpan
                        if (item.options.rowSpan > 1) {
                            rowSpanInfo.push(item.options.rowSpan);
                        }

                        // 下一个单元格
                        j += item.options.colSpan;
                    }

                    trEl.appendTo(tableEl);

                    // 一行结束后，rowSpanInfo出栈
                    for (var x = rowSpanInfo.length - 1; x >= 0; x--) {
                        rowSpanInfo[x] -= 1;

                        if (rowSpanInfo[x] === 0) {
                            rowSpanInfo.splice(x, 1);
                        }
                    }
                }

                // 设置样式
                tableEl.addClass(defaultGridTableClass).appendTo(gridPanel);
                gridPanel.addClass(defaultGridPanelClass).appendTo(me.panelContentEl);
            },
            /**
             * @description 销毁组件
             * @private
             */
            _destroyWidget: function () {
                this.removeRow();
                this._super();
            },

            /**
             * @description 创建TD元素，附加到TR中，做为子组件的容器
             * @param {Number} colspan 合并列数
             * @param {Number} rowspan 合并行数
             * @returns {string} TD元素的ID
             * @private
             */
            _addTd: function (colspan, rowspan) {
                var me = this;
                var tdId;
                var tdEl;

                tdId = gridIdPrefix + me.options.id + "-" + (++uuid);
                tdEl = $("<td>").attr("id", tdId);

                if (!$.isNull(colspan)) {
                    tdEl.attr("colspan", colspan);
                }

                if (!$.isNull(rowspan)) {
                    tdEl.attr("rowspan", rowspan);
                }

                return tdEl;
            },
            /**
             * @description 渲染item到指定id的容器中
             * @param {Object} item 子组件对象
             * @param {String} id 子组件容器id
             * @private
             */
            _renderItem: function (item, id) {
                if ($.isFunction(item.render)) {
                    item.render(id);
                }
                else if (!$.isNull(item.html)) {
                    $("#" + id).html(item.html);
                }
                else {
                    this._error("item is invalid:" + item);
                }
            },
            /**
             * @description 动态添加组件
             * @param {Object/Array} items 组件对象或组件对象数组
             */
            _addItems: function (items) {
                if ($.isNull(items)) {
                    return;
                }
                var me = this,
                    options = me.options,
                    columns = options.layoutOptions.columns,
                    rows,
                    trEl,
                    tdEl,
                    tdId,
                    itemsParentEl = [],
                    item;

                // 循环生成表格布局
                rows = Math.ceil(items.length / columns);
                for (var i = 0; i < rows; i++) {
                    trEl = $("<tr>");
                    for (var j = 0; j < columns; j++) {
                        tdEl = me._addTd(null, null);
                        tdEl.appendTo(trEl);
                        itemsParentEl.push({"id": tdId, "parentEl": tdEl});
                    }
                    trEl.appendTo(me.tableEl);
                }

                me.options.layoutOptions.rows += rows;
                me.options.items = me.options.items.concat(items);

                // 将组件渲染到容器内
                $.each(itemsParentEl, function (index, obj) {
                    if (index < items.length) {
                        item = items[index];
                        item.render(obj.id);

                        // 记录容器id
                        item.__gridContainerId = obj.id;
                    }
                });
            },
            /**
             * @description 从布局动态删除子组件
             * @private
             */
            _removeItems: function () {
                this._error("GridPanel._removeItems() is not supported, please use removeRow() instead.");
            }
        });

    /**
     * @description 表格布局容器
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.container.Panel
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * jquery.sweet.widget.container.panel.js
     * </pre>
     * @example
     * 创建表格布局容器：
     * var sweetGridPanel = Sweet.panel.GridPanel({});
     */
    Sweet.panel.GridPanel = $.sweet.widgetContainerGridpanel;
}(jQuery));

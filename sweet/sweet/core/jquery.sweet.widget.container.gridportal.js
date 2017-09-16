/**
 * @fileOverview
 * <pre>
 * 容器组件-Grid portal
 * 2013/4/10
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    'use strict';

    var contentClass = 'sweet-grid-portal-content';
    var containerClass = 'widget-container';
    var containerDraggingClass = 'container-dragging';
    var containerEmptyClass = 'container-empty';
    var containerFixedClass = 'container-fixed';
    var placeHolderClass = 'widget-placeholder';
    var detectValidClass = 'detect-valid';
    var detectInvalidClass = 'detect-invalid';
    var lockedClass = 'sweet-grid-portal-locked';
    var draggableClass = 'sweet-draggable';

    var attrRow = '_row';
    var attrCol = '_col';
    var attrRowSpan = '_row_span';
    var attrColSpan = '_col_span';
    var uuid = 1000;

    var MAX_COLS = 24;
    var MAX_ROWS = 24;

    var GOLDEN_RATIO = 0.9; // 强制单个Widget宽高比为黄金分割比率

    $.widget("sweet.widgetContainerGridPortal", $.sweet.widgetContainer,
        /** @lends Sweet.container.GridPortal.prototype*/{
            version: "1.0",
            sweetWidgetName: "[widget-container-portal]:",
            eventNames: /** @lends Sweet.container.GridPortal.prototype*/{
                /**
                * @event
                * @description widget布局位置发生变化，现在暂时还没有实现
                * @param {Event} evt 事件对象
                * @param {Object} data 点击的节点的数据信息
                */
                widgetlayoutchanged: "widget布局位置发生变化"
            },
            type: "Portal",
            options: /** @lends Sweet.container.GridPortal.prototype*/{
                /**
                 * 布局行数
                 * @type Number
                 * @default 3
                 */
                rows: 3,
                /**
                 * 布局列数
                 * @type Number
                 * @default 3
                 */
                columns: 3,
                /**
                 * widget间距
                 * @type Number
                 * @default 5
                 */
                padding: 5,
                /**
                 * 内部widgets数组
                 * @type Array
                 * @default []
                 */
                items: null,
                /**
                 * widget标题栏样式，用于获取可拖动区域
                 * @type String
                 * @default 'sweet-widget-panel-title'
                 */
                widgetTitleClass: 'sweet-widget-panel-title',
                /**
                 * 布局发生变化后，调用回调函数
                 * @type Function
                 * @default null
                 */
                widgetLayoutChanged: null,
                /**
                 * 是否适应当前布局大小，缩放widget，防止出现滚动条
                 * @type Boolean
                 * @default false
                 */
                fitMode: false,
                /**
                 * 是否允许编辑（区别在于拖动的处理、空区域的显示方式）
                 * @type Boolean
                 * @default false
                 */
                editable: false
            },
            /**
             * @description 设置组件是否可编辑
             * @param {Boolean} editable: true/false
             */
            setEditable: function(editable) {
                if (editable !== true) {
                    this.contentEl.addClass(lockedClass);
                    this.contentEl.find("." + this.options.widgetTitleClass).removeClass(draggableClass);
                }
                else {
                    this.contentEl.removeClass(lockedClass);
                    this.contentEl.find("." + this.options.widgetTitleClass).addClass(draggableClass);
                }

                this.options.editable = editable;
            },
            /**
             * 修改item的大小
             * @param {Number} row item的行号
             * @param {Number} col item的列号
             * @param {Number} rowSpan 修改后的高度
             * @param {Number} colSpan 修改后的宽度
             * @param {Boolean} test   是否仅做测试，而不实际执行修改
             * @returns {Boolean} 是否成功
             */
            changeWidgetSize: function (row, col, rowSpan, colSpan, test) {
                var area, widget, areaInfo;
                var emptyArea;
                var i, j;

                // 检查参数合法性
                if (rowSpan <= 0 || rowSpan > this.options.rows ||
                    colSpan <= 0 || colSpan > this.options.columns) {
                    return false;
                }

                // 找到要修改的widget对象
                area = this._getAreaByPosition(row, col);
                widget = this._getWidgetByPosition(row, col);
                if (area === null || widget === null) {
                    return false;
                }

                // 检查新扩展的区域是否可用
                // 只在需要扩展尺寸时才需要检查，如果是减小尺寸，直接操作就可以
                areaInfo = this._getAreaAttr(area);
                if (rowSpan > areaInfo.rowSpan || colSpan > areaInfo.colSpan) {
                    for (i = areaInfo.row; i < areaInfo.row + rowSpan; i++) {
                        for (j = areaInfo.col; j < areaInfo.col + colSpan; j++) {
                            if (i >= areaInfo.row + areaInfo.rowSpan || j >= areaInfo.col + areaInfo.colSpan) {
                                if (this._detectByPosition(i, j) !== 0) {
                                    return false;
                                }
                            }
                        }
                    }
                }

                // 如果只是测试，直接返回结果
                if (test === true) {
                    return true;
                }

                // 如果减小，要把释放的区域填上空白块；如果增大，要删除覆盖区域的空白块（在doLayout中做的）
                if (rowSpan < areaInfo.rowSpan || colSpan < areaInfo.colSpan) {
                    for (i = areaInfo.row; i < areaInfo.row + areaInfo.rowSpan; i++) {
                        for (j = areaInfo.col; j < areaInfo.col + areaInfo.colSpan; j++) {
                            if (i >= areaInfo.row + rowSpan || j >= areaInfo.col + colSpan) {
                                emptyArea = this._createAreaByPosition(i, j, 1, 1);
                                if (emptyArea) {
                                    emptyArea.appendTo(this.contentEl);
                                }
                            }
                        }
                    }
                }

                // 修改大小
                widget.options.rowSpan = rowSpan;
                widget.options.colSpan = colSpan;
                area.attr("_row_span", rowSpan);
                area.attr("_col_span", colSpan);

                // 刷新布局
                this._doLayout();

                // 成功
                return true;
            },
            /**
             * 修改布局的行列数
             * @param {Number} rows 行数
             * @param {Number} cols 列数
             */
            changeLayout: function (rows, cols) {
                var row, col;
                var orgRows, orgCols;
                var area;

                // 不允许删除所有区域，或超过最大行数、列数
                if (rows === 0 || rows > MAX_ROWS ||
                    cols === 0 || cols > MAX_COLS) {
                    return false;
                }
                else {
                    rows = rows || this.options.rows;
                    cols = cols || this.options.columns;
                }

                // 如果要删除区域，需要确保要删除的区域上没有内容；否则不允许修改
                if (rows < this.options.rows) {
                    for (row = rows; row < this.options.rows; row++) {
                        for (col = 0; col < this.options.columns; col++) {
                            if (this._detectByPosition(row, col) !== 0) {
                                return false;
                            }
                        }
                    }
                }
                if (cols < this.options.columns) {
                    for (row = 0; row < this.options.rows; row++) {
                        for (col = cols; col < this.options.columns; col++) {
                            if (this._detectByPosition(row, col) !== 0) {
                                return false;
                            }
                        }
                    }
                }

                // 可以删除区域，执行实际删除动作
                if (rows < this.options.rows) {
                    for (row = rows; row < this.options.rows; row++) {
                        for (col = 0; col < this.options.columns; col++) {
                            area = this._getAreaByPosition(row, col);
                            if (area) {
                                area.remove();
                            }
                        }
                    }

                    this.options.rows = rows;
                }
                if (cols < this.options.columns) {
                    for (row = 0; row < this.options.rows; row++) {
                        for (col = cols; col < this.options.columns; col++) {
                            area = this._getAreaByPosition(row, col);
                            if (area) {
                                area.remove();
                            }
                        }
                    }

                    this.options.columns = cols;
                }

                // 如果是要增加区域，添加空白区域
                if (rows > this.options.rows) {
                    // 为了后续调用私有函数，要先修改组件配置
                    orgRows = this.options.rows;
                    this.options.rows = rows;

                    for (row = orgRows; row < this.options.rows; row++) {
                        for (col = 0; col < this.options.columns; col++) {
                            area = this._createAreaByPosition(row, col);
                            if (area) {
                                area.appendTo(this.contentEl);
                            }
                        }
                    }
                }
                if (cols > this.options.columns) {
                    // 为了后续调用私有函数，要先修改组件配置
                    orgCols = this.options.columns;
                    this.options.columns = cols;

                    for (row = 0; row < this.options.rows; row++) {
                        for (col = orgCols; col < this.options.columns; col++) {
                            area = this._createAreaByPosition(row, col);
                            if (area) {
                                area.appendTo(this.contentEl);
                            }
                        }
                    }
                }

                // 强制刷新布局
                this._doLayout();
                return true;
            },
            /**
             * description 添加Widget
             * @param {Object} widget Widget对象
             * @returns {boolean} 是否成功
             */
            addWidget: function (widget) {
                var me = this;

                if ($.type(widget) !== 'object') {
                    return false;
                }

                // 渲染对象到容器
                if (me._renderWidget(widget) === null) {
                    return false;
                }

                // 加入列表
                me.options.items.push(widget);

                // 刷新布局
                me._doLayout();
                return true;
            },
            /**
             * description 删除Widget
             * @param {Object/String/Number} widget Widget对象，或Widget对象的id，或Widget对象的行号
             * @param {Number} col Widget对象的列号，仅在widget参数为数字时有效
             * @returns {boolean} 是否成功
             */
            removeWidget: function (widget, col) {
                var me = this;
                var widgetObj = null;
                var row;
                var areaEl;
                var index;
                var item;
                var areaInfo;

                var items = me.options.items;

                // 如果输入参数是字符串，按id处理
                if ($.type(widget) === 'string') {
                    $.each(me.options.items, function (index, item) {
                        if (item.options.id === widget) {
                            widgetObj = item;
                        }
                    });
                }
                // 如果是数字，按照行、列处理
                else if ($.isNumeric(widget) && $.isNumeric(col)) {
                    widgetObj = me._getWidgetByPosition(widget, col);
                }
                // 如果是对象，直接做为Widget对象处理
                else if ($.type(widget) === 'object') {
                    widgetObj = widget;
                }

                if ($.isNull(widgetObj)) {
                    return false;
                }

                areaEl = me._getAreaByWidget(widgetObj);
                if ($.isNull(areaEl)) {
                    return false;
                }
                areaInfo = me._getAreaAttr(areaEl);

                // 删除Widget对象
                index = -1;
                for (var i = items.length - 1; i >= 0; i--) {
                    item = items[i];

                    if (item === widgetObj) {
                        if ($.isFunction(item.destroy())) {
                            item.destroy();
                        }

                        items.splice(i, 1);
                        break;
                    }
                }

                // 删除容器
                areaEl.remove();

                // 重新创建空容器
                for (row = areaInfo.row; row < areaInfo.row + areaInfo.rowSpan; row++) {
                    for (col = areaInfo.col; col < areaInfo.col + areaInfo.colSpan; col++) {
                        areaEl = me._createAreaByPosition(row, col);
                        if (areaEl) {
                            areaEl.addClass(containerEmptyClass).appendTo(me.contentEl);
                        }
                    }
                }

                // 刷新布局
                me._doLayout();

                return true;
            },
            /**
             * @description 检查指定目标位置是否可以放置
             * @param {Number} x 水平偏移，为undefined时，取消测试操作
             * @param {Number} y 垂直偏移
             * @param {Number} rowSpan 行数
             * @param {Number} colSpan 列数
             * @returns {Object} 当前行列信息
             * @private
             */
            detectPlace: function (x, y, rowSpan, colSpan) {
                var me = this;
                var indicator;
                var widget;
                var ret = null;

                // 取消测试操作
                if ($.type(x) === 'undefined') {
                    if (me.__detectIndicator) {
                        if ($.isFunction(me.__detectIndicator.remove)) {
                            me.__detectIndicator.remove();
                        }
                        me.__detectIndicator = null;
                    }

                    return null;
                }
                else {
                    if (!me.__detectIndicator) {
                        me.__detectIndicator = $("<div>").appendTo(me.contentEl);
                    }
                    indicator = me.__detectIndicator;
                }

                // 检查是否在有效的Area上
                var areaEl = me._getAreaByPoint(x - me.contentEl.offset().left, y - me.contentEl.offset().top);
                if ($.isNull(areaEl)) {
                    me.__detectIndicator.hide();
                    return null;
                }

                var areaInfo = me._getAreaAttr(areaEl);

                // 判断是否可以放置
                ret = {'row': areaInfo.row, 'col': areaInfo.col};
                if (areaInfo.row + rowSpan > me.options.rows) {
                    ret = null;
                    rowSpan = me.options.rows - areaInfo.row;
                }
                if (areaInfo.col + colSpan > me.options.columns) {
                    ret = null;
                    colSpan = me.options.columns - areaInfo.col;
                }

                // 检查是否会覆盖已有内容
                for (var i = areaInfo.row; i < areaInfo.row + rowSpan && ret !== null; i++) {
                    for (var j = areaInfo.col; j < areaInfo.col + colSpan && ret !== null; j++) {
                        areaEl = me._getAreaByPosition(i, j);
                        if (areaEl === null) {
                            ret = null;
                            break;
                        }
                        else {
                            widget = me._getWidgetByArea(areaEl);
                            if (widget !== null) {
                                ret = null;
                                break;
                            }
                        }
                    }
                }

                // 显示蒙板
                var cellSize = me._getCellSize();
                var width = cellSize.width * colSpan + me.options.padding * (colSpan - 1);
                var height = cellSize.height * rowSpan + me.options.padding * (rowSpan - 1);

                if (ret === null) {
                    indicator.addClass(detectInvalidClass).removeClass(detectValidClass);
                }
                else {
                    indicator.removeClass(detectInvalidClass).addClass(detectValidClass);
                }

                indicator.show()
                    .css('left', areaInfo.left)
                    .css('top', areaInfo.top)
                    .externalWidth(width)
                    .externalHeight(height);

                return ret;
            },
            /**
             * @description 设置布局模式
             * @param flag
             */
            setFitMode: function (flag) {
                if (flag === this.options.fitMode) {
                    return;
                }
                else {
                    this.options.fitMode = flag;
                    this._doLayout();
                }
            },
            /**
             * @private
             * @description 重绘组件
             */
            _doLayout: function () {
                var me = this;
                var options = me.options;
                var widgetWidth, widgetHeight;
                var areaWidth, areaHeight;
                var row, col;
                var rowSpan, colSpan;
                var width, height;
                var left, top;
                var contentWidth, contentHeight;
                var widget;
                var areaEl;
                var areaInfo;
                var i, j, fontSize;

                // 渲染前禁止进入
                if (!me.rendered) {
                    return;
                }

                // 缺省widget大小
                width = this._getCellSize().width;
                height = this._getCellSize().height;

                // 计算内部容器的大小
                contentWidth = width * options.columns + options.padding * (options.columns - 1);
                contentHeight = height * options.rows + options.padding * (options.rows - 1);
                me.contentEl.width(contentWidth);
                me.contentEl.height(contentHeight);

                // fit模式下，居中显示内容
                if (options.fitMode === true) {
                    if (contentWidth < me.containerEl.width()) {
                        me.contentEl.css('left', Math.floor((me.containerEl.width() - contentWidth) / 2));
                    }
                    if (contentHeight < me.containerEl.height()) {
                        me.contentEl.css('top', Math.floor((me.containerEl.height() - contentHeight) / 2));
                    }
                }
                else {
                    this.contentEl.css('left', 0);
                }

                // 计算缺省大小
                me.contentEl.children().each(function (index, div) {
                    areaEl = $(div);

                    // 只处理widget容器
                    if (!areaEl.hasClass(containerClass)) {
                        return;
                    }

                    // 取得行号
                    areaInfo = me._getAreaAttr(areaEl);
                    row = areaInfo.row;
                    col = areaInfo.col;
                    rowSpan = areaInfo.rowSpan;
                    colSpan = areaInfo.colSpan;

                    // 计算widget容器的大小和位置
                    areaWidth = width * colSpan + (colSpan - 1) * options.padding;
                    areaHeight = height * rowSpan + (rowSpan - 1) * options.padding;
                    left = (width + options.padding) * col;
                    top = (height + options.padding) * row;

                    // 设置widget容器的高度、宽度
                    areaEl.externalWidth(areaWidth).externalHeight(areaHeight);
                    areaEl.css({"top": top, "left": left});

                    // 修正widget的大小
                    widget = me._getWidgetByArea(areaEl);
                    if (!$.isNull(widget)) {
                        areaEl.removeClass(containerEmptyClass);

                        widgetWidth = areaEl.width();
                        widgetHeight = areaEl.height();
                        widget.setWH(widgetWidth, widgetHeight);

                        // 固定位置的widget，添加专用样式
                        if (widget.options.fixed === true) {
                            if (!areaEl.hasClass(containerFixedClass)) {
                                areaEl.addClass(containerFixedClass);
                            }
                        }
                        else {
                            areaEl.removeClass(containerFixedClass);
                        }
                    }
                    else {
                        if (!areaEl.hasClass(containerEmptyClass)) {
                            areaEl.addClass(containerEmptyClass);
                        }
                    }

                    // 如果一个Widget占用两个以上单位位置，相邻被占用的位置的子容器要删除掉
                    for (i = row; i < row + rowSpan; i++) {
                        for (j = col; j < col + colSpan; j++) {
                            // 跳过自己
                            if (i === row && j === col) {
                                continue;
                            }

                            areaEl = me._getAreaByPosition(i, j);
                            if (areaEl) {
                                areaEl.remove();
                            }
                        }
                    }
                });

                fontSize = Math.floor(height * 0.7);
                fontSize = fontSize > 200 ? 200 : fontSize;

                // 空白位置，显示一个加号
                me.contentEl.children("." + containerEmptyClass)
                    .text("+")
                    .css({"font-size": fontSize + "px", "line-height": height + "px"});

                // 滚动条
                me.containerEl.scrollPanel('vertical', {
                    contentClass: contentClass
                });
            },
            /**
             * @private
             * @description 组件渲染
             */
            _widgetRender: function () {
                var me = this;
                if (me.containerEl) {
                    var options = me.options;
                    var items = options.items;

                    // 容器附着到外层容器中
                    me.contentEl.appendTo(me.containerEl);

                    // 将组件渲染到容器内
                    $.each(items, function (index, widget) {
                        me._renderWidget(widget);
                    });

                    // 允许拖动
                    me._widgetDrag();
                }
            },
            /**
             * @private
             * @description 创建Portal容器
             */
            _createContainer: function () {
                var me = this;

                if(!me.options.items){
                    me.options.items = [];
                }

                // 修正最大规格
                if (me.options.rows > MAX_ROWS) {
                    me.options.rows = MAX_ROWS;
                }
                if (me.options.columns > MAX_COLS) {
                    me.options.columns = MAX_COLS;
                }

                var rows = me.options.rows;
                var columns = me.options.columns;
                var i, j;
                var divEl;

                // 容器
                me.contentEl = $("<div>").addClass(contentClass);
                if (me.options.editable !== true) {
                    this.contentEl.addClass(lockedClass);
                }
                else {
                    this.contentEl.removeClass(lockedClass);
                }

                // widget容器
                for (i = 0; i < rows; i++) {
                    for (j = 0; j < columns; j++) {
                        divEl = me._createAreaByPosition(i, j);
                        divEl.appendTo(me.contentEl);
                    }
                }
            },
            /**
             * @description 根据行、列号创建一个容器
             * @param {Number} row 行号
             * @param {Number} col 列号
             * @param {Number} rowSpan 行合并
             * @param {Number} colSpan 列合并
             * @returns {Object} 创建的容器对象
             * @private
             */
            _createAreaByPosition: function (row, col, rowSpan, colSpan) {
                var me = this;
                var divEl;

                // 如果指定的宽高不空，按1来处理
                if ($.type(rowSpan) === 'undefined') {
                    rowSpan = 1;
                }
                if ($.type(colSpan) === 'undefined') {
                    colSpan = 1;
                }

                // 检查参数合法性
                if (row < 0 || row >= me.options.rows ||
                    col < 0 || col >= me.options.columns ||
                    row + rowSpan > me.rows ||
                    col + colSpan > me.options.columns) {
                    me._error("expected area cannot be created");
                    return null;
                }

                // 避免重复创建
                if (this._getAreaByPosition(row, col) !== null) {
                    return null;
                }

                // 创建Div
                divEl = $("<div>");
                divEl.attr(attrRow, row)
                    .attr(attrCol, col)
                    .attr(attrRowSpan, 1)
                    .attr(attrColSpan, 1)
                    .attr("id", me.options.id + "-" + (++uuid))
                    .addClass(containerClass);

                return divEl;
            },
            /**
             * @description Widget拖放的处理，位置改变后，会触发widgetlayoutchanged事件
             * @private
             */
            _widgetDrag: function () {
                var me = this;
                var widget = null;
                var area = null;
                var draggingBar = null;
                var dragTargetClass = me.options.widgetTitleClass;
                var rx, ry;
                var contentWidth, contentHeight;
                var areaWidth, areaHeight;
                var areaOrgLeft, areaOrgTop;
                var contentOffset;
                var placeHolder = null;
                var moveTimer = -1;
                var animateDuration = 100;
                var endingDuration = 100;
                var animating = false;
                var lastTarget = null;

                if (!me.contentEl) {
                    me._error("failed to start monitor dragging");
                    return;
                }

                // 监听拖动
                me.contentEl.sweetDrag(
                    // Drag Start
                    function (event) {
                        // 检查当前是否可编辑
                        if (!me.options.editable) {
                            return false;
                        }

                        // 判断当前想要拖动的Dom元素是否为可拖动
                        var elem = event.target;
                        var elemEl = $(elem);
                        if (!elemEl.hasClass(dragTargetClass)) {
                            return false;
                        }

                        // 找到对应的area和widget，保存到变量中
                        me.contentEl.children().each(function (index, div) {
                            if ($.contains(div, elem)) {
                                area = $(div);
                            }
                        });

                        if (area === null) {
                            return false;
                        }
                        else {
                            widget = me._getWidgetByArea(area);
                        }

                        // 固定位置类型的widget，不允许拖动
                        if (widget && widget.options.fixed === true) {
                            area = null;
                            widget = null;
                            return false;
                        }

                        // 记录初始位置
                        areaOrgLeft = parseInt(area.css("left"), 10) || 0;
                        areaOrgTop = parseInt(area.css("top"), 10) || 0;
                        rx = event.pageX - areaOrgLeft;
                        ry = event.pageY - areaOrgTop;

                        // 初始化变量
                        contentWidth = me.contentEl.width();
                        contentHeight = me.contentEl.height();
                        areaWidth = area.externalWidth();
                        areaHeight = area.externalHeight();
                        contentOffset = me.contentEl.offset();

                        // 创建占位框
                        var areaInfo = me._getAreaAttr(area);
                        var zIndex = $.getMaxZIndex();
                        placeHolder = $("<div>").addClass(placeHolderClass);
                        placeHolder.appendTo(me.contentEl)
                            .css("left", areaInfo.left)
                            .css('top', areaInfo.top)
                            .css('z-index', zIndex)
                            .externalWidth(areaWidth)
                            .externalHeight(areaHeight);

                        placeHolder.attr(attrRow, areaInfo.row)
                            .attr(attrCol, areaInfo.col)
                            .attr(attrRowSpan, areaInfo.rowSpan)
                            .attr(attrColSpan, areaInfo.colSpan);


                        // 调整area样式：半透明、鼠标开关为move
                        area.addClass(containerDraggingClass);
                        elemEl.css('cursor', 'move');

                        draggingBar = elemEl;

                        // 变动标志
                        me.__widgetLayoutChanged = false;

                        return null;
                    },
                    // Drag End
                    function () {
                        // 变量area/widget为空的话，则没有内容正在被拖动
                        if (area === null || widget === null) {
                            return false;
                        }

                        // 计算正确位置
                        var pt = me._calculateAreaPoint(area);

                        // 动画方式，拖动的区域归位
                        area.animate({
                            'left': pt.left + 'px',
                            'top': pt.top + 'px'
                        }, {
                            'duration': endingDuration,
                            'complete': function () {
                                // 刷新布局
                                me._doLayout();

                                // 触发布局变化事件
                                if (me.__widgetLayoutChanged) {
                                    me._widgetLayoutChanged();
                                }
                            }
                        });

                        // 清理
                        if (placeHolder) {
                            placeHolder.remove();
                        }

                        draggingBar.css('cursor', '');
                        draggingBar = null;
                        area.removeClass(containerDraggingClass);

                        widget = null;
                        area = null;
                        placeHolder = null;
                        lastTarget = null;
                    },
                    // Drag Moving...
                    function (event) {
                        // 变量area/widget为空的话，则没有内容正在被拖动
                        if (area === null || widget === null) {
                            return false;
                        }

                        // 计算widget的新位置
                        var offsetX = event.pageX - rx;
                        var offsetY = event.pageY - ry;

                        // 修正位置：不允许超出组件容器的范围
                        if (offsetX < 0) {
                            offsetX = 0;
                        }
                        if (offsetY < 0) {
                            offsetY = 0;
                        }

                        if (offsetX + areaWidth > contentWidth) {
                            offsetX = contentWidth - areaWidth;
                        }
                        if (offsetY + areaHeight > contentHeight) {
                            offsetY = contentHeight - areaHeight;
                        }

                        // 更新Widget位置
                        area.css({"left": offsetX, "top": offsetY});

                        // 如果正在执行widget位置交换的动画，不需要再进行处理
                        if (animating) {
                            return false;
                        }

                        // 获取当前鼠标所在位置下的area
                        var x = event.pageX - contentOffset.left;
                        var y = event.pageY - contentOffset.top;
                        var target = me._getAreaByPoint(x, y);

                        // 如果目标为空，取消操作
                        if (target === null) {
                            if (moveTimer >= 0) {
                                window.clearTimeout(moveTimer);
                                moveTimer = -1;
                            }

                            return false;
                        }

                        // 如果在同一区域上移动鼠标，直接返回；否则启动延迟定时器，准备进行位置交换动画
                        if (lastTarget === target.attr('id')) {
                            return false;
                        }
                        else {
                            lastTarget = target.attr('id');

                            // 延迟100毫秒
                            if (moveTimer >= 0) {
                                window.clearTimeout(moveTimer);
                                moveTimer = -1;
                            }
                        }

                        // 鼠标移动进入某可交换的位置后，延迟50毫秒再执行交换动作
                        moveTimer = window.setTimeout(function () {
                            // 重置定时器
                            moveTimer = -1;

                            // 移动widget
                            // 先尝试进行相邻位置的切换，若失败，再尝试进行第二种方式的交换（非相邻，或跨列）
                            if (me._adjustPositionHandover(area, target, false, animateDuration) === false) {
                                if (me._adjustPositionExchange(area, target, false, animateDuration) === false) {
                                    return;
                                }
                            }
                            lastTarget = null;

                            // 置位布局变化标志，用于在拖动结束后，判断是否触发布局变化事件
                            me.__widgetLayoutChanged = true;

                            if (!placeHolder) {
                                return;
                            }

                            // 移动占位框到目标区域
                            var holderLeft;
                            var holderTop;
                            var holderWidth;
                            var holderHeight;

                            var point = me._calculateAreaPoint(area);
                            holderLeft = point.left;
                            holderTop = point.top;
                            holderWidth = areaWidth;
                            holderHeight = areaHeight;

                            // 移动占位框到目标位置
                            // 注：此动画的持续时长与交换动作的执行时长是相同的
                            placeHolder.animate({
                                'left': holderLeft + 'px',
                                'top': holderTop + 'px',
                                'width': holderWidth + 'px',
                                'height': holderHeight + 'px'
                            }, {
                                'duration': animateDuration,
                                'complete': function () {
                                    if (placeHolder) {
                                        placeHolder.externalWidth(holderWidth);
                                        placeHolder.externalHeight(holderHeight);
                                    }
                                }
                            });

                            // 设置动画执行标志，并在一段时间后清除
                            animating = true;
                            window.setTimeout(function () {
                                animating = false;
                            }, Math.ceil(animateDuration * 1.5));

                        }, 50);

                        return false;
                    }
                );
            },
            /**
             * @description Widget调整，交换方式，要求源和目标区组大小相同
             * @param {Object} srcArea 正在拖动的Widget容器
             * @param {Object} targetArea 目标Widget容器
             * @param {Boolean} test 只做测试，还是执行实际的修改位置操作
             * @param {Number} delay 执行修改位置操作时，动画时长
             * @returns {boolean} 是否可放置到目标位置
             * @private
             */
            _adjustPositionExchange: function (srcArea, targetArea, test, delay) {
                var me = this;
                var options = me.options;
                var area, widget;
                var areaInfo;
                var endRow, endCol;
                var offsetX, offsetY;
                var row, col, size = 0;

                if ($.isNull(srcArea) || $.isNull(targetArea)) {
                    return false;
                }

                // 区域基本信息
                var srcInfo = me._getAreaAttr(srcArea);
                var targetInfo = me._getAreaAttr(targetArea);

                // 条件：源和目标不能相同
                if (srcInfo.row === targetInfo.row && srcInfo.col === targetInfo.col) {
                    return false;
                }

                // 条件：目标有足够的位置放置源
                if (targetInfo.col + srcInfo.colSpan > options.columns ||
                    targetInfo.row + srcInfo.rowSpan > options.rows) {
                    return false;
                }

                // 计算目标区域面积
                endRow = targetInfo.row + srcInfo.rowSpan;
                endCol = targetInfo.col + srcInfo.colSpan;

                for (row = targetInfo.row; row < endRow; row++) {
                    for (col = targetInfo.col; col < endCol; col++) {
                        area = me._getAreaByPosition(row, col);
                        areaInfo = me._getAreaAttr(area);
                        widget = me._getWidgetByArea(area);

                        if (area === null || areaInfo === null) {
                            continue;
                        }

                        // 条件：目标所在位置不能有固定区域
                        if (widget && widget.options.fixed === true) {
                            return false;
                        }

                        // 条件：如果目标区域内有Area超出范围，不能放置
                        if (areaInfo.col + areaInfo.colSpan > endCol || areaInfo.row + areaInfo.rowSpan > endRow) {
                            return false;
                        }

                        // 累计面积
                        size += areaInfo.colSpan * areaInfo.rowSpan;
                    }
                }

                // 条件：目标区域应该是一个完整区域
                if (size !== srcInfo.rowSpan * srcInfo.colSpan) {
                    return false;
                }

                // 如果只进行测试，此处可以返回了
                if (test) {
                    return true;
                }

                // 移动目标到源位置
                offsetX = srcInfo.col - targetInfo.col;
                offsetY = srcInfo.row - targetInfo.row;

                for (row = targetInfo.row; row < endRow; row++) {
                    for (col = targetInfo.col; col < endCol; col++) {
                        area = me._getAreaByPosition(row, col);
                        areaInfo = me._getAreaAttr(area);

                        if (area === null || areaInfo === null) {
                            continue;
                        }

                        // 如果只是测试，不执行实际操作
                        if (!test) {
                            areaInfo.row += offsetY;
                            areaInfo.col += offsetX;
                            me._setAreaPosition(area, areaInfo.row, areaInfo.col, delay);
                        }
                    }
                }

                // 移动源到目标位置
                if (!test) {
                    srcInfo.row -= offsetY;
                    srcInfo.col -= offsetX;
                    me._setAreaPosition(srcArea, srcInfo.row, srcInfo.col, null);
                }

                // 操作成功，返回true
                return true;
            },
            /**
             * @description Widget调整，交换方式，要求源和目标相邻
             * @param {Object} srcArea 正在拖动的Widget容器
             * @param {Object} targetArea 目标Widget容器
             * @param {Boolean} test 只做测试，还是执行实际的修改位置操作
             * @param {Number} delay 执行修改位置操作时，动画时长
             * @returns {boolean} 是否可放置到目标位置
             * @private
             */
            _adjustPositionHandover: function (srcArea, targetArea, test, delay) {
                /* 屏蔽代码行数过多告警，不宜再拆 */
                /* jshint maxstatements:100 */
                var widget;
                var targetArea2, targetInfo2;
                var exTargetAreaList, exTargetInfoList;
                var i, width, height;

                if ($.isNull(srcArea) || $.isNull(targetArea)) {
                    return false;
                }

                // 区域基本信息
                var srcInfo = this._getAreaAttr(srcArea);
                var targetInfo = this._getAreaAttr(targetArea);

                // 条件：源和目标不能相同
                if (srcInfo.row === targetInfo.row && srcInfo.col === targetInfo.col) {
                    return false;
                }

                // 条件：目标不能为固定Widget
                widget = this._getWidgetByArea(targetArea);
                if (widget && widget.options.fixed === true) {
                    return false;
                }

                // 条件：不同行且不同列
                if (srcInfo.col !== targetInfo.col && srcInfo.row !== targetInfo.row) {
                    return false;
                }

                // 同列情况的判断
                if (srcInfo.col === targetInfo.col) {
                    exTargetAreaList = [];
                    exTargetInfoList = [];
                    width = targetInfo.colSpan;

                    // 条件：同列，但是宽度不同
                    if (srcInfo.colSpan !== targetInfo.colSpan) {
                        // 查找同行其它位置
                        for (i = targetInfo.col + targetInfo.colSpan; i < targetInfo.col + srcInfo.colSpan; i++) {
                            targetArea2 = this._getAreaByPosition(targetInfo.row, i);
                            targetInfo2 = this._getAreaAttr(targetArea2);

                            if (targetArea2 === null) {
                                continue;
                            }

                            // 条件：目标行所有area高度相同，行号相同
                            if (targetInfo2.row !== targetInfo.row ||
                                targetInfo2.rowSpan !== targetInfo.rowSpan) {
                                return false;
                            }

                            // 保存起来
                            exTargetAreaList.push(targetArea2);
                            exTargetInfoList.push(targetInfo2);
                            width += targetInfo2.colSpan;
                        }

                        // 条件：两行宽度不能对齐
                        if (width !== srcInfo.colSpan) {
                            return false;
                        }
                    }

                    // 条件：同列，但是不相邻
                    if (srcInfo.row + srcInfo.rowSpan !== targetInfo.row &&
                        targetInfo.row + targetInfo.rowSpan !== srcInfo.row) {
                        return false;
                    }

                    // 交换位置
                    if (!test) {
                        if (srcInfo.row > targetInfo.row) {
                            srcInfo.row = targetInfo.row;
                            targetInfo.row = srcInfo.row + srcInfo.rowSpan;
                        }
                        else {
                            targetInfo.row = srcInfo.row;
                            srcInfo.row = targetInfo.row + targetInfo.rowSpan;
                        }

                        this._setAreaPosition(srcArea, srcInfo.row, srcInfo.col, null);
                        this._setAreaPosition(targetArea, targetInfo.row, targetInfo.col, delay);

                        // 一换多的处理
                        if (exTargetAreaList.length > 0) {
                            for (i = 0; i < exTargetAreaList.length; i++) {
                                targetArea2 = exTargetAreaList[i];
                                targetInfo2 = exTargetInfoList[i];

                                targetInfo2.row = targetInfo.row;
                                this._setAreaPosition(targetArea2, targetInfo2.row, targetInfo2.col, delay);
                            }
                        }
                    }
                }

                // 同行情况的判断
                if (srcInfo.row === targetInfo.row) {
                    exTargetAreaList = [];
                    exTargetInfoList = [];
                    height = targetInfo.rowSpan;

                    // 条件：同行，但是高度不同
                    if (srcInfo.rowSpan !== targetInfo.rowSpan) {
                        // 查找同列其它位置
                        for (i = targetInfo.row + targetInfo.rowSpan; i < targetInfo.row + srcInfo.rowSpan; i++) {
                            targetArea2 = this._getAreaByPosition(i, targetInfo.col);
                            targetInfo2 = this._getAreaAttr(targetArea2);

                            if (targetArea2 === null) {
                                continue;
                            }

                            // 条件：目标行所有area宽度相同，列号相同
                            if (targetInfo2.col !== targetInfo.col ||
                                targetInfo2.colSpan !== targetInfo.colSpan) {
                                return false;
                            }
                            // 保存起来
                            exTargetAreaList.push(targetArea2);
                            exTargetInfoList.push(targetInfo2);
                            height += targetInfo2.rowSpan;
                        }

                        // 条件：两列高度不能对齐
                        if (height !== srcInfo.rowSpan) {
                            return false;
                        }
                    }

                    // 条件：同行，但是不相邻
                    if (srcInfo.col + srcInfo.colSpan !== targetInfo.col &&
                        targetInfo.col + targetInfo.colSpan !== srcInfo.col) {
                        return false;
                    }

                    // 交换位置
                    if (!test) {
                        if (srcInfo.col > targetInfo.col) {
                            srcInfo.col = targetInfo.col;
                            targetInfo.col = srcInfo.col + srcInfo.colSpan;
                        }
                        else {
                            targetInfo.col = srcInfo.col;
                            srcInfo.col = targetInfo.col + targetInfo.colSpan;
                        }

                        this._setAreaPosition(srcArea, srcInfo.row, srcInfo.col, null);
                        this._setAreaPosition(targetArea, targetInfo.row, targetInfo.col, delay);

                        // 一换多的处理
                        if (exTargetAreaList.length > 0) {
                            for (i = 0; i < exTargetAreaList.length; i++) {
                                targetArea2 = exTargetAreaList[i];
                                targetInfo2 = exTargetInfoList[i];

                                targetInfo2.col = targetInfo.col;
                                this._setAreaPosition(targetArea2, targetInfo2.row, targetInfo2.col, delay);
                            }
                        }
                    }
                }

                // 返回成功
                return true;
            },
            /**
             * @description 设置容器新位置
             * @param {Object} areaEl 容器对象
             * @param {Number} row 新行号
             * @param {Number} col 新列号
             * @param {Number} delay 动画持续时长
             * @private
             */
            _setAreaPosition: function (areaEl, row, col, delay) {
                var me = this;
                var widget;
                var point;

                // 设置区域位置
                areaEl.attr(attrRow, row).attr(attrCol, col);

                if (delay !== null) {
                    point = me._calculateAreaPoint(areaEl);
                    areaEl.animate({
                        'left': point.left,
                        'top': point.top
                    }, {
                        duration: delay
                    });
                }

                // 调整widget属性
                widget = me._getWidgetByArea(areaEl);
                if (widget) {
                    widget.options.row = row;
                    widget.options.column = col;
                }
            },
            /**
             * @description 计算容器在组件父容器中的偏移
             * @param {Object} areaEl 容器对象
             * @returns {Object} 偏移量,{left, top}
             * @private
             */
            _calculateAreaPoint: function (areaEl) {
                var me = this;
                var options = me.options;

                if ($.isNull(areaEl)) {
                    return null;
                }

                var columns = options.columns;
                var rows = options.rows;
                var contentWidth = me.contentEl.width();
                var contentHeight = me.contentEl.height();
                var width = Math.floor((contentWidth - (columns - 1) * options.padding) / columns);
                var height = Math.floor((contentHeight - (rows - 1) * options.padding) / rows);
                var areaInfo = me._getAreaAttr(areaEl);

                var left = areaInfo.col * (width + options.padding);
                var top = areaInfo.row * (height + options.padding);

                return {'left': left, 'top': top};
            },
            /**
             * @description 获取容器对象的一些属性
             * @param {Object} areaEl 容器对象
             * @returns {Object} row/col/rowSpan/colSpan/left/top/width/height
             * @private
             */
            _getAreaAttr: function (areaEl) {
                if ($.isNull(areaEl)) {
                    return null;
                }

                var row = parseInt(areaEl.attr(attrRow), 10);
                var col = parseInt(areaEl.attr(attrCol), 10);
                var rowSpan = parseInt(areaEl.attr(attrRowSpan), 10);
                var colSpan = parseInt(areaEl.attr(attrColSpan), 10);
                var left = parseInt(areaEl.css('left'), 10) || 0;
                var top = parseInt(areaEl.css('top'), 10) || 0;
                var width = areaEl.externalWidth();
                var height = areaEl.externalHeight();


                return {
                    'row': row,
                    'col': col,
                    'rowSpan': rowSpan,
                    'colSpan': colSpan,
                    'left': left,
                    'top': top,
                    'width': width,
                    'height': height
                };
            },
            /**
             * @description 根据实际像素偏移位置，获得对应的容器对象
             * @param {Number} x 在组件容器中的X轴偏移
             * @param {Number} y 在组件容器中的Y轴偏移
             * @returns {Object} 容器对象
             * @private
             */
            _getAreaByPoint: function (x, y) {
                var me = this;
                var divEl;
                var areaEl = null;
                var pos;

                // 根据座标得到Widget容器对象
                me.contentEl.children().each(function (index, div) {
                    divEl = $(div);
                    pos = divEl.position();

                    if (divEl.hasClass(containerDraggingClass) || !divEl.hasClass(containerClass)) {
                        return null;
                    }

                    if (x >= pos.left && x <= pos.left + divEl.externalWidth() &&
                        y >= pos.top && y <= pos.top + divEl.externalHeight()) {
                        areaEl = $(div);
                    }
                });

                return areaEl;
            },
            /**
             * @description 根据行号、列号取得容器对象
             * @param {Number} row 行号
             * @param {Number} col 列号
             * @returns {Object} 容器对象
             * @private
             */
            _getAreaByPosition: function (row, col) {
                var me = this;
                var divEl;
                var areaEl = null;

                // 根据行号、列号得到Widget容器对象
                me.contentEl.children().each(function (index, div) {
                    divEl = $(div);

                    if (!divEl.hasClass(containerClass)) {
                        return null;
                    }

                    if (divEl.attr(attrRow) === row + '' && divEl.attr(attrCol) === col + '') {
                        areaEl = $(div);
                    }
                });

                return areaEl;
            },
            /**
             * @description 根据Widget对象，取得容器对象
             * @param {Object} widget widget对象
             * @returns {Object} 容器对象
             * @private
             */
            _getAreaByWidget: function (widget) {
                var me = this;
                if ($.isNull(widget)) {
                    return null;
                }

                var row = widget.options.row + '';
                var col = widget.options.column + '';
                var divEl;
                var areaEl = null;

                // 根据行号、列号得到Widget容器对象
                me.contentEl.children().each(function (index, div) {
                    divEl = $(div);

                    if (divEl.attr(attrRow) === row && divEl.attr(attrCol) === col) {
                        areaEl = $(div);
                    }
                });

                return areaEl;
            },
            /**
             * @description 根据行号、列号取得Widget对象
             * @param {Number} row 行号
             * @param {Number} col 列号
             * @returns {Object} Widget对象
             * @private
             */
            _getWidgetByPosition: function (row, col) {
                var me = this;
                var item;

                // 根据行、列号查找widget
                for (var i = 0; i < me.options.items.length; i++) {
                    item = me.options.items[i];
                    if (item.options && item.options.row === row && item.options.column === col) {
                        return item;
                    }
                }

                return null;
            },
            /**
             * @description 根据容器对象，取得Widget对象
             * @param {Object} divEl 容器对象
             * @returns {Object} Widget对象
             * @private
             */
            _getWidgetByArea: function (divEl) {
                var me = this;
                var item;

                if ($.isNull(divEl)) {
                    return null;
                }

                // 取容器的id
                var id = divEl.attr('id');

                // 根据id查找widget
                for (var i = 0; i < me.options.items.length; i++) {
                    item = me.options.items[i];
                    if (item.options && item.options.renderTo === id) {
                        return item;
                    }
                }

                return null;
            },
            /**
             * 测试指定目标位置的情况
             * @param {Number} row 行号
             * @param {Number} col 列号
             * @returns {Number} 目标类型。0：空白，1：widget，2：widget（非起始位置），-1：超出组件区域
             * @private
             */
            _detectByPosition: function (row, col) {
                // 超出范围
                if (row < 0 || row >= this.options.rows ||
                    col < 0 || col >= this.options.columns) {
                    return -1;
                }

                // 取区域
                var area = this._getAreaByPosition(row, col);
                var widget = this._getWidgetByArea(area);

                // 有widget
                if (area && widget) {
                    return 1;
                }

                // 空白
                if (area) {
                    return 0;
                }

                // 否则为widget的非起始位置（遮挡区域）
                return 2;
            },
            /**
             * @description 渲染Widget对象
             * @param {Object} widget 待渲染的Widget对象
             * @returns {String} 渲染后的容器的id，失败则返回null
             * @private
             */
            _renderWidget: function (widget) {
                var me = this;
                var id = null;

                if ($.isNull(widget)) {
                    return null;
                }

                // 修正
                if ($.isNull(widget.options.rowSpan)) {
                    widget.options.rowSpan = 1;
                }
                if ($.isNull(widget.options.colSpan)) {
                    widget.options.colSpan = 1;
                }

                // 取得渲染区域
                var area = me._getAreaByWidget(widget);
                if (area === null) {
                    me._error("widget position is invalid");
                    return null;
                }

                id = area.attr("id");
                if ($.isNull(id)) {
                    return null;
                }

                // remove empty sign
                area.text("").css({"font-size": "", "line-height": ""});

                // 渲染
                if ($.isFunction(widget.render)) {
                    area.attr(attrRowSpan, widget.options.rowSpan)
                        .attr(attrColSpan, widget.options.colSpan)
                        .show();
                    widget.render(id);

                    // 设置拖动区域鼠标状态
                    if (me.options.editable) {
                        area.find("." + me.options.widgetTitleClass).addClass(draggableClass);
                    }
                }
                else {
                    return null;
                }

                return id;
            },
            /**
             * @description 销毁组件
             * @private
             */
            _destroyWidget: function () {
                var row, col;
                // 销毁子组件
                for (row = 0; row < this.options.rows; row++) {
                    for (col = 0; col < this.options.columns; col++) {
                        this.removeWidget(row, col);
                    }
                }

                this._super();
            },

            /**
             * @description 获取当前主容器下，各个1*1格子的大小
             * @returns {Object} {width: *, height: *}
             * @private
             */
            _getCellSize: function () {
                var me = this;
                var width, height;

                var options = me.options;
                var columns = options.columns;
                var rows = options.rows;

                var borderWidth = me.contentEl.externalWidth() - me.contentEl.width();
                var borderHeight = me.contentEl.externalHeight() - me.contentEl.height();
                var contentWidth = me.containerEl.width() - borderWidth;
                var contentHeight = me.containerEl.height() - borderHeight;

                if (this.options.fitMode === false) {
                    // 正常模式
                    width = Math.floor((contentWidth - (columns - 1) * options.padding) / columns);
                    height = Math.floor(width * GOLDEN_RATIO);
                }
                else {
                    // fit模式
                    if (contentWidth * GOLDEN_RATIO > contentHeight) {
                        // 高度不足，以高度为准进行计算
                        height = Math.floor((contentHeight - (rows - 1) * options.padding) / rows);
                        width = Math.floor(height / GOLDEN_RATIO);
                    }
                    else {
                        // 宽度不足，以宽度为谁进行计算
                        width = Math.floor((contentWidth - (columns - 1) * options.padding) / columns);
                        height = Math.floor(width * GOLDEN_RATIO);
                    }
                }

                return {width: width, height: height};
            },
            /**
             * @description widget布局改变后，执行回调函数
             * @private
             */
            _widgetLayoutChanged: function () {
                var me = this;

                if (me.handlers && $.isFunction(me.handlers.widgetlayoutchanged)) {
                    me.handlers.widgetlayoutchanged();
                }

                if ($.isFunction(me.options.widgetLayoutChanged)) {
                    me.options.widgetLayoutChanged();
                }
            },
            /**
             * @event
             * @description 布局变化事件
             * @name Sweet.portal.GridPortal#widgetlayoutchanged
             */
            widgetlayoutchanged: function () {
                $.noop();
            }
        });

    /**
     * @description grid portal容器
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.container
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * </pre>
     * @example
     * 创建向导布局容器：
     * var sweetHPanel = Sweet.container.GridPortal();
     */
    Sweet.portal.GridPortal = $.sweet.widgetContainerGridPortal;
}(jQuery));

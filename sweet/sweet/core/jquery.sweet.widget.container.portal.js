/**
 * @fileOverview  
 * <pre>
 * 容器组件-portal
 * 2013/2/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined)
{
    var uuid = 0,
            sweetPortalColumnClass = "sweet-portal-column",
            sweetPortalPlaceHolderClass = "sweet-portal-place-holder",
            sweetProtalBlockClass = "sweet-portal-column-block";

    $.widget("sweet.widgetContainerPortal", $.sweet.widgetContainer, /** @lends Sweet.container.Portal.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-portal]:",
        type: "Portal",
        options: /** @lends Sweet.container.Portal.prototype*/{
            /**
             * 列数设置
             * @type {Number}
             * @default 1
             */
            columns: 1,
            /**
             * 容器内组件
             * @type {Array}
             */
            items: []
        },
        eventNames: {
            "ds_node_minimize": "子组件最小化事件",
            "ds_node_maximize": "子组件最大化事件",
            "ds_node_close": "子组件关闭事件"
        },
        _addEventHandler: function()
        {
            var me = this;
            $(me.containerEl).on('ds_node_minimize', function()
            {
            }).on('ds_node_maximize', function()
            {
            }).on('ds_node_close', function()
            {
            });
        },
        /**
         * @private
         * @description 重绘组件
         */
        _doLayout: function() {
            var me = this;
            //渲染前禁止进入
            if (!me.rendered)
            {
                return;
            }
            var options = me.options,
                    columns = options.columns,
                    widgetWidth,
                    contentWidth,
                    contentHeight,
                    maxHeight = 0,
                    maxWidth = 0;

            contentWidth = me.containerEl.width();
            contentHeight = me.containerEl.height();
            widgetWidth = Math.floor((contentWidth - 6 * columns - 20) / columns);

            $.each(me.columnEls, function(index, obj) {
                obj.css({"padding": '5px', "width": widgetWidth});
                if (obj.externalHeight() > maxHeight) {
                    maxHeight = obj.externalHeight();
                }
                maxWidth += obj.externalWidth();
            });

            $.each(me.widgets, function(index, obj) {
                obj.widgetContainer.css({
                    'margin-bottom': '5px',
                    'width': '100%',
                    'height': '300px'
                });
            });

            if (maxHeight > contentHeight) {
                me.containerEl.css("overflow-y", "auto");
            }
            else {
                me.containerEl.css("overflow-y", "hidden");
            }

            if (maxWidth > contentWidth) {
                me.containerEl.css("overflow-x", "auto");
            }
            else {
                me.containerEl.css("overflow-x", "hidden");
            }

        },
        /**
         * @private
         * @description 组件渲染
         */
        _widgetRender: function() {
            var me = this;

            for (var i = 0; i < me.columnEls.length; i++)
            {
                me.columnEls[i].appendTo(me.containerEl);
            }

            $("." + sweetPortalColumnClass).sortable({
                connectWith: "." + sweetPortalColumnClass,
                placeholder: sweetPortalPlaceHolderClass,
                forcePlaceholderSize: true,
                forceHelperSize: true
            });

            $("." + sweetPortalColumnClass).disableSelection();
            me._renderItems();
            me._addEventHandler();
        },
        /**
         * @private
         * @description 创建Portal容器
         */
        _createContainer: function() {
            var me = this,
                    options = me.options,
                    items = options.items;
            me.items = items;
            me._createColumnEls();
            me._createItems(items);
        },
        //column容器需要优先创建
        _createColumnEls: function()
        {
            var me = this,
                    options = me.options,
                    columns = options.columns,
                    columnEl,
                    columnEls = [];

            //保证最少存在一个column
            if (columns <= 0) {
                columns = 1;
            }
            for (var i = 0; i < columns; i++)
            {
                columnEl = $("<div>").addClass(sweetPortalColumnClass);
                columnEls.push(columnEl);
            }
            me.columnEls = columnEls;
        },
        _createItems: function(items)
        {
            if ($.isNull(items))
            {
                return;
            }
            var me = this,
                    options = me.options,
                    columnEl,
                    columnEls = me.columnEls,
                    columnLength = me.columnEls.length,
                    itemLength = items.length,
                    widget,
                    widgets = [],
                    nodeList = [],
                    xIndex = -1;

            options.items = options.items.concat(items);
            for (var i = 0; i < itemLength; i++)
            {
                //需要考虑到指定columnIndex与rowIndex的情况
                widget = items[i];
                if (widget.options.hasOwnProperty('columnIndex'))
                {
                    xIndex = widget.options.columnIndex;
                }
                //如果不存在xIndex或yIndex，按照顺序摆放
                //避免xIndex数据不合法的情况，在这里做校验
                if (-1 === xIndex)
                {
                    xIndex = i % columnLength;
                }
                else
                {
                    xIndex = xIndex >= columnLength ? columnLength - 1 : xIndex;
                }
                //nodeList用于临时保存节点
                if (!nodeList[xIndex])
                {
                    nodeList[xIndex] = [];
                }
                nodeList[xIndex].push(widget);
            }
            //如果存在下标不连续的情况，需要下标前移
            for (var j = 0; j < columnLength; j++)
            {
                //避免出现列中不存在元素的情况
                if (!nodeList[j]) {
                    continue;
                }
                //默认使用的排序方法
                nodeList[j].sort(me._blockSortFunction);
                columnEl = columnEls[j];
                for (var k = 0; k < nodeList[j].length; k++)
                {
                    var item = {};
                    item.id = 'sweet-container-portal-' + uuid++;
                    item.widgetContainer = $('<div>').addClass(sweetProtalBlockClass);
                    item.widgetContainer.attr('id', item.id);
                    item.widget = nodeList[j][k];
                    columnEl.append(item.widgetContainer);
                    widgets.push(item);
                }
            }
            me.widgets = widgets;
        },
        addItems: function(items)
        {
            this.items = items;
            this._createItems(items);
            this._renderItems();
        },
        /**
         * 有可能替换排序规则，作为方法开放
         * 默认排序方法：
         *  如果子组件存在columnIndex和rowIndex,按照rowIndex进行排序
         *  xIndex有可能出现异常数据，导致同一个column中存在不同columnIndex的元素，把columnIndex大的放置在后方
         */
        _blockSortFunction: function(obj1, obj2)
        {
            var result = 0;
            //处理数据不完整的情况
            if (obj1.options.hasOwnProperty('rowIndex') && obj1.options.hasOwnProperty('columnIndex') &&
                    obj2.options.hasOwnProperty('rowIndex') && obj2.options.hasOwnProperty('columnIndex'))
            {
                var obj1Row = obj1.options.rowIndex,
                        obj1Column = obj1.options.columnIndex,
                        obj2Row = obj2.options.rowIndex,
                        obj2Column = obj2.options.columnIndex;

                //先比较Column
                if (obj1Column === obj2Column)
                {
                    if (obj1Row > obj2Row) {
                        return 1;
                    }
                    else if (obj1Row < obj2Row) {
                        return -1;
                    }
                }
                else
                {
                    if (obj1Column > obj2Column) {
                        return 1;
                    }
                    else if (obj1Column < obj2Column) {
                        return -1;
                    }
                }
            }
            return result;
        },
        _renderItems: function()
        {
            var me = this;
            $.each(me.widgets, function(index, obj) {
                obj.widget.render(obj.id);
            });
        }
    });

    /**
     * @description portal容器
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
     * var sweetHPanel = Sweet.container.Portal({
     * });
     */
    Sweet.container.Portal = $.sweet.widgetContainerPortal;
}(jQuery));

/**
 * @fileOverview  
 * <pre>
 * 表格组件
 * 2013/1/31
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var checkboxUncheckdClass = "sweet-form-checkbox-unchecked",
            checkboxCheckdClass = "sweet-form-checkbox-checked",
            gridHeaderClass = "sweet-grid-header",
            contentElClass = "sweet-grid-content",
            gridHeaderBottomClass = "sweet-grid-header-bottom",
            resizeElClass = "sweet-grid-resize",
            selectNoneClass = "sweet-select-none",
            actionBarSelectColumnClass = "select-column",
            actionBarMultiSortClass = "multi-sort",
            actionBarSecondStatClass = "second-stat",
            actionBarClearFilterClass = "clear-filter",
            actionBarExportClass = "export",
            actionBarExportCsvClass = "csv",
            actionBarExportXlsClass = "xls",
            actionBarExportPdfClass = "pdf",
            actionBarExportLiCsvClass = "li-csv",
            actionBarExportLiXlsClass = "li-xls",
            actionBarExportLiPdfClass = "li-pdf",
            gridCheckboxClass = "sweet-grid-checkbox",
            gridHeaderTdClass = "sweet-grid-header-table-td",
            gridHeaderTdCommonClass = "sweet-grid-header-table-td-common",
            gridHeaderTdHoverClass = "sweet-grid-header-table-td-common-hover",
            gridHeaderSortAscClass = "sweet-grid-header-sort-asc",
            gridHeaderSortDescClass = "sweet-grid-header-sort-desc",
            gridHeaderDragClass = "sweet-grid-resize-drag",
            gridHeaderDownClass = "sweet-grid-resize-down",
            gridHeaderTextClass = "text",
            gridHeaderTextHoverClass = "text-hover",
            gridHeaderFilterClass = "sweet-grid-header-filter",
            gridHeaderFilterPicClass = "sweet-grid-header-filter-pic",
            gridHeaderFilterBgClass = "sweet-list-list-con",
            gridHeaderFilterPadClass = "sweet-grid-header-filter-pad",
            gridHeaderFilterOneClass = "filter-one",
            gridHeaderFilterTwoClass = "filter-two",
            gridHeaderFilterSuffix = "-grid-filter",
            gridHeaderFilterBtnSuffix = "-grid-filter-btn",
            gridSNClass = "sweet-grid-sn",
            gridSpecColumnClass = "sweet-grid-spec-column",
            gridContentMenuClass = "sweet-grid-content-menu",
            gridContentTableClass = "sweet-grid-content-table",
            gridContentTrClass = "sweet-grid-content-tr",
            gridContentTdClass = "sweet-grid-content-td",
            gridContentDataLeftClass = "sweet-grid-content-data-left",
            gridContentDataRightClass = "sweet-grid-content-data-right",
            gridContentDataCenterClass = "sweet-grid-content-data-center",
            gridContentRowSelectedClass = "sweet-grid-content-row-selected",
            gridContentTreeDivClass = "sweet-grid-content-td-tree",
            gridContentTreeClass = "sweet-grid-content-td-tree-a",
            gridContentTreePlusClass = "sweet-grid-content-td-plus",
            gridContentTreeMinusClass = "sweet-grid-content-td-minus",
            gridContentTreeBlankClass = "sweet-grid-content-td-blank",
            gridContentTreeSpaceClass = "sweet-grid-content-td-space",
            gridContentTdDataSuffix = "-grid-content-data-id",
            gridContentEditClass = "sweet-common-opercolumn-edit",
            gridContentModifyClass = "sweet-common-opercolumn-modify",
            gridContentDeleteClass = "sweet-common-opercolumn-delete",
            gridContentCloseClass = "sweet-common-opercolumn-close",
            gridContentPauseClass = "sweet-common-opercolumn-pause",
            gridContentStartClass = "sweet-common-opercolumn-start",
            gridContentResetClass = "sweet-common-opercolumn-reset",
            gridContentDetailClass = "sweet-common-opercolumn-detail",
            gridContentConfirmClass = "sweet-common-opercolumn-confirm",
            gridColumnPrefix = "sweet-grid-column-",
            gridPagingClass = "sweet-grid-paging",
            gridPagingInnerClass = "sweet-grid-paging-inner",
            gridPagingDropDownElClass = "sweet-grid-paging-dropDown",
            gridPagingPrevClass = "sweet-grid-paging-prev",
            gridPagingANumClass = "sweet-grid-paging-num",
            gridPagingNextClass = "sweet-grid-paging-next",
            gridPagingGoClass = "sweet-grid-paging-go",
            gridPagingCurrentElClass = "current",
            pageRowChoosedClass = "choosed",
            gridPagingComboboxType = ["row", "page"],
            gridPagingTextPos = ["left", "right"],
            gridPagingDefaultNum = 5, // 中间预留数字按钮个数
            defaultColumnHeight = 30, // 默认表格高度
            i18n = Sweet.core.i18n.grid,
            exportTypeText = Sweet.core.i18n.exportType,
            dataType = Sweet.constants.dataType,
            symbol = Sweet.constants.symbol,
            exportTypeConf = Sweet.constants.exportType,
            eventNamePageClick = "pageClick",
            eventNameCellClick = "cellClick",
            eventNameRowClick = "rowClick",
            eventNameRowDBClick = "rowDblClick",
            eventNameCheckBoxClick = "checkBoxClick",
            eventNameMenuClick = "menuClick",
            eventNameTreeExpand = "treeExpand",
            eventNameBeforeSetData = "beforeSetData",
            eventNameAfterSetData = "afterSetData",
            eventNameExport = "export",
            timerSuffix = "sweet-grid-content-timer", // 内容区定时器名称
            trColor = {"red": "red", "orange": "orange", "yellow": "yellow", "green": "green", "blue": "blue",
                "indigo": "indigo", "purple": "purple"},
            tableTdPadding = 10, // 表格内部单元格间间隔
            snWidth = 80,
            checkboxWidth = 23,
            scrollWidth = 18,
            treeBlankWidth = 19,
            minTdWidth = 40,
            maxColumnLength = 200,
            minColumnWidth = 120,
            ncWidth = -1, //用户没有配置列宽度时，内部标志的列
            tdBorder = 1;

    $.widget("sweet.widgetBigGrid", $.sweet.widget, /** @lends Sweet.grid.BigGrid.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-BigGrid]",
        defaultElement: "<div>",
        type: "biggrid",
        eventNames: /** @lends Sweet.grid.BigGrid.prototype*/{
            /**
             * @event
             * @description 翻页事件
             * @param {Object} data 翻页数据信息
             */
            pageClick: "翻页事件",
            /**
             * @event
             * @description 单元格点击事件
             * @param {Object} data 单元格数据信息
             */
            cellClick: "单元格点击事件",
            /**
             * @event
             * @description 行点击事件
             * @param {Object} data 行数据信息
             */
            rowClick: "行点击事件",
            /**
             * @event
             * @description 行双击事件
             * @param {Object} data 行数据信息
             */
            rowDblClick: "行双击事件",
            /**
             * @event
             * @description 树节点展开事件
             * @param {Object} data 树节点数据信息
             */
            treeExpand: "树节点展开事件",
            /**
             * @event
             * @description 复选框点击事件
             * @param {Object} data 复选框数据信息
             */
            checkBoxClick: "复选框点击事件",
            /**
             * @event
             * @description 菜单点击事件
             * @param {Object} data 菜单数据信息
             */
            menuClick: "菜单点击事件",
            /**
             * @event
             * @description setData前触发事件
             * @param {Object} data setData前触发数据信息
             */
            beforeSetData: "setData前触发事件",
            /**
             * @event
             * @description setData后触发事件
             * @param {Object} data setData后触发数据信息
             */
            afterSetData: "setData后触发事件",
            /**
             * @event
             * @description 导出事件
             * @param {Object} data 导出数据信息
             */
            export: "导出事件",
            /**
             * @event
             * @description 排序点击事件
             * @param {Object} data 排序数据信息
             */
            sort: "排序事件",
            /**
             * @event
             * @description 过滤点击事件
             * @param {Object} data 过滤数据信息
             */
            filter: "过滤事件",
            /**
             * @event
             * @description 多列排序事件
             * @param {Object} data 过滤数据信息
             */
            multiOrders: "多列排序事件",
            /**
             * @event
             * @description 清除所有过滤的事件
             * @param {Object} data 过滤数据信息
             */
            clearAllFilters: "清除所有过滤的事件"
        },
        // grid组件公共配置参数
        options: /** @lends Sweet.grid.BigGrid.prototype*/{
            /**
             * @description 表格宽度
             * @type {String/Number}
             * @default "100%"
             */
            width: "100%",
            /**
             * @description 表格高度
             * @type {String/Number}
             * @default 300px
             */
            height: 300,
            /**
             * @description 
             * <pre>
             * 表格数据，数据格式为：
             * {
             *     columns:[
             *         {                                    //列信息的配置
             *             header:"Name1",                  //列名
             *             name: "name1",                   //列名称，或行数据时使用
             *             width: 100,                      //宽度
             *             height: 23,                      //高度
             *             sortable: true/false,            //是否支持排序，默认都不支持
             *             dataType:"string",               //数据类型.string:字符串;date:日期;number:数值型;bool:布尔型
             *                                              //  number类型右对齐，其余左对齐，align属性优先
             *             align: "left",                   //表格内容对齐方式. left:左对齐;right:右对齐;center:居中对齐
             *             filter:true/false,               //是否过滤,除去日期，默认都不过滤
             *             filterType:'string',             //过滤类型.string:字符串;date:日期;list:复选框;number:关系表达式;
             *                                              //  bool:true/false
             *             useDSTutcOrder : string,         //专门为夏令时在前台排序时所使用的隐藏utc字段的name
             *             filterList:[],                   //如果filtertype为list时的值
             *             hidden：true/false,              //隐藏列时所用
             *             enableHdMenu: true/false,        //列是否可隐藏，默认true
             *             hiddenForever : true/false,      //列是否永久隐藏(这种列不出现在列选择和多列排序中)，默认false
             *             renderer: function,              //用于加工单元格的原始数据，返回给表格呈现
             *             rendererArr: Object,             //加工单元格调用的函数，目前只用户给生成的编辑、删除、修改图标加事件 
             *                                              //  {eidt: Function, delete: Function, ...}
             *             unit: 'percent',                 //单位
             *             tip: true/false,                 //单元格是否有提示，默认没有，如果使用renderer属性，该配置不生效
             *             tooltip: "",                     //表格列头提示信息
             *             menus:[
             *                 {                            //点出右键菜单时的配置，即钻取时用到
             *                     text: 'item1',           //此菜单项显示的文本
             *                     value: 'value1',         //此菜单项的value
             *                     children: [...]          //此菜单项的子菜单
             *                 },
             *                     ...
             *             ],
             *             beforeShowMenu : Function,       //在显示菜单前的回调函数，例如同一列中，有的数据需要钻取，有的不需要(成功率100%，失败率为0)
             *             itemClick: Function,             //菜单点击事件
             *             children: [
             *                 {                            //表头分层时使用，具体的分层的列信息
             *                     header:"Name1",          //列名
             *                     sortable:true/false,     //是否支持排序，默认都不支持
             *                     dataType:"string",       //数据类型
             *                     ...
             *                     与上面的列信息一样，表示的是子列的信息，也可能再分层，可以再设置colspan和children
             *                 },
             *                 ...
             *             ]
             *         },
             *         ...
             *     ],					
             *     data:[                               //呈现的数据
             *         {value1:"23", value2:"56", ...},
             *         {value1:"567", value2:"122", ...},
             *         ...
             *     ],
             *     total : 500,                         //所有行数据的总和
             *     resizable: true/false,               //列宽是否可调整，默认可调整
             *     checkbox:true/false,                 //是否显示复选框
             *     selectEvent : "click/dbclick",       //选择行时的事件
             *     sn:true/false,                       //是否显示序号
             *     selectColumn,                        //是否显示列选择
             *     multiColumnSort,                     //是否显示多列排序
             *     multiSortColumnsArr,                 //如果用户想自己定义多列排序的列，此值可设置，数组，和columns相同，但不能有隐藏的配置信息
             *     secondaryStat,                       //是否显示二次统计
             *     statParams,                          //二次统计的配置属性，主要三个：dims(维度)， indicators(指标)， statFun(点击统计时的回调函数)
             *     clearFilters,                        //是否显示清除所有过滤
             *     export,                              //导出
             *     exportType: ["csv", "xls", "pdf"]    //导出类型，export为true时才生效
             * }
             * </pre>
             * @type {Object}
             */
            data: {},
            /**
             * 列头的宽度是否自适应，默认设置为true,表示宽度自适应，如果同时在columns中设置了width，width值优先，计算列宽度时
             * 的原则：(总宽度-用户列中设置的width总和)/没有设置width的列个数 < 120px ? 120px : (总宽度-用户列中设置的width总和)/没有设置width的列个数
             * 如果设置为false，表示需要使用人员自己设置每一个表头的宽度，如果不设置，则默认为120px
             * @type boolean
             * @default true
             */
            autoColumnWidth: true,
            /**
             * 拖动垂直滚动条去渲染表格内容前触发的回调函数
             * @type function
             * @default $.noop
             */
            beforeScroll : $.noop,
            /**
             * 拖动垂直滚动条去渲染表格内容之后触发的回调函数
             * @type function
             * @default $.noop
             */
            afterScroll : $.noop
        },
        /**
         * @description 配置二次统计参数：{dims:[],indicators:[], statFun: function(点击统计时的回调函数)}
         * @param {Object} cfg 配置二次统计组件时传的参数，主要包含三个必选：dims(维度)， indicators(指标)， statFun(点击统计时的回调函数)
         */
        setSecondaryStatConfig : function(cfg){
            var me = this;
            if(me.options.data && me.options.data.secondaryStat){
                me.options.data.statParams = cfg;
            }
        },
        /**
         * @description 给表格重新设置值，表格进行重绘
         * @param {Object} data 设置值，包括表格列描述和表格数据
         */
        setData: function(data) {
            if ($.isNull(data)) {
                return;
            }

            var me = this;

            me._triggerHandler(null, eventNameBeforeSetData);

            if ($.isArray(data)) {
                me.options.data = $.extend({}, me.options.data, {"data": data});
            } else {
                me.options.data.data = [];     // 每次设置数据时，data不需要保留
                if (data.columns) {
                    me.options.data.columns = [];
                }
                me.options.data = $.extend(true, {}, me.options.data, data);
            }
            me._createGridWidget();
            me._render(me.options.renderTo);
            me._doLayout();
            //只有表头发生改变和第一次进入时，滚动条在最左边
            if(me.gridScrollLeftFlag === 0){
                me.gridScrollLeft = 0;
                me.gridScrollLeftFlag++;
                me.contentEl.scrollLeft(me.gridScrollLeft);
            } else {
                me.contentEl.scrollLeft(me.gridScrollLeft);
            }
        },
        /**
         * @description 设置表格树，展开后树节点数据
         * @param {Object} data 数据
         */
        setTreeData: function(data) {
            var me = this;
            var tempData = data;
            if (!$.isArray(data)) {
                tempData = data.data;
            }
            me.tempTreeData = me._toJson(tempData).reverse();
            me.tempTreeDataIndex = 0;
            // 将数据放入this.treeData中
            me.treeData = me.treeData.concat(me.tempTreeData);
            // 添加rowId
            me._addRowId(me.treeData);
            me.timerGridTreeContent = me.options.id + "-tree-" + timerSuffix;
            // 启动定时器，加载表格树节点数据
            Sweet.Task.Timeout.start({
                id: me.timerGridTreeContent,
                run: me._buildGridTreeContent,
                scope: me,
                interval: 10
            });
        },
        loadingMask : function(){
            var me = this;
            if(me.loadEl){
                me.loadEl.show().sweetMask();
            }
        },
        loadingMaskVisible : function(){
            var me = this,
                    visible = false;
            if(me.loadEl && me.loadEl.is(":visible")){
                visible = true;
            }
            
            return visible;
        },
        unLoadingMask : function(){
            var me = this;
            if(me.loadEl){
                me.loadEl.unSweetMask();
                me.loadEl.hide();
            }
        },
        /**
         * @description 获取行数据。如果row为空，返回所有行数据，不为空，返回指定行数据
         * @param {Number} row 行数，从0开始
         * @return {Array} 返回行数据
         */
        getRowValue: function(row) {
            if ("number" !== $.type(row)) {
                this._error("getRowValue() The input parameter is not a number.");
                return;
            }

            var me = this;
            var data = me.options.data.data;

            if ($.isNull(row)) {
                return $.objClone(data);
            }

            if (0 > row || (data && data.length < row)) {
                return;
            }
            return $.objClone(data[row]);
        },
        /**
         * @description 获取选中行数据
         * @return {Array} 返回选中行数据
         */
        getSelectedValue: function() {
            /**
             * @private
             * @description 对象转换数组
             * @param {Object} obj 对象
             * @return {Array} 返回数组
             */
            function objToArray(obj) {
                if ($.isNull(obj)) {
                    return [];
                }
                var tempArr = [];
                $.each(obj, function(id, val) {
                    tempArr.push(val);
                });

                return tempArr;
            }

            var me = this,
                    data = objToArray(me.selectedData),
                    treeData = objToArray(me.selectedTreeData);

            return $.objClone(data.concat(treeData));
        },
        /**
         * @description 插入一行或多行数据，该函数不能同store一起使用
         * @param {Object/Array} data 数据
         * @param {Boolean} before 是否向前追加，默认向前
         */
        insertRows: function(data, before) {
            if ($.isNull(data)) {
                this._error("insertRows() The input data is null.");
                return;
            }
            var me = this,
                    tempData = $.objClone(data);
            before = before || true;

            if (!$.isArray(tempData)) {
                tempData = [tempData];
            }

            me._buildInsertGridContent(tempData, before);
        },
        /**
         * @description 更新表格指定行数据
         * @param {Object/Array} data 待更新数据，格式[
         *      {
         *          "row": ,        // 行号
         *          "data": {},     // 数据，由column.name: value构成
         *      }
         *      ...
         * ]
         */
        updateRows: function(data) {
            var me = this, i, length, temp, tempData = data;
            if ($.isNull(data)) {
                me._error("updateRows() The input data is null.");
                return;
            }

            if (!$.isArray(data)) {
                tempData = [data];
            }

            length = tempData.length;
            for (i = 0; i < length; i++) {
                temp = tempData[i];
                me._updateRows(temp.row, temp.data);
            }
        },
        /**
         * @description 设置行选中
         * @param {Number/Array} rows 行或行数组
         */
        selectRows: function(rows) {
            if ($.isNull(rows)) {
                this._error("selectRows() The input param is null.");
                return;
            }
            var me = this, tempRows;
            if ($.isArray(rows)) {
                tempRows = rows;
            } else {
                tempRows = [rows];
            }
            
            me._allRowUnSelect();
            $(rows).each(function(index, row) {
                var params = me.__findTargetTr(row),
                        trEl = params.trEl,
                        checkboxEl,
                        el;
                if (!trEl) {
                    return;
                }
                trEl.addClass(gridContentRowSelectedClass);
                // 如果是复选，复选框需要选中
                checkboxEl = trEl.find("." + gridCheckboxClass);
                if (checkboxEl && 0 < checkboxEl.length) {
                    el = $(checkboxEl.find("a")).removeClass(checkboxUncheckdClass).addClass(checkboxCheckdClass);
                    me._oneRowSelect(el.attr("row"), el.attr("tree"));
                }// eventNameRowClick
                me._onTrClick({"data": {"me": me, "tr": trEl, "eventName": eventNameRowClick}});
            });
        },
        /**
         * @description 返回当前选中行下一行数据
         * @returns {Object} 返回行数据
         */
        selectPrev: function() {
            var me = this,
                    last,
                    row;
            if (me.hasPrev()) {
                last = me._getSelectedFirstRow();
                if (0 < last.length) {
                    row = $.string.toNumber($(last).attr("row")) - 1;
                } else {
                    row = me.contentTableEl.find("tr").length;
                }
                me.selectRows(row);
            }

            return me.getSelectedValue();
        },
        /**
         * @description 是否有上一行，相对于选中的第一行
         * @returns {Boolean} true 有， false 没有
         */
        hasPrev: function() {
            var me = this,
                    rows = me.contentTableEl.find("tr").length,
                    first;
            if (rows === 0) {
                return false;
            }
            first = me._getSelectedFirstRow();
            if (0 < first.length) {
                return $.string.toNumber($(first).attr("row")) > 1;
            }
            return true;
        },
        /**
         * @description 返回当前选中行下一行数据
         * @returns {Object} 返回行数据
         */
        selectNext: function() {
            var me = this,
                    last,
                    row;
            if (me.hasNext()) {
                last = me._getSelectedLastRow();
                if (0 < last.length) {
                    row = $.string.toNumber($(last).attr("row")) + 1;
                } else {
                    row = 1;
                }
                me.selectRows(row);
            }

            return me.getSelectedValue();
        },
        /**
         * @description 是否有下一行，相对于选中的最后一行
         * @returns {Boolean} true 有， false 没有
         */
        hasNext: function() {
            var me = this,
                    rows = me.contentTableEl.find("tr").length,
                    last;
            if (rows === 0) {
                return false;
            }
            last = me._getSelectedLastRow();
            if (0 < last.length) {
                return $.string.toNumber($(last).attr("row")) < rows;
            }
            return true;
        },
        /**
         * @description 清空所有过滤条件
         * @param {Boolean} reload 是否重新加载数据
         */
        clearAllFilters: function(reload) {
            var me = this;
            // 清空过滤条件
            me.filters = {};
            $.each(me.filterObjs, function(index, obj) {
                if (obj && obj.filter) {
                    obj.filter.reset();
                }
                if (obj && obj.tdEl) {
                    var filterPic = obj.tdEl.find("." + gridHeaderFilterPicClass);
                    if (filterPic) {
                        filterPic.remove();
                    }
                }
            });
            me.page.currentPage = 1;
            if (me.options.store) {
                if (me.options.store.clearFilters) {
                    me.options.store.clearFilters();
                }

                if (reload) {
                    me.options.store._setPage(me.getPageInfo());
                    me.options.store.load(me.getAllConditions());
                }
            } else {
                me._triggerHandler(null, "clearAllFilters", me.getAllConditions());
            }
        },
        /**
         * @description 清空所有排序条件
         * @param {Boolean} reload 是否重新加载数据
         */
        clearAllOrders: function(reload) {
            var me = this;
            // 清空排序条件
            me.orders = [];
            $.each(me.headerTdEls, function(index, obj) {
                if (obj) {
                    obj.removeClass(gridHeaderTdHoverClass + " " +
                            gridHeaderSortAscClass + " " +
                            gridHeaderSortDescClass)
                            .addClass(gridHeaderTdCommonClass);
                    obj.find("div:first").removeClass(gridHeaderTextHoverClass);
                }
            });
            me.page.currentPage = 1;
            if (me.options.store) {
                if (me.options.store.clearOrders) {
                    me.options.store.clearOrders();
                }

                if (reload) {
                    me.options.store._setPage(me.getPageInfo());
                    me.options.store.load(me.getAllConditions());
                }
            } else {
                me._triggerHandler(null, "clearAllOrders", me.getAllConditions());
            }
            //清空所有排序条件已选值
            me._clearMultiSort();
        },
        _clearMultiSort : function(){
            var me = this;
            //清空所有排序条件已选值
            if($.isNotNull(me.firstCol) && $.isNotNull(me.secondCol) && $.isNotNull(me.thirdCol)){
                var emptyObj = {"value":"","text":""};
                me.firstCol.radioGroup.setValue(emptyObj);
                me.secondCol.radioGroup.setValue(emptyObj);
                me.thirdCol.radioGroup.setValue(emptyObj);
                me.firstCol.combobox.setValue(emptyObj);
                me.secondCol.combobox.setValue(emptyObj);
                me.thirdCol.combobox.setValue(emptyObj);
            }
        },
        /**
         * @private
         * @description 返回选中的第一行
         */
        _getSelectedFirstRow: function() {
            var me = this;
            return me.contentTableEl.find("." + gridContentRowSelectedClass + ":first");
        },
        /**
         * @private
         * @description 返回选中的最后一行
         */
        _getSelectedLastRow: function() {
            var me = this;
            return me.contentTableEl.find("." + gridContentRowSelectedClass + ":last");
        },
        /**
         * @description 更新指定行数据
         * @param {Number} row 行号
         * @param {Object} data 待更改数据
         */
        _updateRows: function(row, data) {
            var me = this;
            if ($.isNull(data)) {
                me._error("_updateRows() The input data is null.");
                return;
            }

            var trEl,
                    tdEl,
                    tempData = $.objClone(data),
                    rowData,
                    tree,
                    realColumn,
                    realRow,
                    divEl,
                    params;
            // 查找目标行
            params = me.__findTargetTr(row);
            trEl = params.trEl;
            tree = params.tree;
            realRow = params.realRow;

            if (!trEl) {
                me._error("_updateRows() The target row does not exist.");
                return;
            }

            $.each(tempData, function(key, value) {
                realColumn = me.columnRelation[key];
                if ($.isUndefined(realColumn)) {
                    return;
                }
                // 树形结构数据
                if (tree) {
                    tdEl = me.contentTreeTdEls[realRow][realColumn].empty();
                } else {
                    tdEl = me.contentTdEls[realRow][realColumn].empty();
                }

                divEl = $("<div>");
                me.options.data.data[realRow][key] = value;
                var tempParams = {
                    "row": realRow,
                    "column": realColumn,
                    "rowData": tree ? me.treeData[realRow] : me.options.data.data[realRow],
                    "columnObj": me.headerColumns[realColumn],
                    "divEl": divEl,
                    "depth": 0,
                    "isTree": false,
                    "tdEl": tdEl
                };

                // 处理表格内部数据对其方式
                me.__getContentTdAlign(tempParams);
                // 是否用户有对列的处理
                me.__getContentTdRender(tempParams);
                // 绑定TD单击事件
                tdEl.unbind("click");
                me.__bindContentTdClick(tempParams);

                divEl.appendTo(tdEl);
            });
        },
        /**
         * @description 删除指定行数据
         * @param {Number/Array} row 行号或行号数组
         */
        deleteRows: function(row) {
            var me = this, i, length, temp = row;
            if ($.isNull(row)) {
                me._error("deleteRows() The input data is null.");
                return;
            }

            if (!$.isArray(row)) {
                temp = [row];
            }

            length = temp.length;
            for (i = 0; i < length; i++) {
                me._deleteRows(temp[i]);
            }

            me._refreshContentSN();
        },
        /**
         * @description 删除指定行数据
         * @param {Number} row 行号
         */
        _deleteRows: function(row) {
            var me = this,
                    trEl,
                    tree,
                    realRow,
                    params;
            // 查找目标行
            params = me.__findTargetTr(row);
            trEl = params.trEl;
            tree = params.tree;
            realRow = params.realRow;

            if (!trEl) {
                me._error("deleteRows() The target row does not exist.");
                return;
            }

            // 移除行
            trEl.remove();
            if (tree) {
                me.contentTreeTdEls[realRow] = null;
                me.contentTreeTrEls[realRow] = null;
                me.checkboxTreeTdEls[realRow] = null;
                me.treeData[realRow] = null;
            } else {
                me.contentTdEls[realRow] = null;
                me.contentTrEls[realRow] = null;
                me.checkboxTdEls[realRow] = null;
                me.options.data.data[realRow] = null;
            }
        },
        /**
         * @private
         * @description 查找目标行
         * @param {Number} row 行号
         */
        __findTargetTr: function(row) {
            var me = this,
                    trEls,
                    trEl,
                    tempTrEl,
                    length,
                    tree,
                    realRow,
                    i;
            // 查找目标行
            trEls = me.__getContentTrEls();
            length = trEls.length;
            for (i = 0; i < length; i++) {
                tempTrEl = $(trEls[i]);
                if ($.string.toNumber(tempTrEl.attr("row")) === row) {
                    trEl = tempTrEl;
                    tree = tempTrEl.attr("tree");
                    break;
                }
            }

            return {
                "trEl": trEl,
                "tree": tree,
                "realRow": row-1
            };
        },
        /**
         * @private
         * @description 添加rowId
         * @param {Array} arr 待添加rowId数组
         * @param {Number} begin 索引起始值
         */
        _addRowId: function(arr, begin) {
            if ($.isArray(arr)) {
                begin = begin || 1;
                for (var i = 0; i < arr.length; i++) {
                    arr[i].rowId = begin + i;
                }
            }
        },
        /**
         * @description 返回组件宽度
         * @return {Number} 返回组件宽度
         */
        _getWidth: function() {
            return this.gridEl.externalWidth();
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        _getHeight: function() {
            return this.gridEl.externalHeight();
        },
        /**
         * @description 重新计算组件宽度、高度
         * @private
         * @param {Boolean} b 是否处理自适应列，true不处理，false处理
         */
        _doLayout: function(b) {
            var me = this,
                    gridElWidth = me.gridEl.width(),
                    gridElHeight = me.gridEl.height(),
                    actionBarElHeight = 0,
                    headerElHeight = 0,
                    contentElHeight = 0,
                    headerTableElWidth = 0,
                    opt = me.options;
            if (!me.rendered) {
                return;
            }
            //刷新布局时，删除弹出菜单
            if (me._gridMenu) {
                me._gridMenu.destroy();
            }
            // 表头
            if (me.headerEl) {
                //自适应列表表头宽度
                if (opt.autoColumnWidth) {
                    me._modifyColumnWidth();
                }
                // 设置表头列宽度
                for (var i = 0; i < me.headerTdEls.length; i++) {
                    var temp = me.headerTdEls[i];
                    if (temp) {
                        temp.find("div:first").externalWidth(me.widths[i]?me.widths[i]:0);
                    }
                }
                headerElHeight = me.headerEl.height();
                me.headerEl.width(gridElWidth);
                // 计算表头宽度
                me.headerTableElWidth = headerTableElWidth = me.__calHeaderWidth();
                if (me.headerReRender) {
                    if (!b && !opt.autoColumnWidth) {
                        // 如果表格宽度相加结果比外层容器跨度还小，剩余宽度全部赋给最后一列
                        if (headerTableElWidth < gridElWidth) {
                            var tempSub = gridElWidth - headerTableElWidth - scrollWidth;
                            headerTableElWidth = gridElWidth;
                            me.widths[me.headerTdEls.length - 1] += tempSub;
                        }
                        else {
                            me.widths[me.headerTdEls.length - 1] -= scrollWidth;
                        }
                    }
                    //非自适应列表表头宽度
                    if (!opt.autoColumnWidth) {
                        me.__resetHeaderTdEl(me.headerTdEls.length - 1);
                    }
                    me.__resetHeaderWidth(headerTableElWidth);
                    me.headerReRender = false;
                }
            }

            // 表格操作栏
            if (me.actionBarEl) {
                actionBarElHeight = me.actionBarEl.height();
                me.actionBarEl.width(gridElWidth);
            }
            // 表格内容
            if (me.contentEl) {
                contentElHeight = gridElHeight - headerElHeight - actionBarElHeight;
                me.contentEl.width(gridElWidth).height(contentElHeight);
                me.__resetContentWidth();
                me._resetContentTdELWidth();
                // 给出“加载中...”的div设置宽度和top值
                me.loadEl.width(gridElWidth-scrollWidth).css("top", gridElHeight-30);
                
                if (!me.contentTableEl.hasClass(gridContentTableClass)) {
                    me.contentTableEl.addClass(gridContentTableClass);
                }
            }

            // 设置列动态改变div的相对位置
            me._doResizeElLayout();
        },
        /**
         * @private
         * @description 重新设置表头宽度
         * @param {Number} i 下标索引
         */
        __resetHeaderTdEl: function(i) {
            var me = this,
                    temp = me.headerTdEls[i];
            if (temp) {
                temp.find("div:first").externalWidth(me.widths[i]);
            }
        },
        /**
         * @private
         * @description 设置表头宽度
         * @param {Number} width 表头宽度
         */
        __resetHeaderWidth: function(width) {
            var me = this;
            me.headerDivEl.externalWidth(width);
            me.headerTableElWidth = width;
        },
        /**
         * @private
         * @description 修正表格列头的宽度，如果平均宽度小于minColumnWidth,则每一列都设置为minColumnWidth;
         * 如果平均宽度大于minColumnWidth，则以实际宽度为准
         */
        _modifyColumnWidth: function() {
            var me = this,
                    columns = me.headerColumns,
                    len = columns.length,
                    notHiddenLen = len, //不是隐藏列的个数
                    noCfgWidthNum = 0,
                    total = 0,
                    count = me.count, i = 0,
                    gridElWidth = me.gridEl.width(),
                    avgW = 0, cw = minColumnWidth;
            //如果这时取到的表格宽度小于列的最小宽度，返回不作处理
            if (gridElWidth < minColumnWidth) {
                return;
            }
            //先计算非隐藏的列
            for (i = 0; i < len; i++) {
                if (columns[i].hidden) {
                    notHiddenLen--;
                } else {
                    if (!columns[i].width) {
                        noCfgWidthNum++;
                    } else {
                        total += Number(columns[i].width);
                    }
                }
            }
            //先减去sn和checkbox的宽度
            for (i = 0; i < count; i++) {
                gridElWidth -= me.widths[i];
            }
            //再减去最右边的scrollWidth
            gridElWidth -= scrollWidth;
            //最后减去每两列之间的间隙len-1px
            gridElWidth -= (notHiddenLen - 1 + count + 1);
            //最后除去所有用户指定的列宽度
            gridElWidth -= total;
            //求得没有指定列宽度的所有列的平均宽度
            avgW = Math.floor(gridElWidth / (noCfgWidthNum <= 0 ? 1 : noCfgWidthNum));
            if (avgW > minColumnWidth) {
                cw = avgW;
            }
            for (i = count; i < me.originalWidths.length; i++) {
                if (ncWidth === me.originalWidths[i]) {
                    me.widths[i] = cw;
                }
            }
        },
        /**
         * @private
         * @description 计算表头宽度
         * @returns {Number} 返回宽度
         */
        __calHeaderWidth: function() {
            var me = this,
                    columns = me.headerColumns,
                    count = me.count, i = 0,
                    tempColumn,
                    gridElWidth = me.gridEl.width(),
                    width = scrollWidth;
            $.each(me.widths, function(index, value) {
                tempColumn = columns[index - count];
                if (!tempColumn || (tempColumn && tempColumn.hidden)) {
                    return;
                }
                width += value + 1;
            });
            //减去1，因为上面each中的value多加了一个像素
            width--;
            //加上sn或者checkbox的宽度
            for (i = 0; i < count; i++) {
                width += me.widths[i];
            }
            return gridElWidth > width ? gridElWidth : width;
        },
        /**
         * @private
         * @description 处理表格内容区宽度
         */
        __resetContentWidth: function() {
            var me = this;
            me.contentDivEl.width(me.headerTableElWidth - scrollWidth);
            // 计算表格内容宽度
            me.contentTableEl.width(me.headerTableElWidth - scrollWidth); // 预留滚动条宽度
        },
        /**
         * @private
         * @description 调整列动态改变div位置
         */
        _doResizeElLayout: function() {
            if (this.options.data && !this.options.data.resizable) {
                return;
            }
            var me = this,
                    gridElHeight = me.gridEl.height(),
                    actionBarElHegiht = me.actionBarEl.height(),
                    pagingElHeight = 0,
                    count = me.count;
            if (me.pagingEl) {
                pagingElHeight = me.pagingEl.height();
            }
            if (me.headerTdEls) {
                $.each(me.headerTdEls, function(index, obj) {
                    if (index > count - 1) {
                        var p = obj.position(),
                                num = 0,
                                width = obj.width(),
                                height = obj.height(),
                                calHeight = actionBarElHegiht,
                                rowspan = $.string.toNumber(obj.attr("rowspan")),
                                depth = $.string.toNumber(obj.attr("depth")),
                                visiable = $.isVisiable(obj),
                                tempResizeEl;
                        if (rowspan !== depth) {
                            num = depth - 1;
                            calHeight += height * num;
                        }
                        tempResizeEl = me.resizeEls[index - count].css({"left": p.left + width, "top": calHeight})
                                .attr("visiable", visiable ? "true" : "false")
                                .height(gridElHeight - pagingElHeight - calHeight);
                        if (visiable) {
                            if (!tempResizeEl.hasClass(gridHeaderDragClass)) {
                                tempResizeEl.addClass(gridHeaderDragClass);
                            }
                        } else {
                            tempResizeEl.removeClass(gridHeaderDragClass);
                        }
                    }
                });
            }
        },
        /**
         * @description 关闭浮动窗口
         * @private
         */
        _closeFloatPanel: function() {
            var me = this;
            me.__closeFloatPanel(me.pagingRowDropDownEl, "rowFlag");
            me.__closeFloatPanel(me.pagingPageDropDownEl, "pageFlag");
            me.__closeFloatPanel(me.exportEl, "exportFlag");
            me.__closeFloatPanel(me.selectColEl, "selectColFlag");
            // 关闭过滤窗口
            me.__closeFloatFilterPanel(me.oldActiveFilterTdEl);
            me.__closeFloatFilterPanel(me.activeFilterTdEl);
        },
        /**
         * @private
         * @description 关闭浮动窗口
         * @param {Object} obj 浮动窗口对象
         * @param {String} key 键值
         */
        __closeFloatPanel: function(obj, key) {
            var flag;
            if (obj) {
                flag = obj.data(key);
                if (!flag && $.isVisiable(obj)) {
                    obj.hide();
                }
                obj.data(key, false);
            }
        },
        /**
         * @private
         * @description 关闭浮动窗口对象
         * @param {Object} obj 浮动窗口对象
         */
        __closeFloatFilterPanel: function(obj) {
            var me = this;
            if (obj) {
                if (!obj.data("created")) {
                    obj.data("filterPanel").hide();
                    me.__onHeaderTdMouseLeave(null, obj);
                }
                obj.data("created", false);
            }
        },
        /**
         * @private
         * @description 创建Grid组件总入口
         */
        _createSweetWidget: function() {
            if (this.renderEl) {
                return;
            }
            var me = this,
                    gridClass = "sweet-grid",
                    gridEl = me.gridEl = $("<div>");
            me.initial = true;
			me.locked = false;
            gridEl.addClass(gridClass).attr("id", me.options.id)
                    .width(me.options.width)
                    .height(me.options.height);
            me._createGridWidget();
        },
        /**
         * @private
         * @description 创建表格组件
         */
        _createGridWidget: function() {
            var me = this;
            if (!me.options.data) {
                return;
            }
            // 创建表头
            var headerIsChanged = me._createGridHeader();
            // 生成表格操作栏,只有表头发生变化或新建表头时才重新创建操作栏
            if(headerIsChanged){
                me._createGridActionBar();
            }
            // 创建表格内容
            me._createGridContent();
            // 注册监听
            me._addListener();
            me._addLoading();
        },
        /**
         * @private
         * @description 生成表格操作栏
         */
        _createGridActionBar: function() {
            this.__destroyTableActionBar();
            var me = this,
                    data = me.options.data,
                    flag = false,
                    actionBarEl = me.actionBarEl = $("<div>").addClass("sweet-grid-action-bar"),
                    picBarEl = $("<div>").addClass("sweet-grid-action-bar-pic");
            // 列选择
            if (data.selectColumn) {
                flag = true;
                $("<span>").attr("title", i18n.selectCol).addClass(actionBarSelectColumnClass).appendTo(picBarEl);
            }
            // 多列排序
            if (data.multiColumnSort) {
                flag = true;
                $("<span>").attr("title", i18n.multiSort).addClass(actionBarMultiSortClass).appendTo(picBarEl);
            }
            // 二次统计
            if (data.secondaryStat) {
                flag = true;
                $("<span>").attr("title", i18n.secondStat).addClass(actionBarSecondStatClass).appendTo(picBarEl);
            }
            // 清空过滤条件
            if (data.clearFilters) {
                flag = true;
                $("<span>").attr("title", i18n.clearFilter).addClass(actionBarClearFilterClass).appendTo(picBarEl);
            }
            // 导出
            if (data.export) {
                flag = true;
                $("<span>").attr("title", i18n.export).addClass(actionBarExportClass).appendTo(picBarEl);
            }
            picBarEl.bind("click", function(e) {
                me.__onPicBarClick(e);
            }).appendTo(actionBarEl);

            if (flag) {
                actionBarEl.insertBefore(me.headerEl);
            } else {
                actionBarEl.height(0);
            }
        },
        /**
         * @private
         * @description 表格操作栏点击事件
         * @param {Object} e 事件对象
         */
        __onPicBarClick: function(e) {
            var me = this,
                    self = $(e.target);
            // 列选择
            if (self.hasClass(actionBarSelectColumnClass)) {
                me.__createSelectColumnPanel(self);
            }
            // 多列排序
            else if (self.hasClass(actionBarMultiSortClass)) {
                me.__createMultiSort();
            }
            // 清空过滤条件
            else if (self.hasClass(actionBarClearFilterClass)) {
                Sweet.Msg.confirm(i18n.qClearFilter, null, null,
                        function() {
                            me.clearAllFilters(true);
                        }
                );
            }
            // 导出
            else if (self.hasClass(actionBarExportClass)) {
                me.__createExportPanel(self);
            } 
            //二次统计
            else if(self.hasClass(actionBarSecondStatClass)){
                me.__createSecondaryStatPanel();
            }
        },
        /**
         * @private
         * @description 创建二次统计面板
         */
        __createSecondaryStatPanel : function(){
            var me = this,
                    temp,
                    data = me.options.data;
            
            if(data.statParams){
                if(me.secondaryPanel){
                    me.secondaryPanel.destroy();
                    me.secondaryPanel = null;
                }
                temp = data.statParams;
                me.secondaryPanel = new Sweet.cmp.SecondaryStat({
                    dims : temp.dims,
                    indicators : temp.indicators,
                    statFun : temp.statFun
                });
            }
        },
        /**
         * @private
         * @description 创建多列排序
         */
        __createMultiSort: function() {
            var me = this,
                    tempCol = [],
                    userMulCol = me.options.data ? me.options.data.multiSortColumnsArr : [],
                    sortColumns = [];
            // 创建一次就可以
            if (me._multiSortWin) {
                me._multiSortWin.show();
                return;
            }
            //支持用户自己定义多列排序的列,并且优先使用用户自己定义的列
            if($.isArray(userMulCol) && userMulCol.length > 0){
                tempCol = userMulCol;
            } else {
                tempCol = me.headerColumns;
            }
            $.each(tempCol, function(i, obj) {
                //永远隐藏的列不放进多列排序中,而暂时隐藏的列需要放在里面
                if(!obj.hiddenForever && $.isNotNull(obj.header) && obj.sortable){
                    sortColumns.push({"text": obj.header, "value": obj.name, "data": obj});
                }
            });
            function sortCol(comboboxLabelText, data) {
                var items = [];
                var combobox = new Sweet.form.ComboBox({
                    label: true,
                    pleaseSelect: true,
                    labelWidth: i18n.multiSortWin.comboLabelWidth,
                    width: i18n.multiSortWin.comboWidth,
                    data: data,
                    labelText: comboboxLabelText,
                    tip: true
                });
                items.push(combobox);
                var radioGroup = new Sweet.form.RadioGroup({
                    width: i18n.multiSortWin.radioWidth,
                    columns: "auto",
                    data: [
                        {text: i18n.multiSortWin.asc, value: "ASC"},
                        {text: i18n.multiSortWin.desc, value: "DESC"}
                    ],
                    tip: true
                });
                items.push(radioGroup);
                var panel = new Sweet.panel.FlowPanel({
                    width: "100%",
                    height: 25,
                    items: items,
                    itemExtend: true
                });

                return {
                    "combobox": combobox,
                    "radioGroup": radioGroup,
                    "panel": panel
                };
            }

            function judge(data, obj) {
                if (data && Sweet.core.i18n.combobox.pleaseSelect === data.value) {
                    return;
                }
                if ($.equals(data, obj.combobox.getValue())) {
                    obj.combobox.setValue({"value": Sweet.core.i18n.combobox.pleaseSelect,
                        "text": Sweet.core.i18n.combobox.pleaseSelect});
                    obj.radioGroup.setValue({});
                }
            }

            function isAllNull(combobox, radioGroup) {
                var combVal = combobox.getValue(),
                        radioVal = radioGroup.getValue();
                if ((!combVal || !combVal.value || Sweet.core.i18n.combobox.pleaseSelect === combVal.value) &&
                        (!radioVal || !radioVal.value)) {
                    return true;
                }
                return false;
            }

            function isOneNull(combobox, radioGroup) {
                var combVal = combobox.getValue(),
                        isCombValNull = false,
                        radioVal = radioGroup.getValue(),
                        isRadioValNull = false;
                if (!combVal || !combVal.value || Sweet.core.i18n.combobox.pleaseSelect === combVal.value) {
                    isCombValNull = true;
                }

                if (!radioVal || !radioVal.value) {
                    isRadioValNull = true;
                }

                if ((isCombValNull && !isRadioValNull) || (isRadioValNull && !isCombValNull)) {
                    return true;
                }

                return false;
            }

            function getOrders(combobox, radioGroup) {
                var comboboxVal = combobox.getValue(),
                        radioVal = radioGroup.getValue();
                if (radioVal && radioVal.text) {
                    return me.__getOrderFormat(comboboxVal.data.name, radioVal.value, comboboxVal.data.dataType);
                }

                return null;
            }

            var firstCol = me.firstCol = sortCol(i18n.multiSortWin.firstSort, sortColumns),
                    secondCol = me.secondCol = sortCol(i18n.multiSortWin.secondSort, sortColumns),
                    thirdCol = me.thirdCol = sortCol(i18n.multiSortWin.thirdSort, sortColumns),
                    vPanel,
                    win;
            firstCol.combobox.addListener("change", function(e, data) {
                judge(data, secondCol);
                judge(data, thirdCol);
            });
            secondCol.combobox.addListener("change", function(e, data) {
                judge(data, firstCol);
                judge(data, thirdCol);
            });
            thirdCol.combobox.addListener("change", function(e, data) {
                judge(data, firstCol);
                judge(data, secondCol);
            });
            vPanel = new Sweet.panel.VPanel({
                items: [firstCol.panel, secondCol.panel, thirdCol.panel]
            });
            me._multiSortWin = win = new Sweet.Window({
                width: i18n.multiSortWin.winWidth,
                height: 190,
                title: i18n.multiSortWin.title,
                //去掉动画效果
                content: vPanel,
                listeners: {
                    ok: function() {
                        // 判断是否有选择
                        if (isAllNull(firstCol.combobox, firstCol.radioGroup) &&
                                isAllNull(secondCol.combobox, secondCol.radioGroup) &&
                                isAllNull(thirdCol.combobox, thirdCol.radioGroup)) {
                            Sweet.Msg.warn(i18n.multiSortWin.firstNoSelectTip);
                            return false;
                        }

                        // 第一列是否选择
                        if (isOneNull(firstCol.combobox, firstCol.radioGroup)) {
                            Sweet.Msg.warn(i18n.multiSortWin.firstNoSelectTip);
                            return false;
                        }

                        // 第二列是否选择
                        if (isOneNull(secondCol.combobox, secondCol.radioGroup)) {
                            Sweet.Msg.warn(i18n.multiSortWin.secondNoSelectTip);
                            return false;
                        }

                        // 第三列是否选择
                        if (isOneNull(thirdCol.combobox, thirdCol.radioGroup)) {
                            Sweet.Msg.warn(i18n.multiSortWin.thirdNoSelectTip);
                            return false;
                        }

                        // 重新加载数据
                        me.orders = [];
                        var firstVal = getOrders(firstCol.combobox, firstCol.radioGroup),
                                secondVal = getOrders(secondCol.combobox, secondCol.radioGroup),
                                thirdVal = getOrders(thirdCol.combobox, thirdCol.radioGroup);
                        if (firstVal) {
                            me.orders.push(firstVal);
                        }
                        if (secondVal) {
                            me.orders.push(secondVal);
                        }
                        if (thirdVal) {
                            me.orders.push(thirdVal);
                        }
                        // 当前页记为1
                        me.page.currentPage = 1;
                        if (me.options.store) {
                            me.options.store._setDataPage(me.getPageInfo());
                            me.options.store.load(me.getAllConditions());
                        } else {
                            me._triggerHandler(null, "multiOrders", me.getAllConditions());
                        }
                        //清空所有列上的排序标志
                        $.each(me.headerTdEls, function(index, obj) {
                            if (obj) {
                                obj.removeClass(gridHeaderTdHoverClass + " " +
                                        gridHeaderSortAscClass + " " +
                                        gridHeaderSortDescClass)
                                        .addClass(gridHeaderTdCommonClass);
                                obj.find("div:first").removeClass(gridHeaderTextHoverClass);
                                //给所有的多列排序列加上排序标志
                                var colName = obj.attr("columnName");
                                for(var m = 0; m < me.orders.length; m++){
                                    if(colName === me.orders[m].name){
                                        var cls = gridHeaderSortAscClass;
                                        if(me.orders[m].order === Sweet.constants.sortType.DESC){
                                            cls = gridHeaderSortDescClass;
                                        }
                                        obj.addClass(cls);
                                        obj.removeClass(gridHeaderTdCommonClass);
                                        obj.find("div:first").addClass(gridHeaderTextClass);
                                    }
                                }
                            }
                        });
                    }
                }
            });
            win.show();
        },
        /**
         * @private
         * @description 创建列选择面板
         * @param {Object} obj 列选择对象
         */
        __createSelectColumnPanel: function(obj) {
            var me = this,
                    offset;
            if (me.selectColEl) {
                offset = $.getFloatOffset(obj, me.selectColEl, true);
                me.selectColEl.css(offset).show().data("selectColFlag", true);
                return;
            }

            var id = me.options.id + "-select-column",
                    selectColEl = $("<div>").attr("id", id)
                    .addClass(me.winBgClass + " sweet-grid-select-column")
                    .bind("click", function() {
                        selectColEl.data("selectColFlag", true);
                    }).appendTo($(document.body)),
                    list,
                    columnData,
                    data = [],
                    value = [];
            columnData = me.__getSelectColumnData();
            data = columnData.data;
            value = columnData.value;
            var maxh = me.gridEl.height() - 70;
            
            var hl = data.length * 22 + 10;
            list = new Sweet.list.OptimizeList({
                width: 200,
                height: hl > maxh ? maxh : hl,
                multi: true,
                data: data,
                value : value,
                minRemains: 1,
                tip: true,
                renderTo: id
            });
            // 注册复选框点击事件
            list.addListener("checkboxClick", function(e, data) {
                me.__onSingleColumnHiddenClick(e, data.data.index, data.checked);
            });

            offset = $.getFloatOffset(obj, selectColEl, true);
            selectColEl.css(offset).show().data("selectColFlag", true);
            me.selectColEl = selectColEl;
            me.selectColList = list;
        },
        /**
         * @private
         * @description 获取列信息，用于设置列选择使用
         */
        __getSelectColumnData: function() {
            var me = this,
                    headerColumns = me.headerColumns,
                    enableHdMenu,
                    hiddenForever,
                    i,
                    length = headerColumns.length,
                    temp,
                    tempVal,
                    data = [],
                    value = [];
            for (i = 0; i < length; i++) {
                temp = headerColumns[i];
                enableHdMenu = temp.enableHdMenu;
                hiddenForever = temp.hiddenForever || false;
                tempVal = {"text": temp.header, "value": temp.name, "data": {"index": i}};
                if (($.isUndefined(enableHdMenu) || enableHdMenu) && !hiddenForever) {
                    data.push(tempVal);
                    if (!temp.hidden) {
                        value.push(tempVal);
                    }
                }
            }

            return {"data": data, "value": value};
        },
        /**
         * @private
         * @description 创建导出面板
         * @param {Object} obj 弹出框浮着的目标对象
         */
        __createExportPanel: function(obj) {
            var me = this,
                    offset,
                    exportW = 80;
            if (me.exportEl) {
                offset = $.getFloatOffset(obj, me.exportEl, true);
                me.exportEl.css(offset).show().data("exportFlag", true);
                return;
            }
            var exportType = me.options.data.exportType || [],
                    length = exportType.length,
                    exportEl = $("<div>").width(exportW).addClass(me.winBgClass + " sweet-grid-export"),
                    ulEl = $("<ul>"),
                    liEl,
                    i,
                    temp;
            for (i = 0; i < length; i++) {
                temp = exportType[i];
                if (exportTypeConf.CSV === temp) {
                    liEl = $("<li>").addClass(actionBarExportLiCsvClass).text(exportTypeText.csv).appendTo(ulEl);
                    $("<span>").addClass(actionBarExportCsvClass).prependTo(liEl);
                } else if (exportTypeConf.XLS === temp) {
                    liEl = $("<li>").addClass(actionBarExportLiXlsClass).text(exportTypeText.xls).appendTo(ulEl);
                    $("<span>").addClass(actionBarExportXlsClass).prependTo(liEl);
                } else if (exportTypeConf.PDF === temp) {
                    liEl = $("<li>").addClass(actionBarExportLiPdfClass).text(exportTypeText.pdf).appendTo(ulEl);
                    $("<span>").addClass(actionBarExportPdfClass).prependTo(liEl);
                }
            }
            ulEl.appendTo(exportEl);
            offset = $.getFloatOffset(obj, exportEl, true);
            var maxzindex = $.getMaxZIndex(undefined, "sweet-grid-action-bar-pic");
            exportEl.data("exportFlag", true)
                    .bind("click", {"me": me}, me._onExportClick)
                    .appendTo($(document.body)).css(offset).css("z-index", maxzindex);
            me.exportEl = exportEl;
        },
        /**
         * @private
         * @description 导出点击事件
         * @param {Object} e 事件对象
         */
        _onExportClick: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    headerColumns = me.headerColumns,
                    columns = [],
                    column = {},
                    data = {},
                    temp,
                    i;
            // 获取列信息
            for (i = 0; i < headerColumns.length; i++) {
                temp = headerColumns[i];
                column = {};
                column.header = temp.header;
                column.name = temp.name;
                column.dataType = temp.dataType;
                column.hidden = temp.hidden;
                columns.push(column);
            }
            // csv
            if (self.hasClass(actionBarExportLiCsvClass)) {
                data = {"type": exportTypeText.csv, "columns": columns};
            }
            // xls
            else if (self.hasClass(actionBarExportLiXlsClass)) {
                data = {"type": exportTypeText.xls, "columns": columns};
            }
            // pdf
            else if (self.hasClass(actionBarExportLiPdfClass)) {
                data = {"type": exportTypeText.pdf, "columns": columns};
            } else {
                me._error("Unknown export type.");
                return;
            }

            me._triggerHandler(e, eventNameExport, data);
        },
        /**
         * @private
         * @description 创建表头
         */
        _createGridHeader: function() {
            var me = this;
            if (!me.options.data.columns) {
                return true;
            }
            // 恢复横向滚动
            if (me.headerDivEl) {
                me.headerDivEl.css({"left": 0});
            }
            if (me.resizeEl) {
                me.resizeEl.css({"left": 0});
            }
            // 移除全选状态
            if (me.allCheckboxEl) {
                me.allCheckboxEl.removeClass(checkboxCheckdClass).addClass(checkboxUncheckdClass);
            }
            //比较值是否一样，不一样才创建表头
            if ($.equals(me.historyColumns, me.options.data.columns)) {
                return false;
            } else {
                me.gridScrollLeftFlag = 0;
            }

            // 记录历史columns配置
            me.historyColumns = $.objClone(me.options.data.columns);

            // 先销毁之前的元素，再创建
            me.__destroyTableHeader();
            var columns = $.objClone(me.options.data.columns),
                    checkbox = me.options.data.checkbox,
                    sn = me.options.data.sn,
                    headerEl = me.headerEl = $("<div>").addClass(gridHeaderClass).appendTo(me.gridEl),
                    headerDivEl = me.headerDivEl = $("<div>").appendTo(headerEl),
                    headerTableEl = me.headerTableEl = $("<table>")
                    .attr({"cellspacing": 0, "cellpadding": 0, "border": 0})
                    .appendTo(headerDivEl),
                    headerTrEl = $("<tr>").appendTo(headerTableEl),
                    headerTdEl,
                    headerTdEls = [],
                    headerTdDivEl,
                    index = 0,
                    widths = [],
                    rows = [],
                    tdArr = [],
                    tdTempArr = [];
            // 保存过滤组件对象，格式为{"name": , "dataType": , "value": {}}
            me.filterObjs = [];
            // 保存过滤条件
            me.filters = {};
            //保存过滤面板对象
            me.filterPanels = [];
            // 保存排序条件
            me.orders = [];
            // 记录已隐藏列数
            me.hiddenColumn = 0;
            // 列名和列号对应关系
            me.columnRelation = {};
            me.count = 0;

            // 修正列数据
            me._amendColumns(columns);
            // 表头数据预处理，将树转换成数组
            me._parseHeader(columns, 0, rows);
            // @TODO 重新计算colspan，支持无限级表格列头合并，暂只支持两级
            // 列和列号对应关系
            me.__ColumnNumRelation(columns);

            // 是否有复选框
            if (checkbox) {
                var checkboxI = index++;
                headerTdEl = $("<td>").attr("rowspan", rows.length)
                        .addClass(gridHeaderTdClass + " " + gridHeaderTdCommonClass)
                        .mouseenter({"me": me}, me.__onHeaderTdMouseEnter)
                        .mouseleave({"me": me}, me.__onHeaderTdMouseLeave)
                        .appendTo(headerTrEl);
                headerTdDivEl = $("<div>").addClass(gridCheckboxClass).appendTo(headerTdEl);
                me.allCheckboxEl = $("<a>").addClass(checkboxUncheckdClass)
                        .bind("click", {"me": me}, me._onAllRowClick)
                        .appendTo(headerTdDivEl);
                headerTdEls[checkboxI] = headerTdEl;
                widths[checkboxI] = checkboxWidth;
                me.count++;
            }

            // 是否有序号列
            if (sn) {
                var snI = index++;
                headerTdEl = $("<td>").attr("rowspan", rows.length)
                        .addClass(gridHeaderTdClass + " " + gridHeaderTdCommonClass)
                        .mouseenter({"me": me}, me.__onHeaderTdMouseEnter)
                        .mouseleave({"me": me}, me.__onHeaderTdMouseLeave)
                        .appendTo(headerTrEl);
                headerTdDivEl = $("<div>").text(i18n.SN).addClass(gridHeaderTextClass).appendTo(headerTdEl);
                headerTdEls[snI] = headerTdEl;
                widths[snI] = snWidth;
                me.count++;
            }

            // 处理表头，包括表头合并
            tdTempArr = me._generateHeader(rows, headerTrEl, headerTableEl);
            // 修正列数据
            tdArr = me._amendHeader(tdTempArr);

            me.headerTdEls = headerTdEls;
            // 所有列宽度
            me.widths = widths;
            //存放原始的列宽信息，即用户配置的宽度或没配置时为ncWidth
            me.originalWidths = JSON.parse(JSON.stringify(widths));
            // 保存表头
            me.headerColumns = [];
            for (var k = 0; k < tdArr.length; k++) {
                var t = tdArr[k].tdEl.attr("column", k);
                if($.isNotNull(tdArr[k].column)){
                    t.attr("columnName", tdArr[k].column.name);
                }
                me.headerTdEls.push(t);
                me.widths.push(!$.isNull(tdArr[k].width) ? tdArr[k].width : minColumnWidth);
                me.originalWidths.push(!$.isNull(tdArr[k].width) ? tdArr[k].width : ncWidth);
                me.headerColumns.push(tdArr[k].column);
            }

            // 实现列宽动态改变
            me._columnResizable();
            me.headerReRender = true;
            return true;
        },
        /**
         * @public
         * @description 表头元素中的属性发生改变，例如某列的hidden发生变化，可调用 些方法进行隐藏或显示
         * @param {Array} headers  列头数组，与创建表格的columns中相同
         */
        headerChanged: function(headers) {
            if ($.isNull(headers) || !$.isArray(headers) || headers.length <= 0) {
                return;
            }
            var me = this,
                    i = 0,
                    index,
                    hc = [],
                    len = headers.length,
                    columns = me.headerColumns,
                    temp;
            if (len > me.headerColumns.length) {
                return;
            }
            for (i = 0; i < len; i++) {
                temp = headers[i];
                if (!$.isPlainObject(temp)) {
                    continue;
                }
                index = me._findIndex(temp.name);
                if (-1 !== index) {
                    hc.push({
                        index: index,
                        show: !temp.hidden
                    });
                    columns[index] = $.extend(columns[index], temp);
                }
            }
            if (hc.length > 0) {
                me.__ColumnsHidden(hc);
                me.headerReRender = true;
                me._doLayout(true);
                // 设置列选中列表
                if (me.selectColList) {
                    me.selectColList.setValue(me.__getSelectColumnData().value);
                }
            }
        },
        /**
         * @private
         * @description 在已经有的列头中找相应的列的索引
         * @param {string} key 寻找的列的key,即name 
         * @returns {Number} 返回相应列在已经有的列中的索引，如果没有，返回-1
         */
        _findIndex: function(key) {
            var me = this,
                    i = 0,
                    columns = me.headerColumns;

            for (i = 0; i < columns.length; i++) {
                if (key === columns[i].name) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * @private
         * @description 列和列号对应关系
         * @param {Array} columns 表格列
         * @param {Number} column 列数
         */
        __ColumnNumRelation: function(columns, column) {
            var me = this;
            column = column || 0;
            $.each(columns, function(index, obj) {
                if (obj.children && 0 < obj.children.length) {
                    column = me.__ColumnNumRelation(obj.children, column);
                } else {
                    me.columnRelation[obj.name] = column++;
                }
            });

            return column;
        },
        /**
         * @private
         * @description 修正列数据，如果父节点hidden为true，子节点也为true
         * @param {Array} columns 列数组
         * @param {Boolean} b hidden属性值
         */
        _amendColumns: function(columns, b) {
            var me = this,
                    temp;
            for (var i = 0; i < columns.length; i++) {
                temp = columns[i];
                if (temp.children && temp.hidden) {
                    me._amendColumns(temp.children, temp.hidden);
                } else {
                    if ($.isNotNull(b)) {
                        temp.hidden = b;
                    }
                }
            }
        },
        /**
         * @private
         * @description 实现列宽动态改变功能
         */
        _columnResizable: function() {
            var me = this,
                    el;
            // 列大小是否可拖动
            if (me.options.data.resizable) {
                var resizeEl = me.resizeEl = $("<div>").addClass(resizeElClass).appendTo(me.gridEl),
                        columns = me.headerColumns;
                me.resizeEls = [];
                for (var i = 0; i < columns.length; i++) {
                    el = me.resizeEls[i] = $("<div>").attr("num", i)
                            .mousedown({"me": me}, me._onResizeElDown)
                            .addClass(gridHeaderDragClass)
                            .appendTo(resizeEl);
                    if (columns[i].hidden) {
                        el.hide();
                    }
                }
            }
        },
        /**
         * @private
         * @description 列动态改变div鼠标按下事件处理
         * @param {Object} e 事件对象
         */
        _onResizeElDown: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    num = $.string.toNumber(self.attr("num")),
                    index = num + me.count,
                    tdEl = me.headerTdEls[index];
            // 处于隐藏状态的拖动条，不能拖动
            if ("true" !== self.attr("visiable")) {
                return;
            }
            me._helperEl = self;
            me._prevHelperEl = null;
            me._helperElWidth = self.width();
            me._startX = e.pageX;
            me._startLeft = self.position().left;
            me._startTdLeft = tdEl.position().left;
            me._startTdWidth = tdEl.externalWidth();
            // 在document上绑定mouseup、mousemove事件
            $(document).bind("mousemove", {"me": me}, me._onResizeElMove)
                    .bind("mouseup", {"me": me}, me._onResizeElUp);
            $(document.body).addClass(selectNoneClass);
            me.__dealResizeElClass(true, self, num);
        },
        /**
         * @private
         * @description 列动态改变div鼠标松开事件处理
         * @param {Object} e 事件对象
         */
        _onResizeElUp: function(e) {
            var me = e.data.me,
                    self = me._helperEl;
            if (!self) {
                return;
            }
            var x = self.position().left - me._startLeft,
                    num = $.string.toNumber(self.attr("num")),
                    index = num + me.count,
                    headerWidth = 0,
                    resizeEl;
            $(document).unbind("mousemove", me._onResizeElMove)
                    .unbind("mouseup", me._onResizeElUp);
            $(document.body).removeClass(selectNoneClass);
            me.__dealResizeElClass(false, self, num);

            // 修改表头列宽度
            me.widths[index] += x;
            me.__resetHeaderTdEl(index);
            headerWidth = me.__calHeaderWidth();
            me.__resetHeaderWidth(headerWidth);

            // 刷新内容区宽度
            me.__resetContentWidth();
            me._resetContentTdELWidthByCol(index);

            // 刷新其他拖动条位置
            for (var i = 0; i < me.resizeEls.length; i++) {
                if (num < i) {
                    resizeEl = me.resizeEls[i];
                    resizeEl.css("left", resizeEl.position().left + x);
                }
            }
        },
        /**
         * @private
         * @description 处理拖动线样式
         * @param {Boolean} down 是否鼠标按下
         * @param {Object} el 被拖动线
         * @param {Number} num 编号
         */
        __dealResizeElClass: function(down, el, num) {
            var me = this,
                    prevEl,
                    defaultZIndex;
            if (down) {
                el.addClass(gridHeaderDownClass).css("z-index", $.getMaxZIndex());
                if (0 !== num) {
                    prevEl = me.__findPrevResizeEl(num);
                    if (prevEl && $.isVisiable(prevEl)) {
                        me._prevHelperEl = prevEl;
                        prevEl.addClass(gridHeaderDownClass).width(1).css("z-index", $.getMaxZIndex());
                    }
                }
            } else {
                defaultZIndex = "auto";
                el.removeClass(gridHeaderDownClass).css("z-index", defaultZIndex);
                if (0 !== num) {
                    prevEl = me._prevHelperEl;
                    if (prevEl && $.isVisiable(prevEl)) {
                        prevEl.removeClass(gridHeaderDownClass).width(me._helperElWidth).css("z-index", defaultZIndex);
                    }
                }
            }
        },
        /**
         * @private
         * @description 找到当前拖动元素前一个
         * @param {Number} num 编号
         */
        __findPrevResizeEl: function(num) {
            var me = this,
                    prevEl,
                    visiable;
            if (0 < num) {
                prevEl = me.resizeEls[num - 1];
                visiable = prevEl.attr("visiable");
                if ($.isNull(visiable) || "true" === visiable) {
                    return prevEl;
                } else {
                    return me.__findPrevResizeEl(num - 1);
                }
            }
        },
        /**
         * @private
         * @description 列动态改变div拖动事件处理
         * @param {Object} e 事件对象
         */
        _onResizeElMove: function(e) {
            var me = e.data.me,
                    self = me._helperEl;
            if (!self) {
                return;
            }
            var x = e.pageX - me._startX;
            // 设定拖动缩小的最小值
            if (0 > x && me._startTdWidth + x < minTdWidth) {
                return;
            }
            self.css("left", me._startLeft + x);
        },
        /**
         * @private
         * @description 表格排序，表格上排序只支持单列排序
         * @param {Object} e 事件对象
         */
        _sort: function(e) {
            var me = e.data.me,
                    tdEl = $(this),
                    column = tdEl.attr("column"), // 列数
                    sortType = Sweet.constants.sortType.ASC;    // 默认升序
			if(me.locked){
				return;
			}
            if (!me.sortEl) {
                me.sortEl = tdEl;
            } else {
                // 是否同一列
                if (me.sortEl.attr("column") !== tdEl.attr("column")) {
                    me.sortEl.removeClass(gridHeaderSortAscClass + " " +
                            gridHeaderSortDescClass + " " +
                            gridHeaderTdHoverClass)
                            .addClass(gridHeaderTdCommonClass);
                    me.sortEl.find("div:first").removeClass(gridHeaderTextHoverClass);
                }
            }
            // 升序
            if (tdEl.hasClass(gridHeaderSortAscClass)) {
                tdEl.removeClass(gridHeaderSortAscClass)
                        .addClass(gridHeaderSortDescClass);
                sortType = Sweet.constants.sortType.DESC;
            }
            // 降序
            else if (tdEl.hasClass(gridHeaderSortDescClass)) {
                tdEl.removeClass(gridHeaderSortDescClass)
                        .addClass(gridHeaderSortAscClass);
                sortType = Sweet.constants.sortType.ASC;
            }
            // 未排序，按升序处理
            else {
                tdEl.addClass(gridHeaderSortAscClass);
                sortType = Sweet.constants.sortType.ASC;
            }

            me.sortEl = tdEl.removeClass(gridHeaderTdCommonClass);
            tdEl.find("div:first").addClass(gridHeaderTextClass);

            // 排序
            var columnObj = me.headerColumns[$.string.toNumber(column)];
            me.orders = [];
            me.orders.push(me.__getOrderFormat(columnObj.name, sortType, columnObj.dataType));
            // 当前页记为1
			if(me.page){
				me.page.currentPage = 1;
			}
            if (me.options.store) {
                me.options.store._setDataPage(me.getPageInfo());
                me.options.store.load(me.getAllConditions());
            } else {
                me._triggerHandler(e, "sort", me.getAllConditions());
            }
            //清空所有多列排序条件已选值
            me._clearMultiSort();
            //清空除此列外所有列上的排序标志
            $.each(me.headerTdEls, function(index, obj) {
                if (obj) {
                    if(tdEl.attr("columnName") !== obj.attr("columnName")){
                        obj.removeClass(gridHeaderTdHoverClass + " " +
                                gridHeaderSortAscClass + " " +
                                gridHeaderSortDescClass)
                                .addClass(gridHeaderTdCommonClass);
                        obj.find("div:first").removeClass(gridHeaderTextHoverClass);
                    }
                }
            });
        },
        /**
         * @private
         * @description 格式化排序
         * @param {String} name 列名
         * @param {String} type 排序类型
         * @param {String} dataType 数据类型
         */
        __getOrderFormat: function(name, type, dataType) {
            return {"name": name, "order": type, "dataType": dataType};
        },
        /**
         * @private
         * @description 生成表头对象
         * @param {Array} rows 表头数组
         * @param {Object} headerTrEl 行对象
         * @param {Object} headerTableEl table对象
         * @return {Object} tdTempArr 临时存放表头对象数组
         */
        _generateHeader: function(rows, headerTrEl, headerTableEl) {
            var me = this,
                    column,
                    columnHeight = 0,
                    headerTdEl,
                    headerTdDivEl,
                    row,
                    tdTempArr = [];
            for (var i = 0; i < rows.length; i++) {
                row = rows[i];
                tdTempArr[i] = [];
                if (0 !== i) {
                    headerTrEl = $("<tr>").appendTo(headerTableEl);
                }
                for (var j = 0; j < row.length; j++) {
                    column = row[j];
                    columnHeight = column.height || defaultColumnHeight;
                    headerTdEl = $("<td>").height(columnHeight)
                            .addClass(gridHeaderTdClass + " " + gridHeaderTdCommonClass)
                            .mouseenter({"me": me}, me.__onHeaderTdMouseEnter)
                            .mouseleave({"me": me}, me.__onHeaderTdMouseLeave)
                            .appendTo(headerTrEl);
                    headerTdDivEl = $("<div>").text(column.header)
                            .addClass(gridHeaderTextClass)
                            .appendTo(headerTdEl);
                    // 是否隐藏
                    if (column.hidden) {
                        headerTdEl.hide();
                        // 只记最后一行的隐藏列
                        if (i === rows.length - 1) {
                            me.hiddenColumn++;
                        }
                    }
                    // 是否有tip提示
                    if (column.tooltip) {
                        headerTdDivEl.attr("title", column.tooltip);
                    }
                    // 处理子节点
                    if (column.children && (0 < column.children.length)) {
                        headerTdEl.attr({"colspan": column.colspan})
                                .addClass(gridHeaderBottomClass);
                        tdTempArr[i][j] = {"width": column.width,
                            "column": column,
                            "tdEl": headerTdEl,
                            "children": column.children.length};
                        continue;
                    }
                    // 是否可排序
                    if (column.sortable) {
                        headerTdEl.bind("click", {"me": me}, me._sort);
                    }
                    // 是否过滤
                    if (column.filter) {
                        $("<span>").addClass(gridHeaderFilterClass)
                                .click({"oTd": headerTdEl, "column": column, "me": me},
                        me._headerFilterPanel)
                                .hide()
                                .appendTo(headerTdEl);
                    }
                    headerTdEl.attr({"rowspan": rows.length - i, "depth": rows.length});
                    tdTempArr[i][j] = {"width": column.width,
                        "column": column,
                        "tdEl": headerTdEl};
                }
            }

            return tdTempArr;
        },
        /**
         * @private
         * @description 生成表格过滤面板
         * @param {Object} e 事件对象
         */
        _headerFilterPanel: function(e) {
            // 阻止事件冒泡
            e.stopImmediatePropagation();
            var me = e.data.me,
                    oTd = e.data.oTd,
                    oSpan = $(this),
                    filterPanel = oTd.data("filterPanel");
            // 判断点击是否同一列
            if (me.activeFilterTdEl && me.activeFilterTdEl.attr("column") !== oTd.attr("column")) {
                me.oldActiveFilterTdEl = me.activeFilterTdEl;
            }
            me._triggerBodyClick();
            // 当前过滤激活列
            me.activeFilterTdEl = oTd;
            if (filterPanel) {
                me.__setFilterPanelPosition(oSpan, filterPanel);
                oTd.data("created", true);
                filterPanel.show();
                return;
            }
            var column = e.data.column,
                    enableHdMenu = column.enableHdMenu,
                    obj,
                    addBtn,
                    resetBtn,
                    index = $.string.toNumber(oTd.attr("column")),
                    id = me.options.id + "-" + index + gridHeaderFilterSuffix,
                    btnId = me.options.id + "-" + index + gridHeaderFilterBtnSuffix,
                    hEl = $("<h1>").text(i18n.hideCol).attr("column", index),
                    textEl = $("<div>").addClass("title").text(i18n.filter),
                    panel = $("<div>").attr("id", id),
                    btnPanel = $("<div>").attr("id", btnId);

            filterPanel = $("<div>").click(function(e) {
                oTd.data("created", true);
            })
                    .addClass(me.floatBgClass + " sweet-grid-header-filter-panel")
                    .appendTo($(document.body));
            $.isArray(me.filterPanels) ? me.filterPanels.push(filterPanel) : "";
            // 绑定列隐藏事件
            if ($.isUndefined(enableHdMenu) || enableHdMenu) {
                hEl.bind("click", function(e) {
                    e.stopImmediatePropagation();
                    me.__onSingleColumnHiddenClick(e, $.string.toNumber($(this).attr("column")));
                    me._triggerBodyClick();
                }).appendTo(filterPanel);
            }
            textEl.appendTo(filterPanel);
            panel.appendTo(filterPanel);
            btnPanel.appendTo(filterPanel);
            // 计算过滤面板相对位置
            me.__setFilterPanelPosition(oSpan, filterPanel);

            // 生成过滤面板
            switch (column.filterType) {
                // 列表
                case dataType.LIST :
                    obj = me.__headerFilterListPanel(panel, column);
                    break;
                    // 字符串
                case dataType.STRING :
                    obj = me.__headerFilterStringPanel(panel);
                    break;
                    // 数值
                case dataType.NUMBER :
                    obj = me.__headerFilterNumberPanel(panel);
                    break;
                    // 日期
                case dataType.DATE :
                    obj = me.__headerFilterDatePanel(panel);
                    break;
                default :
                    me._error("Unsupported filter type [" + column.filterType + "].");
            }

            // 添加操作按钮
            addBtn = new Sweet.form.Button({
                width: 70,
                value: {value: 0, text: i18n.okBtn}
            });
            addBtn.addListener("click", function() {
                me.__onFilterOKClick(oTd, column.name);
            });
            resetBtn = new Sweet.form.Button({
                width: 70,
                value: {value: 1, text: i18n.clearSingleFilter}
            });
            resetBtn.addListener("click", function() {
                me.__onFilterResetClick(oTd, obj, column.name);
                me._triggerBodyClick();
            });
            new Sweet.panel.FlowPanel({
                width: "100%",
                height: 25,
                align: Sweet.constants.align.RIGHT,
                items: [addBtn, resetBtn],
                renderTo: btnId
            });

            oTd.data("created", true);
            oTd.data("filterPanel", filterPanel);
            oTd.data("filter", obj);
            me.filterObjs.push({"name": column.name, "filterType": column.filterType, "filter": obj, "tdEl": oTd});
        },
        /**
         * @private
         * @description 设置过滤窗口面板位置
         * @param {Object} relativeObj 相对位置对象
         * @param {Object} filterPanel 过滤面板对象
         */
        __setFilterPanelPosition: function(relativeObj, filterPanel) {
            var offset,
                    zIndex;
            // 计算offset
            offset = $.getFloatOffset(relativeObj, filterPanel, true);
            // 设置z-index
            zIndex = $.getMaxZIndex();
            filterPanel.css({"top": offset.top, "left": offset.left, "z-index": zIndex});
        },
        /**
         * @private
         * @description 单列隐藏
         * @param {Object} e 事件对象
         * @param {Number} index 列号
         * @param {Boolean} show 显示还是隐藏
         */
        __ColumnsHidden: function(hc) {
            var me = this,
                    show, i = 0,
                    count = me.count,
                    columns = me.headerColumns,
                    column,
                    tdEls = [];

            for (i = 0; i < hc.length; i++) {
                show = hc[i].show || false;
                tdEls = [];
                column = hc[i].index;
                if (0 < me.contentVTdEls.length) {
                    if (0 < me.contentTreeVTdEls.length) {
                        tdEls = me.contentVTdEls[column].concat(me.contentTreeVTdEls[column]);
                    } else {
                        tdEls = me.contentVTdEls[column];
                    }
                }
                if (show) {
                    me.hiddenColumn--;
                    // 显示表头
                    me.headerTdEls[column + count].show();
                    me.contentColEls[column + count].show();
                    // 显示表格内容
                    $.each(tdEls, function(i, o) {
                        o.show();
                    });
                } else {
                    // 只剩一列时，不允许隐藏
                    if (me.hiddenColumn === me.headerColumns.length - 1) {
                        return;
                    }
                    me.hiddenColumn++;
                    // 隐藏表头
                    me.headerTdEls[column + count].hide();
                    me.contentColEls[column + count].hide();
                    // 隐藏表格内容
                    $.each(tdEls, function(i, o) {
                        o.hide();
                    });
                }

                columns[column].hidden = !show;
            }
        },
        /**
         * @private
         * @description 单列隐藏
         * @param {Object} e 事件对象
         * @param {Number} index 列号
         * @param {Boolean} show 显示还是隐藏
         */
        __onSingleColumnHiddenClick: function(e, index, show) {
            var me = this;
            var show = show || false;
            me.__ColumnsHidden([{
                    index: index,
                    show: show
                }]);

            me.headerReRender = true;
            me._doLayout(true);
            // 设置列选中列表
            if (me.selectColList) {
                me.selectColList.setValue(me.__getSelectColumnData().value);
            }
        },
        /**
         * @private
         * @description 过滤面板点确定处理
         * @param {Object} tdEl 列对象
         * @param {String} name 列名
         */
        __onFilterOKClick: function(tdEl, name) {
            var me = this, filters, filterVal;
            $.each(me.filterObjs, function(index, obj) {
                var temp = obj.filter,
                        type = obj.filterType;
                if (obj.name !== name) {
                    return;
                }
                switch (type) {
                    // 列表
                    case dataType.LIST :
                        me.filters[obj.name] = {"type": type, "value": temp.getValue(), "text": temp.getText()};
                        break;
                        // 字符串
                    case dataType.STRING :
                        me.filters[obj.name] = {"type": type, "value": temp.getValue()};
                        break;
                        // 数值
                    case dataType.NUMBER :
                        me.filters[obj.name] = {"type": type, "value": temp.getValue()};
                        break;
                        // 日期
                    case dataType.DATE :
                        me.filters[obj.name] = {"type": type, "value": temp.getValue()};
                        break;
                    default :
                        me._error("Unsupported filter type [" + obj.dataType + "].");
                }
            });

            filters = me.filters[name];
            filterVal = filters.value;
            if (!filterVal) {
                // 返回布尔类型的，不向上冒泡处理
                if (!$.isBoolean(filterVal)) {
                    me._triggerBodyClick();
                }
                return;
            }
            if (filterVal && (dataType.LIST === filters.type ||
                    dataType.STRING === filters.type) && !filterVal.pass) {
                return;
            }
            me._triggerBodyClick();
            me.__setColumnFilterPic(tdEl, true);
            me.page.currentPage = 1;
            if (me.options.store) {
                me.options.store._setPage(me.getPageInfo());
                me.options.store.load(me.getAllConditions());
            } else {
                me._triggerHandler(null, "filter", me.getAllConditions());
            }
        },
        /**
         * @private
         * @description 过滤面板重置按钮事件
         * @param {Object} tdEl 列对象
         * @param {Object} obj 过滤条件对象
         * @param {String} name 列名
         */
        __onFilterResetClick: function(tdEl, obj, name) {
            var me = this;
            // 只有进行过滤的列，才执行重置
            obj.reset();
            if (0 < tdEl.find("." + gridHeaderFilterPicClass).length) {
                me.__setColumnFilterPic(tdEl);
                delete me.filters[name];
                me.page.currentPage = 1;
                if (me.options.store) {
                    me.options.store._setPage(me.getPageInfo());
                    me.options.store.load(me.getAllConditions());
                } else {
                    me._triggerHandler(null, "filter", me.getAllConditions());
                }
            }
        },
        /**
         * @private
         * @description 设置列过滤图片
         * @param {Object} tdEl 列对象
         * @param {Boolean} add 是否添加过滤图片，默认undefined
         */
        __setColumnFilterPic: function(tdEl, add) {
            if (add) {
                var textEl = tdEl.find("." + gridHeaderTextClass),
                        filterPic = $("<span>");
                filterPic.addClass(gridHeaderFilterPicClass).appendTo(textEl);
            } else {
                tdEl.find("." + gridHeaderFilterPicClass).remove();
            }
        },
        /**
         * @private
         * @description 生成列表面板
         * @param {String} o 待渲染目标对象
         * @param {Object} column 列描述
         * @return {Object} 返回列表对象
         */
        __headerFilterListPanel: function(o, column) {
            var grid = this;
            /**
             * @private
             * @description 列表面板对象
             * @param {String} o 待渲染目标对象
             * @param {Object} column 列描述
             * @return {Object} 返回列表面板对象
             */
            var ListPanel = function(o, column) {
                var id = o.attr("id");
                this.listPanel = new Sweet.list.List({
                    width: "100%",
                    height: "auto",
                    maxHeight: 150,
                    search: true,
                    multi: true,
                    tip: true,
                    widgetClass: gridHeaderFilterBgClass,
                    data: column.filterList,
                    renderTo: id
                });
            };

            /**
             * @private
             * @description 获取值，返回格式{"symbol": "IN", "value": }
             */
            ListPanel.prototype.getValue = function() {
                var me = this,
                        temp,
                        tempArr = [],
                        value = me.listPanel.getValue() || [];
                $.each(value, function(index, obj) {
                    tempArr.push(obj.value);
                });
                if (0 !== tempArr.length) {
                    temp = grid.__getFilterFormat("IN", tempArr, 0 < tempArr.length);
                }
                return temp;
            };

            /**
             * @private
             * @description 获取值显示的字符串，返回格式{"symbol": "IN", "text": }
             */
            ListPanel.prototype.getText = function() {
                var me = this,
                        temp,
                        tempArr = [],
                        value = me.listPanel.getValue() || [];
                $.each(value, function(index, obj) {
                    tempArr.push(obj.text);
                });
                if (0 !== tempArr.length) {
                    temp = grid.__getFilterFormat("IN", tempArr, 0 < tempArr.length);
                }
                return temp;
            };

            /**
             * @private
             * @description 清空值
             */
            ListPanel.prototype.reset = function() {
                var me = this;
                Sweet.Task.Delay.start({
                    id: grid.options.id + "-grid-list-delay",
                    run: function(args) {
                        me.listPanel.setValue({});
                    },
                    delay: 800
                });
            };

            o.addClass("filter-list");
            return new ListPanel(o, column);
        },
        /**
         * @private
         * @description 创建字符串过滤面板
         * @param {String} o 待渲染目标对象
         */
        __headerFilterStringPanel: function(o) {
            var grid = this;

            /**
             * @private
             * @description 设置文本框状态
             * @param {Object} obj 文本框对象
             * @param {String} value 值
             */
            function setTextDisabled(obj, value) {
                if (symbol.EQNULL === value ||
                        symbol.NOTNULL === value) {
                    obj.setDisabled(true);
                } else {
                    obj.setDisabled(false);
                }
            }
            /**
             * @private
             * @description 字符串过滤面板
             * @param {String} o 目标对象
             */
            var StringPanel = function(o) {
                var id = o.attr("id"),
                        radioGroup,
                        textField;
                radioGroup = this.radioGroup = new Sweet.form.RadioGroup({
                    width: 150,
                    height: 100,
                    columns: 1,
                    data: [{"text": i18n.exactMatch, "value": symbol.EQUAL, "checked": true},
                        {"text": i18n.fuzzyMatch, "value": symbol.LIKE},
                        {"text": i18n.notEqual, "value": symbol.NOTEQUAL},
                        {"text": i18n.eqNull, "value": symbol.EQNULL},
                        {"text": i18n.notNull, "value": symbol.NOTNULL}
                    ]
                });
                // 注册click事件
                radioGroup.addListener("click", function(e, data) {
                    setTextDisabled(textField, data.value.value);
                });

                textField = this.textField = new Sweet.form.TextField({
                    width: "100%",
                    widgetClass: gridHeaderFilterPadClass,
                    editable: true
                });

                new Sweet.panel.VPanel({
                    width: "100%",
                    height: 135,
                    items: [radioGroup, textField],
                    renderTo: id
                });

                return this;
            };

            /**
             * @private
             * @description 获取组件值
             * @return {Object} 返回格式{"symbol": , "value": }，value表示文本框值，symbol约定如下
             *  =：精确匹配
             *  LIKE：模糊匹配
             *  <>：不等于
             *  NULL：为空
             *  NOTNULL：非空
             */
            StringPanel.prototype.getValue = function() {
                var radioVal = this.radioGroup.getValue().value,
                        textVal = this.textField.getValue().value;
                if (symbol.EQNULL === radioVal ||
                        symbol.NOTNULL === radioVal) {
                    return grid.__getFilterFormat(radioVal, "", true);
                }
                if ($.isNotNull(textVal)) {
                    return grid.__getFilterFormat(radioVal, textVal, $.isNotNull(textVal));
                }
                return;
            };

            /**
             * @private
             * @description 清空字符串面板
             */
            StringPanel.prototype.reset = function() {
                this.radioGroup.setValue({"text": i18n.exactMatch, "value": symbol.EQUAL, "checked": true});
                this.textField.setValue({"value": "", "text": ""});
                setTextDisabled(this.textField, symbol.EQUAL);
            };

            o.addClass(gridHeaderFilterBgClass);
            return new StringPanel(o);
        },
        /**
         * @private
         * @description 创建日期过滤面板
         * @param {String} o 待渲染目标对象
         */
        __headerFilterDatePanel: function(o) {
            var grid = this;
            /**
             * @private
             * @description 创建日期面板
             * @param {Object} o 待渲染目标对象
             */
            var DatePanel = function(o) {
                var id = o.attr("id"),
                        dateFrom,
                        dateTo;

                o.parent().addClass("sweet-grid-header-filter-date");
                dateFrom = this.dateFrom = new Sweet.form.Date({
                    blank: false,
                    label: true,
                    labelWidth: 35,
                    labelText: i18n.from,
                    width: "100%"
                });

                dateTo = this.dateTo = new Sweet.form.Date({
                    blank: false,
                    label: true,
                    labelWidth: 35,
                    labelText: i18n.to,
                    width: "100%"
                });

                new Sweet.panel.VPanel({
                    width: 205,
                    height: 55,
                    items: [dateFrom, dateTo],
                    widgetClass: gridHeaderFilterPadClass,
                    renderTo: id
                });

                return this;
            };

            /**
             * @private
             * @description 获取日期面板值
             * @return {Object} 返回值，格式为{"<": , ">": }
             */
            DatePanel.prototype.getValue = function() {
                var fromVal = this.dateFrom.getValue() || {},
                        toVal = this.dateTo.getValue() || {},
                        a,
                        b,
                        temp;
                if ($.isNull(fromVal.data) && $.isNull(toVal.data)) {
                    return;
                }
                // DTS2013073006399 添加日期校验
                if ($.isNull(fromVal.data)) {
                    Sweet.Dialog.warn({"message": i18n.validate.beginDate, "propagation": true});
                    return false;
                }
                if ($.isNull(toVal.data)) {
                    Sweet.Dialog.warn({"message": i18n.validate.endDate, "propagation": true});
                    return false;
                }
                // 比较日期大小
                if (-1 !== $.date.compare(fromVal.value, toVal.value, "-")) {
                    Sweet.Dialog.warn({"message": i18n.validate.compare, "propagation": true});
                    return false;
                }
                a = $.extend(grid.__getFilterFormat(symbol.GT, fromVal.data), {text: fromVal.value});
                b = $.extend(grid.__getFilterFormat(symbol.LT, toVal.data), {text: toVal.value});
                temp = [a, b];
                return temp;
            };

            /**
             * @private
             * @description 清空日期面板
             */
            DatePanel.prototype.reset = function() {
                this.dateFrom.setValue({"value": ""});
                this.dateTo.setValue({"value": ""});
            };

            o.addClass(gridHeaderFilterBgClass);
            return new DatePanel(o);
        },
        /**
         * @private
         * @description 创建数值过滤面板
         * @param {String} o 待渲染目标对象
         */
        __headerFilterNumberPanel: function(o) {
            var grid = this,
                    nullValue = {"value": ""};
            /**
             * @private
             * @description 创建数值面板
             * @param {Object} o 待渲染目标对象
             */
            var NumberPanel = function(o) {
                var id = o.attr("id"),
                        largeObj,
                        smallObj,
                        equalObj;
                largeObj = this.largeObj = new Sweet.form.NumberField({
                    blank: false,
                    label: true,
                    labelWidth: 15,
                    allowDecimals: true,
                    labelText: symbol.GT,
                    symbol: false,
                    width: "100%"
                });
                largeObj.addListener("focus", function() {
                    equalObj.setValue(nullValue);
                });
                smallObj = this.smallObj = new Sweet.form.NumberField({
                    blank: false,
                    label: true,
                    labelWidth: 15,
                    allowDecimals: true,
                    labelText: symbol.LT,
                    symbol: false,
                    width: "100%"
                });
                smallObj.addListener("focus", function() {
                    equalObj.setValue(nullValue);
                });
                equalObj = this.equalObj = new Sweet.form.NumberField({
                    blank: false,
                    label: true,
                    labelWidth: 15,
                    allowDecimals: true,
                    labelText: symbol.EQUAL,
                    symbol: false,
                    width: "100%"
                });
                equalObj.addListener("focus", function() {
                    largeObj.setValue(nullValue);
                    smallObj.setValue(nullValue);
                });
                new Sweet.panel.VPanel({
                    width: "100%",
                    height: 85,
                    items: [largeObj, smallObj, equalObj],
                    widgetClass: gridHeaderFilterPadClass,
                    renderTo: id
                });

                return this;
            };

            /**
             * @private
             * @description 获取数值组件值
             * @returns {Object} 返回数值组件值，格式为{symbol: value, ..}
             */
            NumberPanel.prototype.getValue = function() {
                var me = this,
                        temp = [],
                        large = me.largeObj.getValue(),
                        small = me.smallObj.getValue(),
                        equal = me.equalObj.getValue();
                if ($.isNotNull(equal.value)) {
                    temp.push(grid.__getFilterFormat(symbol.EQUAL, equal.value));
                } else {
                    if ($.isNotNull(large.value)) {
                        temp.push(grid.__getFilterFormat(symbol.GT, large.value));
                    }
                    if ($.isNotNull(small.value)) {
                        temp.push(grid.__getFilterFormat(symbol.LT, small.value));
                    }
                }

                return 0 === temp.length ? null : temp;
            };

            /**
             * @private
             * @description 重置数值面板
             */
            NumberPanel.prototype.reset = function() {
                var me = this;
                me.largeObj.setValue(nullValue);
                me.smallObj.setValue(nullValue);
                me.equalObj.setValue(nullValue);
            };

            o.addClass(gridHeaderFilterBgClass);
            return new NumberPanel(o);
        },
        /**
         * @private
         * @description 格式化过滤值
         * @param {String} symbol 符号
         * @param {Object/String/Array} value 值
         * @param {Boolean} pass 是否通过
         */
        __getFilterFormat: function(symbol, value, pass) {
            return {"symbol": symbol, "value": value, "pass": pass};
        },
        /**
         * @private
         * @description 处理表头TD标签，鼠标移入时动作
         * @param {Object} e 事件对象
         */
        __onHeaderTdMouseEnter: function(e) {
            var me = e.data.me,
                    o = $(this),
                    rowspan,
                    spanEl = o.find("." + gridHeaderFilterClass),
                    position = o.position();
            // 控制文字颜色
            me.__dealHeaderTdTextHover(o, spanEl, true);
            if (spanEl && 0 < spanEl.length) {
                rowspan = $.string.toNumber(o.attr("rowspan"));
                if (1 === rowspan) {
                    spanEl.addClass(gridHeaderFilterOneClass);
                } else if (2 === rowspan) {
                    spanEl.addClass(gridHeaderFilterTwoClass);
                } else {
                    me._error("Unsupported rowspan. rowspan = " + rowspan);
                    return;
                }
                spanEl.show();
                // 计算位置
                spanEl.css({"left": position.left + o.width() - spanEl.width(), "top": position.top});
            }
        },
        /**
         * @private
         * @description 处理表头TD标签，鼠标移出时动作
         * @param {Object} e 事件对象
         * @param {Object} obj 关闭对象
         */
        __onHeaderTdMouseLeave: function(e, obj) {
            var me,
                    o = obj || $(this),
                    filterPanel = o.data("filterPanel"),
                    spanEl = o.find("." + gridHeaderFilterClass);
            if (filterPanel && $.isVisiable(filterPanel)) {
                return;
            }
            me = e ? (e.data ? e.data.me : this) : this;
            // 控制文字颜色
            me.__dealHeaderTdTextHover(o, spanEl);
            if (spanEl && !o.data("created")) {
                spanEl.hide();
            }
        },
        /**
         * @private
         * @description 处理文字颜色
         * @param {Object} oTd TD对象
         * @param {Object} oSpan span对象
         * @param {Boolean} b 增加还是删除样式
         */
        __dealHeaderTdTextHover: function(oTd, oSpan, b) {
            if (oTd.hasClass(gridHeaderSortAscClass) ||
                    oTd.hasClass(gridHeaderSortDescClass) ||
                    oTd.data("created")) {
                return;
            }
            if (b) {
                oTd.addClass(gridHeaderTdHoverClass);
                oTd.find("div:first").addClass(gridHeaderTextHoverClass);
            } else {
                oTd.removeClass(gridHeaderTdHoverClass);
                oTd.find("div:first").removeClass(gridHeaderTextHoverClass);
            }
        },
        /**
         * @private 
         * @description 修正列数据
         * @param {Array} arr 待修正数组
         * @TODO 支持表头无限级合并
         */
        _amendHeader: function(arr) {
            var temp, children, destArr = [], k = 0;
            // 处理非列合并情况
            if (1 === arr.length) {
                for (var m = 0; m < arr[0].length; m++) {
                    destArr[k] = arr[0][m];
                    k++;
                }

                return destArr;
            }
            for (var i = arr.length - 2; i >= 0; i--) {
                for (var j = 0; j < arr[i].length; j++) {
                    temp = arr[i][j];
                    children = temp.children;
                    if (children && 1 < children) {
                        destArr = destArr.concat(arr[i + 1].slice(0, children));
                        arr[i + 1].splice(0, children);
                        k += children;
                    } else {
                        destArr[k] = arr[i][j];
                        k++;
                    }
                }
            }
            return destArr;
        },
        /**
         * @private
         * @description 解析表头，将树形表头转换成数组
         * @param {Array} trees 树形结构数据
         * @param {Number} depth 深度
         * @param {Array} rows 行数组
         */
        _parseHeader: function(trees, depth, rows) {
            for (var i = 0; i < trees.length; i++) {
                trees[i].colspan = 1;
                if (trees[i].children && trees[i].children.length > 0) {
                    trees[i].colspan = trees[i].children.length;
                    this._parseHeader(trees[i].children, depth + 1, rows);
                }
                if (!rows[depth]) {
                    rows[depth] = [];
                }
                if (rows[depth][i]) {
                    rows[depth][rows[depth].length] = trees[i];
                } else {
                    rows[depth][i] = trees[i];
                }
            }
        },
        _addLoading : function(){
            var me = this;
            me.loadEl = $("<div>")
                    .css({
                        "background" : "#eeeeee",
                        "display" : "none",
                        "height" : 30,
                        "position" : "absolute",
                        "opacity" : 0.6,
                        "top" : 0
                    });
            me.loadEl.appendTo(me.gridEl);
        },
        /**
         * @private
         * @description 创建表格内容
         */
        _createGridContent: function() {
            // 先销毁之前的元素，再创建
            this.__destroyTableContent();
            var me = this,
                    contentEl = me.contentEl = $("<div>").addClass(contentElClass).appendTo(me.gridEl),
                    contentDivEl = me.contentDivEl = $("<div>").appendTo(contentEl);
            
            me.contentTableEl = $("<table>").appendTo(contentDivEl);
            me.headerColumns ? me.headerColumns.length : maxColumnLength;
            me.singleSelect = me.options.data.singleSelect || false;
            me.checkbox = me.options.data.checkbox;
            me.sn = me.options.data.sn || false;

            // 添加rowId
            me._addRowId(me.options.data.data);
            // 选中的表格数据
            me.selectedData = {};
            // 选中的表格记录数
            me.selectedDataLength = 0;
            // 选中树形表格数据
            me.selectedTreeData = {};
            me.selectedTreeDataLength = 0;
            // 表格col元素对象数组
            me.contentColEls = [];
            // 记录行
            me.contentTrEls = [];
            // 记录内容区单元格对象的二位数组
            me.contentTdEls = [];
            // 记录内容区单元格对象的二位数组，按列排
            me.contentVTdEls = [];
            // 记录树节点行
            me.contentTreeTrEls = [];
            // 记录内容区树形单元格对象的二位数组
            me.contentTreeTdEls = [];
            // 记录内容区树形单元格对象的二位数组，按列排
            me.contentTreeVTdEls = [];
            // 记录checkbox
            me.checkboxTdEls = [];
            // 记录树节点checkbox
            me.checkboxTreeTdEls = [];
            // 记录SN对象
            me.SNTdEls = [];
            // 树表数据
            me.treeData = [];
            // 单次树节点加载的长度
            me.treeRow = 0;
            // 记录实际行和逻辑行对应关系
            me.rowRelations = {};
            
            //只有准备好了，才创建tr,td单元格，及高度必须要取得一个固定值
            if(me._readyBuildGridContent()){
                me.options.beforeMoveGrid();
                me._buildMoveGridContent();
                me.options.afterMoveGrid();
                // 矩阵转换
                me.contentVTdEls = $.matrix.reversal(me.contentTdEls);
            }
            
            // 生成表格左键菜单区域
            me._gridMenuId = me.options.id + "-grid-menu";
            // 绑定表格内容区事件
            me._bindGridContentEvent();
        },
        _readyBuildGridContent : function(){
            var me = this,
                    h = me.options.height,
                    dataLen = (me.options.data.data || []).length,
                    contentH = 0,
                    headerHeight = 30,
                    rowHeight = 30;
            
            me.rowH = rowHeight;
            contentH = dataLen * me.rowH;
            me.contentDivEl.height(contentH).css({position: "absolute", top : "0px"});
            
            if(String(h).indexOf("%") !== -1){
                me.isNotReady = false;
                return false;
            }
            me.isNotReady = true;
            me.pageCount = Math.floor((h - headerHeight) / me.rowH);
            if(dataLen !== 0 && dataLen <= me.pageCount){
				me.contentTableEl.height(h - headerHeight).css("position", "absolute");
            } else {
                me.contentTableEl.height(h - headerHeight).css("position", "absolute");
            }
            
            return true;
        },
        /**
         * @private
         * @description 创建表格内容区col元素，对表格单元格的统一集中处理
         */
        _buildGridContentCol: function() {
            var me = this,
                    headerColumns = me.headerColumns || [],
                    length = headerColumns.length,
                    count = me.count || 0,
                    temp,
                    tempColumn,
                    i,
                    j;
            for (i = 0; i < count; i++) {
                temp = $("<col>").appendTo(me.contentTableEl);
                me.contentColEls.push(temp);
            }
            for (j = 0; j <= length; j++) {
                tempColumn = headerColumns[j];
                temp = $("<col>").appendTo(me.contentTableEl);
                if (tempColumn && tempColumn.hidden) {
                    temp.hide();
                }
                me.contentColEls.push(temp);
            }
        },
        /**
         * @private
         * @description 数据转换，数组转换成JSON，如果是JSON，则复制一份返回
         * @param {Object} data 数据
         */
        _toJson: function(data) {
            var me = this;
            // 对数据的预处理，如果是二维数组，需要转换成json格式数据
            if (data && 0 < data.length && $.isArray(data[0])) {
                return me.__preTreatData() || [];
            } else {
                return $.objClone(data) || [];
            }
        },
        /**
         * @private
         * @description 绑定表格内容区事件，采用事件冒泡方式处理所有的事件
         */
        _bindGridContentEvent: function() {
            var me = this;
            me.contentEl.scroll({"me":me},me._onScroll).click({"me" : me}, me._contentElClick);
        },
		_contentElClick : function(e) {                    // 单击事件
			var obj = $(e.target), row, column, tempData, tempFunc, tempOperType;
			var me = e.data.me, columns = me.headerColumns, count = me.count;
			// 处理编辑、删除、修改事件
			if (obj.hasClass(gridContentEditClass)) {
				tempOperType = Sweet.constants.operType.EDIT;
			} else if (obj.hasClass(gridContentModifyClass)) {
				tempOperType = Sweet.constants.operType.MODIFY;
			} else if (obj.hasClass(gridContentDeleteClass)) {
				tempOperType = Sweet.constants.operType.DELETE;
			} else if (obj.hasClass(gridContentCloseClass)) {
				tempOperType = Sweet.constants.operType.CLOSE;
			} else if (obj.hasClass(gridContentPauseClass)) {
				tempOperType = Sweet.constants.operType.PAUSE;
			} else if (obj.hasClass(gridContentStartClass)) {
				tempOperType = Sweet.constants.operType.START;
			} else if (obj.hasClass(gridContentResetClass)) {
				tempOperType = Sweet.constants.operType.RESET;
			} else if (obj.hasClass(gridContentDetailClass)) {
				tempOperType = Sweet.constants.operType.DETAIL;
			} else if (obj.hasClass(gridContentConfirmClass)) {
				tempOperType = Sweet.constants.operType.CONFIRM;
			}
			// 回调注册函数
			if (tempOperType) {
				row = $.string.toNumber(obj.attr("row"));
				column = $.string.toNumber(obj.attr("column"));
				tempData = {
					"row": row,
					"column": column,
					"rowData": $.objClone(me.options.data.data[row])
				};
				tempFunc = columns[column - count].rendererArr[tempOperType];
				tempFunc.call(this, e, tempData);
				return;
			}

			// 处理未选中复选框事件
			if (obj.hasClass(checkboxUncheckdClass)) {
				me._onRowClick(obj, true);
				// 触发checkbox点击事件
				me._triggerCheckBoxHandler(e, obj, true);
				return;
			}
			// 处理选中复选框事件
			if (obj.hasClass(checkboxCheckdClass)) {
				me._onRowClick(obj, false);
				me._triggerCheckBoxHandler(e, obj, false);
				return;
			}

			// 是否点击菜单
			var aEl = obj.parent().parent();
			if (0 === e.button && aEl.hasClass(gridContentMenuClass)) {
				column = $.string.toNumber(aEl.attr("column"));
				var columnObj = columns[column - count],
						showMenu = true;

				//默认配置了menu的都显示，但是有的单元格不需要显示时，用户自己判断(回调)
				if (columnObj.beforeShowMenu && $.isFunction(columnObj.beforeShowMenu)) {
					tempData = {
						"column": column,
						"name": columnObj.name,
						"rowData": $.objClone(me.options.data.data[row])
					};
					showMenu = columnObj.beforeShowMenu.call(this, tempData);
				}
				//如果用户没有特别需要，默认显示menu
				if (showMenu) {
					if (me._gridMenu) {
						me._gridMenu.destroy();
					}
					column = $.string.toNumber(aEl.attr("column"));
					var x = e.pageX;
					//修正表格最右边数字钻取时，menu超出边界的情况,150为菜单宽度
					if(x + 150 > me.gridEl.width() - scrollWidth - 2){
						x =  me.gridEl.width() - scrollWidth - 2 - 150;
					}
					me._gridMenu = new Sweet.menu.Menu({
						renderTo: me._gridMenuId,
						X: x,
						Y: e.pageY,
						itemClick: columns[column - count].itemClick,
						items: columns[column - count].menus
					});
					e.stopPropagation();
					return;
				}
			}
		},
        /**
         * @private
         * @description 触发checkbox点击事件
         * @param {Object} event 事件
         * @param {Object} obj checkbox对象
         * @param {Boolean} checked 是否选中
         */
        _triggerCheckBoxHandler: function(event, obj, checked) {
            var me = this,
                    row,
                    isTree,
                    tempData;
            row = $.string.toNumber(obj.attr("row"));
            isTree = obj.attr("tree");
            if ("true" === isTree) {
                tempData = $.objClone(me.treeData[row]);
            } else {
                tempData = $.objClone(me.options.data.data[row]);
            }
            tempData.checked = checked;
            me._triggerHandler(event, eventNameCheckBoxClick, tempData);
        },
        /**
         * @private
         * @description 二维数组转换成json格式
         */
        __preTreatData: function() {
            var me = this,
                    finalData = [],
                    tempData = me.options.data.data,
                    tempDataLength = tempData.length,
                    columns = me.headerColumns,
                    columnLength = me.headerColumns.length;

            for (var i = 0; i < tempDataLength; i++) {
                finalData[i] = {};
                for (var j = 0; j < columnLength; j++) {
                    finalData[i][columns[j].name] = tempData[i][j];
                }
            }

            return finalData;
        },
        /**
         * @private
         * @description 从表格的整个数据中取得表格当前可视界面需要展现的数据
         * @param {type} info 垂直滚动条的信息，包含top, scrollHeight
         * @returns {Array} 返回当前表格可视界面需要展现数据
         */
        _getCurrentDisplayData : function(info){
            var me = this,
                    pageCount = me.pageCount,
                    tempData = [],
                    i = 0,
                    scrollCount = 0,
                    rows = me.options.data.data ? me.options.data.data.length : 0;
            
            scrollCount = info ? (Math.ceil((info.top * rows) / info.scrollHeight)) : 0;
            for(i = scrollCount; i < (scrollCount + pageCount); i++){
                if(i >= rows){
                    break;
                }
                tempData.push(me.options.data.data[i]);
            }
            
            return tempData;
        },
        _buildMoveGridContent : function(){
			var me = this,
                    pageCount = me.pageCount,
                    rows = me.options.data.data ? me.options.data.data.length : 0,
                    tempData = [];
            
            if(rows < pageCount){
                var temp = pageCount - rows;
                var finalRowId = rows <= 0 ? 0 : me.options.data.data[rows-1].rowId;
                for(var i = 0; i < temp; i++){
                    me.options.data.data.push({
                        rowId : finalRowId + i + 1
                    });
                }
            }
            tempData = me._getCurrentDisplayData();
            //如果没有数据，什么也不做
            if(tempData.length <= 0){
                return tempData;
            }
            me._buildGridContentCol();
            // 添加rowId
            me._buildGridTrContent(tempData);
            me._refreshRowRelations(tempData);
        },
        /**
         * @private
         * @description 插入表格数据，实现向前或向后追加功能，不能与store一起使用
         * @param {Array} data 待插入数据
         * @param {Boolean} before 是否向前追加
         */
        _buildInsertGridContent: function(data, before) {
            var me = this, timeBegin = $.date.getMilliseconds(), timeEnd;
            me._info("_buildInsertGridContent() begin");

            // 添加rowId
            me._addRowId(data, me.options.data.data.length);
            me.options.data.data = me.options.data.data.concat(data);
            me._buildGridTrContent(data, before);
            me._refreshContentSN();

            timeEnd = $.date.getMilliseconds();
            me._info("Render grid content. Time-consuming = " + (timeEnd - timeBegin) + "ms");
            me._info("_buildInsertGridContent() end");
        },
        /**
         * @private
         * @description 生成表格行数据
         * @param {Array} data 数据
         * @param {Boolean} before 是否向前追加，默认向后追加
         */
        _buildGridTrContent: function(data, before) {
            var me = this,
                    rows = data.length,
                    row, // 行号
                    columns = me.headerColumns || [], // 列信息
                    trEl,
                    tdEl,
                    checkboxEl,
                    SNEl,
                    temp,
                    depth = 0;                              // 深度，默认为0

            // 绘制表格
            for (var i = 0; i < rows; i++) {
                temp = data[i];
                row = temp.rowId - 1;
                trEl = $("<tr>").addClass(gridContentTrClass);
                trEl.bind("click", {"me": me, "tr": trEl, "eventName": eventNameRowClick}, me._onTrClick)
                        .bind("dblclick", {"me": me, "tr": trEl, "eventName": eventNameRowDBClick}, me._onTrClick);
                // 行变色处理
                me._addRowColor(trEl, temp.options);
                me.contentTdEls[row] = [];
                if (me.checkbox) {
                    checkboxEl = me._getCheckbox(row).appendTo(trEl);
                    me.checkboxTdEls[row] = checkboxEl;
                }
                if (me.sn) {
                    SNEl = me._getSN(temp.rowId).appendTo(trEl);
                }

                // 生成数据单元格
                for (var j = 0; j < columns.length; j++) {
                    tdEl = me._getContentTd({"row": row,
                        "column": j + me.count,
                        "rowData": temp,
                        "columnObj": columns[j],
                        "depth": depth})
                            .appendTo(trEl);
                    me.contentTdEls[row][j] = tdEl;
                }
                // 添加列，用以填充表格剩余宽度 DTS2013090208329
                me.contentTdEls[row][columns.length] = $("<td>").appendTo(trEl);

                if (before) {
                    trEl.prependTo(me.contentTableEl);
                } else {
                    trEl.appendTo(me.contentTableEl);
                }

                me.contentTrEls[row] = trEl;
            }
        },
        /**
         * @private
         * @description 生成表格树节点数据
         */
        _buildGridTreeContent: function() {
            this._info("_buildGridTreeContent() begin");
            var timeBegin = $.date.getMilliseconds(), timeEnd;
            var me = this,
                    lazyLoadRows = me.lazyLoadRows;

            // 防止越界查找，并关闭定时器
            if (0 === me.tempTreeData.length || me.treeDataIndex >= me.treeData.length) {
                Sweet.Task.Timeout.stop(me.timerGridTreeContent, function() {
                    me._refreshContentSN();
                });
                // 矩阵转换
                me.contentTreeVTdEls = $.matrix.reversal(me.contentTreeTdEls);
                return;
            }

            var data = me.treeData;
            var treeDataLength = data.length;
            // 实际行数
            var rows = Math.floor((treeDataLength - me.treeDataIndex) / lazyLoadRows) > 0 ?
                    lazyLoadRows : treeDataLength - me.treeDataIndex;
            // 行号
            var row;
            // 临时行号
            var tempTreeRow = 0;
            // 或取待显示数据
            var tempData = data.slice(me.treeDataIndex, me.treeDataIndex + rows);
            // 列信息
            var columns = me.headerColumns || [];
            var trEl;
            var tdEl;
            var checkboxEl;
            var SNEl;
            // 取深度
            var depth = $.string.toNumber(me.rowTreeTdEl.attr("depth")) + 1;
            var treeTrEls = me.rowTreeTdEl.data("treeTrEls");

            // 绘制表格
            for (var i = 0; i < rows; i++) {
                row = i + me.treeDataIndex;
                tempTreeRow = i + me.tempTreeDataIndex;
                trEl = $("<tr>").addClass(gridContentTrClass).attr("tree", "true");
                trEl.bind("click", {"me": me, "tr": trEl, "eventName": eventNameRowClick}, me._onTrClick)
                        .bind("dblclick", {"me": me, "tr": trEl, "eventName": eventNameRowDBClick}, me._onTrClick);
                // 行变色处理
                me._addRowColor(trEl, tempData[i].options);
                me.contentTreeTdEls[row] = [];
                if (me.checkbox) {
                    checkboxEl = me._getCheckbox(row, true).appendTo(trEl);
                    me.checkboxTreeTdEls[row] = checkboxEl;
                }
                if (me.sn) {
                    SNEl = me._getSN("").appendTo(trEl);
                }

                // 生成数据单元格
                for (var j = 0; j < columns.length; j++) {
                    tdEl = me._getContentTd({"row": row,
                        "column": j + me.count,
                        "rowData": tempData[i],
                        "columnObj": columns[j],
                        "depth": depth,
                        "isTree": true})
                            .appendTo(trEl);
                    me.contentTreeTdEls[row][j] = tdEl;
                }
                me.contentTreeTdEls[row][columns.length] = $("<td>").appendTo(trEl);
                trEl.insertAfter(me.rowTreeEl);

                me.contentTreeTrEls[row] = trEl;
                treeTrEls[tempTreeRow] = trEl;
            }

            // 索引位置增加
            me.treeDataIndex += rows;
            me.tempTreeDataIndex += rows;

            timeEnd = $.date.getMilliseconds();
            me._info("Render grid content. Time-consuming = " + (timeEnd - timeBegin) + "ms");
            me._info("_buildGridTreeContent() end");
        },
        /**
         * @private
         * @description 添加行变色
         * @param {Object} trEl 行对象
         * @param {Object} opts 行配置参数
         */
        _addRowColor: function(trEl, opts) {
            if (!opts) {
                return;
            }
            var color = opts.color,
                    cssColorName = trColor[color];
            if (cssColorName) {
                trEl.addClass(cssColorName);
            }
        },
        /**
         * @private
         * @description 行点击事件,配置checkbox时，只有点击checkbox，才记录到selectData中去
         * @param {Object} e 事件对象
         */
        _onTrClick: function(e) {
            var me = e.data.me,
                    tr = e.data.tr,
                    eName = e.data.eventName,
                    row = $.string.toNumber(tr.attr("row")),
                    targetObj,
                    rowData = [],
                    realRow,
                    trEl;
            // 是否单选
            if (me.checkbox) {
                return;
            }
            targetObj = me.__findTargetTr(row);
            realRow = targetObj.realRow;
            // 查找当前选中的行
            trEl = me._getSelectedFirstRow();
            if(me.options.data.checkbox){
                if (targetObj.tree) {
                    rowData.push(me.treeData[realRow]);
                } else {
                    rowData.push(me.options.data.data[realRow]);
                }
            } else {
                if (trEl && 0 < trEl.length) {
                    trEl = $(trEl);
                    trEl.removeClass(gridContentRowSelectedClass);
                } 
                delete me.selectedTreeData;
                delete me.selectedTreeDataLength;
                me.selectedTreeData = {};
                me.selectedTreeDataLength = 0;
                delete me.selectedData;
                delete me.selectedDataLength;
                me.selectedData = {};
                me.selectedDataLength = 0;
                
                //处理选中效果
                tr.addClass(gridContentRowSelectedClass);
                if (targetObj.tree) {
                    me.selectedTreeData[me.treeData[realRow].rowId] = me.treeData[realRow];
                    me.selectedTreeDataLength = 1;
                } else {
                    me.selectedData[me.options.data.data[realRow].rowId] = me.options.data.data[realRow];
                    me.selectedDataLength = 1;
                }
                rowData = me.getSelectedValue();
            }
            
            // 触发行点击事件
            me._triggerHandler(e, eName, {"row": row, "rowData": rowData});
        },
        /**
         * @private
         * @description 重新设置表格内容区宽度
         */
        _resetContentTdELWidth: function() {
            var me = this;
            $.each(me.contentColEls, function(index, obj) {
                me._resetContentTdELWidthByCol(index);
            });
        },
        /**
         * @private
         * @description 按列设置表格内容区宽度
         * @param {Number} index 列索引
         */
        _resetContentTdELWidthByCol: function(index) {
            var me = this;
            if (me.widths) {
                me.contentColEls[index].width(me.widths[index] + tdBorder);
            }
        },
        /**
         * @private
         * @description 刷新序列号
         */
        _refreshContentSN: function() {
            var me = this,
                    snEls,
                    snElsLength,
                    i;
            if (me.options.data.sn) {
                snEls = me.contentTableEl.find("." + gridSNClass);
                snElsLength = snEls.length;
                for (i = 0; i < snElsLength; i++) {
                    $(snEls[i]).text(i + 1);
                }
            }

        },
        /**
         * @private
         * @description 刷新逻辑行和实际行的对应关系
         * @param {Array} data 可视区域显示的数据
         */
        _refreshRowRelations: function(data) {
            var me = this,
                    trLen,
                    dataLen = data ? data.length : 0,
                    trs,
                    row,
                    tempTrEl,
                    j;

            if(me.options.tree){
                trLen = me.contentTreeTrEls.length;
                trs = me.contentTreeTrEls;
            } else {
                trLen = me.contentTrEls.length;
                trs = me.contentTrEls;
            }
            
            if(dataLen === 0 || trLen !== dataLen){
                return;
            }
            for (j = 0; j < trLen; j++) {
                tempTrEl = trs[j];
                row = data[j].rowId;
                if (tempTrEl) {
                    tempTrEl.attr("row", row);
                }
            }
        },
        /**
         * @private
         * @description 返回行对象
         */
        __getContentTrEls: function() {
            return this.contentTableEl.find("." + gridContentTrClass);
        },
        /**
         * @private
         * @description 生成复选框对象
         * @param {Number} row 行号
         * @param {Boolean} isTree 是否树
         */
        _getCheckbox: function(row, isTree) {
            var tdEl = $("<td>"),
                    divEl = $("<div>").addClass(gridCheckboxClass).appendTo(tdEl),
                    aEl = $("<a>").addClass(checkboxUncheckdClass)
                    .attr({"row": row})
                    .appendTo(divEl);
            if (isTree) {
                aEl.attr("tree", "true");
            }

            return tdEl;
        },
        /**
         * @private
         * @description 生成列数
         * @param {Number} sn 序号
         */
        _getSN: function(sn) {
            var tdEl = $("<td>");
            $("<div>").addClass(gridSNClass).attr("title", sn).text(sn).appendTo(tdEl);

            return tdEl;
        },
        /**
         * @private
         * @description 生成数据单元格
         * @param {Object} params 参数，格式如下：
         *      {Number} row 行数
         *      {Number} column 列数
         *      {Object} rowData 行数据
         *      {Object} columnObj 列信息
         *      {Number} depth 深度
         *      {Boolean} isTree 是否树节点
         */
        _getContentTd: function(params) {
            var me = this,
                    row = params.row,
                    column = params.column,
                    columnObj = params.columnObj,
                    depth = params.depth,
                    isTree = params.isTree,
                    tdEl = $("<td>"),
                    divEl = $("<div>").appendTo(tdEl),
                    tempParams;
            tempParams = {
                "row": row,
                "column": column,
                "rowData": params.rowData,
                "columnObj": columnObj,
                "divEl": divEl,
                "depth": depth,
                "isTree": isTree,
                "tdEl": tdEl
            };

            // 处理表格内部数据对其方式
            me.__getContentTdAlign(tempParams);

            // 是否用户有对列的处理
            me.__getContentTdRender(tempParams);

            // 绑定TD单击事件
            me.__bindContentTdClick(tempParams);

            // 是否隐藏列
            if (columnObj.hidden) {
                tdEl.hide();
            }

            return tdEl;
        },
        /**
         * @private
         * @description 绑定表格内容区TD标签click事件
         * @param {Object} params 参数
         */
        __bindContentTdClick: function(params) {
            var me = this,
                    tdEl = params.tdEl,
                    row = params.row,
                    column = params.column,
                    columnObj = params.columnObj;
            tdEl.bind("click",
                    {
                        "me": me,
                        "row": row,
                        "column": column,
                        "name": columnObj.name,
                        "rowData": $.objClone(params.rowData)},
            function(e) {
                var row = e.data.row;
                var column = e.data.column;
                var name = e.data.name;
                var data = {"row": row, "column": column, "name": name, "rowData": e.data.rowData};
                e.data.me._triggerHandler(e, eventNameCellClick, data);
            });
        },
        /**
         * @private 
         * @description 表格内容区对隐藏列处理
         * @param {Object} params 参数
         */
        __getContentTdAlign: function(params) {
            var column = params.columnObj,
                    divEl = params.divEl;
            if (column.align) {
                // 右对齐
                if (Sweet.constants.align.RIGHT === column.align) {
                    divEl.addClass(gridContentDataRightClass);
                }
                // 居中对齐
                else if (Sweet.constants.align.CENTER === column.align) {
                    divEl.addClass(gridContentDataCenterClass);
                }
                // 默认左对齐
                else {
                    divEl.addClass(gridContentDataLeftClass);
                }
            }
            else {
                // 组件内部根据数据类型处理数据对其方式
                if (Sweet.constants.dataType.NUMBER === column.dataType) {
                    divEl.addClass(gridContentDataRightClass);
                }
            }
        },
        /**
         * @private
         * @description 表格内容区数据处理
         * @param {Object} params 参数，格式如下：
         *      {Number} row 行
         *      {Number} column 列
         *      {Object} rowData 行数据
         *      {Object} columnObj 列描述
         *      {Object} divEl 内容区附着对象
         *      {Number} depth 深度
         *      {Boolean} isTree 是否树节点数据
         */
        __getContentTdRender: function(params) {
            var me = this,
                    row = params.row,
                    column = params.column,
                    columnObj = params.columnObj,
                    divEl = params.divEl,
                    depth = params.depth,
                    isTree = params.isTree,
                    tempDivContent,
                    tempParams = {},
                    tempData,
                    aMenu = "<a class='" + gridContentMenuClass + "' column='" + column + "'>";
            if (columnObj.renderer) {
                tempParams = {
                    "row": row,
                    "column": column,
                    "data": params.rowData[columnObj.name],
                    "rowData": $.objClone(params.rowData),
                    "columnDesc": $.objClone(columnObj)
                };
                tempDivContent = columnObj.renderer.call(null, tempParams);
                if (columnObj.menus) {
                    $(aMenu).html(tempDivContent)
                            .appendTo(divEl);
                } else {
                    divEl.html(tempDivContent);
                }
            } else {
                // 处理表格型数据
                tempParams = {
                    "data": params.rowData[columnObj.name],
                    "rowData": params.rowData,
                    "row": row,
                    "column": column,
                    "depth": depth,
                    "isTree": isTree,
                    "name": columnObj.name
                };
                tempData = me.__getContentTdTree(tempParams);
                if (columnObj.menus) {
                    $(aMenu).html(tempData)
                            .appendTo(divEl);
                } else {
                    divEl.html(tempData);
                }
            }
            // 是否开启tip提示功能
            if (columnObj.tip) {
                divEl.attr("title", $.isPlainObject(params.rowData[columnObj.name]) ? $.htmlEscape(params.rowData[columnObj.name].text) : $.htmlEscape(params.rowData[columnObj.name]));
            }
        },
        /**
         * @private
         * @description 创建树形节点
         * @param {Object} params 参数，格式如下：
         *      {Object} data 表格单元格数据
         *      {Object} rowData 行数据
         *      {Number} row 行数
         *      {Number} column 列数
         *      {Number} depth 深度
         *      {Boolean} isTree 是否树节点
         *      {String} name 列名称
         * @return {String} 返回树形数据或普通数据
         */
        __getContentTdTree: function(params) {
            var me = this,
                    data = params.data,
                    outputData,
                    rowData = params.rowData,
                    row = params.row,
                    column = params.column,
                    depth = params.depth,
                    isTree = params.isTree,
                    name = params.name,
                    divEl = $("<div>").addClass(gridContentTreeDivClass),
                    textEl;
            if ($.isPlainObject(data) && data.children && $.isNotNull(data.text)) {
                // 计算树节点偏移量
                if (isTree) {
                    divEl.css("padding-left", treeBlankWidth * depth);
                }
                var aEl = $("<a>").addClass(gridContentTreePlusClass + " " +
                        gridContentTreeSpaceClass + " " +
                        gridContentTreeClass)
                        .bind("click", function(event) {
                    event.stopImmediatePropagation();
                    var self = $(this);
                    var tempData;
                    // 表格树数据追加行节点
                    me.rowTreeEl = self.parent().parent().parent().parent();
                    // 表格树数据触发列节点
                    me.rowTreeTdEl = self;
                    // 处理表格树展开问题
                    if (self.hasClass(gridContentTreePlusClass)) {
                        self.removeClass(gridContentTreePlusClass).addClass(gridContentTreeMinusClass);
                        if (self.data("expand")) {
                            me._gridContentTreeExpand(self.data("treeTrEls"), true);
                            return;
                        }
                        tempData = {"row": row, "column": column, "name": name,
                            "depth": depth,
                            "rowData": $.objClone(rowData) || {}};
                        // 回调展开事件
                        tempData = me._triggerHandler(event, eventNameTreeExpand, tempData);
                        if (me.options.store) {
                            me.options.store.load(tempData, true, "setTreeData");
                        }
                        self.data("expand", true);
                        self.data("treeTrEls", []);
                    }
                    // 处理表格树折叠问题
                    else if (self.hasClass(gridContentTreeMinusClass)) {
                        self.removeClass(gridContentTreeMinusClass).addClass(gridContentTreePlusClass);
                        me._gridContentTreeExpand(self.data("treeTrEls"), false);
                    } else {
                        me._info("__getContentTdTree() Nothing to do.");
                    }
                })
                        .attr({"row": row, "column": column, "depth": depth})
                        .appendTo(divEl);
                outputData = $.nullToString(data.text);
                textEl = $("<div>").html($.htmlEscape(outputData)).appendTo(divEl);
            } else {
                textEl = $("<div>").appendTo(divEl);
                divEl.css("padding-left", treeBlankWidth * depth);
                if (isTree && $.isPlainObject(data)) {
                    outputData = data.text;
                } else {
                    outputData = $.isPlainObject(data) ? data.text : data;
                }
                textEl.html($.htmlEscape($.nullToString(outputData)));
            }

            return divEl[0];
        },
        /**
         * @private
         * @description 控制表格树展开、折叠
         * @param {Array} trEls 表格树节点数组
         * @param {Boolean} expand true展开，false折叠
         */
        _gridContentTreeExpand: function(trEls, expand) {
            var trEl;
            var trTreeEls;
            var trTreeEl;
            if (expand) {
                for (var m = 0; m < trEls.length; m++) {
                    trEls[m].show();
                }
            } else {
                for (var i = 0; i < trEls.length; i++) {
                    trEl = trEls[i].hide();
                    // 该行是否有树形节点
                    trTreeEls = trEl.find("." + gridContentTreeClass);
                    for (var j = 0; j < trTreeEls.length; j++) {
                        trTreeEl = $(trTreeEls[j]);
                        trTreeEl.removeClass(gridContentTreeMinusClass).addClass(gridContentTreePlusClass);
                        this._gridContentTreeExpand(trTreeEl.data("treeTrEls") || [], false);
                    }
                }
            }
        },
        /**
         * @description 处理滚动条事件，保持表头与表内容一致
         * @private
         */
        _onScroll: function(e) {
            var me = e.data.me,
                    scrollLeft = me.contentEl.scrollLeft();
            if (me._gridMenu) {
                me._gridMenu.destroy();
            }
            me.gridScrollLeft = scrollLeft;
            me.gridScrollLeftFlag++;
            me.headerDivEl.css({"left": -scrollLeft});
            if (me.resizeEl) {
                me.resizeEl.css({"left": -scrollLeft});
            }
            var scrollInfo = {
                    left : scrollLeft,
                    top : me.contentEl.scrollTop(),
                    scrollWidth : me.contentEl.get(0).scrollWidth,
                    scrollHeight : me.contentEl.get(0).scrollHeight
                };
            //拖动滚动条后的回调函数
            if(me.options.scrollCallBack && $.isFunction(me.options.scrollCallBack)){
                me.options.scrollCallBack(scrollInfo);
            }
            //只有拖动竖直滚动条时，才触发
            if(me.options.move){
                me.options.beforeMoveGrid();
                var tdata = me._getCurrentDisplayData(scrollInfo);
                me.contentTableEl.css("top", scrollInfo.top + "px");
                
                //最大的滚动值
                var maxTop = me.contentDivEl.height() - me.contentEl.height();
                //如果是分次请求数据，需要出遮罩，回调中用户发请求,使用异步和回调，进行数据的追加
                if(scrollInfo && scrollInfo.top >= maxTop){
                    if(!me.hasShowMask && me.options.data.total > me.options.data.data.length && !me.locked){
                        me.loadEl.show().sweetMask({
                            loading : true
                        });
                        tdata.shift();
                        me.hasShowMask = true;
                        me.options.afterMoveGrid(tdata, maxTop, me.options.data.data.length);
                    } else {
                        if(me.hasShowMask){
                            tdata.shift();
                        }
                        me.options.afterMoveGrid(tdata, undefined, undefined);
                    }
                } else {
                    me.options.afterMoveGrid(tdata, undefined, undefined);
                }
                me._refreshRowRelations(tdata);
                //处理更新后原来选中的行问题
                var select = me.getSelectedValue();
                me._dealRowSelect(me.checkboxTdEls, me.contentTrEls,
                        {"current": checkboxUncheckdClass, "old": checkboxCheckdClass},
                        {"current": "", "old": gridContentRowSelectedClass});
                me._dealRowSelect(me.checkboxTreeTdEls, me.contentTreeTrEls,
                        {"current": checkboxUncheckdClass, "old": checkboxCheckdClass},
                        {"current": "", "old": gridContentRowSelectedClass});
                if(select[0] && select[0].rowId){
                    var selectTr = me.__findTargetTr(select[0].rowId);
                    if(selectTr.trEl){
                        selectTr.trEl.addClass(gridContentRowSelectedClass);
                    }
                }
            }
            me.preScrollInfo = scrollInfo;
        },
		/**
         * @description 限制用户拖动滚动条时---数据不够时向后台发送请求的动作
         * @returns boolean 是否向后台以请求，true表示锁定，不再发请求；false表示正常发请求，默认值flase
         */
		setLocked : function(locked){
			var me = this;
			me.locked = locked;
		},
		/**
         * @description 取得当前表格的滚动条信息
         * @returns object 取得当前表格的滚动条信息,其中包含top, left等信息
         */
        getScrollInfo : function(){
            return this.preScrollInfo;
        },
		/**
         * @description 取得当前滚动条拖动到的位置对应的数据的索引值
         */
		getStartIndex : function(){
			return this.options.data.data.length;
		},
        /**
         * @description 给表格追加数据并去除表格底部的遮罩，修改垂直滚动条的高度
         * @param {Array} data  数据
         * @param {Number} top  原来滚动条的位置
         * @param {boolean} isClear 是否清除原来的数据
         */
        setAppendData : function(data, top, isClear){
            var me = this,
                    top = top || 0;
            if (data && me.options.data.data) {
                if(isClear){
					me.options.data.data = null;
                    me.options.data.data = [];     // 每次设置数据时，data不需要保留
                    if($.isArray(data)){
						me.options.data.data = data;
                    } else {
                        me.options.data = $.extend({}, me.options.data, data);
                    }
                    
                    top = 0;
                } else {
                    if($.isArray(data)){
                        me.options.data.data = me.options.data.data.concat(data);
                    } else {
                        me.options.data.data = me.options.data.data.concat(data.data || []);
                    }
                }
                
                // 添加rowId
                me._addRowId(me.options.data.data);
				if(me.options.data.data.length <= me.pageCount){
					var rows = me.options.data.data.length;
					var temp = me.pageCount - rows;
					var finalRowId = rows <= 0 ? 0 : me.options.data.data[rows-1].rowId;
					for(var i = 0; i < temp; i++){
						me.options.data.data.push({
							rowId : finalRowId + i + 1
						});
					}
					me._refreshRowRelations(me.options.data.data);
				}
                //将数据进行追加后，需要修改相应的垂直滚动条的高度
                me.contentDivEl.height(me.options.data.data.length*me.rowH);
                //将hasShowMask设置为false
                me.hasShowMask = false;
                //去掉相应的遮罩并隐藏遮罩
                me.loadEl.unSweetMask();
                me.loadEl.hide();
                me.contentEl.scrollTop(top);
                me._onScroll({data : {"me" : me}});
            }
        },
		/**
         * @description 隐藏遮罩，主要是出现异常时隐藏遮罩，保证下次还可以正常操作
         */
		hideMask : function(){
			var me = this;
			//将hasShowMask设置为false
			me.hasShowMask = false;
			//去掉相应的遮罩并隐藏遮罩
			me.loadEl.unSweetMask();
			me.loadEl.hide();
			me._onScroll({data : {"me" : me}});
		},
        /**
         * @description 行全选
         * @private
         * @param {Object} event 复选框按钮本身
         */
        _onAllRowClick: function(event) {
            var me = event.data.me,
                    self = $(this),
                    tempData = {};
            /**
             * @private
             * @description 数组转换对象
             * @param {Array} arr 数组
             * @return {Object} 对象
             */
            function arrToObject(arr) {
                var temp, obj = {};
                for (var i = 0; i < arr.length; i++) {
                    temp = arr[i];
                    if (temp) {
                        obj[temp.rowId] = temp;
                    }
                }
                return obj;
            }

            // 未选中
            if (self.hasClass(checkboxUncheckdClass)) {
                tempData.checked = true;
                self.removeClass(checkboxUncheckdClass).addClass(checkboxCheckdClass);
                me.selectedData = arrToObject(me.options.data.data);
                me.selectedDataLength = me.options.data.data.length;
                me.selectedTreeData = arrToObject(me.treeData);
                me.selectedTreeDataLength = me.treeData.length;
                me._dealRowSelect(me.checkboxTdEls, me.contentTrEls,
                        {"current": checkboxCheckdClass, "old": checkboxUncheckdClass},
                {"current": gridContentRowSelectedClass, "old": ""});
                me._dealRowSelect(me.checkboxTreeTdEls, me.contentTreeTrEls,
                        {"current": checkboxCheckdClass, "old": checkboxUncheckdClass},
                {"current": gridContentRowSelectedClass, "old": ""});
            }
            // 选中
            else if (self.hasClass(checkboxCheckdClass)) {
                tempData.checked = false;
                self.removeClass(checkboxCheckdClass).addClass(checkboxUncheckdClass);
                me._allRowUnSelect();
            } else {
                me._info("Nothing we can do.");
                return;
            }
            me._triggerHandler(event, eventNameCheckBoxClick, tempData);
        },
        /**
         * @private
         * @description 所有行取消选中
         */
        _allRowUnSelect: function() {
            var me = this;
            me.selectedData = {};
            me.selectedDataLength = 0;
            me.selectedTreeData = {};
            me.selectedTreeDataLength = 0;
            me._dealRowSelect(me.checkboxTdEls, me.contentTrEls,
                    {"current": checkboxUncheckdClass, "old": checkboxCheckdClass},
            {"current": "", "old": gridContentRowSelectedClass});
            me._dealRowSelect(me.checkboxTreeTdEls, me.contentTreeTrEls,
                    {"current": checkboxUncheckdClass, "old": checkboxCheckdClass},
            {"current": "", "old": gridContentRowSelectedClass});
        },
        /**
         * @description 处理复选框选中
         * @private
         * @param {Array} checkboxs 复选框组
         * @param {Array} rows 行数组
         * @param {String} checkboxClass 样式
         * @param {String} rowClass 行样式
         */
        _dealRowSelect: function(checkboxs, rows, checkboxClass, rowClass) {
            for (var i = 0; i < rows.length; i++) {
                if (checkboxs[i]) {
                    checkboxs[i].find("a").removeClass(checkboxClass.old).addClass(checkboxClass.current);
                }
                rows[i].removeClass(rowClass.old).addClass(rowClass.current);
            }
        },
        /**
         * @description 行复选框点击事件
         * @private
         * @param {Object} obj 复选框对象本身
         * @param {Boolean} checked true选中，false未选中
         */
        _onRowClick: function(obj, checked) {
            var me = this,
                    row = $.string.toNumber(obj.attr("row")),
                    isTree = obj.attr("tree"),
                    rowData;
            // 选中
            if (checked) {
                obj.removeClass(checkboxUncheckdClass).addClass(checkboxCheckdClass);
                me._oneRowSelect(row, isTree);
                // 未选中
            } else {
                var tempData = me.options.data.data[row];
                obj.removeClass(checkboxCheckdClass).addClass(checkboxUncheckdClass);

                if ("true" === isTree) {
                    tempData = me.treeData[row];
                    // 取消行选中
                    me.contentTreeTrEls[row].removeClass(gridContentRowSelectedClass);
                    delete me.selectedTreeData[tempData.rowId];
                    me.selectedTreeDataLength--;
                } else {
                    tempData = me.options.data.data[row];
                    // 取消行选中
                    me.contentTrEls[row].removeClass(gridContentRowSelectedClass);
                    delete me.selectedData[tempData.rowId];
                    me.selectedDataLength--;
                }

                // 如果全部取消选中
                if (me.options.data.data.length + me.treeData.length !== me.selectedTreeDataLength + me.selectedDataLength) {
                    me.headerTdEls[0].find("a").removeClass().addClass(checkboxUncheckdClass);
                }
            }
        },
        /**
         * @private
         * @description 单号选择
         * @param {Number} row 行号
         * @param {String} isTree 是否是树
         */
        _oneRowSelect: function(row, isTree) {
            var me = this,
                    rowData;
            if ("true" === isTree) {
                rowData = $.objClone(me.treeData[row]);
                // 添加行选中
                me.contentTreeTrEls[row].addClass(gridContentRowSelectedClass);
                me.selectedTreeData[me.treeData[row].rowId] = rowData;
                me.selectedTreeDataLength++;
            } else {
                rowData = $.objClone(me.options.data.data[row]);
                // 添加行选中
                me.contentTrEls[row].addClass(gridContentRowSelectedClass);
                me.selectedData[me.options.data.data[row].rowId] = rowData;
                me.selectedDataLength++;
            }

            // 如果全部选中
            if (me.selectedDataLength + me.selectedTreeDataLength === me.options.data.data.length + me.treeData.length) {
                me.headerTdEls[0].find("a").removeClass().addClass(checkboxCheckdClass);
            }
        },
        
        /**
         * @private
         * @description 跳转按钮blur事件处理
         */
        _onGoBlur: function() {
            var me = this;
            var value = $.string.toNumber(me.pagingGoTextEl.val());
            if (1 > value) {
                me.pagingGoTextEl.val(1);
            } else if (value > me.page.totalPage) {
                me.pagingGoTextEl.val(0 === me.page.totalPage ? 1 : me.page.totalPage);
            }
        },
        /**
         * @description 上、下翻页按钮单击事件
         * @private
         * @param {Boolean} bool true前翻 false后翻
         */
        _onPagingButtonClick: function(bool) {
            var me = this,
                    findTarget = false,
                    page = me.page,
                    numEls = me.numEls,
                    currentPage;
            // 页数必须在有效范围内
            if (page.totalPage < page.currentPage || 1 > page.currentPage) {
                return;
            }
            // 计算当期要显示的页数
            if (1 === page.currentPage) {
                if (bool || 1 === page.totalPage) {
                    return;
                } else {
                    currentPage = page.currentPage + 1;
                }
            } else if (page.totalPage === page.currentPage) {
                if (bool) {
                    currentPage = page.totalPage - 1;
                } else {
                    return;
                }
            } else {
                currentPage = bool ? --page.currentPage : ++page.currentPage;
            }

            me.page.currentPage = currentPage;

            // 简单翻页栏
            if (me.options.data.page.simple) {
                me.pagingPageDropDownEl.find("li:eq(" + --me.page.currentPage + ")").click();
                return;
            }

            // 找到需要点击的目标元素
            for (var i = 0; i < numEls.length; i++) {
                if (currentPage === $.string.toNumber(numEls[i].val())) {
                    numEls[i].click();
                    findTarget = true;
                }
            }

            // DTS2013090502641 没有找到目标元素，也要重新加载数据
            if (!findTarget) {
                // 上下翻页使用Go按钮计算开始值
                me.goClick = true;
                me._onPagingBarNumClick(null, true);
            }
        },
        /**
         * @description Go按钮点击事件
         * @private
         * @param {Object} event 事件
         */
        _onPagingGoClick: function(event) {
            var me = this,
                    goTextValue = $.string.toNumber(me.pagingGoTextEl.val());
            // 如果当前页同跳转页相同，不进行跳转
            if (me.page.currentPage === goTextValue) {
                return;
            }
            me.page.currentPage = goTextValue;
            me.goClick = true;
            me._triggerHandler(event, eventNamePageClick, $.objClone(me.page));
        },
        /**
         * @description 每页记录数选择时触发
         * @private
         * @param {Object} event 每页记录数本身
         */
        _onPagingRowClick: function(event) {
            var me = event.data.me,
                    self = $(this);
            me.options.data.page.size = me.page.size = $.string.toNumber(self.val());
            me.page.currentPage = 1;
            me._triggerHandler(event, eventNamePageClick, $.objClone(me.page));
        },
        /**
         * @description 创建显示记录数下拉框
         * @private
         * @param {Object} obj 配置参数
         * @return {Object} selectEl 下拉框对象
         */
        _createPagingBarSelectPage: function(obj) {
            var me = this,
                    size = obj.size,
                    select = obj.select,
                    downElClass = "sweet-gird-paging-select-down",
                    selectEl = $("<div>").addClass(obj.selectElClass),
                    aEl = $("<a>"),
                    emEl = $("<em>"),
                    downEl = $("<div>"),
                    pageRowDropDown,
                    params = {};
            pageRowDropDown = me._createDropDown(select);
            emEl.appendTo(aEl);
            downEl.addClass(downElClass).appendTo(aEl);
            aEl.addClass(obj.aElClass)
                    .bind("click", {"attachEl": selectEl,
                "dropDown": pageRowDropDown,
                "type": obj.type}, me._onSelectClick)
                    .appendTo(selectEl);
            pageRowDropDown.addClass(obj.downElClass).appendTo(document.body);
            // 绑定单击事件
            params = {"me": me, "obj": obj, "emEl": emEl, "pageRowDropDown": pageRowDropDown};
            pageRowDropDown.find("li").bind("click", params,
                    me._onPageListClick);
            // 设定每页显示记录默认值
            pageRowDropDown.find("li").each(function() {
                var value = $.string.toNumber($(this).val());
                if (size === value) {
                    me._onPageListClick({"data": params}, $(this));
                }
            });

            return {"selectEl": selectEl, "dropDownEl": pageRowDropDown};
        },
        /**
         * @private
         * @description 响应每页显示条数点击事件
         * @param {Object} e 事件对象或参数
         * @param {Object} self 点击对象本身，可选
         */
        _onPageListClick: function(e, self) {
            var me = e.data.me,
                    obj = e.data.obj,
                    emEl = e.data.emEl,
                    pageRowDropDown = e.data.pageRowDropDown,
                    value,
                    tempHtml;
            self = self || $(this);
            value = $.string.toNumber(self.val());
            // 每页记录数下拉框
            if (gridPagingComboboxType[0] === obj.type) {
                if (me.pageRowsChoosedLiEl) {
                    me.pageRowsChoosedLiEl.removeClass(pageRowChoosedClass);
                }
                emEl.text(obj.text.replace("{0}", value));
                me.pageRowsChoosedLiEl = self;
            } else if (gridPagingComboboxType[1] === obj.type) {
                if (me.pageChoosedLiEl) {
                    me.pageChoosedLiEl.removeClass(pageRowChoosedClass);
                }
                tempHtml = self.html();
                emEl.text(obj.text.replace("{0}", value)
                        .replace("{1}", tempHtml.substr(tempHtml.indexOf("/") + 1, tempHtml.length)));
                me.pageChoosedLiEl = self;
            } else {
                me._error("Unsupported combobox type. Not in [" +
                        gridPagingComboboxType[0] + ", " +
                        gridPagingComboboxType[1] + "].");
                return;
            }
            self.addClass(pageRowChoosedClass);
            pageRowDropDown.hide();
            // 第一次初始化表格时，不触发
            if (!me.initial) {
                me._triggerHandler(e, eventNamePageClick, $.objClone(me.page));
                me.initial = false;
            }
        },
        /**
         * @description 处理每页记录数下拉框单击事件
         * @private
         * @param {Object} event 每页记录数下拉框事件
         */
        _onSelectClick: function(event) {
            if ($.isVisiable(event.data.dropDown)) {
                return;
            }
            var attachEl = event.data.attachEl,
                    dropDown = event.data.dropDown,
                    type = event.data.type,
                    zIndex = $.getMaxZIndex($.string.toNumber(dropDown.css("z-index")));
            if (gridPagingComboboxType[0] === type) {
                dropDown.data("rowFlag", true);
            } else if (gridPagingComboboxType[1] === type) {
                dropDown.data("pageFlag", true);
            }
            // 计算z-index值，避免覆盖
            dropDown.css($.getFloatOffset(attachEl, dropDown, null)).css("z-index", zIndex).show();
        },
        /**
         * @description 创建下拉列表
         * @private
         * @param {Array} data 列表参数
         */
        _createDropDown: function(data) {
            var me = this,
                    dropDownEl = $("<div>"),
                    ulEl = $("<ul>");
            data = data || [20, 50, 100];
            for (var i = 0, temp, tempIndex; i < data.length; i++) {
                temp = data[i].toString();
                tempIndex = temp.indexOf("/");
                $("<li>").val(-1 === tempIndex ? temp : temp.substr(0, tempIndex)).text(temp).appendTo(ulEl);
            }
            ulEl.appendTo(dropDownEl);
            dropDownEl.addClass(gridPagingDropDownElClass + " " + me.floatBgClass);
            return dropDownEl;
        },
        /**
         * @description 创建分页栏显示文本
         * @private
         */
        _createPagingBarTotalText: function() {
            var me = this,
                    totalTextElClass = "sweet-grid-paging-totaltext",
                    totalTextEl = me.totalTextEl = $("<span>");
            totalTextEl.addClass(totalTextElClass)
                    .text(i18n.text.replace("{0}", me.options.data.page.total)).appendTo(me.pagingInnerEl);
        },
        /**
         * @description 刷新分页栏显示文本总条数信息
         * @private
         * @param {Number/String} total 总记录数
         */
        _refreshPagingBarTotalText: function(total) {
            var me = this;
            me.totalTextEl.text(i18n.text.replace("{0}", total));
        },
        /**
         * @description 创建分页栏按钮
         * @private
         * @param {String} picClass 图片样式，用于控制按钮图片
         * @param {String} text 按钮显示文本
         * @param {String} textPos 文本位置，居左或居右显示
         * @param {String} title 提示
         * @return {Object} 返回按钮对象
         */
        _createPagingBarButton: function(picClass, text, textPos, title) {
            var buttonElClass = "sweet-gird-paging-button",
                    buttonElTextClass = "sweet-grid-paging-button-text",
                    buttonEl = $("<a>"),
                    picEl = $("<div>"),
                    emEl = $("<em>");
            picEl.addClass(picClass).appendTo(buttonEl);
            if ($.isNotNull(text)) {
                if (gridPagingTextPos[0] === textPos) {
                    emEl.html(text).insertAfter(picEl);
                    buttonEl.addClass(buttonElTextClass);
                } else if (gridPagingTextPos[1] === textPos) {
                    emEl.html(text).insertBefore(picEl);
                    buttonEl.addClass(buttonElTextClass);
                } else {
                    $.log("Nothing we can do. Not in [" + gridPagingTextPos[0] + ", " + gridPagingTextPos[1] +
                            "]. value=" + textPos);
                }
            }
            if ($.isNotNull(title)) {
                buttonEl.attr("title", title);
            }
            buttonEl.addClass(buttonElClass);
            return buttonEl;
        },
        /**
         * @description 创建翻页栏翻页条
         * @private
         */
        _createPagingBarNumItem: function() {
            var me = this,
                    minNumBtn = gridPagingDefaultNum + 2,
                    numPrevMoreEl = $("<span>").text("...").hide(),
                    numNextMoreEl = $("<span>").text("..."),
                    numItemEl = me.numItemEl = $("<div>"),
                    numEl,
                    numEls = [],
                    numMoreEls = [],
                    totalPage = me.page.totalPage,
                    currentPage = me.page.currentPage,
                    beginIndex = 1,
                    tempI;
            // 如果总页数小于默认显示按钮个数，按钮全部呈现
            if (totalPage <= minNumBtn) {
                for (var m = 0; m < totalPage; m++) {
                    tempI = m + 1;
                    numEl = $("<a>")
                            .addClass(gridPagingANumClass)
                            .val(tempI)
                            .text(tempI)
                            .appendTo(numItemEl);
                    numEls[m] = numEl;
                }
            } else {
                // 计算按钮开始值
                if (1 === totalPage || totalPage === currentPage) {
                    beginIndex = (1 === currentPage ? currentPage + 1 : currentPage - gridPagingDefaultNum);
                } else if (currentPage - 1 < gridPagingDefaultNum) {
                    beginIndex = 2;
                } else if (totalPage - currentPage < gridPagingDefaultNum) {
                    beginIndex = totalPage - gridPagingDefaultNum;
                } else {
                    // 如果点击跳转按钮
                    if (me.goClick) {
                        beginIndex = currentPage;
                        me.goClick = false;
                    }
                    // 如果点击第一个浮动按钮
                    else if ($.string.toNumber(me.numEls[1].val()) === currentPage ||
                            $.string.toNumber(me.numEls[gridPagingDefaultNum].val()) === currentPage) {
                        beginIndex = currentPage - 2;
                    } else {
                        beginIndex = $.string.toNumber(me.numEls[1].val());
                    }
                }

                for (var i = 0; i < minNumBtn; i++) {
                    tempI = i + beginIndex - 1;
                    numEl = $("<a>").addClass(gridPagingANumClass)
                            .val(tempI)
                            .text(tempI)
                            .appendTo(numItemEl);
                    if (0 === i) {
                        numEl.val(1).text(1);
                        numPrevMoreEl.insertAfter(numEl);
                        numMoreEls[0] = numPrevMoreEl;
                    } else if (gridPagingDefaultNum + 1 === i) {
                        numEl.val(totalPage).text(totalPage);
                        numNextMoreEl.insertBefore(numEl);
                        numMoreEls[1] = numNextMoreEl;
                    }
                    numEls[i] = numEl;
                }
            }

            // 处理分页按钮默认选中
            for (var n = 0; n < numEls.length; n++) {
                if (me.page.currentPage === $.string.toNumber(numEls[n].val())) {
                    numEls[n].addClass(gridPagingCurrentElClass);
                    me.pageingcurrentNumEl = numEls[n];
                }
            }

            // 刷新省略号
            if (0 < numMoreEls.length) {
                // 第一个省略号
                if (1 === $.string.toNumber(numEls[1].val()) - 1) {
                    numMoreEls[0].hide();
                } else {
                    numMoreEls[0].show();
                }
                // 最后一个省略号
                if (totalPage === $.string.toNumber(numEls[gridPagingDefaultNum].val()) + 1) {
                    numMoreEls[1].hide();
                } else {
                    numMoreEls[1].show();
                }
            }

            numItemEl.bind("click", function(event) {
                me._onPagingBarNumClick(event);
            })
                    .appendTo(me.pagingInnerEl);
            me.numEls = numEls;
            me.numMoreEls = numMoreEls;
        },
        /**
         * @description 分页栏数字按钮点击事件
         * @private
         * @param {Object} event 事件
         * @param {Boolean} force 是否强制加载，true表示强制加载
         */
        _onPagingBarNumClick: function(event, force) {
            var me = this,
                    self;
            if (force) {
                me._triggerHandler(event, eventNamePageClick, $.objClone(me.page));
            } else {
                self = $(event.target);
                if (self.hasClass(gridPagingANumClass) || self.hasClass(pageRowChoosedClass)) {
                    me.page.currentPage = $.string.toNumber(self.val());
                    me._triggerHandler(event, eventNamePageClick, $.objClone(me.page));
                }
            }
        },
        /**
         * @private
         * @description 触发handler注册事件
         * @param {Object} event 
         * @param {eventName} eventName 事件名
         * @param {Object} data 数据
         */
        _triggerHandler: function(event, eventName, data) {
            var me = this;
            var returnData;
            // 如果是pageClick事件并且注册store，触发store
            if (eventNamePageClick === eventName && me.options.store) {
                me.options.store._setDataPage(me.getPageInfo());
                me.options.store.loadRecords(me.getAllConditions());
            }
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eventName === handlerName) {
                    me._info(eventName + " event occured!");
                    returnData = func.call(null, event, data);
                }
            });

            return returnData ? returnData : data;
        },
        /**
         * @description 获取所有条件
         * @return {Object} 返回所有条件
         */
        getAllConditions: function() {
            var me = this,
                    temp = {},
                    page = me.getPageInfo(),
                    filters = me._getFilters(),
                    orders = JSON.parse(JSON.stringify(me._getOrders())),
                    i = 0, j = 0, orderTemp, o,
                    columns = me.headerColumns,
                    len = columns.length;
            if (page && undefined !== page.start && undefined !== page.limit) {
                temp.start = page.start;
                temp.limit = page.limit;
            }
            if (filters.filter) {
                temp.filter = filters.filter;
            }
            if (orders.order) {
                //关于夏令时的排序修改成utc排序
                for(i = 0; i < orders.order.length; i++){
                    orderTemp = orders.order[i];
                    for(j = 0; j < len; j++){
                        if(columns[j].name === orderTemp.name && orderTemp.dataType === "date"
                            && !orderTemp.hidden && !orderTemp.hiddenForever 
                            && $.isNotNull(columns[j].useDSTutcOrder)){
                            //取夏令时的UTC时间进行替换当前时间的列进行排序，并使用number进行排序
                            o = JSON.parse(JSON.stringify(orderTemp));
                            orderTemp.name = columns[j].useDSTutcOrder;
                            orderTemp.dataType = "number";
                            //将没有改变的信息也放在data中
                            orderTemp.data = o;
                            break;
                        }
                    }
                }
                temp.order = orders.order;
            }

            return temp;
        },
        /**
         * @description 获取分页信息
         * @return {Object} 返回{"start": , "limit": }
         */
        getPageInfo: function() {
            var me = this;
            if (!me.page) {
                return {};
            }
            return {
                "start": (me.page.currentPage - 1) * me.page.size,
                "limit": me.page.size,
                "currentPage": me.page.currentPage,
                "size": me.page.size
            };
        },
        /**
         * @private
         * @description 获取过滤条件
         */
        _getFilters: function() {
            var me = this, result = [];
            $.each(me.filters, function(key, obj) {
                result.push({"name": key, "type": obj.type, "value": obj.value, "text": obj.text});
            });
            return {"filter": result};
        },
        /**
         * @private
         * @description 获取排序
         */
        _getOrders: function() {
            var me = this;
            return {"order": me.orders};
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
            me.gridEl.appendTo(me.renderEl);
            me._gridMenuEl = $("<div id=\"" + me._gridMenuId + "\">").appendTo(document.body);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 销毁表格组件
         */
        _destroyWidget: function() {
            var me = this;
            me.__destroyTableActionBar();
            me.__destroyTableHeader();
            me.__destroyTableContent();
            me.__destroyTablePagingBar();
            if(me.gridEl){
                me.gridEl.remove();
                me.gridEl = null;
            }
            if(me._gridMenuEl){
                me._gridMenuEl.remove();
                me._gridMenuEl = null;
            }
        },
        /**
         * @private
         * @description 销毁表格操作栏
         */
        __destroyTableActionBar: function() {
            var me = this;
            //销毁列选择中的list对象和dom
            if(me.selectColEl){
                me.selectColEl.remove();
                me.selectColEl = null;
            }
            if(me.selectColList && $.isFunction(me.selectColList.destroy)){
                me.selectColList.destroy();
                me.selectColList = null;
            }
            //销毁多列排序中的sweet对象
            if(me._multiSortWin && $.isFunction(me._multiSortWin.destroy)){
                me._multiSortWin.destroy();
                me._multiSortWin = null;
                if(me.firstCol){
                    me.firstCol = null;
                }
                if(me.secondCol){
                    me.secondCol = null;
                }
                if(me.thirdCol){
                    me.thirdCol = null;
                }
            }
            //销毁二次统计中的对象
            if(me.secondaryPanel && $.isFunction(me.secondaryPanel.destroy)){
                me.secondaryPanel.destroy();
                me.secondaryPanel = null;
            }
            if(me.actionBarEl){
                me.actionBarEl.remove();
                me.actionBarEl = null;
            }
            if(me.exportEl){
                me.exportEl.remove();
                me.exportEl = null;
            }
        },
        /**
         * @private
         * @description 销毁表头
         */
        __destroyTableHeader: function() {
            var me = this,
                    gps = me.filterPanels,
                    len = gps ? gps.length : 0;
            if(me.headerEl){
                me.headerEl.remove();
                me.headerEl = null;
            }
            if(me.resizeEl){
                me.resizeEl.remove();
                me.resizeEl = null;
            }
            for (var i = 0; i < len; i++) {
                me.filterPanels[i].remove();
            }
            me.filterPanels = null;
        },
        /**
         * @private
         * @description 销毁表格内容
         */
        __destroyTableContent: function() {
            var me = this;
            if(me.contentEl){
                me.contentEl.remove();
                me.contentEl = null;
            }
        },
        /**
         * @private
         * @description 销毁分页栏
         */
        __destroyTablePagingBar: function() {
            var me = this;
            if (me.pagingRowDropDownEl) {
                me.pagingRowDropDownEl.find("li").unbind();
                me.pagingRowDropDownEl.remove();
                me.pagingRowDropDownEl = null;
            }
            if (me.pagingPageDropDownEl) {
                me.pagingPageDropDownEl.find("li").unbind();
                me.pagingPageDropDownEl.remove();
                me.pagingPageDropDownEl = null;
            }
            if(me.pagingEl){
                me.pagingEl.remove();
                me.pagingEl = null;
            }
        }
    });

    /**
     * @description 表格
     * @name Sweet.grid.BigGrid
     * @class 
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建表格：
     * var sweetGrid = new Sweet.grid.BigGrid({
     * });
     */
    Sweet.grid.BigGrid = $.sweet.widgetBigGrid;
}(jQuery));

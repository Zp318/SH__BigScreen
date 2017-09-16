/**
 * @fileOverview  
 * <pre>
 * 业务组件--grid
 * 2014-4-17
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2014, All rights reserved 
 * </pre>
 * @version 1.0
 */
(function() {
    Business.cmpGrid = {};
    Business.cmpGrid = {
        noSupportStr:{
            "plusplus": "--",
            "hundred": "100.00",
            "zero":"0"
        },
        drillTpye:{
            "cdr":"cdr",
            "failcause":"failcause",
            "hocause":"hocause"
        }

    };

    Business.grid = function(params) {        
            
        //初始化组件需要传的参数，未传参数使用默认值
        this.config = {
            columns : [],
            title : "export",
            panelTitle: BusinessI18N.cmp.grid.gridDisplay,
            // 钻取回调函数
            drillFunc : function(){
                return null;
            },
            // 表格设置数据后回调函数
            afterSetDataFunc:function(){
                return null;
            },
            dbDrillFunc: function(){
            	return null;
            }
        };
        
        this.config = $.extend(this.config, params);

        this.gridData = null;
        
        //加载组件
        this._init();
        
        return this;
    };

    /**
     * @description 返回当前页的表格数据
     * @returns {Array}
     */
    Business.grid.prototype.getCurrentPageData = function(){
        var me = this, pageInfo = {}, resultData, detailData = [], size = 0, curPage = 1;
        var currentGridData = me.store.getCurrentData();
        if(!currentGridData || currentGridData.length <= 0){
            currentGridData = me.gridData.data.length > 0 ? me.gridData.data : [];
        }

        resultData = currentGridData;
        if(me.grid){
            pageInfo = me.grid.getPageInfo();
            pageInfo.currentPage ? curPage = pageInfo.currentPage : "";
            pageInfo.size ? size = pageInfo.size : "";
            resultData.length > 0 ? detailData = resultData : "";
            if(detailData.length > 0){
                var startIndex, endIndex;
                if(curPage === 1){
                    startIndex = 0;
                }
                else if(curPage > 1){
                    startIndex = (curPage-1) * size;
                }
                endIndex = size * curPage;
                resultData = detailData.slice(startIndex, endIndex);
            }
        }

        return resultData;
    };

    /**
     * @description 返回panel
     * @returns {Object}
     */
    Business.grid.prototype.getPanel = function(){
        return this.panel;
    };

    
    /**
     * 销毁组件 对外接口
     */
    Business.grid.prototype.destroy = function () {
        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }
        
        this.baseCondition = null;
        this.gridData = null;
    },

    /**
     * 设置值
     * @param {Object} data 
     * @param {Object} queryParams 
     */
    Business.grid.prototype.setData = function(data, queryParams){
        var me = this;
        if($.isNotNull(data)){
            if($.isNotNull(queryParams)){
                me.config.queryParam = queryParams;
            }
            me.gridData = data;
            data.page = {
                total  : data.length
            };

            if($.isNull(data.columns)){
                if($.isNotNull(me.columns)){
                    data.columns = me.columns;
                    me.store.loadData(data);
                }
            }
            else{
                var isSameBool = false;
                isSameBool = $.equals(me.columns, data.columns);
                if(!isSameBool){
                    me.columns = data.columns;

                    if(me.grid){
                        me.grid.destroy();
                        me.baseCondition = null;
                    }
                    me.panel.removeItems();

                    me._createGrid(data, queryParams);
                    me.panel.addItems(me.grid);
                }else{
                    me.store.loadData(data);
                }

            }
            me.baseCondition = me.config.queryParam;
        }
    };

    /**
     * 初始化组件
     * @private
     */
    Business.grid.prototype._init = function() {
        var me = this;
        var config = me.config;

        me.gridData = {
            data : [],
            columns : config.columns,
            page : {
                total : 0
            }
        };

        var items = [];
        //creat grid
        if(config.columns && config.columns.length > 0){
            me.columns = config.columns;
            me._createGrid(me.gridData, null);
            items = [me.grid];
        }
        
        //次数单选框
        me.toolCounter = new Sweet.form.CheckBox({
            checked: false,
            tip: true,
            width: 100,
            height: 25,
            columns: "auto",
            value: {"value": "1", "text": BusinessI18N.cmp.grid.counterTool}
        });
        
        me.panel = new Sweet.panel.VPanel({
            width: "100%",
            height: "100%",
            header: true,
            title: config.panelTitle,
            tools: config.columns.counterHiddened ? [me.toolCounter] : [],
            items : items
        });
        
        // 事件
        me.toolCounter.addListener("click",function(event, checked){
                me._toolCounterChange(checked);
            });
    };

    /**
     * 次数单选按钮点击事件
     * @private
     * @param checked
     */
    Business.grid.prototype._toolCounterChange = function(checked){

        var me = this;
        var config = me.config;
        //次数单选框选择改变
        this.showCounters = checked;

        //为counter列设置显隐
        for(var i = 0; i < config.columns.length; i++){
            var col = config.columns[i];
            if(col.transform === 'counter'){
                col.hidden = !this.showCounters;
            }
        }

        //Sweet表格组件的列头改变事件
        me.grid.headerChanged(config.columns);
    };
    
    /**
     * creat grid
     * @private
     */
    Business.grid.prototype._createGrid = function(data, params) {
        if($.isNull(data)){
            return;
        }
        var me = this;
        var tempData = {};
        tempData = data;
        me.store = null;
        
        me._dataTotal = 0;
        
        //表格组件销毁，容器里只有一个表格
        if (me.grid) {
            me.grid.destroy();
        }
        
        var reader =  new Sweet.Reader.JsonReader();        
        
        if(tempData.data && tempData.data.length > 0){
            if(tempData.page && tempData.page.total){
                me._dataTotal = tempData.page.total;
            }
            else{
                me._dataTotal = tempData.data.length;
            }
        }else{
            tempData.data = [];
        }
        
        //暂时只支持前台处理 前台分页，排序
        me.store = new Sweet.Store.GridStore({
                    baseParams: {},
                    reader: reader,
                    cache: true,
                    isRequest: false
                });

        var columnInfo = me._createColumnInfo(tempData.columns);
        var config = me.config.grid;
        
        //初始化表格组件
        me.grid = new Sweet.grid.Grid({
            width: "100%",
            height: "100%",
            store: me.store,
            data: {
                columns: columnInfo,
                data: [],
                page: {
                    size: 20,
                    total: me._dataTotal
                },
                sn: true,
                resizable: true,
                checkbox: false,
                multiColumnSort: me.config["multiColumnSort"],
                selectColumn: true,
                clearFilters: true,
                secondaryStat: false,
                "export" :true,
                exportType : ["csv"]

            }
        });

        // 显示数据
        var tempGridData = {};
        if (tempData.data && tempData.data.length > 0) {
            tempGridData.data = tempData.data;
            tempData.page ? tempGridData.page = tempData.page :"";
            me.store.loadData(tempGridData);
        }
        me.grid.addListener("cellClick", function(event, data){

            //单元格点击获取整行的数据，为钻取下个页面准备参数
            me.baseDrillData = data;
        });
        me.grid.addListener("rowDblClick", function(event, data){
        	if(me.config.dbDrillFunc && typeof(me.config.dbDrillFunc) === "function"){            
                me.config.dbDrillFunc(event, data);
            } 
        });
        me.grid.addListener("afterSetData", function(event, data){
            //表格设置完数据后执行外部函数
            if(me.config.afterSetDataFunc && typeof(me.config.afterSetDataFunc) == "function")
            {
                me.config.afterSetDataFunc();
            }
        });
        
        //导出按钮点击事件
        me.grid.addListener("export", function(event, data){
            me._onExport(event, data);
        });
        
    };
    
    /**
     * 修改无效数据的样式
     * @param info 
     * @private
     */
    Business.grid.prototype._renderColumn = function (info) {
    	if(info && info["columnDesc"] && info["columnDesc"]["unDrillDatas"]){
    		if($.inArray(("" + info.data), info["columnDesc"]["unDrillDatas"]) > -1){
    			return '<div><span style="color:black;">' + info.data + '</span></div>';
    		}else{
    			return '<div><span style="cursor:pointer;text-decoration:underline;">' + info.data + '</span></div>';
    		}
    	}
        // 添加为空判断
        if (!info.data || info.data === Business.cmpGrid.noSupportStr.plusplus || info.data === Business.cmpGrid.noSupportStr.hundred || info.data === Business.cmpGrid.noSupportStr.zero)
        {
            return '<div><span style="color:black;">' + info.data + '</span></div>';
        }else{
            return '<div><span style="cursor:pointer;text-decoration:underline;">' + info.data + '</span></div>';
        }
    },
    
    /**
     * 创建表格头信息
     * @private
     */
    Business.grid.prototype._createColumnInfo = function (data) {
        if($.isNull(data)){
            return;
        }
        var i;
        var column = {};
        var me = this;
        var columns = data;
        me.counterHeaders = [];
        // 处理KPI、COUNTER列头
        
        for (i = 0; i < columns.length; i++) { 
            column = columns[i];

            //为钻取列增加钻取菜单
            if ($.isNotNull(column.menus) && column.menus.length > 0) {
                var tempLen = column.menus.length;
                for(var k = 0; k < tempLen; k++){
                    column.menus[k].icon =  Business.imagePath.gridCdrDrill;
                }

                //钻取菜单点击事件
                column.itemClick = function(e, data) {
                                    $.log("itemClick click: " + data);
                                    me._onMenuClick(e,data);
                                };
                //确定钻取菜单是否显示（数据为"0","100%"）
                column.beforeShowMenu = function(tempData){
                    if(me.baseDrillData && me.baseDrillData.rowData){
                        var value = me.baseDrillData.rowData[tempData.name];
                        if(me.columns && me.columns.length > 0){
                        	for(var k = 0; k < me.columns.length; k++){
                        		if(tempData.name == me.columns[k]["name"] && me.columns[k]["unDrillDatas"]){
                    				if($.inArray(("" + value), me.columns[k]["unDrillDatas"]) > -1){
                    	    			return false;
                    	    		}else{
                    	    			return true;
                    	    		}
                        		}
                        	}
                        }
                        if(!value || value === Business.cmpGrid.noSupportStr.plusplus || value === Business.cmpGrid.noSupportStr.hundred || value === Business.cmpGrid.noSupportStr.zero){
                            return false;
                        }else{
                            return true;
                        }
                    }
                };
                column.renderer = me._renderColumn;
            }
        }
        
        return columns;
    };

    /**
     * 菜单点击事件处理
     * @param event
     * @param data
     * @private
     */
    Business.grid.prototype._onMenuClick = function (event, data) {
        var me = this;        
        var params = {};

        params.columnName = me.baseDrillData.name;
        params.rowData = me.baseDrillData.rowData;
        params.type = data;
       
        
        //钻取下个页面回调函数
        if(me.config.drillFunc && typeof(me.config.drillFunc) === "function")
        {            
            me.config.drillFunc(params);
        }        
    };
    
    /**
     * 前台导出查询结果  
     * @private
     */
    Business.grid.prototype._onExport = function (event, data) {
        var me = this;
        var config = me.config;

        var col = [];
        var header = {};
        var headerName = [];
        
        header["SN"] = BusinessI18N.cmp.grid.sn;
        headerName.push("SN");
        if(data && data.columns){
        	col = data.columns;
        }
        for(var i = 0; i < col.length; i++){    
        	header[col[i].name] =col[i].header;
            //根据列的hidden属性来判断列是否导出
            if(!col[i].hidden){
                headerName.push(col[i].name); 
            } 
        }

        var data = [];
        if(me.store){
        	data = me.store.getCurrentData() || [];
        }
        // 添加行号
        for ( var i = 0; i < data.length; i++) {
            data[i].SN = i + 1 + "";
        }
        //构造前台导出参数 
        var params ={
            title : config.title,
            format : "csv",
            header : header,
            headerName : headerName,
            data : data
        };

        //向后台发送请求，导出请求路径
        var reqConfig = {
            url : Business.url.exportData,
            async : true,
            loadMask : true,
            data : JSON.stringify(params),
            contentType : "application/json;chartset=UTF-8",
            timeout : 300000,
            success : function(result) {
			    if (!$.isNull(result.filePath) && result.filePath !== "error") {
				    Business.functions.requestDataByForm(Business.url.downLoad, result, "", false);
				}else{
				    //提示导出失败
				    Sweet.Msg.error("Export File Error");
				}
			},
			error : function() {
	    		Sweet.Msg.error("Error");
		    }
        };
        // 发送请求
        Sweet.Ajax.request(reqConfig);
    };
})();


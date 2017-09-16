/**
 * @fileOverview  
 * <pre>
 * 业务组件中公用的函数
 * 2014-4-11 
 * </pre>
 * @version 1.0
 */
 

(function() {

    Business.functions = {

        /**
         * 获取tree或list的value数据的text（只获取叶子节点）
         * @param {Object} valueObj 数组对象
         * @return {String} 对象如{text : "one, two", value: "1, 2"}
         */
        getLeafArray: function(valueObj) {
            var me = this;
            valueObj = valueObj || null;
            var valueArr = me.oneObjToArray(valueObj);
            var leafVal = me.getLeafNodeObj(valueArr);
            return me.objArrToObj(leafVal);
        },

        /**
         * 统一数据格式，将对象转换为数组
         * @param {Object} data 对象或数组
         * @return {object} 数组如[{"text":"1", "value":"ONE"}]
         */
        oneObjToArray: function(data) {
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
         * 获取tree中的叶子节点
         * @param {Object} treeValue 对象数组 
         * @return {object} [{"text":"1", "value":"ONE"},{"text":"2", "value":"TWO"}]
         */
        getLeafNodeObj: function(treeValue, obj) {
            var me = this;
            obj = obj || [];
            if (!treeValue) {
                return;
            }
            for (var i = 0; i < treeValue.length; i++) {
                if (treeValue[i].children) {
                    me.getLeafNodeObj(treeValue[i].children, obj);
                } else {
                    obj.push(treeValue[i]);
                }
            }
            return obj;
        },

        /**
         * 将对象数组转换为一个对象
         * @return {object} {"text":"1,2", "value":"ONE,TWO"}
         */
        objArrToObj: function(data) {
            var me = this, obj = {}, text = "", value = "", tempText = "";
            if (!data) {
                obj.text = text;
                obj.value = value;
                return obj;
            }
            var arr = me.oneObjToArray(data);
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
         * @description from请求
         * @param {String} action 请求的路径
         * @param {Object} params 请求携带的参数
         * @param {String} formName 请求的名称
         * @param {Boolean} target 请求的目标（target = _blank时为新页面）
         */
        requestDataByForm : function(action, params, formName, target) {
            var form, target, iframe;
            form = document.createElement("form");
            form.name = formName;
            form.action = action;
            form.method = "post";
            if (target) {
                form.target = "_blank";
            } else {
                if ($.isNull(document.getElementById("fileSave"))) {
                    try {
                        iframe = document.createElement('<iframe name="fileSave">');
                    } catch (ex) {
                        iframe = document.createElement('iframe');
                    }
                    iframe.id = "fileSave";
                    iframe.name = "fileSave";
                    iframe.width = 0;
                    iframe.height = 0;
                    iframe.marginHeight = 0;
                    iframe.marginWidth = 0;
                    iframe.x = -10000;
                    iframe.y = -10000;
                    iframe.style.display="none";
                    document.body.appendChild(iframe);
                }
                form.target = "fileSave";
            }
            // 循环对象参数，创建隐藏域，用于提交
            for ( var p in params) {
                var input;
                input = form.appendChild(document.createElement("input"));
                input.type = "hidden";
                input.name = p;
                input.value = params[p];
            }
            form.style.display = "none";
            document.body.appendChild(form);
            form.submit();
            $(form).empty();
        },
        
        unEscapeHtml : function(str){
                return str.replace(/&#x2F;/g,"/").
                replace(/&#x27;/g,"'").
                replace(/&quot;/g,'"').
                replace(/&gt;/g,'>').
                replace(/&lt;/g,'<').
                replace(/&amp;/g,'&');
        },
        
        drillFunc : function(drillParams, queryParams, columns, counterWithXdrTotal){

            // 不算序号列，列数小于3，每列都居左
            if(columns && 3 > columns.length) {
                columns.forEach(function(column, columnIndex, columnArr) {
                    column.align = "left";
                });
            }
            // 列名
            var counter = drillParams.columnName;
            var record = drillParams.rowData;
            var counterValue = record[counter];
            // 钻取类型
            var drillType = drillParams.type.value;
            var drillTitle = drillParams.type.text;
        
            
            var params = $.objClone(queryParams);
            params.title = drillTitle;
            params.type = drillType;
            params.drillCounter = counter;
            params.drillCounterValue = counterValue;
            params.drillRecord = record;
            params.columns = columns;

            if (counterWithXdrTotal && 0 <= counterWithXdrTotal.indexOf(counter)){
                delete params.drillCounterValue;
            }
        
            //获取模型
            var module=queryParams.module;
            var url = "";
            if (drillType === "xdr") {
                url = basePath + "seqCommonController/drillXdr.action";
            } else{
                url = basePath + "pages/"+module+"/" + drillType + ".jsp";
            }
            url = url + "?params=" + encodeURI(Business.functions.unEscapeHtml(JSON.stringify(params)));
            var drillPageName = queryParams.module+"_"+queryParams.feature+"_"+drillParams.columnName;
            for(var key in record) {
                drillPageName += ("_" + record[key]);
            }
            var id = drillPageName.replace(new RegExp(/[^_A-Za-z0-9]/g), "");
            // 防止两个下划线中间字符全被删除，导致出现两个连着的下划线
            id = id.replace(new RegExp(/_{2,}/g),"_");
            top.showTabPanelPost ? top.showTabPanelPost(drillTitle, id, url) : window
                    .open(url);    
        },

        /**
         * 生成表格过滤列表
         * @param {Array} gridData 表格数据 
         * @param {Array} gridColumns 表格列头
         * @return {Array} gridColumns 表格列头
         */
        creatGridFilterList: function(gridData, gridColumns) { 
            var dimWithFilterList = [];
            // 对象数组如：[{},{}]
            var dimFilterLists = [];
            // 从表格头中查找过滤类型为list的列
            gridColumns.forEach(function(column, columnIndex, columnArr) {
                if("list" === column.filterType) {
                    // 有_name和_id对应的两列，才能构造过滤的list
                    var index = column.name.indexOf("_NAME");
                    if(-1 < index) {
                        dimWithFilterList.push(column.name.slice(0, index));
                        dimFilterLists.push({});
                    } else {
                        column.filterType = "string";
                    }
                    
                }
            });

            if(1 > dimWithFilterList.length) {
                return gridColumns;
            }

            // 从表格数据中获取对象，构造dimFilterLists的数据
            gridData.forEach(function(item, index, arr) {
                dimWithFilterList.forEach(function(dim, dimIndex, dimArr) {
                    dimFilterLists[dimIndex][item[dim+"_ID"]] = {text: item[dim+"_NAME"], value: item[dim+"_ID"]};
                });
            });

            // 将dimFilterLists([{},{}])转换为二维数组dimFilterLists1([[],[]])
            var dimFilterLists1 = [];
            dimFilterLists.forEach(function(objItem, arrIndex, arrs) {
                var objToArr = [];
                for(var key in objItem) {
                    objToArr.push(objItem[key]);
                }
                dimFilterLists1.push(objToArr);
            });

            // 将dimFilterLists1([[],[]])转换为对象dimWithFilterList
            var dimFilterListsObj = {};
            dimWithFilterList.forEach(function(dimName, dimNameIndex, dimNameArr) {
                dimFilterListsObj[dimName+"_NAME"] = dimFilterLists1[dimNameIndex];
            });

            gridColumns.forEach(function(column1, column1Index, column1Arr) {
                if("list" === column1.filterType) {
                    column1["filterList"] = dimFilterListsObj[column1.name];
                }
            });

            return $.objClone(gridColumns);
        }
    }   
})();
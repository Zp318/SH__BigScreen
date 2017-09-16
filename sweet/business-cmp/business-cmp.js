/**
 * @fileOverview 业务组件国际化资源
 * @date 2014/1/6
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 */
(function() {

    // 中文
    BusinessI18NZH.cmp = {

        timeRange: {
            timeRange: "时间范围",
            interval: "粒度",
            interval_86400: "天",
            interval_3600: "1 小时",
            interval_900: "15 分钟",

            timeStoreMsg: "系统可以提供{0}起始的数据查询。",
            finalTimeMsg: "终止时间输入有误。",

            size: {
                timeLableWidth: 75,
                intervalLableWidth: 50,
                intervalWidth: 144
            }
        },

        area: {
            labelText: "区域",
            listWindowLeftTitle: "选择项",
            listWindowRightTitle: "已选择",
            cell: "CGI/SAI",
            officDirection: "局向",
            pleaseSelect: "请选择…",
            selectCell: "选择小区",
            selectTopN: "选择Top N",
            allText: "全选",
            pleaseSelectArea: "请选择区域！",
            notEmpty: "不能为空。",
            onlyChartNum: "只能为数字或0-9,a-z,A-Z的组合.",
            source: "源:",
            destination: "目的:",
            size: {
                lableWidth: 75
            }
        },

        more: {
            windowTitle: "更多",
            indicator: "指标",
            add: "添加",
            delete: "删除",
            selectKpi: "请选择指标！"
        },

        queryCondition: {
            query: "查询"
        },

        gridDrill: {
            "cdrDrill": "CDR详单记录",
            "failercauseDrill": "失败原因分析",
            "hocauseDrill": "切换原因分析"
        },

        line: {
            chartDisplay: "图表展示",
            selectObject: "选择对象",
            indexLabelText: "指标",
            selectPeriod: "选择周期",
            multiObject: "多对象对比",
            history: "历史趋势",
            timeDate: [
                [1, '一天前'],
                [2, '两天前'],
                [3, '三天前'],
                [4, '四天前'],
                [5, '五天前'],
                [6, '六天前'],
                [7, '七天前']
            ],
            currentPeriod: "本周期",
            size: {
                objBoxWidth: 324,
                objBoxLabelWidth: 74,
                indexWidth: 300,
                indexLabelWidth: 50,
                periodWidth: 324,
                periodLabelWidth: 74,
                radioWidth: 200

            }
        },

        grid: {
            gridDisplay: "报表详情",
            counterTool: "次数",
            sn: "序号"
        },

        conditionManage: {
            queryConditionHistory: "选择查询条件",
            queryConditionSave: "保存查询条件",
            queryConditionLast: "最后一次查询",
            inputTemplateName: "请输入模板名称：",
            save: "保存",
            ok: "确认",
            delete: "删除",
            noInput: "只能输入字母、数字、汉字、下划线或中划线！",
            saveTempletError: "保存模板失败！",
            deleteTempletTips: "您确定要删除模板\"" + "{0}" + "\"吗？"
        },

        failCause: {
            //失败原因页面标题中文国际化
            baseTitle: "失败原因分析",
            tabelName: "信令详单",

            //失败原因类表双饼图中文国际化
            leftPieTitle: "失败原因归属占比",
            rightPieTitle: "失败原因占比"
        }
    };


    // 英文
    BusinessI18NEN.cmp = {

        timeRange: {
            timeRange: "Time Period",
            interval: "Interval",
            interval_86400: "Day",
            interval_3600: "1 Hour",
            interval_900: "15 Minutes",

            timeStoreMsg: "The earliest start date for this data query is {0}.",
            finalTimeMsg: "The end time input error.",

            size: {
                timeLableWidth: 90,
                intervalLableWidth: 66,
                intervalWidth: 165
            }
        },

        area: {
            labelText: "Area",
            listWindowLeftTitle: "Options",
            listWindowRightTitle: "Selected",
            cell: "CGI/SAI",
            officDirection: "Office Direction",
            pleaseSelect: "Please select…",
            selectCell: "Select CGI/SAI",
            selectTopN: "Select Top N",
            allText: "All",
            pleaseSelectArea: "Please select the Area!",
            notEmpty: " cannot be empty.",
            onlyChartNum: "It can only be a number or a combination of 0-9,a-z,A-Z.",
            source: "Source:",
            destination: "Destination:",
            size: {
                lableWidth: 90
            }
        },

        more: {
            windowTitle: "Select KPI",
            indicator: "Indicator",
            add: "Add",
            delete: "Delete",
            selectKpi: "Please select the Indicator!"
        },

        queryCondition: {
            query: "Query"
        },

        gridDrill: {
            "cdrDrill": "CDR Details",
            "failcauseDrill": "Failure Analysis",
            "hocauseDrill": "Handover Cause Analysis"
        },

        line: {
            chartDisplay: "Chart Display",
            selectObject: "Select Object",
            indexLabelText: "Indicator",
            selectPeriod: "Select Period",
            multiObject: "Multi-Object Comparison",
            history: "History Comparison",
            timeDate: [
                [1, '1 day ago'],
                [2, '2 days ago'],
                [3, '3 days ago'],
                [4, '4 days ago'],
                [5, '5 days ago'],
                [6, '6 days ago'],
                [7, '7 days ago']
            ],
            currentPeriod: "Current period",
            size: {
                objBoxWidth: 325,
                objBoxLabelWidth: 100,
                indexWidth: 300,
                indexLabelWidth: 75,
                periodWidth: 325,
                periodLabelWidth: 100,
                radioWidth: 350
            }
        },

        grid: {
            gridDisplay: "Report Details",
            counterTool: "Counter",
            sn: "SN"
        },

        conditionManage: {
            queryConditionHistory: "Select Query Conditions",
            queryConditionSave: "Save Query Conditions",
            queryConditionLast: "Last Query",
            inputTemplateName: "Please enter template name：",
            save: "Save",
            ok: "OK",
            delete: "Delete",
            noInput: "Only English letters, digits (0-9), underlines (_) and hyphens (-) are allowed.",
            saveTempletError: "Failed to save the template.",
            deleteTempletTips: "Are you sure you want to delete the template \"" + "{0}" + "\"?"
        },

        failCause: {
            //失败原因页面标题英文国际化
            baseTitle: "Failure Analysis",
            tabelName: "Signaling Records",

            //失败原因类表双饼图英文国际化
            leftPieTitle: "Cause Category",
            rightPieTitle: "Cause Analysis"
        }
    };
    BusinessI18NZH.comm = {
        noInput: "输入模板名称不正确，请重新输入！支持 ! @ # ~ - _ ( ) [ ] . 字母 数字 中文 空格。",
        noInputLength: "模板名称的长度不能大于" + "{0}" + "个字符！",
        templateNameNotNull: "请输入模板名称！",
        template_Name: "模板名称",
        pleaseInput: "请输入...",
        privates: "个 人",
        publics: "公 共",
        saveTemplateSucc: "成功",
        saveTemplateSuccMsg: "模板保存成功.",
        saveTemplate: "保存模板",
        operation: "操作",
        operationWidth: 50,
        importTemplate: "载入模板",
        templateName: "名称",
        templateType: "类型",
        templateOwner: "创建者",
        confirmDel: "确定要删除已选定的模板吗？",
        checkTemplate: "请选择模板！",
        cancel: "取消",
        OK: "确定",
        save: "保存"
    };
    BusinessI18NEN.comm = {
        noInput: "The template name is incorrect,please enter again.Support ! @ # ~ - _ () [] . space and alphanumeric.",
        noInputLength: "The length of the template name cannot exceed " + "{0}" + " characters!",
        templateNameNotNull: "Please enter the template name!",
        template_Name: "Template Name",
        pleaseInput: "Please enter...",
        privates: "private",
        publics: "public",
        saveTemplateSucc: "Success",
        saveTemplateSuccMsg: "Template saved successfully.",
        saveTemplate: "Save Template",
        operation: "Operator",
        operationWidth: 80,
        importTemplate: "Load Template",
        templateName: "Name",
        templateOwner: "Creator",
        templateType: "Type",
        confirmDel: "Are you sure to delete the template you selected?",
        checkTemplate: "please select a template！",
        cancel: "Cancel",
        save: "Save",
        OK: "OK"
    };

})();

/**
 * @fileOverview 业务组件
 * @date 2014/1/6
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2014,  All rights reserved
 */
(function() {
    // 初始化sweet
    var global = this;
    if (typeof Business === "undefined") {
        global.Business = {};
    }

    Business.url = {
        storeDuration: basePath + "businessWidget/storeDuration.action",
        serverDate: basePath + "businessWidget/serverDate.action",
        areaData: basePath + "businessWidget/area.action",
        moreData: basePath + "businessWidget/more.action",

        getPageConfig: basePath + "seqCommonController/getPageConfig.action",
        getData: basePath + "seqCommonController/getData.action",
        exportData: basePath + "seqCommonController/exportData.action",
        downLoad: basePath + "seqCommonController/downLoad.action",
        getTimeList: basePath + "seqCommonController/getTimeList.action",

        saveTemplate: basePath + "businessWidget/saveQueryTemplate.action",
        templateList: basePath + "businessWidget/getQueryTemplates.action",
        deleteTemplate: basePath + "businessWidget/deleteQueryTemplate.action"
    };

    Business.interval = {
        day: 86400,
        hour: 3600,
        minutes: 900
    };

    Business.areaData = {
        areaType: {
            "MSC_POOL": "MSC-POOL",
            "MSC": "MSC",
            "BSC": "BSC",
            "RNC": "RNC",
            "BSCRNC": "BSC/RNC",
            "RNC_BSC": "RNC-BSC", //国际化
            "SAI": "SAI", //国际化
            "CGI": "CGI", //国际化
            "CGISAI": BusinessI18N.cmp.area.cell,
            "SAI_CGI": "SAI-CGI", //国际化
            "OFFICE_DIRECTION": BusinessI18N.cmp.area.officDirection
        },
        areaTypeKey: ["MSC_POOL", "MSC", "BSC", "RNC", "BSCRNC", "RNC_BSC", "SAI", "CGI", "CGISAI", "SAI_CGI", "CGISAI_CGISAI", "OFFICE_DIRECTION"]
    };
    //表格钻取的图片配置
    Business.imagePath = {
        gridCdrDrill: basePath + "sweet/business-cmp/themes/images/drillDown.png",
        gridFailcauseDrill: basePath + "sweet/business-cmp/themes/images/drillDown.pngn",
        gridHocauseDrill: basePath + "sweet/business-cmp/themes/images/drillDown.png"
    };

    Business.saveCondition = {
        templateNameLength: 16
    };

})();

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
            var me = this,
                obj = {}, text = "",
                value = "",
                tempText = "";
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
        requestDataByForm: function(action, params, formName, target) {
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
                    iframe.style.display = "none";
                    document.body.appendChild(iframe);
                }
                form.target = "fileSave";
            }
            // 循环对象参数，创建隐藏域，用于提交
            for (var p in params) {
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

        unEscapeHtml: function(str) {
            return str.replace(/&#x2F;/g, "/").
            replace(/&#x27;/g, "'").
            replace(/&quot;/g, '"').
            replace(/&gt;/g, '>').
            replace(/&lt;/g, '<').
            replace(/&amp;/g, '&');
        },
        drillFunc: function(drillParams, queryParams, columns, counterWithXdrTotal) {

            // 不算序号列，列数小于3，每列都居左
            if (columns && 3 > columns.length) {
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

            if (counterWithXdrTotal && 0 <= counterWithXdrTotal.indexOf(counter)) {
                delete params.drillCounterValue;
            }

            //获取模型
            var module = queryParams.module;
            var url = "";
            if (drillType === "xdr") {
                url = basePath + "seqCommonController/drillXdr.action";
            } else {
                url = basePath + "pages/" + module + "/" + drillType + ".jsp";
            }
            url = url + "?params=" + encodeURI(Business.functions.unEscapeHtml(JSON.stringify(params)));
            var drillPageName = queryParams.module + "_" + queryParams.feature + "_" + drillParams.columnName;
            for (var key in record) {
                drillPageName += ("_" + record[key]);
            }
            var id = drillPageName.replace(new RegExp(/[^_A-Za-z0-9]/g), "");
            // 防止两个下划线中间字符全被删除，导致出现两个连着的下划线
            id = id.replace(new RegExp(/_{2,}/g), "_");
            top.showTabPanelPost ? top.showTabPanelPost(drillTitle, id, url) : window.open(url);
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
                if ("list" === column.filterType) {
                    // 有_name和_id对应的两列，才能构造过滤的list
                    var index = column.name.indexOf("_NAME");
                    if (-1 < index) {
                        dimWithFilterList.push(column.name.slice(0, index));
                        dimFilterLists.push({});
                    } else {
                        column.filterType = "string";
                    }

                }
            });

            if (1 > dimWithFilterList.length) {
                return gridColumns;
            }

            // 从表格数据中获取对象，构造dimFilterLists的数据
            gridData.forEach(function(item, index, arr) {
                dimWithFilterList.forEach(function(dim, dimIndex, dimArr) {
                    dimFilterLists[dimIndex][item[dim + "_ID"]] = {
                        text: item[dim + "_NAME"],
                        value: item[dim + "_ID"]
                    };
                });
            });

            // 将dimFilterLists([{},{}])转换为二维数组dimFilterLists1([[],[]])
            var dimFilterLists1 = [];
            dimFilterLists.forEach(function(objItem, arrIndex, arrs) {
                var objToArr = [];
                for (var key in objItem) {
                    objToArr.push(objItem[key]);
                }
                dimFilterLists1.push(objToArr);
            });

            // 将dimFilterLists1([[],[]])转换为对象dimWithFilterList
            var dimFilterListsObj = {};
            dimWithFilterList.forEach(function(dimName, dimNameIndex, dimNameArr) {
                dimFilterListsObj[dimName + "_NAME"] = dimFilterLists1[dimNameIndex];
            });

            gridColumns.forEach(function(column1, column1Index, column1Arr) {
                if ("list" === column1.filterType) {
                    column1["filterList"] = dimFilterListsObj[column1.name];
                }
            });

            return $.objClone(gridColumns);
        }
    }
})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--时间范围组件，包括：开始时间、结束时间、时间粒度和忙时选择
 * 2014-1-5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2014, All rights reserved 
 * </pre>
 * @version 1.0
 */


(function() {

    Business.timeRange = function(params) {

        //初始参数设置
        this.config = {
            // label的宽度
            labelWidth: BusinessI18N.cmp.timeRange.size.timeLableWidth,
            // 粒度下拉框的宽度
            timeBoxWidth: 160,
            // 是否需要粒度组件
            timeUnit: true,
            // 是否需要忙时组件
            timeschedule: true,
            // 忙时组件的宽度
            timescheduleWidth: 128,
            // 是否隐藏
            hidden: false,
            // 
            business: "csnpm",
            // 日期格式
            format: "yyyy-MM-dd hh:mm:ss",
            // 粒度数据
            intervalData: Business.interval.day + "," + Business.interval.hour + "," + Business.interval.minutes,
            // 渲染ID
            renderTo: null,
            // 是否跨天
            isOneDay: false,
            // 日期组件支持输入
            editable: false
        };

        this.config = $.extend(this.config, params);

        //初始化存储时长
        this._initStoreDuration(true);

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回各个组件
     * @returns {Object}
     */
    Business.timeRange.prototype.getItems = function() {
        return this.items;
    };

    /**
     * @description 返回模板面板。不建议使用该方法，以后会将其删掉
     * @returns {Object}
     */
    Business.timeRange.prototype.getPanel = function() {
        var me = this;
        var config = me.config;

        var temp = {
            height: 35,
            items: me.items,
            itemExtend: false,
            padding: 5,
            margin: [5, 0, 0, 0]
        };
        if (config.renderTo) {
            temp.renderTo = config.renderTo;
        }
        me.panel = new Sweet.panel.HPanel(temp);

        return this.panel;
    };

    /**
     * 获取时间范围组件数据
     */
    Business.timeRange.prototype.getValue = function() {
        var me = this;
        var config = me.config;

        if (me._valid()) {
            var value = {};
            //时间范围
            value.startTime = me._startTimeBox.getValue().value;
            value.endTime = me._endTimeBox.getValue().value;

            //时间粒度
            if (config.timeUnit && config.timeUnit !== "false") {
                var interval = me._intervalBox.getValue().value;
                value.interval = interval;

                // 15分钟粒度，分钟可选故需要规整，起始时间向过去的时间上规整，结束时间向未来的时间上规整
                var startTime = new Date(value.startTime.replace(/-/g, "/"));
                var endTime = new Date(value.endTime.replace(/-/g, "/"));
                var format = config.format;
                if (interval.toString() === Business.interval.minutes.toString()) {
                    // 必须加该判断，否则多次调用getValue()方法，导致规整好多次后出错
                    if (0 !== startTime.getMinutes() % 15) {
                        startTime.setMinutes(parseInt(startTime.getMinutes() / 15) * 15);
                        me._startTimeBox.setValue({
                            value: $.date.format(startTime, format),
                            text: "time"
                        });
                        me._startTimeBox.setRegularization(parseInt(interval));
                        value.startTime = me._startTimeBox.getValue().value;
                    }

                    if (0 !== endTime.getMinutes() % 15) {
                        endTime.setMinutes((parseInt(endTime.getMinutes() / 15) + 1) * 15);
                        me._endTimeBox.setValue({
                            value: $.date.format(endTime, format),
                            text: "time"
                        });
                        me._endTimeBox.setRegularization(parseInt(interval));
                        value.endTime = me._endTimeBox.getValue().value;
                    }
                }

            }
            //自定义时间
            if (config.timeschedule && config.timeschedule !== "false") {
                value.schedule = me._timeschedule.getValue();
            }
            return value;
        } else {
            return null;
        }
    };

    /**
     * 设置时间范围组件
     *@param {Object} obj 数据信息对象
     */
    Business.timeRange.prototype.setValue = function(obj) {
        if ($.isNull(obj)) {
            return;
        }
        var me = this;

        //时间粒度赋值
        if ($.isNotNull(obj.interval) && $.isNotNull(me._intervalBox)) {
            me._intervalBox.setValue({
                value: obj.interval,
                text: BusinessI18N.cmp.timeRange["interval_" + obj.interval]
            });
        }

    };

    /**
     * 初始化组件 
     */
    Business.timeRange.prototype._init = function() {

        var me = this;
        var config = me.config;

        me.items = [];

        //开始时间、结束时间
        var serverDate = new Date(Date.parse(me._getServerDate().replace(/-/g, "/")));
        var serverTime = serverDate.getTime() / 1000;
        var endTime = null;
        var startTime = null;
        if (!config.timeUnit || config.timeUnit === "false") {
            endTime = serverTime;
            startTime = endTime - 3600;
        }
        if (config.isOneDay) {
            if (0 === serverDate.getHours() && 　
            0 === serverDate.getMinutes() && 0 === serverDate.getSeconds()) {
                startTime = serverDate.setDate(serverDate.getDate - 1).getTime() / 1000;
            } else {
                serverDate.setHours(0);
                serverDate.setMinutes(0);
                serverDate.setSeconds(0);
                startTime = serverDate.getTime() / 1000;
            }
        }

        //开始时间
        var labelWidth = config.labelWidth;

        var timeBoxWidth = config.timeBoxWidth;

        me._startTimeBox = new Sweet.form.Date({
            name: "startTime",
            editable: config.editable,
            width: timeBoxWidth + labelWidth,
            label: true,
            labelText: BusinessI18N.cmp.timeRange.timeRange,
            labelWidth: labelWidth,
            format: config.format,
            value: startTime ? {
                value: startTime,
                text: "time"
            } : {
                value: null
            },
            beforePopDatePanel: function() {
                me._setStoreRange();
            }
        });
        me.items.push(me._startTimeBox);
        var timeLabel = new Sweet.form.Label({
            align: Sweet.constants.align.Center,
            width: 5,
            value: {
                text: "-",
                value: "",
                data: null
            }
        });
        me.items.push(timeLabel);

        //结束时间
        me._endTimeBox = new Sweet.form.Date({
            name: "endTime",
            editable: config.editable,
            width: timeBoxWidth,
            label: false,
            format: config.format,
            value: endTime ? {
                value: endTime,
                text: "time"
            } : {
                value: null
            },
            beforePopDatePanel: function() {
                me._setStoreRange();
            }
        });
        me.items.push(me._endTimeBox);


        //时间粒度
        if (config.timeUnit && config.timeUnit !== "false") {
            // 粒度对时间规整，format只能为"yyyy-MM-dd hh:mm"
            config.format = "yyyy-MM-dd hh:mm";
            me._startTimeBox.setFiledType("S");
            me._endTimeBox.setFiledType("S");
            //构造时间粒度选择数据
            var intervalBoxData = [];
            var intervalData = [];
            if ($.isNotNull(config.intervalData)) {
                intervalData = config.intervalData.split(",");
            }
            for (var i = 0, len = intervalData.length; i < len; i++) {
                intervalBoxData.push({
                    value: intervalData[i],
                    text: BusinessI18N.cmp.timeRange["interval_" + intervalData[i]]
                });
            }

            me._intervalBox = new Sweet.form.ComboBox_v1({
                name: "interval",
                width: BusinessI18N.cmp.timeRange.size.intervalWidth,
                label: true,
                labelText: BusinessI18N.cmp.timeRange.interval,
                labelWidth: BusinessI18N.cmp.timeRange.size.intervalLableWidth,
                multi: false,
                visible: (true === config.hidden || "true" === config.hidden) ? false : true,
                tip: true
            });
            me._intervalBox.addListener("change", function(event, val) {
                me._setTimeUnit(val);
            });

            me.items.push(me._intervalBox);

            me._startTimeBox.addListener("click", function(event, val) {
                me._setDisableTimePart(me._startTimeBox);

            });
            me._endTimeBox.addListener("click", function(event, val) {
                me._setDisableTimePart(me._endTimeBox);

            });
        }

        //忙时组件
        if (config.timeschedule && config.timeschedule !== "false") {
            me._timeschedule = new Sweet.cmp.TimeSchedule({
                name: "timeschedule",
                width: config.timescheduleWidth,
                type: 2,
                tip: true
            });
            me.items.push(me._timeschedule);
        }

        if (me._intervalBox) {
            me._intervalBox.setData(intervalBoxData);
        }
    };

    /**
     * 置灰时分秒
     * @param {Object} timeCmp 日期组件
     */
    Business.timeRange.prototype._setDisableTimePart = function(timeCmp) {
        var me = this;

        var key = me._intervalBox.getValue().value.toString();
        var temp = "";
        if (key === Business.interval.day.toString()) {
            temp = "yyyy-MM-dd";
        } else if (key === Business.interval.hour.toString()) {
            temp = "yyyy-MM-dd hh";
        } else if (key === Business.interval.minutes.toString()) {
            temp = "yyyy-MM-dd hh:mm";
        } else {
            temp = "yyyy-MM-dd hh:mm:ss";
        }
        if ($.isNotNull(temp) && key) {
            timeCmp.setDisableTimePart(temp);
        }
    };

    /**
     * 设置时间粒度
     * @param {Object} obj 选择的时间粒度对象
     */
    Business.timeRange.prototype._setTimeUnit = function(obj) {
        var me = this;
        var format = me.config.format;

        //时间粒度
        var interval = obj.value;

        //设置忙时组件是否可用
        if (me.config.timeschedule && me.config.timeschedule !== "false") {
            //大于等于天粒度，忙时组件不可用
            var disabled = interval >= Business.interval.day;
            me._timeschedule.setDisabled(disabled);
        }
        //获取可选时间范围
        var dateRange = me._getMinMaxDate();
        var endTime = dateRange.maxDate;
        // 重新设置时间
        me._endTimeBox.setValue({
            value: $.date.format(endTime, format),
            text: "time"
        });

        if (me.config.isOneDay) {
            if (0 === endTime.getHours() && 　
            0 === endTime.getMinutes() && 0 === endTime.getSeconds()) {
                endTime.setDate(endTime.getDate - 1);
            } else {
                endTime.setHours(0);
                endTime.setMinutes(0);
                endTime.setSeconds(0);
            }
        } else {
            endTime.setDate(endTime.getDate() - 7);
        }
        me._startTimeBox.setValue({
            value: $.date.format(endTime, format),
            text: "time"
        });
        //设置时间格式
        me._endTimeBox.setRegularization(parseInt(interval));
        me._startTimeBox.setRegularization(parseInt(interval));
    };

    /**
     * 根据存储时长，设置时间组件可选范围
     */
    Business.timeRange.prototype._setStoreRange = function() {
        var me = this;

        //获取可选时间范围
        var dateRange = me._getMinMaxDate();

        //设置开始时间可选范围
        me._startTimeBox.setMinDate(dateRange.minDate.getTime() / 1000);
        me._startTimeBox.setMaxDate(dateRange.maxDate.getTime() / 1000);
        //设置结束时间可选范围
        me._endTimeBox.setMinDate(dateRange.minDate.getTime() / 1000);
        me._endTimeBox.setMaxDate(dateRange.maxDate.getTime() / 1000);
    };

    /**
     * 根据存储时长，设置时间组件可选范围
     */
    Business.timeRange.prototype._getMinMaxDate = function() {
        var me = this;

        //获取选择粒度
        var interval = me.config.business;
        if (me.config.timeUnit && me.config.timeUnit !== "false") {
            interval = me._intervalBox.getValue().value;
        }
        //获取存储时长
        var storeDays = me._getStoreDuration(interval);
        //获取服务器时间
        var serverDate = me._getServerDate();
        var date = new Date(Date.parse(serverDate.replace(/-/g, "/")));

        var minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - storeDays);
        var maxDate = date;
        if (interval.toString() === Business.interval.day.toString()) {
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } else if (interval.toString() === Business.interval.hour.toString()) {
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 1);
        } else if (interval.toString() === Business.interval.minutes.toString()) {
            maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), (parseInt(date.getMinutes() / 15) - 1) * 15);
        }

        return {
            minDate: minDate,
            maxDate: maxDate
        };
    };


    /**
     * 获取服务时间，返回2000-10-10 12:20:23格式字符串
     */
    Business.timeRange.prototype._getServerDate = function() {
        var me = this;
        var serverDate = "";
        //请求后台，获取服务器时间
        Sweet.Ajax.request({
            url: Business.url.serverDate,
            contentT: "application/json;chartset=UTF-8",
            async: false,
            loadMask: false,
            timeout: 300000,
            success: function(result) {
                serverDate = result.serverDate;
            },
            error: function() {
                throw new Error("Business.timeRange() request serverDate error!");
            }
        });
        return serverDate;
    };

    /**
     * 获取业务数据存储时长
     *@param {Number} interval 时间粒度
     */
    Business.timeRange.prototype._getStoreDuration = function(interval) {
        var me = this;
        //如果参数中指定存储时长，则根据该存储时间设置时间范围
        if ($.isNotNull(me.config.storeDays)) {
            return parseInt(me.config.storeDays);
        }

        if ($.isNull(me._storeDuration)) {
            //请求后台，获取业务数据存储时长
            me._initStoreDuration(false);
        }
        var storeDays = me._storeDuration[interval];
        if ($.isNull(storeDays)) {
            //默认存储时长数据
            if (interval === Business.interval.minutes) {
                return 7;
            } else if (interval === Business.interval.hour) {
                return 30;
            } else {
                return 60;
            }
        }
        return parseInt(storeDays);
    };

    /**
     * 初始化数据存储时长
     *@param {Boolean} async 是否是异步请求
     */
    Business.timeRange.prototype._initStoreDuration = function(async) {
        var me = this;
        //请求后台，获取业务数据存储时长
        Sweet.Ajax.request({
            url: Business.url.storeDuration,
            contentT: "application/json;chartset=UTF-8",
            async: async,
            loadMask: false,
            timeout: 300000,
            success: function(result) {
                me._storeDuration = {};
                var intervalData = null;
                if ($.isNotNull(me.config.intervalData)) {
                    intervalData = me.config.intervalData.split(",");
                }
                if ($.isNull(intervalData)) {
                    me._storeDuration[me.config.business] = result[me.config.business];
                } else {
                    for (var interval in intervalData) {
                        me._storeDuration[interval] = result[me._getIntervalStoreKey(interval)];
                    }
                }

            },
            error: function() {
                throw new Error("Business.timeRange() request storeDuration error!");
            }
        });
    };

    /**
     * 界面选择数据校验
     */
    Business.timeRange.prototype._getIntervalStoreKey = function(interval) {
        if ($.isNull(interval)) {
            return "";
        }
        if (Business.interval.day === interval) {
            return me.config.business + "day";
        }

        if (Business.interval.hour === interval) {
            return me.config.business + "hour";
        }

        if (Business.interval.minutes === interval) {
            return me.config.business + "minute";
        }
        return "";
    };

    /**
     * 界面选择数据校验
     */
    Business.timeRange.prototype._valid = function() {
        var me = this;
        //获取可选时间范围
        var dateRange = me._getMinMaxDate();
        var startTime = me._startTimeBox.getValue().data;
        var endTime = me._endTimeBox.getValue().data;
        if (startTime < dateRange.minDate.getTime() / 1000) {
            Sweet.Msg.error(BusinessI18N.cmp.timeRange.timeStoreMsg.replace("{0}", $.date.format(dateRange.minDate, "yyyy-MM-dd")));
            return false;
        } else if (endTime > dateRange.maxDate.getTime() / 1000 || startTime >= endTime) {
            Sweet.Msg.error(BusinessI18N.cmp.timeRange.finalTimeMsg);
            return false;
        }
        return true;
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--区域，包括：区域下拉框、按钮、window和双向列表
 * 2014-4-10
 * </pre>
 * @version 1.0
 */


(function() {
    var AREA_TYPE = Business.areaData.areaType;
    var topNData = [50, 100, 200, 300];
    var ALL = BusinessI18N.cmp.area.allText;
    var selectAreaError = BusinessI18N.cmp.area.pleaseSelectArea;
    var splitMark = "_";
    var NEED_AREA_PAIR = "area_pair";
    var radioValue = {
        list: "list",
        topN: "topN"
    };
    var CMPTYPE = {
        listWindow: "listWindow", //默认，适用于MSC-POOL,MSC,RNC,BSC,BSC/RNC
        treeWindow: "treeWindow", //树形结构双向列表，适用于CGI,SAI,CGI/SAI
        officeDirection: "officeDirection", // 局向，适用于局向
        sdListWindow: "sdListWindow", //源、目的list双向列表，适用于RNC-BSC
        sdTreeWindow: "sdTreeWindow", // 源、目的tree双向列表，适用于SAI-CGI
        imsiField: "imsiField" //号码文本框
    };
    var windowSize = {
        listWindow: [470, 400],
        treeWindow: [470, 400],
        officeDirection: [470, 495],
        sdListWindow: [470, 500],
        sdTreeWindow: [470, 500],
        _paddingWidth: 10,
        _tempHeight: 71,
        _tempSDHeight: 93
    };
    var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
    var notEmpty = BusinessI18N.cmp.area.notEmpty;
    Business.area = function(params) {
        //初始参数设置
        this.config = {
            labelText: BusinessI18N.cmp.area.labelText,
            // lable宽度
            lableWidth: 50,
            // 下拉框宽度
            comboWidth: 120,
            // 复杂的areaType，直接在jsp中配置json对象；areaType需要配成""
            areaTypeUrl: null,
            url: Business.url.areaData,
            // 局向
            officeDirection: [{
                opt: "MSC",
                dpt: ["MSC"]
            }],
            // 号码长度
            imsiFieldLength: 32,
            // 文本框允许输入的字符
            imsiFieldAllowedCharts: /^[0-9a-zA-Z]+$/,
            // 区域下拉框change事件的回调函数
            changeFunc: function() {
                return null;
            }
        };

        if (params["labelText_" + locale]) {
            params["labelText"] = params["labelText_" + locale];
        }
        this.config = $.extend(this.config, params);
        //是否有topN的配置
        this._isTopN = true;
        if (!this.config["topN"]) {
            this._isTopN = false;
        } else {
            //如果没有配置数据则用默认的数据
            if (!("true" == this.config["topN"] || true == this.config["topN"])) {
                topNData = [];
                var _tempTopNData = this.config["topN"].split(",");
                if (_tempTopNData && _tempTopNData.length > 0) {
                    topNData = _tempTopNData;
                }
            }
        }
        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回各个组件
     * @returns {Object} result 容器
     */
    Business.area.prototype.getItems = function() {
        return this.items;
    };

    /**
     * 获取各个组件的原始value
     * @return {Object} {areaType: ,areaList: ,isTopN: ,topN}
     * @returns {Object} result 返回各个组件的原始value
     */
    Business.area.prototype.getOriginalValue = function() {
        var me = this;
        var val;
        var cmpType;

        var result = {
            areaType: $.objClone(me._combobox.getValue()),
            areaList: null,
            isTopN: null,
            topN: null
        };
        val = result.areaType.value;
        cmpType = result.areaType.data && result.areaType.data.cmpType ? result.areaType.data.cmpType : null;

        // imsiField
        if (CMPTYPE.imsiField === cmpType) {
            result.areaList = me._imsiField.getValue();
            return result;
        }
        //
        if (CMPTYPE.listWindow === cmpType) {
            result.areaList = $.objClone(me._listWindow.getValue());
        } else if (CMPTYPE.treeWindow === cmpType) {
            if (!me._isTopN) {
                result.areaList = $.objClone(me._cellListWin.getValue());
            } else {
                result.isTopN = me._cellRadioBtn.getValue();
                if (radioValue.topN === result.isTopN.value) {
                    result.topN = me._cellComboBox.getValue();
                } else {
                    result.areaList = $.objClone(me._cellListWin.getValue());
                }
            }
        } else if (CMPTYPE.officeDirection === cmpType) {
            result.areaList = me._officeDirection.getAllSelValue();
        } else if (CMPTYPE.sdListWindow === cmpType) {
            result.orgAreaList = me._sdListWinSTreeWindow.getValue();
            result.targetAreaList = me._sdListWinDTreeWindow.getValue();
        } else if (CMPTYPE.sdTreeWindow === cmpType) {
            result.orgAreaList = me._sdTreeWinSTreeWindow.getValue();
            result.targetAreaList = me._sdTreeWinDTreeWindow.getValue();
        } else {
            return;
        }

        result.selector = me._selector.getValue();
        return result;
    };

    /**
     * 获取值
     * @returns {Object} result 返回给后台用于查询的value
     */
    Business.area.prototype.getValue = function() {
        var me = this;
        var data = me.getOriginalValue();

        var result = {
            areaType: data.areaType.value
        };

        var cmpType = data.areaType.data && data.areaType.data.cmpType ? data.areaType.data.cmpType : null;
        var mscType = data.areaType.data && data.areaType.data.mscType ? data.areaType.data.mscType : null;

        if (CMPTYPE.imsiField === cmpType) {
            result.areaList = data.areaList.value;
            result.areaListObj = data.areaList;

            // 非空校验
            if (!result.areaList) {
                var message = data.areaType.text + notEmpty;
                if (!locale) {
                    message = "The " + message;
                }
                Sweet.Dialog.warn({
                    width: 330,
                    height: 130,
                    message: message
                });
                return null;
            }

            // 合法校验
            if (!me._imsiField.check()) {
                Sweet.Dialog.warn({
                    width: 330,
                    height: 130,
                    message: data.areaType.text + ": " + BusinessI18N.cmp.area.onlyChartNum
                });
                return null;
            }
            return result;
        }
        var selectorVal = (me._selector.getValue() && me._selector.getValue().value) ? me._selector.getValue().value : "";

        // 区域组件不能为空
        if (!selectorVal) {
            Sweet.Dialog.warn({
                width: 330,
                height: 130,
                message: selectAreaError
            });
            return null;
        }
        if (CMPTYPE.listWindow === cmpType) {
            var areaList = "";
            var areaListObj = null;
            if (ALL === selectorVal) {
                areaList = -1;
                areaListObj = me._areaListData;
            } else {
                areaListObj = me._listWindow.getValue();
                areaList = Business.functions.getLeafArray(areaListObj).value;
            }
            result.areaList = areaList;
            result.areaListObj = areaListObj;
            if (mscType) {
                result.mscType = mscType;
            }
        } else if (CMPTYPE.treeWindow === cmpType) {
            result.isTopN = (data.isTopN ? (radioValue.topN === data.isTopN.value ? true : false) : null);
            result.topN = data.topN ? data.topN.value : null;
            if (result.isTopN) {
                result.areaList = "-1";
                result.areaListObj = null;
                return result;
            };

            var areaListObj = Business.functions.oneObjToArray(data.areaList);
            areaListObj = Business.functions.getLeafNodeObj(areaListObj);
            result.areaListObj = areaListObj;
            // 不传areaList
            // 小区返回数据格式有变化，将BSC和CGISAI分开
            var selectedBscrncId = [];
            var selectedCgisaiId = [];
            data.areaList.forEach(function(bsc, bscIndex, bscArr) {
                if (bsc.data === bsc.children.length) {
                    // BSC下小区全选
                    selectedBscrncId.push(bsc.value);
                } else {
                    // 未全选
                    var childrenValue = Business.functions.getLeafArray(bsc.children).value;
                    var childrenValueArr = childrenValue.split(",");
                    selectedCgisaiId = selectedCgisaiId.concat(childrenValueArr);
                }
            });

            var selectedCells = {
                selectedBscrncId: selectedBscrncId.toString(),
                selectedCgisaiId: selectedCgisaiId.toString()
            };

            result.areaListForCgisai = selectedCells;
        } else if (CMPTYPE.officeDirection === cmpType) {
            var areaList = "";
            var areaListObj = null;
            if (ALL === selectorVal) {
                areaList = -1;
                var source = data.areaList.source.value;
                var destination = data.areaList.destination.value;
                areaListObj = Business.functions.oneObjToArray(me._getAllOfficeList(source, destination));
            } else {
                areaListObj = me._officeDirection.getValue();
                areaList = Business.functions.getLeafArray(areaListObj).value;
            }
            result.areaList = areaList;
            result.areaListObj = areaListObj;
        } else if (CMPTYPE.sdListWindow === cmpType) {
            result.orgAreaList = Business.functions.getLeafArray(data.orgAreaList).value;
            result.targetAreaList = Business.functions.getLeafArray(data.targetAreaList).value;
            result.areaListObj = NEED_AREA_PAIR;
        } else if (CMPTYPE.sdTreeWindow === cmpType) {
            // 源
            var orgSelectedBscrncId = [];
            var orgSelectedCgisaiId = [];
            data.orgAreaList.forEach(function(bsc, bscIndex, bscArr) {
                if (bsc.data === bsc.children.length) {
                    // BSC下小区全选
                    orgSelectedBscrncId.push(bsc.value);
                } else {
                    // 未全选
                    var childrenValue = Business.functions.getLeafArray(bsc.children).value;
                    var childrenValueArr = childrenValue.split(",");
                    orgSelectedCgisaiId = orgSelectedCgisaiId.concat(childrenValueArr);
                }
            });
            var selectedCells = {
                orgSelectedBscrncId: orgSelectedBscrncId.toString(),
                orgSelectedCgisaiId: orgSelectedCgisaiId.toString()
            };
            result.areaListForOrg = selectedCells;

            // 目的
            var targetSelectedBscrncId = [];
            var targetSelectedCgisaiId = [];
            data.targetAreaList.forEach(function(bsc, bscIndex, bscArr) {
                if (bsc.data === bsc.children.length) {
                    // BSC下小区全选
                    targetSelectedBscrncId.push(bsc.value);
                } else {
                    // 未全选
                    var childrenValue = Business.functions.getLeafArray(bsc.children).value;
                    var childrenValueArr = childrenValue.split(",");
                    targetSelectedCgisaiId = targetSelectedCgisaiId.concat(childrenValueArr);
                }
            });
            var selectedCells = {
                targetSelectedBscrncId: targetSelectedBscrncId.toString(),
                targetSelectedCgisaiId: targetSelectedCgisaiId.toString()
            };
            result.areaListForTarget = selectedCells;
            result.areaListObj = NEED_AREA_PAIR;
        } else {
            return result;
        }
        return result;
    };

    /**
     * 设置值，只有回填(切换模板)才会调用该方法
     */
    Business.area.prototype.setValue = function(obj) {

        if ($.isNull(obj) || $.isNull(obj.areaType)) {
            return;
        }

        var me = this;
        var areaType = obj.areaType;

        // 为true表示不需要置空双向列表右侧
        me._afterSetListWinRightData = null;
        var oldAreaType = me._combobox.getValue().value;

        // 模板中的区域类型与当前一致，不会发生change事件
        if (oldAreaType !== areaType.value) {
            me._afterSetListWinRightData = obj;
            me._combobox.setValue(areaType);
        } else {
            me._setListWindowValue(obj);
        }
    };

    /**
     * @private
     * 初始化组件，生成combobox
     */
    Business.area.prototype._init = function() {

        var me = this;
        var config = me.config;
        me.cellLoader = {
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            url: config.url,
            baseParams: {
                loadMask: true,
                areaType: ""
            }
        };
        me.items = [];

        //区域下拉框
        var labelWidth = parseInt(config.lableWidth);
        var comboWidth = parseInt(config.comboWidth);


        me._combobox = new Sweet.form.ComboBox_v1({
            tip: true,
            name: "areaCombobox",
            editable: false,
            width: labelWidth + comboWidth,
            label: true,
            labelText: config.labelText,
            labelWidth: labelWidth
        });
        me._combobox.addListener("click", function(val) {
            // 点击已经选中的项，不发生change，则返回
            if (me._oldClickComboValue && me._oldClickComboValue === val.value) {
                return;
            }
            // 点击发生了change
            me._oldClickComboValue = val.value;
            if (me._afterSetListWinRightData) {
                me._afterSetListWinRightData = null;
            }

        });
        me._combobox.addListener("change", function(event, val) {
            config.changeFunc(val);
            me._cleanAllListWindow();
            var cmpType = val.data && val.data.cmpType ? val.data.cmpType : "";
            me._showWhichSelector(cmpType);
            me._requestCmpTypeData(val.value);
            me._setListWindowValue(me._afterSetListWinRightData);
        });
        me.items.push(me._combobox);

        me._creatSelector();

        // window
        me._creatWindow();

        me._requestData("", function(data) {
            me._combobox.setData(data);
        }, config.areaTypeUrl);
    };

    /**
     * 创建selector和IMSI文本框
     * @private
     * @param {String} 组件类型
     */
    Business.area.prototype._creatSelector = function(cmpType) {
        var me = this;
        var config = me.config;

        // 选择文本框
        me._selector = new Sweet.form.Selector({
            name: "areaSelector",
            emptyText: BusinessI18N.cmp.area.pleaseSelect,
            width: 150
        });

        me._selector.addListener("buttonClick", function(event, val) {
            me._openWindow();
        });

        me.items.push(me._selector);

        // 数值文本框
        me._imsiField = new Sweet.form.TextField({
            width: 150,
            label: false,
            maxLength: config.imsiFieldLength,
            visible: false,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            validateFun: {
                eventName: "blur",
                params: {},
                fun: function(event, val) {
                    if (val.text && !(config.imsiFieldAllowedCharts.test(val.text))) {
                        return {
                            "success": false,
                            "message": BusinessI18N.cmp.area.onlyChartNum
                        };
                    }
                    return {
                        "success": true,
                        "message": ""
                    };
                }
            }
        });
        me.items.push(me._imsiField);
    };

    /**
     * 创建弹出窗口
     * @private
     */
    Business.area.prototype._creatWindow = function() {
        var me = this;
        var config = me.config;

        // listWindow,MSC-POOL,MSC,BSC,RNC,BSC/RNC
        if (!me._listWindow) {
            me._creatListWindow();
        }
        // treeWindow,SAI,CGI,CGI/SAI
        if (!me._treeWindow) {
            me._creatTreeWindow();
        }
        // 局向
        if (!me._officeDirection) {
            me._creatOfficeDirectionWindow();
        }
        // RNC-BSC
        if (!me._sdListWindow) {
            me._creatSdListWindow();
        }
        // CGI-SAI
        if (!me._sdTreeWindow) {
            me._creatSdTreeWindow();
        }

        me._windowPanel = new Sweet.panel.VPanel({
            height: windowSize["listWindow"][1] - windowSize["_tempHeight"],
            width: "100%",
            header: false,
            padding: 0,
            items: [me._listWindow, me._treeWindow, me._officeDirection, me._sdListWindow, me._sdTreeWindow]
        });

        // 弹出窗口
        me._window = new Sweet.Window({
            width: windowSize["listWindow"][0],
            height: windowSize["listWindow"][1],
            padding: [3, 5, 5, 5],
            content: me._windowPanel,
            listeners: {
                "ok": function() {
                    me._setSelectorValue();
                },
                "cancel": function() {
                    $.log("Cancel button clicked");
                }
            }
        });
    };

    /**
     * 创建listwindow
     * @private
     */
    Business.area.prototype._creatListWindow = function() {
        var me = this;
        var config = me.config;

        me._listWindow = new Sweet.cmp.TreeWindow({
            name: "areaListWin",
            widgetClass: "business-cmp-listwindw-area",
            width: windowSize["listWindow"][0] - windowSize["_paddingWidth"],
            height: windowSize["listWindow"][1] - windowSize["_tempHeight"],
            useArrows: false,
            icon: false,
            tip: true,
            fromTitle: BusinessI18N.cmp.area.listWindowLeftTitle,
            toTitle: BusinessI18N.cmp.area.listWindowRightTitle,
            visible: false
        });
    };

    /**
     * 创建treeWindow
     * @private
     */
    Business.area.prototype._creatTreeWindow = function() {
        var me = this;
        var config = me.config;

        var me = this;
        var config = me.config;
        var visible = false;
        var treewindowHeight;
        // DTS2014062302122 start
        var loader = $.objClone(me.cellLoader);
        if (!me._isTopN) {
            visible = true;
            treewindowHeight = windowSize["listWindow"][1] - windowSize["_tempHeight"];
        } else {
            treewindowHeight = windowSize["listWindow"][1] - windowSize["_tempHeight"] - 30;
        }
        me._cellListWin = new Sweet.cmp.TreeWindow({
            width: windowSize["listWindow"][0] - windowSize["_paddingWidth"],
            height: treewindowHeight,
            useArrows: false,
            icon: false,
            tip: true,
            loader: loader,
            visible: visible,
            fromTitle: BusinessI18N.cmp.area.listWindowLeftTitle,
            toTitle: BusinessI18N.cmp.area.listWindowRightTitle
        });

        // 最多选300个小区
        me._cellListWin.addListener("beforemoveright", me._registEvent("beforemoveright", 300));

        //请求前参数的适配
        me._cellListWin.addListener("beforeload", me._registEvent("beforeload", "", "CGISAI"));
        //请求后的数据适配
        me._cellListWin.addListener("load", me._registEvent("load"));
        // DTS2014062302122 end

        //如果没有配置topN,那么只显示小区双项列表选择框
        if (!me._isTopN) {
            me._treeWindow = new Sweet.panel.VPanel({
                height: windowSize["treeWindow"][1] - windowSize["_tempHeight"],
                width: "100%",
                header: false,
                items: [me._cellListWin],
                visible: true
            });
            return;
        }

        me._cellRadioBtn = new Sweet.form.RadioGroup({
            width: parseInt(windowSize["treeWindow"][0] * 0.7, 10),
            height: 25,
            data: [{
                text: BusinessI18N.cmp.area.selectTopN,
                value: radioValue.topN,
                checked: true
            }, {
                text: BusinessI18N.cmp.area.selectCell,
                value: radioValue.list,
                checked: false
            }]
        });

        me._cellRadioBtn.addListener("change", function(event, val) {
            if (radioValue.topN === val.value) {
                me._cellListWin.hide();
                me._cellComboBox.show();
            } else if (radioValue.list === val.value) {
                me._cellListWin.show();
                me._cellListWin.doLayout(true);
                me._cellComboBox.hide();
            } else {
                return;
            }
        });
        var topNDataArr = [];
        var tempTopNDatas;

        me._cellComboBox = new Sweet.form.ComboBox_v1({
            tip: true,
            editable: false,
            width: 300,
            label: true,
            labelText: "Top N",
            labelWidth: 50,
            blank: false
        });

        topNData.forEach(function(top, index, arr) {
            topNDataArr.push({
                text: ("" + top),
                value: "" + top
            });
        });
        me._cellComboBox.setData(topNDataArr);

        me._treeWindow = new Sweet.panel.VPanel({
            height: windowSize["treeWindow"][1],
            width: "100%",
            header: false,
            items: [me._cellRadioBtn, me._cellListWin, me._cellComboBox],
            visible: false
        });
    };

    /**
     * 创建officeDirection
     * @private
     */
    Business.area.prototype._creatOfficeDirectionWindow = function() {
        var me = this;
        var config = me.config;

        me._officeDirection = new Sweet.cmp.OfficeDirection({
            width: windowSize["officeDirection"][0] - 22,
            height: windowSize["officeDirection"][1] - 95,
            splitMark: splitMark,
            visible: false,
            source: me._getOfficeComboData()
        });
    };

    /**
     * 创建sdListWin
     * @private
     */
    Business.area.prototype._creatSdListWindow = function() {
        var me = this;
        var config = me.config;

        var _treeHeight = (windowSize["sdListWindow"][1] - windowSize["_tempSDHeight"]) / 2;
        me._sdListWinSTreeWindow = new Sweet.cmp.TreeWindow({
            height: _treeHeight,
            widgetClass: "business-cmp-listwindw-area",
            useArrows: false,
            icon: false,
            tip: true,
            data: [],
            fromTitle: BusinessI18N.cmp.area.source,
            toTitle: ''
        });

        me._sdListWinDTreeWindow = new Sweet.cmp.TreeWindow({
            height: _treeHeight,
            widgetClass: "business-cmp-listwindw-area",
            useArrows: false,
            icon: false,
            tip: true,
            data: [],
            fromTitle: BusinessI18N.cmp.area.destination,
            toTitle: ''
        });
        // // 最多选100个小区
        me._sdListWinSTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));
        // // 最多选100个小区
        me._sdListWinDTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));

        me._sdListWindow = new Sweet.panel.VPanel({
            padding: 20,
            visible: false,
            items: [me._sdListWinSTreeWindow, me._sdListWinDTreeWindow]
        });
    };
    /**
     * 创建sdTreeWin
     * @private
     */
    Business.area.prototype._creatSdTreeWindow = function() {
        var me = this;
        var config = me.config;
        var _treeHeight = (windowSize["sdTreeWindow"][1] - windowSize["_tempSDHeight"]) / 2;

        var sLoader = $.objClone(me.cellLoader);
        sLoader["baseParams"]["areaType"] = "SAI";
        var dLoader = $.objClone(me.cellLoader);
        dLoader["baseParams"]["areaType"] = "CGI";

        me._sdTreeWinSTreeWindow = new Sweet.cmp.TreeWindow({
            height: _treeHeight,
            widgetClass: "business-cmp-listwindw-area",
            useArrows: false,
            icon: false,
            tip: true,
            loader: sLoader,
            fromTitle: BusinessI18N.cmp.area.source,
            toTitle: ''
        });

        me._sdTreeWinDTreeWindow = new Sweet.cmp.TreeWindow({
            height: _treeHeight,
            widgetClass: "business-cmp-listwindw-area",
            useArrows: false,
            icon: false,
            tip: true,
            loader: dLoader,
            fromTitle: BusinessI18N.cmp.area.destination,
            toTitle: ''
        });
        // 最多选100个小区
        me._sdTreeWinSTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));
        //请求前参数的适配
        me._sdTreeWinSTreeWindow.addListener("beforeload", me._registEvent("beforeload", "", "SAI"));
        //请求后的数据适配
        me._sdTreeWinSTreeWindow.addListener("load", me._registEvent("load", "", "SAI"));

        // 最多选100个小区
        me._sdTreeWinDTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));

        //请求前参数的适配
        me._sdTreeWinDTreeWindow.addListener("beforeload", me._registEvent("beforeload", "", "CGI"));
        //请求后的数据适配
        me._sdTreeWinDTreeWindow.addListener("load", me._registEvent("load", "", "CGI"));

        me._sdTreeWindow = new Sweet.panel.VPanel({
            padding: 20,
            visible: false,
            items: [me._sdTreeWinSTreeWindow, me._sdTreeWinDTreeWindow]
        });
    };

    /**
     * 显示selector或IMSI文本框
     * @private
     * @param {String} cmpType 组件类型
     */
    Business.area.prototype._showWhichSelector = function(cmpType) {
        var me = this;
        var config = me.config;

        // 隐藏所有的选择组件
        if (me._imsiField && me._imsiField.rendered) {
            me._imsiField.hide();
        }
        if (me._selector && me._selector.rendered) {
            me._selector.hide();
        }

        // IMSI、MSISDN
        if (CMPTYPE.imsiField === cmpType) {
            if (me._imsiField.rendered) {
                me._imsiField.show();
                if (!me._afterSetListWinRightData) {
                    me._imsiField.setValue({
                        text: "",
                        value: ""
                    });
                    return;
                }
                me._imsiField.setValue(me._afterSetListWinRightData.areaList);
                me._afterSetListWinRightData = null;
            }
        }
        // window 
        else {
            if (me._selector.rendered) {
                var selectorVal = {};
                // 反填
                if (me._afterSetListWinRightData) {
                    selectorVal = me._afterSetListWinRightData.selector;
                }
                // 置空
                else {
                    if (CMPTYPE.listWindow === cmpType) {
                        selectorVal = {
                            text: ALL,
                            value: ALL
                        };
                    } else if (CMPTYPE.treeWindow === cmpType) {
                        selectorVal = {
                            text: "",
                            value: ""
                        };
                    } else if (CMPTYPE.officeDirection === cmpType) {
                        selectorVal = {
                            text: ALL,
                            value: ALL
                        };
                    } else if (CMPTYPE.sdListWindow === cmpType) {
                        selectorVal = {
                            text: "",
                            value: ""
                        };
                    } else if (CMPTYPE.sdTreeWindow === cmpType) {
                        selectorVal = {
                            text: "",
                            value: ""
                        };
                    }
                }
                me._selector.setValue(selectorVal);
                me._selector.show();
            } else {
                // DTS2014081306356 begin
                if (CMPTYPE.listWindow === cmpType) {
                    selectorVal = {
                        text: ALL,
                        value: ALL
                    };
                }
                if (me._selector) {
                    me._selector.setValue(selectorVal);
                }
                // DTS2014081306356 end
            }
        }
    };

    /**
     * 按钮的点击事件：打开弹出框
     * @private
     */
    Business.area.prototype._openWindow = function() {
        var me = this;
        var config = me.config;
        var val = me._combobox.getValue();
        var cmpType = val.data.cmpType;
        me._windowPanel.setWidth(windowSize[cmpType][0] - windowSize["_paddingWidth"]);
        me._windowPanel.setHeight(windowSize[cmpType][1]);
        me._window.setWidth(windowSize[cmpType][0]);
        me._window.setHeight(windowSize[cmpType][1]);

        me._hideAllWindowItems();
        eval("me._" + cmpType + ".show()");
        me._window.setTitle(val.text);
        me._window.show();
    };

    /**
     * 隐藏window中所有组件
     * @private
     */
    Business.area.prototype._hideAllWindowItems = function() {
        var me = this;
        var config = me.config;

        me._listWindow.hide();
        me._treeWindow.hide();
        me._officeDirection.hide();
        me._sdListWindow.hide();
        me._sdTreeWindow.hide();
    };

    /**
     * 请求各个组件数据
     * @private
     */
    Business.area.prototype._requestCmpTypeData = function(data) {
        var me = this;
        var config = me.config;
        var val = me._combobox.getValue();
        var cmpType = val.data.cmpType;

        if (me._nowAreaType === val.value) {
            return;
        }
        me._nowAreaType = val.value;

        if (CMPTYPE.listWindow === cmpType) {
            me._requestData(val.value, function(data) {
                me._listWindow.setData(data[0][val.value]);
                me._areaListData = data[0][val.value];
            });
        } else if (CMPTYPE.treeWindow === cmpType) {
            var _tempLoader = $.objClone(me.cellLoader);
            _tempLoader["baseParams"]["areaType"] = val.value;
            me._cellListWin.setLoader(_tempLoader);
            me._cellListWin.load();
        } else if (CMPTYPE.officeDirection === cmpType) {
            me._requestData(me._getOfficeRequestParams(), function(data) {
                var obj = {};

                data.forEach(function(area, index, arr) {
                    var keyArr = Object.keys(area);
                    if (1 !== keyArr.length) {
                        return;
                    }
                    var key = keyArr[0];
                    obj[key] = area[key];
                });
                me._officeDirection.setData(obj);
            });
        } else if (CMPTYPE.sdListWindow === cmpType) {
            var source = val.value.split("_")[0];
            var destination = val.value.split("_")[1];
            // 请求多个数据，参数为MSC-RNC-BSC
            me._requestData(source + "-" + destination, function(data) {
                me._sdListWinSTreeWindow.setData(data[0][source]);
                me._sdListWinDTreeWindow.setData(data[0][destination]);
            });
        } else if (CMPTYPE.sdTreeWindow === cmpType) {
            var sLoader = $.objClone(me.cellLoader);
            var dLoader = $.objClone(me.cellLoader);
            sLoader["baseParams"]["areaType"] = me._nowAreaType.split("_")[0];
            dLoader["baseParams"]["areaType"] = me._nowAreaType.split("_")[1];
            me._sdTreeWinSTreeWindow.setLoader(sLoader);
            me._sdTreeWinDTreeWindow.setLoader(dLoader);
            me._sdTreeWinSTreeWindow.load();
            me._sdTreeWinDTreeWindow.load();
        } else {
            return;
        }
    };

    /**
     * 统一的注册事件
     * @private
     */
    Business.area.prototype._registEvent = function(eventName, maxNum, dataKey) {
        var me = this;
        var _tempObj = {};
        _tempObj["beforemoveright"] = function(treeData, treeCmp) {
            var result = true;
            // 多个BSC下的所选小区大于300，则返回false
            var totalCells = Business.functions.getLeafNodeObj(Business.functions.oneObjToArray(treeData));
            if (1 < treeData.length && maxNum < totalCells.length) {
                result = false;
            }
            if (!result) {
                var msg = Sweet.core.i18n.list.maxRemains;
                Sweet.Msg.warn(msg.replace("{0}", maxNum));
                return false;
            }
            return true;
        };
        _tempObj["beforeload"] = function(loader, tree) {
            if (!loader.tParams) {
                return;
            }
            var baseParams = loader["baseParams"];
            if (loader.tParams.filter) {
                baseParams["filter"] = loader.tParams.filter;
            } else {
                if (loader.tParams.node) {
                    baseParams["bscrnc_id"] = loader.tParams.node["value"];
                }
            }
            loader.baseParams = baseParams;
        };
        _tempObj["load"] = function(loader, tree) {
            var adapterDatas = function(datas) {
                var tempArray = [];
                if (!datas) {
                    return tempArray;
                }
                var tempObj = {};
                for (var i = 0; i < datas.length; i++) {
                    var cn = {
                        value: datas[i]["value"],
                        text: datas[i]["text"],
                        leaf: true
                    };
                    var p = tempObj[datas[i]["parentvalue"]];
                    if (p) {
                        p.children.push(cn);
                    } else {
                        tempObj[datas[i]["parentvalue"]] = {
                            value: datas[i]["parentvalue"],
                            text: datas[i]["parenttext"],
                            expanded: true,
                            loaded: true,
                            children: [cn]
                        };
                    }
                }
                for (var key in tempObj) {
                    tempArray.push(tempObj[key]);
                }
                return tempArray;
            };
            dataKey = loader["baseParams"]["areaType"];
            if (loader && loader.tParams && loader.tParams["filter"] && !loader.tParams["node"]) {
                if (dataKey) {
                    if (loader["datas"] && loader["datas"].length > 0) {
                        loader["datas"] = adapterDatas(loader["datas"][0][dataKey]);
                    } else {
                        loader["datas"] = [];
                    }
                } else {
                    loader["datas"] = adapterDatas(loader["datas"]);
                }
                return loader["datas"];
            }
            if (dataKey) {
                if (loader["datas"] && loader["datas"].length > 0) {
                    loader["datas"] = loader["datas"][0][dataKey];
                } else {
                    loader["datas"] = [];
                }
            }

            return loader["datas"];
        };
        return _tempObj[eventName];
    };

    /**
     * 请求数据
     * @private
     * @param {String} params 请求所需的参数
     * @param {Function} callFunc 回调函数
     * @param {String} url url
     * @param {Boolean} async 是否为异步请求
     */
    Business.area.prototype._requestData = function(params, callFunc, url, async) {
        var me = this;
        var config = me.config;

        // 请求后台，获取双向列表数据
        Sweet.Ajax.request({
            url: url || config.url,
            loadMask: true,
            async: async || false,
            data: {
                areaType: params
            },
            timeout: 300000,
            success: function(result) {
                callFunc(result);
            },
            error: function() {
                $.error("Business.area() request listWindow's data error!");
            }
        });
    };

    /**
     * 回填window中各个组件
     * @private
     * @param {Array} obj 区域下拉框当前选中的值
     */
    Business.area.prototype._setListWindowValue = function(obj) {
        if (!obj) {
            return;
        }
        var me = this;
        var areaType = obj.areaType;
        var areaList = obj.areaList;
        var cmpType = areaType.data && areaType.data.cmpType ? areaType.data.cmpType : null;

        if (CMPTYPE.imsiField === cmpType) {
            me._imsiField.setValue(areaList);
            me._afterSetListWinRightData = null;
            return;
        }

        if (CMPTYPE.listWindow === cmpType) {
            me._listWindow.setValue(areaList);
        } else if (CMPTYPE.treeWindow === cmpType) {
            var isTopN = obj.isTopN;
            var topN = obj.topN;
            if (!me._isTopN) {
                me._cellListWin.setValue(areaList);
            } else {
                me._cellRadioBtn.setValue(isTopN);
                if (radioValue.topN === isTopN.value) {
                    me._cellComboBox.setValue(topN);
                } else {
                    me._cellListWin.setValue(areaList);
                }
            }
        } else if (CMPTYPE.officeDirection === cmpType) {
            me._officeDirection.setValue(areaList);
        } else if (CMPTYPE.sdListWindow === cmpType) {
            me._sdListWinSTreeWindow.setValue(obj.orgAreaList);
            me._sdListWinDTreeWindow.setValue(obj.targetAreaList);
        } else if (CMPTYPE.sdTreeWindow === cmpType) {
            me._sdTreeWinSTreeWindow.setValue(obj.orgAreaList);
            me._sdTreeWinDTreeWindow.setValue(obj.targetAreaList);
        }
        //中英文模板显示全部
        if (obj.selector.value && (obj.selector.value == "全选" || obj.selector.value == "All")) {
            me._selector.setValue({
                text: ALL,
                value: ALL
            });
        } else {
            me._selector.setValue(obj.selector);
        }
        me._afterSetListWinRightData = null;
    };

    /**
     * 设置selector中的值
     * @private
     */
    Business.area.prototype._setSelectorValue = function() {
        var me = this;
        var value = me._combobox.getValue();
        var cmpType = value.data.cmpType;
        var allText = {
            text: ALL,
            value: ALL
        };
        var val = "";

        if (CMPTYPE.listWindow === cmpType) {
            val = $.objClone(me._listWindow.getValue());
            if (me._areaListData && me._areaListData.length > 0 && val.length >= me._areaListData.length) {
                val = "";
            } else {
                val = Business.functions.getLeafArray(val).text;
            }
        } else if (CMPTYPE.treeWindow === cmpType) {
            if (me._isTopN && radioValue.topN === me._cellRadioBtn.getValue().value) {
                val = $.objClone(me._cellComboBox.getValue());
                val.text = "Top " + val.text;
            } else {
                val = $.objClone(me._cellListWin.getValue());
            }
            val = Business.functions.getLeafArray(val).text;
            allText = {
                text: "",
                value: ""
            };
        } else if (CMPTYPE.officeDirection === cmpType) {
            val = $.objClone(me._officeDirection.getValue());
            val = Business.functions.getLeafArray(val).text;
        } else if (CMPTYPE.sdListWindow === cmpType) {
            val = $.objClone(me._sdListWinSTreeWindow.getValue());
            val = Business.functions.getLeafArray(val);
            var val2 = $.objClone(me._sdListWinDTreeWindow.getValue());
            val2 = Business.functions.getLeafArray(val2);
            if (val.text && val2.text) {
                val = val.text + "," + val2.text;
            } else if (val.text && !val2.text) {
                val = val.text;
            } else if (!val.text && val2.text) {
                val = va2.text;
            } else {
                val = "";
            }
            allText = {
                text: "",
                value: ""
            };
        } else if (CMPTYPE.sdTreeWindow === cmpType) {
            val = $.objClone(me._sdTreeWinSTreeWindow.getValue());
            val = Business.functions.getLeafArray(val);
            var val2 = $.objClone(me._sdTreeWinDTreeWindow.getValue());
            val2 = Business.functions.getLeafArray(val2);
            if (val.text && val2.text) {
                val = val.text + "," + val2.text;
            } else if (val.text && !val2.text) {
                val = val.text;
            } else if (!val.text && val2.text) {
                val = va2.text;
            } else {
                val = "";
            }
            allText = {
                text: "",
                value: ""
            };
        } else {
            return;
        }

        if (val) {
            val = {
                text: val,
                value: val
            };
        } else {
            val = allText;
        }
        me._selector.setValue(val || allText);
    };

    /**
     * 构造局向下拉框的数据
     * @private
     * @returns {String} 局向下拉框的数据 
     */
    Business.area.prototype._getOfficeComboData = function() {
        var me = this;
        var config = me.config;
        var officComboData = config.officeDirection;

        var arr = [];
        officComboData.forEach(function(valueItem, valueIndex, valueArr) {
            var obj = {};
            obj.value = valueItem.opt;
            obj.text = AREA_TYPE[valueItem.opt];
            obj.data = [];
            valueItem.dpt.forEach(function(str, strIndex, strArr) {
                obj.data.push({
                    value: str,
                    text: AREA_TYPE[str]
                });
            });

            arr.push(obj);
        });

        return arr;
    };

    /**
     * 取源MSC和目的MSC的并集
     * @private
     * @returns {String} 字符串如"MSC-BSC-RNC" 
     */
    Business.area.prototype._getOfficeRequestParams = function() {
        var me = this;
        var config = me.config;
        var officComboData = config.officeDirection;

        var obj = {};
        var result = "";

        officComboData.forEach(function(item, index, arr) {

            obj[item.opt] = item.opt;

            item.dpt.forEach(function(dest, destIndex, destArr) {
                obj[dest] = dest;
            });

        });

        var areaStr = Object.keys(obj).toString();
        var areaArr = areaStr.split(",");
        if (1 === areaArr.length) {
            result = areaArr[0] + "-" + areaArr[0];
        } else {
            result = areaArr.join("-");
        }
        return result;
    };

    /**
     * 局向为all时，构造局向的"源-目的"格式的数据
     * @private
     * @param {String} source 局向的源如MSC
     * @param {String} destination 局向的目的如MSC
     * @returns {Array} 局向"源-目的"的对象数组
     */
    Business.area.prototype._getAllOfficeList = function(source, destination) {
        var me = this;

        var result = [];
        var sourceList = me._officeDirection.getOData();
        var destinationList = me._officeDirection.getDData();

        sourceList.forEach(function(s, indexS, arrS) {
            destinationList.forEach(function(d, indexD, arrD) {
                if (s.value !== d.value) {
                    var value = s.value + splitMark + d.value;
                    var text = s.text + "-" + d.text;
                    result.push({
                        text: text,
                        value: value
                    });
                };
            });
        });

        return result.length > 0 ? result : [];
    };

    /**
     * 清除所以组件的值
     * @private
     */
    Business.area.prototype._cleanAllListWindow = function() {
        var me = this;
        var config = me.config;

        me._imsiField.setValue({
            value: "",
            text: ""
        });
        me._listWindow.setValue([]);
        if (me._isTopN) {
            me._cellRadioBtn.setValue({
                value: radioValue.topN
            });
            me._cellComboBox.setValue({
                text: topNData[0] + "",
                value: topNData[0] + ""
            });
        }
        me._cellListWin.setValue([]);
        me._officeDirection.clearData();
        me._sdListWinSTreeWindow.setValue([]);
        me._sdListWinDTreeWindow.setValue([]);
        me._sdTreeWinSTreeWindow.setValue([]);
        me._sdTreeWinDTreeWindow.setValue([]);
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--区域，包括：区域下拉框、按钮、window和双向列表
 * 2014-4-10
 * </pre>
 * @version 1.0
 */


(function() {

    var INDICATOR = BusinessI18N.cmp.more.indicator;

    Business.more = function(params) {
        //初始参数设置
        this.config = {
            winWidth: 600, // 默认、外部more都可按需配置
            winHeight: 500, // 默认、外部more都可按需配置
            // 按钮上的text、tabPanel的title
            buttonText: BusinessI18N.cmp.more.windowTitle, // 默认、外部more都可按需配置
            // 默认more的请求
            url: Business.url.moreData, // 默认more按需配置
            // 外部组件时需要设置的属性(defaultType为false时)
            defaultType: true, // 外部more必须配置
            outerCmpName: "", // 外部more必须配置
            // 点击more按钮的回调函数
            clickMoreFunc: function() {
                return null;
            }, // 外部more按需配置
            // 获取请求参数
            getParamsFunc: function() {
                return null;
            } // 框架内部使用，不用配置
        };

        this.config = $.extend(this.config, params);

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 区域下拉框chagne时的回调
     */
    Business.more.prototype.areaChangeFunc = function(val) {
        var me = this;
        var config = me.config;

        if (config.defaultType) {
            return me._areaChangeFunc(val);
        } else {
            return me._outerMore.areaChangeFunc(val);
        }
    };

    /**
     * @description 返回多tab页参数
     * @returns {Object} result 容器
     */
    Business.more.prototype.getTabInfo = function() {
        var me = this;
        var config = me.config;

        if (config.defaultType) {
            return me._getTabInfo();
        } else {
            return me._outerMore.getTabInfo();
        }
    };

    /**
     * @description 返回各个组件
     * @returns {Object} result 容器
     */
    Business.more.prototype.getItems = function() {
        return this.items;
    };

    /**
     * 获取各个组件的原始value
     * @return {Object} {areaType: ,areaList: ,isTopN: ,topN}
     * @returns {Object} result 返回各个组件的原始value
     */
    Business.more.prototype.getOriginalValue = function() {
        var me = this;
        var config = me.config;

        var result = {};
        if (config.defaultType) {
            result = me._indicatorTree.getValue();
        } else {
            result = me._outerMore.getOriginalValue();
        }

        return result;
    };

    /**
     * 获取值
     * @returns {Object} result 返回给后台用于查询的value
     */
    Business.more.prototype.getValue = function() {
        var me = this;
        var config = me.config;

        var result = {};
        if (config.defaultType) {
            // 多tab页不一样的参数统一放在数组diffTabInfoArr中，page中将其分配到每个tab页中
            var diffTabInfoArr = [];
            var indicator = me._indicatorTree.getValue();

            indicator = Business.functions.getLeafNodeObj(indicator);
            for (var i = 0; i < indicator.length; i++) {
                diffTabInfoArr.push({
                    indicator: indicator[i].value,
                    indicatorName: indicator[i].text,
                    indicatorNameEn: indicator[i].data
                });
            }
            result.diffTabInfoArr = diffTabInfoArr;
        } else {
            result = me._outerMore.getValue();
        }

        return result;
    };

    /**
     * 设置值，只有回填(切换模板)才会调用该方法
     */
    Business.more.prototype.setValue = function(obj) {

        var me = this;
        var config = me.config;

        if (config.defaultType) {
            if (obj.length > 0) {
                var treeData = me._getIndicatorTreeData(config);
                obj = me._resetTreenew(obj, treeData);
            }
            me._indicatorTree.setValue(obj);
            me.indicatortemplate = {};
            me.indicatortemplate[config.getParamsFunc().areaType] = obj;
        } else {
            if (!config.defaultType && config.outerCmpName) {
                if (!$.isNull(obj)) {
                    me._outerMore._requestData(me.config.getParamsFunc().areaType, true);
                    var kpidata = me._outerMore.resKpidata;
                    me._outerMore.resetKpidata(kpidata, obj);
                }
                me._outerMore.setValue(obj);
            } else {
                me._outerMore.setValue(obj);
            }
        }
    };

    /**
     * @private
     * 初始化组件 
     */
    Business.more.prototype._init = function() {

        var me = this;
        var config = me.config;
        var winTitle = config.buttonText;

        me.isLoad = {};
        me.items = [];
        if ("false" === config.defaultType || false === config.defaultType) {
            config.defaultType = false;
        } else {
            config.defaultType = true;
        }

        if (config.defaultType) {
            me._initDefault();
            config.defaultType = true;
        } else if (!config.defaultType && config.outerCmpName) {
            var outerCmpFunc = eval(config.outerCmpName);
            if ("function" === typeof(outerCmpFunc)) {
                me._outerMore = new outerCmpFunc(me);
                me._morePanel = me._outerMore.getPanel();
                config = $.extend(config, me._outerMore.getConfig());
            } else {
                return;
            }

        } else {
            return;
        }

        //more window窗口
        me._moreWin = new Sweet.Window({
            width: config.winWidth,
            height: config.winHeight,
            header: config.header,
            widgetClass: " moreWindow",
            title: winTitle,
            content: me._morePanel,
            buttons: config.buttons || null,
            listeners: {
                "ok": function() {
                    if (config.defaultType) {
                        //
                    } else {
                        me._outerMore.clickOkBtn();
                    }
                },
                "cancel": function(event) {
                    if (config.defaultType) {
                        //
                    } else {
                        me._outerMore.clickCancelBtn(event);
                    }
                }
            }
        });

        //more按钮
        me._moreButton = new Sweet.form.Button({
            width: 85,
            widgetClass: "fontBolder",
            value: {
                value: "more",
                text: winTitle
            },
            click: function() {
                if (config.defaultType) {
                    me._requestDefaultData(config.getParamsFunc());
                } else {
                    config.clickMoreFunc(config.getParamsFunc());
                }
                me._moreWin.show();
                if (me._indicatorTree) {
                    me._indicatorTree.doLayout(true);
                }
            }
        });

        me.items.push(me._moreButton);
    };

    /**
     * @private
     * 初始化组件默认组件
     */
    Business.more.prototype._initDefault = function() {

        var me = this;
        var config = me.config;

        me.isLoad = {};
        me.items = [];

        //指标树
        me._indicatorTree = new Sweet.cmp.TreeWindow({
            width: config.winWidth - 22,
            height: config.winWidth - 205,
            title: INDICATOR,
            widgetClass: "indicatorTree",
            tip: true,
            useArrows: false,
            valueKeys: ["value", "text", "data"],
            icon: false,
            fromTitle: BusinessI18N.cmp.area.listWindowLeftTitle,
            toTitle: BusinessI18N.cmp.area.listWindowRightTitle
        });

        //more窗口左侧tabPanel
        me._morePanel = new Sweet.panel.TabPanel({
            width: "100%",
            height: "100%",
            padding: [0, 5, 0, 5],
            items: [me._indicatorTree],
            style: 2
        });
    };

    /**
     * 按钮的点击事件：打开弹出框
     * @private
     * @param {String} requestParams 请求所需的参数
     */
    Business.more.prototype._requestDefaultData = function(requestParams) {
        var me = this;
        var config = me.config;

        if (me.areaType && me.areaType === requestParams.areaType) {
            return;
        }
        me.areaType = requestParams.areaType;

        // 请求后台，获取双向列表数据
        Sweet.Ajax.request({
            url: config.url,
            loadMask: true,
            async: false,
            data: requestParams,
            timeout: 300000,
            success: function(result) {

                me._indicatorTree.setData(result);

                if (me.indicatortemplate && me.indicatortemplate[me.areaType]) {
                    me._indicatorTree.setValue(me.indicatortemplate[me.areaType]);
                } else {}
                me.indicatortemplate = null;

            },
            error: function() {
                me.indicatortemplate = null;
                $.error("Business.more() request listWindow's data error!");
            }
        });
    };

    /**
     * @description 返回各个组件
     * @returns {Object} result 容器
     */
    Business.more.prototype._getTabInfo = function() {
        var me = this;
        var config = me.config;
        var result = [];

        var valObj = me.getOriginalValue();
        valObj.forEach(function(treeNode, index, arr) {
            var obj = {
                graphKey: "STARTTIME,AREA_NAME,AREA_ID",
                graphType: "line",
                text_zh: treeNode.text,
                text_en: treeNode.data,
                type: "list"
            };

            result.push(obj);
        });

        if (!result || 1 > result.length) {
            Sweet.Dialog.warn({
                width: 330,
                height: 130,
                message: BusinessI18N.cmp.more.selectKpi
            });
            return null;
        }

        return result;
    };

    /**
     * @description 区域下拉框change时的回调
     * @returns {Object} result 容器
     */
    Business.more.prototype._areaChangeFunc = function(val) {
        var me = this;
        if (me._indicatorTree) {
            me._indicatorTree.setValue(null);
        }
        return null;
    };

    /**
     * 获取KPI
     * @private
     * @param {String} requestParams 请求所需的参数
     */
    Business.more.prototype._getIndicatorTreeData = function(config) {
        var me = this;
        var treeData = [];
        // 请求后台，获取双向列表数据
        Sweet.Ajax.request({
            url: config.url,
            loadMask: true,
            async: false,
            data: config.getParamsFunc(),
            timeout: 300000,
            success: function(result) {
                treeData = result;
            },
            error: function() {
                me.indicatortemplate = null;
                $.error("Business.more() request listWindow's data error!");
            }
        });
        return treeData;
    };
    Business.more.prototype._resetTreenew = function(data, treeData) {
        var me = this;
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            for (var j = 0; j < treeData.length; j++) {
                var trees = treeData[j];
                if (node.value == trees.value) {
                    if (node.children) {
                        var treeChildren = trees.children;
                        var nodeChildren = node.children;
                        me._resetTreeNext(nodeChildren, treeChildren, trees);
                    }
                    res.push(trees);
                }
            }
        };
        return res;
    };
    Business.more.prototype._resetTreeNext = function(data, treeData, treeNode) {
        var me = this;
        var childrens = []
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            for (var j = 0; j < treeData.length; j++) {
                var trees = treeData[j];
                if (node.value == trees.value) {
                    if (node.children) {
                        me._resetTreeNext(node.children, trees.children, trees)
                    }
                    childrens.push(trees);
                }
            }
        };
        treeNode.children = childrens;
    };
})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--form查询头，包括：时间、区域、高级按钮和查询按钮
 * 2014-4-16
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2014, All rights reserved 
 * </pre>
 * @version 1.0
 */


(function() {

    /**
     * 定义form查询头
     * @param {Object} params 时间、区域和panel的配置
     * @returns {Object}
     */
    Business.queryCondition = function(params) {

        this.config = {
            // 下拉框宽度
            boxWidth: 195,
            // lable宽度
            boxLableWidth: 75
        };
        this.config = $.extend(this.config, params);
        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.queryCondition.prototype.getPanel = function() {

        return this._panel;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.queryCondition.prototype.getConditionManage = function() {

        return this._conditionManag;
    };

    /**
     * 获取值(点击查询按钮时提交所有查询数据)
     * @returns {Object}
     */
    Business.queryCondition.prototype.getValue = function() {
        var me = this;
        me._value = {};
        // 时间范围
        if ($.isNotNull(me._timeRange)) {
            var timeVal = me._timeRange.getValue();
            if (!timeVal) {
                return null;
            }
            me._value = $.extend(me._value, timeVal);
        }

        // 区域
        if ($.isNotNull(me._area)) {
            var areaVal = me._area.getValue();
            if (!areaVal) {
                return null;
            }
            me._value = $.extend(me._value, areaVal);
        }

        //下拉框
        if (me._box) {
            me._value = $.extend(me._value, {
                box: Business.functions.getLeafArray(me._box.getValue()).value
            });
        }

        if (me._more) {
            me._value = $.extend(me._value, me._more.getValue());
        }

        return me._value;
    };

    /**
     * 设置值
     * @param {Object} obj 选择的时间粒度对象
     * @returns {Object}
     */
    Business.queryCondition.prototype.setValue = function(obj) {
        if ($.isNull(obj)) {
            return;
        }
    };

    /**
     * @private
     * 初始化组件 
     */
    Business.queryCondition.prototype._init = function() {

        var me = this;
        var config = me.config;
        me.items = [];

        // 时间范围
        if ($.isNotNull(config.timeRange)) {
            me._timeRange = new Business.timeRange(config.timeRange);
            me.items = me.items.concat(me._timeRange.getItems());
        }

        // 区域
        if ($.isNotNull(config.area)) {
            // area与more的联动
            config.area.changeFunc = function(val) {
                if (me._more) {
                    me._more.areaChangeFunc(val);
                }
            };
            me._area = new Business.area(config.area);
            me.items = me.items.concat(me._area.getItems());
        }

        // 下拉框
        if ($.isNotNull(config.box)) {
            // 参数
            var boxConfig = {
                width: config.boxWidth,
                multi: false,
                tip: true,
                label: true,
                labelWidth: config.boxLableWidth
            };
            boxConfig = $.extend(boxConfig, config.box);
            boxConfig.multi = (boxConfig.multi === "true" ? true : false);

            // box
            me._box = new Sweet.form.ComboBox_v1(boxConfig);
            me.items = me.items.concat(me._box);

            // 请求数据
            Sweet.Ajax.request({
                url: boxConfig.url,
                contentType: "application/json;chartset=UTF-8",
                async: true,
                timeout: 300000,
                success: function(result) {
                    if ($.isNull(result)) {
                        $.error("Business.queryCondition() request combobox data fail");
                    }
                    me._box.setData(result);
                },
                error: function() {
                    $.error("Business.queryCondition() request combobox data fail");
                }
            });
        }

        // more
        if ($.isNotNull(config.more)) {

            me._more = new Business.more($.extend(config.more, {
                getParamsFunc: function() {
                    // 用area的getValue()会触发area的校验，故直接使用下拉框的getValue()
                    var areaType = (me._area && me._area._combobox.getValue().value) ? me._area._combobox.getValue().value : null;
                    var valObj = {
                        areaType: areaType
                    };
                    return valObj;
                }
            }));
            me.items = me.items.concat(me._more.getItems());
        }

        // 查询按钮
        me._queryBtn = new Sweet.form.Button({
            width: 105,
            highLight: true,
            widgetClass: "queryBtnClass fontBolder",
            value: {
                value: "query",
                text: BusinessI18N.cmp.queryCondition.query
            },
            click: function(e, data) {
                if (me._submitQueryData(e, data)) {
                    // 保存最后一次查询条件（组件已经优化，保存小区）
                    queryModel.lastQuery(me.config.moduleId, me._getRequestParams());
                }
            }
        });
        me.items = me.items.concat(me._queryBtn);

        // 查询条件保存
        me._conditionManag = new Business.conditionManage({
            moduleId: config.moduleId,
            getCondtionCallback: function() {
                return me._getRequestParams();
            },
            setCondtionCallback: function(params) {
                me._setQueryCondtions(params);
            }
        });
        me.items = me.items.concat(me._conditionManag.getItems());

        // panel
        me._panel = new Sweet.panel.FlowPanel({
            height: 35,
            portion: "north",
            widgetClass: "queryPanelLineClass",
            items: me.items,
            margin: [5, 0, 0, 0]
        });
    };

    /**
     * @description 把查询组件转换为请求参数对象
     * @returns {Object}
     */
    Business.queryCondition.prototype._getRequestParams = function() {

        var me = this;
        var config = me.config;
        var requestParamObj = {};

        // 时间范围
        if ($.isNotNull(config.timeRange)) {
            requestParamObj.timeRange = $.objClone(me._timeRange.getValue());
            if (!requestParamObj.timeRange) {
                return null;
            }
        }

        // 区域
        if ($.isNotNull(config.area)) {
            requestParamObj.area = $.objClone(me._area.getOriginalValue());
            if (!requestParamObj.area) {
                return null;
            }
        }

        // 下拉框
        if ($.isNotNull(config.box)) {
            requestParamObj.box = $.objClone(me._box.getValue());
            if (!requestParamObj.box) {
                return null;
            }
        }

        // more
        if ($.isNotNull(config.more)) {
            requestParamObj.more = $.objClone(me._more.getOriginalValue());
            if (!requestParamObj.more) {
                return null;
            }
        }

        return requestParamObj;
    };

    /**
     * @description 查询条件反填
     * @returns {Object}
     */
    Business.queryCondition.prototype._setQueryCondtions = function(requestParams) {
        var me = this;

        if ($.isNull(requestParams)) {
            return;
        }

        if (requestParams.timeRange && me._timeRange) {
            me._timeRange.setValue(requestParams.timeRange);
        }

        if (requestParams.area && me._area) {
            me._area.setValue(requestParams.area);
        }

        if (requestParams.box && me._box) {
            me._box.setValue(requestParams.box);
        }

        if (requestParams.more && me._more) {
            me._more.setValue(requestParams.more);
        }
    };

    /**
     * 提交数据
     * @private
     */
    Business.queryCondition.prototype._submitQueryData = function() {
        var me = this;
        var config = me.config;
        var value = me.getValue();
        if (!value) {
            //表示取数据没有成功
            return false;
        }
        if (config.validatorFunc && "function" == typeof(config.validatorFunc)) {
            var flag = config.validatorFunc(value, me);
            if ("false" === flag || false === flag) {
                return;
            }
        }
        config.queryFunc(value);
        return true;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.queryCondition.prototype.destroy = function() {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--查询条件保存
 * 2014-4-24
 * </pre>
 * @version 1.0
 */


(function() {

    Business.conditionManage = function(params) {

        //初始参数设置
        this.config = {
            moduleId: "",
            width: 250,
            height: 215,
            getCondtionCallback: null,
            setCondtionCallback: null
        };

        this.config = $.extend(this.config, params);

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 导入最后一次查询条件
     * @returns {Object}
     */
    Business.conditionManage.prototype.importLastQuery = function(modelId) {
        var me = this;
        var param = {
            businessType: "NPM",
            isLast: true,
            moduleId: modelId
        };
        //回调函数
        var callback = function(data) {
            if (data.length > 0) {
                var res = $.parseJSON(data[0].filter);
                if ($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)) {
                    return;
                }
                me.config.setCondtionCallback(res);
            }
        }
        Sweet.Ajax.request({
            url: basePath + "/templateManageController/getQueryTemplateList.action",
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(param),
            dataType: "json",
            async: false,
            timeout: 300000,
            success: function(data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            },
            error: function(XMLHttpRequest, status, errorThrown) {
                $.error(url);
                $.error("Get data error. XMLHttpRequest = " + XMLHttpRequest + ", error = " + errorThrown);
            }
        });
    };

    /**
     * @description 保存查询条件
     * @param templateName 模板名称
     * @param condition 条件
     * @returns {Object}
     */
    Business.conditionManage.prototype.saveTemplate = function(templateName, condition, isLastQuery) {
        var me = this;

        isLastQuery = $.isNull(isLastQuery) ? false : true;

        var regex = /^[\u0391-\uFFE5\w_-]*$/;
        // 用户输入的参数, 模板名称的长度不能大于80个字符
        if ((!isLastQuery) && ($.isNull(templateName) || !regex.test(templateName) || 0 === templateName.length)) {
            // 出现提示
            Sweet.Msg.error(BusinessI18N.cmp.conditionManage.noInput);
            return;
        }

        //检查过滤信息的完整性
        if ($.isNull(condition)) {
            return;
        }

        if ((!isLastQuery) && me.isTemplateExist(templateName)) {
            Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletExistError);
            return;
        }

        if (isLastQuery) {
            templateName = BusinessI18N.cmp.conditionManage.queryConditionLast;
        }
        // 发起保存模板请求,返回是否成功
        var requestParam = {
            "moduleId": me.config.moduleId,
            "templateName": templateName,
            "widgetValue": condition
        };
        // 发送请求信息，获取过滤信息
        Sweet.Ajax.request({
            url: Business.url.saveTemplate,
            contentType: "application/json;chartset=UTF-8",
            async: true,
            data: JSON.stringify(requestParam),
            loadMask: !isLastQuery,
            success: function(result) {
                //保存模板失败，模板名称不合法也会导致保存模板失败
                if (result === false) {
                    Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletError);
                    return;
                }
                me._queryTemplates();
                me._updateListView();
            },
            error: function() {
                Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletError);
                return;
            }
        });

    };

    /**
     * @description 返回各个组件
     * @returns {Object}
     */
    Business.conditionManage.prototype.getItems = function() {
        return this.items;
    };

    /**
     * 获取值
     * @returns {Object}
     */
    Business.conditionManage.prototype.getValue = function() {
        var me = this;

        var result = {};

        return result;
    };

    /**
     * 设置值
     * @returns {Object}
     */
    Business.conditionManage.prototype.setValue = function(obj) {
        if ($.isNull(obj)) {
            return;
        }
    };

    /**
     * 销毁组件 对外接口
     */
    Business.conditionManage.prototype.destroy = function() {

    };

    /**
     * @private
     * 初始化组件 
     */
    Business.conditionManage.prototype._init = function() {
        var me = this;
        me.items = [];

        // 历史列表图标
        me._historyIcon = new Sweet.form.LabelImage({
            imageType: "import",
            imageTip: BusinessI18N.cmp.conditionManage.queryConditionHistory,
            width: 20,
            height: 20,
            click: function(e) {
                queryModel.getQueryModel(me);
            }
        });
        me.items.push(me._historyIcon);

        // 保存图标
        me._saveIcon = new Sweet.form.LabelImage({
            imageType: "save",
            imageTip: BusinessI18N.cmp.conditionManage.queryConditionSave,
            width: 20,
            height: 20,
            click: function(e) {
                queryModel.saveTemplate(me.config, me.config.getCondtionCallback());
            }
        });

        me.items.push(me._saveIcon);
    };

    /**
     * @description  点击历史按钮，弹出历史列表
     * @returns {Object}
     */
    Business.conditionManage.prototype._onClickHistory = function(event) {
        var me = this;
        //自定义div样式
        var css = {
            width: me.config.width - 20,
            height: me.config.height - 20,
            padding: "10px"
        };

        //创建选择列表浮动窗
        if ($.isNull(me.historyEl)) {
            var id = me._historyIcon.options.id + "-history";
            me.historyEl = $("<div>").attr("id", id).addClass("sweet-dialog-bg").css(css).css({
                "display": "none"
            }).appendTo($(document.body));

            me.historylist = new Sweet.list.List({
                data: [],
                minRemains: 1,
                tip: true,
                renderTo: id
            });
            me.historylist.addListener("nodeClick", function(event, data) {
                me.historyEl.hide();
                if ($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)) {
                    return;
                }
                me.config.setCondtionCallback(JSON.parse(data.widgetValue));
            });

            //点击body其他位置，隐藏列表
            $(document.body).bind("click", function(event) {
                if ($.isNotNull(me.historyEl) && $.isVisiable(me.historyEl) && !me._showHisFloatWinFlag) {
                    me.historyEl.hide();
                }
                me._showHisFloatWinFlag = false;
            });
        }

        if ($.isVisiable(me.historyEl)) {
            return;
        }

        if ($.isNull(me.templateList)) {
            me._queryTemplates();
        }
        me._updateHistoryList();

        var target = me._historyIcon.getWidgetEl();
        var offset = $.getFloatOffset(target, me.historyEl, true);
        css = $.extend(css, offset);
        css.top = css.top + 12;
        me._showHisFloatWinFlag = true;
        me.historyEl.css(css).show();
    };
    /**
     *查询模板参数中转处理
     */
    Business.conditionManage.prototype.filterQuery = function(data) {
        var me = this;
        var filter = $.parseJSON(data);
        if ($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)) {
            return;
        }
        me.config.setCondtionCallback(filter);
    }

    /**
     * @description  点击保存查询条件按钮，弹出处理窗口
     * @returns {Object}
     */
    Business.conditionManage.prototype._onClickSave = function(event, obj) {
        var me = this;
        if ($.isNull(me.window)) {
            me._creatManageWindow();
        }
        if ($.isNull(me.templateList)) {
            me._queryTemplates();
        }
        me._updateListView();

        var target = me._historyIcon.getWidgetEl();
        var pos = target.offset();
        var left = pos.left + target.width();
        var top = pos.top + target.height() + 10;
        var x = left - me.config.width + 2;
        var y = top;
        this.manageWindow.show(x, y + 2);
    };

    /**
     * @description 创建保存查询条件窗口
     * @private
     * @returns {Object}
     */
    Business.conditionManage.prototype._creatManageWindow = function() {
        var me = this;

        // 名称
        me.nameInput = new Sweet.form.TextField({
            width: 160,
            emptyText: BusinessI18N.cmp.conditionManage.inputTemplateName,
            maxLength: Business.saveCondition.templateNameLength
        });

        // 保存按钮
        var saveButton = new Sweet.form.Button({
            width: 65,
            value: {
                value: "",
                text: BusinessI18N.cmp.conditionManage.save
            },
            click: function(e, data) {
                var template = me.nameInput.getValue().value;
                if ($.isNull(me.config.getCondtionCallback) || !$.isFunction(me.config.getCondtionCallback)) {
                    return;
                }
                var condition = me.config.getCondtionCallback();
                me.saveTemplate(template, condition);
            }
        });

        var hPanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 25,
            itemExtend: false,
            items: [me.nameInput, saveButton]
        });

        // 列表
        me.listView = new Sweet.panel.VPanel({
            width: "100%",
            height: 130,
            padding: 2,
            items: [], //必须配置这一行，否则会和more里的gridPanel冲突
            widgetClass: "query-bar-inter-list"
        });

        var vPanel = new Sweet.panel.VPanel({
            width: "100%",
            height: "100%",
            items: [hPanel, me.listView]
        });

        var closeButton = new Sweet.form.Button({
            width: 65,
            value: {
                value: "",
                text: BusinessI18N.cmp.conditionManage.ok
            },
            click: function(e, data) {
                me.manageWindow.hide();
            }
        });

        me.manageWindow = new Sweet.Window({
            header: false,
            modal: true,
            content: vPanel,
            width: me.config.width,
            height: me.config.height,
            buttons: [closeButton]
        });

    };

    /**
     * @description 检查模板是否重名
     * @param {String} templateName 模板名称
     * @returns {Boolean}
     */
    Business.conditionManage.prototype.isTemplateExist = function(templateName) {
        var me = this;
        // 检查模板名称是否重复
        if ($.isNull(me.templateList)) {
            return false;
        }

        // @采用indexOf优化，
        for (var i = 0; i < me.templateList.length; i++) {
            if (templateName === me.templateList[i].templateName) {
                return true;
            }
        }
        return false;
    };




    /**
     * 从后台查询查询历史记录
     * @returns
     */
    Business.conditionManage.prototype._queryTemplates = function() {
        var me = this,
            requestParam;
        requestParam = {
            "moduleId": me.config.moduleId,
            "templateName": ""
        };

        me.templateList = [];

        // 发送请求信息，获取过滤信息
        Sweet.Ajax.request({
            url: Business.url.templateList,
            contentType: "application/json;chartset=UTF-8",
            async: false,
            data: JSON.stringify(requestParam),
            loadMask: false,
            timeout: 300000,
            success: function(result) {
                me.templateList = result;
            },
            error: function() {
                Sweet.Msg.error("Error");
            }
        });

    };

    /**
     * 更新history List列表内容
     * @private
     */
    Business.conditionManage.prototype._updateHistoryList = function() {
        var me = this;
        var data = [];
        var lastQueryData = [];

        //把Last Query选项放到最上方
        for (var i = 0, len = me.templateList.length; i < len; i++) {
            if (me.templateList[i].templateName === BusinessI18N.cmp.conditionManage.queryConditionLast) {
                lastQueryData.push({
                    text: me.templateList[i].templateName,
                    value: me.templateList[i].templateName,
                    widgetValue: me.templateList[i].widgetValue
                });
            } else {
                data.push({
                    text: me.templateList[i].templateName,
                    value: me.templateList[i].templateName,
                    widgetValue: me.templateList[i].widgetValue
                });
            }
        }
        data = $.merge(lastQueryData, data);
        me.historylist.setData(data);
    };


    /**
     * 更新List列表内容
     * @private
     */
    Business.conditionManage.prototype._updateListView = function() {
        var me = this;
        var templateName, hPanel, label, button;
        var items = [];

        if (!me.listView) {
            return;
        }

        // 删除所有内容
        me.listView.removeItems();

        // 重新生成内容
        for (var i = 0; i < me.templateList.length; i++) {
            var templateName = me.templateList[i].templateName;
            if (templateName === BusinessI18N.cmp.conditionManage.queryConditionLast) {
                continue;
            }

            // 一个HPanel，内部一个Label，一个删除按钮
            label = new Sweet.form.Label({
                width: "90%",
                height: 23,
                tip: true,
                value: {
                    text: templateName,
                    value: templateName
                }
            });

            button = new Sweet.form.LabelImage({
                imageType: "delete",
                width: "10%",
                height: 23,
                imageTip: BusinessI18N.cmp.conditionManage.delete,
                value: {
                    text: templateName,
                    value: templateName
                },
                click: function(event, data) {
                    var templateName = data.value;
                    var deleteTemplateConfirm = Sweet.Dialog.confirm({
                        width: 330,
                        height: 130,
                        modal: false,
                        message: BusinessI18N.cmp.conditionManage.deleteTempletTips.replace("{0}", templateName),
                        listeners: {
                            "ok": function(event) {
                                me._removeTemplate(templateName);
                            },
                            "cancel": function(event) {}
                        }
                    });
                }
            });

            hPanel = new Sweet.panel.HPanel({
                width: "100%",
                height: 23,
                itemExtend: false,
                items: [label, button]
            });

            items.push(hPanel);
        }

        // 添加到VPanel里
        if (items.length > 0) {
            this.listView.addItems(items);
        }
    };


    /**
     * 删除一条记录
     * @param templateName
     * @private
     */
    Business.conditionManage.prototype._removeTemplate = function(templateName) {
        var me = this;
        var requestParam = {
            "moduleId": me.config.moduleId,
            "templateName": templateName
        };

        Sweet.Ajax.request({
            url: Business.url.deleteTemplate,
            data: JSON.stringify(requestParam),
            async: false,
            contentType: "application/json;chartset=UTF-8",
            success: function(result) {
                me._queryTemplates();
                me._updateListView();
            },
            error: function() {
                Sweet.Msg.error("Error");
            }
        });
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */


(function() {
    Business.failureReport = function(config, params) {

        //初始参数设置
        this.config = {
            renderTo: "",
            // 饼图上方panel的左边title
            panelTitle: BusinessI18N.cmp.failCause.baseTitle,
            // 饼图上方panel的右边title
            panelToolText: "需要添加" + ':' + "业务相关信息" + "" + ':',
            // 左饼图提示的格式
            leftBalloonText: "",
            // 右饼图提示的格式
            rightBalloonText: "",
            // 左右饼的数据字段
            pieKeys: {
                leftPieId: "FAILCAUSE_AIU_CLASS",
                leftPieName: "FAILCAUSE_AIU_CLASS_ZH",
                rightPieId: "FAILCAUSE_AIU_PD",
                rightPieName: "FAILCAUSE_AIU_PD_ZH",
                pieValue: "FAILCOUNT_ID_SUM"
            },
            // 表格的配置
            gridConfig: {
                columns: "",
                title: "导出表格的文件名",
                panelTitle: BusinessI18N.cmp.failCause.baseTitle, //表格外层panel的title
                drillFunc: "",
                dbDrillFunc: "",
                // 多tab页钻取表格，当前tab页的参数
                tabInfoQueryParam: "",
                selectColumn: true,
                clearFilters: true
            },
            beforeSetGridData: function(data) {
                return data;
            }
        };

        this.config = $.extend(this.config, config);
        this.params = params;

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.failureReport.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 请求数据
     */
    Business.failureReport.prototype.requestData = function(callFun) {

        var me = this;
        var config = me.config;

        Sweet.Ajax.request({
            url: Business.url.getData,
            async: false,
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(me.params),
            timeout: 300000,
            success: function(result) {
                callFun(result.list);
            },
            error: function() {
                $.error("Business.line() request line's data error!");
            }
        });
    };

    /**
     * 初始化组件
     * @private
     */
    Business.failureReport.prototype._init = function() {

        var me = this;
        var config = me.config;

        me._creatDoublePie();
        me._creatGrid();

        // panel
        var panelConfig = {
            width: "100%",
            height: "100%",
            items: [me._piePanel, me._grid.getPanel()],
            renderTo: config.renderTo || ""
        };
        me._panel = new Sweet.panel.BorderPanel(panelConfig);

        // data
        me._initData();
    };

    /**
     * 初始化pie
     * @private
     */
    Business.failureReport.prototype._creatDoublePie = function() {
        var me = this;
        var config = me.config;

        me._leftPie = new Sweet.chart.Pie({
            width: "50%",
            heigth: "100%",
            balloonText: config.leftBalloonText,
            precision: 2,
            switchable: false,
            isSortForData: false,
            pullOutOnlyOne: true,
            title: BusinessI18N.cmp.failCause.leftPieTitle,
            position: "left",
            dataKeys: ['text', 'value'],
            data: []
        });

        me._rightPie = new Sweet.chart.Pie({
            width: "50%",
            heigth: "100%",
            balloonText: config.rightBalloonText,
            precision: 2,
            switchable: false,
            isSortForData: false,
            pullOutOnlyOne: true,
            title: BusinessI18N.cmp.failCause.rightPieTitle,
            position: "right",
            dataKeys: ['text', 'value'],
            data: []
        });

        me._failureInfo = new Sweet.form.Label({
            align: Sweet.constants.align.RIGHT,
            symbol: false,
            width: 'auto',
            pading: '10px,10px,10px,10px',
            value: {
                text: config.panelToolText,
                value: "",
                data: null
            }
        });

        me._piePanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 400,
            items: [me._leftPie, me._rightPie],
            portion: "north",
            header: true,
            title: config.panelTitle,
            tools: [me._failureInfo],
            collapsible: false
        });

        me._leftPieIsOpen = false; //默认关闭
        me._leftPie.addListener("click", function(event, data) {
            me._leftPieChange(event.dataItem.pulled, data);
            me._leftPieIsOpen = event.dataItem.pulled;
        });
        me._rightPie.addListener("click", function(event, data) {
            me._rightPieChange(event.dataItem.pulled, data);
        });

    };

    /**
     * 初始化grid
     * @private
     */
    Business.failureReport.prototype._creatGrid = function() {

        var me = this;
        var config = me.config;
        me._grid = new Business.grid(config.gridConfig);
    };

    /**
     * 销毁组件 对外接口
     */
    Business.failureReport.prototype._initData = function() {
        var me = this;
        var config = me.config;
        var pieKeys = me.config.pieKeys;

        me.requestData(function(data) {
            if ($.isNull(data)) {
                return;
            }
            var leftPieData = me._getPieData({
                pieId: pieKeys.leftPieId,
                pieName: pieKeys.leftPieName,
                pieValue: pieKeys.pieValue
            }, data);
            var rightPieData = me._getPieData({
                pieId: pieKeys.rightPieId,
                pieName: pieKeys.rightPieName,
                pieValue: pieKeys.pieValue,
                fatherKey: pieKeys.leftPieId
            }, data, true);

            me._leftPie.setData(leftPieData);
            me._rightPie.setData(rightPieData);
            //重新渲染右饼，解决右饼显示不全问题
            me._rightPie.doLayout(true);

            data = config.beforeSetGridData(data);
            // DTS2014081202056 百分比从前台计算
            me.allData = $.objClone(data);
            me._grid.setData({
                data: data,
                columns: config.gridConfig.columns
            });
        });
    };

    /**
     * 左pie的数据
     * @private
     */
    Business.failureReport.prototype._getPieData = function(pieKeys, data, isTop) {

        var me = this;
        var config = me.config;
        var keyArr = pieKeys.pieId.split(",");
        var keyLen = keyArr.length;
        var nameArr = pieKeys.pieName.split(",");

        var resultObj = {};
        data.forEach(function(obj, index, arr) {
            // 左饼由三列字段决定
            var key = "";
            for (var i = 0; i < keyLen; i++) {
                key += obj[keyArr[i]];
                if (i !== keyLen - 1) {
                    key += ",";
                }
            };
            var name = isTop ? obj[nameArr[0]] + ":" + obj[nameArr[1]] + "(" + obj[nameArr[2]] + ")" : obj[nameArr[0]];
            name = Business.functions.unEscapeHtml(name);
            if (!resultObj[key]) {
                resultObj[key] = {
                    text: name,
                    value: parseInt(obj[pieKeys.pieValue]) || 0,
                    filterKey: pieKeys.pieId,
                    filterValue: key,
                    fatherKey: pieKeys.fatherKey || "",
                    fatherValue: pieKeys.fatherKey ? obj[pieKeys.fatherKey] : ""
                };
            } else {
                resultObj[key].value = parseInt(resultObj[key].value) + (parseInt(obj[pieKeys.pieValue]) || 0);
            }
        });

        var result = [];
        for (var key in resultObj) {
            result.push(resultObj[key]);
        }

        // 排序
        result = me._sortPieData(result);

        if (isTop) {
            result = me._getTopNData(result);
        }

        return result;
    };

    /**
     * 右pie的数据若超过topn，则处理为other
     * @private
     */
    Business.failureReport.prototype._sortPieData = function(data) {

        var me = this;
        var config = me.config;

        // 排序
        function compare(obj1, obj2) {
            var compareKey = "value";
            if (obj1[compareKey] < obj2[compareKey]) {
                return 1;
            } else if (obj1[compareKey] > obj2[compareKey]) {
                return -1;
            } else {
                return 0;
            }
        }
        data.sort(compare);

        return data;
    };

    /**
     * 右pie的数据若超过topn，则处理为other
     * @private
     */
    Business.failureReport.prototype._getTopNData = function(data) {

        var me = this;
        var config = me.config;

        var keyArr = config.pieKeys.rightPieId.split(",");
        var keyLen = keyArr.length;


        // 处理topN以外的数据
        var TOPN = 10;
        if (data.length > TOPN) {
            var other = {
                text: 'other', //@国际化
                value: 0,
                filterKey: config.pieKeys.rightPieId, // 仅右饼有other
                filterValue: [],
                fatherKey: config.pieKeys.leftPieId,
                fatherValue: []
            };
            for (var j = TOPN; j < data.length; j++) {
                // 左饼由三列字段决定
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += data[j][keyArr[i]];
                    if (i !== keyLen - 1) {
                        key += ",";
                    }
                };
                other.filterValue.push(data[j].filterValue);
                other.fatherValue.push(data[j].fatherValue);
                other.value += data[j].value;
            }
            data[TOPN] = other;
            data.length = TOPN + 1;
        }

        return data;
    };

    /**
     * 左pie的change
     * @private
     */
    Business.failureReport.prototype._leftPieChange = function(isOut, data) {

        var me = this;
        var config = me.config;
        var pieKeys = me.config.pieKeys;
        var rightPieData = [];
        var result = [];

        var keyArr = config.pieKeys.leftPieId.split(",");
        var keyLen = keyArr.length;


        // 左饼要关闭
        if (!isOut) {
            result = me.allData;
        }
        // 左饼要打开
        else {
            me.allData.forEach(function(obj, index, arr) {
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += obj[keyArr[i]];
                    if (i !== keyLen - 1) {
                        key += ",";
                    }
                };
                if (data.filterValue === key) {
                    result.push(obj);
                }
            });
        }

        rightPieData = me._getPieData({
            pieId: pieKeys.rightPieId,
            pieName: pieKeys.rightPieName,
            pieValue: pieKeys.pieValue,
            fatherKey: pieKeys.leftPieId
        }, result, true);

        me._rightPie.setData(rightPieData);
        me._grid.setData({
            data: result,
            columns: config.gridConfig.columns
        });
    };

    /**
     * 右pie的change
     * @private
     */
    Business.failureReport.prototype._rightPieChange = function(isOut, data) {

        var me = this;
        var config = me.config;
        var result = [];

        // 右饼要关闭
        if (!isOut) {
            // 左饼处于关闭状态
            if (!me._leftPieIsOpen) {
                result = me.allData;
            } else {
                // 左饼处于打开状态
                me.allData.forEach(function(obj, index, arr) {
                    // 处理others,数组data.fatherValue中的值应该都一样，故取第0个
                    if (data.fatherValue === obj[data.fatherKey] || data.fatherValue[0] === obj[data.fatherKey]) {
                        result.push(obj);
                    }
                });
            }
        }
        // 右饼要打开
        else {
            var keyArr = config.pieKeys.rightPieId.split(",");
            var keyLen = keyArr.length;

            me.allData.forEach(function(obj, index, arr) {
                // 右饼的分类由多个字段决定，获取多个字段的值组成key
                var key = "";
                for (var i = 0; i < keyLen; i++) {
                    key += obj[keyArr[i]];
                    if (i !== keyLen - 1) {
                        key += ",";
                    }
                };

                if (data.filterValue === key) {
                    result.push(obj);
                } else {
                    // 处理others
                    if (Array.isArray(data.filterValue)) {
                        var flag = data.filterValue.some(function(id, index, arr) {
                            return id === key;
                        });
                        if (flag) {
                            result.push(obj);
                        }
                    }
                }
            });
        }

        me._grid.setData({
            data: result,
            columns: config.gridConfig.columns
        });
    };

    /**
     * 销毁组件 对外接口
     */
    Business.failureReport.prototype.destroy = function() {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */


(function() {
    var format = "yyyy-MM-dd hh:mm:ss";
    var FORMAT = "FORMAT_";
    var NEED_AREA_PAIR = "area_pair";

    Business.line = function(params) {

        //初始参数设置
        this.config = {
            graphType: "line", // 默认为折线图
            dataKeys: ["text"],
            drillFunc: function() {
                return null;
            },
            toggleFunc: function() {
                return null;
            },
            portion: "north",
            chartType: "chart"
        };

        this.config = $.extend(this.config, params);

        this._lineDataKeys = params.dataKeys;

        this._STARTTIME = params.dataKeys[0].split(",")[0] || "";
        this._AREATYPE_NAME = params.dataKeys[0].split(",")[1] || "";
        this._AREATYPE_ID = params.dataKeys[0].split(",")[2] || "";
        this._lineDataKeys = params.dataKeys;
        this._lineDataKeys[0] = this._STARTTIME;

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.line.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 获取值
     * @returns {Object}
     */
    Business.line.prototype.getValue = function() {
        var me = this;

        return me._line.getValue();
    };

    /**
     * 下拉框change时，请求line的数据
     * @param {Object} params 从form查询头获取的小区数据和区域类型
     * @param {Object} requestParams 请求数据的
     */
    Business.line.prototype.requestLineData = function(params, requestParams) {

        var me = this;
        var config = me.config;
        me._requestParams = requestParams;
        var areaListObj = params;

        // 如果需要请求后台的区域对，则发请求
        if (params.areaList && params.areaList.toString() === NEED_AREA_PAIR) {
            var lineParams = $.objClone(me._requestParams);
            lineParams.isTopN = false;
            lineParams.type = NEED_AREA_PAIR;
            // 请求后台
            Sweet.Ajax.request({
                url: Business.url.getData,
                async: false,
                contentType: "application/json;chartset=UTF-8",
                data: JSON.stringify(lineParams),
                timeout: 300000,
                success: function(result) {
                    areaListObj = {}
                    areaListObj = {};
                    areaListObj.areaList = result.list;
                },
                error: function() {
                    $.error("Business.line() request line's data error!");
                }
            });
        }
        me._setObjBoxData(areaListObj);

    };

    /**
     * 设置值
     * @param {Object} params 值
     */
    Business.line.prototype.setData = function(val) {
        var me = this;

        if (val) {
            me._line.setData(val);
            me._data = val.data;
        }
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} objValue 多个对象
     */
    Business.line.prototype.setTopNObj = function(objValue) {
        var me = this;

        // 设置多对象对比中的下拉框数据
        me._multiObjBox.setData(objValue);
        var value = objValue.length >= 5 ? objValue.slice(0, 5) : objValue;
        me._multiObjBox.setValue(value);

        // 设置历史对比中的下拉框数据
        me._toPNObjValue = objValue;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.line.prototype.destroy = function() {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

    /**
     * 初始化组件
     * @private
     */
    Business.line.prototype._init = function() {

        var me = this;
        var config = me.config;

        // 当前时段的line数据
        me._data_multi_sort = null;
        // 历史line数据
        me._data_his_sort = null;
        me._data_hisPeriod_sort = null;

        me._creatMultiObjPanel();
        me._creatHisPanel();
        me._creatAnalysisTypeRadio();

        // panel
        var panelConfig = {
            width: "100%",
            height: 350, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            header: true,
            title: BusinessI18N.cmp.line.chartDisplay,
            toggle: config.toggleFunc,
            portion: config.portion,
            items: [
            me._multiObjHpanel,
            me._multiLine,
            me._hisObjHpanel,
            me._hisLine],
            padding: 0,
            tools: [me._analysisTypeRadio],
            itemExtend: false
        };

        me._panel = new Sweet.panel.VPanel(panelConfig);
    };

    /**
     * 多对象对比
     * @private
     */
    Business.line.prototype._creatMultiObjPanel = function() {
        var me = this;
        var config = me.config;

        // 多对象对比
        me._multiObjBox = new Sweet.form.ComboBox_v1({
            width: BusinessI18N.cmp.line.size.objBoxWidth,
            multi: true,
            maxRemains: 5,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label: true,
            labelText: BusinessI18N.cmp.line.selectObject,
            labelWidth: BusinessI18N.cmp.line.size.objBoxLabelWidth
        });

        // 指标
        me._multiIndexBox = new Sweet.form.ComboBox_v1({
            width: BusinessI18N.cmp.line.size.indexWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label: true,
            labelText: BusinessI18N.cmp.line.indexLabelText,
            labelWidth: BusinessI18N.cmp.line.size.indexLabelWidth
        });

        // panel
        me._multiObjHpanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 25,
            items: [
            me._multiObjBox,
            me._multiIndexBox],
            itemExtend: false
        });

        // line
        me._multiLine = new Sweet.chart.Line({
            height: 290,
            width: "100%",
            graphType: config.graphType,
            isLegend: true
        });

        me._multiLine.addListener("click", function(event, val) {
            // 钻取
            me._lineDrill(val);
        });
    };

    /**
     * 历史对比
     * @private
     */
    Business.line.prototype._creatHisPanel = function() {
        var me = this;
        var config = me.config;

        // 对象
        me._hisObjBox = new Sweet.form.ComboBox_v1({
            width: BusinessI18N.cmp.line.size.objBoxWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label: true,
            labelText: BusinessI18N.cmp.line.selectObject,
            labelWidth: BusinessI18N.cmp.line.size.objBoxLabelWidth
        });

        // 指标
        me._hisIndexBox = new Sweet.form.ComboBox_v1({
            width: BusinessI18N.cmp.line.size.indexWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label: true,
            labelText: BusinessI18N.cmp.line.indexLabelText,
            labelWidth: BusinessI18N.cmp.line.size.indexLabelWidth
        });

        // 历史周期
        me._hisPeriodBox = new Sweet.form.ComboBox_v1({
            width: BusinessI18N.cmp.line.size.periodWidth,
            errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
            tip: true,
            label: true,
            labelText: BusinessI18N.cmp.line.selectPeriod,
            labelWidth: BusinessI18N.cmp.line.size.periodLabelWidth
        });

        // panel
        me._hisObjHpanel = new Sweet.panel.HPanel({
            width: "100%",
            height: 25, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            items: [
            me._hisObjBox,
            me._hisIndexBox,
            me._hisPeriodBox],
            visible: false,
            itemExtend: false
        });

        // line
        me._hisLine = new Sweet.chart.Line({
            height: 290, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
            width: "100%",
            graphType: config.graphType, // 默认为折线图
            isLegend: true,
            visible: false
        });

        me._hisLine.addListener("click", function(event, val) {
            // 钻取
            me._lineDrill(val);
        });
    };

    /**
     * 多对象和历史对比单选按钮
     * @private
     */
    Business.line.prototype._creatAnalysisTypeRadio = function() {
        var me = this;
        var config = me.config;

        //分析类型的单选切换按钮 --默认多对象
        me._analysisTypeRadio = new Sweet.form.RadioGroup({
            width: BusinessI18N.cmp.line.size.radioWidth,
            height: 30,
            columns: "auto",
            data: [{
                text: BusinessI18N.cmp.line.multiObject,
                value: "1",
                data: null,
                checked: true
            }, {
                text: BusinessI18N.cmp.line.history,
                value: "2",
                data: null,
                checked: false
            }]
        });

        me._analysisTypeRadio.addListener("change", function(event, val) {
            if ("1" === val.value) {
                me._multiObjHpanel.show();
                me._multiLine.show();
                me._hisObjHpanel.hide();
                me._hisLine.hide();
            } else if ("2" === val.value) {
                me._multiObjHpanel.hide();
                me._multiLine.hide();
                me._hisObjHpanel.show();
                me._hisLine.show();
                me._firstClickHisFlag = ("undefined" === typeof me._firstClickHisFlag) ? true : false;
                if (me._firstClickHisFlag) {
                    me._hisObjChange();
                    if (me._toPNObjValue) {
                        me._hisObjBox.setData(me._toPNObjValue);
                        me._toPNObjValue = null;
                    }
                }
            } else {
                return;
            }
        });
    };

    /**
     * 设置对象、指标、周期下拉框及折线图的数据
     * @param {Object} data 从form查询头获取的小区数据和区域类型
     */
    Business.line.prototype._setObjBoxData = function(data) {

        var me = this;
        var areaList = data.areaList;

        areaList = areaList ? areaList : [];

        // 设置多对象对比中的下拉框数据
        me._multiObjBox.setData(areaList);
        var value = areaList.length >= 5 ? areaList.slice(0, 5) : areaList;
        me._multiObjBox.setValue(value);
        me._multiIndexBox.setData(me._getIndexBoxData());

        // 设置历史对比中的下拉框数据
        me._hisObjBox.setData(areaList);
        me._hisPeriodBox.setData(me._getPerioBoxData());
        me._hisIndexBox.setData(me._getIndexBoxData());

        // set折线图数据
        if (0 < areaList.length) {
            me._multiObjChange();
        }

        // 注册change事件
        me._multiObjBox.addListener("change", function(event, val) {
            me._multiObjChange();
        });
        me._multiIndexBox.addListener("change", function(event, val) {
            me._multiIndexChange();
        });
        me._hisObjBox.addListener("change", function(event, val) {
            me._hisObjChange();
        });

        me._hisIndexBox.addListener("change", function(event, val) {
            me._hisIndexBoxChange(val);
        });

        me._hisPeriodBox.addListener("change", function(event, val) {
            me._hisPeriodBoxChange(val);
        });
    };

    /**
     * 对象下拉框change事件
     * @private
     */
    Business.line.prototype._multiObjChange = function() {

        var me = this;
        var config = me.config;

        var params = {};
        params.areaList = Business.functions.getLeafArray($.objClone(me._multiObjBox.getValue())).value;
        if (!params.areaList) {
            return;
        }
        me._requestData(params, function(data) {
            me._data_multi_sort = me._sortLineData(data);
            me._multiIndexChange();
        }, true);

    };

    /**
     * 指标下拉框change事件：构造datakeys
     * @private
     */
    Business.line.prototype._multiIndexChange = function() {

        var me = this;

        // 构造datakeys
        var objArr = $.objClone(me._multiObjBox.getValue());
        var indicator = $.objClone(me._multiIndexBox.getValue());
        var dataKeys = [me._STARTTIME];

        objArr.forEach(function(item, index, arr) {
            dataKeys.push([item.value + "_" + indicator.value, item.text]);
        });

        me._multiLine.setData({
            data: (me._data_multi_sort && me._data_multi_sort.data) || [],
            dataKeys: dataKeys,
            leftUnit: indicator.data
        });
        me._multiLine.doLayout(true);
    };

    /**
     * 对象下拉框change事件，请求对象
     * @private
     */
    Business.line.prototype._hisObjChange = function() {

        var me = this;
        var config = me.config;

        var params = {};
        params.areaList = $.objClone(me._hisObjBox.getValue()).value;

        if (!params.areaList) {
            return;
        }
        // 首次切换到历史对比需要请求数据
        me._firstClickHisFlag = ("undefined" === typeof me._firstClickHisFlag) ? true : false;
        me._requestData(params, function(data) {
            me._data_his_sort = me._sortLineData(data);
        }, false);

        me._hisPeriodBoxChange();
        me._firstClickHisFlag = false;
    };

    /**
     * 周期下拉框change事件，请求历史周期的数据
     * @private
     */
    Business.line.prototype._hisPeriodBoxChange = function() {

        var me = this;

        me._requestHisPeriodData();

        me._hisIndexBoxChange();
    };

    /**
     * 周期下拉框change事件，请求历史周期的数据
     * @private
     */
    Business.line.prototype._requestHisPeriodData = function() {

        var me = this;
        var config = me.config;

        var his = me._hisPeriodBox.getValue().value;
        var params = {};
        params.areaList = $.objClone(me._hisObjBox.getValue()).value;

        if (!params.areaList) {
            return;
        }

        var startTime = $.objClone(me._requestParams.startTime);
        startTime = new Date(startTime.replace(/-/g, "/"));
        startTime.setDate(startTime.getDate() - his);
        startTime = $.date.format(startTime, format);

        var endTime = $.objClone(me._requestParams.endTime);
        endTime = new Date(endTime.replace(/-/g, "/"));
        endTime.setDate(endTime.getDate() - his);
        endTime = $.date.format(endTime, format);

        params.startTime = startTime;
        params.endTime = endTime;

        me._requestData(params, function(data) {
            me._data_hisPeriod_sort = me._sortLineData(data, me._hisPeriodBox.getValue().value);
        }, false);
    };

    /**
     * 指标下拉框change事件，重构line的数据
     * @private
     * @param {Object} val 对象下拉框当前选中的值
     */
    Business.line.prototype._hisIndexBoxChange = function() {

        var me = this;
        var config = me.config;

        // 构造datakeys
        var objArr = $.objClone(me._hisObjBox.getValue());
        var indicator = $.objClone(me._hisIndexBox.getValue());
        var period = $.objClone(me._hisPeriodBox.getValue());
        var dataKeys = [me._STARTTIME];
        var attribute = objArr.value + "_" + indicator.value;
        dataKeys.push([attribute, BusinessI18N.cmp.line.currentPeriod]);
        dataKeys.push([attribute + "_his", period.text]);

        // 合并时间并排序
        var timeMap = $.objClone(me._data_his_sort.map);
        timeMap = $.extend(timeMap, me._data_hisPeriod_sort.map);
        var timeMapKeyArr = [];

        for (var key in timeMap) {
            timeMapKeyArr.push(key);
        }
        timeMapKeyArr = timeMapKeyArr.sort();

        var lineData = [];
        timeMapKeyArr.forEach(function(time, index, arr) {
            var dataItem = {};

            dataItem[me._STARTTIME] = time;

            if (0 <= me._data_his_sort.map[time]) {
                var _index = me._data_his_sort.map[time];
                var item = me._data_his_sort.data[_index];
                if (item[attribute] || 0 == item[attribute]) {
                    dataItem[attribute] = item[attribute];
                }
            }

            if (0 <= me._data_hisPeriod_sort.map[time]) {
                var _index = me._data_hisPeriod_sort.map[time];
                var item = me._data_hisPeriod_sort.data[_index];
                if (item[attribute] || 0 == item[attribute]) {
                    dataItem[attribute + "_his"] = item[attribute];
                }
            }

            lineData.push(dataItem);

        });

        me._hisLine.setData({
            data: lineData,
            dataKeys: dataKeys,
            leftUnit: indicator.data
        });
        me._hisLine.doLayout(true);
    };

    /**
     * 构造line数据
     * @private
     * @param objArr 对象
     * @param indicator 指标
     * @param val 折现图原始数据
     * @returns json格式的对象
     */
    Business.line.prototype._sortLineData = function(val, his) {

        var me = this;
        val = val.list;
        var data = [];
        var map = {};
        var intervalArr = me._requestInterval();

        // 没有数据，只显示时间
        if (!val || !val.length) {
            // 优先用请求回来的时间粒度数据
            if (intervalArr && 0 < intervalArr.length) {
                intervalArr.forEach(function(timeStr, strIndex, strArr) {
                    var emptyObj = {};
                    emptyObj[me._STARTTIME] = timeStr;
                    data.push(emptyObj);
                    map[timeStr] = strIndex;
                });
                return {
                    data: data,
                    map: map
                };
            }

            // 如果请求回来的时间粒度数组无效，则默认只有起始时间和结束时间
            var startTime = me._requestParams.startTime;
            var endTime = me._requestParams.endTime;
            var obj1 = {};
            obj1[me._STARTTIME] = startTime;
            data.push(obj1);
            map[startTime] = 0;
            if (startTime !== endTime) {
                var obj2 = {};
                obj2[me._STARTTIME] = endTime;
                data.push(obj2);
                map[endTime] = 1;
            }
            return {
                data: data,
                map: map
            };
        }

        // 按照UTC时间升序重新排序
        function compare(val1, val2) {
            var compareKey = (0 === me._STARTTIME.indexOf(FORMAT) ? me._STARTTIME.slice(FORMAT.length) : me._STARTTIME);
            if (val1[compareKey] < val2[compareKey]) {
                return -1;
            } else if (val1[compareKey] > val2[compareKey]) {
                return 1;
            } else {
                return 0;
            }
        }
        val.sort(compare);

        // 构造数据
        var i = 0;
        val.forEach(function(dataObj, index2, arr) {

            var obj = {};
            // obj的属性，由对象value+每个指标value组成；值为该对象的该指标值
            me._lineDataKeys.forEach(function(key, index3, arr) {
                if (index3 > 0) {
                    // 对象value
                    var objValue = dataObj[me._AREATYPE_ID];
                    obj[objValue + "_" + key[0]] = dataObj[key[0]];
                }
            });

            var timeColumn = dataObj[me._STARTTIME];
            if (his) {
                timeColumn = new Date(timeColumn.replace(/-/g, "/"));
                timeColumn.setDate(timeColumn.getDate() + his);
                timeColumn = $.date.format(timeColumn, format);
                // 只替换年月日
                timeColumn = timeColumn.slice(0, 10) + dataObj[me._STARTTIME].slice(10);
            }

            // 合并时间相同的两项
            if (data.length > 0 && data[data.length - 1][me._STARTTIME] === timeColumn) {
                data[data.length - 1] = $.extend(data[data.length - 1], obj);
            } else {

                obj[me._STARTTIME] = timeColumn;
                data.push(obj);

                // 时间和下标index对应关系map
                map[timeColumn] = i;
                i++;
            }

        });

        var result = {
            data: data,
            map: map
        };
        // 从后台没有拿到时间粒度数组
        if (!intervalArr || 1 > intervalArr.length) {
            return result;
        }

        result = {
            data: [],
            map: {}
        };
        intervalArr.forEach(function(timeStr, strIndex, strArr) {
            if (0 <= map[timeStr]) {
                result.data.push(data[map[timeStr]]);
            } else {
                var emptyObj = {};
                emptyObj[me._STARTTIME] = timeStr;
                result.data.push(emptyObj);
            }
            result.map[timeStr] = strIndex;
        });
        return result;
    };

    /**
     * 获取“指标”下拉框的数据
     * @private
     */
    Business.line.prototype._getIndexBoxData = function() {

        var me = this;

        var value = [];
        if (me._lineDataKeys) {
            var key = me._lineDataKeys.slice(1);
            key.forEach(function(item, index, arry) {
                var str = item[1];
                var startIndex = str.indexOf("(");
                var text = (0 <= startIndex ? str.slice(0, startIndex) : str);
                var data = (0 <= startIndex ? str.slice(startIndex + 1, str.length - 1) : "");
                value.push({
                    value: item[0],
                    text: text,
                    data: data
                });
            });
        }

        return value;
    };

    /**
     * 获取“选择周期”下拉框数据
     * @private
     * @param {Object} params 下拉框数据
     */
    Business.line.prototype._getPerioBoxData = function() {

        var me = this;
        var val = BusinessI18N.cmp.line.timeDate;

        var periodData = [];
        val.forEach(function(item, index, arry) {
            periodData.push({
                value: item[0],
                text: item[1]
            });
        });

        return periodData;
    };

    /**
     * 钻取
     * @private
     * @param {Object} params 返回给回调函数的值
     */
    Business.line.prototype._lineDrill = function(val) {

        var me = this;
        var config = me.config;

        config.drillFunc(val);
    };

    /**
     * 下拉框change时，请求line的数据
     */
    Business.line.prototype._requestData = function(params, callFun, async) {

        var me = this;
        var config = me.config;

        var lineParams = $.extend($.objClone(me._requestParams), params);
        lineParams.isTopN = false;
        lineParams.type = config.chartType;
        // 请求后台
        Sweet.Ajax.request({
            url: Business.url.getData,
            async: async,
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(lineParams),
            timeout: 300000,
            success: function(result) {
                callFun(result);
            },
            error: function() {
                $.error("Business.line() request line's data error!");
            }
        });

    };

    /**
     * 请求时间间隔
     */
    Business.line.prototype._requestInterval = function() {

        var me = this;
        var config = me.config;

        var timeList = [];

        // 请求后台
        Sweet.Ajax.request({
            url: Business.url.getTimeList,
            async: false,
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(me._requestParams),
            timeout: 300000,
            success: function(result) {
                timeList = result;
            },
            error: function() {
                $.error("Business.line() request timeList's data error!");
            }
        });

        return timeList;
    };

})();
/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */


(function() {
    var format = "yyyy-MM-dd hh:mm:ss";
    var FORMAT = "FORMAT_";

    Business.column = function(params) {

        //初始参数设置
        this.config = {
            graphType: "column", // column,column_obj,column_index,column_both
            graphIntegersOnly: [false],
            dataKeys: ["text"],
            objBox: false, // 柱图是否带对象下拉框，graphType为column时才有效
            indexBox: false, // 柱图是否带指标下拉框，graphType为column时才有效
            drillFunc: function() {
                return null;
            },
            toggleFunc: function() {
                return null;
            },
            portion: "north",
            chartType: "chart",
            labelRotation: 0
        };

        this.config = $.extend(this.config, params);
        // graphType不为"column_*"时，需设置objBox和indexBox
        if ("column_obj" === this.config.graphType) {
            this.config.objBox = true;
            this.config.indexBox = false;
        } else if ("column_index" === this.config.graphType) {
            this.config.objBox = false;
            this.config.indexBox = true;
        } else if ("column_both" === this.config.graphType) {
            this.config.objBox = true;
            this.config.indexBox = true;
        }
        this.config.graphType = "column";
        // 不为数组：为字符串，变成数组；其余统一为[false]
        var graphIntegersOnly = this.config.graphIntegersOnly;
        if (!(graphIntegersOnly instanceof Array)) {
            if ("string" === typeof(graphIntegersOnly)) {
                this.config.graphIntegersOnly = ("true" === graphIntegersOnly) ? [true] : [false];
            } else {
                this.config.graphIntegersOnly = [false];
            }
        }
        this._lineDataKeys = params.dataKeys;

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.column.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 获取值
     * @returns {Object}
     */
    Business.column.prototype.getValue = function() {
        var me = this;

        return me._line.getValue();
    };

    /**
     * 下拉框change时，请求数据
     * @param {Object} params 从form查询头获取的小区数据和区域类型
     * @param {Object} requestParams 请求数据的
     */
    Business.column.prototype.requestLineData = function(params, requestParams) {

        var me = this;
        var config = me.config;
        me._requestParams = requestParams;
        me._setobjBoxData(params);
    };

    /**
     * 设置值
     * @param {Object} params 值
     */
    Business.column.prototype.setData = function(val) {
        var me = this;

        if (val) {
            me._line.setData(val);
            me._line.doLayout(true);
            me._data = val.data;
        }
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} objValue 多个对象
     */
    Business.column.prototype.setTopNObj = function(objValue) {
        var me = this;

        // 设置多对象对比中的下拉框数据
        me._objBox.setData(objValue);
        var value = objValue.length >= 5 ? objValue.slice(0, 5) : objValue;
        me._multiObjBox.setValue(value);

        // 设置历史对比中的下拉框数据
        me._toPNObjValue = objValue;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.column.prototype.destroy = function() {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

    /**
     * 初始化组件
     * @private
     */
    Business.column.prototype._init = function() {

        var me = this;
        var config = me.config;

        var panelConfig = {
            width: "100%",
            header: true,
            title: BusinessI18N.cmp.line.chartDisplay,
            toggle: config.toggleFunc,
            portion: config.portion,
            datakeys: me._lineDataKeys,
            height: 300, // 下拉框高度 + line高度 + 35 = panel高度
            items: me._creatColumnLine()
        };

        me._panel = new Sweet.panel.VPanel(panelConfig);
    };

    /**
     * 多对象对比
     * @private
     */
    Business.column.prototype._creatColumnLine = function() {

        var me = this;
        var config = me.config;
        var items = [];
        var hPanelItem = [];

        // 对象下拉框
        if ("true" === config.objBox || true === config.objBox) {
            me._objBox = new Sweet.form.ComboBox_v1({
                width: BusinessI18N.cmp.line.size.objBoxWidth,
                multi: false,
                maxRemains: 5,
                errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
                tip: true,
                label: true,
                labelText: BusinessI18N.cmp.line.selectObject,
                labelWidth: BusinessI18N.cmp.line.size.objBoxLabelWidth
            });

            hPanelItem.push(me._objBox);
        }

        // 指标下拉框
        if ("true" === config.indexBox || true === config.indexBox) {
            me._indexBox = new Sweet.form.ComboBox_v1({
                name: "interval",
                width: BusinessI18N.cmp.line.size.indexWidth,
                height: 25, // 下拉框高度 + line高度 + 35 = panel高度
                label: true,
                labelText: BusinessI18N.cmp.line.indexLabelText,
                labelWidth: BusinessI18N.cmp.line.size.indexLabelWidth,
                multi: false,
                tip: true
            });

            hPanelItem.push(me._indexBox);
        }

        // 下拉框所在的hpanel
        if (0 < hPanelItem.length) {
            me._hPanel = new Sweet.panel.HPanel({
                width: "100%",
                height: 25, // 下拉框Hpanel高度25 + line高度290 + 35 = panel高度350
                items: hPanelItem,
                visible: true,
                itemExtend: false
            });
            items.push(me._hPanel);
        }

        // 柱状图
        me._line = new Sweet.chart.Line({
            height: 240, // 下拉框高度 + line高度 + 35 = panel高度
            width: "100%",
            isLegend: false,
            isScrollbar: false,
            legendTips: true,
            definedColor: false,
            graphType: config.graphType,
            labelRotation: config.labelRotation,
            integersOnly: config.graphIntegersOnly
        });

        me._line.addListener("click", function(event, val) {
            // 钻取
            me._lineDrill(val);
        });
        items.push(me._line);

        return items;
    };

    /**
     * 设置柱图的对象、指标、周期下拉框及折线图的数据
     * @param {Object} data 从form查询头获取的小区数据和区域类型
     */
    Business.column.prototype._setobjBoxData = function(data) {

        var me = this;
        var areaList = data.areaList;
        var indexBoxDatas;
        areaList = areaList ? areaList : [];

        // 设置对象下拉框数据
        if (me._objBox) {
            me._objBox.setData(areaList);
            var value = areaList.length >= 5 ? areaList.slice(0, 5) : areaList;
            me._objBox.setValue(value);

            // 注册change事件
            me._objBox.addListener("change", function(event, val) {
                me._objBoxChange();
            });
        }

        if (me._indexBox) {
            indexBoxDatas = me._getIndexBoxData();
            me._indexBox.setData(indexBoxDatas);
            if (!indexBoxDatas || indexBoxDatas.length <= 1) {
                me._indexBox.setDisabled(true);
            } else {
                me._indexBox.setDisabled(false);
            }
            me._indexBox.addListener("change", function(event, val) {
                me._indexBoxChange();
            });
        }

        // 请求数据()
        me._objBoxChange();

    };

    /**
     * 对象下拉框change事件
     * @private
     */
    Business.column.prototype._objBoxChange = function() {

        var me = this;
        var config = me.config;

        var params = {};
        if (me._objBox) {
            params.areaList = Business.functions.getLeafArray($.objClone(me._objBox.getValue())).value;

            if (!params.areaList) {
                return;
            }
        }

        me._requestData(params, function(data) {
            if (me._indexBox) {
                me._indexBoxChange(data);
                return;
            }

            me._setColumnData(data);
        }, true);

    };

    /**
     * 指标下拉框change事件：构造datakeys
     * @private
     */
    Business.column.prototype._indexBoxChange = function(data) {
        var me = this;
        var val = me._indexBox.getValue();
        var dataKeys = [me._lineDataKeys[0].split(",")[0],
            [val.value, val.text]
        ];

        data = data ? data : [];

        me._line.setData({
            data: data,
            dataKeys: dataKeys,
            leftUnit: val.data
        });
        me._line.doLayout(true);
    };

    /**
     * 表格和柱状图的联动回调函数，实现对柱状图更新数据
     * @param {Object} data 表格当前页的数据
     */
    Business.column.prototype._setColumnData = function(data) {
        var me = this;
        var config = me.config;
        var dataKeys = [me._lineDataKeys[0].split(",")[0], me._lineDataKeys[1]];

        me._line.setData({
            data: data,
            dataKeys: dataKeys,
            leftUnit: me._objBox.getValue().data || ""
        });
        me._line.doLayout(true);

    };

    /**
     * 获取“指标”下拉框的数据
     * @private
     */
    Business.column.prototype._getIndexBoxData = function() {

        var me = this;

        var value = [];
        if (me._lineDataKeys) {
            var key = me._lineDataKeys.slice(1);
            key.forEach(function(item, index, arry) {
                var str = item[1];
                var startIndex = str.indexOf("(");
                var text = (0 <= startIndex ? str.slice(0, startIndex) : str);
                var data = (0 <= startIndex ? str.slice(startIndex + 1, str.length - 1) : "");
                value.push({
                    value: item[0],
                    text: text,
                    data: data
                });
            });
        }

        return value;
    };

    /**
     * 钻取
     * @private
     * @param {Object} params 返回给回调函数的值
     */
    Business.column.prototype._lineDrill = function(val) {

        var me = this;
        var config = me.config;

        config.drillFunc(val);
    };

    /**
     * 下拉框change时，请求line的数据
     */
    Business.column.prototype._requestData = function(params, callFun, async) {

        var me = this;
        var config = me.config;

        var lineParams = $.extend($.objClone(me._requestParams), params);
        lineParams.isTopN = false;
        // 用于区分表格的请求
        lineParams.type = config.chartType;
        // 请求后台
        Sweet.Ajax.request({
            url: Business.url.getData,
            async: async,
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(lineParams),
            timeout: 300000,
            success: function(result) {
                callFun(result.list);
            },
            error: function() {
                $.error("Business.column() request line's data error!");
            }
        });

    };

})();
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
        noSupportStr: {
            "plusplus": "--",
            "hundred": "100.00",
            "zero": "0"
        },
        drillTpye: {
            "cdr": "cdr",
            "failcause": "failcause",
            "hocause": "hocause"
        }

    };

    Business.grid = function(params) {

        //初始化组件需要传的参数，未传参数使用默认值
        this.config = {
            columns: [],
            title: "export",
            selectColumn: true,
            clearFilters: true,
            panelTitle: BusinessI18N.cmp.grid.gridDisplay,
            // 钻取回调函数
            drillFunc: function() {
                return null;
            },
            // 表格设置数据后回调函数
            afterSetDataFunc: function() {
                return null;
            },
            dbDrillFunc: function() {
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
    Business.grid.prototype.getCurrentPageData = function() {
        var me = this,
            pageInfo = {}, resultData, detailData = [],
            size = 0,
            curPage = 1;
        var currentGridData = me.store.getCurrentData();
        if (!currentGridData || currentGridData.length <= 0) {
            currentGridData = me.gridData.data.length > 0 ? me.gridData.data : [];
        }

        resultData = currentGridData;
        if (me.grid) {
            pageInfo = me.grid.getPageInfo();
            pageInfo.currentPage ? curPage = pageInfo.currentPage : "";
            pageInfo.size ? size = pageInfo.size : "";
            resultData.length > 0 ? detailData = resultData : "";
            if (detailData.length > 0) {
                var startIndex, endIndex;
                if (curPage === 1) {
                    startIndex = 0;
                } else if (curPage > 1) {
                    startIndex = (curPage - 1) * size;
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
    Business.grid.prototype.getPanel = function() {
        return this.panel;
    };


    /**
     * 销毁组件 对外接口
     */
    Business.grid.prototype.destroy = function() {
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
    Business.grid.prototype.setData = function(data, queryParams) {
        var me = this;
        if ($.isNotNull(data)) {
            if ($.isNotNull(queryParams)) {
                me.config.queryParam = queryParams;
            }
            me.gridData = data;
            data.page = {
                total: data.length
            };

            if ($.isNull(data.columns)) {
                if ($.isNotNull(me.columns)) {
                    data.columns = me.columns;
                    me.store.loadData(data);
                }
            } else {
                var isSameBool = false;
                isSameBool = $.equals(me.columns, data.columns);
                if (!isSameBool) {
                    me.columns = data.columns;

                    if (me.grid) {
                        me.grid.destroy();
                        me.baseCondition = null;
                        // 表格导出时，me.gridData为null报错
                    }
                    me.panel.removeItems();

                    me._createGrid(data, queryParams);
                    me.panel.addItems(me.grid);
                } else {
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
            data: [],
            columns: config.columns,
            page: {
                total: 0
            }
        };

        var items = [];
        //creat grid
        if (config.columns && config.columns.length > 0) {
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
            value: {
                "value": "1",
                "text": BusinessI18N.cmp.grid.counterTool
            }
        });

        me.panel = new Sweet.panel.VPanel({
            width: "100%",
            height: "100%",
            header: true,
            title: config.panelTitle,
            tools: config.columns.counterHiddened ? [me.toolCounter] : [],
            items: items
        });

        // 事件
        me.toolCounter.addListener("click", function(event, checked) {
            me._toolCounterChange(checked);
        });
    };

    /**
     * 次数单选按钮点击事件
     * @private
     * @param checked
     */
    Business.grid.prototype._toolCounterChange = function(checked) {

        var me = this;
        var config = me.config;
        //次数单选框选择改变
        this.showCounters = checked;

        //为counter列设置显隐
        for (var i = 0; i < config.columns.length; i++) {
            var col = config.columns[i];
            if (col.transform === 'counter') {
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
        if ($.isNull(data)) {
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

        var reader = new Sweet.Reader.JsonReader();

        if (tempData.data && tempData.data.length > 0) {
            if (tempData.page && tempData.page.total) {
                me._dataTotal = tempData.page.total;
            } else {
                me._dataTotal = tempData.data.length;
            }
        } else {
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
                selectColumn: me.config["selectColumn"],
                clearFilters: me.config["clearFilters"],
                secondaryStat: false,
                "export": true,
                exportType: ["csv"]

            }
        });

        // 显示数据
        var tempGridData = {};
        if (tempData.data && tempData.data.length > 0) {
            tempGridData.data = tempData.data;
            tempData.page ? tempGridData.page = tempData.page : "";
            me.store.loadData(tempGridData);
        }
        me.grid.addListener("cellClick", function(event, data) {

            //单元格点击获取整行的数据，为钻取下个页面准备参数
            me.baseDrillData = data;
        });
        me.grid.addListener("rowDblClick", function(event, data) {
            if (me.config.dbDrillFunc && typeof(me.config.dbDrillFunc) === "function") {
                me.config.dbDrillFunc(event, data);
            }
        });
        me.grid.addListener("afterSetData", function(event, data) {
            //表格设置完数据后执行外部函数
            if (me.config.afterSetDataFunc && typeof(me.config.afterSetDataFunc) == "function") {
                me.config.afterSetDataFunc();
            }
        });

        //导出按钮点击事件
        me.grid.addListener("export", function(event, data) {
            me._onExport(event, data);
        });

    };

    /**
     * 修改无效数据的样式
     * @param info 
     * @private
     */
    Business.grid.prototype._renderColumn = function(info) {
        if (info && info["columnDesc"] && info["columnDesc"]["unDrillDatas"]) {
            if ($.inArray(("" + info.data), info["columnDesc"]["unDrillDatas"]) > -1) {
                return '<div><span style="color:black;">' + info.data + '</span></div>';
            } else {
                return '<div><span style="cursor:pointer;text-decoration:underline;">' + info.data + '</span></div>';
            }
        }
        // 添加为空判断
        if (!info.data || info.data === Business.cmpGrid.noSupportStr.plusplus || info.data === Business.cmpGrid.noSupportStr.hundred || info.data === Business.cmpGrid.noSupportStr.zero) {
            return '<div><span style="color:black;">' + info.data + '</span></div>';
        } else {
            return '<div><span style="cursor:pointer;text-decoration:underline;">' + info.data + '</span></div>';
        }
    },

    /**
     * 创建表格头信息
     * @private
     */
    Business.grid.prototype._createColumnInfo = function(data) {
        if ($.isNull(data)) {
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
                for (var k = 0; k < tempLen; k++) {
                    column.menus[k].icon = Business.imagePath.gridCdrDrill;
                }

                //钻取菜单点击事件
                column.itemClick = function(e, data) {
                    $.log("itemClick click: " + data);
                    me._onMenuClick(e, data);
                };
                //确定钻取菜单是否显示（数据为"0","100%"）
                column.beforeShowMenu = function(tempData) {
                    if (me.baseDrillData && me.baseDrillData.rowData) {
                        var value = me.baseDrillData.rowData[tempData.name];
                        if (me.columns && me.columns.length > 0) {
                            for (var k = 0; k < me.columns.length; k++) {
                                if (tempData.name == me.columns[k]["name"] && me.columns[k]["unDrillDatas"]) {
                                    if ($.inArray(("" + value), me.columns[k]["unDrillDatas"]) > -1) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        }
                        if (!value || value === Business.cmpGrid.noSupportStr.plusplus || value === Business.cmpGrid.noSupportStr.hundred || value === Business.cmpGrid.noSupportStr.zero) {
                            return false;
                        } else {
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
    Business.grid.prototype._onMenuClick = function(event, data) {
        var me = this;
        var params = {};

        params.columnName = me.baseDrillData.name;
        params.rowData = me.baseDrillData.rowData;
        params.type = data;


        //钻取下个页面回调函数
        if (me.config.drillFunc && typeof(me.config.drillFunc) === "function") {
            me.config.drillFunc(params);
        }
    };

    /**
     * 前台导出查询结果  
     * @private
     */
    Business.grid.prototype._onExport = function(event, data) {
        var me = this;
        var config = me.config;

        var col = [];
        var header = {};
        var headerName = [];

        header["SN"] = BusinessI18N.cmp.grid.sn;
        headerName.push("SN");
        if (data && data.columns) {
            col = data.columns;
        }
        for (var i = 0; i < col.length; i++) {
            header[col[i].name] = col[i].header;
            //根据列的hidden属性来判断列是否导出
            if (!col[i].hidden) {
                headerName.push(col[i].name);
            }
        }

        var data = [];
        if (me.store) {
            data = me.store.getCurrentData() || [];
        }
        // 添加行号
        for (var i = 0; i < data.length; i++) {
            data[i].SN = i + 1 + "";
        }
        //构造前台导出参数 
        var params = {
            title: config.title,
            format: "csv",
            header: header,
            headerName: headerName,
            data: data
        };

        //向后台发送请求，导出请求路径
        var reqConfig = {
            url: Business.url.exportData,
            async: true,
            loadMask: true,
            data: JSON.stringify(params),
            contentType: "application/json;chartset=UTF-8",
            timeout: 300000,
            success: function(result) {
                if (!$.isNull(result.filePath) && result.filePath !== "error") {
                    Business.functions.requestDataByForm(Business.url.downLoad, result, "", false);
                } else {
                    //提示导出失败
                    Sweet.Msg.error("Export File Error");
                }
            },
            error: function() {
                Sweet.Msg.error("Error");
            }
        };
        // 发送请求
        Sweet.Ajax.request(reqConfig);
    };
})();
/**
    data = {
        columns:[
                     {
                         header: "modelID",
                         name: ID,
                         tooltip: "modelID",
                         sortable: true,
                         dataType: "string",
                         tip: true,
                         enableHdMenu:true, //默认值true
                         hidden: true
                     },
                     {
                         header: BusinessI18N.dashboard.wTpl_nameText_labelText,
                         name: LABEL,
                         tooltip: BusinessI18N.dashboard.wTpl_nameText_labelText,
                         sortable: true,
                         dataType: "string",
                         enableHdMenu:false,
                         tip: true,
                         filter:true,
                         filterType:'string',//其他3种是：'number','date','list',
                         hidden: false,
                         menus: [
                             {text: "cdr", value: 1}
                         ]
                     }
          ],
             data: [
                 {"ID":"ec026f4f416e46339b13","LABEL":"名称"},
                 {"ID":"f577d94660da4f7","LABEL":"描述"}
             ],
             page:{
             total: 100
         }

*/
/**
 * @fileOverview  
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */


(function() {

    Business.report = function(config, params) {

        //初始参数设置
        this.config = {
            // report外层panel的title
            title: "report-title",
            // grid导出文件的名称，只能为英文
            exportName: "report-title",
            // line
            graphType: "line", // "line", "column"
            columnLabelRotation: 0,
            graphDataKeys: ["text"],
            chartType: "chart",
            graphDrillFunc: function() {
                return null;
            },
            // grid
            gridColumns: [],
            gridDrillFunc: function(drillParams) {
                return null;
            },
            gridDbClickDrillFunc: function(drillParams) {
                return null;
            }
        };

        this._lineObjData = $.objClone(params.areaListObj);
        delete params.areaListObj;
        this.params = params;

        this.config = $.extend(this.config, config);

        if (!this.config) {
            return;
        }

        if ("line" === this.config.graphType) {
            this._AREATYPE_NAME = this.config.graphDataKeys[0].split(",")[1] || "";
            this._AREATYPE_ID = this.config.graphDataKeys[0].split(",")[2] || "";
        }

        //加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.report.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 请求数据
     */
    Business.report.prototype.requestData = function() {

        var me = this;
        var config = me.config;

        me._isLoaded = true;

        // 折线图单独请求数据
        me._line.requestLineData({
            areaList: me._lineObjData
        }, $.objClone(me.params));

        // 请求后台
        Sweet.Ajax.request({
            url: Business.url.getData,
            contentType: "application/json;chartset=UTF-8",
            data: JSON.stringify(me.params),
            timeout: 300000,
            success: function(result) {
                var data = (result.list ? result.list : []);
                var resultColumns = Business.functions.creatGridFilterList($.objClone(data), $.objClone(config.gridColumns));

                me._grid.setData({
                    data: data,
                    columns: resultColumns
                });

                // topN时，表格中对象过滤中的数据来源于此
                if ((!config.graphType || "line" === config.graphType) && me.params.isTopN) {
                    // 从表格数据中获取对象，构造dimFilterLists的数据
                    var objValue = [];
                    var objValueObj = {};
                    data.forEach(function(item, index, arr) {
                        if (!objValueObj[item[me._AREATYPE_ID]]) {
                            objValueObj[item[me._AREATYPE_ID]] = item[me._AREATYPE_NAME];
                            objValue.push({
                                text: item[me._AREATYPE_NAME],
                                value: item[me._AREATYPE_ID]
                            });
                        }
                    });
                    me._line.setTopNObj(objValue);
                }
            },
            error: function() {
                $.error("Business.report() request grid's data error!");
            }
        });

    };

    /**
     * 是否已经加载数据
     */
    Business.report.prototype.isLoaded = function() {
        var me = this;
        if ($.isNull(me._isLoaded)) {
            return false;
        }
        return me._isLoaded;
    };


    /**
     * 初始化组件
     * @private
     */
    Business.report.prototype._init = function() {

        var me = this;
        var config = me.config;

        // line/column
        me._line = me._creatDiffLine();
        if (!me._line) {
            $.error("Business.report() has not support the type of chart!");
            return;
        }

        // 业务grid
        var gridConfig = {
            columns: config.gridColumns,
            title: config.exportName,
            drillFunc: config.gridDrillFunc,
            dbDrillFunc: config.gridDbClickDrillFunc,
            multiColumnSort: !config.hideMultiColumnSort,
            // 多tab页钻取表格，当前tab页的参数
            tabInfoQueryParam: config.tabInfoQueryParam
        };
        me._grid = new Business.grid(gridConfig);

        // panel
        var panelConfig = {
            title: config.title,
            width: "100%",
            height: "100%",
            items: [me._line.getPanel(), me._grid.getPanel()]
        };
        if (config.renderTo) {
            panelConfig.renderTo = config.renderTo;
        }
        me._panel = new Sweet.panel.BorderPanel(panelConfig);
    };

    /**
     * 销毁组件 对外接口
     */
    Business.report.prototype.destroy = function() {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

    /**
     * 创建line
     * @private
     * @param {Object} data 表格当前页的数据
     */
    Business.report.prototype._creatDiffLine = function() {
        var me = this;
        var config = me.config;
        var line = null;
        var lineConfig = {
            graphType: config.graphType, // 默认为折线图
            dataKeys: config.graphDataKeys,
            graphIntegersOnly: config.graphIntegersOnly,
            drillFunc: config.graphDrillFunc,
            toggleFunc: function(flag) {
                // 默认是展开的
                var lineHeight = me._line.getPanel().getHeight();
                if (!flag) {
                    lineHeight = 30;
                }
                me._panel.setItemSize("north", null, lineHeight);
            }
        };

        if ("line" === config.graphType) {
            lineConfig.graphType = "line";
            line = new Business.line(lineConfig);
        } else if (-1 != config.graphType.indexOf("column")) {
            lineConfig.chartType = config.chartType;
            lineConfig.labelRotation = config.columnLabelRotation;
            line = new Business.column(lineConfig);
        } else {
            //
        }

        return line;
    };


})();
/**
 * @fileOverview
 * 
 * <pre>
 * 业务组件--图标
 * 2014-4-16
 * </pre>
 */

(function() {

    Business.page = function(module, feature) {

        var pageConfig = this._initPageConfig(module, feature);

        this.config = {
            module: module,
            feature: feature
        };

        this.config = $.extend(this.config, pageConfig);

        if (!this.config) {
            return;
        }
        // 加载组件
        this._init();

        return this;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.page.prototype.getPanel = function() {
        return this._panel;
    };

    /**
     * 初始化页面参数配置
     * 
     * @private
     */
    Business.page.prototype._initPageConfig = function(module, feature) {
        var me = this;

        var config = {};

        // 请求后台
        Sweet.Ajax.request({
            url: Business.url.getPageConfig,
            contentType: "application/json;chartset=UTF-8",
            async: false,
            data: JSON.stringify({
                module: module,
                feature: feature
            }),
            timeout: 300000,
            success: function(result) {
                if ($.isNull(result)) {
                    $.error("Business.page() _initPageConfig result is null!");
                }
                config = result;
            },
            error: function() {
                $.error("Business.page() _initPageConfig error!");
            }
        });
        return config;
    };

    /**
     * 初始化组件
     * 
     * @private
     */
    Business.page.prototype._init = function() {
        var me = this;
        var config = me.config;

        // 创建查询表头
        var queryConditionConfig = {};
        var conditionCmps = config.queryCondition.cmps.split(",");
        var cmp;
        for (var i = 0; i < conditionCmps.length; i++) {
            var cmp = conditionCmps[i];
            queryConditionConfig[cmp] = config.queryCondition[cmp] || {};
        }
        queryConditionConfig.moduleId = config.module + config.feature;

        queryConditionConfig.queryFunc = function(params) {
            me._queryData(params);
        };

        if (me.config["queryCondition"] && me.config["queryCondition"]["validatorFunc"]) {
            var validatorFunc = eval(me.config["queryCondition"]["validatorFunc"]);
            if ("function" == typeof(validatorFunc)) {
                queryConditionConfig.validatorFunc = validatorFunc;
            }
        }

        me.queryCondition = new Business.queryCondition(queryConditionConfig);
        me._queryPanel = me.queryCondition.getPanel();

        // 创建tabpanel
        me._tabPanel = new Sweet.panel.TabPanel({
            width: "100%",
            height: "100%",
            items: [],
            visible: false,
            portion: "center",
            style: 2
        });

        // 整个页面布局panel
        me._mainPanel = new Sweet.panel.BorderPanel({
            width: "100%",
            height: "100%",
            items: [me._queryPanel, me._tabPanel],
            renderTo: "mainPanel"
        });

        // 页面刷新后，导入查询条件（最后一次的查询条件）
        me.queryCondition.getConditionManage().importLastQuery(queryConditionConfig.moduleId);

        // tab页切换的事件监控
        me._tabPanel.addListener("tabchanged", function(ptab, ntab) {
            var tabIndex = me._tabPanel.getActiveTab();
            // 发送请求
            if (!me._reportArr[tabIndex].isLoaded()) {
                me._reportArr[tabIndex].requestData();
            }
        });

    };

    /**
     * 查询方法
     */
    Business.page.prototype._queryData = function(queryParams) {
        var me = this;
        var config = me.config;

        queryParams.sort = "";
        queryParams.isPaging = 0;
        queryParams.currentPage = 0;
        queryParams.pageSize = 5000;

        var params = me._getTabInfo(queryParams);

        if (!params || params.length <= 0) {
            $.error("get query params is null!");
            return;
        }

        me._tabPanel.removeItems();
        me._tabPanel.hide();

        me._reportArr = [];
        var reportPanelArr = [];
        for (var i = 0; i < params.length; i++) {
            var report = new Business.report(params[i].reportConfig,
            params[i].queryParams);
            me._reportArr.push(report);
            reportPanelArr.push(report.getPanel());
        }
        me._reportArr[0].requestData();
        me._tabPanel.addItems(reportPanelArr);
        me._tabPanel.show();
        if (report.getPanel()) {
            report.getPanel().doLayout(true);
        }
    };

    /**
     * 获取查询结果tab页参数和配置信息
     */
    Business.page.prototype._getTabInfo = function(queryParams) {
        var me = this;
        var config = this.config;
        if (config.param.depend) {
            config.param.tabs = eval("me.queryCondition._" + config.param.depend + ".getTabInfo()");
        }
        if ($.isNull(config.param.tabs) || config.param.tabs.length === 0) {
            $.error("Business.page() -- _getTabInfo -- config.param.tabs is null");
            return null;
        }

        var tabInfoArr = [];
        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
        for (var i = 0; i < config.param.tabs.length; i++) {
            var tabInfo = {};
            var tabConfig = config.param.tabs[i];

            tabInfo.queryParams = $.objClone(queryParams);
            // 多tab页不一样的参数统一放在数组diffTabInfoArr中，此处将其分配到每个tab页中
            if (queryParams.diffTabInfoArr) {
                tabInfo.queryParams = $.extend(tabInfo.queryParams, queryParams.diffTabInfoArr[i]);
                delete tabInfo.queryParams.diffTabInfoArr;
            }
            tabInfo.queryParams.module = config.module;
            tabInfo.queryParams.feature = config.feature;
            tabInfo.queryParams.type = tabConfig.type;
            tabInfo.queryParams.dbType = config.param.dbType;
            tabInfo.queryParams.transform = me._getTransformParam(tabConfig.type);

            var dataKeys = me._getDataKey(tabConfig.graphKey, tabConfig.type, tabInfo.queryParams);
            var tabInfoQueryParam = tabInfo.queryParams;

            tabInfo.reportConfig = {
                title: tabConfig["text_" + locale],
                exportName: tabConfig["text_en"],
                graphType: tabConfig.graphType,
                columnLabelRotation: parseInt(tabConfig.columnLabelRotation) || 0,
                graphIntegersOnly: tabConfig.graphIntegersOnly,
                graphDataKeys: dataKeys,
                gridColumns: me._getColumns(tabConfig.type, tabInfo.queryParams, dataKeys[0]),
                tabInfoQueryParam: tabInfoQueryParam,
                gridDbClickDrillFunc: tabConfig["gridDbClickDrillFunc"],
                gridDrillFunc: function(drillParams) {
                    var drillType = drillParams.type.value;
                    var columns;
                    var _tabInfoParamClone = $.objClone(this.tabInfoQueryParam);
                    if (drillType !== "xdr") {
                        columns = me._getColumns(drillType, this.tabInfoQueryParam, dataKeys[0]);
                        _tabInfoParamClone.transform = me._getTransformParam(drillType);
                    }
                    var counterArr = me._getCounters(tabConfig.type, _tabInfoParamClone);
                    var counterWithXdrTotalArr = [];
                    counterArr.forEach(function(obj, index, arr) {
                        if (obj.xdrTotal && "off" === obj.xdrTotal) {
                            counterWithXdrTotalArr.push(obj.name);
                        }
                    });

                    // 请求的参数中，不需要areaListObj，不删除导致请求过长报错
                    delete _tabInfoParamClone.areaListObj;
                    Business.functions.drillFunc(drillParams, _tabInfoParamClone, columns, counterWithXdrTotalArr);
                }
            };

            tabInfoArr.push(tabInfo);
        }
        return tabInfoArr;
    };

    Business.page.prototype._getDataKey = function(graphKey, type, queryParams) {
        var me = this;
        var config = me.config;

        var dataKeys = [];
        var dim = graphKey.split(",");
        var hasTransform = dim.some(function(item, index, arr) {
            return config.dim[item] && config.dim[item].transform;
        });
        if (hasTransform) {
            dataKeys.push("FORMAT_" + graphKey);
        } else {
            dataKeys.push(graphKey);
        }

        if (config.index) {
            var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
            for (var key in config.index) {
                dataKeys.push([key, config.index[key]["text_" + locale]]);
            };
            return dataKeys;
        }

        var counterArr = me._getCounters(type, queryParams);
        for (var i = 0; i < counterArr.length; i++) {
            dataKeys.push([counterArr[i].name, counterArr[i].text]);
        }
        return dataKeys;
    };

    Business.page.prototype._getTransformParam = function(type) {
        var me = this;
        var config = this.config;
        var dimArr = config.type[type].dims.split(",");
        if ($.isNull(dimArr)) {
            return null;
        }

        var transformParam = {};
        var dimName;
        var transform;
        for (var i = 0; i < dimArr.length; i++) {
            dimName = dimArr[i];
            transform = config.dim[dimName].transform;
            if ($.isNull(transform)) {
                continue;
            }

            if ($.isNull(transformParam[transform])) {
                transformParam[transform] = dimName;
            } else {
                transformParam[transform] = transformParam[transform] + "," + dimName;
            }
        }

        // couter也支持配置transform
        var counterArr = config.type[type].counters;
        var counterName;
        for (var i = 0; i < counterArr.length; i++) {
            counterName = counterArr[i].name;
            transform = counterArr[i].transform || "";
            if ($.isNull(transform)) {
                continue;
            }

            if ($.isNull(transformParam[transform])) {
                transformParam[transform] = counterName;
            } else {
                transformParam[transform] = transformParam[transform] + "," + counterName;
            }
        }

        return transformParam;
    };

    Business.page.prototype._getColumns = function(type, queryParams, time) {
        var me = this;
        var config = this.config;

        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";

        var columnArr = [];
        var column;
        var dimArr = config.type[type].dims.split(",");
        var startTime = "";
        var areaName = "";

        if (time) {
            startTime = $.objClone(time).split(",")[0];
            areaName = $.objClone(time).split(",")[1];
        }

        if (!$.isNull(dimArr)) {
            var dimName;
            var dimText;
            var depend;
            for (var i = 0; i < dimArr.length; i++) {
                dimName = dimArr[i];
                depend = config.dim[dimName].depend;
                if ($.isNull(depend)) {
                    dimText = config.dim[dimName]["text_" + locale];
                } else {
                    if ($.isNull(config.dim[dimName][queryParams[depend]])) {
                        continue;
                    }
                    dimText = config.dim[dimName][queryParams[depend]]["text_" + locale];
                }

                var name = $.isNull(config.dim[dimName].transform) ? dimName : "FORMAT_" + dimName;
                //DTS2014072300898
                var sortable = (false === config.dim[dimName].sortable || "false" === config.dim[dimName].sortable) ? false : true;
                //过滤可配置，不配置默认为可过滤，DTS2014081202140
                var filter = (false === config.dim[dimName].filter || "false" === config.dim[dimName].filter) ? false : true;
                var filterType = "list";
                var filterList = null;
                if (name === "STARTTIME" || name === "FORMAT_STARTTIME") {
                    filterType = "date";
                }

                column = {
                    name: name,
                    header: dimText,
                    tooltip: dimText,
                    height: 30,
                    sortable: sortable,
                    dataType: "string",
                    filter: filter,
                    filterType: filterType,
                    hidden: false,
                    tip: true
                };
                columnArr.push(column);
            }
        }

        var counterArr = me._getCounters(type, queryParams);
        if (!$.isNull(counterArr)) {
            var counter;
            var drillTypeArr;
            for (var i = 0; i < counterArr.length; i++) {
                counter = counterArr[i];
                column = {
                    name: counter.name,
                    header: counter.text,
                    tooltip: counter.text,
                    height: 30,
                    sortable: counter.sortable,
                    dataType: "number",
                    filter: counter.filter,
                    filterType: "number",
                    transform: counter.transform,
                    hidden: (true === counter.hidden || "true" === counter.hidden) ? true : false,
                    tip: true
                };
                // 如果存在隐藏counter，在columns设置属性记录，表格创建时增加counterCheckBox
                if ((!columnArr.counterHiddened) && counter.hidden) {
                    columnArr.counterHiddened = counter.hidden;
                }

                if ($.isNotNull(counter.drillType)) {
                    column.menus = [];
                    drillTypeArr = counter.drillType.split(",");
                    for (var j = 0; j < drillTypeArr.length; j++) {
                        column.menus.push({
                            value: drillTypeArr[j],
                            text: config.drillType[drillTypeArr[j]]["text_" + locale]
                        });
                    }

                }
                if (counter["unDrillDatas"]) {
                    var _tempUnDrillDatas = [];
                    column["unDrillDatas"] = JSON.parse(counter["unDrillDatas"]);
                    //转化成字符串
                    if ($.isArray(column["unDrillDatas"]) && column["unDrillDatas"].length > 0) {
                        for (var j = 0; j < column["unDrillDatas"].length; j++) {
                            _tempUnDrillDatas.push("" + column["unDrillDatas"][j]);
                        }
                        column["unDrillDatas"] = _tempUnDrillDatas;
                    } else {
                        delete counter["unDrillDatas"];
                    }
                }
                columnArr.push(column);
            }
        }
        return columnArr;

    };

    Business.page.prototype._getCounters = function(type, queryParams) {
        var me = this;
        var config = this.config;

        var counterArr = config.type[type].counters;
        if ($.isNull(counterArr) || counterArr.length === 0) {
            $.error("Business.page() -- _getCounters -- counterArr is null,type is " + type);
            return null;
        }

        var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
        var counterName, depend, resultCounter = [];
        for (var i = 0; i < counterArr.length; i++) {
            counterName = counterArr[i].name;
            depend = config.counter[counterName].depend;
            if ($.isNull(depend)) {
                counterArr[i].text = config.counter[counterName]["text_" + locale];
            } else {
                if ($.isNull(config.counter[counterName][queryParams[depend]])) {
                    continue;
                }
                counterArr[i].text = config.counter[counterName][queryParams[depend]]["text_" + locale];
            }

            //排序可配置，不配置默认为可排序，DTS2014072300898
            if (false === config.counter[counterArr[i].name]["sortable"] ||
                "false" === config.counter[counterArr[i].name]["sortable"]) {
                counterArr[i].sortable = false;
            } else {
                counterArr[i].sortable = true;
            }

            //过滤可配置，不配置默认为可过滤，DTS2014081202140
            if (false === config.counter[counterArr[i].name]["filter"] ||
                "false" === config.counter[counterArr[i].name]["filter"]) {
                counterArr[i].filter = false;
            } else {
                counterArr[i].filter = true;
            }

            resultCounter.push(counterArr[i]);
        }
        return resultCounter;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.page.prototype.destroy = function() {

    };

})();
/**
 * 查询模板公有化、私有化模板处理
 */
var queryModel = {}

//国际化
var res = BusinessI18N.comm;
var reader = new Sweet.Reader.JsonReader();
var store = new Sweet.Store.GridStore({
    baseParams: {},
    reader: reader,
    cache: true,
    isRequest: false
});

/**
 * 去除数组中的重复数据
 * @param {Array} arr
 */
queryModel.deleteRepeatArr = function(arr) {
    var tempRaw = {};
    for (var k = 0; k < arr.length; k++) {
        tempRaw[arr[k].text] = arr[k];
    }
    var finaltemp = [];
    for (var rawkey in tempRaw) {
        if (rawkey) {
            finaltemp.push(tempRaw[rawkey]);
        }
    }
    return finaltemp;
};

/**
 * 处理过滤
 */
queryModel.addmenu = function(data) {
    var columns = data.columns;
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].filterType == "list") {
            var arr = [];
            data.data.forEach(function(c) {
                var columnName = columns[i].name;
                var listChilden = {
                    text: c[columnName],
                    value: c[columnName]
                };
                arr.push(listChilden);
            });
            arr = queryModel.deleteRepeatArr(arr);
            columns[i].filterList = arr;
        }
    };
};
queryModel.text = function(row) {
    var data = queryModel.contents.getRowValue(row)
    queryModel.confirmBox = new Sweet.Dialog.confirm({
        width: 330,
        height: 130,
        message: res.confirmDel,
        listeners: {
            "ok": function(event) {
                queryModel.removeCondition(data);
            }
        }
    });
}

queryModel.operationColumn = function(info) {
    if (info.data == "1") {
        var row = info.row;
        return "<span class='query-template-delete-icon' onclick=queryModel.text(" + row + ")></span>";
    } else if (info.data == "0") {
        return "<span class='query-template-delete-gray-icon'></span>";
    }
};

//列头配置
var gridData = {
    columns: [{
        header: res.templateName,
        name: "templateName",
        filter: true,
        enableHdMenu: false,
        filterType: 'list',
        height: 30,
        tooltip: res.templateName,
        dataType: "string",
        tip: true
    }, {
        header: res.templateOwner,
        name: "userName",
        height: 30,
        filter: true,
        enableHdMenu: false,
        filterType: 'list',
        dataType: "string",
        tooltip: res.templateOwner,
        tip: true
    }, {
        header: res.templateType,
        name: "templateType",
        height: 30,
        filter: true,
        enableHdMenu: false,
        filterType: 'list',
        dataType: "string",
        tooltip: res.templateType,
        tip: true
    }, {
        header: "filter",
        name: "filter",
        dataType: "string",
        hidden: true,
        hiddenForever: true
    }, {
        header: res.operation,
        name: "isDelete",
        height: 30,
        width: res.operationWidth,
        tooltip: res.operation,
        renderer: queryModel.operationColumn
    }],
    data: []
};

/**
 * 保存记录
 * @param item
 * @private
 */
queryModel.saveCondition = function(template, type_p, params, filter) {
    var res;
    var url = basePath + "templateManageController/saveQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId: params.moduleId,
        filter: filter,
        templateName: template,
        templateType: type_p
    };
    var callback = function(data) {
        res = data;
    }
    queryModel._request(url, param, callback);
    return res;
};

/**
 * 删除一条记录
 * @param item
 * @private
 */
queryModel.removeCondition = function(item) {
    var url = basePath + "templateManageController/deleteQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId: queryModel.config.moduleId,
        templateName: item.templateName,
        templateType: item.template_type,
        templateOwner: item.userName
    };
    var callback = function(data) {
        if ("0" == data.resultCode) {
            var templateNames = queryModel.getCurrentUserServiceQuerys(queryModel.config.moduleId, false);
            gridData.data = templateNames;
            queryModel.addmenu(gridData);
            store.loadData(gridData);
            queryModel.okButton.setDisabled(true);
        }
    }
    queryModel._request(url, param, callback);
};

/**
 *查询当前用户当前业务所拥有模板
 */
queryModel.getCurrentUserServiceQuerys = function(pageId, isLast) {
    var result = [];
    var url = basePath + "templateManageController/getQueryTemplateList.action";
    var param = {
        businessType: "NPM",
        isLast: isLast,
        moduleId: pageId
    };
    var callback = function(data) {
        result = data;
    }
    queryModel._request(url, param, callback);
    return result;
}

/**
 * 检查模板名称的合法性
 */
queryModel.checkTemplateName = function(event, data) {
    var charRe = /^[\u0391-\uFFE5\w@#~\-_\(\)\[\] !\.]*$/;
    ch = data.text;
    // 用户输入的参数
    if (!charRe.test(ch)) {
        // 出现提示
        return {
            "success": false,
            "message": res.noInput
        };
    }
    // 模板的名称不能空
    if (0 === ch.length) {
        // 出现提示
        return {
            "success": false,
            "message": res.templateNameNotNull
        };
    }
    return {
        "success": true,
        "message": ""
    };
};

/**
 *查询模板保存界面
 */
queryModel.saveTemplate = function(params, filter) {
    if (queryModel.sweetWnd3) {
        queryModel.sweetWnd3.destroy();
    }

    //模板名称校验
    var type_p = "public";
    var valueTextName = new Sweet.form.TextField({
        errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
        maxLength: 32,
        width: 270,
        label: true,
        labelWidth: 105,
        labelText: res.template_Name,
        emptyText: res.pleaseInput, // "请输入",
        validateFun: {
            eventName: "blur",
            params: {
                "maxLength": 32
            },
            fun: queryModel.checkTemplateName
        }
    });
    //单选组		
    var radioData = [{
        text: res.privates,
        value: "private",
        data: null,
        checked: false
    }, {
        text: res.publics,
        value: "public",
        data: null,
        checked: true
    }];
    var sweetRadioGroup = new Sweet.form.RadioGroup({
        width: "80%",
        height: 30,
        data: radioData,
        tip: true
    });

    sweetRadioGroup.addListener("click", function(event, val) {
        type_p = val.value.value;
    });

    var panel_radio_H = new Sweet.panel.HPanel({
        width: "100%",
        height: 50,
        items: [sweetRadioGroup],
        itemExtend: false,
        align: "center", // left,center,right
        verticalAlign: "middle", // top,middle,bottom
        header: false,
        collapsible: false
    });

    //组装弹出框内容
    var sweetVPanel = new Sweet.panel.VPanel({
        widgetClass: "sweet-panel-vpanel-example",
        width: "99%",
        height: 180,
        items: [valueTextName, panel_radio_H]
    });

    var cancelButton = new Sweet.form.Button({
        value: {
            text: res.cancel
        }
    });
    cancelButton.addListener("click", function(event, data) {
        queryModel.sweetWnd3.close();
    });
    var saveButton = new Sweet.form.Button({
        value: {
            text: res.save
        }
    });
    saveButton.addListener("click", function(event, data) {
        var isvalidata = sweetVPanel.validateForm();
        // 用户输入的参数, 模板名称的长度不能大于80个字符
        if (!isvalidata) {
            // 出现提示
            return false;
        }
        var templateName = valueTextName.getValue().value;

        var templateNames = queryModel.saveCondition(templateName, type_p, params, filter);
        if ("1" == templateNames.resultCode) {
            Sweet.Msg.error(templateNames.resultDesc);
            return false;
        };
        queryModel.sweetWnd3.close();
        Sweet.Msg.success(res.saveTemplateSuccMsg);
    });

    //弹出框
    queryModel.sweetWnd3 = new Sweet.Window({
        width: 300,
        height: 150,
        title: res.saveTemplate, // "Templet Selected",
        content: sweetVPanel,
        buttons: [saveButton, cancelButton]
    });

    queryModel.sweetWnd3.show();
}

queryModel.getQueryModel = function(params) {
    queryModel.config = params.config;
    if (queryModel.sweetWnd2) {
        queryModel.sweetWnd2.destroy();
    }
    //导入界面grid模板
    queryModel.contents = new Sweet.grid.Grid({
        width: "100%",
        height: "100%",
        store: store,
        data: {
            singleSelect: true,
            resizable: true
        }
    });

    //表格单元格点击事件
    queryModel.contents.addListener("cellClick", function(event, data) {
        queryModel.baseDrillData = data;
        queryModel.okButton.setDisabled(false);
    });
    //表格双击事件
    queryModel.contents.addListener("rowDblClick", function(event, data) {
        params.filterQuery(queryModel.baseDrillData.rowData.filter);
        queryModel.sweetWnd2.close();
    });
    var templateNames = queryModel.getCurrentUserServiceQuerys(queryModel.config.moduleId, false);
    gridData.data = templateNames;
    queryModel.addmenu(gridData);
    store.loadData(gridData);

    var cancelButton = new Sweet.form.Button({
        value: {
            text: res.cancel
        }
    });
    cancelButton.addListener("click", function(event, data) {
        queryModel.sweetWnd2.close();
    });
    queryModel.okButton = new Sweet.form.Button({
        value: {
            text: res.OK
        }
    });
    queryModel.okButton.setDisabled(true);
    queryModel.okButton.addListener("click", function(event, data) {
        if (queryModel.baseDrillData) {
            params.filterQuery(queryModel.baseDrillData.rowData.filter);
            queryModel.sweetWnd2.close();
        } else {
            Sweet.Msg.warn(res.checkTemplate);
        }
    });
    //弹出框
    queryModel.sweetWnd2 = new Sweet.Window({
        width: 530,
        height: 300,
        title: res.importTemplate,
        content: queryModel.contents,
        buttons: [queryModel.okButton, cancelButton]
    });
    queryModel.sweetWnd2.show();
}

/**
 *最后一次查询模板保存
 */
queryModel.lastQuery = function(pageId, filter) {
    var url = basePath + "templateManageController/saveLastQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId: pageId,
        filter: filter
    };
    var callback = function(data) {
        if ("1" == data.resultCode) {
            $.log('save last query error！')
        }
    }
    queryModel._request(url, param, callback);
};

/**
 * 数据请求
 * @param url
 * @param param
 * @param mask
 * @param callback
 * @private
 */
queryModel._request = function(url, param, callback, async) {
    if (!async) {
        async = false
    };
    Sweet.Ajax.request({
        url: url,
        contentType: "application/json;chartset=UTF-8",
        data: JSON.stringify(param),
        dataType: "json",
        async: async,
        timeout: 300000,
        success: function(data) {
            if ($.isFunction(callback)) {
                callback(data);
            }
        },
        error: function(XMLHttpRequest, status, errorThrown) {
            $.error(url);
            $.error("Get data error. XMLHttpRequest = " + XMLHttpRequest + ", error = " + errorThrown);
        }
    });
}

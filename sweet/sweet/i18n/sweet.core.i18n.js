/**
 * @fileOverview sweet core组件国际化资源
 * @date 2012/12/13
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */
(function() {
    var ZHCN = "zh_CN",
        ENUS = "en_US";
    // 国际化资源
    global = this;
    if (typeof I18N === "undefined") {
        global.I18N = {};
    }

    I18N.core = {};

    // 中文
    I18N.core[ZHCN] = {
        // 月
        month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        // 周
        week: ["一", "二", "三", "四", "五", "六", "日"],
        // 日期组件
        date: {
            time: "时间",
            okButton: "确定",
            formatCheckTip: "请输入正确的时间格式："
        },
        // dialog对话框
        dialog: {
            prompt: "提示",
            alert: "注意",
            success: "成功",
            error: "错误",
            confirm: "确认",
            warn: "警告",
            ok: "确定",
            cancel: "取消"
        },
        // 容器
        container: {
            save : "保存",
            prev: "上一步",
            next: "下一步",
            done: "完成"
        },
        // 树
        tree: {
            info: "提示告警",
            warn: "紧急告警",
            search: "搜索",
            clickLoad:"点击加载更多",
            clickLoadOver:"数据全部加载完成",
            nodeName: "节点",
            add: "增加",
            "delete": "删除",
            edit: "编辑"
        },
        // 图表
        chart: {
            unit: "单位: ",
            meter: {
                name: "名称",
                value: "当前值",
                major: "紧急阀值",
                minor: "提示阀值",
                min: "最小值",
                max: "最大值"
            },
            view : "视图",
            legend: "隐藏图例",
            balloon : "只显示一个提示",
            zoom : "缩放",
            noDataTips: "无数据"
        },
        // 计算器
        calculator: {
            title: "公式:",
            button: "清除公式",
            tip: "不合法的输入！",
            emptyText: "请输入！……"
        },
        // 表格
        grid: {
            pageRow: "每页{0}行",
            text: "共计:{0}条记录",
            prev: "上一页",
            next: "下一页",
            go: "跳转",
            hideCol: "隐藏该列",
            filter: "过滤",
            exactMatch: "精确匹配",
            fuzzyMatch: "模糊匹配",
            notEqual: "不等于",
            eqNull: "为空",
            notNull: "非空",
            from: "从",
            to: "至",
            okBtn: "确认",
            resetBtn: "重置",
            clearSingleFilter : "清除过滤",
            selectCol: "列选择",
            multiSort: "多列组合排序",
            secondStat: "二次统计",
            clearFilter: "清除所有过滤",
            qClearFilter: "确定要清除所有过滤吗？",
            "export": "导出",
            "delete": "删除",
            edit: "编辑",
            modify: "修改",
            close: "关闭",
            pause: "暂停",
            start: "启动",
            reset: "复位",
            detail: "详情",
            confirm : "确认",
            SN : "序号",
            validate: {
                beginDate: "请输入开始时间！",
                endDate: "请输入结束时间！",
                compare: "开始时间必须早于结束时间！"
            },
            multiSortWin: {
                winWidth: 450,
                comboLabelWidth: "30%",
                comboWidth: 280,
                radioWidth: 120,
                title: "列排序设置",
                asc: "升序",
                desc: "降序",
                firstSort: "第一排序列",
                secondSort: "第二排序列",
                thirdSort: "第三排序列",
                firstNoSelectTip: "请选择第一排序列，排序方式。",
                secondNoSelectTip: "请选择第二排序列，排序方式。",
                thirdNoSelectTip: "请选择第三排序列，排序方式。"
            }
        },
        // 遮罩
        mask: {
            loading: "加载中...",
            second: "秒"
        },
        //下拉框
        combobox: {
            pleaseCheck: "请选择...",
            pleaseSelect: "请选择",
            checkAll: "全选"
        },
        // Tab布局
        tab: {
            menu: {
                closeCurrent: "关闭标签",
                closeOthers: "关闭其它标签",
                closeAll: "关闭所有标签"
            }
        },
        // tip默认提示内容
        tip: {
            EMPTY_TITLE: "不能为空。",
            HEX_TIP_TITLE: "请输入合法的十六进制数！",
            IP_TIP_TITLE: "请输入合法的IP地址！",
            NUMBERFEILD_MAX_TIP: "允许输入的最大数值：",
            NUMBERFEILD_MIN_TIP: "允许输入的最小数值：",
            LENGTH_RANGE_1: "字符长度范围应该在",
            LENGTH_RANGE_2: "~",
            LENGTH_RANGE_3: "之间！"
        },
        // listbox
        listbox: {
            clearAll: "清空",
            close: "关闭"
        },
        //（需要重新翻译）
        labelImage: {
            setting: "设置",
            // 修改问题单：DTS2013072607353
            plus: "添加",
            add: "添加",
            minus: "删除",
            delete:"删除",
            save : "保存",
            import : "导入",
            export : "导出",
			print : "打印",
            lock: "锁定",
            unlock: "未锁定",
            reset: "重置"
        },
        // 导出
        exportType: {
            csv: "CSV",
            pdf: "PDF",
            xls: "Excel"
        },
        // 文件上传
        fileUpload:{
            browse:"浏览",
            importType:"导入方式",
            appendImport:"追加式导入",
            overWriteImport:"覆盖式导入"
        },
        // 文件上传窗口
        fileUploadWin:{
            title:"文件上传",
            fileName:"文件名"
        },
        // list组件
        list: {
            total: "总数",
            selected: "已选",
            minRemains: "最少选择{0}个。",
            maxRemains: "最多选择{0}个。"
        },
        map:{
            layer:"层级：",
            areaName:"区域："
        },
        widgetPanel: {
            refresh: "刷新",
            setting: "设置",
            close: "删除"
        },
        stateItem: {
            plus: "新增",
            "delete": "删除", 
            check: "设置默认",
            headerText: "状态",
            stateText: "状态"
        }
    };

    // 英文
    I18N.core[ENUS] = {
        // 月
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        // 周
        week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        // 日期组件
        date: {
            time: "Time",
            okButton: "OK",
            formatCheckTip: "Please specify the time in correct format: "
        },
        // dialog对话框
        dialog: {
            prompt: "Prompt",
            alert: "Alert",
            success: "Success",
            error: "Error",
            confirm: "Confirm",
            warn: "Warning",
            ok: "OK",
            cancel: "Cancel"
        },
        // 容器
        container: {
            save : "Save",
            prev: "Previous",
            next: "Next",
            done: "Finish"
        },
        // 树
        tree: {
            info: "Warning",
            warn: "Major",
            search: "Search",
            clickLoad: "Click here to load more data",
            clickLoadOver:"Data loading is complete.",
            nodeName: "Node",
            add: "Add",
            "delete": "Delete",
            edit: "Edit"
        },
        // 图表
        chart: {
            unit: "Unit: ",
            meter: {
                name: "Name",
                value: "Value",
                major: "Major",
                minor: "Minor",
                min: "Min",
                max: "Max"
            },
            view : "View",
            zoom : "Zoom",
            legend: "Hide Legend",
            balloon : "Only One Balloon",
            noDataTips: "No data"
        },
        // 计算器
        calculator: {
            title: "Formula: ",
            button: "Clear",
            tip: "Invalid value!",
            emptyText: "entry text……"
        },
        // 表格
        grid: {
            pageRow: "{0} rows/page",
            text: "Total:{0} records",
            prev: "Previous",
            next: "Next",
            go: "Go",
            hideCol: "Hide Column",
            filter: "Filter",
            exactMatch: "Exact match",
            fuzzyMatch: "Fuzzy match",
            notEqual: "Not equal",
            eqNull: "Is null",
            notNull: "Not null",
            from: "From",
            to: "To",
            okBtn: "OK",
            resetBtn: "Reset",
            clearSingleFilter : "Clear",
            selectCol: "Select Column",
            multiSort: "Multi-column Sorting",
            secondStat: "Secondary Statistics",
            clearFilter: "Clear All Filters",
            qClearFilter: "Are you sure to clear all filters?",
            "export": "Export",
            "delete": "Delete",
            edit: "Edit",
            modify: "Modify",
            close: "Close",
            pause: "Pause",
            start: "Start",
            reset: "Reset",
            detail: "Details",
            confirm : "Confirm",
            SN : "SN",
            validate: {
                beginDate: "Please input the start time.",
                endDate: "Please input the end time.",
                compare: "The start time should be earlier than the end time."
            },
            multiSortWin: {
                winWidth: 650,
                comboLabelWidth: "45%",
                comboWidth: 350,
                radioWidth: 250,
                title: "Column Sorting Setup",
                asc: "Ascending Order",
                desc: "Descending Order",
                firstSort: "First Sorting Column",
                secondSort: "Second Sorting Column",
                thirdSort: "Third Sorting Column",
                firstNoSelectTip: "Please select the first sorting column and sorting mode.",
                secondNoSelectTip: "Please select the second sorting column and sorting mode.",
                thirdNoSelectTip: "Please select the third sorting column and sorting mode."
            }
        },
        // 遮罩
        mask: {
            loading: "Loading...",
            second: "s"
        },
        //下拉框
        combobox: {
            pleaseCheck: "Please select…",
            pleaseSelect: "Please select",
            checkAll: "All"
        },
        // Tab布局
        tab: {
            menu: {
                closeCurrent: "Close Current Tab",
                closeOthers: "Close Other Tabs",
                closeAll: "Close All Tabs"
            }
        },
        // tip默认提示内容（需要重新翻译）
        tip: {
            EMPTY_TITLE: "This value cannot be empty.",
            HEX_TIP_TITLE: "Please enter a valid hexadecimal number.",
            IP_TIP_TITLE: "Please enter a valid IP address.",
            NUMBERFEILD_MAX_TIP: "Maximum value allowed: ",
            NUMBERFEILD_MIN_TIP: "Minimum value allowed: ",
            LENGTH_RANGE_1: "The length must be ",
            LENGTH_RANGE_2: " to ",
            LENGTH_RANGE_3: " characters."
        },
        // listbox
        listbox: {
            clearAll: "Clear",
            close: "Close"
        },
        //（需要重新翻译）
        labelImage: {
            setting: "Setting",
            // 修改问题单：DTS2013072607353
            plus: "Add",
            add: "Add",
            minus: "Delete",
            delete:"Delete",
            save : "Save",
            import : "Import",
            export : "Export",
			print : "Print",
            lock: "Lock",
            unlock: "Unlock",
            reset: "ReSet"
        },
        // 导出
        exportType: {
            csv: "CSV",
            pdf: "PDF",
            xls: "Excel"
        },
        // 文件上传
        fileUpload:{
            browse:"Browse",
            importType:"Import Mode",
            appendImport:"Appended",
            overWriteImport:"Overwritten"
        },
        // 文件上传窗口
        fileUploadWin:{
            title:"Upload File",
            fileName:"File Name"
        },
        // list组件
        list: {
            total: "Total",
            selected: "Selected",
            minRemains: "At least {0} of them must be selected.",
            maxRemains: "A maximum of {0} of them can be selected."
        },
        map:{
            layer:"Level:",
            areaName:"Area:"
        },
        widgetPanel: {
            refresh: "Refresh",
            setting: "Setting",
            close: "Remove"
        },
        stateItem: {
            plus: "Add",
            "delete": "Delete", 
            check: "Set as default",
            headerText: "State",
            stateText: "state"
        }
    };
})();

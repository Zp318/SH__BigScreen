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

        timeRange : {
            timeRange : "时间范围",
            interval : "粒度",
            interval_86400 : "天",
            interval_3600 : "1 小时",
            interval_900 : "15 分钟",

            timeStoreMsg : "系统可以提供{0}起始的数据查询。",
            finalTimeMsg : "终止时间输入有误。",

            size : {
                timeLableWidth : 75,
                intervalLableWidth : 50,
                intervalWidth : 144
            }
        },

        area : {
            labelText : "区域",
            listWindowLeftTitle : "选择项",
            listWindowRightTitle : "已选择",
            cell : "CGI/SAI",
            officDirection : "局向",
            pleaseSelect : "请选择…",
            selectCell : "选择小区",
            selectTopN : "选择Top N",
            allText : "全选",
            pleaseSelectArea : "请选择区域！",
            notEmpty :  "不能为空。",
            onlyChartNum : "只能为数字或0-9,a-z,A-Z的组合.",
            source : "源:",
            destination : "目的:",
            size : {
                lableWidth : 75
            }
        },

        more : {
            windowTitle : "更多",
            indicator : "指标",
            add : "添加",
            delete : "删除",
            selectKpi : "请选择指标！"
        },

        queryCondition : {
            query : "查询"
        },

        gridDrill : {
            "cdrDrill" : "CDR详单记录",
            "failercauseDrill" : "失败原因分析",
            "hocauseDrill" : "切换原因分析"
        },

        line : {
            chartDisplay : "图表展示",
            selectObject : "选择对象",
            indexLabelText : "指标",
            selectPeriod: "选择周期",
            multiObject: "多对象对比",
            history: "历史趋势",
            timeDate: [[1,'一天前'],[2,'两天前'],[3,'三天前'],[4,'四天前'],[5,'五天前'],[6,'六天前'],[7,'七天前']],
            currentPeriod : "本周期",
            size: {
                objBoxWidth : 324,
                objBoxLabelWidth : 74,
                indexWidth : 300,
                indexLabelWidth : 50,
                periodWidth : 324,
                periodLabelWidth : 74,
                radioWidth : 200

            }
        },

        grid : {
            gridDisplay : "报表详情",
            counterTool : "次数",
            sn : "序号"
        },

        conditionManage : {
            queryConditionHistory : "选择查询条件",
            queryConditionSave : "保存查询条件",
            queryConditionLast : "最后一次查询",
            inputTemplateName : "请输入模板名称：",
            save : "保存",
            ok : "确认",
            delete : "删除",
            noInput : "只能输入字母、数字、汉字、下划线或中划线！",
            saveTempletError : "保存模板失败！",
            deleteTempletTips : "您确定要删除模板\"" + "{0}" + "\"吗？"
        },

        failCause : {
            //失败原因页面标题中文国际化
            baseTitle : "失败原因分析",
            tabelName : "信令详单",
            
            //失败原因类表双饼图中文国际化
            leftPieTitle : "失败原因归属占比",
            rightPieTitle : "失败原因占比"
        }
    };
    

    // 英文
    BusinessI18NEN.cmp = {
        
        timeRange : {
            timeRange : "Time Period",
            interval : "Interval",
            interval_86400 : "Day",
            interval_3600 : "1 Hour",
            interval_900 : "15 Minutes",

            timeStoreMsg : "The earliest start date for this data query is {0}.",
            finalTimeMsg : "The end time input error.",

            size : {
                timeLableWidth : 90,
                intervalLableWidth : 66,
                intervalWidth : 165
            }
        },

        area : {
            labelText : "Area",
            listWindowLeftTitle : "Options",
            listWindowRightTitle : "Selected",
            cell : "CGI/SAI",
            officDirection : "Office Direction",
            pleaseSelect : "Please select…",
            selectCell : "Select CGI/SAI",
            selectTopN : "Select Top N",
            allText : "All",
            pleaseSelectArea : "Please select the Area!",
            notEmpty :  " cannot be empty.",
            onlyChartNum : "It can only be a number or a combination of 0-9,a-z,A-Z.",
            source : "Source:",
            destination : "Destination:",
            size : {
                lableWidth : 90
            }
        },

        more : {
            windowTitle : "Select KPI",
            indicator : "Indicator",
            add : "Add",
            delete : "Delete",
            selectKpi : "Please select the Indicator!"
        },

        queryCondition : {
            query : "Query"
        },

        gridDrill : {
            "cdrDrill" : "CDR Details",
            "failcauseDrill" : "Failure Analysis",
            "hocauseDrill" : "Handover Cause Analysis"
        },

        line : {
            chartDisplay : "Chart Display",
            selectObject : "Select Object",
            indexLabelText : "Indicator",
            selectPeriod: "Select Period",
            multiObject: "Multi-Object Comparison",
            history: "History Comparison",
            timeDate: [[1,'1 day ago'],[2,'2 days ago'],[3,'3 days ago'],[4,'4 days ago'],[5,'5 days ago'],[6,'6 days ago'],[7,'7 days ago']],
            currentPeriod: "Current period",
            size: {
                objBoxWidth : 325,
                objBoxLabelWidth : 100,
                indexWidth : 300,
                indexLabelWidth : 75,
                periodWidth : 325,
                periodLabelWidth : 100,
                radioWidth : 350
            }
        },

        grid : {
            gridDisplay : "Report Details",
            counterTool : "Counter",
            sn : "SN"
        },

        conditionManage : {
            queryConditionHistory : "Select Query Conditions",
            queryConditionSave : "Save Query Conditions",
            queryConditionLast : "Last Query",
            inputTemplateName : "Please enter template name：",
            save : "Save",
            ok : "OK",
            delete : "Delete",
            noInput : "Only English letters, digits (0-9), underlines (_) and hyphens (-) are allowed.",
            saveTempletError : "Failed to save the template.",
            deleteTempletTips : "Are you sure you want to delete the template \"" + "{0}" + "\"?"
        },
        
        failCause : {
            //失败原因页面标题英文国际化
            baseTitle : "Failure Analysis",
            tabelName : "Signaling Records",
            
            //失败原因类表双饼图英文国际化
            leftPieTitle : "Cause Category",
            rightPieTitle : "Cause Analysis"
        }
    };
    BusinessI18NZH.comm = {
        noInput:"输入模板名称不正确，请重新输入！支持 ! @ # ~ - _ ( ) [ ] . 字母 数字 中文 空格。",
        noInputLength:"模板名称的长度不能大于" + "{0}" + "个字符！",
        templateNameNotNull:"请输入模板名称！",
        template_Name:"模板名称",
        pleaseInput:"请输入...",
        privates:"个 人",
        publics:"公 共",
        saveTemplateSucc:"成功",
        saveTemplateSuccMsg:"模板保存成功.",
        saveTemplate:"保存模板",
        operation:"操作",
        operationWidth:50,
        importTemplate:"载入模板",
        templateName:"名称",
        templateType:"类型",
        templateOwner:"创建者",
        confirmDel:"确定要删除已选定的模板吗？",
        checkTemplate:"请选择模板！",
        cancel:"取消",
        OK:"确定",
        save:"保存"
    };
    BusinessI18NEN.comm = {
        noInput:"The template name is incorrect,please enter again.Support ! @ # ~ - _ () [] . space and alphanumeric.",
        noInputLength:"The length of the template name cannot exceed " + "{0}" + " characters!",
        templateNameNotNull:"Please enter the template name!",
        template_Name:"Template Name",
        pleaseInput:"Please enter...",
        privates:"private",
        publics:"public",
        saveTemplateSucc:"Success",
        saveTemplateSuccMsg:"Template saved successfully.",
        saveTemplate:"Save Template",
        operation:"Operator",
        operationWidth:80,
        importTemplate:"Load Template",
        templateName:"Name",
        templateOwner:"Creator",
        templateType:"Type",
        confirmDel:"Are you sure to delete the template you selected?",
        checkTemplate:"please select a template！",
        cancel:"Cancel",
        save:"Save",
        OK:"OK"
    };

})();

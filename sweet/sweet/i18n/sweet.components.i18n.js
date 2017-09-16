/**
 * @fileOverview sweet components组件国际化资源
 * @date 2012/12/13
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */
(function () {
    var ZHCN = "zh_CN",
        ENUS = "en_US";
    I18N.cmp = {};

    // 中文
    I18N.cmp[ZHCN] = {
        holiday : "节假日",
        timeSchedule : {
            buttonText : "忙时"
        },
        stat : {
            // 统计
			calculation_msg : "统计",
			// 确定
			confirm_msg : "确定",
			// 取消
			cancel_msg : "取消",
			// 总数
			total_msg : "计数",
			// 删除
			delete_msg : "删除",
			// 最大值
			max_msg : "最大值",
			// 最小值
			min_msg : "最小值",
			// 求和
			sum_msg : "求和",
			// 平均
			average_msg : "平均",
			// 二次统计
			secondary_statistics_msg : "二次统计",
			// 指标
			indicators_msg : "指标",
			// 统计项
			statistics_item_msg : "统计项",
			// 待选分析维度
			analysis_dimensions_msg : "待选分析维度",
			// 已选分析维度
			selected_analysis_dimensions_msg : "已选分析维度",
			// 统计
			statistics_msg : "统计",
			// 请选择指标
			select_indicators_msg : "请选择指标！",
			// 请选择分析维度
			analysis_dimension_msg : "请选择分析维度！",
			// 提示
			prompt_msg : "提示"
        },
        officeDirection:{
            sourceCombLabel:"源",
            destinationCombLabel:"目的",
            optionsMsg:"选择项",
            selectedMsg:"已选择"

        },
        listWindow:{
            fromTitle:"选择项",
            toTitle:"已选择"

        }
    };
    
    // 英文
    I18N.cmp[ENUS] ={
        holiday : "节假日",
        timeSchedule : {
            buttonText : "Time Schedules"
        },
        stat : {
            // 统计
			calculation_msg : "Calculate",
			// 确定
			confirm_msg : "Confirm",
			// 取消
			cancel_msg : "Cancel",
			// 总数
			total_msg : "Count",
			// 删除
			delete_msg : "Delete",
			// 最大值
			max_msg : "Maximum",
			// 最小值
			min_msg : "Minimum",
			// 求和
			sum_msg : "Sum",
			// 平均
			average_msg : "Average",
			// 二次统计
			secondary_statistics_msg : "Secondary statistics",
			// 指标
			indicators_msg : "Indicator",
			// 统计项
			statistics_item_msg : "Statistic",
			// 待选分析维度
			analysis_dimensions_msg : "Analysis dimensions",
			// 已选分析维度
			selected_analysis_dimensions_msg : "Selected analysis dimensions",
			// 统计
			statistics_msg : "Statistics",
			// 请选择指标
			select_indicators_msg : "Please select indicator!",
			// 请选择分析维度
			analysis_dimension_msg : "Select the analysis dimension!",
			// 提示
			prompt_msg : "Reminder"
        },
        officeDirection:{
            sourceCombLabel:"Source",
            destinationCombLabel:"Destination",
            optionsMsg:"Options",
            selectedMsg:"Selected"
        },
        listWindow:{
            fromTitle:"Options",
            toTitle:"Selected"

        }
    };
})();

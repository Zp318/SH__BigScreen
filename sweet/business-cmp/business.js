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
        areaData : basePath + "businessWidget/area.action",
        moreData : basePath + "businessWidget/more.action",
        
        getPageConfig : basePath + "seqCommonController/getPageConfig.action",
        getData : basePath + "seqCommonController/getData.action",
        exportData : basePath + "seqCommonController/exportData.action",
        downLoad : basePath + "seqCommonController/downLoad.action",
        getTimeList : basePath + "seqCommonController/getTimeList.action",

        saveTemplate : basePath + "businessWidget/saveQueryTemplate.action",
        templateList : basePath + "businessWidget/getQueryTemplates.action",
        deleteTemplate : basePath + "businessWidget/deleteQueryTemplate.action"
    };
    
    Business.interval = {
        day: 86400,
        hour: 3600,
        minutes: 900
    };
  
    Business.areaData = {
        areaType : {
            "MSC_POOL" : "MSC-POOL",
            "MSC" : "MSC",
            "BSC" : "BSC",
            "RNC" : "RNC",
            "BSCRNC" : "BSC/RNC",
            "RNC_BSC" : "RNC-BSC",//国际化
            "SAI" : "SAI",//国际化
            "CGI" : "CGI",//国际化
            "CGISAI" : BusinessI18N.cmp.area.cell,
            "SAI_CGI" : "SAI-CGI",//国际化
            "OFFICE_DIRECTION" : BusinessI18N.cmp.area.officDirection
        },
        areaTypeKey : ["MSC_POOL", "MSC", "BSC", "RNC", "BSCRNC", "RNC_BSC", "SAI", "CGI", "CGISAI", "SAI_CGI", "CGISAI_CGISAI", "OFFICE_DIRECTION"]
    };
    //表格钻取的图片配置
    Business.imagePath = {
        gridCdrDrill: basePath + "sweet/business-cmp/themes/images/drillDown.png",
        gridFailcauseDrill: basePath + "sweet/business-cmp/themes/images/drillDown.pngn",
        gridHocauseDrill : basePath + "sweet/business-cmp/themes/images/drillDown.png"
    };

    Business.saveCondition = {
        templateNameLength : 16
    };
   
})();

/**
* 查询模板公有化、私有化模板处理
*/
var queryModel = {}

//国际化
var res = BusinessI18N.comm;
var reader =  new Sweet.Reader.JsonReader();
var store=new Sweet.Store.GridStore({
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
queryModel.addmenu = function(data){
    var columns = data.columns;
    for(var i=0;i<columns.length;i++){              
        if(columns[i].filterType=="list"){
            var arr=[];
            data.data.forEach(function(c){
                var columnName=columns[i].name;
                var listChilden={text:c[columnName],value:c[columnName]};
                arr.push(listChilden);
            });
            arr = queryModel.deleteRepeatArr(arr);
            columns[i].filterList=arr;
        }
    };
};
queryModel.text=function(row){
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

queryModel.operationColumn = function(info){
    if(info.data=="1"){
        var row=info.row;
        return "<span class='query-template-delete-icon' onclick=queryModel.text("+row+")></span>";        
    }else if(info.data=="0"){
        return "<span class='query-template-delete-gray-icon'></span>";
    }
};

//列头配置
var gridData = {
    columns: [{
             header:res.templateName,
             name:"templateName",
             filter:true,
             enableHdMenu: false,
             filterType:'list',
             height: 30, 
             tooltip:res.templateName,
             dataType:"string",
             tip: true
         },
         {
             header:res.templateOwner,
             name:"userName",
             height: 30, 
             filter:true,
             enableHdMenu: false,
             filterType:'list',	
             dataType:"string",
             tooltip: res.templateOwner,
             tip: true
         },
         {
             header:res.templateType,
             name:"templateType",
             height: 30, 
             filter:true,
             enableHdMenu: false,
             filterType:'list',	
             dataType:"string",
             tooltip: res.templateType,
             tip: true
         },
         {
             header:"filter",
             name:"filter",	
             dataType:"string",
             hidden:true,
             hiddenForever:true
         },
         {
             header:res.operation,
             name:"isDelete",
             height: 30,
             width:res.operationWidth,
             tooltip:res.operation,
             renderer: queryModel.operationColumn
         }
    ],
    data: []
};

/**
 * 保存记录
 * @param item
 * @private
 */
queryModel.saveCondition = function (template,type_p,params,filter){
    var res;
    var url = basePath + "templateManageController/saveQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId: params.moduleId,
        filter:filter,
        templateName:template,
        templateType:type_p
    };
    var callback = function(data){
        res=data;
    }
    queryModel._request(url,param,callback);
    return res;
};

/**
 * 删除一条记录
 * @param item
 * @private
 */
queryModel.removeCondition = function (item){
    var url = basePath + "templateManageController/deleteQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId:queryModel.config.moduleId,
        templateName:item.templateName,
        templateType:item.template_type,
        templateOwner:item.userName
    };
    var callback = function(data){
        if ("0" == data.resultCode) {
            var templateNames = queryModel.getCurrentUserServiceQuerys(queryModel.config.moduleId,false);
            gridData.data=templateNames;
            queryModel.addmenu(gridData);
            store.loadData(gridData);
            queryModel.okButton.setDisabled(true);
        }
    }
    queryModel._request(url,param,callback);
};

/**
*查询当前用户当前业务所拥有模板
*/
queryModel.getCurrentUserServiceQuerys = function(pageId,isLast){
    var result =[];
    var url = basePath + "templateManageController/getQueryTemplateList.action";
    var param = {
        businessType: "NPM",
        isLast:isLast,
        moduleId: pageId
    };
    var callback = function(data){
        result=data;
    }
    queryModel._request(url,param,callback);
    return result;
}

/**
 * 检查模板名称的合法性
 */
queryModel.checkTemplateName = function(event, data) {
    var charRe =  /^[\u0391-\uFFE5\w@#~\-_\(\)\[\] !\.]*$/;
    ch = data.text;
    // 用户输入的参数
    if (!charRe.test(ch)) {
        // 出现提示
        return {
        "success" : false,
        "message" : res.noInput
        };
    }  
    // 模板的名称不能空
    if (0 === ch.length) {
        // 出现提示
        return {
        "success" : false,
        "message" : res.templateNameNotNull
        };
    }
	return {
		"success" : true,
		"message" : ""
	};
};

/**
*查询模板保存界面
*/
queryModel.saveTemplate=function(params,filter){
    if(queryModel.sweetWnd3){
        queryModel.sweetWnd3.destroy();
    }

    //模板名称校验
    var type_p = "public";
    var valueTextName = new Sweet.form.TextField({
                errorModel : Sweet.constants.tipAttr.MODEL_NORMAL,
                maxLength:32,
                width:270,
                label:true,
                labelWidth :105,
                labelText : res.template_Name,
                emptyText : res.pleaseInput, // "请输入",
                validateFun : {eventName:"blur", params: {"maxLength" : 32}, fun: queryModel.checkTemplateName}
            });
    //单选组		
    var radioData= [
            {text: res.privates, value: "private", data: null, checked: false},
            {text: res.publics, value: "public", data: null, checked: true}
          ];
    var sweetRadioGroup = new Sweet.form.RadioGroup({
        width : "80%",
        height : 30,
        data: radioData,
        tip: true
    });
        
    sweetRadioGroup.addListener("click", function(event, val){
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
        items: [valueTextName,panel_radio_H]
    });
    
    var cancelButton = new Sweet.form.Button({value : {text: res.cancel}});
    cancelButton.addListener("click", function(event, data){queryModel.sweetWnd3.close();});
    var saveButton = new Sweet.form.Button({value : {text: res.save}});
    saveButton.addListener("click", function(event, data){
        var isvalidata = sweetVPanel.validateForm();
        // 用户输入的参数, 模板名称的长度不能大于80个字符
        if (!isvalidata) {
            // 出现提示
            return false;
        }
        var templateName = valueTextName.getValue().value;
        
        var templateNames = queryModel.saveCondition(templateName,type_p,params,filter);
        if("1" == templateNames.resultCode){
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
        title : res.saveTemplate,// "Templet Selected",
        content : sweetVPanel,
        buttons:[saveButton,cancelButton]
    });

    queryModel.sweetWnd3.show(); 
}

queryModel.getQueryModel = function(params) {
    queryModel.config = params.config;
    if(queryModel.sweetWnd2){
        queryModel.sweetWnd2.destroy();
    }
    //导入界面grid模板
    queryModel.contents = new Sweet.grid.Grid({
        width: "100%",
        height: "100%",
        store:store,
        data:{singleSelect: true,resizable: true}
    });

    //表格单元格点击事件
    queryModel.contents.addListener("cellClick", function(event, data){
        queryModel.baseDrillData = data;
        queryModel.okButton.setDisabled(false);
    });
    //表格双击事件
    queryModel.contents.addListener("rowDblClick", function(event, data){
        params.filterQuery(queryModel.baseDrillData.rowData.filter);
        queryModel.sweetWnd2.close(); 
    });
    var templateNames = queryModel.getCurrentUserServiceQuerys(queryModel.config.moduleId,false);
    gridData.data=templateNames;
    queryModel.addmenu(gridData);
    store.loadData(gridData);
    
    var cancelButton = new Sweet.form.Button({value : {text: res.cancel}});
    cancelButton.addListener("click", function(event, data){queryModel.sweetWnd2.close();});
    queryModel.okButton = new Sweet.form.Button({value : {text: res.OK}});
    queryModel.okButton.setDisabled(true);
    queryModel.okButton.addListener("click", function(event, data){
        if(queryModel.baseDrillData){
            params.filterQuery(queryModel.baseDrillData.rowData.filter);
            queryModel.sweetWnd2.close();
        }else{
            Sweet.Msg.warn(res.checkTemplate);
        }
    });
    //弹出框
    queryModel.sweetWnd2 = new Sweet.Window({
        width:530,
        height: 300,
        title : res.importTemplate,
        content : queryModel.contents,
        buttons:[queryModel.okButton,cancelButton]
    });
    queryModel.sweetWnd2.show(); 
}

/**
*最后一次查询模板保存
*/
queryModel.lastQuery = function (pageId,filter){
    var url = basePath + "templateManageController/saveLastQueryTemplate.action";
    var param = {
        businessType: "NPM",
        moduleId: pageId,
        filter:filter
    };
    var callback = function(data){
        if("1" == data.resultCode){
            $.log('save last query error！')
        }
    }
    queryModel._request(url,param,callback);
};

/**
 * 数据请求
 * @param url
 * @param param
 * @param mask
 * @param callback
 * @private
 */
queryModel._request = function (url,param,callback,async) {
    if(!async){async=false};
    Sweet.Ajax.request({
        url: url,
        contentType : "application/json;chartset=UTF-8",
        data: JSON.stringify(param),
        dataType: "json",
        async : async,
        timeout:300000,
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
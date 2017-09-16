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
            moduleId : "",
            width: 250,
            height: 215,
            getCondtionCallback : null,
            setCondtionCallback : null
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
    Business.conditionManage.prototype.importLastQuery = function(modelId){
        var me = this;
        var param = {
            businessType: "NPM",
            isLast:true,
            moduleId: modelId
        };
        //回调函数
        var callback = function(data){
            if(data.length>0){
                var res = $.parseJSON(data[0].filter);
        if($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)){
            return;
        }
                me.config.setCondtionCallback(res); 
            }
        }
        Sweet.Ajax.request({
            url: basePath + "/templateManageController/getQueryTemplateList.action",
            contentType : "application/json;chartset=UTF-8",
            data: JSON.stringify(param),
            dataType: "json",
            async : false,
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
    };

    /**
     * @description 保存查询条件
     * @param templateName 模板名称
     * @param condition 条件
     * @returns {Object}
     */
    Business.conditionManage.prototype.saveTemplate = function(templateName, condition, isLastQuery){
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
        if($.isNull(condition)){
            return;
        }
        
        if ((!isLastQuery) && me.isTemplateExist(templateName)) {
            Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletExistError);
            return;
        }
        
        if(isLastQuery){
            templateName = BusinessI18N.cmp.conditionManage.queryConditionLast; 
        }
        // 发起保存模板请求,返回是否成功
        var requestParam = {
            "moduleId" : me.config.moduleId,
            "templateName" : templateName,
            "widgetValue" : condition
        };
        // 发送请求信息，获取过滤信息
        Sweet.Ajax.request({
            url : Business.url.saveTemplate,
            contentType : "application/json;chartset=UTF-8",
            async : true,
            data : JSON.stringify(requestParam),
            loadMask : !isLastQuery,
            success : function(result) {
                //保存模板失败，模板名称不合法也会导致保存模板失败
                if(result === false) {
                    Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletError);
                    return;
                }
                me._queryTemplates();
                me._updateListView();
            },
            error : function() {
                Sweet.Msg.error(BusinessI18N.cmp.conditionManage.saveTempletError);
                return;
            }
        });
        
    };

    /**
     * @description 返回各个组件
     * @returns {Object}
     */
    Business.conditionManage.prototype.getItems = function(){
        return this.items;
    };
    
    /**
     * 获取值
     * @returns {Object}
     */
    Business.conditionManage.prototype.getValue = function(){
        var me = this;

        var result = {};
        
        return result;
    };

    /**
     * 设置值
     * @returns {Object}
     */
    Business.conditionManage.prototype.setValue = function(obj){
        if($.isNull(obj)){
            return;
        }
    };

    /**
     * 销毁组件 对外接口
     */
    Business.conditionManage.prototype.destroy = function () {
        
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
            imageTip : BusinessI18N.cmp.conditionManage.queryConditionHistory,
            width : 20,
            height : 20,
            click : function(e){
                queryModel.getQueryModel(me);
            }
        });
        me.items.push(me._historyIcon);
        
        // 保存图标
        me._saveIcon = new Sweet.form.LabelImage({
            imageType: "save",
            imageTip : BusinessI18N.cmp.conditionManage.queryConditionSave,
            width : 20,
            height : 20,
            click : function(e){
                queryModel.saveTemplate(me.config,me.config.getCondtionCallback());
            }
        });
        
        me.items.push(me._saveIcon);
    };

    /**
     * @description  点击历史按钮，弹出历史列表
     * @returns {Object}
     */
    Business.conditionManage.prototype._onClickHistory = function(event){
        var me = this;
        //自定义div样式
        var css = {
            width : me.config.width - 20,
            height : me.config.height - 20,
            padding : "10px"
        };
        
        //创建选择列表浮动窗
        if ($.isNull(me.historyEl)) {
            var id = me._historyIcon.options.id + "-history";
            me.historyEl = $("<div>").attr("id", id).addClass("sweet-dialog-bg").css(css).css({"display": "none"}).appendTo($(document.body));
        
            me.historylist = new Sweet.list.List({
                data: [],
                minRemains: 1,
                tip: true,
                renderTo: id
            });
            me.historylist.addListener("nodeClick", function(event, data) {
                me.historyEl.hide();
                if($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)){
                    return;
                }
                me.config.setCondtionCallback(JSON.parse(data.widgetValue)); 
            });
            
            //点击body其他位置，隐藏列表
            $(document.body).bind("click", function(event) {
                if($.isNotNull(me.historyEl) && $.isVisiable(me.historyEl) && !me._showHisFloatWinFlag){
                    me.historyEl.hide();
                }
                me._showHisFloatWinFlag = false;
            });
        }

        if($.isVisiable(me.historyEl)) {
            return;
        }

        if($.isNull(me.templateList)){
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
    Business.conditionManage.prototype.filterQuery =function(data){
        var me = this;
        var filter = $.parseJSON(data);
        if($.isNull(me.config.setCondtionCallback) || !$.isFunction(me.config.setCondtionCallback)){
            return;
        }
        me.config.setCondtionCallback(filter); 
    }

    /**
     * @description  点击保存查询条件按钮，弹出处理窗口
     * @returns {Object}
     */
    Business.conditionManage.prototype._onClickSave = function(event, obj){
        var me = this;
        if($.isNull(me.window)){
            me._creatManageWindow();
        }
        if($.isNull(me.templateList)){
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
    Business.conditionManage.prototype._creatManageWindow = function(){
        var me = this;
        
        // 名称
        me.nameInput = new Sweet.form.TextField({
            width: 160,
            emptyText: BusinessI18N.cmp.conditionManage.inputTemplateName,
            maxLength : Business.saveCondition.templateNameLength
        });

        // 保存按钮
        var saveButton = new Sweet.form.Button({
            width: 65,
            value: {
                value: "", 
                text: BusinessI18N.cmp.conditionManage.save
            },
            click : function(e, data) {
                var template = me.nameInput.getValue().value;
                if($.isNull(me.config.getCondtionCallback) || !$.isFunction(me.config.getCondtionCallback)){
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
            click : function(e, data) {
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
        if($.isNull(me.templateList)){
            return false;
        }
        
        // @采用indexOf优化，
        for ( var i = 0; i < me.templateList.length; i++) {
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
    Business.conditionManage.prototype._queryTemplates = function () {
        var me = this, requestParam;
        requestParam = {
            "moduleId" : me.config.moduleId,
            "templateName" : ""
        };

        me.templateList = [];
        
        // 发送请求信息，获取过滤信息
        Sweet.Ajax.request({
            url : Business.url.templateList,
            contentType : "application/json;chartset=UTF-8",
            async : false,
            data : JSON.stringify(requestParam),
            loadMask :false,
            timeout : 300000,
            success : function(result) {
                me.templateList = result;
            },
            error : function() {
                Sweet.Msg.error("Error");
            }
        });
           
    };

     /**
      * 更新history List列表内容
      * @private
      */
    Business.conditionManage.prototype._updateHistoryList = function () {
        var me = this;
        var data = [];
        var lastQueryData = [];
        
        //把Last Query选项放到最上方
        for(var i = 0, len = me.templateList.length; i < len; i++){
            if(me.templateList[i].templateName === BusinessI18N.cmp.conditionManage.queryConditionLast){
                lastQueryData.push({
                    text : me.templateList[i].templateName,
                    value : me.templateList[i].templateName,
                    widgetValue : me.templateList[i].widgetValue
                });
            }else{
                data.push({
                    text : me.templateList[i].templateName,
                    value : me.templateList[i].templateName,
                    widgetValue : me.templateList[i].widgetValue
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
    Business.conditionManage.prototype._updateListView = function () {
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
                tip : true,
                value: {
                    text : templateName,
                    value :templateName
                }
            });

           button = new Sweet.form.LabelImage({
                imageType: "delete",
                width: "10%",
                height: 23,
                imageTip: BusinessI18N.cmp.conditionManage.delete,
                value: {
                    text : templateName,
                    value :templateName
                },
                click: function(event, data) {
                    var templateName = data.value;
                    var deleteTemplateConfirm = Sweet.Dialog.confirm({
                        width : 330,
                        height : 130,
                        modal : false,
                        message : BusinessI18N.cmp.conditionManage.deleteTempletTips.replace("{0}", templateName),
                        listeners : {
                            "ok" : function(event) {
                                me._removeTemplate(templateName);
                            },
                            "cancel" : function(event) {
                            }
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
    Business.conditionManage.prototype._removeTemplate = function (templateName) {
        var me = this;
        var requestParam = {
            "moduleId" : me.config.moduleId,
            "templateName" : templateName
        };
        
        Sweet.Ajax.request({
            url : Business.url.deleteTemplate,
            data : JSON.stringify(requestParam),
            async : false,
            contentType : "application/json;chartset=UTF-8",
            success : function(result) {
                me._queryTemplates();
                me._updateListView();
            },
            error : function() {    
                Sweet.Msg.error("Error");
            }
        });     
    };

})();
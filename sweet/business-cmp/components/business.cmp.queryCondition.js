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
            boxWidth : 195,
            // lable宽度
            boxLableWidth : 75
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
    Business.queryCondition.prototype.getPanel = function(){
        
        return this._panel;
    };

    /**
     * @description 返回模板面板
     * @returns {Object}
     */
    Business.queryCondition.prototype.getConditionManage = function(){
        
        return this._conditionManag;
    };
    
    /**
     * 获取值(点击查询按钮时提交所有查询数据)
     * @returns {Object}
     */
    Business.queryCondition.prototype.getValue = function(){
        var me = this;
        me._value = {};
        // 时间范围
        if ($.isNotNull(me._timeRange)){
            var timeVal = me._timeRange.getValue();
            if(!timeVal) {
                return null;
            }
            me._value = $.extend(me._value, timeVal);
        }
        
        // 区域
        if ($.isNotNull(me._area)){
            var areaVal = me._area.getValue();
            if(!areaVal) {
                return null;
            }
            me._value = $.extend(me._value, areaVal);
        }

        //下拉框
        if(me._box) {
            me._value = $.extend(me._value, {box: Business.functions.getLeafArray(me._box.getValue()).value});
        }

        if(me._more) {
            me._value = $.extend(me._value, me._more.getValue());
        }
        
        return me._value;
    };

    /**
     * 设置值
     * @param {Object} obj 选择的时间粒度对象
     * @returns {Object}
     */
    Business.queryCondition.prototype.setValue = function(obj){
        if($.isNull(obj)){
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
        me.items= [];

        // 时间范围
        if ($.isNotNull(config.timeRange)){
            me._timeRange = new Business.timeRange(config.timeRange);
            me.items = me.items.concat(me._timeRange.getItems()); 
        }
        
        // 区域
        if ($.isNotNull(config.area)){
            // area与more的联动
            config.area.changeFunc = function(val) {
                if(me._more) {
                    me._more.areaChangeFunc(val);
                }
            };
            me._area = new Business.area(config.area);
            me.items = me.items.concat(me._area.getItems());
        }

        // 下拉框
        if ($.isNotNull(config.box)){
            // 参数
            var boxConfig = {
                width : config.boxWidth,
                multi : false,
                tip: true,
                label : true,
                labelWidth : config.boxLableWidth
            };
            boxConfig = $.extend(boxConfig, config.box);
            boxConfig.multi = (boxConfig.multi === "true" ? true : false);

            // box
            me._box = new Sweet.form.ComboBox_v1(boxConfig);
            me.items = me.items.concat(me._box);

            // 请求数据
            Sweet.Ajax.request({
                url : boxConfig.url,
                contentType : "application/json;chartset=UTF-8",
                async : true,
                timeout : 300000,
                success : function(result) {
                    if ($.isNull(result)) {
                        $.error("Business.queryCondition() request combobox data fail");
                    }
                    me._box.setData(result);
                },
                error : function() {
                    $.error("Business.queryCondition() request combobox data fail");
                }
            });
        }

        // more
        if ($.isNotNull(config.more)){

            me._more = new Business.more($.extend(config.more, {
                getParamsFunc : function() {
                    // 用area的getValue()会触发area的校验，故直接使用下拉框的getValue()
                    var areaType = (me._area && me._area._combobox.getValue().value) ? 
                        me._area._combobox.getValue().value : null;
                    var valObj = {areaType : areaType};
                    return valObj;
                }
            }));
            me.items = me.items.concat(me._more.getItems());
        }

        // 查询按钮
        me._queryBtn = new Sweet.form.Button({
            width : 105,
            highLight : true,
            widgetClass : "queryBtnClass fontBolder",
            value : {value: "query", text: BusinessI18N.cmp.queryCondition.query},
            click : function(e, data){
                if(me._submitQueryData(e, data)){
                    // 保存最后一次查询条件（组件已经优化，保存小区）
                    queryModel.lastQuery(me.config.moduleId,me._getRequestParams());
                }
            }
        });
        me.items = me.items.concat(me._queryBtn);

        // 查询条件保存
        me._conditionManag = new Business.conditionManage({
            moduleId : config.moduleId,
            getCondtionCallback : function(){
               return me._getRequestParams();
            },
            setCondtionCallback : function(params){
                me._setQueryCondtions(params);
            }
        });
        me.items = me.items.concat(me._conditionManag.getItems());

        // panel
        me._panel = new Sweet.panel.FlowPanel({
            height : 35,
            portion: "north",
            widgetClass : "queryPanelLineClass",
            items : me.items,
            margin : [5, 0, 0, 0]
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
        if ($.isNotNull(config.timeRange)){
            requestParamObj.timeRange = $.objClone(me._timeRange.getValue());
            if(!requestParamObj.timeRange) {
                return null;
            }
        }

        // 区域
        if ($.isNotNull(config.area)){
            requestParamObj.area = $.objClone(me._area.getOriginalValue());
            if(!requestParamObj.area) {
                return null;
            }
        }

        // 下拉框
        if ($.isNotNull(config.box)){
            requestParamObj.box = $.objClone(me._box.getValue());
            if(!requestParamObj.box) {
                return null;
            }
        }

        // more
        if ($.isNotNull(config.more)){
            requestParamObj.more = $.objClone(me._more.getOriginalValue());
            if(!requestParamObj.more) {
                return null;
            }
        }
        
        return requestParamObj;
    };

    /**
     * @description 查询条件反填
     * @returns {Object}
     */
    Business.queryCondition.prototype._setQueryCondtions = function(requestParams){
        var me = this;
        
        if($.isNull(requestParams)){
            return;
        }
        
        if(requestParams.timeRange && me._timeRange) {
            me._timeRange.setValue(requestParams.timeRange);
        }

        if(requestParams.area && me._area) {
            me._area.setValue(requestParams.area);
        }

        if(requestParams.box && me._box) {
            me._box.setValue(requestParams.box);
        }

        if(requestParams.more && me._more) {
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
        if(!value) {
            //表示取数据没有成功
            return false;
        }
        if(config.validatorFunc && "function" == typeof(config.validatorFunc)){
            var flag = config.validatorFunc(value, me);
            if("false" === flag || false === flag){
                return;
            }
        }
        config.queryFunc(value);
        return true;
    };

    /**
     * 销毁组件 对外接口
     */
    Business.queryCondition.prototype.destroy = function () {
        if (this._panel) {
            this._panel.destroy();
            this._panel = null;
        }
    };

})();
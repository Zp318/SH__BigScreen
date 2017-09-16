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
        list : "list",
        topN : "topN"
    };
    var CMPTYPE = {
        listWindow: "listWindow", //默认，适用于MSC-POOL,MSC,RNC,BSC,BSC/RNC
        treeWindow: "treeWindow", //树形结构双向列表，适用于CGI,SAI,CGI/SAI
        officeDirection: "officeDirection", // 局向，适用于局向
        sdListWindow : "sdListWindow", //源、目的list双向列表，适用于RNC-BSC
        sdTreeWindow : "sdTreeWindow", // 源、目的tree双向列表，适用于SAI-CGI
        imsiField: "imsiField" //号码文本框
    };
    var windowSize = {
        listWindow: [470, 400],
        treeWindow: [470, 400],
        officeDirection: [470, 495],
        sdListWindow : [470, 500],
        sdTreeWindow : [470, 500],
        _paddingWidth: 10,
        _tempHeight: 71,
        _tempSDHeight: 93
    };
    var locale = Sweet.getLocale() === Sweet.constants.language.ZH_CN ? "zh" : "en";
    var notEmpty = BusinessI18N.cmp.area.notEmpty;
    Business.area = function(params) {
        //初始参数设置
        this.config = {
            labelText : BusinessI18N.cmp.area.labelText,
            // lable宽度
            lableWidth : 50,
            // 下拉框宽度
            comboWidth : 120,
            // 复杂的areaType，直接在jsp中配置json对象；areaType需要配成""
            areaTypeUrl : null,
            url : Business.url.areaData,
            // 局向
            officeDirection : [{
                opt : "MSC",
                dpt : ["MSC"]
            }],
            // 号码长度
            imsiFieldLength : 32,
            // 文本框允许输入的字符
            imsiFieldAllowedCharts : /^[0-9a-zA-Z]+$/,
            // 区域下拉框change事件的回调函数
            changeFunc : function() {
                return null;
            }
        };
        
        if (params["labelText_" + locale]) {
            params["labelText"] = params["labelText_" + locale];
        }
        this.config = $.extend(this.config, params);
        //是否有topN的配置
        this._isTopN = true;
        if(!this.config["topN"]){
            this._isTopN = false;
        }else{
            //如果没有配置数据则用默认的数据
            if(!("true" == this.config["topN"] || true == this.config["topN"])){
                topNData = []; 
                var _tempTopNData = this.config["topN"].split(",");
                if(_tempTopNData && _tempTopNData.length > 0){
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
    Business.area.prototype.getItems = function(){
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
        if(CMPTYPE.imsiField === cmpType) {
            result.areaList = me._imsiField.getValue();
            return result;
        }
        //
        if(CMPTYPE.listWindow === cmpType) {
            result.areaList = $.objClone(me._listWindow.getValue());
        } else if(CMPTYPE.treeWindow === cmpType) {
            if(!me._isTopN){
                result.areaList = $.objClone(me._cellListWin.getValue());
            }else{
                result.isTopN = me._cellRadioBtn.getValue();
                if(radioValue.topN === result.isTopN.value) {
                    result.topN = me._cellComboBox.getValue();
                } else {
                    result.areaList = $.objClone(me._cellListWin.getValue());
                }
            }
        } else if(CMPTYPE.officeDirection === cmpType) {
            result.areaList = me._officeDirection.getAllSelValue();
        } else if(CMPTYPE.sdListWindow === cmpType) {
            result.orgAreaList = me._sdListWinSTreeWindow.getValue();
            result.targetAreaList = me._sdListWinDTreeWindow.getValue();
        } else if(CMPTYPE.sdTreeWindow === cmpType) {
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
        
        if(CMPTYPE.imsiField === cmpType) {
            result.areaList = data.areaList.value;
            result.areaListObj = data.areaList;

            // 非空校验
            if(!result.areaList) {
                var message = data.areaType.text + notEmpty;
                if(!locale) {
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
            if(!me._imsiField.check()) {
                Sweet.Dialog.warn({
                    width: 330,
                    height: 130,
                    message: data.areaType.text + ": " + BusinessI18N.cmp.area.onlyChartNum
                });
                return null;
            }
            return result;
        }
        var selectorVal = (me._selector.getValue() && me._selector.getValue().value) ? 
            me._selector.getValue().value : "";

        // 区域组件不能为空
        if(!selectorVal) {
            Sweet.Dialog.warn({
                width: 330,
                height: 130,
                message: selectAreaError
            });
            return null;
        }
        if(CMPTYPE.listWindow === cmpType) {
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
            if(mscType) {
                result.mscType = mscType;
            }
        } else if(CMPTYPE.treeWindow === cmpType) {
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
                if(bsc.data === bsc.children.length) {
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
                selectedBscrncId : selectedBscrncId.toString(),
                selectedCgisaiId : selectedCgisaiId.toString()
            };

            result.areaListForCgisai = selectedCells;
        } else if(CMPTYPE.officeDirection === cmpType) {
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
        } else if(CMPTYPE.sdListWindow === cmpType) {
            result.orgAreaList = Business.functions.getLeafArray(data.orgAreaList).value;
            result.targetAreaList = Business.functions.getLeafArray(data.targetAreaList).value;
            result.areaListObj = NEED_AREA_PAIR;
        } else if(CMPTYPE.sdTreeWindow === cmpType) {
            // 源
            var orgSelectedBscrncId = [];
            var orgSelectedCgisaiId = [];
            data.orgAreaList.forEach(function(bsc, bscIndex, bscArr) {
                if(bsc.data === bsc.children.length) {
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
                orgSelectedBscrncId : orgSelectedBscrncId.toString(),
                orgSelectedCgisaiId : orgSelectedCgisaiId.toString()
            };
            result.areaListForOrg = selectedCells;

            // 目的
            var targetSelectedBscrncId = [];
            var targetSelectedCgisaiId = [];
            data.targetAreaList.forEach(function(bsc, bscIndex, bscArr) {
                if(bsc.data === bsc.children.length) {
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
                targetSelectedBscrncId : targetSelectedBscrncId.toString(),
                targetSelectedCgisaiId : targetSelectedCgisaiId.toString()
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
        
        if($.isNull(obj) || $.isNull(obj.areaType)) {
            return;
        }

        var me = this;
        var areaType = obj.areaType;

        // 为true表示不需要置空双向列表右侧
        me._afterSetListWinRightData = null;
        var oldAreaType = me._combobox.getValue().value;

        // 模板中的区域类型与当前一致，不会发生change事件
        if(oldAreaType !== areaType.value) {
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
        me.cellLoader =  {
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            url : config.url,
            baseParams: {loadMask: true, areaType: ""}
        };
        me.items = [];

        //区域下拉框
        var labelWidth = parseInt(config.lableWidth);
        var comboWidth = parseInt(config.comboWidth);
        
        
        me._combobox = new Sweet.form.ComboBox_v1({
            tip : true,
            name : "areaCombobox",
            editable:false,
            width : labelWidth + comboWidth,
            label : true,
            labelText : config.labelText,
            labelWidth : labelWidth
        });
        me._combobox.addListener("click", function(val){
            // 点击已经选中的项，不发生change，则返回
            if(me._oldClickComboValue && me._oldClickComboValue === val.value) {
                return;
            }
            // 点击发生了change
            me._oldClickComboValue = val.value;
            if(me._afterSetListWinRightData) {
                me._afterSetListWinRightData = null;
            }
            
        });
        me._combobox.addListener("change", function(event, val){
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
    Business.area.prototype._creatSelector = function(cmpType){
        var me = this;
        var config = me.config;

        // 选择文本框
        me._selector = new Sweet.form.Selector({
            name : "areaSelector",
            emptyText : BusinessI18N.cmp.area.pleaseSelect,
            width : 150
        });

        me._selector.addListener("buttonClick", function(event, val) {
            me._openWindow();
        });

        me.items.push(me._selector);

        // 数值文本框
        me._imsiField = new Sweet.form.TextField({
            width : 150,
            label : false,
            maxLength : config.imsiFieldLength,
            visible : false,
            errorModel : Sweet.constants.tipAttr.MODEL_NORMAL,
            validateFun : {
                eventName:"blur", 
                params: {},
                fun: function(event, val) {
                    if(val.text && !(config.imsiFieldAllowedCharts.test(val.text))){
                        return {"success": false, "message": BusinessI18N.cmp.area.onlyChartNum};
                    }
                    return {"success": true, "message": ""};
                }
            }
        });
        me.items.push(me._imsiField);
    };

    /**
     * 创建弹出窗口
     * @private
     */
    Business.area.prototype._creatWindow = function(){
        var me = this;
        var config = me.config;

        // listWindow,MSC-POOL,MSC,BSC,RNC,BSC/RNC
        if(!me._listWindow) {
            me._creatListWindow();
        }
        // treeWindow,SAI,CGI,CGI/SAI
        if(!me._treeWindow) {
            me._creatTreeWindow();
        }
        // 局向
        if(!me._officeDirection) {
            me._creatOfficeDirectionWindow();
        }
        // RNC-BSC
        if(!me._sdListWindow) {
            me._creatSdListWindow();
        }
        // CGI-SAI
        if(!me._sdTreeWindow) {
            me._creatSdTreeWindow();
        }

        me._windowPanel = new Sweet.panel.VPanel({
            height: windowSize["listWindow"][1]-windowSize["_tempHeight"],
            width: "100%",
            header: false,
            padding: 0,
            items : [me._listWindow, me._treeWindow, me._officeDirection, me._sdListWindow, me._sdTreeWindow]
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
            name : "areaListWin",
            widgetClass : "business-cmp-listwindw-area",
            width: windowSize["listWindow"][0] - windowSize["_paddingWidth"],
            height: windowSize["listWindow"][1] - windowSize["_tempHeight"],
            useArrows: false,
            icon: false,
            tip: true,
            fromTitle: BusinessI18N.cmp.area.listWindowLeftTitle,
            toTitle: BusinessI18N.cmp.area.listWindowRightTitle,
            visible : false
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
        var loader =  $.objClone(me.cellLoader);
        if(!me._isTopN){
            visible = true;
            treewindowHeight = windowSize["listWindow"][1] - windowSize["_tempHeight"];
        }else{
            treewindowHeight = windowSize["listWindow"][1] - windowSize["_tempHeight"] - 30;
        }
        me._cellListWin = new Sweet.cmp.TreeWindow({
            width: windowSize["listWindow"][0] - windowSize["_paddingWidth"],
            height: treewindowHeight,
            useArrows: false,
            icon: false,
            tip: true,
            loader: loader,
            visible : visible,
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
        if(!me._isTopN){
            me._treeWindow = new Sweet.panel.VPanel({
                height: windowSize["treeWindow"][1] - windowSize["_tempHeight"],
                width: "100%",
                header: false,
                items : [me._cellListWin],
                visible : true
            });
            return;
        }
        
        me._cellRadioBtn = new Sweet.form.RadioGroup({
            width: parseInt(windowSize["treeWindow"][0] * 0.7, 10),
            height: 25,
            data: [
                {
                    text: BusinessI18N.cmp.area.selectTopN,
                    value: radioValue.topN,
                    checked: true
                },
                {
                    text: BusinessI18N.cmp.area.selectCell,
                    value: radioValue.list,
                    checked: false
                }
            ]
        });

        me._cellRadioBtn.addListener("change", function(event, val) {
            if(radioValue.topN === val.value) {
                me._cellListWin.hide();
                me._cellComboBox.show();
            }
            else if(radioValue.list === val.value) {
                me._cellListWin.show();
                me._cellListWin.doLayout(true);
                me._cellComboBox.hide();
            }
            else {
                return;
            }
        });
        var topNDataArr = [];
        var tempTopNDatas;
        
        me._cellComboBox = new Sweet.form.ComboBox_v1({
            tip : true,
            editable : false,
            width : 300,
            label : true,
            labelText : "Top N",
            labelWidth : 50,
            blank : false
        });
        
        topNData.forEach(function(top, index, arr) {
            topNDataArr.push({text: ("" + top), value: "" + top});
        });
        me._cellComboBox.setData(topNDataArr);
 
        me._treeWindow = new Sweet.panel.VPanel({
            height: windowSize["treeWindow"][1],
            width: "100%",
            header: false,
            items : [me._cellRadioBtn, me._cellListWin, me._cellComboBox],
            visible : false
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
            visible : false,
            source : me._getOfficeComboData()
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
            height : _treeHeight,
            widgetClass : "business-cmp-listwindw-area",
            useArrows : false,
            icon : false,
            tip : true,
            data: [],
            fromTitle : BusinessI18N.cmp.area.source,
            toTitle : ''
        });

        me._sdListWinDTreeWindow = new Sweet.cmp.TreeWindow({
            height : _treeHeight,
            widgetClass : "business-cmp-listwindw-area",
            useArrows : false,
            icon : false,
            tip : true,
            data: [],
            fromTitle : BusinessI18N.cmp.area.destination,
            toTitle : ''
        });
        // // 最多选100个小区
        me._sdListWinSTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));
        // // 最多选100个小区
        me._sdListWinDTreeWindow.addListener("beforemoveright", me._registEvent("beforemoveright", 100));

        me._sdListWindow = new Sweet.panel.VPanel({
            padding : 20,
            visible : false,
            items : [ me._sdListWinSTreeWindow, me._sdListWinDTreeWindow ]
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
            height : _treeHeight,
            widgetClass : "business-cmp-listwindw-area",
            useArrows : false,
            icon : false,
            tip : true,
            loader: sLoader,
            fromTitle : BusinessI18N.cmp.area.source,
            toTitle : ''
        });

        me._sdTreeWinDTreeWindow = new Sweet.cmp.TreeWindow({
            height : _treeHeight,
            widgetClass : "business-cmp-listwindw-area",
            useArrows : false,
            icon : false,
            tip : true,
            loader: dLoader,
            fromTitle : BusinessI18N.cmp.area.destination,
            toTitle : ''
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
            padding : 20,
            visible : false,
            items : [ me._sdTreeWinSTreeWindow, me._sdTreeWinDTreeWindow ]
        });
    };

    /**
     * 显示selector或IMSI文本框
     * @private
     * @param {String} cmpType 组件类型
     */
    Business.area.prototype._showWhichSelector = function(cmpType){
        var me = this;
        var config = me.config;

        // 隐藏所有的选择组件
        if(me._imsiField && me._imsiField.rendered) {
            me._imsiField.hide();
        }
        if(me._selector && me._selector.rendered) {
            me._selector.hide();
        }

        // IMSI、MSISDN
        if(CMPTYPE.imsiField === cmpType) {
            if(me._imsiField.rendered) {
                me._imsiField.show();
                if(!me._afterSetListWinRightData) {
                    me._imsiField.setValue({text:"", value:""});
                    return;
                }
                me._imsiField.setValue(me._afterSetListWinRightData.areaList);
                me._afterSetListWinRightData = null;
            }
        }
        // window 
        else {
            if(me._selector.rendered) {
                var selectorVal = {};
                // 反填
                if(me._afterSetListWinRightData) {
                    selectorVal = me._afterSetListWinRightData.selector;
                }
                // 置空
                else {
                    if(CMPTYPE.listWindow === cmpType) {
                        selectorVal = {text: ALL, value: ALL};
                    } else if(CMPTYPE.treeWindow === cmpType) {
                        selectorVal = {text: "", value: ""};
                    } else if(CMPTYPE.officeDirection === cmpType) {
                        selectorVal = {text: ALL, value: ALL};
                    } else if(CMPTYPE.sdListWindow === cmpType) {
                       selectorVal = {text: "", value: ""};
                    } else if(CMPTYPE.sdTreeWindow === cmpType) {
                        selectorVal = {text: "", value: ""};
                    }
                }
				me._selector.setValue(selectorVal);
                me._selector.show();
            }else{
				// DTS2014081306356 begin
				if(CMPTYPE.listWindow === cmpType) {
					selectorVal = {text: ALL, value: ALL};
				}
				if(me._selector){
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
    Business.area.prototype._requestCmpTypeData = function(data){
        var me = this;
        var config = me.config;
        var val = me._combobox.getValue();
        var cmpType = val.data.cmpType;

        if(me._nowAreaType === val.value) {
            return;
        }
        me._nowAreaType = val.value;

        if(CMPTYPE.listWindow === cmpType) {
            me._requestData(val.value, function(data) {
                me._listWindow.setData(data[0][val.value]);
                me._areaListData = data[0][val.value];
            });
        } else if(CMPTYPE.treeWindow === cmpType) {
            var _tempLoader = $.objClone(me.cellLoader);
            _tempLoader["baseParams"]["areaType"] = val.value;
            me._cellListWin.setLoader(_tempLoader);
            me._cellListWin.load();
        } else if(CMPTYPE.officeDirection === cmpType) {
            me._requestData(me._getOfficeRequestParams(), function(data) {
                var obj = {};
            
                data.forEach(function(area, index, arr) {
                    var keyArr = Object.keys(area);
                    if(1 !== keyArr.length) {
                        return;
                    }
                    var key = keyArr[0];
                    obj[key] = area[key];
                });
                me._officeDirection.setData(obj);
            });
        } else if(CMPTYPE.sdListWindow === cmpType) {
            var source = val.value.split("_")[0];
            var destination = val.value.split("_")[1];
            // 请求多个数据，参数为MSC-RNC-BSC
            me._requestData(source+"-"+destination, function(data) {
                me._sdListWinSTreeWindow.setData(data[0][source]);
                me._sdListWinDTreeWindow.setData(data[0][destination]);
            });
        } else if(CMPTYPE.sdTreeWindow === cmpType) {
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
    Business.area.prototype._registEvent = function(eventName, maxNum, dataKey){
        var me = this;
        var _tempObj = {};
        _tempObj["beforemoveright"] = function(treeData, treeCmp) {
            var result = true;
            // 多个BSC下的所选小区大于300，则返回false
            var totalCells = Business.functions.getLeafNodeObj(Business.functions.oneObjToArray(treeData));
            if(1 < treeData.length && maxNum < totalCells.length) {
                result = false;
            }
            if(!result) {
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
            }else{
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
                if(dataKey){
                    if(loader["datas"] && loader["datas"].length > 0){
                        loader["datas"] = adapterDatas(loader["datas"][0][dataKey]);
                    }else{
                        loader["datas"] = [];
                    }
                }else{
                    loader["datas"] = adapterDatas(loader["datas"]);
                }
                return loader["datas"];
            }
            if(dataKey) {
                if(loader["datas"] && loader["datas"].length > 0){
                    loader["datas"] = loader["datas"][0][dataKey];
                }else{
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
            url : url || config.url,
            loadMask : true,
            async : async || false,
            data : {areaType : params},
            timeout : 300000,
            success : function(result) {
                callFunc(result);
            },
            error  : function() {
                $.error("Business.area() request listWindow's data error!");
            }
        });
    };

    /**
     * 回填window中各个组件
     * @private
     * @param {Array} obj 区域下拉框当前选中的值
     */
    Business.area.prototype._setListWindowValue = function(obj){
        if(!obj) {
            return;
        }
        var me = this;
        var areaType = obj.areaType;
        var areaList = obj.areaList;
        var cmpType = areaType.data && areaType.data.cmpType ? areaType.data.cmpType : null;

        if(CMPTYPE.imsiField === cmpType) {
            me._imsiField.setValue(areaList);
            me._afterSetListWinRightData = null;
            return;
        }

        if(CMPTYPE.listWindow === cmpType) {
            me._listWindow.setValue(areaList);
        } else if(CMPTYPE.treeWindow === cmpType) {
            var isTopN = obj.isTopN;
            var topN = obj.topN;
            if(!me._isTopN){
                me._cellListWin.setValue(areaList);
            }else{
                me._cellRadioBtn.setValue(isTopN);
                if(radioValue.topN === isTopN.value) {
                    me._cellComboBox.setValue(topN);
                } else {
                    me._cellListWin.setValue(areaList);
                }
            }
        } else if(CMPTYPE.officeDirection === cmpType) {
            me._officeDirection.setValue(areaList);
        } else if(CMPTYPE.sdListWindow === cmpType) {
            me._sdListWinSTreeWindow.setValue(obj.orgAreaList);
            me._sdListWinDTreeWindow.setValue(obj.targetAreaList);
        } else if(CMPTYPE.sdTreeWindow === cmpType) {
            me._sdTreeWinSTreeWindow.setValue(obj.orgAreaList);
            me._sdTreeWinDTreeWindow.setValue(obj.targetAreaList);
        }
        //中英文模板显示全部
        if (obj.selector.value && (obj.selector.value == "全选" || obj.selector.value == "All")) {
            me._selector.setValue({text: ALL, value: ALL});
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
        var allText = {text: ALL, value: ALL};
        var val = "";

        if(CMPTYPE.listWindow === cmpType) {
            val = $.objClone(me._listWindow.getValue());
	    if(me._areaListData && me._areaListData.length > 0 && val.length >= me._areaListData.length){
	        val = "";
	    }else{
	        val = Business.functions.getLeafArray(val).text;
	    }
        } else if(CMPTYPE.treeWindow === cmpType) {
            if (me._isTopN && radioValue.topN === me._cellRadioBtn.getValue().value) {
                val = $.objClone(me._cellComboBox.getValue());
                val.text = "Top " + val.text;
            } else {
                val = $.objClone(me._cellListWin.getValue());
            }
            val = Business.functions.getLeafArray(val).text;
            allText = {text: "", value: ""};
        } else if(CMPTYPE.officeDirection === cmpType) {
            val = $.objClone(me._officeDirection.getValue());
            val = Business.functions.getLeafArray(val).text;
        } else if(CMPTYPE.sdListWindow === cmpType) {
            val = $.objClone(me._sdListWinSTreeWindow.getValue());
            val = Business.functions.getLeafArray(val);
            var val2 = $.objClone(me._sdListWinDTreeWindow.getValue());
            val2 = Business.functions.getLeafArray(val2);
            if(val.text && val2.text) {
                val = val.text + "," + val2.text;
            } else if(val.text && !val2.text) {
                val = val.text;
            }  else if(!val.text && val2.text) {
                val = va2.text;
            }  else {
                val = "";
            }
            allText = {text: "", value: ""};
        } else if(CMPTYPE.sdTreeWindow === cmpType) {
            val = $.objClone(me._sdTreeWinSTreeWindow.getValue());
            val = Business.functions.getLeafArray(val);
            var val2 = $.objClone(me._sdTreeWinDTreeWindow.getValue());
            val2 = Business.functions.getLeafArray(val2);
            if(val.text && val2.text) {
                val = val.text + "," + val2.text;
            } else if(val.text && !val2.text) {
                val = val.text;
            }  else if(!val.text && val2.text) {
                val = va2.text;
            }  else {
                val = "";
            }
            allText = {text: "", value: ""};
        } else {
            return;
        }

        if(val) {
            val = {text: val, value: val};
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
                obj.data.push({value: str, text: AREA_TYPE[str]});
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
        if(1 === areaArr.length) {
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
    Business.area.prototype._getAllOfficeList = function(source, destination){
        var me = this;

        var result = [];
        var sourceList = me._officeDirection.getOData();
        var destinationList = me._officeDirection.getDData();

        sourceList.forEach(function(s, indexS, arrS) {
            destinationList.forEach(function(d, indexD, arrD) {
                if (s.value !== d.value) {
                    var value = s.value + splitMark + d.value;
                    var text = s.text+ "-" + d.text;
                    result.push({text: text, value: value});
                };
            });
        });

        return result.length > 0 ? result : [];
    };

    /**
     * 清除所以组件的值
     * @private
     */
    Business.area.prototype._cleanAllListWindow = function(){
        var me = this;
        var config = me.config;

        me._imsiField.setValue({value: "", text: ""});
        me._listWindow.setValue([]);
        if(me._isTopN){
            me._cellRadioBtn.setValue({value: radioValue.topN});
            me._cellComboBox.setValue({text: topNData[0]+"", value: topNData[0]+""});
        }
        me._cellListWin.setValue([]);
        me._officeDirection.clearData();
        me._sdListWinSTreeWindow.setValue([]);
        me._sdListWinDTreeWindow.setValue([]);
        me._sdTreeWinSTreeWindow.setValue([]);
        me._sdTreeWinDTreeWindow.setValue([]);
    };

})();
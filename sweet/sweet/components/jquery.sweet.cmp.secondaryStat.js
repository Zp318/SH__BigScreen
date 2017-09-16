/** * @fileOverview  * <pre> * 二次统计组件，用户需要设置维度和指标，以及点击统计时的回调函数 * 2014.1.26 * <a href="www.huawei.com">http://www.huawei.com</a> * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved  * </pre> * @version 1.0 */(function($, undefined) {    var i18n = Sweet.cmp.i18n.stat;    var dimsBtns = [        {            value : "toRight",            text : " > "        },{            value : "toLeft",            text : " < "        },{            value : "allToRight",            text : " >> "        },{            value : "allToLeft",            text : " << "        }    ];    var btns = [{                    value : "max",                    text : i18n.max_msg,                    data : "MAX"                },{                    value : "min",                    text : i18n.min_msg,                    data : "MIN"                },{                    value : "sum",                    text : i18n.sum_msg,                    data : "SUM"                },{                    value : "average",                    text : i18n.average_msg,                    data : "AVG"                },{                    value : "counter",                    text : i18n.total_msg,                    data : "COUNT"                },{                    value : "remove",                    text : i18n.delete_msg                }];    $.widget("sweet.widgetCmpSecondaryStat", $.sweet.widgetCmp, /** @lends Sweet.cmp.SecondaryStat*/{        version: "1.0",        eventNames: {},        sweetWidgetName: "[widget-cmp-secondaryStat]",        type: 'secondaryStat',        options: /** @lends Sweet.cmp.SecondaryStat*/{            /**             * 用于生成二次统计时的维度集合信息             * @type Array             * @default []             */            dims : [],            /**             * 用于生成二次统计时的指标的集合信息             * @type Array             * @default []             */            indicators : [],            /**             * 二次统计中，点击统计按钮时的回调函数，用户必须配置             */            statFun : null        },        _destroyWidget : function(){            var me = this;            if(me.wnd){                me.wnd.destroy();            }        },        /**         * @private         * @description 重写父类的渲染方法         */        _render: function() {            var me = this;            me.wnd.show();            return true;        },        /**         * @private         * @description 创建输入域         */        _createCmpWidget: function() {            var me = this,                    w = me.options.width,                    h = me.options.height;            /* 存放维度和指标的两个选择框对象 */            me.selectPanels = [];            /* 创建指标的选择部分 */            me._createTargetSelect();            /* 创建维度的选择部分 */            me._createDimSelect();            me._createWindow();        },        _dealMoveBtns : function(ldata){            var me = this,                    rdimsObj = me.dimsRight;                        if(rdimsObj){                rdimsObj.setData(ldata);            }        },        _moveButtonClick : function(e, v){            var me = this,                    ldata = me.dimLeft.getValue();            switch(v.value){                //移动到右边                case dimsBtns[0].value :                    //左侧没有选择数据时，不进行处理                    if($.isEmptyObject(ldata) || $.isNull(ldata) || ($.isArray(ldata) && ldata.length === 0)){                        return;                    }                    me._dealMoveBtns(ldata);                    break;                //将右边选中的值移动到左边                case dimsBtns[1].value :                    var tempData = me.dimsRight.getData();                    var selectedData = me.dimsRight.getValue();                    if(!tempData || !selectedData){                        return;                    }                    //存放右边除去选中的值剩下的值                    ldata = [];                    var find = false;                    for(var i = 0; i < tempData.length; i++){                        find = false;                        for(var j = 0; j < selectedData.length; j++){                            if(tempData[i].value === selectedData[j].value){                                find = true;                                break;                            }                        }                        if(!find){                            ldata.push(JSON.parse(JSON.stringify(tempData[i])));                        }                    }                    me._dealMoveBtns(ldata);                    break;                //将左边的值全部移动到右边(不管是否选中)                case dimsBtns[2].value :                    ldata = me.dimLeft.getData();                    me._dealMoveBtns(ldata);                    break;                //将右边的值全部移动到左边(不管是否选中)                case dimsBtns[3].value :                    ldata = [];                    me._dealMoveBtns(ldata);                    break;            }        },        /**         * @description 创建维度的选择框         * @private         */        _createDimSelect : function(){            var me = this,                    w = 210,                    h = 190,                    listH = h + 30,                    listW = w + 32,                    btnW = 80;                        var htmlL = '<span class="sweet-cmp-stat-title">' + i18n.analysis_dimensions_msg + '</span>';            var htmlR = '<span class="sweet-cmp-stat-title">' + i18n.selected_analysis_dimensions_msg + '</span>';            me.dimLeft = new Sweet.list.OptimizeList({                width : listW,                height : h,                multi : true,                isBorder : true,                data : me.options.dims            });            var ltemp = new Sweet.panel.VPanel({                width : listW,                height : listH,                padding : 2,                items : [{                        html : htmlL                }, me.dimLeft]            });            /* < 按钮*/            me.toRightBtn = new Sweet.form.Button({                value : dimsBtns[0],                width : btnW            });            me.toRightBtn.addListener("click", function(e, v){                me._moveButtonClick(e, v);            });                        /* min按钮*/            me.toLeftBtn = new Sweet.form.Button({                value : dimsBtns[1],                width : btnW            });            me.toLeftBtn.addListener("click", function(e, v){                me._moveButtonClick(e, v);            });                        /* 求和按钮*/            me.toAllRightBtn = new Sweet.form.Button({                value : dimsBtns[2],                width : btnW            });            me.toAllRightBtn.addListener("click", function(e, v){                me._moveButtonClick(e, v);            });                        /* 平均按钮*/            me.toAllLefttBtn = new Sweet.form.Button({                value : dimsBtns[3],                width : btnW            });            me.toAllLefttBtn.addListener("click", function(e, v){                me._moveButtonClick(e, v);            });                        var allbtns = [me.toRightBtn, me.toLeftBtn, me.toAllRightBtn, me.toAllLefttBtn];            me.vpDimsBtns = new Sweet.panel.VPanel({                height : "100%",                width : btnW,                margin : [60, 0, 5, 0],                items : allbtns            });                        me.dimsRight = new Sweet.list.OptimizeList({                width : listW,                height : h,                multi : true,                isBorder : true,                data : []            });            var rtemp = new Sweet.panel.VPanel({                width : listW,                height : listH,                padding : 2,                items : [{                        html : htmlR                }, me.dimsRight]            });            me.hDimspanel = new Sweet.panel.HPanel({                width : "100%",                height : listH,                padding : 10,                itemExtend : false,                items : [ltemp, me.vpDimsBtns, rtemp]            });            me.selectPanels.push(me.hDimspanel);        },        /**         * @description 创建指标的选择框和相应的计算公式按钮         * @private         */        _createTargetSelect : function(){            var me = this,                    w = 210,                    h = 190,                    listH = h + 30,                    listW = w + 32,                    btnW = 80;                        var htmlL = '<span class="sweet-cmp-stat-title">' + i18n.indicators_msg + '</span>';            var htmlR = '<span class="sweet-cmp-stat-title">' + i18n.statistics_item_msg + '</span>';            me.targetLeft = new Sweet.list.OptimizeList({                width : listW,                height : h,                multi : true,                isBorder : true,                data : me.options.indicators            });            var ltemp = new Sweet.panel.VPanel({                width : listW,                height : listH,                padding : 2,                items : [{                        html : htmlL                }, me.targetLeft]            });            /* max按钮*/            me.maxBtn = new Sweet.form.Button({                value : btns[0],                width : btnW            });            me.maxBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        /* min按钮*/            me.minBtn = new Sweet.form.Button({                value : btns[1],                width : btnW            });            me.minBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        /* 求和按钮*/            me.sumBtn = new Sweet.form.Button({                value : btns[2],                width : btnW            });            me.sumBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        /* 平均按钮*/            me.averageBtn = new Sweet.form.Button({                value : btns[3],                width : btnW            });            me.averageBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        /* 计算按钮*/            me.countBtn = new Sweet.form.Button({                value : btns[4],                width : btnW            });            me.countBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        /* delete按钮*/            me.removeBtn = new Sweet.form.Button({                value : btns[5],                highLight : true,                imageType : "delete",                width : btnW            });            me.removeBtn.addListener("click", function(e, v){                me._DimButtonClick(e, v);            });                        var allbtns = [me.maxBtn, me.minBtn, me.sumBtn, me.averageBtn, me.countBtn, me.removeBtn];            me.vpBtns = new Sweet.panel.VPanel({                height : "100%",                width : btnW,                margin : [30, 0, 5, 0],                items : allbtns            });                        /* 指标右边的已经选择框 */            var rData = [];            if(me.options.indicators && me.options.indicators.length === 0){                rData.push(btns[4]);            }            me.targetRight = new Sweet.list.OptimizeList({                width : listW,                height : h,                multi : true,                isBorder : true,                data : rData            });            var rtemp = new Sweet.panel.VPanel({                width : listW,                height : listH,                padding : 2,                items : [{                        html : htmlR                }, me.targetRight]            });            me.hpanel = new Sweet.panel.HPanel({                width : "100%",                height : listH,                padding : 10,                itemExtend : false,                items : [ltemp, me.vpBtns, rtemp]            });            me.selectPanels.push(me.hpanel);        },        /**         * @private         * @description 处理max,min,sum, avg按钮的点击事件         * @param {type} leftDims  左侧的框中选择的值         * @param {String} value  标示是那个按钮         * @param {String} funcString 按钮的函数表现形式，函数名         */        _dealBtns : function(leftDims, value, funcString){            var me = this,                    RL = me.targetRight;            if($.isArray(leftDims) && leftDims.length > 0){                var temp = [];                var rdata = RL.getData();                for(var i = 0; i < leftDims.length; i++){                    temp.push({                        value : leftDims[i].value + "_&#&_" + funcString,                        text : leftDims[i].text + "(" + value + ")",                        data : funcString                    });                }                //判断右边是否有重复的，如果有重复的，不加到右边                for(var j = 0; j < temp.length; j++){                    var find = false;                    for(var k = 0; k < rdata.length; k++){                        if(temp[j].value === rdata[k].value && temp[j].text === rdata[k].text){                            find = true;                            break;                        }                    }                    if(find){                        temp.splice(j, 1);                        j--;                    }                }                //如果完全重复，则刷新                if(temp.length > 0){                    temp = rdata.concat(temp);                    RL.setData(temp);                }            }        },        /**         * @private         * @description 处理指标的各个计算按钮         * @param {type} e         * @param {type} v         */        _DimButtonClick : function(e, v){            var me = this,                    LL = me.targetLeft,                    RL = me.targetRight;                        var rightDims = RL.getValue();            var leftDims = LL.getValue();            switch(v.value){                //最大值                case btns[0].value :                    me._dealBtns(leftDims, btns[0].text, btns[0].data);                    break;                //最小值                case btns[1].value :                    me._dealBtns(leftDims, btns[1].text, btns[1].data);                    break;                //求和                case btns[2].value :                    me._dealBtns(leftDims, btns[2].text, btns[2].data);                    break;                //平均                case btns[3].value :                    me._dealBtns(leftDims, btns[3].text, btns[3].data);                    break;                //计数,只能在右边加入一次，后面不再加入                case btns[4].value :                    var rdata = RL.getData();                    var find = false;                    for(var i = 0; i < rdata.length; i++){                        if(rdata[i].value === btns[4].value){                            find = true;                        }                    }                    if(!find){                        rdata.push(btns[4]);                        RL.setData(rdata);                    }                    break;                //删除                case btns[5].value :                    //只有右边选择才进行操作                    if($.isArray(rightDims) && rightDims.length > 0){                        var rdata = RL.getData();                        var temp = [];                        for(var i = 0; i < rdata.length; i++){                            var find = false;                            for(var j = 0; j < rightDims.length; j++){                                //必须data也要相同，才能证明是同一个                                if(rdata[i].value === rightDims[j].value){                                    find = true;                                    break;                                }                            }                            if(!find){                                temp.push(rdata[i]);                            }                        }                        RL.setData(temp);                    }                    break;            }        },        /**         * @description 创建window并将维度和指标选择框合并在window上         * @private         */        _createWindow : function(){            var me = this,                    vPanel;            /* vpanel中上半部分是维度选择框，下半部分是指标选择框*/            vPanel = new Sweet.panel.VPanel({                height : "100%",                width : "100%",                items : me.selectPanels            });                        var calculatBtn = new Sweet.form.Button({                width : 80,                highLight : true,                value : {                    value: "calculatBtn",                     text: i18n.calculation_msg                }            });            /* 监听统计Button点击事件*/            calculatBtn.addListener("click", function(e){                me._counterStat(e, me);            });            var cancelBtn = new Sweet.form.Button({                width : 80,                value : {                    value: "cancelBtn",                     text: i18n.cancel_msg                }            });            /* 关闭window */            cancelBtn.addListener("click", function(e){                me.wnd.close();            });            /* 创建window*/            me.wnd = new Sweet.Window({                widgetClass : "sweet-cmp-stat-window",                width: 605,                height: 550,                title: i18n.secondary_statistics_msg,                content: vPanel,                buttons : [calculatBtn, cancelBtn]            });        },        /**         * @description 点击统计按钮时的动作: 1.查检是否选择了维度或指标，如果没有弹出提示;2.拼接选择的维度和指标形成接口参数         * @private         * @param {Event} e 点击 事件         * @param {Object} me 二次统计组件对象         */        _counterStat : function(e, me){            var statParams = {                        "DIM" : [],                        "COUNTER" : []                    },                    dimValues,                    tValues,                    isalert = false,                    alertContent = "";            //取得选择的指标值            tValues = me.targetRight.getData();            dimValues = me.dimsRight.getData();                        //先检查用户是否选择了相应的维度或指标值，如果没则弹出提示框            if(!tValues || tValues.length <= 0){                isalert = true;                alertContent = i18n.select_indicators_msg;            }            if(!dimValues || dimValues.length <= 0){                isalert = true;                alertContent = i18n.analysis_dimension_msg;            }            if(isalert){                Sweet.Dialog.alert({                        width: 330,                        height: 130,                        prompt : i18n.prompt_msg,                        message: alertContent                    });                return;            }                        for(var i = 0; i < tValues.length; i++){                var temp = tValues[i].value === btns[4].value ? "*" : tValues[i].value;                temp = temp.split("_&#&_")[0];                statParams.COUNTER.push({                   value :  temp,                   text : tValues[i].text,                   func : tValues[i].data                });            }                        for(var j = 0; j < dimValues.length; j++){                statParams.DIM.push({                   value :  dimValues[j].value,                   text : dimValues[j].text                });            }                        //触发统计点击事件，并带给相应的参数            if(me.options.statFun && $.isFunction(me.options.statFun)){                me.options.statFun(statParams);            }            me.wnd.close();        },        /**         * @private         * @description 获取组件宽度         */        _getWidth: function() {            var me = this;            return me.cmpEl.externalWidth();        },        /**         * @private         * @description 获取组件高度         */        _getHeight: function() {            var me = this;            return me.cmpEl.externalHeight();        },        /**         * @private         * @description 设置组件宽度         * @param {Number/String} width 组件宽度         */        _setWidth: function(width) {            var me = this;            me.cmpEl.externalWidth(width);        },        /**         * @private         * @description 设置组件高度         * @param {Number/String} height 组件高度         */        _setHeight: function(height) {            var me = this;            me.cmpEl.externalHeight(height);        },        /**         * @private         * @description 设置组件宽度、高度         * @param {Number/String} width 宽度         * @param {Number/String} height 高度         */        _setWH: function(width, height) {            var me = this;            me._setWidth(width);            me._setHeight(height);        }    });    /**     * 二次统计业务组件     * @name Sweet.cmp.SecondaryStat     * @class      * @extends jquery.sweet.cmp.js     * @requires         * <pre>     * jquery.sweet.cmp.js     * jquery.ui.core.js     * jquery.ui.widget.js     * jquery.sweet.widget.js     * jquery.sweet.list.js     * jquery.sweet.list.list.js     * jquery.sweet.cmp.optimizeListWindow.js     * </pre>     * @example      * <pre>     *  sweetList = new Sweet.cmp.SecondaryStat({     *              dims : [],     *              indicators : [],     *              statFun : function()//回调函数     *          });     * </pre>     */    Sweet.cmp.SecondaryStat = $.sweet.widgetCmpSecondaryStat;}(jQuery));
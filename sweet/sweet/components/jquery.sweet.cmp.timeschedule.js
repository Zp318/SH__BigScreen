/**
 * @fileOverview 忙时组件
 * @date 2012/11/25
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.sweet.widget.js
 *  jquery.sweet.widget.form.js
 *  jquery.sweet.widget.form.input.js
 *  jquery.sweet.widget.form.checkbox.js
 *  jquery.sweet.widget.form.button.js
 *  jquery.sweet.cmp.js
 */
(function($, undefined) {
    var liPicClass = "sweet-cmp-timeschedule-panel-li-pic",
            spanSelectedClass = "sweet-cmp-timeschedule-span",
            textButtonClass = "sweet-cmp-timeschedule-textButtonDiv",
            inputParentClass = "sweet-cmp-timeschedule-inputParent",
            normalClass = "sweet-cmp-timeschedule-normal",
            grayClass = "sweet-cmp-timeschedule-gray",
            inputElClass = "sweet-cmp-timeschedule-input",
            imageButtonClass = "sweet-cmp-timeschedule-imageButton",
            clearElClass = "sweet-cmp-timeschedule-clearEl",
            textGrayClass = "sweet-form-timeschedule-textGray",
            defaultInputEmptyDivClass = "sweet-form-timeschedule-emptyDiv";

    $.widget("sweet.widgetCmpTimeschedule", $.sweet.widgetCmp, {
        version: "1.0",
        sweetWidgetName: "[widget-cmp-timeschedule]",
        defaultElement: "<div>",
        type: "timeschedule",
        // form组件公共配置参数
        options: {
            /**
             * @description 按钮宽度
             * @type {String/Number}
             * @default 50px
             */
            width: 50,
            /**
             * @description 按钮高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 显示类型
             * @type Number 
             * @default 1 
             */
            type: 1,
            /**
             * @description 是否显示选项的提示
             * @type Boolean
             * @default false
             */
            tip :false,
            /**
             * @description 是否可编辑
             * @type Boolean
             * @default false
             */
            editable: false,
            /**
             * @description 组件是否不可用
             * @type Boolean
             * @default false
             */
            disabled: false,
            /**
             * @description 输入框为空时显示的字符
             * @type {Object/String/Number}
             * @default "请选择..."
             */
            emptyText: Sweet.core.i18n.combobox.pleaseCheck
        },
        /**
         * @description设置组件只读
         * @param {Boolean} editable true/false
         */
        setEditable: function(editable) {
            var me = this;
            if(!me.inputEl || me.disabled) {
                return;
            }
            me.inputEl.removeAttr("readonly")
                    .attr("readOnly", !editable);
            me.editable = editable;
        },
        /**
         * @description 设置组件是否可用
         * @param {Boolean} disabled true不可用 false可用
         */
        setDisabled: function(disabled) {
            var me = this;
            if ("boolean" !== typeof disabled) {
                me._error("setDisabled() Input parameter is not a Boolean type!");
                return;
            }

            if(me.inputEl) {
                me.inputEl.removeAttr("readonly")
                        .attr("readonly", disabled);
            }
            me._setDisabled(disabled);
            me.options.disabled = disabled;
            me.disabled = disabled;
            if(!disabled) {
                // 若配置了editable，再设置disabled不起作用
                if(false === me.editable) {
                    me.setEditable(false);
                }
            }
        },
        /**
         * @description 获取组件是否可用状态
         */
        getDisabled:function(){
            return this.options.disabled;
        },
        /**
         * @public
         * @description 清除选择的内容和文本
         */
        clear : function(){
            var me = this;
            // 修改图片样式
            for(var key in me.aElObjs) {
                if(me.aElObjs[key].hasClass(spanSelectedClass)) {
                    me.aElObjs[key].removeClass(spanSelectedClass);
                }
            }
            // 文本框内容去掉
            if(me.inputEl) {
                me.inputEl.val("");
                me._setTitle("");
                me._setEmptyText();
            }
            me.selectedTimeNum = [];
        },
        /**
         * @private
         * 设置组件禁用时样式
         */
        _setDisabled: function(disabled) {
            var me = this;
            if(me.button) {
                me.button.setDisabled(disabled);
                me.checkbox.setDisabled(disabled);
            }
            if(disabled) {
                if(me.inputEl) {
                    me.inputEl.addClass(textGrayClass);
                    me.inputParentDivEl.removeClass(normalClass)
                            .addClass(grayClass);
                    me.imageButton.removeClass(normalClass)
                            .addClass(grayClass)
                            .addClass(textGrayClass);
                    me._setEmptyText(true);
                }  
            } else {
                if(me.inputEl) {
                    me.inputEl.removeClass(textGrayClass);
                    me.inputParentDivEl.removeClass(grayClass)
                            .addClass(normalClass);
                    me.imageButton.removeClass(textGrayClass)
                            .removeClass(grayClass)
                            .addClass(normalClass);
                    me._setEmptyText();
                }
            }
        },
        /**
         * @description 获取组件值
         * @param {Object} value
         */
        _setValue: function(value) {
            var me = this,
                    options = me.options,
                    val = value.text.split(" "),
                    len = val.length;
            
            // 获取选中的时间段
            me.selectedTimeNum = [];
            if(2 > len) {
                return;
            }
            var s, e;
            for(var i = 0; i < len - 1; i++) {
                s = parseInt(val[i].substr(0, 2), 10);
                e = parseInt(val[i].substr(6, 2), 10);
                if(e - 1 === s) {
                    me.selectedTimeNum.push(s);
                } else {
                    for(var j = s; j < e; j++) {
                        me.selectedTimeNum.push(j);
                    }
                }
            }

            // 去掉所有图片的样式
            for(var key in me.aElObjs) {
                if(me.aElObjs[key].hasClass(spanSelectedClass)) {
                    me.aElObjs[key].removeClass(spanSelectedClass);
                }
            }

            // 修改选中图片的样式
            var len2 = me.selectedTimeNum.length;
            for(var n = 0; n < len2; n++) {
                me.aElObjs[me.selectedTimeNum[n]].addClass(spanSelectedClass);
            }

            // 设置文本框内容
            me._setInputText();
        },
        /**
         * @description 设置组件值
         * @return 返回值
         */
        _getValue: function() {
            var me = this,
                    text = me._getTimeText();
            return {text: text, value: text};
        },
        /**
         * @private
         * 关闭浮动面板
         */
        _closeFloatPanel: function() {
            var me = this;
            if(!me.openPanelElFlag && "block" === me.divPanelEl.css("display")) {
                me.divPanelEl.fadeOut(150);
            }
            me.openPanelElFlag = false;
        },
        /**
         * @private
         * 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this,
                    options = me.options;
            if (!me._super(id)) {
                return false;
            }
            me.cmpEl.appendTo(me.renderEl);
            if(1 === options.type) {
                me.checkbox.render(options.id);
                me.button.render(options.id);
            } else {
                me.textButtonDiv.appendTo(me.cmpEl);
            }

            me.rendered = true;
        },
        /**
         * @private
         * @description 创建form组件总入口
         */
        _createCmpWidget: function() {
            var me = this,
                options = me.options,
                    busyhourClass = "sweet-cmp-timeschedule";
            me.cmpEl.addClass(busyhourClass);
            if(1 === options.type) {
                me._createCheckBox();
                me._createButton();
            } else {
                me._createTextField();
            }
            me._createBusyHourPanel();
            me._setEmptyText();
            me.selectedTimeNum = [];
        },
        /**
         * @private
         * 创建复选框
         */
        _createCheckBox: function() {
            var me = this,
                    checkboxClass = "checkbox",
                    checkbox;
            checkbox = new Sweet.form.CheckBox({
                widgetClass: checkboxClass,
                height: 25
            });
            me.checkbox = checkbox;
        },
        /**
         * @private
         * 创建按钮
         */
        _createButton: function() {
            var me = this,
                    buttonClass = "button",
                    button;
            button = new Sweet.form.Button({
                widgetClass: buttonClass,
                value: {"text": Sweet.cmp.i18n.timeSchedule.buttonText}
            });
            button.addListener("click", function() {
                me.openPanelElFlag = false;
                if ("block" === me.divPanelEl.css("display")) {
                    return;
                }
                // 计算位置
                var maxIndex = $.getMaxZIndex(me.divPanelEl.css("z-index")),
                        offset = me.__getPanelElOffset(me.button.formEl, me.divPanelEl);
                me.divPanelEl.css({"z-index": maxIndex, left: offset.left, top: offset.top}).show();
                me.openPanelElFlag = true;
            });
            me.button = button;
        },
        /**
         * @private
         * 创建文本框和按钮
         */
        _createTextField: function() {
            var me = this,
                    options = me.options,
                    textButtonDiv = me.textButtonDiv = $("<div>").addClass(textButtonClass),
                    inputParentDivEl = me.inputParentDivEl = $("<div>").addClass(inputParentClass)
                        .appendTo(textButtonDiv),
                    inputEl = me.inputEl = $("<input>").attr("type", "text")
                        .addClass(inputElClass)
                        .appendTo(inputParentDivEl),
                    imageButton = me.imageButton = $("<span>").text("···")
                        .addClass(imageButtonClass)
                        .appendTo(textButtonDiv);

            if($.isNotNull(options.vID)){
                inputEl.attr("id", options.vID);
            }
        },
        /**
         * @private
         * 创建忙时面板
         */
        _createBusyHourPanel: function() {
            var me = this,
                    divClass = "sweet-cmp-timeschedule-panel",
                    ulClass = "sweet-cmp-timeschedule-panel-ul",
                    divPanelEl = me.divPanelEl = $("<div>").addClass(divClass + " " + me.floatBgClass).hide(),
                    ulEl = $("<ul>").addClass(ulClass).appendTo(divPanelEl),
                    aElObjs = me.aElObjs = {},
                    liPic1 = me.liPic1 = me._createBusyHourPicItem(0),
                    liNum1 = me._createBusyHourNumItem(0, 13),
                    liPic2 = me.liPic2 = me._createBusyHourPicItem(1),
                    liNum2 = me._createBusyHourNumItem(12, 25),
                    // 问题单号：DTS2013072707340。对清空按钮国际化
                    clearEl = me.clearEl = $("<a>").addClass(clearElClass)
                        .text(Sweet.core.i18n.listbox.clearAll);
            liPic1.appendTo(ulEl);
            liNum1.appendTo(ulEl);
            liPic2.appendTo(ulEl);
            liNum2.appendTo(ulEl);
            clearEl.appendTo(divPanelEl);
            divPanelEl.bind("click", function(event){
                        event.stopPropagation();
            }).select(function() {
                return false;
            }).appendTo("body");
        },
        /**
         * @private
         * 创建忙时面板选中条
         */
        _createBusyHourPicItem: function(row) {
            var me = this,
                    liPicEl = $("<li>").addClass(liPicClass),
                    ulEl = $("<ul>").appendTo(liPicEl),
                    liEl = $("<li>").appendTo(ulEl),
                    aEl,
                    aElObjs = me.aElObjs,
                    num = 0;
            for (var i = 0; i < 12; i++) {
                num = i + row * 12;
                aEl = $("<span>").data("num", parseInt(num, 10))
                        .attr("value", (i + "~" + (i+1)))
                        .appendTo(liEl);
                aElObjs[num] = aEl;
            }
            return liPicEl;
        },
        /**
         * @private
         * 创建忙时面板数字条
         * @param {Number} begin 开始数值
         * @param {Number} end 结束数值
         */
        _createBusyHourNumItem: function(begin, end) {
            var me = this,
                    liNumClass = "sweet-cmp-timeschedule-panel-li-num",
                    liNumEl = $("<li>").addClass(liNumClass),
                    emEl;
            for (var i = begin; i < end; i++) {
                emEl = $("<em>").val(i)
                        .text(i)
                        .on("selectstart", me._unselectable)
                        .appendTo(liNumEl);
            }
            return liNumEl;
        },
        /**
         * @private
         * 获取选中的时间段，并设置文本框内容
         */
        _getSelectedTime : function() {
            var me = this;
            
            me.selectedTimeNum = [];
            
            for(var key in me.aElObjs) {
                if(me.aElObjs[key].hasClass(spanSelectedClass)) {
                    me.selectedTimeNum.push(me.aElObjs[key].data("num"));
                }
            }

            me._setInputText();
        },
        /**
         * @private
         * 设置文本框的内容
         */
        _setInputText : function() {
            var me = this;

            if(!me.inputEl) {
                return;
            }
            var text = me._getTimeText();
            me.inputEl.val(text);
            me._setTitle(text);
            me._setEmptyText();
        },
        /**
         * @private
         * 获取起始~结束时间的文本
         */
        _getTimeText : function() {
            var me = this, 
                    options = me.options,
                    selectedTimeNum = me.selectedTimeNum,
                    len = selectedTimeNum.length,
                    selectedTimeFlag = me.selectedTimeFlag = [];

            // 获取标志数组
            if(0 === len){
                return "";
            }
            if(1 === len) {
                selectedTimeFlag[0] = "O";
            }
            if(2 === len) {
                if(selectedTimeNum[0] + 1 === selectedTimeNum[1]) {
                    selectedTimeFlag[0] = "S";
                    selectedTimeFlag[1] = "E";
                } else {
                    selectedTimeFlag[0] = selectedTimeFlag[1] = "O";
                }
            }
            if(3 <= len) {
                if(selectedTimeNum[0] + 1 === selectedTimeNum[1]) {
                    selectedTimeFlag[0] = "S";
                } else {
                    selectedTimeFlag[0] = "O";
                }
                if(selectedTimeNum[len - 1] - 1 === selectedTimeNum[len - 2]) {
                    selectedTimeFlag[len - 1] = "E";
                } else {
                    selectedTimeFlag[len - 1] = "O";
                }
                var now, befor, after, s, e, m, o;
                for(var i = 1; i < len - 1; i++) {
                    now = selectedTimeNum[i];
                    befor = selectedTimeNum[i - 1];
                    after = selectedTimeNum[i + 1];
                    s = (now - 1 !== befor) && (now + 1 === after);
                    e = (now - 1 === befor) && (now + 1 !== after);
                    m = (now - 1 === befor) && (now + 1 === after);
                    o = (now - 1 !== befor) && (now + 1 !== after);
                    if(s) {
                        selectedTimeFlag[i] = "S";
                    } else if(e) {
                        selectedTimeFlag[i] = "E";
                    } else if(m) {
                        selectedTimeFlag[i] = "M";
                    } else {
                        selectedTimeFlag[i] = "O";
                    }
                }
            }
            // 获取文本
            var text = "", start = null, tempText = "";
            for(var j = 0; j < len; j++) {
                if("S" === selectedTimeFlag[j]) {
                    start = selectedTimeNum[j];
                } else if("E" === selectedTimeFlag[j]) {
                    tempText = me._numberToTimer(start, selectedTimeNum[j]);
                    text = text + tempText;
                } else if("O" === selectedTimeFlag[j]) {
                    tempText = me._numberToTimer(selectedTimeNum[j]);
                    text = text + tempText;
                } else {
                    continue;
                }
            }
            return text;
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         * @param {Number} begin 开始数值
         * @param {Number} end 结束数值
         */
        _numberToTimer : function(time1, time2) {
            var me = this, 
                    options = me.options;
            
            var timeText = "";
            if(!time2) {
                time2 = time1 + 1;
                if(time1 < 10) {
                    time1 = "0" + time1;
                }
                // 修改问题单：DTS2013072705369，9时不应该显示为9:00，应该为09:00
                if(time2 < 10) {
                    time2 = "0" + time2;
                }
                timeText = time1 + ":00-" + time2 + ":00; ";
            } else {
                if(time1 < 10) {
                    time1 = "0" + time1;
                }
                time2 = time2 + 1;
                if(time2 < 10) {
                    time2 = "0" + time2;
                }
                timeText = time1 + ":00-" + time2 + ":00; ";
            }
            return timeText;
        },
        /**
         * @private
         * 设置提示内容
         * @param {String} 提示内容
         */
        _setTitle : function(tips) {
            var me = this, 
                    options = me.options;
            if(!me.inputEl || !options.tip) {
                return;
            }
            me.inputEl.attr("title", tips);
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget : function() {
            var me = this, 
                    options = me.options;
            
            me.setEditable(options.editable);
            me.setDisabled(options.disabled);
            if(me.imageButton) {
                me.imageButton.bind("click", function(event) {
                    if(me.imageButton.hasClass(grayClass)) {
                        return;
                    }
                    me.openPanelElFlag = false;
                    if ("block" === me.divPanelEl.css("display")) {
                        return;
                    }
                    // 计算位置
                    var maxIndex = $.getMaxZIndex(me.divPanelEl.css("z-index")),
                            offset = me.__getPanelElOffset(me.inputParentDivEl, me.divPanelEl);
                    me.divPanelEl.css({"z-index": maxIndex, left: offset.left, top: offset.top}).fadeIn(300);
                    me.openPanelElFlag = true;
                });
            }
            if(me.inputEl) {
                me.inputEl.bind("click", function(event) {
                    if("block" === me.divPanelEl.css("display")) {
                        event.stopImmediatePropagation();
                    }
                }).focus(function(){
                    me._setEmptyText(true);
                }).blur(function() {
                    if(me.disabled) {
                        return;
                    }
                    me._setEmptyText();
                });
            }
            me.clearEl.bind("click", function(event) {
                me.clear();
            });
            me.liPic1.children().children().selectable({
                stop: function() {
                    me._selectedStop();
                }
            });
            me.liPic2.children().children().selectable({
                stop: function() {
                    me._selectedStop();
                }
            });
        },
        /**
         * 停止滑动选择后执行
         * @private
         */
        _selectedStop: function() {
            var me = this;
            for(var key in me.aElObjs) {
                if(!me.aElObjs[key].hasClass("ui-selected")) {
                    continue;
                }
                if(!me.aElObjs[key].hasClass(spanSelectedClass)) {
                    me.aElObjs[key].removeClass("ui-selected").addClass(spanSelectedClass);
                } else {
                    me.aElObjs[key].removeClass("ui-selected").removeClass(spanSelectedClass);
                }
            }
            me._getSelectedTime();
        },
        /**
         * 销毁组件
         * @private
         */
        _destroyWidget: function() {
            var me = this;
            me._super();
            if(me.inputEl) {
                me.inputEl.trigger("mouseout");
            }
            delete me.aElObjs;
            delete me.selectedTimeNum;
            delete me.selectedTimeFlag;
        },
        /**
         * 文本框为空时设置显示的字符
         * @private
         * @param {Boolean} 是否由获得焦点事件触发
         */
        _setEmptyText: function(isFocus) {
            var me = this;
            if(!me.inputEl) {
                return;
            }
            if (!me.options.emptyText) {
                return;
            }
            isFocus = isFocus || false;
            // 文本框为空时，显示配置的为空字符
            var val = me.inputEl.val();
            // 首次进来，创建为空显示字符的div
            if(!me.emptyDiv) {
                var emptyDiv = me.emptyDiv = $("<div>").addClass(defaultInputEmptyDivClass)
                    .appendTo(me.inputParentDivEl);
                emptyDiv.html(me.options.emptyText);
                emptyDiv.bind("click", function(event){
                            $(this).hide();
                            // 下拉框需要打开展开框
                            me.inputEl.click();
                            // 文本框
                            me.inputEl.focus();
                            event.stopImmediatePropagation();
                        }).bind("mouseover", function() { // 该div阻止了文本框的mouseover和mouseout事件
                            me.inputEl.trigger("mouseover");
                        }).bind("mouseout", function() {
                            me.inputEl.trigger("mouseout");
                        });
            }
            // 获得焦点
            if(isFocus) {
                if ("block" === me.emptyDiv.css("display")) {
                    me.emptyDiv.hide();
                }
            } 
            // 失去焦点 或者 组件渲染后自动执行
            else {
                if (!val) {
                    me.emptyDiv.show();
                } else {
                    me.emptyDiv.hide();
                }
            }
        },
        /**
         * @private
         * @description 初始化弹出框位置
         * @param {Object} targetEl 目的对象
         * @param {Object} floatEl 弹出对象
         */
        __getPanelElOffset: function(targetEl, floatEl) {
            var me = this,
                    tOffset = targetEl.offset(),
                    _top = 0,
                    _left = 0,
                    _t2 = 2,
                    win = $(window),
                    doc = $(document),
                    maxShown = win.height() + doc.scrollTop(),
                    maxVShown = win.width() + doc.scrollLeft(),
                    targetElHeight = targetEl.outerHeight(true),
                    floatElWidth = floatEl.outerWidth(true),
                    floatElHeight = floatEl.outerHeight(true),
                    tw1;
            _top = tOffset.top + targetElHeight + _t2;
            _left = tOffset.left;
            tw1 = maxVShown - (floatElWidth + tOffset.left);
            if (tw1 <= 0) {
                _left = _left + tw1 - _t2;
            }
            // 下面显示不下浮动框，且上面可以显示下浮动框，才选择在上面显示
            if (maxShown - tOffset.top - targetElHeight <= floatElHeight) {
                if (tOffset.top >= floatElHeight) {
                    _top = tOffset.top - floatElHeight - _t2;
                }
            }
            return {"left": _left, "top": _top};
        }
    });

    /**
     * 忙时组件
     */
    Sweet.cmp.TimeSchedule = $.sweet.widgetCmpTimeschedule;
}(jQuery));

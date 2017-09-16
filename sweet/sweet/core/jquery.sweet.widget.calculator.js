/**
 * @fileOverview
 * <pre>
 * 类组件--计算器组件
 * 2013/2/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($, undefined) {
    /**
     * 保存组件对象
     */
    /*var buttonValue = ["Max", "Min", "Avg", "Sum", "Count", "7", "8", "9", "+",
        "(", "4", "5", "6", "-", ")", "1", "2", "3", "*", "&lt;", "0",
            "Del", ".", "/", "&gt;"],*/ // 业务需求，暂时屏蔽聚合函数; 去掉 "&lt;","&gt;"
    var buttonValue = ["7", "8", "9", "+",
                "(", "4", "5", "6", "-", ")", "1", "2", "3", "*", "Del", "0",
                    ".", "/"],
        defaultInputEmptyDivClass = "sweet-calculator-textarea-input-emptyDiv";
    var consEnum = {
        NCZERO: 0,
        NCONE: 1,
        NCTWO: 2,
        NCTHREE: 3,
        WIDTH: 40,
        THEIGHT: 7,
        TPERCENTAGE: 0.1,
        TAHEIGHT: 8,
        TAWIDTH: 8,
        TAPERCENTAGE: 0.43,
        BHEIGHT: 10,
        BPERCENTAGE: 0.47
    }; 
    
    $.widget("sweet.widgetCalculator", $.sweet.widget, /** @lends Sweet.Calculator.prototype*/{
        version : "1.0",
        sweetWidgetName : "[widget-calculator]:",
        type : "calculator",
        eventNames: /** @lends Sweet.Calculator.prototype*/{
            /**
            * @event
            * @description 删除事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            clear: "删除事件"
        },
        // calculator组件公共配置参数
        options : /** @lends Sweet.Calculator.prototype*/{
            /**
             * @description 组件默认宽度
             * @type {String/Number}
             * @default 480px
             */
            width : 480,

            /**
             * @description 组件默认高度
             * @type {String/Number}
             * @default 300px
             */
            height : 300
        },

        /**
         * @description 可从外部拖动添加公式
         * @param {Object} value 组件值
         */
        addFormula : function(obj) {
            if ($.isNull(obj)) {
                return;
            }
            var me = this,
                objText = obj.text,
                $t = $(me.formElement)[0],
                myText =  "["+ obj.text+ "]";

            if (objText in me.objMap) {
                me.objMap[objText] = obj;
            } else{
                me.objMap[objText] = obj;
                me.objMap.length++;
            }
            if ($t.selectionStart || consEnum.NCZERO === $t.selectionStart) {
                var startPos = $t.selectionStart,
                    endPos = $t.selectionEnd,
                    restoreTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myText + $t.value.substring(endPos, $t.value.length);
                if (restoreTop > consEnum.NCZERO) {
                    $t.scrollTop = restoreTop;
                }
                $t.focus();
                $t.selectionStart = startPos + myText.length;
                $t.selectionEnd = startPos + myText.length;
            } else {
                $t.value += myText;
                $t.focus();
            }
        },

        /**
         * @description 取得文本域
         * @return {object} textAreaObj
         */
        getTextAreaObj : function() {
            var me = this,
                textAreaObj = me.formElement;
            return textAreaObj;
        },
        
        /**
         * @description 可删除从外部拖动添加的公式
         * @param {array} obj 要删除的拖入的对象数组         
         */
        deleteFormula : function(array) {
            var me = this,
                text = me.formElement.val(),
                name,
                names,
                val = "",
                flag,
                delArray = [],
                valTest = text;
            if ($.isNull(array)) {
                return;
            }
            // 循环找出源数据中不存在了的拖动数据
            for (name in me.objMap) {
                if ($.isNotNull(me.objMap[name].value)) {
                    for (var i = 0; i < array.length; i++) {
                        flag = false;
                        if (me.objMap[name].value === array[i].value) {
                            flag = true;
                        }
                        if (!(flag === true)) {
                            delArray.push(array[i]);
                            delete me.objMap[array[i].text];
                            me.objMap.length--;
                        }
                    }
                }
            }
            for (var j = 0; j < delArray.length; j++) {
                names = $.regExp.escape("[" + delArray[j].text + "]");
                var reg = new RegExp(names, "g");
                val = valTest.replace(reg, "");
                valTest = val;
            }
            me.formElement.val(valTest);
        },
        /**
         * @descriptio 设置计算器默认公式
         * @param {Object} obj 组件值
         */
        setDefaultFormula : function(obj){
            if ($.isNull(obj)) {
                return;
            }
            var me = this,
                myText = obj.text,
                $t = $(me.formElement)[0];
            var reg = /\[([^\[])*\]/g;
            var tempObj = {}, tempName, nameObj = [];
            if(reg.test(myText)){
                nameObj = myText.match(reg);
                var keyObj = obj.value.match(reg);
                for(var i = 0; i < nameObj.length; i++){
                    tempName = nameObj[i];
                    tempObj[tempName] = {"value":keyObj[i] , "text":nameObj[i]};
                }
            }
            else{
                tempObj = obj;
            }

            me.objMap = tempObj;

            if ($t.selectionStart || consEnum.NCZERO === $t.selectionStart) {
                var startPos = $t.selectionStart,
                    endPos = $t.selectionEnd,
                    restoreTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myText + $t.value.substring(endPos, $t.value.length);
                if (restoreTop > consEnum.NCZERO) {
                    $t.scrollTop = restoreTop;
                }
                $t.focus();
                $t.selectionStart = startPos + myText.length;
                $t.selectionEnd = startPos + myText.length;
            }
        },

        /**
         * @private
         * @description 获取组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue : function() {
            var me = this,
                text = me.formElement.val(),
                name,
                names,
                re,
                val = "",
                reg,
                valTest = text,
                tempReg = /\[([^\[])*\]/g;
            
            // 循环替换
            for (name in me.objMap) {
                if ($.isNotNull(me.objMap[name].value)) {
                    if(!tempReg.test(name) && !tempReg.test(me.objMap[name].value)){
                        names = $.regExp.escape("[" + name + "]");
                        reg = new RegExp(names, "g");
                        val = valTest.replace(reg, "[" + me.objMap[name].value + "]");
                    }
                    else{
                        //针对初始设置过公式值的取法
                        names = name;
                        val = valTest.replace(names, me.objMap[name].value);
                    }

                    valTest = val;
                }
            }
            return {
                value : ($.isNotNull($.trim(val))) ? val : text,
                text : text,
                data: me.objMap
            };
        },
        /**
         * @private
         * @description 获取拖入组件的值
         * @return {Array} 返回值
         */
        getAddedFormula : function() {
            var me = this,
                addedObjArr = [];
            // 循环替换
            for (var name in me.objMap) {
                if ("length" !== name) {
                    addedObjArr.push(me.objMap[name]);
                }
            }
            return addedObjArr;
        },

        /**
         * @private
         * @description 重绘组件
         */
        _doLayout : function() {
            var me = this, 
                options = me.options, 
                width = options.width, 
                height = options.height, 
                calculatorEl = me.calculatorEl;
            calculatorEl.width(width);
            calculatorEl.height(height);
        },

        /**
         * @private
         * @description 创建Calculator组件总入口
         */
        _createSweetWidget : function() {
            if (this.renderEl) {
                return;
            }
            var me = this, 
                options = me.options, 
                calculatorClass = "sweet-calculator", 
                calculatorEl = me.calculatorEl = $("<div>");
            
            // 定义objMap，用来存储从外部拖进来的数据对象
            var objMap;
			objMap = me.objMap = {};
            me.objMap.length = consEnum.NCZERO;
            calculatorEl.addClass(options.widgetClass + " " + calculatorClass)
                        .attr("id", options.id)
                        .width(options.width)
                        .height(options.height);
            
            // 创建calculator组件
            me._createCalculatorWidget();
            
            // 设置为空时显示的字符
            me._setEmptyText(false);
        },
        
        /**
         * @private
         * @description 创建Calculator组件
         */
        _createCalculatorWidget : function() {
            var me = this, 
                options = me.options,
                contentEl;
                contentEl = me.contentEl = $("<div>").appendTo(me.calculatorEl)
                    .addClass("sweet-calculator-module")
                    .addClass(options.widgetClass)
                    .width(options.width)
                    .height(options.height);
            me._createTitleContent();
            me._createTextAreaContent();
            me._createButtonContent();
            me._setEmptyText(false);
        },

        /**
         * @private
         * @description 创建Calculator组件标题部分内部布局
         */
        _createTitleContent : function() {
            var me = this, 
                options = me.options,
                titleClearPicEl, 
                titleEmEl, 
                titleSpanEl, 
                titleDivEl;
            titleDivEl = $("<div>").appendTo(me.contentEl)
                .width(options.width)
                .height((options.height)*consEnum.TPERCENTAGE-consEnum.THEIGHT)
                .addClass("sweet-calculator_title");
            titleEmEl = $("<em>").text(Sweet.core.i18n.calculator.title)
                .css({height : "100%"})
                .appendTo(titleDivEl);
            titleSpanEl = $("<span>").css({height : "100%"})
                .appendTo(titleDivEl);
            titleClearPicEl = $("<a>").attr("title", Sweet.core.i18n.calculator.button)
                        .bind("click", {"me" : me}, function() {
                            me.formElement.val("");
                            me.objMap = {};
                            me.objMap.length = consEnum.NCZERO;
                            me._setEmptyText(false);
                            me._triggerHandler(null, "clear", me.getAddedFormula());
                        })
                        .addClass("sweet-calculator-clearPic")
                        .appendTo(titleSpanEl);
        },

        /**
         * @private
         * @description 创建Calculator组件文本域部分
         */            
         _createTextAreaContent : function() {   
            var me = this,
                options = me.options,
                textAreaClass = "sweet-calculator_textarea",
                formElement = me.formElement = $("<textarea>"),
                width = options.width,
                height = (options.height)*consEnum.TAPERCENTAGE,
                formDiv1El = me.formDiv1El = $("<div>").width(width)
                    .height(height)
                    .addClass("sweet-calculator_textarea_input")
                    .appendTo(me.contentEl),
                formDiv2El = me.formDiv2El = $("<div>").width(width)
                    .height(height).appendTo(formDiv1El),
                value = $.nullToString(options.value);
            me.formElement.focus(function(){
                me._setEmptyText(true);
            });
            me.formElement.blur(function(){
                me._setEmptyText(false);
            });
            formElement.width(options.width-consEnum.TAWIDTH)
                .height((options.height)*consEnum.TAPERCENTAGE-consEnum.TAHEIGHT)
                .keydown(function(){return false;})
                .addClass(textAreaClass).val(value);
            formElement.appendTo(formDiv2El);
        },

        /**
         * @private
         * @description 创建Calculator组件按钮部分的布局
         * @return {Object} 返回按钮对象
         */
        _createButtonContent : function() {
            var me = this, 
                options = me.options,
                buttonAEl = this.buttonAEl,
                buttonLiEl,
                buttonUlEl,
                buttonDivEl = $("<div>").appendTo(me.contentEl)
                    .width(options.width)
                    .height((options.height)*consEnum.BPERCENTAGE - consEnum.BHEIGHT)
                    .addClass("sweet-calculator_button_div");
            var buttonWidth = options.width*0.12;
            var buttonHeight = ((options.height)*consEnum.BPERCENTAGE - consEnum.BHEIGHT)*0.25;
            // 循环创建按钮
            for (var i = 0; i < buttonValue.length; i++) {
                if (14 === i) {
                    buttonAEl = $("<button>").val(buttonValue[i])
                        .bind("click", {"me" : me}, me._onClick)
                        .text(buttonValue[i])
                        .addClass("sweet-calculator_btn")
                        .addClass("sweet-calculator_delBtn")
                        .css({width : buttonWidth, height : buttonHeight *1.8})
                        .css({top : options.height*(consEnum.TPERCENTAGE + 
                                consEnum.TAPERCENTAGE) + buttonHeight*2 + 10});
                } else {
                    if (consEnum.NCZERO === i % 5) {
                        buttonLiEl = $("<li>").css({height : "100%", width:(10 <= i) ? 
                                (buttonWidth + 13)*4 : (buttonWidth + 13)*5});
                        buttonUlEl = $("<ul>").css({height : buttonHeight, width: (10 <= i) ? 
                                (buttonWidth + 13)*4 : (buttonWidth + 13)*5});
                        buttonLiEl.appendTo(buttonUlEl);
                        buttonUlEl.appendTo(buttonDivEl);
                    }
                    buttonAEl = $("<button>").val(buttonValue[i])
                        .bind("click", {"me" : me}, me._onClick)
                        .text(buttonValue[i])
                        .addClass("sweet-calculator_btn")
                        .css({width : buttonWidth,height : buttonHeight*0.8});
                    if (15 === i) {
                        var width = options.width*0.24 + 13;
                        buttonAEl.css({width : width});
                    }
                }
                buttonAEl.appendTo(buttonLiEl);
            }
            return buttonDivEl;
        },
        
        /**
         * @private
         * @description insertAtCursor()函数用来实现根据光标位置插入值 
         * @param {Object} me 计算器组件对象
         * @param {String} myValue 所点击计算器按钮的值
         * @param {Object} formElement 文本域对象
         * @param {Number} startPos/endPos 起始/结束位置
         */
        _insertAtCursor: function(me,myValue,formElement,startPos,endPos) {
            me._setEmptyText(true);
            if (formElement.selectionStart || consEnum.NCZERO === formElement.selectionStart) { 
                // 在加入数据之前获得滚动条的高度
                var restoreTop = formElement.scrollTop;  
                formElement.value = formElement.value.substring(0, startPos) + myValue + 
                    formElement.value.substring(endPos, formElement.value.length);
                if (restoreTop > consEnum.NCZERO) {  // 如果滚动条高度大于0
                    formElement.scrollTop = restoreTop;  // 返回
                }
                me.formElement.focus(); // 输入元素textara获取焦点
                formElement.selectionStart = startPos + myValue.length;
                formElement.selectionEnd = startPos + myValue.length;
            } else { // 在输入元素textarea没有定位光标的情况
                formElement.value += myValue;
                formElement.focus();
            }
        },
        
        /**
         * @private
         * @description iSelectField()函数用来实现删除元素后光标定位
         * @param {Object} formElement 文本域对象
         * @param {Number} start, end 起始/结束位置
         */
        _iSelectField: function(formElement,start, end) {
            // end未定义，则为设置光标位置
            if (arguments[2] === undefined) {
                end = start;
            }
            formElement.selectionStart = start;
            formElement.selectionEnd = end;
            formElement.focus();
        },
        
        /**
         * @private
         * @description countSubst()函数用来实现检索substr在str中出现的次数
         * @param {String} str 源字符串
         * @param {String} substr 目标字符串
         */
        _countSubstr: function(me,str,substr) {
            var count,
                reg,
                names = $.regExp.escape("[" + substr + "]");
            reg = new RegExp(names, "g");
            if(str.match(reg) === null){
                count = consEnum.NCZERO;
            } else {
                count = str.match(reg).length;
            } 
            //return count;
            if (!count) {
                delete me.objMap[substr];
                me.objMap.length--;
            }
        },
        
        /**
         * @private
         * @description 操作错误时的提示信息
         */
        _error: function() {
            Sweet.Dialog.error({
                width : 330,
                height : 130,
                message : Sweet.core.i18n.calculator.tip
            });
        },
        
        /**
         * @private
         * @description 点击清零按钮
         * @param {Object} me 计算器组件对象
         * @param {Object} formElement 文本域对象
         * @param {Number} startPos 起始位置
         */
        _onClickDel: function(me,formElement,startPos) {
            var disp,last;
            //当光标所在位置位于文本域最开始时点击清零无操作
            if (startPos) {
                var v = $(me.formElement).val(), 
                    text;
                   
                // 取当前光标所在位置之前的所有内容
                disp = me.formElement.val().substring(0, startPos);
                    
                //取光标前一个字符
                last = disp.substring(disp.length - consEnum.NCONE, disp.length); 
                    
                //判断文本域当前内容是否为空
                if (v === "") {
                    me._setEmptyText(false);
                }
                    
                /**
                 * @description 使用if语句判断如果当前光标之前的内容是不是一个指标，如果是删除整个指标，否则只删除一个字符
                 */
                if (last === "]") { 
                    // 如果光标前一个字符为"]"，找到与其匹配的"["，删除所有括起来的内容
                    text = disp.substring(disp.lastIndexOf("[") + consEnum.NCONE, startPos - consEnum.NCONE);
                    $(formElement).val(v.substring(0,disp.lastIndexOf("[")) + v.substring(startPos,v.length));
                    me._iSelectField(formElement,startPos - text.length - consEnum.NCTWO);
                    me._countSubstr(me,$(formElement).val(),text);
                } else if(last === "[") { 
                    // 如果光标前一个字符为"["，找到与其匹配的"]"，删除所有括起来的内容
                    var disp1 = v.substring(startPos, v.length);
                    text = disp1.substring(0,disp1.indexOf("]"));
                    $(formElement).val(v.substring(0,startPos-consEnum.NCONE) + 
                            v.substring(startPos + text.length + consEnum.NCONE,v.length));
                    me._iSelectField(formElement,startPos - consEnum.NCONE);
                    me._countSubstr(me,$(formElement).val(),text);
                } else {
                    if (disp.lastIndexOf("[") > disp.lastIndexOf("]")) { 
                        // 如果光标的位置在一个完整的"["和"]"之间，找到匹配的"[]",删除所有括起来的内容
                        var disp2 = v.substring(disp.lastIndexOf("["),v.length);
                        text = disp2.substring(consEnum.NCONE,disp2.indexOf("]"));
                        $(formElement).val(v.substring(0,disp.lastIndexOf("[")) + 
                                v.substring(disp.lastIndexOf("[") + text.length + consEnum.NCTWO,v.length));
                        me._iSelectField(formElement,disp.lastIndexOf("["));
                        me._countSubstr(me,$(formElement).val(),text);
                    } else {
                        $(formElement).val(v.slice(0, startPos - consEnum.NCONE) + v.slice(startPos));
                        me._iSelectField(formElement,startPos - consEnum.NCONE);
                    }
                }
            }
        },
        
        /**
         * @private
         * @description 文本域不为空点击非清零按钮时进行简单校验
         * @param {Object} me 计算器组件对象
         * @param {Object} formElement 文本域对象
         * @param {String} string 所点击计算器按钮的值
         * @param {String} last/lastThree 光标前最后一个/三个字符
         * @param {Number} startPos/endPos 起始/结束位置
         */
        _onClickOther: function(string,last,lastThree,startPos,endPos) {
            var me = this,
                formElement = $(me.formElement)[0];
            if (lastThree === "Max" || lastThree === "Min" || lastThree === "Avg" || 
                    lastThree === "Sum" || lastThree === "unt") {
                        if (string === '(') {
                            me._insertAtCursor(me,string,formElement,startPos,endPos);
                        } else {
                            me._error();
                        }
                    } else {
                        if (last === "(") {
                            if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                    string === ">" || string === "<" || string === '.') {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else if (last === ")") {
                            if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                    string === ">" || string === "<" || string === ")") {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }else {
                                me._error();
                            }
                        } else if (last === ">" || last === "<") {
                            if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                    string === "." || string === ")" || string === ">" || string === "<") {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else if (last === ".") {
                            if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                    string === "." || string === "(" || string === ")" || 
                                    string === "<" || string === ">") {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else if (last === "+" || last === "-" || last === "*") {
                            if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                    string === '.' || string === "<" || string === ">" || string === ")") {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else if (last === "/") {
                            if (string === "+" || string === "-" || string === "*" || 
                                    string === "/" || string === "." || string === "<" || 
                                    string === ">" || string === ")" || string === '0') {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else if (last === "0" || last === "1" || last === "2" || last === "3" || last === "4" || 
                                last === "5" || last === "6" || last === "7" || last === "8" || last === "9") {
                            if (string === "(") {
                                me._error();
                            } else {
                                me._insertAtCursor(me,string,formElement,startPos,endPos);
                            }
                        } else {
                            me._insertAtCursor(me,string,formElement,startPos,endPos);
                        }
                    }
        },
        
        /**
         * @private
         * @description 创建按钮单击事件
         * @param {Object} event 事件
         */
        _onClick : function(event) {
            var button = this, 
                me = event.data.me,
                string = $(button).val(),
                startPos,endPos,disp,last,lastThree,
                formElement = $(me.formElement)[0]; // 将jQuery对象转换为DOM元素
            startPos = formElement.selectionStart; // 得到光标前的位置
            endPos = formElement.selectionEnd; // 得到光标后的位置
            disp = formElement.value.substring(0, startPos); // 起始到光标所在位置的字符串
            last = disp.substring(disp.length - consEnum.NCONE, disp.length); // 光标之前最后一个字符
            lastThree = disp.substring(disp.length - consEnum.NCTHREE, disp.length); // 光标前3个字符

            /**
             * @description 点击按钮时进行简单校验
             */
            if (string === "Del") { // 点击清零按钮
                me._onClickDel(me,formElement,startPos);
                me._triggerHandler(null, "clear", me.getAddedFormula());
            } else { // 点击其他按钮
                string = $.htmlInversEscape(string);
                // 文本域初始值为空时
                if (me.formElement.val() === null) {
                    formElement.focus();
                    if (string === ")") {
                        me._error();
                    } else {
                        if (string === "+" || string === "-" || string === "*" || string === "/" || 
                                string === "." || string === ">" || string === "<") {
                            me._error();
                        } else {
                            me.formElement.val(string);
                        }
                    }
                } 
                // 文本域初始值不为空时
                else { 
                    me._onClickOther(string,last,lastThree,startPos,endPos);
                }
            }
        },
        
        /**
         * @private
         * @description 清空
         */
        clear: function() {
            var me = this;
            me.formElement.val("");
            me.objMap = {};
            me.objMap.length = consEnum.NCZERO;
            me._setEmptyText(false);
            me._triggerHandler(null, "clear", me.getAddedFormula());
        },
        /**
         * @private
         * 文本域为空时设置显示的字符
         * @param {Boolean} isFocus 是否由获得焦点事件触发
         */
        _setEmptyText: function(isFocus) {
            var me = this,
                emptyText = Sweet.core.i18n.calculator.emptyText;
            if(!me.formElement) {
                return;
            }
            
            // 文本框为空时，显示配置的为空字符
            var val = me.formElement.val();
            if(!me.emptyDiv) {
                var emptyDiv = me.emptyDiv = $("<div>").addClass(defaultInputEmptyDivClass)
                    .appendTo(me.formDiv2El.css("position", "absolute"));
                emptyDiv.bind("click", function(){
                    $(this).hide();
                    me.formElement.focus();
                });
                
                // 如果有默认值，就隐藏为空的字符
                if(val) {
                    me.emptyDiv.hide();
                }
            }
            if(isFocus) {
                if ("block" === me.emptyDiv.css("display")) {
                    me.emptyDiv.hide();
                }
            } else {
                if (val === "") {
                    me.emptyDiv.show();
                }
            }
        },


        /**
         * @private
         * @description 校验规则
         */
        _validate : function() {},

        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render : function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.calculatorEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },

        /**
         * @private
         * @description 销毁calculator组件
         */
        _destroyWidget : function() {
            if (this.renderEl) {
                this.renderEl.remove();
            }
        },
        /**
         * @private
         * @description 触发注册事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据
         */
        _triggerHandler: function(e, eName, data) {
            var me = this,
                    result;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    result = func.call(null, e, data);
                }
            });
    
            return result;
        }
       });

    /**
     * 创建计算器组件
     * @name Sweet.Calculator
     * @class
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * sweetCalculator =new Sweet.Calculator({
     *      width: 480,
     *      height: 300,
     *      value: "1",
     *      widgetClass: "sweet-calculator-module-bg",
     *      renderTo: "calc"
     * });
     * </pre>
     */
    Sweet.Calculator = $.sweet.widgetCalculator;
}(jQuery));

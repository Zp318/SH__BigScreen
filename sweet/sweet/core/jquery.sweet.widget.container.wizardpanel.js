/**
 * @fileOverview  
 * <pre>
 * 容器组件-向导布局容器
 * 2013/2/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var leftElSelectedClass = "sweet-wizard-left-selected",
            rightElClass = "sweet-wizard-right",
            rightElSelectedClass = "sweet-wizard-right-selected",
            stepElClass = "sweet-wizard-step-unselected",
            stepElSelectedClass = "sweet-wizard-step-selected",
            lineElClass = "unselected",
            lineElSelectedClass = "selected",
            textSpanClass = "sweet-wizard-text-unselected",
            textSpanSelectedClass = "sweet-wizard-text-selected",
            suffixBottom = "-wizard-bottom",
            suffixContent = "-wizard-content",
            compactClass = "sweet-wizard-compact",
            // 按钮类型 1：上一步 2：下一步 3：完成 4: 保存
            buttonType = [1, 2, 3, 4];

    $.widget("sweet.widgetContainerWizardpanel", $.sweet.widgetContainerPanel,
        /** @lends Sweet.container.WizardPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-wizardpanel]:",
        type: "WizardPanel",
        eventNames: /** @lends Sweet.container.WizardPanel.prototype*/{
            /**
             * @event
             * @description 点击上一步事件
             */
            prevClick: "上一步事件", 
            /**
             * @event
             * @description 点击下一步事件
             */
            nextClick: "下一步事件", 
            /**
             * @event
             * @description 点击完成事件
             */
            doneClick: "完成事件", 
            /**
             * @event
             * @description 点击保存事件
             */
            saveClick : "保存事件"
        },
        options: /** @lends Sweet.container.WizardPanel.prototype*/{
            /**
             * 注册监听，包含上一步、下一步、完成按钮点击事件
             * @type {Object}
             */
            listeners: null,
            /**
             * 导航面板填充内容，格式为[{header: 'example', item: Object}]
             * @type {Array}
             */
            items: [],
            /**
             * @description 是否显示title的tip提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * @description 在地市汇聚特性中加入保存按钮，需要配置此属性为true才有效，默认无
             * @type boolean
             * @default false
             */
            saveBtn : false,
            /**
             * 当点击按钮后的回调函数
             * @type Function
             * @default null
             */
            afterShow : null,
            /**
             * 是否以简化方式显示步骤名称。这种方式下可以减少步骤名占用的空间
             * @type Boolean
             * @default false
             */
            compact: false
        },
        /**
         * @public
         * @description 设置当前步骤
         * @param {Number} step 步骤编号
         */
        setCurrentStep: function (step) {
            if ($.isNull(step) || step < 0 || step > this.maxStep) {
                return;
            }

            if (step === this.currentStep) {
                return;
            }

            // 模拟点击。注：不会触发合法性校验
            while (this.currentStep !== step) {
                if (this.currentStep > step) {
                    this._onPrevClick(this);
                }
                else {
                    this._onNextClick(this);
                }
            }

            // 刷新按钮状态
            this._refreshButtonStatus();
        },
        /**
         * @public
         * @description 返回保存按钮对象
         * @returns {Object} savebutton 返回保存按钮
         */
        getSaveButton : function(){
            var me = this;
            //地市汇聚特性需要添加保存按钮
            if(me.options.saveBtn && me.saveButtonEl){
                return me.saveButtonEl;
            }
            return null;
        },
        /**
         * @private
         * @descripition 重新计算绘制向导布局
         */
        _doLayout: function() {
            var me = this;
            var remainWidth;
            var lineWidth;
            var textElLeft;
            var textElWidth;
            var textSapnElWidth;
            var contentHeight;
            var textHeight;
            var item;

            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }

            // 调用父类的_doLayout，调整panelContentEl的大小
            me._super();

            var options = me.options;
            var length = options.items.length;
            var containerWidth = me.panelContentEl.width();
            var containerHeight = me.panelContentEl.height();
            var leftElWidth = me.leftEl.width();
            var rightElWidth = me.rightEl.width();
            var picSpanWidth = me.wizardEl.find("li > span").width();
            var wizardHeight = me.wizardEl.height();
            var bottomHeight = me.bottomEl.height();

            // 计算直线条宽度
            remainWidth = containerWidth - leftElWidth - rightElWidth - picSpanWidth * length;
            lineWidth = remainWidth / (2 * (length + 1));
            me.wizardEl.find("." + lineElClass).externalWidth(lineWidth);
            me.wizardEl.find("." + lineElSelectedClass).externalWidth(lineWidth);

            // 计算导航文本描述宽度
            textElLeft = leftElWidth + lineWidth;
            textElWidth = containerWidth - leftElWidth - rightElWidth - 2 * lineWidth + 2;
            textSapnElWidth = 2 * lineWidth + picSpanWidth;
            me.textEl.css("left", textElLeft)
                .externalWidth(textElWidth)
                .children()
                .externalWidth(textSapnElWidth);

            // 计算内容区宽度、高度
            textHeight = options.compact === true ? 0 : me.textEl.height();
            contentHeight = containerHeight - wizardHeight - textHeight - bottomHeight - 10;
            me.contentEl.externalWidth(containerWidth).externalHeight(contentHeight);

            // 内容区域子容器
            me.contentEl.children("div").each(function (index, item) {
                $(item).externalWidth(me.contentEl.width()).externalHeight(me.contentEl.height());
            });

            // 计算底部按钮区宽度
            me.bottomEl.externalWidth(containerWidth);

            // 刷新子组件布局（对于宽高设置为绝对值的子组件，这里的调用是必需的）
            for (var i = 0; i < this.options.items.length; i++) {
                item = this.options.items[i].item;
                if (!$.isNull(item) && $.isFunction(item.doLayout)) {
                    item.doLayout();
                }
            }
        },
        /**
         * @private
         * @description 面板渲染
         */
        _widgetRender: function() {
            var me = this, id, contentId, options = me.options, items = options.items, length = items.length;
            if (me.containerEl) {
                id = me.bottomEl.attr("id");
                me.panelContentEl.appendTo(me.containerEl);
                me.doneButtonEl.render(id);
                me.nextButtonEl.render(id);
                me.prevButtonEl.render(id);
                if(options.saveBtn && me.saveButtonEl){
                    me.saveButtonEl.render(id);
                }
                for (var i = 0; i < length; i++) {
                    contentId = me.contentEls[i].attr("id");
                    items[i].item.render(contentId);
                }
                me._selectedStepAndText(me.currentStep);

                // 刷新按钮状态
                me._refreshButtonStatus();
            }
        },
        /**
         * @private
         * @description 创建向导布局
         */
        _createPanelContent: function() {
            var me = this,
                    options = me.options,
                    items = options.items,
                    length = items.length,
                    panelContentEl = me.panelContentEl = $("<div>"),
                    wizardElClass = "sweet-wizard",
                    ulElClass = "sweet-wizard-step",
                    textElClass = "sweet-wizard-text",
                    contentElClass = "sweet-wizard-content",
                    contentElInnerClass = "sweet-wizard-content-inner",
                    bottomElClass = "sweet-wizard-bottom",
                    wizardEl = me.wizardEl = $("<div>"),
                    leftEl = me.leftEl = $("<span>"),
                    rightEl = me.rightEl = $("<span>"),
                    ulEl = $("<ul>"),
                    stepEl,
                    stepEls = {},
                    textEl = me.textEl = $("<div>"),
                    textSpanEl,
                    textSpanEls = {},
                    contentEl = me.contentEl = $("<div>"),
                    contentEls = {},
                    bottomEl = me.bottomEl = $("<div>").attr("id", options.id + suffixBottom);

            // 如果是简化模式，设置额外的类名
            if (options.compact === true) {
                panelContentEl.addClass(compactClass);
            }

            leftEl.addClass(leftElSelectedClass).appendTo(wizardEl);
            $("<li>").addClass(lineElSelectedClass).appendTo(ulEl);
            for (var i = 0; i < length; i++) {
                $("<li>").addClass(lineElClass).appendTo(ulEl);
                stepEl = me._createStepEl(i + 1);
                stepEl.appendTo(ulEl);
                $("<li>").addClass(lineElClass).appendTo(ulEl);
                textSpanEl = $("<span>").addClass(textSpanClass).appendTo(textEl).html(items[i].header);
                if (options.tip) {
                    textSpanEl.attr("title",items[i].header);
                }
                // 导航图
                stepEls[i] = stepEl;
                // 导航文字
                textSpanEls[i] = textSpanEl;
                // 导航内容
                contentEls[i] = $("<div>").attr("id", options.id + "-" + i + "-" + suffixContent)
                        .addClass(contentElInnerClass)
                        .hide()
                        .appendTo(contentEl);
            }
            $("<li>").addClass(lineElClass).appendTo(ulEl);
            ulEl.addClass(ulElClass).appendTo(wizardEl);
            rightEl.addClass(rightElClass).appendTo(wizardEl);
            // 向导条
            wizardEl.addClass(wizardElClass).appendTo(panelContentEl);
            // 向导文字描述
            textEl.addClass(textElClass).appendTo(panelContentEl);
            // 内容
            contentEl.addClass(contentElClass).appendTo(panelContentEl);
            // 底部按钮
            bottomEl.addClass(bottomElClass).appendTo(panelContentEl);

            me.prevButtonEl = new Sweet.form.Button({
                width: 80,
                height: 35,
                value: {value: "prev", text: Sweet.core.i18n.container.prev},
                click: function() {
                    me._onClick(me, buttonType[0]);
                }
            });
            me.nextButtonEl = new Sweet.form.Button({
                width: 80,
                height: 35,
                value: {value: "next", text: Sweet.core.i18n.container.next},
                click: function() {
                    me._onClick(me, buttonType[1]);
                }
            });
            me.doneButtonEl = new Sweet.form.Button({
                width: 80,
                height: 35,
                value: {value: "done", text: Sweet.core.i18n.container.done},
                disabled: true,
                click: function() {
                    me._onClick(me, buttonType[2]);
                }
            });
            //地市汇聚特性需要添加保存按钮
            if(me.options.saveBtn){
                me.saveButtonEl = new Sweet.form.Button({
                    width: 80,
                    height: 35,
                    value: {value: "save", text: Sweet.core.i18n.container.save},
                    click: function() {
                        me._onClick(me, buttonType[3]);
                    }
                });
            }
            
            me.stepEls = stepEls;
            me.textSpanEls = textSpanEls;
            me.contentEls = contentEls;
            // 默认0，也就是第一步
            me.currentStep = 0;
            me.maxStep = length - 1;
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function () {
            // 删除所有标签和子组件
            var item;
            for (var i = 0; i < this.options.items.length; i++) {
                item = this.options.items[i];
                if ($.isFunction(item.destroy)) {
                    try {
                        item.destroy();
                    }
                    catch (e) {
                        this._error(e);
                    }
                }
            }
            this.options.items = [];

            this._super();
        },
        /**
         * @private
         * @description 创建步骤展示标签
         * @param {Number/String} step 步骤
         */
        _createStepEl: function(step) {
            var liEl = $("<li>"),
                    spanEl = $("<span>").html(step);
            spanEl.addClass(stepElClass).appendTo(liEl);
            return liEl;
        },
        /**
         * @private
         * @description 注册按钮监听事件
         * @param {Object} me 导航组件对象
         * @param {Number} type 按钮类别，1：上一步 2：下一步 3：完成
         */
        _onClick: function(me, type) {
            var options = me.options,
                    eventType;
            // 处理绑定事件和注册监听
            if (buttonType[0] === type) {
                eventType = "prevClick";
            } else if (buttonType[1] === type) {
                eventType = "nextClick";
            } else if (buttonType[2] === type) {
                eventType = "doneClick";
            } else if (buttonType[3] === type) {
                eventType = "saveClick";
            }else {
                me._error("Unsupport type. Not equal 1 or 2 or 3. Type=" + type);
                return;
            }

            // 判断回调结果
            var result1 = true, result2 = true;
            if (options.listeners && "function" === typeof options.listeners[eventType]) {
                result1 = options.listeners[eventType].call(this, [me.currentStep + 1, me.maxStep + 1]);
            }
            if (me.handlers && "function" === typeof me.handlers[eventType]) {
                result2 = me.handlers[eventType].call(this, [me.currentStep + 1, me.maxStep + 1]);
            }
            if (!result1 || !result2) {
                return;
            }

            if (buttonType[0] === type) {
                me._onPrevClick(me);
            } else if (buttonType[1] === type) {
                me._onNextClick(me);
                if(options.afterShow && $.isFunction(options.afterShow)){
                    options.afterShow([me.currentStep + 1, me.maxStep + 1]);
                }
            } else if (buttonType[2] === type) {
                me._onDoneClick(me);
            }
        },
        /**
         * @private
         * @description 点击下一步按钮时触发
         * @param {Object} me 导航组件对象
         */
        _onPrevClick: function(me) {
            // 判断是否是第一步
            if (0 === me.currentStep) {
                return;
            }
            me._unSelectedStepAndText(me.currentStep);
            me.currentStep -= 1;

            // 刷新按钮状态
            me._refreshButtonStatus();
        },
        /**
         * @private
         * @description 点击下一步按钮时触发
         * @param {Object} me 导航组件对象
         */
        _onNextClick: function(me) {
            // 判断是否是最后一步
            if (me.currentStep === me.maxStep) {
                return;
            }
            me.currentStep += 1;
            me._selectedStepAndText(me.currentStep);

            // 刷新按钮状态
            me._refreshButtonStatus();
        },
        /**
         * @private
         * @description 导航条、文字选中
         * @param {Number} num 序号
         */
        _selectedStepAndText: function(num) {
            var me = this,
                    stepEl,
                    textSpanEl;

            stepEl = me.stepEls[num];
            textSpanEl = me.textSpanEls[num];
            stepEl.prev().removeClass(lineElClass).addClass(lineElSelectedClass);
            stepEl.children().removeClass(stepElClass).addClass(stepElSelectedClass);
            stepEl.next().removeClass(lineElClass).addClass(lineElSelectedClass);
            textSpanEl.removeClass(textSpanClass).addClass(textSpanSelectedClass);

            if (0 !== num) {
                me.contentEls[num - 1].hide();
            }
            me.contentEls[num].show();
            me.options.items[num].item.show();

            // 如果是最后一步
            if (me.currentStep === me.maxStep) {
                stepEl.next().next().removeClass(lineElClass).addClass(lineElSelectedClass);
                me.rightEl.removeClass(rightElClass).addClass(rightElSelectedClass);
            }
        },
        /**
         * @private
         * @description 导航条、文字去选中
         * @param {Number} num 序号
         */
        _unSelectedStepAndText: function(num) {
            var me = this,
                    stepEl,
                    textSpanEl;
            stepEl = me.stepEls[num];
            textSpanEl = me.textSpanEls[num];
            stepEl.prev().removeClass(lineElSelectedClass).addClass(lineElClass);
            stepEl.children().removeClass(stepElSelectedClass).addClass(stepElClass);
            stepEl.next().removeClass(lineElSelectedClass).addClass(lineElClass);
            textSpanEl.removeClass(textSpanSelectedClass).addClass(textSpanClass);
            me.contentEls[num].hide();
            if (num > 0) {
                me.contentEls[num - 1].show();
                me.options.items[num - 1].item.show();
            }

            // 如果是最后一步
            if (me.currentStep === me.maxStep) {
                stepEl.next().next().removeClass(lineElSelectedClass).addClass(lineElClass);
                me.rightEl.removeClass(rightElSelectedClass).addClass(rightElClass);
            }
        },
        /**
         * @description 根据当前步骤号，刷新按钮状态
         * @private
         */
        _refreshButtonStatus: function () {
            var me = this;
            var step = me.currentStep;

            // 缺省值
            me.prevButtonEl.setDisabled(false);
            me.nextButtonEl.setDisabled(false);
            me.doneButtonEl.setDisabled(false);

            // 第一页
            if (step === 0) {
                me.prevButtonEl.setDisabled(true);
                me.doneButtonEl.setDisabled(true);
            }

            // 最后一页
            else if (step === me.maxStep) {
                me.nextButtonEl.setDisabled(true);
            }

            // 中间页
            else {
                me.doneButtonEl.setDisabled(true);
            }
        },
        /**
         * @event
         * @description 上一步事件
         * @name Sweet.panel.WizardPanel#prevClick
         * @param {Array} step 步骤信息[current, max]
         */
        prevClick: function (step) {
            $.log(step);
        },
        /**
         * @event
         * @description 下一步事件
         * @name Sweet.panel.WizardPanel#nextClick
         * @param {Array} step 步骤信息[current, max]
         */
        nextClick: function (step) {
            $.log(step);
        },
        /**
         * @event
         * @description 完成事件
         * @name Sweet.panel.WizardPanel#doneClick
         * @param {Array} step 步骤信息[current, max]
         */
        doneClick: function (step) {
            $.log(step);
        }
    });

    /**
     * @description 向导布局容器
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.container.Panel
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * jquery.sweet.widget.container.panel.js
     * </pre>
     * @example
     * 创建向导布局容器：
     * var sweetHPanel = Sweet.container.WizardPanel({
     * });
     */
    Sweet.panel.WizardPanel = $.sweet.widgetContainerWizardpanel;
}(jQuery));

/**
 * @fileOverview  
 * <pre>
 * form组件--按钮
 * 2013/1/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * 保存组件对象
     */
    var buttonClass = "sweet-form-button",
        buttonTextAlignLeftClass = "sweet-form-button-textalign-left",
        buttonDisabledClass = "sweet-form-button-disabled",
        buttonHighlightClass = "sweet-form-button-highlight",
        buttonHighlightDisabledClass = "sweet-form-button-highlight-disabled",
        buttonFormerImaCls = "sweet-form-button-formerIma",
        formerTextCls = "sweet-form-button-formerText",
        textImageCls = "sweet-form-button-formerText-image",
        divPanelClass = "sweet-form-button-menuPanel",
        buttonArrowClass = "sweet-form-button-arrow",
        disablePostfix = "-gray",
        operType = Sweet.constants.operType,
        oldMenuId;
        imageTypeObj = {};
        imageTypeObj[operType.ADD] = "sweet-form-button-image-add";
        imageTypeObj[operType.MODIFY] = "sweet-form-button-image-modify";
        imageTypeObj[operType.DELETE] = "sweet-form-button-image-delete";
        imageTypeObj[operType.MOVE] = "sweet-form-button-image-move";
        imageTypeObj[operType.ACTIVE] = "sweet-form-button-image-active";
        imageTypeObj[operType.TERMINATE] = "sweet-form-button-image-terminate";
        imageTypeObj[operType.SAVEAS] = "sweet-form-button-image-saveas";
        imageTypeObj[operType.CONFIRM] = "sweet-form-button-image-confirm";
        imageTypeObj[operType.IMPORT] = "sweet-form-button-image-import";
        imageTypeObj[operType.EXPORT] = "sweet-form-button-image-export";    
        imageTypeObj[operType.REFRESH] = "sweet-form-button-image-refresh"; 

    $.widget("sweet.widgetFormButton", $.sweet.widgetForm, /** @lends Sweet.form.Button.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-button]",
        defaultElement: "<button>",
        type: "button",
        eventNames: /** @lends Sweet.form.Button.prototype*/{
            /**
             * @event
             * @description 单击事件,参数为两个(event, data)
             */
            click: "单击事件",
            /**
             * @event
             * @description 按钮菜单击事件,参数为两个(event, data)
             */
            menuClick : "按钮菜单击事件"
        },
        // 按钮类组件公共配置参数
        options: /** @lends Sweet.form.Button.prototype*/{
            /**
             * @description 按钮高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 按钮宽度
             * @type {String/Number}
             * @default 70px
             */
            width: 70,
            /**
             * @description 图片类型，现提供的值有:modify,add,delete,move,active,
			 *                                     terminate,save,confirm,import,export,refresh
             * @type {String}
             * @default ""
             */
            imageType: "",
            /**
             * @description 接受参数值
             * @type {String/Number/object}
             * @default {value: "", text: "", data:null}
             */
            value: {value: "", text: "", data: null},
            /**
             * @description 按钮是否高亮显示
             * @type {Boolean}
             * @default false
             */
            highLight: false,
            /**
             * @description 按钮是否有提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * @description 设置按钮是否含有菜单，默认没有菜单
             * @type {Boolean}
             * @default false
             */
            menu:false,
            /**
             * @description 设置按钮菜单数据，当menu配置true时有效
             * @type {Array}
             * @default null
             */
            data:null
        },

        /**
         * @description 设置按钮菜单数据
         * @public
         * @param {Object} data 菜单数据, 格式形如：[{"value": 11, "text": "开始定界"},{"value": 12, "text": "结束定界"}]
         */
        setMenuData:function(data){
            var me = this;
            if($.isNotNull(data) && me.options.menu){
                me.options.data = data;
                if(me.btnMenu){
                    me.btnMenu.setData(data);
                }
            }
        },

        /**
         * @description 设置按钮置灰状态的菜单数据
         * @public
         * @param {Array} data设置是否置灰状态的菜单数据，格式形如：[{"value": 3, "text": "Three","disabled": false}]
         */
        setMenuDisable:function(data){
            var me = this;
            if($.isNotNull(data) && me.btnMenu){
                me.btnMenu.setDisabled(data);
            }
        },

        /**
         * @description 重新绘制组件
         * @private
         */
        _doLayout: function() {
        },

        /**
         * @description 创建含菜单的按钮样式
         */
        _createMenuBtnStyle: function(){
            var me = this;
            if(me.formEl.find("."+ buttonArrowClass)){
                me.formEl.find("."+ buttonArrowClass).remove();
            }
            me.btnDownArrow = $("<span>").addClass(buttonArrowClass).appendTo(me.formElement);
        },

        /**
         * @private
         * @description 创建按钮
         */
        _createFormWidget: function() {
            var me = this,
                options = me.options;
            me._createButtonField();

            //设置菜单按钮样式
            if(options.menu){
                me._createMenuBtnStyle();
            }
        },
        
        /**
         * @private
         * @description 创建按钮, 子类可覆盖实现
         */
        _createButtonField: function() {
            var me = this,
                opt = me.options,
                value = opt.value,
                imgType = opt.imageType,
                el = me.formElement = $('<button type="button">').appendTo(me.formEl),
                txtEl = me.formerTextEl = $('<div class=' + formerTextCls + '>');
            //事件绑定在创建时就应该存在，只是disabled时判断是否触发给用户
            el.bind("click", {"me": me}, me._onClick);
            if(imgType) {
                me.formerImageEl = $('<span style="float:left;">')
                    .addClass(buttonFormerImaCls + " " + imageTypeObj[imgType]).appendTo(el);
                el.addClass(buttonTextAlignLeftClass);
                txtEl.addClass(textImageCls);
            }
            txtEl.html(value.text).appendTo(el);
            if($.isNotNull(opt.vID)){
                el.attr("id", opt.vID);
            }

            if(opt.tip) {
                //提示的详情
                opt.tipText ? el.attr("title", opt.tipText) : el.attr("title", value.text);
            }

            // 缓存数据
            $.data(el[0], "value", value);
        },

        /**
         * @private
         * @description 关闭浮动面板
         */
        _closeFloatPanel: function() {
            var me = this;
            if(me.divPanelEl) {
                me.divPanelEl.empty().remove();
                me.divPanelEl = null;
            }
        },
        
        /**
         * @private
         * @description 单击事件
         * @param {Object} event 按钮单击对象
         */
        _onClick: function(event) {
            var me = event.data.me,
                opt = me.options,
                click = opt.click,
                value = null,
                disabled = opt.disabled;
            //只有disabled为false时才触发用户监听的事件
            if(!disabled){
                value = me._getValue();
                //设置按钮菜单配置时，在点击按钮时创建菜单
                if(opt.menu){
                    var id = me.menuId = opt.id + "sweet-btnMenu",
                        oldMenuDivJq = null;

                    if(oldMenuId !== id){
                        if($.isNotNull(oldMenuId)){
                            oldMenuDivJq = $("#" + oldMenuId);
                            oldMenuDivJq.empty().remove();
                            oldMenuDivJq.parent("." + divPanelClass + " " + me.floatBgClass).empty().remove();
                        }
                        oldMenuId = id;
                    }

                    me._createMenuBtnStyle();
                    me._createMenuCmp(id);

                    me.divPanelEl.show();
                    if(me.divPanelEl && me.divPanelEl.css("display") === "block"){
                        event.stopPropagation();
                    }
                }

                if(click && $.isFunction(click)){
                    me._trigger("click", me, value);
                }
                //如果两种方式都监听了，都触发
                me._triggerHandler(event, "click", value);
            }
        },

        /**
         *  @description 创建按钮菜单组件
         */
        _createMenuCmp:function(id){
            var me = this,
                left = 0, top = me.options.height;
            if(me.divPanelEl) {
                me.divPanelEl.remove();
                me.divPanelEl = null;
            }
            me.divPanelEl = $("<div>").addClass(divPanelClass + " " + me.floatBgClass).hide().appendTo(me.formEl);
            me.divFloatPanelEi = $("<div>").appendTo(me.divPanelEl);

            me.divFloatPanelEi.attr("id",id);
            me.btnMenu = new Sweet.menu.Menu({
                renderTo: id,
                X: left,
                Y: top,
                transparent: false,
                itemClick: function(evt, data) {
                    me.selectedMenuData = data;
                    me._triggerHandler(evt, "menuClick", me.selectedMenuData);
                },
                items: me.options.data
            });
        },
       
        /**
         * @description 给组件设置值
         * @private
         * @param {Object} obj 设置值，格式为{value: 值, text: 文本, data: Object}
         */
        _setValue: function(obj) {
            var me = this,
                fEl = me.formElement;
            if (obj) {
                fEl.html(obj.text);
                $.data(fEl[0], "value", obj);
                me.options.value = obj;
            }
        },
        
        /**
         * @description 返回组件值
         * @private
         * @return {Object} 返回值，格式为{value: 值, text: 文本, data: Object}
         */
        _getValue: function() {
            var me = this;
            return $.data(me.formElement[0]).value;
        },
        
        /**
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled true禁用 false可用
         */
        _setDisabled: function(disabled) {
            var me = this,
                arrowCls = "",
                opt = me.options,
                fEl = me.formElement,
                imgEl = me.formerImageEl,
                hl = me.options.highLight,
                imgt = me.options.imageType,
                imgTypeObj = imageTypeObj[imgt];

            if (disabled) {
                hl ? fEl.removeClass(buttonHighlightClass).addClass(buttonHighlightDisabledClass) :
                    fEl.removeClass(buttonClass).addClass(buttonDisabledClass);
                if(opt.menu && me.btnDownArrow){
                    arrowCls = buttonArrowClass+disablePostfix;
                    me.btnDownArrow.removeClass().addClass(arrowCls);
                }
                imgt ? imgEl.removeClass(imgTypeObj).addClass(imgTypeObj + disablePostfix) : "";
            } else {
                hl ? fEl.removeClass(buttonHighlightDisabledClass).addClass(buttonHighlightClass) :
                    fEl.removeClass(buttonDisabledClass).addClass(buttonClass);
                if(opt.menu && me.btnDownArrow){
                    arrowCls = buttonArrowClass;
                    me.btnDownArrow.removeClass().addClass(arrowCls);
                }
                imgt ? imgEl.removeClass(imgTypeObj + disablePostfix).addClass(imgTypeObj) : "";
            }
        },

        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            var me = this,
			fEl = me.formElement;
            fEl ? fEl.unbind() : "";
        }
    });
    /**
     * 按钮
     * @name Sweet.form.Button
     * @class 
     * @extends Sweet.form
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.widget.form.js
     * </pre>
     * @example 
     * <pre>
     * sweetButton = new Sweet.form.Button({
     *     value : {value: 2, text: "button"},
     *     imageType : "add",
     *     renderTo : "sweet-button"
     * });
     * sweetButton.addListener("click", function(event, data){
     *     $.log("Click happend!");
     *  });
     * </pre>
     */
    Sweet.form.Button = $.sweet.widgetFormButton;

}(jQuery));

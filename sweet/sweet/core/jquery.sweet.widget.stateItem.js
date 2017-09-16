/**
 * @fileOverview
 * <pre>
 * 状态选项组件
 * 2013/9/13
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var stateItemBodyClass = "sweet-stateitem-body",
            stateItemHeaderClass = "sweet-stateitem-header",
            stateItemHeaderTextClass = "sweet-stateitem-header-text",
            stateItemHeaderAddClass = "sweet-stateitem-header-add",
            stateItemListBodyClass = "sweet-stateitem-list-body",
            stateItemListULClass = "sweet-stateitem-list-ul",
            stateItemListItemClass = "sweet-stateitem-list-item",
            stateItemListItemTextClass = "sweet-stateitem-list-item-text",
            stateItemListErrorClass = "sweet-stateitem-list-error",
            stateItemListDeleteClass = "sweet-stateitem-list-delete",
            stateItemListCheckClass = "sweet-stateitem-list-check",
            stateItemSelectedClass = "sweet-stateitem-list-item-selected",
            stateItemCheckedClass = "sweet-stateitem-list-item-checked",
            eventSelect = "select",
            eventBeforeAdd = "beforeadd",
            eventBeforeDelete = "beforedelete",
            eventDelete = "delete",
            eventBeforeTextChange = "beforetextchange",
            eventTextChange = "textchange",
            i18n = Sweet.core.i18n.stateItem,
            uuid = 1;
    $.widget("sweet.widgetStateItem", $.sweet.widget, /**lends Sweet.StateItem.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-StateItem]",
        eventNames: /** @lends Sweet.StateItem.prototype*/{
            /**
             * @event
             * @description 选中时事件,一般两个参数(evt, data)
             */
            select: "选中事件",
            /**
             * @event
             * @description 删除前时事件,一般两个参数(data, me)
             */
            beforedelete: "删除前事件",
            /**
             * @event
             * @description 删除时事件,一般两个参数(data, me)
             */
            delete: "删除事件",
            /**
             * @event
             * @description 选项文本发生变化前时事件,一般两个参数(data, me)
             */
            beforetextchange: "选项文本发生变化前事件",
            /**
             * @event
             * @description 选项文本发生变化事件,一般两个参数(data, me)
             */
            textchange: "选项文本发生变化事件"
        },
        options: /** @lends Sweet.StateItem.prototype*/{
            /**
             * 数据
             * @type {Array}
             * @default []
             */
            data: [],
            /**
             * 最大选项个数
             * @type {Number}
             * @default null
             */
            maxCount: -1,
            /**
             * 列头显示文本
             * @type {String}
             * @default 105
             */
            headerText: i18n.headerText,
            /**
             * 相关tip提示信息
             * @type {String}
             * @default 105
             */
            tipInfo: {
                add: i18n.plus,
                delete: i18n["delete"],
                check: i18n.check
            }
        },
        /**
         * @description 更新数据信息
         * @param {Array} data 组件对应的数据，格式和配置数据一样
         */
        setData: function(data) {
            var me = this;
            data = data || [];
            if (me.stateItemsUL) {
                me.stateItemsUL.find("li").remove();
            }
            me.options.data = data;
            me._setData(data);
        },
        /**
         * @description 设置值,和更新时数据格式一样
         * @param {Array} value 组件对应的数据，格式和配置数据一样
         */
        setValue: function(value) {
            var me = this;
            me.setData(value);
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 组件值
         */
        getValue: function() {
            var me = this,
                    vDatas = [],
                    liDoms;
            if (!me.stateItemsUL) {
                return;
            }
            liDoms = me.stateItemsUL.find("li");
            for (var i = 0; i < liDoms.length; i++) {
                vDatas.push($(liDoms[i]).data("data"));
            }
            return $.objClone(vDatas);
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 组件值
         */
        getData: function() {
            var me = this;
            return me.getValue();
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            return this.stateItemEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            return this.stateItemEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            this.stateItemEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            this.stateItemEl.externalHeight(height);
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me.stateItemEl.externalWidth(width);
            me.stateItemEl.externalHeight(height);
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.stateItemEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createSweetWidget: function() {
            var me = this,
                    listBodyEl;
            me.options.data = me.options.data || [];
            me.selected = null;
            me.checked = null;
            me.maxCount = -1;
            if (me.options.maxCount && me.options.maxCount > 0) {
                me.maxCount = parseInt(me.options.maxCount);
            }
            //最外层容器DIV
            me.stateItemEl = $("<div>").addClass(stateItemBodyClass)
                    .attr("id", me.options.id);
            if (me.options.widgetClass && "" != me.options.widgetClass) {
                me.stateItemEl.addClass(me.options.widgetClass);
            }
            //创建列头
            me.headerEl = $("<div>").addClass(stateItemHeaderClass).appendTo(me.stateItemEl);
            //列头显示的文本
            $("<span>").text(me.options.headerText).attr("title", me.options.headerText).addClass(stateItemHeaderTextClass).appendTo(me.headerEl);
            //列头新增按钮
            me.addEl = $("<span>").attr("title", me.options.tipInfo.add).addClass(stateItemHeaderAddClass).bind("click", {"me": me}, me._addStateItem).appendTo(me.headerEl);
            listBodyEl = $("<div>").addClass(stateItemListBodyClass).appendTo(me.stateItemEl);
            me.stateItemsUL = $("<ul>").addClass(stateItemListULClass).appendTo(listBodyEl);
            me._setData(me.options.data);
        },
        /**
         * @description 更新数据信息
         * @param {Array} data 组件对应的数据，格式和配置数据一样
         */
        _setData: function(data) {
            var me = this,
                    optData;
            data = data || [];
            me.selected = null;
            me.checked = null;
            optData = $.objClone(data);
            for (var i = 0; i < optData.length; i++) {
                me._createStateItem(optData[i]);
            }
            if (me.addEl && me.maxCount > -1 && optData.length >= me.maxCount) {
                me.addEl.hide();
            }
			if (me.addEl && me.maxCount > -1 && optData.length < me.maxCount) {
                me.addEl.show();
            }
            if (me.selected) {
                me._doSelected(me.selected);
            }
        },
        /**
         * @private
         * @description 创建分数卡组件
         * @param {Object} data 组件信息
         * @return {Object} liEl 返回新增的li
         */
        _createStateItem: function(data) {
            var me = this,
                    liEl,
                    textEl,
                    deleteEl,
                    checkedEl,
                    errorEl;
            if ($.isEmptyObject(data)) {
                return;
            }
            liEl = $("<li>").addClass(stateItemListItemClass)
                    .data("data", data)
                    .bind("click", {"me": me}, me._onClick)
                    .bind("dblclick", {"me": me}, me._onDbClick)
                    .appendTo(me.stateItemsUL);
            textEl = $("<span>").text(data["text"]).attr("title", data["text"]).addClass(stateItemListItemTextClass).appendTo(liEl);
            errorEl = $("<span>").attr({name: "error"}).addClass(stateItemListErrorClass).appendTo(liEl);
            deleteEl = $("<span>").attr({name: "deleted", title: me.options.tipInfo["delete"]}).addClass(stateItemListDeleteClass).appendTo(liEl);
            checkedEl = $("<span>").attr({name: "checked", title: me.options.tipInfo.check}).addClass(stateItemListCheckClass).appendTo(liEl);
            if (data["selected"]) {
                me.selected = liEl;
            }
            if (data["checked"]) {
                liEl.addClass(stateItemCheckedClass);
                me.checked = liEl;
            }
            return liEl;
        },
        /**
         * @private
         * @description 新增状态
         * @param {Object} e 事件对象
         */
        _addStateItem: function(e) {
            var me = e.data.me,
                    flag,
                    el,
                    tempTxt = uuid++;
            flag = me._triggerHandler(me, eventBeforeAdd);
            if ("false" === flag || false === flag) {
                return;
            }
            el = me._createStateItem({
                value: me.options.id + "-stateitem-" + tempTxt,
                text: i18n.stateText + tempTxt
            });
            me._doSelected(el);
            if (me.addEl && me.maxCount > -1 && me.stateItemsUL && me.stateItemsUL.find("li").length >= me.maxCount) {
                me.addEl.hide();
            }
        },
        /**
         * @private
         * @description 双击事件
         * @param {Object} e 事件对象
         */
        _onDbClick: function(e) {
            var me = e.data.me,
                    el = $(e.target),
                    oldText,
                    liEl,
                    editInputEl;
            if ("deleted" == el.attr("name") || "checked" == el.attr("name")) {
                return;
            }
            if (el.hasClass(stateItemListItemClass) || !el.hasClass(stateItemListItemTextClass)) {
                liEl = el;
                el = el.find("." + stateItemListItemTextClass);
            } else {
                liEl = el.parent("li");
            }
            oldText = el.text();
            el.text("");
            editInputEl = $("<input type='text'>").attr({value: oldText}).css({width: "100%", height: "22px"});
            editInputEl.appendTo(el)
                    .bind("blur", {me: me, liEl: liEl, el: el, self: editInputEl, oldText: oldText}, me._doEdit)
                    .bind("focus", {me: me, liEl: liEl, el: el, self: editInputEl, oldText: oldText}, me._doInputFocus);
            editInputEl.focus();
        },
        /**
         * @private
         * @description 输入框获得焦点时处理
         * @param {Object} e 事件对象
         */
        _doInputFocus: function(e) {
            var me = e.data.me,
                    inputEl;
            if (e.data.self) {
                inputEl = e.data.self.get(0);
                if (inputEl) {
                    inputEl.selectionStart = inputEl.value.length;
                }
            }
        },
        /**
         * @private
         * @description 双击时编辑处理
         * @param {Object} e 事件对象
         */
        _doEdit: function(e) {
            var me = e.data.me,
                    data,
                    oldText,
                    newText,
                    liEl,
                    flag = false;
            oldText = e.data["oldText"];
            newText = e.data.self.val();
            liEl = e.data["liEl"];
            data = liEl.data("data") || {};
            //修改text值
            if (oldText != newText) {
                flag = me._triggerHandler({data: $.objClone(data), text: newText, oldText: oldText}, eventBeforeTextChange, me);
                if (false === flag || "false" === flag) {
                    flag = false;
                    newText = oldText;
                } else {
                    flag = true;
                    data["text"] = newText;
                    e.data.el.attr("title", newText);
                }
            }
            e.data.self.remove();
            e.data.el.text(newText);
            if (flag) {
                me._triggerHandler({data: $.objClone(data), text: newText, oldText: oldText}, eventTextChange, me);
            }
        },
        /**
         * @private
         * @description 单击事件
         * @param {Object} e 事件对象
         */
        _onClick: function(e) {
            var me = e.data.me,
                    self = $(e.target);
            switch (self.attr("name")) {
                case "deleted":
                    me._doDeleted(self);
                    break;
                case "checked":
                    me._doChecked(self);
                    break;
                default:
                    me._doSelected(self);
                    return;
            }
        },
        /**
         * @private
         * @description 删除操作
         * @param {Object} el delete对象
         */
        _doDeleted: function(el) {
            var me = this,
                    data,
                    sData,
                    cData,
                    liDom,
                    selected,
                    flag;
            if (!el) {
                return;
            }
            liDom = el.parent("li");
            data = liDom.data("data");
            selected = data["select"] ? true : false;
            flag = me._triggerHandler({data: $.objClone(data), selected: selected}, eventBeforeDelete, me);
            if ("false" === flag || false === flag) {
                return;
            }
            if (me.selected) {
                sData = me.selected.data("data");
                if (data && sData && (sData["value"] == data["value"] || sData["text"] == data["text"])) {
                    me.selected = null;
                }
            }
            if (me.checked) {
                cData = me.checked.data("data");
                if (data && cData && (cData["value"] == data["value"] || cData["text"] == data["text"])) {
                    me.checked = null;
                }
            }
            if (liDom) {
                liDom.remove();
            }
            if (me.addEl && me.maxCount > -1 && me.stateItemsUL && me.maxCount > me.stateItemsUL.find("li").length) {
                me.addEl.show();
            }
            me._triggerHandler({data: $.objClone(data), selected: selected}, eventDelete, me);
        },
        /**
         * @private
         * @description 或得选项校验结果
         * @param {Object} data {value: "xxx", tip: "xxx", checked: true}
         * @return {Boolean} checked true表示校验通过,false为不通过
         */
        isValidate: function(data) {
            var me = this,
                    liEl,
                    errorEl;
            liEl = me._doFindLi(data);
            if (liEl) {
                errorEl = liEl.find("span[name='error']");
            }
            if (!errorEl) {
                return false;
            }
            if ("block" == errorEl.css("display") && "error" == errorEl.attr("tiptype")) {
                return false;
            }
            return true;
        },
        /**
         * @private
         * @description 对某个选项进行校验
         * @param {Object} data {value: "xxx", tip: "xxx", checked: true}
         */
        doValidate: function(data) {
            var me = this,
                    liEl,
                    errorEl;
            liEl = me._doFindLi(data);
            if (liEl) {
                errorEl = liEl.find("span[name='error']");
            }
            if (!errorEl) {
                return;
            }
            if (false === data["checked"] || "false" === data["checked"]) {
                errorEl.attr({tiptype: "error"});
                if (data["tip"]) {
                    errorEl.attr({title: data["tip"]});
                }
                errorEl.css({"display": "block"});
            } else {
                errorEl.removeAttr("tiptype");
                errorEl.removeAttr("title");
                errorEl.css({"display": "none"});
            }
        },
        /**
         * @private
         * @description 选项设置默认值操作
         * @param {Object} data 选项信息
         */
        doChecked: function(data) {
            var me = this,
                    liEl;
            liEl = me._doFindLi(data);
            if (liEl) {
                me._doChecked(liEl.find("span[name='checked']"));
            }
        },
        /**
         * @private
         * @description 设置默认值操作
         * @param {Object} el 设置默认值对象
         */
        _doChecked: function(el) {
            var me = this,
                    data,
                    liEl;
            if (!el) {
                return;
            }
            liEl = el.parent("li");
            if (me.checked) {
                data = me.checked.data("data");
                if (!$.isEmptyObject(data)) {
                    delete data["checked"];
                }
                me.checked.removeClass(stateItemCheckedClass);
            }
            data = liEl.data("data");
            if (data) {
                data["checked"] = true;
            }
            me.checked = liEl;
            liEl.addClass(stateItemCheckedClass);
        },
        /**
         * @private
         * @description 选项选中处理
         * @param {Object} data 选项信息
         */
        doSelected: function(data) {
            var me = this,
                    liEl;
            liEl = me._doFindLi(data);
            if (liEl) {
                me._doSelected(liEl);
            }
        },
        /**
         * @private
         * @description 选项选中处理
         * @param {Object} el li对象
         */
        _doSelected: function(el) {
            var me = this,
                    data;
            if (!el) {
                return;
            }
            if (!el.hasClass(stateItemListItemClass) || el.hasClass(stateItemListItemTextClass)) {
                el = el.parent("li");
            }
            if (me.selected) {
                data = me.selected.data("data");
                if (!$.isEmptyObject(data)) {
                    delete data["selected"];
                }
                me.selected.removeClass(stateItemSelectedClass);
            }
            data = el.data("data");
            if (data) {
                data["selected"] = true;
            }
            me.selected = el;
            el.addClass(stateItemSelectedClass);
            me._triggerHandler($.objClone(el.data("data")), eventSelect, me);
        },
        /**
         * @private
         * @description 通过选项信息查找对应的li
         * @param {Object} data 选项信息
         */
        _doFindLi: function(data) {
            var me = this,
                    data,
                    liEls,
                    tempData;
            if (!me.stateItemsUL) {
                return null;
            }
            if ($.isEmptyObject(data) || !data["value"]) {
                return null;
            }
            liEls = me.stateItemsUL.find("li");
            for (var i = 0; i < liEls.length; i++) {
                tempData = $(liEls[i]).data("data");
                if (tempData && data["value"] == tempData["value"]) {
                    return $(liEls[i]);
                }
            }
            return null;
        },
        //组件重绘
        _doLayout: function() {
            var me = this,
                    width = me.stateItemEl.width(),
                    height = me.stateItemEl.height(),
                    headerHeight = me.headerEl.externalHeight(),
                    tempWidth = 75,
                    headerTextDom,
                    textDoms;
            if (me.headerEl) {
                headerTextDom = me.headerEl.find("." + stateItemHeaderTextClass);
                if (headerTextDom && headerTextDom.length > 0) {
                    headerTextDom.width(width - tempWidth);
                }
            }
            if (me.stateItemsUL) {
                me.stateItemsUL.height(height - headerHeight);
                textDoms = me.stateItemsUL.find("li ." + stateItemListItemTextClass);
                if (textDoms && textDoms.length > 0) {
                    textDoms.width(width - tempWidth);
                }
            }
        }
    });
    /**
     * 状态选项
     * @name Sweet.StateItem
     * @class 
     * @extends Sweet.widget
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * sweetstateItem = new Sweet.StateItem({
     *   headerText: "State",
     *   tipInfo: {
     *       add: "add"
     *   },
     *   data: [
     *       {text: "state1", value: "state1"},
     *       {text: "state2", value: "state2", selected: true},
     *       {text: "state3", value: "state3", checked: true},
     *       {text: "state4", value: "state4"}
     *   ],
     *   renderTo:"stateItemDemo"
     });
     * </pre>
     */
    Sweet.StateItem = $.sweet.widgetStateItem;
}(jQuery));
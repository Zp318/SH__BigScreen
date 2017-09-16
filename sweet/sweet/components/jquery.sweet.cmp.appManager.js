/**
 * @fileOverview
 * <pre>
 * app管理组件
 * 2014/10/9
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var itemCls = "sweet-cmp-app-item",
            itemOverCls = "sweet-cmp-app-item-over",
            containerCls = "sweet-cmp-app-container",
            contentCls = "sweet-cmp-app-content",
            imgElCls = "sweet-cmp-app-img-container",
            imgCls = "sweet-cmp-app-img",
            textCls = "sweet-cmp-app-text",
            opertorCls = "sweet-cmp-app-opertor",
            actionCls = "sweet-cmp-app-action",
            stateCls = "sweet-cmp-app-state-text";
    $.widget("sweet.cmpAppManager", $.sweet.widgetCmp, /**lends Sweet.cmp.AppManager.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-appManager]",
        eventNames : /** @lends Sweet.cmp.AppManager.prototype*/{
            /**
             * @event
             * @description 操作面板上的操作事件
             */
            "opertorClick" : "操作面板上的操作事件"
        },
        options: /** @lends Sweet.cmp.AppManager.prototype*/{
            /**
             * @description app的信息集合，一般结构[{value:"1", text:"app nqme", icon:"图片路径"}]
             * @type Array
             * @default []
             */
            data : [],
            /**
             * @description 面板中的单个app的宽度，不建议修改，现在还不支持自适应
             * @type int
             * @default 200
             */
            lpWidth : 200,
            /**
             * @description 面板中的单个app的高度，不建议修改，现在还不支持自适应
             * @type number
             * @default 250
             */
            lpHeight : 250,
            /**
             * @description 默认的图片路径
             * @type string
             * @default ""
             */
            defaultIcon : "",
            /**
             * @description 图片加载失败显示的图片内容的路径,如果defaultIcon为"",此路径不起作用
             * @type string
             * @default ""
             */
            errorIcon : "",
            /**
             * @description 单个app操作面板中的动作定义，建议最多4个
             * @type Array
             * @default [{value:"detail", text:"Details"},{value:"edit", text:"Edit"},{value:"delete", text:"Delete"}]
             */
            actions : [{value:"detail", text:"Details"},{value:"edit", text:"Edit"},{value:"delete", text:"Delete"}]
        },
        /**
         * @description 用户点击操作面板上的删除按钮时，此方法可以删除指定id的item
         * @param {string} id 删除的item中的div的id
         */
        deleteItem : function(id){
            if($.isNull(id)){
                return;
            }
            var me = this;
            var item = $("#" + id);
            if(item && item.length > 0){
                for(var i = 0; i < item.length; i++){
                    var temp = $(item[i]);
                    //删除options中的数据
                    var d = temp.data("item");
                    if(d && $.isNotNull(d.value)){
                        for(var j = 0; j < me.options.data.length; j++){
                            if(d.value === me.options.data[j].value){
                                me.options.data.splice(j, 1);
                                break;
                            }
                        }
                    }
                    
                    //删除dom及事件
                    temp.unbind();
                    temp.find("." + actionCls).unbind();
                    temp.remove();
                }
                me._doLayout();
            }
        },
        /**
         * @description 取得面板中的数据
         */
        getData : function(){
            return $.objClone(this.options.data);
        },
        /**
         * @description 设置面板中的数据
         * @param {Array} data app的信息集合
         */
        setData: function(data) {
            if($.isNull(data)){
                return;
            }
            var me = this, len = 0;
            //更新数据前，先保存数据并将原有的面板恢复
            me.options.data = $.objClone(data);
			
            if(me.contentEl){
                me.contentEl.find("." + itemCls).unbind();
                me.contentEl.find("." + actionCls).unbind();
                me.contentEl.empty();
            }
            len = me.options.data ? me.options.data.length : 0;
            if(len > 0){
                me._createLookPanel();
            }
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            if (!id || this.rendered) {
                return;
            }
            if (!this.renderEl) {
                // 创建宿主元素               
                this._createRenderEl(id);
            }
            this.cmpEl.appendTo(this.renderEl);
            this.rendered = true;
            return true;
        },
        _onMouseOver : function(e){
            var obj = e.data.obj;
            var operEl = obj.data("operEl");
            var stateEl = obj.data("stateEl");
            obj.removeClass(itemCls).addClass(itemOverCls);
            if(operEl && stateEl){
                stateEl.hide();
                operEl.show();
            }
        },
        _onMouseOut : function(e){
            var obj = e.data.obj;
            var operEl = obj.data("operEl");
            var stateEl = obj.data("stateEl");
            obj.removeClass(itemOverCls).addClass(itemCls);
            if(stateEl && operEl){
                stateEl.show();
                operEl.hide();
            }
        },
        _onActionClick : function(e){
            var me = e.data.me;
            var obj = e.data.obj;
            var action = obj.data("action");
            var id = obj.data("id");
            var item = obj.data("item");
            
            me._triggerHandler(e, "opertorClick", {action : action, id : id, item : item});
        },
        _createLookPanel : function(){
            var me = this,
                    i = 0, j = 0,
                    opt = me.options,
                    data = opt.data,
                    lpw = opt.lpWidth,
                    lph = opt.lpHeight,
                    len = data ? data.length : 0;
            for(i = 0; i < len; i++){
                var temp = $("<div>").addClass(itemCls).attr("id", opt.id + "-item-" + i)
                        .height(lph).width(lpw).appendTo(me.contentEl);
                temp.bind("mouseover", {"me" : me, "obj" : temp}, me._onMouseOver)
                        .bind("mouseout", {"me": me, "obj" : temp}, me._onMouseOut);
                var item = data[i];
                var icon = item.icon ? item.icon : opt.defaultIcon;
                //记录上面的数据
                temp.data("item", item);
                //图片
                var imgEl = $("<div>").addClass(imgElCls).appendTo(temp);
                $("<img>").attr({"src" : icon}).bind("error", function(e){
                    $(this).attr("src", opt.errorIcon);
                }).addClass(imgCls).appendTo(imgEl);
                //名称
                $("<div>").addClass(textCls).attr("title", item.text).width(lpw).text(item.text).appendTo(temp);
                //状态框
                var stateEl = $("<div>").addClass(stateCls).text(item.state).appendTo(temp);
                temp.data("stateEl", stateEl);
                
                //操作面板上的具体动作按钮
                if(opt.actions && opt.actions.length > 0){
                    //操作面板
                    var operEl = $("<div>").addClass(opertorCls).appendTo(temp).hide();
                    temp.data("operEl", operEl);
                    //动作
                    for(j = 0; j < opt.actions.length; j++){
                        var a = $("<div>").addClass(actionCls)
                                .text(opt.actions[j].text).appendTo(operEl);
                        a.data("action", opt.actions[j]);
                        a.data("id", opt.id + "-item-" + i);
                        a.data("item", item);
                        a.bind("click", {"me": me, "obj" : a}, me._onActionClick);
                    }
                }
            }
        },
        _doLayout : function(){
            var me = this,
                    opt = me.options,
                    vmargin = 30,
                    hmargin = 20,
                    len = opt.data.length,
                    lpw = opt.lpWidth,
                    lph = opt.lpHeight,
                    w = me.cmpEl.width(),
                    h = me.cmpEl.height();
            
            var rows = Math.floor(h/(lph + vmargin));
            //rows===1代表只有一行，全部横向排列
            if(rows === 1){
                var columns = Math.ceil(len/rows);
                //2代表的是border的宽度
                me.contentEl.width(columns*(lpw + hmargin + 2)).height("100%");
            } else {
                //垂直排列
                me.cmpEl.css("overflow", "hidden");
                me.contentEl.css("overflow", "auto");
            }
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createCmpWidget: function() {
            var me = this,
                    len = me.options.data ? me.options.data.length : 0;
            
            me.cmpEl.addClass(containerCls);
            me.contentEl = $("<div>").attr("id", me.options.id + "-content")
                    .addClass(contentCls)
                    .appendTo(me.cmpEl);
            if(len > 0){
                me._createLookPanel();
            }
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.cmpEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.cmpEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.cmpEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.cmpEl.externalHeight(height);
        }
    });

    /**
     * APP管理组件
     * @name Sweet.cmp.AppManager
     * @class 
     * @extends Sweet.cmp
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     *  jquery.sweet.cmp.js
     * </pre>
     * @example 
     * <pre>
     * appmanager = new Sweet.cmp.AppManager({
     *     
     * });
     * </pre>
     */
    Sweet.cmp.AppManager = $.sweet.cmpAppManager;
}(jQuery));


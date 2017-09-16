/**
 * @fileOverview  
 * <pre>
 * 进度条组件
 * 2013/11/26
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

$(function($, undefined){
    "use strict";
    var progressBgCls = "sweet-progress-bg";
    var progressCls = "sweet-progress";
    var spanCls = "sweet-progress-span";
    $.widget("sweet.widgetProgressBar", $.sweet.widget, /** @lends Sweet.ProgressBar.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-ProgressBar]:",
        eventNames : /** @lends Sweet.ProgressBar.prototype*/{
            /**
             * @event
             * @description 点进度条改变事件
             * @param {Event} evt 点击事件对象
             * @param {Object} data {preData : 45, curData : 67}当前对象数据信息
             */
            change: "进度条改变事件"
        },
        type: "ProgressBar",
        options : /** @lends Sweet.ProgressBar.prototype*/{
            /**
             * 状态组件的宽度
             * @type number
             * @default 100%
             */
            width : "100%",
            /**
             * 进度条的数值，为0-100之间的数值，代表百分比值
             * @type number
             * @default 0
             */
            value : 0,
            /**
             * 进度条上显示的文字，默认为当前的百分比值，用户可自定义
             * @type string
             * @default ""
             */
            progressText : ""
        },
        /**
         * @public
         * @description 设置进度条的数值
         * @param {Number} value 进度条的数值
         * @param {string} progressText 进度条上显示的文字,只有用户自定义时需要更新
         */
        setValue : function(value, progressText){
            var me = this,
                options = me.options,
                preData = options.value;
            
            if(!me._check(value) || preData === value){
                return;
            }
            options.value = value;
            me._updateProgressData(progressText);
            
            me._triggerHandler(null, "change", {
                preData : preData,
                curData : value
            });
        },
        /**
         * @private
         * @description 检查进度条数值的合法性
         * @param {Number} value 进度条数值
         */
        _check : function(value){
            if($.isNull(value) || !$.isNumeric(value)){
                return false;
            }
            if(value < 0 || value > 100){
                return false;
            }
            return true;
        },
        /**
         * @private
         * @description 更新进度条的数值
         * @param {string} progressText 进度条上显示的文字，默认为当前的百分比值，用户可自定义
         */
        _updateProgressData : function(progressText){
            var me = this,
                    opt = me.options,
                    v = opt.value + "%",
                    txt = $.isNotNull(progressText) ? progressText : v;
            me.progressEl.css("width", v);
            me.spanEl.text(txt);
        },
        /**
         * @private
         * @description 子类继承实现, 绘制组件
         */
        _createSweetWidget: function(){
            var me = this,
                options = me.options,
                value = options.value,
                v = value + "%",
                txt = $.isNotNull(options.progressText) ? options.progressText : v;
            
            if(!me._check(value)){
                return;
            }
            
            me.pbarEl = $("<div>").attr("id", options.id)
                    .width(options.width).height(20)
                    .addClass(progressBgCls);
            me.spanEl = $("<span>").text(txt)
                    .addClass(spanCls).appendTo(me.pbarEl);
            me.progressEl = $("<div>").attr("id", options.id + "-progress")
                    .css("width", v)
                    .addClass(progressCls).appendTo(me.pbarEl);
        },
        /**
         * @private
         * @description layout时进行重新绘制
         */
        _doLayout : function(){
        },
        /**
         * @private
         * @description 返回图组件最外层jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        _getWidgetEl : function(original){
            return original ? this.pbarEl[0] : this.pbarEl;
        },
        /**
         * @private
         * @description 组件渲染
         * @param {string} id 渲染到相应容器的id
         */
        _render: function(id){
            var me = this;
            if($.isNull(id) || me.rendered){
                return;
            }
            
            if (!me.renderEl) {
                me._createRenderEl(id);
            }
            me.pbarEl.appendTo(me.renderEl);
            me.options.renderTo = id;
            me.rendered = true;
        }
    });
    /**
     * @description 进度条组件
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.widget
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建进度条组件：
     * var sBar = Sweet.ProgressBar({
     *      value : 0,
     *      width : 500,
     *      progressText : "已经处理0个，总共220个",
     *      renderTo : "progress-bar"
     * });
     */
    Sweet.ProgressBar = $.sweet.widgetProgressBar;
}(jQuery));
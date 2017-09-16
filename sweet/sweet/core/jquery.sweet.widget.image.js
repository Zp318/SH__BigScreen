/**
 * @fileOverview  
 * <pre>
 * 状态块组件
 * 2013/9/22
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

$(function($, undefined){
    "use strict";
    var imgCls = "sweet-img";
    var textCls = "sweet-description";
    $.widget("sweet.widgetImge", $.sweet.widget, /** @lends Sweet.Image.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-Image]:",
        eventNames : /** @lends Sweet.Image.prototype*/{
            /**
             * @event
             * @description 点击事件,只有注册了些事件，鼠标移动到上面时才显示为手型，表示可点击
             * @param {Event} evt 点击事件对象
             * @param {Object} data 当前点击的小方块的对象数据信息
             */
            click: "图片点击事件"
        },
        type: "image",
        options : /** @lends Sweet.Image.prototype*/{
            draggable : true,
            value : {}
        },
        /**
         * @private
         * @description 子类继承实现, 绘制组件
         */
        _createSweetWidget: function(){
            var me = this,
                    opt = me.options,
                    imgId = opt.id+"-img";
            me.contentEl = $("<div>").attr({id : opt.id})
                    .height(opt.height).width(opt.width);
            me.imgEl = $("<img>").addClass(imgCls).bind("click", function(e){
                me._triggerHandler(e, "click", opt.value);
            }).attr({
                id : imgId,
                src : opt.value.src
            }).appendTo(me.contentEl);
            if(opt.tips){
                me.imgEl.attr("title", opt.tips);
            }
            if(opt.description){
                me.desEl = $("<span>").addClass(textCls)
                        .attr("title", opt.description)
                        .text(opt.description).appendTo(me.contentEl);
            }
            if(opt.draggable){
                me.imgEl.draggable({
                    appendTo : "body",
                    helper : "clone"
                });
            } 
            me.imgEl.data("data", $.extend({}, opt.value, {description : opt.description}));
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
            this.renderEl = this.imgEl;
            return original ? this.imgEl[0] : this.imgEl;
        },
        _destroyWidget : function(){
            var me = this;
            if(me.imgEl){
                me.imgEl.unbind();
            }
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
            me.contentEl.appendTo(me.renderEl);
            me.options.renderTo = id;
            me.rendered = true;
            return true;
        }
    });
    /**
     * @description 图片
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.widget
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建图片组件：
     * var sBar = Sweet.Image({
     * });
     */
    Sweet.Image = $.sweet.widgetImge;
}(jQuery));
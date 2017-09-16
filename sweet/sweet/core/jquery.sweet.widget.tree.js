/**
 * @fileOverview  
 * <pre>
 * 树组件
 * 2013/2/18
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 创建Sweet.tree
 * @name Sweet.tree
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
 * </pre>
 */
(function($, undefined) {

    var defaultTreeClass = "sweet-tree-panel";

    $.widget("sweet.widgetTree", $.sweet.widget, /** @lends Sweet.tree.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-tree]:",
        options: /** @lends Sweet.tree.prototype*/{
		},
        /**
         * @private
         * @description 创建树
         */
        _createSweetWidget: function() {
            var me = this,
                    options = this.options,
                    treeEl = this.treeEl = $("<div>");
            treeEl.height(options.height)
                    .width(options.width)
                    .attr("id", options.id)
                    .addClass(defaultTreeClass + " " + options.widgetClass);
        },
        /**
         * @private
         * @description 返回组件高度
         */
        _getHeight: function(){
            return this.treeEl.externalHeight();
        },
        /**
         * @private
         * @description 返回组件宽度
         */
        _getWidth: function(){
            return this.treeEl.externalWidth();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            this.treeEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {
            this.treeEl.externalHeight(height);
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            this._setWidth(width);
            this._setHeight(height);
        },
        /**
         * @private
         * @description 子类继承实现
         */
        _destroyWidget: function() {
            if (this.treeEl) {
                this.treeEl.remove();
            }
        }
    });
}(jQuery));

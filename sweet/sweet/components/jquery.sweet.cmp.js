/**
 * @fileOverview 业务组件基类
 * @date 2013/1/25
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.sweet.widget.js
 */
(function($, undefined) {

    $.widget("sweet.widgetCmp", $.sweet.widget, {
        version: "1.0",
        sweetWidgetName: "[widget-cmp]",
        defaultElement: "<div>",
        type: "cmp",
        // form组件公共配置参数
        options: {
            /**是否显示，默认true*/
            visiable: true,
            /**组件值，默认空*/
            value: ""
        },
        /**
         * @private
         * @description 创建业务组件总入口
         */
        _createSweetWidget: function() {
            if (this.renderEl) {
                return;
            }
            var me = this,
                    cmpEl = me.cmpEl = $("<div>"),
                    options = me.options;
            cmpEl.attr("id", options.id)
                    .addClass(options.widgetClass)
                    .width(options.width)
                    .height(options.height);
            me._createCmpWidget();
        },
        /**
         * @private
         * @description 销毁form组件
         */
        _destroyWidget: function() {
            if (this.renderEl) {
                this.renderEl.remove();
            }
        },
        /**
         * @private
         * 创建业务组件，子类继承实现
         */
        _createCmpWidget: $.noop
    });
}(jQuery));
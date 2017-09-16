/**
 * @fileOverview  
 * <pre>
 * 组件--错误提示框
 * 2013.9.6
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    //图片区
    var imageClass = "sweet-errorInterface-img",
            //只有图片时的图片区
            imageOnlyClass = "sweet-errorInterface-imgOnly",
            //文本间的间距
            gapClass = "sweet-errorInterface-gap",
            //文本对齐方式
            contentAlignClass = "sweet-errorInterface-align",
            //错误类型文本区
            errorTextSpanClass = "sweet-errorInterface-errorTextSpan",
            //错误详情文本区
            tipTextSpanClass = "sweet-errorInterface-tipTextSpan",
            //文本区
            textSpanClass = "sweet-errorInterface-textSpan",
            contentDivClass = "sweet-errorInterface-contentDiv",
            divClass = "sweet-errorInterface-div",
            //只有错误类型文本时，文本样式
            errorTextOnlyClass = "sweet-errorInterface-errorTextOnly",
            //只有错误详情文本时，文本样式
            tipTextOnlyClass = "sweet-errorInterface-tipTextOnly",
            //只有文本时的文本区
            textOnlyClass = "sweet-errorInterface-textOnly",
            //图片类型
            imageTypeObj = {},
            //与图片类型绑定的错误类型文本样式
            errorTextType = {},
            //与图片类型绑定的错误详情文本样式
            tipTextType = {};
    imageTypeObj[Sweet.constants.errorType.UNCONNECTED] = "sweet-errorInterface-serverUnconnected";
    imageTypeObj[Sweet.constants.errorType.UNKNOWN] = "sweet-errorInterface-serverUnknown";
    imageTypeObj[Sweet.constants.errorType.COMMON] = "sweet-errorInterface-common";
    errorTextType[Sweet.constants.errorType.UNCONNECTED] = "sweet-errorInterface-errorTextUnconnected";
    errorTextType[Sweet.constants.errorType.UNKNOWN] = "sweet-errorInterface-errorTextUnknown";
    errorTextType[Sweet.constants.errorType.COMMON] = "sweet-errorInterface-errorTextCommon";
    tipTextType[Sweet.constants.errorType.UNCONNECTED] = "sweet-errorInterface-tipTextUnconnected";
    tipTextType[Sweet.constants.errorType.UNKNOWN] = "sweet-errorInterface-tipTextUnknown";
    tipTextType[Sweet.constants.errorType.COMMON] = "sweet-errorInterface-tipTextCommon";

    $.widget("sweet.widgetErrorInterface", $.sweet.widget, /** @lends Sweet.ErrorInterface.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-errorInterface]",
        options: /** @lends Sweet.ErrorInterface.prototype*/{
            /**
             * @description 图片类型
             * @type {String}
             * @default null
             */
            imageType: null,
            /**
             * @description 接受参数值
             * @type {String/Number/object}
             * @default {value: "", errorText: "", tipText:"", data:null}
             */
            value: {value: "", errorText: "", tipText: "", data: null}
        },
        /**
         * @description 更新组件数据
         * @param {Obj} obj 数据对象{imageType:"", value:{}}
         */
        _setValue: function(obj) {
            var me = this;
            //清空组件
            if (me.errorTextSpanEl) {
                me.errorTextSpanEl.remove();
            }
            if (me.tipTextSpanEl) {
                me.tipTextSpanEl.remove();
            }
            if (me.textSpanEl) {
                me.textSpanEl.remove();
            }
            if (me.imageEl) {
                me.imageEl.remove();
            }
            //更新参数
            me.options.value = obj.value;
            me.options.imageType = obj.imageType;
            me.options.width = obj.width;
            me.options.height = obj.height;
            //添加元素
            me._addElement(obj);
            //布局
            me._doLayout();
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
            this.errorEl.appendTo(this.renderEl);
            this.rendered = true;
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createSweetWidget: function() {
            var me = this;
            // 创建errorInterface组件          
            options = me.options;
            me.errorEl = $("<div>").addClass(divClass);
            me.contentEl = $("<div>").appendTo(me.errorEl).addClass(contentDivClass);
            //添加元素
            me._addElement(options);
        },
        /**
         * @private
         * @description 添加元素
         * @param {String，Obj} options 数据对象{imageType:"",value:{}}
         */
        _addElement: function(options) {
            var me = this;
            //加载图片元素           
            if ($.isNotNull(options.imageType)) {
                me.imageEl = $("<span>").addClass(imageTypeObj[options.imageType]).appendTo(me.contentEl);
            }
            //加载文本元素          
            if (me._isTextNotNull(options)) {
                me.textSpanEl = $("<span>").appendTo(me.contentEl);
                me.contentEl.css("width", Sweet.constants.elWidth.DIV_WIDTH);
                if ($.isNotNull(options.value.errorText)) {
                    me.errorTextSpanEl = $("<span>").appendTo(me.textSpanEl).text(options.value.errorText);
                    if ($.isNotNull(options.imageType)) {
                        me.errorTextSpanEl.addClass(errorTextType[options.imageType]);
                    } else {
                        me.errorTextSpanEl.addClass(errorTextOnlyClass);
                    }
                }
                if ($.isNotNull(options.value.tipText)) {
                    if ($.isNotNull(options.value.errorText)) {
                        me.textGap = $("<div>").appendTo(me.textSpanEl).addClass(gapClass);
                    }
                    me.tipTextSpanEl = $("<span>").appendTo(me.textSpanEl).text(options.value.tipText);
                    if ($.isNotNull(options.imageType)) {
                        me.tipTextSpanEl.addClass(tipTextType[options.imageType]);
                    } else {
                        me.tipTextSpanEl.addClass(tipTextOnlyClass);
                    }
                }
            }
            //添加样式
            me._addClass(options);
        },
        /**
         * @private
         * @description 添加样式
         * @param {String，Obj} options 数据对象{imageType:"",value:{}}
         */
        _addClass: function(options) {
            var me = this;
            if ($.isNotNull(options.imageType) && me._isTextNotNull(options)) {
                me.imageEl.addClass(imageClass);
                me.textSpanEl.addClass(textSpanClass);
                if ($.isNotNull(options.value.errorText)) {
                    me.errorTextSpanEl.addClass(errorTextSpanClass);
                }
                if ($.isNotNull(options.value.tipText)) {
                    me.tipTextSpanEl.addClass(tipTextSpanClass);
                }
            } else if ($.isNotNull(options.imageType)) {
                me.imageEl.addClass(imageOnlyClass);
            } else {
                if (me.tipTextSpanEl) {
                    var tipW = me.tipTextSpanEl.width();
                }
                if (me.errorTextSpanEl) {
                    var errorW = me.errorTextSpanEl.width();
                }
                var textW = tipW > errorW ? tipW : errorW;
                me.textSpanEl.addClass(contentAlignClass);
                if (textW < Sweet.constants.elWidth.MIN_WIDTH) {
                    me.textSpanEl.css("min-width", textW);
                } else {
                    me.textSpanEl.css("min-width", Sweet.constants.elWidth.MIN_WIDTH);
                }
                me.textSpanEl.addClass(textOnlyClass);
                if (me.errorTextSpanEl) {
                    me.errorTextSpanEl.addClass(errorTextSpanClass);
                }
                if (me.tipTextSpanEl) {
                    me.tipTextSpanEl.addClass(tipTextSpanClass);
                }
            }
        },
        /**
         * @private
         * @description 判断文本是否为空
         * @param {String，Obj} options 数据对象{imageType:"",value:{}}
         */
        _isTextNotNull: function(options) {
            if ($.isNull(options.value)) {
                return false;
            } else if (($.isNull(options.value.errorText) && $.isNull(options.value.tipText))) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * @private
         * @description 组件布局
         */
        _doLayout: function() {
            var me = this;
            //设置组件高度和宽度            
            me.errorEl.css("width", me.options.width);
            me.errorEl.css("height", me.options.height);
            //使组件在文字较短时居中
            if ($.isNotNull(me.options.imageType) && me._isTextNotNull(me.options)) {
                var tipW = 0;
                var errorW = 0;
                if (me.tipTextSpanEl) {
                    tipW = me.tipTextSpanEl.width();
                }
                if (me.errorTextSpanEl) {
                    errorW = me.errorTextSpanEl.width();
                }
                var textW = tipW > errorW ? tipW : errorW;
                var contW = me.imageEl.width() + textW + Sweet.constants.gap.IMG_TEXT;
                me.contentEl.css("width", contW);
            }
        },
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.contentEl.externalWidth();
        },
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.contentEl.externalHeight();
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.contentEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.contentEl.externalHeight(height);
        }
        /**
         * 统一错误提示组件
         * @name Sweet.ErrorInterface
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
         * errorInterface = new Sweet.ErrorInterface({
         *          imageType: "server_unconnected",
         *          renderTo: "sweet-errorInterface",
         *          value: { "value":1, 
         *                   "errorText":"服务器连接中断", 
         *                   "tipText":"所有监控指标暂时无法获取,请稍后刷新重试。", 
         *                   "data":null
         *                  },
         *          width: "100%",
         *          height: "100%"
         *      });   
         * </pre>
         */
    });
    Sweet.ErrorInterface = $.sweet.widgetErrorInterface;
}(jQuery));


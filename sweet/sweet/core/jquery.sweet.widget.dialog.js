/**
 * @fileOverview  
 * <pre>
 * dialog组件
 * 2013/1/25
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * dialog组件
 * @name Sweet.Dialog
 * @class
 * @extends Sweet.widget
 * @requires 
 * <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.sweet.widget.js
 * </pre>
 */
(function($, undefined) {

    var self,
            dialogTitleClass = "sweet-dialog-title",
            dialogTitleCloseClass = "sweet-dialog-title-close",
            dialogContentClass = "sweet-dialog-content",
            dialogSuccessClass = "sweet-dialog-content-success",
            dialogErrorClass = "sweet-dialog-content-error",
            dialogWarnClass = "sweet-dialog-content-warning",
            dialogConfirmClass = "sweet-dialog-content-confirm",
            dialogPromptClass = "sweet-dialog-content-prompt",
            dialogPromptTextClass = "sweet-dialog-content-prompt-text",
            dialogPromptInputClass = "sweet-dialog-content-prompt-input",
            dialogBottomClass = "sweet-dialog-bottom",
            dialogButtonClass = "sweet-form-button",
            dialogTextClass = "sweet-dialog-text",
            dialogTextPicClass = "sweet-dialog-text-pic",
            inputElId = "sweet-dialog-content-input";

    $.widget("sweet.widgetDialog", $.sweet.widget, /** @lends Sweet.Dialog.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-dialog]",
        defaultElement: "<div>",
        defaultDialogBg: "sweet-dialog-bg",
        // dialog组件公共配置参数
        options: /** @lends Sweet.Dialog.prototype*/{
            /**
             * dialog宽度
             * @type {String/Number}
             * @default 330px
             */
            width: 330,
            /**
             * dialog高度
             * @type {String/Number}
             * @default 130px
             */
            height: 130,
            /**
             * 是否模态窗口
             * @type {Boolean}
             * @default true
             */
            modal: true,
            /**
             * 是否阻止事件冒泡
             * @type {Boolean}
             */
            propagation: false
        },
        /**
         * @description 提示dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,        宽度
         *      height: 137,       高度
         *      modal: true/false, 是否模态
         *      message: "",       提示信息
         *      listeners: {
         *          "ok": func     确定按钮回调
         *      }
         *  }
         * </pre>
         */
        alert: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            self._showDialog({"dialogClass": "",
                "propagation": params.propagation,
                "prompt": param.prompt ? param.prompt : Sweet.core.i18n.dialog.alert,
                "modal": params.modal,
                "message": params.message,
                "okFun": listeners.ok});
            self.textEl.removeClass().addClass(dialogTextClass);
            self.cancelButtonEl.hide();
            self.inputEl.hide();
            return self;
        },
        /**
         * @description 错误dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,        宽度
         *      height: 137,       高度
         *      modal: true/false, 是否模态
         *      message: "",       提示信息
         *      listeners: {
         *          "ok": func     确定按钮回调
         *      }
         *  }
         * </pre>
         */
        success: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            self._showDialog({"dialogClass": dialogSuccessClass,
                "propagation": params.propagation,
                "prompt": Sweet.core.i18n.dialog.success,
                "modal": params.modal,
                "message": params.message,
                "okFun": listeners.ok});
            self.textEl.addClass(dialogTextPicClass);
            self.cancelButtonEl.hide();
            self.inputEl.hide();
            return self;
        },
        /**
         * @description 错误dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,        宽度
         *      height: 137,       高度
         *      modal: true/false, 是否模态
         *      message: "",       提示信息
         *      listeners: {
         *          "ok": func     确定按钮回调
         *      }
         *  }
         * </pre>
         */
        error: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            self._showDialog({"dialogClass": dialogErrorClass,
                "propagation": params.propagation,
                "prompt": Sweet.core.i18n.dialog.error,
                "modal": params.modal,
                "message": params.message,
                "okFun": listeners.ok});
            self.textEl.addClass(dialogTextPicClass);
            self.cancelButtonEl.hide();
            self.inputEl.hide();
            return self;
        },
        /**
         * @description 警告dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,        宽度
         *      height: 137,       高度
         *      modal: true/false, 是否模态
         *      message: "",       提示信息
         *      listeners: {
         *          "ok": func     确定按钮回调
         *      }
         *  }
         * </pre>
         */
        warn: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            self._showDialog({"dialogClass": dialogWarnClass,
                "propagation": params.propagation,
                "prompt": Sweet.core.i18n.dialog.warn,
                "modal": params.modal,
                "message": params.message,
                "okFun": listeners.ok,
                "cancelFun": listeners.cancel});
            self.textEl.addClass(dialogTextPicClass);
            self.cancelButtonEl.hide();
            self.inputEl.hide();
            return self;
        },
        /**
         * @description 确认dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,        宽度
         *      height: 137,       高度
         *      modal: true/false, 是否模态
         *      message: "",       提示信息
         *      listeners: {
         *          "ok": func,    确定按钮回调
         *          "cancel": func 取消按钮回调
         *      }
         *  }
         * </pre>
         */
        confirm: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            self._showDialog({"dialogClass": dialogConfirmClass,
                "propagation": params.propagation,
                "prompt": Sweet.core.i18n.dialog.confirm,
                "modal": params.modal,
                "message": params.message,
                "okFun": listeners.ok,
                "cancelFun": listeners.cancel});
            self.textEl.addClass(dialogTextPicClass);
            self.cancelButtonEl.show();
            self.inputEl.hide();
            return self;
        },
        /**
         * @description 带输入框的dialog
         * @param {Object} param
         * <pre>
         *  {
         *      width: 330,             宽度
         *      height: 137,            高度
         *      modal: true/false,      是否模态
         *      message: "",            提示信息
         *      required: true/false,   是否必填项
         *      validateFun: Function,  校验函数，同Sweet.form.TextField组件validateFun属性
         *      emptyText: "",          同Sweet.form.TextField组件emptyText属性
         *      listeners: {
         *          "ok": func,         确定按钮回调
         *          "cancel": func      取消按钮回调
         *      }
         *  }
         * </pre>
         */
        prompt: function(param) {
            var params = $.extend({}, self.options, param),
                    listeners = params.listeners || {};
            self.params = params || {};
            function onOK(event) {
                if ($.isFunction(listeners.ok)) {
                    return listeners.ok(event, self.inputTextEl.getValue());
                }
            }
            self._showDialog({"dialogClass": dialogPromptClass,
                "propagation": params.propagation,
                "prompt": Sweet.core.i18n.dialog.prompt,
                "modal": params.modal,
                "message": params.message,
                "okFun": onOK,
                "cancelFun": listeners.cancel});
            self.textEl.removeClass().addClass(dialogPromptTextClass + " " + dialogTextClass);
            self.cancelButtonEl.show();
            self.inputEl.show();
            // 创建文本输入框
            if (!self.inputTextEl) {
                var vid = (params.vID ? params.vID : params.id) + "_prompt_text";
                self.inputTextEl = new Sweet.form.TextField({
                    width: self.contentEl.width(),
                    required: params.required || false,
                    minLength: params.minLength || 0,
                    maxLength: params.maxLength || Number.MAX_VALUE,
                    errorModel: Sweet.constants.tipAttr.MODEL_NORMAL,
                    validateFun: params.validateFun,
                    emptyText: params.emptyText,
                    vID : vid,
                    renderTo: inputElId
                });
            } else {
                self.inputTextEl.setValue({"text": "", "value": ""});
            }
            return self;
        },
        /**
         * @description 显示dialog
         */
        show: function() {
            self.dialogEl.show();
        },
        /**
         * @description 隐藏dialog
         */
        hide: function() {
            self.dialogEl.hide();
        },
        /**
         * @description 获取form组件对象，返回jquery对象
         * @param {Boolean} original true 返回原生html对象，false 返回jquery对象
         */
        _getWidgetEl: function(original) {
            return original ? this.dialogEl[0] : this.dialogEl;
        },
        /**
         * @private
         * @description 重新绘制dialog窗口
         */
        _doLayout: function() {
            var me = this,
                    params = me.params || {},
                    options = me.options,
                    width = params.width || options.width,
                    height = params.height || options.height,
                    doc = $(document),
                    docWidth,
                    docHeight,
                    top,
                    left;
            // 组件初始化调用时document还未完成，捕获异常，不做处理
            try {
                docWidth = doc.width();
                docHeight = doc.height();
            } catch (e) {
                return;
            }
            top = Math.floor((docHeight - height) / 3);
            left = Math.floor((docWidth - width) / 2);
            me.dialogEl.css({"top": top < 0 ? 0 : top, "left": left}).width(width).height(height);
            //不是带输入框的信息对话框，当文本内容高度大于指定高度时，出滚动条
            if (me.dialogClass === dialogPromptClass) {
                var textElH = parseInt(me.textEl.css("height"));
                me.textDiv.css({width: "100%", height: textElH});
            } else {
                var textElTop = me.textEl.offset().top,
                        bottomElTop = me.bottomEl.offset().top,
                        textDivH = bottomElTop - textElTop - 7,
                        textElH = parseInt(me.textEl.css("height"));
                me.textDiv.css({width: "100%", height: textDivH});
                if (textElH > textDivH) {
                    if (me.textDiv.css("overflow-y") !== "auto") {
                        me.textDiv.css("overflow-y", "auto");
                    }
                }
                else {
                    me.textDiv.css("overflow-y", "hidden");
                }
            }
        },
        /**
         * @private
         * @description 显示dialog
         * @param {Object} params 参数，格式如下：
         *      {String} dialogClass 对话框样式，标识错误、提示等图片
         *      {String} prompt 对话框标题信息
         *      {String} modal 是否模态窗口
         *      {String} message dialog提示信息
         *      {Function} okFun 确定按钮回调事件
         *      {Function} cancelFun 取消按钮回调事件
         */
        _showDialog: function(params) {
            var dialogClass = params.dialogClass,
                    prompt = params.prompt,
                    modal = params.modal,
                    message = params.message,
                    okFun = params.okFun,
                    cancelFun = params.cancelFun,
                    propagation = params.propagation;
            // 记录当前弹出窗口样式
            self.dialogClass = dialogClass;
            function closeDialog(result) {
                // 确认或取消按钮只能关闭与之匹配的窗口
                if (dialogClass !== self.dialogClass) {
                    return;
                }
                if (("boolean" === $.type(result) && result) || undefined === result) {
                    self._closeDialog();
                }
            }

            function okFunction(event, okFun, dialogClass) {
                var result = true;
                if ($.isFunction(okFun)) {
                    result = okFun.call(null, event);
                }
                closeDialog(result, dialogClass);
            }

            function cancelFunction(event, cancelFun, dialogClass) {
                var result = true;
                if ($.isFunction(cancelFun)) {
                    result = cancelFun.call(null, event);
                }
                closeDialog(result, dialogClass);
            }

            if (!self.hasAppend) {
                self.dialogEl.appendTo("body");
                self.hasAppend = true;
            }
            var dialogEl = self.dialogEl,
                    zIndex = 0;
            // 是否模态对话框
            if (modal) {
                dialogEl.sweetMask({"maskAll": true, "propagation": propagation});
                zIndex = $.string.toNumber(dialogEl.getSweetMaskZIndex()) + 1;
            } else {
                zIndex = $.getMaxZIndex();
            }
            dialogEl.css("z-index", zIndex);
            // 是否阻止事件冒泡
            if (propagation) {
                dialogEl.bind("click", function(e) {
                    // 全局遮罩时，阻止事件冒泡
                    e.stopImmediatePropagation();
                });
            }
            self.titleTextEl.html(prompt);
            self.picDivEL.removeClass().addClass(dialogClass);
            self.textEl.html(message);
            self.show();
            self._doLayout();
            // 绑定事件
            self.okButtonEl.unbind().bind("click", {"dialogClass": dialogClass}, function(event) {
                okFunction(event, okFun, event.data.dialogClass);
            });
            self.cancelButtonEl.unbind().bind("click", {"dialogClass": dialogClass}, function(event) {
                cancelFunction(event, cancelFun, event.data.dialogClass);
            });
            // 增加拖动功能
            self.dialogEl.draggable({handle: "#" + self.titleId, containment: "document", scroll: false});
        },
        /**
         * @private
         * @description 关闭dialog
         * @param {Object} e 按钮事件对象
         */
        _closeDialog: function(e) {
            var event = e || {},
                    data = event.data || {},
                    that = data.me || this,
                    params = that.params || {},
                    modal = params.modal;
            if (modal) {
                that.dialogEl.unSweetMask();
            }
            that.hide();
        },
        /**
         * @private
         * @description 绘制对话框组件
         */
        _createSweetWidget: function() {
            if (self) {
                return;
            }
            var me = this,
                    options = me.options,
                    dialogEl = me.dialogEl = $("<div>").hide();
            self = me;
            dialogEl.addClass(me.defaultDialogBg + options.widgetClass)
                    .attr("id", options.id)
                    .height(options.height)
                    .width(options.width);
            // 添加标题
            me._createTitle();
            // 添加提示内容
            me._createContent();
            // 添加按钮
            me._createButtons();
        },
        /**
         * @private
         * @description 创建dialog标题
         */
        _createTitle: function() {
            var me = this,
                    options = me.options,
                    params = me.params || {},
                    titleEl = me.titleEl = $("<div>"),
                    closeSapn = me.closeSapn = $("<span>").addClass(dialogTitleCloseClass),
                    titleTextEl = me.titleTextEl = $("<em>"),
                    titleId = me.titleId = me.id + "-dialog-title";
            closeSapn.bind("click", function() {
                me._closeDialog();
            })
                    .appendTo(titleEl);
            titleTextEl.appendTo(titleEl);
            titleEl.attr("id", titleId).addClass(dialogTitleClass)
                    .appendTo(this.dialogEl);
        },
        /**
         * @private
         * @description 添加dialog主体内容
         */
        _createContent: function() {
            var me = this,
                    options = me.options,
                    contentEl = me.contentEl = $("<div>"),
                    picDivEl = me.picDivEL = $("<div>").appendTo(contentEl),
                    textDiv = me.textDiv = $("<div>").appendTo(picDivEl);
            me.textEl = $("<p>").appendTo(textDiv);
            me.inputEl = $("<div>").attr("id", inputElId).addClass(dialogPromptInputClass).appendTo(contentEl);
            contentEl.addClass(dialogContentClass)
                    .appendTo(me.dialogEl);
        },
        /**
         * @private
         * @description 给dialog添加按钮
         */
        _createButtons: function() {
            var me = this,
                    opt = me.options,
                    id = opt.vID ? opt.vID : opt.id,
                    buttonCss = {"width": "65px", "margin-left": "5px"},
                    bottomEl = me.bottomEl = $("<div>").addClass(dialogBottomClass),
                    okButtonEl = me.okButtonEl = $("<button>").attr("id", id + "_ok")
                            .addClass(dialogButtonClass),
                    cancelButtonEl = me.cancelButtonEl = $("<button>").attr("id", id + "_cancel")
                            .addClass(dialogButtonClass);
            okButtonEl.css(buttonCss).text(Sweet.core.i18n.dialog.ok).appendTo(bottomEl);
            cancelButtonEl.css(buttonCss).text(Sweet.core.i18n.dialog.cancel).appendTo(bottomEl);
            bottomEl.appendTo(me.dialogEl);
        }
    });

    /**
     * @description dialog对象
     * @class
     * @extends jquery.sweet.widget.js
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example
     * 创建提示对话框：
     * var sweetAlert = Sweet.Dialog.alert({
     *     width: 330,
     *     height: 130,
     *     modal: false,
     *     message: "这是一个提示信息对话框！",
     *     listeners: {
     *         "ok": function() {
     *             alert("alert OK");
     *             sweetAlert.hide();
     *         }
     *     }
     * });
     */
    Sweet.Dialog = new $.sweet.widgetDialog({message: ""});

    /**
     * @description Sweet.Dialog的简写形式
     */
    Sweet.Msg = {
        /**
         * alert框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         */
        alert: function(message, width, height, okFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.alert({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    }
                }
            });
        },
        /**
         * 成功框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         */
        success: function(message, width, height, okFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.success({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    }
                }
            });
        },
        /**
         * 警告框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         */
        warn: function(message, width, height, okFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.warn({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    }
                }
            });
        },
        /**
         * 错误框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         */
        error: function(message, width, height, okFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.error({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    }
                }
            });
        },
        /**
         * 确认对话框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         * @param {Function} cancelFun 点击cancel按钮回调
         */
        confirm: function(message, width, height, okFun, cancelFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.confirm({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    },
                    "cancel": function(event) {
                        if ($.isFunction(cancelFun)) {
                            cancelFun.call(null, event);
                        }
                    }
                }
            });
        },
        /**
         * 带输入框的交互对话框
         * @param {String} message 提示信息
         * @param {Number} width 宽度
         * @param {Number} height 高度
         * @param {Function} okFun 点击OK按钮回调
         * @param {Function} cancelFun 点击cancel按钮回调
         */
        prompt: function(message, width, height, okFun, cancelFun) {
            if ($.isNull(message)) {
                return;
            }
            var dialog = Sweet.Dialog.prompt({
                width: width ? width : 330,
                height: height ? height : 130,
                message: message,
                listeners: {
                    "ok": function(event) {
                        if ($.isFunction(okFun)) {
                            okFun.call(null, event);
                        }
                    },
                    "cancel": function(event) {
                        if ($.isFunction(cancelFun)) {
                            cancelFun.call(null, event);
                        }
                    }
                }
            });
        }
    };
}(jQuery));

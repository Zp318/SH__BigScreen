/**
 * @fileOverview  
 * <pre>
 * form组件--上传组件
 * 2013/8/5
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    var browseButtonClass = "sweet-form-button",
        fileUploadDivClass = "sweet-form-fileupload-div",
        fileUploadButtonClass = "sweet-form-fileupload-button",
        fileUploadInputWidthClass = "sweet-form-fileupload-input-width",
        fileUploadInputClass = "sweet-form-fileupload-input",
        iframeClass = "sweet-form-fileupload-iframe",
        iframeNameSuffix = "-fileUpload",
        formDivSuffix = "-sweetFileloadFormDiv",
            eventBeforeUpload = "beforeUpload",
        eventAfterUpload = "afterUpload";

    $.widget("sweet.widgetFormFileUploadfield", $.sweet.widgetFormTextfield,/** @lends Sweet.form.FileUpLoadField.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-fileuploadfield]",
        type: 'text',
        eventNames: /** @lends Sweet.form.FileUpLoadField.prototype*/{
            /**
             * @event
             * @description 上传前触发,参数为一个(me)
             */
            beforeUpload: "上传前事件",
            /**
             * @event
             * @description 上传后触发,参数为两个(event, data)
             */
            afterUpload: "上传后触发"
        },
        /** 
         * @private
         * @description form组件公共配置参数
         * @type object  
         */
        options: /** @lends Sweet.form.FileUpLoadField.prototype*/{
            /**
             * @description 提交地址
             * @type {String}
             * @default ""
             */
            url: ""
        },
        /**
         * @description 提交
         */
        submit: function() {
            var me = this,
                    flag;
            flag = me._triggerHandler(me, eventBeforeUpload);
            if (false === flag || "false" === flag) {
                return;
            }
            if (me.validate()) {
                me.submitEl.click();
                // 启动定时器
                Sweet.Task.Timeout.start({
                    id: me._uploadTaskId,
                    run: function() {
                        var content = me._getIframeContentEl().html();
                        if ($.isNotNull(content)) {
							//这里作了一个延迟，但延迟后如果还没有取完数据时还有问题，另外延迟的id如果相同会将原来的覆盖，不会执行，所以先停止定时器
							Sweet.Task.Timeout.stop(me._uploadTaskId);
							Sweet.Task.Delay.start({
								id: "submitgetdata",
								run: function() {
									content = me._getIframeContentEl().html();
									me._triggerHandler(null, eventAfterUpload, content);
								},
								delay: 200
							});
                        }
                    },
                    interval: 100
                });
            }
        },
        /**
         * @description 清空文件选择
         */
        clear: function() {
            var me = this;
            me.uploadEl.val("");
            me.formElement.val("");
            me.closeTip();
        },
        /**
         * @public
         * @param {url} url:上传文件的url地址
         * @description 设置URL
         */
        setUrl: function(url) {
            var me = this,
                formDivID = me.options.id + formDivSuffix;

            if($.isNotNull(url) && url !== me.options.url){
                me.options.url = url;
                $("#" + formDivID).attr("action", me.options.url);
            }
        },
        /**
         * @private
         * @description 重新计算并绘制页面
         */
        _doLayout: function() {
            this._super();
        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} value 设置数值，格式为{value: 值, text: 文本}
         */
        _setValue: function(value) {
            var me = this;
            if (value && value.value) {
                me.formElement.val(value.value);
            }
        },
        /**
         * @private
         * @description 获取组件值
         * @return 返回值，格式为{value: 值, text: 文本}
         */
        _getValue: function() {
            var me = this,
                value = me.formElement.val();
            return {"value": value, "text": value};
        },
        /**
         * @private
         * @description 获取iframe内容区对象
         */
        _getIframeContentEl: function() {
            return $(this.iframeEl[0].contentWindow.document.body);
        },
        /**
         * @private
         * @description 创建上传组件
         */
        _afterCreateFormWidget: function() {
            // 上传组件标签必须有name，否则无法正确提交
            var me = this,
                    options = me.options,
                    iframeId = options.id + iframeNameSuffix,
                    uploadEl = $("<input type='file' name='" + options.id + "-file' size='1'>"),
                    uploadButton = $("<input type='button'>"),
                    formDivID = options.id + formDivSuffix;
            me._uploadTaskId = options.id + "-upload-task";
            me.uploadEl = uploadEl.bind("change", function() {
                var value = $(this).val();
                if ($.isNull(value)) {
                    return;
                }
                //获取文件名
                var fileName = value.lastIndexOf("\\");
                if (-1 !== fileName)
                {
                    value = value.slice(fileName + 1);
                }
                me.formElement.val(value);
                // 重新选择时，清空iframe中的内容
                me._getIframeContentEl().text("");
                me.validate();
            });

            me.formEl.addClass(fileUploadDivClass);
            me.formSubmitEl = $("<form id='" + formDivID + "' method='post' enctype='multipart/form-data' action='" +
                    options.url + "'" +
                    "target='" + iframeId + "'>");
            me.formDiv2El.wrap(me.formSubmitEl)
                    .addClass(fileUploadInputWidthClass);
            uploadEl.insertAfter(me.formDiv2El)
                    .addClass(fileUploadInputClass);
            uploadButton.attr("value", Sweet.core.i18n.fileUpload.browse + '...')
                    .insertAfter(uploadEl)
                    .addClass(browseButtonClass + " " + fileUploadButtonClass);
            me.submitEl = $("<input type='submit'>").insertAfter(uploadEl);
            // 生成隐藏iframe，用于上传提交
            me.iframeEl = $("<iframe id=\"" + iframeId + "\" name=\"" + 
                    iframeId + "\" class=\"" + iframeClass + "\">").insertAfter(uploadEl);
        },
        /**
         * @private
         * @description 获取文件字节大小
         */
        getFileSize: function() {
            var me = this,
                    tImgEl,
                    filesize = 0;
            if (!me.uploadEl || !me.formSubmitEl) {
                return filesize;
            }
            try {
                if ($.isFirefox() || $.isChrome()) {
                    filesize = me.uploadEl.get(0).files[0].size;
                } else if ($.isIE()) {
                    // 通过临时的img对象获取文件大小,---IE下有问题
                    tImgEl = $("<img dynsrc='' src=''>").css("display", "none").appendTo(me.formSubmitEl);
                    tImgEl.get(0).dynsrc = me.uploadEl.val();
                    filesize = tImgEl.get(0).fileSize;
                    tImgEl.remove();
                }
            } catch (e) {
                if (tImgEl) {
                    tImgEl.remove();
                }
            }
            return filesize;
        }
    });

    /**
     * 上传组件
     * @name Sweet.form.FileUpLoadField
     * @class 
     * @extends Sweet.form.TextField
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * jquery.sweet.widget.form.textfield.js
     * </pre>
     * @example 
     * var fileUploadField = new Sweet.form.FileUpLoadField({
     *            url: "/somefile/test",
     *            label : true,
     *            width : 400,
     *            labelText : '文件名',
     *            renderTo : "sweet-upload"
     *        });
     */
    Sweet.form.FileUpLoadField = $.sweet.widgetFormFileUploadfield;
}(jQuery));

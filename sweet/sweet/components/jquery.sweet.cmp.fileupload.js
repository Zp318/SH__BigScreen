/**
 * @fileOverview 
 * <pre>
 * 文件上传组件
 * 2013/08/09
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    $.widget("sweet.widgetCmpFileUpload", $.sweet.widgetCmp, /** @lends Sweet.cmp.FileUpload.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-cmp-fileupload]",
        defaultElement: "<div>",
        type: "fileupload",
        eventNames: {"afterUpload": "上传后触发"},
        // fileupload组件公共配置参数
        options: /** @lends Sweet.cmp.FileUpload.prototype*/ {
            /**
             * win宽度
             * @type String/Number
             * @default 360px
             */
            width: 360,
            /**
             * win高度
             * @type String/Number
             * @default 124px
             */
            height: 124,
            /**
             * wintitle
             * @type String
             * @default 中文：文件上传/英文：Upload File
             */
            title: Sweet.core.i18n.fileUploadWin.title,
            /**
             * @description 是否有label
             * @type Boolean
             * @default true
             */
            label: true,
            /**
             * @description label宽度
             * @type {String/Number}
             * @default 30%
             */
            labelWidth: "30%",
            /**
             * @description label文字
             * @type {String}
             * @default 中文：文件名/英文：File Name
             */
            labelText: "",
            /**
             * @description 是否必选项
             * @type {Boolean}
             * @default false
             */
            required: true,
            /**
             * @description 是否可编辑
             * @type {Boolean}
             * @default true
             */
            editable: true,
            /**
             * @description 错误提示的显示模式
             * @type String
             * @default none
             */
            errorModel: "none",
            /**
             * @description 错误提示出现的条件，使用时自己定义
             * @type Function
             * @default false
             */
            validateFun: function() {
                return {"success": true};
            },
            /**
             * 提交地址
             * @type {String}
             * @default ""
             */
            url: "",
            /**
             * @description 是否呈现导入方式，true：呈现, false：不呈现
             * @type {Boolean}
             * @default false
             */
            import: false,
            /**
             * 点击上传后的回调函数
             * @type function
             * @default null
             */
            afterUpload : null,
            /**
             * 点击上传之前的回调函数，设置此方法后，需要用户用去调用OK方法进行提交
             * @type function
             * @default null
             */
            beforeUpload : null
        },
        /**
         * @description 显示
         */
        show: function() {
            var me = this;
            // 清空选择内容
            me.fileuploaddiv.clear();
            me.wnd.show();
        },
        /**
         * @description 隐藏
         */
        hide: function() {
            this.wnd.hide();
        },
        /**
         * @description 组件校验
         */
        isValidate: function() {
            var me = this;
            return me.fileuploaddiv.validate();
        },
        /**
         * @description 用户手动调用ok按钮事件进行提交
         */
        OK : function(){
            var me = this,
                    options = me.options;
            if (!me.fileuploaddiv.validate()) {
                return false;
            }
            me.fileuploaddiv.submit();
            if(options.afterUpload && $.isFunction(options.afterUpload)){
                options.afterUpload();
            }
        },
        /**
         * @private
         * @description 获取组件值
         * @param {Object} value
         */
        _setValue: function(value) {

        },
        /**
         * @private
         * @description 设置组件值
         * @return 返回值
         */
        _getValue: function() {

        },
        /**
         * @private
         * @description 创建上传组件
         */
        _createCmpWidget: function() {
            var me = this,
                    options = me.options,
                    winContent,importDiv;
            var fileuploaddiv = me.fileuploaddiv = new Sweet.form.FileUpLoadField({
                label: options.label,
                labelText: options.labelText,
                errorModel: options.errorModel,
                labelWidth: options.labelWidth,
                required: options.required,
                editable: options.editable,
                validateFun: options.validateFun,
                vID: options.vID,
                url: options.url
            });

            if(options.import){
                if(160 > options.height){
                    options.height = options.height + 35;
                }

                //创建导入方式
                importDiv = me._creatImportType();
                winContent = new Sweet.panel.VPanel({
                    width: "100%",
                    height: "100%",
                    items: [importDiv, fileuploaddiv],
                    itemExtend: false
                });
            }
            else{
                winContent = fileuploaddiv;
            }
            //加载弹出窗口
            me.wnd = new Sweet.Window({
                width: options.width,
                height: options.height,
                title: options.title,
                content: winContent,
                listeners: {
                    "ok": function() {
                        //如果设置有import，先取得import的类型设置给url
                        if(me.options.import && me.importTypeGroup){
                            var val = me.importTypeGroup.getValue();
                            if($.isNotNull(val) && $.isNotNull(val.value)){
                                var newUrl = "";
                                if(String(me.options.url).indexOf("importType=1") !== -1){
                                    newUrl = String(me.options.url).replace("importType=1", "importType="+val.value);
                                } else if(String(me.options.url).indexOf("importType=2") !== -1){
                                    newUrl = String(me.options.url).replace("importType=2", "importType="+val.value);
                                } else {
                                    var suffix = "?importType=";
                                    if(String(me.options.url).indexOf("?") !== -1){
                                        suffix = "&importType=";
                                    }
                                    newUrl = me.options.url + suffix + val.value;
                                }
                                me.fileuploaddiv.setUrl(newUrl);
                            }
                        }
                        if(options.beforeUpload && $.isFunction(options.beforeUpload)){
                            var flag = options.beforeUpload();
                            if ("false" === flag || false === flag) {
                                return flag;
                            }
                        } else {
                            return me.OK();
                        }
                    },
                    "cancel": function() {

                    }
                }
            });
        },
        /**
         * @private
         * @description 创建导入方式部分
         */
        _creatImportType:function(){
            var me = this,
                oldUrl = me.options.url,
                newUrl,
                importTypeObj,
                importTypeObjData,
                importTypeLabel,
                importDivEI,
                reg = /\?+/;

            if(me.options.import){
                importTypeLabel = new Sweet.form.Label({
                    width : 85,
                    height : 25,
                    symbol: true,
                    blank: false,
                    value : {text:Sweet.core.i18n.fileUpload.importType, value:'importTypeLabel'}
                });

                importTypeObjData = [
                    {text: Sweet.core.i18n.fileUpload.appendImport, value: 1,checked: true},
                    {text: Sweet.core.i18n.fileUpload.overWriteImport, value: 2,checked: false}
                ];
                importTypeObj = me.importTypeGroup = new Sweet.form.RadioGroup({
                    width : 300,
                    height : 25,
                    columns: "auto",
                    data: importTypeObjData,
                    tip: true
                });

                importTypeObj.addListener("change", function(event, val){
                    if($.isNotNull(val) && $.isNotNull(val.value)){
                        if (reg.test(oldUrl)){
                            newUrl = me.options.url + "&importType=" + val.value;
                        }
                        else{
                            newUrl = me.options.url + "?importType=" + val.value;
                        }
                        
                        me.fileuploaddiv.setUrl(newUrl);
                    }
                });

                importDivEI = new Sweet.panel.HPanel({
                    width: 400,
                    height: 30,
                    items: [importTypeLabel, importTypeObj],
                    itemExtend: false
                });
            }

            return importDivEI;
        },
        /**
         * 注册监听事件
         * @param {String} eventName 事件名称
         * @param {Object} callBack 回调函数
         */
        _addListener: function(eventName, callBack) {
            var me = this;
            me.fileuploaddiv.addListener(eventName, callBack);
        },
        /**
         * 删除注册监听事件
         * @param {String} eventName 事件名称
         */
        _removeListener: function(eventName) {
            var me = this;
            me.fileuploaddiv.removeListener(eventName);
        },
        /**
         * @description 设置组件只读
         * @param {Boolean} editable: true/false
         */
        setEditable: function(editable) {
            var me = this;
            if (!me.fileuploaddiv) {
                return;
            }
            me.fileuploaddiv.setEditable(editable);
        },
        /**
         * @private
         * @description 获取文件字节大小
         */
        getFileSize: function() {
            var me = this,
                    filesize = 0;
            if (!me.fileuploaddiv) {
                return filesize;
            }
            filesize = me.fileuploaddiv.getFileSize();
            return filesize;
        }
    });

    /**
     * @description 文件上传组件
     * @class
     * @extends jquery.ui.widget.js
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * jquery.sweet.widget.form.input.js
     * jquery.sweet.widget.form.button.js
     * jquery.sweet.cmp.js
     * </pre>
     * @example
     * 创建文件上传组件：
     */
    Sweet.cmp.FileUpload = $.sweet.widgetCmpFileUpload;
}(jQuery));

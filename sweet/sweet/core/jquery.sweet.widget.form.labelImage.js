/**
 * @fileOverview  
 * <pre>
 * LabelImage组件
 * 2013/4/12
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($, undefined) {

    // label标签默认样式
    var defaultWidgetClass = "sweet-form-label",
            imageClass = "sweet-form-label-pic",
            imgObj = {},
            disableObj = {},
            titleObj = {},
            alignObj = {},
            alarmObj = {},
            operType = Sweet.constants.operType,
            alignType = Sweet.constants.align,
            textSpanClass = "sweet-form-label-textSpan";
	
    disableObj[operType.PLUS] = "sweet-form-label-plus-gray";
    disableObj[operType.MINUS] = "sweet-form-label-minus-gray";
    disableObj[operType.SETTING] = "sweet-form-label-setting-gray";
    disableObj[operType.DELETE] = "sweet-form-label-delete-gray";
	imgObj[operType.SETTING_STYLE1] = "sweet-form-label-setting-style1";
    imgObj[operType.PLUS] = "sweet-form-label-pic-plus";
    imgObj[operType.MINUS] = "sweet-form-label-pic-minus";
    imgObj[operType.SETTING] = "sweet-form-label-pic-setting";
    imgObj[operType.DELETE] = "sweet-form-label-pic-delete";
    imgObj[operType.IMPORT] = "sweet-form-label-pic-import";
    imgObj[operType.SAVEAS] = "sweet-form-label-pic-save";
    imgObj[operType.CRITICAL] = "sweet-form-label-pic-critical";
    imgObj[operType.MAJOR] = "sweet-form-label-pic-major";
    imgObj[operType.MINOR] = "sweet-form-label-pic-minor";
    imgObj[operType.WARNING] = "sweet-form-label-pic-warning";
    imgObj[operType.WARNING_R] = "sweet-form-label-pic-warning-r";
    imgObj[operType.CRITICAL_R] = "sweet-form-label-pic-critical-r";
    imgObj[operType.CUSTOM_1] = "sweet-form-label-pic-custom_1";
    imgObj[operType.CUSTOM_2] = "sweet-form-label-pic-custom_2";
    imgObj[operType.CUSTOM_3] = "sweet-form-label-pic-custom_3";
    imgObj[operType.CUSTOM_4] = "sweet-form-label-pic-custom_4";
    imgObj[operType.CUSTOM_5] = "sweet-form-label-pic-custom_5";
    imgObj[operType.CUSTOM_6] = "sweet-form-label-pic-custom_6";
    imgObj[operType.CUSTOM_7] = "sweet-form-label-pic-custom_7";
    imgObj[operType.FOLDER] = "sweet-form-label-pic-folder";
    imgObj[operType.CATEGORY] = "sweet-form-label-pic-category";
    imgObj[operType.VIEW] = "sweet-form-label-pic-view";
    imgObj[operType.FAVORITE_ADD] = "sweet-form-label-pic-favorite-add";
    imgObj[operType.FAVORITE_REMOVE] = "sweet-form-label-pic-favorite-remove";
    imgObj[operType.LAYOUT] = "sweet-form-label-pic-layout";
    imgObj[operType.DASHBOARD] = "sweet-form-label-pic-dashboard";
    imgObj[operType.DASHBOARD_SETTING] = "sweet-form-label-pic-dashboard-setting";
    imgObj[operType.EDIT] = "sweet-form-label-pic-edit";
    imgObj[operType.ENTER_FULLSCREEN] = "sweet-form-label-pic-enter-fullscreen";
    imgObj[operType.EXIT_FULLSCREEN] = "sweet-form-label-pic-exit-fullscreen";
    imgObj[operType.LOCK] = "sweet-form-label-pic-lock";
    imgObj[operType.UNLOCK] = "sweet-form-label-pic-unlock";
    imgObj[operType.EXPORT] = "sweet-form-label-pic-export";
	imgObj[operType.PRINT] = "sweet-form-label-pic-print";
    imgObj[operType.ADD] = "sweet-form-label-pic-add";
    imgObj[operType.RESET] = "sweet-form-label-pic-reset";
    imgObj[operType.ADDNODE] = "sweet-form-label-pic-addnode";
    imgObj[operType.ADDCHILDREN] = "sweet-form-label-pic-addchildren";
    titleObj[operType.PLUS] = Sweet.core.i18n.labelImage.plus;
    titleObj[operType.ADD] = Sweet.core.i18n.labelImage.add;
    titleObj[operType.RESET] = Sweet.core.i18n.labelImage.reset;
    titleObj[operType.MINUS] = Sweet.core.i18n.labelImage.minus;
    titleObj[operType.SETTING] = Sweet.core.i18n.labelImage.setting;
    titleObj[operType.DELETE] = Sweet.core.i18n.labelImage.delete;
    titleObj[operType.IMPORT] = Sweet.core.i18n.labelImage.import;
    titleObj[operType.SAVEAS] = Sweet.core.i18n.labelImage.save;
    titleObj[operType.LOCK] = Sweet.core.i18n.labelImage.lock;
    titleObj[operType.UNLOCK] = Sweet.core.i18n.labelImage.unlock;
    titleObj[operType.EXPORT] = Sweet.core.i18n.labelImage.export;
	titleObj[operType.PRINT] = Sweet.core.i18n.labelImage.print;


    alignObj[alignType.RIGHT] = "sweet-form-label-right";
    alignObj[alignType.CENTER] = "sweet-form-label-center";

    alarmObj[operType.CRITICAL] = true;
    alarmObj[operType.MAJOR] = true;
    alarmObj[operType.MINOR] = true;
    alarmObj[operType.WARNING] = true;
    alarmObj[operType.WARNING_R] = true;
    alarmObj[operType.CRITICAL_R] = true;
    alarmObj[operType.CUSTOM_1] = true;
    alarmObj[operType.CUSTOM_2] = true;
    alarmObj[operType.CUSTOM_3] = true;
    alarmObj[operType.CUSTOM_4] = true;
    alarmObj[operType.CUSTOM_5] = true;
    alarmObj[operType.CUSTOM_6] = true;
    alarmObj[operType.CUSTOM_7] = true;
    alarmObj[operType.FOLDER] = true;
    alarmObj[operType.CATEGORY] = true;
    alarmObj[operType.VIEW] = true;
    alarmObj[operType.FAVORITE_ADD] = true;
    alarmObj[operType.FAVORITE_REMOVE] = true;
    alarmObj[operType.LAYOUT] = true;
    alarmObj[operType.DASHBOARD] = true;
    alarmObj[operType.DASHBOARD_SETTING] = true;
    alarmObj[operType.EDIT] = true;
    alarmObj[operType.ENTER_FULLSCREEN] = true;
    alarmObj[operType.EXIT_FULLSCREEN] = true;

    $.widget("sweet.widgetFormLabelImage", $.sweet.widgetForm, /** @lends Sweet.form.LabelImage.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-label-image]",
        defaultElement: "<label>",
        eventNames: /** @lends Sweet.form.LabelItem.prototype*/{
            /**
             * @event
             * @description 删除事件,参数为两个(event, data)
             */
            click: "单击事件"
        },
        // form组件公共配置参数
        options: /** @lends Sweet.form.LabelImage.prototype*/{
            /**
             * @description 组件宽度
             * @type {String/Number}
             * @default 19px
             */
            width: 19,
            /**
             * @description 组件高度
             * @type {String/Number}
             * @default 25px
             */
            height: 25,
            /**
             * @description 组件内容对齐方式,三种值：Sweet.constants.align.LEFT,Sweet.constants.align.RIGHT,Sweet.constants.align.CENTER
             * @type {String}
             * @default 左对齐
             */
            align: Sweet.constants.align.LEFT,
            /**
             * @description 图片类型,目前共有35种："delete","save","plus","minus","setting","import","export","print"
             * "critical","major","minor","warning","warning_r","critical_r","custom_1","custom_2","custom_3","custom_4",
             * "custom_5","custom_6","custom_7","folder","category","view","favorite_add","favorite_remove","layout",
             * "dashboard","dashboard_setting","edit","enter_fullscreen","exit_fullscreen","lock","unlock","add","reset","setting_style_1"
             * @type {String}
             * @default null
             */
            imageType: null,
            /**
             * @description 图片信息提示
             * @type {String}
             * @default null
             */
            imageTip: null,
            /**
             * @description 组件值，只适用于29种图标类型，适用的imageType如下：
             * "critical","major","minor","warning","warning_r","critical_r","custom_1","custom_2","custom_3","custom_4",
             * "custom_5","custom_6","custom_7","folder","category","view","favorite_add","favorite_remove","layout",
             * "dashboard","dashboard_setting","edit","enter_fullscreen","exit_fullscreen","lock","unlock","export",
             * "add","reset"
             * @type {String/Number}
             * @default {text:"", value:"",data: null}
             */
            value: {text: "", value: "", data: null},
            /**
             * @description 设置支持显示文本的labelImage的背景颜色值
             * @type {Object} 
             * @default null
             */
            imageBgColor: {bgColor: ""}

        },
        /**
         * @private
         * @description 设置组件值
         * @param {Object} obj 组件值
         */
        _setValue: function(obj) {
            var me = this,
                    options = me.options,
                    imageType = options.imageType,
                    isAlarm = alarmObj[imageType];

            me.formElement.data("data", obj);
            // 告警
            if (isAlarm) {
                me.textSpanEl.html(obj.text);
            }
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 返回值
         */
        _getValue: function() {
            return this.formElement.data("data");
        },
        /**
         * @private
         * @description 设置组件
         * @param {Object} obj 组件值
         */
        setBgColor: function(data) {
            var me = this,
                    options = me.options,
                    imageType = options.imageType;
            var supLabelType = ["critical","major","minor","warning","custom_1","custom_2","custom_3","custom_4",
                "custom_5","custom_6","custom_7"];
            for (var i = 0; i < supLabelType.length; i++){
                var className = "." + "sweet-form-label-pic-" + imageType;
                if (imageType === supLabelType[i]){
                   var bgColor = "none repeat scroll 0 0 " + data.bgColor;
                   $(className).css('background',bgColor);
                }else{
                    continue;
                }
            }
        },
        /**
         * @private
         * @description 实现form组件接口
         */
        _createFormWidget: function() {
            var me = this,
                    options = me.options,
                    imageType = options.imageType,
                    img = imgObj[imageType] || "",
                    title = titleObj[imageType] || "",
                    imageTip = options.imageTip || title,
                    align = options.align,
                    alignClass = alignObj[align],
                    isAlarm = alarmObj[imageType],
                    value = options.value || {},
                    text = value.text,
                    formParentEl = me.formParentEl = $("<div>").addClass(defaultWidgetClass + " " + alignClass)
                    .appendTo(me.formEl);
            me.formElement = $("<span>").addClass(imageClass + " " + img)
                    .attr("title", imageTip)
                    .data("data", value)
                    .bind("click", {"me": me}, me._onClick)
                    .appendTo(formParentEl);
            
            if($.isNotNull(options.vID)){
                me.formElement.attr("id", options.vID);
            }
            if (isAlarm) {
                me.textSpanEl = $("<span>").addClass(textSpanClass)
                        .html(text)
                        .appendTo(formParentEl);
            }
        },
        /**
         * @private
         * @param {Object} event
         * @description 元素单击事件
         */
        _onClick: function(event) {
            var me = event.data.me;
            if (me.options.disabled) {
                return;
            }
            var val = me._getValue();
            me._trigger("click", event, val);
            me._triggerHandler(event, "click", val);
        },
        /**
         * @private
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled true禁用 false可用
         */
        _setDisabled: function(disabled) {
            var me = this;
            if ("boolean" !== $.type(disabled)) {
                me._error("_setDisabled() Unsupport parameter disabled. Not true or false. disabled=" + disabled);
                return;
            }
            var formerImageEl = me.formElement,
                    imageType = me.options.imageType,
                    img = imgObj[imageType] || "",
                    disabledImg = disableObj[imageType] || "",
                    isAlarm = alarmObj[imageType];
            if (!isAlarm) {
                if (disabled) {
                    formerImageEl.removeClass(img)
                            .addClass(disabledImg);
                    me.options.disabled = true;
                } else {
                    formerImageEl.removeClass(disabledImg)
                            .addClass(img);
                    me.options.disabled = false;
                }
            }
        },
        /**
         * @private
         * @description 销毁form组件
         */
        _destroyWidget: function() {
            var me = this;
            me.formElement.unbind("click");
            //销毁tip提示
            me.formElement.trigger("mouseout");
        }
    });
    /**
     * LabelImage组件
     * @name Sweet.form.LabelImage
     * @class 
     * @extends Sweet.form
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example 
     * <pre>
     * sweetLabelImage = new Sweet.form.LabelImage({
     *           imageType: "plus",
     *           imageTip : "增加",
     *           width: 100,
     *           renderTo: "sweet-labelImage"
     *       });
     * sweetLabelImage2.addListener("click", function() {
     *  alert("click happend!!!");
     * });
     * </pre>
     */
    Sweet.form.LabelImage = $.sweet.widgetFormLabelImage;

}(jQuery));

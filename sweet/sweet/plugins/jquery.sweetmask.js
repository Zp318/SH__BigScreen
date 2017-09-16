/**
 * @fileOverview 背景遮罩
 * @description 遮罩类，是jquery的插件， 使用时请按照jquery插件的方式使用
 * @date 2013/1/28
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 */

/**
 * 遮罩类，是jquery的插件
 * @name jquery.sweetMask
 * @class 
 * @extends 
 * <pre>
 * jquery-1.9.1.min.js
 * </pre>
 * @example
 * <pre>
 * $("#testdivid").sweetMask({
 *          propagation: false,   
 *          maskAll: false,        
 *          loading: true,          
 *          msg : "Loading..."  
 * })
 * 现在支持此四个参数，默认值如下 ：
 *          propagation: false,     // 是否阻止事件冒泡
 *          maskAll: false,         // 遮住当前文档
 *          loading: false,          // 是否显示loading，默认false
 *          msg : Sweet.core.i18n.mask.loading  //出遮罩时显示的提示信息，默认为"loading"
 * </pre>
 */
(function($) {
    var dataMaskCacheName = "sweetMask",
            dataMaskLoadingCacheName = "sweetMaskLoading",
            dataMaskTimerName = "sweetMaskRecordTime",
            dataOptionsCacheName = "options",
            maskClass = "sweet-mask",
            maskAllClass = "sweet-mask-all",
            maskedClass = "sweet-mask-masked",
            maskedRelativeClass = "sweet-mask-relative",
            maskedLoadingClass = "sweet-mask-loading",
            maskedLoadingMsgClass = "sweet-mask-loading-msg",
            maskedLoadingPicClass = "sweet-mask-loading-pic";

    /**
     * 增加遮罩
     * @param {Object} options 遮罩描述参数
     */
    $.fn.sweetMask = function(options) {
        var defaults = {
            propagation: false,     // 是否阻止事件冒泡
            maskAll: false,         // 遮住当前文档
            loading: false,          // 是否显示loading，默认false
            msg : Sweet.core.i18n.mask.loading  //出遮罩时显示的提示信息，默认为"loading"
        },
        opacity = 0.5,      // 淡入效果最终的透明度
        opts = $.extend({}, defaults, options),
                zIndex,
                loadingZIndex,
                ele = $(this),
                maskEl,
                loadingEl,
                loadingParentEl,
                loadingParentAppend,
                WH = {};
        if ($(this).hasClass(maskedClass)) {
            return;
        }

        zIndex = $.getMaxZIndex();
        loadingZIndex = zIndex + 1;
        maskEl = $("<div>").addClass(maskClass).css({"z-index": zIndex}).attr("tabindex","-1");
        ele.addClass(maskedClass)
                .data(dataMaskCacheName, maskEl)
                .data(dataOptionsCacheName, opts);

        // 淡入效果。duration同时用于unMask的淡出效果
        if (opts.duration) {
            maskEl.css("opacity", 0);
            maskEl.animate({
                "opacity": opacity
            }, opts.duration);
        }

        // 是否全局遮罩判断
        if (opts.maskAll) {
            loadingParentEl = $(document);
            loadingParentAppend = document.body;
            maskEl.addClass(maskAllClass).appendTo(document.body);
            // -----修改问题单DTS2013062405843-start
            // -----遮罩在某些分辨率下高度不够.
            //问题单：DTS2013122403809 
            //出滚动体的情况下，遮罩高度不够
            var winWidth = $(document).width();
            var winHeight = $(document).height();
            maskEl.width(winWidth).height(winHeight);
            // -----修改问题单DTS2013062405843-end
            // ------DTS2014070305004 start
            // ------DTS2014070305004 end
        } else {
            loadingParentAppend = loadingParentEl = ele;
            if ("static" === ele.css("position")) {
                ele.addClass(maskedRelativeClass);
            }
            maskEl.appendTo(ele);
        }

        // 是否需要组件事件冒泡
        if (opts.propagation) {
            maskEl.bind("click", function(e) {
                // 阻止事件冒泡
                e.stopImmediatePropagation();
            });
        }

        // 对loading的处理
        if (opts.loading) {
            loadingEl = $("<div>").css({"z-index": loadingZIndex})
                    .addClass(maskedLoadingClass).appendTo(loadingParentAppend);
            $("<div>").addClass(maskedLoadingMsgClass + " " + maskedLoadingPicClass)
                    .html(opts.msg).appendTo(loadingEl);
            ele.data(dataMaskLoadingCacheName, loadingEl);

            // sweetDebug在sweet-ui-all中声明的全局变量，只有在开启调试模式时才出现计数
            if (sweetDebug) {
                var loadingCounter = function () {
                    var child = loadingEl.children(),
                            text = child.html(),
                            begin = text.indexOf("("),
                            end = text.indexOf(")");
                    if (-1 !== begin) {
                        text = text.substr(0, begin + 1) +
                                ($.string.toNumber(text.substring(begin + 1, end - 1)) + 1) +
                                Sweet.core.i18n.mask.second + 
                                text.substr(end);
                    } else {
                        text += "&nbsp;&nbsp;(1" + Sweet.core.i18n.mask.second + ")";
                    }
                    child.html(text);
                };
                // 1秒刷新一次
                var interval = setInterval(loadingCounter, 1000);
                ele.data(dataMaskTimerName, interval);
            }
        }
        maskEl.focus();
    };

    /**
     * 删除遮罩
     */
    $.fn.unSweetMask = function() {
        var ele = $(this),
                opts = ele.data(dataOptionsCacheName),
                maskEl,
                loadingEl,
                interval;

        if(!opts){
            return;
        }
        // 找到maskEl
        if (opts.maskAll) {
            maskEl = ele.data(dataMaskCacheName);
        }
        else {
            maskEl = ele.find("." + maskClass).first();
        }

        // 如果不需要淡出效果，延迟为0
        var duration = opts.duration || 0;

        // 淡出效果统一处理
        maskEl.animate({
            "opacity": 0
        }, {
            duration: duration,
            complete: function () {
                // 删除遮罩
                maskEl.remove();

                // 如果是最后一个全局遮罩，恢复body的overflow属性
                var maskAllNum = $("." + maskAllClass).length;
                if (opts.maskAll && maskAllNum < 1) {
                    $(document.body).css("overflow", "auto");
                }

                // 是否有loading
                if (opts.loading) {
                    // 销毁定时器
                    if (sweetDebug) {
                        interval = ele.data(dataMaskTimerName);
                        clearInterval(interval);
                    }

                    loadingEl = ele.data(dataMaskLoadingCacheName);
                    loadingEl.remove();
                }

                ele.removeClass(maskedClass + " " + maskedRelativeClass)
                    .removeData(dataOptionsCacheName + " " +
                        dataMaskCacheName + " " +
                        dataMaskLoadingCacheName + " " +
                        dataMaskTimerName);
            }
        });
    };

    /**
     * 获取当前遮罩z-index值
     */
    $.fn.getSweetMaskZIndex = function() {
        return $(this).data(dataMaskCacheName).css("z-index");
    };
})(jQuery);
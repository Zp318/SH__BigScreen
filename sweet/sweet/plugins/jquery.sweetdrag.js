/**
 * @fileOverview
 * <pre>
 * 为jQuery扩展简单拖拽功能
 * 2013.2.18
 * http://www.huawei.com
 * Huawei Technologies Co., Ltd. Copyright 1988-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

/**
 * 为jQuery扩展简单拖拽功能
 * @name jquery.sweetdrag
 * @class 
 * @requires 
 * <pre>
 * jquery-1.9.1.min.js
 * </pre>
 * @example 
 * <pre>
 * //执行相应动作时的回调函数
 * var startFun = function(){};
 * var endFun = function(){};
 * var moveFun = function(){};
 * $("div").sweetDrag(startFun, endFun, moveFun);
 * </pre>
 */

/**
 * 启动拖拽功能
 * @param {Function} startFn 启动拖动时的回调函数
 * @param {Function} endFn 结束拖动时的回调函数
 * @param {Function} moveFn 拖动中的回调函数
 * @example
 * $("div").sweetDrag();
 */
jQuery.fn.sweetDrag = function (startFn, endFn, moveFn) {
    'use strict';

    var M = false;
    var Rx, Ry;
    var t = $(this);
    var offsetX = 0;
    var offsetY = 0;

    // 按下鼠标左键，开始拖动
    t.mousedown(function (event) {

        // 执行回调函数
        var ret = true;
        if ($.isFunction(startFn)) {
            ret = startFn(event);
        }

        // 如果回调函数返回false，取消拖动
        if (ret === false) {
            return;
        }

        Rx = event.pageX - (parseInt(t.css("left"), 10) || 0);
        Ry = event.pageY - (parseInt(t.css("top"), 10) || 0);
        M = true;

        // 如果回调函数返回null，取消默认操作
        if (ret !== null) {
            t.css("position", "absolute");
        }
    });

    // 释放鼠标，停止拖动
    function mouseUp (event) {
        M = false;
        t.css('cursor', 'default');

        if ($.isFunction(startFn)) {
            endFn(event);
        }
    }

    // 同时在当前对象和文档对象上监听鼠标释放事件，保证可以停止拖动
    t.mouseup(mouseUp);
    $(document).mouseup(mouseUp);

    // 在文档对象上监听鼠标移动事件，同时移动当前对象
    $(document).mousemove(function (event) {
        if (M) {
            event.preventDefault();

            offsetX = event.pageX - Rx;
            offsetY = event.pageY - Ry;

            // 如果回调函数返回false，禁止缺省处理
            if ($.isFunction(moveFn) && moveFn(event, offsetX, offsetY) === false) {
                return false;
            }

            t.css('cursor', 'move');
            t.css({top: offsetY, left: offsetX});

            return false;
        }
    });
};

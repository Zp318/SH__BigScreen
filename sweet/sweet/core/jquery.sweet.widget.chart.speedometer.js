/**
 * @fileOverview
 * <pre>
 * 示速器组件
 * 2013/2/18
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function ($, undefined) {
    'use strict';

    /* 函数最大行数限制修改为100 */
    /* jshint maxstatements:100 */

    // 常量
    var dataLabelColor = "#919191";
    var GOLD_RATIO = 0.86;      // 宽高比
    var THICK_RATIO = 0.33;     // 圆弧厚度占半径的比例
    var INDICATOR_COUNT = 10;   // 数据步长标志个数

    // SpeedoMeter控件
    var Meter = function (options) {
        var textureObj;

        // Raphael的Paper对象
        var R = null;
        var or = null;
        var ctx = null;

        // 保存动态创建的Raphael对象
        var allSet = null;
        var pointer = null;
        var txtValue = null;
        var valueRange = null;
        var txtLabel = null;
        var selectedIcon = null;
        var hoverInfoDiv = null;

        var meterData = null;
        var oldValue = null;
        var holderId = null;
        var config = {};

        var listeners = {};

        /**
         * @private
         * @description 根据阀值把弧形分段
         * @return {Array} 根据阀值分开的弧形信息
         */
        function getParts() {
            if (meterData === null) {
                return null;
            }

            var parts = [];
            var partInfo = {};

            // fill colors, should be configurable
            var fillInfo = [
                "#81BC7A:67-#9CE18F:75-#63D04E:85-#3ABD21", // green
                "#AB9558:67-#F6DA8D:75-#F1C44C:85-#E0A51E", // yellow
                "#D25751:67-#E68B8B:75-#D64242:85-#B32424"    // red
            ];
            if (config.flat) {
                fillInfo = [
                    "#51942B", // green
                    "#f5c245", // yellow
                    "#DA6263"    // red
                ];
            }

            // fix exception data
            if (meterData.start === meterData.end) {
                meterData.end = meterData.start + 10;
            }
            if (meterData.start < meterData.end) {
                if (meterData.threshold1 &&
                    (meterData.threshold1 < meterData.start || meterData.threshold1 > meterData.end)) {
                    meterData.threshold1 = null;
                }
                if (meterData.threshold2 &&
                    (meterData.threshold2 < meterData.start || meterData.threshold2 > meterData.end)) {
                    meterData.threshold2 = null;
                }
            }
            else {
                if (meterData.threshold1 &&
                    (meterData.threshold1 < meterData.end || meterData.threshold1 > meterData.start)) {
                    meterData.threshold1 = null;
                }
                if (meterData.threshold2 &&
                    (meterData.threshold2 < meterData.end || meterData.threshold2 > meterData.start)) {
                    meterData.threshold2 = null;
                }
            }

            // no threshold
            if (!meterData.threshold1 && !meterData.threshold2) {
                partInfo.fill = fillInfo[0];
                partInfo.start = meterData.start;
                partInfo.end = meterData.end;
                parts.push(partInfo);
            }
            // two threshold
            else if (meterData.threshold1 && meterData.threshold2) {
                // confirm fill color
                if (meterData.rule === "good") {
                    fillInfo.reverse();
                }

                // first
                partInfo.fill = fillInfo[0];
                partInfo.start = meterData.start;
                partInfo.end = meterData.threshold1;
                parts.push(partInfo);

                // second
                partInfo = {};
                partInfo.fill = fillInfo[1];
                partInfo.start = meterData.threshold1;
                partInfo.end = meterData.threshold2;
                parts.push(partInfo);

                // third
                partInfo = {};
                partInfo.fill = fillInfo[2];
                partInfo.start = meterData.threshold2;
                partInfo.end = meterData.end;
                parts.push(partInfo);
            }
            // one threshold
            else {
                // confirm fill color
                if (meterData.rule === "good") {
                    fillInfo.reverse();
                }

                // first
                partInfo.fill = fillInfo[0];
                partInfo.start = meterData.start;
                partInfo.end = meterData.threshold1 || meterData.threshold2;
                parts.push(partInfo);

                // second
                partInfo = {};
                partInfo.fill = fillInfo[2];
                partInfo.start = (meterData.threshold1 || meterData.threshold2);
                partInfo.end = meterData.end;
                parts.push(partInfo);
            }

            return parts;
        }

        /**
         * @private
         * @description 得到当前值应该以什么颜色显示
         * @param {Number} value 当前值
         * @return {String} 颜色值
         */
        function getValueColor(value) {
            var color;
            if (config.flat) {
                color = ["#51942B", "#f5c245", "#DA6263"];
            }
            else {
                color = ["#3ABD21", "#E0A51E", "#B32424"];
            }

            if (value === null || meterData === null) {
                return color[0];
            }

            // no threshold
            if (!meterData.threshold1 && !meterData.threshold2) {
                return color[0];
            }
            // two threshold
            else if (meterData.threshold1 && meterData.threshold2) {
                // confirm fill color
                if (meterData.rule === "good") {
                    color.reverse();
                }

                if (value >= meterData.start && value < meterData.threshold1) {
                    return color[0];
                }

                if (value >= meterData.threshold1 && value < meterData.threshold2) {
                    return color[1];
                }

                return color[2];
            }
            // one threshold
            else {
                // confirm fill color
                if (meterData.rule === "good") {
                    color.reverse();
                }

                var thresh = meterData.threshold1 || meterData.threshold2;

                if (value >= meterData.start && value < thresh) {
                    return color[0];
                }
                else {
                    return color[2];
                }
            }
        }

        /**
         * @private
         * @description canvas画圆角矩形
         */
        function roundRect (x, y, w, h, r) {
            if (!ctx) {
                return;
            }
            if (w < 2 * r) {
                r = w / 2;
            }
            if (h < 2 * r) {
                r = h / 2;
            }

            ctx.beginPath();
            if ($.isIE()) {
                ctx.rect(x, y, w, h);
            }
            else {
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h - r, r);
                ctx.arcTo(x + w, y + h, x + r, y + h, r);
                ctx.arcTo(x, y + h, x, y + r, r);
                ctx.arcTo(x, y, x + r, y, r);
            }
            ctx.closePath();
        }

        /**
         * @private
         * @description 角度转弧度
         */
        function toRad(angle) {
            return angle * Math.PI / 180;
        }

        /**
         * 把数字格式化成xx.yyK/xx.yy.M等形式
         * @param value
         */
        function toKMG(value) {
            var n, s;
            var K = 1000,
                M = K * 1000,
                B = M * 1000;

            // 转成Number
            if ($.type(value) !== "number") {
                s = value.toString();
                n = parseFloat(s);
                if (isNaN(n)) {
                    return s;
                }
            }
            else {
                n = value;
            }

            // 转成缩写
            s = "";
            if (n >= B) {
                n = Math.round(n * 10 / B) / 10;
                s = n + "b";
            }
            else if (n >= M) {
                n = Math.round(n * 10 / M) / 10;
                s = n + "m";
            }
            else if (n >= K) {
                n = Math.round(n * 10 / K) / 10;
                s = n + "k";
            }
            else {
                s = n + "";
            }

            return s;
        }

        /**
         * 绘制表盘
         * @param {Object} parts 阀值信息
         * @private
         */
        function _drawPartShapes (parts) {
            var cx = config.cx;
            var cy = config.cy;
            var r = config.r;
            var r2 = r - config.thick;
            var angle1, angle2, rad1, rad2;
            var x1, y1, x2, y2, x3, y3, x4, y4;
            var i = 0, j = 0;
            var fill, path, part, elem;
            var fillList, stop;

            // render parts, max to 3
            for (i = 0; i < parts.length; i++) {
                part = parts[i];

                angle1 = (i === 0 ? 180 : angle2);
                angle2 = 180 * (1.0 - (part.end - meterData.start) / (meterData.end - meterData.start));
                rad1 = toRad(angle1);
                rad2 = toRad(angle2);

                // calculate 4 vertex
                x1 = cx + Math.cos(rad1) * r;
                y1 = cy - Math.sin(rad1) * r;
                x2 = cx + Math.cos(rad2) * r;
                y2 = cy - Math.sin(rad2) * r;
                x3 = cx + Math.cos(rad2) * r2;
                y3 = cy - Math.sin(rad2) * r2;
                x4 = cx + Math.cos(rad1) * r2;
                y4 = cy - Math.sin(rad1) * r2;

                if (config.engine === "svg") {
                    if (config.flat) {
                        fill = part.fill;
                    }
                    else {
                        fill = "r(" + cx + "," + cy + "," + cx + "," + cy + "," + r + ")" + part.fill;
                    }
                    path = ["M", x1, y1, "A", r, r, 0, 0, 1, x2, y2, "L", x3, y3, "A", r2, r2, 0, 0, 0, x4, y4, "Z"];
                    elem = R.path(path).attr({stroke: "none", fill: fill});
                }
                else if (config.engine === "canvas") {
                    ctx.save();

                    // convert to canvas perspect
                    rad1 = Math.PI * 2 - rad1;
                    rad2 = Math.PI * 2 - rad2;

                    // draw arc
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.arc(cx, cy, r, rad1, rad2, false);
                    ctx.lineTo(x3, y3);
                    ctx.arc(cx, cy, r2, rad2, rad1, true);
                    ctx.closePath();

                    // create radial fill
                    fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                    fillList = part.fill.split("-");
                    for (j = 0; j < fillList.length; j++) {
                        stop = fillList[j];
                        if (stop.indexOf(':') > 0) {
                            fill.addColorStop(stop.split(":")[1] / 100, stop.split(":")[0]);
                        }
                        else {
                            if (j === 0) {
                                fill.addColorStop(0, stop);
                            }
                            else {
                                fill.addColorStop(1, stop);
                            }
                        }
                    }

                    // fill
                    ctx.fillStyle = fill;
                    ctx.fill();

                    ctx.restore();
                }
            }
        }

        /**
         * 绘制表盘的边框，并填充材质
         * @private
         */
        function _drawPartTexture () {
            var cx = config.cx;
            var cy = config.cy;
            var r = config.r;
            var thick = config.thick;
            var r2 = r - thick;
            var elem = null;
            var x1, y1, x2, y2;
            var path = "";
            var pattern;

            if (config.showTexture === false) {
                return;
            }

            // draw outer edge to fill texture
            x1 = cx - r;
            y1 = cy;
            x2 = cx + r;
            y2 = cy;

            if (config.engine === "svg") {
                path = ["M", x1, y1, "A", r, r, 0, 0, 1, x2, y2];
                path += ["L", x2 - thick, y2, "A", r2, r2, 0, 0, 0, x1 + thick, y2];
                path += ["z"];
                elem = R.path(path).attr({
                    "stroke-width": 1.5,
                    "stroke-opacity": 0.2,
                    "fill-opacity": 0.8,
                    "fill": config.texture
                });
            }
            else if (config.engine === "canvas" && textureObj._complete === true) {
                ctx.save();

                ctx.beginPath();
                ctx.moveTo(cx - r, cy);
                ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, false);
                ctx.lineTo(cx + r - thick, cy);
                ctx.arc(cx, cy, r - thick, Math.PI * 2, Math.PI, true);
                ctx.closePath();

                pattern = ctx.createPattern(textureObj, "repeat");
                ctx.fillStyle = pattern;
                ctx.globalAlpha = 0.7;
                ctx.fill();

                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
                ctx.stroke();

                ctx.restore();
            }
        }

        /**
         * 绘制表盘在下方的倒影
         * @private
         */
        function _drawPartReflection () {
            var cx = config.cx;
            var cy = config.cy;
            var r = config.r;
            var thick = config.thick;
            var elem = null;
            var r2 = r - thick;
            var x1, y1, x2, y2;
            var fill = "";
            var path = "";

            // 计算内侧两个顶点
            x1 = cx - r;
            y1 = cy + 2;
            x2 = cx + r;
            y2 = cy + 2;

            // 绘制。填充由上到下颜色变浅
            if (config.engine === "svg") {
                path = ["M", x1, y2, "A", r, r, 0, 0, 0, x2, y2];
                path += ["L", x2 - thick, y2, "A", r2, r2, 0, 0, 1, x1 + thick, y2];
                path += ["z"];
                elem = R.path(path).attr({"stroke-width": 0, opacity: 0.1, fill: "270-#D3D3D3-#FFFFFF:90"});
            }
            else if (config.engine === "canvas") {
                ctx.save();

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.arc(cx, cy + 2, r, Math.PI, 0, true);
                ctx.lineTo(x2 - thick, y2);
                ctx.arc(cx, cy + 2, r - thick, 0, Math.PI, false);
                ctx.closePath();

                fill = ctx.createLinearGradient(x1, y1, x1, y1 + r);
                fill.addColorStop(0, "#D3D3D3");
                fill.addColorStop(0.8, "rgba(245, 245, 245, 0)");
                ctx.fillStyle = fill;
                ctx.fill();

                ctx.restore();
            }
        }

        /**
         * 绘制表盘上的刻度线
         * @private
         */
        function _drawPartIndicators () {
            var cx = config.cx;
            var cy = config.cy;
            var r = config.r;
            var thick = config.thick;
            var r2 = r - thick;
            var elem = null;
            var rad;
            var x1, y1, x2, y2;
            var span = 3.6;
            var path = "";
            var i = 0;

            // draw indicators
            span = 180 / INDICATOR_COUNT;
            for (i = 1; i < INDICATOR_COUNT; i++) {
                rad = toRad(180 - span * i);

                // 主刻度要长一些
                if (i % 2 === 0) {
                    r2 = r - thick * 0.35;
                }
                else {
                    r2 = r - thick * 0.25;
                }

                // 计算刻度线两个顶点的位置
                x1 = cx + Math.cos(rad) * (r - 1);
                y1 = cy - Math.sin(rad) * (r - 1);
                x2 = cx + Math.cos(rad) * r2;
                y2 = cy - Math.sin(rad) * r2;

                if (config.engine === "svg") {
                    path = ["M", x1, y1, "L", x2, y2];
                    elem = R.path(path).attr({"stroke-width": 2, stroke: "white", "stroke-opacity": 0.6});
                }
                else if (config.engine === "canvas") {
                    ctx.save();

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
                    ctx.stroke();

                    ctx.restore();
                }
            }
        }

        /**
         * 在表盘外侧，显示起始值和阀值文本标签
         * @private
         */
        function _drawPartLabels () {
            var cx = config.cx;
            var cy = config.cy;
            var r = config.r;
            var elem = null;
            var angle1, rad;
            var x1, y1;
            var span = 3.6;
            var i = 0;
            var label;

            if (!config.showRange) {
                return;
            }

            var dataLabelAttr = {"font-size": Math.floor(12 * config.zoom), "fill": dataLabelColor};

            // start value
            x1 = cx - r - Math.floor(15 * config.zoom);
            y1 = cy;
            label = toKMG(meterData.start);
            if (config.engine === "svg") {
                R.text(x1, y1, label).attr(dataLabelAttr);
            }
            else if (config.engine === "canvas") {
                // canvas可以设置右对齐
                x1 = cx - r - 2;
                ctx.save();

                ctx.textBaseline = "alphabetic";
                ctx.textAlign = "right";
                ctx.font = dataLabelAttr["font-size"] + "px" + " Arial";
                ctx.fillStyle = dataLabelColor;
                ctx.fillText(label, x1, y1);
            }

            // threshold
            var th = [meterData.threshold1, meterData.threshold2];
            for (i in th) {
                if (th[i]) {
                    angle1 = 180 * (1.0 - (th[i] - meterData.start) / (meterData.end - meterData.start));
                    angle1 = Math.round(angle1 / span) * span;
                    rad = toRad(angle1);
                    label = toKMG(th[i]);

                    if (config.engine === "svg") {
                        x1 = cx + Math.cos(rad) * (r + Math.ceil(12 * config.zoom));
                        y1 = cy - Math.sin(rad) * (r + Math.ceil(12 * config.zoom));
                        elem = R.text(x1, y1, label).attr(dataLabelAttr);
                    }
                    else if (config.engine === "canvas") {
                        x1 = cx + Math.cos(rad) * (r + Math.ceil(2 * config.zoom));
                        y1 = cy - Math.sin(rad) * (r + Math.ceil(2 * config.zoom));

                        if (angle1 <= 90) {
                            ctx.textAlign = "left";
                        }
                        else {
                            ctx.textAlign = "right";
                        }

                        ctx.fillText(label, x1, y1);
                    }
                }
            }

            // end value
            label = toKMG(meterData.end);
            if (config.engine === "svg") {
                x1 = cx + r + Math.ceil(15 * config.zoom);
                y1 = cy;
                R.text(x1, y1, label).attr(dataLabelAttr);
            }
            else if (config.engine === "canvas") {
                x1 = cx + r + 2;
                y1 = cy;

                ctx.textAlign = "left";
                ctx.fillText(label, x1, y1);
                ctx.restore();
            }
        }

        /**
         * @private
         * @description 根据阀值信息，绘制半圆区域
         */
        function drawPart() {
            var parts = getParts();
            if (parts === null || parts.length === 0) {
                return;
            }

            // render parts, max to 3
            _drawPartShapes(parts);

            // draw outer edge to fill texture
            _drawPartTexture();

            // draw bottom reflection
            _drawPartReflection();

            // draw indicators
            _drawPartIndicators();

            // draw data label
            _drawPartLabels();

            return;
        }

        /**
         * @private
         * @description 绘制指针，指向180度方向
         */
        function drawPointer(angle) {
            var cx = config.cx;
            var cy = config.cy;
            var r = (config.r - config.thick) * 0.8;
            var x1, y1, x2, y2, x3, y3, x4, y4;
            var path;
            var r2 = r * 0.18;
            var r3 = r * 0.1;
            var rad;
            var elem1;
            var fill;

            if (config.engine === "svg") {
                // get vertex
                x1 = cx - r;
                y1 = cy;
                x2 = cx;
                y2 = cy - r2;
                x3 = cx;
                y3 = cy + r2;
                x4 = cx + r2;
                y4 = cy;

                path = ["M", x1, y1, "L", x2, y2, "A", r2, r2, 0, 1, 1, x3, y3, "z"];
                if (config.flat) {
                    fill = "#5A6470";
                }
                else {
                    fill = "70-#1C242E-#718096:70-#1C242E";
                }
                elem1 = R.path(path).attr({"stroke-width": 0, fill: fill});
                R.circle(cx, cy, r3).attr({stroke: "none", fill: "#F1F2F3"});
                pointer = elem1;
            }
            else if (config.engine === "canvas") {
                if ($.type(angle) === 'undefined') {
                    return;
                }
                else {
                    rad = toRad(angle);
                }

                ctx.save();

                x1 = cx + Math.cos(rad) * r;
                y1 = cy - Math.sin(rad) * r;
                x2 = cx + Math.cos(rad - Math.PI / 2) * r2;
                y2 = cy - Math.sin(rad - Math.PI / 2) * r2;
                x3 = cx + Math.cos(rad + Math.PI / 2) * r2;
                y3 = cy - Math.sin(rad + Math.PI / 2) * r2;

                if (config.flat) {
                    fill = "#5A6470";
                }
                else {
                    fill = ctx.createLinearGradient(x2, y2, x3, y3);
                    fill.addColorStop(0, "#1C242E");
                    fill.addColorStop(0.7, "#718096");
                    fill.addColorStop(1, "#1C242E");
                }

                rad = Math.PI * 2 - rad;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.arc(cx, cy, r2, rad - Math.PI / 2, rad + Math.PI / 2, true);
                ctx.closePath();

                ctx.fillStyle = fill;
                ctx.fill();

                // button
                ctx.beginPath();
                ctx.arc(cx, cy, r3, 0, Math.PI * 2, false);
                ctx.fillStyle = "#F1F2F3";
                ctx.fill();

                ctx.restore();
            }

            return;
        }

        /**
         * @private
         * @description 绘制文本（当前值和指标名称）
         */
        function drawText() {
            var x1, y1, w;
            var fontSize = 10;
            var elem;
            var metrics;
            var msg, value, end, unit;
            var metric1, metric2;
            var font1, font2;

            value = $.isNull(meterData.value) ? "--" : meterData.value;
            end = $.isNull(meterData.end) ? "--" : meterData.end;
            unit = $.isNull(meterData.unit) || $.isNull(meterData.value) ? "" : meterData.unit;

            // value
            x1 = config.cx;
            y1 = config.cy + (config.r - config.thick) / 2;

            fontSize += Math.floor(config.r / 10) * 3;
            fontSize = fontSize < 16 ? 16 : (fontSize > 40 ? 40 : fontSize);
            fontSize = Math.floor(fontSize * config.zoom);

            if (config.engine === "svg") {
                elem = R.text(x1, y1, value + unit);
                elem.attr({"font-family": "Arial", "font-size": fontSize, "font-weight": "normal"});
                txtValue = elem;
            }
            else if (config.engine === "canvas") {
                ctx.save();

                font1 = "" + fontSize + "px" + " Arial,微软雅黑";
                font2 = "normal " + Math.round(fontSize * 0.6) + "px" + " Arial,微软雅黑";

                ctx.font = font1;
                metric1 = ctx.measureText(value + "");

                ctx.font = font2;
                metric2 = ctx.measureText(unit);

                ctx.fillStyle = getValueColor(meterData.value);
                ctx.textBaseline = "alphabetic";

                ctx.font = font1;
                ctx.textAlign = "left";
                ctx.fillText(value + "", x1 - (metric1.width + metric2.width) / 2, y1 + fontSize / 2);

                ctx.font = font2;
                ctx.textAlign = "right";
                ctx.fillText(unit, x1 + (metric1.width + metric2.width) / 2 + 2, y1 + fontSize / 2);
            }

            // value range
            fontSize = 12;
            if (config.showValueMax) {
                y1 = config.cy + config.r - config.thick;

                if (config.engine === "svg") {
                    elem = null;
                    elem = R.text(x1, y1, "(" + value + "/" + end + ")");
                    elem.attr({"font-family": "sans-serif", "font-size": fontSize, "fill": "#394449"});
                    valueRange = elem;
                }
                else if (config.engine === "canvas") {
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.font = fontSize + "px" + " sans-serif";
                    ctx.fillStyle = "#394449";
                    msg = "(" + value + "/" + end + ")";
                    metrics = ctx.measureText(msg);
                    ctx.fillText(msg, x1, y1);
                }

                y1 = config.cy + config.r + 8;
            }
            else {
                y1 = config.cy + config.r - 5;
            }

            // SVG绘制指标名
            function svgLabel (text) {
                var elem = R.text(x1, y1, text);
                elem.attr({"font-family": "Arial", "font-size": fontSize, "fill": "#394449"});
                return elem;
            }

            fontSize = 12;
            if (config.engine === "svg") {
                msg = meterData.name;
                elem = svgLabel(msg);
                w = config.width - 10;
                if (elem.getBBox().width >= w) {
                    while (elem.getBBox().width >= w) {
                        msg = msg.substr(0, msg.length - 1);
                        elem.remove();
                        elem = svgLabel(msg);
                    }
                    msg = msg + "\n" + meterData.name.substring(msg.length);
                    elem.remove();
                    elem = svgLabel(msg);
                    elem.attr("title", meterData.name);
                }
                txtLabel = elem;
            }
            else if (config.engine === "canvas") {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = fontSize + "px" + " Arial";
                ctx.fillStyle = "#394449";
                msg = meterData.name;
                metrics = ctx.measureText(msg);
                ctx.fillText(msg, x1, y1);

                ctx.restore();
            }
        }

        /**
         * @private
         * @description 点击meter时，切换选择状态
         */
        function drawSelectIconCanvas() {
            if (selectedIcon === null || config.engine !== "canvas") {
                return;
            }

            var cx = config.left + config.width - 13;
            var cy = config.top + 13;
            var r = 8;

            ctx.save();

            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
            ctx.closePath();

            ctx.fillStyle = "#4F6BA8";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx - 5, cy);
            ctx.lineTo(cx - 1, cy + 4);
            ctx.lineTo(cx + 5, cy - 3);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        }

        /**
         * @private
         * @description 设置当前值，转动指针并更新显示的值
         * @param {Number} value 新的当前值
         * @param {Boolean} flag 是否动画
         */
        function setValue(value, flag) {
            if (config.engine === "svg" && pointer === null) {
                return;
            }

            if (isNaN(config.r)) {
                return;
            }

            var last = oldValue;
            if (last === null || typeof last === 'undefined') {
                last = meterData.start;
            }

            // meterData is null
            if (last === null || typeof last === 'undefined') {
                return;
            }

            // rotate pointer
            var v = value ? value : meterData.start;
            var angle1 = 180 * (last - meterData.start) / (meterData.end - meterData.start);
            var angle2 = 180 * (v - meterData.start) / (meterData.end - meterData.start);
            if (angle2 > 180) {
                angle2 = 180;
            }
            else if (angle2 < 0) {
                angle2 = 0;
            }

            var step = angle1 > angle2 ? -3 : 3;
            if ($.isIE() || !flag) {
                step = angle2 - angle1;
            }

            // 避免闪烁，先绘制一次
            if (config.engine === "canvas") {
                draw();
                drawPointer(180 - angle1);
            }

            // customized animation
            var timer = window.setInterval(function() {
                angle1 += step;
                if (step > 0 && angle1 > angle2) {
                    angle1 = angle2;
                }
                if (step < 0 && angle1 < angle2) {
                    angle1 = angle2;
                }

                if (config.engine === "svg") {
                    var m = Raphael.matrix();
                    m.rotate(angle1, config.cx, config.cy);
                    pointer.transform(m.toTransformString());
                }
                else if (config.engine === "canvas") {
                    draw();
                    drawPointer(180 - angle1);
                }

                if (angle1 === angle2) {
                    window.clearInterval(timer);
                }
            }, 10);

            oldValue = value;
            meterData.value = value;

            // change text value
            if (config.engine === "svg") {
                txtValue.attr({text: value === null ? "--" : value + meterData.unit, fill: getValueColor(value)});
                if (valueRange !== null) {
                    if (value !== null) {
                        valueRange.attr({text: "(" + value + "/" + meterData.end + ")"});
                    }
                    else {
                        valueRange.attr({text: " "});
                    }
                }
            }
            return;
        }

        /**
         * @private
         * @description 鼠标悬停或移出时，更改边框宽度
         * @param {Object} border 边框对象
         * @param {Boolean} flag 进入true/移出false
         */
        function stressBorder(border, flag) {
            if (config.engine === "svg") {
                if (flag) {
                    border.attr({"stroke-width": 1.5});
                }
                else {
                    border.attr({"stroke-width": 1});
                }
            }
            else if (config.engine === "canvas") {
                if (flag) {
                    ctx.save();

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#B6B7B9";
                    roundRect(0, 0, config.width, config.height, 5);
                    ctx.stroke();

                    ctx.restore();
                }
                else {
                    redraw();
                }
            }
        }

        /**
         * 绘制背景
         */
        function drawBackground() {
            var x1, y1;
            var border = null;

            x1 = config.left;
            y1 = config.top;

            if (config.engine === "svg") {
                // begin set
                R.setStart();

                R.rect(x1, y1, config.width, config.height, 5)
                    .attr({
                        stroke: "none",
                        fill: config.bgColor
                    });
            }
            else if (config.engine === "canvas") {
                ctx.save();
                ctx.clearRect(0, 0, config.width, config.height);
                ctx.fillStyle = config.bgColor;
                ctx.fillRect(0, 0, config.width, config.height);
                ctx.restore();

                border = $("#" + config.renderTo + "-canvas");
                border.attr("width", config.width).attr("height", config.height);
            }
        }

        /**
         * 绘制最外的边框
         */
        function drawOuterBorder () {
            var border = null;
            var cursor = "pointer";
            var x1, y1;

            x1 = config.left;
            y1 = config.top;


            if (config.engine === "svg") {
                border = R.rect(x1, y1, config.width, config.height, 5)
                    .attr({"stroke-width": 1,
                        stroke: "#B6B7B9",
                        fill: "white",
                        "fill-opacity": 0.01,
                        cursor: cursor
                    });

                if (config.borderStyle === "solid") {
                    $.noop();
                }
                else if (config.borderStyle === "dashed") {
                    border.attr({
                        "stroke-dasharray": "- "
                    });
                }
                else {
                    config.borderStyle = "none";
                    border.attr({
                        "stroke": "none"
                    });
                }

                // end set
                allSet = R.setFinish();

                addEvent(border);
            }
            else if (config.engine === "canvas") {
                ctx.save();

                if (config.borderStyle !== "none") {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#B6B7B9";
                    roundRect(0, 0, config.width, config.height, 5);
                    ctx.stroke();
                }

                ctx.restore();

                border = $("#" + config.renderTo + "-canvas");
                border.css("cursor", cursor);
            }
        }

        /**
         * @private
         * @description 在paper上绘制内容
         */
        function draw() {
            var cx, cy, r;
            var thick;

            if (!$.isNumeric(config.width) || !$.isNumeric(config.height)) {
                return false;
            }
            if (config.width <= 0 || config.height <= 0) {
                return false;
            }

            // get center position
            if (config.width < config.height * GOLD_RATIO) {
                r = config.width / 2;
                cx = config.left + r;
                cy = config.top + r;
            }
            else {
                r = config.height * GOLD_RATIO / 2;
                cx = config.left + config.width / 2;
                cy = config.top + r;
            }

            r = r > config.padding ? r - config.padding : 1;
            thick = Math.round(r * THICK_RATIO);

            config.cx = cx;
            config.cy = cy;
            config.r = r;
            config.thick = thick;

            // draw
            drawBackground();
            drawPart();
            drawPointer();
            drawText();
            drawSelectIconCanvas();
            drawOuterBorder();

            return;
        }

        /**
         * @private
         * @description 设置事件
         * @param {Object} border 边框对象，用于登记事件
         */
        function addEvent(border) {
            if (config.hoverInfo === true) {
                border.mouseover(function (evt) {
                    stressBorder(border, true);
                    hoverInfo(evt, true);
                });

                border.mouseout(function (evt) {
                    stressBorder(border, false);
                    hoverInfo(evt, false);
                });

                border.mousemove(function (evt) {
                    stressBorder(border, true);
                    hoverInfo(evt, true);
                });
            }

            border.click(function (evt) {
                if (config.selectable) {
                    switchSelect();
                    hoverInfo(evt, false);
                }
                fireEvent(evt);
            });
            return;
        }

        /**
         * @private
         * @description 设置数据
         * @example
         * var data = {
         *      name: "呼叫成功率",
         *      value: 98,      // 当前值
         *      start: 0,       // 最小值
         *      end: 100,       // 最大值
         *      threshold1: 75, // 提示告警阀值
         *      threshold2: 85, // 紧急告警阀值
         *      unit: "%",      // 数值单位
         *      rule: "good"    // 数据趋势类型，good-越大越好,bad-越大越差
         * };
         * meterObject.setData(data);
         * @param {Object} data 详细数据
         */
        function setData(data) {
            var changed = false;
            $.each(data, function (key, value) {
                if (key === 'value') {
                    return;
                }

                if (value !== meterData[key]) {
                    changed = true;
                }
            });

            meterData = $.extend(meterData, data);

            if (changed) {
                redraw();
                setValue(meterData.value, false);
            }
            else {
                setValue(meterData.value, true);
            }
        }

        /**
         * @private
         * @description 设置缩放比例，为兼容性，以重绘方式实现
         * @param {Number} scale 缩放比例
         * @param {Number} cx 缩放的中心点x坐标
         * @param {Number} cy 缩放的中心点y坐标
         */
        function setScale(scale, cx, cy) {
            // record original size
            if (config.zoom === 1.0) {
                config.orgWidth = config.width;
                config.orgHeight = config.height;
                config.orgLeft = config.left;
                config.orgTop = config.top;
                config.orgPadding = config.padding;
            }

            config.zoom = scale;
            config.zoomX = cx;
            config.zoomY = cy;

            config.width = config.orgWidth * config.zoom;
            config.height = config.orgHeight * config.zoom;
            config.padding = config.orgPadding * config.zoom;

            var m = Raphael.matrix();
            var x = config.orgLeft;
            var y = config.orgTop;

            m.scale(scale, scale, cx, cy);
            config.left = m.x(x, y);
            config.top = m.y(x, y);

            redraw(config.width, config.height);
        }

        /**
         * @private
         * @description 点击meter时，切换选择状态
         */
        function switchSelect() {
            if (selectedIcon === null) {
                var cx = config.left + config.width - 13;
                var cy = config.top + 13;
                var r = 8;

                if (config.engine === "svg") {
                    var c = R.circle(cx, cy, r).attr({stroke: "none", fill: "#4F6BA8"});
                    var path = [
                        "M", cx - 5, cy,
                        "L", cx - 1, cy + 4,
                        "L", cx + 5, cy - 3
                    ];
                    var l = R.path(path).attr({stroke: "white", "stroke-width": 2});

                    selectedIcon = [];
                    selectedIcon.push(c);
                    selectedIcon.push(l);
                    allSet.push(c, l);
                }
                else if (config.engine === "canvas") {
                    selectedIcon = true;
                    drawSelectIconCanvas();
                }
            }
            else {
                if (config.engine === "svg") {
                    for (var x in selectedIcon) {
                        if (selectedIcon.hasOwnProperty(x)) {
                            allSet.exclude(selectedIcon[x]);
                            selectedIcon[x].remove();
                            selectedIcon[x] = null;
                        }
                    }
                }
                else if (config.engine === "canvas") {
                    selectedIcon = null;
                    redraw();
                }

                selectedIcon = null;
            }
        }

        /**
         * @private
         * @description 鼠标悬停时，显示提示信息
         * @param {Event} evt 鼠标事件
         * @param {Boolean} flag 显示true或隐藏false
         */
        function hoverInfo(evt, flag) {
            // 创建信息框
            if (flag && hoverInfoDiv === null) {
                var html = '<div class="sweet-chart-speedometer-hover-info"></div>';
                var label = '<label>[INFO]</label>';
                hoverInfoDiv = $(html).appendTo("body");

                var info = Sweet.core.i18n.chart.meter.name + " : " + meterData.name;
                hoverInfoDiv.append($(label.replace("[INFO]", info)));

                info = Sweet.core.i18n.chart.meter.value + " : " + (0 === meterData.value || meterData.value ? meterData.value + meterData.unit : "--");
                hoverInfoDiv.append($(label.replace("[INFO]", info)));

                if (meterData.threshold2) {
                    info = Sweet.core.i18n.chart.meter.major + " : " + meterData.threshold2 + meterData.unit;
                    hoverInfoDiv.append($(label.replace("[INFO]", info)));
                }

                if (meterData.threshold1) {
                    info = Sweet.core.i18n.chart.meter.minor + " : " + meterData.threshold1 + meterData.unit;
                    hoverInfoDiv.append($(label.replace("[INFO]", info)));
                }

                info = Sweet.core.i18n.chart.meter.min + " : " + meterData.start + meterData.unit;
                hoverInfoDiv.append($(label.replace("[INFO]", info)));

                info = Sweet.core.i18n.chart.meter.max + " : " + meterData.end + meterData.unit;
                hoverInfoDiv.append($(label.replace("[INFO]", info)));
            }

            if (hoverInfoDiv === null) {
                return;
            }

            // 关闭提示信息
            if (flag === false) {
                hoverInfoDiv.hide();
            }
            else {
                hoverInfoDiv.show();

                // 显示在鼠标右下方
                hoverInfoDiv.css("left", evt.clientX + 5 + "px")
                    .css("top", evt.clientY + 20 + "px");
            }
        }

        /**
         * @private
         * @description 初始化绘图环境
         * @return {Boolean} 初始化结果
         */
        function init() {
            config = {};
            meterData = {
                name:"--",
                value:null,
                start:0,
                end:1,
                threshold1:1,
                threshold2:null,
                unit:"",
                rule:"bad"
            };

            // 初始化配置
            config.renderTo = "";
            config.renderToObj = null;
            config.paper = null;
            config.width = 124;
            config.height = 200;
            config.left = 0;
            config.top = 0;
            config.padding = 5;
            config.borderStyle = "none";
            config.selectable = false;
            config.showRange = false;
            config.showValueMax = true;
            config.bgColor = "transparent";
            config.hoverInfo = false;
            config.zoom = 1.0;
            config.engine = "svg";
            config.flat = false;
            config.showTexture = true;

            // update config
            config = $.extend(config, options);

            holderId = config.renderTo;
            or = options.paper;

            // create paper
            if (config.engine === "svg" && R === null) {
                if (!$.isNull(or)) {
                    R = or;
                }
                else {
                    /* 在这一行关闭jshint newcap告警 */
                    /* jshint newcap: false */
                    R = Raphael(config.renderToObj || holderId, config.width, config.height);
                }
                allSet = R.set();
            }
            else if (config.engine === "canvas") {
                var canvas = $("<canvas>").appendTo($("#" + holderId))
                    .attr('id', holderId + '-canvas')
                    .attr('width', '1000')
                    .attr('height', '1000');
                ctx = document.getElementById(holderId + '-canvas').getContext("2d");

                // pre process
                textureObj = new Image();
                var re = /url\([\"\']?(.*)[\"\']?\)/g;
                var match;
                if ((match = re.exec(config.texture)) !== null) {
                    config.texture = match[1].replace(/[\"\']?$/g, "");
                    textureObj.onload = function () {
                        textureObj._complete = true;
                        redraw(config.width, config.height);
                    };
                    textureObj.src = config.texture;
                }

                addEvent(canvas);
            }

            return true;
        }

        /**
         * 触发事件，调用回调函数处理
         * @private
         * @param {obj} event 事件
         */
        function fireEvent(event) {
            if ($.isNull(listeners[event.type])) {
                return;
            }

            var handler = listeners[event.type];
            for (var i in handler) {
                if (handler.hasOwnProperty(i)) {
                    try {
                        handler[i](event , selectedIcon !== null);
                    }
                    catch (e) {
                        $.noop();
                    }
                }
            }
        }

        /**
         * @private
         * 添加事件处理
         * @param {String} event 事件名
         * @param {Function} handler 回调函数
         */
        function addListener(event, handler) {
            if ($.isNull(listeners[event])) {
                listeners[event] = [];
            }

            listeners[event].push(handler);
        }

        /**
         * @private
         * @description 销毁对象
         */
        function destroy() {
            // remove all elements
            if (config.engine === "svg" && allSet) {
                allSet.forEach(function (obj) {
                    obj.remove();
                });
                allSet.clear();

                if (or === null) {
                    R.remove();
                    R = null;
                }
            }
            else if (config.engine === "canvas") {
                ctx.clearRect(0, 0, config.width, config.height);
            }
        }

        /**
         * @description 重新绘制
         */
        function redraw(width, height) {
            // remove all elements
            if (config.engine === "svg" && allSet) {
                allSet.forEach(function (obj) {
                    obj.remove();
                });
                allSet.clear();

                pointer = null;
                txtValue = null;
                valueRange = null;
                txtLabel = null;
                selectedIcon = null;
            }
            else if (config.engine === "canvas") {
                ctx.clearRect(0, 0, config.width, config.height);
            }

            if (hoverInfoDiv) {
                hoverInfoDiv.remove();
            }
            hoverInfoDiv = null;

            // 刷新大小
            if (typeof width !== 'undefined') {
                config.width = width;
            }
            if (typeof height !== 'undefined') {
                config.height = height;
            }

            // 绘制
            if (config.paper !== R && R) {
                R.setSize(config.width, config.height);
            }
            else if (ctx) {
                $("#" + config.holderId + "-canvas")
                    .attr("width", config.width)
                    .attr("height", config.height);
            }

            draw();
            setValue(meterData.value);
        }

        // create object
        var meterObj = {};
        function _initMeterObj () {
            meterObj.init = init;
            meterObj.setData = setData;
            meterObj.redraw = redraw;
            meterObj.setValue = setValue;
            meterObj.setScale = setScale;
            meterObj.destroy = destroy;
            meterObj.addListener = addListener;

            // init object
            meterObj.init();
        }

        _initMeterObj();
        return meterObj;
    };

    var self = null;
    var textureClass = 'sweet-chart-texture';
    $.widget("sweet.widgetChartSpeedometer", $.sweet.widgetChart, {
        version: "1.0",
        sweetWidgetName: "[widget-chart-speedometer]:",
        eventNames: /** @lends Sweet.chart.Speedometer.prototype*/{
            /**
             * @event
             * @description 单击事件
             */
            click: "单击事件"
        },
        // 组件配置参数
        options: /**@lends Sweet.chart.Speedometer.prototype*/{
            /**
             * 渲染目标DIV的id
             * @type String
             * @default ""
             */
            renderTo: "",
            /**
             * 外部创建好的Raphael Paper对象，此属性有效时，Speedometer不再自行创建Paper对象
             * @type Object
             * @default null
             */
            paper: null,
            /**
             * 对象在画布上的左边距
             * @type Number
             * @default 0
             */
            left: 0,
            /**
             * 对象在画布上的上边距
             * @type Number
             * @default 0
             */
            top: 0,
            /**
             * 对象宽度
             * @type Number
             * @default 110
             */
            width: 110,
            /**
             * 对象高度
             * @type Number
             * @default 130
             */
            height: 130,
            /**
             * 对象渲染内边距
             * @type Number
             * @default 10
             */
            padding: 10,
            /**
             * 边框类型，可选值：solid/dashed/none
             * @type String
             * @default solid
             */
            borderStyle: "solid",
            /**
             * 是否允许选中。为True时，点击选中对象会在右上角显示选中图标
             * @type Boolean
             * @default true
             */
            selectable: true,
            /**
             * 是否在表盘外侧显示起始值及阀值
             * @type Boolean
             * @default false
             */
            showRange: false,
            /**
             * 是否在数值下方显示数值、最大值信息
             * @type Boolean
             * @default true
             */
            showValueMax: true,
            /**
             * 绘图引擎
             * @type String
             * @default "svg"
             */
            engine: "svg",
            /**
             * 是否取消在颜色上绘制渐变效果
             * @type Boolean
             * @default false
             */
            flat: false,
            /**
             * 是否显示底纹
             * @type Boolean
             * @default true
             */
            showTexture: true
        },

        /**
         * @description 设置当前值，转动指针并更新显示的值
         * @param {Number} value 新的当前值
         */
        setValue: function (value) {
            this.chartElement.setValue(value, true);
        },
        /**
         * @description 设置缩放比例
         * @param {Number} scale 缩放比例
         * @param {Number} cx 缩放的中心点x坐标
         * @param {Number} cy 缩放的中心点y坐标
         */
        setScale: function (scale, cx, cy) {
            this.chartElement.setScale(scale, cx, cy);
        },
        /**
         * @description 设置图表数据
         * @param {Object} data 数据对象
         */
        setData: function (data) {
            this.options.data = data;
            if (this.rendered) {
                this.chartElement.setData(data);
            }
        },

        /**
         * @private
         * @description 注册事件
         */
        _addEvent: function () {
            var me = this;
            me.chartElement.addListener("click", function(e){
                me._triggerHandler(e, e.type, me.options && me.options.data ? me.options.data : {}); 
            });
        },

        /**
         * @private
         * @description 创建js版图表
         */
        _createJsChart: function () {
        },
        /**
         * @description 渲染到容器
         * @private
         */
        _chartRender: function () {
            var me = this;
            var options = me.options;

            // 绘制对象
            var config = {};
            config.renderTo = me.chartEl.attr("id");
            config.renderToObj = me.chartEl.get(0);
            config.paper = options.paper;
            config.width = this.chartEl.width();
            config.height = this.chartEl.height();
            config.left = options.left;
            config.top = options.top;
            config.padding = options.padding;
            config.borderStyle = options.borderStyle;
            config.selectable = options.selectable;
            config.showRange = options.showRange;
            config.showValueMax = options.showValueMax;
            config.hoverInfo = options.hoverInfo;
            config.engine = options.engine;
            config.flat = options.flat;
            config.showTexture = options.showTexture;

            // 取得材质图片路径
            var tdiv = $("<div></div>").addClass(textureClass).appendTo("body");
            var textureUrl = tdiv.css('background-image');
            config.texture = textureUrl;
            tdiv.remove();

            var chart = this.chartElement = new Meter(config);

            // 注册事件
            me._addEvent();

            // 设置数据
            var data = me.options.data;
            if (!$.isNull(data)) {
                chart.setData(data);
            }
        },
        /**
         * @private
         * @description 创建flash版图表
         */
        _createFlashChart: function () {
            this._error("not implemented yet!");
        },
        /**
         * @event
         * @description 点击事件
         * @name Sweet.chart.Speedometer#click
         * @param {Event} event 事件名称
         */
        click: function (event) {
            $.log(event);
        },

        /**
         * @description 刷新布局
         * @private
         */
        _doLayout: function () {
            var me = this;

            if ($.isNull(me.chartElement) || $.isNull(me.renderEl)) {
                return;
            }

            // 取得当前容器大小，重新绘制图表
            var width = me.chartEl.width();
            var height = me.chartEl.height();
            me.chartElement.redraw(width, height);
        },
        /**
         * @private
         * @description 销毁组件
         */
        _destroyWidget: function() {
            // 删除图表对象
            if (this.chartElement && $.isFunction(this.chartElement.destroy)) {
                try {
                    this.chartElement.destroy();
                }
                catch (e) {
                    this._error(e);
                }
                this.chartElement = null;
            }

            // 清除数据
            this.options.data = null;

            // 删除Dom
            if (this.chartEl) {
                this.chartEl.remove();
            }
        }

    });

    /**
     * @description 示速器组件
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.chart
     * @requires <pre>
     * jquery.js,
     * raphael.js
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.chart.js
     * </pre>
     * @example
     * 创建示速器：
     * var sweetSpeedometer = new Sweet.chart.Speedometer();
     */
    Sweet.chart.Speedometer = $.sweet.widgetChartSpeedometer;

}(jQuery) );

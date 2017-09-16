/**
 * Copyright (c) 2009 Jason S. Kerchner. All rights reserved.
 * Code released under the BSD license:
 * http://livingmachines.net/license
 * Redistribution must include this complete copyright notice.
 */



/**
 * Create a AmCharts namespace for our library.
 * @type object
 */
if (!AmCharts) {
    var AmCharts = {};
}

/**
 * Used to indicate that we are in the process of creating a new inherited class.
 * @type object 
 */
AmCharts.inheriting = {};

/**
 * Creates a new constructor function based on the given initialization object.
 * Executing the constructor using the new keyword will create a new class
 * that supports inheritance, property and methods overrides, and the ability
 * to call base class methods.  The following is an example of how to use
 * the Class function.  In this example, we have an already existing class,
 * Person, and we are inheriting a new class from it, Employee.
 * 
 * <pre>
 * Employee = Class({
 *  
 *   // Inherits from person
 *   inherits: Person,
 *  
 *   // This is the constructor
 *   construct: function(first, last, company) {    
 *     // Calls base class constructor
 *     Employee.base.construct.call(this, first, last);
 *     this.company = company;
 *   },
 *  
 *   // New method added to this class
 *   getWebSite: function() {
 *     return 'http://www.' + this.company + '.com';
 *   },
 *  
 *   // Overrides method in Person (and calls base class method)
 *   getFullName: function(firstLastFormat) {
 *     if (firstLastFormat)
 *       return Employee.base.getFullName.call(this);
 *     else
 *       return this.lastName + ', ' + this.firstName;
 *     }
 *  
 * });
 * </pre>
 * 
 * @param {Object} init The initialization object.
 * @return {Function} Returns the new constructor function (e.g. the class)
 */
AmCharts.Class = function(init) {

    // Create constructor function that will check if we are inheriting, 
    // then call real constructor
    var cstr = function() {
        if (arguments[0] === AmCharts.inheriting) return;
        this.events = {};
        this.construct.apply(this, arguments);
    };

    // If we are inheriting, copy the prototype, otherwise assign a new prototype
    if (init.inherits) {
        cstr.prototype = new init.inherits(AmCharts.inheriting);
        cstr.base = init.inherits.prototype;
        delete init.inherits; // Keeps it from being added to the prototype later
    } else {

        // Since we are not inheriting, then we must add event methods,
        // otherwise they will be included via inheritance.

        cstr.prototype.createEvents = function( /* event */ ) {
            for (var i = 0, len = arguments.length; i < len; i++)
            this.events[arguments[i]] = [];
        };

        cstr.prototype.listenTo = function(obj, event, handler) {
            obj.events[event].push({
                handler: handler,
                scope: this
            });
        };

        cstr.prototype.addListener = function(event, handler, obj) {
            this.events[event].push({
                handler: handler,
                scope: obj
            });
        };

        cstr.prototype.removeListener = function(obj, event, handler) {
            var ev = obj.events[event];
            // Loop down, just in case handler was added multiple times (and will be removed multiple times)
            for (var i = ev.length - 1; i >= 0; i--) {
                if (ev[i].handler === handler) ev.splice(i, 1); // Deletes one element starting at index i
            }
        };

        cstr.prototype.fire = function(event, data) {
            var handlers = this.events[event];
            for (var i = 0, len = handlers.length; i < len; i++) {
                var h = handlers[i];
                h.handler.call(h.scope, data);
            }
        }
    }

    // Copy init properties to the prototype (adds/overrides base class methods)
    for (var p in init)
    cstr.prototype[p] = init[p];

    // Return the constructor function (this is the class)
    return cstr;

};

AmCharts.charts = [];

AmCharts.addChart = function(chart) {
    AmCharts.charts.push(chart);
}

AmCharts.removeChart = function(chart) {
    var charts = AmCharts.charts;
    for (var i = charts.length - 1; i >= 0; i--) {
        if (charts[i] == chart) {
            charts.splice(i, 1);
        }
    }
}



// check ie version
AmCharts.IEversion = 0;

if (navigator.appVersion.indexOf("MSIE") != -1) {
    if (document.documentMode) {
        AmCharts.IEversion = Number(document.documentMode);
    }
}

// check browser

if (document.addEventListener || window.opera) {
    AmCharts.isNN = true;
    AmCharts.isIE = false;
    AmCharts.dx = 0.5;
    AmCharts.dy = 0.5;
}

if (document.attachEvent) {
    AmCharts.isNN = false;
    AmCharts.isIE = true;
    if (AmCharts.IEversion < 9) {
        AmCharts.dx = 0;
        AmCharts.dy = 0;
    }
}

if (window.chrome) {
    AmCharts.chrome = true;
}

// event handlers
AmCharts.handleResize = function() {
    var charts = AmCharts.charts;

    for (var i = 0; i < charts.length; i++) {
        var chart = charts[i];

        if (chart) {
            if (chart.div) {
                chart.handleResize();
            }
        }
    }
}

AmCharts.handleMouseUp = function(e) {
    var charts = AmCharts.charts;

    for (var i = 0; i < charts.length; i++) {
        var chart = charts[i];

        if (chart) {
            chart.handleReleaseOutside(e);
        }
    }
}

AmCharts.handleMouseMove = function(e) {
    var charts = AmCharts.charts;
    for (var i = 0; i < charts.length; i++) {
        var chart = charts[i];

        if (chart) {
            chart.handleMouseMove(e);
        }
    }
}

AmCharts.resetMouseOver = function() {
    var charts = AmCharts.charts;
    for (var i = 0; i < charts.length; i++) {
        var chart = charts[i];

        if (chart) {
            chart.mouseIsOver = false;
        }
    }
}

AmCharts.onReadyArray = [];
AmCharts.ready = function(value) {
    AmCharts.onReadyArray.push(value);
}

AmCharts.handleLoad = function() {
    var onReadyArray = AmCharts.onReadyArray;
    for (var i = 0; i < onReadyArray.length; i++) {
        var fnc = onReadyArray[i];
        fnc();
    }
}


AmCharts.useUTC = false;
AmCharts.updateRate = 40;
AmCharts.uid = 0;

AmCharts.getUniqueId = function() {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid;
}

// add events for NN/FF/etc
if (AmCharts.isNN) {
    document.addEventListener('mousemove', AmCharts.handleMouseMove, true);
    window.addEventListener('resize', AmCharts.handleResize, true);
    document.addEventListener("mouseup", AmCharts.handleMouseUp, true);
    window.addEventListener('load', AmCharts.handleLoad, true);
}

if (AmCharts.isIE) {
    document.attachEvent('onmousemove', AmCharts.handleMouseMove);
    window.attachEvent('onresize', AmCharts.handleResize);
    document.attachEvent("onmouseup", AmCharts.handleMouseUp);
    window.attachEvent('onload', AmCharts.handleLoad);
};
AmCharts.AmChart = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.version = "2.8.2";
        AmCharts.addChart(_this);
        _this.createEvents('dataUpdated', 'init');
        _this.width = '100%';
        _this.height = '100%';
        _this.dataChanged = true;
        _this.chartCreated = false;
        _this.previousHeight = 0;
        _this.previousWidth = 0;
        _this.backgroundColor = "#FFFFFF";
        _this.backgroundAlpha = 0;
        _this.borderAlpha = 0;
        _this.borderColor = "#000000";
        _this.color = "#000000";
        _this.fontFamily = "Verdana";
        _this.fontSize = 11;
        _this.numberFormatter = {
            precision: -1,
            decimalSeparator: '.',
            thousandsSeparator: ','
        };
        _this.percentFormatter = {
            precision: 2,
            decimalSeparator: '.',
            thousandsSeparator: ','
        };
        _this.labels = [];
        _this.allLabels = [];
        _this.titles = [];
        _this.autoMarginOffset = 0;
        _this.marginLeft = 0;
        _this.marginRight = 0;
        _this.timeOuts = [];

        var chartDiv = document.createElement("div");
        var chartStyle = chartDiv.style;
        chartStyle.overflow = "hidden";
        chartStyle.position = "relative";
        chartStyle.textAlign = "left";
        _this.chartDiv = chartDiv;

        var legendDiv = document.createElement("div");
        var legendStyle = legendDiv.style;
        legendStyle.overflow = "hidden";
        legendStyle.position = "relative";
        _this.legendDiv = legendDiv;

        _this.balloon = new AmCharts.AmBalloon();
        _this.balloon.chart = _this;
        _this.titleHeight = 0;

        _this.prefixesOfBigNumbers = [{
            number: 1e+3,
            prefix: "k"
        }, {
            number: 1e+6,
            prefix: "M"
        }, {
            number: 1e+9,
            prefix: "G"
        }, {
            number: 1e+12,
            prefix: "T"
        }, {
            number: 1e+15,
            prefix: "P"
        }, {
            number: 1e+18,
            prefix: "E"
        }, {
            number: 1e+21,
            prefix: "Z"
        }, {
            number: 1e+24,
            prefix: "Y"
        }];
        _this.prefixesOfSmallNumbers = [{
            number: 1e-24,
            prefix: "y"
        }, {
            number: 1e-21,
            prefix: "z"
        }, {
            number: 1e-18,
            prefix: "a"
        }, {
            number: 1e-15,
            prefix: "f"
        }, {
            number: 1e-12,
            prefix: "p"
        }, {
            number: 1e-9,
            prefix: "n"
        }, {
            number: 1e-6,
            prefix: "μ"
        }, {
            number: 1e-3,
            prefix: "m"
        }];
        _this.panEventsEnabled = false;
        AmCharts.bezierX = 3;
        AmCharts.bezierY = 6;

        _this.product = "amcharts";

        // 材质索引
        _this.textureMap = {};

        /**
         * 添加shadow属性，配置是否需要为图添加阴影效果
         */
        _this.shadow = false;
        //======= add end ====================
    },

    drawChart: function() {
        var _this = this;

        _this.drawBackground();

        _this.redrawLabels();

        _this.drawTitles();
    },

    drawBackground: function() {
        var _this = this;
        var container = _this.container;
        var backgroundColor = _this.backgroundColor;
        var backgroundAlpha = _this.backgroundAlpha;
        var set = _this.set;

        var realWidth = _this.updateWidth();
        _this.realWidth = realWidth;

        var realHeight = _this.updateHeight();
        _this.realHeight = realHeight;

        var background = AmCharts.polygon(container, [0, realWidth - 1, realWidth - 1, 0], [0, 0, realHeight - 1, realHeight - 1], backgroundColor, backgroundAlpha, 1, _this.borderColor, _this.borderAlpha);
        _this.background = background;
        set.push(background);

        var backgroundImage = _this.backgroundImage;
        if (backgroundImage) {
            if (_this.path) {
                backgroundImage = _this.path + backgroundImage;
            }

            var bgImg = container.image(backgroundImage, 0, 0, realWidth, realHeight);
            _this.bgImg = bgImg;
            set.push(bgImg);
        }
    },

    drawTitles: function() {
        var _this = this;
        var titles = _this.titles;
        if (AmCharts.ifArray(titles)) {
            var nextY = 20;
            for (var i = 0; i < titles.length; i++) {
                var title = titles[i];
                var color = title.color;
                if (color == undefined) {
                    color = _this.color;
                }
                var size = title.size;

                var alpha = title.alpha
                if (isNaN(alpha)) {
                    alpha = 1;
                }

                var marginLeft = _this.marginLeft;
                var titleLabel = AmCharts.text(_this.container, title.text, color, _this.fontFamily, size);
                titleLabel.translate(marginLeft + (_this.realWidth - _this.marginRight - marginLeft) / 2, nextY);

                var bold = true;
                if (title.bold != undefined) {
                    bold = title.bold;
                }
                if (bold) {
                    titleLabel.attr({
                        'font-weight': 'bold'
                    });
                }

                nextY += size + 6;
                _this.freeLabelsSet.push(titleLabel);
            }
        }
    },

    write: function(divId) {
        var _this = this;

        var balloon = _this.balloon;
        if (balloon) {
            if (!balloon.chart) {
                balloon.chart = this;
            }
        }

        var div;
        if (typeof(divId) != "object") {
            div = document.getElementById(divId);
        } else {
            div = divId;
        }
        div.innerHTML = "";
        _this.div = div;
        div.style.overflow = "hidden";
        div.style.textAlign = "left";

        var chartDiv = _this.chartDiv;
        var legendDiv = _this.legendDiv;
        var legend = _this.legend;
        var legendStyle = legendDiv.style;
        var chartStyle = chartDiv.style;
        _this.measure();

        var UNDEFINED = undefined;
        var ABSOLUTE = "absolute";
        var RELATIVE = "relative";
        var PX = "px";

        if (legend) {
            switch (legend.position) {
                case "bottom":
                    div.appendChild(chartDiv);
                    div.appendChild(legendDiv);
                    break;
                case "top":
                    div.appendChild(legendDiv);
                    div.appendChild(chartDiv);
                    break;
                case ABSOLUTE:
                    var container = document.createElement("div");
                    var containerStyle = container.style;
                    containerStyle.position = RELATIVE;
                    containerStyle.width = div.style.width;
                    containerStyle.height = div.style.height;
                    div.appendChild(container);

                    legendStyle.position = ABSOLUTE;
                    chartStyle.position = ABSOLUTE;
                    if (legend.left != UNDEFINED) {
                        legendStyle.left = legend.left + PX;
                    }
                    if (legend.right != UNDEFINED) {
                        legendStyle.right = legend.right + PX;
                    }
                    if (legend.top != UNDEFINED) {
                        legendStyle.top = legend.top + PX;
                    }
                    if (legend.bottom != UNDEFINED) {
                        legendStyle.bottom = legend.bottom + PX;
                    }
                    legend.marginLeft = 0;
                    legend.marginRight = 0;

                    container.appendChild(chartDiv);
                    container.appendChild(legendDiv);
                    break;
                case "right":
                    var container = document.createElement("div");
                    var containerStyle = container.style;
                    containerStyle.position = RELATIVE;
                    containerStyle.width = div.style.width;
                    containerStyle.height = div.style.height;
                    div.appendChild(container);

                    legendStyle.position = RELATIVE;
                    chartStyle.position = ABSOLUTE;
                    container.appendChild(chartDiv);
                    container.appendChild(legendDiv);
                    break;
                case "left":
                    var container = document.createElement("div");
                    var containerStyle = container.style;
                    containerStyle.position = RELATIVE;
                    containerStyle.width = div.style.width;
                    containerStyle.height = div.style.height;
                    div.appendChild(container);
                    legendStyle.position = ABSOLUTE;
                    chartStyle.position = RELATIVE;
                    container.appendChild(chartDiv);
                    container.appendChild(legendDiv);
                    break;
            }
        } else {
            div.appendChild(chartDiv);
        }

        if (!_this.listenersAdded) {
            _this.addListeners();
            _this.listenersAdded = true;
        }

        _this.initChart();
    },

    createLabelsSet: function() {
        var _this = this;
        AmCharts.remove(_this.labelsSet);
        _this.labelsSet = _this.container.set();
        _this.freeLabelsSet.push(_this.labelsSet);
    },

    initChart: function() {
        var _this = this;

        _this.divIsFixed = AmCharts.findIfFixed(_this.chartDiv);

        _this.previousHeight = _this.realHeight;
        _this.previousWidth = _this.realWidth;
        _this.destroy();

        var mouseMode = 0;
        if (document.attachEvent && !window.opera) {
            mouseMode = 1;
        }
        if (AmCharts.isNN && AmCharts.findIfAuto(_this.chartDiv)) {
            mouseMode = 3;
        }

        _this.mouseMode = mouseMode;
        _this.container = new AmCharts.AmDraw(_this.chartDiv, _this.realWidth, _this.realHeight);

        // 初始化填充材质
        if (AmCharts.SVG) {
            _this.container.initTexturePatterns(_this.textureMap);
            /**
             * 添加shadow属性，为图添加阴影效果
             */
            if (_this.shadow) {
                _this.container.shadow();
            }
            //======= add end ====================
        }

        if (AmCharts.VML || AmCharts.SVG) {
            var container = _this.container;
            _this.set = container.set();
            //_this.set.setAttr("id", "mainSet");

            _this.gridSet = container.set();
            //_this.gridSet.setAttr("id", "grid");        

            _this.graphsBehindSet = container.set();

            _this.bulletBehindSet = container.set();

            _this.columnSet = container.set();
            //_this.columnSet.setAttr("id", "columns");

            _this.graphsSet = container.set();

            _this.trendLinesSet = container.set();
            //_this.trendLinesSet.setAttr("id", "trendlines");

            _this.axesLabelsSet = container.set();
            //_this.axesLabelsSet.setAttr("id", "axes labels");

            _this.axesSet = container.set();
            //_this.axesSet.setAttr("id", "axes");     

            _this.cursorSet = container.set();
            //_this.cursorSet.setAttr("id", "cursor");

            _this.scrollbarsSet = container.set();
            //_this.scrollbarsSet.setAttr("id", "scrollbars");        

            _this.bulletSet = container.set();
            //_this.bulletSet.setAttr("id", "bullets");

            _this.freeLabelsSet = container.set();
            //_this.freeLabelsSet.setAttr("id", "free labels");

            _this.balloonsSet = container.set();
            _this.balloonsSet.setAttr("id", "balloons");

            _this.zoomButtonSet = container.set();
            //_this.zoomButtonSet.setAttr("id", "zoom out button");

            _this.linkSet = container.set();

            _this.drb();

            _this.renderFix();
        }
    },

    measure: function() {
        var _this = this;
        var div = _this.div;
        var chartDiv = _this.chartDiv;
        var divRealWidth = div.offsetWidth;
        var divRealHeight = div.offsetHeight;
        var container = _this.container;
        var PX = "px";

        if (div.clientHeight) {
            divRealWidth = div.clientWidth;
            divRealHeight = div.clientHeight;
        }

        var paddingLeft = AmCharts.removePx(AmCharts.getStyle(div, "padding-left"));
        var paddingRight = AmCharts.removePx(AmCharts.getStyle(div, "padding-right"));
        var paddingTop = AmCharts.removePx(AmCharts.getStyle(div, "padding-top"));
        var paddingBottom = AmCharts.removePx(AmCharts.getStyle(div, "padding-bottom"));

        if (!isNaN(paddingLeft)) {
            divRealWidth -= paddingLeft;
        }
        if (!isNaN(paddingRight)) {
            divRealWidth -= paddingRight;
        }
        if (!isNaN(paddingTop)) {
            divRealHeight -= paddingTop;
        }
        if (!isNaN(paddingBottom)) {
            divRealHeight -= paddingBottom;
        }

        var divStyle = div.style;
        var w = divStyle.width;
        var h = divStyle.height;

        if (w.indexOf(PX) != -1) {
            divRealWidth = AmCharts.removePx(w);
        }
        if (h.indexOf(PX) != -1) {
            divRealHeight = AmCharts.removePx(h);
        }

        var realWidth = AmCharts.toCoordinate(_this.width, divRealWidth);
        var realHeight = AmCharts.toCoordinate(_this.height, divRealHeight);

        if (realWidth != _this.previousWidth || realHeight != _this.previousHeight) {
            chartDiv.style.width = realWidth + PX;
            chartDiv.style.height = realHeight + PX;

            if (container) {
                container.setSize(realWidth, realHeight);
            }
            _this.balloon.setBounds(2, 2, realWidth - 2, realHeight);
        }

        _this.realWidth = realWidth;
        _this.realHeight = realHeight;
        _this.divRealWidth = divRealWidth;
        _this.divRealHeight = divRealHeight;
    },

    destroy: function() {
        var _this = this;
        _this.chartDiv.innerHTML = "";
        _this.clearTimeOuts();
    },

    clearTimeOuts: function() {
        var _this = this;
        var timeOuts = _this.timeOuts;
        if (timeOuts) {
            for (var i = 0; i < timeOuts.length; i++) {
                clearTimeout(timeOuts[i]);
            }
        }
        _this.timeOuts = [];
    },

    clear: function(keepChart) {
        var _this = this;
        AmCharts.callMethod("clear", [_this.chartScrollbar, _this.scrollbarV, _this.scrollbarH, _this.chartCursor]);
        _this.chartScrollbar = null;
        _this.scrollbarV = null;
        _this.scrollbarH = null;
        _this.chartCursor = null;
        _this.clearTimeOuts();
        if (_this.container) {
            _this.container.remove(_this.chartDiv);
            _this.container.remove(_this.legendDiv);
        }
        if (!keepChart) {
            AmCharts.removeChart(this);
        }
    },

    setMouseCursor: function(cursor) {
        if (cursor == "auto" && AmCharts.isNN) {
            cursor = "default";
        }
        this.chartDiv.style.cursor = cursor;
        this.legendDiv.style.cursor = cursor;
    },

    redrawLabels: function() {
        var _this = this;
        _this.labels = [];
        var allLabels = _this.allLabels;

        _this.createLabelsSet();

        for (var i = 0; i < allLabels.length; i++) {
            _this.drawLabel(allLabels[i]);
        }
    },

    drawLabel: function(label) {
        var _this = this;

        if (_this.container) {
            var x = label.x;
            var y = label.y;
            var text = label.text;
            var align = label.align;
            var size = label.size;
            var color = label.color;
            var rotation = label.rotation;
            var alpha = label.alpha;
            var bold = label.bold;

            var nx = AmCharts.toCoordinate(x, _this.realWidth);
            var ny = AmCharts.toCoordinate(y, _this.realHeight);

            if (!nx) {
                nx = 0;
            }

            if (!ny) {
                ny = 0;
            }

            if (color == undefined) {
                color = _this.color;
            }
            if (isNaN(size)) {
                size = _this.fontSize;
            }
            if (!align) {
                align = "start";
            }
            if (align == "left") {
                align = "start";
            }
            if (align == "right") {
                align = "end";
            }
            if (align == "center") {
                align = "middle";
                if (!rotation) {
                    nx = _this.realWidth / 2 - nx;
                } else {
                    ny = _this.realHeight - ny + ny / 2;
                }
            }
            if (alpha == undefined) {
                alpha = 1;
            }
            if (rotation == undefined) {
                rotation = 0;
            }

            ny += size / 2;

            var labelObj = AmCharts.text(_this.container, text, color, _this.fontFamily, size, align, bold, alpha);
            labelObj.translate(nx, ny);

            if (rotation != 0) {
                labelObj.rotate(rotation);
            }

            if (label.url) {
                labelObj.setAttr("cursor", "pointer");
                labelObj.click(function() {
                    AmCharts.getURL(label.url);
                })
            }

            _this.labelsSet.push(labelObj);
            _this.labels.push(labelObj);
        }
    },

    addLabel: function(x, y, text, align, size, color, rotation, alpha, bold, url) {
        var _this = this;
        var label = {
            x: x,
            y: y,
            text: text,
            align: align,
            size: size,
            color: color,
            alpha: alpha,
            rotation: rotation,
            bold: bold,
            url: url
        };

        if (_this.container) {
            _this.drawLabel(label);
        }
        _this.allLabels.push(label);
    },

    clearLabels: function() {
        var _this = this;
        var labels = _this.labels;

        for (var i = labels.length - 1; i >= 0; i--) {
            labels[i].remove();
        }
        _this.labels = [];
        _this.allLabels = [];
    },

    updateHeight: function() {
        var _this = this;
        var height = _this.divRealHeight;

        var legend = _this.legend;
        if (legend) {
            var legendHeight = _this.legendDiv.offsetHeight;

            var lPosition = legend.position;
            if (lPosition == "top" || lPosition == "bottom") {
                height -= legendHeight;
                if (height < 0) {
                    height = 0;
                }
                _this.chartDiv.style.height = height + "px";
            }
        }
        return height;
    },


    updateWidth: function() {
        var _this = this;
        var width = _this.divRealWidth;
        var height = _this.divRealHeight;
        var legend = _this.legend;
        if (legend) {
            var legendDiv = _this.legendDiv;
            var legendWidth = legendDiv.offsetWidth;
            var legendHeight = legendDiv.offsetHeight;
            var legendStyle = legendDiv.style;

            var chartDiv = _this.chartDiv;
            var chartStyle = chartDiv.style;

            var lPosition = legend.position;
            var px = "px";

            if (lPosition == "right" || lPosition == "left") {
                width -= legendWidth;
                if (width < 0) {
                    width = 0;
                }
                chartStyle.width = width + px;

                if (lPosition == "left") {
                    //chartStyle.left = (AmCharts.findPosX(_this.div) + legendWidth) + px;
                    chartStyle.left = legendWidth + px;
                } else {
                    legendStyle.left = width + px;
                }
                var __top = (height - legendHeight) / 2;
                legendStyle.top = (__top < 0 ? 0 : __top) + px;
            }
        }
        return width;
    },


    getTitleHeight: function() {
        var titleHeight = 0;
        var titles = this.titles;
        if (titles.length > 0) {
            titleHeight = 15;
            for (var i = 0; i < titles.length; i++) {
                var title = titles[i];
                titleHeight += title.size + 6;
            }
        }
        return titleHeight;
    },

    addTitle: function(text, size, color, alpha, bold) {
        var _this = this;

        if (isNaN(size)) {
            size = _this.fontSize + 2;
        }
        var tObj = {
            text: text,
            size: size,
            color: color,
            alpha: alpha,
            bold: bold
        };
        _this.titles.push(tObj);
        return tObj;
    },

    addListeners: function() {
        var _this = this;
        var chartDiv = _this.chartDiv;

        if (AmCharts.isNN) {
            if (_this.panEventsEnabled) {
                if ('ontouchstart' in document.documentElement) {
                    chartDiv.addEventListener('touchstart', function(event) {
                        _this.handleTouchMove.call(_this, event)
                        _this.handleTouchStart.call(_this, event);
                    }, true);

                    chartDiv.addEventListener('touchmove', function(event) {
                        _this.handleTouchMove.call(_this, event)
                    }, true);

                    chartDiv.addEventListener("touchend", function(event) {
                        _this.handleTouchEnd.call(_this, event);
                    }, true);
                }
            }

            chartDiv.addEventListener("mousedown", function(event) {
                _this.handleMouseDown.call(_this, event);
            }, true);

            chartDiv.addEventListener("mouseover", function(event) {
                _this.handleMouseOver.call(_this, event);
            }, true);

            chartDiv.addEventListener("mouseout", function(event) {
                _this.handleMouseOut.call(_this, event);
            }, true);
        }

        if (AmCharts.isIE) {
            chartDiv.attachEvent("onmousedown", function(event) {
                _this.handleMouseDown.call(_this, event);
            });

            chartDiv.attachEvent("onmouseover", function(event) {
                _this.handleMouseOver.call(_this, event);
            });

            chartDiv.attachEvent("onmouseout", function(event) {
                _this.handleMouseOut.call(_this, event);
            });
        }
    },

    dispDUpd: function() {
        var _this = this;
        var type;
        if (_this.dispatchDataUpdated) {
            _this.dispatchDataUpdated = false;
            type = 'dataUpdated';
            _this.fire(type, {
                type: type,
                chart: _this
            });
        }
        if (!_this.chartCreated) {
            type = 'init';
            _this.fire(type, {
                type: type,
                chart: _this
            });
        }
    },

    drb: function() {
        /*var _this = this;
		var product = _this.product;
		var url = product + ".com"; 
		
		var host = window.location.hostname;
		var har = host.split(".");
		if(har.length >= 2)
		{
			var mh = har[har.length - 2] + "." + har[har.length - 1];
		}
		
		AmCharts.remove(_this.bbset);
		
		if(mh!= url)
		{
			url = url + "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo" + product;
            
            var txt = "chart by ";
            var width = 145;
            if(product == "ammap")
            {
                txt = "tool by ";
                width = 125;    
            }			
			
			var bg = AmCharts.rect(_this.container, width, 20, '#FFFFFF', 1);

			var label = AmCharts.text(_this.container, txt + product + ".com", '#000000', 'Verdana', 11, 'start');		
					
			label.translate(7, 9);	
									
			var bbset = _this.container.set([bg, label]);
			
            if(product == "ammap")
            {			
                bbset.translate(_this.realWidth - width, 0);
            }

			_this.bbset = bbset;						
			_this.linkSet.push(bbset);
			bbset.setAttr("cursor", "pointer");
			bbset.click(function(){
				window.location.href = "http://" + url;
			});
			
			for (var j = 0; j < bbset.length; j++)
			{
				bbset[j].attr({cursor:'pointer'});
			}
		}*/
    },


    validateSize: function() {
        var _this = this;
        _this.measure();
        var legend = _this.legend;

        if (_this.realWidth != _this.previousWidth || _this.realHeight != _this.previousHeight) {
            if (_this.realWidth > 0 && _this.realHeight > 0) {
                _this.sizeChanged = true;
                if (legend) {
                    clearTimeout(_this.legendInitTO);
                    var legendInitTO = setTimeout(function() {
                        legend.invalidateSize()
                    }, 100);
                    _this.timeOuts.push(legendInitTO);
                    _this.legendInitTO = legendInitTO;
                }
                _this.marginsUpdated = false;

                clearTimeout(_this.initTO);
                var initTO = setTimeout(function() {
                    _this.initChart()
                }, 150);
                _this.timeOuts.push(initTO);
                _this.initTO = initTO;
            }
        }
        _this.renderFix();
        if (legend) {
            legend.renderFix();
        }
    },

    invalidateSize: function() {
        var _this = this;
        _this.previousWidth = NaN;
        _this.previousHeight = NaN;
        _this.marginsUpdated = false;
        clearTimeout(_this.validateTO);
        var validateTO = setTimeout(function() {
            _this.validateSize()
        }, 5);
        _this.timeOuts.push(validateTO);
        _this.validateTO = validateTO;
    },

    validateData: function(noReset) {
        var _this = this;
        if (_this.chartCreated) {
            _this.dataChanged = true;
            _this.marginsUpdated = false;
            _this.initChart(noReset);
        }
    },

    validateNow: function() {
        var _this = this;
        _this.listenersAdded = false;
        _this.write(_this.div);
    },

    showItem: function(dItem) {
        var _this = this;
        dItem.hidden = false;
        _this.initChart();
    },

    hideItem: function(dItem) {
        var _this = this;
        dItem.hidden = true;
        _this.initChart();
    },

    hideBalloon: function() {
        var _this = this;
        _this.hoverInt = setTimeout(function() {
            _this.hideBalloonReal.call(_this)
        }, 80);
    },

    cleanChart: function() {
        // do not delete          
    },

    hideBalloonReal: function() {
        var balloon = this.balloon;

        if (balloon) {
            balloon.hide();
        }
    },

    showBalloon: function(text, color, follow, x, y) {
        var _this = this;
        clearTimeout(_this.balloonTO);
        _this.balloonTO = setTimeout(function() {
            _this.showBalloonReal.call(_this, text, color, follow, x, y)
        }, 1);
    },

    showBalloonReal: function(text, color, follow, x, y) {
        var _this = this;

        _this.handleMouseMove();

        var balloon = _this.balloon;
        if (balloon.enabled) {
            balloon.followCursor(false);
            balloon.changeColor(color);

            if (!follow) {
                balloon.setPosition(x, y);
            }
            balloon.followCursor(follow);
            if (text) {
                balloon.showBalloon(text);
            }
        }
    },


    // EVENT HANDLERS
    handleTouchMove: function(e) {
        var _this = this;
        _this.hideBalloon();
        var x;
        var y;
        var div = _this.chartDiv;
        if (e.touches) {
            var targetEvent = e.touches.item(0);

            _this.mouseX = targetEvent.pageX - AmCharts.findPosX(div);
            _this.mouseY = targetEvent.pageY - AmCharts.findPosY(div);
        }
    },

    handleMouseOver: function(e) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = true;
    },

    handleMouseOut: function(e) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = false;
    },

    handleMouseMove: function(e) {
        var _this = this;
        if (_this.mouseIsOver) {
            var div = _this.chartDiv;
            if (!e) {
                e = window.event;
            }

            var x;
            var y;

            if (e) {
                switch (_this.mouseMode) {
                    case 1:
                        x = e.clientX - AmCharts.findPosX(div);
                        y = e.clientY - AmCharts.findPosY(div);

                        if (!_this.divIsFixed) {
                            var body = document.body;

                            if (body) {
                                var x1 = body.scrollLeft;
                                var y1 = body.scrollTop;
                            }

                            var documentElement = document.documentElement;
                            if (documentElement) {
                                var x2 = documentElement.scrollLeft;
                                var y2 = documentElement.scrollTop;
                            }

                            var dx = Math.max(x1, x2);
                            var dy = Math.max(y1, y2);

                            x += dx;
                            y += dy;
                        }
                        break;
                    case 3:
                        x = e.pageX - AmCharts.findPosX(div);
                        y = e.pageY - AmCharts.findPosY(div);
                        break;
                    case 0:
                        if (_this.divIsFixed) {
                            x = e.clientX - AmCharts.findPosX(div);
                            y = e.clientY - AmCharts.findPosY(div);
                        } else {
                            x = e.pageX - AmCharts.findPosX(div);
                            y = e.pageY - AmCharts.findPosY(div);
                        }
                        break;
                }

                _this.mouseX = x;
                _this.mouseY = y;
            }
        }

    },

    handleTouchStart: function(e) {
        this.handleMouseDown(e);
    },

    handleTouchEnd: function(e) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(e);
    },

    handleReleaseOutside: function(e) {
        // void
    },

    handleMouseDown: function(e) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = true;

        if (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
    },


    addLegend: function(legend) {
        var _this = this;
        AmCharts.extend(legend, new AmCharts.AmLegend());
        _this.legend = legend;
        legend.chart = this;
        legend.div = _this.legendDiv;
        var handleLegendEvent = _this.handleLegendEvent;

        _this.listenTo(legend, "showItem", handleLegendEvent);
        _this.listenTo(legend, "hideItem", handleLegendEvent);
        _this.listenTo(legend, "clickMarker", handleLegendEvent);
        _this.listenTo(legend, "rollOverItem", handleLegendEvent);
        _this.listenTo(legend, "rollOutItem", handleLegendEvent);
        _this.listenTo(legend, "rollOverMarker", handleLegendEvent);
        _this.listenTo(legend, "rollOutMarker", handleLegendEvent);
        _this.listenTo(legend, "clickLabel", handleLegendEvent);
    },

    removeLegend: function() {
        this.legend = undefined;
        this.legendDiv.innerHTML = "";
    },

    handleResize: function() {
        var _this = this;

        if (AmCharts.isPercents(_this.width) || AmCharts.isPercents(_this.height)) {
            _this.invalidateSize();
        }
        _this.renderFix();
    },

    renderFix: function() {
        if (!AmCharts.VML) {
            var container = this.container;
            if (container) {
                container.renderFix();
            }
        }
    },

    getSVG: function() {
        if (AmCharts.hasSVG) {
            return this.container;
        }
    }

});

// declaring only
AmCharts.Slice = AmCharts.Class({
    construct: function() {}
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function() {}
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function() {}
});
AmCharts.Guide = AmCharts.Class({
    construct: function() {}
});

;
AmCharts.toBoolean = function(str, ifUndefined) {
    if (str == undefined) {
        return ifUndefined;
    }
    switch (String(str).toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(str);
    }
}

AmCharts.removeFromArray = function(arr, el) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == el) {
            arr.splice(i, 1);
            continue;
        }
    }
}

AmCharts.getStyle = function(oElm, strCssRule) {
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    } else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}

AmCharts.removePx = function(value) {
    return Number(value.substring(0, value.length - 2));
},

AmCharts.getURL = function(url, urlTarget) {
    if (url) {
        if (urlTarget == "_self" || !urlTarget) {
            window.location.href = url;
        } else if (urlTarget == "_top" && window.top) {
            window.top.location.href = url;
        } else if (urlTarget == "_parent" && window.parent) {
            window.parent.location.href = url;
        } else {
            var iFrame = document.getElementsByName(urlTarget)[0];

            if (iFrame) {
                iFrame.src = url;
            } else {
                window.open(url);
            }
        }
    }
}

AmCharts.formatMilliseconds = function(string, date) {
    if (string.indexOf("fff") != -1) {
        var milliseconds = date.getMilliseconds();
        var mString = String(milliseconds);
        if (milliseconds < 10) {
            mString = "00" + milliseconds;
        }
        if (milliseconds >= 10 && milliseconds < 100) {
            mString = "0" + milliseconds;
        }

        string = string.replace(/fff/g, mString);
    }

    return string;
}

AmCharts.ifArray = function(arr) {
    if (arr) {
        if (arr.length > 0) {
            return true;
        }
    }
    return false;
}


AmCharts.callMethod = function(method, arr) {
    for (var j = 0; j < arr.length; j++) {
        var object = arr[j];

        if (object) {
            if (object[method]) {
                object[method]();
            }
            var length = object.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var obj = object[i];
                    if (obj) {
                        if (obj[method]) {
                            obj[method]();
                        }
                    }
                }
            }
        }
    }
},


AmCharts.toNumber = function(val) {
    if (typeof(val) == 'number') {
        return val;
    } else {
        return Number(String(val).replace(/[^0-9\-.]+/g, ''));
    }
}

AmCharts.toColor = function(str) {
    if (str != '' && str != undefined) {
        if (str.indexOf(',') != -1) {
            var arr = str.split(',');
            for (var i = 0; i < arr.length; i++) {
                var cc = arr[i].substring(arr[i].length - 6, arr[i].length);
                arr[i] = '#' + cc;
            }
            str = arr;
        } else {
            str = str.substring(str.length - 6, str.length);
            str = '#' + str;
        }
    }
    return str;
},

AmCharts.toCoordinate = function(val, full, full2) {
    var coord;

    if (val != undefined) {
        val = String(val);
        if (full2) {
            if (full2 < full) {
                full = full2;
            }
        }

        coord = Number(val);
        // if there is ! in the beginning, then calculate right or bottom

        if (val.indexOf("!") != -1) {
            coord = full - Number(val.substr(1));
        }
        // if values is set in percents, recalculate to pixels
        if (val.indexOf("%") != -1) {
            coord = full * Number(val.substr(0, val.length - 1)) / 100;
        }
    }
    return coord;
}

AmCharts.fitToBounds = function(number, min, max) {
    if (number < min) {
        number = min;
    }

    if (number > max) {
        number = max;
    }
    return number;
}

AmCharts.isDefined = function(value) {
    if (value == undefined) {
        return false;
    } else {
        return true;
    }
}

AmCharts.stripNumbers = function(str) {
    return str.replace(/[0-9]+/g, '');
}

AmCharts.extractPeriod = function(period) {
    var cleanPeriod = AmCharts.stripNumbers(period);
    var count = 1;
    if (cleanPeriod != period) {
        count = Number(period.slice(0, period.indexOf(cleanPeriod)));
    }
    return {
        period: cleanPeriod,
        count: count
    };
}


// RESET DATE'S LOWER PERIODS TO MIN 
AmCharts.resetDateToMin = function(date, period, count, firstDateOfWeek) {
    if (firstDateOfWeek == undefined) {
        firstDateOfWeek = 1;
    }

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    var week_day = date.getDay();

    switch (period) {
        case "YYYY":
            year = Math.floor(year / count) * count;
            month = 0;
            day = 1;
            hours = 0;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            break;

        case "MM":
            month = Math.floor(month / count) * count;
            day = 1;
            hours = 0;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            break;

        case "WW":
            if (week_day == 0 && firstDateOfWeek > 0) {
                week_day = 7;
            }
            day = day - week_day + firstDateOfWeek;
            hours = 0;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            break;

        case "DD":
            day = Math.floor(day / count) * count;
            hours = 0;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            break;

        case "hh":
            hours = Math.floor(hours / count) * count;
            minutes = 0;
            seconds = 0;
            milliseconds = 0;
            break;

        case "mm":
            minutes = Math.floor(minutes / count) * count;
            seconds = 0;
            milliseconds = 0;
            break;

        case "ss":
            seconds = Math.floor(seconds / count) * count;
            milliseconds = 0;
            break;

        case "fff":
            milliseconds = Math.floor(milliseconds / count) * count;
            break;
    }
    date = new Date(year, month, day, hours, minutes, seconds, milliseconds)

    return date;
}

AmCharts.getPeriodDuration = function(period, count) {
    if (count == undefined) {
        count = 1;
    }
    var duration;
    switch (period) {
        case "YYYY":
            duration = 31622400000;
            break;

        case "MM":
            duration = 2678400000;
            break;

        case "WW":
            duration = 604800000;
            break;

        case "DD":
            duration = 86400000;
            break;

        case "hh":
            duration = 3600000;
            break;

        case "mm":
            duration = 60000;
            break;

        case "ss":
            duration = 1000;
            break;

        case "fff":
            duration = 1;
            break;
    }
    return duration * count;
}

AmCharts.roundTo = function(num, precision) {
    if (precision < 0) {
        return num;
    } else {
        var d = Math.pow(10, precision);
        return Math.round(num * d) / d;
    }
}

AmCharts.toFixed = function(number, precision) {
    var num = String(Math.round(number * Math.pow(10, precision)));

    if (precision > 0) {
        var length = num.length;

        if (length < precision) {
            for (var i = 0; i < precision - length; i++) {
                num = "0" + num;
            }
        }

        var base = num.substring(0, num.length - precision);
        if (base == "") {
            base = 0;
        }
        return base + "." + num.substring(num.length - precision, num.length);
    } else {
        return String(num);
    }
}

AmCharts.intervals = {
    s: {
        nextInterval: "ss",
        contains: 1000
    },
    ss: {
        nextInterval: "mm",
        contains: 60,
        count: 0
    },
    mm: {
        nextInterval: "hh",
        contains: 60,
        count: 1
    },
    hh: {
        nextInterval: "DD",
        contains: 24,
        count: 2
    },
    DD: {
        nextInterval: "",
        contains: Infinity,
        count: 3
    }
}

AmCharts.getMaxInterval = function(duration, interval) {
    var intervals = AmCharts.intervals;
    if (duration >= intervals[interval].contains) {
        duration = Math.round(duration / intervals[interval].contains);
        interval = intervals[interval].nextInterval;

        return AmCharts.getMaxInterval(duration, interval);
    } else {
        if (interval == "ss") {
            return intervals[interval].nextInterval;
        } else {
            return interval;
        }
    }
}

AmCharts.formatDuration = function(duration, interval, result, units, maxInterval, numberFormat) {
    var intervals = AmCharts.intervals;
    var decimalSeparator = numberFormat.decimalSeparator;
    if (duration >= intervals[interval].contains) {
        var value = duration - Math.floor(duration / intervals[interval].contains) * intervals[interval].contains;

        if (interval == "ss") {
            value = AmCharts.formatNumber(value, numberFormat);
            if (value.split(decimalSeparator)[0].length == 1) {
                value = "0" + value;
            }
        }

        if ((interval == "mm" || interval == "hh") && value < 10) {
            value = "0" + value;
        }

        result = value + "" + units[interval] + "" + result;

        duration = Math.floor(duration / intervals[interval].contains);
        interval = intervals[interval].nextInterval;

        return AmCharts.formatDuration(duration, interval, result, units, maxInterval, numberFormat);
    } else {
        if (interval == "ss") {
            duration = AmCharts.formatNumber(duration, numberFormat);

            if (duration.split(decimalSeparator)[0].length == 1) {
                duration = "0" + duration;
            }
        }

        if ((interval == "mm" || interval == "hh") && duration < 10) {
            duration = "0" + duration;
        }

        result = duration + "" + units[interval] + "" + result;

        if (intervals[maxInterval].count > intervals[interval].count) {
            for (var i = intervals[interval].count; i < intervals[maxInterval].count; i++) {
                interval = intervals[interval].nextInterval;

                if (interval == "ss" || interval == "mm" || interval == "hh") {
                    result = "00" + units[interval] + "" + result;
                } else if (interval == "DD") {
                    result = "0" + units[interval] + "" + result;
                }
            }
        }
        if (result.charAt(result.length - 1) == ":") {
            result = result.substring(0, result.length - 1);
        }
        return result;
    }
}


AmCharts.formatNumber = function(num, format, zeroCount, addPlus, addPercents) {
    num = AmCharts.roundTo(num, format.precision);


    if (isNaN(zeroCount)) {
        zeroCount = format.precision;
    }

    var dSep = format.decimalSeparator;
    var tSep = format.thousandsSeparator;

    // check if negative
    if (num < 0) {
        var negative = "-";
    } else {
        var negative = "";
    }

    num = Math.abs(num);

    var numStr = String(num);

    var exp = false;

    if (numStr.indexOf('e') != -1) {
        exp = true;
    }

    if (zeroCount >= 0 && num != 0 && !exp) {
        numStr = AmCharts.toFixed(num, zeroCount);
    }

    if (!exp) {
        var array = numStr.split(".");
        var formated = "";

        var string = String(array[0]);

        for (var i = string.length; i >= 0; i = i - 3) {
            if (i != string.length) {
                if (i != 0) {
                    formated = string.substring(i - 3, i) + tSep + formated;
                } else {
                    formated = string.substring(i - 3, i) + formated;
                }
            } else {
                formated = string.substring(i - 3, i);
            }
        }

        if (array[1] != undefined) {
            formated = formated + dSep + array[1];
        }
        if (zeroCount != undefined && zeroCount > 0 && formated != "0") {
            formated = AmCharts.addZeroes(formated, dSep, zeroCount);
        }
    } else {
        formated = numStr;
    }

    formated = negative + formated;

    if (negative == "" && addPlus == true && num != 0) {
        formated = "+" + formated;
    }

    if (addPercents == true) {
        formated = formated + "%";
    }

    return (formated);
}

AmCharts.addZeroes = function(number, dSep, count) {
    var array = number.split(dSep);

    if (array[1] == undefined && count > 0) {
        array[1] = "0";
    }
    if (array[1].length < count) {
        array[1] = array[1] + "0";
        return AmCharts.addZeroes(array[0] + dSep + array[1], dSep, count);
    } else {
        if (array[1] != undefined) {
            return array[0] + dSep + array[1];
        } else {
            return array[0];
        }
    }
}

AmCharts.scientificToNormal = function(num) {
    var str = String(num);
    var newNumber;
    var arr = str.split("e");
    // small numbers
    if (arr[1].substr(0, 1) == "-") {
        newNumber = "0.";
        for (var i = 0; i < Math.abs(Number(arr[1])) - 1; i++) {
            newNumber += "0";
        }
        newNumber += arr[0].split(".").join("");
    } else {
        var digitsAfterDec = 0;
        var tmp = arr[0].split(".");
        if (tmp[1]) {
            digitsAfterDec = tmp[1].length;
        }

        newNumber = arr[0].split(".").join("");

        for (var i = 0; i < Math.abs(Number(arr[1])) - digitsAfterDec; i++) {
            newNumber += "0";
        }
    }
    return newNumber;
}


AmCharts.toScientific = function(num, dSep) {
    if (num == 0) {
        return "0";
    }
    var exponent = Math.floor(Math.log(Math.abs(num)) * Math.LOG10E);
    var tenToPower = Math.pow(10, exponent);
    mantissa = String(mantissa).split(".").join(dSep);
    return String(mantissa) + "e" + exponent;
}


AmCharts.randomColor = function() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6)
}

AmCharts.hitTest = function(bbox1, bbox2, abort) {
    var hit = false;

    var x1 = bbox1.x;
    var x2 = bbox1.x + bbox1.width;
    var y1 = bbox1.y;
    var y2 = bbox1.y + bbox1.height;
    var isInRectangle = AmCharts.isInRectangle;

    if (!hit) {
        hit = isInRectangle(x1, y1, bbox2);
    }
    if (!hit) {
        hit = isInRectangle(x1, y2, bbox2);
    }
    if (!hit) {
        hit = isInRectangle(x2, y1, bbox2);
    }
    if (!hit) {
        hit = isInRectangle(x2, y2, bbox2);
    }
    if (!hit && abort != true) {
        hit = AmCharts.hitTest(bbox2, bbox1, true);
    }
    return hit;
}

AmCharts.isInRectangle = function(x, y, box) {
    if (x >= box.x - 5 && x <= box.x + box.width + 5 && y >= box.y - 5 && y <= box.y + box.height + 5) {
        return true;
    } else {
        return false;
    }
}

AmCharts.isPercents = function(s) {
    if (String(s).indexOf("%") != -1) {
        return true;
    }
}

AmCharts.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
AmCharts.shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

AmCharts.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
AmCharts.shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

AmCharts.formatDate = function(d, f) {
    var year;
    var month;
    var date;
    var day;
    var hours;
    var minutes;
    var seconds;
    var milliseconds;

    if (AmCharts.useUTC) {
        year = d.getUTCFullYear();
        month = d.getUTCMonth();
        date = d.getUTCDate();
        day = d.getUTCDay();
        hours = d.getUTCHours();
        minutes = d.getUTCMinutes();
        seconds = d.getUTCSeconds();
        milliseconds = d.getUTCMilliseconds();
    } else {
        year = d.getFullYear();
        month = d.getMonth();
        date = d.getDate();
        day = d.getDay();
        hours = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();
        milliseconds = d.getMilliseconds();
    }


    var shortYear = String(year).substr(2, 2);
    var monthStr = month + 1;

    if (month < 9) {
        monthStr = "0" + monthStr;
    }

    var dateStr = date;
    if (date < 10) {
        dateStr = "0" + date;
    }

    var dayStr = "0" + day;

    // HOURS

    var jhours = hours;
    if (jhours == 24) {
        jhours = 0;
    }
    var jjhours = jhours;
    if (jjhours < 10) {
        jjhours = "0" + jjhours;
    }

    f = f.replace(/JJ/g, jjhours);
    f = f.replace(/J/g, jhours);

    var hhours = hours;
    if (hhours == 0) {
        hhours = 24;
    }
    var hhhours = hhours;
    if (hhhours < 10) {
        hhhours = "0" + hhhours;
    }
    f = f.replace(/HH/g, hhhours);
    f = f.replace(/H/g, hhours);

    var khours = hours;
    if (khours > 11) {
        khours -= 12;
    }
    var kkhours = khours;
    if (kkhours < 10) {
        kkhours = "0" + kkhours;
    }
    f = f.replace(/KK/g, kkhours);
    f = f.replace(/K/g, khours);


    var lhours = hours;
    if (lhours == 0) {
        lhours = 12;
    }

    if (lhours > 12) {
        lhours -= 12;
    }
    var llhours = lhours;
    if (llhours < 10) {
        llhours = "0" + llhours;
    }
    f = f.replace(/LL/g, llhours);
    f = f.replace(/L/g, lhours);

    // MINUTES	
    var nnminutes = minutes;
    if (nnminutes < 10) {
        nnminutes = "0" + nnminutes;
    }
    f = f.replace(/NN/g, nnminutes);
    f = f.replace(/N/g, minutes);

    var ssseconds = seconds;
    if (ssseconds < 10) {
        ssseconds = "0" + ssseconds;
    }
    f = f.replace(/SS/g, ssseconds);
    f = f.replace(/S/g, seconds);


    var qqqms = milliseconds;
    if (qqqms < 10) {
        qqqms = "00" + qqqms;
    }
    if (qqqms < 100) {
        qqqms = "0" + qqqms;
    }

    var qqms = milliseconds;
    if (qqms < 10) {
        qqms = "00" + qqms;
    }

    f = f.replace(/QQQ/g, qqqms);
    f = f.replace(/QQ/g, qqms);
    f = f.replace(/Q/g, milliseconds);

    if (hours < 12) {
        f = f.replace(/A/g, "am");
    } else {
        f = f.replace(/A/g, "pm");
    }


    f = f.replace(/YYYY/g, '@IIII@');
    f = f.replace(/YY/g, '@II@');

    f = f.replace(/MMMM/g, '@XXXX@');
    f = f.replace(/MMM/g, '@XXX@');
    f = f.replace(/MM/g, '@XX@');
    f = f.replace(/M/g, '@X@');

    f = f.replace(/DD/g, '@RR@');
    f = f.replace(/D/g, '@R@');

    f = f.replace(/EEEE/g, '@PPPP@');
    f = f.replace(/EEE/g, '@PPP@');
    f = f.replace(/EE/g, '@PP@');
    f = f.replace(/E/g, '@P@');

    f = f.replace(/@IIII@/g, year);
    f = f.replace(/@II@/g, shortYear);

    f = f.replace(/@XXXX@/g, AmCharts.monthNames[month]);
    f = f.replace(/@XXX@/g, AmCharts.shortMonthNames[month]);
    f = f.replace(/@XX@/g, monthStr);
    f = f.replace(/@X@/g, (month + 1));

    f = f.replace(/@RR@/g, dateStr);
    f = f.replace(/@R@/g, date);

    f = f.replace(/@PPPP@/g, AmCharts.dayNames[day]);
    f = f.replace(/@PPP@/g, AmCharts.shortDayNames[day]);
    f = f.replace(/@PP@/g, dayStr);
    f = f.replace(/@P@/g, day);

    return f;
}

AmCharts.findPosX = function(obj) {
    var pos = obj.offsetLeft;

    if (obj.offsetParent) {
        while ((obj = obj.offsetParent)) {
            pos += obj.offsetLeft;
            if (obj != document.body && obj != document.documentElement) {
                pos -= obj.scrollLeft;
            }
        }
    }
    return pos;
}

AmCharts.findPosY = function(obj) {
    var pos = obj.offsetTop;

    if (obj.offsetParent) {
        while ((obj = obj.offsetParent)) {
            pos += obj.offsetTop;
            if (obj != document.body && obj != document.documentElement) {
                pos -= obj.scrollTop;
            }
        }
    }

    return pos;
}

AmCharts.findIfFixed = function(obj) {
    if (obj.offsetParent) {
        while ((obj = obj.offsetParent)) {
            if (AmCharts.getStyle(obj, "position") == "fixed") {
                return true;
            }
        }
    }
    return false;
}

AmCharts.findIfAuto = function(obj) {
    if (obj.style) {
        if (AmCharts.getStyle(obj, "overflow") == "auto") {
            return true;
        }
    }
    if (obj.parentNode) {
        return AmCharts.findIfAuto(obj.parentNode);
    }

    return false;
}

AmCharts.findScrollLeft = function(obj, value) {
    if (obj.scrollLeft) {
        value += obj.scrollLeft;
    }
    if (obj.parentNode) {
        return AmCharts.findScrollLeft(obj.parentNode, value);
    }

    return value;
}

AmCharts.findScrollTop = function(obj, value) {
    if (obj.scrollTop) {
        value += obj.scrollTop;
    }
    if (obj.parentNode) {
        return AmCharts.findScrollTop(obj.parentNode, value);
    }

    return value;
}

AmCharts.formatValue = function(string, data, keys, numberFormatter, addString, usePrefixes, prefixesSmall, prefixesBig) {
    if (data) {
        if (addString == undefined) {
            addString = "";
        }
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            if (value != undefined) {
                if (isNaN(value)) {
                    value = 0;
                }
                var stringValue;
                if (usePrefixes) {
                    stringValue = AmCharts.addPrefix(value, prefixesBig, prefixesSmall, numberFormatter);
                } else {
                    stringValue = AmCharts.formatNumber(value, numberFormatter);
                }
                var regExp = new RegExp("\\[\\[" + addString + "" + key + "\\]\\]", "g");
                string = string.replace(regExp, stringValue);
            }
        }
    }
    return string;
}

AmCharts.formatDataContextValue = function(string, data) {
    if (string) {
        var items = string.match(/\[\[.*?\]\]/g);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var pureItem = item.substr(2, item.length - 4);

            if (data[pureItem] != undefined) {
                var regExp = new RegExp("\\[\\[" + pureItem + "\\]\\]", "g");
                string = string.replace(regExp, data[pureItem]);
            }
        }
    }
    return string;
}

AmCharts.massReplace = function(string, replObj) {
    for (var key in replObj) {
        var value = replObj[key];
        if (value == undefined) {
            value = "";
        }
        string = string.replace(key, value);
    }

    return string;
}

AmCharts.cleanFromEmpty = function(str) {
    return str.replace(/\[\[[^\]]*\]\]/g, "");
}

AmCharts.addPrefix = function(value, prefixesOfBigNumbers, prefixesOfSmallNumbers, numberFormat) {
    var str = AmCharts.formatNumber(value, numberFormat);
    var sign = "";
    var c;
    var newVal;
    var prec;

    if (value == 0) {
        return "0";
    }

    if (value < 0) {
        sign = "-";
    }

    value = Math.abs(value);

    if (value > 1) {
        for (c = prefixesOfBigNumbers.length - 1; c > -1; c--) {
            if (value >= prefixesOfBigNumbers[c].number) {
                newVal = value / prefixesOfBigNumbers[c].number;

                prec = Number(numberFormat.precision);

                if (prec < 1) {
                    prec = 1;
                }

                newVal = AmCharts.roundTo(newVal, prec);

                str = sign + "" + newVal + "" + prefixesOfBigNumbers[c].prefix;
                break;
            }
        }
    } else {
        for (c = 0; c < prefixesOfSmallNumbers.length; c++) {
            if (value <= prefixesOfSmallNumbers[c].number) {
                newVal = value / prefixesOfSmallNumbers[c].number;

                prec = Math.abs(Math.round(Math.log(newVal) * Math.LOG10E));
                newVal = AmCharts.roundTo(newVal, prec);

                str = sign + "" + newVal + "" + prefixesOfSmallNumbers[c].prefix;
                break;
            }
        }
    }
    return str;
}


AmCharts.remove = function(obj) {
    if (obj) {
        obj.remove();
    }
}

AmCharts.copyProperties = function(fromObject, toObject) {
    for (var i in fromObject) {
        if (i != "events" && fromObject[i] != undefined && typeof(fromObject[i]) != "function") {
            toObject[i] = fromObject[i];
        }
    }
}


AmCharts.recommended = function() {
    var recommended = "js";
    var svg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
    if (!svg) {
        if (swfobject) {
            if (swfobject.hasFlashPlayerVersion("8")) {
                recommended = "flash";
            }
        }
    }
    return recommended;
}

AmCharts.getEffect = function(val) {
    if (val == ">") {
        val = "easeOutSine";
    }
    if (val == "<") {
        val = "easeInSine";
    }
    if (val == "elastic") {
        val = "easeOutElastic";
    }
    return val;
}

AmCharts.extend = function(obj1, obj2) {
    for (var i in obj2) {
        if (obj1[i] == undefined) {
            obj1[i] = obj2[i];
        }
    }
}

AmCharts.fixNewLines = function(text) {
    if (AmCharts.IEversion < 9 && AmCharts.IEversion > 0) {
        text = AmCharts.massReplace(text, {
            "\n": "\r"
        });
    }
    return text;
}

/**
 * @description 将字符串根据中英文进行处理，大于20的英文最多 显示20个加"..."，中文是多为10个加"..."
 * @param {string} text 需要处理的字符串
 * @returns {string} 返回处理后的字符
 */
AmCharts.fixTxet = function(text) {
    var tempTxt = text;
    var maxTxetCount_en = 20;
    var maxTextCount_zh = 10;
    var strSuffix = '...';

    //判断字符串的中英文
    function isChineseStr(str) {
        if (escape(str).indexOf("%u") != -1) {
            return true;
        }
        return false;
    };

    //判断字符串的中英文
    if (text && text !== "") {
        if (!isChineseStr(text)) {
            if (text.length > maxTxetCount_en) {
                tempTxt = text.substr(0, maxTxetCount_en) + strSuffix;
            }
        } else {
            if (text.length > maxTextCount_zh) {
                tempTxt = text.substr(0, maxTextCount_zh) + strSuffix;
            }
        }
    }
    return tempTxt;
};;
AmCharts.Bezier = AmCharts.Class({
    construct: function(container, x, y, color, alpha, thickness, fillColor, fillAlpha, dashLength, endStr) {
        var _this = this;

        if (typeof(fillColor) == 'object') {
            fillColor = fillColor[0];
        }
        if (typeof(fillAlpha) == 'object') {
            fillAlpha = fillAlpha[0];
        }

        var attr = {
            'fill': fillColor,
            'fill-opacity': fillAlpha,
            'stroke-width': thickness
        };

        if (dashLength != undefined && dashLength > 0) {
            attr['stroke-dasharray'] = dashLength;
        }

        if (!isNaN(alpha)) {
            attr['stroke-opacity'] = alpha;
        }

        if (color) {
            attr['stroke'] = color;
        }

        var letter = "L";
        var lineStr = "M" + Math.round(x[0]) + "," + Math.round(y[0]);
        var points = [];

        for (var i = 0; i < x.length; i++) {
            points.push({
                x: Number(x[i]),
                y: Number(y[i])
            });
        }

        if (points.length > 1) {
            var interpolatedPoints = _this.interpolate(points);
            lineStr += _this.drawBeziers(interpolatedPoints);
        }

        if (endStr) {
            lineStr += endStr;
        } else {
            if (!AmCharts.VML) {
                // end string is to create area
                // this is the fix to solve straight line in chrome problem
                lineStr += "M0,0 L0,0";
            }
        }

        _this.path = container.path(lineStr).attr(attr);
    },


    interpolate: function(points) {
        var interpolatedPoints = [];
        interpolatedPoints.push({
            x: points[0].x,
            y: points[0].y
        });

        var slope_x = points[1].x - points[0].x;
        var slope_y = points[1].y - points[0].y;

        var dal_x = AmCharts.bezierX;
        var dal_y = AmCharts.bezierY;

        interpolatedPoints.push({
            x: points[0].x + slope_x / dal_x,
            y: points[0].y + slope_y / dal_y
        });

        for (var i = 1; i < points.length - 1; i++) {
            var point1 = points[i - 1];
            var point2 = points[i];
            var point3 = points[i + 1];

            slope_x = point3.x - point2.x;
            slope_y = point3.y - point1.y;

            var slope_x0 = point2.x - point1.x;

            if (slope_x0 > slope_x) {
                slope_x0 = slope_x;
            }

            interpolatedPoints.push({
                x: point2.x - slope_x0 / dal_x,
                y: point2.y - slope_y / dal_y
            });
            interpolatedPoints.push({
                x: point2.x,
                y: point2.y
            });
            interpolatedPoints.push({
                x: point2.x + slope_x0 / dal_x,
                y: point2.y + slope_y / dal_y
            });
        }

        slope_y = points[points.length - 1].y - points[points.length - 2].y;
        slope_x = points[points.length - 1].x - points[points.length - 2].x;

        interpolatedPoints.push({
            x: points[points.length - 1].x - slope_x / dal_x,
            y: points[points.length - 1].y - slope_y / dal_y
        });
        interpolatedPoints.push({
            x: points[points.length - 1].x,
            y: points[points.length - 1].y
        });

        return interpolatedPoints;
    },

    drawBeziers: function(interpolatedPoints) {
        var str = "";
        for (var j = 0; j < (interpolatedPoints.length - 1) / 3; j++) {
            str += this.drawBezierMidpoint(interpolatedPoints[3 * j], interpolatedPoints[3 * j + 1], interpolatedPoints[3 * j + 2], interpolatedPoints[3 * j + 3]);
        }
        return str;
    },


    drawBezierMidpoint: function(P0, P1, P2, P3) {
        var round = Math.round;
        // calculates the useful base points
        var PA = this.getPointOnSegment(P0, P1, 3 / 4);
        var PB = this.getPointOnSegment(P3, P2, 3 / 4);

        // get 1/16 of the [P3, P0] segment
        var dx = (P3.x - P0.x) / 16;
        var dy = (P3.y - P0.y) / 16;

        // calculates control point 1
        var Pc_1 = this.getPointOnSegment(P0, P1, 3 / 8);

        // calculates control point 2
        var Pc_2 = this.getPointOnSegment(PA, PB, 3 / 8);
        Pc_2.x -= dx;
        Pc_2.y -= dy;

        // calculates control point 3
        var Pc_3 = this.getPointOnSegment(PB, PA, 3 / 8);
        Pc_3.x += dx;
        Pc_3.y += dy;

        // calculates control point 4
        var Pc_4 = this.getPointOnSegment(P3, P2, 3 / 8);

        // calculates the 3 anchor points
        var Pa_1 = this.getMiddle(Pc_1, Pc_2);
        var Pa_2 = this.getMiddle(PA, PB);
        var Pa_3 = this.getMiddle(Pc_3, Pc_4);

        // draw the four quadratic subsegments
        var comma = ",";

        var str = " Q" + round(Pc_1.x) + comma + round(Pc_1.y) + comma + round(Pa_1.x) + comma + round(Pa_1.y);
        str += " Q" + round(Pc_2.x) + comma + round(Pc_2.y) + comma + round(Pa_2.x) + comma + round(Pa_2.y);
        str += " Q" + round(Pc_3.x) + comma + round(Pc_3.y) + comma + round(Pa_3.x) + comma + round(Pa_3.y);
        str += " Q" + round(Pc_4.x) + comma + round(Pc_4.y) + comma + round(P3.x) + comma + round(P3.y);

        return str;
    },


    getMiddle: function(P0, P1) {
        var point = {
            x: (P0.x + P1.x) / 2,
            y: (P0.y + P1.y) / 2
        };
        return point;
    },

    getPointOnSegment: function(P0, P1, ratio) {
        var point = {
            x: P0.x + (P1.x - P0.x) * ratio,
            y: P0.y + (P1.y - P0.y) * ratio
        };
        return point;
    }

});;
AmCharts.Cuboid = AmCharts.Class({
    construct: function(container, width, height, dx, dy, colors, alpha, bwidth, bcolor, balpha, gradientRotation, cornerRadius, rotate) {
        var _this = this;
        _this.set = container.set();
        _this.container = container
        _this.h = Math.round(height);
        _this.w = Math.round(width);
        _this.dx = dx;
        _this.dy = dy;
        _this.colors = colors;
        _this.alpha = alpha;
        _this.bwidth = bwidth;
        _this.bcolor = bcolor;
        _this.balpha = balpha;
        _this.colors = colors;

        if (rotate) {
            if (width < 0 && gradientRotation == 0) {
                gradientRotation = 180;
            }
        } else {
            if (height < 0) {
                if (gradientRotation == 270) {
                    gradientRotation = 90;
                }
            }
        }
        _this.gradientRotation = gradientRotation;

        if (dx == 0 && dy == 0) {
            _this.cornerRadius = cornerRadius;
        }
        _this.draw();
    },

    draw: function() {
        var _this = this;
        var set = _this.set;
        set.clear();

        var container = _this.container;
        var deltaY = 0;

        var w = _this.w;
        var h = _this.h;
        var dx = _this.dx;
        var dy = _this.dy;
        var colors = _this.colors;
        var alpha = _this.alpha;
        var bwidth = _this.bwidth;
        var bcolor = _this.bcolor;
        var balpha = _this.balpha;
        var gradientRotation = _this.gradientRotation;
        var cornerRadius = _this.cornerRadius;

        // bot
        var firstColor = colors;
        var lastColor = colors;

        if (typeof(colors) == "object") {
            firstColor = colors[0];
            lastColor = colors[colors.length - 1];
        }


        // if dx or dx > 0, draw other sides		
        if (dx > 0 || dy > 0) {

            var bc = lastColor;
            var ccc = AmCharts.adjustLuminosity(firstColor, -0.2);
            var tc = firstColor;
            var ta = alpha;

            var ccc = AmCharts.adjustLuminosity(tc, -0.2);
            var bottom = AmCharts.polygon(container, [0, dx, w + dx, w, 0], [0, dy, dy, 0, 0], ccc, alpha, 0, 0, 0, gradientRotation);

            if (balpha > 0) {
                var bottomBorders = AmCharts.line(container, [0, dx, w + dx], [0, dy, dy], bcolor, balpha, bwidth);
            }

            //if(Math.abs(h) > 0 && Math.abs(w) > 0)
            //{		
            // back			
            var back = AmCharts.polygon(container, [0, 0, w, w, 0], [0, h, h, 0, 0], ccc, alpha, 0, 0, 0, 0, gradientRotation);
            back.translate(dx, dy);

            // back borders
            if (balpha > 0) {
                var backBorders = AmCharts.line(container, [dx, dx], [dy, dy + h], bcolor, 1, bwidth);
            }

            // left side
            var lside = AmCharts.polygon(container, [0, 0, dx, dx, 0], [0, h, h + dy, dy, 0], ccc, alpha, 0, 0, 0, gradientRotation);

            // right side
            var rside = AmCharts.polygon(container, [w, w, w + dx, w + dx, w], [0, h, h + dy, dy, 0], ccc, alpha, 0, 0, 0, gradientRotation);

            // right side borders
            if (balpha > 0) {
                var rsideBorders = AmCharts.line(container, [w, w + dx, w + dx, w], [0, dy, h + dy, h], bcolor, balpha, bwidth);
            }
            //}

            var ccc = AmCharts.adjustLuminosity(bc, 0.2);
            var top = AmCharts.polygon(container, [0, dx, w + dx, w, 0], [h, h + dy, h + dy, h, h], ccc, alpha, 0, 0, 0, gradientRotation);

            // bot borders
            if (balpha > 0) {
                var topBorders = AmCharts.line(container, [0, dx, w + dx], [h, h + dy, h + dy], bcolor, balpha, bwidth);
            }
        }

        if (Math.abs(h) < 1) {
            h = 0;
        }

        if (Math.abs(w) < 1) {
            w = 0;
        }

        var front;
        if (h == 0) {
            front = AmCharts.line(container, [0, w], [0, 0], firstColor, balpha, bwidth);
        } else if (w == 0) {
            front = AmCharts.line(container, [0, 0], [0, h], firstColor, balpha, bwidth);
        } else {
            if (cornerRadius > 0) {
                front = AmCharts.rect(container, w, h, colors, alpha, bwidth, bcolor, balpha, cornerRadius, gradientRotation);
            } else {
                front = AmCharts.polygon(container, [0, 0, w, w, 0], [0, h, h, 0, 0], colors, alpha, bwidth, bcolor, balpha, gradientRotation);
            }
        }

        var elements;
        if (h < 0) {
            elements = [bottom, bottomBorders, back, backBorders, lside, rside, rsideBorders, top, topBorders, front];
        } else {
            elements = [top, topBorders, back, backBorders, lside, rside, bottom, bottomBorders, rsideBorders, front];
        }

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el) {
                set.push(el);
            }
        }
    },

    width: function(v) {
        var _this = this;
        _this.w = v;
        _this.draw();
    },

    height: function(v) {
        var _this = this;
        _this.h = v;
        _this.draw();
    },

    animateHeight: function(duration, easingFunction) {
        var _this = this;
        _this.easing = easingFunction;
        _this.totalFrames = 1000 * duration / AmCharts.updateRate;
        _this.rh = _this.h;
        _this.frame = 0;
        _this.height(1);
        setTimeout(function() {
            _this.updateHeight.call(_this)
        }, AmCharts.updateRate)
    },

    updateHeight: function() {
        var _this = this;
        _this.frame++;
        var totalFrames = _this.totalFrames;

        if (_this.frame <= totalFrames) {
            var value = _this.easing(0, _this.frame, 1, _this.rh - 1, totalFrames);
            _this.height(value);
            setTimeout(function() {
                _this.updateHeight.call(_this)
            }, AmCharts.updateRate)
        }
    },

    animateWidth: function(duration, easingFunction) {
        var _this = this;
        _this.easing = easingFunction;
        _this.totalFrames = 1000 * duration / AmCharts.updateRate;
        _this.rw = _this.w;
        _this.frame = 0;
        _this.width(1);
        setTimeout(function() {
            _this.updateWidth.call(_this)
        }, AmCharts.updateRate)
    },

    updateWidth: function() {
        var _this = this;
        _this.frame++;
        var totalFrames = _this.totalFrames;

        if (_this.frame <= totalFrames) {
            var value = _this.easing(0, _this.frame, 1, _this.rw - 1, totalFrames);
            _this.width(value);
            setTimeout(function() {
                _this.updateWidth.call(_this)
            }, AmCharts.updateRate)
        }
    }

});;
AmCharts.AmLegend = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.createEvents('rollOverMarker', 'rollOverItem', 'rollOutMarker', 'rollOutItem', 'showItem', 'hideItem', 'clickMarker', 'rollOverItem', 'rollOutItem', 'clickLabel');
        _this.position = "bottom";
        _this.color = "#000000";
        _this.borderColor = '#000000';
        _this.borderAlpha = 0;
        _this.markerLabelGap = 5;
        _this.verticalGap = 5;
        _this.align = "left";
        _this.horizontalGap = 0;
        _this.spacing = 10;
        _this.markerDisabledColor = "#AAB3B3";
        _this.markerType = "square";
        _this.markerSize = 16;
        _this.markerBorderAlpha;
        _this.markerBorderThickness = 1;
        _this.marginTop = 0;
        _this.marginBottom = 0;
        _this.marginRight = 20;
        _this.marginLeft = 20;
        _this.autoMargins = true;
        _this.valueWidth = 50;
        _this.switchable = true;
        _this.switchType = "x";
        _this.switchColor = "#FFFFFF";
        _this.rollOverColor = "#CC0000";
        _this.selectedColor;
        _this.reversedOrder = false;
        _this.labelText = "[[title]]";
        _this.valueText = "[[value]]";
        _this.useMarkerColorForLabels = false;
        _this.rollOverGraphAlpha = 1;
        _this.textClickEnabled = false;
        _this.equalWidths = true;
        _this.dateFormat = "DD-MM-YYYY";
        _this.backgroundColor = "#FFFFFF";
        _this.backgroundAlpha = 0;
        _this.ly;
        _this.lx;
        _this.showEntries = true;
        //标志是那类图使用此图例
        _this.graphType = "line";
        _this.maxLegendTextEN = 20;
        _this.maxLegendTextZH = 10;

        _this.maxHeight = null;
        _this.isScroll = false;
    },

    setData: function(data) {
        var _this = this;
        _this.data = data;
        _this.invalidateSize();
    },

    invalidateSize: function() {
        var _this = this;
        _this.destroy();
        _this.entries = [];
        _this.valueLabels = [];
        var data = _this.data;
        if (AmCharts.ifArray(data)) {
            _this.drawLegend();
        }
    },

    drawLegend: function() {
        var _this = this;
        var chart = _this.chart;
        var position = _this.position;
        var width = _this.width;

        var realWidth = chart.divRealWidth;
        var realHeight = chart.divRealHeight;
        var div = _this.div;
        var data = _this.data;

        if (isNaN(_this.fontSize)) {
            _this.fontSize = chart.fontSize;
        }

        if (position == "right" || position == "left") {
            _this.maxColumns = 1;
            _this.marginRight = 10;
            _this.marginLeft = 10;
        } else {
            if (_this.autoMargins) {
                _this.marginRight = chart.marginRight;
                _this.marginLeft = chart.marginLeft;
                var autoMarginOffset = chart.autoMarginOffset;
                if (position == "bottom") {
                    _this.marginBottom = autoMarginOffset;
                    _this.marginTop = 0;
                } else {
                    _this.marginTop = autoMarginOffset;
                    _this.marginBottom = 0;
                }
            }
        }

        var divWidth;

        if (width != undefined) {
            divWidth = AmCharts.toCoordinate(width, realWidth);
        } else {
            divWidth = chart.realWidth < realWidth ? realWidth : chart.realWidth;
        }
        _this.divWidth = divWidth;
        div.style.width = divWidth + "px";
        _this.container = new AmCharts.AmDraw(div, divWidth, realHeight);

        _this.lx = 0;
        _this.ly = 8;

        var markerSize = _this.markerSize;

        if (markerSize > _this.fontSize) {
            _this.ly = markerSize / 2 - 1;
        }


        if (markerSize > 0) {
            _this.lx += markerSize + _this.markerLabelGap;
        }

        _this.titleWidth = 0;
        var title = this.title;
        if (title) {
            var label = AmCharts.text(_this.container, title, _this.color, chart.fontFamily, _this.fontSize, 'start', true);
            label.translate(0, _this.marginTop + _this.verticalGap + _this.ly + 1);
            var titleBBox = label.getBBox();
            _this.titleWidth = titleBBox.width + 15;
            _this.titleHeight = titleBBox.height + 6;
        }

        _this.maxLabelWidth = 0;

        _this.index = 0;

        if (_this.showEntries) {
            for (var i = 0; i < data.length; i++) {
                _this.createEntry(data[i]);
            }

            _this.index = 0;

            for (var i = 0; i < data.length; i++) {
                _this.createValue(data[i]);
            }
        }
        _this.arrangeEntries();
        _this.updateValues();
    },

    arrangeEntries: function() {
        var _this = this;
        var position = _this.position;
        var marginLeft = _this.marginLeft + _this.titleWidth;
        var marginRight = _this.marginRight;
        var marginTop = _this.marginTop;
        var marginBottom = _this.marginBottom;
        var horizontalGap = _this.horizontalGap;
        var div = _this.div;
        var divWidth = _this.divWidth;
        var maxColumns = _this.maxColumns;
        var verticalGap = _this.verticalGap;
        var spacing = _this.spacing;
        var w = divWidth - marginRight - marginLeft;
        var maxWidth = 0;
        var maxHeight = 0;

        var container = _this.container;
        var set = container.set();
        _this.set = set;

        var entriesSet = container.set();
        set.push(entriesSet);

        var entries = _this.entries;
        for (var i = 0; i < entries.length; i++) {
            var bbox = entries[i].getBBox();
            var ew = bbox.width;
            if (ew > maxWidth) {
                maxWidth = ew;
            }
            var eh = bbox.height;

            if (eh > maxHeight) {
                maxHeight = eh;
            }
        }

        var row = 0;
        var column = 0;
        var nextX = horizontalGap;

        for (var i = 0; i < entries.length; i++) {

            var entry = entries[i];
            if (_this.reversedOrder) {
                entry = entries[entries.length - i - 1];
            }

            var bbox = entry.getBBox();
            var x;
            if (!_this.equalWidths) {
                x = nextX;
                nextX = nextX + bbox.width + horizontalGap + spacing;
            } else {
                x = horizontalGap + column * (maxWidth + spacing + _this.markerLabelGap);
            }

            if (x + bbox.width > w && i > 0) {
                row++;
                column = 0;
                x = horizontalGap;
                nextX = x + bbox.width + horizontalGap + spacing;
            }

            var y = (maxHeight + verticalGap) * row;

            entry.translate(x, y);
            column++;

            if (!isNaN(maxColumns)) {
                if (column >= maxColumns) {
                    column = 0;
                    row++;
                }
            }
            entriesSet.push(entry);
        }

        var bbox = entriesSet.getBBox();

        var hh = bbox.height + 2 * verticalGap - 1;

        if (position == "left" || position == "right") {
            var ww = bbox.width + 2 * horizontalGap;
            var divWidth = ww + marginLeft + marginRight;
            div.style.width = divWidth + "px";
        } else {
            var ww = divWidth - marginLeft - marginRight - 1;
        }

        var bg = AmCharts.polygon(_this.container, [0, ww, ww, 0], [0, 0, hh, hh], _this.backgroundColor, _this.backgroundAlpha, 1, _this.borderColor, _this.borderAlpha);
        set.push(bg);

        set.translate(marginLeft, marginTop);

        bg.toBack();
        var ex = horizontalGap;
        if (position == "top" || position == "bottom" || position == "absolute") {
            if (_this.align == "center") {
                ex = horizontalGap + (ww - bbox.width) / 2;
            } else if (_this.align == "right") {
                ex = horizontalGap + ww - bbox.width;
            }
        }

        entriesSet.translate(ex, verticalGap + 1);

        if (this.titleHeight > hh) {
            hh = this.titleHeight;
        }

        var divHeight = hh + marginTop + marginBottom + 1;

        if (divHeight < 0) {
            divHeight = 0;
        }

        //出滚动条
        if (this.isScroll) {
            var lgH = Math.round(divHeight);
            if (this.maxHeight !== null && lgH > this.maxHeight + 10) {
                lgH = this.maxHeight;
            }
            div.style.height = lgH + "px";
            this.container.setSize(divWidth, Math.round(divHeight));
        } else {
            div.style.height = Math.round(divHeight) + "px";
        }
    },

    updateMaxHeight: function(h) {
        this.maxHeight = h;
    },
    createEntry: function(dItem) {
        if (dItem.visibleInLegend !== false) {
            var _this = this;
            var chart = _this.chart;
            var markerType = dItem.markerType;
            if (!markerType) {
                markerType = _this.markerType;
            }

            var color = dItem.color;
            var alpha = dItem.alpha;

            if (dItem.legendKeyColor) {
                color = dItem.legendKeyColor();
            }

            if (dItem.legendKeyAlpha) {
                alpha = dItem.legendKeyAlpha();
            }

            if (dItem.hidden == true) {
                color = _this.markerDisabledColor;
            }

            var marker = _this.createMarker(markerType, color, alpha);
            _this.addListeners(marker, dItem);
            var entrySet = _this.container.set([marker]);

            if (_this.switchable) {
                entrySet.setAttr('cursor', 'pointer');
            }

            // switch
            var switchType = _this.switchType;
            if (switchType) {
                var mswitch;
                if (switchType == "x") {
                    mswitch = _this.createX();
                } else {
                    mswitch = _this.createV();
                }

                mswitch.dItem = dItem;

                if (dItem.hidden != true) {
                    if (switchType == "x") {
                        mswitch.hide();
                    } else {
                        mswitch.show();
                    }
                } else {
                    if (switchType != "x") {
                        mswitch.hide();
                    }
                }

                if (!_this.switchable) {
                    mswitch.hide();
                }
                _this.addListeners(mswitch, dItem);
                dItem.legendSwitch = mswitch;
                entrySet.push(mswitch);
            }
            // end of switch			
            var tcolor = _this.color;

            if (dItem.showBalloon && _this.textClickEnabled && _this.selectedColor != undefined) {
                tcolor = _this.selectedColor;
            }

            if (_this.useMarkerColorForLabels) {
                tcolor = color;
            }
            if (dItem.hidden == true) {
                tcolor = _this.markerDisabledColor;
            }

            var txt = AmCharts.massReplace(_this.labelText, {
                "[[title]]": dItem.title
            });
            var fontSize = _this.fontSize;
            var markerSize = _this.markerSize;
            if (marker) {
                if (markerSize < fontSize) {
                    var delta = 0;
                    if (markerType == "bubble" || markerType == "circle") {
                        delta = markerSize / 2;
                    }
                    marker.translate(delta, delta + _this.ly - fontSize / 2 + (fontSize + 2 - markerSize) / 2);
                }
            }

            if (txt) {
                //只有饼图时才截取，因为饼图不用出提示
                if (_this.graphType === "pie") {
                    /***start modify  给图例添加提示(UI规范),当英文字符大于20个时，只显示20个加"...",鼠标移动上去时显示提示***/
                    var tempTxt = txt;
                    var maxTxetCount_en = _this.maxLegendTextEN;
                    var maxTextCount_zh = _this.maxLegendTextZH;
                    var strSuffix = '...';

                    //判断字符串的中英文
                    function isChineseStr(str) {
                        if (escape(str).indexOf("%u") != -1) {
                            return true;
                        }
                        return false;
                    };

                    //判断字符串的中英文
                    if (txt && txt !== "") {
                        if (!isChineseStr(txt)) {
                            if (txt.length > maxTxetCount_en) {
                                tempTxt = txt.substr(0, maxTxetCount_en) + strSuffix;
                            }
                        } else {
                            if (txt.length > maxTextCount_zh) {
                                tempTxt = txt.substr(0, maxTextCount_zh) + strSuffix;
                            }
                        }
                    }
                    txt = tempTxt;
                    /***end modify ********************************************************************/
                }

                var label = AmCharts.text(_this.container, txt, tcolor, chart.fontFamily, fontSize, 'start');
                label.translate(_this.lx, _this.ly);
                entrySet.push(label);

                var bbox = label.getBBox();
                var lWidth = bbox.width;

                if (_this.maxLabelWidth < lWidth) {
                    _this.maxLabelWidth = lWidth;
                }
            }

            _this.entries[_this.index] = entrySet;
            dItem.legendEntry = _this.entries[_this.index];
            dItem.legendLabel = label;
            _this.index++;
        }
    },

    addListeners: function(obj, dItem) {
        var _this = this;
        if (obj) {
            obj.mouseover(function() {
                _this.rollOverMarker(dItem);
            }).mouseout(function() {
                _this.rollOutMarker(dItem);
            }).click(function() {
                _this.clickMarker(dItem);
            });
        }
    },


    rollOverMarker: function(dItem) {
        var _this = this;
        if (_this.switchable) {
            _this.dispatch("rollOverMarker", dItem);
        }
        _this.dispatch("rollOverItem", dItem);
    },

    rollOutMarker: function(dItem) {
        var _this = this;
        if (_this.switchable) {
            _this.dispatch("rollOutMarker", dItem);
        }
        _this.dispatch("rollOutItem", dItem);
    },

    clickMarker: function(dItem) {
        var _this = this;
        if (_this.switchable) {
            if (dItem.hidden == true) {
                _this.dispatch("showItem", dItem);
            } else {
                _this.dispatch("hideItem", dItem);
            }
        } else if (_this.textClickEnabled) {
            _this.dispatch("clickMarker", dItem);
        }
    },


    rollOverLabel: function(dItem) {
        var _this = this;
        if (!dItem.hidden) {
            if (_this.textClickEnabled) {
                if (dItem.legendLabel) {
                    dItem.legendLabel.attr({
                        fill: _this.rollOverColor
                    });
                }
            }
            _this.dispatch("rollOverItem", dItem);
        }
    },

    rollOutLabel: function(dItem) {
        var _this = this;
        if (!dItem.hidden) {
            if (_this.textClickEnabled) {
                if (dItem.legendLabel) {
                    var color = _this.color;
                    if (_this.selectedColor != undefined && dItem.showBalloon) {
                        color = _this.selectedColor;
                    }
                    if (_this.useMarkerColorForLabels) {
                        color = dItem.lineColor;
                        if (color == undefined) {
                            color = dItem.color;
                        }
                    }

                    dItem.legendLabel.attr({
                        fill: color
                    });
                }
            }
            _this.dispatch("rollOutItem", dItem);
        }
    },

    clickLabel: function(dItem) {
        var _this = this;

        if (_this.textClickEnabled) {
            if (!dItem.hidden) {
                _this.dispatch("clickLabel", dItem);
            }
        } else if (_this.switchable) {
            if (dItem.hidden == true) {
                _this.dispatch("showItem", dItem);
            } else {
                _this.dispatch("hideItem", dItem);
            }
        }
    },

    dispatch: function(name, dItem) {
        var _this = this;
        _this.fire(name, {
            type: name,
            dataItem: dItem,
            target: _this,
            chart: _this.chart
        });
    },

    createValue: function(dItem) {
        var _this = this;
        var fontSize = _this.fontSize;
        var LEFT = "left";
        if (dItem.visibleInLegend !== false) {
            var labelWidth = _this.maxLabelWidth;

            if (!_this.equalWidths) {
                _this.valueAlign = LEFT;
            }

            if (_this.valueAlign == LEFT) {
                labelWidth = dItem.legendEntry.getBBox().width;
            }

            var hitW = labelWidth;
            if (_this.valueText) {
                var tcolor = _this.color;
                if (_this.useMarkerColorForLabels) {
                    tcolor = dItem.color;
                }

                if (dItem.hidden == true) {
                    tcolor = _this.markerDisabledColor;
                }

                var txt = _this.valueText;
                var x = labelWidth + _this.lx + _this.markerLabelGap + _this.valueWidth;

                var anchor = "end";
                if (_this.valueAlign == LEFT) {
                    x -= _this.valueWidth;
                    anchor = "start";
                }

                var vlabel = AmCharts.text(_this.container, txt, tcolor, _this.chart.fontFamily, fontSize, anchor);
                vlabel.translate(x, _this.ly);
                _this.entries[_this.index].push(vlabel);

                hitW += _this.valueWidth + _this.markerLabelGap;

                vlabel.dItem = dItem;
                _this.valueLabels.push(vlabel);
            }



            _this.index++;
            var hitH = _this.markerSize;
            if (hitH < fontSize + 7) {
                hitH = fontSize + 7;
                if (AmCharts.VML) {
                    hitH += 3;
                }
            }
            var hitRect = _this.container.rect(_this.markerSize + _this.markerLabelGap, 0, hitW, hitH, 0, 0).attr({
                'stroke': 'none',
                'fill': '#FFFFFF',
                'fill-opacity': 0.005
            });
            hitRect.dItem = dItem;

            _this.entries[_this.index - 1].push(hitRect);
            hitRect.mouseover(function() {
                _this.rollOverLabel(dItem);
            }).mouseout(function() {
                _this.rollOutLabel(dItem);
            }).click(function() {
                _this.clickLabel(dItem);
            });
        }
    },

    createV: function() {
        var _this = this;
        var size = _this.markerSize;
        return AmCharts.polygon(_this.container, [size / 5, size / 2, size - size / 5, size / 2], [size / 3, size - size / 5, size / 5, size / 1.7], _this.switchColor);
    },

    createX: function() {
        var _this = this;
        var size = _this.markerSize - 3;
        var attr = {
            stroke: _this.switchColor,
            'stroke-width': 3
        };
        var container = _this.container;
        var line1 = AmCharts.line(container, [3, size], [3, size]).attr(attr);
        var line2 = AmCharts.line(container, [3, size], [size, 3]).attr(attr);
        return _this.container.set([line1, line2]);
    },

    createMarker: function(type, color, alpha) {
        var _this = this;
        var size = _this.markerSize;
        var c = _this.container;
        var marker;

        var stroke = _this.markerBorderColor;
        if (!stroke) {
            stroke = color;
        }

        var markerBorderThickness = _this.markerBorderThickness;
        var markerBorderAlpha = _this.markerBorderAlpha;

        switch (type) {
            case "square":
                marker = AmCharts.polygon(c, [0, size, size, 0], [0, 0, size, size], color, alpha, markerBorderThickness, stroke, markerBorderAlpha);
                break;
            case "circle":
                marker = AmCharts.circle(c, size / 2, color, alpha, markerBorderThickness, stroke, markerBorderAlpha);
                marker.translate(size / 2, size / 2);
                break;
            case "line":
                marker = AmCharts.line(c, [0, size], [size / 2, size / 2], color, alpha, markerBorderThickness)
                break;
            case "dashedLine":
                marker = AmCharts.line(c, [0, size], [size / 2, size / 2], color, alpha, markerBorderThickness, 3)
                break;
            case "triangleUp":
                marker = AmCharts.polygon(c, [0, size / 2, size, size], [size, 0, size, size], color, alpha, markerBorderThickness, stroke, markerBorderAlpha);
                break;
            case "triangleDown":
                marker = AmCharts.polygon(c, [0, size / 2, size, size], [0, size, 0, 0], color, alpha, markerBorderThickness, stroke, markerBorderAlpha);
                break;
            case "bubble":
                marker = AmCharts.circle(c, size / 2, color, alpha, markerBorderThickness, stroke, markerBorderAlpha, true);
                marker.translate(size / 2, size / 2);
                break;
            case "none":
                break;
        }
        return marker;
    },


    validateNow: function() {
        this.invalidateSize();
    },

    updateValues: function() {
        var _this = this;
        var valueLabels = _this.valueLabels;
        var chart = _this.chart;

        for (var i = 0; i < valueLabels.length; i++) {
            var label = valueLabels[i];
            var dataItem = label.dItem;
            // all except slices
            if (dataItem.type != undefined) {
                var currentDataItem = dataItem.currentDataItem;
                if (currentDataItem) {
                    var valueTextReal = _this.valueText;

                    if (dataItem.legendValueText) {
                        valueTextReal = dataItem.legendValueText;
                    }

                    var valueFieldText = valueTextReal;

                    valueFieldText = chart.formatString(valueFieldText, currentDataItem);

                    label.text(valueFieldText);
                } else {
                    label.text(" ");
                }
            }
            // slices
            else {
                var txt = chart.formatString(_this.valueText, dataItem);
                label.text(txt);
            }
        }
    },

    renderFix: function() {
        if (!AmCharts.VML) {
            var container = this.container;
            if (container) {
                container.renderFix();
            }
        }
    },

    destroy: function() {
        var _this = this;
        _this.div.innerHTML = "";
        AmCharts.remove(_this.set);
    }
});;
AmCharts.AmBalloon = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.enabled = true;
        /**
         * 添加属性bulletFillColor,用户不设置时使用默认值
         * 2013-04-19
         */
        _this.bulletFillColor = undefined;
        //======= add end ==============================
        _this.fillColor = '#CC0000';
        _this.fillAlpha = 1;
        _this.borderThickness = 2;
        _this.borderColor = '#FFFFFF';
        _this.borderAlpha = 1;
        _this.cornerRadius = 6;
        _this.maximumWidth = 220;
        _this.horizontalPadding = 8;
        _this.verticalPadding = 5;
        _this.pointerWidth = 10;
        _this.pointerOrientation = "V";
        _this.color = '#FFFFFF';
        _this.textShadowColor = '#000000';
        _this.adjustBorderColor = false;
        _this.showBullet = true;
        _this.follow = false;
        _this.show = false;
        /**
         * 修改bulletSize的大小为5，原来为3
         * 2013-04-22
         */
        _this.bulletSize = 5;
        //===== add end ==================
        _this.textAlign = "middle";
        //===== add DTS2014041806537==================
        _this.isPieBalloon = false;
        //===== add DTS2014041806537==================
    },

    draw: function() {
        var _this = this;
        var ptx = _this.pointToX;
        var pty = _this.pointToY;
        var UNDEFINED = undefined;
        var textAlign = _this.textAlign;

        if (!isNaN(ptx)) {
            var chart = _this.chart;
            var container = chart.container;
            var set = _this.set;
            AmCharts.remove(set);
            AmCharts.remove(_this.pointer);
            set = container.set();
            _this.set = set;

            chart.balloonsSet.push(set);

            if (_this.show) {
                var ll = _this.l;
                var tt = _this.t;
                //======= add DTS2014041806537==============================
                var rr = _this.r;
                if (_this.isPieBalloon) {
                    rr = chart.realWidth;
                }
                //======= add DTS2014041806537==============================
                var bb = _this.b;

                var textShadowColor = _this.textShadowColor;
                if (_this.color == textShadowColor) {
                    textShadowColor = UNDEFINED;
                }

                var balloonColor = _this.balloonColor;
                var fillColor = _this.fillColor;
                var borderColor = _this.borderColor;

                if (balloonColor != UNDEFINED) {
                    if (_this.adjustBorderColor) {
                        borderColor = balloonColor;
                    } else {
                        fillColor = balloonColor;
                    }
                }

                var horizontalPadding = _this.horizontalPadding;
                var verticalPadding = _this.verticalPadding;
                var pointerWidth = _this.pointerWidth;
                var pointerOrientation = _this.pointerOrientation;
                var cornerRadius = _this.cornerRadius;
                var fontFamily = chart.fontFamily;
                var textSize = _this.fontSize;

                if (textSize == UNDEFINED) {
                    textSize = chart.fontSize;
                }
                //======= add DTS2014041806537==============================
                var temp = _this.text;
                if (_this.isPieBalloon) {
                    var maxWidth = chart.realWidth - 2 * horizontalPadding;
                    var txtArr = temp.split("\n");
                    var txtArrLen = txtArr.length;
                    var dealedTxt = "";
                    for (var m = 0; m < txtArrLen; m++) {
                        var tempArr = txtArr[m];
                        var textTF1 = AmCharts.text(container, tempArr, _this.color, fontFamily, textSize, textAlign);
                        var bbox = textTF1.getBBox();
                        var textWidth = bbox.width;
                        AmCharts.remove(textTF1);
                        if (textWidth > maxWidth) {
                            var rows = Math.ceil(textWidth / maxWidth);
                            var tlen = tempArr.length;
                            var rowCount = Math.ceil(tlen / rows);
                            if (tlen % rows <= 2 && tlen % rows > 0) {
                                rowCount++;
                            }
                            var tempTxt = "";
                            for (var i = 0; i < tlen; i++) {
                                tempTxt += tempArr[i];
                                var a = i + 1;
                                if (a !== 1 && a !== tlen && (a % rowCount === 0)) {
                                    tempTxt += "\n";
                                }
                            }
                            tempArr = tempTxt;
                        }
                        dealedTxt += tempArr;
                        if ((m + 1) !== txtArrLen) {
                            dealedTxt += "\n";
                        }
                    }
                    temp = dealedTxt;
                }
                //======= add DTS2014041806537==============================
                var textTF = AmCharts.text(container, temp, _this.color, fontFamily, textSize, textAlign);
                set.push(textTF);

                if (textShadowColor != UNDEFINED) {
                    var shadowTF = AmCharts.text(container, _this.text, textShadowColor, fontFamily, textSize, textAlign, false, 0.4);
                    set.push(shadowTF);
                }

                var bbox = textTF.getBBox();
                var h = bbox.height + 2 * verticalPadding;
                var w = bbox.width + 2 * horizontalPadding;

                if (window.opera) {
                    h += 2;
                }

                var tx;
                var ty = (textSize / 2) + 5;

                switch (textAlign) {
                    case "middle":
                        tx = w / 2;
                        break;
                    case "left":
                        tx = horizontalPadding;
                        break;
                    case "right":
                        tx = w - horizontalPadding;
                        break;
                }



                textTF.translate(tx, ty);

                if (shadowTF) {
                    shadowTF.translate(tx + 1, ty + 1);
                }

                var cx;
                var cy;

                // position of the balloon
                if (pointerOrientation != "H") {
                    cx = ptx - w / 2;
                    if (pty < tt + h + 10 && pointerOrientation != "down") {
                        cy = pty + pointerWidth;
                    } else {
                        cy = pty - h - pointerWidth;
                    }
                } else {
                    if (pointerWidth * 2 > h) {
                        pointerWidth = h / 2;
                    }

                    cy = pty - h / 2;
                    if (ptx < ll + (rr - ll) / 2) {
                        cx = ptx + pointerWidth;
                    } else {
                        cx = ptx - w - pointerWidth;
                    }
                }
                // fit to bounds
                if (cy + h >= bb) {
                    cy = bb - h;
                }
                if (cy < tt) {
                    cy = tt;
                }
                if (cx < ll) {
                    cx = ll;
                }
                if (cx + w > rr) {
                    cx = rr - w;
                }

                //place the ballloon				
                var bg;
                if (cornerRadius > 0 || pointerWidth == 0) {
                    /**
                     * gradientRotation,当渐变时，设置渐变的角度
                     * 2013-04-19
                     */
                    var gradientRotation = undefined;
                    if (fillColor instanceof Array) {
                        gradientRotation = 270;
                    }
                    bg = AmCharts.rect(container, w, h, fillColor, _this.fillAlpha, _this.borderThickness, borderColor, _this.borderAlpha, _this.cornerRadius, gradientRotation);
                    //======= add end ==============================
                    /**
                     * 数据能钻取时，不出bullet
                     * 2013-07-12
                     */
                    if (_this.chart && _this.chart.dataProvider) {
                        var tempdata = _this.chart.dataProvider;
                        for (var i = 0; i < tempdata.length; i++) {
                            if (tempdata[i].drillable) {
                                _this.showBullet = false;
                                break;
                            }
                        }
                    }
                    //======= add end ==============================
                    if (_this.showBullet) {
                        /**
                         * 添加属性bulletFillColor,用户不设置时使用默认值
                         * 2013-04-19
                         */
                        var bulletFillColor = String(borderColor).toUpperCase() === "#FFFFFF" ? fillColor : borderColor;
                        if (_this.bulletFillColor != UNDEFINED) {
                            bulletFillColor = _this.bulletFillColor;
                        }
                        var pointer = AmCharts.circle(container, _this.bulletSize, bulletFillColor, _this.fillAlpha);
                        //======= add end ==============================
                        pointer.translate(ptx, pty);
                        _this.pointer = pointer;
                    }
                } else {
                    var xx = [];
                    var yy = [];
                    if (pointerOrientation != "H") {
                        var zx = ptx - cx; // center of the pointer root	
                        if (zx > w - pointerWidth) {
                            zx = w - pointerWidth;
                        }

                        if (zx < pointerWidth) {
                            zx = pointerWidth;
                        }

                        xx = [0, zx - pointerWidth, ptx - cx, zx + pointerWidth, w, w, 0, 0];

                        if (pty < tt + h + 10 && pointerOrientation != "down") {
                            yy = [0, 0, pty - cy, 0, 0, h, h, 0];
                        } else {
                            yy = [h, h, pty - cy, h, h, 0, 0, h];
                        }
                    } else {
                        var zy = pty - cy; // center of the pointer root
                        if (zy > h - pointerWidth) {
                            zy = h - pointerWidth;
                        }

                        if (zy < pointerWidth) {
                            zy = pointerWidth;
                        }

                        yy = [0, zy - pointerWidth, pty - cy, zy + pointerWidth, h, h, 0, 0];

                        if (ptx < ll + (rr - ll) / 2) {
                            xx = [0, 0, ptx - cx, 0, 0, w, w, 0];
                        } else {
                            xx = [w, w, ptx - cx, w, w, 0, 0, w];
                        }
                    }
                    bg = AmCharts.polygon(container, xx, yy, fillColor, _this.fillAlpha, _this.borderThickness, borderColor, _this.borderAlpha);
                }
                set.push(bg);
                bg.toFront();
                if (shadowTF) {
                    shadowTF.toFront();
                }
                textTF.toFront();

                var dx = 1;
                if (AmCharts.IEversion < 9 && _this.follow) {
                    dx = 6;
                }

                set.translate(cx - dx, cy);
                var bbox = bg.getBBox();
                _this.bottom = cy + bbox.y + bbox.height;
                _this.yPos = bbox.y + cy;
            }
        }
    },

    followMouse: function() {
        var _this = this;
        if (_this.follow && _this.show) {
            var ptx = _this.chart.mouseX;
            var pty = _this.chart.mouseY - 3;
            _this.pointToX = ptx;
            _this.pointToY = pty;

            if (ptx != _this.previousX || pty != _this.previousY) {
                _this.previousX = ptx;
                _this.previousY = pty;
                if (_this.cornerRadius == 0) {
                    _this.draw();
                } else {
                    var set = _this.set;
                    if (set) {
                        var bb = set.getBBox();

                        var x = ptx - bb.width / 2;
                        var y = pty - bb.height - 10;

                        if (x < _this.l) {
                            x = _this.l;
                        }
                        if (x > _this.r - bb.width) {
                            x = _this.r - bb.width;
                        }

                        if (y < _this.t) {
                            y = pty + 10;
                        }

                        set.translate(x, y);
                    }
                }
            }
        }
    },

    changeColor: function(color) {
        this.balloonColor = color;
    },

    setBounds: function(l, t, r, b) {
        var _this = this;
        _this.l = l;
        _this.t = t;
        _this.r = r;
        _this.b = b;
    },

    showBalloon: function(value) {
        var _this = this;
        _this.text = value;
        _this.show = true;

        _this.draw();
    },

    hide: function() {
        var _this = this;
        _this.show = false;
        _this.follow = false;
        _this.destroy();
    },

    setPosition: function(x, y, redraw) {
        var _this = this;
        _this.pointToX = x;
        _this.pointToY = y;
        if (redraw) {
            if (x != _this.previousX || y != _this.previousY) {
                _this.draw();
            }
        }
        _this.previousX = x;
        _this.previousY = y;
    },

    followCursor: function(value) {
        var _this = this;
        _this.follow = value;
        if (value) {
            _this.pShowBullet = _this.showBullet;
            _this.showBullet = false;
        } else {
            if (_this.pShowBullet != undefined) {
                _this.showBullet = _this.pShowBullet;
            }
        }
        clearInterval(_this.interval);

        var mouseX = _this.chart.mouseX;
        var mouseY = _this.chart.mouseY;

        if (!isNaN(mouseX)) {
            if (value) {
                _this.pointToX = mouseX;
                _this.pointToY = mouseY - 3;
                _this.interval = setInterval(function() {
                    _this.followMouse.call(_this)
                }, 40);
            }
        }
    },

    destroy: function() {
        var _this = this;
        clearInterval(_this.interval);
        AmCharts.remove(_this.set);
        AmCharts.remove(_this.pointer);
    }

});;
AmCharts.AmCoordinateChart = AmCharts.Class({

    inherits: AmCharts.AmChart,

    construct: function() {
        var _this = this;
        AmCharts.AmCoordinateChart.base.construct.call(_this);

        _this.createEvents('rollOverGraphItem', 'rollOutGraphItem', 'clickGraphItem', 'doubleClickGraphItem');

        _this.plotAreaFillColors = "#FFFFFF";
        _this.plotAreaFillAlphas = 0;
        _this.plotAreaBorderColor = "#000000";
        _this.plotAreaBorderAlpha = 0;
        _this.startAlpha = 1;
        _this.startDuration = 0;
        _this.startEffect = 'elastic';
        _this.sequencedAnimation = true;
        _this.colors = ['#FF6600', '#FCD202', '#B0DE09', '#0D8ECF', '#2A0CD0', '#CD0D74', '#CC0000', '#00CC00', '#0000CC', '#DDDDDD', '#999999', '#333333', '#990000'];
        _this.balloonDateFormat = "MMM DD, YYYY";
        _this.valueAxes = [];
        _this.graphs = [];
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmCoordinateChart.base.initChart.call(_this);

        _this.createValueAxes();

        if (AmCharts.VML) {
            _this.startAlpha = 1;
        }

        var legend = _this.legend;
        if (legend) {
            legend.setData(_this.graphs);
        }
    },


    createValueAxes: function() {
        var _this = this;
        if (_this.valueAxes.length == 0) {
            var valueAxis = new AmCharts.ValueAxis();
            _this.addValueAxis(valueAxis);
        }
    },


    parseData: function() {
        var _this = this;
        _this.processValueAxes();
        _this.processGraphs();
    },

    parseSerialData: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.parseData.call(_this);

        var graphs = _this.graphs;
        var emptyObj = {};
        var seriesIdField = _this.seriesIdField;
        if (!seriesIdField) {
            seriesIdField = _this.categoryField;
        }

        _this.chartData = [];
        var dataProvider = _this.dataProvider;
        if (dataProvider) {
            var parseDates = false;
            if (_this.categoryAxis) {
                parseDates = _this.categoryAxis.parseDates;
            }

            if (parseDates) {
                var periodObj = AmCharts.extractPeriod(_this.categoryAxis.minPeriod);
                var cleanPeriod = periodObj.period;
                var periodCount = periodObj.count;
            }

            var lookupTable = {};
            _this.lookupTable = lookupTable;

            for (var i = 0; i < dataProvider.length; i++) {
                var serialDataItem = {};
                var dataItemRaw = dataProvider[i];
                var value = dataItemRaw[_this.categoryField];
                serialDataItem.category = String(value);

                var seriesId = dataItemRaw[seriesIdField];
                lookupTable[seriesId] = serialDataItem;

                if (parseDates) {
                    if (!isNaN(value)) {
                        value = new Date(value)
                    } else {
                        value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
                    }
                    value = AmCharts.resetDateToMin(value, cleanPeriod, periodCount);
                    serialDataItem.category = value;
                    serialDataItem.time = value.getTime();
                }

                var valueAxes = _this.valueAxes;
                serialDataItem.axes = {};
                serialDataItem.x = {};

                for (var j = 0; j < valueAxes.length; j++) {
                    var axisId = valueAxes[j].id;

                    serialDataItem.axes[axisId] = {};
                    serialDataItem.axes[axisId].graphs = {};

                    for (var k = 0; k < graphs.length; k++) {
                        var graph = graphs[k];
                        var graphId = graph.id;

                        var periodValue = graph.periodValue;

                        if (graph.valueAxis.id == axisId) {
                            serialDataItem.axes[axisId].graphs[graphId] = {};

                            var graphDataItem = {};
                            graphDataItem.index = i;
                            if (graph.dataProvider) {
                                dataItemRaw = emptyObj;
                            }
                            graphDataItem.values = _this.processValues(dataItemRaw, graph, periodValue);

                            _this.processFields(graph, graphDataItem, dataItemRaw);

                            graphDataItem.category = serialDataItem.category;
                            graphDataItem.serialDataItem = serialDataItem;
                            graphDataItem.graph = graph;


                            serialDataItem.axes[axisId].graphs[graphId] = graphDataItem;
                        }
                    }
                }
                _this.chartData[i] = serialDataItem;
            }
        }


        for (var g = 0; g < graphs.length; g++) {
            var graph = graphs[g];
            if (graph.dataProvider) {
                _this.parseGraphData(graph);
            }
        }
    },


    processValues: function(dataItemRaw, graph, periodValue) {
        var values = {};
        var candle = false;
        if ((graph.type == "candlestick" || graph.type == "ohlc") && periodValue != "") {
            candle = true;
        }
        var val = Number(dataItemRaw[graph.valueField + periodValue]);

        if (!isNaN(val)) {
            values.value = val;
        }

        if (candle) {
            periodValue = "Open";
        }

        var val = Number(dataItemRaw[graph.openField + periodValue]);

        if (!isNaN(val)) {
            values.open = val;
        }

        if (candle) {
            periodValue = "Close";
        }

        var val = Number(dataItemRaw[graph.closeField + periodValue]);
        if (!isNaN(val)) {
            values.close = val;
        }

        if (candle) {
            periodValue = "Low";
        }

        var val = Number(dataItemRaw[graph.lowField + periodValue]);
        if (!isNaN(val)) {
            values.low = val;
        }

        if (candle) {
            periodValue = "High";
        }

        var val = Number(dataItemRaw[graph.highField + periodValue]);
        if (!isNaN(val)) {
            values.high = val;
        }
        return values;
    },


    parseGraphData: function(graph) {
        var _this = this;
        var dataProvider = graph.dataProvider;
        var categoryField = graph.categoryField;
        if (!categoryField) {
            categoryField = _this.categoryField;
        }

        var seriesIdField = graph.seriesIdField;
        if (!seriesIdField) {
            seriesIdField = _this.seriesIdField;
        }
        if (!seriesIdField) {
            seriesIdField = _this.categoryField;
        }

        for (var i = 0; i < dataProvider.length; i++) {
            var dataItemRaw = dataProvider[i];
            var seriesId = String(dataItemRaw[seriesIdField]);
            var serialDataItem = _this.lookupTable[seriesId];
            var chartId = graph.chart.id;
            var axisId = graph.valueAxis.id;

            if (serialDataItem) {
                var graphDataItem = serialDataItem.axes[axisId].graphs[graph.id];
                graphDataItem.serialDataItem = serialDataItem;
                var periodValue = graph.periodValue;
                graphDataItem.values = _this.processValues(dataItemRaw, graph, periodValue);
                _this.processFields(graph, graphDataItem, dataItemRaw);
            }
        }
    },


    addValueAxis: function(axis) {
        var _this = this;
        axis.chart = this;
        _this.valueAxes.push(axis);
        _this.validateData();
    },

    removeValueAxesAndGraphs: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;
        for (var i = valueAxes.length - 1; i > -1; i--) {
            _this.removeValueAxis(valueAxes[i]);
        }
    },

    removeValueAxis: function(valueAxis) {
        var _this = this;
        var graphs = _this.graphs;
        var i;

        for (i = graphs.length - 1; i >= 0; i--) {
            var graph = graphs[i];
            if (graph) {
                if (graph.valueAxis == valueAxis) {
                    _this.removeGraph(graph);
                }
            }
        }

        var valueAxes = _this.valueAxes;

        for (i = valueAxes.length - 1; i >= 0; i--) {
            if (valueAxes[i] == valueAxis) {
                valueAxes.splice(i, 1);
            }
        }
        _this.validateData();
    },

    addGraph: function(graph) {
        var _this = this;
        _this.graphs.push(graph);
        _this.chooseGraphColor(graph, _this.graphs.length - 1)
        _this.validateData();
    },

    removeGraph: function(graph) {
        var _this = this;
        var graphs = _this.graphs;
        for (var i = graphs.length - 1; i >= 0; i--) {
            if (graphs[i] == graph) {
                graphs.splice(i, 1);
                graph.destroy();
            }
        }
        _this.validateData();
    },

    processValueAxes: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;
        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];
            valueAxis.chart = this;

            if (!valueAxis.id) {
                valueAxis.id = "valueAxis" + i + "_" + new Date().getTime();
            }
            if (_this.usePrefixes === true || _this.usePrefixes === false) {
                valueAxis.usePrefixes = _this.usePrefixes;
            }
        }
    },

    processGraphs: function() {
        var _this = this;
        var graphs = _this.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.chart = this;

            if (!graph.valueAxis) {
                graph.valueAxis = _this.valueAxes[0];
            }
            if (!graph.id) {
                graph.id = "graph" + i + "_" + new Date().getTime();
            }
        }
    },

    formatString: function(text, dItem) {
        var _this = this;
        var graph = dItem.graph;

        // format duration
        var valAxis = graph.valueAxis;
        if (valAxis.duration) {
            if (dItem.values.value) {
                var duration = AmCharts.formatDuration(dItem.values.value, valAxis.duration, "", valAxis.durationUnits, valAxis.maxInterval, valAxis.numberFormatter);
                text = text.split("[[value]]").join(duration);
            }
        }

        text = AmCharts.massReplace(text, {
            "[[title]]": graph.title,
            "[[description]]": dItem.description,
            "<br>": "\n"
        });
        text = AmCharts.fixNewLines(text);
        text = AmCharts.cleanFromEmpty(text);

        return text;
    },


    getBalloonColor: function(graph, graphDataItem) {
        var _this = this;
        var color = graph.lineColor;
        var balloonColor = graph.balloonColor;
        var fillColors = graph.fillColors;

        if (typeof(fillColors) == 'object') {
            color = fillColors[0];
        } else if (fillColors != undefined) {
            color = fillColors;
        }

        if (graphDataItem.isNegative) {
            var negativeColor = graph.negativeLineColor;
            var negativeFillColors = graph.negativeFillColors;
            if (typeof(negativeFillColors) == 'object') {
                negativeColor = negativeFillColors[0];
            } else if (negativeFillColors != undefined) {
                negativeColor = negativeFillColors;
            }

            if (negativeColor != undefined) {
                color = negativeColor;
            }
        }

        if (graphDataItem.color != undefined) {
            color = graphDataItem.color;
        }

        if (balloonColor == undefined) {
            balloonColor = color;
        }
        return balloonColor;
    },

    getGraphById: function(id) {
        return this.getObjById(this.graphs, id);
    },

    getValueAxisById: function(id) {
        return this.getObjById(this.valueAxes, id);
    },


    getObjById: function(objects, id) {
        var _this = this;
        var currentObj;

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            if (obj.id == id) {
                currentObj = obj;
            }
        }
        return currentObj;
    },

    processFields: function(graph, graphDataItem, dataItemRaw) {
        var _this = this;
        if (graph.itemColors) {
            var itemColors = graph.itemColors;
            var index = graphDataItem.index;

            if (index < itemColors.length) {
                graphDataItem.color = itemColors[index];
            } else {
                graphDataItem.color = AmCharts.randomColor();
            }
        }

        var fields = ['lineColor', 'color', 'alpha', 'fillColors', 'description', 'bullet', 'customBullet', 'bulletSize', 'bulletConfig', 'url', 'drill'];

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var fieldName = graph[field + 'Field'];

            if (fieldName) {
                var val = dataItemRaw[fieldName];
                if (AmCharts.isDefined(val)) {
                    graphDataItem[field] = val;
                }
            }
        }
        graphDataItem.dataContext = dataItemRaw;
    },

    chooseGraphColor: function(graph, index) {
        var _this = this;
        if (graph.lineColor == undefined) {
            var color;
            if (_this.colors.length > index) {
                color = _this.colors[index];
            } else {
                color = AmCharts.randomColor();
            }

            graph.lineColor = color;
        }
    },

    handleLegendEvent: function(event) {
        var _this = this;
        var type = event.type;
        var dataItem = event.dataItem;
        if (dataItem) {
            var hidden = dataItem.hidden;
            var showBalloon = dataItem.showBalloon;

            switch (type) {
                case 'clickMarker':
                    if (showBalloon) {
                        _this.hideGraphsBalloon(dataItem);
                    } else {
                        _this.showGraphsBalloon(dataItem);
                    }
                    break;

                case 'clickLabel':

                    if (showBalloon) {
                        _this.hideGraphsBalloon(dataItem);
                    } else {
                        _this.showGraphsBalloon(dataItem);
                    }
                    break;

                case 'rollOverItem':
                    if (!hidden) {
                        _this.highlightGraph(dataItem);
                    }
                    break;

                case 'rollOutItem':
                    if (!hidden) {
                        _this.unhighlightGraph();
                    }
                    break;

                case 'hideItem':
                    _this.hideGraph(dataItem);
                    break;

                case 'showItem':
                    _this.showGraph(dataItem);
                    break;
            }
        }
    },


    highlightGraph: function(thisGraph) {
        var _this = this;
        var graphs = _this.graphs;
        var i;
        var alpha = 0.2;

        if (_this.legend) {
            alpha = _this.legend.rollOverGraphAlpha;
        }

        if (alpha != 1) {
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                if (graph != thisGraph) {
                    graph.changeOpacity(alpha);
                }
            }
        }
    },

    unhighlightGraph: function() {
        var _this = this;

        if (_this.legend) {
            alpha = _this.legend.rollOverGraphAlpha;
        }

        if (alpha != 1) {
            var graphs = _this.graphs;
            for (var i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.changeOpacity(1);
            }
        }
    },

    showGraph: function(graph) {
        var _this = this;
        graph.hidden = false;
        _this.dataChanged = true;
        _this.marginsUpdated = false;
        _this.initChart();
    },

    hideGraph: function(graph) {
        var _this = this;
        _this.dataChanged = true;
        _this.marginsUpdated = false;
        graph.hidden = true;
        _this.initChart();
    },

    hideGraphsBalloon: function(graph) {
        var _this = this;
        graph.showBalloon = false;
        _this.updateLegend();
    },

    showGraphsBalloon: function(graph) {
        var _this = this;
        graph.showBalloon = true;
        _this.updateLegend();
    },

    updateLegend: function() {
        var _this = this;
        if (_this.legend) {
            _this.legend.invalidateSize();
        }
    },

    animateAgain: function() {
        var _this = this;
        var graphs = _this.graphs;
        if (graphs) {
            for (var i = 0; i < graphs.length; i++) {
                graphs[i].animationPlayed = false;
            }
        }
    }

});;
AmCharts.AmRectangularChart = AmCharts.Class({

    inherits: AmCharts.AmCoordinateChart,

    construct: function() {
        var _this = this;
        AmCharts.AmRectangularChart.base.construct.call(_this);

        _this.createEvents('zoomed');

        _this.marginLeft = 20;
        _this.marginTop = 20;
        _this.marginBottom = 20;
        _this.marginRight = 20;
        _this.angle = 0;
        _this.depth3D = 0;
        _this.horizontalPosition = 0;
        _this.verticalPosition = 0;
        _this.widthMultiplier = 1;
        _this.heightMultiplier = 1;
        _this.zoomOutText = "Show all";
        _this.zbSet;
        _this.zoomOutButton = {
            backgroundColor: '#b2e1ff',
            backgroundAlpha: 1
        };
        _this.trendLines = [];
        _this.autoMargins = true;
        _this.marginsUpdated = false;
        _this.autoMarginOffset = 10;
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmRectangularChart.base.initChart.call(_this);
        _this.updateDxy();

        var updateGraphs = true;
        if (!_this.marginsUpdated && _this.autoMargins) {
            _this.resetMargins();
            updateGraphs = false;
        }

        _this.updateMargins();
        _this.updatePlotArea();
        _this.updateScrollbars();
        _this.updateTrendLines();
        _this.updateChartCursor();
        _this.updateValueAxes();

        // no need to draw graphs for the first time, as only axes are rendered to measure margins
        if (updateGraphs) {
            if (!_this.scrollbarOnly) {
                _this.updateGraphs();
            }
        }
    },

    drawChart: function() {
        var _this = this;
        AmCharts.AmRectangularChart.base.drawChart.call(_this);
        _this.drawPlotArea();
        var chartData = _this.chartData;
        if (AmCharts.ifArray(chartData)) {
            var chartCursor = _this.chartCursor;
            if (chartCursor) {
                chartCursor.draw();
            }
            var zoomOutText = _this.zoomOutText;
            if (zoomOutText != "" && zoomOutText) {
                _this.drawZoomOutButton();
            }
        }
    },


    resetMargins: function() {
        var _this = this;

        var fixMargins = {};
        if (_this.chartType == "serial") {
            var valueAxes = _this.valueAxes;
            for (var i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                if (!valueAxis.ignoreAxisWidth) {
                    valueAxis.setOrientation(_this.rotate);
                    valueAxis.fixAxisPosition();
                    fixMargins[valueAxis.position] = true;
                }
            }

            var categoryAxis = _this.categoryAxis;
            if (categoryAxis) {
                if (!categoryAxis.ignoreAxisWidth) {
                    categoryAxis.setOrientation(!_this.rotate);
                    categoryAxis.fixAxisPosition();
                    categoryAxis.fixAxisPosition();
                    fixMargins[categoryAxis.position] = true;
                }
            }
        }
        // xy
        else {
            var xAxes = _this.xAxes;
            var yAxes = _this.yAxes;

            for (var i = 0; i < xAxes.length; i++) {
                var xAxis = xAxes[i];
                if (!xAxis.ignoreAxisWidth) {
                    xAxis.setOrientation(true);
                    xAxis.fixAxisPosition();
                    fixMargins[xAxis.position] = true;
                }
            }
            for (var i = 0; i < yAxes.length; i++) {
                var yAxis = yAxes[i];
                if (!yAxis.ignoreAxisWidth) {
                    yAxis.setOrientation(false);
                    yAxis.fixAxisPosition();
                    fixMargins[yAxis.position] = true;
                }
            }
        }


        if (fixMargins["left"]) {
            _this.marginLeft = 0;
        }
        if (fixMargins["right"]) {
            _this.marginRight = 0;
        }
        if (fixMargins["top"]) {
            _this.marginTop = 0;
        }
        if (fixMargins["bottom"]) {
            _this.marginBottom = 0;
        }

        _this.fixMargins = fixMargins;
    },

    measureMargins: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;
        var bounds;
        var autoMarginOffset = _this.autoMarginOffset;
        var fixMargins = _this.fixMargins;
        var realWidth = _this.realWidth;
        var realHeight = _this.realHeight;

        var l = autoMarginOffset;
        var t = autoMarginOffset;
        var r = realWidth - autoMarginOffset;
        var b = realHeight - autoMarginOffset;

        for (var i = 0; i < valueAxes.length; i++) {
            bounds = _this.getAxisBounds(valueAxes[i], l, r, t, b);
            l = bounds.l;
            r = bounds.r;
            t = bounds.t;
            b = bounds.b;
        }

        var categoryAxis = _this.categoryAxis;
        if (categoryAxis) {
            bounds = _this.getAxisBounds(categoryAxis, l, r, t, b);
            l = bounds.l;
            r = bounds.r;
            t = bounds.t;
            b = bounds.b;
        }

        if (fixMargins["left"] && l < autoMarginOffset) {
            _this.marginLeft = Math.round(-l + autoMarginOffset);
        }

        if (fixMargins["right"] && r > realWidth - autoMarginOffset) {
            _this.marginRight = Math.round(r - realWidth + autoMarginOffset);
        }
        if (fixMargins["top"] && t < autoMarginOffset) {
            _this.marginTop = Math.round(_this.marginTop - t + autoMarginOffset + _this.titleHeight);
        }
        if (fixMargins["bottom"] && b > realHeight - autoMarginOffset) {
            _this.marginBottom = Math.round(b - realHeight + autoMarginOffset);
        }

        _this.animateAgain();
        _this.initChart();
    },

    getAxisBounds: function(axis, l, r, t, b) {
        var x;
        var y;

        if (!axis.ignoreAxisWidth) {
            var set = axis.labelsSet;
            var tickLength = axis.tickLength;
            if (axis.inside) {
                tickLength = 0;
            }

            if (set) {
                var bbox = axis.getBBox();

                switch (axis.position) {
                    case "top":
                        y = bbox.y;

                        if (t > y) {
                            t = y;
                        }

                        break;
                    case "bottom":
                        y = bbox.y + bbox.height;

                        if (b < y) {
                            b = y;
                        }
                        break;
                    case "right":

                        x = bbox.x + bbox.width + tickLength + 3;

                        if (r < x) {
                            r = x;
                        }

                        break;
                    case "left":
                        x = bbox.x - tickLength;

                        if (l > x) {
                            l = x;
                        }
                        break;
                }
            }
        }

        return ({
            l: l,
            t: t,
            r: r,
            b: b
        });
    },


    drawZoomOutButton: function() {
        var _this = this;
        var zbSet = _this.container.set();
        _this.zoomButtonSet.push(zbSet);
        var color = _this.color;
        var fontSize = _this.fontSize;
        var zoomOutButton = _this.zoomOutButton;

        if (zoomOutButton) {
            if (zoomOutButton.fontSize) {
                fontSize = zoomOutButton.fontSize;
            }
            if (zoomOutButton.color) {
                color = zoomOutButton.color;
            }
        }

        var label = AmCharts.text(_this.container, _this.zoomOutText, color, _this.fontFamily, fontSize, 'start');
        var lbbox = label.getBBox();
        label.translate(29, 6 + lbbox.height / 2);
        var bg = AmCharts.rect(_this.container, lbbox.width + 40, lbbox.height + 15, zoomOutButton.backgroundColor, zoomOutButton.backgroundAlpha);
        zbSet.push(bg);
        _this.zbBG = bg;

        if (_this.pathToImages != undefined) {
            var lens = _this.container.image(_this.pathToImages + "lens.png", 0, 0, 16, 16);
            lens.translate(7, lbbox.height / 2 - 1);
            lens.toFront();
            zbSet.push(lens);
        }
        label.toFront();
        zbSet.push(label);

        // zoomboutbutton
        var bbox = zbSet.getBBox();
        zbSet.translate((_this.marginLeftReal + _this.plotAreaWidth - bbox.width), _this.marginTopReal);
        zbSet.hide();

        zbSet.mouseover(function() {
            _this.rollOverZB();
        }).mouseout(function() {
            _this.rollOutZB();
        }).click(function() {
            _this.clickZB();
        }).touchstart(function() {
            _this.rollOverZB();
        }).touchend(function() {
            _this.rollOutZB();
            _this.clickZB();
        });

        for (var j = 0; j < zbSet.length; j++) {
            zbSet[j].attr({
                cursor: 'pointer'
            });
        }
        _this.zbSet = zbSet;
    },

    rollOverZB: function() {
        this.zbBG.show();
    },

    rollOutZB: function() {
        this.zbBG.hide();
    },

    clickZB: function() {
        this.zoomOut();
    },

    zoomOut: function() {
        var _this = this;
        _this.updateScrollbar = true;
        _this.zoom();
    },

    drawPlotArea: function() {
        var _this = this;
        var dx = _this.dx;
        var dy = _this.dy;
        var x0 = _this.marginLeftReal;
        var y0 = _this.marginTopReal;
        var w = _this.plotAreaWidth;
        var h = _this.plotAreaHeight;
        var color = _this.plotAreaFillColors;
        var alpha = _this.plotAreaFillAlphas;
        var plotAreaBorderColor = _this.plotAreaBorderColor;
        var plotAreaBorderAlpha = _this.plotAreaBorderAlpha;

        // clip trend lines set
        _this.trendLinesSet.clipRect(x0, y0, w, h);

        if (typeof(alpha) == 'object') {
            alpha = alpha[0];
        }

        var bg = AmCharts.polygon(_this.container, [0, w, w, 0], [0, 0, h, h], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha, _this.plotAreaGradientAngle);
        bg.translate(x0 + dx, y0 + dy);
        _this.set.push(bg);

        if (dx != 0 && dy != 0) {
            color = _this.plotAreaFillColors;
            if (typeof(color) == 'object') {
                color = color[0];
            }
            color = AmCharts.adjustLuminosity(color, -0.15);

            var attr = {
                'fill': color,
                'fill-opacity': alpha,
                'stroke': _this.plotAreaBorderColor,
                'stroke-opacity': _this.plotAreaBorderAlpha
            }

            var hSide = AmCharts.polygon(_this.container, [0, dx, w + dx, w, 0], [0, dy, dy, 0, 0], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha);
            hSide.translate(x0, (y0 + h));
            _this.set.push(hSide);

            var vSide = AmCharts.polygon(_this.container, [0, 0, dx, dx, 0], [0, h, h + dy, dy, 0], color, alpha, 1, plotAreaBorderColor, plotAreaBorderAlpha);
            vSide.translate(x0, y0);
            _this.set.push(vSide);
        }
    },

    updatePlotArea: function() {
        var _this = this;
        var realWidth = _this.updateWidth();
        var realHeight = _this.updateHeight();
        var container = _this.container;

        _this.realWidth = realWidth;
        _this.realWidth = realHeight;

        if (container) {
            _this.container.setSize(realWidth, realHeight);
        }

        var dx = _this.dx;
        var dy = _this.dy;
        var x0 = _this.marginLeftReal;
        var y0 = _this.marginTopReal;

        var w = realWidth - x0 - _this.marginRightReal - dx;
        var h = realHeight - y0 - _this.marginBottomReal;

        if (w < 1) {
            w = 1;
        }

        if (h < 1) {
            h = 1;
        }

        _this.plotAreaWidth = Math.round(w);
        _this.plotAreaHeight = Math.round(h);
    },

    updateDxy: function() {
        var _this = this;
        _this.dx = _this.depth3D * Math.cos(_this.angle * Math.PI / 180);
        _this.dy = -_this.depth3D * Math.sin(_this.angle * Math.PI / 180);
    },

    updateMargins: function() {
        var _this = this;
        var titleHeight = _this.getTitleHeight();
        _this.titleHeight = titleHeight;
        _this.marginTopReal = _this.marginTop - _this.dy + titleHeight;
        _this.marginBottomReal = _this.marginBottom;
        _this.marginLeftReal = _this.marginLeft;
        _this.marginRightReal = _this.marginRight;
    },

    updateValueAxes: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;

        var marginLeftReal = this.marginLeftReal;
        var marginTopReal = this.marginTopReal;
        var plotAreaHeight = _this.plotAreaHeight;
        var plotAreaWidth = _this.plotAreaWidth;

        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];
            valueAxis.axisRenderer = AmCharts.RecAxis;
            valueAxis.guideFillRenderer = AmCharts.RecFill;
            valueAxis.axisItemRenderer = AmCharts.RecItem;
            valueAxis.dx = _this.dx;
            valueAxis.dy = _this.dy;
            valueAxis.viW = plotAreaWidth - 1;
            valueAxis.viH = plotAreaHeight - 1;
            valueAxis.marginsChanged = true;
            valueAxis.viX = marginLeftReal;
            valueAxis.viY = marginTopReal;
            _this.updateObjectSize(valueAxis);
        }
    },

    // graphs and value axes are updated using this method
    updateObjectSize: function(obj) {
        var _this = this;
        obj.width = (_this.plotAreaWidth - 1) * _this.widthMultiplier;
        obj.height = (_this.plotAreaHeight - 1) * _this.heightMultiplier;
        obj.x = _this.marginLeftReal + _this.horizontalPosition;
        obj.y = _this.marginTopReal + _this.verticalPosition;
    },

    updateGraphs: function() {
        var _this = this;
        var graphs = _this.graphs;

        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.x = _this.marginLeftReal + _this.horizontalPosition;
            graph.y = _this.marginTopReal + _this.verticalPosition;
            graph.width = _this.plotAreaWidth * _this.widthMultiplier;
            graph.height = _this.plotAreaHeight * _this.heightMultiplier;
            graph.index = i;
            graph.dx = _this.dx;
            graph.dy = _this.dy;
            graph.rotate = _this.rotate;
            graph.chartType = _this.chartType;
        }
    },


    updateChartCursor: function() {
        var _this = this;
        var chartCursor = _this.chartCursor;
        if (chartCursor) {
            chartCursor.x = _this.marginLeftReal;
            chartCursor.y = _this.marginTopReal;
            chartCursor.width = _this.plotAreaWidth - 1;
            chartCursor.height = _this.plotAreaHeight - 1;
            chartCursor.chart = this;
        }
    },

    updateScrollbars: function() {
        // void
    },

    addChartCursor: function(chartCursor) {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.chartCursor]);

        if (chartCursor) {
            _this.listenTo(chartCursor, "changed", _this.handleCursorChange);
            _this.listenTo(chartCursor, "zoomed", _this.handleCursorZoom);
        }
        _this.chartCursor = chartCursor;
    },

    removeChartCursor: function() {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.chartCursor]);
        _this.chartCursor = null;
    },

    zoomTrendLines: function() {
        var _this = this;
        var trendLines = _this.trendLines;

        for (var i = 0; i < trendLines.length; i++) {
            var trendLine = trendLines[i];

            if (!trendLine.valueAxis.recalculateToPercents) {
                trendLine.x = _this.marginLeftReal + _this.horizontalPosition;
                trendLine.y = _this.marginTopReal + _this.verticalPosition;
                trendLine.draw();
            } else {
                if (trendLine.set) {
                    trendLine.set.hide();
                }
            }
        }
    },

    addTrendLine: function(trendLine) {
        this.trendLines.push(trendLine);
    },



    removeTrendLine: function(trendLine) {
        var trendLines = this.trendLines;

        for (var i = trendLines.length - 1; i >= 0; i--) {
            if (trendLines[i] == trendLine) {
                trendLines.splice(i, 1);
            }
        }
    },


    adjustMargins: function(scrollbar, rotate) {
        var _this = this;
        var position = scrollbar.position;
        var scrollbarHeight = scrollbar.scrollbarHeight;

        if (position == "top") {
            if (rotate) {
                _this.marginLeftReal += scrollbarHeight;
            } else {
                _this.marginTopReal += scrollbarHeight;
            }
        } else {
            if (rotate) {
                _this.marginRightReal += scrollbarHeight;
            } else {
                _this.marginBottomReal += scrollbarHeight;
            }
        }
    },


    getScrollbarPosition: function(scrollbar, rotate, axisPosition) {
        var _this = this;
        var scrollbarPosition;

        if (rotate) {
            if (axisPosition == "bottom" || axisPosition == "left") {
                scrollbarPosition = "bottom";
            } else {
                scrollbarPosition = "top";
            }
        } else {
            if (axisPosition == "top" || axisPosition == "right") {
                scrollbarPosition = "bottom";
            } else {
                scrollbarPosition = "top";
            }
        }
        scrollbar.position = scrollbarPosition;
    },


    updateChartScrollbar: function(scrollbar, rotate) {
        var _this = this;
        if (scrollbar) {
            scrollbar.rotate = rotate;
            var position = scrollbar.position;
            var marginTopReal = _this.marginTopReal;
            var marginLeftReal = _this.marginLeftReal;
            var scrollbarHeight = scrollbar.scrollbarHeight;
            var dx = _this.dx;
            var dy = _this.dy;

            if (position == "top") {
                //[Begin]: add 
                marginTopReal -= 5;
                //[End]: add 
                if (rotate) {
                    scrollbar.y = marginTopReal;
                    scrollbar.x = marginLeftReal - scrollbarHeight;
                } else {
                    scrollbar.y = marginTopReal - scrollbarHeight + dy;
                    scrollbar.x = marginLeftReal + dx;
                }
            } else {
                if (rotate) {
                    scrollbar.y = marginTopReal + dy;
                    scrollbar.x = marginLeftReal + _this.plotAreaWidth + dx;
                } else {
                    scrollbar.y = marginTopReal + _this.plotAreaHeight + 1;
                    scrollbar.x = _this.marginLeftReal;
                }
            }
        }
    },

    showZB: function(show) {
        var _this = this;
        var zbSet = _this.zbSet;
        if (zbSet) {
            if (show) {
                zbSet.show();
            } else {
                zbSet.hide();
            }
            _this.zbBG.hide();
        }
    },

    handleReleaseOutside: function(e) {
        var _this = this;
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(_this, e);

        var chartCursor = _this.chartCursor;
        if (chartCursor) {
            chartCursor.handleReleaseOutside();
        }
    },

    handleMouseDown: function(e) {
        var _this = this;
        AmCharts.AmRectangularChart.base.handleMouseDown.call(_this, e);
        var chartCursor = _this.chartCursor;
        if (chartCursor) {
            chartCursor.handleMouseDown(e);
        }
    },


    handleCursorChange: function(event) {
        //void
    }

});;
AmCharts.TrendLine = AmCharts.Class({
    construct: function() {
        var _this = this;

        _this.createEvents('click');
        _this.isProtected = false;
        _this.dashLength = 0;
        _this.lineColor = "#00CC00";
        _this.lineAlpha = 1;
        _this.lineThickness = 1;
    },

    draw: function() {
        var _this = this;
        _this.destroy();
        var chart = _this.chart;
        var container = chart.container;

        var x1;
        var x2;
        var y1;
        var y2;

        var categoryAxis = _this.categoryAxis;
        var initialDate = _this.initialDate;
        var initialCategory = _this.initialCategory;
        var finalDate = _this.finalDate;
        var finalCategory = _this.finalCategory;
        var valueAxis = _this.valueAxis;
        var valueAxisX = _this.valueAxisX;
        var initialXValue = _this.initialXValue;
        var finalXValue = _this.finalXValue;
        var initialValue = _this.initialValue;
        var finalValue = _this.finalValue;

        var recalculateToPercents = valueAxis.recalculateToPercents;

        if (categoryAxis) {
            if (initialDate) {
                x1 = categoryAxis.dateToCoordinate(initialDate);
            }
            if (initialCategory) {
                x1 = categoryAxis.categoryToCoordinate(initialCategory);
            }
            if (finalDate) {
                x2 = categoryAxis.dateToCoordinate(finalDate);
            }
            if (finalCategory) {
                x2 = categoryAxis.categoryToCoordinate(finalCategory);
            }
        }

        if (valueAxisX) {
            if (!recalculateToPercents) {
                if (!isNaN(initialXValue)) {
                    x1 = valueAxisX.getCoordinate(initialXValue);
                }
                if (!isNaN(finalXValue)) {
                    x2 = valueAxisX.getCoordinate(finalXValue);
                }
            }
        }

        if (valueAxis) {
            if (!recalculateToPercents) {
                if (!isNaN(initialValue)) {
                    y1 = valueAxis.getCoordinate(initialValue);
                }
                if (!isNaN(finalValue)) {
                    y2 = valueAxis.getCoordinate(finalValue);
                }
            }
        }

        if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y1)) {
            var rotate = chart.rotate;
            var xa;
            var ya;

            if (rotate) {
                xa = [y1, y2];
                ya = [x1, x2];
            } else {
                xa = [x1, x2];
                ya = [y1, y2];
            }

            var lineColor = _this.lineColor;
            var line = AmCharts.line(container, xa, ya, lineColor, _this.lineAlpha, _this.lineThickness, _this.dashLength);
            var hoverLine = AmCharts.line(container, xa, ya, lineColor, 0.005, 5);

            var set = container.set([line, hoverLine]);
            set.translate(chart.marginLeftReal, chart.marginTopReal);
            chart.trendLinesSet.push(set);

            _this.line = line;
            _this.set = set;

            hoverLine.mouseup(function() {
                _this.handleLineClick();
            }).mouseover(function() {
                _this.handleLineOver();
            }).mouseout(function() {
                _this.handleLineOut();
            });

            if (hoverLine.touchend) {
                hoverLine.touchend(function() {
                    _this.handleLineClick();
                })
            }
        }
    },

    handleLineClick: function() {
        var _this = this;
        var event = {
            type: "click",
            trendLine: this,
            chart: _this.chart
        };
        _this.fire(event.type, event);
    },

    handleLineOver: function() {
        var _this = this;
        var rollOverColor = _this.rollOverColor;
        if (rollOverColor != undefined) {
            _this.line.attr({
                stroke: rollOverColor
            });
        }
    },

    handleLineOut: function() {
        var _this = this;
        _this.line.attr({
            stroke: _this.lineColor
        });
    },

    destroy: function() {
        AmCharts.remove(this.set);
    }
});;
AmCharts.AmSerialChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,

    construct: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.construct.call(_this);

        _this.createEvents('changed');
        _this.createEvents("rendered");
        _this.columnSpacing = 5;
        _this.columnWidth = 0.8;
        _this.updateScrollbar = true;

        var categoryAxis = new AmCharts.CategoryAxis();
        categoryAxis.chart = this;
        _this.categoryAxis = categoryAxis;

        _this.chartType = "serial";
        _this.zoomOutOnDataUpdate = true;
        _this.skipZoom = false;

        // _this.maxSelectedSeries;
        // _this.maxSelectedTime;
        _this.minSelectedTime = 0;
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.initChart.call(_this);
        _this.updateCategoryAxis();


        if (_this.dataChanged) {
            _this.updateData();
            _this.dataChanged = false;
            _this.dispatchDataUpdated = true;
        }

        var chartCursor = _this.chartCursor;
        if (chartCursor) {
            chartCursor.updateData();
        }

        var columnCount = _this.countColumns();

        var graphs = _this.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.columnCount = columnCount;
        }


        _this.updateScrollbar = true;
        _this.drawChart();

        if (_this.autoMargins && !_this.marginsUpdated) {
            _this.marginsUpdated = true;
            _this.measureMargins();
        }
        _this.fire("rendered", {
            type: "rendered",
            chart: _this
        });
    },

    validateData: function(resetZoom) {
        var _this = this;

        _this.marginsUpdated = false;
        if (_this.zoomOutOnDataUpdate && !resetZoom) {
            _this.start = NaN;
            _this.startTime = NaN;
            _this.end = NaN;
            _this.endTime = NaN;
        }

        AmCharts.AmSerialChart.base.validateData.call(_this);
    },

    drawChart: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.drawChart.call(_this);

        var chartData = _this.chartData;

        if (AmCharts.ifArray(chartData)) {

            var chartScrollbar = _this.chartScrollbar;
            if (chartScrollbar) {
                chartScrollbar.draw();
            }

            if (_this.realWidth > 0 && _this.realHeight > 0) {
                // zoom				
                var last = chartData.length - 1;
                var start;
                var end;

                var categoryAxis = _this.categoryAxis;
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    start = _this.startTime;
                    end = _this.endTime;

                    if (isNaN(start) || isNaN(end)) {
                        start = chartData[0].time;
                        end = chartData[last].time;
                    }
                } else {
                    start = _this.start;
                    end = _this.end;

                    if (isNaN(start) || isNaN(end)) {
                        start = 0;
                        end = last;
                    }
                }

                _this.start = undefined;
                _this.end = undefined;
                _this.startTime = undefined;
                _this.endTime = undefined;

                _this.zoom(start, end);
            }

        } else {
            _this.cleanChart();
        }
        _this.dispDUpd();
        _this.chartCreated = true;
    },

    cleanChart: function() {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.valueAxes, _this.graphs, _this.categoryAxis, _this.chartScrollbar, _this.chartCursor]);
    },

    updateCategoryAxis: function() {
        var _this = this;
        var categoryAxis = _this.categoryAxis;
        categoryAxis.id = "categoryAxis";
        categoryAxis.rotate = _this.rotate;
        categoryAxis.axisRenderer = AmCharts.RecAxis;
        categoryAxis.guideFillRenderer = AmCharts.RecFill;
        categoryAxis.axisItemRenderer = AmCharts.RecItem;
        categoryAxis.setOrientation(!_this.rotate)
        categoryAxis.x = _this.marginLeftReal;
        categoryAxis.y = _this.marginTopReal;
        categoryAxis.dx = _this.dx;
        categoryAxis.dy = _this.dy;
        categoryAxis.width = _this.plotAreaWidth - 1;
        categoryAxis.height = _this.plotAreaHeight - 1;
        categoryAxis.viW = _this.plotAreaWidth - 1;
        categoryAxis.viH = _this.plotAreaHeight - 1;
        categoryAxis.viX = _this.marginLeftReal;
        categoryAxis.viY = _this.marginTopReal;
        categoryAxis.marginsChanged = true;
    },

    updateValueAxes: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.updateValueAxes.call(_this);

        var valueAxes = _this.valueAxes;
        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];
            var rotate = _this.rotate;
            valueAxis.rotate = rotate;
            valueAxis.setOrientation(rotate);

            var categoryAxis = _this.categoryAxis;

            if (!categoryAxis.startOnAxis || categoryAxis.parseDates) {
                valueAxis.expandMinMax = true;
            }
        }
    },

    updateData: function() {
        var _this = this;

        _this.parseData();
        var graphs = _this.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.data = _this.chartData;
        }
    },

    updateMargins: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.updateMargins.call(_this);

        var scrollbar = _this.chartScrollbar;

        if (scrollbar) {
            _this.getScrollbarPosition(scrollbar, _this.rotate, _this.categoryAxis.position);
            _this.adjustMargins(scrollbar, _this.rotate);
        }
    },

    updateScrollbars: function() {
        var _this = this;
        _this.updateChartScrollbar(_this.chartScrollbar, _this.rotate);
    },


    zoom: function(start, end) {
        var _this = this;
        var categoryAxis = _this.categoryAxis;

        if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
            _this.timeZoom(start, end);
        } else {
            _this.indexZoom(start, end);
        }
    },


    timeZoom: function(startTime, endTime) {
        var _this = this;
        var maxSelectedTime = _this.maxSelectedTime;
        if (!isNaN(maxSelectedTime)) {
            if (endTime != _this.endTime) {
                if (endTime - startTime > maxSelectedTime) {
                    startTime = endTime - maxSelectedTime;
                    _this.updateScrollbar = true;
                }
            }

            if (startTime != _this.startTime) {
                if (endTime - startTime > maxSelectedTime) {
                    endTime = startTime + maxSelectedTime;
                    _this.updateScrollbar = true;
                }
            }
        }

        var minSelectedTime = _this.minSelectedTime;
        if (minSelectedTime > 0 && endTime - startTime < minSelectedTime) {
            var middleTime = Math.round(startTime + (endTime - startTime) / 2);
            var delta = Math.round(minSelectedTime / 2);
            startTime = middleTime - delta;
            endTime = middleTime + delta;
        }

        var chartData = _this.chartData;
        var categoryAxis = _this.categoryAxis;

        if (AmCharts.ifArray(chartData)) {
            if (startTime != _this.startTime || endTime != _this.endTime) {
                // check whether start and end time is not the same (or the difference is less then the duration of the shortest period)
                var minDuration = categoryAxis.minDuration();

                var firstTime = chartData[0].time;
                _this.firstTime = firstTime;

                var lastTime = chartData[chartData.length - 1].time;
                _this.lastTime = lastTime;

                if (!startTime) {
                    startTime = firstTime;
                    if (!isNaN(maxSelectedTime)) {
                        startTime = lastTime - maxSelectedTime;
                    }
                }

                if (!endTime) {
                    endTime = lastTime;
                }

                if (startTime > lastTime) {
                    startTime = lastTime;
                }

                if (endTime < firstTime) {
                    endTime = firstTime;
                }

                if (startTime < firstTime) {
                    startTime = firstTime;
                }

                if (endTime > lastTime) {
                    endTime = lastTime;
                }

                if (endTime < startTime) {
                    endTime = startTime + minDuration;
                }

                _this.startTime = startTime;
                _this.endTime = endTime;

                var lastIndex = chartData.length - 1;
                var start = _this.getClosestIndex(chartData, "time", startTime, true, 0, lastIndex);
                var end = _this.getClosestIndex(chartData, "time", endTime, false, start, lastIndex);

                categoryAxis.timeZoom(startTime, endTime);
                categoryAxis.zoom(start, end);

                _this.start = AmCharts.fitToBounds(start, 0, lastIndex);
                _this.end = AmCharts.fitToBounds(end, 0, lastIndex);

                _this.zoomAxesAndGraphs();
                _this.zoomScrollbar();

                if (startTime != firstTime || endTime != lastTime) {
                    _this.showZB(true);
                } else {
                    _this.showZB(false);
                }

                _this.updateColumnsDepth();
                _this.dispatchTimeZoomEvent();
            }
        }
    },

    indexZoom: function(start, end) {
        var _this = this;
        var maxSelectedSeries = _this.maxSelectedSeries;
        if (!isNaN(maxSelectedSeries)) {
            if (end != _this.end) {
                if (end - start > maxSelectedSeries) {
                    start = end - maxSelectedSeries;
                    _this.updateScrollbar = true;
                }
            }

            if (start != _this.start) {
                if (end - start > maxSelectedSeries) {
                    end = start + maxSelectedSeries;
                    _this.updateScrollbar = true;
                }
            }
        }

        if (start != _this.start || end != _this.end) {
            var last = _this.chartData.length - 1;

            if (isNaN(start)) {
                start = 0;

                if (!isNaN(maxSelectedSeries)) {
                    start = last - maxSelectedSeries;
                }
            }

            if (isNaN(end)) {
                end = last;
            }

            if (end < start) {
                end = start;
            }

            if (end > last) {
                end = last;
            }

            if (start > last) {
                start = last - 1;
            }

            if (start < 0) {
                start = 0;
            }

            _this.start = start;
            _this.end = end;

            _this.categoryAxis.zoom(start, end);
            _this.zoomAxesAndGraphs();
            _this.zoomScrollbar();

            if (start != 0 || end != _this.chartData.length - 1) {
                _this.showZB(true);
            } else {
                _this.showZB(false);
            }
            _this.updateColumnsDepth();
            _this.dispatchIndexZoomEvent();
        }
    },

    updateGraphs: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.updateGraphs.call(_this);

        var graphs = _this.graphs;

        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.columnWidth = _this.columnWidth;
            graph.categoryAxis = _this.categoryAxis;
        }
    },


    updateColumnsDepth: function() {
        var _this = this;
        var i;
        var graphs = _this.graphs;
        AmCharts.remove(_this.columnsSet);
        _this.columnsArray = [];

        for (i = 0; i < graphs.length; i++) {
            var graph = graphs[i];

            var graphColumnsArray = graph.columnsArray;

            if (graphColumnsArray) {
                for (var j = 0; j < graphColumnsArray.length; j++) {
                    _this.columnsArray.push(graphColumnsArray[j]);
                }
            }
        }

        _this.columnsArray.sort(_this.compareDepth);

        var count = _this.columnsArray.length;
        if (count > 0) {
            var columnsSet = _this.container.set();
            _this.columnSet.push(columnsSet);

            for (i = 0; i < _this.columnsArray.length; i++) {
                columnsSet.push(_this.columnsArray[i].column.set);
            }

            if (graph) {
                columnsSet.translate(graph.x, graph.y);
            }

            _this.columnsSet = columnsSet;
            /**
             * 添加cuboidURL属性，为图添加阴影效果
             */
            if (_this.columnsSet && _this.container.R && _this.container.R.cuboidURL) {
                if (_this.columnsSet.children) {
                    var temp = _this.columnsSet.children;
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[i].children) {
                            var seTemp = temp[i].children;
                            for (var j = 0; j < seTemp.length; j++) {
                                var filter = seTemp[j].node.getAttribute("filter");
                                if (!filter) {
                                    seTemp[j].node.setAttribute("filter", _this.container.R.cuboidURL);
                                }
                            }
                        }
                    }
                }
            }
            //===== add end ====================
        }
    },

    compareDepth: function(a, b) {
        if (a.depth > b.depth) {
            return 1
        } else {
            return -1;
        }
    },

    zoomScrollbar: function() {
        var _this = this;
        var chartScrollbar = _this.chartScrollbar;
        var categoryAxis = _this.categoryAxis;
        if (chartScrollbar) {
            if (_this.updateScrollbar) {
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    chartScrollbar.timeZoom(_this.startTime, _this.endTime);
                } else {
                    chartScrollbar.zoom(_this.start, _this.end);
                }
                _this.updateScrollbar = true;
            }
        }
    },

    updateTrendLines: function() {
        var _this = this;

        var trendLines = _this.trendLines;

        for (var i = 0; i < trendLines.length; i++) {
            var trendLine = trendLines[i];
            trendLine.chart = this;

            if (!trendLine.valueAxis) {
                trendLine.valueAxis = _this.valueAxes[0];
            }
            trendLine.categoryAxis = _this.categoryAxis;
        }
    },


    zoomAxesAndGraphs: function() {
        var _this = this;
        if (!_this.scrollbarOnly) {
            var valueAxes = _this.valueAxes;
            for (var i = 0; i < valueAxes.length; i++) {
                var valueAxis = valueAxes[i];
                valueAxis.zoom(_this.start, _this.end);
            }

            var graphs = _this.graphs;
            for (i = 0; i < graphs.length; i++) {
                var graph = graphs[i];
                graph.zoom(_this.start, _this.end);
            }

            _this.zoomTrendLines();

            var chartCursor = _this.chartCursor;
            if (chartCursor) {
                chartCursor.zoom(_this.start, _this.end, _this.startTime, _this.endTime);
            }
        }
    },

    countColumns: function() {
        var _this = this;
        var count = 0;

        var axisCount = _this.valueAxes.length;
        var graphCount = _this.graphs.length;
        var graph;
        var axis;
        var counted = false;

        var j;
        for (var i = 0; i < axisCount; i++) {
            axis = _this.valueAxes[i];
            var stackType = axis.stackType;

            if (stackType == "100%" || stackType == "regular") {
                counted = false;
                for (j = 0; j < graphCount; j++) {
                    graph = _this.graphs[j];
                    if (!graph.hidden) {
                        if (graph.valueAxis == axis && graph.type == "column") {
                            if (!counted && graph.stackable) {
                                count++;
                                counted = true;
                            }

                            if (!graph.stackable) {
                                count++;
                            }
                            graph.columnIndex = count - 1;
                        }
                    }
                }
            }

            if (stackType == "none" || stackType == "3d") {
                for (j = 0; j < graphCount; j++) {
                    graph = _this.graphs[j];
                    if (!graph.hidden) {
                        if (graph.valueAxis == axis && graph.type == "column") {

                            graph.columnIndex = count;
                            count++;
                        }
                    }
                }
            }
            if (stackType == "3d") {
                for (i = 0; i < graphCount; i++) {
                    graph = _this.graphs[i];
                    graph.depthCount = count;
                }
                count = 1;
            }
        }
        return count;
    },


    parseData: function() {
        var _this = this;
        AmCharts.AmSerialChart.base.parseData.call(_this);
        _this.parseSerialData();
    },

    getCategoryIndexByValue: function(value) {
        var _this = this;
        var chartData = _this.chartData;
        var index;
        for (var i = 0; i < chartData.length; i++) {
            if (chartData[i].category == value) {
                index = i;
            }
        }
        return index;
    },

    handleCursorChange: function(event) {
        this.updateLegendValues(event.index);
    },

    handleCursorZoom: function(event) {
        var _this = this;
        _this.updateScrollbar = true;
        _this.zoom(event.start, event.end);
    },

    handleScrollbarZoom: function(event) {
        var _this = this;
        _this.updateScrollbar = false;
        _this.zoom(event.start, event.end);
    },

    dispatchTimeZoomEvent: function() {
        var _this = this;
        if (_this.prevStartTime != _this.startTime || _this.prevEndTime != _this.endTime) {
            var e = {};
            e.type = "zoomed";
            e.startDate = new Date(_this.startTime);
            e.endDate = new Date(_this.endTime);
            e.startIndex = _this.start;
            e.endIndex = _this.end;
            _this.startIndex = _this.start;
            _this.endIndex = _this.end;
            _this.startDate = e.startDate;
            _this.endDate = e.endDate;

            _this.prevStartTime = _this.startTime;
            _this.prevEndTime = _this.endTime;
            var categoryAxis = _this.categoryAxis;

            var minPeriod = AmCharts.extractPeriod(categoryAxis.minPeriod).period;
            var dateFormat = categoryAxis.dateFormatsObject[minPeriod];

            e.startValue = AmCharts.formatDate(e.startDate, dateFormat);
            e.endValue = AmCharts.formatDate(e.endDate, dateFormat);
            e.chart = _this;
            e.target = _this;
            _this.fire(e.type, e);
        }
    },

    dispatchIndexZoomEvent: function() {
        var _this = this;
        if (_this.prevStartIndex != _this.start || _this.prevEndIndex != _this.end) {
            _this.startIndex = _this.start;
            _this.endIndex = _this.end;
            var chartData = _this.chartData;
            if (AmCharts.ifArray(chartData)) {
                if (!isNaN(_this.start) && !isNaN(_this.end)) {
                    var e = {};
                    e.chart = _this;
                    e.target = _this;
                    e.type = "zoomed";
                    e.startIndex = _this.start;
                    e.endIndex = _this.end;
                    e.startValue = chartData[_this.start].category;
                    e.endValue = chartData[_this.end].category;

                    if (_this.categoryAxis.parseDates) {
                        _this.startTime = chartData[_this.start].time;
                        _this.endTime = chartData[_this.end].time;

                        e.startDate = new Date(_this.startTime);
                        e.endDate = new Date(_this.endTime);
                    }
                    _this.prevStartIndex = _this.start;
                    _this.prevEndIndex = _this.end;

                    _this.fire(e.type, e);
                }
            }
        }
    },

    updateLegendValues: function(index) {
        var _this = this;
        var graphs = _this.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];

            if (isNaN(index)) {
                graph.currentDataItem = undefined;
            } else {
                var serialDataItem = _this.chartData[index];
                var graphDataItem = serialDataItem.axes[graph.valueAxis.id].graphs[graph.id];
                graph.currentDataItem = graphDataItem;
            }
        }
        if (_this.legend) {
            _this.legend.updateValues();
        }
    },


    getClosestIndex: function(ac, field, value, first, start, end) {
        var _this = this;
        if (start < 0) {
            start = 0;
        }

        if (end > ac.length - 1) {
            end = ac.length - 1;
        }

        // middle index
        var index = start + Math.round((end - start) / 2);
        // middle value
        var valueAtIndex = ac[index][field];
        if (end - start <= 1) {
            if (first) {
                return start;
            } else {
                var valueAtStart = ac[start][field];
                var valueAtEnd = ac[end][field];

                if (Math.abs(valueAtStart - value) < Math.abs(valueAtEnd - value)) {
                    return start;
                } else {
                    return end;
                }
            }
        }

        if (value == valueAtIndex) {
            return index;
        }
        // go to left
        else if (value < valueAtIndex) {
            return _this.getClosestIndex(ac, field, value, first, start, index);
        }
        // go to right
        else {
            return _this.getClosestIndex(ac, field, value, first, index, end);
        }
    },

    zoomToIndexes: function(start, end) {
        var _this = this;
        _this.updateScrollbar = true;
        var chartData = _this.chartData;
        if (chartData) {
            var length = chartData.length;
            if (length > 0) {
                if (start < 0) {
                    start = 0;
                }

                if (end > length - 1) {
                    end = length - 1;
                }

                var categoryAxis = _this.categoryAxis;
                if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                    _this.zoom(chartData[start].time, chartData[end].time);
                } else {
                    _this.zoom(start, end);
                }
            }
        }
    },

    zoomToDates: function(start, end) {
        var _this = this;
        _this.updateScrollbar = true;
        var chartData = _this.chartData;
        if (_this.categoryAxis.equalSpacing) {
            var startIndex = _this.getClosestIndex(chartData, "time", start.getTime(), true, 0, chartData.length);
            var endIndex = _this.getClosestIndex(chartData, "time", end.getTime(), false, 0, chartData.length);

            _this.zoom(startIndex, endIndex);
        } else {
            _this.zoom(start.getTime(), end.getTime());
        }
    },

    zoomToCategoryValues: function(start, end) {
        var _this = this;
        _this.updateScrollbar = true;
        _this.zoom(_this.getCategoryIndexByValue(start), _this.getCategoryIndexByValue(end));
    },

    formatString: function(text, dItem) {
        var _this = this;
        var graph = dItem.graph;

        if (text.indexOf("[[category]]") != -1) {
            var category = dItem.serialDataItem.category;
            var categoryAxis = _this.categoryAxis;

            if (categoryAxis.parseDates) {
                var dateFormat = _this.balloonDateFormat;
                var chartCursor = _this.chartCursor;
                if (chartCursor) {
                    dateFormat = chartCursor.categoryBalloonDateFormat;
                }

                if (text.indexOf("[[category]]") != -1) {
                    var formattedDate = AmCharts.formatDate(category, dateFormat);

                    if (formattedDate.indexOf("fff") != -1) {
                        formattedDate = AmCharts.formatMilliseconds(formattedDate, category);
                    }
                    category = formattedDate;
                }
            }
            text = text.replace(/\[\[category\]\]/g, String(category));
        }

        var numberFormatter = graph.numberFormatter;
        if (!numberFormatter) {
            numberFormatter = _this.numberFormatter;
        }

        var valueAxis = dItem.graph.valueAxis;
        var duration = valueAxis.duration;

        if (duration && !isNaN(dItem.values.value)) {
            var fDuration = AmCharts.formatDuration(dItem.values.value, duration, "", valueAxis.durationUnits, valueAxis.maxInterval, numberFormatter);
            var regExp = new RegExp("\\[\\[value\\]\\]", "g");
            text = text.replace(regExp, fDuration);
        }

        var keys = ["value", "open", "low", "high", "close", "total"];
        var percentFormatter = _this.percentFormatter;

        text = AmCharts.formatValue(text, dItem.percents, keys, percentFormatter, "percents\.");
        text = AmCharts.formatValue(text, dItem.values, keys, numberFormatter, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
        text = AmCharts.formatValue(text, dItem.values, ["percents"], percentFormatter);

        if (text.indexOf("[[") != -1) {
            text = AmCharts.formatDataContextValue(text, dItem.dataContext);
        }

        text = AmCharts.AmSerialChart.base.formatString.call(_this, text, dItem);

        return text;
    },

    addChartScrollbar: function(chartScrollbar) {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.chartScrollbar])

        if (chartScrollbar) {
            chartScrollbar.chart = this;
            _this.listenTo(chartScrollbar, "zoomed", _this.handleScrollbarZoom);
        }

        if (_this.rotate) {
            if (chartScrollbar.width == undefined) {
                chartScrollbar.width = chartScrollbar.scrollbarHeight;
            }
        } else {
            if (chartScrollbar.height == undefined) {
                chartScrollbar.height = chartScrollbar.scrollbarHeight;
            }
        }
        _this.chartScrollbar = chartScrollbar;
    },

    removeChartScrollbar: function() {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.chartScrollbar]);
        _this.chartScrollbar = null;
    },

    handleReleaseOutside: function(e) {
        var _this = this;
        AmCharts.AmSerialChart.base.handleReleaseOutside.call(_this, e);
        AmCharts.callMethod("handleReleaseOutside", [_this.chartScrollbar]);
    }

});;
AmCharts.AmRadarChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,

    construct: function() {
        var _this = this;
        AmCharts.AmRadarChart.base.construct.call(_this);

        _this.marginLeft = 0;
        _this.marginTop = 0;
        _this.marginBottom = 0;
        _this.marginRight = 0;
        _this.chartType = "radar";
        _this.radius = "35%";
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmRadarChart.base.initChart.call(_this);

        if (_this.dataChanged) {
            _this.updateData();
            _this.dataChanged = false;
            _this.dispatchDataUpdated = true;
        }
        _this.drawChart();
    },

    updateData: function() {
        var _this = this;
        _this.parseData();

        var graphs = _this.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.data = _this.chartData;
        }
    },

    updateGraphs: function() {
        var _this = this;
        var graphs = _this.graphs;

        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.index = i;
            graph.width = _this.realRadius;
            graph.height = _this.realRadius;
            graph.x = _this.marginLeftReal;
            graph.y = _this.marginTopReal;
            graph.chartType = _this.chartType;
        }
    },

    parseData: function() {
        var _this = this;
        AmCharts.AmRadarChart.base.parseData.call(_this);
        _this.parseSerialData();
    },

    updateValueAxes: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;
        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];
            valueAxis.axisRenderer = AmCharts.RadAxis;
            valueAxis.guideFillRenderer = AmCharts.RadarFill;
            valueAxis.axisItemRenderer = AmCharts.RadItem;
            valueAxis.autoGridCount = false;

            valueAxis.x = _this.marginLeftReal;
            valueAxis.y = _this.marginTopReal;
            valueAxis.width = _this.realRadius;
            valueAxis.height = _this.realRadius;
        }
    },


    drawChart: function() {
        var _this = this;
        AmCharts.AmRadarChart.base.drawChart.call(_this);
        var realWidth = _this.updateWidth();
        var realHeight = _this.updateHeight();

        var marginTop = _this.marginTop + _this.getTitleHeight();
        var marginLeft = _this.marginLeft;
        var marginBottom = _this.marginBottom;
        var marginRight = _this.marginRight;
        var allowedHeight = realHeight - marginTop - marginBottom;
        _this.marginLeftReal = marginLeft + (realWidth - marginLeft - marginRight) / 2;
        _this.marginTopReal = marginTop + allowedHeight / 2;

        _this.realRadius = AmCharts.toCoordinate(_this.radius, realWidth, allowedHeight);

        _this.updateValueAxes();
        _this.updateGraphs();

        var chartData = _this.chartData;

        if (AmCharts.ifArray(chartData)) {
            if (_this.realWidth > 0 && _this.realHeight > 0) {
                var last = chartData.length - 1;
                var valueAxes = _this.valueAxes;
                for (var i = 0; i < valueAxes.length; i++) {
                    var valueAxis = valueAxes[i];
                    valueAxis.zoom(0, last);
                }

                var graphs = _this.graphs;
                for (var i = 0; i < graphs.length; i++) {
                    var graph = graphs[i];
                    graph.zoom(0, last);
                }
            }
        } else {
            _this.cleanChart();
        }
        _this.dispDUpd();
        _this.chartCreated = true;
    },


    formatString: function(text, dItem) {
        var _this = this;
        var graph = dItem.graph;

        if (text.indexOf("[[category]]") != -1) {
            var category = dItem.serialDataItem.category;
            text = text.replace(/\[\[category\]\]/g, String(category));
        }

        var numberFormatter = graph.numberFormatter;
        if (!numberFormatter) {
            numberFormatter = _this.numberFormatter;
        }

        var keys = ["value"];
        text = AmCharts.formatValue(text, dItem.values, keys, numberFormatter, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);

        text = AmCharts.AmRadarChart.base.formatString.call(_this, text, dItem);

        return text;
    },

    cleanChart: function() {
        var _this = this;
        _this.callMethod("destroy", [_this.valueAxes, _this.graphs]);
    }

});;
AmCharts.AxisBase = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.dx = 0;
        _this.dy = 0;
        _this.x = 0;
        _this.y = 0;
        _this.viX = 0;
        _this.viY = 0;
        _this.axisWidth;
        _this.axisThickness = 1;
        _this.axisColor = '#000000';
        _this.axisAlpha = 1;
        _this.tickLength = 5;
        _this.gridCount = 5;
        _this.gridAlpha = 0.15;
        _this.gridThickness = 1;
        _this.gridColor = '#000000';
        _this.dashLength = 0;
        _this.labelFrequency = 1;
        _this.showFirstLabel = true;
        _this.showLastLabel = true;
        _this.fillColor = '#FFFFFF';
        _this.fillAlpha = 0;
        _this.labelsEnabled = true;
        _this.labelRotation = 0;
        _this.autoGridCount = true;
        _this.valueRollOverColor = '#CC0000';
        _this.offset = 0;
        _this.guides = [];
        _this.visible = true;
        _this.counter = 0;
        _this.guides = [];
        _this.inside = false;
        _this.ignoreAxisWidth = false;
        _this.titleColor;
        _this.titleFontSize;
        _this.titleBold = true;
        //DTS2013081300532 add  start
        _this.isParseDate = false;
        //DTS2013081300532 add  end
    },

    zoom: function(start, end) {
        var _this = this;
        _this.start = start;
        _this.end = end;
        _this.dataChanged = true;
        _this.draw();
    },

    fixAxisPosition: function() {
        var _this = this;
        var pos = _this.position;

        if (_this.orientation == "H") {
            if (pos == "left") {
                pos = "bottom";
            }
            if (pos == "right") {
                pos = "top";
            }
        } else {
            if (pos == "bottom") {
                pos = "left";
            }
            if (pos == "top") {
                pos = "right";
            }
        }

        _this.position = pos;
    },

    draw: function() {
        var _this = this;
        var chart = _this.chart;

        var titleColor = _this.titleColor;
        if (titleColor == undefined) {
            _this.titleColor = chart.color;
        }

        var titleFontSize = _this.titleFontSize;
        if (isNaN(titleFontSize)) {
            _this.titleFontSize = chart.fontSize + 1;
        }

        _this.allLabels = [];
        _this.counter = 0;
        _this.destroy();
        _this.fixAxisPosition();
        _this.labels = [];

        var container = chart.container;

        var set = container.set();
        chart.gridSet.push(set);
        _this.set = set;

        var labelsSet = container.set();
        chart.axesLabelsSet.push(labelsSet);
        _this.labelsSet = labelsSet;

        _this.axisLine = new _this.axisRenderer(_this);
        var c;
        if (_this.autoGridCount) {
            if (_this.orientation == "V") {
                c = _this.height / 35;
                if (c < 3) {
                    c = 3;
                }
            } else {
                c = _this.width / 75;
                if (_this.labelRotation === 0 && !_this.isParseDate) {
                    var vdata = chart.dataProvider;
                    if (vdata) {
                        var cateField = chart.categoryField;
                        c = _this.calcGridCount(vdata, cateField, _this.width);
                        c = c + 1;
                    }
                }
            }
            _this.gridCount = c;
        }
        _this.axisWidth = _this.axisLine.axisWidth;
        _this.addTitle();
    },

    setOrientation: function(rotate) {
        var _this = this;
        if (rotate) {
            _this.orientation = "H";
        } else {
            _this.orientation = "V";
        }
    },


    addTitle: function() {

        var _this = this;
        var title = _this.title;

        //_this.titleLabel = null;
        if (title) {
            var chart = _this.chart;

            var titleLabel = AmCharts.text(chart.container, title, _this.titleColor, chart.fontFamily, _this.titleFontSize, 'middle', _this.titleBold);
            _this.titleLabel = titleLabel;
        }
    },

    positionTitle: function() {
        var _this = this;
        var titleLabel = _this.titleLabel;
        if (titleLabel) {
            var tx;
            var ty;
            var labelsSet = _this.labelsSet;
            var bbox = {};
            if (labelsSet.length() > 0) {
                bbox = labelsSet.getBBox();
            } else {
                bbox.x = 0;
                bbox.y = 0;
                bbox.width = _this.viW;
                bbox.height = _this.viH;
            }
            labelsSet.push(titleLabel);

            var bx = bbox.x;
            var by = bbox.y;

            if (AmCharts.VML) {
                if (!_this.rotate) {
                    by -= _this.y;
                } else {
                    bx -= _this.x;
                }
            }

            var bw = bbox.width;
            var bh = bbox.height;

            var w = _this.viW;
            var h = _this.viH;

            var anchor = "middle";
            var tbbox = titleLabel.getBBox();
            var r = 0;

            var fontSize = _this.titleFontSize / 2;
            var inside = _this.inside;

            switch (_this.position) {
                case "top":
                    tx = w / 2;
                    ty = by - 10 - fontSize;
                    break;
                case "bottom":
                    tx = w / 2;
                    ty = by + bh + 10 + fontSize;
                    break;
                case "left":
                    tx = bx - 10 - fontSize;

                    if (inside) {
                        tx -= 5;
                    }

                    ty = h / 2;
                    r = -90;
                    break;
                case "right":
                    tx = bx + bw + 10 + fontSize - 3;
                    if (inside) {
                        tx += 7;
                    }
                    ty = h / 2;
                    r = -90;
                    break;
            }


            if (_this.marginsChanged) {
                titleLabel.translate(tx, ty);
                _this.tx = tx;
                _this.ty = ty;
            } else {
                titleLabel.translate(_this.tx, _this.ty);
            }
            _this.marginsChanged = false;

            if (r != 0) {
                titleLabel.rotate(r);
            }
        }
    },

    pushAxisItem: function(axisItem) {
        var axisItemGraphics = axisItem.graphics();
        if (axisItemGraphics.length() > 0) {
            this.set.push(axisItemGraphics);
        }

        var label = axisItem.getLabel();
        if (label) {
            this.labelsSet.push(label);
        }
    },

    addGuide: function(guide) {
        this.guides.push(guide);
    },

    removeGuide: function(guide) {
        var guides = this.guides;
        for (var i = 0; i < guides.length; i++) {
            if (guides[i] == guide) {
                guides.splice(i, 1);
            }
        }
    },

    handleGuideOver: function(guide) {
        var _this = this;
        clearTimeout(_this.chart.hoverInt);
        var bbox = guide.graphics.getBBox();
        var x = bbox.x + bbox.width / 2;
        var y = bbox.y + bbox.height / 2;
        var color = guide.fillColor;
        if (color == undefined) {
            color = guide.lineColor;
        }
        _this.chart.showBalloon(guide.balloonText, color, true, x, y);
    },

    handleGuideOut: function(event) {
        this.chart.hideBalloon();
    },

    addEventListeners: function(graphics, guide) {
        var _this = this;
        graphics.mouseover(function() {
            _this.handleGuideOver(guide);
        });
        graphics.mouseout(function() {
            _this.handleGuideOut(guide);
        });
    },


    getBBox: function() {
        var _this = this;
        var bbox = _this.labelsSet.getBBox();

        if (!AmCharts.VML) {
            bbox = ({
                x: (bbox.x + _this.x),
                y: (bbox.y + _this.y),
                width: bbox.width,
                height: bbox.height
            });
        }
        return bbox;
    },
    //=========== start ===============
    /**
     * @description 自动计算grid count的值，如果没有data时，使用原来的方法
     * 2013-05-20
     */
    /**
     * @private
     * @description 根据数据计算x轴的grid count的个数
     * @returns {Number} 返回grid count的个数
     */
    calcGridCount: function(data, categoryField, width) {
        var _this = this;
        if (data && data.length > 1) {
            var dataLen = data.length,
                i = 0,
                totalWidth = 0,
                labelWidth = 0;
            for (i = 0; i < dataLen; i++) {
                labelWidth = _this.textSize(12, data[i][categoryField]);
                totalWidth = totalWidth + labelWidth.width + 30; //加上每两个的最小间隙30px
                if (totalWidth >= width) {
                    return i < 2 ? 1 : i - 1;
                }
            }
            return i;
        }
        return 1; //如果没有数据或者数据为1时，grid count值也为1
    },
    /**
     * @private
     * @description 计算字符串的宽度
     * @param {number} fontSize  字体大小
     * @param {string} text  字符串
     * @returns {Object} 返回字符串占有的宽度和高度
     */
    textSize: function(fontSize, text) {
        var tempTxt = text; //AmCharts.fixTxet(text);
        var span = document.createElement("span");
        var result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.visibility = "hidden";
        document.body.appendChild(span);
        if (typeof span.textContent !== "undefined") {
            span.textContent = tempTxt;
        } else {
            span.innerText = tempTxt;
        }
        result.width = span.offsetWidth - result.width;
        result.height = span.offsetHeight - result.height;
        span.parentNode.removeChild(span);
        return result;
    },
    //============ end =================
    destroy: function() {
        var _this = this;
        AmCharts.remove(_this.set);
        AmCharts.remove(_this.labelsSet);

        var axisLine = _this.axisLine;
        if (axisLine) {
            AmCharts.remove(axisLine.set);
        }
        AmCharts.remove(_this.grid0);
    }
});;
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,

    construct: function() {
        var _this = this;
        _this.createEvents('axisChanged', 'logarithmicAxisFailed', 'axisSelfZoomed', 'axisZoomed');

        AmCharts.ValueAxis.base.construct.call(this);
        _this.dataChanged = true;
        _this.gridCount = 8;
        _this.stackType = "none";
        _this.position = "left";
        _this.unitPosition = "right";
        _this.integersOnly = false;
        _this.includeGuidesInMinMax = false;
        _this.includeHidden = false;
        _this.recalculateToPercents = false;
        _this.duration;
        _this.durationUnits = {
            DD: "d. ",
            hh: ":",
            mm: ":",
            ss: ""
        };
        _this.scrollbar = false;
        _this.maxDecCount;
        _this.baseValue = 0;
        _this.radarCategoriesEnabled = true;
        _this.gridType = "polygons";
        _this.useScientificNotation = false;
        _this.axisTitleOffset = 10;
        _this.minMaxMultiplier = 1;
    },

    updateData: function() {
        var _this = this;
        if (_this.gridCount <= 0) {
            _this.gridCount = 1;
        }

        _this.totals = [];
        _this.data = _this.chart.chartData;

        if (_this.chart.chartType != "xy") {
            _this.stackGraphs("smoothedLine");
            _this.stackGraphs("line");
            _this.stackGraphs("column");
            _this.stackGraphs("step");
        }

        if (_this.recalculateToPercents) {
            _this.recalculate();
        }

        if (_this.synchronizationMultiplier && _this.synchronizeWithAxis) {
            _this.foundGraphs = true;
        } else {
            _this.foundGraphs = false;
            _this.getMinMax();
        }
    },


    /**
     * @private
     */
    draw: function() {
        var _this = this;
        AmCharts.ValueAxis.base.draw.call(_this);

        var chart = _this.chart;
        var set = _this.set;

        // thsi is to handle fallback to v.1 of flash chart only
        if (_this.type == "duration") {
            _this.duration = "ss";
        }

        if (_this.dataChanged == true) {
            _this.updateData();
            _this.dataChanged = false;
        }

        if (_this.logarithmic) {
            var min = _this.getMin(0, _this.data.length - 1);

            if (min <= 0 || _this.minimum <= 0) {
                var eType = 'logarithmicAxisFailed';
                _this.fire(eType, {
                    type: eType,
                    chart: chart
                });
                return;
            }
        }

        _this.grid0 = null;

        var coord;
        var i;
        var dx = chart.dx;
        var dy = chart.dy;
        var hide = false;
        var logarithmic = _this.logarithmic;
        var chartType = chart.chartType;

        if (!isNaN(_this.min) && !isNaN(_this.max) && _this.foundGraphs && _this.min != Infinity && _this.max != -Infinity) {
            var labelFrequency = _this.labelFrequency;
            var showFirstLabel = _this.showFirstLabel;
            var showLastLabel = _this.showLastLabel;
            var frequency = 1;
            var startCount = 0;

            // the number of grid lines
            var gridCountReal = Math.round((_this.max - _this.min) / _this.step) + 1;

            // LOGARITHMIC
            if (logarithmic == true) {
                var degrees = Math.log(_this.max) * Math.LOG10E - Math.log(_this.minReal) * Math.LOG10E;
                _this.stepWidth = _this.axisWidth / degrees;
                // in case we have more degrees, draw grid every degree only
                if (degrees > 2) {
                    gridCountReal = Math.ceil((Math.log(_this.max) * Math.LOG10E)) + 1;
                    startCount = Math.round((Math.log(_this.minReal) * Math.LOG10E));
                    if (gridCountReal > _this.gridCount) {
                        frequency = Math.ceil(gridCountReal / _this.gridCount);
                    }
                }
            }
            // LINEAR
            else {
                // the width of one value
                _this.stepWidth = _this.axisWidth / (_this.max - _this.min);
            }

            var numbersAfterDecimal = 0;
            if (_this.step < 1 && _this.step > -1) {
                numbersAfterDecimal = _this.getDecimals(_this.step);
            }

            if (_this.integersOnly) {
                numbersAfterDecimal = 0;
            }

            if (numbersAfterDecimal > _this.maxDecCount) {
                numbersAfterDecimal = _this.maxDecCount;
            }

            if (!isNaN(_this.precision)) {
                numbersAfterDecimal = _this.precision;
            }
            _this.max = AmCharts.roundTo(_this.max, _this.maxDecCount);
            _this.min = AmCharts.roundTo(_this.min, _this.maxDecCount);

            var numberFormatter = {};
            numberFormatter.precision = numbersAfterDecimal;
            numberFormatter.decimalSeparator = chart.numberFormatter.decimalSeparator;
            numberFormatter.thousandsSeparator = chart.numberFormatter.thousandsSeparator;
            _this.numberFormatter = numberFormatter;

            // draw guides
            var guides = _this.guides;
            var count = guides.length;
            if (count > 0) {
                var fillAlphaReal = _this.fillAlpha;
                _this.fillAlpha = 0; // this may seam strange, but is for addValue method not to draw fill
                for (i = 0; i < count; i++) {
                    var guide = guides[i];
                    var guideToCoord = NaN;
                    if (!isNaN(guide.toValue)) {
                        guideToCoord = _this.getCoordinate(guide.toValue);
                        var axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                        _this.pushAxisItem(axisItem);
                    }

                    var guideCoord = NaN;

                    if (!isNaN(guide.value)) {
                        guideCoord = _this.getCoordinate(guide.value);
                        var valueShift = (guideToCoord - guideCoord) / 2;
                        var axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, true, NaN, valueShift, guide);
                        _this.pushAxisItem(axisItem);
                    }

                    if (!isNaN(guideToCoord - guideCoord)) {
                        var guideFill = new _this.guideFillRenderer(this, guideCoord, guideToCoord, guide);
                        _this.pushAxisItem(guideFill);
                        var guideFillGraphics = guideFill.graphics();
                        guide.graphics = guideFillGraphics;
                        if (guide.balloonText) {
                            _this.addEventListeners(guideFillGraphics, guide);
                        }
                    }
                }
                _this.fillAlpha = fillAlphaReal;
            }

            var exponential = false;

            var minMant = Number.MAX_VALUE;

            for (i = startCount; i < gridCountReal; i += frequency) {
                var val = AmCharts.roundTo(_this.step * i + _this.min, numbersAfterDecimal);

                if (String(val).indexOf("e") != -1) {
                    exponential = true;

                    var vStrArr = String(val).split("e");
                    var vMant = Number(vStrArr[1]);
                }
            }

            if (_this.duration) {
                _this.maxInterval = AmCharts.getMaxInterval(_this.max, _this.duration);
            }

            for (i = startCount; i < gridCountReal; i += frequency) {
                var value = _this.step * i + _this.min;

                value = AmCharts.roundTo(value, _this.maxDecCount + 1);

                if (_this.integersOnly && Math.round(value) != value) {
                    // void
                } else {
                    if (logarithmic == true) {
                        if (value == 0) {
                            value = _this.minReal;
                        }
                        if (degrees > 2) {
                            value = Math.pow(10, i);
                        }

                        if (String(value).indexOf("e") != -1) {
                            exponential = true;
                        } else {
                            exponential = false;
                        }
                    }

                    var valueText;

                    if (_this.useScientificNotation) {
                        exponential = true;
                    }

                    if (_this.usePrefixes) {
                        exponential = false;
                    }

                    if (!exponential) {
                        if (logarithmic) {
                            var temp = String(value).split(".");
                            if (temp[1]) {
                                numberFormatter.precision = temp[1].length;
                            } else {
                                numberFormatter.precision = -1;
                            }
                        }

                        if (_this.usePrefixes) {
                            valueText = AmCharts.addPrefix(value, chart.prefixesOfBigNumbers, chart.prefixesOfSmallNumbers, numberFormatter);
                        } else {
                            valueText = AmCharts.formatNumber(value, numberFormatter, numberFormatter.precision);
                        }

                    } else {
                        if (String(value).indexOf("e") == -1) {
                            valueText = value.toExponential(15);
                        } else {
                            valueText = String(value);
                        }

                        var valStrArr = valueText.split("e");
                        var valBase = Number(valStrArr[0]);
                        var valMant = Number(valStrArr[1]);

                        valBase = AmCharts.roundTo(valBase, 14);

                        if (valBase == 10) {
                            valBase = 1;
                            valMant += 1;
                        }

                        valueText = valBase + "e" + valMant;

                        if (value == 0) {
                            valueText = "0";
                        }
                        if (value == 1) {
                            valueText = "1";
                        }
                    }

                    if (_this.duration) {
                        valueText = AmCharts.formatDuration(value, _this.duration, "", _this.durationUnits, _this.maxInterval, numberFormatter);
                    }

                    if (_this.recalculateToPercents) {
                        valueText = valueText + "%";
                    } else {
                        var unit = _this.unit;
                        if (unit) {
                            if (_this.unitPosition == "left") {
                                valueText = unit + valueText;
                            } else {
                                valueText = valueText + unit;
                            }
                        }
                    }
                    if (Math.round(i / labelFrequency) != i / labelFrequency) {
                        valueText = undefined;
                    }

                    if ((i == 0 && !showFirstLabel) || (i == (gridCountReal - 1) && !showLastLabel)) {
                        valueText = " ";
                    }

                    coord = _this.getCoordinate(value);

                    var axisItem = new _this.axisItemRenderer(this, coord, valueText);
                    _this.pushAxisItem(axisItem);

                    if (value == _this.baseValue && chartType != "radar") {
                        var xx;
                        var yy;

                        var ww = _this.viW;
                        var hh = _this.viH;
                        var vx = _this.viX;
                        var vy = _this.viY;

                        if (_this.orientation == "H") {
                            if (coord >= 0 && coord <= ww + 1) {
                                xx = [coord, coord, coord + dx];
                                yy = [hh, 0, dy];
                            }
                        } else {
                            if (coord >= 0 && coord <= hh + 1) {
                                xx = [0, ww, ww + dx];
                                yy = [coord, coord, coord + dy];
                            }
                        }

                        if (xx) {
                            var gridAlpha = AmCharts.fitToBounds(_this.gridAlpha * 2, 0, 1);

                            var grid0 = AmCharts.line(chart.container, xx, yy, _this.gridColor, gridAlpha, 1, _this.dashLength);
                            grid0.translate(vx, vy);
                            _this.grid0 = grid0;
                            chart.axesSet.push(grid0);
                            grid0.toBack();
                        }
                    }
                }
            }

            // BASE VALUE
            var base = _this.baseValue;

            // if the min is > 0, then the base value is equal to min
            if (_this.min > _this.baseValue && _this.max > _this.baseValue) {
                base = _this.min;
            }

            // if both min and max are less then zero, then the base value is equal to max
            if (_this.min < _this.baseValue && _this.max < _this.baseValue) {
                base = _this.max;
            }

            if (logarithmic && base < _this.minReal) {
                base = _this.minReal;
            }

            _this.baseCoord = _this.getCoordinate(base);

            var name = "axisChanged";
            var event = {
                type: name,
                target: _this,
                chart: chart
            };

            if (logarithmic) {
                event.min = _this.minReal;
            } else {
                event.min = _this.min;
            }
            event.max = _this.max;

            _this.fire(name, event);

            _this.axisCreated = true;
        } else {
            hide = true;
        }

        var axisLineSet = _this.axisLine.set;
        var labelsSet = _this.labelsSet;

        _this.positionTitle();

        if (chartType != "radar") {
            var viX = _this.viX;
            var viY = _this.viY;
            set.translate(viX, viY);
            labelsSet.translate(viX, viY);
        } else {
            axisLineSet.toFront();
        }

        if (!_this.visible || hide) {
            set.hide();
            axisLineSet.hide();
            labelsSet.hide();
        } else {
            set.show();
            axisLineSet.show();
            labelsSet.show();
        }
    },

    getDecimals: function(val) {
        var numbersAfterDecimal = 0;
        if (!isNaN(val)) {
            var str = String(val);

            if (str.indexOf("e-") != -1) {
                numbersAfterDecimal = Number(str.split("-")[1]);
            } else if (str.indexOf(".") != -1) {
                numbersAfterDecimal = str.split(".")[1].length;
            }
        }
        return numbersAfterDecimal;
    },

    stackGraphs: function(type) {
        var _this = this;
        var stackType = _this.stackType;
        if (stackType == "stacked") {
            stackType = "regular";
        }
        if (stackType == "line") {
            stackType = "none";
        }
        if (stackType == "100% stacked") {
            stackType = "100%";
        }
        _this.stackType = stackType;

        var previousValues = [];
        var previousNegativeValues = [];
        var previousPositiveValues = [];
        var sum = [];
        var value;
        var graphs = _this.chart.graphs;
        var previousGraph;
        var graphType;
        var graph;
        var graphDataItem;
        var j;
        var i;
        var baseValue = _this.baseValue;

        var lineType = false;
        if (type == "line" || type == "step" || type == "smoothedLine") {
            linetype = true;
        }

        // set stackGraphs (tells the graph to which graph it is stacked)
        if (lineType && (stackType == "regular" || stackType == "100%")) {
            for (j = 0; j < graphs.length; j++) {
                graph = graphs[j];

                if (!graph.hidden) {
                    graphType = graph.type;

                    if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                        if (previousGraph) {
                            graph.stackGraph = previousGraph;
                            previousGraph = graph;
                        } else {
                            previousGraph = graph;
                        }
                    }
                }
            }
        }



        // do the calculations
        for (i = _this.start; i <= _this.end; i++) {
            var maxDecCount = 0;
            for (j = 0; j < graphs.length; j++) {
                graph = graphs[j];
                if (!graph.hidden) {
                    graphType = graph.type;

                    if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                        graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];

                        value = graphDataItem.values.value;

                        if (!isNaN(value)) {
                            var numbersAfterDecimal = _this.getDecimals(value);
                            if (maxDecCount < numbersAfterDecimal) {
                                maxDecCount = numbersAfterDecimal;
                            }

                            if (isNaN(sum[i])) {
                                sum[i] = Math.abs(value);
                            } else {
                                sum[i] += Math.abs(value);
                            }

                            sum[i] = AmCharts.roundTo(sum[i], maxDecCount);

                            // LINE AND STEP
                            // for the bands, if no stack set but fillToGraph is set
                            var fillToGraph = graph.fillToGraph;
                            if (linetype && fillToGraph) {
                                var fillToDataItem = _this.data[i].axes[_this.id].graphs[fillToGraph.id];
                                graphDataItem.values.open = fillToDataItem.values.value;
                            }


                            if (stackType == "regular") {
                                // LINE AND STEP
                                if (linetype) {
                                    // if previous value is not present 												
                                    if (isNaN(previousValues[i])) {
                                        previousValues[i] = value;
                                        graphDataItem.values.close = value;
                                        graphDataItem.values.open = _this.baseValue;
                                    }
                                    // if previous value is present
                                    else {
                                        if (isNaN(value)) {
                                            graphDataItem.values.close = previousValues[i];
                                            graphDataItem.values.open = previousValues[i];
                                        } else {
                                            graphDataItem.values.close = value + previousValues[i];
                                            graphDataItem.values.open = previousValues[i];
                                        }
                                        previousValues[i] = graphDataItem.values.close;
                                    }
                                }

                                // COLUMN
                                if (type == "column") {
                                    if (!isNaN(value)) {
                                        graphDataItem.values.close = value;

                                        if (value < 0) {
                                            graphDataItem.values.close = value;
                                            if (!isNaN(previousNegativeValues[i])) {
                                                graphDataItem.values.close += previousNegativeValues[i];
                                                graphDataItem.values.open = previousNegativeValues[i];
                                            } else {
                                                graphDataItem.values.open = baseValue;
                                            }
                                            previousNegativeValues[i] = graphDataItem.values.close;
                                        } else {
                                            graphDataItem.values.close = value;
                                            if (!isNaN(previousPositiveValues[i])) {
                                                graphDataItem.values.close += previousPositiveValues[i];
                                                graphDataItem.values.open = previousPositiveValues[i];
                                            } else {
                                                graphDataItem.values.open = baseValue;
                                            }
                                            previousPositiveValues[i] = graphDataItem.values.close;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        for (i = _this.start; i <= _this.end; i++) {
            for (j = 0; j < graphs.length; j++) {
                graph = graphs[j];
                if (!graph.hidden) {
                    graphType = graph.type;
                    if (graph.chart == _this.chart && graph.valueAxis == this && type == graphType && graph.stackable) {
                        graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];
                        value = graphDataItem.values.value;

                        if (!isNaN(value)) {
                            var percents = value / sum[i] * 100;
                            graphDataItem.values.percents = percents;
                            graphDataItem.values.total = sum[i];

                            if (stackType == "100%") {
                                if (isNaN(previousNegativeValues[i])) {
                                    previousNegativeValues[i] = 0;
                                }

                                if (isNaN(previousPositiveValues[i])) {
                                    previousPositiveValues[i] = 0;
                                }

                                if (percents < 0) {
                                    graphDataItem.values.close = AmCharts.fitToBounds(percents + previousNegativeValues[i], -100, 100);
                                    graphDataItem.values.open = previousNegativeValues[i];
                                    previousNegativeValues[i] = graphDataItem.values.close;
                                } else {
                                    // this fixes 100.000000001 error
                                    graphDataItem.values.close = AmCharts.fitToBounds(percents + previousPositiveValues[i], -100, 100);
                                    graphDataItem.values.open = previousPositiveValues[i];
                                    previousPositiveValues[i] = graphDataItem.values.close;
                                }
                            }
                        }
                    }
                }
            }
        }
    },


    recalculate: function() {
        var _this = this;
        var graphs = _this.chart.graphs;
        for (var j = 0; j < graphs.length; j++) {
            var graph = graphs[j];

            if (graph.valueAxis == this) {
                var fieldName = "value";
                if (graph.type == "candlestick" || graph.type == "ohlc") {
                    fieldName = "open";
                }

                var baseValue
                var graphDataItem;
                var end = _this.end + 2;
                end = AmCharts.fitToBounds(_this.end + 1, 0, _this.data.length - 1);
                var start = _this.start;

                if (start > 0) {
                    start--;
                }

                for (var ii = _this.start; ii <= end; ii++) {
                    graphDataItem = _this.data[ii].axes[_this.id].graphs[graph.id];
                    baseValue = graphDataItem.values[fieldName];

                    if (!isNaN(baseValue)) {
                        break;
                    }
                }

                for (var i = start; i <= end; i++) {
                    graphDataItem = _this.data[i].axes[_this.id].graphs[graph.id];
                    graphDataItem.percents = {};
                    var values = graphDataItem.values;

                    for (var k in values) {
                        if (k != "percents") {
                            var val = values[k];
                            var percent = val / baseValue * 100 - 100;

                            graphDataItem.percents[k] = percent;
                        } else {
                            graphDataItem.percents[k] = values[k];
                        }
                    }
                }
            }
        }
    },



    /**
     * @private
     */
    getMinMax: function() {
        var _this = this;
        var expand = false;
        var chart = _this.chart;
        var graphs = chart.graphs;
        for (var g = 0; g < graphs.length; g++) {
            var type = graphs[g].type;

            if (type == "line" || type == "step" || type == "smoothedLine") {
                if (_this.expandMinMax) {
                    expand = true;
                }
            }
        }

        if (expand) {
            if (_this.start > 0) {
                _this.start--;
            }

            if (_this.end < _this.data.length - 1) {
                _this.end++;
            }
        }

        if (chart.chartType == 'serial') {
            if (chart.categoryAxis.parseDates == true && !expand) {
                if (_this.end < _this.data.length - 1) {
                    _this.end++;
                }
            }
        }

        // get min and max
        var minMaxMultiplier = _this.minMaxMultiplier;
        _this.min = _this.getMin(_this.start, _this.end);
        _this.max = _this.getMax();

        var delta = (_this.max - _this.min) * (minMaxMultiplier - 1);
        _this.min -= delta;
        _this.max += delta;

        var guideCount = _this.guides.length;
        if (_this.includeGuidesInMinMax && guideCount > 0) {
            for (var i = 0; i < guideCount; i++) {
                var guide = _this.guides[i];

                if (guide.toValue < _this.min) {
                    _this.min = guide.toValue;
                }

                if (guide.value < _this.min) {
                    _this.min = guide.value;
                }

                if (guide.toValue > _this.max) {
                    _this.max = guide.toValue;
                }

                if (guide.value > _this.max) {
                    _this.max = guide.value;
                }
            }
        }

        // set defined
        if (!isNaN(_this.minimum)) {
            _this.min = _this.minimum;
        }

        if (!isNaN(_this.maximum)) {
            _this.max = _this.maximum;
        }

        if (_this.min > _this.max) {
            var maxT = _this.max;
            _this.max = _this.min;
            _this.min = maxT;
        }

        // set temp if not reseted
        if (!isNaN(_this.minTemp)) {
            _this.min = _this.minTemp;
        }

        if (!isNaN(_this.maxTemp)) {
            _this.max = _this.maxTemp;
        }

        _this.minReal = _this.min;
        _this.maxReal = _this.max;

        if (_this.min == 0 && _this.max == 0) {
            _this.max = 9;
        }

        if (_this.min > _this.max) {
            _this.min = _this.max - 1;
        }

        var initialMin = _this.min; //initial minimum
        var initialMax = _this.max; //initial maximum
        var dif = _this.max - _this.min; //difference
        var difE; //row of difference

        if (dif == 0) {
            // difference is 0 if all values of the period are equal
            // then difference will be
            difE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.max)) * Math.LOG10E)) / 10;
        } else {
            difE = Math.pow(10, Math.floor(Math.log(Math.abs(dif)) * Math.LOG10E)) / 10;
        }

        // new min and max
        if (isNaN(_this.maximum) && isNaN(_this.maxTemp)) {
            _this.max = Math.ceil(_this.max / difE) * difE + difE;
        }

        if (isNaN(_this.minimum) && isNaN(_this.minTemp)) {
            _this.min = Math.floor(_this.min / difE) * difE - difE;
        }

        if (_this.min < 0 && initialMin >= 0) { //min is zero if initial min > 0
            _this.min = 0;
        }

        if (_this.max > 0 && initialMax <= 0) { //min is zero if initial min > 0
            _this.max = 0;
        }

        if (_this.stackType == "100%") {
            if (_this.min < 0) {
                _this.min = -100;
            } else {
                _this.min = 0;
            }

            if (_this.max < 0) {
                _this.max = 0;
            } else {
                _this.max = 100;
            }
        }

        // new difference
        dif = _this.max - _this.min;
        difE = Math.pow(10, Math.floor(Math.log(Math.abs(dif)) * Math.LOG10E)) / 10;

        // aprox size of the step
        _this.step = Math.ceil((dif / _this.gridCount) / difE) * difE;

        // row of the step
        var stepE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.step)) * Math.LOG10E));

        // fix step e beacuse of roundoff problem
        var stepExp = stepE.toExponential(0);
        var stepExpArr = stepExp.split("e");
        var base = Number(stepExpArr[0]);
        var mant = Number(stepExpArr[1]);
        if (base == 9) {
            mant++;
        }

        stepE = _this.generateNumber(1, mant);

        var temp = Math.ceil(_this.step / stepE); //number from 1 to 10

        if (temp > 5) {
            temp = 10;
        }

        if (temp <= 5 && temp > 2) {
            temp = 5;
        }

        //real step		
        _this.step = Math.ceil(_this.step / (stepE * temp)) * stepE * temp;

        if (stepE < 1) {
            _this.maxDecCount = Math.abs(Math.log(Math.abs(stepE)) * Math.LOG10E);
            _this.maxDecCount = Math.round(_this.maxDecCount);
            _this.step = AmCharts.roundTo(_this.step, _this.maxDecCount + 1);
        } else {
            _this.maxDecCount = 0;
        }

        _this.min = _this.step * Math.floor(_this.min / _this.step);
        _this.max = _this.step * Math.ceil(_this.max / _this.step);

        if (_this.min < 0 && initialMin >= 0) { //min is zero if initial min > 0
            _this.min = 0;
        }

        if (_this.max > 0 && initialMax <= 0) { //min is zero if initial min > 0
            _this.max = 0;
        }

        // tweek real min 
        // round
        if (_this.minReal > 1 && _this.max - _this.minReal > 1) {
            _this.minReal = Math.floor(_this.minReal);
        }

        dif = (Math.pow(10, Math.floor(Math.log(Math.abs(_this.minReal)) * Math.LOG10E)));

        // find next after zero
        if (_this.min == 0) {
            _this.minReal = dif;
        }
        if (_this.min == 0 && _this.minReal > 1) {
            _this.minReal = 1;
        }

        if (_this.min > 0 && _this.minReal - _this.step > 0) {
            if (_this.min + _this.step < _this.minReal) {
                _this.minReal = _this.min + _this.step;
            } else {
                _this.minReal = _this.min;
            }
        }

        var degrees = Math.log(initialMax) * Math.LOG10E - Math.log(initialMin) * Math.LOG10E;

        if (_this.logarithmic) {
            if (degrees > 2) {
                _this.min = Math.pow(10, Math.floor(Math.log(Math.abs(initialMin)) * Math.LOG10E));
                _this.minReal = _this.min;
                _this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(initialMax)) * Math.LOG10E));
            } else {
                var minE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.min)) * Math.LOG10E)) / 10;
                var minRealE = Math.pow(10, Math.floor(Math.log(Math.abs(initialMin)) * Math.LOG10E)) / 10;

                if (minE < minRealE) {
                    _this.min = 10 * minRealE;
                    _this.minReal = _this.min;
                }
            }
        }
    },

    generateNumber: function(num, mant) {
        var zeroes = "";
        var n;

        if (mant < 0) {
            n = Math.abs(mant) - 1;
        } else {
            n = Math.abs(mant);
        }

        for (var i = 0; i < n; i++) {
            zeroes = zeroes + "0";
        }
        if (mant < 0) {
            return Number("0." + zeroes + String(num));
        } else {
            return Number(String(num) + zeroes);
        }
    },


    /**
     * @private
     */
    getMin: function(start, end) {
        var _this = this;
        var min;

        for (var i = start; i <= end; i++) {
            var graphs = _this.data[i].axes[_this.id].graphs;

            for (var j in graphs) {
                var graph = _this.chart.getGraphById(j);

                if (graph.includeInMinMax) {
                    if (!graph.hidden || _this.includeHidden) {
                        if (isNaN(min)) {
                            min = Infinity;
                        }

                        _this.foundGraphs = true;

                        var values = graphs[j].values;
                        if (_this.recalculateToPercents) {
                            values = graphs[j].percents;
                        }

                        var val;

                        if (_this.minMaxField) {
                            val = values[_this.minMaxField];

                            if (val < min) {
                                min = val;
                            }
                        } else {
                            for (var k in values) {
                                if (k != "percents" && k != "total") {
                                    val = values[k];
                                    if (val < min) {
                                        min = val;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return min;
    },

    /**
     * @private
     */
    getMax: function() {
        var _this = this;
        var max;

        for (var i = _this.start; i <= _this.end; i++) {
            var graphs = _this.data[i].axes[_this.id].graphs;

            for (var j in graphs) {
                var graph = _this.chart.getGraphById(j);
                if (graph.includeInMinMax) {
                    if (!graph.hidden || _this.includeHidden) {
                        if (isNaN(max)) {
                            max = -Infinity;
                        }

                        _this.foundGraphs = true;

                        var values = graphs[j].values;
                        if (_this.recalculateToPercents) {
                            values = graphs[j].percents;
                        }

                        var val;

                        if (_this.minMaxField) {
                            val = values[_this.minMaxField];

                            if (val > max) {
                                max = val;
                            }
                        } else {
                            for (var k in values) {
                                if (k != "percents" && k != "total") {
                                    val = values[k];
                                    if (val > max) {
                                        max = val;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return max;
    },


    dispatchZoomEvent: function(startValue, endValue) {
        var _this = this;
        var event = {
            type: "axisZoomed",
            startValue: startValue,
            endValue: endValue,
            target: _this,
            chart: _this.chart
        };
        _this.fire(event.type, event);
    },


    zoomToValues: function(startValue, endValue) {
        var _this = this;
        if (endValue < startValue) {
            var temp = endValue;
            endValue = startValue;
            startValue = temp;
        }

        if (startValue < _this.min) {
            startValue = _this.min;
        }

        if (endValue > _this.max) {
            endValue = _this.max;
        }

        var event = {};
        event.type = "axisSelfZoomed";
        event.chart = _this.chart;
        event.valueAxis = _this;
        event.multiplier = _this.axisWidth / Math.abs((_this.getCoordinate(endValue) - _this.getCoordinate(startValue)));

        if (_this.orientation == "V") {
            if (_this.reversed) {
                event.position = _this.getCoordinate(startValue) - _this.y;
            } else {
                event.position = _this.getCoordinate(endValue) - _this.y;
            }
        } else {
            if (_this.reversed) {
                event.position = _this.getCoordinate(endValue) - _this.x;
            } else {
                event.position = _this.getCoordinate(startValue) - _this.x;
            }
        }
        _this.fire(event.type, event);
    },


    coordinateToValue: function(coordinate) {
        var _this = this;
        if (isNaN(coordinate)) {
            return NaN;
        }

        var value;
        var axisWidth = _this.axisWidth;
        var stepWidth = _this.stepWidth;
        var reversed = _this.reversed;
        var rotate = _this.rotate;
        var min = _this.min;
        var minReal = _this.minReal;

        // LOGARITHMIC
        if (_this.logarithmic == true) {
            var degree;

            if (rotate) {
                // REVERSED
                if (reversed == true) {
                    degree = (axisWidth - coordinate) / stepWidth;
                }
                // NOT REVERSED
                else {
                    degree = coordinate / stepWidth;
                }
            } else {
                // REVERSED
                if (reversed == true) {
                    degree = coordinate / stepWidth;
                }
                // NOT REVERSED
                else {
                    degree = (axisWidth - coordinate) / stepWidth;
                }
            }
            value = Math.pow(10, degree + Math.log(minReal) * Math.LOG10E);
        }

        // LINEAR (SIMPLE)
        else {
            // REVERSED
            if (reversed == true) {
                if (rotate) {
                    value = min - (coordinate - axisWidth) / stepWidth;
                } else {
                    value = coordinate / stepWidth + min;
                }
            }
            // NOT REVERSED
            else {
                if (rotate) {
                    value = coordinate / stepWidth + min;
                } else {
                    value = min - (coordinate - axisWidth) / stepWidth;
                }
            }
        }
        return value;
    },


    getCoordinate: function(value) {
        var _this = this;
        if (isNaN(value)) {
            return NaN;
        }
        var rotate = _this.rotate;
        var reversed = _this.reversed;
        var coord;
        var axisWidth = _this.axisWidth;
        var stepWidth = _this.stepWidth;
        var min = _this.min;
        var minReal = _this.minReal;

        // LOGARITHMIC
        if (_this.logarithmic == true) {
            var degree = (Math.log(value) * Math.LOG10E) - Math.log(minReal) * Math.LOG10E;
            if (rotate) {
                // REVERSED
                if (reversed == true) {
                    coord = axisWidth - stepWidth * degree;
                }
                // NOT REVERSED
                else {
                    coord = stepWidth * degree;
                }
            } else {
                // REVERSED
                if (reversed == true) {
                    coord = stepWidth * degree;
                }
                // NOT REVERSED
                else {
                    coord = axisWidth - stepWidth * degree;
                }
            }
        }
        // LINEAR (SIMPLE)
        else {
            // REVERSED			
            if (reversed == true) {
                if (rotate) {
                    coord = axisWidth - stepWidth * (value - min);
                } else {
                    coord = stepWidth * (value - min);
                }
            }
            // NOT REVERSED
            else {
                if (rotate) {
                    coord = stepWidth * (value - min);
                } else {
                    coord = axisWidth - stepWidth * (value - min);
                }
            }
        }

        if (_this.rotate) {
            coord += _this.x - _this.viX;
        } else {
            coord += _this.y - _this.viY;
        }

        return Math.round(coord);
    },

    /**
     * One value axis can be synchronized with another value axis. 
     * You should set synchronizationMultiplier in order for this to work.
     */
    synchronizeWithAxis: function(value) {
        var _this = this;
        _this.synchronizeWithAxis = value;
        _this.removeListener(_this.synchronizeWithAxis, "axisChanged", _this.handleSynchronization);
        _this.listenTo(_this.synchronizeWithAxis, "axisChanged", _this.handleSynchronization);
    },



    /**
     * @private
     */
    handleSynchronization: function(event) {
        var _this = this;
        var synchronizeWithAxis = _this.synchronizeWithAxis;
        var syncMin = synchronizeWithAxis.min;
        var syncMax = synchronizeWithAxis.max;
        var syncStep = synchronizeWithAxis.step;

        var synchronizationMultiplier = _this.synchronizationMultiplier;

        if (synchronizationMultiplier) {
            _this.min = syncMin * synchronizationMultiplier;
            _this.max = syncMax * synchronizationMultiplier;
            _this.step = syncStep * synchronizationMultiplier;

            var stepE = Math.pow(10, Math.floor(Math.log(Math.abs(_this.step)) * Math.LOG10E));

            var maxDecCount = Math.abs(Math.log(Math.abs(stepE)) * Math.LOG10E);
            maxDecCount = Math.round(maxDecCount);

            _this.maxDecCount = maxDecCount;

            _this.draw();
        }
    }

});;
AmCharts.CategoryAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,

    construct: function() {
        var _this = this;
        AmCharts.CategoryAxis.base.construct.call(_this);
        _this.minPeriod = "DD";
        _this.parseDates = false;
        _this.equalSpacing = false;
        _this.position = "bottom";
        _this.startOnAxis = false;
        _this.firstDayOfWeek = 1;
        _this.gridPosition = "middle";
        _this.boldPeriodBeginning = true;
        _this.periods = [{
            period: "ss",
            count: 1
        }, {
            period: "ss",
            count: 5
        }, {
            period: "ss",
            count: 10
        }, {
            period: "ss",
            count: 30
        }, {
            period: "mm",
            count: 1
        }, {
            period: "mm",
            count: 5
        }, {
            period: "mm",
            count: 10
        }, {
            period: "mm",
            count: 30
        }, {
            period: "hh",
            count: 1
        }, {
            period: "hh",
            count: 3
        }, {
            period: "hh",
            count: 6
        }, {
            period: "hh",
            count: 12
        }, {
            period: "DD",
            count: 1
        }, {
            period: "DD",
            count: 2
        }, {
            period: "WW",
            count: 1
        }, {
            period: "MM",
            count: 1
        }, {
            period: "MM",
            count: 2
        }, {
            period: "MM",
            count: 3
        }, {
            period: "MM",
            count: 6
        }, {
            period: "YYYY",
            count: 1
        }, {
            period: "YYYY",
            count: 2
        }, {
            period: "YYYY",
            count: 5
        }, {
            period: "YYYY",
            count: 10
        }, {
            period: "YYYY",
            count: 50
        }, {
            period: "YYYY",
            count: 100
        }];

        _this.dateFormats = [{
            period: 'fff',
            format: 'JJ:NN:SS'
        }, {
            period: 'ss',
            format: 'JJ:NN:SS'
        }, {
            period: 'mm',
            format: 'JJ:NN'
        }, {
            period: 'hh',
            format: 'JJ:NN'
        }, {
            period: 'DD',
            format: 'MMM DD'
        }, {
            period: 'WW',
            format: 'MMM DD'
        }, {
            period: 'MM',
            format: 'MMM'
        }, {
            period: 'YYYY',
            format: 'YYYY'
        }];

        _this.nextPeriod = {};
        _this.nextPeriod["fff"] = "ss";
        _this.nextPeriod["ss"] = "mm";
        _this.nextPeriod["mm"] = "hh";
        _this.nextPeriod["hh"] = "DD";
        _this.nextPeriod["DD"] = "MM";
        _this.nextPeriod["MM"] = "YYYY";
        //DTS2013121002395 add  start
        _this.autoGridFrequency = false;
        //DTS2013121002395 add  end
        _this.isPieText = true;
    },


    draw: function() {
        var _this = this;
        AmCharts.CategoryAxis.base.draw.call(_this);

        _this.generateDFObject();

        var data = _this.chart.chartData;
        _this.data = data;

        if (AmCharts.ifArray(data)) {
            var chart = _this.chart;
            var end = _this.end;
            var start = _this.start;
            var labelFrequency = _this.labelFrequency;
            var startFrom = 0;
            var valueCount = end - start + 1;
            var gridCount = _this.gridCount;
            var showFirstLabel = _this.showFirstLabel;
            var showLastLabel = _this.showLastLabel;
            var coord;
            var valueText = "";
            var minPeriodObj = AmCharts.extractPeriod(_this.minPeriod);
            var minDuration = AmCharts.getPeriodDuration(minPeriodObj.period, minPeriodObj.count);
            var periodObj;
            var periodMultiplier;
            var period;
            var periodDuration;
            var periodReal;
            var previousTime;
            var periodWidth;
            var periodCount;
            var start;
            var i;
            var time;
            var biggerPeriodChanged;
            var dateFormat;
            var realStartFrom;
            var rotate = _this.rotate;
            var firstDayOfWeek = _this.firstDayOfWeek;
            var boldPeriodBeginning = _this.boldPeriodBeginning;
            var lastTime = data[data.length - 1].time;
            var maxTime = AmCharts.resetDateToMin(new Date(lastTime + minDuration * 1.05), _this.minPeriod, 1, firstDayOfWeek).getTime();

            if (_this.endTime > maxTime) {
                _this.endTime = maxTime;
            }

            // PARSE DATES
            if (_this.parseDates && !_this.equalSpacing) {
                _this.timeDifference = _this.endTime - _this.startTime;

                periodObj = _this.choosePeriod(0);
                period = periodObj.period;
                periodMultiplier = periodObj.count;

                periodDuration = AmCharts.getPeriodDuration(period, periodMultiplier);

                // check if this period is not shorter then minPeriod
                if (periodDuration < minDuration) {
                    period = minPeriodObj.period;
                    periodMultiplier = minPeriodObj.count;
                    periodDuration = minDuration;
                }

                periodReal = period;
                // weeks don't have format, swith to days				
                if (periodReal == "WW") {
                    periodReal = "DD";
                }
                _this.stepWidth = _this.getStepWidth(_this.timeDifference);

                gridCount = Math.ceil(_this.timeDifference / periodDuration) + 1;

                previousTime = AmCharts.resetDateToMin(new Date(_this.startTime - periodDuration), period, periodMultiplier, firstDayOfWeek).getTime();
                // if this is pure period (no numbers and not a week), place the value in the middle

                if (periodReal == period && periodMultiplier == 1) {
                    periodWidth = periodDuration * _this.stepWidth;
                }

                _this.cellWidth = minDuration * _this.stepWidth;


                periodCount = Math.round(previousTime / periodDuration);

                start = -1;
                if (periodCount / 2 == Math.round(periodCount / 2)) {
                    start = -2;
                    previousTime -= periodDuration;
                }

                if (_this.gridCount > 0) {
                    for (i = start; i <= gridCount; i++) {
                        time = previousTime + periodDuration * 1.5;
                        time = AmCharts.resetDateToMin(new Date(time), period, periodMultiplier, firstDayOfWeek).getTime();
                        coord = (time - _this.startTime) * _this.stepWidth;

                        biggerPeriodChanged = false;
                        if (_this.nextPeriod[periodReal]) {
                            biggerPeriodChanged = _this.checkPeriodChange(_this.nextPeriod[periodReal], 1, time, previousTime);
                        }

                        var bold = false;

                        if (biggerPeriodChanged) {
                            dateFormat = _this.dateFormatsObject[_this.nextPeriod[periodReal]];
                            bold = true;
                        } else {
                            dateFormat = _this.dateFormatsObject[periodReal];
                        }

                        if (!boldPeriodBeginning) {
                            bold = false;
                        }

                        valueText = AmCharts.formatDate(new Date(time), dateFormat);

                        if ((i == start && !showFirstLabel) || (i == gridCount && !showLastLabel)) {
                            valueText = " ";
                        }
                        // draw grid
                        var axisItem = new _this.axisItemRenderer(this, coord, valueText, false, periodWidth, 0, false, bold);
                        _this.pushAxisItem(axisItem);
                        previousTime = time;
                    }
                }
            }
            // DO NOT PARSE DATES
            else if (!_this.parseDates) {
                _this.cellWidth = _this.getStepWidth(valueCount);

                // in case there are more values when gridlines, fix the _this.gridCount
                if (valueCount < gridCount) {
                    gridCount = valueCount;
                }

                startFrom += _this.start;

                _this.stepWidth = _this.getStepWidth(valueCount);

                if (gridCount > 0) {
                    //DTS2013121002395 add  start
                    var gridFrequency;
                    if (_this.autoGridFrequency) {
                        gridFrequency = Math.floor(valueCount / gridCount);
                    } else {
                        //DTS2013081300532 add  start
                        gridFrequency = Math.ceil(valueCount / gridCount);
                        //DTS2013081300532 add  end
                    }
                    //DTS2013121002395 add  end
                    realStartFrom = startFrom;
                    if (realStartFrom / 2 == Math.round(realStartFrom / 2)) {
                        realStartFrom--;
                    }

                    if (realStartFrom < 0) {
                        realStartFrom = 0;
                    }

                    var realCount = 0;

                    for (i = realStartFrom; i <= _this.end + 2; i += gridFrequency) {
                        if (i >= 0 && i < _this.data.length) {
                            var sDataItem = _this.data[i];
                            valueText = sDataItem.category;
                        } else {
                            valueText = "";
                        }

                        coord = _this.getCoordinate(i - startFrom);
                        var vShift = 0;
                        if (_this.gridPosition == "start") {
                            coord = coord - _this.cellWidth / 2;
                            vShift = _this.cellWidth / 2;
                        }

                        if ((i == start && !showFirstLabel) || (i == _this.end && !showLastLabel)) {
                            valueText = undefined;
                        }

                        if (Math.round(realCount / labelFrequency) != realCount / labelFrequency) {
                            valueText = undefined;
                        }

                        realCount++;

                        var cellW = _this.cellWidth;
                        if (rotate) {
                            cellW = NaN;
                        }

                        var axisItem = new _this.axisItemRenderer(this, coord, valueText, true, cellW, vShift, undefined, false, vShift);
                        _this.pushAxisItem(axisItem);
                    }
                }
            }

            // PARSE, BUT EQUAL SPACING
            else if (_this.parseDates && _this.equalSpacing) {
                startFrom = _this.start;
                _this.startTime = _this.data[_this.start].time;
                _this.endTime = _this.data[_this.end].time;

                _this.timeDifference = _this.endTime - _this.startTime;

                periodObj = _this.choosePeriod(0);
                period = periodObj.period;
                periodMultiplier = periodObj.count;
                periodDuration = AmCharts.getPeriodDuration(period, periodMultiplier);

                // check if this period is not shorter then minPeriod
                if (periodDuration < minDuration) {
                    period = minPeriodObj.period;
                    periodMultiplier = minPeriodObj.count;
                    periodDuration = minDuration;
                }

                periodReal = period;
                // weeks don't have format, swith to days				
                if (periodReal == "WW") {
                    periodReal = "DD";
                }

                _this.stepWidth = _this.getStepWidth(valueCount);

                gridCount = Math.ceil(_this.timeDifference / periodDuration) + 1;

                previousTime = AmCharts.resetDateToMin(new Date(_this.startTime - periodDuration), period, periodMultiplier, firstDayOfWeek).getTime();

                _this.cellWidth = _this.getStepWidth(valueCount);

                periodCount = Math.round(previousTime / periodDuration);

                start = -1;
                if (periodCount / 2 == Math.round(periodCount / 2)) {
                    start = -2;
                    previousTime -= periodDuration;
                }

                var lastIndex = _this.data.length;

                realStartFrom = _this.start;
                if (realStartFrom / 2 == Math.round(realStartFrom / 2)) {
                    realStartFrom--;
                }

                if (realStartFrom < 0) {
                    realStartFrom = 0;
                }

                var realEnd = _this.end + 2;
                if (realEnd >= _this.data.length) {
                    realEnd = _this.data.length;
                }

                // first must be skipped if more data items then gridcount
                var thisIsFirst = false;
                if (_this.end - _this.start > _this.gridCount) {
                    thisIsFirst = true;
                }

                for (i = realStartFrom; i < realEnd; i++) {
                    time = _this.data[i].time;

                    if (_this.checkPeriodChange(period, periodMultiplier, time, previousTime)) {
                        coord = _this.getCoordinate(i - _this.start);

                        biggerPeriodChanged = false;
                        if (_this.nextPeriod[periodReal]) {
                            biggerPeriodChanged = _this.checkPeriodChange(_this.nextPeriod[periodReal], 1, time, previousTime);
                        }

                        var bold = false;
                        if (biggerPeriodChanged) {
                            dateFormat = _this.dateFormatsObject[_this.nextPeriod[periodReal]];
                            bold = true;
                        } else {
                            dateFormat = _this.dateFormatsObject[periodReal];
                        }

                        valueText = AmCharts.formatDate(new Date(time), dateFormat);

                        if ((i == start && !showFirstLabel) || (i == gridCount && !showLastLabel)) {
                            valueText = " ";
                        }

                        if (!thisIsFirst) {
                            if (!boldPeriodBeginning) {
                                bold = false;
                            }

                            // draw grid
                            var und = undefined;
                            var axisItem = new _this.axisItemRenderer(this, coord, valueText, und, und, und, und, bold);
                            var axisItemGraphics = axisItem.graphics();
                            _this.pushAxisItem(axisItem);
                        } else {
                            thisIsFirst = false;
                        }

                        previousTime = time;
                    }
                }
            }

            // get x's of all categories
            for (i = 0; i < _this.data.length; i++) {
                var serialDataItem = _this.data[i];
                if (serialDataItem) {
                    var xxx;
                    if (_this.parseDates && !_this.equalSpacing) {
                        var categoryTime = serialDataItem.time;
                        xxx = Math.round((categoryTime - _this.startTime) * _this.stepWidth + _this.cellWidth / 2);
                    } else {
                        xxx = _this.getCoordinate(i - startFrom);
                    }

                    serialDataItem.x[_this.id] = xxx;
                }
            }
        }
        // guides
        var count = _this.guides.length;

        for (i = 0; i < count; i++) {
            var guide = _this.guides[i];
            var guideToCoord = NaN;
            var guideCoord = NaN;
            var valueShift = NaN;

            if (guide.toCategory) {
                var toCategoryIndex = chart.getCategoryIndexByValue(guide.toCategory);
                if (!isNaN(toCategoryIndex)) {
                    guideToCoord = _this.getCoordinate(toCategoryIndex - startFrom);
                    var axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                    _this.pushAxisItem(axisItem);
                }
            }

            if (guide.category) {
                var categoryIndex = chart.getCategoryIndexByValue(guide.category);
                if (!isNaN(categoryIndex)) {
                    guideCoord = _this.getCoordinate(categoryIndex - startFrom);
                    valueShift = (guideToCoord - guideCoord) / 2;
                    var axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, true, NaN, valueShift, guide);
                    _this.pushAxisItem(axisItem);
                }
            }

            if (guide.toDate) {
                if (_this.equalSpacing) {
                    var toCategoryIndex = chart.getClosestIndex(_this.data, "time", guide.toDate.getTime(), false, 0, _this.data.length - 1);
                    if (!isNaN(toCategoryIndex)) {
                        guideToCoord = _this.getCoordinate(toCategoryIndex - startFrom);
                    }
                } else {
                    guideToCoord = (guide.toDate.getTime() - _this.startTime) * _this.stepWidth;
                }
                var axisItem = new _this.axisItemRenderer(this, guideToCoord, "", true, NaN, NaN, guide);
                _this.pushAxisItem(axisItem);
            }

            if (guide.date) {
                if (_this.equalSpacing) {
                    var categoryIndex = chart.getClosestIndex(_this.data, "time", guide.date.getTime(), false, 0, _this.data.length - 1);
                    if (!isNaN(categoryIndex)) {
                        guideCoord = _this.getCoordinate(categoryIndex - startFrom);
                    }
                } else {
                    guideCoord = (guide.date.getTime() - _this.startTime) * _this.stepWidth;
                }

                valueShift = (guideToCoord - guideCoord) / 2;

                if (_this.orientation == "H") {
                    var axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, false, valueShift * 2, NaN, guide);
                } else {
                    var axisItem = new _this.axisItemRenderer(this, guideCoord, guide.label, false, NaN, valueShift, guide);
                }
                _this.pushAxisItem(axisItem);
            }

            var guideFill = new _this.guideFillRenderer(this, guideCoord, guideToCoord, guide);
            var guideFillGraphics = guideFill.graphics();
            _this.pushAxisItem(guideFill);
            guide.graphics = guideFillGraphics;
            guideFillGraphics.index = i;

            if (guide.balloonText) {
                _this.addEventListeners(guideFillGraphics, guide);
            }
        }
        _this.axisCreated = true;

        var xx = _this.x;
        var yy = _this.y;
        _this.set.translate(xx, yy);
        _this.labelsSet.translate(xx, yy);
        _this.positionTitle();
        var axisLine = _this.axisLine.set;
        if (axisLine) {
            axisLine.toFront();
        }
    },


    choosePeriod: function(index) {
        var _this = this;
        var periodDuration = AmCharts.getPeriodDuration(_this.periods[index].period, _this.periods[index].count);
        var count = Math.ceil(_this.timeDifference / periodDuration);
        var periods = _this.periods;

        var gridCount = _this.gridCount;
        if (count <= gridCount) {
            return periods[index];
        } else {
            if (index + 1 < periods.length) {
                return _this.choosePeriod(index + 1);
            } else {
                return periods[index];
            }
        }
    },

    getStepWidth: function(valueCount) {
        var _this = this;
        var stepWidth;
        if (_this.startOnAxis) {
            stepWidth = _this.axisWidth / (valueCount - 1);

            if (valueCount == 1) {
                stepWidth = _this.axisWidth;
            }
        } else {
            stepWidth = _this.axisWidth / valueCount;
        }
        return stepWidth;
    },

    getCoordinate: function(index) {
        var _this = this;
        var coord = index * _this.stepWidth;

        if (!_this.startOnAxis) {
            coord += _this.stepWidth / 2;
        }
        return Math.round(coord);
    },

    timeZoom: function(startTime, endTime) {
        var _this = this;
        _this.startTime = startTime;
        _this.endTime = endTime + _this.minDuration();
    },

    minDuration: function() {
        var _this = this;
        var minPeriodObj = AmCharts.extractPeriod(_this.minPeriod);
        return AmCharts.getPeriodDuration(minPeriodObj.period, minPeriodObj.count);
    },

    checkPeriodChange: function(period, count, time, previousTime) {
        var currentDate = new Date(time);
        var previousDate = new Date(previousTime);

        var firstDayOfWeek = this.firstDayOfWeek;
        var current = AmCharts.resetDateToMin(currentDate, period, count, firstDayOfWeek).getTime();
        var previous = AmCharts.resetDateToMin(previousDate, period, count, firstDayOfWeek).getTime();

        if (current != previous) {
            return true;
        } else {
            return false;
        }
    },


    generateDFObject: function() {
        var _this = this;
        _this.dateFormatsObject = {};

        for (var i = 0; i < _this.dateFormats.length; i++) {
            var df = _this.dateFormats[i];
            _this.dateFormatsObject[df.period] = df.format;
        }
    },


    xToIndex: function(x) {
        var _this = this;
        var data = _this.data;
        var chart = _this.chart;
        var rotate = chart.rotate;
        var stepWidth = _this.stepWidth;
        var index;
        if (_this.parseDates && !_this.equalSpacing) {
            var time = _this.startTime + Math.round(x / stepWidth) - _this.minDuration() / 2;
            index = chart.getClosestIndex(data, "time", time, false, _this.start, _this.end + 1);
        } else {
            if (!_this.startOnAxis) {
                x -= stepWidth / 2;
            }
            index = _this.start + Math.round(x / stepWidth);
        }

        index = AmCharts.fitToBounds(index, 0, data.length - 1);

        var indexX;
        if (data[index]) {
            indexX = data[index].x[_this.id];
        }

        if (rotate) {
            if (indexX > _this.height + 1) {
                index--;
            }
            if (indexX < 0) {
                index++;
            }
        } else {
            if (indexX > _this.width + 1) {
                index--;
            }
            if (indexX < 0) {
                index++;
            }
        }

        index = AmCharts.fitToBounds(index, 0, data.length - 1);

        return index;
    },

    dateToCoordinate: function(date) {
        var _this = this;
        if (_this.parseDates && !_this.equalSpacing) {
            return (date.getTime() - _this.startTime) * _this.stepWidth;
        } else if (_this.parseDates && _this.equalSpacing) {
            var index = _this.chart.getClosestIndex(_this.data, "time", date.getTime(), false, 0, _this.data.length - 1);
            return _this.getCoordinate(index - _this.start);
        } else {
            return NaN;
        }
    },

    categoryToCoordinate: function(category) {
        var _this = this;
        if (_this.chart) {
            var index = _this.chart.getCategoryIndexByValue(category);
            return _this.getCoordinate(index - _this.start);
        } else {
            return NaN;
        }
    },

    coordinateToDate: function(coordinate) {
        var _this = this;
        if (_this.equalSpacing) {
            var index = _this.xToIndex(coordinate)
            return new Date(_this.data[index].time);
        } else {
            return new Date(_this.startTime + coordinate / _this.stepWidth);
        }
    }
});;
AmCharts.RecAxis = AmCharts.Class({
    construct: function(axis) {
        var _this = this;
        var chart = axis.chart;
        var t = axis.axisThickness;
        var c = axis.axisColor;
        var a = axis.axisAlpha;
        var l = axis.tickLength;
        var o = axis.offset;
        var dx = axis.dx;
        var dy = axis.dy;

        var vx = axis.viX;
        var vy = axis.viY;
        var vh = axis.viH;
        var vw = axis.viW;

        var x;
        var y;
        var container = chart.container;

        // POSITION CONTAINERS
        // HORIZONTAL

        var line;

        if (axis.orientation == "H") {
            line = AmCharts.line(container, [0, vw], [0, 0], c, a, t);

            _this.axisWidth = axis.width;

            // BOTTOM
            if (axis.position == "bottom") {
                y = t / 2 + o + vh + vy - 1;
                x = vx;
            }
            // TOP
            else {
                y = -t / 2 - o + vy + dy;
                x = dx + vx;
            }
        }
        // VERTICAL 
        else {
            _this.axisWidth = axis.height;

            // RIGHT
            if (axis.position == "right") {
                line = AmCharts.line(container, [0, 0, -dx], [0, vh, vh - dy], c, a, t);
                y = vy + dy;
                x = t / 2 + o + dx + vw + vx - 1;
            }
            // LEFT
            else {
                line = AmCharts.line(container, [0, 0], [0, vh], c, a, t);
                y = vy;
                x = -t / 2 - o + vx;
            }
        }
        line.translate(x, y);
        chart.axesSet.push(line);
        _this.set = line;
    }

});;
AmCharts.RecItem = AmCharts.Class({
    construct: function(axis, coord, value, below, textWidth, valueShift, guide, bold, tickShift) {
        var _this = this;

        coord = Math.round(coord);
        var UNDEFINED = undefined;

        if (value == UNDEFINED) {
            value = "";
        }

        if (!tickShift) {
            tickShift = 0;
        }

        if (below == UNDEFINED) {
            below = true;
        }
        var fontFamily = axis.chart.fontFamily;
        var textSize = axis.fontSize;

        if (textSize == UNDEFINED) {
            textSize = axis.chart.fontSize;
        }

        var color = axis.color;
        if (color == UNDEFINED) {
            color = axis.chart.color;
        }

        var container = axis.chart.container;
        var set = container.set();
        _this.set = set;

        var vCompensation = 3;
        var hCompensation = 4;
        var axisThickness = axis.axisThickness;
        var axisColor = axis.axisColor;
        var axisAlpha = axis.axisAlpha;
        var tickLength = axis.tickLength;
        var gridAlpha = axis.gridAlpha;
        var gridThickness = axis.gridThickness;
        var gridColor = axis.gridColor;
        var dashLength = axis.dashLength;
        var fillColor = axis.fillColor;
        var fillAlpha = axis.fillAlpha;
        var labelsEnabled = axis.labelsEnabled;
        var labelRotation = axis.labelRotation;
        var counter = axis.counter;
        var labelInside = axis.inside;
        var dx = axis.dx;
        var dy = axis.dy;

        var orientation = axis.orientation;
        var position = axis.position;
        var previousCoord = axis.previousCoord;
        var truncate = axis.autoTruncate;

        var vh = axis.viH;
        var vw = axis.viW;
        var offset = axis.offset;

        var tick;
        var grid;
        var MIDDLE = "middle";
        var START = "start";
        var BOTTOM = "bottom";


        if (guide) {
            labelsEnabled = true;

            if (!isNaN(guide.tickLength)) {
                tickLength = guide.tickLength;
            }

            if (guide.lineColor != undefined) {
                gridColor = guide.lineColor;
            }

            if (!isNaN(guide.lineAlpha)) {
                gridAlpha = guide.lineAlpha;
            }

            if (!isNaN(guide.dashLength)) {
                dashLength = guide.dashLength;
            }

            if (!isNaN(guide.lineThickness)) {
                gridThickness = guide.lineThickness;
            }
            if (guide.inside == true) {
                labelInside = true;
            }

            if (!isNaN(guide.labelRotation)) {
                labelRotation = guide.labelRotation;
            }
        } else {
            if (value == "") {
                tickLength = 0;
            }
        }

        var align = START;
        if (textWidth) {
            align = MIDDLE;
        }

        var angle = labelRotation * Math.PI / 180;
        var fillWidth;
        var fillHeight;
        var lx = 0;
        var ly = 0;
        var tx = 0;
        var ty = 0;
        var labelTextWidth = 0;
        var labelTextHeight = 0;

        if (orientation == "V") {
            labelRotation = 0;
        }

        if (labelsEnabled) {
            /***start modify  给图例添加提示(UI规范),当英文字符大于20个时，只显示20个加"...",鼠标移动上去时显示提示***/
            var tipText = value;
            if (axis.id === "categoryAxis" && axis.isPieText) {
                value = AmCharts.fixTxet(value);
            }
            /***end modify ********************************************************************/
            var valueTF = AmCharts.text(container, value, color, fontFamily, textSize, align, bold);
            /***start modify  给图例添加提示(UI规范),当英文字符大于20个时，只显示20个加"...",鼠标移动上去时显示提示***/
            //设置提示，sweet框架统一开启提示功能
            if (axis.id === "categoryAxis" && axis.isPieText) {
                valueTF.setAttr('title', tipText);
            }
            /***end modify ********************************************************************/

            var bbox = valueTF.getBBox();
            labelTextWidth = bbox.width;
            labelTextHeight = bbox.height;
        }

        // horizontal AXIS

        if (orientation == "H") {
            if (coord >= 0 && coord <= vw + 1) {
                if (tickLength > 0 && axisAlpha > 0 && coord + tickShift <= vw + 1) {
                    tick = AmCharts.line(container, [coord + tickShift, coord + tickShift], [0, tickLength], axisColor, axisAlpha, gridThickness);
                    set.push(tick);
                }
                if (gridAlpha > 0) {
                    grid = AmCharts.line(container, [coord, coord + dx, coord + dx], [vh, vh + dy, dy], gridColor, gridAlpha, gridThickness, dashLength);
                    set.push(grid);
                }
            }

            ly = 0;
            lx = coord;

            if (guide && labelRotation == 90) {
                lx -= textSize;
            }

            if (below == false) {
                align = START;

                if (position == BOTTOM) {
                    if (labelInside) {
                        ly += tickLength;
                    } else {
                        ly -= tickLength;
                    }
                } else {
                    if (labelInside) {
                        ly -= tickLength;
                    } else {
                        ly += tickLength;
                    }
                }

                lx += 3;

                if (textWidth) {
                    lx += textWidth / 2;
                    align = MIDDLE;
                }

                if (labelRotation > 0) {
                    align = MIDDLE;
                }
            } else {
                align = MIDDLE;
            }

            if (counter == 1 && fillAlpha > 0 && !guide && previousCoord < vw) {
                var fillCoord = AmCharts.fitToBounds(coord, 0, vw);
                previousCoord = AmCharts.fitToBounds(previousCoord, 0, vw);
                fillWidth = fillCoord - previousCoord;
                if (fillWidth > 0) {
                    fill = AmCharts.rect(container, fillWidth, axis.height, fillColor, fillAlpha);
                    fill.translate((fillCoord - fillWidth + dx), dy);
                    set.push(fill);
                }
            }

            // ADJUST POSITIONS
            // BOTTOM
            if (position == BOTTOM) {
                ly += vh + textSize / 2 + offset;

                //INSIDE
                if (labelInside) {
                    if (labelRotation > 0) {
                        ly = vh - (labelTextWidth / 2) * Math.sin(angle) - tickLength - vCompensation;
                        lx += (labelTextWidth / 2) * Math.cos(angle)
                    } else {
                        ly -= tickLength + textSize + vCompensation + vCompensation;
                    }
                }
                //OUTSIDE
                else {
                    if (labelRotation > 0) {
                        ly = vh + (labelTextWidth / 2) * Math.sin(angle) + tickLength + vCompensation;
                        lx -= (labelTextWidth / 2) * Math.cos(angle)
                    } else {
                        ly += tickLength + axisThickness + vCompensation + 3;
                    }
                }
            }
            // TOP
            else {
                ly += dy + textSize / 2 - offset;
                lx += dx;
                //INSIDE
                if (labelInside) {
                    if (labelRotation > 0) {
                        ly = (labelTextWidth / 2) * Math.sin(angle) + tickLength + vCompensation;
                        lx -= (labelTextWidth / 2) * Math.cos(angle)
                    } else {
                        ly += tickLength + vCompensation;
                    }
                }
                //OUTSIDE
                else {
                    if (labelRotation > 0) {
                        ly = -(labelTextWidth / 2) * Math.sin(angle) - tickLength - 2 * vCompensation;
                        lx += (labelTextWidth / 2) * Math.cos(angle);
                    } else {
                        ly -= tickLength + textSize + vCompensation + axisThickness + 3;
                    }
                }
            }

            if (position == BOTTOM) {
                //INSIDE
                if (labelInside) {
                    ty = vh - tickLength - 1;
                }
                //OUTSIDE
                else {
                    ty = vh + axisThickness - 1;
                }
                ty += offset;
            }
            // TOP
            else {
                tx = dx;
                //INSIDE
                if (labelInside) {
                    ty = dy;
                }
                //OUTSIDE
                else {
                    ty = dy - tickLength - axisThickness + 1;
                }
                ty -= offset;
            }

            if (valueShift) {
                lx += valueShift;
            }

            var llx = lx;

            if (labelRotation > 0) {
                llx += (labelTextWidth / 2) * Math.cos(angle);
            }

            if (valueTF) {
                //=========================start ================
                /**
                 * 根据label的宽度决定是否要显示
                 * 2013-07-24
                 */
                var dlx = labelTextWidth / 2;
                if (labelRotation > 0) {
                    dlx = 0;
                }
                if (labelInside) {
                    dlx = labelTextWidth * Math.cos(angle);
                }

                if (llx + dlx > vw + 1 || llx < 0 || llx - dlx < -10) {
                    valueTF.remove();
                    valueTF = null;
                    if (tick) {
                        tick.remove();
                        tick = null;
                    }
                }
                //=========================end ================
            }
        }
        // VERTICAL AXIS
        else {
            if (coord >= 0 && coord <= vh + 1) {
                // ticks			
                if (tickLength > 0 && axisAlpha > 0 && coord + tickShift <= vh + 1) {
                    tick = AmCharts.line(container, [0, tickLength], [coord + tickShift, coord + tickShift], axisColor, axisAlpha, gridThickness);
                    set.push(tick);
                }
                // grid
                if (gridAlpha > 0) {
                    grid = AmCharts.line(container, [0, dx, vw + dx], [coord, coord + dy, coord + dy], gridColor, gridAlpha, gridThickness, dashLength);
                    set.push(grid);
                }
            }

            // text field
            align = "end";

            if ((labelInside == true && position == "left") || (labelInside == false && position == "right")) {
                align = START;
            }
            ly = coord - textSize / 2;

            if (counter == 1 && fillAlpha > 0 && !guide) {
                var fillCoord = AmCharts.fitToBounds(coord, 0, vh);
                previousCoord = AmCharts.fitToBounds(previousCoord, 0, vh);
                fillHeight = fillCoord - previousCoord;
                fill = AmCharts.polygon(container, [0, axis.width, axis.width, 0], [0, 0, fillHeight, fillHeight], fillColor, fillAlpha);
                fill.translate(dx, (fillCoord - fillHeight + dy));
                set.push(fill);
            }
            // ADJUST POSITIONS
            // RIGHT

            ly += textSize / 2;
            if (position == "right") {
                lx += dx + vw + offset;
                ly += dy;

                // INSIDE
                if (labelInside) {
                    lx -= tickLength + hCompensation;
                    if (!valueShift) {
                        ly -= textSize / 2 + 3;
                    }
                }
                //OUTSIDE
                else {
                    lx += tickLength + hCompensation + axisThickness;
                    ly -= 2;
                }
            }
            // LEFT
            else {
                // INSIDE
                if (labelInside) {
                    lx += tickLength + hCompensation - offset;
                    if (!valueShift) {
                        ly -= textSize / 2 + 3;
                    }
                    if (guide) {
                        lx += dx;
                        ly += dy;
                    }
                }
                // OUTSIDE
                else {
                    lx += -tickLength - axisThickness - hCompensation - 2 - offset;
                    ly -= 2;
                }
            }

            if (tick) {
                if (position == "right") {
                    tx += dx + offset + vw;
                    ty += dy;
                    // INSIDE
                    if (labelInside) {
                        tx -= axisThickness;
                    }
                    //OUTSIDE
                    else {
                        tx += axisThickness;
                    }
                }
                // LEFT
                else {
                    tx -= offset;
                    // INSIDE
                    if (labelInside) {
                        // void
                    }
                    // OUTSIDE
                    else {
                        tx -= tickLength + axisThickness;
                    }
                }
            }

            if (valueShift) {
                ly += valueShift;
            }

            var topY = -3;

            if (position == "right") {
                topY += dy;
            }
            if (valueTF) {
                if (ly > vh + 1 || ly < topY) {
                    valueTF.remove();
                    valueTF = null;
                }
            }
        }

        if (tick) {
            tick.translate(tx, ty);
        }

        if (axis.visible == false) {
            if (tick) {
                tick.remove();
                tick = null;
            }
            if (valueTF) {
                valueTF.remove();
                valueTF = null;
            }
        }

        if (valueTF) {
            valueTF.attr({
                'text-anchor': align
            });
            valueTF.translate(lx, ly);

            if (labelRotation != 0) {
                valueTF.rotate(-labelRotation);
            }
            axis.allLabels.push(valueTF);

            if (value != " ") {
                _this.label = valueTF;
            }
        }

        if (counter == 0) {
            axis.counter = 1;
        } else {
            axis.counter = 0;
        }
        axis.previousCoord = coord;

        // remove empty
        if (_this.set.node.childNodes.length == 0) {
            _this.set.remove();
        }
    },

    graphics: function() {
        return this.set;
    },

    getLabel: function() {
        return this.label;
    }
});;
AmCharts.RecFill = AmCharts.Class({
    construct: function(axis, guideCoord, guideToCoord, guide) {
        var _this = this;
        var dx = axis.dx;
        var dy = axis.dy;
        var orientation = axis.orientation;
        var shift = 0;

        if (guideToCoord < guideCoord) {
            var temp = guideCoord;
            guideCoord = guideToCoord;
            guideToCoord = temp;
        }

        var fillAlpha = guide.fillAlpha;
        if (isNaN(fillAlpha)) {
            fillAlpha = 0;
        }
        var container = axis.chart.container;
        var fillColor = guide.fillColor;


        if (orientation == "V") {
            guideCoord = AmCharts.fitToBounds(guideCoord, 0, axis.viH);
            guideToCoord = AmCharts.fitToBounds(guideToCoord, 0, axis.viH);
        } else {
            guideCoord = AmCharts.fitToBounds(guideCoord, 0, axis.viW);
            guideToCoord = AmCharts.fitToBounds(guideToCoord, 0, axis.viW);
        }

        var fillWidth = guideToCoord - guideCoord;

        if (isNaN(fillWidth)) {
            fillWidth = 4;
            shift = 2;
            fillAlpha = 0;
        }

        if (fillWidth < 0) {
            if (typeof(fillColor) == 'object') {
                fillColor = fillColor.join(',').split(',').reverse();
            }
        }

        var fill;

        if (orientation == "V") {
            fill = AmCharts.rect(container, axis.width, fillWidth, fillColor, fillAlpha);
            fill.translate(dx, guideCoord - shift + dy);
        } else {
            fill = AmCharts.rect(container, fillWidth, axis.height, fillColor, fillAlpha);
            fill.translate(guideCoord - shift + dx, dy);
        }
        _this.set = container.set([fill]);
    },

    graphics: function() {
        return this.set;
    },

    getLabel: function() {

    }


});;
AmCharts.RadAxis = AmCharts.Class({
    construct: function(axis) {
        var _this = this;
        var chart = axis.chart;
        var t = axis.axisThickness;
        var c = axis.axisColor;
        var a = axis.axisAlpha;
        var l = axis.tickLength;
        var x = axis.x;
        var y = axis.y;

        _this.set = chart.container.set();
        chart.axesSet.push(_this.set);

        var labelsEnabled = axis.labelsEnabled;
        var axisTitleOffset = axis.axisTitleOffset;
        var radarCategoriesEnabled = axis.radarCategoriesEnabled;

        var fontFamily = axis.chart.fontFamily;
        var textSize = axis.fontSize;

        if (textSize == undefined) {
            textSize = axis.chart.fontSize;
        }

        var color = axis.color;
        if (color == undefined) {
            color = axis.chart.color;
        }

        if (chart) {
            _this.axisWidth = axis.height;
            var dataProvider = chart.chartData;
            var count = dataProvider.length;

            for (var i = 0; i < count; i++) {
                var angle = 180 - 360 / count * i;
                var xx = x + _this.axisWidth * Math.sin((angle) / (180) * Math.PI);
                var yy = y + _this.axisWidth * Math.cos((angle) / (180) * Math.PI);

                var line = AmCharts.line(chart.container, [x, xx], [y, yy], c, a, t);
                _this.set.push(line);

                // label

                if (radarCategoriesEnabled) {
                    var align = "start";
                    var labelX = x + (_this.axisWidth + axisTitleOffset) * Math.sin((angle) / (180) * Math.PI);
                    var labelY = y + (_this.axisWidth + axisTitleOffset) * Math.cos((angle) / (180) * Math.PI);

                    if (angle == 180 || angle == 0) {
                        align = "middle";
                        labelX = labelX - 5;
                    }
                    if (angle < 0) {
                        align = "end";
                        labelX = labelX - 10;
                    }

                    if (angle == 180) {
                        labelY -= 5;
                    }

                    if (angle == 0) {
                        labelY += 5;
                    }

                    var titleTF = AmCharts.text(chart.container, dataProvider[i].category, color, fontFamily, textSize, align);
                    titleTF.translate(labelX + 5, labelY);
                    _this.set.push(titleTF);

                    var bbox = titleTF.getBBox();
                }
            }
        }
    }
});;
AmCharts.RadItem = AmCharts.Class({

    construct: function(axis, coord, value, below, textWidth, valueShift, guide) {
        var _this = this;
        if (value == undefined) {
            value = "";
        }

        var fontFamily = axis.chart.fontFamily;
        var textSize = axis.fontSize;

        if (textSize == undefined) {
            textSize = axis.chart.fontSize;
        }

        var color = axis.color;
        if (color == undefined) {
            color = axis.chart.color;
        }

        var container = axis.chart.container;
        var set = container.set();
        _this.set = set;

        var vCompensation = 3;
        var hCompensation = 4;
        var axisThickness = axis.axisThickness;
        var axisColor = axis.axisColor;
        var axisAlpha = axis.axisAlpha;
        var tickLength = axis.tickLength;
        var gridAlpha = axis.gridAlpha;
        var gridThickness = axis.gridThickness;
        var gridColor = axis.gridColor;
        var dashLength = axis.dashLength;
        var fillColor = axis.fillColor;
        var fillAlpha = axis.fillAlpha;
        var labelsEnabled = axis.labelsEnabled;
        var labelRotation = axis.labelRotation;
        var counter = axis.counter;
        var labelInside = axis.inside;
        var position = axis.position;
        var previousCoord = axis.previousCoord;
        var gridType = axis.gridType;

        coord -= axis.height;
        var tick;
        var grid;

        var x = axis.x;
        var y = axis.y;
        var lx = 0;
        var ly = 0;

        if (guide) {
            labelsEnabled = true;

            if (!isNaN(guide.tickLength)) {
                tickLength = guide.tickLength;
            }

            if (guide.lineColor != undefined) {
                gridColor = guide.lineColor;
            }

            if (!isNaN(guide.lineAlpha)) {
                gridAlpha = guide.lineAlpha;
            }

            if (!isNaN(guide.dashLength)) {
                dashLength = guide.dashLength;
            }

            if (!isNaN(guide.lineThickness)) {
                gridThickness = guide.lineThickness;
            }
            if (guide.inside == true) {
                labelInside = true;
            }
        } else {
            if (!value) {
                gridAlpha = gridAlpha / 3;
                tickLength = tickLength / 2;
            }
        }

        var align = "end";
        var dir = -1;
        if (labelInside) {
            align = "start";
            dir = 1;
        }

        if (labelsEnabled) {
            var valueTF = AmCharts.text(container, value, color, fontFamily, textSize, align);
            valueTF.translate(x + (tickLength + 3) * dir, coord);
            set.push(valueTF);

            _this.label = valueTF;

            var tick = AmCharts.line(container, [x, x + tickLength * dir], [coord, coord], axisColor, axisAlpha, gridThickness);
            set.push(tick);
        }

        var radius = axis.y - coord;

        // grid			
        if (gridType == "polygons") {
            var xx = [];
            var yy = [];
            var count = axis.data.length;

            for (var i = 0; i < count; i++) {
                var angle = 180 - 360 / count * i;
                xx.push(radius * Math.sin((angle) / (180) * Math.PI));
                yy.push(radius * Math.cos((angle) / (180) * Math.PI));
            }
            xx.push(xx[0]);
            yy.push(yy[0]);

            grid = AmCharts.line(container, xx, yy, gridColor, gridAlpha, gridThickness, dashLength);
        } else {
            grid = AmCharts.circle(container, radius, "#FFFFFF", 0, gridThickness, gridColor, gridAlpha);
        }
        grid.translate(x, y);
        set.push(grid);

        if (counter == 1 && fillAlpha > 0 && !guide) {
            var prevCoord = axis.previousCoord;
            var fill;

            if (gridType == "polygons") {
                for (i = count; i >= 0; i--) {
                    angle = 180 - 360 / count * i;
                    xx.push(prevCoord * Math.sin((angle) / (180) * Math.PI));
                    yy.push(prevCoord * Math.cos((angle) / (180) * Math.PI));
                }
                fill = AmCharts.polygon(container, xx, yy, fillColor, fillAlpha);
            } else {
                fill = AmCharts.wedge(container, 0, 0, 0, -360, radius, radius, prevCoord, 0, {
                    'fill': fillColor,
                    'fill-opacity': fillAlpha,
                    'stroke': 0,
                    'stroke-opacity': 0,
                    'stroke-width': 0
                });
            }
            set.push(fill);
            fill.translate(x, y);
        }


        if (axis.visible == false) {
            if (tick) {
                tick.hide();
            }
            if (valueTF) {
                valueTF.hide();
            }
        }

        if (counter == 0) {
            axis.counter = 1;
        } else {
            axis.counter = 0;
        }
        axis.previousCoord = radius;
    },

    graphics: function() {
        return this.set;
    },

    getLabel: function() {
        return this.label;
    }

});;
AmCharts.RadarFill = AmCharts.Class({
    construct: function(axis, guideCoord, guideToCoord, guide) {
        var guideToCoordReal = Math.max(guideCoord, guideToCoord);
        var guideCoordReal = Math.min(guideCoord, guideToCoord);

        guideToCoord = guideToCoordReal;
        guideCoord = guideCoordReal;

        var _this = this;
        var chart = axis.chart;
        var container = chart.container;
        var fillAlpha = guide.fillAlpha;
        var fillColor = guide.fillColor;
        var radius = Math.abs(guideToCoord) - axis.y;
        var innerRadius = Math.abs(guideCoord) - axis.y;
        var angle = -guide.angle;
        var toAngle = -guide.toAngle;
        if (isNaN(angle)) {
            angle = 0;
        }
        if (isNaN(toAngle)) {
            toAngle = -360;
        }

        _this.set = container.set();

        if (fillColor == undefined) {
            fillColor = "#000000";
        }

        if (isNaN(fillAlpha)) {
            fillAlpha = 0;
        }

        if (axis.gridType == "polygons") {
            var xx = [];
            var yy = [];

            var count = axis.data.length;

            for (var i = 0; i < count; i++) {
                var angle = 180 - 360 / count * i;
                xx.push(radius * Math.sin((angle) / (180) * Math.PI));
                yy.push(radius * Math.cos((angle) / (180) * Math.PI));
            }
            xx.push(xx[0]);
            yy.push(yy[0]);

            for (i = count; i >= 0; i--) {
                angle = 180 - 360 / count * i;
                xx.push(innerRadius * Math.sin((angle) / (180) * Math.PI));
                yy.push(innerRadius * Math.cos((angle) / (180) * Math.PI));
            }

            _this.fill = AmCharts.polygon(container, xx, yy, fillColor, fillAlpha);
        } else {
            _this.fill = AmCharts.wedge(container, 0, 0, angle, (toAngle - angle), radius, radius, innerRadius, 0, {
                'fill': fillColor,
                'fill-opacity': fillAlpha,
                'stroke': 0,
                'stroke-opacity': 0,
                'stroke-width': 0
            });
        }

        _this.set.push(_this.fill);
        _this.fill.translate(axis.x, axis.y);
    },

    graphics: function() {
        return this.set;
    },

    getLabel: function() {

    }

});;
AmCharts.AmGraph = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.createEvents('rollOverGraphItem', 'rollOutGraphItem', 'clickGraphItem', 'doubleClickGraphItem');
        _this.type = "line";
        _this.stackable = true;
        _this.columnCount = 1;
        _this.columnIndex = 0;
        _this.showBalloon = true;
        _this.centerCustomBullets = true;
        _this.maxBulletSize = 50;
        _this.minBulletSize = 0;
        _this.balloonText = "[[value]]";
        _this.animationPlayed = false;
        _this.scrollbar = false;
        _this.hidden = false;
        _this.columnWidth = 0.8;
        _this.pointPosition = "middle";
        _this.depthCount = 1;
        _this.includeInMinMax = true;
        _this.negativeBase = 0;
        _this.visibleInLegend = true;
        _this.showAllValueLabels = false;
        _this.showBalloonAt = "close";
        _this.lineThickness = 1;
        _this.dashLength = 0;
        _this.connect = true;
        _this.lineAlpha = 1;
        _this.bullet = "none";
        _this.bulletBorderThickness = 2;
        _this.bulletBorderAlpha = 1;
        _this.bulletAlpha = 1;
        _this.bulletSize = 8;
        _this.bulletOffset = 0;
        _this.hideBulletsCount = 0;
        _this.labelPosition = "top";
        _this.cornerRadiusTop = 0;
        _this.cursorBulletAlpha = 1;
        _this.gradientOrientation = "vertical";
        _this.dx = 0;
        _this.dy = 0;
        _this.periodValue = "";
        _this.x = 0;
        _this.y = 0;
    },

    draw: function() {
        var _this = this;
        var chart = _this.chart;
        var container = chart.container;
        _this.container = container;

        _this.destroy();
        var set = container.set();
        var bulletSet = container.set();


        if (_this.behindColumns) {
            chart.graphsBehindSet.push(set);
            chart.bulletBehindSet.push(bulletSet);
        } else {
            chart.graphsSet.push(set);
            chart.bulletSet.push(bulletSet);
        }


        _this.bulletSet = bulletSet;

        if (!_this.scrollbar) {
            var x = chart.marginLeftReal;
            var y = chart.marginTopReal;
            set.translate(x, y);
            bulletSet.translate(x, y);
        }

        if (_this.type == "column") {
            var columnsSet = container.set();
        }
        AmCharts.remove(_this.columnsSet);
        set.push(columnsSet);
        _this.set = set;
        _this.columnsSet = columnsSet;

        _this.columnsArray = [];
        _this.ownColumns = [];
        _this.allBullets = [];
        _this.animationArray = [];

        if (AmCharts.ifArray(_this.data)) {
            var create = false;

            if (_this.chartType == "xy") {
                if (_this.xAxis.axisCreated && _this.yAxis.axisCreated) {
                    create = true;
                }
            } else {
                if (_this.valueAxis.axisCreated) {
                    create = true;
                }
            }
            if (!_this.hidden && create) {
                _this.createGraph();
            }
        }
    },


    createGraph: function() {
        var _this = this;
        var chart = _this.chart;

        if (_this.labelPosition == "inside") {
            _this.labelPosition = "bottom";
        }

        _this.startAlpha = chart.startAlpha;
        _this.seqAn = chart.sequencedAnimation;
        _this.baseCoord = _this.valueAxis.baseCoord;

        if (!_this.fillColors) {
            _this.fillColors = _this.lineColor;
        }

        if (_this.fillAlphas == undefined) {
            _this.fillAlphas = 0;
        }

        if (_this.bulletColor == undefined) {
            _this.bulletColor = _this.lineColor;
            _this.bulletColorNegative = _this.negativeLineColor;
        }

        if (_this.bulletAlpha == undefined) {
            _this.bulletAlpha = _this.lineAlpha;
        }

        if (!_this.bulletBorderColor) {
            _this.bulletBorderAlpha = 0;
        }

        if (!isNaN(_this.valueAxis.min) && !isNaN(_this.valueAxis.max)) {
            switch (_this.chartType) {
                case "serial":
                    _this.createSerialGraph();
                    break;
                case "radar":
                    _this.createRadarGraph();
                    break;
                case "xy":
                    _this.createXYGraph();
                    _this.positiveClip(_this.set);
                    break;
            }
            _this.animationPlayed = true;
        }
    },

    createXYGraph: function() {
        var _this = this;
        var labelPosition = _this.labelPosition;
        var xx = [];
        var yy = [];

        var xAxis = _this.xAxis;
        var yAxis = _this.yAxis;

        _this.pmh = yAxis.viH + 1;
        _this.pmw = xAxis.viW + 1;
        _this.pmx = 0;
        _this.pmy = 0;

        for (var i = _this.start; i <= _this.end; i++) {
            var serialDataItem = _this.data[i];
            var graphDataItem = serialDataItem.axes[xAxis.id].graphs[_this.id];

            var values = graphDataItem.values;
            var xValue = values.x;
            var yValue = values.y;
            var value = values.value;

            var xxx = xAxis.getCoordinate(xValue);
            var yyy = yAxis.getCoordinate(yValue);

            if (!isNaN(xValue) && !isNaN(yValue)) {
                xx.push(xxx);
                yy.push(yyy);

                var bulletSize = _this.createBullet(graphDataItem, xxx, yyy, i);
                if (!bulletSize) {
                    bulletSize = 0;
                }

                // LABELS ////////////////////////////////////////////////////////
                var labelText = _this.labelText;
                if (labelText) {
                    var lText = _this.createLabel(graphDataItem, xxx, yyy, labelText);
                    _this.positionLabel(xxx, yyy, lText, _this.labelPosition, bulletSize);
                }
            }
        }
        _this.drawLineGraph(xx, yy);
        _this.launchAnimation();
    },


    createRadarGraph: function() {
        var _this = this;
        var stackType = _this.valueAxis.stackType;
        var xx = [];
        var yy = [];
        var firstX;
        var firstY;

        for (var i = _this.start; i <= _this.end; i++) {
            var serialDataItem = _this.data[i];
            var graphDataItem = serialDataItem.axes[_this.valueAxis.id].graphs[_this.id];

            var close;

            if (stackType == "none" || stackType == "3d") {
                close = graphDataItem.values.value;
            } else {
                close = graphDataItem.values.close;
            }


            if (isNaN(close)) {
                _this.drawLineGraph(xx, yy);
                xx = [];
                yy = [];
            } else {
                var coord = _this.y - (_this.valueAxis.getCoordinate(close) - _this.height);
                var angle = 180 - 360 / (_this.end - _this.start + 1) * i;

                var xxx = (coord * Math.sin((angle) / (180) * Math.PI));
                var yyy = (coord * Math.cos((angle) / (180) * Math.PI));

                xx.push(xxx);
                yy.push(yyy);

                var bulletSize = _this.createBullet(graphDataItem, xxx, yyy, i);

                if (!bulletSize) {
                    bulletSize = 0;
                }

                // LABELS ////////////////////////////////////////////////////////
                var labelText = _this.labelText;
                if (labelText) {
                    var lText = _this.createLabel(graphDataItem, xxx, yyy, labelText);
                    _this.positionLabel(xxx, yyy, lText, _this.labelPosition, bulletSize);
                }
                if (isNaN(firstX)) {
                    firstX = xxx;
                }
                if (isNaN(firstY)) {
                    firstY = yyy;
                }
            }
        }
        xx.push(firstX);
        yy.push(firstY);

        _this.drawLineGraph(xx, yy);
        _this.launchAnimation();
    },


    positionLabel: function(x, y, lText, labelPosition, bulletSize) {
        var _this = this;
        var bbox = lText.getBBox();
        var fontSize = _this.fontSize;
        if (fontSize == undefined) {
            fontSize = _this.chart.fontSize;
        }

        var dx = 0;
        var dy = 0;
        switch (labelPosition) {
            case "left":
                x -= ((bbox.width + bulletSize) / 2 + 2);
                dx = bbox.width / 2;
                dy = -2;
                break;
            case "top":
                y -= ((bulletSize + bbox.height) / 2 + 1);
                break;
            case "right":
                x += (bbox.width + bulletSize) / 2 + 2;
                dx = bbox.width / 2;
                dy = -2;
                break;
            case "bottom":
                y += (bulletSize + bbox.height) / 2 + 1;
                break;
        }

        lText.translate(x, y);
    },

    createSerialGraph: function() {
        var _this = this;
        var UNDEFINED = undefined;
        var id = _this.id;
        var index = _this.index;
        var data = _this.data;
        var container = _this.chart.container;
        var valueAxis = _this.valueAxis;
        var type = _this.type;
        var columnWidth = _this.columnWidth;
        var width = _this.width;
        var height = _this.height;
        var x = _this.x;
        var y = _this.y;
        var rotate = _this.rotate;
        var columnCount = _this.columnCount;
        var crt = AmCharts.toCoordinate(_this.cornerRadiusTop, columnWidth / 2);
        var connect = _this.connect;
        var xx = [];
        var yy = [];
        var previousxClose;
        var previousyClose;
        var totalGarphs = _this.chart.graphs.length;
        var depth;
        var dx = _this.dx / _this.depthCount;
        var dy = _this.dy / _this.depthCount;
        var stackType = valueAxis.stackType;
        var labelPosition = _this.labelPosition;
        var start = _this.start;
        var end = _this.end;
        var scrollbar = _this.scrollbar;
        var categoryAxis = _this.categoryAxis;
        var baseCoord = _this.baseCoord;
        var negativeBase = _this.negativeBase;
        var columnIndex = _this.columnIndex;
        var lineThickness = _this.lineThickness;
        var lineAlpha = _this.lineAlpha;
        var lineColor = _this.lineColor;
        var dashLength = _this.dashLength;
        var set = _this.set;

        // backward compatibility with old flash version
        if (labelPosition == "above") {
            labelPosition = "top"
        }
        if (labelPosition == "below") {
            labelPosition = "bottom"
        }
        var labelPositionOriginal = labelPosition;
        var timeout;
        var gradientRotation = 270;
        if (_this.gradientOrientation == "horizontal") {
            gradientRotation = 0;
        }
        this.gradientRotation = gradientRotation;

        var columnSpacing = _this.chart.columnSpacing;
        var cellWidth = categoryAxis.cellWidth;
        var maxSpacing = (cellWidth * columnWidth - columnCount) / columnCount;
        if (columnSpacing > maxSpacing) {
            columnSpacing = maxSpacing;
        }

        var serialDataItem;
        var graphDataItem;
        var value;

        // dimensions and position of positive mask
        var pmh = height + 1;
        var pmw = width + 1;
        var pmx = 0;
        var pmy = 0;
        // dimensions and position of negative mask
        var nmh;
        var nmw;
        var nmx;
        var nmy;

        var fillColors = _this.fillColors;
        var negativeFillColors = _this.negativeFillColors;
        var negativeLineColor = _this.negativeLineColor;
        var fillAlphas = _this.fillAlphas;
        var negativeFillAlphas = _this.negativeFillAlphas;

        // arrays of fillAlphas are not supported, but might be received, take first value only.
        if (typeof(fillAlphas) == 'object') {
            fillAlphas = fillAlphas[0];
        }
        if (typeof(negativeFillAlphas) == 'object') {
            negativeFillAlphas = negativeFillAlphas[0];
        }

        // get coordinate of minimum axis value
        var minCoord = valueAxis.getCoordinate(valueAxis.min);

        if (valueAxis.logarithmic) {
            minCoord = valueAxis.getCoordinate(valueAxis.minReal);
        }
        _this.minCoord = minCoord;

        // bullet could be set previously if only one data point was available
        if (_this.resetBullet) {
            _this.bullet = "none";
        }
        // if it's line/smoothedLine/step graph, mask (clip rectangle will be applied on a line. Calculate mask dimensions here.	
        if (!scrollbar && (type == "line" || type == "smoothedLine" || type == "step")) {
            // if it's line/smoothedLine and there is one data point only, set bullet to round if not set any			
            if (data.length == 1 && type != "step" && _this.bullet == "none") {
                _this.bullet = "round";
                _this.resetBullet = true;
            }
            // only need to do adjustments if negative colors are set
            if (negativeFillColors || negativeLineColor != UNDEFINED) {
                var zeroValue = negativeBase;
                if (zeroValue > valueAxis.max) {
                    zeroValue = valueAxis.max;
                }

                if (zeroValue < valueAxis.min) {
                    zeroValue = valueAxis.min;
                }

                if (valueAxis.logarithmic) {
                    zeroValue = valueAxis.minReal;
                }

                var zeroCoord = valueAxis.getCoordinate(zeroValue);
                var maxCoord = valueAxis.getCoordinate(valueAxis.max);

                if (rotate) {
                    pmh = height;
                    pmw = Math.abs(maxCoord - zeroCoord);
                    nmh = height;
                    nmw = Math.abs(minCoord - zeroCoord);

                    pmy = 0;
                    nmy = 0;

                    if (valueAxis.reversed) {
                        pmx = 0;
                        nmx = zeroCoord;
                    } else {
                        pmx = zeroCoord;
                        nmx = 0;
                    }
                } else {
                    pmw = width;
                    pmh = Math.abs(maxCoord - zeroCoord);
                    nmw = width;
                    nmh = Math.abs(minCoord - zeroCoord);

                    pmx = 0;
                    nmx = 0;

                    if (valueAxis.reversed) {
                        nmy = y;
                        pmy = zeroCoord;
                    } else {
                        nmy = zeroCoord + 1;
                    }
                }
            }
        }
        var round = Math.round;

        _this.pmx = round(pmx);
        _this.pmy = round(pmy);
        _this.pmh = round(pmh);
        _this.pmw = round(pmw);

        _this.nmx = round(nmx);
        _this.nmy = round(nmy);
        _this.nmh = round(nmh);
        _this.nmw = round(nmw);

        // get column width		
        if (type == "column") {
            columnWidth = (cellWidth * columnWidth - (columnSpacing * (columnCount - 1))) / columnCount;
        } else {
            columnWidth = cellWidth * columnWidth;
        }
        // set one pixel if actual width is less
        if (columnWidth < 1) {
            columnWidth = 1;
        }

        // find first not missing value
        var i;
        if (type == "line" || type == "step" || type == "smoothedLine") {
            if (start > 0) {
                for (i = start - 1; i > -1; i--) {
                    serialDataItem = data[i];
                    graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
                    value = graphDataItem.values.value;

                    if (value) {
                        start = i;
                        break;
                    }
                }
            }
            if (end < data.length - 1) {
                for (i = end + 1; i < data.length; i++) {
                    serialDataItem = data[i];
                    graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
                    value = graphDataItem.values.value;

                    if (value) {
                        end = i;
                        break;
                    }
                }
            }
        }
        // add one more		
        if (end < data.length - 1) {
            end++;
        }

        var sxx = [];
        var syy = [];
        var stackableLine = false;
        if (type == "line" || type == "step" || type == "smoothedLine") {
            if (_this.stackable && stackType == "regular" || stackType == "100%" || _this.fillToGraph) {
                stackableLine = true;
            }
        }

        ///////////////////////////////////////////////////////////////////////////
        // now go through all data items and get coordinates or draw actual objects
        for (i = start; i <= end; i++) {
            serialDataItem = data[i];
            graphDataItem = serialDataItem.axes[valueAxis.id].graphs[id];
            graphDataItem.index = i;

            var finalDimension;
            var property;
            var xxx = NaN;
            var xClose = NaN;
            var yClose = NaN;
            var xOpen = NaN;
            var yOpen = NaN;
            var xLow = NaN;
            var yLow = NaN;
            var xHigh = NaN;
            var yHigh = NaN;

            var labelX = NaN;
            var labelY = NaN;
            var bulletX = NaN;
            var bulletY = NaN;

            var close = NaN;
            var cuboid = UNDEFINED;

            var fillColorsReal = fillColors;
            var fillAlphasReal = fillAlphas;
            var lineColorReal = lineColor;

            if (graphDataItem.color != UNDEFINED) {
                fillColorsReal = graphDataItem.color;
            }

            if (graphDataItem.fillColors) {
                fillColorsReal = graphDataItem.fillColors;
            }

            if (!isNaN(graphDataItem.alpha)) {
                fillAlphasReal = graphDataItem.alpha;
            }

            var values = graphDataItem.values;
            if (valueAxis.recalculateToPercents) {
                values = graphDataItem.percents;
            }

            if (values) {
                if (!_this.stackable || stackType == "none" || stackType == "3d") {
                    close = values.value;
                } else {
                    close = values.close;
                }

                // in case candlestick
                if (type == "candlestick" || type == "ohlc") {
                    close = values.close;
                    var low = values.low;
                    yLow = valueAxis.getCoordinate(low);

                    var high = values.high;
                    yHigh = valueAxis.getCoordinate(high);
                }

                var open = values.open;
                yClose = valueAxis.getCoordinate(close);

                if (!isNaN(open)) {
                    yOpen = valueAxis.getCoordinate(open);
                }

                // do not store y if this is scrollbar
                if (!scrollbar) {
                    switch (_this.showBalloonAt) {
                        case "close":
                            graphDataItem.y = yClose;
                            break;
                        case "open":
                            graphDataItem.y = yOpen;
                            break;
                        case "high":
                            graphDataItem.y = yHigh;
                            break;
                        case "low":
                            graphDataItem.y = yLow;
                            break;
                    }
                }
                // x coordinate			
                xxx = serialDataItem.x[categoryAxis.id];

                var stepLineDelta1 = Math.floor(cellWidth / 2);
                var stepLineDelta2 = stepLineDelta1;

                if (_this.pointPosition == "start") {
                    xxx -= cellWidth / 2;
                    stepLineDelta1 = 0;
                    stepLineDelta2 = cellWidth;
                }

                if (!scrollbar) {
                    graphDataItem.x = xxx;
                }

                // fix to avoid wrong behavior when lines are too long
                // theorethically this is not 100% correct approach, but visually there is no any diference.
                var maxmax = 100000;

                if (xxx < -maxmax) {
                    xxx = -maxmax;
                }

                if (xxx > width + maxmax) {
                    xxx = width + maxmax;
                }

                if (rotate) {
                    xClose = yClose;
                    xOpen = yOpen;

                    yClose = xxx;
                    yOpen = xxx;

                    if (isNaN(open) && !_this.fillToGraph) {
                        xOpen = baseCoord;
                    }

                    xLow = yLow;
                    xHigh = yHigh;
                } else {
                    xClose = xxx;
                    xOpen = xxx;

                    if (isNaN(open) && !_this.fillToGraph) {
                        yOpen = baseCoord;
                    }
                }

                switch (type) {
                    // LINE
                    case "line":
                        if (!isNaN(close)) {
                            if (close < negativeBase) {
                                graphDataItem.isNegative = true;
                            } else {
                                graphDataItem.isNegative = false;
                            }

                            xx.push(xClose);
                            yy.push(yClose);
                            labelX = xClose;
                            labelY = yClose;
                            bulletX = xClose;
                            bulletY = yClose;

                            if (stackableLine) {
                                if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                    sxx.push(xOpen);
                                    syy.push(yOpen);
                                }
                            }
                        } else if (!connect) {
                            _this.drawLineGraph(xx, yy, sxx, syy);
                            xx = [];
                            yy = [];

                            sxx = [];
                            syy = [];
                        }
                        break;

                    case "smoothedLine":
                        if (!isNaN(close)) {
                            if (close < negativeBase) {
                                graphDataItem.isNegative = true;
                            } else {
                                graphDataItem.isNegative = false;
                            }

                            xx.push(xClose);
                            yy.push(yClose);
                            labelX = xClose;
                            labelY = yClose;
                            bulletX = xClose;
                            bulletY = yClose;

                            if (stackableLine) {
                                if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                    sxx.push(xOpen);
                                    syy.push(yOpen);
                                }
                            }
                        } else if (!connect) {
                            _this.drawSmoothedGraph(xx, yy, sxx, syy);
                            xx = [];
                            yy = [];

                            sxx = [];
                            syy = [];
                        }
                        break;

                        // STEP
                    case "step":
                        if (!isNaN(close)) {
                            if (close < negativeBase) {
                                graphDataItem.isNegative = true;
                            } else {
                                graphDataItem.isNegative = false;
                            }
                            if (rotate) {
                                if (!isNaN(previousxClose)) {
                                    xx.push(previousxClose);
                                    yy.push(yClose - stepLineDelta1);
                                }
                                yy.push(yClose - stepLineDelta1);
                                xx.push(xClose);
                                yy.push(yClose + stepLineDelta2);
                                xx.push(xClose);

                                if (stackableLine) {
                                    if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                        sxx.push(xOpen);
                                        syy.push(yOpen - stepLineDelta1);
                                        sxx.push(xOpen);
                                        syy.push(yOpen + stepLineDelta2);
                                    }
                                }
                            } else {
                                if (!isNaN(previousyClose)) {
                                    yy.push(previousyClose);
                                    xx.push(xClose - stepLineDelta1);
                                }
                                xx.push(xClose - stepLineDelta1);
                                yy.push(yClose);
                                xx.push(xClose + stepLineDelta2);
                                yy.push(yClose);

                                if (stackableLine) {
                                    if (!isNaN(yOpen) && !isNaN(xOpen)) {
                                        sxx.push(xOpen - stepLineDelta1);
                                        syy.push(yOpen);
                                        sxx.push(xOpen + stepLineDelta2);
                                        syy.push(yOpen);
                                    }
                                }
                            }
                            previousxClose = xClose;
                            previousyClose = yClose;
                            labelX = xClose;
                            labelY = yClose;
                            bulletX = xClose;
                            bulletY = yClose;
                        } else if (!connect) {
                            previousyClose = NaN;

                            _this.drawLineGraph(xx, yy, sxx, syy);
                            xx = [];
                            yy = [];

                            sxx = [];
                            syy = [];
                        }
                        break;


                        // COLUMN
                    case "column":
                        var cuboid;
                        var borderColor = lineColorReal;
                        if (graphDataItem.lineColor != UNDEFINED) {
                            borderColor = graphDataItem.lineColor;
                        }

                        if (!isNaN(close)) {
                            if (close < negativeBase) {
                                graphDataItem.isNegative = true;

                                if (negativeFillColors) {
                                    fillColorsReal = negativeFillColors;
                                }

                                if (negativeLineColor != UNDEFINED) {
                                    lineColorReal = negativeLineColor;
                                }
                            } else {
                                graphDataItem.isNegative = false;
                            }
                            var min = valueAxis.min;
                            var max = valueAxis.max;

                            if ((close < min && (open < min || open == UNDEFINED)) || (close > max && open > max)) {
                                // void						
                            } else {
                                if (rotate) {
                                    if (stackType == '3d') {
                                        var cy = yClose - 0.5 * (columnWidth + columnSpacing) + columnSpacing / 2 + dy * columnIndex;
                                        var cx = xOpen + dx * columnIndex;
                                    } else {
                                        var cy = yClose - (columnCount / 2 - columnIndex) * (columnWidth + columnSpacing) + columnSpacing / 2;
                                        var cx = xOpen;
                                    }

                                    var cw = columnWidth;

                                    labelX = xClose;
                                    labelY = cy + columnWidth / 2;

                                    bulletX = xClose;
                                    bulletY = cy + columnWidth / 2;

                                    if (cy + cw > height) {
                                        cw = height - cy;
                                    }

                                    if (cy < 0) {
                                        cw += cy;
                                        cy = 0;
                                    }

                                    var ch = xClose - xOpen;
                                    var cxr = cx;
                                    cx = AmCharts.fitToBounds(cx, 0, width);
                                    ch = ch + (cxr - cx);
                                    ch = AmCharts.fitToBounds(ch, -cx, width - cx + dx * columnIndex);

                                    if (cy < height && cw > 0) {
                                        cuboid = new AmCharts.Cuboid(container, ch, cw, dx, dy, fillColorsReal, fillAlphasReal, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate);

                                        if (labelPosition != "bottom") {
                                            if (!valueAxis.reversed) {
                                                labelPosition = "right";
                                            } else {
                                                labelPosition = "left";
                                            }

                                            if (close < 0) {
                                                if (!valueAxis.reversed) {
                                                    labelPosition = "left";
                                                } else {
                                                    labelPosition = "right";
                                                }
                                            } else {
                                                if (stackType == "regular" || stackType == "100%") {
                                                    labelX += _this.dx;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (stackType == '3d') {
                                        var cx = xClose - 0.5 * (columnWidth + columnSpacing) + columnSpacing / 2 + dx * columnIndex;
                                        var cy = yOpen + dy * columnIndex;
                                    } else {
                                        var cx = xClose - (columnCount / 2 - columnIndex) * (columnWidth + columnSpacing) + columnSpacing / 2;
                                        var cy = yOpen;
                                    }
                                    var cw = columnWidth;

                                    labelX = cx + columnWidth / 2;
                                    labelY = yClose;

                                    bulletX = cx + columnWidth / 2;
                                    bulletY = yClose;

                                    if (cx + cw > width + columnIndex * dx) {
                                        cw = width - cx + columnIndex * dx;
                                    }

                                    if (cx < 0) {
                                        cw += cx;
                                        cx = 0;
                                    }

                                    var ch = yClose - yOpen;

                                    var cyr = cy;
                                    cy = AmCharts.fitToBounds(cy, _this.dy, height);
                                    ch = ch + (cyr - cy);
                                    ch = AmCharts.fitToBounds(ch, -cy + dy * columnIndex, height - cy);

                                    if (cx < width + columnIndex * dx && cw > 0) {
                                        cuboid = new AmCharts.Cuboid(container, cw, ch, dx, dy, fillColorsReal, fillAlphasReal, lineThickness, borderColor, _this.lineAlpha, gradientRotation, crt, rotate);

                                        if (close < 0 && labelPosition != "middle") {
                                            labelPosition = "bottom";
                                        } else {
                                            labelPosition = labelPositionOriginal;
                                            if (stackType == "regular" || stackType == "100%") {
                                                labelY += _this.dy;
                                            }
                                        }
                                    }
                                }
                            }


                            if (cuboid) {
                                var cset = cuboid.set;
                                cset.translate(cx, cy);
                                _this.columnsSet.push(cset);
                                if (graphDataItem.url || graphDataItem.drill) {
                                    cset.setAttr("cursor", "pointer");
                                }

                                // in case columns array is passed (it is not passed only for the scrollers chart, as it can't be 3d
                                // all columns are placed into array with predicted depth, then sorted by depth in Serial Chart and
                                // added to columnsContainer which was created in AmSerialChart class
                                if (!scrollbar) {
                                    if (stackType == "none") {
                                        if (rotate) {
                                            depth = (_this.end + 1 - i) * totalGarphs - index;
                                        } else {
                                            depth = totalGarphs * i + index;
                                        }
                                    }

                                    if (stackType == "3d") {
                                        if (rotate) {
                                            depth = (totalGarphs - index) * (_this.end + 1 - i);
                                            labelX += dx * _this.columnIndex;
                                            bulletX += dx * _this.columnIndex;
                                            graphDataItem.y += dx * _this.columnIndex;

                                        } else {
                                            depth = (totalGarphs - index) * (i + 1);
                                            labelX += 3;
                                            labelY += dy * _this.columnIndex + 7;
                                            bulletY += dy * _this.columnIndex;
                                            graphDataItem.y += dy * _this.columnIndex;
                                        }

                                    }
                                    if (stackType == "regular" || stackType == "100%") {
                                        labelPosition = "middle";
                                        if (rotate) {
                                            if (values.value > 0) {
                                                depth = (_this.end + 1 - i) * totalGarphs + index;
                                            } else {
                                                depth = (_this.end + 1 - i) * totalGarphs - index;
                                            }
                                        } else {
                                            if (values.value > 0) {
                                                depth = (totalGarphs * i) + index;
                                            } else {
                                                depth = totalGarphs * i - index;
                                            }
                                        }
                                    }

                                    _this.columnsArray.push({
                                        column: cuboid,
                                        depth: depth
                                    });

                                    if (rotate) {
                                        graphDataItem.x = cy + cw / 2;
                                    } else {
                                        graphDataItem.x = cx + cw / 2;
                                    }
                                    _this.ownColumns.push(cuboid);
                                    _this.animateColumns(cuboid, i, xClose, xOpen, yClose, yOpen);
                                    _this.addListeners(cset, graphDataItem);
                                }
                                graphDataItem.columnSprite = cset;
                            }
                        }
                        break;
                        // CANDLESTICK
                    case "candlestick":
                        if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {

                            var highLine;
                            var lowLine;

                            if (close < open) {
                                graphDataItem.isNegative = true;

                                if (negativeFillColors) {
                                    fillColorsReal = negativeFillColors;
                                }

                                if (negativeFillAlphas) {
                                    fillAlphasReal = negativeFillAlphas;
                                }

                                if (negativeLineColor != UNDEFINED) {
                                    lineColorReal = negativeLineColor;
                                }
                            }

                            var borderColor = lineColorReal;
                            if (graphDataItem.lineColor != UNDEFINED) {
                                borderColor = graphDataItem.lineColor;
                            }

                            if (rotate) {
                                var cy = yClose - columnWidth / 2;
                                var cx = xOpen;

                                var cw = columnWidth;
                                if (cy + cw > height) {
                                    cw = height - cy;
                                }

                                if (cy < 0) {
                                    cw += cy;
                                    cy = 0;
                                }

                                if (cy < height && cw > 0) {
                                    var xArrayHigh;
                                    var xArrayLow;

                                    if (close > open) {
                                        xArrayHigh = [xClose, xHigh];
                                        xArrayLow = [xOpen, xLow];
                                    } else {
                                        xArrayHigh = [xOpen, xHigh];
                                        xArrayLow = [xClose, xLow];
                                    }
                                    if (yClose < height && yClose > 0) {
                                        highLine = AmCharts.line(container, xArrayHigh, [yClose, yClose], borderColor, lineAlpha, lineThickness);
                                        lowLine = AmCharts.line(container, xArrayLow, [yClose, yClose], borderColor, lineAlpha, lineThickness);
                                    }
                                    var ch = xClose - xOpen;

                                    cuboid = new AmCharts.Cuboid(container, ch, cw, dx, dy, fillColorsReal, fillAlphas, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate);
                                }
                            } else {
                                var cx = xClose - columnWidth / 2;
                                var cy = yOpen + lineThickness / 2;

                                var cw = columnWidth;
                                if (cx + cw > width) {
                                    cw = width - cx;
                                }

                                if (cx < 0) {
                                    cw += cx;
                                    cx = 0;
                                }

                                var ch = yClose - yOpen;

                                if (cx < width && cw > 0) {
                                    cuboid = new AmCharts.Cuboid(container, cw, ch, dx, dy, fillColorsReal, fillAlphasReal, lineThickness, borderColor, lineAlpha, gradientRotation, crt, rotate);
                                    var yArrayHigh;
                                    var yArrayLow;
                                    if (close > open) {
                                        yArrayHigh = [yClose, yHigh];
                                        yArrayLow = [yOpen, yLow];
                                    } else {
                                        yArrayHigh = [yOpen, yHigh];
                                        yArrayLow = [yClose, yLow];
                                    }
                                    if (xClose < width && xClose > 0) {
                                        highLine = AmCharts.line(container, [xClose, xClose], yArrayHigh, borderColor, lineAlpha, lineThickness);
                                        lowLine = AmCharts.line(container, [xClose, xClose], yArrayLow, borderColor, lineAlpha, lineThickness);
                                    }
                                }
                            }
                            if (cuboid) {
                                var cset = cuboid.set;
                                set.push(cset);
                                cset.translate(cx, cy);

                                if (graphDataItem.url || graphDataItem.drill) {
                                    cset.setAttr("cursor", "pointer");
                                }

                                if (highLine) {
                                    set.push(highLine);
                                    set.push(lowLine);
                                }

                                labelX = xClose;
                                labelY = yClose;
                                bulletX = xClose;
                                bulletY = yClose;

                                if (!scrollbar) {
                                    if (rotate) {
                                        graphDataItem.x = cy + cw / 2;
                                    } else {
                                        graphDataItem.x = cx + cw / 2;
                                    }

                                    _this.animateColumns(cuboid, i, xClose, xOpen, yClose, yOpen);

                                    _this.addListeners(cset, graphDataItem);
                                }
                            }
                        }
                        break;

                        // OHLC ////////////////////////
                    case "ohlc":
                        if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {
                            if (close < open) {
                                graphDataItem.isNegative = true;

                                if (negativeLineColor != UNDEFINED) {
                                    lineColorReal = negativeLineColor;
                                }
                            }
                            var verticalLine;
                            var openLine;
                            var closeLine;
                            if (rotate) {
                                var y1 = yClose - columnWidth / 2
                                y1 = AmCharts.fitToBounds(y1, 0, height);
                                var y2 = AmCharts.fitToBounds(yClose, 0, height);
                                var y3 = yClose + columnWidth / 2;
                                y3 = AmCharts.fitToBounds(y3, 0, height);
                                openLine = AmCharts.line(container, [xOpen, xOpen], [y1, y2], lineColorReal, lineAlpha, lineThickness, dashLength);
                                if (yClose > 0 && yClose < height) {
                                    verticalLine = AmCharts.line(container, [xLow, xHigh], [yClose, yClose], lineColorReal, lineAlpha, lineThickness, dashLength);
                                }

                                closeLine = AmCharts.line(container, [xClose, xClose], [y2, y3], lineColorReal, lineAlpha, lineThickness, dashLength);
                            } else {
                                var x1 = xClose - columnWidth / 2;
                                x1 = AmCharts.fitToBounds(x1, 0, width);
                                var x2 = AmCharts.fitToBounds(xClose, 0, width);
                                var x3 = xClose + columnWidth / 2;
                                x3 = AmCharts.fitToBounds(x3, 0, width);
                                openLine = AmCharts.line(container, [x1, x2], [yOpen, yOpen], lineColorReal, lineAlpha, lineThickness, dashLength);
                                if (xClose > 0 && xClose < width) {
                                    verticalLine = AmCharts.line(container, [xClose, xClose], [yLow, yHigh], lineColorReal, lineAlpha, lineThickness, dashLength);
                                }
                                closeLine = AmCharts.line(container, [x2, x3], [yClose, yClose], lineColorReal, lineAlpha, lineThickness, dashLength);
                            }

                            set.push(openLine);
                            set.push(verticalLine);
                            set.push(closeLine);

                            labelX = xClose;
                            labelY = yClose;
                            bulletX = xClose;
                            bulletY = yClose;
                        }
                        break;
                }

                // BULLETS AND LABELS
                if (!scrollbar && !isNaN(close)) {
                    var hideBulletsCount = _this.hideBulletsCount;
                    if (_this.end - _this.start <= hideBulletsCount || hideBulletsCount == 0) {
                        var bulletSize = _this.createBullet(graphDataItem, bulletX, bulletY, i);

                        if (!bulletSize) {
                            bulletSize = 0;
                        }



                        // LABELS ////////////////////////////////////////////////////////
                        var labelText = _this.labelText;
                        if (labelText) {
                            var lText = _this.createLabel(graphDataItem, 0, 0, labelText);
                            var lx = 0;
                            var ly = 0;
                            var bbox = lText.getBBox();
                            var textWidth = bbox.width;
                            var textHeight = bbox.height;

                            switch (labelPosition) {
                                case "left":
                                    lx = -(textWidth / 2 + bulletSize / 2 + 3);
                                    break;
                                case "top":
                                    ly = -(textHeight / 2 + bulletSize / 2 + 3);
                                    break;
                                case "right":
                                    lx = bulletSize / 2 + 2 + textWidth / 2;
                                    break;
                                case "bottom":
                                    if (rotate && type == "column") {
                                        labelX = baseCoord;

                                        if (close < 0) {
                                            lx = -6;
                                            lText.attr({
                                                'text-anchor': 'end'
                                            });
                                        } else {
                                            lx = 6;
                                            lText.attr({
                                                'text-anchor': 'start'
                                            });
                                        }
                                    } else {
                                        ly = bulletSize / 2 + textHeight / 2;
                                        lText.x = -(textWidth / 2 + 2);
                                    }
                                    break;
                                case "middle":
                                    if (type == "column") {
                                        if (rotate) {
                                            lx = -(xClose - xOpen) / 2 - dx;
                                            if (ch < 0) {
                                                lx += dx;
                                            }

                                            if (Math.abs(xClose - xOpen) < textWidth) {
                                                if (!_this.showAllValueLabels) {
                                                    lText.remove();
                                                    lText = null;
                                                }
                                            }
                                        } else {
                                            ly = -(yClose - yOpen) / 2;
                                            if (ch < 0) {
                                                ly -= dy;
                                            }

                                            if (Math.abs(yClose - yOpen) < textHeight) {
                                                if (!_this.showAllValueLabels) {
                                                    lText.remove();
                                                    lText = null;
                                                }
                                            }
                                        }
                                    }
                                    break;
                            }


                            if (lText) {
                                if (!isNaN(labelY) && !isNaN(labelX)) {
                                    labelX += lx;
                                    labelY += ly;
                                    lText.translate(labelX, labelY);

                                    if (rotate) {
                                        if (labelY < 0 || labelY > height) {
                                            lText.remove();
                                            lText = null;
                                        }
                                    } else {
                                        var ddx = 0;
                                        if (stackType == "3d") {
                                            ddx = dx * columnIndex;
                                        }

                                        if (labelX < 0 || labelX > width + ddx) {
                                            lText.remove();
                                            lText = null;
                                        }
                                    }
                                } else {
                                    lText.remove();
                                    lText = null;
                                }

                            }
                        }
                        // TOTALS
                        if (type == "column" && stackType == "regular" || stackType == "100%") {
                            var totalText = valueAxis.totalText;
                            if (totalText) {
                                var tText = _this.createLabel(graphDataItem, 0, 0, totalText);

                                var tbox = tText.getBBox();
                                var tWidth = tbox.width;
                                var tHeight = tbox.height;
                                var tx;
                                var ty;

                                var previousTotal = valueAxis.totals[i];
                                if (previousTotal) {
                                    previousTotal.remove();
                                }

                                if (rotate) {
                                    ty = yClose;
                                    if (close < 0) {
                                        tx = xClose - tWidth / 2 - 2;
                                    } else {
                                        tx = xClose + tWidth / 2 + 3;
                                    }
                                } else {
                                    tx = xClose;
                                    if (close < 0) {
                                        ty = yClose + tHeight / 2;
                                    } else {
                                        ty = yClose - tHeight / 2 - 3;
                                    }
                                }
                                tText.translate(tx, ty);
                                valueAxis.totals[i] = tText;

                                if (rotate) {
                                    if (ty < 0 || ty > height) {
                                        tText.remove();
                                    }
                                } else {
                                    if (tx < 0 || tx > width) {
                                        tText.remove();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        if (type == "line" || type == "step" || type == "smoothedLine") {
            if (type == "smoothedLine") {
                _this.drawSmoothedGraph(xx, yy, sxx, syy);
            } else {
                _this.drawLineGraph(xx, yy, sxx, syy);
            }
            if (!scrollbar) {
                _this.launchAnimation();
            }
        }
    },

    animateColumns: function(cuboid, i, xClose, xOpen, yClose, yOpen) {
        var _this = this;

        var duration = _this.chart.startDuration;

        if (duration > 0 && !_this.animationPlayed) {
            if (_this.seqAn) {
                cuboid.set.hide();
                _this.animationArray.push(cuboid);
                var timeout = setTimeout(function() {
                    _this.animate.call(_this)
                }, duration / (_this.end - _this.start + 1) * (i - _this.start) * 1000);
                _this.timeOuts.push(timeout);
            } else {
                _this.animate(cuboid);
            }
        }
    },

    createLabel: function(graphDataItem, labelX, labelY, labelText) {
        var _this = this;
        var chart = _this.chart;
        var numberFormatter = _this.numberFormatter;
        if (!numberFormatter) {
            numberFormatter = chart.numberFormatter;
        }

        var color = _this.color;
        if (color == undefined) {
            color = chart.color;
        }

        var fontSize = _this.fontSize;
        if (fontSize == undefined) {
            fontSize = chart.fontSize;
        }

        var text = chart.formatString(labelText, graphDataItem, this);
        text = AmCharts.cleanFromEmpty(text);

        var lText = AmCharts.text(_this.container, text, color, chart.fontFamily, fontSize);
        lText.translate(labelX, labelY);

        _this.bulletSet.push(lText);
        _this.allBullets.push(lText);
        return lText;
    },

    positiveClip: function(obj) {
        var _this = this;

        obj.clipRect(_this.pmx, _this.pmy, _this.pmw, _this.pmh);
    },

    negativeClip: function(obj) {
        var _this = this;
        obj.clipRect(_this.nmx, _this.nmy, _this.nmw, _this.nmh);
    },


    drawLineGraph: function(xx, yy, sxx, syy) {
        var _this = this;
        if (xx.length > 1) {
            var set = _this.set;
            var container = _this.container;

            var positiveSet = container.set();
            var negativeSet = container.set();

            set.push(positiveSet);
            set.push(negativeSet);

            var lineAlpha = _this.lineAlpha;
            var lineThickness = _this.lineThickness;
            var dashLength = _this.dashLength;
            var fillAlphas = _this.fillAlphas;
            var lineColor = _this.lineColor;
            var fillColors = _this.fillColors;
            var negativeLineColor = _this.negativeLineColor;
            var negativeFillColors = _this.negativeFillColors;
            var negativeFillAlphas = _this.negativeFillAlphas;
            var baseCoord = _this.baseCoord;

            // draw lines
            var line = AmCharts.line(container, xx, yy, lineColor, lineAlpha, lineThickness, dashLength, false, true);
            positiveSet.push(line);
            /**
             * 添加lineURL属性，为图添加阴影效果
             */
            if (positiveSet.node && container.R && container.R.lineURL) {
                positiveSet.node.setAttribute("filter", container.R.lineURL);
            }
            //===== add end ====================

            if (negativeLineColor != undefined) {
                var negativeLine = AmCharts.line(container, xx, yy, negativeLineColor, lineAlpha, lineThickness, dashLength, false, true);
                negativeSet.push(negativeLine);
            }

            if (fillAlphas > 0) {
                var xxx = xx.join(";").split(";");
                var yyy = yy.join(";").split(";");

                if (_this.chartType == "serial") {
                    if (sxx.length > 0) {
                        sxx.reverse();
                        syy.reverse();

                        xxx = xx.concat(sxx);
                        yyy = yy.concat(syy);
                    } else {
                        if (_this.rotate) {
                            yyy.push(yyy[yyy.length - 1]);
                            xxx.push(baseCoord);
                            yyy.push(yyy[0]);
                            xxx.push(baseCoord);
                            yyy.push(yyy[0]);
                            xxx.push(xxx[0]);
                        } else {
                            xxx.push(xxx[xxx.length - 1]);
                            yyy.push(baseCoord);
                            xxx.push(xxx[0]);
                            yyy.push(baseCoord);
                            xxx.push(xx[0]);
                            yyy.push(yyy[0]);
                        }
                    }
                }

                var fill = AmCharts.polygon(container, xxx, yyy, fillColors, fillAlphas, 0, 0, 0, this.gradientRotation);
                positiveSet.push(fill);

                if (negativeFillColors || negativeLineColor != undefined) {
                    if (!negativeFillAlphas) {
                        negativeFillAlphas = fillAlphas;
                    }
                    if (!negativeFillColors) {
                        negativeFillColors = negativeLineColor;
                    }

                    var negativeFill = AmCharts.polygon(container, xxx, yyy, negativeFillColors, negativeFillAlphas, 0, 0, 0, this.gradientRotation);
                    negativeSet.push(negativeFill);
                }
            }
            _this.applyMask(negativeSet, positiveSet);
        }
    },

    applyMask: function(negativeSet, positiveSet) {
        var _this = this;
        var length = negativeSet.length();
        if (_this.chartType == "serial" && !_this.scrollbar) {
            _this.positiveClip(positiveSet);
            if (length > 0) {
                _this.negativeClip(negativeSet);
            }
        }
        if (length == 0) {
            //AmCharts.remove(negativeSet);
        }
    },


    drawSmoothedGraph: function(xx, yy, sxx, syy) {
        var _this = this;
        if (xx.length > 1) {
            var set = _this.set;
            var container = _this.container;

            var positiveSet = container.set();
            var negativeSet = container.set();

            set.push(positiveSet);
            set.push(negativeSet);

            var lineAlpha = _this.lineAlpha;
            var lineThickness = _this.lineThickness;
            var dashLength = _this.dashLength;
            var fillAlphas = _this.fillAlphas;
            var lineColor = _this.lineColor;
            var fillColors = _this.fillColors;
            var negativeLineColor = _this.negativeLineColor;
            var negativeFillColors = _this.negativeFillColors;
            var negativeFillAlphas = _this.negativeFillAlphas;
            var baseCoord = _this.baseCoord;

            // draw lines			
            var line = new AmCharts.Bezier(container, xx, yy, lineColor, lineAlpha, lineThickness, fillColors, 0, dashLength);
            positiveSet.push(line.path);

            if (negativeLineColor != undefined) {
                var negativeLine = new AmCharts.Bezier(container, xx, yy, negativeLineColor, lineAlpha, lineThickness, fillColors, 0, dashLength);
                negativeSet.push(negativeLine.path);
            }

            if (fillAlphas > 0) {
                var xxx = xx.join(";").split(";");
                var yyy = yy.join(";").split(";");

                var endStr = "";
                var comma = ",";

                if (sxx.length > 0) {
                    sxx.reverse();
                    syy.reverse();

                    xxx = xx.concat(sxx);
                    yyy = yy.concat(syy);
                } else {

                    if (_this.rotate) {
                        endStr += " L" + baseCoord + comma + yy[yy.length - 1];
                        endStr += " L" + baseCoord + comma + yy[0];
                        endStr += " L" + xx[0] + comma + yy[0];
                    } else {
                        endStr += " L" + xx[xx.length - 1] + comma + baseCoord;
                        endStr += " L" + xx[0] + comma + baseCoord;
                        endStr += " L" + xx[0] + comma + yy[0];
                    }
                }
                var fill = new AmCharts.Bezier(container, xxx, yyy, NaN, 0, 0, fillColors, fillAlphas, dashLength, endStr);
                positiveSet.push(fill.path);

                if (negativeFillColors || negativeLineColor != undefined) {
                    if (!negativeFillAlphas) {
                        negativeFillAlphas = fillAlphas;
                    }
                    if (!negativeFillColors) {
                        negativeFillColors = negativeLineColor;
                    }

                    var negativeFill = new AmCharts.Bezier(container, xx, yy, NaN, 0, 0, negativeFillColors, negativeFillAlphas, dashLength, endStr);
                    negativeSet.push(negativeFill.path);
                }
            }
            _this.applyMask(negativeSet, positiveSet);
        }
    },


    launchAnimation: function() {
        var _this = this;
        var duration = _this.chart.startDuration;

        if (duration > 0 && !_this.animationPlayed) {
            var set = _this.set;
            var bulletSet = _this.bulletSet;

            if (!AmCharts.VML) {
                set.attr({
                    'opacity': _this.startAlpha
                });
                bulletSet.attr({
                    'opacity': _this.startAlpha
                });
            }

            set.hide();
            bulletSet.hide();

            if (_this.seqAn) {
                var t = setTimeout(function() {
                    _this.animateGraphs.call(_this)
                }, _this.index * duration * 1000);
                _this.timeOuts.push(t);
            } else {
                _this.animateGraphs();
            }
        }
    },

    animateGraphs: function() {
        var _this = this;
        var chart = _this.chart;
        var set = _this.set;
        var bulletSet = _this.bulletSet;
        var x = _this.x;
        var y = _this.y;

        set.show();
        bulletSet.show();

        var duration = chart.startDuration;
        var effect = chart.startEffect;

        if (set) {
            if (_this.rotate) {
                set.translate(-1000, y);
                bulletSet.translate(-1000, y);
            } else {
                set.translate(x, -1000);
                bulletSet.translate(x, -1000);
            }
            set.animate({
                opacity: 1,
                translate: x + "," + y
            }, duration, effect);
            bulletSet.animate({
                opacity: 1,
                translate: x + "," + y
            }, duration, effect);
        }
    },

    animate: function(cuboid) {
        var _this = this;
        var chart = _this.chart;
        var container = _this.container;

        var animationArray = _this.animationArray;
        if (!cuboid && animationArray.length > 0) {
            cuboid = animationArray[0];
            animationArray.shift();
        }

        var effect = container[AmCharts.getEffect(chart.startEffect)];
        var duration = chart.startDuration;

        if (cuboid) {
            if (this.rotate) {
                cuboid.animateWidth(duration, effect);
            } else {
                cuboid.animateHeight(duration, effect);
            }
            var obj = cuboid.set;
            obj.show();
        }
    },

    legendKeyColor: function() {
        var _this = this;
        var color = _this.legendColor;
        var lineAlpha = _this.lineAlpha;
        if (color == undefined) {
            color = _this.lineColor;

            if (lineAlpha == 0) {
                var colorArray = _this.fillColors;
                if (colorArray) {
                    if (typeof(colorArray) == 'object') {
                        color = colorArray[0];
                    } else {
                        color = colorArray;
                    }
                }
            }
        }
        return color;
    },

    legendKeyAlpha: function() {
        var _this = this;
        var alpha = _this.legendAlpha;
        if (alpha == undefined) {
            alpha = _this.lineAlpha;

            if (alpha == 0) {
                if (_this.fillAlphas) {
                    alpha = _this.fillAlphas;
                }
            }
            if (alpha == 0) {
                alpha = _this.bulletAlpha;
            }
            if (alpha == 0) {
                alpha = 1;
            }
        }
        return alpha;
    },


    createBullet: function(graphDataItem, bulletX, bulletY, index) {
        var _this = this;
        var container = _this.container;
        var bulletOffset = _this.bulletOffset;
        var bulletSize = _this.bulletSize;
        if (!isNaN(graphDataItem.bulletSize)) {
            bulletSize = graphDataItem.bulletSize;
        }

        if (!isNaN(_this.maxValue)) {
            var value = graphDataItem.values.value;
            if (!isNaN(value)) {
                bulletSize = value / _this.maxValue * _this.maxBulletSize;
            }
        }

        if (bulletSize < _this.minBulletSize) {
            bulletSize = _this.minBulletSize;
        }

        if (_this.rotate) {
            bulletX += bulletOffset;
        } else {
            bulletY -= bulletOffset;
        }

        // BULLETS
        var bullet;

        if (_this.bullet == "none" && !graphDataItem.bullet) {
            //void
        } else {
            var bulletColor = _this.bulletColor;
            if (graphDataItem.isNegative && _this.bulletColorNegative != undefined) {
                bulletColor = _this.bulletColorNegative;
            }

            if (graphDataItem.color != undefined) {
                bulletColor = graphDataItem.color;
            }

            var bulletType = _this.bullet;
            if (graphDataItem.bullet) {
                bulletType = graphDataItem.bullet;
            }

            var bbt = _this.bulletBorderThickness;
            var bbc = _this.bulletBorderColor;
            var bba = _this.bulletBorderAlpha;
            var bc = bulletColor;
            var ba = _this.bulletAlpha;

            var customAlpha = graphDataItem.alpha;
            if (!isNaN(customAlpha)) {
                ba = customAlpha;
            }

            switch (bulletType) {
                case "round":
                    bullet = AmCharts.circle(container, bulletSize / 2, bc, ba, bbt, bbc, bba);
                    break;
                case "square":
                    bullet = AmCharts.polygon(container, [0, bulletSize, bulletSize, 0], [0, 0, bulletSize, bulletSize], bc, ba, bbt, bbc, bba);
                    bulletX -= bulletSize / 2;
                    bulletY -= bulletSize / 2;
                    break;
                case "triangleUp":
                    bullet = AmCharts.triangle(container, bulletSize, 0, bc, ba, bbt, bbc, bba);
                    break;
                case "triangleDown":
                    bullet = AmCharts.triangle(container, bulletSize, 180, bc, ba, bbt, bbc, bba);
                    break;
                case "triangleLeft":
                    bullet = AmCharts.triangle(container, bulletSize, 270, bc, ba, bbt, bbc, bba);
                    break;
                case "triangleRight":
                    bullet = AmCharts.triangle(container, bulletSize, 90, bc, ba, bbt, bbc, bba);
                    break;
                case "bubble":
                    bullet = AmCharts.circle(container, bulletSize / 2, bc, ba, bbt, bbc, bba, true);
                    break;
            }
        }
        var dbx = 0;
        var dby = 0;
        if (_this.customBullet || graphDataItem.customBullet) {
            var customBullet = _this.customBullet;

            if (graphDataItem.customBullet) {
                customBullet = graphDataItem.customBullet;
            }

            if (customBullet) {
                if (bullet) {
                    bullet.remove();
                }

                if (typeof(customBullet) == "function") {
                    var customBulletClass = new customBullet();

                    customBulletClass.chart = _this.chart;

                    if (graphDataItem.bulletConfig) {
                        customBulletClass.availableSpace = bulletY;
                        customBulletClass.graph = _this;
                        graphDataItem.bulletConfig.minCoord = _this.minCoord - bulletY;
                        customBulletClass.bulletConfig = graphDataItem.bulletConfig;
                    }
                    customBulletClass.write(container);
                    bullet = customBulletClass.set;
                } else {
                    if (_this.chart.path) {
                        customBullet = _this.chart.path + customBullet;
                    }

                    bullet = container.image(customBullet, 0, 0, bulletSize, bulletSize);

                    if (_this.centerCustomBullets) {
                        bulletX -= bulletSize / 2;
                        bulletY -= bulletSize / 2;
                        dbx -= bulletSize / 2;
                        dby -= bulletSize / 2;
                    }
                }
            }
        }

        if (bullet) {
            if (graphDataItem.url || graphDataItem.drill) {
                bullet.setAttr("cursor", "pointer");
            }

            _this.allBullets.push(bullet);

            if (_this.chartType == "serial") {
                if (bulletX - dbx < 0 || bulletX - dbx > _this.width || bulletY < -bulletSize / 2 || bulletY - dby > _this.height) {
                    bullet.remove();
                    bullet = null;
                }
            }
            if (bullet) {
                _this.bulletSet.push(bullet);
                bullet.translate(bulletX, bulletY);
                _this.addListeners(bullet, graphDataItem);
            }
        }

        return bulletSize;
    },

    showBullets: function() {
        var _this = this;
        var allBullets = _this.allBullets;
        for (var i = 0; i < allBullets.length; i++) {
            allBullets[i].show();
        }
    },

    hideBullets: function() {
        var _this = this;
        var allBullets = _this.allBullets;
        for (var i = 0; i < allBullets.length; i++) {
            allBullets[i].hide();
        }
    },


    addListeners: function(obj, dItem) {
        var _this = this;
        obj.mouseover(function() {
            _this.handleRollOver(dItem);
        }).mouseout(function() {
            _this.handleRollOut(dItem);
        }).click(function(e) {
            _this.handleClick(dItem, e);
        }).dblclick(function(e) {
            _this.handleDoubleClick(dItem, e);
        });
    },

    handleRollOver: function(dItem) {
        var _this = this;

        if (dItem) {
            var chart = _this.chart;
            var type = 'rollOverGraphItem';
            var event = {
                type: type,
                item: dItem,
                index: dItem.index,
                graph: _this,
                target: _this,
                chart: _this.chart
            };
            _this.fire(type, event);
            chart.fire(type, event);
            clearTimeout(chart.hoverInt);

            var show = _this.showBalloon;

            if (chart.chartCursor && _this.chartType == "serial") {
                show = false;
                if (!chart.chartCursor.valueBalloonsEnabled && _this.showBalloon) {
                    show = true;
                }
            }
            if (show) {
                var text = chart.formatString(_this.balloonText, dItem, dItem.graph);
                text = AmCharts.cleanFromEmpty(text);
                var color = chart.getBalloonColor(_this, dItem);
                chart.balloon.showBullet = false;
                chart.balloon.pointerOrientation = "V";
                chart.showBalloon(text, color, true);
            }
        }
    },


    handleRollOut: function(dItem) {
        var _this = this;
        _this.chart.hideBalloon();

        if (dItem) {
            var type = 'rollOutGraphItem';
            var event = {
                type: type,
                item: dItem,
                index: dItem.index,
                graph: this,
                target: _this,
                chart: _this.chart
            };
            _this.fire(type, event);
            _this.chart.fire(type, event);
        }
    },

    handleClick: function(dItem, e) {
        var _this = this;

        if (dItem) {
            var type = 'clickGraphItem';
            var event = {
                type: type,
                evt: e,
                item: dItem,
                index: dItem.index,
                graph: _this,
                target: _this,
                chart: _this.chart
            };
            _this.fire(type, event);
            _this.chart.fire(type, event);

            AmCharts.getURL(dItem.url, _this.urlTarget);
        }
    },

    handleDoubleClick: function(dItem, e) {
        var _this = this;

        if (dItem) {
            var type = 'doubleClickGraphItem';
            var event = {
                type: type,
                evt: e,
                item: dItem,
                index: dItem.index,
                graph: _this,
                target: _this,
                chart: _this.chart
            };
            _this.fire(type, event);
            _this.chart.fire(type, event);
        }
    },

    zoom: function(start, end) {
        var _this = this;
        _this.start = start;
        _this.end = end;
        _this.draw();
    },

    changeOpacity: function(a) {
        var _this = this;
        var set = _this.set;
        var OPACITY = "opacity";
        if (set) {
            set.setAttr(OPACITY, a);
        }
        var ownColumns = _this.ownColumns;
        if (ownColumns) {
            for (var i = 0; i < ownColumns.length; i++) {
                var cset = ownColumns[i].set;
                if (cset) {
                    cset.setAttr(OPACITY, a);
                }
            }
        }
        var bulletSet = _this.bulletSet;
        if (bulletSet) {
            bulletSet.setAttr(OPACITY, a);
        }
    },

    destroy: function() {
        var _this = this;
        AmCharts.remove(_this.set);
        AmCharts.remove(_this.bulletSet);

        var timeOuts = _this.timeOuts;
        if (timeOuts) {
            for (var i = 0; i < timeOuts.length; i++) {
                clearTimeout(timeOuts[i]);
            }
        }
        _this.timeOuts = [];
    }

});;
AmCharts.ChartCursor = AmCharts.Class({

    construct: function() {
        var _this = this;
        _this.createEvents('changed', 'zoomed', 'onHideCursor', 'draw');
        _this.enabled = true;
        _this.cursorAlpha = 1;
        _this.selectionAlpha = 0.2;
        _this.cursorColor = '#CC0000';
        /**
         * 添加dashLength属性，默认值为0
         * 2013-04-19
         */
        _this.dashLength = 0;
        //======== add dashLength end ========
        _this.categoryBalloonAlpha = 1;
        _this.color = '#FFFFFF';
        _this.type = "cursor";
        _this.zoomed = false;
        _this.zoomable = true;
        _this.pan = false;
        _this.animate = true;
        _this.categoryBalloonDateFormat = "MMM DD, YYYY";
        _this.valueBalloonsEnabled = true;
        _this.categoryBalloonEnabled = true;
        _this.rolledOver = false;
        _this.cursorPosition = "middle";
        _this.skipZoomDispatch = false;
        _this.bulletsEnabled = false;
        _this.bulletSize = 8;
        _this.oneBalloonOnly = false;
        _this.selectWithoutZooming = false;
    },

    draw: function() {
        var _this = this;
        _this.destroy();
        var chart = _this.chart;
        var container = chart.container;
        _this.rotate = chart.rotate;
        _this.container = container;

        var set = container.set();
        set.translate(_this.x, _this.y);
        _this.set = set;
        chart.cursorSet.push(set);

        var categoryBalloon = new AmCharts.AmBalloon();
        categoryBalloon.chart = chart;
        _this.categoryBalloon = categoryBalloon;
        categoryBalloon.cornerRadius = 0;
        categoryBalloon.borderThickness = 0;
        categoryBalloon.borderAlpha = 0;
        categoryBalloon.showBullet = false;

        var categoryBalloonColor = _this.categoryBalloonColor;
        if (categoryBalloonColor == undefined) {
            categoryBalloonColor = _this.cursorColor;
        }
        categoryBalloon.fillColor = categoryBalloonColor;
        categoryBalloon.fillAlpha = _this.categoryBalloonAlpha;
        categoryBalloon.borderColor = categoryBalloonColor;
        categoryBalloon.color = _this.color;

        if (_this.rotate) {
            categoryBalloon.pointerOrientation = "H";
        }

        // create value balloons
        if (_this.valueBalloonsEnabled) {
            for (var i = 0; i < chart.graphs.length; i++) {
                var valueBalloon = new AmCharts.AmBalloon();
                valueBalloon.chart = chart;
                AmCharts.copyProperties(chart.balloon, valueBalloon);
                chart.graphs[i].valueBalloon = valueBalloon;
            }
        }



        if (_this.type == "cursor") {
            _this.createCursor();
        } else {
            _this.createCrosshair();
        }

        _this.interval = setInterval(function() {
            _this.detectMovement.call(_this)
        }, 40);
    },

    updateData: function() {
        var _this = this;
        var data = _this.chart.chartData;
        _this.data = data;

        if (AmCharts.ifArray(data)) {
            _this.firstTime = data[0].time;
            _this.lastTime = data[data.length - 1].time;
        }
    },

    createCursor: function() {
        var _this = this;
        var chart = _this.chart;
        var cursorAlpha = _this.cursorAlpha;
        var categoryAxis = chart.categoryAxis;
        var categoryBalloonPosition = categoryAxis.position;
        var inside = categoryAxis.inside;
        var axisThickness = categoryAxis.axisThickness;
        var categoryBalloon = _this.categoryBalloon;
        var xx;
        var yy;
        var dx = chart.dx;
        var dy = chart.dy;
        var x = _this.x;
        var y = _this.y;
        var width = _this.width;
        var height = _this.height;
        var rotate = chart.rotate;
        var tickLength = categoryAxis.tickLength;
        categoryBalloon.pointerWidth = tickLength;

        if (rotate) {
            xx = [0, width, width + dx];
            yy = [0, 0, dy];
        } else {
            xx = [dx, 0, 0];
            yy = [dy, 0, height];
        }
        /**
         * 添加dashLength属性，默认值为0
         * 2013-04-19
         */
        var line = AmCharts.line(_this.container, xx, yy, _this.cursorColor, cursorAlpha, 1, _this.dashLength);

        //======== add dashLength end ========
        _this.line = line;
        _this.set.push(line);


        // BOUNDS OF X BALLOON
        // ROTATE
        if (rotate) {
            if (inside) {
                categoryBalloon.pointerWidth = 0;
            }
            // RIGHT
            if (categoryBalloonPosition == "right") {
                // INSIDE
                if (inside) {
                    categoryBalloon.setBounds(x, y + dy, x + width + dx, y + height + dy);
                }
                // OUTSIDE
                else {
                    categoryBalloon.setBounds(x + width + dx + axisThickness, y + dy, x + width + 1000, y + height + dy);
                }
            }
            // LEFT
            else {
                // INSIDE
                if (inside) {
                    categoryBalloon.setBounds(x, y, width + x, height + y);
                }
                // OUTSIDE
                else {
                    categoryBalloon.setBounds(-1000, -1000, x - tickLength - axisThickness, y + height + 15);
                }
            }
        }
        // DO NOT ROTATE
        else {
            categoryBalloon.maxWidth = width;

            if (categoryAxis.parseDates) {
                tickLength = 0;
                categoryBalloon.pointerWidth = 0;
            }

            // TOP
            if (categoryBalloonPosition == "top") {
                // INSIDE
                if (inside) {
                    categoryBalloon.setBounds(x + dx, y + dy, width + dx + x, height + y);
                }
                // OUTSIDE
                else {
                    categoryBalloon.setBounds(x + dx, -1000, width + dx + x, y + dy - tickLength - axisThickness);
                }
            }
            // BOTTOM
            else {
                // INSIDE
                if (inside) {
                    categoryBalloon.setBounds(x, y, width + x, height + y - tickLength);
                }
                // OUTSIDE
                else {
                    categoryBalloon.setBounds(x, y + height + tickLength + axisThickness - 1, x + width, y + height + tickLength + axisThickness);
                }
            }
        }
        _this.hideCursor();
    },

    createCrosshair: function() {
        var _this = this;
        var cursorAlpha = _this.cursorAlpha;
        var container = _this.container;

        var vLine = AmCharts.line(container, [0, 0], [0, _this.height], _this.cursorColor, cursorAlpha, 1);
        var hLine = AmCharts.line(container, [0, _this.width], [0, 0], _this.cursorColor, cursorAlpha, 1);

        _this.set.push(vLine);
        _this.set.push(hLine);

        _this.vLine = vLine;
        _this.hLine = hLine;
        _this.hideCursor();
    },

    detectMovement: function() {
        var _this = this;
        var chart = _this.chart;

        if (chart.mouseIsOver) {
            var mouseX = chart.mouseX - _this.x;
            var mouseY = chart.mouseY - _this.y;

            if (mouseX > 0 && mouseX < _this.width && mouseY > 0 && mouseY < _this.height) {
                if (_this.drawing) {
                    if (!_this.rolledOver) {
                        chart.setMouseCursor("crosshair");
                    }
                } else if (_this.pan) {
                    if (!_this.rolledOver) {
                        chart.setMouseCursor("move");
                    }
                }
                _this.rolledOver = true;
                _this.setPosition();
            } else {
                if (_this.rolledOver) {
                    _this.handleMouseOut();
                    _this.rolledOver = false;
                }
            }
        } else {
            if (_this.rolledOver) {
                _this.handleMouseOut();
                _this.rolledOver = false;
            }
        }
    },

    getMousePosition: function() {
        var _this = this;
        var mousePos;
        var width = _this.width;
        var height = _this.height;
        var chart = _this.chart;

        if (_this.rotate) {
            mousePos = chart.mouseY - _this.y;
            if (mousePos < 0) {
                mousePos = 0;
            }
            if (mousePos > height) {
                mousePos = height;
            }
        } else {
            mousePos = chart.mouseX - _this.x;
            if (mousePos < 0) {
                mousePos = 0;
            }

            if (mousePos > width) {
                mousePos = width;
            }
        }
        return mousePos;
    },


    updateCrosshair: function() {
        var _this = this;
        var chart = _this.chart;
        var mouseX = chart.mouseX - _this.x;
        var mouseY = chart.mouseY - _this.y;

        var vLine = _this.vLine;
        var hLine = _this.hLine;

        mouseX = AmCharts.fitToBounds(mouseX, 0, _this.width);
        mouseY = AmCharts.fitToBounds(mouseY, 0, _this.height);

        if (_this.cursorAlpha > 0) {
            vLine.show();
            hLine.show();

            vLine.translate(mouseX, 0);
            hLine.translate(0, mouseY);
        }
        if (_this.zooming) {
            var xx = mouseX;
            var yy = mouseY;

            if (chart.hideXScrollbar) {
                xx = NaN;
            }
            if (chart.hideYScrollbar) {
                yy = NaN;
            }
            _this.updateSelectionSize(xx, yy);
        }

        if (!chart.mouseIsOver && !_this.zooming) {
            _this.hideCursor();
        }
    },

    updateSelectionSize: function(xx, yy) {
        var _this = this;
        AmCharts.remove(_this.selection);
        var selectionPosX = _this.selectionPosX;
        var selectionPosY = _this.selectionPosY;
        var x = 0;
        var y = 0;
        var width = _this.width;
        var height = _this.height;

        if (!isNaN(xx)) {
            if (selectionPosX > xx) {
                x = xx;
                width = selectionPosX - xx;
            }

            if (selectionPosX < xx) {
                x = selectionPosX;
                width = xx - selectionPosX;
            }

            if (selectionPosX == xx) {
                x = xx;
                width = 0;
            }
        }

        if (!isNaN(yy)) {
            if (selectionPosY > yy) {
                y = yy;
                height = selectionPosY - yy;
            }

            if (selectionPosY < yy) {
                y = selectionPosY;
                height = yy - selectionPosY;
            }

            if (selectionPosY == yy) {
                y = yy;
                height = 0;
            }
        }

        if (width > 0 && height > 0) {
            var selection = AmCharts.rect(_this.container, width, height, _this.cursorColor, _this.selectionAlpha);
            selection.translate(x + _this.x, y + _this.y);
            _this.selection = selection;
        }
    },

    arrangeBalloons: function() {
        var _this = this;
        var valueBalloons = _this.valueBalloons;
        var x = _this.x;
        var y = _this.y;
        var bottom = _this.height + y;

        valueBalloons.sort(_this.compareY);

        for (var i = 0; i < valueBalloons.length; i++) {
            var balloon = valueBalloons[i].balloon;
            balloon.setBounds(x, y, x + _this.width, bottom);
            balloon.draw();
            bottom = balloon.yPos - 3;
        }
        _this.arrangeBalloons2();
    },


    compareY: function(a, b) {
        if (a.yy < b.yy) {
            return 1
        } else {
            return -1;
        }
    },

    arrangeBalloons2: function() {
        var _this = this;
        var valueBalloons = _this.valueBalloons;
        valueBalloons.reverse();
        var b;
        var x = _this.x;
        var y = _this.y;
        var bPrevious;

        for (var i = 0; i < valueBalloons.length; i++) {
            var balloon = valueBalloons[i].balloon;
            b = balloon.bottom;
            var balloonHeight = balloon.bottom - balloon.yPos;

            if (i > 0) {
                if (b - balloonHeight < bPrevious + 3) {
                    balloon.setBounds(x, bPrevious + 3, x + _this.width, bPrevious + balloonHeight + 3);
                    balloon.draw();
                }
            }
            if (balloon.set) {
                balloon.set.show();
            }
            bPrevious = balloon.bottom;
        }
    },

    showBullets: function() {
        var _this = this;

        AmCharts.remove(_this.allBullets);
        var container = _this.container;

        var allBullets = container.set();
        _this.set.push(allBullets);
        _this.set.show();
        _this.allBullets = allBullets;

        var graphs = _this.chart.graphs;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];


            if (!graph.hidden && graph.balloonText) {
                var serialDataItem = _this.data[_this.index];
                var graphDataItem = serialDataItem.axes[graph.valueAxis.id].graphs[graph.id];
                var yy = graphDataItem.y;

                if (!isNaN(yy)) {
                    var xxx;
                    var bxx;
                    var byy;

                    xxx = graphDataItem.x;

                    if (_this.rotate) {
                        bxx = yy;
                        byy = xxx;
                    } else {
                        bxx = xxx;
                        byy = yy;
                    }
                    /**
                     * 为bullet添加可配置的bullet color值
                     * 2013-04-09
                     */
                    var bulletColor = _this.chart.getBalloonColor(graph, graphDataItem);
                    if (_this.bulletColor) {
                        bulletColor = _this.bulletColor;
                    }
                    var bullet = AmCharts.circle(container, _this.bulletSize / 2, bulletColor, graph.cursorBulletAlpha);
                    bullet.translate(bxx, byy);
                    _this.allBullets.push(bullet);
                }
            }
        }
    },


    destroy: function() {
        var _this = this;
        _this.clear();

        AmCharts.remove(_this.selection);
        _this.selection = null;

        var categoryBalloon = _this.categoryBalloon;
        if (categoryBalloon) {
            categoryBalloon.destroy();
        }
        _this.destroyValueBalloons();

        AmCharts.remove(_this.set);
    },

    clear: function() {
        var _this = this;
        clearInterval(_this.interval);
    },

    destroyValueBalloons: function() {

        var _this = this;
        var valueBalloons = _this.valueBalloons;

        if (valueBalloons) {
            for (var i = 0; i < valueBalloons.length; i++) {
                valueBalloons[i].balloon.hide();
            }
        }
    },

    /**
     * @private
     */
    zoom: function(start, end, startTime, endTime) {
        var _this = this;
        var chart = _this.chart;
        _this.destroyValueBalloons();
        _this.zooming = false;
        var currentMouse;

        if (_this.rotate) {
            currentMouse = chart.mouseY;
            _this.selectionPosY = currentMouse;
        } else {
            currentMouse = chart.mouseX;
            _this.selectionPosX = currentMouse;
        }

        _this.start = start;
        _this.end = end;
        _this.startTime = startTime;
        _this.endTime = endTime;
        _this.zoomed = true;

        var categoryAxis = chart.categoryAxis;
        var rotate = _this.rotate;
        var width = _this.width;
        var height = _this.height;
        var stepWidth;

        if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
            var difference = endTime - startTime + categoryAxis.minDuration();
            if (rotate) {
                stepWidth = height / difference;
            } else {
                stepWidth = width / difference;
            }
        } else {
            if (rotate) {
                stepWidth = height / (end - start);
            } else {
                stepWidth = width / (end - start);
            }
        }
        _this.stepWidth = stepWidth;
        _this.setPosition();
        _this.hideCursor();
    },

    hideObj: function(obj) {
        if (obj) {
            obj.hide();
        }
    },


    hideCursor: function(dispatch) {
        if (dispatch == undefined) {
            dispatch = true;
        }

        var _this = this;
        _this.hideObj(_this.set);
        _this.hideObj(_this.categoryBalloon);
        _this.hideObj(_this.line);
        _this.hideObj(_this.vLine);
        _this.hideObj(_this.hLine);
        _this.hideObj(_this.allBullets);
        _this.destroyValueBalloons();

        if (!_this.selectWithoutZooming) {
            AmCharts.remove(_this.selection);
        }


        _this.previousIndex = NaN;

        if (dispatch) {
            var type = 'onHideCursor';
            _this.fire(type, {
                type: type,
                chart: _this.chart,
                target: _this
            });
        }
        if (!_this.drawing) {
            _this.chart.setMouseCursor('auto');
        }
    },

    setPosition: function(position, dispatch) {
        var _this = this;
        if (dispatch == undefined) {
            dispatch = true;
        }

        if (_this.type == "cursor") {
            if (AmCharts.ifArray(_this.data)) {
                if (isNaN(position)) {
                    position = _this.getMousePosition();
                }

                if (position != _this.previousMousePosition || _this.zoomed == true || _this.oneBalloonOnly) {
                    if (!isNaN(position)) {
                        var index = _this.chart.categoryAxis.xToIndex(position);

                        if (index != _this.previousIndex || _this.zoomed || _this.cursorPosition == "mouse" || _this.oneBalloonOnly) {
                            _this.updateCursor(index, dispatch);
                            _this.zoomed = false;
                        }
                    }
                }

                _this.previousMousePosition = position;
            }
        } else {
            _this.updateCrosshair();
        }
    },


    updateCursor: function(index, dispatch) {
        var _this = this;
        var chart = _this.chart;

        var mouseX = chart.mouseX - _this.x;
        var mouseY = chart.mouseY - _this.y;

        if (_this.drawingNow) {
            AmCharts.remove(_this.drawingLine);
            _this.drawingLine = AmCharts.line(_this.container, [_this.x + _this.drawStartX, _this.x + mouseX], [_this.y + _this.drawStartY, _this.y + mouseY], _this.cursorColor, 1, 1);
        }

        if (_this.enabled) {
            if (dispatch == undefined) {
                dispatch = true;
            }
            _this.index = index;

            var categoryAxis = chart.categoryAxis;
            var dx = chart.dx;
            var dy = chart.dy;
            var x = _this.x;
            var y = _this.y;
            var width = _this.width;
            var height = _this.height;

            var serialDataItem = _this.data[index];
            var xx = serialDataItem.x[categoryAxis.id];
            var rotate = chart.rotate;
            var inside = categoryAxis.inside;
            var stepWidth = _this.stepWidth;
            var categoryBalloon = _this.categoryBalloon;
            var firstTime = _this.firstTime;
            var lastTime = _this.lastTime;
            var cursorPosition = _this.cursorPosition;
            var categoryBalloonPosition = categoryAxis.position;
            var zooming = _this.zooming;
            var panning = _this.panning;
            var graphs = chart.graphs;
            var axisThickness = categoryAxis.axisThickness;

            if (chart.mouseIsOver || zooming || panning || this.forceShow) {
                this.forceShow = false;
                // PANNING
                if (panning) {
                    var difference;
                    var panClickPos = _this.panClickPos;
                    var panClickEndTime = _this.panClickEndTime;
                    var panClickStartTime = _this.panClickStartTime;
                    var panClickEnd = _this.panClickEnd;
                    var panClickStart = _this.panClickStart;

                    if (rotate) {
                        difference = panClickPos - mouseY;
                    } else {
                        difference = panClickPos - mouseX;
                    }

                    var shiftCount = difference / stepWidth;

                    if (!categoryAxis.parseDates || categoryAxis.equalSpacing) {
                        shiftCount = Math.round(shiftCount)
                    }

                    if (shiftCount != 0) {
                        var cursorEvent = {};
                        cursorEvent.type = "zoomed";
                        cursorEvent.target = _this;
                        cursorEvent.chart = _this.chart;

                        if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                            if (panClickEndTime + shiftCount > lastTime) {
                                shiftCount = lastTime - panClickEndTime;
                            }

                            if (panClickStartTime + shiftCount < firstTime) {
                                shiftCount = firstTime - panClickStartTime;
                            }

                            cursorEvent.start = panClickStartTime + shiftCount;
                            cursorEvent.end = panClickEndTime + shiftCount;
                            _this.fire(cursorEvent.type, cursorEvent);
                        } else {
                            if (panClickEnd + shiftCount >= _this.data.length || panClickStart + shiftCount < 0) {
                                // void
                            } else {
                                cursorEvent.start = panClickStart + shiftCount;
                                cursorEvent.end = panClickEnd + shiftCount;
                                _this.fire(cursorEvent.type, cursorEvent);
                            }
                        }
                    }
                }
                // SHOWING INDICATOR
                else {
                    if (cursorPosition == "start") {
                        xx -= categoryAxis.cellWidth / 2;
                    }

                    if (cursorPosition == "mouse" && chart.mouseIsOver) {
                        if (rotate) {
                            xx = mouseY - 2;
                        } else {
                            xx = mouseX - 2;
                        }
                    }

                    if (rotate) {
                        if (xx < 0) {
                            if (zooming) {
                                xx = 0;
                            } else {
                                _this.hideCursor();
                                return;
                            }
                        }

                        if (xx > height + 1) {
                            if (zooming) {
                                xx = height + 1;
                            } else {
                                _this.hideCursor();
                                return;
                            }
                        }
                    } else {
                        if (xx < 0) {
                            if (zooming) {
                                xx = 0;
                            } else {
                                _this.hideCursor();
                                return;
                            }
                        }

                        if (xx > width) {
                            if (zooming) {
                                xx = width;
                            } else {
                                _this.hideCursor();
                                return;
                            }
                        }
                    }
                    if (_this.cursorAlpha > 0) {
                        var line = _this.line;
                        if (rotate) {
                            line.translate(0, xx + dy);
                        } else {
                            line.translate(xx, 0);
                        }

                        line.show();
                    }

                    if (rotate) {
                        _this.linePos = xx + dy;
                    } else {
                        _this.linePos = xx;
                    }

                    // ZOOMING
                    if (zooming) {
                        if (rotate) {
                            _this.updateSelectionSize(NaN, xx);
                        } else {
                            _this.updateSelectionSize(xx, NaN);
                        }
                    }

                    var showBalloons = true;
                    if (zooming) {
                        showBalloons = false;
                    }

                    if (_this.categoryBalloonEnabled && showBalloons) {
                        // POINT BALLOON
                        // ROTATE
                        if (rotate) {
                            // INSIDE requires adjusting bounds every time
                            if (inside) {
                                // RIGHT
                                if (categoryBalloonPosition == "right") {
                                    categoryBalloon.setBounds(x, y + dy, x + width + dx, y + xx + dy);
                                }
                                // LEFT
                                else {
                                    categoryBalloon.setBounds(x, y + dy, x + width + dx, y + xx);
                                }
                            }

                            // RIGHT
                            if (categoryBalloonPosition == "right") {
                                if (inside) {
                                    categoryBalloon.setPosition(x + width + dx, y + xx + dy);
                                } else {
                                    categoryBalloon.setPosition(x + width + dx + axisThickness, y + xx + dy);
                                }
                            }
                            // LEFT
                            else {
                                if (inside) {
                                    categoryBalloon.setPosition(x, y + xx);
                                } else {
                                    categoryBalloon.setPosition(x - axisThickness, y + xx);
                                }
                            }
                        }
                        // DO NOT ROTATE
                        else {
                            // TOP
                            if (categoryBalloonPosition == "top") {
                                if (inside) {
                                    categoryBalloon.setPosition(x + xx + dx, y + dy);
                                } else {
                                    categoryBalloon.setPosition(x + xx + dx, y + dy - axisThickness + 1);
                                }
                            }
                            // BOTTOM
                            else {
                                if (inside) {
                                    categoryBalloon.setPosition(x + xx, y + height);
                                } else {
                                    categoryBalloon.setPosition(x + xx, y + height + axisThickness - 1);
                                }
                            }
                        }
                        if (categoryAxis.parseDates) {
                            var fDate = AmCharts.formatDate(serialDataItem.category, _this.categoryBalloonDateFormat);

                            if (fDate.indexOf("fff") != -1) {
                                fDate = AmCharts.formatMilliseconds(fDate, serialDataItem.category);
                            }

                            categoryBalloon.showBalloon(fDate);
                        } else {
                            categoryBalloon.showBalloon(serialDataItem.category);
                        }
                    } else {
                        categoryBalloon.hide();
                    }

                    // BULLETS
                    if (graphs && _this.bulletsEnabled) {
                        _this.showBullets();
                    }

                    // VALUE BALLOONS
                    _this.destroyValueBalloons();

                    if (graphs && _this.valueBalloonsEnabled && showBalloons && chart.balloon.enabled) {
                        var valueBalloons = [];
                        _this.valueBalloons = valueBalloons;

                        // find most close point if only one balloon at a time can be shown
                        if (_this.oneBalloonOnly) {
                            var mostClosePos = Infinity;
                            var mostCloseGraph;
                            for (var i = 0; i < graphs.length; i++) {
                                var graph = graphs[i];

                                if (graph.showBalloon && !graph.hidden && graph.balloonText) {
                                    var graphDataItem = serialDataItem.axes[graph.valueAxis.id].graphs[graph.id];
                                    var yy = graphDataItem.y;

                                    if (!isNaN(yy)) {
                                        if (rotate) {
                                            if (Math.abs(mouseX - yy) < mostClosePos) {
                                                mostClosePos = Math.abs(mouseX - yy);
                                                mostCloseGraph = graph;
                                            }
                                        } else {
                                            if (Math.abs(mouseY - yy) < mostClosePos) {
                                                mostClosePos = Math.abs(mouseY - yy);
                                                mostCloseGraph = graph;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // display balloons
                        for (var i = 0; i < graphs.length; i++) {
                            var graph = graphs[i];

                            if (_this.oneBalloonOnly && graph != mostCloseGraph) {
                                // void
                            } else {
                                if (graph.showBalloon && !graph.hidden && graph.balloonText) {
                                    var graphDataItem = serialDataItem.axes[graph.valueAxis.id].graphs[graph.id];
                                    var yy = graphDataItem.y;

                                    if (!isNaN(yy)) {
                                        var xxx;
                                        var bxx;
                                        var byy;

                                        xxx = graphDataItem.x;

                                        var create = true;

                                        if (rotate) {
                                            bxx = yy;
                                            byy = xxx;

                                            if (byy < 0 || byy > height) {
                                                create = false;
                                            }
                                        } else {
                                            bxx = xxx;
                                            byy = yy;

                                            if (bxx < 0 || bxx > width + dx) {
                                                create = false;
                                            }
                                        }

                                        if (create) {
                                            var valueBalloon = graph.valueBalloon;
                                            var balloonColor = chart.getBalloonColor(graph, graphDataItem);
                                            valueBalloon.setBounds(x, y, x + width, y + height);
                                            valueBalloon.pointerOrientation = "H";
                                            valueBalloon.changeColor(balloonColor);
                                            if (graph.balloonAlpha != undefined) {
                                                valueBalloon.fillAlpha = graph.balloonAlpha;
                                            }
                                            if (graph.balloonTextColor != undefined) {
                                                valueBalloon.color = graph.balloonTextColor;
                                            }

                                            valueBalloon.setPosition(bxx + x, byy + y);

                                            var balloonText = chart.formatString(graph.balloonText, graphDataItem, graph);

                                            if (balloonText != "") {
                                                valueBalloon.showBalloon(balloonText);
                                            }
                                            if (!rotate && valueBalloon.set) {
                                                valueBalloon.set.hide();
                                            }

                                            valueBalloons.push({
                                                yy: yy,
                                                balloon: valueBalloon
                                            });
                                        }
                                    }
                                }
                            }
                        }

                        if (!rotate) {
                            _this.arrangeBalloons();
                        }

                    }

                    if (dispatch) {
                        var name = "changed"
                        var cursorEvent = {
                            type: name
                        };
                        cursorEvent.index = index;
                        cursorEvent.target = _this;
                        cursorEvent.chart = _this.chart;
                        cursorEvent.zooming = zooming;

                        if (rotate) {
                            cursorEvent.position = mouseY;
                        } else {
                            cursorEvent.position = mouseX;
                        }
                        cursorEvent.target = _this;
                        chart.fire(name, cursorEvent);
                        _this.fire(name, cursorEvent);
                        _this.skipZoomDispatch = false;
                    } else {
                        _this.skipZoomDispatch = true;
                        chart.updateLegendValues(index);
                    }

                    _this.previousIndex = index;
                }
            }
        } else {
            _this.hideCursor();
        }
    },

    enableDrawing: function(value) {
        var _this = this;
        _this.enabled = !value;
        _this.hideCursor();
        _this.rolledOver = false;
        _this.drawing = value;
    },

    isZooming: function(value) {
        var _this = this;
        if (value && value != _this.zooming) {
            _this.handleMouseDown('fake');
        }

        if (!value && value != _this.zooming) {
            _this.handleMouseUp();
        }
    },

    handleMouseOut: function() {
        var _this = this;
        if (_this.enabled) {
            if (_this.zooming) {
                _this.setPosition();
            } else {
                _this.index = undefined;
                var cursorEvent = {};
                var name = "changed";
                cursorEvent.type = name;
                cursorEvent.index = undefined;
                cursorEvent.target = _this;
                cursorEvent.chart = _this.chart;
                _this.fire(name, cursorEvent);
                _this.hideCursor();
            }
        }
    },

    handleReleaseOutside: function() {
        this.handleMouseUp();
    },

    handleMouseUp: function() {
        var _this = this;
        var chart = _this.chart;
        if (chart) {
            var mouseX = chart.mouseX - _this.x;
            var mouseY = chart.mouseY - _this.y;

            if (_this.drawingNow) {
                _this.drawingNow = false;
                AmCharts.remove(_this.drawingLine);
                var drawStartX = _this.drawStartX;
                var drawStartY = _this.drawStartY;

                if (Math.abs(drawStartX - mouseX) > 2 || Math.abs(drawStartY - mouseY) > 2) {
                    var drawEvent = {
                        type: "draw",
                        target: _this,
                        chart: chart,
                        initialX: drawStartX,
                        initialY: drawStartY,
                        finalX: mouseX,
                        finalY: mouseY
                    }
                    _this.fire(drawEvent.type, drawEvent);
                }
            }

            if (_this.enabled && _this.data.length > 0) {
                if (_this.pan) {
                    _this.rolledOver = false;
                } else {
                    if (_this.zoomable && !_this.selectWithoutZooming) {
                        if (_this.zooming) {
                            var cursorEvent = {
                                type: "zoomed"
                            };
                            cursorEvent.target = _this;
                            cursorEvent.chart = _this.chart;

                            if (_this.type == "cursor") {
                                var currentMouse;
                                if (_this.rotate) {
                                    currentMouse = mouseY;
                                    _this.selectionPosY = currentMouse;
                                } else {
                                    currentMouse = mouseX;
                                    _this.selectionPosX = currentMouse;
                                }

                                if (Math.abs(currentMouse - _this.initialMouse) < 2 && _this.fromIndex == _this.index) {
                                    // void    							
                                } else {

                                    if (_this.index < _this.fromIndex) {
                                        cursorEvent.end = _this.fromIndex;
                                        cursorEvent.start = _this.index;
                                    } else {
                                        cursorEvent.end = _this.index;
                                        cursorEvent.start = _this.fromIndex;
                                    }
                                    var categoryAxis = _this.chart.categoryAxis;
                                    if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                                        cursorEvent.start = _this.data[cursorEvent.start].time;
                                        cursorEvent.end = _this.data[cursorEvent.end].time;
                                    }
                                    if (!_this.skipZoomDispatch) {
                                        _this.fire(cursorEvent.type, cursorEvent);
                                    }
                                }
                            } else {
                                var initialMouseX = _this.initialMouseX;
                                var initialMouseY = _this.initialMouseY;

                                if (Math.abs(mouseX - initialMouseX) < 3 && Math.abs(mouseY - initialMouseY) < 3) {
                                    // void
                                } else {
                                    var x0 = Math.min(initialMouseX, mouseX);
                                    var y0 = Math.min(initialMouseY, mouseY);

                                    var width = Math.abs(initialMouseX - mouseX);
                                    var height = Math.abs(initialMouseY - mouseY);

                                    if (chart.hideXScrollbar) {
                                        x0 = 0;
                                        width = _this.width;
                                    }

                                    if (chart.hideYScrollbar) {
                                        y0 = 0;
                                        height = _this.height;
                                    }

                                    cursorEvent.selectionHeight = height;
                                    cursorEvent.selectionWidth = width;
                                    cursorEvent.selectionY = y0;
                                    cursorEvent.selectionX = x0;

                                    if (!_this.skipZoomDispatch) {
                                        _this.fire(cursorEvent.type, cursorEvent);
                                    }
                                }
                            }
                            AmCharts.remove(_this.selection);
                        }
                    }
                }

                _this.skipZoomDispatch = false;
                _this.zooming = false;
                _this.panning = false;
            }
        }
    },

    showCursorAt: function(category) {
        var _this = this;
        var chart = _this.chart;
        var categoryAxis = chart.categoryAxis;
        var coordinate;
        if (categoryAxis.parseDates) {
            coordinate = categoryAxis.dateToCoordinate(category);
        } else {
            coordinate = categoryAxis.categoryToCoordinate(category);
        }

        _this.previousMousePosition = NaN;
        _this.forceShow = true;
        _this.setPosition(coordinate, false);
    },


    handleMouseDown: function(event) {
        var _this = this;
        if (_this.zoomable || _this.pan || _this.drawing) {
            var rotate = _this.rotate;
            var chart = _this.chart;
            var mouseX = chart.mouseX - _this.x;
            var mouseY = chart.mouseY - _this.y;

            if ((mouseX > 0 && mouseX < _this.width && mouseY > 0 && mouseY < _this.height) || event == "fake") {
                _this.setPosition();

                if (_this.selectWithoutZooming) {
                    AmCharts.remove(_this.selection);
                }

                if (_this.drawing) {
                    _this.drawStartY = mouseY;
                    _this.drawStartX = mouseX;
                    _this.drawingNow = true;
                } else if (_this.pan) {
                    _this.zoomable = false;
                    chart.setMouseCursor("move");
                    _this.panning = true;
                    //_this.hideCursor(true);

                    if (rotate) {
                        _this.panClickPos = mouseY;
                    } else {
                        _this.panClickPos = mouseX;
                    }

                    _this.panClickStart = _this.start;
                    _this.panClickEnd = _this.end;
                    _this.panClickStartTime = _this.startTime;
                    _this.panClickEndTime = _this.endTime;
                } else if (_this.zoomable) {
                    if (_this.type == "cursor") {

                        _this.fromIndex = _this.index;

                        if (rotate) {
                            _this.initialMouse = mouseY;
                            _this.selectionPosY = _this.linePos;
                        } else {
                            _this.initialMouse = mouseX;
                            _this.selectionPosX = _this.linePos;
                        }
                    } else {
                        _this.initialMouseX = mouseX;
                        _this.initialMouseY = mouseY;

                        _this.selectionPosX = mouseX;
                        _this.selectionPosY = mouseY;
                    }
                    _this.zooming = true;
                }
            }
        }
    }
});;
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function() {
        var _this = this;
        _this.createEvents('zoomed');
        _this.backgroundColor = "#D4D4D4";
        _this.backgroundAlpha = 1;
        _this.selectedBackgroundColor = "#EFEFEF";
        _this.selectedBackgroundAlpha = 1;
        _this.scrollDuration = 1;
        _this.resizeEnabled = true;
        _this.hideResizeGrips = false;
        _this.scrollbarHeight = 20;

        _this.updateOnReleaseOnly = false;
        if (document.documentMode < 9) {
            _this.updateOnReleaseOnly = true;
        }
        _this.dragIconWidth = 11;
        _this.dragIconHeight = 18;
    },

    draw: function() {
        var _this = this;
        _this.destroy();
        _this.interval = setInterval(function() {
            _this.updateScrollbar.call(_this)
        }, 40);

        var container = _this.chart.container;
        var rotate = _this.rotate;
        var chart = _this.chart;
        var set = container.set();
        _this.set = set;
        chart.scrollbarsSet.push(set);

        var width;
        var height;

        if (rotate) {
            width = _this.scrollbarHeight;
            height = chart.plotAreaHeight;
        } else {
            height = _this.scrollbarHeight;
            width = chart.plotAreaWidth;
        }

        _this.width = width;
        _this.height = height;

        if (height && width) {
            //			var bg = AmCharts.rect(container, width, height, _this.backgroundColor, _this.backgroundAlpha);
            var bg = AmCharts.rect(container, width, height, "#82939D", 1, 1, "#5B666C");
            _this.bg = bg;
            set.push(bg);

            var invisibleBg = AmCharts.rect(container, width, height, "#000", 0.005);
            set.push(invisibleBg);
            _this.invisibleBg = invisibleBg;

            invisibleBg.click(function() {
                _this.handleBgClick();
            }).mouseover(function() {
                _this.handleMouseOver();
            }).mouseout(function() {
                _this.handleMouseOut();
            }).touchend(function() {
                _this.handleBgClick();
            });

            //			var selectedBG = AmCharts.rect(container, width, height, _this.selectedBackgroundColor, _this.selectedBackgroundAlpha);
            var selectedBG = AmCharts.rect(container, width, height, "#E6E7EC", 1, 1, "#BFC0C4");
            _this.selectedBG = selectedBG;
            set.push(selectedBG);

            var dragger = AmCharts.rect(container, width, height, "#000", 0.005);
            _this.dragger = dragger;
            set.push(dragger);

            dragger.mousedown(function(event) {
                _this.handleDragStart(event);
            }).mouseup(function() {
                _this.handleDragStop();
            }).mouseover(function() {
                _this.handleDraggerOver();
            }).mouseout(function() {
                _this.handleMouseOut();
            }).touchstart(function(event) {
                _this.handleDragStart(event);
            }).touchend(function() {
                _this.handleDragStop();
            });

            // drag icons
            var dragIconWidth;
            var dragIconHeight;
            var pathToImages = chart.pathToImages;

            var fileName;
            if (rotate) {
                fileName = pathToImages + "dragIconH.gif"
                dragIconHeight = _this.dragIconWidth;
                dragIconWidth = _this.dragIconHeight;
            } else {
                fileName = pathToImages + "dragIcon.gif"
                dragIconWidth = _this.dragIconWidth;
                dragIconHeight = _this.dragIconHeight;
            }

            var imgLeft = container.image(fileName, 0, 0, dragIconWidth, dragIconHeight);
            var imgRight = container.image(fileName, 0, 0, dragIconWidth, dragIconHeight);

            var iw = 10;
            var ih = 20;
            if (chart.panEventsEnabled) {
                iw = 25
                ih = _this.scrollbarHeight;
            }

            var rectRight = AmCharts.rect(container, iw, ih, "#000", 0.005);
            var rectLeft = AmCharts.rect(container, iw, ih, "#000", 0.005);
            rectLeft.translate(-(iw - dragIconWidth) / 2, -(ih - dragIconHeight) / 2);
            rectRight.translate(-(iw - dragIconWidth) / 2, -(ih - dragIconHeight) / 2);

            var iconLeft = container.set([imgLeft, rectLeft]);
            var iconRight = container.set([imgRight, rectRight]);

            _this.iconLeft = iconLeft;
            set.push(_this.iconLeft);

            _this.iconRight = iconRight;
            set.push(iconRight);

            iconLeft.mousedown(function() {
                _this.leftDragStart();
            }).mouseup(function() {
                _this.leftDragStop();
            }).mouseover(function() {
                _this.iconRollOver();
            }).mouseout(function() {
                _this.iconRollOut();
            }).touchstart(function(event) {
                _this.leftDragStart();
            }).touchend(function() {
                _this.leftDragStop();
            });

            iconRight.mousedown(function() {
                _this.rightDragStart();
            }).mouseup(function() {
                _this.rightDragStop();
            }).mouseover(function() {
                _this.iconRollOver();
            }).mouseout(function() {
                _this.iconRollOut();
            }).touchstart(function(event) {
                _this.rightDragStart();
            }).touchend(function() {
                _this.rightDragStop();
            });

            if (AmCharts.ifArray(chart.chartData)) {
                set.show();
            } else {
                set.hide();
            }

            _this.hideDragIcons();
        }
        set.translate(_this.x, _this.y);
        _this.clipDragger(false);
    },


    updateScrollbarSize: function(pos0, pos1) {
        var _this = this;
        var dragger = _this.dragger;
        var clipX;
        var clipY;
        var clipW;
        var clipH;
        var draggerSize;

        if (_this.rotate) {
            clipX = 0;
            clipY = pos0;
            clipW = _this.width + 1;
            clipH = pos1 - pos0;
            draggerSize = pos1 - pos0;
            dragger.setAttr('height', draggerSize);
            dragger.setAttr('y', clipY);
        } else {
            clipX = pos0;
            clipY = 0;
            clipW = pos1 - pos0;
            clipH = _this.height + 1;
            draggerSize = pos1 - pos0;
            dragger.setAttr('width', draggerSize);
            dragger.setAttr('x', clipX);
        }
        _this.clipAndUpdate(clipX, clipY, clipW, clipH);
    },

    updateScrollbar: function() {
        var _this = this;
        var dragerWidth;
        var switchHands = false;
        var prevPos;
        var mousePos;
        var x = _this.x;
        var y = _this.y;
        var dragger = _this.dragger;
        var bbox = _this.getDBox();
        var bboxX = bbox.x + x;
        var bboxY = bbox.y + y;
        var bboxWidth = bbox.width;
        var bboxHeight = bbox.height;
        var rotate = _this.rotate;
        var chart = _this.chart;
        var width = _this.width;
        var height = _this.height;
        var mouseX = chart.mouseX;
        var mouseY = chart.mouseY;

        var initialMouse = _this.initialMouse;

        if (chart.mouseIsOver) {
            if (_this.dragging) {
                var initialCoord = _this.initialCoord;
                if (rotate) {
                    var newY = initialCoord + (mouseY - initialMouse);
                    if (newY < 0) {
                        newY = 0;
                    }
                    var bottomB = height - bboxHeight;

                    if (newY > bottomB) {
                        newY = bottomB;
                    }

                    dragger.setAttr("y", newY);
                } else {
                    var newX = initialCoord + (mouseX - initialMouse);
                    if (newX < 0) {
                        newX = 0;
                    }
                    var rightB = width - bboxWidth;

                    if (newX > rightB) {
                        newX = rightB;
                    }

                    dragger.setAttr("x", newX);
                }
            }



            if (_this.resizingRight) {
                if (rotate) {
                    dragerWidth = mouseY - bboxY;

                    if (dragerWidth + bboxY > height + y) {
                        dragerWidth = height - bboxY + y;
                    }

                    if (dragerWidth < 0) {
                        _this.resizingRight = false;
                        _this.resizingLeft = true;
                        switchHands = true;
                    } else {
                        if (dragerWidth == 0) {
                            dragerWidth = 0.1
                        }
                        dragger.setAttr('height', dragerWidth);
                    }
                } else {
                    dragerWidth = mouseX - bboxX;

                    if (dragerWidth + bboxX > width + x) {
                        dragerWidth = width - bboxX + x;
                    }

                    if (dragerWidth < 0) {
                        _this.resizingRight = false;
                        _this.resizingLeft = true;
                        switchHands = true;
                    } else {
                        if (dragerWidth == 0) {
                            dragerWidth = 0.1
                        }
                        dragger.setAttr('width', dragerWidth);
                    }
                }
            }

            if (_this.resizingLeft) {
                if (rotate) {
                    prevPos = bboxY;
                    mousePos = mouseY;

                    // if mouse is out to left
                    if (mousePos < y) {
                        mousePos = y;
                    }
                    //if mouse is out to right
                    if (mousePos > height + y) {
                        mousePos = height + y;
                    }
                    if (switchHands == true) {
                        dragerWidth = prevPos - mousePos;
                    } else {
                        dragerWidth = bboxHeight + prevPos - mousePos;
                    }

                    if (dragerWidth < 0) {
                        _this.resizingRight = true;
                        _this.resizingLeft = false;
                        dragger.setAttr('y', prevPos + bboxHeight - y);
                    } else {
                        if (dragerWidth == 0) {
                            dragerWidth = 0.1
                        }
                        dragger.setAttr('y', mousePos - y);
                        dragger.setAttr('height', dragerWidth);
                    }
                } else {
                    prevPos = bboxX;
                    mousePos = mouseX;

                    // if mouse is out to left
                    if (mousePos < x) {
                        mousePos = x;
                    }

                    //if mouse is out to right
                    if (mousePos > width + x) {
                        mousePos = width + x;
                    }

                    if (switchHands == true) {
                        dragerWidth = prevPos - mousePos;
                    } else {
                        dragerWidth = bboxWidth + prevPos - mousePos;
                    }

                    if (dragerWidth < 0) {
                        _this.resizingRight = true;
                        _this.resizingLeft = false;
                        dragger.setAttr('x', prevPos + bboxWidth - x);
                    } else {
                        if (dragerWidth == 0) {
                            dragerWidth = 0.1
                        }
                        dragger.setAttr('x', mousePos - x);
                        dragger.setAttr('width', dragerWidth);
                    }
                }
            }
            _this.clipDragger(true);
        }
    },

    clipDragger: function(dispatch) {
        var _this = this;
        var dragger = _this.dragger;
        var bbox = _this.getDBox();
        var bboxX = bbox.x;
        var bboxY = bbox.y;
        var bboxWidth = bbox.width;
        var bboxHeight = bbox.height;

        var update = false;

        if (_this.rotate) {
            bboxX = 0;
            bboxWidth = _this.width + 1;
            if (_this.clipY != bboxY || _this.clipH != bboxHeight) {
                update = true;
            }
        } else {
            bboxY = 0;
            bboxHeight = _this.height + 1;
            if (_this.clipX != bboxX || _this.clipW != bboxWidth) {
                update = true;
            }
        }

        if (update) {
            _this.clipAndUpdate(bboxX, bboxY, bboxWidth, bboxHeight);

            if (dispatch) {
                if (!_this.updateOnReleaseOnly) {
                    _this.dispatchScrollbarEvent();
                }
            }
        }
    },


    maskGraphs: function() {
        //void
    },

    clipAndUpdate: function(x, y, w, h) {
        var _this = this;
        _this.clipX = x;
        _this.clipY = y;
        _this.clipW = w;
        _this.clipH = h;

        _this.selectedBG.clipRect(x, y, w, h);
        _this.updateDragIconPositions();
        _this.maskGraphs(x, y, w, h);
    },

    dispatchScrollbarEvent: function() {
        var _this = this;
        if (_this.skipEvent) {
            _this.skipEvent = false;
        } else {
            var chart = _this.chart;
            chart.hideBalloon();
            var dBBox = _this.getDBox();
            var xx = dBBox.x;
            var yy = dBBox.y;
            var ww = dBBox.width;
            var hh = dBBox.height;
            var draggerPos;
            var draggerSize;
            var multiplier;

            if (_this.rotate) {
                draggerPos = yy;
                draggerSize = hh;
                multiplier = _this.height / hh;
            } else {
                draggerPos = xx;
                draggerSize = ww;
                multiplier = _this.width / ww;
            }

            var event = {
                type: "zoomed",
                position: draggerPos,
                chart: chart,
                target: _this,
                multiplier: multiplier
            };
            _this.fire(event.type, event);
        }
    },

    updateDragIconPositions: function() {
        var _this = this;
        var bbox = _this.getDBox();
        var xx = bbox.x;
        var yy = bbox.y;
        var iconLeft = _this.iconLeft;
        var iconRight = _this.iconRight;
        var dragIconHeight;
        var dragIconWidth;
        var height = _this.scrollbarHeight;

        if (_this.rotate) {
            dragIconHeight = _this.dragIconWidth;
            dragIconWidth = _this.dragIconHeight;
            iconLeft.translate((height - dragIconWidth) / 2, yy - (dragIconHeight) / 2);
            iconRight.translate((height - dragIconWidth) / 2, yy + bbox.height - (dragIconHeight) / 2);
        } else {
            dragIconHeight = _this.dragIconHeight;
            dragIconWidth = _this.dragIconWidth;
            iconLeft.translate(xx - dragIconWidth / 2, (height - dragIconHeight) / 2);
            iconRight.translate(xx + -dragIconWidth / 2 + bbox.width, (height - dragIconHeight) / 2);
        }
    },

    showDragIcons: function() {
        var _this = this;
        if (_this.resizeEnabled) {
            _this.iconLeft.show();
            _this.iconRight.show();
        }
    },

    hideDragIcons: function() {
        var _this = this;
        if (!_this.resizingLeft && !_this.resizingRight && !_this.dragging) {
            if (_this.hideResizeGrips) {
                _this.iconLeft.hide();
                _this.iconRight.hide();
            }
            _this.removeCursors();
        }
    },


    removeCursors: function() {
        this.chart.setMouseCursor('auto');
    },

    relativeZoom: function(multiplier, position) {
        var _this = this;
        _this.dragger.stop();
        _this.multiplier = multiplier;
        _this.position = position;

        var pos0 = position;
        var pos1;

        if (_this.rotate) {
            pos1 = pos0 + _this.height / multiplier;
        } else {
            pos1 = pos0 + _this.width / multiplier;
        }

        _this.updateScrollbarSize(pos0, pos1);
    },

    destroy: function() {
        var _this = this;
        _this.clear();
        AmCharts.remove(_this.set);
    },

    clear: function() {
        var _this = this;
        clearInterval(_this.interval);
    },

    handleDragStart: function() {
        var _this = this;
        var chart = _this.chart;
        _this.dragger.stop();

        _this.removeCursors();
        _this.dragging = true;

        var bbox = _this.getDBox();
        if (_this.rotate) {
            _this.initialCoord = bbox.y;
            _this.initialMouse = chart.mouseY;
        } else {
            _this.initialCoord = bbox.x;
            _this.initialMouse = chart.mouseX;
        }
    },

    handleDragStop: function() {
        var _this = this;
        if (_this.updateOnReleaseOnly) {
            _this.updateScrollbar();
            _this.skipEvent = false;
            _this.dispatchScrollbarEvent();
        }

        _this.dragging = false;

        if (_this.mouseIsOver) {
            _this.removeCursors();
        }
        _this.updateScrollbar();
    },

    handleDraggerOver: function() {
        this.handleMouseOver();
    },

    leftDragStart: function() {
        var _this = this;
        _this.dragger.stop();
        _this.resizingLeft = true;
    },

    leftDragStop: function() {
        var _this = this;
        _this.resizingLeft = false;
        if (!_this.mouseIsOver) {
            _this.removeCursors();
        }
        _this.updateOnRelease();
    },

    rightDragStart: function() {
        var _this = this;
        _this.dragger.stop();
        _this.resizingRight = true;
    },


    rightDragStop: function() {
        var _this = this;
        _this.resizingRight = false;
        if (!_this.mouseIsOver) {
            _this.removeCursors();
        }
        _this.updateOnRelease();
    },

    iconRollOut: function() {
        this.removeCursors();
        this.handleMouseOut();
    },

    iconRollOver: function() {
        var _this = this;
        if (_this.rotate) {
            _this.chart.setMouseCursor("n-resize");
        } else {
            _this.chart.setMouseCursor("e-resize");
        }
        _this.handleMouseOver();
    },

    getDBox: function() {
        var bbox = this.dragger.getBBox();
        return bbox;
    },

    handleBgClick: function() {
        var _this = this;
        if (!_this.resizingRight && !_this.resizingLeft) {
            _this.zooming = true;
            var property;
            var start;
            var end;
            var duration = _this.scrollDuration;
            var dragger = _this.dragger;
            var bbox = _this.getDBox();
            var bboxHeight = bbox.height;
            var bboxWidth = bbox.width;
            var chart = _this.chart;
            var y = _this.y;
            var x = _this.x;
            var rotate = _this.rotate;

            if (rotate) {
                property = "y";
                start = bbox.y;
                end = chart.mouseY - bboxHeight / 2 - y;
                end = AmCharts.fitToBounds(end, 0, _this.height - bboxHeight);
            } else {
                property = "x";
                start = bbox.x;
                end = chart.mouseX - bboxWidth / 2 - x;
                end = AmCharts.fitToBounds(end, 0, _this.width - bboxWidth);
            }
            if (_this.updateOnReleaseOnly) {
                _this.skipEvent = false;
                dragger.setAttr(property, end);
                _this.dispatchScrollbarEvent();
                _this.clipDragger();
            } else {
                end = Math.round(end);
                if (rotate) {
                    dragger.animate({
                        'y': end
                    }, duration, '>');
                } else {
                    dragger.animate({
                        'x': end
                    }, duration, '>');
                }
            }
        }
    },

    updateOnRelease: function() {
        var _this = this;
        if (_this.updateOnReleaseOnly) {
            _this.updateScrollbar();
            _this.skipEvent = false;
            _this.dispatchScrollbarEvent();
        }
    },

    handleReleaseOutside: function() {
        var _this = this;

        if (_this.set) {
            if (_this.resizingLeft || _this.resizingRight || _this.dragging) {
                _this.updateOnRelease();
                _this.removeCursors();
            }

            _this.resizingLeft = false;
            _this.resizingRight = false;
            _this.dragging = false;
            _this.mouseIsOver = false;

            _this.hideDragIcons();
            _this.updateScrollbar();
        }
    },

    handleMouseOver: function() {
        var _this = this;
        _this.mouseIsOver = true;
        _this.showDragIcons();

        // 鼠标移到滚动条上
        // 向sweet容器发送消息，用于显示tooltip
        var scrollEvent = {
            type: "hover"
        };
        $(_this.chart.div).trigger("scrollBar", [scrollEvent]);
    },


    handleMouseOut: function() {
        var _this = this;
        _this.mouseIsOver = false;
        _this.hideDragIcons();

        // 鼠标移出滚动条
        // 向sweet容器发送消息，用于隐藏tooltip
        var scrollEvent = {
            type: "out"
        };
        $(_this.chart.div).trigger("scrollBar", [scrollEvent]);
    }

});;
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar,

    construct: function() {
        var _this = this;
        AmCharts.ChartScrollbar.base.construct.call(_this);

        _this.graphLineColor = "#BBBBBB";
        _this.graphLineAlpha = 0;
        _this.graphFillColor = "#BBBBBB";
        _this.graphFillAlpha = 1;
        _this.selectedGraphLineColor = "#888888";
        _this.selectedGraphLineAlpha = 0;
        _this.selectedGraphFillColor = "#888888";
        _this.selectedGraphFillAlpha = 1;
        _this.gridCount = 0;
        _this.gridColor = "#FFFFFF";
        _this.gridAlpha = 0.7;
        _this.autoGridCount = false;
        _this.skipEvent = false;
        _this.color = "#FFFFFF";
        _this.scrollbarCreated = false;
    },


    init: function() {
        var _this = this;
        var categoryAxis = _this.categoryAxis;
        var chart = _this.chart;
        if (!categoryAxis) {
            categoryAxis = new AmCharts.CategoryAxis();
            _this.categoryAxis = categoryAxis;
        }

        categoryAxis.chart = chart;
        categoryAxis.id = "scrollbar";
        categoryAxis.dateFormats = chart.categoryAxis.dateFormats;
        categoryAxis.boldPeriodBeginning = chart.categoryAxis.boldPeriodBeginning;
        categoryAxis.axisItemRenderer = AmCharts.RecItem;
        categoryAxis.axisRenderer = AmCharts.RecAxis;
        categoryAxis.guideFillRenderer = AmCharts.RecFill;
        categoryAxis.inside = true;
        categoryAxis.fontSize = _this.fontSize;
        categoryAxis.tickLength = 0;
        categoryAxis.axisAlpha = 0;

        if (_this.graph) {
            var valueAxis = _this.valueAxis;
            if (!valueAxis) {
                valueAxis = new AmCharts.ValueAxis();
                _this.valueAxis = valueAxis;
                valueAxis.visible = false;
                valueAxis.scrollbar = true;
                valueAxis.axisItemRenderer = AmCharts.RecItem;
                valueAxis.axisRenderer = AmCharts.RecAxis;
                valueAxis.guideFillRenderer = AmCharts.RecFill;
                valueAxis.labelsEnabled = false;
                valueAxis.chart = chart;
            }

            var unselectedGraph = _this.unselectedGraph;
            if (!unselectedGraph) {
                unselectedGraph = new AmCharts.AmGraph();
                unselectedGraph.scrollbar = true;
                _this.unselectedGraph = unselectedGraph;
                unselectedGraph.negativeBase = _this.graph.negativeBase;
            }
            var selectedGraph = _this.selectedGraph;
            if (!selectedGraph) {
                selectedGraph = new AmCharts.AmGraph();
                selectedGraph.scrollbar = true;
                _this.selectedGraph = selectedGraph;
                selectedGraph.negativeBase = _this.graph.negativeBase;
            }
        }

        _this.scrollbarCreated = true;
    },


    draw: function() {
        var _this = this;
        AmCharts.ChartScrollbar.base.draw.call(_this);

        if (!_this.scrollbarCreated) {
            _this.init();
        }

        var chart = _this.chart;
        var data = chart.chartData;
        var categoryAxis = _this.categoryAxis;
        var rotate = _this.rotate;
        var x = _this.x;
        var y = _this.y;
        var width = _this.width;
        var height = _this.height;
        var chartCategoryAxis = chart.categoryAxis;
        var set = _this.set;

        categoryAxis.setOrientation(!rotate);
        categoryAxis.parseDates = chartCategoryAxis.parseDates;
        categoryAxis.rotate = rotate;
        categoryAxis.equalSpacing = chartCategoryAxis.equalSpacing;
        categoryAxis.minPeriod = chartCategoryAxis.minPeriod;
        categoryAxis.startOnAxis = chartCategoryAxis.startOnAxis;
        categoryAxis.viW = width;
        categoryAxis.viH = height;
        categoryAxis.width = width;
        categoryAxis.height = height;
        categoryAxis.gridCount = _this.gridCount;
        categoryAxis.gridColor = _this.gridColor;
        categoryAxis.gridAlpha = _this.gridAlpha;
        categoryAxis.color = _this.color;
        categoryAxis.autoGridCount = _this.autoGridCount;

        if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
            categoryAxis.timeZoom(data[0].time, data[data.length - 1].time);
        }
        categoryAxis.zoom(0, data.length - 1);

        var graph = _this.graph;
        if (graph) {
            var valueAxis = _this.valueAxis;
            var graphValueAxis = graph.valueAxis;
            valueAxis.id = graphValueAxis.id;
            valueAxis.rotate = rotate;
            valueAxis.setOrientation(rotate);
            valueAxis.width = width;
            valueAxis.height = height;
            valueAxis.viW = width;
            valueAxis.viH = height;
            valueAxis.dataProvider = data;
            valueAxis.reversed = graphValueAxis.reversed;
            valueAxis.logarithmic = graphValueAxis.logarithmic;
            valueAxis.gridAlpha = 0;
            valueAxis.axisAlpha = 0;
            set.push(valueAxis.set);

            if (rotate) {
                valueAxis.y = y;
            } else {
                valueAxis.x = x;
            }

            var min = Infinity;
            var max = -Infinity;

            for (var i = 0; i < data.length; i++) {
                var values = data[i].axes[graphValueAxis.id].graphs[graph.id].values;
                for (var k in values) {
                    if (k != "percents" && k != "total") {
                        var val = values[k];

                        if (val < min) {
                            min = val;
                        }
                        if (val > max) {
                            max = val;
                        }
                    }
                }
            }

            if (min != Infinity) {
                valueAxis.minimum = min;
            }
            if (max != -Infinity) {
                valueAxis.maximum = max + (max - min) * 0.1;
            }

            if (min == max) {
                valueAxis.minimum -= 1;
                valueAxis.maximum += 1;
            }

            valueAxis.zoom(0, data.length - 1);

            var ug = _this.unselectedGraph;
            ug.id = graph.id;
            ug.rotate = rotate;
            ug.chart = chart;
            ug.chartType = chart.chartType;
            ug.data = data;
            ug.valueAxis = valueAxis;
            ug.chart = graph.chart;
            ug.categoryAxis = _this.categoryAxis;
            ug.valueField = graph.valueField;
            ug.openField = graph.openField;
            ug.closeField = graph.closeField;
            ug.highField = graph.highField;
            ug.lowField = graph.lowField;
            ug.lineAlpha = _this.graphLineAlpha;
            ug.lineColor = _this.graphLineColor;
            ug.fillAlphas = _this.graphFillAlpha;
            ug.fillColors = _this.graphFillColor;
            ug.connect = graph.connect;
            ug.hidden = graph.hidden;
            ug.width = width;
            ug.height = height;

            var sg = _this.selectedGraph;
            sg.id = graph.id;
            sg.rotate = rotate;
            sg.chart = chart;
            sg.chartType = chart.chartType;
            sg.data = data;
            sg.valueAxis = valueAxis;
            sg.chart = graph.chart;
            sg.categoryAxis = categoryAxis;
            sg.valueField = graph.valueField;
            sg.openField = graph.openField;
            sg.closeField = graph.closeField;
            sg.highField = graph.highField;
            sg.lowField = graph.lowField;
            sg.lineAlpha = _this.selectedGraphLineAlpha;
            sg.lineColor = _this.selectedGraphLineColor;
            sg.fillAlphas = _this.selectedGraphFillAlpha;
            sg.fillColors = _this.selectedGraphFillColor;
            sg.connect = graph.connect;
            sg.hidden = graph.hidden;
            sg.width = width;
            sg.height = height;

            var graphType = _this.graphType;

            if (!graphType) {
                graphType = graph.type;
            }

            ug.type = graphType;
            sg.type = graphType;

            var lastIndex = data.length - 1;
            ug.zoom(0, lastIndex);
            sg.zoom(0, lastIndex);

            var dragger = _this.dragger;

            sg.set.click(function() {
                _this.handleBackgroundClick();
            }).mouseover(function() {
                _this.handleMouseOver();
            }).mouseout(function() {
                _this.handleMouseOut();
            });

            ug.set.click(function() {
                _this.handleBackgroundClick();
            }).mouseover(function() {
                _this.handleMouseOver();
            }).mouseout(function() {
                _this.handleMouseOut();
            });
            set.push(ug.set);
            set.push(sg.set);
        }
        set.push(categoryAxis.set);
        set.push(categoryAxis.labelsSet);

        _this.bg.toBack();
        _this.invisibleBg.toFront();
        _this.dragger.toFront();
        _this.iconLeft.toFront();
        _this.iconRight.toFront();
    },

    timeZoom: function(startTime, endTime) {
        var _this = this;
        _this.startTime = startTime;
        _this.endTime = endTime;
        _this.timeDifference = endTime - startTime;
        _this.skipEvent = true;
        _this.zoomScrollbar();
    },

    zoom: function(start, end) {
        var _this = this;
        _this.start = start;
        _this.end = end;
        _this.skipEvent = true;
        _this.zoomScrollbar();
    },

    dispatchScrollbarEvent: function() {
        var _this = this;
        if (_this.skipEvent) {
            _this.skipEvent = false;
        } else {
            var data = _this.chart.chartData;
            var draggerPos;
            var draggerSize;
            var dBBox = _this.dragger.getBBox();
            var xx = dBBox.x;
            var yy = dBBox.y;
            var ww = dBBox.width;
            var hh = dBBox.height;

            if (_this.rotate) {
                draggerPos = yy;
                draggerSize = hh;
            } else {
                draggerPos = xx;
                draggerSize = ww;
            }

            var event = {
                type: "zoomed"
            };
            event.target = this;
            event.chart = _this.chart;

            var categoryAxis = _this.categoryAxis;
            var stepWidth = _this.stepWidth;

            // 用户手动操作了滚动条
            // 向sweet容器发送消息，用于显示时间范围tooltip
            var scrollEvent = {
                type: "changed",
                left: xx,
                top: yy,
                width: ww,
                height: hh
            };
            $(_this.chart.div).trigger("scrollBar", [scrollEvent]);

            if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
                var lastTime = data[data.length - 1].time;
                var firstTime = data[0].time

                var minDuration = categoryAxis.minDuration();
                var startTime = Math.round(draggerPos / stepWidth) + firstTime;
                var endTime;

                if (!_this.dragging) {
                    endTime = Math.round((draggerPos + draggerSize) / stepWidth) + firstTime - minDuration;
                } else {
                    endTime = startTime + _this.timeDifference;
                }

                if (startTime > endTime) {
                    startTime = endTime;
                }

                if (startTime != _this.startTime || endTime != _this.endTime) {
                    _this.startTime = startTime;
                    _this.endTime = endTime;
                    event.start = startTime;
                    event.end = endTime;
                    event.startDate = new Date(startTime)
                    event.endDate = new Date(endTime);
                    _this.fire(event.type, event);
                }
            } else {
                if (!categoryAxis.startOnAxis) {
                    var halfStep = stepWidth / 2;
                    draggerPos += halfStep;
                }

                draggerSize -= _this.stepWidth / 2;

                var start = categoryAxis.xToIndex(draggerPos);
                var end = categoryAxis.xToIndex(draggerPos + draggerSize);


                if (start != _this.start || _this.end != end) {
                    if (categoryAxis.startOnAxis) {
                        if (_this.resizingRight && start == end) {
                            end++;
                        }

                        if (_this.resizingLeft && start == end) {
                            if (start > 0) {
                                start--;
                            } else {
                                end = 1;
                            }
                        }
                    }

                    _this.start = start;
                    if (!_this.dragging) {
                        _this.end = end;
                    } else {
                        _this.end = _this.start + _this.difference;
                    }

                    event.start = _this.start;
                    event.end = _this.end;

                    if (categoryAxis.parseDates) {
                        if (data[_this.start]) {
                            event.startDate = new Date(data[_this.start].time);
                        }
                        if (data[_this.end]) {
                            event.endDate = new Date(data[_this.end].time);
                        }
                    }
                    _this.fire(event.type, event);
                }
            }
        }
    },


    zoomScrollbar: function() {
        var _this = this;
        var pos0;
        var pos1;
        var data = _this.chart.chartData;
        var categoryAxis = _this.categoryAxis;
        var stepWidth;

        if (categoryAxis.parseDates && !categoryAxis.equalSpacing) {
            stepWidth = categoryAxis.stepWidth;

            var firstTime = data[0].time;

            pos0 = stepWidth * (_this.startTime - firstTime);
            pos1 = stepWidth * (_this.endTime - firstTime + categoryAxis.minDuration());
        } else {
            pos0 = data[_this.start].x[categoryAxis.id];
            pos1 = data[_this.end].x[categoryAxis.id];

            stepWidth = categoryAxis.stepWidth;

            if (!categoryAxis.startOnAxis) {
                var halfStep = stepWidth / 2;
                pos0 -= halfStep;
                pos1 += halfStep;
            }
        }
        _this.stepWidth = stepWidth;
        _this.updateScrollbarSize(pos0, pos1);

        // 用户手动操作了滚动条
        // 向sweet容器发送消息，用于显示时间范围tooltip
        var box = _this.dragger.getBBox();
        var scrollEvent = {
            type: "changed",
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
            dragger: _this.dragger.node,
            bg: _this.bg.node
        };
        $(_this.chart.div).trigger("scrollBar", [scrollEvent]);
    },


    maskGraphs: function(x, y, w, h) {
        var _this = this;
        var selectedGraph = _this.selectedGraph;
        if (selectedGraph) {
            selectedGraph.set.clipRect(x, y, w, h);
        }
    },

    handleDragStart: function() {
        var _this = this;
        AmCharts.ChartScrollbar.base.handleDragStart.call(_this);
        _this.difference = _this.end - _this.start;
        _this.timeDifference = _this.endTime - _this.startTime;
        if (_this.timeDifference < 0) {
            _this.timeDifference = 0;
        }
    },

    handleBackgroundClick: function() {
        var _this = this;
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(_this);

        if (!_this.dragging) {
            _this.difference = _this.end - _this.start;
            _this.timeDifference = _this.endTime - _this.startTime;
            if (_this.timeDifference < 0) {
                _this.timeDifference = 0;
            }
        }
    }

});;
AmCharts.circle = function(container, r, color, alpha, bwidth, bcolor, balpha, bubble) {
    if (bwidth == undefined || bwidth == 0) {
        bwidth = 1;
    }
    if (bcolor == undefined) {
        /**
         * 修改默认值#000000为#ffffff
         */
        bcolor = '#ffffff';
    }
    if (balpha == undefined) {
        /**
         * 修改默认值0为1
         */
        balpha = 1;
    }

    var attr = {
        'fill': color,
        'stroke': bcolor,
        'fill-opacity': alpha,
        'stroke-width': bwidth,
        'stroke-opacity': balpha
    };

    var circle = container.circle(0, 0, r).attr(attr);
    if (bubble) {
        circle.gradient("radialGradient", [color, AmCharts.adjustLuminosity(color, -0.6)]);
    }

    return circle;
}

AmCharts.text = function(container, text, color, fontFamily, fontSize, anchor, bold, alpha) {
    if (!anchor) {
        anchor = "middle";
    }
    if (anchor == "right") {
        anchor = "end";
    }

    var attr = {
        'fill': color,
        'font-family': fontFamily,
        'font-size': fontSize,
        'opacity': alpha
    };

    if (bold == true) {
        attr['font-weight'] = 'bold';
    }

    // last as size depends on previous
    attr['text-anchor'] = anchor;

    var txt = container.text(text, attr);
    return txt;
}



AmCharts.polygon = function(container, x, y, colors, alpha, bwidth, bcolor, balpha, gradientRotation) {
    if (isNaN(bwidth)) {
        bwidth = 0;
    }

    if (isNaN(balpha)) {
        balpha = alpha;
    }
    var color = colors;
    var gradient = false;

    if (typeof(color) == "object") {
        if (color.length > 1) {
            gradient = true;
            color = color[0];
        }
    }

    if (bcolor == undefined) {
        bcolor = color;
    }
    var attr = {
        'fill': color,
        'stroke': bcolor,
        'fill-opacity': alpha,
        'stroke-width': bwidth,
        'stroke-opacity': balpha
    };
    var dx = AmCharts.dx;
    var dy = AmCharts.dy;
    var round = Math.round;
    var str = "M" + (round(x[0]) + dx) + "," + (round(y[0]) + dy);

    for (var i = 1; i < x.length; i++) {
        str += " L" + (round(x[i]) + dx) + "," + (round(y[i]) + dy);
    }
    str += " Z";
    var p = container.path(str).attr(attr);

    if (gradient) {
        p.gradient("linearGradient", colors, gradientRotation);
    }

    return p;
}


AmCharts.rect = function(container, w, h, colors, alpha, bwidth, bcolor, balpha, cradius, gradientRotation) {
    if (isNaN(bwidth)) {
        bwidth = 0;
    }
    if (cradius == undefined) {
        cradius = 0;
    }
    if (gradientRotation == undefined) {
        gradientRotation = 270;
    }
    if (isNaN(alpha)) {
        alpha = 0;
    }
    var color = colors;
    var gradient = false;
    if (typeof(color) == "object") {
        color = color[0];
        gradient = true;
    }
    if (bcolor == undefined) {
        bcolor = color;
    }
    if (balpha == undefined) {
        balpha = alpha;
    }

    w = Math.round(w);
    h = Math.round(h);

    var x = 0;
    var y = 0;

    if (w < 0) {
        w = Math.abs(w);
        x = -w;
    }

    if (h < 0) {
        h = Math.abs(h);
        y = -h;
    }

    x += AmCharts.dx;
    y += AmCharts.dy;

    var attr = {
        'fill': color,
        'stroke': bcolor,
        'fill-opacity': alpha,
        'stroke-opacity': balpha
    };

    var r = container.rect(x, y, w, h, cradius, bwidth).attr(attr);

    if (gradient) {
        r.gradient("linearGradient", colors, gradientRotation);
    }

    return r;
}

AmCharts.triangle = function(container, w, rotation, color, alpha, bwidth, bcolor, balpha) {
    var UNDEFINED = undefined;

    if (bwidth == UNDEFINED || bwidth == 0) {
        bwidth = 1;
    }
    if (bcolor == UNDEFINED) {
        bcolor = '#000';
    }
    if (balpha == UNDEFINED) {
        balpha = 0;
    }

    var attr = {
        'fill': color,
        'stroke': bcolor,
        'fill-opacity': alpha,
        'stroke-width': bwidth,
        'stroke-opacity': balpha
    };

    var half = w / 2;
    var path;
    var comma = ",";
    var l = " L";
    var m = " M";
    var z = " Z";

    if (rotation == 0) {
        path = m + (-half) + comma + half + l + 0 + comma + (-half) + l + half + comma + half + z;
    }
    if (rotation == 180) {
        path = m + (-half) + comma + (-half) + l + 0 + comma + half + l + half + comma + (-half) + z;
    }
    if (rotation == 90) {
        path = m + (-half) + comma + (-half) + l + half + comma + 0 + l + (-half) + comma + half + z;
    }
    if (rotation == 270) {
        path = m + (-half) + comma + 0 + l + half + comma + half + l + half + comma + (-half) + z;
    }

    var triangle = container.path(path).attr(attr);

    return triangle;
}


AmCharts.line = function(container, x, y, color, alpha, thickness, dashLength, smoothed, doFix) {
    var none = "none";

    var attr = {
        'fill': none,
        'stroke-width': thickness
    };

    if (dashLength != undefined && dashLength > 0) {
        attr['stroke-dasharray'] = dashLength;
    }

    if (!isNaN(alpha)) {
        attr['stroke-opacity'] = alpha;
    }

    if (color) {
        attr['stroke'] = color;
    }

    var letter = "L";

    var round = Math.round;

    var dx = AmCharts.dx;
    var dy = AmCharts.dy;
    var str = "M" + (round(x[0]) + dx) + "," + (round(y[0]) + dy);

    for (var i = 1; i < x.length; i++) {
        str += " " + letter + "" + (round(x[i]) + dx) + "," + (round(y[i]) + dy);
    }


    if (AmCharts.VML) {
        return container.path(str, undefined, true).attr(attr);
    } else {
        if (doFix) {
            str += " M0,0 L0,0";
        }
        return container.path(str).attr(attr);
    }
}


AmCharts.wedge = function(paper, x, y, startAngle, arc, radius, yRadius, innerRadius, h, attributes, gradientRatio) {
    var rad = Math.PI / 180;
    var round = Math.round;

    radius = round(radius);
    yRadius = round(yRadius);

    innerRadius = round(innerRadius);
    var yInnerRadius = round((yRadius / radius) * innerRadius);

    var vml = AmCharts.VML;

    // FAILS IF BIGGER, and the smaller radius, the bigger corection
    var edge = -359.5 - radius / 100;
    if (edge < -359.95) {
        edge = -359.95;
    }

    if (arc <= edge) {
        arc = edge;
    }

    /* to understand what each letter means
	 c-----------b 
	  \          / 
	   \        /
	    \      / 
	     d----a  
	      \  /   
	       \/    
	       x   	 
	*/

    var degToRad = 1 / 180 * Math.PI;
    var ax = x + Math.cos(startAngle * degToRad) * innerRadius;
    var ay = y + Math.sin(-startAngle * degToRad) * yInnerRadius;


    var bx = x + Math.cos(startAngle * degToRad) * radius;
    var by = y + Math.sin(-startAngle * degToRad) * yRadius;

    var cx = x + Math.cos((startAngle + arc) * degToRad) * radius;
    var cy = y + Math.sin((-startAngle - arc) * degToRad) * yRadius;

    var dx = x + Math.cos((startAngle + arc) * degToRad) * innerRadius;
    var dy = y + Math.sin((-startAngle - arc) * degToRad) * yInnerRadius;

    var hsb = AmCharts.adjustLuminosity(attributes.fill, -0.2);

    var bparams = {
        'fill': hsb,
        'stroke-opacity': 0
    };

    var lf = 0;
    var sf = 1;
    if (Math.abs(arc) > 180) {
        lf = 1;
    }

    var slice = paper.set();
    var comma = ",";
    var L = " L";
    var A = " A";
    var Z = " Z";
    var M = " M";
    var B = " B";
    var UNDEFINED = undefined;
    var cs = "1000,1000";

    var wpath;
    var isSmall;
    var ten = 10;

    if (vml) {
        ax = round(ten * ax);
        bx = round(ten * bx);
        cx = round(ten * cx);
        dx = round(ten * dx);
        ay = round(ten * ay);
        by = round(ten * by);
        cy = round(ten * cy);
        dy = round(ten * dy);
        x = round(ten * x);
        h = round(ten * h);
        y = round(ten * y);
        radius = ten * radius;
        yRadius = ten * yRadius;
        innerRadius = ten * innerRadius;
        yInnerRadius = ten * yInnerRadius;

        if (Math.abs(arc) < 1 && Math.abs(cx - bx) <= 1 && Math.abs(cy - by) <= 1) {
            isSmall = true;
        }
    }
    var parc = "";
    if (h > 0) {
        if (vml) {
            path = M + ax + comma + (ay + h) + L + bx + comma + (by + h);

            if (!isSmall) {
                path += A + (x - radius) + comma + (h + y - yRadius) + comma + (x + radius) + comma + (h + y + yRadius) + comma + (bx) + comma + (by + h) + comma + (cx) + comma + (cy + h);
            }

            path += L + dx + comma + (dy + h);

            if (innerRadius > 0) {
                if (!isSmall) {
                    path += " B" + (x - innerRadius) + comma + (h + y - yInnerRadius) + comma + (x + innerRadius) + comma + (h + y + yInnerRadius) + comma + dx + comma + (h + dy) + comma + ax + comma + (h + ay);
                }
            }
        } else {
            path = M + ax + comma + (ay + h) + L + bx + comma + (by + h);
            path += A + radius + comma + yRadius + comma + 0 + comma + lf + comma + sf + comma + cx + comma + (cy + h) + L + dx + comma + (dy + h);

            if (innerRadius > 0) {
                path += A + innerRadius + comma + yInnerRadius + comma + 0 + comma + lf + comma + 0 + comma + ax + comma + (ay + h);
            }
        }

        path += Z;
        c = paper.path(path, UNDEFINED, UNDEFINED, cs).attr(bparams);
        slice.push(c);
        var b1 = paper.path(M + ax + comma + ay + L + ax + comma + (ay + h) + L + bx + comma + (by + h) + L + bx + comma + by + L + ax + comma + ay + Z, UNDEFINED, UNDEFINED, cs).attr(bparams);
        var b2 = paper.path(M + cx + comma + cy + L + cx + comma + (cy + h) + L + dx + comma + (dy + h) + L + dx + comma + dy + L + cx + comma + cy + Z, UNDEFINED, UNDEFINED, cs).attr(bparams);
        slice.push(b1);
        slice.push(b2);
    }


    if (vml) {
        if (!isSmall) {
            parc = A + round(x - radius) + comma + round(y - yRadius) + comma + round(x + radius) + comma + round(y + yRadius) + comma + round(bx) + comma + round(by) + comma + round(cx) + comma + round(cy);
        }

        wpath = M + round(ax) + comma + round(ay) + L + round(bx) + comma + round(by) + parc + L + round(dx) + comma + round(dy);
    } else {
        parc = A + radius + comma + yRadius + comma + 0 + comma + lf + comma + sf + comma + cx + comma + cy;
        wpath = M + ax + comma + ay + L + bx + comma + by + parc + L + dx + comma + dy;
    }


    if (innerRadius > 0) {
        if (vml) {
            if (!isSmall) {
                wpath += B + (x - innerRadius) + comma + (y - yInnerRadius) + comma + (x + innerRadius) + comma + (y + yInnerRadius) + comma + dx + comma + dy + comma + ax + comma + ay;
            }
        } else {
            wpath += A + innerRadius + comma + yInnerRadius + comma + 0 + comma + lf + comma + 0 + comma + ax + comma + ay;
        }
    }



    wpath += Z;

    var w = paper.path(wpath, UNDEFINED, UNDEFINED, cs).attr(attributes);
    if (gradientRatio) {
        var gradient = [];
        for (var i = 0; i < gradientRatio.length; i++) {
            gradient.push(AmCharts.adjustLuminosity(attributes.fill, gradientRatio[i]));
        }
        if (gradient.length > 0) {
            w.gradient("linearGradient", gradient);
        }
    }

    slice.push(w);
    return slice;
}

// Thanks Craig Buckler for this method:
// http://www.sitepoint.com/javascript-generate-lighter-darker-color/
AmCharts.adjustLuminosity = function(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = String(hex[0]) + String(hex[0]) + String(hex[1]) + String(hex[1]) + String(hex[2]) + String(hex[2]);
    }

    lum = lum || 0;

    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};
AmCharts.AmPieChart = AmCharts.Class({
    inherits: AmCharts.AmChart,

    construct: function() {
        var _this = this;
        _this.createEvents('rollOverSlice', 'rollOutSlice', 'clickSlice', 'pullOutSlice', 'pullInSlice');

        AmCharts.AmPieChart.base.construct.call(_this);

        _this.colors = ["#FF0F00", "#FF6600", "#FF9E01", "#FCD202", "#F8FF01", "#B0DE09", "#04D215", "#0D8ECF", "#0D52D1", "#2A0CD0", "#8A0CCF", "#CD0D74", "#754DEB", "#DDDDDD", "#999999", "#333333", "#000000", "#57032A", "#CA9726", "#990000", "#4B0C25"];
        _this.noDataColor = "#A5A5A5",
        _this.noDataText = "No data",
        _this.pieAlpha = 1;
        _this.pieBaseColor;
        _this.pieBrightnessStep = 30;
        _this.groupPercent = 0;
        _this.groupedTitle = "Other";
        _this.groupedPulled = false;
        _this.groupedAlpha = 1;
        _this.marginLeft = 0;
        _this.marginTop = 10;
        _this.marginBottom = 10;
        _this.marginRight = 0;
        _this.minRadius = 10;
        _this.hoverAlpha = 1;
        _this.depth3D = 0;
        _this.startAngle = 90;
        _this.innerRadius = 0;
        _this.angle = 0;
        _this.outlineColor = '#FFFFFF';
        _this.outlineAlpha = 0;
        _this.outlineThickness = 1;
        _this.startRadius = '500%';
        _this.startAlpha = 1;
        _this.startDuration = 1;
        _this.startEffect = 'bounce';
        _this.sequencedAnimation = false;
        _this.pullOutRadius = '10%';
        _this.pullOutDuration = 1;
        _this.pullOutEffect = 'bounce';
        _this.pullOutOnlyOne = false;
        _this.pullOnHover = false;
        _this.labelsEnabled = true;
        _this.labelRadius = 30;
        _this.labelTickColor = "#000000";
        _this.labelTickAlpha = 0.2;
        _this.labelText = "[[title]]: [[percents]]%";
        _this.hideLabelsPercent = 0;
        _this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
        _this.dataProvider;
        _this.urlTarget = "_self";
        _this.previousScale = 1;
        _this.autoMarginOffset = 10;
        _this.gradientRatio = [];
        _this.type = "pie";
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmPieChart.base.initChart.call(_this);

        if (_this.dataChanged) {
            if (!_this.dataProvider || !AmCharts.ifArray(_this.dataProvider) || _this.dataProvider.length <= 0) {
                var _tData = {};
                _tData[_this.titleField] = _this.noDataText;
                _this.dataProvider = [_tData];
            }
            _this.parseData();
            _this.dispatchDataUpdated = true;
            _this.dataChanged = false;
            var _isNoData = true;
            for (var i = 0; i < _this.chartData.length; i++) {
                if (_this.chartData[i].hidden != true && _this.chartData[i].percents > 0) {
                    _isNoData = false;
                    break;
                }
            }
            if (_isNoData) {
                for (var i = 0; i < _this.chartData.length; i++) {
                    _this.chartData[i].percents = 0;
                    _this.chartData[i].color = _this.noDataColor;
                    _this.chartData[i]._isNoData = true;
                }
            }
            if (_this.legend) {
                _this.legend.setData(_this.chartData);
            }
        }
        _this.drawChart();
    },


    handleLegendEvent: function(event) {
        var _this = this;
        var type = event.type;
        var dItem = event.dataItem;

        if (dItem) {
            var hidden = dItem.hidden;

            switch (type) {
                case 'clickMarker':
                    if (!hidden) {
                        _this.clickSlice(dItem);
                    }
                    break;
                case 'clickLabel':
                    if (!hidden) {
                        _this.clickSlice(dItem);
                    }
                    break;
                case 'rollOverItem':
                    if (!hidden) {
                        _this.rollOverSlice(dItem, false);
                    }
                    break;
                case 'rollOutItem':
                    if (!hidden) {
                        _this.rollOutSlice(dItem);
                    }
                    break;
                case 'hideItem':
                    _this.hideSlice(dItem);
                    break;
                case 'showItem':
                    _this.showSlice(dItem);
                    break;
            }
        }
    },

    invalidateVisibility: function() {
        var _this = this;
        _this.recalculatePercents();
        _this.initChart();
        var legend = _this.legend;
        if (legend) {
            legend.invalidateSize();
        }
    },

    drawChart: function() {
        var _this = this;

        AmCharts.AmPieChart.base.drawChart.call(_this);
        var chartData = _this.chartData;

        if (AmCharts.ifArray(chartData)) {
            if (_this.realWidth > 0 && _this.realHeight > 0) {
                if (AmCharts.VML) {
                    _this.startAlpha = 1;
                }

                var startDuration = _this.startDuration;
                var container = _this.container;
                var realWidth = _this.updateWidth();
                _this.realWidth = realWidth;

                var realHeight = _this.updateHeight();
                _this.realHeight = realHeight;

                var toCoordinate = AmCharts.toCoordinate;
                var marginLeft = toCoordinate(_this.marginLeft, realWidth);
                var marginRight = toCoordinate(_this.marginRight, realWidth);
                var marginTop = toCoordinate(_this.marginTop, realHeight) + _this.getTitleHeight();
                var marginBottom = toCoordinate(_this.marginBottom, realHeight);

                _this.chartDataLabels = [];
                _this.ticks = [];

                var pieX;
                var pieY;
                var radius;
                var labelRadius = AmCharts.toNumber(_this.labelRadius);
                var labelWidth = _this.measureMaxLabel();

                if (!_this.labelText || !_this.labelsEnabled) {
                    labelWidth = 0;
                    labelRadius = 0;
                }

                if (_this.pieX == undefined) {
                    pieX = (realWidth - marginLeft - marginRight) / 2 + marginLeft;
                } else {
                    pieX = toCoordinate(_this.pieX, _this.realWidth);
                }

                if (_this.pieY == undefined) {
                    pieY = (realHeight - marginTop - marginBottom) / 2 + marginTop;
                } else {
                    pieY = toCoordinate(_this.pieY, realHeight);
                }

                radius = toCoordinate(_this.radius, realWidth, realHeight);
                _this.pullOutRadiusReal = AmCharts.toCoordinate(_this.pullOutRadius, radius);

                // if radius is not defined, calculate from margins             
                if (!radius) {
                    var pureWidth;

                    if (labelRadius >= 0) {
                        pureWidth = realWidth - marginLeft - marginRight - labelWidth * 2;
                    } else {
                        pureWidth = realWidth - marginLeft - marginRight;
                    }

                    var pureHeight = realHeight - marginTop - marginBottom;
                    radius = Math.min(pureWidth, pureHeight);

                    if (pureHeight < pureWidth) {
                        radius = radius / (1 - _this.angle / 90);

                        if (radius > pureWidth) {
                            radius = pureWidth;
                        }
                    }
                    _this.pullOutRadiusReal = AmCharts.toCoordinate(_this.pullOutRadius, radius);

                    if (labelRadius >= 0) {
                        radius -= (labelRadius + _this.pullOutRadiusReal) * 1.8;
                    } else {
                        radius -= _this.pullOutRadiusReal * 1.8;
                    }
                    radius = radius / 2;
                }

                if (radius < _this.minRadius) {
                    radius = _this.minRadius;
                }
                _this.pullOutRadiusReal = toCoordinate(_this.pullOutRadius, radius);

                var innerRadius = toCoordinate(_this.innerRadius, radius);

                if (innerRadius >= radius) {
                    innerRadius = radius - 1;
                }

                var startAngle = AmCharts.fitToBounds(_this.startAngle, 0, 360);

                // in case the pie has 3D depth, start angle can only be equal to 90 or 270
                if (_this.depth3D > 0) {
                    if (startAngle >= 270) {
                        startAngle = 270;
                    } else {
                        startAngle = 90;
                    }
                }

                var yRadius = radius - radius * _this.angle / 90;
                var _count = 0;
                for (var i = 0; i < chartData.length; i++) {
                    if (chartData[i].hidden != true) {
                        _count++;
                    }
                }
                if (_count <= 0) {
                    _count = 1;
                }
                var tPercents = (1 / _count) * 100;
                var _isNoData;
                for (var i = 0; i < chartData.length; i++) {
                    var dItem = chartData[i];
                    _isNoData = dItem["_isNoData"];
                    if (!_isNoData) {
                        tPercents = dItem.percents;
                    }
                    if (dItem.hidden != true && (dItem.percents > 0 || _isNoData)) {
                        // SLICE
                        var arc = -tPercents * 360 / 100;
                        var ix = Math.cos((startAngle + arc / 2) / 180 * Math.PI);
                        var iy = Math.sin((-startAngle - arc / 2) / 180 * Math.PI) * (yRadius / radius);

                        var wattr = {
                            'fill': dItem.color,
                            'stroke': _this.outlineColor,
                            'stroke-width': _this.outlineThickness,
                            'stroke-opacity': _this.outlineAlpha
                        };

                        if (dItem.url) {
                            wattr.cursor = 'pointer';
                        }

                        var xx = pieX;
                        var yy = pieY;
                        if (_isNoData) {
                            yy += 0.5;
                        }
                        var wedge = AmCharts.wedge(container, xx, yy, startAngle, arc, radius, yRadius, innerRadius, _this.depth3D, wattr, _this.gradientRatio);
                        _this.addEventListeners(wedge, dItem);

                        dItem.startAngle = startAngle;
                        chartData[i].wedge = wedge;
                        if (startDuration > 0) {
                            var opacity = _this.startAlpha;
                            if (_this.chartCreated) {
                                opacity = dItem.alpha;
                            }
                            wedge.setAttr('opacity', opacity);
                        }

                        // x and y vectors
                        dItem.ix = ix;
                        dItem.iy = iy;
                        dItem.wedge = wedge;
                        dItem.index = i;

                        // LABEL ////////////////////////////////////////////////////////
                        if (_this.labelsEnabled && _this.labelText && tPercents >= _this.hideLabelsPercent) {
                            var labelAngle = startAngle + arc / 2;
                            if (labelAngle <= 0) {
                                labelAngle = labelAngle + 360;
                            }

                            var tx = pieX + ix * (radius + labelRadius);
                            var ty = pieY + iy * (radius + labelRadius);

                            var align;
                            var tickL = 0;
                            if (labelRadius >= 0) {
                                var labelQuarter;

                                //q0
                                if (labelAngle <= 90 && labelAngle >= 0) {
                                    labelQuarter = 0;
                                    align = "start";
                                    tickL = 8;
                                }
                                //q1
                                else if (labelAngle <= 360 && labelAngle > 270) {
                                    labelQuarter = 1;
                                    align = "start";
                                    tickL = 8;
                                }
                                //q2
                                else if (labelAngle <= 270 && labelAngle > 180) {
                                    labelQuarter = 2;
                                    align = "end";
                                    tickL = -8;
                                }
                                //q3
                                else if ((labelAngle <= 180 && labelAngle > 90)) {
                                    labelQuarter = 3;
                                    align = "end";
                                    tickL = -8;
                                }

                                dItem.labelQuarter = labelQuarter;
                            } else {
                                align = "middle";
                            }

                            var text = _this.formatString(_this.labelText, dItem);


                            var txt = AmCharts.text(container, text, _this.color, _this.fontFamily, _this.fontSize, align);
                            txt.translate(tx + tickL * 1.5, ty);
                            dItem.tx = tx + tickL * 1.5;
                            dItem.ty = ty;

                            var t = setTimeout(function() {
                                _this.showLabels.call(_this)
                            }, startDuration * 1000);
                            _this.timeOuts.push(t);
                            if (_this.labelRadius >= 0) {
                                wedge.push(txt);
                            } else {
                                _this.freeLabelsSet.push(txt);
                            }
                            dItem.label = txt;
                            _this.chartDataLabels[i] = txt;
                            dItem.tx = tx;
                            dItem.tx2 = tx + tickL;
                        }

                        _this.graphsSet.push(wedge);

                        if (dItem.alpha == 0 || (startDuration > 0 && !_this.chartCreated)) {
                            wedge.hide();
                        }

                        // get start angle of next slice
                        startAngle -= tPercents * 360 / 100;
                        if (startAngle <= 0) {
                            startAngle = startAngle + 360;
                        }
                    }
                }

                if (labelRadius > 0) {
                    _this.arrangeLabels();
                }

                _this.pieXReal = pieX;
                _this.pieYReal = pieY;
                _this.radiusReal = radius;
                _this.innerRadiusReal = innerRadius;

                if (labelRadius > 0) {
                    _this.drawTicks();
                }
                var _this = this;
                if (_this.chartCreated) {
                    _this.pullSlices(true);
                } else {
                    var t = setTimeout(function() {
                        _this.pullSlices.call(_this)
                    }, startDuration * 1200);
                    _this.timeOuts.push(t);
                }
                if (!_this.chartCreated) {
                    _this.startSlices();
                }
                _this.setDepths();
            }
        } else {
            _this.cleanChart();
        }
        _this.chartCreated = true;
        _this.dispDUpd();
    },


    setDepths: function() {
        var chartData = this.chartData;

        for (var i = 0; i < chartData.length; i++) {
            var dItem = chartData[i];
            var wedge = dItem.wedge;
            var startAngle = dItem.startAngle;
            // find quarter
            //q0 || q1
            if ((startAngle <= 90 && startAngle >= 0) || (startAngle <= 360 && startAngle > 270)) {
                wedge.toFront();
            }
            //q2 || q3
            else if ((startAngle <= 270 && startAngle > 180) || (startAngle <= 180 && startAngle > 90)) {
                wedge.toBack();
            }
        }
    },

    addEventListeners: function(wedge, dItem) {
        var _this = this;

        wedge.mouseover(function() {
            _this.rollOverSlice(dItem, true);
        }).mouseout(function() {
            _this.rollOutSlice(dItem);
        }).click(function() {
            _this.clickSlice(dItem);
        });
    },


    formatString: function(text, dItem) {
        var _this = this;

        text = AmCharts.formatValue(text, dItem, ["value"], _this.numberFormatter, "", _this.usePrefixes, _this.prefixesOfSmallNumbers, _this.prefixesOfBigNumbers);
        text = AmCharts.formatValue(text, dItem, ["percents"], _this.percentFormatter);
        text = AmCharts.massReplace(text, {
            "[[title]]": dItem.title,
            "[[description]]": dItem.description,
            "<br>": "\n"
        });

        text = AmCharts.fixNewLines(text);
        text = AmCharts.cleanFromEmpty(text);

        return text;
    },

    drawTicks: function() {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < chartData.length; i++) {
            var label = _this.chartDataLabels[i];
            if (label) {
                var dItem = chartData[i];
                var ix = dItem.ix;
                var iy = dItem.iy;
                var x = dItem.tx;
                var x2 = dItem.tx2;
                var y = dItem.ty;
                var radiusReal = _this.radiusReal;

                var tick = AmCharts.line(_this.container, [_this.pieXReal + ix * radiusReal, x, x2], [_this.pieYReal + iy * radiusReal, y, y], _this.labelTickColor, _this.labelTickAlpha);
                dItem.wedge.push(tick);
                _this.ticks[i] = tick;
            }
        }
    },

    arrangeLabels: function() {
        var _this = this;
        var chartData = _this.chartData;
        var count = chartData.length;
        var dItem;

        // q0
        for (var i = count - 1; i >= 0; i--) {
            dItem = chartData[i];
            if (dItem.labelQuarter == 0 && !dItem.hidden) {
                _this.checkOverlapping(i, dItem, 0, true, 0);
            }
        }
        // q1
        for (i = 0; i < count; i++) {
            dItem = chartData[i];
            if (dItem.labelQuarter == 1 && !dItem.hidden) {
                _this.checkOverlapping(i, dItem, 1, false, 0);
            }
        }
        // q2
        for (i = count - 1; i >= 0; i--) {
            dItem = chartData[i];
            if (dItem.labelQuarter == 2 && !dItem.hidden) {
                _this.checkOverlapping(i, dItem, 2, true, 0);
            }
        }
        // q3
        for (i = 0; i < count; i++) {
            dItem = chartData[i];

            if (dItem.labelQuarter == 3 && !dItem.hidden) {
                _this.checkOverlapping(i, dItem, 3, false, 0);
            }
        }
    },

    checkOverlapping: function(index, dItem, quarter, backwards, count) {
        var _this = this;
        var overlapping;
        var i;
        var chartData = _this.chartData;
        var length = chartData.length;
        var label = dItem.label;

        if (label) {
            if (backwards == true) {
                for (i = index + 1; i < length; i++) {
                    overlapping = _this.checkOverlappingReal(dItem, chartData[i], quarter);
                    if (overlapping) {
                        i = length;
                    }
                }
            } else {
                for (i = index - 1; i >= 0; i--) {
                    overlapping = _this.checkOverlappingReal(dItem, chartData[i], quarter);
                    if (overlapping) {
                        i = 0;
                    }
                }
            }

            if (overlapping == true && count < 100) {
                var newY = dItem.ty + (dItem.iy * 3);
                dItem.ty = newY;
                label.translate(dItem.tx2, newY);
                _this.checkOverlapping(index, dItem, quarter, backwards, count + 1);
            }
        }
    },

    checkOverlappingReal: function(dItem1, dItem2, quarter) {
        var overlapping = false;
        var label1 = dItem1.label;
        var label2 = dItem2.label;

        if (dItem1.labelQuarter == quarter && !dItem1.hidden && !dItem2.hidden && label2) {
            var bb1 = label1.getBBox();

            var bbox1 = {};
            bbox1.width = bb1.width;
            bbox1.height = bb1.height;
            bbox1.y = dItem1.ty;
            bbox1.x = dItem1.tx;


            var bb2 = label2.getBBox();
            var bbox2 = {};
            bbox2.width = bb2.width;
            bbox2.height = bb2.height;
            bbox2.y = dItem2.ty;
            bbox2.x = dItem2.tx;

            if (AmCharts.hitTest(bbox1, bbox2)) {
                overlapping = true;
            }
        }
        return overlapping;
    },

    startSlices: function() {
        var _this = this;
        var interval = _this.startDuration / _this.chartData.length * 500;
        for (var i = 0; i < _this.chartData.length; i++) {
            if (_this.startDuration > 0 && _this.sequencedAnimation) {
                var t = setTimeout(function() {
                    _this.startSequenced.call(_this)
                }, interval * i);
                _this.timeOuts.push(t);
            } else {
                _this.startSlice(_this.chartData[i]);
            }
        }
    },

    pullSlices: function(instant) {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < chartData.length; i++) {
            var slice = chartData[i];
            if (slice.pulled) {
                _this.pullSlice(slice, 1, instant);
            }
        }
    },

    startSequenced: function() {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < chartData.length; i++) {
            if (!chartData[i].started) {
                var dItem = _this.chartData[i];
                _this.startSlice(dItem);
                break;
            }
        }
    },

    startSlice: function(dItem) {
        var _this = this;
        dItem.started = true;
        var w = dItem.wedge;
        var startDuration = _this.startDuration;
        if (w && startDuration > 0) {
            if (dItem.alpha > 0) {
                w.show();
            }
            var r = AmCharts.toCoordinate(_this.startRadius, _this.radiusReal);
            w.translate(Math.round(dItem.ix * r), Math.round(dItem.iy * r));
            w.animate({
                'opacity': dItem.alpha,
                translate: '0,0'
            }, startDuration, _this.startEffect);
        }
    },


    showLabels: function() {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < chartData.length; i++) {
            var dItem = chartData[i];
            if (dItem.alpha > 0) {
                var label = _this.chartDataLabels[i];
                if (label) {
                    label.show();
                }
                var tick = _this.ticks[i];
                if (tick) {
                    tick.show();
                }
            }
        }
    },

    showSlice: function(dItem) {
        var _this = this;
        if (isNaN(dItem)) {
            dItem.hidden = false;
        } else {
            _this.chartData[dItem].hidden = false;
        }
        _this.hideBalloon();
        _this.invalidateVisibility();
    },

    hideSlice: function(dItem) {
        var _this = this;
        if (isNaN(dItem)) {
            dItem.hidden = true;
        } else {
            _this.chartData[dItem].hidden = true;
        }
        _this.hideBalloon();
        _this.invalidateVisibility();
    },

    rollOverSlice: function(dItem, follow) {
        var _this = this;
        if (!isNaN(dItem)) {
            dItem = _this.chartData[dItem];
        }

        clearTimeout(_this.hoverInt);

        if (_this.pullOnHover) {
            _this.pullSlice(dItem, 1);
        }

        var rad = _this.innerRadiusReal + (_this.radiusReal - _this.innerRadiusReal) / 2;

        if (dItem.pulled) {
            rad += _this.pullOutRadiusReal;
        }

        if (_this.hoverAlpha < 1) {
            var wedge = dItem.wedge;
            if (wedge) {
                dItem.wedge.attr({
                    'opacity': _this.hoverAlpha
                })
            }
        }

        var x;
        var y;

        var x = dItem.ix * rad + _this.pieXReal;
        var y = dItem.iy * rad + _this.pieYReal;

        var text = _this.formatString(_this.balloonText, dItem);
        var color = AmCharts.adjustLuminosity(dItem.color, -0.15)

        _this.showBalloon(text, color, follow, x, y);

        var evt = {
            type: 'rollOverSlice',
            dataItem: dItem,
            chart: _this
        };
        _this.fire(evt.type, evt);
    },

    rollOutSlice: function(dItem) {
        var _this = this;
        if (!isNaN(dItem)) {
            dItem = _this.chartData[dItem];
        }
        var wedge = dItem.wedge;
        if (wedge) {
            dItem.wedge.attr({
                'opacity': dItem.alpha
            });
        }

        _this.hideBalloon();
        var evt = {
            type: 'rollOutSlice',
            dataItem: dItem,
            chart: _this
        };
        _this.fire(evt.type, evt);
    },

    clickSlice: function(dItem) {
        var _this = this;
        if (!isNaN(dItem)) {
            dItem = _this.chartData[dItem];
        }

        _this.hideBalloon();
        if (dItem.pulled) {
            _this.pullSlice(dItem, 0);
        } else {
            _this.pullSlice(dItem, 1);
        }

        AmCharts.getURL(dItem.url, _this.urlTarget);

        var evt = {
            type: 'clickSlice',
            dataItem: dItem,
            chart: _this
        };
        _this.fire(evt.type, evt);
    },

    pullSlice: function(dItem, dir, instant) {
        var _this = this;
        var iix = dItem.ix;
        var iiy = dItem.iy;
        var duration = _this.pullOutDuration;
        if (instant === true) {
            duration = 0;
        }
        var wedge = dItem.wedge;

        var radius = _this.pullOutRadiusReal;
        if (wedge) {
            wedge.animate({
                'translate': (dir * iix * radius) + ',' + (dir * iiy * radius)
            }, duration, _this.pullOutEffect);
        }

        var evt;
        if (dir == 1) {
            dItem.pulled = true;
            if (_this.pullOutOnlyOne) {
                _this.pullInAll(dItem.index);
            }

            evt = {
                type: 'pullOutSlice',
                dataItem: dItem,
                chart: _this
            };
        } else {
            dItem.pulled = false;
            evt = {
                type: 'pullInSlice',
                dataItem: dItem,
                chart: _this
            };
        }
        _this.fire(evt.type, evt);
    },

    pullInAll: function(except) {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < _this.chartData.length; i++) {
            if (i != except) {
                if (chartData[i].pulled) {
                    _this.pullSlice(chartData[i], 0);
                }
            }
        }
    },

    pullOutAll: function(scale) {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = 0; i < chartData.length; i++) {
            if (!chartData[i].pulled) {
                _this.pullSlice(chartData[i], 1);
            }
        }
    },

    parseData: function() {
        var _this = this;
        var chartData = [];
        _this.chartData = chartData;

        var dp = _this.dataProvider;

        if (dp != undefined) {
            var sliceCount = dp.length;

            var sum = 0;

            // caluclate sum
            for (var i = 0; i < sliceCount; i++) {
                var dataItem = {};
                var dataSource = dp[i];
                dataItem.dataContext = dataSource;

                dataItem.value = Number(dataSource[_this.valueField]);

                var title = dataSource[_this.titleField];
                if (!title) {
                    title = "";
                }
                dataItem.title = title;

                dataItem.pulled = AmCharts.toBoolean(dataSource[_this.pulledField], false);

                var description = dataSource[_this.descriptionField];
                if (!description) {
                    description = "";
                }
                dataItem.description = description;

                dataItem.url = dataSource[_this.urlField];

                dataItem.visibleInLegend = AmCharts.toBoolean(dataSource[_this.visibleInLegendField], true);

                var alpha = dataSource[_this.alphaField];
                if (alpha != undefined) {
                    dataItem.alpha = Number(alpha);
                } else {
                    dataItem.alpha = _this.pieAlpha;
                }

                var color = dataSource[_this.colorField];
                if (color != undefined) {
                    dataItem.color = AmCharts.toColor(color);
                }

                sum += dataItem.value;

                dataItem.hidden = false;

                chartData[i] = dataItem;
            }

            // calculate percents
            var groupCount = 0;

            for (var i = 0; i < sliceCount; i++) {
                var dataItem = chartData[i];
                dataItem.percents = dataItem.value / sum * 100;

                if (dataItem.percents < _this.groupPercent) {
                    groupCount++;
                }
            }

            // group to others slice
            if (groupCount > 1) {
                _this.groupValue = 0;
                _this.removeSmallSlices();

                var value = _this.groupValue;
                var percents = _this.groupValue / sum * 100;
                chartData.push({
                    title: _this.groupedTitle,
                    value: value,
                    percents: percents,
                    pulled: _this.groupedPulled,
                    color: _this.groupedColor,
                    url: _this.groupedUrl,
                    description: _this.groupedDescription,
                    alpha: _this.groupedAlpha
                });
            }

            // now set colors
            for (var i = 0; i < chartData.length; i++) {
                var color;
                if (_this.pieBaseColor) {
                    color = AmCharts.adjustLuminosity(_this.pieBaseColor, i * _this.pieBrightnessStep / 100);
                } else {
                    color = _this.colors[i];
                    if (color == undefined) {
                        color = AmCharts.randomColor();
                    }
                }
                if (chartData[i].color == undefined) {
                    chartData[i].color = color;
                }
            }

            _this.recalculatePercents();
        }
    },


    recalculatePercents: function() {
        var _this = this;
        var chartData = _this.chartData;
        var sum = 0;

        for (var i = 0; i < chartData.length; i++) {
            var dItem = chartData[i];
            if (!dItem.hidden && dItem.value > 0) {
                sum += dItem.value;
            }
        }
        for (i = 0; i < chartData.length; i++) {
            dItem = _this.chartData[i];
            if (!dItem.hidden && dItem.value > 0) {
                dItem.percents = dItem.value * 100 / sum;
            } else {
                dItem.percents = 0;
            }
        }
    },


    // remove slices which are less then __config.group.percent
    removeSmallSlices: function() {
        var _this = this;
        var chartData = _this.chartData;
        for (var i = chartData.length - 1; i >= 0; i--) {
            if (chartData[i].percents < _this.groupPercent) {
                _this.groupValue += chartData[i].value;
                chartData.splice(i, 1);
            }
        }
    },


    animateAgain: function() {
        var _this = this;
        _this.startSlices();
        var t = setTimeout(function() {
            _this.pullSlices.call(_this)
        }, _this.startDuration * 1200);
        _this.timeOuts.push(t);
    },

    measureMaxLabel: function() {
        var _this = this;
        var chartData = _this.chartData;
        var maxWidth = 0;
        for (var i = 0; i < chartData.length; i++) {
            var dItem = chartData[i];
            var text = _this.formatString(_this.labelText, dItem);
            var txt = AmCharts.text(_this.container, text, _this.color, _this.fontFamily, _this.fontSize);
            var w = txt.getBBox().width;
            if (w > maxWidth) {
                maxWidth = w;
            }
            txt.remove();
        }
        return maxWidth;
    }
});;
AmCharts.AmXYChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,

    construct: function() {
        var _this = this;
        AmCharts.AmXYChart.base.construct.call(_this);

        _this.createEvents('zoomed');
        _this.xAxes;
        _this.yAxes;
        _this.scrollbarV;
        _this.scrollbarH;
        _this.maxZoomFactor = 20;
        _this.chartType = "xy";
        _this.hideXScrollbar;
        _this.hideYScrollbar;
    },

    initChart: function() {
        var _this = this;
        AmCharts.AmXYChart.base.initChart.call(_this);
        if (_this.dataChanged) {
            _this.updateData();
            _this.dataChanged = false;
            _this.dispatchDataUpdated = true;
        }
        _this.updateScrollbar = true;
        _this.drawChart();

        if (_this.autoMargins && !_this.marginsUpdated) {
            _this.marginsUpdated = true;
            _this.measureMargins();
        }

        var marginLeftReal = _this.marginLeftReal;
        var marginTopReal = _this.marginTopReal;
        var plotAreaWidth = _this.plotAreaWidth;
        var plotAreaHeight = _this.plotAreaHeight;

        _this.graphsSet.clipRect(marginLeftReal, marginTopReal, plotAreaWidth, plotAreaHeight);
        _this.bulletSet.clipRect(marginLeftReal, marginTopReal, plotAreaWidth, plotAreaHeight);
        _this.trendLinesSet.clipRect(marginLeftReal, marginTopReal, plotAreaWidth, plotAreaHeight);
    },


    createValueAxes: function() {
        var _this = this;
        var xAxes = new Array();
        var yAxes = new Array();
        _this.xAxes = xAxes;
        _this.yAxes = yAxes;

        // sort axes
        var valueAxes = _this.valueAxes;

        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];
            var position = valueAxis.position;

            if (position == "top" || position == "bottom") {
                valueAxis.rotate = true;
            }

            valueAxis.setOrientation(valueAxis.rotate);

            var orientation = valueAxis.orientation;
            if (orientation == "V") {
                yAxes.push(valueAxis);
            }

            if (orientation == "H") {
                xAxes.push(valueAxis);
            }
        }
        // create one vertical and horizontal value axis if not found any
        if (yAxes.length == 0) {
            valueAxis = new AmCharts.ValueAxis();
            valueAxis.rotate = false;
            valueAxis.setOrientation(false);
            valueAxes.push(valueAxis);
            yAxes.push(valueAxis);
        }

        if (xAxes.length == 0) {
            valueAxis = new AmCharts.ValueAxis();
            valueAxis.rotate = true;
            valueAxis.setOrientation(true);
            valueAxes.push(valueAxis);
            xAxes.push(valueAxis);
        }

        for (i = 0; i < valueAxes.length; i++) {
            _this.processValueAxis(valueAxes[i], i);
        }

        var graphs = _this.graphs;
        for (i = 0; i < graphs.length; i++) {
            _this.processGraph(graphs[i], i);
        }
    },

    drawChart: function() {
        var _this = this;
        AmCharts.AmXYChart.base.drawChart.call(_this);

        var chartData = _this.chartData;

        if (AmCharts.ifArray(chartData)) {
            if (_this.chartScrollbar) {
                _this.updateScrollbars();
            }

            _this.zoomChart();
        } else {
            _this.cleanChart();
        }

        if (_this.hideXScrollbar) {
            var scrollbarH = _this.scrollbarH;
            if (scrollbarH) {
                _this.removeListener(scrollbarH, "zoomed", _this.handleHSBZoom);
                scrollbarH.destroy();
            }
            _this.scrollbarH = null;
        }


        if (_this.hideYScrollbar) {
            var scrollbarV = _this.scrollbarV;
            if (scrollbarV) {
                _this.removeListener(scrollbarV, "zoomed", _this.handleVSBZoom);
                scrollbarV.destroy();
            }
            _this.scrollbarV = null;
        }

        _this.dispDUpd();
        _this.chartCreated = true;
        _this.zoomScrollbars();
    },

    cleanChart: function() {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.valueAxes, _this.graphs, _this.scrollbarV, _this.scrollbarH, _this.chartCursor]);
    },

    zoomChart: function() {
        var _this = this;
        _this.toggleZoomOutButton();
        _this.zoomObjects(_this.valueAxes);
        _this.zoomObjects(_this.graphs);
        _this.zoomTrendLines();
        _this.dispatchAxisZoom();
    },

    toggleZoomOutButton: function() {
        var _this = this;
        if (_this.heightMultiplier == 1 && _this.widthMultiplier == 1) {
            _this.showZB(false);
        } else {
            _this.showZB(true);
        }
    },

    dispatchAxisZoom: function() {
        var _this = this;
        var valueAxes = _this.valueAxes;

        for (var i = 0; i < valueAxes.length; i++) {
            var valueAxis = valueAxes[i];

            if (!isNaN(valueAxis.min) && !isNaN(valueAxis.max)) {
                var startValue;
                var endValue;

                if (valueAxis.orientation == "V") {
                    startValue = valueAxis.coordinateToValue(-_this.verticalPosition);
                    endValue = valueAxis.coordinateToValue(-_this.verticalPosition + _this.plotAreaHeight);
                } else {
                    startValue = valueAxis.coordinateToValue(-_this.horizontalPosition);
                    endValue = valueAxis.coordinateToValue(-_this.horizontalPosition + _this.plotAreaWidth);
                }

                if (!isNaN(startValue) && !isNaN(endValue)) {
                    if (startValue > endValue) {
                        var temp = endValue;
                        endValue = startValue;
                        startValue = temp;
                    }

                    valueAxis.dispatchZoomEvent(startValue, endValue);
                }
            }
        }
    },

    zoomObjects: function(objects) {
        var _this = this;
        var count = objects.length;

        for (var i = 0; i < count; i++) {
            var obj = objects[i];
            _this.updateObjectSize(obj);
            obj.zoom(0, _this.chartData.length - 1);
        }
    },

    updateData: function() {
        var _this = this;
        _this.parseData();
        var chartData = _this.chartData;
        var lastIndex = chartData.length - 1;
        var graphs = _this.graphs;
        var dataProvider = _this.dataProvider;

        var maxValue = 0;
        for (var i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.data = chartData;
            graph.zoom(0, lastIndex);

            var valueField = graph.valueField;

            if (valueField) {
                for (var j = 0; j < dataProvider.length; j++) {
                    var value = dataProvider[j][valueField];
                    if (value > maxValue) {
                        maxValue = value;
                    }
                }
            }
        }

        for (i = 0; i < graphs.length; i++) {
            var graph = graphs[i];
            graph.maxValue = maxValue;
        }


        var chartCursor = _this.chartCursor;
        if (chartCursor) {
            chartCursor.updateData();
            chartCursor.type = "crosshair";
            chartCursor.valueBalloonsEnabled = false;
        }
    },


    zoomOut: function() {
        var _this = this;
        _this.horizontalPosition = 0;
        _this.verticalPosition = 0;
        _this.widthMultiplier = 1;
        _this.heightMultiplier = 1;

        _this.zoomChart();
        _this.zoomScrollbars();
    },


    processValueAxis: function(valueAxis) {
        var _this = this;
        valueAxis.chart = this;

        if (valueAxis.orientation == "H") {
            valueAxis.minMaxField = "x";
        } else {
            valueAxis.minMaxField = "y";
        }

        valueAxis.minTemp = NaN;
        valueAxis.maxTemp = NaN;

        _this.listenTo(valueAxis, "axisSelfZoomed", _this.handleAxisSelfZoom);
    },

    processGraph: function(graph) {
        var _this = this;
        if (!graph.xAxis) {
            graph.xAxis = _this.xAxes[0];
        }
        if (!graph.yAxis) {
            graph.yAxis = _this.yAxes[0];
        }
    },


    parseData: function() {
        var _this = this;
        AmCharts.AmXYChart.base.parseData.call(_this);

        _this.chartData = [];
        var dataProvider = _this.dataProvider;
        var valueAxes = _this.valueAxes;
        var graphs = _this.graphs;

        for (var i = 0; i < dataProvider.length; i++) {
            var serialDataItem = {};
            serialDataItem.axes = {};
            serialDataItem.x = {};
            serialDataItem.y = {};

            var dataItemRaw = dataProvider[i];

            for (var j = 0; j < valueAxes.length; j++) {
                // axis
                var axisId = valueAxes[j].id;

                serialDataItem.axes[axisId] = {};
                serialDataItem.axes[axisId].graphs = {};

                for (var k = 0; k < graphs.length; k++) {
                    var graph = graphs[k];
                    var graphId = graph.id;

                    if (graph.xAxis.id == axisId || graph.yAxis.id == axisId) {
                        var graphDataItem = {};
                        graphDataItem.serialDataItem = serialDataItem;
                        graphDataItem.index = i;

                        var values = {};

                        var val = Number(dataItemRaw[graph.valueField]);
                        if (!isNaN(val)) {
                            values.value = val;
                        }
                        var val = Number(dataItemRaw[graph.xField]);
                        if (!isNaN(val)) {
                            values.x = val;
                        }
                        var val = Number(dataItemRaw[graph.yField]);
                        if (!isNaN(val)) {
                            values.y = val;
                        }

                        graphDataItem.values = values;

                        _this.processFields(graph, graphDataItem, dataItemRaw);

                        graphDataItem.serialDataItem = serialDataItem;
                        graphDataItem.graph = graph;

                        serialDataItem.axes[axisId].graphs[graphId] = graphDataItem;
                    }
                }
            }
            _this.chartData[i] = serialDataItem;
        }
    },


    formatString: function(text, dItem) {
        var _this = this;
        var graph = dItem.graph;
        var numberFormatter = graph.numberFormatter;
        if (!numberFormatter) {
            numberFormatter = _this.numberFormatter;
        }

        var keys = ["value", "x", "y"];
        text = AmCharts.formatValue(text, dItem.values, keys, numberFormatter);

        if (text.indexOf("[[") != -1) {
            text = AmCharts.formatDataContextValue(text, dItem.dataContext);
        }

        text = AmCharts.AmSerialChart.base.formatString.call(_this, text, dItem);
        return text;
    },

    addChartScrollbar: function(chartScrollbar) {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.chartScrollbar, _this.scrollbarH, _this.scrollbarV]);

        if (chartScrollbar) {
            _this.chartScrollbar = chartScrollbar;
            _this.scrollbarHeight = chartScrollbar.scrollbarHeight;

            var properties = ["backgroundColor",
                "backgroundAlpha",
                "selectedBackgroundColor",
                "selectedBackgroundAlpha",
                "scrollDuration",
                "resizeEnabled",
                "hideResizeGrips",
                "scrollbarHeight",
                "updateOnReleaseOnly"];

            if (!_this.hideYScrollbar) {
                var scrollbarV = new AmCharts.SimpleChartScrollbar();
                scrollbarV.skipEvent = true;
                scrollbarV.chart = this;
                _this.listenTo(scrollbarV, "zoomed", _this.handleVSBZoom);
                AmCharts.copyProperties(chartScrollbar, scrollbarV, properties);
                scrollbarV.rotate = true;
                _this.scrollbarV = scrollbarV;
            }

            if (!_this.hideXScrollbar) {
                var scrollbarH = new AmCharts.SimpleChartScrollbar();
                scrollbarH.skipEvent = true;
                scrollbarH.chart = this;
                _this.listenTo(scrollbarH, "zoomed", _this.handleHSBZoom);
                AmCharts.copyProperties(chartScrollbar, scrollbarH, properties);
                scrollbarH.rotate = false;
                _this.scrollbarH = scrollbarH;
            }
        }
    },


    updateTrendLines: function() {
        var _this = this;
        var trendLines = _this.trendLines;

        for (var i = 0; i < trendLines.length; i++) {
            var trendLine = trendLines[i];
            trendLine.chart = this;

            if (!trendLine.valueAxis) {
                trendLine.valueAxis = _this.yAxes[0];
            }
            if (!trendLine.valueAxisX) {
                trendLine.valueAxisX = _this.xAxes[0];
            }
        }
    },


    updateMargins: function() {
        var _this = this;
        AmCharts.AmXYChart.base.updateMargins.call(_this);

        var scrollbarV = _this.scrollbarV;
        if (scrollbarV) {
            _this.getScrollbarPosition(scrollbarV, true, _this.yAxes[0].position);
            _this.adjustMargins(scrollbarV, true);
        }

        var scrollbarH = _this.scrollbarH;
        if (scrollbarH) {
            _this.getScrollbarPosition(scrollbarH, false, _this.xAxes[0].position);
            _this.adjustMargins(scrollbarH, false);
        }
    },

    updateScrollbars: function() {
        var _this = this;
        var scrollbarV = _this.scrollbarV;
        if (scrollbarV) {
            _this.updateChartScrollbar(scrollbarV, true);
            scrollbarV.draw();
        }
        var scrollbarH = _this.scrollbarH;
        if (scrollbarH) {
            _this.updateChartScrollbar(scrollbarH, false);
            scrollbarH.draw();
        }
    },

    zoomScrollbars: function() {
        var _this = this;
        var scrollbarH = _this.scrollbarH;
        if (scrollbarH) {
            scrollbarH.relativeZoom(_this.widthMultiplier, -_this.horizontalPosition / _this.widthMultiplier);
        }

        var scrollbarV = _this.scrollbarV;
        if (scrollbarV) {
            scrollbarV.relativeZoom(_this.heightMultiplier, -_this.verticalPosition / _this.heightMultiplier);
        }
    },


    fitMultiplier: function(multiplier) {
        var _this = this;
        if (multiplier > _this.maxZoomFactor) {
            multiplier = _this.maxZoomFactor;
        }
        return multiplier;
    },

    handleHSBZoom: function(event) {
        var _this = this;
        var widthMultiplier = _this.fitMultiplier(event.multiplier);
        var horizontalPosition = -event.position * widthMultiplier;
        var horizontalMax = -(_this.plotAreaWidth * widthMultiplier - _this.plotAreaWidth);

        if (horizontalPosition < horizontalMax) {
            horizontalPosition = horizontalMax;
        }

        _this.widthMultiplier = widthMultiplier;
        _this.horizontalPosition = horizontalPosition;

        _this.zoomChart();
    },

    handleVSBZoom: function(event) {
        var _this = this;
        var heightMultiplier = _this.fitMultiplier(event.multiplier);
        var verticalPosition = -event.position * heightMultiplier;
        var verticalMax = -(_this.plotAreaHeight * heightMultiplier - _this.plotAreaHeight);

        if (verticalPosition < verticalMax) {
            verticalPosition = verticalMax;
        }
        _this.heightMultiplier = heightMultiplier;
        _this.verticalPosition = verticalPosition;

        _this.zoomChart();
    },

    handleCursorZoom: function(event) {
        var _this = this;
        var widthMultiplier = (_this.widthMultiplier * _this.plotAreaWidth) / event.selectionWidth;
        var heightMultiplier = (_this.heightMultiplier * _this.plotAreaHeight) / event.selectionHeight;

        widthMultiplier = _this.fitMultiplier(widthMultiplier);
        heightMultiplier = _this.fitMultiplier(heightMultiplier);

        _this.horizontalPosition = (_this.horizontalPosition - event.selectionX) * widthMultiplier / _this.widthMultiplier;
        _this.verticalPosition = (_this.verticalPosition - event.selectionY) * heightMultiplier / _this.heightMultiplier;

        _this.widthMultiplier = widthMultiplier;
        _this.heightMultiplier = heightMultiplier;

        _this.zoomChart();
        _this.zoomScrollbars();
    },

    handleAxisSelfZoom: function(event) {
        var _this = this;
        var valueAxis = event.valueAxis;

        if (valueAxis.orientation == "H") {
            var widthMultiplier = _this.fitMultiplier(event.multiplier);
            var horizontalPosition = -event.position / _this.widthMultiplier * widthMultiplier;
            var horizontalMax = -(_this.plotAreaWidth * widthMultiplier - _this.plotAreaWidth);

            if (horizontalPosition < horizontalMax) {
                horizontalPosition = horizontalMax;
            }
            _this.horizontalPosition = horizontalPosition;
            _this.widthMultiplier = widthMultiplier;
            _this.zoomChart();
        } else {
            var heightMultiplier = _this.fitMultiplier(event.multiplier);

            var verticalPosition = -event.position / _this.heightMultiplier * heightMultiplier;

            var verticalMax = -(_this.plotAreaHeight * heightMultiplier - _this.plotAreaHeight);

            if (verticalPosition < verticalMax) {
                verticalPosition = verticalMax;
            }
            _this.verticalPosition = verticalPosition;
            _this.heightMultiplier = heightMultiplier;
            _this.zoomChart();
        }

        _this.zoomScrollbars();
    },


    removeChartScrollbar: function() {
        var _this = this;
        AmCharts.callMethod("destroy", [_this.scrollbarH, _this.scrollbarV]);
        _this.scrollbarH = null;
        _this.scrollbarV = null;
    },

    handleReleaseOutside: function(e) {
        var _this = this;
        AmCharts.AmXYChart.base.handleReleaseOutside.call(_this, e);
        AmCharts.callMethod("handleReleaseOutside", [_this.scrollbarH, _this.scrollbarV]);
    }
});;
AmCharts.AmDraw = AmCharts.Class({
    construct: function(div, w, h) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = 'http://www.w3.org/1999/xlink';
        AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, 'svg').createSVGRect;

        if (w < 1) {
            w = 10;
        }

        if (h < 1) {
            h = 10;
        }

        var _this = this;
        _this.div = div;
        _this.width = w;
        _this.height = h;
        _this.rBin = document.createElement("div");

        if (AmCharts.hasSVG) {
            AmCharts.SVG = true;
            var svg = _this.createSvgElement("svg");
            svg.style.position = "absolute";
            svg.style.width = w + "px";
            svg.style.height = h + "px";
            svg.setAttribute("version", "1.1");
            div.appendChild(svg);

            _this.container = svg;
            _this.R = new AmCharts.SVGRenderer(_this);
        } else if (AmCharts.isIE) {
            if (AmCharts.VMLRenderer) {
                AmCharts.VML = true;
                if (!AmCharts.vmlStyleSheet) {
                    document.namespaces.add('amvml', 'urn:schemas-microsoft-com:vml');
                    var ss = document.createStyleSheet();
                    var rule = "behavior:url(#default#VML); display:inline-block; antialias:true";
                    ss.addRule(".amvml", rule);
                    AmCharts.vmlStyleSheet = ss;
                }

                _this.container = div;
                _this.R = new AmCharts.VMLRenderer(_this);
                _this.R.disableSelection(div);
            }
        }
    },

    initTexturePatterns: function(textureMap) {
        this.R.initTexturePatterns(this.container, textureMap);
    },
    /**
     * 添加shadow属性，为图添加阴影效果
     */
    shadow: function() {
        this.R.shadow(this.container);
    },
    //======= add end ====================
    createSvgElement: function(name) {
        return document.createElementNS(AmCharts.SVG_NS, name);
    },

    circle: function(x, y, r, container) {
        var _this = this;

        var c = new AmCharts.AmDObject("circle", _this);
        c.attr({
            r: r,
            cx: x,
            cy: y
        });

        _this.addToContainer(c.node, container);

        return c;
    },

    setSize: function(w, h) {
        if (w > 0 && h > 0) {
            this.container.style.width = w + "px";
            this.container.style.height = h + "px";
        }
    },

    rect: function(x, y, w, h, cr, bw, container) {
        var _this = this;

        var r = new AmCharts.AmDObject("rect", _this);

        if (AmCharts.VML) {
            cr = cr * 100 / Math.min(w, h);
            w += bw * 2;
            h += bw * 2;
            r.bw = bw;
            r.node.style.marginLeft = -bw;
            r.node.style.marginTop = -bw;
        }
        if (w < 1) {
            w = 1;
        }

        if (h < 1) {
            h = 1;
        }

        r.attr({
            x: x,
            y: y,
            width: w,
            height: h,
            rx: cr,
            ry: cr,
            'stroke-width': bw
        });
        _this.addToContainer(r.node, container);
        return r;
    },

    image: function(path, x, y, w, h, container) {
        var _this = this;
        var i = new AmCharts.AmDObject("image", _this);
        i.attr({
            x: x,
            y: y,
            width: w,
            height: h
        });
        _this.R.path(i, path);
        _this.addToContainer(i.node, container);
        return i;
    },

    addToContainer: function(node, container) {
        if (!container) {
            container = this.container;
        }
        container.appendChild(node);
    },

    text: function(text, attr, container) {
        return this.R.text(text, attr, container);
    },

    path: function(pathStr, container, parsed, cs) {
        var _this = this;

        var p = new AmCharts.AmDObject("path", _this);

        if (!cs) {
            cs = "100,100";
        }

        p.attr({
            "cs": cs
        });

        if (parsed) {
            p.attr({
                "dd": pathStr
            });
        } else {
            p.attr({
                "d": pathStr
            });
        }

        _this.addToContainer(p.node, container);

        return p;
    },

    set: function(arr) {
        return this.R.set(arr);
    },

    remove: function(node) {
        if (node) {
            var rBin = this.rBin;
            rBin.appendChild(node);
            rBin.innerHTML = "";
        }
    },

    // borrowed from jquery
    bounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },

    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },

    renderFix: function() {
        var container = this.container;
        var style = container.style;
        var position;

        try {
            position = container.getScreenCTM() || container.createSVGMatrix();
        } catch (e) {
            position = container.createSVGMatrix();
        }
        var left = 1 - position.e % 1;
        var top = 1 - position.f % 1;

        if (left > 0.5) {
            left -= 1;
        }

        if (top > 0.5) {
            top -= 1;
        }

        if (left) {
            style.left = left + "px";
        }
        if (top) {
            style.top = top + "px";
        }
    }


});



;
AmCharts.AmDObject = AmCharts.Class({
    construct: function(name, amDraw) {
        var _this = this;
        _this.D = amDraw;
        _this.R = amDraw.R;
        var node = _this.R.create(this, name);
        _this.node = node;
        _this.children = [];
        _this.x = 0;
        _this.y = 0;
        _this.scale = 1;
    },

    attr: function(attributes) {
        this.R.attr(this, attributes);
        return this;
    },

    getAttr: function(attr) {
        return this.node.getAttribute(attr);
    },

    setAttr: function(attr, value) {
        this.R.setAttr(this, attr, value);
        return this;
    },

    clipRect: function(x, y, w, h) {
        this.R.clipRect(this, x, y, w, h);
    },

    translate: function(x, y, scale) {
        var _this = this;
        this.R.move(this, Math.round(x), Math.round(y), scale);
        _this.x = x;
        _this.y = y;
        _this.scale = scale;
        if (_this.angle) {
            _this.rotate(_this.angle);
        }
    },

    rotate: function(angle) {
        this.R.rotate(this, angle);
        this.angle = angle;
    },

    animate: function(attributes, time, effect) {
        for (var a in attributes) {
            var attribute = a;
            var to = attributes[a];

            effect = AmCharts.getEffect(effect);

            this.R.animate(this, attribute, to, time, effect);
        }
    },

    push: function(obj) {
        if (obj) {
            var node = this.node;

            node.appendChild(obj.node);

            var clipPath = obj.clipPath;
            if (clipPath) {
                node.appendChild(clipPath);
            }

            var grad = obj.grad;
            if (grad) {
                node.appendChild(grad);
            }
            this.children.push(obj);
        }
    },

    text: function(str) {
        this.R.setText(this, str);
    },

    remove: function() {
        this.R.remove(this);
    },

    clear: function() {
        var node = this.node;
        if (node.hasChildNodes()) {
            while (node.childNodes.length >= 1) {
                node.removeChild(node.firstChild);
            }
        }
    },

    hide: function() {
        this.setAttr("visibility", "hidden");
    },

    show: function() {
        this.setAttr("visibility", "visible");
    },

    getBBox: function() {
        return this.R.getBBox(this);
    },

    toFront: function() {
        var node = this.node;

        if (node) {
            var parent = node.parentNode;

            if (parent) {
                parent.appendChild(node);
            }
        }
    },

    toBack: function() {
        var node = this.node;
        if (node) {
            var parent = node.parentNode;
            if (parent) {
                var firstChild = parent.firstChild;
                if (firstChild) {
                    parent.insertBefore(node, firstChild);
                }
            }
        }
    },

    mouseover: function(f) {
        this.R.addListener(this, "mouseover", f);
        return this;
    },

    mouseout: function(f) {
        this.R.addListener(this, "mouseout", f);
        return this;
    },

    click: function(f) {
        this.R.addListener(this, "click", f);
        return this;
    },

    dblclick: function(f) {
        this.R.addListener(this, "dblclick", f);
        return this;
    },

    mousedown: function(f) {
        this.R.addListener(this, "mousedown", f);
        return this;
    },

    mouseup: function(f) {
        this.R.addListener(this, "mouseup", f);
        return this;
    },


    touchstart: function(f) {
        this.R.addListener(this, "touchstart", f);
        return this;
    },

    touchend: function(f) {
        this.R.addListener(this, "touchend", f);
        return this;
    },

    stop: function(f) {
        var _this = this;
        var animationX = _this.animationX;

        if (animationX) {
            AmCharts.removeFromArray(_this.R.animations, animationX);
        }

        var animationY = _this.animationY;

        if (animationY) {
            AmCharts.removeFromArray(_this.R.animations, animationY);
        }
    },


    length: function() {
        return this.node.childNodes.length;
    },

    gradient: function(type, colors, rotation) {
        this.R.gradient(this, type, colors, rotation);
    }
});;
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function(amDraw) {
        var _this = this;
        _this.D = amDraw;
        _this.cNames = {
            circle: "oval",
            rect: "roundrect",
            path: "shape"
        };
        _this.styleMap = {
            "x": "left",
            "y": "top",
            "width": "width",
            "height": "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "visibility": "visibility"
        };
        _this.animations = [];
    },

    create: function(obj, name) {
        var node;
        if (name == "group") {
            node = document.createElement("div");
            obj.type = "div";
        } else if (name == "text") {
            node = document.createElement("div");
            obj.type = "text";
        } else if (name == "image") {
            node = document.createElement("img");
            obj.type = "image";
        } else {
            obj.type = "shape";
            obj.shapeType = this.cNames[name];

            node = document.createElement("amvml:" + this.cNames[name]);
            var stroke = document.createElement("amvml:stroke");
            node.appendChild(stroke);
            obj.stroke = stroke;

            var fill = document.createElement("amvml:fill");
            node.appendChild(fill);
            obj.fill = fill;
            fill.className = "amvml";
            stroke.className = "amvml";
            node.className = "amvml";
        }

        node.style.position = "absolute";
        node.style.top = 0;
        node.style.left = 0;

        return node;
    },

    path: function(obj, p) {
        obj.node.setAttribute("src", p);
    },


    setAttr: function(obj, attr, value) {
        if (value !== undefined) {
            if (document.documentMode === 8) {
                var mode8 = true;
            }

            var node = obj.node;

            var _this = this;
            var type = obj.type;
            var shapeType = obj.shapeType;
            var nodeStyle = node.style;


            // circle radius
            if (attr == "r") {
                nodeStyle.width = value * 2;
                nodeStyle.height = value * 2;
            }

            if (obj.shapeType == "roundrect") {
                if (attr == "width" || attr == "height") {
                    value -= 1;
                }
            }

            if (attr == "cursor") {
                nodeStyle.cursor = value;
            }

            // circle x
            if (attr == "cx") {
                nodeStyle.left = value - AmCharts.removePx(nodeStyle.width) / 2;
            }
            // circle y
            if (attr == "cy") {
                nodeStyle.top = value - AmCharts.removePx(nodeStyle.height) / 2;
            }

            var styleName = _this.styleMap[attr];
            if (styleName != undefined) {
                nodeStyle[styleName] = value;
            }

            if (type == "text") {
                if (attr == "text-anchor") {
                    var px = "px";
                    obj.anchor = value;

                    var textWidth = node.clientWidth;

                    if (value == "end") {
                        nodeStyle.marginLeft = -textWidth + px;
                    }
                    if (value == "middle") {
                        nodeStyle.marginLeft = -(textWidth / 2) + px;
                    }
                    if (value == "start") {
                        nodeStyle.marginLeft = 0 + px;
                    }
                }
                if (attr == "fill") {
                    nodeStyle.color = value;
                }
                if (attr == "font-weight") {
                    nodeStyle.fontWeight = value;
                }
            }

            var children = obj.children;
            for (var i = 0; i < children.length; i++) {
                children[i].setAttr(attr, value);
            }

            // path
            if (type == "shape") {
                if (attr == "cs") {
                    node.style.width = "100px";
                    node.style.height = "100px";
                    node.setAttribute("coordsize", value);
                }

                if (attr == "d") {
                    node.setAttribute("path", _this.svgPathToVml(value));
                }

                if (attr == "dd") {
                    node.setAttribute("path", value);
                }

                var stroke = obj.stroke;
                var fill = obj.fill;

                if (attr == "stroke") {
                    if (mode8) {
                        stroke.color = value;
                    } else {
                        stroke.setAttribute("color", value);
                    }
                }

                if (attr == "stroke-width") {
                    if (mode8) {
                        stroke.weight = value;
                    } else {
                        stroke.setAttribute("weight", value);
                    }
                }

                if (attr == "stroke-opacity") {
                    if (mode8) {
                        stroke.opacity = value;
                    } else {
                        stroke.setAttribute("opacity", value);
                    }
                }
                if (attr == "stroke-dasharray") {
                    var val = "solid";
                    if (value > 0 && value < 3) {
                        val = "dot";
                    }
                    if (value >= 3 && value <= 6) {
                        val = "dash";
                    }
                    if (value > 6) {
                        val = "longdash";
                    }
                    if (mode8) {
                        stroke.dashstyle = val;
                    } else {
                        stroke.setAttribute("dashstyle", val);
                    }
                }
                if (attr == "fill-opacity" || attr == "opacity") {
                    if (value == 0) {
                        if (mode8) {
                            fill.on = false;
                        } else {
                            fill.setAttribute("on", false);
                        }
                    } else {
                        if (mode8) {
                            fill.opacity = value;
                        } else {
                            fill.setAttribute("opacity", value);
                        }
                    }

                }

                if (attr == "fill") {
                    if (mode8) {
                        fill.color = value;
                    } else {
                        fill.setAttribute("color", value);
                    }
                }

                if (attr == "rx") {
                    if (mode8) {
                        node.arcSize = value + "%";
                    } else {
                        node.setAttribute("arcsize", value + "%");
                    }
                }
            }
        }
    },

    attr: function(obj, attributes) {
        var _this = this;

        for (var a in attributes) {
            _this.setAttr(obj, a, attributes[a]);
        }
    },

    text: function(text, attr, container) {
        var _this = this;

        var t = new AmCharts.AmDObject("text", _this.D);
        var node = t.node;
        node.style.whiteSpace = "pre";
        var txt = document.createTextNode(text);

        node.appendChild(txt);
        _this.D.addToContainer(node, container);
        _this.attr(t, attr);

        return t;
    },

    getBBox: function(obj) {
        var node = obj.node;
        var box = this.getBox(node);
        return box;
    },

    getBox: function(node) {
        var x = node.offsetLeft;
        var y = node.offsetTop;

        var width = node.offsetWidth;
        var height = node.offsetHeight;

        var bbox;

        if (node.hasChildNodes()) {
            var xs;
            var ys;

            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                bbox = this.getBox(childNode);
                var xx = bbox.x;

                if (!isNaN(xx)) {
                    if (isNaN(xs)) {
                        xs = xx;
                    } else if (xx < xs) {
                        xs = xx;
                    }
                }

                var yy = bbox.y;

                if (!isNaN(yy)) {
                    if (isNaN(ys)) {
                        ys = yy;
                    } else if (yy < ys) {
                        ys = yy;
                    }
                }


                var ww = bbox.width + xx;

                if (!isNaN(ww)) {
                    width = Math.max(width, ww);
                }

                var hh = bbox.height + yy;

                if (!isNaN(hh)) {
                    height = Math.max(height, hh);
                }
            }

            if (xs < 0) {
                x += xs;
            }
            if (ys < 0) {
                y += ys;
            }
        }

        return ({
            x: x,
            y: y,
            width: width,
            height: height
        });
    },

    setText: function(obj, str) {
        var node = obj.node;
        if (node) {
            node.removeChild(node.firstChild);
            node.appendChild(document.createTextNode(str));
        }
        this.setAttr(obj, "text-anchor", obj.anchor);
    },

    addListener: function(obj, event, f) {
        obj.node["on" + event] = f;
    },

    move: function(obj, x, y) {
        var _this = this;
        var node = obj.node;
        var nodeStyle = node.style;

        if (obj.type == "text") {
            y -= AmCharts.removePx(nodeStyle.fontSize) / 2 - 1;
        }

        if (obj.shapeType == "oval") {
            x -= AmCharts.removePx(nodeStyle.width) / 2;
            y -= AmCharts.removePx(nodeStyle.height) / 2;
        }

        var bw = obj.bw;

        if (!isNaN(bw)) {
            x -= bw;
            y -= bw;
        }

        var px = "px";

        node.style.left = x + px;
        node.style.top = y + px;
    },

    svgPathToVml: function(path) {
        var pathArray = path.split(" ");
        var path = "";
        var previousArray;
        var round = Math.round;
        var comma = ",";

        for (var i = 0; i < pathArray.length; i++) {
            var el = pathArray[i];
            var letter = el.substring(0, 1);
            var numbers = el.substring(1);
            var numbersArray = numbers.split(",");

            var rounded = round(numbersArray[0]) + comma + round(numbersArray[1]);

            if (letter == "M") {
                path += " m " + rounded;
            }
            if (letter == "L") {
                path += " l " + rounded;
            }
            if (letter == "Z") {
                path += " x e";
            }
            if (letter == "Q") {
                var length = previousArray.length;
                var qp0x = previousArray[length - 2];
                var qp0y = previousArray[length - 1];

                var qp1x = numbersArray[0];
                var qp1y = numbersArray[1];

                var qp2x = numbersArray[2];
                var qp2y = numbersArray[3];

                var cp1x = round(qp0x / 3 + 2 / 3 * qp1x);
                var cp1y = round(qp0y / 3 + 2 / 3 * qp1y);

                var cp2x = round(2 / 3 * qp1x + qp2x / 3);
                var cp2y = round(2 / 3 * qp1y + qp2y / 3);

                path += " c " + cp1x + comma + cp1y + comma + cp2x + comma + cp2y + comma + qp2x + comma + qp2y;
            }

            if (letter == "A") {
                path += " wa " + numbers;
            }

            if (letter == "B") {
                path += " at " + numbers;
            }

            previousArray = numbersArray;
        }

        return path;
    },


    animate: function(obj, attribute, to, time, effect) {
        var _this = this;
        var node = obj.node;
        var nodeStyle = node.style;
        var from;

        if (attribute == "translate") {
            var toA = to.split(",");
            var toX = toA[0];
            var toY = toA[1];

            var fromX = node.offsetLeft;
            var fromY = node.offsetTop;

            var animationX = {
                obj: obj,
                frame: 0,
                attribute: "left",
                from: fromX,
                to: toX,
                time: time,
                effect: effect
            };
            _this.animations.push(animationX);

            var animationY = {
                obj: obj,
                frame: 0,
                attribute: "top",
                from: fromY,
                to: toY,
                time: time,
                effect: effect
            };
            _this.animations.push(animationY);

            obj.animationX = animationX;
            obj.animationY = animationY;
        }

        if (!_this.interval) {
            _this.interval = setInterval(function() {
                _this.updateAnimations.call(_this)
            }, AmCharts.updateRate);
        }
    },

    updateAnimations: function() {
        var _this = this;
        for (var i = _this.animations.length - 1; i >= 0; i--) {
            var animation = _this.animations[i];
            var totalCount = animation.time * 1000 / AmCharts.updateRate;
            var frame = animation.frame + 1;
            var obj = animation.obj;
            var attribute = animation.attribute;

            if (frame <= totalCount) {
                var value;
                animation.frame++;

                var from = Number(animation.from);
                var to = Number(animation.to);

                var change = to - from;

                value = _this.D[animation.effect](0, frame, from, change, totalCount)

                if (change == 0) {
                    _this.animations.splice(i, 1);
                } else {
                    obj.node.style[attribute] = value;
                }
            } else {
                obj.node.style[attribute] = Number(animation.to);
                _this.animations.splice(i, 1);
            }
        }
    },

    clipRect: function(obj, x, y, w, h) {
        var node = obj.node;
        node.style.clip = "rect(" + y + "px " + (x + w) + "px " + (y + h) + "px " + x + "px)";
    },

    rotate: function(obj, deg) {
        var node = obj.node;
        var style = node.style;

        var bgColor = this.getBGColor(node.parentNode);

        style.backgroundColor = bgColor;
        style.paddingLeft = 1;

        var rad = deg * Math.PI / 180;
        var costheta = Math.cos(rad);
        var sintheta = Math.sin(rad);

        var left = AmCharts.removePx(style.left);
        var top = AmCharts.removePx(style.top);
        var width = node.offsetWidth;
        var height = node.offsetHeight;

        var sign = deg / Math.abs(deg);

        style.left = left + width / 2 - width / 2 * Math.cos(rad) - sign * height / 2 * Math.sin(rad) + 3;
        style.top = top - sign * width / 2 * Math.sin(rad) + sign * height / 2 * Math.sin(rad);

        style.cssText = style.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + costheta + "', M12='" + -sintheta + "', M21='" + sintheta + "', M22='" + costheta + "', sizingmethod='auto expand');";
    },


    getBGColor: function(node) {
        var style = node.style;
        var bgColor = "#FFFFFF";

        if (style) {
            var color = node.style.backgroundColor;
            if (color != "") {
                bgColor = color;
            } else if (node.parentNode) {
                bgColor = this.getBGColor(node.parentNode);
            }
        }
        return bgColor;
    },

    set: function(arr) {
        var _this = this;
        var s = new AmCharts.AmDObject("group", _this.D);
        _this.D.container.appendChild(s.node);

        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                s.push(arr[i]);
            }
        }
        return s;
    },

    gradient: function(obj, type, colors, rotation) {
        var _this = this;

        var c = "";

        if (type == "radialGradient") {
            type = "gradientradial";
            colors.reverse();
        }

        if (type == "linearGradient") {
            type = "gradient";
        }

        for (var i = 0; i < colors.length; i++) {
            var offset = Math.round(i * 100 / (colors.length - 1));

            c += offset + "% " + colors[i];
            if (i < colors.length - 1) {
                c += ",";
            }
        }

        var fill = obj.fill;

        if (rotation == 90) {
            rotation = 0;
        } else if (rotation == 270) {
            rotation = 180;
        } else if (rotation == 180) {
            rotation = 90;
        } else if (rotation == 0) {
            rotation = 270;
        }

        if (document.documentMode === 8) {
            fill.type = type;
            fill.angle = rotation;
        } else {
            fill.setAttribute("type", type);
            fill.setAttribute("angle", rotation);
        }
        if (c) {
            fill.colors.value = c;
        }
    },

    /**
     * 添加shadUrl属性，为图添加阴影效果,ie的vml上不实现
     */
    shadow: function(obj) {

    },

    remove: function(obj) {
        var _this = this;

        if (obj.clipPath) {
            _this.D.remove(obj.clipPath);
        }
        _this.D.remove(obj.node);
    },

    disableSelection: function(target) {
        if (typeof target.onselectstart != undefined) {
            target.onselectstart = function() {
                return false;
            }
        }
        target.style.cursor = "default";
    }


});;
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function(amDraw) {
        var _this = this;
        _this.D = amDraw;
        _this.animations = [];
        _this.textureMap = {};
    },

    create: function(obj, name) {
        return document.createElementNS(AmCharts.SVG_NS, name);
    },

    attr: function(obj, attributes) {
        for (var a in attributes) {
            this.setAttr(obj, a, attributes[a])
        }
    },

    setAttr: function(obj, attr, value) {
        // 材质填充
        var attrValue = value;
        if (attr === 'fill' && typeof value === 'string' && this.textureMap[value.toUpperCase()]) {
            attrValue = this.textureMap[value.toUpperCase()].fill;
        }

        if (value !== undefined) {
            obj.node.setAttribute(attr, attrValue);
        }
    },

    initTexturePatterns: function(container, textureMap) {
        var href,
        defs,
        pattern,
        id,
        img,
        image,
        item,
        url;

        var _this = this;

        if (!textureMap || !container) {
            return;
        }

        // 取得或创建定义段
        defs = container.getElementsByTagNameNS(AmCharts.SVG_NS, 'defs')[0];
        if (typeof defs === 'undefined') {
            defs = document.createElementNS(AmCharts.SVG_NS, 'defs');
            container.appendChild(defs);
        }

        // 根据映射表初始化Patterns
        for (var color in textureMap) {
            url = textureMap[color];

            // 用户指定图形宽高
            if (color === "width") {
                width = url;
                continue;
            }
            if (color === "height") {
                height = url;
                continue;
            }

            // 颜色和URL的组合已存在，不处理
            item = _this.textureMap[color.toUpperCase()];
            if (item && item.url === url) {
                continue;
            }

            // 颜色相同，URL变化，删除后重新创建
            if (item && item.id) {
                id = item.id;
                pattern = defs.getElementById(id);
                defs.removeChild(pattern);
            } else {
                id = AmCharts.getUniqueId();
            }

            // 创建新的Pattern
            pattern = document.createElementNS(AmCharts.SVG_NS, 'pattern');
            pattern.setAttribute("id", id);
            pattern.setAttribute("patternUnits", "userSpaceOnUse");
            pattern.setAttribute("x", "0");
            pattern.setAttribute("y", "0");
            pattern.setAttribute("width", "5");
            pattern.setAttribute("height", "5");

            image = document.createElementNS(AmCharts.SVG_NS, 'image');
            image.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", url);
            image.setAttribute("x", "0");
            image.setAttribute("y", "0");
            image.setAttribute("width", "5");
            image.setAttribute("height", "5");

            pattern.appendChild(image);
            defs.appendChild(pattern);

            // 预加载图片
            img = document.createElement("img");
            img.setAttribute("target", id);
            img.style.cssText = "position:absolute; left:-9999em; top:-9999em";
            img.onload = function() {
                // 图片加载完成后，更新Pattern的属性
                var p = document.getElementById(this.getAttribute("target"));
                if (p) {
                    p.setAttribute("width", this.offsetWidth + '');
                    p.setAttribute("height", this.offsetHeight + '');
                    p.getElementsByTagNameNS(AmCharts.SVG_NS, "image")[0].setAttribute("width", this.offsetWidth + '');
                    p.getElementsByTagNameNS(AmCharts.SVG_NS, "image")[0].setAttribute("height", this.offsetHeight + '');
                }

                this.onload = null;
                document.body.removeChild(this);
            };
            img.onerror = function() {
                document.body.removeChild(this);
            };
            document.body.appendChild(img);
            img.src = url;

            // 记录
            item = {
                "id": id,
                "url": url,
                "fill": "url(#" + id + ")"
            };
            _this.textureMap[color.toUpperCase()] = item;
        }
    },

    animate: function(obj, attribute, to, time, effect) {
        var _this = this;
        var node = obj.node;
        var from;

        if (attribute == "translate") {
            from = node.getAttribute("transform");

            if (!from) {
                from = "0,0";
            } else {
                from = String(from).substring(10, from.length - 1);
            }

            from = from.split(", ").join(" ");
            from = from.split(" ").join(",");

            if (from == 0) {
                from = "0,0";
            }
        } else {
            from = node.getAttribute(attribute);
        }

        var animationObj = {
            obj: obj,
            frame: 0,
            attribute: attribute,
            from: from,
            to: to,
            time: time,
            effect: effect
        };
        _this.animations.push(animationObj);

        obj.animationX = animationObj;

        if (!_this.interval) {
            _this.interval = setInterval(function() {
                _this.updateAnimations.call(_this)
            }, AmCharts.updateRate);
        }
    },

    updateAnimations: function() {
        var _this = this;
        for (var i = _this.animations.length - 1; i >= 0; i--) {
            var animation = _this.animations[i];
            var totalCount = animation.time * 1000 / AmCharts.updateRate;
            var frame = animation.frame + 1;
            var obj = animation.obj;
            var attribute = animation.attribute;

            if (frame <= totalCount) {
                var value;
                animation.frame++;
                if (attribute == "translate") {
                    var fromXY = animation.from.split(",");
                    var fromX = Number(fromXY[0]);
                    var fromY = Number(fromXY[1]);

                    var toXY = animation.to.split(",");
                    var toX = Number(toXY[0]);
                    var toY = Number(toXY[1]);

                    var valueX;
                    if (toX - fromX == 0) {
                        valueX = toX;
                    } else {
                        valueX = Math.round(_this.D[animation.effect](0, frame, fromX, toX - fromX, totalCount));
                    }

                    var valueY;
                    if (toY - fromY == 0) {
                        valueY = toY;
                    } else {
                        valueY = Math.round(_this.D[animation.effect](0, frame, fromY, toY - fromY, totalCount));
                    }

                    attribute = "transform";
                    value = "translate(" + valueX + "," + valueY + ")";
                } else {
                    var from = Number(animation.from);
                    var to = Number(animation.to);
                    var change = to - from;

                    value = _this.D[animation.effect](0, frame, from, change, totalCount)

                    if (change == 0) {
                        _this.animations.splice(i, 1);
                    }
                }

                _this.setAttr(obj, attribute, value);
            } else {
                if (attribute == "translate") {
                    var toXY = animation.to.split(",");
                    var toX = Number(toXY[0]);
                    var toY = Number(toXY[1]);

                    obj.translate(toX, toY);
                } else {
                    var to = Number(animation.to);
                    _this.setAttr(obj, attribute, to);
                }

                _this.animations.splice(i, 1);
            }
        }
    },

    getBBox: function(obj) {
        var node = obj.node;
        var bbox = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };
        if (node) {
            try {
                return node.getBBox();
            } catch (err) {

            }
        }

        return bbox;
    },

    path: function(obj, p) {
        obj.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", p);
    },

    clipRect: function(obj, x, y, w, h) {
        var _this = this;
        var node = obj.node;

        var old = obj.clipPath;
        if (old) {
            _this.D.remove(old)
        }

        var parent = node.parentNode;
        if (parent) {
            var clipPath = document.createElementNS(AmCharts.SVG_NS, "clipPath");
            var uniqueId = AmCharts.getUniqueId();
            clipPath.setAttribute("id", uniqueId);

            var rect = _this.D.rect(x, y, w, h, 0, 0, clipPath);

            parent.appendChild(clipPath);
            var url = "#";
            if (AmCharts.baseHref && !AmCharts.isIE) {
                url = window.location.href + url;
            }
            _this.setAttr(obj, "clip-path", "url(" + url + uniqueId + ")");
            _this.clipPathC++;

            // save reference in order not to get by id when removing
            obj.clipPath = clipPath;
        }
    },

    text: function(text, attr, container) {
        var _this = this;
        var t = new AmCharts.AmDObject("text", _this.D);
        var dy = 0;

        var textArray = String(text).split("\n");
        var fontSize = attr['font-size'];

        for (var i = 0; i < textArray.length; i++) {
            var tspan = _this.create(null, "tspan");
            tspan.appendChild(document.createTextNode(textArray[i]));
            tspan.setAttribute("y", (fontSize + 2) * i + fontSize / 2 + dy);
            tspan.setAttribute("x", 0);
            t.node.appendChild(tspan);
        }
        t.node.setAttribute("y", fontSize / 2 + dy);
        _this.attr(t, attr);
        _this.D.addToContainer(t.node, container);
        return t;
    },


    setText: function(obj, str) {
        var node = obj.node;
        if (node) {
            node.removeChild(node.firstChild);
            node.appendChild(document.createTextNode(str));
        }
    },

    move: function(obj, x, y, scale) {
        var val = "translate(" + x + "," + y + ")";
        if (scale) {
            val = val + " scale(" + scale + ")";
        }

        this.setAttr(obj, "transform", val);
    },


    rotate: function(obj, angle) {
        var node = obj.node;
        var transform = node.getAttribute("transform");
        var val = "rotate(" + angle + ")";
        if (transform) {
            val = transform + " " + val;
        }
        this.setAttr(obj, "transform", val);
    },

    set: function(arr) {
        var _this = this;
        var s = new AmCharts.AmDObject("g", _this.D);
        _this.D.container.appendChild(s.node);

        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                s.push(arr[i]);
            }
        }
        return s;
    },

    addListener: function(obj, event, f) {
        obj.node["on" + event] = f;
    },

    gradient: function(obj, type, colors, rotation) {
        var _this = this;
        var node = obj.node;

        var old = obj.grad;
        if (old) {
            _this.D.remove(old)
        }

        var gradient = document.createElementNS(AmCharts.SVG_NS, type);
        var uniqueId = AmCharts.getUniqueId();
        gradient.setAttribute("id", uniqueId);

        if (!isNaN(rotation)) {
            var x1 = 0;
            var x2 = 0;
            var y1 = 0;
            var y2 = 0;

            if (rotation == 90) {
                y1 = 100;
            } else if (rotation == 270) {
                y2 = 100;
            } else if (rotation == 180) {
                x1 = 100;
            } else if (rotation == 0) {
                x2 = 100;
            }

            var p = "%";

            gradient.setAttribute("x1", x1 + p);
            gradient.setAttribute("x2", x2 + p);
            gradient.setAttribute("y1", y1 + p);
            gradient.setAttribute("y2", y2 + p);
        }

        for (var i = 0; i < colors.length; i++) {
            var stop = document.createElementNS(AmCharts.SVG_NS, "stop");
            var offset = 100 * i / (colors.length - 1);
            if (i == 0) {
                offset = 0;
            }
            stop.setAttribute("offset", offset + "%");
            stop.setAttribute("stop-color", colors[i]);
            gradient.appendChild(stop);
        }
        node.parentNode.appendChild(gradient);

        var url = "#";
        if (AmCharts.baseHref && !AmCharts.isIE) {
            url = window.location.href + url;
        }

        node.setAttribute("fill", "url(" + url + uniqueId + ")");

        obj.grad = gradient;
    },

    /**
     * 添加shadUrl属性，为图添加阴影效果
     */
    createShadow: function(defs, stdDeviation, offsetIn, dx, dy, type) {
        var shadowObj = document.createElementNS(AmCharts.SVG_NS, "filter");
        var uniqueId = AmCharts.getUniqueId();
        shadowObj.setAttribute("id", uniqueId);
        shadowObj.setAttribute("width", "120%");
        shadowObj.setAttribute("height", "120%");

        var feOffset = document.createElementNS(AmCharts.SVG_NS, "feOffset");
        feOffset.setAttribute("result", "offOut");
        feOffset.setAttribute("in", offsetIn);
        feOffset.setAttribute("dx", dx);
        feOffset.setAttribute("dy", dy);
        shadowObj.appendChild(feOffset);

        var gaussianIn = "offOut";
        if (type === "cuboid") {
            var feColorMatrix = document.createElementNS(AmCharts.SVG_NS, "feColorMatrix");
            feColorMatrix.setAttribute("result", "matrixOut");
            feColorMatrix.setAttribute("in", "offOut");
            feColorMatrix.setAttribute("type", "matrix");
            feColorMatrix.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.25 0");
            shadowObj.appendChild(feColorMatrix);
            gaussianIn = "matrixOut";
        }

        var feGaussianBlur = document.createElementNS(AmCharts.SVG_NS, "feGaussianBlur");
        feGaussianBlur.setAttribute("result", "blurOut");
        feGaussianBlur.setAttribute("in", gaussianIn);
        feGaussianBlur.setAttribute("stdDeviation", stdDeviation);
        shadowObj.appendChild(feGaussianBlur);

        var feBlend = document.createElementNS(AmCharts.SVG_NS, "feBlend");
        feBlend.setAttribute("in", "SourceGraphic");
        feBlend.setAttribute("in2", "blurOut");
        feBlend.setAttribute("mode", "normal");
        shadowObj.appendChild(feBlend);

        defs.appendChild(shadowObj);
        return uniqueId;
    },
    shadow: function(container) {
        var _this = this;

        var defs = container.getElementsByTagNameNS(AmCharts.SVG_NS, 'defs')[0];
        if (typeof defs === 'undefined') {
            defs = document.createElementNS(AmCharts.SVG_NS, 'defs');
            container.appendChild(defs);
        }
        //SourceGraphic,SourceAlpha,FillPaint,StrokePaint,BackgroundAlpha,BackgroundImage
        var lineUniqueId = _this.createShadow(defs, "3", "SourceAlpha", "3", "3", "line");
        var cuboidUniqueId = _this.createShadow(defs, "2", "SourceAlpha", "7", "7", "cuboid");
        var circleUniqueId = _this.createShadow(defs, "3", "SourceAlpha", "3", "3", "circle");

        var url = "#";
        var isGtIE8 = false; //IE版本是否大于8，默认false
        if (AmCharts.IEversion > 8) {
            isGtIE8 = true;
        }
        if (AmCharts.baseHref && (!AmCharts.isIE || isGtIE8)) //小于IE8不进入，因为IE9已经支持SVG
        {
            url = window.location.href + url;
        }
        var lineURL = "url(" + url + lineUniqueId + ")";
        var cuboidURL = "url(" + url + cuboidUniqueId + ")";
        var circleURL = "url(" + url + circleUniqueId + ")";
        _this.lineURL = lineURL;
        _this.cuboidURL = cuboidURL;
        _this.circleURL = circleURL;
    },
    //======= add end ====================

    remove: function(obj) {
        var _this = this;

        if (obj.clipPath) {
            _this.D.remove(obj.clipPath);
        }

        if (obj.grad) {
            _this.D.remove(obj.grad);
        }
        _this.D.remove(obj.node);
    }

});;
AmCharts.AmDSet = AmCharts.Class({
    construct: function(arr) {
        var _this = this;
        var group = _this.create("g");
    },

    attr: function(attributes) {
        this.R.attr(this.node, attributes);
    },

    move: function(x, y) {
        this.R.move(this.node, x, y);
    }
});

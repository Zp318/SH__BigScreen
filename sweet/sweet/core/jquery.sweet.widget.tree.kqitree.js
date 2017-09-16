/**
 * @fileOverview
 * <pre>
 * KQI树组件
 * 2013/2/18
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function ($, undefined) {
    "use strict";

    var defaultTreeClass = "sweet-tree-panel";
    var kqiTreeClass = "sweet-tree-kqitree";
    var lightClass = "sweet-kqitree-light";
    var zoomClass = "sweet-kqitree-zoom";
    var fitClass = "fit";
    var actClass = "act";

    $.widget("sweet.widgetKqiTree", $.sweet.widgetTree, /** @lends Sweet.tree.KQITree.prototype */{
        version: "1.0",
        sweetWidgetName: "[widget-tree-kqitree]:",
        eventNames: {},
        options: /** @lends Sweet.tree.KQITree.prototype */{
            /**
             * 渲染目标DIV的id
             * @type String
             * @default ""
             */
            renderTo: "",
            /**
             * 内边距
             * @type Number
             * @default 10
             */
            padding: 10,
            /**
             * 节点间水平间距
             * @type Number
             * @default 14
             */
            offsetX: 14,
            /**
             * 节点间垂直间距
             * @type Number
             * @default 48
             */
            offsetY: 48,
            /**
             * 节点宽度
             * @type Number
             * @default 110
             */
            elemWidth: 110,
            /**
             * 节点高度
             * @type Number
             * @default 1303
             */
            elemHeight: 130,
            /**
             * 节点间连线宽度
             * @type Number
             * @default 1
             */
            lineWidth: 1,
            /**
             * 节点间连线颜色
             * @type String
             * @default "#666666"
             */
            lineColor: "#666666",
            /**
             * 树构造数据
             * @type Object
             * @default null
             */
            data: null
        },
        /**
         * 刷新布局
         * @private
         */
        _doLayout: function () {
            var options = this.options;

            if (!this.rendered) {
                return;
            }

            this._super();

            // 修正容器大小
            this.treeEl.externalWidth(options.width).externalHeight(options.height);

            // 如果还没有创建树，此时创建
            if ($.isNull(this.R)) {
                this._createKqiTree();
            }
        },
        /**
         * @private
         * 组件创建前，初始化操作，子类继承实现
         */
        _beforeCreateSweetWidget: function () {
            // 树节点类，暂时只支持 Sweet.chart.Speedometer
            this.nodeClass = Sweet.chart.Speedometer;

            // 引擎
            this.engine = "svg";

            // Raphael的Paper对象
            this.R = null;

            this.treeData = null;
            this.maxWidth = 0;      // 布局后树的最大宽度
            this.maxHeight = 0;     // 布局后树的高大高度
            this.nodeList = {};     // 所有节点对象
            this.lineList = [];     // 所有连接线对象，目前使用直线
            this.zoomFactor = 1.0;  // 适应区域与实际大小两种显示方式之间的缩放比例
            this.offset = this.options.padding;
        },
        /**
         * @private
         * @description 创建树
         */
        _createSweetWidget: function () {
            var options = this.options;

            // 创建容器
            this.treeEl = $("<div>");
            this.treeEl.addClass(kqiTreeClass + " " + defaultTreeClass + " " + options.widgetClass)
                .attr("id", options.id);
        },
        /**
         * @description 布局指定节点下的子节点的位置
         * @param {Object} parent 指定节点，为它的子节点进行布局
         * @param {Number} level 当前布局节点在树中的深度，保留未用
         * @return {Object} 布局后当前深度的宽度信息
         * @private
         */
        _layoutChildren: function (parent, level) {
            var config = this.options;
            var left = parent.pos.left;
            var top = parent.pos.top + config.elemHeight + config.offsetY;

            var left2 = left;

            // layout current level
            for (var i = 0; i < parent.children.length; i++) {
                var node = parent.children[i];
                node.pos = {};
                node.pos.left = left2;
                node.pos.top = top;

                // layout children
                if (node.children && node.children.length > 0) {
                    var pos = this._layoutChildren(node, level + 1);

                    // fix left position, center it among children
                    left = Math.round((left2 + pos.left) / 2);
                    node.pos.left = left;

                    // fix right position
                    left2 = pos.left;
                }

                // calculate sibling node's position
                left = left2;
                left2 += config.elemWidth + config.offsetX;
            }

            // record right border
            if (left > this.maxWidth) {
                this.maxWidth = left;
            }

            if (top > this.maxHeight) {
                this.maxHeight = top;
            }

            // return right edge
            return {"left": left, "top": top};
        },

        /**
         * @description 根据已设置的数据，对节点进行自动布局
         * @return {Boolean} 布局结果
         * @private
         */
        _layoutTree: function () {
            var options = this.options;
            var svgEl = this.treeEl.find(">svg");

            if ($.isNull(this.treeData)) {
                return false;
            }

            // 初始化节点位置信息
            var root = this.treeData.nodes;
            root.pos = {};
            root.pos.left = options.padding;
            root.pos.top = options.padding;

            this.maxWidth = root.pos.left;
            this.maxHeight = root.pos.top;

            var pos = this._layoutChildren(root, 1);
            root.pos.left = Math.round((root.pos.left + pos.left) / 2);

            // 如果树的宽度小于容器宽度，居中显示
            var w = this.treeEl.width();
            var h = this.treeEl.height();
            this.maxWidth = this.maxWidth + options.elemWidth + options.padding;
            this.maxHeight = this.maxHeight + options.elemHeight + options.padding;

            if (this.maxWidth < w) {
                this.offset = Math.floor((w - this.maxWidth) / 2);
            }

            // 修正SVG大小
            if (this.maxWidth > w) {
                svgEl.externalWidth(this.maxWidth);
            }

            if (this.maxHeight > h) {
                svgEl.externalHeight(this.maxHeight);
            }

            // 根据实际大小和容器大小，计算fit模式下的缩放比例
            if (this.maxHeight > h || this.maxWidth > w) {
                if (h / this.maxHeight < w / this.maxWidth) {
                    this.zoomFactor = h / this.maxHeight;
                }
                else {
                    this.zoomFactor = w / this.maxWidth;
                }
            }

            return true;
        },

        /**
         * @description 递归绘制指定节点下所有节点及连接线
         * @param {Object} node 待绘制的节点的信息
         * @private
         */
        _drawTree: function (node) {
            var options = this.options;

            if (node === null) {
                return;
            }

            // fix position to center horizontal
            node.pos.left += this.offset;

            // 准备节点的配置
            var param = {
                renderTo: "none-div",
                paper: this.R,
                left: node.pos.left,
                top: node.pos.top,
                width: options.elemWidth,
                height: options.elemHeight,
                borderStyle: node.borderStyle ? node.borderStyle : "solid"
            };

            // 创建节点对象
            var obj = new this.nodeClass(param);
            obj.setData(node);
            this.nodeList[node.id] = obj;

            // 绘制子节点
            var w = options.elemWidth;
            var h = options.elemHeight;
            for (var i = 0; i < node.children.length; i++) {
                this._drawTree(node.children[i]);

                // 绘制节点和这个子节点之间的连接线
                var child = node.children[i];
                var path = ["M", node.pos.left + w / 2, node.pos.top + h,
                    "L", node.pos.left + w / 2, node.pos.top + h + options.offsetY / 2,
                    "L", child.pos.left + w / 2, node.pos.top + h + options.offsetY / 2,
                    "L", child.pos.left + w / 2, child.pos.top
                ];
                var line = this.R.path(path).attr({"stroke-width": options.lineWidth, stroke: options.lineColor});

                // 如果子节点的边框是虚线，那它的连接线也是虚线
                if (node.children[i].borderStyle === "dashed") {
                    line.attr({"stroke-dasharray": "- "});
                }

                this.lineList.push(line);
            }
        },

        /**
         * @description 设置数据
         * @param {Object} data 树形存储的数据
         */
        setData: function (data) {
            this.treeData = data;

            if (!$.isNull(this.treeData)) {
                this._layoutTree();
                this._drawTree(this.treeData.nodes);
            }
        },

        /**
         * @description 缩放画布
         * @param {Number} factor 缩放比例
         * @private
         */
        _zoom: function (factor) {
            var tfm = "s" + factor + "," + factor + "," + this.maxWidth / 2 + ",0";

            // 调整连线
            for (var i = 0; i < this.lineList.length; i++) {
                this.lineList[i].transform(tfm);
            }

            // 调整节点
            for (var id in this.nodeList) {
                if (this.nodeList.hasOwnProperty(id)) {
                    this.nodeList[id].setScale(factor, this.maxWidth / 2, 0);
                }
            }

            // 如果Fit模式，调整到左、上位置
            if (factor !== 1) {
                this.treeEl.find(">svg").css({"left": 0, "top": 0});
            }
        },

        /**
         * @description 绘制并初始化缩放工具
         * @private
         */
        _drawZoomer: function () {
            var _this = this;
            var zoomEl = $("<div>").addClass(zoomClass).addClass(fitClass).appendTo(this.treeEl);

            zoomEl.unbind().bind("click", function () {
                if (zoomEl.hasClass(fitClass)) {
                    _this._zoom(_this.zoomFactor);
                    zoomEl.addClass(actClass).removeClass(fitClass);
                }
                else {
                    _this._zoom(1);
                    zoomEl.removeClass(actClass).addClass(fitClass);
                }
            });
        },

        /**
         * @description 绘制告警灯说明
         * @private
         */
        _drawLight: function () {
            var zIndex = $.getMaxZIndex();

            // 创建Dom元素
            var light = $("<div>").addClass(lightClass).css("z-index", zIndex);
            var lightInfo = $("<label>").text(Sweet.core.i18n.tree.info);
            var lightWarn = $("<label>").text(Sweet.core.i18n.tree.warn);

            // 插入Dom树
            light.append(lightInfo).append(lightWarn).appendTo(this.treeEl);
        },

        /**
         * @description 初始化画布
         * @return {Boolean} 结果
         * @private
         */
        _createKqiTree: function () {
            if (this.R === null) {
                /* 在这一行关闭jshint newcap告警 */
                /* jshint newcap: false */
                this.R = Raphael(this.treeEl.get(0), "100%", "100%");
            }

            // render zoom-in/out tool
            this._drawZoomer();

            // 绘制告警灯说明
            this._drawLight();

            // 拖动的处理
            var _this = this;
            var svg = this.treeEl.find(">svg");
            var width, height, cWidth, cHeight;
            this.treeEl.find(">svg").sweetDrag(function () {
                    // 如果当前是fit模式，不允许移动
                    if (_this.treeEl.find("." + actClass).length > 0) {
                        return false;
                    }

                    width = svg.externalWidth();
                    height = svg.externalHeight();
                    cWidth = _this.treeEl.width();
                    cHeight = _this.treeEl.height();
                },
                $.noop,
                function (event, x, y) {
                    // 避免不必要的移动
                    if (x > 0) {
                        svg.css("left", 0);
                    }
                    else if (width + x < cWidth) {
                        svg.css("left", cWidth - width);
                    }
                    else {
                        svg.css("left", x);
                    }

                    if (y > 0) {
                        svg.css("top", 0);
                    }
                    else if (height + y < cHeight) {
                        svg.css("top", cHeight - height);
                    }
                    else {
                        svg.css("top", y);
                    }

                    return false;
                });

            return true;
        },

        /**
         * @description 设置指定节点的值
         * @param {String} id 节点ID
         * @param {Number} value 当前值
         */
        setValue: function (id, value) {
            if ($.isNull(this.nodeList[id]) || !$.isFunction(this.nodeList[id].setValue)) {
                return;
            }

            this.nodeList[id].setValue(value);
        }
    });

    /**
     * @description KQI指标树
     * @name Sweet.tree.KQITree
     * @class
     * @extends Sweet.tree
     * @requires <pre>
     * jquery.js
     * raphael.js
     * jquery.sweetdrag.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.tree.js
     * </pre>
     * @example
     * <pre>
     * 创建KQI树：
     * var sweetKQITree = new Sweet.tree.KQITree({*});
     * </pre>
     */
    Sweet.tree.KQITree = $.sweet.widgetKqiTree;
}(jQuery));

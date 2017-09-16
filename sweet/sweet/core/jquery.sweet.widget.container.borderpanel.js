/**
 * @fileOverview
 * <pre>
 * 容器组件-Border布局容器
 * 2013/2/21
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    'use strict';
    var defaultContentClass = "sweet-panel-content",
            defaultPanelClass = "sweet-panel-borderpanel",
            helperNSClass = "sweet-panel-borderpanel-helper-ns",
            helperWEClass = "sweet-panel-borderpanel-helper-we";
    var jumperClass = "jumper",
            collapsedClass = "collapsed",
            resizeNSClass = "resize-ns",
            resizeWEClass = "resize-we";
    var NORTH = "north",
            CENTER = "center",
            SOUTH = "south",
            WEST = "west",
            EAST = "east";
    var portions = [CENTER, NORTH, SOUTH, WEST, EAST];
    var resizeBarWidth = 11;

    $.widget("sweet.widgetContainerBorderpanel", $.sweet.widgetContainerPanel, /** @lends Sweet.panel.BorderPanel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-container-borderpanel]:",
        type: "borderPanel",
        options: /** @lends Sweet.panel.BorderPanel.prototype*/{
            /**
             * 子组件间的间隔距离，如果设置了resizable，则固定为11px
             * @type Number
             * @default 5
             */
            padding: 5,
            /**
             * 拖动改变大小时，是否实时调整内部子组件大小
             * @type Boolean
             * @default false
             */
            rtSizing: false,
            /**
             * 各区间隐藏模式,支持两种visibility和display,默认为display:none
             * @type Boolean
             * @default true
             */
            hiddenModel: true,
            items: null
        },
        /**
         * @description 设置指定方位子组件的大小
         * @param {String} portion 方位 [north/center/south/west/east]
         * @param {Number} width 宽度
         * @param {Number} height 高度
         */
        setItemSize: function(portion, width, height) {
            if (!$.inArray(portion, portions)) {
                return;
            }

            if (!$.isNull(width)) {
                this.initSize[portion].width = width;
            }
            if (!$.isNull(height)) {
                this.initSize[portion].height = height;
            }

            this._doLayout();
            return;
        },
        _getCanvasObject : function(){
            var me = this,
                    result = null,
                    opt = me.options,
                    len = opt.items ? opt.items.length : 0;
            if(len === 1){
                result = opt.items[0].getCanvasObject();
            } else if(len > 1){
                //因为会出横向滚动条，所以要拿table的宽度
                var containerEl = me.renderEl,
                        h = containerEl.height(),
                        w = containerEl.width();
                result = $("<canvas>").attr({
                    width : w,
                    height : h
                });
                result = result[0];
                //将容器中的组件按flowpanel来进行布局并整合到result这个canvas上
                var padding = opt.padding,
                        x = 0, y = 0,
                        resultc = result.getContext("2d");
                var scn = [NORTH, CENTER, SOUTH],
                        wce = [WEST, CENTER, EAST];
                //先在北南向寻找布局
                for(var i = 0; i < scn.length; i++){
                    var portion = scn[i],
                            item = me._getItemByPortion(portion);
                    if($.isNull(item)){
                        continue;
                    }
                    //如果中间有item，则必须在这个方向上还有其它的item才算，否则此item可能是其它方向上的
                    if(portion === CENTER){
                        var nextPortion = scn[i+1],
                                nextItem = me._getItemByPortion(nextPortion),
                                prePortion = scn[i-1],
                                preItem = me._getItemByPortion(prePortion);
                        if($.isNull(nextItem) && $.isNull(preItem)){
                            continue;
                        }
                    }
                    //确定item后进行，根据方向画在一个canvas上
                    var itw = item.getWidth(),
                            ith = item.getHeight(),
                            itemCanvs;
                    if($.isNotNull(itemCanvs) && $.isFunction(itemCanvs.getContext)){
                        var imgc = itemCanvs.getContext("2d"),
                                imgd = imgc.getImageData(0, 0, itw, ith);
                        //将每一个canvs放在result上，这里要计算坐标位置
                        resultc.putImageData(imgd, x, y);
                        y += ith + (i === len -1 ? 0: padding);
                    }
                }
                //再在东西向寻找布局
                for(var i = 0; i < wce.length; i++){
                    var portion = wce[i],
                            item = me._getItemByPortion(portion);
                    if($.isNull(item)){
                        continue;
                    }
                    //如果中间有item，则必须在这个方向上还有其它的item才算，否则此item可能是其它方向上的
                    if(portion === CENTER){
                        var nextPortion = wce[i+1],
                                nextItem = me._getItemByPortion(nextPortion),
                                prePortion = wce[i-1],
                                preItem = me._getItemByPortion(prePortion);
                        if($.isNull(nextItem) && $.isNull(preItem)){
                            continue;
                        }
                    }
                    //确定item后进行，根据方向画在一个canvas上
                    var itw = item.getWidth(),
                            ith = item.getHeight(),
                            itemCanvs;
                    if($.isNotNull(itemCanvs) && $.isFunction(itemCanvs.getContext)){
                        var imgc = itemCanvs.getContext("2d"),
                                imgd = imgc.getImageData(0, 0, itw, ith);
                        //将每一个canvs放在result上，这里要计算坐标位置
                        resultc.putImageData(imgd, x, y);
                        y += itw + (i === len -1 ? 0: padding);
                    }
                }
            }
            return result;
        },
		/**
         * @description 有resizable时，触发此button的点击事件
         */
		resizeBtnClick : function(){
            var me = this;
            if(me.handleEl){
                me.handleEl.click();
            }
        },
        /**
         * @private
         * @description 根据portion从items数组中取得对象
         * @param {String} portion 位置名称
         */
        _getItemByPortion: function(portion) {
            var items = this.options.items;
            var obj = null;
            var objPortion = null;

            if ($.isNull(portion)) {
                return null;
            }

            // 按portion查找
            for (var i = 0; i < items.length; i++) {
                obj = items[i];
                if (obj === null) {
                    continue;
                }

                objPortion = this._getItemPortion(obj);

                if (objPortion === null) {
                    continue;
                }

                if (objPortion === portion) {
                    return obj;
                }
            }
            return null;
        },
        /**
         * @private
         * @description 根据portion获取区域对象
         * @param {String} portion 区域名称
         * @returns {Object} 区域对象
         */
        _getAreaByPortion: function(portion) {
            var me = this;
            var id = "#" + me.options.id + "-portion-" + portion;
            return $(id);
        },
        /**
         * @private
         * @description 根据portion获取区域对象间隔或调整把手
         * @param {String} portion 区域名称
         * @returns {Object} Gap对象
         */
        _getGapByPortion: function(portion) {
            var me = this;
            var id = "#" + me.options.id + "-gap-" + portion;
            return $(id);
        },
        /**
         * @private
         * @description 获取Item的方位信息
         * @param {Object} item 项目对象
         * @returns {String} 方位名称
         */
        _getItemPortion: function(item) {
            if (item === null) {
                return null;
            }

            if ($.isPlainObject(item)) {
                if (item.portion) {
                    return item.portion;
                } else {
                    return CENTER;
                }
            } else {
                if (item.options.portion) {
                    return item.options.portion;
                } else {
                    return CENTER;
                }
            }
        },
        /**
         * @private
         * @description 如果item是PlainObject，把属性设置到item的options中
         * @param {Object} item 项目
         */
        _buildItemOptions: function(item) {
            if (!$.isPlainObject(item) || item.hasOwnProperty("options")) {
                return;
            }

            var temp = {};
            var key = null;

            for (key in item) {
                if (item.hasOwnProperty(key)) {
                    temp[key] = item[key];
                }
            }

            item.options = temp;
        },
        /**
         * @private
         * @descripition 重新计算布局
         */
        _doLayout: function() {
            var me = this;
            var initSize = me.initSize;
            var item = null;
            var area = null;
            var gap = null;
            var width = 0, height = 0;
            var gapWidth, gapHeight;
            var centerWidth = 0, centerHeight = 0;
            var totalGapWidth = 0, totalGapHeight = 0;
            var padding = me.options.padding;
            var rHeight = 0;

            var indexBuf = [];
            var containerWidth, containerHeight;
            var portion = "";
            var i = 0;

            // 渲染前禁止进入
            if (!me.rendered || me.options.items.length === 0) {
                return;
            }

            // 调用父类的_doLayout，调整panelContentEl的大小
            this._super();

            // 可用区域大小
            containerWidth = centerWidth = me.panelContentEl.width();
            containerHeight = centerHeight = me.panelContentEl.height();

            // 计算Gap大小
            for (i = 0; i < portions.length; i++) {
                portion = portions[i];
                item = me._getItemByPortion(portion);
                if (item === null) {
                    continue;
                }

                if (portion === NORTH || portion === SOUTH) {
                    gapHeight = (item.options && item.options.resizable) ? resizeBarWidth : padding;
                    totalGapHeight += gapHeight;
                } else if (portion === WEST || portion === EAST) {
                    gapWidth = (item.options && item.options.resizable) ? resizeBarWidth : padding;
                    totalGapWidth += gapWidth;
                }
            }

            // 首次布局，记录内部元素的初始配置宽高
            function _calculateInitSize() {
                for (i = 0; i < portions.length; i++) {
                    portion = portions[i];
                    item = me._getItemByPortion(portion);
                    if ($.isNull(initSize[portion])) {
                        if (item === null) {
                            initSize[portion] = {
                                width: 0,
                                height: 0
                            };
                        } else {
                            initSize[portion] = {
                                width: item.options.width,
                                height: item.options.height
                            };
                        }
                    }
                }
            }
            _calculateInitSize();

            // North/South区域，宽度设置为auto，高度为内部对象的高度
            function _layoutNS() {
                indexBuf = [NORTH, SOUTH];
                for (i = 0; i < indexBuf.length; i++) {
                    portion = indexBuf[i];
                    item = me._getItemByPortion(portion);
                    area = me._getAreaByPortion(portion);
                    gap = me._getGapByPortion(portion);
                    if (item !== null) {
                        width = containerWidth;
                        height = me.initSize[portion].height;
                        if (typeof height === 'string' && height.match(/\d+%/)) {
                            height = Math.round((containerHeight - totalGapHeight) * parseInt(height, 10) / 100);
                        }
                        if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                            area.css({visibility: ""});
                        }
                        area.width(width).height(height).show();

                        gapWidth = width;
                        gapHeight = (item.options && item.options.resizable) ? resizeBarWidth : padding;
                        gap.width(gapWidth).height(gapHeight).show();

                        if (!$.isPlainObject(item)) {
                            item.setWH(width, height);
                            rHeight = item.getHeight();
                            if (rHeight !== height && height !== 0) {
                                height = rHeight;
                                area.height(height);
                            }
                        }
                        // 如果高度为0,设置为隐藏
                        if (height === 0) {
                            if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                                area.css({visibility: "hidden"});
                            } else {
                                area.hide();
                            }
                        }
                        centerHeight = centerHeight - height - gapHeight;
                    } else {

                        if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                            area.width(width).height(0).css({visibility: "hidden"});
                        } else {
                            area.width(width).height(0).hide();
                        }
                        gap.width(width).height(0).hide();
                    }
                }
            }
            _layoutNS();

            // Middel容器高度
            item = me.panelContentEl.children("div[class=portion-middle]");
            item.width(containerWidth);
            item.height(centerHeight);

            // West/East区域，宽度为内部对象的宽度，高度设置为100%
            function _layoutWE() {
                indexBuf = [WEST, EAST];
                for (i = 0; i < indexBuf.length; i++) {
                    portion = indexBuf[i];
                    item = me._getItemByPortion(portion);
                    area = me._getAreaByPortion(portion);
                    gap = me._getGapByPortion(portion);
                    if (item !== null) {
                        width = initSize[portion].width;
                        height = centerHeight;
                        if (typeof width === 'string' && width.match(/\d+%/)) {
                            width = Math.round((containerWidth - totalGapWidth) * parseInt(width, 10) / 100);
                        }
                        if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                            area.css({visibility: ""});
                        }
                        area.width(width).height(height).show();

                        gapWidth = (item.options && item.options.resizable) ? resizeBarWidth : padding;
                        gapHeight = height;
                        gap.width(gapWidth).height(gapHeight).show();

                        if (!$.isPlainObject(item)) {
                            item.setWH(width, height);
                        }
                        // 折叠、展开按钮，垂直居中
                        if (gap.children().length > 0) {
                            var handleEl = gap.children().first();
                            var margin = Math.round((gap.height() - handleEl.height()) / 2);
                            handleEl.css("margin-top", margin + "px");
                        }
                        // 如果宽度为0,设置为隐藏
                        if (width === 0) {
                            if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                                area.css({visibility: "hidden"});
                            } else {
                                area.hide();
                            }
                        }
                        centerWidth = centerWidth - width - gapWidth;
                    } else {
                        if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                            area.width(0).height(height).css({visibility: "hidden"});
                        } else {
                            area.width(0).height(height).hide();
                        }
                        gap.width(0).height(padding).hide();
                    }
                }
            }
            _layoutWE();

            // Center区域，占满剩下的区域
            item = me._getItemByPortion(CENTER);
            area = me._getAreaByPortion(CENTER);
            if (item !== null) {
                area.width(centerWidth).height(centerHeight);
                if (!$.isPlainObject(item)) {
                    item.setWidth(centerWidth);
                    item.setHeight(centerHeight);
                }
            } else {
                me._error("Center portion is required!");
            }
        },
        /**
         * @private
         * @description 取得指定方位区域的最大尺寸
         * @param {String} portion 方位名称
         * @returns {Object} 宽、高
         */
        _getMaxSize: function(portion) {
            var me = this;

            // 先从配置中取
            var item = me._getItemByPortion(portion);
            var maxWidth = item.options.maxWidth || item.maxWidth || 0;
            var maxHeight = item.options.maxHeight || item.maxHeight || 0;

            // 如果配置中没有，按挤压完中间区域计算
            if (maxWidth === 0 && (portion === WEST || portion === EAST)) {
                maxWidth = me._getAreaByPortion(portion).width() + me._getAreaByPortion(CENTER).width();
            }
            if (maxHeight === 0 && (portion === NORTH || portion === SOUTH)) {
                maxHeight = me._getAreaByPortion(portion).height() + me._getAreaByPortion(CENTER).height();
            }

            return {width: maxWidth, height: maxHeight};
        },
        /**
         * @private
         * @description 取得指定方位区域的最小尺寸
         * @param {String} portion 方位名称
         * @returns {Object} 宽、高
         */
        _getMinSize: function(portion) {
            var me = this;

            // 从配置中取，如果没有配置，缺省为0
            var item = me._getItemByPortion(portion);
            var minWidth = item.options.minWidth || item.minWidth || 0;
            var minHeight = item.options.minHeight || item.minHeight || 0;

            return {width: minWidth, height: minHeight};
        },
        /**
         * @private
         * @description 调整大小
         * @param {String} portion 方位名称
         */
        _resizable: function(portion) {
            var me = this;
            var gap = null;
            var item = null;
            var area = null;
            var handle = null;
            var startX = 0;
            var startY = 0;
            var startWidth = 0;
            var startHeight = 0;
            var dragging = false;
            var maxSize = null;
            var minSize = null;
            var helper = null;
            var attrOldSize = "oldSize";

            gap = me._getGapByPortion(portion);
            item = me._getItemByPortion(portion);
            area = me._getAreaByPortion(portion);
            if (gap === null || portion === CENTER) {
                return;
            }

            // 鼠标按下，启动拖动
            function _mouseDown(event) {
                // 点击jumper时，不按拖动处理
                if ($(event.target).hasClass(jumperClass)) {
                    return false;
                }

                startX = event.pageX;
                startY = event.pageY;
                startWidth = area.width();
                startHeight = area.height();
                maxSize = me._getMaxSize(portion);
                minSize = me._getMinSize(portion);
                dragging = true;

                $(document).bind("mousemove", _mouseMove);
                $(document).bind("mouseup", _mouseUp);

                if (me.options.rtSizing === false) {
                    helper = $("<div>").appendTo(me.panelContentEl);
                    helper.css('z-index', -1);
                    helper.css({left: gap.position().left, top: gap.position().top});
                    helper.width(gap.width()).height(gap.height());

                    if (portion === NORTH || portion === SOUTH) {
                        helper.addClass(helperNSClass);
                    } else {
                        helper.addClass(helperWEClass);
                    }
                }

                event.preventDefault();
            }

            // 鼠标抬起，停止拖动
            function _mouseUp() {
                if (dragging === true) {
                    dragging = false;
                    $(document).unbind("mousemove", _mouseMove);
                    $(document).unbind("mouseup", _mouseUp);
                }

                if (me.options.rtSizing === false) {
                    helper.remove();
                    me._doLayout();
                }
            }

            // 鼠标移动，调整大小
            function _mouseMove(event) {
                if (!dragging) {
                    return;
                }

                var offsetX = event.pageX - startX;
                var offsetY = event.pageY - startY;
                var width = 0;
                var height = 0;

                // 重新计算可变区域大小
                if (portion === NORTH) {
                    height = startHeight + offsetY;
                    height = height > maxSize.height ? maxSize.height : height;
                    height = height < minSize.height ? minSize.height : height;
                    me.initSize[portion].height = height;
                }

                if (portion === SOUTH) {
                    height = startHeight - offsetY;
                    height = height > maxSize.height ? maxSize.height : height;
                    height = height < minSize.height ? minSize.height : height;
                    me.initSize[portion].height = height;
                }

                if (portion === WEST) {
                    width = startWidth + offsetX;
                    width = width > maxSize.width ? maxSize.width : width;
                    width = width < minSize.width ? minSize.width : width;
                    me.initSize[portion].width = width;
                }

                if (portion === EAST) {
                    width = startWidth - offsetX;
                    width = width > maxSize.width ? maxSize.width : width;
                    width = width < minSize.width ? minSize.width : width;
                    me.initSize[portion].width = width;
                }

                // 重置折叠、展开按钮
                area.attr(attrOldSize, null);
                handle.removeClass(collapsedClass);

                // 如果不需要实时调整大小，只调整helper的位置
                if (me.options.rtSizing === false) {
                    if (helper.css("z-index") === "-1") {
                        helper.css('z-index', $.getMaxZIndex());
                    }

                    if (portion === NORTH) {
                        helper.css("top", gap.position().top + (height - startHeight));
                    } else if (portion === SOUTH) {
                        helper.css("top", gap.position().top - (height - startHeight));
                    } else if (portion === WEST) {
                        helper.css("left", gap.position().left + (width - startWidth));
                    } else if (portion === EAST) {
                        helper.css("left", gap.position().left - (width - startWidth));
                    }
                } else {
                    // 刷新布局
                    me._doLayout();
                }
                event.preventDefault();
            }

            // 折叠/展开 Portion
            function _expand() {
                var oldSize = area.attr(attrOldSize);

                if (portion === NORTH || portion === SOUTH) {
                    // 如果没有设置标志，则执行折叠
                    if ($.isNull(oldSize)) {
                        area.attr(attrOldSize, area.height());
                        handle.addClass(collapsedClass);
                        me.initSize[portion].height = 0;
                    } else {
                        // 否则，执行展开
                        area.attr(attrOldSize, null);
                        handle.removeClass(collapsedClass);
                        me.initSize[portion].height = parseInt(oldSize, 10);
                    }
                } else {
                    // 如果没有设置标志，则执行折叠
                    if ($.isNull(oldSize)) {
                        area.attr(attrOldSize, area.width());
                        handle.addClass(collapsedClass);
                        me.initSize[portion].width = 0;
                    } else {
                        // 否则，执行展开
                        area.attr(attrOldSize, null);
                        handle.removeClass(collapsedClass);
                        me.initSize[portion].width = parseInt(oldSize, 10);
                    }
                }

                // 刷新布局
                me._doLayout();
            }

            // 是否需要调整大小
            if (item !== null && item.options.resizable === true) {
                // 创建折叠/展开按钮
                handle = $("<div>").addClass(jumperClass).appendTo(gap);
				me.handleEl = handle;
				
                // 点击按钮，或双击拖动条，折叠或展开区域
                handle.bind("click", _expand);
                gap.bind("dblclick", _expand);

                // 鼠标在GAP上按下，开始拖动调整大小
                gap.bind("mousedown", _mouseDown);

                if (portion === NORTH || portion === SOUTH) {
                    gap.addClass(resizeNSClass);
                }

                if (portion === WEST || portion === EAST) {
                    gap.addClass(resizeWEClass);
                }
            } else {
                handle = gap.children().first();
                if (handle.length > 0) {
                    handle.unbind();
                }
                gap.unbind();
                gap.empty();
                gap.removeClass(resizeWEClass).removeClass(resizeNSClass);
            }
        },
        /**
         * @private
         * @description 渲染一个项目到指定方位
         * @param {Object} item 待渲染的项目
         * @param {String} portion 方位名称
         */
        _renderItem: function(item, portion) {
            var me = this;
            var area = null;
            var gap = null;

            area = me._getAreaByPortion(portion);
            gap = me._getGapByPortion(portion);

            if (item === null) {
                return;
            }

            // 渲染
            if ($.isFunction(item.render)) {
                item.render(area.attr('id'));
            } else if (!$.isNull(item.html)) {
                area.html(item.html);
            }

            // 显示间隔
            if (gap !== null) {
                gap.show();
            }

            // 调整尺寸的处理
            me._resizable(portion);
        },
        /**
         * @private
         * @description 新增一个项目到指定方位
         * @param {Object} item 待增加的项目
         */
        _addItem: function(item) {
            if (item === null) {
                return false;
            }

            var me = this;
            me._buildItemOptions(item);
            var portion = me._getItemPortion(item);
			
			var area = me._getAreaByPortion(portion);
            var gap = me._getGapByPortion(portion);
			if(area){
				area.show();
			}
			if(gap){
				gap.show();
			}
			
            // 检查有没有重复
            if (me._getItemByPortion(portion) !== null) {
                return false;
            } else {
                me.initSize[portion] = {width: item.options.width, height: item.options.height};
                me.options.items.push(item);
                me._renderItem(item, portion);
            }

            // 刷新布局
            me._doLayout();

            return true;
        },
        /**
         * @private
         * @description 删除指定方位的组件
         * @param {String} portion 方位
         */
        _removeItem: function(portion) {
            var me = this;
            var area = null;
            var gap = null;
            var item = null;
            var i = 0;

            area = me._getAreaByPortion(portion);
            gap = me._getGapByPortion(portion);
            item = me._getItemByPortion(portion);

            if (item === null) {
                return false;
            }

            // 销毁组件
            try {
                // 找出下标
                for (i = 0; i < me.options.items.length; i++) {
                    if (me.options.items[i] === item) {
                        break;
                    }
                }

                // 销毁
                if ($.isFunction(item.destroy)) {
                    item.destroy();
                }

                // 从列表删除
                me.options.items.splice(i, 1);
            }
            catch (e) {
            }

            // 调整大小
            area.empty();
            if (false === me.options.hiddenModel || "false" === me.options.hiddenModel) {
                area.css({visibility: ""});
            }
            area.width(0).height(0).hide();
            gap.width(0).height(0).hide();
            me.initSize[portion].width = 0;
            me.initSize[portion].height = 0;

            me._doLayout();

            // 调整尺寸的处理
            me._resizable(portion);

            return true;
        },
        /**
         * @private
         * @description 渲染布局和内部对象
         */
        _widgetRender: function() {
            var me = this;
            var item = null;
            var portion = "";
            var i = 0;

            if (!me.containerEl) {
                return;
            }

            this._super();

            // 将组件附着到容器内
            for (i = 0; i < portions.length; i++) {
                portion = portions[i];
                item = me._getItemByPortion(portion);
                me._buildItemOptions(item);
                me._renderItem(item, portion);
            }
        },
        /**
         * @private
         * @description 创建Border布局
         */
        _createPanelContent: function() {
            var me = this;
            var options = me.options;
            var borderPanel = me.panelContentEl = $("<div>");
            var portionIdPrefix = options.id + "-portion-";
            var gapIdPrefix = options.id + "-gap-";
            var portionEl = null;
            var portionClassPrefix = "portion-";
            var gapClassPrefix = "gap-";

            me.initSize = {};

            if (options.items == null) {
                options.items = [];
            }

            // ===================================================
            // 第一行
            // North
            $("<div>").attr("id", portionIdPrefix + NORTH)
                    .addClass(portionClassPrefix + NORTH)
                    .appendTo(borderPanel);

            // 间隔条
            $("<div>").attr("id", gapIdPrefix + NORTH)
                    .addClass(gapClassPrefix + NORTH)
                    .hide()
                    .appendTo(borderPanel);

            // ===================================================
            // 第二行
            portionEl = $("<div>").attr("id", portionIdPrefix + "middle")
                    .addClass(portionClassPrefix + "middle")
                    .appendTo(borderPanel);

            // West
            $("<div>").attr("id", portionIdPrefix + WEST)
                    .addClass(portionClassPrefix + WEST)
                    .appendTo(portionEl);

            // 间隔条
            $("<div>").attr("id", gapIdPrefix + WEST)
                    .addClass(gapClassPrefix + WEST)
                    .hide()
                    .appendTo(portionEl);

            // Center
            $("<div>").attr("id", portionIdPrefix + CENTER)
                    .addClass(portionClassPrefix + CENTER)
                    .appendTo(portionEl);

            // 间隔条
            $("<div>").attr("id", gapIdPrefix + EAST)
                    .addClass(gapClassPrefix + EAST)
                    .hide()
                    .appendTo(portionEl);

            // East
            $("<div>").attr("id", portionIdPrefix + EAST)
                    .addClass(portionClassPrefix + EAST)
                    .appendTo(portionEl);

            // ===================================================
            // 第三行
            // 间隔条
            $("<div>").attr("id", gapIdPrefix + SOUTH)
                    .addClass(gapClassPrefix + SOUTH)
                    .hide()
                    .appendTo(borderPanel);

            // South
            $("<div>").attr("id", portionIdPrefix + SOUTH)
                    .addClass(portionClassPrefix + SOUTH)
                    .appendTo(borderPanel);

            // 初始大小全部设置为0
            borderPanel.find("div").width(0).height(0);

            // 设置样式
            borderPanel.addClass(defaultContentClass).addClass(defaultPanelClass);
        },
        /**
         * @description 动态添加组件
         * @param {Object/Array} items 组件对象或组件对象数组
         */
        _addItems: function(items) {
            var me = this;
            var i;

            if ($.isNull(items)) {
                return;
            }

            // 循环添加
            for (i = 0; i < items.length; i++) {
                me._addItem(items[i]);
            }
        },
        /**
         * @description 删除内容
         * @param items
         * @private
         */
        _removeItems: function(items) {
            var me = this;

            // 如果输入参数为空，删除所有内容
            if ($.isNull(items)) {
                me._removeItem(NORTH);
                me._removeItem(SOUTH);
                me._removeItem(WEST);
                me._removeItem(EAST);
                me._removeItem(CENTER);
                return;
            }

            // 按指定索引删除
            for (var i = 0; i < items.length; i++) {
                me._removeItem(items[i]);
            }
        },
        /**
         * @description 销毁组件
         * @private
         */
        _destroyWidget: function() {
            this._removeItems();
            this._super();
        }
    });

    /**
     * @description Border布局容器
     * @class
     * @param {Object} options 配置项
     * @extends Sweet.container.Panel
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.container.js
     * jquery.sweet.widget.container.panel.js
     * </pre>
     * @example
     * 创建Border布局容器：
     * var sweetBorderPanel = Sweet.panel.BorderPanel({
     *      items : [
     *          item_center, // width/height自动计算
     *          item_north,  // width为自动计算
     *          item_south,  // width为自动计算
     *          item_west,   // height为自动计算
     *          item_east    // height为自动计算
     *      ]
     * });
     * 注：item通过辅助属性portion来指定位置
     */
    Sweet.panel.BorderPanel = $.sweet.widgetContainerBorderpanel;
}(jQuery));

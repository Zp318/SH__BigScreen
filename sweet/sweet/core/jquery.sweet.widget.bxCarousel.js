/**
 * @fileOverview  
 * <pre>
 * 组件--积分卡
 * 2013.2.1
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    /**
     * 保存组件对象
     * 
     */
    var carouselComponent = "sweet-bxCarousel-component",
        itemDespCls = "sweet-bxCarousel-item-desp",
        itemDespTextCls = "sweet-bxCarousel-item-desp-text",
        // 可视窗口
        carouselVisibleWin = "sweet-bxCarousel-visibleWin",
        // 左右移动箭头背景透明
        ArrorPreDivGrayCls = "sweet-bxCarousel-ArrowPreDiv-gray",
        // 左右移动箭头透明
        carouselArrowGrayCls = "sweet-bxCarousel-arrow-gray",

        // ------kpi积分卡------
        // 左右移动箭头背景
        leftArrorPreDivCls = "sweet-bxCarousel-leftArrow-preDiv",
        rightArrorPreDivCls = "sweet-bxCarousel-rightArrow-preDiv",
        upArrorPreDivCls = "sweet-bxCarousel-upArrow-preDiv",
        downArrorPreDivCls = "sweet-bxCarousel-downArrow-preDiv",
        // 左右移动箭头
        carouselLeftArrow = "sweet-bxCarousel-arrow-left",
        carouselRightArrow = "sweet-bxCarousel-arrow-right",
        carouselUpArrow = "sweet-bxCarousel-arrow-up",
        carouselDownArrow = "sweet-bxCarousel-arrow-down",
        // li
        carouselLi = "sweet-bxCarousel-li",
        carouselLiActive = "sweet-bxCarousel-li-active",
        carouselLiChild = "sweet-bxCarousel-liChild",
        carouselLiChildActive = "sweet-bxCarousel-liChild-active",
        carouselLiGrendChildLeft = "sweet-bxCarousel-liGrendChild-left",
        carouselLiGrendChildRight = "sweet-bxCarousel-liGrendChild-right",
        // 指标图片
        arrowRedDown = "sweet-bxCarousel-arrow-down-red",
        arrowRedUp = "sweet-bxCarousel-arrow-up-red",
        arrowYellowDown = "sweet-bxCarousel-arrow-down-yel",
        arrowYellowUp = "sweet-bxCarousel-arrow-up-yel",
        arrowGreenDown = "sweet-bxCarousel-arrow-down-green",
        arrowGreenUp = "sweet-bxCarousel-arrow-up-green",
        carouselLiEmLeft = "sweet-bxCarousel-liEm-left",

        // ------图片卡------
        // 左右移动箭头背景
        leftArrorPreDivImgCls = "sweet-bxCarousel-leftArrow-preDiv-img",
        rightArrorPreDivImgCls = "sweet-bxCarousel-rightArrow-preDiv-img",
        upArrorPreDivImgCls = "sweet-bxCarousel-upArrow-preDiv-img",
        downArrorPreDivImgCls = "sweet-bxCarousel-downArrow-preDiv-img",
        // li
        carouselLiUser = "sweet-bxCarousel-li-userImage",
        carouselUserDefindPic = "sweet-bxCarousel-liEm-userDefindPic",
        carouselUserPicUnselect = "sweet-bxCarousel-userDefindPic-unSelect",
        carouselUserPicSelect = "sweet-bxCarousel-userDefindPic-select",
        carouselUserDefindPicTick = "sweet-bxCarousel-userDefindPic-tick",
        // 左右移动箭头
        carouselUserDefindArrorLeftCls = "sweet-bxCarousel-arrow-left-image",
        carouselUserDefindArrorRightCls = "sweet-bxCarousel-arrow-right-image",
        carouselUserDefindArrorUpCls = "sweet-bxCarousel-arrow-up-image",
        carouselUserDefindArrorDownCls = "sweet-bxCarousel-arrow-down-image",
        liWidth, liHeight,
        timerLeft, timerRight,
        scrollParams = {"interval": 1, "speed": 1, "acceleration": 0};
        
    $.widget("sweet.widgetBxCarousel", $.sweet.widget, /** @lends Sweet.BxCarousel.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-bxCarousel]",
        type: "bxCarousel",
        eventNames: /** @lends Sweet.BxCarousel.prototype*/{
            /**
            * @event
            * @description 点击图片事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            click: "点击图片事件",
            /**
            * @event
            * @description 选项的change事件
            * @param {Event} evt 事件对象
            * @param {Object} data 点击的节点的数据信息
            */
            change : "选项的change事件"
        },
        options: /** @lends Sweet.BxCarousel.prototype*/{
            /**
             * 基础数据
             * @type Object
             * @default null
             */
            data: null,
            /**
             * 是否竖排放
             * @type Boolean
             * @default false
             */
            vertical: false,
            /**
             * 横排布局时，是否需要选择图片后显示相应的图片说明
             * @type Boolean
             * @default false
             */
            isItemSelectDesp : false
        },
        /**
         * 重新设置基础数据
         * @param {object} 组件data值
         */
        setData : function(data) {
            var me = this;
            me.preKey = "";
            me.ulEl.text("");
            me._creatUL(data);
            me._doLayout();
        },
        /**
         * 组件渲染
         * @private
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.carouselEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            me.carouselEl.externalWidth(width);
        },
        
        /**
         * @private
         * @description 获取组件宽度
         */
        _getWidth: function() {
            var me = this;
            return me.carouselEl.externalWidth();
        },
        
        /**
         * @private
         * @description 获取组件高度
         */
        _getHeight: function() {
            var me = this;
            return me.carouselEl.externalHeight();
        },
        
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me._setWidth(width);
            me._setHeight(height);
        },

        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            me.carouselEl.externalHeight(height);
        },

        /**
         * 组件重绘
         * @private
         */
        _doLayout : function() {
            var me = this,
                    options = me.options;
            // 渲染前禁止进入
            if (!me.rendered) {
                return;
            }
            liWidth = me.visibleWin.children("ul").children("li:eq(0)").outerWidth(true) || 0;
            liHeight = me.visibleWin.children("ul").children("li:eq(0)").outerHeight(true) || 0;
            me._initArrow();
            // 水平放置
            if(!options.vertical){
                me._doLayoutH();
            } 
            // 垂直放置
            else {
                me._doLayoutV();
            }
        },

        /**
         * @private
         * @description 横向布局
         */
        _doLayoutH: function() {
            var me = this,
                    options = me.options,
                    carouseWidth = options.width, carouseHeight = options.height,
                    visibleWinWidth = carouseWidth, visibleWinHeight = carouseHeight,
                    ulWidth, ulHeight,
                    x1, x2, y1, y2;

            me.ulEl.css("left", "0px");
            // 有数据
            if(liWidth) {
                carouseHeight = liHeight;
                itemDespH = me._selectedItemDespEl ? me._selectedItemDespEl.height() : 0;
                me.carouselEl.width(carouseWidth).height(carouseHeight + itemDespH);
                visibleWinWidth = me.carouselEl.width();
                visibleWinHeight = liHeight;
                me.visibleWin.css("float", "left").width(visibleWinWidth).height(visibleWinHeight);
                // 计算宽度
                ulWidth = me.dataObj.length * liWidth + 2;
                me.ulEl.width(ulWidth);

                // kpi积分卡与图片积分卡的箭头样式不同，需分类处理
                if(!me.image) {
                    // 箭头背景样式
                    me.leftArrowPreDivEl.height(me.carouselEl.externalHeight())
                            .addClass(leftArrorPreDivCls);
                    me.rightArrowPreDivEl.height(me.carouselEl.externalHeight())
                            .addClass(rightArrorPreDivCls);

                    // 上下箭头左右居中
                    var arrowTop = (liHeight - me.leftArrowA.height())/2;
                    me.leftArrowA.height(me.carouselEl.externalHeight());
                    me.rightArrowA.height(me.carouselEl.externalHeight());
                } else {
                    me.visibleWin.css({"margin-left": "3px", "margin-right": "3px"})
                            .width(visibleWinWidth-6);
                    // 箭头背景样式
                    me.leftArrowPreDivEl.removeClass(leftArrorPreDivCls).addClass(leftArrorPreDivImgCls);
                    me.rightArrowPreDivEl.removeClass(rightArrorPreDivCls).addClass(rightArrorPreDivImgCls);
                    // 箭头样式
                    me.leftArrowA.removeClass(carouselLeftArrow)
                            .addClass(carouselUserDefindArrorLeftCls);
                    me.rightArrowA.removeClass(carouselRightArrow)
                            .addClass(carouselUserDefindArrorRightCls);
                }

                // 可视窗口大于ul时，隐藏箭头
                if(me.visibleWin.width() >= me.ulEl.width()) {
                    me._hideArrors();
                    if(me.draggable) {
                        me.ulEl.draggable("destroy");
                        me.draggable = false;
                    }
                } else {
                    // 动态设定z-index
                    me._setArrayZindex();

                    // 计算拖动范围
                    x1 = me.visibleWin.offset().left - 
                            (parseFloat(me.ulEl.width()) - parseFloat(me.visibleWin.width()));
                    x2 = me.visibleWin.offset().left;
                    y1 = me.visibleWin.offset().top;
                    y2 = y1 + liHeight;
                    if(me.draggable) {
                        me.ulEl.draggable("destroy");
                        me.draggable = false;
                    }
                    me.ulEl.draggable({ 
                        axis:"x", 
                        cursor: "move", 
                        stop: function(event, ui){
                            me._changeArrow();
                        }
                    });
                    me.draggable = true;
                } 
            } 
            // 没有数据
            else {
                me.carouselEl.width(me.leftArrowA.outerWidth(true) * 2 + 10).height(98);
            }
        },

        /**
         * @private
         * @description 竖向布局
         */
        _doLayoutV: function() {
            var me = this,
                    options = me.options,
                    carouseWidth = options.width, carouseHeight = options.height,
                    visibleWinWidth = carouseWidth, visibleWinHeight = carouseHeight,
                    ulWidth, ulHeight,
                    x1, x2, y1, y2;
            // 有数据
            var marginArrow;
            me.ulEl.css("top", "0px");
            if(liWidth) {
                carouseWidth = liWidth;
                // 组件大小
                me.carouselEl.width(carouseWidth).height(carouseHeight);
                visibleWinWidth = liWidth;
                visibleWinHeight = me.carouselEl.height();
                // 可视区大小
                me.visibleWin.width(visibleWinWidth).height(visibleWinHeight);
                // ul大小
                ulWidth = liWidth;
                me.ulEl.width(ulWidth);

                // kpi积分卡与图片积分卡的箭头样式不同，需分类处理
                if(!me.image) {
                    // 箭头背景样式
                    me.leftArrowPreDivEl.width(me.carouselEl.externalWidth())
                            .addClass(upArrorPreDivCls);
                    me.rightArrowPreDivEl.width(me.carouselEl.externalWidth())
                            .addClass(downArrorPreDivCls);

                    // 上下箭头左右居中
                    marginArrow = (ulWidth - me.leftArrowA.width()) / 2;
                    me.leftArrowA.width(me.carouselEl.externalWidth());
                    me.rightArrowA.width(me.carouselEl.externalWidth());
                } else {
                    me.visibleWin.css({"margin-top": "3px", "margin-bottom": "3px"})
                            .height(visibleWinHeight-6);
                    // 箭头背景样式
                    me.leftArrowPreDivEl.removeClass(upArrorPreDivCls).addClass(upArrorPreDivImgCls);
                    me.rightArrowPreDivEl.removeClass(downArrorPreDivCls).addClass(downArrorPreDivImgCls);
                    // 箭头样式
                    me.leftArrowA.removeClass(carouselUpArrow)
                            .addClass(carouselUserDefindArrorUpCls);
                    me.rightArrowA.removeClass(carouselDownArrow)
                            .addClass(carouselUserDefindArrorDownCls);
                }

                // 可视窗口大于ul时，隐藏箭头
                if(me.visibleWin.height() > me.ulEl.height()) {
                    me._hideArrors();
                    if(me.draggable) {
                        me.ulEl.draggable("destroy");
                        me.draggable = false;
                    }
                } else {
                    // 动态设定z-index
                    me._setArrayZindex();
                    
                    // 计算拖动范围
                    ulHeight = me.ulEl.height();
                    x1 = me.ulEl.offset().left;
                    x2 = x1 + liWidth;
                    y1 = me.visibleWin.offset().top - 
                            (parseFloat(me.ulEl.height()) - parseFloat(me.visibleWin.height()));
                    y2 = me.visibleWin.offset().top;
                    // 拖动
                    if(me.draggable) {
                        me.ulEl.draggable("destroy");
                        me.draggable = false;
                    }
                    me.ulEl.draggable({ 
                        axis:"y", 
                        cursor: "move", 
                        stop: function(event, ui){
                            me._changeArrow();
                        }
                    });
                    me.draggable = true;
                } 
            }
            // 没有数据
            else {
                me.visibleWin.height(50);
                me.carouselEl.width(201).height(me.leftArrowA.outerHeight(true) * 2 + 10);
            }
        },

        /**
         * @private
         * @description 箭头初始化
         */
        _initArrow: function() {
            var me = this,
                    options = me.options,
                    arrow1Cls =(options.vertical ? carouselUpArrow : carouselLeftArrow),
                    arrow2Cls = (options.vertical ? carouselDownArrow : carouselRightArrow);

            me.leftArrowParentDiv.hide();
            me.leftArrowPreDivEl.removeClass().addClass(ArrorPreDivGrayCls);
            me.leftArrowA.removeClass().addClass(arrow1Cls + " " + carouselArrowGrayCls);
            me.rightArrowParentDiv.hide();
            me.rightArrowPreDivEl.removeClass();
            me.rightArrowA.removeClass().addClass(arrow2Cls);
        },

        /**
         * @private
         * @description 隐藏箭头
         */
        _hideArrors: function() {
            var me = this;
            me.leftArrowA.addClass(carouselArrowGrayCls);
            me.rightArrowA.addClass(carouselArrowGrayCls);
            me.leftArrowPreDivEl.addClass(ArrorPreDivGrayCls);
            me.rightArrowPreDivEl.addClass(ArrorPreDivGrayCls);
        },

        /**
         * @private
         * @description 动态设定z-index
         */
        _setArrayZindex: function() {
            var me = this,
                    maxIndex = $.getMaxZIndex(me.leftArrowPreDivEl.css("z-index"));
            me.leftArrowPreDivEl.css({"z-index": maxIndex});
            me.rightArrowPreDivEl.css({"z-index": maxIndex});
            maxIndex = maxIndex + 10;
            me.leftArrowA.css({"z-index": maxIndex});
            me.rightArrowA.css({"z-index": maxIndex});
        },

        /**
         * @private
         * @description 创建form组件总入口
         */
        _createSweetWidget: function() {
            var me = this,
                opt = me.options,
                carouselEl = me.carouselEl = $("<div>").addClass(carouselComponent);
            carouselEl.attr("id", me.options.id);

            me.eventMap = {};    //记录事件的处理回调，现在只有change事件
            me.preKey = "";    //记录当前选择的选项的key值
            // 生成左/上箭头
            me._createLeftArrow();
            // 生成可是窗口
            var visibleWin = me.visibleWin = $("<div>").addClass(carouselVisibleWin)
                        .appendTo(me.carouselEl),
                ulEl = me.ulEl = $("<ul>").appendTo(visibleWin);
            me._creatUL();
            //创建文字说明框
            if(opt.isItemSelectDesp && !opt.vertical){
                me._selectedItemDespEl = $("<div>").attr("id", opt.id + "-item-desp")
                    .addClass(itemDespCls).appendTo(carouselEl); 

                me._despEl = $("<div>").attr("id", opt.id + "-item-desp-text")
                    .addClass(itemDespTextCls).appendTo(me._selectedItemDespEl); 
            }
            
            // 生成右/下箭头
            me._createRightArrow();
        },
        /**
         * @private
         * @description 创建左箭头
         */
        _createLeftArrow : function() {
            var me = this,
                    options = me.options,
                    leftArrowParentDiv = me.leftArrowParentDiv = $("<div>").hide().appendTo(me.carouselEl),
                    leftArrowPreDivEl = me.leftArrowPreDivEl = $("<div>").addClass(ArrorPreDivGrayCls)
                        .appendTo(me.leftArrowParentDiv),
                    arrow1Cls =(options.vertical ? carouselUpArrow : carouselLeftArrow);

            var leftArrowA = me.leftArrowA = $("<a>").addClass(arrow1Cls + " " + carouselArrowGrayCls)
                        .appendTo(me.leftArrowParentDiv);
        },
        /**
         * @private
         * @description 创建右箭头
         */
        _createRightArrow : function() {
            var me = this,
                    options = me.options,
                    rightArrowParentDiv = me.rightArrowParentDiv = $("<div>").hide().appendTo(me.carouselEl),
                    rightArrowPreDivEl = me.rightArrowPreDivEl = $("<div>").appendTo(rightArrowParentDiv),
                    arrow2Cls = (options.vertical ? carouselDownArrow : carouselRightArrow);

            var rightArrowA = me.rightArrowA = $("<a>").addClass(arrow2Cls)
                        .appendTo(rightArrowParentDiv);
        },
        /**
         * @private
         * @description 创建ul
         * @param {object} 数据
         */
        _creatUL :function(data0) {
            var me = this,
                options = me.options,
                // 保存$("<li>")对象的数组
                dataObj = me.dataObj = {},
                liArrarObj = me.liArrarObj = {},
                // 缓存数据
                data = data0 || options.data;
            if(!data) {
                return;
            }
            dataObj.length = 0;
            liArrarObj.length = 0;
            me.image = true;
            $.each(data, function(index, obj){
                me.image = (me.image && obj.image);
                var liEl = $("<li>").appendTo(me.ulEl),
                        liChildEl = $("<div>").attr("value", obj.value).appendTo(liEl);
                var paramObj;
                // 自动生成图片
                if(!obj.image) {
                    liEl.addClass(carouselLi);
                    liChildEl.addClass(carouselLiChild);
                    var arrowImage = me._getArrowImage(obj),
                            leftChar = me._getCharacterColor(obj).left,
                            rightChar = me._getCharacterColor(obj).right,
                            liGrandchildElLeft = $("<div>").addClass(carouselLiGrendChildLeft)
                                .appendTo(liChildEl),
                            spanDomLeft = $("<span>").addClass(arrowImage)
                                .appendTo(liGrandchildElLeft),
                            emDomLeft = $("<em>").html(obj.offset)
                                .addClass(carouselLiEmLeft)
                                .appendTo(liGrandchildElLeft),
                            liGrandchildElRight = $("<div>").addClass(carouselLiGrendChildRight)
                                .appendTo(liChildEl),
                            spanDomRight = $("<span>").html(obj.value)
                                .appendTo(liGrandchildElRight),
                            emDomRight = $("<em>").html(obj.text)
                                .appendTo(liGrandchildElRight);
                    emDomLeft.css("color", leftChar);
                    spanDomRight.css("color", rightChar);
                    paramObj = liEl;
                } 
                // 外部给定图片路径
                else {
                    liEl.addClass(carouselLiUser);
                    liChildEl.addClass(carouselUserPicUnselect);
                    var aEl = $("<a>").css("background-image", "url(" + obj.imagePath + ")")
                            .addClass(carouselUserDefindPic)
                            .appendTo(liChildEl),
                        selectImageEl = $("<a>").appendTo(liChildEl);
                    paramObj = liChildEl;
                }
                // 添加点击事件
                liChildEl.bind("click", {"me": me, "obj": paramObj, "image": obj.image, "key": obj.value, "desp" : obj.desp}, 
                        me._clickImage);
                // 保存数据
                dataObj[obj.value] = obj;
                dataObj.length++;
                // 保存li对象
                liArrarObj[obj.value] = liEl;
                liArrarObj.length++;
            });
        },
        /**
         * @private
         * 组件创建后执行的操作，子类继承实现
         */
        _afterCreateSweetWidget : function() {
            var me = this;
            // 可视窗口事件
            me.visibleWin.bind("mouseover", function() {
                if(!me.leftArrowPreDivEl.hasClass(ArrorPreDivGrayCls)) {
                    me.leftArrowParentDiv.show();
                }
                if(!me.rightArrowPreDivEl.hasClass(ArrorPreDivGrayCls)) {
                    me.rightArrowParentDiv.show();
                }
            });
            me.visibleWin.bind("mouseout", function() {
                me.leftArrowParentDiv.hide();
                me.rightArrowParentDiv.hide();
            });
            // 左箭头事件
            me.leftArrowA.bind("mousedown", function() {
                me._clickLeftArrow();
            });
            me.leftArrowA.bind("mouseup", function() {
                clearInterval(timerLeft);
            });
            me.leftArrowA.bind("mouseover", function() {
                me.leftArrowParentDiv.show();
                me.rightArrowParentDiv.show();
            });
            me.leftArrowA.bind("mouseout", function() {
                me.leftArrowParentDiv.hide();
                me.rightArrowParentDiv.hide();
                clearInterval(timerLeft);
            });
            // 右箭头事件
            me.rightArrowA.bind("mousedown", function() {
                me._clickRightArrow();
            });
            me.rightArrowA.bind("mouseup", function() {
                clearInterval(timerRight);
            });
            me.rightArrowA.bind("mouseover", function() {
                me.leftArrowParentDiv.show();
                me.rightArrowParentDiv.show();
            });
            me.rightArrowA.bind("mouseout", function() {
                me.leftArrowParentDiv.hide();
                me.rightArrowParentDiv.hide();
                clearInterval(timerRight);
            });
            // 鼠标滚轮滚动事件
            me.ulEl.attr("id", this.options.id + "-ul-id");
            me.ulEl.onMouseWheel(me.ulEl.get(0), function (event, data) {
                if(data.delta > 0) {
                    me._mouseWheelLeft(50);
                } else {
                    me._mouseWheelRight(50);
                }
                return false;
            });
        },
        /**
         * @private
         * @description 外部图片的点击事件
         * @param {object} event事件
         */
        _clickImage: function(event) {
            var me = event.data.me,
                    obj = event.data.obj,
                    image = event.data.image ? true : false,
                    desp = event.data.desp,
                    key = event.data.key;
            me._setActiveItemCSS(image, obj, me, key);   //改变被选中选项的样式

            

            //优先调用addListener的click事件
            if(me.eventMap && me.eventMap.click){
                me.eventMap.click.call(this, me.dataObj[key]);
            } else {
                me._trigger("click", me, me.dataObj[key]);
            }
            //触发change事件，仅在这一次选择的选项与上一次记录的不一样时才触发
            if(me.preKey !== key && me.eventMap && me.eventMap.change){
                me.eventMap.change.call(this, me.dataObj[key]);
            }
            me.preKey = key;    //更新记录这一次click的key
        },
        /**
         * @private
         * @description 设置选中的项的样式
         * @param {boolean} image   是否有image图片
         * @param {object} obj    选中项的对象
         * @param {object} bxCarObj   此组件对象
         */
        _setActiveItemCSS : function(image, obj, bxCarObj, key){
            var me = bxCarObj;   //此组件对象
            var desp = me.dataObj[key] ? me.dataObj[key].desp : "";
            //显示说明文字
            if(me.options.isItemSelectDesp && !me.options.vertical){
                desp = desp.split("\n").join("<br>");
                me._despEl.html(desp).attr("title", desp.split("<br>").join(""));
            }
            
            if(!image) {
                // 清除其他的样式
                me.ulEl.children("." + carouselLiActive)
                        .children("." + carouselLiChildActive)
                        .removeClass()
                        .addClass(carouselLiChild);
                me.ulEl.children("." + carouselLiActive)
                        .removeClass()
                        .addClass(carouselLi);
                // 修改当前被点击的图片样式
                obj.removeClass().addClass(carouselLiActive);
                obj.children("div ." + carouselLiChild)
                        .removeClass()
                        .addClass(carouselLiChildActive);
            } else {
                // 清除其他的样式
                me.ulEl.children("li").children("div ." + carouselUserPicSelect)
                        .children("a:eq(1)")
                        .removeClass();
                me.ulEl.children("li").children("div ." + carouselUserPicSelect)
                        .removeClass()
                        .addClass(carouselUserPicUnselect);
                // 修改当前被点击的图片样式
                obj.removeClass()
                        .addClass(carouselUserPicSelect);
                obj.children("a:eq(1)").addClass(carouselUserDefindPicTick);
            }
        },
        /**
         * @private
         * @description 获取图片样式
         * @param {object} 一条数据
         */
        _getArrowImage : function(val) {
            var arrowImage, subtractionSign = new RegExp("-");
            if(subtractionSign.test(val.offset)) {
                if("r" === val.color) {
                    arrowImage = arrowRedDown;
                } else if("y" === val.color){
                    arrowImage = arrowYellowDown;
                } else if("g" === val.color){
                    arrowImage = arrowGreenDown;
                }
            } else {
                if("r" === val.color) {
                    arrowImage = arrowRedUp;
                } else if("y" === val.color){
                    arrowImage = arrowYellowUp;
                } else if("g" === val.color){
                    arrowImage = arrowGreenUp;
                }
            }
            return arrowImage;
        },
        /**
         * @private
         * @description 获取字符颜色
         * @param {object} 一条数据
         */
        _getCharacterColor : function(val) {
            var charColor = {};
            if("r" === val.color) {
                charColor.left = "#FF0000";
                charColor.right = "#CD0100";
            } else if("y" === val.color){
                charColor.left = "#F4C042";
                charColor.right = "#E3A81C";
            } else if("g" === val.color){
                charColor.left = "#00C11B";
                charColor.right = "#009615";
            }
            return charColor;
        },
        /**
         * @private
         * @description 左移图片
         */
        _clickLeftArrow : function(){
            var me = this,
                    options = me.options,
                    left = parseFloat(me.ulEl.css("left")),
                    top = parseFloat(me.ulEl.css("top")),
                    t = 0,
                    times = 0;
            if(me.leftArrowA.hasClass(carouselArrowGrayCls)) {
                return;
            }
            function scrollImageToLeft(){
                t = times++ * scrollParams.interval;
                var range = (scrollParams.speed + scrollParams.acceleration * t) * t;
                if(!options.vertical) {
                    if(left < 0) {
                        left = left + range;
                        me.ulEl.css("left", left + "px");
                    } else {
                        clearInterval(timerLeft);
                    }
                } else {
                    if(top < 0) {
                        top = top + range;
                        me.ulEl.css("top", top + "px");
                    } else {
                        clearInterval(timerLeft);
                    }
                }
                me._changeArrow();
            }

            timerLeft = setInterval(scrollImageToLeft, scrollParams.interval);
        },
        /**
         * @private
         * @description 右移图片
         */
        _clickRightArrow : function(){
            var me = this,
                    options = me.options,
                    left = parseFloat(me.ulEl.css("left")),
                    top = parseFloat(me.ulEl.css("top")),
                    t = 0,
                    times = 0,
                    diffOfWinAndUl;
            if(me.rightArrowA.hasClass(carouselArrowGrayCls)) {
                return;
            }
            function scrollImageToRight(){
                t = times++ * scrollParams.interval;
                var range = (scrollParams.speed + scrollParams.acceleration * t) * t;
                if(!options.vertical) {
                    diffOfWinAndUl = parseFloat(me.visibleWin.width()) - parseFloat(me.ulEl.width());
                    if(left > diffOfWinAndUl) {
                        left = left - range;
                        me.ulEl.css("left", left + "px");
                    } else {
                        clearInterval(timerRight);
                    }
                } else {
                    diffOfWinAndUl = parseFloat(me.visibleWin.height()) - parseFloat(me.ulEl.height());
                    if(top > diffOfWinAndUl) {
                        top = top - range;
                        me.ulEl.css("top", top + "px");
                    } else {
                        clearInterval(timerRight);
                    }
                }
                me._changeArrow();
            }

            timerRight = setInterval(scrollImageToRight, scrollParams.interval);
        },
        /**
         * @private
         * @description 鼠标滚轮滚动，左移图片
         * @param {Number} 鼠标滚轮滚动一次左移的像素值
         */
        _mouseWheelLeft: function(range) {
            var me = this,
                    options = me.options,
                    left = parseFloat(me.ulEl.css("left")),
                    top = parseFloat(me.ulEl.css("top"));
            if(!options.vertical) {
                // 横向的计分卡，只有一个图片，直接用鼠标滚动，图片跑到了最右边
                if(left >= 0 || left + me.ulEl.width() < me.visibleWin.width()) {
                    return;
                }
                if(left < 0) {
                    left = left + range;
                    me.ulEl.css("left", left + "px");
                }
            } else {
                // 竖向的计分卡，只有一个图片，直接用鼠标滚动，图片跑到了最下边
                if(top >= 0 || top + me.ulEl.height() < me.visibleWin.height()) {
                    return;
                }
                if(top < 0) {
                    top = top + range;
                    me.ulEl.css("top", top + "px");
                }
            }
            me._changeArrow();
        },
        /**
         * @private
         * @description 鼠标滚轮滚动，右移图片
         * @param {Number} 鼠标滚轮滚动一次右移的像素值
         */
        _mouseWheelRight: function(range) {
            var me = this,
                    options = me.options,
                    left = parseFloat(me.ulEl.css("left")),
                    top = parseFloat(me.ulEl.css("top")),
                    diffOfWinAndUl;
            if(!options.vertical) {
                diffOfWinAndUl = parseFloat(me.visibleWin.width()) - parseFloat(me.ulEl.width());
                // 横向的计分卡，只有一个图片，直接用鼠标滚动，图片跑到了最右边
                if(diffOfWinAndUl > 0) {
                    return;
                }
                if(left > diffOfWinAndUl) {
                    left = left - range;
                    me.ulEl.css("left", left + "px");
                }
            } else {
                diffOfWinAndUl = parseFloat(me.visibleWin.height()) - parseFloat(me.ulEl.height());
                // 竖向的计分卡，只有一个图片，直接用鼠标滚动，图片跑到了最下边
                if(diffOfWinAndUl > 0) {
                    return;
                }
                if(top > diffOfWinAndUl) {
                    top = top - range;
                    me.ulEl.css("top", top + "px");
                }
            }
            me._changeArrow();
        },
        /**
         * @private
         * @description 箭头置灰
         */
        _changeArrow : function() {
            var me = this,
                    options = me.options,
                    diffOfWinAndUl;
            if(!options.vertical) {
                var left = parseFloat(me.ulEl.css("left"));
                diffOfWinAndUl = parseFloat(me.visibleWin.width()) - parseFloat(me.ulEl.width());
                if(left < 0){
                    me.leftArrowA.removeClass(carouselArrowGrayCls);
                    me.leftArrowPreDivEl.removeClass(ArrorPreDivGrayCls);
                } else {
                    me.leftArrowA.addClass(carouselArrowGrayCls);
                    me.leftArrowPreDivEl.addClass(ArrorPreDivGrayCls);
                    me.leftArrowParentDiv.hide();
                    me.ulEl.css("left", 0);
                }
                
                if(left > diffOfWinAndUl){
                    me.rightArrowA.removeClass(carouselArrowGrayCls);
                    me.rightArrowPreDivEl.removeClass(ArrorPreDivGrayCls);
                } else {
                    me.rightArrowA.addClass(carouselArrowGrayCls);
                    me.rightArrowPreDivEl.addClass(ArrorPreDivGrayCls);
                    me.rightArrowParentDiv.hide();
                    me.ulEl.css("left", diffOfWinAndUl);
                }
            } else {
                var top = parseFloat(me.ulEl.css("top"));
                diffOfWinAndUl = parseFloat(me.visibleWin.height()) - parseFloat(me.ulEl.height());
                if(top < 0){
                    me.leftArrowA.removeClass(carouselArrowGrayCls);
                    me.leftArrowPreDivEl.removeClass(ArrorPreDivGrayCls);
                } else {
                    me.leftArrowA.addClass(carouselArrowGrayCls);
                    me.leftArrowPreDivEl.addClass(ArrorPreDivGrayCls);
                    me.leftArrowParentDiv.hide();
                    me.ulEl.css("top", 0);
                }
                
                if(top > diffOfWinAndUl){
                    me.rightArrowA.removeClass(carouselArrowGrayCls);
                    me.rightArrowPreDivEl.removeClass(ArrorPreDivGrayCls);
                } else {
                    me.rightArrowA.addClass(carouselArrowGrayCls);
                    me.rightArrowPreDivEl.addClass(ArrorPreDivGrayCls);
                    me.rightArrowParentDiv.hide();
                    me.ulEl.css("top", diffOfWinAndUl);
                }
            }  
        },
        /**
         * @private
         * @description 去激活注册事件
         */
        _removeListener: function() {
            var me = this;
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(eventName, func) {
                if("click" === eventName) {
                    me.eventMap.click = null;
                }
                if("change" === eventName) {
                    me.eventMap.change = null;
                }
            });
        },
        /**
         * @private
         * 组件注册监听事件
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if("click" === eventName && me.eventMap) {
                    me.eventMap.click = func;
                }
                if("change" === eventName && me.eventMap) {
                    me.eventMap.change = func;
                }
            });
        },
        /**
         * 获取组件值
         * @private
         * @return {function} me._getSelectedText()
         */
        _getValue : function() {
            var me = this,
                    key1 = me.ulEl.children("." + carouselLiActive)
                        .children("." + carouselLiChildActive)
                        .attr("value"),
                    key2 = me.ulEl.children("li")
                        .children("div ." + carouselUserPicSelect)
                        .attr("value");

            return me.dataObj[key1 || key2] || null;
        },
        /**
         * 设置组件值
         * @private
         * @param {object} 组件值
         */
        _setValue : function(val){
            var me = this,
                    data = me.dataObj[val.value],
                    obj = me.liArrarObj[val.value];
            if(data) {
                var hasImage = data.image ? true : false;
                var itemObj = obj;
                if(hasImage){
                    //如果有image，对象使用下面的对象
                    itemObj = obj.children("div");
                }
                me._setActiveItemCSS(hasImage, itemObj, me, val.value);   //改变被选中选项的样式
                
                //触发change事件，仅在这一次选择的选项与上一次记录的不一样时才触发
                if(me.preKey !== val.value && me.eventMap && me.eventMap.change){
                    me.eventMap.change.call(this, data);
                }
                me.preKey = val.value;    //更新记录这一次click的key
            } else {
                me._error("Value does not exist!");
            }
        }
    });

    /**
     * 滑动KPI/积分卡
     * @name Sweet.BxCarousel
     * @class 
     * @extends Sweet.widget
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     *  var data = [
     *      {text : "Perceived Call Success Rate", value : "52.32%", offset : "-14.23%", 
     *       color : "r", data: null, image : false, imagePath: ""},
     *      {text : "业务质量分析效果", value : "8186ms", offset : "8186ms", 
     *       color : "g", data: null, image : false, imagePath: ""},
     *      {text : "业务质量分析效果", value : "38.32%", offset : "-17.23%", 
     *       color : "y", data: null, image : false, imagePath: ""}
     *  ];
     *  sweetCarousel = new Sweet.cmp.kpiCarousel({
     *      width: 500,
     *      data : data,
     *      vertical : false,
     *      renderTo : "sweet-carousel"
     * });
     * </pre>
     */
    Sweet.BxCarousel = $.sweet.widgetBxCarousel;
}(jQuery));

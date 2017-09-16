/**
 * @fileOverview  
 * <pre>
 * 插件--tips提示
 * 2013.2.21
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

/**
 * 提示功能类
 * @name jquery.sweettip
 * @class 
 * @extends 
 * <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.ui.position.js
 * </pre>
 * @example 
 * <pre>
 * var t = $("#testdivid");
 * //出现新的提示
 * t.sweettip();
 * //清除提示
 * t.sweettip("destroy");
 * //立刻出现红色边框
 * t.sweettip("showErrorBorder");
 * //打开提示功能
 * t.sweettip("open");
 * //关闭提示功能
 * t.sweettip("close");
 * </pre>
 */
(function($) {

    var increments = 0,
            modelNone = "none",
            modelSide = "side";

    function addInputRedBoder(elem, obj) {
        //增加文本框上的红色边框
        var type = obj.options.getAttrTipType.call(elem, ",") || obj.options.tipType;
        if ("error" === type) {
            if (elem.hasClass("sweet-form-input-text") || elem.hasClass("sweet-form-combobox-element") || elem.hasClass("sweet-form-comboboxv1-input")) {
                elem.addClass("sweet-tips-input");
                elem.parent().addClass("sweet-tips-inputParent");
            } else if (elem.hasClass("sweet-form-textarea-errorRedBorder")) {
                elem.parent().addClass("sweet-tips-input sweet-tips-inputParent");
            }
        }
    }

    function removeInputRedBoder(elem, obj) {
        //去掉文本框上的红色边框
        var type = obj.options.getAttrTipType.call(elem, ",") || obj.options.tipType;
        if ("error" === type) {
            if (elem.hasClass("sweet-form-input-text") || elem.hasClass("sweet-form-combobox-element") || elem.hasClass("sweet-form-comboboxv1-input")) {
                elem.removeClass("sweet-tips-input");
                elem.parent().removeClass("sweet-tips-inputParent");
            } else if (elem.hasClass("sweet-form-textarea-errorRedBorder")) {
                elem.parent().removeClass("sweet-tips-input sweet-tips-inputParent");
            }
        }
    }

    function addDescribedBy(elem, id) {
        var describedby = (elem.attr("aria-describedby") || "").split(/\s+/);
        describedby.push(id);
        elem
                .data("ui-sweettip-id", id)
                .attr("aria-describedby", $.trim(describedby.join(" ")));
    }

    function removeDescribedBy(elem, obj) {
        var id = elem.data("ui-sweettip-id"),
                describedby = (elem.attr("aria-describedby") || "").split(/\s+/),
                index = $.inArray(id, describedby);
        if (index !== -1) {
            describedby.splice(index, 1);
        }

        elem.removeData("ui-sweettip-id");
        describedby = $.trim(describedby.join(" "));
        if (describedby) {
            elem.attr("aria-describedby", describedby);
        } else {
            elem.removeAttr("aria-describedby");
        }
        //不同的errormodel，去掉文本框上的红色边框的条件不一样
        var type = obj.options.getAttrTipType.call(elem, ",") || obj.options.tipType,
                model = obj.options.getAttrErrorModel.call(elem, ",") || "none";
        if ("error" === type && "side" === model) {
            removeInputRedBoder(elem, obj);
        }
    }

    $.widget("ui.sweettip", {
        version: "1.0",
        options: {
            getAttrTipType: function() {
                var tiptype = $(this).attr("tiptype") || "";
                // Escape title, since we're going from an attribute to raw HTML
                return $("<a>").text(tiptype).html();
            },
            getAttrErrorModel: function() {
                var errormodel = $(this).attr("errormodel") || "";
                // Escape title, since we're going from an attribute to raw HTML
                return $("<a>").text(errormodel).html();
            },
            content: function() {
                // support: IE<9, Opera in jQuery <1.7
                // .text() can't accept undefined, so coerce to a string
                var title = $(this).attr("title") || "";

                // Escape title, since we're going from an attribute to raw HTML
                
                // 转义大于号、小于号，保持<br>的换行功能
                return title.replace(/>/g, "&gt;").replace(/</g, "&lt;")
                        .replace(/&lt;br&gt;/g, "<br>");
            },
            hide: true,
            // Disabled elements have inconsistent behavior across browsers (#8661)
            items: "[title]:not([disabled])",
            position: {
                my: "left+20 top-40",
                at: "right top",
                collision: "flipfit flip"
            },
            show: true,
            sweettipClass: null,
            track: true,
            // callbacks
            close: null,
            open: null,
            /* 添加tipType属性：normal ,error*/
            tipType: "normal",
            /* 添加tipFloat属性：浮动or固定*/
            tipFloat: true
        },
        _create: function() {
            this._on({
                mouseover: "open",
                focusin: "open"
            });

            // IDs of generated sweettips, needed for destroy
            this.sweettips = {};
            // IDs of parent sweettips where we removed the title attribute
            this.parents = {};

            if (this.options.disabled) {
                this._disable();
            }
        },
        _setOption: function(key, value) {
            var that = this;

            if (key === "disabled") {
                this[ value ? "_disable" : "_enable" ]();
                this.options[ key ] = value;
                // disable element style changes
                return;
            }

            this._super(key, value);

            if (key === "content") {
                $.each(this.sweettips, function(id, element) {
                    that._updateContent(element);
                });
            }
        },
        _disable: function() {
            var that = this;

            // close open sweettip
            $.each(this.sweettips, function(id, element) {
                var event = $.Event("blur");
                event.target = event.currentTarget = element[0];
                that.close(event, true);
            });

            // remove title attributes to prevent native sweettip
            this.element.find(this.options.items).addBack().each(function() {
                var element = $(this);
                if (element.is("[title]")) {
                    element
                            .data("ui-sweettip-title", element.attr("title"))
                            .attr("title", "");
                }
            });
        },
        _enable: function() {
            // restore title attributes
            this.element.find(this.options.items).addBack().each(function() {
                var element = $(this);
                if (element.data("ui-sweettip-title")) {
                    element.attr("title", element.data("ui-sweettip-title"));
                }
            });
        },
        // shirunxiang  2013.5.14 仅显示红色边框，外部调用
        showErrorBorder: function(event) {
            var that = this,
                    target = $(event ? event.currentTarget : this.element);
            addInputRedBoder(target, this);
        },
        open: function(event) {
            var that = this,
                    target = $(event ? event.target : this.element)
                    // we need closest here due to mouseover bubbling,
                    // but always pointing at the same event target
                    .closest(this.options.items);

            // No element to show a sweettip for or the sweettip is already open
            if (!target.length || target.data("ui-sweettip-id")) {
                return;
            }

            // SVG中不显示提示，由图表自己处理
            var p = target;
            var tag = p.prop("tagName").toUpperCase();
            while (tag !== "BODY") {
                if (tag === "SVG") {
                    return;
                }
                p = p.parent();
                if (!p || p.length <= 0) {
                    break;
                }
                tag = p.prop("tagName").toUpperCase();
            }

            if (target.attr("title")) {
                var tit = target.data("ui-sweettip-title");
                // title设置为“none”时，表示title属性的值为空
                if (tit && "none" === target.attr("title")) {
                    target.attr("title", "");
                    this._destroy();
                    target.data("ui-sweettip-title", "");
                    this.tipChange = true;
                } else {
                    target.data("ui-sweettip-title", target.attr("title"));
                    this.tipChange = false;
                }
            }

            target.data("ui-sweettip-open", true);

            // kill parent sweettips, custom or native, for hover
            if (event && event.type === "mouseover") {
                target.parents().each(function() {
                    var parent = $(this),
                            blurEvent;
                    if (parent.data("ui-sweettip-open")) {
                        blurEvent = $.Event("blur");
                        blurEvent.target = blurEvent.currentTarget = this;
                        that.close(blurEvent, true);
                    }
                    if (parent.attr("title")) {
                        parent.uniqueId();
                        that.parents[ this.id ] = {
                            element: this,
                            title: parent.attr("title")
                        };
                        parent.attr("title", "");
                    }
                });
            }
            this._updateContent(target, event);
        },
        _updateContent: function(target, event) {
            var content,
                    contentOption = this.options.content,
                    that = this,
                    eventType = event ? event.type : null;

            if (typeof contentOption === "string") {
                return this._open(event, target, contentOption);
            }

            content = contentOption.call(target[0], function(response) {
                // ignore async response if sweettip was closed already
                if (!target.data("ui-sweettip-open")) {
                    return;
                }
                // IE may instantly serve a cached response for ajax requests
                // delay this call to _open so the other call to _open runs first
                that._delay(function() {
                    // jQuery creates a special event for focusin when it doesn't
                    // exist natively. To improve performance, the native event
                    // object is reused and the type is changed. Therefore, we can't
                    // rely on the type being correct after the event finished
                    // bubbling, so we set it back to the previous value. (#8740)
                    if (event) {
                        event.type = eventType;
                    }
                    this._open(event, target, response);
                });
            });
            if (content) {
                this._open(event, target, content);
            }
        },
        _open: function(event, target, content) {
            var sweettip, events, delayedShow,
                    positionOption = $.extend({}, this.options.position);

            if (!content) {


                return;
            }

            // Content can be updated multiple times. If the sweettip already
            // exists, then just update the content and bail.
            sweettip = this._find(target);
            if (sweettip.length) {
                sweettip.find(".ui-sweettip-content").html(content);
                return;
            }

            // if we have a title, clear it to prevent the native sweettip
            // we have to check first to avoid defining a title if none exists
            // (we don't want to cause an element to start matching [title])
            //
            // We use removeAttr only for key events, to allow IE to export the correct
            // accessible attributes. For mouse events, set to empty string to avoid
            // native sweettip showing up (happens only when removing inside mouseover).
            if (target.is("[title]")) {
                if (event && event.type === "mouseover") {
                    target.attr("title", "");
                } else {
                    target.removeAttr("title");
                }
            }

            sweettip = this._sweettip(target);
            addDescribedBy(target, sweettip.attr("id"));
            sweettip.find(".sweet-tip-content").html(content);
            //--begin--问题单号：DTS2014040408912
            sweettip.css({"left": 0, "top": 0});
            var domTip = sweettip.get(0),
                    tipWid = getComputedStyle(domTip, "").width;
            sweettip.width(tipWid);
            //--end--问题单号：DTS2014040408912
            function position(event) {
                positionOption.of = event;
                if (sweettip.is(":hidden")) {
                    return;
                }
                sweettip.position(positionOption);
            }
            if (this.options.track && event && /^mouse/.test(event.type)) {
                this._on(this.document, {
                    mousemove: position
                });
                // trigger once to override element-relative positioning
                position(event);
            } else {
                sweettip.position($.extend({
                    of: target
                }, this.options.position));
            }

            sweettip.hide();

            this._show(sweettip, this.options.show);
            // Handle tracking sweettips that are shown with a delay (#8644). As soon
            // as the sweettip is visible, position the sweettip using the most recent
            // event.
            if (this.options.show && this.options.show.delay) {
                delayedShow = this.delayedShow = setInterval(function() {
                    if (sweettip.is(":visible")) {
                        position(positionOption.of);
                        clearInterval(delayedShow);
                    }
                }, $.fx.interval);
            }

            this._trigger("open", event, {sweettip: sweettip});

            events = {
                keydown: function(event) {
                    if (event.keyCode === $.ui.keyCode.ESCAPE) {
                        var fakeEvent = $.Event(event);
                        fakeEvent.currentTarget = target[0];
                        this.close(fakeEvent, true);
                    }
                },
                remove: function() {
                    this._removesweettip(sweettip);
                }
            };
            if (!event || event.type === "mouseover") {
                events.mouseleave = "close";
                events.focusout = "close";
            }
            if (!event || event.type === "focusin") {
                events.focusout = "close";
            }
            this._on(true, target, events);
        },
        close: function(event) {
            var that = this,
                    target = $(event ? event.currentTarget : this.element),
                    sweettip = this._find(target),
                    type = this.options.getAttrTipType.call(target, ",") || this.options.tipType,
                    model = this.options.getAttrErrorModel.call(target, ",") || "none";
            // disabling closes the sweettip, so we need to track when we're closing
            // to avoid an infinite loop in case the sweettip becomes disabled on close
            // 设置不同tip类型和模式下默认的tipFloat属性
            if ("normal" === type || "error" === type && "none" === model) {
                this.options.tipFloat = true;
            } else if ("error" === type && "side" === model) {
                this.options.tipFloat = false;
            }

            // 添加tipFloat属性，控制提示框是否浮动
            if (!this.options.tipFloat) {
                //如果tip为true且有校验报红,在这种场景下此处将closing置为true,则在下面判断为true直接return,导致tips提示关不掉
                //解决方案:如果非tipFloat时,则提示出直接return保持显示,不应将closing置为true
                removeDescribedBy(target, this);
                if (!this.tipChange) {
                    addInputRedBoder(target, that);
                }
                return;
            }
            if (this.closing) {
                return;
            }

            // Clear the interval for delayed tracking sweettips
            clearInterval(this.delayedShow);

            // only set title if we had one before and title is not changed manually (see comment in _open())
            if (target.data("ui-sweettip-title") && $.isNull(target.attr("title"))) {
                target.attr("title", target.data("ui-sweettip-title"));
            }

            removeDescribedBy(target, this);

            sweettip.stop(true);
            this._hide(sweettip, this.options.hide, function() {
                that._removesweettip($(this));
            });

            target.removeData("ui-sweettip-open");
            this._off(target, "mouseleave focusout keyup");
            // Remove 'remove' binding only on delegated targets
            if (target[0] !== this.element[0]) {
                this._off(target, "remove");
            }
            this._off(this.document, "mousemove");

            if (event && event.type === "mouseleave") {
                $.each(this.parents, function(id, parent) {
                    $(parent.element).attr("title", parent.title);
                    delete that.parents[ id ];
                });
            }

            this.closing = true;
            this._trigger("close", event, {sweettip: sweettip});
            this.closing = false;
        },
        _sweettip: function(element) {
            var id = "ui-sweettip-" + increments++,
                    sweettip = $("<div>")
                    .attr({
                id: id,
                role: "sweettip"
            }),
            model = this.options.getAttrErrorModel.call(element, ",") || "none",
                    type = this.options.getAttrTipType.call(element, ",") || this.options.tipType;
            // 采用side方式提示，追加到目标元素之后
            if ("error" === type && modelSide === model) {
                sweettip.insertAfter(this.element.parent().parent().parent());
            } else {
                sweettip.appendTo(this.document[0].body);
            }
            if ("normal" === type) {
                sweettip.addClass("sweet-tips-tipBox" +
                        (this.options.sweettipClass || ""));
                $("<div>")
                        .addClass("sweet-tip-content sweet-tip-content-normal")
                        .appendTo(sweettip);
            } else if ("error" === type) {
                if ("none" === model) {
                    sweettip.addClass("sweet-tips-errorBox" +
                            (this.options.sweettipClass || ""));
                    var tipContent0 = $("<div>").appendTo(sweettip),
                            imageDiv0 = $("<div>").addClass("sweet-tips-errorImage").appendTo(tipContent0),
                            textDiv0 = $("<div>").addClass("sweet-tip-content sweet-tip-content-error")
                            .appendTo(tipContent0);
                    addInputRedBoder(element, this);
                } else if ("side" === model) {
                    sweettip.addClass("sweet-tips-errorBox-side" +
                            (this.options.sweettipClass || ""));
                    var tipContent = $("<div>").appendTo(sweettip),
                            imageDiv = $("<div>").addClass("sweet-tips-errorImage-side").appendTo(tipContent),
                            textDiv = $("<div>").addClass("sweet-tip-content sweet-tip-content-error")
                            .appendTo(tipContent);
                    addInputRedBoder(element, this);
                    this.options.tipFloat = false;
                    // 下拉框、日期组件的提示在距离上离得宽一些
                    if ((element.hasClass("sweet-form-combobox-element") || element.hasClass("sweet-form-comboboxv1-input")) ||
                            (element.hasClass("sweet-form-input-text") &&
                                    element.parent().attr("class").indexOf("sweet-form-input-date") >= 0)) {
                        this.options.position = {
                            my: "left+43 top+15",
                            at: "right+10 top-17",
                            collision: "flipfit flip"
                        };
                    } else {
                        this.options.position = {
                            my: "left+10 top+15",
                            at: "right+10 top-17",
                            collision: "flipfit flip"
                        };
                    }

                }

            }

            this.sweettips[ id ] = element;
            return sweettip;
        },
        _find: function(target) {
            var id = target.data("ui-sweettip-id");
            return id ? $("#" + id) : $();
        },
        _removesweettip: function(sweettip) {
            sweettip.remove();
            delete this.sweettips[ sweettip.attr("id") ];
        },
        _destroy: function() {
            var that = this;
            // 解决tipModel为“none”时，红色边框不能去掉的问题
            removeInputRedBoder(that.element, that);
            // close open sweettips
            $.each(this.sweettips, function(id, element) {
                // Delegate to close method to handle common cleanup
                var event = $.Event("blur");
                event.target = event.currentTarget = element[0];
                that.close(event, true);

                // Remove immediately; destroying an open sweettip doesn't use the
                // hide animation
                $("#" + id).remove();
                //去掉文本框上的红色边框
                removeInputRedBoder(element, that);
                // Restore the title
                if (element.data("ui-sweettip-title")) {
                    //注释掉了，去掉html自带的提示
                    element.removeData("ui-sweettip-title");
                }
                element.removeAttr("title");
            });
        }
    });

}(jQuery));

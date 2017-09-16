/**
 * @fileOverview sweet组件
 * @date 2012/11/29
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 */
(function() {
    // 初始化sweet
    var global = this;
    if (typeof Sweet === "undefined") {
        global.Sweet = {};
    }

    // 默认语言设置
    var defaultLocale = "en_US",
            localeKey = "locale",
            languages = {"zh_CN": "zh_CN", "en_US": "en_US"};

    /*****************************core begin*****************************************/
    Sweet.core = {};
    // 常量声明
    Sweet.constants = {
        // 默认z-index起始值
        Z_INDEX: 1000,
        KEY: "key",
        VALUE: "value",
        FUNC: "func",
        HREFSCRIPT: "javascript:void(0);",
        // 日志级别
        logLevel: {ERROR: "error", INFO: "info"},
        // 排序类型
        sortType: {ASC: "ASC", DESC: "DESC"},
        // 颜色范围
        colors: ["#369cd8", "#60b2df", "#63ccd3", "#b7e042", "#90cc19", "#f2a14e", "#cf7a37", "#cf4737", "#d07dd0",
            "#9a53e4", "#a5a5a5"],
        // 布局
        layout: {
            HLayout: "HLayout",
            VLayout: "VLayout",
            GridLayout: "gridLayout",
            BorderLayout: "borderLayout",
            AccordionLayout: "accordionLayout",
            CardLayout: "cardLayout"
        },
        //labelItem图片类型
        imgType:{
            INDEX: "index",
            DIM: "dim",
            CUSTOM_INDEX:"customizedIndex"
        },
        // 对齐方式
        align: {
            LEFT: "left",
            RIGHT: "right",
            CENTER: "center",
            TOP: "top",
            MIDDLE: 'middle',
            BOTTOM: 'bottom'
        },
        // 每月天数
        MONTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        // 键盘ascii编码
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },
        // 标点符号
        symbol: {
            COLON: ":",
            EQUAL: "=",
            LIKE: "LIKE",
            NOTEQUAL: "<>",
            EQNULL: "NULL",
            NOTNULL: "NOTNULL",
            LT: "<",
            GT: ">"
        },
        fontSize: 12,
        // 语言类型
        language: {
            KEY: "locale",
            ZH_CN: "zh_CN",
            EN_US: "en_US"
        },
        // 数据类型
        dataType: {
            STRING: "string",
            NUMBER: "number",
            DATE: "date",
            BOOL: "bool",
            LIST: "list"
        },
        //chart type
        graphType: {
            LINE: "line",
            AREA: "area",
            COLUMN: "column",
            BAR: "bar",
            PIE: "pie",
            MIX_COLUMN_LINE: "columnline"
        },
        chart: {
            fontFamily: "Tahoma",
            textColor: "#696d7d",
            fontSize: {
                min : 10,
                normal: 12,
                larger: 14
            },
            titleCfg: {
                labelColor: "#3c3c3c",
                labelAlpha: 1
            }
        },
        axisType: {
            VALUE: "value",
            CATEGORY: "category"
        },
        // 操作类型
        operType: {
			SETTING_STYLE1: "setting_style_1",
            ADD: "add",
            MODIFY: "modify",
            DELETE: "delete",
            MOVE: "move",
            ACTIVE: "active",
            TERMINATE: "terminate",
            SAVEAS: "save",
            CONFIRM: "confirm",
            PLUS: "plus",
            MINUS: "minus",
            EDIT: "edit",
            CLOSE: "close",
            PAUSE: "pause",
            START: "start",
            RESET: "reset",
            DETAIL: "detail",
            SETTING: "setting",
            CRITICAL: "critical",
            MAJOR: "major",
            MINOR: "minor",
            WARNING: "warning",
            WARNING_R: "warning_r",
            CRITICAL_R: "critical_r",
            CUSTOM_1:"custom_1",
            CUSTOM_2:"custom_2",
            CUSTOM_3:"custom_3",
            CUSTOM_4:"custom_4",
            CUSTOM_5:"custom_5",
            CUSTOM_6:"custom_6",
            CUSTOM_7:"custom_7",
            IMPORT: "import",
            EXPORT: "export",
			PRINT: "print",
            REFRESH: "refresh",
            FOLDER: "folder",
            CATEGORY: "category",
            VIEW: "view",
            FAVORITE_ADD: "favorite_add",
            FAVORITE_REMOVE: "favorite_remove",
            LAYOUT: "layout",
            DASHBOARD: "dashboard",
            DASHBOARD_SETTING: "dashboard_setting",
            ENTER_FULLSCREEN: "enter_fullscreen",
            EXIT_FULLSCREEN: "exit_fullscreen",
            LOCK: "lock",
            UNLOCK: "unlock",
            ADDNODE: "addNode",
            ADDCHILDREN: "addChildren"
        },
        // tip类型操作
        tipAttr: {
            TYPE_NORMAL: "normal",
            TYPE_ERROR: "error",
            MODEL_NORMAL: "none",
            MODEL_SIDE: "side"
        },
        //ip配置属性
        ipType: {
            VERSION4: "v4",
            VERSION6: "v6",
            VERSION: "v"
        },
        //记分卡常量
        scoreCard: {
            ROW: 2,
            NUM: 5,
            TYPE: "line",
            LINE_COLOR: "#99a5af",
            FILL_COLOR: "#d1dfec",
            WIDTH: "50px",
            HEIGHT: "18px",
            SPOT_COLOR: "#99a5af",
            MAX_SPOT_COLOR: "",
            MIN_SPOT_COLOR: "",
            LINE_WIDTH: 2,
            SPOT_RADIUS: 2,
            NO_VALUE: "--",
            CHAR_NUM: 2
        },
        //数值颜色
        numColor: {
            GREEN: "green",
            RED: "red",
            YELLOW: "yellow"
        },
        //与上周期的值相比
        differType: {
            EQUAL: "equal",
            INCREASE: "increase",
            DECREASE: "decrease"
        },
        //错误类型
        errorType: {
            UNCONNECTED: "server_unconnected",
            UNKNOWN: "server_unknown",
            COMMON: "common_error"
        },
        //间距
        gap: {
            IMG_TEXT: 40
        },
        //元素宽度
        elWidth: {
            MIN_WIDTH: 400,
            DIV_WIDTH: 620
        },
        // 按钮的图标类型
        btnImageType: {
            INDEX: "index",
            DIM: "dim",
            ADD: "add",
            MODIFY: "modify",
            DELETE: "delete",
            MOVE_TO: "moveto",
            ACTIVE: "active",
            TERMINATE: "terminate"
        },
        //双向列表按钮
        listWindowButton: {
            RIGHT: ">",
            LEFT: "<",
            ALL_RIGHT: ">>",
            ALL_LEFT: "<<"
        },
        // 类名称
        className: {
            MASK: "sweet-mask",
            DIALOG: "sweet-dialog-bg",
            FLOAT_WINDOW: "sweet-float-bg"
        },
        // 导出类型
        exportType: {
            CSV: "csv",
            XLS: "xls",
            PDF: "pdf"
        },
        // Overflow的处理类型
        overflow: {
            AUTO: "auto",
            HIDDEN: "hidden"
        },
        // z-index步进值
        Z_INDEX_STEP: 10
    };

    // 组件路径
    if (SweetLoad && SweetLoad.basePath) {
        Sweet.libPath = SweetLoad.basePath;
    } else {
        Sweet.libPath = "../";
    }
    // amcharts图片路径
    Sweet.amchartsImagePath = Sweet.libPath + "lib/amcharts/amcharts/images/";

    //地图小区图片路径
    Sweet.supermapThirdJsPath = Sweet.libPath + "lib/supermap/layer";
    Sweet.supermapImagePath = {
        defaultCell: Sweet.libPath + "themes/default/core/images/map/cellDef.png",
        overCell: Sweet.libPath + "themes/default/core/images/map/cellIn.png"
    };

    // 默认日志级别设定
    Sweet.logLevel = Sweet.constants.logLevel.INFO;

    // 组件对象
    Sweet._widgets = {};
    // 图表类
    Sweet.chart = {};
    // 表单类
    Sweet.form = {};
    // 对话框类
    Sweet.Dialog = {};
    // 对话框类别名
    Sweet.Msg = {};
    // 列表组件
    Sweet.list = {};
    // 容器
    Sweet.container = {};
    // 面板组件
    Sweet.panel = {};
    // Portal组件
    Sweet.portal = {};
    // 表格组件
    Sweet.grid = {};
    // menu组件
    Sweet.menu = {};
    // 树组件
    Sweet.tree = {};
    // core国际化资源
    Sweet.core.i18n = {};
    //Calculator组件
    Sweet.Calculator = {};

    // Reader类组件
    Sweet.Reader = {};

    // Store类组件
    Sweet.Store = {};

    // 定时器组件
    Sweet.Task = {};
    
    //地图组件
    Sweet.MapCfg = {};

    /**
     * @description 获取组件对象
     * @param {String} id 组件ID
     */
    Sweet.getWidget = function(id) {
        if ($.isNull(id)) {
            $.error("Input parameter id is empty!");
            return null;
        }

        return Sweet._widgets[id];
    };

    /** 
     * @description 设置国际化资源
     * @param {String} language 语言 
     */
    Sweet.setLocale = function(language) {
        if ($.isNull(language)) {
            $.error("Input parameter language is empty!");
            return null;
        }
        // core包国际化
        if (I18N && I18N.core && I18N.core[language]) {
            Sweet.core.i18n = I18N.core[language];
        }
        // components包国际化
        if (I18N && I18N.cmp && I18N.cmp[language]) {
            Sweet.cmp.i18n = I18N.cmp[language];
        }
        // 业务国际化
        if (I18N && I18N.business && I18N.business[language]) {
            BusinessI18N = I18N.business[language];
        }
    };

    /**
     * @description 获取当前显示语言信息
     * @return {String} en_US：英文 zh_CN：中文
     */
    Sweet.getLocale = function() {
        var locale = $.cookie.get(localeKey),
                language = languages[locale];

        return language ? language : defaultLocale;
    };

    /**
     * @description 重绘组件
     */
    Sweet.resize = function() {
        var widgets = {};
        // 优先处理容器布局类
        $.each(Sweet._widgets, function(id, obj) {
            if ("gridPanel" === obj.type ||
                    "HPanel" === obj.type ||
                    "VPanel" === obj.type) {
                obj.doLayout();
            } else {
                widgets[id] = obj;
            }
        });

        $.each(widgets, function(id, obj) {
            obj.doLayout();
        });
    };

    /**
     * @private
     * @description 框架统一管理，关闭浮动窗口
     */
    Sweet._closeFloatPanel = function() {
        $.each(Sweet._widgets, function(id, obj) {
            obj._closeFloatPanel();
        });
    };

    // 注册监听window对象变化事件
    $(window).resize(function() {
        // window发生变化，20ms后重绘组件
        //======DTS2014070305004 start
        //此class保持和jquery.sweetmask.js中的要保持一致
        var maskEl = $(".sweet-mask-all");
        if(maskEl && maskEl.length > 0){
            maskEl.width($(document).width()).height($(document).height());
        }
        //======DTS2014070305004 end
    });

    /**
     * @private
     * @description 框架统一管理，设置cookie
     * @param {String/Number} id 延时ID
     */
    Sweet._changeLoadTime = function(id) {
        // 延迟修改锁屏时间的起始时间（如连续点击，只执行最后一次点击事件）
        Sweet.Task.Delay.start({
            id: id,
            run: function() {
                var myDate = new Date();
                $.cookie.set("timeNum", myDate.getTime(), null);
            },
            delay: 350
        });
    };

    /**
     * @private
     * @description 在页面点击鼠标时，关闭ECM菜单
     */
    Sweet._closeECMMenu = function() {
        if (top.clickHideMenu) {
            top.clickHideMenu();
        }
    };

    /**
     * @private
     * @description Sweet组件的垃圾回收处理
     */
    Sweet._gc = function() {
        Sweet.Task.Timeout.start({
            id: "sweet-gc",
            run: function() {
                var logPrefix = "[Sweet-gc]: ",
                        beginDate = $.date.getMilliseconds(),
                        endDate;
                $.log(logPrefix + "Begin GC!!!!!!!!!!!!!!!!");
                $.each(Sweet._widgets, function(index, obj) {
                    if ((obj.rendered || obj.getWidgetElFlag) && 0 === $("#" + obj.options.id).length) {
                        obj.destroy();
                    }
                });
                endDate = $.date.getMilliseconds();
                $.log(logPrefix + "End GC!!! Time-consuming = " + (endDate - beginDate) + "ms");
            },
            interval: 600000
        });
    };

    // 捕捉文档页面点击事件
    $(document).ready(function() {
        // 点击左键
        $("body").bind("click", function(event) {
            // 框架统一管理，20ms后关闭浮动窗口
            setTimeout(Sweet._closeFloatPanel, 20);
            Sweet._changeLoadTime("delayClickChangeLoadTime");
            Sweet._closeECMMenu();
        });

        // 点击右键
        $("body").bind("contextmenu", function(event) {
            // 框架统一管理，20ms后关闭浮动窗口
            if ($.isIE()) {
                // IE下弹出缺省上下文菜单后，会阻塞处理，所以不做延时处理
                Sweet._closeFloatPanel();
            }
            else {
                setTimeout(Sweet._closeFloatPanel, 20);
            }
            Sweet._changeLoadTime("delayContextmenuChangeLoadTime");
            Sweet._closeECMMenu();
        });

        // keydown
        $("body").bind("keydown", function(event) {
            Sweet._changeLoadTime("delayKeydownChangeLoadTime");
        });

        // mouseup
        $("body").bind("mouseup", function(event) {
            Sweet._changeLoadTime("delayMouseupChangeLoadTime");
        });

        // 页面加载完后，Sweet组件自己的垃圾回收机制开始运行
        Sweet._gc();

        // 默认启用SweetUI提示功能
        Sweet.ToolTip.enable();
    });
    /*****************************core end*******************************************/

    /*****************************component begin************************************/
    Sweet.cmp = {};
    // component组件国际化资源
    Sweet.cmp.i18n = {};
    /*****************************component end**************************************/

    // 设置默认语言生效
    Sweet.setLocale($.cookie.get(localeKey) ? $.cookie.get(localeKey) : defaultLocale);

    /**
     * @description Sweet组件库ajax请求
     */
    Sweet.Ajax = {
        /**
         * @param {Number} ajax个数计数器
         */
        _ajaxCount: 0,
        /**
         * @param {Number} ajax请求超时事件全局配置，默认60000，单位毫秒
         */
        timeout: 60000,
        /**
         * @description ajax请求
         * @param {Object} config ajax请求配置参数，格式为
         * {
         *  url： "http://domain//examples",    // 请求地址
         *  async: true/false,                  // 是同步还是异步请求，默认异步
         *  data: {value="1"},                  // 发送到服务器数据
         *  type: "post",                       // 请求类型，默认post
         *  dataType: "json",                   // 返回数据类型，默认json
         *  success: Function,                  // 请求成功的回调函数
         *  error: Function,                    // 请求失败时回调函数
         *  loadMask: true/false                // 是否有遮罩，默认true
         *  timeout : 60000                     // 超时设置，默认为60000，单位毫秒
         *  beforeRequest: Function             // 发送请求前处理
         *  afterRequest: Function              // 发送请求后处理,在error和success调用之后才会调用此回调
         * }
         */
        request: function(config) {
            var successFun = config && $.isFunction(config.success) ? config.success : $.noop;
            var errorFun = config && $.isFunction(config.error) ? config.error : $.noop;
            var defaultConfig = {
                async: true,
                type: "post",
                dataType: "json",
                loadMask: true,
                timeout : 60000,
                beforeRequest: $.noop,
                afterRequest: $.noop
            },
            tempConfig = $.extend({}, defaultConfig, config);
            //sweet中封装success和error，防止遮罩去不掉的情况(success或error中出错，中断了程序的执行)
            tempConfig.success = function(data, textStatus, jqXHR){
                Sweet.Ajax._end(tempConfig.loadMask);
                successFun(data, textStatus, jqXHR);
                delete successFun;
            };
            tempConfig.error = function(XMLHttpRequest, textStatus, errorThrown){
                Sweet.Ajax._end(tempConfig.loadMask);
                errorFun(XMLHttpRequest, textStatus, errorThrown);
                delete errorFun;
            };
            // 发送请求前处理
            tempConfig.beforeSend = function(req) {
                Sweet.Ajax._start(tempConfig.loadMask, req);
				var tokenKeyDom = $("meta[name='_csrf']"),
					headKeyDom = $("meta[name='_csrf_header']"),
					headKey = headKeyDom ? headKeyDom.attr("content") : "",
					tokenKey = tokenKeyDom ? tokenKeyDom.attr("content") : "";
				
				if(headKey && tokenKey){
					req.setRequestHeader(headKey, tokenKey);
				}
                tempConfig.beforeRequest(this, req);
            };
            // 请求完成后处理
            tempConfig.complete = function(req) {
                tempConfig.afterRequest(this, req);
            };
            return $.ajax(tempConfig);
        },
        /**
         * @description ajax请求发出前处理
         * @private
         * @param {Boolean} loadMask 是否加遮罩
         * @param {Object} XMLHttpRequest 请求信息
         */
        _start: function(loadMask, XMLHttpRequest) {
            if (!loadMask) {
                return false;
            }
            if (0 === Sweet.Ajax._ajaxCount) {
                $(document).sweetMask({
                    maskAll: true,
                    loading: true
                });
            }
            Sweet.Ajax._ajaxCount++;
            $.log("start ajaxCount:" + Sweet.Ajax._ajaxCount);
        },
        /**
         * @description ajax请求结束后处理
         * @private
         * @param {Boolean} loadMask 是否加遮罩
         * @param {Object} XMLHttpRequest 请求信息
         */
        _end: function(loadMask, XMLHttpRequest) {
            if (!loadMask) {
                return false;
            }
            Sweet.Ajax._ajaxCount--;
            if (0 === Sweet.Ajax._ajaxCount) {
                $(document).unSweetMask();
            }
            $.log("stop ajaxCount:" + Sweet.Ajax._ajaxCount);
        }
    };

    /**
     * tip提示统一处理
     */
    Sweet.ToolTip = {
        enable: function() {
            $(document).sweettip({
                show: {
                    delay: 500
                }
            });
        },
        /**
         * 重置tooltip，关闭已经显示的提示
         */
        reset: function() {
            $(document).sweettip("disable");
            $(document).sweettip("enable");
        }
    };
})();

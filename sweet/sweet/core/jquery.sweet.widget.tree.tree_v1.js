/**
 * @fileOverview  
 * <pre>
 * 树组件
 * 2014.06.15
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var treePrefix = "sweet-treev1",
            treePanelClass = "sweet-treev1-panel",
            treePanelDisabledClass = "sweet-treev1-disabled",
            treeBodyClass = "sweet-treev1-body",
            treeULClass = "sweet-treev1-ul",
            treeNodeClass = "sweet-treev1-node",
            treeNodeTextClass = "sweet-treev1-node-text",
            treeNodeCCTextClass = "sweet-treev1-node-cc-text",
            treenodeSelectClass = "sweet-treev1-node-selected",
            treeExpandedClass = "sweet-treev1-node-expanded", //展开状态
            treeCollapsedClass = "sweet-treev1-node-collapsed", //收起状态
            treeFullCheckedClass = "sweet-treev1-node-fullchecked", //全选中状态
            treeCheckedClass = "sweet-treev1-node-checked", //半选中状态
            treeUnCheckedClass = "sweet-treev1-node-unchecked", //未选中状态
            treeSearchClass = "sweet-treev1-search", //查询栏样式
            treeParentNodeIcoClass = "sweet-treev1-node-folder-ioc",
            treeLeafNodeIcoClass = "sweet-treev1-node-leaf-ioc",
            treeLeafIndexClass = "sweet-treev1-node-leaf-index",
            treeLeafNodeDimensionClass = "sweet-treev1-node-leaf-dimension",
            treeLeafCompClass = "sweet-treev1-node-leaf-comp",
            treeLeafUserDefineClass = "sweet-treev1-node-leaf-userDefine",
            treeNodeLineClass = "sweet-treev1-node-line", //竖线
            treeNodeMinusLineClass = "sweet-treev1-node-line-minus", //竖线
            treeNodeEblowClass = "sweet-treev1-node-eblow", //连接下方节点线段，未结尾
            treeNodeEblowEndClass = "sweet-treev1-node-eblow-end", //连接下方节点折线，结尾
            treeNodeMinusEblowClass = "sweet-treev1-node-eblow-minus", //叶子节点无连接线
            treeNodeEditMenuClass = "sweet-treev1-node-edit-menu", //节点编辑弹出菜单样式

            //事件
            eventChange = "change",
            eventSearch = "search",
            eventBeforeSearch = "beforesearch",
            eventClick = "click",
            eventBeforeDbClick = "beforedbclick",
            eventDbClick = "dbclick",
            eventBeforeExpand = "beforeexpand",
            eventExpand = "expand",
            eventBeforeCollapse = "beforecollapse",
            eventCollapse = "collapse",
            eventBeforeCheckChange = "beforecheckchange",
            eventCheckChange = "checkchange",
            eventBeforeSelected = "beforeselected",
            eventSelected = "selected",
            eventBeforeLoad = "beforeload",
            eventLoad = "load", //加载事件
            eventBeforeTextChange = "beforetextchange",
            eventTextChange = "textchange",
            eventBeforeEdit = "beforeedit",
            eventEdit = "edit", //节点编辑事件
            eventBeforeRemove = "beforeremove",
            eventRemove = "remove", //节点删除事件

            //node属性信息
            KEY_VALUE = "value", //node属性字段: value
            KEY_TEXT = "text", //node属性字段: text
            KEY_DATA = "data", //node属性字段: 节点挂的用户自定义数据
            KEY_CHECKED = "checked", //node属性字段: 多选时是否选中
            KEY_EXPANDED = "expanded", //node属性字段: 是否展开
            KEY_HIDDEN = "hidden", //node属性字段: 是否隐藏
            KEY_QTIP = "qtip", //node属性字段: 节点提示信息,默认为text
            KEY_ICON = "icon", //node属性字段: 节点前的图片路径
            KEY_LEAF = "leaf", //node属性字段: 是否是叶子节点
            KEY_ISLAST = "isLast", //node属性字段: 是否是本层最后一个节点
            KEY_DEPTH = "depth", //node属性字段: 层级深度,顶层为0
            KEY_PATH = "path", //node属性字段: 路径,父path#&#*#&#子value
            KEY_PARENTPATH = "parentPath", //node属性字段: 父层级path
            KEY_CHILDREN = "children", //node属性字段: 存储子节点path的数组
            KEY_ALLCHILDREN = "allChildren", //node属性字段: 存储所有子节点path的数组
            KEY_EL = "el", //node属性字段: 绑定的DOM,包括li、展开dom、复选dom
            KEY_LI = "li", //li dom
            KEY_LOADED = "loaded", //li dom

            //常量信息
            EVENTTYPE_EXPANDED = "expanded",
            EVENTTYPE_CHECKED = "checked",
            ATTR_NODE = "node",
            ATTR_NAME = "name",
            CHECKED_STATE_UNCHECKED = "0", //未选中状态
            CHECKED_STATE_CHECKED = "1", //半选中状态
            CHECKED_STATE_FULLCHECKED = "2", //全选中状态

            //图标类型
            ICON_TYPE = {
                0: treeLeafNodeDimensionClass,
                1: treeLeafIndexClass,
                2: treeLeafUserDefineClass,
                3: treeLeafCompClass
            },
            i18n = Sweet.core.i18n.tree,
            //编辑时菜单图标路径
            EDIT_TYPE = {
                "add": {text: i18n["add"], icon: "../../../sweet/themes/default/core/images/tree/tree_add.png"},
                "delete": {text: i18n["delete"], icon: "../../../sweet/themes/default/core/images/tree/tree_delete.png"},
                "edit": {text: i18n["edit"], icon: "../../../sweet/themes/default/core/images/tree/tree_edit.png"}
            },
            //连接符
            pathConnectSymbol = "#&#*#&#",
            LIMIT_COUNT = 300, //超过此值后则处理成滚动加载
            uuid = uuid || 1000;
    $.widget("sweet.widgetTreeTree_v1", $.sweet.widgetTree, /** @lends Sweet.tree.Tree_v1.prototype */{
        version: "1.0",
        sweetWidgetName: "[widget-tree-tree-v1]:",
        type: 'tree',
        eventNames: /** @lends Sweet.tree.Tree_v1.prototype */{
            /**
             * @event
             * @description 树节点单击事件,一般参数为(node, me)
             */
            click: "树节点单击事件, 只针对单选叶子节点操作",
            /**
             * @event
             * @description 树节点双击前事件,一般参数为(node, me)
             */
            beforedbclick: "树节点双击前事件",
            /**
             * @event
             * @description 树节点双击事件,一般参数为(node, me)
             */
            dbclick: "树节点双击事件",
            /**
             * @event
             * @description 单选树节点选中前事件,一般参数为(node, me) (--暂未实现)
             */
            beforeselected: "单选树节点选中前事件",
            /**
             * @event
             * @description 单选树节点选中事件,一般参数为(node, me)
             */
            selected: "单选树节点选中事件",
            /**
             * @event
             * @description 树节状态改变时事件,一般参数为({node: node, checked: checked}, this)
             */
            checkchange: "树节状态改变时事件",
            /**
             * @event
             * @description 树节状态改变前事件,一般参数为({node: node, checked: checked}, this)
             */
            beforecheckchange: "树节状态改变前事件",
            /**
             * @event
             * @description 树节点收起前事件,如果返回false则收起操作终止,一般参数为(node, this)
             */
            beforecollapse: "树节点收起前事件,如果返回false则收起操作终止",
            /**
             * @event
             * @description 树节点收起事件,一般参数为(node, this)
             */
            collapse: "树节点收起事件",
            /**
             * @event
             * @description 树节点展开前事件,如果返回false则展开操作终止,一般参数为(node, this)
             */
            beforeexpand: "树节点展开前事件,如果返回false则展开操作终止",
            /**
             * @event
             * @description 树节点展开事件,一般参数为(node, this)
             */
            expand: "树节点展开事件",
            /**
             * @event
             * @description 延迟加载数据时,加载前事件,一般参数为(loader, tree),loader中的tParams记录了过滤信息,如果没有则没有tParams
             */
            beforeload: "延迟加载数据时,加载前事件",
            /**
             * @event
             * @description 延迟加载数据时,数据加载回时事件,一般参数为(loader, tree),loader中datas为加载回来的数据,其中tParams记录了过滤信息,如果没有则没有tParams
             */
            load: "延迟加载数据时,数据加载回时事件",
            /**
             * @event
             * @description 查询事件,一般两个参数(datas, tree)
             */
            search: "查询事件",
            /**
             * @event
             * @description 查询前事件,一般两个参数(filter, tree)
             */
            beforesearch: "查询前事件",
            /**
             * @event
             * @description 树节点的拖拽事件,一般参数为(evt, data)
             */
            drag: "树节点的拖拽事件",
            /**
             * @event
             * @description 切换树节点事件,一般参数为(value, tree)
             */
            change: "切换树节点事件",
            /**
             * @event
             * @description 节点文本发生变化前时事件,一般两个参数(data, me)
             */
            beforetextchange: "节点文本发生变化前事件",
            /**
             * @event
             * @description 节点文本发生变化事件,一般两个参数(data, me)
             */
            textchange: "节点文本发生变化事件",
            /**
             * @event
             * @description 节点删除前时事件,一般两个参数(node, me)
             */
            beforeremove: "节点删除前事件",
            /**
             * @event
             * @description 节点删除事件,一般两个参数(node, me)
             */
            remove: "节点删除事件",
            /**
             * @event
             * @description 节点编辑前时事件,一般两个参数(data, me)
             */
            beforeedit: "节点编辑前事件",
            /**
             * @event
             * @description 节点编辑事件,一般两个参数(node, me)
             */
            edit: "节点编辑事件"
        },
        options: /** @lends Sweet.tree.Tree_v1.prototype*/{
            /**
             * 基础数据
             * @type {Object}
             * @default null
             */
            data: null,
            /**
             * 多选属性
             * @type {Boolean}
             * @default false
             */
            multi: false,
            /**
             * 是否显示搜索框
             * @type {Boolean}
             * @default false
             */
            search: false,
            /**
             * 是否有提示
             * @type {Boolean}
             * @default false
             */
            tip: false,
            /**
             * 是否禁用list组件
             * @type {Boolean}
             * @default false
             */
            disabled: false,
            /**
             * 是否显示树节点的图标
             * @type {Boolean}
             * @default true
             */
            icon: true,
            /**
             * 树节点是否可以拖动(暂未实现)
             * @type {Boolean}
             * @default false
             */
            draggable: false,
            /**
             * 是否显示节点之间的连线
             * @type {Boolean}
             * @default true
             */
            useArrows: true,
            /**
             * 获值时需要取的节点数据key
             * @type {Array}
             * @default [KEY_VALUE, KEY_TEXT, KEY_DATA, KEY_ICON]
             */
            valueKeys: [KEY_VALUE, KEY_TEXT, KEY_DATA, KEY_ICON],
            /**
             * 延迟加载器:如果为延迟加载则配置,非延迟加载则不要配置
             * {
             *      url: "XXXX.action",              //请求数据的URL
             *      baseParams: {param: xxxxx},      //提交的参数
             *      autoLoad: false,                  //初始化时是否自动加载数据,默认为false   
             *      loadMask: true,                   //是否出遮罩
             *      contentType: "application/json;charset=UTF-8"
             * }
             * @type {Object}
             * @default null
             */
            loader: null,
            /**
             * 是否可编辑,当前支持["add", "edit", "delete"]
             * @type {Boolean/Array}
             * @default false
             */
            editable: false,
            /**
             * 可编辑时,双击节点时是否出编辑框,默认出
             * @type {Boolean}
             * @default true
             */
            isDbClickEdit: true,
            /**
             * 父节点是否显示子节点个数,只针对非延迟加载且非编辑树,默认不显示,如果配置true/"true"则显示所有子节点个数,如果配置"leaf"只显示所有叶子节点个数
             * @type {Boolean/String}
             * @default false
             */
            showCCount: false,
            /**
             * 当search为true时，出现的搜索框中的提示文字
             * @type string
             * @default Sweet.core.i18n.tree.search("search"/"搜索")
             */
            searchEmptyText: Sweet.core.i18n.tree.search,
            /**
             * 以毫秒表示的从开始输入到发出查询语句过滤下拉列表的时长, 默认350毫秒  
             * @type {Number}
             * @default 350
             */
            queryDelay: 350,
            /**
             * 单选时，父节点是否可以被选中，默认不可选中
             * @type {Boolean}
             * @default false
             */
            isParentNodeSelect : false
        },
        /**
         * @description 创建列表组件
         * @private
         */
        _createSweetWidget: function() {
            var me = this,
                    queryDelay = 350,
                    id = me.options.id,
                    widgetClass = me.options.widgetClass,
                    listeners;
            // 每个选项的高度
            me.liHeight = 22;
            // 搜索框高
            me.searchFieldHeight = 25;
            // 每页渲染条数
            me.renderSize = 10;
            //是否是一次性渲染
            me.isRenderAll = false;
            // 临时LI的TOP,用于LI预渲染时取最大宽度用
            me.__tempRenderTop = -100;
            // 总数据
            me.data = me.options.data || [];
            //以列表形式存储原始数据
            me.listDatas = [];
            //以对象形式存储原始数据
            me.objDatas = {};
            //当前渲染的数据
            me.optListDatas = [];
            //存储当前操作的对象数据信息
            me.optObjDatas = {};
            //存储选中的节点,只存储叶子节点
            me.selectedDatas = {};
            //存储LIST型数据,用于延迟渲染用
            me.optShowDatas = [];
            me.contentType = "application/json;charset=UTF-8";
            me.treeEl = $("<div>").attr("id", me.options.id)
                    .addClass(treePanelClass);
            if (me.options.disabled) {
                me.treeEl.addClass(treePanelDisabledClass);
            }
            if (widgetClass && "" != widgetClass) {
                me.treeEl.addClass(widgetClass);
            }
            //如果为可编辑,则不能过滤和没有节点连接线
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                me.options.search = false;
                me.options.useArrows = false;
            }
            // 增加搜索框
            if (me.options.search) {
                //过滤延时处理
                queryDelay = parseInt(me.options.queryDelay,10);
                if (isNaN(queryDelay)) {
                    queryDelay = 350;
                }
                if (queryDelay < 0) {
                    queryDelay = 0;
                }
                me.searchFiedlDiv = $("<div>").attr("id", id + treePrefix + "-search-" + uuid)
                        .appendTo(me.treeEl)
                        .addClass(treeSearchClass);
                me.searchField = new Sweet.form.SearchField({
                    width: me.options.width,
                    emptyText: Sweet.core.i18n.tree.search
                });
                me.searchField.addListener("keyup", function(e, data) {
                    Sweet.Task.Delay.start({
                        id: me.options.id + "-treev1-filter-delay1",
                        run: function(args) {
                            me.filter(args);
                        },
                        args: data.value,
                        delay: queryDelay
                    });
                });
                me.searchField.addListener("click", function(e, data) {
                    Sweet.Task.Delay.start({
                        id: me.options.id + "-treev1-filter-delay2",
                        run: function(args) {
                            me.filter(args);
                        },
                        args: data.value,
                        delay: queryDelay
                    });
                });
            }
            me.treeBodyDiv = $("<div>").addClass(treeBodyClass);
            me.treeUL = $("<ul>").addClass(treeULClass)
                    .appendTo(me.treeBodyDiv);
            me.treeBodyDiv.appendTo(me.treeEl);
            listeners = me.options["listeners"];
            if (!$.isEmptyObject(listeners)) {
                for (var key in listeners) {
                    me.addListener(("" + key), listeners[key]);
                }
            }
            if (me.options.loader) {
                if (!(true == me.options.loader["autoLoad"] || "true" == me.options.loader["autoLoad"])) {
                    me.options.loader["autoLoad"] = false;
                }
                if (me.options.loader["autoLoad"]) {
                    me.data = me._loadDatas()["datas"] || [];
                }
            }
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                LIMIT_COUNT = 500;
            }
            me._initData(me.data);
        },
        /**
         * @description 设置数据
         * @param {Array} data 组件对应的数据，格式如：[{text:'text1',value:'value1', chlidren: [...]},...]
         */
        setData: function(data) {
            var me = this;
            if (me.options.disabled) {
                return;
            }
            if ($.isNull(data)) {
                data = [];
            }
            if (!$.isArray(data)) {
                data = [data];
            }
            me.data = data;
            me._reset();
            // 如果有search框,则清除过滤信息
            if (me.searchField) {
                me.searchField.setValue({value: "", text: ""});
            }
            me._initData(me.data);
            me._setData();
        },
        /**
         * @private
         * @description 设置数据,内部调用
         */
        _setData: function() {
            var me = this,
                    treeBodyDiv = me.treeBodyDiv;
            me._removeAllNodeList();
            // 初始化时让滚动条置顶				
            treeBodyDiv[0].scrollTop = 0;
            me._doLayout();
        },
        /**
         * @private
         * @description 解析me.optObjDatas，内部调用(递归算法)
         */
        _parseChildren: function(objKey) {
            var me = this,
                result = [],
                obj = me.optObjDatas[objKey];
            if (!obj || obj.leaf || !obj.children || obj.children.length === 0) {
                return null;
            }

            var node;
            var resultNode;
            var nodeChildren;
            for (var idx in obj.children) {
                node = me.optObjDatas[obj.children[idx]];
                resultNode = {
                    checked: node.checked,
                    depth: node.depth,
                    expanded: node.expanded,
                    hidden: node.hidden,
                    leaf: node.leaf,
                    loaded: node.loaded,
                    text: node.text,
                    value: node.value
                };
                
                nodeChildren = me._parseChildren(node.path);
                if (nodeChildren != null) {
                    resultNode.children = nodeChildren;
                }
                result.push(resultNode);
            }
            return result;
        },
		/**
         * @description 取得所有数据,如果为延迟加载也处理，使用此方法时，延迟加载时也起作用，和getData区分
         * @returns {Array/Object} data 返回List的所有数据
         */
		getAllData : function(){
			var me = this,
                    resultDatas;
			if (me.options.loader) {
                resultDatas = [];
                var node;
                var resultNode;
                for (var lkey in me.optObjDatas) {
                    node = me.optObjDatas[lkey];
            //辨别为父节点的时候执行
                    if (node.depth === 0) {
                        resultNode = {
                            checked: node.checked,
                            depth: node.depth,
                            expanded: node.expanded,
                            hidden: node.hidden,
                            leaf: node.leaf,
                            loaded: node.loaded,
                            text: node.text,
                            value: node.value,
                            children: me._parseChildren(node.path)
                        }
                        resultDatas.push(resultNode);
                    }
                }
                return JSON.parse(JSON.stringify(resultDatas));
            }
		},
        /**
         * @description 取得所有数据,如果为延迟加载则不处理,并返回空数组
         * @returns {Array/Object} data 返回List的所有数据
         */
        getData: function() {
            var me = this,
                    _tempMap,
                    _tNode,
                    _tCloneNode,
                    liDoms,
                    keys = me.options.valueKeys,
                    resultDatas;
            //如果为延迟加载,则返回空数组
            if (me.options.loader) {
                return [];
            }

             
            //如果为编辑树,则从optObjDatas中转化一份树的数据
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                liDoms = me.treeUL.find("li");
                //如果没有LI,则返回空数组
                if (!liDoms || liDoms.length <= 0) {
                    me.listDatas = me.optListDatas = [];
                    me.objDatas = me.optObjDatas = {};
                    return [];
                }
                //存储节点对应信息
                _tempMap = {};
                resultDatas = [];
                for (var i = 0; i < liDoms.length; i++) {
                    _tCloneNode = {};
                    _tNode = $(liDoms[i]).data("node");
                    for (var k = 0; k < keys.length; k++) {
                        _tCloneNode[keys[k]] = _tNode[keys[k]];
                    }
                    //如果为非叶子节点,则将此节点的children置为[]
                    if (!_tNode[KEY_LEAF]) {
                        _tCloneNode[KEY_CHILDREN] = [];
                    }
                    //如果为根节点则加入result
                    if (!_tNode[KEY_PARENTPATH]) {
                        resultDatas.push(_tCloneNode);
                    } else {
                        //加到父层级的children中
                        if (_tempMap[_tNode[KEY_PARENTPATH]]) {
                            if (!_tempMap[_tNode[KEY_PARENTPATH]][KEY_CHILDREN]) {
                                _tempMap[_tNode[KEY_PARENTPATH]][KEY_CHILDREN] = [];
                            }
                            _tempMap[_tNode[KEY_PARENTPATH]][KEY_CHILDREN].push(_tCloneNode);
                        }
                    }
                    //将节点存储到此临时变量中,用于后续节点检索父层级节点信息
                    _tempMap[_tNode[KEY_PATH]] = _tCloneNode;
                }
                _tempMap = null;
                return resultDatas;
            }
            return JSON.parse(JSON.stringify(me.data));
        },
        /**
         * @description 设置值
         * @param {Array} value 组件对应的数据，格式如：[{text:'text1',value:'value1', chlidren: [...]},...]
         */
        setValue: function(value) {
            var me = this,
                    optValue = $.objClone(value),
                    valueListDatas = [],
                    valueObjDatas = {},
                    updateCheckedNodes = {};
            if (me.options.disabled) {
                return;
            }
            optValue = optValue || [];
            if (!$.isArray(optValue)) {
                optValue = [optValue];
            }
            //清除之前选中
            me._reset();
            //解析value数据
            me.parseDatas($.objClone(optValue), valueListDatas, valueObjDatas, "", false, null);
            //如果为单选
            if (!me.options.multi) {
                me.treeUL.find("li").removeClass(treenodeSelectClass);
                for (var key in valueObjDatas) {
                    if (valueObjDatas[key][KEY_LEAF]) {
                        if (me.optObjDatas[key]) {
                        me._doSelected(me.optObjDatas[key]);
                        me._doBubbleExpanded(me.optObjDatas[key]);
                        break;
                        } else {
                            if (me.objDatas[key]) {
                                me.selectedDatas[key] = me.objDatas[key];
                                break;
                            }
                        }
                    }
                }
                optValue = me._getValue(null, true);
                // 触发change事件
                me._triggerHandler(optValue, eventChange, me);
                return;
            }
            //多选设置值处理
            if (me.isRenderAll) {
                for (var key in me.optObjDatas) {
                    //选取消checked样式
                    me._checked(me.optObjDatas[key], CHECKED_STATE_UNCHECKED);
                    if (valueObjDatas[key] && valueObjDatas[key][KEY_LEAF]) {
                        me._checked(me.optObjDatas[key], CHECKED_STATE_FULLCHECKED);
                        me.selectedDatas[key] = me.optObjDatas[key];
                    }
                }
                me._bubbleUpdateNodeChecked(me.selectedDatas);
                //存储需要更新的节点
                for (var key in me.selectedDatas) {
                    if (me.selectedDatas[key][KEY_LEAF]) {
                        me._getUpdateNode(me.optObjDatas[key], updateCheckedNodes);
                    }
                }
                for (var key in updateCheckedNodes) {
                    me._checked(updateCheckedNodes[key], updateCheckedNodes[key][KEY_CHECKED]);
                }
            } else {
                for (var key in me.optObjDatas) {
                    me.optObjDatas[key][KEY_CHECKED] = CHECKED_STATE_UNCHECKED;
                    if (valueObjDatas[key] && valueObjDatas[key][KEY_LEAF]) {
                        me._asyncChecked(me.optObjDatas[key], CHECKED_STATE_FULLCHECKED);
                        me.selectedDatas[key] = me.optObjDatas[key];
                    }
                }
                me._bubbleUpdateNodeChecked(me.selectedDatas);
                var liDoms = me.treeUL.find("li"),
                        tLiEl, tCheckEl, tNodeData;
                for (var i = 0; i < liDoms.length; i++) {
                    tLiEl = $(liDoms[i]);
                    tNodeData = tLiEl.data();
                    tCheckEl = tLiEl.find("span[name=checked]");
                    if (tCheckEl && tCheckEl.length > 0) {
                        if (tNodeData[KEY_CHECKED] == CHECKED_STATE_FULLCHECKED) {
                            tCheckEl.removeClass(treeUnCheckedClass);
                            tCheckEl.removeClass(treeCheckedClass);
                            tCheckEl.addClass(treeFullCheckedClass);
                        } else if (tNodeData[KEY_CHECKED] == CHECKED_STATE_CHECKED) {
                            tCheckEl.removeClass(treeUnCheckedClass);
                            tCheckEl.removeClass(treeFullCheckedClass);
                            tCheckEl.addClass(treeCheckedClass);
                        } else {
                            tCheckEl.removeClass(treeFullCheckedClass);
                            tCheckEl.removeClass(treeCheckedClass);
                            tCheckEl.addClass(treeUnCheckedClass);
                        }
                    }
                }
                me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
                me.treeUL.height(me.optShowDatas.length * me.liHeight);
                me._doTriggerScrollEvent();
            }
            for (var key in valueObjDatas) {
                if (!me.selectedDatas[key] && me.objDatas[key] && me.objDatas[key][KEY_LEAF]) {
                    me.selectedDatas[key] = me.objDatas[key];
                }
            }
            // 触发change事件
            me._triggerHandler(optValue, eventChange, me);
        },
        /**
         * @description 组件重新加载数据,内部调用
         * @param {Object} loader 异步数据加载器,里面配有URL及请求参数
         * @returns {Array} result {datas: datas, isContinue: true}; 返回加载到的数据及是否继续住下执行
         */
        _loadDatas: function(loader) {
            var me = this,
                    flag,
                    datas = [],
                    reqConfig,
                    reqContentType,
                    result = {isContinue: true, datas: []};
            //如果没有传loader则用原始默认的
            if (!loader) {
                //非延迟加载处理
                if (!me.options.loader) {
                    loader = {baseParams: {}};
                    loader["baseParams"]["timestemp"] = new Date().getTime();
                    flag = me._triggerHandler(loader, eventBeforeLoad, me);
                    if (false === flag || "false" === flag) {
                        result["isContinue"] = false;
                        return result;
                    }
                    loader["datas"] = me.data;
                    me._triggerHandler(loader, eventLoad, me);
                    if (!loader["datas"]) {
                        loader["datas"] = [];
                    } else {
                        if (!$.isArray(loader["datas"])) {
                            loader["datas"] = [loader["datas"]];
                        }
                    }
                    result["datas"] = loader["datas"];
                    return result;
                } else {
                    loader = $.objClone(me.options.loader);
                }
            }
            if (!loader["baseParams"]) {
                loader["baseParams"] = {};
            }
            loader["baseParams"]["timestemp"] = new Date().getTime();
            flag = me._triggerHandler(loader, eventBeforeLoad, me);
            if (false === flag || "false" === flag) {
                result["isContinue"] = false;
                return result;
            }
            if (!loader["contentType"] || "" == loader["contentType"].trim()) {
                reqContentType = me.contentType;
            } else {
                reqContentType = loader["contentType"];
            }
            reqConfig = {
                contentType: reqContentType,
                url: loader["url"],
                data: loader["baseParams"],
                async: false,
                dataType: "json",
                timeout: 3600000,
                success: function(result) {
                    datas = result || [];
                },
                error: function() {
                    datas = [];
                }
            };
            if (false === loader["loadMask"] || "false" === loader["loadMask"]) {
                reqConfig["loadMask"] = false;
            } else {
                reqConfig["loadMask"] = true;
            }
            Sweet.Ajax.request(reqConfig);
            loader["datas"] = datas;
            me._triggerHandler(loader, eventLoad, me);
            if (!loader["datas"]) {
                loader["datas"] = [];
            } else {
                if (!$.isArray(loader["datas"])) {
                    loader["datas"] = [loader["datas"]];
                }
            }
            result["datas"] = loader["datas"];
            return result;
        },
        /**
         * @description 设置组件加载器
         * @param {Object} loader 异步数据加载器,其中配有URL及请求参数
         */
        setLoader: function(loader) {
            var me = this;
            me.options.loader = loader;
            me.isRenderAll = false;
            me._setData();
        },
        /**
         * @description 组件重新加载数据,延迟加载时,如果没传loader,则使用默认的loader,如果传了则用此loader加载数据;如果为非延迟加载,则重新set数据
         * @param {Object} loader 异步数据加载器,其中配有URL及请求参数
         */
        load: function(loader) {
            var me = this,
                    loaderDatas;
            if (me.options.disabled) {
                return;
            }
            // 如果有search框,则清除过滤信息
            if (me.searchField) {
                me.searchField.setValue({value: "", text: ""});
            }
            loaderDatas = me._loadDatas(loader);
            if (!loaderDatas["isContinue"]) {
                return;
            }
            me.data = loaderDatas["datas"];
            me.setData(me.data);
        },
        /**
         * @description 加载器加载数据
         * @param {Object} node 当前节点
         * @param {Object} loader 数据加载器
         * @param {Object} selectedDatas 存储本次加载回来数据中选中的
         * @return {Boolean} flag 是否继续往下执行
         */
        _doLoaderLoad: function(node, loader, selectedDatas) {
            var me = this,
                    tReqNode,
                    datas,
                    tListDatas,
                    tObjDatas,
                    tDepth,
                    tPath,
                    index,
                    sDatas,
                    eDatas,
                    keyArray = me.options.valueKeys,
                    fValueObj,
                    loaderDatas;
            node[KEY_LOADED] = true;
            tReqNode = {};
            for (var k = 0; k < keyArray.length; k++) {
                tReqNode[keyArray[k]] = node[keyArray[k]];
            }
            if (!loader["tParams"]) {
                loader["tParams"] = {};
            }
            loader["tParams"]["node"] = tReqNode;
            if (me.searchField) {
                fValueObj = me.searchField.getValue();
                if (fValueObj && "" != fValueObj["value"]) {
                    loader["tParams"]["filter"] = fValueObj["value"];
                }
            }
            loaderDatas = me._loadDatas(loader);
            if (!loaderDatas["isContinue"]) {
                return false;
            }
            datas = loaderDatas["datas"];
            if (datas.length > 0) {
                tListDatas = [];
                tObjDatas = {};
                tDepth = node[KEY_DEPTH];
                me.parseDatas(datas, tListDatas, tObjDatas, node[KEY_PATH], node[KEY_HIDDEN], ++tDepth, selectedDatas);
                $.extend(me.optObjDatas, tObjDatas);
                if (!node[KEY_CHILDREN]) {
                    node[KEY_CHILDREN] = [];
                }
                if (!node[KEY_ALLCHILDREN]) {
                    node[KEY_ALLCHILDREN] = [];
                }
                for (var k = 0; k < tListDatas.length; k++) {
                    tPath = tListDatas[k][KEY_PATH];
                    if (me.optObjDatas[tPath] && !me.optObjDatas[tPath][KEY_LEAF]) {
                        me.optObjDatas[tPath][KEY_LOADED] = true;
                    }
                    if (me.optObjDatas[tPath][KEY_PARENTPATH] == node[KEY_PATH]) {
                        node[KEY_CHILDREN].push(tPath);
                    }
                    node[KEY_ALLCHILDREN].push(tPath);
                }
                me.bubble(node, function(node, pNode) {
                    if (!pNode[KEY_CHILDREN]) {
                        pNode[KEY_CHILDREN] = [];
                    }
                    if (!pNode[KEY_ALLCHILDREN]) {
                        pNode[KEY_ALLCHILDREN] = [];
                    }
                    pNode[KEY_ALLCHILDREN] = pNode[KEY_ALLCHILDREN].concat(node[KEY_ALLCHILDREN]);
                });
                for (var i = 0; i < me.optListDatas.length; i++) {
                    if (me.optListDatas[i][KEY_PATH] == node[KEY_PATH]) {
                        index = i;
                        break;
                    }
                }
                sDatas = me.optListDatas.slice(0, (index + 1));
                eDatas = me.optListDatas.slice(index + 1);
                me.optListDatas = sDatas.concat(tListDatas, eDatas);
            }
            return true;
        },
        /**
         * @description 过滤
         * @param {String} value 过滤的字符串
         */
        filter: function(value) {
            var me = this,
                    patt,
                    tDatas = {},
                    selectedDatas = {},
                    tempTreeDatas = {},
                    flag,
                    tFilter;
            tFilter = {filter: value};
            flag = me._triggerHandler(tFilter, eventBeforeSearch, me);
            if (false === flag || "false" === flag) {
                return;
            }
            value = tFilter["filter"];
            //本次过滤完毕后才能执行下次过滤操作
            if (me.searchField) {
                me.searchField.setDisabled(true);
            }
            //如果为延迟加载
            if (me.options.loader) {
                me._doLoaderFilter(value, $.objClone(me.options.loader));
                if (me.searchField) {
                    me.searchField.setDisabled(false);
                }
                return;
            }
            if (!$.isNotNull(value)) {
                me.optListDatas = $.objClone(me.listDatas);
                me.optObjDatas = $.objClone(me.objDatas);
                me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
                me.treeUL.height(me.optShowDatas.length * me.liHeight);
                me._doTriggerScrollEvent();
            } else {
                me.optObjDatas = $.objClone(me.objDatas);
                patt = new RegExp($.regExp.escape(value), "i");
                for (var key in me.optObjDatas) {
                    if (me.optObjDatas[key][KEY_LEAF] && patt.test(me.optObjDatas[key][KEY_TEXT])) {
                        tDatas[key] = me.optObjDatas[key];
                    }
                }
                var keys = keys = me.options.valueKeys;
                me.parseTreeDatas(tDatas, me.optObjDatas, keys, tempTreeDatas);
                if (tempTreeDatas["data"]) {
                    tempTreeDatas = tempTreeDatas["data"];
                } else {
                    tempTreeDatas = [];
                }
                me.optListDatas = [];
                me.optObjDatas = {};
                me.parseDatas(tempTreeDatas, me.optListDatas, me.optObjDatas, "", false, null);
            }
            if (me.options.multi) {
                for (var key in me.selectedDatas) {
                    if (me.optObjDatas[key]) {
                        me.optObjDatas[key][KEY_CHECKED] = CHECKED_STATE_FULLCHECKED;
                        selectedDatas[key] = me.optObjDatas[key];
                    }
                }
                me._bubbleUpdateNodeChecked(selectedDatas);
            }
            //如果输入过滤值不为空,则将过滤后的数据全部展开
            if ($.isNotNull(value)) {
                for (var key in me.optObjDatas) {
                    me.optObjDatas[key][KEY_HIDDEN] = false;
                    if (!me.optObjDatas[key][KEY_LEAF]) {
                        me.optObjDatas[key][KEY_EXPANDED] = true;
                    }
                }
            }
            me._triggerHandler(me.optObjDatas, eventSearch, me);
            me._setData();
            tDatas = null;
            selectedDatas = null;
            tempTreeDatas = null;
            if (me.searchField) {
                me.searchField.setDisabled(false);
            }
        },
        /**
         * @description 延迟加载数据时过滤处理
         * @param {String} value 过滤的字符串
         * @param {Object} loader 数据加载器
         */
        _doLoaderFilter: function(value, loader) {
            var me = this,
                    datas,
                    loaderDatas;
            if (value) {
                if (!loader["tParams"]) {
                    loader["tParams"] = {};
                }
                loader["tParams"]["filter"] = value;
            } else {
                if (loader["tParams"]) {
                    delete loader["tParams"]["filter"];
                }
            }
            loaderDatas = me._loadDatas(loader);
            if (!loaderDatas["isContinue"]) {
                return;
            }
            datas = loaderDatas["datas"];
            me.data = datas;
            me._reset();
            me._initData(me.data);
            me._setData();
        },
        /**
         * @private
         * @description 设置宽度
         * @param {String/Number} width 宽度
         */
        _setWidth: function(width) {
            var me = this;
            if (!width || width < 0) {
                return;
            }
            me.width = width;
            me.treeEl.externalWidth(width);
        },
        /**
         * @private
         * @description 设置高度
         * @param {String/Number} height 高度
         */
        _setHeight: function(height) {
            var me = this;
            if (!height || height < 0) {
                return;
            }
            me.height = height;
            me.treeEl.externalHeight(height);
        },
        /**
         * @private
         * @description 设置宽度、高度
         * @param {String/Number} width 宽度
         * @param {String/Number} height 高度
         */
        _setWH: function(width, height) {
            var me = this;
            me.width = width;
            me.height = height;
            me.treeEl.externalWidth(width).externalHeight(height);
        },
        /**
         * @private
         * @description 获取宽度
         * @returns {Number} 返回宽度
         */
        _getWidth: function() {
            var me = this;
            return me.treeEl.externalWidth();
        },
        /**
         * @private
         * @description 获取高度
         * @returns {Number} 返回高度
         */
        _getHeight: function() {
            var me = this;
            return me.treeEl.externalHeight();
        },
        /**
         * @private
         * @description 设置宽度、高度
         * @param {String/Number} width 宽度
         * @param {String/Number} height 高度
         */
        resizeLayout: function(width, height) {
            var me = this,
                    treeBodyDiv = me.treeBodyDiv[0],
                    _scrollTop = treeBodyDiv.scrollTop,
                    _scrollLeft = treeBodyDiv.scrollLeft;
            me.setWH(width, height);
            treeBodyDiv.scrollTop = _scrollTop;
            treeBodyDiv.scrollLeft = _scrollLeft;
        },
        /**
         * @private
         * @description 逐层下报,执行fn,提供fn参数为node和childrenNode
         * @param {Object} node 渲染节点的数据
         * @param {Function} fn 渲染节点的数据
         */
        cascade: function(node, fn) {
            var me = this;
            if (!node || !node[KEY_ALLCHILDREN] || node[KEY_ALLCHILDREN].length <= 0) {
                return;
            }
            if (!fn || typeof fn != "function") {
                return;
            }
            for (var i = 0; i < node[KEY_ALLCHILDREN].length; i++) {
                fn(me.optObjDatas[node[KEY_PATH]], me.optObjDatas[node[KEY_ALLCHILDREN][i]]);
            }
        },
        /**
         * @private
         * @description 逐层上报,执行fn,提供fn参数为node和parentNode
         * @param {Object} node 渲染节点的数据
         * @param {Function} fn 渲染节点的数据
         */
        bubble: function(node, fn) {
            var me = this;
            if (!fn || typeof fn != "function") {
                return;
            }
            if (!node[KEY_PARENTPATH] || "" == node[KEY_PARENTPATH]) {
                return;
            }
            fn(me.optObjDatas[node[KEY_PATH]], me.optObjDatas[node[KEY_PARENTPATH]]);
            me.bubble(me.optObjDatas[node[KEY_PARENTPATH]], fn);
        },
        /**
         * @private
         * @description 组件重绘
         */
        _doLayout: function() {
            var me = this,
                    width,
                    height,
                    searchHeight = 0,
                    padding = 0,
                    liHeight = me.liHeight,
                    treeBodyHeight,
                    optListDatas,
                    tValue;
            if (me._editMenu) {
                me._editMenu.destroy();
            }
            width = parseInt(me.options.width,10);
            height = parseInt(me.options.height,10);
            padding = 12;
            // 如果有搜索框
            if (me.options.search) {
                me.searchField.setWidth(width);
                searchHeight = me.searchFiedlDiv.outerHeight(true);
            }
            if (!isNaN(parseInt(me.options.height,10))) {
                height = parseInt(me.options.height,10);
            }
            if (!isNaN(parseInt(me.options.width,10))) {
                width = parseInt(me.options.width,10);
            }
            height = height - padding;
            treeBodyHeight = height - searchHeight;
            if (treeBodyHeight < 0) {
                treeBodyHeight = 0;
            }
            me.renderSize = Math.ceil(treeBodyHeight / liHeight);
            if (me.renderSize <= 0) {
                me.renderSize = 1;
            }
            me.treeBodyDiv.externalWidth(width).css("height", treeBodyHeight);
            me.treeBodyDiv[0].scrollTop = 0;
            //如果节点数比较少则一次性渲染
            if (me.isRenderAll) {
                // 清除绑定的scroll事件
                me.treeBodyDiv.unbind("scroll");
                me.treeUL.height("auto");
                optListDatas = [];
                for (var i = 0; i < me.optListDatas.length; i++) {
                    optListDatas.push(me.optObjDatas[me.optListDatas[i][KEY_PATH]]);
                }
                me._doRenderAll(optListDatas);
            } else {
                me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
                me.treeUL.height(me.optShowDatas.length * liHeight);
                optListDatas = me.optShowDatas.slice(0, me.renderSize);
                me._registScrollEvent();
                me._createListNode(optListDatas, 0, false);
            }
            //组件首次渲染时如果有默认值则需要触发change事件
            if (!me.__isTempFlag) {
                me.__isTempFlag = true;
                tValue = me._getValue(null, true);
                // 触发change事件
                if (tValue && tValue.length > 0) {
                    me._triggerHandler(tValue, eventChange, me);
                }
            }
        },
        /**
         * @private
         * @description 渲染
         * @param {String} id 宿主ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.treeEl.appendTo(me.renderEl);
            // 渲染搜索框
            if (me.searchField) {
                me.searchField.render(me.searchFiedlDiv.attr("id"));
            }
            me.setDisabled(me.options.disabled);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 触发注册事件
         * @param {Object} e 事件对象
         * @param {String} eName 事件名称
         * @param {Object} data 数据
         * @returns {Boolean} result 执行的结果
         */
        _triggerHandler: function(e, eName, data) {
            var me = this,
                    result;
            if ($.isNull(me.handlers)) {
                return;
            }
            $.each(me.handlers, function(handlerName, func) {
                // 回调注册事件
                if (eName === handlerName) {
                    me._info(eName + " event occured!");
                    result = func.call(null, e, data);
                }
            });
            return result;
        },
        /**
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用组件
         */
        setDisabled: function(disabled) {
            var me = this;
            me.options.disabled = disabled;
            if (me.searchField) {
                me.searchField.setDisabled(disabled);
            }
            if (disabled) {
                me.treeEl.addClass(treePanelDisabledClass);
            } else {
                me.treeEl.removeClass(treePanelDisabledClass);
            }
        },
        /**
         * @description 获取组件值
         * @param {Array} valueKeys 节点key信息
         * @param {Boolean} isAll 获取选中节点时,是否也获取过滤掉的选中节点
         * @return {Array} 选中值,格式：[{text:'text1',value:'value1',children: [...]},...]
         */
        getValue: function(valueKeys, isAll) {
            var me = this;
            return me._getValue(valueKeys, isAll);
        },
        /**
         * @private
         * @description 获取组件中选择的节点数据,以树型结构返回选中的节点数据数组
         * @param {Array} valueKeys 节点key信息
         * @param {Boolean} isAll 获取选中节点时,是否也获取过滤掉的选中节点
         * @return {Array} 选中值,格式：[{text:'text1',value:'value1',children: [...]},...]
         */
        _getValue: function(valueKeys, isAll) {
            var me = this,
                    result = {},
                    keys = me.options.valueKeys,
                    tDatas,
                    isInitValue = false,
                    tObjDatas = me.optObjDatas;
            if ($.isEmptyObject(me.selectedDatas)) {
                return [];
            }
            if ($.isArray(valueKeys) && valueKeys.length > 0) {
                keys = valueKeys;
            }
            if (isAll) {
                tObjDatas = me.objDatas;
            }
            //从当前操作的数据中还原选中数据
            me.parseTreeDatas(me.selectedDatas, tObjDatas, keys, result);
            if (!result["data"]) {
                return [];
            }
            tDatas = $.objClone(result["data"]);
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                for (var key in me.selectedDatas) {
                    if (!me.selectedDatas[key][KEY_LEAF]) {
                        isInitValue = true;
                    }
                    break;
                }
                if (isInitValue) {
                    tDatas = me._doInitValue(tDatas);
                }
            }
            return tDatas;
        },
        /**
         * @private
         * @description 单选可编辑选了父亲节点时,处理数据删除最后一层级的children
         * @param {Array} datas 待处理的数据
         * @return {Array} datas 处理后的数据
         */
        _doInitValue: function(datas) {
            var me = this;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i][KEY_CHILDREN] && datas[i][KEY_CHILDREN].length > 0) {
                    if ("string" == typeof datas[i][KEY_CHILDREN][0]) {
                        delete datas[i][KEY_CHILDREN];
                        return datas;
                    } else {
                        me._doInitValue(datas[i][KEY_CHILDREN]);
                    }
                }
            }
            return datas;
        },
        /**
         * @private
         * @description 一次性渲染全部节点数据
         * @param {Array} datas 节点信息
         */
        _doRenderAll: function(datas) {
            var me = this,
                    text,
                    nTextEl,
                    expandedEl,
                    checkedEl,
                    textEl,
                    liEl,
                    depth,
                    lineClass,
                    eblowClass,
                    tNode,
                    tempLastNode,
                    iconType,
                    maxWidth = 0,
                    isEdit = false,
                    _treeNodeTextClass = "";
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                isEdit = true;
                _treeNodeTextClass = treeNodeTextClass;
                me.treeBodyDiv.unbind("contextmenu");
                me.treeBodyDiv.bind("contextmenu", {"me": me, isTreeBody: true}, me._onNodeMousedown);
            }
            //选移除之前渲染
            me.treeUL.find("li").remove();
            if (!datas || datas.length <= 0) {
                return;
            }
            for (var i = 0; i < datas.length; i++) {
                nTextEl = null;
                expandedEl = null;
                //创建节点LI
                liEl = $("<li>").addClass(treeNodeClass);
                tNode = datas[i];
                if (me.options.useArrows) {
                    lineClass = treeNodeLineClass;
                } else {
                    lineClass = treeNodeMinusLineClass;
                }
                //拿到当前节点的深度
                depth = tNode[KEY_DEPTH];
                //逐层上报筛选所有父节点中是最一个节点的节点
                tempLastNode = {};
                me._getPLastNode(tNode, me.optObjDatas, tempLastNode);
                //处理连接线
                for (var j = 0; j < depth; j++) {
                    if (tempLastNode[j]) {
                        $("<span>").addClass(treeNodeMinusLineClass).appendTo(liEl);
                    } else {
                        $("<span>").addClass(lineClass).appendTo(liEl);
                    }
                }
                //如果不是叶子节点
                if (!tNode[KEY_LEAF]) {
                    //如果展开,则加展开样式
                    if (tNode[KEY_EXPANDED]) {
                        expandedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_EXPANDED).addClass(treeExpandedClass).appendTo(liEl);
                    } else {
                        expandedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_EXPANDED).addClass(treeCollapsedClass).appendTo(liEl);
                    }
                    //如果显示图标,则加上图标
                    if (me.options.icon) {
                        $("<span>").addClass(treeParentNodeIcoClass).appendTo(liEl);
                    }
                } else {
                    //如果显示连接线,则加上连接线
                    if (me.options.useArrows) {
                        if (tNode[KEY_ISLAST]) {
                            eblowClass = treeNodeEblowEndClass;
                        } else {
                            eblowClass = treeNodeEblowClass;
                        }
                    } else {
                        eblowClass = treeNodeMinusEblowClass;
                    }
                    $("<span>").addClass(eblowClass).appendTo(liEl);
                    //如果显示图标,则加上图标
                    if (me.options.icon) {
                        //如果没有配置,则用默认的叶子节点图标
                        iconType = ICON_TYPE[tNode[KEY_ICON]];
                        if (iconType) {
                            $("<span>").addClass(iconType).appendTo(liEl);
                        } else {
                            if (!tNode[KEY_ICON]) {
                                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(liEl);
                            } else {
                                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(liEl)
                                        .css({"background": 'url(' + tNode[KEY_ICON] + ')'});
                            }
                        }
                    }
                }
                //如果为多选,则加入check框
                if (me.options.multi) {
                    checkedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_CHECKED).addClass(treeUnCheckedClass).appendTo(liEl);
                }
                text = $.nullToString(tNode[KEY_TEXT]);
                textEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(liEl);
                if (me.options.showCCount && !tNode[KEY_LEAF]) {
                    nTextEl = me._addCNodeCount(tNode, liEl, textEl);
                } else {
                // 是否有tip提示
                if (me.options.tip) {
                    textEl.attr("title", tNode[KEY_QTIP]);
                    }
                }
                if (tNode[KEY_HIDDEN]) {
                    liEl.hide();
                }
                //节点信息中加入此节点下的EL信息,便于后续操作
                tNode[KEY_EL] = {};
                tNode[KEY_EL][KEY_LI] = liEl;
                if (expandedEl) {
                    tNode[KEY_EL][KEY_EXPANDED] = expandedEl;
                }
                if (checkedEl) {
                    //双击文本时选中处理
                    textEl.bind("dblclick", {"me": me, "node": tNode, "checkedEl": checkedEl}, me._onNodeDbClick);
                    if (nTextEl) {
                        nTextEl.bind("dblclick", {"me": me, "node": tNode, "checkedEl": checkedEl, "textEl": textEl}, me._onNodeDbClick);
                    }
                    tNode[KEY_EL][KEY_CHECKED] = checkedEl;
                    me._checked(tNode, tNode[KEY_CHECKED]);
                } else {
                    textEl.bind("dblclick", {"me": me, "node": tNode, "expandedEl": expandedEl}, me._onNodeDbClick);
                    if (nTextEl) {
                        nTextEl.bind("dblclick", {"me": me, "node": tNode, "expandedEl": expandedEl, "textEl": textEl}, me._onNodeDbClick);
                    }
                }
                //给LI绑上节点信息,注册单击事件
                liEl.data(ATTR_NODE, tNode).bind("click", {"me": me, "node": tNode, "liEl": liEl}, me._onNodeClick);
                if (!me.options.multi && $.isArray(me.options.editable) && me.options.editable.length > 0) {
                    liEl.bind("contextmenu", {"me": me, "node": tNode, "liEl": liEl, textEl: textEl}, me._onNodeMousedown);
                }
                //单选选中样式处理
                if (!me.options.multi && me.selectedDatas[tNode[KEY_PATH]]) {
                    me._doSelected(tNode);
                }
                liEl.appendTo(me.treeUL);
            }
            maxWidth = me._getLiMaxWidth(me.treeUL, isEdit);
            me._setElWidth(me.treeUL, maxWidth, isEdit);
            return;
        },
        /**
         * @private
         * @description 注册主区域滚动加载数据事件
         */
        _registScrollEvent: function() {
            var me = this,
                    sScrollTop = 0,
                    treeBodyDiv = me.treeBodyDiv;
            // 先清楚绑定的scroll事件
            treeBodyDiv.unbind("scroll");
            treeBodyDiv.scroll(function(e) {
                // 如果是横向滚动条滚动,则不处理
                if (sScrollTop == $(this)[0].scrollTop) {
                    return;
                }
                sScrollTop = $(this)[0].scrollTop;
                me._doTriggerScrollEvent();
            });
        }, /**
         * @private
         * @description 主区域滚动加载数据事件处理
         */
        _doTriggerScrollEvent: function() {
            var me = this,
                    sScrollHight,
                    sScrollTop,
                    sDivHight,
                    startIndex = 0,
                    treeBodyDiv = me.treeBodyDiv,
                    rDatas = [],
                    isLast = false,
                    tempStart = 0;
            isLast = false;
            sDivHight = treeBodyDiv[0].clientHeight;
            sScrollHight = treeBodyDiv[0].scrollHeight;
            sScrollTop = treeBodyDiv[0].scrollTop;
            startIndex = Math.floor(sScrollTop / me.liHeight);
            rDatas = me.optShowDatas.slice(startIndex, (startIndex + me.renderSize));
            // 加载到最后一页数据的处理
            if (sScrollTop > 0 && (sScrollTop + sDivHight) >= sScrollHight) {
                isLast = true;
                tempStart = me.optShowDatas.length - me.renderSize;
                if (tempStart < 0) {
                    tempStart = 0;
                    sScrollTop = 0;
                }
                rDatas = me.optShowDatas.slice(tempStart);
            } else {
                isLast = false;
                if (sScrollTop <= 0 || startIndex < 0) {
                    startIndex = 0;
                    sScrollTop = 0;
                    rDatas = me.optShowDatas.slice(startIndex, (startIndex + me.renderSize));
                }
            }
            me._doScrollLoad(rDatas, sScrollTop, isLast);
        },
        /**
         * @private
         * @description 大数据量滚动加载处理:生成节点
         * @param {Array} datas 待渲染节点的数据
         * @param {Number} sScrollTop 滚动条滚动的位置
         * @param {Boolean} isLast 是否加载到底部
         */
        _createListNode: function(datas, sScrollTop, isLast) {
            var me = this;
            if ($.isNull(datas)) {
                return;
            }
            me.treeUL.find("li").remove();
            me._doScrollLoad(datas, sScrollTop, isLast);
        },
        /**
         * @private
         * @description 主区域滚动加载数据渲染处理
         * @param {Array} datas 渲染节点的数据
         * @param {Number} sScrollTop 向上滚动的距离
         * @param {Boolean} isLast 是否加载到底部
         */
        _doScrollLoad: function(datas, sScrollTop, isLast) {
            var me = this,
                    liDoms,
                    treeUL = me.treeUL,
                    paddingWidth = 5,
                    maxWidth = 0,
                    sDivHight;
            // 如果到底,将滚动条设置到底部
            if (isLast) {
                me.treeBodyDiv[0].scrollTop = treeUL.height() - me.treeBodyDiv[0].clientHeight + paddingWidth;
            }
            // 由于本次要渲染的LI可能会出现横向滚动条,固高度重新计算,应减去底部横向滚动条所占的高
            if (sScrollTop > 0) {
                sDivHight = me.treeBodyDiv[0].clientHeight + sScrollTop;
                // Y坐标
                sScrollTop = sDivHight - datas.length * me.liHeight;
            }
            //记录之前渲染的LI,本次渲染完后需要删除这些LI
            liDoms = treeUL.find("li");
            for (var i = 0; i < datas.length; i++) {
                me._addLiNode(datas[i], (sScrollTop + i * me.liHeight));
            }
            //防止横向滚动条位置变动,渲染后再删除
            liDoms.remove();
            maxWidth = me._getLiMaxWidth(treeUL);
            //拿到本次渲染的LI,设置宽度
            me._setElWidth(treeUL, maxWidth);
        },
        /**
         * @private
         * @description 生成主列表区域li标签
         * @param {Object} node 节点信息
         * @param {Number} top Y坐标
         * @returns {Object} liEl 当前操作的LI
         */
        _addLiNode: function(node, top) {
            var me = this,
                    depth,
                    lineClass,
                    eblowClass,
                    iconType,
                    tempLastNode,
                    expandedEl,
                    checkedEl,
                    textEl,
                    liEl,
                    text,
                    nTextEl,
                    disabled = me.options.disabled;
            liEl = $("<li>").addClass(treeNodeClass).css({top: top, position: "absolute"});
            if (me.options.useArrows) {
                lineClass = treeNodeLineClass;
            } else {
                lineClass = treeNodeMinusLineClass;
            }
            depth = node[KEY_DEPTH];
            tempLastNode = {};
            me._getPLastNode(node, me.optObjDatas, tempLastNode);
            for (var j = 0; j < depth; j++) {
                if (tempLastNode[j]) {
                    $("<span>").addClass(treeNodeMinusLineClass).appendTo(liEl);
                } else {
                    $("<span>").addClass(lineClass).appendTo(liEl);
                }
            }
            //如果不是叶子节点
            if (!node[KEY_LEAF]) {
                //如果展开,则加展开样式
                if (node[KEY_EXPANDED]) {
                    expandedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_EXPANDED).addClass(treeExpandedClass).appendTo(liEl);
                } else {
                    expandedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_EXPANDED).addClass(treeCollapsedClass).appendTo(liEl);
                }
                //如果有图片,则加上图片
                if (me.options.icon) {
                    $("<span>").addClass(treeParentNodeIcoClass).appendTo(liEl);
                }
            } else {
                if (me.options.useArrows) {
                    if (node[KEY_ISLAST]) {
                        eblowClass = treeNodeEblowEndClass;
                    } else {
                        eblowClass = treeNodeEblowClass;
                    }
                } else {
                    eblowClass = treeNodeMinusEblowClass;
                }
                $("<span>").addClass(eblowClass).appendTo(liEl);
                //如果有图片,则加上图片
                if (me.options.icon) {
                    //如果没有配置,则用默认的叶子节点图标
                    iconType = ICON_TYPE[node[KEY_ICON]];
                    if (iconType) {
                        $("<span>").addClass(iconType).appendTo(liEl);
                    } else {
                        if (!node[KEY_ICON]) {
                            $("<span>").addClass(treeLeafNodeIcoClass).appendTo(liEl);
                        } else {
                            $("<span>").addClass(treeLeafNodeIcoClass).appendTo(liEl)
                                    .css({"background": 'url(' + node[KEY_ICON] + ')'});
                        }
                    }
                }
            }
            if (me.options.multi) {
                checkedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_CHECKED).addClass(treeUnCheckedClass).appendTo(liEl);
            }
            text = $.nullToString(node[KEY_TEXT]);
            textEl = $("<span>").text(text).appendTo(liEl);
            if (me.options.showCCount && !node[KEY_LEAF]) {
                nTextEl = me._addCNodeCount(node, liEl, textEl);
            } else {
            // 是否有tip提示
            if (me.options.tip) {
                textEl.attr("title", node[KEY_QTIP]);
                }
            }
            node[KEY_EL] = {};
            if (checkedEl) {
                //如果是多选则加入双击选中事件处理
                textEl.bind("dblclick", {"me": me, "node": node, "checkedEl": checkedEl}, me._onAsyncNodeDbClick);
                if (nTextEl) {
                    nTextEl.bind("dblclick", {"me": me, "node": node, "checkedEl": checkedEl}, me._onAsyncNodeDbClick);
                }
                node[KEY_EL][KEY_CHECKED] = checkedEl;
                me._checked(node, node[KEY_CHECKED]);
                delete node[KEY_EL][KEY_CHECKED];
            } else {
                textEl.bind("dblclick", {"me": me, "node": node}, me._onAsyncNodeDbClick);
                if (nTextEl) {
                    nTextEl.bind("dblclick", {"me": me, "node": node}, me._onAsyncNodeDbClick);
                }
            }
            node[KEY_EL][KEY_LI] = liEl;
            //给LI绑上节点信息,注册单击事件
            liEl.data(ATTR_NODE, node).bind("click", {"me": me, "node": node, "liEl": liEl}, me._onAsyncNodeClick);
            if (!me.options.multi && me.selectedDatas[node[KEY_PATH]]) {
                me._doSelected(node);
            }
            liEl.appendTo(me.treeUL);
            if (disabled) {
                me.setDisabled(disabled);
            }
            return liEl;
        },
        /**
         * @private
         * @description 滚动加载: 节点双击事件处理
         * @param {Object} e 事件对象
         */
        _onAsyncNodeDbClick: function(e) {
            var me = e.data.me,
                    checkedEl = e.data.checkedEl,
                    node = e.data.node,
                    el = $(e.target),
                    expandEl,
                    flag;
            if (me.options.disabled) {
                return;
            }
            flag = me._triggerHandler($.objClone(node), eventBeforeDbClick, me);
            if (false === flag || "false" === flag) {
                return;
            }
            //如果为多选,选中时则展开子节点;如果为单选且为非叶子节点,则双击时切换展开与折叠
            if (checkedEl) {
                me._doAsyncChecked(checkedEl, node);
            } else {
                expandEl = el.parent("." + treeNodeClass).find("span[name='expanded']");
                if (!node[KEY_LEAF] && expandEl) {
                    me._doAsyncExpanded(expandEl, node);
                }
            }
            me._triggerHandler($.objClone(node), eventDbClick, me);
        },
        /**
         * @private
         * @description 输入框获得焦点时处理
         * @param {Object} e 事件对象
         */
        _doInputFocus: function(e) {
            var me = e.data.me,
                    inputEl;
            if (e.data.self) {
                inputEl = e.data.self.get(0);
                if (inputEl) {
                    inputEl.selectionStart = inputEl.value.length;
                }
            }
        },
        /**
         * @private
         * @description 双击时编辑处理
         * @param {Object} e 事件对象
         */
        _doEdit: function(e) {
            var me = e.data.me,
                    node = e.data.node,
                    oldText,
                    newText,
                    flag;
            oldText = e.data["oldText"];
            newText = e.data.self.val();
            //修改text值
            if (oldText != newText) {
                flag = me._triggerHandler({text: newText, oldText: oldText}, eventBeforeTextChange, me);
                if (false === flag || "false" === flag) {
                    flag = false;
                    newText = oldText;
                } else {
                    flag = true;
                }
            }
            e.data.self.remove();
            e.data.el.text(newText);
            if (flag) {
                if (me.optObjDatas[node[KEY_PATH]]) {
                    me.optObjDatas[node[KEY_PATH]][KEY_TEXT] = newText;
                    me.optObjDatas[node[KEY_PATH]][KEY_QTIP] = newText;
                    if (me.options.tip) {
                        if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
                            me._upDateCNodeCount(me.optObjDatas[node[KEY_PATH]]);
                        } else {
                            e.data.el.attr("title", newText);
                        }
                    }
                }
                me.objDatas = me.optObjDatas;
                me._triggerHandler({text: newText, oldText: oldText}, eventTextChange, me);
            }
            me._triggerHandler($.objClone(node), eventEdit, me);
        },
        /**
         * @private
         * @description 滚动加载: 节点单击事件处理
         * @param {Object} e 事件对象
         */
        _onNodeMousedown: function(e) {
            var me = e.data.me,
                    itemDatas = [],
                    _item;
            if (me.options.disabled) {
                return;
            }
            if (!me.options.editable) {
                return;
            }
            //如果只配置了true则不出右键弹出菜单
            if (true === me.options.editable || "true" === me.options.editable) {
                return;
            }
            //如果menus没配置则不出右键弹出菜单
            if ($.isArray(me.options.editable) && me.options.editable.length <= 0) {
                return;
            }
            if (e.button != 2) {
                return;
            }
            //选中样式处理
            if (e.data.isTreeBody) {
                me._doSelected(null);
            } else {
                me._doSelected(e.data.node);
            }
            if (me._editMenu) {
                me._editMenu.destroy();
            }
            if (!me._editMenuId) {
                me._editMenuId = me.options.id + "-edit-menu";
                $("<div id=\"" + me._editMenuId + "\">").appendTo(document.body);
            }
            var x = e.pageX;
            for (var i = 0; i < me.options.editable.length; i++) {
                _item = EDIT_TYPE[me.options.editable[i]];
                if (_item) {
                    itemDatas.push(_item);
                }
            }
            me._editMenu = new Sweet.menu.Menu({
                renderTo: me._editMenuId,
                widgetClass: treeNodeEditMenuClass,
                X: x,
                Y: e.pageY,
                itemClick: function(evt, data) {
                    me._doMenuClick(e, me, data);
                },
                items: itemDatas
            });
            e.preventDefault();
            e.stopPropagation();
            me._doScrollEvent();
            return false;
        },
        /**
         * @private
         * @description 滚动时删除弹出菜单
         */
        _doScrollEvent: function() {
            var me = this;
            // 先清楚绑定的scroll事件
            me.treeBodyDiv.unbind("scroll");
            me.treeBodyDiv.scroll(function(e) {
                if (me._editMenu) {
                    me._editMenu.destroy();
                }
            });
        },
        /**
         * @private
         * @description 编辑menu单击事件处理
         * @param {Object} e 事件对象
         * @param {Object} me tree组件对象
         * @param {Object} data 菜单项对象
         */
        _doMenuClick: function(e, me, data) {
            var cNode;
            if (me.options.disabled) {
                return;
            }
            switch (data["text"]) {
                case i18n["add"]:
                    //新创建的节点
                    cNode = {};
                    cNode[KEY_TEXT] = i18n["nodeName"];
                    cNode[KEY_VALUE] = me.options.id + "-edit-" + (++uuid);
                    me._doAddNode(cNode, e.data.node);
                    break;
                case i18n["edit"]:
                    me._doEditNode(e, true);
                    break;
                case i18n["delete"]:
                    me._doDeleteNode(e.data.node);
                    break;
                default:
                    return;
            }
        },
        /**
         * @private
         * @description 编辑menu单击编辑项事件处理
         * @param {Object} e 事件对象
         * @param {Boolean} isDbClickEdit 双击节点时是否出编辑框
         */
        _doEditNode: function(e, isDbClickEdit) {
            var me = this,
                    node,
                    el,
                    nodeOldText,
                    editInputEl,
                    flag;
            el = e.data.textEl;
            if (!el) {
                return;
            }
            node = e.data.node;
            flag = me._triggerHandler({newNode: null, node: $.objClone(node)}, eventBeforeEdit, me);
            if (false === flag || "false" === flag) {
                return;
            }
            if (!(false === isDbClickEdit || "false" === isDbClickEdit)) {
                nodeOldText = el.text();
                el.text("");
                editInputEl = $("<input type='text'>").attr({value: nodeOldText}).css({width: "100%", height: "22px"});
                editInputEl.appendTo(el)
                        .bind("blur", {me: me, el: el, node: node, self: editInputEl, oldText: nodeOldText}, me._doEdit)
                        .bind("focus", {me: me, el: el, node: node, self: editInputEl, oldText: nodeOldText}, me._doInputFocus);
                editInputEl.focus();
            }
        },
        /**
         * @private
         * @description 编辑menu单击添加项事件处理(根节点)
         * @param {Object} cNode 待添加节点对象
         * @param {Object} node 加到此节点之后/之前
         * @param {Boolean} isBefore 加到此节点之前
         */
        _doAddRootNode: function(cNode, node, isBefore) {
            var me = this,
                    firstLi,
                    cLiEl,
                    text,
                    cTextEl,
                    maxWidth,
                    depth = 0,
                    _treeNodeTextClass = "",
                    _listDatas = [],
                    _tempLastNdoe;
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                _treeNodeTextClass = treeNodeTextClass;
            }
            cNode[KEY_DEPTH] = depth;
            cNode[KEY_HIDDEN] = false;
            cNode[KEY_LEAF] = true;
            cNode[KEY_QTIP] = cNode[KEY_TEXT];
            cNode[KEY_PATH] = cNode[KEY_VALUE];
            cLiEl = $("<li>").addClass(treeNodeClass);
            $("<span>").addClass(treeNodeMinusEblowClass).appendTo(cLiEl);
            //如果显示图标,则加上图标
            if (me.options.icon) {
                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(cLiEl);
            }
            text = $.nullToString(cNode[KEY_TEXT]);
            cTextEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(cLiEl);
            // 是否有tip提示
            if (me.options.tip) {
                cTextEl.attr("title", cNode[KEY_QTIP]);
            }
            //节点信息中加入此节点下的EL信息,便于后续操作
            cNode[KEY_EL] = {};
            cNode[KEY_EL][KEY_LI] = cLiEl;
            cTextEl.bind("dblclick", {"me": me, "node": cNode}, me._onNodeDbClick);
            //给LI绑上节点信息,注册单击事件
            cLiEl.data(ATTR_NODE, cNode).bind("click", {"me": me, "node": cNode, "liEl": cLiEl}, me._onNodeClick);
            cLiEl.bind("contextmenu", {"me": me, "node": cNode, "liEl": cLiEl, textEl: cTextEl}, me._onNodeMousedown);
            me.optObjDatas[cNode[KEY_PATH]] = cNode;
            me.objDatas = me.optObjDatas;
            if (!$.isEmptyObject(node)) {
                if (isBefore) {
                    _tempLastNdoe = node;
                    //将新加的节点加入列表数据中
                    for (var i = 0; i < me.optListDatas.length; i++) {
                        if (_tempLastNdoe[KEY_PATH] == me.optListDatas[i][KEY_PATH]) {
                            _listDatas.push({path: cNode[KEY_PATH]});
                        }
                        _listDatas.push(me.optListDatas[i]);
                    }
                    me.optListDatas = _listDatas;
                    me.listDatas = me.optListDatas;
                    cLiEl.insertBefore(_tempLastNdoe[KEY_EL][KEY_LI]);
                } else {
                    if (node[KEY_LEAF]) {
                        _tempLastNdoe = node;
                    } else {
                        node[KEY_ALLCHILDREN] = node[KEY_ALLCHILDREN] || [];
                        if (node[KEY_ALLCHILDREN].length <= 0) {
                            _tempLastNdoe = node;
                        } else {
                            _tempLastNdoe = me.optObjDatas[node[KEY_ALLCHILDREN][node[KEY_ALLCHILDREN].length - 1]];
                        }
                    }
                    //将新加的节点加入列表数据中
                    for (var i = 0; i < me.optListDatas.length; i++) {
                        _listDatas.push(me.optListDatas[i]);
                        if (_tempLastNdoe[KEY_PATH] == me.optListDatas[i][KEY_PATH]) {
                            _listDatas.push({path: cNode[KEY_PATH]});
                        }
                    }
                    me.optListDatas = _listDatas;
                    me.listDatas = me.optListDatas;
                    cLiEl.insertAfter(_tempLastNdoe[KEY_EL][KEY_LI]);
                }
            } else {
                firstLi = me.treeUL.find("li");
                if (isBefore && firstLi && firstLi.length > 0) {
                    me.optListDatas = [{path: cNode[KEY_PATH]}].concat(me.optListDatas);
                    me.listDatas = me.optListDatas;
                    cLiEl.insertBefore($(firstLi[0]));
                } else {
                    //将新加的节点加入列表数据中
                    me.optListDatas.push({path: cNode[KEY_PATH]});
                    me.listDatas = me.optListDatas;
                    //将新创建的节点加到后面
                    cLiEl.appendTo(me.treeUL);
                }
            }
            //单选选中样式处理
            me._doSelected(cNode);
            //计算最大宽度
            maxWidth = me._getLiMaxWidth(me.treeUL, true);
            me._setElWidth(me.treeUL, maxWidth, true);
        },
        /**
         * @private
         * @description 编辑menu单击添加项事件处理
         * @param {Object} cNode 待添加节点对象
         * @param {Object} node 节点对象
         */
        _doAddNode: function(cNode, node) {
            var me = this,
                    liEl,
                    _tempLastNdoe,
                    _tempAllChildren,
                    isLeaf,
                    cLiEl,
                    text,
                    textEl,
                    cTextEl,
                    expandedEl,
                    nTextEl,
                    maxWidth,
                    depth = 0,
                    _listDatas = [],
                    lineClass = treeNodeMinusLineClass,
                    _treeNodeTextClass = "";
            if (!cNode) {
                return;
            }
            if ($.isEmptyObject(node)) {
                cNode[KEY_DEPTH] = depth;
                cNode[KEY_HIDDEN] = false;
                cNode[KEY_LEAF] = true;
                cNode[KEY_QTIP] = cNode[KEY_TEXT];
                cNode[KEY_PATH] = cNode[KEY_VALUE];
                me._doAddRootNode(cNode);
                return;
            }
            isLeaf = node[KEY_LEAF];
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                _treeNodeTextClass = treeNodeTextClass;
            }
            liEl = node[KEY_EL][KEY_LI];
            liEl.children().remove();
            //节点信息更改
            node[KEY_LEAF] = false;
            node[KEY_EXPANDED] = true;
            node[KEY_HIDDEN] = false;
            //拿到当前节点的深度
            depth = node[KEY_DEPTH];
            cNode[KEY_DEPTH] = (depth + 1);
            cNode[KEY_HIDDEN] = false;
            cNode[KEY_LEAF] = true;
            cNode[KEY_QTIP] = cNode[KEY_TEXT];
            cNode[KEY_PATH] = node[KEY_PATH] + pathConnectSymbol + cNode[KEY_VALUE];
            cNode[KEY_PARENTPATH] = node[KEY_PATH];
            cLiEl = $("<li>").addClass(treeNodeClass);
            for (var j = 0; j < cNode[KEY_DEPTH]; j++) {
                $("<span>").addClass(lineClass).appendTo(cLiEl);
            }
            $("<span>").addClass(treeNodeMinusEblowClass).appendTo(cLiEl);
            //如果显示图标,则加上图标
            if (me.options.icon) {
                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(cLiEl);
            }
            text = $.nullToString(cNode[KEY_TEXT]);
            cTextEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(cLiEl);
            // 是否有tip提示
            if (me.options.tip) {
                cTextEl.attr("title", cNode[KEY_QTIP]);
            }
            //节点信息中加入此节点下的EL信息,便于后续操作
            cNode[KEY_EL] = {};
            cNode[KEY_EL][KEY_LI] = cLiEl;
            cTextEl.bind("dblclick", {"me": me, "node": cNode}, me._onNodeDbClick);
            //给LI绑上节点信息,注册单击事件
            cLiEl.data(ATTR_NODE, cNode).bind("click", {"me": me, "node": cNode, "liEl": cLiEl}, me._onNodeClick);
            cLiEl.bind("contextmenu", {"me": me, "node": cNode, "liEl": cLiEl, textEl: cTextEl}, me._onNodeMousedown);

            //当前节点信息变更
            for (var j = 0; j < depth; j++) {
                $("<span>").addClass(lineClass).appendTo(liEl);
            }
            expandedEl = $("<span>").attr(ATTR_NAME, EVENTTYPE_EXPANDED).addClass(treeExpandedClass).appendTo(liEl);
            //如果显示图标,则加上图标
            if (me.options.icon) {
                $("<span>").addClass(treeParentNodeIcoClass).appendTo(liEl);
            }
            text = $.nullToString(node[KEY_TEXT]);
            textEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(liEl);
            textEl.bind("dblclick", {"me": me, "node": node, "expandedEl": expandedEl}, me._onNodeDbClick);

            liEl.removeData(ATTR_NODE);
            liEl.unbind("click");
            liEl.unbind("contextmenu");
            //给LI绑上节点信息,注册单击事件
            liEl.data(ATTR_NODE, node).bind("click", {"me": me, "node": node, "liEl": liEl}, me._onNodeClick);
            liEl.bind("contextmenu", {"me": me, "node": node, "liEl": liEl, textEl: textEl}, me._onNodeMousedown);
            //节点信息中加入此节点下的EL信息,便于后续操作
            node[KEY_EL] = {};
            node[KEY_EL][KEY_LI] = liEl;
            node[KEY_EL][KEY_EXPANDED] = expandedEl;

            //将新创建的节点加入到当前编辑节点中
            if (isLeaf) {
                node[KEY_CHILDREN] = [cNode[KEY_PATH]];
                node[KEY_ALLCHILDREN] = [cNode[KEY_PATH]];
                _tempLastNdoe = node;
            } else {
                node[KEY_CHILDREN] = node[KEY_CHILDREN] || [];
                node[KEY_ALLCHILDREN] = node[KEY_ALLCHILDREN] || [];
                if (node[KEY_ALLCHILDREN].length <= 0) {
                    _tempLastNdoe = node;
                } else {
                    _tempLastNdoe = me.optObjDatas[node[KEY_ALLCHILDREN][node[KEY_ALLCHILDREN].length - 1]];
                }
                node[KEY_CHILDREN].push(cNode[KEY_PATH]);
                node[KEY_ALLCHILDREN].push(cNode[KEY_PATH]);
            }
            //更新数据
            me.optObjDatas[cNode[KEY_PATH]] = cNode;
            me.objDatas = me.optObjDatas;
            //将新加的节点加入列表数据中
            for (var i = 0; i < me.optListDatas.length; i++) {
                _listDatas.push(me.optListDatas[i]);
                if (_tempLastNdoe[KEY_PATH] == me.optListDatas[i][KEY_PATH]) {
                    _listDatas.push({path: cNode[KEY_PATH]});
                }
            }
            //修改列表数据
            me.optListDatas = _listDatas;
            me.listDatas = me.optListDatas;
            if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
                //上报让每层父节点的allchildren加入新加的节点
                me.bubble(node, function(node, pNode) {
                    _tempAllChildren = [];
                    for (var i = 0; i < pNode[KEY_ALLCHILDREN].length; i++) {
                        _tempAllChildren.push(pNode[KEY_ALLCHILDREN][i]);
                        if (_tempLastNdoe[KEY_PATH] == pNode[KEY_ALLCHILDREN][i]) {
                            _tempAllChildren.push(cNode[KEY_PATH]);
                        }
                    }
                    pNode[KEY_ALLCHILDREN] = _tempAllChildren;
                    me._upDateCNodeCount(pNode);
                });
                nTextEl = me._addCNodeCount(node, liEl, textEl);
                if (nTextEl) {
                    nTextEl.bind("dblclick", {"me": me, "node": node, "expandedEl": expandedEl, "textEl": textEl}, me._onNodeDbClick);
                }
            } else {
            //上报让每层父节点的allchildren加入新加的节点
            me.bubble(node, function(node, pNode) {
                _tempAllChildren = [];
                for (var i = 0; i < pNode[KEY_ALLCHILDREN].length; i++) {
                    _tempAllChildren.push(pNode[KEY_ALLCHILDREN][i]);
                    if (_tempLastNdoe[KEY_PATH] == pNode[KEY_ALLCHILDREN][i]) {
                        _tempAllChildren.push(cNode[KEY_PATH]);
                    }
                }
                pNode[KEY_ALLCHILDREN] = _tempAllChildren;
            });
                // 是否有tip提示
                if (me.options.tip) {
                    textEl.attr("title", node[KEY_QTIP]);
                }
            }
            //将新创建的节点加到后面
            cLiEl.insertAfter(_tempLastNdoe[KEY_EL][KEY_LI]);
            //单选选中样式处理
            me._doSelected(cNode);
            //展开子节点
            me._doExpanded(expandedEl, node, false);
            //计算最大宽度
            maxWidth = me._getLiMaxWidth(me.treeUL, true);
            me._setElWidth(me.treeUL, maxWidth, true);
        },
        /**
         * @private
         * @description 编辑menu单击删除项事件处理
         * @param {Object} node 节点对象
         */
        _doDeleteNode: function(node) {
            var me = this,
                    tDatas = [],
                    tDeletePaths = [],
                    pNode,
                    tNode,
                    flag,
                    maxWidth;
            if (!node) {
                return;
            }
            flag = me._triggerHandler($.objClone(node), eventBeforeRemove, me);
            if (false === flag || "false" === flag) {
                return;
            }
            if (node[KEY_ALLCHILDREN]) {
                tDeletePaths = node[KEY_ALLCHILDREN];
            }
            tDeletePaths.push(node[KEY_PATH]);
            pNode = me.optObjDatas[node[KEY_PARENTPATH]];
            //先从父节点children中删除此节点
            if (pNode && pNode[KEY_CHILDREN]) {
                for (var i = 0; i < pNode[KEY_CHILDREN].length; i++) {
                    if (pNode[KEY_CHILDREN][i] != node[KEY_PATH]) {
                        tDatas.push(pNode[KEY_CHILDREN][i]);
                    }
                }
                pNode[KEY_CHILDREN] = tDatas;
            }
            if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
            me.bubble(node, function(node, pNode) {
                pNode[KEY_ALLCHILDREN] = me._deleteFun(pNode[KEY_ALLCHILDREN], tDeletePaths);
                    me._upDateCNodeCount(pNode);
            });
            } else {
                me.bubble(node, function(node, pNode) {
                    pNode[KEY_ALLCHILDREN] = me._deleteFun(pNode[KEY_ALLCHILDREN], tDeletePaths);
                });
            }
            //删除LI,同时也从当前操作数据中删除此节点
            for (var i = 0; i < tDeletePaths.length; i++) {
                tNode = me.optObjDatas[tDeletePaths[i]];
                if (tNode && tNode[KEY_EL] && tNode[KEY_EL][KEY_LI]) {
                    tNode[KEY_EL][KEY_LI].remove();
                }
                delete me.optObjDatas[tDeletePaths[i]];
                delete me.selectedDatas[tDeletePaths[i]];
            }
            me.objDatas = me.optObjDatas;
            //修改列表数据
            me.optListDatas = me._deleteFun(me.optListDatas, tDeletePaths);
            me.listDatas = me.optListDatas;
            maxWidth = me._getLiMaxWidth(me.treeUL, true);
            me._setElWidth(me.treeUL, maxWidth, true);
            me._triggerHandler($.objClone(node), eventRemove, me);
        },
        /**
         * @private
         * @description 从array1中移除array2
         * @param {Array} array1 源数据
         * @param {Array} array2 要删除的数据
         * @return {Array} datas 删除后的数组
         */
        _deleteFun: function(array1, array2) {
            var datas = [],
                    tObjs,
                    tPath;
            if (!array1) {
                return datas;
            }
            if (!array2 || array2.length <= 0) {
                return array1;
            }
            tObjs = {};
            for (var i = 0; i < array2.length; i++) {
                tObjs[array2[i]] = array2[i];
            }
            for (var i = 0; i < array1.length; i++) {
                tPath = array1[i];
                if (tPath[KEY_PATH]) {
                    if (!tObjs[tPath[KEY_PATH]]) {
                        datas.push(tPath);
                    }
                } else {
                    if (!tObjs[tPath]) {
                        datas.push(tPath);
                    }
                }
            }
            return datas;
        },
        /**
         * @private
         * @description 滚动加载: 节点单击事件处理
         * @param {Object} e 事件对象
         */
        _onAsyncNodeClick: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    node = e.data.node;
            if (me.options.disabled) {
                return;
            }
            switch (self.attr(ATTR_NAME)) {
                case EVENTTYPE_EXPANDED:
                    me._doAsyncExpanded(self, node);
                    break;
                case EVENTTYPE_CHECKED:
                    me._doAsyncChecked(self, node);
                    break;
                default:
                    me._doSelected(node);
                    me._triggerHandler($.objClone(node), eventClick, me);
                    return;
            }
        },
        /**
         * @private
         * @description 滚动加载时节点check处理
         * @param {Boolean} el 是否选中
         * @param {Object} node 当前操作的节点
         */
        _doAsyncChecked: function(el, node) {
            var me = this,
                    flag,
                    checked = !el.hasClass(treeFullCheckedClass),
                    allChildrenArray = node[KEY_ALLCHILDREN] || [],
                    tNode;
            if (me.options.disabled) {
                return;
            }
            flag = me._triggerHandler({node: $.objClone(node), checked: checked}, eventBeforeCheckChange, me);
            if (false === flag || "false" === flag) {
                return;
            }
            //叶子节点处理
            if (node[KEY_LEAF]) {
                me._doAsyncLeafChecked(node, checked);
            } else {
                if (checked) {
                    node[KEY_HIDDEN] = false;
                    node[KEY_EXPANDED] = true;
                    //设置选中状态
                    me._asyncChecked(node, CHECKED_STATE_FULLCHECKED);
                    //如果为延迟加载
                    if (me.options.loader && !node[KEY_LOADED]) {
                        node[KEY_LOADED] = true;
                        flag = me._doLoaderLoad(node, $.objClone(me.options.loader));
                        if (!flag) {
                            return;
                        }
                        //重新取
                        allChildrenArray = node[KEY_ALLCHILDREN] || [];
                    }
                    //如果为延迟加载
                    for (var i = 0; i < allChildrenArray.length; i++) {
                        tNode = me.optObjDatas[allChildrenArray[i]];
                        tNode[KEY_HIDDEN] = false;
                        if (!tNode[KEY_LEAF]) {
                            tNode[KEY_EXPANDED] = true;
                        }
                        me._asyncChecked(tNode, CHECKED_STATE_FULLCHECKED);
                    }
                } else {
                    //取消选中状态
                    node[KEY_HIDDEN] = false;
                    me._asyncChecked(node, CHECKED_STATE_UNCHECKED);
                    for (var i = 0; i < allChildrenArray.length; i++) {
                        tNode = me.optObjDatas[allChildrenArray[i]];
                        //取消选中状态
                        me._asyncChecked(tNode, CHECKED_STATE_UNCHECKED);
                    }
                }
            }
            me._doAsyncUpdatePNodeChecked(node);
            me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
            me.treeUL.height(me.optShowDatas.length * me.liHeight);
            me._doTriggerScrollEvent();
            me._triggerHandler({node: $.objClone(node), checked: checked}, eventCheckChange, me);
        },
        /**
         * @private
         * @description 滚动加载: 节点check样式处理
         * @param {Object} node 当前node对象
         * @param {Number} checked 选中状态枚举
         */
        _asyncChecked: function(node, checked) {
            var me = this;
            if (!node) {
                return;
            }
            node[KEY_CHECKED] = checked;
            switch (checked) {
                case CHECKED_STATE_UNCHECKED:
                    //未选中状态
                    delete me.selectedDatas[node[KEY_PATH]];
                    break;
                case CHECKED_STATE_CHECKED:
                    //半选中状态
                    delete me.selectedDatas[node[KEY_PATH]];
                    break;
                case CHECKED_STATE_FULLCHECKED:
                    //全选中状态
                    if (node[KEY_LEAF]) {
                        me.selectedDatas[node[KEY_PATH]] = node;
                    }
                    break;
                default:
                    return;
            }
        },
        /**
         * @private
         * @description 滚动加载时叶子节点check处理
         * @param {Object} node 当前操作的节点
         * @param {Boolean} checked 是否选中
         */
        _doAsyncLeafChecked: function(node, checked) {
            var me = this;
            if (checked) {
                //设置选中状态
                me._asyncChecked(node, CHECKED_STATE_FULLCHECKED);
                node[KEY_HIDDEN] = false;
            } else {
                //取消选中状态
                me._asyncChecked(node, CHECKED_STATE_UNCHECKED);
            }
        },
        /**
         * @private
         * @description 滚动加载时更新父层级节点checked
         * @param {Object} node 当前操作的节点
         */
        _doAsyncUpdatePNodeChecked: function(node) {
            var me = this,
                    checked = false,
                    isFullchecked = true,
                    pNode,
                    tNode,
                    cCount;
            //顶级节点不做处理
            pNode = me.optObjDatas[node[KEY_PARENTPATH]];
            if (!pNode) {
                return;
            }
            cCount = pNode[KEY_ALLCHILDREN].length;
            for (var i = 0; i < cCount; i++) {
                tNode = me.optObjDatas[pNode[KEY_ALLCHILDREN][i]];
                if (CHECKED_STATE_FULLCHECKED == tNode[KEY_CHECKED]) {
                    checked = true;
                } else {
                    isFullchecked = false;
                }
            }
            if (isFullchecked) {
                //设置全选状态
                me._asyncChecked(pNode, CHECKED_STATE_FULLCHECKED);
            } else {
                if (checked) {
                    //设置半选状态
                    me._asyncChecked(pNode, CHECKED_STATE_CHECKED);
                } else {
                    //取消选中状态
                    me._asyncChecked(pNode, CHECKED_STATE_UNCHECKED);
                }
            }
            //逐层上报更新父节点状态
            me._doAsyncUpdatePNodeChecked(pNode);
        },
        /**
         * @private
         * @description 滚动加载时节点展开折叠处理
         * @param {Object} el 当前li对象
         * @param {Object} node 当前操作的节点
         * @param {Object} node 当前操作的节点
         */
        _doAsyncExpanded: function(el, node) {
            var me = this,
                    tNode,
                    eventName,
                    expanded = el.hasClass(treeCollapsedClass),
                    childrenArray = node[KEY_CHILDREN] || [],
                    allChildrenArray = node[KEY_ALLCHILDREN] || [],
                    flag,
                    selectedDatas = {};
            if (me.options.disabled) {
                return;
            }
            if (expanded) {
                eventName = eventExpand;
                flag = me._triggerHandler($.objClone(node), eventBeforeExpand, me);
                if (false === flag || "false" === flag) {
                    return;
                }
                //如果为延迟加载
                if (me.options.loader && !node[KEY_LOADED]) {
                    node[KEY_LOADED] = true;
                    flag = me._doLoaderLoad(node, $.objClone(me.options.loader), selectedDatas);
                    if (!flag) {
                        return;
                    }
                    //重新取子节点
                    childrenArray = node[KEY_CHILDREN] || [];
                    allChildrenArray = node[KEY_ALLCHILDREN] || [];
                    //选中数据的处理
                    if (!$.isEmptyObject(selectedDatas)) {
                        if (me.options.multi) {
                            for (var key in selectedDatas) {
                                me.selectedDatas[key] = me.optObjDatas[key];
                            }
                            me.selectedDatas = me._getLeafSelectedDatas(me.selectedDatas);
                        } else {
                            //如果之前没有选中,本次加载回来选中前一条
                            if ($.isEmptyObject(me.selectedDatas)) {
                                for (var key in selectedDatas) {
                                    me.selectedDatas[key] = me.optObjDatas[key];
                                    break;
                                }
                            }
                        }
                    }
                }
                //展开时显示子层级节点
                el.removeClass(treeCollapsedClass);
                el.addClass(treeExpandedClass);
                node[KEY_EXPANDED] = true;
                if (childrenArray) {
                    for (var i = 0; i < childrenArray.length; i++) {
                        tNode = me.optObjDatas[childrenArray[i]];
                        tNode[KEY_HIDDEN] = false;
                    }
                }
            } else {
                eventName = eventCollapse;
                flag = me._triggerHandler($.objClone(node), eventBeforeCollapse, me);
                if (false === flag || "false" === flag) {
                    return;
                }
                //收起时将其下所有子节点隐藏
                el.removeClass(treeExpandedClass);
                el.addClass(treeCollapsedClass);
                node[KEY_EXPANDED] = false;
                if (allChildrenArray) {
                    for (var i = 0; i < allChildrenArray.length; i++) {
                        tNode = me.optObjDatas[allChildrenArray[i]];
                        tNode[KEY_HIDDEN] = true;
                        tNode[KEY_EXPANDED] = false;
                    }
                }
            }
            me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
            me.treeUL.height(me.optShowDatas.length * me.liHeight);
            me._doTriggerScrollEvent();
            flag = me._triggerHandler($.objClone(node), eventName, me);
        },
        /**
         * @private
         * @description 节点双击事件处理
         * @param {Object} e 事件对象
         */
        _onNodeDbClick: function(e) {
            var me = e.data.me,
                    checkedEl = e.data.checkedEl,
                    expandEl = e.data.expandedEl,
                    node = e.data.node,
                    checked,
                    expanded,
                    flag;
            if (me.options.disabled) {
                return;
            }
            flag = me._triggerHandler($.objClone(node), eventBeforeDbClick, me);
            if (false === flag || "false" === flag) {
                return;
            }
            //只针对单选可编辑
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                if (!$(e.target).hasClass(treeNodeCCTextClass)) {
                e.data.textEl = $(e.target);
                }
                me._doEditNode(e, me.options.isDbClickEdit);
                if (false === me.options.isDbClickEdit || "false" === me.options.isDbClickEdit) {
                    if (!node[KEY_LEAF] && expandEl) {
                        expanded = expandEl.hasClass(treeExpandedClass);
                        me._doExpanded(expandEl, node, expanded);
                    }
                }
                me._triggerHandler($.objClone(node), eventDbClick, me);
                return;
            }
            //如果为多选,选中时则展开子节点;如果为单选且为非叶子节点,则双击时切换展开与折叠
            if (checkedEl) {
                checked = !checkedEl.hasClass(treeFullCheckedClass);
                me._doChecked(node, checked, true);
            } else {
                if (!node[KEY_LEAF] && expandEl) {
                    expanded = expandEl.hasClass(treeExpandedClass);
                    me._doExpanded(expandEl, node, expanded);
                }
            }
            me._triggerHandler($.objClone(node), eventDbClick, me);
        },
        /**
         * @private
         * @description 节点单击事件处理
         * @param {Object} e 事件对象
         */
        _onNodeClick: function(e) {
            var me = e.data.me,
                    self = $(e.target),
                    node = e.data.node,
                    checked,
                    expanded;
            if (me.options.disabled) {
                return;
            }
            switch (self.attr(ATTR_NAME)) {
                case EVENTTYPE_EXPANDED:
                    expanded = self.hasClass(treeExpandedClass);
                    me._doExpanded(self, node, expanded);
                    break;
                case EVENTTYPE_CHECKED:
                    checked = !self.hasClass(treeFullCheckedClass);
                    me._doChecked(node, checked, true);
                    break;
                default:
                    me._doSelected(node);
                    me._triggerHandler($.objClone(node), eventClick, me);
                    return;
            }
        },
        /**
         * @private
         * @description 节点check处理
         * @param {Object} node 当前操作的节点
         * @param {Boolean} checked 是否选中
         * @param {Boolean} isExpanded 选中时是否展开子节点
         */
        _doChecked: function(node, checked, isExpanded) {
            var me = this,
                    expandedEL,
                    allChildrenArray = node[KEY_ALLCHILDREN],
                    tNode,
                    flag,
                    maxWidth;
            if (me.options.disabled) {
                return;
            }
            flag = me._triggerHandler({node: $.objClone(node), checked: checked}, eventBeforeCheckChange, me);
            if (false === flag || "false" === flag) {
                return;
            }
            //叶子节点处理
            if (node[KEY_LEAF] || !allChildrenArray || allChildrenArray.length <= 0) {
                me._doLeafChecked(node, checked);
                me._triggerHandler({node: $.objClone(node), checked: checked}, eventCheckChange, me);
                return;
            }
            if (checked) {
                node[KEY_HIDDEN] = false;
                //设置选中状态
                me._checked(node, CHECKED_STATE_FULLCHECKED);
                //如果不是叶子节点,则将展开图标置为收起
                if (isExpanded) {
                    expandedEL = node[KEY_EL][KEY_EXPANDED];
                    if (expandedEL) {
                        node[KEY_EXPANDED] = true;
                        expandedEL.removeClass(treeCollapsedClass);
                        expandedEL.addClass(treeExpandedClass);
                    }
                    for (var i = 0; i < allChildrenArray.length; i++) {
                        tNode = me.optObjDatas[allChildrenArray[i]];
                        //设置选中状态
                        me._checked(tNode, CHECKED_STATE_FULLCHECKED);
                        //如果不是叶子节点,则将展开图标置为收起
                        expandedEL = tNode[KEY_EL][KEY_EXPANDED];
                        if (expandedEL) {
                            tNode[KEY_EXPANDED] = true;
                            expandedEL.removeClass(treeCollapsedClass);
                            expandedEL.addClass(treeExpandedClass);
                        }
                        tNode[KEY_HIDDEN] = false;
                        if (tNode[KEY_EL] && tNode[KEY_EL][KEY_LI]) {
                            tNode[KEY_EL][KEY_LI].show();
                        }
                    }
                } else {
                    for (var i = 0; i < allChildrenArray.length; i++) {
                        tNode = me.optObjDatas[allChildrenArray[i]];
                        //设置选中状态
                        me._checked(tNode, CHECKED_STATE_FULLCHECKED);
                    }
                }
            } else {
                //取消选中状态
                me._checked(node, CHECKED_STATE_UNCHECKED);
                node[KEY_HIDDEN] = false;
                for (var i = 0; i < allChildrenArray.length; i++) {
                    tNode = me.optObjDatas[allChildrenArray[i]];
                    //取消选中状态
                    me._checked(tNode, CHECKED_STATE_UNCHECKED);
                }
            }
            //逐层上报更新父节点状态
            me._doUpdatePNodeChecked(node);
            maxWidth = me._getLiMaxWidth(me.treeUL);
            me._setElWidth(me.treeUL, maxWidth);
            me._triggerHandler({node: $.objClone(node), checked: checked}, eventCheckChange, me);
        },
        /**
         * @private
         * @description 单选时节点选中处理
         * @param {Object} node 当前操作的节点
         */
        _doSelected: function(node) {
            var me = this,
                    oldLiEl,
                    liEl;
            if (me.options.multi) {
                return;
            }
            //如果可编辑,则非叶子节点也增加selected样式
            if (node) {
                if(!me.options.isParentNodeSelect && !node[KEY_LEAF] && !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))){
                    return;
                }
            }
            if (!$.isEmptyObject(me.selectedDatas)) {
                for (var key in me.selectedDatas) {
                    if (me.selectedDatas[key][KEY_EL] && me.selectedDatas[key][KEY_EL][KEY_LI]) {
                        oldLiEl = me.selectedDatas[key][KEY_EL][KEY_LI];
                        oldLiEl.removeClass(treenodeSelectClass);
                    }
                }
            }
            me.selectedDatas = {};
            if (!$.isEmptyObject(node)) {
                me.selectedDatas[node[KEY_PATH]] = node;
                if (node[KEY_EL] && node[KEY_EL][KEY_LI]) {
                    liEl = node[KEY_EL][KEY_LI];
                    liEl.addClass(treenodeSelectClass);
                }
            }
            me._triggerHandler($.objClone(node), eventSelected, me);
        },
        /**
         * @private
         * @description 节点check样式处理
         * @param {Object} node 当前node对象
         * @param {Number} checked 选中状态枚举
         */
        _checked: function(node, checked) {
            var me = this,
                    el = null;
            if (!node) {
                return;
            }
            el = node[KEY_EL][KEY_CHECKED];
            node[KEY_CHECKED] = checked;
            switch (checked) {
                case CHECKED_STATE_UNCHECKED:
                    delete me.selectedDatas[node[KEY_PATH]];
                    //未选中状态
                    el.removeClass(treeFullCheckedClass);
                    el.removeClass(treeCheckedClass);
                    el.addClass(treeUnCheckedClass);
                    break;
                case CHECKED_STATE_CHECKED:
                    delete me.selectedDatas[node[KEY_PATH]];
                    //半选中状态
                    el.removeClass(treeUnCheckedClass);
                    el.removeClass(treeFullCheckedClass);
                    el.addClass(treeCheckedClass);
                    break;
                case CHECKED_STATE_FULLCHECKED:
                    if (node[KEY_LEAF]) {
                        me.selectedDatas[node[KEY_PATH]] = node;
                    }
                    //全选中状态
                    el.removeClass(treeUnCheckedClass);
                    el.removeClass(treeCheckedClass);
                    el.addClass(treeFullCheckedClass);
                    break;
                default:
                    return;
            }
        },
        /**
         * @private
         * @description 叶子节点check处理
         * @param {Object} node 当前操作的节点
         * @param {Boolean} checked 是否选中
         */
        _doLeafChecked: function(node, checked) {
            var me = this;
            if (checked) {
                //设置选中状态
                me._checked(node, CHECKED_STATE_FULLCHECKED);
                node[KEY_HIDDEN] = false;
            } else {
                //取消选中状态
                me._checked(node, CHECKED_STATE_UNCHECKED);
            }
            me._doUpdatePNodeChecked(node);
        },
        /**
         * @private
         * @description 更新父层级节点checked
         * @param {Object} node 当前操作的节点
         */
        _doUpdatePNodeChecked: function(node) {
            var me = this,
                    checked = false,
                    isFullchecked = true,
                    pNode,
                    tNode,
                    cCount;
            //顶级节点不做处理
            pNode = me.optObjDatas[node[KEY_PARENTPATH]];
            if (!pNode) {
                return;
            }
            cCount = pNode[KEY_ALLCHILDREN].length;
            for (var i = 0; i < cCount; i++) {
                tNode = me.optObjDatas[pNode[KEY_ALLCHILDREN][i]];
                if (CHECKED_STATE_FULLCHECKED == tNode[KEY_CHECKED]) {
                    checked = true;
                } else {
                    isFullchecked = false;
                }
            }
            if (isFullchecked) {
                //设置全选状态
                me._checked(pNode, CHECKED_STATE_FULLCHECKED);
            } else {
                if (checked) {
                    //设置半选状态
                    me._checked(pNode, CHECKED_STATE_CHECKED);
                } else {
                    //取消选中状态
                    me._checked(pNode, CHECKED_STATE_UNCHECKED);
                }
            }
            //逐层上报更新父节点状态
            me._doUpdatePNodeChecked(pNode);
        },
        /**
         * @private
         * @description 从此节点逐层上报展开处理
         * @param {Object} node 当前操作的节点
         */
        _doBubbleExpanded: function(node) {
            var me = this,
                    tNode,
                    expandedEL,
                    el,
                    maxWidth = 0,
                    isEdit = false;
            if (me.options.disabled) {
                return;
            }
            if (!node) {
                return;
            }
            //上报让每层父节点展开
            me.bubble(node, function(_node, _pNode) {
                _pNode[KEY_EXPANDED] = true;
                _pNode[KEY_HIDDEN] = false;
                if (_pNode[KEY_EL]) {
                    expandedEL = _pNode[KEY_EL][KEY_EXPANDED];
                    el = _pNode[KEY_EL][KEY_LI];
                    if (expandedEL) {
                        expandedEL.removeClass(treeCollapsedClass);
                        expandedEL.addClass(treeExpandedClass);
                    }
                    if (el) {
                        el.show();
                    }
                }
                //展开子节点
                for (var i = 0; i < _pNode[KEY_CHILDREN].length; i++) {
                    tNode = me.optObjDatas[_pNode[KEY_CHILDREN][i]];
                    tNode[KEY_HIDDEN] = false;
                    if (tNode[KEY_EL] && tNode[KEY_EL][KEY_LI]) {
                        tNode[KEY_EL][KEY_LI].show();
                    }
                }
            });
            if (!me.isRenderAll) {
                me.optShowDatas = me._getShowDatas(me.optListDatas, me.optObjDatas);
                me.treeUL.height(me.optShowDatas.length * me.liHeight);
                me._doTriggerScrollEvent();
            }
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                isEdit = true;
            }
            maxWidth = me._getLiMaxWidth(me.treeUL, isEdit);
            //设置LI宽
            me._setElWidth(me.treeUL, maxWidth, isEdit);
        },
        /**
         * @private
         * @description 节点展开折叠处理
         * @param {Object} el 当前li对象
         * @param {Object} node 当前操作的节点
         * @param {Boolean} expanded 当前操作的节点
         */
        _doExpanded: function(el, node, expanded) {
            var me = this,
                    tNode,
                    expandedEL,
                    childrenArray = node[KEY_CHILDREN],
                    allChildrenArray = node[KEY_ALLCHILDREN],
                    maxWidth = 0,
                    flag,
                    eventName,
                    isEdit = false;
            if (me.options.disabled) {
                return;
            }
            if (expanded) {
                eventName = eventCollapse;
                flag = me._triggerHandler($.objClone(node), eventBeforeCollapse, me);
                if (false === flag || "false" === flag) {
                    return;
                }
                node[KEY_EXPANDED] = false;
                //收起时将其下所有子节点隐藏
                el.removeClass(treeExpandedClass);
                el.addClass(treeCollapsedClass);
                for (var i = 0; i < allChildrenArray.length; i++) {
                    tNode = me.optObjDatas[allChildrenArray[i]];
                    if (!tNode) {
                        continue;
                    }
                    //如果不是叶子节点,则将展开图标置为收起
                    expandedEL = tNode[KEY_EL][KEY_EXPANDED];
                    if (expandedEL) {
                        tNode[KEY_EXPANDED] = false;
                        expandedEL.removeClass(treeExpandedClass);
                        expandedEL.addClass(treeCollapsedClass);
                    }
                    tNode[KEY_HIDDEN] = true;
                    if (tNode[KEY_EL] && tNode[KEY_EL][KEY_LI]) {
                        tNode[KEY_EL][KEY_LI].hide();
                    }
                }
            } else {
                eventName = eventExpand;
                flag = me._triggerHandler($.objClone(node), eventBeforeExpand, me);
                if (false === flag || "false" === flag) {
                    return;
                }
                node[KEY_EXPANDED] = true;
                //展开时显示子层级节点
                el.removeClass(treeCollapsedClass);
                el.addClass(treeExpandedClass);
                for (var i = 0; i < childrenArray.length; i++) {
                    tNode = me.optObjDatas[childrenArray[i]];
                    tNode[KEY_HIDDEN] = false;
                    if (tNode[KEY_EL] && tNode[KEY_EL][KEY_LI]) {
                        tNode[KEY_EL][KEY_LI].show();
                    }
                }
            }
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                isEdit = true;
            }
            maxWidth = me._getLiMaxWidth(me.treeUL, isEdit);
            //设置LI宽
            me._setElWidth(me.treeUL, maxWidth, isEdit);
            me._triggerHandler($.objClone(node), eventName, me);
        },
        /**
         * @private
         * @description 删除所有节点
         */
        _removeAllNodeList: function() {
            var me = this;
            // 删除dom节点
            if (me.treeUL) {
                me.treeUL.children().remove();
            }
        },
        /**
         * @private
         * @description 重置tree设置的条件
         */
        _reset: function() {
            var me = this;
            // 选中数据
            me.selectedDatas = {};
        },
        /**
         * @description 将树型数据转换成一份列表型数据和一份对象数据;列表数据用于渲染,对象数据用于操作,其中记录了此节点信息
         * @param {Object} datas 原始树型数据,调用此函数时需要复制一份
         * @param {Array} listDatas 存储列表型数据
         * @param {Object} objDatas 存储对象型数据
         * @param {String} path 节点路径,root为""
         * @param {Boolean} pHidden 父节点是否显示,root显示
         * @param {Number} depth 节点深度,root为null,第一层级为0
         * @param {Object} selectedDatas 存储选中的节点
         */
        parseDatas: function(datas, listDatas, objDatas, path, pHidden, depth, selectedDatas) {
            var me = this,
                    childrens,
                    tPath,
                    tDepth,
                    tempObj,
                    isChildrensShow = false,
                    allChildrensPath = [],
                    childrensPath = [],
                    flag = false;
            if (!datas) {
                return;
            }
            // 对象转换为数组
            if (!$.isArray(datas)) {
                datas = [datas];
            }
            if (datas.length <= 0) {
                return;
            }
            datas[datas.length - 1][KEY_ISLAST] = true;
            for (var i = 0; i < datas.length; i++) {
                //每个节点记录其父节点path,如果为第一层则无parentPath
                if (path && "" != path) {
                    datas[i][KEY_PARENTPATH] = path;
                }
                //拼接当前节点path
                tPath = path + pathConnectSymbol + datas[i][KEY_VALUE];
                tDepth = depth;
                //当前深度,第一层为0
                if (!tDepth) {
                    pHidden = false;
                    tPath = datas[i][KEY_VALUE];
                    tDepth = 0;
                    isChildrensShow = true;
                    objDatas[tPath] = datas[i];
                    //默认第一层节点数据为show
                    objDatas[tPath][KEY_HIDDEN] = false;
                } else {
                    objDatas[tPath] = datas[i];
                    //如果父层级展开,则子层级节点显示
                    if (objDatas[path] && (true === objDatas[path][KEY_EXPANDED] || "true" === objDatas[path][KEY_EXPANDED])) {
                        isChildrensShow = true;
                    } else {
                        //一个层级只执行一次
                        if (!flag) {
                            //如果父层级显示且其子层级中有展开的节点,则此层所有的节点都显示
                            for (var j = 0; j < datas.length; j++) {
                                if (true === datas[j][KEY_EXPANDED] || "true" === datas[j][KEY_EXPANDED]) {
                                    isChildrensShow = true;
                                    break;
                                }
                            }
                            flag = true;
                        }
                    }
                    //节点是否显示
                    if (!pHidden && isChildrensShow) {
                        objDatas[tPath][KEY_HIDDEN] = false;
                    } else {
                        objDatas[tPath][KEY_HIDDEN] = true;
                    }
                }
                //记录深度
                objDatas[tPath][KEY_DEPTH] = tDepth;
                childrens = datas[i][KEY_CHILDREN];
                delete datas[i][KEY_CHILDREN];
                datas[i][KEY_PATH] = tPath;
                if (undefined === datas[i][KEY_QTIP] || null === datas[i][KEY_QTIP]) {
                    datas[i][KEY_QTIP] = datas[i][KEY_TEXT];
                }
                tempObj = {};
                tempObj[KEY_PATH] = tPath;
                //加入渲染数组中
                if (listDatas) {
                    listDatas.push(tempObj);
                }
                if ((CHECKED_STATE_FULLCHECKED == datas[i][KEY_CHECKED] || true == datas[i][KEY_CHECKED] || "true" == datas[i][KEY_CHECKED]) && selectedDatas) {
                    delete datas[i][KEY_CHECKED];
                    selectedDatas[tPath] = "";
                } else {
                    delete datas[i][KEY_CHECKED];
                }
                //如果childrens为空数组,则也认为一个有效的父节点
                if (childrens) {
                    datas[i][KEY_LEAF] = false;
                    //递归取到所有子节点的path
                    allChildrensPath = [];
                    me._getChildrensPath(childrens, datas[i][KEY_PATH], allChildrensPath);
                    datas[i][KEY_ALLCHILDREN] = allChildrensPath;
                    //取到其子节点
                    childrensPath = [];
                    for (var k = 0; k < childrens.length; k++) {
                        childrensPath.push(tPath + pathConnectSymbol + childrens[k][KEY_VALUE]);
                    }
                    datas[i][KEY_CHILDREN] = childrensPath;
                    me.parseDatas(childrens, listDatas, objDatas, datas[i][KEY_PATH], objDatas[tPath][KEY_HIDDEN], ++tDepth, selectedDatas);
                } else {
                    if (false == datas[i][KEY_LEAF] || "false" == datas[i][KEY_LEAF]) {
                        datas[i][KEY_LEAF] = false;
                        datas[i][KEY_LOADED] = false;
                    } else {
                        datas[i][KEY_LEAF] = true;
                    }
                }
            }
        },
        /**
         * @description 获取某节点下所有子节点path, 存储到childrensPath中
         * @param {Object} datas 节点
         * @param {String} path 节点路径
         * @param {Array} childrensPath 存储所有子节点path
         */
        _getChildrensPath: function(datas, path, childrensPath) {
            var me = this,
                    tPath,
                    childrens;
            if (!datas || datas.length <= 0) {
                return;
            }
            for (var i = 0; i < datas.length; i++) {
                tPath = path + pathConnectSymbol + datas[i][KEY_VALUE];
                datas[i][KEY_PATH] = tPath;
                childrensPath.push(tPath);
                childrens = datas[i][KEY_CHILDREN];
                if (childrens && childrens.length > 0) {
                    me._getChildrensPath(childrens, datas[i][KEY_PATH], childrensPath);
                }
            }
        },
        /**
         * @private
         * @description 从列表数据里筛选出显示的数据
         * @param {Array} listDatas 列表数据
         * @param {Object} objDatas 节点对象数据
         * @returns {Array} result 执行的结果
         */
        _getShowDatas: function(listDatas, objDatas) {
            var result = [],
                    showArray = [],
                    tempObj;
            if (!listDatas || listDatas.length <= 0) {
                return result;
            }
            //取出显示的节点
            for (var i = 0; i < listDatas.length; i++) {
                tempObj = objDatas[listDatas[i][KEY_PATH]];
                if (tempObj && !tempObj[KEY_HIDDEN]) {
                    showArray.push(tempObj);
                }
            }
            return showArray;
        },
        /**
         * @description 将list型数据还原成树型数据,存储到result中
         * @param {Object} selectedDatas 底层叶子节点数据, 调用前需要复制一份
         * @param {Object} objDatas 存储节点对象的数据, 调用前需要复制一份
         * @param {Array} keyArray 要取数据的node属性
         * @param {Array} result 转化后的数据
         * @returns {Array} result 执行的结果
         */
        parseTreeDatas: function(selectedDatas, objDatas, keyArray, result) {
            var me = this,
                    tempObj,
                    tListObj = {},
                    tListNode,
                    pPath,
                    tResult,
                    isBubble = false,
                    node,
                    tNode,
                    tPNode;
            for (var key in selectedDatas) {
                tNode = {};
                tPNode = {};
                node = selectedDatas[key];
                if (!node) {
                    continue;
                }
                //如果节点不存在,则不处理,像延迟加载过滤数据时
                if (!objDatas[node[KEY_PATH]]) {
                    continue;
                }
                pPath = node[KEY_PARENTPATH];
                tempObj = objDatas[pPath];
                //如果有父节点
                if (tempObj) {
                    isBubble = true;
                    tListNode = tListObj[node[KEY_PATH]];
                    if (tListNode) {
                        if (node[KEY_CHILDREN] && tListNode[KEY_CHILDREN]) {
                            tListNode[KEY_CHILDREN] = tListNode[KEY_CHILDREN].concat(node[KEY_CHILDREN]);
                        } else if (node[KEY_CHILDREN] && !tListNode[KEY_CHILDREN]) {
                            tListNode[KEY_CHILDREN] = node[KEY_CHILDREN];
                        }
                        continue;
                    }
                    //将需要的属性值复制到预先创建的node中
                    for (var k = 0; k < keyArray.length; k++) {
                        tNode[keyArray[k]] = node[keyArray[k]];
                    }
                    if (node[KEY_CHILDREN]) {
                        tNode[KEY_CHILDREN] = node[KEY_CHILDREN];
                    }
                    if (!tListObj[pPath]) {
                        for (var k = 0; k < keyArray.length; k++) {
                            tPNode[keyArray[k]] = tempObj[keyArray[k]];
                        }
                        tPNode[KEY_PATH] = tempObj[KEY_PATH];
                        tPNode[KEY_PARENTPATH] = tempObj[KEY_PARENTPATH];
                        tListObj[pPath] = tPNode;
                        tListObj[pPath][KEY_CHILDREN] = [];
                    }
                    tListObj[pPath][KEY_CHILDREN].push(tNode);
                } else {
                    if (tListObj[node[KEY_PATH]]) {
                        tListObj[node[KEY_PATH]][KEY_CHILDREN] = tListObj[node[KEY_PATH]][KEY_CHILDREN].concat(node[KEY_CHILDREN]);
                    } else {
                        tListObj[node[KEY_PATH]] = node;
                    }
                }
            }
            if (isBubble) {
                me.parseTreeDatas(tListObj, objDatas, keyArray, result);
            } else {
                tResult = [];
                //删除没用的属性数据
                for (var key in tListObj) {
                    tNode = {};
                    //将需要的属性值复制到预先创建的node中
                    for (var k = 0; k < keyArray.length; k++) {
                        tNode[keyArray[k]] = tListObj[key][keyArray[k]];
                    }
                    if (tListObj[key][KEY_CHILDREN]) {
                        tNode[KEY_CHILDREN] = tListObj[key][KEY_CHILDREN];
                    }
                    tResult.push(tNode);
                }
                return result["data"] = tResult;
            }
        },
        /**
         * @private
         * @description 初始化数据,将原始数据转成一份列表型数据,转成一份对象型数据,遍历时提取出选中的数据
         * @param {Array} data 原始数据
         */
        _initData: function(data) {
            var me = this,
                    selectedDatas = {};
            me.selectedDatas = {};
            me.objDatas = {};
            me.listDatas = [];
            //将树型数据转换成一份列表型数据(存储path),一份path对象数据
            me.parseDatas($.objClone(data), me.listDatas, me.objDatas, "", false, null, selectedDatas);
            me.optListDatas = $.objClone(me.listDatas);
            me.optObjDatas = $.objClone(me.objDatas);
            if (!me.options.multi) {
                for (var key in selectedDatas) {
                    me.selectedDatas[key] = me.optObjDatas[key];
                    break;
                }
            } else {
                for (var key in selectedDatas) {
                    me.selectedDatas[key] = me.optObjDatas[key];
                }
            }
            me.selectedDatas = me._getLeafSelectedDatas(me.selectedDatas);
            // 滚动条事件处理
            if (me.listDatas.length <= LIMIT_COUNT && !me.options.loader) {
                me.isRenderAll = true;
            } else {
                me.isRenderAll = false;
            }
        },
        /**
         * @private
         * @description 逐层上报筛选所有父节点中是最一个节点的节点,存储到result
         * @param {Object} node 当前节点的数据
         * @param {Object} objDatas 原始节点的对象数据
         * @param {Object} result 返回的结果,调用时传入{}
         * @return {Object} result 以节点的深度为key,值为此节点 {depth: node1, ...}
         */
        _getPLastNode: function(node, objDatas, result) {
            var me = this;
            if (node && node[KEY_PARENTPATH]) {
                if (objDatas[node[KEY_PARENTPATH]][KEY_ISLAST]) {
                    result[objDatas[node[KEY_PARENTPATH]][KEY_DEPTH]] = objDatas[node[KEY_PARENTPATH]];
                }
                me._getPLastNode(objDatas[node[KEY_PARENTPATH]], objDatas, result);
            } else {
                return;
            }
        },
        /**
         * @description 将选中的节点全部转换成选中的叶子节点数据
         * @param {Object} selectedDatas 选中的节点数据
         * @returns {Array} result 执行的结果
         */
        _getLeafSelectedDatas: function(selectedDatas) {
            var me = this,
                    node,
                    result = {};
            if ($.isEmptyObject(selectedDatas)) {
                return result;
            }
            for (var key in selectedDatas) {
                node = selectedDatas[key];
                node[KEY_CHECKED] = CHECKED_STATE_FULLCHECKED;
                if (node[KEY_LEAF]) {
                    result[key] = node;
                } else {
                    if (node[KEY_ALLCHILDREN]) {
                        for (var i = 0; i < node[KEY_ALLCHILDREN].length; i++) {
                            if (node[KEY_ALLCHILDREN][i][KEY_LEAF]) {
                                result[node[KEY_ALLCHILDREN][i][KEY_PATH]] = node[KEY_ALLCHILDREN][i];
                            }
                        }
                    }
                }
            }
            me._bubbleUpdateNodeChecked(result);
            return result;
        },
        /**
         * @private
         * @description 上报更新父node
         * @param {Object} node 当前操作的节点
         * @param {Object} nodeObj 存储待更新的节点
         */
        _getUpdateNode: function(node, nodeObj) {
            var me = this,
                    checked = false,
                    isFullchecked = true,
                    pNode,
                    tNode,
                    cCount;
            nodeObj[node[KEY_PATH]] = node;
            //顶级节点不做处理
            pNode = me.optObjDatas[node[KEY_PARENTPATH]];
            if (!pNode) {
                return;
            }
            cCount = pNode[KEY_ALLCHILDREN].length;
            for (var i = 0; i < cCount; i++) {
                tNode = me.optObjDatas[pNode[KEY_ALLCHILDREN][i]];
                if (CHECKED_STATE_FULLCHECKED == tNode[KEY_CHECKED]) {
                    checked = true;
                } else {
                    isFullchecked = false;
                }
            }
            if (isFullchecked) {
                //设置全选状态
                pNode[KEY_CHECKED] = CHECKED_STATE_FULLCHECKED;
            } else {
                if (checked) {
                    //设置半选状态
                    pNode[KEY_CHECKED] = CHECKED_STATE_CHECKED;
                } else {
                    //取消选中状态
                    pNode[KEY_CHECKED] = CHECKED_STATE_UNCHECKED;
                }
            }
            //逐层上报更新父节点状态
            me._getUpdateNode(pNode, nodeObj);
        },
        /**
         * @private
         * @description 滚动加载时上报更新父node
         * @param {Object} nodes 当前操作的节点,均为叶子节点
         */
        _bubbleUpdateNodeChecked: function(nodes) {
            var me = this,
                    tempDatas = {},
                    nodeObj = {},
                    isContinue = false;
            if ($.isEmptyObject(nodes)) {
                return;
            }
            for (var key in nodes) {
                if (nodes[key][KEY_PARENTPATH]) {
                    isContinue = true;
                    if (CHECKED_STATE_FULLCHECKED == nodes[key][KEY_CHECKED]) {
                        if (nodeObj[nodes[key][KEY_PARENTPATH]]) {
                            nodeObj[nodes[key][KEY_PARENTPATH]]["sCount"]++;
                        } else {
                            nodeObj[nodes[key][KEY_PARENTPATH]] = {};
                            nodeObj[nodes[key][KEY_PARENTPATH]]["sCount"] = 1;
                        }
                        nodeObj[nodes[key][KEY_PARENTPATH]]["checked"] = true;
                    }
                    if (CHECKED_STATE_CHECKED == nodes[key][KEY_CHECKED]) {
                        if (!nodeObj[nodes[key][KEY_PARENTPATH]]) {
                            nodeObj[nodes[key][KEY_PARENTPATH]] = {};
                        }
                        nodeObj[nodes[key][KEY_PARENTPATH]]["checked"] = true;
                    }
                }
            }
            for (var key in nodeObj) {
                me.optObjDatas[key][KEY_CHECKED] = CHECKED_STATE_UNCHECKED;
                if (nodeObj[key]["checked"]) {
                    me.optObjDatas[key][KEY_CHECKED] = CHECKED_STATE_CHECKED;
                }
                if (nodeObj[key]["sCount"] >= me.optObjDatas[key][KEY_CHILDREN].length) {
                    me.optObjDatas[key][KEY_CHECKED] = CHECKED_STATE_FULLCHECKED;
                    nodeObj[key][KEY_CHECKED] = CHECKED_STATE_FULLCHECKED;
                }
                tempDatas[key] = me.optObjDatas[key];
            }
            if (!isContinue) {
                return;
            }
            //逐层上报更新父节点状态
            me._bubbleUpdateNodeChecked(tempDatas);
        },
        /**
         * @private
         * @description 销毁表格组件
         */
        _destroyWidget: function() {
            var me = this,
                    _editMenuEl;
            if (me._editMenu) {
                me._editMenu.destroy();
            }
            _editMenuEl = $("#" + me._editMenuId);
            if (_editMenuEl) {
                _editMenuEl.remove();
            }
			if (me.treeEl) {
				me.treeEl.remove();
			}
        },
        /**
         * @private
         * @description 设置文本的宽
         * @param {Object} treeUL 树面板
         * @param {Number} maxWidth 最大宽度
         * @param {Boolean} isEdit 是否为编辑
         */
        _setElWidth: function(treeUL, maxWidth, isEdit) {
            var tempWidth = 0,
                    liDoms,
                    tEl,
                    textEl;
            if (!treeUL) {
                return;
            }
            //拿到本次渲染的LI,设置宽度
            liDoms = treeUL.find("li");
            if (!isEdit) {
                for (var k = 0; k < liDoms.length; k++) {
                    $(liDoms[k]).width(maxWidth);
                }
                return;
            }
            //计算最大宽度
            for (var k = 0; k < liDoms.length; k++) {
                $(liDoms[k]).width(maxWidth);
                if ("none" == $(liDoms[k]).css("display")) {
                    continue;
                }
                tEl = $(liDoms[k]).children();
                tempWidth = 0;
                for (var t = 0; t < tEl.length; t++) {
                    if ($(tEl[t]).hasClass(treeNodeTextClass)) {
                        textEl = $(tEl[t]);
                    } else {
                        if ("none" != $(tEl[t]).css("display")) {
                            tempWidth += $(tEl[t]).externalWidth();
                        }
                    }
                }
                if (textEl) {
                    textEl.width(maxWidth - tempWidth);
                }
            }
        },
        /**
         * @private
         * @description 获取区域中li最宽的宽度
         * @param {Object} treeUL 树面板
         * @param {Boolean} isEdit 是否为编辑
         * @return {Number} maxWidth 最大宽度
         */
        _getLiMaxWidth: function(treeUL, isEdit) {
            var me = this,
                    maxWidth = 0,
                    tempWidth = 0,
                    paddingWidth = 5,
                    liDoms,
                    tEl;
            if (!treeUL) {
                return maxWidth;
            }
            liDoms = treeUL.find("li");
            if (isEdit) {
                treeUL.find("li ." + treeNodeTextClass).width("");
            }
            //计算最大宽度
            for (var k = 0; k < liDoms.length; k++) {
                if ("none" == $(liDoms[k]).css("display")) {
                    continue;
                }
                tEl = $(liDoms[k]).children();
                tempWidth = 0;
                for (var t = 0; t < tEl.length; t++) {
                    if ("none" != $(tEl[t]).css("display")) {
                        tempWidth += $(tEl[t]).externalWidth();
                    }
                }
                if (tempWidth > maxWidth) {
                    maxWidth = tempWidth;
                }
            }
            // 如果主区域的宽大于LI最大宽,则设置主区域的宽		
            if (me.treeBodyDiv[0].clientWidth >= maxWidth) {
                maxWidth = me.treeBodyDiv[0].clientWidth - paddingWidth;
            }
            return maxWidth;
        },
        /**
         * @private
         * @description 获取当前的数据
         * @return {Array} datas 当前的数据
         */
        getCurrentObjData: function() {
            var me = this;
            return $.objClone(me.objDatas);
        },
        /**
         * @private
         * @description 获取当前操作的数据
         * @return {Array} datas 当前操作的数据
         */
        getCurrentOptObjData: function() {
            var me = this;
            return $.objClone(me.optObjDatas);
        },
        /**
         * @private
         * @description 编辑时,获取所有选中的节点
         * @return {Object} node 节点
         */
        getSelectedDatas: function() {
            var me = this;
            if ($.isEmptyObject(me.selectedDatas)) {
                return null;
            }
            return $.objClone(me.selectedDatas);
        },
        /**
         * @private
         * @description 编辑时,获取当前选中的节点
         * @return {Object} node 节点
         */
        getSelected: function() {
            var me = this;
            if ($.isEmptyObject(me.selectedDatas)) {
                return null;
            }
            for (var key in me.selectedDatas) {
                return $.objClone(me.selectedDatas[key]);
            }
        },
        /**
         * @private
         * @description 给指定节点中插入子节点
         * @param {Object} node 待添加节点信息
         * @param {Object} pNode 父节点信息
         */
        appendChild: function(node, pNode) {
            var me = this;
            if (me.options.multi || !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                return;
            }
            if ($.isEmptyObject(node) || $.isEmptyObject(pNode)) {
                return;
            }
            //由于pNode信息可能不全,需要通过path从操作数据中查找一份
            pNode = me.optObjDatas[pNode[KEY_PATH]];
            me._doAddNode(node, pNode);
        },
        /**
         * @private
         * @description 给指定节点之后插入子节点
         * @param {Object} node1 待添加节点信息
         * @param {Object} node2 在此节点之后添加
         */
        insertAfter: function(node1, node2) {
            var me = this,
                    pNode,
                    _tempLastNdoe,
                    _tempChildren,
                    _tempAllChildren,
                    isLeaf,
                    cLiEl,
                    text,
                    cTextEl,
                    maxWidth,
                    depth = 0,
                    _listDatas = [],
                    lineClass = treeNodeMinusLineClass,
                    _treeNodeTextClass = "";
            if (me.options.multi || !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                return;
            }
            if ($.isEmptyObject(node1)) {
                return;
            }
            if (node2) {
                node2 = me.optObjDatas[node2[KEY_PATH]];
                pNode = me.optObjDatas[node2[KEY_PARENTPATH]];
            }
            if (!pNode || $.isEmptyObject(node2)) {
                node1[KEY_DEPTH] = depth;
                node1[KEY_HIDDEN] = false;
                node1[KEY_LEAF] = true;
                node1[KEY_QTIP] = node1[KEY_TEXT];
                node1[KEY_PATH] = node1[KEY_VALUE];
                me._doAddRootNode(node1, node2);
                return;
            }
            //由于node2信息可能不全,需要通过path从操作数据中查找一份
            node2 = me.optObjDatas[node2[KEY_PATH]];
            isLeaf = node2[KEY_LEAF];
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                _treeNodeTextClass = treeNodeTextClass;
            }
            depth = node2[KEY_DEPTH];
            node1[KEY_DEPTH] = depth;
            node1[KEY_HIDDEN] = false;
            node1[KEY_LEAF] = true;
            node1[KEY_QTIP] = node1[KEY_TEXT];
            node1[KEY_PATH] = node2[KEY_PARENTPATH] + pathConnectSymbol + node1[KEY_VALUE];
            node1[KEY_PARENTPATH] = node2[KEY_PARENTPATH];
            cLiEl = $("<li>").addClass(treeNodeClass);
            for (var j = 0; j < node1[KEY_DEPTH]; j++) {
                $("<span>").addClass(lineClass).appendTo(cLiEl);
            }
            $("<span>").addClass(treeNodeMinusEblowClass).appendTo(cLiEl);
            //如果显示图标,则加上图标
            if (me.options.icon) {
                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(cLiEl);
            }
            text = $.nullToString(node1[KEY_TEXT]);
            cTextEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(cLiEl);
            // 是否有tip提示
            if (me.options.tip) {
                cTextEl.attr("title", node1[KEY_QTIP]);
            }
            //节点信息中加入此节点下的EL信息,便于后续操作
            node1[KEY_EL] = {};
            node1[KEY_EL][KEY_LI] = cLiEl;
            cTextEl.bind("dblclick", {"me": me, "node": node1}, me._onNodeDbClick);
            //给LI绑上节点信息,注册单击事件
            cLiEl.data(ATTR_NODE, node1).bind("click", {"me": me, "node": node1, "liEl": cLiEl}, me._onNodeClick);
            cLiEl.bind("contextmenu", {"me": me, "node": node1, "liEl": cLiEl, textEl: cTextEl}, me._onNodeMousedown);
            //将新创建的节点加入到当前编辑节点中
            if (isLeaf) {
                _tempLastNdoe = node2;
            } else {
                node2[KEY_ALLCHILDREN] = node2[KEY_ALLCHILDREN] || [];
                if (node2[KEY_ALLCHILDREN].length <= 0) {
                    _tempLastNdoe = node2;
                } else {
                    _tempLastNdoe = me.optObjDatas[node2[KEY_ALLCHILDREN][node2[KEY_ALLCHILDREN].length - 1]];
                }
            }
            _tempChildren = [];
            for (var i = 0; i < pNode[KEY_CHILDREN].length; i++) {
                _tempChildren.push(pNode[KEY_CHILDREN][i]);
                if (_tempLastNdoe[KEY_PATH] == pNode[KEY_CHILDREN][i]) {
                    _tempChildren.push(node1[KEY_PATH]);
                }
            }
            pNode[KEY_CHILDREN] = _tempChildren;
            _tempChildren = [];
            //更新数据
            me.optObjDatas[node1[KEY_PATH]] = node1;
            me.objDatas = me.optObjDatas;
            //将新加的节点加入列表数据中
            for (var i = 0; i < me.optListDatas.length; i++) {
                _listDatas.push(me.optListDatas[i]);
                if (_tempLastNdoe[KEY_PATH] == me.optListDatas[i][KEY_PATH]) {
                    _listDatas.push({path: node1[KEY_PATH]});
                }
            }
            //修改列表数据
            me.optListDatas = _listDatas;
            me.listDatas = me.optListDatas;
            if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
            //上报让每层父节点的allchildren加入新加的节点
            me.bubble(node2, function(node, _pNode) {
                _tempAllChildren = [];
                for (var i = 0; i < _pNode[KEY_ALLCHILDREN].length; i++) {
                    _tempAllChildren.push(_pNode[KEY_ALLCHILDREN][i]);
                    if (_tempLastNdoe[KEY_PATH] == _pNode[KEY_ALLCHILDREN][i]) {
                        _tempAllChildren.push(node1[KEY_PATH]);
                    }
                }
                _pNode[KEY_ALLCHILDREN] = _tempAllChildren;
                    me._upDateCNodeCount(_pNode);
            });
            } else {
                //上报让每层父节点的allchildren加入新加的节点
                me.bubble(node2, function(node, _pNode) {
                    _tempAllChildren = [];
                    for (var i = 0; i < _pNode[KEY_ALLCHILDREN].length; i++) {
                        _tempAllChildren.push(_pNode[KEY_ALLCHILDREN][i]);
                        if (_tempLastNdoe[KEY_PATH] == _pNode[KEY_ALLCHILDREN][i]) {
                            _tempAllChildren.push(node1[KEY_PATH]);
                        }
                    }
                    _pNode[KEY_ALLCHILDREN] = _tempAllChildren;
                });
            }
            //将新创建的节点加到后面
            cLiEl.insertAfter(_tempLastNdoe[KEY_EL][KEY_LI]);
            //单选选中样式处理
            me._doSelected(node1);
            //计算最大宽度
            maxWidth = me._getLiMaxWidth(me.treeUL, true);
            me._setElWidth(me.treeUL, maxWidth, true);
        },
        /**
         * @private
         * @description 给指定节点之前插入子节点
         * @param {Object} node1 待添加节点信息
         * @param {Object} node2 在此节点之后添加
         */
        insertBefore: function(node1, node2) {
            var me = this,
                    pNode,
                    _tempLastNdoe,
                    _tempChildren,
                    _tempAllChildren,
                    cLiEl,
                    text,
                    cTextEl,
                    maxWidth,
                    depth = 0,
                    _listDatas = [],
                    lineClass = treeNodeMinusLineClass,
                    _treeNodeTextClass = "";
            if (me.options.multi || !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                return;
            }
            if ($.isEmptyObject(node1)) {
                return;
            }
            if (node2) {
                node2 = me.optObjDatas[node2[KEY_PATH]];
                pNode = me.optObjDatas[node2[KEY_PARENTPATH]];
            }
            if (!pNode || $.isEmptyObject(node2)) {
                node1[KEY_DEPTH] = depth;
                node1[KEY_HIDDEN] = false;
                node1[KEY_LEAF] = true;
                node1[KEY_QTIP] = node1[KEY_TEXT];
                node1[KEY_PATH] = node1[KEY_VALUE];
                me._doAddRootNode(node1, node2, true);
                return;
            }
            //由于node2信息可能不全,需要通过path从操作数据中查找一份
            node2 = me.optObjDatas[node2[KEY_PATH]];
            if (!me.options.multi && (true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                _treeNodeTextClass = treeNodeTextClass;
            }
            depth = node2[KEY_DEPTH];
            node1[KEY_DEPTH] = depth;
            node1[KEY_HIDDEN] = false;
            node1[KEY_LEAF] = true;
            node1[KEY_QTIP] = node1[KEY_TEXT];
            node1[KEY_PATH] = node2[KEY_PARENTPATH] + pathConnectSymbol + node1[KEY_VALUE];
            node1[KEY_PARENTPATH] = node2[KEY_PARENTPATH];
            cLiEl = $("<li>").addClass(treeNodeClass);
            for (var j = 0; j < node1[KEY_DEPTH]; j++) {
                $("<span>").addClass(lineClass).appendTo(cLiEl);
            }
            $("<span>").addClass(treeNodeMinusEblowClass).appendTo(cLiEl);
            //如果显示图标,则加上图标
            if (me.options.icon) {
                $("<span>").addClass(treeLeafNodeIcoClass).appendTo(cLiEl);
            }
            text = $.nullToString(node1[KEY_TEXT]);
            cTextEl = $("<span>").addClass(_treeNodeTextClass).text(text).appendTo(cLiEl);
            // 是否有tip提示
            if (me.options.tip) {
                cTextEl.attr("title", node1[KEY_QTIP]);
            }
            //节点信息中加入此节点下的EL信息,便于后续操作
            node1[KEY_EL] = {};
            node1[KEY_EL][KEY_LI] = cLiEl;
            cTextEl.bind("dblclick", {"me": me, "node": node1}, me._onNodeDbClick);
            //给LI绑上节点信息,注册单击事件
            cLiEl.data(ATTR_NODE, node1).bind("click", {"me": me, "node": node1, "liEl": cLiEl}, me._onNodeClick);
            cLiEl.bind("contextmenu", {"me": me, "node": node1, "liEl": cLiEl, textEl: cTextEl}, me._onNodeMousedown);
            //将新创建的节点加入到当前编辑节点中
            _tempLastNdoe = node2;
            _tempChildren = [];
            for (var i = 0; i < pNode[KEY_CHILDREN].length; i++) {
                if (_tempLastNdoe[KEY_PATH] == pNode[KEY_CHILDREN][i]) {
                    _tempChildren.push(node1[KEY_PATH]);
                }
                _tempChildren.push(pNode[KEY_CHILDREN][i]);
            }
            pNode[KEY_CHILDREN] = _tempChildren;
            _tempChildren = [];
            //更新数据
            me.optObjDatas[node1[KEY_PATH]] = node1;
            me.objDatas = me.optObjDatas;
            //将新加的节点加入列表数据中
            for (var i = 0; i < me.optListDatas.length; i++) {
                if (_tempLastNdoe[KEY_PATH] == me.optListDatas[i][KEY_PATH]) {
                    _listDatas.push({path: node1[KEY_PATH]});
                }
                _listDatas.push(me.optListDatas[i]);
            }
            //修改列表数据
            me.optListDatas = _listDatas;
            me.listDatas = me.optListDatas;
            if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
                //上报让每层父节点的allchildren加入新加的节点
                me.bubble(node2, function(node, _pNode) {
                    _tempAllChildren = [];
                    for (var i = 0; i < _pNode[KEY_ALLCHILDREN].length; i++) {
                        if (_tempLastNdoe[KEY_PATH] == _pNode[KEY_ALLCHILDREN][i]) {
                            _tempAllChildren.push(node1[KEY_PATH]);
                        }
                        _tempAllChildren.push(_pNode[KEY_ALLCHILDREN][i]);
                    }
                    _pNode[KEY_ALLCHILDREN] = _tempAllChildren;
                    me._upDateCNodeCount(_pNode);
                });
            } else {
            //上报让每层父节点的allchildren加入新加的节点
            me.bubble(node2, function(node, _pNode) {
                _tempAllChildren = [];
                for (var i = 0; i < _pNode[KEY_ALLCHILDREN].length; i++) {
                    if (_tempLastNdoe[KEY_PATH] == _pNode[KEY_ALLCHILDREN][i]) {
                        _tempAllChildren.push(node1[KEY_PATH]);
                    }
                    _tempAllChildren.push(_pNode[KEY_ALLCHILDREN][i]);
                }
                _pNode[KEY_ALLCHILDREN] = _tempAllChildren;
            });
            }
            //将新创建的节点加到后面
            cLiEl.insertBefore(_tempLastNdoe[KEY_EL][KEY_LI]);
            //单选选中样式处理
            me._doSelected(node1);
            //计算最大宽度
            maxWidth = me._getLiMaxWidth(me.treeUL, true);
            me._setElWidth(me.treeUL, maxWidth, true);
        },
        /**
         * @private
         * @description 将指定节点及其子节点删除
         * @param {Object} node 待删除节点信息
         */
        remove: function(node) {
            var me = this;
            if (me.options.multi || !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                return;
            }
            if ($.isEmptyObject(node)) {
                return;
            }
            //由于node信息可能不全,需要通过path从操作数据中查找一份
            node = me.optObjDatas[node[KEY_PATH]];
            me._doDeleteNode(node);
        },
        /**
         * @private
         * @description 重新设置节点信息
         * @param {Object} newNode 新节点信息
         * @param {Object} node 节点信息
         */
        edit: function(newNode, node) {
            var me = this,
                    oldText,
                    newText,
                    textEl,
                    flag;
            if (me.options.multi || !(true === me.options.editable || "true" === me.options.editable || $.isArray(me.options.editable))) {
                return;
            }
            if ($.isEmptyObject(newNode) || $.isEmptyObject(node)) {
                return;
            }
            //由于node信息可能不全,需要通过path从操作数据中查找一份
            node = me.optObjDatas[node[KEY_PATH]];
            if (!node[KEY_EL] || !node[KEY_EL][KEY_LI]) {
                return;
            }
            flag = me._triggerHandler({newNode: $.objClone(newNode), node: $.objClone(node)}, eventBeforeEdit, me);
            if (false === flag || "false" === flag) {
                return;
            }
            oldText = node[KEY_TEXT];
            newText = newNode[KEY_TEXT];
            node[KEY_VALUE] = newNode[KEY_VALUE];
            node[KEY_TEXT] = newNode[KEY_TEXT];
            node[KEY_DATA] = newNode[KEY_DATA];
            textEl = node[KEY_EL][KEY_LI].find("." + treeNodeTextClass);
            //修改text值
            if (oldText != newText) {
                flag = me._triggerHandler({text: newText, oldText: oldText}, eventBeforeTextChange, me);
                if (false === flag || "false" === flag) {
                    flag = false;
                    newText = oldText;
                } else {
                    flag = true;
                }
            }
            textEl.text(newText);
            if (flag) {
                if (me.optObjDatas[node[KEY_PATH]]) {
                    me.optObjDatas[node[KEY_PATH]][KEY_TEXT] = newText;
                    me.optObjDatas[node[KEY_PATH]][KEY_QTIP] = newText;
                    if (me.options.tip) {
                        if (true == me.options.showCCount || "true" == me.options.showCCount || "leaf" == me.options.showCCount) {
                            me._upDateCNodeCount(me.optObjDatas[node[KEY_PATH]]);
                        } else {
                            textEl.attr("title", newText);
                        }
                    }
                }
                me.objDatas = me.optObjDatas;
                me._triggerHandler({text: newText, oldText: oldText}, eventTextChange, me);
            }
            me._triggerHandler($.objClone(node), eventEdit, me);
        },
        /**
         * @private
         * @description 是否为根节点
         * @param {Object} node 节点信息
         * @return {Boolean} isRootNode 是否为根节点
         */
        isRootNode: function(node) {
            var me = this;
            if ($.isEmptyObject(node)) {
                return false;
            }
            //由于node信息可能不全,需要通过path从操作数据中查找一份
            node = me.optObjDatas[node[KEY_PATH]];
            if ($.isEmptyObject(node)) {
                return false;
            }
            if (node[KEY_DEPTH] <= 0) {
                return true;
            }
            return false;
        },
        /**
         * @private
         * @description 获取节点深度,根节点为0,如果节点信息错误则返回-1
         * @param {Object} node 节点信息
         * @return {Number} depth 节点深度
         */
        getNodeDepth: function(node) {
            var me = this;
            if ($.isEmptyObject(node)) {
                return -1;
            }
            //由于node信息可能不全,需要通过path从操作数据中查找一份
            node = me.optObjDatas[node[KEY_PATH]];
            if ($.isEmptyObject(node)) {
                return -1;
            }
            return node[KEY_DEPTH];
        },
        /**
         * @private
         * @description 将数据转成数组
         * @param {Object} data 待转化的数据
         * @return {Object} 转化后的数组[{"text":"1", "value":"1"}, ...]
         */
        _objToArray: function(data) {
            var value = [];
            if (!data) {
                return value;
            }
            // 对象转换为数组
            if ($.isArray(data)) {
                value = data;
            } else {
                if (!$.isUndefined(data.value) && !$.isUndefined(data.text)) {
                    value.push(data);
                }
            }
            return value;
        },
        /**
         * @private
         * @description 加入显示子节点数的DOM
         * @param {Object} node 节点
         * @param {Object} liEl 节点DOM
         * @param {Object} textEl 节点文本DOM
         */
        _addCNodeCount: function(node, liEl, textEl) {
            var me = this,
                    nText,
                    tipText,
                    nTextEl;
            if (!node || !liEl || !textEl) {
                return null;
            }
            nText = "(0)";
            if (true == me.options.showCCount || "true" == me.options.showCCount) {
                if (node[KEY_ALLCHILDREN]) {
                    nText = "(" + node[KEY_ALLCHILDREN].length + ")";
                }
            } else if ("leaf" == me.options.showCCount) {
                nText = "(" + me._getAllLeafChildrenCount(node[KEY_ALLCHILDREN]) + ")";
            }
            nTextEl = $("<span>").addClass(treeNodeCCTextClass).text(nText).appendTo(liEl);
            // 是否有tip提示
            if (me.options.tip) {
                tipText = node[KEY_QTIP] + "&nbsp;&nbsp;" + nText;
                textEl.attr("title", tipText);
                nTextEl.attr("title", tipText);
            }
            return nTextEl;
        },
        /**
         * @private
         * @description 更新节点显示的子节点数
         * @param {Object} node 节点
         */
        _upDateCNodeCount: function(node) {
            var me = this,
                    nText,
                    tipText,
                    nTextEl;
            if (!node || !node[KEY_EL] || !node[KEY_EL][KEY_LI]) {
                return;
            }
            nTextEl = node[KEY_EL][KEY_LI].find("span." + treeNodeCCTextClass);
            if (nTextEl && nTextEl.length > 0) {
                if (true == me.options.showCCount || "true" == me.options.showCCount) {
                    nText = "(" + node[KEY_ALLCHILDREN].length + ")";
                } else if ("leaf" == me.options.showCCount) {
                    nText = "(" + me._getAllLeafChildrenCount(node[KEY_ALLCHILDREN]) + ")";
                }
                nTextEl.text(nText);
            }
            if (me.options.tip) {
                tipText = node[KEY_QTIP];
                if (nText) {
                    tipText = node[KEY_QTIP] + "&nbsp;&nbsp;" + nText;
                }
                if (nTextEl && nTextEl.length > 0) {
                    nTextEl.attr("title", tipText);
                }
                nTextEl = node[KEY_EL][KEY_LI].find("span." + treeNodeTextClass);
                if (nTextEl && nTextEl.length > 0) {
                    nTextEl.attr("title", tipText);
                }
            }
        },
        /**
         * @private
         * @description 通过所有子节点获取其叶子节点的个数
         * @param {Array} allChildren 所有子节点
         * @return {Number} count 叶子节点的个数
         */
        _getAllLeafChildrenCount: function(allChildren) {
            var me = this,
                    tNode,
                    count = 0;
            if (!allChildren || allChildren.length <= 0 || $.isEmptyObject(me.optObjDatas)) {
                return count;
            }
            for (var i = 0; i < allChildren.length; i++) {
                tNode = me.optObjDatas[allChildren[i]];
                if (tNode && tNode[KEY_LEAF]) {
                    count++;
                }
            }
            return count;
        }
    });
    /**
     * 创建树
     * @name Sweet.tree.Tree_v1
     * @class 
     * @extends Sweet.tree
     * @requires 
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.tree.js
     * </pre>
     * @example 
     * <pre>
     *  var data = [
     *           {
     *             value: "value1",
     *             text: "text1",
     *             children: [
     *                 {
     *                     value: "value1-1",
     *                     text: "text1-1",
     *                     children: [
     *                         {
     *                             value: "value1-1-1",
     *                             text: "text1-1-1"
     *                         },
     *                         {
     *                             value: "value1-1-2",
     *                             text: "text1-1-2"
     *                         }
     *                     ]
     *                 },
     *                 {
     *                     value: "value1-2",
     *                     text: "text1-2"
     *                 }
     *             ]
     *         }
     *     ];
     *  sweetTree = new Sweet.tree.Tree_v1({
     *               width : 200,
     *               height : 3000,
     *               multi : true,
     *               data : data,
     *               renderTo :"sweet-tree"
     *           })
     * sweetTree.render("sweet-tree");
     * </pre>
     */
    Sweet.tree.Tree_v1 = $.sweet.widgetTreeTree_v1;
}(jQuery));

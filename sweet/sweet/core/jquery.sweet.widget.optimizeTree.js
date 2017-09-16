/**
 * @fileOverview
 * <pre>
 * 树形组件
 * 2014.1.13
 * http://www.huawei.com
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */

(function($){

    var defaultStyle = {
        defaultTreeClass : "sweet-optimizetree-panel",
        treenodeClass : "sweet-optimizetree-node",
        treeRootNodeClass : "sweet-optimizetree-root-node-empty",
        treenodeSelectClass : "sweet-optimizetree-node-selected",
        treeParentClass : "sweet-optimizetree-parent",
        treeBGClass : "select_win_bg",
        treeTextClass : "sweet-optimizetree-text-node",
        treeIcoBlockClass : "sweet-optimizetree-ico-empty-block",
        treeEmptyBlockClass : "sweet-optimizetree-empty-block",
        treeExpandClass : "sweet-optimizetree-expand",          //展开状态
        treeUnExpandClass : "sweet-optimizetree-coll",          //收起状态
        treeFullCheckedClass : "sweet-optimizetree-full-check", //全选中状态
        treeCheckedClass : "sweet-optimizetree-check",          //半选中状态
        treeUnCheckedClass : "sweet-optimizetree-uncheck",      //未选中状态
        treeSearchClass : "sweet-tree-search-div",              //查询栏样式

        treeToolAddClass : "sweet-optimizetree-tool-add",
        treeToolModifyClass : "sweet-optimizetree-tool-modify",
        treeToolDeleteClass : "sweet-optimizetree-tool-delete",

        treeParentNodeIco : "sweet-tree-node-ioc",
        treeLeafNodeIco : "sweet-tree-leaf-ioc",
        treeLeafIndexClass : "sweet-tree-leaf-index",
        treeLeafNodeDimension : "sweet-tree-leaf-dimension",
        treeLeafCompClass : "sweet-tree-leaf-comp",
        treeLeafUserDefine : "sweet-tree-leaf-userDefine",
        treeNodeLine : "sweet-tree-node-line",        //竖线
        treeNodeEblow : "sweet-tree-node-eblow",      //连接下方节点线段，未结尾
        treeNodeEblowEnd : "sweet-tree-node-eblow-end" //连接下方节点折线，结尾
    };

    //内部使用的Key
    var keyExpanded = "expand",
        keyChecked = "checked",
        keyRootNode = 'rootNode',
        keyLeafNode = 'leafNode',
        keySelected = "selected",
        keySameLvlNodeCount = "sameLvlNodeCount",
        keyIsLastNode = "isLastNode",
        keyParentExpandIcoInfo = "parentExpandIcoInfo",
        keyId = "treeNodeId",
        keyChildren = "children",
        keyType = "type",
        keyParentKey = "parentKey",
        keyLevel = "level",
        keyNodeIndex = "orgNodeIndex",
        keyPath = "pathKey",
        keyChildrenIndexs = 'childrenIndexs',
        keyRootKey = 'nodeRootKey',
        keySelectedMap = "selectedMap",
        keyHalfSelectedMap = "halfSelectedMap",
        keySelectedCount = "selectedCount",
        keyHalfSelectedCount = "halfSelectedCount",
        keyNeedUpdateCheckedState = "needUpdateCheckedState",
        keyNeedRemove = "needRemove",
        //内部派发事件
        keyNodeCheckedEvent = "optimizeTreeNodeCheckedEvent",
        keyNodeExpandEvent = "optimizeTreeNodeExpandedEvent",
        keyNodeClickEvent = "optimizeTreeNodeClickEvent",
        keyNodeDClickEvent = "optimizeTreeDClickEvent",
        keyToolTypeNone = "none",
        keyToolTypeAll = "all",
        keyToolTypeLeaf = "leaf",
        keyToolTypeDir = "dir",
        keyToolTypeRoot = "root",
        keyToolTypeAdd = "add",
        keyToolTypeModify = "modify",
        keyToolTypeDelete = "delete";


    //常用的枚举
    var FULL_CHECKED = 2,
        HALF_CHECKED = 1,
        NONE_CHECKED = 0,
        //内部组件的ID前缀
        treePrefix = "sweet-optimizeTree-",
        //树节点容器的ID前缀
        treeElPrefix = "sweet-optimizeTree-container-";

    /**
     * 用于判断类型
     **/
    var is = function (o, type) {
        type = type.toLowerCase();
        if (type == "finite") {
            return !isnan[has](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return  (type == "null" && o === null) ||
            (type == typeof o && o !== null) ||
            (type == "object" && o === Object(o)) ||
            (type == "array" && Array.isArray && Array.isArray(o)) ||
            Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type;
    };

    /**
     * 用于数据分块，存放数据, 只能使用new创建
     * */
    var dataCell = function()
    {
        this.data = [];
        this.cellIndex = 0;
    };

    /**
     * 表格的渲染器 ,只能使用new创建
     * */
    var itemRenderer = function($dom, _options)
    {
        this.options = _options;
        this.data = {};
        this.ypos = 0;
        this.el = $dom;
        this.cellIndex = 0;
        this.nodeIndex = 0;
        //传入的$dom作为渲染器的外层容器
        var self = this,
            i = 0,
            style = _options.style,
            //展开或收起的图标
            _expandDom = $("<div class='" + style.treeIcoBlockClass + "'/>").attr('name', 'expandDom'),
            //根据type类型显示的图标
            _iconDom = $("<div />").attr('name', 'iconDom'),
            //复选框图标
            _checkedDom = $("<div />").attr('name', 'checkedDom'),
            //文本dom
            _textDom = $("<span class='" + style.treeTextClass + "'/>").attr('name', 'textDom'),
            //子节点连接父节点线段,初始化隐藏
            _leafEblowDom = $("<div class='" + style.treeNodeEblow + "' />").hide(),
            //子节点连接父节点，并封闭线段,初始化隐藏
            _leafEblowEndDom = $("<div class='" + style.treeNodeEblowEnd + "'/>").hide(),
            //存放所有占位节点
            _emptyNodes = [],
            //所有的功能节点
            _tools = [];

        //添加默认样式
        this.el.addClass(style.treenodeClass);

        //在这里先创建出占位使用的图标
        //根据当前节点的层级和是否是最后一个节点来判断需要呈现几个
        for(i = 0; i < this.options.pc.maxNodeLevel; i++)
        {
            //先创建占位的dom节点
            var emptyNode = $("<div class='" + style.treeNodeLine + "' />").hide();
            _emptyNodes.push(emptyNode);
            this.el.append(emptyNode);
        }

        //初始化节点
        this.el.append(_leafEblowDom)
            .append(_leafEblowEndDom)
            .append(_expandDom)
            .append(_iconDom)
            .append(_checkedDom)
            .append(_textDom);

        //在所有节点后面创建
        if(keyToolTypeNone != this.options.toolsType)
        {
            for(i = 0; i < this.options.tools.length; i++)
            {
                var toolType = this.options.tools[i];
                var toolNode = $("<div></div>").hide();
                _tools.push(toolNode);
                switch(toolType)
                {
                    case keyToolTypeAdd:
                        toolNode.addClass(style.treeToolAddClass).attr('name', 'toolAdd');
                        break;
                    case keyToolTypeModify:
                        toolNode.addClass(style.treeToolModifyClass).attr('name', 'toolModify');
                        break;
                    case keyToolTypeDelete:
                        toolNode.addClass(style.treeToolDeleteClass).attr('name', 'toolDelete');
                        break;
                }
                this.el.append(toolNode);
            }
        }

        this.preUpdateNode = function(val, pos, cellIndex, nodeIndex)
        {
            self.data = val;
            self.ypos = pos;
            if(undefined == val)
            {
                return;
            }
            self.cellIndex = val['cellIndex'] = cellIndex;
            self.nodeIndex = val['nodeIndex'] = nodeIndex;
        };

        this.updateNode = function(options, me)
        {
            if(undefined == self.data)
            {
                //隐藏并更新Y坐标
                self.el.hide().css('top', self.ypos + 'px');
                return;
            }
            else
            {
                self.el.show();
            }

            var parentNode,
                fixedWidth = 20,
                iconW = 20,
                level = self.data[keyLevel],
                emptyNode,
                iconClass = style.treeLeafNodeIco,
                //是否有父节点
                hasParent = false,
                //是否有子节点
                haseChildren = false,
                isExpand = self.data[keyExpanded] == undefined ? false : self.data[keyExpanded],
                isChecked = self.data[keyChecked] == NONE_CHECKED ? false : self.data[keyChecked];

            if(!this.options.icon)
            {
                _iconDom.hide();
                fixedWidth -= iconW;
            }
            //在这里更新icon
            else if(this.options.icon && !$.isNull(self.data[this.options.iconField]))
            {
                switch(self.data[this.options.iconField])
                {
                    case 0:
                        iconClass = style.treeLeafNodeDimension;
                        break;
                    case 1:
                        iconClass = style.treeLeafIndexClass;
                        break;
                    case 2:
                        iconClass = style.treeLeafUserDefine;
                        break;
                    case 3:
                        iconClass = style.treeLeafCompClass;
                        break;
                    case 4:
                        iconClass = style.treeParentNodeIco;
                        break;
                    default:
                        iconClass = style.treeLeafNodeIco;
                        break;
                }
            }


            //判断是否存在子节点
            if(self.data.hasOwnProperty(keyChildren) && self.data[keyChildren].length != 0)
            {
                //显示expandDom
                _expandDom.show().removeClass();
                if(isExpand == true)
                {
                    _expandDom.addClass(style.treeUnExpandClass);
                }
                else
                {
                    _expandDom.addClass(style.treeExpandClass);
                }
                //修改节点样式,父节点样式优先显示
                iconClass = style.treeParentNodeIco;
                haseChildren = true;
                fixedWidth += iconW;
            }
            //如果不存在子节点
            else
            {
                //隐藏expandDom
                if(self.data[keyLeafNode] == true){
                    _expandDom.removeClass().hide();
                }
                else{
                    _expandDom.removeClass().addClass(style.treeIcoBlockClass);
                    fixedWidth += iconW;
                }
            }

            if(this.options.icon)
            {
                _iconDom.removeClass().addClass(iconClass);
            }

            //判断是否出现checkBox
            if(this.options.multi)
            {
                _checkedDom.show().removeClass();
                if(isChecked == FULL_CHECKED)
                {
                    _checkedDom.addClass(style.treeFullCheckedClass);
                }
                else if(isChecked == HALF_CHECKED)
                {
                    _checkedDom.addClass(style.treeCheckedClass);
                }
                else
                {
                    _checkedDom.addClass(style.treeUnCheckedClass);
                }
                fixedWidth += iconW;
            }
            else
            {
                _checkedDom.hide();
            }

            //判断是否存在父节点,如果存在，说明不是根节点,需要进行缩进
            if(self.data.hasOwnProperty(keyParentKey))
            {
                self.el.removeClass(style.treeRootNodeClass);
                var nodeMap = this.options.pc.isFilterMode ? this.options.pc.filterItemsMap : this.options.pc.itemsMap;
                parentNode = nodeMap[self.data[keyParentKey]];
                hasParent = true;
            }
            //添加根节点样式
            else{
                self.el.addClass(style.treeRootNodeClass);
            }

            //如果是最后一层节点，并且有父节点，
            _leafEblowDom.hide();
            _leafEblowEndDom.hide();
            //如果存没有子节点,并且当前不是根节点
            if(!haseChildren && hasParent && options.displayLine)
            {
                if(self.data[keyIsLastNode])
                {
                    _leafEblowEndDom.show();
                }
                else
                {
                    _leafEblowDom.show();
                }
                fixedWidth += iconW;
            }

            var parentLvl = level;
            if(parentNode)parentLvl = parentNode[keyLevel];
            //先判断需要使用几个占位符
            for(var i = 0; i < _emptyNodes.length; i++)
            {
                emptyNode = _emptyNodes[i];
                //先使用空白的占位符
                emptyNode.removeClass().addClass(style.treeIcoBlockClass);
                if(i < level)
                {
                    emptyNode.show();
                    fixedWidth += iconW;
                }
                else
                {
                    emptyNode.hide();
                }
                if(false == self.data[keyParentExpandIcoInfo][i] && options.displayLine)
                {
                    emptyNode.removeClass().addClass(style.treeNodeLine);
                }
            }

            var displayTools = false;
            if(keyToolTypeNone != self.options.toolsType)
            {
                switch(self.options.toolsType)
                {
                    case keyToolTypeAll:
                        displayTools = true;
                        break;
                    case keyToolTypeLeaf:
                        if(self.data[keyLeafNode] == true)
                        {
                            displayTools = true;
                        }
                        break;
                    case keyToolTypeDir:
                        if(!self.data[keyLeafNode])
                        {
                            displayTools = true;
                        }
                        break;
                    case keyToolTypeRoot:
                        if(self.data[keyRootNode])
                        {
                            displayTools = true;
                        }
                        break;
                }
            }

            for(i = 0; i < _tools.length; i++)
            {
                if(displayTools){
                    _tools[i].show();
                    if(i == 0)
                    {
                        _tools[i].css('marginLeft', 10)
                    }
                }
                else{
                    _tools[i].hide();
                }
            }


            //更新Y坐标
            self.el.css({
                'top' : self.ypos + 'px'
            }).data({
                    data : self.data
                });

            //需要在样式变更过后设置正确的data
            if(self.data.hasOwnProperty(this.options.labelField))
            {
                _textDom.html(self.data[this.options.labelField]);
            }
            var w = fixedWidth + parseInt(_textDom.css('width'));
            if(w > options.maxNodeWidth){
                options.maxNodeWidth = w;
            }

            if(true == self.data[keySelected]){
                self.el.addClass(style.treenodeSelectClass);
            }
            else{
                self.el.removeClass(style.treenodeSelectClass);
            }
        };

    };


    $.widget("sweet.optimizeTree", $.sweet.widget, /** @lends Sweet.tree.OptimizeTree.prototype */{
        version : "1.0",
        sweetWidgetName : "[widget-optimizeTree]",
        eventNames : /** @lends Sweet.tree.OptimizeTree.prototype */{
            /**
             * @event
             * @description 树节点单击事件,一般参数为两个(evt, data)
             */
            nodeClick : "树节点单击事件",
            /**
             * @event
             * @description 树节点双击事件,一般参数为两个(evt, data)
             */
            nodeDClick : "树节点双击事件",
            /**
             * @event
             * @description 树节点展开事件,一般参数为两个(evt, data)
             */
            nodeExpand : "树节点展开事件",
            /**
             * @event
             * @description 树节点拖拽事件,一般参数为两个(evt, data)
             */
            nodeDrag : "树节点拖拽事件",
            /**
             * @event
             * @description 树节点CheckBox选中事件,一般参数为两个(evt, data)
             */
            nodeCheck : "树节点CheckBox选中事件",
            /**
             * @event
             * @description 树节点CheckBox反选事件,一般参数为两个(evt, data)
             */
            nodeUnCheck : "树节点CheckBox反选事件",
            /**
             * @event
             * @description 搜索节点事件,一般参数为两个(evt, data)
             */
            search : "搜索节点事件",
            /**
             * @event
             * @description 切换树节点事件,一般参数为两个(evt, data)
             */
            change : "切换树节点事件",
            /**
             * @event
             * @description 调用完setData方法后触发,一般参数为两个(evt, data)
             */
            afterSetData : "调用完setData方法后触发",
            /**
             * @event
             * @description 调用完setValue后触发,一般参数为两个(evt, data)
             */
            afterSetValue : "调用完setValue后触发",
            /**
             * @event
             * @description 树节点编辑事件,一般参数为两个(evt, data)
             */
            nodeEdit : "树节点编辑事件",
            /**
             * @event
             * @description 点击checkBox之前的事件,一般参数为两个(evt, data)
             */
            "beforeCheckboxClick" : "点击checkBox之前的事件",
            "toolAddClick" : "工具栏点击新增按钮",
            "toolModifyClick" : "工具栏点击修改按钮",
            "toolDeleteClick" : "工具栏点击删除按钮"
        },
        //public config
        options : /** @lends Sweet.tree.OptimizeTree.prototype */ {
            /***
             * 在这里列出所有属性
             * */

            /**
             * 数据的ID字段，只有设置useTreeStruct为false时是必须的
             * @type String
             * @default id
             */
            idField : 'id',
            /**
             * 数据的父节点ID字段，只有设置useTreeStruct为false时是必须的
             * @type String
             * @default parent
             */
            parentField : 'parent',
             /**
             * 基础数据
             * @type Array
             * @default null
             */
            data : [],
            /**
             * @private
             * 原始数据,不建议外部使用
             * @type Array
             * @default null
             */
            orgData: [],
            /**
             * 是否禁用当前组件
             * @type Boolean
             * @default false
             */
            disabled : false,
            /**
             * 是否展开所有层级的所有节点
             * @type Boolean
             * @default false
             */
            expand : false,
            /**
             * 是否显示树节点的图标
             * @type Boolean
             * @default true
             */
            icon : true,
            /**
             * 用于标识显示ICON类型的字段
             * @type String
             * @default type
             */
            iconField : 'type',
            /**
             * 是否显示节点之间的连线
             * @type Boolean
             * @default true
             */
            displayLine: true,
            /**
             * 是否允许多选,如果true,显示checkBox
             * @type Boolean
             * @default true
             */
            multi : false,
            /**
             * 接受树节点的对象名称
             * @type String
             * @default ""
             */
            nodeAccept : "",
            /**
             * 树节点是否可以拖动
             * @type Boolean
             * @default false
             */
            nodeDraggable : false,
            /**
             * 是否显示搜索框
             * @type boolean
             * @default true
             */
            search : true,
            /**
             * 当search为true时，出现的搜索框中的提示文字
             * @type string
             * @default Sweet.core.i18n.tree.search("search"/"搜索")
             */
            searchEmptyText : Sweet.core.i18n.tree.search,
            /**
             * @private
             * 所有选中的元素,使用每个节点的唯一KEY值存储
             * @type Object
             * @default null
             */
            selectedItems : {},
            /**
             * @private
             *  自定义样式接口
             * @type Object
             * @default null
             */
            style : {},
            /**
             * @private
             * 当前树控件的最大层级
             * @type Number
             * @default 0
             */
            maxLevel : 0,
            /**
             * 显示使用的字段
             * @type String
             * @default text
             */
            labelField : "text",
            /**
             * 保存值的字段
             * @type String
             * @default value
             */
            valueField : "value",
            /**
             * @private
             * 树节点的高度
             * @type Number
             * @default 22
             */
            itemHeight : 22,
            /**
             * 是否使用树形结构的数据。
             *  如果为true,调用getValue方法时返回的是树形结构数据。
             *  如果为false,调用getValue方法时将尝试构造平铺结构的数据进行返回，如果有重复ID出现，将抛出异常。
             * @type Boolean
             * @default true
             */
            useTreeStruct : true,
            /**
             * 是否使用自定义的按钮，呈现在树节点右侧
             * 类型： add, modify, delete
             * 例如：[add, add, modify, delete]将依次显示两个新增按钮，一个修改按钮和一个删除按钮
             * @type Array
             * @default []
             */
            tools : [],
            /**
             * tools的显示方式
             * 类型： all 所有节点都显示,
             *       root 只有根节点显示,
             *       dir 所有的非叶子节点都显示,
             *       leaf 所有的叶子节点显示,
             *       none 不显示
             * @type String
             * @default none
             */
            toolsType : 'none',
            /**
             * @private
             * 当前的选中节点
             * @type Object
             * @default null
             */
            selectedNode : null,
            /**
             * @private
             * 节点的最大宽度
             * @type Number
             * @default 0
             */
            maxNodeWidth : 0,
            //private Config
            /**
             * @private
             * 是否始终在非叶子节点上显示展开icon
             * @type Boolean
             * @default false
             */
            alwaysDisplayExpandIcon : false,
            //private Config
            /**
             * @private
             * 存放组件的私有属性，这些属性会影响到组件的实际功能，不对外开放。
             * @type Object
             * @default null
             */
            pc : {},
            /**
             * @description 可配置对呈现数据加工后再返回
             * @type {Function}
             */
            handleText : function(val)
            {
                return val;
            },
            /**
             * @description 可配置对呈现数据tip提示加工后再返回
             * @type {Function}
             */
            handleTitle : function(val)
            {
                return val;
            }
        },
        /***
         * 在这里列出所有对外暴露的方法
         * */
        /**
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用组件 true/false
         */
        setDisabled : function(disabled){},

        /**
         * @description 设置子节点选中状态
         * @param {Object} data 树形结构的数据，与setData中的数据格式保持一致
         */
        setSelected : function(data){

        },

        setUnSelected : function(data){

        },

        setUnSelectedAll : function(){

        },

        /**
         * @private
         * @description 更新树控件的配置,不使用jquery.widget的_setOption,调用时间过早
         * @param {Object} cfg 与options格式相同
         */
        updateOptions : function(cfg)
        {
            for(var key in cfg)
            {
                if(cfg[key] && 'pc' != key)
                {
                    if(key == 'data')
                    {
                        this.setData(cfg[key]);
                    }
                    this.options[key] = cfg[key];
                }
            }
        },

        /**
         * @private
         * @description 内部方法，在options中包含data时调用
         * @param {Object} data 与options格式相同
         * @param {Boolean} isAppend 是否将新数据追加到老数据上
         */
        _updateOptionsData : function(data, isAppend)
        {
            //如果是追加数据，需要合并数据
            if(undefined != isAppend && true == isAppend)
            {
               data = this.concatData(this.options.orgData, data);
            }
            this._clearAll();
            this.options.data = data;
            this.options.orgData = data;
            this.options.expand = this.options.expand == undefined ? false : this.options.expand;
            //为数据建立索引,并且将数据分块
            this._createIndex(this.options.pc.itemsMap, this.options.pc.leafItemsMap, data);
            //计算出所有节点需要的最大高度
            this.options.pc.maxBgHeight = this.options.pc.totalNodeCount * this.options.itemHeight;
            //分解完数据后绘制渲染器
            this._draw();
        },

        /**
         * @private
         * @description 内部方法，连接两个数据结构，组合成新的数据返回
         * @param {Object} orgData 当前组件使用的数据
         * @param {Object} newData 需要合并的新数据
         * @return {Array} 拼接后的新数组
         */
        concatData : function(orgData, newData)
        {
            if(!orgData || !newData)
            {
                throw new Error("Function concatData Error: 传入的参数不合法");
            }

            var self = this,
                options = self.options,
                result = new Array();

            if(options.useTreeStruct == true)
            {
                var tempOrg = {children:orgData},
                    tempNew = {children:newData};
                result = self._concatTreeData(tempOrg, tempNew, "");
                result = result[keyChildren];
            }
            else
            {
                result = self._concatRepeatData(orgData, newData);
            }
            return new Array().concat(result);
        },

        /**
         * @private
         * @description 内部方法，拼接树形结构的数据
         * @param {Object} orgData 当前组件使用的数据
         * @param {Object} newData 需要合并的新数据
         * @param {String} parentKey 父节点的key，用于递归使用
         * @return {Array} 拼接后的新数组
         */
        _concatTreeData : function(orgData, newData, parentKey)
        {
            var self = this,
                options = self.options,
                newPath = parentKey,
                orgChildren = orgData[keyChildren],
                newChildren = newData[keyChildren];

            if(!orgChildren || !newChildren)return null;

            for(var i = 0; i < newChildren.length; i++)
            {
                var newNode = newChildren[i],
                    newId = newNode[options.labelField] + '_' + newNode[options.valueField],
                    nodePath = newId;

                if(undefined != newPath && "" != newPath)
                {
                    nodePath = newPath + "#" + newId;
                }

                newNode[keyId] = newId;
                newNode[keyPath] = nodePath;
                //查找当前源数据是否已经存在相同节点
                var orgNode = options.pc.itemsMap[nodePath];
                //如果已经存在该节点，合并
                if(orgNode)
                {
                    orgNode = self._concatTreeData(orgNode, newNode, nodePath);
                }
                //如果不存在，添加
                else
                {
                    newNode[keyNeedUpdateCheckedState] = true;
                    orgData[keyChildren].push(newNode);
                }
            }
            return orgData;
        },

        /**
         * @private
         * @description 内部方法，拼接平铺结构的数据
         * @param {Object} orgData 当前组件使用的数据
         * @param {Object} newData 需要合并的新数据
         * @return {Array} 拼接后的新数组
         */
        _concatRepeatData : function(orgData, newData)
        {
            var self = this,
                options = self.options,
                len = newData.length;

            for(var i = 0; i < len; i++){
                var newNode = newData[i],
                    newId = newNode[options.labelField] + '_' + newNode[options.valueField],
                    nodePath = newId;
                //查找当前源数据是否已经存在相同节点
                var orgNode = options.pc.itemsMap[nodePath];
                if(!orgNode){
                    orgData.push(newNode);
                }
            }
            return orgData;
        },

        //设置数据
        setData : function(data, isAppend)
        {
            data = $.objClone(data);
            if(false == this.options.useTreeStruct)
            {
                //在这里将平铺数据转换为树形结构
                data = this._repeatToTreeStruct(data).children;
            }
            this._updateOptionsData(data, isAppend);
            this._fireEvent('afterSetData', this, {});
        },

        /**
         * @description 返回当前组件使用的所有数据，数据中可能包含组件内部使用的属性，但不会影响到原始数据的完整性。
         * @return {Object} 当前组件使用的所有数据
         */
        getData : function()
        {
            return this.options.orgData;
        },

        /**
         * @description 将平铺结构的数据转换为树形结构
         * @return {Object} 当前组件使用的所有数据
         */
        _repeatToTreeStruct : function(data)
        {
            var self = this,
                options = self.options,
                tempMap = {},
                result = {children : []},
                len = data.length,
                i = 0,
                node;

            for(i = 0; i < len; i++)
            {
                node = data[i];
                tempMap[node[options.idField]] = node;
            }

            for(i = 0; i < len; i++)
            {
                node = data[i];
                var parentKey = node[options.parentField];
                if(undefined == parentKey || "" == parentKey)
                {
                    result.children.push(node);
                }
                else if(tempMap[parentKey])
                {
                    if(!tempMap[parentKey].children)
                    {
                        tempMap[parentKey].children = [];
                    }
                    tempMap[parentKey].children.push(node);
                }
            }
            return result;
        },

        /***
         * @description 获取所有选中项，返回的是所有的选中结果，如果存在过滤字符串的情况，也会将之前选中但是隐藏的项返回
         * @return 返回一个Object，使用键值对存储选中项目
         * **/
        getSelectedItems: function()
        {
            return this.options.selectedItems;
        },

        /**
         * @description 获取当前所有选中项的个数，包含被隐藏的项
         * @return {Number} 所有选中项的个数
         */
        getTotalItemsCount : function()
        {
            return this.options.pc.totalNodeCount;
        },

        /**
         * @description 删除所有的选中项,包含被隐藏的项
         */
        removeSelectedItems : function()
        {
            this._removeNodes(this.options.selectedItems);
        },

        /**
         * @private
         * @description 删除指定的数据
         * @param {Object} 需要删除的节点，树形结构
         */
        _removeNodes : function(nodes)
        {
            var self = this,
                options = self.options,
                node;
            //只处理子节点数据，然后反刷父节点
            for(var key in nodes)
            {
                node = nodes[key];
                //标记为需要删除，在下一次渲染时刻生效
                self.options.pc.itemsMap[node[keyPath]][keyNeedRemove] = true;
                delete nodes[node[keyPath]];
            }
            var filterStr = self.getFilterString();
            self._updateData(options.orgData);
            if("" != filterStr)
            {
                self.filter(filterStr);
            }
        },

        /**
         * @private
         * @description 获取当前输入的过滤字符串
         * @return {String} 当前查询框输入的文本
         */
        getFilterString : function()
        {
            if(this.searchField)
            {
                var result = this.searchField.getValue();
                if(!result || !result.text)
                {
                    return "";
                }
                return result.text;
            }
        },

        /**
         * @description 获取当前鼠标选中的节点，非勾选
         * @param {Object} data 鼠标选中的节点数据
         */
        getSelectedNode : function(){
            if(this.options.selectedNode){
                return this.options.selectedNode;
            }
        },

        /**
         * @description 根据传入的数据，找到相同的节点，修改属性值,所有的修改只针对叶子节点有效
         * @param {Object} data 指定需要修改的新数据
         */
        _setValue : function(data)
        {
            this._modifyNodeData(data, "");
            this._updateItems(true);
        },

        /**
         * @private
         * @description 在当前组件中查找到指定的节点，修改节点的值
         * @param {Object} data 指定需要修改的新数据
         * @param {String} parentKey 父节点KEY，递归使用
         */
        _modifyNodeData : function(data, parentKey)
        {
            var self = this,
                options = self.options,
                newPath = parentKey,
                len = data.length;

            for(var i = 0; i < len; i++)
            {
                var node = data[i],
                    nodeId = node[options.labelField] + '_' + node[options.valueField],
                    nodePath = nodeId;
                if(undefined != newPath && "" != newPath)
                {
                    nodePath = newPath + nodeId;
                }
                node[keyId] = nodeId;
                node[keyPath] = nodePath;
                var orgNode = options.pc.itemsMap[nodePath];
                if(orgNode)
                {
                    //只处理叶子节点
                    if(!orgNode[keyChildren] || 0 == orgNode[keyChildren].length)
                    {
                        self._changeNodeProp(orgNode, node);
                        //更新父类节点的选中状态
                        self._updateParentCheckedState(node);
                    }
                    else
                    {
                        self._modifyNodeData(node[keyChildren], nodePath+"#");
                    }
                }
            }
        },

        /**
         * @private
         * @description 使用新的属性值覆盖到老的对象上，如果有新的属性存在，将会附加
         * @param {Object} node 指定的修改对象
         * @param {Object} prop 新的对象
         */
        _changeNodeProp : function(node, prop)
        {
            var self = this,
                options = self.options;
            for(var key in prop)
            {
                node[key] = prop[key];
                if(key == keyChecked){
                    if(prop[key] == FULL_CHECKED && node[keyLeafNode]){
                        options.selectedItems[node[keyPath]] = node;
                    }else{
                        delete options.selectedItems[node[keyPath]];
                    }
                }
            }
        },

        /**
         * @description 返回当前组件所有选中的值，包含被隐藏的部分
         * @return {Object} 返回的数据结构与当前组件的useTreeStruct属性有关，请参见useTreeStruct属性
         **/
        _getValue : function()
        {
            var self = this,
                options = self.options,
                selectedItems = options.selectedItems;

            if(options.useTreeStruct == true)
            {
                return self._rebuildValueTree(selectedItems);
            }
            else
            {
                return self._rebuildValueRepeat(selectedItems);
            }
        },

        _rebuildValueTree : function(orgData)
        {
            return this._rebuildTreeData(orgData, new Object());
        },

        _rebuildValueRepeat : function(orgData)
        {
            var result = [];
            var temp = {};
            for(var key in orgData)
            {
                var node = orgData[key];
                if(temp[node[keyId]] != undefined)
                {
                    throw new Error("返回的平铺数据中，存在相同ID的节点，请设置树控件的useTreeStruct为true来返回正确的数据格式");
                }
                else
                {
                    temp[node[keyId]] = true;
                    result.push(orgData[key]);
                }

            }
            return result;
        },

        _updateDataChecked : function(data, isChecked)
        {
            data[keyChecked] = isChecked;
            //如果是在过滤模式下勾选，需要同步到原始数据,只同步叶子节点数据
            if(this.options.pc.isFilterMode && data[keyLeafNode])
            {
                this.options.pc.itemsMap[data[keyPath]][keyChecked] = isChecked;
                this.options.pc.itemsMap[data[keyPath]][keyNeedUpdateCheckedState] = true;
            }
            //只存储叶子节点,在用户操作的时候就保存，避免循环
            if(isChecked == FULL_CHECKED && data[keyLeafNode])
            {
                this.options.selectedItems[data[keyPath]] = data;
            }
            else
            {
                delete this.options.selectedItems[data[keyPath]];
            }
        },
        /**
         * 内部方法，选中节点的处理
         * **/
        _checkedNode : function(data, isChecked)
        {
            //重新赋值
            this._updateDataChecked(data, isChecked);
            //更新子节点状态
            this._updateChildrenCheckedState(data);
            //更新父节点状态
            this._updateParentCheckedState(data);
        },
        /**
         * 内部方法，更新当前节点的子节点选中状态
         * @params data 需要更新的节点
         * **/
        _updateChildrenCheckedState : function(data)
        {
            data[keySelectedCount] = 0;
            data[keySelectedMap] = {};
            //如果存在子节点，还需要更新子节点的状态
            if(undefined != data[keyChildren])
            {
                var children = data[keyChildren],
                    len = children.length,
                    child,
                    isChecked = data[keyChecked];

                if(isChecked == FULL_CHECKED)
                {
                    data[keySelectedCount] = len;
                }

                for(var i = 0; i < len; i++)
                {
                    child = children[i];
                    this._updateDataChecked(child, isChecked);
                    if(isChecked == FULL_CHECKED)
                    {
                        data[keySelectedMap][child[keyPath]] = child[keyPath];
                    }
                    this._updateChildrenCheckedState(child);
                }
            }
        },
        /**
         * 内部方法，更新当前节点的父节点选中状态
         * @params data 需要更新的节点
         * **/
        _updateParentCheckedState : function(data)
        {
            var nodeMap = this.options.pc.isFilterMode ? this.options.pc.filterItemsMap : this.options.pc.itemsMap,
                parentNode = nodeMap[data[keyParentKey]];

            //到根节点终止
            if(parentNode == undefined)
            {
                return;
            }
            parentNode[keySelectedMap] = parentNode[keySelectedMap] || {};
            parentNode[keyHalfSelectedMap] = parentNode[keyHalfSelectedMap] || {};
            parentNode[keySelectedCount] = parentNode[keySelectedCount] || 0;
            parentNode[keyHalfSelectedCount] = parentNode[keyHalfSelectedCount] || 0;

            this._updateParentNodeCheckedCount(data, parentNode);
            //递归
            this._updateParentCheckedState(parentNode);
        },

        /***
         * 根据子节点状态更新父节点的选中状态，不使用循环
         * ***/
        _updateParentNodeCheckedCount : function(node, parentNode)
        {
            var nodeIndex = node[keyPath];
            //如果是选中状态或半选状态，添加到父节点的选中节点列表
            if(node[keyChecked] == FULL_CHECKED)
            {
                //先从map中查询是否已经存在，避免重复
                if(parentNode[keySelectedMap][nodeIndex] == undefined)
                {
                    //map中存放下标
                    parentNode[keySelectedMap][nodeIndex] = nodeIndex;
                    parentNode[keySelectedCount]++;
                }
                if(parentNode[keyHalfSelectedMap][nodeIndex] != undefined)
                {
                    delete parentNode[keyHalfSelectedMap][nodeIndex];
                    parentNode[keyHalfSelectedCount]--;
                }
            }
            else if(node[keyChecked] == HALF_CHECKED)
            {
                if(parentNode[keyHalfSelectedMap][nodeIndex] == undefined)
                {
                    parentNode[keyHalfSelectedMap][nodeIndex] = nodeIndex;
                    parentNode[keyHalfSelectedCount]++;
                }
                if(parentNode[keySelectedMap][nodeIndex] != undefined)
                {
                    parentNode[keySelectedCount]--;
                    delete parentNode[keySelectedMap][nodeIndex];
                }
            }
            //如果是未选中状态，从父节点的选中节点列表中删除
            else if(node[keyChecked] == NONE_CHECKED)
            {
                if(parentNode[keySelectedMap][nodeIndex] != undefined)
                {
                    parentNode[keySelectedCount]--;
                    delete parentNode[keySelectedMap][nodeIndex];
                }
                else if(parentNode[keyHalfSelectedMap][nodeIndex] != undefined)
                {
                    parentNode[keyHalfSelectedCount]--;
                    delete parentNode[keyHalfSelectedMap][nodeIndex];
                }
            }

            this._calcCheckedState(parentNode);
        },
        /**
         * 计算节点的选中状态
         * **/
        _calcCheckedState : function(parentNode)
        {
            var result = parentNode[keyHalfSelectedCount] + parentNode[keySelectedCount],
                childrenLen = parentNode[keyChildren].length;

            //未选中状态
            if(result == 0)
            {
                parentNode[keyChecked] = NONE_CHECKED;
            }
            //全选
            else if(parentNode[keySelectedCount] == childrenLen)
            {
                parentNode[keyChecked] = FULL_CHECKED;
            }
            //半选状态
            else if(parentNode[keyHalfSelectedCount] > 0 || parentNode[keySelectedCount] < childrenLen)
            {
                parentNode[keyChecked] = HALF_CHECKED;
            }
            else
            {
                throw new Error("选中状态计算错误 : " + parentNode[this.options.labelField]);
            }
        },

        /**
         * 创建组件,在这里创建常驻的元素
         * */
        _createSweetWidget : function()
        {
            this._initStyle();
            this._initPrivateConfig();

            var self = this,
                options = this.options,
                style = options.style,
                //传入的渲染DIV
                renderEl = this.renderEl = $("#" + options.renderTo),
                //创建根节点元素
                rootDiv = this.rootDiv = $("<div/>").width(options.width).height(options.height).attr('id', 'rootDiv_' + this.uuid + "_" + options.id),
                //存放树元素和占位元素
                treeRootDiv = this.treeRootDiv = $("<div>").width(options.width).addClass(style.treeParentClass +' ' + style.treeBGClass),
                //创建树的根DOM元素
                treeEl = this.treeEl = $("<div/>").width(options.width).attr('id', options.id).addClass(style.defaultTreeClass),
                //创建用于占位的div,高度等于要显示的所有数据 * 渲染器的单个高度
                bgEl = this.bgEl = $("<div></div>");
                rootDiv.addClass(options.widgetClass);

            //如果需要呈现搜索栏
            if(options.search)
            {
                self.searchRendererDiv = $('<div/>').attr('id', options.id + treePrefix + options.id + 'search')
                    .addClass(style.treeSearchClass);
                self.searchField = new Sweet.form.SearchField({
                    width: options.width,
                    emptyText: options.searchEmptyText
                });
            }
            bgEl.addClass(style.treeEmptyBlockClass);
        },
        _initStyle : function(){
             var style = {},
                   custStyle = this.options.style;
             for(var key in defaultStyle){
                 if(custStyle[key]){
                     style[key] = custStyle[key]
                 }
                 else{
                     style[key] = defaultStyle[key];
                 }
             }
            this.options.style = style;
        },
        _initPrivateConfig : function()
        {
          this.options.pc = {
              //存放所有的DataCell
              cells : [],
              //当前是否在过滤状态下
              isFilterMode : false,
              //在过滤状态下存放所有被过滤出的node
              filterItemsMap : {},
              //用于建立索引,存放所有的node
              itemsMap : {},
              //存放所有的叶子节点
              leafItemsMap : {},
              //用于刷新使用
              updateItemsMap : {},
              updateLeafItemsMap : {},
              //存放所有的渲染器
              items : [],
              //最下方itemRenderer的Y坐标
              bottomYPos : 0,
              //最上方itemRenderer的Y坐标
              topYPos : 0,
              //最上方的itemRenderer
              topItem : {},
              //最下方的itemRenderer
              bottomItem : {},
              //存放用于查询的集合
              searchMap : {},
              //数据分块的大小
              cellCount : 100,
              //所有的根节点，子节点的总数
              totalNodeCount : 0,
              //最大的层级数
              maxNodeLevel : 0,
              //最大的宽度限制,所有的根节点与子节点集合
              maxBgHeight : 0
          }
        },
        //组件创建完毕以后，添加事件监听
        _afterCreateSweetWidget : function()
        {
            var self = this,
                options = self.options;

            //添加过滤文本框
            if(options.search)
            {
                var searchInterval = 0;
                //设置一个定时器，定时器超时后调用过滤
                self.searchField.addListener('keyup', function(e, data)
                {
                    if(0 == searchInterval){
                        searchInterval = setInterval(function(){
                            clearInterval(searchInterval);
                            self.filter(data.text);
                            self._fireEvent('search', e.target, data);
                        }, 500);
                    }
                    //在500毫秒内连续输入，重置定时器
                    else{
                        clearInterval(searchInterval);
                        searchInterval = setInterval(function(){
                            clearInterval(searchInterval);
                            self.filter(data.text);
                            self._fireEvent('search', e.target, data);
                        }, 500);
                    }
                });

                self.searchField.addListener('click', function(e, data)
                {
                    self.filter(data.text);
                    self._fireEvent('search', e.target, data);
                });
            }
            self._handleAllEvent();
        },
        _handleAllEvent : function()
        {
            var self = this,
                options = self.options,
                style = options.style;;
            //如果当前禁用组件，不做处理
            if(self.options.disabled)return;
            self.treeEl.bind('click', function(evt){

                var target = $(evt.target),
                    node, data, domName;

                if(target.hasClass(style.treenodeClass))
                {
                    node = target;
                }
                else if(target.parent() && target.parent().hasClass(style.treenodeClass))
                {
                    node = target.parent();
                }
                //如果不是点击在树节点上,不做处理
                if(!node)return;
                //设置树节点选中
                data = node.data('data');
                domName = target.attr('name');

                //优先处理展开事件
                if('expandDom' == domName)
                {
                    var isExpanded =  data[keyExpanded] = undefined ? true : !data[keyExpanded];
                    //处理展开数据
                    self._expandNode(data, isExpanded);
                    //更新所有的渲染器状态
                    self._updateItems(true);
                    if(isExpanded)
                    {
                        //触发展开节点事件
                        self._fireEvent('nodeExpand', evt, data);
                    }
                }
                //处理复选事件
                else if('checkedDom' == domName)
                {
                    var isChecked = data[keyChecked] == undefined ? NONE_CHECKED : data[keyChecked];
                    if(isChecked == NONE_CHECKED || isChecked == HALF_CHECKED)
                    {
                        isChecked = FULL_CHECKED;
                    }
                    else
                    {
                        isChecked = NONE_CHECKED;
                    }
                    //勾选之前判断是否继续处理
                    if(!$.isNull(self.handlers) && !$.isNull(self.handlers['beforeCheckboxClick'])){
                        if(false == self.handlers['beforeCheckboxClick'].call(self.treeEl, evt, data)){
                            return;
                        }
                    }
                    //处理选中
                    self._checkedNode(data, isChecked);
                    //更新所有的渲染器状态
                    self._updateItems(true);
                    //勾选完毕后派发事件
                    if(isChecked == FULL_CHECKED)
                    {
                        //触发勾选事件
                        self._fireEvent('nodeCheck', evt, data);
                    }
                    else
                    {
                        self._fireEvent('nodeUnCheck', evt, data);
                    }
                }
                else if('toolAdd' == domName)
                {
                    self._fireEvent('toolAddClick', evt, data);
                }
                else if('toolModify' == domName)
                {
                    self._fireEvent('toolModifyClick', evt, data);
                }
                else if('toolDelete' == domName)
                {
                    self._fireEvent('toolDeleteClick', evt, data);
                }
                //处理单击和双击事件
                else
                {
                    if(0 == self._nodeClickTimer)
                    {
                        //设置定时器，300毫秒内点击两次派发双击事件，否则派发单击
                        self._nodeClickTimer = setInterval(function(){
                            clearInterval(self._nodeClickTimer);
                            self._nodeClickTimer = 0;
                            if(self._nodeClickCount > 1)
                            {
                                self._fireEvent('nodeDClick', evt, data);
                            }
                            else
                            {
                                //如果为单选,且点了叶子节点,则将此节点加入选中数据中
                                if (!self.options.multi && (!data.children || data.children.length < 1)) {
                                    //先清空
                                    for(var key in self.options.selectedItems){
                                        self._checkedNode(self.options.selectedItems[key], 0);
                                    }
                                    self.options.selectedItems = {};
                                    self._checkedNode(data, 2);
                                }
                                self._fireEvent('nodeClick', evt, data);
                            }
                            self._nodeClickCount = 0;
                        }, 300);
                    }
                    self._nodeClickCount++;
                }
                //触发选中操作
                data[keySelected] = true;
                if(self.options.selectedNode != data){
                    if(self.options.selectedNode){
                        self.options.selectedNode[keySelected] = false;
                    }
                    self.options.selectedNode = data;
                    self._updateItems(true);
                    self._fireEvent('change', evt, data);
                }
            });
        },
        _nodeClickTimer : 0,
        _nodeClickCount : 0,
        _fireEvent : function(evtName, evt, data)
        {
            this._trigger(evtName, evt.target, data);
            //调用已注册的回调函数
            if(!$.isNull(this.handlers) && !$.isNull(this.handlers[evtName]))
            {
                this.handlers[evtName].call(this.treeEl, evt, data);
            }
        },

        //为树节点添加拖动事件
        _addNodeDragEvent : function()
        {
            var self = this,
                options = self.options,
                style = options.style,
                nodeAccept = options.nodeAccept == undefined ? '' : options.nodeAccept,
                treeEl = self.treeEl;

            treeEl.children('.' + style.treenodeClass).draggable({
                appendTo: 'body',
                opacity: 1.0,
                cursorAt: {left : 0, top : 0},
                start : function(evt, ui)
                {
                    var target = $(evt.target),
                        data = {};
                    if(!target.hasClass(style.treenodeClass))
                    {
                        target = target.parent();
                    }
                    data = target.data('data');
                    self._fireEvent('nodeDrag', evt, data);
                },
                //不使用clone,dom元素需要剔除
                helper : function(event)
                {
                    var dragDiv = $("<div></div>").addClass(style.treenodeClass),
                        target = event.target,
                        treeNode = $(target),
                        children,
                        child;

                    //需要修正事件当前的对象
                    if(!treeNode.hasClass(style.treenodeClass))
                    {
                        treeNode = treeNode.parent();
                    }
                    children = treeNode.children();
                    for(var i = 0; i < children.length; i++)
                    {
                        child = $(children[i]);
                        if(child.is(":visible")&&
                            (child.attr('name') == 'iconDom'
                            ||child.attr('name') == 'textDom'))
                        {
                            child = child.clone().appendTo(dragDiv);
                        }
                    }
                    //构造拖拽的div
                    return dragDiv;
                }
            });

            //设置接收拖拽的DOM节点事件处理
            if(nodeAccept)
            {
                nodeAccept.droppable({
                    drop : function(event, ui)
                    {
                        var dragData = ui.draggable.data('data');
                    }
                });
            }
        },

        /**
         * 展开当前指定的节点
         * */
        _expandNode : function (data, isExpand)
        {
            //重新给data赋值
            data[keyExpanded] = isExpand;
            if(data['hasChildren'] == false)
            {
                return;
            }

            var children = data[keyChildren],
                len = children.length,
                cellIndex,
                nodeIndex,
                dataCell,
                flag = 1;

            cellIndex = data['cellIndex'];
            nodeIndex = data['nodeIndex'];
            dataCell = this.options.pc.cells[cellIndex];
            //如果是展开操作，添加子节点到itemGroup中
            if(isExpand)
            {
                //将当前展开的数组插入到items中，平铺数据
                //节点之前的数组，重新拼接
                var before = dataCell.data.slice(0, nodeIndex + 1);
                var after = dataCell.data.slice(nodeIndex + 1, dataCell.data.length);
                dataCell.data = before.concat(children, after);
            }
            //如果是收起操作，需要收起所有小于当前层级的节点
            //保证操作的元素是最小的
            else
            {
                //删除掉不需要显示的数据
                flag = -1;
                var currentNode,
                    startIndex = nodeIndex + 1,
                    itemLen =  dataCell.data.length,
                    findSameLvlNode = false;

                //找到下一个与自己层级一致的节点，将中间部分删除
                for(var i = nodeIndex + 1; i < itemLen; i++)
                {
                    currentNode = dataCell.data[i];
                    //遇到和自己层级一样，或者是高于自己层级的，跳出
                    if(data[keyLevel] >= currentNode[keyLevel])
                    {
                        len = i - startIndex;
                        dataCell.data.splice(startIndex, len);
                        findSameLvlNode = true;
                        break;
                    }
                    //所有被收起的子节点，都呈现可展开状态
                    currentNode[keyExpanded] = false;
                }
                //最后一个节点的情况单独处理
                if(!findSameLvlNode)
                {
                    len = itemLen - startIndex;
                    dataCell.data.splice(startIndex, itemLen - startIndex);
                }
            }
            //修正全局的最大高度
            var tempH = parseInt(this.bgEl.css('height')) + len * this.options.itemHeight * flag;
            this.bgEl.css('height', tempH + "px");
        },
        //待刷新的列表
        _preUpdateCount : 0,
        /***
         * 更新当前所有的渲染器
         * 默认的触发条件是在有滚动操作时，有渲染器的Y坐标处于失效位置时
         *
         * 优化处理：
         * 在需要更新的节点数量大于阈值或定时器超时后，调用更新
         * @params validateNow (true/false) 是否强制更新当前已呈现的节点,在调用展开或选中节点时需要调用
         *
         * */
        _updateItems : function(validateNow)
        {
            var self = this,
                i = 0,
                //当前的滚动条位置
                y = self.treeEl[0].scrollTop,
                //当前视窗的高度
                h = parseInt(self.treeEl.css("height")),
                //所有渲染器的个数
                itemLen = self.options.pc.items.length,
                cellsLen = self.options.pc.cells.length,
                isValidateNow = validateNow == undefined ? false : validateNow,
                offsetHeight = 0,
                topThreshold = y - this.options.itemHeight,
                bottomThreshold = y + h + this.options.itemHeight,
                item;

            //先判断是否需要更新itemRenderer
            if((self.options.pc.topYPos < topThreshold || self.options.pc.bottomYPos > bottomThreshold) || isValidateNow == true)
            {
                var yy,
                    currentYPos = self.options.pc.topYPos,
                    //默认使用最上方元素的cellIndex
                    cellIndex = self.options.pc.topItem.cellIndex,
                    //默认使用最上方元素的nodeIndex
                    nodeIndex = self.options.pc.topItem.nodeIndex,
                    cell = self.options.pc.cells[cellIndex],
                    needOptimizeHandle = false,
                    nodeData, bottomY, topY;

                self.options.maxNodeWidth = parseInt(self.treeEl.externalWidth());
                //先在这里判断是否需要进行越界处理,避免在展开、收起最下方节点的时候出现问题
                if(isValidateNow)
                {

                    var indexInfo = 0,
                        overflowCount = 0;
                    //如果当前显示的所有节点小于渲染器数量，不用做处理
                    var bgH = parseInt(self.bgEl.css('height'));
                    if(bgH / self.options.itemHeight > itemLen)
                    {
                        indexInfo = self._calcDataCellIndex(cellIndex, nodeIndex, itemLen - 1);
                        overflowCount = indexInfo.overflowCount;
                        //判断是否越界
                        if(overflowCount > 0)
                        {
                            //如果越界
                            indexInfo = self._calcDataCellIndex(indexInfo.cellIndex, indexInfo.nodeIndex, -(itemLen - 1));
                            self.options.pc.topItem.cellIndex = cellIndex = indexInfo.cellIndex;
                            self.options.pc.topItem.nodeIndex = nodeIndex = indexInfo.nodeIndex;
                            cell = this.options.pc.cells[indexInfo.cellIndex];
                            //需要修正的高度
                            offsetHeight = -overflowCount * this.options.itemHeight;
                            //如果当前顶部渲染器的Y坐标大于修正高度，才做修正
                            if(self.options.pc.topYPos > Math.abs(offsetHeight))
                            {
                                self.options.pc.topYPos += offsetHeight;
                                self.options.pc.bottomYPos += offsetHeight;
                            }
                            else
                            {
                                offsetHeight = 0;
                            }
                        }
                    }

                    for(i = 0; i < itemLen; i++)
                    {
                        item = self.options.pc.items[i];
                        yy = parseInt(item.ypos);
                        if(undefined != cell)
                        {
                            nodeData = self.options.pc.cells[cellIndex].data[nodeIndex];
                        }
                        else
                        {
                            nodeData = undefined;
                        }
                        if(self.options.pc.topItem.ypos == currentYPos)
                        {
                            item.preUpdateNode(nodeData, currentYPos, cellIndex, nodeIndex);
                        }
                        else
                        {
                            item.preUpdateNode(nodeData, currentYPos + offsetHeight, cellIndex, nodeIndex);
                        }
                        //允许使用空数据传递，空数据会使当前的item隐藏
                        item.updateNode(self.options, self);
                        nodeIndex++;
                        currentYPos += self.options.itemHeight;
                        if(cell && nodeIndex >= cell.data.length)
                        {
                            nodeIndex = 0;
                            cellIndex++;
                            cell = self.options.pc.cells[cellIndex];
                        }
                    }
                    self._preUpdateCount = 0;
                    //重新设置宽度
                    self._initNodesWidth(self);
                    return;
                }
                else
                {
                    //下移
                    if(y > self._lastYpos)
                    {
                        for(i = 0; i < itemLen; i++)
                        {
                            item = self.options.pc.items[i];
                            yy = parseInt(item.ypos);
                            if(yy >= topThreshold)break;
                            //放置在最下方
                            cellIndex =  self.options.pc.bottomItem.cellIndex;
                            nodeIndex = self.options.pc.bottomItem.nodeIndex;
                            cell = self.options.pc.cells[cellIndex];
                            //下移，nodeIndex需要自增
                            nodeIndex++;
                            if(nodeIndex >= cell.data.length)
                            {
                                nodeIndex = 0;
                                cellIndex++;
                                if(cellIndex >= cellsLen)break;
                            }
                            nodeData = self.options.pc.cells[cellIndex].data[nodeIndex];
                            bottomY = self.options.pc.bottomYPos + self.options.itemHeight;
                            item.preUpdateNode(nodeData, bottomY, cellIndex, nodeIndex);
                            self.options.pc.items.splice(i, 1);
                            self.options.pc.items.push(item);
                            --i;
                            //更新topYPos和bottomYPos位置
                            self.options.pc.bottomItem = item;
                            self.options.pc.bottomYPos = bottomY;
                            self.options.pc.topItem = self.options.pc.items[0];
                            self.options.pc.topYPos = parseInt(self.options.pc.topItem.ypos);
                            self._preUpdateCount++;
                        }
                    }
                    else if(y < self._lastYpos)
                    {
                        for(i = itemLen - 1; i >= 0; i--)
                        {
                            item = self.options.pc.items[i];
                            yy = parseInt(item.ypos);
                            if(yy <= bottomThreshold)break;

                            cellIndex = self.options.pc.topItem.cellIndex;
                            nodeIndex = self.options.pc.topItem.nodeIndex;
                            cell = self.options.pc.cells[cellIndex];
                            //上移，nodeIndex需要自减
                            nodeIndex--;
                            if(nodeIndex < 0)
                            {
                                cellIndex--;
                                if(cellIndex < 0)break;
                                nodeIndex = self.options.pc.cells[cellIndex].data.length - 1;
                            }
                            nodeData = self.options.pc.cells[cellIndex].data[nodeIndex];
                            topY = self.options.pc.topYPos - self.options.itemHeight;
                            item.preUpdateNode(nodeData, topY, cellIndex, nodeIndex);
                            self.options.pc.items.splice(i, 1);
                            self.options.pc.items.unshift(item);
                            ++i;
                            //更新位置
                            self.options.pc.topItem = item;
                            self.options.pc.topYPos = topY;
                            self.options.pc.bottomItem = self.options.pc.items[itemLen - 1];
                            self.options.pc.bottomYPos = parseInt(self.options.pc.bottomItem.ypos);
                            self._preUpdateCount++;
                        }
                    }
                    needOptimizeHandle = Math.abs(y - self._lastYpos) > 200;
                    self._lastYpos = y;
                }

                //超过指定时间或者超过最大更新数量
                if(self._preUpdateCount > 0)
                {
                    if(true == needOptimizeHandle)
                    {
                        if(false == self._preUpdateCountFlag){
                            self._preUpdateCountFlag = true;
                            self._preUpdateTimer = setInterval(function(){
                                self._preUpdateTimerCount++;
                                if(self._preUpdateTimerCount >= 3)
                                {
                                    self._preUpdateTimerCount = 0;
                                    self._preUpdateCount = 0;
                                    clearInterval(self._preUpdateTimer);
                                    self._preUpdateCountFlag = false;
                                    self._updateItems(true);
                                }
                            },100);
                        }

                        //判断条件中乘以的系数，和needOptimizeHandle中的赋值条件相关，如果上面是>500,这里建议使用5
                        if(self._preUpdateCount >= self.itemCount * 2)
                        {
                            self._preUpdateTimerCount = 0;
                            self._preUpdateCount = 0;
                            clearInterval(self._preUpdateTimer);
                            self._preUpdateCountFlag = false;
                            self._updateItems(true);
                        }
                    }
                    else
                    {
                        self._preUpdateCount = 0;
                        self._updateItems(true);
                    }
                }
            }
        },
        _lastYpos : 0,
        _preUpdateTimer : 0,
        _preUpdateTimerCount : 0,
        _preUpdateCountFlag : false,
        //修改子节点的属性
        _modifyChildrenProp : function (children, config)
        {
            var i = 0,
                self = this,
                node,
                key = "",
                len = children.length;
            for(i = 0; i < len; i++)
            {
                node = children[i];
                //覆盖同名称的属性
                for(key in config)
                {
                    node[key] = config[key];
                }
                if(node.hasOwnProperty(keyChildren))
                {
                    self._modifyChildrenProp(node[keyChildren], config);
                }
            }
        },
        /**
         * 根据下表和偏移量算出当前的数据子项
         * **/
        _calcDataCellIndex : function(cellIndex, nodeIndex, step)
        {
            var cell = this.options.pc.cells[cellIndex],
                result = {} ,
                i = 0,
                cellLen = this.options.pc.cells.length,
                count = Math.abs(step),
                overflowCount = 0;

            if(step < 0)
            {
                for(i = 0; i < count; i++)
                {
                    --nodeIndex;
                    if(nodeIndex < 0)
                    {
                        cellIndex--;
                        cell = this.options.pc.cells[cellIndex];
                        if(cell)
                        {
                            nodeIndex = cell.data.length - 1;
                        }
                    }
                    if(cell == undefined)
                    {
                        ++overflowCount;
                    }
                }
            }
            else
            {
                for(i = 0; i < count; i++)
                {
                    ++nodeIndex;
                    if(cell && nodeIndex >= cell.data.length)
                    {
                        nodeIndex = 0;
                        cellIndex++;
                        cell = this.options.pc.cells[cellIndex];
                    }
                    if(!cell)
                    {
                        ++overflowCount;
                    }
                }
            }

            if(nodeIndex < 0){
                nodeIndex = 0;
            }
            if(cellIndex < 0){
                cellIndex = 0;
            }
            else if(cellIndex >= cellLen)
            {
                cellIndex = cellLen - 1;
                cell = this.options.pc.cells[cellLen - 1];
                nodeIndex = cell.data.length - 1;
            }
            result.cellIndex = cellIndex;
            result.nodeIndex = nodeIndex;
            result.overflowCount = overflowCount;
            return result;
        },

        /**
         * 初始化绘制树节点
         * **/
        _draw : function()
        {
            //获取当前容器的高度
            var h = parseInt(this.treeEl.css("height"));
            if(isNaN(h) || 0 == h)
            {
                this.needRedraw = true;
                return;
            }

            var self = this,
                rootLen = self.options.data.length,
                //每屏能够呈现的节点数量
                pageCount = Math.ceil(h / this.options.itemHeight),
                //计算出需要多少个渲染器
                itemCount = pageCount * 2;

            self.treeEl.children().remove();
            self.itemCount = itemCount;
            self.options.pc.items = new Array();
            //更新是否显示icon
            self.options.icon = self.options.icon == undefined ? true : self.options.icon;
            //是否显示checkBox
            self.options.multi = self.options.multi == undefined ? true : self.options.multi;

            //创建用于占位的div
            if(self.options.expand)
            {
                self.bgEl.css('height', self.options.pc.maxBgHeight + "px");
            }
            else
            {
                self.bgEl.css('height', rootLen * self.options.itemHeight + "px");
            }
            self.treeEl.append(self.bgEl);

            //在这里创建子项
            var el, val, cell, cellIndex = 0, nodeIndex = 0, ypos = 0;

            //初始化itemRenderer
            //只初始化根节点数据
            for(var i = 0; i < itemCount; i++)
            {
                el = $("<div />");
                ypos = i * this.options.itemHeight;
                cell = this.options.pc.cells[cellIndex];
                if(!cell)
                {
                    //允许创建空数据传递，使用空数据渲染的节点将隐藏
                    val = undefined;
                    cellIndex = nodeIndex = -1;
                }
                else
                {
                    //当前节点的数据
                    val = cell.data[nodeIndex];
                }

                //添加到组件中
                self.treeEl.append(el);
                var item = new itemRenderer(el, this.options);
                item.preUpdateNode(val, ypos, cellIndex, nodeIndex);
                item.updateNode(self.options, self);
                //加入到集合中管理
                self.options.pc.items.push(item);

                //更换数据块
                nodeIndex++;
                if(cell && nodeIndex >= cell.data.length)
                {
                    cellIndex++;
                    nodeIndex = 0;
                }
            }
            //更新最上方和最下方节点信息
            self.options.pc.topItem = self.options.pc.items[0];
            self.options.pc.topYPos = parseInt(self.options.pc.topItem.el.css("top"));
            self.options.pc.bottomItem = self.options.pc.items[self.options.pc.items.length - 1];
            self.options.pc.bottomYPos = parseInt(self.options.pc.bottomItem.el.css("top"));

            //拖拽事件直接添加到子节点上，因为子节点常驻内存，不会释放
            if(self.options.nodeDraggable)
            {
                self._addNodeDragEvent();
            }
            //滚动时更新渲染器
            self.treeEl.scroll(function(){
                self._updateItems();
            });
            //如果滚动条的位置和topItem差别过大，需要做优化
            //要考虑快速滚动和指定滚动位置的情况
            self._updateItems();
        },

        /**
         * 渲染组件
         * **/
        _render : function(id)
        {
            if (!id || this.rendered) {
                return;
            }
            //renderEl指向renderTo的DOM元素
            this.renderEl = $('#'+id);
            if(!this.renderEl)
            {
                this._createRenderEl();
            }

            this.renderEl.append(this.rootDiv);
            if(this.searchField)
            {
                this.rootDiv.append(this.searchRendererDiv);
                this.searchField.render(this.searchRendererDiv.attr('id'));
            }
            this.treeRootDiv.append(this.treeEl).appendTo(this.rootDiv);
            this.rendered = true;
            this.updateOptions(this.options);
        },
        /**
         * 布局发生变更时触发
         * */
        _doLayout : function()
        {
            if(undefined != this.needRedraw
                && true == this.needRedraw)
            {
                this.needRedraw = false;
                this._draw();
            }
        },
        clear : function()
        {
            this.setData([]);
        },
        /**
         * 删除所有的子节点，清空数据
         * 调用setData时会默认调用
         * */
        _clearAll : function()
        {
            this.options.pc.cells.length = 0;
            this.options.pc.itemsMap = new Object();
            this.options.pc.leafItemsMap = new Object();
            this.options.pc.filterItemsMap = new Object();
            this.options.pc.bottomYPos = this.options.pc.topYPos = 0;
            this.options.pc.topItem = new Object();
            this.options.pc.bottomItem = new Object();
            this.options.pc.totalNodeCount = 0;
            this.options.pc.maxBgHeight = 0;
            this.options.pc.items.length = 0;
            this.options.data.length = 0;
            this.options.orgData.length = 0;
            this.options.selectedItems = new Object();
            this.options.maxLevel = 0;
            this.options.maxNodeWidth = 0;
            this.options.selectedNode = null;
            this.treeEl.children().remove();
        },
        //刷新数据时，需要保存一部分信息
        _clearUpdateData : function()
        {
            this.options.pc.cells.length = 0;
            this.options.pc.bottomYPos = this.options.pc.topYPos = 0;
            this.options.pc.topItem = {};
            this.options.pc.bottomItem = {};
            this.options.pc.totalNodeCount = 0;
            this.options.pc.maxBgHeight = 0;
            this.options.pc.items.length = 0;
            this.options.data = [];
            this.options.maxLevel = 0;
            this.options.maxNodeWidth = 0;
            this.options.pc.updateItemsMap = new Object();
            this.options.pc.updateLeafItemsMap = new Object();
            this.treeEl.children().remove();
        },
        /**
         * 为数据建立索引
         * 建立父节点的ID
         * 建立完整的到达根路径地址
         * 索引key为根节点ID到最底层节点ID
         * */
        _createIndex : function(allMap, leafMap, list, parent, _level, cell, _isRoot, _nodeIndex, _rootKey, _expandIcoInfo)
        {
            var //当前节点
                node,
                //从父节点到当前节点的路径
                pathKey = "",
                //当前数组的长度
                len = list.length,
                //是否是根节点标识，如果是根节点，在这里进行数据分块
                isRoot = _isRoot == undefined ? true : _isRoot,
                //当前节点层级
                level = _level || 0,
                rootKey = _rootKey || 'NA',
                currentNodeChecked = NONE_CHECKED,
                cellIndex = 0,
                nodeIndex = _nodeIndex || 0,
                i = 0;

            if(level > this.options.maxLevel)
            {
                this.options.pc.maxNodeLevel = this.options.maxLevel = level;
            }

            for(i = 0; i < len; i++)
            {
                node = list[i];
                //判断node是否有效
                if(node.hasOwnProperty(keyNeedRemove) && node[keyNeedRemove] == true)
                {
                    node[keyChecked] = NONE_CHECKED;
                    this._updateParentCheckedState(node);
                    delete list[i];
                    list.splice(i, 1);
                    delete this.options.pc.itemsMap[node[keyPath]];
                    delete this.options.pc.leafItemsMap[node[keyPath]];
                    --len;
                    --i;
                    continue;
                }

                //使用nodeIndex判断，避免出现--i导致判断失效
                if(isRoot
                    && (nodeIndex == 0 || nodeIndex >= this.options.pc.cellCount - 1))
                {
                    cell = new dataCell();
                    cell.cellIndex = cellIndex;
                    this.options.pc.cells[cellIndex] = cell;
                    ++cellIndex;
                    nodeIndex = 0;
                }

                //拼接一个唯一的ID
                node[keyId] = node[this.options.labelField] + '_' + node[this.options.valueField];
                //是否为根节点，如果只有一层数据，根节点标识优先
                node[keyRootNode] = isRoot;
                //记录在数据中的原始下标位置
                node[keyNodeIndex] = nodeIndex;
                //当前节点的级别
                node[keyLevel] = level;
                //是否展开标识,优先使用数据中的标识，再使用全局标识
                node[keyExpanded] = this.options.expand;
                //是否选中标识
                currentNodeChecked = node[keyChecked] = node[keyChecked] == undefined ? NONE_CHECKED : node[keyChecked];
                //在相同父节点的同级别节点中的个数
                node[keySameLvlNodeCount] = len;
                //pathKey为数组的下标
                pathKey = node[keyId];
                //记录当前是否为最后一个节点
                node[keyIsLastNode] = i == len -1;
                //按照层级记录所有父节点的位置信息
                node[keyParentExpandIcoInfo] = _expandIcoInfo ? _expandIcoInfo.slice(0) : [];
                node[keyParentExpandIcoInfo].push(node[keyIsLastNode]);

                //记录自己的父节点ID
                if(parent != undefined)
                {
                    node[keyParentKey] = parent[keyPath];
                    pathKey = parent[keyPath] + '#' + pathKey;
                    //存储keynode的索引
                    parent[keyChildrenIndexs][node[keyId]] = node;
                }

                //存放唯一标识
                node[keyPath] = pathKey;
                if(isRoot)
                {
                    rootKey = node[keyPath];
                }
                node[keyRootKey] = rootKey;

                //itemsMap中存放的key为node的完整标识，可以直接定位到node节点
                allMap[node[keyPath]] = node;
                //cell里面存放平铺结构，需要在递归之前push
                var lastIndex = 0;
                //子节点不展开的时候，cell为null
                if(cell)
                {
                    cell.data.push(node);
                    lastIndex = cell.data.length - 1;
                    ++nodeIndex;
                }

                if(node.hasOwnProperty(keyChildren))
                {
                    node[keyChildrenIndexs] = {};
                    node[keyLeafNode] = false;
                    var orgChildLen = this.options.pc.itemsMap[node[keyPath]][keyChildren].length;
                    var beforeDeleteLen  = node[keyChildren].length;
                    //递归子节点
                    nodeIndex = this._createIndex(allMap, leafMap,
                                                    node[keyChildren], node,
                                                    level + 1, node[keyExpanded] ? cell : undefined,
                                                    false, nodeIndex, rootKey, node[keyParentExpandIcoInfo]);

                    var afterDeleteLen = node[keyChildren].length;

                    //如果node下的节点全是无效节点，需要删除自身
                    if(afterDeleteLen == 0 && orgChildLen - beforeDeleteLen == 0)
                    {
                        node[keyNeedRemove] = true;
                        if(cell)
                        {
                            cell.data.splice(lastIndex, 1);
                        }
                        --i;
                        continue;
                    }
                }
                else
                {
                    leafMap[node[keyPath]] = node;
                    node[keyLeafNode] = true;
                    //只保存叶子节点的勾选状态
                    if(node[keyChecked] == FULL_CHECKED)
                    {
                        this.options.selectedItems[node[keyPath]] = node;
                    }
                    //在这里处理过滤后的选中问题，只处理出现变化的数据
                    if(true == node[keyNeedUpdateCheckedState])
                    {
                        this._updateParentCheckedState(node);
                    }
                }
                node[keyNeedUpdateCheckedState] = false;
                //当前需要呈现出来的节点数量，影响背景DIV的高度
                this.options.pc.totalNodeCount++;
            }
            return nodeIndex;
        },

        /**
         * 刷新数据，在过滤字符串时调用
         * **/
        _updateData : function(data)
        {
            this._clearUpdateData();
            this.options.data = data;
            this._createIndex(this.options.pc.updateItemsMap, this.options.pc.updateLeafItemsMap, this.options.data);
            this.options.pc.maxBgHeight = this.options.pc.totalNodeCount * this.options.itemHeight;
            this._draw();
            this._updateItems(true);
        },

        filter : function(str)
        {
            var orgLeafData = this._filterItemsByString(str),
                //还原到树状结构的数据
                filterData = [];

            if(!orgLeafData)return;
            //如果能检索到数据
            if(orgLeafData.length  > 0)
            {
                this.options.pc.isFilterMode = true;
                filterData = this._rebuildTreeData(orgLeafData);
                this._updateData(filterData);
            }
            else
            {
                this.options.pc.isFilterMode = false;
                this._clearUpdateData();
            }
        },
        /***
         * 根据传入的字符串过滤数据源
         * 过滤只影响呈现，不影响选中的结果
         * */
        _filterItemsByString : function(str)
        {
            var key = "",
                value,
                //根据配置决定使用哪个map作为数据源,平铺的数据结构
                targetSource = {},
                //存储查询到的节点
                orgLeafData = [];

            //每次过滤时，清除上一次的过滤记录
            this.options.pc.filterItemsMap = {};
            //字符串为空的时候，使用原始数据渲染
            if(str == "")
            {
                this.options.pc.isFilterMode = false;
                this._updateData(this.options.orgData);
                return;
            }

            this.options.expand = true;
            //只查找子节点数据
            targetSource = this.options.pc.leafItemsMap;
			//[Begin]: add for DTS2014040909378
            //搜索不区分大小写
            str = str.toLowerCase();
            for(key in targetSource)
            {
                value = targetSource[key][this.options.labelField].toLowerCase();
                if(value.indexOf(str) != -1)
                {
                    //只放置叶子节点
                    orgLeafData.push(targetSource[key]);
                }
            }
			//[End]: add for DTS2014040909378
            return orgLeafData;
        },

        _copyNode : function(node)
        {
            var result = $.objCopy(node);
            if(node.data){
                result.data = $.objClone(node.data);
            }
            //需要重构几个属性
            result[keySelectedMap] = {};
            result[keyHalfSelectedMap] = {};
            result[keySelectedCount] = 0;
            result[keyHalfSelectedCount] = 0;
            return result;
        },

        /***
         * 内部方法
         * 通过叶子节点还原整个树状结构
         * orgData : array 入参是根节点与子节点混合的结构,数据可以无序
         * **/
        _rebuildTreeData : function(orgData, _itemsMap)
        {
            var parentNode,
                self = this,
                result = [],
                len = orgData.length,
                itemsMap = _itemsMap || self.options.pc.filterItemsMap;

            if(is(orgData, 'array'))
            {
                for(var i = 0; i < len; i++)
                {
                    rebuildSingleNode(orgData[i]);
                }
            }
            else if(is(orgData, 'object'))
            {
                for(var key in orgData)
                {
                    rebuildSingleNode(orgData[key]);
                }
            }

            function rebuildSingleNode(node)
            {
                if(node == undefined)return;
                /**
                 * 三种情况，叶子节点和非叶子节点,根节点
                 * **/
                //如果是根节点
                if(node[keyRootNode])
                {
                    if(itemsMap[node[keyPath]])
                    {
                        node = itemsMap[node[keyPath]];
                    }
                    //只有一层数据的时候
                    else
                    {
                        node = self._copyNode(node);
                        itemsMap[node[keyPath]] = node;
                    }
                    //只push根节点
                    result.push(node);
                }
                //如果是叶子节点
                else
                {
                    //只有是子节点时需要重构，如果是具有父节点和子节点的情况，node肯定是重构过的
                    if(node[keyLeafNode])
                    {
                        //copy的对象不会有object和function的属性,所以要重建children属性
                        var d;
                        if(node.data){
                            d = $.objClone(node.data);
                        }
                        node = itemsMap[node[keyPath]] = $.objCopy(node);
                        if(d){
                            node.data = d;
                        }
                    }
                    parentNode = self.options.pc.itemsMap[node[keyParentKey]];
                    //如果已经存在
                    if(itemsMap[parentNode[keyPath]])
                    {
                        parentNode = itemsMap[parentNode[keyPath]];
                        self._pushNodeToParent(node, parentNode);

                    }
                    //不存在的话构建
                    else
                    {
                        parentNode = self._copyNode(parentNode);
                        itemsMap[parentNode[keyPath]] = parentNode;
                        self._pushNodeToParent(node, parentNode);
                        rebuildSingleNode(parentNode);
                    }
                }
             }

            return result;
        },

        /***
         * 在过滤数据时使用
         * **/
        _pushNodeToParent : function(node, parent)
        {
            var nodeIndex = node[keyPath];
            if(!parent[keyChildren])
            {
                parent[keyChildren] = [];
            }
            parent[keyChildren].push(node);
            if(FULL_CHECKED == node[keyChecked])
            {
                parent[keySelectedMap][nodeIndex] = nodeIndex;
                parent[keySelectedCount]++;
            }
            else if(HALF_CHECKED == node[keyChecked])
            {
                parent[keyHalfSelectedMap][nodeIndex] = nodeIndex;
                parent[keyHalfSelectedCount]++;
            }
            this._calcCheckedState(parent);
        },

        /**
         * 销毁组件
         * */
        _destoryWidget : function()
        {
            if (this.rootDiv) {
                this.rootDiv.remove();
            }
        },

        _setHeightAndRedraw : function(val)
        {
            this._setHeight(val);
            this._draw();
        },

        /**
         * 判断当前是否需要重绘所有节点
         * **/
        autoReDraw : function(){
            var self = this,
                options = self.options,
                pc = options.pc,
                items = pc.items,
                len = items.length;

            var itemsHeight = len * options.itemHeight,
                treeHeight = parseInt(this.treeEl.css("height"));

            if(itemsHeight < treeHeight * 2){
                self._draw();
            }
        },

        /**
         * @private
         * @description 返回组件高度
         */
        _getHeight: function(){
            return this.rootDiv.externalHeight();
        },

        /**
         * @private
         * @description 返回组件宽度
         */
        _getWidth: function(){
            return this.rootDiv.externalWidth();
        },

        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 宽度
         */
        _setWidth: function(width) {
            this.rootDiv.externalWidth(width);
            this.treeEl.externalWidth(width);
        },

        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 高度
         */
        _setHeight: function(height) {

            if (typeof height === 'string' && /\d+%/.test(height)){
                var r = parseInt(height, 10);
                height = this.rootDiv.parent().height() * r / 100;
            }
            this.rootDiv.externalHeight(height);
            var fixHeight = 0;
            if(this.searchRendererDiv)
            {
                fixHeight = parseInt($(this.searchRendererDiv).css('height')) + 20;
            }
            fixHeight = height - fixHeight;
            this.treeRootDiv.css('height', fixHeight);
            this.treeEl.css('height', fixHeight);
        },
        /**
         * @private
         * @description 设置组件宽度、高度
         * @param {Number/String} width 宽度
         * @param {Number/String} height 高度
         */
        _setWH: function(width, height) {
            this._setWidth(width);
            this._setHeight(height);
            if(undefined != this.needRedraw
                && true == this.needRedraw)
            {
                this.needRedraw = false;
                this._draw();
            }
        },
        _addListener : function(evtName, callBack)
        {
            if(this.eventNames[evtName])
            {
                this.handlers[evtName] = callBack;
            }
        },

        _removeListener : function(evtName)
        {
            delete this.handlers[evtName];
        },
        //移除掉所有的监听回调
        _removeAllListener : function()
        {
            for(var key in this.handlers)
            {
                delete this.handlers[key];
            }
        },
        /**
         * @private
         * @description 重新设置可见区域node的宽度
         * @param {Object} self 树组件对象
         */
        _initNodesWidth : function(self){
            var tEl, 
                    tScrollWidth = 22,
                    tPaddingWidth = 5,
                    tempWidth = 0, 
                    vTempWidth = 0, 
                    oWidth, 
                    oHeight,
                    emptyEl;
            for(var k = 0; k < self.options.pc.items.length; k++){
                tEl = self.options.pc.items[k].el;
                if("block" != $(tEl).css("display")){
                    continue;
                }
                tempWidth = 0;
                $.each($(tEl).children(), function(index, cEl){
                    if("block" === $(cEl).css("display") || $(cEl).hasClass(self.options.style.treeTextClass)){
                        tempWidth += $(cEl).externalWidth();
                    }
                });
                if(tempWidth > vTempWidth){
                    vTempWidth = tempWidth;
                }
            }
            oWidth = self.treeEl.innerWidth();
            oHeight = self.treeEl.height();
            emptyEl = self.bgEl.height();
            //有竖向滚动条时
            if(emptyEl > oHeight){
                if(vTempWidth < (oWidth - tScrollWidth)){
                    vTempWidth = oWidth - tScrollWidth; 
                }
            }else{
                if(vTempWidth < oWidth - tPaddingWidth){
                    vTempWidth = oWidth - tPaddingWidth;
                }
            }
            for(var k = 0; k < self.options.pc.items.length; k++){
                tEl = self.options.pc.items[k].el;
                $(tEl).width(vTempWidth);
            }
        }
     });
    Sweet.tree.OptimizeTree = $.sweet.optimizeTree;
})(jQuery);
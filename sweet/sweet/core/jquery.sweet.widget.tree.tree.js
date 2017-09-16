/**
 * @fileOverview
 *
 * <pre>
 * 树组件
 * 2013/2/18
 * &lt;a href=&quot;www.huawei.com&quot;&gt;http://www.huawei.com&lt;/a&gt;
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved
 * </pre>
 * @version 1.0
 */
(function($, undefined) {

    var treenodeClass = "sweet-tree-node",
            treenodeSelectClass = "sweet-tree-node-select",
            treeNodeExpandClass = "sweet-tree-expand",
            treeNodeCollClass = "sweet-tree-coll",
            treeNodeCheckedClass = "sweet-tree-check",
            treeNodeAllcheckedClass = "sweet-tree-full-check",
            treeNodeUnCheckClass = "sweet-tree-uncheck",
            treeLeafNodeClass = "sweet-tree-leaf-node",
            treeNodeSelectClass = "sweet-tree-action-node",
            treeListUlClass = "sweet-tree-list-ul",
            treeNodeLineClass = "sweet-tree-node-line",
            treeLeafIocClass = "sweet-tree-leaf-ioc",
            treeLeafUserDefine = "sweet-tree-leaf-userDefine",
            treeNodeIocClass = "sweet-tree-node-ioc",
            treeLeafDimensionClass = "sweet-tree-leaf-dimension",
            treeLeafCompClass = "sweet-tree-leaf-comp",
            treeLeafIndexClass = "sweet-tree-leaf-index",
            treeTitleClass = "sweet-tree-title",
            treeEditableClass = "sweet-tree-editable",
            treeStateClass = "sweet-tree-state",
            treePrefix = "sweet-tree-tree-",
            treeSearchClass = "sweet-tree-search-div",
            treeLoadMore = "tree-load-more",
            treeRootUlClass = "sweet-tree-list-root",
            treeRootUl1Class = "sweet-tree-list-root1",
            itemDraggingClass = "sweet-tree-item-dragging",
            defaultPaddingDivDisabledClass = "sweet-tree-tree-disabled ",
            timerSuffix = "sweet-tree-content-timer", // 内容区定时器名称
            treeDrag = "sweet-tree-item-dragging ui-draggable-dragging",
            uuid = 1000,
            loadDataRows = 100, // 分批加载每次加载条数
            selectmap = "selectMap";

    $.widget("sweet.widgetTreeTree", $.sweet.widgetTree, /** @lends Sweet.tree.Tree.prototype */{
        version: "1.0",
        sweetWidgetName: "[widget-tree-tree]:",
        eventNames: /** @lends Sweet.tree.Tree.prototype */{
            /**
             * @event
             * @description 树节点单击事件,一般参数为(evt, data)
             */
            nodeClick: "树节点单击事件",
            /**
             * @event
             * @description 树节点双击事件,一般参数为(evt, data)
             */
            nodeDClick: "树节点双击事件",
            /**
             * @event
             * @description 树节点展开事件,一般参数为(evt, data)
             */
            nodeExpand: "树节点展开事件",
            /**
             * @event
             * @description 树节点的拖拽事件,一般参数为(evt, data)
             */
            nodeDrag: "树节点的拖拽事件",
            /**
             * @event
             * @description 树节点CheckBox选中事件,一般参数为(evt, data)
             */
            nodeCheck: "树节点CheckBox选中事件",
            /**
             * @event
             * @description 树节点CheckBox反选事件,一般参数为(evt, data)
             */
            nodeUnCheck: "树节点CheckBox反选事件",
            /**
             * @event
             * @description 搜索节点事件,一般参数为(evt, data)
             */
            search: "搜索节点事件",
            /**
             * @event
             * @description 切换树节点事件,一般参数为(evt, data)
             */
            change: "切换树节点事件",
            /**
             * @event
             * @description 调用完setData方法后事件,一般参数为(evt, data)
             */
            afterSetData: "调用完setData方法后事件",
            /**
             * @event
             * @description setValue执行后触发,一般参数为(evt, data)
             */
            afterSetValue: "setValue执行后触发",
            /**
             * @event
             * @description 树节点编辑事件,一般参数为(evt, data)
             */
            nodeEdit: "树节点编辑事件",
            /**
             * @event
             * @description 点击checkBox(未选中,半选)之前的事件,一般参数为(evt, data)
             */
            beforeCheckboxClick: "点击checkBox(未选中,半选)之前的事件"
        },
        options: /** @lends Sweet.tree.Tree.prototype */{
            /**
             * 基础数据
             * @type Object
             * @default null
             */
            data: null,
            /**
             * 是否多选
             * @type Boolean
             * @default false
             */
            multi: false,
            /**
             * 是否显示树节点的图标
             * @type Boolean
             * @default false
             */
            icon: false,
            /**
             * 树节点是否可以拖动
             * @type Boolean
             * @default false
             */
            nodeDraggable: false,
            /**
             * 接受树节点的对象
             * @type Object
             * @default null
             */
            nodeAccept: null,
            /**
             * 是否展开
             * @type boolean
             * @default false
             */
            expand: false,
            /**
             * 是否延迟加载数据
             * @type boolean
             * @default false
             */
            lazyLoad: false,
            /**
             * 延迟加载数据条数
             * @type Number
             * @default false
             */
            limit: 20,
            /**
             * 是否使用后台延迟加载数据
             * @type boolean
             * @default false
             */
            backEndLoad: false,
            /**
             * 是否显示搜索框
             * @type boolean
             * @default false
             */
            search: false,
            /**
             * 是否搜索目录，默认只搜索树的叶子节点，当searchDir：true时对目录进行搜索
             * @type boolean
             * @default false
             */
            searchDir: false,
            /**
             * 当search为true时，出现的搜索框中的提示文字
             * @type string
             * @default Sweet.core.i18n.tree.search("search"/"搜索")
             */
            searchEmptyText: Sweet.core.i18n.tree.search,
            /**
             * 树的默认最大高度
             * @type Number
             * @default false
             */
            maxHeight: 0,
            /**
             * 加载数据
             * @type {Object}
             * @default null
             */
            store: null,
            /**
             * 是否是后台搜索
             * @type {boolean}
             * @default false
             */
            remote: false,
            /**
             * 是否禁用list组件
             * @type {boolean}
             * @default false
             */
            disabled: false,
            /**
             * 返回数据是否带有父节点数据，默认值是false
             * 如果为true，在树的拖动、双击事件传入的数据包括父节点数据，为false，只传当前节点数据
             * @type {Boolean}
             * @default false
             */
            parent: false,
            /**
             * @description 可配置对呈现数据加工后再返回
             * @type {Function}
             */
            parentAllowNodeClick: false,
            /**
             * @description 允许单选树父节点有nodeClick事件
             * @default false
             */
            handleText: function(text) {
                return text;
            },
            /**
             * @description 可配置对呈现数据tip提示加工后再返回
             * @type {Function}
             */
            handleTitle: function(title) {
                return title;
            }
        },
        /**
         * @description 设置值
         * @param {Array} data 值，格式如[{text:'text1',value:'value1',data:'{"type": 2},...],
         * @param {Boolean} isAppend 是否是追加新的树节点
         *  children:[{text:'text11',value:'valuw11','data':''}]},...]
         */
        setData: function(data, isAppend, _isFilterSetData) {
            var me = this,
                    options = me.options;
            isAppend = isAppend || false;
            _isFilterSetData = _isFilterSetData || false;
            me.afterSetData = false;
            options.data = $.objClone(data);
            var tempData = $.objClone(data);
            //data 如果不是数组，转化成数组
            if (!$.isArray(tempData)) {
                tempData = [tempData];
            }
            if (!isAppend) {
                me.removeAllNode();
                me.data = tempData;
            } else {
                me.removeAllNode();
                if ($.isNull(me.data)) {
                    me.data = [];
                }
                //给追加数据data添加isSelect属性
                $.each(tempData, function(index, node) {
                    if ($.isNull(node.data)) {
                        node.data = {};
                    }
                    node.data.isSelect = 1;
                });
                //追加之前，判断数据是否存在
                me.data = me.data.concat(tempData);
                me.options.data = me.data;
            }
            me._initValue();

            if (!_isFilterSetData) {
                me._filterCache();
            }
        },
        /**
         * @description 返回树节点数据
         * @return {Array} 叶子节点对应的值,格式如[{text:'text1',value:'value1'},...]
         */
        getData: function() {
            var me = this;
            return me.data;
        },
        /**
         * @description 设置叶子节点处于选中状态
         * @param {Array} data 值，格式如[{text:'text1',value:'value1'},...]
         */
        setSelected: function(data) {
            var me = this,
                    li;
            //判断数据有效性
            if ($.isNull(data)) {
                return;
            }
            //定时器判断数据是否加载完成
            me.timerSetSelectedId = setInterval(function() {
                if (me.afterSetData) {
                    li = me.rootListEl.children("li");
                    $.each(li, function(index, nodeli) {
                        nodeli = $(nodeli);
                        // 清除之前选中的样式
                        nodeli.find("div").removeClass(treeNodeSelectClass);
                    });
                    //将data数据转化成数组
                    data = $.isArray(data) ? data : [data];
                    //根据数据设置节点选中
                    $.each(data, function(index, nodeData) {
                        me._leafNodeSelected(nodeData);
                    });
                    clearInterval(me.timerSetSelectedId);
                }
            }, 500);
        },
        /**
         * @description 删除所有树节点
         */
        removeAllNode: function() {
            var rootList = this.treeEl.children("ul");
            rootList.children().remove();
            rootList.data("children", []);
        },
        /**
         * @description 删除树节点
         * @param {Object} data 树节点的绑定的数据
         *  [{text:'text1',value:'value1',data:'',
         *  children:[{text:'text11',value:'valuw11','data':''}]},...]
         */
        removeNode: function(data) {
            if ($.isNull(data)) {
                return;
            }
            var me = this, treeNode = null;
            $.each(data, function(index, nodeData) {
                treeNode = me._findNodeUI(nodeData);
                if ($.isNull(treeNode)) {
                    me.removeNode(nodeData.children);
                    return;
                }
                //如果节点不存在子节点删除当前节点
                if (!me._hasChild(treeNode)) {
                    me._removeNodeData(treeNode, treeNode.data("data"));
                    treeNode.empty();
                    treeNode.remove();
                }
                else {
                    //当节点存在子节点时先删除子节点
                    if (nodeData.children) {
                        me.removeNode(nodeData.children);
                        if (!me._hasChild(treeNode)) {
                            me._removeNodeData(treeNode, treeNode.data("data"));
                            treeNode.empty();
                            treeNode.remove();
                        }
                    }
                }
            });
        },
        /**
         * @description 获取所有的树节点的值
         * @param {Boolean} isSelect 是否过滤data中的isSelect属性
         * @return {Array} 叶子节点对应的值,格式如[{text:'text1',value:'value1'},...]
         */
        getAllNode: function(isSelect) {
            var me = this,
                    rootList = this.treeEl.children("ul").data("children"),
                    array = [];
            if ($.isNull(rootList)) {
                return [];
            }
            isSelect = isSelect || false;
            $.each(rootList, function(index, nodeEl) {
                if (nodeEl) {
                    array.push($.objClone(nodeEl.data("data")));
                }
            });
            if (!isSelect) {
                me._deleteAttrIsSelect(array);
            }
            return array;
        },
        /**
         * @description 设置所有selectMap数据为全选
         */
        getUnSelectedData: function() {
            var me = this,
                    rootList = this.treeEl.children("ul").data("children");
            if ($.isNull(rootList)) {
                return [];
            }
            me._removeAllSelectMapData();
            $.each(rootList, function(index, nodeEl) {
                if (nodeEl) {
                    //选中树节点，同时迭代联动选中其子孙节点
                    me._checkNode($(nodeEl));
                }
            });
        },
        /**
         * @description 为某个树节点添加子节点
         * @param {Array} data 子节点要展示的数据，格式如:
         *  [{text:'text1',value:'value1',data:'',
         *  children:[text:'text11',value:'valuw11',data:'']},...]
         * @param {Boolean} isSelect 列表节点是否被选中
         * @param {Object} treeNodeEl 当前节点，默认为根节点
         * @param {Number} depth 当前节点的深度，默认为0
         * @param {Boolean} isLastRoot 是否是最后一个根节点
         */
        addNode: function(data, isSelect, treeNodeEl, depth, isLastRoot) {
            if (!$.isArray(data)) {
                return;
            }
            var me = this,
                    blankWidth = 20, treeNodeLi,
                    loadCount = me.options.limit,
                    nodeioc = "",
                    treenodeEblow,
                    nodeblank,
                    liStr,
                    treecoll,
                    lazyIndex,
                    treeTextClass,
                    checkStr = "",
                    treeNode,
                    i,
                    lazyLoad = this.options.lazyLoad,
                    index, value,
                    expand = me.options.expand;
            isSelect = isSelect || false;
            depth = depth || 0;
            treeNodeEl = treeNodeEl || me.rootListEl;
            var listEls = treeNodeEl.data("children") || [];
            isLastRoot = isLastRoot || false;

            if (lazyLoad) {
                if (this.isgetData) {
                    this.lazyLoadDiv.data({"data": data, "clickCount": 0});
                    this.lazyLoadDiv.attr("title", Sweet.core.i18n.tree.clickLoad);
                    this.isgetData = false;
                }
                lazyIndex = loadCount * this.lazyLoadDiv.data("clickCount");
                //如果点击展开图标
                if (0 < depth) {
                    lazyIndex = 0;
                }
            } else {
                //设置查询起始位置
                lazyIndex = me.dataIndex;
            }
            $.each(data, function(index, value) {
                i = index + lazyIndex;
                if (lazyLoad) {
                    //设置点击加载按钮
                    if (me.data.length <= i) {
                        me.lazyLoadDiv.attr("title", Sweet.core.i18n.tree.clickLoadOver);
                        me._deleteNodeLine();
                    }
                    if (i + 1 > loadCount + lazyIndex) {
                        //将所有节点添加到rootListEl
                        treeNodeEl.data("children", listEls);
                        return false;
                    }
                } else {
                    if (i >= me.dataIndex + loadDataRows)
                    {
                        //将所有节点添加到rootListEl
                        treeNodeEl.data("children", listEls);
                        return;
                    }
                }
                if ($.isNull(data[i])) {
                    return false;
                }
                value = data[i];

                treenodeEblow = nodeblank = treecoll = "";
                if (value.children && 0 < value.children.length) {
                    //判断是否是最后一个根节点
                    if (data.length - 1 === i) {
                        isLastRoot = true;
                        treeNodeLi = $("<li>")
                                .data({"data": value, "lazyLoad": true, "depth": depth + 1,
                            "isLeaf": false, "isLastRoot": true});
                    } else {
                        isLastRoot = false;
                        treeNodeLi = $("<li>")
                                .data({"data": value, "lazyLoad": true, "depth": depth + 1,
                            "isLeaf": false, "isLastRoot": false});
                    }
                    //使用竖线填充节点前面的空间
                    for (var j = 0; j < depth; j++) {
                        nodeblank = nodeblank + '<span class="sweet-tree-node-line"></span>';
                    }
                    //如果expand为false则不展开树节点
                    treecoll = !expand ? '<a class="sweet-tree-expand" href="javascript:void(0)"></a>' :
                            '<a class="sweet-tree-coll" href="javascript:void(0)"></a>';
                } else {
                    for (var k = 0; k < depth; k++) {
                        //如果父节点是最后一个根节点
                        if (isLastRoot) {
                            var line = "";
                            for (var l = 0; l < depth - 1; l++) {
                                line = line + '<span class="sweet-tree-node-line"></span>';
                            }
                            nodeblank = line +
                                    '<span class="sweet-tree-node-blank" style="width: ' + blankWidth + 'px;"></span>';
                        } else {
                            nodeblank = nodeblank + '<span class="sweet-tree-node-line"></span>';
                        }
                    }
                    treenodeEblow = (i === data.length - 1) ? '<span class="sweet-tree-node-eblow-end"></span>' :
                            '<span class="sweet-tree-node-eblow"></span>';
                    treeNodeLi = $("<li>").data({"data": value, "lazyLoad": true, "depth": depth + 1, "isLeaf": true});
                }
                treeNodeLi.data(selectmap, []);
                //判断是否有checkbox
                if (me.options.multi) {
                    checkStr = me._createCheckBox(treeNodeLi, checkStr, isSelect);
                }
                //判断是否有icon
                if (me.options.icon) {
                    nodeioc = me._createIcon(value, nodeioc);
                }
                //判断是否是可编辑
                treeTextClass = value.editable ? treeEditableClass : treeTitleClass;
                if (!$.isNull(value.data) && "1" === value.data.state) {
                    treeTextClass = treeStateClass;
                }
                liStr = '<div class="sweet-tree-node">' +
                        nodeblank +
                        treenodeEblow +
                        treecoll +
                        nodeioc +
                        checkStr +
                        '<span class=' +
                        treeTextClass +
                        ' title=' + '\'' + me.options.handleTitle($.htmlEscape(value.text)) + '\'' + '>' +
                        me.options.handleText($.htmlEscape(value.text)) + '</span>' +
                        '</div>' +
                        '<ul>' +
                        '</ul>';

                treeNodeLi.html(liStr);
                treeNodeLi.appendTo(treeNodeEl);
                treeNode = treeNodeLi.children("ul");

                //如果expand为false则不展开树节点
                if (!me.options.expand) {
                    treeNode.hide();
                }
                listEls.push(treeNodeLi);
                if (value.children && 0 < value.children.length) {
                    me.addNode(value.children, isSelect, treeNode, depth + 1, isLastRoot);
                }
            });
            treeNodeEl.data("children", listEls);
        },
        /**
         * @description 删除数据
         * @param {Object} selectedData 需要删除的数据
         * @param {Object} filterData 需要删除的数据
         * @return {Object} 原始数据删除之后的数据
         */
        deleteData: function(selectedData, filterData) {
            var me = this;
            for (var i = 0; i < selectedData.length; i++) {
                for (var j = 0; j < filterData.length; j++) {
                    if (selectedData[i].value === filterData[j].value) {
                        if (selectedData[i].children && 0 < selectedData[i].children.length
                                && filterData[j].children && 0 < filterData[j].children.length) {
                            me.deleteData(selectedData[i].children, filterData[j].children);
                        } else {
                            filterData[j].isDelete = true;
                        }
                    }
                }
            }
        },
        /**
         * @description 删除节点包括isDelete属性的节点
         * @param {Array} array description
         */
        deleteFilterData: function(array) {
            var me = this;
            for (var i = 0; i < array.length; i++) {
                //如果没有子节点
                if ($.isNull(array[i].children)) {
                    //如果子节点有isDelete属性
                    if (!$.isNull(array[i].isDelete)) {
                        array.splice(i, 1);
                        i--;
                    }
                } else {
                    me.deleteFilterData(array[i].children);
                    if (0 === array[i].children.length) {
                        array.splice(i, 1);
                        i--;
                    }
                }
            }
        },
        /**
         * @description 合并树
         * @param {Object} filterData 需要合并的数据
         * @param {Object} data 需要合并的数据
         * @return {Object} 合并之后数据
         */
        mergeTree: function(filterData, data) {
            var me = this, isAdd;
            if ($.isNull(data)) {
                data = [];
            }
            if ($.isNull(filterData)) {
                filterData = [];
            }
            for (var i = 0; i < data.length; i++) {
                isAdd = true;
                var j = 0;
                for (j = 0; j < filterData.length; j++) {
                    //判断这个节点是否为追加节点
                    if (data[i].value === filterData[j].value) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    filterData.push(data[i]);
                } else {
                    if (!$.isNull(filterData[j]) && !$.isNull(filterData[j].children)) {
                        me.mergeTree(filterData[j].children, data[i].children);
                    }
                }
            }
            return filterData;
        },
        /**
         * @description 根据数据选中节点
         * @param {Object} data 树节点的绑定的数据 {text:'text1',value:'value1'}
         */
        _leafNodeSelected: function(data) {
            var me = this,
                    li = me.rootDiv.find("li");
            $.each(li, function(index, nodeli) {
                nodeli = $(nodeli);
                //设置选中的样式
                if (nodeli.data("data").value === data.value) {
                    nodeli.children("div").removeClass(treenodeClass)
                            .addClass(treenodeSelectClass + " " + treeNodeSelectClass);
                    //展开节点
                    me._displayRootNode(nodeli);
                }
            });
        },
        /**
         * @description 创建展开与折叠按钮
         * @private
         * @param {Object} treeNodeLi 
         * @param {String} checkStr checkBox显示的字符串
         * @param {Boolean} isSelect checkBox是否被选中
         */
        _createExpandBotton: function(treeNodeLi, checkStr, isSelect) {
            var me = this;
            checkStr = isSelect ? '<a class="sweet-tree-full-check"></a>' :
                    '<a class="sweet-tree-uncheck"></a>';
            if (isSelect) {
                me._checkNode(treeNodeLi);
                me._getSelectedMap();
            }
            return checkStr;
        },
        /**
         * @description 创建复选框
         * @private
         * @param {Object} treeNodeLi 
         * @param {String} checkStr checkBox显示的字符串
         * @param {Boolean} isSelect checkBox是否被选中
         */
        _createCheckBox: function(treeNodeLi, checkStr, isSelect) {
            var me = this;
            checkStr = isSelect ? '<a class="sweet-tree-full-check"></a>' :
                    '<a class="sweet-tree-uncheck"></a>';
            if (isSelect) {
                me._checkNode(treeNodeLi);
                me._getSelectedMap();
            }
            return checkStr;
        },
        /**
         * @description 创建图标
         * @private
         * @param {Array} value 数据，格式如[{text:'text1',value:'value1','data':'',
         * @param {String} nodeioc 图标显示的字符串
         *  children:[{text:'text11',value:'valuw11','data':''}]},...]
         */
        _createIcon: function(value, nodeioc) {
            nodeioc = "";
            if (value.children && 0 < value.children.length) {
                //判断是否有icon
                nodeioc = '<a class="sweet-tree-node-ioc"></a>';
            } else {
                if ($.isNull(value.data)) {
                    nodeioc = '<a class="sweet-tree-leaf-ioc"></a>';
                } else {
                    switch (value.data.type) {
                        case 0:
                            nodeioc = '<a class="sweet-tree-leaf-dimension"></a>';
                            break;
                        case 1:
                            nodeioc = '<a class="sweet-tree-leaf-index"></a>';
                            break;
                        case 2:
                            nodeioc = '<a class="sweet-tree-leaf-userDefine"></a>';
                            break;
                        case 3:
                            nodeioc = '<a class="sweet-tree-leaf-comp"></a>';
                            break;
                        default:
                            nodeioc = '<a class="sweet-tree-leaf-ioc"></a>';
                            break;
                    }
                }
            }
            return nodeioc;
        },
        /**
         * @description 设置数据
         * @private
         * @param {Array} data 数据，格式如[{text:'text1',value:'value1','data':'',
         *  children:[{text:'text11',value:'valuw11','data':''}]},...]
         * @param {Boolean} isTrigger 是否触发afterSetData
         */
        createNodes: function(data, isTrigger) {
            var me = this,
                    options = me.options,
                    lazyLoad = options.lazyLoad;
            isTrigger = isTrigger || false;
            if ($.isNull(data)) {
                return;
            }
            //树形加载默认使用多线程加载,每隔10ms加载100条数据,
            //在配置lazyLoad属性为true时，使用懒加载方式。
            if (lazyLoad) {
                me.addNode(data);
            } else {
                me.data = data;
                // 记录行索引
                me.dataIndex = 0;
                // 树内容区定时器名称
                me.timerTreeContent = options.id + "-" + timerSuffix;
                //添加遮罩
                // 启动定时器，绘制树内容
                Sweet.Task.Timeout.start({
                    id: me.timerTreeContent,
                    run: me._buildTreeContent,
                    scope: me,
                    args: [{"isTrigger": isTrigger}],
                    interval: 10
                });
            }
        },
        /**
         * @description 过滤树
         * @param {String} filStr 过滤的字符串
         */
        filter: function(filStr) {
            var me = this,
                    data;
            var patt1 = new RegExp($.regExp.escape(filStr), "i");
            if (me.options.store) {
                me.isgetData = true;
                if (me.options.remote) {
                    me.options.store.load({"filStr": filStr});
                } else {
                    //搜索目录
                    if (me.options.searchDir) {
                        me.options.store.filter(filStr, patt1, true);
                    } else {
                        me.options.store.filter(filStr, patt1);
                    }
                }
            }
            // 处理不用store的情况下过滤功能
            else {
                //搜索为空则收缩树节点，或者懒加载时节点收缩
                if ($.isNull(filStr) || me.options.lazyLoad) {
                    me.options.expand = false;
                }
                //搜索不为空，则展开树节点
                else {
                    me.options.expand = true;
                }
                data = $.fuzzyFilter(me.filterData, filStr);
                me.setData(data, false, true);
            }
            //搜索完之后数据之后发生change事件
            if (!$.isNull(me.eventMap.change)) {
                me.eventMap.change.call(null, null, me.data);
            }
        },
        /**
         * @description 设置组件禁用时样式
         * @param {Boolean} disabled 是否禁用组件
         */
        setDisabled: function(disabled) {
            var me = this;
            me.options.disabled = disabled;
            if (disabled) {
                me.rootDiv.addClass(defaultPaddingDivDisabledClass);
                if (me.options.search)
                {
                    me.searchField.setDisabled(true);
                }

            } else {
                me.rootDiv.removeClass(defaultPaddingDivDisabledClass);
                if (me.options.search)
                {
                    me.searchField.setDisabled(false);
                }
            }
        },
        /**
         * @description 为树初始化数据
         * @private
         */
        _initValue: function() {
            var me = this,
                    data = me.options.data;
            me.data = data;
            me.createNodes(data);
        },
        /**
         * @description 清空selectMap
         * @param {Object} treeNodeEl 当前节点，默认为根节点
         * @private
         */
        _removeAllSelectMapData: function(treeNodeEl) {
            var me = this;
            treeNodeEl = treeNodeEl || me.rootListEl;
            //清空selectMap     
            $.each(treeNodeEl.children("li"), function(index, nodeEl) {
                $(nodeEl).data(selectmap, []);
                if (0 < $(nodeEl).children("ul").children("li").length) {
                    me._removeAllSelectMapData($(nodeEl).children("ul"));
                }
            });
        },
        /**
         * @description 组件重绘
         * @private
         */
        _doLayout: function() {
            // 避免未渲染之前调用
            if (!this.rendered) {
                return;
            }
            var renderEl = this.renderEl,
                    options = this.options,
                    width = options.width,
                    height = options.height,
                    rootListEl = this.rootListEl,
                    rootDiv = this.rootDiv,
                    searchField = this.searchField,
                    lazyLoad = this.options.lazyLoad,
                    treeEl = this.treeEl;
            rootDiv.width(width);
            rootDiv.height(height);
            if (searchField) {
                searchField.setWidth(width);
                height = height - this.searchFiedlDiv.outerHeight(true);
            }
            treeEl.externalWidth(width);
            treeEl.externalHeight(height);
            rootListEl.externalWidth(width);
            if (lazyLoad) {
                rootListEl.externalHeight(height - 23);
            } else {
                rootListEl.externalHeight(height);
            }
        },
        /**
         * @description 删除最后一个根节点最前面的竖线
         * @private
         */
        _deleteNodeLine: function() {
            var me = this,
                    lastLi = me.rootDiv.children().children("ul").children("li:last"),
                    div = lastLi.find("li").children("div");
            $.each(div, function(index, div) {
                $(div).children("span:first").removeClass(treeNodeLineClass)
                        .addClass("sweet-tree-node-blank").width(20);
            });
        },
        /**
         * @description 生成树节点内容区
         * @private
         * @param {Object} args 传递给run的参数数组
         */
        _buildTreeContent: function(args) {
            var me = this;
            // 防止越界查找，并关闭定时器
            if (0 === me.data.length || me.dataIndex >= me.data.length) {
                Sweet.Task.Timeout.stop(me.timerTreeContent);
                //取消遮罩
                me._deleteNodeLine();
                me.afterSetData = true;
                if (!args[0].isTrigger) {
                    me._trigger("afterSetData", null, null);
                    if (!$.isNull(me.eventMap.afterSetData)) {
                        me.eventMap.afterSetData.call();
                    }
                }
                return;
            }
            me.addNode(me.data);
            //每次生成100条数据
            me.dataIndex = me.dataIndex + loadDataRows;
        },
        /**
         * @description 为树节点设置默认值
         * @private
         * @param {Object or Array} data 树节点对应的数据
         **/
        _setValue: function(data) {
            var me = this,
                    selectedValue,
                    li,
                    multi = this.options.multi;
            //afterSetValue为true时用于告知setValue执行成功
            me.afterSetValue = false;
            var timerId = setInterval(function() {
                if (me.afterSetData) {
                    li = me.rootListEl.children("li");
                    $.each(li, function(index, nodeli) {
                        nodeli = $(nodeli);
                        // 清除选中的样式
                        if (multi) {
                            if (nodeli.children("div").children("a:last").hasClass(treeNodeAllcheckedClass)) {
                                // 清除选中树节点，同时迭代联动选中其子孙节点
                                me._unCheckNode(nodeli);
                                //反选树节点，同时迭代联动选中其子孙节点
                                nodeli.find("." + treeNodeAllcheckedClass).removeClass().addClass(treeNodeUnCheckClass);
                                //反选树节点，同时迭代联动父节点
                                me._checkParent(nodeli);
                            }
                            if (nodeli.children("div").children("a:last").hasClass(treeNodeCheckedClass)) {
                                me._checkNode(nodeli);
                                me._unCheckNode(nodeli);
                                //反选树节点，同时迭代联动选中其子孙节点
                                nodeli.find("." + treeNodeAllcheckedClass).removeClass().addClass(treeNodeUnCheckClass);
                                //反选树节点，同时迭代联动父节点
                                me._checkParent(nodeli);
                            }
                        } else {
                            //单选树，传数组个数大于1时，只改变值，不改变以前的选中状态
                            if (!$.isArray(data) || 1 === data.length) {
                                nodeli.find("div").removeClass(treeNodeSelectClass);
                            }
                        }
                    });
                    if ($.isArray(data)) {
                        $.each(data, function(index, nodeData) {
                            if (1 < data.length) {
                                me._setNodeStyle(nodeData, true);
                            } else {
                                me._setNodeStyle(nodeData);
                            }
                        });
                    } else {
                        data = [data];
                        $.each(data, function(index, nodeData) {
                            me._setNodeStyle(nodeData);
                        });
                    }
                    //更新父节点文本颜色
                    me._updateParentTextColor();
                    clearInterval(timerId);
                    //给树组件设值成功
                    me.afterSetValue = true;
                    if (!$.isNull(me.eventMap.afterSetValue)) {
                        me.eventMap.afterSetValue.call(null, null, me._getValue());
                    }
                    selectedValue = me._getLeafNodeObj(me._getValue());
                    // 判断是否触发change事件
                    if (!$.equals(selectedValue, data)) {
                        //触发setValue之后的change事件
                        if (!$.isNull(me.eventMap.change)) {
                            me.eventMap.change.call(null, null, selectedValue);
                        }
                    }
                }
            }, 500);
        },
        /**
         * @description 删除某个树节点的子节点
         * @private
         * @param {Object} node 树节点
         * @param {Array} data 子节点对应的数据，格式如[{text:'text1',value:'value1','data':'',
         *  children:[{text:'text11',value:'valuw11','data':''}]},...]
         */
        _removeNodeData: function(node, data) {
            var nodeList = node.children("ul"),
                    parentUI;
            if (0 < nodeList.length) {
                var brotherNodes = node.children("ul").data("children");
                if (!$.isNull(brotherNodes)) {
                    $.each(brotherNodes, function(index, brotherNode) {
                        if (brotherNode) {
                            var brotherData = brotherNode.data("data");
                            if (brotherData.value === data.value) {
                                brotherNodes[index] = null;
                                return false;
                            }
                        }
                    });
                }
            }
            parentUI = node.parent("ul").parent("");
            if (!parentUI.length) {
                return;
            }
            this._removeNodeData(parentUI, data);
        },
        /**
         * @description 根据数据从新设置选中样式
         * @private
         * @param {Object} data 设置的数据
         * @param {Boolean} lengthGreaterOne 数据的长度大于1
         */
        _setNodeStyle: function(data, lengthGreaterOne) {
            var me = this,
                    multi = this.options.multi,
                    li = me.rootDiv.find("li");
            lengthGreaterOne = lengthGreaterOne || false;
            $.each(li, function(index, nodeli) {
                nodeli = $(nodeli);
                //重新设置选中的样式
                if (nodeli.data("data").value === data.value) {
                    //根据data属性从新设置样式
                    if (!$.isNull(data.data)) {
                        me._updateIconAndTextColor(nodeli, data.data);
                    }
                    if (multi) {
                        //选中树节点，同时迭代联动选中其子孙节点
                        me._checkNode(nodeli);
                        //选中树节点，同时迭代联动父节点
                        me._checkParent(nodeli);
                        //将当前节点的根节点，下面的数据存储
                        me._getSelectedMap();
                        me._displayRootNode(nodeli);
                    } else {
                        if (!lengthGreaterOne) {
                            nodeli.children("div").addClass(treeNodeSelectClass).removeClass(treenodeClass);
                            me._displayRootNode(nodeli);
                        }
                    }
                }
            });
        },
        /**
         * @description 根据子节点更新父节点状态
         * @private
         */
        _updateParentTextColor: function() {
            var li,
                    span,
                    nodeData,
                    me = this;

            //将全部父节点红色先全部清除isLeaf
            li = me.rootDiv.find("li");
            $.each(li, function(index, nodeli) {
                nodeli = $(nodeli);
                nodeData = nodeli.data("data").data;
                //判断是否存在data参数，data中是否包含state
                if ($.isNull(nodeData) || $.isNull(nodeData.state)) {
                    return true;
                }
                //如果是根节点清除红色
                if (!nodeli.data("isLeaf")) {
                    span = nodeli.children("div").children("span:last");
                    span.removeClass().addClass(treeTitleClass);
                    //设置父节点文本为默认颜色
                    nodeData.state = "0";
                }
                //判断子节点是否有红色文字，如果有则需要设置父节点也为红色文字
                span = nodeli.children("div").children("span:last");
                //包含红色文字的节点
                if (span.hasClass(treeStateClass)) {
                    //循环找到父节点，设置红色文字
                    nodeli = nodeli.parent().parent();
                    while ("1" <= nodeli.data("depth")) {
                        nodeData = nodeli.data("data").data;
                        span = nodeli.children("div").children("span:last");
                        span.removeClass().addClass(treeStateClass);
                        //如果父节点没有data参数需要增加，设置父节点的state为红色
                        if ($.isNull(nodeData)) {
                            //创建节点data参数
                            nodeli.data("data").data = {"state": "1"};
                        } else {
                            nodeData.state = "1";
                        }
                        nodeli = nodeli.parent().parent();
                    }
                }
            });
        },
        /**
         * @description 根据data属性更新图标和文字样式
         * @private
         * @param {Object} nodeli 树节点的绑定的数据
         * @param {Object} data 节点属性
         */
        _updateIconAndTextColor: function(nodeli, data) {
            var iconClass,
                    nodeData = nodeli.data("data").data,
                    icon = nodeli.children("div").children("a:first"),
                    text = nodeli.children("div").children("span:last");
            //如果存在图标，判断是否更新图标
            if (icon.hasClass(treeLeafDimensionClass) ||
                    icon.hasClass(treeLeafIocClass) ||
                    icon.hasClass(treeLeafCompClass) ||
                    icon.hasClass(treeLeafIndexClass) ||
                    icon.hasClass(treeLeafUserDefine)) {
                if (!$.isNull(data.type)) {
                    switch (data.type) {
                        case 0:
                            iconClass = treeLeafDimensionClass;
                            break;
                        case 1:
                            iconClass = treeLeafIndexClass;
                            break;
                        case 2:
                            iconClass = treeLeafUserDefine;
                            break;
                        case 3:
                            iconClass = treeLeafCompClass;
                            break;
                        default:
                            iconClass = treeLeafIocClass;
                            break;
                    }
                }
                icon.removeClass().addClass(iconClass);
            }
            //如果没有data参数，则需要创建
            if ($.isNull(nodeData)) {
                //更新节点data数据
                nodeli.data("data").data = $.objClone(data);
            }
            //判断是否更新文字颜色
            if (!$.isNull(data.state)) {
                //state等于1表示红色字体
                if ("1" === data.state) {
                    text.removeClass().addClass(treeStateClass);
                } else {
                    text.removeClass().addClass(treeTitleClass);
                }
            }
            //更新子节点数据
            $.extend(nodeData, data);
        },
        /**
         * @description 显示树节点UI，已经其父节点UI
         * @private
         * @param {Object} nodeli 树节点的绑定的数据
         */
        _displayRootNode: function(nodeli) {
            var me = this,
                    expand = nodeli.children("div").children("." + treeNodeExpandClass);
            me._clickExpandEventTrigger($(expand));
            if (1 === nodeli.data("depth")) {
                return;
            } else {
                me._displayRootNode(nodeli.parent().parent());
            }
        },
        /**
         * @description 查找树节点UI
         * @private
         * @param {Object} data 树节点的绑定的数据
         */
        _findNodeUI: function(data) {
            var parentNode = this._findParentNode(data, this.treeEl) || this.treeEl,
                    nodeArrays = parentNode.children("ul").data("children"),
                    treeNode = null,
                    childData = $.isArray(data) ? data[0] : data;
            if ($.isNull(nodeArrays))
            {
                return null;
            }
            $.each(nodeArrays, function(index, node) {
                if (node && node.data("data").value === childData.value)
                {
                    treeNode = node;
                    return false;
                }
            });
            return treeNode;
        },
        /**
         * @description 检查某节点是否存在子节点
         * @private
         * @param {Object} treeNode 节点UI
         */
        _hasChild: function(treeNode) {
            if (treeNode) {
                return !!treeNode.find("li").length;
            }
            return false;
        },
        /**
         * @description 查找父节点
         * @private
         * @param nodeData 当前节点对应的节点数据
         * @param treeNode 起始树节点
         */
        _findParentNode: function(nodeData, treeNode) {
            treeNode = treeNode || this.treeEl;
            if (treeNode.find("li").length === 0) {
                return null;
            }
            var me = this, childNodes = treeNode.children("ul").data("children"),
                    hasFindParent = false, parentNode = null;
            if ($.isNull(childNodes)) {
                return null;
            }
            $.each(childNodes, function(inext, childNode) {
                if (childNode) {
                    if (childNode.data("data").value === nodeData.value) {
                        hasFindParent = true;
                        parentNode = treeNode;
                        return false;
                    } else {
                        if (me._hasChild(childNode)) {
                            var node = me._findParentNode(nodeData, childNode);
                            if (node) {
                                hasFindParent = true;
                                parentNode = node;
                                return false;
                            }
                            if (hasFindParent) {
                                return false;
                            }
                        }
                    }
                }
            });
            if (hasFindParent && parentNode) {
                return parentNode;
            }
        },
        /**
         * @description 绑定树节点双击时触发
         * @private
         * @param {Object} event 双击事件
         */
        _dblClickEventTrigger: function(event) {
            var me = this,
                    hasClass,
                    nodeli,
                    data,
                    div,
                    options = me.options,
                    parent = options.parent,
                    target = $(event.target);
            if (me.options.disabled) {
                return;
            }
            //判断拖动的目标
            nodeli = (target.hasClass(treenodeClass) ||
                    target.hasClass(treeNodeSelectClass)) ? target.parent() : target.parent().parent();
            data = nodeli.data("data");
            //取父节点信息,构造返回数据
            if (parent) {
                data = me._createNodeData(nodeli, data);
            }
            //触发nodeDClick事件
            me._trigger("nodeDClick", nodeli, data);
            //如果注册nodeDClick的回调，则调用
            if (!$.isNull(me.eventMap.nodeDClick)) {
                me.eventMap.nodeDClick.call(this, event, data);
            }
            if (me.options.lazyLoad) {
                if (0 < $(target.children("." + treeNodeExpandClass)).length) {
                    me._clickExpandEventTrigger($(target.children("." + treeNodeExpandClass)), event);
                } else {
                    me._clickExpandEventTrigger($(target.children("." + treeNodeCollClass)), event);
                }
            } else {
                div = nodeli.children("div");
                if ("none" === nodeli.children("ul").css("display")) {
                    nodeli.children("ul").show();
                    hasClass = div.children("a:first").hasClass(treeNodeExpandClass);
                    if (hasClass) {
                        div.children("a:first")
                                .removeClass(treeNodeExpandClass)
                                .addClass(treeNodeCollClass);
                    }
                } else {
                    nodeli.children("ul").hide();
                    hasClass = div.children("a:first").hasClass(treeNodeCollClass);
                    if (hasClass) {
                        div.children("a:first")
                                .removeClass(treeNodeCollClass)
                                .addClass(treeNodeExpandClass);
                    }
                }
            }
        },
        /**
         * @description 绑定展开与关闭时触发
         * @private
         * @param {Object} target 单击目标
         * @param {Object} event 点击事件
         * @return {Boolean} 是否执行此方法
         */
        _clickExpandEventTrigger: function(target, event) {
            var me = this,
                    lazyLoad = me.options.lazyLoad;
            if (me.options.disabled) {
                return;
            }
            // 如果在ul元素上点击
            if (target.hasClass(treeRootUlClass) || target.hasClass(treeRootUl1Class)) {
                return true;
            }
            //节点展开操作
            if (target.hasClass(treeNodeCollClass)) {
                target.parent().parent().children("ul").hide();
                target.removeClass().addClass(treeNodeExpandClass);
                //触发节点展开事件
                if (!$.isNull(event) && !$.isNull(me.eventMap.nodeExpand)) {
                    me.eventMap.nodeExpand.call(this, event, {"isExpand": false});
                }
                return true;
            }
            //节点折叠操作
            if (target.hasClass(treeNodeExpandClass)) {
                target.parent().parent().children("ul").show();
                var treeNodeLi = target.parent().parent();
                var treeNode = target.parent().parent().children("ul");
                target.removeClass().addClass(treeNodeCollClass);
                //触发节点折叠事件
                if (!$.isNull(event) && !$.isNull(me.eventMap.nodeExpand)) {
                    me.eventMap.nodeExpand.call(this, event, {"isExpand": true});
                }
                //异步加载子节点
                if (lazyLoad && treeNodeLi.data("lazyLoad")) {
                    //如果是最后一个节点
                    treeNodeLi.data("lazyLoad", false);
                }
                return true;
            }
        },
        /**
         * @description 复选树节点选中时前触发
         * @private
         * @param {Object} event 点击事件
         * @return {Boolean} 是否执行此方法
         */
        _beforeOnCheckEventTrigger: function(event) {
            var me = this,
                    target = $(event.target);
            if (me.options.disabled) {
                return;
            }
            //点击复选框事件,节点选中treeNodeCheckedClass
            if (target.hasClass(treeNodeUnCheckClass) || target.hasClass(treeNodeCheckedClass)) {
                return me._beforeCheckboxClick(event);
            }
        },
        /**
         * @description 复选树节点选中时触发
         * @private
         * @param {Object} event 单击目标
         * @return {Boolean} 是否执行此方法
         */
        _onCheckEventTrigger: function(event) {
            var me = this,
                    treeNode,
                    target = $(event.target),
                    lazyLoad = me.options.lazyLoad;
            if (me.options.disabled) {
                return;
            }
            //点击复选框事件,节点选中
            if (target.hasClass(treeNodeUnCheckClass)) {
                treeNode = target.parent().parent();
                var treeNodeEL = target.parent().parent().children("ul");
                //如果是懒加载，点击checkBox时加载子节点
                if (lazyLoad && treeNode.data("lazyLoad")) {
                    //如果是最后一个节点
                    if (treeNode.data("isLastRoot")) {
                        me.addNode(treeNode.data("data")
                                .children, false, treeNodeEL, treeNode.data("depth"), true);
                    } else {
                        me.addNode(treeNode.data("data")
                                .children, false, treeNodeEL, treeNode.data("depth"), false);
                    }
                    treeNode.data("lazyLoad", false);
                }

                // 选中树节点，同时迭代联动选中其子孙节点
                me._checkNode(treeNode);
                //选中树节点，同时迭代联动父节点
                me._checkParent(treeNode);
                //将当前节点的根节点，下面的数据存储
                me._getSelectedMap();
                me._trigger("change", treeNode, treeNode.data("data"));
                me._trigger("nodeCheck", treeNode, treeNode.data("data"));

                if (!$.isNull(me.eventMap.nodeCheck)) {
                    me.eventMap.nodeCheck.call(this, event, treeNode.data("data"));
                }
                if (!$.isNull(me.eventMap.change)) {
                    me.eventMap.change.call(this, event, treeNode.data("data"));
                }
                return true;
            }
        },
        /**
         * @description 列表节点的选中或反选事件 
         * @private
         * @param {Object} event 参数对象
         */
        _beforeCheckboxClick: function(event) {
            var me = this,
                    target = $(event.target),
                    treeNode = target.parent().parent(),
                    isClick = true;
            if (me.options.disabled) {
                return;
            }
            me._trigger("beforeCheckboxClick", treeNode, treeNode.data("data"));
            if (!$.isNull(me.eventMap.beforeCheckboxClick)) {
                isClick = me.eventMap.beforeCheckboxClick.call(this, event, treeNode.data("data"));
                //如果返回为undefined
                if ($.isNull(isClick)) {
                    isClick = true;
                }
            }
            if (!isClick) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * @description 复选树节点反选时触发
         * @private
         * @param {Object} event 单击目标
         * @return {Boolean} 是否执行此方法
         */
        _unCheckEventTrigger: function(event) {
            var me = this,
                    target = $(event.target),
                    treeNode;
            if (me.options.disabled) {
                return;
            }
            if (target.hasClass(treeNodeAllcheckedClass)) {
                treeNode = target.parent().parent();
                // 反选树节点，同时迭代联动选中其子孙节点
                me._unCheckNode(treeNode);
                //反选树节点，同时迭代联动选中其子孙节点
                treeNode.find("." + treeNodeAllcheckedClass).removeClass().addClass(treeNodeUnCheckClass);
                //反选树节点，同时迭代联动父节点
                me._checkParent(treeNode);
                me._trigger("nodeUnCheck", treeNode, treeNode.data("data"));
                if (!$.isNull(me.eventMap.nodeUnCheck)) {
                    me.eventMap.nodeUnCheck.call(this, treeNode.data("data"));
                }

                me._trigger("change", treeNode, treeNode.data("data"));
                if (!$.isNull(me.eventMap.change)) {
                    me.eventMap.change.call(this, treeNode.data("data"));
                }
                me._getSelectedMap();
                return true;
            }
        },
        /**
         * @description 复选树节点处于半选时触发
         * @private
         * @param {Object} target 单击目标
         * @return {Boolean} 是否执行此方法
         */
        _checkEventTrigger: function(target) {
            var me = this,
                    treeNode;
            if (me.options.disabled) {
                return;
            }
            if (target.hasClass(treeNodeCheckedClass)) {
                treeNode = target.parent().parent();
                // 选中树节点，同时迭代联动选中其子孙节点
                me._checkNode(treeNode);
                //选中树节点，同时迭代联动父节点
                me._checkParent(treeNode);
                //将当前节点的根节点，下面的数据存储
                me._getSelectedMap();
                return true;
            }
        },
        /**
         * @description 树节点单击时触发
         * @private
         * @param {Object} event 单击目标
         * @return {Boolean} 是否执行此方法
         */
        _clickNodeEventTrigger: function(event) {
            var me = this,
                    options = this.options,
                    target = $(event.target),
                    value,
                    data;
            if (me.options.disabled) {
                return;
            }
            //单选树根节点不能选中
            if (!options.parentAllowNodeClick) {
                if (!options.multi) {
                    if (target.children().hasClass(treeNodeExpandClass) ||
                            target.children().hasClass(treeNodeCollClass) ||
                            target.parent().children().hasClass(treeNodeExpandClass) ||
                            target.parent().children().hasClass(treeNodeCollClass)) {
                        return;
                    }
                }
            }
            me.rootDiv.find("." + treeNodeSelectClass).removeClass(treeNodeSelectClass).addClass(treenodeClass);
            me.rootDiv.find("." + treenodeSelectClass).removeClass(treeNodeSelectClass);
            me.rootDiv.find("." + treenodeSelectClass).removeClass(treenodeSelectClass).addClass(treenodeClass);
            if (target.hasClass(treenodeClass)) {
                target.addClass(treeNodeSelectClass);
                target.removeClass(treenodeClass);
                target.addClass(treenodeSelectClass);
                //获取当前点击节点数据
                data = target.parent().data("data");
                //获取点击节点数据
                value = me._getNodeClickData();
                //触发节点点击事件
                me._trigger("nodeClick", target.parent(), data);
                //调用节点单击绑定的回调函数
                if (!$.isNull(me.eventMap.nodeClick)) {
                    me.eventMap.nodeClick.call(this, event, data);
                }
                //多选树的时候不发生change事件
                if (!options.multi) {
                    me._trigger("change", target.parent(), value);
                    if (!$.isNull(me.eventMap.change)) {
                        me.eventMap.change.call(this, event, value);
                    }
                }

            } else {
                //获取当前点击节点数据
                data = target.parent().parent().data("data");
                //判断是否是可编辑文本
                if (target.hasClass(treeEditableClass)) {
                    if (!$.isNull(me.eventMap.nodeEdit)) {
                        me.eventMap.nodeEdit.call(this, event, data);
                    }
                }

                target.parent().addClass(treeNodeSelectClass);
                target.parent().removeClass(treenodeClass);
                target.parent().addClass(treenodeSelectClass);

                //获取点击节点数据
                value = me._getNodeClickData();
                //触发节点点击事件
                me._trigger("nodeClick", target.parent().parent(), data);
                //调用节点单击绑定的回调函数
                if (!$.isNull(me.eventMap.nodeClick)) {
                    me.eventMap.nodeClick.call(this, event, data);
                }
                //多选树的时候不发生change事件
                if (!options.multi) {
                    me._trigger("change", target.parent().parent(), value);
                    if (!$.isNull(me.eventMap.change)) {
                        me.eventMap.change.call(this, event, value);
                    }
                }
            }
            return true;
        },
        /**
         * @description 创建组件之后绑定事件
         * @private
         */
        _afterCreateSweetWidget: function() {
            var me = this,
                    TimeFn = null;
            if (me.options.nodeDraggable) {
                me._addNodeDragEvent();
            }
            //监听双击树节点事件
            me.rootListEl.bind("dblclick", function(event) {
                clearInterval(TimeFn);
                me._dblClickEventTrigger(event);
                return;
            });
            //点击延迟加载事件
            me.lazyLoadDiv.bind("click", function(event) {
                var target = $(event.target),
                        clickCount = target.data("clickCount"),
                        data = target.data("data");
                target.data("clickCount", clickCount + 1);
                me.addNode(data);
                return;
            });
            me.rootListEl.bind("click", function(event) {
                clearInterval(TimeFn);

                //关闭展开事件
                var target = $(event.target),
                        isTrigger = false;
                //判断是否执行clickExpandEvent
                isTrigger = me._clickExpandEventTrigger(target, event);
                if (isTrigger) {
                    return;
                }
                //判断是否执行beforeOnCheckEventTrigge
                isTrigger = me._beforeOnCheckEventTrigger(event);
                if (isTrigger) {
                    return;
                }
                //点击复选框事件,节点选中
                isTrigger = me._onCheckEventTrigger(event);
                if (isTrigger) {
                    return;
                }
                //点击复选框事件,节点反选
                isTrigger = me._unCheckEventTrigger(event);
                if (isTrigger) {
                    return;
                }
                //复选框处于半选状态点击事件
                isTrigger = me._checkEventTrigger(target);
                if (isTrigger) {
                    return;
                }
                //监听单击树节点事件
                TimeFn = setInterval(function() {
                    isTrigger = me._clickNodeEventTrigger(event);
                    if (isTrigger) {
                        clearInterval(TimeFn);
                        return false;
                    }

                }, 300);

            });
        },
        /**
         * @description 选中树节点，同时迭代联动选中其子孙节点
         * @private
         * @param {Object} treeNodeEl 树节点
         */
        _checkNode: function(treeNodeEl) {
            if ($.isNull(treeNodeEl)) {
                return;
            }
            var me = this,
                    childNodes = treeNodeEl.children("ul").data("children");
            if (childNodes) {
                $.each(childNodes, function(index, childNode) {
                    me._checkNode(childNode, true);
                });
            }
            me._onCheckNode(treeNodeEl, true);
        },
        /**
         * @description 监听树节点的选中事件
         * @private
         * @param {Object} treeNodeEl 树节点
         * @param {Boolean} full 是否全选
         */
        _onCheckNode: function(treeNodeEl, full) {
            var checkEl,
                    parentSelectMap,
                    newTreeNodeClass,
                    parentNode,
                    nodeData,
                    selectMap,
                    selectObject,
                    nodeLength = treeNodeEl.length;
            if (nodeLength === 0) {
                return;
            }
            if (0 < treeNodeEl.children().children("." + treeNodeUnCheckClass).length) {
                checkEl = treeNodeEl.children().children("." + treeNodeUnCheckClass);
            } else {
                checkEl = treeNodeEl.children().children("." + treeNodeCheckedClass);
            }
            nodeData = treeNodeEl.data("data");
            selectMap = treeNodeEl.data(selectmap);
            checkEl.removeClass();
            newTreeNodeClass = full ? treeNodeAllcheckedClass : treeNodeCheckedClass;
            checkEl.addClass(newTreeNodeClass);
            parentNode = treeNodeEl.parent("ul").parent("li");
            //树节点选中后，会将该节点存放在父节点的selectMap中
            if (this.options.multi) {
                parentSelectMap = parentNode.data(selectmap);
            } else {
                parentSelectMap = [];
            }

            if (0 < parentNode.length) {
                selectObject = {"text": nodeData.text, "value": nodeData.value,
                    "data": nodeData.data, "editable": nodeData.editable};
                if (0 < selectMap.length) {
                    selectObject.children = selectMap;
                }
                parentSelectMap[nodeData.value] = selectObject;
                parentNode.data(selectmap, parentSelectMap);
                parentNode.data("selectMap").length++;
            }
        },
        /**
         * @description 反选树节点，同时迭代联动反选其子孙节点
         * @private
         * @param {Object} treeNodeEl 树节点
         */
        _unCheckNode: function(treeNodeEl) {
            if ($.isNull(treeNodeEl)) {
                return;
            }
            var me = this,
                    childNodes = treeNodeEl.children("ul").data("children");
            me._onUnCheckNode(treeNodeEl);
            if (!childNodes) {
                return;
            }
            $.each(childNodes, function(index, childNode) {
                me._unCheckNode(childNode);
            });
        },
        /**
         * @description 监听树节点的反选中事件
         * @private
         * @param {Object} treeNodeEl 树节点
         */
        _onUnCheckNode: function(treeNodeEl) {
            if (0 === treeNodeEl.length) {
                return;
            }
            var nodeData = treeNodeEl.data("data"),
                    parentNode = treeNodeEl.parent("ul").parent("li");
            //树节点反选后，会将该节点从父节点的selectMap中删除
            if (0 < parentNode.length) {
                var selectMap = parentNode.data(selectmap);
                if (0 < selectMap.length) {
                    delete selectMap[nodeData.value];
                    parentNode.data("selectMap").length--;
                }
            }
        },
        /**
         * @description 删除选中的叶子节点的值
         * @private
         * @param {Object} treeNodeEl 当前节点
         */
        _deleteSelectedMap: function(treeNodeEl) {
            var me = this,
                    allLi,
                    data = [];
            //如果是子节点
            if (treeNodeEl.data("isLeaf")) {
                data = treeNodeEl.data("data");
                for (var i = 0; i < me.selectMap.length; i++) {
                    if (me.selectMap[i].value === data.value && me.selectMap[i].text === data.text) {
                        me.selectMap.splice(i, 1);
                    }
                }
            } else {
                //找到当前节点下面的全部叶子节点
                allLi = treeNodeEl.find("li");
                $.each(allLi, function(index, childLi) {
                    data = $(childLi).data("data");
                    for (var i = 0; i < me.selectMap.length; i++) {
                        if (me.selectMap[i].value === data.value && me.selectMap[i].text === data.text) {
                            me.selectMap.splice(i, 1);
                        }
                    }
                });
            }
        },
        /**
         * @description 设置祖先节点的选中状态
         * @private
         * @param {Object} treeNode 当前树节点
         * @return {Object} 当前节点的根节点 
         */
        _checkParent: function(treeNode) {
            var me = this,
                    nodeNum,
                    parentUl = treeNode.parent(),
                    parentNodeEl = parentUl.parent("li"),
                    nodeData = parentNodeEl.data("data"),
                    selectMap = parentNodeEl.data(selectmap),
                    parentNode = parentNodeEl.parent("ul").parent("li"),
                    //获取ul节点下的li的个数
                    countLi = parentUl.children("li").length,
                    //ul下没有被选中的节点个数
                    unSelectCount = 0,
                    //ul下有被选中的节点个数
                    selectCount = 0,
                    childrenLis = parentUl.children("li"),
                    treeNodeEl = parentUl.parent();
            if (1 === treeNode.data("depth")) {
                return treeNode;
            }
            $.each(childrenLis, function(index, childLi) {
                if ($(childLi).children("div").children().hasClass(treeNodeUnCheckClass)) {
                    unSelectCount++;
                }
                if ($(childLi).children("div").children().hasClass(treeNodeAllcheckedClass)) {
                    selectCount++;
                }
            });
            if(0 === selectCount){
                nodeData = {"text": undefined, "value": nodeData.value,
                    "data": undefined, "editable": undefined}; 
            }
            //设置父节点
            nodeNum = me.options.icon ? 2 : 1;
            if (countLi === selectCount) {
                parentNodeEl.children("div").children("a:eq(" + nodeNum + ")")
                        .removeClass().addClass(treeNodeAllcheckedClass);
            } else if (countLi === unSelectCount) {
                parentNodeEl.children("div").children("a:eq(" + nodeNum + ")")
                        .removeClass().addClass(treeNodeUnCheckClass);
                //同时删除父节点
                me._onUnCheckNode(parentNodeEl);
            } else {
                parentNodeEl.children("div").children("a:eq(" + nodeNum + ")")
                        .removeClass().addClass(treeNodeCheckedClass);
            }
              //树节点选中后，会将该节点存放在父节点的selectMap中
            if (0 < parentNode.length) {
                var parentSelectMap = parentNode.data(selectmap),
                        selectObject = {"text": nodeData.text, "value": nodeData.value,
                    "data": nodeData.data, "editable": nodeData.editable};
                if (0 < selectMap.length) {
                    selectObject.children = selectMap;
                }
                if($.isNull(selectObject.text)){
                    parentSelectMap[nodeData.value] = undefined;
                }else{
                    parentSelectMap[nodeData.value] = selectObject;
                }
                
                parentNode.data(selectmap, parentSelectMap);
            }

            treeNode = me._checkParent(treeNodeEl);
            return treeNode;
        },
        /**
         * @description 为树添加拖动事件
         * @private
         */
        _addNodeDragEvent: function() {
            var me = this,
                    title,
                    options = me.options,
                    parent = options.parent,
                    nodeAccept = options.nodeAccept,
                    liDiv = me.treeEl;
            liDiv.draggable({
                opacity: 1.0,
                appendTo: 'body',
                helper: function(event) {
                    var icon,
                            dropDiv = $("<div>"),
                            target = event.target,
                            nodeli,
                            data,
                            div,
                            divChildren,
                            obj = null;
                    //获取目标元素
                    liDiv.children("ul").children("li").each(function(index, div) {
                        if ($.isNull(div)) {
                            return;
                        }
                        if ($.contains(div, target)) {
                            obj = $(target);
                        }
                    });
                    if (null === obj) {
                        return dropDiv;
                    }
                    //判断拖动的目标
                    nodeli = (obj.hasClass(treenodeClass)) ? obj.parent() : obj.parent().parent();
                    data = nodeli.data("data");
                    //取父节点信息,构造返回数据
                    if (parent) {
                        data = me._createNodeData(nodeli, data);
                    }
                    me.dragData = data;
                    //获取树节点下面的div
                    div = $(nodeli.children()[0]);
                    divChildren = div.children();
                    //图标获取
                    if (me.options.icon) {
                        if (divChildren.hasClass(treeLeafIocClass)) {
                            icon = div.children("." + treeLeafIocClass).clone();
                        } else if (divChildren.hasClass(treeLeafUserDefine)) {
                            icon = div.children("." + treeLeafUserDefine).clone();
                        } else if (divChildren.hasClass(treeNodeIocClass)) {
                            icon = div.children("." + treeNodeIocClass).clone();
                        } else if (divChildren.hasClass(treeLeafDimensionClass)) {
                            icon = div.children("." + treeLeafDimensionClass).clone();
                        } else if (divChildren.hasClass(treeLeafCompClass)) {
                            icon = div.children("." + treeLeafCompClass).clone();
                        } else {
                            icon = div.children("." + treeLeafIndexClass).clone();
                        }
                        icon.appendTo(dropDiv);
                    }
                    //获取文字
                    title = div.children("." + treeTitleClass).clone();
                    dropDiv.addClass(itemDraggingClass);
                    title.appendTo(dropDiv);
                    //设置拖动元素位置
                    liDiv.draggable('option', 'cursorAt',
                            {left: dropDiv.width() / 2, top: dropDiv.height() / 2});
                    return dropDiv;
                }
            });

            // 节点拖动不是必备功能，有些场景不需要
            if (nodeAccept) {
                nodeAccept.droppable({
                    drop: function(event, ui) {
                        //判断只有树的节点才响应droppable方法
                        if (treeDrag === ui.helper[0].className) {
                            me._trigger("nodeDrag", me.dragData, me.dragData);
                            if (!$.isNull(me.eventMap.nodeDrag)) {
                                me.eventMap.nodeDrag.call(null, event, me.dragData);
                            }
                        }
                    }
                });
            }
        },
        /**
         *@description 根据子节点数据，构造包含所有父节点的数据，生成树形数据
         *@private 
         *@param {Object} nodeli 树节点
         *@param {Object} data 该节点数据 格式如{text:'text1',value:'value1'}
         *@return {Object} 树形数据,格式如{text:'text1',value:'value1'}
         */
        _createNodeData: function(nodeli, data) {
            var nodeData,
                    tempData;
            //判断是否是根节点
            while (1 < nodeli.data("depth")) {
                nodeli = nodeli.parent().parent();
                nodeData = nodeli.data("data");
                tempData = {"text": nodeData.text, "value": nodeData.value,
                    "data": nodeData.data, "children": data};
                data = tempData;
            }
            return data;
        },
        /**
         *@description 删除节点中的isSelect属性
         *@private 
         *@param {Object} data 格式如[{text:'text1',value:'value1'},...]
         *@return {Array} 树节点对应的值,格式如[{text:'text1',value:'value1'},...]
         */
        _deleteAttrIsSelect: function(data) {
            $.each(data, function(index, node) {
                if (node.data) {
                    delete node.data.isSelect;
                }
            });
            return data;
        },
        /**
         * @description 获取选中的叶子节点的值，构造成树形数据
         * @private
         * @return {Array} 叶子节点对应的值,格式如[{text:'text1',value:'value1'},...]
         */
        _getSelectedMap: function() {
            var me = this,
                    nodeData,
                    selectMap,
                    rootList = this.treeEl.children("ul").data("children"),
                    listMap = me.selectMap = [];
            if ($.isNull(rootList)) {
                return [];
            }
            $.each(rootList, function(index, nodeEl) {
                if (nodeEl) {
                    nodeData = nodeEl.data("data"),
                            selectMap = nodeEl.data(selectmap);
                    if (me.options.multi) {
                        if (0 < nodeEl.find("." + treeNodeAllcheckedClass).length) {
                            listMap[nodeData.value] = {"text": nodeData.text, "value": nodeData.value,
                                "data": nodeData.data, "editable": nodeData.editable, "children": selectMap};
                        }
                    } else {
                        if (0 < nodeEl.find("." + treeNodeSelectClass).length) {
                            listMap[nodeData.value] = {"text": nodeData.text, "value": nodeData.value,
                                "data": nodeData.data, "editable": nodeData.editable, "children": selectMap};
                            listMap.length++;
                        }
                    }
                }
            });
            return listMap;
        },
        /**
         * @description 获取点击节点的数据
         * @private
         * @return {Array} 叶子节点对应的值,格式如[{text:'text1',value:'value1'},...]
         */
        _getNodeClickData: function() {
            var nodeData,
                    treeNode,
                    clickData = {};

            //找到选中的节点
            treeNode = this.treeEl.find("." + treeNodeSelectClass).parent("li");
            nodeData = treeNode.data("data");
            //判断是否是根节点
            if (treeNode.data("isLeaf")) {
                clickData = {"text": nodeData.text, "value": nodeData.value,
                    "data": nodeData.data, "editable": nodeData.editable};
            } else {
                clickData = nodeData;
            }

            //获取选中节点的全部父节点，组成树形结构
            treeNode = treeNode.parent().parent();
            while (0 < treeNode.data("depth")) {
                nodeData = treeNode.data("data");
                clickData = {"text": nodeData.text, "value": nodeData.value,
                    "data": nodeData.data, "editable": nodeData.editable, "children": [clickData]};
                treeNode = treeNode.parent().parent();
            }
            return [clickData];
        },
        /**
         * @description 获取组件中选择的节点数据
         * @private
         * @return {Array}
         *  节点对应的节点数据数组，格式如：[{text:'text1',value:'value1'},{text:'text1',value:'value1'},...]
         */
        _getValue: function() {
            var me = this;
            if (!me.options.multi) {
                var treeNode = this.treeEl.find("." + treeNodeSelectClass).parent("li");
                //触发选中
                if (0 < treeNode.length) {

                    me._checkNode(treeNode);
                    me._checkParent(treeNode);
                }
            }
            me._getSelectedMap();
            return $.deleteUndefinedData(me.selectMap);
        },
        /**
         * @description 创建树
         * @private
         */
        _createSweetWidget: function() {
            var me = this,
                    treeEl,
                    rootHeight,
                    options = this.options;
            me.selectMap = [];
            me.eventMap = {};
            treeEl = this.treeEl = $("<div>").attr("id", options.id)
                    .addClass("sweet-tree-list sweet-tree-panel").addClass(options.widgetClass);
            uuid++;
            this.rootDiv = $("<div>").width(options.width).height(options.height);
            this.rootDiv.attr("id", options.id + treePrefix + uuid);
            this.lazyLoadDiv = $("<div title='" + Sweet.core.i18n.tree.clickLoad + "'>").text("...").addClass(treeLoadMore);
            this.isgetData = true;
            if (options.search) {
                me.searchFiedlDiv = $("<div>").attr("id", options.id + treePrefix + uuid + "search")
                        .addClass(treeSearchClass);
                me.searchField = new Sweet.form.SearchField({
                    width: options.width,
                    emptyText: options.searchEmptyText
                });
                me.searchField.addListener("keyup", function(e, data) {
                    me.filter(data.text);
                    //触发搜索监听
                    if (!$.isNull(me.eventMap.search)) {
                        me.eventMap.search.call(null, e, data);
                    }
                });
                me.searchField.addListener("click", function(e, data) {
                    me.filter(data.text);
                    if (!$.isNull(me.eventMap.search)) {
                        me.eventMap.search.call(null, e, data);
                    }
                });
                if (options.disabled) {
                    me.searchField.setDisabled(true);
                    me.rootDiv.addClass(defaultPaddingDivDisabledClass);
                } else {
                    me.searchField.setDisabled(false);
                    me.rootDiv.removeClass(defaultPaddingDivDisabledClass);
                }
            }
            rootHeight = options.height;
            if (options.height === "auto" && options.maxHeight !== 0) {
                rootHeight = options.maxHeight;
                me.rootListEl = $("<ul>").appendTo(me.treeEl).addClass(treeRootUl1Class)
                        .css("max-height", rootHeight);
                me.rootListEl.width(options.width);
                me.rootListEl.height(options.height);
            } else {
                me.rootListEl = $("<ul>").appendTo(me.treeEl).addClass(treeRootUlClass);
                me.rootListEl.width(options.width);
                me.rootListEl.height(options.height);
            }
            me._initValue();
            // 如果配置store，给store注册回调
            if (options.store) {
                options.store.addListener({"setData": me.setData, "scope": this});
            } else {
                me._filterCache();
            }
        },
        /**
         * @private
         * @description 在没有配置store情况下，缓存数据供过滤使用
         */
        _filterCache: function() {
            var me = this;
            me.filterData = $.objClone(me.data);
            if ($.isEmptyObject(me.filterData)) {
                me.filterData = [];
            }
        },
        /**
         * @description 子类继承实现
         * @private
         */
        _destroyWidget: function() {
            var me = this;
            if (this.treeEl) {
                this.treeEl.remove();
            }
            if (me.timerTreeContent) {
                Sweet.Task.Timeout.stop(me.timerTreeContent);
            }
        },
        /**
         * @description 显示当前树节点
         * @private
         * @param {Object} treeNode description
         */
        _showTreeNode: function(treeNode) {
            treeNode = treeNode || this.treeEl;
            var me = this,
                    ulEl = treeNode.children("ul"),
                    childNodes = ulEl.data("children");
            if (childNodes) {
                $.each(childNodes, function(index, childNode) {
                    me._showTreeNode(childNode);
                });
            }
            treeNode.hide();
        },
        /**
         * @description 渲染树
         * @private
         * @param {String} id 树ID
         */
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.rootDiv.appendTo(me.renderEl);
            if (me.searchField) {
                me.searchFiedlDiv.appendTo(me.rootDiv);
                me.searchField.render(me.searchFiedlDiv.attr("id"));
            }
            me.treeEl.appendTo(me.rootDiv);
            // 添加延迟加载按钮
            if (me.options.lazyLoad) {
                me.lazyLoadDiv.appendTo(me.treeEl);
            }
            me.rendered = true;
            return true;
        },
        /**
         * @description 取消事件
         * @private
         */
        _removeListener: function() {
            var me = this;
            me.handlers = me.handlers || {};
            $.each(me.handlers, function(eventName, func) {
                if ("change" === eventName) {
                    me.eventMap.change = null;
                    delete me.handlers.change;
                }
                if ("search" === eventName) {
                    me.eventMap.search = null;
                    delete me.handlers.search;
                }
                if ("nodeDClick" === eventName) {
                    me.eventMap.nodeDClick = null;
                    delete me.handlers.nodeDClick;
                }
                if ("afterSetData" === eventName) {
                    me.eventMap.afterSetData = null;
                    delete me.handlers.afterSetData;
                }
                if ("afterSetValue" === eventName) {
                    me.eventMap.afterSetValue = null;
                    delete me.handlers.afterSetValue;
                }
                if ("nodeCheck" === eventName) {
                    me.eventMap.nodeCheck = null;
                    delete me.handlers.nodeCheck;
                }
                if ("nodeUnCheck" === eventName) {
                    me.eventMap.nodeUnCheck = null;
                    delete me.handlers.nodeUnCheck;
                }
                if ("nodeClick" === eventName) {
                    me.eventMap.nodeClick = null;
                    delete me.handlers.nodeClick;
                }
                if ("nodeDrag" === eventName) {
                    me.eventMap.nodeDrag = null;
                    delete me.handlers.nodeDrag;
                }
                if ("beforeCheckboxClick" === eventName) {
                    me.eventMap.beforeCheckboxClick = null;
                    delete me.handlers.beforeCheckboxClick;
                }
                if ("nodeExpand" === eventName) {
                    me.eventMap.nodeExpand = null;
                    delete me.handlers.nodeExpand;
                }
                if ("nodeEdit" === eventName) {
                    me.eventMap.nodeEdit = null;
                    delete me.handlers.nodeEdit;
                }
            });
        },
        /**
         * @description 注册事件
         * @private
         */
        _addListener: function() {
            var me = this;
            $.each(me.handlers, function(eventName, func) {
                if ("change" === eventName) {
                    me.eventMap.change = func;
                }
                if ("search" === eventName) {
                    me.eventMap.search = func;
                }
                if ("nodeDClick" === eventName) {
                    me.eventMap.nodeDClick = func;
                }
                if ("afterSetData" === eventName) {
                    me.eventMap.afterSetData = func;
                }
                if ("afterSetValue" === eventName) {
                    me.eventMap.afterSetValue = func;
                }
                if ("nodeCheck" === eventName) {
                    me.eventMap.nodeCheck = func;
                }
                if ("nodeUnCheck" === eventName) {
                    me.eventMap.nodeUnCheck = func;
                }
                if ("nodeClick" === eventName) {
                    me.eventMap.nodeClick = func;
                }
                if ("nodeDrag" === eventName) {
                    me.eventMap.nodeDrag = func;
                }
                if ("beforeCheckboxClick" === eventName) {
                    me.eventMap.beforeCheckboxClick = func;
                }
                if ("nodeExpand" === eventName) {
                    me.eventMap.nodeExpand = func;
                }
                if ("nodeEdit" === eventName) {
                    me.eventMap.nodeEdit = func;
                }
            });
        },
        /**
         * 将tree返回的数据转换为对象数组（只获取叶子节点）
         * @param {Object} treeValue 对象数组 
         * @return {object} [{"text":"1", "value":"ONE"},{"text":"2", "value":"TWO"}]
         */
        _getLeafNodeObj: function(treeValue, objArr) {
            var me = this;
            objArr = objArr || [];
            if (!treeValue) {
                return;
            }

            var treeValueArr = [];
            // 对象转换为数组
            if ($.isNull(treeValue)) {
                treeValueArr = [];
            } else if ($.isArray(treeValue)) {
                treeValueArr = treeValue;
            } else {
                treeValueArr.push(treeValue);
            }

            for (var i = 0; i < treeValueArr.length; i++) {
                if (treeValueArr[i].children) {
                    me._getLeafNodeObj(treeValueArr[i].children, objArr);
                } else {
                    objArr.push(treeValueArr[i]);
                }
            }
            return objArr;
        }
    });

    /**
     * 创建树
     * @name Sweet.tree.Tree
     * @class
     * @extends Sweet.tree
     * @requires <pre>
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.tree.js
     * </pre>
     * @example
     * <pre>
     *  var data = [{"value":"1", "text":"ONE","children":["text":"ONE_ChildOne","value":"11"]},
     *                {"value":"2", "text":"TWO"},
     *                {"value":"3", "text":"THREE"},
     *                {"value":"4", "text":"FOUR"}];
     *  new Sweet.tree.Tree({
     *               width : 150,
     *               height : 350,
     *               multi : true,
     *               data : data,
     *               renderTo :"sweet-tree"
     *           });
     * </pre>
     */
    Sweet.tree.Tree = $.sweet.widgetTreeTree;
}(jQuery));

/**
 * @fileOverview 折线图
 * @date 2013/02/28
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 创建拓扑图
 * @name Sweet.chart.Topology
 * @class 
 * @extends Sweet.chart
 * @requires  
 * <pre>
 * jquery.ui.core.js
 * jquery.ui.widget.js
 * jquery.sweet.widget.js
 * jquery.sweet.widget.chart.js
 * </pre>
 * @example 
 * <pre>
 *  var data = [{
 *                   id: "node1111",
 *                  text: "test1",
 *                   icon: "server.png",
 *                   connect: [{
 *                           id: "node33333",
 *                           label:"skjdknwjk\n我非要大果的的",
 *                           currentTask : "true"
 *                   },
 *                   {
 *                       id:"node44444",
 *                       label: "lsjdj我扔的遥枯，\n枯枯妻"
 *                   }]
 *               },
 *               {
 *                   id: "node2222",
 *                   text: "test2",
 *                  icon: "server.png",
 *                  connect: [{
 *                          id: "node33333",
 *                          label:"skjdksjdkjsnvnnwjk\n我非要大"
 *                 },
 *                   {
 *                       id:"node44444",
 *                       label: "lsjdj我嘌和靣 \n在揪扔的遥枯\n唱片的遥"
 *                   }]
 *               },
 *               {
 *                   id: "node33333",
 *                   text: "BKPI.............\n文件影响大小：\ndddddddd",
 *                   icon: "",
 *                   shape: "Rect",
 *                   connect: [{
 *                           id: "node55555",
 *                           label:"大帅哥果的的"
 *                   }]
 *               },
 *               {
 *                  id: "node44444",
 *                   text: "BKPI...失持..........文件影响\n大小：。",
 *                   icon: "",
 *                   shape: "Rect",
 *                   connect: [{
 *                           id: "node55555",
 *                           label:"大帅哥果的的"
 *                   }]
 *               },
 *               {
 *                   id: "node55555",
 *                   shape: "Rect",
 *                   icon: "server.png",
 *                   text: "jshfd s 的手霜顶号别玩"
 *               }];
 *  sweetTopo = new Sweet.chart.Topology({
 *      width : "100%",
 *      height : 600,
 *      data : data,
 *      renderTo : "sweet-topo"
 * });
 * </pre>
 */
(function( $, undefined ) {
    var defaultInfo = {
        minTextWidth : 150,
        textHeight: 30,
        /**鼠标悬停在拓扑图节点上时的鼠标形状，默认为小手状*/
        cursorType: "pointer",
        //连线的颜色
        lineColor : "#d2d2d2",
        //连线上的字符颜色
        textOnLineColor : "#d2d2d2",
        paddingLeftZoom : 75,
        paperHeight : 6000,
        paperWidth : 8000,
        currentTaskConfig:{
            textOnLineColor : "#0084d8",
            lineColor : "#0084d8"
        },
        font : {
            size : 12,
            rollSize : 12,
            family : "Tahoma"
        },
        stroke : {
            width : 2,
            rollWidth : 2,
            rollColor : "#84aed9"
        },
        zoomAction : {
            zoomIn : "zoomin",
            zoomOut : "zoomout"
        }
    };
    var topoElClass = "sweet-chart-topology-El";
    var topoNodeClass = "sweet-chart-topology-node";
    var topoArrowLineClass = "sweet-chart-topology-arrow-line";
    var topoNodeRectClass = "sweet-chart-topology-node-rect";
    var topoBoardClass = "sweet-chart-topology-board";
    var topoNodeClickClass = "sweet-chart-topology-node-click";
    var topoNodeDBClickClass = "sweet-chart-topology-node-dblclick";
    var topoNodeActiveClass = "sweet-chart-node-active";
    var topoStartHighLightClass = "sweet-chart-node-start-highlight";
    //有image，但是没有边框时
    var topoNodeImgClass = "sweet-chart-topology-node-img";
    //有边框且只有label，没有image时
    var topoNodeLabelClass = "sweet-chart-topology-node-label";
    var topoZoomInClass = "sweet-chart-topology-zoom-in";
    var topoZoomOutClass = "sweet-chart-topology-zoom-out";
/**
 * 创建拓扑图的数据结构如下：
 * var data = [{
 *     id : "node1",
 *     text: "BKPI表名：...，影响行数：...",
 *     shape: "Rect",
 *     icon: "unit.gif",
 *     data : "",    // 此节点的其它信息，可以是对象或数组等
 *     connect: [{
 *         id: "node4",
 *         label: "文件大小：..."
 *     },
 *     ...
 *     ]
 * },
 * ...
 * ];
 * */
$.widget( "sweet.widgetChartTopology", $.sweet.widgetChart, /** @lends Sweet.chart.Topology.prototype*/{
	version : "1.0",
    sweetWidgetName : "[widget-chart-topology]:",
    eventNames : /** @lends Sweet.chart.Topology.prototype*/{
        /**
         * @event
         * @description 节点的点击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前点击的节点的数据信息
         */
        nodeclick: "nodeclick",
        /**
         * @event
         * @description 节点的双击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前点击的节点的数据信息
         */
        nodedblclick : "nodedblclick",
        /**
         * @event
         * @description 节点的单击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前连线的数据信息
         */
        lineclick : "lineclick",
        /**
         * @event
         * @description 连线的双击事件
         * @param {Event} evt 事件对象
         * @param {Object} data 当前连线的数据信息
         */
        linedblclick : "linedblclick"
    },
	options : /** @lends Sweet.chart.Topology.prototype*/{
        /**
         * 拓扑图的布局方向，"H"代表水平方向展开(默认值)，"V"代表垂直方向展开
         * @type String
         * @default "H"
         */
        layoutDirection : "H",
        /**
         * 拓扑图是否可以拖动
         * @type boolean
         * @default true
         */
        draggable : true,
        /**
         * 两个层级之间的最小间距，minGapX是横向的
         * @type number
         * @default 250
         */
        minLevelGapX : 250,
        /**
         * 两个层级之间的最小间距，minGapY表示纵向的
         * @type number
         * @default 250
         */
        minLevelGapY : 250,
        /**
         * 根节点距离边框的距离
         * @type number
         * @default 5
         */
        paddingBorder : 5,
        /**
         * 节点默认的宽度
         * @type number
         * @default 200
         */
        nodeWidth : 200,
        /**
         * 节点默认的高度
         * @type number
         * @default 200
         */
        nodeHeight : 75,
        /**
         * 节点默认的字体大小
         * @type number
         * @default 14
         */
        fontSize : 14,
        /**
         * 两个节点之间的最小间距
         * @type number
         * @default 30
         */
        minNodeGap : 30
    },
    
    /**
     * @private
     * @description 图的点击事件,支持图的钻取
     * @param {Object} evt 图点击节点对象的信息
     */
    _onClick : function(evt) {
        //添加node单击时的样式
        $(this).addClass(topoNodeClickClass);
        
        var node = evt.data.nodeInfo;
        var me = evt.data.me;
        me._trigger("nodeclick", evt, node);
    },
    
    /**
     * @private
     * @description 拓扑图的节点双击事件
     * @param {type} evt 图点击节点对象的信息
     */
    _onDBClick : function(evt){
        //添加node双击时的样式
        $(this).addClass(topoNodeDBClickClass);
    
        var node = evt.data.nodeInfo;
        var me = evt.data.me;
        me._trigger("nodedblclick", evt, node);
    },
    
	/**
     * 
     * @private
     * @param {String/Array} eName 事件名称
     * @param {type} events  整个事件集合
     * @param {type} id   移除事件的对象id
     * @description 移除对应的事件
     * @returns {undefined}  无
     */
    _subRemoveListener : function(eName, events, id){
        var nameEvt = "";
        if(eName === events.nodeclick){
            nameEvt = "click";
            $("#" + id + " ." + topoNodeClass).unbind(nameEvt);
        } else if(eName === events.nodedblclick){
            nameEvt = "dblclick";
            $("#" + id + " ." + topoNodeClass).unbind(nameEvt);
        }
    },
            
    /**
     * @private
     * @description 去激活注册事件
     * @param {String} eName 移除事件的名称，不会传递时，表示全部移除
     */
    _removeListener: function(eName) {
            var me = this;
            var topoId = me.topoId;
            if(!eName || eName === ""){
                me.handlers = me.handlers || {};
                $.each(me.handlers, function(eventName, func) {
                    me._subRemoveListener(eventName, me.eventNames, topoId);
                    
                    //去除连线上的监听事件
                    me.lineClickEvent = {};
                    me.lineDblclickEvent = {};
                });
            } else {
                me._subRemoveListener(eName, me.eventNames, topoId);
                //去除所有点的连线单击或双击事件
                if(eName === me.eventNames.lineclick){
                    me.lineClickEvent = {};
                } else if(eName === me.eventNames.linedblclick){
                    me.lineDblclickEvent = {};
                }
            }
            
    },
            
    /**
     * @private
     * @description 注册事件
     */
    _addListener : function(){
        var me = this;
        var topoId = me.topoId;
        var data = me.options.data;
        $.each(me.handlers, function(eventName, func) {
            /**节点的单击和双击事件*/
            var nameEvt = "";
            if(eventName === me.eventNames.nodeclick || eventName === me.eventNames.nodedblclick){
                nameEvt = "";
                if(eventName === me.eventNames.nodeclick){
                    nameEvt = "click";
                } else if(eventName === me.eventNames.nodedblclick){
                    nameEvt = "dblclick";
                }
                var node = $("#" + topoId + " ." + topoNodeClass);
                if(node.length > 0){
                    node.unbind(nameEvt);
                    node.bind(nameEvt, {"func": func, "nodes":data}, function(evt){
                        //添加node单击时的样式
                        $(this).addClass(topoNodeClickClass);
                        var func = evt.data.func;
                        var nodeInfo = evt.data.nodes;  //所有的Nodes信息
                        var curNodeId = $(evt.currentTarget).attr("node-id");  //取得当前node对象的id
                        var curNode;    //当前对象节点信息
                        for(var i = 0; i < nodeInfo.length; i++){
                            if(curNodeId === nodeInfo[i].id){
                                curNode = nodeInfo[i];
                            }
                        }
                        func(evt, curNode);
                    });
                }
            }
            /**节点连线的单击和双击事件*/
            else if(eventName === me.eventNames.lineclick || eventName === me.eventNames.linedblclick){
                nameEvt = "";
                if(eventName === me.eventNames.lineclick){
                    nameEvt = "click";
                } else if(eventName === me.eventNames.linedblclick){
                    nameEvt = "dblclick";
                }
                for(var i = 0; i < data.length; i++){
                    var temp = data[i];
                    if(temp.connect && temp.connect.length > 0){
                        var tempConnect = temp.connect;
                        for(var j = 0; j < tempConnect.length; j++){
                            //节点连线和连线上的字符串单击和双击都生效
                            if(tempConnect[j].nodeLinePath){
                                if(nameEvt === "click"){
                                    me.lineClickEvent[temp.id] = func;
                                } else if(nameEvt === "dblclick"){
                                    me.lineDblclickEvent[temp.id] = func;
                                }
                            }
                        }
                    }    //end the connect for loop
                }     //end the data for loop
            }      //end the else if
        });   //end for $.each
    },
    
    /**
     * @private
     * @description 取得第一层级的节点信息
     * @param {type} nodeData  整个节点集合信息
     * @returns {object} 返回开始层级的节点信息
     */
    _getStartNodes : function(nodeData){
        var startNodes = {};
        var nonStartNodes = [];
        $.each(nodeData.connections, function (key, value) {
            startNodes[key] = true;
            $.each(value, function (index, item) {
                nonStartNodes.push(item.id);
            });
        });

        for (var i = 0; i < nonStartNodes.length; i++) {
            delete startNodes[nonStartNodes[i]];
        }
        return startNodes;
    },
    /**
     * @private
     * @description 对节点进行布局
     * @param {Object} nodeData 创建各节点连线的节点信息
     */
    _layoutNodes : function(nodeData){
        if(!nodeData){
            return;
        }
        var me = this;
        var options = me.options;
        var viewWidth = me.topologyEl.width() - defaultInfo.paddingLeftZoom;
        var viewHeight = me.topologyEl.height();
        
        // 取得根节点，上下布局，就是第一行的节点；左右布局，就是第一列的数据
        var startNodes = me._getStartNodes(nodeData);
        //按层级/列储存节点,nodeList的长度就是层级数
        var nodeList = [];
        //每一个层级的节点信息
        var levelNodes = [];
        // tree size info, root->leaf direction
        var treeMaxWidth = 0;     // max tree width(px), without any padding
        var treeWidth = [];        // width of each level
        //节点数最多的层级的索引
        var treeMaxWidthLevel = 0;
        var levelMaxDeep = [0];   // max deep of each level (px)
        var treeDeep = 0;          // sum of max deep of all levels

        //取得 第一层级的信息
        var nodeObj;
        for (var id in startNodes) {
            levelNodes.push(id);
            nodeObj = me._findObjById(id, me.nodesArr);
            if (options.layoutDirection === "H") {
                treeMaxWidth += nodeObj.height() + options.minNodeGap;
                if (nodeObj.width() > levelMaxDeep[0]) {
                    levelMaxDeep[0] = nodeObj.width();
                }
            } else {
                treeMaxWidth += nodeObj.width() + options.minNodeGap;
                if (nodeObj.height() > levelMaxDeep[0]) {
                    levelMaxDeep[0] = nodeObj.height();
                }
            }
        }
        nodeList.push(levelNodes);
        treeDeep = levelMaxDeep[0];
        treeWidth.push(treeMaxWidth);

        // put all nodes in levels
        var tempParams = me._putNodesToLevel(nodeList, nodeData, {"treeMaxWidth": treeMaxWidth, 
            "treeMaxWidthLevel": treeMaxWidthLevel,"treeWidth": treeWidth, 
            "levelMaxDeep" : levelMaxDeep, "treeDeep" : treeDeep});
        treeMaxWidth = tempParams.treeMaxWidth;
        treeWidth = tempParams.treeWidth; 
        treeMaxWidthLevel = tempParams.treeMaxWidthLevel;
        levelMaxDeep = tempParams.levelMaxDeep;   
        treeDeep = tempParams.treeDeep;
        nodeList = tempParams.nodeList;
        // get level padding
        var levelPadding = me._calcLevelPadding(treeDeep, nodeList, viewWidth, viewHeight);

        // set nodes position
        var levelOffset = defaultInfo.paddingLeftZoom;

        $.each(nodeList, function (level, nodes) {
            // get nodes padding and offset
            var temp = me._calcNodesPadding({"nodes" : nodes, "level" : level}, {"vHeight" : viewHeight,
                "vWidth" : viewWidth}, {"treeMaxWidthLevel" : treeMaxWidthLevel, "treeWidth" : treeWidth});
            var nodePadding = temp.padding ? temp.padding : options.minNodeGap;
            var nodeOffset = temp.offset ? temp.offset : 0;
            //计算每一个节点的坐标值和保存画所有节点需要的最大的宽和高
            me._updateNodePos(nodes, nodeData, levelOffset, nodeOffset, nodePadding);
            //计算每一层级的offset
            levelOffset += levelMaxDeep[level] + levelPadding;
        });
        return;
    },
    
    /**
     * @private
     * @description 确定节点的坐标并保存在对象中
     * @param {object} nodes  需要确定坐标的节点集合
     * @param {object} nodeData  整个节点的集合
     * @param {number} levelOffset  层级之间的offset偏移
     * @param {number} nodeOffset   节点之间的offset偏移
     * @param {number} nodePadding   节点之间的padding间隙
     */
    _updateNodePos : function(nodes, nodeData, levelOffset, nodeOffset, nodePadding){
        var me = this;
        var options = me.options;
        $.each(nodes, function (index, node) {
            var x, y;
            var nodeObj = me._findObjById(node, me.nodesArr);

            if (options.layoutDirection === "H") {
                x = levelOffset;
                y = nodeOffset;
            } else {
                x = nodeOffset;
                y = levelOffset;
            }

            //保存画所有节点需要的最大的宽和高
            if(x > me.maxWidth - nodeObj.width()){
                me.maxWidth = x + nodeObj.width() + 10;
            }
            if(y > me.maxHeight - nodeObj.height()){
                me.maxHeight = y + nodeObj.height() + 10;
            }
            //保存节点的坐标值
            nodeData.nodes[node].pos = {x:x, y:y};
            nodeObj.css("left", x);
            nodeObj.css("top", y);
            //计算下一个节点的offset值
            nodeOffset += nodeObj.height() + nodePadding;
        });
    },
    /**
     * @private
     * @description 将节点分成不同的层级
     * @param {object} nodeList   层级节点的集合
     * @param {object} nodeData  节点信息集合
     * @param {object} params   树中树的宽度，最大层级的宽度和层级的索引等
     * @returns {object}  返回树中分层级后的信息
     */
    _putNodesToLevel : function(nodeList, nodeData, params){
        var me = this;
        var options = me.options;
        var level = 0;  //层级索引
        var levelNodes = [];
        var distinctNodes = {};
        var levelWidth = 0;
        var levelDeep = 0;
        while (true) {
            levelNodes = [];   //层级的节点集合
            distinctNodes = {};
            levelWidth = 0;   //层级宽度
            levelDeep = 0;    //层级深度
            // find all children of nodes in each level
            $.each(nodeList[level], function (index, node){
                $.each(nodeData.connections, function (key, value){
                    if (node === key) {
                        $.each(value, function (index1, node){
                            if (!(node.id in distinctNodes)){
                                levelNodes.push(node.id);
                                distinctNodes[node.id] = true;

                                var nodeObj = me._findObjById(node.id, me.nodesArr);
                                if (options.layoutDirection === "H") {
                                    levelWidth += nodeObj.height();
                                    if (nodeObj.width() > levelDeep) {
                                        levelDeep = nodeObj.width();
                                    }
                                } else {
                                    levelWidth += nodeObj.width();
                                    if (nodeObj.height() > levelDeep) {
                                        levelDeep = nodeObj.height();
                                    }
                                }
                            }
                        });
                    }
                });
            });

            // save current level nodes
            if (levelNodes.length > 0) {
                nodeList.push(levelNodes);
                // size info
                if (levelWidth > params.treeMaxWidth) {
                    params.treeMaxWidth = levelWidth;
                    params.treeMaxWidthLevel = level + 1;
                }
                params.treeWidth.push(levelWidth);
                params.levelMaxDeep.push(levelDeep);
                params.treeDeep += levelDeep;
            } else {
                break;
            }

            level += 1;
        }
        params.nodeList = nodeList;
        return params;
    },
    /**
     * @private
     * @description 计算节点间的offset偏移和padding间距
     * @param {Object} cur 当前node和层级
     * @param {Object} vInfo  view的高度和宽度
     * @param {Object} params  treeWidth和treeMaxWidthLevel
     * @returns {Object}  返回node的offset和padding
     */
    _calcNodesPadding : function(cur, vInfo, params){
        var me = this;
        var options = me.options;
        var nodeOffset = 0;
        var nodePadding = options.minNodeGap;   //节点间最小的间隙
        var nodeLen = cur.nodes.length;    //这一层级节点的个数
        var borders = options.paddingBorder * 2;   //两个padding boder的和
        var levelTreeWid = params.treeWidth[cur.level];    //在level层级下的树的宽度
        if (options.layoutDirection === "H") {
            if (levelTreeWid + options.minLevelGapY * (nodeLen - 1) + borders < vInfo.vHeight - 2) {
                var tempValue = vInfo.vHeight - 2 - borders - levelTreeWid;
                if (nodeLen > 1) {
                    nodePadding = tempValue / (nodeLen - 1);
                }
                else {
                    nodePadding = tempValue;
                }
            }
        }else {
            //竖向时计算offset和padding
            if (levelTreeWid + options.minLevelGapX * (nodeLen - 1) + borders < vInfo.vWidth - 2) {
                var tempWidValue = vInfo.vWidth - 2 - borders - levelTreeWid;
                if (nodeLen > 1) {
                    nodePadding = tempWidValue / (nodeLen - 1);
                }
                else {
                    nodePadding = tempWidValue;
                }
            }
        }
        nodePadding = Math.floor(nodePadding);
        //如果是节点最多的层级，设置paddingBorder
        if (cur.level === params.treeMaxWidthLevel) {
            nodeOffset = options.paddingBorder;
        }
        else {
           nodeOffset = Math.floor(nodePadding / (nodeLen + 1));
           nodePadding = Math.floor((nodePadding * (nodeLen - 1) - nodeOffset * 2) / (nodeLen - 1));
        }
        //在缩放时，没有最小值限制
        if(nodePadding < options.minNodeGap && me.scale === 1){
            nodePadding = options.minNodeGap;
        }
        return {
            offset : nodeOffset,
            padding : nodePadding
        };
    },
    /**
     * @private
     * @description 计算层级之间的padding值
     * @param {number} treeDeep   树的深度
     * @param {Array} nodeList   所的节点的集合
     * @param {number} viewWidth  view的宽度
     * @param {number} viewHeight view的高度
     * @returns {number} 返回层级之间的padding值
     */
    _calcLevelPadding : function(treeDeep, nodeList, viewWidth, viewHeight){
        var me = this;
        var options = me.options;
        var levelPadding = 0;
        if (options.layoutDirection === "H") {
            if (treeDeep + options.minLevelGapX * (nodeList.length - 1) + options.paddingBorder * 2 < viewWidth - 2) {
                levelPadding = (viewWidth - 2 - options.paddingBorder * 2 - treeDeep) / (nodeList.length - 1);
            } else {
                levelPadding = options.minLevelGapX;
            }
            //在缩放时，没有最小值限制
            if(levelPadding < options.minLevelGapX && me.scale === 1){
                levelPadding = options.minLevelGapX;
            }
        }
        else {
            if (treeDeep + options.minLevelGapY * (nodeList.length - 1) + options.paddingBorder * 2 < viewHeight - 2) {
                levelPadding = (viewHeight -2 - options.paddingBorder * 2 - treeDeep) / (nodeList.length - 1);
            } else {
                levelPadding = options.minLevelGapY;
            }
            //在缩放时，没有最小值限制
            if(levelPadding < options.minLevelGapY && me.scale === 1){
                levelPadding = options.minLevelGapY;
            }
        }
        
        return Math.floor(levelPadding);
    },
    /**
     * @private
     * @description 画节点到节点之间的连线和连线上的信息
     * @param {Object} nodeData 创建节点连线的信息
     * @param {boolean} isMove
     */
    _createConnections : function(nodeData, isMove){
        if(!nodeData){
            return;
        }
        var me = this;
        var options = me.options;
        
        // create path
        $.each(nodeData.connections, function (node, children) {
            $.each(children, function (index, target) {
                var x1, x2, y1, y2;
                var srcObj = me._findObjById(node, me.nodesArr);
                var destObj = me._findObjById(target.id, me.nodesArr);

                if (options.layoutDirection === "H") {
                    x1 = nodeData.nodes[node].pos.x + srcObj.width();
                    y1 = nodeData.nodes[node].pos.y + srcObj.height() / 2;

                    x2 = nodeData.nodes[target.id].pos.x;
                    y2 = nodeData.nodes[target.id].pos.y + destObj.height() / 2;
                    
                    //拖动节点时，需要对坐标进行修改
                    if(isMove){
                        if(x1 > x2){
                            x1 = x1 - srcObj.width();
                        } else if(x1 === x2){
                            x1 = x1 - srcObj.width()/2;
                        }
                    }
                }
                else {
                    x1 = nodeData.nodes[node].pos.x + srcObj.width() / 2;
                    y1 = nodeData.nodes[node].pos.y + srcObj.height();

                    x2 = nodeData.nodes[target.id].pos.x + destObj.width() / 2;
                    y2 = nodeData.nodes[target.id].pos.y;
                    
                    //拖动节点时，需要对坐标进行修改
                    if(isMove){
                        if(y1 > y2){
                            y1 = y1 - srcObj.height();
                        } else if(y1 === y2){
                            y1 = y1 - srcObj.height()/2;
                        }
                    }
                }

                // main line
                var line = ["M", x1, y1, "L", x2, y2];

                // create or update path
                if (!("nodeLinePath" in target)) {
                    var lineColor = defaultInfo.lineColor;
                    //这里设置自定义的连线的颜色
                     if(target.currentTask && target.currentTask === "true"){
                         lineColor = defaultInfo.currentTaskConfig.lineColor;
                         me._findObjById(target.id, me.nodesArr).addClass(topoStartHighLightClass);//
                     }
                     
                    target.nodeLinePath = me.R.path(line)
                            .attr({cursor : "pointer",
                                    stroke : lineColor,
                                    title : target.label,
                                    "stroke-width" : defaultInfo.stroke.width,
                                    "arrow-end" : "classic-wide-long"})
                            .mouseover(function(evt){
                                me._arrowLineMouseOver(evt, target);
                            }).mouseout(function(evt){
                                me._arrowLineMouseOut(evt, target);
                            }).click(function(evt){
                                me._arrowLineClick(evt, node, target, me);
                            }).dblclick(function(evt){
                                me._arrowLineDblclick(evt, node, target, me);
                            });
                }
                else {
                    target.nodeLinePath.attr({path:line});
                }
            });
        });
    },
    
    /**
     * @private
     * @description 节点连线上的单击事件
     * @param {object} evt  单击事件的evt
     * @param {string} srcNodeId  连线的开始节点的id
     * @param {object} el  此单击连线的对象
     * @param {object} me  拓扑图的对象
     */
    _arrowLineClick : function(evt, srcNodeId, el, me) {
        var nodes = {};
        var data = me.options.data;
        for(var i = 0; i < data.length; i++){
            if(data[i].id === srcNodeId){
                nodes.startNode = data[i];
            }
            
            if(data[i].id === el.id){
                nodes.endNode = data[i];
            }
        }
        
        if(me.lineClickEvent && me.lineClickEvent[srcNodeId]){
            var func = me.lineClickEvent[srcNodeId];
            if(func){
                func(evt, nodes);
            }
        } else {
            me._trigger("lineclick", evt, nodes);
        }
    },
    
    /**
     * @private
     * @description 节点连线上的双击事件
     * @param {object} evt 双击事件的evt
     * @param {string} srcNodeId  连线的开始节点的id
     * @param {object} el 此双击连线的对象
     * @param {object} me 拓扑图的对象
     */
    _arrowLineDblclick: function(evt, srcNodeId, el, me) {
        var nodes = {};
        var data = me.options.data;
        for(var i = 0; i < data.length; i++){
            if(data[i].id === srcNodeId){
                nodes.startNode = data[i];
            }
            
            if(data[i].id === el.id){
                nodes.endNode = data[i];
            }
        }
        
        if(me.lineDblclickEvent && me.lineDblclickEvent[srcNodeId]){
            var func = me.lineDblclickEvent[srcNodeId];
            if(func){
                func(evt, nodes);
            }
        } else {
            me._trigger("linedblclick", evt, nodes);
        }
    },
            
    /**
     * @private
     * @description 鼠标在节点连线和节点连线的信息上滑过时，连线和信息的样式的改变
     * @param {type} evt  鼠标滑动时的事件对象
     * @param {type} el  当前鼠标滑动时的raphael对象
     */
    _arrowLineMouseOver : function(evt, el){
        var rpath = el.nodeLinePath;
        var rlabel = el.nodeLineLabel?el.nodeLineLabel:null;
        if(el.currentTask && el.currentTask === "true"){
            rpath.attr({"stroke-width": defaultInfo.stroke.rollWidth});
            if(rlabel){
                rlabel.attr({"font-size": defaultInfo.font.rollSize});
            }
        } else{
            rpath.attr({"stroke": defaultInfo.stroke.rollColor, "stroke-width": defaultInfo.stroke.rollWidth});
            if(rlabel){
                rlabel.attr({"stroke": defaultInfo.stroke.rollColor, "font-size": defaultInfo.font.rollSize});
            }
        }
        
        
    },
    
    /**
     * @private
     * @description 鼠标在节点连线和节点连线的信息上滑出时，连线和信息的样式恢复原来的样式
     * @param {type} evt  鼠标滑出时的事件对象
     * @param {type} el  当前鼠标滑出时的raphael对象
     * @returns {undefined}
     */
    _arrowLineMouseOut : function(evt, el){
        var rpath = el.nodeLinePath;
        var rlabel = el.nodeLineLabel?el.nodeLineLabel:null;
        if(el.currentTask && el.currentTask === "true"){
            rpath.attr({"stroke-width": defaultInfo.stroke.width});
            if(rlabel){
                rlabel.attr({"font-size": defaultInfo.font.size});
            }
        } else {
            rpath.attr({"stroke":defaultInfo.lineColor, "stroke-width": defaultInfo.stroke.width});
            if(rlabel){
                rlabel.attr({"stroke":defaultInfo.lineColor, "font-size": defaultInfo.font.size});
            }
        }
    },
            
    /**
     * @private
     * @description 画带有箭头的直线，连接两个节点
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @param {type} size
     * @returns {Object} result
     */
    _getArrowLine : function(x1, y1, x2, y2, size){
        // angle between main line and arrow edge
        var innerAngle = 30;

        var angle = Raphael.angle(x1, y1, x2, y2); // get line angle
        var a1 = Raphael.rad(angle - innerAngle);
        var a2 = Raphael.rad(angle + innerAngle);

        var x2a = x2 + Math.cos(a1) * size;
        var y2a = y2 + Math.sin(a1) * size;
        var x2b = x2 + Math.cos(a2) * size;
        var y2b = y2 + Math.sin(a2) * size;

        var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
        
        return result;
    },
            
    /**
     * @private
     * @description 画节点连线上的信息
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @param {type} text
     * @returns {Object} result
     */
    _getLineLabel : function(x1, y1, x2, y2, text){
        var offset = 7;

        // offset angle
        var angle = Raphael.angle(x1, y1, x2, y2); // get line angle
        var a = Raphael.rad(angle + 90);

        // middle point
        var mx = (x1 + x2) / 2;
        var my = (y1 + y2) / 2;

        var tx = mx + Math.cos(a) * offset;
        var ty = my + Math.sin(a) * offset;

        var result = ["T", tx, ty, "R", angle + 180];

        return result;
    },
            
    /**
     * @parivate
     * @description 画节点前的准备工作
     * @returns {undefined}
     */
    _prepare : function(){
        var me = this;
        if (me.topologyPaper.length === 0) {
            return;
        }
        // clear all dom
        me.topologyPaper.empty().css("overflow", "hidden");

        // add a board
        me.topoBoard = $('<div class=' + topoBoardClass + ' ></div>').appendTo(me.topologyPaper);
    },
    
    /**
     * @private
     * @description 创建各个节点
     */
    _createNodes : function(){
        var me = this;
        var data = me.options.data;
        if (data.length <= 0) {
            return false;
        }

        // templates
        var tShape = '<div node-id="[id]">[content]</div>';
        var tImage = '<img src="[icon]"/>';
        var tLabel = '<label style="display: block; cursor: pointer;">[label]</label>';

        // create
        for(var i = 0; i < data.length; i++){
            var img = "";
            var text = "";
            var shape = "";
            var content = "";
           
            // fill info
            if (data[i].icon && data[i].icon !== "") {
                img = tImage.replace("[icon]", data[i].icon);
                content += img;
            } else{
                if(data[i].shape && data[i].shape !== ""){
                    tLabel = '<label class="' + topoNodeLabelClass  + 
                            '" style="display: block; cursor: pointer;">[label]</label>';
                }
            }

            if (!$.isNull(data[i].text)) {
                //对外现在都用<br>"进行换行
                data[i].tips = data[i].text;
                text = tLabel.replace("[label]", data[i].text);
                content += text;
            }

            shape = tShape.replace("[content]", content);
            shape = shape.replace("[id]", data[i].id);

            // node append to holder
            var obj = $(shape);
            var fontSize = me.options.fontSize + "px";
            obj.css({position: "absolute", cursor: defaultInfo.cursorType, "font-size": fontSize})
                    .addClass(topoNodeClass);
            if(!$.isNull(data[i].icon) && (!data[i].shape) || data[i].shape === ""){
                obj.addClass(topoNodeImgClass);
            }
            
            // adjust
            if (!$.isNull(data[i].shape)) {
                obj.addClass(topoNodeClass + "-" + data[i].shape.toLowerCase())
                .css("min-width", defaultInfo.minTextWidth.toString() + "px")
                .width(me.options.nodeWidth).height(me.options.nodeHeight);
            }
            
            //tips,提示，显示全部的内容
            obj.attr("title", data[i].tips).css("overflow", "hidden");
            
            /**为节点绑定单击和双击事件*/
            obj.bind("click", {"nodeInfo": data[i], "me": me}, me._onClick)
                    .bind("dblclick", {"nodeInfo": data[i], "me": me}, me._onDBClick)
                    .bind("mouseover", me._nodeMouseOver)
                    .bind("mouseout", me._nodeMouseOut);
            // render to holder
            obj.appendTo(me.topoBoard);
            // 保存每一个node对象
            me.nodesArr.push({
                id : data[i].id,
                obj : obj
            });
        }

        return true;
    },
    
    /**
     * @private
     * @description 节点mouse over时处理函数
     * @param {Object} evt  mouse over事件
     */
    _nodeMouseOver : function(evt){
        $(evt.currentTarget).addClass(topoNodeActiveClass);
    },
    /**
     * @private
     * @description 节点mouse out时处理函数
     * @param {Object} evt  mouse out事件
     */
    _nodeMouseOut : function(evt){
        $(evt.currentTarget).removeClass(topoNodeActiveClass);
    },
    /**
     * @parivate
     * @description 创建js版拓扑图
     */
    _createJsChart : function() {
        var me = this;
        me.nodesArr = [];
        var options = me.options;
        var topoId = me.topoId = options.id + "-topology";
		var id = me.id = options.id + "-paper";
        //画所有节点时画布的最大宽度和高度
        me.maxWidth = 0;
        me.maxHeight = 0;
        me.scale = 1;      //默认为全图显示，无缩放图
        me.minNodeGap = me.options.minNodeGap;
        me.minLevelGapX = me.options.minLevelGapX;
        me.minLevelGapY = me.options.minLevelGapY;
        //记录连线的单击或双击事件的node的addListener的回调函数
        me.lineClickEvent = {};
        me.lineDblclickEvent = {};
       
        var topologyEl = me.topologyEl = $("<div>").attr({id: topoId})
                .addClass(topoElClass);
        
        //画布容器
        var topologyPaper = me.topologyPaper = $("<div>").attr({id : id}).appendTo(topologyEl)
                .width(defaultInfo.paperWidth).height(defaultInfo.paperHeight).css({overflow:"visible"});
        me.board = id + " ." + topoBoardClass;
        /**创建节点div的容器*/
        me._prepare();
        
        // 初始化 raphael,保存在me中
        me.R = new Raphael(topologyPaper[0], topologyPaper.width(), topologyPaper.height());
        var tempSVG = me.topoSVG = $("#" + id + " >svg");
        tempSVG.css("overflow", "visible");
        
        /**没有数据，直接返回*/
        if(!me.options.data || me.options.data.length <= 0){
            return;
        }
        
        me._createNodesLine();
    },
    
    /**
     * @private
     * @description 创建节点和节点连线
     * @returns {undefined} 无
     */
    _createNodesLine : function(){
        var me = this;
        /**将数据结构进行转换*/
        me.nodeData = me._transData(me.options.data);
        
        /**重新绘制缩放工具按钮*/
        me._drawZoomIcon();
        
        /**重新创建各个节点*/
        me._createNodes();
        
        var nodesArr = me.nodesArr;
        //添加延时，否则有可能布局时拿不到宽度和高度(chrome)
        setTimeout(function(){
            //添加stetimeout和移动到此处计算这些值，是因为在chrome上处理延时，计算不出这些值
            var data;
            var obj;
            for(var i = 0; i < me.options.data.length; i++){
                data = me.options.data[i];
                obj = me._findObjById(data.id, nodesArr);
                //缩放时需要使用
                data.domInfo = {
                    divHeight : obj.height(),
                    divWidth : obj.width()
                };
                //设置image的宽高
                if (data.icon && data.icon !== "") {
                    var imgObj = obj.find("img");
                    data.domInfo.imgHeight = imgObj.height();
                    data.domInfo.imgWidth = imgObj.width();
                }
            }
            
            //重新对创建好的各节点进行布局
            me._layoutNodes(me.nodeData);

            //重新画连接节点之间的连线和标注label信息
            me._createConnections(me.nodeData);
            //支持节点的拖动
            if(me.options.draggable){
                var tempNode = $("#" + me.topoId + " ." + topoNodeClass);
                tempNode.draggable();
                tempNode.on("drag", {"me": me}, me._topologyNodeMove);
            }
            //整个画布的拖动
            me.topologyPaper.draggable();
            me.topologyPaper.on("drag", {"me": me}, me._topologyPaperMove);
            // 注册事件
            me.addListener();
        }, 200);
    },
            
    /**
     * @private
     * @description 用户点击缩放按钮后，对图进行重新的绘制
     * @param {string} zoomAction 其值为"in"或"out","in"表示缩小
     * @param {object} me 拓扑图的对象 
     */
    _zoomer : function(zoomAction, me){
        var data = me.options.data;
        var scale = 1;
        var topoHeight = me.topologyEl.height();
        var topoWidth = me.topologyEl.width();
        var minWidthDiv = 15;  //当有图片时，最小宽度和高度
        
        if(zoomAction === defaultInfo.zoomAction.zoomIn){
            var scaleX = topoWidth/me.maxWidth;
            var scaleY = topoHeight/me.maxHeight;
            if(scaleX < scaleY){
                scale = scaleX;
            } else {
                scale = scaleY;
            }
        } else {
            scale = 1;
        }
        me.scale = scale;    //记录当前的缩放数值
        
        me.topologyPaper.css({top: 0, left: 0});
        me.options.minNodeGap = me.minNodeGap*scale;
        me.options.minLevelGapX = me.minLevelGapX*scale;
        me.options.minLevelGapY = me.minLevelGapY*scale;
        //计算缩放字体的大小
        var scaleFont = me.options.fontSize * scale;
        $("#" + me.topoId + " ." + topoNodeClass).css({"font-size": scaleFont});
        
        var tempNodeDom;
        var node;
        var nodeObj;
        var imgObj;
        var tempConnect;
        for(var i = 0; i < data.length; i++){
            node = data[i];
            tempNodeDom = node.domInfo;
            nodeObj = $("div[node-id=" + node.id + "]");
            nodeObj.width(tempNodeDom.divWidth*scale < minWidthDiv ? minWidthDiv : tempNodeDom.divWidth*scale)
                    .height(tempNodeDom.divHeight*scale < minWidthDiv ? minWidthDiv : tempNodeDom.divHeight*scale);
            if(node.icon && node.icon !== ""){
                imgObj = nodeObj.find("img");
                imgObj.width(tempNodeDom.imgWidth*scale < minWidthDiv ? minWidthDiv : tempNodeDom.imgWidth*scale)
                        .height(tempNodeDom.imgHeight*scale < minWidthDiv ? minWidthDiv : tempNodeDom.imgHeight*scale);
            }
            //更新节点连线上的文字的大小
            if(node.connect && node.connect.length > 0){
                for(var j = 0; j < node.connect.length; j++){
                    tempConnect = node.connect[j];
                    if(tempConnect.nodeLineLabel){
                        tempConnect.nodeLineLabel.attr("font-size", defaultInfo.font.size*scale);
                    }
                }
            }
        }
        
        /**将数据结构进行转换*/
        var nodeData = me._transData(data);
        
        setTimeout(function(){
            //对创建好的各节点进行布局
            me._layoutNodes(nodeData);
            //连接节点之间的连线和标注label信息
            me._createConnections(nodeData);
        }, 200);
        
    },
    
    /**
     * @private
     * @description  根据id去找到相应的jquery对象
     * @param {type} id   node的id值
     * @param {type} arr  保存的所有node对象数组
     * @returns {object}  返回相应id的node对象   
     */
    _findObjById : function(id, arr){
        for(var i = 0; i < arr.length; i++){
            if(id === arr[i].id){
                return arr[i].obj;
            }
        }
    },
            
    /**
     * @private
     * @description 将数据进行转换成内部格式
     * @param {type} data 需要转换的数据
     * @returns {_L16.Anonym$0._transData.nodeData}
     */
    _transData : function(data){
        if(data && data.length <= 0){
            return null;
        }
        var nodeData = {};
        nodeData.nodes = {};
        nodeData.connections = {};
        for(var i = 0; i < data.length; i++){
            var temp = data[i];
            nodeData.nodes[temp.id] = temp;
            if(temp.connect){
                nodeData.connections[temp.id] = temp.connect;
            }
        }
        
        return nodeData;
    },
            
    /**
     * @private
     * @description 创建缩放按钮工具
     */
    _drawZoomIcon : function(){
        var me = this;
        var options = me.options;
        var zoomInIcon = $("<div>").addClass(topoZoomInClass).appendTo(me.topologyEl)
            .click(function(evt){
                zoomInIcon.hide();
                zoomOutIcon.show();
                
                //重新进行绘制相应的节点,进行缩小动作
                me._zoomer(defaultInfo.zoomAction.zoomIn, me);
            });
        
        var zoomOutIcon = $("<div>").addClass(topoZoomOutClass).appendTo(me.topologyEl)
            .click(function(evt){
                zoomInIcon.show();
                zoomOutIcon.hide();
                
                //重新进行绘制相应的节点,进行放大动作
                me._zoomer(defaultInfo.zoomAction.zoomOut, me);
            });
        
        //最开始的时候显示为zoom in,即全部显示
        zoomInIcon.show();
        zoomOutIcon.hide();
        
    },
            
    /**
     * @private
     * @description  拖动整个画节点的画布
     * @param {Event} event 拖动事件的对象
     * @param {Object} ui  拖动的整个画布对象
     */
    _topologyPaperMove : function(event, ui) {
        var me = event.data.me;
        var svg = $("#" + me.id + ">svg");
        $("#" + me.board).css("left", svg.css("left")).
            css("top", svg.css("top"));
    },
            
    /**
     * @private
     * @description 拖动拓扑图上的节点事件
     * @param {Event} event 拖动事件的对象
     * @param {Object} ui 拖动的节点对象  
     */
    _topologyNodeMove : function(event, ui){
        var me = event.data.me;
        var node = $(event.currentTarget);
        //拖动后的鼠标的坐标值
        var left = ui.position.left;
        var top = ui.position.top;
        var id = node.attr("node-id");
        
        var nodeData = me.nodeData;
        //更新节点的坐标值
        nodeData.nodes[id].pos = {
            x: left,
            y: top
        };
        
        var nodeObj = $("div[node-id=" + id + "]");
        nodeObj.css("left", left);
        nodeObj.css("top", top);
        
        //重新绘制节点连线
        me._createConnections(nodeData, true);
    },
    
    /**
     * @public
     * @description 设置数据
     * @param {Array} data 节点数据及节点关系的描述
     */
    setData : function(data){
        if(!data || data.length <= 0){
            return;
        }
        
        var me = this;
        delete me.nodeData;
        delete me.options.data;
        me.options.data = data;
        me._reDraw();
    },
            
    /**
     * @parivate
     * @description 渲染折线图到相应的到div
     */
    _chartRender : function() {
		if(this.rendered || $.isNull(this.topologyEl)){
			return;
		}
        
        this.topologyEl.appendTo(this.chartEl);
    },
	
    /**
     * @parivate
     * @description 组件宽度、高度发生变化后调用，进行页面重绘。
     */
    _doLayout : function() {
        var me = this;
		if(!me.options.renderTo || me.options.renderTo === ""){
			return;
		}
        
        // 为topoEl设置宽度和高度
        me.topologyEl.width(me.chartEl.width());
        me.topologyEl.height(me.chartEl.height());
	},
	
    /**
     * @private
     * @description 容器改变大小后，重新绘制图
     * @returns {undefined}
     */
    _reDraw : function(){
        var me = this;
        me.removeListener();
        // 清空svg和board下的dom
        me.chartEl.empty();
        me.options.minNodeGap = me.minNodeGap;
        me.options.minLevelGapX = me.minLevelGapX;
        me.options.minLevelGapY = me.minLevelGapY;
        
        //重新绘制节点及连线信息
        me._createJsChart();
        me.topologyEl.appendTo(me.chartEl);
    },
            
    /**
     * @parivate
     * @description 创建flash版event图
     */
    _createFlashChart : function() {
    
    }
});

// 拓扑图组件
Sweet.chart.Topology = $.sweet.widgetChartTopology;

}( jQuery ) );

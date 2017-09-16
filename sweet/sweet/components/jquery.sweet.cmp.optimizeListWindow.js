/**
 * Created with JetBrains PhpStorm.
 * Date: 14-1-7
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 */

(function($){


    var listWinSelectBtn = "sweet-cmp-listwin-select_btn",
        listWinSelectDivClass = "sweet-cmp-listwin-select",
        listWinSelectTreeDivClass = "sweet-cmp-listwin-select-tree",
        listWinSelectLeft = "sweet-cmp-listwin-select-left",
        listWindTitleClass = "sweet-cmp-listwin-title",
        containerLeft = "sweet-cmp-optimizelist-div-left",
        containerRight = "sweet-cmp-optimizelist-div-right",
        containerMiddle = "sweet-cmp-optimizelist-div-middle";

    var keyTreeType = "tree",
        keyListType = "list",
        keyID = 'id',
        keySrcContainerID = "srcContainer_",
        keyDestContainerID = "destContainer_";


    $.widget("sweet.cmpOptimizeListWindow", $.sweet.widgetCmp, /** @lends Sweet.cmp.OptimizeListWindow.prototype*/{
        version: "1.0",
        eventNames : /** @lends Sweet.cmp.OptimizeListWindow.prototype*/{
            /**
             * @event
             * @description 源搜索事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            fromSearch : "源搜索事件",
            /**
             * @event
             * @description 目标搜索事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            toSearch : "目标搜索事件",
            /**
             * @event
             * @description 双向列表节点编辑事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            nodeEdit : "双向列表节点编辑事件",
            /**
             * @event
             * @description 右移前事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            beforeLeftToRight : "右移前事件",
            /**
             * @event
             * @description 左移前事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            beforeRightToLeft : "左移前事件",
            /**
             * @event
             * @description 右移后事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            afterLeftToRight : "右移后事件",
            /**
             * @event
             * @description 左移后事件
             * @param {Object} evt 事件对象
             * @param {Object/Array} data 当前选中的数据
             */
            afterRightToLeft : "左移后事件"
        },
        sweetWidgetName : "[widget-cmp-optimizeListWindow]",
        type : "listwindow",
        options:{
            /**
             * 数据类型，可选值为： "list", "tree"
             * @type string
             * @default "tree"
             */
            type : 'tree',
            /**
             * 左边的标题
             * @type string
             * @default ""
             */
            fromTitle : '',
            /**
             * 右边的标题
             * @type string
             * @default ""
             */
            toTitle : '',
            hidden : false,
            /**
             * 是否有图标
             * @type boolean
             * @default true
             */
            icon : true,
            /**
             * 是否带搜索框功能
             * @type boolean
             * @default true
             */
            search : true,
            /**
             * 初始加载数据后，节点是否是展开
             * @type boolean
             * @default false
             */
            expand : false,
            /**
             * 数据结构是否是树结构，默认是树结构的
             * @type boolean
             * @default true
             */
            useTreeStruct : true,
            /**
             * 双向列表中间的移动button的宽度
             * @type number
             * @default 60
             */
            btnWidth : 60
        },

        _createCmpWidget : function()
        {
            this._createChildren();
        },

        _createChildren : function()
        {
            var self = this,
                options = self.options,
                srcContainerId = keySrcContainerID + self.uuid,
                destContainerId = keyDestContainerID + self.uuid;

            var table = this.table = $("<table>").attr({cellspacing: 0, border: 0}).appendTo(self.cmpEl),
                tr = $("<tr>").appendTo(table),
                tdSrc = $("<td>").appendTo(tr),
                tdMiddle = $("<td>").appendTo(tr),
                tdDest = $("<td>").appendTo(tr);

            //在这里定义所有的组件
            var divMiddle = this.divMiddle = self._createSeletPanel().appendTo(tdMiddle),
                //左侧标题
                srcTitle = this.srcTitle =  $("<span>")
                                .addClass(listWindTitleClass)
                                .text(self.options.fromTitle).appendTo(tdSrc),

                //左侧标题; //右侧标题
                destTitle = this.destTitle = $("<span>")
                                .addClass(listWindTitleClass)
                                .text(self.options.toTitle).appendTo(tdDest),

                divSrc = this.divSrc = $("<div />")
                    .addClass(containerLeft)
                    .attr("id", srcContainerId)
                    .appendTo(tdSrc),

                divDest = this.divDest = $("<div />")
                    .addClass(containerRight)
                    .attr("id", destContainerId)
                    .appendTo(tdDest);

            if("" == self.options.toTitle && "" == self.options.fromTitle){
                srcTitle.css('display', 'none');
                destTitle.css('display', 'none');
            }
        },

        //设置到左侧数据
        setData : function(data)
        {
            var self = this,
                options = self.options,
                type = options.type;
            options.data = data;
            if(this.srcList){
                this.srcList.setData(data);
            }
        },

        setRightData : function(data){
            var self = this,
                options = self.options;
            options.rightData = data;
            if(self.destList){
                self.destList.setData(data);
            }
        },

        _getValue : function()
        {
            return this.destList.getData();
        },

        _createSeletPanel: function() {
            var self = this,
                options = self.options,
                type = self.options.type,
                isTree = type == keyTreeType;

            var conSelectDiv = $("<div>").addClass(isTree ? listWinSelectTreeDivClass : listWinSelectDivClass).css('width', options.btnWidth),
                selectRight = $("<button>").addClass(listWinSelectBtn)
                    .text(Sweet.constants.listWindowButton.RIGHT).appendTo(conSelectDiv)
                    .bind('click', self.moveToRight.bind(self))
                    .css('width', options.btnWidth),

                selectLeft = $("<button>").addClass(listWinSelectBtn).addClass(listWinSelectLeft)
                    .text(Sweet.constants.listWindowButton.LEFT).appendTo(conSelectDiv)
                    .bind('click', self.moveToLeft.bind(self))
                    .css('width', options.btnWidth),

                selectAllRight = $("<button>").addClass(listWinSelectBtn)
                    .text(Sweet.constants.listWindowButton.ALL_RIGHT).appendTo(conSelectDiv)
                    .bind('click', self.moveAllToRight.bind(self))
                    .css('width', options.btnWidth),

                selectAllLeft = $("<button>").addClass(listWinSelectBtn)
                    .text(Sweet.constants.listWindowButton.ALL_LEFT).appendTo(conSelectDiv)
                    .bind('click', self.moveAllToLeft.bind(self))
                    .css('width', options.btnWidth);

            return conSelectDiv;
        },

        moveToRight : function(evt)
        {
            var self = this,
                options = self.options,
                type = options.type;
            //如果type是list,移动的时候需要删除掉源数据
            var srcData = this.srcList.getValue();
            //判断是否执行
            if(!$.isNull(self.handlers) && !$.isNull(self.handlers['beforeLeftToRight'])){
                if(false === self.handlers['beforeLeftToRight'].call(self.renderEl, evt, srcData)){
                    return;
                }
            }
            self.destList.setData(srcData, true);
            self._triggerHandler(evt, "afterLeftToRight", self.getValue());
        },

        moveToLeft : function(evt)
        {
            var self = this,
                options = self.options,
                type = options.type,
                selectedItems = self.destList.options.selectedItems;
            //判断是否执行
            if(!$.isNull(self.handlers) && !$.isNull(self.handlers['beforeRightToLeft'])){
                if(false === self.handlers['beforeRightToLeft'].call(self.renderEl, evt, selectedItems)){
                    return;
                }
            }
            self.destList.removeSelectedItems();
            self._triggerHandler(evt, "afterRightToLeft", self.getValue());
        },

        moveAllToLeft : function(evt)
        {
            var self = this,
                options = self.options,
                type = options.type;
            if(!$.isNull(self.handlers) && !$.isNull(self.handlers['beforeRightToLeft'])){
                if(false === self.handlers['beforeRightToLeft'].call(self.renderEl, evt, self.getValue())){
                    return;
                }
            }
            self.destList._clearAll();
            self._triggerHandler(evt, "afterRightToLeft", self.getValue());
        },

        moveAllToRight : function(evt)
        {
            var self = this,
                options = self.options,
                type = options.type,
                srcData;
            srcData = $.objClone(self.srcList.options.data);
            if(!$.isNull(self.handlers) && !$.isNull(self.handlers['beforeLeftToRight'])){
                if(false === self.handlers['beforeLeftToRight'].call(self.renderEl, evt, srcData)){
                    return;
                }
            }
            self.destList.setData(srcData);
            self._triggerHandler(evt, "afterLeftToRight", self.getValue());
        },


        _setWH: function(width, height){
            this._setWidth(width);
            this._setHeight(height);
        },

        _setWidth: function(width){
            this.cmpEl.externalWidth(width);
        },

        _getWidth: function(){
            return this.cmpEl.externalWidth();
        },

        _setHeight: function(height){
            this.cmpEl.externalHeight(height);
        },

        _getHeight: function(){
            return this.cmpEl.externalHeight();
        },

        _doLayout : function()
        {
            var self = this,
                padding = 20,
                middleW = parseInt(self.divMiddle.css('width')),
                panelW = Math.floor((self.cmpEl.externalWidth() - middleW - padding) / 2) - 5,
                panelH = self.cmpEl.externalHeight();

            if('none' != self.srcTitle.css('display')){
                panelH -= (parseInt(self.srcTitle.css('height')) + 10);
            }

            self.divSrc.css({ width : panelW, height : panelH });
            self.divDest.css({ width : panelW, height : panelH });

            if(self.srcList){
                self.srcList.setWH(panelW, panelH);
                self.srcList.autoReDraw();
            }
            if(self.destList){
                self.destList.setWH(panelW, panelH);
                self.destList.autoReDraw();
            }
        },

        _render : function(id)
        {
            if(!this._super(id)){
                return false;
            }
            var self = this,
                options = self.options,
                isTree = options.type == keyTreeType,
                srcContainerId = self.divSrc.attr(keyID),
                destContainerId = self.divDest.attr(keyID);

            self.cmpEl.appendTo(self.renderEl);

            //左侧控件
            var srcList = this.srcList = new Sweet.tree.OptimizeTree({
                    renderTo : srcContainerId,
                    search : options.search,
                    icon : options.icon,
                    expand : isTree ? options.expand : false,
                    useTreeStruct : isTree ? options.useTreeStruct : false,
                    multi : true
                }),

                //右侧控件
                destList = this.destList = new Sweet.tree.OptimizeTree({
                    renderTo : destContainerId,
                    search : options.search,
                    icon : options.icon,
                    expand : isTree,
                    useTreeStruct : isTree ? options.useTreeStruct : false,
                    multi : true
                });

            if(options.data && options.data.length > 0)
            {
                srcList.setData(options.data);
            }

            if(options.rightData && options.rightData.length > 0){
                destList.setData(options.rightData);
            }
            this.rendered = true;
            return true;
        }

    });
    /**
     * 优化后的双向列表
     * @name Sweet.cmp.OptimizeListWindow
     * @class 
     * @extends sweet.widgetCmp
     * @requires
     * <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.cmp.js
     * </pre>
     */
    Sweet.cmp.OptimizeListWindow = $.sweet.cmpOptimizeListWindow;
})(jQuery);
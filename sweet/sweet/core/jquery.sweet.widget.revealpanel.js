/**
 * @fileOverview
 * <pre>
 * 看板组件
 * 2015/5/8
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */
(function($, undefined) {
    var cardTitleClass = "sweet-RevealPanelEl-title",
            RevealBodyClass = "sweet-RevealPanelEl-body",
            RevealPanelClass = "sweet-RevealPanelEl-reveal-panel",
            itemSelectedCls = "sweet-RevealSelected-item",
            RevealBlankClass = "sweet-RevealBlankClass-el",
            titleContainer = "sweet-titleContainer-el",
            rowCls = "sweet-reveal-row-el",
            firColu = "sweet-reveal-firstColumn-el",
            blockEl = "sweet-reveal-blockEl-el",
            RevealFirColClass = "sweet-reveal-firstColRow-el",
            RevealHrClass = "sweet-reveal-hR-el",
            RevealPanelSpecClass = "sweet-RevealPanelEl-reveal-special",
            titleHeightMin = 35,
            titleWidthMin = 250,
            rowItemHeightMin = 50,
            rowItemWidthMin = 250,
            rowItemChildWidthMin = 140,
            rowItemChild1HeightMin = 23,
            rowItemChildWidthSingleMin = 50,
            rowItemSpecChildWidthSingleMin = 40,
            rowItemChildWidthSingleAn = 35,
            hRWidthMin = 225;
    $.widget("sweet.widgetRevealPanelEl", $.sweet.widget, /**lends Sweet.RevealCard.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-RevealPanelEl]",
        eventNames: /** @lends Sweet.revealpanel.prototype*/{
            /**
             * @event
             * @description 单击时事件,一般两个参数(evt, data)
             */
            click: "单击事件"
        },
        options: /** @lends Sweet.NumCard.prototype*/{
            /**
             * 宽度
             * @type {Number}
             * @default 400
             */
            width: 400,
            /**
             * 高度
             * @type {Number}
             * @default 380
             */
            height: 380,
            /**
             * 看板显示的值和指标名称 ,data = [{text: "", value: [{value: "value0"}, {value: "value1"}],children[{
                                    childrentext: "业务体验",
                                    childBusiness: " KQI:Voice",
                                    property0: "1/4",
                                    property1: "话务量",
                                    property2: "201"
                                },{
                                    childrentext: "业务体验1",
                                    childBusiness: " KQI:WEB",
                                    property0: "1/4",
                                    property1: "话务量",
                                    property2: "274"
                                },{
                                    childrentext: "业务体验2",
                                    childBusiness: " KQI:SMS",
                                    property0: "4/4",
                                    property1: "话务量",
                                    property2: "365"
                                }]    }, {...}]
             * @type {Object}
             * @default []
             */
            data: []
        },
        /**
         * @private
         * @description 获取组件值
         * @return {Object} 组件值
         */
        _getValue: function() {
            var me = this;
            return $.objClone(me.options.data);
        },
        /**
         * @description 设置看板值,和更新时数据格式一样
         * @param {Array} value 组件对应的数据，格式和配置数据一样
         */
        setValue: function(value) {
            var me = this;
            me.setData(value);
        },
        /**
         * @description 更新看板数据信息
         * @param {Array} data 组件对应的数据，格式和配置数据一样
         */
        setData: function(data) {
            var me = this;
            me.options.data = data;
            if (me.RevealEl) {
               me.RevealEl.remove();
            }
            me._createSweetWidget(me.options.data);
            me._doLayout();
        },
       /**
         * @description 返回组件宽度
         * @return {Number} 返回组件宽度
         */
        _getWidth: function() {
            var me = this;
            me._doLayout();
            return me.RevealEl.width;
        },
        /**
         * @description 返回组件高度
         * @return {Number} 返回组件高度
         */
        _getHeight: function() {
            var me = this;;
             me._doLayout();
            return me.RevealEl.height;
        },
        /**
         * @private
         * @description 设置组件宽度
         * @param {Number/String} width 组件宽度
         */
        _setWidth: function(width) {
            var me = this;
            if (!width || width < 0) {
                return;
            }
            me.RevealEl.width(width);
        },
        /**
         * @private
         * @description 设置组件高度
         * @param {Number/String} height 组件高度
         */
        _setHeight: function(height) {
            var me = this;
            if (!height || height < 0) {
                return;
            }
            me.RevealEl.height(height);
        },
        /**
         * @private
         * @description 组件渲染
         * @param {String} id 宿主ID
         */
       
        _render: function(id) {
            var me = this;
            if (!me._super(id)) {
                return false;
            }
            me.RevealEl.appendTo(me.renderEl);
            me.rendered = true;
            return true;
        },
        /**
         * @private
         * @description 实现widget接口
         */
        _createSweetWidget: function() {
            var me = this;
            //创建看板组件
            me._createRevealPanel(me.options.data);
        },
        /**
         * @private
         * @description 创建看板组件
         * @param {Object} data 组件信息
         */
        _createRevealPanel: function(data) {
            var me = this;
            //最外层容器DIV
            me.RevealEl = $("<div>").addClass(RevealBodyClass).attr("id", me.options.id)
            .height(me.options.height).width(me.options.width);          
            me.datarevealRow  = [];
            if (data.length == 0){
              return;
            }
            for (var i = 0; i < data.length; i++)
            {
                var temp = data[i];
                //主DIV
                var revealPanelEl = $("<div>").attr("id", me.options.id + "-real")
                       .addClass(cardTitleClass).appendTo(me.RevealEl);
                //在标题的容器中设置存放标题内容的容器
                 $("<div>").addClass(titleContainer).text(temp.text).appendTo(revealPanelEl).attr("title", temp.text);
                me._createItemEls(data[i], temp.value); 
               //设置两大块之间的间隔div空白
                if(i < data.length - 1){
                    $("<div>").addClass(RevealBlankClass).appendTo(me.rowEl);
                }
            //判断是否已经进行渲染
               if (me.rendered) {
               me.RevealEl.appendTo(me.renderEl);
            }
            } 
           
        },      
        /**
         * @private
         * @description 创建看板值显示部分
         * @param {Object} datas 组件信息
         * @returns {Array} itemEls 显示部分EL的集合
         */
        _createItemEls: function(data, _v) {
           var me = this;
               //两块面板中的一大块
               me.rowEl = $("<div>").addClass(blockEl).appendTo(me.RevealEl);
               for (var j = 0; j < data.children.length; j++){
                    var temp = data.children[j];
                     //每一大块中的每一行
                    var everEl = $("<div>").addClass(rowCls)
                            .data("rowData", {titleValue: _v, rowData : data.children[j].children.value}).appendTo(me.rowEl)
                            .click(function(e){
                                me.RevealEl.find("." + itemSelectedCls).removeClass(itemSelectedCls);
                                $(this).addClass(itemSelectedCls);  
                               
                               var valueId = $(this).data("rowData");
                               var id = valueId.titleValue;
                               var rowId = valueId.rowData;
                               me.result = "";
							   for (var indexExtern = 0; indexExtern < me.options.data.length; indexExtern++){
                               for(var i = 0; i < me.options.data[indexExtern].children.length; i++){
								   if((id === me.options.data[indexExtern].value) &&( 
								   me.options.data[indexExtern].children[i].children.value === rowId)){
								   var result = JSON.parse(JSON.stringify(me.options.data[indexExtern].children[i].children));
								   var resultBring = JSON.parse(JSON.stringify(me.options.data[indexExtern].dataBring));
								   me.resultData = [result,resultBring];
								   break; 
                                   }
                               }
							  }
                               me._triggerHandler(e, "click", me.resultData);
                                 
                            });
                     //第一列中包含两项的第一行
                    var firstColumn = $("<div>").addClass(firColu).appendTo(everEl);
                    $("<div>").text(temp.children.text).addClass(RevealFirColClass)
                            .appendTo(firstColumn).attr("title", temp.text); 
                    $("<div>").text(temp.children.property0).addClass(RevealPanelClass)
                            .appendTo(everEl).attr("title", temp.property0);
                    if (j < (data.children.length -1)){
                        $("<hr>").addClass(RevealHrClass).appendTo(me.rowEl);
                    }
                }
        },
        
        //组件重绘
        _doLayout: function() {
            var me = this,
                    externWidthCon = 0,
                    externHeightCon = 0;
            // 渲染前禁止进入
                if (!me.rendered) {
                    return;
                }
            if (me.rendered){
            //设置标题和含标题容器的宽高值
            var  titleHeight = $("." + cardTitleClass).height();
               externHeightCon = $("." + RevealBodyClass).height(); 
            //从外部设置组件的高度
               externHeightCon =  me.options.height;
             if (externHeightCon < 380){
             externWidthCon = 380;
            }
           //如果标题的高度不大于最小的高度，那么将标题的高度设置为最小高度，否则按比例设置    
                if (titleHeight <= titleHeightMin){
                    titleHeight = titleHeightMin;
                }else{
                    titleHeight = externHeightCon * 0.0921;    
                }                   
               $("." + cardTitleClass).height(titleHeight);
               $("." + titleContainer).height(titleHeight);
           externWidthCon = $("." + RevealBodyClass).width();
           //从外部设置组件的宽度
           externWidthCon =  me.options.width;
           if (externWidthCon < 400){
            externWidthCon = 400;
           }
          //如果标题的宽度小于最小的宽度，那么将标题的宽度设置为最小宽度，否则按比例进行调整
           var titleWidth = $("." + cardTitleClass).width();
           if (titleWidth < titleWidthMin){
               titleWidth = titleWidthMin;
           }
           else{
               titleWidth = externWidthCon * 0.625;
           }               
           $("." + cardTitleClass).width(titleWidth);
           $("." + titleContainer).width(titleWidth);
         //自适应的设置两大块之间hR的间距的宽度
         var hRWidth = $("." + RevealHrClass).width();
         if (titleWidth < titleWidthMin){
             hRWidth = hRWidthMin;
         }
         else{
            hRWidth =  titleWidth * 0.9;
         }
        $("." + RevealHrClass).width(hRWidth);
         //自适应的设置两大块空白RevealBlankClass_div之间hR的间距的宽度
         var blankWidth = $("." + RevealBlankClass).width();
         if (titleWidth < titleWidthMin){
             blankWidth = titleWidthMin;
         }
         else{
            blankWidth =  titleWidth;
         }
         $("." + RevealBlankClass).width(blankWidth);          
         // 设置看板每一行的宽高值,默认高度为50px,宽度为250px,否则按照比例进行计算
           var rowItemHeight = $("." + rowCls).height();
           if (rowItemHeight < rowItemHeightMin){
               rowItemHeight = rowItemHeightMin;
           }
           else{
               rowItemHeight = externHeightCon * 0.132;               
           }
               $("." + rowCls).height(rowItemHeight);
           var rowItemWidth = $("." + rowCls).width();
           if (rowItemWidth < rowItemWidthMin){
               rowItemWidth = rowItemWidthMin;
           }
               rowItemWidth = externWidthCon * 0.625;
               $("." + rowCls).width(rowItemWidth);    
             }
           //设置包含在看板每一行的子容器的宽高,包含两项叠加的默认宽为80px，单项的默认高为23,宽为50
           var rowItemChildWidth = $("." + firColu).width();
           if (rowItemChildWidth < rowItemChildWidthMin){
               rowItemChildWidth = rowItemChildWidthMin;
           }
           else{
               rowItemChildWidth =  rowItemWidth * 0.56;
           }
               $("." + firColu).width(rowItemChildWidth);
          //单项的默认高为23,宽为50
          var rowItemChildWidthSingle = $("." + RevealPanelClass).width();
           if (rowItemChildWidthSingle < rowItemChildWidthSingleMin){
               rowItemChildWidthSingle = rowItemChildWidthSingleMin;
           }
           else{
               rowItemChildWidthSingle =  rowItemWidth * 0.14;
           }
           if ((externWidthCon < 500) || (externHeightCon < 380)){
           $("." + RevealPanelClass).width(rowItemChildWidthSingleAn);
           }
           else{
           $("." + RevealPanelClass).width(rowItemChildWidthSingle);
           }               
           // 对于设有文字较宽的容器设置宽度
           var rowItemSpecChildWidthSingle = $("." + RevealPanelSpecClass).width();
           if (rowItemSpecChildWidthSingle < rowItemSpecChildWidthSingleMin){
               rowItemSpecChildWidthSingle = rowItemSpecChildWidthSingleMin;
           }
           else{
               rowItemSpecChildWidthSingle =  rowItemWidth * 0.16;
           }
               $("." + RevealPanelSpecClass).width(rowItemSpecChildWidthSingle);

           var rowItemChild1Height = $("." + RevealPanelClass).height();
           if (rowItemChild1Height < rowItemChild1HeightMin){
            rowItemChild1Height =  rowItemChild1HeightMin;  
           }
           else{
            rowItemChild1Height =  rowItemHeight * 0.46;               
           }
           $("." + RevealPanelClass).height(rowItemChild1Height); 
        }
    });

    /*
     * 看板
     * @name Sweet.Reveal
     * @class 
     * @extends Sweet.widget
     * @requires
     * <pre>
     *  jquery.ui.core.js
     *  jquery.ui.widget.js
     *  jquery.sweet.widget.js
     * </pre>
     * @example 
     * <pre>
     * sweetRevealPanel_des = new Sweet.RevealPanel({
     *               id: "RevealPanel_des",
     *              //renderTo: "sweetRevealPanel_des",
     *               width : 400,
     *              height : 380,
     *               data: [
     *              {
     *                   text: "业务体验KQI",
     *                   value : "value0",
     *                   children: [{
     *                               text: "业务体验",
     *                               business: " KQI: Voice",
     *                               property0: "1/4",
     *                               property1: "话务量",
     *                               property2: "201"
     *                           },{
     *                               text: "业务体验1",
     *                               business: " KQI: WEB",
     *                               property0: "1/4",
     *                               property1: "话务量",
     *                               property2: "274"
     *                           },{
     *                               text: "业务体验2",
     *                               business: " KQI: SMS",
     *                               property0: "4/4",
     *                               property1: "话务量",
     *                               property2: "365"
     *                           }],           
     *               },
     *              {
     *                   text: "业务质量KQI",
     *                   value : "value0",
     *                   children: [{
     *                               text: "业务质量",
     *                               business: " KQI: Voice",
     *                               property0: "1/4",
     *                               property1: "话务量",
     *                               property2: "201"
     *                           },{
     *                               text: "业务质量1",
     *                               business: " KQI: WEB",
     *                               property0: "1/4",
     *                               property1: "话务量",
     *                               property2: "274"
     *                           },{
     *                               text: "业务质量2",
     *                               business: " KQI: SMS",
     *                               property0: "4/4",
     *                               property1: "话务量",
     *                               property2: "365"
     *                           }],             
     *               }
     *               ]
     *           });    
     * </pre>
     */
     
      Sweet.RevealPanel = $.sweet.widgetRevealPanelEl;
}(jQuery));
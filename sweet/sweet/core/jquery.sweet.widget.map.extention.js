
(function($, undefined) {
/*
 *@description 地图组件的扩展部分
 */
$.widget.addExtendListener("sweet.widgetMap", function(){
    var me = this, len,lastNum,
        initialLayer,cellLayerKey = "CELLR",
        itemHeight = 26;

    //css menu style
    var areaNamesClass = "sweet-supermap-areaNamesClass",
        menuULClass = "sweet-supermap-menuUL",
        menuLiClass = "sweet-supermap-menuLi",
        menuOverLiClass = "sweet-supermap-menuMouseOverLi",
        liAEIClass = "sweet-supermap-liAEI",
        subMenuLiClass = "sweet-supermap-subLiAEI",
        mItemArrowClass = "sweet-supermap-mItemArrow",
        itemImageClass = "sweet-supermap-itemDefImage",
        itemTextClass = "sweet-supermap-itemText",
        subMenuULClass = "sweet-supermap-subMenuUL",
        subAreaNamesClass = "sweet-supermap-subAreaNamesClass",
        menuDefaultImage = Sweet.libPath + "themes/default/core/images/menu/s.gif",
        itemSelectedImageClass = "sweet-supermap-itemSelectedImage",
        mapContainerId = me.options.id + "-" + "sweet-mapLayerNames",
        subLayerMenuId = me.options.id + "-" + "sweet-mapSubMenuDiv",
        subOldSelectedMenuLiId,
        modifiedTxtFatherLiJq;
    //设置地图菜单
    if(me.options.layersArray){
        len = me.options.layersArray.length;
        if(0 < len){
            lastNum = len -1;
            var layerNamesDiv = me.parentMenuDivEI = $("<div>").addClass(areaNamesClass)
                .attr("id", mapContainerId)
                .appendTo(me.mapContainerEI),
                mapMenuData = me.options.layersArray;
            //创建父菜单
            _creatMenuDiv(layerNamesDiv, mapMenuData, "-father");

            //设置初始渲染的业务图层
            if($.isNotNull(me.options.initialLayer) && $.isNotNull(me.options.initialLayer.value)){
                initialLayer = me.options.initialLayer.value;
            }
            else {
                if($.isNull(me.options.layersArray[lastNum].children)){
                    initialLayer = me.options.layersArray[lastNum].value;
                }
                else{
                    initialLayer = me.options.layersArray[lastNum].children[0].value;
                }
            }
            _setInitialLayer(initialLayer);

            //显示罗盘重新调整样式
            if(me.options.compass){
                var oldLayerTop = layerNamesDiv.offset().top;
                layerNamesDiv.css("margin-top", oldLayerTop - 60);
            }
            var zindex = $.getMaxZIndex(undefined, areaNamesClass);
            me.parentMenuDivEI.css("z-index", zindex)
        }
    }

    /*
     *@private
     *@description 设置初始渲染的业务图层
     *@param {String}data:初始渲染的业务图层的value值
     */
    function _setInitialLayer(data){
        var mapContainerJq = $("#" + mapContainerId),
            li, itemVal;
        if($.isNotNull(data)){
            li = mapContainerJq.find("ul").children("li");
            $.each(li, function(index, nodeli){
                nodeli = $(nodeli);
                itemVal = nodeli.find("span").attr("itemValue");

                if(itemVal === data){
                    nodeli.find("img").addClass(itemSelectedImageClass);
                }
            });
        }
    }

    /*
     *@private
     *@description 创建菜单
     *@param {Object}objDiv:菜单渲染到的div，{Object}data：菜单数据，{String}suffix：菜单区分父子的后缀
     */
    function _creatMenuDiv(objDiv, data, suffix){
        var item,tempItemID,
            ulEl,liEl,liAEI,itemImage,itemText,
            attrMark = suffix.substr(1);

        //添加一行
        ulEl = $("<ul></ul>").addClass(menuULClass).appendTo(objDiv);
        if("child" === attrMark){
            ulEl.addClass(subMenuULClass);
        }
        //添加此行的列
        for (var col = 0; col < data.length; col++) {
            item = data[col];
            tempItemID = me.options.id + "-"  + item.value + suffix ;

            liEl = $("<li>").addClass(menuLiClass).appendTo(ulEl)
                .attr("id", tempItemID)
                .attr({"itemValue": item.value,"itemText":item.text})
                .unbind()
                .bind("click", {"me": me, "id":tempItemID}, _itemClick)
                .bind("mouseover", {"id":tempItemID, "me": me, "index": col+1, "data":item}, _mouseOver)
                .bind("mouseout", {"id":tempItemID, "me":me}, _mouseOut);
            liAEI = $("<a>").attr("href", "#").addClass(liAEIClass).appendTo(liEl);
            if("father" === attrMark){
                liEl.attr("index", col+1);
            }
            if(item.children){
                liAEI.addClass(mItemArrowClass);
                liEl.attr("hasChild", true);
            }
            else{
                liEl.attr("hasChild", false);
            }
            itemImage = $("<img>").addClass(itemImageClass).appendTo(liAEI).attr("src", menuDefaultImage);
            itemText = $("<span>").addClass(itemTextClass).text(item.text).appendTo(liAEI);
            itemText.attr("itemValue", item.value);
        }
    }

    /*
     *@private
     *@description 鼠标浮动在item上事件
     */
    function _mouseOver(event){
        // 当前menu对象
        var parentMenu = event.data.me,
            itemLiDivJq = $("#" + mapContainerId),
            data = event.data.data,
            // 当前item的索引
            index = event.data.index;

        //检查父菜单是否有子菜单，如果没有则关闭子菜单窗口
        if($.isNotNull(parentMenu.subMenuDivEI)){
            parentMenu.subMenuDivEI.removeClass().empty().remove();
        }

        if($.isNotNull(data.children) && 0 < data.children.length){
            var subitemLiTop = (index-1) * itemHeight,
                subitemLiHeight = itemHeight * data.children.length,
                subMenuDivEI = parentMenu.subMenuDivEI = $("<div>").appendTo(itemLiDivJq)
                    .attr("id",subLayerMenuId)
                    .addClass(subAreaNamesClass).show();
            subMenuDivEI.css({"top":subitemLiTop,"height":subitemLiHeight});
            subMenuDivEI.attr("index",index);
            //创建子菜单
            _creatMenuDiv(subMenuDivEI, data.children, "-child");

            if($.isNotNull(subOldSelectedMenuLiId)){
                var subSelectedMenuLiJq = $("#" + subOldSelectedMenuLiId);
                subSelectedMenuLiJq.find("img").addClass(itemSelectedImageClass);
            }
        }
    }

    /*
     *@private
     *@description 鼠标移出item事件
     */
    function _mouseOut(evt){
        var me = evt.data.me,
            id = evt.data.id,
            itemLiDivJq,hasChildVal,
            eachSubMenuli,subMenuLiId,parentMenuLiId;

        if($.isNotNull(id)){
            parentMenuLiId = id;
            itemLiDivJq = $("#" + parentMenuLiId);
            hasChildVal = itemLiDivJq.attr("hasChild");

            if($.isNotNull(me.subMenuDivEI) && "true" === hasChildVal){
                var subMenuLi = me.subMenuDivEI.find("li");

                for(var k= 0;k<subMenuLi.length;k++){
                    eachSubMenuli = $(subMenuLi[k]).addClass(subMenuLiClass);
                    subMenuLiId = eachSubMenuli.attr("id");
                    eachSubMenuli.unbind()
                        .bind("mouseover",{"me":me,"id":subMenuLiId,"parentId":parentMenuLiId}, _submouseOver)
                        .bind("click",{"me":me,"id":subMenuLiId,"parentId":parentMenuLiId}, _itemClick);
                }

                me.subMenuDivEI.find("ul").bind("mouseleave",{"me":me,"parentId":parentMenuLiId}, _submouseOut);
            }
        }
    }

    /*
     *@private
     *@description 子菜单鼠标移出事件
     */
    function _submouseOut(evt){
        var me = evt.data.me,
            parentLiId = evt.data.parentId,
            parentLiJq = $("#" + parentLiId);

        if($.isNotNull(me.subMenuDivEI)){
            parentLiJq.removeClass(menuOverLiClass);
            me.subMenuDivEI.empty().remove();
        }
    }

    /*
     *@private
     *@description 子菜单鼠标移入事件
     */
    function _submouseOver(evt){
        var parentLiId = evt.data.parentId,
            parentLiJq = $("#" + parentLiId);

        parentLiJq.addClass(menuOverLiClass);
    }

    /*
     *@private
     *@description 菜单(子菜单)的点击事件
     */
    function _itemClick(evt){
        var me = evt.data.me,
            itemLiDivID = evt.data.id,
            cellData, alarmData=[],
            modifiedFatherLiText,
            currentName = {"value":"","text":""},
            fatherItemId, fatherItemJq,
            itemLiDivIDArr = itemLiDivID.split("-"),
            itemLiDivIDGeneration = itemLiDivIDArr[itemLiDivIDArr.length-1],
            itemLiDivJq = $("#" + itemLiDivID),
            itemLiSpanJq = itemLiDivJq.find("span"),
            itemLiImageJq = itemLiDivJq.find("img"),
            parentItem = $("#" + mapContainerId),
            hasChildMark = itemLiDivJq.attr("hasChild"),
            itemVal = itemLiSpanJq.attr("itemValue"),
            itemText = itemLiDivJq.attr("itemText"),
            currentNameText = itemLiSpanJq.val();
        //有子菜单的父项不触发click事件
        if("father" === itemLiDivIDGeneration && "true" === hasChildMark){
            return;
        }
        //检查已有被选中项,不是自己的话就删除此选中样式
        if(parentItem.find(itemSelectedImageClass)){
            var tempSelect = parentItem.find("." + itemSelectedImageClass);
            if($.equals(tempSelect, itemLiDivJq)){
                return;
            }
            else{
                tempSelect.removeClass(itemSelectedImageClass);
            }
        }

        //子项选中的时候，父项也必须选中,且父项的内容显示为已选择的子项内容
        if("child" === itemLiDivIDGeneration){
            fatherItemId = evt.data.parentId;
            //含子项的非此li的父类恢复其原始显示内容
            if($.isNotNull(modifiedTxtFatherLiJq) && fatherItemId !== modifiedTxtFatherLiJq.attr("id")){
                modifiedFatherLiText = modifiedTxtFatherLiJq.attr("itemText");
                modifiedTxtFatherLiJq.find("span").text(modifiedFatherLiText);
            }

            fatherItemJq = $("#" + fatherItemId);
            fatherItemJq.find("img").addClass(itemSelectedImageClass);
            itemLiImageJq.addClass(itemSelectedImageClass);

            //父项的内容显示修改为已选择的子项内容
            fatherItemJq.find("span").text(itemText);
            modifiedTxtFatherLiJq = fatherItemJq;
        }

        if("father" === itemLiDivIDGeneration && "false" === hasChildMark){
            //含子项的父类恢复其原始显示内容
            if($.isNotNull(modifiedTxtFatherLiJq)){
                modifiedFatherLiText = modifiedTxtFatherLiJq.attr("itemText");
                modifiedTxtFatherLiJq.find("span").text(modifiedFatherLiText);
            }

            itemLiImageJq.addClass(itemSelectedImageClass);
        }
        //保存已选中项id
        subOldSelectedMenuLiId = itemLiDivID;
        //[begin]根据所选的业务名称的value生成地图业务图层
        me.currentVal = itemVal.toUpperCase();

        if(!$.isNull(me.eventMap.areaChange) && $.isFunction(me.eventMap.areaChange)){
            currentName = me.currentLayerName = {"value":me.currentVal,"text":currentNameText};
            me.eventMap.areaChange(currentName);
            me.highLightLayer.removeAllFeatures();
            //小区级图层渲染
            if(cellLayerKey === me.currentVal){
                cellData = me._getCellData();
                me.creatPointLayer(cellData);
            }
            else{
                //非小区级业务图层渲染
                alarmData = me._getAlarmInfo();
                me._layerChange(itemVal);
                //根据区域告警ID设置告警样式
                if(alarmData && 0 < alarmData.length){
                    me._setAreaAlarmStyle(alarmData);
                }
            }
        }
        //[end]根据所选的业务名称的value生成地图业务图层

        //针对子菜单，阻止触发父菜单的点击事件
        evt.stopPropagation();
    }

    $.extend($.sweet.widgetMap.prototype , {
        /**
         * @public
         * @description 设置当前层级的告警信息
         * @param {Array} data 告警区域信息 例如：
         * data = [{"value":"1089","text":"成功率：96%，通话率：98%，拥塞率：0.00%"}]
         */
        setSurfaceAlarmData: function (data){
            var me = this,
                alarmDetails;

            alarmDetails = [];
            alarmDetails = data;

            if($.isNotNull(alarmDetails)){
                me.alarmArea = alarmDetails;
            }
        },

        /**
         * @public
         * @description 设置小区点的信息
         * @param {Array} data 小区的信息 value:小区id, text:小区提示显示 ,data:小区经纬度，例如：
         * data = [{"value":"01","text":"成功率：96%，通话率：98%，拥塞率：0.00%","data":["x":"112" , "y":"115", "angle":null]}]
         */
        setPointData: function (data){
            var me = this,
                cellData;

            cellData = [];
            cellData = data;
            if($.isNotNull(cellData)){
                me.cellData = data;
            }
        },

        /*
         * @public
         * @description 生成点图层
         * @param {Array} data 小区的信息 value:小区id, text:小区提示显示 ,data:小区经纬度，例如：
         * data = [{"value":"01","text":"成功率：96%，通话率：98%，拥塞率：0.00%","data":["x":"112" , "y":"115", "angle":null]}]
         */
        creatPointLayer:function(data){
            var me = this;
//                point,
//                pointFeature,
//                pointsVector = [],
//                x, y;
//            
//            me.cellFeature = [];
//            me.currentVal = cellLayerKey;
//
//            if(data && 0 < data.length){
//                for(var i = 0; i < data.length; i++){
//                    if($.isNotNull(data[i].data) && $.isNotNull(data[i].data.x)){
//                        x = data[i].data.x;
//                    }
//                    if($.isNotNull(data[i].data) && $.isNotNull(data[i].data.y)){
//                        y = data[i].data.y;
//                    }
//
//                    if($.isNotNull(x) && $.isNotNull(y)){
//                        point = me._getMercatorPoint(x, y);
//                        pointFeature = new SuperMap.Feature.Vector(point);
//                        pointFeature.attributes = {
//                            MARK:"point",
//                            TIPS: data[i].text,
//                            RECID:data[i].value,
//                            NETELEM: data[i].value
//                        };
//                        pointFeature.style = {
//                            pointRadius: 4,
//                            graphic:true,
//                            externalGraphic:me.defaultCellImgPath,
//                            graphicWidth:12,
//                            graphicHeight:12
//                        };
//
//                        pointsVector.push(pointFeature);
//                        me.cellFeature = pointsVector;
//                    }
//                }
                
                //调用flex中的添加小区方法
                me.options.cellData = JSON.stringify(data);               
                if(me.Mapobj){
                    me.Mapobj.addCell(data,"noTest");
                }
                //me.highLightLayer.addFeatures(pointsVector);
               // me.selectFeature.activate();
         //   }
        },

        /**
         * @public
         * @description 移除点图层
         *
         */
        removePointLayer:function(){
            var me = this;
//            if($.isNotNull(me.cellFeature)){
//                me.highLightLayer.removeFeatures(me.cellFeature);
//            }
            //调用flex中的移除小区fang
            if(me.Mapobj){
                me.Mapobj.removePointLayer();
            }
        },

        /**
         * @public
         * @description 业务地图区域定位
         * @param {String/Number}layerId:当前图层的recid
         */
        setPosition: function(layerId){
            var// bounds,
                //featureObj,
                me = this;

            if($.isNull(layerId)){
                return;
            }

//            //刷新样式
//            if($.isNotNull(me.highLightLayer)){
//                me.highLightLayer.removeAllFeatures();
//            }

//            if(cellLayerKey === me.currentVal && me.cellFeature){
//                me._setDefaultCell(me.cellFeature);
//                if(0 < me.cellFeature.length){
//                    for(var k = 0; k < me.cellFeature.length; k++){
//                        featureObj = me.cellFeature[k];
//                        if((featureObj.attributes.RECID + "") === (layerId + "")){
//                            featureObj.style.externalGraphic = me.overCellImgPath;
//                            me.highLightLayer.redraw();
//                            bounds = featureObj.geometry.getCentroid();
//                        }
//                    }
//                }
//            }
//            else{
//                if (me.features) {
//                    me._setDefaultStyle(me, me.features);
//
//                    for(var j = 0; j < me.features.length; j++)
//                    {
//                        featureObj = me.features[j];
//
//                        if((featureObj.attributes.RECID + "") === (layerId + ""))
//                        {
//                            if(featureObj.alarm){
//                                featureObj.style = {
//                                    fillColor: "#DC143C",
//                                    fillOpacity:0.5,
//                                    strokeColor: "#000",
//                                    strokeWidth: 2,
//                                    strokeOpacity:1
//                                };
//                            }
//                            else{
//                                featureObj.style = {
//                                    fillColor: "#00ffff",
//                                    fillOpacity: 0,
//                                    strokeColor:"#000",
//                                    strokeWidth: 2,
//                                    strokeOpacity: 1
//                                };
//                            }
//                            featureObj.style.label = featureObj.attributes.NETELEM;
//                            me.highLightLayer.addFeatures(featureObj);
//                            bounds = featureObj.geometry.getCentroid();
//                            me.highLightLayer.redraw();
//                        }
//                    }
//                }
//            }
//            if(bounds && bounds.x && bounds.y){
//                me.Mapobj.setCenter(new SuperMap.LonLat(bounds.x , bounds.y));
//            }
                if(me.Mapobj){
                    me.Mapobj.setPosition(layerId);
                }
        }
    });
});
}(jQuery));

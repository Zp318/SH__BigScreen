/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var mapInfo = {};
Supermapflex = function(mapObj, id, name, width, height, data, layerLengedInfo,kqiList,isCircle,isFilter,dashboardMapLayer){
    var me = this;
    me.id = id;
    me.name = name;
    me.width = width;
    me.height = height;
    me.data = data;
	me.layerLengedInfo = JSON.stringify(layerLengedInfo);
	me.kqiList = JSON.stringify(kqiList);
	me.isCircle = JSON.stringify(isCircle);
    me.isFilter = JSON.stringify(isFilter);
    me.dashboardMapLayer = JSON.stringify(dashboardMapLayer);
    mapInfo[me.name] = {
        cellData : data,
        layerType : "",
        layerData : [],
        layerDefaultColor : "",
        sweetMapObj : mapObj
    };
    me.init(id, name, width, height, data, me.layerLengedInfo,me.kqiList,me.isCircle,me.isFilter,me.dashboardMapLayer);
};
//动态创建Flex
Supermapflex.prototype.createFlashMove = function(id, sName, src, width, height,data,layerLengedInfo,kqiList,isCircle,isFilter,dashboardMapLayer){
    var fl = document.getElementById(id);
    if (fl === null) {
        var creteFl = document.createElement("div");
        creteFl.id = id;
        id.appendChild(creteFl);
    }
    var divobj = id,
            swfVersionStr = "10.0.0",
            xiSwfUrlStr = src,
            flashvars = {
                width : width,
                height : height,
                sweetDebug : sweetDebug,
                data : data,
				layerLengedInfo : layerLengedInfo,
				kqiList:kqiList,
				isCircle : isCircle,
                isFilter : isFilter,
                dashboardMapLayer : dashboardMapLayer
            },
            params = {
                quality : "high",
                bgcolor : "#ffffff",
                allowscriptaccess : "always",
                allowfullscreen : "true",
                wmode : "Opaque"
            },
            attributes = {
                id : sName,
                name : sName,
                align : "middle"
            };
    //加载flex
    swfobject.embedSWF(
            src, divobj,
            width, height,
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);
};
//地图初始化时候加载对象，并且设置滚轮事件
Supermapflex.prototype.init = function(id,name,width,height,data,layerLengedInfo,kqiList,isCircle,isFilter,dashboardMapLayer){
    var me = this;
    me.createFlashMove(id, name, SWEET_JS_BASE_PATH + "lib/supermap/flash/customMap_flex.swf", width, height, data,layerLengedInfo,kqiList,isCircle,isFilter,dashboardMapLayer);    
    me.getDituSWF(name);
    me.mapElement = document.getElementById(name);
};
Supermapflex.prototype.getDituSWF = function(flexId) {
    var me = this,
            dituElement = document.getElementById(flexId);
    me.wheel(dituElement, me.afterwheel, true);
          
}; 
Supermapflex.prototype.wheel = function(obj, fn ,useCapture){
    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; 
    //FF doesn't recognize mousewheel as of FF3.x
    if (obj.attachEvent) //if IE (and Opera depending on user setting)
        obj.attachEvent("on"+mousewheelevt, handler, useCapture);
    else if (obj.addEventListener) //WC3 browsers
        obj.addEventListener(mousewheelevt, handler, useCapture);

    function handler(event) {
        var delta = 0;
        var event = window.event || event;
        var delta =  event.detail ?  -event.detail/3 : event.wheelDelta/120;
        if (event.preventDefault)
                    event.preventDefault();
        event.returnValue = false;
        return fn.apply(obj, [event, delta]);
    }
};  

Supermapflex.prototype.afterwheel = function(event, delta){
    //这个是FLEX里写的放大缩小方法
    var me = this;
    document.getElementById(me.name).WheelScroll(delta);
};

/**
 * @description 给地图添加小区信息
 * @param {String} feature  小区的id
 */
Supermapflex.prototype.addCell = function(feature){
    //这个是FLEX里写的添加小区
    var me = this,
            flexObject = document.getElementById(me.name);
    var data = JSON.stringify(feature);
    mapInfo[me.name].cellData = data;
    if(flexObject && $.isFunction(flexObject.addCell)){
        flexObject.addCell(data);          
    }
};
/**
 * @description 刷新地图里的小区：颜色，提示信息，扇形旋转角度，扇形圆心角
 * @param {String} feature  小区的id
 */
Supermapflex.prototype.reFreshCell = function(feature){
    //这个是FLEX里写的添加小区
    var me = this,
            flexObject = document.getElementById(me.name);
    var data = JSON.stringify(feature);
    mapInfo[me.name].cellData = data;
    if(flexObject && $.isFunction(flexObject.reFreshCell)){
        flexObject.reFreshCell(data);          
    }
};
/**
 * @description 移除地图上的小区点
 */
Supermapflex.prototype.removePointLayer = function(){
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.removePointLayer)){
        flexObject.removePointLayer();
    }
};

/**
 * @description 定位地图上的小区（cell）
 * @param {String} featureId  小区的id
 */
Supermapflex.prototype.setPosition = function(featureId){
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.setPosition)){
        flexObject.setPosition(featureId);
    }
};

/**
 * @description 定位地图上的区域(BSC,RNC,SGSN...)
 * @param {String} featureId  小区的id
 */
Supermapflex.prototype.setPositionLayer = function(featureId){
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.setPositionLayer)){
        flexObject.setPositionLayer(featureId);
    }
};

Supermapflex.prototype.setWH = function(w,h){
    //这个是FLEX里写的添加小区
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.setWH)){
        flexObject.setWH(w,h);
    }
};
Supermapflex.prototype.setWidth = function(w){
    //这个是FLEX里写的添加小区
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.setWidth)){
        flexObject.setWidth(w);
    }
};
Supermapflex.prototype.setHeight = function(h){
    //这个是FLEX里写的添加小区
    var me = this,
            flexObject = document.getElementById(me.name);
    if(flexObject && $.isFunction(flexObject.setHeight)){
        flexObject.setHeight(h);
    }
};

/**
 * 给地图设置图层信息，包含图层id,指标提示信息，颜色值，主着色指标名称
 * @param {Array} _data 图层信息
 */
Supermapflex.prototype.setLayerData = function(_data){
    //给地图设置图层信息及图层颜色及指示信息
    var me = this,
            flexObject = me.mapElement,
            data = JSON.stringify(_data);
     mapInfo[me.name].layerData = data;
    if(flexObject && $.isFunction(flexObject.setLayerData)){
        flexObject.setLayerData(data);
    }
};

/**
 * 给地图设置大图层的编号id
 * @param {number} id 整个大图层的id，需要从mapconfig.xml中读取或从iserver上取得
 */
Supermapflex.prototype.setLayerId = function(id){
    //给地图设置图层的id
    var me = this,
            flexObject = me.mapElement,
            data = JSON.stringify(id);
    mapInfo[me.name].layerType = data;
    if(flexObject && $.isFunction(flexObject.setLayerId)){
        flexObject.setLayerId(data);
    }
};

/**
 * 给地图图层设置默认的颜色值
 * @param {String} color 颜色值
 */
Supermapflex.prototype.setLayerDefaultCorlor = function(color){
    //给地图设置图层的id
    var me = this,
            flexObject = me.mapElement;
    mapInfo[me.name].layerDefaultColor = color;
    if(flexObject && $.isFunction(flexObject.setDefaultCorlor)){
        flexObject.setDefaultCorlor(color);
    }
};
/**
 * @description 清除地图的当前图层
 */
Supermapflex.prototype.clearLayer = function(){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.clearLayer)){
        flexObject.clearLayer();
    }
};
/**
 * @description flex地图的回调函数，地图渲染加载完成后，取得用户设置的小区进行渲染
 * @param {String} flexId 地图的id
 * @returns {Array} 返回设置的小区信息
 */
function getCellData(flexId){
    if (mapInfo[flexId] && mapInfo[flexId].cellData){
       var data = mapInfo[flexId].cellData;
       mapInfo[flexId].cellData = null;
       return JSON.stringify(data);;
    }
};
/**
 * @description flex地图的回调函数，地图渲染加载完成后，取得用户设置的图层id信息
 * @param {String} flexId 地图的id
 * @returns {Array} 返回设置的图层id信息
 */
function getLayerType(flexId){
    if (mapInfo[flexId] && mapInfo[flexId].layerType){
       var data = mapInfo[flexId].layerType;
       mapInfo[flexId].layerType = null;
       return data;
    }
};
/**
 * @description flex地图的回调函数，地图渲染加载完成后，取得用户设置的具体的图层信息
 * @param {String} flexId 地图的id
 * @returns {Array} 返回设置的具体的图层信息
 */
function getLayerData(flexId){
    if (mapInfo[flexId] && mapInfo[flexId].layerData){
       var data = mapInfo[flexId].layerData;
       mapInfo[flexId].layerData = null;
       return data;
    }
};
/**
 * @description flex地图的回调函数，触发点击地图的事件，调用sweet map的事件触发点击事件
 * @param {Array} data 当前点击的地图块的信息
 */
function onFeatureClick(data){
    if (!data){
        return;
    }
    var flexId = data.ID;
    if (mapInfo[flexId] && mapInfo[flexId].sweetMapObj){
       mapInfo[flexId].sweetMapObj._triggerHandler(null, "click", data);
    }
};
/**
 * @description flex地图的回调函数，地图渲染加载完成后，取得用户设置的默认除top外的着色值
 * @param {String} flexId 地图的id
 * @returns {Array} 返回设置的地图图层的默认着色值
 */
function getDefaultColor(flexId){
    if (mapInfo[flexId] && mapInfo[flexId].layerDefaultColor){
       var data = mapInfo[flexId].layerDefaultColor;
       mapInfo[flexId].layerDefaultColor = null;
       return data;
    }
};
/**
 * @description flex地图的回调函数，触发点击地图的事件，调用sweet map的事件触发点击事件
 * @param {Array} data 当前点击的地图块的信息
 */
function setMapOk(flexId){
    if (!flexId){
        return;
    }
    if (mapInfo[flexId] && mapInfo[flexId].sweetMapObj){
       mapInfo[flexId].sweetMapObj._triggerHandler(null, "MapIsOk", 'ok');
    }
};

/**
 * @description 设置当前图层是圆点显示还是区域显示
 * @param {boolean} isCircle : false显示区域，true显示圆点
 */
Supermapflex.prototype.setLayerCircleOrRegion = function(isCircle){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.setLayerCircleOrRegion)){
        flexObject.setLayerCircleOrRegion(isCircle);
    }
};
/**
 * @description 添加线图层
 * @param {Array} data 
 */
Supermapflex.prototype.addLine = function(data){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.addLine)){
        flexObject.addLine(JSON.stringify(data));
    }
};
/**
 * @description 刷新线图层
 * @param {Array} data 
 */
Supermapflex.prototype.reFreshLine = function(data){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.reFreshLine)){
        flexObject.reFreshLine(JSON.stringify(data));
    }
};
/**
 * @description 清空图层
 * @param {Array} data 
 */
Supermapflex.prototype.clearLine = function(){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.clearLine)){
        flexObject.clearLine();
    }
};
/**
 * @description 设置图例
 * @param {Array} data 
 */
Supermapflex.prototype.setLenged = function(data){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.setLenged)){
        flexObject.setLenged(JSON.stringify(data));
    }
};
/**
 * @description 设置kqiList
 * @param {Array} data 
 */
Supermapflex.prototype.setKqiList = function(data){
    var me = this,
            flexObject = me.mapElement;
    if(flexObject && $.isFunction(flexObject.setKqiList)){
        flexObject.setKqiList(JSON.stringify(data));
    }
};
/**
 * @description flex地图的回调函数，kqiList切换时触发
 * @param {Array} data 当前切换的指标
 */
function onKqiListChange(data){
    if (!data){
        return;
    }
    var flexId = data.ID;
    if (mapInfo[flexId] && mapInfo[flexId].sweetMapObj){
       mapInfo[flexId].sweetMapObj._triggerHandler(null, "kqiChange", data);
    }
};

function mapZoomEnd(data){
    if (!data){
        return;
    }
    var flexId = data.ID;

    if (mapInfo[flexId] && mapInfo[flexId].sweetMapObj){
       mapInfo[flexId].sweetMapObj._triggerHandler(null, "mapZoomEnd", data);
    }
};

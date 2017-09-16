/**
 * 由  冯博 创建于 2016/8/9.
 * @file sefon
 * @description 全局变量
 */
"use strict";

var sefon = {
    version: '0.01'
}
function expose() {
    var oldSefon = window.sefon;

    sefon.noConflict = function () {
        window.sefon = oldSefon;
        return this;
    };
    window.sefon = sefon;
}

// 定义 sefon 为 Node平台 loaders, 包含 Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = sefon;

// 定义 sefon 为AMD 模块
} else if (typeof define === 'function' && define.amd) {
    define(sefon);
}

// 将sefon定义为全局变量
if (typeof window !== 'undefined') {
    expose();
}

/**
 * 由  冯博 创建于 2016/8/15.
 * @file Control.draw
 * @description
 */

;(function () {
})();

/**
 * 由  冯博 创建于 2016/8/11.
 * @file Control
 * @description 地图控件控制器类
 */
;(function () {
    sefon.Control = L.Class.extend({
        options: {},
        initialize: function (map, controls) {
            var me = this;
            L.drawLocal =sefon.lang ? sefon.lang.toolbar: L.drawLocal;
            map.addControl(
                L.control.zoom(
                    {
                        position: "topleft",
                        zoomInTitle: sefon.lang ? sefon.lang.zoomInTitle:"zoom in",
                        zoomOutTitle: sefon.lang ? sefon.lang.zoomOutTitle:'zoom out'
                    }
                )
            );
            if (controls && controls.length > 0) {
                controls.map(function (control) {
                    if (control === 'Draw') {
                        me.addDrawTools(map);
                    } else {
                        map.addControl(L.control[control]())
                    }
                });
            }
        },
        /**
         * 加载画图控件方法
         * @param map 地图对象
         */
        addDrawTools: function (map) {
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            var drawControl = new L.Control.Draw({
                position: 'topright',
                draw: {
                    polyline: true,
                    polygon: true,
                    circle: true,
                    marker: true
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                }
            });
            map.addControl(drawControl);
            map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'marker') {
                    layer.bindPopup('A popup!');
                }

                drawnItems.addLayer(layer);
            });
        }
    });
    sefon.control = function (map, controls) {
        return new sefon.Control(map, controls);
    }
})();
/**
 * 由  冯博 创建于 2016/8/11.
 * @file Control.Legend
 * @description 地图图例控件
 */
;(function () {
    L.Control.Legend = L.Class.extend({
        options: {

        },
        initialize: function (options) {

        }
    });
})();

/**
 * 由  冯博 创建于 2016/8/11.
 * @file Control.Overview
 * @description 地图鹰眼图控件
 */
;(function(){
    L.Control.OverView= L.Class.extend({
        options:{
            position:'bottomright'
        },
        initialize:function(options){

        }
    });
})();

/**
 * 由  冯博 创建于 2016/8/11.
 * @file lang
 * @description
 */
;(function () {
    sefon.resources = {};
    sefon.lang=null;
})();
/**
 * 由  冯博 创建于 2016/8/11.
 * @file en
 * @description
 */
;(function () {
    sefon.resources['en'] = {
        zoomInTitle: 'Zoom in',
        zoomOutTitle: 'Zoom out',
        toolbar: {
            draw: {
                toolbar: {
                    actions: {
                        title: 'Cancel drawing',
                        text: 'Cancel'
                    },
                    finish: {
                        title: 'Finish drawing',
                        text: 'Finish'
                    },
                    undo: {
                        title: 'Delete last point drawn',
                        text: 'Delete last point'
                    },
                    buttons: {
                        polyline: 'Draw a polyline',
                        polygon: 'Draw a polygon',
                        rectangle: 'Draw a rectangle',
                        circle: 'Draw a circle',
                        marker: 'Draw a marker'
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: 'Click and drag to draw circle.'
                        },
                        radius: 'Radius'
                    },
                    marker: {
                        tooltip: {
                            start: 'Click map to place marker.'
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: 'Click to start drawing shape.',
                            cont: 'Click to continue drawing shape.',
                            end: 'Click first point to close this shape.'
                        }
                    },
                    polyline: {
                        error: '<strong>Error:</strong> shape edges cannot cross!',
                        tooltip: {
                            start: 'Click to start drawing line.',
                            cont: 'Click to continue drawing line.',
                            end: 'Click last point to finish line.'
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: 'Click and drag to draw rectangle.'
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: 'Release mouse to finish drawing.'
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: 'Save changes.',
                            text: 'Save'
                        },
                        cancel: {
                            title: 'Cancel editing, discards all changes.',
                            text: 'Cancel'
                        }
                    },
                    buttons: {
                        edit: 'Edit layers.',
                        editDisabled: 'No layers to edit.',
                        remove: 'Delete layers.',
                        removeDisabled: 'No layers to delete.'
                    }
                },
                handlers: {
                    edit: {
                        tooltip: {
                            text: 'Drag handles, or marker to edit feature.',
                            subtext: 'Click cancel to undo changes.'
                        }
                    },
                    remove: {
                        tooltip: {
                            text: 'Click on a feature to remove'
                        }
                    }
                }
            }
        }
    }
})();
/**
 * 由  冯博 创建于 2016/8/11.
 * @file zh-CN
 * @description
 */
;(function () {
    sefon.resources['zh-CN'] = {
        zoomInTitle: '放大',
        zoomOutTitle: '缩小',
        toolbar: {
            draw: {
                toolbar: {
                    actions: {
                        title: '取消',
                        text: '取消'
                    },
                    finish: {
                        title: '停止编辑',
                        text: '完成'
                    },
                    undo: {
                        title: '删除上一次画的点',
                        text: '删除上一个点'
                    },
                    buttons: {
                        polyline: '画线',
                        polygon: '画面',
                        rectangle: '画矩形',
                        circle: '画圆',
                        marker: '打点'
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: '点击然后拖动来画一个圆'
                        },
                        radius: '半径'
                    },
                    marker: {
                        tooltip: {
                            start: '点击地图做标记'
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: '点击开始画面.',
                            cont: '继续点击画面',
                            end: '双击结束画面'
                        }
                    },
                    polyline: {
                        error: '<strong>Error:</strong> shape edges cannot cross!',
                        tooltip: {
                            start: '点击开始画线.',
                            cont: '继续点击画线',
                            end: '双击结束画线'
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: '点击并拖动画矩形'
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: '释放鼠标完成绘图.'
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: '保存修改',
                            text: '保存'
                        },
                        cancel: {
                            title: '取消编辑，丢弃所有的变化.',
                            text: '取消'
                        }
                    },
                    buttons: {
                        edit: '编辑图层.',
                        editDisabled: '没有图层可以编辑.',
                        remove: '删除图层.',
                        removeDisabled: '没有图层可以删除.'
                    }
                },
                handlers: {
                    edit: {
                        tooltip: {
                            text: '拖动句柄，或标记来编辑功能.',
                            subtext: '取消编辑，丢弃所有的变化.'
                        }
                    },
                    remove: {
                        tooltip: {
                            text: '点击一个要素删除'
                        }
                    }
                }
            }
        }
    }
})();
/**
 * 由  冯博 创建于 2016/8/9.
 * @file map
 * @description 地图基础类
 */
;(function () {
    "use strict";
    var defaultSetting = {
        id: 'map-container',
        options: {
            zoomControl:false,
            attributionControl:false
        }
    }
    /**
     * 地图基础类
     * @param id 地图寄主dom元素id
     * @param options 地图配置可选项
     * @returns {L.map} 返回leaflet map对象
     */
    sefon.map = function (id, options) {
        var id = id || defaultSetting.id;
        var options = options || defaultSetting.options;
        return new L.map(id, options);
    }
})();


/**
 * Created by phobo on 8/9 0009.
 * @file utils
 * @description sefon公共方法类
 */
;(function(){
    sefon.utils={

    }
})();
/**
 * 由  冯博 创建于 2016/8/10.
 * @file Marker
 * @description 地图标记类
 */

;(function () {
    "use strict";
    var defaultSetting = {
        latlng: null,
        options: {}
    }
    sefon.Marker = function (latlng, options) {
        return new L.Marker(latlng, options);
    }
})();


;
(function() {
//注册地图
    sefon.registerMap = function(name, url, map) {
        $.getJSON(url).done(function(res) {
            res &&
                (res.features.map(function(item) {
                    var latlng = [];
                    item.geometry.coordinates[0].map(function(array) {
                        latlng.push(array.reverse());
                    });
                    name = L.polygon(latlng, { //添加polygon
                        fill: true,
                        fillColor: 'white',
                        weight: 2
                    }).addTo(map)
                }))
        })
    }
})();
/**
 * 由  冯博 创建于 2016/8/9.
 * @file layer
 * @description 地图图层layer类
 */
;(function () {
    "use strict";
    var Url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var defaultSetting = {
        url: Url,
        options: {
            zoom: 8,
            minZoom: 7,
            maxZoom: 13
        }
    }
    L.TileLayer.prototype.options=Object.assign({},L.TileLayer.prototype.options, defaultSetting.options);
    /**
     * 切片图层类
     * @param url 图层地址 String 必填
     * @param options 图层配置项，Object 可选
     * @returns {*} 返回leaflet的TileLayer
     */
    sefon.tileLayer = function (url, options) {
        var url = url || defaultSetting.url;
        return new L.TileLayer(url, options);
    }
})();
/**
 * Created by phobo on 8/9 0009.
 *   @file TileLayer.WMS
 * @description WMS标准图层类
 */
;(function () {
    "use strict";
    var defaultSetting = {
        url: null,
        options: {}
    }
    /**
     * 符合WMS标准图层
     * @param url 图层地址 String
     * @param options   图层配置项 Object
     * @returns {*}
     */
    sefon.tileLayer.wms = function (url, options) {
        var url = url || defaultSetting.url;
        var options = options || defaultSetting.options;
        return new L.TileLayer.WMS(url, options);
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZm9uLmpzIiwiY29udHJvbC9Db250cm9sLmRyYXcuanMiLCJjb250cm9sL0NvbnRyb2wuanMiLCJjb250cm9sL0NvbnRyb2wuTGVnZW5kLmpzIiwiY29udHJvbC9Db250cm9sLk92ZXJ2aWV3LmpzIiwiY29yZS9yZXNvdXJjZXMuanMiLCJpMThuL2VuLmpzIiwiaTE4bi96aC1DTi5qcyIsIm1hcC9tYXAuanMiLCJ1dGlscy91dGlscy5qcyIsImxheWVyL21hcmtlci9NYXJrZXIuanMiLCJsYXllci9vdGhlci9vdGhlckxheWVyLmpzIiwibGF5ZXIvdGlsZS9UaWxlTGF5ZXIuanMiLCJsYXllci90aWxlL1RpbGVMYXllci5XTVMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2Vmb24ubWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvOS5cclxuICogQGZpbGUgc2Vmb25cclxuICogQGRlc2NyaXB0aW9uIOWFqOWxgOWPmOmHj1xyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgc2Vmb24gPSB7XHJcbiAgICB2ZXJzaW9uOiAnMC4wMSdcclxufVxyXG5mdW5jdGlvbiBleHBvc2UoKSB7XHJcbiAgICB2YXIgb2xkU2Vmb24gPSB3aW5kb3cuc2Vmb247XHJcblxyXG4gICAgc2Vmb24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuc2Vmb24gPSBvbGRTZWZvbjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICB3aW5kb3cuc2Vmb24gPSBzZWZvbjtcclxufVxyXG5cclxuLy8g5a6a5LmJIHNlZm9uIOS4uiBOb2Rl5bmz5Y+wIGxvYWRlcnMsIOWMheWQqyBCcm93c2VyaWZ5XHJcbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlZm9uO1xyXG5cclxuLy8g5a6a5LmJIHNlZm9uIOS4ukFNRCDmqKHlnZdcclxufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShzZWZvbik7XHJcbn1cclxuXHJcbi8vIOWwhnNlZm9u5a6a5LmJ5Li65YWo5bGA5Y+Y6YePXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgZXhwb3NlKCk7XHJcbn1cclxuIiwiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvMTUuXHJcbiAqIEBmaWxlIENvbnRyb2wuZHJhd1xyXG4gKiBAZGVzY3JpcHRpb25cclxuICovXHJcblxyXG47KGZ1bmN0aW9uICgpIHtcclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvMTEuXHJcbiAqIEBmaWxlIENvbnRyb2xcclxuICogQGRlc2NyaXB0aW9uIOWcsOWbvuaOp+S7tuaOp+WItuWZqOexu1xyXG4gKi9cclxuOyhmdW5jdGlvbiAoKSB7XHJcbiAgICBzZWZvbi5Db250cm9sID0gTC5DbGFzcy5leHRlbmQoe1xyXG4gICAgICAgIG9wdGlvbnM6IHt9LFxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtYXAsIGNvbnRyb2xzKSB7XHJcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgICAgIEwuZHJhd0xvY2FsID1zZWZvbi5sYW5nID8gc2Vmb24ubGFuZy50b29sYmFyOiBMLmRyYXdMb2NhbDtcclxuICAgICAgICAgICAgbWFwLmFkZENvbnRyb2woXHJcbiAgICAgICAgICAgICAgICBMLmNvbnRyb2wuem9vbShcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcInRvcGxlZnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbUluVGl0bGU6IHNlZm9uLmxhbmcgPyBzZWZvbi5sYW5nLnpvb21JblRpdGxlOlwiem9vbSBpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6b29tT3V0VGl0bGU6IHNlZm9uLmxhbmcgPyBzZWZvbi5sYW5nLnpvb21PdXRUaXRsZTonem9vbSBvdXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoY29udHJvbHMgJiYgY29udHJvbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbHMubWFwKGZ1bmN0aW9uIChjb250cm9sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2wgPT09ICdEcmF3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5hZGREcmF3VG9vbHMobWFwKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuYWRkQ29udHJvbChMLmNvbnRyb2xbY29udHJvbF0oKSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yqg6L2955S75Zu+5o6n5Lu25pa55rOVXHJcbiAgICAgICAgICogQHBhcmFtIG1hcCDlnLDlm77lr7nosaFcclxuICAgICAgICAgKi9cclxuICAgICAgICBhZGREcmF3VG9vbHM6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAgICAgdmFyIGRyYXduSXRlbXMgPSBuZXcgTC5GZWF0dXJlR3JvdXAoKTtcclxuICAgICAgICAgICAgbWFwLmFkZExheWVyKGRyYXduSXRlbXMpO1xyXG4gICAgICAgICAgICB2YXIgZHJhd0NvbnRyb2wgPSBuZXcgTC5Db250cm9sLkRyYXcoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3ByaWdodCcsXHJcbiAgICAgICAgICAgICAgICBkcmF3OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWdvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjaXJjbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZWRpdDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmVHcm91cDogZHJhd25JdGVtcyxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1hcC5hZGRDb250cm9sKGRyYXdDb250cm9sKTtcclxuICAgICAgICAgICAgbWFwLm9uKCdkcmF3OmNyZWF0ZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBlLmxheWVyVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXllciA9IGUubGF5ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtYXJrZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuYmluZFBvcHVwKCdBIHBvcHVwIScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRyYXduSXRlbXMuYWRkTGF5ZXIobGF5ZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHNlZm9uLmNvbnRyb2wgPSBmdW5jdGlvbiAobWFwLCBjb250cm9scykge1xyXG4gICAgICAgIHJldHVybiBuZXcgc2Vmb24uQ29udHJvbChtYXAsIGNvbnRyb2xzKTtcclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICog55SxICDlhq/ljZog5Yib5bu65LqOIDIwMTYvOC8xMS5cclxuICogQGZpbGUgQ29udHJvbC5MZWdlbmRcclxuICogQGRlc2NyaXB0aW9uIOWcsOWbvuWbvuS+i+aOp+S7tlxyXG4gKi9cclxuOyhmdW5jdGlvbiAoKSB7XHJcbiAgICBMLkNvbnRyb2wuTGVnZW5kID0gTC5DbGFzcy5leHRlbmQoe1xyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvMTEuXHJcbiAqIEBmaWxlIENvbnRyb2wuT3ZlcnZpZXdcclxuICogQGRlc2NyaXB0aW9uIOWcsOWbvum5sOecvOWbvuaOp+S7tlxyXG4gKi9cclxuOyhmdW5jdGlvbigpe1xyXG4gICAgTC5Db250cm9sLk92ZXJWaWV3PSBMLkNsYXNzLmV4dGVuZCh7XHJcbiAgICAgICAgb3B0aW9uczp7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOidib3R0b21yaWdodCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXRpYWxpemU6ZnVuY3Rpb24ob3B0aW9ucyl7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpO1xyXG4iLCIvKipcclxuICog55SxICDlhq/ljZog5Yib5bu65LqOIDIwMTYvOC8xMS5cclxuICogQGZpbGUgbGFuZ1xyXG4gKiBAZGVzY3JpcHRpb25cclxuICovXHJcbjsoZnVuY3Rpb24gKCkge1xyXG4gICAgc2Vmb24ucmVzb3VyY2VzID0ge307XHJcbiAgICBzZWZvbi5sYW5nPW51bGw7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvMTEuXHJcbiAqIEBmaWxlIGVuXHJcbiAqIEBkZXNjcmlwdGlvblxyXG4gKi9cclxuOyhmdW5jdGlvbiAoKSB7XHJcbiAgICBzZWZvbi5yZXNvdXJjZXNbJ2VuJ10gPSB7XHJcbiAgICAgICAgem9vbUluVGl0bGU6ICdab29tIGluJyxcclxuICAgICAgICB6b29tT3V0VGl0bGU6ICdab29tIG91dCcsXHJcbiAgICAgICAgdG9vbGJhcjoge1xyXG4gICAgICAgICAgICBkcmF3OiB7XHJcbiAgICAgICAgICAgICAgICB0b29sYmFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NhbmNlbCBkcmF3aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0NhbmNlbCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmlzaDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0ZpbmlzaCBkcmF3aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0ZpbmlzaCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuZG86IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEZWxldGUgbGFzdCBwb2ludCBkcmF3bicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEZWxldGUgbGFzdCBwb2ludCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9seWxpbmU6ICdEcmF3IGEgcG9seWxpbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2x5Z29uOiAnRHJhdyBhIHBvbHlnb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0YW5nbGU6ICdEcmF3IGEgcmVjdGFuZ2xlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiAnRHJhdyBhIGNpcmNsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlcjogJ0RyYXcgYSBtYXJrZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAnQ2xpY2sgYW5kIGRyYWcgdG8gZHJhdyBjaXJjbGUuJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6ICdSYWRpdXMnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICdDbGljayBtYXAgdG8gcGxhY2UgbWFya2VyLidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWdvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogJ0NsaWNrIHRvIHN0YXJ0IGRyYXdpbmcgc2hhcGUuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnQ6ICdDbGljayB0byBjb250aW51ZSBkcmF3aW5nIHNoYXBlLicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6ICdDbGljayBmaXJzdCBwb2ludCB0byBjbG9zZSB0aGlzIHNoYXBlLidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcG9seWxpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICc8c3Ryb25nPkVycm9yOjwvc3Ryb25nPiBzaGFwZSBlZGdlcyBjYW5ub3QgY3Jvc3MhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICdDbGljayB0byBzdGFydCBkcmF3aW5nIGxpbmUuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnQ6ICdDbGljayB0byBjb250aW51ZSBkcmF3aW5nIGxpbmUuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogJ0NsaWNrIGxhc3QgcG9pbnQgdG8gZmluaXNoIGxpbmUuJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByZWN0YW5nbGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICdDbGljayBhbmQgZHJhZyB0byBkcmF3IHJlY3RhbmdsZS4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNpbXBsZXNoYXBlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogJ1JlbGVhc2UgbW91c2UgdG8gZmluaXNoIGRyYXdpbmcuJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlZGl0OiB7XHJcbiAgICAgICAgICAgICAgICB0b29sYmFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NhdmUgY2hhbmdlcy4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NhdmUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDYW5jZWwgZWRpdGluZywgZGlzY2FyZHMgYWxsIGNoYW5nZXMuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdDYW5jZWwnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdDogJ0VkaXQgbGF5ZXJzLicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXREaXNhYmxlZDogJ05vIGxheWVycyB0byBlZGl0LicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZTogJ0RlbGV0ZSBsYXllcnMuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRGlzYWJsZWQ6ICdObyBsYXllcnMgdG8gZGVsZXRlLidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaGFuZGxlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlZGl0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEcmFnIGhhbmRsZXMsIG9yIG1hcmtlciB0byBlZGl0IGZlYXR1cmUuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRleHQ6ICdDbGljayBjYW5jZWwgdG8gdW5kbyBjaGFuZ2VzLidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdDbGljayBvbiBhIGZlYXR1cmUgdG8gcmVtb3ZlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiDnlLEgIOWGr+WNmiDliJvlu7rkuo4gMjAxNi84LzExLlxyXG4gKiBAZmlsZSB6aC1DTlxyXG4gKiBAZGVzY3JpcHRpb25cclxuICovXHJcbjsoZnVuY3Rpb24gKCkge1xyXG4gICAgc2Vmb24ucmVzb3VyY2VzWyd6aC1DTiddID0ge1xyXG4gICAgICAgIHpvb21JblRpdGxlOiAn5pS+5aSnJyxcclxuICAgICAgICB6b29tT3V0VGl0bGU6ICfnvKnlsI8nLFxyXG4gICAgICAgIHRvb2xiYXI6IHtcclxuICAgICAgICAgICAgZHJhdzoge1xyXG4gICAgICAgICAgICAgICAgdG9vbGJhcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICflj5bmtognLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn5Y+W5raIJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5YGc5q2i57yW6L6RJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ+WujOaIkCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHVuZG86IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfliKDpmaTkuIrkuIDmrKHnlLvnmoTngrknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn5Yig6Zmk5LiK5LiA5Liq54K5J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2x5bGluZTogJ+eUu+e6vycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvbHlnb246ICfnlLvpnaInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWN0YW5nbGU6ICfnlLvnn6nlvaInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjbGU6ICfnlLvlnIYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXI6ICfmiZPngrknXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAn54K55Ye754S25ZCO5ouW5Yqo5p2l55S75LiA5Liq5ZyGJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6ICfljYrlvoQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICfngrnlh7vlnLDlm77lgZrmoIforrAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHBvbHlnb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6ICfngrnlh7vlvIDlp4vnlLvpnaIuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnQ6ICfnu6fnu63ngrnlh7vnlLvpnaInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiAn5Y+M5Ye757uT5p2f55S76Z2iJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwb2x5bGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogJzxzdHJvbmc+RXJyb3I6PC9zdHJvbmc+IHNoYXBlIGVkZ2VzIGNhbm5vdCBjcm9zcyEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogJ+eCueWHu+W8gOWni+eUu+e6vy4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udDogJ+e7p+e7reeCueWHu+eUu+e6vycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6ICflj4zlh7vnu5PmnZ/nlLvnur8nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY3RhbmdsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogJ+eCueWHu+W5tuaLluWKqOeUu+efqeW9oidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2ltcGxlc2hhcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiAn6YeK5pS+6byg5qCH5a6M5oiQ57uY5Zu+LidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWRpdDoge1xyXG4gICAgICAgICAgICAgICAgdG9vbGJhcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfkv53lrZjkv67mlLknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ+S/neWtmCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+WPlua2iOe8lui+ke+8jOS4ouW8g+aJgOacieeahOWPmOWMli4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ+WPlua2iCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0OiAn57yW6L6R5Zu+5bGCLicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXREaXNhYmxlZDogJ+ayoeacieWbvuWxguWPr+S7pee8lui+kS4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmU6ICfliKDpmaTlm77lsYIuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRGlzYWJsZWQ6ICfmsqHmnInlm77lsYLlj6/ku6XliKDpmaQuJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkaXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ+aLluWKqOWPpeafhO+8jOaIluagh+iusOadpee8lui+keWKn+iDvS4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VidGV4dDogJ+WPlua2iOe8lui+ke+8jOS4ouW8g+aJgOacieeahOWPmOWMli4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn54K55Ye75LiA5Liq6KaB57Sg5Yig6ZmkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiDnlLEgIOWGr+WNmiDliJvlu7rkuo4gMjAxNi84LzkuXHJcbiAqIEBmaWxlIG1hcFxyXG4gKiBAZGVzY3JpcHRpb24g5Zyw5Zu+5Z+656GA57G7XHJcbiAqL1xyXG47KGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGRlZmF1bHRTZXR0aW5nID0ge1xyXG4gICAgICAgIGlkOiAnbWFwLWNvbnRhaW5lcicsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICB6b29tQ29udHJvbDpmYWxzZSxcclxuICAgICAgICAgICAgYXR0cmlidXRpb25Db250cm9sOmZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlnLDlm77ln7rnoYDnsbtcclxuICAgICAqIEBwYXJhbSBpZCDlnLDlm77lr4TkuLtkb23lhYPntKBpZFxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMg5Zyw5Zu+6YWN572u5Y+v6YCJ6aG5XHJcbiAgICAgKiBAcmV0dXJucyB7TC5tYXB9IOi/lOWbnmxlYWZsZXQgbWFw5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHNlZm9uLm1hcCA9IGZ1bmN0aW9uIChpZCwgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciBpZCA9IGlkIHx8IGRlZmF1bHRTZXR0aW5nLmlkO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0U2V0dGluZy5vcHRpb25zO1xyXG4gICAgICAgIHJldHVybiBuZXcgTC5tYXAoaWQsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgcGhvYm8gb24gOC85IDAwMDkuXHJcbiAqIEBmaWxlIHV0aWxzXHJcbiAqIEBkZXNjcmlwdGlvbiBzZWZvbuWFrOWFseaWueazleexu1xyXG4gKi9cclxuOyhmdW5jdGlvbigpe1xyXG4gICAgc2Vmb24udXRpbHM9e1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICog55SxICDlhq/ljZog5Yib5bu65LqOIDIwMTYvOC8xMC5cclxuICogQGZpbGUgTWFya2VyXHJcbiAqIEBkZXNjcmlwdGlvbiDlnLDlm77moIforrDnsbtcclxuICovXHJcblxyXG47KGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGRlZmF1bHRTZXR0aW5nID0ge1xyXG4gICAgICAgIGxhdGxuZzogbnVsbCxcclxuICAgICAgICBvcHRpb25zOiB7fVxyXG4gICAgfVxyXG4gICAgc2Vmb24uTWFya2VyID0gZnVuY3Rpb24gKGxhdGxuZywgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBuZXcgTC5NYXJrZXIobGF0bG5nLCBvcHRpb25zKTtcclxuICAgIH1cclxufSkoKTtcclxuXHJcbiIsIjtcclxuKGZ1bmN0aW9uKCkge1xyXG4vL+azqOWGjOWcsOWbvlxyXG4gICAgc2Vmb24ucmVnaXN0ZXJNYXAgPSBmdW5jdGlvbihuYW1lLCB1cmwsIG1hcCkge1xyXG4gICAgICAgICQuZ2V0SlNPTih1cmwpLmRvbmUoZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgICAgICAgIHJlcyAmJlxyXG4gICAgICAgICAgICAgICAgKHJlcy5mZWF0dXJlcy5tYXAoZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXRsbmcgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLm1hcChmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRsbmcucHVzaChhcnJheS5yZXZlcnNlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgPSBMLnBvbHlnb24obGF0bG5nLCB7IC8v5re75YqgcG9seWdvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6ICd3aGl0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodDogMlxyXG4gICAgICAgICAgICAgICAgICAgIH0pLmFkZFRvKG1hcClcclxuICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiAqIOeUsSAg5Yav5Y2aIOWIm+W7uuS6jiAyMDE2LzgvOS5cclxuICogQGZpbGUgbGF5ZXJcclxuICogQGRlc2NyaXB0aW9uIOWcsOWbvuWbvuWxgmxheWVy57G7XHJcbiAqL1xyXG47KGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIFVybCA9ICdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj1way5leUoxSWpvaWJXRndZbTk0SWl3aVlTSTZJbU5wYW5kbWJYbGlOREJqWldkMk0yeDZiRGszYzJadE9Ua2lmUS5fUUE3aTVNcGtkX20zMElHRWxIeml3JztcclxuICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcclxuICAgICAgICB1cmw6IFVybCxcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIHpvb206IDgsXHJcbiAgICAgICAgICAgIG1pblpvb206IDcsXHJcbiAgICAgICAgICAgIG1heFpvb206IDEzXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgTC5UaWxlTGF5ZXIucHJvdG90eXBlLm9wdGlvbnM9T2JqZWN0LmFzc2lnbih7fSxMLlRpbGVMYXllci5wcm90b3R5cGUub3B0aW9ucywgZGVmYXVsdFNldHRpbmcub3B0aW9ucyk7XHJcbiAgICAvKipcclxuICAgICAqIOWIh+eJh+WbvuWxguexu1xyXG4gICAgICogQHBhcmFtIHVybCDlm77lsYLlnLDlnYAgU3RyaW5nIOW/heWhq1xyXG4gICAgICogQHBhcmFtIG9wdGlvbnMg5Zu+5bGC6YWN572u6aG577yMT2JqZWN0IOWPr+mAiVxyXG4gICAgICogQHJldHVybnMgeyp9IOi/lOWbnmxlYWZsZXTnmoRUaWxlTGF5ZXJcclxuICAgICAqL1xyXG4gICAgc2Vmb24udGlsZUxheWVyID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciB1cmwgPSB1cmwgfHwgZGVmYXVsdFNldHRpbmcudXJsO1xyXG4gICAgICAgIHJldHVybiBuZXcgTC5UaWxlTGF5ZXIodXJsLCBvcHRpb25zKTtcclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBwaG9ibyBvbiA4LzkgMDAwOS5cclxuICogICBAZmlsZSBUaWxlTGF5ZXIuV01TXHJcbiAqIEBkZXNjcmlwdGlvbiBXTVPmoIflh4blm77lsYLnsbtcclxuICovXHJcbjsoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgZGVmYXVsdFNldHRpbmcgPSB7XHJcbiAgICAgICAgdXJsOiBudWxsLFxyXG4gICAgICAgIG9wdGlvbnM6IHt9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOespuWQiFdNU+agh+WHhuWbvuWxglxyXG4gICAgICogQHBhcmFtIHVybCDlm77lsYLlnLDlnYAgU3RyaW5nXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAgIOWbvuWxgumFjee9rumhuSBPYmplY3RcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBzZWZvbi50aWxlTGF5ZXIud21zID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIHZhciB1cmwgPSB1cmwgfHwgZGVmYXVsdFNldHRpbmcudXJsO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0U2V0dGluZy5vcHRpb25zO1xyXG4gICAgICAgIHJldHVybiBuZXcgTC5UaWxlTGF5ZXIuV01TKHVybCwgb3B0aW9ucyk7XHJcbiAgICB9O1xyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

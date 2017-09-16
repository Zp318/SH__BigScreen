/**
 * @fileOverview 扩展jquery工具类
 * @description 扩展jquery工具类, 使用方法与使用jquery的方法一致
 * @version 1.0
 * http://www.huawei.com
 *
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved
 */

/**
 * 扩展jquery的工具类,具体的方法，请查看上面的js源文件，下面的cookie, cursor, date, e, matrix, regExp都是类，方法需要在源js文件中查找
 * @name Sweet.util
 * @class 
 * @requires 
 * <pre>
 * jquery-1.9.1.min.js
 * </pre>
 * @example 
 * <pre>
 * $.error("出错了");
 * // string类的方法
 * $.string.toNumber("3422");
 * </pre>
 */

jQuery.extend(/**@lends Sweet.util.prototype*/{
    /**
     * @description 日志打印
     * @param {String} msg 输出日志
     */
    log: function(msg) {
        if (!sweetDebug) {
            return;
        }
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
    },
    /**
     * @description 错误日志打印
     * @param {String} msg 输出日志
     */
    error: function(msg) {
        if (!sweetDebug) {
            return;
        }
        if (window.console && window.console.error) {
            window.console.log("%c " + msg + " ", "background:#222;color:#bada55");
            window.console.error(msg);
        }
    },
    /**
     * @description 对象克隆
     * @param {Object} obj 源对象
     * @return {Object} 返回克隆对象
     */
    objClone: function(obj) {
        if ($.isNull(obj) || ($.isArray(obj) && 0 === obj.length)) {
            return obj;
        }
        var clone;
        if (Object === obj.constructor) {
            clone = new obj.constructor();
        } else {
            clone = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
            if (clone[key] !== obj[key]) {
                if ("object" === typeof(obj[key])) {
                    clone[key] = $.objClone(obj[key]);
                } else {
                    clone[key] = obj[key];
                }
            }
        }
        return clone;
    },
    /**
     * @description 对象浅拷贝，不拷贝object和function
     * @param {Object} obj 源对象
     * @returns {Object} 对象的拷贝
     */
    objCopy: function(obj) {
        if ($.isNull(obj)) {
            return;
        }

        var copy = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] !== 'object' && !$.isFunction(obj[key])) {
                    copy[key] = obj[key];
                }
            }
        }
        return copy;
    },
    /**
     * @description 对象数组的多列排序
     * @param {Array} sorts 排序数组，格式为[{"name": , "order": , "dataType":}, ...]
     */
    objMultiSort: function(sorts) {
        return function(o1, o2) {
            var val1, val2, val = 0, sort;
            for (var i=0; i<sorts.length; i++) {
                sort = sorts[i];
                val1 = o1[sort.name];
                val2 = o2[sort.name];
                if ("number" === sort.dataType) {
                    val1 = $.string.toNegativeInfinity(val1);
                    val2 = $.string.toNegativeInfinity(val2);
                }
                
                val = $._getCompareValue(val1, val2, sort.order);
                
                if (0 !== val) {
                    return val;
                }
            }
            
            return 0;
        };
    },
    /**
     * @description 对象数组比较器
     * @param {String} porpertyName 比较的属性名
     * @param {String} sortType 排序方式，ASC 升序，DESC 降序
     */
    objSort: function(porpertyName, sortType) {
        return function(obj1, obj2) {
            var val1 = obj1[porpertyName], val2 = obj2[porpertyName];
            return $._getCompareValue(val1, val2, sortType);
        };
    },
    /**
     * @description 对象数组比较器，处理数值类型比较，对非数值类型会做转换，再比较
     * @param {String} porpertyName 比较的属性名
     * @param {String} sortType 排序方式，ASC 升序，DESC 降序
     */
    objNumberSort: function(porpertyName, sortType) {
        return function(obj1, obj2) {
            var val1 = $.string.toNegativeInfinity(obj1[porpertyName]),
                    val2 = $.string.toNegativeInfinity(obj2[porpertyName]);
            
            return $._getCompareValue(val1, val2, sortType);
        };
    },
    /**
     * @private
     * @description 获取排序比较结果
     * @param {String/Number} val1 值1
     * @param {String/Number} val2 值2
     * @param {String} sortType 排序方式，asc：升序 desc：降序
     */
    _getCompareValue: function(val1, val2, sortType) {
        var val = 0;
        if (val1 < val2) {
            val = 1;
        } else if (val1 > val2) {
            val = -1;
        } else {
            val = 0;
        }

        if (Sweet.constants.sortType.ASC === sortType) {
            return -val;
        } else if (Sweet.constants.sortType.DESC === sortType) {
            return val;
        } else {
            throw new Error("Do not support the type of sort!");
        }
    },
    /**
     * @description 元素是否可见，true：可见，false：不可见
     * @param {Object} obj 目标对象
     */
    isVisiable: function(obj) {
        return !obj.is(":hidden");
    },
    /**
     * @description 判断参数是否为空或未定义
     * @param {Object} obj 参数
     * @return {Boolean} true: 为空，false: 不为空
     */
    isNull: function(obj) {
        return (obj === undefined) || null === obj || ('' === obj);
    },
    /**
     * @description 判断参数是否为空或未定义
     * @param {Object} obj 参数
     * @return {Boolean} false: 为空，true: 不为空
     */
    isNotNull: function(obj) {
        if ($.isNull(obj)) {
            return false;
        }

        return true;
    },
    /**
     * @description 判断值是否String类型
     * @param {String} value 值
     * @return {Boolean} true: 是 false: 不是
     */
    isString: function(value) {
        return "string" === $.type(value);
    },
    /**
     * @description 判断值是否Boolean类型
     * @param {Boolean} value 值
     * @return {Boolean} true: 是 false: 不是
     */
    isBoolean: function(value) {
        return "boolean" === $.type(value);
    },
    /**
     * @description 判断值是否Date类型
     * @param {Object} value 值
     * @return {Boolean} true: 是 false: 不是
     */
    isDate: function(value) {
        return "date" === $.type(value);
    },
    /**
     * @description 判断值是否正则类型
     * @param {Object} value 值
     * @return {Boolean} true: 是 false: 不是
     */
    isRegExp: function(value) {
        return "regexp" === $.type(value);
    },
    /**
     * @description 判断值是否数值类型
     * @param {Object} value 值
     * @return {Boolean} true: 是 false: 不是
     */
    isNumber: function(value) {
        return "number" === $.type(value);
    },
    /**
     * @private
     * @description 判断值是否为undefined
     * @param {Object/String/Number/Array/Boolean} value 值
     * @return {Boolean} true：值为undefined，false：值不为undefined
     */
    isUndefined: function(value) {
        return undefined === value;
    },
     /**
     * @private
     * @description 判断值是否为空数组
     * @param {Object/String/Number/Array/Boolean} value 值
     * @return {Boolean} true：值为空数组，false：值不为空数组
     */
    isEmptyArray: function(value) {
        return $.isArray(value) && 0 === value.length;
    },
    /**
     * @description 判断参数是否为空或未定义
     * @param {Object} obj 参数
     * @return {String} null值返回空串，否则原值返回
     */
    nullToString: function(obj) {
        if (obj && typeof obj === "function") {
            return "";
        }

        if ($.isNull(obj)) {
            return "";
        }

        return obj;
    },
    /**
     * @description 比较两个对象是否相等
     * @param {Object} obj1 对象参数1
     * @param {Object} obj2 对象参数2
     * @return {Boolean} true: 相等 false: 不相等
     */
    equals: function(obj1, obj2) {
        // 是否同一个引用
        if (obj1 === obj2) {
            return true;
        }
        // 两个必须都是对象
        if (typeof(obj1) === "undefined" || obj1 === null || typeof(obj1) !== "object") {
            return false;
        }
        if (typeof(obj2) === "undefined" || obj2 === null || typeof(obj2) !== "object") {
            return false;
        }
        var length1 = 0, length2 = 0;
        // 比较属性个数是否相等
        for (var ele1 in obj1) {
            length1++;
        }
        for (var ele2 in obj2) {
            length2++;
        }
        if (length1 !== length2) {
            return false;
        }
        if (obj1.constructor === obj2.constructor) {
            for (var ele in obj1) {
                if (typeof(obj1[ele]) === "object") {
                    if (!$.equals(obj1[ele], (obj2[ele]))) {
                        return false;
                    }
                }
                else if (typeof(obj1[ele]) === "function") {
                    if (!$.equals(obj1[ele].toString(), (obj2[ele].toString()))) {
                        return false;
                    }
                }
                else if (obj1[ele] !== obj2[ele]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    /**
     * @description 字符串工具函数
     */
    string: {
        /**
         * 字符串左补齐
         * @param {String/Number} value 待补齐值
         * @param {Number} length 总长度
         * @param {String/Number} padString 填充内容
         * @examples $.string.lpad("1", 3, "0")，执行后返回“001”
         */
        lpad: function(value, length, padString) {
            if ($.isNull(value)) {
                $.error("lpad() The input parameter is null.");
                return;
            }
            if ("string" === $.type(value) || "number" === $.type(value)) {
                var temp = value.toString(), tempLength = temp.length, sub;
                if (tempLength >= length) {
                    return value;
                }
                sub = length - tempLength;
                for (var i = 0; i < sub; i++) {
                    temp = padString + temp;
                }
                return temp;
            }
        },
        /**
         * @description 字符串转数值，如果不能正常转换，返回负无穷大
         * @param {String} value 值
         * @return {Number} 返回转换后的数值
         */
        toNegativeInfinity: function(value) {
            if ($.isNumber(value)) {
                return value;
            }
            
            var temp = parseFloat(value);
            if (0 !== temp && isNaN(temp)) {
                temp = Number.NEGATIVE_INFINITY;
            }
            
            return temp;
        },
        /**
         * 转换成整型数值
         * @param {String} value 以字符串型形式表示的数值
         */
        toNumber: function(value) {
            if ($.isNull(value)) {
                $.error("toNumber() The input parameter is null.");
                return;
            }
            var radix = 10;
            if ("string" === $.type(value)) {
                if (!$.isNumeric(value)) {
                    $.error("toNumber() The input parameter 'value' is not a number. value=" + value);
                    return value;
                }
                // 以0开头
                if (-1 !== value.indexOf("0")) {
                    // 截去前缀0
                    var i;
                    for (i = 0; i < value.length; i++) {
                        if ("0" !== value.charAt(i)) {
                            break;
                        }
                    }
                    if (i !== value.length) {
                        return parseInt(value.substr(i), radix);
                    }
                }
                return parseInt(value, radix);
            }
            return value;
        },
        /**
         * @description 将形式url后拼接的参数转换成json，例如a=1&b=2
         * @param {String} s 字符串
         */
        urlParamToJson: function(s) {
            if ($.isNull(s)) {
                $.error("Function urlParamToJson(): The input arg is null.");
                return;
            }
            var arr,
                    tempArr,
                    obj = {};
            arr = s.split("&");
            for (var i = 0; i < arr.length; i++) {
                tempArr = arr[i].split("=");
                obj[tempArr[0]] = tempArr[1];
            }

            return obj;
        },
        /**
         * @description 将字符串校正为有意义的数字字符串，例如"01.20"校正为"1.2"
         * @param {String} s 字符串
         */
        reviseNumber: function(s) {
            var result = "";
            // 为空返回空字符
            if ($.isNull(s)) {
                $.error("Function reviseNumber(): the input arg is null.");
                return result;
            }
            // 非数字
            if (!$.isNumeric(s)) {
                $.error("Function reviseNumber(): the input parameter 'value' is not a number. value=" + s);
                return s;
            }
            // 判断是否带有负号
            var str = s;
            var isNegative = false;
            if("-" === s[0]) {
                str = s.slice(1);
                isNegative = true;
            }
            // 判断是否为浮点数
            var decimalSeparator = ".";
            var indexDecimal = str.indexOf(decimalSeparator);
            // 获取第一个和最后一个非0字符的下标
            var firstNoZero = -1;
            var lastNoZero = - 1;
            for(var i = 0; i < str.length; i++) {
                if("0" !== str[i] && firstNoZero < 0) {
                    firstNoZero = i;
                }
                if("0" !== str[str.length - 1 - i] && lastNoZero < 0) {
                    lastNoZero = str.length - 1 - i;
                }
            }
            if(firstNoZero > lastNoZero) {
                $.error("A no-specific error!");
                return result;
            }
            //  去除没有意义的0
            if(indexDecimal > -1) {
                if(firstNoZero > indexDecimal || lastNoZero < indexDecimal) {
                    $.error("A no-specific error!");
                    return result;
                }
                // 浮点数
                if(firstNoZero === indexDecimal && lastNoZero === indexDecimal) {
                    result = "0";
                } else if(firstNoZero === indexDecimal && lastNoZero !== indexDecimal) {
                    result = str.slice(firstNoZero - 1, lastNoZero + 1);
                } else if(firstNoZero !== indexDecimal && lastNoZero === indexDecimal) {
                    result = str.slice(firstNoZero, lastNoZero);
                } else {
                    result = str.slice(firstNoZero, lastNoZero + 1);
                }
            } else {
                // 整数
                result = str.slice(firstNoZero);
            }
            // 还原负号
            return isNegative ? "-" + result : result;
        }
    },
    /**
     * @description 日期工具函数
     */
    date: {
        /**
         * @description 获取UTC格式的从1970.1.1 0:00以来的毫秒数
         * @return {String} 毫秒数
         */
        getMilliseconds: function() {
            var date = new Date();
            return date.getTime();
        },
        /**
         * @descripition 日期格式化
         * @param {Object} date 日期对象
         * @param {String} format 格式
         * @return 格式化后日期字符串
         */
        format: function(date, format) {
            var str = format;

            str = str.replace(/yyyy|YYYY/, date.getFullYear());
            str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() :
                    '0' + (date.getYear() % 100));

            str = str.replace(/MM/, date.getMonth() >= 9 ? (date.getMonth() + 1).toString() :
                    '0' + (date.getMonth() + 1));
            str = str.replace(/M/g, date.getMonth() + 1);

            str = str.replace(/w|W/g, Sweet.core.i18n.week[date.getDay()]);

            str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
            str = str.replace(/d|D/g, date.getDate());

            str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
            str = str.replace(/h|H/g, date.getHours());

            str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
            str = str.replace(/m/g, date.getMinutes());

            str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
            str = str.replace(/s|S/g, date.getSeconds());

            return str;
        },
        /**
         * @private
         * @description 获取本地机器相对于UTC事件的偏移量，单位秒
         */
        getLocalOffset: function() {
            var date = new Date();
            return date.getTimezoneOffset() * 60;
        },
        /**
         * @description 毫秒转换成日期
         * @param {Number} milliseconds 毫秒数
         * @param {String} format 日期格式，默认“年-月-日 时:分:秒”
         * @return 转换后日期字符串
         */
        millisecondsToDate: function(milliseconds, format) {
            if ("number" !== typeof milliseconds) {
                $.log("millisecondsToDate(): The input parameter 'milliseconds' is not a number! milliseconds=" +
                        milliseconds);
                return;
            }

            if ($.isNull(format)) {
                format = "YYYY-MM-dd HH:mm:ss";
            }

            return this.format(new Date(milliseconds), format);
        },
        /**
         * @description 转换UTC时间
         * @param {String} strTime 日期字符串，格式为 年/月/日 时:分:秒
         * @param {Number} timeZone 时区
         * @return {number}返回utc秒数
         */
        dateToUTC: function(strTime, timeZone) {
            if ($.isNull(timeZone)) {
                timeZone = -new Date().getTimezoneOffset()/60;
            }
            if ("string" !== typeof strTime) {
                $.log("Function dateToUTC(): The input parameter 'date' is not a string! date=" + strTime);
                return;
            }
            if ("number" !== typeof timeZone) {
                $.log("Function dateToUTC(): The input parameter 'timeZone' is not a number! timeZone=" + timeZone);
                return;
            }

            var resultTime,
                    localOffset,
                    custTimeZone = -new Date().getTimezoneOffset()/60,
                    strTimeData = strTime.split(" "),
                    strDateData = strTimeData[0].split("/"),
                    strYear = strDateData[0],
                    strMonth = strDateData[1] - 1,
                    strDay = strDateData[2],
                    strTimeData1 = !strTimeData[1] ? ["00", "00", "00"] : strTimeData[1].split(":"),
                    strHour = !strTimeData1[0] ? "00" : strTimeData1[0],
                    strMinute = !strTimeData1[1] ? "00" : strTimeData1[1],
                    strSecond = !strTimeData1[2] ? "00" : strTimeData1[2];
            var pDate = new Date(strYear, strMonth, strDay, strHour, strMinute, strSecond, 0);

            if (!isNaN(pDate)) {
                custTimeZone = -pDate.getTimezoneOffset() / 60;
                resultTime = pDate.getTime() - 3600 * 1000 * (timeZone - custTimeZone);
                resultTime = resultTime / 1000;
                resultTime = Math.floor(resultTime);
                if ($.isNull(resultTime)) {
                    return 0;
                } else {
                    return resultTime;
                }
            }
            else {
                return 0;
            }
        },
        /**
         * @description UTC时间转换为本地时间
         * @param {Number} value utc时间秒数
         */
        UTCToDate: function(value) {
            // 为空判断
            if ($.isNull(value)) {
                $.error("Function UTCToDate(): The input args is null.");
                return;
            }

            var date = new Date();
            date.setTime(value * 1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if ((String(month)).length < 2)
            {
                month = "0" + month;
            }
            var day = date.getDate();
            if ((String(day)).length < 2)
            {
                day = "0" + day;
            }
            var hour = date.getHours();
            if ((String(hour)).length < 2)
            {
                hour = "0" + hour;
            }
            var minute = date.getMinutes();
            if ((String(minute)).length < 2)
            {
                minute = "0" + minute;
            }
            var second = date.getSeconds();
            if ((String(second)).length < 2)
            {
                second = "0" + second;
            }

            return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        },
        /**
         * @description 判断是否闰年
         * @param {Number} year 年
         */
        isLeapYear: function(year) {
            if (!$.isNumeric(year)) {
                $.error("Function isLeapYear(): The input parameter 'year' is not a number! year=" + year);
                return false;
            }
            if ("number" !== typeof year) {
                year = parseInt(year, 10);
            }
            // 判断是否闰年
            if (((0 === year % 4) && (0 !== year % 100)) || (0 === year % 400)) {
                return true;
            }
            return false;
        },
        /**
         * @description 时间向后规整,目前支持15分钟，1小时，1天三个粒度时间规整，可用根据实际扩展
         * @param {Number} utc :要规整的UTC时间，单位：秒
         * @param {Number} currentUtc :当前服务器UTC秒数，若设置的时间超出当前时间则向前规整,为空的话默认采用客户端当前时间
         * @param {Number} intervalSeconds :规整粒度的秒数
         * @param {Number} timeZone:时区
         * @return {Number} 返回规整后的UTC时间，单位：秒
         */
        setDateAfterOrder: function(intervalSeconds, utc, currentUtc, timeZone) {
            var tempUtc = utc,
                timeOffset,
                secDifference,
                intervalKey = parseInt(intervalSeconds, 10),
                custmerTodayUtc = new Date().getTime()/1000,
                    custermorTimezone = -new Date(currentUtc * 1000).getTimezoneOffset() / 60,
                todayUTC = $.isNotNull(currentUtc) ? currentUtc : custmerTodayUtc;

            timeZone ? timeZone : (timeZone = custermorTimezone);
            timeOffset = timeZone * 3600;
            (tempUtc >= currentUtc) ? (tempUtc = currentUtc) : "";

            if($.isNotNull(intervalKey)){
                secDifference = (tempUtc + timeOffset) % intervalKey;

                if (0 < secDifference) {
                    tempUtc = ((tempUtc - secDifference) / intervalKey + 1) * intervalKey;
                    while (tempUtc > todayUTC) {
                        tempUtc = tempUtc - intervalKey;
                    }
                }
            }

            return tempUtc;
        },
        
        /**
         * @description 开始时间、结束时间规整函数
         * @param {Number} cycle 时间粒度秒数
         * @param {Number} startTimeUtc 开始时间的utc秒数
         * @param {Number} endTimeUtc 结束时间的utc秒数
         * @param {Number} currentUtc 当前时间的utc秒数
         * @param {Number} timezone:时区
         * @return {Object} 返回规整后开始、结束时间，格式为{"start": startTime, "end": endTime}
         */
        setTimeAlignment:function(cycle, startTimeUtc, endTimeUtc, currentUtc, timezone) {
            var _startTime = $.date.setDateAfterOrder(cycle, startTimeUtc, currentUtc, timezone),
                _endTime = $.date.setDateAfterOrder(cycle, endTimeUtc, currentUtc, timezone);
            
            if (_startTime === _endTime) {
                _startTime = _startTime - cycle;
            }
            
            return {"start": _startTime, "end": _endTime};
        },
        
        /**
         * @description 时间向后规整,目前支持15分钟，1小时，1天三个粒度时间规整，可用根据实际扩展
         * @param {Number} utc :要规整的时间，单位：秒
         * @param {Number} granularity :规整粒度的秒数
         * @return {Number} 返回规整后的时间，单位：秒
         */
        fixTime:function(granularity, utc){
            if($.isNull(utc) || $.isNull(granularity) || parseInt(granularity, 10) === 0){
                $.log("Granularity Error value:"+granularity);
                return utc;
            }
            var timeZoneVar = new Date();
            var timeOffset = timeZoneVar.getTimezoneOffset() * 60;
            var localTime = parseInt(utc, 10) - timeOffset;//转成本地时间
            var mod = localTime % parseInt(granularity, 10);
            var restime = localTime - mod + parseInt(granularity, 10);
            restime = restime + timeOffset;//规整后转为UTC
            return restime;
        },
        /**
         * @description 把UTC时间规整为当地时间，根据granularity和period决定规整成时间、日期+时间、月+日期+时间、或者年+月+日+时间
         * @value utc时间
         * @granularity 时间粒度
         * @period  数据的周期
         */
        UTCToDateTime:function(value,granularity,period){
            // 为空判断
            if ($.isNull(value)) {
                $.error("Function UTCToDateTime(): The input args is null.");
                return;
            }
            var date = new Date();
            date.setTime(value * 1000);
            var month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = date.getDate();
            day = day < 10 ? "0"+day : day;
            var hour = date.getHours();
            hour = hour < 10 ? "0"+hour : hour;
            var minute = date.getMinutes();
            minute = minute < 10 ? "0"+minute:minute;
            if($.isNull(granularity) || $.isNull(period)){
                return hour + ":" + minute;
            }

            //Dashboard只支持：15分钟/小时/天(没有考虑跨天情况，需要优化)
            if(parseInt(granularity,10) >= 86400){//粒度天
                return month + "/" + day;
            }
            else if(parseInt(granularity,10) >= 3600){//粒度小时
                return month + "/" + day+" "+hour+":" + minute;
            }
            else if(parseInt(granularity,10) >= 900){//粒度15分钟
                return hour + ":" + minute;
            }
        },
        /**
         * @description 比较日期大小。开始日期大返回1，相等返回0，开始日期小返回-1
         * @param {String} beginDate 开始日期，形如2013-08-02 12:07:58
         * @param {String} endDate 结束日期
         * @param {String} separator 日期分割符，默认"-"
         */
        compare: function(beginDate, endDate, separator) {
            var date1, date2, regExp, time1, time2;
            if ($.isNotNull(separator)) {
                regExp = new RegExp(separator, "g");
                date1 = new Date(beginDate.replace(regExp, "/"));
                date2 = new Date(endDate.replace(regExp, "/"));
            } else {
                date1 = new Date(beginDate);
                date2 = new Date(endDate);
            }
            
            time1 = date1.getTime();
            time2 = date2.getTime();
            if (time1 > time2) {
                return 1;
            } else if (time1 === time2) {
                return 0;
            } else {
                return -1;
            }
        },
        /**
         * @private
         * @description 获取指定年份的夏令时起始时间
         * @param {Number} year 年
         * @return {Array/null} 返回夏令时起始时间[year, month, day, hours, minutes, seconds],如果无夏令时则返回null
         */
        getSDstSwitchDate: function(year) {
            var me = this,
                    firstDstDate = null,
                    firstSwitch = 0,
                    lastOffset = 99,
                    newDate,
                    tz;
            year = parseInt(year);
            if (isNaN(year)) {
                return firstDstDate;
            }
            if (year < 1000) {
                year += 1900;
            }
            for (var i = 0; i < 12; i++) {
                newDate = new Date(Date.UTC(year, i, 0, 0, 0, 0, 0));
                tz = -1 * newDate.getTimezoneOffset() / 60;
                if (tz > lastOffset) {
                    firstSwitch = i - 1;
                }
                lastOffset = tz;
            }
            firstDstDate = me._findDstSwitchDate(year, firstSwitch);
            return firstDstDate;
        },
        /**
         * @private
         * @description 内部获得夏令时函数处理
         * @param {Number} year 年
         * @param {Number} month 月
         */
        _findDstSwitchDate: function(year, month) {
            var me = this,
                    baseDate = new Date(Date.UTC(year, month, 0, 0, 0, 0, 0)),
                    changeMinute = -1,
                    baseOffset = -1 * baseDate.getTimezoneOffset() / 60,
                    dstDate,
                    dstDay,
                    tmpDate,
                    tmpHours,
                    tmpMinutes,
                    tmpSeconds,
                    tmpOffset,
                    minutes = 0,
                    tmpArray,
                    days;
            for (var day = 0; day < 50; day++) {
                tmpDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
                if (tmpOffset != baseOffset) {
                    minutes = 0;
                    tmpDate = new Date(Date.UTC(year, month, day - 1, 0, 0, 0, 0));
                    tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
                    while (changeMinute == -1) {
                        tmpDate = new Date(Date.UTC(year, month, day - 1, 0, minutes, 0, 0));
                        tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;
                        if (tmpOffset != baseOffset) {
                            tmpOffset = new Date(Date.UTC(year, month, day - 1, 0, minutes - 1, 0, 0));
                            changeMinute = minutes;
                            break;
                        } else {
                            minutes++;
                        }
                    }
                    dstDate = tmpOffset.getMonth() + 1;
                    dstDay = tmpOffset.getDate();
                    tmpDate = new Date(Date.UTC(year, month, day - 1, 0, minutes - 1, 0, 0));
                    tmpArray = tmpDate.toTimeString().split(' ')[0].split(':');
                    tmpHours = parseInt(tmpArray[0]);
                    tmpMinutes = parseInt(tmpArray[1]);
                    tmpSeconds = parseInt(tmpArray[2]);
                    if (month == 1) {
                        if (me.isLeapYear(year)) {
                            days = 29;
                        } else {
                            days = 28;
                        }
                    } else if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                        days = 31;
                    } else {
                        days = 30;
                    }
                    if ((tmpMinutes + 1) >= 60) {
                        tmpMinutes = 0;
                        tmpHours += 1;
                    }
                    if (tmpHours > 23) {
                        tmpHours = 0;
                        dstDay += 1;
                    }
                    if (dstDay > days) {
                        dstDay = 1;
                        month += 1;
                    }
                    if (month > 11) {
                        month = 0;
                        year += 1;
                    }
                    return [year, month, dstDay, tmpHours, tmpMinutes, tmpSeconds];
                }
            }
            return null;
        }
    },
    number: {
        /**
         * 修正小数精度
         * @param {Number} value 待修正值
         * @param {Number} precision 精度
         * @return {Number} 返回修正后值
         */
        fixPrecision: function(value, precision) {
            if (!$.isNumeric(value)) {
                $.log("Function fixPrecision(): The input parameter 'value' is not a number! value=" + value);
                return;
            }
            return parseFloat(parseFloat(value).toFixed(precision));
        },
        /**
         * 判断是否浮点数
         * @param {Number} value 浮点数值
         * @return {Boolean} true浮点数 false非浮点数
         */
        isFloat: function(value) {
            if (!$.isNumeric(value)) {
                $.log("Function isFloat(): The input parameter 'value' is not a number! value=" + value);
                return;
            }
            if ("string" === typeof value) {
                return -1 !== value.indexOf(".");
            }
            return value !== Math.round(value);
        },
        /**
         * @description 将数字转换为16进制表示
         * @param {String/Number} N : 范围是0 ~ 255
         * @returns {String}16进制字符串
         */
        toHex: function (N) {
            if ($.isNull(N)){
                return "00";
            }

            N = parseInt(N, 10);

            if (0 === N || isNaN(N)){
                return "00";
            }

            N = Math.max(0,N);
            N = Math.min(N,255);
            N = Math.round(N);

            return "0123456789abcdef".charAt((N-N%16)/16) + "0123456789abcdef".charAt(N%16);
        }
    },
    /**
     * 对event处理
     */
    e: {
        /**
         * 获取键盘ascii编码值
         * @param {Object} e 按键对象
         */
        getCharCode: function(e) {
            var event = e.browserEvent || e;
            return event.charCode || event.keyCode || 0;
        },
        /**
         * 获取所标位置
         * @param {Object} event 按键对象
         */
        getMousePosition: function(event) {
            var e = event || window.event,
                    scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
                    scrollY = document.documentElement.scrollTop || document.body.scrollTop,
                    x = e.pageX || e.clientX + scrollX,
                    y = e.pageY || e.clientY + scrollY;
            return {"x": x, "y": y};
        },
        /**
         * @description 只允许输入数字
         * @param {Object} event 事件对象
         */
        onlyNumber: function(event) {
            // 退格键、回车键、删除键、上下左右方向键，不做处理
            if (Sweet.constants.keyCode.BACKSPACE === event.keyCode ||
                    Sweet.constants.keyCode.ENTER === event.keyCode ||
                    Sweet.constants.keyCode.DELETE === event.keyCode ||
                    Sweet.constants.keyCode.LEFT === event.keyCode ||
                    Sweet.constants.keyCode.RIGHT === event.keyCode ||
                    Sweet.constants.keyCode.DOWN === event.keyCode ||
                    Sweet.constants.keyCode.UP === event.keyCode ||
                    Sweet.constants.keyCode.TAB === event.keyCode) {
                return;
            }
            var charRe = new RegExp("[0123456789]"),
                    ch = String.fromCharCode($.e.getCharCode(event));
            if (!charRe.test(ch)) {
                event.preventDefault();
            }
        }
    },
    /**
     * 对光标处理
     */
    cursor: {
        /**
         * 获取光标位置
         * @param {Object} domObj 数值框对象
         * @returns {Object} {start: 光标起始位置，end: 光标结束位置}
         */
        getSelection: function(domObj) {
            if (domObj.createTextRange) {
                var s1 = document.selection.createRange().duplicate();
                s1.moveStart("character", -domObj.value.length);
                var p1 = s1.text.length;

                var s2 = document.selection.createRange().duplicate();
                s2.moveEnd("character", domObj.value.length);
                var p2 = domObj.value.lastIndexOf(s2.text);
                if ("" === s2.text) {
                    p2 = domObj.value.length;
                }
                return {start: p2, end: p1};
            } else {
                return {start: domObj.selectionStart, end: domObj.selectionEnd};
            }
        }
    },
    /**
     * 对cookie操作
     */
    cookie: {
        /**
         * @description 设置cookie值
         * @param {String} key 键
         * @param {String} value 值
         * @param {Number} expiredays 有效时间，单位：天
         */
        set: function(key, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = key +
                    "=" +
                    escape(value) +
                    ((null === expiredays) ? "" : ";expires=" +
                            exdate.toGMTString()) + ";path=/";
        },
        /**
         * @description 获取指定键的cookie值
         * @param {String} key 键
         */
        get: function(key) {
            if (document.cookie.length > 0) {
                var start = document.cookie.indexOf(key + "="), end;
                if (-1 !== start) {
                    start = start + key.length + 1;
                    end = document.cookie.indexOf(";", start);
                    if (-1 === end)
                    {
                        end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(start, end));
                }
            }
            return;
        }
    },
    /**
     * @description 对正则的公共处理
     */
    regExp: {
        /**
         * @description 正则表达式转义特殊字符，涉及特殊字符：$ ( ) * + [ ? \ ^
         * @param {String} value 值
         * @return {String} 转义后值
         */
        escape: function(value) {
            if ($.isNull(value)) {
                return;
            }

            return value.replace(/\\/g, "\\\\")
                    .replace(/\$/g, "\\$")
                    .replace(/\(/g, "\\(")
                    .replace(/\)/g, "\\)")
                    .replace(/\*/g, "\\*")
                    .replace(/\+/g, "\\+")
                    .replace(/\[/g, "\\[")
                    .replace(/\?/g, "\\?")
                    .replace(/\^/g, "\\^");
        }
    },
    /*
     * 取外部大小，包括margin
     */
    externalSize: function(obj) {
        var size = {width: 0, height: 0};
        var objEl = $(obj);

        if (objEl.length === 0) {
            return size;
        }

        size.width = objEl.externalWidth();
        size.height = objEl.externalHeight();

        return size;
    },
    /**
     * @description 列操作，返回html字符串
     * @param {Object} params 传入回调函数的值，包括：
     * row: 行数
     * column: 列数
     * data: 单元格数据
     * rowData: 行数据
     * columnDesc: 列描述
     * @return {String} 返回一段html字符串
     */
    operColumn: function(params) {
        var html = "<div class=\"sweet-common-opercolumn\">",
                data = $.extend({}, {"row": 0,
            "column": 0,
            "data": 0,
            "rowData": {},
            "columnDesc": {}
        }, params);

        /**
         * @description 生成操作图片，并绑定事件
         * @param {String} className 类名
         * @param {Number} row 行数
         * @param {Number} column 列数
         * @param {String} title 提示
         */
        function getOperPic(className, row, column, title) {
            return "<a href=\"javascript:void(0);\" " +
                    "class=\"" + className + " space\" " +
                    "row=\"" + row + "\" " +
                    "column=\"" + column + "\" " +
                    "title=\"" + title + "\"" +
                    "></a>";
        }

        for (var temp in data.columnDesc.rendererArr) {
            if (data.columnDesc.rendererArr.hasOwnProperty(temp)) {
                if (Sweet.constants.operType.EDIT === temp) {
                    html += getOperPic("sweet-common-opercolumn-edit", data.row, data.column,
                            Sweet.core.i18n.grid.edit);
                } else if (Sweet.constants.operType.MODIFY === temp) {
                    html += getOperPic("sweet-common-opercolumn-modify", data.row, data.column,
                            Sweet.core.i18n.grid.modify);
                } else if (Sweet.constants.operType.DELETE === temp) {
                    html += getOperPic("sweet-common-opercolumn-delete", data.row, data.column,
                            Sweet.core.i18n.grid["delete"]);
                } else if (Sweet.constants.operType.CLOSE === temp) {
                    html += getOperPic("sweet-common-opercolumn-close", data.row, data.column,
                            Sweet.core.i18n.grid.close);
                } else if (Sweet.constants.operType.PAUSE === temp) {
                    html += getOperPic("sweet-common-opercolumn-pause", data.row, data.column,
                            Sweet.core.i18n.grid.pause);
                } else if (Sweet.constants.operType.START === temp) {
                    html += getOperPic("sweet-common-opercolumn-start", data.row, data.column,
                            Sweet.core.i18n.grid.start);
                } else if (Sweet.constants.operType.RESET === temp) {
                    html += getOperPic("sweet-common-opercolumn-reset", data.row, data.column,
                            Sweet.core.i18n.grid.reset);
                } else if (Sweet.constants.operType.DETAIL === temp) {
                    html += getOperPic("sweet-common-opercolumn-detail", data.row, data.column,
                            Sweet.core.i18n.grid.detail);
                } else if (Sweet.constants.operType.CONFIRM === temp) {
                    html += getOperPic("sweet-common-opercolumn-confirm", data.row, data.column,
                            Sweet.core.i18n.grid.confirm);
                }
            }
        }
        html += "<div>";
        return html;
    },
    /**
     * @description html转义
     * @param {String} value 待转义字符串
     */
    htmlEscape: function(value) {
        if ($.isNull(value) || !$.isString(value)) {
            return value;
        }
        return value.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/ /g, "&nbsp;");
    },
    /**
     * @description html逆转义
     * @param {String} value 待处理字符串
     */
    htmlInversEscape: function(value) {
        if ($.isNull(value)) {
            return;
        }
        return value.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&nbsp;/g, " ");
    },
    /**
     * @description 判断是否IE浏览器
     * @return {Boolean} 是否IE
     */
    isIE: function() {
        'use strict';

        var r = /MSIE\s\d+\.\d/;
        var agent = navigator.userAgent;
        return r.test(agent);
    },
    /**
     * @description 判断是否火狐浏览器
     * @return {Boolean} 是否火狐
     */
    isFirefox: function() {
        'use strict';

        var r = /Firefox\/\d+\.\d/;
        var agent = navigator.userAgent;
        return r.test(agent);
    },
    /**
     * @description 判断是否Chrome浏览器
     * @return {Boolean} 是否Chrome
     */
    isChrome: function() {
        'use strict';

        var r = /Chrome\/\d+/;
        var agent = navigator.userAgent;
        return r.test(agent);
    },
    /**
     * @description 递归给每个叶子节点赋值，适合于给[{value: , text: , data: }]型数据的data节点赋值
     * @param {Array} destArr 目标数组
     * @param {String} nodeName 节点名称
     * @param {Object} data 增加的数据
     */
    recursiveAssign: function(destArr, nodeName, data) {
        if ($.isNull(destArr)) {
            return;
        }
        var temp;
        for (var i = 0; i < destArr.length; i++) {
            temp = destArr[i];
            if (temp.children && 0 < temp.children.length) {
                if (temp.data) {
                    temp.data[nodeName] = data;
                } else {
                    temp.data = {};
                    temp.data[nodeName] = data;
                }
                $.recursiveAssign(temp.children, nodeName, data);
            } else {
                if (temp.data) {
                    temp.data[nodeName] = data;
                } else {
                    temp.data = {};
                    temp.data[nodeName] = data;
                }
            }
        }
    },
    /**
     * @description 获取指定class名元素的最大z-index值
     * @param {Number} currentZIndex 当前z-index值
     * @param {String/Array} classNames class名称
     * @return {Number} 返回最大z-index值
     */
    getMaxZIndex: function(currentZIndex, classNames) {
        var classes = [Sweet.constants.className.MASK,
            Sweet.constants.className.FLOAT_WINDOW,
            Sweet.constants.className.DIALOG];
        var tempZIndex = 0;
        var maxZIndex = Sweet.constants.Z_INDEX;

        if (!$.isNull(classNames)) {
            var type = $.type(classNames);
            if ("string" !== type && "array" !== type) {
                $.log("Illegal parameter! Not string or array.");
                return;
            }

            if ('string' === type) {
                classes.push(classNames);
            } else {
                classes.concat(classNames);
            }
        }

        $.each(classes, function(index, classNames) {
            $("." + classNames).each(function() {
                tempZIndex = $(this).css("z-index");
                if (!isNaN(tempZIndex)) {
                    maxZIndex = Math.max(maxZIndex, tempZIndex);
                }
            });
        });

        maxZIndex += Sweet.constants.Z_INDEX_STEP;
        return maxZIndex;
    },
    /**
     * @description 动态计算弹出组件的相对位置
     * @param {Object} targetEl 目标元素
     * @param {Object} floatEl 浮动元素
     * @param {Boolean} bool true:计算左右位置，否则计算上下位置
     * @return {Object} 返回top、left值，格式{top: 1, left: 1}
     */
    getFloatOffset: function(targetEl, floatEl, bool) {
        var win = $(window),
                doc = $(document),
                maxShown = win.height() + doc.scrollTop(),
                maxVShown = win.width() + doc.scrollLeft(),
                targetElOffset = targetEl.offset(),
                targetElWidth = targetEl.outerWidth(true),
                targetElHeight = targetEl.outerHeight(true),
                floatElWidth = floatEl.outerWidth(true),
                floatElHeight = floatEl.outerHeight(true);
        // 计算右边是否有足够展示空间
        if (bool) {
            // 左对齐不够显示浮动框，且右对齐可以显示浮动框，才选择右对齐
            if (maxVShown - targetElOffset.left <= floatElWidth) {
                if(targetElOffset.left + targetElWidth > floatElWidth) {
                    return {"top": targetElOffset.top + targetElHeight,
                        "left": targetElOffset.left - floatElWidth + targetElWidth};
                }
            }
            // 左对齐
            return {"top": targetElOffset.top + targetElHeight, "left": targetElOffset.left};
        }
        // 计算下部是否有空间展示
        else {
            // 下面显示不下浮动框，且上面可以显示下浮动框，才选择在上面显示
            if (maxShown - targetElOffset.top - targetElHeight <= floatElHeight) {
                if(targetElOffset.top >= floatElHeight) {
                    return {"top": targetElOffset.top - floatElHeight, "left": targetElOffset.left};
                }
            }
            // 浮动框在下面显示
            return {"top": targetElOffset.top + targetElHeight, "left": targetElOffset.left};
        }
    },
    /**
     * @description 获取对象padding值
     * @param {Object} obj 待获取目标对象
     * @return {Array} 以数组形式返回padding值，格式如：[top, right, bottom, left]
     */
    getPadding: function(obj) {
        return [
            $.getPaddingTop(obj),
            $.getPaddingRight(obj),
            $.getPaddingBottom(obj),
            $.getPaddingLeft(obj)
        ];
    },
    /**
     * @description 获取对象的padding top值
     * @param {Object} obj 待获取目标对象
     * @return {Number} padding top值
     */
    getPaddingTop: function(obj) {
        return parseInt(obj.css("padding-top").slice(0, -2), 10);
    },
    /**
     * @description 获取对象的padding right值
     * @param {Object} obj 待获取目标对象
     * @return {Number} padding right值
     */
    getPaddingRight: function(obj) {
        return parseInt(obj.css("padding-right").slice(0, -2), 10);
    },
    /**
     * @description 获取对象的padding bottom值
     * @param {Object} obj 待获取目标对象
     * @return {Number} padding bottom值
     */
    getPaddingBottom: function(obj) {
        return parseInt(obj.css("padding-bottom").slice(0, -2), 10);
    },
    /**
     * @description 获取对象的padding left值
     * @param {Object} obj 待获取目标对象
     * @return {Number} padding left值
     */
    getPaddingLeft: function(obj) {
        return parseInt(obj.css("padding-left").slice(0, -2), 10);
    },
    /**
     * @description 对矩阵处理
     */
    matrix: {
        /**
         * @descrption 矩阵的翻转处理
         * @param {Array} matrix 原始矩阵
         * @return {Array} 返回翻转后矩阵，做行、列交换
         */
        reversal: function(matrix) {
            if (!$.isArray(matrix)) {
                $.error("Function reversal(): The input arg is not array.");
                return;
            }
            var temp = [],
                    length = matrix.length,
                    tempLength = 0;
            for (var i = 0; i < length; i++) {
                tempLength = matrix[i].length;
                for (var j = 0; j < tempLength; j++) {
                    if (!temp[j]) {
                        temp[j] = [];
                    }
                    temp[j][i] = matrix[i][j];
                }
            }

            return temp;
        }
    },
    /**
     * @description canvas中将window坐标转换为canvas坐标系统值
     * @param {Object} canvas canvas对象
     * @param {number} x window坐标系统中的x坐标
     * @param {number} y window坐标系统中的y坐标
     * @return {obkect} 返回转换为canvas坐标系统后的x, y值
     */
    windowToCanvas : function(canvas, x, y){
        var bbox = canvas.getBoundingClientRect();

        return {
            x : x - bbox.left * (canvas.width/bbox.width),
            y : y - bbox.top * (canvas.height/bbox.height)
        };
    },
    /**
     * @description 将16进制的颜色值转换为[255, 222, 12]rgb通道的颜色值
     * @param {String} color 16进制的颜色值
     * @return {Array} 返回rgb的颜色值
     */
    color2rgb : function(color){
        var r = parseInt(color.substr(1, 2), 16);
        var g = parseInt(color.substr(3, 2), 16);
        var b = parseInt(color.substr(5, 2), 16);
        return [r, g, b];
    },
    /**
     * @description 将[255, 222, 12]rgb通道的颜色值转换为16进制的颜色值
     * @param {Array} rgbArr rgb颜色值的数据
     * @return {String} 返回16进制的颜色值
     */
    rgb2color : function(rgbArr){
        var s = "";
        for(var i = 0; i < rgbArr.length; i++){
            var c = Math.round(rgbArr[i]).toString(16);
            if(c.length === 1){
                c = "0" + c;	
            }
            s += c;
        }

        return "0x" + s.toUpperCase();
    },

    /**
     * @description 生成线性渐变的颜色
     * @param {String} sColor 开始渐变的颜色值(16进制)
     * @param {String} eColor 渐变结束的颜色值(16进制)
     * @param {number} step 开始到结束渐变总共需要分成多少等份，表示步长值
     * @return {Array} colors 分成step等份的颜色值
     */
    lineGradient : function(sColor, eColor, step){
        var result = [];
        var srgb = $.color2rgb(sColor);
        var ergb = $.color2rgb(eColor);

        for(var i = 0; i < step; i++){
            var temp = [];
            for(var j = 0; j < 3; j++){
                temp.push(srgb[j] + (ergb[j] - srgb[j]) / step * i);
            }
            result.push($.rgb2color(temp));
        }

        return result;
    },
    /**
    * 颜色变浅(begincolor表示深色)或变深(begincolor表示浅色)函数
    * @param begincolor 当前要变化的点的颜色，如：0x078DC7
    * @param endcolor 颜色变化的最大程度，如：0x078DC7
    * @param data 数据集合
    * @return 变化后的颜色
    */
    colorStepByStep : function(begincolor, endcolor, data) {
        var r, g, b, r0, g0, b0, 
                tr, tg, tb,
                MAX = 100,
                rate = 0,
                count = data ? data.length : 0,
                result = [];
        if(count > 0){
            if(count === 1){
                return [begincolor];
            }
            if(count === 2){
                return [begincolor, endcolor];
            }
        } else {
            return result;
        }
        
        r = (begincolor & 0x00ff0000) >>> 16;
        g = (begincolor & 0x0000ff00) >>> 8;
        b = begincolor & 0x000000ff;
        r0 = (endcolor & 0x00ff0000) >>> 16;
        g0 = (endcolor & 0x0000ff00) >>> 8;
        b0 = endcolor & 0x000000ff;
        
        rate = Math.floor(MAX / (count - 1));
        for(var i = 0; i < count; i++){
            var temp = i * rate;
            tr = ((r + temp * (r0 - r) / MAX) & 0xff);
            tg = ((g + temp * (g0 - g) / MAX) & 0xff);
            tb = ((b + temp * (b0 - b) / MAX) & 0xff);
            result.push($.rgb2color([tr, tg, tb]));
        }
        return result;
    },
    /**
     * @description 删除svg中的所有包含pattern和image的节点
     * @argument {Object} svgDom svg对象，必须是原生的dom对象
     */
    dealAttrSVG : function(svgDom) {
        // 强制对属性进行处理
        function removeSpecAttr(svg, tag) {
            var items	= svg.getElementsByTagName(tag);
            var i		= items.length;
            while(i--) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
        //强制对此类属性进行删除
        removeSpecAttr(svgDom, 'pattern');
        removeSpecAttr(svgDom, 'image');
        return svgDom;
    },
    /**
     * @description 模糊过滤
     * @param {Array} data 数组，格式为{"value": , "text":}
     * @param {String} value 过滤的目标
     * @param {String} textFilter 是否按text过滤，默认true
     * @param {Boolean} filterDir 是否过滤目录
     * @param {Boolean} clone 是否克隆数据
     * @return {Array} 返回过滤后的数据
     */
    fuzzyFilter: function(data, value, textFilter, filterDir, clone) {
        // 入参合法性校验
        if ($.isNull(data)) {
            return data;
        }
        value = $.isNull(value) ? "" : value;
        filterDir = filterDir || false;
        clone = clone || false;
        var field = "value",
                me = this,
                tempData,
                regExp = new RegExp($.regExp.escape(value), "i");
        if (!clone) {
            tempData = $.objClone(data);
        } else {
            tempData = data;
        }
        if (!textFilter) {
            field = "text";
        }
        // 执行过滤匹配操作
        var testResult, text, allNull;
        $.each(tempData, function(index, childData) {
            if (!$.isNull(childData))
            {
                if (childData.children && 0 < childData.children.length) {
                    //filterDir:true为带目录过滤，否则为叶子节点过滤
                    if (filterDir) {
                        //判断目录是否匹配
                        testResult = false;
                        text = childData[field];
                        testResult = regExp.test(text);
                        //判断是否包含过滤字符串
                        if (testResult) {
                            return;
                        } else {
                            me.fuzzyFilter(childData.children, value, textFilter, filterDir, true);
                        }
                    } else {
                        me.fuzzyFilter(childData.children, value, textFilter, filterDir, true);
                    }
                    //判断chilData.children是否都为空
                    allNull = false;
                    $.each(childData.children, function(index, child) {
                        if (!$.isNull(child)) {
                            allNull = true;
                        }
                    });
                    //删除没有叶子的节点
                    if (!allNull) {
                        delete tempData[index];
                    }
                } else {
                    testResult = false;
                    text = childData[field];
                    testResult = regExp.test(text);
                    //判断是否包含过滤字符串
                    if (!testResult) {
                        delete tempData[index];
                    }
                }
            }
        });
        return me.deleteUndefinedData(tempData);
    },
    /**
     *@description 将数据中包含的undefined节点删除，从新生成不包含undefined的数据
     *@private
     *@param {Object} data 树数据
     *@return {Array} 树节点对应的值,格式如[{text:'text1',value:'value1'},...]
     */
    deleteUndefinedData: function(data) {
        var me = this,
                selectArray = [];
        for (var key in data) {
            var mapObj = data[key];
            if (!$.isNull(mapObj) && !$.isFunction(mapObj) && !$.isNull(mapObj.value)) {
                var obj = {"text": mapObj.text, "value": mapObj.value, 
                            "data": mapObj.data, "editable": mapObj.editable};
                me._createChildNode(data[key].children, obj);
                selectArray.push(obj);
            }
        }
        return selectArray;
    },
    /**
     * @description 生成树形结构的子节点
     * @private
     * @param {Object} listMap 节点对应的子节点数据
     * @param {Object} obj 节点数据
     * @return {Array} 叶子节点对应的值,格式如[{text:'text1',value:'value1',data:''},...]
     */
    _createChildNode: function(listMap, obj) {
        var me = this,
                mapObj,
                arrayObj,
                isOK = true;
        if ($.isNull(listMap) || $.isNull(obj)) {
            return[];
        }
         for (var key in listMap) {
              mapObj = listMap[key]; 
              //如果存在text属性
              if(!$.isNull(mapObj) && !$.isNull(mapObj.text)){
                  isOK = false;
                  break;
              }
         }
        if(isOK && $.isArray(listMap) && 0 === listMap.length){
            return[];
        }
        for (var key in listMap) {
            if ($.isNull(obj.children)) {
                obj.children = [];
            }
            mapObj = listMap[key];
            if($.isNull(mapObj) || $.isFunction(mapObj)){
                continue;
            }
            arrayObj = {"text": mapObj.text, "value": mapObj.value, 
                        "data": mapObj.data, "editable": mapObj.editable};
            if (mapObj.children) {
                arrayObj.children = [];
                obj.children.push(arrayObj);
                me._createChildNode(mapObj.children, arrayObj);
            }
            else {
                obj.children.push(arrayObj);
            }
        }
    }
});



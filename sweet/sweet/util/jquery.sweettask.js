/**
 * @fileOverview  
 * <pre>
 * 定时任务
 * 2013/4/23
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1998-2013,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function($) {
    // 处理IE下setTimeout、setInterval不能传参问题
    if ($.isIE()) {
        var st = window.setTimeout;
        var si = window.setInterval;
        window.setTimeout = function(fn, mDelay) {
            var t = new Date().getTime();
            if (typeof fn === 'function') {
                var args = Array.prototype.slice.call(arguments, 2);
                var f = function() {
                    args.push(new Date().getTime() - t - mDelay);
                    fn.apply(null, args);
                };
                return st(f, mDelay);
            }
            return st(fn, mDelay);
        };
        window.setInterval = function(fn, mDelay) {
            var t = new Date().getTime();
            if (typeof fn === 'function') {
                var args = Array.prototype.slice.call(arguments, 2);
                var f = function() {
                    args.push(new Date().getTime() - t - mDelay);
                    fn.apply(null, args);
                };
                return si(f, mDelay);
            }
            return si(fn, mDelay);
        };
    }

    var Timeout = function() {
        // 任务列表
        var logPrefix = "[Sweet.Task.Timeout]: ";
        // 任务ID与timeout对象对应关系
        var queue = {};
        // 执行任务
        var executeTask = function(task) {
            if (!task || !queue[task.id]) {
                return;
            }
            // 是否关闭任务
            if (queue[task.id]["stop"]) {
                stopTask(task.id);
                return;
            }
            // 是否暂停任务
            if (queue[task.id]["pause"]) {
                return;
            }
            task.run.call(task.scope || task, task.args);
            queue[task.id]["timeout"] = window.setTimeout(executeTask, task.interval, task);
            $.log(logPrefix + "Timer task start. ID = " + task.id);
        };
        // 启动任务
        var startTask = function(task) {
            queue[task.id] = {};
            $.extend(queue[task.id], task);
            queue[task.id]["stop"] = false;
            queue[task.id]["pause"] = false;
            queue[task.id]["timeout"] = window.setTimeout(executeTask, task.interval, task);
        };
        // 关闭任务
        var stopTask = function(id, isCallBack) {
            var task = queue[id];
            if (!task) {
                return;
            }

            var timeout = task["timeout"];
            if (timeout) {
                clearTimeout(timeout);
            }

            // 执行回调
            var callBack = task["callBack"];
            if (callBack && !isCallBack) {
                callBack.call(task.scope || task);
            }
            delete queue[id];
        };
        /**
         * @description 启动任务
         * @param {Object} task 任务配置，配置选项包括
         * {
         *      id: "",              // 任务ID
         *      run: Function,       // 定时调用执行的方法
         *      scope: Object,       // 作用域
         *      args: Arra,          // 传递给run的参数数组
         *      interval: Number     // 任务执行定时间隔，单位ms
         * }
         */
        this.start = function(task) {
            var id = task.id;
            // task id不能为空
            if ($.isNull(id)) {
                $.error(logPrefix + "Task id can not be empty!");
                return;
            }

            // 校验任务是否存在
            if (queue[id]) {
                stopTask(id, true);
                $.log(logPrefix + "The task has already exist!");
            }

            // 启动任务
            startTask(task);
        };
        /**
         * @description 激活指定任务
         * @param {String} id 任务ID
         */
        this.active = function(id) {
            var task = queue[id];
            if (task) {
                startTask(task);
            }
        };
        /**
         * @description 激活所有任务
         */
        this.activeAll = function() {
            $.each(queue, function(taskId, task) {
                if (task) {
                    startTask(task);
                }
            });
        };
        /**
         * @description 暂停指定任务
         * @param {String} id 任务ID
         * @param {Function} callBack 回调
         */
        this.pause = function(id, callBack) {
            var task = queue[id];
            if (task) {
                task["pause"] = true;
                $.isFunction(callBack) ? task["callBack"] = callBack : "";
            }
        };
        /**
         * @description 暂停所有任务
         */
        this.pauseAll = function() {
            $.each(queue, function(taskId, task) {
                if (task) {
                    task["pause"] = true;
                }
            });
        };
        /**
         * @description 停止任务
         * @param {String} id 任务ID
         * @param {Function} callBack 任务停止后回调，可选
         */
        this.stop = function(id, callBack) {
            var task = queue[id];
            if (task) {
                task["stop"] = true;
                $.isFunction(callBack) ? task["callBack"] = callBack : "";
            }
        };
        /**
         * @description 关闭所有任务
         */
        this.stopAll = function() {
            $.each(queue, function(taskId, task) {
                if (task) {
                    task["stop"] = true;
                }
            });
        };
    };

    var Interval = function() {
    };

    /**
     * @description 延迟任务执行
     */
    var Delay = function() {
        // 日志前缀
        var logPrefix = "[Sweet.Task.Delay]: ";
        // 任务列表
        var queue = {};

        /**
         * @description 执行定时任务
         * @param {Object} task 任务
         */
        function executeTask(task) {
            var qTask = queue[task.id];
            if (!task || !qTask) {
                return;
            }
            var date = new Date();
            if ((date.getTime() >= qTask.time + task.delay) && !qTask.execute) {
                qTask.execute = true;
                stopTask(task.id);
                task.run.call(task.scope || task, task.args);
            }
            qTask.timeout = window.setTimeout(executeTask, 50, task);
        }

        /**
         * @description 启动任务
         * @param {Object} task 任务
         */
        function startTask(task) {
            var date = new Date();
            queue[task.id] = {};
            queue[task.id]["time"] = date.getTime();
            queue[task.id]["timeout"] = window.setTimeout(executeTask, 50, task);
            queue[task.id]["execute"] = false;
        }

        /**
         * @description 停止任务
         * @param {String} id 任务ID
         */
        var stopTask = function(id) {
            var task = queue[id];
            if (!task) {
                return;
            }

            var timeout = task["timeout"];
            if (timeout) {
                clearTimeout(timeout);
            }

            delete queue[id];
        };

        /**
         * @description 启动任务
         * @param {Object} task 任务，配置属性包括
         * {
         *      id: "",              // 任务ID
         *      run: Function,       // 定时调用执行的方法
         *      scope: Object,       // 作用域
         *      args: Arra,          // 传递给run的参数数组
         *      delay: Number        // 延迟执行时间
         * }
         */
        this.start = function(task) {
            var id = task.id,
                    t = queue[id];
            // task id不能为空
            if ($.isNull(id)) {
                $.error(logPrefix + "Task id can not be empty!");
                return;
            }

            // 校验任务是否存在，如果存在，更新时间
            if (t) {
                stopTask(id);
            }

            // 启动任务
            startTask(task);
        };

        /**
         * @description 取消任务
         * @param {String} id 任务ID
         */
        this.stop = function (id) {
            stopTask(id);
        };
    };

    /**
     * @description 定时任务对象，采用setTimeout实现，保证任务连续执行
     * @class
     * @example
     * 创建Timeout定时任务：
     */
    Sweet.Task.Timeout = new Timeout();

    /**
     * @description 定时任务对象，采用setInterval实现，保证任务间隔指定时间后执行
     * @class
     * @example
     * 创建Interval定时任务：
     */
    Sweet.Task.Interval = new Interval();

    /**
     * @description 延迟任务执行对象
     * @class
     * @example
     * 创建延迟执行任务：
     */
    Sweet.Task.Delay = new Delay();
})(jQuery);
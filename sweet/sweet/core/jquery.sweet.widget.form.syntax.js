/**
 * @fileOverview  
 * <pre>
 * form组件--语法高亮显示
 * 2013/3/1
 * <a href="www.huawei.com">http://www.huawei.com</a>
 * Huawei Technologies Co., Ltd. Copyright 1988-2012,  All rights reserved 
 * </pre>
 * @version 1.0
 */

(function ($, undefined) {
    'use strict';

    // 生成正则表达式
    function wordRegexp(words) {
        return new RegExp("^(?:" + words.join("|") + ")$", "i");
    }

    // SQL语法Token列表
    var functions = wordRegexp([
        "abs", "acos", "adddate", "aes_encrypt", "aes_decrypt", "ascii",
        "asin", "atan", "atan2", "avg", "benchmark", "bin", "bit_and",
        "bit_count", "bit_length", "bit_or", "cast", "ceil", "ceiling",
        "char_length", "character_length", "coalesce", "concat", "concat_ws",
        "connection_id", "conv", "convert", "cos", "cot", "count", "curdate",
        "current_date", "current_time", "current_timestamp", "current_user",
        "curtime", "database", "date_add", "date_format", "date_sub",
        "dayname", "dayofmonth", "dayofweek", "dayofyear", "decode", "degrees",
        "des_encrypt", "des_decrypt", "elt", "encode", "encrypt", "exp",
        "export_set", "extract", "field", "find_in_set", "floor", "format",
        "found_rows", "from_days", "from_unixtime", "get_lock", "greatest",
        "group_unique_users", "hex", "ifnull", "inet_aton", "inet_ntoa", "instr",
        "interval", "is_free_lock", "isnull", "last_insert_id", "lcase", "least",
        "left", "length", "ln", "load_file", "locate", "log", "log2", "log10",
        "lower", "lpad", "ltrim", "make_set", "master_pos_wait", "max", "md5",
        "mid", "min", "mod", "monthname", "now", "nullif", "oct", "octet_length",
        "ord", "password", "period_add", "period_diff", "pi", "position",
        "pow", "power", "quarter", "quote", "radians", "rand", "release_lock",
        "repeat", "reverse", "right", "round", "rpad", "rtrim", "sec_to_time",
        "session_user", "sha", "sha1", "sign", "sin", "soundex", "space", "sqrt",
        "std", "stddev", "strcmp", "subdate", "substring", "substring_index",
        "sum", "sysdate", "system_user", "tan", "time_format", "time_to_sec",
        "to_days", "trim", "ucase", "unique_users", "unix_timestamp", "upper",
        "user", "version", "week", "weekday", "yearweek"
    ]);

    var keywords = wordRegexp([
        "alter", "grant", "revoke", "primary", "key", "table", "start", "top",
        "transaction", "select", "update", "insert", "delete", "create", "describe",
        "from", "into", "values", "where", "join", "inner", "left", "natural", "and",
        "or", "in", "not", "xor", "like", "using", "on", "order", "group", "by",
        "asc", "desc", "limit", "offset", "union", "all", "as", "distinct", "set",
        "commit", "rollback", "replace", "view", "database", "separator", "if",
        "exists", "null", "truncate", "status", "show", "lock", "unique", "having",
        "drop", "procedure", "begin", "end", "delimiter", "call", "else", "leave",
        "declare", "temporary", "then"
    ]);

    var types = wordRegexp([
        "bigint", "binary", "bit", "blob", "bool", "char", "character", "date",
        "datetime", "dec", "decimal", "double", "enum", "float", "float4", "float8",
        "int", "int1", "int2", "int3", "int4", "int8", "integer", "long", "longblob",
        "longtext", "mediumblob", "mediumint", "mediumtext", "middleint", "nchar",
        "numeric", "real", "set", "smallint", "text", "time", "timestamp", "tinyblob",
        "tinyint", "tinytext", "varbinary", "varchar", "year"
    ]);

    var operators = wordRegexp([
        ":=", "<", "<=", "==", "<>", ">", ">=", "like", "rlike", "in", "xor", "between"
    ]);

    $.widget("sweet.widgetFormSyntax", $.sweet.widgetForm, /** @lends Sweet.form.Syntax.prototype*/{
        version: "1.0",
        sweetWidgetName: "[widget-form-syntax]",
        type: 'syntax',
        // 配置参数
        options: /** @lends Sweet.form.Syntax.prototype*/{
        },
        /**
         * @description 组件重绘
         * @private
         */
        _doLayout: function () {
            var me = this;

            // 没有渲染前，不处理
            if (!me.rendered) {
                return;
            }

            // 调用父类的_doLayout
            me._super();
        },
        /**
         * @private
         * @description 创建输入域
         */
        _createFormWidget: function () {
            var me = this,
                options = me.options,
                panelClass = "sweet-form-syntax",
                formTextArea = me.formElement = $("<textarea>").appendTo(me.formEl),
                value = $.nullToString(options.value);

            // 隐藏textArea
            formTextArea.css("position", "absolute").css("left", "-10000px");
            me.formEl.addClass(panelClass);

            // 设置值
            me.syntaxEl = $("<div>").appendTo(me.formEl);
            me.setValue(value);
        },
        /**
         * @description 设置内容
         * @param {String} value 文本内容
         */
        setValue: function (value) {
            this.value = value;
            this.formElement.val(value);

            var ret = this.parseSql(value),
                dom = this.buildDom(ret);
            this.syntaxEl.empty().append(dom.children());
        },
        /**
         * @private
         * @description 子类实现，置灰除输入框以外其他控件
         */
        __setDisabled: $.noop,
        /**
         * @description 绑定校验事件，子类继承实现
         * @private
         */
        _check: $.noop,
        /**
         * @description 对SQL代码进行词法分析
         * @param {String} source 待分析的Sql代码
         * @return {Array} 符号表
         */
        parseSql: function (source) {
            var operatorChars = /[*+\-<>=&|:\/]/,
                S_OK = 1, S_ERR = -1, S_END = 0,
                token = null,
                sLen = source.length,
                pos = 0,
                row = 0,
                col = 0,
                index = 0;

            var initToken = {
                index: 0,
                pos: pos,
                row: row,
                col: col,
                type: "",
                content: "",
                err: ""
            };

            // 是否回车符
            function isEnter (ch) {
                if (ch === "\n" || ch === "\r") {
                    return true;
                }
                else {
                    return false;
                }
            }

            // 取上一个字符，用于测试，不修改索引
            function peekPrev() {
                if (pos - 1 < sLen && pos - 1 >= 0) {
                    return source[pos - 1];
                }
                else {
                    return null;
                }
            }

            // 取当前字符，用于测试，不修改索引
            function peek() {
                if (pos < sLen) {
                    return source[pos];
                }
                else {
                    return null;
                }
            }

            // 取下一个字符，用于测试，不修改索引
            function peekNext() {
                if (pos + 1 < sLen) {
                    return source[pos + 1];
                }
                else {
                    return null;
                }
            }

            // 取当前字符，更新索引
            function get () {
                if (pos < sLen) {
                    return source[pos++];
                }
                else {
                    return null;
                }
            }

            // 取匹配re的内容
            function getWhileMatch(re) {
                var ch = null, ret = [];
                while ((ch = peek()) !== null && re.test(ch)) {
                    ret.push(get());
                }

                return ret.join("");
            }

            // 取字符，直到匹配re
            function getUntilMatch(re, singleLine) {
                var ch = null, ret = [];
                while (true) {
                    if (peek() === null) {
                        token.err = "Absent of end flag";
                        break;
                    }

                    // 判断是否允许换行，如果不允许则提示
                    if (singleLine === true && isEnter(ch)) {
                        token.err = "Token should be in a single line";
                    }

                    if (isEnter(ch)) {
                        row++;
                    }

                    ch = get();
                    ret.push(ch);
                    if (re.test(ch)) {
                        break;
                    }
                }

                return ret.join("");
            }

            // 空格和制表符
            function getBlank() {
                var ret = [], ch = peek();
                while (ch === " " || ch === "\t") {
                    ret.push(get());
                    ch = peek();
                }
                return ret.join("");
            }

            // 取到行尾
            function getEndOfLine() {
                var ret = [];

                while (!isEnter(peek()) && peek() !== null) {
                    ret.push(get());
                }

                return ret.join("");
            }

            // 取字符串
            function getLiteral() {
                var startCh = get(), ch = "", ret = [];

                // 字符串开始
                ret.push(startCh);

                // 直到下一个引号
                while (true) {
                    if (peek() === null) {
                        token.err = "Literal is not closed";
                        break;
                    }

                    ch = get();
                    ret.push(ch);

                    // 如果不是转义的引号，结束处理
                    if (ch === startCh && peekPrev() !== "\\") {
                        break;
                    }
                    else if (isEnter(ch)) {
                        row++;
                        token.err = "Unexpected return in literal";
                    }
                }

                return ret.join("");
            }

            // 取块注释
            function getBlockComment() {
                var ch = "", ret = [];

                while (true) {
                    if (peek() === null) {
                        token.err = "Block comment is not closed";
                        break;
                    }

                    ch = get();
                    ret.push(ch);

                    // 检查结束标志
                    if (ch === "*" && peek() === "/") {
                        ret.push(get());
                        break;
                    }

                    if (isEnter(ch)) {
                        row++;
                    }
                }

                return ret.join("");
            }

            // 取下一个完整的符号
            function getNextToken() {
                /* 关闭行数过多告警，不适合再拆分 */
                /* jshint maxstatements: 100 */

                // 分析结束
                if (pos >= sLen) {
                    return S_END;
                }

                // 初始化Token缓存，用于保存结果
                token = $.extend({}, initToken);
                token.index = index++;
                token.pos = pos;

                // 取当前待分析字符
                var ch = peek();

                // 换行
                if (isEnter(ch)) {
                    token.type = "sql-enter";
                    token.content = get();
                }
                else if (ch === " " || ch === "\t") {
                    token.type = "sql-blank";
                    token.content = getBlank();
                }
                else if (ch === "@" || ch === "$") {
                    token.type = "sql-ver";
                    token.content = get() + getWhileMatch(/[\w\d]/);
                }
                else if (ch === "#") {
                    token.type = "sql-comment";
                    token.content = getEndOfLine();
                }
                else if (ch === "," || ch === ";" || ch === ".") {
                    token.type = "sql-separator";
                    token.content = get();
                }
                else if (ch === "\"" || ch === "'" || ch === "`") {
                    token.type = "sql-literal";
                    token.content = getLiteral();
                }
                else if (ch === "[" || ch === "{") {
                    token.type = "sql-word";
                    token.content = getUntilMatch(/[\]\}]/);
                }
                else if (/\d/.test(ch)) {
                    token.type = "sql-number";
                    token.content = getWhileMatch(/\d/);

                    if (peek() === ".") {
                        token.content += get();
                        token.content += getWhileMatch(/\d/);
                    }
                }
                else if (ch === "-") {
                    if (peekNext() === "-") {
                        token.type = "sql-comment";
                        token.content = getEndOfLine();
                    }
                    else if (/\d/.test(peekNext())) {
                        // 负数
                        token.type = "sql-number";
                        token.content = get();
                        token.content += getWhileMatch(/\d/);

                        if (peek() === ".") {
                            token.content += get();
                            token.content += getWhileMatch(/\d/);
                        }
                    }
                    else {
                        token.type = "sql-operator";
                        token.content = get();
                    }
                }
                else if (operatorChars.test(ch)) {
                    if (ch === "/" && peekNext() === "*") {
                        token.type = "sql-comment";
                        token.content = getBlockComment();
                    }
                    else {
                        token.type = "sql-operator";
                        token.content = getWhileMatch(operatorChars);
                    }
                }
                else if (/[()]/.test(ch)) {
                    token.type = "sql-punctuation";
                    token.content = get();
                }
                else {
                    token.content = getWhileMatch(/[_\w\d\u4E00-\u9FA5\uf900-\ufa2d]/);

                    if (operators.test(token.content)) {
                        token.type = "sql-operator";
                    }
                    else if (keywords.test(token.content)) {
                        token.type = "sql-keyword";
                    }
                    else if (functions.test(token.content)) {
                        token.type = "sql-function";
                    }
                    else if (types.test(token.content)) {
                        token.type = "sql-type";
                    }
                    else {
                        token.type = "sql-word";
                    }
                }

                // 索引位置
                if (token.type === "sql-enter") {
                    row += 1;
                    col = 0;
                }
                else {
                    col += token.content.length;
                }

                return (token.err !== "" ? S_ERR : S_OK);
            }

            // 词法分析
            var loop = 0, tokenList = [];
            while (getNextToken() !== S_END) {
                tokenList.push(token);

                // 调试
                if ((loop++) > 10000) {
                    $.log("too many tokens");

                    // 打印最后10条记录
                    for (var j = tokenList.length - 10; j < tokenList.length; j++) {
                        $.log(tokenList[j]);
                    }
                    break;
                }
            }

            return tokenList;
        },

        /**
         * @description 把符号表用Dom标签表示
         * @param {Array} tokenList 符号表
         * @return {Object} 转换后的Dom对象
         */
        buildDom: function (tokenList) {
            var token = null, container = $("<div></div>"),
                dom = null, lines = [], lineEl = null, content = "";

            for (var i = 0; i < tokenList.length; i++) {
                token = tokenList[i];
                if (lineEl === null) {
                    lineEl = $("<pre></pre>");
                }

                if (token.type === "sql-enter") {
                    container.append(lineEl);
                    lineEl = null;
                }
                else {
                    lines = token.content.split("\n");

                    for (var j = 0; j < lines.length; j++) {
                        content = lines[j];
                        content = content.replace(/\t/gi, "  ");

                        // span标签
                        dom = $("<span></span>");

                        // 类名
                        dom.addClass(token.type);

                        // 提示信息
                        if (token.err !== "") {
                            dom.addClass("sql-error");
                            dom.attr("title", token.err);
                        }

                        // 内容
                        dom.text(content);
                        lineEl.append(dom);

                        // 补充换行
                        if (j < lines.length - 1) {
                            container.append(lineEl);
                            lineEl = $("<pre></pre>");
                        }
                    }
                }
            }

            if (lineEl !== null) {
                container.append(lineEl);
            }

            return container;
        }
    });

    /**
     * 语法高亮显示
     * @class
     * @extends Sweet.form
     * @requires <pre>
     * jquery.ui.core.js
     * jquery.ui.widget.js
     * jquery.sweet.widget.js
     * jquery.sweet.widget.form.js
     * </pre>
     * @example
     * <pre>
     * var sql = "-- SQL for test\n" +
     *     "SELECT SQL_NO_CACHE DISTINCT\n" +
     *     "       @var1 AS `val1`, @'val2', @global.'sql_mode',\n" +
     *     "       1.1 AS `float_val`, .14 AS `another_float`, 0.09e3 AS `int_with_esp`,\n" +
     *     "       0xFA5 AS `hex`, x'fa5' AS `hex2`, 0b101 AS `bin`, b'101' AS `bin2`,\n" +
     *     "       DATE '1994-01-01' AS `sql_date`, { T \"1994-01-01\" } AS `odbc_date`,\n" +
     *     "       'myString', UNKNOWN\n" +
     *     "   FROM DUALa\n" +
     *     "   -- space needed after '--'\n" +
     *     "   # 1 line comment\n" +
     *     "   \/* multiline\n" +
     *     "   comment! *\/\n" +
     *     "   LIMIT 1 OFFSET 0;\n";
     * var editor = new Sweet.form.Syntax({
     *     renderTo: "coding",
     *     width: 600,
     *     height: 300,
     *     value: sql
     * });
     * </pre>
     */
    Sweet.form.Syntax = $.sweet.widgetFormSyntax;

}(jQuery));

/**
 * @author zhangdaiping@vip.qq.com
 * @version 1.3.2 (6/4/2010)
 */
if (Ext.ux.tree.TreeGridEditor) {
    Ext.apply(Ext.ux.tree.TreeGridEditor.prototype, {
        maxDepthText: '最大节点深度',
        obarHeaderText: '操作',
        obarBtnText: {
            add: '新增下级',
            edit: '修改',
            remove: '删除',
            save: '保存',
            cancel: '取消'
        },
        singleEditPrompt: '保存修改',
        singleEditMsg: '是否保存您修改过的内容？'
    });
}

if (Ext.form.Field) {
    Ext.form.Field.prototype.invalidText = "输入值非法";
}

if (Ext.LoadMask) {
    Ext.LoadMask.prototype.msg = "读取中...";
}

Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

Date.dayNames = ["日", "一", "二", "三", "四", "五", "六"];

Date.formatCodes.a = "(this.getHours() < 12 ? '上午' : '下午')";
Date.formatCodes.A = "(this.getHours() < 12 ? '上午' : '下午')";

if (Ext.MessageBox) {
    Ext.MessageBox.buttonText = {
        ok: "确定",
        cancel: "取消",
        yes: "是",
        no: "否"
    };
}

if (Ext.util.Format) {
    Ext.util.Format.date = function(v, format) {
        if (!v) return "";
        if (!(v instanceof Date)) v = new Date(Date.parse(v));
        return v.dateFormat(format || "y年m月d日");
    };
}

if (Ext.DatePicker) {
    Ext.apply(Ext.DatePicker.prototype, {
        todayText: "今天",
        minText: "日期必须大于最小允许日期",//update
        maxText: "日期必须小于最大允许日期",//update
        disabledDaysText: "",
        disabledDatesText: "",
        monthNames: Date.monthNames,
        dayNames: Date.dayNames,
        nextText: '下个月 (Ctrl+Right)',
        prevText: '上个月 (Ctrl+Left)',
        monthYearText: '选择一个月 (Control+Up/Down 来改变年份)',//update
        todayTip: "{0} (空格键选择)",
        format: "y年m月d日",
        okText: "确定",
        cancelText: "取消"
    });
}

if (Ext.form.TextField) {
    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText: "该输入项的最小长度是 {0} 个字符",
        maxLengthText: "该输入项的最大长度是 {0} 个字符",
        blankText: "该输入项为必输项",
        regexText: "",
        emptyText: null
    });
}

if (Ext.form.DateField) {
    Ext.apply(Ext.form.DateField.prototype, {
        disabledDaysText: "禁用",
        disabledDatesText: "禁用",
        minText: "该输入项的日期必须在 {0} 之后",
        maxText: "该输入项的日期必须在 {0} 之前",
        invalidText: "{0} 是无效的日期 - 必须符合格式： {1}",
        format: "y年m月d日"
    });
}

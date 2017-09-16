Ext.form.MultiComboBox = Ext.extend(Ext.form.TriggerField, {
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},
    listClass: '',
    selectedClass: 'x-combo-selected',
    triggerClass : 'x-form-arrow-trigger',
    shadow:'sides',
    listAlign: 'tl-bl?',
    maxHeight: 180,
    triggerAction: 'query',
    minChars : 4,
    typeAhead: false,
    queryDelay: 500,
    pageSize: 0,
    selectOnFocus:false,
    queryParam: 'query',
    loadingText: 'Loading...',
    resizable: false,
    handleHeight : 8,
    editable: true,
    allQuery: '',
    mode: 'remote',
    minListWidth : 70,
    forceSelection:false,
    typeAheadDelay : 250,
    displaySeparator:';',
    valueSeparator:',',
    lazyInit : true,

    initComponent : function()
    {
        Ext.form.ComboBox.superclass.initComponent.call(this);
        this.addEvents('expand', 'collapse', 'beforeselect', 'select', 'beforequery');
        if (this.transform)
        {
            this.allowDomMove = false;
            var s = Ext.getDom(this.transform);
            if (!this.hiddenName)
            {
                this.hiddenName = s.name;
            }
            if (!this.store)
            {
                this.mode = 'local';
                var d = [
                ], opts = s.options;
                for (var i = 0, len = opts.length; i < len; i++)
                {
                    var o = opts[i];
                    var value = (Ext.isIE ? o.getAttributeNode('value').specified : o.hasAttribute('value')) ? o.value :
                            o.text;
                    if (o.selected)
                    {
                        this.value = value;
                    }
                    d.push([
                        value, o.text
                    ]);
                }
                this.store = new Ext.data.SimpleStore({
                    'id': 0,
                    fields: [
                        'value', 'text'
                    ],
                    data : d
                });
                this.valueField = 'value';
                this.displayField = 'text';
            }
            s.name = Ext.id(); // wipe out the name in case somewhere else they have a reference
            if (!this.lazyRender)
            {
                this.target = true;
                this.el = Ext.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
                Ext.removeNode(s); // remove it
                this.render(this.el.parentNode);
            }
            else
            {
                Ext.removeNode(s); // remove it
            }

        }
        this.selectedIndex = -1;
        if (this.mode == 'local')
        {
            if (this.initialConfig.queryDelay === undefined)
            {
                this.queryDelay = 10;
            }
            if (this.initialConfig.minChars === undefined)
            {
                this.minChars = 0;
            }
        }
    },

    // private
    onRender : function(ct, position)
    {
        Ext.form.ComboBox.superclass.onRender.call(this, ct, position);
        var disValue = "";
        if (this.hiddenName)
        {
            this.hiddenField =
                    this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id: (this.hiddenId || this
                            .hiddenName)}, 'before', true);
            var hvalue = this.hiddenValue !== undefined ? this.hiddenValue : this.value !== undefined ? this.value : '';
            var hvalueArray = hvalue.split(this.valueSeparator);

            for (var i = 0; i < this.store.data.length; i++)
            {
                var r = this.store.getAt(i);
                var newValue = r.data[this.displayField];
                var v = r.data[this.valueField];
                for (var j = 0; j < hvalueArray.length; j++)
                {
                    if (hvalueArray[j] == v)
                    {
                        disValue += newValue + this.displaySeparator;
                    }
                }

            }
            this.hiddenField.value =
                    this.hiddenValue !== undefined ? this.hiddenValue : this.value !== undefined ? this.value : '';
            this.el.dom.removeAttribute('name');
        }
        if (Ext.isGecko)
        {
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        if (!this.lazyInit)
        {
            this.initList();
        }
        else
        {
            this.on('focus', this.initList, this, {single: true});
        }

        if (!this.editable)
        {
            this.editable = true;
            this.setEditable(false);
        }
        this.setValue(disValue);
    },

    initList : function()
    {
        if (!this.list)
        {
            var cls = 'x-combo-list';

            this.list = new Ext.Layer({
                shadow: this.shadow, cls: [
                    cls, this.listClass
                ].join(' '), constrain:false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;

            if (this.title)
            {
                this.header = this.list.createChild({cls:cls + '-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls + '-inner'});
            this.innerList.on('mouseover', this.onViewOver, this);
            this.innerList.on('mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if (this.pageSize)
            {
                this.footer = this.list.createChild({cls:cls + '-ft'});
                this.pageTb = new Ext.PagingToolbar({
                    store:this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            if (!this.tpl)
            {
                //alert(cls);
                //x-combo-list-item
            	this.tpl = '<tpl for="."><div class="' + cls + '-item" ext:qtip="{' + this.displayField
                        + '}"><span class="checked" id="checkBox_' + this.id + '{' + this.valueField
                        + '}"+ width="20">&nbsp;&nbsp;&nbsp;&nbsp;</span>{' + this.displayField + '}</div></tpl>';
            }
            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item'
            });

            this.view.on('click', this.onViewClick, this);

            this.bindStore(this.store, true);

            if (this.resizable)
            {
                this.resizer = new Ext.Resizable(this.list, {
                    pinned:true, handles:'se'
                });
                this.resizer.on('resize', function(r, w, h)
                {
                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
            }
        }
    },

    bindStore : function(store, initial)
    {
        if (this.store && !initial)
        {
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.collapse, this);
            if (!store)
            {
                this.store = null;
                if (this.view)
                {
                    this.view.setStore(null);
                }
            }
        }
        if (store)
        {
            this.store = Ext.StoreMgr.lookup(store);

            this.store.on('beforeload', this.onBeforeLoad, this);
            this.store.on('load', this.onLoad, this);
            this.store.on('loadexception', this.collapse, this);

            if (this.view)
            {
                this.view.setStore(store);
            }
        }
    },

    // private
    initEvents : function()
    {
        Ext.form.ComboBox.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {
            "up" : function(e)
            {
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e)
            {
                if (!this.isExpanded())
                {
                    this.onTriggerClick();
                }
                else
                {
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e)
            {
                this.onViewClick();
                //return true;
            },

            "esc" : function(e)
            {
                this.collapse();
            },

            "tab" : function(e)
            {
                this.onViewClick(false);
                return true;
            },

            scope : this,

            doRelay : function(foo, bar, hname)
            {
                if (hname == 'down' || this.scope.isExpanded())
                {
                    return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },

            forceKeyDown : true
        });
        this.queryDelay = Math.max(this.queryDelay || 10, this.mode == 'local' ? 10 : 250);
        this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
        if (this.typeAhead)
        {
            this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
        }
        if (this.editable !== false)
        {
            this.el.on("keyup", this.onKeyUp, this);
        }
        if (this.forceSelection)
        {
            this.on('blur', this.doForce, this);
        }
    },

    onDestroy : function()
    {
        if (this.view)
        {
            this.view.el.removeAllListeners();
            this.view.el.remove();
            this.view.purgeListeners();
        }
        if (this.list)
        {
            this.list.destroy();
        }
        this.bindStore(null);
        Ext.form.ComboBox.superclass.onDestroy.call(this);
    },

    // private
    fireKey : function(e)
    {
        if (e.isNavKeyPress() && !this.list.isVisible())
        {
            this.fireEvent("specialkey", this, e);
        }
    },

    // private
    onResize: function(w, h)
    {
        Ext.form.ComboBox.superclass.onResize.apply(this, arguments);
        if (this.list && this.listWidth === undefined)
        {
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },

    // private
    onDisable: function()
    {
        Ext.form.ComboBox.superclass.onDisable.apply(this, arguments);
        if (this.hiddenField)
        {
            this.hiddenField.disabled = this.disabled;
        }
    },
    setEditable : function(value)
    {
        if (value == this.editable)
        {
            return;
        }
        this.editable = value;
        if (!value)
        {
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick, this);
            this.el.addClass('x-combo-noedit');
        }
        else
        {
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick, this);
            this.el.removeClass('x-combo-noedit');
        }
    },

    // private
    onBeforeLoad : function()
    {
        if (!this.hasFocus)
        {
            return;
        }
        this.innerList.update(this.loadingText ? '<div class="loading-indicator">' + this.loadingText + '</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

    // private
    onLoad : function()
    {
        if (!this.hasFocus)
        {
            return;
        }
        if (this.store.getCount() > 0)
        {
            this.expand();
            this.restrictHeight();
            if (this.lastQuery == this.allQuery)
            {
                if (this.editable)
                {
                    this.el.dom.select();
                }
                if (!this.selectByValue(this.value, true))
                {
                    this.select(0, true);
                }
            }
            else
            {
                this.selectNext();
                if (this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject
                        .DELETE)
                {
                    this.taTask.delay(this.typeAheadDelay);
                }
            }
        }
        else
        {
            this.onEmptyResults();
        }
    },

    // private
    onTypeAhead : function()
    {
        if (this.store.getCount() > 0)
        {
            var r = this.store.getAt(0);
            var newValue = r.data[this.displayField];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if (selStart != len)
            {
                this.setRawValue(newValue);
                this.selectText(selStart, newValue.length);
            }
        }
    },
    // private
    onSelect : function(record, index)
    {
        /*
         * 增加一个全选功能
         */
        if (index == 0)
        {
            var r_qx = this.store.getAt(index);
            var newValue_qx = r_qx.data[this.valueField];
            var check_qx = document.getElementById("checkBox_" + this.id + newValue_qx);
            if (check_qx.className == "checked")
            {
                check_qx.className = "unchecked";
            }
            else
            {
                check_qx.className = "checked";
            }
            for (var i = 1; i < this.store.data.length; i++)
            {
                var r = this.store.getAt(i);
                var newValue = r.data[this.valueField];
                var check = document.getElementById("checkBox_" + this.id + newValue);
                if (check_qx.className == "checked")
                {
                    check.className = "checked";
                }
                else
                {
                    check.className = "unchecked";
                }
            }
            var value = "";
            var hiddenValue = "";
            var r = this.store.getAt(0);
            newValue = r.data[this.valueField];
            check = document.getElementById("checkBox_" + this.id + newValue);
            if (check.className == "checked")
            {
                value += r.data[this.displayField] + this.displaySeparator;
                hiddenValue += r.data[this.valueField] + this.valueSeparator;
            }
            if (value.length > 1)
            {
                value = value.substring(0, value.length - this.displaySeparator.length);
            }
            if (hiddenValue.length > 1)
            {
                hiddenValue = hiddenValue.substring(0, value.length - this.valueSeparator.length);
            }
            this.setValue(value);
            this.hiddenField.value = hiddenValue;
            this.fireEvent('select', this, record, index);
            return;
        }
        //全选结束


        if (this.fireEvent('beforeselect', this, record, index) !== false)
        {
            var r = this.store.getAt(index);
            var newValue = r.data[this.valueField];
            var check = document.getElementById("checkBox_" + this.id + newValue);
            if (check.className == "checked")
            {
                check.className = "unchecked";
            }
            else
            {
                check.className = "checked";
            }
            var value = "";
            var hiddenValue = "";
            for (var i = 0; i < this.store.data.length; i++)
            {
                var r = this.store.getAt(i);
                newValue = r.data[this.valueField];
                check = document.getElementById("checkBox_" + this.id + newValue);
                if (check.className == "checked")
                {
                    value += r.data[this.displayField] + this.displaySeparator;
                    hiddenValue += r.data[this.valueField] + this.valueSeparator;
                }
            }
            if (value.length > 1)
            {
                value = value.substring(0, value.length - this.displaySeparator.length);
            }
            if (hiddenValue.length > 1)
            {
                hiddenValue = hiddenValue.substring(0, value.length - this.valueSeparator.length);
            }
            this.setValue(value);
            this.hiddenField.value = hiddenValue;
            this.fireEvent('select', this, record, index);
        }
        
        /**
         * 全选功能
         * 当取消一个选择时，应该取消相应全选 
         * 当选择了全部后，全选应该被选择
         */
        if (index != 0)
        {
        	var check_flag = "checked";
        	
            for (var i = 1; i < this.store.data.length; i++)
            {
            	var r = this.store.getAt(i);
            	var newValue = r.data[this.valueField];
            	var check = document.getElementById("checkBox_" + this.id + newValue);
            	if (check.className != "checked")
            	{
            		check_flag = "unchecked";
            	}
            }
            //取消全选
            var r_qx = this.store.getAt(0);
            var newValue_qx = r_qx.data[this.valueField];
            var check_qx = document.getElementById("checkBox_" + this.id + newValue_qx);
            
            check_qx.className = check_flag;
            
            var value = "";
            var hiddenValue = "";
            if (check_qx.className == "checked")
        	{
            	value = r_qx.data[this.displayField];
            	hiddenValue = r_qx.data[this.valueField];
        	}
            else
        	{
            	for (var i = 1; i < this.store.data.length; i++)
                {
                    var r = this.store.getAt(i);
                    newValue = r.data[this.valueField];
                    check = document.getElementById("checkBox_" + this.id + newValue);
                    if (check.className == "checked")
                    {
                        value += r.data[this.displayField] + this.displaySeparator;
                        hiddenValue += r.data[this.valueField] + this.valueSeparator;
                    }
                }
            	if (value.length > 1)
                {
                    value = value.substring(0, value.length - this.displaySeparator.length);
                }
                if (hiddenValue.length > 1)
                {
                    hiddenValue = hiddenValue.substring(0, value.length - this.valueSeparator.length);
                }
        	}
            
            this.setValue(value);
            this.hiddenField.value = hiddenValue;
            this.fireEvent('select', this, record, index);
            return;
         }
    },
    getValue : function()
    {
        if (this.valueField)
        {
            return typeof this.value != 'undefined' ? this.value : '';
        }
        else
        {
            return Ext.form.ComboBox.superclass.getValue.call(this);
        }
    },

    /**
     * Clears any text/value currently set in the field
     */
    clearValue : function()
    {
        if (this.hiddenField)
        {
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
    },

    /**
     *  为了彻底清空下拉多选框所添加的一个清空方法
     *
     * 提出此方法的原因：clearValue方法只是清空了值，但是并未对已经装载并且选择的store对象进行清空，
     * 在这个方法首先进行store的清空，然后对数值进行清空
     */
    clearValueForStore : function()
    {
        for (var i = 0; i < this.store.data.length; i++)
        {
            var r = this.store.getAt(i);
            var newValue = r.data[this.valueField];
            var v = r.data[this.valueField];
            if (undefined != document.getElementById("checkBox_" + this.id + newValue))
            {
                document.getElementById("checkBox_" + this.id + newValue).className = "unchecked";
            }
        }

        if (this.hiddenField)
        {
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
    },
    /************** 为了彻底清空下拉多选框所添加的一个清空方法 End*********************/
    setValue : function(v)
    {
        var text = v;
        if (this.valueField)
        {
            var r = this.findRecord(this.valueField, v);
            if (r)
            {
                text = r.data[this.displayField];
            } else if (this.valueNotFoundText !== undefined)
            {
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    },
    /*----- 处理下拉多选框赋值操作，批量选中编写的扩展方法 start-----*/
    setValues_array : function(v,Separator)
    {
        var text = "";
        this.initList();
        this.clearValueForStore();
        var vv = null != v ? v.split(Separator) : "";
        var count = 0;
        if (this.store.getCount() - 1 <= vv)
    	{
        	
    	}
        for (var i = 0; i < vv.length; i++)
        {
        	
            if (this.valueField)
            {
                var r = this.findRecord(this.valueField, vv[i]);
                if (r)
                {
                    var check = document.getElementById("checkBox_" + this.id + r.data[this.valueField]);
                    
                    if (null != check && check != undefined && check != "")
                    {
                    	count = count+1;
                        if (text == "")
                        {
                            text += r.data[this.displayField];
                        }
                        else
                        {
                            text += this.displaySeparator + r.data[this.displayField];
                        }

                        if (check.className == "checked")
                        {
                            check.className = "checked";
                        }
                        else
                        {
                            check.className = "checked";
                        }
                    }
                } 
                else if (this.valueNotFoundText !== undefined)
                {
                    if (text == "")
                    {
                        text += this.valueNotFoundText;
                    }
                    else
                    {
                        text += this.displaySeparator + this.valueNotFoundText;
                    }
                }
            }
        }
        if (count == this.store.getCount() -1)
    	{
        	var r = this.store.getAt(0);
        	var check = document.getElementById("checkBox_" + this.id + r.data[this.valueField]);
        	check.className = "checked";
        	text = r.data[this.displayField];
    	}
        this.lastSelectionText = text;
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = text;
    },
    /*----- 处理下拉多选框赋值操作，批量选中编写的扩展方法 end-----*/

    // private
    findRecord : function(prop, value)
    {
        var record;
        if (this.store.getCount() > 0)
        {
            this.store.each(function(r)
            {
                if (r.data[prop] == value)
                {
                    record = r;
                    return false;
                }
            });
        }
        return record;
    },

    // private
    onViewMove : function(e, t)
    {
        this.inKeyMode = false;
    },

    // private
    onViewOver : function(e, t)
    {
        if (this.inKeyMode)
        { // prevent key nav and mouse over conflicts
            return;
        }
        var item = this.view.findItemFromChild(t);
        if (item)
        {
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },

    // private
    onViewClick : function(doFocus)
    {
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if (r)
        {
            this.onSelect(r, index);
        }
        if (doFocus !== false)
        {
            this.el.focus();
        }
    },

    // private
    restrictHeight : function()
    {
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var fw = this.list.getFrameWidth('tb');
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        this.innerList.setHeight(h < this.maxHeight ? 'auto' : this.maxHeight);
        this.list.beginUpdate();
        this.list.setHeight(this.innerList.getHeight() + fw + (this.resizable ? this.handleHeight : 0) + this
                .assetHeight);
        this.list.alignTo(this.el, this.listAlign);
        this.list.endUpdate();
    },

    // private
    onEmptyResults : function()
    {
        this.collapse();
    },

    /**
     * Returns true if the dropdown list is expanded, else false.
     */
    isExpanded : function()
    {
        return this.list && this.list.isVisible();
    },
    selectByValue : function(v, scrollIntoView)
    {
        if (v !== undefined && v !== null)
        {
            var r = this.findRecord(this.valueField || this.displayField, v);
            if (r)
            {
                this.select(this.store.indexOf(r), scrollIntoView);
                return true;
            }
        }
        return false;
    },
    select : function(index, scrollIntoView)
    {

        this.selectedIndex = index;
        this.view.select(index);
        if (scrollIntoView !== false)
        {
            var el = this.view.getNode(index);
            if (el)
            {
                this.innerList.scrollChildIntoView(el, false);
            }
        }
    },

    // private
    selectNext : function()
    {
        var ct = this.store.getCount();
        if (ct > 0)
        {
            if (this.selectedIndex == -1)
            {
                this.select(0);
            } else if (this.selectedIndex < ct - 1)
            {
                this.select(this.selectedIndex + 1);
            }
        }
    },

    // private
    selectPrev : function()
    {
        var ct = this.store.getCount();
        if (ct > 0)
        {
            if (this.selectedIndex == -1)
            {
                this.select(0);
            } else if (this.selectedIndex != 0)
            {
                this.select(this.selectedIndex - 1);
            }
        }
    },

    // private
    onKeyUp : function(e)
    {
        if (this.editable !== false && !e.isSpecialKey())
        {
            this.lastKey = e.getKey();
            this.dqTask.delay(this.queryDelay);
        }
    },

    // private
    validateBlur : function()
    {
        return !this.list || !this.list.isVisible();
    },

    // private
    initQuery : function()
    {
        this.doQuery(this.getRawValue());
    },

    // private
    doForce : function()
    {
        if (this.el.dom.value.length > 0)
        {
            this.el.dom.value = this.lastSelectionText === undefined ? '' : this.lastSelectionText;
            this.applyEmptyText();
        }
    },
    doQuery : function(q, forceAll)
    {
        if (q === undefined || q === null)
        {
            q = '';
        }
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if (this.fireEvent('beforequery', qe) === false || qe.cancel)
        {
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if (forceAll === true || (q.length >= this.minChars))
        {
            if (this.lastQuery !== q)
            {
                this.lastQuery = q;
                if (this.mode == 'local')
                {
                    this.selectedIndex = -1;
                    if (forceAll)
                    {
                        this.store.clearFilter();
                    }
                    else
                    {
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }
                else
                {
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }
            else
            {
                this.selectedIndex = -1;
                this.onLoad();
            }
        }
    },

    // private
    getParams : function(q)
    {
        var p = {};
        //p[this.queryParam] = q;
        if (this.pageSize)
        {
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },
    /**
     * Hides the dropdown list if it is currently expanded. Fires the 'collapse' event on completion.
     */
    collapse : function()
    {
        if (!this.isExpanded())
        {
            return;
        }
        this.list.hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },
    // private
    collapseIf : function(e)
    {
        if (!e.within(this.wrap) && !e.within(this.list))
        {
            this.collapse();
        }
    },

    /**
     * Expands the dropdown list if it is currently hidden. Fires the 'expand' event on completion.
     */
    expand : function()
    {
        if (this.isExpanded() || !this.hasFocus)
        {
            return;
        }
        this.list.alignTo(this.wrap, this.listAlign);
        var hvalueArray = this.hiddenField.value.split(this.valueSeparator);
        for (var i = 0; i < this.store.data.length; i++)
        {
            var r = this.store.getAt(i);
            var newValue = r.data[this.valueField];
            var v = r.data[this.valueField];
            for (var j = 0; j < hvalueArray.length; j++)
            {
                if (hvalueArray[j] == v)
                {
                    document.getElementById("checkBox_" + this.id + newValue).className = "checked";
                }
            }

        }
        this.list.show();
        Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

    // private
    // Implements the default empty TriggerField.onTriggerClick function
    onTriggerClick : function()
    {
        if (this.disabled)
        {
            return;
        }
        if (this.isExpanded())
        {
            this.collapse();
            this.el.focus();
        }
        else
        {
            this.onFocus({});
            if (this.triggerAction == 'all')
            {
                this.doQuery(this.allQuery, true);
            }
            else
            {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    },
    /*----- 处理下拉多选框取值操作，批量取值编写的扩展方法 Start-----*/
    getValues : function()
    {
    	var r_qx = this.store.getAt(0);
    	if(typeof(r_qx) == "undefined")
    	{
    		return '';
    	}
        var newValue_qx = r_qx.data[this.displayField];
        var dValue = this.getValue().split(this.displaySeparator);
        var vValue ='';
        if (newValue_qx == dValue[0])
        {
            for (var i = 1; i < this.store.data.length; i++)
	        {
            	var r = this.store.getAt(i);
            	vValue += r.data[this.valueField] + this.valueSeparator;
	        }
        }
        else 
        {
	        if (!dValue || dValue.length == 0)
	        {
	            return '';
	        }
	        for (var i = 0; i < dValue.length; i++)
	        {
	            if (undefined != dValue[i] && "" != dValue)
	            {
	                var index = this.store.findExact(this.displayField, dValue[i]);
	                if (index > -1)
	                {
	                    vValue += this.store.getAt(index).get(this.valueField) + this.valueSeparator;
	                }
	            }
	        }
	     }
        return vValue.length > 0 ? vValue.substr(0, vValue.length - 1) : vValue;
    }
    /*----- 处理下拉多选框取值操作，批量取值编写的扩展方法 end-----*/
});
Ext.reg('multicombo', Ext.form.MultiComboBox);
/**
 * 事件绑定
 */
var mydata;
var colorTipArr = [0, 0, 0, 0]; //缓存重点场景输入框
var settingData = null;



function gbEventBind() {

	$(".setting_main").off();
	$('.setting_main').on("click", ".set_header> ul li", function() {
		$(this).addClass("list");
		$(this).siblings('li').removeClass("list");
		var index = $(this).index();
		$(".article").find(".common").eq(index).show().siblings().hide();
	});
	$(".setting_main").on("click", ".leftboxs span", function() {
		if (!$(this).hasClass("list1")) {
			$(this).addClass("list1");
			var str = $(this).attr("data-set");
			var role = $(this).attr("data-id");
		} else {
			$(this).removeClass("list1");
		}
		var dom = $(this).parents(".same");
		var num = dom.find(".list1").length;
		if (num < 4) {
			$(".tanchu").show();
		} else if (num == 4) {
			$(".tanchu").hide();
		} else if (num > 4) {
			$(this).removeClass("list1");
			$(".tanchu").show();
		}
		OutDl(dom);
	});
	$(".setting_main").on("click", ".b_right span", function() {
		if ($(this).hasClass("color") && !($(this).attr('data-fix') === 'true')) {
			$(this).removeClass("color");
		} else {
			$(this).addClass("color");
		}
	});
	$('.setting_main').on("click", ".common_center >ul li", function() {
		$(this).addClass("list");
		$(this).siblings('li').removeClass("list");
		var index = $(this).index();
		$(".setting_main").find(".same").eq(index).show().siblings(".same").hide();
	});
	$(".setting_main").on("mousedown", '.add_cjpicones', function() {
		$(this).siblings(".ul_scroll").stop(true, true).slideToggle();
		$(this).siblings(".ul_scroll").children(".ul_div_scroll").scroll_absolute({
			arrows: false
		});
		if ($(this).siblings("ul").children().length > 5) {
			$(this).find(".ul_scroll .ul_div_scroll .my_ul").scroll_absolute({
				arrows: false
			});
			$(this).siblings("ul").addClass("add_scroll");
		} else {
			$(this).find(".ul_scroll").addClass("lessfive")
		}
	});
	$(".setting_main").on('blur', '.colorTip input', function() {
		if ($(this).val() < 1) {
			colorTipArr[$(this).index() - 1] = 1;
		} else if (+$(this).val() <= +$(this).prev().val() || +$(this).val() >= +$(this).next().val()) {
			colorTipArr[$(this).index() - 1] = 2;
		} else {
			colorTipArr[$(this).index() - 1] = 0;
		}
		if (/1/.test(colorTipArr.join(''))) {
			$('.dy').show();
			$('.xy').hide();
		} else if (/2/.test(colorTipArr.join(''))) {
			$('.xy').show();
			$('.dy').hide();
		} else {
			$('.dy').hide();
			$('.xy').hide();
		}
	});
	$(".setting_main").on('click', 'input[type=button]', function() {
		if ($('input[type=button].active').length < 10) {
			$('.zb').show();
		} else {
			$('.zb').hide();
		}
	});
	$(".setting_main").on("mouseenter", ".setting_cjcls>li", function() {
		$(this).addClass("every");
	});
	$(".setting_main").on("mouseleave", ".setting_cjcls>li", function() {
		$(this).removeClass("every");
	});
	$(".setting_main").on("click", ".setting_cjcls>li", function(e) {
		var a = e.target.dataset.mes;
		$(this).parents('.ul_scroll').siblings(".add_cjname").text($(this).text());
		$(this).parents(".ul_scroll").hide();
		cjcode = $(this).index() + 1;
		$(this).parents('.add_cjbox1').siblings(".top_div1").children(`.${a}`).show().addClass('active').siblings().hide().removeClass('active');
	});
	$(".setting_main").on('blur', '.top_right input', function() {
		var index = $(this).index();
		if ($(this).val() < 1) {
			colorTipArr[$(this).index() - 1] = 1;
		} else if (+$(this).val() <= +$(this).prev().val() || +$(this).val() >= +$(this).next().val()) {
			colorTipArr[$(this).index() - 1] = 2;
		} else {
			colorTipArr[$(this).index() - 1] = 0;
		}
		var pattern = /^[0-9]*$/;
		if (!pattern.test($(this).val())) {
			$('.sz').show();
			$('.xy').hide();
			$('.dy').hide();
			$(this).val("");
		} else if (/1/.test(colorTipArr.join(''))) {
			$('.dy').show();
			$('.xy').hide();
			$('.sz').hide();
		} else if (/2/.test(colorTipArr.join(''))) {
			$('.xy').show();
			$('.dy').hide();
			$('.sz').hide();
		} else {
			$('.dy').show();
			$('.xy').hide();
			$('.sz').hide();
		}
	});
	$(".setting_main").on('click', '.leBut', function() {
		$('.setting_main').removeClass('show');
	});
	//重点场景kqi点击事件绑定
	$(".setting_main").on('click', '.zbOption input', function() {
			if ($('.zbOption input.active').length >= 2 && !$(this).hasClass('active')) {
				return;
			} else if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		})
		//重点场景kqi提示事件绑定
	$(".setting_main").on('click', '.zbOption input', function() {
		if ($('.zbOption input.active').length < 2) {
			$('.ts').show();
		} else {
			$('.ts').hide();
		}
	});
	//重点网元kqi点击事件绑定
	$(".setting_main").on('click', '.wy_set_main > div input', function() {
			if ($(this).parent().find('input.active').length >= 2 && !$(this).hasClass('active')) {
				return;
			} else if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		})
		//重点网元kqi提示事件绑定
	$(".setting_main").on('click', '.wy_set_main > div input', function() {
		if ($('.wy_set_main > div input.active').length < 10) {
			$('.zb').show();
		} else {
			$('.zb').hide();
		}
	});
	$(".setting_main").on('click', '.riBut', function() {
		//		配置提交
		//		全局三重点数据绑定
		$('.setting_main .add_cjname').each(function(i, v) {
			var temp;
			switch (i) {
				case 0:
					temp = settingData.allNet.thirdKeyKqi.scene;
					break;
				case 1:
					temp = settingData.allNet.thirdKeyKqi.netMeta;
					break;
				case 2:
					temp = settingData.allNet.thirdKeyKqi.sp;
					break;
				default:
					break;
			}
			var dom_this = this;
			temp.forEach(function(value, index) {
				value.show = false;
				if (value.describle == $(dom_this).text()) {
					var threshold_arr = [];
					$(dom_this).parents('.add_cjbox').next().find('.active input').each(function(_i, _v) {
						threshold_arr.push(+$(_v).val());
					});
					value.show = true;
					value.threshold = threshold_arr;
				}
			});
		});
		//全局kqi数据绑定
		$('.bottom_box').each(function(i, v) {
			var temp;
			switch (i) {
				case 0:
					temp = settingData.allNet.kqi.allNet;
					break;
				case 1:
					temp = settingData.allNet.kqi['3G'];
					break;
				case 2:
					temp = settingData.allNet.kqi['4G'];
					break;
				default:
					break;
			}
			var dom_this = this;
			$(dom_this).find('dl').each(function(ii, vv) {
				var _this = this;
				temp[$(vv).attr('data-type')].forEach(function(value, index) {
					if (value.describle == $(_this).find('.leftbottom_box span').text()) {
						var _arr = [];
						$(_this).find('.top_right_box input').each(function(_i, _v) {
							_arr.push($(_v).val());
							value.threshold = _arr;
						})
					}
				})
			})
		});
		//舆情数据绑定
		$('textarea').each(function(i, v) {
			settingData.allNet.opinion[i] = $(v).val();
		});
		//告警列表数据绑定
		settingData.allNet.alarm.length = 0;
		$('.b_right span').each(function(i, v) {
			var temp = JSON.parse($(this).attr('data-str'));
			temp.describle = $(this).text();
			temp.show = $(this).hasClass('color');
			settingData.allNet.alarm.push(temp);
		});
		//重点场景影响用户数绑定
		$('.colorTip input').each(function(i, v) {
			settingData.scene.threshold[i] = +$(v).val();
		});
		//小区关键kqi指标绑定
		settingData.scene.kqi.length = 0;
		$('.zbOption input').each(function(i, v) {
			if ($(this).val()) {
				var temp = JSON.parse($(this).attr('data-str'));
				temp.describle = $(this).val();
				temp.show = $(this).hasClass('active');
				settingData.scene.kqi.push(temp);
			}
		});
		//网元关键kqi绑定
		$('.wy_set_main > div').each(function(i, v) {
			var _this = this;
			settingData.netMeta[$(_this).attr('data-type')].length = 0;
			$(_this).find('input').each(function(ii, vv) {
				if ($(this).val()) {
					var temp = JSON.parse($(this).attr('data-str'));
					temp.show = $(this).hasClass('active');
					settingData.netMeta[$(_this).attr('data-type')].push(temp);
				}
			})
		})
		SEQAjax(pageConfig.ajaxUrl.UpdateConf, {
			"data": JSON.stringify(settingData)
		}, function(data) {
			if (data.statuCode === 200) {
				settingData = data.data;
				allNetkey(data);
				allNetselect(data);
				wySetData(data); //网元处理
				cjSetData(data); //场景处理
			}
		});
	});
}



/*限制字数0*/
function limitEvent(field) {
	var max = 30;
	if (field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word").text(num);
}

/*限制字数1*/
function limitEvent1(field) {
	var max = 30;
	if (field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word1").text(num);
}

/*限制字数2*/
function limitEvent2(field) {
	var max = 30;
	if (field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word2").text(num);
}
/*article滚动条*/
function art_scroll() {
	$(".con_scroll .common[data-set=allNet]").scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20,
	});
	$(".ul_scroll .ul_div_scroll").scroll_absolute({
		arrows: false
	});
}

/*关键KQI重点场景请求*/
function allNetkey(data) {
	mydata = ObjCopy(data.data);
	//舆情绑定
	$('textarea').each(function(i, v) {
		$(v).val(mydata.allNet.opinion[i]);
		switch (i) {
			case 0:
				limitEvent(v);
				break;
			case 1:
				limitEvent1(v);
				break;
			case 2:
				limitEvent2(v);
				break;
			default:
				break;
		}
	});
	//告警列表绑定
	$('.b_right').html('');
	mydata.allNet.alarm.forEach(function(v, i) {
		var temp = `<span data-str='${JSON.stringify(v)}' class="${v.show ? 'color' : ''}" data-fix="${v.fixed}">${v.describle}</span>`;
		$('.b_right').append($(temp));
	});

	var all = mydata.allNet.thirdKeyKqi;
	$(".my_ul >.setting_cjcls").html('');
	$(".max1").each(function(i, v) {
		var show_index = null;
		var se = $(this).attr("data-str");
		var _index = $(this).index();
		$(".top_div1").eq(_index).html("");
		all[se].forEach(function(value, index) {
			$('.common_top > ul').html("");
			var temp = `<li data-mes=${value.name} data-id=${value.id}>${value.describle}</li>`;
			$(".my_ul >.setting_cjcls").eq(_index).append($(temp));
			if (value.show) {
				show_index = index;
			}
			var div_change = ` <div class=${value.name} data-id=${value.id}>
	                   <div class="${value.desc ? 'top_right_top' : 'top_tt'}">
	                       <div></div>
	                       <div></div>
	                       <div></div>
	                       <div></div>
	                       </div>
	                       <input type="text" value=${value.threshold[0]} class="input input1" disabled="true">
	                       <input type="text" value=${value.threshold[1]} class="input input2">
	                       <input type="text" value=${value.threshold[2]} class="input input3">
	                       <input type="text" value=${value.threshold[3]} class="input input4">
	                       <input type="text" value=${value.threshold[4]} class="input input5">
	                       </div>`;
			$(".top_div1").eq(_index).append($(div_change));
		});
		if(show_index == null) {
			$(".top_div1").eq(_index).children('div').hide().removeClass('active');
		} else {
			$(".top_div1").eq(_index).children().eq(show_index).addClass('active').siblings().hide().removeClass('active');
			$(".leftbox >.leftname").eq(_index).text(`${all[se][show_index].describle}`);
		}
	});
}

/**
 * 设置子选项
 * @param data 需要设置的数据
 * @param dom 需要绑定的元素
 */
function setChildData(data, dom, type) {
	data.forEach(function(v, i) {
		dom.eq(i).html("");
		var vStr = JSON.stringify(v);
		var temp = `<span data-id=${v.name} data-type="${type}" data-set=${vStr} class="${v.show ? 'list1' : ''}"> ${v.describle}</span>`;
		dom.append($(temp));
	});
}

/**
 * 设置网络选项
 * @param data 需要设置的数据
 * @param index 索引
 */
function setAllNetData(data, index) {
	var _dom = $(`.same[data-str=${index}]`);
	var _num = 0;
	for (var i in data) {
		setChildData(data[i], _dom.find('.leftboxs').eq(_num), i);
		_num++;
	}
	OutDl(_dom);
}
/**/

/*输出dl*/
function OutDl(dom) {
	dom.find(".bottom_box").html("");
	dom.find(".list1").each(function(i) {
		var v = JSON.parse($(this).attr("data-set"));
		var temp = `<dl data-type="${$(this).attr("data-type")}" data-id=${v.id} ><div class="leftbottom_box">
           <span>${v.describle}</span>
           </div>
           <div class="top_right_box">
           <div class="${v.desc ? 'top_right_top' : 'top_tt'}">
           <div></div>
           <div></div>
           <div></div>
           <div></div>
           </div>
           <input type="text" value=${v.threshold[0]} class="input input1"  disabled="true">
           <input type="text" value=${v.threshold[1]} class="input input2">
           <input type="text" value=${v.threshold[2]} class="input input3">
           <input type="text" value=${v.threshold[3]} class="input input4">
           <input type="text" value=${v.threshold[4]} class="input input5">
           </div></dl>`

		dom.find(".bottom_box").append($(temp));
		dom.on('blur', '.bottom_box input', function() {
			var index = $(this).index();
			if ($(this).val() < 1) {
				colorTipArr[$(this).index() - 1] = 1;
			} else if (+$(this).val() <= +$(this).prev().val() || +$(this).val() >= +$(this).next().val()) {
				colorTipArr[$(this).index() - 1] = 2;
			} else {
				colorTipArr[$(this).index() - 1] = 0;
			}
			var pattern = /^([0-9]*$)/;
			if (!pattern.test($(this).val())) {
				$('.sz1').show();
				$('.xy1').hide();
				$('.dy1').hide();
				$(this).val("");
			} else if (/1/.test(colorTipArr.join(''))) {
				$('.dy1').show();
				$('.xy1').hide();
				$('.sz1').hide();
			} else if (/2/.test(colorTipArr.join(''))) {
				$('.xy1').show();
				$('.dy1').hide();
				$('.sz1').hide();
			} else {
				$('.dy1').show();
				$('.xy1').hide();
				$('.sz1').hide();
			}
		});
	});

}
/*kqi选择读取数据*/
function allNetselect(data) {
	mydata = ObjCopy(data.data);
	var all = mydata.allNet.kqi;
	setAllNetData(all['allNet'], 'allNet');
	setAllNetData(all['3G'], '3G');
	setAllNetData(all['4G'], '4G');
}

/**
 * 场景配置数据绑定
 * @param {Object} data
 */
function cjSetData(data) {
	$('.zbOption input').removeClass('active');
	data.data.scene.kqi.forEach(function(v, i) {
		$('.zbOption input').eq(i).val(v.describle);
		$('.zbOption input').eq(i).attr('data-str', JSON.stringify(v));
		if (v.show) {
			$('.zbOption input').eq(i).addClass('active');
		}
	});
	data.data.scene.threshold.forEach(function(v, i) {
		$('.colorTip input').eq(i).val(v);
	})
}

function fnZ(cs, lm) {
	cs.forEach(function(v, i) {
		lm.eq(i).val(v.describle).attr('data-str', JSON.stringify(v)).addClass(`${v.show ? 'active' : ''}`);
	})
}
/**
 * 网元配置数据绑定
 * @param {Object} data
 */
function wySetData(data) {
	fnZ(data.data.netMeta.RNC, $('.wyOption input'));
	fnZ(data.data.netMeta.GGSN, $('.topChange1 input'));
	fnZ(data.data.netMeta.SGW, $('.topChange2 input'));
	fnZ(data.data.netMeta.SGSN, $('.topChange3 input'));
	fnZ(data.data.netMeta.MME, $('.topChange4 input'));
}

function settingInit() {
	gbEventBind();
	art_scroll();
	SEQAjax(window.pageConfig.ajaxUrl.globalInfo, {}, function(data) {
		if (data.statuCode === "200") {
			settingData = data.data;
			allNetkey(data);
			allNetselect(data);
			wySetData(data); //网元处理
			cjSetData(data); //场景处理
		}
	});
}
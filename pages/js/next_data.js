var pageindex;
var isindex;
//初始化折线图默认配置项
var line_option = {
	tooltip: {
		trigger: 'axis',
		formatter: function(params) {
			if(params[0].data !== '') {
				return `${params[0].name}<br/>${params[0].data}`;
			}
		},
		textStyle: {
			fontSize: 0.18 * REM,
			fontFamily: 'HelveticaNeueLTStd-Lt',
		},
		padding: [0.02 * REM, 0.1 * REM],
		backgroundColor: 'rgba(48, 70, 76, 0.8)'
	},
	grid: {
		left: 0.04 * REM,
		right: 0.25 * REM,
		bottom: -14 + 0.1 * REM,
		top: 0.825 * REM,
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		boundaryGap: false,
		data: null,
		axisLine: {
			show: true,
			lineStyle: {
				color:"rgba(141, 94, 158, 0.8)",
				width:"0.5",
				type:"dotted"
			}
		},
		axisTick: {
			show: true,
			interval:function(index,string){
				if(index === 2 || index === 26 || index === 50 || index === 74 || index === 90){
					return true;
				}else{
					return false;
				}
			},
			inside:true,
			length:"4",
			lineStyle: {
				width:"1.5",
				type:"solid"
			}
		},
		axisLabel: {
			show: true,
			margin:8,
			interval:function(index,string){
				if(index === 2 || index === 26 || index === 50 || index === 74 || index === 90){
					return true;
				}else{
					return false;
				}
			},
//			inside:true,
			textStyle:{
				fontSize:"8"
			}
		}
	}],
	yAxis: [{
		type: 'value',
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		axisLabel: {
			show: false,
			formatter: function() {
				return '0';
			}
		},
		splitLine: {
			show: false
		}
	}],
	series: [{
		type: 'line',
		lineStyle: {
			normal: {
				color: 'rgba(67, 168, 161, 1)',
				width: 1
			}
		},
		symbol: 'none',
		areaStyle: {
			normal: {
				color: 'rgba(67, 168, 161, 0.2)',
				width: 1
			}
		},
		data: null
	}]
};

function nextEventBind() {
	$(document).off();
	$(document).on('click', 'article > ul li', function(e) {
		if($(this).hasClass('active')) {
			return;
		}
		var _index = $(this).index();
		var Class = '';
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		$(this).parents('article').removeClass();
		switch(_index) {
			case 0:
				Class = 'CJ_show';
				CjPageInit();
				break;
			case 1:
				Class = 'WY_show';
				if(window.isNotType) {
					var wy = getQueryString('wy');
					var type = getQueryString('type');
					WyPageInit(wy, type);
				} else {
					WyPageInit();
				}
				break;
			case 2:
				Class = 'SP_show';
				SpPageInit();
				break;
			default:
				break;
		}
		$(this).parents('article').addClass(Class);
		if(active_index != _index) {
			$('.circle_main').eq(active_index).html('');
			$('.circle_main2').eq(active_index).html('');
			$('.circle_main').eq(_index).html('');
			$('.circle_main2').eq(_index).html('');
			circle_init[active_index] = $('.circle_main').eq(active_index).radialIndicator({
				radius: 0.325 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: 75,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: '#202b2d'
			}).data('radialIndicator');
			circle_init2[active_index] = $('.circle_main2').eq(active_index).radialIndicator({
				radius: 0.325 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: circle_data[active_index],
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: circle_colors[active_index]
			}).data('radialIndicator');
			circle_init[_index] = $('.circle_main').eq(_index).radialIndicator({
				radius: 0.45 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: 75,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: '#202b2d'
			}).data('radialIndicator');
			circle_init2[_index] = $('.circle_main2').eq(_index).radialIndicator({
				radius: 0.45 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: circle_data[_index],
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: circle_colors[_index]
			}).data('radialIndicator');
			active_index = _index;
		}
		for(var i = 0; i < 3; i++) {
			var _circle_out = echarts.init(document.getElementsByClassName('circle_out')[i]);
			_circle_out.setOption(circle_out_arr[i], true);
		}
	});
	$(document).on('click', '.retrun', function(e) {
		e.stopPropagation();
//		window.location.href = `${basePath}service/initPage/index.action`;
		window.location.href = `index.html`;
	})
	//配置页面弹出
	$(document).on('click', '.setting', function() {
		if($(".CJ_card").hasClass("active")){
			$(".setting_head").children("li").eq(1).addClass("sel").siblings().removeClass("sel");
			$('.setting_main > div').eq(1).addClass('active').siblings().removeClass('active');
		}else if($(".WY_card").hasClass("active")){
			$(".setting_head").children("li").eq(2).addClass("sel").siblings().removeClass("sel");
			$('.setting_main > div').eq(2).addClass('active').siblings().removeClass('active');
		}else if($(".SP_card").hasClass("active")){
			$(".setting_head").children("li").eq(3).addClass("sel").siblings().removeClass("sel");
			$('.setting_main > div').eq(3).addClass('active').siblings().removeClass('active');
		}
		
		if(!$('.setting_bg').hasClass('active')) {
			$('.setting_bg').addClass('active');
		}
		
		//缓存从二页面下钻到配置界面的卡片值pageindex
		$("article > ul li").each(function(i,v){
			if($(v).hasClass("active")){
				pageindex = i;
			}
		})
		
		isindex = 2;
		settingPageInit();
	});
	$(document).on('click', '.set_cancel', function() {
		$(".sp_type_ul li:eq(1)").click();
		if($('.setting_bg').hasClass('active')) {
			$('.setting_bg').removeClass('active');
		}
		$(".setting_head").children("li").removeClass("sel");
		$('.setting_main > div').removeClass('active');
//		if(pageindex === 0){
//			window.location.href = `${basePath}service/twoPage/index.action?page=cj`;
//		}else if(pageindex === 1){
//			window.location.href = `${basePath}service/twoPage/index.action?page=wy`;
//		}else if(pageindex === 2){
//			window.location.href = `${basePath}service/twoPage/index.action?page=sp`;
//		}
	});
	
	
//-------------------------------------------------------------

	//导出功能弹出
	$(document).on('click','.import',function(e){
		e.stopPropagation();
		if($('article > ul li').hasClass("active")){
			$(".daochu").addClass("active");
			$("#dc_cancle_shaow").addClass("dc_cancle_shaow");
		}else{
			$(".daochu").removeClass("active");
			$("#dc_cancle_shaow").removeClass("dc_cancle_shaow");
		}
	});

	//导出功能的关闭
	$(document).on('click','.daochu .span_close',function(e){
		e.stopPropagation();
		$(".daochu").removeClass("active");
		$("#dc_cancle_shaow").removeClass("dc_cancle_shaow");
	});


	//导出功能确定
	$(document).on("click",".daochu_bottom .export_sure",function(e){
		e.stopPropagation();
		$(".daochu").removeClass("active");
		$("#dc_cancle_shaow").removeClass("dc_cancle_shaow");
		if($(this).parents(".daochu").siblings('article').children("ul").children("li").hasClass("active")){
			var	serviceType = $(this).parents(".daochu").siblings('article').children("ul").children(".active").attr("data-str");
			var startime = (new Date(($(".daochu").children(".input_center").children("input").eq(0).val()).replace(/-/g,'/'))).getTime();
			var	endtime  = (new Date(($(".daochu").children(".input_center").children("input").eq(1).val()).replace(/-/g,'/'))).getTime();
			console.log(serviceType,startime,endtime);
		}
		var paramstwo = {
			starttime:startime/1000,
			endtime:endtime/1000,
			serviceType:serviceType
		};
		SEQAjax(pageConfig.ajaxUrl.Export,paramstwo
			, function(data) {
					var  ExportData=ObjCopy(data.data);
					window.open(encodeURI(encodeURI(ExportData.path)));
		});

	});
}




//var startDom = $("#startTime");
//var endDom = $("#endTime");
//var initalOption= {
//	start: {
//		"minDate": new Date(new Date(moment()._d.toLocaleDateString()).getTime()-24*3600*1000*8),
//		"maxDate": moment().subtract(60,"minute"),
//		"singleDatePicker": true,
//		"showDropdowns": true,
//		"timePicker": true,
//		"timePickerIncrement": 15,
//		"locale": {
//			format: 'YYYY-MM-DD  HH:mm'
//		}
//	},
//	end: {
//		"minDate":  new Date(new Date(moment()._d.toLocaleDateString()).getTime()-24*3600*1000*8+900*1000),
//		"maxDate": moment().subtract(45,"minute"),
//		"singleDatePicker": true,
//		"timePicker": true,
//		"showDropdowns": true,
//		"timePickerIncrement": 15,
//		"locale": {
//			format: 'YYYY-MM-DD  HH:mm'
//		}
//	}
//
//};
//
//timeGran();
//
////初始化时间
//function timeGran(){
//	initialDate(startDom,endDom);
//}
////初始开始时间
//function initialDate(startDom,endDom){
//
//	startDom.daterangepicker(initalOption.start,startChosen);
//
//	endDom.daterangepicker(initalOption.end,endChosen);
//}
//
////手动设置开始时间
//function startChosen(start, end, label){
//	
//	//改变endDOM的范围
//	initalOption.end.minDate = start.format("YYYY-MM-DD HH:mm");
//	endDom.daterangepicker(initalOption.end,endChosen);
//}
//
////手动设置结束时间
//function endChosen(start, end, label){
//
//	//改变startDOM的范围
//	initalOption.start.maxDate = end.subtract(15,"minute").format("YYYY-MM-DD HH:mm")
//	startDom.daterangepicker(initalOption.start,startChosen);
//}


//-------------------------------------------------------------


var circle_init = [];
var circle_init2 = [];
var circle_out_arr = [];
var active_index = 0;
var circle_data = [];	//需要随时渲染环形图，动态保存数据
var circle_colors = [];	//需要随时渲染环形图，动态保存颜色渲染字段
var isPageInit = true;	//保存页面是否初始化信息
var carousel = null;	//缓存舆情轮播
var carousel_ps = 0;	//缓存舆情轮播位置
var bar_color = ["#bc5449", "#bcb849", "#5191c7", "#2fc085"];	//初始化调色盘
//初始化饼状图默认配置项
var pie_option = {
	tooltip: {
		show: false
	},
	color: null,
	title: {
		show: false
	},
	series: [{
		type: 'pie',
		radius: ['92%', '100%'],
		hoverAnimation: false,
		avoidLabelOverlap: false,
		legendHoverLink: true,
		center: ['50%', '50%'],
		itemStyle: {
			normal: {
				borderColor: '#16191b',
				borderWidth: 0.015 * REM,
			}
		},
		labelLine: {
			normal: {
				show: false
			}
		},
		data: null
	}]
};

/**
 * 环形进度条渲染
 * @param {Object} index 当前渲染环形进度条index
 * @param {Object} data	渲染数据
 */
function SetACircle(index, data) {
	var _this_color = bar_color.concat([]);
	var _dom = $('.card_main').eq(index);
	var grade = '';
	var grade_num = data.kqiArray[data.kqiArray.length-1].value / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75;
	var grade_color = '#2fc085';
	if(!circle_init[index]) {
		if($('article> ul> li').eq(index).hasClass('active')) {
			circle_init[index] = _dom.find('.circle_main').radialIndicator({
				radius: 0.45 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: 75,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: '#202b2d'
			}).data('radialIndicator');
			active_index = index;
		} else {
			circle_init[index] = _dom.find('.circle_main').radialIndicator({
				radius: 0.325 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: 75,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: '#202b2d'
			}).data('radialIndicator');
		}
	} else {
		circle_init[index].animate(75);
	}
	_dom.find('h4').text(data.describle);
	_dom.find('.circle_data .font_chart').text((+data.kqiArray[data.kqiArray.length-1].value).toFixed(2));
	switch(true) {
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[4]:
			grade = '优';
			_dom.find('.circle_data .font_chart').css("color","#2fc085");
			if(data.kqiConf.desc) {
				grade = '差';
				_dom.find('.circle_data .font_chart').css("color","#bc5449");
			}
//			grade_num = 75;
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[3]:
			grade = '优';
			_dom.find('.circle_data .font_chart').css("color","#2fc085");
			if(data.kqiConf.desc) {
				grade = '差';
				_dom.find('.circle_data .font_chart').css("color","#bc5449");
			}
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[2]:
			grade = '良';
			_dom.find('.circle_data .font_chart').css("color","#4b86b7");
			if(data.kqiConf.desc) {
				grade = '中';
				_dom.find('.circle_data .font_chart').css("color","#bcb849");
			}
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[1]:
			grade = '中';
			_dom.find('.circle_data .font_chart').css("color","#bcb849");
			if(data.kqiConf.desc) {
				grade = '良';
				_dom.find('.circle_data .font_chart').css("color","#4b86b7");
			}
			break;
		default:
			grade = '差';
			_dom.find('.circle_data .font_chart').css("color","#bc5449");
			if(data.kqiConf.desc) {
				grade = '优';
				_dom.find('.circle_data .font_chart').css("color","#2fc085");
			}
			break;
	}
	_dom.find('.circle_data .circle_grade').text(grade);
	var num1 = (data.kqiConf.threshold[1] - data.kqiConf.threshold[0]) / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75;
	var num2 = (data.kqiConf.threshold[2] - data.kqiConf.threshold[0]) / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75;
	var num3 = (data.kqiConf.threshold[3] - data.kqiConf.threshold[0]) / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75;
	if(data.kqiConf.desc) {
		_this_color = _this_color.reverse();
	}
	var colors = `{"0": "${_this_color[0]}", "${(num1).toFixed(6)}": "${_this_color[0]}", "${(num1 + 0.000001).toFixed(6)}": "${_this_color[1]}", "${(num2).toFixed(6)}": "${_this_color[1]}", "${(num2 + 0.000001).toFixed(6)}": "${_this_color[2]}", "${(num3).toFixed(6)}": "${_this_color[2]}", "${(num3 + 0.000001).toFixed(6)}": "${_this_color[3]}", "${(75).toFixed(6)}": "${_this_color[3]}"}`;
//	var colors = '{"0" : "#bc5449","' + (num1).toFixed(6) + '":"#bc5449","' + (num1 + 0.000001).toFixed(6) + '": "#bcb849","' + (num2).toFixed(6) + '":"#bcb849","' + (num2 + 0.000001).toFixed(6) + '": "#4b86b7","' + (num3).toFixed(6) + '":"#4b86b7","' + (num3 + 0.000001).toFixed(6) + '": "#2fc085","' + (75).toFixed(6) + '":"#2fc085"}';
//	var colors = `{"0": "#bc5449", "${(num1).toFixed(6)}": "#bc5449", "${(num1 + 0.000001).toFixed(6)}": "#bcb849", "${(num2).toFixed(6)}": "#bcb849", "${(num2 + 0.000001).toFixed(6)}": "#4b86b7", "${(num3).toFixed(6)}": "#4b86b7", "${(num3 + 0.000001).toFixed(6)}": "#2fc085", "${(75).toFixed(6)}": "#2fc085"}`;
	if(+grade_num >= +num3 && +grade_num <=  Math.ceil(num3)) {
		grade_num = Math.ceil(grade_num);
	} else if(+grade_num >= +num2 && +grade_num <=  Math.ceil(num2)) {
		grade_num = Math.ceil(grade_num);
	} else if(+grade_num >= +num1 && +grade_num <=  Math.ceil(num1)) {
		grade_num = Math.ceil(grade_num);
	}
	colors = JSON.parse(colors);
	circle_data[index] = grade_num;
	circle_colors[index] = colors;
	if(!circle_init2[index]) {
		if($('article> ul> li').eq(index).hasClass('active')) {
			circle_init2[index] = _dom.find('.circle_main2').radialIndicator({
				radius: 0.45 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: grade_num,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: colors
			}).data('radialIndicator');
			active_index = index;
		} else {
			circle_init2[index] = _dom.find('.circle_main2').radialIndicator({
				radius: 0.325 * REM,
				barWidth: 0.085 * REM,
				roundCorner: true,
				initValue: grade_num,
				maxValue: 100,
				displayNumber: false,
				barBgColor: 'transparent',
				barColor: colors
			}).data('radialIndicator');
		}
	} else {
		circle_init2[index].animate(grade_num);
	}
	
	//同比值
	if(data.kqiArray.length <= 1 || data.kqiArray[data.kqiArray.length - 2].value == 0) {
			up_or_down = 0;
			if(!data.kqiConf.desc){
				_dom.find('.font_chart_up_down_b').addClass('up');
			}else{
				_dom.find('.font_chart_up_down_b').addClass('up_o');
			}
		} else if(data.kqiArray[data.kqiArray.length - 1].value >= data.kqiArray[data.kqiArray.length - 2].value) {
			up_or_down = round((data.kqiArray[data.kqiArray.length - 1].value - data.kqiArray[data.kqiArray.length - 2].value) / data.kqiArray[data.kqiArray.length - 2].value * 100, 2);
			if(!data.kqiConf.desc){
				_dom.find('.font_chart_up_down_b').addClass('up');
			}else{
				_dom.find('.font_chart_up_down_b').addClass('up_o');
			}
		} else {
			up_or_down = round((data.kqiArray[data.kqiArray.length - 2].value - data.kqiArray[data.kqiArray.length - 1].value) / data.kqiArray[data.kqiArray.length - 2].value * 100, 2);
			if(!data.kqiConf.desc){
				_dom.find('.font_chart_up_down_b').addClass('down');
			}else{
				_dom.find('.font_chart_up_down_b').addClass('down_o');
			}
		}
		_dom.find('.font_chart_up_down_b').html(`<i></i>${formatNumber(round(up_or_down))}%`);
	
	//动态渲染外部环形区域(饼状图渲染)
	var _circle_out = echarts.init(document.getElementsByClassName('circle_out')[index]);
	var _out_option = ObjCopy(pie_option);
	_out_option.series[0].data = [];
	_out_option.color = _this_color.concat(['transparent']);
	data.kqiConf.threshold.forEach(function(v, i) {
		if(i) {
			_out_option.series[0].data.push((v - data.kqiConf.threshold[i - 1]) / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75);
		} else {
			return;
		}
	});
	_out_option.series[0].data.push({value: 25, itemStyle: {normal: {borderColor: 'transparent'}}});
	circle_out_arr[index] = _out_option;
	_circle_out.setOption(_out_option, true);
	

	//二页面环形图下趋势图
	var option = ObjCopy(line_option);
	var time_data = ['23:30','23:45','00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15'];
	var user_data = [];
	var data_arr = data.kqiArray;
	var unit = null;
	var line = echarts.init(document.getElementsByClassName('secondquxian')[index]);
	option.series[0].lineStyle.normal.color = 'rgba(67, 168, 161, 0.8)';
	option.xAxis[0].axisLine.lineStyle.color = 'rgba(67, 168, 161, 0.8)';
	option.xAxis[0].axisTick.lineStyle.color = 'rgba(42, 77, 73, 0.8)';
	option.xAxis[0].axisLabel.textStyle.color = 'rgba(42, 77, 73, 0.8)';
	option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
	}], false);
	data_arr.forEach(function(vv, ii) {
//		time_data.push(new Date(vv.startTime * 1000 + 900000).format('hh:mm', 0));
		user_data.push(vv.value);
	});
	if(data_arr.length < 96) {
		var temp = new Array(96 - data_arr.length);
		for(var j = 0; j < 96 - data_arr.length; j++) {
			temp[j] = '';
		}
//		time_data = time_data.concat(temp);
		user_data = user_data.concat(temp);
	}
	option.xAxis[0].data = time_data;
	option.series[0].data = user_data;
	option.xAxis[0].axisLabel.margin = 3;
	option.xAxis[0].axisLabel.textStyle.fontSize = '7';
	option.grid.top = 0.5 * REM;
	option.grid.bottom = -5;
	if(/频次/.test(data.describle)) {
		unit = '次/分';
	} else if(/[时延|时长]/.test(data.describle)) {
		unit = 'ms';
	} else if(/速率/.test(data.describle)) {
		unit = 'Kbps';
	} else {
		unit = '%';
	}
	option.tooltip.formatter = function(params) {
		if(params[0].data !== '') {
			return `${params[0].name}<br/>${formatNumber(params[0].data.toFixed(2))}${unit}`;
		}
	}
	line.setOption(option, true);
}





/**
 * 根据页面不同状态刷新不同部分页面信息
 */
function initChildPage() {
	//区分页面初始化以及非初始化状态页面刷新内容
	if(isPageInit) {
		isPageInit = !isPageInit;
		var page = getQueryString('page');
		var area = getQueryString('area');
		var wy = getQueryString('wy');
		var type = getQueryString('type');
		var sp = getQueryString('sp');
		switch (page){
			case 'cj':
				$('article').removeClass().addClass('CJ_show');
				$('.CJ_card').addClass('active').siblings().removeClass('active');
				CjPageInit(area);
				break;
			case 'wy':
				$('article').removeClass().addClass('WY_show');
				$('.WY_card').addClass('active').siblings().removeClass('active');
				WyPageInit(wy, type);
				break;
			case 'sp':
				$('article').removeClass().addClass('SP_show');
				$('.SP_card').addClass('active').siblings().removeClass('active');
				SpPageInit(sp);
				break;
			default:
				break;
		}
	} else {
		var _this_page = $('article').attr('class');
		switch (_this_page){
			case 'CJ_show':
				CjPageInit();
				break;
			case 'WY_show':
				WyPageInit();
				break;
			case 'SP_show':
				SpPageInit();
				break;
			default:
				break;
		}
	}
}

/**
 * 展示a面受影响用户数
 * @param {Object} index 需要展示的index
 * @param {Object} data 需要展示的data
 */
function SetAffectedUserNum(index, data) {
	var _dom = $('.card_bot').eq(index);
	_dom.find('.card_bot_l p').text(data.value);
	_dom.find('.card_bot_r > p').text(`${data.workOrder.processing} / ${data.workOrder.fixed}`);
	_dom.find('.work_l').css('width', `${data.workOrder.processing / (data.workOrder.processing + data.workOrder.fixed) * 100}%`)
}

/**
 * 舆情设置滚动功能
 * @param {Object} data [需要处理的舆情数据]
 */
function SetConsensusInformation(data) {
	if(carousel) {
		clearInterval(carousel);
		carousel_ps = 0;
	}
	var _dom = $('header > .f_left > .information > ul');
	_dom.html('');
	data.data.forEach(function(v, i) {
		var temp = `<li title="${v}">${v}</li>`;
		_dom.append($(temp));
	});

	_dom.append($(`<li title="${data.data[0]}">${data.data[0]}</li>`))


	carousel = setInterval(function() {
		carousel_ps++;
		_dom.css({"transition": "transform 1s linear"});
		_dom.css({"transform": `translateY(${0 - carousel_ps * 0.366}rem)`});
		if(carousel_ps >= 3) {
			setTimeout(function() {
				_dom.css({"transition": "transform 0s linear"});
				carousel_ps = 0;
				_dom.css({"transform": `translateY(${carousel_ps * 0.366}rem)`});
			}, 1000)
		}
	}, 5000);
}

//二界面初始化请求
function PageInit() {
	//解决大屏嵌套问题,阻止seq平台内部发送ajax请求
//	if (top !== self) {
//		return;
//	}
	nextEventBind();
	//舆情数据处理
	SEQAjax(window.pageConfig.ajaxUrl.consensusInformation, {}, function(data) {
		if(data.statuCode === '200') {
			SetConsensusInformation(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '0'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(0, data.data[0]);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '1'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(1, data.data[1]);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantKqi, {
		importantType: '2'
	}, function(data) {
		if(data.statuCode === '200') {
			SetACircle(2, data.data[2]);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(0, data.data['scene']);
			SetAffectedUserNum(1, data.data['netMeteData']);
			SetAffectedUserNum(2, data.data['sp']);
		}
	});
	initChildPage();
}

$(function() {
	PageInit();
	SetTime(PageInit);
})
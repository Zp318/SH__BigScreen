var isindex;
//index界面数据处理文件
//缓存用户数数据(2/3/4G)
var active_user_num = [{value:0,name:"0"}, {value:0,name:"0"}, {value:0,name:"0"}];
//var active_user_num = [0,0,0];
//2/3/4G请求是否完成flag,只有全部渲染完成，才会执行饼状图渲染
var circle_init = [];
var circle_init2 = [];
var interval = null;
var animate_dom = 0;
var animate_init = false; //动画是否已经开始播放
var startPos = 0;
var endPos = 0;
var mydata;	//缓存查询的重点小区数据
var myspdata; //缓存查询的重点SP数据
var carousel = null;	//缓存舆情轮播
var carousel_ps = 0;	//缓存舆情轮播位置
var bar_color = ["#bc5449", "#bcb849", "#5191c7", "#2fc085"];	//初始化调色盘
//初始化饼状图默认配置项
var pie_option = {
	tooltip: {
		trigger: 'item',
		formatter: "{d}%",
		textStyle: {
			fontSize: 0.18 * REM,
			fontFamily: 'HelveticaNeueLTStd-Lt',
			color: '#c8fef9'
		},
		padding: [0.02 * REM, 0.1 * REM],
		backgroundColor: 'rgba(48, 70, 76, 0.8)'
	},
	color: ['#5191c7', '#8d5e9e', '#52c7ac'],
	title: {
		text: '',
		subtext:'',
		left: 'center',
		top: 0.1 * REM,
		itemGap:0,
		textBaseline:'top',
		padding:0,
		textStyle: {
			color: '#c8fef9',
			fontSize: 0.2 * REM,
			fontFamily: '方正兰亭',
			fontWeight: 'normal'
		},
		subtextStyle:{
			color: '#c8fef9',
			fontSize: 0.1 * REM,
			fontFamily: '方正兰亭',
			fontWeight: 'normal'
		}
	},
	series: [{
		name: '访问来源',
		type: 'pie',
		radius: ['35%', '55%'],
		hoverAnimation: false,
		avoidLabelOverlap: false,
		legendHoverLink: true,
		center: ['50%', '60%'],
		minAngle:0,
		itemStyle: {
			normal: {
				borderColor: '#16191b',
				borderWidth: 0.03 * REM,
			}
		},
		label:{
			normal:{
				show:false,
				position:"outside",
				formatter: '{b}',
				textStyle:{
					fontSize:6
				}
			}
		},
		labelLine: {
			normal: {
				show: false,
				length:7,
				length2:5
			}
		},
		data: null
	}]
};
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
				color:"rgba(141, 94, 158, 0.8)",
				width:"1.5",
				type:"solid"
			}
		},
		axisLabel: {
			show: true,
			inside:false,
			margin:8,
			interval:function(index,string){
				if(index === 2 || index === 26 || index === 50 || index === 74 || index === 90){
					return true;
				}else{
					return false;
				}
			},
			textStyle:{
				color:"rgba(141, 94, 158, 0.8)",
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

//事件绑定
function EventBind() {
	//	初始化页面绑定
	$(document).off();
	//	全网三四g切换
	var timerqh;
	$(document).on('click', 'footer ul li', function(e) {
		var lxnum;
		$(this).addClass('sel').siblings().removeClass('sel');
		var num = null;
		switch($(this).index()) {
			case 0:
				num = 0;
				lxnum = "allg";
				break;
			case 1:
				num = 4;
				lxnum = "fourg";
				break;
			case 2:
				num = 3;
				lxnum = "threeg";
				break;
			default:
				num = 0;
				lxnum = "allg";
				break;
		}
		clearTimeout(timerqh);
		timerqh=setTimeout(function(){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: num
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption(lxnum,data);
				}
			});
		},1000)
		
	});
	//	切换动画整合
	function cardAnimate() {
		if(!$('.container').eq(animate_dom).hasClass('flap')) {
			$('.container').eq(animate_dom).removeClass('flap2');
			$('.container').eq(animate_dom).addClass('flap');
			$('.container').eq(animate_dom).css({
				transform: 'rotateY(0deg)'
			});
			animate_dom = (animate_dom + 1) % 3;
		} else {
			$('.container').eq(animate_dom).removeClass('flap');
			$('.container').eq(animate_dom).addClass('flap2');
			$('.container').eq(animate_dom).css({
				transform: 'rotateY(180deg)'
			});
			animate_dom = (animate_dom + 1) % 3;
		}
	}
	//配置页面弹出
	$(document).on('click', '.setting', function() {
		if(!$('.setting_bg').hasClass('active')) {
			$('.setting_bg').addClass('active');
		}
		isindex = 1;
		settingPageInit();
	});
	$(document).on('click', '.set_cancel', function() {
//		$(".sp_type_ul li:eq(1)").click();
		if($('.setting_bg').hasClass('active')) {
			$('.setting_bg').removeClass('active');
		}
	});
	

	
	//	播放器功能绑定
	$(document).on("mouseenter",".conbox",function(e){
		$(this).hide();
		$(".controll").addClass("conbor");
	});
	
	$(document).on("mouseleave",".controll",function(e){
		$(".conbox").show();
		$(".controll").removeClass("conbor");
	});
	
	$(document).on('click', '.controll', function(e) {
		if($(this).hasClass('play')) {
			$(this).removeClass("play").addClass("stop");
			if($('.flap').hasClass('flap')) {
				$('.flap').addClass('flap2').removeClass('flap');
				$('.container').css({
					transform: 'rotateY(180deg)'
				});
				setTimeout(function() {
					animate_init = true;
					animate_dom = 0;
					if(!$('.controll').hasClass('play')) {
						cardAnimate();
						if(interval == null) {
							interval = setInterval(cardAnimate, 4000);
						}
					}
				}, 4000)
			} else {
				animate_init = true;
				cardAnimate();
				if(interval == null) {
					interval = setInterval(cardAnimate, 4000);
				}
			}
		} else {
			animate_init = false;
			$(this).addClass('play').removeClass('stop');
			if(interval) {
				clearInterval(interval);
				interval = null;
			}
		}
	});
	//	鼠标移入动画暂停
	$(document).on('mouseenter', '.main_card', function(e) {
		e.stopPropagation();
		if(!$(this).index()) {
			return;
		}
		if(interval) {
			clearInterval(interval);
			interval = null;
		}
	});
	//	鼠标移出动画重新开始
	$(document).on('mouseleave', '.main_card', function(e) {
		e.stopPropagation();
		if(!$(this).index()) {
			return;
		}
		if($('.controll').hasClass('play')) {
			return;
		}
		if(animate_init) {
			cardAnimate();
			if(interval == null) {
				interval = setInterval(cardAnimate, 4000);
			}
		}
	});
	//	鼠标拖拽卡片翻转
	$(document).on('mousedown', '.main_card > li', function(e) {
		var _this = $(this);
		if(!_this.index() || _this.hasClass('controll')) {
			return;
		}
		startPos = e.pageX;
		$(document).on('mouseup', '.main_card > li', function(e) {
			endPos = e.pageX;
			if(Math.abs(endPos - startPos) / REM > 1) {
	
				if($('.controll').hasClass('stop')) {
					return;
				}
				$('.page_animate').eq($(this).index() - 1).hide();
				if(_this.find('.container').hasClass('flap')) {
					_this.find('.container').addClass('flap2').removeClass('flap');
					_this.find('.container').css({
						transform: 'rotateY(180deg)'
					});
				} else {
					_this.find('.container').addClass('flap').removeClass('flap2');
					_this.find('.container').css({
						transform: 'rotateY(0deg)'
					});
				}
			} else {
				var _next_page = '';
				switch ($(this).attr('class')){
					case 'zdcj':
						_next_page = 'cj';
						break;
					case 'zdwy':
						_next_page = 'wy';
						break;
					case 'zdsp':
						_next_page = 'sp';
						break;
					default:
						break;
				}
//				window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}`;
				window.location.href = `next.html?page=${_next_page}`;
			}
			$(document).off('mouseup', '.main_card > li');
		});
	});
	
	//场景下钻
	$(document).on('mousedown', '.cityMainPlace .itemDetail .itemDetailUl> li', function(e) {
		e.stopPropagation();
		var _next_page = '';
		var _next_area = $(this).find('.placePercent > p').text();
		switch ($(this).parents('li').attr('class')){
			case 'zdcj':
				_next_page = 'cj';
				break;
			case 'zdwy':
				_next_page = 'wy';
				break;
			case 'zdsp':
				_next_page = 'sp';
				break;
			default:
				break;
		}
//		window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}&area=${escape(_next_area)}`;
		window.location.href = `next.html?page=${_next_page}&area=${escape(_next_area)}`;
	});
	
	
		//点击重点场景特别关注下钻
	$(document).on('mousedown', '.zdcj .station ul> li', function(e) {
		e.stopPropagation();
		var _next_page = '';
		var _next_area = $(this).attr("data-shuyu");
		var _next_area_xiao = $(this).find('.stationDetail').find(".stationName").children("p").text();
		switch ($(this).parents('li').attr('class')){
			case 'zdcj':
				_next_page = 'cj';
				break;
			case 'zdwy':
				_next_page = 'wy';
				break;
			case 'zdsp':
				_next_page = 'sp';
				break;
			default:
				break;
		}
		window.sessionStorage.setItem("specialcj",_next_area_xiao);
//		window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}&area=${escape(_next_area)}`;
		window.location.href = `next.html?page=${_next_page}&area=${escape(_next_area)}`;
	});
	
	
	
	//网元类型下钻
	$(document).on('mousedown', '.zdwy .zdwyImg> div', function(e) {
		e.stopPropagation();
		var _next_page = '';
		var _next_wy = $(this).attr('class');
		switch ($(this).parents('li').attr('class')){
			case 'zdcj':
				_next_page = 'cj';
				break;
			case 'zdwy':
				_next_page = 'wy';
				break;
			case 'zdsp':
				_next_page = 'sp';
				break;
			default:
				break;
		}
//		window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}&wy=${_next_wy}`;
		window.location.href = `next.html?page=${_next_page}&wy=${_next_wy}`;
	});
	
	//sp下钻
	$(document).on('mousedown', '.zdsp .spDetail> ul>li', function(e) {
		e.stopPropagation();
		var _next_page = '';
		var _next_sp = $(this).find('.placePercent > p').text();
		switch ($(this).parents('li').attr('class')){
			case 'zdcj':
				_next_page = 'cj';
				break;
			case 'zdwy':
				_next_page = 'wy';
				break;
			case 'zdsp':
				_next_page = 'sp';
				break;
			default:
				break;
		}
//		window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}&sp=${escape(_next_sp)}`;
		window.location.href = `next.html?page=${_next_page}&sp=${escape(_next_sp)}`;
	})

	//点击重点sp特别关注下钻
	$(document).on('mousedown', '.zdsp .media> ul>li', function(e) {
		e.stopPropagation();
		var _next_page = '';
		var _next_sp = $(this).find('.mediaDetail').find(".mediaName").children("p").text();
		switch ($(this).parents('li').attr('class')){
			case 'zdcj':
				_next_page = 'cj';
				break;
			case 'zdwy':
				_next_page = 'wy';
				break;
			case 'zdsp':
				_next_page = 'sp';
				break;
			default:
				break;
		}
//		window.location.href = `${basePath}service/twoPage/index.action?page=${_next_page}&sp=${escape(_next_sp)}`;
		window.location.href = `next.html?page=${_next_page}&sp=${escape(_next_sp)}`;
	})


	//删除重点场景功能
	$(document).on('mousedown', '.zdcj .station .cancel', function(e) {
		e.stopPropagation();
		$(document).off("click", ".cc_qr");
		$(document).off("click", ".cc_qx");
		$(document).off("click", ".cc_canclebox");
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#cancle_choose").addClass("cancle_choose").removeClass("spcancle_choose");
		$(this).parent().addClass("cancelbox");
		var _this = this;
		var myData = [];
		var data_i = {};
		$(this).parent().parent().siblings().each(function(i, v) {
			data_i.areaCode = $(v).attr('data-id');
			data_i.areaName = $(v).find(".stationName").find("p").text();
			myData.push(ObjCopy(data_i));
		});
		//确定删除场景
		$(document).on("click", ".cc_qr", function() {
			$(_this).parent().parent().remove();
			$('.zdcj .station ul li').removeClass().addClass(`cjli_${$('.zdcj .station ul').children().length}`);
			$("#cancle_choose").removeClass("cancle_choose");
			$("#cancle_shaow").removeClass("cancle_shaow");
			SEQAjax(pageConfig.ajaxUrl.keySceneCustomAreaShowConfig, {"data":JSON.stringify(myData)}, function(data) {
				if(data.statuCode === '200') {
					setChildSceneUserNum(data);
				}
			});
			if($(".station>ul").children().length===0){
				$("#cjadd>div").addClass("delzero");
				$("#cjadd").addClass("addboxwid");
			}else{
				$("#cjadd>div").removeClass("delzero");
				$("#cjadd").removeClass("addboxwid");
			}
		});
		//取消删除场景
		$(document).on("click", ".cc_qx", function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_this).parent().removeClass("cancelbox");
		});
		$(document).on("click", ".cc_canclebox",function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_this).parent().removeClass("cancelbox");
		});
	});

	//增加重点场景功能
	$(document).on('mousedown', '.zdcj .station #cjadd', function(e) {
		e.stopPropagation();
		$(".add_cjcls").html("");
		$("#rightname").val("");
		//请求场景选择数据
		SEQAjax(pageConfig.ajaxUrl.keySceneCustomAreaShowQuery, {}, function(data) {
			if (data.statuCode === '200') {
				setCustomAreaShowQuery(data);
				$("#leftname").text(mydata[0].sceneName);
			}
		});
		
		//默认显示场景
		$(".containerone").hide();
		$(".containertwo").hide();
		if($(".station>ul").children().length === 0){
			$(this).addClass("add_activezero");
		}else{
			$(this).addClass("add_active");
		}
		
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#add_choose").addClass("add_choose");
	});
	//场景类型下拉框
	$(document).on("click", ".add_cjpicone",function(e) {
		e.stopPropagation();
		$(".containerone").stop(true, true).slideToggle();
		if(mydata.length>5){
			$(".scrollboxone").removeClass("lessfive");
			$('.containerone .scrollone .scrollboxone').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".scrollboxone").addClass("lessfive");
		}
		$('.containertwo').hide();
	});
	//场景下拉框
	$(document).on("click",".add_cjpictwo", function(e) {
		e.stopPropagation();
		$(".containertwo").stop(true, true).slideToggle();
		if($(".add_cjclsdd").children().length>5){
			$(".scrollboxtwo").removeClass("lessfive");
			$(".add_cjclsdd").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
			$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".scrollboxtwo").addClass("lessfive");
		}
		$('.containerone').hide();
	});
	//场景类型下拉框选项选择
	$(document).on("mouseenter",".add_cjcls>li",function(){
		$(this).addClass("everyli");
	});
	$(document).on("mouseleave",".add_cjcls>li",function(){
		$(this).removeClass("everyli");
	});
	$(document).on("mousedown",".add_cjcls>li",function(e){
		e.stopPropagation();
		$("#leftname").text($(this).text());
		$(".containerone").hide();
		$("#rightname").val("");
		$(".add_cjclsdd").html("");
		setChildAreaData(mydata,$(this).text());
		
		$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
		if($(".add_cjclsdd").children().length>5){
			$(".scrollboxtwo").css("height","1rem");
			$(".add_cjclsdd").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		}else{
			$(".scrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
			$(".containertwo .scroll_vertical_bar .scroll_drag").hide();
		}
	});
	//场景类型中场景下拉框选项选择
	var cjname;
	var cjcode;
	var myData = [];
	var data_i = {};
	var addata = {};
	$(document).on("mouseenter",".add_cjclsdd>li",function(){
		$(this).addClass("everyli");
	});
	$(document).on("mouseleave",".add_cjclsdd>li",function(){
		$(this).removeClass("everyli");
	});
	$(document).on("mousedown",".add_cjclsdd>li",function(e){
		e.stopPropagation();
		$("#rightname").val($(this).text());
		$(".containertwo").hide();
	});
	//确定增加场景
	$(".add_qr").on("mousedown", function(e) {
		myData=[];
		e.stopPropagation();
		cjname=$("#rightname").val();
		mydata.forEach(function(v, i) {
			if(v.sceneName === $("#leftname").text()) {
				for(var index = 0; index < v.customAreas.length; index++) {
					if(v.customAreas[index].areaName===cjname){
						cjcode=v.customAreas[index].areaCode;
						$("#cjadd").siblings().children().each(function(i, v) {
							data_i.areaCode = v.dataset.id;
							data_i.areaName = $(v).find(".stationName").find("p").text();
							myData.push(ObjCopy(data_i));
						});
						addata.areaCode = cjcode;
						addata.areaName = cjname;
						myData.push(ObjCopy(addata));
						$("#rightname").val("");
						SEQAjax(pageConfig.ajaxUrl.keySceneCustomAreaShowConfig, {"data":JSON.stringify(myData)}, function(data) {
							if(data.statuCode === '200') {
								setChildSceneUserNum(data);
							}
						});
						break;
					}
				}
			}
		});
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#add_choose").removeClass("add_choose");
		$("#cjadd").removeClass("add_active").removeClass("add_activezero");
		
		if($(".station>ul").children().length===0){
			$("#cjadd>div").addClass("delzero");
			$("#cjadd").addClass("addboxwid");
		}else{
			$("#cjadd>div").removeClass("delzero");
			$("#cjadd").removeClass("addboxwid");
		}
	});
	//取消增加场景
	$(document).on("mousedown",".add_qx", function(e) {
		e.stopPropagation();
		$("#rightname").val("");
		$(".add_cjclsdd,.add_cjcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#add_choose").removeClass("add_choose");
		$("#cjadd").removeClass("add_active").removeClass("add_activezero");
	});
	$(document).on("mousedown", ".add_canclebox",function(e) {
		e.stopPropagation();
		$("#rightname").val("");
		$(".add_cjclsdd,.add_cjcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#add_choose").removeClass("add_choose");
		$("#cjadd").removeClass("add_active").removeClass("add_activezero");
	});
	
	//搜索场景功能
	$(document).on("keyup","#rightname",function(){
		$(".add_cjclsdd").html("");
		if($("#rightname").val() != null){
			setChildAreaDataSearch(mydata,$("#leftname").text(),$(this).val());
			
			$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			if($(".add_cjclsdd").children().length>5){
				$(".scrollboxtwo").css("height","1rem");
			}else{
				$(".scrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
				$(".containertwo .scroll_vertical_bar .scroll_drag").hide();
			}
		}else{
			setChildAreaData(mydata,$("#leftname").text());
		}
	});
	//场景得焦显示下拉框,失焦隐藏
	$(document).on("focus","#rightname",function(e){
		e.stopPropagation();
		$(".containertwo").stop(true, true).slideToggle();
		if($(".add_cjclsdd").children().length>5){
			$(".scrollboxtwo").removeClass("lessfive");
			$(".add_cjclsdd").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
			$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".scrollboxtwo").addClass("lessfive");
		}
		$('.containerone').hide();
		$(".containertwo").show();
	});
	$(document).on('click', '#rightname', function(e) {
		e.stopPropagation();
	});
	$(document).on('click', '.cancle_shaow, .add_choose', function() {
		$('.containertwo').hide();
		$('.containerone').hide();
	});
	
	
	//导出功能弹出
	$(document).on('click','.import',function(){
		$(".daochu").addClass("active");
		$("#dc_cancle_shaow").addClass("dc_cancle_shaow");
	});
	//导出功能的关闭
	$(document).on('click','.daochu .span_close',function(){
		$(".daochu").removeClass("active");
		$("#dc_cancle_shaow").removeClass("dc_cancle_shaow");
	});


	//导出功能确定
	$(document).on("click",".daochu_bottom .export_sure",function(e){
		$("#daochubeijing").css("display","block");
		e.stopPropagation();
		$(".daochu").removeClass("active");
		$("#dc_cancle_shaow").removeClass("dc_cancle_shaow");
		var	serviceType = $(this).parents(".daochu").siblings('.article_active').attr("data-str");
		var startime = (new Date(($(".daochu").children(".input_center").children("input").eq(0).val()).replace(/-/g,'/'))).getTime();
		var	endtime  = (new Date(($(".daochu").children(".input_center").children("input").eq(1).val()).replace(/-/g,'/'))).getTime();

		var paramstwo = {
			starttime:startime/1000,
			endtime:endtime/1000,
			serviceType:serviceType
		};
		SEQAjax(pageConfig.ajaxUrl.Export, paramstwo, function(data) {
			if(data.statuCode === '200') {
				$("#daochubeijing").css("display","none");
				var  ExportData=ObjCopy(data.data);
				window.open(encodeURI(encodeURI(ExportData.path)));
			}
		});

	});
	
	
	
	//-------------------------------------------------------------------------------
	
	//删除重点SP功能
	$(document).on('mousedown', '.zdsp .media .spcancel', function(e) {
		e.stopPropagation();
		$(document).off("click", ".cc_qr");
		$(document).off("click", ".cc_qx");
		$(document).off("click", ".cc_canclebox");
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#cancle_choose").addClass("cancle_choose").addClass("spcancle_choose");
		$(this).parent().addClass("cancelbox");
		var _that = this;
		var myspData = [];
		var spdata_i = {};
		$(this).parent().parent().siblings().each(function(i, v) {
			spdata_i.spCode = v.dataset.id;
			spdata_i.spName = $(v).find(".mediaName").find("p").text();
			myspData.push(ObjCopy(spdata_i));
		});
		
		//确定删除SP
		$(document).on("click",".cc_qr", function() {
			$(_that).parent().parent().remove();
			$('.zdsp .media ul li').removeClass().addClass(`li_${$('.zdsp .media ul').children().length}`);
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			SEQAjax(pageConfig.ajaxUrl.keySpShowConfig, {"data":JSON.stringify(myspData)}, function(data) {
				if(data.statuCode === '200') {
					setSpUserNum(data);
				}
			});
			if($(".media>ul").children().length===0){
				$("#spadd>div").addClass("delzero");
				$("#spadd").addClass("addboxwid");
			}else{
				$("#spadd>div").removeClass("delzero");
				$("#spadd").removeClass("addboxwid");
			}
		});
		
		//取消删除SP
		$(document).on("click",".cc_qx", function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_that).parent().removeClass("cancelbox");
		});
		$(document).on("click", ".cc_canclebox", function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_that).parent().removeClass("cancelbox");
		});
	});
	

	//增加重点SP功能
	$(document).on('mousedown', '.zdsp .media #spadd', function(e) {
		e.stopPropagation();
		$(".add_spcls").html("");
		$("#sprightname").val("");
		//请求SP选择数据
		SEQAjax(pageConfig.ajaxUrl.keySceneProtocalUserNum, {}, function(data) {
			if (data.statuCode === '200') {
				setChildProtocalUserNum(data);
				$("#spleftname").text(myspdata[0].bigSpName);
			}
		});

		//默认显示SP
		$(".spcontainerone").hide();
		$(".spcontainertwo").hide();
		if($(".media>ul").children().length === 0){
			$(this).addClass("add_activezero");
		}else{
			$(this).addClass("add_active");
		}
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#spadd_choose").addClass("spadd_choose");
	});
	//SP类型下拉框
	$(document).on("click", ".add_sppicone",function(e) {
		e.stopPropagation();
		$(".spcontainerone").stop(true, true).slideToggle();
		if(myspdata.length>5){
			$(".spscrollboxone").removeClass("lessfive");
			$('.spcontainerone .spscrollone .spscrollboxone').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$(".spscrollboxtwo .scroll_container").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
		}
		$('.spcontainertwo').hide();
	});
	//SP下拉框
	$(document).on("click",".add_sppictwo", function(e) {
		e.stopPropagation();
		$(".spcontainertwo").stop(true, true).slideToggle();
		if($(".add_spclsdd").children().length>5){
			$(".spscrollboxtwo").css("height","1rem");
			$(".spscrollboxtwo").removeClass("lessfive");
			$(".add_spclsdd").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".spscrollboxtwo").addClass("lessfive");
			$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		}
		$('.spcontainerone').hide();
	});
	//SP类型下拉框选项选择
	$(document).on("mouseenter",".add_spcls>li",function(){
		$(this).addClass("everyli");
	});
	$(document).on("mouseleave",".add_spcls>li",function(){
		$(this).removeClass("everyli");
	});
	$(document).on("mousedown",".add_spcls>li",function(e){
		e.stopPropagation();
		$("#spleftname").text($(this).text());
		$(".spcontainerone").hide();
		$("#sprightname").val("");
		$(".add_spclsdd").html("");
		setChildProtocalData(myspdata,$(this).text());
		$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
		if($(".add_spclsdd").children().length>5){
			$(".spscrollboxtwo").css("height","1rem");
			$(".add_spclsdd").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		}else{
			$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$(".spscrollboxtwo .scroll_container").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
		}
	
	});
	//SP类型中SP下拉框选项选择
	var spname;
	var spcode;
	var myspData = [];
	var spdata_i = {};
	var addspdata = {};
	$(document).on("mouseenter",".add_spclsdd>li",function(){
		$(this).addClass("everyli");
	});
	$(document).on("mouseleave",".add_spclsdd>li",function(){
		$(this).removeClass("everyli");
	});
	$(document).on("mousedown",".add_spclsdd>li",function(e){
		e.stopPropagation();
		$("#sprightname").val($(this).text());
		$(".spcontainertwo").hide();
	});
	//确定增加SP
	$(".spadd_qr").on("mousedown", function(e) {
		myspData=[];
		e.stopPropagation();
		spname=$("#sprightname").val();
		myspdata.forEach(function(v, i) {
			if(v.bigSpName === $("#spleftname").text()) {
				for(var index = 0; index < v.spList.length; index++) {
					if(v.spList[index].spName===spname){
						spcode=v.spList[index].spCode;
						$("#spadd").siblings().children().each(function(i, v) {
							spdata_i.spCode = v.dataset.id;
							spdata_i.spName = $(v).find(".mediaName").find("p").text();
							myspData.push(ObjCopy(spdata_i));
						});
						addspdata.spCode = spcode;
						addspdata.spName = spname;
						myspData.push(ObjCopy(addspdata));
						$("#sprightname").val("");
						SEQAjax(pageConfig.ajaxUrl.keySpShowConfig, {"data":JSON.stringify(myspData)}, function(data) {
							if(data.statuCode === '200') {
								setSpUserNum(data);
							}
						});
						break;
					}
				}
			}
		});
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#spadd_choose").removeClass("spadd_choose");
		$("#spadd").removeClass("add_active").removeClass("add_activezero");
		if($(".media>ul").children().length===0){
			$("#spadd>div").addClass("delzero");
			$("#spadd").addClass("addboxwid");
		}else{
			$("#spadd>div").removeClass("delzero");
			$("#spadd").removeClass("addboxwid");
		}
	});
	//取消增加SP
	$(document).on("mousedown",".spadd_qx", function(e) {
		e.stopPropagation();
		$("#sprightname").val("");
		$(".add_spclsdd,.add_spcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#spadd_choose").removeClass("spadd_choose");
		$("#spadd").removeClass("add_active").removeClass("add_activezero");
	});
	$(document).on("mousedown", ".spadd_canclebox",function(e) {
		e.stopPropagation();
		$("#sprightname").val("");
		$(".add_spclsdd,.add_spcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#spadd_choose").removeClass("spadd_choose");
		$("#spadd").removeClass("add_active").removeClass("add_activezero");
	});
	
	//搜索SP功能
	$(document).on("keyup","#sprightname",function(){
		$(".add_spclsdd").html("");
		if($("#sprightname").val() != null){
			setChildProtocalDataSearch(myspdata,$("#spleftname").text(),$(this).val());
			
			$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			if($(".add_spclsdd").children().length>5){
				$(".spscrollboxtwo").css("height","1rem");
			}else{
				$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
				$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
			}
		}else{
			setChildProtocalData(myspdata,$("#spleftname").text());
		}
	});
	
	//SP得焦显示下拉框,失焦隐藏
	$(document).on("focus","#sprightname",function(e){
		e.stopPropagation();
		$(".spcontainertwo").stop(true, true).slideToggle();
		if($(".add_spclsdd").children().length>5){
			$(".spscrollboxtwo").css("height","1rem");
			$(".spscrollboxtwo").removeClass("lessfive");
			$(".add_spclsdd").css("height",$(".add_spclsdd").children().length*0.2+"rem");
			$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
		}else {
			$(".spscrollboxtwo").addClass("lessfive");
			$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		}
		$('.spcontainerone').hide();
		$(".spcontainertwo").show();
	});
	$(document).on('click', '#sprightname', function(e) {
		e.stopPropagation();
	});
	$(document).on('click', '.cancle_shaow, .spadd_choose', function() {
		$('.spcontainertwo').hide();
		$('.spcontainerone').hide();
	});
}

//-----------------------------------------------------------------

var startDom = $("#startTime");
var endDom = $("#endTime");
var initalOption= {
	start: {
		"minDate": new Date(new Date(moment()._d.toLocaleDateString()).getTime()-24*3600*1000*8),
		"maxDate": moment().subtract(60,"minute"),
		"singleDatePicker": true,
		"showDropdowns": true,
		"timePicker": true,
		"timePickerIncrement": 15,
		"locale": {
			format: 'YYYY-MM-DD  HH:mm'
		}
	},
	end: {
		"minDate": new Date(new Date(moment()._d.toLocaleDateString()).getTime()-24*3600*1000*8+900*1000),
		"maxDate": moment().subtract(45,"minute"),
		"singleDatePicker": true,
		"timePicker": true,
		"showDropdowns": true,
		"timePickerIncrement": 15,
		"locale": {
			format: 'YYYY-MM-DD  HH:mm'
		}
	}

};


timeGran();

//初始化时间
function timeGran(){
	initialDate(startDom,endDom);
}
//初始开始时间
function initialDate(startDom,endDom){

	startDom.daterangepicker(initalOption.start,startChosen);

	endDom.daterangepicker(initalOption.end,endChosen);
	
}

//手动设置开始时间
function startChosen(start, end, label){
	
	//改变endDOM的范围
	initalOption.end.minDate = start.format("YYYY-MM-DD HH:mm");
	endDom.daterangepicker(initalOption.end,endChosen);
}

//手动设置结束时间
function endChosen(start, end, label){

	//改变startDOM的范围
	initalOption.start.maxDate = end.subtract(15,"minute").format("YYYY-MM-DD HH:mm")
	startDom.daterangepicker(initalOption.start,startChosen);
}





//------------------------------------------------------------------------------
/**
 * 渲染折线图
 * @param {String} type 刷新折线图类型（'2/3/4G'）
 * @param {Object} data 需要渲染的数据
 */
function SetLineOption(type, data) {
	if(!data.length) {
		return;
	}
	var option = ObjCopy(line_option);
	var time_data = ['23:30','23:45','00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15']
	var user_data = [];
	var up_or_down = 0;
	var line = null;
	var _dom = null;
	data.forEach(function(v, i) {
//		time_data.push(new Date(v.startTime * 1000 + 900000).format('hh:mm', 0));
		user_data.push(v.value);
	});
	
	if(data.length < 96) {
		var temp = new Array(96 - data.length);
		for(var i = 0; i < 96 - data.length; i++) {
			temp[i] = '';
		}
//		time_data = time_data.concat(temp);
		user_data = user_data.concat(temp);
	}
	
	option.xAxis[0].data = time_data;
	option.series[0].data = user_data;
	switch(type) {
		case '2G':
			option.series[0].lineStyle.normal.color = 'rgba(141, 94, 158, 0.8)';
			option.xAxis[0].axisLine.lineStyle.color = 'rgba(141, 94, 158, 0.8)';
			option.xAxis[0].axisTick.lineStyle.color = 'rgba(72, 69, 93, 0.8)';
			option.xAxis[0].axisLabel.textStyle.color = 'rgba(72, 69, 93, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(141, 94, 158, 0.3)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(141, 94, 158, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user2')[0]);
			_dom = $('.user_violet > .font_chart');
			break;
		case '3G':
			option.series[0].lineStyle.normal.color = 'rgba(81, 145, 199, 0.8)';
			option.xAxis[0].axisLine.lineStyle.color = 'rgba(81, 145, 199, 0.8)';
			option.xAxis[0].axisTick.lineStyle.color = 'rgba(59, 108, 133, 0.8)';
			option.xAxis[0].axisLabel.textStyle.color = 'rgba(59, 108, 133, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(81, 145, 199, 0.3)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(81, 145, 199, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user3')[0]);
			_dom = $('.user_blue > .font_chart');
			break;
		case '4G':
			option.series[0].lineStyle.normal.color = 'rgba(82, 199, 172, 0.8)';
			option.xAxis[0].axisLine.lineStyle.color = 'rgba(82, 199, 172, 0.8)';
			option.xAxis[0].axisTick.lineStyle.color = 'rgba(58, 131, 117, 0.8)';
			option.xAxis[0].axisLabel.textStyle.color = 'rgba(58, 131, 117, 0.8)';
			option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(82, 199, 172, 0.3)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(82, 199, 172, 0.1)' // 100% 处的颜色
			}], false);
			line = echarts.init(document.getElementsByClassName('user4')[0]);
			_dom = $('.user_green > .font_chart');
			break;
		default:
			console.error('SetLineOption params is error!');
			break;
	}
	_dom.find('font').text(formatNumber(data[data.length - 1].value));
	_dom.find('span').removeClass('up').removeClass('down');
	if(data.length <= 1 || data[data.length - 2].value == 0) {
		up_or_down = 0;
		_dom.find('span').addClass('up');
	} else if(data[data.length - 1].value >= data[data.length - 2].value) {
		up_or_down = round((data[data.length - 1].value - data[data.length - 2].value) / data[data.length - 2].value * 100, 2);
		_dom.find('span').addClass('up');
	} else {
		up_or_down = round((data[data.length - 2].value - data[data.length - 1].value) / data[data.length - 2].value * 100, 2);
		_dom.find('span').addClass('down');
	}
	_dom.find('span').html(`<i></i>${up_or_down}%`);
	option.tooltip.formatter = function(params) {
		if(params[0].data !== '') {
			return `${params[0].name}<br/>${formatNumber(params[0].data)}人`;
		}
	}
	line.setOption(option, true);
}

/**
 * 渲染折线图
 * @param {String} type 刷新折线图类型（'2/3/4G'）
 * @param {Object} data 需要渲染的数据
 */
function SetFlowerOption(type, data) {
	if(!data.length) {
		return;
	}
	var option = ObjCopy(line_option);
	var time_data = ['23:30','23:45','00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15'];
	var user_data = [];
	var up_or_down = 0;
	var line = null;
	var _dom = null;
	data.forEach(function(v, i) {
//		time_data.push(new Date(v.startTime * 1000 + 900000).format('hh:mm', 0));
		user_data.push(v.value);
	});
	if(data.length < 96) {
		var temp = new Array(96 - data.length);
		for(var i = 0; i < 96 - data.length; i++) {
			temp[i] = '';
		}
//		time_data = time_data.concat(temp);
		user_data = user_data.concat(temp);
	}
	option.xAxis[0].data = time_data;
	option.series[0].data = user_data;

	switch(type) {
		case '4G':
			line = echarts.init(document.getElementsByClassName('flower4')[0]);
			_dom = $('.flower_first > .font_chart');
			break;
		case '3G':
			line = echarts.init(document.getElementsByClassName('flower3')[0]);
			_dom = $('.flower_last > .font_chart');
			break;
		default:
			console.error('SetLineOption params is error!');
			break;
	}
	option.series[0].lineStyle.normal.color = 'rgba(67, 168, 161, 0.8)';
	option.xAxis[0].axisLine.lineStyle.color = 'rgba(67, 168, 161, 0.8)';
	option.xAxis[0].axisTick.lineStyle.color = 'rgba(42, 77, 73, 0.8)';
	option.xAxis[0].axisLabel.textStyle.color = 'rgba(42, 77, 73, 0.8)';
	option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.3)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0.1)' // 100% 处的颜色
	}], false);
	option.grid.right = 0.3 * REM;
	_dom.find('font').text(data[data.length - 1].value.toFixed(2));
	_dom.find('span').removeClass('up').removeClass('down');
	if(data.length <= 1 || data[data.length - 2].value == 0) {
		_dom.find('span').addClass('up');
		_dom.find('span').html(`<i></i>0%`);
	} else if(data[data.length - 1].value >= data[data.length - 2].value) {
		up_or_down = round((data[data.length - 1].value - data[data.length - 2].value) / data[data.length - 2].value * 100, 2);
		_dom.find('span').addClass('up');
		_dom.find('span').html(`<i></i>${up_or_down}%`);
	} else {
		up_or_down = round((data[data.length - 2].value - data[data.length - 1].value) / data[data.length - 2].value * 100, 2);
		_dom.find('span').addClass('down');
		_dom.find('span').html(`<i></i>${up_or_down}%`);
	}
	option.tooltip.formatter = function(params) {
		if(params[0].data !== '') {
			var gbnum=round(params[0].data, 2).toFixed(2);
			return `${params[0].name}<br/>${formatNumber(gbnum)}GB`;
		}
	}
	line.setOption(option, true);
}

/**
 * 渲染底部折线图
 * @param {Object} data 需要渲染的数据
 */
function SetBottomOption(lx,data) {
	$('.foot_line').removeClass('line_show');
	//重置折线图
	$('.data_line').html('');
	$(".line_name").text("");
	$(".line_last").text("");
	$(".line_grade").text("");
	$(".foot_line .up").text("");
	$(".foot_line .down").html("");
	$(".foot_line .font_chart_up_down").html("");
	data[lx].data.forEach(function(v, i) {
		if(v.describle === "3G流量驻留比(%)" || v.describle === " 4G流量驻留比(%)"){
			var g_dom = $('.foot_line').eq(i);
			var g_option = ObjCopy(line_option);
			var g_up_or_down = 0;
			var g_user_data = [];
			var g_time_data = [];
			var g_data_arr = v.kqiArray;
			var g_line = echarts.init(document.getElementsByClassName('data_line')[i]); //循环初始化各位置
			g_option.series[0].lineStyle.normal.color = 'rgba(67, 168, 161, 0.8)';
			g_option.xAxis[0].axisLine.lineStyle.color = 'rgba(67, 168, 161, 0.8)';
			g_option.xAxis[0].axisTick.lineStyle.color = 'rgba(42, 77, 73, 0.8)';
			g_option.xAxis[0].axisLabel.textStyle.color = 'rgba(42, 77, 73, 0.8)';
			g_option.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				offset: 0,
				color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
			}], false);
			g_data_arr.forEach(function(vv, ii) {
				g_user_data.push(vv.value);
				g_time_data.push(vv.startTime);
			})
			
			for(var j=0;j<30;j++){
				var timestamp3 = g_time_data[j];  
				var newDate = new Date();  
				newDate.setTime(timestamp3 * 1000); 
				g_time_data[j] = newDate.toLocaleDateString().substring(newDate.toLocaleDateString().indexOf("/")+1);
			}
			g_option.xAxis[0].data = g_time_data;
			g_option.series[0].data = g_user_data;
			g_option.xAxis[0].axisLabel.textStyle.fontSize = '7';
			g_option.xAxis[0].axisTick.interval = function(index,string){
				if(index === 0 || (index % 5 === 0) || index === 29){
					return true; 
				}else{
					return false;
				}
			}
			g_option.xAxis[0].axisLabel.interval = function(index,string){
				if(index === 0 || (index % 5 === 0) || index === 29){
					return true; 
				}else{
					return false;
				}
			}
			g_option.grid.top = 0.5 * REM;
			g_option.grid.bottom = -5;
			g_dom.addClass('line_show');
			g_dom.find('.line_name').text(v.describle.replace(/\(.*?\)/g,""));
			g_dom.find('.line_name').text(v.describle);
			g_option.tooltip.formatter = function(params) {
				if(params[0].data !== '') {
					return `${params[0].name}<br/>${formatNumber(params[0].data.toFixed(2))}%`;
				}
			}
			g_line.setOption(g_option, true);
			g_dom.find('.line_last').text((+v.kqiArray[v.kqiArray.length - 1].value).toFixed(2));
			var g_grade = null;
			switch(g_data_arr[g_data_arr.length - 1].thresholdStatu) {
				case 0:
					g_grade = '优';
					break;
				case 1:
					g_grade = '良';
					break;
				case 2:
					g_grade = '中';
					break;
				case 3:
					g_grade = '差';
					break;
				default:
					break;
			}
			g_dom.find('.line_last').removeClass().addClass('line_last').addClass(`g_grade${v.kqiArray[v.kqiArray.length - 1].thresholdStatu}`);
			g_dom.find('.line_grade').text(g_grade);
			if(g_data_arr.length <= 1 || g_data_arr[g_data_arr.length - 2].value == 0) {
				g_up_or_down = 0;
				if(!data[lx].data[i].kqiConf.desc){
					g_dom.find('.font_chart_up_down').addClass('up');
				}else{
					g_dom.find('.font_chart_up_down').addClass('up_o');
				}
			} else if(g_data_arr[g_data_arr.length - 1].value >= g_data_arr[g_data_arr.length - 2].value) {
				g_up_or_down = round((g_data_arr[g_data_arr.length - 1].value - g_data_arr[g_data_arr.length - 2].value) / g_data_arr[g_data_arr.length - 2].value * 100, 2);
				if(!data[lx].data[i].kqiConf.desc){
					g_dom.find('.font_chart_up_down').addClass('up');
				}else{
					g_dom.find('.font_chart_up_down').addClass('up_o');
				}
			} else {
				g_up_or_down = round((g_data_arr[g_data_arr.length - 2].value - g_data_arr[g_data_arr.length - 1].value) / g_data_arr[g_data_arr.length - 2].value * 100, 2);
				if(!data[lx].data[i].kqiConf.desc){
					g_dom.find('.font_chart_up_down').addClass('down');
				}else{
					g_dom.find('.font_chart_up_down').addClass('down_o');
				}
			}
			g_dom.find('.font_chart_up_down').html(`<i></i>${formatNumber(round(g_up_or_down))}%`);	
		}else{
			var _dom = $('.foot_line').eq(i);
			var option = ObjCopy(line_option);
			var up_or_down = 0;
			var time_data = ['23:30','23:45','00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15'];
		
			var user_data = [];
			var data_arr = v.kqiArray;
			var unit = null;
			var line = echarts.init(document.getElementsByClassName('data_line')[i]); //循环初始化各位置
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
	//			time_data.push(new Date(vv.startTime * 1000 + 900000).format('hh:mm', 0));
				user_data.push(vv.value);
			})
			if(data_arr.length < 96) {
				var temp = new Array(96 - data_arr.length);
				for(var j = 0; j < 96 - data_arr.length; j++) {
					temp[j] = '';
				}
	//			time_data = time_data.concat(temp);
				user_data = user_data.concat(temp);
			}
			option.xAxis[0].data = time_data;
			option.series[0].data = user_data;
			option.xAxis[0].axisLabel.textStyle.fontSize = '7';
			option.grid.top = 0.5 * REM;
			option.grid.bottom = -5;
			_dom.addClass('line_show');
			_dom.find('.line_name').text(v.describle.replace(/\(.*?\)/g,""));
			_dom.find('.line_name').text(v.describle);
			if(/频次/.test(v.describle)) {
				unit = '次/分';
			} else if(/[时延|时长]/.test(v.describle)) {
				unit = 'ms';
			} else if(/速率/.test(v.describle)) {
				unit = 'Kbps';
			} else if(/吞吐率/.test(v.describle)) {
				unit = 'Mbps';
			} else {
				unit = '%';
			}
			option.tooltip.formatter = function(params) {
				if(params[0].data !== '') {
					return `${params[0].name}<br/>${formatNumber(params[0].data.toFixed(2))}${unit}`;
				}
			}
			line.setOption(option, true);
	//		_dom.find('.line_last').text(v.kqiArray[v.kqiArray.length - 1].value + unit);
			_dom.find('.line_last').text((+v.kqiArray[v.kqiArray.length - 1].value).toFixed(2));
			var grade = null;
			switch(data_arr[data_arr.length - 1].thresholdStatu) {
				case 0:
					grade = '优';
					break;
				case 1:
					grade = '良';
					break;
				case 2:
					grade = '中';
					break;
				case 3:
					grade = '差';
					break;
				default:
					break;
			}
			_dom.find('.line_last').removeClass().addClass('line_last').addClass(`grade${v.kqiArray[v.kqiArray.length - 1].thresholdStatu}`);
			_dom.find('.line_grade').text(grade);
			if(data_arr.length <= 1 || data_arr[data_arr.length - 2].value == 0) {
				up_or_down = 0;
				if(!data[lx].data[i].kqiConf.desc){
					_dom.find('.font_chart_up_down').addClass('up');
				}else{
					_dom.find('.font_chart_up_down').addClass('up_o');
				}
			} else if(data_arr[data_arr.length - 1].value >= data_arr[data_arr.length - 2].value) {
				up_or_down = round((data_arr[data_arr.length - 1].value - data_arr[data_arr.length - 2].value) / data_arr[data_arr.length - 2].value * 100, 2);
				if(!data[lx].data[i].kqiConf.desc){
					_dom.find('.font_chart_up_down').addClass('up');
				}else{
					_dom.find('.font_chart_up_down').addClass('up_o');
				}
			} else {
				up_or_down = round((data_arr[data_arr.length - 2].value - data_arr[data_arr.length - 1].value) / data_arr[data_arr.length - 2].value * 100, 2);
				if(!data[lx].data[i].kqiConf.desc){
					_dom.find('.font_chart_up_down').addClass('down');
				}else{
					_dom.find('.font_chart_up_down').addClass('down_o');
				}
			}
			_dom.find('.font_chart_up_down').html(`<i></i>${formatNumber(round(up_or_down))}%`);	
		}	
	});
}









/**
 * 渲染饼状图
 */
function SetPieOption() {
	var pie = echarts.init(document.getElementsByClassName('user_pie')[0]);
	var num_option = ObjCopy(pie_option);
	num_option.series[0].data = active_user_num;
	num_option.series[0].label.normal.show = true;
	num_option.series[0].labelLine.normal.show = true;
	num_option.series[0].minAngle = 0;
	pie.setOption(num_option, true);

//	pie_option.series[0].data = active_user_num;
//	var pie = echarts.init(document.getElementsByClassName('user_pie')[0]);
//	pie.setOption(pie_option, true);
}

/**
 * 环形进度条渲染
 * @param {Object} index 当前渲染环形进度条index
 * @param {Object} data	渲染数据
 */
function SetACircle(index, data) {
	circle_init = [];
	circle_init2 = [];
	$(".circle_out").eq(index).html("");
	$(".circle_main").eq(index).html("");
	$(".circle_main2").eq(index).html("");
	var _this_color = ObjCopy(bar_color.concat([]));
	var _dom = $('.front_main').eq(index);
	var grade = '';
	var grade_num = data.kqiArray[data.kqiArray.length-1].value / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75;
	if(!circle_init[index]) {
		circle_init[index] = _dom.find('.circle_main').radialIndicator({
			radius: 0.75 * REM,
			barWidth: 0.22 * REM,
			roundCorner: true,
			initValue: 75,
			maxValue: 100,
			displayNumber: false,
			barBgColor: 'transparent',
			barColor: '#202b2d'
		}).data('radialIndicator');
	} else {
		circle_init[index].animate(75);
	}
	_dom.find('h4').text(data.describle);
	_dom.find('.circle_data .font_chart').text((+data.kqiArray[data.kqiArray.length-1].value).toFixed(2));
	switch(true) {
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[4]:
			if(data.kqiConf.desc) {
				grade = '差';
				_dom.find('.circle_data .font_chart').css("color","#bc5449");
			}else{
				grade = '优';
				_dom.find('.circle_data .font_chart').css("color","#2fc085");
			}
//			grade_num = 75;
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[3]:
			if(data.kqiConf.desc) {
				grade = '差';
				_dom.find('.circle_data .font_chart').css("color","#bc5449");
			}else{
				grade = '优';
				_dom.find('.circle_data .font_chart').css("color","#2fc085");
			}
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[2]:
			if(data.kqiConf.desc) {
				grade = '中';
				_dom.find('.circle_data .font_chart').css("color","#bcb849");
			}else{
				grade = '良';
				_dom.find('.circle_data .font_chart').css("color","#4b86b7");
			}
			break;
		case data.kqiArray[data.kqiArray.length-1].value >= data.kqiConf.threshold[1]:
			if(data.kqiConf.desc) {
				grade = '良';
				_dom.find('.circle_data .font_chart').css("color","#4b86b7");
			}else{
				grade = '中';
				_dom.find('.circle_data .font_chart').css("color","#bcb849");
			}
			break;
		default:
			if(data.kqiConf.desc) {
				grade = '优';
				_dom.find('.circle_data .font_chart').css("color","#2fc085");
			}else{
				grade = '差';
				_dom.find('.circle_data .font_chart').css("color","#bc5449");
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
	if(+grade_num >= +num3 && +grade_num <=  Math.ceil(num3)) {
		grade_num = Math.ceil(grade_num);
	} else if(+grade_num >= +num2 && +grade_num <=  Math.ceil(num2)) {
		grade_num = Math.ceil(grade_num);
	} else if(+grade_num >= +num1 && +grade_num <=  Math.ceil(num1)) {
		grade_num = Math.ceil(grade_num);
	}
	colors = JSON.parse(colors);
	if(!circle_init2[index]) {
		circle_init2[index] = _dom.find('.circle_main2').radialIndicator({
			radius: 0.75 * REM,
			barWidth: 0.22 * REM,
			roundCorner: true,
			initValue: grade_num,
			maxValue: 100,
			displayNumber: false,
			barBgColor: 'transparent',
			barColor: colors
		}).data('radialIndicator');
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
	_out_option.title.show = false;
	_out_option.tooltip.show = false;
	_out_option.series[0].itemStyle.normal.borderWidth = 0.015 * REM;
	_out_option.series[0].radius = ['95%', '100%'];
	_out_option.series[0].center = ['50%', '50%'];
	_out_option.color = _this_color.concat(['transparent']);
	_out_option.series[0].data = [];
	data.kqiConf.threshold.forEach(function(v, i) {
		if(i) {
			_out_option.series[0].data.push((v - data.kqiConf.threshold[i - 1]) / (data.kqiConf.threshold[4] - data.kqiConf.threshold[0]) * 75);
		} else {
			return;
		}
	});
	_out_option.series[0].data.push({value: 25, itemStyle: {normal: {borderColor: 'transparent'}}});
	_circle_out.setOption(_out_option, true);


	//环形图下趋势图
	var option = ObjCopy(line_option);
	var time_data = ['23:30','23:45','00:00','00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15'];

	var user_data = [];
	var data_arr = data.kqiArray;
	var unit = null;
	var line = echarts.init(document.getElementsByClassName('indexquxian')[index]);
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
	option.grid.top = 0.5 * REM;
	option.grid.bottom = -5;
	if(/频次/.test(data.describle)) {
		unit = '次/分';
	} else if(/[时延|时长]/.test(data.describle)) {
		unit = 'ms';
	} else if(/速率/.test(data.describle)) {
		unit = 'Kbps';
	} else if(/吞吐率/.test(data.describle)) {
		unit = 'Mbps';
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
 * 展示a面受影响用户数
 * @param {Object} index 需要展示的index
 * @param {Object} data 需要展示的data
 */
function SetAffectedUserNum(index, data) {
	
	$('.front_bot_l p').eq(index).text(data.value);
	$('.back').eq(index).find('.userCount > span').text(data.value);

	var _dom = $('.front_bot_r ul').eq(index);
	var data_arr = [];
	data_arr.push(data.workOrder.processing);
	data_arr.push(data.workOrder.fixed);
	$('.back').eq(index).find('.processing > span').text(data_arr[0]);
	$('.back').eq(index).find('.bnsRepaire > span').text(data_arr[1]);
	_dom.find('li font').each(function(i, v) {
		$(v).text(data_arr[i]);
	})
	if(data_arr[0] == 0){
		_dom.find('li').eq(0).find('span').css('width', '0.955rem');
	}
	if(data_arr[1] == 0){
		_dom.find('li').eq(1).find('span').css('width', '0.955rem');
	}
	if(data_arr[0] > data_arr[1]) {
		_dom.find('li').eq(1).find('span').css('width', 0.955 * data_arr[1] / data_arr[0] + 'rem');
	} else if(data_arr[0] < data_arr[1]){
		_dom.find('li').eq(0).find('span').css('width', 0.955 * data_arr[0] / data_arr[1] + 'rem');
	}
}

//B面

/**
 * 设置B面大场景用户数
 * @param {Object} data 用户数数据
 */
function setSceneUserNum(data) {
	$('.itemDetail > ul').html('');
	var onesortdata = data.data.sort(sortby("userNum"));
	onesortdata.forEach(function(v, i) {
		var temp = `<li>
			<ul>
				<li class="placeIcon" style="background-image: url(${basePath + "../pages/imgs/icons/" + v.icon})"></li>
				<li class="placePercent">
					<p><span>${v.sceneName}</span></p>
					<div class="percent">
						<div class="totalCount">
							<p class="actualCount" style="width: ${Number(v.workOrder.processing) / ((Number(v.workOrder.processing) + Number(v.workOrder.fixed) || 1)) * 100}%"></p>
						</div>
						<p><span>${v.workOrder.processing}</span>&nbsp;/&nbsp;<span>${v.workOrder.fixed}</span></p>
					</div>
					<div class="userCount">
						<p>
							<i></i>
							<span>${v.userNum}</span>
						</p>
					</div>
				</li>
			</ul>
		</li>`;
		$('.itemDetail > ul').append($(temp));
	});
	$('.zdcj .itemDetail .itemDetailUl').css('height', Math.round(data.data.length / 2) * 1.09 - 0.4 + 'rem');
	$('.cityMainPlace').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20,
		verticalDragMaxHeight: 1.2 * REM,
		verticalDragMinHeight: 1.2 * REM
	});
	$('.cityMainPlace .scroll_vertical_bar .scroll_drag').html(`共${data.data.length}类`);
	$('.cityMainPlace .scroll_vertical_bar .scroll_drag').css('padding', '0.4rem 0.05rem');
}

/**
 * 设置B面子场景用户数
 * @param {Object} data 子场景用户数数据
 */
function setChildSceneUserNum(data) {
	$('.station > ul').html('');
	var twosortdata = data.data.sort(sortby("userNum"));
	twosortdata.forEach(function(v, i) {
		var temp = `<li data-id="${v.areaCode}" class="cjli_${data.data.length}" data-shuyu="${v.belongTo}">
			<div><b class="cancel"></b></div>
			<div class="stationDetail">
				<div class="stationName">
					<i></i>
					<b style="background-image: url(${basePath}../pages/imgs/icons/${v.icon})" class="cjb_${data.data.length}"></b>
					<p>${v.sceneName}</p>
				</div>
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount" style="width: ${v.workOrder['processing'] / (Number(v.workOrder['fixed']) + Number(v.workOrder['processing'])) * 100}%"></p>
					</div>

					<p><span>${v.workOrder['processing']}</span>&nbsp;/&nbsp;<span>${v.workOrder['fixed']}</span></p>
				</div>
				<div class="userCount">
					<p>
						<i></i>
						<span>${v.userNum}</span>
					</p>
				</div>
			</div>
		</li>`;
		$('.station > ul').append($(temp));
	});
	$("#cjadd").addClass(`cjaddMore_${data.data.length}`);
	$(".cjli_4").parent().next().hide();
	$(".cjli_3,.cjli_2,.cjli_1,.cjli_0").parent().next().show();
	if($(".station>ul").children().length===0){
		$("#cjadd>div").addClass("delzero");
		$("#cjadd").addClass("addboxwid");
	}else{
		$("#cjadd>div").removeClass("delzero");
		$("#cjadd").removeClass("addboxwid");
	}
}

/**
 * 设置B面场景选择
 * @param {Object} data 场景选择
 */
function setCustomAreaShowQuery(data){
	mydata = ObjCopy(data.data);
	data.data.forEach(function(v, i){
		var tempone=`<li>${v.sceneName}</li>`;
		$(".add_cjcls").append($(tempone));
	});
	var temptwo;
	setChildAreaData(mydata, data.data[0].sceneName);
}

//定义场景选择函数
function setChildAreaData (mydata, name){
	$(".add_cjclsdd").html("");
	var show_list = [];
	$('.station ul li').each(function(i, v) {
		show_list.push($(v).attr('data-id'));
	});
	mydata.forEach(function(v, i) {
		if(v.sceneName === name) {
			v.customAreas.forEach(function(value, index) {
				var bool = false;
				show_list.forEach(function(vv, ii) {
					if(vv == value.areaCode) {
						bool = true;
					}
				});
				if(bool) {
					return;
				}
				temptwo=`<li data-code="${value.areaCode}">${value.areaName}</li>`;
				$(".add_cjclsdd").append($(temptwo));
			});
			return;
		}
	});
	
	if($(".add_cjclsdd").children().length > 5){
		$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}else{
		$(".scrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".add_cjclsdd").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".containertwo .scroll_vertical_bar .scroll_drag").hide();
	}
	
	if($(".add_cjclsdd").children().length>5){
		$(".scrollboxtwo").css("height","1rem");
	}else{
		$(".scrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".add_cjclsdd").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".containertwo .scroll_vertical_bar .scroll_drag").hide();
	}

};

//定义场景搜索函数
function setChildAreaDataSearch (mydata, name, str){
	mydata.forEach(function(v, i) {
		if(v.sceneName === name) {
			v.customAreas.forEach(function(value, index) {
				if(value.areaName.indexOf(str) != -1){
					tempthree=`<li>${value.areaName}</li>`;
					$(".add_cjclsdd").append($(tempthree));
				}
			});
		}
	});
	$('.containertwo .scrolltwo .scrollboxtwo').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20
	});
	$(".scrollboxtwo").addClass("lessfive");
	if($(".add_cjclsdd").children().length>5){
		$(".scrollboxtwo").css("height","1rem");
	}else{
		$(".scrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".containertwo .scroll_vertical_bar .scroll_drag").hide();
	}
};

//设置B面SP
function setChildProtocalUserNum(data){
	myspdata = ObjCopy(data.data);
	data.data.forEach(function(v, i){
		var tempone=`<li>${v.bigSpName}</li>`;
		$(".add_spcls").append($(tempone));
	});
	var temptwo;
	setChildProtocalData(myspdata, data.data[0].bigSpName);
}

//定义SP选择函数
function setChildProtocalData (myspdata, name){
	$(".add_spclsdd").html("");
	var show_list = [];
	$('.media ul li').each(function(i, v) {
		show_list.push($(v).attr('data-id'));
	});
	myspdata.forEach(function(v, i) {
		if(v.bigSpName === name) {
			v.spList.forEach(function(value, index) {
				var bool = false;
				show_list.forEach(function(vv, ii) {
					if(vv == value.spCode) {
						bool = true;
					}
				});
				if(bool) {
					return;
				}
				temptwo=`<li data-code="${value.spCode}">${value.spName}</li>`;
				$(".add_spclsdd").append($(temptwo));
			});
			return;
		}
	});
	if($(".add_spclsdd").children().length>5){
		$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}else{
		$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		$(".add_spclsdd").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
	}
	
	if($(".add_spclsdd").children().length>5){
		$(".spscrollboxtwo").css("height","1rem");
	}else{
		$(".spscrollboxtwo").css("height",$(".add_cjclsdd").children().length*0.2+"rem");
		$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
	}

};

//定义SP搜索函数
function setChildProtocalDataSearch (myspdata, name, str){
	myspdata.forEach(function(v, i) {
		if(v.bigSpName === name) {
			v.spList.forEach(function(value, index) {
				if(value.spName.indexOf(str) != -1){
					tempthree=`<li>${value.spName}</li>`;
					$(".add_spclsdd").append($(tempthree));
				}
			});
		}
	});
	$('.spcontainertwo .spscrolltwo .spscrollboxtwo').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20
	});
	$(".spscrollboxtwo").addClass("lessfive");
	if($(".add_spclsdd").children().length>5){
		$(".spscrollboxtwo").css("height","1rem");
	}else{
		$(".spscrollboxtwo").css("height",$(".add_spclsdd").children().length*0.2+"rem");
		$(".spcontainertwo .scroll_vertical_bar .scroll_drag").hide();
	}
};


/**
 * 网元TOP3用户数
 * @param {Object} data 网元TOP3用户数数据
 */
function setTop3UserNum(data) {
	$('.zdwy .zdwyTop3> table > tbody').html('');
	data.data.forEach(function(v, i) {
		var temp = `<tr data-type='${v.netElementType}'>
			<td>${v.netElementName}</td>
			<td>
				<p data-name="${v.netElementCode}">
					<i></i>
					<span>${v.userNum}</span>
				</p>
				<!--占比-->
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%"></p>
					</div>

					<p><span>${v.workOrder.processing}</span>&nbsp;/&nbsp;<span>${v.workOrder.fixed}</span></p>
				</div>
			</td>
		</tr>`;
		$('.zdwy .zdwyTop3> table > tbody').append($(temp));
	})
}

/**
 * 设置B面SP用户数
 * @param {Object} data SP用户数数据
 */
function setSpUserNum(data) {
	$('.media > ul').html('');
	var threesortdata = data.data.sort(sortby("userNum"));
	threesortdata.forEach(function(v, i) {
		var temp = `<li data-id="${v.spCode}" class="spli_${data.data.length}">
			<div><b class="spcancel"></b></div>
			<div class="mediaDetail">
				<div class="mediaName">
					<i></i>
					<b style="background-image: url(${v.icon})" class="spb_${data.data.length}"></b>
					<p>${v.spName}</p>
				</div>
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%"></p>
					</div>

					<p><span>${v.workOrder.processing}</span>&nbsp;/&nbsp;<span>${v.workOrder.fixed}</span></p>
				</div>
				<div class="userCount">
					<p>
						<i></i>
						<span>${v.userNum}</span>
					</p>
				</div>

			</div>
		</li>`;
		$('.media > ul').append($(temp));
	});
	$("#spadd").addClass(`spaddMore_${data.data.length}`);
	$(".spli_4").parent().next().hide();
	$(".spli_3,.spli_2,.spli_1,.spli_0").parent().next().show();
	if($(".media>ul").children().length===0){
		$("#spadd>div").addClass("delzero");
		$("#spadd").addClass("addboxwid");
	}else{
		$("#spadd>div").removeClass("delzero");
		$("#spadd").removeClass("addboxwid");
	}
}

/**
 * 协议小类用户数
 * @param {Object} data 协议小类用户数
 */
function setProtocalUserNum(data) {
	var num = 0;
	var sparr=[];
	$('.spDetail > ul').html('');
	
	data.data.forEach(function(v, i) {
		v.spList.forEach(function(value, index) {
			sparr.push(value);
		});
	});
	sparr.sort(sortby("userNum"));
	sparr.forEach(function(ele, idx) {
		var temp = `<li data-id="${ele.spCode}" class="zdsp">
			<span class="newsIcon">
				<i style="background-image: url(${ele.icon})"></i>
			</span>
			<div class="placePercent">
				<p>${ele.spName}</p>
				<div class="percent">
					<div class="totalCount">
						<p class="actualCount" style="width: ${Number(ele.workOrder.processing) / (Number(ele.workOrder.processing) + Number(ele.workOrder.fixed)) * 100}%"></p>
					</div>

					<p><span>${ele.workOrder.processing}</span>&nbsp;/&nbsp;<span>${ele.workOrder.fixed}</span></p>
				</div>
				<div class="userCount">
					<p>
						<i></i>
						<span>${ele.userNum}</span>
					</p>
				</div>
			</div>
		</li>`;
		$('.spDetail > ul').append(temp);
		num++;
	});

//	$('.zdsp .spDetail').css('height', ($('.zdsp .spDetail> ul').height() / REM)*0.6 - 0.4 + 'rem');
	$('.zdsp .spDetail').css("height",Math.ceil($('.zdsp .spDetail> ul').children().length / 2)*1.04 +"rem");
	$('.zdsp .spDetail> ul').css("height",Math.ceil($('.zdsp .spDetail> ul').children().length / 2)*1.04 +"rem");
	$('.mainVedio').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20,
		verticalDragMaxHeight: 1.2 * REM,
		verticalDragMinHeight: 1.2 * REM
	});
	$('.mainVedio .scroll_vertical_bar .scroll_drag').html(`共${num}类`);
	$('.mainVedio .scroll_vertical_bar .scroll_drag').css('padding', '0.4rem 0.05rem');
}

/**
 * 处理动画中显示的告警
 * @param {Object} type 判断告警类型
 * @param {Object} data 告警数据
 */
function setAlarmNum(type, data) {
	var _dom = null;
	switch(type) {
		case 0:
			_dom = $('.all_data');
			break;
		case 1:
			_dom = $('.cj_data');
			break;
		case 2:
			_dom = $('.sp_data');
			break;
		case 3:
			_dom = $('.wy_data');
			break;
		default:
			break;
	}
	if(_dom.hasClass("all_data")){
		_dom.find('span').text(formatNumber(data));
	}else{
		_dom.find('span').text(formatNumber(data));		
	}

}

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

//网元胶囊图渲染
function setaffectedUserAndWorkOrder(data){
	$(".wyjn").html("");
	data.data.forEach(function(v,i){
		if(!(Number(v.workOrder.processing)===0 && Number(v.workOrder.fixed)===0)){
			var tytemp=`<div class="wypercent">
				<div class="wya" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%;"></div>
				<div class="wyb" style="width: ${Number(v.workOrder.fixed) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%;"></div>
			</div>
			<div class="wyc">${v.workOrder.processing}/${v.workOrder.fixed}</div>
			<div class="wyd"></div>
			<div class="wye">${v.userNum}</div>`
			$(".wyjnbox_"+v.netMetaData).append($(tytemp));
		}else{
			var tytemp=`<div class="wypercent">
				<div class="wya" style="width: 50%;"></div>
				<div class="wyb" style="width: 50%;"></div>
			</div>
			<div class="wyc">${v.workOrder.processing}/${v.workOrder.fixed}</div>
			<div class="wyd"></div>
			<div class="wye">${v.userNum}</div>`
			$(".wyjnbox_"+v.netMetaData).append($(tytemp));
		}
	});
	
	$(".wyjn").each(function(j,k){
		if($(this).html()){
			
		}else{
			var tytemp=`<div class="wypercent">
				<div class="wya" style="width: 50%;"></div>
				<div class="wyb" style="width: 50%;"></div>
				</div>
				<div class="wyc">0/0</div>
				<div class="wyd"></div>
				<div class="wye">0</div>`
			$(k).append($(tytemp));
		}
	});
}

//页面初始化接口
function PageInit() {
	//舆情数据处理
	SEQAjax(window.pageConfig.ajaxUrl.consensusInformation, {}, function(data) {
		if(data.statuCode === '200') {
			SetConsensusInformation(data);
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeUserNumber, {}, function(data) {
		if(data.statuCode === '200') {
			if(typeof data.data['2G'] != undefined){
				SetLineOption('2G', data.data['2G']);
			}
			if(typeof data.data['3G'] != undefined){
				SetLineOption('3G', data.data['3G']);
			}
			if(typeof data.data['4G'] != undefined){
				SetLineOption('4G', data.data['4G']);
			}
		}
	});
	
	//累计用户数
	SEQAjax(window.pageConfig.ajaxUrl.grantUser, {}, function(data) {
		if(data.statuCode === '200') {
			active_user_num[1] = {value: +data.data.rat2G , name: (+data.data.rat2G/10000).toFixed(2)}
			active_user_num[0] = {value: +data.data.rat3G , name: (+data.data.rat3G/10000).toFixed(2)}
			active_user_num[2] = {value: +data.data.rat4G , name: (+data.data.rat4G/10000).toFixed(2)}
			SetPieOption();
		}
	})
	
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 0
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(0, data.dataall.data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 1
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(1, data.datacj.data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 2
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(2, data.datasp.data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.alarmNum, {
		type: 3
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmNum(3, data.datawy.data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneSpUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setSpUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneProtocalUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setProtocalUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneChildSceneUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setChildSceneUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.netElementTop3UserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setTop3UserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(0, data.data['scene']);
			SetAffectedUserNum(1, data.data['netMeteData']);
			SetAffectedUserNum(2, data.data['sp']);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.keySceneSceneUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setSceneUserNum(data);
		}
	});
	SEQAjax(window.pageConfig.ajaxUrl.activeFlower, {
		ratType: '4'
	}, function(data) {
		if(data.statuCode === '200') {
			SetFlowerOption('4G', data.data4g.data);
		}
	})
	SEQAjax(window.pageConfig.ajaxUrl.activeFlower, {
		ratType: '3'
	}, function(data) {
		if(data.statuCode === '200') {
			SetFlowerOption('3G', data.data3g.data);
		}
	})
	
	//底部指标,哪一个显示请求哪一个
	$("footer").children("ul").children("li").each(function(i,v){
		if(i === 0 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '0'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("allg",data);
				}
			});
		}else if(i === 1 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '4'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("fourg",data);
				}
			});
		}else if(i === 2 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '3'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("threeg",data);
				}
			});
		}
	})
	
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
	SEQAjax(window.pageConfig.ajaxUrl.affectedUserAndWorkOrder, {}, function(data) {
		if(data.statuCode === '200') {
			setaffectedUserAndWorkOrder(data);
		}
	});
	EventBind();
	$(".myqipao").remove();
}

//从配置页面确定返回首页面只重新请求可配置的部分,让从配置界面确定返回后不刷新,且保存之前卡片的记忆状态
function fromSetReturn() {
	//舆情数据处理
	SEQAjax(window.pageConfig.ajaxUrl.consensusInformation, {}, function(data) {
		if(data.statuCode === '200') {
			SetConsensusInformation(data);
		}
	})
	
	//三个卡片的优良中差状态
	SEQAjax(window.pageConfig.ajaxUrl.importantaffectedUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			SetAffectedUserNum(0, data.data['scene']);
			SetAffectedUserNum(1, data.data['netMeteData']);
			SetAffectedUserNum(2, data.data['sp']);
		}
	});
	
	//只显示监控的SP
	SEQAjax(window.pageConfig.ajaxUrl.keySceneProtocalUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setProtocalUserNum(data);
		}
	});
	
	//底部指标
	$("footer").children("ul").children("li").each(function(i,v){
		if(i === 0 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '0'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("allg",data);
				}
			});
		}else if(i === 1 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '4'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("fourg",data);
				}
			});
		}else if(i === 2 && $(v).hasClass("sel")){
			SEQAjax(window.pageConfig.ajaxUrl.allRateKqi, {
				ratType: '3'
			}, function(data) {
				if(data.statuCode === '200') {
					SetBottomOption("threeg",data);
				}
			});
		}
	})
	
	//三个卡片KQI趋势图
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
	EventBind();
	$(".myqipao").remove();
}


$(function() {
	PageInit();
	//倒计时功能
	SetTime(PageInit);
})
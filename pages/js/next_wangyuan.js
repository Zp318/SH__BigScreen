var mydata=[]; //缓存告警列表数据
var thisdata={};
var dangqianshijian;
window.isNotType = false;	//判断请求是否为网元或者网元类型

function wyEventBind() {
	$(".WY_main").off();
	//点击表头选项按表头选项排序
	$(".WY_main").on('click', '.thead_tr>td', function(e) {
		if($(this).hasClass("firstclick")) {
			mydata.body.reverse();
			wydata(mydata);
			//三角图标样式
			var indexnum = $(this).index();
			if($(".WY_main .tbody>tr").length > 1 && $(".WY_main .tbody>tr").eq(0).find('td').eq(indexnum).text() < $(".WY_main .tbody>tr").eq(-1).find('td').eq(indexnum).text()) {
				$(this).find("img").addClass("xz");
			} else {
				$(this).find("img").removeClass("xz");
			}
		} else {
			$(".WY_main .thead_tr>td>img").removeClass("xz");
			mydata.body.sort(sortby(e.target.dataset.x));
			wydata(mydata);
			$(this).addClass("firstclick");
			$(this).siblings().removeClass("firstclick");
		}
	});
	
	//放大缩小功能
	//缩小按钮
	$(".WY_main").on("click", ".wy_box_headertwo", function(e) {
		if($(this).hasClass("on_center")) {
			$('.WY_main .auto_box').css({
				'height': '0',
				'overflow': 'hidden'
			});
			$(".WY_main .wybox").css("height", "0.42rem");
			$(this).addClass("totop").addClass("on_bottom").removeClass("on_center").removeClass("on_top");
			$(".WY_main .wy_box_headerthree").addClass("on_bottom").removeClass("on_top").removeClass("on_center");
		} else if($(this).hasClass("on_bottom")) {
			$('.WY_main .auto_box').css({
				'height': '2.76rem',
				'overflow': 'inherit'
			});
			$(".WY_main .wybox").css("height", "3.18rem");
			$(this).addClass("on_center").removeClass("on_bottom").removeClass("on_top").removeClass("totop");
			$(".WY_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
		} else if($(this).hasClass("on_top")) {
			$(this).removeClass("totop").addClass("on_center").removeClass("on_bottom").removeClass("on_top");
			$(".WY_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
			$(".WY_main .wybox").css("height", "3.18rem");
			var table_clone = $('.WY_main .tabletwo').clone();
			var text_cp = $(`<div class="containerbig">
			<div class="div_scrollY">
				<div class="outer">
					<div class="mybox">
						<div class="tableonebox">
						</div>
					</div>
					<div class="container">
						<div class="div_scroll">
							<div class="tabletwobox">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`)
			$('.WY_main .wyboxfour_tb').html('');
			$('.WY_main .wyboxfour_tb').append(text_cp);
			$('.WY_main .tabletwobox').append(table_clone);
			$('.WY_main .tableonebox').append($('.tabletwo').clone());
			$('.WY_main .tableonebox .tabletwo').attr('class', 'tableone');
			$('.WY_main .tableonebox .tableone').eq(1).remove();
			thisdata={
				"statuCode":"200",
				"data":mydata
			}
			setalarmInformation(thisdata);
			if(mydata.header.length > 7) {
				$(".WY_main .tableone").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwo").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tableonebox").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwobox").css("width", mydata.header.length * 16 / 7 + "rem");
			}
			$(".WY_main .container .div_scroll").css('height', "0.42rem");
			if(mydata.header.length > 7) {
				$('.WY_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			$('.WY_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			if(mydata.header.length > 7) {
				$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
			}
		}
	});

	//全屏按钮
	$(".WY_main").on("click", ".wy_box_headerthree", function(e) {
		$('.WY_main .tableonebox .tableone:not(:first)').remove();
		$(".WY_main .wy_box_headertwo").removeClass("totop");
		$(this).addClass("wy_box_tomin");
		$(".wy_box_headertwo").hide();
		if($(this).hasClass("on_center") || $(this).hasClass("on_bottom")) {
			$('.WY_main .tableonebox .tableone:not(:first)').remove();
			$(".WY_main .wybox").css("background","rgba(9, 11, 10, 0.96)");
			$(this).addClass("on_top").removeClass("on_center").removeClass("on_bottom");
			$(".WY_main .wy_box_headertwo").addClass("on_top").removeClass("on_center").removeClass("on_bottom");
			$('.WY_main .auto_box').css({
				'height': '2.76rem',
				'overflow': 'inherit'
			});
			$(".WY_main .wybox").css("height", "100%");
			
			var table_clone = $('.WY_main .tabletwo').clone();
			var text_cp = $(`<div class="containerbig">
			<div class="div_scrollY">
				<div class="outer">
					<div class="mybox">
						<div class="tableonebox">
						</div>
					</div>
					<div class="container">
						<div class="div_scroll">
							<div class="tabletwobox">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`)
			$('.WY_main .wyboxfour_tb').html('');
			$('.WY_main .wyboxfour_tb').append(text_cp);
			$('.WY_main .tabletwobox').append(table_clone);
			$('.WY_main .tableonebox').append($('.tabletwo').clone());
			$('.WY_main .tableonebox .tabletwo').attr('class', 'tableone');
			$('.WY_main .tableonebox .tableone:not(:first)').remove();
			
			$('.WY_main .tableonebox .tableone:not(:first)').remove();
			
			thisdata={
				"statuCode":"200",
				"data":mydata
			}
			setalarmInformation(thisdata);
			
			if(mydata.header.length > 7) {
				$(".WY_main .tableone").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwo").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tableonebox").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwobox").css("width", mydata.header.length * 16 / 7 + "rem");
			}
			$(".WY_main .container .div_scroll").css('height', "6.37rem");
			$(".WY_main .containerbig .scroll_container").css("height","2.44rem");
			
			$('.WY_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			$(".containerbig .scroll_container").css("height","6.9rem");
			if(mydata.header.length > 7) {
				$('.WY_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			$(".container .scroll_vertical_bar").css("top","3.9rem");
			if(mydata.header.length > 7) {
				$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
			}
			
		}else if($(this).hasClass("on_top")){
			$('.WY_main .tableonebox .tableone:not(:first)').remove();
			$(".WY_main .wybox").css("background","rgba(9, 11, 10, 0.9)");
			$(this).removeClass("wy_box_tomin");
			$(".wy_box_headertwo").show();
			$(".wy_box_headertwo").addClass("on_center").removeClass("common_top");
			$(this).removeClass("totop").addClass("on_center").removeClass("on_bottom").removeClass("on_top");
			$(".WY_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
			$(".WY_main .wybox").css("height", "3.18rem");
			var table_clone = $('.WY_main .tabletwo').clone();
			var text_cp = $(`<div class="containerbig">
			<div class="div_scrollY">
				<div class="outer">
					<div class="mybox">
						<div class="tableonebox">
						</div>
					</div>
					<div class="container">
						<div class="div_scroll">
							<div class="tabletwobox">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`)
			$('.WY_main .wyboxfour_tb').html('');
			$('.WY_main .wyboxfour_tb').append(text_cp);
			$('.WY_main .tabletwobox').append(table_clone);
			$('.WY_main .tableonebox').append($('.tabletwo').clone());
			$('.WY_main .tableonebox .tabletwo').attr('class', 'tableone');
			$('.WY_main .tableonebox .tableone:not(:first)').remove();
			thisdata={
				"statuCode":"200",
				"data":mydata
			}
			setalarmInformation(thisdata);
			if(mydata.header.length > 7) {
				$(".WY_main .tableone").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwo").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tableonebox").css("width", mydata.header.length * 16 / 7 + "rem");
				$(".WY_main .tabletwobox").css("width", mydata.header.length * 16 / 7 + "rem");
				$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
			}
			$(".WY_main .container .div_scroll").css('height', "0.42rem");
			if(mydata.header.length > 7) {
				$('.WY_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			$('.WY_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});		
			$(".container .scroll_vertical_bar").css("top","9.9rem");
		}
	});
	
	var timerinter;
	//点击网元类型 请求数据 渲染数据
	$(".WY_main").on("click", ".wylx", function(e) {
		if(window.isNotType) {
			window.isNotType = false;
		} else if($(this).hasClass('wypicbox_active')) {
//			return;
		}
		//显示对应网元类型的胶囊图
		var wy_num = $(this).attr('data-num');
//		$(".wyjn").hide();
//		$(`.wyjn[data-num=${wy_num}]`).show();
		$(".WY_main .tableone>thead>.thead_tr").html("");
		$(".WY_main .tabletwo>thead>.thead_tr").html("");
		$(".WY_main .tableone>tbody").html("");
		$(".WY_main .tabletwo>tbody").html("");
		$(this).addClass("wypicbox_active").siblings().removeClass("wypicbox_active");
		//优化,防止连续选择点击时连续请求,点击两秒后再发送请求
		clearTimeout(timerinter);
		timerinter=setTimeout(function(){
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 3,
				netMetaData: wy_num
			}, function(data) {
				if(data.statuCode === '200') {
					setWyRateKqi(data.data, wy_num);
				}
			});
			SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
				serviceType: 3,
				netMetaData: e.target.dataset.num
			}, function(data) {
				if(data.statuCode === '200') {
					setalarmInformation(data);
					if($(".WY_main .wy_box_headerthree").hasClass("on_top")){
						$('.WY_main .auto_box').css({'height': '2.76rem','overflow': 'inherit'});
						$(".WY_main .wybox").css("height", "100%");
						$(".WY_main .container .div_scroll").css('height', "6.37rem");
						$(".WY_main .containerbig .scroll_container").css("height","2.44rem");
						$('.WY_main .container .div_scroll').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
						$(".containerbig .scroll_container").css("height","6.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .containerbig').scroll_absolute({
								arrows: false,
								mouseWheelSpeed: 20
							});
						}
						$(".container .scroll_vertical_bar").css("top","3.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
						}
					}
				}
			});
		},1000);
	});
	
	var timergjinter;
	//点击告警列表 请求KQI数据 
	$(".WY_main").on("click", ".tabletwobox .tabletwo .tbody tr", function(e) {
		//优化,防止连续选择点击时连续请求,点击两秒后再发送请求
		var gjwylx;
		var gjwyname = $(this).attr("data-name2");
		switch($(this).attr("data-nettype")){
			case "MME": gjwylx = 0;
			break;
			case "SGSN": gjwylx = 1;
			break;
			case "GGSN": gjwylx = 2;
			break;
			case "SGW": gjwylx = 3;
			break;
			case "RNC": gjwylx = 4;
			break;
			default:
			break;
		}
		var gjwyid = $(this).attr("data-netid");
		clearTimeout(timergjinter);
		timergjinter=setTimeout(function(){
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 5,
				netMetaData: gjwylx,
				serviceValue:gjwyid
			}, function(data) {
				if(data.statuCode === '200') {
					setWyGjRateKqi(data.data,gjwyname);
				}
			});
		},1000);
	});
	
}

//渲染告警列表,默认以"影响用户数"降序排列
function setalarmInformation(data) {
	var firstclickindex;
	$(".WY_main .tableone>thead>.thead_tr").html("");
	$(".WY_main .tabletwo>thead>.thead_tr").html("");
	$(".WY_main .tableone>tbody").html("");
	$(".WY_main .tabletwo>tbody").html("");
	mydata = ObjCopy(data.data);
	if(mydata.header){
		mydata.header.forEach(function(v, i) {
			var tempone = `<td data-x="${v.index}" data-headernum=${i}>${v.describle}<img src="${basePath}../pages/imgs/next/listpic.png"></td>`;
			$(".WY_main .thead_tr").append($(tempone));
			if(`${v.index}` === "affectedUserNum"){
				firstclickindex = i
			}
		});
	}
	mydata.body.sort(sortby("affectedUserNum"));
	wydata(mydata);
	$(".WY_main .thead_tr>td").eq(firstclickindex).addClass("firstclick");
	if(mydata.header.length > 7){
		$('.WY_main .containerbig').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}
	$(".WY_main .container .div_scroll").css('height', "0.42rem");
	$('.WY_main .container .div_scroll').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20
	});
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


//封装告警数据插入
function wydata(data) {
	$(".WY_main .tbody").html("");
	$(".WY_main .tableone>tbody").html("");
	$(".WY_main .tabletwo>tbody").html("");
	mydata.body.forEach(function(e, j) {
		var tr = $(`<tr data-nettype="${e.nettype}" data-netid="${e.netid}" data-name2="${e.name2}"></tr>`);
		$(".WY_main .tableone").find(".thead_tr").children("td").each(function(o,p){
			var temp;
			for(var ele in e) {
				if(ele = $(p).attr("data-x")){
					if(ele == "affectedUserNum" && `${e[ele]}` === ""){
						temp = $(`<td><div title="0">0</div></td>`);
					}else if((ele == "last_updated" || ele == "first_create_time" || ele == "demarcation_start_time" || ele == "demarcation_end_time") && `${e[ele]}` !== ""){	
						var timeone = +`${e[ele]}`;
						var newDateone = new Date();
						newDateone.setTime(timeone * 1000);
						var nyr = newDateone.toLocaleString();
						temp = $(`<td><div title="${nyr}">${nyr}</div></td>`);
					}else if( ele == "confirmed_time" && `${e[ele]}` !== "-1"){	
						var timeone = +`${e[ele]}`;
						var newDateone = new Date();
						newDateone.setTime(timeone * 1000);
						var nyr = newDateone.toLocaleString();
						temp = $(`<td><div title="${nyr}">${nyr}</div></td>`);
					}else if( ele == "confirmed_time" && `${e[ele]}` === "-1"){	
						temp = $(`<td><div title=""></div></td>`);
					}else if(ele == "first_occurence" && `${e[ele]}` !== ""){
						var timeone = +`${e[ele]}`;
						var newDateone = new Date();
						newDateone.setTime(timeone * 1000);
						var nyr = newDateone.toLocaleString();
						temp = $(`<td class="first_occur" data-first="${e[ele]}" title="${nyr}"><div>${nyr}</div></td>`);
					}else if(ele == "alarm_level" && `${e[ele]}` == "1"){
						temp = $(`<td><div title="Urgent">Urgent</div></td>`);
					}else if(ele == "alarm_level" && `${e[ele]}` == "2"){
						temp = $(`<td><div title="Critical">Critical</div></td>`);
					}else if(ele == "alarm_level" && `${e[ele]}` == "3"){
						temp = $(`<td><div title="Warning">Warning</div></td>`);
					}else if(ele == "cleared_time" && `${e[ele]}` == "-1"){
						temp = $(`<td><div title=""></div></td>`);
					}else if(ele == "cleared_time" && `${e[ele]}` !== "-1"){
						var timeone = +`${e[ele]}`;
						var newDateone = new Date();
						newDateone.setTime(timeone * 1000);
						var nyr = newDateone.toLocaleString();
						temp = $(`<td><div title="${nyr}">${nyr}</div></td>`);
					}else{
						temp = $(`<td><div title="${e[ele]}">${e[ele]}</div></td>`);
					}
					tr.append(temp);
					break;
				}
			}
		});
		$(".WY_main .tbody").append(tr);
	});
	if(mydata.header.length > 7) {
		$(".WY_main .containerbig .div_scrollY").css("width", mydata.header.length * 16 / 7 + "rem");
		$(".WY_main .containerbig .container").css("width", mydata.header.length * 16 / 7 + "rem");
		$(".WY_main .tableone").css("width", mydata.header.length * 16 / 7 + "rem");
		$(".WY_main .tabletwo").css("width", mydata.header.length * 16 / 7 + "rem");
		$(".WY_main .tableonebox").css("width", mydata.header.length * 16 / 7 + "rem");
		$(".WY_main .tabletwobox").css("width", mydata.header.length * 16 / 7 + "rem");
	}
	
	//遍历每行第一格,添加一个圆点
	$(".WY_main .tbody tr").each(function(m,n){
		$(n).children("td:first").prepend(`<div class="ajcircle"></div>`);
	});
	
	//判断是否为新增告警
	var now = new Date();
	dangqianshijian = (new Date(fixTime(now, 15 * 60)).getTime()) / 1000;
	$(".WY_main .tbody tr").each(function(s,t){
		var firstime = $(t).children(".first_occur").attr("data-first");
		if(+firstime <= dangqianshijian && firstime >= dangqianshijian - 900){
			$(t).children("td:first").children(".ajcircle").css("background","red");
		}
	});
}


/**
 * 重点网元kqi
 * @param {Object} data	需要绘制的数据
 * @param {Object} name	网元类型
 */
function setWyRateKqi(data, name) {
	var option1 = ObjCopy(window.pageConfig.option.line);
	var option2 = ObjCopy(window.pageConfig.option.line);
	var wy_name = '';
	switch(name.toString()) {
		case '0':
			wy_name = 'MME';
			break;
		case '1':
			wy_name = 'SGSN';
			break;
		case '2':
			wy_name = 'GGSN';
			break;
		case '3':
			wy_name = 'S&PGW';
			break;
		case '4':
			wy_name = 'RNC';
			break;
		default:
			break;
	}
	option1.xAxis.data = tranDate(data[0].value.startTime);
	option2.xAxis.data = tranDate(data[1].value.startTime);
	option1.xAxis.axisLabel.interval = function(index,string){
			if((index % 12 === 0 && option1.xAxis.data.length-1-index > 4) || (index === (option1.xAxis.data.length-1))){
				return true;
			}else{
				return false;
			}
		}
	option2.xAxis.axisLabel.interval = function(index,string){
			if((index % 12 === 0 && option2.xAxis.data.length-1-index > 4) || (index === (option2.xAxis.data.length-1))){
				return true;
			}else{
				return false;
			}
		}
	option1.series[0].data = judgeNum(data[0].value.now);
	option1.series[1].data = judgeNum(data[0].value.last);
	option2.series[0].data = judgeNum(data[1].value.now);
	option2.series[1].data = judgeNum(data[1].value.last);
	option1.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
	}], false);
	option2.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
	}], false);
	$('.WY_main').find(".line_title").eq(0).find(".line_title_text").text(data[0].text);
	$('.WY_main').find(".line_title").eq(1).find(".line_title_text").text(data[1].text);
	$('.WY_main .wylxtxt').text(wy_name);
	var wy_line1 = echarts.init(document.getElementsByClassName('WY_main')[0].getElementsByClassName('wyboxthree_1')[0]);
	var wy_line2 = echarts.init(document.getElementsByClassName('WY_main')[0].getElementsByClassName('wyboxthree_2')[0]);
	wy_line1.setOption(option1);
	wy_line2.setOption(option2);
}


//点击告警列表
function setWyGjRateKqi(data,name) {
	var option1 = ObjCopy(window.pageConfig.option.line);
	var option2 = ObjCopy(window.pageConfig.option.line);

	option1.xAxis.data = judgeNum(tranDate(data[0].value.startTime));
	option2.xAxis.data = judgeNum(tranDate(data[1].value.startTime));
	option1.series[0].data = judgeNum(data[0].value.now);
	option1.series[1].data = judgeNum(data[0].value.last);
	option2.series[0].data = judgeNum(data[1].value.now);
	option2.series[1].data = judgeNum(data[1].value.last);
	option1.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
	}], false);
	option2.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		offset: 0,
		color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
	}, {
		offset: 1,
		color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
	}], false);
	$('.WY_main').find(".line_title").eq(0).find(".line_title_text").text(data[0].text);
	$('.WY_main').find(".line_title").eq(1).find(".line_title_text").text(data[1].text);
	$('.WY_main .wylxtxt').text(name);
	var wy_line1 = echarts.init(document.getElementsByClassName('WY_main')[0].getElementsByClassName('wyboxthree_1')[0]);
	var wy_line2 = echarts.init(document.getElementsByClassName('WY_main')[0].getElementsByClassName('wyboxthree_2')[0]);
	wy_line1.setOption(option1);
	wy_line2.setOption(option2);
}

//重点网元页面初始化接口
window.WyPageInit = function WyPageInit(init_wy, wy_type) {
	wyEventBind();
	if(init_wy) {
		if(/SGW|MME|GGSN|SGSN|RNC/.test(init_wy)) {
			window.isNotType = false;
			$(`.WY_main div[data-lx=${init_wy}]`).click();
			SEQAjax(window.pageConfig.ajaxUrl.affectedUserAndWorkOrder, {}, function(data) {
				if(data.statuCode === '200') {
					setaffectedUserAndWorkOrder(data);
				}
			});
		} else {
			window.isNotType = true;
			$(`.wylx`).removeClass('wypicbox_active');
			$(`.wylx[data-num=${wy_type}]`).addClass('wypicbox_active');
			$(`.wyjn`).hide();
			$(`.wyjn[data-num=${wy_type}]`).show();
			SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
				serviceType: 5,
				serviceValue: init_wy,
				netMetaData: wy_type
			}, function(data) {
				if(data.statuCode === '200') {
					setalarmInformation(data);
					if($(".WY_main .wy_box_headerthree").hasClass("on_top")){
						$('.WY_main .auto_box').css({'height': '2.76rem','overflow': 'inherit'});
						$(".WY_main .wybox").css("height", "100%");
						$(".WY_main .container .div_scroll").css('height', "6.37rem");
						$(".WY_main .containerbig .scroll_container").css("height","2.44rem");
						$('.WY_main .container .div_scroll').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
						$(".containerbig .scroll_container").css("height","6.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .containerbig').scroll_absolute({
								arrows: false,
								mouseWheelSpeed: 20
							});
						}
						$(".container .scroll_vertical_bar").css("top","3.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
						}
					}
				}
			});
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 5,
				serviceValue: init_wy,
				netMetaData: wy_type
			}, function(data) {
				if(data.statuCode === '200') {
					setWyRateKqi(data.data, wy_type);
				}
			});
			SEQAjax(window.pageConfig.ajaxUrl.affectedUserAndWorkOrder, {}, function(data) {
				if(data.statuCode === '200') {
					setaffectedUserAndWorkOrder(data);
				}
			});
		}
		return;
	}

	window.isNotType = false;
	 SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
	 	serviceType: 3,
	 	netMetaData: 0
	 }, function(data) {
	 	if(data.statuCode === '200') {
	 		setalarmInformation(data);
	 		if($(".WY_main .wy_box_headerthree").hasClass("on_top")){
						$('.WY_main .auto_box').css({'height': '2.76rem','overflow': 'inherit'});
						$(".WY_main .wybox").css("height", "100%");
						$(".WY_main .container .div_scroll").css('height', "6.37rem");
						$(".WY_main .containerbig .scroll_container").css("height","2.44rem");
						$('.WY_main .container .div_scroll').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
						$(".containerbig .scroll_container").css("height","6.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .containerbig').scroll_absolute({
								arrows: false,
								mouseWheelSpeed: 20
							});
						}
						$(".container .scroll_vertical_bar").css("top","3.9rem");
						if(mydata.header.length > 7) {
							$('.WY_main .div_scrollY').css('width', mydata.header.length * 16 / 7 + "rem");
						}
					}
	 	}
	 });
	
	SEQAjax(window.pageConfig.ajaxUrl.affectedUserAndWorkOrder, {}, function(data) {
		if(data.statuCode === '200') {
			setaffectedUserAndWorkOrder(data);
			$(`.WY_main div.wypicbox_active`).click();
		}
	});
	
	 SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
	 	serviceType: 3,
	 	netMetaData: 0
	 }, function(data) {
	 	if(data.statuCode === '200') {
	 		setWyRateKqi(data.data, 0);
	 	}
	 });
}
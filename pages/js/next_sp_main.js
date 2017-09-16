/**
 * 事件绑定
 */
function spEventBind() {
	$('.SP_main').off();
	$('.SP_main').on('click', 'dl', function() {
		var sssthis=$(this);
		var name = $(this).attr("data-id");
		curr_name = name;
		setTimeout(function() {
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 4,
				serviceValue: name
			}, function(data) {
				if(data.statuCode === '200') {
					setSpRateKqi(data.data, curr_area);
				}
			});
			SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
				serviceType: 4,
				serviceValue: name,
			}, function(data) {
				if(data.statuCode === '200') {
					setSpAlarmInformation(data);
				}
			});
			setAboutSoft(name);
			
			setTimeout(function(){
				$('.SP_list .SP_list_scroll').scroll_absolute({
					arrows: false,
					mouseWheelSpeed:30
				});
			},10);
		}, 300);
	});
	
	//点击SP分类
//	$('.SP_main').on("click", '.banner span', function() {
//		var role = $(this).attr("data-id");
//		$(".classfied").find("dl").removeClass("wai");
//		$(".classfied").find("dl").removeClass("border_color");
//		//$(".classfied").find(`dl[data-role=${role}]`).addClass("wai");
//		$(".classfied").find(`dl[data-role=${role}]`).addClass("border_color");
//		$(this).addClass("first").siblings('span').removeClass("first");
//	})
	
	
	//点击SP告警列表显示对应的KQI趋势图
	var spgjtime;
	$('.SP_main').on('click', '.SP_list .SP_list_scroll .show .outer .container .sptabletwobox .tbody', function() {
		spgjid = $(this).attr("data-spgjid");
		spgjname = $(this).attr("data-name2");
		clearTimeout(spgjtime);
		spgjtime = setTimeout(function() {
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 4,
				serviceValue: spgjid
			}, function(data) {
				if(data.statuCode === '200') {
					setSpRateKqi(data.data, spgjname);
				}
			});
		}, 1000);
	});
	
	
	
	//点击dl时出现高亮加边框
	$('.SP_main').on('click','.classfied dl',function(e){
		$(this).addClass("waii");
		$(this).siblings("dl").removeClass("waii");
		$(this).parents(".classfied").siblings(".classfied").children("dl").removeClass("waii");
		$(this).parents(".classfied").siblings(".classfied").children("dl").removeClass("border_colorr");
		$(this).siblings("dl").removeClass("border_colorr");
		
		//对应三角显示
		$(".classfied").children().children(".classfied_right").children(".sanjiao").hide();
		$(this).children(".classfied_right").children(".sanjiao").show();
		$(this).parent().next().find(".wybox111").css("background",$(this).children("i").css("background-image"));
		$(this).parent().next().find(".wybox111").css("background-size","0.28rem 0.28rem");
		$(this).parent().next().find(".wybox112").text($(this).children(".classfied_right").children(".wodesp").text());
	})
	//点击表头选项按表头选项排序
	$(".SP_main").on('click', '.thead_tr>td', function(e) {
		if($(this).hasClass("firstclick")) {
			sp_table_data.body.reverse();
			spData(sp_table_data);
			//三角图标样式
			var indexnum = $(this).index();
			if($(".SP_main .tbody>tr").length > 1 && $(".SP_main .tbody>tr").eq(0).find('td').eq(indexnum).text() < $(".SP_main .tbody>tr").eq(-1).find('td').eq(indexnum).text()) {
				$(this).find("img").addClass("xz");
			} else {
				$(this).find("img").removeClass("xz");
			}
		} else {
			$(".SP_main .thead_tr>td>img").removeClass("xz");
			sp_table_data.body.sort(sortby(e.target.dataset.x));
			spData(sp_table_data);
			$(this).addClass("firstclick");
			$(this).siblings().removeClass("firstclick");
		}
	});
	$(".SP_main").on('click', '.classfied', function() {
		$(".SP_main_center").removeClass('show');
		$(this).next('.SP_main_center').addClass('show');
	});
	//点击相关sp触发相应的sp模块点击事件
	$('.SP_main').on('click', '.about_soft ul li', function() {
		$(`dl[data-str=${$(this).attr('data-str')}]`).eq(0).click();
	})
}


var sp_table_data = null;	//缓存表格数据
var curr_name = null;	//缓存当前点击数据

/**
 * setUserNum(data)用于渲染数据的页面
 * @param data
 */
function setUserNum(data, call) {
	$('.SP_list').html('');
	$('.SP_list').append($(`<div class="SP_list_scroll"></div>`));
	var arr_list = [];
	data.data.forEach(function(v, i) {
		data.data[i].spList.forEach(function(value, index) {
			value.spType = v.bigSpName;
			arr_list.push(value);
		});
	});
	for(var j = 0; j < Math.ceil(arr_list.length / 7); j++) {
		var ul_classfied = $(`<div class="classfied">
		</div>`);
		var SP_main_center = $(`<div class="SP_main_center">
			<div class="auto_box">
				<div class="wybox11">
					<div class="wybox111"></div>
					<div class="wybox112">滴滴</div>
				</div>
				<div class="wybox12">业务质量趋势</div>
				<div class="wyboxtwo">
					<div class="line_title">
						<i class="line_rect"></i>
						<span class="line_title_text"></span>
						<span class="line_solid"></span>
						<span class="line_now">当前值</span>
						<span class="line_dashed"></span>
						<span class="line_after">上周同比值</span>
					</div>
					<div class="line_title">
						<i class="line_rect"></i>
						<span class="line_title_text"></span>
						<span class="line_solid"></span>
						<span class="line_now">当前值</span>
						<span class="line_dashed"></span>
						<span class="line_after">上周同比值</span>
					</div>
				</div>
				<div class="wyboxthree">
					<div class="wyboxthree_1"></div>
					<div class="wyboxthree_2"></div>
				</div>
				<div class="wybox13">当前告警</div>
				<div class="wyboxfour">
					<div class="wyboxfour_tb">
						<div class="containerbig">
							<div class="div_scrollY">
								<div class="outer">
									<div class="mybox">
										<div class="sptableonebox">
											<table class="tableone">
												<thead>
													<tr class="thead_tr">
													</tr>
												</thead>
												<tbody class="tbody">
												</tbody>
											</table>
										</div>
									</div>
		
									<div class="container">
										<div class="div_scroll">
											<div class="sptabletwobox">
												<table class="tabletwo">
													<thead>
														<tr class="thead_tr">
														</tr>
													</thead>
													<tbody class="tbody">
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="about_soft">
				<h5>相关SP</h5>
				<ul>
				</ul>
			</div>
		</div>`);
		$('.SP_list_scroll').append(ul_classfied);
		$('.SP_list_scroll').append(SP_main_center);
	}
	arr_list.sort(function(a, b) {
		return b.userNum - a.userNum;
	})
	arr_list.forEach(function(value, index) {
		var temp = `<dl data-role=${value.spType} data-str=${value.spName} data-id='${value.spCode}'>
            <i class="news" style="background-image: url(${value.icon})"></i>
            <div class = "classfied_right">
                 <p class="wodesp">${value.spName}</p>
                 <p><span class = "using"><span class="all_works" style="width: ${Number(value.workOrder.processing) / ((Number(value.workOrder.processing) + Number(value.workOrder.fixed) || 1))}"></span></span><span class = "using_have">${value.workOrder.processing}/${value.workOrder.fixed}</span></p>
              <h5>
                 <i class = "head"></i>
                 <span>${value.userNum}</span>
              </h5>
              <div class="sanjiao"></div>
            </div>
        </dl>`;
		$('.classfied').eq(Math.floor(index / 7)).append($(temp));
	});
	setTimeout(function(){
		$('.SP_list .SP_list_scroll').scroll_absolute({
			arrows: false,
			mouseWheelSpeed:30
		});
	},10);
	
	
	if(call) {
		call();
	}
	$(".classfied").children().each(function(i,v){
		if($(v).hasClass("waii")){
			$(v).children("dl:first").children(".classfied_right").children(".sanjiao").show();
		}else{
			$(v).children("dl:first").children(".classfied_right").children(".sanjiao").hide();
		}
	})
}

/**
 * 绘制折线图
 * @param {Object} data	需要绘制的折线图
 * @param {String} name	名字
 */
function setSpRateKqi(data, name) {
	var option1 = ObjCopy(window.pageConfig.option.line);
	var option2 = ObjCopy(window.pageConfig.option.line);
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
	$('.SP_main .SP_list .SP_list_scroll .show .auto_box .wyboxtwo .line_title_text').eq(0).text(data[0].text);
	$('.SP_main .SP_list .SP_list_scroll .show .auto_box .wyboxtwo .line_title_text').eq(1).text(data[1].text);

//	$('.SP_main .wylxtxt').text(name);
	sp_line1 = echarts.init(document.getElementsByClassName('SP_main')[0].getElementsByClassName('show')[0].getElementsByClassName('wyboxthree_1')[0]);
	sp_line2 = echarts.init(document.getElementsByClassName('SP_main')[0].getElementsByClassName('show')[0].getElementsByClassName('wyboxthree_2')[0]);
	sp_line1.setOption(option1);
	sp_line2.setOption(option2);
}

/**
 * 设置sp页面表格数据
 * @param {Object} data 表格数据
 */
function setSpAlarmInformation(data) {
	var firstclickindex;
	sp_table_data = ObjCopy(data.data);
	$(".SP_main .tableone>thead>.thead_tr").html("");
	$(".SP_main .tabletwo>thead>.thead_tr").html("");
	$(".SP_main .tableone>tbody").html("");
	$(".SP_main .tabletwo>tbody").html("");
	sp_table_data.header.forEach(function(v, i) {
		var tempone = `<td data-x="${v.index}">${v.describle}<img src="${basePath}../pages/imgs/next/listpic.png"></td>`;
		$(".SP_main .thead_tr").append($(tempone));
		if(`${v.index}` === "affectedUserNum"){
			firstclickindex = i
		}
	});
	sp_table_data.body.sort(sortby("affectedUserNum"));
	spData(sp_table_data);
	$(".SP_main .thead_tr>td").eq(firstclickindex).addClass("firstclick");
	if(sp_table_data.header.length>7){
		$('.SP_main .containerbig').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}
	$(".SP_main .container .div_scroll").css('height', "0.42rem");
	$('.SP_main .container .div_scroll').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20
	});

}

/**
 * 封装sp表格数据插入
 * @param {Object} data 排序好的sp表格数据
 */
function spData(data) {
	$(".SP_main .tbody").html("");
	$(".SP_main .sptabletwobox .tabletwo .tbody").children("tr").html("");
	data.body.forEach(function(e, j) {
		var tr = $(`<tr data-spgjid="${e.sub_prot_id}" data-name2="${e.name2}"></tr>`);
		$(".SP_main .sptableonebox .tableone").eq(0).find(".thead_tr").children("td").each(function(o,p){
			var temp;
			for(var ele in e) {
				if(ele = $(p).attr("data-x")){
					if(ele == "affectedUserNum" && `${e[ele]}` === ""){
						temp = $(`<td><div title="0">0</div></td>`);
					}else if((ele == "first_occurence" || ele == "last_updated" || ele == "first_create_time" || ele == "demarcation_start_time" || ele == "demarcation_end_time") && `${e[ele]}` !== ""){	
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
		$(".SP_main .tbody").append(tr);
	});

	
	if(data.header.length > 7) {
		$(".SP_main .containerbig .div_scrollY").css("width", (data.header.length+3) * 14 / 7 + "rem");
		$(".SP_main .containerbig .container").css("width", (data.header.length+3) * 14 / 7 + "rem");
		$(".SP_main .tableone").css("width", (data.header.length+3) * 14 / 7 + "rem");
		$(".SP_main .tabletwo").css("width", (data.header.length+3) * 14 / 7 + "rem");
		$(".SP_main .sptableonebox").css("width", (data.header.length+3) * 14 / 7 + "rem");
		$(".SP_main .sptabletwobox").css("width", (data.header.length+3) * 14 / 7 + "rem");
	}
	
	//遍历每行第一格,添加一个圆点
	$(".SP_main .tbody tr").each(function(m,n){
		$(n).children("td:first").prepend(`<div class="ajcircle"></div>`);
	});
	
	//判断是否为新增告警
	var now = new Date();
	dangqianshijian = (new Date(fixTime(now, 15 * 60)).getTime()) / 1000;
	$(".SP_main .tbody tr").each(function(s,t){
		var firstime = $(t).children(".first_occur").attr("data-first");
		if(+firstime <= dangqianshijian && firstime >= dangqianshijian - 900){
			$(t).children("td:first").children(".ajcircle").css("background","red");
		}
	});
}

/**
 * 设置相关sp
 * @param {String} name 所选sp名称
 */
function setAboutSoft(name) {
	//清空当前sp列表
	var _ul = $('.SP_main_center.show .about_soft ul');
	_ul.html('');
	var type = $(`dl[data-id=${name}]`).attr('data-role');
	$(`dl[data-role=${type}]`).each(function(i, v) {
		var _li = $(`<li data-role="${type}" data-str="${$(v).attr('data-str')}" data-id="${$(v).attr('data-id')}">
			${$(v).html()}
		</li>`);
		_ul.append(_li);
	});
	_ul.find(`li[data-id=${name}]`).remove();
}

window.SpPageInit = function SpPageInit(init_sp) {
	spEventBind();
	SEQAjax(pageConfig.ajaxUrl.keySceneProtocalUserNum, {}, function(data) {
		if(data.statuCode === '200') {
			setUserNum(data, function() {
				if(init_sp) {
					$(`dl[data-str=${unescape(init_sp)}]`).eq(0).click();
					return;
				} else if(curr_name) {
					$(`dl[data-id=${curr_name}]`).eq(0).click();
				} else {
					$(`dl`).eq(0).click();
				}
			});
		}
	});
}

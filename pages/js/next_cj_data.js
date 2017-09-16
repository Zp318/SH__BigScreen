var mydata=[];	//缓存查询的重点小区数据
var thisdata={};
var dacjname="";
var datacellist;
/**
 * 场景事件绑定
 */
function CjEventBind() {
	//解绑所有事件
	$('.CJ_main').off();
	//排序
	//排序功能已经转移至陈列数据方法中
	$('.CJ_main').on('click', '.sort_menu li', function() {
		$('.sort_menu li input:checked').parents('li').addClass('sel').siblings().removeClass('sel');
		var str = '';
		setSceneUserNum(area_data);
	});
	//滚动功能
	$('.CJ_main').on('click', '.scroll_list > i', function() {
		if($(this).hasClass('dis')) {
			return;
		}
		if($('.scroll_main ul').hasClass('actived')) {
			return;
		}
		$('.scroll_main ul').addClass('actived');
		var ts = $('.scroll_main ul').css('transform').match(/(-?\d*\.?\d+)(?=, 0\))/)[0];
		if($(this).hasClass('scroll_l')) {
			$('.scroll_main ul').css({
				'transform': `matrix(1, 0, 0, 1, ${Number(ts) + (1.83 * REM)}, 0)`
			});
		} else {
			if((Number(ts) - (1.83*200)) < -1830){
				console.log("1");
			}else{
				$('.scroll_main ul').css({
					'transform': `matrix(1, 0, 0, 1, ${Number(ts) - (1.83 * REM)}, 0)`
				});
			}
		}
		setTimeout(function() {
			var l_pos = $('.scroll_list li:nth-child(1)').offset().left - $('.scroll_list').offset().left;
			var r_pos = $('.scroll_list li:last-child').offset().left + 1.83 * REM - $('.scroll_list').offset().left - 13.89 * REM;
			$('.scroll_list > i').removeClass('dis');
			if(r_pos < 117) {
				$('.scroll_r').addClass('dis');
			}
			if(l_pos > 0) {
				$('.scroll_l').addClass('dis');
			}
			$('.scroll_main ul').removeClass('actived');
		}, 600);
	});
	//滚动区域单选
	$('.CJ_main').on('click', '.scroll_main li', function() {
		$(this).addClass('sel').siblings().removeClass('sel');
		curr_area = $(this).find('.info h4').text();
		dacjname = curr_area;
		SEQAjax(window.pageConfig.ajaxUrl.sceneCustomArea, {
			bigSceneName: curr_area
		}, function(data) {
			if(data.statuCode === '200') {
				setSceneCustomArea(data.data);
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
			serviceType: 0,
			serviceValue: curr_area
		}, function(data) {
			if(data.statuCode === '200') {
				setTwoRateKqi(data.data, curr_area);
			}
		});
		
		//点击大场景恢复初始状态
		$(".myqipao").remove();
		map.panTo([31.252820, 121.448510]);
	});
	
	//重点小区点击
	$('.CJ_main').on('click', '.user_set_area ul li', function() {
		var area_name = $(this).find('span').eq(0).text();
		var area_id = $(this).attr('data-id');
		SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
			serviceType: 1,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setTwoRateKqi(data.data, area_name);
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
			serviceType: 1,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setAlarmInformation(data);
				
				if($(".CJ_main .wy_box_headerthree").hasClass("on_top")){
					$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
					$(".CJ_main .wybox").css("height", "100%");
					$(".CJ_main .container .div_scroll").css('height', "6.37rem");
					$(".CJ_main .containerbig .scroll_container").css("height","2.44rem");
					$('.CJ_main .container .div_scroll').scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(".containerbig .scroll_container").css("height","6.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .containerbig').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
					}
					$(".container .scroll_vertical_bar").css("top","3.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
					}
				}
				
			}
		});
		
		//打点
		marks.forEach(function(v, i) {
			map.removeLayer(v);
		});
		marks.length = 0;
		if(datacellist.length) {
			datacellist.sort(sortby("userNum"));
			datacellist.forEach(function(v, i) {
				if(v.cells && v.areaName === area_name){
					//处理地图数据
					v.cells.map(function(item) {
						createIcon(+item.y, +item.x, item.name, item.threshState,item.cellCode,item.userNum);
					});
				}
			});
		}

		
		//显示气泡
		var a = +$(this).attr("data-point").substring(0,$(this).attr("data-point").indexOf(","));
		var b = +$(this).attr("data-point").substring($(this).attr("data-point").indexOf(",")+1);
		$(".myqipao").remove();
		createqipao(b,a);
		$(".myqipao").append(`<div class="myqipaoone"></div><div class="myqipaotwo"></div>`);
		$(".myqipaotwo").text($(this).children("span:first").text());
		$(".myqipaoone").text($(this).children("span:eq(1)").text());
	});
	
	//点击添加删除重点场景内的场景 请求KQI趋势图和告警信息
	$('.CJ_main').on('click', '.im_area .li_area', function(e) {
		e.stopPropagation();
		var thisone=$(this);
		
		//联动大场景
		$(".scroll_main ul li").each(function(x,y){
			if($(y).find("h4").text() === thisone.attr("data-bigname")){
				$(y).addClass('sel').siblings().removeClass('sel');
				transArea($(y).find("h4").text());
				var curr_area_o = $(y).find('.info h4').text();
				SEQAjax(window.pageConfig.ajaxUrl.sceneCustomArea, {
					bigSceneName: curr_area_o
				}, function(data) {
					if(data.statuCode === '200') {
						setSceneCustomAreaelse(data.data);
					}
				});
			}
		})
		
		var area_name = thisone.find('h4').text();
		var area_id = thisone.attr('data-id');
		var curr_area = thisone.attr("data-bigname");
		SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
			serviceType: 1,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setTwoRateKqi(data.data, area_name);
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
			serviceType: 1,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setAlarmInformation(data);
				if($(".CJ_main .wy_box_headerthree").hasClass("on_top")){
					$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
					$(".CJ_main .wybox").css("height", "100%");
					$(".CJ_main .container .div_scroll").css('height', "6.37rem");
					$(".CJ_main .containerbig .scroll_container").css("height","2.44rem");
					$('.CJ_main .container .div_scroll').scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(".containerbig .scroll_container").css("height","6.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .containerbig').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
					}
					$(".container .scroll_vertical_bar").css("top","3.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
					}
				}
			}
		});
		
		SEQAjax(window.pageConfig.ajaxUrl.sceneCustomArea, {
			bigSceneName: curr_area
		}, function(data) {
			if(data.statuCode === '200') {
				area_list = data.data.custAreas;
				marks.forEach(function(v, i) {
					map.removeLayer(v);
				});
				marks.length = 0;
				if(area_list.length) {
					area_list.sort(sortby("userNum"));
					area_list.forEach(function(v, i) {
						if(v.areaName === area_name && v.cells){
							//处理地图数据
							v.cells.map(function(item) {
								createIcon(+item.y, +item.x, item.name, item.threshState,item.cellCode,item.userNum);
							});
						}
					});
				}
			}
		});
		//显示气泡
		var a = +thisone.attr("data-dian").substring(0,thisone.attr("data-dian").indexOf(","));
		var b = +thisone.attr("data-dian").substring(thisone.attr("data-dian").indexOf(",")+1);
		$(".myqipao").remove();
		createqipao(b,a);
		$(".myqipao").append(`<div class="myqipaoone"></div><div class="myqipaotwo"></div>`);
		$(".myqipaotwo").text(thisone.children("h4").text());
		$(".myqipaoone").text(thisone.children("p:last").text());
	});
	
	
	//点击告警列表显示对应的KQI趋势图
	var cjgjtime;
	$('.CJ_main').on('click', '.wybox .wyboxfour .container .tabletwobox .tabletwo .tbody tr', function() {
		var cjgjid = $(this).attr("data-cgisai");
		var cjgjname = $(this).attr("data-name2");
		clearTimeout(cjgjtime);
		cjgjtime = setTimeout(function(){
			SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
				serviceType: 2,
				serviceValue: cjgjid
			}, function(data) {
				if(data.statuCode === '200') {
					setTwoRateKqi(data.data, cjgjname);
				}
			});
		},1000);
	});
	
	
	//点击表头选项按表头选项排序
	$(".CJ_main").on('click', '.thead_tr>td', function(e) {
		if($(this).hasClass("firstclick")) {
			cj_table_data.body.reverse();
			cjData(cj_table_data);
			//三角图标样式
			var indexnum = $(this).index();
			if($(".CJ_main .tbody>tr").length > 1 && $(".CJ_main .tbody>tr").eq(0).find('td').eq(indexnum).text() < $(".CJ_main .tbody>tr").eq(-1).find('td').eq(indexnum).text()) {
				$(this).find("img").addClass("xz");
			} else {
				$(this).find("img").removeClass("xz");
			}
		} else {
			$(".CJ_main .thead_tr>td>img").removeClass("xz");
			cj_table_data.body.sort(sortby(e.target.dataset.x));
			cjData(cj_table_data);
			$(this).addClass("firstclick");
			$(this).siblings().removeClass("firstclick");
		}
	});

	//放大缩小功能
	//缩小按钮
	$(".CJ_main").on("click", ".wy_box_headertwo", function(e) {
		if($(this).hasClass("on_center")) {
			$('.CJ_main .auto_box').css({'height': '0', 'overflow' : 'hidden'});
			$(".CJ_main .wybox").css("height", "0.42rem");
			$(this).addClass("totop").addClass("on_bottom").removeClass("on_center").removeClass("on_top");
			$(".CJ_main .wy_box_headerthree").addClass("on_bottom").removeClass("on_top").removeClass("on_center");
		} else if($(this).hasClass("on_bottom")) {
			$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
			$(".CJ_main .wybox").css("height", "3.18rem");
			$(this).addClass("on_center").removeClass("on_bottom").removeClass("on_top").removeClass("totop");
			$(".CJ_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
		} else if($(this).hasClass("on_top")) {
			$(this).removeClass("totop").addClass("on_center").removeClass("on_bottom").removeClass("on_top");
			$(".CJ_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
			$(".CJ_main .wybox").css("height", "3.18rem");
			var table_clone = $('.CJ_main .tabletwo').clone();
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
			$('.CJ_main .wyboxfour_tb').html('');
			$('.CJ_main .wyboxfour_tb').append(text_cp);
			$('.CJ_main .tabletwobox').append(table_clone);
			$('.CJ_main .tableonebox').append($('.tabletwo').clone());
			$('.CJ_main .tableonebox .tabletwo').attr('class', 'tableone');
			$('.CJ_main .tableonebox .tableone').eq(1).remove();
			thisdata={
				"statuCode":"200",
				"data":cj_table_data
			}
			setAlarmInformation(thisdata);
			if(cj_table_data.header.length > 7) {
				$(".CJ_main .tableone").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwo").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tableonebox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwobox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
			}
			$(".CJ_main .container .div_scroll").css('height', "0.42rem");
			if(cj_table_data.header.length > 7) {
				$('.CJ_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			$('.CJ_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			if(cj_table_data.header.length > 7) {
				$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
			}
		}
	});

	//全屏按钮
	$(".CJ_main").on("click", ".wy_box_headerthree", function(e) {
		
		$('.CJ_main .tableonebox .tableone:not(:first)').remove();
		$(".CJ_main .wybox").css("background","rgba(9,11,10,0.95)");
		$(".CJ_main .wybox").css("z-index","1000");
		$(".CJ_main .wy_box_headertwo").removeClass("totop");
		$(this).addClass("wy_box_tomin");
		$(".wy_box_headertwo").hide();
		if($(this).hasClass("on_center") || $(this).hasClass("on_bottom")) {
			$('.CJ_main .tableonebox .tableone:not(:first)').remove();
			$(this).addClass("on_top").removeClass("on_center").removeClass("on_bottom");
			$(".CJ_main .wy_box_headertwo").addClass("on_top").removeClass("on_center").removeClass("on_bottom");
			$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
			$(".CJ_main .wybox").css("height", "100%");
			var table_clone = $('.CJ_main .tabletwo').clone();
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
			</div>`);
			$('.CJ_main .wyboxfour_tb').html('');
			$('.CJ_main .wyboxfour_tb').append(text_cp);
			$('.CJ_main .tabletwobox').append(table_clone);
			$('.CJ_main .tableonebox').append($('.tabletwo').clone());
			$('.CJ_main .tableonebox .tabletwo').attr('class', 'tableone');
			
			$('.CJ_main .tableonebox .tableone:not(:first)').remove();
			
			thisdata={
				"statuCode":"200",
				"data":cj_table_data
			}
			setAlarmInformation(thisdata);
			if(cj_table_data.header.length > 7) {
				$(".CJ_main .tableone").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwo").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tableonebox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwobox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
			}
			$(".CJ_main .container .div_scroll").css('height', "6.37rem");
			$(".CJ_main .containerbig .scroll_container").css("height","2.44rem");
			$('.CJ_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			$(".containerbig .scroll_container").css("height","6.9rem");
			if(cj_table_data.header.length > 7) {
				$('.CJ_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			
			$(".container .scroll_vertical_bar").css("top","3.9rem");
			if(cj_table_data.header.length > 7) {
				$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
			}
		}else if($(this).hasClass("on_top")){
			$('.CJ_main .tableonebox .tableone:not(:first)').remove();
			$(this).removeClass("wy_box_tomin");
			$(".wy_box_headertwo").show();
			$(".wy_box_headertwo").addClass("on_center").removeClass("common_top");
			$(this).removeClass("totop").addClass("on_center").removeClass("on_bottom").removeClass("on_top");
			$(".CJ_main .wy_box_headerthree").addClass("on_center").removeClass("on_top").removeClass("on_bottom");
			$(".CJ_main .wybox").css("height", "3.18rem");
			var table_clone = $('.CJ_main .tabletwo').clone();
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
			$('.CJ_main .wyboxfour_tb').html('');
			$('.CJ_main .wyboxfour_tb').append(text_cp);
			$('.CJ_main .tabletwobox').append(table_clone);
			$('.CJ_main .tableonebox').append($('.tabletwo').clone());
			$('.CJ_main .tableonebox .tabletwo').attr('class', 'tableone');
			$('.CJ_main .tableonebox .tableone:not(:first)').remove();
			thisdata={
				"statuCode":"200",
				"data":cj_table_data
			}
			setAlarmInformation(thisdata);
			if(cj_table_data.header.length > 7) {
				$(".CJ_main .tableone").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwo").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tableonebox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$(".CJ_main .tabletwobox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
				$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
			
			}
			$(".CJ_main .container .div_scroll").css('height', "0.42rem");
			if(cj_table_data.header.length > 7) {
				$('.CJ_main .containerbig').scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
			}
			$('.CJ_main .container .div_scroll').scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});	
			$(".container .scroll_vertical_bar").css("top","9.9rem");
		}
	});
	
	
	
	
	//删除重点场景功能
	$(".CJ_main").on('mousedown', '.cancel', function(e) {
		e.stopPropagation();
		var shanchuthis = $(this);
		$(".CJ_main").off("click", ".cc_qr");
		$(".CJ_main").off("click", ".cc_qx");
		$(".CJ_main").off("click", ".cc_canclebox");
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#cancle_choose").addClass("cancle_choose");
		$(this).addClass("cancelbox");
		var _this = this;
		var myData = [];
		var data_i = {};
		$(this).parent().siblings(".li_area").each(function(i, v) {
			data_i.areaCode = v.dataset.id;
			data_i.areaName = $(v).find("h4").text();
			myData.push(ObjCopy(data_i));
		});
		//确定删除场景
		$(".CJ_main").on("click", ".cc_qr", function() {
			$(_this).parent().remove();
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			SEQAjax(pageConfig.ajaxUrl.keySceneCustomAreaShowConfig, {"data":JSON.stringify(myData)}, function(data) {
				if(data.statuCode === '200') {
					setChildSceneUserNum(data);
				}
			});
			
			if(shanchuthis.siblings("h4").text() === $(".myqipaotwo").text()){
				$(".myqipao").remove();
			}
		});
		//取消删除场景
		$(".CJ_main").on("click", ".cc_qx", function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_this).removeClass("cancelbox");
		});
		$(".CJ_main").on("click", ".cc_canclebox",function() {
			$("#cancle_shaow").removeClass("cancle_shaow");
			$("#cancle_choose").removeClass("cancle_choose");
			$(_this).removeClass("cancelbox");
		});
	});

	//增加重点场景功能
	$(".CJ_main").on('mousedown', '#cjadd', function(e) {
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
		$(this).addClass("add_active");
		$("#cancle_shaow").addClass("cancle_shaow");
		$("#add_choose").addClass("add_choose");
	});
	//场景类型下拉框
	$(".CJ_main").on("click", ".add_cjpicone",function(e) {
		e.stopPropagation();
		$(".containerone").stop(true, true).slideToggle();
		if(mydata.length>5){
			$(".scrollboxone").removeClass("lessfive");
			$(".add_cjcls").css("height",$(".add_cjcls").children().length*0.2+"rem");
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
	$(".CJ_main").on("click",".add_cjpictwo", function(e) {
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
	$(".CJ_main").on("mouseenter",".add_cjcls>li",function(){
		$(this).addClass("everyli");
	});
	$(".CJ_main").on("mouseleave",".add_cjcls>li",function(){
		$(this).removeClass("everyli");
	});
	$(".CJ_main").on("mousedown",".add_cjcls>li",function(e){
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
	$(".CJ_main").on("mouseenter",".add_cjclsdd>li",function(){
		$(this).addClass("everyli");
	});
	$(".CJ_main").on("mouseleave",".add_cjclsdd>li",function(){
		$(this).removeClass("everyli");
	});
	$(".CJ_main").on("mousedown",".add_cjclsdd>li",function(e){
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
						$(".li_area").each(function(i, v) {
							data_i.areaCode = v.dataset.id;
							data_i.areaName = $(v).find("h4").text();
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
		$("#cjadd").removeClass("add_active");
		
	});
	//取消增加场景
	$(".CJ_main").on("mousedown",".add_qx", function(e) {
		e.stopPropagation();
		$("#rightname").val("");
		$(".add_cjclsdd,.add_cjcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#add_choose").removeClass("add_choose");
		$("#cjadd").removeClass("add_active");
	});
	$(".CJ_main").on("mousedown", ".add_canclebox",function(e) {
		e.stopPropagation();
		$("#rightname").val("");
		$(".add_cjclsdd,.add_cjcls").html("");
		$("#cancle_shaow").removeClass("cancle_shaow");
		$("#add_choose").removeClass("add_choose");
		$("#cjadd").removeClass("add_active");
	});
	
	//搜索场景功能
	$(".CJ_main").on("keyup","#rightname",function(){
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
	$(".CJ_main").on("focus","#rightname",function(e){
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
	$(".CJ_main").on('click', '#rightname', function(e) {
		e.stopPropagation();
	});
	$(".CJ_main").on('click', '.cancle_shaow, .add_choose', function() {
		$('.containertwo').hide();
		$('.containerone').hide();
	});
	
	
	//点击地图上的点
	$(".CJ_main").on("click",".map-green,.map-red,map-yellow",function(){
		var area_name = $(this).attr("title");
		var area_id = $(this).attr('data-cell');
		SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
			serviceType: 2,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setTwoRateKqi(data.data, area_name.substring(0,area_name.indexOf(",")));
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
			serviceType: 2,
			serviceValue: area_id
		}, function(data) {
			if(data.statuCode === '200') {
				setAlarmInformation(data);
				if($(".CJ_main .wy_box_headerthree").hasClass("on_top")){
					$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
					$(".CJ_main .wybox").css("height", "100%");
					$(".CJ_main .container .div_scroll").css('height', "6.37rem");
					$(".CJ_main .containerbig .scroll_container").css("height","2.44rem");
					$('.CJ_main .container .div_scroll').scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(".containerbig .scroll_container").css("height","6.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .containerbig').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
					}
					$(".container .scroll_vertical_bar").css("top","3.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
					}
				}
			}
		});
	})
}

var area_data = null; //缓存场景及小区业务数据,联动时需要
var curr_area = null; //缓存当前选择场景
var area_list = null; //缓存当前场景下小区数据
var cj_line1 = cj_line2 = null; //缓存折线图对象
var cj_table_data = null;	//缓存表格数据
//map
var southWest = L.latLng(30.6780776242053, 120.726013183594); //限制地图可视区域
var northEast = L.latLng(31.888218598761, 122.088317871094); //限制地图可视区域
var bounds = L.latLngBounds(southWest, northEast); //设置地图可视区域
var Url = basePath + '../pages/imgs/map_img/{z}/{x}/{y}.png'; //地图瓦片获取
var marks = []; //缓存地图打点
//新建地图区域,层级11-13级,设置中心点坐标,添加地图约束
var map = new sefon.map('map', {
	zoom:11,
	minZoom: 11,
	maxZoom: 13
}).setView([31.198853, 121.432829], 11).setMaxBounds(bounds);
var marker = null;
sefon.tileLayer(Url).addTo(map);

/**
 * 创建地图打点
 * @param {String} lat		地图经度
 * @param {String} lng		地图维度
 * @param {String} name		打点小区名字
 * @param {Number} score	打点小区告警数
 */
function createIcon(lat, lng, name, score, id,user) {
	var color = "";
	switch(+score) {
		case 0:
			color = "green";
			break;
		case 1:
			color = "yellow";
			break;
		case 2:
			color = "red";
			break;
		default:
			break;
	}
	var point = L.latLng(+(lat).toString().replace(/^(\d{2})/, '$1.'), +(lng).toString().replace(/^(\d{3})/, '$1.'));
	var Iconconfig = new L.DivIcon({
		className: 'map-' + color
	})
	marker = L.marker(point, {
		icon: Iconconfig,
		title: `${name}, ${user}`
	}).addTo(map);
	var mk = $("div[title='"+marker.options.title+"']");
	if (mk && mk.length>0){
		mk.attr('data-cell',`${id}`)
	}
	marks.push(marker);
};

//地图气泡
function createqipao(lat, lng) {
	var point = L.latLng(+(lat).toString().replace(/^(\d{2})/, '$1.'), +(lng).toString().replace(/^(\d{3})/, '$1.'));
	var Iconconfig = new L.DivIcon({
		className:"myqipao"
	})
	marker = L.marker(point, {
		icon: Iconconfig
	}).addTo(map);
//	console.log(map.getCenter)
	map.panTo([+(lat).toString().replace(/^(\d{2})/, '$1.'),+(lng).toString().replace(/^(\d{3})/, '$1.')]);
//	marks.push(marker);
};

function transArea(name) {
	var _index;
	if(name === "工业园(国家级)"){
		$(".scroll_main ul li").each(function(c,d){
			if($(d).find("h4").text() === "工业园(国家级)"){
				_index = c;
			}
		})
	}else{
		_index = $(`.scroll_list li h4[data-name=${name}]`).parents('li').index();
	}

	$('.scroll_main ul').css({
		'transition': 'transform 0s linear'
	});
	if(_index > 6) {
		$('.scroll_main ul').css({
			'transform': `matrix(1, 0, 0, 1, ${0 - (_index - 6 ) * (1.83 * REM)}, 0)`
		});
	} else {
		$('.scroll_main ul').css({
			'transform': `matrix(1, 0, 0, 1, 0, 0)`
		});
	}
	if(_index == $(`.scroll_list li`).length - 1) {
		$('.scroll_r').addClass('dis');
		$('.scroll_l').removeClass('dis');
	} else if(_index <= 6) {
		$('.scroll_l').addClass('dis');
		$('.scroll_r').removeClass('dis');
	}
	setTimeout(function() {
		$('.scroll_main ul').css({
			'transition': 'transform 0.5s linear'
		});
	}, 500)
}

/**
 * 重点场景处理
 * @param {Object} data 场景业务
 * @param {Function} call 回调函数
 */
function setSceneUserNum(data, call) {
	if(!area_data) {
		area_data = data;
		area_data.sort(function(a, b) {
			return (b.userNum-0) - (a.userNum-0);
		});
	} else {
		area_data = data;
		switch($('.sort_menu li input:checked').parents('li').index()) {
			case 1:
				str = 'userNum';
				area_data.sort(function(a, b) {
					return (b.userNum-0) - (a.userNum-0);
				});
				break;
			case 2:
				str = 'processing';
				area_data.sort(function(a, b) {
					return (b.workOrder.processing-0) - (a.workOrder.processing-0)
				});
				break;
			case 3:
				str = 'fixed';
				area_data.sort(function(a, b) {
					return (b.workOrder.fixed-0) - (a.workOrder.fixed-0);
				});
				break;
			default:
				break;
		}
		setTimeout(function() {
			transArea($(`.scroll_list li.sel h4`).text());
		}, 200)
	}
	$('.scroll_main ul').html('');
	area_data.forEach(function(v, i) {
		var li = $(`<li>
			<div class="f_left icon" style="background-image: url(${basePath + "../pages/imgs/icons/" + v.icon})"></div>
			<div class="f_left info">
				<h4 data-name="${v.sceneName}">${v.sceneName}</h4>
				<div class="work_main">
					<div class="work_all">
						<div class="work_now" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%"></div>
					</div>
					<span><font>${v.workOrder.processing}</font>/<font>${v.workOrder.fixed}</font></span>
				</div>
				<p><i></i><span>${v.userNum}</span></p>
			</div>
		</li>`);
		$('.scroll_main ul').append(li);
	});
	if(!curr_area) {
		$('.scroll_main ul li:nth-child(1)').addClass('sel');
	} else {
		if(curr_area === "工业园(国家级)"){
			$(".scroll_main ul li").each(function(e,f){
				if($(f).find("h4").text() === "工业园(国家级)"){
					$(f).addClass('sel');
				}
			})
		}else{
			$(`.scroll_list li .info h4[data-name=${curr_area}]`).parents('li').addClass('sel');
		}
	}
	$('.scroll_main ul').css('width', `${(1.71 + 0.16) * area_data.length - 0.16}rem`);
	call && call();
}

/**
 * 重点小区业务处理
 * @param {Object} data 小区业务
 */
function setSceneCustomArea(data) {
	$(".area_list").remove();
	$(".user_set_area").append($(`<div class='area_list'>
		<ul>
		</ul>
	</div>`));
	area_list = data.custAreas;
	datacellist = data.custAreas;
	marks.forEach(function(v, i) {
		map.removeLayer(v);
	});
	marks.length = 0;
	if(data.custAreas.length) {
		data.custAreas.sort(sortby("userNum"));
		data.custAreas.forEach(function(v, i) {
			var li = $(`<li data-id="${v.areaCode}" data-point= "${v.centerPoint}">
				<span title="${v.areaName}">${v.areaName}</span>
				<span>${v.userNum}</span>
				<span class="work_main"><font class="work_all"><i class="work_now" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%"></i></font><em>${v.workOrder.processing}</em>/<em>${v.workOrder.fixed}</em></span>
			</li>`);
			$('.user_set_area ul').append(li);
			//处理地图数据
			if(v.cells){
				v.cells.map(function(item) {
					createIcon(+item.y, +item.x, item.name, item.threshState,item.cellCode,item.userNum);
				});
			}
			
		});
	}
	
	//小区列表中小区群大于7个才加滚动条
	if($(".CJ_main .user_set_area .area_list ul li").length >7){
		$('.area_list').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}
	
	//表格数据插入
	SEQAjax(window.pageConfig.ajaxUrl.alarmInfo, {
		serviceType: 0,
		serviceValue: curr_area,
	}, function(data) {
		if(data.statuCode === '200') {
			setAlarmInformation(data);
			if($(".CJ_main .wy_box_headerthree").hasClass("on_top")){
					$('.CJ_main .auto_box').css({'height': '2.76rem', 'overflow' : 'inherit'});
					$(".CJ_main .wybox").css("height", "100%");
					$(".CJ_main .container .div_scroll").css('height', "6.37rem");
					$(".CJ_main .containerbig .scroll_container").css("height","2.44rem");
					$('.CJ_main .container .div_scroll').scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(".containerbig .scroll_container").css("height","6.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .containerbig').scroll_absolute({
							arrows: false,
							mouseWheelSpeed: 20
						});
					}
					$(".container .scroll_vertical_bar").css("top","3.9rem");
					if(cj_table_data.header.length > 7) {
						$('.CJ_main .div_scrollY').css('width', cj_table_data.header.length * 16 / 7 + "rem");
					}
				}
		}
	});
}

function setSceneCustomAreaelse(data) {
	$(".area_list").remove();
	$(".user_set_area").append($(`<div class='area_list'>
		<ul>
		</ul>
	</div>`));
	area_list = data.custAreas;
	marks.forEach(function(v, i) {
		map.removeLayer(v);
	});
	marks.length = 0;
	if(data.custAreas.length) {
		data.custAreas.sort(sortby("userNum"));
		data.custAreas.forEach(function(v, i) {
			var li = $(`<li data-id="${v.areaCode}" data-point= "${v.centerPoint}">
				<span title="${v.areaName}">${v.areaName}</span>
				<span>${v.userNum}</span>
				<span class="work_main"><font class="work_all"><i class="work_now" style="width: ${Number(v.workOrder.processing) / (Number(v.workOrder.processing) + Number(v.workOrder.fixed)) * 100}%"></i></font><em>${v.workOrder.processing}</em>/<em>${v.workOrder.fixed}</em></span>
			</li>`);
			$('.user_set_area ul').append(li);
			//处理地图数据
			if(v.cells){
				v.cells.map(function(item) {
					createIcon(+item.y, +item.x, item.name, item.threshState,item.cellCode,item.userNum);
				});
			}
			
		});
	}
	
	//小区列表中小区群大于7个才加滚动条
	if($(".CJ_main .user_set_area .area_list ul li").length >7){
		$('.area_list').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}
}

/**
 * 设置子场景用户数
 * @param {Object} data 子场景用户数数据
 */
function setChildSceneUserNum(data) {
	$('.im_area').html('');
	var paixudata=data.data.sort(sortby("userNum"));
	paixudata.forEach(function(v, i) {
		var temp = `<div class="li_area" data-id="${v.sceneCode}" data-bigname = "${v.belongTo}" data-dian="${v.centerPoint}">
			<i class="cancel"></i>
			<i class="icon_bg"></i>
			<i class="icon b_${data.data.length}" style="background-image: url(${basePath}../pages/imgs/icons/${v.icon})"></i>
			<h4>${v.sceneName}</h4>
			<div class="work_all">
				<div class="work_now" style="width: ${v.workOrder['processing'] / (Number(v.workOrder['fixed']) + Number(v.workOrder['processing'])) * 100}%"></div>
			</div>
			<p class="work_text"><span>${v.workOrder['processing']}</span> / <span>${v.workOrder['fixed']}</span></p>
			<p class="user_num">
				<i></i> ${v.userNum}
			</p>
		</div>`;
		$('.im_area').append($(temp));
	});
	$('.im_area').append(`<div id="cjadd"><div  class="add"></div></div>`);
	if($(".li_area").length===4){
		$("#cjadd").hide();
	}else{
		$("#cjadd").show();
	}
}


/**
 * 设置场景选择
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
	$('.li_area').each(function(i, v) {
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

//表格数据插入
function setAlarmInformation(data) {
	var firstclickindex;
	cj_table_data = ObjCopy(data.data);
	$(".CJ_main .tableone>thead>.thead_tr").html("");
	$(".CJ_main .tabletwo>thead>.thead_tr").html("");
	$(".CJ_main .tableone>tbody").html("");
	$(".CJ_main .tabletwo>tbody").html("");
	cj_table_data = ObjCopy(data.data);
	if(cj_table_data.header){
		cj_table_data.header.forEach(function(v, i) {
			var tempone = `<td data-x="${v.index}">${v.describle}<img src="${basePath}../pages/imgs/next/listpic.png"></td>`;
			$(".CJ_main .thead_tr").append($(tempone));
			if(`${v.index}` === "affectedUserNum"){
				firstclickindex = i
			}
		});
	}
	cj_table_data.body.sort(sortby("affectedUserNum"));
	cjData(cj_table_data);
	$(".CJ_main .thead_tr>td").eq(firstclickindex).addClass("firstclick");
	if(cj_table_data.header.length > 7){
		$('.CJ_main .containerbig').scroll_absolute({
			arrows: false,
			mouseWheelSpeed: 20
		});
	}
	$(".CJ_main .container .div_scroll").css('height', "0.42rem");
	$('.CJ_main .container .div_scroll').scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20
	});
}

//封装告警数据插入
function cjData(data) {
	$(".CJ_main .tbody").html("");
	$(".CJ_main .tableone>tbody").html("");
	$(".CJ_main .tabletwo>tbody").html("");
	cj_table_data.body.forEach(function(e, j) {
		var tr = $(`<tr data-cgisai="${e.cgisai}" data-name2="${e.name2}"></tr>`);
		$(".CJ_main .tableone").find(".thead_tr").children("td").each(function(o,p){
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
		$(".CJ_main .tbody").append(tr);
	});
	
	
	if(cj_table_data.header.length > 7 ) {
		$(".CJ_main .containerbig .div_scrollY").css("width", cj_table_data.header.length * 16 / 7 + "rem");
		$(".CJ_main .containerbig .container").css("width", cj_table_data.header.length * 16 / 7 + "rem");
		$(".CJ_main .tableone").css("width", cj_table_data.header.length * 16 / 7 + "rem");
		$(".CJ_main .tabletwo").css("width", cj_table_data.header.length * 16 / 7 + "rem");
		$(".CJ_main .tableonebox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
		$(".CJ_main .tabletwobox").css("width", cj_table_data.header.length * 16 / 7 + "rem");
	}
	
	//遍历每行第一格,添加一个圆点
	$(".CJ_main .tbody tr").each(function(m,n){
		$(n).children("td:first").prepend(`<div class="ajcircle"></div>`);
	});
	
	//判断是否为新增告警
	var now = new Date();
	dangqianshijian = (new Date(fixTime(now, 15 * 60)).getTime()) / 1000;
	$(".CJ_main .tbody tr").each(function(s,t){
		var firstime = $(t).children(".first_occur").attr("data-first");
		if(+firstime <= dangqianshijian && firstime >= dangqianshijian - 900){
			$(t).children("td:first").children(".ajcircle").css("background","red");
		}
	});
}

/**
 * 绘制折线图
 * @param {Object} data	需要绘制的折线图
 * @param {String} name	名字
 */
function setTwoRateKqi(data, name) {
	$('.CJ_main .wylxtxt').text(name);
	
	if(data[0]) {
		var option1 = ObjCopy(window.pageConfig.option.line);
		option1.xAxis.data = tranDate(data[0].value.startTime);
		option1.xAxis.axisLabel.interval = function(index,string){
			if((index % 12 === 0 && option1.xAxis.data.length-1-index > 4) || (index === (option1.xAxis.data.length-1))){
				return true;
			}else{
				return false;
			}
		}
		option1.series[0].data = judgeNum(data[0].value.now);
		option1.series[1].data = judgeNum(data[0].value.last);
		
		option1.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			offset: 0,
			color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
		}, {
			offset: 1,
			color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
		}], false);
		$('.CJ_main .line_title_text').eq(0).text(data[0].text);
		cj_line1 = echarts.init(document.getElementsByClassName('CJ_main')[0].getElementsByClassName('wyboxthree_1')[0]);
		cj_line1.setOption(option1);
	}
	if(data[1]) {
		var option2 = ObjCopy(window.pageConfig.option.line);
		option2.xAxis.data = tranDate(data[1].value.startTime);
		option2.xAxis.axisLabel.interval = function(index,string){
			if((index % 12 === 0 && option1.xAxis.data.length-1-index > 4) || (index === (option1.xAxis.data.length-1))){
				return true;
			}else{
				return false;
			}
		}
		option2.series[0].data = judgeNum(data[1].value.now);
		option2.series[1].data = judgeNum(data[1].value.last);
		option2.series[0].areaStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			offset: 0,
			color: 'rgba(67, 168, 161, 0.2)' // 0% 处的颜色
		}, {
			offset: 1,
			color: 'rgba(67, 168, 161, 0)' // 100% 处的颜色
		}], false);
		$('.CJ_main .line_title_text').eq(1).text(data[1].text);
		cj_line2 = echarts.init(document.getElementsByClassName('CJ_main')[0].getElementsByClassName('wyboxthree_2')[0]);
		cj_line2.setOption(option2);
	}
}


/**
 * 场景页面初始化
 */
window.CjPageInit = function CjPageInit(init_area) {
	CjEventBind();
	$(".myqipao").remove();   //15分钟刷新时清除打点气泡
	if(!window.sessionStorage.getItem("specialcj")){
		SEQAjax(window.pageConfig.ajaxUrl.keySceneSceneUserNum, {}, function(data) {
			if(data.statuCode === '200') {
				setSceneUserNum(data.data, function() {
					if(!curr_area) {
						curr_area = area_data[0].sceneName;
					}
					if(init_area) {
						if(init_area === "工业园(国家级)"){
							$(".scroll_main ul li").each(function(a,b){
								if($(b).find("h4").text() === "工业园(国家级)"){
									$(b).click();
								}
							})
						}else{
							$(`h4[data-name=${unescape(init_area)}]`).click();
						}
						transArea(init_area);
						return;
					}
					SEQAjax(window.pageConfig.ajaxUrl.sceneCustomArea, {
						bigSceneName: curr_area
					}, function(data) {
						if(data.statuCode === '200') {
							setSceneCustomArea(data.data);
						}
					});
					SEQAjax(window.pageConfig.ajaxUrl.twoRateKqi, {
						serviceType: 0,
						serviceValue: curr_area
					}, function(data) {
						if(data.statuCode === '200') {
							setTwoRateKqi(data.data, curr_area);
						}
					});
					transArea(init_area);
				});
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.keySceneChildSceneUserNum, {}, function(data) {
			if(data.statuCode === '200') {
				setChildSceneUserNum(data);
			}
		});
		window.sessionStorage.removeItem("specialcj");
	}else{
		SEQAjax(window.pageConfig.ajaxUrl.keySceneSceneUserNum, {}, function(data) {
			if(data.statuCode === '200') {
				setSceneUserNum(data.data);
			}
		});
		SEQAjax(window.pageConfig.ajaxUrl.keySceneChildSceneUserNum, {}, function(data) {
			if(data.statuCode === '200') {
				setChildSceneUserNum(data);
				$(".im_area .li_area").each(function(i,v){
					if($(v).find("h4").text() === window.sessionStorage.getItem("specialcj")){
						$(v).click();
						$(".scroll_main ul li").each(function(x,y){
							if($(y).find("h4").text() === $(v).find("h4").text()){
								$(y).addClass('sel').siblings().removeClass('sel');
								transArea($(y).find("h4").text());
							}
						})
						window.sessionStorage.removeItem("specialcj");
					}
				})
			}
		});
	}
}
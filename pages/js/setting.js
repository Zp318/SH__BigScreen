var confirmdata; //缓存请求到数据
var middledata; //中间变量
var all;
var spdata;
var alertimer;
//设置页面事件绑定
function SettingEventBind() {
	$('.setting_bg').off();
	$('.setting_bg *').off();
	$('.setting_bg').on('click', '.setting_head > li', function() {
		$(this).addClass('sel').siblings().removeClass('sel');
		$('.setting_main > div').eq($(this).index()).addClass('active').siblings().removeClass('active');
	});

	//各类网元、场景指标选择，有且只能选择两个
	$(".setting_page").on('mousedown', '.cjlistcell,.wylistcell', function(e) {
		e.stopPropagation();
		if($(this).parents().children(".listcell_active").length <= 2) {
			if($(this).hasClass("listcell_active")) {
				$(this).removeClass("listcell_active");
			} else if($(this).parents().children(".listcell_active").length < 2) {
				$(this).addClass("listcell_active");
			}
		}
		
		if($(this).hasClass("cjlistcell")){
			var cjindex = $(this).index();
			if($(this).hasClass("listcell_active")){
				middledata.data.scene.kqi[cjindex].show = true;
			}else{
				middledata.data.scene.kqi[cjindex].show = false;
			}
		}else if($(this).hasClass("wylistcell")){
			var wytitle = $(this).parents(".wy_set_model").attr("data-name");
			var wyindex = $(this).index();
			if($(this).hasClass("listcell_active")){
				middledata.data.netMeta[wytitle][wyindex].show = true;
			}else{
				middledata.data.netMeta[wytitle][wyindex].show = false;
			}
		}
	});
	
	//sp有且只能选择两个
	$(".setting_page").on('mousedown', '.sp_first_k .sp_right_right .sp_v', function(e) {
	    e.stopPropagation();
	    var spindex = $(this).index();
	    var sptitle = $(this).parents(".sp_first_k").attr("data-sp");
		if($(this).parents(".sp_right_right").children(".active").length <= 2) {
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
			}else if($(this).parents(".sp_right_right").children(".active").length < 2) {
				$(this).addClass("active");
			}
		}
		
		if($(this).hasClass("active")){
			middledata.data.sp.kqiList[sptitle][spindex].show = true;
		}else{
			middledata.data.sp.kqiList[sptitle][spindex].show = false;
		}
	});
	//点击sp类型时，出现选项
	$(".setting_page").on("mousedown",".sp_wrap .sp_type",function(e){
		  e.stopPropagation();
		if($(this).siblings("ul").hasClass("sp_type_active")){
			$(this).siblings("ul").removeClass("sp_type_active");
			$(this).removeClass("sp_type_s");
		}else{
		    $(this).siblings("ul").addClass("sp_type_active");
			$(this).addClass("sp_type_s");
		}
	});
	
	
	//微信只能选weixin QQ只能选QQ 其他SP不能选择weixin/QQ
	$(".setting_page").on("mouseenter", ".td_third_ul>li", function(e) {
		e.stopPropagation();
		if($(this).parent().parent().parent().attr("data-spname") === "WeChat_IM"){
			if($(this).text() !== "Weixin"){
				$(this).addClass("limouseenter");
			}else{
				$(this).addClass("liin");
			}
		}else if($(this).parent().parent().parent().attr("data-spname") === "QQ_IM"){
			if($(this).text() !== "QQ"){
				$(this).addClass("limouseenter");
			}else{
				$(this).addClass("liin");
			}
		}else{
			if($(this).text() !== "Weixin" && $(this).text() !== "QQ" && $(this).text() !== "/"){
				$(this).addClass("liin");
			}else{
				$(this).addClass("limouseenter");
			}
		}
	});
	
	$(".setting_page").on("mouseleave", ".td_third_ul>li", function(e) {
		e.stopPropagation();
		if($(this).parent().parent().parent().attr("data-spname") === "WeChat_IM"){
			if($(this).text() !== "Weixin"){
				$(this).removeClass("limouseenter");
			}else{
				$(this).removeClass("liin");
			}
		}else if($(this).parent().parent().parent().attr("data-spname") === "QQ_IM"){
			if($(this).text() !== "QQ"){
				$(this).removeClass("limouseenter");
			}else{
				$(this).removeClass("liin");
			}
		}else{
			if($(this).text() !== "Weixin" && $(this).text() !== "QQ"){
				$(this).removeClass("liin");
			}else{
				$(this).removeClass("limouseenter");
			}
		}
	});
	

	//点击tbody中的li时  只能选择对应的项目
	$(".setting_page").on("click", ".td_third_ul>li", function(e) {
		e.stopPropagation();
//		$(this).addClass("on").siblings().removeClass("on");
		if($(this).hasClass("liin")){
			var a = e.target.dataset.mes;
			$(this).parents('.td_third_ul').siblings(".td_third_name").text($(this).text());
			$(this).parents('.td_third_ul').removeClass("td_third_active");
			shishixiangyingshuru();
		}
	});
	//点击tbody中的td_third_name时，
	$(".setting_page").on("mousedown",".sp_wrap .td_third_name",function(e){
		e.stopPropagation();
		if($(this).parents("tr").index() === ($(".tbody_tbody").children().length - 2) && $(this).parents("tr").index() !== 0 && $(this).parents("tr").index() !== 1){
			$(this).next().css({"top":"-1.2rem","border":"solid 0.015rem #377270","border-bottom":"none","border-radius":"o.05rem"});
		}else if($(this).parents("tr").index() === ($(".tbody_tbody").children().length - 1) && $(this).parents("tr").index() !== 0 && $(this).parents("tr").index() !== 1){
			$(this).next().css({"top":"-1.2rem","border":"solid 0.015rem #377270","border-bottom":"none","border-radius":"0.05rem"});
		}
		
		//点击该下拉列表，其他列表隐藏
		$(this).parent().parent().siblings("tr").children(".td_third").children(".td_third_ul").removeClass('td_third_active');
		if($(this).siblings(".td_third_ul").hasClass("td_third_active")){
			$(this).siblings(".td_third_ul").removeClass("td_third_active");
		}else{
			$(this).siblings(".td_third_ul").addClass("td_third_active");
		}
		
		
	});

	//sp界面是否监控
	$(".setting_page").on("click",".tbody_tbody .td_check",function(){
		if($(this).hasClass("td_first")){
			$(this).removeClass("td_first").addClass("td_first1");
			$(this).siblings(".td_word").removeClass("word");
		}else{
			$(this).removeClass("td_first1").addClass("td_first");
			$(this).siblings(".td_word").addClass("word");
		}
		shishixiangyingshuru()
		jiankong();
	});
	

	
	
	//点击“是否监控按钮”
	$(".setting_page").on("click",".isjiankong",function(){
		if($(this).hasClass("bufenjiankong") || $(this).hasClass("nojiankong")){
			$(".sp_set .tbody_tbody tr .td_check").removeClass("td_first1").addClass("td_first");
			$(this).removeClass("bufenjiankong").removeClass("nojiankong").addClass("alljiankong");
		}else if($(this).hasClass("alljiankong")){
			$(".sp_set .tbody_tbody tr .td_check").removeClass("td_first").addClass("td_first1");
			$(this).removeClass("bufenjiankong").removeClass("alljiankong").addClass("nojiankong");
		}
		shishixiangyingshuru();
	});
	
	//sp界面input查询框
	$(".setting_page").on("keyup","#sp_input",function(){
		sp_input_search($(this).val());
		if( $(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length>6){
			$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
			$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
			$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69 +"rem")
			$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			$(" .tb_scroll_box .tb_scroll_center .scroll_drag").show();
		}else{
				if($(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length !== 5){
				$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
				$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
			}else{
				$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").find("tr").css("height","0.69rem")
				$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
				$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
			}
			$(".sp_set .tb_scroll_box .scroll_absolute").css("top","0px");
			$(".sp_set .tb_scroll_box .scroll_vertical_bar .scroll_drag").css("top","0px");
		}
		jiankong();
		shishixiangyingshuruback();
	});
	//定义SP界面SP类型搜索函数
    $(".setting_page").on("click", ".sp_type_ul > li",function () {
        sp_type_search($(this).html());
		if( $(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length>6){
			$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
			$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
			$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69 +"rem")
			$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			$(" .tb_scroll_box .tb_scroll_center .scroll_drag").show();
		}else{
				if($(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length !== 5){
				$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
				$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
			}else{
				$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",6*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").find("tr").css("height","0.69rem")
				$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
				$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
			}
			$(".sp_set .tb_scroll_box .scroll_absolute").css("top","0px");
			$(".sp_set .tb_scroll_box .scroll_vertical_bar .scroll_drag").css("top","0px");
		}
		jiankong();
		shishixiangyingshuruback();
    });

	//SP界面鼠标移入$(".filePicker")出现新样式;
	$(".setting_page").on("mouseover",".filePicker",function(){
		$(this).find("p").addClass("p_hide");
	}).mouseout(function (){
		$(this).find("p").removeClass("p_hide");
	});
	
	//点击刷新重新渲染SP配置表格
	$(".setting_page").on("click",".sp_refreshed",function(){
		SEQAjax(window.pageConfig.ajaxUrl.globalInfo, {}, function(data) {
			if(data.statuCode === "200") {
				sp_xuanran(data.data.sp.spList);
			}
		});
	});
	
	//阻止textarea的换行事件
	$(".setting_page").on("keydown","textarea",function(e){
		if(e.keyCode==13){
			e.stopPropagation();
			e.preventDefault();
		}
	});
	
	$(".setting_page").on("keyup","textarea",function(e){
		e.stopPropagation();
		var txtindex = $(this).parent(".text_area").index();
		middledata.data.allNet.opinion[txtindex] = $(this).val();
	});
	

	$(".setting_page").on("click", ".set_reset", function(e) {
		//重置配置界面
		$(".all_set .my_div").css("height","3rem");
		art_scroll();
		middledata = {};
		SEQAjax(window.pageConfig.ajaxUrl.resetConf, {}, function(data) {
			if(data.statuCode === "200") {
				allNetkey(data);
				allNetselect(data);
				setdata(data);
				$(".all_set .my_div").css("height","auto");
				art_scroll();
				sp_table(data);
			}
			window.location.reload();
		});	
	});
	
	$(".set_apply").off();
	//确定提交返回数据
	$(".setting_page").on("click", ".set_apply", function(e) {
		//选择数据正确才保存并提交数据
		if($(".same").eq(0).find(".span_color").length >= 1 && $(".same").eq(0).children(".span_color").length <=4 && $(".same").eq(1).find(".span_color").length >= 1 && $(".same").eq(1).children(".span_color").length <=4 && $(".same").eq(2).find(".span_color").length >= 1 && $(".same").eq(2).children(".span_color").length <=4 && $(".cj_set_modellist").children(".listcell_active").length === 2 && $(".wy_set_model").eq(0).children(".wy_set_modellist").children(".listcell_active").length === 2 && $(".wy_set_model").eq(1).children(".wy_set_modellist").children(".listcell_active").length === 2 && $(".wy_set_model").eq(2).children(".wy_set_modellist").children(".listcell_active").length === 2 && $(".wy_set_model").eq(3).children(".wy_set_modellist").children(".listcell_active").length === 2 && $(".wy_set_model").eq(4).children(".wy_set_modellist").children(".listcell_active").length === 2 && $(".sp_first_k").eq(0).children(".sp_right_right").children(".active").length === 2 && $(".sp_first_k").eq(1).children(".sp_right_right").children(".active").length === 2 && $(".sp_first_k").eq(2).children(".sp_right_right").children(".active").length === 2 && $(".sp_first_k").eq(3).children(".sp_right_right").children(".active").length === 2){
			shishixiangyingshuru();
			SEQAjax(pageConfig.ajaxUrl.UpdateConf, {
				"data": JSON.stringify(middledata.data)
			}, function(data) {
				if(isindex === 1){
					if($('.setting_bg').hasClass('active')) {
						$('.setting_bg').removeClass('active');
					}
					fromSetReturn();
				}else{
//					window.location.reload();
					//确认后返回之前的卡片
					if(pageindex === 0){
						if($('.setting_bg').hasClass('active')) {
							$('.setting_bg').removeClass('active');
						}
//						window.location.href = `${basePath}service/twoPage/index.action?page=cj`;
						window.location.href = `next.html?page=cj`;
					}else if(pageindex === 1){
						if($('.setting_bg').hasClass('active')) {
							$('.setting_bg').removeClass('active');
						}
//						window.location.href = `${basePath}service/twoPage/index.action?page=wy`;
						window.location.href = `next.html?page=wy`;
					}else if(pageindex === 2){
						if($('.setting_bg').hasClass('active')) {
							$('.setting_bg').removeClass('active');
						}
//						window.location.href = `${basePath}service/twoPage/index.action?page=sp`;
						window.location.href = `next.html?page=sp`;
					}
				}
				
			});
			$(".alert").text("");
			
		}else{
			$(".alert").text("选择数据指标有误，不能提交");
			clearTimeout(alertimer);
			alertimer = setTimeout(function(){
				$(".alert").text("");
			},2000);
		}
	});
	//全局设置绑定
	$('.setting_main').off();
	$('.setting_main').on('click', '.setting_head > li', function() {
		$(this).addClass('sel').siblings().removeClass('sel');
		$('.setting_main > div').eq($(this).index()).addClass('active').siblings().removeClass('active');
	});
	$('.setting_main').on('click', '.setting_center > li', function() {

		$(this).addClass('sel').removeClass('circle2').siblings("li").addClass('circle2').removeClass('sel');
		$('.setting_main').find(".same").eq($(this).index()).addClass('active').siblings(".same").removeClass('active');
	});
	$(".setting_main").on("click", ".b_right span", function() {
		var alarmindex = $(this).index();
		if($(this).hasClass("span_color") && !($(this).attr('data-fix') === 'true')) {
			$(this).removeClass("span_color");
			middledata.data.allNet.alarm[alarmindex].show = false;
		} else {
			$(this).addClass("span_color");
			middledata.data.allNet.alarm[alarmindex].show = true;
		}
		
	});



	$(".setting_main").on("mousedown", ".leftname", function(e) {
		e.stopPropagation();
		$(this).parents(".max1").siblings(".max1").children(".leftbox").children(".ul_scroll").addClass('hide');
		if($(this).siblings(".ul_scroll").find("ul").children().length > 6) {
			$(this).siblings(".ul_scroll").find("ul").css("height", $(this).siblings(".ul_scroll").find("ul").children().length * 0.23 + "rem");
			$(this).siblings(".ul_scroll").children(".ul_div_scroll").scroll_absolute({
				arrows: false,
				mouseWheelSpeed: 20
			});
			$(this).siblings(".ul_scroll").children("ul").addClass("add_scroll");
			$(this).siblings(".ul_scroll").css("height", "1.15rem");
		} else {
			$(this).siblings(".ul_scroll").css("height", $(this).siblings(".ul_scroll").find("ul").children().length * 0.23 + "rem");
		}
		if($(this).siblings(".ul_scroll").hasClass('hide')) {
			$(this).siblings(".ul_scroll").removeClass('hide');
		} else {
			$(this).siblings(".ul_scroll").addClass('hide');
		}
	});
	
	$(".setting_main").on("mouseenter", ".setting_cjcls>li", function() {
		$(this).addClass("every");
	});
	$(".setting_main").on("mouseleave", ".setting_cjcls>li", function() {
		$(this).removeClass("every");
	});
	$(".setting_main").on("click", ".setting_cjcls>li", function(e) {
		e.stopPropagation();
		$(this).addClass("on").siblings().removeClass("on");
		var a = e.target.dataset.mes;
		$(this).parents('.ul_scroll').siblings(".leftname").text($(this).text());
		$(this).parents(".ul_scroll").addClass('hide');
		var cjcode = $(this).index() + 1;
		$(this).parents('.leftbox').siblings(".top_div1").children(`.${a}`).show().siblings().hide();
		
		var diyiname = $(this).parents(".max1").attr("data-str");
		var dierindex = $(this).index();
		$(this).parent(".setting_cjcls").children().each(function(i,v){
			if(i === dierindex){
				middledata.data.allNet.thirdKeyKqi[diyiname][dierindex].show = true;
			}else{
				middledata.data.allNet.thirdKeyKqi[diyiname][i].show = false;
			}
		})
	});
	var whatkqi;
	var whatlx;
	var whatindex;
	$(".setting_main").on("click", ".leftboxs span", function() {
		var thisspan = $(this);
		//重新设置span的data-sett属性,以便kqi下的input值被保留下来
		$(".common_center_right .active .span_color").each(function(ind,ele){
			whatkqi = $(ele).parent().parent().parent().attr("data-str");
			whatlx = $(ele).parent().attr("data-web");
			whatindex = $(ele).index();
			$(ele).attr("data-sett",JSON.stringify(middledata.data.allNet.kqi[whatkqi][whatlx][whatindex]));
		});
		if(!$(this).hasClass("span_color")) {
			$(this).addClass("span_color");
		} else {
			$(this).removeClass("span_color");
		}
		var dom = $(this).parents(".same");
		var num = dom.find(".span_color").length;
		if(num > 4) {
			$(this).removeClass("span_color");
		}
		OutDl(dom);
		var erjiname = thisspan.parent().attr("data-web");
		var yijiname = thisspan.parents(".same").attr("data-str");
		if(thisspan.hasClass("span_color")){
			middledata.data.allNet.kqi[yijiname][erjiname][thisspan.index()].show = true;
		}else{
			middledata.data.allNet.kqi[yijiname][erjiname][thisspan.index()].show = false;
		}
	});
	
	$(".setting_bg").on('click', '.setting_main', function(e) {
		e.stopPropagation();
		if(!/leftname/.test(e.target.className)) {
			$(".ul_scroll").addClass('hide');
		}
		if(!/sp_type/.test(e.target.className)){
			$(".sp_type_ul").removeClass("sp_type_active");
			$(".sp_type").removeClass("sp_type_s");
		}
		if(!/td_third_name/.test(e.target.className)){
			$(".td_third_ul").removeClass("td_third_active");
		}
	});
	
//	$(".setting_bg").on('click', '.setting_main', function(e) {
//		e.stopPropagation();
//		if(!/leftname/.test(e.target.className)) {
//			$(".ul_scroll").addClass('hide');
//		}
//	});
	
	//全局三重点关键KQI指标阈值输入判断
	var alltopstr;
	$(".setting_page").on("focus",".setting_main .max1 input",function(){
		alltopstr=$(this).val();
	});
	$(".setting_page").on("blur",".setting_main .max1 input",function(){
		var thisone=this;
		var alltopreg=new RegExp($(this).parent().parent().siblings(".leftbox").find(".on").attr("data-myreg"),"i");
		var allindex=$(this).index()-1;

		//输入数字合法性
		if(!alltopreg.test($(this).val())){
			$(this).val(alltopstr);
			$(this).parent().parent().next().removeClass("hidden");
			setTimeout(function(){
				$(thisone).parent().parent().next().addClass("hidden");
			},2000);
		}
		//判断前后大小关系
		switch (allindex){
			case 0: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <=0){
				$(this).val(alltopstr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thisone).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			case 1: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <= Number($(this).prev().val())){
				$(this).val(alltopstr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thisone).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			case 2: if(Number($(this).val()) <= Number($(this).prev().val()) || Number($(this).val()) >= 10000){
				$(this).val(alltopstr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thisone).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			default:;
		}
		
		//失焦后更新数据middledata.data,以便点击切换kqi指标时保存input输入的合法值
		var erjiname = $(thisone).parent().parent().siblings(".leftbox").children(".leftname").text();
		var yijiname = $(thisone).parent().parent().parent().attr("data-str");
		var erjiindex;
		var sanjiindex = $(thisone).index();
		for(var m=0;m<middledata.data.allNet.thirdKeyKqi[yijiname].length;m++){
			if(middledata.data.allNet.thirdKeyKqi[yijiname][m].describle === erjiname){
				erjiindex = m;
			}
		}
		middledata.data.allNet.thirdKeyKqi[yijiname][erjiindex].threshold[sanjiindex] = +$(thisone).val();
		if(sanjiindex === 3){
			middledata.data.allNet.thirdKeyKqi[yijiname][erjiindex].threshold[4] = +$(thisone).val() * 2;
		}
	});
	
	//全局KQI指标阈值输入判断
	var allkqistr;
	$(".setting_page").on("focus",".top_right_box input",function(){
		allkqistr=$(this).val();

	});
	$(".setting_page").on("blur",".top_right_box input",function(){
		var thistwo=this;
		var allkqireg=new RegExp($(this).parent().siblings(".leftbottom_box").children("span").attr("data-kqireg"),"i");
		var allkqindex=$(this).index()-1;

		//输入数字合法性
		if(!allkqireg.test($(this).val())){
			$(this).val(allkqistr);
			$(this).parent().parent().next().removeClass("hidden");
			setTimeout(function(){
				$(thistwo).parent().parent().next().addClass("hidden");
			},2000);
		}
		//判断前后大小关系
		switch (allkqindex){
			case 0: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <=0){
				$(this).val(allkqistr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thistwo).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			case 1: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <= Number($(this).prev().val())){
				$(this).val(allkqistr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thistwo).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			case 2: if(Number($(this).val()) <= Number($(this).prev().val()) || Number($(this).val()) >= 10000){
				$(this).val(allkqistr);
				$(this).parent().parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thistwo).parent().parent().next().addClass("hidden");
				},2000);
			}
			break;
			default:;
		}
		
		
		//失焦后更新数据middledata.data,以便点击切换kqi指标时保存input输入的合法值
		$(".same").each(function(ii, vv) {
			if($(vv).hasClass("active")) {
				var allnetg = $(vv).attr("data-str"); //allNet 3G 4G
				$(vv).children(".add_cjboxx").each(function(a, b) {
					var allnetname = $(b).children(".leftboxs").attr("data-web"); //Web Streaming IM
					$(b).children(".leftboxs").children("span").each(function(c, d) {
						if($(d).hasClass("span_color")) {
							middledata.data.allNet.kqi[allnetg][allnetname][c].show = true;
							$(vv).find(".bottom_box").children("dl").each(function(e, f) {
								if($(f).children(".leftbottom_box").children("span").text() === $(d).text()) {
									if($(f).children(".leftbottom_box").children("span").attr("data-kqireg").replace(/\\/gi,"") == "^(0|100|(([1-9][0-9]?)(\.\d{1,2})?))$"){
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[1] = Number($(f).children(".top_right_box").children("input").eq(0).val());
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[2] = Number($(f).children(".top_right_box").children("input").eq(1).val());
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[3] = Number($(f).children(".top_right_box").children("input").eq(2).val());
										if(Number($(f).children(".top_right_box").children("input").eq(2).val()) * 2 >= 100){
											middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[4] = 100;
										}else{
											middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[4] = Number($(f).children(".top_right_box").children("input").eq(2).val()) * 2;
										}
									}else{
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[1] = Number($(f).children(".top_right_box").children("input").eq(0).val());
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[2] = Number($(f).children(".top_right_box").children("input").eq(1).val());
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[3] = Number($(f).children(".top_right_box").children("input").eq(2).val());
										middledata.data.allNet.kqi[allnetg][allnetname][c].threshold[4] = Number($(f).children(".top_right_box").children("input").eq(2).val()) * 2;
									}
								}
							})
						} else {
							middledata.data.allNet.kqi[allnetg][allnetname][c].show = false;
						}
					})
				})
			}
		})
	});
	
	//重点场景小区用户数指标阈值输入判断
	var cjpzstr;
	$(".setting_page").on("focus",".cj_set_two input",function(){
		cjpzstr=$(this).val();
	});
	$(".setting_page").on("blur",".cj_set_two input",function(){
		var thisthree=this;
		var cjpzreg=new RegExp("^(0|([1-9][0-9]{0,5}))$","i");
		var cjpzindex=$(this).index()-1;
		//输入数字合法性
		if(!cjpzreg.test($(this).val())){
			$(this).val(cjpzstr);
			$(this).parent().next().removeClass("hidden");
			setTimeout(function(){
				$(thisthree).parent().next().addClass("hidden");
			},2000);
		}
		//判断前后大小关系
		switch (cjpzindex){
			case 0: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <=0){
				$(this).val(cjpzstr);
				$(this).parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thisthree).parent().next().addClass("hidden");
				},2000);
			}
			break;
			case 1: if(Number($(this).val()) >= Number($(this).next().val()) || Number($(this).val()) <= Number($(this).prev().val())){
				$(this).val(cjpzstr);
				$(this).parent().next().removeClass("hidden");
				setTimeout(function(){
					$(thisthree).parent().next().addClass("hidden");
				},2000);
			}
			break;
			default:;
		}
		middledata.data.scene.threshold[$(thisthree).index()] = +$(thisthree).val();
		if($(thisthree).index() === 2){
			middledata.data.scene.threshold[3] = +$(thisthree).val()*2;
		}
	});
}


//sp界面上传功能
function SP_img_up(){
    var $fp = $(".filePicker");
    var uploaders = [];
    $fp.each(function(i, e){
        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,
            pick: e,
			//验证单个文件大小是否超出限制, 超出则不允许加入队列。
			fileSingleSizeLimit:20*1024,
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });
		/**
		 * 验证文件格式以及文件大小
		 */
		uploader.on("error",function (type,value){
			$li=$(".sp_img").eq(i);
			if (type=="Q_TYPE_DENIED"){
				    $li.children("span").html("请上传JPG、PNG格式文件").show();
				setTimeout(function(){
					$li.children("span").hide();
				},2000);
			}else if(type=="F_EXCEED_SIZE"){
				    $li.children("span").html("文件大小不能超过20K").show();
				setTimeout(function(){
					$li.children("span").hide();
				},2000);
			}
		});
		//上传图片以及图片地址
        uploader.on( 'fileQueued', function( file, e ) {
            $li=$(".sp_img").eq(i);
            uploader.makeThumb( file, function( error, ret ) {
                if ( error ) {
                	$li.text('预览错误');
                } else {
					$li.children("img").attr("src",ret);
                }
            });
        });
        uploaders.push(uploader);
    });
}


//封装场景数据插入的函数
function setdata(data) {
	confirmdata = ObjCopy(data);
	//封装场景数据插入的函数
	$(".cj_set_model>.cj_set_modellist").html("");
	$(".cj_set_two3").val("");
	//用户数渲染
	$(".cj_set_two3").eq(0).val(confirmdata.data.scene.threshold[1]);
	$(".cj_set_two3").eq(1).val(confirmdata.data.scene.threshold[2]);
	//场景各指标渲染
	for(var index = 0; index < confirmdata.data.scene.kqi.length; index++) {
		var cjcelltemp = `<div class="cjlistcell ${confirmdata.data.scene.kqi[index].show ? 'listcell_active':''}">${confirmdata.data.scene.kqi[index].describle}</div>`
		$(".cj_set_modellist").append(cjcelltemp);
	}
	//封装网元类型各指标数据插入
	$(".wy_set_model>.wy_set_modellist").html("");
	$(".wy_set_model").each(function(i, v) {
		var settingwylx = v.dataset.name;
		var everywydata = confirmdata.data.netMeta[settingwylx];
		for(var index = 0; index < everywydata.length; index++) {
			var wycelltemp = `<div class="wylistcell ${everywydata[index].show ? 'listcell_active': ''}" >${everywydata[index].describle}</div>`
			$(v).children(".wy_set_modellist").append(wycelltemp);
		}
	})
}



//判断是否监控
function jiankong(){
	var jiankong=0;
	var weijiankong=0;
	$(".td_check").each(function(i,v){
		if($(v).hasClass("td_first")){
			jiankong++;
		}else{
			weijiankong++;
		}
	});
	if(jiankong === 0){
		$(".isjiankong").addClass("nojiankong").removeClass("alljiankong").removeClass("bufenjiankong");
	}else if(weijiankong === 0){
		$(".isjiankong").addClass("alljiankong").removeClass("nojiankong").removeClass("bufenjiankong");
	}else if(weijiankong !== 0 && jiankong !== 0){
		$(".isjiankong").addClass("bufenjiankong").removeClass("alljiankong").removeClass("nojiankong");
	}
}

//全局设置方法
/*my_article滚动条*/
function art_scroll() {
	$(".all_set .con_scroll .con_div_scroll").scroll_absolute({
		arrows: false,
		mouseWheelSpeed: 20,
	});
}


//定义SP界面Input搜索函数
function sp_input_search(str){
	spdata=middledata.data.sp.spList;
	str = str.trim();
	if(str ===""){
		sp_xuanran(spdata);
	}else{
		var arr =[];
		spdata.forEach(function(v,i){
			if(v.alias.indexOf(str) != -1){
				arr.push(v)
			}
		});
		sp_xuanran(arr);
	}
}
//定义SP界面改变table部分
//SP界面类型搜索
function sp_type_search(str){
	spdata=middledata.data.sp.spList;
	if(str ==="ALL"){
		sp_xuanran(spdata);
	}else{
		var arr =[];
		spdata.forEach(function(v,i){
			if(v.serviceType === str){
				arr.push(v)
			}
		});
		sp_xuanran(arr);
	}

}
//sp界面渲染
function sp_table(data){
	$(".sp_first_k > .sp_right_right").html("");
	//趋势图指标选择渲染
	$(".sp_first_k").each(function(i,v){
		var sp_first_name = v.dataset.sp;
		var spdata = middledata.data.sp.kqiList[sp_first_name];
		for(var index = 0;index < spdata.length;index++){
			var sp_first_temp=`<div class="sp_v  ${spdata[index].show ? 'active' : ''}">${spdata[index].describle}</div>`;
			    $(v).children(".sp_right_right").append(sp_first_temp);
		}
	});
	sp_xuanran(middledata.data.sp.spList);
	jiankong();
}
//table渲染
function sp_xuanran(data){
	//table部分渲染
	$(".tbody_tbody").html("");
	data.forEach(function(v, i){
		var src = v.icon || basePath + 'pages/imgs/moren.png';
		var temp=`<tr data-spname="${v.name}">
				<td class="${v.checked  ?  'td_first': 'td_first1'} td_check " data-spname="${v.name}"></td>
				<td>${v.alias}</td>
				<td class="td_third">
				<div class="td_third_name" data-spname="${v.name}">${v.serviceType}</div>
				<ul class="td_third_ul">
					<li>Web</li>
					<li>Streaming</li>
					<li>Weixin</li>
					<li>QQ</li>
					<li>Other</li>
				</ul>
				</td>
				<td class="sp_img" data-spname="${v.name}"><img src=${src}><span></span></td>
				<td class="filePicker p_show"><i><i/><p></p></td>
				</tr>`;

		$(".tbody_tbody").append($(temp));
	});
	SP_img_up();
	jiankong();
}



//页面上保存点击的信息
function shishixiangyingshuru(){
	$(".tbody_tbody > tr").each(function(i,v){		
		for (var j=0; j<middledata.data.sp.spList.length; j++){
			if(middledata.data.sp.spList[j].name === $(v).attr("data-spname")){
			
				//是否监控
				if($(v).children(".td_check").hasClass("td_first")){
					middledata.data.sp.spList[j].checked = true;
				}else if($(v).children(".td_check").hasClass("td_first1")){
					middledata.data.sp.spList[j].checked = false;
				}
				
				//SP类型
				middledata.data.sp.spList[j].serviceType = $(v).children(".td_third").children(".td_third_name").text();
				
				//上传的图片
				middledata.data.sp.spList[j].icon = $(v).children(".sp_img").children("img").attr('src');
			}
		}
	});
}


//重新读取保存的信息
function shishixiangyingshuruback(){
	$(".tbody_tbody > tr").each(function(i,v){		
		for (var j=0; j<middledata.data.sp.spList.length; j++){
			if(middledata.data.sp.spList[j].name === $(v).attr("data-spname")){
				//是否监控
				if(middledata.data.sp.spList[j].checked === true){
					$(v).children(".td_check").removeClass("td_first1").addClass("td_first")
				}else if(middledata.data.sp.spList[j].checked === false){
					$(v).children(".td_check").removeClass("td_first").addClass("td_first1");
				}
				
				//SP类型
				$(v).children(".td_third").children(".td_third_name").text(middledata.data.sp.spList[j].serviceType);
				
				//上传的图片
				$(v).children(".sp_img").children("img").css('src',middledata.data.sp.spList[j].icon);
			}
		}
	});
}



/*限制字数*/
function limitEvent(field) {
	var max = 30;
	if(field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word").text(num);
}
/*限制字数1*/
function limitEvent1(field) {
	var max = 30;
	if(field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word1").text(num);
}
/*限制字数2*/
function limitEvent2(field) {
	var max = 30;
	if(field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 30 - field.value.length;
	$(".word2").text(num);
}
//全局页面数据绑定
function allNetkey(data) {
	//舆情绑定
	$('textarea').each(function(i, v) {
		$(v).val(middledata.data.allNet.opinion[i]);
		switch(i) {
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
	middledata.data.allNet.alarm.forEach(function(v, i) {
		var temp = `<span data-id="${v.name}" class="${v.show ? 'span_color' : ''}" data-fix="${v.fixed}">${v.describle}</span>`;
		$('.b_right').append($(temp));
		all = middledata.data.allNet.thirdKeyKqi;
		$(".my_ul >.setting_cjcls").html('');

	});
	
	$(".max1").each(function(i, v) {
		var show_index = null;
		var se = $(this).attr("data-str");
		var _index = $(this).index();
		$(".top_div1").eq(_index).html("");
		all[se].forEach(function(value, index) {
			$(".common_top > ul").html("");
			var temp = `<li data-mes=${value.name} data-id=${value.id} data-myreg=${value.regex}>${value.describle}</li>`;

			$(v).find(".setting_cjcls").append($(temp));
			if(value.show) {
				show_index = index;
			}
			var div_change = `<div class=${value.name} data-id=${value.id}>
						<i class="${value.desc ? 'img1' : 'img'}"></i>
						<input type="text" style="margin-left:1.1rem;" value=${value.threshold[1]} class="inp1">
						<input type="text" style="margin-left:0.28rem;" value=${value.threshold[2]} class="inp2">
						<input type="text" style="margin-left:0.35rem;" value=${value.threshold[3]} class="inp3">
						</div>`;
			$(".top_div1").eq(_index).append($(div_change));
		});
		if(show_index == null) {
			$(".top_div1").eq(_index).children('div').hide()
		} else {
			$(".top_div1").eq(_index).children().eq(show_index).siblings().hide();
			$(".leftbox >.leftname").eq(_index).text(`${all[se][show_index].describle}`);
			$(v).find(".setting_cjcls>li").eq(show_index).addClass("on");
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
		var temp = `<span data-id=${v.name} data-type="${type}" data-sett='${vStr}' class="${v.show ? 'span_color' : ''}">${v.describle}</span>`;
		dom.append($(temp));
	});
}
/**
 * kqi选择读取数据
 * @param data 需要设置的数据
 *
 */
function allNetselect(data) {
	var all = middledata.data.allNet.kqi;
	setAllNetData(all['allNet'], 'allNet');
	setAllNetData(all['3G'], '3G');
	setAllNetData(all['4G'], '4G');
}



/**
 * 设置网络选项
 * @param data 需要设置的数据
 * @param index 索引
 */
function setAllNetData(data, index) {
	var _dom = $(`.same[data-str=${index}]`);
	var _num = 0;
	for(var i in data) {
		setChildData(data[i], _dom.find(`.leftboxs[data-web=${i}]`).eq(0), _num);
		_num++;
	}
	OutDl(_dom)
}
/**
 * 渲染有色span
 * @param dom 父亲节点
 */
function OutDl(dom) {
	dom.find(".bottom_box").html("");
	dom.find(".span_color").each(function(i,indexk) {
		var v = JSON.parse($(this).attr("data-sett"));
		var temp = `<dl data-type="${$(this).attr("data-type")}" data-id=${v.id} > <div class="leftbottom_box">
				<span data-kqireg="${v.regex}">${v.describle}</span>
				</div>
				<div class="top_right_box">
				<i class="${v.desc ? 'img1' : 'img'}"></i>
				<input type="text" style="margin-left:1.1rem;" value=${v.threshold[1]}>
				<input type="text" style="margin-left:0.28rem;" value=${v.threshold[2]}>
				<input type="text" style="margin-left:0.35rem;" value=${v.threshold[3]}>
				</div></dl>
		        <span class="span hidden">您输入的数据有误</span>`;
		dom.find(".bottom_box").append($(temp));
	});

}

//初始化接口
window.settingPageInit = function settingPageInit() {
	SettingEventBind();
	
	$(".all_set .my_div").css("height","3rem");
	art_scroll();
	middledata = {};
	SEQAjax(window.pageConfig.ajaxUrl.globalInfo, {}, function(data) {
		if(data.statuCode === "200") {
			middledata = ObjCopy(data);
			allNetkey(data);
			allNetselect(data);
			setdata(data);
			$(".all_set .my_div").css("height","auto");
			art_scroll();
			sp_table(data);
			
			if( $(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length>6){
				$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
				$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69 +"rem")
				$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
					arrows: false,
					mouseWheelSpeed: 20
				});
				$(" .tb_scroll_box .tb_scroll_center .scroll_drag").show();
			}else{
					if($(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length !== 5){
					$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
					$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
					$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",$(".setting_page").find(".sp_wrap").find(".tbody_tbody").children("tr").length*0.69+"rem")
					$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
				}else{
					$(".setting_page").find(".sp_wrap").find(".tbody_tbody").css("height",6*0.69+"rem")
					$(".setting_page").find(".sp_wrap").find(".table_tbody").css("height",6*0.69+"rem")
					$(".setting_page").find(".sp_wrap").find(".scroll_container").css("height",6*0.69+"rem")
					$(".setting_page").find(".sp_wrap").find(".scroll_container").find("tr").css("height","0.69rem")
					$(" .tb_scroll_box .tb_scroll_center").scroll_absolute({
						arrows: false,
						mouseWheelSpeed: 20
					});
					$(" .tb_scroll_box .tb_scroll_center .scroll_drag").hide();
				}
				$(".sp_set .tb_scroll_box .scroll_absolute").css("top","0px");
				$(".sp_set .tb_scroll_box .scroll_vertical_bar .scroll_drag").css("top","0px");
			}
		}
	});
}

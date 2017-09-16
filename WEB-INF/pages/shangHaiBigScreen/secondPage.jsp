<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="_csrf" content="${_csrf.token}" />
		<meta name="_csrf_header" content="${_csrf.headerName}" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>上海业务质量大屏</title>
		<%@include file="../common/sweet.jsp"%>
		<link rel="stylesheet" href="<%=basePath%>/pages/css/bootstrap.min.css">
		<!--<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/common.css">
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/next.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/next_wangyuan.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/next_sp_main.css">
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/next_cj.css" />-->
		<link rel="stylesheet" type="text/css" media="(max-width: 1200px)" href="<%=basePath%>pages/css/common_1024.css">
		<link rel="stylesheet" type="text/css" media="(max-width: 1200px)" href="<%=basePath%>pages/css/next_1024.css" />
		<link rel="stylesheet" type="text/css" media="(max-width: 1200px)" href="<%=basePath%>pages/css/next_wangyuan_1024.css" />
		<link rel="stylesheet" type="text/css" media="(max-width: 1200px)" href="<%=basePath%>pages/css/next_sp_main_1024.css">
		<link rel="stylesheet" type="text/css" media="(max-width: 1200px)" href="<%=basePath%>pages/css/next_cj_1024.css" />
		
		<link rel="stylesheet" type="text/css" media="(min-width: 1200px)" href="<%=basePath%>pages/css/common.css">
		<link rel="stylesheet" type="text/css" media="(min-width: 1200px)" href="<%=basePath%>pages/css/next.css" />
		<link rel="stylesheet" type="text/css" media="(min-width: 1200px)" href="<%=basePath%>pages/css/next_wangyuan.css" />
		<link rel="stylesheet" type="text/css" media="(min-width: 1200px)" href="<%=basePath%>pages/css/next_sp_main.css">
		<link rel="stylesheet" type="text/css" media="(min-width: 1200px)" href="<%=basePath%>pages/css/next_cj.css" />
		
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/leaflet.css"/>
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/leaflet.draw.css"/>
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/webuploader.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/daterangepicker.css"/>
		<script type="text/javascript" src="<%=basePath%>pages/lib/jquery-3.1.0.min.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/js/common.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/moment.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/daterangepicker.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/bootstrap.min.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/webuploader.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/jquery.tablescroll.js"></script>
		<script src="<%=basePath%>pages/lib/mousewheel.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/easyscroll.js" type="text/javascript" charset="utf-8"></script>
	</head>

	<body>
		<div id="dc_cancle_shaow">
		</div>
		<div class="daochu">
			<p class="line">导出设置<span class="span_close">X</span></p>
			<p class="input_center">
				<label>时间：</label>
				<input type="text" id="startTime" name="startTime">
				<label>-</label>
				<input type="text" id="endTime" name="endTime">
			<p class="daochu_bottom">
				<button class="export_sure">导出</button>
			</p>
		</div>
		<header>
			<div class="title center">
				<a onclick="PageInit()"><i></i>上海联通业务质量管理平台</a>
			</div>
			<div class="f_left">
				<div class="f_left">舆情：</div>
				<div class="f_left information">
					<ul></ul>
				</div>
			</div>
			<div class="f_right">
				<div class="countDownTimer f_left">
					<div class="lastUpdateTime">上次更新时间:<span class="font_num"></span><em class="font_num"></em></div>
					<div class="nextUpdateTime"><i></i>下次更新倒计时:<span class="font_num"></span></div>
				</div>
				<div class="setAndImport f_left">
					<i class="import"></i>
					<i class="setting"></i>
				</div>
			</div>
		</header>
		<article>
			<ul class="f_left">
				<li class="CJ_card" data-str="scene">
					<i class="retrun"></i>
					<h3><i></i>重点场景</h3>
					<div class="card_main">
						<h4></h4>
						<div class="circle_data">
							<p class="font_chart"></p>
							<span class="font_chart_up_down_b"></span>
							<div class="circle_main"></div>
							<div class="circle_main2"></div>
							<div class="circle_out"></div>
							<p class="circle_grade"></p>
						</div>
						<div class="secondquxian"></div>
					</div>
					<div class="card_bot">
						<div class="card_bot_l">
							<h5><i></i>影响用户数</h5>
							<p class="font_chart_up_down"></p>
						</div>
						<div class="card_bot_r">
							<h5><i></i>工单状态</h5>
							<div class="all_work">
								<div class="work_l"></div>
							</div>
							<p></p>
						</div>
					</div>
				</li>
				<li class="WY_card" data-str="netMeta">
					<h3><i></i>重点网元</h3>
					<div class="card_main">
						<h4></h4>
						<div class="circle_data">
							<p class="font_chart"></p>
							<span class="font_chart_up_down_b"></span>
							<div class="circle_main"></div>
							<div class="circle_main2"></div>
							<div class="circle_out"></div>
							<p class="circle_grade"></p>
						</div>
						<div class="secondquxian"></div>
					</div>
					<div class="card_bot">
						<div class="card_bot_l">
							<h5><i></i>影响用户数</h5>
							<p class="font_chart_up_down"></p>
						</div>
						<div class="card_bot_r">
							<h5><i></i>工单状态</h5>
							<div class="all_work">
								<div class="work_l"></div>
							</div>
							<p></p>
						</div>
					</div>
				</li>
				<li class="SP_card" data-str="sp">
					<h3><i></i>重点SP</h3>
					<div class="card_main">
						<h4></h4>
						<div class="circle_data">
							<p class="font_chart"></p>
							<span class="font_chart_up_down_b"></span>
							<div class="circle_main"></div>
							<div class="circle_main2"></div>
							<div class="circle_out"></div>
							<p class="circle_grade"></p>
						</div>
						<div class="secondquxian"></div>
					</div>
					<div class="card_bot">
						<div class="card_bot_l">
							<h5><i></i>影响用户数</h5>
							<p class="font_chart_up_down"></p>
						</div>
						<div class="card_bot_r">
							<h5><i></i>工单状态</h5>
							<div class="all_work">
								<div class="work_l"></div>
							</div>
							<p></p>
						</div>
					</div>
				</li>
			</ul>
			<div class="next_main f_right">
				<div class="CJ_main">
					<div class="CJ_map" id="map"></div>
					<ul class="sort_menu">
						<li>排序</li>
						<li class="sel"><label><input type="radio" name="sort" checked="checked" />影响用户数</label></li>
						<li><label><input type="radio" name="sort" />处理中</label></li>
						<li><label><input type="radio" name="sort" />业务修复</label></li>
					</ul>
					<div class="scroll_list">
						<i class="scroll_l"></i>
						<div class="scroll_main">
							<ul>
							</ul>
						</div>
						<i class="scroll_r"></i>
					</div>
					<div class="user_set_area">
						<h4>
							<span>场景</span>
							<span>影响用户数</span>
							<span>工单跟踪</span>
						</h4>
						<div class="area_list">
							<ul>
							</ul>
						</div>
					</div>
					<div class="im_area">
					</div>
					<div class="wybox">
						<div class="wyboxone">
							<div class="wy_box_headerone"><span class="wylxtxt"></span><span>KQI趋势</span></div>
							<div class="wy_box_headertwo on_center"></div>
							<div class="wy_box_headerthree on_center"></div>
						</div>
						<div class="auto_box">
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
							<div class="wyboxfour">
								<div class="wyboxfour_tb">
									<div class="containerbig">
										<div class="div_scrollY">
											<div class="outer">
												<div class="mybox">
													<div class="tableonebox">
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
														<div class="tabletwobox">
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
					</div>
					
					<!--重点场景点击删除的遮罩层-->
					<div id="cancle_shaow">
					</div>
					<!--重点场景点击删除出现弹出框-->
					<div id="cancle_choose">
						<div class="cc_notice">
							<span>提示</span>
							<div class="cc_canclebox"><b class="cc_cancle"></b></div>
						</div>
						<div class="cc_pic"><img src="<%=basePath%>pages/imgs/cc_cancle_notice.png"></div>
						<div class="cc_txt">是否确认删除？</div><br />
						<button class="cc_qr">确认</button>
						<button class="cc_qx">取消</button>
					</div>
					<!--重点场景点击增加出现弹出框-->
					<div id="add_choose">
						<div class="add_notice">
							<span>添加特别关注场景</span>
							<div class="add_canclebox"><b class="add_cancle"></b></div>
						</div>
						<div class="add_cjbox">
							<div class="add_style add_cjlx">场景类型 ：</div>
							<div class="leftbox">
								<div class="add_style add_cjname" id="leftname"></div>
								<div class="add_style add_cjpic add_cjpicone"><img src="<%=basePath%>pages/imgs/pull_down.png"></div>
			
								<div class="containerone">
									<div class="scrollone">
										<div class="scrollboxone">
											<ul class="add_style add_cjcls"></ul>
										</div>
									</div>
								</div>
							</div>
			
							<div class="add_style add_cjlx" style="margin-left: 0.16rem;">场景 ：</div>
							<div class="rightbox">
								<input type="text" class="add_style add_cjname" style="width: 0.94rem;" id="rightname">
								<div class="add_style add_search"><img src="<%=basePath%>pages/imgs/cj_search.png"></div>
								<div class="add_style add_cjpic add_cjpictwo"><img src="<%=basePath%>pages/imgs/pull_down.png"></div>
			
								<div class="containertwo">
									<div class="scrolltwo">
										<div class="scrollboxtwo">
											<ul class="add_style add_cjclsdd"></ul>
										</div>
									</div>
								</div>
							</div>
						</div>
						<button class="add_qr">确认</button>
						<button class="add_qx">取消</button>
					</div>
					
				</div>
				<div class="WY_main">
					<div class="wyback"></div>
					<div class="wyback2"></div>
					<div class="wyback3"></div>
					<div class="wybox">
						<div class="wyboxone">
							<div class="wy_box_headerone"><span class="wylxtxt">MME</span><span>业务质量趋势</span></div>
							<div class="wy_box_headertwo on_center"></div>
							<div class="wy_box_headerthree on_center"></div>
						</div>
						<div class="auto_box">
							<div class="wyboxtwo">
								<div class="line_title">
									<i class="line_rect"></i>
									<span class="line_title_text">Web页面响应成功率</span>
									<span class="line_solid"></span>
									<span class="line_now">当前值</span>
									<span class="line_dashed"></span>
									<span class="line_after">上周同比值</span>
								</div>
								<div class="line_title">
									<i class="line_rect"></i>
									<span class="line_title_text">Web页面响应成功率</span>
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
							<div class="wyboxfour">
								<div class="wyboxfour_tb">
									<div class="containerbig">
										<div class="div_scrollY">
											<div class="outer">
												<div class="mybox">
													<div class="tableonebox">
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
														<div class="tabletwobox">
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
					</div>
					<div class="wypicbox"></div>
					<div class="wypicbox_1 wylx" data-num="3" data-lx="SGW"></div>
					<div class="wypicbox_2 wylx" data-num="2" data-lx="GGSN"></div>
					<div class="wypicbox_3 wylx" data-num="1" data-lx="SGSN"></div>
					<div class="wypicbox_4 wylx" data-num="4" data-lx="RNC"></div>
					<div class="wypicbox_5 wylx wypicbox_active" data-num="0" data-lx="MME"></div>
					
					<div class="wyjnbox_3 wyjn" data-num="3"></div>
					<div class="wyjnbox_2 wyjn" data-num="2"></div>
					<div class="wyjnbox_1 wyjn" data-num="1"></div>
					<div class="wyjnbox_4 wyjn" data-num="4"></div>
					<div class="wyjnbox_0 wyjn" data-num="0"></div>
				</div>
				<div class="SP_main">
					<div class="wyback2"></div>
					<div class="wyback3"></div>
					<div class="banner">
						<span class="banner_whole first">全部</span>
						<span class="banner_tv" data-id="视频">视频</span>
						<span class="banner_news" data-id="门户">门户新闻</span>
						<span class="banner_trip" data-id="旅游">旅游</span>
						<span class="banner_electricity" data-id="电商">电商</span>
						<span class="banner_im" data-id="即时通信">IM</span>
						<span class="banner_taxi" data-id="打车">打车</span>
						<span class="banner_search" data-id="搜索">搜索</span>
						<span class="banner_shejiao" data-id="社交">社交</span>
					</div>
					<div class="SP_list">
						<div class="SP_list_scroll"></div>
					</div>
				</div>
			</div>
		</article>
		<div class="setting_bg">
			<div class="setting_page">
				<ul class="setting_head">
					<li class="sel">全局</li>
					<li>重点场景</li>
					<li>重点网元</li>
					<li>重点SP</li>
				</ul>
				<div class="alert"></div>
				<div class="setting_main">
					<div class="all_set active">
						<div class="con_scroll">
							<div class="con_div_scroll">
								<div class="my_div">
									<div class="my_article">
										<div class="common_top">
												<div class="common_top_left">三重点关键KQI指标选择:</div>
												<div class="common_top_right">
														<div class="max1" data-str="scene">
															<div class="common_top_scene">重点场景</div>
															<div class="leftbox">
																<div class="leftname"></div>
																<div class="ul_scroll hide">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
															<span class="hidden">您输入的数据有误</span>
														</div>
														<div class="max1" data-str="netMeta">
															<div class="common_top_scene">重点网元</div>
															<div class="leftbox">
																<div class="leftname"></div>
																<div class="ul_scroll hide">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
															<span class="hidden">您输入的数据有误</span>
														</div>
														<div class="max1" data-str="sp">
															<div class="common_top_scene">重点SP</div>
															<div class="leftbox">
																<div class="leftname"></div>
																<div class="ul_scroll hide">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
															<span class="hidden">您输入的数据有误</span>
														</div>
												</div>
										</div>
										<div class="common_center">
											<div class="common_center_left">
												KQI选择(1~4个):
											</div>
											<div class="common_center_right">
												<ul class="setting_center">
													<li class="sel">全网</li>
													<li class="circle2">4G</li>
													<li class="circle2">3G</li>
												</ul>
												<div class="same active" data-str="allNet">
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Web:</div>
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Streaming:</div>
														<div class="leftboxs" data-web="stream">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-web="webChat">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Other:</div>
														<div class="leftboxs" data-web="ResidentRatio">
														</div>
													</div>
													<div class="bottom_box">
													</div>
												</div>
												
												<div class="same" data-str="4G">
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Web:</div>
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Streaming:</div>
														<div class="leftboxs" data-web="stream">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-web="webChat">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Other:</div>
														<div class="leftboxs" data-web="ResidentRatio">

														</div>
													</div>
													<div class="bottom_box">

													</div>
												</div>
												<div class="same" data-str="3G">
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Web:</div>
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Streaming:</div>
														<div class="leftboxs" data-web="stream">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-web="webChat">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Other:</div>
														<div class="leftboxs" data-web="ResidentRatio">

														</div>
													</div>
													<div class="bottom_box">

													</div>
												</div>
											</div>
										</div>
										<div class="common_bottom">
											<div class="common_bottom_left">舆情信息设置:</div>
											<div class="common_bottom_right">
												<div class="text_area">
													<textarea oninput="limitEvent(this)" ></textarea>
													<p>(你还可以输入字数:<span class="word">50</span>)</p>
												</div>
												<div class="text_area">
													<textarea oninput="limitEvent1(this)" ></textarea>
													<p>(你还可以输入字数:<span class="word1">50</span>)</p>
												</div>
												<div class="text_area">
													<textarea oninput="limitEvent2(this)" ></textarea>
													<p>(你还可以输入字数:<span class="word2">50</span>)</p>
												</div>
											</div>

											 <div class="common_bottom_alert">告警选择:</div>
											 <div class="b_right">
														<span>流水号</span>
											 </div>

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="cj_set">
						<div class="cjset_firstline">
							<div class="cj_set_one">影响用户数小区分布:</div>
							<div class="cj_set_two">
								<div class="cj_set_two1"></div>
								<input type="text" class="cj_set_two3 cj_set_two3_1"/>
								<input type="text" class="cj_set_two3 cj_set_two4 cj_set_two3_2"/>
							</div>
							<span class="hidden">您输入的数据有误</span>
						</div>
						
						<div class="cjset_secondline">
							<div class="cj_set_one">小区关键KQI指标选择(2个):</div>
							<div class="cj_set_two">
								<div class="cj_set_model">
									<div class="cj_set_modeltxt">Web</div>
									<div class="cj_set_modellist"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="wy_set">
						<div class="wyset_firstline">
							<div class="cj_set_one">网元关键KQI指标选择(2个):</div>
							<div class="wy_set_listbox">
								<div class="wy_set_model" data-name="RNC">
									<div class="wy_set_modeltxt">RNC</div>
									<div class="wy_set_modellist"></div>
								</div>
								<div class="wy_set_model" data-name="GGSN">
									<div class="wy_set_modeltxt">GGSN</div>
									<div class="wy_set_modellist"></div>
								</div>
								<div class="wy_set_model" data-name="SGW">
									<div class="wy_set_modeltxt">SGW</div>
									<div class="wy_set_modellist"></div>
								</div>
								<div class="wy_set_model" data-name="SGSN">
									<div class="wy_set_modeltxt">SGSN</div>
									<div class="wy_set_modellist"></div>
								</div>
								<div class="wy_set_model" data-name="MME">
									<div class="wy_set_modeltxt">MME</div>
									<div class="wy_set_modellist"></div>
								</div>
							</div>	
						</div>
					</div>
					<div class="sp_set">
						<div class="sp_set_top">
							<div class="sp_left">趋势图指标选择 (2个) :</div>
							<div class="sp_right">
								<div class="sp_first_k " data-sp="Web">
									<div class="sp_k">Web</div>
									<div class="sp_right_right"></div>
								</div>
								<div class="sp_first_k " data-sp="Streaming">
									<div class="sp_k">Streaming</div>
									<div class="sp_right_right"></div>
								</div>
								<div class="sp_first_k" data-sp="Weixin">
									<div class="sp_k">Weixin</div>
									<div class="sp_right_right"></div>
								</div>
								<div class="sp_first_k" data-sp="Other">
									<div class="sp_k">Other</div>
									<div class="sp_right_right"></div>
								</div>
							</div>
						</div>
						<div class="sp_option">
							<div class="sp_opt">
								<div class="sp_setOp">SP配置:</div>
								<button class="sp_refreshed">刷新</button>
							</div>
							<div class="sp_wrap">
								<table class="sp_set_table">
									<thead>
										<tr>
											<td class="isjiankong">是否监控</td>
											<td>SP名称<input type="text" class="sp_input" id="sp_input" placeholder="输入查找" /></td>
											<td>
												<div class="sp_type">SP类型</div>
												<ul class="sp_type_ul">
													<li>ALL</li>
													<li>Web</li>
													<li>Streaming</li>
													<li>Weixin</li>
													<li>QQ</li>
													<li>Other</li>
												</ul>
											</td>
											<td>图标</td>
											<td>上传</td>
										</tr>
									</thead>
								</table>
								<div class="tb_scroll_box">
									<div class="tb_scroll_center">
										<div class="tb_scroll_con">
											<table class="table_tbody">
												<tbody class="tbody_tbody"></tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="set_footer">
					<span class="set_reset">复位</span><span class="set_apply">确认</span><span class="set_cancel">取消</span>
				</div>
			</div>
		</div>
		<script src="<%=basePath%>pages/lib/echarts.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/config.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/setting.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/index.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/radialIndicator.min.js" type="text/javascript" charset="utf-8"></script>
		<!--map-->
		<script src="<%=basePath%>pages/lib/leaflet.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/leaflet.draw-src.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/sefon.map.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/next_sp_main.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/next_wangyuan.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/next_cj_data.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/next_data.js" type="text/javascript" charset="utf-8"></script>

	</body>

</html>
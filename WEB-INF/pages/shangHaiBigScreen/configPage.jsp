<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="_csrf" content="${_csrf.token}" />
		<meta name="_csrf_header" content="${_csrf.headerName}" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>上海联通业务质量管理平台</title>
			<%@include file="../common/sweet.jsp"%>
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/common.css">
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting_wangyuan.css">
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting_changjing.css">
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting_all.css"/>
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/setting.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/webuploader.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath%>pages/css/daterangepicker.css"/>
		<script type="text/javascript" src="<%=basePath%>pages/lib/jquery-3.1.0.min.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/js/common.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/webuploader.js"></script>
		<script type="text/javascript" src="<%=basePath%>pages/lib/jquery.tablescroll.js"></script>
		<script src="<%=basePath%>pages/lib/mousewheel.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/easyscroll.js" type="text/javascript" charset="utf-8"></script>
	</head>

	<body>
		<div class="setting_bg active">
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
																<div class="ul_scroll" style="display: none;">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
														</div>
														<div class="max1" data-str="netMeta">
															<div class="common_top_scene">重点网元</div>
															<div class="leftbox">
																<div class="leftname"></div>
																<div class="ul_scroll" style="display: none;">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
														</div>
														<div class="max1" data-str="sp">
															<div class="common_top_scene">重点SP</div>
															<div class="leftbox">
																<div class="leftname"></div>
																<div class="ul_scroll" style="display: none;">
																	<div class="ul_div_scroll">
																		<div class=" my_ul">
																			<ul class="add_style setting_cjcls"></ul>
																		</div>
																	</div>
																</div>
															</div>
															<div class="top_div1"></div>
														</div>
												</div>
										</div>
										<div class="common_center">
											<div class="common_center_left">
												KQI选择(1~4个):
											</div>
											<div class="common_center_right">
												<ul class="setting_center">
													<li class="sel"><span class="list1">全网</span></li>
													<li class="circle2"><span>3G</span></li>
													<li class="circle2"><span>4G</span></li>
												</ul>
												<div class="same active" data-str="allNet">
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Web:</div>
														<div class="leftboxs" data-we="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Streaming:</div>
														<div class="leftboxs" data-we="stream">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-we="webChat">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
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
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Other:</div>
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
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">IM:</div>
														<div class="leftboxs" data-web="web">

														</div>
													</div>
													<div class="add_cjbox add_cjboxx ">
														<div class="add_style add_cjlx">Other:</div>
													</div>
													<div class="bottom_box">

													</div>
												</div>
											</div>
										</div>
										<div class="common_bottom">
											<div class="common_bottom_left">舆情信息设置:</div>
											<div class="common_bottom_right">
												<textarea oninput="limitEvent(this)" ></textarea><p>(你还可以输入字数:<span class="word">50</span>)</p>
												<textarea oninput="limitEvent1(this)" ></textarea><p>(你还可以输入字数:<span class="word1">50</span>)</p>
												<textarea oninput="limitEvent2(this)" ></textarea><p>(你还可以输入字数:<span class="word2">50</span>)</p>
											</div>

											 <div class="common_bottom_alert">告警信息:</div>
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

		<script src="<%=basePath%>pages/js/config.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/setting.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/setting_all.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/setting_wangyuan.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/js/setting_changjing.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/radialIndicator.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/mousewheel.js" type="text/javascript" charset="utf-8"></script>
		<script src="<%=basePath%>pages/lib/easyscroll.js" type="text/javascript" charset="utf-8"></script>
		<script>
		</script>

	</body>

</html>
window.basePath = '../';
window.pageConfig = {
	"token": $("meta[name='_csrf']").attr("content"), //token头验证
	"ajaxUrl": { //页面所有的ajax请求url
		   "activeUserNumber": basePath + "pages/test_data/activeUserNumber.json",
		   "grantUser" : basePath + "pages/test_data/grantUser.json",
		   "activeFlower": basePath + "pages/test_data/activeFlower.json",
		   "allRateKqi": basePath + "pages/test_data/allRateKqi.json",
		   "alertInformation": basePath + "pages/test_data/alertInformation.json",
		   "importantKqi": basePath + "pages/test_data/importantKqi.json",
		   "importantaffectedUserNum": basePath + "pages/test_data/importantaffectedUserNum.json",
		   "allNetAlertInformation": basePath + "pages/test_data/allNetAlertInformation.json",
		   "keySceneSceneUserNum": basePath + "pages/test_data/sceneUserNum.json",
		   "keySceneChildSceneUserNum": basePath + "pages/test_data/childSceneUserNum.json",
		   "netElementTop3UserNum": basePath + "pages/test_data/top3UserNum.json",
		   "keySceneSpUserNum": basePath + "pages/test_data/spUserNum.json",
		   "keySceneProtocalUserNum": basePath + "pages/test_data/protocalUserNum.json",
		   "alarmNum": basePath + "pages/test_data/alarmNum.json",
		   "timeInfo": basePath + "pages/test_data/timeInfo.json",
		   "keySceneCustomAreaShowConfig": basePath + "pages/test_data/CustomAreaShowConfig.json",
		   "keySceneCustomAreaShowQuery": basePath + "pages/test_data/CustomAreaShowQuery.json",
		   "alarmInfo": basePath + "pages/test_data/alarmInformation.json",
		   "sceneCustomArea": basePath + "pages/test_data/sceneCustomArea.json",
		   "twoRateKqi" : basePath + "pages/test_data/twoRateKqi.json",
		   "keySpShowConfig" : basePath + "pages/test_data/spShowConfig.json",
		   "affectedUserAndWorkOrder" : basePath + "pages/test_data/affectedUserAndWorkOrder.json",
		   "consensusInformation": basePath + "pages/test_data/consensusInformation.json",
		   "globalInfo" : basePath + "pages/test_data/test.json",
		   "UpdateConf" : basePath + "pages/test_data/test.json",
		   "resetConf" : basePath + "pages/test_data/test.json",
		   "Export":basePath+"/service/export/export.action "

//		"activeUserNumber" : basePath + "service/initPage/activeUserNumber.action",
//		"grantUser" : basePath + "service/initPage/grantUser.action",
//		"activeFlower": basePath + "service/initPage/activeFlower.action",
//		"allRateKqi" : basePath + "service/initPage/allRate/kqi.action",
//		"alertInformation": basePath + "service/initPage/allNetAlertInformation.action",
//		"importantKqi": basePath + "service/initPage/important/kqi.action",
//		"importantaffectedUserNum" : basePath + "service/initPage/important/affectedUserNum.action",
//		"allNetAlertInformation": basePath + "service/initPage/allNetAlertInformation.action",
//		"keySceneSceneUserNum": basePath + "service/initPage/keyScene/sceneUserNum.action",
//		"keySceneChildSceneUserNum": basePath + "service/initPage/keyScene/childSceneUserNum.action",
//		"netElementTop3UserNum": basePath + "service/initPage/netElement/top3UserNum.action",
//		"keySceneSpUserNum": basePath + "service/initPage/keySP/spUserNum.action",
//		"keySceneProtocalUserNum": basePath + "service/initPage/keySP/protocalUserNum.action",
//		"alarmNum": basePath + "service/initPage/alarmNum.action",
//		"timeInfo": basePath + "service/initPage/timeInfo.action",
//		"keySceneCustomAreaShowConfig" : basePath + "service/initPage/keyScene/CustomAreaShowConfig.action",
//		"keySceneCustomAreaShowQuery" : basePath + "service/initPage/keyScene/CustomAreaShowQuery.action",
//		"alarmInfo" : basePath + "service/twoPage/scene/alarmInformation.action",
//		"sceneCustomArea" : basePath + "service/twoPage/scene/customArea.action",
//		"twoRateKqi" : basePath + "service/twoPage/allRate/kqi.action",
//		"keySpShowConfig" : basePath + "service/initPage/keySP/spShowConfig.action",
//		"affectedUserAndWorkOrder" : basePath + "service/twoPage/netMetedata/affectedUserAndWorkOrder.action",
//		"consensusInformation": basePath + "service/initPage/consensusInformation.action",
//		"globalInfo" : basePath + "service/thirdPage/conf/queryConf.action",
//		"UpdateConf" : basePath + "service/thirdPage/conf/updateConf.action",
//		"resetConf" : basePath + "service/thirdPage/conf/reset.action",
//		"Export":basePath+"/service/export/export.action "
	},
	"imgUrl": {

	},
	"option": {
		"line": {
			grid: {
				top: 0.18 * REM,
				right: 1.5 * REM,
				bottom: 0.4 * REM,
				left: 0.4 * REM
			},
			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					if(params[0].data !== '') {
						return `时间:${params[0].name}<br/>当前值:${formatNumber(params[0].data)}<br>同比值:${formatNumber(params[1].data)}`;
					}
				},
				textStyle: {
					fontSize: 0.18 * REM,
					fontFamily: 'HelveticaNeueLTStd-Lt',
				},
				padding: [0.02 * REM, 0.1 * REM],
				backgroundColor: 'rgba(48, 70, 76, 0.8)'
			},
			xAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					interval: function(index,string){
						if(index === 0 || index === 12 || index === 24 || index === 36 || index === 48){
							return true;
						}else{
							return false;
						}
					},
//					rotate:60,
					textStyle: {
						color: '#3e859a',
						fontSize: 0.08 * REM
					}
				},
				data: null
			},
			yAxis: {
				axisLine: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#3e859a',
						fontSize: 0.08 * REM
					}
				}
			},
			series: [{
				name: '当前值',
				type: 'line',
				data: null,
				symbol: 'none',
				areaStyle: {
					normal: {
						color: null
					}
				},
				lineStyle: {
					normal: {
						color: '#43a79e',
						width: 1
					}
				}
			}, {
				name: '上周同比值',
				type: 'line',
				data: null,
				symbol: 'none',
				lineStyle: {
					normal: {
						color: '#4994b2',
						type: 'dashed',
						width: 1
					}
				}
			}]
		}
	}
}
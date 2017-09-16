<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.huawei.seq.SpringContextUtils"%>
<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<meta HTTP-EQUIV="expires" CONTENT="0">
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+SpringContextUtils.getDistributedLocalIpAddr(request)
                  +":"+SpringContextUtils.getDistributedLocalPort(request)+path+"/";

    String sScheme = request.getScheme();
    String sIP = request.getServerName();
    int sPort = request.getServerPort();

    String baseJsPath = new StringBuilder(sScheme).append("://")
            .append(sIP).append(":").append(sPort).append("/vcc")
            .toString();
%>
<%-- sweet核心组件 --%>
<%--script type="text/javascript" src="<%=baseJsPath%>/sweet/sweet-ui-all.js"></script--%>
<!--<script type="text/javascript" src="<%=basePath%>sweet/sweet-ui-all.js"></script>-->
<%-- 工程根路径 --%>
<script type="text/javascript">
    var basePath = "<%=basePath%>";
    //启用Sweet的提示信息
//  Sweet.ToolTip.enable();
</script>
<style>
    .sweet-grid-content table td{
        border-right:1px solid #ccc;
    }
    .sweet-grid-content table td:last-child{
        border-right:0px solid #ccc;
    }
</style>
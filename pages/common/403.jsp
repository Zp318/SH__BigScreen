<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="com.ecm.extern.frm.WebServerUtil"%>
<%
    String host = WebServerUtil.getLocalIpAddr(request) + ":" + WebServerUtil.getLocalPort(request);
	String basePath = request.getScheme() + "://" + host + request.getContextPath();
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title></title>
<link rel="stylesheet" href="<%=basePath%>/extjs/resources/css/ext-all.css" />
<script type="text/javascript"  src="<%=basePath%>/extjs/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=basePath%>/extjs/ext-all.js"></script>
<script type="text/javascript" src="<%=basePath%>/locale/common/commontip.js"></script>
<script type="text/javascript">

var res = new ecm.commontip.page();

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.getDom('tipMsg').innerHTML = '&nbsp;&nbsp;' + res.tip_403;
});

</script>
<head>
<style type="text/css">
.style5{
width: 100%;
height: 65px;
margin: 0px auto;
margin-bottom:20px;
border:1px solid #e7dc5f;
background-color: #fffbcc;
font-size:12px;
}
</style>
</head>
<body bgcolor="#efefef">
<div class="style5">
  <table width="100%" style="margin-top:5px">
    <tr>
        <td align="center" valign="top">
            <table>
                <tr>
                    <td><img src="<%=basePath%>/images/common/attention.gif"/></td>
                    <td id="tipMsg" name="tipMsg"></td>
                </tr>
            </table>
           <table>
                <tr>
                    <td name="tipMsg1">${menuPath}</td>
                </tr>
            </table>
        </td>
    </tr>
  </table>
</div>
<input type="hidden" id="accessDenied" name="accessDenied" value="5e87a5c917613c5c4cad8c022406eaaa" />
</body>
</html>
 

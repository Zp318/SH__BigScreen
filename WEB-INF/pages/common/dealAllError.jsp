<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title></title>
<link rel="stylesheet" href="../../../../extjs/resources/css/ext-all.css" />
<script type="text/javascript"  src="../../../../extjs/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="../../../../extjs/ext-all.js"></script>
<script type="text/javascript" src="../../../../locale/common/commontip.js"></script>
<script type="text/javascript">

var res = new ecm.commontip.page();

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.getDom('tipMsg').innerHTML = '&nbsp;&nbsp;' + res.tip_exception;
});

</script>
<style type="text/css">
.style5{
width: 100%;
height: 50px;
margin: 0px auto;
margin-bottom:20px;
border:1px solid #df8f8f;
background-color: #ffcece;
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
                    <td><img src="../../../../images/common/error.gif"/></td>
                    <td id="tipMsg" name="tipMsg"></td>
                </tr>
            </table>
        </td>
    </tr>
  </table>
</div>
</body>
</html>
 

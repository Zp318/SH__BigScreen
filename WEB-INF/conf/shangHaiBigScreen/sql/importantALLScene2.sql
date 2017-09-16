select b.cgisai from  (
		select 
			   SUBSTR(task_object,INSTR(task_object,'=',1,1)+1,length(task_object)-INSTR(task_object,'=',1,1)) as cell_name
		from sla.tbl_alarm_info
		where cleared_time =-1            --筛选未恢复的告警（恢复时间为空）                       
		and task_object_type in (select task_dims from sla.cfg_task_dim where task_dims_text in ('3G小区','4G小区'))         --提取小区级别告警
		and SUBSTR(task_object,INSTR(task_object,'=',1,1)+1,length(task_object)-INSTR(task_object,'=',1,1)) in (select cell_name from pms.dim_loc_customarea where cus_area_name is not null)  --提取自定义区域的小区
		and SUBSTR(alarm_name,INSTR(alarm_name,'_',-1,1)+1,length(alarm_name)- INSTR(alarm_name,'_',-1,1)) in ('WEB页面响应时长')     --杭州方案只监控小区级的WEB页面下载速率 和 WEB页面响应时长 两个指标，如果项目后续再方案中实现其他指标监控，需要修改此处代码
		group by cell_name
	)a
	left join 
	(
		select cell_name,areadetail,aa.cgisai from pms.DIM_LOC_CUSTOMAREA aa 
		left join pms.OC_CUSTOMIZE_AREA aaa 
		on aa.cus_area_name=aaa.areaname and aa.access_type_id=aaa.areacategory    --将小区-自定义区域和场景关联在一起
		group by cell_name,areadetail  ,aa.cgisai                                            --注意：场景和小区组合去重
	)b
	on a.cell_name=b.cell_name
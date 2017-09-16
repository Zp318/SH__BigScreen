   select b.sgsn_id from (select 
		   SUBSTR(task_object,INSTR(task_object,'=',1,1)+1,length(task_object)-INSTR(task_object,'=',1,1)) as GGSN_NAME

	from sla.tbl_alarm_info
	where cleared_time =-1            --筛选未恢复的告警（恢复时间为空）        
	and task_object_type in (select task_dims from sla.cfg_task_dim where task_dims_text ='GGSN')    ----提取GGSN业务告警
	and (demarcation_cause like '%防火墙%' or demarcation_cause like '%首GET%')
	group by GGSN_NAME ) a join pms.DIM_LOC_SGSN b on upper(a.GGSN_NAME) = upper(b.sgsn_name)

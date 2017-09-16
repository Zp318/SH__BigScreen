select b.sgw_id from ( select 
		   SUBSTR(task_object,INSTR(task_object,'=',1,1)+1,length(task_object)-INSTR(task_object,'=',1,1)) as SGW_NAME
	from sla.tbl_alarm_info
	where cleared_time =-1            --筛选未恢复的告警（恢复时间为空）        
	and task_object_type in (select task_dims from sla.cfg_task_dim where task_dims_text ='SGW')    ----提取SGW业务告警
	and (demarcation_cause like '%防火墙%' or demarcation_cause like '%首GET%')
	group by SGW_NAME ) a join pms.DIM_LOC_SGW b on upper(b.sgw_name)=upper(a.SGW_NAME);
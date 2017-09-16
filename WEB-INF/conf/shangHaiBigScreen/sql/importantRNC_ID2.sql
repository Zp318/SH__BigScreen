	select bb.bscrnc_id from ( select 
		   SUBSTR(task_object,INSTR(task_object,'=',1,1)+1,length(task_object)-INSTR(task_object,'=',1,1)) as RNC_NAME
	from sla.tbl_alarm_info
	where cleared_time =-1            --筛选未恢复的告警（恢复时间为空）         
	and task_object_type in (select task_dims from sla.cfg_task_dim where task_dims_text ='RNC')    ----提取RNC业务告警
	and (demarcation_cause like '%传输问题%' or demarcation_cause like '% 首GET%')    --注意首GET之前有空格，目的是过去掉’GGSN首GET....‘的单据
	group by RNC_NAME ) aa join pms.DIM_DYN_BSCRNC_SPC bb on upper(bb.bscrnc_name)=upper(aa.RNC_NAME)
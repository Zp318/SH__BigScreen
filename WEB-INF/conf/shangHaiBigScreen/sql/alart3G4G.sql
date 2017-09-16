select count(count1),ratType from ( select 
        case when access_type =1 then '3G' when access_type=2 then '4G' else 'other' end as ratType,1 as count1
        
from sla.tbl_alarm_info
where SUBSTR(alarm_name,1,INSTR(alarm_name,'_',1,1)-1)='WEB页面响应时长'
and SUBSTR(task_object,1,1)='市') adbd group by ratType;
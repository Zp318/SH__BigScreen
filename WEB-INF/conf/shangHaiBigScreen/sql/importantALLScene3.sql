select count(dim_51) as num,b23s.areadetail,null as areaID, null as allscene, as sceneName,'@startTime@' as startTime from  (
@sql@)  abd join (
select cell_name,areadetail,aa.cgisai from nethouse.DIM_LOC_CUSTOMAREA aa 
		left join nethouse.OC_CUSTOMIZE_AREA aaa 
		on aa.cus_area_name=aaa.areaname and aa.access_type_id=aaa.areacategory
		group by cell_name,areadetail  ,aa.cgisai                                
) b23s on b23s.cgisai||''=abd.dim_2||'' group by b23s.areadetail
union
select count(dim_51) as num,b23s.areadetail as sceneName,'@startTime@' as startTime from  (
@sql@)  abd join (
select cell_name,areadetail,aa.cgisai from nethouse.DIM_LOC_CUSTOMAREA aa 
		left join nethouse.OC_CUSTOMIZE_AREA aaa 
		on aa.cus_area_name=aaa.areaname and aa.access_type_id=aaa.areacategory
		group by cell_name,areadetail  ,aa.cgisai                                
) b23s on b23s.cgisai||''=abd.dim_2||'' group by b23s.areadetail
		select aa.cus_area_id from pms.DIM_LOC_CUSTOMAREA aa 
		left join pms.OC_CUSTOMIZE_AREA aaa 
		on aa.cus_area_name=aaa.areaname and aa.access_type_id=aaa.areacategory    --将小区-自定义区域和场景关联在一起
		group by aa.cus_area_id                                            --注意：场景和小区组合去重0
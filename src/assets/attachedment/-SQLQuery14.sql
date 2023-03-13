select * from [dbo].[MT_PRODUCT]

--truncate table [MT_PRODUCT]

select * from [dbo].[MT_PRODUCT] 
where PRODUCT_CODE = ''
order by PRODUCT_GROUP_ID,PRODUCT_TYPE_ID

select * from MT_PRODUCT_GROUP
drop table tempPROD

select * from  tempPROD

select 'Í»¢-2-'+right('00000'+ convert(varchar,ROW_NUMBER() OVER(ORDER BY PRODUCT_ID ASC)),5) AS seq,PRODUCT_ID,PRODUCT_DESC
--INTO tempPROD
from MT_PRODUCT  
where PRODUCT_GROUP_ID = 18 and PRODUCT_TYPE_ID= 2


update a set a.PRODUCT_CODE = b.seq 
from MT_PRODUCT a 
inner join tempPROD b on a.PRODUCT_ID = b.PRODUCT_ID
where a.PRODUCT_CODE = ''



select  [PRODUCT_GROUP_DESC], [PRODUCT_SUBGROUP_ID], a.[PRODUCT_GROUP_ID], 
                                        [PRODUCT_SUBGROUP_DESC], a.[IS_ACTIVE], a.[IS_DEL], a.[CREATE_DATE], 
                                        a.[CREATE_BY], a.[UPDATE_DATE], a.[UPDATE_BY], a.[DELETE_DATE], a.[DELETE_BY]
                                from	[MT_PRODUCT_SUBGROUP] a
                                left outer join [MT_PRODUCT_GROUP] b on a.PRODUCT_GROUP_ID = b.PRODUCT_GROUP_ID
                                where a.PRODUCT_GROUP_ID =  and a.IS_DEL is null and a.IS_ACTIVE <> 'N' and b.IS_DEL is null and b.IS_ACTIVE <> 'N'
                                order by [PRODUCT_SUBGROUP_ID] 


select * from MT_PRODUCT



INSERT INTO TR_RECEIVE_I (RECEIVE_HID, PRODUCT_ID, PRODUCT_CODE, QTY, UNIT_PRICE, WH_ID, CREATE_DATE, CREATE_BY)  VALUES(27,6,'¤Ã¤-1-000004',12,123,2,getdate(),'admin')






select  a.[PRODUCT_ID], a.[PRODUCT_TYPE_ID], [PRODUCT_CAT_ID], a.[PRODUCT_GROUP_ID],a.[PRODUCT_SUBGROUP_ID],
                                        b.PRODUCT_GROUP_DESC,c.PRODUCT_SUBGROUP_DESC, [PRODUCT_CODE], [PRODUCT_DESC],
		                                a.[UOM_ID], d.UOM_DESC, [IMG1], [IMG2], [IMG3], a.[IS_ACTIVE], a.[IS_DEL], a.[CREATE_DATE], a.[CREATE_BY], 
                                        a.[UPDATE_DATE], a.[UPDATE_BY], ISNULL(f.SCENE_ID,'') as SCENE_ID, f.SCENE_DESC, ISNULL(h.GEN_ID,'') as GEN_ID, h.GENERATION_DESC
                                from MT_PRODUCT a
                                left outer join MT_PRODUCT_GROUP b on a.PRODUCT_GROUP_ID = b.PRODUCT_GROUP_ID
                                left outer join MT_PRODUCT_SUBGROUP c on a.PRODUCT_SUBGROUP_ID = c.PRODUCT_SUBGROUP_ID
                                left outer join MT_UOM d on a.UOM_ID = d.UOM_ID
                                left outer join MT_PRODUCT_SCENE e on a.PRODUCT_ID = e.PRODUCT_ID and e.IS_DEL is null
                                left outer join MT_SCENE f on e.SCENE_ID = f.SCENE_ID
                                left outer join MT_PRODUCT_GEN g on a.PRODUCT_ID = g.PRODUCT_ID and g.IS_DEL is null
                                left outer join MT_GENERATION h on g.GEN_ID = h.GEN_ID 
                                where a.IS_DEL is null and a.is_active <> 'N'
                                order by a.PRODUCT_ID 


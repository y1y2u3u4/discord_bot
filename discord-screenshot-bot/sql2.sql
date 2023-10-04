select 
call_city
,order_id_count
,count(distinct driver_id) as driver_id_count
,count(distinct (case when order_id_count_low_avg_1<>0 then driver_id end)) as driver_id_count_low_avg_1
,count(distinct (case when order_id_count_low_avg_2<>0 then driver_id end)) as driver_id_count_low_avg_2
,count(distinct (case when order_id_count_low_avg_3<>0 then driver_id end)) as driver_id_count_low_avg_3
,count(distinct (case when order_id_count_low_avg_4<>0 then driver_id end)) as driver_id_count_low_avg_4
,count(distinct (case when order_id_count_low_avg_5<>0 then driver_id end)) as driver_id_count_low_avg_5
,count(distinct (case when order_id_count_low_avg_6<>0 then driver_id end)) as driver_id_count_low_avg_6
,count(distinct (case when order_id_count_low_avg_7<>0 then driver_id end)) as driver_id_count_low_avg_7
,count(distinct (case when order_id_count_low_avg_8<>0 then driver_id end)) as driver_id_count_low_avg_8
,count(distinct (case when order_id_count_low_avg_9<>0 then driver_id end)) as driver_id_count_low_avg_9
,count(distinct (case when order_id_count_low_avg_10<>0 then driver_id end)) as driver_id_count_low_avg_10

,count(distinct (case when order_id_count_low_p5_1<>0 then driver_id end)) as driver_id_count_low_p5_1
,count(distinct (case when order_id_count_low_p5_2<>0 then driver_id end)) as driver_id_count_low_p5_2
,count(distinct (case when order_id_count_low_p5_3<>0 then driver_id end)) as driver_id_count_low_p5_3
,count(distinct (case when order_id_count_low_p5_4<>0 then driver_id end)) as driver_id_count_low_p5_4
,count(distinct (case when order_id_count_low_p5_5<>0 then driver_id end)) as driver_id_count_low_p5_5
,count(distinct (case when order_id_count_low_p5_6<>0 then driver_id end)) as driver_id_count_low_p5_6
,count(distinct (case when order_id_count_low_p5_7<>0 then driver_id end)) as driver_id_count_low_p5_7
,count(distinct (case when order_id_count_low_p5_8<>0 then driver_id end)) as driver_id_count_low_p5_8
,count(distinct (case when order_id_count_low_p5_9<>0 then driver_id end)) as driver_id_count_low_p5_9
,count(distinct (case when order_id_count_low_p5_10<>0 then driver_id end)) as driver_id_count_low_p5_10

,count(distinct (case when order_id_count_low_p10_1<>0 then driver_id end)) as driver_id_count_low_p10_1
,count(distinct (case when order_id_count_low_p10_2<>0 then driver_id end)) as driver_id_count_low_p10_2
,count(distinct (case when order_id_count_low_p10_3<>0 then driver_id end)) as driver_id_count_low_p10_3
,count(distinct (case when order_id_count_low_p10_4<>0 then driver_id end)) as driver_id_count_low_p10_4
,count(distinct (case when order_id_count_low_p10_5<>0 then driver_id end)) as driver_id_count_low_p10_5
,count(distinct (case when order_id_count_low_p10_6<>0 then driver_id end)) as driver_id_count_low_p10_6
,count(distinct (case when order_id_count_low_p10_7<>0 then driver_id end)) as driver_id_count_low_p10_7
,count(distinct (case when order_id_count_low_p10_8<>0 then driver_id end)) as driver_id_count_low_p10_8
,count(distinct (case when order_id_count_low_p10_9<>0 then driver_id end)) as driver_id_count_low_p10_9
,count(distinct (case when order_id_count_low_p10_10<>0 then driver_id end)) as driver_id_count_low_p10_10


,avg(b_cpm_avg_driver) as b_cpm_avg_driver
,avg(p5_bcpm_driver) as p5_bcpm_driver
,avg(p10_bcpm_driver) as p10_bcpm_driver
,sum(gmv) as gmv
,sum(driver_cut) as driver_cut
,sum(subsidy_b) as subsidy_b
,sum(order_charge_dis) as order_charge_dis
,sum(answer_dis) as answer_dis

from (
select 
call_city
,driver_id
,avg(b_cpm_avg_city) as b_cpm_avg_city
,avg(p5_bcpm1_city) as p5_bcpm1_city
,avg(p10_bcpm1_city) as p10_bcpm1_city
,avg(p25_bcpm1_city) as p25_bcpm1_city
,avg(p50_bcpm1_city) as p50_bcpm1_city
,avg(order_id_count_th) as order_id_count_th
,count(distinct order_id) as order_id_count
,count(distinct (case when b_cpm_low_avg_flag>=1 then order_id end)) as order_id_count_low_avg_1
,count(distinct (case when b_cpm_low_avg_flag>=2 then order_id end)) as order_id_count_low_avg_2
,count(distinct (case when b_cpm_low_avg_flag>=3 then order_id end)) as order_id_count_low_avg_3
,count(distinct (case when b_cpm_low_avg_flag>=4 then order_id end)) as order_id_count_low_avg_4
,count(distinct (case when b_cpm_low_avg_flag>=5 then order_id end)) as order_id_count_low_avg_5
,count(distinct (case when b_cpm_low_avg_flag>=6 then order_id end)) as order_id_count_low_avg_6
,count(distinct (case when b_cpm_low_avg_flag>=7 then order_id end)) as order_id_count_low_avg_7
,count(distinct (case when b_cpm_low_avg_flag>=8 then order_id end)) as order_id_count_low_avg_8
,count(distinct (case when b_cpm_low_avg_flag>=9 then order_id end)) as order_id_count_low_avg_9
,count(distinct (case when b_cpm_low_avg_flag>=10 then order_id end)) as order_id_count_low_avg_10

,count(distinct (case when b_cpm_low_p5_flag>=1 then order_id end)) as order_id_count_low_p5_1
,count(distinct (case when b_cpm_low_p5_flag>=2 then order_id end)) as order_id_count_low_p5_2
,count(distinct (case when b_cpm_low_p5_flag>=3 then order_id end)) as order_id_count_low_p5_3
,count(distinct (case when b_cpm_low_p5_flag>=4 then order_id end)) as order_id_count_low_p5_4
,count(distinct (case when b_cpm_low_p5_flag>=5 then order_id end)) as order_id_count_low_p5_5
,count(distinct (case when b_cpm_low_p5_flag>=6 then order_id end)) as order_id_count_low_p5_6
,count(distinct (case when b_cpm_low_p5_flag>=7 then order_id end)) as order_id_count_low_p5_7
,count(distinct (case when b_cpm_low_p5_flag>=8 then order_id end)) as order_id_count_low_p5_8
,count(distinct (case when b_cpm_low_p5_flag>=9 then order_id end)) as order_id_count_low_p5_9
,count(distinct (case when b_cpm_low_p5_flag>=10 then order_id end)) as order_id_count_low_p5_10


,count(distinct (case when b_cpm_low_p10_flag>=1 then order_id end)) as order_id_count_low_p10_1
,count(distinct (case when b_cpm_low_p10_flag>=2 then order_id end)) as order_id_count_low_p10_2
,count(distinct (case when b_cpm_low_p10_flag>=3 then order_id end)) as order_id_count_low_p10_3
,count(distinct (case when b_cpm_low_p10_flag>=4 then order_id end)) as order_id_count_low_p10_4
,count(distinct (case when b_cpm_low_p10_flag>=5 then order_id end)) as order_id_count_low_p10_5
,count(distinct (case when b_cpm_low_p10_flag>=6 then order_id end)) as order_id_count_low_p10_6
,count(distinct (case when b_cpm_low_p10_flag>=7 then order_id end)) as order_id_count_low_p10_7
,count(distinct (case when b_cpm_low_p10_flag>=8 then order_id end)) as order_id_count_low_p10_8
,count(distinct (case when b_cpm_low_p10_flag>=9 then order_id end)) as order_id_count_low_p10_9
,count(distinct (case when b_cpm_low_p10_flag>=10 then order_id end)) as order_id_count_low_p10_10

,sum(gmv) as gmv
,sum(driver_cut) as driver_cut
,sum(subsidy_b) as subsidy_b
,sum(order_charge_dis) as order_charge_dis
,sum(answer_dis) as answer_dis
,(sum(driver_cut)+sum(subsidy_b))/sum(order_charge_dis) as b_cpm_avg_driver
-- ,percentile_approx(b_cpm1, 0.01) as p1_bcpm_driver
-- ,percentile_approx(b_cpm1, 0.05) as p5_bcpm_driver
-- ,percentile_approx(b_cpm1, 0.10) as p10_bcpm_driver
-- ,percentile_approx(b_cpm1, 0.25) as p25_bcpm_driver
-- ,percentile_approx(b_cpm1, 0.50) as p50_bcpm_driver
from
(
    select  
    t1.call_city
    ,product_category
    ,t1.dt as dt
    ,t1.driver_id as driver_id
    ,order_id_count_th
    ,b_cpm_avg_city
    ,p5_bcpm1_city
    ,p10_bcpm1_city
    ,p25_bcpm1_city
    ,p50_bcpm1_city
    ,t1.order_id as order_id
    ,gmv
    ,(driver_cut+subsidy_b)/order_charge_dis as b_cpm1
    ,(driver_cut+subsidy_b)/(order_charge_dis+answer_dis) as b_cpm2
    ,driver_cut
    ,subsidy_b
    ,order_charge_dis
    ,answer_dis
    ,IF((driver_cut+subsidy_b)/order_charge_dis < b_cpm_avg_city, 1, 0) AS b_cpm_low_avg_flag
    ,IF((driver_cut+subsidy_b)/order_charge_dis < p5_bcpm1_city, 1, 0) AS b_cpm_p5_avg_flag
    ,IF((driver_cut+subsidy_b)/order_charge_dis < p10_bcpm1_city, 1, 0) AS b_cpm_p10_avg_flag
    from  
        (
        select  case when sub_product_line in(3, 7, 314) and require_level in (600) and combo_type in (4) and carpool_type in (1,2,4) then travel_id else order_id end as travel_id  
        ,dt
        ,order_id
        ,call_city
        ,driver_charge_dis/1000 as order_charge_dis
        ,answer_dis/1000 as answer_dis
        ,driver_id
        ,case   when sub_product_line = 9 then '豪华车'
                when sub_product_line = 50 then '开放平台' 
                when sub_product_line in (1, 6) and require_level in (100) then '舒适型专车'
                when sub_product_line in (1, 6) and require_level in (400) then '商务型专车'
                when sub_product_line in(3, 7, 314) and require_level in (600) and combo_type in (4) and carpool_type in (1, 2) then '快车拼车'
                when sub_product_line in(3, 7, 314) and require_level in (600) and combo_type in (4) and carpool_type in (5) then '司乘一口价拼车'
                when sub_product_line in(3, 7, 314) and require_level in (610) and combo_type in (4) and carpool_type in (2) then '特惠拼车'
                when sub_product_line in(3, 7, 314) and require_level in (600) and combo_type in (302) and carpool_type in (3) then '城际拼车'
                when sub_product_line in(3, 7, 314) and require_level in (600) and combo_type in (4) and carpool_type in (4) then '拼成乐'
                when sub_product_line in (20, 99) then '优享'
                when sub_product_line in (700) then 'D1'
                when sub_product_line in (30) then 'A+'
                when sub_product_line in (3, 7, 314) and require_level in (600) and combo_type in (314) then '特惠快车'
                when sub_product_line in (3, 7, 314) and require_level in (600) and combo_type in (0, 306, 309) then '普通快车'
                when sub_product_line in (11, 12) and require_level in (1100) and combo_type in (4) and carpool_type in (2) then '拼车出租车'
                when sub_product_line in (11, 12) and require_level in (2000) then '优选出租车'
                when sub_product_line in (11, 12) and require_level in (1100) and get_json_object(extend_feature, '$.driver_multi_price.waive_price') < 0 then '特惠出租车'
                when sub_product_line in (11, 12) and require_level in (1100) then '普通出租车'
                else '其他'
                end as product_category
        
        from    decdm.dwd_gflt_ord_order_base_di
        where   dt between '2023-08-15' and '2023-08-31' 
        and   order_status = 5
        and     call_city in(12)
        )t1


    left join 
        (
            select  order_id
                    
                    ,sum(nvl(gmv,0)) as gmv
                    ,sum(nvl(driver_cut,0)) as driver_cut
                    ,sum(nvl(subsidy_c,0)) as subsidy_c
                    ,sum(nvl(subsidy_b,0)) as subsidy_b
                    
            from    g_caiwu.dw_m_finance_daily_report_by_order
            where   concat_ws('-', year, month, day)  between '2023-08-15' and '2023-08-31' 
            and gmv>=0
            and subsidy_b>=0
            and subsidy_c>=0
            and city_id in (12)
            group by order_id
        )t2
    on t1.order_id = t2.order_id

    left join 
    (
select 
dt
,driver_id
,order_id_count
,order_id_count_th
from
    dp_det_data.teihuisij_weidu1 
    )t3
    on t1.driver_id = t3.driver_id and t1.dt=t3.dt
left join 
(select 
dt
,call_city
,(driver_cut+subsidy_b)/order_charge_dis as b_cpm_avg_city
,p5_bcpm1 as p5_bcpm1_city
,p10_bcpm1 as p10_bcpm1_city
,p25_bcpm1 as p25_bcpm1_city
,p50_bcpm1 as p50_bcpm1_city
from dp_det_data.jinan_cpm_weidu1
where product_category='特惠快车'
) t4
on t1.call_city=t4.call_city and t1.dt=t4.dt

    where product_category in ('特惠快车')

)a
group by 
dt
,call_city
,driver_id
,b_cpm_avg_city
,p5_bcpm1_city
,p10_bcpm1_city
,p25_bcpm1_city
,p50_bcpm1_city) b
group by
call_city
,order_id_count
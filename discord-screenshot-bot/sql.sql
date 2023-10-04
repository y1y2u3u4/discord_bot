select 
call_city
,leixing
,avg(cnt_driver) as cnt_driver
,avg(order_id_count) as order_id_count
,avg(gmv) as gmv
,avg(driver_cut) as driver_cut
,avg(subsidy_b) as subsidy_b
,avg(order_charge_dis) as order_charge_dis
,avg(answer_dis) as answer_dis
,avg(cnt_driver_low_avg) as cnt_driver_low_avg
,avg(cnt_driver_low_p5) as cnt_driver_low_p5
,avg(cnt_driver_low_p10) as cnt_driver_low_p10
,avg(driver_cut_low_avg) as driver_cut_low_avg
,avg(driver_cut_low_p5) as driver_cut_low_p5
,avg(driver_cut_low_p10) as driver_cut_low_p10
,avg(subsidy_b_low_avg) as subsidy_b_low_avg
,avg(subsidy_b_low_p5) as subsidy_b_low_p5
,avg(subsidy_b_low_p10) as subsidy_b_low_p10
,avg(order_charge_dis_low_avg) as order_charge_dis_low_avg
,avg(order_charge_dis_low_p5) as order_charge_dis_low_p5
,avg(order_charge_dis_low_p10) as order_charge_dis_low_p10
,avg(cnt_driver_1) as cnt_driver_1
,avg(cnt_driver_2) as cnt_driver_2
,avg(cnt_driver_3) as cnt_driver_3
,avg(cnt_driver_4) as cnt_driver_4
,avg(cnt_driver_5) as cnt_driver_5
,avg(cnt_driver_6) as cnt_driver_6
,avg(cnt_driver_1_1) as cnt_driver_1_1
,avg(cnt_driver_2_1) as cnt_driver_2_1
,avg(cnt_driver_3_1) as cnt_driver_3_1
,avg(cnt_driver_4_1) as cnt_driver_4_1
,avg(cnt_driver_5_1) as cnt_driver_5_1
,avg(cnt_driver_6_1) as cnt_driver_6_1
,avg(cnt_driver_1_2) as cnt_driver_1_2
,avg(cnt_driver_2_2) as cnt_driver_2_2
,avg(cnt_driver_3_2) as cnt_driver_3_2
,avg(cnt_driver_4_2) as cnt_driver_4_2
,avg(cnt_driver_5_2) as cnt_driver_5_2
,avg(cnt_driver_6_2) as cnt_driver_6_2
-- ,avg(driver_cut_1) as driver_cut_1
-- ,avg(driver_cut_2) as driver_cut_2
-- ,avg(driver_cut_3) as driver_cut_3
-- ,avg(driver_cut_4) as driver_cut_4
-- ,avg(driver_cut_5) as driver_cut_5
-- ,avg(driver_cut_6) as driver_cut_6
-- ,avg(driver_cut_1_1) as driver_cut_1_1
-- ,avg(driver_cut_2_1) as driver_cut_2_1
-- ,avg(driver_cut_3_1) as driver_cut_3_1
-- ,avg(driver_cut_4_1) as driver_cut_4_1
-- ,avg(driver_cut_5_1) as driver_cut_5_1
-- ,avg(driver_cut_6_1) as driver_cut_6_1
-- ,avg(subsidy_b_1) as subsidy_b_1
-- ,avg(subsidy_b_2) as subsidy_b_2
-- ,avg(subsidy_b_3) as subsidy_b_3
-- ,avg(subsidy_b_4) as subsidy_b_4
-- ,avg(subsidy_b_5) as subsidy_b_5
-- ,avg(subsidy_b_6) as subsidy_b_6
-- ,avg(subsidy_b_1_1) as subsidy_b_1_1
-- ,avg(subsidy_b_2_1) as subsidy_b_2_1
-- ,avg(subsidy_b_3_1) as subsidy_b_3_1
-- ,avg(subsidy_b_4_1) as subsidy_b_4_1
-- ,avg(subsidy_b_5_1) as subsidy_b_5_1
-- ,avg(subsidy_b_6_1) as subsidy_b_6_1
-- ,avg(order_charge_dis_1) as order_charge_dis_1
-- ,avg(order_charge_dis_2) as order_charge_dis_2
-- ,avg(order_charge_dis_3) as order_charge_dis_3
-- ,avg(order_charge_dis_4) as order_charge_dis_4
-- ,avg(order_charge_dis_5) as order_charge_dis_5
-- ,avg(order_charge_dis_6) as order_charge_dis_6
-- ,avg(order_charge_dis_1_1) as order_charge_dis_1_1
-- ,avg(order_charge_dis_2_1) as order_charge_dis_2_1
-- ,avg(order_charge_dis_3_1) as order_charge_dis_3_1
-- ,avg(order_charge_dis_4_1) as order_charge_dis_4_1
-- ,avg(order_charge_dis_5_1) as order_charge_dis_5_1
-- ,avg(order_charge_dis_6_1) as order_charge_dis_6_1
from
(
select 
dt
,call_city
,leixing
,b_cpm_avg_city
,p5_bcpm1_city
,p10_bcpm1_city
,p25_bcpm1_city
,p50_bcpm1_city
,count(distinct driver_id) as cnt_driver
,sum(order_id_count) as order_id_count
,sum(gmv) as gmv
,sum(driver_cut) as driver_cut
,sum(subsidy_b) as subsidy_b
,sum(order_charge_dis) as order_charge_dis
,sum(answer_dis) as answer_dis
,count(distinct (case when b_cpm_avg_driver< b_cpm_avg_city then driver_id end)) as cnt_driver_low_avg
,count(distinct (case when p5_bcpm_driver< p5_bcpm1_city then driver_id end)) as cnt_driver_low_p5
,count(distinct (case when p10_bcpm_driver< p10_bcpm1_city then driver_id end)) as cnt_driver_low_p10
,sum (case when  b_cpm_avg_driver< b_cpm_avg_city then driver_cut end) as driver_cut_low_avg
,sum (case when  p5_bcpm_driver< p5_bcpm1_city then driver_cut end) as driver_cut_low_p5
,sum (case when  p10_bcpm_driver< p10_bcpm1_city then driver_cut end) as driver_cut_low_p10
,sum (case when  b_cpm_avg_driver< b_cpm_avg_city then subsidy_b end) as subsidy_b_low_avg
,sum (case when  p5_bcpm_driver< p5_bcpm1_city then subsidy_b end) as subsidy_b_low_p5
,sum (case when  p10_bcpm_driver< p10_bcpm1_city then subsidy_b end) as subsidy_b_low_p10
,sum (case when  b_cpm_avg_driver< b_cpm_avg_city then order_charge_dis end) as order_charge_dis_low_avg
,sum (case when  p5_bcpm_driver< p5_bcpm1_city then order_charge_dis end) as order_charge_dis_low_p5
,sum (case when  p10_bcpm_driver< p10_bcpm1_city then order_charge_dis end) as order_charge_dis_low_p10
,count(distinct (case when p5_bcpm_driver<=1.2 then driver_id end)) as cnt_driver_1
,count(distinct (case when p5_bcpm_driver>1.2 and p5_bcpm_driver<=1.5 then driver_id end)) as cnt_driver_2
,count(distinct (case when p5_bcpm_driver>1.5 and p5_bcpm_driver<=1.8 then driver_id end)) as cnt_driver_3
,count(distinct (case when p5_bcpm_driver>1.8 and p5_bcpm_driver<=2.1 then driver_id end)) as cnt_driver_4
,count(distinct (case when p5_bcpm_driver>2.1 and p5_bcpm_driver<=2.4 then driver_id end)) as cnt_driver_5
,count(distinct (case when p5_bcpm_driver>2.4 then driver_id end)) as cnt_driver_6
,count(distinct (case when p10_bcpm_driver<=1.2 then driver_id end)) as cnt_driver_1_1
,count(distinct (case when p10_bcpm_driver>1.2 and p10_bcpm_driver<=1.5 then driver_id end)) as cnt_driver_2_1
,count(distinct (case when p10_bcpm_driver>1.5 and p10_bcpm_driver<=1.8 then driver_id end)) as cnt_driver_3_1
,count(distinct (case when p10_bcpm_driver>1.8 and p10_bcpm_driver<=2.1 then driver_id end)) as cnt_driver_4_1
,count(distinct (case when p10_bcpm_driver>2.1 and p10_bcpm_driver<=2.4 then driver_id end)) as cnt_driver_5_1
,count(distinct (case when p10_bcpm_driver>2.4 then driver_id end)) as cnt_driver_6_1
,count(distinct (case when b_cpm_avg_driver<=1.2 then driver_id end)) as cnt_driver_1_2
,count(distinct (case when b_cpm_avg_driver>1.2 and b_cpm_avg_driver<=1.5 then driver_id end)) as cnt_driver_2_2
,count(distinct (case when b_cpm_avg_driver>1.5 and b_cpm_avg_driver<=1.8 then driver_id end)) as cnt_driver_3_2
,count(distinct (case when b_cpm_avg_driver>1.8 and b_cpm_avg_driver<=2.1 then driver_id end)) as cnt_driver_4_2
,count(distinct (case when b_cpm_avg_driver>2.1 and b_cpm_avg_driver<=2.4 then driver_id end)) as cnt_driver_5_2
,count(distinct (case when b_cpm_avg_driver>2.4 then driver_id end)) as cnt_driver_6_2
,sum (case when  p5_bcpm_driver<=1.2 then driver_cut end) as driver_cut_1
,sum (case when  p5_bcpm_driver>1.2 and p5_bcpm_driver<=1.5 then driver_cut end) as driver_cut_2
,sum (case when  p5_bcpm_driver>1.5 and p5_bcpm_driver<=1.8 then driver_cut end) as driver_cut_3
,sum (case when  p5_bcpm_driver>1.8 and p5_bcpm_driver<=2.1 then driver_cut end) as driver_cut_4
,sum (case when  p5_bcpm_driver>2.1 and p5_bcpm_driver<=2.4 then driver_cut end) as driver_cut_5
,sum (case when  p5_bcpm_driver>2.4 then driver_cut end) as driver_cut_6
,sum (case when  p10_bcpm_driver<=1.2 then driver_cut end) as driver_cut_1_1
,sum (case when  p10_bcpm_driver>1.2 and p10_bcpm_driver<=1.5 then driver_cut end) as driver_cut_2_1
,sum (case when  p10_bcpm_driver>1.5 and p10_bcpm_driver<=1.8 then driver_cut end) as driver_cut_3_1
,sum (case when  p10_bcpm_driver>1.8 and p10_bcpm_driver<=2.1 then driver_cut end) as driver_cut_4_1
,sum (case when  p10_bcpm_driver>2.1 and p10_bcpm_driver<=2.4 then driver_cut end) as driver_cut_5_1
,sum (case when  p10_bcpm_driver>2.4 then driver_cut end) as driver_cut_6_1
,sum (case when  p5_bcpm_driver<=1.2 then subsidy_b end) as subsidy_b_1
,sum (case when  p5_bcpm_driver>1.2 and p5_bcpm_driver<=1.5 then subsidy_b end) as subsidy_b_2
,sum (case when  p5_bcpm_driver>1.5 and p5_bcpm_driver<=1.8 then subsidy_b end) as subsidy_b_3
,sum (case when  p5_bcpm_driver>1.8 and p5_bcpm_driver<=2.1 then subsidy_b end) as subsidy_b_4
,sum (case when  p5_bcpm_driver>2.1 and p5_bcpm_driver<=2.4 then subsidy_b end) as subsidy_b_5
,sum (case when  p5_bcpm_driver>2.4 then subsidy_b end) as subsidy_b_6
,sum (case when  p10_bcpm_driver<=1.2 then subsidy_b end) as subsidy_b_1_1
,sum (case when  p10_bcpm_driver>1.2 and p10_bcpm_driver<=1.5 then subsidy_b end) as subsidy_b_2_1
,sum (case when  p10_bcpm_driver>1.5 and p10_bcpm_driver<=1.8 then subsidy_b end) as subsidy_b_3_1
,sum (case when  p10_bcpm_driver>1.8 and p10_bcpm_driver<=2.1 then subsidy_b end) as subsidy_b_4_1
,sum (case when  p10_bcpm_driver>2.1 and p10_bcpm_driver<=2.4 then subsidy_b end) as subsidy_b_5_1
,sum (case when  p10_bcpm_driver>2.4 then subsidy_b end) as subsidy_b_6_1
,sum (case when  p5_bcpm_driver<=1.2 then order_charge_dis end) as order_charge_dis_1
,sum (case when  p5_bcpm_driver>1.2 and p5_bcpm_driver<=1.5 then order_charge_dis end) as order_charge_dis_2
,sum (case when  p5_bcpm_driver>1.5 and p5_bcpm_driver<=1.8 then order_charge_dis end) as order_charge_dis_3
,sum (case when  p5_bcpm_driver>1.8 and p5_bcpm_driver<=2.1 then order_charge_dis end) as order_charge_dis_4
,sum (case when  p5_bcpm_driver>2.1 and p5_bcpm_driver<=2.4 then order_charge_dis end) as order_charge_dis_5
,sum (case when  p5_bcpm_driver>2.4 then order_charge_dis end) as order_charge_dis_6
,sum (case when  p10_bcpm_driver<=1.2 then order_charge_dis end) as order_charge_dis_1_1
,sum (case when  p10_bcpm_driver>1.2 and p10_bcpm_driver<=1.5 then order_charge_dis end) as order_charge_dis_2_1
,sum (case when  p10_bcpm_driver>1.5 and p10_bcpm_driver<=1.8 then order_charge_dis end) as order_charge_dis_3_1
,sum (case when  p10_bcpm_driver>1.8 and p10_bcpm_driver<=2.1 then order_charge_dis end) as order_charge_dis_4_1
,sum (case when  p10_bcpm_driver>2.1 and p10_bcpm_driver<=2.4 then order_charge_dis end) as order_charge_dis_5_1
,sum (case when  p10_bcpm_driver>2.4 then order_charge_dis end) as order_charge_dis_6_1
from (
select 
dt
,call_city
,driver_id
,leixing
,b_cpm_avg_city
,p5_bcpm1_city
,p10_bcpm1_city
,p25_bcpm1_city
,p50_bcpm1_city
,count(distinct order_id) as order_id_count
,sum(gmv) as gmv
,sum(driver_cut) as driver_cut
,sum(subsidy_b) as subsidy_b
,sum(order_charge_dis) as order_charge_dis
,sum(answer_dis) as answer_dis
,(sum(driver_cut)+sum(subsidy_b))/sum(order_charge_dis) as b_cpm_avg_driver
,percentile_approx(b_cpm1, 0.01) as p1_bcpm_driver
,percentile_approx(b_cpm1, 0.05) as p5_bcpm_driver
,percentile_approx(b_cpm1, 0.10) as p10_bcpm_driver
,percentile_approx(b_cpm1, 0.25) as p25_bcpm_driver
,percentile_approx(b_cpm1, 0.50) as p50_bcpm_driver
,IF((SUM(driver_cut) + SUM(subsidy_b)) / SUM(order_charge_dis) < b_cpm_avg_city, 1, 0) AS b_cpm_low_avg_flag
,IF(percentile_approx(b_cpm1, 0.05) < p5_bcpm1_city, 1, 0) AS b_cpm_p5_avg_flag
,IF(percentile_approx(b_cpm1, 0.10) < p10_bcpm1_city, 1, 0) AS b_cpm_p10_avg_flag
from
(
    select  
    t1.call_city
    ,product_category
    ,t1.dt as dt
    ,t1.driver_id as driver_id
    ,leixing
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
,case when order_id_count_th<=1 then '1'
      when  order_id_count_th>1 and  order_id_count_th<=3 then '3'
      when  order_id_count_th>3 and  order_id_count_th<=5 then '5'
      when  order_id_count_th>5 and  order_id_count_th<=8 then '8'
      when  order_id_count_th>8 and  order_id_count_th<=10 then '10'
      when  order_id_count_th>10 then '11'
  else '0' end as leixing
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
,leixing
,b_cpm_avg_city
,p5_bcpm1_city
,p10_bcpm1_city
,p25_bcpm1_city
,p50_bcpm1_city) b
group by
dt
,call_city
,leixing
,b_cpm_avg_city
,p5_bcpm1_city
,p10_bcpm1_city
,p25_bcpm1_city
,p50_bcpm1_city
) c
group by
call_city
,leixing
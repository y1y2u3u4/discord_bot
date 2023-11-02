def func_qibu_shichang(x):
        licheng_c, shichang_c, licheng_b, shichang_b, qibu_dixiao_c, \
        qibu_dixiao_b, chaolicheng_c_price, chaolicheng_b_price, qibulicheng, \
        qibushichang,price_tiaohou_bianhua_c,price_tiaohou_bianhua_b = _unpack_x(x)
        #供需系数融合部分
        df['时间分类']=df['timeselect'].apply(lambda x: np.floor(x))
        df['价格变动_c'] = df['时间分类'].map({
            i: v for i, v in enumerate(price_tiaohou_bianhua_c)
        })      
        df['价格变动_b'] = df['时间分类'].map({
            i: v for i, v in enumerate(price_tiaohou_bianhua_b)
        }) 
        # 通用变量
        df['调后剔除起步里程后里程'] = df['distance'].apply(
            lambda _x: max(_x - qibulicheng, 0)
        )
        df['调后剔除起步时长后单均时长'] = df['单均时长'].apply(
            lambda _x: max(_x - qibushichang, 0)
        )

        # 乘客
        # 调后乘客里程费
        df['调后乘客分时里程费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(licheng_c)
        })
        df['调后乘客里程费'] = df['调后乘客分时里程费'] * df['调后剔除起步里程后里程']

        # 调后乘客时长费
        df['调后乘客分时时长费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(shichang_c)
        })
        df['调后乘客时长费'] = df['调后剔除起步时长后单均时长'] * df['调后乘客分时时长费']

        # 调后乘客超公里费
        chaolicheng_c_cal = _chaolicheng_func(chaolicheng_c, chaolicheng_c_price)
        df['调后乘客超公里费'] = df['distance'].apply(chaolicheng_c_cal)

        # 起步价
        df['调后C端起步费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(qibu_dixiao_c)
        })

        # 调后C端价格
        df['调后C端价格'] = df['调后乘客时长费'] + df['调后乘客里程费'] + df['调后C端起步费'] + df['调后乘客超公里费']

        # 司机
        # 调后司机里程费
        df['调后司机分时里程费'] = df['分时时段_th_new'].map(
            {i: v for i, v in enumerate(licheng_b)})
        df['调后司机里程费'] = df['调后司机分时里程费'] * df['调后剔除起步里程后里程']

        # 调后司机时长费
        df['调后司机分时时长费'] = df['分时时段_th_new'].map(
            {i: v for i, v in enumerate(shichang_b)})
        df['调后司机时长费'] = df['调后剔除起步时长后单均时长'] * df['调后司机分时时长费']

        # 调后司机超公里费
        chaolicheng_c_cal = _chaolicheng_func(chaolicheng_b, chaolicheng_b_price)
        df['调后司机超公里费'] = df['distance'].apply(chaolicheng_c_cal)
        df['调后B端起步费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(qibu_dixiao_b)
        })
        # 调后B端价格
        df['调后B端价格'] = df['调后司机时长费'] + df['调后司机里程费'] + df['调后B端起步费'] + df['调后司机超公里费']

        # 返回值计算
        return result_func(df)
        
    @decorator_iter_callback
    def func_dixiao_shichang(x):
        licheng_c, shichang_c, licheng_b, shichang_b, qibu_dixiao_c, \
        qibu_dixiao_b, chaolicheng_c_price, chaolicheng_b_price, qibulicheng, \
        qibushichang,price_tiaohou_bianhua_c,price_tiaohou_bianhua_b = _unpack_x(x)
        #供需系数融合部分
        df['时间分类']=df['timeselect'].apply(lambda x: np.floor(x))
        df['价格变动_c'] = df['时间分类'].map({
            i: v for i, v in enumerate(price_tiaohou_bianhua_c)
        })      
        df['价格变动_b'] = df['时间分类'].map({
            i: v for i, v in enumerate(price_tiaohou_bianhua_b)
        }) 
        # 通用变量
        df['调后剔除起步里程后里程'] = df['distance'].apply(
            lambda _x: max(_x - qibulicheng, 0)
        )
        df['调后剔除起步时长后单均时长'] = df['单均时长'].apply(
            lambda _x: max(_x - qibushichang, 0)
        )

        # 乘客
        # 调后乘客里程费
        df['调后乘客分时里程费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(licheng_c)
        })
        df['调后乘客里程费'] = df['调后乘客分时里程费'] * df['调后剔除起步里程后里程']

        # 调后乘客时长费
        df['调后乘客分时时长费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(shichang_c)
        })
        df['调后乘客时长费'] = df['调后剔除起步时长后单均时长'] * df['调后乘客分时时长费']

        # 调后乘客超公里费
        chaolicheng_c_cal = _chaolicheng_func(chaolicheng_c, chaolicheng_c_price)
        df['调后乘客超公里费'] = df['distance'].apply(chaolicheng_c_cal)

        # 起步价
        df['调后C端起步费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(qibu_dixiao_c)
        })
        #   mark: 调前乘客应付
        def function_4_2(a):
            if a['抵消模式比较_2'] >= 0:
                return a['抵消模式比较_1']
            else:
                return a['调后C端起步费']
        df['抵消模式比较_1'] = df['调后乘客时长费'] + df['调后乘客里程费'] + df['调后乘客超公里费']
        df['抵消模式比较_2'] = df['抵消模式比较_1'] - df['调后C端起步费']
        
        # 调后C端价格
        df['调后C端价格'] = df.apply(lambda x: function_4_2(x), axis=1)
        # 司机
        # 调后司机里程费
        df['调后司机分时里程费'] = df['分时时段_th_new'].map(
            {i: v for i, v in enumerate(licheng_b)})
        df['调后司机里程费'] = df['调后司机分时里程费'] * df['调后剔除起步里程后里程']

        # 调后司机时长费
        df['调后司机分时时长费'] = df['分时时段_th_new'].map(
            {i: v for i, v in enumerate(shichang_b)})
        df['调后司机时长费'] = df['调后剔除起步时长后单均时长'] * df['调后司机分时时长费']

        # 调后司机超公里费
        chaolicheng_c_cal = _chaolicheng_func(chaolicheng_b, chaolicheng_b_price)
        df['调后司机超公里费'] = df['distance'].apply(chaolicheng_c_cal)
        df['调后B端起步费'] = df['分时时段_th_new'].map({
            i: v for i, v in enumerate(qibu_dixiao_b)
        })
        def function_5_2(a):
            if a['抵消模式比较_2'] >= 0:
                return a['抵消模式比较_1']
            else:
                return a['调后B端起步费']
        df['B端抵消模式比较_1'] = df['调后司机时长费'] + df['调后司机里程费'] + df['调后司机超公里费']
        df['B端抵消模式比较_2'] = df['B端抵消模式比较_1'] - df['调后B端起步费']
        # 调后B端价格
        df['调后B端价格'] = df.apply(lambda x: function_5_2(x), axis=1)

        # 返回值计算
        return result_func(df)
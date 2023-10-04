





// --- 必要的逻辑处理
const findIntervalHour = (dPriceValue, pPriceValue) => {
    // 区间变量
    let hoursRange = [];
    let hours = [];
  
    // 粒度拆分
    [...dPriceValue, ...pPriceValue].forEach((item) => {
      const keyArr = Object.keys(item.datas || {});
      for (let key of keyArr) {
        if (key.includes('TimeInterval')) {
          item.datas[key] &&
            item.datas[key].forEach((dataItem) => {
              hoursRange.push([dataItem.begin, dataItem.end]);
              hours.push(dataItem.begin, dataItem.end);
            });
        }
      }
    });
  
    // 排序
    hours = [...new Set(hours)].sort();
    // 数据补齐
    if (hours[0] !== '00:00') {
      hours.unshift('00:00');
    }
    if (hours[hours.length - 1] !== '00:00') {
      hours.push('00:00');
    }
    // 递进组合
    let result = [];
    hours.forEach((item, index) => {
      if (index > 0) {
        result.push({
          interval: [hours[index - 1] + ':00', item + ':00'],
          peak: hoursRange.find(
            ([a, b]) =>
              a <= hours[index - 1] &&
              (b === '00:00' ? '24:00' : b) >= (item === '00:00' ? '24:00' : item)
          )
            ? ''
            : '平峰'
        });
      }
    });
    return result;
  };
  
  // 获取分段里程费，做一层过滤
  const findDistance = (dPriceValue, pPriceValue) => {
    const dValue = dPriceValue.find((item) => item.name === '超公里费')?.datas;
    const dTimeData = ( dValue.emptyByDistanceSerialInterval || []).map((item) => item.begin - 0);
    const dStartData = +dValue.emptyDistance ? [+dValue.emptyDistance - 0] : [];
    const bDistance = dStartData.concat(dTimeData);
  
    const cValue = pPriceValue.find((item) => item.name === '超公里费')?.datas;
    const cTimeData = ( cValue.emptyByDistanceSerialInterval || []).map((item) => item.begin - 0);
    const cStartData = +cValue.emptyDistance ? [+cValue.emptyDistance - 0] : [];
    const cDistance = cStartData.concat(cTimeData);
    
    return { bDistance, cDistance };
  };
  
  export const linkPlutusSolveData = (data) => {
    const { costMode, dpriceValve = [], ppriceValue = [], ifInfo, startMode = '起步价模式' } = data;
    const hourValue = findIntervalHour(dpriceValve, ppriceValue);
    const { bDistance, cDistance } = findDistance(dpriceValve, ppriceValue);
    return {
      startMode,
      info: ifInfo ? '是' : '否',
      costMode,
      hourValue,
      bDistance,
      cDistance
    };
  };
  
  const getBoundsAndSegmentNeedData = ({ solveSettings, peakTimes, dPriceValue, pPriceValue, isNeedSegment = true }) => {
  
    const timeTransfer = (time) => {
      const [m, n] = time.split(':').slice(0, 2);
      return m * 2 + (n === '30' ? 1 : 0);
    };
  
    const transformIntervalToArray = (interValue, key) => {
      const arr = [];
      interValue.forEach((item) => {
        const { interval } = item;
        const start = timeTransfer(interval[0]);
        const end = timeTransfer(
          interval[1] === '00:00:00' ? '24:00:00' : interval[1]
        );
        for (let i = start; i < end; i++) {
          arr[i] = item[key];
        }
      });
    
      return arr;
    };
    
    // 起步价，里程费，时间费 (b,c 调前 调后 转换成24小时内的 价格及峰期
    const transformBasePlanHourPrice = (timeUnitPrice, timeByTimeInterval) => {
      if (!timeUnitPrice && !(timeByTimeInterval instanceof Array)) {
        return [
          {
            interval: ['00:00:00', '00:00:00'],
            value: 0,
            peak: '平峰',
          },
        ];
      }
      if (
        !(timeByTimeInterval instanceof Array && timeByTimeInterval?.length !== 0)
      ) {
        return [
          {
            interval: ['00:00:00', '00:00:00'],
            value: timeUnitPrice,
            peak: '平峰',
          },
        ];
      }
      // 首先针对初始值排一下序
      let newTimeByTimeInterval = [...timeByTimeInterval].sort((a, b) => {
        return a?.begin < b?.begin ? -1 : 1;
      });
    
      let hoursObj = [];
      let hourTemp = '00:00';
      // 转化高峰值和平峰值为对应数据
      (newTimeByTimeInterval || []).forEach((item, index) => {
        let { begin, end } = item;
        begin = begin.slice(0, 5);
        end = end.slice(0, 5);
        if (index === 0 && begin !== '00:00') {
          hoursObj.push({
            interval: ['00:00:00', `${begin}:00`],
            value: timeUnitPrice,
            peak: '平峰',
          });
        } else if (hourTemp < begin) {
          hoursObj.push({
            interval: [`${hourTemp}:00`, `${begin}:00`],
            value: timeUnitPrice,
            peak: '平峰',
          });
        }
        hoursObj.push({
          interval: [`${begin}:00`, `${end}:00`],
          value: item.price,
          peak: '高峰',
        });
        if (index === timeByTimeInterval.length - 1 && end !== '00:00') {
          hoursObj.push({
            interval: [`${end}:00`, '00:00:00'],
            value: timeUnitPrice,
            peak: '平峰',
          });
        }
        hourTemp = item.end;
      });
    
      return hoursObj;
    };
    
    const transformModulePrice = (data, key) => {
      // 字段映射
      const mapModule = {
        time_fee: {
          unitPrice: 'timeUnitPrice',
          timeInterval: 'timeByTimeInterval',
        },
        mileage: {
          unitPrice: 'normalUnitPrice',
          timeInterval: 'distanceByTimeInterval',
        },
        start: {
          unitPrice: 'startPrice',
          timeInterval: 'startPriceByTimeInterval',
        },
        low_speed_fee: {
          unitPrice: 'lowSpeedTimeUnitPrice',
          timeInterval: 'lowSpeedByTimeInterval',
        },
        limit_fee: {
          unitPrice: 'limitFee',
          timeInterval: 'limitFeeByTimeInterval',
        },
      };
      const formatDataObj = {};
      // 转换成对应数据包含  时间费、里程费、起步价、超公里费、起步里程&起步时长 相应的价格
      data?.forEach((item) => {
        if (mapModule[item.module]) {
          const { unitPrice, timeInterval } = mapModule[item.module];
          const priceOriginalData = transformBasePlanHourPrice(
            item?.datas[unitPrice] || 0,
            item?.datas[timeInterval]
          );
    
          formatDataObj[`${key}Value${item.module}`] = transformIntervalToArray(
            priceOriginalData,
            'value'
          );
    
          if (item.module === 'start') {
            formatDataObj[`${key}WithoutBounds`] = {
              起步里程: item?.datas?.startDistance || 0,
              起步时长: item?.datas?.startPackageTime || 0,
              起步低速时长: item?.datas?.startPackageLowSpeedTime|| 0,
            };
          }
        }else if(item.module === 'empty_distance_fee') {
          formatDataObj[`${key}ValueEmptyDistance`] = item.datas.emptyByDistanceSerialInterval?.map((item) => item.price) || [item.datas.emptyDrivingUnitPrice];
        }
      });
      return formatDataObj;
    };
  
    if(!isNeedSegment) {
      return {
        bPrice: transformModulePrice(dPriceValue, 'b'),
        cPrice: transformModulePrice(pPriceValue, 'c')
      };
    }
  
    const getSolveSettingValueName = (name) => {
      return solveSettings.find((item) => item.name === name)?.value || [];
    };
  
    const transformSegmentIntervalToArray = (interValue) => {
      const arr = new Array(48).fill(false);
      interValue.forEach((interval) => {
        const start = timeTransfer(interval[0]);
        const end = timeTransfer(
          interval[1] === '00:00:00' ? '24:00:00' : interval[1]
        );
        for (let i = start; i < end; i++) {
          arr[i] = true;
        }
      });
    
      return arr;
    };
  
    // segments数据
    const transformSegmentsIntervalPrice = () => {
  
      const transformSegmentPrice = ({ data }) => {
        const mapIntervalToIndex = (data) => {
          if(data.length === 0) {
            return [ new Array(48).fill(true) ];
          }
          return data.map((arr) => {
            return transformSegmentIntervalToArray(arr.map((item) => peakTimes[item]));
          });
        };
      
        return mapIntervalToIndex(data);
      };
  
      return {
        start: transformSegmentPrice({ data: getSolveSettingValueName('起步价参数拉齐') } ),
        mileage: transformSegmentPrice({ data: getSolveSettingValueName('里程费参数拉齐') } ),
        time_fee: transformSegmentPrice({ data: getSolveSettingValueName('时间费参数拉齐') } ),
        low_speed_fee: transformSegmentPrice({ data: getSolveSettingValueName('低速费参数拉齐') } ),
        limit_fee: transformSegmentPrice({ data: getSolveSettingValueName('基础费参数拉齐') } ),
      };
    };
  
    return {
      segment: transformSegmentsIntervalPrice(),
      bPrice: transformModulePrice(dPriceValue, 'b'),
      cPrice: transformModulePrice(pPriceValue, 'c'),
    };
  };
  
  const lacyPriceParams = ({ bPrice, cPrice, hourValue, key }) => {
    if(!hourValue?.length || !key || !bPrice || !cPrice) {
      return [[]];
    }
  
    const newSetData = [];
    const bData = bPrice[`bValue${key}`];
    const cData = cPrice[`cValue${key}`];
  
    const times = hourValue.map((item, index) => {
      const { interval } = item;    
  
      const timeTransfer = (time) => {
        // 把时间按步长分隔成份数,30分钟一次
        const [m, n] = time.split(':').slice(0, 2);
        return m * 2 + (n === '30' ? 1 : 0);
      };
  
      const timeStart = timeTransfer(interval[0]);
      const timeEnd = timeTransfer(interval[1] === '00:00:00' ? '24:00:00' : interval[1]);
      let cSum = 0, bSum = 0;
      for(let i = timeStart; i < timeEnd; i ++) {
        cSum = +customCalc(cSum, cData[i], '+');
        bSum = +customCalc(bSum, bData[i], '+');
      }
  
      const bPrice = +customCalc(bSum, timeEnd - timeStart, '/', 2);
      const cPrice = +customCalc(cSum, timeEnd - timeStart, '/', 2);
  
      if(!newSetData.find((item) => item.bPrice === bPrice && item.cPrice === cPrice)) {
        newSetData.push({ bPrice, cPrice });
      }
  
      return {
        ...item,
        bPrice,
        cPrice,
        id: index
      };
    });
    return newSetData.map((item) => {
      return times.filter(({ bPrice, cPrice}) => bPrice == item.bPrice && cPrice === item.cPrice).map(({ id }) => id);
    });
  
  };
  // ---必要的逻辑处理
  
  // 模版信息 接口
  configContent : https://insight-test.intra.xiaojukeji.com/price_adjust/conf/template?biz=MIXED_MODEL
  
  curl --location --request POST 'http://10.83.129.15:8048/price_adjust/conf/template?biz=MIXED_MODEL' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "product":"KUAICHE"
  }'
  



  //财神信息接口 （获取基础定价）
  plutusData: https://insight-test.intra.xiaojukeji.com/price_adjust/base_price/85311?app=PLUTUS
  
  // 注意数据存在转换，会转换成驼峰数据
  const {
        costMode = '',
        info,
        startMode = '',
        hourValue,
        bDistance,
        cDistance
      } = linkPlutusSolveData(plutusData, configContent);
      const { solveSettingsTpl = {} } = configContent;
      const { baseSetting, timeSetting, distanceSetting, compareAspSetting = [] } = solveSettingsTpl;
  
      const transferProduct = transferLan[params.product[0]];
      const { bPrice, cPrice } = getBoundsAndSegmentNeedData({ pPriceValue: plutusData.ppriceValue, dPriceValue: plutusData.dpriceValve, isNeedSegment: false });
  
      let newConfigContent = {
        ...configContent,
        solveSettingsTpl: {
          ...solveSettingsTpl,
          baseSetting: baseSetting.map((item) => {
            const { name } = item;
            if (name === '起步模式') {
              return {
                ...item,
                value: (item.range || []).includes(startMode) ? startMode : item.value,
              };
            } else if (name === '计费模式') {
              return {
                ...item,
                value: costMode,
                operate: true
                // operate: !plutusData.fenceId
              };
            } else if (name === '信息费') {
              return {
                ...item,
                value: info,
                operate: true
                // operate: !plutusData.fenceId
              };
            } else if (['供需系数生效时间', '基础定价生效时间'].includes(name)) {
              const value = item.value.length
                ? item.value.map((item) => {
                  return item
                    ? item
                    : moment()
                      .add(1, 'month')
                      .format('YYYY-MM-DD');
                })
                : [
                  moment()
                    .add(1, 'month')
                    .format('YYYY-MM-DD'),
                  moment()
                    .add(1, 'month')
                    .add(2, 'week')
                    .format('YYYY-MM-DD')
                ];
              return {
                ...item,
                value
              };
            } else if (name === '求解输入日期范围') {
              return {
                ...item,
                value: [
                  moment()
                    .add(-29, 'day')
                    .format('YYYY-MM-DD'),
                  moment()
                    .add(-2, 'day')
                    .format('YYYY-MM-DD')
                ]
              };
            } else if (name === '特惠价格变化假设' || name === 'A+价格变化假设') {
              return {
                ...item,
                supply: params.product[0] === 'KUAICHE'
              };
            } else if (name === '专车车型选择') {
              const { productId } = plutusData;
              const mapValue = {
                211: '211|专车-舒适型',
                351: '351|专车-商务型',
                361: '361|专车-行政级',
              };
              return {
                ...item,
                supply: params.product[0] === 'ZHUANCHE',
                value: mapValue[productId] || '211|专车-舒适型'
              };
            } else if(name === '是否开启供需系数调价') {
              return {
                ...item,
                operate: !params.product[0].includes('HAO'),
                value: params.product[0].includes('HAO') ? '否' : '是',
              };
            } else if(name === '价格类型') {
              return {
                ...item,
                supply: params.product[0].includes('HAO')
              };
            }else if(['供需系数B端模式', '供需系数C端模式', 'B端兜底金额'].includes(name)) {
              return {
                ...item,
                supply: !params.product[0].includes('HAO')
              };
            } else if(name === '价格车型选择') {
  
              if(params.product[0].includes('HAO')) {
                const { dimensions } = this.props;
                const { cityId, product } = params;
                const { carLevelCityMap } = dimensions;
                let value = '低价车型';
                const findData = carLevelCityMap?.find((item) => item?.value?.cityId === cityId[0]);
  
                if(findData) {
                  if(findData.value?.highPriceCarLevel?.includes(transferLan[product])) {
                    value = '高价车型';
                  }
                }
                
                return {
                  ...item,
                  supply: true,
                  value
                };
              }
  
              return {
                ...item,
                supply: params.product[0].includes('HAO') ? true : false,
                value: '低价车型'
              };
            } else if(name === '是否围栏定价') {
              return {
                ...item,
                supply: plutusData.fenceId ? true : false,
                value: plutusData.fenceId ? '是' : '否'
              };
            } else if(name === '围栏ID') {
              return {
                ...item,
                supply: plutusData.fenceId ? true : false,
                value: plutusData.fenceId ? +plutusData.fenceId : 0
              };
            }
            else {
              return item;
            }
          }),
          distanceSetting: distanceSetting.map((item) => {
            if (item.name === '调后远途费B端里程段') {
              return {
                ...item,
                value: ( bDistance && bDistance.length ) ? bDistance : item.value
              };
            } else if (item.name === '调后远途费C端里程段') {
              return {
                ...item,
                value: ( cDistance && cDistance.length ) ? cDistance : item.value
              };
            } else if (item.name === '调后远途费里程段') {
              return {
                ...item,
                value: ( cDistance && cDistance.length ) ? cDistance : item.value
              };
            }else {
              return item;
            }
          }),
          timeSetting: timeSetting.map((item) => {
            if (item.name === '调后时间段设置') {
              return {
                ...item,
                value: hourValue.length ? hourValue : item.value
              };
            } else if(item.name.includes('参数拉齐')) {
              const mapName = {
                '起步价参数拉齐': 'start',
                '里程费参数拉齐': 'mileage',
                '时间费参数拉齐': 'time_fee',
                '低速费参数拉齐': 'low_speed_fee',
                '基础费参数拉齐': 'limit_fee'
              };
  
              const value = lacyPriceParams({ bPrice, cPrice, hourValue, key: mapName[item.name] });
  
              return {
                ...item,
                value
              };
            } else if(['B端供需系数模型出价时段', 'C端供需系数模型出价时段'].includes(item.name)) {
              return {
                ...item,
                value: params.product[0].includes('HAO') ? [] : item.value
              };
            }
            else {
              return item;
            }
          })
        }
      };
  
  // 处理好的求解设置部分
  console.log(newConfigContent);


  // 上述求解设置信息输入好后，基于求解设置信息获取 角色变量 & 约束变量信息
  

  // 必要的逻辑处理
  export const newLinkageConfig = ({ solveSettingValue, boundsTpl, constraintTpl, currentProduct, dPriceValue, pPriceValue }) => {
    // 处理角色变量的联动
    // 必要的准备条件
    const solveSettings = Object.values(solveSettingValue).flat(1);
    const getSolveSettingValueName = (name) => {
      return solveSettings.find((item) => item.name === name)?.value || [];
    };
    const peakTimes = getSolveSettingValueName('调后时间段设置')?.map((item) => item.interval);
    const distances = getSolveSettingValueName('调后远途费里程段');
    const consDistances = getSolveSettingValueName('约束里程段');
    const isLuxuryStartAndLow = (currentProduct.includes('豪华车') || currentProduct.includes('HAO')) &&  getSolveSettingValueName('起步模式') === '起步价低消模式';
  
    let time = [];
  
    const boundsNeedObj = getBoundsAndSegmentNeedData({ solveSettings, dPriceValue, pPriceValue, peakTimes });
  
    const transformBasePriceWithoutPeakBounds = () => {
      const { cPrice } = boundsNeedObj;
      return {
        basePriceWithoutPeakBounds: boundsTpl?.basePriceWithoutPeakBounds?.map((item) => {
          // 不是起步低消并且不是起步价模式  会走这个逻辑
          const isStartPrice = getSolveSettingValueName('起步模式') === '起步价模式';
          const isTimePrice = getSolveSettingValueName('计费模式') === '时长模式';
  
          if (!isStartPrice && !isLuxuryStartAndLow) {
            return {
              ...item,
              supply: !item.name.includes('起步')
            };
          }
          const initValue = cPrice.cWithoutBounds[item.name];
          return {
            ...item,
            initValue,
            bounds: (initValue == null || isNaN(initValue)) ? item.bounds : [initValue, initValue],
            supply: isTimePrice ?
              !item.name.includes('起步低速时长')
              :!item.name.includes('起步时长')
          };
        }) || [],
      };
    };
  
    const transformSdBounds = () => {
      const afterTimeValue = getSolveSettingValueName('调后时间段设置');
      const hiddenBounds = getSolveSettingValueName('是否开启供需系数调价') === '是';
      const bSdBounds = [], cSdBounds = [];
  
      afterTimeValue.forEach((item) => {
        const { interval } = item;
        time.push(interval);
        bSdBounds.push({
          ...(boundsTpl.bSdBounds[0] || {}),
          timeInterval: interval,
          supply: hiddenBounds
        });
        cSdBounds.push({
          ...(boundsTpl.cSdBounds[0] || {}),
          timeInterval: interval,
          supply: hiddenBounds
        });
      });
  
      return {
        bSdBounds,
        cSdBounds
      };
    };
  
    const transformSegmentBounds = () => {
      const startName = getSolveSettingValueName('起步模式');
      const feeName = getSolveSettingValueName('计费模式');
      const startMode = startName === '起步价模式' ? ['起步价参数拉齐'] : startName === ['起步价低消模式'] ? ['起步价参数拉齐', '基础费参数拉齐'] : ['基础费参数拉齐'];
      const feeMode = feeName === '时长模式' ? ['时间费参数拉齐'] : ['低速费参数拉齐'];
      const paramsMode = ['里程费参数拉齐', ...startMode, ...feeMode];
  
      const mapSegmentToPrice = (key) => {
        const { cPrice, bPrice, segment } = boundsNeedObj;
        const cNeedData = cPrice[`cValue${key}`];
        const bNeedData = bPrice[`bValue${key}`];
        const data = segment[key];
      
        return data.map((item) => {
          let sum = 0, len = 0;
          cNeedData.forEach((price, i) => {
            if(item[i]) {
              sum = +customCalc(sum, price, '+');
              len ++;
            } 
          });
          let bSum = 0;
          bNeedData.forEach((price, i) => {
            if(item[i]) {
              bSum = +customCalc(bSum, price, '+');
            } 
          });
      
          return {
            price: +customCalc(sum, len, '/', 2),
            tr: +customCalc(+customCalc(sum, bSum, '-'), sum, '/', 2) || 0
          };
        });
      };
  
      const transformData= ({ name, key }) => {
        const mapName = {
          '起步价参数拉齐': 'start',
          '里程费参数拉齐': 'mileage',
          '时间费参数拉齐': 'time_fee',
          '低速费参数拉齐': 'low_speed_fee',
          '基础费参数拉齐': 'limit_fee'
        };
  
        const priceS = mapSegmentToPrice(mapName[name]);
        let bounds = [];
        const data = getSolveSettingValueName(name);
        const params = data?.length || 1;
        let temp = boundsTpl[key];
        for (let index = 0; index < params; index++) {
          const segment = index + 1;
          const arr = boundsTpl[key]?.filter((item) => {
            return item.segment === segment;
          }) || [];
          if (arr?.length) {
            bounds = bounds.concat(arr);
          } else {
            bounds = bounds.concat(temp?.filter((item) => item.segment === temp[0].segment)?.map((item) => {
              return {
                ...item,
                segment
              };
            }));
          }
        }
  
        return bounds.map((item) => {
          const data = priceS[item.segment - 1] || {};
          const initValue = item.name.includes('TR') ? data.tr : data.price;
          return {
            ...item,
            initValue,
            supply: paramsMode.includes(name),
            bounds: (initValue == null || isNaN(initValue)) ? item.bounds : [initValue, initValue]
          };
        });
      };
  
      return {
        startBounds: transformData({ key: 'startBounds', name: '起步价参数拉齐' }),
        distanceBounds: transformData({ key: 'distanceBounds', name: '里程费参数拉齐' }),
        timeBounds: transformData({ key: 'timeBounds', name: '时间费参数拉齐' }),
        lowSpeedBounds: transformData({ key: 'lowSpeedBounds', name: '低速费参数拉齐' }),
        limitFeeBounds: transformData({ key: 'limitFeeBounds', name: '基础费参数拉齐' }),
      };
      
    };
  
    const transfromDistanceBounds = () => {
      const temp = (boundsTpl.emptyDistanceBounds || [])?.filter((item) => item.distance === boundsTpl.emptyDistanceBounds[0]?.distance);
      let emptyDistanceBounds = [];
      const { cPrice, bPrice } = boundsNeedObj;
      distances.forEach((distance, index) => {
        const cValue = cPrice.cValueEmptyDistance[index] || cPrice.cValueEmptyDistance[cPrice.cValueEmptyDistance.length - 1];
        const bValue = bPrice.bValueEmptyDistance[index] || bPrice.bValueEmptyDistance[bPrice.bValueEmptyDistance.length - 1];
        emptyDistanceBounds = emptyDistanceBounds.concat(temp.map((item) => {
          const initValue = item.name.includes('TR') ? +customCalc(+customCalc(+cValue, +bValue, '-'), +cValue, '/', 2) : +cValue;
          return {
            ...item,
            distance,
            initValue,
            bounds: (initValue == null || isNaN(initValue)) ? item.bounds : [initValue, initValue]
          };
        }));
      });
  
      return {
        emptyDistanceBounds
      };
    };
  
    const transformConsTime = () => {
      const oldConsTime = constraintTpl?.consTime || [];
      const tpl = oldConsTime.filter((item) => item.timeInterval.join('~') === oldConsTime[0].timeInterval.join('~'));
      let consTime = [];
      peakTimes.forEach((timeInterval) => {
        tpl.forEach((tplTime) => {
          consTime.push({
            ...tplTime,
            timeInterval
          });
        });
      });
  
      return {
        consTime
      };
    };
  
    const transformConsDistance = () => {
      const oldConsEmptyByDistanceB = constraintTpl?.consEmptyByDistanceB || [];
      const tpl = oldConsEmptyByDistanceB?.filter((item) => item.timeInterval?.join('~') === oldConsEmptyByDistanceB[0].timeInterval?.join('~') && item.disInterval?.join('~') === oldConsEmptyByDistanceB[0].disInterval?.join('~'));
      let consEmptyByDistanceB = [];
      distances.forEach((distance, index) => {
        tpl.forEach((item) => {
          consEmptyByDistanceB.push({
            ...item,
            disInterval: index === 0 ? ['0', distance] : [String(distances[index - 1]), String(distance)]
          });
        });
      });
  
      return {
        consEmptyByDistanceB
      };
    };
  
    const transformConsTimeDistance = () => {
      const transformTimeDistance = ({ key }) => {
        let olds = constraintTpl[key] || [];
        let temp = [olds[0]];
        let newConsData = [];
        peakTimes.forEach((timeInterval) => {
          consDistances.forEach((distance, index) => {
            temp.forEach((tpl) => {
              newConsData.push({
                ...tpl,
                timeInterval,
                disInterval: index === 0 ? ['0', distance] : [String(consDistances[index - 1]), String(distance)]
              });
            });
          });
        });
  
        return newConsData;
      };
  
      return {
        consTimeDistanceTr: transformTimeDistance({ key: 'consTimeDistanceTr'}),
        consTimeDistancePriceC: transformTimeDistance({ key: 'consTimeDistancePriceC'}),
        consTimeDistancePriceB: transformTimeDistance({ key: 'consTimeDistancePriceB'}),
      };
    };
  
    console.log({ boundsContent: {
      ...boundsTpl,
      ...transformBasePriceWithoutPeakBounds(),
      ...transformSdBounds(),
      ...transformSegmentBounds(),
      ...transfromDistanceBounds()
    }});
  
    return {
      // bounds内容处理
      boundsContent: {
        ...boundsTpl,
        ...transformBasePriceWithoutPeakBounds(),
        ...transformSdBounds(),
        ...transformSegmentBounds(),
        ...transfromDistanceBounds()
      },
      // constriant内容处理
      constraintContent: {
        ...constraintTpl,
        ...transformConsTime(),
        ...transformConsDistance(),
        ...transformConsTimeDistance(),
  
      }
    };
  };
  
  // ---必要的逻辑处理
  
  const { boundsContent, constraintContent } = newLinkageConfig({ solveSettingValue, boundsTpl, constraintTpl, currentProduct: '快车', dPriceValue: plutusData.dpriceValve, pPriceValue: plutusData.ppriceValue });
  
  // 根据设置好的求解设置，bounds，约束，主键信息 整合处理后请求 创建接口即可
  
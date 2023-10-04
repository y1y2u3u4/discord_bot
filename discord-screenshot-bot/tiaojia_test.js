

const axios = require('axios');

async function fetchData() {
    try {
        // 将这个URL改为与您的Python代码中相同的URL
        const url = "http://10.83.129.15:8048/price_adjust/base_price/85311?app=PLUTUS";
        
        // 定义请求头，与您的Python代码相似
        const headers = {'content-type': "application/json;charset=UTF-8"};
        
        // 使用axios发起GET请求
        const response = await axios.get(url, { headers: headers });
        
        const plutusData = response.data;
        console.log(plutusData.ppriceValue);

    } catch (error) {
        if (error.response) {
            // 请求已经发出，但服务器响应的状态码不在2xx范围内
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // 请求已经发出，但没有收到响应
            console.error('Request:', error.request);
        } else {
            // 发送请求时出现错误
            console.error('Error Message:', error.message);
        }
        console.error('Error Config:', error.config);
    }
}

fetchData();






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
var plutusData="https://insight-test.intra.xiaojukeji.com/price_adjust/base_price/85311?app=PLUTUS"
var { bPrice, cPrice } = getBoundsAndSegmentNeedData({ pPriceValue: plutusData.ppriceValue, dPriceValue: plutusData.dpriceValve, isNeedSegment: false });
console.log('bPrice',bPrice);
console.log('cPrice',cPrice);
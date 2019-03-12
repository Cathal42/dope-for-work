<template>
  <div class="caculator">
    <div class="circle">
      <van-circle
        v-model="saved"
        :rate="currentRate"
        :speed="100"
        :text="currentPercent"
        color="#07c160"
        layer-color="#ebedf0"
        size="200px"
      />      
    </div>

    <van-cell-group>
      <van-cell title="Dope名称" :value="dopeName" size="large"/>
      <van-cell title="当前时间" :value="curTime | formatDate" size="large"/>
      <van-cell title="当前已挣" :value="savingsFormat" size="large"/>
    </van-cell-group>
  </div>
</template>

<script>
import { Circle, Cell, CellGroup } from 'vant';
import storeMode from '../../storeMode.js';
import { setInterval, clearInterval } from 'timers';
import store from 'store';

export default {
  name: 'Caculate',
  components: {
    [Circle.name]: Circle,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  mounted() {
    storeMode.showLeftArrow();

    let $params = this.$route.params;
    // 检查是否为空对象
    // Object.keys()方法返回由给定对象的自身可枚举属性组成的数组
    if(Object.keys($params).length) {
      this.uuid = $params.uuid ? $params.uuid : '';
      this.salary = $params.salary ? ($params.salary - 0) : 0;
      this.dopeName = $params.dopeName ? $params.dopeName : '';
      this.currentRate = $params.currentRate ? $params.currentRate : 0;
      this.saved = $params.saved ? $params.saved : 0;
      this.savings = this.saved;

      let date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth() + 1;
      let beginDate = new Date(y, m - 1, 1), // 本月首日
          endDate = new Date(y, m, 0); // 本月最后一日
      this.workDays = this.getWorkDays(beginDate, endDate) + 1;
      // 暂定每日工时为九小时，朝九晚六，包括午休
      this.incomeTenSec = this.salary / (this.workDays * 9 * 60 * 6);

      if($params.storeTime) {
        this.getSilentIncome(new Date($params.storeTime));        
      } else {
        this.getSilentIncome(new Date(y, m - 1, 1, 9));
      }
      this.earning();
      this.getCurTime();
    }
  },
  beforeDestroy() {
    // 退出前存储数据
    this.saveToStorage(this.savings, this.currentRate, this.curTime);
    clearInterval(this.earningTimer);
    clearInterval(this.curTimeTimer);
  },
  data() {
    return {
      dopeName: '',
      uuid: '',
      curTime: new Date(),
      saved: 0, // localStorage中存储的已挣
      savings: 0, // 计算中的本月已挣
      currentRate: 0, // 环形图的进度
      salary: 0, // 月薪
      incomeTenSec: 0,
      workDays: 0, // 本月工作日数
      earningTimer: null, // 定时器
      curTimeTimer: null
    };
  },
  computed: {
    currentPercent() {
      return this.currentRate + '%';
    },
    savingsFormat() {
      return '￥' + this.savings;
    }
  },
  methods: {
    // 定时计算
    earning() {
      var hour = this.curTime.getHours(),
          min = this.curTime.getMinutes();

      this.earningTimer = setInterval(() => {
        // 朝九晚六，午休记在内
        if((hour >=9 && hour < 18 || (hour == 18 && min <= 0) )) {
          // 更新视图
          this.savings = (this.savings - 0 + this.incomeTenSec).toFixed(8) - 0;
          this.currentRate = ((this.savings / this.salary) * 100).toFixed(2) - 0;
          // 存储
          this.saveToStorage(this.savings, this.currentRate, this.curTime);

          console.log('running');
        }
      }, 10000);
    },
    // 数据存储
    saveToStorage(savings, currentRate, curTime) {
      let dopeList = store.get('DopeForWork');
      dopeList.forEach(dope => {
        if(dope.uuid === this.uuid) {
          dope.saved = savings;
          dope.currentRate = currentRate;
          dope.storeTime = curTime;
        }
      });
      store.set('DopeForWork', dopeList);
    },
    // 展示当前时间
    getCurTime() {
      this.curTimeTimer = setInterval(() => {
        this.curTime = new Date();        
      }, 1000);
    },
    // 计算工作日长
    getWorkDays(beginDate, endDate) {
      // 日期差值天数
      let passDays = Math.floor((endDate - beginDate) / 86400000);
      //工时的余数
      let remainder = passDays % 7;
      //工时向下取整的除数
      let divisor = Math.floor(passDays / 7);
      let weekendDay = 2 * divisor;
      
      //当月第一天的星期，星期取值有（1,2,3,4,5,6,0）
      let nextDay = new Date(beginDate).getDay();
      //从起始日期的星期开始 遍历remainder天
      for(let tempDay = remainder + 1; tempDay >= 1; tempDay--) {
        nextDay++;
        // 周日变更为0
        if(nextDay == 7) {
          nextDay = 0;
        }
      
        // 周六日
        if(nextDay == 0 || nextDay == 6) {
          weekendDay++;
        }
      }
      // 本月工作日数 = 当月天数 - 周六日数目。
      return passDays - weekendDay;
    },
    // 获取从上次打开至本次的资金增长
    getSilentIncome(beginDate) {
      // debugger;
      let endDate = new Date(), // 此刻
          passWorkDays = this.getWorkDays(beginDate, endDate) - 1; // 从上次打开至本次经过的工作日数
      
      let silentIncome = this.incomeTenSec * passWorkDays * 6 * 60 * 9  ;

      // 当经过的工作日大于一天，或者之前到此刻不在同一天时，需要分别计算之前时刻至下班的工钱和今天上班至此刻的工钱

      if(passWorkDays > 0 || (beginDate.getDate() != endDate.getDate())) {
        // 之前下班时间的时间戳
        let preDate = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 18);
        // 之前时刻至下班经过的秒数
        let preSec;
        if(beginDate.getHours() < 9) {
          // 若之前时刻在九点前，那经过的秒数直接为九小时的秒数
          preSec = 9 * 60 * 60;
        } else {
          // 若之前时刻在18点前则计算经过的秒数，否则经过的秒数为0
          preSec = (preDate - beginDate > 0) ? Math.floor((preDate - beginDate) / 1000) : 0;
        }
        silentIncome += this.incomeTenSec * preSec / 10;
        
        // 今天上班时间的时间戳
        let curDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 9);
        // 上班至此刻经过的秒数
        let curSec;
        if(endDate.getHours() < 9) {
          // 若此刻在九点前，那经过的秒数为0
          curSec = 0;
        } else if(endDate.getHours() < 18) {
          // 若此刻在九点后，18点前，则计算经过秒数
          curSec = (endDate - curDate) / 1000;
        } else {
          // 若此刻在18点后，经过的秒数为九小时秒数
          curSec = 9 * 60 * 60;
        }
        silentIncome += this.incomeTenSec * curSec / 10;
      } else {
        // 否则，情况就是之前与此刻在同一天，此时只需计算两次时刻间的工钱
        let passSec;
        if(endDate.getHours() < 9) {
          // 若此刻还没到九点，则经过秒数为0
          passSec = 0;
        } else if(beginDate.getHours() > 18) {
          // 若之前就已经过了18点，则经过秒数为九小时秒数
          passSec = 9 * 60 * 60;
        } else {
          // 否则计算两个时刻的秒数差值
          if(beginDate.getHours() < 9) {
            // 若之前时间早于九点，将其置为九点
            beginDate = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate(), 9);
          }
          if(endDate.getHours() > 18) {
            // 若当前时间晚于18点，将其置为18点
            endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 18);
          }
          passSec = (endDate - beginDate) / 1000;
          silentIncome = this.incomeTenSec * passSec / 10;
        }
      }
      this.savings = ((this.savings - 0) + silentIncome).toFixed(8) - 0;
      this.currentRate = ((this.savings / this.salary) * 100).toFixed(2) - 0;
      // 存储
      this.saveToStorage(this.savings, this.currentRate, endDate);
    }
  }
};
</script>

<style lang="less">
.caculator {

  .circle {
    text-align: center;
  }

  .van-circle {
    margin: 20px 0;
  }
}
</style>

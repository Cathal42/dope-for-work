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
      this.salary = $params.salary ? ($params.salary - 0) : 0;
      this.dopeName = $params.dopeName ? $params.dopeName : 0;
      this.savings = $params.savings ? $params.savings : 0;

      this.workDays = this.getWorkDays();
      this.incomePerSec = this.salary / (this.workDays * 8 * 60 * 6);

      this.earning();
      this.getCurTime();
    }
  },
  beforeDestroy() {
    clearInterval(this.earningTimer);
    clearInterval(this.curTimeTimer);
  },
  data() {
    return {
      dopeName: '',
      curTime: new Date(),
      saved: 0,
      savings: 0, // 本月已挣
      currentRate: 0, // 环形图的进度
      salary: 0, // 月薪
      incomePerSec: 0,
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
    earning() {
      this.earningTimer = setInterval(() => {
        this.savings = (this.savings - 0 + this.incomePerSec).toFixed(8) - 0;
        this.currentRate = ((this.savings / this.salary) * 100).toFixed(2) - 0;
        console.log('running');
      }, 1000);
    },
    getCurTime() {
      this.curTimeTimer = setInterval(() => {
        this.curTime = new Date();        
      }, 1000);
    },
    getWorkDays() {
      //起始日期
      let date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth() + 1;
      // 当月天数
      let monthDays = (new Date(y, m, 0)).getDate();
      //工时的余数
      let remainder = monthDays % 7;
      //工时向下取整的除数
      let divisor = Math.floor(monthDays / 7);
      let weekendDay = 2 * divisor;
      
      //当月第一天的星期，星期取值有（1,2,3,4,5,6,0）
      let nextDay = (new Date(y, m - 1)).getDay();
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
      return monthDays - weekendDay;
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

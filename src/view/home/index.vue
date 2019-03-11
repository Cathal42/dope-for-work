<template>
  <div class="home">
    <template v-if="active">
      <fill-in></fill-in>
    </template>
    <template v-else>
      <my-caculate></my-caculate>
    </template>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">我的</van-tabbar-item>
      <van-tabbar-item icon="add-o">新增</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Icon } from 'vant';
import MyCaculate from '../caculate/myCaculate';
import FillIn from '../fillIn';
import storeMode from '../../storeMode.js';

export default {
  name: 'Home',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Icon.name]: Icon,
    FillIn,
    MyCaculate
  },
  mounted() {
    storeMode.showLeftArrow();    
  },
  data() {
    return {
      active: 0,
    };
  },
  methods: {

  }
};
</script>

<style lang="less">
.home {
  .main {
    color: #333;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    padding: 150px 0;
  }
}
</style>
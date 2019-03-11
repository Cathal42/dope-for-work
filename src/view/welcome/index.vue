<template>
  <div class="welcome">
    <div class="main">
      <h2>Welcome to
        <p><strong>Dope for Work</strong>!</p>
      </h2>
      <van-button type="primary" @click="enter">点击进入</van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import storeMode from '../../storeMode.js';

export default {
  name: 'Welcome',
  components: {
    [Button.name]: Button
  },
  mounted() {
    storeMode.hideLeftArrow();
  },
  data() {
    return {

    };
  },
  methods: {
    enter() {
      this.$router.push('home');
    }
  }
};
</script>

<style lang="less">
.welcome {

  .main {
    color: #333;
    font-size: 16px;
    font-weight: normal;
    text-align: center;
    padding: 150px 0;
  }

}
</style>

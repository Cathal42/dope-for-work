<template>
  <div id="app">
    <van-nav-bar
      title="Dope for Work"
      :left-arrow="hasLeftArrow.hasLeftArrow"
      @click-left="onClickLeft"
    />
    <router-view/>
  </div>
</template>

<script>
import { NavBar } from 'vant';
import storeMode from './storeMode.js';

export default {
  data() {
    return {
      hasLeftArrow: storeMode.state
    }
  },
  components: {
    [NavBar.name]: NavBar
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  },
  computed: {

  }
}
</script>

<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}
</style>

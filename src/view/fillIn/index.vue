<template>
  <div class="form">
    <van-cell-group class="user-group">
      <van-field
        v-model="dopeName"
        placeholder="请输入Dope名称"
        label="Dope名称"
        required
        clearable
      />
      <van-field
        v-model="salary"
        placeholder="请输入您当月的工资"
        label="当月工资"
        :error-message="errorMessage"
        @keyup="checkNum"
        required
        clearable
      />
    </van-cell-group>
    <van-button type="primary" size="small" @click="confirm" :disabled="isBtnDisabled">确定</van-button>
  </div>
</template>

<script>
import { Field, Button, CellGroup } from 'vant';
import storeMode from '../../storeMode.js';
import store from 'store';
import uuidv1 from 'uuid/v1';

export default {
  name: 'FillIn',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
  },
  mounted() {
    storeMode.showLeftArrow();
  },
  data() {
    return {
      dopeName: '',
      salary: '',
      errorMessage: ''
    }
  },
  methods: {
    checkNum() {
      if(!this.salary) {
        return false;
      }
      if(isNaN(this.salary) || this.salary <= 0) {
        this.errorMessage = '请输入大于0的数字';
        return false;
      }
      this.errorMessage = '';
      return true;
    },
    confirm() {
      let dope = {
        dopeName: this.dopeName,
        salary: this.salary,
        uuid: uuidv1()
      };
      // 通过localStorage实现长期存储
      let dopeList = store.get('DopeForWork') || [];
      dopeList.push(dope);
      store.set('DopeForWork', dopeList);
      // 跳转至计数页，并传递参数
      this.$router.push({
        name: 'caculate',
        params: dope
      });
    }
  },
  computed: {
    isBtnDisabled() {
      return (this.dopeName && !this.checkNum());
    }
  }
};
</script>

<style lang="less">
.form {

  .van-button {
    float: right;
    margin-top: 10px;
    margin-right: 10px;
  }

}
</style>

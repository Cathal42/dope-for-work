<template>
  <div class="root">
    <template v-if="dopeList && dopeList.length">
      <van-swipe-cell :right-width="65" :on-close="onClose" v-for="dope in dopeList" :key="dope.uuid">
        <input type="hidden" :data-uuid="dope.uuid">
        <van-cell-group>
            <van-cell :title="dope.dopeName" value="查看" is-link @click="check"/>
        </van-cell-group>
        <span slot="right">删除</span>
      </van-swipe-cell>               
    </template>

    <template v-else>
      <div class="nodata">暂无数据</div>
    </template>
  </div>
</template>

<script>
import { SwipeCell, CellGroup, Cell, Dialog } from 'vant';
import store from 'store';

export default {
  name: 'MyCaculate',
  components: {
    [SwipeCell.name]: SwipeCell,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Dialog.name]: Dialog
  },
  beforeMount() {
    this.dopeList = store.get('DopeForWork');
  },
  data() {
    return {
      dopeList: null
    }
  },
  methods: {
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        // case 'left':
        // case 'cell':
        // case 'outside':
        //   instance.close();
        //   break;
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            let uuid = instance.$el.children[0].children[0].dataset.uuid;
            // 根据uuid匹配要删除的项
            this.dopeList.forEach((dope, index) => {
              if(dope.uuid === uuid) {
                this.dopeList.splice(index, 1);
              }
            });
            // 由于调用.splice()方法触发Vue更新视图，故不需再调用SwipeCell实例的.close()方法
            // instance.close();

            // 更新localStorage
            store.set('DopeForWork', this.dopeList);
          }).catch(() => {});
        break;
      }
    },
    check(e) {
      let uuid = e.target.parentElement.parentElement.parentElement.children[0].dataset.uuid;
      this.dopeList.forEach((dope, index) => {
        if(dope.uuid === uuid) {
          this.$router.push({
            name: 'caculate',
            params: dope
          });          
        }
      });
    }
  }
}
</script>

<style lang="less">
  .root {
    .nodata {
      height: 100%;
      margin-top: 240px;
      text-align: center;
      font-size: 16px;
      color: #666;
    }
  }

  .van-swipe-cell {
    &__right {
      color: #fff;
      font-size: 15px;
      width: 65px;
      height: 44px;
      display: inline-block;
      text-align: center;
      line-height: 44px;
      background-color: #f44;
    }
  }
</style>


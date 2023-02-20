<template>
  <van-cell-group>
    <van-cell title="历史数据">
      <template #value v-if="isDeleteShow">
        <span @click="$emit('delAll', [])">全部删除</span>&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <template #right-icon v-else>
        <van-icon name="delete-o" @click="isDeleteShow = true" />
      </template>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistory"
      :key="index"
      :title="item"
      @click="$emit('search', item)"
    >
      <template #right-icon v-if="isDeleteShow" >
        <van-icon name="close" @click.stop="onDeleteHistory(index)" />
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from 'vue'

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
})

defineEmits(['search', 'delAll'])

const searchHistory = ref<any>([])
const isDeleteShow = ref(false)

const { history } = toRefs(props)

searchHistory.value = history.value

const onDeleteHistory = (index: number) => {
  console.log(index)
}

</script>

<style lang="less" scoped>
.van-cell-group {
  margin-top: 120px;
  .van-cell {
    align-items: center;
    /deep/ .van-cell__title {
      color: #777;
      font-size: 32px;
    }
    .van-icon-delete-o {
      font-size: 40px;
      color: #999;
    }
  }
}
</style>

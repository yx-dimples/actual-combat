<template>
  <van-cell-group>
    <van-cell
      icon="search"
      v-for="(item, index) in searchSuggestList"
      :key="index"
    >
      <template #title>
        <span v-html="hightlight(item)" />
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, toRefs } from 'vue'
import { getSuggestion } from '../../../api'
import { showFailToast } from 'vant'

export default defineComponent({
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  setup (props: any) {
    const searchSuggestList = ref<any>([])
    const { searchText } = toRefs(props)

    const loadSuggestion = async (newVal: string) => {
      try {
        const { data } = await getSuggestion({
          q: newVal
        })
        searchSuggestList.value = data.data.options
      } catch (err) {
        showFailToast('数据获取失败，请稍后重试')
      }
    }

    const hightlight = (suggestion: string) => {
      if (suggestion) {
        const reg = new RegExp(searchText.value, 'gi')
        return suggestion.replace(reg, `<span style='color: red'>${searchText.value}</span>`)
      } else {
        return false
      }
    }

    const antiShake = (val:string, time:number) => {
      return setTimeout(() => {
        loadSuggestion(val)
      }, time)
    }

    watchEffect((onInvalidate) => {
      const timer = antiShake(searchText.value, 200)
      onInvalidate(() => clearTimeout(timer))
    })

    return {
      searchSuggestList,
      hightlight
    }
  }
})
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

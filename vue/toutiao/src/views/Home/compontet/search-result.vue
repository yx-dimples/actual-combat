<template>
  <div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error="error"
      error-text="加载失败，请稍后重试"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { getSearch } from '../../../api'
import { showFailToast } from 'vant'

interface listItem {
  art_id: number
  aut_id: number
  aut_name: string
  ch_id: number
  collect_count: number
  comm_count: number
  cover: {
    images: any
    type: number
  }
  is_top: number
  like_count: number
  pubdate: string
  title: string
}

export default defineComponent({
  props: {
    searchText: {
      type: String
    }
  },
  setup (props: any) {
    const list = ref<listItem[]>([])
    const loading = ref(false)
    const finished = ref(false)
    const error = ref(false)
    const page = ref(1)
    const per_page = ref(10)
    const { searchText } = toRefs(props)

    const onLoad = async () => {
      try {
        const { data } = await getSearch({
          page: page.value,
          per_page: per_page.value,
          q: searchText.value
        })
        console.log(data.data.results)
        const results = data.data.results
        list.value.push(...results)
        loading.value = false
        if (results.length) {
          page.value++
        } else {
          finished.value = true
        }
      } catch (err) {
        error.value = true
        loading.value = false
        showFailToast('数据获取失败，请稍后重试')
      }
    }

    return {
      loading,
      list,
      finished,
      error,
      onLoad
    }
  }
})
</script>

<style lang="less" scoped>
.van-list {
  margin-top: 98px;
}
</style>

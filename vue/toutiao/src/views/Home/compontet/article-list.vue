<template>
  <div class="article-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from 'vue'
import { getArticles } from '../../../api'

const props: any = defineProps({
  channelId: {
    type: Number
  }
})

const refreshing = ref(false)
const finished = ref(false)
const loading = ref(false)
const list = ref<any>([])
const timestamp = ref<any>(0)

const { channelId } = toRefs(props)
const channel_id: number = channelId.value
console.log(channel_id)

const onLoad = async () => {
  try {
    const res = await getArticles({
      channel_id
      // page: 1
      // per_page: 1
    })
    console.log(res)
    // const { results, pre_timestamp } = data.data
    // list.value.push(...results)
    // loading.value = false
    // if (results.length) {
    //   timestamp.value = pre_timestamp
    // } else {
    //   finished.value = false
    // }
  } catch (error) {
  }
}

const onRefresh = () => {
  finished.value = false

  loading.value = true
}
onLoad()
</script>

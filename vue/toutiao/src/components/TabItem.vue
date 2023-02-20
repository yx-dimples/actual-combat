<template>
  <div class="tab-item">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { getChannelById } from '../api'

export default defineComponent({
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    console.log(props.channel)
    const result = ref([])
    const refreshing = ref(false)
    const loading = ref(false)
    const finished = ref(false)
    const time = ref(0)
    const onRefresh = () => {
      console.log('onRefresh')
    }

    const onLoad = () => {
      console.log('onLoad')
    }

    const getData = () => {
      const channel_id = props.channel.id
      const timestamp = time.value === 0 ? Date.now() : time
      console.log(typeof timestamp)
      getChannelById(
        channel_id
      ).then(res => {
        console.log(res.data.data)
        // result.value = res.data.data.results
        // time.value = res.data.data.pre_timestamp || 0
        // console.log(time)
      })
    }

    getData()

    return {
      result,
      refreshing,
      loading,
      finished,
      onRefresh,
      onLoad
    }
  }
})
</script>

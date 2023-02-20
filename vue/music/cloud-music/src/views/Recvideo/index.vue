<template>
  <div>
    <Tabs
      v-model="activeTab"
      align="center"
      :tabs="tabs"
    />
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Tabs from '../../components/Tabs.vue'

export default {
  data () {
    this.tabs = [
      { title: 'MV', to: '/recvideo/mv' },
      { title: '视频', to: '/recvideo/video' }
    ]
    this.LIST_TAB = 0
    return {
      activeTab: this.LIST_TAB
    }
  },
  components: { Tabs }
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
}
</style>

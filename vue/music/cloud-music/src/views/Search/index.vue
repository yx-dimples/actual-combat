<template>
  <div class="search-detail">
    <div class="header" ref="header">
      <p class="keywords">{{keywords}}</p>
      <p class="count">找到{{count}}个结果</p>
    </div>
    <div class="tabs-wrap">
      <TabsVue :tabs="tabs" itemClass="search-tab-item" />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TabsVue from '../../components/Tabs.vue'

export default {
  provide () {
    return {
      searchRoot: this
    }
  },
  data () {
    this.tabs = [
      {
        title: '歌曲',
        key: 'music',
        to: 'music'
      },
      {
        title: '歌单',
        key: 'playlist',
        to: 'playlist'
      },
      {
        title: 'MV',
        key: 'mvs',
        to: 'mvs'
      }
    ]
    return {
      keywords: this.$route.params.keywords,
      count: 0
    }
  },
  created () {
    console.log(this.$route.params)
  },
  methods: {
    onUpdateCount (count) {
      this.count = count
    }
  },
  components: { TabsVue }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';
.search-detail {
  .header {
    padding: 20px 32px;
    display: flex;
    align-items: flex-end;
    .keywords {
      display: inline-block;
      margin-right: 4px;
      font-size: $font-size-title-lg;
      font-weight: $font-weight-bold;
    }
    .count {
      font-size: $font-size-sm;
      color: var(--font-color-grey-shallow);
      letter-spacing: 2px;
      margin-left: 10px;
    }
  }
  .tabs-wrap {
    padding: 0 28px;
    border-bottom: 1px solid var(--border);
    /deep/.search-tab-item {
      font-size: $font-size;
    }
  }
}
</style>

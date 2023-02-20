<template>
  <div class="home">
    <van-nav-bar class="nav-bar-search">
      <template #title>
        <van-button
          round
          size="small"
          class="search-button"
          icon="search"
          to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>

    <van-tabs
      class="channel-tabs"
      v-model="active"
      border
      color="#3296fa"
      line-width="15px"
      @change="changeTabItem"
    >
      <van-tab
        v-for="(item) in channels"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      >
        <articleList :channelId="item.id" />
      </van-tab>
      <template #nav-right>
        <div class="wap-nav-wrap" @click="isChannelEditShow = true">
          <van-icon name="wap-nav" size="33" />
        </div>
        <div class="wap-nav-set"
        @click="isChannelEditShow = true" />
      </template>
      <van-popup
        v-model:show="isChannelEditShow"
        position="bottom"
        closeable
        close-icon-position="top-left"
        :style="{ height: '100%' }"
      >
        <channel-edit
          :channels="channels"
          :activeIndex="active"
          @close="isChannelEditShow = false"
          @update-active="changeTabItem"
        />
      </van-popup>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUserChannels } from '../../api'
import channelEdit from './compontet/channel-edit.vue'
import articleList from './compontet/article-list.vue'

interface ChannelsItem {
  id: number
  name: string
}

const active = ref(0)
const channels = ref<ChannelsItem[]>([])

const isChannelEditShow = ref(false)

const getData = () => {
  getUserChannels().then(res => {
    channels.value = res.data.data.channels
  })
}
getData()

const changeTabItem = (name: number) => {
  active.value = name
}
</script>

<style lang="less" scoped>
.home {
  .channel-popup-edit {
    height: 100%;
  }
  .van-nav-bar {
    --van-nav-bar-background: #3296fa;
  }
  .nav-bar-search {
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-button {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      color: #fff;
      /deep/ .van-button__text {
        font-size: 28px;
      }
      /deep/ .van-icon {
        font-size: 32px;
        color: white;
      }
    }
  }
  .channel-tabs {
    .wap-nav-set {
      flex-shrink: 0;
      //不参与平分 只参与固定。
      width: 80px;
    }
    /deep/ .van-tabs__nav {
      padding: 0;
    }
    /deep/ .van-tab {
      border-right: 1px rgb(231, 231, 231) solid;
      border-bottom: 1px rgb(223, 221, 221) solid;
      width: 200px;
    }
    .wap-nav-wrap {
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 44px;
      right: 0px;
      width: 80px;
      height: 84px;
      font-size: 20px;
      background-color: rgba(255, 255, 255, 0.8);
    }
    /deep/ .van-tabs__line {
      bottom: 6px;
      width: 30px;
      height: 10px;
    }
  }
}
</style>

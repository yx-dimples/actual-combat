<template>
  <div>
    <router-view />
    <van-tabbar
      active-color="#3296fa"
      inactive-color="#666"
      v-model="active"
      route
      @change="onChange"
    >
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
const onChange = (index: number) => {
  active.value = index
}
</script>

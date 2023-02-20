<template>
  <div class="video-player" ref="player"></div>
</template>

<script>
import Player from 'xgplayer'

export default {
  props: ['url', 'cover'],
  mounted () {
    this.initPlayer()
  },
  methods: {
    initPlayer () {
      if (!this.url) return false
      this.player = new Player({
        el: this.$refs.player, // 播放器容器
        url: this.url, // 视频源
        poster: this.cover, // 封面图
        videoInit: true, // 初始化显示视频首帧
        lang: 'zh-cn', // 国际化
        width: '100%' // 尺寸
      })
    }
  },
  watch: {
    url (url, oldUrl) {
      if (url && url !== oldUrl) {
        if (!this.player) {
          this.initPlayer()
        } else {
          console.log(2)
        }
      }
    }
  },
  created () {
    console.log(this.cover)
  }
}
</script>

<style>
  .xgplayer-error {
    display: none;
  }
  </style>

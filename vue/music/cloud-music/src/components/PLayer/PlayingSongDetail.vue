<template>
  <div v-if="Object.keys(nowSongDetail).length !== 0">
    <div
      :class="getPlayerShowCls()"
      class="player"
    >
      <div class="content">
        <div class="song">
          <div class="left">
            <img
              class="play-bar-support"
              src="../../assets/play-bar-support.png"
            />
            <img
              :class="{isPlaying}"
              class="play-bar"
              src="../../assets/play-bar.png"
            />
            <div
              class="img-outer-border"
              ref="disc"
            >
              <div
                :class="{paused: !isPlaying}"
                class="img-outer"
                ref="discRotate"
              >
                <div class="img-wrap">
                  <img :src="nowSongDetail.al.picUrl" />
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="name-wrap">
              <p class="name">{{nowSongDetail.name}}</p>
            </div>
            <div class="desc">
              <div class="desc-item">
                <span class="label">歌手：</span>
                <div class="value" @click="goArtist(nowSongDetail.ar[0])">{{nowSongDetail.ar[0].name}}</div>
              </div>
            </div>
            <div v-if="nolyric">还没有歌词哦~</div>
            <Scroller
              :data="lyric"
              :options="{disableTouch: true}"
              @init="onInitScroller"
              class="lyric-wrap"
              ref="scroller"
              v-else
            >
              <ul>
                <li
                  :class="getActiveCls(index)"
                  :key="index"
                  class="lyric-item"
                  ref="lyric"
                  @click="lyricClick(l, index)"
                  v-for="(l,index) in lyricWithTranslation"
                  @mouseover="showTime(index)"
                  @mouseleave="isActive = false"
                >
                <span class="playIcon" v-show="isActive && currentIndex == index">
                  <i class="el-icon-caret-right"></i>
                </span>
                  <span
                    :key="contentIndex"
                    class="lyric-text"
                    v-for="(content, contentIndex) in l.contents"
                  >{{content}}</span>
                  <span class="lyric-time" v-show="isActive && currentIndex === index">{{formatDuration(l.time)}}</span>
                </li>
              </ul>
            </Scroller>
          </div>
        </div>
      </div>
      <div>
        <Comment :id="nowSongDetail.id" type="music" />
      </div>
    </div>
  </div>
</template>

<script>
import { getLyric } from '../../api/song'
import { isDef, lyricParser, formatDuration } from '../../utils'
import { debounce } from 'lodash-es'
import { mapActions, mapGetters } from 'vuex'
import Scroller from '../Scroller.vue'
import Comment from '../Comment.vue'

const WHEEL_TYPE = 'wheel'
const SCROLL_TYPE = 'scroll'
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 1000

export default {
  created () {
    this.lyricScrolling = {
      [WHEEL_TYPE]: false,
      [SCROLL_TYPE]: false
    }
    this.lyricTimer = {
      [WHEEL_TYPE]: null,
      [SCROLL_TYPE]: null
    }
    if (Object.keys(this.nowSongDetail).length !== 0) {
      this.updateSong()
    }
  },
  data () {
    return {
      lyric: [],
      tlyric: [],
      nolyric: false,
      formatDuration,
      currentIndex: null,
      isActive: false
    }
  },
  methods: {
    updateSong () {
      this.getNowLyricBy()
    },
    async getNowLyricBy () {
      const { data } = await getLyric(this.nowSongDetail.id)
      this.nolyric = !isDef(data.lrc) || !data.lrc.lyric
      if (!this.nolyric) {
        const { lyric, tlyric } = lyricParser(data)
        this.lyric = lyric
        this.tlyric = tlyric
      }
    },
    getPlayerShowCls () {
      return this.isPlayerShow ? 'show' : 'hide'
    },
    getActiveCls (index) {
      return this.activeLyricIndex === index ? 'active' : ''
    },
    getDiscRotateCls () {
      return this.isPlaying ? 'rotate' : 'pause'
    },
    onInitScroller (scoller) {
      const onScrollStart = type => {
        this.clearTimer(type)
        this.lyricScrolling[type] = true
      }
      const onScrollEnd = type => {
        // 滚动结束后两秒 歌词开始自动滚动
        this.clearTimer(type)
        this.lyricTimer[type] = setTimeout(() => {
          this.lyricScrolling[type] = false
        }, AUTO_SCROLL_RECOVER_TIME)
      }
      scoller.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE))
      scoller.on('mousewheelStart', onScrollStart.bind(null, WHEEL_TYPE))
      scoller.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE))
      scoller.on('mousewheelEnd', onScrollEnd.bind(null, WHEEL_TYPE))
    },
    scrollToActiveLyric () {
      if (this.activeLyricIndex !== -1) {
        const { scroller, lyric } = this.$refs
        if (lyric && lyric[this.activeLyricIndex]) {
          scroller
            .getScroller()
            .scrollToElement(lyric[this.activeLyricIndex], 200, 0, true)
        }
      }
    },
    clearTimer (type) {
      this.lyricTimer[type] && clearTimeout(this.lyricTimer[type])
    },
    resizeScroller: debounce(function () {
      this.$refs.scroller.getScroller().refresh()
    }, 500),
    addResizeListener () {
      window.addEventListener('resize', this.resizeScroller)
    },
    removeResizeListener () {
      window.removeEventListener('resize', this.resizeScroller)
    },
    lyricClick (item, index) {
      console.log(item)
      const audio = document.querySelector('#audio')
      console.log()
      audio.currentTime = item.time
      this.isActive = false
    },
    showTime (index) {
      this.currentIndex = index
      this.isActive = true
    },
    goArtist (artist) {
      console.log(artist)
      this.$router.push(`/artist/${artist.id}`)
    },
    ...mapActions('common', ['SET_PLAYER_SHOW'])
  },
  computed: {
    activeLyricIndex () {
      return this.lyricWithTranslation
        ? this.lyricWithTranslation.findIndex((l, index) => {
          const nextLyric = this.lyricWithTranslation[index + 1]
          return (
            this.currentSecond >= l.time &&
              (nextLyric ? this.currentSecond < nextLyric.time : true)
          )
        })
        : -1
    },
    lyricWithTranslation () {
      let ret = []
      // 空内容的去除
      const lyricFiltered = this.lyric.filter(({ content }) => Boolean(content))
      // content统一转换数组形式
      if (lyricFiltered.length) {
        lyricFiltered.forEach(l => {
          const { time, content } = l
          const lyricItem = { time, content, contents: [content] }
          const sameTimeTLyric = this.tlyric.find(
            ({ time: tLyricTime }) => tLyricTime === time
          )
          if (sameTimeTLyric) {
            const { content: tLyricContent } = sameTimeTLyric
            if (content) {
              lyricItem.contents.push(tLyricContent)
            }
          }
          ret.push(lyricItem)
        })
      } else {
        ret = lyricFiltered.map(({ time, content }) => ({
          time,
          content,
          contents: [content]
        }))
      }
      return ret
    },
    ...mapGetters(['nowSongDetail', 'isPlaying', 'isPlayerShow', 'currentSecond'])
  },
  watch: {
    isPlayerShow (show) {
      if (show) {
        this.addResizeListener()
        this.$nextTick(() => {
          this.scrollToActiveLyric()
        })
      } else {
        this.removeResizeListener()
      }
    },
    nowSongDetail (newSong, oldSong) {
      if (!newSong.id) {
        this.SET_PLAYER_SHOW(false)
        return false
      }
      if (newSong.id === oldSong.id) {
        return false
      }
      if (this.isPlayerShow) {
        this.updateSong()
      } else {
        this.getNowLyricBy()
      }
    },
    activeLyricIndex (newIndex, oldIndex) {
      if (
        newIndex !== oldIndex &&
        !this.lyricScrolling[WHEEL_TYPE] &&
        !this.lyricScrolling[SCROLL_TYPE]
      ) {
        this.scrollToActiveLyric()
      }
    },
    $route () {
      this.SET_PLAYER_SHOW(false)
    }
  },
  components: { Scroller, Comment }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(1turn);
  }
}
$img-left-padding: 36px;
$img-outer-border-d: 320px;
$img-outer-d: 300px;
.player {
  position: fixed;
  top: $header-height;
  bottom: $mini-player-height;
  left: 0;
  right: 0;
  padding: 0 36px;
  background: var(--player-bgcolor);
  z-index: $song-detail-z-index;
  overflow: hidden;
  overflow-y: auto;
  transition: transform 0.5s;
  &.hide {
    transform: translateY(105%);
  }
  &.show {
    transform: none;
  }
  .content {
    max-width: 870px;
    margin: auto;
    .song {
      display: flex;
      .left {
        position: relative;
        padding: 80px 70px 0 $img-left-padding;
        display: flex;
        justify-content: center;
        $support-d: 30px;
        $support-d-half: $support-d / 2;
        .play-bar-support {
          position: absolute;
          left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
          top: -$support-d-half;
          width: $support-d;
          height: $support-d;
          z-index: 2;
        }
        .play-bar {
          $w: 100px;
          $h: 146px;
          position: absolute;
          top: 0;
          left: $img-left-padding + $img-outer-border-d / 2 - 6px;
          width: $w;
          height: $h;
          z-index: 1;
          transform-origin: 0 0;
          transform: rotate(-30deg);
          transition: all 0.3s;
          &.isPlaying {
            transform: rotate(5deg);
          }
        }
        .img-outer-border {
          width: $img-outer-border-d;
          height: $img-outer-border-d;
          border: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--song-shallow-grey-bg);
          .img-outer {
            width: $img-outer-d;
            height: $img-outer-d;
            border: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $black;
            background: linear-gradient(-45deg, #333540, #070708, #333540);
            animation: rotate 20s linear infinite;
            &.paused {
              animation-play-state: paused;
            }
            .img-wrap {
              width: 200px;
              height: 200px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
        }
      }
      .right {
        flex: 1;
        padding-top: 45px;
        .name-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          .name {
            font-size: $font-size-title-lg;
            color: var(--font-color-white);
          }
        }
        .desc {
          display: flex;
          font-size: $font-size-sm;
          margin-bottom: 30px;
          .desc-item {
            display: flex;
            margin-right: 32px;
            .label {
              display: inline-block;
              margin-right: 4px;
            }
            .value {
              color: $blue;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .lyric-wrap {
          width: 380px;
          height: 350px;
          mask-image: linear-gradient(
            180deg,
            hsla(0, 0%, 100%, 0) 0,
            hsla(0, 0%, 100%, 0.6) 15%,
            #fff 25%,
            #fff 75%,
            hsla(0, 0%, 100%, 0.6) 85%,
            hsla(0, 0%, 100%, 0)
          );
            .lyric-item {
              display: flex;
              font-size: $font-size-sm;
              margin-bottom: 16px;
              text-align: center;
              &:hover {
                cursor: pointer;
              }
              &.active {
                font-size: $font-size;
                color: var(--font-color-white);
                font-weight: $font-weight-bold;
              }
              .lyric-text {
                margin-bottom: 8px;
                margin-left: 10px;
                flex: 1;
              }
              .lyric-time {
                display: inline-block;
                margin-left: 10px;
              }
            }
        }
      }
    }
  }
}
</style>

<template>
  <div class="player" id="player">
    <!-- 音频标签 -->
    <audio
      id="audio"
      autoplay
      :src="songUrl"
      ref="audio"
      @play="changeState(true)"
      @pause="changeState(false)"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="onTimeupdate"
      @ended="playMode == 'one' ? loopPlay() : toggleSong(1)"
    />
    <!-- 控制台 -->
    <div class="controls">
      <a href="javascript:;" @click="toggleSong(0)">
        <svg-icon icon-class="prev" size="40"  />
      </a>
      <a href="javascript:;" @click="play" v-if="!isPlaying">
          <svg-icon icon-class="play" size="40"  />
      </a>
      <a href="javascript:;" @click="pause" v-else>
          <svg-icon icon-class="pause" size="40"  />
      </a>
      <a href="javascript:;" @click="toggleSong(0)">
        <svg-icon icon-class="next" size="40"  />
      </a>
    </div>
    <!-- 歌曲内容 -->
    <div class="song">
      <template v-if="Object.keys(nowSongDetail).length === 0" >
        <div class="img-wrap">
          <img :src="imgInfo.imgUrl" />
        </div>
      </template>
      <template v-else >
        <div class="img-wrap" @click="togglePlayerShow">
        <div class="mask" />
          <img :src="nowSongDetail.al.picUrl" />
          <div class="icons">
            <i :class="playControlIcon" />
          </div>
      </div>
      </template>
      <div class="content">
        <div class="top" v-if="Object.keys(nowSongDetail).length !== 0">
          <p class="name">{{nowSongDetail.name}}</p>
          <p class="artists"  @click="goArtist">{{nowSongDetail.ar[0].name}}</p>
        </div>
        <!-- 进度条 -->
        <div class="time-progress">
          <span class="played-time">{{currentTime}}</span>
          <span class="progress">
            <Progress
              v-model="curren"
              @onChange="changeSongProgress"
              :is-format-tooltip="true"
              :format-tooltip="formatTooltip"
              :showRadiusBtn="false"
              :disabled="playingList.length == 0"
            />
          </span>
          <span class="total-time">{{totalTime}}</span>
        </div>
      </div>
    </div>
    <!-- 模式 -->
    <div class="mode">
      <!-- 单击 随机 顺序 -->
      <el-popover placement="top" trigger="hover" width="100">
        <p style="text-align: center;">{{playModeText}}</p>
        <a href="javaScript:;" slot="reference" @click="onChangePlayMode">
          <svg-icon :icon-class="modeIcon" size="28" />
        </a>
      </el-popover>
      <!-- 音量 -->
      <div class="volume">
        <a href="javascript:;" @click="cancelMute" v-if="volume === 0" >
          <svg-icon icon-class="mute" size="30" />
        </a>
        <a href="javascript:;" @click="cancelVolume" v-else>
          <svg-icon icon-class="volume" size="30" />
        </a>
        <div class="volume-slider">
          <Progress
            v-model="volume"
            @onChange="changeVolumeProgress"
            :show-radius-btn="false"
            :is-active-bar="false"
          />
        </div>
      </div>
      <!-- 列表 -->
      <div class="curren-list" @click="togglePlaylistShow">
        <svg-icon icon-class="playlist" size="25" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import imgUrl from '../../assets/default_album.jpg'
import { playModeMap, getLocal, formatDuration, setLocal, getRandom } from '../../utils'
import Progress from '../Progress.vue'
import { checkMusic, getSongUrl } from '../../api/song'

export default {
  data () {
    return {
      imgInfo: {
        imgUrl
      },
      curren: getLocal('curren') ? getLocal('curren') : 0, // 进度条的百分比
      currentTime: getLocal('currentTime') ? getLocal('currentTime') : '00:00',
      totalTime: getLocal('totalTime') ? getLocal('totalTime') : '00:00',
      volume: getLocal('volume') ? getLocal('volume') : 50, // 音量
      saveVolume: 50, // 静音前保存的音量
      totalSecond: 0, // 歌曲总秒数
      nowVolume: 50 // 静音前的音量
    }
  },
  methods: {
    changeState (isplay) {
      this.CHANGE_PLAY_STATE(isplay)
      console.log(isplay, 'isplay')
    },
    // 音频数据加载完后的事件
    onLoadedmetadata (res) {
      this.totalSecond = res.target.duration
      this.totalTime = formatDuration(this.totalSecond)
      setLocal('totalTime', this.totalTime)
      setLocal('totalSecond', this.totalSecond)
    },
    onTimeupdate (res) {
      // console.log(res)
      this.SAVE_CURRENT_SECOND(res.target.currentTime)
      this.currentTime = formatDuration(res.target.currentTime)
      setLocal('currentTime', this.currentTime)

      const curren = Math.ceil((res.target.currentTime / this.totalSecond) * 100)
      if (curren !== Infinity && !isNaN(curren)) {
        setLocal('curren', curren)
        this.curren = getLocal('curren')
      }
    },
    // 获取歌曲url
    async getSongUrlBy (song) {
      // 检查歌曲是否可用
      await checkMusic(song.id).then(async () => {
        // 获取歌曲url
        await getSongUrl(song.id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
          this.SAVE_SONG_DETAIL(song)
        })
      }).catch(() => {
        // 删除播放列表不能播放的当前歌曲
        this.DELETE_SONG(song.id)
        this.orderPlay(1)
      })
    },
    // 切歌
    toggleSong (type) {
      // 判断播放列表不为空和只有一首歌时
      if (this.playingList.length === 0) {
        this.$message({
          message: '播放列表为空',
          type: 'warning',
          center: true
        })
      } else if (this.playingList.length === 1) {
        this.$message({
          message: '当前播放列表只有一首歌',
          type: 'warning',
          center: true
        })
        this.play()
      } else {
        // 再根据播放模式判断
        // console.log(this.playMode)
        if (this.playMode === 'loop' || this.playMode === 'one') {
          this.orderPlay(type)
        } else if (this.playMode === 'shuffle') {
          this.randomPlay()
        }
      }
    },
    // 播放音乐
    play () {
      if (this.playingList.length === 0) {
        this.$message({
          message: '播放列表为空',
          type: 'warning',
          center: true
        })
      } else {
        this.$refs.audio.currentTime = this.currentSecond
        if (this.songUrl !== '') {
          this.$refs.audio.pay()
        } else {
          getSongUrl(this.nowSongDetail.id).then(res => {
            this.SAVE_SONG_URL(res.data.data[0].url)
          })
        }
      }
    },
    // 暂停音乐
    pause () {
      this.$refs.audio.pause()
    },
    // 打开歌词
    togglePlayerShow () {
      if (Object.keys(this.nowSongDetail).length !== 0) {
      }
      this.SET_PLAYER_SHOW(!this.isPlayerShow)
    },
    // 拖动时间进度条，改变当前时间，len是进度条改变时的回调函数的参数在0-100之间，需要换算成实际时间拖动进度条，
    changeSongProgress (len) {
      const currentSecond = Math.ceil((len / 100) * this.totalSecond)
      this.$refs.audio.currentTime = currentSecond
    },
    // 进度条拖动时，显示当前值,格式化formatTooltip
    formatTooltip (val) {
      return formatDuration((val / 100) * this.totalSecond)
    },
    // 改变播放模式
    onChangePlayMode () {
      const modeKeys = Object.keys(playModeMap)
      const currentModeIndex = modeKeys.findIndex(
        key => playModeMap[key].code === this.playMode
      )
      // console.log(currentModeIndex)
      const nextIndex = (currentModeIndex + 1) % modeKeys.length
      const nextModeKey = modeKeys[nextIndex]
      const nextMode = playModeMap[nextModeKey]
      // console.log(nextMode)
      this.SET_PLAY_MODE(nextMode.code)
    },
    // 1 顺序模式
    orderPlay (type) {
      // 找到当前歌曲在播放列表的索引
      const nowIndex = this.playingList.findIndex(item => {
        return this.nowSongDetail.id === item.id
        // type等于0 是上一曲 否则下一曲
        // 根据当前歌曲索引来判断要切换的歌曲索引
      })
      let toggleIndex
      switch (nowIndex) {
        case -1:
          toggleIndex = 0
          break
        case 0:
          toggleIndex = type === 0 ? this.playingList.length - 1 : nowIndex + 1
          break
        case this.playingList.length - 1:
          toggleIndex = type === 0 ? nowIndex - 1 : 0
          break
        default:
          toggleIndex = type === 0 ? nowIndex - 1 : nowIndex + 1
          break
      }
      // console.log(toggleIndex, '2')
      const togglesong = this.playingList[toggleIndex]
      // console.log(togglesong)
      this.getSongUrlBy(togglesong)
    },
    // 2 随机模式
    randomPlay () {
      const randomIndex = getRandom(0, this.playingList.length - 1)
      const randomSong = this.playingList[randomIndex]
      this.getSongUrlBy(randomSong)
    },
    // 单曲循环
    loopPlay () {
      this.$refs.audio.loop = true
      this.$refs.audio.play()
    },
    // 取消静音
    cancelMute () {
      this.volume = this.nowVolume
      this.$refs.audio.volume = this.volume / 100
    },
    // 静音
    cancelVolume () {
      this.nowVolume = this.volume
      this.volume = 0
      this.$refs.audio.volume = 0
    },
    // 拖动音量进度条
    changeVolumeProgress (len) {
      setLocal('volume', len)
      this.$refs.audio.volume = len / 100
    },
    togglePlaylistShow () {
      console.log(this.isPlaylistShow)
      this.SET_PLAYLIST_SHOW(!this.isPlaylistShow)
    },
    goArtist () {
      console.log(this.nowSongDetail.ar[0].id)
      this.$router.push(`/artist/${this.nowSongDetail.ar[0].id}`)
    },
    ...mapActions('common', ['CHANGE_PLAY_STATE', 'SET_PLAY_MODE', 'SAVE_SONG_URL', 'SET_PLAYLIST_SHOW', 'SET_PLAYER_SHOW']),
    ...mapActions('music', ['SAVE_CURRENT_SECOND', 'SAVE_SONG_DETAIL', 'DELETE_SONG'])
  },
  computed: {
    currentMode () {
      return playModeMap[this.playMode]
    },
    playModeText () {
      return this.currentMode.name
    },
    modeIcon () {
      return this.currentMode.icon
    },
    playControlIcon () {
      return this.isPlayerShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
    },
    ...mapGetters([
      'songUrl',
      'playingList',
      'isPlaying',
      'playMode',
      'nowSongDetail',
      'currentSecond',
      'isPlaylistShow',
      'isPlayerShow'
    ])
  },
  watch: {
  },
  mounted () {
    this.$refs.audio.volume = this.volume / 100
    this.pause()
  },
  components: { Progress }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';
.player {
  position: fixed;
  z-index: $mini-player-z-index;
  bottom: 0;
  left: 0;
  right: 0;
  height: $mini-player-height;
  display: flex;
  background-color: var(--body-bgcolor);
  align-items: center;
  justify-content: center;
  .controls {
    display: flex;
    a {
      color: #000;
    }
  }
  .song {
    display: flex;
    align-items: center;
    margin: 0 50px;
    .img-wrap {
      width: 40px;
      height: 40px;
      position: relative;
      flex-shrink: 0;
      cursor: pointer;
      overflow: hidden;
      .mask {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
      .icons {
        cursor: pointer;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        i {
          color: #fff;
          font-weight: 600;
          font-size: 22px;
        }
      }
    }
    .content {
      margin-left: 10px;
      .top {
        display: flex;
        align-items: center;
        .name {
          font-size: 14px;
          color: var(--font-color-white);
        }
        .artists {
          font-size: 12px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .time-progress {
        display: flex;
        align-items: center;
        width: 466px;
        .played-time {
          padding-right: 20px;
        }
        .progress {
          width: 100%;
        }
        .total-time {
          padding-left: 14px;
        }
      }
      .played-time, .total-time {
        font-size: 12px;
      }
      .time-slider {
        width: 400px;
        margin: 0 12px;
      }
    }
  }
  .mode {
    display: flex;
    align-items: center;
    a {
      margin-right: 10px;
      width: 22px;
    }
    .volume {
      display: flex;
      align-items: center;
      width: 150px;
      .volume-slider {
        width: 122px;
        margin: 0 20px 0 10px;
      }
    }
  }
  .svg-icon {
    color: var(--font-color);
  }
}
</style>

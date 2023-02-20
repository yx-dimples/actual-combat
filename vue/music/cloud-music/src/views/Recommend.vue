<template>
  <div class="recommend">
    <div class="now-date">
      <div class="left-date">
        <p class="day">{{getNowDay}}</p>
        <p class="date">{{getNowDate}}</p>
      </div>
      <div class="right-text">
        <p class="top">每日歌曲推荐</p>
        <p class="bottom">根据你的音乐口味生成，每天6:00更新</p>
      </div>
    </div>
    <div class="btns">
      <el-button size="small" class="play" @click="playAll">
        <svg-icon icon-class="play" />
        播放全部
      </el-button>
      <el-button
        class="subscribed"
        size="small"
        icon="el-icon-folder-add"
      >
        收藏
      </el-button>
    </div>
    <div class="music-list">
      <Table ref="musicList" :list="dailySongs" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getRecommend, checkMusic, getSongUrl } from '../api/song'
import Table from '../components/Table.vue'

export default {
  data () {
    return {
      dailySongs: []
    }
  },
  methods: {
    async getRecommend () {
      const { data } = await getRecommend()
      this.dailySongs = data.data.dailySongs
    },
    async playAll () {
      this.Add_ALL_SONG(this.dailySongs)
      await checkMusic(this.dailySongs[0].id).then(async () => {
        await getSongUrl(this.dailySongs[0].id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        this.CHANGE_PLAY_STATE(true)
        this.SAVE_SONG_DETAIL(this.dailySongs[0])
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    ...mapActions('music', ['Add_ALL_SONG', 'SAVE_SONG_DETAIL']),
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE'])
  },
  created () {
    this.getRecommend()
  },
  computed: {
    getNowDay () {
      const date = new Date()
      const day = date.getDay()
      const arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return arr[day]
    },
    getNowDate () {
      const date = new Date()
      return date.getDate()
    }
  },
  components: {
    Table
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables.scss';
.recommend {
  .now-date {
    display: flex;
    // align-items: center;
    .left-date {
      width: 100px;
      height: 100px;
      border: 1px solid var(--border);
      text-align: center;
      .day {
        font-size: 16px;
        padding: 8px 0 3px 0;
      }
      .date {
        font-size: 52px;
        color: $theme-color;
      }
    }
    .right-text {
      margin-left: 20px;
      .top {
        font-size: 19px;
        font-weight: bold;
        line-height: 3;
      }
      .bottom {
        color: var(--font-color-grey);
      }
    }
  }
  .btns {
    margin-top: 20px;
    .el-button {
      border-radius: 20px;
    }
    .play {
      border: none;
      color: #fff;
      background-color: $theme-color;
    }
    .subscribed {
      color: var(--font-color);
      background: none;
      border: 1px solid var(--border);
    }
  }
  .music-list {
    margin-top: 30px;
  }
}
</style>

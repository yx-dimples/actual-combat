<template>
  <el-container>
    <el-main>
      <div class="detail">
        <div class="img-wrap">
          <img :src="playlist.coverImgUrl" />
        </div>
        <div class="content">
          <div class="content-title">
            <el-tag size="small">歌单</el-tag>
            <p>{{playlist.name}}</p>
          </div>
          <div class="author">
            <img :src="creator.avatarUrl" alt="">
            <p class="nickname">{{creator.nickname}}</p>
            <p>{{formatDate(playlist.createTime, 'yyyy-MM-dd')}}</p>
          </div>
          <div class="btns">
            <el-button size="mini" class="play" @click="playAll">
              <svg-icon icon-class="play" />
              播放
            </el-button>
            <el-button
              plain
              size="mini"
              :icon="isSub ? 'el-icon-folder-checked' : 'el-icon-folder-add'"
              @click="subSongList"
              :type="isSub ? 'primary' : 'default'"
            >
              ({{formatNumber(playlist.subscribedCount)}})
            </el-button>
            <el-button size="mini" class="btn">
              <svg-icon icon-class="share" />
              ({{formatNumber(playlist.shareCount)}})
            </el-button>
          </div>
          <div class="tags" v-if="tags.length">
            <span>标签：</span>
            <span class="tag" v-for="(item, index) in tags" :key="index">
              <el-tag size="small">{{item}}</el-tag>
            </span>
          </div>
          <div class="description">
            <span>简介：</span>
            <span>{{playlist.description}}</span>
          </div>
        </div>
      </div>
      <div class="music-list">
        <Table ref="musicList" :list="songs" @updateSonglist="updateSonglist" />
      </div>
      <div>
        <Comment :id="id" type="playlist" />
      </div>
    </el-main>
    <el-aside width="270px">
      <div class="subscriber" v-if="subscribers.length">
        <div class="title">喜欢这个歌单的人</div>
        <div class="subscriber-list">
          <div class="img-wrap"
            v-for="(item, index) in subscribers"
            :key="index"
          >
            <img :src="item.avatarUrl" />
          </div>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import { getPlayListDetails, getSubscribers, subPlayList } from '../api/playlist'
import { getSongDetail, getSongUrl, checkMusic } from '../api/song'
import { userPlaylist } from '../api/user'
import { formatDate, formatNumber } from '../utils'
import Table from '../components/Table.vue'
import { mapActions, mapGetters } from 'vuex'
import Comment from '../components/Comment.vue'

export default {
  data () {
    return {
      id: this.$route.params.id,
      playlist: {},
      creator: {},
      tags: [],
      songs: [],
      subscribers: [],
      formatDate,
      formatNumber,
      isSub: false
    }
  },
  methods: {
    initData () {
      this.getPlayListDetail()
      this.getSubscribers()
    },
    async getPlayListDetail () {
      const { data: { playlist } } = await getPlayListDetails(this.id)
      this.playlist = playlist
      //  Object.freeze() 可以冻结一个对象
      this.creator = Object.freeze(playlist.creator)
      this.tags = playlist.tags
      this.getSongList(playlist)
    },
    async getSongList (playlist) {
      console.log(playlist)
      const trackIds = playlist.trackIds.map(({ id }) => id)
      const { data } = await getSongDetail(trackIds)
      this.songs = data.songs
    },
    async getSubscribers () {
      const { data: { subscribers } } = await getSubscribers({
        id: this.id,
        limit: 10
      })
      this.subscribers = subscribers
    },
    // 播放全部
    async playAll () {
      this.Add_ALL_SONG(this.songs)
      await checkMusic(this.songs[0].id).then(async () => {
        await getSongUrl(this.songs[0].id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        this.CHANGE_PLAY_STATE(true)
        this.SAVE_SONG_DETAIL(this.songs[0])
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    // 收藏歌单
    async subSongList () {
      if (!this.isLogin) {
        this.$message({
          type: 'warning',
          message: '登录后才能收藏',
          showClose: true,
          center: true
        })
      }
      const t = !this.isSub ? 1 : 2 // 1 收藏 2 取消收藏
      await subPlayList({
        t,
        id: this.id
      }).then(async res => {
        if (res.data.code === 200) {
          this.isSub = !this.isSub
          await userPlaylist({
            uid: this.userInfo.profile.userId
          }).then(({ data }) => {
            console.log(data.playlist)
            if (t === 1) {
              this.$message({
                type: 'success',
                message: '收藏成功',
                center: true
              })
            } else {
              this.$message({
                type: 'success',
                message: '取消收藏成功',
                center: true
              })
            }
          })
        }
      }).catch(() => {
        this.$message.warning('操作失败,请重试')
      })
    },
    updateSonglist () {
      this.getPlayListDetail()
      setTimeout(() => {
        this.$router.go(0)
      }, 1000)
    },
    ...mapActions('music', ['Add_ALL_SONG', 'SAVE_SONG_DETAIL']),
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE']),
    ...mapActions('user', ['SAVE_USER_PLAYLIST'])
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo', 'isLogin'])
  },
  watch: {
    id: 'init'
  },
  components: { Table, Comment }
}
</script>

<style lang="scss" scoped>
.el-main {
  border-right: 1px solid var(--border);
  .detail {
    display: flex;
    .img-wrap {
      img {
        width: 208px;
        height: 208px;
        border-radius: 4px;
      }
    }
    .content {
      margin-left: 20px;
      .content-title {
        display: flex;
        font-size: 20px;
        align-items: flex-end;
        .el-tag {
          background: #d61c1c;
          color: #fff;
          border: none;
        }
        p {
          margin-left: 10px;
        }
      }
      .author {
        margin: 20px 0;
        display: flex;
        align-items: center;
        img {
          width: 35px;
          height: 35px;
        }
        .nickname {
          color: #517eaf;
          margin: 0 10px;
        }
      }
      .btns {
        .btn {
          border: 1px solid #d2d0d0;
          background: none;
          color: var(--font-color);
        }
        .play {
          background: #d61c1c;
          color: #fff;
          border: none;
        }
      }
      .tags {
        margin-top: 10px;
        .tag {
          margin-right: 10px;
          .el-tag {
            color: var(--font-color);
            border-radius: 100px;
            background: none;
            border: 1px solid var(--font-color);
          }
        }
      }
      .description {
        margin-top: 10px;
        line-height: 1.5;
      }
    }
  }
  .music-list {
    margin: 30px 0;
  }
}
.el-aside {
  margin-left: 20px;
  .title {
    height: 23px;
    margin-bottom: 10px;
    font-weight: bolder;
    border-bottom: 1px solid var(--border);
  }
  .subscriber {
    .subscriber-list {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0 0 -13px;
      .img-wrap {
        padding: 0 0 13px 13px;
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="user">
    <div class="profile">
      <img :src="profile.avatarUrl" />
      <div class="profile-info">
        <div class="info-title">
          <div class="nickname">
            <span>{{profile.nickname}}</span>
            <el-tag size="mini">LV{{level}}</el-tag>
          </div>
          <el-button size="mini">编辑个人资料</el-button>
        </div>
        <ul class="info-screen">
          <li>
            <div>{{profile.eventCount}}</div>
            <div>动态</div>
          </li>
          <li>
            <div>{{profile.follows }}</div>
            <div>关注</div>
          </li>
          <li>
            <div>{{profile.followeds}}</div>
            <div>粉丝</div>
          </li>
        </ul>
        <div class="info-type" v-if="profile.allAuthTypes !== undefined">
          <el-tag size="small">
            <i class="el-icon-star-off" />
            达人
          </el-tag>
          <ul v-for="(item, index) in profile.allAuthTypes" :key="index">
            <li>{{item.desc}}</li>
          </ul>
        </div>
        <div class="info-signature" v-if="profile.signature">
          <span>个人介绍：</span>
          <span>{{profile.signature}}</span>
        </div>
      </div>
    </div>

    <div class="rank" v-if="songs.length !== 0">
      <div class="title-wrap">
        <div class="left">
          <span>听歌排行</span>
          <span>累计听歌{{songs.length}}首</span>
        </div>
        <div class="right">
          <el-radio v-model="radio" :label="1">最近一周</el-radio>
          <el-radio v-model="radio" :label="0">所有时间</el-radio>
        </div>
      </div>
      <ul class="song-wrap">
        <li
          class="list"
          :key="index"
          v-for="(item, index) in songs"
        >
            <div class="hd">
              <div class="item-index">{{index+1}}.</div>
              <a href="javascript:;" @click="audioPlay(item)" class="icons">
                <svg-icon icon-class="play" size="16" />
              </a>
            </div>
            <div class="songs-detail">
              <span class="song-name" @click="audioInfo(item)">{{item.song.name}}</span>
              <span>-</span>
              <span class="song-ar" @click="songAuthInfo(item)">{{item.song.ar[0].name}}</span>
            </div>
            <div class="count">{{ item.playCount }}次</div>
        </li>
      </ul>
    </div>

    <div class="playlist rank" v-if="createdSongList.length !== 0">
      <div class="title-wrap">
        <div class="left">
          <span>{{profile.nickname}}创建的歌单({{createdSongList.length}})</span>
        </div>
      </div>
      <ul>
        <li v-for="(item, index) in createdSongList" :key="index">
          <div class="img" @click="playlistInfo(item)">
            <img :src="item.coverImgUrl" />
          </div>
          <div class="name">{{item.name}}</div>
        </li>
      </ul>
    </div>

    <div class="playlist rank" v-if="collectSongList.length !== 0">
      <div class="title-wrap">
        <div class="left">
          <span>{{profile.nickname}}收藏的歌单({{collectSongList.length}})</span>
        </div>
      </div>
      <ul>
        <li v-for="(item, index) in collectSongList" :key="index">
          <div class="img" @click="playlistInfo(item)">
            <img :src="item.coverImgUrl" />
          </div>
          <div class="name">{{item.name}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { userDetail, userRecord, userPlaylist } from '../api/user'
import { checkMusic, getSongUrl } from '../api/song'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      profile: {},
      level: '',
      radio: 1,
      songs: [],
      createdSongList: [],
      collectSongList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.userDetails()
      this.userRecord()
      this.userPlaylist()
    },
    async userDetails () {
      const { data: { level, profile } } = await userDetail(this.$route.params.id)
      this.profile = profile
      this.level = level
    },
    async userRecord () {
      const { data: { allData, weekData } } = await userRecord({
        uid: this.$route.params.id,
        type: this.radio
      })
      if (this.radio === 1) {
        this.songs = weekData
      } else {
        this.songs = allData
      }
    },
    async userPlaylist () {
      const uid = this.$route.params.id
      const { data: { playlist } } = await userPlaylist({
        uid
      })
      const collectIndex = playlist.findIndex(item =>
        item.creator.userId !== Number(uid)
      )
      this.createdSongList = playlist.slice(0, collectIndex)
      this.collectSongList = playlist.slice(collectIndex)
    },
    // 播放
    async audioPlay (val) {
      await checkMusic(val.song.id).then(async () => {
        const { data: { data } } = await getSongUrl(val.song.id)
        // 提交歌曲url
        this.SAVE_SONG_URL(data[0].url)
        // 更新播放状态
        this.CHANGE_PLAY_STATE(true)
        // 保存歌曲信息
        this.SAVE_SONG_DETAIL(this.getSongInfo(val.song))
        // 歌曲列表
        this.ADD_PLATING_LIST(this.getSongInfo(val.song))

        // this.getSongInfo(val.song)
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    getSongInfo (song) {
      const newSongInfo = { al: {}, ar: [{}] }
      newSongInfo.id = song.id
      newSongInfo.name = song.name
      newSongInfo.dt = song.dt
      newSongInfo.al.picUrl = song.al.picUrl
      newSongInfo.al.name = song.al.name
      newSongInfo.al.id = song.al.id
      newSongInfo.ar[0].name = song.ar[0].name
      newSongInfo.ar[0].id = song.ar[0].id
      if (song.mv !== 0) {
        newSongInfo.mv = song.mv
      }
      return newSongInfo
    },
    audioInfo () {},
    songAuthInfo () {},
    playlistInfo (val) {
      this.$router.push(`/playlist/${val.id}`)
    },
    ...mapActions('music', [
      'SAVE_SONG_DETAIL',
      'ADD_PLATING_LIST'
    ]),
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE'])
  },
  watch: {
    radio (newValue) {
      this.userRecord()
    }
  }
}
</script>

<style scoped lang="scss">
.user {
  .profile {
    margin-top: 20px;
    display: flex;
    img {
      width: 180px;
      height: 180px;
      border: 1px solid #d5d5d5;
      padding: 3px;
    }
    .profile-info {
      margin-left: 20px;
      width: 100%;
      margin-right: 15px;
      .info-title {
        display: flex;
        justify-content: space-between;
        padding-bottom: 12px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        .nickname {
          font-size: 22px;
          display: flex;
          align-items: flex-end;
          .el-tag {
            color: #e03a24;
            border: 2px solid #e03a24;
            background: none;
            border-radius: 100px;
            width: 50px;
            font-weight: bold;
            text-align: center;
            margin-left: 10px;
          }
        }
        .el-button {
          background: none;
          border: 1px solid #d4d4d4;
          color: var(--font-color);
        }
      }
      .info-screen {
        margin-bottom: 15px;
        display: flex;
        li {
          // float: left;
          padding: 0 40px 0 20px;
          border-left: 1px solid #ddd;
          &:first-of-type {
            border: none;
            padding-left: 0;
          }
          div:first-of-type {
            font-size: 24px;
          }
        }
      }
      .info-type {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        .el-tag {
          background: #eabd20;
          color: #fff;
          border: none;
        }
        ul {
          margin-left: 10px;
          li {
            float: left;
            padding-left: 10px;
          }
        }
      }
    }
  }

  .rank {
    margin-top: 40px;
    .title-wrap {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 2px solid #c20c0c;
      .left {
        span:first-of-type {
          font-size: 20px;
          margin-right: 10px;
        }
      }
      .right {
        ::v-deep .el-radio.is-checked {
          .el-radio__label {
            color: #808080 !important;
          }
          font-weight: 700;
        }
        ::v-deep .el-radio__input {
          display: none;
        }
        ::v-deep .el-radio {
          margin-right: 0;
        }
      }
    }
    .song-wrap {
      border: 1px solid var(--border);
      border-top: none;
      li {
        height: 38px;
        line-height: 38px;
        overflow: hidden;
        &:nth-of-type(even) {
          background-color: var(--menu-item-hover-bg);
        }
        padding: 0 20px 0 10px;
        .hd {
          float: left;
          width: 72px;
          display: flex;
          .item-index {
            padding-right: 8px;
            font-size: 16px;
            text-align: right;
            width: 34px;
          }
          .icons {
            color: var(--font-color);
          }
        }
        .songs-detail {
          float: left;
          padding-left: 10px;
          width: 480px;
          color: #808080;
          .song-name {
            padding-right: 5px;
            color: var(--font-color);
            font-weight: bolder;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          .song-ar {
            padding-left: 5px;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .count {
          float: right;
        }
      }
    }
  }

  .playlist {
    ul {
      margin-left: -20px;
      display: flex;
      flex-wrap: wrap;
      li {
        padding: 20px;
        width: calc(20% - 40px);
        img {
          width: 100%;
          height: 100%;
        }
        .name {
          margin-top: 5px;
          font-size: 14px;
          // width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>

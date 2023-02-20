<template>
  <div>
    <el-carousel :interval="4000" type="card" class="banner-carousel">
      <el-carousel-item :key="item.scm" v-for="item in banners">
        <img class="banner-img" :src="item.imageUrl" />
      </el-carousel-item>
    </el-carousel>
    <div class="playlist">
      <div class="title">推荐歌单</div>
      <div class="list-wrap">
        <div class="playlist-card"
          v-for="(item, index) in playlists"
          :key="index"
          @click="goPlaylist(item)"
        >
          <div class="img-wrap">
            <img :src="item.picUrl" />
            <div class="bottom">
              <div class="play-count">
                <svg-icon icon-class="headset" size="16" />
                {{formatNumber(item.playCount)}}
              </div>
              <div class="play">
                <a href="javascript:;">
                  <svg-icon icon-class="play" size="16" />
                </a>
              </div>
            </div>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="new-songs">
      <div class="title">新音乐</div>
      <div class="list-wrap">
        <div :key="listIndex" class="list" v-for="(list, listIndex) in thunkedList" >
          <div
            class="song-card"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="order-wrap">
              <span class="order">{{pad(listIndex * chunkLimit + index +1)}}</span>
            </div>
            <div class="img-wrap">
              <img :src="item.song.album.blurPicUrl" />
              <a href="javascript:;" @click="onClickSong(item)">
                <svg-icon icon-class="play" size="30" />
              </a>
            </div>
            <div class="song-content">
              <p class="song-name">{{item.name}}</p>
              <p class="song-artists">{{artists}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mv">
      <div class="title">推荐mv</div>
      <ul class="list-wrap">
        <li
          :key="item.id"
          class="list-item"
          v-for="item in mvs"
          @click="goMv(item.id)"
        >
          <div class="mv-card">
            <div class="img-wrap">
              <img :src="item.picUrl">
              <div class="bottom" v-if="item.playCount">
                <div class="play-count">
                  <svg-icon icon-class="headset" size="15" />
                  {{formatNumber(item.playCount)}}
                </div>
                <div class="play">
                  <svg-icon icon-class="play" size="15" />
                </div>
              </div>
            </div>
            <p class="name">{{item.name}}</p>
            <p class="author">{{item.artistName}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { checkMusic, getSongDetail, getSongUrl } from '../api/song'
import { getBanner, getPlayList, getNewSong, getMv } from '../api/discovery'
import { formatNumber, isDef, pad } from '../utils'

const songsLimit = 10

export default {
  data () {
    return {
      banners: [], // 轮播图
      playlists: [],
      formatNumber,
      newSongs: [],
      artists: '',
      chunkLimit: Math.ceil(songsLimit / 2),
      pad,
      mvs: []
    }
  },
  methods: {
    async banner () {
      const { data: { banners } } = await getBanner()
      this.banners = banners
    },
    async playlist () {
      const { data: { result } } = await getPlayList()
      this.playlists = result
    },
    async newSong () {
      const { data: { result } } = await getNewSong()
      this.newSongs = result

      this.newSongs.map(song => {
        this.artists = (song.song.artists || []).map(({ name }) => name).join('/')
      })
    },
    async mv () {
      const { data: { result } } = await getMv()
      this.mvs = result
    },
    async onClickSong (item) {
      await checkMusic(item.id).then(async () => {
        await getSongUrl(item.id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        await getSongDetail(item.id).then(res => {
          this.SAVE_SONG_DETAIL(res.data.songs[0])
          this.ADD_PLATING_LIST(res.data.songs[0])
        })
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    goPlaylist (item) {
      this.$router.push(`/playlist/${item.id}`)
    },
    goMv (id) {
      if (isDef(id)) {
        this.$router.push(`/mv/${id}`)
      }
    },
    ...mapActions('music', ['SAVE_SONG_DETAIL', 'ADD_PLATING_LIST']),
    ...mapActions('common', ['SAVE_SONG_URL'])
  },
  created () {
    this.banner()
    this.playlist()
    this.newSong()
    this.mv()
  },
  computed: {
    thunkedList () {
      return [
        this.newSongs.slice(0, this.chunkLimit),
        this.newSongs.slice(this.chunkLimit, this.newSongs.length)
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-carousel {
  /deep/.el-carousel__container {
    height: 200px;
  }
  .banner-img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
.title {
  font-size: 18px;
  color: var(--font-color-white);
}
.playlist {
  margin-top: 10px;
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    .playlist-card {
      width: calc(20% - 24px);
      margin: 12px;
      margin-bottom: 24px;
      .img-wrap {
        position: relative;
        width: 100%;
        padding-top: 100%;
        margin-bottom: 8px;
        border-radius: 4px;
        overflow: hidden;
        img {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .bottom {
          position: absolute;
          bottom: 0;
          left: 0px;
          width: 100%;
          display: flex;
          align-items: center;
          height: 27px;
          background-color: rgba($color: #000000, $alpha: 0.4);
          color: #ccc;
          justify-content: space-between;
          .play-count {
            margin-left: 5px;
            .svg-icon {
              margin-right: 5px;
            }
          }
          .play {
            margin-right: 5px;
            a {
              color: #ccc;
            }
          }
        }
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.new-songs {
  margin-bottom: 36px;
  .list-wrap {
    display: flex;
    margin-top: 20px;
    .list {
      flex: 1;
      overflow: hidden;
      .song-card {
        display: flex;
        cursor: pointer;
        margin-bottom: 20px;
        div {
          flex-shrink: 0;
        }
        &:hover {
          background: var(--light-bgcolor);
        }
        .order-wrap {
          width: 30px;
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-wrap {
          position: relative;
          width: 60px;
          height: 60px;
          margin-right: 8px;
          img {
            width: 100%;
            height: 100%;
          }
          a {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
          }
        }
        .song-content {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex: 1;
          overflow: hidden;
          .song-name {
            color: var(--font-color-white);
            cursor: pointer;
          }
        }
      }
    }
  }
}
.mv {
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -12px;
    .list-item {
      width: 25%;
      padding: 0 12px;
      .mv-card {
        min-width: 140px;
        .img-wrap {
        position: relative;
        width: 100%;
        padding-top: 63%;
        margin-bottom: 8px;
        border-radius: 4px;
        overflow: hidden;
        img {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .bottom {
          position: absolute;
          bottom: 0;
          left: 0px;
          width: 100%;
          display: flex;
          align-items: center;
          height: 27px;
          background-color: rgba($color: #000000, $alpha: 0.4);
          color: #ccc;
          justify-content: space-between;
          .play-count {
            margin-left: 5px;
            .svg-icon {
              margin-right: 5px;
            }
          }
          .play {
            margin-right: 5px;
            a {
              color: #ccc;
            }
          }
        }
      }
        .name {
          margin-top: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .author {
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--font-color-grey-shallow);
        }
      }
    }
  }
}
</style>

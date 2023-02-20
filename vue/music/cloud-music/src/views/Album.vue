<template>
  <div>
    <div class="detail">
      <div class="img-wrap">
        <img :src="album.picUrl" />
      </div>
      <div class="content">
        <div class="content-title">
          <el-tag size="small">专辑</el-tag>
          <p>{{ album.name }}</p>
        </div>
        <div class="author">
          歌手：
          <span
            class="artists"
            v-for="(item, index) in album.artists"
            :key="index"
            @click="goArtist(item.id)"
          >
            {{ item.name }}
          </span>
        </div>
        <p class="publishTime">
          发布时间：{{ formatDate(album.publishTime, "yyyy-MM-dd") }}
        </p>
        <p class="company">发行公司：{{ album.company }}</p>
        <div class="btns">
          <el-button size="mini" class="play" @click="playAll">
            <svg-icon icon-class="play" />
            播放
          </el-button>
          <el-button size="mini" icon="el-icon-folder-add"> 收藏 </el-button>
        </div>
      </div>
    </div>
    <div class="desc">
        <p class="desc-header">专辑介绍</p>
        <p
          class="desc-content"
          v-for="(item, index) in showHandleList"
          :key="index"
        >
          {{ item }}
        </p>
        <div
          v-if="this.description.length > 8"
          @click="showAll = !showAll"
          class="icon"
        >
          <span>{{word}}</span>
          <i :class="icon" />
        </div>
    </div>
    <div class="music-list">
      <Table ref="musicList" :list="songs" />
    </div>
    <div class="comment">
      <Comment :id="id" type="album" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getAlbum } from '../api/album'
import { getSongUrl, checkMusic } from '../api/song'
import { formatDate, formatNumber } from '../utils'
import Table from '../components/Table.vue'
import Comment from '../components/Comment.vue'

export default {
  data () {
    return {
      album: {},
      songs: [],
      description: [],
      formatDate,
      formatNumber,
      howAll: false,
      showAll: false,
      id: this.$route.params.id
    }
  },
  methods: {
    async getAlbum () {
      const { data } = await getAlbum(this.$route.params.id)
      this.album = data.album
      this.songs = data.songs
      this.description = data.album.description
        .split()
        .join()
        .split('\n\n')
        .join('\n')
        .split('\n')
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
    goArtist (id) {
      this.$router.push(`/artist/${id}`)
    },
    ...mapActions('music', ['Add_ALL_SONG', 'SAVE_SONG_DETAIL']),
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE'])
  },
  created () {
    this.getAlbum()
  },
  components: { Table, Comment },
  computed: {
    showHandleList () {
      if (this.showAll === false) {
        let showList = []
        if (this.description.length > 8) {
          for (let i = 0; i < 8; i++) {
            showList.push(this.description[i])
          }
        } else {
          showList = this.description
        }
        return showList
      } else {
        return this.description
      }
    },
    word () {
      if (this.showAll === false) {
        return '展开'
      } else {
        return '收起'
      }
    },
    icon () {
      if (this.showAll === false) {
        return 'el-icon-arrow-down'
      } else {
        return 'el-icon-arrow-up'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";
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
      margin-top: 10px;
      .artists {
        color: $blue;
        padding: 0 4px;
        line-height: 18px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .publishTime,
    .company {
      margin-top: 10px;
    }
    .btns {
      margin-top: 20px;
      .el-button {
        border-radius: 100px;
      }
      .play {
        background: #d61c1c;
        color: #fff;
        border: none;
      }
    }
  }
}
.desc {
  margin-top: 30px;
  .desc-header {
    font-weight: bold;
    font-size: 14px;
    color: var(--font-color-white);
  }
  .desc-content {
    text-indent: 2em;
    line-height: 24px;
    margin-top: 4px;
  }
  .icon {
    float: right;
    span {
      color: $blue;
    }
  }
}

.music-list {
  margin: 30px 0;
}
</style>

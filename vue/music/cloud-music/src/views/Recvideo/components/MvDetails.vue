<template>
  <el-container>
    <el-main>
      <div class="n-mv">
        <div class="title">
          <el-tag type="danger" effect="plain">MV</el-tag>
          <p class="name">{{mvDetail.name}}</p>
          <p class="artistName">{{mvDetail.artistName}}</p>
        </div>
        <div class="players">
          <VideoPlayer
            :cover="mvDetail.cover"
            ref="video"
            :url="mvUrl"
          />
        </div>
      </div>
      <div class="comments">
        <Comment :id="id" type="mv" />
      </div>
    </el-main>
    <el-aside width="270px">
      <div class="video-content">
        <div class="title">
          <span>mv简介</span>
        </div>
        <div class="mvintr">
          <p>发布时间：{{mvDetail.publishTime}}</p>
          <p>播放次数：{{formatNumber(mvDetail.playCount)}}</p>
        </div>
        <p class="desc">
          {{mvDetail.briefDesc}}
          <br>
          {{mvDetail.desc}}</p>
      </div>
      <div class="recommend">
        <div class="title">
          <span>相关推荐</span>
        </div>
        <div class="simi-mvs">
          <div
            class="horizontal-card"
            v-for="item in simiMv"
            :key="item.id"
            @click="goMv(item.id)"
          >
            <div class="img-wrap">
              <img :src="item.cover" />
              <div class="play-count">
                <svg-icon icon-class="video" />
                {{formatNumber(item.playCount)}}
              </div>
            </div>
            <div class="content">
              <p class="name">{{item.name}}</p>
              <p class="duration">{{Math.floor(item.duration / 1000) | timeFormat}}</p>
              <p class="artistName">by {{item.artistName}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import { getMvDetail, getMvUrl, getSimiMv } from '../../../api/mv'
import { formatDate, formatNumber, formatTime, isDef } from '../../../utils'
import VideoPlayer from '../../../components/VideoPlayer.vue'
import Comment from '../../../components/Comment.vue'

export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      mvDetail: {},
      mvUrl: '',
      simiMv: [],
      formatDate,
      formatNumber,
      formatTime
    }
  },
  methods: {
    async init () {
      const { data } = await getMvDetail(this.id)
      this.mvDetail = data.data
      console.log(this.mvDetail)

      const res = await getMvUrl(this.id)
      console.log(res.data.data.url, '111111111111')
      this.mvUrl = res.data.data.url

      const { data: { mvs } } = await getSimiMv(this.id)
      this.simiMv = mvs

      this.$nextTick(() => {
        // players.on('play', () => {
        // 停止播放歌曲
        // })
      })
    },
    goMv (id) {
      if (isDef(id)) {
        this.$router.push(`/mv/${id}`)
      }
      this.$router.go(0)
    }
  },
  created () {
    this.init()
  },
  computed: {
  },
  watch: {
    id: 'init'
  },
  components: { VideoPlayer, Comment }
}
</script>

<style lang="scss" scoped>
.el-main {
  border-right: 1px solid var(--border);
  .n-mv {
    .title {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      .name {
        font-size: 24px;
        margin: 0 10px;
      }
    }
    .players {
      margin-bottom: 16px;
      border-radius: 4px;
    }
  }
}
.el-aside {
  margin-left: 20px;
  .video-content {
    margin-bottom: 32px;
    .title {
      height: 23px;
      margin-bottom: 10px;
      font-weight: bolder;
      border-bottom: 1px solid var(--border);
    }
    .mvintr {
      margin-bottom: 10px;
      p {
        line-height: 18px;
        color: var(--font-color-grey-shallow);
      }
    }
    .desc {
      line-height: 1.5;
    }
  }
  .recommend {
    .title {
      height: 23px;
      margin-bottom: 10px;
      font-weight: bolder;
      border-bottom: 1px solid var(--border);
    }
    .simi-mvs {
      margin-bottom: 20px;
      .horizontal-card {
        margin-bottom: 20px;
        display: flex;
        .img-wrap {
          width: 96px;
          height: 54px;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
          }
          .play-count {
            background-color: rgba($color: #000000, $alpha: 0.4);
            position: absolute;
            top: 0;
            right: 0;
            padding-right: 5px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            text-align: right;
            width: 100%;
          }
        }
        .content {
          line-height: 1.5;
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .duration, .artistName {
            color: var(--font-color-grey-shallow);
          }
        }
      }
    }
  }
}
</style>

<template>
  <el-container>
    <el-main>
      <div class="n-mv">
        <div class="title">
          <p class="name">{{videoinfo.title}}</p>
          <p class="artistName">by {{nickname}}</p>
        </div>
        <div class="players">
          <VideoPlayer
            :cover="videoinfo.coverUrl"
            ref="video"
            :url="videoUrl"
          />
        </div>
      </div>
      <div class="comments">
        <Comment :id="id" type="video" />
      </div>
    </el-main>
    <el-aside width="270px">
      <div class="video-content">
        <div class="title">
          <span>视频简介</span>
        </div>
        <div class="mvintr">
          <p>发布时间：{{formatDate(videoinfo.publishTime, 'yyyy-MM-dd')}}</p>
          <p>播放次数：{{formatNumber(videoinfo.playTime)}}</p>
        </div>
        <p class="desc"> {{videoinfo.description }}</p>
      </div>
      <div class="recommend">
        <div class="title">
          <span>相关推荐</span>
        </div>
        <div class="simi-mvs">
          <div
            class="horizontal-card"
            v-for="(item, index) in relatedVideo"
            :key="index"
            @click="goVideo(item)"
          >
            <div class="img-wrap">
              <img :src="item.coverUrl" />
              <div class="play-count">
                <svg-icon icon-class="video" />
                {{formatNumber(item.playTime)}}
              </div>
            </div>
            <div class="content">
              <p class="name">{{item.title}}</p>
              <p class="duration">{{Math.floor(item.durationms / 1000) | timeFormat}}</p>
              <p class="artistName">by {{item.creator[0].userName}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import { getVideoDetail, getVideoUrl, relatedVideo } from '../../../api/mv'
import { formatDate, formatNumber } from '../../../utils'
import VideoPlayer from '../../../components/VideoPlayer.vue'
import Comment from '../../../components/Comment.vue'

export default {
  data () {
    return {
      formatDate,
      formatNumber,
      id: this.$route.params.id,
      videoinfo: {},
      nickname: '',
      videoUrl: '',
      relatedVideo: []
    }
  },
  methods: {
    async init () {
      const { data: { data } } = await getVideoDetail(this.id)
      this.videoinfo = data
      this.nickname = data.creator.nickname

      const { data: { urls } } = await getVideoUrl(this.id)
      urls.map(item => {
        this.videoUrl = item.url
      })

      const { data: { data: related } } = await relatedVideo(this.id)
      console.log(related)
      this.relatedVideo = related
    },
    goVideo (item) {
      this.$router.push(`/video/${item.vid}`)
      this.$router.go(0)
    }
  },
  created () {
    this.init()
  },
  computed: {
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
      flex-wrap: wrap;
      line-height: 1.5;
      .name {
        font-size: 24px;
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
          width: 178px;
          .duration, .artistName {
            color: var(--font-color-grey-shallow);
          }
        }
      }
    }
  }
}
</style>

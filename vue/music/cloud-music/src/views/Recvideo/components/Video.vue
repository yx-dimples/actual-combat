<template>
  <div class="video" ref="video">
    <TabsNav :group="group" :category="category" @tagClick="tagClick" />
      <ul class="list-wrap" v-if="videoes.length !== 0">
        <li
          class="list-item"
          v-for="(item, index) in videoes"
          :key="index"
          @click="videoItemClick(item)"
        >
          <div class="mv-card">
            <div class="img-wrap">
              <img :src="item.data.coverUrl" />
              <span class="icons">
                <a href="javaScript:;" class="icon-play">
                  <svg-icon icon-class="play" size="30" />
                </a>
              </span>
            </div>
          </div>
          <p class="name">{{ item.data.title || item.data.name }}</p>
          <div>
            <p v-if="item.data.artists" class="artistName">
              by {{item.data.artists[0].name}}
            </p>
            <p v-else class="artistName">
              by {{item.data.creator.nickname}}
            </p>
          </div>
        </li>
      </ul>
      <div class="empty">暂无视频</div>
  </div>
</template>

<script>
import { getVideoGroup, getVideoCategory, getVideo } from '../../../api/mv'
import TabsNav from '../../../components/TagsNav.vue'

export default {
  data () {
    return {
      group: [],
      category: [],
      offset: 0,
      videoes: [],
      tagId: ''
    }
  },
  created () {
    this.getVideoGroup()
    this.getVideoCategory()
  },
  methods: {
    async getVideoGroup () {
      const { data: { data } } = await getVideoGroup()
      this.group = data
    },
    async getVideoCategory () {
      const { data: { data } } = await getVideoCategory()
      this.category = data
      this.tagId = String(this.category[0].id)
      this.getVideo()
    },
    tagClick (id) {
      this.offset = 0
      this.videoes = []
      this.tagId = String(id)
      this.getVideo()
    },
    async getVideo () {
      await getVideo({
        id: this.tagId,
        offset: this.offset
      }).then(({ data }) => {
        if (data.hasmore) {
          this.videoes.push(...data.datas)
          this.offset += 1
          if (this.offset < 4) {
            this.getVideo()
          }
        }
      })
    },
    videoItemClick (item) {
      console.log(item)
      if (item.data.videoGroup[0].type === 0) {
        this.$router.push(`/mv/${item.data.id}`)
      } else {
        this.$router.push(`/video/${item.data.vid}`)
      }
    }
  },
  components: { TabsNav }
}
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.video {
  padding: $page-padding;
  margin: auto;
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -12px;
    .list-item {
      width: 25%;
      padding: 10px 12px;
      .mv-card {
        min-width: 140px;
        .img-wrap {
          position: relative;
          width: 100%;
          margin-bottom: 8px;
          overflow: hidden;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
          }
          .icons {
            &:hover {
              a {
                opacity: 1;
              }
            }
            .icon-play {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              color: $theme-color;
              opacity: 0;
              transition: opacity 0.3s;
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
      .artistName {
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--font-color-grey-shallow);
      }
    }
  }
  .empty {
    margin-top: 100px;
    text-align: center;
  }
}
</style>

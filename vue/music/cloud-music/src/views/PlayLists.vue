<template>
  <div class="playlist" ref="playlists">
    <div class="title-wrap">
      <div class="layer-wrapper">
        <p>{{cat}}</p>
        <el-button size="mini" @click="openLayer">全部分类</el-button>
        <!-- 标签弹出层 -->
        <div class="layer" v-if="showLayer" ref="layer">
          <div class="title">全部风格</div>
          <div class="tag-list" v-for="(item, index) in allCats" :key="index">
            <div class="tag-title">
              <template v-if="index === 0">
                <svg-icon icon-class="language" size="20" /> 语种
              </template>
              <template v-if="index === 1">
                <svg-icon icon-class="style" size="20" /> 风格
              </template>
              <template v-if="index === 2">
                <svg-icon icon-class="scene" size="20" /> 场景
              </template>
              <template v-if="index === 3">
                <svg-icon icon-class="emotion" size="20" /> 情感
              </template>
              <template v-if="index === 4">
                <svg-icon icon-class="subject" size="20" /> 主题
              </template>
            </div>
            <ul>
              <li v-for="cat in item" :key="cat.name">
                <span
                @click="changefromAll(cat.name)"
                :class="{active: cat.isActive}"
                >{{cat.name}}</span>
                <span class="line">|</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-select v-model="value" size="mini" v-on:change="onChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="content-wrap" v-if="playlists.length">
      <div
        class="playlist-card"
        v-for="(item, index) in playlists"
        @click="goPlayList(item.id)"
        :key="index">
        <div class="img-wrap">
          <img :src="item.coverImgUrl" />
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
      <el-pagination
        background
        layout="prev, pager, next"
        small
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="onPageChange"
      />
    </div>
    <div v-else class="music">
      <svg-icon icon-class="no-data" size="40" />
      暂无数据
    </div>
  </div>
</template>

<script>
import { getCatList, getPlayList } from '../api/playlist'
import { formatNumber, scrollInto } from '../utils'

export default {
  data () {
    return {
      options: [{
        value: 'new',
        label: '最新'
      }, {
        value: 'hot',
        label: '最热'
      }],
      value: 'hot',
      showLayer: false,
      allCats: [],
      playlists: [],
      formatNumber,
      currentPage: 1,
      total: 0,
      pageSize: 20,
      cat: ''
    }
  },
  created () {
    this.getPlaylists()
  },
  methods: {
    async getAllCats () {
      const { data } = await getCatList()
      if (data.code !== 200) return
      this.allCats = []
      data.sub.forEach((item) => {
        item.isActive = false
        /* 使当前标签激活 */
        if (item.name === this.cat) {
          item.isActive = true
        }
      })
      for (let i = 0; i < 5; i++) {
        this.allCats.push(
          Object.freeze(data.sub.filter((item) => item.category === i))
        )
      }
    },
    async getPlaylists () {
      const { data: { cat, total, playlists } } = await getPlayList({
        order: this.value,
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize,
        cat: this.cat
      })
      this.playlists = playlists
      this.total = total
      this.cat = cat
    },
    onChange () {
      this.initData(this.value)
    },
    changeCat (name) {
      this.value = name
    },
    openLayer () {
      this.getAllCats()
      this.showLayer = true
      setTimeout(() => {
        window.addEventListener('click', this.closeLayer)
      }, 10)
    },
    closeLayer (e) {
      if (!this.$refs.layer) return false
      if (!this.$refs.layer.contains(e.target)) {
        this.showLayer = false
        window.removeEventListener('click', this.closeLayer)
      }
    },
    // 从弹出层访问了标签
    changefromAll (name) {
      this.currentPage = 1
      this.cat = name
      this.getPlaylists()
      this.showLayer = false
      window.removeEventListener('click', this.closeLayer)
    },
    async onPageChange (page) {
      this.currentPage = page
      await this.getPlaylists()
      this.$nextTick(() => {
        scrollInto(this.$refs.playlists)
      })
    },
    goPlayList (id) {
      this.$router.push(`/playlist/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #d33a31;
    .layer-wrapper {
      display: flex;
      position: relative;
      p {
        font-size: 24px;
        font-weight: bolder;
        margin-right: 10px;
      }
      .el-button {
        background: none;
        color: var(--font-color);
        border: 1px solid var(--font-color);
      }
      .layer {
        position: absolute;
        background-color: #ffffff;
        width: 720px;
        top: 35px;
        left: 0;
        z-index: 99;
        box-shadow: 0 0 8px #e5e5e5;
        border-radius: 4px;
        font-size: 14px;
        min-height: 400px;
        // padding: 10px 20px;
        .title {
          line-height: 24px;
          margin-bottom: 20px;
          font-weight: bolder;
          margin: 20px;
        }
        .tag-list {
          display: flex;
          line-height: 16px;
          margin: 0 0 20px 0;
          .tag-title {
            width: 70px;
            margin: 0 20px 0 20px;
            font-weight: bold;
            color: #333;
            .svg-icon {
              margin-right: 10px;
              color: #989898;
            }
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            width: 500px;
            li {
              padding: 0 0 0 15px;
              line-height: 24px;
              font-size: 12px;
              color: #333;
              .line {
                margin: 0 0 0 10px;
                color: #d8d8d8;
              }
            }
          }
        }
      }
    }
    .el-select {
      width: 70px;
      /deep/.el-input {
        input {
          background: #d33a31;
          border: none;
          color: #fff;
        }
        .el-select__caret {
          color: #fff;
        }
      }
    }
  }
  .content-wrap {
    margin-top: 10px;
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
              margin-right: 1px;
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
      }
    }
  }
  .music {
    padding: 105px 0 105px 0;
    font-size: 16px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .svg-icon {
      margin-right: 5px;
    }
  }
}
.active {
  background: #a7a7a7;
  color: #fff;
  padding: 2px 6px;
}
</style>

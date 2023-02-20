<template>
  <div class="artist" ref="artist">
    <div class="tabs-wrap">
      <p class="title">语种：</p>
      <NavBar
        :tags="areaTabs"
        @tagBarClick="areaClick"
        class="tabs"
      />
    </div>
    <div class="tabs-wrap">
      <p class="title">分类：</p>
      <NavBar
        :tags="typeTabs"
        @tagBarClick="typeClick"
        class="tabs"
      />
    </div>
    <div class="tabs-wrap">
      <p class="title">筛选：</p>
      <NavBar
        :tags="initialTabs"
        @tagBarClick="initialClick"
        class="tabs"
      />
    </div>

    <div>
      <ul class="list-wrap">
        <li @click="goArtist(item)" class="list-item" v-for="item in artists" :key="item.id">
          <div class="mv-card">
            <div class="img-wrap">
              <img :src="item.picUrl" />
            </div>
          </div>
          <p class="name">{{item.name}}</p>
        </li>
      </ul>
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
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import { getArtistList } from '../api/artist'
import { isDef, scrollInto } from '../utils'

const areaTabs = [
  { area: -1, name: '全部' },
  { area: 7, name: '华语' },
  { area: 96, name: '欧美' },
  { area: 8, name: '日本' },
  { area: 16, name: '韩国' },
  { area: 0, name: '其他' }
]

const typeTabs = [
  { type: -1, name: '全部' },
  { type: 1, name: '男歌手' },
  { type: 2, name: '女歌手' },
  { type: 3, name: '乐队' }
]

const initialTabs = [
  { initial: -1, name: '热门' },
  { initial: 'a', name: 'A' },
  { initial: 'b', name: 'B' },
  { initial: 'c', name: 'C' },
  { initial: 'd', name: 'D' },
  { initial: 'e', name: 'E' },
  { initial: 'f', name: 'F' },
  { initial: 'g', name: 'G' },
  { initial: 'h', name: 'H' },
  { initial: 'i', name: 'I' },
  { initial: 'j', name: 'J' },
  { initial: 'k', name: 'K' },
  { initial: 'l', name: 'L' },
  { initial: 'm', name: 'M' },
  { initial: 'n', name: 'N' },
  { initial: 'o', name: 'O' },
  { initial: 'p', name: 'P' },
  { initial: 'q', name: 'Q' },
  { initial: 'r', name: 'R' },
  { initial: 's', name: 'S' },
  { initial: 't', name: 'T' },
  { initial: 'u', name: 'U' },
  { initial: 'v', name: 'V' },
  { initial: 'w', name: 'W' },
  { initial: 'x', name: 'X' },
  { initial: 'y', name: 'Y' },
  { initial: 'z', name: 'Z' },
  { initial: 0, name: '#' }
]

export default {
  data () {
    return {
      activeAreaTabIndex: -1,
      activeTypeTabIndex: -1,
      activeInitialTabIndex: -1,
      pageSize: 40,
      total: 960,
      currentPage: 1,
      artists: []
    }
  },
  created () {
    this.areaTabs = areaTabs
    this.typeTabs = typeTabs
    this.initialTabs = initialTabs
    this.getArtistList()
  },
  methods: {
    async getArtistList () {
      const { data } = await getArtistList({
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize,
        type: this.activeTypeTabIndex,
        area: this.activeAreaTabIndex,
        initial: this.activeInitialTabIndex
      })
      console.log(data.artists)
      this.artists = data.artists
    },
    /* 标签点击事件 */
    areaClick (item) {
      this.activeAreaTabIndex = item.area
      this.currentPage = 1
      this.getArtistList()
    },
    typeClick (item) {
      this.activeTypeTabIndex = item.type
      this.currentPage = 1
      this.getArtistList()
    },
    initialClick (item) {
      this.activeInitialTabIndex = item.initial
      this.currentPage = 1
      this.getArtistList()
    },
    async onPageChange (page) {
      this.currentPage = page
      await this.getArtistList()
      this.$nextTick(() => {
        scrollInto(this.$refs.artist)
      })
    },
    goArtist (item) {
      if (isDef(item.id)) {
        this.$router.push(`/artist/${item.id}`)
      }
    }
  },
  components: { NavBar }
}
</script>

<style lang="scss" scoped>
@import '../style/variables.scss';

.artist {
  padding: $page-padding;
  margin: auto;
  .tabs-wrap {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    .title {
      font-size: 12px;
      margin-right: 10px;
      line-height: 33px;
    }
    .tabs {
      font-size: $font-size-sm;
      width: calc(100% - 50px);
    }
  }
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
          width: 100%;
          margin-bottom: 8px;
          overflow: hidden;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .name {
        margin-top: 8px;
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
</style>

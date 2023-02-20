<template>
  <el-container>
    <el-main>
      <div class="info">
        <div class="cover">
          <img :src="artist.cover" />
        </div>
        <div class="right">
          <p class="name">{{artist.name}}</p>
          <div class="buts">
            <el-button
              size="small"
              :icon="isSub ? 'el-icon-check' : 'el-icon-folder-add'"
              @click="subSinger"
            >{{isSub ? '已收藏' : '收藏'}}</el-button>
            <el-button size="small" icon="el-icon-link">个人主页</el-button>
          </div>
          <p class="bottom">
            单曲数目：{{artist.musicSize}}&nbsp;&nbsp;专辑数：{{artist.albumSize}}&nbsp;&nbsp;MV数：{{artist.mvSize}}
          </p>
        </div>
      </div>
      <Tabs
        :tabs="tabs"
        v-model="activeTab"
        align="tabs"
      />
      <div class="content">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </el-main>
    <el-aside width="270px">
      <div class="simi" v-if="simi.length">
        <div class="title">相似歌手</div>
        <div class="simi-list">
          <div class="img-wrap"
            v-for="(item, index) in simi"
            :key="index"
            @click="goArtists(item.id)"
          >
            <img :src="item.picUrl" />
          </div>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Tabs from '../../components/Tabs.vue'
import { getArtistDetails, getSimiArtist, subArtist, sublistArtis } from '../../api/artist'

export default {
  data () {
    this.LIST_TAB = 0
    return {
      artist: {},
      activeTab: this.LIST_TAB,
      tabs: [],
      simi: [],
      isSub: false // 是否收藏了当前歌手
    }
  },
  methods: {
    async artistDetails () {
      const { data: { data } } = await getArtistDetails(this.$route.params.id)
      console.log(data)
      this.artist = data.artist
      this.tabs = [
        { title: '热门作品', to: `/artist/${this.artist.id}` },
        { title: '所有专辑', to: `/artist/album/${this.artist.id}` },
        { title: '相关MV', to: `/artist/mv/${this.artist.id}` },
        { title: '艺人介绍', to: `/artist/desc/${this.artist.id}` }
      ]
    },
    async getSimiArtist () {
      const { data } = await getSimiArtist(this.$route.params.id)
      this.simi = data.artists
    },
    goArtists (id) {
      this.$router.push(`/artist/${id}`)
    },
    async subSinger () {
      if (!this.isLogin) {
        this.$message.error('请先登录!')
      }
      this.isSub = !this.isSub

      await subArtist({
        id: this.$route.params.id,
        t: this.isSub ? 1 : 0
      })

      this.getSubSingerList()
    },
    async getSubSingerList () {
      const { data } = await sublistArtis()
      this.UPDATE_SUB_SINGERLIST(data.data)
    },
    // 判断用户是否收藏了该歌手
    getIsSub () {
      this.isSub = this.subSingerList.find(item => (item.id === Number(this.$route.params.id)))
    },
    ...mapActions('music', ['UPDATE_SUB_SINGERLIST'])
  },
  created () {
    this.artistDetails()
    this.getSimiArtist()
  },
  components: { Tabs },
  computed: {
    ...mapGetters(['isLogin', 'subSingerList'])
  },
  async mounted () {
    if (this.isLogin) {
      if (this.subSingerList === null) {
        await this.getSubSingerList()
      }
      this.getIsSub()
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  margin-bottom: 10px;
  .cover {
    width: 320px;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
  .right {
    margin-left: 20px;
    .name {
      font-size: 24px;
      margin-bottom: 15px;
      color: var(--font-color-white);
    }
    .buts {
      margin-bottom: 15px;
      .el-button {
        background: none;
        border: 1px solid var(--font-color-grey2);
        color: var(--font-color);
        border-radius: 100px;
      }
    }
  }
}
.simi {
  .simi-list {
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
</style>

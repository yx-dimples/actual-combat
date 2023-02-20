<template>
    <div v-if="hotAlbums.length !== 0" ref="albums">
      <div class="content-wrap">
      <div
        class="album-card"
        v-for="(item, index) in hotAlbums"
        :key="index"
        @click="goAlbum(item)"
      >
        <div class="img-wrap">
          <img :src="item.picUrl" />
        </div>
        <p class="name">{{item.name}}</p>
        <p class="publishTime">{{formatDate(item.publishTime, 'yyyy-MM-dd')}}</p>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      small
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getArtistAlbum } from '../../../api/artist'
import { formatDate, scrollInto } from '../../../utils'

export default {
  data () {
    return {
      hotAlbums: [],
      formatDate,
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  methods: {
    async getArtistAlbum () {
      const { data } = await getArtistAlbum({
        id: this.$route.params.id,
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize
      })
      console.log(data.artist.albumSize)
      this.hotAlbums = data.hotAlbums
      this.total = data.artist.albumSize
    },
    onPageChange (page) {
      this.currentPage = page
      this.getArtistAlbum()
      this.$nextTick(() => {
        scrollInto(this.$refs.albums)
      })
    },
    goAlbum (item) {
      this.$router.push(`/album/${item.id}`)
    }
  },
  created () {
    this.getArtistAlbum()
  },
  components: { }
}
</script>

<style lang="scss" scoped>
.content-wrap {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .album-card {
    width: calc(20% - 24px);
    margin: 12px;
    .img-wrap {
      width: 100%;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin: 10px 0;
      font-size: 14px;
      color: var(--font-color-white);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .publishTime {
      font-size: 12px;
      color: var(--font-color-grey);
    }
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>

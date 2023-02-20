<template>
  <div v-if="mvs.length !== 0">
    <div class="content-wrap">
    <div
      class="album-card"
      v-for="(item, index) in mvs"
      :key="index"
      @click="goMv(item.id)"
    >
      <div class="img-wrap">
        <img :src="item.imgurl" />
      </div>
      <p class="name">{{item.name}}</p>
    </div>
  </div>
</div>
</template>

<script>
import { getArtistMv } from '../../../api/artist'

export default {
  data () {
    return {
      mvs: []
    }
  },
  methods: {
    async getArtistMv () {
      const { data } = await getArtistMv(this.$route.params.id)
      this.mvs = data.mvs
    },
    goMv (id) {
      this.$router.push(`/mv/${id}`)
    }
  },
  created () {
    this.getArtistMv()
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
  }
}
</style>

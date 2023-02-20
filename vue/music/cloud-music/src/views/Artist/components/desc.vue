<template>
  <div class="desc">
    <div class="header">
      <i class="icon">&nbsp;&nbsp;</i>
      <p>艺人简介</p>
    </div>
    <p class="content">{{desc.briefDesc}}</p>
  </div>
</template>

<script>
import { getArtistDesc } from '../../../api/artist'

export default {
  data () {
    return {
      desc: {}
    }
  },
  methods: {
    async getArtistDesc () {
      const { data } = await getArtistDesc(this.$route.params.id)
      console.log(data)
      this.desc = data
    }
  },
  created () {
    this.getArtistDesc()
  },
  components: { }
}
</script>

<style lang="scss" scoped>
.desc {
  margin-top: 10px;
  .header {
    display: flex;
    margin-bottom: 10px;
    .icon {
      height: 14px;
      width: 3px;
      margin-right: 7px;
      background: #c10d0c;
    }
    p {
      font-size: 14px;
      font-weight: bold;
      color: var(--font-color-white);
    }
  }
  .content {
    line-height: 25px;
    text-indent: 2em;
  }
}
</style>

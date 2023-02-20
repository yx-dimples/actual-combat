<template>
  <div class="search-music">
    <WithPagination
      :getData="getSearch"
      :getDataParams="searchParams"
      :limit="30"
      :scrollTarget="searchRoot.$refs && searchRoot.$refs.header"
      :total="songCount"
      @getDataSuccess="onGetSearch"
    />
    <div class="list">
      <Table :list="songs" />
    </div>
  </div>
</template>

<script>
import WithPagination from '../../components/WithPagination.vue'
import { getSearch } from '../../api/search'
import Table from '../../components/Table.vue'

export default {
  data () {
    return {
      songCount: 0,
      songs: []
    }
  },
  inject: ['searchRoot'],
  methods: {
    onGetSearch (result) {
      const { songs, songCount } = result
      this.songCount = songCount
      this.songs = songs
    }
  },
  created () {
    this.getSearch = getSearch
  },
  computed: {
    keywords () {
      return this.searchRoot.keywords
    },
    searchParams () {
      return { keywords: this.keywords }
    }
  },
  components: { WithPagination, Table }
}
</script>

<style lang="scss" scoped></style>

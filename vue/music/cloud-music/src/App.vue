<template>
  <div id="app">
    <Layout />
    <Player />
    <PlayList />
    <PlayingSongDetail v-show="isPlayerShow" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Layout from './components/Layout'
import Player from './components/PLayer'
import PlayList from './components/PLayer/PlayList.vue'
import PlayingSongDetail from './components/PLayer/PlayingSongDetail.vue'

export default {
  components: {
    Layout,
    Player,
    PlayList,
    PlayingSongDetail
  },
  computed: {
    ...mapGetters(['isPlayerShow'])
  }
}

</script>

<style lang="scss" scoped>
#app {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: 12px;
  color: var(--font-color);
}
</style>

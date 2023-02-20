<template>
  <div class="main_table t_btn2">
    <el-table
      :header-cell-style="{ backgroundColor: 'transparent' }"
      style="width: 100%"
      :data="list"
      stripe
      :row-class-name="tableRowClassName"
      empty-text="数据加载中~"
      @row-dblclick="playMusic"
    >
      <el-table-column width="50">
        <template v-slot="scope">
          <a href="javascript:;" v-if="scope.row.id === nowSongDetail.id">
            <svg-icon :icon-class="isPlaying ? 'volume' : 'mute'"/>
          </a>
        <span v-else>{{scope.row.index}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template v-slot="scope">
          <div class="icons">
            <a @click="likeSong(scope.row)">
              <svg-icon
                :icon-class="icons(scope)"
              />
            </a>
            <i class="el-icon-plus" title="添加到播放列表" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌曲名称">
        <template v-slot="scope">
          <span class="name">{{ scope.row.name }}</span>
          <el-tag type="danger" effect="plain" v-if="scope.row.fee === 1" size="mini">vip</el-tag>
          <el-tag type="danger" effect="plain" v-if="scope.row.mv !== 0" size="mini" @click="goMV(scope.row.mv)">mv</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="80">
        <template v-slot="scope">
          {{ formatDuration(scope.row.dt) }}
        </template>
      </el-table-column>
      <el-table-column label="歌手">
        <template v-slot="scope">
          <div @click="goArtist(scope.row)" class="artist">{{ scope.row.ar[0].name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="专辑">
        <template v-slot="scope">
          {{ scope.row.al.name }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatIndex, formatDuration } from '../utils'
import { checkMusic, getSongUrl } from '../api/song'
import { mapGetters, mapActions } from 'vuex'
import '../style/element-overwrite.scss'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return { formatIndex, formatDuration }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
      if (rowIndex % 2 !== 0) {
        return 'rowEven'
      }
    },
    async playMusic (song) {
      await checkMusic(song.id).then(async () => {
        await getSongUrl(song.id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        // 更新播放状态
        this.CHANGE_PLAY_STATE(true)
        // 保存当前歌曲详情
        this.SAVE_SONG_DETAIL(song)
        // 添加到播放列表
        this.ADD_PLATING_LIST(song)
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    icons (scope) {
      return this.likeSongIds.indexOf(scope.row.id) !== -1 ? 'like' : 'liking'
    },
    // 点击喜欢按钮事件
    likeSong (song) {
      this.$emit('updateSonglist')
    },
    goMV (id) {
      this.$router.push(`/mv/${id}`)
    },
    goArtist (item) {
      this.$router.push(`/artist/${item.id}`)
    },
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE']),
    ...mapActions('music', ['SAVE_SONG_DETAIL', 'ADD_PLATING_LIST'])
  },
  created () {
  },
  computed: {
    ...mapGetters(['likeSongIds', 'isLogin', 'isPlaying', 'nowSongDetail'])
  }
}
</script>

<style scoped lang="scss">
a {
  color: var(--font-color);
}
.icons {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    padding: 0 10px;
  }
}
.name {
  margin-right: 5px;
}
.el-tag:last-of-type {
  margin-left: 5px;
}
.artist {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>

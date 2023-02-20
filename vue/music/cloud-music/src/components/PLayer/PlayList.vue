<template>
  <Togger
    :reserveDoms="reserveDoms"
    :show="isPlaylistShow"
    @update:show="SET_PLAYLIST_SHOW(false)"
  >
    <div class="playlist" v-if="isPlaylistShow" >
      <Tabs
        v-model="activeTab"
        align="center"
        :tabs="tabs"
      />
      <template v-if="activeTab === 0">
        <div class="header">
        <p>总共{{playingList.length}}首</p>
        <div class="remove" v-if="playingList.length !== 0" @click="remove">
          <i class="el-icon-delete"/>
          <span>清空</span>
        </div>
      </div>
        <template>
        <div class="song-table-wrap" v-if="playingList.length !== 0">
          <el-table
            size="mibi"
            :data="playingList"
            style="width: 100%"
            :show-header="false"
            :row-class-name="tableRowClassName"
            @row-dblclick="playSongClick"
            empty-text="暂无记录"
          >
            <el-table-column width="50">
              <template v-slot="scope">
                <a href="javascript:;" v-if="scope.row.id === nowSongDetail.id">
                  <svg-icon :icon-class="isPlaying ? 'volume' : 'mute'"/>
                </a>
                <span v-else>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="歌曲" :show-overflow-tooltip="true" width="100" />
            <el-table-column prop="ar[0].name" label="歌手" :show-overflow-tooltip="true" width="100">
              <template v-slot="scope">
                <span>{{scope.row.ar[0].name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长">
              <template v-slot="scope">
                <span>{{formatDuration(scope.row.dt)}}</span>
              </template>
            </el-table-column>
              <el-table-column width="60">
              <template v-slot="scope">
                <i class="el-icon-close" @click="deleteSong(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="empty">你还没有添加任何歌曲</div>
      </template>
      </template>

      <template v-if="activeTab === 1">
        <div class="header">
        <p>总共{{historyPlay.length}}首</p>
        <div class="remove" v-if="historyPlay.length !== 0" @click="removeAllHistory">
          <i class="el-icon-delete"/>
          <span>清空</span>
        </div>
      </div>
        <template>
        <div class="song-table-wrap" v-if="historyPlay.length !== 0">
          <el-table
            size="mibi"
            :data="historyPlay"
            style="width: 100%"
            :show-header="false"
            :row-class-name="tableRowClassName"
            @row-dblclick="playSongClick"
            empty-text="暂无记录"
          >
            <el-table-column width="50">
              <template v-slot="scope">
                <a href="javascript:;" v-if="scope.row.id === nowSongDetail.id">
                  <svg-icon :icon-class="isPlaying ? 'volume' : 'mute'"/>
                </a>
                <span v-else>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="歌曲" :show-overflow-tooltip="true" width="100" />
            <el-table-column prop="ar[0].name" label="歌手" :show-overflow-tooltip="true" width="100">
              <template v-slot="scope">
                <span>{{scope.row.ar[0].name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长">
              <template v-slot="scope">
                <span>{{formatDuration(scope.row.dt)}}</span>
              </template>
            </el-table-column>
              <el-table-column width="60">
              <template v-slot="scope">
                <i class="el-icon-close" @click="deleteHistory(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="empty">暂无记录</div>
      </template>
      </template>
    </div>
  </Togger>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Togger from '../Togger.vue'
import Tabs from '../Tabs.vue'
import { formatDuration } from '../../utils'
import { checkMusic, getSongUrl } from '../../api/song'

export default {
  name: 'playlist',
  data () {
    this.tabs = ['播放列表', '历史记录']
    this.LIST_TAB = 0

    return {
      reserveDoms: null,
      activeTab: this.LIST_TAB,
      formatDuration
    }
  },
  components: { Togger, Tabs },
  computed: {
    isPlaylist () {
      return this.activeTab === this.LIST_TAB
    },
    ...mapGetters(['isPlaylistShow', 'playingList', 'historyPlay', 'nowSongDetail', 'isPlaying'])
  },
  methods: {
    // 清空播放列表
    remove () {
      this.DELETE_All()
    },
    // 清空播放历史记录
    removeAllHistory () {
      this.DELETE_All_HISTORY()
    },
    // 实现当前播放歌曲行显示小喇叭
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex
      if (rowIndex % 2 !== 0) {
        return 'rowEven'
      }
    },
    // 播放列表双击播放歌曲
    async playSongClick (song) {
      await checkMusic(song.id).then(async () => {
        // 获取歌曲url
        await getSongUrl(song.id).then(res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        // 更新播放状态
        this.CHANGE_PLAY_STATE(true)
        // 保存当前歌曲详情
        this.SAVE_SONG_DETAIL(song)
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
        this.DELETE_SONG(song.id)
      })
    },
    // 删除播放列表单曲
    deleteSong (song) {
      this.DELETE_SONG(song.id)
    },
    // 删除历史记录单曲
    deleteHistory (song) {
      this.DELETE_HISTORY(song.id)
    },
    ...mapActions('common', ['SET_PLAYLIST_SHOW', 'SAVE_SONG_URL', 'CHANGE_PLAY_STATE']),
    ...mapActions('music', ['SAVE_SONG_DETAIL', 'DELETE_SONG', 'DELETE_All', 'DELETE_HISTORY', 'DELETE_All_HISTORY'])
  },
  mounted () {
    this.reserveDoms = [document.getElementById('player')]
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/element-overwrite.scss';
@import '../../style/variables.scss';

.playlist {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  background-color: var(--playlist-bgcolor);
  z-index: 1001;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  @include el-table-theme(var(--playlist-bgcolor));
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin: 0 20px;
    border-bottom: 1px solid var(--border);
    p {
      font-size: $font-size-sm;
    }
    .remove {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: $font-size-sm;
      span {
        display: inline-block;
        margin-left: 4px;
      }
    }
  }
  .song-table-wrap {
    flex: 1;
    overflow-y: auto;
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}
a {
  color: var(--font-color);
}
</style>

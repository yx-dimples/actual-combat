<template>
  <div>
    <div class="btns">
      <el-button size="mini" class="play" @click="play">
        <svg-icon icon-class="play" />
        播放全部
      </el-button>
      <el-button
        size="mini"
        icon="el-icon-folder-add"
        class="folder"
        @click="addVisible = true"
      >收藏热门&nbsp;{{songs.length}}</el-button>
    </div>
    <div class="music-list">
      <Table ref="musicList" :list="songs" />
    </div>
    <el-dialog
      title="添加到歌单"
      :visible.sync="addVisible"
      width="480px"
      :before-close="handleAddClose"
    >
      <div class="favgd">
        <i class="el-icon-circle-plus-outline" @click="createPlaylistName"></i>
        &nbsp;新歌单
      </div>

      <ul>
        <li
          v-for="(item, index) in createdSongList"
          :key="index"
          @click="clickPlayList(item)"
        >
          <img :src="item.coverImgUrl" />
          <div>
            <p class="name">{{item.name}}</p>
            <p class="track-count">{{item.trackCount}}首</p>
          </div>
        </li>
      </ul>
    </el-dialog>
    <el-dialog
      title="新建歌单"
      :visible.sync="createVisible"
      width="480px"
      :before-close="handleCreateClose"
    >
      <el-form ref="form" size="small" label-width="80px">
        <el-form-item label="歌单名：" prop="name">
          <el-input
            v-model="ruleForm.name"
            @focus="ruleForm.isNameError = false"
            @input="registerVaild"
          />
          <div class="error-message" v-if="ruleForm.isNameError">
            <svg-icon icon-class="error" />
            <span>&nbsp;&nbsp;歌单名不能包含字符“@”和“#”！</span>
            <span class="color-red">{{ruleForm.errMessage}}</span>
          </div>
          <div class="txt">
            可通过“收藏”将音乐添加到新歌单中
          </div>
        </el-form-item>
        <el-form-item class="buttons">
          <el-button size="small" type="primary" @click="createPlaylist">立即创建</el-button>
          <el-button size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Table from '../../../components/Table.vue'
import { getArtists } from '../../../api/artist'
import { checkMusic, getSongUrl } from '../../../api/song'
import { userPlaylist } from '../../../api/user'
import { createPlayList, tracksPlayList } from '../../../api/playlist'

export default {
  data () {
    return {
      songs: [],
      addVisible: false,
      createVisible: false,
      createdSongList: [],
      ruleForm: {
        name: '',
        isNameError: false,
        errMessage: ''
      },
      trackIds: ''
    }
  },
  methods: {
    async getArtists () {
      const { data } = await getArtists(this.$route.params.id)
      this.songs = data.hotSongs
      this.trackIds = data.hotSongs.map(({ id }) => id)
    },
    async play () {
      this.Add_ALL_SONG(this.songs)
      await checkMusic(this.songs[0].id).then(async () => {
        await getSongUrl(this.songs[0].id).then(async res => {
          this.SAVE_SONG_URL(res.data.data[0].url)
        })
        this.CHANGE_PLAY_STATE(true)
        this.SAVE_SONG_DETAIL(this.songs[0])
      }).catch(() => {
        this.$message({
          message: '暂时无法播放，换首试试',
          type: 'warning',
          center: true
        })
      })
    },
    createPlaylistName () {
      this.addVisible = false
      this.createVisible = true
    },
    clickPlayList (item) {
      this.tracksPlayList(item.id)
    },
    async createPlaylist () {
      if (!this.ruleForm.name) {
        this.$message.error('请输入歌单名字')
      }
      await createPlayList({
        name: this.ruleForm.name
      }).then(res => {
        if (res.data.code === 200) {
          this.tracksPlayList(res.data.id)
        }
      }).catch(() => {
        this.$message.error('创建歌单失败')
      })
    },
    async tracksPlayList (id) {
      console.log(String(this.trackIds))
      await tracksPlayList({
        op: 'add',
        tracks: String(this.trackIds),
        pid: id
      }).then(res => {
        console.log(res)
        if (res.data.status === 200) {
          this.$message({
            message: '收藏成功',
            type: 'success',
            center: true
          })
          this.addVisible = false
          this.createVisible = false
        }
      }).catch(() => {
        this.$message.error('添加歌曲到歌单失败')
      })
    },
    handleAddClose (done) {
      done()
    },
    handleCreateClose (done) {
      done()
    },
    registerVaild () {
      if (
        /[^@# ]/.test(
          this.ruleForm.name
        )
      ) {
        this.ruleForm.isNameError = false
      } else {
        this.ruleForm.isNameError = true
      }
    },
    ...mapActions('music', ['Add_ALL_SONG', 'SAVE_SONG_DETAIL']),
    ...mapActions('common', ['SAVE_SONG_URL', 'CHANGE_PLAY_STATE'])
  },
  async created () {
    this.getArtists()
    const { data: { playlist } } = await userPlaylist({
      uid: this.userInfo.profile.userId
    })
    const collectIndex = playlist.findIndex(item =>
      item.creator.userId !== this.userInfo.profile.userId
    )
    this.createdSongList = playlist.slice(0, collectIndex)
  },
  components: { Table },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.btns {
  margin-top: 10px;
  .play {
    background: #517eaf;
    color: #fff;
    border: none;
    border-radius: 100px;
  }
  .folder {
    background: none;
    border: 1px solid var(--font-color-grey2);
    color: var(--font-color);
    border-radius: 100px;
  }
}
.music-list {
  margin-top: 20px;
}
/deep/ .el-dialog__title {
  color: var(--font-color);
  font-size: 14px;
}
/deep/ .el-dialog__body {
  padding: 0;
}
.favgd {
  background: #e6e6e6;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 12px;
  padding: 6px 35px;
  i {
    color: #333;
    font-size: 35px;
  }
}

ul {
  padding-bottom: 20px;
  li {
    padding: 6px 35px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    line-height: 1.5;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .track-count {
      color: var(--font-color-grey);
    }
  }
}
.el-form-item {
  padding: 6px 35px;
  /deep/ .el-form-item__label {
    color: var(--font-color);
  }
  /deep/ .el-input__inner {
    border: 1px solid #cdcdcd !important;
    background: none !important;
    width: 100%;
  }
}
.txt {
  color: var(--font-color-grey);
  font-size: 12px;
}
.error-message {
  font-size: 12px;
  color: $theme-color;
}
.color-red {
  color: $theme-color;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  /deep/ .el-button--primary {
    background-color: #409EFF !important;
    border-color: #409EFF !important;
    margin-right: 10px;
  }
}
</style>

<template>
  <div class="comment">
    <div class="title-wrap">
      <p>评论</p>
      <p>共{{total}}条评论</p>
    </div>
    <div class="text-input">
      <el-input
        type="textarea"
        maxlength="100"
        rows="3"
        show-word-limit
        ref="commentContent"
        v-model.trim="content"
        :placeholder="placeholder"
        @blur="textareaBlur"
      />
      <el-button
        round
        type="primary"
        size="mini"
        icon="el-icon-position"
        class="el-btn"
        @click="submitComment"
      >发送评论</el-button>
    </div>
    <template v-if="total">
      <div class="block">
        <p class="title">精彩评论</p>
        <div class="list" v-for="(item, index) in hotComments" :key="index">
          <div>
            <img :src="item.user.avatarUrl" width="50px" />
          </div>
          <div class="content">
            <p class="comment-text">
              <span class="username">{{item.user.nickname}}：</span>
              <span class="text">{{item.content}}</span>
            </p>
            <div class="replied" v-if="item.beReplied.length">
              <p class="comment-text">
                <span class="username">{{item.beReplied[0].user.nickname}}：</span>
                <span class="text">{{item.beReplied[0].content}}</span>
              </p>
            </div>
            <div class="bottom">
              <span class="date">{{formatDate(item.time, 'yyyy-MM-dd')}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="block">
        <p class="title" ref="commentTitle">最新评论</p>
        <div class="list" v-for="(item, index) in comments" :key="index">
          <div>
            <img :src="item.user.avatarUrl" width="50px" />
          </div>
          <div class="content">
            <p class="comment-text">
              <span class="username">{{item.user.nickname}}：</span>
              <span class="text">{{item.content}}</span>
            </p>
            <div class="replied" v-if="item.beReplied.length">
              <p class="comment-text">
                <span class="username">{{item.beReplied[0].user.nickname}}：</span>
                <span class="text">{{item.beReplied[0].content}}</span>
              </p>
            </div>
            <div class="bottom">
              <span class="date">{{formatDate(item.time, 'yyyy-MM-dd')}}</span>
            </div>
          </div>
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
      >
      </el-pagination>
    </template>
  </div>
</template>

<script>
import { formatDate, scrollInto } from '../utils'
import { getMvComment, getVideoComment, comment, getAlbumComment, getMusicComment, getPlaylistComment } from '../api/comment'
import { mapGetters } from 'vuex'

const MUSIC_TYPE = 'music'
const MV_TYPE = 'mv'
const VIDEO_TYPE = 'video'
const ALBUM_TYPE = 'album'
const PLAYLIST_TYPE = 'playlist'

export default {
  props: {
    id: {
      type: [String, Number],
      require: true
    },
    type: {
      type: String,
      default: MUSIC_TYPE
    }
  },
  data () {
    return {
      loading: false,
      currentPage: 1,
      hotComments: [],
      comments: [],
      total: 0,
      pageSize: 20,
      formatDate,
      placeholder: '请输入内容',
      content: '',
      submitType: 1 // 评论提交类型 1是发送，2回复
    }
  },
  methods: {
    async getComment () {
      const commentRequestMap = {
        [MV_TYPE]: getMvComment,
        [VIDEO_TYPE]: getVideoComment,
        [ALBUM_TYPE]: getAlbumComment,
        [MUSIC_TYPE]: getMusicComment,
        [PLAYLIST_TYPE]: getPlaylistComment
      }
      const commentRequest = commentRequestMap[this.type]

      const { data: { hotComments, total, comments } } = await commentRequest({
        id: this.id,
        pageSize: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize
      })

      this.hotComments = hotComments
      this.total = total
      this.comments = comments
    },
    async onPageChange () {
      await this.getComment()
      this.$nextTick(() => {
        scrollInto(this.$refs.commentTitle)
      })
    },
    // 发送评论
    textareaBlur () {
      if (this.content.trim() === '') {
        this.placeholder = '请输入内容'
        this.submitType = 1
      }
    },
    submitComment () {
      if (!this.isLogin) {
        this.$message({
          type: 'warning',
          message: '登录后评论',
          showClose: true,
          center: true
        })
      } else {
        if (this.content.trim() === '') {
          this.$message({
            type: 'warning',
            message: '评论失败，内容不能为空',
            showClose: true,
            center: true
          })
        } else {
          if (this.submitType === 1) {
            this.sendComment()
          }
        }
      }
    },
    async sendComment () {
      let key
      switch (this.type) {
        case 'video':
          key = 5
          break
        case 'song':
          key = 1
          break
        case 'album':
          key = 3
          break
        case 'music':
          key = 0
          break
        case 'playlist':
          key = 2
          break
      }
      await comment({
        id: this.id,
        content: this.content,
        type: key,
        t: this.submitType
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.content = ''
          this.$message({
            type: 'success',
            message: '评论成功',
            center: true
          })
        } else {
          this.$message.error('评论失败,请刷新后重试!')
        }
      }).catch(() => {
        this.$message.error('评论失败,请刷新后重试!')
      })
    }
  },
  watch: {
    id: {
      handler (newId) {
        if (newId) {
          this.currentPage = 1
          this.getComment()
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.comment {
  .title-wrap {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(211, 58, 49);
    p:first-of-type {
      font-size: 20px;
      margin-right: 15px;
    }
  }
  .text-input {
    text-align: right;
    .el-btn {
      margin-top: 10px;
    }
  }
  .block {
    margin-bottom: 24px;
    .title {
      font-weight: bolder;
      border-bottom: 1px solid var(--border);
      line-height: 24px;
      margin-bottom: 10px;
    }
    .list {
      padding: 15px 0;
      border-bottom: 1px dotted var(--border);
      display: flex;
      &:last-of-type {
        border: none;
      }
      .content {
        margin-left: 10px;
        .comment-text {
          .username {
            display: inline-block;
            margin-right: 4px;
            color: #517eaf;
          }
          .text {
            line-height: 1.5;
          }
        }
        .replied {
          padding: 8px;
          margin-top: 8px;
          background: var(--song-shallow-grey-bg);
          border-radius: 4px;
        }
        .bottom {
          margin-top: 15px;
          .date {
            color: var(--font-color-grey-shallow);
          }
        }
      }
    }
  }
  .el-pagination {
    text-align: right;
  }
}
</style>

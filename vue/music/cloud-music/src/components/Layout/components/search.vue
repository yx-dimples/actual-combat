<template>
  <div class="search">
    <el-input
      placeholder="搜索"
      @click.native="onClickInput"
      @input="onInput"
      @keypress.native.enter="onEnterPress"
      ref="input"
      v-model.trim="searchKeyword"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <Togger
      :reserveDoms="[$refs.input && $refs.input.$el]"
      :show.sync="searchPanelShow"
    >
      <div class="search-panel" v-show="searchPanelShow">
        <div class="search-suggest">
          <div class="suggest-item">
            <div class="title"></div>
            <ul class="list">
              <li class="item"></li>
            </ul>
          </div>
        </div>
        <div class="search-hots">
          <div class="block">
            <p class="title">热门搜索</p>
            <div class="tags">
              <el-button
                v-for="(hot, index) in  searchHots"
                :key="index"
                size="mini"
                @click="onClickHot(hot)"
              >{{hot.first}}</el-button>
            </div>
          </div>
          <div class="block">
            <div class="search-history">
              <p class="title">搜索历史</p>
              <p class="del" @click="allDelHistory">清空</p>
            </div>
            <div class="tags" v-if="searchHistorys.length">
              <div class="history"
                v-for="(history, index) in  searchHistorys"
                :key="index"
              >
                <el-button
                  size="mini"
                  @click="onClickHot(history)"
                >{{history.first}}</el-button>
                <i class="el-icon-close" @click="delHistory" />
              </div>
            </div>
            <div class="empty" v-else>暂无搜索历史</div>
          </div>
        </div>
      </div>
    </Togger>
  </div>
</template>

<script>
import Togger from '../../../components/Togger.vue'
import { getSearchHot, getSearchSuggest } from '../../../api/search'
import { getLocal, setLocal, removeLocal } from '../../../utils'
import { debounce } from 'lodash-es'

const SEARCH_HISTORY_KEY = '__search__history'

export default {
  components: { Togger },
  data () {
    return {
      searchKeyword: '',
      searchPanelShow: false,
      reserveDoms: [],
      searchHots: [],
      searchHistorys: getLocal(SEARCH_HISTORY_KEY) || [],
      suggest: {}
    }
  },
  async created () {
    const { data } = await getSearchHot()
    this.searchHots = data.result.hots
  },
  methods: {
    onClickInput () {
      this.searchPanelShow = true
    },
    onBlur () {
      this.searchPanelShow = false
    },
    onInput: debounce(async value => {
      if (!value.trim()) {
        return
      }
      await getSearchSuggest(value).then(res => {
        // this.suggest = result
        console.log(res)
      })
    }, 500),
    onEnterPress () {
      if (this.searchKeyword) {
        this.goSearch(this.searchKeyword)
      }
    },
    onClickHot (hot) {
      const { first } = hot
      this.goSearch(first)
    },
    goSearch (keywords) {
      this.searchHistorys.unshift({ first: keywords })
      // 去重
      const map = new Map()
      this.searchHistorys = this.searchHistorys.filter(key => !map.has(key.first) && map.set(key.first, 1))
      setLocal(SEARCH_HISTORY_KEY, this.searchHistorys)
      this.$router.push(`/search/${keywords}`)
      this.searchPanelShow = false
    },
    // 删除历史数据
    delHistory (index) {
      this.searchHistorys.splice(index, 1)
      setLocal(SEARCH_HISTORY_KEY, this.searchHistorys)
    },
    // 清空历史数据
    allDelHistory () {
      this.$alert('你确认删除所有的历史数据吗？', '提示', {
        confirmButtonText: 'OK',
        callback: () => {
          this.searchHistorys = []
          removeLocal(SEARCH_HISTORY_KEY)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  width: 150px;
  .search-panel {
    position: fixed;
    width: 350px;
    right: 0;
    background-color: var(--search-bgcolor);
    top: 60px;
    bottom: 70px;
    z-index: 1001;
    font-size: 12px;
    overflow-y: auto;
    box-shadow: 0 2px 8px 0 rgba($color: #000, $alpha: 0.2);
    .block {
      padding: 16px 24px;
      .search-history {
        display: flex;
        justify-content: space-between;
        .del {
          color: #1a73e8;
          font-size: 10px;
        }
      }
      .title {
        color: var(--font-color-grey);
        margin-bottom: 16px;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        .history {
          position: relative;
          margin-right: 12px;
        }
        &:hover {
          i {
            opacity: 1;
          }
        }
        .el-icon-close {
          font-size: 10px;
          position: absolute;
          top: -4px;
          right: -4px;
          color: var(--font-color);
          opacity: 0;
          transition: opacity 0.3s;
          transform-origin: center center;
        }
        .el-button {
          background: none;
          border: 1px solid var(--button-border-color);
          color: var(--font-color);
          margin-bottom: 12px;
          // font-size: 12px;
          // padding: 5px 16px;
        }
      }
      .empty {
        color: var(--font-color-grey);
        font-size: 14px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

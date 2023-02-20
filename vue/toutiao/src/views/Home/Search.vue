<template>
  <div class="search">
    <van-nav-bar class="nav-bar-search">
      <template #title>
        <form action="/">
          <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch(searchText)"
            @cancel="onCancel"
            @focus="isResultShow = false"
          />
        </form>
      </template>
    </van-nav-bar>

    <searchResult v-if="isResultShow" :searchText="searchText" />

    <searchSuggestion v-else-if="searchText" :searchText="searchText" />

    <searchHistory
      v-else
      @search="onSearch"
      @delAll="onDelAll"
      :history="searchHistory"
    />

  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSearchHistory } from '../../api'
import searchResult from './compontet/search-result.vue'
import searchSuggestion from './compontet/search-suggestion.vue'
import searchHistory from './compontet/search-history.vue'

export default {
  components: {
    searchResult, searchHistory, searchSuggestion
  },
  setup () {
    const searchText = ref('')
    const isResultShow = ref(false)
    const searchHistory = ref<any>([])
    const router = useRouter()

    const getHistory = () => {
      getSearchHistory().then(res => {
        console.log(res.data.data.keywords)
        searchHistory.value = res.data.data.keywords
      })
    }

    onMounted(() => {
      getHistory()
    })

    const onSearch = (val: string) => {
      console.log(val)
      searchText.value = val
      const index = searchHistory.value.indexOf(searchText)
      if (index !== -1) {
        searchHistory.value.splice(index, 1)
      }
      searchHistory.value.unshift(searchText)
      isResultShow.value = true
    }

    const onDelAll = () => {
      console.log('11111')
    }

    const onCancel = () => router.go(-1)

    return {
      searchText,
      isResultShow,
      searchHistory,
      onSearch,
      onCancel,
      onDelAll
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  /deep/ .van-nav-bar {
    --van-nav-bar-background: #3296fa;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    right: 0;
    .van-icon {
      color: #999;
    }
    .van-nav-bar__title {
      max-width: unset;
    }
    .van-search {
      background: none;
      width: 700px;
      height: 64px;
      border: none;
      .van-search__action {
        color: #fff;
      }
    }
  }
}
</style>

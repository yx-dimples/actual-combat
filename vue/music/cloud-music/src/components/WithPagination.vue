<template>
  <div>
    <slot></slot>
    <el-pagination
      background
      layout="prev, pager, next"
      small
      :total="total"
      :page-size="limit"
      :current-page.sync="currentPage"
      @current-change="onPageChange"
    />
  </div>
</template>

<script>
import { scrollInto } from '../utils'

export default {
  props: {
    getData: {
      type: Function,
      required: true
    },
    getDataParams: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Number,
      default: 10
    },
    scrollTarget: {
      type: HTMLElement
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  created () {
    this.onPageChange()
  },
  methods: {
    async onPageChange () {
      try {
        const { data } = await this.getData({
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          ...this.getDataParams
        })
        this.$emit('getDataSuccess', data)
        // 如果传入了滚动的目标对象 分页后自动滚入
        if (this.scrollTarget) {
          scrollInto(this.scrollTarget)
        }
      } catch (error) {
        this.$emit('getDataError', error)
      }
    }
  },
  watch: {
    getDataParams: {
      deep: true,
      handler () {
        this.currentPage = 1
        this.onPageChange()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 16px;
  text-align: right;
}
</style>

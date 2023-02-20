<template>
  <div class="mv" ref="mv">
    <div class="tabs-wrap">
      <span>地区：</span>
      <Tabs
        :tabs="areaTabs"
        type="split"
        class="tabs"
        v-model="activeAreaTabIndex"
      />
    </div>
    <div class="tabs-wrap">
      <span>类型：</span>
      <Tabs
        :tabs="typeTabs"
        type="split"
        class="tabs"
        v-model="activeTypeTabIndex"
      />
    </div>
    <div class="tabs-wrap">
      <span>排序：</span>
      <Tabs
        :tabs="orderTabs"
        type="split"
        class="tabs"
        v-model="activeOrderTabIndex"
      />
    </div>

    <WithPagination
      :getData="getAllMV"
      :getDataParams="getDataParams"
      :limit="pageSize"
      :scrollTarget="this.$refs && this.$refs.mv"
      :total="total"
      @getDataSuccess="onGetMvs"
    >
      <ul class="list-wrap">
        <li @click="goMv(item)" class="list-item" v-for="item in mvs" :key="item.id">
          <div class="mv-card">
            <div class="img-wrap">
              <img :src="item.cover" />
              <span class="icons">
                <a href="javaScript:;" class="icon-play">
                  <svg-icon icon-class="play" size="30" />
                </a>
              </span>
            </div>
          </div>
          <p class="name">{{item.name}}</p>
          <p class="artistName">{{item.artistName}}</p>
        </li>
      </ul>
    </WithPagination>
  </div>
</template>

<script>
import Tabs from '../../../components/Tabs.vue'
import WithPagination from '../../../components/WithPagination.vue'
import { getAllMV } from '../../../api/mv'
import { isDef } from '../../../utils'

const areaTabs = ['全部', '内地', '港台', '欧美', '日本', '韩国']
const typeTabs = ['全部', '官方版', '原生', '现场版', '网易出品']
const orderTabs = ['上升最快', '最热', '最新']

export default {
  data () {
    return {
      activeAreaTabIndex: 0,
      activeTypeTabIndex: 0,
      activeOrderTabIndex: 0,
      pageSize: 40,
      total: 0,
      mvs: []
    }
  },
  created () {
    this.areaTabs = areaTabs
    this.typeTabs = typeTabs
    this.orderTabs = orderTabs
    this.getAllMV = getAllMV
  },
  methods: {
    onGetMvs ({ data, count }) {
      this.mvs = data
      if (count) {
        this.total = count
      }
    },
    goMv (item) {
      if (isDef(item.id)) {
        this.$router.push(`/mv/${item.id}`)
      }
    }
  },
  computed: {
    getDataParams () {
      return {
        area: this.areaTabs[this.activeAreaTabIndex],
        type: this.typeTabs[this.activeTypeTabIndex],
        order: this.orderTabs[this.activeOrderTabIndex]
      }
    }
  },
  components: { Tabs, WithPagination }
}
</script>

<style lang="scss" scoped>
@import '../../../style/variables.scss';

.mv {
  padding: $page-padding;
  margin: auto;
  .tabs-wrap {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    .tabs {
      font-size: $font-size-sm;
    }
  }
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 10px -12px;
    .list-item {
      width: 25%;
      padding: 10px 12px;
      .mv-card {
        min-width: 140px;
        .img-wrap {
          position: relative;
          width: 100%;
          margin-bottom: 8px;
          overflow: hidden;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
          }
          .icons {
            &:hover {
              a {
                opacity: 1;
              }
            }
            .icon-play {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              color: $theme-color;
              opacity: 0;
              transition: opacity 0.3s;
            }
          }
        }
      }
      .name {
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .artistName {
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--font-color-grey-shallow);
      }
    }
  }
}
</style>

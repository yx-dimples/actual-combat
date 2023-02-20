<template>
  <div class='tags-wrap' v-if="group.length !== 0 || category.length !== 0">
    <div class="group" ref="group" @click="showGroup">
      <span>{{tagTitle}} <i class="el-icon-arrow-down" /></span>
    </div>
    <transition name="el-fade-in">
      <div class="group-wrap" v-show="isShow">
        <div class="group-list">
          <div
            class="group-list-item"
            v-for="(item, index) in group"
            :key="index"
            @click="tagClickA(item, index)">
            <span
              :class="{ active: currentIndexA == index }"
            >{{ item.name }}</span>
          </div>
        </div>
      </div>
    </transition>
    <div class="category">
      <div
        class="category-list"
        v-for="(item, index) in category"
        :key="index"
        :class="{ active: currentIndexH === index }"
        @click="tagClickH(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Array,
      default () {
        return []
      }
    },
    category: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tagTitle: '全部分类',
      isShow: false,
      currentIndexA: null,
      currentIndexH: 0
    }
  },
  methods: {
    showGroup () {
      this.isShow = !this.isShow
    },
    tagClickA (item, index) {
      this.currentIndexA = index
      this.$emit('tagClick', item.id)
      const indexH = this.category.findIndex(e => {
        return e.name === item.name
      })
      this.currentIndexH = indexH
      this.tagTitle = item.name
    },
    tagClickH (item, index) {
      this.currentIndexH = index
      this.$emit('tagClick', item.id)
      const indexA = this.group.findIndex(e => {
        return e.name === item.name
      })
      if (indexA === -1) {
        this.currentIndexA = null
      } else {
        this.currentIndexH = indexA
      }
      this.tagTitle = item.name
    }
  },
  mounted () {
    document.addEventListener('mouseup', e => {
      const group = this.$refs.group
      if (group) {
        if (!group.contains(e.target)) {
          this.isShow = false
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables.scss';

.tags-wrap {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  position: relative;
  span:hover {
    color: $theme-color;
  }
  .group {
    padding: 5px 10px;
    border: 1px solid var(--border);
    border-radius: 5px;
    &:hover {
      border: 1px solid $theme-color;
      color: $theme-color;
    }
  }
  .category {
    width: 70%;
    display: flex;
    justify-content: space-between;
    .category-list {
      padding: 3px 8px;
    }
  }
}
.group-wrap {
  position: absolute;
  top: 40px;
  left: 25px;
  z-index: 99;
  &::before {
    position: absolute;
    top: -30px;
    left: 15px;
    content: "";
    width: 0;
    height: 0;
    border: 15px solid;
    border-left-color: transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: #fff;
  }
  .group-list{
    display: grid;
    justify-content: space-around;
    align-content: space-between;
    grid-template-columns: repeat(4, 24%);
    width: 400px;
    height: 300px;
    background: #fff;
    overflow-y: scroll;
    overflow-x: hidden;
    box-shadow: 0 0 8px 3px #eee;
    .group-list-item {
      padding: 8px 0;
      width: 90px;
      text-align: center;
      span {
        padding: 3px 5px;
      }
    }
  }
}
.active {
  color: $theme-color;
  background: #fdecec;
  border-radius: 4px;
  text-align: center;
}
</style>

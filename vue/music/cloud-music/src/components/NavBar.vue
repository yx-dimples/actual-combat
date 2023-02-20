<template>
  <div class="nav-bar">
    <div
      class="bar-item"
      v-for="(item, index) in tags"
      :key="index"
      :class="index === activeNum ? 'active' : ''"
      @click="tagBarClick(index, item)"
    >
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeNum: 0
    }
  },
  methods: {
    tagBarClick (index, item) {
      if (this.activeNum === index) {
        return false
      }
      this.activeNum = index
      this.$emit('tagBarClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-wrap: wrap;
  .bar-item {
    margin: 4px -2px;
    padding: 6px 10px;
    font-size: 12px;
    text-align: center;
    box-sizing: content-box;
    transform: scale(0.9, 0.9);
    cursor: pointer;
    &:hover {
      color: var(--tab-item-active-color);
    }
  }
  .active {
    color: #d33a31;
    background: var(--shallow-theme-bgcolor);
    border-radius: 11px;
  }
}
</style>

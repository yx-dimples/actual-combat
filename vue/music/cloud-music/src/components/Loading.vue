<template>
  <div
    class="loading"
    element-loading-background="transparent"
    element-loading-spinner="el-icon-loading"
    element-loading-text="载入中"
    v-loading="loading"
    v-show="loading"
  />
</template>

<script>
export default {
  props: ['loading']
}
</script>

<style lang="scss" scoped>
.loading {
  height: 200px;
}
</style>

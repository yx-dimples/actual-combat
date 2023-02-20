<template>
  <div class="nologin-content-footer">
    <div class="left" @click="isLoginBox(0)">
      &lt;&nbsp;&nbsp;其它登录方式</div>
    <div class="right" @click="isLoginBox(1)">没有账号? 免费注册&nbsp;&nbsp;&gt;</div>
  </div>
</template>

<script>
export default {
  props: ['isLoginBox']
}
</script>

<style lang="scss" scoped>
.nologin-content-footer {
  width: 530px;
  height: 48px;
  border-top: 1px solid #c6c6c6;
  background-color: #f7f7f7;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  .left {
    color: #0c72c3;
  }
  .right {
    color: #999;
  }
}
</style>

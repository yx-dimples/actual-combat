<template>
  <div class="setting">
    <NavBar title="系统设置" :leftArrow="true"  />
    <van-cell-group>
      <van-cell title="编辑资料" is-link />
      <van-cell title="账号和隐私设置" is-link />
      <van-cell title="黑名单" is-link />
    </van-cell-group>
    <van-cell-group class="center">
      <van-cell title="清除缓存" value="3.21MB" />
      <van-cell title="字体大小" value="中" />
      <van-cell title="推送通知">
        <template #value>
          <van-switch size="small" v-model="checked" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="检查版本" is-link />
      <van-cell title="关于头条" is-link />
    </van-cell-group>

    <van-button class="logout" @click="logout" block>退出登录</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showDialog } from 'vant'
import { useRouter } from 'vue-router'
import NavBar from '../../components/NavBar.vue'
import { userStore } from '../../store/user'

const checked = ref(true)

const user = userStore()
const router = useRouter()

const logout = () => {
  showDialog({
    title: '确认退出账户吗',
    message: '退出后将清除当前所有用户数据'
  }).then(() => {
    // on close
    user.setUser(null)
    router.push('/home')
  })
}
</script>

<style lang="less" scoped>
.setting {
  .center {
    margin: 10px 0;
  }
  .logout {
    border: none;
    margin-top: 30px;
    color: #d86262;
    height: 105px;
  }
}
</style>

<template>
  <div class="login">
    <NavBar title="登录/注册" :left-arrow="false" />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="user.mobile"
          name="mobile"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
          ref="loginForm"
          maxlength="11"
        >
        <template #left-icon>
          <i class="icon fa-mobile-phone fa" />
        </template>
        </van-field>
        <van-field
          v-model="user.code"
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          maxlength="6"
        >
          <template #left-icon>
            <i class="icon fa fa-lock" />
          </template>
          <template #button>
            <van-count-down
              format="ss s"
              :time="1000 * 60"
              v-if="isCount"
              @finish="isCount = false"
            />
            <van-button
              @click.prevent="onSendCode"
              class="send-code"
              round
              v-else
              block
              size="small" >
              发送验证码
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showFailToast, showLoadingToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { sendCodes, login } from '../api'
import { userStore } from '../store/user'

interface IUserData {
  mobile: string
  code: string
}

const loginForm = ref()

const users = userStore()

const router = useRouter()

const user = reactive<IUserData>({
  mobile: '13438041824',
  code: '246810'
})

const userFormRules = {
  mobile: [
    { required: true, message: '手机号不能为空' },
    { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
  ],
  code: [
    { required: true, message: '验证码不能为空' },
    { pattern: /^\d{6}$/, message: '验证码格式错误' }
  ]
}

const isCount = ref(false)

const onSubmit = () => {
  try {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true
    })
    login(user).then(res => {
      users.setUser(res.data.data)
      showSuccessToast('登录成功')
      router.push('/home')
    })
  } catch (error) {
    showFailToast('登录失败')
  }
}

const onSendCode = async () => {
  try {
    await sendCodes(user.mobile)
    isCount.value = true
  } catch (error: any) {
    let message = ''
    if (error && error.response && error.response.status === 429) {
      message = '发送太频繁了请稍后重试'
    } else if (error.name === 'mobile') {
      message = error.message
    } else if (error.response.status === 404) {
      message = '手机号错误，请重新尝试'
    } else {
      message = '未知错误，请重新尝试'
    }
    showFailToast(message)
  }
}

</script>

<style lang="less" scoped>
.login {
  /deep/ .van-icon {
    color: #fff;
  }
  /deep/ .van-nav-bar__title {
    color: #fff;
  }
  .van-cell-group--inset {
    margin: 0;
  }
  /deep/ .van-field__left-icon {
    line-height: 2;
  }
  .icon {
    font-size: 37px;
    color: #666;
  }
  .send-code {
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    background-color: #ededed;
    color: #666;
  }
}
</style>

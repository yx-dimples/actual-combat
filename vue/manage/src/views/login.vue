<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="login-text">通用后台管理系统</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="55px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username">
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" >
            <template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules  } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { IUserData } from '../types'
import { login } from '../api'
import { setToken, set } from '../utils/local'

const ruleFormRef = ref<FormInstance>()
const router = useRouter()

// 用户名匹配
const validateUsername = (rule: any, value: any, callback: any) => {
  //  请输入4-10位昵称
  const reg = /(^[a-zA-Z0-9]{4,10}$)/
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入4-10位用户名'))
  } else {
    callback()
  }
}
// 密码匹配
const validatePassword = (rule: any, value: any, callback: any) => {
  // 6-12位密码需要包含大小写字母和数字以及特殊符号
  const pass = /^\S*(?=\S{6,12})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!pass.test(value)) {
    callback(new Error('6-12位密码需要包含大小写字母和数字及特殊符号'))
  } else {
    callback()
  }
}

const ruleForm = reactive<IUserData>({
  username: 'admin',
  password: 'JDvip@666'
})

const rules: FormRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      login(ruleForm).then((res: any) => {
        const { status, message, token, username } = res.data
        if (status === 200) {
          setToken(token)
          set('username', username)
          ElMessage({
            message: message,
            type: 'success'
          })
          router.push('/home')
        }
      })
    }
  })
}

</script>

<style lang="less" scoped>
.login {
  position: relative;
  background-image: linear-gradient(to right, #5669aa, #a6c1ee);
  height: 567px;
  width: 100%;
  .login-wrapper {
    background-color: #ffffff;
    width: 460px;
    left: 50%;
    margin-left: -230px;
    border-radius: 5px;
    box-shadow: 0 0 30px rgb(0 0 0 / 10%);
    position: fixed;
    top: 30%;
    .login-text {
      text-align: center;
      padding: 20px 0;
    }
    .el-form {
      padding: 0 20px;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>

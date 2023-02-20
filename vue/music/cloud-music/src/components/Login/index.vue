<template>
  <div class="fixed-box">
    <div class="move-box">
      <div class="header">
        <div>
            {{
              isLoginDialogShow == 0
                ? "登录"
                : isLoginDialogShow == 1
                ? "手机号注册"
                : isLoginDialogShow == 2
                ? "二维码登录"
                : "手机号登录"
            }}
          </div>
          <div @click="isloginDialog">
            <i class="el-icon-close" />
          </div>
      </div>
      <!-- 0 初始界面 -->
      <div class="nologin-content" v-if="isLoginDialogShow === 0">
        <img src="../../assets/obj_w.png" />
        <div class="button-box">
          <el-button size="small" @click="isLoginBox(3)">手机号登录</el-button>
          <el-button size="small" @click="isLoginBox(2)">二维码登录</el-button>
          <el-button size="small" @click="isLoginBox(1)">注册</el-button>
        </div>
      </div>
      <!-- 1 注册 -->
      <div class="nologin-content" v-if="isLoginDialogShow === 1">
        <el-form ref="form" size="small" :model="registerConfig" label-width="80px">
          <el-form-item label="手机号：">
            <el-input
              v-model="registerConfig.phone"
              placeholder="请输入手机号"
              @focus="registerConfig.isPhoneError = false"
              :class="registerConfig.isPhoneError ? 'isPhoneError' : ''"
              max="11"
            />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input
              v-model="registerConfig.password"
              placeholder="请输入密码"
              @focus="registerConfig.isPasswordError = false"
              @input="registerVaild"
              max="20"
              type="password"
              :class="registerConfig.isPasswordError ? 'isPhoneError' : ''"
            />
          </el-form-item>
          <el-form-item >
            <div class="error-message" v-if="registerConfig.isPhoneError">
              <svg-icon class="error" icon-class="error" />
              <span>请输入正确的手机号</span>
            </div>
            <div class="error-message">
              <svg-icon icon-class="success" v-if="!registerConfig.isPasswordBlankError" />
              <svg-icon class="error" icon-class="error" v-else />
               <span> 密码不能包含空格</span>
            </div>
            <div class="error-message">
              <svg-icon icon-class="success" v-if="!registerConfig.isPasswordTwoError" />
              <svg-icon class="error" icon-class="error" v-else />
              <span> 包含字母、数字、符号中至少两种</span>
            </div>
            <div class="error-message">
              <svg-icon icon-class="success" v-if="!registerConfig.isPasswordLengthError" />
              <svg-icon class="error" icon-class="error" v-else />
              <span> 密码长度为8-20位</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="registerConfig.phoneLoginLoading ? true : false"
              type="primary"
              @click="registerLoginSave"
            >{{registerConfig.phoneLoginLoading ? '下一步...' : '下一步'}}</el-button>
          </el-form-item>
        </el-form>
        <Footer :isLoginBox="isLoginBox" :isLoginBoxNum="1" />
      </div>
      <!-- 5 获取验证码 -->
      <div class="nologin-content" v-if="isLoginDialogShow === 5">
        <div class="margin-auto">
          <div class="code_message_warning">
            <p class="phone">
              <span>你的手机号：</span>
              <span class="color_black">
                {{registerConfig.phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2")}}
              </span>
            </p>
            <p class="txt">为了安全，我们会给你发送短信验证码</p>
          </div>
          <div class="code_input_box">
            <input class="code_input"
              @input="nextCodeInput(1, $event)"
              ref="code_input"
              :style="{
                'border-bottom': registerConfig.code1
                    ? '2px solid #B82712'
                    : ''
              }"
              max="1"
              v-model="registerConfig.code1"
            />
            <input class="code_input"
              @input="nextCodeInput(2, $event)"
              ref="code_input"
              :style="{
                'border-bottom': registerConfig.code2
                    ? '2px solid #B82712'
                    : ''
              }"
              max="1"
              v-model="registerConfig.code2"
            />
            <input class="code_input"
              @input="nextCodeInput(3, $event)"
              ref="code_input"
              :style="{
                'border-bottom': registerConfig.code3
                    ? '2px solid #B82712'
                    : ''
              }"
              max="1"
              v-model="registerConfig.code3"
            />
            <input class="code_input"
              @input="nextCodeInput(4, $event)"
              ref="code_input"
              :style="{
                'border-bottom': registerConfig.code1
                    ? '2px solid #B82712'
                    : ''
              }"
              max="1"
              v-model="registerConfig.code4"
            />
          </div>
          <div class="button-box">
            <el-button
              size="small"
              @click="registerLoginCodeSave"
            >{{registerConfig.phoneLoginLoading ? '下一步...' : '下一步'}}</el-button>
          </div>
        </div>
      </div>
      <!-- 2 二维码登录 -->
      <div class="nologin-content" v-if="isLoginDialogShow === 2">
        <div class="margin-auto main-outer">
          <img class="left-img" src="../../assets/obj.png" />
          <div class="right-code">
            <h3>扫码登录</h3>
            <img :src="QRBase64" />
            <div v-if="!codeIsValid">
              <p>二维码已失效</p>
              <el-button
                type="primary"
                size="mini"
                @click="afreshGetQR"
              >立刻刷新</el-button>
            </div>
            <div v-if="codeIsLoading === true">
              <p><i class="el-icon-loading"></i></p>
              <p>登录中...... </p>
            </div>
          </div>
        </div>
        <Footer :isLoginBox="isLoginBox" />
      </div>
      <!-- 3 手机登录 -->
      <div class="nologin-content" v-if="isLoginDialogShow === 3">
        <el-form ref="form" size="small" :model="phoneConfig" label-width="80px">
          <el-form-item label="手机号：">
            <el-input
              v-model="phoneConfig.phone"
              placeholder="请输入手机号"
              @focus="phoneConfig.isPhoneError = false"
              :class="phoneConfig.isPhoneError ? 'isPhoneError' : ''"
              max="11"
            />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input
              v-model="phoneConfig.password"
              placeholder="请输入密码"
              @focus="phoneConfig.isPasswordError = false"
              max="20"
              type="password"
              :class="phoneConfig.isPasswordError ? 'isPhoneError' : ''"
            />
          </el-form-item>
          <el-form-item
            class="error-message"
            v-if="phoneConfig.isPhoneError || phoneConfig.isPasswordError || phoneConfig.showError"
          >
            <svg-icon class="error" icon-class="error" />
            <span class="color-red">{{phoneConfig.errMessage}}</span>
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="phoneConfig.phoneLoginLoading ? true : false"
              type="primary"
              @click="phoneLoginSave"
            >{{phoneConfig.phoneLoginLoading ? '登录...' : '登录'}}</el-button>
          </el-form-item>
        </el-form>
        <Footer :isLoginBox="isLoginBox" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  sentPhone,
  checkPhone,
  cellPhone,
  getLoginQR,
  getLoginQRKey,
  checkStatus,
  getUserAccount,
  registerPhone
} from '../../api/login.js'

import Footer from './Footer.vue'

export default {
  props: {
    isLoginDialogShow: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 注册
      registerConfig: {
        phone: '',
        password: '',
        errMessage: '', // 请输入正确手机号
        showError: false,
        phoneLoginLoading: false,
        isPhoneError: false, // 输入框 手机号
        isPasswordError: false, // 输入框 密码
        isPasswordBlankError: false, // 密码空格报错
        isPasswordTwoError: false, // 数字 字母 符号 两种
        isPasswordLengthError: false, // 8--20位
        code1: null,
        code2: null,
        code3: null,
        code4: null,
        codeCountTimeout: 0
      },
      // 手机号登录
      phoneConfig: {
        phone: '',
        password: '',
        errMessage: '',
        isPhoneError: false,
        isPasswordError: false,
        showError: false,
        phoneLoginLoading: false
      },
      QRBase64: '', // 二维码链接
      codeIsValid: true,
      codeIsLoading: false
    }
  },
  methods: {
    isLoginBox (val) {
      this.SET_CHANGE_LOGIN_DIALOG_SHOW(val)
    },
    isloginDialog () {
      this.isLoginBox(0)
    },
    // 手机登录
    async phoneLoginSave () {
      if (!this.phoneConfig.phone) {
        this.phoneConfig.isPhoneError = true
        this.phoneConfig.errMessage = '请输入手机号码'
      }

      if (!/^1[3456789]\d{9}$/.test(this.phoneConfig.phone)) {
        this.phoneConfig.isPhoneError = true
        this.phoneConfig.errMessage = '请输入正确的手机号'
      }

      if (!this.phoneConfig.password) {
        this.phoneConfig.isPasswordError = true
        this.phoneConfig.errMessage = '请输入密码'
      }

      this.phoneConfig.phoneLoginLoading = true

      const { phone, password } = this.phoneConfig

      await cellPhone({ phone, password }).then(data => {
        this.phoneConfig.phoneLoginLoading = false
        if (data.code !== 200) {
          this.phoneConfig.showError = true
          this.phoneConfig.errMessage = data.message
        }
        this.SAVE_USER_INFO(data.data)
        this.UPDATE_LOGIN(true)
        this.isloginDialog()
      }).catch(() => {
        this.phoneConfig.phoneLoginLoading = false
      })
    },
    // 二维码登录
    async getLoginQRImg () {
      // 获取 key
      const { data: { data: { unikey } } } = await getLoginQRKey()
      this.QRkey = unikey

      // 获取二维码
      const { data: { data: { qrimg } } } = await getLoginQR(this.QRkey)
      this.QRBase64 = qrimg
      // console.log(qrimg)
      // 循环判断二维码是否过期 是否已经登录
      const timer = setInterval(async () => {
        // loginVisible 为 true 时定时器才有效
        // 当 dialog 被删除时 定时器被消除
        if (this.loginVisible === false) {
          clearInterval(timer)
        }
        const { data: { code, cookie } } = await checkStatus(this.QRkey)
        if (code === 800) {
          // 二维码过期
          this.codeIsLoading = false
          clearInterval(timer)
          this.codeIsValid = false
        } else if (code === 802) {
          // 授权登录中
          this.codeIsLoading = true
        } else if (code === 803) {
          this.codeIsLoading = false
          clearInterval(timer)
          const data = await getUserAccount(cookie)
          this.SAVE_USER_INFO(data.data)
          this.UPDATE_LOGIN(true)
          this.isloginDialog()
        }
      }, 3000)
    },
    // 重新获取二维码
    afreshGetQR () {
      this.getLoginQRImg()
      this.codeIsValid = true
    },
    // 注册
    registerVaild () {
      const flag = false
      // 验证空格
      if (/(\s)/.test(this.registerConfig.password.toString())) {
        this.registerConfig.isPasswordBlankError = true
      } else {
        this.registerConfig.isPasswordBlankError = false
      }
      // 验证 数字 字母
      if (
        /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]/.test(
          this.registerConfig.password
        )
      ) {
        this.registerConfig.isPasswordTwoError = false
      } else {
        this.registerConfig.isPasswordTwoError = true
      }
      if (this.registerConfig.password.length < 8) {
        this.registerConfig.isPasswordLengthError = true
      } else {
        this.registerConfig.isPasswordLengthError = false
      }
      if (flag) return false
    },
    async registerLoginSave () {
      if (!this.registerConfig.phone) {
        this.registerConfig.isPhoneError = true
      }
      if (!/^1[3456789]\d{9}$/.test(this.registerConfig.phone)) {
        this.registerConfig.isPhoneError = true
      }
      if (!this.registerConfig.password) {
        this.registerConfig.isPasswordError = true
      }

      if (
        this.registerConfig.isPhoneError ||
        this.registerConfig.isPhoneError ||
        this.registerConfig.isPasswordError ||
        this.registerConfig.isPasswordBlankError ||
        this.registerConfig.isPasswordTwoError ||
        this.registerConfig.isPasswordLengthError
      ) {
        return false
      }

      this.registerConfig.phoneLoginLoading = true
      let captchaSentMessage = false
      await sentPhone({
        phone: this.registerConfig.phone
      }).then((res) => {
        console.log(res)
        this.registerConfig.phoneLoginLoading = false
      }).catch(() => {
        captchaSentMessage = true
        this.registerConfig.phoneLoginLoading = false
      })

      if (captchaSentMessage) {
        return false
      }
      this.isLoginBox(5)
    },
    nextCodeInput (val, e) {
      if (!val) return false
      if (!e.data) return false
      console.log(document.querySelectorAll('.code_input')[val])
    },
    async registerLoginCodeSave () {
      if (
        !this.registerConfig.code1 ||
        !this.registerConfig.code2 ||
        !this.registerConfig.code3 ||
        !this.registerConfig.code4
      ) {
        this.$notify({
          title: '提示',
          message: '请输入验证码',
          type: 'warning',
          duration: 2000
        })
        return false
      }

      this.registerConfig.phoneLoginLoading = true
      // 检测是否注册过
      await checkPhone({ phone: this.registerConfig.phone })
        .then(async data => {
          // let notify
          if (data.exist === 1 && data.code === 200) {
            this.$notify({
              title: '提示',
              message: '手机号已被注册, 请直接登录',
              type: 'warning',
              duration: 0
            })
            this.registerConfig.phoneLoginLoading = false
            this.isLoginBox(3)
          } else {
            this.registerConfig.phoneLoginLoading = false
            // 注册
            const { phone, password, code1, code2, code3, code4 } = this.registerConfig
            await registerPhone({
              phone,
              password,
              captcha: code1 + code2 + code3 + code4
            }).then(data => {
              this.SAVE_USER_INFO(data.data)
              this.UPDATE_LOGIN(true)
            })
          }
        })
    },
    ...mapActions('common', ['SET_CHANGE_LOGIN_DIALOG_SHOW']),
    ...mapActions('user', ['SAVE_USER_INFO', 'UPDATE_LOGIN'])
  },
  created () {
    this.getLoginQRImg()
  },
  components: { Footer }
}
</script>

<style lang="scss" scoped>
.fixed-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  .move-box {
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 5px 16px rgba($color: #000000, $alpha: 0.8);
    position: absolute;
    left: calc(50% - 265px);
    top: calc(50% - 186px);
    width: 530px;
    background-color: #fff;
    .header {
      padding: 0 18px;
      height: 38px;
      line-height: 38px;
      z-index: 10;
      border-bottom: 1px solid #191919;
      background: #2d2d2d;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
    }
    .nologin-content {
      margin-top: 20px;
      box-sizing: content-box;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      img {
        width: 200px;
      }
      .button-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 20px 0 30px 0;
        .el-button {
          width: 220px;
          margin-top: 10px;
          &:first-of-type {
            background-image: linear-gradient(#4da1e0,#1d6ebe);
            border: 1px solid #3984ce;
            color: #fff;
          }
        }
      }
      .error-message {
        span {
          font-size: 12px;
          color: #333;
        }
        .error {
          color: #e33232;
        }
        .color-red {
          color: #e33232;
        }
      }
      .el-button {
        width: 200px;
      }
      .margin-auto {
        .code_message_warning {
          font-size: 12px;
          color: #999;
          .phone {
            color: #666;
            margin-bottom: 10px;
          }
          .color_black {
            color: #333;
          }
        }
        .code_input_box {
            margin: 20px 0;
            display: flex;
            .code_input {
              color: #666;
              transition: all 1s;
              margin: 0 8px;
              border-top: none;
              border-left: none;
              border-right: none;
              width: 40px;
              text-align: center;
              font-size: 24px;
            }
        }
      }
      .main-outer {
        display: flex;
        margin-bottom: 20px;
        .left-img {
          width: 125px;
          height: 220px;
        }
        .right-code {
          margin-left: 25px;
          text-align: center;
          width: 200px;
          h3 {
            font-size: 16px;
            color: #333;
          }
          .el-button {
            width: 80px;
          }
        }
      }
    }
  }
}
.isPhoneError {
  border: 1px solid #f08b8b !important;
  color: #c20c0c !important;
}
</style>

<template>
  <div class="user">
    <!-- 登录前 -->
    <div class="login-trigger" v-if="!userInfo" @click="isloginDialog">
      <i class="el-icon-user-solid user-icon" />
    </div>
    <!-- </div> -->
    <!-- 登录后 -->
    <div class="login-user" v-else>
      <el-dropdown
        @command="(command) => {
          handleCommand(command)
        }"
      >
        <span class="el-dropdown-link">
          <img
            class="avatar"
            :src="userInfo.profile.avatarUrl"
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userPage">个人资料</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 登录框 -->
    <Login v-if="isLoginDialog" :isLoginDialogShow="isLoginDialogShow" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Login from '../../Login'
import { logout } from '../../../api/login'
import { removeLocal } from '../../../utils'

export default {
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    ...mapGetters(['userInfo', 'isLoginDialog', 'isLoginDialogShow']),
    ...mapState('common', [])
  },
  methods: {
    isloginDialog () {
      this.SET_CHANGE_LOGIN_DIALOG()
    },
    handleCommand (command) {
      if (command === 'userPage') {
        this.$router.push(`/user/${this.userInfo.profile.userId}`)
      } else if (command === 'logout') {
        this.$confirm('您确定退出登录吗？', '提示', {
          confirmButtonClass: '确定',
          cancelButtonClass: '取消',
          type: 'warning'
        }).then(async () => {
          await logout().then(() => {
            this.$message({
              showClose: true,
              message: '退出成功',
              type: 'success',
              center: true
            })
            removeLocal('vuex')
            this.$router.go(0)
          })
        })
      }
    },
    ...mapActions('common', ['SET_CHANGE_LOGIN_DIALOG'])
  },
  components: {
    Login
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 16px;
  padding-bottom: 0;
  margin-bottom: 12px;
  .login-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
    .user-icon {
      font-size: 30px;
      color: #4a4a4a;
    }
  }
  .user-name {
    margin-left: 8px;
    font-size: 15px;
    font-weight: 500;
  }
  .login-user {
    display: flex;
    align-items: center;
    cursor: pointer;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>

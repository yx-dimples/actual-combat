<template>
  <div class="mine">
    <van-cell-group v-if="user.user" class="my-info">
      <van-cell>
        <template #icon>
          <van-image
            round
            class="avatar"
            fit="cover"
            :src="userInfo.photo"
          />
        </template>
        <template #title>
          {{ userInfo.name }}
        </template>
        <template #value >
          <van-button size="small" to="/user/profile" round>编辑资料</van-button>
        </template>
      </van-cell>
      <van-grid :border="false">
        <van-grid-item>
          <template #text>
            <div class="count">{{ userInfo.art_count }}</div>
            <div class="text">头条</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="count">{{userInfo.follow_count}}</div>
            <div class="text">关注</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="count">{{ userInfo.fans_count }}</div>
            <div class="text">粉丝</div>
          </template>
        </van-grid-item>
        <van-grid-item>
          <template #text>
            <div class="count">{{ userInfo.like_count }}</div>
            <div class="text">获赞</div>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div class="img-wrap" @click="login">
        <img src="../../assets/unlogin-img.png" alt="" />
      </div>
      <div class="not-login-text">登录/注册</div>
    </div>

    <van-grid :column-num="2">
      <van-grid-item text="收藏">
        <template #icon><van-icon name="star-o" size="40" color="#eb5556" /></template>
      </van-grid-item>
      <van-grid-item text="历史">
        <template #icon><van-icon name="clock-o" size="40" color="#ff9d1d" /></template>
      </van-grid-item>
    </van-grid>

    <van-cell-group class="bottom">
      <van-cell title="消息通知" is-link />
      <van-cell title="实名认证" is-link />
      <van-cell title="系统设置" is-link @click="toPage('setting')" />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userStore } from '../../store/user'
import { getUserInfo } from '../../api'
import { reactive } from 'vue'

interface UserInfo {
  name: string,
  photo: string,
  like_count: number,
  follow_count: number,
  fans_count: number,
  art_count: number
}

const user = userStore()
const router = useRouter()

const login = () => {
  router.push('/login')
}

const userInfo = reactive<UserInfo>({
  name: '',
  photo: '',
  like_count: 0,
  follow_count: 0,
  fans_count: 0,
  art_count: 0
})

const getData = async () => {
  if (user.user) {
    await getUserInfo().then(res => {
      const { name, photo, like_count, follow_count, fans_count, art_count } = res.data.data
      userInfo.name = name
      userInfo.photo = photo
      userInfo.like_count = like_count
      userInfo.follow_count = follow_count
      userInfo.fans_count = fans_count
      userInfo.art_count = art_count
      console.log(userInfo.photo)
    })
  }
}

getData()

const toPage = (type: string) => {
  console.log(type)
  switch (type) {
    case 'setting':
      router.push('/user/setting')
      break
    default:
      break
  }
}

</script>

<style lang="less" scoped>
.mine {
  /deep/ .my-info {
    background: url('../../assets/banner.png');
    // background: none;
    .van-cell {
      background: none;
      padding-left: 32px;
      padding-top: 103px;
      align-items: center;
      padding-bottom: 26px;
      .avatar {
        width: 132px;
        height: 132px;
        border: 1px solid white;
        box-sizing: border-box;
      }
      .van-cell__title {
        color: #fff;
        font-size: 33px;
        margin-left: 26px;
      }
      .van-button {
        color: #666;
        width: 140px;
        height: 40px;
        background: #fff;
      }
    }
    .van-grid-item__content {
      background: none;
    }
    .count {
      color: #fff;
      font-size: 36px;
    }
    .text {
      color: #fff;
      font-size: 22px;
      margin-top: 10px;
    }
  }
  .not-login {
    background: url('../../assets/banner.png') no-repeat;
    background-size: cover;
    .img-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 100px;
      img {
        width: 123px;
        height: 123px;
      }
      // width: 66px;
      // height: 66px;
    }
    .not-login-text {
      margin-top: 10px;
      color: white;
      font-size: 30px;
      text-align: center;
      padding-bottom: 80px;
    }
  }
  /deep/ .van-grid-item__text {
    color: #666;
    font-size: 30px;
  }
  .bottom {
    margin-top: 10px;
  }
}
</style>

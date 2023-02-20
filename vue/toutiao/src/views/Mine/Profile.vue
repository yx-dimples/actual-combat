<template>
  <div class="profile">
    <NavBar
      title="个人信息"
      :leftArrow="true"
      rigthText="保存"
      :onClickRight="onClickRight"
    />

    <van-cell-group>
      <input
        type="file"
        accept="image/*"
        hidden
        ref="imgUpload"
        @change="onFileChange"
      />
      <van-cell center fit="cover" title="头像" is-link @click="imgUpload.click()">
        <template #value>
          <van-image round width="30" height="30" :src="profile.photo" />
        </template>
      </van-cell>
      <van-cell
        title="昵称"
        @click="showUpdateName = true"
        is-link
        :value="profile.name"
      ></van-cell>
      <van-cell title="介绍" is-link />
    </van-cell-group>

    <van-cell-group>
      <van-cell
        title="性别"
        @click="showUpdateGender = true"
        is-link
        :value="profile.gender === 0 ? '男' : '女'"
      ></van-cell>
      <van-cell
        title="生日"
        @click="showUpdateBirthday = true"
        :value="profile.birthday"
        is-link
      />
    </van-cell-group>

    <!-- 修改头像 -->
    <van-popup
      v-model:show="showUpdatePhoto"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updatePhoto
        :file="img"
        @close="showUpdatePhoto = false"
        @update-photo="profile.photo = $event"
      />
    </van-popup>
    <!-- 修改昵称 -->
    <van-popup
      v-model:show="showUpdateName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="update-name">
        <van-nav-bar
          title="昵称"
          left-text="取消"
          right-text="保存"
          @click-left="showUpdateName = false"
          @click-right="onUpdateName"
        />
        <van-field
          v-model="profile.name"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          placeholder="请输入昵称"
          show-word-limit
        />
      </div>
    </van-popup>
    <!-- 修改性别 -->
    <van-popup
      v-model:show="showUpdateGender"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="update-name">
        <van-picker
          title="性别"
          v-model="selectedValues"
          :columns="columns"
          @confirm="onUpdateGender"
          @cancel="showUpdateGender = false"
          @change="onChange"
        />
      </div>
    </van-popup>
    <!-- 修改生日 -->
    <van-popup
      v-model:show="showUpdateBirthday"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-date-picker
        v-model="currentDate"
        title="生日"
        :min-date="minDate"
        :max-date="maxDate"
        @change="showUpdateBirthday = false"
        @confirm="onUpdateBirthday"
      />
    </van-popup>
  </div>
</template>

<script lang="ts" >
import { reactive, ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { showLoadingToast, showFailToast, showSuccessToast } from 'vant'
import { getUserProfile, updateUserProfile } from '../../api'
import NavBar from '../../components/NavBar.vue'
import updatePhoto from './components/update-photo.vue'

interface ProfileItem{
  photo: string
  name: string
  birthday: string
  gender: number | string
}

export default defineComponent({
  components: { NavBar, updatePhoto },
  setup () {
    const router = useRouter()

    const profile = reactive<ProfileItem>({
      photo: '',
      name: '',
      birthday: '',
      gender: 0
    })

    const getData = () => {
      getUserProfile().then(res => {
        const { photo, name, birthday, gender } = res.data.data
        profile.photo = photo
        profile.name = name
        profile.gender = gender
        profile.birthday = birthday
      })
    }
    getData()

    const showUpdateName = ref(false)
    const showUpdateGender = ref(false)
    const showUpdateBirthday = ref(false)
    const showUpdatePhoto = ref(false)
    const selectedValues = ref([profile.gender])
    const imgUpload = ref()
    const img = ref<string | any>(null)

    const columns = [
      { text: '男', value: 0 },
      { text: '女', value: 1 }
    ]

    const year = profile.birthday.length !== 0 ? profile.birthday.split('-')[0] : ''
    const month = profile.birthday.length !== 0 ? profile.birthday.split('-')[1] : ''
    const day = profile.birthday.length !== 0 ? profile.birthday.split('-')[2] : ''

    const currentDate = ref([year, month, day])
    const minDate = ref(new Date(1970, 0, 1))
    const maxDate = ref(new Date())
    const onClickRight = () => {
      console.log(router.go(-1))
    }

    const onFileChange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        img.value = URL.createObjectURL(file)
      }
      showUpdatePhoto.value = true
    }

    const onUpdateName = () => {
      try {
        showLoadingToast({
          message: '保存中...',
          forbidClick: true
        })
        updateUserProfile({
          name: profile.name
        })
        showSuccessToast('修改成功')
        showUpdateName.value = false
      } catch (error: any) {
        showFailToast(error.message)
      }
    }
    const onChange = (value: any) => {
      profile.gender = value.selectedValues.join(',')
    }
    const onUpdateGender = () => {
      try {
        showLoadingToast({
          message: '保存中...',
          forbidClick: true
        })
        updateUserProfile({
          gender: profile.gender
        })
        showSuccessToast('修改成功')
        showUpdateGender.value = false
      } catch (error: any) {
        showFailToast(error.message)
      }
    }
    const onUpdateBirthday = () => {
      try {
        showLoadingToast({
          message: '保存中...',
          forbidClick: true
        })
        var date = Object.values(currentDate.value).join('-')
        updateUserProfile({
          birthday: date
        })
        showSuccessToast('修改成功')
        showUpdateBirthday.value = false
      } catch (error: any) {
        showFailToast(error.message)
      }
    }
    return {
      profile,
      showUpdateName,
      showUpdateGender,
      showUpdateBirthday,
      showUpdatePhoto,
      columns,
      selectedValues,
      currentDate,
      minDate,
      maxDate,
      imgUpload,
      img,
      onClickRight,
      onFileChange,
      onUpdateName,
      onChange,
      onUpdateGender,
      onUpdateBirthday
    }
  }
})

</script>

<style lang="less" scoped>
.profile {
  .van-cell-group {
    &:last-of-type {
      margin-top: 10px;
    }
    .van-cell {
      border-bottom: 1px solid #e8e8e8;
    }
  }
  /deep/ .van-popup {
    background: #f5f7f9;
  }
  .update-name {
    .van-cell {
      width: 96%;
      margin: 2%;
    }
  }
}
</style>

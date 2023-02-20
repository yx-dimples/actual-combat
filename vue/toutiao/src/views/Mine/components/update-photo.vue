<template>
  <div class="photo-show">
    <img :src="file" ref="imgRef" />
    <van-nav-bar
      class="toolbar"
      left-text="关闭"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineEmits } from 'vue'
import { showLoadingToast, showSuccessToast } from 'vant'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { updateUserPhoto } from '../../../api'

const emits = defineEmits(['close', 'update-photo'])

const props = defineProps({
  file: {
    default: '',
    type: String
  }
})

const imgRef = ref<HTMLImageElement>()
const cropperInstance = ref<any>()

const start = () => {
  if (!imgRef.value) {
    return false
  }

  cropperInstance.value = new Cropper(imgRef.value, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 1,
    autoCropArea: 1,
    cropBoxMovable: true,
    cropBoxResizable: true,
    background: false,
    movable: true
  })
}

onMounted(() => {
  start()
})

const onConfirm = async () => {
  showLoadingToast({
    message: '上传中. ..',
    forbidClick: true
  })

  if (!cropperInstance.value) {
    return false
  }

  cropperInstance.value.getCroppedCanvas().toBlob((blob: any) => {
    const formData = new FormData()
    formData.append('photo', blob)
    console.log(typeof formData)
    updateUserPhoto({
      photo: formData
    }).then((res) => {
      showSuccessToast('上传成功')
      emits('close')
      emits('update-photo', res.data.data.photo)
    })
  })
}

// export default defineComponent({
//   setup () {
//     const image = ref()
//     const cropperInstance = ref<Cropper>()

//     const onConfirm = () => {
//       console.log('onConfirm')
//     }

//     onMounted(() => {
//       if (image.value) {
//         return false
//       }
//       cropperInstance.value = new Cropper(image.value, {
//         // aspectRatio: 1
//         viewMode: 1,
//         dragMode: 'move',
//         aspectRatio: 1,
//         autoCropArea: 1,
//         cropBoxMovable: true,
//         cropBoxResizable: true,
//         background: true,
//         movable: true
//       })
//     })
//     console.log(cropperInstance, '1')
//     return {
//       image,
//       onConfirm
//     }
//   }
// })
</script>

<style lang="less" scoped>
.photo-show {
  background-color: #000;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    max-width: 100%;
    height: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 254, 254, 0.959);
  }
  /deep/ .van-nav-bar__content {
    background-color: rgba(247, 247, 247, 0.144);
  }
}
</style>

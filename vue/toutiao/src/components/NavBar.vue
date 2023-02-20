<template>
  <div class="navbar">
    <van-nav-bar
      :title="title"
      :left-arrow="leftArrow"
      :left-text="leftText"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right>
        <span>{{ rigthText }}</span>
        <i class="right-icon" :class="rigthIcon" />
      </template>
      <template></template>
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    leftArrow: {
      type: Boolean
    },
    leftText: {
      type: String
    },
    rigthIcon: {
      type: String
    },
    rigthText: {
      type: String
    }
  },
  setup (props, context) {
    function onClickRight () {
      context.emit('onClickRight')
    }
    const router = useRouter()
    const onClickLeft = () => {
      router.go(-1)
    }

    return {
      onClickLeft,
      onClickRight
    }
  }
})
</script>

<style lang="less" scoped>
.van-nav-bar {
  --van-nav-bar-background: #3296fa;
}
 /deep/ .van-icon {
    color: #fff;
  }
  /deep/ .van-nav-bar__title {
    color: #fff;
  }
  .right-icon {
    color: #fff;
    font-size: 30px;
  }
  /deep/.van-nav-bar__right {
    color: #fff;
  }
</style>

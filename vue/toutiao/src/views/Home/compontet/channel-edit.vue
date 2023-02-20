<template>
  <div class="channel-edit">
    <van-cell title="我的频道">
      <template #value>
        <van-button
          type="danger"
          class="edit"
          @click="isEdit = !isEdit"
          round
          size="small"
          plain
        >
          {{ isEdit ? "完成" : "编辑" }}
        </van-button>
      </template>
    </van-cell>

    <van-grid class="my-channel" :gutter="10">
      <van-grid-item
        v-for="item in myChannels"
        :key="item.id"
        :icon="(isEdit && item.id !== 0) ? 'clear' : ''"
        @click="onUserChannelClick(item)"
      >
        <template #text>
          <span
            class="text"
            :class="{ active: item.id === active }"
          >{{
            item.name
          }}</span>
        </template>
      </van-grid-item>
    </van-grid>

    <van-cell title="频道推荐" class="channels" />
    <van-grid class="recommend" :gutter="10">
      <van-grid-item
        v-for="item in recommendChannels"
        :key="item.id"
        icon='plus'
        :text="item.name"
        @click="onAddChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs, computed, defineEmits } from 'vue'
import { getAllChannels, addUserChannels, delUserChannels } from '../../../api'

interface ChannelsItem {
  id: number
  name: string
}

const props: any = defineProps({
  channels: {
    type: Array
  },
  activeIndex: {
    type: Number
  }
})

const emits: any = defineEmits(['close', 'update-active'])

const isEdit = ref(false)
const allChannels = ref<ChannelsItem[]>([])

const { activeIndex, channels } = toRefs(props)
const myChannels: any = channels.value
const active: any = activeIndex.value

const getData = () => {
  getAllChannels().then(res => {
    allChannels.value = res.data.data.channels
  })
}
getData()
const recommendChannels = computed(() => {
  return allChannels.value.filter(item => {
    return channels.value.findIndex((userItem: any) => {
      return userItem.id === item.id
    }) === -1
  })
})

const onUserChannelClick = (channel: any) => {
  console.log(channel)
  if (isEdit.value && channel.id !== 0) {
    deleteChannel(channel.id, channel)
  } else {
    switchChannel(channel.id)
  }
}

const deleteChannel = async (index: number, channel: any) => {
  const id: number = channel.id
  if (index <= active.value) {
    emits('update-active', active - 1)
  }
  channels.value.splice(index, 1)
  await delUserChannels(id)
}

const switchChannel = (index: number) => {
  emits('update-active', index)
  emits('close')
}

const onAddChannel = async (channel: any) => {
  const id: number = channel.id
  myChannels.push(channel)
  await addUserChannels({
    channels: [
      {
        id,
        seq: channels.value.length
      }
    ]
  })
}

</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 108px;
  .van-cell {
    align-items: center;
    /deep/ .van-cell__title {
      font-size: 32px;
    }
    .edit {
      width: 105px;
    }
  }
  .van-grid {
    margin-top: 40px;
    .van-grid-item {
      width: 160px;
      height: 86px;
    }
    /deep/ .van-grid-item__content {
      white-space: nowrap;
      background: #f4f5f6;
    }
    /deep/ .van-grid-item__text,
    .text {
      font-size: 28px;
      color: #222;
      margin-top: 0;
    }
  }
  .channels {
    margin-top: 80px;
  }
}
/deep/ .my-channel {
  .van-grid-item {
    .van-grid-item__content {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
      .active {
        color: var(--van-red);
      }
    }
  }
}
/deep/.recommend {
  .van-grid-item {
    .van-grid-item__content {
      // background: red;
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
      }
    }
  }
}
</style>

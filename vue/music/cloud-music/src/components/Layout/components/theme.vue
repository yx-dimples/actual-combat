<template>
  <el-popover
    placement="bottom"
    :width="230"
    trigger="click"
  >
    <template #reference>
      <div class="icon-bg">
        <i class="iconfont icon-skin"></i>
      </div>
    </template>
    <div class="themes">
      <div
        :key="index"
        v-for="(item, key, index) in themeMap"
        class="theme-item"
        @click="changeTheme(key)"
      >
        <div :style="item.style" class="theme-icon" />
        <div>{{item.title}}</div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import storage from 'good-storage'
import variables from '../../../style/themes/variables'
import variablesWhite from '../../../style/themes/variables-white'
import variablesRed from '../../../style/themes/variables-red'

const THEME_KEY = '__theme__'

const themes = {
  white: 'white',
  dark: 'dark',
  red: 'red'
}

export default {
  created () {
    this.themeMap = {
      [themes.dark]: {
        title: '深色',
        file: variables,
        style: {
          backgroundColor: '#202020'
        }
      },
      [themes.white]: {
        title: '浅色',
        file: variablesWhite,
        style: {
          backgroundColor: '#F6F6F6',
          border: '1px solid #ebeaea'
        }
      },
      [themes.red]: {
        title: '红色',
        file: variablesRed,
        style: {
          backgroundColor: '#D33A31'
        }
      }
    }
    this.changeTheme(storage.set(THEME_KEY, themes.dark))
  },
  methods: {
    changeTheme (themeKey) {
      storage.set(THEME_KEY, themeKey)
      const theme = this.themeMap[themeKey].file
      // console.log(theme)
      Object.keys(theme).forEach(key => {
        const value = theme[key]
        // console.log(value)
        document.documentElement.style.setProperty(key, value)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .icon-bg {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    &:hover {
      background: var(--round-hover-bgcolor);
    }
    .icon-skin {
      color: var(--header-font-color);
    }
  }
  .themes {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .theme-item {
      margin-right: 20px;
      .theme-icon {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        margin-bottom: 4px;
      }
    }
  }
  </style>

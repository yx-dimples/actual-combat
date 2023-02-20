<template>
  <el-container class="layout">
    <el-header>
      <div class="left">
        <div class="buttons">
          <div class="mac-button red" @click="onClickLogo">
            <i class="el-icon-house icon" />
          </div>
          <div class="mac-button yellow" @click="exitFullscreen">
            <i class="el-icon-minus icon" />
          </div>
          <div class="mac-button green" @click="fullscreen">
             <i class="el-icon-full-screen icon" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="search-wrap">
          <HeaderSerach />
        </div>
        <HeaderTheme />
        <HeaderUser />
      </div>
    </el-header>
    <el-container class="layout-body">
      <el-aside width="250px" class="layout-menu">
        <LayoutMenu />
      </el-aside>
      <el-main class="content" id="page-content">
          <router-view :key="$route.fullPath" :class="routerViewCls" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderSerach from './components/search.vue'
import HeaderTheme from './components/theme.vue'
import HeaderUser from './components/User.vue'
import LayoutMenu from './components/menu.vue'
import { layoutCenterNames } from '../../router'
import { isFullscreen, exitFullscreen, requestFullScreen } from '../../utils'

export default {
  name: 'layout',
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    onClickLogo () {
      this.$router.push('/discovery')
    },
    exitFullscreen () {
      if (isFullscreen) {
        exitFullscreen()
      }
    },
    fullscreen () {
      requestFullScreen(document.documentElement)
    }
  },
  created () {
  },
  components: { HeaderSerach, HeaderTheme, HeaderUser, LayoutMenu },
  computed: {
    routerViewCls () {
      return layoutCenterNames.find(name => name === this.$route.name)
        ? 'router-view-center'
        : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
.layout {
  height: 100%;
  .el-header {
    background-color: var(--header-bgcolor);
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      .buttons {
        display: flex;
        &:hover {
          .mac-button > i {
            opacity: 1;
          }
        }
        .mac-button {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          cursor: pointer;
          margin: 15px 8px 0 0;
          .icon {
            margin: 6px;
            opacity: 0;
            font-weight:  700;
            transition: opacity 0.3s;
            transform-origin: center center;
            font-size: 18px;
          }
          &.red {
            background: #ed655a;
          }
          &.yellow {
            background: #e0c04c;
          }
          &.green {
            background: #72be47;
          }
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .search-wrap {
        margin-right: 16px;
      }
    }
  }
  .layout-body {
    display: flex;
    height: calc(100% - #{$header-height});
    .layout-menu {
      height: calc(100% - #{$mini-player-height});
    }
    .content {
      flex: 1;
      overflow-y: auto;
      min-width: $layout-content-min-width;
      margin-bottom: $mini-player-height;
      .router-view-center {
        max-width: $center-content-max-width;
        margin: auto;
      }
    }
  }
  /deep/ .el-main {
    padding: 10px 20px;
  }
  .el-aside {
    padding: 10px 0;
  }
}
</style>

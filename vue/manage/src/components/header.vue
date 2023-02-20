<template>
  <div>
    <div class="collapse-btn" @click="collapseChage">
      <el-icon v-if="sidebar.collapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
    <div class="text">后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" content="message" placement="bottom">
            <el-icon><Bell /></el-icon>
          </el-tooltip>
          <span class="btn-bell-badge" />
        </div> -->
        <!-- 用户头像 -->
        <!-- <el-avatar size="small" class="user-avator" :src="circleUrl" /> -->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click">
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useSidebarStore } from '../store/sidebar'
import { get } from '../utils/local'

const sidebar = useSidebarStore()

const collapseChage = () => {
  sidebar.handleCollapse()
}

const username: string | void = get('username')

const circleUrl: string | null = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'

onMounted(() => {
  if (document.body.clientWidth < 1500) {
		collapseChage()
	}
})

</script>

<style scoped lang="less">
.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  float: left;
  padding: 24px 21px;
  cursor: pointer;
  line-height: 70px;
}
.text {
  float: left;
  width: 250px;
}
.header-right {
  float: right;
  padding-right: 50px;
  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
    .btn-bell {
      position: relative;
      width: 30px;
      height: 30px;
      text-align: center;
      border-radius: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .btn-bell-badge {
        position: absolute;
        right: 4px;
        top: 0px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
      }
    }
    .user-avator {
      margin-left: 10px;
    }
    .user-name {
      margin-left: 10px;
      .el-dropdown-link {
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .el-dropdown-menu__item {
        text-align: center;
      }
    }
  }
}
</style>

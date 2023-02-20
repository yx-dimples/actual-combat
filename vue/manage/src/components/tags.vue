<template>
  <div class="tags" v-if="tags.show">
    <ul>
      <li
        v-for="(item, index) in tags.list"
        :key="index"
        :class="{ active: isActive(item.path) }"
        class="tags-li"
      >
        <router-link :to="item.path" class="tags-li-title">
          {{ item.title }}
        </router-link>
        <el-icon @click="closeTags(index)"><Close /></el-icon>
      </li>
    </ul>

    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button type="primary" size="small">
          标签选项<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="oll">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <el-button @click="button">11</el-button> -->
  </div>
</template>

<script setup lang="ts">
import { useTagsStore } from "../store/tags";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const isActive = (path: string) => {
  return path === route.fullPath;
};
const tags = useTagsStore();

// 设置标签
const setTags = (route: any) => {
  const isExist = tags.list.some((item) => {
    return item.path === route.fullPath;
  });
  if (!isExist) {
    tags.setTagsItem({
      name: route.name,
      title: route.meta.title,
      path: route.fullPath,
    });
  }
};

setTags(route);
onBeforeRouteUpdate((to) => {
  setTags(to);
});

// 关闭单个标签
const closeTags = (index: number) => {
  const delItem = tags.list[index];
  tags.delTagsItem(index);
  const item = tags.list[index] ? tags.list[index] : tags.list[index - 1];
  if (item) {
    delItem.path === route.fullPath && router.push(item.path);
  } else {
    router.push("/");
  }
};

// 关闭全部标签
const closeAll = () => {
  tags.clearTags();
  router.push("/");
};
// 关闭其他标签
const closeOther = () => {
  const curItem = tags.list.filter((item) => {
    return item.path === route.fullPath;
  });
  tags.closeTagsOther(curItem);
};
const handleTags = (command: string) => {
  command === "other" ? closeOther() : closeAll();
};
</script>

<style scoped lang="less">
.tags {
  display: flex;
  justify-content: space-between;
  height: 30px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 5px 10px #ddd;
  padding: 5px;
  align-items: center;
  ul {
    display: flex;
    .tags-li {
      display: flex;
      align-items: center;
      margin: 3px 5px 2px 3px;
      border-radius: 3px;
      font-size: 12px;
      overflow: hidden;
      cursor: pointer;
      height: 23px;
      border: 1px solid #e9eaec;
      background: #fff;
      padding: 0 5px 0 12px;
      color: #666;
      -webkit-transition: all 0.3s ease-in;
      -moz-transition: all 0.3s ease-in;
      transition: all 0.3s ease-in;
      .tags-li-title {
        text-decoration: none;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
      }
    }
    .tags-li:not(.active):hover {
      background: #f8f8f8;
    }
    .tags-li.active {
      color: #fff;
      background-color: #409eff;
    }
    .tags-li.active .tags-li-title {
      color: #fff;
    }
  }
}
</style>

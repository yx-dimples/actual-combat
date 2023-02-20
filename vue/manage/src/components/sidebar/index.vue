<template>
  <div class="sidebar">
    <el-menu
      :default-active="defaultActive"
      class="sidebar-el-menu"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSidebarStore } from "../../store/sidebar";
import sidebarItem from "./components/sidebarItem.vue";

const router = useRouter();

const route = useRoute();

const routes = computed(() => {
  return router.options.routes;
});

const defaultActive = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.el-menu--collapse {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>

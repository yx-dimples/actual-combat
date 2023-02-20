<template>
  <el-container class="layout">
    <el-header>
      <Header />
    </el-header>
    <el-container>
      <el-aside>
        <Sidebar />
      </el-aside>
      <el-main
        class="content-box"
        :class="{ 'content-collapse': sidebar.collapse }"
      >
        <Tags />
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="move" mode="out-in">
              <keep-alive :include="tags.nameList">
                <component :is="Component"></component>
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "../components/header.vue";
import Sidebar from "../components/sidebar/index.vue";
import Tags from "../components/tags.vue";
import { useSidebarStore } from "../store/sidebar";
import { useTagsStore } from "../store/tags";

@Options({
  components: {
    Header,
    Sidebar,
    Tags,
  },
})
export default class layout extends Vue {
  sidebar = useSidebarStore();
  tags = useTagsStore();
}
</script>

<style lang="less" scoped>
.el-header {
  --el-header-height: 70px;
  --el-header-padding: 0;
  background-color: #242f42;
  line-height: var(--el-header-height);
  color: #fff;
  font-size: 22px;
  box-sizing: border-box;
  position: relative;
  width: 100%;
}
.el-main {
  --el-main-padding: 0;
}
.content-box {
  position: absolute;
  left: 250px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
}

.content {
  width: auto;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  box-sizing: border-box;
}

.content::-webkit-scrollbar {
  width: 0;
}

.content-collapse {
  left: 65px;
}

.container {
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>

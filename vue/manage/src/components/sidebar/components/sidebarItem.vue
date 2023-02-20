<template>
  <div v-if="item.children">
    <template v-if="hasOneShowingChild(item.children, item)">
      <el-menu-item
        :key="onlyOneChild.path"
        :index="onlyOneChild.path"
        :route="onlyOneChild.path"
      >
        <el-icon>
          <i :class="onlyOneChild.meta.icon" class="fa" />
        </el-icon>
        <template #title>{{ onlyOneChild.meta.title }}</template>
      </el-menu-item>
    </template>
    <el-sub-menu v-else :index="item.path" popper-append-to-body>
      <template #title>
        <el-icon>
          <i class="fa" :class="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <div v-for="child in item.children" :key="child.path">
        <el-menu-item :key="child.path" :index="child.path" :route="child.path">
          <template #title>
            <el-icon>
              <i :class="child.meta.icon" class="fa" />
            </el-icon>
            <span>{{ child.meta.title }}</span>
          </template>
        </el-menu-item>
      </div>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
interface childType {
  path: string;
  name?: string;
  component: void;
  meta: {
    title: string;
    icon: string;
    hidden?: boolean;
    [key: string]: any;
  };
}
export default defineComponent({
  name: "SidebarItem",
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNested: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup() {
    // 是否只有一个孩子
    const onlyOneChild = ref();
    // 析构获取 props 属性 basePath

    // methods
    /**
     * @description 展示只有一个孩子的情况
     */
    const hasOneShowingChild = (children: childType[] = [], parent: any) => {
      // RouteRecordRaw 只能在meta中配置额外属性，过滤是否展示路由；
      const showingChildren = children.filter((item) => {
        // 如果meta 配置隐藏该路由，则返回false;
        if (item?.meta?.hidden) {
          return false;
        }
        //
        onlyOneChild.value = item;
        return true;
      });
      // 判断当前路由，是否有孩子children，以及孩子个数；
      if (showingChildren.length === 1) {
        return true;
      }
      // 如果没有孩子，则展示父级路由；
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, noShowingChildren: true };
        return true;
      }
      return false;
    };

    return {
      onlyOneChild,
      hasOneShowingChild,
    };
  },
});
</script>

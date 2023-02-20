<template>
  <div class="menu">
    <div class="menu-wrap">
      <div
        v-for="(menu, index) in menusWithPlaylist"
        :key="index"
        class="menu-block"
      >
      <p class="menu-block-title" v-if="menu.title">{{menu.title}}</p>
      <ul class="menu-list">
        <router-link
          v-for="(item, index) in menu.children"
          :key="index"
          :to="item.path"
          active-class="menu-item-active"
          class="menu-item"
          tag="li"
        >
          <svg-icon :icon-class="item.meta.icon" />
          <span class="menu-title">{{item.meta.title}}</span>
        </router-link>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { menuRoutes } from '../../../router'
import { userPlaylist } from '../../../api/user'

export default {
  data () {
    return {
      menus: [
        {
          type: 'root',
          children: menuRoutes
        }
      ]
    }
  },
  created () {
    console.log(this.menus, '1111')
  },
  methods: {
    async userPlayList () {
      if (!this.isLogin) {
        this.$message.error('请先进行登录操作')
      }

      await userPlaylist({
        uid: this.userInfo.profile.userId
        // timestamp: Date.parse(new Date())
      }).then(res => {
        this.SAVE_USER_PLAYLIST(res.data.playlist)
      })
    },
    ...mapActions('user', ['SAVE_USER_PLAYLIST'])
  },
  computed: {
    menusWithPlaylist () {
      return this.isLogin && this.userMenus.length
        ? this.menus.concat(this.userMenus)
        : this.menus
    },
    ...mapGetters(['userMenus', 'isLogin', 'userInfo'])
  },
  watch: {
    isLogin (current) {
      if (current) {
        this.userPlayList()
      } else {}
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../style/variables.scss';
  .menu {
    width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--menu-bgcolor);
    .menu-wrap {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .menu-block {
        margin-bottom: 16px;
        .menu-block-title {
          font-size: $font-size-sm;
          color: var(--font-color-grey2);
          padding-left: 16px;
          margin-bottom: 8px;
        }
        .menu-list {
          .menu-item {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            padding: 12px 18px;
            cursor: pointer;
            &:hover {
              background: var(--menu-item-hover-bg);
            }
            &-active {
              color: $theme-color;
              background: var(--menu-item-active-bg);
            }
            .menu-title {
              font-size: $font-size-medium-sm;
              margin-left: 8px;
            }
          }
        }
      }
    }
  }

</style>

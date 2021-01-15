<template>
  <div class="menu">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="1" route="/user">
        <span slot="title">用户</span>
      </el-menu-item>
      <el-menu-item index="2" route="/blog">
        <span slot="title">博客</span>
      </el-menu-item>
      <el-menu-item index="3" route="/plan">
        <span slot="title">计划</span>
      </el-menu-item>
      <el-menu-item index="4" route="/itap">
        <span slot="title">兴趣标签</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { Menu, MenuItem } from 'element-ui';

export default {
  name: "blogNav",
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem
  }
};
</script>

<style scoped>
.menu {
    width: 180px;
}
.el-menu-vertical-demo {
    height: 500px;
}
</style>


<template>
  <div id="app">
    <BlogNav></BlogNav>
    <div class="right">
      <router-view/>
    </div>
  </div>
</template>

<script>
import BlogNav from "@/views/BlogNav.vue";

export default {
  components: {
    BlogNav
  }
};
</script>


<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  display: flex;
}
.right {
  flex-grow: 1;
  margin-left: 10px;
}
</style>

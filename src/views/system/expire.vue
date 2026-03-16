<template>
  <div class="expire">
    <img src="../../assets/imgs/expire.png" alt="" />
  </div>
</template>

<script>
export default {
  mounted() {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  methods: {
    goBack() {
      // console.log("点击了浏览器的返回按钮");
      history.pushState(null, null, document.URL);
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.expire {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
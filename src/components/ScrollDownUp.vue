<template>
  <div class="" id="scroll">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    props: ['loadMore', 'bottomDistance'],
    data() {
      return {
        windowHeight: '',
        downT: ''
      }
    },
    mounted() {
      this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      window.addEventListener('scroll', this.onScroll);
    },
    methods: {
      onScroll() {
        if(this.downTime){
          clearTimeout(this.downTime);
        };
        this.downTime = setTimeout(() => {
          let contentHeight = document.getElementById('scroll').clientHeight;//容器高度
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//窗口滚动条高度
          if(scrollTop == 0){
            this.$emit('refresh');
          };
          if (contentHeight + document.getElementById('scroll').offsetTop - this.windowHeight - scrollTop <= (this.bottomDistance || 100)) {
            //加载更多操作
            this.$emit('loadMore');
          }
        }, 200);
      }
    },
    beforeDestroy(){
      window.scrollTo(0, 0);
      window.removeEventListener('scroll', this.onScroll)
    }
  }
</script>

<style scoped>

</style>

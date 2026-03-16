<template>
  <div id="app" v-cloak>
    <interactUploadBox></interactUploadBox>
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
import interactUploadBox from '@/components/interactUploadBox.vue'
  export default {
    components:{
      interactUploadBox
    },
    provide () { 
      return { reload: this.reload } 
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        })
      },
      getSystem(){
        console.log("进入APP页面。。。。。。")
				this.$axios.get('/index/systemInfo').then(res => {
          if(res.data.status == 0){
            this.$router.replace('/expire')
          }
          else {
          if(res.data.nationalPlatformUrl){
            localStorage.setItem('isNPU',true);
            localStorage.setItem('NPU',JSON.stringify(res.data.nationalPlatformUrl));
          }else{
            localStorage.setItem('isNPU',false)
          }
					document.title = res.data.name ? res.data.name : '劢联科技';
        }
				});
			},
    },
    mounted(){
      this.getSystem();
      //检查是否初始化完成
      this.$axios.get('/sys/init/checkInit').then(res => {
        if(!res.data){
          this.$router.push('/initsystem');
        }
      })
    },
  }
</script>
<style>
#app {
  height: 100%;
}
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #c8c8c8;
}

[v-cloak] {
  visibility: hidden;
}

video::-webkit-media-controls {
  display: none !important;
}
.el-carousel__button {
  border-radius: 24px !important;
  height: 8px !important;
  width: 8px !important;
}
.el-carousel__indicator.is-active button {
  width: 27px !important;
}
.el-carousel__indicator button {
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.3) !important;
}
.el-backtop {
  color: #305bff !important;
}
</style>

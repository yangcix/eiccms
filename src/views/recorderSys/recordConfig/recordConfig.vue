<!-- recordConfig   该页面暂不使用-->
<template>
  <div id="recordConfig">
    <div class="content-main-wrap">
      <p class="content-title">录播配置</p>
      <div class="main-wrap">
          <div>
            <span class="search-desc">录制视频获取时间：</span>
            <span class="search-desc">每日</span>
            <el-time-picker
                v-model="startTime"
                @change="timeVerify"
                type="datetime"
                style="width: 200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
              </el-time-picker>
              -
              <el-time-picker
                v-model="endTime"
                @change="timeVerify"
                type="datetime"
                style="width: 200px"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
              </el-time-picker>

        </div>
        <el-button type="primary" class="confirm-btn" @click="submit">确认</el-button>
      </div>
    </div>
  </div>
	
</template>

<script>
	export default {
		name: 'recordConfig',
		data() {
			return {
        startTime:'',
        endTime:''
			}
		},
		components: {},
		mounted() {
		},
		methods: {
			submit () {
				
			},
      timeVerify () {
        // if (this.endTime) {
				// 	if(this.startTime > this.endTime){
        //     this.$message('开始时间不能大于结束时间', 'warn');
        //     this.endTime = '';
				// 		return true;
				// 	}
				// }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>

#recordConfig {
  .main-wrap {
    height: 620px;
  }
  .confirm-btn {
    margin:60px 0 0 400px;
  } 
}

</style>
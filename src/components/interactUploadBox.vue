<!-- uploadBox -->
<template>
  <div id='uploadBox'>
    <div  class="uploadBox" v-if="interactUploadBoxVisible && interactUploadTable.length > 0" :class="shrinkShow ? 'shrink' : ''">
      <div  class="upTitle">
        <span>上课提醒</span>
        <span @click="shrink" v-if="!shrinkShow" class="iconshrink"><img src="@/assets/imgs/min.png" alt=""></span>
        <span @click="shrink" v-if="shrinkShow" class="iconshrink"><img src="@/assets/imgs/max.png" alt=""></span>
      </div>
        <el-table :data="interactUploadTable" :class="showTable ? 'upTableNone' : ''" height="250">
          <el-table-column 
            property="name" 
            label="主题名称"
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column 
            property="time" 
            align="center"
            label="开始时间" 
            width="150">
          </el-table-column>
          <el-table-column 
            align="center"
            label="操作">
            <template slot-scope="scope">
							<el-button type="text" @click="toReUpload(scope.row)">开始授课</el-button>
              <el-button type="text" @click="cancelUp(scope.row)">暂不开始</el-button>
						</template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data () {
    return {
      shrinkShow:false, // 最小化样式
      isCancelLastData: false, // 上传表是否取消最后一条
      showTable: false,  //表格显示优化
    };
  },

  computed: {
    ...mapState({
      interactUploadBoxVisible:'interactUploadBoxVisible',
      interactUploadTable:'interactUploadTable'
    })
  },

  mounted() {
    window.addEventListener('storage',  (e) => {
      if(e.key && e.key == 'interactList' && e.newValue){
        this.commitInteracUploadDataState(JSON.parse(e.newValue))
        // this.socketQuery = e.newValue
      }
      if(e.key && e.key == 'interactShow' && e.newValue){
        console.log(e.newValue,'e.newValue')
        this.commitInteracUploadBoxVisible(JSON.parse(e.newValue))
      }
    })
  },

  watch:{
    interactUploadTable(val) {
      if(val.length == 0){
        this.commitInteracUploadBoxVisible(false)
      }
    },
    // 表格显示优化
    shrinkShow(val) {
      if(val === false){
        setTimeout(() => {
          this.showTable = false;
        },250)
        
      }else {
        this.showTable = true;
      }
    }
  },
  methods: {
    ...mapActions({
        commitInteracUploadBoxVisible:'commitInteracUploadBoxVisible',
        commitInteractUploadTable:'commitInteractUploadTable',
        commitInteracUploadDataState:'commitInteracUploadDataState'
      }),
      // 取消
    cancelUp(item){
      if(this.interactUploadTable.length == 1){
        this.isCancelLastData = true;
      }
      this.commitInteractUploadTable({
        type:'splice',
        index:item.id,
        detail: item.detail
      })
      let data = new FormData()
      data.append('id', item.id)
      this.$axios.post('/sm/interactive/callback', data).then(res => {
        
      })
    },
    // 开始授课
    toReUpload(item){
      console.log('开始',location.pathname)
      if(item.type == 1){
        if(location.pathname == '/mainroom'){
          console.log('开始dd')
          this.$bus.emit('startInteract')
        }else{
          window.open(window.origin + `/mainroom?id=${item.id}`,'target');
          // this.$router.push({path: '/mainroom', query: { id: item.id}})
        }
      }else{
        if(location.pathname == '/normalmainroom'){
          this.$bus.emit('startNormalInteract')
        }else{
          window.open(window.origin + `/normalmainroom?themeid=${item.themeId}&id=${item.id}`,'target');
          // this.$router.push({path: '/normalmainroom', query: { themeid: item.themeId, id: item.id}})
        }
      }
      let data = new FormData()
      data.append('id', item.id)
      this.$axios.post('/sm/interactive/callback', data).then(res => {
        
      })
      this.commitInteractUploadTable({
        type:'splice',
        index:item.id,
      })
    },
    // 挂起/打开
    shrink() {
      this.shrinkShow = !this.shrinkShow;
    }
  }
}

</script>
<style lang='scss' scoped>
#uploadBox {
  .uploadBox {
    width: 500px;
    height: 300px;
    position: fixed;
    right: 40px;
    bottom: 46px;
    z-index: 300;
    border-radius: 6px;
    box-shadow: 4px 4px 20px -5px #010b16;
    background: #fff;
    box-sizing: border-box;
    transition: height 0.5s;
    .upTitle {
      background: #409EFF;
      color: #fff;
      font-size: 12px;
      padding: 10px;
      display: flex;
      border-radius: 6px 6px 0 0;
      justify-content: space-between;
    }
    .iconshrink {
      cursor: pointer;
    }
    .status {
      color: #F56C6C;
    }
    .up-icon {
      width: 10px;
      height: 10px;
    }
    .upTableNone {
        display: none;
    }
  }
  .shrink {
      height: 0px;
    }
}
</style>
<style>
#uploadBox .el-table {
  height: 267px;
  border-radius: 0 0 6px 6px;
}
</style>
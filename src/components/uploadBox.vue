<!-- uploadBox -->
<template>
  <div id='uploadBox'>
    <div  class="uploadBox" v-if="uploadBoxVisible && uploadTable.length > 0" :class="shrinkShow ? 'shrink' : ''">
      <div  class="upTitle">
        <span>{{'正在上传'+ '('+uploadTable.length+')'}}</span>
        <span @click="shrink" v-if="!shrinkShow" class="iconshrink"><img src="@/assets/imgs/min.png" alt=""></span>
        <span @click="shrink" v-if="shrinkShow" class="iconshrink"><img src="@/assets/imgs/max.png" alt=""></span>
      </div>
        <el-table :data="uploadTable" :class="showTable ? 'upTableNone' : ''" height="250">
          <el-table-column 
            property="name" 
            label="视频名称"
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column 
            property="size" 
            align="center"
            label="大小" 
            width="150">
          </el-table-column>
          <el-table-column 
            property="status" 
            label="状态" 
            align="center"
            width="100">
            <template slot-scope="scope">
              <span :class="scope.row.status == 0 ? 'status' : ''">
                <img src="@/assets/imgs/upload.png" alt="" v-if="scope.row.status == 1">
                <img src="@/assets/imgs/upload2.png" alt="" v-else>
                {{scope.row.status | dataStatus}}
              </span>
            </template>
          </el-table-column>
          <el-table-column 
            width="116"
            align="right"
            label="操作">
            <template slot-scope="scope">
							<el-button type="text" v-if="scope.row.status == 0 || scope.row.status == 2" @click="toReUpload(scope.row)">重新上传</el-button>
              <el-button type="text" v-else @click="cancelUp(scope.row)">取消上传</el-button>
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
      uploadBoxVisible:'uploadBoxVisible',
      uploadTable:'uploadTable'
    })
  },

  mounted() {
    
  },

  watch:{
    uploadTable(val) {
      console.log('valvvvvvvvvv',val)
      if(val.length == 0 && !this.isCancelLastData){
        // this.$message('视频已全部上传成功','success',70,5000)
      }
      if(val.length == 0){
        this.commitUploadBoxVisible(false)
        window.axiosCancel = []
        //  console.log(window.axiosCancel)
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

  filters: {
			dataStatus(val){
				let arr = ['上传失败','上传中','已取消'];
				return arr[val];
      },
  },
  methods: {
    ...mapActions({
        commitUploadBoxVisible:'commitUploadBoxVisible',
        commitUploadTable:'commitUploadTable',
        commitUploadDataState:'commitUploadDataState'
      }),
      // 取消上传
    cancelUp(item){
      console.log('itemitemitem',item)
      if(this.uploadTable.length == 1){
        this.isCancelLastData = true;
      }
      this.cancel(item)
      // 取消改状态
      // this.commitUploadDataState({
      //   uploadId:item.uploadId,
      //   status: 2
      // })
      // 取消删除
      this.commitUploadTable({
        type:'splice',
        index:item.uploadId,
      })
      //  console.log(item)
    },
    // 重新上传
    toReUpload(item){
      // console.log(item)
      let url = '/sm/file/save';
			if(item.id != -1){
          url = '/sm/file/update';
      }
      this.commitUploadDataState({
        uploadId:item.uploadId,
        status: 1
      })
      this.$axios.post(url, item.detail,{
							headers: {
								uploadId: item.uploadId
							}
						}).then(res => {
        if(res.code == 200){
          this.$message('上传成功', 'success');
          this.commitUploadTable({
            type:'splice',
            index:item.uploadId,
          })
          window.fileList(); // 刷新file页面列表
        }else if(res.code == -10000){
          this.commitUploadDataState({
            uploadId:item.uploadId,
            status: 0
          })
        }
      }, err => {
        // console.log(err)
        this.$message(err.message,'error',70,3000)
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
    position: absolute;
    right: 80px;
    bottom: 86px;
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
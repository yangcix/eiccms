<!-- recordlist -->
<template>
  <div class="box">
		<div class="item">
      <div>账号</div><p>{{userInfo.account}}</p>
    </div>
    <div class="item">
      <div>姓名</div><p>{{userInfo.nickName}}</p>
    </div>
    <div class="item">
      <div>密码</div><p>******</p><el-button icon="el-icon-edit" type="primary" style="border-radius: 20px;margin-left: 20px;" size="mini" @click="openPassword">修改</el-button>
    </div>
    <div class="item" v-if="info.nickName">
      <div>头像</div><Avatar v-if="!info.headImage" :username="info.nickName"
        :src="info.headImage"
        background-color="#3060F6"
        color="#fff"
        style="vertical-align: middle;width: 100px;height: 100px;font-size: 60px !important;margin-left: 40px;"
        :inline="true">
      </Avatar>
      <img class="img" v-else :src="info.headImage" alt="" />
      <el-upload
        class="upload-demo"
        action=""
        :show-file-list="false"
        :http-request="httpRequest"
        accept=".png,.jpg"
        :before-upload="selectFiles">
        <el-button icon="el-icon-edit" type="primary" style="border-radius: 20px;margin-left: 20px;" size="mini">更换</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
    </div>
  </div>
</template>

<script>
import {baseUrl} from "../../../../assets/js/utils";
import Avatar from 'vue-avatar'
	export default {
		name: '',
    components: {Avatar},
		props:{
      userInfo:{
        type: Object,
        default: null
      },
    },
		data() {
			return {
        info: this.userInfo,
        uploadImg: baseUrl + '/sm/label/save',
			}
		},
    watch:{
      userInfo:{
        handler(newVal,oldVal){
          console.log(newVal,'2222')
          if(newVal){
            this.$nextTick(()=> {
              this.info = newVal;
            })
          }
        },
        immediate:true,
        deep: true
      }
    },
    inject:['openPassword'],
		mounted() {
		},
		methods: {
      httpRequest(param) {
        console.log(param,'ff2222f')
        let isJpg;
				if (
					param.file.type == "image/jpeg" ||
					param.file.type == "image/png" ||
					param.file.type == "image/jpg"
				) {
					isJpg = true;
				} else {
					isJpg = false;
				}
				if(!isJpg){
					return this.$message('上传失败，文件格式错误', 'error');
				}
				if((param.file.size / 1024) > 500){
					return this.$message('头像只能上传jpg/png文件，且不超过500kb', 'error');
				}else{
          let formData = new FormData();
          formData.append('file', param.file);
          this.$axios.post('/sys/user/updateHeadImage', formData).then(res => {
            if(res.code == 200){
              this.$message(res.data, 'success');
              this.$emit('update')
            }
          });
        }
      },
      //上传的封面
			selectFiles(file){
				// console.log(file,'fff')
				// let isJpg;
				// if (
				// 	file.type == "image/jpeg" ||
				// 	file.type == "image/png" ||
				// 	file.type == "image/jpg"
				// ) {
				// 	isJpg = true;
				// } else {
				// 	isJpg = false;
				// }
				// if(!isJpg){
				// 	return this.$message('上传失败，文件格式错误', 'error');
				// }
				// if((file.size / 1024) > 500){
				// 	return this.$message('照片只能上传jpg/png文件，且不超过500kb', 'error');
				// }else{
				// 	// let data = new FormData();
        //   // data.append('file', file)
        //   // this.$axios.post('/sys/user/updateHeadImage', data).then(res => {
				// 	// 	if(res.code == 200){
				// 	// 		this.$message('上传成功', 'success');
				// 	// 	}
				// 	// });
				// }
			},
		},
	}
</script>
<style lang="scss" type="text/scss" scoped>
.box{
  padding: 0 40px 40px 40px;
  .item{
    div{
     width: 60px; 
    }
    color: #989899;
    margin-top: 40px;
    display: flex;
    align-items: center;
    p{
      margin-left: 40px;
      color: black;
    }
    .img{
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
}
</style>
<template>
	<div class="content-wrap">
		<uploadBox></uploadBox>
		<aiUploadBox></aiUploadBox>
		<div class="login-wrap">
      <div class="login-wrap-left">
        <div class="nameBox">
          <Avatar v-if="!userInfo.headImage" :username="userInfo.nickName"
            :src="userInfo.headImage"
            background-color="#3060F6"
            color="#fff"
            style="vertical-align: middle;width: 100px;height: 100px;font-size: 60px !important;"
            :inline="true">
          </Avatar>
					<img class="img" v-else :src="userInfo.headImage" alt="">
          <p>{{userInfo.nickName + (userType == 0 ? '学生' : '老师')}}</p>
        </div>
        <ul>
          <li v-for="item in list" :key="item.id" @click="setContent(item)" :class="active == item.id ? 'active' : ''"><img :src="active == item.id ? item.src1 : item.src" alt="" style="margin-right: 6px;">{{item.name}}</li>
        </ul>
      </div>
      <div class="login-wrap-right">
				<div>
          <userInfo v-if="active == 1" :userInfo="userInfo" @update="getInfo"></userInfo>
          <listenClass v-else-if="active == 2" :userType="userType" :userInfo="userInfo"></listenClass>
          <aiClass v-else-if="active == 3" :userType="userType" :userInfo="userInfo"></aiClass>
          <liveClass v-else-if="active == 4" :userType="userType"></liveClass>
          <videoClass v-else-if="active == 5" :userType="userType"></videoClass>
        </div>
			</div>
			
		</div>
	</div>
</template>
<script>
import uploadBox from '@/components/uploadBox.vue'
import aiUploadBox from '@/components/aiUploadBox.vue'
import icon1 from './../../assets/imgs/center_1_1.png';
import icon2 from './../../assets/imgs/center_1_2.png';
import icon3 from './../../assets/imgs/center_2_1.png';
import icon4 from './../../assets/imgs/center_2_2.png';
import icon5 from './../../assets/imgs/center_3_1.png';
import icon6 from './../../assets/imgs/center_3_2.png';
import icon7 from './../../assets/imgs/center_4_1.png';
import icon8 from './../../assets/imgs/center_4_2.png';
import icon9 from './../../assets/imgs/center_5_1.png';
import icon10 from './../../assets/imgs/center_5_2.png';
import userInfo from './components/userItem/userInfo.vue'
import listenClass from './components/userItem/listenClass.vue'
import aiClass from './components/userItem/aiClass.vue'
import liveClass from './components/userItem/liveClass.vue'
import videoClass from './components/userItem/videoClass.vue'
	import { Message } from 'element-ui';
  import Avatar from 'vue-avatar'
	export default {
		name: '',
		data() {
			return {
        aiStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
				list: [],
        active: 1,
        userInfo: {
					headImageUrl: '',
				},
				userType: null,
				permission: []
			}
		},
		components: {Avatar,userInfo,listenClass,aiClass,liveClass,videoClass,uploadBox,aiUploadBox },
		mounted() {
			this.getInfo()
		},
		methods: {
			getInfo(){
				if(!localStorage.getItem('userInfo')){
					this.$message('请登录再访问！','error');
					this.$router.push('/home');
					return;
				}
				let id = JSON.parse(localStorage.getItem('userInfo')).userId;
				this.$axios.get('/index/individual/center?id=' + id).then(res => {
					let arr = [{
						id: 1,
						name: '个人资料',
						src: icon1,
						src1: icon2
					}]
					res.data.forEach(el => {
						if(el == '听评课活动'){
							arr.push({
								id: 2,
								name: '听评课活动',
								src: icon3,
								src1: icon4
							})
						}else if(el == 'AI磨课'){
							arr.push({
								id: 3,
								name: 'AI磨课',
								src: icon5,
								src1: icon6
							})
						}
						// else if(el == '直播资源'){
						// 	arr.push({
						// 		id: 4,
						// 		name: '直播资源',
						// 		src: icon7,
						// 		src1: icon8
						// 	})
						// }else if(el == '视频资源'){
						// 	arr.push({
						// 		id: 5,
						// 		name: '视频资源',
						// 		src: icon9,
						// 		src1: icon10
						// 	})
						// }
					})
					console.log(arr,'rrr')
					this.list = arr
				})
        this.$axios.get('/index/getNewUserInfos?userId=' + id).then(res => {
          if(res.data && res.code == 200){
						this.userInfo = res.data;
						this.$axios.get('/index/personal/user/identity').then(ress => {
							if(ress.data){
								this.userType = ress.data.type;
							}else{
								this.$message('请登录再访问！','error');
								this.$router.push('/home');
							}
						});
            // this.userInfo.avatar = 'http://' +location.hostname+ (res.data.headImageUrl)
						// this.userInfo.avatar = 'http://192.168.164.59'+ (res.data.headImageUrl);
          }else{
						// this.$message('请登录再访问！','error');
						this.$router.push('/home');
					}
        });
      },
      setContent(data) {
        this.active = data.id;
      },
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
 ::v-deep .vue-avatar--wrapper{
  font-size: 60px !important;
}
	.content-wrap{
		height: 100%
	}
	.footer{
		padding-top: 200px;
	}
	header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding: 0 130px;
		background: #409EFF;
		font-size: 19px;
		color: #fff;
		cursor: pointer;
		position: fixed;
		img{
			height: 30px;
			margin-right: 16px;
			vertical-align: middle;
		}
		.menu{
			cursor: pointer;
			font-size: 14px;
			span{
				margin: 0 15px;
			}
		}
	}
	.login-wrap{
		display: flex;
		height: 100%;
		// justify-content: center;
    min-width: 1148px;
		width: 60%;
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 65px;
    padding-bottom: 25px;
		.bg-wrap{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44%;
			height: 577px;
			background: #409EFF;
			img{
				width: 100%;
				max-height: 100%;
			}
		}
	}
  .login-wrap-left{
    min-height: 644px;
    width: 200px;
		overflow: auto;
    background: white;
    box-shadow: 0px 5px 20px rgba(73, 73, 73, 0.13);
    border-radius: 10px;
		padding: 8px;
    li{
      cursor: pointer;
      height: 43px;
			// width: 184px;
      margin: 0 15px;
      padding: 0 20px;
      display: flex;
      align-items: center;
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 20px;
      // color: #657584;
    }
    .nameBox{
      margin: 20px 0 30px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      p{
        font-size: 20px;
        margin-top: 20px;
      }
			.img{
				width: 100px;
				height: 100px;
				border-radius: 50%;
			}
    }
  }
  .login-wrap-right{
    box-shadow: 0px 5px 20px rgba(73, 73, 73, 0.13);
    border-radius: 10px;
		z-index: 9;
		padding: 20px;
		width: 70%;
		margin: 0 20px;
		background: white;
    // min-width: 900px;
		min-height: 644px;
		overflow: auto;
  }
  .active{
    background: rgba(48, 96, 246, 0.08);
		border-radius: 4px;
		color: #3060F6;
  }
  .activeics{
    background: #657584;
  }
  .activeic{
    background: #436CF8;
  }
</style>

<template>
	<div class="content-wrap">
		<header style="z-index: 99;">
			<div @click="goHome">
				<img :src="logoImg" alt="">
				<span>{{systemName}}</span>
			</div>
			<p class="menu">
				<span @click="goHome">首页</span>
				<!-- <span>帮助中心</span> -->
			</p>
		</header>
		<div class="login-wrap">
			<ul class="login-wrap-left">
        <li>FAQ列表</li>
        <li v-for="item in list" :key="item.id" @click="setContent(item)" :class="active == item.id ? 'active' : ''">{{item.name}}</li>
      </ul>
      <div v-if="list.length > 0" class="login-wrap-right">
				<div @click="handleClick" class="editor-content-view" v-html="content"></div>
			</div>
			<div v-else class="video-catalog footer">
				<div class="null-data">
        <img src="../../assets/imgs/home-null.png" alt="" />
        <p>暂无帮助文档</p>
      </div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import MD5 from 'js-md5';
	import {session} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				account: '',
				password: '',
				logoImg: '',
				loginImg: '',
				systemName: '',
				remember: false,
        active: '',
        list: [],
        content: ''
			}
		},
		components: {},
		mounted() {
			session.set('systemMenuList', '');
			this.getLogo();
			this.getList();
		},
		methods: {
			//获取帮助列表
			handleClick(event){
				if (event.target.tagName === 'IMG' && event.target.hasAttribute('data-href')) {
				const dataHref = event.target.getAttribute('data-href');
				window.open(dataHref);
				}
			},
			getList(){
				let data = {
					pageNum: 1,
					pageSize: 100000,
					sorType: 1
				};
				this.$axios.get('/sys/help/listAll', data).then(res => {
					this.list = res.data.pageList;
					if(res.data.pageList.length > 0) {
						this.active = res.data.pageList[0].id;
        		this.content = res.data.pageList[0].textHtml;
					}
				});
			},
			//获取登录底图
			getLogo(){
				this.$axios.get('/index/systemInfo').then(res => {
					this.loginImg = res.data.loginImg;
					this.logoImg = res.data.pcLogo;
					this.systemName = res.data.name;
					session.set('userInfo', res.data);
					localStorage.setItem('version',res.data.version)
				});
			},
      setContent(data) {
        this.active = data.id;
        this.content = data.textHtml;
      },
			login(){
				Message.closeAll();
				if(this.$verify.isEmpty(this.account)){
					this.$message('账号不能为空', 'error');
				}else if(this.$verify.isEmpty(this.password)){
					this.$message('密码不能为空', 'error');
				}else{
					this.$axios.post('/auth/login', {
						account: this.account,
						password: MD5(this.password),
						remember: this.remember,
						loginType: "web",
						type: 0
					}).then(res => {
						if(res.code == 200){
							if(res.data.systemPermission){
								this.$router.replace('/sys/home');
								this.$message('登录成功', 'success');
								window.localStorage.setItem('isAdmin', res.data.adminOrSuper)
								res.data.password = MD5(this.password);
								window.localStorage.setItem('userInfo', JSON.stringify(res.data));
							}else{
								this.$message('该账号暂无权限进入后台，请联系管理员', 'error');
							}
						}
					});
				};
			},
			//logo跳转首页
			goHome(){
				let routeUrl = this.$router.resolve({
					path: "/home"
				});
				window.open(routeUrl.href, '_blank');
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
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
		width: 72%;
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 65px;
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
    min-height: 800px;
    width: 300px;
		overflow: auto;
    background: white;
		padding: 8px;
    li{
      cursor: pointer;
      height: 43px;
			// width: 184px;
      padding: 0 10px;
      display: flex;
      align-items: center;
			font-style: normal;
			font-weight: 400;
			font-size: 14px;
			line-height: 20px;
    }
  }
  .login-wrap-right{
		z-index: 9;
		padding: 20px;
		width: 70%;
		margin: 0 20px;
		background: white;
    // min-width: 900px;
		min-height: 776px;
		overflow: auto;
  }
  .active{
    background: rgba(48, 96, 246, 0.08);
		border-radius: 4px;
		color: #3060F6;
  }

::v-deep .editor-content-view p,
.editor-content-view li {
  white-space: pre-wrap; /* 保留空格 */
}

::v-deep .editor-content-view blockquote {
  border-left: 8px solid #d0e5f2;
  padding: 10px 10px;
  margin: 10px 0;
  background-color: #f1f1f1;
}

::v-deep .editor-content-view code {
  font-family: monospace;
  background-color: #eee;
  padding: 3px;
  border-radius: 3px;
}
::v-deep .editor-content-view pre>code {
  display: block;
  padding: 10px;
}

::v-deep .editor-content-view table {
  border-collapse: collapse;
}
::v-deep .editor-content-view td,
.editor-content-view th {
  border: 1px solid #ccc;
	padding: 3px 5px;
  min-width: 50px;
  height: 20px;
}
::v-deep .editor-content-view th {
	background-color: #F4F2F0;
	border: 1px solid #ccc;
	line-height: 1.5;
	min-width: 30px;
	padding: 3px 5px;
	font-weight: 700;
	text-align: center;
}

::v-deep .editor-content-view ul,
.editor-content-view ol {
  padding-left: 20px;
}

::v-deep .editor-content-view input[type="checkbox"] {
  margin-right: 5px;
}
::v-deep video::-webkit-media-controls {
	display:flex !important;
}
</style>

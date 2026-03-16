<template>
	<div>
		<ul class="video-list">
			<li v-for="val in videoList" :key="val.id" class="video-item" @click="play(val)">
				<div class="img-wrap">
          <img :src="val.imgUrl" alt="" :onerror="defaultImg">
					<!-- <img :src="val.imgUrl" alt="" :onerror="defaultImg"> -->
					<ul class="tag-list">
						<li v-for="item in val.labels" :key="item.id">{{item}}</li>
					</ul>
				</div>

				<div class="layout-item">
					<span class="name" :title='val.name'>{{val.name}}</span>
				</div>

				<div class="layout-item">
					<span v-if="val.themeStatus != 0"><i class="iconfont icon-watch"></i> {{val.viewed}}</span>
					<span>{{val.nickName ? val.nickName : val.founder}}</span>
				</div>
				<p class="video-status" v-if="val.themeStatus == 1">
					<span class="playAnimation">
						<span class="animationli"></span>
						<span class="animationli"></span>
						<span class="animationli"></span>
						<span class="animationli"></span>
					</span>授课中</p>
				<p class="video-status" v-if="val.themeStatus == 0"><i class="el-icon-alarm-clock"></i>预告中</p>
				<p class="video-status" v-if="val.themeStatus == 2"><i class="el-icon-refresh-left"></i>已结束</p>
				<p class="time" v-if="val.time">{{val.time}}</p>
				
				
			</li>
		</ul>
	</div>
</template>

<script>
	import {timeDown} from "../assets/js/utils";
	export default {
		props: ['videoList', 'type'],
		name: '',
		data() {
			return {
				dataList: [],
        defaultImg: 'this.src="' + require('@/assets/imgs/live-mode1.png') + '"' // 默认图片
			}
		},
		computed: {
		},
		components: {},
		mounted() {
			if (this.videoList.length) {
				this.videoList.forEach(v => {
					v.labels = v.labels ? v.labels : v.labels;
				});
			}
		},
		methods: {
			play(val){
				window.scrollTo(0, 0);
				// debugger
				if(this.type == 0 && (val.themeStatus == 1 || val.themeStatus == 0)){ //直播
					if(val.mode == 0){ //http
						this.$router.push({path: 'hplay', query: {themeid: val.id, type: this.type}});
					}else{ //rtmp
						this.$router.push({path: 'rplay', query: {themeid: val.id, type: this.type}});
					}
				}else if(this.type == 0 && val.themeStatus == 2){ //点播
					this.$router.push({path: 'pplay', query: {themeid: val.id, type: 0}});
				}else if(this.type == 2){ //视频
					this.$router.push({path: 'vplay', query: {themeid: val.id, type: this.type}});
				}
			},
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
.playAnimation {
	display: inline-block;
	width:24px;
	height: 20px;
	vertical-align: bottom;
	margin-right: 4px;
	.animationli {
		display: inline-block;
		width: 4px;
		height: 0px;
		background: #fff;
		margin-right: 2px;
		vertical-align: baseline;
		border-radius: 2px 2px 0 0;
	}
	.animationli:first-child{
		animation:mymove 0.9s infinite;
    -webkit-animation:mymove 0.9s infinite; 
	}
	.animationli:nth-child(2){
		animation:mymove 1.6s infinite;
    -webkit-animation:mymove 1.6s infinite; 
	}
	.animationli:nth-child(3){
		animation:mymove 1.3s infinite;
    -webkit-animation:mymove 1.3s infinite; 
	}
	.animationli:nth-child(4){
		animation:mymove 0.8s infinite;
    -webkit-animation:mymove 0.8s infinite; 
	}
	@keyframes mymove
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}

	@-webkit-keyframes mymove /* Safari and Chrome */
	{
			0%   {height: 6px;}
			35%  {height: 13px;}
			45%  {height: 14px;}
			55%  {height: 15px;}
			65%  {height: 11px;}
			75%  {height: 10px;}
			85%  {height: 8px;}
			100% {height: 4px;}
	}
}
.video-list{
	display: flex;
	flex-wrap: wrap;
	width: 1200px;
	margin: 20px auto;
	.video-item{
		overflow: hidden;
		position: relative;
		width: 280px;
		height: 250px;
		margin: 20px 0 0 26px;
		box-sizing: border-box;
		background: #fff;
		color: #999;
		border-radius: 8px;
		transition: all 0.1s;
		// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		cursor: pointer;
		.img-wrap{
			overflow: hidden;
			width: 100%;
			height: 161px;
			border-radius: 8px 8px 0 0;
			transition: all 0.2s;
			img{
				width: 100%;
				height: 100%;
				border-radius: 8px 8px 0 0;
				transition: all 0.3s;
			}
		}
		.tag-list{
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			flex-wrap: wrap; // 换行
			li{
				min-width: 36px;
				height: 14px;
				margin-bottom: 5px;
				margin-right: 6px;
				padding: 5px 8px;
				border-radius: 8px 0px 8px 0px;
				box-shadow: 0px 2px 3px 0px rgba(255,151,39,0.5);
				text-align: center;
				font-size: 12px;
				background: linear-gradient(88deg, #F8BE56 0%, #FA8846 100%);
				color: #fff;
			}
		}
		.layout-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			box-sizing: border-box;
			border-bottom: solid 1px #F1F2F4;
			height: 45px;
			font-size: 12px;
			padding:0 10px;
			.name{
				overflow: hidden;
				// max-width: 190px;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size: 14px;
				color: #333333;
			}
			i{
				margin-right: 5px;
				font-size: 14px;
				vertical-align: top;
			}
		}
		.video-btn{
			display: none;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 40px;
			text-align: center;
			color: #fff;
			background: #035AFF;
		}
		.video-status {
			position: absolute;
			top: 138px;
			right: 0;
			width: 84px;
			line-height: 23px;
			text-align: center;
			font-size: 12px;
			background: rgba(0, 0, 0, .4);
			color: #fff;
			i{
				margin-right: 2px;
				font-size: 16px;
				vertical-align: middle;
			}
		}
		.time{
			position: absolute;
			right: 8px;
			bottom: 96px;
			padding: 3px 6px;
			border-radius:10px;
			font-size: 12px;
			background:rgba(0,0,0,.4);
			color: #fff;
		}
	}
	li:nth-child(4n + 1) {
		margin-left: 0;
	}
	li:hover{
		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
		transform: translateY(-5px) scale(1.06);
	}
	li:hover .video-status{
		// width: 248px;
	}
	li:hover img{
		transform: scale(1.12);
	}
	li:hover .img-wrap {
		transform: scale(0.95);
		// box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.13);
	}
	li:hover .video-btn{
		display: block;
	}
}
</style>

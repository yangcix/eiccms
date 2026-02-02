<template>
	<div class="">
		<div class="search-head">
			<p class="cancel" @click="goBack">取消</p>
			<input type="text" placeholder="输入关键字搜索" v-model="keyWord">
			<p class="search" @click="search()">搜索</p>
		</div>
		
		<div class="history-wrap" v-if="historyList.length">
			<p class="title">历史搜索</p>
			<ul class="history-list">
				<li v-for="val in historyList" @click="search(val)">{{val}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import {storage} from "../../assets/js/utils";
	export default {
		name: '',
		data() {
			return {
				historyList: [],
				keyWord: ''
			}
		},
		components: {},
		mounted() {
			this.keyWord = this.$route.query.key
			this.getHistoryList()
		},
		methods: {
			//从storage里面取出历史搜索
			getHistoryList(){
				if(storage.get('his')){
					this.historyList = storage.get('his').split(',');
				}
			},
			//取消返回
			goBack(){
				this.$router.go(-1);
			},
			//搜索
			search(val){
				if(val){
					this.keyWord = val;
				}
				this.setHistory(this.keyWord);
				this.$router.replace({path: '/mobile/searchres', query: {key: this.keyWord}});
			},
			//设置历史搜索
			setHistory(val){
				if(this.historyList.includes(val)){
					this.historyList.splice(this.historyList.indexOf(val), 1);
				}else{
					if(this.historyList.length == 10){
						this.historyList.pop();
					}
				};
				this.historyList.unshift(val);
				storage.set('his', this.historyList.join(','));
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.search-head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		height: 45px;
		padding: 0 12px;
		background: #fff;
		.cancel{
			font-size: fs(15);
			color: #989898;
		}
		input{
			flex: 1;
			height: 29px;
			margin: 0 15px;
			border: solid 1px #C3C3C3;
			border-radius: pvh(6);
			font-size: fs(12);
			text-indent: 15px;
			background: #F2F2F2;
		}
		.search{
			width: 60px;
			border-radius: pvh(8);
			line-height: 29px;
			text-align: center;
			font-size: fs(14);
			background: #409EFF;
			color: #fff;
		}
	}
	.history-wrap{
		box-sizing: border-box;
		padding: 0 12px;
		margin-top: 20px;
		.title{
			font-size: fs(12);
			color: #989898;
		}
		.history-list{
			display: flex;
			flex-wrap: wrap;
			li{
				margin: 15px 20px 0 0;
				font-size: fs(15);
				color: #666;
			}
		}
	}
</style>

<!--
 * @Author: your name
 * @Date: 2020-05-20 11:31:57
 * @LastEditTime: 2020-07-07 16:15:40
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \neweicc\src\components\SwiperHome.vue
--> 
<template>
	<div>
		<div v-show="showList == 0" style="min-height: 1px">
		<div class="swiper-wrap" v-if="swiperList.length > 1">
			<el-carousel height="380px" arrow="never" :interval="5000">
				<el-carousel-item v-for="item in swiperList" :key="item.id">
					<a :href="item.url ? item.url : 'javascript:void(0)'" style="display: block;  height:380px; min-widht: 1200px" :target="item.url ? '_blank' : ''">
						<img :src="item.imgUrl" alt="" class="one-img" :onerror="defaultImg">
					</a>
				</el-carousel-item>
			</el-carousel>
		</div>
		<div v-if="swiperItem" class="swiper-wrap">
			<a :href="swiperItem.url ? swiperItem.url : 'javascript:void(0)'" style="display: block;  height:380px; min-widht: 1200px" :target="swiperItem.url ? '_blank' : ''">
				<img :src="swiperItem.imgUrl" alt="" class="one-img" :onerror="defaultImg">
			</a>
		</div>
	</div>
	<div v-show="showList == 1" class="swiper-wrap">
		<img :src="bannerOne" alt="" class="one-img">
	</div>
	</div>
	
</template>

<script>
	export default {
		name: '',
		props: ['location'],
		data() {
			return {
				showList: 2,
				swiperList: [],
				bannerOne: require('@/assets/imgs/bannerone.jpg'),
				defaultImg: '',
				defaultImgs: 'this.src="' + require('@/assets/imgs/banner1.png') + '"', // 默认图片
				swiperItem: ''
			}
		},
		components: {},
		mounted() {
			this.getSwiperList();
		},
		methods: {
			//获取轮播图
			getSwiperList(){
				this.$axios.get('/index/getAdByLocation', {location: this.location}).then(res => {
					if(!res.data){
						this.defaultImg = this.defaultImgs;
					}else if(res.data.length > 1){
						this.showList = 0;
						let arr = res.data
						arr.forEach(ele => {
							if(ele.url && ele.url.slice(0, 7) !== 'http://' && ele.url.slice(0, 8) !== 'https://') {
								ele.url = 'http://' + ele.url
							}
						});
						this.swiperList = arr;
					}else{
						if(res.data.length == 1){
							this.showList = 0;
							let arr = res.data
							arr.forEach(ele => {
								if(ele.url && ele.url.slice(0, 7) !== 'http://' && ele.url.slice(0, 8) !== 'https://') {
									ele.url = 'http://' + ele.url
								}
							});
							this.swiperItem = arr[0]
						}else{
							this.showList = 1
						}
						
					}
				});
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.swiper-wrap{
		height: 380px;
		min-width: 1200px;
    overflow: hidden;
		.one-img{
			width: 100%;
			height: 100%;
		}
	}
</style>

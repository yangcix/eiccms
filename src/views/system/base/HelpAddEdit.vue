<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" :content="`${$route.query.data ? '编辑' : '新增'}帮助文章`"></el-page-header></p>
		<div class="content-wrap">
			<div class="item-scroll">
				<div class="box">
					<div class="item-wrap">
						<p>标题</p>
						<p><em>*</em>：</p>
						<el-input class="width-2" v-model.trim="name" clearable></el-input>
					</div>
          <div class="item-wrap">
						<p>内容</p>
						<p><em>*</em>：</p>
						<Editor :myHtml="doc" ref="myEditor" style="width: 1000px;"></Editor>
						<!-- <mavon-editor style="width: 87%;max-height: 550px;" ref="md" @save="saveDoc" :toolbars="markdownOption"
            @change="updateDoc" v-model="doc" @imgAdd="handleEditorImgAdd"/> -->
					</div>
					<el-button type="primary" class="edit-btn" @click="save">确认</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Editor from '../../../components/Editor.vue'
	import { Message } from 'element-ui';
	export default {
		name: '',
		components: {Editor},
		data() {
			return {
				html: '',
				doc: '',
				name: '',
				id: '',
				markdownOption: {
					shortCut: false,
					bold: true, // 粗体
					italic: true, // 斜体
					header: true, // 标题
					underline: true, // 下划线
					strikethrough: true, // 中划线
					mark: true, // 标记
					superscript: true, // 上角标
					subscript: true, // 下角标
					quote: true, // 引用
					ol: true, // 有序列表
					ul: true, // 无序列表
					link: true, // 链接
					imagelink: true, // 图片链接
					// code: true, // code
					table: true, // 表格
					fullscreen: false, // 全屏编辑
					readmodel: true, // 沉浸式阅读
					htmlcode: false, // 展示html源码
					help: true, // 帮助
					/* 1.3.5 */
					undo: true, // 上一步
					redo: true, // 下一步
					trash: true, // 清空
					// save: true, // 保存（触发events中的save事件）
					/* 1.4.2 */
					navigation: true, // 导航目录
					/* 2.1.8 */
					alignleft: true, // 左对齐
					aligncenter: true, // 居中
					alignright: true, // 右对齐
					/* 2.2.1 */
					subfield: true, // 单双栏模式
					preview: true, // 预览
				}
			}
		},
		mounted() {
			if(this.$route.query.data){
				this.id = JSON.parse(this.$route.query.data).id;
				this.name = JSON.parse(this.$route.query.data).name;
				this.html = JSON.parse(this.$route.query.data).textHtml;
				this.doc = JSON.parse(this.$route.query.data).textMd;
			}
		},
		methods: {
			//上传图片
			handleEditorImgAdd(place,$file){
				console.log('ddddfffffaaa')
				let formdata = new FormData()
				formdata.append('file', $file)
				this.$axios.post('/sys/help/img2Url',formdata).then(res => {
					if (res.code === 200) {
						this.$refs.md.$img2Url(place,res.data);//window.config.host
					}
				})
			},
			updateDoc(markdown, html) {
				this.html = html;
			},
			saveDoc(markdown, html) {
				// 此时会自动将 markdown 和 html 传递到这个方法中
				console.log("markdown内容:" + markdown);
				console.log("html内容:" + html);
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
      save(){
			let data = new FormData();
			if(this.id !== '') {
				data.append('id', this.id);
			}
			data.append('name', this.name);
			data.append('textHtml', this.$refs.myEditor.getVal());
			data.append('textMd', this.$refs.myEditor.getVal());
      if(!this.verify()){
					this.$axios.post(this.id == '' ? '/sys/help/save' : '/sys/help/update', data).then(res => {
						 if(res.code == 200){
							this.$message(this.id == '' ? '新增成功' : '修改成功', 'success');
              this.goBack();
            }
					})
        }
      },
			//验证
			verify(){
				Message.closeAll();
				const html = this.$refs.myEditor.getVal()
				if (this.name == '') {
					this.$message('文章标题不能为空', 'error');
					return true;
				}else if (this.name.length > 20) {
					this.$message('文章标题不能超过20字符', 'error');
					return true;
				} else if(html == '' || html == '<p><br></p>'){
					this.$message('文章内容不能为空', 'error');
					return true;
				}
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.content-wrap{
		overflow: hidden;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 54px 60px;
	}
	.notice-wrap{
		display: inline-block;
		padding: 23px 80px 24px 80px;
		font-size: 14px;
		color: #303133;
		background: #EFF3F9;

		p {
			line-height: 24px;
		}
	}
	.item-scroll{
		overflow: hidden;
		height: 100%;
		width: 100%;
		.box{
			overflow-y: scroll;
			width: 100%;
			height: 100%;
		}
	}
	.item-wrap{
		display: flex;
		align-items: center;
		margin-top: 25px;
    min-width: 1200px;
		em{
			color: #F64646;
		}
		p:first-child{
			width: 94px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
			color: #303133;
			font-size: 14px;
		}
		p:first-child:after{
			content: '';
			display: inline-block;
			width: 100%;
    }
    .elTag {
      margin-right: 10px;
    }
		.class-type{
			cursor: pointer;

			.act {
				border: solid 3px #5B8CFF;
				border-radius: 8px;
			}
			
			img{
				width: 286px;
				height: 159px;
				border: solid 3px #FFF;
			}
			p{
				margin-top: 7px;
				text-align: center;
				font-size: 14px;
				color: #606266;
			}
		}
	}
	
	.edit-btn{
		width: 160px;
		height: 40px;
		margin: 35px 0 60px 130px;
	}
	.err-notice{
		margin-left: 20px;
		color: #B3B6BA;
		font-size: 12px;
		&.err-color{color: #F64646}
	}

	.itemType {
		float: left;
		padding-left: 10px;
		padding-bottom: 10px;

		.p {
			line-height: 40px;
			text-align: justify;
			color: #303133;
			font-size: 14px;
			float: left;
		}

		.el-select {
			float: left !important;
		}
	}

	.tip {
		text-align: center;
	}
</style>
<style>
</style>

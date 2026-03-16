<template>
	<div class="second-wrap">
		<p class="content-title"><el-page-header @back="goBack" :content="$route.query.themeid ? '编辑专递课堂页' :'新增专递课堂页'"></el-page-header></p>
		<div class="content-wrap">
			<div class="item-scroll">
				<div class="box">
					<div class="item-wrap">
						<div style="display:flex">
							<p style="line-height:32px">类型</p>
							<p style="padding-top:6px"><em>*</em>：</p>
						</div>
						<div>
							<div class="itemType width-9" style="padding-left:0">
								<el-select @change="handleTheme($event)" v-model="themeValue" :popper-append-to-body="false" placeholder="请选择">
									<el-option
									v-for="item in themeData"
									:key="item.id"
									:label="item.name"
									:value="item.id">
									</el-option>
								</el-select>
							</div>
							<div class="itemType width-9 itemList" v-for="(nape,index) in themeTypeList" :key="index">
								<el-tooltip :disabled="nape.name.length > 12 ? false : true" class="item" effect="dark" :content="`请选择${nape.name}`" placement="top-start">
									<el-select :popper-append-to-body="false" clearable v-model="nape.value" :placeholder="`请选择${nape.name}`" v-if="nape.children">
										<el-option
										v-for="item in nape.children"
										:key="item.id"
										:label="item.name"
										:value="item.id">
										</el-option>
									</el-select>
								</el-tooltip>
							</div>
						</div>
						<!-- <el-cascader v-model="addEditInfo.labelIdList"
						:show-all-levels="false"
						style="width: 280px"
						:options="themeTypeList"
						placeholder="请选择类型"
						:props="props"
						@change="typeChange"
						clearable>
						</el-cascader> -->
					</div>
					
					<div class="item-wrap">
						<p>课堂名称</p>
						<p><em>*</em>：</p>
						<el-input class="width-2" v-model="addEditInfo.name" clearable></el-input>
					</div>
					
					<div class="item-wrap">
						<p>开始时间</p>
						<p><em>*</em>：</p>
						<el-date-picker
							v-model="addEditInfo.startTime"
							type="datetime"
							style="width: 280px"
							value-format="yyyy-MM-dd HH:mm:ss"
							placeholder="开始时间">
						</el-date-picker>
						<p class="err-notice">注：开始时间需大于当前时间</p>
					</div>
					
					<div >
						<div class="item-wrap">
							<p>结束时间</p>
							<p style="margin-right: 5px"><em></em>：</p>
							<el-date-picker
								v-model="addEditInfo.endTime"
								type="datetime"
								style="width: 280px"
								value-format="yyyy-MM-dd HH:mm:ss"
								placeholder="结束时间">
							</el-date-picker>
							<p class="err-notice">注：大于开始时间，未填写则默认需手动结束</p>
						</div>
						
						<div class="item-wrap">
							<p>主讲老师</p>
							<p><em>*</em>：</p>
							<!-- <p style="margin-right: 5px">：</p> -->
							<el-select class="width-2" v-model="addEditInfo.lecturerId" filterable @change="changeTeacher()">
								<el-option
									v-for="item in listTeacher"
									:key="item.id"
									:label="item.nickName"
									:value="item.id"
								>
								</el-option>
							</el-select>
							<!-- <el-input class="width-2" v-model="addEditInfo.lecturer"></el-input> -->
						</div>

						<div class="item-wrap">
							<p>主讲学校</p>
							<p><em>*</em>：</p>
							<el-input class="width-8" v-model="mainData.schoolName" clearable disabled></el-input>
							<p class="input-s">验证码</p>
							<p style="margin-right:13px"><em>*</em>：</p>
							<el-input class="width-8" v-model="mainData.password" clearable></el-input>
						</div>
						
						<div class="item-wrap" v-for="(val, index) in assistenList" :key="index">
							<p>互动学校</p>
							<p><em>*</em>：</p>
							<el-select v-model="val.mark" @change="shcoolChange(index,val.mark)" placeholder="选择学校" class="width-8" filterable>
								<el-option
									v-for="item in schoolList"
									:key="item.mark"
									:label="item.name"
                  :disabled="selected.includes(item.mark) && (val.mark !== item.mark)"
									:value="item.mark">
								</el-option>
							</el-select>
							<p class="input-s">互动教室</p>
							<p><em>*</em>：</p>
							<el-input class="width-8" v-model="assistenList[index].number" @change="changeRoomNum(index)" clearable></el-input>
              <p class="input-s" style="margin-right:15px">间</p>
							<p class="input-s">验证码</p>
							<p><em>*</em>：</p>
							<el-input class="width-8" v-model="assistenList[index].password" @change="changeCode(index)" clearable></el-input>
							<i class="el-icon-remove-outline sub" @click="addAssistant(0, index)"></i>
						</div>
						<p class="add-assistant"><i class="el-icon-circle-plus-outline" @click="addAssistant(1)"></i></p>
					</div>
					
					<div class="item-wrap upload-box" style="margin-top: 50px">
						<p>简介</p>
						<p class="p1">：</p>
						<div class="upload-wrap">
							<textarea v-model="addEditInfo.description"></textarea>
						</div>
					</div>
					
					<el-button type="primary" class="edit-btn" @click="creat">{{$route.query.themeid?'保存':'创建'}}</el-button>
					<!-- <el-button type="primary" class="edit-btn" v-if="!$route.query.themeid" @click="save('release')">一键发布</el-button> -->
				</div>
			</div>
		</div>

    <el-dialog
			title="创建课堂"
			:close-on-click-modal="false"
			:visible.sync="creatShow"
			width="420px">
			<div class="dialog-wrap">
				<p class="err-delete">确认创建该课堂？</p>
				<div class="dialog-btn">
					<el-button type="primary" @click="save">确 定</el-button>
					<el-button @click="creatShow = false">取 消</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {creatTree, baseUrl, getNowDate, session} from '@/assets/js/utils';
	export default {
		name: '',
		data() {
			return {
				uploadUrl: baseUrl + '/sys/crossSchoolInteraction/save',
				fileList: [],
				typeInteract: 1,
				themeData: [
					{
						id: 1,
						name: '专递课堂'
					}
				],
				themeValue: '',
				themeId: '',
				themeTypeList: [],
				props: {multiple: true, label: 'name', value: 'id', emitPath: false},
				addEditInfo: {mode: 1,  lecturer: '', lecturerId: '', description: '',groupId: '',recode: 0, joiner: 0, startTime: '',endTime: '',categoryName:''},
				schoolList: [],
				listTeacher: [],
				buildlList: [],
				classroomList: [],
				recodeList: [],
				mainData: {mark: '',schoolName:'', number:'1', password:'',type:1},
        assistenList: [{mark: '',schoolName:'', number:'', password:'', type:0}],
        roomNumTotal: '', // 房间总数
				creatShow: false, // 确认创建弹窗
			}
		},
    components: {},
    computed: {
      selected() {
        return this.assistenList.map(({mark}) => mark).filter(v => v)
      }
    },
		mounted() {
			this.getSelfSchool();
			this.handleListTeacher(); 
			this.handleGetType();
			// this.getTypeList();
			this.getSchoolList();
			this.getgroupList();
			if(this.$route.query.themeid){
				this.themeId = this.$route.query.themeid;
				this.getThemeInfo();
				
			}
			setTimeout(() => {
				// this.typeInteract = this.addEditInfo.mode;
				if (this.themeValue !== '') {
					this.getTypeList();
				}
			}, 100)
			const isToken = this.$route.query.token;
			if (isToken) {
				const params = {
					loginType: "web",
					token: isToken
				};
				this.$axios.post("/auth/loginByToken", params).then(res => {
					console.log(res);
				});
			}
		},
		methods: {
			// 获取当前本校
			getSelfSchool() {
				this.$axios.get('/sys/crossSchoolInteraction/getCurrentSchoolInfo').then(res => {
					console.log(res);
					this.mainData.schoolName = res.data.schoolName;
					this.mainData.mark = res.data.mark;
				});
			},
      // 改变互动房间数
      changeRoomNum (index) {
        this.roomNumTotal = this.assistenList.reduce((prev, cur, index, arr) => {
            return Number(prev) + Number(cur.number);
        },0)
        // if(this.roomNumTotal >6){
        //   this.$message('总房间数不能超过6间','error')
        //   this.assistenList[index].number = ''
        // }
      },
      // 改变房间验证码
      changeCode(index) {
        console.log(index,this.assistenList[index].password)
      },

			// 选择老师 
			changeTeacher (){
				// debugger
				this.addEditInfo.lecturer = this.listTeacher.filter(i => i.id == this.addEditInfo.lecturerId)[0].nickName;
				console.log(this.addEditInfo.lecturer)
			},
			// 获取主讲老师列表
			handleListTeacher() {
				this.$axios.get('/sys/user/listTeacher').then(res => {
					this.listTeacher = res.data
					console.log(this.listTeacher);
				});
			},
			//获取用户组列表
			getgroupList(){
				this.$axios.get('/sm/theme/getSysGroup').then(res => {
					this.groupList = res.data;
					console.log(this.groupList);
				});
			},
			//上传的封面
			selectFile(file){
				if((file.raw.size / 1024) > 500){
					this.fileList = [];
					return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
				}else{
					this.addEditInfo.file = file.raw;
				}
			},
			// 一级分类 change
			handleTheme(e) {
				this.addEditInfo.categoryName = this.themeData.filter(i => i.id === e)[0].name
				this.getTypeList();
			},
			// 获取类型
			handleGetType() {
				this.$axios.get('/sm/category/listAll').then(res => {
					if (res.code === 200) {
						this.themeData = res.data;
					}
				})
			},
			//编辑获取主体信息
			getThemeInfo(){
				this.$axios.get('/sys/crossSchoolInteraction/info', {id: this.themeId}).then(res => {
					this.addEditInfo = res.data;

					let currentSchool = res.data.extendList.filter(i => i.type === 1)[0]
					this.mainData.schoolName = currentSchool.schoolName;
					this.mainData.mark = currentSchool.mark;
					this.mainData.password = currentSchool.password

					this.assistenList = res.data.extendList.filter(i => i.type === 0)

					this.themeValue = res.data.categoryId; // 获取编辑id赋给一级分类select
					this.fileList = [{ name: '', url: res.data.imgUrl }];
					// this.handleListTeacher();
				});
			},
			//返回
			goBack(){
				this.$router.go(-1);
			},
			//获取类型
			// getTypeList(){
			// 	this.$axios.get('/sm/label/listAll').then(res => {
			// 		let treeList = creatTree(res.data);
			// 		let data = [];
			// 		treeList.forEach(val => {
			// 			if(val.children){
			// 				data.push(val);
			// 			}
			// 		})
			// 		this.themeTypeList = data;
					
			// 	});
			// },
			//获取类型
			getTypeList(){
				this.$axios.get('/sm/label/listByCategory', {
					categoryId: this.themeValue,
					type: 4,
					id: this.$route.query.themeid
				}).then(res => {
					let treeList = creatTree(res.data);
					console.log(res.data)
					console.log(treeList)
					let data = [];
					treeList.forEach(val => {
						if(val.children){
							data.push(val);
						}
						// val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
					})
					console.log(data)
					this.themeTypeList = data;
					
				});
			},
			//类型最多选择三个
			typeChange(val){
				if(this.addEditInfo.labelIdList.length > 3){
					this.addEditInfo.labelIdList = this.addEditInfo.labelIdList.splice(0, 3);
					this.$message('最多选择三个类型','error');
				}
			},
			//获取学校列表
			getSchoolList(){
				this.$axios.get('/sys/crossSchoolInteraction/getAllCrossSchool').then(res => {
          this.schoolList = res.data;
					// if (this.schoolList.length > 0) {
            // this.mainData.orgId = this.schoolList[0].orgId;
            // this.mainData.schoolName = this.schoolList[0].schoolName;
						// this.shcoolChange('main');
						// this.assistenList[0].orgId = this.schoolList[0].orgId;
						// this.shcoolChange(0);
					// }
				})
			},
			//选择学校
			shcoolChange(type,mark){
				let schoolName = this.schoolList.filter(item => item.mark == mark)[0].name;
        this.assistenList[type].schoolName = schoolName;
			},
			
			//添加互动教室
			addAssistant(type, index){
				//1添加 0减
				if(type){
					if(this.assistenList.length == 6){
						return this.$message('互动教室最多6个', 'error');
					}
					let assLength = this.assistenList.length;
          this.assistenList.push({mark:'',schoolName:'', number:'', password:'', type:0});
				}else{
					if(this.assistenList.length == 1){
						return this.$message('互动教室最少1个', 'error');
          }
          this.assistenList.splice(index, 1);
				}
			},
			// //获取验证码
			// getCode(type){
			// 	this.$axios.get('/sm/interactive/getRandomNum').then(res => {
			// 		if(type == 'main'){
			// 			this.addEditInfo.masterPassword = res.data;
			// 		}else{
			// 			this.addEditInfo.interactivePassword = res.data;
			// 		}
			// 	})
      // },

      // 创建主题
      creat() {
        if(this.verify()){
					return
				};
        this.creatShow = true;
      },
      
			//保存
			save(param) {  // typeInteract === 1课堂模式
				let terminalList = [];
				let idList = [];
				this.themeTypeList.forEach(v => {
					if (v.value) {
						idList.push(v.value);
					}
				});
				console.log(idList)
        terminalList.push(this.mainData)
        this.addEditInfo.terminalList = terminalList.concat(this.assistenList)
        console.log(this.addEditInfo.terminalList)
        // debugger
				this.addEditInfo.categoryId = this.themeValue;
				this.addEditInfo.labelIdList = idList ? idList : '';
				// this.addEditInfo.mode = this.typeInteract;
				let url = '/sys/crossSchoolInteraction/save';
				if(this.themeId){
					url = '/sys/crossSchoolInteraction/update';
					this.addEditInfo.id = this.themeId;
				};
				// if (param === 'release') { // 一键发布
				// 	url = '/sm/interactive/fastRelease';
				// }
				console.log(this.addEditInfo);
				// let parameters = new FormData();
				// parameters.append('labelIdList',idList ? idList : '');
				// parameters.append('name',this.addEditInfo.name);
				// // parameters.append('mode',this.addEditInfo.mode);
				// parameters.append('startTime',this.addEditInfo.startTime);
				// parameters.append('description',this.addEditInfo.description);
				// parameters.append('categoryId',this.themeValue);
				// if (this.addEditInfo.endTime) {
				// 	parameters.append('endTime',this.addEditInfo.endTime);
				// }
				// 	parameters.append('lecturer',this.addEditInfo.lecturer);
				// 	parameters.append('detail',JSON.stringify(this.addEditInfo.terminalList));
				// if (this.themeId) {
				// 	parameters.append('id', this.themeId);
				// }
				// console.log(parameters);
				let parameters = {}

				parameters.labelIdList = idList ? idList : '';
				parameters.name = this.addEditInfo.name;

				parameters.startTime = this.addEditInfo.startTime;
				parameters.description = this.addEditInfo.description;
				parameters.categoryId = this.themeValue;
				parameters.categoryName = this.addEditInfo.categoryName;
				if (this.addEditInfo.endTime) {
					parameters.endTime = this.addEditInfo.endTime;
				}
					parameters.lecturer = this.addEditInfo.lecturer;
					parameters.lecturerId = this.addEditInfo.lecturerId;
					parameters.detail = this.addEditInfo.terminalList;
				if (this.themeId) {
					parameters.id =  this.themeId;
				}
				this.$axios.post(url, parameters).then(res => {
					if(res.code == 200){
						this.$router.push('/sys/crossSchoolInteraction');
						this.$message('保存成功', 'success');
					}
				})
			},
			//验证
			verify(){
				if(this.$verify.isEmpty(this.themeValue)){
					this.$message('请选择类型', 'error');
					return true;
				}
				let ifResult = false;
				if (this.themeTypeList.length !== 0) {
					let ifType = this.themeTypeList.some((v, i) => {
						if (v.value === null || v.value === '') {
							this.$message(`${v.name}未选`, 'error');
							ifResult = false;
							return true
						}
						ifResult = true;
					});
				} else {
					ifResult = true;
				}
				if (!ifResult) {
					return true;
				}
				if (!this.addEditInfo.name) {
					this.$message('请输入课堂名称', 'error');
					return true;
				}
				if (this.addEditInfo.name.length > 50) {
					this.$message('课堂名称不能超过50字', 'error');
					return true;
				}

				if (!this.addEditInfo.startTime) {
					this.$message('请选择开始时间', 'error');
					return true;
				}
        if (this.addEditInfo.lecturerId === '') {
          this.$message('请选择主讲老师！', 'error');
          return true;
        }
        if (this.mainData.password === '' || this.$verify.letterNumLen(this.mainData.password,4,10)) {
          this.$message('请输入主讲学校验证码,4-10位大小写字母数字或组合！', 'error');
          return true;
        }
        
        for(let i in this.assistenList) {
          if(this.assistenList[i].mark === ''){
            this.$message('请选择互动学校！', 'error');
            return true;
          }
          if(this.assistenList[i].number === '' || this.roomNumTotal >6){
            this.$message('请输入房间数量，互动房间总数不超过6间！', 'error');
            return true;
          }
          if(this.assistenList[i].password === '' || this.$verify.letterNumLen(this.assistenList[i].password,4,10)){
            this.$message('请输入对应验证码,4-10位大小写字母数字或组合！', 'error');
            return true;
          }
        }

					// function isRepeat(arr) {
					// 	var hash = {};
					// 	for(var i in arr) {
					// 		if(hash[arr[i]]) {
					// 			return true;
					// 		}
					// 		hash[arr[i]] = true;
					// 	}
					// 	return false;
					// }

				if (this.addEditInfo.startTime < getNowDate()) {
					this.addEditInfo.startTime = getNowDate();
				}

				if (this.addEditInfo.endTime) {
					if(this.addEditInfo.startTime > this.addEditInfo.endTime){
						this.$message('开始时间不能大于结束时间', 'error');
						return true;
					}
				}
			
				if(this.addEditInfo.description && this.addEditInfo.description.length > 50){
					this.$message('简介最长50个字', 'error');
					return true;
				}
			}
		},
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.itemType {
		float: left;
		padding-left: 10px;
		padding-bottom: 10px;
	}

	.content-wrap{
		overflow: hidden;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 54px 60px;
	}
	.item-scroll{
		overflow: hidden;
		height: 100%;
		width: 100%;
		.box{
			overflow-y: scroll;
			width: 102%;
			height: 100%;
		}
	}
	.item-wrap{
		display: flex;
		align-items: center;
		margin-top: 25px;
		em{
			color: #F64646;
		}
		p:first-child{
			width: 100px;
			height: 40px;
			line-height: 40px;
			text-align: justify;
			color: #303133;
			font-size: 14px;
		}
		.input-s {
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
		span{
			margin-left: 35px;
			font-size: 14px;
			color: #409EFF;
			cursor: pointer;
		}
		.sub{
			font-size: 22px;
			color: #aaa;
		}
	}
	.upload-wrap{
		height: 130px;
		width: 280px;
		textarea{
			height: 130px;
			width: 280px;
			border: solid #DCDFE6 1px;
			resize: none;
		}
	}
	.upload-box{
		align-items: start;
		.p1{
			margin-right: 5px;
			line-height: 40px;
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
	.width-8{
		margin-right: 15px;
	}
	.add-assistant{
		width: 765px;
		margin-top: 15px;
		text-align: center;
		i{
			font-size: 22px;
			color: #aaa;
		}
	}
	.class-type{
		cursor: pointer;

		.act {
			border: solid 3px #5B8CFF;
		}
		
		img{
			width: 286px;
			border: solid 3px #FFF;
		}
		p{
			margin-top: 7px;
			text-align: center;
			font-size: 14px;
			color: #606266;
		}
	}
</style>


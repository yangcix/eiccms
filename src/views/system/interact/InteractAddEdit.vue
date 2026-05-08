<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="$route.query.themeid ? '编辑互动主题页' : '新增互动主题页'"
            ></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="box">
                    <div class="item-wrap">
                        <div style="display: flex">
                            <p style="line-height: 32px">分类</p>
                            <p style="padding-top: 6px"><em>*</em>：</p>
                        </div>
                        <div>
                            <div class="itemType width-9" style="padding-left: 0">
                                <el-select
                                    @change="handleTheme"
                                    v-model="themeValue"
                                    :popper-append-to-body="false"
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in themeData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="itemType width-9 itemList" v-for="(nape, index) in themeTypeList" :key="index">
                                <el-tooltip
                                    :disabled="nape.name.length > 12 ? false : true"
                                    class="item"
                                    effect="dark"
                                    :content="`请选择${nape.name}`"
                                    placement="top-start"
                                >
                                    <el-select
                                        :popper-append-to-body="false"
                                        clearable
                                        v-model="nape.value"
                                        :placeholder="`请选择${nape.name}`"
                                        v-if="nape.children"
                                    >
                                        <el-option
                                            v-for="item in nape.children"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
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
                        <p>主题名称</p>
                        <p><em>*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.name" clearable></el-input>
                    </div>

                    <!-- <div class="item-wrap">
						<p>互动模式</p>
						<p><em>*</em>：</p>
						<div class="class-type" @click="handleType('classroom')">
							<img :class="addEditInfo.mode === 1 ? 'act' : ''" src="../../../assets/imgs/class-mode1.png" alt="">
							<p>课堂模式</p>
						</div>

						<div class="class-type" @click="handleType('teaching')" style="padding-left:30px">
							<img :class="addEditInfo.mode === 2 ? 'act' : ''" src="../../../assets/imgs/class-mode2.png" alt="">
							<p>教学模式</p>
						</div>
					</div> -->

                    <div class="item-wrap">
                        <p>开始时间</p>
                        <p><em>*</em>：</p>
                        <el-date-picker
                            v-model="addEditInfo.startTime"
                            type="datetime"
                            style="width: 280px"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                            @change="changeDurationMin"
                        >
                        </el-date-picker>
                        <p class="err-notice">注：开始时间需大于当前时间</p>
                    </div>

                    <div>
                        <div class="item-wrap">
                            <p>课堂时长</p>
                            <p style="margin-right: 5px"><em></em>：</p>
                            <el-input
                                class="width-2"
                                v-model="addEditInfo.durationMinutes"
                                clearable
                                placeholder="请输入课堂时长"
                                @change="changeDurationMin"
                            ></el-input
                            >&nbsp;分钟
                            <p class="err-notice"><em>*</em>未填写则默认需手动结束</p>
                        </div>

                        <div class="item-wrap">
                            <p>主讲教师</p>
                            <p><em>*</em>：</p>
                            <el-select
                                v-model="mainData.orgId"
                                @change="shcoolChange('0')"
                                placeholder="选择学校"
                                class="width-8"
                                filterable
                            >
                                <el-option
                                    v-for="item in schoolList"
                                    :key="item.orgId"
                                    :label="item.name"
                                    :value="item.orgId"
                                >
                                </el-option>
                            </el-select>
                            <el-select v-model="mainData.userId" placeholder="选择教师" class="width-8" filterable>
                                <el-option
                                    v-for="item in teacherList"
                                    :key="item.userId"
                                    :label="item.name"
                                    :value="item.userId"
                                >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item-wrap" v-for="(val, index) in assistenList" :key="index">
                            <p>{{ index == 0 ? '听讲教师' : '' }}</p>
                            <p :style="{marginRight: index == 0 ? '' : '20px'}">
                                <em>{{ index == 0 ? '*' : '' }}</em
                                >{{ index == 0 ? '：' : '' }}
                            </p>
                            <el-select
                                v-model="val.orgId"
                                @change="shcoolChange('1', val, index)"
                                placeholder="选择学校"
                                class="width-8"
                                filterable
                            >
                                <el-option
                                    v-for="item in schoolList"
                                    :key="item.orgId"
                                    :label="item.name"
                                    :value="item.orgId"
                                >
                                </el-option>
                            </el-select>
                            <el-select v-model="val.userId" placeholder="选择教师" class="width-8" filterable>
                                <el-option
                                    v-for="item in val.teacherList"
                                    :key="item.userId"
                                    :label="item.name"
                                    :value="item.userId"
                                >
                                </el-option>
                            </el-select>
                            <i class="el-icon-remove-outline sub" @click="addAssistant(0, index)"></i>
                        </div>
                        <p class="add-assistant">
                            <i class="el-icon-circle-plus-outline" @click="addAssistant(1)"></i>
                        </p>
                        <div class="item-wrap" style="margin-top: 40px">
                            <p>旁听教室验证码</p>
                            <p><em>*</em>：</p>
                            <el-input class="width-2" v-model="addEditInfo.auditPassword"></el-input>
                            <span @click="getCode('main')">自动获取</span>
                        </div>
                        <div class="item-wrap upload-box">
                            <p>封面</p>
                            <p class="p1">：</p>
                            <div class="upload-wrap">
                                <el-upload
                                    :limit="1"
                                    :on-exceed="handleOnExceed"
                                    class="upload-demo"
                                    :action="uploadUrl"
                                    accept=".png,.jpg"
                                    :file-list="fileList"
                                    :on-change="selectFile"
                                    :on-remove="removeFile"
                                    list-type="picture"
                                    :auto-upload="false"
                                    drag
                                >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                        将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                                    </div>
                                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </div>
                        </div>
                    </div>

                    <!-- <div v-else>
						<div class="item-wrap">
							<p>观看权限</p>
							<p><em>*</em>：</p>
							<el-select v-model="addEditInfo.groupId" placeholder="请选择用户组" class="width-2" style="margin-right: 2px">
								<el-option
									v-for="item in groupList"
									:key="item.id"
									:label="item.groupName"
									:value="item.id">
								</el-option>
							</el-select>
							
						</div>
						<div class="item-wrap">
							<p>允许连麦</p>
							<p><em>*</em>：</p>
							<el-switch :active-value="1" :inactive-value="0" v-model="addEditInfo.joiner">
							</el-switch>
						</div>
						<div class="item-wrap">
							<p>是否录制</p>
							<p><em>*</em>：</p>
							<el-switch :active-value="1" :inactive-value="0" v-model="addEditInfo.recode">
							</el-switch>
						</div>
						<div class="item-wrap upload-box">
							<p>封面</p>
							<p class="p1">：</p>
							<div class="upload-wrap">
								<el-upload
									class="upload-demo"
									:action="uploadUrl"
									accept=".png,.jpg"
									:file-list="fileList"
									:on-change="selectFile"
									list-type="picture"
									:auto-upload="false"
									drag>
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF">点击上传</em></div>
									<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
								</el-upload>
							</div>
						</div>
					</div> -->

                    <div class="item-wrap upload-box" style="margin-top: 50px">
                        <p>简介</p>
                        <p class="p1">：</p>
                        <div class="upload-wrap">
                            <textarea v-model="addEditInfo.description"></textarea>
                        </div>
                    </div>

                    <el-button type="primary" class="edit-btn" @click="save('save')">保存</el-button>
                    <el-button type="primary" class="edit-btn" v-if="permission.fastRelease" @click="save('release')"
                        >一键发布</el-button
                    >
                </div>
                <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="creatShow" width="420px">
                    <div class="dialog-wrap">
                        <p class="err-delete">{{ totalMessage }}</p>
                        <div class="dialog-btn">
                            <el-button type="primary" @click="saveData">确 定</el-button>
                            <el-button @click="creatShow = false">取 消</el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            permission: [],
            param: '',
            title: '',
            totalMessage: '',
            successMsg: '',
            creatShow: false,
            uploadUrl: baseUrl + '/sm/interactive/save',
            fileList: [],
            listTeacher: [],
            typeInteract: 1,
            themeData: [
                {
                    id: 5,
                    name: '专递课堂',
                },
            ],
            valData: [],
            themeValue: '',
            themeId: '',
            themeTypeList: [],
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            addEditInfo: {
                mode: 1,
                auditPassword: '',
                interactivePassword: '',
                lecturer: '',
                description: '',
                groupId: '',
                recode: 0,
                joiner: 0,
                listTeacher: [],
                lecturerId: '',
                startTime: '',
                endTime: '',
            },
            schoolList: [],
            teacherList: [],
            buildlList: [],
            classroomList: [],
            recodeList: [],
            mainData: {
                orgId: '',
                userId: '',
                buildId: '',
                classroomId: '',
                terminalId: '',
                buildlList: '',
                classroomList: '',
                terminalList: '',
            },
            assistenList: [{orgId: '', userId: '', teacherList: []}],
        };
    },
    components: {},
    mounted() {
        this.handleListTeacher();
        if (localStorage.getItem('uiType') == 2) {
            this.handleGetType();
        }
        this.getSchoolList();
        this.getgroupList();
        if (this.$route.query.themeid) {
            this.themeId = this.$route.query.themeid;
            this.getThemeInfo();
            this.handleListTeacher();
        }
    },
    methods: {
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        // 获取主讲教师列表
        handleListTeacher() {
            this.$axios.get('/sys/user/listTeacher').then((res) => {
                console.log(res, '1111111');
                this.listTeacher = res.data;
            });
        },
        //获取用户组列表
        getgroupList() {
            this.$axios.get('/sm/theme/getSysGroup').then((res) => {
                this.groupList = res.data;
                console.log(this.groupList);
            });
        },
        // 移除封面
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        //上传的封面
        selectFile(file) {
            let isJpg;
            if (file.raw.type == 'image/jpeg' || file.raw.type == 'image/png' || file.raw.type == 'image/jpg') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.fileList = [];
                return this.$message('上传失败，文件格式错误', 'error');
            }
            if (file.raw.size / 1024 > 500) {
                this.fileList = [];
                return this.$message('封面只能上传jpg/png文件，且不超过500kb', 'error');
            } else {
                this.addEditInfo.file = file.raw;
            }
        },
        // handleType(type) {
        // 	this.addEditInfo.mode = type === 'classroom' ? 1 : 2;
        // 	if (type === 'classroom') {
        // 		this.handleListTeacher();
        // 		this.addEditInfo.lecturerId = '';
        // 	}
        // },
        // 一级分类 change
        handleTheme() {
            this.getTypeList();
        },
        // 获取类型
        handleGetType() {
            this.$axios.get('/sm/category/listAll').then((res) => {
                if (res.code === 200) {
                    let arr = res.data.filter((el) => el.id !== 1);
                    this.themeData = arr;
                }
            });
        },
        //编辑获取主体信息
        getThemeInfo() {
            this.$axios.get('/sm/interactive/info', {id: this.themeId}).then((res) => {
                this.addEditInfo = res.data;
                this.valData = res.data.labelList;
                this.addEditInfo.masterList = res.data.masterLists;
                this.addEditInfo.assistantList = res.data.assistantLists;
                this.assistenList = [];
                res.data.assistantLists.forEach((el) => {
                    let item = {
                        orgId: parseInt(el.orgId),
                        teacherList: [],
                        userId: el.userId,
                    };
                    this.assistenList.push(item);
                });
                this.themeValue = res.data.categoryId; // 获取编辑id赋给一级分类select
                if (this.themeValue !== '') {
                    this.getTypeList();
                }
                this.creatTerminalList();
                if (res.data.imgUrl) {
                    this.fileList = [{name: '', url: res.data.imgUrl}];
                } else {
                    this.fileList = [];
                }
                this.$set(
                    this.addEditInfo,
                    'durationMinutes',
                    this.$comjs.createDuraTionMin(this.addEditInfo.startTime, this.addEditInfo.endTime)
                );
            });
        },
        //构造学校和教室
        creatTerminalList() {
            this.mainData = {
                orgId: parseInt(this.addEditInfo.masterList[0].orgId),
                userId: this.addEditInfo.masterList[0].userId,
            };
            this.shcoolChange('2');
            for (let i = 0; i < this.addEditInfo.assistantList.length; i++) {
                this.shcoolChange('1', this.addEditInfo.assistantList[i], i, 1);
            }
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/sm/interactive');
            } else {
                this.$router.go(-1);
            }
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
        getTypeList() {
            this.$axios
                .get('/sm/label/listByCategory', {
                    categoryId: this.themeValue,
                    type: 2,
                    id: this.$route.query.themeid,
                })
                .then((res) => {
                    let treeList = creatTree(res.data);
                    console.log(treeList, '11');
                    let data = [];
                    treeList.forEach((val) => {
                        if (val.children) {
                            data.push(val);
                        }
                        val.value = this.valData.find((v) => v.parentId == val.id)
                            ? this.valData.find((v) => v.parentId == val.id).id
                            : '';
                    });
                    this.themeTypeList = data;
                });
        },
        //类型最多选择三个
        typeChange(val) {
            if (this.addEditInfo.labelIdList.length > 3) {
                this.addEditInfo.labelIdList = this.addEditInfo.labelIdList.splice(0, 3);
                this.$message('最多选择三个类型', 'error');
            }
        },
        //获取学校列表
        getSchoolList() {
            this.$axios
                .get('/sm/interactive/list', {
                    pageNum: 1,
                    pageSize: 10,
                })
                .then((res) => {
                    this.permission = this.creatPermit(res.data.permit);
                });
            this.$axios.get('/sm/interactive/getSchool').then((res) => {
                this.schoolList = res.data;
                // if (this.schoolList.length > 0) {
                // 	this.mainData.orgId = this.schoolList[0].orgId;
                // 	this.shcoolChange('main');
                // 	this.assistenList[0].orgId = this.schoolList[0].orgId;
                // 	this.shcoolChange(0);
                // }
            });
        },
        //选择学校
        shcoolChange(type, val, index, isChange) {
            if (type == '0') {
                this.$axios.get('/sm/interactive/getTeacher', {orgId: parseInt(this.mainData.orgId)}).then((res) => {
                    this.teacherList = res.data;
                    this.mainData.userId = '';
                    // if (this.schoolList.length > 0) {
                    // 	this.mainData.orgId = this.schoolList[0].orgId;
                    // 	this.shcoolChange('main');
                    // 	this.assistenList[0].orgId = this.schoolList[0].orgId;
                    // 	this.shcoolChange(0);
                    // }
                });
            } else if (type == 1) {
                this.$axios.get('/sm/interactive/getTeacher', {orgId: parseInt(val.orgId)}).then((res) => {
                    this.assistenList[index].teacherList = res.data;
                });
                if (isChange !== 1) {
                    this.assistenList[index].userId = '';
                }
            } else {
                this.$axios.get('/sm/interactive/getTeacher', {orgId: parseInt(this.mainData.orgId)}).then((res) => {
                    this.teacherList = res.data;
                });
            }
        },
        //根据学校id获取教学楼列表
        getTeachBuildList(type) {
            let obj = this.getitemObj(type);
            this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: obj.orgId}).then((res) => {
                obj.buildlList = res.data;
            });
        },
        //教学楼改变后教室修改
        buildChange(type) {
            let obj = this.getitemObj(type);
            obj.classroomList = [];
            obj.terminalList = [];
            obj.classroomId = '';
            obj.terminalId = '';
            this.getClassroomList(type);
        },
        //根据教学楼id获取教室列表
        getClassroomList(type) {
            let obj = this.getitemObj(type);
            this.$axios.get('/sys/classroom/getClassroomList', {buildingId: obj.buildId}).then((res) => {
                obj.classroomList = res.data;
            });
        },
        //教室改变后设备改变
        classroomChange(type) {
            let obj = this.getitemObj(type);
            obj.terminalList = [];
            obj.terminalId = '';
            this.getTerminalList(type);
        },
        //获取设备列表
        getTerminalList(type) {
            let obj = this.getitemObj(type);
            let data = {
                classroomId: obj.classroomId,
                startTime: this.addEditInfo.startTime,
                endTime: this.addEditInfo.endTime,
            };
            if (this.themeId) {
                data.interactiveId = this.themeId;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                obj.terminalList = res.data;
            });
        },
        //获取选择当前项
        getitemObj(type) {
            let obj;
            if (type == 'main') {
                obj = this.mainData;
            } else {
                obj = this.assistenList[type];
            }
            return obj;
        },
        //添加互动教室
        addAssistant(type, index) {
            //1添加 0减
            if (type) {
                if (this.assistenList.length == 3) {
                    return this.$message('听讲教师最多3个', 'error');
                }
                // let assLength = this.assistenList.length;
                this.assistenList.push({orgId: '', userId: '', teacherList: []});
                // this.assistenList.push({orgId: this.schoolList.length > 0 ? this.schoolList[0].orgId : '', userId: '', teacherList: [],});
                // this.shcoolChange(assLength);
                // this.shcoolChange(this.assistenList.length + 1);
            } else {
                if (this.assistenList.length == 1) {
                    return this.$message('听讲教师最少1个', 'error');
                }
                this.assistenList.splice(index, 1);
            }
        },
        //获取验证码
        getCode(type) {
            this.$axios.get('/sm/interactive/getRandomNum').then((res) => {
                if (type == 'main') {
                    this.addEditInfo.auditPassword = res.data;
                } else {
                    this.addEditInfo.interactivePassword = res.data;
                }
            });
        },
        //保存
        save(param) {
            // typeInteract === 1课堂模式
            this.param = param;
            if (this.verify()) {
                return;
            }
            this.title = '创建主题';
            this.totalMessage = '确认创建该主题？';
            this.successMsg = '新增成功';
            if (this.$route.query.themeid) {
                this.title = '修改主题';
                this.totalMessage = '确认修改该主题？';
                this.successMsg = '修改成功';
            }
            if (param == 'release') {
                this.title = '发布主题';
                this.totalMessage = '确认发布该主题？';
                this.successMsg = '发布成功';
            }
            this.creatShow = true;
        },
        saveData() {
            let terminalList = [];
            let idList = [];
            this.themeTypeList.forEach((v) => {
                if (v.value) {
                    idList.push(v.value);
                }
            });
            // if (this.addEditInfo.mode === 1) {
            this.assistenList.forEach((val) => {
                terminalList.push({
                    userId: val.userId,
                    orgId: val.orgId,
                });
            });
            // }

            // function getCode(list, id) {
            // 	let obj = {};
            // 	list.forEach(val => {
            // 		if(val.id == id){
            // 			obj.code = val.code;
            // 			obj.name = val.terminalName;
            // 		}
            // 	});
            // 	return obj;
            // };
            // if (this.addEditInfo.mode === 1 ) { // this.addEditInfo.mode;
            this.addEditInfo.terminalList = terminalList;
            // }
            this.addEditInfo.categoryId = this.themeValue;
            this.addEditInfo.labelIdList = idList ? idList : '';
            // this.addEditInfo.mode = this.typeInteract;
            let url = '/sm/interactive/save';
            if (this.themeId) {
                url = '/sm/interactive/update';
                this.addEditInfo.id = this.themeId;
            }
            if (this.param === 'release') {
                // 一键发布
                url = '/sm/interactive/fastRelease';
            }
            console.log(this.addEditInfo, 66);
            let parameters = new FormData();
            parameters.append('labelIdList', idList ? idList : '');
            parameters.append('fileDetection', this.addEditInfo.file !== null ? 0 : 1);
            parameters.append('name', this.addEditInfo.name);
            // parameters.append('mode',this.addEditInfo.mode);
            parameters.append('startTime', this.addEditInfo.startTime);
            parameters.append('description', this.addEditInfo.description);
            parameters.append('categoryId', this.themeValue);
            if (this.addEditInfo.endTime) {
                parameters.append('endTime', this.addEditInfo.endTime);
            }
            // if (this.addEditInfo.mode === 1) { // typeInteract === 1
            // parameters.append('lecturerId',this.addEditInfo.lecturerId);
            parameters.append('auditPassword', this.addEditInfo.auditPassword);
            parameters.append('assistantList', JSON.stringify(this.addEditInfo.terminalList));
            parameters.append(
                'masterList',
                JSON.stringify([{userId: this.mainData.userId, orgId: this.mainData.orgId}])
            );
            parameters.append('file', this.addEditInfo.file);
            // }
            // if (this.addEditInfo.mode === 2) {
            // 	// let formData = new FormData();
            // 	parameters.append('groupId',this.addEditInfo.groupId);
            // 	parameters.append('joiner',this.addEditInfo.joiner);
            // 	parameters.append('recode',this.addEditInfo.recode);
            // 	parameters.append('file',this.addEditInfo.file);
            // }
            if (this.themeId) {
                parameters.append('id', this.themeId);
            }
            console.log(parameters, 6632);
            this.$axios.post(url, parameters).then((res) => {
                if (res.code == 200) {
                    this.$router.push('/sm/interactive');
                    this.$message(this.successMsg, 'success');
                }
            });
        },
        //验证
        verify() {
            console.log('this.addEditInfo', this.addEditInfo);
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('分类未选择', 'error');
                return true;
            }
            let ifResult = false;
            if (this.themeTypeList.length !== 0) {
                let ifType = this.themeTypeList.some((v, i) => {
                    if (v.value === null || v.value === '') {
                        this.$message(`${v.name}未选择`, 'error');
                        ifResult = false;
                        return true;
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
                this.$message('请输入主题名称', 'error');
                return true;
            }
            if (this.addEditInfo.name.length > 50) {
                this.$message('主题名称不能超过50字', 'error');
                return true;
            }
            // if(this.$verify.chLetterNum(this.addEditInfo.name, 50)){
            // 	this.$message('名称为中文大小写字母和数字组成，最长50位！', 'error');
            // 	return true;
            // }

            if (!this.addEditInfo.startTime) {
                this.$message('请选择开始时间', 'error');
                return true;
            }
            if (this.addEditInfo.startTime < getNowDate()) {
                console.log('开始时间不能小于当前时间');
                this.addEditInfo.startTime = getNowDate();
                // return true;
            }
            if (this.addEditInfo.endTime) {
                if (this.addEditInfo.startTime > this.addEditInfo.endTime) {
                    this.$message('开始时间不能大于结束时间', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.endTime) {
                if (this.addEditInfo.endTime <= this.addEditInfo.startTime) {
                    this.$message('结束时间不能小于等于开始时间', 'error');
                    return true;
                }
            }
            // if (this.addEditInfo.mode === 1) {
            if (this.mainData.orgId === '') {
                this.$message('请选择主讲学校！', 'error');
                return true;
            }
            if (this.mainData.userId === '') {
                this.$message('请选择主讲教师！', 'error');
                return true;
            }

            let flag = false;
            let flags = false;
            let userIds = [];
            this.assistenList.forEach((val) => {
                if (this.$verify.isEmpty(val.userId)) {
                    flag = true;
                }
                if (this.$verify.isEmpty(val.orgId)) {
                    flags = true;
                }
                userIds.push(val.userId);
            });
            if (flags) {
                this.$message('听讲学校不能为空', 'error');
                return true;
            }
            if (flag) {
                this.$message('听讲教师不能为空', 'error');
                return true;
            }
            userIds.push(this.mainData.userId);
            console.log(userIds, 'userIds');
            function isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]]) {
                        return true;
                    }
                    hash[arr[i]] = true;
                }
                return false;
            }
            if (isRepeat(userIds)) {
                this.$message('同一互动主题不能同一教师，请检查', 'error');
                return true;
            }
            if (this.addEditInfo.auditPassword == '') {
                this.$message('请输入旁听教室验证码', 'error');
                return true;
            }
            if (
                this.$verify.letterNum(this.addEditInfo.auditPassword, 20) ||
                this.addEditInfo.auditPassword.length < 6
            ) {
                this.$message('验证码为大小写字母数字组成，6-20位', 'error');
                return true;
            }

            // if (this.addEditInfo.startTime < getNowDate()) {
            // 	console.log('开始时间不能小于当前时间');
            // 	this.addEditInfo.startTime = getNowDate();
            // 	// return true;
            // }
            // } else {
            // 	if(this.$verify.isEmpty(this.addEditInfo.groupId)){
            // 		this.$message('请选择观看权限', 'error');
            // 		return true;
            // 	}
            // 	console.log('教学模式');
            // }

            // if (this.addEditInfo.startTime < getNowDate()) {
            // 	this.addEditInfo.startTime = getNowDate();
            // }

            if (
                this.addEditInfo.startTime &&
                this.addEditInfo.endTime &&
                new Date(this.addEditInfo.endTime).getTime() - new Date(this.addEditInfo.startTime).getTime() >
                    24 * 60 * 60 * 1000
            ) {
                this.$message('主题时长不能超过24小时', 'error');
                return true;
            }
            if (this.addEditInfo.startTime !== '' || this.addEditInfo.startTime !== null) {
                if (
                    new Date(this.addEditInfo.startTime).getTime() - new Date(getNowDate()).getTime() >
                    20 * 24 * 60 * 60 * 1000
                ) {
                    this.$message('仅支持发布20天内（含）的主题', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.endTime !== '' || this.addEditInfo.endTime !== null) {
                if (
                    new Date(this.addEditInfo.endTime).getTime() - new Date(getNowDate()).getTime() >
                    20 * 24 * 60 * 60 * 1000
                ) {
                    this.$message('仅支持发布20天内（含）的主题', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.description && this.addEditInfo.description.length > 50) {
                this.$message('简介最长50个字', 'error');
                return true;
            }
            if (this.addEditInfo.durationMinutes) {
                if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                    this.$message('课堂时长只能输入正整数', 'error');
                    return true;
                }
                if (this.addEditInfo.durationMinutes.length > 4) {
                    this.$message('课堂时长最多只能9999分钟', 'error');
                    return true;
                }
            }
        },
        // 更改课堂时长
        changeDurationMin() {
            this.calcEndTime();
        },
        // 计算课堂结束时间
        calcEndTime() {
            if (!this.addEditInfo.startTime || !this.addEditInfo.durationMinutes) {
                this.addEditInfo.endTime = '';
                return;
            }
            this.addEditInfo.endTime = this.$comjs.addMinutesByTimestamp(
                this.addEditInfo.startTime,
                this.addEditInfo.durationMinutes
            );
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.item-wrap .itemType:first-child {
    padding-left: 0px;
}
.el-upload-dragger {
    width: 280px;
    height: 130px;
}
.el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}
.itemType {
    float: left;
    padding-left: 10px;
    padding-bottom: 10px;
}

.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 54px 60px;
}
.item-scroll {
    /* overflow: hidden; */
    height: 100%;
    width: 100%;
    .box {
        overflow-y: scroll;
        width: 102%;
        height: 100%;
    }
}
.item-wrap {
    display: flex;
    align-items: center;
    margin-top: 25px;
    font-size: 14px;
    color: #303133;
    em {
        color: #f64646;
    }
    p:first-child {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
        color: #303133;
        font-size: 14px;
    }
    p:first-child:after {
        content: '';
        display: inline-block;
        width: 100%;
    }
    span {
        margin-left: 35px;
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
    }
    .sub {
        font-size: 22px;
        color: #aaa;
    }
}
.upload-wrap {
    height: 130px;
    width: 280px;
    textarea {
        height: 130px;
        width: 280px;
        border: solid #dcdfe6 1px;
        resize: none;
    }
}
.upload-box {
    ::v-deep .el-upload-dragger {
        width: 280px;
        height: 130px;
    }
    align-items: start;
    .p1 {
        margin-right: 5px;
        line-height: 40px;
    }
    ::v-deep .el-upload-list {
        margin: -146px 0 0 25px;
        width: 222px;
    }
}
.edit-btn {
    width: 160px;
    height: 40px;
    margin: 35px 0 60px 130px;
}
.err-notice {
    margin-left: 20px;
    color: #b3b6ba;
    font-size: 12px;
    &.err-color {
        color: #f64646;
    }
}
.width-8 {
    margin-right: 15px;
}
.add-assistant {
    width: 765px;
    margin-top: 15px;
    text-align: center;
    i {
        font-size: 22px;
        color: #aaa;
    }
}
.class-type {
    cursor: pointer;

    .act {
        border: solid 3px #5b8cff;
    }

    img {
        width: 286px;
        border: solid 3px #fff;
    }
    p {
        margin-top: 7px;
        text-align: center;
        font-size: 14px;
        color: #606266;
    }
}
</style>

<style>
/* .el-upload-list{
		margin: -145px 0 0 15px;
		width: 250px;
	} */
/* .el-upload-list__item-status-label{
		display: block;
	} */
</style>

<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.themeid ? '编辑' : '新增'}课前指导`"
            ></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="box">
                    <div class="item-wrap" v-if="!isEdit || (isEdit && isTranslationPending)">
                        <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                        <p>{{ aiNum }}次</p>
                        <p class="err-notice"><em>*</em>数据在选择教师后显示！</p>
                    </div>
                    <div class="item-wrap" v-if="!isEdit || (isEdit && isTranslationPending)">
                        <p>优先使用<em>*</em>：</p>
                        <el-select :popper-append-to-body="false" v-model="addEditInfo.aiProjectId" class="width-2">
                            <el-option
                                v-for="item in useList"
                                :key="item.allocationId"
                                :label="item.projectName + '-' + item.residueNum + '次'"
                                :value="item.allocationId"
                            >
                            </el-option>
                        </el-select>
                        <p class="err-notice"><em>*</em>数据在选择教师后显示！</p>
                    </div>
                    <div class="item-wrap">
                        <p>课程名称<em>*</em>：</p>
                        <el-input
                            class="width-2"
                            v-model="addEditInfo.name"
                            placeholder="请输入课程名称"
                            clearable
                        ></el-input>
                        <p class="err-notice"><em>*</em>该名称需为教材上的课程名称</p>
                    </div>
                    <div class="item-wrap">
                        <p>课堂类型<em>*</em>：</p>
                        <el-radio-group
                            v-model="addEditInfo.classTypeId"
                            style="display: flex; justify-content: center; align-items: center"
                        >
                            <el-radio v-for="(item, index) in classTypeList" :label="item.id" :key="index">{{
                                item.name
                            }}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="item-wrap">
                        <p>学校<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.schoolId"
                            @change="schoolChange"
                            placeholder="选择学校"
                            class="width-2"
                            style="margin-right: 10px"
                            filterable
                        >
                            <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>年级<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.gradeId"
                            placeholder="选择年级"
                            class="width-2"
                            style="margin-right: 10px"
                            filterable
                            @focus="focusGrade()"
                        >
                            <el-option
                                v-for="item in gradeList"
                                :key="item.gradeId"
                                :label="item.name"
                                :value="item.gradeId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>学科<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.subjectId"
                            placeholder="选择学科"
                            class="width-2"
                            filterable
                        >
                            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>教师<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.teacherId"
                            placeholder="选择教师"
                            class="width-2"
                            filterable
                            remote
                            clearable
                            :remote-method="getTeacherList"
                            :loading="teacherSelectLoading"
                            @clear="getTeacherList"
                            @change="changeTeacher"
                        >
                            <el-option
                                v-for="item in teacherList"
                                :key="item.userId"
                                :label="item.name + (item.schoolName ? '-' + item.schoolName : '') + '-' + item.code"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap">
                        <p>历史课程<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.type"
                            class="width-4"
                            placeholder="类型"
                            @change="changeType"
                        >
                            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.historyCourseId"
                            class="width-6"
                            placeholder="选择历史课程"
                        >
                            <el-option
                                v-for="item in historyCourseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap edufile">
                        <p>教案<em>*</em>：</p>
                        <el-upload
                            ref="edufileupload"
                            :action="eduFileUrl"
                            class="upload-edufile"
                            accept=".docx,"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :before-upload="eduBeforeupload"
                            multiple
                            :with-credentials="true"
                            :limit="5"
                            :on-exceed="handleExceed"
                            :on-error="handleEduError"
                            :on-success="handleEduSuccess"
                            :file-list="eduFileList"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </div>
                    <el-button
                        :loading="loadingBtn"
                        class="edit-btn"
                        @click="httpRequest(true)"
                        v-if="!isEdit || (isEdit && isTranslationPending)"
                        >暂存</el-button
                    >
                    <el-button :loading="loadingBtn" type="primary" class="edit-btn" @click="httpRequest(false)"
                        >提交</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Message} from 'element-ui';
import {baseUrl} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            aiNum: 0,
            classTypeList: [],
            gradeList: [],
            subjectList: [],
            teacherList: [],
            fileList: [],
            userInfo: JSON.parse(localStorage.getItem('userInfo')),
            addEditInfo: {
                teacherId:
                    JSON.parse(localStorage.getItem('userInfo')).userId == 1 ||
                    JSON.parse(localStorage.getItem('userInfo')).userId == 2
                        ? ''
                        : JSON.parse(localStorage.getItem('userInfo')).userId,
            },
            schoolList: [], // 可选择的学校
            loadingBtn: false,
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            eduFileList: [], // 已上传文件
            teachingFileIds: [], // 一键发布时上传文件数组
            loading: false,
            useList: [],
            historyCourseList: [],
            teacherSelectLoading: false,
            typeList: [
                {id: 1, name: '磨课'},
                {id: 2, name: '评课'},
            ],
            curParams: {},
            curUrl: '',
            isTranslationPending: false,
            isEdit: false,
        };
    },
    mounted() {
        // 编辑
        if (this.$route.query.themeid) {
            this.themeId = this.$route.query.themeid;
            this.getThemeInfo(); //编辑获取主体信息
            this.isEdit = true;
        } else {
            // 新增
            // 如果是教师个人，默认带出教师名称
            if (!(this.userInfo.userId == 1 || this.userInfo.userId == 2)) {
                this.getTeacherList(this.userInfo.nickName);
                this.getUseList();
                this.changeTeacher(this.userInfo.userId);
            }
            // 管理员需要在选择学校之后再去请求班级下拉
            if (!(this.userInfo.nickName == 'super' || this.userInfo.nickName == 'admin')) {
                this.getGradeList();
            }
        }
        this.getClassTypeList(); // 获取课型
        this.getSchoolList(); //获取学校列表
        this.getSubjectList();
    },
    methods: {
        getClassTypeList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 33}).then((res) => {
                this.classTypeList = res.data;
            });
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        getGradeList() {
            let orgId = '';
            // 管理员需要在选中学校之后将学校id作为参数
            if (this.userInfo.nickName == 'super' || this.userInfo.nickName == 'admin') {
                orgId = this.addEditInfo.schoolId;
            } else {
                orgId = this.userInfo.orgId;
            }
            this.$axios.get('/aiGrinding/getGrade', {orgId: orgId}).then((res) => {
                this.gradeList = res.data;
            });
        },
        getTeacherList(name) {
            // 如果没有关键字或者清空文本框，就不请求数据且清掉下拉缓存数据。数据过多，请求全部的话，会因为渲染导致页面卡顿
            if (!name) {
                this.teacherList = [];
                return;
            }
            this.teacherSelectLoading = true;
            this.$axios.post('/sm/interactive/getUserList', {nickName: name}).then((res) => {
                this.teacherList = res.data;
                this.teacherSelectLoading = false;
            });
        },
        // 移除文件
        handleRemove(file, fileList) {
            if (fileList.length == 0) {
                this.teachingFileIds = [];
            }
        },
        // 文件数量限制
        handleExceed(files, fileList) {
            this.$message(`当前限制选择 5 个文件`, 'error');
        },
        // 移除文件之前
        beforeRemove(file, fileList) {
            const max = 1024 * 1024; // 1M
            if (file.size / max > 50) {
                return true;
            } else {
                if (file.percentage && file.percentage !== 100) {
                    // 未上传成功取消请求
                    this.$refs.edufileupload.abort();
                    return true;
                }
                if (this.themeId) {
                    // 存再themeId 即为编辑   // 删除不调用删除接口
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == file.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                        if (file.response && item == file.response.data.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                    return true;
                } else {
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == file.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                        if (file.response && item == file.response.data.id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                    return true;
                }
            }
        },
        // edu上传之前
        eduBeforeupload(file) {
            let isJpg;
            if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.$message('上传失败，文件格式错误', 'error');
                return false;
            }
            const max = 1024 * 1024; // 1M
            if (file.size / max > 50) {
                this.$message('单个文件不得超过50M', 'error');
                return false;
            }
        },
        // 上传文件的错误回调
        handleEduError(error, file, fileList) {
            let errorM = JSON.parse(error.message);
            this.$message(errorM.message, 'error');
        },
        // 上传文件的成功回调
        handleEduSuccess(response, file, fileList) {
            // console.log(response, file, fileList,this.teachingFileIds)
            console.log(response);

            if (response.code == 200) {
                this.teachingFileIds.push(response.data.id);
                console.log(this.teachingFileIds);
            }
        },
        //编辑获取主体信息
        getThemeInfo() {
            this.$axios.get('/aiPreClassGuidance/info', {id: this.themeId}).then((res) => {
                if (res.data.coverUrl) {
                    this.fileList = [{name: '', url: res.data.coverUrl}];
                } else {
                    this.fileList = [];
                }
                let eduFileList = res.data.teachingFileList;
                if (eduFileList != null && eduFileList != '[]' && eduFileList != '') {
                    this.teachingFileIds = eduFileList.map((i) => i.id);
                    this.eduFileList = eduFileList;
                } else {
                    this.eduFileList = [];
                    this.teachingFileIds = [];
                }
                this.addEditInfo = res.data;
                this.getGradeList();
                this.getTeacherList(this.$route.query.teacherName);
                this.curParams['teacherIdList'] = [this.addEditInfo.teacherId];
                this.changeType(this.addEditInfo.type);
                this.getUseList();
                // 暂存
                if (this.addEditInfo.status == -1) {
                    this.isTranslationPending = true;
                }
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/aiPreClassGuidance');
            } else {
                this.$router.go(-1);
            }
        },
        //获取学校列表
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
            });
        },
        //选择学校后 教学楼、教室修改
        schoolChange() {
            if (this.userInfo.nickName == 'super' || this.userInfo.nickName == 'admin') {
                this.$set(this.addEditInfo, 'gradeId', '');
                this.getGradeList();
            }
        },
        /**
         * 覆盖默认上传，手动上传
         * @param isTranslationPending 是否暂存
         */
        httpRequest(isTranslationPending) {
            if (this.verify()) {
                return;
            }
            this.addEditInfo['planId'] = this.teachingFileIds;
            this.addEditInfo['createUserId'] = this.userInfo.userId;
            // 暂存传值：status == -1
            this.addEditInfo['status'] = isTranslationPending ? -1 : 1;
            let url = '/aiPreClassGuidance/save';
            if (this.addEditInfo.id) {
                // 编辑更新
                url = '/aiPreClassGuidance/update';
            }
            this.$axios.post(url, this.addEditInfo).then(
                (res) => {
                    if (res.code == 200) {
                        setTimeout(() => {
                            if (this.$route.path == '/sm/preClassGuideAddEdit') {
                                this.$router.push('/aiPreClassGuidance');
                            }
                            this.$message(res.data, 'success');
                        }, 500);
                    } else if (res.code == -3000) {
                        this.upErrorMsg = res.message;
                        this.upErrorShow = true;
                    }
                },
                (err) => {
                    if (err.message === '取消成功') {
                        this.$message(err.message, 'success', 70, 3000);
                    } else {
                        this.$message(err.message, 'error', 70, 3000);
                    }
                }
            );
            // }
            // });
        },
        //验证
        verify() {
            Message.closeAll();
            // 暂存编辑、新增需要判断剩余次数
            if ((this.isEdit && this.isTranslationPending) || !this.isEdit) {
                if (this.aiNum == 0) {
                    this.$message('AI分析剩余次数不足！', 'error');
                    return true;
                }
                if (!this.addEditInfo.aiProjectId) {
                    this.$message('请选择优先使用的项目！', 'error');
                    return true;
                }
            }
            if (!this.addEditInfo.name) {
                this.$message('课程名称不能为空！', 'error');
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 100)) {
                this.$message('课程名称由中文大小写字母数字组成，最长100位！', 'error');
                return true;
            }
            if (!this.addEditInfo.classTypeId || !this.addEditInfo.type) {
                this.$message('请选择课堂类型！', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.schoolId)) {
                this.$message('请选择学校！', 'error');
                return true;
            }
            if (!this.addEditInfo.gradeId) {
                this.$message('请选择年级！', 'error');
                return true;
            }
            if (!this.addEditInfo.subjectId) {
                this.$message('请选择学科！', 'error');
                return true;
            }
            if (!this.addEditInfo.teacherId) {
                this.$message('请选择教师！', 'error');
                return true;
            }
            if (!this.addEditInfo.historyCourseId) {
                this.$message('请选择历史课程！', 'error');
                return true;
            }
            if (this.teachingFileIds.length == 0) {
                this.$message('教案必须上传！', 'error');
                return true;
            }
        },
        getUseList() {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            let params = {};
            params['productType'] = 4;
            params['currentUserId'] = this.addEditInfo.teacherId;
             this.$comjs.getUseList(this, params);
        },
        getHistoryCourseList() {
            this.curParams['pageNum'] = 1;
            this.curParams['pageSize'] = -1;
            this.curParams['aiStatusList'] = [2];
            this.$axios.post(this.curUrl, this.curParams).then((res) => {
                if (res.code == 200) {
                    this.historyCourseList = res.data.map((item) => ({
                        name: item.name,
                        id: item.id,
                    }));
                }
            });
        },
        changeType(val) {
            this.curUrl = val == 1 ? '/aiGrinding/list' : '/sm/comment/list';
            if (this.curParams['teacherIdList'].length != 0) {
                this.getHistoryCourseList();
            }
        },
        changeTeacher(val) {
            if (val) {
                this.curParams['teacherIdList'] = [val];
                if (this.curUrl) {
                    this.getHistoryCourseList();
                }
                this.getUseList();
            } else {
                this.historyCourseList = [];
                this.$set(this.addEditInfo, 'historyCourseId', '');
            }
        },
        focusGrade() {
            if (
                (this.userInfo.nickName == 'super' || this.userInfo.nickName == 'admin') &&
                !this.addEditInfo.schoolId
            ) {
                this.$message('请先选择学校！', 'error');
                return;
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 24px 60px 54px;

    .item-scroll {
        overflow: auto;
        height: 100%;
        width: 100%;
        .box {
            min-width: 900px;
            width: 100%;
            height: 100%;
        }
        .error-msg-content {
            width: 60%;
            height: 50px;
            background-color: #fff7ea;
            color: #f59a23;
            line-height: 50px;
            text-indent: 20px;
        }

        .item-wrap {
            display: flex;
            align-items: center;
            margin-top: 25px;

            em {
                color: #f64646;
            }

            p:first-child {
                width: 80px;
                height: 40px;
                line-height: 40px;
                color: #303133;
                font-size: 14px;
            }

            p:first-child:after {
                content: '';
                display: inline-block;
                width: 100%;
            }

            .err-notice {
                margin-left: 14px;
                color: #b3b6ba;
                font-size: 12px;

                &.err-color {
                    color: #f64646;
                }
            }
        }
    }
    .edufile {
        align-items: flex-start;

        p {
            height: 40px;
            line-height: 40px;
        }
    }
    .edit-btn {
        width: 160px;
        height: 40px;
        margin: 35px 0 60px 130px;
    }
    .edufile .el-upload-list {
        margin: 0 !important;
    }

    .edufile .el-upload-list__item-name {
        padding: 0 !important;
        overflow: hidden;
        width: 240px;
        text-overflow: ellipsis;
    }
}
::v-deep.edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}
</style>

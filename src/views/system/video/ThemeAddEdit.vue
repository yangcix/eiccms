<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.themeid ? '编辑' : '新增'}录制主题页`"
            ></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="box">
                    <div class="notice-wrap">
                        <p>
                            关于录制的主题时间：录制的录制时间建议小于{{
                                versions.version === 1 ? 6 : 8
                            }}小时，若一场录制的录制时间超{{
                                versions.version === 1 ? 6 : 8
                            }}小时建议分上中下场拆分为多个录制；
                        </p>
                        <p>
                            关于存储：若录制中的视频超过存储硬盘上限，将导致录制的视频无效，故出现存储预警则无法进行录制应采取相应处理腾出存储空间；
                        </p>
                        <p>关于未填课堂时长：①开启录制-结束录制需管理员后台手动操作；</p>
                        <p style="margin-left: 126px">
                            ②开启录制-若录制{{ versions.version === 1 ? 6 : 8 }}小时未手动结束，则系统自动结束录制；
                        </p>
                    </div>

                    <div class="item-wrap">
                        <div style="display: flex">
                            <p style="line-height: 32px">分类</p>
                            <p style="padding-top: 6px"><em>*</em>：</p>
                        </div>
                        <div>
                            <div class="itemType width-9" style="padding-left: 0">
                                <el-select
                                    :popper-append-to-body="false"
                                    @change="handleTheme"
                                    v-model="themeValue"
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
                            <div class="itemType width-9" v-for="(nape, index) in themeTypeList" :key="index">
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
						v-if="themeValue"
						:show-all-levels="false"
						style="width: 280px;margin-left:20px"
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
                        <p class="err-notice">
                            注：教学类录制主题名称规则为课程名称+教师名称，例如：自由落体运动【周杰】
                        </p>
                    </div>

                    <div class="item-wrap">
                        <p>录制模式</p>
                        <p><em>*</em>：</p>
                        <div class="class-type" @click="handleType('classroom')">
                            <img
                                :class="addEditInfo.liveMode === 1 ? 'act' : ''"
                                src="@/assets/imgs/live-mode1.png"
                                alt=""
                            />
                            <p>录播录制</p>
                        </div>

                        <div class="class-type" @click="handleType('teaching')" style="padding-left: 30px">
                            <img
                                :class="addEditInfo.liveMode === 2 ? 'act' : ''"
                                src="@/assets/imgs/live-mode2.png"
                                alt=""
                            />
                            <p>远程教学</p>
                        </div>
                    </div>

                    <div class="item-wrap">
                        <p>开始时间</p>
                        <p><em>*</em>：</p>
                        <el-date-picker
                            v-model="addEditInfo.startTime"
                            type="datetime"
                            style="width: 280px"
                            @change="clearTerminal"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                        >
                        </el-date-picker>
                        <p class="err-notice">注：开始时间需大于当前时间</p>
                    </div>

                    <div class="item-wrap" v-if="addEditInfo.liveMode === 1">
                        <p>课堂时长</p>
                        <p style="margin-right: 5px"><em></em>：</p>
                        <el-input
                            class="width-2"
                            v-model="addEditInfo.durationMinutes"
                            clearable
                            placeholder="请输入课堂时长"
                            @change="changeDurationMin"
                        ></el-input>
                        &nbsp;分钟
                        <p class="err-notice">注：未填写则默认需手动结束</p>
                    </div>
                    <div class="item-wrap">
                        <p>{{ addEditInfo.liveMode === 1 ? '录制位置' : '所属学校' }}</p>
                        <p><em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.orgId"
                            @change="shcoolChange"
                            placeholder="请选择学校"
                            class="width-2"
                            style="margin-right: 10px"
                            filterable
                        >
                            <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="item-wrap" v-if="addEditInfo.liveMode === 1">
                        <p style="margin-right: 23px"></p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.buildingId"
                            @change="buildChange"
                            placeholder="请选择教学楼"
                            style="margin-right: 10px; width: 150px"
                            filterable
                        >
                            <el-option v-for="item in buildlList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.classroomId"
                            @change="classroomChange(1)"
                            placeholder="请选择教室"
                            style="width: 120px"
                            filterable
                        >
                            <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="item-wrap" v-if="addEditInfo.liveMode === 1">
                        <p>录制设备</p>
                        <p><em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.terminalIdList"
                            placeholder="请选择设备"
                            class="width-2"
                            filterable
                        >
                            <el-option
                                v-for="item in terminalIdList"
                                :key="item.id"
                                :label="item.terminalName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <p class="err-notice">注：提前添加设备并绑定至录制教室</p>
                    </div>
                    <div class="item-wrap">
                        <p>授课教师</p>
                        <p><em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.teacherId"
                            placeholder="请选择授课教师"
                            class="width-2"
                            filterable
                            remote
                            clearable
                            :remote-method="getTeacherList"
                            :loading="teacherSelectLoading"
                            @clear="getTeacherList"
                            :disabled="curShowType == 4"
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
                        <p>观看权限</p>
                        <p><em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.groupId"
                            placeholder="请选择用户组"
                            class="width-2"
                            style="margin-right: 2px"
                            filterable
                        >
                            <el-option
                                v-for="item in groupList"
                                :key="item.id"
                                :label="item.groupName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <p class="err-notice">注：选择观看授权前先添加用户组</p>
                    </div>
                    <div class="item-wrap" v-if="addEditInfo.groupId == 1">
                        <p>观看密码</p>
                        <p><em style="opacity: 0">*</em>：</p>
                        <el-input class="width-2" v-model="addEditInfo.password" clearable></el-input>
                        <p class="err-notice">注：密码须6位数字或字母或二者组成</p>
                    </div>
                    <div class="item-wrap" v-if="addEditInfo.liveMode === 2">
                        <p>连麦</p>
                        <p><em>*</em>：</p>
                        <el-switch v-model="addEditInfo.joiner"> </el-switch>
                    </div>

                    <!-- <div class="item-wrap" v-if="addEditInfo.recode && addEditInfo.liveMode === 1">
						<p>机位选择</p>
						<p><em>*</em>：</p>
						<el-select :popper-append-to-body="false" v-model="addEditInfo.recodeIdList"  placeholder="请选择录制机位" class="width-2">
							<el-option
								v-for="(item, index) in recodeList"
								:key="index"
								:label="item.terminalName"
								:value="item.id">
							</el-option>
						</el-select>
					</div> -->

                    <!-- <div class="item-wrap">
						<p>热门推荐</p>
						<p><em>*</em>：</p>
						<el-switch
							v-model="addEditInfo.hot">
						</el-switch>
					</div> -->

                    <div class="item-wrap" v-if="addEditInfo.liveMode === 1">
                        <p>播放方式</p>
                        <p><em>*</em>：</p>
                        <el-radio v-model="addEditInfo.mode" label="0">h5</el-radio>
                        <!-- <div @click="handleDisabled()"> -->
                        <!-- <el-radio v-model="addEditInfo.mode" label="1">flash</el-radio> -->
                        <!-- </div> -->
                    </div>

                    <div class="item-wrap edufile">
                        <p>教学文件</p>
                        <p>：</p>
                        <el-upload
                            ref="edufileupload"
                            :action="eduFileUrl"
                            class="upload-edufile"
                            accept=".ppt,.pptx,.pdf,.doc,.docx,.jpg,.png,.zip,.rar,.xls,.xlsx"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :before-upload="eduBeforeupload"
                            multiple
                            :with-credentials="true"
                            :limit="5"
                            :on-exceed="handleExceed"
                            :on-error="handleEduError"
                            :on-success="handleEduSuccess"
                            :file-list="edufileList"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">
                                只能上传ppt/word/pdf/jpg/png/xls/zip/rar教学相关文件，大小需小于50M
                            </div>
                        </el-upload>
                    </div>

                    <div class="item-wrap">
                        <p>录制</p>
                        <p><em>*</em>：</p>
                        <el-switch v-model="addEditInfo.recode"> </el-switch>
                        <!-- <p class="err-notice">注：同时开启录制和公网录制，视频会自动进行公网点播</p> -->
                    </div>

                    <div class="item-wrap">
                        <p>公网录制</p>
                        <p><em>*</em>：</p>
                        <el-switch :active-value="1" :inactive-value="0" v-model="addEditInfo.publicLive"> </el-switch>
                        <p class="err-notice">注：公网录制需保证智教慧学灵枢云账号中有足够的流量，否则可能影响录制</p>
                    </div>

                    <div class="item-wrap" v-if="addEditInfo.publicLive === 1">
                        <p>公网观看权限</p>
                        <p><em>*</em>：</p>
                        <el-radio v-model="addEditInfo.watchType" :label="0">匿名</el-radio>
                        <el-radio v-model="addEditInfo.watchType" :label="1">密码观看</el-radio>
                    </div>

                    <div class="item-wrap" v-if="addEditInfo.watchType === 1 && addEditInfo.publicLive === 1">
                        <p>公网观看密码</p>
                        <p><em>*</em>：</p>
                        <el-input
                            class="width-2"
                            placeholder="6-20数字字母组成"
                            v-model.trim="addEditInfo.watchPassword"
                            clearable
                            show-password
                        ></el-input>
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

                    <div class="item-wrap upload-box" style="margin-top: 50px">
                        <p>简介</p>
                        <p class="p1">：</p>
                        <div class="upload-wrap">
                            <textarea v-model="addEditInfo.description"></textarea>
                        </div>
                    </div>
                    <el-button :loading="loadingBtn" type="primary" class="edit-btn" @click="httpRequest"
                        >保存</el-button
                    >
                    <el-button
                        :loading="loadingBtnOne"
                        type="primary"
                        class="edit-btn"
                        v-if="permission.fastRelease"
                        @click="httpRequest('release')"
                        >一键发布</el-button
                    >
                </div>
            </div>
        </div>

        <el-dialog width="500px" center title="操作提示" :visible.sync="outerVisible" :close-on-click-modal="false">
            <el-dialog
                :close-on-click-modal="false"
                width="400px"
                title="操作提示"
                center
                :visible.sync="innerVisible"
                append-to-body
            >
                <div class="tip">智教慧学灵枢云录制流量不足，请联系管理员！</div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="innerVisible = false">确认</el-button>
                </div>
            </el-dialog>
            <div class="tip">智教慧学灵枢云流量不足，无法创建公网录制</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleInstation">仅创建内网录制</el-button>
                <el-button @click="innerVisible = true">仍创建公网录制</el-button>
            </div>
        </el-dialog>

        <el-dialog width="500px" center title="操作提示" :visible.sync="onDemandOuter" :close-on-click-modal="false">
            <el-dialog
                :close-on-click-modal="false"
                width="400px"
                title="操作提示"
                center
                :visible.sync="onDemandInner"
                append-to-body
            >
                <div class="tip">智教慧学灵枢云录制流量不足，请联系管理员！</div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="onDemandInner = false">确认</el-button>
                </div>
            </el-dialog>
            <div class="tip">智教慧学灵枢云流量不足，无法创建公网点播</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleInstation">仅创建内网录制</el-button>
                <el-button @click="onDemandInner = true">仍创建公网点播</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            permission: [],
            versions: JSON.parse(sessionStorage.getItem('userInfo')) || [],
            outerVisible: false,
            innerVisible: false,
            teacherList: [],
            onDemandOuter: false, // 点播流量不足提示外
            onDemandInner: false, // 点播流量不足提示内
            uploadUrl: baseUrl + '/sm/label/save',
            fileList: [],
            themeTypeList: [], // 主题类型 数组
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            addEditInfo: {
                teacherId:
                    JSON.parse(window.localStorage.getItem('userInfo')).adminOrSuper == false
                        ? JSON.parse(window.localStorage.getItem('userInfo')).userId
                        : '',
                orgId: '', //学校id
                classroomId: '', //教室id
                buildingId: '', //教学楼id
                mode: '0', // 播放方式h5/falsh
                // terminalIdList: [], //选择的 录制设备 数组
                terminalIdList: '', //选择的 录制设备
                recode: false, // 是否录制
                // recodeIdList: [], //选择的 录制设备 数组
                // recodeIdList: '', //选择的 录制设备
                groupId: '', //选择的 观看权限 人员
                publicLive: 0, // 是否开启公网录制
                watchType: 0, // 公网观看权限
                watchPassword: '', // 公网观看密码
                liveMode: 1, // 录制模式
                joiner: 0, //是否连麦
                publicVod: 0, // 默认公网点播关闭，同时开启录制和录制打开
            },
            schoolList: [], // 可选择的学校
            buildlList: [], // 可选的教学楼
            classroomList: [], // 可选的教室
            terminalIdList: [], //可选的 录制设备 数组
            groupList: [], // 可选的 观看权限 人员类型
            // recodeList: [], // 可选的 录制机器 数组
            themeValue: '', // 主题类型主类
            themeData:
                JSON.parse(localStorage.getItem('userInfo')).famous == 1
                    ? [
                          {
                              id: 8,
                              name: '教师研修',
                          },
                          {
                              id: 2,
                              name: '课堂回顾',
                          },
                          {
                              id: 3,
                              name: '停课不停学',
                          },
                          {
                              id: 7,
                              name: '名师课堂',
                          },
                      ]
                    : [
                          {
                              id: 8,
                              name: '教师研修',
                          },
                          {
                              id: 2,
                              name: '课堂回顾',
                          },
                          {
                              id: 3,
                              name: '停课不停学',
                          },
                      ], // 可选的 主题类型主类
            valData: [],
            loadingBtn: false,
            loadingBtnOne: false,
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            edufileList: [], // 已上传文件
            teachingFileIds: [], // 一键发布时上传文件数组
            teacherSelectLoading: false,
            curShowType: null,
        };
    },
    components: {},
    mounted() {
        this.getUserInfo();
        if (localStorage.getItem('uiType') == 2) {
            this.handleGetType(); // 获取类型主类
            // this.getTypeList();
        }
        this.getSchoolList(); //获取学校列表
        this.getgroupList(); //获取用户组列表
        if (this.$route.query.themeid) {
            this.themeId = this.$route.query.themeid;
            this.getThemeInfo(); //编辑获取主体信息
        }
        if (!JSON.parse(window.localStorage.getItem('userInfo')).adminOrSuper) {
            this.getTeacherList(JSON.parse(localStorage.getItem('userInfo')).nickName);
        }
    },
    methods: {
        getUserInfo() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // 角色权限（1全部数据，2全校数据，3下级数据, 4个人数据）
            this.curShowType = userInfo.sysUserAuth[0].type;
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
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
                return this.$confirm(`确定移除该文件吗？`, '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
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
                            // 不为编辑，// 删除调用删除接口
                            let id = file.response.data.id;
                            this.deleteEduFile(id);
                        }
                    })
                    .catch(() => reject());
            }
        },
        // edu上传之前
        eduBeforeupload(file) {
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
            if (response.code == 200) {
                this.teachingFileIds.push(response.data.id);
            }
        },
        // 删除上传的文件
        deleteEduFile(id) {
            this.$axios.post('/upload/deleteTeachingFile', {id: id}).then((res) => {
                if (res.code == 200) {
                    this.teachingFileIds.forEach((item, index) => {
                        if (item == id) {
                            this.teachingFileIds.splice(index, 1);
                        }
                    });
                }
            });
        },
        csyz() {
            this.themeTypeList.some((v, i) => {
                if (v.value === null) {
                    this.$message(`第${i + 1}个未选`, 'error');
                    return true;
                }
            });
        },
        handleInstation() {
            this.outerVisible = false;
            this.onDemandOuter = false;
            this.addEditInfo.publicLive = 0;
            this.addEditInfo.publicVod = 0; // 关闭公网点播
            this.addEditInfo.watchType = 0;
            this.addEditInfo.watchPassword = '';
            const type = sessionStorage.getItem('isOne');
            if (type === 'release') {
                this.httpRequest('release');
            } else {
                this.httpRequest();
            }
        },

        // 选择主类并获取对应子类
        handleTheme() {
            this.addEditInfo.teacherId = '';
            this.getTypeList();
        },
        // 获取类型主类
        handleGetType() {
            this.$axios.get('/sm/category/listAll').then((res) => {
                if (res.code === 200) {
                    let arr = res.data.filter((el) => el.id !== 1);
                    this.themeData = arr;
                }
            });
        },
        // handleDisabled() {
        // 	this.$message('暂不支持FLASH模式', 'error');
        // },
        //编辑获取主体信息
        getThemeInfo() {
            this.$axios.get('/sm/theme/info', {id: this.themeId}).then((res) => {
                this.valData = res.data.labelList;
                // let recodeList = [];
                // let recodeIdList = [];
                let terminalIdList = [];
                // res.data.terminalList.forEach((val, index) => {
                // 	recodeList.push({id: val.terminalId, terminalName: val.terminalName});
                // 	// terminalIdList.push(val.terminalId);
                // 	if(val.recode == 1){
                // 		recodeIdList.push(val.terminalId);
                // 	};
                // });
                // if(res.data.recode == 1){
                // 	res.data.recodeIdList = recodeIdList;
                // };
                res.data.terminalIdList = res.data.terminalList.length > 0 ? res.data.terminalList[0].terminalId : '';
                res.data.recode = res.data.recode == 1 ? true : false;
                if (res.data.imgUrl) {
                    this.fileList = [{name: '', url: res.data.imgUrl}];
                } else {
                    this.fileList = [];
                }
                this.edufileList = res.data.teachingFileList;
                this.teachingFileIds = this.edufileList.map((i) => i.id);
                this.addEditInfo = res.data;
                this.getTeacherList(this.addEditInfo.teacherName);
                this.addEditInfo.hot = res.data.hot == 1;
                this.addEditInfo.mode = this.addEditInfo.mode + '';
                if (res.data.groupId == 1) {
                    this.addEditInfo.password = res.data.password;
                }
                this.addEditInfo.joiner = res.data.joiner == 1 ? true : false;
                this.addEditInfo.teacherId = res.data.teacherId;
                this.themeValue = res.data.categoryId; // 获取编辑id赋给一级分类select
                if (res.data.liveMode === 1) {
                    this.getTerminalIdList();
                    this.getTeachBuildList(res.data.orgId);
                    this.getClassroomList(res.data.buildingId);
                }
                if (this.themeValue !== '') {
                    this.getTypeList();
                }
                this.$set(
                    this.addEditInfo,
                    'durationMinutes',
                    this.$comjs.createDuraTionMin(this.addEditInfo.startTime, this.addEditInfo.endTime)
                );
                // setTimeout(() => {this.recodeList = recodeList;}, 100);
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/sm/theme');
            } else {
                this.$router.go(-1);
            }
        },
        //获取 对应 主题主类 的 子类 并转成树结构
        getTypeList() {
            this.$axios
                .get('/sm/label/listByCategory', {
                    categoryId: this.themeValue,
                    type: 0,
                    id: this.$route.query.themeid,
                })
                .then((res) => {
                    let treeList = creatTree(res.data);
                    let data = [];
                    treeList.forEach((val) => {
                        if (val.children) {
                            data.push(val);
                        }
                        // val.value = this.valData.find((v) => v.id === 12) ? this.valData.find((v) => v.id === 12).id : 0;
                    });
                    this.themeTypeList = data;
                    console.log('themeTypeList', this.themeTypeList);
                });
        },
        //获取学校列表
        getSchoolList() {
            this.$axios
                .get('/sm/theme/list', {
                    pageNum: 1,
                    pageSize: 10,
                })
                .then((res) => {
                    this.permission = this.creatPermit(res.data.permit);
                });
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
                // if (this.schoolList.length > 0) {
                // 	this.addEditInfo.orgId = this.schoolList[0].id;
                // 	if (this.addEditInfo.orgId) {
                // 		this.getTeachBuildList(this.addEditInfo.orgId);
                // 	}
                // }
            });
        },
        //根据学校id获取教学楼列表
        getTeachBuildList(orgId) {
            this.$axios.get('/sys/classroom/getTeachBuildList', {orgId: orgId}).then((res) => {
                this.buildlList = res.data;
                // if (this.buildlList.length > 0) {
                // 	this.addEditInfo.buildingId = this.buildlList[0].id;
                // 	if (this.addEditInfo.buildingId) {
                // 		this.getClassroomList(this.addEditInfo.buildingId);
                // 	}
                // }
            });
        },
        //根据教学楼id获取教室列表
        getClassroomList(buildingId) {
            this.$axios.get('/sys/classroom/getClassroomList', {buildingId: buildingId}).then((res) => {
                this.classroomList = res.data;
                // if (this.classroomList.length > 0) {
                // 	this.addEditInfo.classroomId = this.classroomList[0].id;
                // }
            });
        },
        //选择学校后 教学楼、教室修改
        shcoolChange(id) {
            // this.recodeList = [];
            this.buildlList = [];
            this.addEditInfo.buildingId = '';
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.classroomChange();
            this.getTeachBuildList(id);
        },
        //教学楼改变后教室修改
        buildChange(id) {
            // this.recodeList = [];
            this.addEditInfo.classroomId = '';
            this.classroomList = [];
            this.classroomChange();
            this.getClassroomList(id);
        },
        //教室改变后录制设备改变 录制机位改变
        classroomChange(type) {
            // this.recodeList = [];
            this.terminalIdList = [];
            // this.addEditInfo.terminalIdList = [];
            this.addEditInfo.terminalIdList = '';
            // this.addEditInfo.recodeIdList = '';
            if (type) {
                this.getTerminalIdList('room');
            }
            // this.terminalChange();
        },
        // // 录制设备改变
        // terminalChange(){
        // 	this.addEditInfo.recodeIdList = this.addEditInfo.terminalIdList
        // },
        // terminalChange(){
        // 	let temp = [];
        // 	this.terminalIdList.forEach(val => {
        // 		if(this.addEditInfo.terminalIdList.includes(val.id)){
        // 			temp.push(val); // 当前已选择的录制设备 添加 到 temp
        // 		}
        // 	});
        // 	let terminalIdList = [];
        // 	temp.forEach(val => {
        // 		if(this.addEditInfo.recodeIdList.includes(val.id)){
        // 			terminalIdList.push(val.id); // 在已选的录制设备中 添加已选择的录制设备 到 terminalIdList
        // 		}
        // 	});
        // 	this.addEditInfo.recodeIdList = terminalIdList;
        // 	this.recodeList = temp; // 已选的录制设备作为 录制设备的可选值 数组
        // 	// if (this.recodeList.length > 0) {
        // 	// 	this.addEditInfo.recodeIdList = [this.recodeList[0].id];
        // 	// }
        // },
        clearTerminal() {
            this.calcEndTime();
            if (this.addEditInfo.classroomId) {
                this.classroomChange(1);
            }
        },
        // 更改课堂时长
        changeDurationMin() {
            this.calcEndTime();
            if (this.addEditInfo.grindingClassroom) {
                this.classroomChange(1);
            }
        },
        // 计算课堂结束时间
        calcEndTime() {
            if (this.addEditInfo.durationMinutes) {
                if (this.addEditInfo.durationMinutes == 0) {
                    this.$message('课堂时长不能为0', 'error');
                    return;
                }
                if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                    this.$message('课堂时长只能输入正整数', 'error');
                    return;
                }
            }
            if (!this.addEditInfo.startTime || !this.addEditInfo.durationMinutes) {
                this.addEditInfo.endTime = '';
                return;
            }
            this.addEditInfo.endTime = this.$comjs.addMinutesByTimestamp(
                this.addEditInfo.startTime,
                this.addEditInfo.durationMinutes
            );
            console.log('获取到的结束时间---', this.addEditInfo.endTime);
        },
        //类型最多选择三个
        typeChange(val) {
            if (this.addEditInfo.labelIdList.length > 3) {
                this.addEditInfo.labelIdList = this.addEditInfo.labelIdList.splice(0, 3);
                this.$message('最多选择三个类型', 'error');
            }
        },
        //获取 录制设备列表
        getTerminalIdList(room) {
            let data = {
                classroomId: this.addEditInfo.classroomId,
                startTime: this.addEditInfo.startTime,
                endTime: this.addEditInfo.endTime,
                themeId: this.addEditInfo.id,
            };
            if (this.themeId) {
                data.themeId = this.themeId;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                // debugger
                this.terminalIdList = res.data;
                if (!this.$route.query.themeid || room === 'room') {
                    // 新增
                    const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';
                    // this.addEditInfo.terminalIdList = id ? [id] : '';
                    // this.addEditInfo.recodeIdList = id ? [id] : '';

                    this.addEditInfo.terminalIdList = id ? id : '';
                    // this.addEditInfo.recodeIdList = id ? id : '';
                }
                // console.log(this.terminalIdList.length,this.addEditInfo.terminalIdList.length);

                //根据录制机位默认设置录制机位可选数组   []
                // if (this.terminalIdList.length > 0 && this.addEditInfo.terminalIdList) {
                // 	this.recodeList = res.data

                // 	// const idList = this.terminalIdList;
                // 	// const addInfo = this.addEditInfo.terminalIdList;
                // 	// idList.forEach(val => {
                // 	// 	addInfo.forEach(item => {
                // 	// 		if (val.id === item) {
                // 	// 			this.recodeList.push(val);
                // 	// 		}
                // 	// 	});
                // 	// });

                // 	// if (this.recodeList.length > 0) {
                // 	// 	this.addEditInfo.recodeIdList = [this.recodeList[0].id];
                // 	// }
                // 	// this.addEditInfo.recodeIdList = ''; // 默认选中
                // }
            });
        },
        //获取用户组列表
        getgroupList() {
            this.$axios.get('/sm/theme/getSysGroup').then((res) => {
                this.groupList = res.data;
            });
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
        // 移除封面
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        //覆盖默认上传，手动上传
        httpRequest(param) {
            sessionStorage.setItem('isOne', param);
            if (this.verify()) {
                return;
            }
            if (param === 'release') {
                this.loadingBtnOne = true;
            } else {
                this.loadingBtn = true;
            }
            let typeIdList = [];
            this.themeTypeList.forEach((v) => {
                if (v.value !== null || v.value !== '') {
                    typeIdList.push(v.value);
                }
            });
            let idList = [];
            this.themeTypeList.forEach((v) => {
                if (v.value) {
                    idList.push(v.value);
                }
            });
            if (this.addEditInfo.publicLive && this.addEditInfo.recode) {
                this.addEditInfo.publicVod = 1;
            }
            let formData = new FormData();
            formData.append('file', this.addEditInfo.file ? this.addEditInfo.file : '');
            formData.append('name', this.addEditInfo.name);
            // formData.append('labelIdList', this.addEditInfo.labelIdList);
            formData.append('labelIdList', idList);
            formData.append('startTime', this.addEditInfo.startTime);
            if (this.addEditInfo.endTime && this.addEditInfo.liveMode === 1) {
                formData.append('endTime', this.addEditInfo.endTime);
            }
            if (this.addEditInfo.liveMode === 1) {
                formData.append('classroomId', this.addEditInfo.classroomId);
                formData.append('terminalIdList', this.addEditInfo.terminalIdList);
            }
            if (this.teachingFileIds.length != 0) {
                formData.append('teachingFileIds', this.teachingFileIds);
            }
            if (this.addEditInfo.groupId == 1) {
                formData.append('password', this.addEditInfo.password ? this.addEditInfo.password : '');
            }
            formData.append('fileDetection', this.addEditInfo.file !== null ? 0 : 1);
            formData.append('orgId', this.addEditInfo.orgId);
            formData.append('schoolId', this.addEditInfo.orgId);
            formData.append('teacherId', this.addEditInfo.teacherId);
            // if(this.addEditInfo.recode && this.addEditInfo.liveMode === 1){
            // 	formData.append('recodeIdList', this.addEditInfo.recodeIdList);
            // };
            formData.append('groupId', this.addEditInfo.groupId);
            formData.append('recode', this.addEditInfo.recode ? 1 : 0);
            formData.append('hot', this.addEditInfo.hot ? 1 : 0);
            formData.append('mode', this.addEditInfo.mode);
            formData.append('description', this.addEditInfo.description ? this.addEditInfo.description : '');
            formData.append('categoryId', this.themeValue);
            formData.append('publicLive', this.addEditInfo.publicLive);
            formData.append('publicVod', this.addEditInfo.publicVod);
            formData.append('watchType', this.addEditInfo.watchType);
            formData.append('watchPassword', this.addEditInfo.watchPassword);
            formData.append('liveMode', this.addEditInfo.liveMode);
            if (this.addEditInfo.liveMode === 2) {
                formData.append('joiner', this.addEditInfo.joiner ? 1 : 0);
            }
            let url = '/sm/theme/save';
            if (this.themeId) {
                // 编辑更新
                url = '/sm/theme/update';
                formData.append('id', this.themeId);
            }
            if (param === 'release') {
                // 一键发布
                url = '/sm/theme/fastRelease';
            }
            // for (var key of formData.keys()) {
            // 	console.log(key);
            // }
            // return
            this.$axios.post(url, formData).then(
                (res) => {
                    this.loadingBtn = false;
                    this.loadingBtnOne = false;
                    if (res.code == 200) {
                        this.$router.push('/sm/theme');
                        this.$message('保存成功', 'success');
                    }
                    if (res.code === -10001) {
                        Message.closeAll();
                        this.outerVisible = true;
                    }
                    if (res.code === -10002) {
                        Message.closeAll();
                        this.onDemandOuter = true;
                    }
                },
                (err) => {
                    console.log(err);
                    reject(err);
                }
            );
        },
        //验证
        verify() {
            Message.closeAll();
            // this.$verify.isEmpty(this.addEditInfo.labelIdList)
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('分类未选择', 'error');
                return true;
            }
            var ifResult = false;
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
            if (this.addEditInfo.name.length > 100) {
                this.$message('主题名称不能超过100字', 'error');
                return true;
            }
            if (this.addEditInfo.startTime === undefined || this.addEditInfo.startTime === null) {
                this.$message('请选择开始时间', 'error');
                return true;
            }
            if (this.addEditInfo.startTime < getNowDate()) {
                this.addEditInfo.startTime = getNowDate();
            }
            if (this.addEditInfo.durationMinutes) {
                if (this.addEditInfo.durationMinutes == 0) {
                    this.$message('课堂时长不能为0', 'error');
                    return true;
                }
                if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                    this.$message('课堂时长只能输入正整数', 'error');
                    return true;
                }
                if (this.addEditInfo.durationMinutes.length > 4) {
                    this.$message('课堂时长最多只能9999分钟', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.liveMode === 1) {
                if (this.$verify.isEmpty(this.addEditInfo.orgId)) {
                    this.$message('请选择学校', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.buildingId)) {
                    this.$message('请选择教学楼', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.classroomId)) {
                    this.$message('请选择教室', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.terminalIdList)) {
                    this.$message('请选择录制设备', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.teacherId)) {
                    this.$message('请选择授课教师', 'error');
                    return true;
                }
            }
            if (this.$verify.isEmpty(this.addEditInfo.groupId)) {
                this.$message('请选择观看权限', 'error');
                return true;
            }
            if (this.addEditInfo.groupId == 1 && this.addEditInfo.password && this.addEditInfo.password !== '') {
                if (this.$verify.checkNumEn(this.addEditInfo.password, 6, 6)) {
                    this.$message('观看密码须6位数字或字母或二者组成', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.publicLive === 1 && this.addEditInfo.watchType === 1) {
                if (!this.addEditInfo.watchPassword) {
                    this.$message('请输入公网观看密码', 'error');
                    return true;
                }
                if (this.$verify.checkNumEn(this.addEditInfo.watchPassword, 6, 20)) {
                    this.$message('公网观看密码须6-20位数字或字母或二者组成', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.description && this.addEditInfo.description.length > 200) {
                this.$message('简介最长200个字', 'error');
                return true;
            }
        },

        // 选择模式
        handleType(type) {
            this.addEditInfo.liveMode = type === 'classroom' ? 1 : 2;
            if (type === 'teaching') {
                this.addEditInfo.mode = '0';
            }
            if (type === 'classroom' && this.addEditInfo.orgId && this.addEditInfo.buildingId) {
                // this.recodeList = [];
                this.terminalIdList = [];
                this.addEditInfo.terminalIdList = '';
                this.getTeachBuildList(this.addEditInfo.orgId);
                this.getClassroomList(this.addEditInfo.buildingId);
                this.getTerminalIdList('room');
            }
        },
        getTeacherList(name) {
            // 如果没有关键字或者清空文本框，就不请求数据且清掉下拉缓存数据。数据过多，请求全部的话，会因为渲染导致页面卡顿
            if (!name) {
                this.teacherList = [];
                this.$comjs.getUseList(this, null);
                return;
            }
            this.teacherSelectLoading = true;
            this.$axios.post('/sm/interactive/getUserList', {nickName: name}).then((res) => {
                this.teacherList = res.data;
                this.teacherSelectLoading = false;
            });
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep .el-upload-dragger {
    width: 280px;
    height: 130px;
}
::v-deep .el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}

::v-deep .el-upload-list__item-status-label {
    display: block;
}
.content-wrap {
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 54px 60px;
}
.notice-wrap {
    display: inline-block;
    padding: 23px 80px 24px 80px;
    font-size: 14px;
    color: #303133;
    background: #eff3f9;

    p {
        line-height: 24px;
    }
}
.item-scroll {
    /* overflow: hidden; */
    height: 100%;
    width: 100%;
    .box {
        overflow-y: scroll;
        width: 105%;
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
        width: 94px;
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
    .class-type {
        cursor: pointer;

        .act {
            border: solid 3px #5b8cff;
            border-radius: 8px;
        }

        img {
            width: 286px;
            height: 159px;
            border: solid 3px #fff;
        }
        p {
            margin-top: 7px;
            text-align: center;
            font-size: 14px;
            color: #606266;
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
.upload-demo .el-upload-list {
    margin: -145px 0 0 15px;
    width: 250px;
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
.edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}
.upload-demo .el-upload-list__item-status-label {
    display: block;
}
</style>

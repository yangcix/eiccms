<template>
    <div class="second-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.themeid ? '编辑' : '新增'}AI磨课`"
            ></el-page-header>
        </p>
        <div class="content-wrap">
            <div class="item-scroll">
                <div class="error-msg-content" v-if="$route.query.msg">
                    {{ $route.query.msg }}
                </div>
                <div class="box">
                    <div class="item-wrap" v-if="aiType == 2 && feeModel == 1">
                        <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                        {{ aiNum }}次
                    </div>
                    <div class="item-wrap" v-show="!$route.query.themeid">
                        <p>资源来源<em>*</em>：</p>
                        <el-radio-group v-model="addEditInfo.resources" class="wrap-radio">
                            <el-radio :label="1">排课录制</el-radio>
                            <el-radio :label="2">本地上传</el-radio>
                            <el-radio :label="3">智课终端</el-radio>
                            <el-radio :label="4">历史录制资源</el-radio>
                            <el-tooltip :content="tooltipContent" placement="right" effect="dark">
                                <i
                                    class="iconfont icon-wenhao"
                                    style="margin-left: -10px; color: rgb(121, 145, 255)"
                                ></i>
                            </el-tooltip>
                        </el-radio-group>
                    </div>
                    <p v-if="addEditInfo.resources == 1 && !addEditInfo.id" class="notes">
                        注：将自动录制开始时间到结束时间区间范围的视频进行AI分析，请合理安排好时间！
                    </p>
                    <p v-if="addEditInfo.resources == 3 && !addEditInfo.id" class="notes">
                        注：将<span style="color: red">手动</span
                        >录制开始时间到结束时间区间范围的视频进行AI分析，需小于60分钟，请合理安排好时间！
                    </p>
                    <div class="item-wrap" v-if="addEditInfo.resources == 3">
                        <p>录制方式<em>*</em>：</p>
                        <el-radio-group
                            v-model="addEditInfo.recordingMethod"
                            style="display: flex; justify-content: center; align-items: center"
                        >
                            <el-radio v-for="(item, index) in recordingMethodList" :label="item.id" :key="index">{{
                                item.name
                            }}</el-radio>
                        </el-radio-group>
                    </div>
                    <div
                        v-if="addEditInfo.resources == 2"
                        class="item-wrap item-wrap upload-box videoList"
                        style="margin-bottom: 40px"
                    >
                        <p :class="aiType == 1 ? 'w100' : ''">
                            {{ aiType == 1 ? '教师画面视频' : '视频' }}<em>*</em>：
                        </p>
                        <div class="upload-wrap teacher" style="width: 300px">
                            <el-upload
                                :limit="1"
                                :on-exceed="handleOnExceeds"
                                class="upload-demo"
                                :action="uploadUrl"
                                :accept="'.mp4,.MP4'"
                                :file-list="teacherVideo"
                                :on-change="selectVideot"
                                :on-remove="removet"
                                list-type="picture"
                                :auto-upload="false"
                                :drag="true"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                                </div>
                                <div class="el-upload-tip" slot="tip">
                                    <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过1.8G
                                </div>
                            </el-upload>
                            <div id="vp" ref="vp"></div>
                        </div>
                        <p
                            v-if="aiType == 1"
                            style="line-height: 40px; color: #303133; font-size: 14px; margin-left: 10px"
                        >
                            学生画面视频<em>*</em>：
                        </p>
                        <div v-if="aiType == 1" class="upload-wrap student" style="width: 290px">
                            <el-upload
                                :limit="1"
                                :on-exceed="handleOnExceeds"
                                class="upload-demo"
                                :action="uploadUrl"
                                :accept="'.mp4,.MP4'"
                                :file-list="studentVideo"
                                :on-change="selectVideos"
                                :on-remove="removes"
                                list-type="picture"
                                :auto-upload="false"
                                :drag="true"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或<em style="color: #409eff">点击上传</em>
                                </div>
                                <div class="el-upload-tip" slot="tip">
                                    <em>*</em>请确保视频声音正常，上传MP4视频，大小不超过3G
                                </div>
                            </el-upload>
                        </div>
                    </div>
                    <p
                        v-if="addEditInfo.resources == 2"
                        :style="{
                            fontSize: '14px',
                            color: 'red',
                            marginLeft: aiType == 1 ? '113px' : '83px',
                            marginTop: '10px',
                        }"
                    >
                        注：上传的视频资源要与页面填写信息一致，不然将会影响AI分析结果的准确性
                    </p>
                    <div v-if="addEditInfo.resources == 4" class="item-wrap">
                        <p>课堂视频<em>*</em>：</p>
                        <el-tag
                            class="elTag"
                            v-if="objectName"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseTag()"
                            >{{ objectName }}</el-tag
                        >
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">{{
                            addEditInfo.recordId ? '更改资源' : '选择资源'
                        }}</el-button>
                    </div>
                    <p
                        v-if="aiType == 2 && addEditInfo.resources == 4"
                        :style="{
                            fontSize: '14px',
                            color: 'red',
                            marginLeft: '83px',
                            marginTop: '20px',
                            marginBottom: '-10px',
                        }"
                    >
                        注：仅可选择时长不可超过60分钟的视频资源
                    </p>
                    <div class="item-wrap">
                        <p>课程名称<em>*</em>：</p>
                        <el-input
                            class="width-2"
                            v-model="addEditInfo.name"
                            placeholder="请输入课程名称"
                            clearable
                        ></el-input>
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
                    <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                        <p>开始时间<em>*</em>：</p>
                        <el-date-picker
                            v-model="addEditInfo.startTime"
                            type="datetime"
                            style="width: 280px"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间"
                            @change="clearTerminal"
                        >
                        </el-date-picker>
                        <p v-if="addEditInfo.resources == 1" class="err-notice">
                            <em>*</em>需大于当前时间，若小于时默认创建时间
                        </p>
                        <p v-if="addEditInfo.resources == 3" class="err-notice">
                            <em>*</em>需大于当前时间，该时间为预设时间，具体开始时间以实际开始录制时间为准
                        </p>
                    </div>

                    <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                        <p>课堂时长<em>*</em>：</p>
                        <el-input
                            class="width-2"
                            v-model="addEditInfo.durationMinutes"
                            clearable
                            placeholder="请输入课堂时长"
                            @change="changeDurationMin"
                        ></el-input>
                        <p class="err-notice"><em>*</em>课堂时长最多60分钟</p>
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
                        <!-- <p class="err-notice">注：提前添加设备并绑定至直播教室</p> -->
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
                        >
                            <el-option
                                v-for="item in teacherList"
                                :key="item.userId"
                                :label="item.name + (item.schoolName ? '-' + item.schoolName : '') + '-' + item.code"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                        <!-- <p class="err-notice">注：提前添加设备并绑定至直播教室</p> -->
                    </div>

                    <div class="item-wrap">
                        <p>磨课班级<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.grindingSchool"
                            @change="shcoolChange"
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
                        <p></p>
                        <el-select
                            @change="changeGrade"
                            :popper-append-to-body="false"
                            v-model="addEditInfo.grindingGrade"
                            placeholder="选择年级"
                            style="margin-right: 10px; width: 138px"
                            filterable
                        >
                            <el-option
                                v-for="item in gradeList"
                                :key="item.gradeId"
                                :label="item.name"
                                :value="item.gradeId"
                            >
                            </el-option>
                        </el-select>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.grindingClass"
                            placeholder="选择班级"
                            style="margin-right: 10px; width: 130px"
                            filterable
                        >
                            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                        <p>磨课位置<em>*</em>：</p>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.grindingBuilding"
                            @change="buildChange"
                            placeholder="选择教学楼"
                            style="margin-right: 10px; width: 150px"
                            filterable
                        >
                            <el-option v-for="item in buildlList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            :popper-append-to-body="false"
                            v-model="addEditInfo.grindingClassroom"
                            @change="classroomChange(1)"
                            placeholder="选择教室"
                            style="width: 120px"
                            filterable
                        >
                            <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>

                    <div v-if="addEditInfo.resources == 1 || addEditInfo.resources == 3" class="item-wrap">
                        <p><em></em></p>
                        <span v-if="ternalName !== ''" style="color: #999; font-size: 14px">{{ ternalName }}</span>
                        <span v-else style="color: #999; font-size: 14px">无设备</span>
                        <!-- <el-select :popper-append-to-body="false" v-model="addEditInfo.terminalId" placeholder="选择设备" class="width-2"
							filterable>
							<el-option v-for="item in terminalIdList" :key="item.id" :label="item.terminalName" :value="item.id">
							</el-option>
						</el-select> -->
                        <!-- <p class="err-notice">注：提前添加设备并绑定至直播教室</p> -->
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
                            :file-list="edufileList"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload-tip">仅支持上传后缀为docx文件，文件50M以下</div>
                        </el-upload>
                    </div>
                    <div class="item-wrap upload-box">
                        <p>封面<em style="opacity: 0">*</em>：</p>
                        <div class="upload-wrap">
                            <el-upload
                                class="upload-demo"
                                :limit="1"
                                :action="uploadUrl"
                                :on-exceed="handleOnExceed"
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
                                <div class="el-upload-tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </div>
                    </div>
                    <el-button :loading="loadingBtn" class="edit-btn" @click="httpRequest(true)">暂存</el-button>
                    <el-button :loading="loadingBtn" type="primary" class="edit-btn" @click="httpRequest"
                        >确认</el-button
                    >
                </div>
            </div>
        </div>
        <el-dialog
            title="选择资源"
            :close-on-click-modal="false"
            :visible.sync="videoShow"
            :before-close="closeVideoShow"
        >
            <div class="video-wrap">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="选择录制视频" name="first">
                        <div>
                            <el-input
                                class="width-2"
                                v-model="videoName"
                                clearable
                                placeholder="请输入视频名称关键字"
                                v-search="handleSearch"
                            ></el-input>
                            <el-button class="search-btn" type="primary" @click="handleSearch()">查询</el-button>
                        </div>
                        <div>
                            <el-table v-loading="loading" :data="videoList" style="width: 100%">
                                <!--                <el-table-column align="center" prop="name" tooltip="true" label="视频名称">
                  <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.name.replace(/\s+/g,'').length> 20" :content="scope.row.name" placement="top"></el-tooltip>
                    <span
                      style="display: -webkit-box;
                             text-overflow: ellipsis;
                             overflow: hidden;
                             -webkit-line-clamp: 1;
                             -webkit-box-orient: vertical;
                             white-space: pre-line;"
                             class="video-name" @click="play(scope.row.url)"><i class="el-icon-video-play"></i> {{ scope.row.name }}</span>
                  </template>
                </el-table-column>-->
                                <el-table-column align="left" prop="name" label="视频名称">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="light" placement="top">
                                            <div v-html="scope.row.name" slot="content" style="max-width: 400px"></div>
                                            <span
                                                :title="scope.row.name"
                                                class="video-name"
                                                @click="play(scope.row.url)"
                                            >
                                                <span class="one-line"
                                                    ><i class="el-icon-video-play"></i>{{ scope.row.name }}</span
                                                >
                                            </span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" prop="teacherName" label="教师">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.teacherName ? scope.row.teacherName : '——' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="left" label="操作">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-link
                                                :disabled="scope.row.id === addEditInfo.recordId"
                                                :underline="false"
                                                type="primary"
                                                @click="handleAddDataList(scope.row)"
                                                >添加</el-link
                                            >
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table-page">
                            <el-pagination
                                layout="prev, pager, next"
                                @current-change="pageChange"
                                :current-page="pageNum"
                                :page-count="pages"
                            >
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>

        <el-dialog
            title="播放"
            :close-on-click-modal="false"
            :visible.sync="playVisible"
            :before-close="closePlay"
            width="fit-content"
            center
        >
            <div id="videoFilm" ref="videoFilm"></div>
        </el-dialog>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import Player from 'xgplayer';
import {Message} from 'element-ui';
import {creatTree, baseUrl, getNowDate, session} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            aiNum: 0,
            videoSizes: '',
            videoSizet: '',
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId,
            feeModel: JSON.parse(localStorage.getItem('sysInfo')).type,
            studentVideo: [],
            teacherVideo: [],
            playUrl: '',
            vp: null,
            videoId: 1,
            uploadUrl: baseUrl + '/sm/label/save',
            classTypeList: [],
            ternalName: '',
            gradeList: [],
            classList: [],
            subjectList: [],
            versions: JSON.parse(sessionStorage.getItem('userInfo')) || [],
            innerVisible: false,
            teacherList: [],
            fileList: [],
            themeTypeList: [], // 主题类型 数组
            props: {multiple: true, label: 'name', value: 'id', emitPath: false},
            addEditInfo: {
                classTypeId: '',
                resources: 1,
                teacherVideo: '',
                studentVideo: '',
                teacherId:
                    JSON.parse(localStorage.getItem('userInfo')).userId == 1 ||
                    JSON.parse(localStorage.getItem('userInfo')).userId == 2
                        ? ''
                        : JSON.parse(localStorage.getItem('userInfo')).userId,
                grindingSchool: '', //学校id
                grindingClassroom: '', //教室id
                grindingBuilding: '', //教学楼id
                terminalId: '', //选择的 直播设备
                subjectId: '',
                grindingClass: '',
                grindingGrade: '',
                file: null,
                recordId: '', // 导播录播视频ID
                recordingMethod: 0,
            },
            schoolList: [], // 可选择的学校
            buildlList: [], // 可选的教学楼
            classroomList: [], // 可选的教室
            terminalIdList: [], //可选的 直播设备 数组
            groupList: [], // 可选的 观看权限 人员类型
            valData: [],
            loadingBtn: false,
            loadingBtnOne: false,
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            edufileList: [], // 已上传文件
            teachingFileIds: [], // 一键发布时上传文件数组
            tooltipContent: '为巡课时录制完成并存储在系统的视频',
            video: {}, // 快捷分析视频数据
            videoList: [], // 录制视频列表数据
            videoPermission: '', // 录制视频权限
            loading: false,
            videoShow: false,
            activeName: 'first',
            videoName: '',
            pages: 0,
            pageNum: 1,
            totalS: '',
            playVisible: false, // 视频播放窗口
            myVideo: null,
            objectName: '', // 绑定视频名称
            teacherSelectLoading: false,
            recordingMethodList: [
                {name: '自动录制', id: 0},
                {name: '手动录制', id: 1},
            ],
            isChangeVideo: false, // 是否替换视频
        };
    },
    components: {},
    computed: {
        ...mapState({
            aiUploadTable: 'aiUploadTable',
        }),
    },
    mounted() {
        if (
            !(
                JSON.parse(localStorage.getItem('userInfo')).userId == 1 ||
                JSON.parse(localStorage.getItem('userInfo')).userId == 2
            )
        ) {
            this.getTeacherList(JSON.parse(localStorage.getItem('userInfo')).nickName);
        }
        this.getClassTypeList(); // 获取课型
        this.getSchoolList(); //获取学校列表
        this.getgroupList(); //获取用户组列表
        this.getSubjectList();
        // this.getGradeList();
        if (this.$route.query.themeid) {
            this.themeId = this.$route.query.themeid;
            this.getThemeInfo(); //编辑获取主体信息
            // 编辑
            if (this.$route.query.teacherName) {
                this.getTeacherList(this.$route.query.teacherName);
            }
        }
        if (this.$route.query.type == 3 && this.aiType == 2) {
            this.addEditInfo.resources = 3;
        }
        if (this.aiType == 2 && this.feeModel == 1) {
            this.getCount();
            this.getAiNum();
        }
        if (this.$route.query.videoId) {
            this.addEditInfo.resources = 4;
            this.addEditInfo.recordId = this.$route.query.videoId;
            if (this.$route.query.teacherId) {
                this.getTeacherList(this.$route.query.teacherName);
            }
            this.addEditInfo.teacherId = this.$route.query.teacherId ? this.$route.query.teacherId : '';
            this.objectName = this.$route.query.name;
            // this.getVideoInfo();
        }
    },
    methods: {
        ...mapActions({
            commitAiUploadBoxVisible: 'commitAiUploadBoxVisible',
            commitAiUploadTable: 'commitAiUploadTable',
            commitAiUploadDataState: 'commitAiUploadDataState',
        }),
        getCount() {
            this.$axios.get('/aiGrinding/getCount').then((res) => {
                if (res.code != 200) {
                    return;
                }
            });
        },
        getAiNum() {
            this.$axios.get('/aiRecharge/count').then((res) => {
                if (res.code == 200) {
                    this.aiNum = res.data.aiClass;
                }
            });
        },
        removes() {
            this.studentVideo = [];
            this.addEditInfo.studentVideo = '';
        },
        removet() {
            this.teacherVideo = [];
            this.addEditInfo.teacherVideo = '';
        },
        getMp4Time(file) {
            return new Promise(async (resolve, reject) => {
                let url = URL.createObjectURL(file);
                let audioElement = new Audio(url);
                let durtaion = 0;
                // 下面需要注意的是在监听loadedmetadata绑定的事件中对duration直接进行赋值是无效的，需要在fun回调函数中进行赋值
                audioElement.addEventListener('loadedmetadata', function () {
                    //音频/视频的元数据已加载时，会发生 loadedmetadata 事件
                    durtaion = audioElement.duration; //时长以秒作为单位
                    fun(parseFloat(durtaion).toFixed(1));
                });
                let fun = (s) => {
                    durtaion = s;
                    resolve(durtaion);
                };
            });
        },
        async selectVideot(file) {
            this.playUrl = URL.createObjectURL(file.raw);
            let reg = /(.mp4|.MP4)$/;
            if (!reg.test(file.raw.name)) {
                this.$message(this.aiType == 1 ? '教师画面视频请上传MP4格式' : '请上传MP4格式视频', 'error');
                this.teacherVideo = [];
                this.addEditInfo.teacherVideo = '';
                return;
            }
            this.videoSizet =
                file.raw.size / 1024 / 1024 / 1024 > 1
                    ? `${(file.raw.size / 1024 / 1024 / 1024).toFixed(2)}G`
                    : `${(file.raw.size / 1024 / 1024).toFixed(2)}M`; //上传列表大小显示
            let time = await this.getMp4Time(file.raw);
            if (file.raw.size / 1024 / 1024 / 1024 > 1.8) {
                this.teacherVideo = [];
                return this.$message(
                    this.aiType == 1 ? '教师画面视频大小不能超过1.8G' : '视频大小不能超过1.8G',
                    'error'
                );
            } else if (time > 3600) {
                this.teacherVideo = [];
                return this.$message(
                    this.aiType == 1 ? '教师画面视频时长不能超过60分钟' : '视频时长不能超过60分钟',
                    'error'
                );
            } else {
                this.initVP();
                this.videoId = 1;
                this.addEditInfo.teacherVideo = file.raw;
                this.isChangeVideo = true;
            }
        },
        async selectVideos(file) {
            this.playUrl = URL.createObjectURL(file.raw);
            let reg = /(.mp4|.MP4)$/;
            if (!reg.test(file.raw.name)) {
                this.$message('学生画面视频请上传MP4格式', 'error');
                this.studentVideo = [];
                this.addEditInfo.studentVideo = '';
                return;
            }
            this.videoSizes =
                file.raw.size / 1024 / 1024 / 1024 > 1
                    ? `${(file.raw.size / 1024 / 1024 / 1024).toFixed(2)}G`
                    : `${(file.raw.size / 1024 / 1024).toFixed(2)}M`; //上传列表大小显示
            let time = await this.getMp4Time(file.raw);
            if (file.raw.size / 1024 / 1024 / 1024 > 3) {
                this.studentVideo = [];
                return this.$message('学生画面视频大小不能超过3G', 'error');
            } else if (time > 3600) {
                this.studentVideo = [];
                return this.$message('学生画面视频时长不能超过60分钟', 'error');
            } else {
                this.initVP();
                this.videoId = 2;
                this.addEditInfo.studentVideo = file.raw;
            }
        },
        initVP() {
            this.vp = new Player({
                id: 'vp',
                url: this.playUrl,
                fluid: true,
                autoplay: true,
                autoplayMuted: true,
                volume: 0,
                defaultMuted: true,
                videoInit: true,
                closeVideoClick: true,
                closeVideoTouch: true,
                errorTips: '暂无视频源',
                lang: 'zh-cn',
            });
            console.log('this.vp', this.vp);
            if (this.vp) {
                this.$nextTick(() => {
                    let vp = document.querySelector('#vp>video');
                    vp.style.zIndex = -100;
                    vp.addEventListener('loadeddata', this.captureImage);
                });
            }
        },
        // 捕获第一帧画面
        captureImage() {
            let vp = document.querySelector('#vp>video');
            let canvas = document.createElement('canvas');
            console.log('vp', vp);
            // canvas.style.display = 'none';
            document.body.appendChild(canvas);
            canvas.width = vp.videoWidth * 0.8;
            canvas.height = vp.videoHeight * 0.8;
            canvas.getContext('2d').drawImage(vp, 0, 0, canvas.width, canvas.height);
            let img;
            if (this.videoId == 1) {
                img = document.querySelector(
                    '.teacher>.upload-demo>.el-upload-list--picture>.el-upload-list__item>.el-upload-list__item-thumbnail'
                );
            } else {
                img = document.querySelector(
                    '.student>.upload-demo>.el-upload-list--picture>.el-upload-list__item>.el-upload-list__item-thumbnail'
                );
            }
            img.src = canvas.toDataURL('image/png', 1);
            this.vp.destroy();
            this.vp = null;
            document.body.removeChild(canvas);
        },
        handleOnExceeds(files, fileList) {
            this.$message('只能上传一个视频', 'error');
        },
        getClassTypeList() {
            this.$axios.get('/aiGrinding/getClassType').then((res) => {
                this.classTypeList = res.data;
                this.addEditInfo.classTypeId = res.data[0].id;
            });
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        changeGrade() {
            this.addEditInfo.grindingClass = '';
            this.getClassList();
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        getGradeList(id) {
            this.$axios.get('/aiGrinding/getGrade?orgId=' + id + '').then((res) => {
                this.gradeList = res.data;
            });
        },
        getClassList() {
            this.$axios.get('/aiGrinding/getClass?id=' + this.addEditInfo.grindingGrade).then((res) => {
                this.classList = res.data;
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
                // return this.$confirm(`确定移除该文件吗？`, '删除提示', {
                // 	confirmButtonText: '确定',
                // 	cancelButtonText: '取消',
                // 	type: 'warning'
                // }).then(() => {
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
                    // 不为编辑，// 删除调用删除接口
                    // let id = file.response.data.id
                    // this.deleteEduFile(id);
                }
                // }).catch(() => reject());
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
        // 选择主类并获取对应子类
        handleTheme() {
            this.addEditInfo.teacherId = '';
            this.getTypeList();
        },
        // handleDisabled() {
        // 	this.$message('暂不支持FLASH模式', 'error');
        // },
        //编辑获取主体信息
        getThemeInfo() {
            this.$axios.get('/aiGrinding/info', {id: this.themeId}).then((res) => {
                this.valData = res.data.labelList;
                if (res.data.coverUrl) {
                    this.fileList = [{name: '', url: res.data.coverUrl}];
                } else {
                    this.fileList = [];
                }
                let edufileList = res.data.teachingFileList;
                if (edufileList != null && edufileList != '[]' && edufileList != '') {
                    this.teachingFileIds = edufileList.map((i) => i.id);
                    this.edufileList = edufileList;
                } else {
                    this.edufileList = [];
                    this.teachingFileIds = [];
                }
                this.addEditInfo = res.data;
                this.getGradeList(res.data.grindingSchool);
                this.getClassList();
                this.getTeachBuildList(res.data.grindingSchool);
                if (res.data.resources == 1 || res.data.resources == 3) {
                    this.getClassroomList(res.data.grindingBuilding);
                    this.getTerminalIdList();
                } else {
                    this.teacherVideo = [{name: '', url: res.data.teacherVideoUrl}];
                    setTimeout(() => {
                        this.playUrl = res.data.teacherVideoUrl;
                        this.videoId = 1;
                        this.initVP();
                    }, 300);
                    if (res.data.aiConfigId == 1) {
                        this.studentVideo = [{name: '', url: res.data.studentVideoUrl}];
                        setTimeout(() => {
                            this.playUrl = res.data.studentVideoUrl;
                            this.videoId = 2;
                            this.initVP();
                        }, 800);
                    }
                }
            });
        },
        //返回
        goBack() {
            if (this.$route.query.mode) {
                this.$router.push('/aiGrinding');
            } else if (this.$route.query.videoId) {
                this.$router.back();
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
                });
        },
        //获取学校列表
        getSchoolList() {
            this.$axios.get('/sys/org/listSchool').then((res) => {
                this.schoolList = res.data;
                // if (this.schoolList.length > 0) {
                // 	this.addEditInfo.orgId = this.schoolList[0].id;
                // this.getTeacherList();
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
            this.addEditInfo.grindingGrade = '';
            this.addEditInfo.grindingBuilding = '';
            this.addEditInfo.grindingClass = '';
            this.addEditInfo.terminalId = '';
            this.ternalName = '';
            this.addEditInfo.grindingClassroom = '';
            this.classroomList = [];
            this.classroomChange();
            this.getGradeList(id);
            this.getTeachBuildList(id);
        },
        //教学楼改变后教室修改
        buildChange(id) {
            // this.recodeList = [];
            this.addEditInfo.grindingClassroom = '';
            this.classroomList = [];
            this.classroomChange();
            this.getClassroomList(id);
        },
        //教室改变后直播设备改变 录制机位改变
        classroomChange(type) {
            // this.recodeList = [];
            this.ternalName = '';
            this.terminalIdList = [];
            // this.addEditInfo.terminalIdList = [];
            this.addEditInfo.terminalId = '';
            // this.addEditInfo.recodeIdList = '';
            if (type) {
                this.getTerminalIdList('room');
            }
            // this.terminalChange();
        },
        clearTerminal() {
            this.calcEndTime();
            if (this.addEditInfo.grindingClassroom) {
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
            if (!this.addEditInfo.startTime || !this.addEditInfo.durationMinutes) return;
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
        //获取 直播设备列表
        getTerminalIdList(room) {
            let data = {
                classroomId: this.addEditInfo.grindingClassroom,
                startTime: this.addEditInfo.startTime,
                endTime: this.addEditInfo.endTime,
                type: 2,
                resources: this.addEditInfo.resources,
            };
            if (this.themeId) {
                data.themeId = this.themeId;
            }
            this.$axios.get('/sm/theme/getSelectTerminal', data).then((res) => {
                this.terminalIdList = res.data;
                this.ternalName =
                    this.terminalIdList[0] && this.terminalIdList[0].terminalName
                        ? this.terminalIdList[0].terminalName
                        : '';
                if (!this.$route.query.themeid || room === 'room') {
                    // 新增
                    const id = this.terminalIdList.length > 0 ? this.terminalIdList[0].id : '';
                    this.addEditInfo.terminalId = id ? id : '';
                }
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
            this.addEditInfo.coverUrl = '';
            this.addEditInfo.file = null;
        },
        /**
         * 覆盖默认上传，手动上传
         * @param isTranslationPending 是否暂存
         */
        httpRequest(isTranslationPending) {
            if (this.verify()) {
                return;
            }
            let arrs = [];
            let arrays = [];
            this.aiUploadTable.forEach((el) => {
                arrs.push(el.uploadId);
            });
            arrays = Array.from(new Set(arrs));
            if (arrays.length >= 5) {
                return this.$message('最多可以同时上传5个评课或磨课，请稍后再试！', 'error');
            }
            if (
                this.aiUploadTable.findIndex((item, i) => {
                    return (
                        item.name == this.addEditInfo.name + '教师画面' ||
                        (item.name == this.addEditInfo.name + '视频' && item.type == 2)
                    );
                }) === -1
            ) {
                let formData = new FormData();
                let judgeData = {};
                judgeData.name = this.addEditInfo.name;
                if (this.addEditInfo.id) {
                    judgeData.id = this.addEditInfo.id;
                }
                this.$axios.post('/aiGrinding/check', judgeData).then((res) => {
                    if (res.code == 200) {
                        if (this.addEditInfo.file) {
                            formData.append('file', this.addEditInfo.file);
                        }
                        formData.append('name', this.addEditInfo.name);
                        if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                            formData.append('startTime', this.addEditInfo.startTime);
                            formData.append('endTime', this.addEditInfo.endTime);
                            formData.append('grindingBuilding', this.addEditInfo.grindingBuilding);
                            formData.append('grindingClassroom', this.addEditInfo.grindingClassroom);
                            formData.append('terminalId', this.addEditInfo.terminalId);
                            if (this.addEditInfo.resources == 3) {
                                formData.append('recordingMethod', this.addEditInfo.recordingMethod);
                            }
                        } else if (this.addEditInfo.resources == 2) {
                            if (this.addEditInfo.teacherVideo) {
                                formData.append('teacherVideo', this.addEditInfo.teacherVideo);
                                if (this.aiType == 1 && this.addEditInfo.studentVideo) {
                                    formData.append('studentVideo', this.addEditInfo.studentVideo);
                                }
                            }
                        } else if (this.addEditInfo.resources == 4) {
                            formData.append('recordId', this.addEditInfo.recordId);
                        }
                        formData.append('aiConfigId', this.aiType);
                        formData.append('classTypeId', this.addEditInfo.classTypeId);
                        formData.append('resources', this.addEditInfo.resources);
                        formData.append('grindingGrade', this.addEditInfo.grindingGrade);
                        formData.append('grindingClass', this.addEditInfo.grindingClass);
                        formData.append('grindingSchool', this.addEditInfo.grindingSchool);
                        formData.append('subjectId', this.addEditInfo.subjectId);
                        formData.append('teacherId', this.addEditInfo.teacherId);
                        formData.append('planFile', this.teachingFileIds);
                        let url = '/aiGrinding/save';
                        if (this.addEditInfo.id) {
                            // 编辑更新
                            url = '/aiGrinding/update';
                            formData.append('id', this.themeId);
                            if (!this.addEditInfo.file && this.addEditInfo.coverUrl) {
                                formData.append('coverUrl', this.addEditInfo.coverUrl);
                            }
                            // 编辑的时候且是本地视频：才需要判断视频是否有更换
                            if (this.addEditInfo.resources == 2) {
                                formData.append('teacherVideoNew', this.isChangeVideo ? 1 : 0);
                            }
                        }
                        // 判断编辑是否有替换视频
                        let uploadId;
                        if (this.addEditInfo.resources == 2) {
                            if (this.addEditInfo.teacherVideo) {
                                // 上传列表s
                                uploadId = this.aiUploadTable.length;
                                let uploadTbaleData = {
                                    type: 'push',
                                    item: {
                                        uploadId: uploadId,
                                        name:
                                            this.aiType == 1
                                                ? this.addEditInfo.name + '教师画面'
                                                : this.addEditInfo.name + '视频',
                                        status: 1, // 0 上传失败 1上传中 //2已取消
                                        size: this.videoSizet,
                                        type: 2, //1 评课 2 AI
                                        id: this.themeId ? this.themeId : -1, // 视频id
                                        detail: formData,
                                        fileName: this.addEditInfo.teacherVideo.name.slice(
                                            0,
                                            this.addEditInfo.teacherVideo.name.length - 4
                                        ),
                                        progress: 0,
                                    },
                                };
                                this.commitAiUploadTable(uploadTbaleData);
                                console.log(
                                    'this.teacherVideo---,',
                                    this.addEditInfo.teacherVideo.name.slice(
                                        0,
                                        this.addEditInfo.teacherVideo.name.length - 4
                                    )
                                );

                                this.$comjs.connectWS(
                                    this.addEditInfo.teacherVideo.name.slice(
                                        0,
                                        this.addEditInfo.teacherVideo.name.length - 4
                                    ),
                                    formData,
                                    this.updateAiUploadTable
                                );
                            }
                            if (this.addEditInfo.studentVideo) {
                                // 上传列表s
                                let uploadIds = this.aiUploadTable.length;
                                let uploadTbaleData = {
                                    type: 'push',
                                    item: {
                                        uploadId: uploadIds - 1,
                                        name: this.addEditInfo.name + '学生画面',
                                        status: 1, // 0 上传失败 1上传中 //2已取消
                                        size: this.videoSizes,
                                        type: 2, //1 评课 2 AI
                                        id: this.themeId ? this.themeId : -1, // 视频id
                                        detail: formData,
                                        fileName: this.addEditInfo.studentVideo.name.slice(
                                            0,
                                            this.addEditInfo.studentVideo.name.length - 4
                                        ),
                                        progress: 0,
                                    },
                                };
                                this.commitAiUploadTable(uploadTbaleData);
                                this.$comjs.connectWS(
                                    this.addEditInfo.studentVideo.name.slice(
                                        0,
                                        this.addEditInfo.studentVideo.name.length - 4
                                    ),
                                    formData,
                                    this.updateAiUploadTable
                                );
                            }
                            this.$router.push('/aiGrinding');
                            if (this.addEditInfo.teacherVideo && this.addEditInfo.teacherVideo !== null) {
                                this.commitAiUploadBoxVisible(true);
                            }
                        }
                        console.log('资源来源：', formData.get('resources'));
                        console.log('历史记录ID：', formData.get('recordId'));
                        // 暂存传值：type == 7
                        if (isTranslationPending) {
                            formData.append('type', 7);
                        }
                        this.$axios
                            .post(url, formData, {
                                headers: {
                                    uploadId: uploadId,
                                },
                            })
                            .then(
                                (res) => {
                                    if (res.code == 200) {
                                        setTimeout(() => {
                                            if (this.$route.path == '/aiGrinding') {
                                                this.$bus.emit('getAiList');
                                            } else if (this.$route.path == '/sm/aiclassAddEdit') {
                                                this.$router.push('/aiGrinding');
                                            }
                                            this.$message(res.data, 'success');
                                        }, 500);
                                    } else if (res.code == -3000) {
                                        this.upErrorMsg = res.message;
                                        this.upErrorShow = true;
                                    } else if (res.code == -10000) {
                                        // this.commitAiUploadTable({
                                        //     type: 'splice',
                                        //     detail: formData, // 视频id
                                        // });
                                        // this.editShow = false;
                                        // // 判断编辑是否有替换视频
                                        // if (this.addEditInfo.video) {
                                        //   this.commitAiUploadDataState({
                                        //     uploadId: uploadId,
                                        //     status: 0,
                                        //   });
                                        // }
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
                    }
                });
            } else {
                this.$message('磨课名称重复，该磨课正在上传', 'error');
            }
        },
        // 获取视频详情
        getVideoInfo() {
            let videoId = this.$route.query.videoId;
            this.$axios.get('/sm/record/info', {id: videoId}).then((res) => {
                if (res.code === 200) {
                    this.addEditInfo.resources = 4;
                    this.addEditInfo.recordId = res.data.id;
                    this.addEditInfo.teacherId = res.data.teacherId ? res.data.teacherId : '';
                    this.objectName = res.data.name;
                }
            });
        },
        // 选择视频资源
        handleAdd() {
            this.videoShow = true;
            this.pageNum = 1;
            this.videoName = '';
            this.getVideoList();
        },
        // 关闭绑定视频弹窗
        closeVideoShow() {
            this.videoName = '';
            this.videoActiveName = 'first';
            this.videoShow = false;
            this.pageNum = 1;
        },
        // 获取视频列表数据（小于六十分钟）
        getVideoList() {
            this.loading = true;
            this.$axios
                .get('/sm/record/listLessThanSixtyMinute', {
                    keyWord: this.videoName,
                    isAI: true,
                    pageNum: this.pageNum,
                    pageSize: 10,
                })
                .then((res) => {
                    this.loading = false;
                    this.videoList = res.data.pageList;
                    this.videoPermission = this.creatPermit(res.data.permit);
                    this.pages = res.data.pages;
                    this.totalS = res.data.total;
                    this.pageNum = res.data.pageNum;
                });
        },
        // 视频资源查询
        handleSearch() {
            this.pageNum = 1;
            this.getVideoList();
        },
        // 播放视频
        play(url) {
            if (this.videoPermission.info) {
                this.playVisible = true;
                this.$nextTick(() => {
                    this.handelGetVideo(url);
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        // 关闭播放
        closePlay() {
            this.myVideo.src = null;
            this.playVisible = false;
        },
        // 视频初始化
        handelGetVideo(params) {
            if (this.myVideo !== null) {
                this.myVideo.destroy();
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url: params,
                    autoplay: true,
                    videoInit: true,
                    width: 460,
                    height: 270,
                    fitVideoSize: 'auto',
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            } else {
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url: params,
                    autoplay: true,
                    videoInit: true,
                    width: 460,
                    height: 270,
                    fitVideoSize: 'auto',
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            }
        },
        // 添加视频
        handleAddDataList(row) {
            let minutes = parseInt(row.time.split(':')[1], 10);
            console.log(minutes, 'time111222');
            if (minutes > 60) {
                this.$message('视频时长不能超过60分钟', 'error');
                return;
            }
            this.addEditInfo.recordId = row.id;
            this.objectName = row.name;
            this.videoShow = false;
        },
        // 减少视频
        handleCloseTag() {
            this.addEditInfo.recordId = '';
            this.objectName = '';
        },
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getVideoList();
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('video-wrap')[0].scrollTo(0, 0);
        },
        //验证
        verify() {
            Message.closeAll();
            if (this.aiType == 2 && this.feeModel == 1 && this.aiNum == 0 && this.$route.query.themeid == '') {
                this.$message('AI分析剩余次数不足！', 'error');
                return true;
            }
            if (this.addEditInfo.resources == 2) {
                if (this.$verify.isEmpty(this.addEditInfo.teacherVideo)) {
                    this.$message(this.aiType == 1 ? '请上传教师画面视频' : '请上传视频', 'error');
                    return true;
                }
                if (!this.addEditInfo.id && this.$verify.isEmpty(this.addEditInfo.studentVideo) && this.aiType == 1) {
                    this.$message('请上传学生画面视频', 'error');
                    return true;
                }
            }
            if (this.addEditInfo.resources == 4) {
                if (this.$verify.isEmpty(this.addEditInfo.recordId)) {
                    this.$message('请选择课堂视频', 'error');
                    return true;
                }
            }
            if (!this.addEditInfo.name) {
                this.$message('请输入课程名称', 'error');
                return true;
            }
            if (this.addEditInfo.name.length > 100) {
                this.$message('课程名称长度限制100字符内！', 'error');
                return true;
            }
            if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                if (
                    this.addEditInfo.startTime === '' ||
                    this.addEditInfo.startTime === null ||
                    this.addEditInfo.startTime == undefined
                ) {
                    this.$message('请选择开始时间', 'error');
                    return true;
                }
                if (!this.addEditInfo.durationMinutes) {
                    this.$message('课堂时长不能为空', 'error');
                    return true;
                }
                if (this.addEditInfo.durationMinutes) {
                    if (this.$verify.numStr(this.addEditInfo.durationMinutes)) {
                        this.$message('课堂时长只能输入正整数', 'error');
                        return true;
                    }
                    if (this.addEditInfo.durationMinutes > 60) {
                        this.$message('课堂时长最多只能60分钟', 'error');
                        return true;
                    }
                }
                if (this.addEditInfo.startTime < getNowDate()) {
                    this.addEditInfo.startTime = getNowDate();
                }
            }
            if (!this.addEditInfo.subjectId) {
                this.$message('学科必填', 'error');
                return true;
            }
            if (!this.addEditInfo.teacherId) {
                this.$message('请选择教师', 'error');
                return true;
            }
            if (this.$verify.isEmpty(this.addEditInfo.grindingSchool)) {
                this.$message('请选择学校', 'error');
                return true;
            }
            if (!this.addEditInfo.grindingGrade) {
                this.$message('年级必填', 'error');
                return true;
            }
            if (!this.addEditInfo.grindingClass) {
                this.$message('班级必填', 'error');
                return true;
            }
            if (this.addEditInfo.resources == 1 || this.addEditInfo.resources == 3) {
                if (this.$verify.isEmpty(this.addEditInfo.grindingBuilding)) {
                    this.$message('请选择教学楼', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.grindingClassroom)) {
                    this.$message('请选择教室', 'error');
                    return true;
                }
                if (this.$verify.isEmpty(this.addEditInfo.terminalId)) {
                    this.$message('当前磨课位置无设备可用，请更改磨课位置', 'error');
                    return true;
                }
            }
            if (this.teachingFileIds.length == 0) {
                this.$message('教案必须上传！', 'error');
                return true;
            }
        },
        updateAiUploadTable(msg) {
            if (msg.progress == 100) {
                this.commitAiUploadTable({
                    type: 'splice',
                    detail: formData, // 视频id
                });
            } else {
                let uploadTbaleData = {
                    type: 'update',
                    fileName: msg.name,
                    progress: msg.progress,
                };
                this.commitAiUploadTable(uploadTbaleData);
            }
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
    padding: 24px 60px 54px;
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
        // text-align: justify;
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
        width: 227px;
    }
}

.edit-btn {
    width: 160px;
    height: 40px;
    margin: 35px 0 60px 130px;
}

.err-notice {
    margin-left: 14px;
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

::v-deep.edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}

.upload-demo .el-upload-list__item-status-label {
    display: block;
}
#vp {
    display: none;
}
.w100 {
    width: 110px !important;
}
::v-deep .wrap-radio .el-radio {
    margin-right: 20px;
}

.elTag {
    max-width: 600px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
}
.one-line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.video-name {
    cursor: pointer;
    color: #409eff;
}

::v-deep .el-dialog__wrapper {
    left: 100px;
}

::v-deep .el-dialog__body {
    padding-top: 0 !important;
}

.notes {
    margin-top: 10px;
    font-size: 12px;
    color: grey;
    margin-left: 80px;
}

.el-upload-tip {
    font-size: 12px;
    color: gray;
    margin-top: 10px;
}
</style>

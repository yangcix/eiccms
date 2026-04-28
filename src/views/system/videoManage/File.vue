<template>
    <div class="content-main-wrap">
        <p class="content-title">课程上传</p>

        <div class="main-wrap">
            <div class="search-operat">
                <div>
                    <el-input
                        v-model="searchKey"
                        class="width-2"
                        placeholder="请输入课程名称关键字进行查询"
                        v-search="search"
                        clearable
                    ></el-input>
                    <span class="search-desc">状态：</span>
                    <el-select v-model="searchThemeStatus" placeholder="请选择" class="width-4">
                        <el-option
                            v-for="item in searchThemeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="search">查询</el-button>
                </div>

                <div>
                    <el-button class="width-7" @click="toPublicProgress(1)" v-if="permission.publicVodList"
                        >公网点播进度</el-button
                    >
                    <el-button class="width-1" icon="el-icon-upload2" @click="add(1)" v-if="permission.save"
                        >新增</el-button
                    >
                </div>
            </div>
            <div class="data-table table-border">
                <el-table
                    :row-style="{height: '48px'}"
                    :cell-style="{padding: '4px 0'}"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                >
                    <el-table-column align="center" :show-overflow-tooltip="true" label="课程名称">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li class="active" @click="detail(scope.row)">{{ scope.row.name }}</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" align="center" min-width="110" label="时长"> </el-table-column>
                    <el-table-column prop="createUserName" align="center" label="创建者"> </el-table-column>
                    <el-table-column prop="groupName" align="center" label="观看权限"> </el-table-column>
                    <el-table-column align="center" :show-overflow-tooltip="true" label="课程分类">
                        <template slot-scope="scope">
                            <div v-if="scope.row.labelNameList" class="videoSort">
                                {{ scope.row.categoryName }} - {{ labelString(scope.row.labelNameList) }}
                            </div>
                            <div v-else class="videoSort">{{ scope.row.categoryName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status | status
                            }}<i
                                v-if="scope.row.status == 2"
                                :title="scope.row.rejectReason ? scope.row.rejectReason : '无理由'"
                                class="el-icon-question"
                                style="margin-left: 5px"
                            ></i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="公网点播">
                        <template slot-scope="scope">
                            {{ scope.row.publicVod | publicVodStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="version != 1" align="center" label="转码状态">
                        <template slot-scope="scope">
                            <p v-if="scope.row.convertStatus == 2">
                                {{ '转码失败:' + (scope.row.msg ? scope.row.msg : '未知') }}
                            </p>
                            <p v-else>{{ scope.row.convertStatus | transStatus }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="来源">
                        <template slot-scope="scope">
                            {{ scope.row.source | source }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" align="center" width="150" label="添加时间">
                    </el-table-column>
                    <el-table-column align="center" width="350px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li
                                    @click="handleFilm(scope.row)"
                                    v-if="permission.addClip"
                                    :class="scope.row.convertStatus === 1 ? 'active' : ''"
                                >
                                    剪辑
                                </li>
                                <li
                                    @click="submit(0, scope.row)"
                                    v-if="permission.submit"
                                    :class="scope.row.status == 0 && scope.row.convertStatus == 1 ? 'active' : ''"
                                >
                                    送审
                                </li>
                                <li
                                    @click="audit(0, scope.row)"
                                    v-if="permission.audit"
                                    :class="scope.row.status == 1 ? 'active' : ''"
                                >
                                    审核
                                </li>
                                <li
                                    @click="add(0, scope.row)"
                                    v-if="permission.update"
                                    :class="
                                        (scope.row.status == 0 || scope.row.status == 2 || scope.row.status == -2) &&
                                        scope.row.convertStatus > 0
                                            ? 'active'
                                            : ''
                                    "
                                >
                                    编辑
                                </li>
                                <li
                                    @click="downLoad(version == 1 ? 1 : 0, scope.row)"
                                    v-if="permission.getDownloadUrl"
                                    :class="scope.row.status == 3 && scope.row.convertStatus == 1 ? 'active' : ''"
                                >
                                    下载
                                </li>
                                <li
                                    @click="publicVod(0, scope.row)"
                                    v-if="permission.addPublicVod"
                                    :class="scope.row.status == 3 && scope.row.publicVod == 0 ? 'active' : ''"
                                >
                                    公网点播
                                </li>
                                <li
                                    @click="deleteData(0, scope.row)"
                                    v-if="permission.delete"
                                    :class="scope.row.convertStatus > 0 ? 'actives' : ''"
                                >
                                    删除
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-page">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :page-count="pages"
                    :current-page="pageNum"
                >
                </el-pagination>
            </div>
        </div>

        <el-dialog
            title="视频剪辑"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="filmShow"
            :before-close="handleClose"
            width="1200px"
        >
            <div class="film">
                <div class="left">
                    <div id="videoFilm" ref="videoFilm"></div>
                    <div class="editing">
                        <div class="slider">
                            <el-slider
                                v-if="filmShow"
                                class="elSlider"
                                v-model="videoList.cutRange"
                                range
                                :format-tooltip="formatTime"
                                @change="changeRange"
                                :max="videoList.duration"
                            >
                            </el-slider>
                            <div class="time">
                                {{ totalTime }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title">剪辑时间</div>
                    <div class="dialog-item">
                        <p>开始时间</p>
                        <p><em>*</em>：</p>
                        <el-input disabled clearable :value="_cutRange[0]" class="width-5"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>结束时间</p>
                        <p><em>*</em>：</p>
                        <el-input disabled clearable :value="_cutRange[1]" class="width-5"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>课程分类</p>
                        <p><em>*</em>：</p>
                        <el-select class="width-5" @change="handleTheme" v-model="themeValue" placeholder="请选择">
                            <el-option v-for="item in themeData" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="sublevel-file" v-if="themeTypeList.length > 0">
                        <div
                            v-for="(nape, index) in themeTypeList"
                            :key="index"
                            style="float: left; margin-left: 20px !important; margin-bottom: 20px"
                        >
                            <el-select
                                class="width-9"
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
                        </div>
                    </div>

                    <!-- <div class="dialog-item" v-for="(nape,index) in themeTypeList" :key="index">
						<p>{{ nape.name }}</p>
						<div class="px"><em>*</em>：</div>
						<el-select class="width-5" clearable v-model="nape.value" placeholder="请选择" v-if="nape.children">
							<el-option
							v-for="item in nape.children"
							:key="item.id"
							:label="item.name"
							:value="item.id">
							</el-option>
						</el-select>
					</div> -->

                    <div class="dialog-item">
                        <p>课程名称</p>
                        <p><em>*</em>：</p>
                        <el-input clearable v-model.trim="film.name" class="width-5"></el-input>
                    </div>
                    <div class="dialog-item">
                        <p>简介</p>
                        <p><em style="opacity: 0">*</em>：</p>
                        <el-input
                            v-model="film.description"
                            class="width-5"
                            type="textarea"
                            resize="none"
                            :autosize="{minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                        >
                        </el-input>
                    </div>
                    <el-button type="primary" class="put" @click="handleSubmit">提交任务</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="提交任务"
            :close-on-press-escape="false"
            top="40vh"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
        >
            <span>剪辑任务提交成功！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleAgain">再次剪辑</el-button>
                <el-button type="primary" @click="handleExamine">查看进度</el-button>
            </span>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="submitShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">送审后无法修改该课程，确认送审？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="submit(1)">确 定</el-button>
                    <el-button @click="submitShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="课程审核"
            :close-on-click-modal="false"
            :visible.sync="auditShow"
            :before-close="auditShowClose"
            width="550px"
        >
            <div class="dialog-wrap">
                <div id="auditFilm" ref="auditFilm" class="auditFilm"></div>
                <div class="auditItem">
                    <div class="dialog-item">
                        <p>审核结果</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="auditStatus" placeholder="请选择" class="width-5">
                            <el-option v-for="item in auditList" :key="item.id" :label="item.value" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item" v-if="auditStatus == 2">
                        <p>驳回理由</p>
                        <p style="margin-right: 5px"><em></em>：</p>
                        <el-input type="textarea" :rows="3" class="width-5" v-model="rejectReason"></el-input>
                    </div>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="audit(1)">确 定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="删除课程" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">确认删除该课程？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData(1)">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="清晰度选择" :close-on-click-modal="false" :visible.sync="transCodingShow" width="420px">
            <div class="dialog-wrap">
                <div class="dialog-item">
                    <p>清晰度</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="transCoding" placeholder="请选择" class="width-5">
                        <el-option
                            v-for="item in transCodingList"
                            :key="item.id"
                            :label="item.typeName"
                            :value="item.url"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="downLoad(1)">确 定</el-button>
                    <el-button @click="transCodingShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="公网点播设置"
            :close-on-click-modal="false"
            :before-close="closePublicVod"
            :visible.sync="joinPublicVodShow"
            width="460px"
        >
            <div class="dialog-wrap">
                <div class="dialog-item">
                    <p>课程名称</p>
                    <p><em>*</em>：</p>
                    <el-input v-model.trim="name" clearable class="width-2"></el-input>
                </div>

                <div class="dialog-item">
                    <p>简介</p>
                    <p><em style="opacity: 0">*</em>：</p>
                    <div class="upload-wrap">
                        <textarea v-model.trim="description" class="textDescription"></textarea>
                    </div>
                </div>

                <div class="dialog-item">
                    <p>公网观看权限</p>
                    <p><em>*</em>：</p>
                    <el-radio v-model="watchType" :label="0">所有人可看</el-radio>
                    <el-radio v-model="watchType" :label="1">授权码观看</el-radio>
                </div>

                <div class="dialog-item" v-if="watchType === 1">
                    <p>公网观看密码</p>
                    <p><em>*</em>：</p>
                    <el-input
                        class="width-2"
                        placeholder="4-20数字字母组成"
                        v-model.trim="watchPassword"
                        clearable
                        show-password
                    ></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="publicVod(1)">确 定</el-button>
                    <el-button @click="closePublicVod">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            :close-on-click-modal="false"
            width="400px"
            title="操作提示"
            center
            :visible.sync="flowLack"
            append-to-body
        >
            <div class="tip">艾课云直播流量不足，请联系管理员！</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="flowLack = false">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Player from 'xgplayer';
import {mapActions, mapState} from 'vuex';
import {storage, creatTree} from '../../../assets/js/utils';
export default {
    name: '',
    data() {
        return {
            detailData: {},
            searchThemeList: [
                {value: '', label: '全部'},
                {value: 0, label: '待提交'},
                {value: 1, label: '待审核'},
                {value: 2, label: '驳回'},
                {value: 3, label: '已发布'},
            ],
            searchThemeStatus: '',
            totalTime: '',
            videoList: {
                cutRange: [0, 0],
                currentTime: 0, // 当前时间 秒
                duration: 0, // 总时间 秒
            },
            film: {
                // 剪辑参数
                labelIdList: [],
                name: '',
                startTime: '',
                endTime: '',
                url: '',
                description: '',
                categoryId: '',
            },
            searchKey: '',
            tableData: [],
            pageNum: 1,
            permission: '',
            pages: 0,
            submitShow: false,
            submitRow: '',
            auditList: [
                {id: 3, value: '通过'},
                {id: 2, value: '不通过'},
            ],
            auditStatus: 3,
            rejectReason: '',
            auditShow: false,
            auditRow: '',
            deleteShow: false,
            deleteRow: '',
            transCodingShow: false,
            transCoding: '',
            transCodingList: [],
            version: '',
            filmShow: false, // 剪辑弹窗
            myVideo: null,
            // ceshi: -1, // 默认删掉
            themeValue: '',
            themeData: [
                {
                    id: 8,
                    name: '教师研修',
                },
                {
                    id: 4,
                    name: '优质资源',
                },
                {
                    id: 6,
                    name: '课外知识',
                },
            ],
            themeTypeList: [],
            currentData: [], // 选中当前的data
            centerDialogVisible: false, // 提交任务cpm
            totalS: '',
            limitTime: '', // 限制最小时常5秒

            joinPublicVodShow: false, // 加入公网点播弹窗
            flowLack: false, // 流量不足
            name: '', // 课程标题名称
            description: '', // 简介描述
            watchType: 0, // 观看类型
            watchPassword: '', // 观看密码
            id: '', // 课程id
            auditFilm: '', // 审核课程
            loading: false, // 表格加载
        };
    },
    computed: {
        _cutRange() {
            return Array.from(this.videoList.cutRange, this.formatTime);
        },
        ...mapState({
            uploadTable: 'uploadTable',
        }),
    },
    components: {},
    watch: {
        $route(to, from) {
            if (from.path !== '/sm/file') {
                if (from.path == '/sys/home') {
                    this.searchKey = '';
                    this.searchThemeStatus = this.$route.query.type ? Number(this.$route.query.type) : '';
                    this.pageNum = 1;
                    this.getManageList();
                } else {
                    // 公网点播进度、新增、编辑、详情页返回主页面，不需要重置分页和过滤项
                    if (
                        !(
                            from.path == '/sm/publicondemand' ||
                            from.path == '/sm/fileaddedit' ||
                            from.path == '/sm/fileaddedit' ||
                            from.path == '/sm/filedetail'
                        )
                    ) {
                        this.searchKey = '';
                        this.searchThemeStatus = '';
                        this.pageNum = 1;
                    }
                    this.getManageList();
                }
            }
        },
    },
    mounted() {
        if (this.$route.query.type) {
            this.searchThemeStatus = Number(this.$route.query.type);
        }
        if (localStorage.getItem('uiType') == 2) {
            this.handleGetType();
        }
        this.$bus.off('getFileList', this.getManageList);
        this.$bus.on('getFileList', this.getManageList);
        this.version = storage.get('version');
        this.getManageList();
        // setTimeout(() => { // 开发暂时开放 待删除
        // 	this.handelGetVideo();
        // }, 100)
        window.fileList = this.getManageList;
    },
    methods: {
        // 关闭公网点播清空密码
        closePublicVod() {
            this.joinPublicVodShow = false;
            this.watchPassword = '';
            this.watchType = 0;
        },
        // 分类字符串
        labelString(arr) {
            if (arr) {
                return arr.join(',');
            } else {
                return '暂无下级分类';
            }
        },
        // 关闭审核窗口
        auditShowClose() {
            this.auditFilm.destroy(); // 销毁播放器
            this.auditStatus = 3;
            this.rejectReason = '';
            this.auditShow = false;
        },
        // 关闭窗口提示
        closeWindowTips() {
            // console.log('TIPS')
            let _this = this;
            window.onbeforeunload = function (e) {
                if (_this.uploadTable.length != 0) {
                    e = e || window.event;
                    // 兼容IE8和Firefox 4之前的版本
                    if (e) {
                        // console.log(e)
                        _this.$message('有正在上传的课程任务', 'warning', 70, 3000);
                    }
                    console.log(e);
                    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                    return '关闭提示';
                } else {
                    window.onbeforeunload = null;
                }
            };
        },
        // 查看剪辑进度
        handleExamine() {
            this.$axios.get('auth/menu?type=1').then((res) => {
                let istrue = res.data.filter((el) => el.id == 4082);
                console.log(istrue, 'fff');
                if (istrue.length > 0) {
                    this.centerDialogVisible = false;
                    // this.commitSysModule(1)
                    this.$router.push('/sm/clip');
                } else {
                    this.$message('您没有当前操作的权限，请联系管理员', 'error');
                }
            });
        },
        // 再次剪辑
        handleAgain() {
            this.centerDialogVisible = false;
            // 销毁播放
            this.getManageList();
            this.handleFilm(this.detailData);
        },
        // 提交任务
        handleSubmit() {
            if (this.changeRange()) {
                return;
            }
            // if (this.videoList.cutRange[0] > this.videoList.cutRange[1] ) {
            // 	his.$message('开始时间不能大于结束时间', 'error');
            // }
            if (this.$verify.isEmpty(this.themeValue)) {
                this.$message('请选择分类', 'error');
                return true;
            }
            let ifResult = false;
            if (this.themeTypeList.length !== 0) {
                let ifType = this.themeTypeList.some((v, i) => {
                    if (v.value === null || v.value === '') {
                        this.$message(`${v.name}未选`, 'error');
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
            if (!this.film.name) {
                this.$message('名称不能为空！', 'error');
                return true;
            }
            if (this.film.name && this.film.name.length > 20) {
                this.$message('名称最长20位！', 'error');
                return true;
            }

            if (this.film.description && this.film.description.length > 50) {
                this.$message('简介最长50个字', 'error');
                return true;
            }

            let typeIdList = [];
            this.themeTypeList.forEach((v) => {
                if (v.value !== null || v.value !== '') {
                    typeIdList.push(v.value);
                }
            });
            this.$axios
                .post('/sm/clip/addClip', {
                    labelIdList: typeIdList,
                    name: this.film.name,
                    startTime: this._cutRange[0],
                    endTime: this._cutRange[1],
                    url: this.currentData.url,
                    // url: 'http://192.168.164.211/vdisk1/video/file/ML_20200608110524_17af5c0d-cfef-4864-93b4-5db253966034.mp4',
                    description: this.film.description,
                    categoryId: this.themeValue,
                })
                .then((res) => {
                    // 以上重置表单
                    if (res.code === 200) {
                        // 销毁播放
                        this.currentData.url = '';
                        if (this.myVideo && this.myVideo.destroy) {
                            this.myVideo.src = '';
                            // this.myVideo.destroy();
                        } else {
                            this.$refs.videoFilm.innerHTML = ''; // 销毁播放器
                        }
                        this.themeValue = '';
                        this.film.name = '';
                        this.film.description = '';
                        this.themeTypeList = [];
                        this.videoList.duration = 0;
                        this.videoList.cutRange[0] = 0;
                        this.videoList.cutRange[1] = 0;
                        this.$message(res.message, 'success');
                        this.filmShow = false;
                        this.centerDialogVisible = true;
                    }
                });
        },
        // 课程分类change
        handleTheme() {
            this.getTypeList();
        },
        //获取类型
        getTypeList() {
            this.$axios
                .get('/sm/label/listByCategory', {
                    categoryId: this.themeValue,
                    type: 0,
                    // id: this.$route.query.themeid
                    // id: this.currentData.id
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
        // 获取类型
        handleGetType() {
            this.$axios.get('/sm/category/listAll').then((res) => {
                if (res.code === 200) {
                    let arr = res.data.filter((el) => el.id !== 1);
                    this.themeData = arr;
                }
            });
        },
        // 改变断点判断时长是否小于5s,
        changeRange() {
            this.limitTime = Math.abs(this.videoList.cutRange[0] - this.videoList.cutRange[1]);
            if (this.limitTime < 15) {
                this.$message('课程时长不能少于15秒', 'error');
                return true;
            }
        },
        formatTime(sec) {
            const s = sec % 60;
            const _m = parseInt(sec / 60);
            const m = _m % 60;
            const h = parseInt(_m / 60);
            const times = [h, m, s];
            const ret = Array.from(times, (item) => String(item).padStart(2, 0)).join(':');
            return ret;
        },
        handleCancel() {
            this.filmShow = false;
            // 销毁播放
            this.currentData.url = '';
            if (this.myVideo && this.myVideo.destroy) {
                this.myVideo.src = '';
                // this.myVideo.destroy();
            } else {
                this.$refs.videoFilm.innerHTML = '';
            }
        },
        auditGetVideo(url) {
            this.auditFilm = new Player({
                id: 'auditFilm',
                url: url,
                autoplay: true,
                closeVideoClick: true,
                closeVideoTouch: true,
                errorTips: '暂无视频源',
                width: 460,
                height: 270,
                lang: 'zh-cn',
            });
        },
        handelGetVideo(params) {
            if (this.myVideo !== null) {
                this.myVideo.destroy();
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url:
                        process.env.NODE_ENV == 'production'
                            ? this.currentData.url
                            : 'http://192.168.164.59' + this.currentData.url,
                    // url: this.currentData.url,
                    autoplay: true,
                    videoInit: true,
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            } else {
                this.myVideo = new Player({
                    id: 'videoFilm',
                    url:
                        process.env.NODE_ENV == 'production'
                            ? this.currentData.url
                            : 'http://192.168.164.59' + this.currentData.url,
                    autoplay: true,
                    videoInit: true,
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '暂无视频源',
                    lang: 'zh-cn',
                });
            }
            // params.localFileUrl  视频地址
            // let arr = ['http://www.w3school.com.cn/i/movie.ogg','http://st.wssqxt.com/pcImg-20191125195819.mp4'];
        },
        handleClose() {
            // 剪辑clone
            this.filmShow = false;
            // this.videoList.cutRange = ['', ''];
            this.themeValue = '';
            this.film.name = '';
            this.film.description = '';
            this.themeTypeList = [];
            this.limitTime = '';
            this.videoList.duration = 0;
            this.videoList.cutRange[0] = 0;
            this.videoList.cutRange[1] = 0;
            // 销毁播放
            this.currentData.url = '';
            if (this.myVideo && this.myVideo.destroy) {
                this.myVideo.src = '';
                // this.myVideo.destroy();
            } else {
                this.$refs.videoFilm.innerHTML = '';
            }
        },
        // 剪辑btn
        handleFilm(row) {
            this.detailData = row;
            if (row.convertStatus !== 1) {
                return;
            }
            this.currentData = JSON.parse(JSON.stringify(row));
            // let time = '00:11:22';
            let time = this.currentData.time;
            const [h, m, s] = time.split(':');
            const second = h * 60 * 60 + m * 60 + s * 1;
            this.videoList.duration = second; // 课程总时长 通过接口返回
            this.$set(this.videoList.cutRange, 1, second);

            // this.ceshi = this.ceshi += 1; // 默认删掉
            this.filmShow = true;
            this.totalTime = this.currentData.time;
            setTimeout(() => {
                this.handelGetVideo();
            }, 100);
        },
        //获取列表
        getManageList() {
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
                keyWord: this.searchKey,
                status: this.searchThemeStatus,
            };
            this.$axios.get('/sm/file/list', data).then((res) => {
                this.loading = false; // 表格加载
                this.tableData = res.data.pageList;
                this.permission = this.creatPermit(res.data.permit);
                this.pages = res.data.pages;
                this.totalS = res.data.total;
                this.closeWindowTips();
            });
        },
        //课程1上传 0编辑
        add(type, val) {
            if (
                val &&
                this.uploadTable.findIndex((el) => {
                    return el.id == val.id;
                }) !== -1
            ) {
                return this.$message('该课程正在上传,请待上传成功之后再进行编辑', 'error');
            }
            if (type == 0) {
                if ((val.status == 0 || val.status == 2 || val.status == -2) && val.convertStatus > 0) {
                    this.$router.push({path: '/sm/fileaddedit', query: {id: val ? val.id : ''}});
                }
            } else {
                this.$router.push('/sm/fileaddedit');
            }
        },
        toPublicProgress() {
            this.$router.push('/sm/publicondemand');
        },
        //送审 0送审 1送审确定
        submit(type, val) {
            if (type == 0) {
                if (val.status != 0 || val.convertStatus != 1) {
                    return;
                }
                this.submitRow = val;
                this.submitShow = true;
            } else {
                this.$axios.post('/sm/file/submit', {id: this.submitRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.submitShow = false;
                        this.$message('送审成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getManageList();
                    }
                });
            }
        },
        //审核 0审核 1审核确定
        audit(type, val) {
            if (type == 0) {
                if (val.status != 1) {
                    return;
                }
                this.auditStatus = 3;
                this.rejectReason = '';
                this.auditRow = val;
                this.auditShow = true;
                this.$nextTick(() => {
                    this.auditGetVideo(val.url);
                });
            } else {
                let data = {
                    status: this.auditStatus,
                    id: this.auditRow.id,
                    rejectReason: this.rejectReason,
                };
                if (this.rejectReason && this.rejectReason.length > 20) {
                    this.$message('驳回理由不得超过20字符', 'error');
                    return;
                }
                this.auditFilm.destroy(); //播放器销毁
                this.rejectReason = '';
                this.$axios.post('/sm/file/audit', data).then((res) => {
                    if (res.code == 200) {
                        this.auditShow = false;
                        this.$message(this.auditStatus == 3 ? '审核成功' : '驳回成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getManageList();
                    }
                });
            }
        },
        //删除 0删除 1删除确定
        deleteData(type, val) {
            if (type == 0) {
                if (val.convertStatus == 0) {
                    return;
                }
                this.deleteRow = val;
                this.deleteShow = true;
            } else {
                this.$axios.post('/sm/file/delete', [this.deleteRow.id]).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.getManageList();
                    }
                });
            }
        },
        // 公网点播
        publicVod(type, row) {
            if (type === 0) {
                if (row.status != 3 || row.publicVod != 0) {
                    return;
                }
                this.joinPublicVodShow = true;
                this.name = row.name;
                this.description = row.description;
                this.id = row.id;
            }
            if (type === 1) {
                if (this.verify()) {
                    return;
                }
                let formData = {};
                formData.fileId = this.id;
                formData.name = this.name;
                formData.description = this.description;
                formData.watchType = this.watchType;
                if (this.watchType == 1) {
                    formData.watchPassword = this.watchPassword;
                }
                this.$axios
                    .post(`/sm/file/addPublicVod`, formData)
                    .then((res) => {
                        if (res.code === 200) {
                            this.$message('公网点播设置成功', 'success');
                            this.closePublicVod();
                            this.getManageList();
                        }
                        if (res.code === -10002) {
                            this.closePublicVod();
                            this.flowLack = true;
                            // console.log('流量不足')
                            // this.onDemandOuter = true;
                        }
                    })
                    .catch((err) => {
                        this.$message(err, 'error');
                    });
            }
        },
        //验证
        verify() {
            if (!this.name) {
                this.$message('请输入课程名称', 'error');
                return true;
            }
            if (this.name.length > 20) {
                this.$message('课程名称不能超过20字', 'error');
                return true;
            }
            if (this.description && this.description.length > 50) {
                this.$message('简介不能超过50字', 'error');
                return true;
            }
            if (this.watchType == 1) {
                if (!this.watchPassword) {
                    this.$message('请设置公网观看密码', 'error');
                    return true;
                }
                // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/;
                if (this.$verify.checkNumEn(this.watchPassword, 4, 20)) {
                    this.$message('公网观看密码须4-20位数字或字母或二者组成', 'error');
                    return true;
                }
            }
            return false;
        },
        // 关闭公网点播弹窗
        handleCloseJoin() {
            this.joinPublicVodShow = false;
        },

        //详情
        detail(val) {
            if (this.permission.info) {
                this.$router.push({path: '/sm/filedetail', query: {themeid: val.id}});
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        //搜索
        search() {
            this.scrollTo0();
            this.pageNum = 1;
            this.getManageList();
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('main-wrap')[0].scrollTo(0, 0);
        },
        //分页点击
        pageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.getManageList();
        },
        //下载 0下载 1下载确定
        downLoad(type, val) {
            if (type == 0) {
                this.deleteRow = val;
                if (val.status != 3 || val.convertStatus != 1) {
                    return;
                }
                this.$axios.get('/sm/file/getFileDetail', {id: val.id}).then((res) => {
                    if (res.code == 200) {
                        this.transCodingList = res.data;
                        this.transCoding = res.data[0].url;
                        this.transCodingShow = true;
                    }
                });
            } else {
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = this.transCoding;
                link.setAttribute('download', this.deleteRow.name); // 下载的文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // this.transCoding ? window.open(this.transCoding) : window.open(val.url);
                this.transCodingShow = false;
            }
        },
    },
    filters: {
        source(val) {
            let arr = ['用户上传', '直播录制', '剪辑'];
            return arr[val];
        },
        status(val) {
            switch (val) {
                case 0:
                    return '待提交';
                case 1:
                    return '待审核';
                case 2:
                    return '驳回';
                case 3:
                    return '已发布';
                case -1:
                    return '处理中';
                case -2:
                    return '处理失败';
                default:
                    return '-';
            }
        },
        publicVodStatus(val) {
            let arr = ['否', '是'];
            return arr[val];
        },
        transStatus(val) {
            let arr = ['处理中', '转码完成', '转码失败', '停止转码'];
            return arr[val];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.operat-list {
    display: flex;
    justify-content: space-around;
    color: #b3b6ba;
    font-size: 14px;
    cursor: pointer;

    .active {
        color: #409eff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
.actives {
    color: #f56c6c;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.auditItem {
    padding: 20px 0 20px 10px;
    .el-button {
        width: 98%;
    }
}
.dialog-item {
    .textDescription {
        height: 130px;
        width: 260px;
        border-radius: 4px;
        border: solid #dcdfe6 1px;
        resize: none;
        outline: none;
    }
    p:first-child {
        width: 90px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }

    .p {
        width: 90px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}

.film {
    display: flex;
    justify-content: space-between;

    .left {
        flex: 4;

        .editing {
            padding-top: 20px;
        }
    }

    .right {
        flex: 3;

        .title {
            font-size: 14px;
            padding-bottom: 20px;
        }

        .put {
            width: 84%;
            display: block;
            margin: 0 auto;
        }
    }
}

.videoSort {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.slider {
    display: flex;
    justify-content: space-between;

    .elSlider {
        width: 84%;
    }

    .time {
        line-height: 37px;
        margin-right: 20px;
    }
}
</style>

<style lang="scss">
.sublevel-file {
    padding-left: 90px;
    overflow: hidden;

    .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>

<template>
    <div class="second-wrap">
        <p class="content-title"><el-page-header @back="goBack" content="AI磨课详情"></el-page-header></p>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="0" class="menu-item">基础信息</el-menu-item>
            <!-- <el-menu-item index="1" v-if="detailInfo.publicVod == 1">公网点播</el-menu-item> -->
        </el-menu>
        <div class="content-wrap scroll-wrap" v-if="activeIndex == 0">
            <ul class="detail-list">
                <li>
                    <p class="title">课程名称：</p>
                    <p class="value">{{ detailInfo.name }}</p>
                </li>
                <li>
                    <p class="title">课堂类型：</p>
                    <p class="value">{{ detailInfo.classTypeName }}</p>
                </li>
                <li>
                    <p class="title">教师：</p>
                    <p class="value">{{ detailInfo.teacherName }}</p>
                </li>
                <li>
                    <p class="title">AI次数来源：</p>
                    <p class="value">{{ detailInfo.aiProjectName }}</p>
                </li>
                <li>
                    <p class="title">创建者：</p>
                    <p class="value">{{ detailInfo.createUserName }}</p>
                </li>
                <li v-if="detailInfo.resources == 1 || detailInfo.resources == 3">
                    <p class="title">开始时间：</p>
                    <p class="value">{{ detailInfo.startTime }}</p>
                </li>
                <li v-if="detailInfo.resources == 1 || detailInfo.resources == 3">
                    <p class="title">结束时间：</p>
                    <p class="value">{{ detailInfo.endTime }}</p>
                </li>
                <li>
                    <p class="title">磨课班级：</p>
                    <p class="value">{{ detailInfo.grindingGradeName + ' — ' + detailInfo.grindingClassName }}</p>
                </li>
                <li v-if="detailInfo.resources == 1">
                    <p class="title">磨课位置：</p>
                    <p class="value">
                        {{
                            detailInfo.grindingSchoolName +
                            ' - ' +
                            detailInfo.grindingBuildingName +
                            ' - ' +
                            detailInfo.grindingClassroomName
                        }}
                    </p>
                </li>
                <li>
                    <p class="title">录制状态：</p>
                    <p class="value">{{ videoState }}</p>
                </li>
                <li>
                    <p class="title">分析状态：</p>
                    <p class="value">{{ aiState }}</p>
                </li>
                <li class="li eduLi">
                    <p class="title">教案：</p>
                    <div v-if="detailInfo?.teachingFileList?.length > 0">
                        <div v-for="(item, index) in detailInfo.teachingFileList" :key="index">
                            <span>{{ item.name }}</span
                            ><span
                                @click="handleDownload(item)"
                                style="margin-left: 10px; color: #1e80ff; cursor: pointer"
                                >下载</span
                            >
                        </div>
                    </div>
                    <span v-else class="value">无</span>
                </li>
            </ul>
            <div class="video-wrap" v-if="detailInfo.resources == 3">
                <div v-if="detailInfo.type == 2">
                    <div class="content">
                        <img
                            :src="detailInfo.coverUrl ? detailInfo.coverUrl : defaultImg"
                            alt=""
                            :onerror="defaultImg"
                        />
                        <div class="live-hover" @click="toPlay">
                            <i class="el-icon-video-play" style="cursor: pointer"></i>
                        </div>
                    </div>
                    <div class="btn-wrap" v-if="permission.report && detailInfo.aiStatus != 3">
                        <el-button type="primary" @click="openReport()">查看报告</el-button>
                    </div>
                    <div
                        class="btn-wrap"
                        v-if="permission.report && detailInfo.aiConfigId == 2 && detailInfo.aiStatus == 3"
                    >
                        <el-button type="primary" v-if="detailInfo.isResetting == 0" @click="resetting()"
                            >重置分析</el-button
                        >
                        <el-button
                            style="color: #b3b6ba"
                            type="primary"
                            v-if="detailInfo.isResetting == 1"
                            plain
                            disabled
                            >重置分析</el-button
                        >
                    </div>
                </div>
            </div>
            <div class="video-wrap" v-else>
                <div v-if="detailInfo.type != 0 && detailInfo.type != -1">
                    <div class="content">
                        <img
                            :src="detailInfo.coverUrl ? detailInfo.coverUrl : defaultImg"
                            alt=""
                            :onerror="defaultImg"
                        />
                        <div class="live-hover" @click="toPlay">
                            <i class="el-icon-video-play" style="cursor: pointer"></i>
                        </div>
                    </div>
                    <div class="btn-wrap" v-if="permission.report && detailInfo.aiStatus == 2">
                        <el-button type="primary" style="width: 132px" @click="openReport()">查看复盘/报告</el-button>
                    </div>
                    <div
                        class="btn-wrap"
                        v-if="permission.report && detailInfo.aiConfigId == 2 && detailInfo.aiStatus == 3"
                    >
                        <el-button type="primary" v-if="detailInfo.isResetting == 0" @click="resetting()"
                            >重置分析</el-button
                        >
                        <el-button
                            style="color: #b3b6ba"
                            type="primary"
                            v-if="detailInfo.isResetting == 1"
                            plain
                            disabled
                            >重置分析</el-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :title="detailInfo.name + (detailInfo.type == 1 ? '(磨课中)' : '(已结束)')"
            :close-on-click-modal="false"
            :visible.sync="alertVideo"
            width="600px"
            class="videoBox"
            :before-close="handleClose"
        >
            <div id="videoAlert" ref="videoAlert"></div>
        </el-dialog>
        <el-dialog
            class="resetting"
            title="重置分析"
            :append-to-body="true"
            :visible.sync="resettingShow"
            width="500px"
        >
            <span class="popUp">确认要重新提交视频文件进行AI分析吗?</span>
            <span class="prompt">(注：报告生成失败，请联系管理员或尝试重置分析)</span>
            <div style="margin-top: 40px; display: flex; justify-content: right">
                <el-button @click="resettingShow = false" style="margin-right: 10px">取 消</el-button>
                <el-button type="primary" @click="resetAnalysis()" style="margin-right: 10px">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Player from 'xgplayer';
import FlvJsPlayer from 'xgplayer-flv.js';
import {creatTree, baseUrl, getNowDate} from '@/assets/js/utils';
export default {
    name: '',
    data() {
        return {
            checkItem: null,
            defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
            myVideo: null,
            alertVideo: false,
            detailInfo: {},
            publicDetail: {}, // 公网点播详情
            groupList: [],
            auditDetailShow: false, // 基础信息权限
            qrcodeShow: false,
            playUrl: '',
            mobilePlayUrl: '',
            permission: JSON.parse(this.$route.query.permission),
            activeIndex: '0',
            pcUrl: '', // 艾课云播放
            Hur: '', // 艾课云h5播放
            auditPublicShow: false, // 公网点播权限
            watchType: '', // 公网点播权限类型
            watchPassword: '', // 公网点播密码
            cloudqrcodeShow: false, // 海报分享
            resettingShow: false, // 重置分享弹窗
            aiNum: 0, // ai分析次数
            resettingVal: {},
            auditList: [
                {
                    id: 0,
                    name: '所有人',
                },
                {
                    id: 1,
                    name: '授权码观看',
                },
            ],
            eduFileUrl: baseUrl + '/upload/uploadTeachingFile',
            edufileList: [], // 已上传文件数组
            delBtn: [], // 控制按钮
            teachingFileId: '', // 文件提交id
        };
    },
    mounted() {
        this.getDetailInfo(); // 获取基础信息
    },
    methods: {
        openReport() {
            if (this.detailInfo.resources == 3 && (this.detailInfo.aiUrl == null || this.detailInfo.aiUrl == '')) {
                this.$message('视频未上传，无法生成报告', 'error');
                return;
            }
            if (this.detailInfo.aiStatus == 0 || this.detailInfo.aiStatus == 1) {
                this.$message('报告生成中，请稍后再试！', 'error');
                return;
            }
            if (this.detailInfo.aiStatus == 3) {
                this.$message('报告生成失败，请联系管理员！', 'error');
                return;
            }
            if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                window.open('/aiReport?id=' + this.detailInfo.id, '_blank');
            } else {
                window.open(this.detailInfo.aiReport, '_blank');
            }
        },
        handleDownload(row) {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = row.url;
            link.setAttribute('download', row.name); // 下载的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        //切换信息
        handleSelect(index) {
            this.activeIndex = index;
        },
        toPlay() {
            if (this.permission.watchVideo) {
                if (this.detailInfo.aiUrl === null || this.detailInfo.aiUrl === '') {
                    this.$message('视频未上传，暂时无法观看', 'error');
                } else {
                    this.alertVideo = true;
                    setTimeout(() => {
                        this.handelGetVideo(this.detailInfo);
                    }, 100);
                }
            } else {
                this.$message('您没有当前操作的权限，请联系管理员！', 'error');
            }
        },
        checkTime() {
            this.$axios.get('/aiGrinding/info', {id: this.$route.query.themeid}).then((res) => {
                this.detailInfo = res.data;
                if (this.edufileList.length == 0) {
                    this.edufileList = res.data.teachingFileList; // 教学文件
                }
                this.handelGetVideo(this.detailInfo);
            });
        },
        handleClose() {
            clearInterval(this.checkItem);
            if (this.myVideo && this.myVideo.destroy) {
                this.myVideo.destroy();
            } else {
                this.$refs.videoAlert.innerHTML = '';
            }
            this.alertVideo = false;
        },
        handelGetVideo(val) {
            console.log(val.type);
            if (this.myVideo) {
                this.myVideo = null;
            }
            if (this.checkItem !== null) {
                clearInterval(this.checkItem);
            }
            if (val.type == 1) {
                this.checkItem = setInterval(() => {
                    if (this.myVideo !== null && this.myVideo.mediainfo) {
                        console.log(this.myVideo.mediainfo);
                        if (this.myVideo.mediainfo.hasAudio == true) {
                            console.log('有音频', this.myVideo.mediainfo.hasAudio);
                        } else {
                            console.log('无音频', this.myVideo.mediainfo.hasAudio);
                            this.myVideo.destroy();
                            this.handelGetVideo(_this.detailInfo);
                        }
                    }
                }, 1000);
                this.myVideo = new FlvJsPlayer({
                    id: 'videoAlert',
                    url: val.aiUrl,
                    // hasVideo: true,
                    // hasAudio: true,
                    volume: 0.6,
                    autoplay: true,
                    videoInit: true,
                    closeVideoClick: true,
                    closeVideoTouch: true,
                    errorTips: '回看视频生成中',
                    ignores: ['progress'],
                    isLive: true,
                    playsinline: true,
                    lang: 'zh-cn',
                    flvOptionalConfig: {
                        enableStashBuffer: true,
                        type: 'flv',
                    },
                });
                const _this = this;
                let video = document.getElementsByTagName('video')[0];
                video.addEventListener('loadedmetadata', function () {
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        console.log('HTTP FLV流有画面');
                    } else {
                        clearInterval(_this.checkItem);
                        console.log('HTTP FLV流没有画面');
                        _this.myVideo.destroy();
                        _this.handelGetVideo(_this.detailInfo);
                    }
                });
                _this.myVideo.on('error', function () {
                    _this.myVideo.destroy();
                    clearInterval(_this.checkItem);
                    _this.checkTime();
                });
            } else if (val.type == 2) {
                if (val.aiUrl.substring(val.aiUrl.length - 3) == 'mp4') {
                    this.myVideo = new Player({
                        id: 'videoAlert',
                        url: val.aiUrl,
                        autoplay: true,
                        videoInit: true,
                        closeVideoClick: true,
                        closeVideoTouch: true,
                        errorTips: '暂无视频源',
                        lang: 'zh-cn',
                    });
                } else {
                    let videoEl = `<div class="videoEnd" -webkit><p>回放视频生成中</p></div>`;
                    document.querySelector('#videoAlert').innerHTML = videoEl;
                }
            }
        },
        //获取详情-基础信息
        getDetailInfo() {
            this.$axios.get('/aiGrinding/info', {id: this.$route.query.themeid}).then((res) => {
                this.detailInfo = res.data;
                if (this.edufileList.length == 0) {
                    this.edufileList = res.data.teachingFileList; // 教学文件
                }
            });
        },
        //返回
        goBack() {
            this.$router.go(-1);
        },
        //重置分析弹窗
        resetting() {
            if (this.detailInfo.isResetting != 0) {
                return;
            }
            this.resettingVal = this.detailInfo;
            this.resettingShow = true;
        },
        //重置分析
        resetAnalysis() {
            this.$axios.get('/aiRecharge/count').then((res) => {
                this.aiNum = res.data.aiClass;
                if (this.aiNum === 0) {
                    this.$message('AI分析剩余次数不足！', 'error');
                    return;
                }
                let data = new FormData();
                data.append('id', this.resettingVal.id);
                this.$axios.post('/aiGrinding/resetAnalysis', data).then((res) => {
                    if (res.code === 200) {
                        this.resettingShow = false;
                        this.$message(res.data, 'success');
                        this.getDetailInfo();
                    }
                });
            });
        },
    },
    computed: {
        videoState() {
            switch (this.detailInfo.type) {
                case -1:
                    return '待提交';
                case 0:
                    return '未开始';
                case 1:
                    return '录制中';
                case 2:
                    return `录制完成`;
                case 3:
                    return `录制失败`;
                default:
                    return '-';
            }
        },
        aiState() {
            switch (this.detailInfo.aiStatus) {
                case -1:
                    return '排队中';
                case 0:
                    return '待分析';
                case 1:
                    return '分析中';
                case 2:
                    return `分析成功`;
                case 3:
                    return `分析失败`;
                default:
                    return '-';
            }
        },

        imgUrl() {
            return this.detailInfo.imgUrl; // 均用基本详情图片
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
#videoAlert {
    width: 100% !important;
}
::v-deep .el-dialog__body {
    padding: 0 20px 30px 20px;
}
.content-wrap {
    height: 80%;
    display: flex;
}
.menu-item {
    margin-left: 70px;
}
.detail-list {
    margin-left: 60px;
    li {
        display: flex;
        margin-top: 25px;
        line-height: 40px;
        font-size: 14px;
        .title {
            min-width: 70px;
            margin-right: 20px;
            color: #303133;
        }
        .value {
            margin-right: 15px;
            color: #606266;
        }
        .detail-btn {
            margin-left: 30px;
        }
        .copy-url {
            margin-left: 20px;
            color: #409eff;
            cursor: pointer;
        }
    }
}
.dialog-item {
    p:first-child {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}
.video-wrap {
    display: flex;
    flex-direction: column;
    margin: 18% 0 0 9%;
    .content {
        position: relative;
        width: 250px;
        height: 167px;
        margin-bottom: 30px;
        .video-status {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 5;
            width: 100%;
            line-height: 40px;
            text-align: center;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            i {
                margin-right: 9px;
            }
        }
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
        .live-hover {
            position: absolute;
            z-index: 3;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 180px;
            background: rgba(0, 0, 0, 0.6);
            i {
                font-size: 40px;
                color: #fff;
            }
        }
    }
    .btn-wrap {
        display: flex;
        justify-content: center;
        button {
            width: 116px;
        }
        .last-btn {
            margin-left: 18px;
        }
    }
}
.qrcode-wrap {
    margin-bottom: 30px;
    text-align: center;
    img {
        width: 328px;
        height: 185px;
    }
    .content {
        display: flex;
        width: 330px;
        margin-top: -2px;
        box-sizing: border-box;
        padding: 16px 20px 14px 20px;
        font-size: 18px;
        background: #85c1ff;
        color: #fff;
        .text-wrap {
            flex: 1;
            text-align: left;
            line-height: 25px;
            p:first-child {
                // -webkit-line-clamp:1;
                line-clamp: 1;
                width: 193px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .sec-p {
                font-size: 14px;
            }
        }
        .qrcode-img {
            width: 72px;
            height: 72px;
            margin-left: 25px;
            background: #fff;
            img {
                width: 60px;
                height: 60px;
                margin: 6px;
            }
        }
    }
}
::v-deep .videoEnd {
    width: 560px;
    height: 337.5px;
    background: #000;

    p {
        color: white;
        text-align: center;
        line-height: 337.5px;
    }
}
// .el-button--text:hover{
// 	color: #b3b6ba;
// }
</style>

<style lang="scss">
.eduLi {
    position: relative;
}
.el-upload__tip {
    height: 13px;
    line-height: 13px;
}
.eduLi .subBtn {
    position: absolute;
    bottom: 0px !important;
    left: 426px;
}
.upload-edufile .el-upload-list__item-name {
    overflow: hidden;
    width: 280px;
    text-overflow: ellipsis;
}
.upload-edufile .el-icon-close-tip {
    display: none !important;
    right: -110px;
}
.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: white;
}
.prompt {
    color: gray;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}
.resetting {
    .el-dialog__title {
        padding-left: 20px;
    }
    .el-dialog__body {
        padding: 30px 20px;
        color: #606266;
        font-style: 14px;
        word-break: break-all;
    }
}
</style>

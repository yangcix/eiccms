<template>
    <div class="second-wrap">
        <p class="content-title"><el-page-header @back="goBack" content="课前指导详情"></el-page-header></p>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="0" class="menu-item">基础信息</el-menu-item>
        </el-menu>
        <div class="content-wrap scroll-wrap" v-if="activeIndex == 0">
            <ul class="detail-list">
                <li>
                    <p class="title">课程名称：</p>
                    <p class="value">{{ detailInfo.name }}</p>
                </li>
                <li>
                    <p class="title">学科：</p>
                    <p class="value">{{ detailInfo.subjectName }}</p>
                </li>
                <li>
                    <p class="title">课堂类型：</p>
                    <p class="value">{{ detailInfo.classTypeName }}</p>
                </li>
                <li>
                    <p class="title">历史课程：</p>
                    <p class="value">{{ detailInfo.historyCourseName }}</p>
                </li>
                <li>
                    <p class="title">教师：</p>
                    <p class="value">{{ detailInfo.teacherName }}</p>
                </li>
                <li>
                    <p class="title">年级：</p>
                    <p class="value">{{ detailInfo.gradeName }}</p>
                </li>
                <li>
                    <p class="title">状态：</p>
                    <p class="value">{{ videoState }}</p>
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
                <li>
                    <p class="title">创建者：</p>
                    <p class="value">{{ detailInfo.createUserName }}</p>
                </li>
                <li>
                    <p class="title">创建时间：</p>
                    <p class="value">{{ detailInfo.createTime }}</p>
                </li>
            </ul>
            <div class="video-wrap">
                <div>
                    <div class="btn-wrap">
                        <el-button type="primary" @click="openReport()">查看报告</el-button>
                    </div>
                    <div class="btn-wrap">
                        <el-button @click="openReport()">下载报告</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            detailInfo: {},
            activeIndex: '0',
        };
    },
    mounted() {
        this.getDetailInfo(); // 获取基础信息
    },
    methods: {
        openReport() {
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
        //获取详情-基础信息
        getDetailInfo() {
            this.$axios.get('/aiGrinding/info', {id: this.$route.query.themeid}).then((res) => {
                this.detailInfo = res.data;
            });
        },
        //返回
        goBack() {
            this.$router.go(-1);
        },
    },
    computed: {
        videoState() {
            switch (this.detailInfo.type) {
                case 0:
                    return '未开始';
                case 1:
                    return '磨课中';
                case 2:
                    return `已结束`;
                default:
                    return '-';
            }
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
</style>

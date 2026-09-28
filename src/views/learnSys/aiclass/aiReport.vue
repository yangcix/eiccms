<template>
    <div class="second-wrap">
        <div style="text-align: right; background: #273b63; padding-right: 10px">
            <el-button type="text" @click="opneDialog"><i class="el-icon-download"></i>下载报告</el-button>
        </div>
        <iframe
            style="width: 100%; height: 100%"
            :src="detailInfo.aiReport ? detailInfo.aiReport : ''"
            frameborder="0"
        ></iframe>
        <el-dialog title="下载报告" :close-on-click-modal="false" :visible.sync="reportShow" width="500px">
            <div class="report-title">
                <div class="title">AI磨课</div>
                <div v-if="!isUnfold" class="icon-content" @click="changeUnfoldState">
                    <i class="el-icon-arrow-down"></i>展开
                </div>
                <div v-else class="icon-content" @click="changeUnfoldState"><i class="el-icon-arrow-up"></i>收起</div>
            </div>
            <div
                class="report-item"
                v-if="dataList.smCommentTemplate && dataList.smCommentTemplate.associatedDataReport == 1"
            >
                <span style="width: 300px">{{ dataList.smCommentTemplate.name }}</span>
                <el-button type="text" @click="openEvaluationTempReportNew(2, dataList.commentId)">查看</el-button>
                <el-button type="text" @click="openEvaluationTempReportNew(1, dataList.commentId)">下载</el-button>
            </div>
            <div
                v-else-if="
                    !(dataList.smCommentTemplate && dataList.smCommentTemplate.associatedDataReport == 1) &&
                    reportPermission.bigData
                "
                class="report-item"
            >
                <span style="width: 300px">课堂教学分析表</span>
                <el-button
                    v-if="dataList.bctiReport !== null && dataList.bctiReport !== ''"
                    type="text"
                    @click="openBigDataReportNew(1)"
                    >下载</el-button
                >
                <span v-else style="width: 180px">无报告，请联系管理员</span>
            </div>
            <div class="report-item" v-show="isUnfold && reportPermission.teacher">
                <span style="width: 300px">教学诊断数据</span>
                <el-button
                    v-if="dataList.teacherReport !== null && dataList.teacherReport !== ''"
                    type="text"
                    @click="openAiReportNew(0)"
                    >查看</el-button
                >
                <el-button
                    v-if="dataList.teacherReport !== null && dataList.teacherReport !== ''"
                    type="text"
                    @click="openAiReportNew(1)"
                    >下载</el-button
                >
                <span v-else style="width: 180px">无报告，请联系管理员</span>
            </div>
            <div class="report-item" v-show="isUnfold && reportPermission.professional">
                <span style="width: 300px">全量数据</span>
                <el-button
                    v-if="dataList.professionalReport !== null && dataList.professionalReport !== ''"
                    type="text"
                    @click="downloadPDFReport(1)"
                    >下载</el-button
                >
                <span v-else style="width: 180px">无报告，请联系管理员</span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            detailInfo: {},
            dataList: {},
            reportShow: false,
            isUnfold: false,
            reportPermission:{}
        };
    },
    mounted() {
        if (!localStorage.getItem('userInfo')) {
            this.$router.replace('/login');
            return;
        }
        this.getDetail();
    },
    methods: {
        downloadPDFReport(val) {
            this.$axios
                .get('/sm/comment/exportPDFReport', {id: this.$route.query.id, type: 0, form: val}, 'blob')
                .then((res) => {
                    let url = window.URL.createObjectURL(new Blob([res]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.download =
                        this.detailInfo.name +
                        '_' +
                        (val == 1 ? '专业版' : val == 0 ? '教师版' : '大数据报告') +
                        '.pdf';
                    document.body.appendChild(link);
                    link.click();
                    window.URL.revokeObjectURL(url);
                });
        },
        downloadReport() {
            window.open(this.dataList.bctiReport);
        },
        getDetail() {
            const loading = this.$loading({
                lock: true,
                text: '报告加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            this.$axios.get('/aiGrinding/getAiReport', {id: this.$route.query.id}).then((res) => {
                if (res.data && res.data.aiReport) {
                    this.detailInfo = res.data;
                    loading.close();
                }
            });
        },
        opneDialog() {
            this.$axios.get('/aiGrinding/downloadReport', {id: this.$route.query.id}).then((res) => {
                console.log(res.data);
                this.dataList = res.data;
                this.reportPermission = this.creatPermit(res.data.permit);
            });
            this.reportShow = true;
            this.isUnfold = false;
        },
        async openAiReportNew(downloadReport) {
            const res = await this.$axios.get('/aiGrinding/getDetail', {id: this.$route.query.id});
            if (res.code == 200) {
                console.log('analysisId: ', res.data.analysisId);
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/ai/teacherReport?analysisId=' + res.data.analysisId + '&analysisType=1';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        async openBigDataReportNew(downloadReport) {
            const res = await this.$axios.get('/aiGrinding/getDetail', {id: this.$route.query.id});
            if (res.code == 200) {
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/getNuBiAnalysisBctiData?analysisId=' + res.data.analysisId + '&analysisType=2';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        async openEvaluationTempReportNew(downloadReport, id) {
            const res = await this.$axios.get('/aiGrinding/getDetail', {id: id});
            if (res.code == 200) {
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/getNLessonEvaluationScale?analysisId=' + res.data.analysisId + '&analysisType=2';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        changeUnfoldState() {
            this.isUnfold = !this.isUnfold;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep .el-dialog {
    padding: 10px 20px;
}
.report-title {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 20px;

    .icon-content {
        cursor: pointer;
        color: #aaaaaa;
    }
}
.report-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 50px;
    margin-bottom: 5px;
}
</style>

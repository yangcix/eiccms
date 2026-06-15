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
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px">
                <span style="width: 300px">教师版</span>
                <!-- <el-button type="text" @click="downloadReport(0)">下载</el-button> -->
                <!-- <el-button type="text" @click="downloadPDFReport(0)">下载</el-button> -->
                <!--        <el-button v-if="dataList.teacherReport !== null && dataList.teacherReport !== ''" type="text" @click="downloadPDFReport(0)">下载</el-button>-->
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
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px">
                <span style="width: 300px">专业版</span>
                <!-- <el-button type="text" @click="downloadReport(1)">下载</el-button> -->
                <!-- <el-button type="text" @click="downloadPDFReport(1)">下载</el-button> -->
                <el-button
                    v-if="dataList.professionalReport !== null && dataList.professionalReport !== ''"
                    type="text"
                    @click="downloadPDFReport(1)"
                    >下载</el-button
                >
                <span v-else style="width: 180px">无报告，请联系管理员</span>
            </div>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin-bottom: 10px;
                "
            >
                <span style="width: 300px">大数据报告</span>
                <el-button
                    v-if="dataList.bctiReport !== null && dataList.bctiReport !== ''"
                    type="text"
                    @click="downloadPDFReport(2)"
                    >下载</el-button
                >
                <span v-else style="width: 180px">无报告，请联系管理员</span>
            </div>
            <!-- <div style="text-align: right;">
        <el-button @click="reportShow = false" style="margin-right: 30px;">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div> -->
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
        async openAiReportNew(downloadReport) {
            const res = await this.$axios.get('/sm/comment/getOne', {id: this.$route.query.id});
            if (res.code == 200) {
                console.log('analysisId: ', res.data.analysisId);
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/ai/teacherReport?analysisId=' + res.data.analysisId + '&analysisType=2';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        downloadPDFReport(val) {
            this.$axios
                .get('/sm/comment/exportPDFReport', {id: this.$route.query.id, type: 1, form: val}, 'blob')
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
            this.$axios.get('/sm/comment/getAiReport', {id: this.$route.query.id}).then((res) => {
                if (res.data && res.data.aiReport) {
                    this.detailInfo = res.data;
                    loading.close();
                }
            });
        },
        opneDialog() {
            this.$axios.get('/sm/comment/downloadReport', {id: this.$route.query.id}).then((res) => {
                this.dataList = res.data;
            });
            this.reportShow = true;
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
::v-deep .el-dialog {
    padding: 10px 20px;
}
</style>

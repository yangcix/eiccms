<template>
    <div id="ai-teacher-report" class="report-container">
        <!-- 第一页，报告信息页 -->
        <div class="page-container" data-order="1">
            <header style="width: 56%; margin: 0 auto">
                <img src="../../assets/imgs/logo-eicc.png" alt="Logo" style="margin-top: 80px" />
                <h1 style="margin: 50px 0 80px">{{ name }}</h1>
                <h2>《 {{ baseInfo?.analysisName }} 》</h2>
            </header>
            <main style="width: 50%; margin: 150px auto auto auto; font-size: 18px; line-height: 18px">
                <div v-for="item in infoList" :key="item.label" style="display: flex; margin-bottom: 22px">
                    <p style="width: 150px; text-align: right; margin-right: 10px">{{ item.label }}</p>
                    <p style="flex: 1; text-align: left">{{ item.value }}</p>
                </div>
            </main>
            <footer class="footer-version"><p>版本：1.5</p></footer>
        </div>

        <A4PaginateTable :reportData="reportData" v-if="reportData && Object.keys(reportData).length" />
    </div>
</template>

<script>
import A4PaginateTable from './components/A4PaginateTable.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
    name: 'AiTeacherReportPage',
    components: {A4PaginateTable},
    data() {
        return {
            analysisId: '',
            baseInfo: {
                analysisName: '',
                schoolName: '',
                subjectName: '',
                gradeName: '',
                reportNumber: '',
                teacherName: '',
                reportTimeCreated: '',
            },
            reportData: {},
            name: '',
        };
    },
    computed: {
        infoList() {
            const {teacherName, gradeName, subjectName, reportTimeCreated, schoolName, reportNumber} = this.baseInfo;
            return [
                {label: '执 教 教 师：', value: teacherName},
                {label: '班　　　级：', value: gradeName},
                {label: '学　　　科：', value: subjectName},
                {label: '报 告 时 间：', value: reportTimeCreated},
                {label: '所 在 学 校：', value: schoolName},
                {label: '报 告 编 号：', value: reportNumber},
            ];
        },
    },
    mounted() {
        const {analysisId, analysisType, downloadReport} = this.$route.query;
        if (!analysisId) return;
        this.analysisId = analysisId;
        this.$message('报告渲染中...');
        this.getReportData().then(() => {
            if (downloadReport === '1') {
                setTimeout(() => this.handleDownloadPDF(), 500);
            }
        });
    },
    methods: {
        async handleDownloadPDF() {
            try {
                this.$message('PDF生成中...');
                const container = document.getElementById('ai-teacher-report');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4',
                    compress: true,
                });
                const pdfWidth = 210;
                const pdfHeight = 297;

                // 收集页面
                const pageElements = [];
                const reportInfoPage = container.querySelector('.page-container');
                if (reportInfoPage) pageElements.push(reportInfoPage);

                const tablePages = container.querySelectorAll('.page-a4');
                if (tablePages.length) {
                    tablePages.forEach((el) => pageElements.push(el));
                } else if (pageElements.length === 1) {
                    const tableContainer = container.querySelector('.table-container, [class*="table"]');
                    if (tableContainer) pageElements.push(tableContainer);
                }

                for (let i = 0; i < pageElements.length; i++) {
                    const pageEl = pageElements[i];
                    if (i > 0) pdf.addPage();

                    const canvas = await html2canvas(pageEl, {
                        scale: 1.5, // 降采样
                        useCORS: true,
                        allowTaint: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                    });

                    // 用 blob -> Uint8Array，避免 base64 大字符串
                    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
                    const arrayBuffer = await blob.arrayBuffer();
                    const imgData = new Uint8Array(arrayBuffer);

                    const imgWidth = pdfWidth;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    if (imgHeight > pdfHeight) {
                        const scale = pdfHeight / imgHeight;
                        const finalWidth = imgWidth * scale;
                        const xOffset = (pdfWidth - finalWidth) / 2;
                        pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, pdfHeight);
                    } else {
                        const yOffset = (pdfHeight - imgHeight) / 2;
                        pdf.addImage(imgData, 'JPEG', 0, Math.max(0, yOffset), imgWidth, imgHeight);
                    }

                    // 释放 canvas 内存
                    canvas.width = 0;
                    canvas.height = 0;
                }

                pdf.save(`${this.baseInfo.analysisName + '_' + this.name || 'AI课堂报告'}.pdf`);
                this.$message.success('PDF下载成功！');
            } catch (error) {
                console.error('PDF生成失败:', error);
                this.$message.error('PDF生成失败，请重试');
            }
        },
        async getReportData() {
            try {
                const res = await this.$axios.get('/aiReport/getNLessonEvaluationScale', {analysisId: this.analysisId});
                if (res.code === 200) {
                    this.baseInfo = res.data?.baseInfo || {};
                    this.name = res.data?.name;
                    this.reportData = res.data || {};
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.report-container {
    width: 60vw;
    max-width: 794px;
    box-sizing: border-box;
    margin: 10px auto 0;
}

.page-container {
    width: 210mm;
    min-height: 297mm;
    padding: 12mm 10mm;
    background: white;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin: 0 auto 20px;

    header {
        text-align: center;
        width: 56%;
        margin: 0 auto;
    }
    header img {
        margin-top: 80px;
        max-width: 100%;
    }
    header h1 {
        margin: 50px 0 0;
    }
    header p {
        margin: 8px 0 80px;
        font-size: 22px;
        font-weight: 700;
    }
    main {
        width: 50%;
        margin: 150px auto auto auto;
        font-size: 18px;
        line-height: 18px;
    }
    .footer-version {
        margin-top: auto;
        text-align: right;
        padding-bottom: 10px;
        p {
            font-size: 14px;
            color: #b0b1c8;
            margin: 0;
        }
    }
}

@media (max-width: 1200px) {
    .report-container {
        width: 70vw;
    }
}
@media (max-width: 900px) {
    .report-container {
        width: 80vw;
    }
}

@media print {
    .report-container {
        width: 100%;
        max-width: 100%;
        margin: 0;
    }
    .page-container {
        box-shadow: none !important;
        page-break-after: always;
        margin: 0;
    }
    .page-container:last-child {
        page-break-after: auto;
    }
}
</style>

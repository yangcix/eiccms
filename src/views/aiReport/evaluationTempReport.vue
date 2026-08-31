<template>
    <div id="ai-teacher-report" class="report-container">
        <!-- 第一页，报告信息页 -->
        <div class="page-container" data-order="1">
            <header style="width: 56%; margin: 0 auto">
                <img src="../../assets/imgs/logo-eicc.png" alt="Logo" style="margin-top: 80px" />
                <h1 style="margin: 50px 0 0">AI课堂报告</h1>
                <p style="margin: 8px 0 80px; font-size: 22px; font-weight: 700">（{{ name }}）</p>
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
                setTimeout(() => this.handlePrint(), 500);
            }
        });
    },
    methods: {
        handlePrint() {
            const printContent = document.getElementById('ai-teacher-report').innerHTML;
            const win = window.open('', '_blank');
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>${this.name || 'AI课堂报告'}</title>
                    <style>
                        * { margin:0; padding:0; box-sizing:border-box; }
                        body { background:white; padding:0; }
                        .report-container { width:100%; max-width:794px; margin:0 auto; }

                        .page-a4 {
                            width:210mm;
                            min-height:297mm;
                            padding:12mm 10mm;
                            box-sizing:border-box;
                            display:flex;
                            flex-direction:column;
                            page-break-after:always;
                            margin:0 auto;
                        }
                        .page-a4:last-child { page-break-after:auto; }
                        .page-a4 table { flex:1; }

                        .page-footer {
                            margin-top:auto;
                            text-align:center;
                            font-size:11px;
                            color:#999;
                            padding-top:10px;
                            border-top:1px dashed #ddd;
                            flex-shrink:0;
                        }

                        .page-title { text-align:center; font-size:18px; font-weight:bold; margin-bottom:6px; }

                        table {
                            width:100%;
                            border-collapse:collapse;
                            font-size:12px;
                            table-layout:fixed;
                        }
                        table th, table td {
                            border:1px solid #333;
                            padding:4px 6px;
                            word-break:break-word;
                            line-height:1.7;
                            text-align:left;
                            vertical-align:middle;
                        }
                        table th { background:#f0f2f5; font-weight:700; text-align:center; }
                        table td.center { text-align:center; }

                        .table-title {
                            display:flex;
                            justify-content:space-between;
                            font-weight:700;
                            font-size:20px;
                            margin-bottom:8px;
                        }

                        /* 报告信息页样式 */
                        .page-container {
                            width:210mm;
                            min-height:297mm;
                            padding:12mm 10mm;
                            box-sizing:border-box;
                            display:flex;
                            flex-direction:column;
                            page-break-after:always;
                            margin:0 auto;
                            background:white;
                        }
                        .page-container:last-child { page-break-after:auto; }
                        .page-container header { text-align:center; width:56%; margin:0 auto; }
                        .page-container header img { margin-top:80px; max-width:100%; }
                        .page-container header h1 { margin:50px 0 0; }
                        .page-container header p { margin:8px 0 80px; font-size:22px; font-weight:700; }
                        .page-container main { width:50%; margin:150px auto auto auto; font-size:18px; line-height:18px; }
                        .page-container .footer-version {
                            margin-top:auto;
                            text-align:right;
                            padding-bottom:10px;
                        }
                        .page-container .footer-version p { font-size:14px; color:#b0b1c8; }

                        @page { size:A4; margin:0; }
                        @media print {
                            body { margin:0; }
                            .page-a4, .page-container {
                                box-shadow:none !important;
                                margin:0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
                </html>
            `);
            win.document.close();
            setTimeout(() => win.print(), 500);
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

<template>
    <div id="ai-teacher-report" class="report-container">
        <!--  第一页，报告信息页  -->
        <div class="page-container" data-order="1">
            <header style="width: 56%; margin: 0 auto">
                <img src="../../assets/imgs/logo-eicc.png" alt="Logo" style="margin-top: 80px" />
                <h1 style="margin: 50px 0 0">AI课堂报告</h1>
                <p style="margin: 8px 0 80px; font-size: 22px; font-weight: 700">（大数据版）</p>
                <h2 style="width: 100%">《 {{ baseInfo?.analysisName }} 》</h2>
            </header>
            <main style="width: 50%; height: 40%; margin: 150px auto auto auto; font-size: 18px; line-height: 18px">
                <section>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">执 教 教 师：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.teacherName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">
                            班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：
                        </p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.gradeName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">
                            学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：
                        </p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.subjectName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">报 告 时 间：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.reportTimeCreated }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">所 在 学 校：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.schoolName }}</p>
                    </div>
                    <div style="display: flex; margin-bottom: 22px">
                        <p style="width: 150px; text-align: right; margin-right: 10px">报 告 编 号：</p>
                        <p style="flex: 1; text-align: left">{{ baseInfo?.reportNumber }}</p>
                    </div>
                </section>
            </main>
            <footer class="footer-version">
                <p>版本：1.5</p>
            </footer>
        </div>

        <div class="page-container" data-order="2">
            <div class="table-title">
                <p>1、课堂教学分析</p>
                <p>综合评分：{{ totalScore.toFixed(2) }}</p>
            </div>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 20px">类</th>
                            <th style="width: 7.5cqh">指标</th>
                            <th style="width: 200px">要点及答案</th>
                            <th>大数据分析算法</th>
                            <th style="width: 35px">得分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-size-12 td-text-center" rowspan="5">教师主导</td>
                            <td class="font-size-12 td-text-center">1、目标定位（10分）</td>
                            <td class="font-size-12 td-text-center">
                                从正确价值观、必备品格、关键能力三大方面，把握教学目标，既重视学科教学，也着眼于综合素质的培育与
                                发展。
                            </td>
                            <td class="font-size-12 td-text-center">
                                1、知识点覆盖率及教案设计素养导向情况<br />
                                2、知识图谱辐射面<br />
                                3、课堂信息量
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教师主导::目标定位'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">2、课堂艺术 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                从教学语言、教学体态、教学情感等方面，体现教师职业特点，既热情大方又朴实得体，语言流畅，具有亲和
                                力和感染力。
                            </td>
                            <td class="font-size-12 td-text-center">
                                4、教师情感饱满度<br />
                                5、教师积极话语频次<br />
                                6、教师语言凝炼度<br />
                                7、教师授课语速
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教师主导::课堂艺术'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">3、课堂调控 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                根据学生的学习反应、课堂活动等，及时调整教学节奏
                                与教学活动，及时捕捉有价值的教学资源并加以有效利 用。
                            </td>
                            <td class="font-size-12 td-text-center">
                                8、教师正面回应学生的比率（弗兰德斯分析TRR)<br />
                                9、教师聚焦讲授与提问的比率（弗兰德斯分析CCR)<br />
                                10、师生话题交流稳定状态比率（弗兰德斯分析SSR)<br />
                                11、教师接受或延伸学生想法的情况（弗兰德斯分析T3)<br />
                                12、IRE模式中的教师引述学生情况<br />
                                13、师生交互总次数<br />
                                14、课堂控制<br />
                                15、积极氛围
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教师主导::课堂调控'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">4、思维激发 (14.0分)</td>
                            <td class="font-size-12 td-text-center">
                                从学生视角指明学习目标，选择恰当时机与方式引导深
                                入、猜想质疑、点拨纠偏、鼓励肯定；以指导者与合作
                                者角色，密切关注每个学生的学习状况，激励学生采用 独立自主、合作探究等多种方式开展学习。
                            </td>
                            <td class="font-size-12 td-text-center">
                                16、教师兼顾学生思维的均衡情况(知行教学风格)<br />
                                17、课程结构设计的四维清晰度（若何/为何/如何/是何的 总量）<br />
                                18、启发性（弗兰德斯分析I/D）<br />
                                19、教师正面回应学生的总量<br />20、教师的课堂想象力激发度<br />
                                21、教师追问型+思考再答型的提问与评价情况（IRE)<br />22、思维激发开放度
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教师主导::思维激发'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">5、评价反馈 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                教师具有同理心和包容心，对学生学习及时给予正面评
                                价和反馈，且运用多种方式鼓励学生互学互评，激发学 生的学习动力。
                            </td>
                            <td class="font-size-12 td-text-center">
                                23、教师接纳和鼓励学生的比率（弗兰德斯分析T1和 T2）<br />
                                24、学生主动发言的次数（弗兰德斯分析S2）<br />
                                25、教师积极情感占比<br />
                                26、教师提问与评价的总量下限（IRE)
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教师主导::评价反馈'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center" rowspan="3">学生主体</td>
                            <td class="font-size-12 td-text-center">6、整体发展 (14.0分)</td>
                            <td class="font-size-12 td-text-center">
                                课堂结构遵循学生身心发展规律，教学活动兼顾不同个
                                性兴趣、爱好特长、思维习惯的学生，给予学生充分的
                                学习和自我展示的时空，每个学生均可获得各自的进步 成长。
                            </td>
                            <td class="font-size-12 td-text-center">
                                27、课程结构设计的四维均衡度（若何/为何/如何/是何的 均衡情况）<br />
                                28、学生左右脑激发的平衡度<br />
                                29、课堂语言的可理解度<br />
                                30、学生发言和练习的时长
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['学生主体::整体发展'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">7、合作交流 (12.0分)</td>
                            <td class="font-size-12 td-text-center">
                                师生之间相互信任、彼此尊重、平等民主。从促进理解
                                的立场出发，师生、生生交流沟通深入，互动反馈及时 顺畅
                            </td>
                            <td class="font-size-12 td-text-center">
                                31、教师激励学生主动参与互动的情况 32、教师批评学生或维护权威的情况（弗兰德斯分析T7)<br />
                                33、教师激励学生互动的效率<br />
                                34、师生的互动比<br />
                                35、教师提问与评价的总量上限（IRE)<br />
                                36、学生主动发言
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['学生主体::合作交流'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">8、学习体验 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                学生积极参与各个学习环节，专注地思考各种问题，全
                                身心地投入到各项学习活动中，享受学习的快乐。
                            </td>
                            <td class="font-size-12 td-text-center">
                                37、学生发言人次 38、学生充分表达量<br />
                                39、学生积极情感占比<br />
                                40、学生表达的稳定状态比例（弗兰德斯分析PSSR)
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['学生主体::学习体验'] }}
                            </td>
                        </tr>
                        <tr>
                            <td class="font-size-12 td-text-center">教学达成</td>
                            <td class="font-size-12 td-text-center">9、目标达成 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                不同层次的学生都有收获，完成预期教学目标和取得较 好的教学效果。
                            </td>
                            <td class="font-size-12 td-text-center">
                                41、学生响应知识点的情况<br />
                                42、学生四种学习风格的激发情况<br />
                                43、教师授课知-行风格的兼顾情况<br />
                                44、教师推动有效学习程度<br />
                                45、师生发言相关度情况（教学效果序列分析）
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教学达成::目标达成'] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
        <div class="page-container" data-order="3">
            <!-- <section class="table-section">
                <table class="data-table">
                    <tbody>
                        <tr>
                            <td class="font-size-12 td-text-center">教学达成</td>
                            <td class="font-size-12 td-text-center">9、目标达成 (10.0分)</td>
                            <td class="font-size-12 td-text-center">
                                不同层次的学生都有收获，完成预期教学目标和取得较 好的教学效果。
                            </td>
                            <td class="font-size-12 td-text-center">
                                41、学生响应知识点的情况<br />
                                42、学生四种学习风格的激发情况<br />
                                43、教师授课知-行风格的兼顾情况<br />
                                44、教师推动有效学习程度<br />
                                45、师生发言相关度情况（教学效果序列分析）
                            </td>
                            <td class="font-size-12 td-text-center">
                                {{ indicatorScore['教学达成::目标达成'] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section> -->
            <div class="table-title">
                <p>2、学习素养分析</p>
            </div>
            <section class="table-section">
                <table class="data-table">
                    <tbody>
                        <tr>
                            <td class="font-size-12 td-text-center">
                                学生课堂兴趣指数: {{ indicatorScore['学生课堂兴趣指数'].toFixed(2) }}(常模:63.5)
                            </td>
                            <td class="font-size-12 td-text-center">
                                学生学科自信指数: {{ indicatorScore['学生学科自信指数'].toFixed(2) }}(常模:63.4)
                            </td>
                            <td class="font-size-12 td-text-center">
                                学科素养导向指数: {{ indicatorScore['学科素养导向指数'].toFixed(2) }}(常模:66.3)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import htmlToPdf from '@/components/utils/htmlToPdf';

export default {
    name: 'AiTeacherReportPage',
    data() {
        return {
            // 分析ID
            analysisId: '',
            // 分析类型 1磨课，2评课
            analysisType: 1,
            // 基本信息
            baseInfo: {
                id: 8,
                aiConfigId: '',
                analysisId: '',
                analysisName: '',
                schoolName: '',
                subjectName: '',
                gradeName: '',
                reportNumber: '',
                teacherName: '',
                reportTimeCreated: '',
            },
            indicatorScore: {},
            totalScore: 0,
        };
    },
    created() {},
    mounted() {
        const router = this.$route.query;
        if (router.analysisId === '' || router.analysisId.length === 0) {
            return;
        }
        this.analysisId = router.analysisId;
        this.analysisType = router.analysisType;

        // 动态计算容器的宽度，确保其为浏览器宽度的 60%
        this.$message('报告渲染中...');
        this.$nextTick(() => {
            this.getReportData();
            setTimeout(() => {
                this.viewReport();
            }, 2000);
        });
    },
    destroyed() {},
    methods: {
        downloadPDF() {
            let uploadUrl = '/aiReport/api/upload';
            this.$message('报告下载中，请稍后！');
            this.$nextTick(() => {
                htmlToPdf.downloadPDF(
                    '.page-container',
                    this.baseInfo.analysisName + '_大数据版',
                    uploadUrl,
                    this.analysisId,
                    this.analysisType
                );
            });
        },

        viewReport() {
            const router = this.$route.query;
            console.log('router.downloadReport: ', router.downloadReport);
            if (router.downloadReport === '1') {
                console.log('下载新版报告...');
                this.downloadPDF();
            }
        },
        // 获取分析池总计数据
        async getReportData() {
            try {
                const res = await this.$axios.get('/aiReport/getNuBiAnalysisBctiData', {analysisId: this.analysisId});
                if (res.code == 200) {
                    this.$nextTick(() => {
                        this.baseInfo = res.data?.baseInfo;
                        this.indicatorScore = res.data?.indicatorScore;
                        this.totalScore = res.data?.totalScore;
                    });
                } else {
                    console.error('Error fetching report data:', res.message);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        },
    },
};
</script>

<style scoped lang="scss">
/* ::v-deep  */
/* 设置整个报告容器 */
.report-container {
    width: 60vw; /* 宽度占浏览器的60% */
    max-width: 794px; /* A4 宽度的最大限制（300 DPI下） 2480  826 */
    height: 2800px; /* 19253 17页  */
    box-sizing: border-box;
    position: relative;
    overflow: hidden; /* 防止内容溢出 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 可选：页面阴影 */
    display: block;
    margin: 10px auto 0;
}

/* 确保每一页容器符合 A4 页面尺寸 */
.page-container {
    width: 100%; /* 使用父容器宽度 */
    overflow: hidden;
    position: relative; /* 确保页码可以相对于这个容器定位 */
    margin-bottom: 40px; /* 确保页码有足够的空间 */
    height: auto;
    height: 1123px; /* A4 高度（300 DPI）3508 1169 */
    background-color: #f1f2f4;
    background-color: white;
    page-break-before: always; /* 确保每一页从新的一页开始 */
    padding: 20px;
    box-sizing: border-box;
    display: block;
    margin-bottom: 10px;

    .table-title {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 20px;
    }
}

/* 响应式调整，适应不同分辨率 */
@media (max-width: 1200px) {
    .report-container {
        width: 70vw; /* 更小的屏幕时调整为 70% 宽度 */
    }
}

@media (max-width: 900px) {
    .report-container {
        width: 80vw; /* 进一步缩小 */
    }
}

header,
main,
footer {
    width: 100%;
}

header {
    text-align: center;
}

header img {
    max-width: 100%;
    height: auto;
}

h1,
h2,
p {
    margin: 10px 0;
}

footer {
    text-align: right;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border: 1px solid #d7d7d7;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 16px;
    text-align: center;
}

.data-table th {
    background-color: #fff;
}

.summary-section {
    margin-top: 20px;
}

.graph-container {
    position: relative;
    width: 100%;
    height: 240px;
    border: 1px solid #efe8e3;
    margin-top: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.graph {
    width: 100%;
    height: 80%;
}

.graph-item {
    display: flex;
    float: left;
    flex-direction: column;
    width: 50%;
    align-items: center; /* 水平居中 */
    margin-bottom: 20px; /* 可选：增加每个 graph 之间的间距 */
}

.graph-img {
    float: left;
    width: calc(50% - 40px);
    width: calc(100% - 50px); /* 图片宽度占满容器 */
    height: calc(50% - 2px);
    height: auto; /* 高度自动调整 */
    border: 1px solid #efe8e3;
    margin-left: 25px;
}

.graph-time {
    margin-top: 10px; /* 设置上边距 */
    text-align: center; /* 确保文本居中 */
}

.graph-text span {
    width: 160px;
    margin: 0 auto;
    display: block;
}

.graph-img img {
    width: calc(88% - 2px); /* 固定宽度 */
    width: 100%; /* 固定宽度 */
    height: auto; /* 高度自动调整 */
}

.bubble {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    color: white;
    font-weight: bold;
}

.knowledge-graph-section {
    margin-top: 20px;
}

.charts-section-four {
    width: 100%;
    height: 350px;
}

.charts-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    width: 100%;
}

.charts-section-one {
    width: 50%;
    float: left;
}

.charts-section-two {
    width: 50%;
    float: left;
}

.chart-item img {
    width: 48%;
    height: auto;
}

.interaction-section {
    margin-top: 40px;
}

.curve-description {
    margin-top: 20px;
    width: 100%;
    height: 300px;
}

.curve-description ul {
    list-style-type: disc;
    padding-left: 20px;
}

.curve-description li {
    margin-bottom: 5px;
}

.curve-description > div > ul {
    list-style-type: disc;
    padding-left: 20px;
}

.data-table,
.style-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.data-table th,
.data-table td,
.style-table th,
.style-table td {
    border: 1px solid #dfe2ed;
    padding: 8px;
    text-align: left;
}

.chart-section {
    width: 100%;
}

.chart-section img {
    max-width: 100%;
    height: auto;
}

.table-section {
    margin-top: 20px;
}

.font-size-17 {
    font-size: 17px;
}

.indented-text {
    text-indent: 2em;
    font-size: 17px;
    margin-left: 0; /* 确保没有额外的左边距 */
}

.summary-text {
    margin: 0; /* 清除外边距 */
    padding: 0; /* 清除内边距 */
    text-align: left; /* 设置左对齐 */
    line-height: 1.5; /* 设置行高 */
    font-size: 16px; /* 设置字体大小 */
}

.text-indent-2em {
    text-indent: 2em;
}

.highlight-g,
.highlight-b,
.highlight-a,
.highlight-c,
.highlight-d,
.highlight-e,
.highlight-f {
    color: #f99723;
}

.highlight-y {
    color: #8f99c8;
}

.green-text-color {
    color: #74d1a1;
}

.orange-text-color {
    color: #f39d3c;
}

.font-size-10 {
    font-size: 10px;
}

.font-size-12 {
    font-size: 12px;
}

.font-size-12 {
    font-size: 14px;
}
.font-size-15 {
    font-size: 15px;
}

.font-size-16 {
    font-size: 16px;
}

.font-size-17 {
    font-size: 17px;
}

.font-size-18 {
    font-size: 18px;
}

.red-text-color {
    color: #ff0000;
}

.font-color-c6c6c6 {
    color: #999999;
}

.td-text-center {
    text-align: center;
    vertical-align: middle;
}

.left-title {
    width: 20%;
    font-size: 11px;
    margin-bottom: 10px;
    text-align: right;
    float: left;
}

.left-title-p {
    height: 21px;
    margin-top: 0;
    margin-bottom: 4px;
    line-height: 20px;
    align-items: center;
}

.right-table {
    width: 100%;
    text-align: center;
    font-size: 11px;
    float: left;
    margin-bottom: 10px;
}

.right-table td,
th {
    vertical-align: middle;
}

.right-table-tr {
    height: 20px;
    border-right: 2px solid #ddd;
}

.right-table-tr-border-right {
    border-right: 2px solid #ddd;
}

.right-table-left-td {
    text-align: right;
    width: 335px;
    min-width: 152px;
    border: none;
    padding-right: 3px;
}
.sticky-column {
    position: sticky;
    left: 0;
}
.right-table-left-td1 {
    text-align: right;
    min-width: 118px;
    border: none;
    padding-right: 3px;
}

.right-table-td-green {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #e2fdf2;
    color: #00c064;
}

.right-table-td-orange {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #fff2de;
    color: #f38000;
}

.right-table-td-purple {
    text-align: center;
    line-height: 20px;
    border: 1px solid #fbfffc;
    width: 160px;
    background-color: #f1f1ff;
    color: #465abb;
}

.category-labels {
    float: left;
    width: 100%;
    height: 40px;
    margin-top: 20px;
}

.diamonds-green {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #41c887;
    margin-right: 5px;
    float: left;
}

.diamonds-green-text {
    color: #74d1a2;
    float: left;
}

.diamonds-orange {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #f99723;
    margin-right: 5px;
    float: left;
    margin-left: 30px;
}
.diamonds-orange-text {
    color: #f39d3d;
    float: left;
}

.diamonds-purple {
    display: block;
    width: 12px;
    height: 12px;
    background-color: #8f99c8;
    margin-right: 5px;
    float: left;
    margin-left: 30px;
}

.diamonds-purple-text {
    color: #a6add0;
    float: left;
}

.timeline {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
}

.timeline span {
    color: #7c7c7c;
}

.green {
    color: #5cb85c;
}

.orange {
    color: #f0ad4e;
}

.line-height {
    line-height: 1.5;
}

.font-weight {
    font-weight: bold;
}

.annotation-section p {
    font-size: 16px;
    line-height: 1.5;
}

.learning-style-section p {
    font-size: 18px;
    line-height: 1.5;
}

.margin-bottom-30 {
    margin-bottom: 30px;
}

.margin-top-30 {
    margin-top: 30px;
}

.margin-top-40 {
    margin-top: 30px;
}

.margin-top-60 {
    margin-top: 60px;
}

.margin-top-90 {
    margin-top: 90px;
}

.text-align {
    text-align: center;
}
/* 角标样式 */
.superscript {
    font-size: 10px; /* 设置比段落文字小的字体 */
    vertical-align: super; /* 文字上浮 */
    position: absolute; /* 绝对定位 */
    top: 0; /* 调整向上偏移量 */
    left: 0; /* 水平位置 */
    background-color: #fff; /* 可选：背景色 */
    padding: 2px; /* 可选：内边距 */
    border-radius: 3px; /* 可选：圆角 */
}
.interaction-data {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: flex-start; /* 垂直对齐方式，可以根据需要调整 */
    gap: 20px; /* 设置子元素之间的间距 */
    background-color: #fdf6ed;
    border-radius: 10px;
    font-size: 16px;
}

.left-section {
    margin-left: 80px;
    margin-top: 10px;
    float: left;
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.right-section {
    margin-left: 80px;
    margin-top: 10px;
    float: left;
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.chart-section-data {
    display: flex;
    justify-content: space-between; /* 左右两端对齐 */
    align-items: flex-start; /* 垂直对齐方式，可以根据需要调整 */
    gap: 20px; /* 设置子元素之间的间距 */
    width: 100%;
    margin-top: 20px;
}

.chart-section-right {
    float: left;
    flex: 1;
    box-sizing: border-box;
}

.chart-section-left {
    flex: 1; /* 每个部分占一半宽度 */
    box-sizing: border-box; /* 确保内边距和边框包含在宽度内 */
}

.text-align-left {
    text-align: left;
}

.text-align-center {
    text-align: center;
}

.info-item {
    margin: 15px 0;
    font-size: 18px;
}

.label {
}

.value {
    color: #f5aa56;
    font-weight: bold;
}

.scatter-plot-section {
}

.ire-analysis-section ul li {
    line-height: 1.5;
    font-size: 17px;
    margin-bottom: 5px;
}

.brain-stimulation-top {
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    height: 100px;
    background-color: #fdf6ed;
    display: flex;
    justify-content: center; /* 水平居中 */
    padding-top: 5px;
    border-radius: 10px;
}

.emotion-data {
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    height: 60px;
    background-color: #fdf6ed;
    border-radius: 10px;
    display: flex;
    justify-content: center; /* 水平居中 */
    padding-top: 20px;
}

.footer {
    position: absolute; /* 绝对定位 */
    bottom: 0; /* 底部对齐 */
    left: 0;
    right: 0;
    display: flex; /* 使用 Flexbox */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    height: 40px; /* 页码的高度 */
}

.page-number {
    font-size: 16px; /* 字体大小 */
    color: #333; /* 字体颜色 */
}

.footer-version {
    position: absolute; /* 绝对定位 */
    bottom: 10px; /* 距离底部的边距 */
    right: 10px; /* 距离右边的边距 */
    padding: 5px 10px; /* 内边距 */
    border-radius: 5px; /* 圆角 */
}

.footer-version p {
    margin: 0; /* 去除默认的段落间距 */
    font-size: 14px; /* 字体大小 */
    color: #b0b1c8; /* 字体颜色 */
}
</style>

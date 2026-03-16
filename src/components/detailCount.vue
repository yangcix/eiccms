<template>
    <div class="detail-count" :class="{'normal-detail-count': isScoreAnalysisType, 'only-count': isOnlyCount}">
        <div class="count">
            <div class="left-count">
                <div class="range">
                    <span class="sec-title">覆盖范围</span>
                    <div class="text-container">
                        <span class="truncated-text">{{ allRangeText }}</span>
                        <div class="tooltip">{{ allRangeText }}</div>
                    </div>
                </div>
                <div class="count-list">
                    <div class="count-item" v-show="showCountyCount">
                        <p>区/县级单位(个)</p>
                        <p>{{ countList.districtCount }}</p>
                    </div>
                    <div class="count-item" v-show="showSchoolCount">
                        <p>学校数量(所)</p>
                        <p>{{ countList.schoolCount }}</p>
                    </div>
                    <div class="count-item" v-show="showSubjectCount">
                        <p>学科数量(个)</p>
                        <p>{{ countList.subjectCount }}</p>
                    </div>
                    <div class="count-item" v-show="showTeacherInvolvedCount">
                        <p>参与教师数量(人)</p>
                        <p>{{ countList.teacherCount }}</p>
                    </div>
                    <div class="count-item" v-show="showTeachScoreCount">
                        <p>课堂教学综合评分</p>
                        <p>{{ countList.teachingScore }}</p>
                    </div>
                    <div class="count-item" v-show="showAiClassCount">
                        <p>AI课堂数量(节)</p>
                        <p>{{ countList.aiCount }}</p>
                    </div>
                    <div class="count-item" v-show="showRankCount">
                        <p>
                            区/县排名
                            <el-tooltip
                                content="教师在区/县范围内的排名"
                                placement="top"
                                popper-class="tooltip-content"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </p>
                        <p>{{ countList.districtRank }}</p>
                    </div>
                    <div class="count-item" v-show="showGradeCount">
                        <p>年级数量(个)</p>
                        <p>{{ countList.gradeCount }}</p>
                    </div>
                </div>
            </div>
            <div class="chart" v-if="!isOnlyCount">
                <div id="myChart" :class="{'bg-image': isSinglePie}" v-if="!isDbPie"></div>
                <div class="pieChart" v-if="isDbPie">
                    <div id="myPie1Chart" @click="clickPieChart('left')"></div>
                    <div id="myPie2Chart" @click="clickPieChart('right')"></div>
                </div>
                <div id="myChart2" v-if="isScoreAnalysisType"></div>
                <!-- 四何分析和学习风格共用这套饼图，用左侧右侧参数区分，到特定的组件再自行转换成图表名 -->
                <div class="bg-content-left" v-if="isDbPie"></div>
                <div class="bg-content-right" v-if="isDbPie"></div>
                <div class="select-group" v-if="isScoreAnalysisType">
                    <div class="rect-left">
                        <div class="white-rect"></div>
                        <div class="blue-rect"></div>
                    </div>
                    <el-select v-model="selectValue" @change="statisticSelectChange" popper-class="statistics_select">
                        <el-option
                            v-for="item in optionArray"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <div class="rect-right">
                        <div class="blue-rect"></div>
                        <div class="white-rect"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    props: {
        countList: {
            type: Object,
            default: () => {
                return {
                    districtCount: 0,
                    schoolCount: 0,
                    subjectCount: 0,
                    gradeCount: 0,
                    aiCount: 0,
                    teacherCount: 0,
                    teachingScore: 0,
                    districtRank: 0,
                };
            },
        },
        allRangeText: {
            type: String,
            default: '',
        },
        options: {
            type: Object,
            default: () => {},
        },
        pie1Options: {
            type: Object,
            default: () => {},
        },
        pie2Options: {
            type: Object,
            default: () => {},
        },
        // 是否是课堂教学综合评分分析
        isScoreAnalysisType: {
            type: Boolean,
            default: false,
        },
        isSinglePie: {
            type: Boolean,
            default: false,
        },
        isOnlyCount: {
            type: Boolean,
            default: false,
        },
        // 是否是双饼图
        isDbPie: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            myChart: '',
            myPie1Chart: '',
            myPie2Chart: '',
            showCountyCount: true,
            showSchoolCount: true,
            showSubjectCount: true,
            showGradeCount: true,
            showAiClassCount: true,
            showTeacherInvolvedCount: true,
            showRankCount: false,
            showTeachScoreCount: false,
            optionArray: [
                {
                    value: 1,
                    label: '按月统计',
                },
                {
                    value: 2,
                    label: '按周统计',
                },
            ],
            selectValue: 1,
            chart1DateList: [],
            chart2DateList: [],
            scoreDataList: [],
            rankDataList: [],
            classScoreList: [],
            courseList: [],
        };
    },
    mounted() {
        if (!this.isScoreAnalysisType && !this.isOnlyCount) {
            if (this.isDbPie) {
                this.drawDbChart();
            } else {
                this.drawChart();
            }
        }
    },
    methods: {
        drawChart() {
            if (this.options == {}) false;
            let chartDom = document.getElementById('myChart');
            this.myChart = echarts.init(chartDom);
            this.myChart.setOption(this.options, true);
            window.addEventListener('resize', () => {
                this.myChart.resize();
            });
        },
        // 双饼图
        drawDbChart() {
            if (this.pie1Options == {} || this.pie2Options == {}) false;
            let chartDom1 = document.getElementById('myPie1Chart');
            this.myPie1Chart = echarts.init(chartDom1);
            this.myPie1Chart.setOption(this.pie1Options, true);
            let chartDom2 = document.getElementById('myPie2Chart');
            this.myPie2Chart = echarts.init(chartDom2);
            this.myPie2Chart.setOption(this.pie2Options, true);
            window.addEventListener('resize', () => {
                this.myPie1Chart.resize();
                this.myPie2Chart.resize();
            });
        },
        clickPieChart(name) {
            this.$emit('changeChart', name);
        },
        updateView(options1, options2) {
            this.myPie1Chart.setOption(options1, true);
            this.myPie2Chart.setOption(options2, true);
        },
        // 市级
        setCityType() {
            this.showCountyCount = true;
            this.showSchoolCount = true;
            this.showSubjectCount = true;
            this.showGradeCount = true;
            this.showAiClassCount = true;
            this.showTeacherInvolvedCount = true;
        },
        // 区县
        setCountyType() {
            this.showCountyCount = false;
            this.showSchoolCount = true;
            this.showSubjectCount = true;
            this.showGradeCount = true;
            this.showAiClassCount = true;
            this.showTeacherInvolvedCount = true;
        },
        // 学校
        setSchoolType() {
            this.showCountyCount = false;
            this.showSchoolCount = false;
            this.showSubjectCount = true;
            this.showGradeCount = true;
            this.showAiClassCount = true;
            this.showTeacherInvolvedCount = true;
        },
        // 教师
        setTeacherType() {
            this.showCountyCount = false;
            this.showSchoolCount = false;
            this.showSubjectCount = true;
            this.showGradeCount = true;
            this.showAiClassCount = true;
            this.showTeacherInvolvedCount = false;
        },
        // 课堂教学综合评分分析
        setScoreAnalysisType() {
            this.showCountyCount = false;
            this.showSchoolCount = false;
            this.showSubjectCount = false;
            this.showGradeCount = false;
            this.showAiClassCount = true;
            this.showTeacherInvolvedCount = false;
            this.showTeachScoreCount = true;
            this.showRankCount = true;
        },
        getTeacherDistrictRankingList(params) {
            if (params) {
                this.defaultParams = params;
            }
            this.defaultParams['countDate'] = this.selectValue;
            this.$axios.get('/ai/bigdata/getTeacherDistrictRankingList', this.defaultParams).then((res) => {
                if (res.data) {
                    this.chart2DateList = res.data.courseScoreTrend.chartDataList;
                    this.chart1DateList = res.data.districtRankingTrend.chartDataList;
                    this.scoreDataList = res.data.courseScoreTrend.scoreDataList;
                    this.rankDataList = res.data.districtRankingTrend.scoreDataList;
                    this.classScoreList = res.data.districtRankingTrend.classScoreList;
                    this.courseList = res.data.courseScoreTrend.detailList;
                    this.drawLineChart();
                    this.drawLineStackChart();
                }
            });
        },
        drawLineChart() {
            let chartDom = document.getElementById('myChart');
            let myChart = echarts.init(chartDom);
            let symbolImg = 'image://' + require('@/assets/imgs/green.png');
            let option = {
                grid: {
                    top: 70,
                    bottom: 30,
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                    formatter: (params) => {
                        let html = '';
                        html += '<div>';
                        html += '<p>时间：' + params[0].name + '</p>';
                        html += '<p>区县排名：' + params[0].value + '</p>';
                        html += '<p>综合得分：' + this.classScoreList[params[0].dataIndex] + '</p>';
                        html += '</div>';
                        return html;
                    },
                },
                title: {
                    text: '教师-课堂教学综合评分-区/县排名',
                    top: 5,
                    itemGap: 15,
                    textStyle: {
                        fontSize: 16,
                        fontFamily: 'SourceHanSansCN-Regular',
                        color: '#fff',
                    },
                    subtext: '排名',
                    subtextStyle: {
                        fontSize: 14,
                        fontFamily: 'SourceHanSansCN-Regular',
                        color: '#91CEFF',
                    },
                    left: 20,
                },
                xAxis: {
                    type: 'category',
                    data: this.chart1DateList,
                    axisTick: {
                        // 轴刻度
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#084d7b',
                            type: 'solid',
                            width: 1,
                        },
                    },
                    axisLabel: {
                        // 轴文字
                        color: '#91CEFF',
                        fontSize: 14,
                        fontFamily: 'SourceHanSansCN-Regular',
                    },
                },
                yAxis: {
                    type: 'value',
                    // 排名需要反着显示
                    inverse: true,
                    min: function (value) {
                        if (value.min < 5) return 1;
                        return value.min;
                    },
                    minInterval: 1,
                    splitLine: {
                        // 网格线
                        show: true,
                        lineStyle: {
                            //分割线
                            color: '#91CEFF80',
                            width: 1,
                            type: 'dashed',
                        },
                    },
                    max: function (value) {
                        if (value.max < 5) return 5;
                        return value.max;
                    },
                    axisLabel: {
                        // 轴文字
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'ArialMT',
                    },
                },
                series: [
                    {
                        data: this.rankDataList,
                        type: 'line',
                        symbol: symbolImg,
                        symbolSize: 25,
                        itemStyle: {
                            color: '#36c17b', //改变折线颜色
                        },
                    },
                ],
            };
            myChart.setOption(option, true);
            window.addEventListener('resize', () => {
                myChart.resize();
            });
        },
        drawLineStackChart() {
            let chartDom = document.getElementById('myChart2');
            let myChart = echarts.init(chartDom);
            let symbolImg = 'image://' + require('@/assets/imgs/highlight-circle.png');
            let option = {
                grid: {
                    top: 70,
                    bottom: 30,
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                    formatter: (params) => {
                        let html = '';
                        html += '<div>';
                            html += '<p>综合评分：' + params[0].value + '</p>';
                            html += '<p>课程名称：《' + this.courseList[params[0].dataIndex] + '》</p>';
                            html += '<p>时间：' + params[0].name + '</p>';
                        html += '</div>';
                        return html;
                    },
                },
                title: {
                    text: '课堂教学综合评分',
                    top: 5,
                    itemGap: 15,
                    textStyle: {
                        fontSize: 16,
                        fontFamily: 'SourceHanSansCN-Regular',
                        color: '#fff',
                    },
                    subtext: '评分',
                    subtextStyle: {
                        fontSize: 14,
                        fontFamily: 'SourceHanSansCN-Regular',
                        color: '#91CEFF',
                    },
                    left: 20,
                },
                xAxis: {
                    type: 'category',
                    data: this.chart2DateList,
                    axisTick: {
                        // 轴刻度
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#084d7b',
                            type: 'solid',
                            width: 1,
                        },
                    },
                    axisLabel: {
                        // 轴文字
                        color: '#91CEFF',
                        fontSize: 14,
                        fontFamily: 'SourceHanSansCN-Regular',
                        formatter: (timeValue) => {
                            return timeValue.split(' ')[0];
                        },
                    },
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        // 网格线
                        show: true,
                        lineStyle: {
                            //分割线
                            color: '#91CEFF80',
                            width: 1,
                            type: 'dashed',
                        },
                    },
                    axisLabel: {
                        // 轴文字
                        color: '#fff',
                        fontSize: 14,
                        fontFamily: 'ArialMT',
                    },
                },
                series: [
                    {
                        data: this.scoreDataList,
                        type: 'line',
                        symbol: symbolImg,
                        symbolSize: 25,
                        itemStyle: {
                            color: '#FFD12B', //改变折线颜色
                        },
                    },
                ],
            };
            myChart.setOption(option, true);
            window.addEventListener('resize', () => {
                myChart.resize();
            });
        },
        statisticSelectChange() {
            this.getTeacherDistrictRankingList();
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-count {
    width: 95%;
    margin: 0 auto;
    height: 36%;
    box-sizing: border-box;

    .count {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        background: url(../assets/imgs/k-x.png) no-repeat;
        background-size: 100% 100%;

        .left-count {
            height: 100%;
            width: calc(100% - 680px);

            .range {
                margin-top: 20px;
                margin-left: 30px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                font-size: 16px;
                color: #ffffff;
                display: flex;
                align-items: baseline;

                .sec-title {
                    flex: 0 0 auto;
                }
                .text-container {
                    position: relative;
                    display: inline-block;
                    flex: 1;
                    min-width: 0;

                    .truncated-text {
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        font-size: 14px;
                        color: #b9e0ff;
                        width: max-content;
                        max-width: 100%;
                        display: inline-block;
                        display: block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .tooltip {
                        display: none;
                        position: absolute;
                        left: 5%;
                        top: 140%;
                        width: max-content;
                        max-width: 100%;
                        background-color: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 8px 12px;
                        font-size: 14px;
                        z-index: 100;
                        word-break: break-word;
                        border: 1px solid #02afff;
                        border-radius: 4px;
                        line-height: 140%;
                        white-space: pre-line;
                        font-weight: 400;
                    }
                }
                .truncated-text:hover + .tooltip {
                    display: block;
                }
            }
            .count-list {
                display: flex;
                box-sizing: border-box;
                padding-left: 0.5%;
                flex-wrap: wrap;
                height: 75%;

                .count-item {
                    width: 30%;
                    height: 43%;
                    box-sizing: border-box;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    font-size: 16px;
                    color: #b9e0ff;

                    &:last-child {
                        margin-right: 0;
                    }

                    p {
                        padding-left: 17%;
                    }
                    & p:nth-child(1) {
                        padding-top: 4.6%;
                    }

                    & p:nth-child(2) {
                        font-family: DINCond-Bold;
                        font-size: 28px;
                        color: #ffffff;
                        padding-top: 3%;
                        text-shadow: 0 0 4px #017feb, 0 0 4px #017feb, 0 0 4px #017feb, 0 0 4px #017feb;
                    }
                    &:nth-child(1) {
                        background: url('../assets/imgs/a0.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                    }
                    &:nth-child(2) {
                        background: url('../assets/imgs/a2.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                    }
                    &:nth-child(3) {
                        background: url('../assets/imgs/a3.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                    &:nth-child(4) {
                        background: url('../assets/imgs/a6.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                    &:nth-child(5) {
                        background: url('../assets/imgs/a5.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                    &:nth-child(6) {
                        background: url('../assets/imgs/a4.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                    &:nth-child(7) {
                        background: url('../assets/imgs/a6.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                    &:nth-child(8) {
                        background: url('../assets/imgs/a5.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 2%;
                        margin-top: 2%;
                        p {
                            padding-left: 14%;
                        }
                    }
                }
            }
        }
        .chart {
            width: 680px;
            height: 75%;
            position: relative;
            top: 20%;

            #myChart,
            .pieChart {
                width: 100%;
                height: 100%;
                z-index: 99;
            }
            .pieChart {
                display: flex;
                position: relative;
                z-index: 999;

                #myPie1Chart,
                #myPie2Chart {
                    width: 50%;
                    height: 100%;
                }
            }
            .bg-image {
                background: url(../assets/imgs/circle.png) no-repeat;
                background-position: 49.5% 47%;
                background-size: 33%;
            }
            .bg-content-left,
            .bg-content-right {
                width: 42%;
                height: 88%;
                position: absolute;
                top: 4%;
                cursor: pointer;
            }
            .bg-content-left {
                left: 4%;
                background: url(../assets/imgs/xxk.png) no-repeat;
                background-size: 100% 100%;
            }
            .bg-content-right {
                right: 5%;
                background: url(../assets/imgs/xxk.png) no-repeat;
                background-size: 100% 100%;
            }
            .select-group {
                position: absolute;
                top: 3%;
                left: 33%;
                z-index: 99;
            }
        }
    }
}
.normal-detail-count {
    height: 43%;

    .count {
        justify-content: left;

        .left-count {
            width: 23%;

            .range {
                margin-top: 26px;
                width: 400%;

                .sec-title {
                    width: 6%;
                }
            }
            .count-list {
                display: block;
                width: 80%;
                padding-left: 10%;
                padding-top: 3%;

                .count-item {
                    width: 90%;
                    height: 30%;
                    margin-top: 5% !important;
                }
            }
        }
        .chart {
            width: 70%;
            display: flex;

            #myChart,
            #myChart2 {
                width: 50%;
                height: 100%;
                z-index: 99;
            }
        }
    }
}
.only-count {
    .count {
        .left-count {
            width: 95%;
            .count-list {
                margin-top: -1%;
                .count-item {
                    width: 23%;
                }
            }
            .range {
                .sec-title {
                    width: 5%;
                }
            }
        }
    }
}
</style>

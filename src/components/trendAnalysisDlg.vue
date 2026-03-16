<template>
    <el-dialog :visible.sync="detailDlg.visible" width="100%" v-if="detailDlg.visible" :show-close="false">
        <div slot="title" class="dialog-title">
            <div>
                <span>{{ detailDlg.title }}</span>
                <el-tooltip :content="detailDlg.text" placement="bottom-start" popper-class="tooltip-content" class="tooltip-icon">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </div>
            <img src="../assets/imgs/x.png" alt="" @click.prevent="closeDlg" />
        </div>
        <detailCount
            ref="detailCount"
            :countList="countList"
            :allRangeText="allRangeText"
            :options="options"
        ></detailCount>
        <div class="bottom-content">
            <div class="statistics">
                <p class="sec-title">趋势分析</p>
                <div class="select-group">
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
            <div class="chart-content">
                <div id="comprehensiveChart"></div>
                <div id="metricChart"></div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import detailCount from '@/components/detailCount';
import * as echarts from 'echarts';
export default {
    components: {
        detailCount,
    },
    props: {
        countList: {
            type: Object,
            default: () => {
                return {};
            },
        },
        allRangeText: {
            type: String,
            default: '',
            text: '',
        },
        detailDlg: {
            type: Object,
            default: () => {
                return {
                    visible: false,
                    title: '',
                };
            },
        },
        options: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
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
            defaultParams: {},
            stackDimensionName: [],
            stackCountDate: [],
            stackData: [],
            lineData: [],
        };
    },
    methods: {
        statisticSelectChange() {
            this.getChartData();
        },
        getChartData(params) {
            if (params) {
                this.defaultParams = params;
            }
            this.defaultParams['countDate'] = this.selectValue;
            this.$axios
                .get('/ai/bigdata/getClassroomTeachingSituationTrendAnalysis', this.defaultParams)
                .then((res) => {
                    this.stackDimensionName = [];
                    this.stackCountDate = [];
                    this.lineData = [];
                    this.stackData = [];
                    if (res.data.list.length != 0) {
                        res.data.list.forEach((item) => {
                            this.stackDimensionName.push(item.dimensionName);
                            this.stackCountDate.push(item.countDate);
                        });
                        // 去重
                        this.stackDimensionName = Array.from(new Set(this.stackDimensionName));
                        this.stackCountDate = Array.from(new Set(this.stackCountDate));
                        let sumArray = [];
                        let predictSum = 0;
                        for (let i = 0; i < this.stackDimensionName.length; i++) {
                            let dataArray = [];
                            let predictArray = [];
                            let obj1 = {};
                            let obj2 = {};
                            // predict为1，是预测数据
                            dataArray = res.data.list.filter((item) => {
                                return item.dimensionName == this.stackDimensionName[i] && item.predict != 1;
                            });
                            predictArray = res.data.list.filter((item) => {
                                return item.dimensionName == this.stackDimensionName[i] && item.predict == 1;
                            });
                            dataArray = dataArray.map((item) => item.averageScore);
                            predictArray = predictArray.map((item) => item.averageScore);
                            obj1['name'] = this.stackDimensionName[i];
                            obj1['type'] = 'line';
                            obj1['data'] = dataArray;
                            this.stackData.push(obj1);
                            if (predictArray.length != 0) {
                                obj2['name'] = this.stackDimensionName[i];
                                obj2['type'] = 'line';
                                obj2['itemStyle'] = {
                                    normal: {
                                        lineStyle: {
                                            type: 'dashed',
                                        },
                                    },
                                };
                                obj2['data'] = [
                                    ...Array(dataArray.length - 1),
                                    dataArray[dataArray.length - 1],
                                    predictArray[0],
                                ];
                                this.stackData.push(obj2);
                            }
                        }
                        for (let i = 0; i < this.stackCountDate.length; i++) {
                            let dataArray = [];
                            let predictArray = [];
                            dataArray = res.data.list.filter((item) => {
                                return item.countDate == this.stackCountDate[i] && item.predict != 1;
                            });
                            predictArray = res.data.list.filter((item) => {
                                return item.predict == 1;
                            });
                            dataArray = dataArray.map((item) => item.averageScore);
                            predictArray = predictArray.map((item) => item.averageScore);
                            let sum = 0;
                            if (dataArray.length != 0) {
                                dataArray.forEach((item) => {
                                    sum += item;
                                });
                                sumArray.push(sum.toFixed(1));
                            }
                            if (i == this.stackCountDate.length - 1 && predictArray.length != 0) {
                                predictArray.forEach((item) => {
                                    predictSum += item;
                                });
                            }
                        }
                        let obj3 = {};
                        let obj4 = {};
                        obj3['name'] = '综合得分';
                        obj3['type'] = 'line';
                        obj3['data'] = sumArray;
                        this.lineData.push(obj3);
                        if (predictSum) {
                            obj4['name'] = '综合得分';
                            obj4['type'] = 'line';
                            obj4['itemStyle'] = {
                                normal: {
                                    lineStyle: {
                                        type: 'dashed',
                                    },
                                },
                            };
                            obj4['data'] = [
                                ...Array(sumArray.length - 1),
                                sumArray[sumArray.length - 1],
                                predictSum.toFixed(2),
                            ];
                            this.lineData.push(obj4);
                        }
                        this.drawLineChart();
                        this.drawLineStackChart();
                    }
                });
        },
        drawLineChart() {
            let chartDom = document.getElementById('comprehensiveChart');
            let myChart = echarts.init(chartDom);
            let option = {
                grid: {
                    top: 100,
                    bottom: 130,
                },
                title: {
                    text: '综合得分',
                    top: 20,
                    itemGap: 25,
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
                    left: 45,
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
                        html +=
                            '<div class="showBox"><span>' +
                            params[0].seriesName +
                            '</span><br>' +
                            params[0].marker +
                            '<span>' +
                            params[0].name +
                            ':     ' +
                            params[0].data +
                            '</span></div>';
                        return html;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: this.stackCountDate,
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
                series: this.lineData,
            };

            myChart.setOption(option, true);
        },
        drawLineStackChart() {
            let chartDom = document.getElementById('metricChart');
            let myChart = echarts.init(chartDom);
            let option = {
                grid: {
                    top: 100,
                    bottom: 130,
                },
                title: {
                    text: '9大指标得分',
                    top: 20,
                    itemGap: 25,
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
                    left: 30,
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
                        let html = '<div class="showBox"><span>' + params[0].name + '</span><br>';

                        let dataArray = params.filter((item) => {
                            return item.data != undefined;
                        });
                        // 数组去重 同一个指标下包含实际和预测，不去重会显示两次
                        const a = dataArray.map((item) => {
                            return item.seriesName;
                        });
                        const newDataArray = dataArray.filter((item, index) => {
                            return a.indexOf(item.seriesName) === index;
                        });
                        html += '';
                        for (let index = 0; index < newDataArray.length; index++) {
                            html +=
                                newDataArray[index].marker +
                                '<span>' +
                                newDataArray[index].seriesName +
                                ':     ' +
                                newDataArray[index].data +
                                '</span><br>';
                        }
                        html += '</div>';

                        return html;
                    },
                },
                legend: {
                    data: this.stackDimensionName,
                    bottom: 50,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14,
                        fontFamily: 'SourceHanSansCN-Regular',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: this.stackCountDate,
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
                series: this.stackData,
            };
            myChart.setOption(option, true);
        },
        closeDlg() {
            this.detailDlg.visible = false;
            this.selectValue = 1;
        },
    },
};
</script>

<style lang="scss">
.chart-content {
    width: 100%;
    height: 100%;
    display: flex;

    #comprehensiveChart,
    #metricChart {
        width: 50%;
        height: 100%;
    }
}
</style>

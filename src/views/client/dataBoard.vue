<template>
    <div
        class="data-board"
        :style="{
            background: isSchool || isTeacher ? 'url(../../assets/imgs/dbbg.png) no-repeat' : '',
            backgroundColor: isSchool ? '#03294e' : '',
        }"
    >
        <div class="data-board-title">
            <div class="text">AI课堂分析数据平台</div>
            <div class="select-group">
                <div class="rect-left">
                    <div class="white-rect"></div>
                    <div class="blue-rect"></div>
                </div>
                <el-select
                    v-model="statisticValue"
                    @change="statisticsSelectChange"
                    popper-class="statistics_select"
                    class="statistics_select_min"
                >
                    <el-option v-for="item in dateStatistics" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-cascader
                    v-model="termValue"
                    :options="termOptions"
                    :props="{expandTrigger: 'hover', multiple: true, value: 'analysisYear', label: 'analysisYearName'}"
                    placeholder="全部学期"
                    clearable
                    @change="termSelectChange"
                    v-show="isShowTermSelect"
                    popper-class="statistics_select"
                ></el-cascader>
                <el-date-picker
                    v-model="dateValueArray"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    :picker-options="pickerOptions"
                    v-show="!isShowTermSelect"
                    class="statistics_date"
                    popper-class="statistics_date"
                    @change="changeDatePicker"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
                <div class="rect-right">
                    <div class="blue-rect"></div>
                    <div class="white-rect"></div>
                </div>
                <el-select
                    v-model="courseValue"
                    placeholder="全部学科"
                    multiple
                    clearable
                    @change="courseSelectChange"
                    popper-class="statistics_select"
                >
                    <el-option
                        v-for="item in courseOptions"
                        :key="item.analysisSubject"
                        :label="item.analysisSubjectName"
                        :value="item.analysisSubject"
                    >
                    </el-option>
                </el-select>
                <div class="rect-right">
                    <div class="blue-rect"></div>
                    <div class="white-rect"></div>
                </div>
                <el-cascader
                    v-model="gradeValue"
                    :options="gradeOptions"
                    :props="{expandTrigger: 'hover', multiple: true, value: 'analysisCode', label: 'analysisGradeName'}"
                    placeholder="全部年级"
                    clearable
                    @change="gradeSelectChange"
                    popper-class="statistics_select"
                ></el-cascader>
                <div class="rect-right">
                    <div class="blue-rect"></div>
                    <div class="white-rect"></div>
                </div>
            </div>
            <div class="time">
                <div class="time-text">{{ curDay }}</div>
                <div class="time-text">{{ curTime }}</div>
            </div>
        </div>
        <div class="board">
            <div class="left-board">
                <div class="board-item1 board-item">
                    <div class="title">
                        <div class="title-name">教学模式分布</div>
                        <div class="view-detail btn" @click="viewTypeDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="pieChart1" class="my-char"></div>
                </div>
                <div class="board-item2 board-item">
                    <div class="title">
                        <div class="title-name">课堂教学情况</div>
                        <div class="right-btn">
                            <div plain class="view-trend btn" @click="viewTrendDetail()">查看趋势分析</div>
                            <div class="view-detail btn" @click="viewTeachDetail()">
                                <p>详情</p>
                                <img src="../../assets/imgs/3j.png" />
                            </div>
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="radarChart1" class="my-char"></div>
                </div>
                <div class="board-item3 board-item">
                    <div class="title">
                        <div class="title-name">弗兰德斯互动分析</div>
                        <div class="view-detail btn" @click="viewFlandersDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="radarChart2" class="my-char"></div>
                </div>
            </div>
            <div class="center-board">
                <div class="current-position">
                    当前位置 <img src="../../assets/imgs/3j.png" />
                    <span
                        @click="goBackCity()"
                        :class="[
                            !isCityMap ? 'white-text' : 'highlight-text',
                            !isCityMap && isBackCityMap ? 'underline-text' : '',
                        ]"
                        v-if="curCityName"
                        >{{ curCityName }}</span
                    >
                    <span v-show="!isCityMap && curCityName">&nbsp;\&nbsp;</span>
                    <span
                        @click="intoCountyMap(curMapTitle, curDistrictOrgMap[curMapTitle])"
                        :class="[
                            isSchool || isTeacher ? 'white-text' : 'highlight-text',
                            (isSchool || isTeacher) && isBackCountyMap ? 'underline-text' : '',
                        ]"
                        v-show="isSchool || isTeacher"
                        >{{ curMapTitle }}</span
                    >
                    <span v-show="isSchool || isTeacher">&nbsp;\&nbsp;</span>
                    <span
                        v-show="isTeacher"
                        :class="[
                            isTeacher ? 'white-text' : 'highlight-text',
                            isTeacher && isBackSchool ? 'underline-text' : '',
                        ]"
                        @click="intoSchoolPage(curSchoolTitle, curSchoolOrgMap[curSchoolTitle])"
                        >{{ curSchoolTitle }}</span
                    >
                    <span v-show="isTeacher">&nbsp;\&nbsp;</span>
                    <div v-show="!(isCityMap && !isMunicipalSchool)">
                        <el-dropdown @command="changeCurMsg" trigger="click">
                            <span class="el-dropdown-link">
                                <span class="highlight-text" v-show="!isSchool && !isTeacher">{{ curMapTitle }}</span>
                                <span v-show="isSchool" class="highlight-text">{{ curSchoolTitle }}</span>
                                <span v-show="isTeacher" class="highlight-text">{{ curTeacherTitle }}</span>
                                <img src="../../assets/imgs/down.png" v-show="positionOptions.length > 1" />
                            </span>
                            <el-dropdown-menu slot="dropdown" class="option_dropdown" v-if="positionOptions.length > 1">
                                <el-dropdown-item v-for="(item, index) in positionOptions" :key="index" :command="item">
                                    {{ item.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="count" v-if="!isSchool && !isTeacher">
                    <div class="ai-count count-item">
                        <div class="text">
                            <p>AI课堂数量(节)</p>
                            <p>{{ countList.aiCount }}</p>
                        </div>
                        <img src="../../assets/imgs/icon-l.png" class="icon" />
                        <img src="../../assets/imgs/dizuo-l.png" class="dizuo" />
                        <img src="../../assets/imgs/box-l.png" class="box" />
                    </div>
                    <div class="count-item" v-if="!isTeacher">
                        <div class="text">
                            <p>教师人数(人)</p>
                            <p>{{ countList.teacherCount }}</p>
                        </div>
                        <img src="../../assets/imgs/icon-q.png" class="icon" />
                        <img src="../../assets/imgs/dizuo-q.png" class="dizuo" />
                        <img src="../../assets/imgs/box-q.png" class="box" />
                    </div>
                    <div class="area-count count-item" v-if="showAreaCount">
                        <div class="text">
                            <p>覆盖区域(个)</p>
                            <p>{{ countList.districtCount }}</p>
                        </div>
                        <img src="../../assets/imgs/icon-g.png" class="icon" />
                        <img src="../../assets/imgs/dizuo-g.png" class="dizuo" />
                        <img src="../../assets/imgs/box-g.png" class="box" />
                    </div>
                    <div class="count-item" v-if="!isTeacher">
                        <div class="text">
                            <p>覆盖学校(所)</p>
                            <p>{{ countList.schoolCount }}</p>
                        </div>
                        <img src="../../assets/imgs/icon-z.png" class="icon" />
                        <img src="../../assets/imgs/dizuo-z.png" class="dizuo" />
                        <img src="../../assets/imgs/box-z.png" class="box" />
                    </div>
                </div>
                <div class="school-count" v-if="isSchool">
                    <div class="img-box">
                        <img src="../../assets/imgs/schoolimg.png" alt="" class="school-img" />
                        <div class="light"></div>
                    </div>
                    <div class="count-content">
                        <div class="ai-count count-item">
                            <div class="text">
                                <p>AI课堂数量(节)</p>
                                <p>{{ countList.aiCount }}</p>
                            </div>
                            <img src="../../assets/imgs/icon-l.png" class="icon" />
                            <img src="../../assets/imgs/dizuo-l.png" class="dizuo" />
                            <img src="../../assets/imgs/box-l.png" class="box" />
                        </div>
                        <div class="count-item" v-if="!isTeacher">
                            <div class="text">
                                <p>教师人数(人)</p>
                                <p>{{ countList.teacherCount }}</p>
                            </div>
                            <img src="../../assets/imgs/icon-q.png" class="icon" />
                            <img src="../../assets/imgs/dizuo-q.png" class="dizuo" />
                            <img src="../../assets/imgs/box-q.png" class="box" />
                        </div>
                    </div>
                </div>
                <div class="teacher-count" v-if="isTeacher">
                    <div class="top-box">
                        <div class="teacher-img">
                            <img src="../../assets/imgs/pic.png" alt="" />
                            <div class="light"></div>
                        </div>
                        <div class="count-content">
                            <div class="ai-count count-item">
                                <div class="text">
                                    <p>AI课堂数量(节)</p>
                                    <p>{{ countList.aiCount }}</p>
                                </div>
                                <img src="../../assets/imgs/icon-l.png" class="icon" />
                                <img src="../../assets/imgs/dizuo-l.png" class="dizuo" />
                                <img src="../../assets/imgs/box-l.png" class="box" />
                            </div>
                            <div class="count-item">
                                <div class="text">
                                    <p>讲授字数/节课(字)</p>
                                    <p>
                                        {{ countList.totalSpeechWords }}
                                    </p>
                                </div>
                                <img src="../../assets/imgs/icon-t.png" class="icon" />
                                <img src="../../assets/imgs/dizuo-g.png" class="dizuo" />
                                <img src="../../assets/imgs/box-g.png" class="box" />
                            </div>
                            <div class="ai-count count-item">
                                <div class="text">
                                    <p>授课语速(字/分)</p>
                                    <p>{{ countList.averageSpeechSpeed }}</p>
                                </div>
                                <img src="../../assets/imgs/icon-s.png" class="icon" />
                                <img src="../../assets/imgs/dizuo-q.png" class="dizuo" />
                                <img src="../../assets/imgs/box-q.png" class="box" />
                            </div>
                            <div class="count-item">
                                <div class="text">
                                    <p>语言凝练度(比特/分)</p>
                                    <p>{{ countList.concisenessMean }}</p>
                                </div>
                                <img src="../../assets/imgs/icon-a.png" class="icon" />
                                <img src="../../assets/imgs/dizuo-z.png" class="dizuo" />
                                <img src="../../assets/imgs/box-z.png" class="box" />
                            </div>
                        </div>
                    </div>
                    <div class="catchphrase-content" ref="catchphraseContent" v-if="isTeacher">
                        <div
                            v-for="(item, index) in 12"
                            :style="{
                                background: 'url(' + imgArray[index] + ') no-repeat',
                                backgroundSize: '100% 100%',
                            }"
                            :key="index"
                            class="catchphrase-item"
                        >
                            <p>{{ catchphraseArray[index] ? catchphraseArray[index]['name'] : '' }}</p>
                            <span>{{
                                catchphraseArray[index] ? '(' + catchphraseArray[index]['value'] + '次)' : ''
                            }}</span>
                        </div>
                    </div>
                </div>
                <div class="analysis-trend" v-if="isTeacher">
                    <div class="title">
                        <div class="title-name">课堂教学综合评分分析</div>
                        <div class="view-detail btn" @click="viewClassAnalysisDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="analysisChart" v-if="isTeacher"></div>
                </div>
                <div class="map-chart" v-if="!isSchool && !isTeacher">
                    <div id="cityMap" v-if="isCityMap || isMunicipalSchool"></div>
                    <div id="countyMap" v-if="!isCityMap && !isSchool && !isTeacher && !isMunicipalSchool"></div>
                    <div class="bg-img"></div>
                </div>
                <div
                    class="table"
                    :style="{
                        height: isSchool ? '66%' : '32%',
                        marginTop: isSchool ? '13.5%' : 0,
                        background: isSchool ? 'url(' + tableImgBig + ') no-repeat' : 'url(' + tableImg + ') no-repeat',
                        backgroundSize: '100% 100%',
                    }"
                    v-if="!isTeacher"
                >
                    <div
                        class="title"
                        :style="{
                            height: isSchool ? '6.5%' : '13%',
                        }"
                    >
                        <div class="title-name">课堂教学综合评分排行</div>
                        <div class="view-detail btn" @click="viewScoreDetail" v-if="isSchool">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <commonTable
                        :tableData="tableData"
                        :columns="columns"
                        :showIndex="false"
                        :stripe="true"
                        :sortParams="sortParams"
                        :getTableData="getClassroomTeachingScoreRankingList"
                        :loading="tableLoading"
                    >
                        <template #header="{column}">
                            <div v-if="column.prop == 'districtRank'">
                                {{ column.label
                                }}<el-tooltip
                                    content="教师在区/县范围内的排名"
                                    placement="top"
                                    popper-class="tooltip-content"
                                >
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #slotColumn="{row, column}">
                            <div
                                v-if="column.prop == 'name'"
                                class="underline-text"
                                @click="intoNextPage(row.name, row.id)"
                            >
                                {{ row.name }}
                            </div>
                            <div v-if="column.prop == 'rank'" class="column-index">
                                <img src="../../assets/imgs/1.png" alt="" v-if="row.rank == 1" />
                                <img src="../../assets/imgs/2.png" alt="" v-else-if="row.rank == 2" />
                                <img src="../../assets/imgs/3.png" alt="" v-else-if="row.rank == 3" />
                                <span v-else>{{ row.rank }}</span>
                            </div>
                            <div v-if="column.prop == 'districtRank'" class="column-index">
                                <img src="../../assets/imgs/1.png" alt="" v-if="row.districtRank == 1" />
                                <img src="../../assets/imgs/2.png" alt="" v-else-if="row.districtRank == 2" />
                                <img src="../../assets/imgs/3.png" alt="" v-else-if="row.districtRank == 3" />
                                <span v-else>{{ row.districtRank }}</span>
                            </div>
                            <div v-if="column.prop == 'classroomScore'" class="classroom-score">
                                <el-progress
                                    :percentage="row.classroomScore"
                                    :color="
                                        row.rank == 1 || row.districtRank == 1
                                            ? '#FE4C4C'
                                            : row.rank == 2 || row.districtRank == 2
                                            ? '#ba9100'
                                            : row.rank == 3 || row.districtRank == 3
                                            ? '#29CF73'
                                            : '#17b0fc'
                                    "
                                    :define-back-color="
                                        row.rank == 1 || row.districtRank == 1
                                            ? '#FE4C4C33'
                                            : row.rank == 2 || row.districtRank == 2
                                            ? '#ba910033'
                                            : row.rank == 3 || row.districtRank == 3
                                            ? '#29cf7333'
                                            : '#17b0fc33'
                                    "
                                    :style="{
                                        'border-color':
                                            row.rank == 1 || row.districtRank == 1
                                                ? '#FE4C4C80'
                                                : row.rank == 2 || row.districtRank == 2
                                                ? '#ba910080'
                                                : row.rank == 3 || row.districtRank == 3
                                                ? '#29cf7380'
                                                : '#17b0fc80',
                                    }"
                                    :show-text="false"
                                    :stroke-width="8"
                                ></el-progress
                                ><span>{{ row.classroomScore }}</span>
                            </div>
                        </template>
                    </commonTable>
                </div>
            </div>
            <div class="right-board">
                <div class="board-item4 board-item">
                    <div class="title">
                        <div class="title-name">课堂投放信息与课堂问答的四何分析</div>
                        <div class="view-detail btn" @click="viewFWAnalysisDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="pieChart2" class="my-char"></div>
                    <div class="bg-content-left"></div>
                    <div class="bg-content-right"></div>
                </div>
                <div class="board-item5 board-item">
                    <div class="title">
                        <div class="title-name">教学风格和学习风格</div>
                        <div class="view-detail btn" @click="viewStyleDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="pieChart3" class="my-char"></div>
                    <div class="bg-content-left"></div>
                    <div class="bg-content-right"></div>
                </div>
                <div class="board-item6 board-item">
                    <div class="title">
                        <div class="title-name">“问-答-评”结构（IRE）互动分析</div>
                        <div class="view-detail btn" @click="viewIREAnalysisDetail()">
                            <p>详情</p>
                            <img src="../../assets/imgs/3j.png" />
                        </div>
                        <div class="light"></div>
                    </div>
                    <div id="pieChart4" class="my-char"></div>
                </div>
            </div>
        </div>
        <classTypeDlg
            ref="classTypeDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="classTypeDlg"
            :options="chartOptions"
            @pageChange="pageChange"
        ></classTypeDlg>
        <classTeachDlg
            ref="classTeachDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="classTeachDlg"
            :options="chartOptions"
            @pageChange="pageChange"
        ></classTeachDlg>
        <FlandersDlg
            ref="FlandersDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="FlandersDlg"
            :options="chartOptions"
            @pageChange="pageChange"
        ></FlandersDlg>
        <FWAnalysisDlg
            ref="FWAnalysisDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="FWAnalysisDlg"
            :pie1Options="pie1Options"
            :pie2Options="pie2Options"
            @pageChange="pageChange"
            @changeChart="changeChart"
        ></FWAnalysisDlg>
        <styleDlg
            ref="styleDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="styleDlg"
            :pie1Options="pie1Options"
            :pie2Options="pie2Options"
            @pageChange="pageChange"
            @changeChart="changeChart"
        ></styleDlg>
        <IREAnalysisDlg
            ref="IREAnalysisDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="IREAnalysisDlg"
            :options="chartOptions"
            @pageChange="pageChange"
        ></IREAnalysisDlg>
        <trendAnalysisDlg
            ref="trendAnalysisDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="trendAnalysisDlg"
            :options="chartOptions"
        ></trendAnalysisDlg>
        <teachScoreDlg
            ref="teachScoreDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="teachScoreDlg"
            :options="{}"
            @pageChange="pageChange"
        ></teachScoreDlg>
        <classAnalysisDlg
            ref="classAnalysisDlg"
            :countList="countList"
            :allRangeText="allRangeText"
            :detailDlg="classAnalysisDlg"
            :options="{}"
        ></classAnalysisDlg>
    </div>
</template>

<script>
import commonTable from '@/components/commonTable.vue';
import classTypeDlg from '@/components/classTypeDlg.vue';
import classTeachDlg from '@/components/classTeachDlg.vue';
import FlandersDlg from '@/components/FlandersDlg.vue';
import FWAnalysisDlg from '@/components/FWAnalysisDlg.vue';
import styleDlg from '@/components/styleDlg.vue';
import IREAnalysisDlg from '@/components/IREAnalysisDlg.vue';
import trendAnalysisDlg from '@/components/trendAnalysisDlg.vue';
import teachScoreDlg from '@/components/teachScoreDlg.vue';
import classAnalysisDlg from '@/components/classAnalysisDlg.vue';
import * as echarts from 'echarts';
import SymbolImg from '@/assets/imgs/highlight-circle.png';
export default {
    components: {
        commonTable,
        classTypeDlg,
        classTeachDlg,
        FlandersDlg,
        FWAnalysisDlg,
        styleDlg,
        IREAnalysisDlg,
        trendAnalysisDlg,
        teachScoreDlg,
        classAnalysisDlg,
    },
    data() {
        return {
            tableImg: require('@/assets/imgs/k.png'),
            tableImgBig: require('@/assets/imgs/table-big.png'),
            curCityName: '',
            classType_Data: {
                title: '教学模式分布',
                data: [],
            },
            classTeach_indicator: [],
            Flanders_indicator: [],
            classTeach_averageScore: [],
            classTeach_standardScore: [],
            Flanders_averageScore: [],
            Flanders_standardScore: [],
            termRangeText: '', //弹窗显示的学期学科年级范围
            courseRangeText: '',
            gradeRangeText: '',
            termValueText: '', //传给后端的下拉值字段
            courseValueText: '',
            gradeValueText: '',
            termOptions: [],
            courseOptions: [],
            gradeOptions: [],
            termValue: '',
            courseValue: '',
            gradeValue: '',
            isCityMap: true,
            countyOptions: [],
            schoolOptions: [],
            teacherOptions: [],
            curMapTitle: '',
            curSchoolTitle: '',
            schoolData: [],
            tableData: [],
            columns: [
                {prop: 'rank', label: '排名', align: 'center', slot: true},
                {
                    prop: 'districtRank',
                    label: '区/县排名',
                    align: 'center',
                    slot: true,
                    isShow: false,
                    slotHeader: true,
                },
                {prop: 'name', label: '区/县名称', align: 'center', slot: true},
                {prop: 'aiClassCount', label: 'AI课堂数', sortable: 'custom', align: 'center'},
                {
                    prop: 'classroomScore',
                    label: '课堂评分',
                    slot: true,
                    align: 'center',
                    sortable: 'custom',
                },
            ],
            FWAnalysis_Data: {
                title: '课堂投放信息与课堂问答的四何分析',
                series1: {
                    name: '教师课堂投放信息',
                    data: [],
                },
                series2: {
                    name: '课堂信息中问答类',
                    data: [],
                },
            },
            styleAndLearn_Data: {
                title: '教学风格和学习风格',
                series1: {
                    name: '教师教学风格',
                    data: [],
                },
                series2: {
                    name: '学生学习风格',
                    data: [],
                },
            },
            IRE_Data: {
                title: '“问-答-评”结构（IRE）互动分析',
                data: [],
            },
            allRangeText: '',
            countList: {},
            classTypeDlg: {
                visible: false,
                title: '教学模式分布',
                text: '教学模式分为练习型、对话型、讲授型、混合型共四种类型，展现教师的课堂组织方式，教师可以按照课程和目标进行调整。\n• 对话型的师生转换次数比较高，此种模式师生之间互动充分。\n• 讲授型的教师行为比例比较高，此种模式以教师讲授为主。\n• 当教师行为占有率较低时，此时以学生活动为主，为练习型。\n• 当教师行为占有率在一半附近时，此时教师、学生均充分参与，为混合（探究）型。',
            },
            classTeachDlg: {
                visible: false,
                title: '课堂教学情况',
                text: '分教师主导、学生主体、教学达成三个类别，具体化为9个评价指标；教师指导：为指标1~5；学生主体：为指标6~8；教学达成：为指标9。\n9个指标如下：\n1.目标定位：从正确价值观、必备品格、关键能力三大方面，把握教学目标，既重视学科教学，也着眼于综合素质的培育与发展。\n2.课堂艺术：从教学语言、教学体态、教学情感等方面，体现教师职业特点，既热情大方又朴实得体，语言流畅，具有亲和力和感染力。\n3.课堂调控：根据学生的学习反应、课堂活动等，及时调整教学节奏与教学活动，及时捕捉有价值的教学资源并加以有效利用。\n4.思维激发：从学生视角指明学习目标，选择恰当时机与方式引导深入、猜想质疑、点拨纠偏、鼓励肯定；以指导者与合作者角色，密切关注每个学生的学习状况，激励学生采用独立自主、合作探究等多种方式开展学习。\n5.评价反馈：教师具有同理心和包容心，对学生学习及时给予正面评价和反馈，且运用多种方式鼓励学生互学互评，激发学生的学习动力。\n6.整体发展：课堂结构遵循学生身心发展规律，教学活动兼顾不同个性兴趣、爱好特长、思维习惯的学生，给予学生充分的学习和自我展示的时空，每个学生均可获得各自的进步成长。\n7.合作交流：师生之间相互信任、彼此尊重、平等民主。从促进理解的立场出发，师生、生生交流沟通深入，互动反馈及时顺畅。\n8.学习体验：学生积极参与各个学习环节，专注地思考各种问题，全身心地投入到各项学习活动中，享受学习的快乐。\n9.目标达成：不同层次的学生都有收获，完成预期教学目标和取得较好的教学效果。',
            },
            FlandersDlg: {
                visible: false,
                title: '弗兰德斯互动分析',
                text: '旨在分析互动的质量。主要分析7大指标，面积越大表示互动质量越好。 某个维度取值越高，表示该方面做的越好。\n7个指标如下：\n1.I/D-启发性：亦称教师间接影响与直接影响比率，即教师采用间接影响的话语时间与采用直接影响的话语时间的比率。数值越高，表示上课时学生接受教师的启发越多。\n2.TRR-教师正面回应学生比率：亦称教师反应比率，教师对学生的观念和感觉加以反应的话语时间，占教师与教学无直接相关的话语时间的比率。数值越高，表示教师越能回应学生的观念和感觉。\n3.TQR-教师发问比率：教师发问时间占教师与教学有直接相关的教学时间的比率。数值越高，表示上课时教师越常利用发问来进行教学。\n4.PIR-学生发问比率：学生发问，与学生主动发言正相关。学生主动发言比率，即学生主动引发的话语时间占学生话语时间的比率。数值越高，表示学生越勇于主动表达自己的意见。\n5.CCR-教师聚焦讲授与提问比率：亦称内容十字区比率。教师以与教学有直接相关的话语，占课堂总时间的比率。数值越高，表示师生的语言互动越能以教材内容的发问及讲授为重心。\n6.SSR-师生话题交流稳定比率：亦称稳定状态区比率。师生言谈停留在同一话语类别达3秒以上的话语时间，占全部教学时间的比率。数值越高，表示师生间的交谈互动越稳定。\n7.PSSR-学生表达稳定比率：亦称学生稳定状态区比率。学生说话持续达3秒以上的话语时间，占学生话语时间的比率。数值越高，表示学生的言谈风格越稳定。',
            },
            FWAnalysisDlg: {
                visible: false,
                title: '课堂投放信息与课堂问答的四何分析',
                text: '课堂投放信息：\n课堂知识传递方式，用若何（whatif）、为何（why）、是何（what）、如何（how）来代表，这并不限于“为何“等之类的提问，而仅仅作为教师课堂知识传递的方式的典型代表。这四种课堂知识传递方式的分布情况，反映了教师在课程设计上对场景设置、原因探索引导、概念抽象概括、知识练习和知识迁移方面的总体规划。\n课堂问答：\n教师提问，根据发动的问题分为：若何（What if）、如何（How）、是何（What）、为何（Why）。是何，多为封闭型问题；若何、如何、为何等则多为开放型问题。',
            },
            styleDlg: {
                visible: false,
                title: '教学风格和学习风格',
                text: '教学风格：\n知行理论通过分析处理信息的方式（从概念到场景），以及处理完信息之后的响应方式（从内化建构到思想练习）， 凝练而深刻地刻画老师的教学风格和学习者的学习风格。教学风格划为场景→内化建构、概念→内化建构、概念→思想练习、场景→思想练习四种。教学风格分布越均匀，表示对各类学生的兼顾越好。\n学习风格：\n根据学生学习发生方式的偏向，学习风格划为感悟型、哲理型、现实型、能动型四种。统计全部发言学生呈现的学习风格百分比分布。根据学习发生的知行理论，一般来说，若兼顾了四种类型，则说明教师能够在课堂中有效激发各种学习风格的学生。',
            },
            IREAnalysisDlg: {
                visible: false,
                title: 'IRE互动分析',
                text: '教师课堂提问存在着IRE（Initiation-Response-Evaluation）结构，即教师通过提问发动互动（Initiation），学生对教师问题作出响应（Response），随后教师对学生的响应进行评价（Evaluation）。如果教师给学生预留讨论或思考的时间，模式里会有D（Discussion）出现。典型的提问方式有简单型IRE，学生讨论思考再答型IDRE，追问型IRIRE。\n通常来说，开放问题非简单否定的IDRE模式，更能激发学生带着问题学习的热情。过多封闭问题的简单型IRE，因为会导致教师威信呈现过强，而影响学生思想的参与积极性。',
            },
            trendAnalysisDlg: {
                visible: false,
                title: '课堂教学情况趋势分析',
                text: '课堂教学情况的综合评分和9大指标评分，按月/周的维度形成评分走势图。',
            },
            teachScoreDlg: {
                visible: false,
                title: '课堂教学评分排行',
                text: '',
            },
            classAnalysisDlg: {
                visible: false,
                title: '课堂教学综合评分分析',
                text: '统计该教师的各课堂教学综合评分以及教师在区/县的排名等数据。',
            },
            chartOptions: {},
            curChart: '',
            curPage: 'CITY',
            showAreaCount: true,
            isSchool: false,
            isTeacher: false,
            catchphraseArray: [],
            randomArr: [],
            curTeacherTitle: '',
            curDay: '',
            curTime: '',
            myTimeDisplay: null,
            imgArray: [
                require('@/assets/imgs/qipao1.png'),
                require('@/assets/imgs/qipao2.png'),
                require('@/assets/imgs/qipao3.png'),
                require('@/assets/imgs/qipao4.png'),
                require('@/assets/imgs/qipao5.png'),
                require('@/assets/imgs/qipao6.png'),
                require('@/assets/imgs/qipao7.png'),
                require('@/assets/imgs/qipao8.png'),
                require('@/assets/imgs/qipao9.png'),
                require('@/assets/imgs/qipao10.png'),
                require('@/assets/imgs/qipao11.png'),
                require('@/assets/imgs/qipao12.png'),
            ],
            // 用于限制角色可以看到哪一层级的内容
            isBackCityMap: true,
            isBackCountyMap: true,
            isBackSchool: true,
            orgLevel: {
                CITY: 2,
                DISTRICT: 3,
                SCHOOL: 4,
                USER: 5,
            },
            curId: null,
            curDistrictOrgMap: {},
            curDistrictNameMap: {},
            curSchoolOrgMap: {},
            preOrgInfo: {},
            curCityId: '',
            curDistrictId: '',
            curSchoolId: '',
            curUserId: '',
            chartDataList: [],
            scoreDataList: [],
            detailList: [],
            sortParams: {},
            myCityChart: '',
            myCountyChart: '',
            isMunicipalSchool: false,
            pie1Options: {},
            pie2Options: {},
            tableLoading: false,
            pie1Chart: null,
            pie2Chart: null,
            dbPie1Chart: null,
            dbPie2Chart: null,
            radar1Chart: null,
            radar2Chart: null,
            lineChart: null,
            curUserPower: false,
            noUpdateDistrictOptions: false,
            noUpdateSchoolOptions: false,
            noUpdateTeacherOptions: false,
            dateStatistics: [
                {label: '按学期', value: 1},
                {label: '按时段', value: 2},
            ],
            statisticValue: 1,
            isShowTermSelect: true,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '本周',
                        onClick(picker) {
                            const now = new Date();
                            const start = new Date(now);
                            const day = now.getDay();
                            const diff = day === 0 ? -6 : 1 - day;
                            start.setDate(now.getDate() + diff);
                            start.setHours(0, 0, 0, 0);
                            const end = new Date(now);
                            end.setHours(23, 59, 59, 999);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '上周',
                        onClick(picker) {
                            const now = new Date();
                            const start = new Date(now);
                            const day = now.getDay();
                            // 上周一
                            const diff = day === 0 ? -13 : -6 - day;
                            start.setDate(now.getDate() + diff);
                            start.setHours(0, 0, 0, 0);

                            const end = new Date(now);
                            // 上周日
                            const endDiff = day === 0 ? -7 : -day;
                            end.setDate(now.getDate() + endDiff);
                            end.setHours(23, 59, 59, 999);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '本月',
                        onClick(picker) {
                            const now = new Date();
                            const start = new Date(now.getFullYear(), now.getMonth(), 1);
                            const end = new Date(now);
                            end.setHours(23, 59, 59, 999);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '上月',
                        onClick(picker) {
                            const now = new Date();
                            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                            const end = new Date(now.getFullYear(), now.getMonth(), 0);
                            end.setHours(23, 59, 59, 999);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
                firstDayOfWeek: 1,
            },
            dateValueArray: '',
            dateRangeText: '',
        };
    },
    mounted() {
        this.getTermList();
        this.getSubjectList();
        this.getGradeList();
        // 右上角显示当前时间
        this.getNowTime();
        clearInterval(this.myTimeDisplay);
        this.myTimeDisplay = setInterval(() => {
            this.getNowTime();
        }, 1000);
        this.getUserInfo();
        window.addEventListener('resize', () => {
            this.pie1Chart.resize();
            this.pie2Chart.resize();
            this.dbPie1Chart.resize();
            this.dbPie2Chart.resize();
            this.radar1Chart.resize();
            this.radar2Chart.resize();
        });
    },
    computed: {
        positionOptions() {
            if (this.curPage == 'DISTRICT') {
                return this.countyOptions;
            } else if (this.curPage == 'SCHOOL') {
                return this.schoolOptions;
            } else if (this.curPage == 'USER') {
                return this.teacherOptions;
            }
            return [];
        },
    },
    methods: {
        getUserInfo() {
            let params = {};
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log('用户的userInfo', userInfo);
            if (userInfo.orgId == 1) {
                this.getCurOrg(userInfo.orgId);
            } else {
                params['orgId'] = userInfo.orgId;
                this.$axios.get('/sys/org/info', params).then((res) => {
                    let orgLevel = res.data.orgLevel;
                    // 可能存在市级底下的教师，直接显示到教师个人层级（区县也可能出现这种角色
                    if (userInfo.roleType == 1 && userInfo.sysUserAuth[0].type == 4) {
                        this.curUserPower = true;
                        this.isBackCityMap = false;
                        this.isBackCountyMap = false;
                        this.isBackSchool = false;
                        this.curId = res.data.id;
                        this.curUserId = userInfo.userId;
                        this.curSchoolTitle = res.data.name;
                        this.curSchoolId = res.data.id;
                        this.noUpdateTeacherOptions = true;
                        this.intoTeacherPage({teacher: userInfo.nickName, id: userInfo.userId});
                        this.getOrgDirectlyUp();
                    } else {
                        if (orgLevel == 2) {
                            this.curCityId = res.data.id;
                            this.curId = res.data.id;
                            this.curPage = 'CITY';
                            this.isCityMap = true;
                            this.isTeacher = false;
                            this.isSchool = false;
                            this.isBackCityMap = true;
                            this.isBackCountyMap = true;
                            this.isBackSchool = true;
                            this.curCityName = res.data.nikeName;
                            this.updateData();
                        } else if (orgLevel == 3) {
                            this.isBackCityMap = false;
                            this.isBackCountyMap = true;
                            this.isBackSchool = true;
                            this.curId = res.data.id;
                            this.curDistrictId = res.data.id;
                            this.curPage = 'DISTRICT';
                            // 如果是当前层级，就不获取当前层级的下拉
                            this.noUpdateDistrictOptions = true;
                            this.intoCountyMap(res.data.nikeName, res.data.id);
                            this.getDirectOptions(res.data.parentId);
                            this.getOrgDirectlyUp();
                        } else if (orgLevel == 4) {
                            // 教师：orgLevel == 4 roleType == 1 且是个人数据
                            if (userInfo.roleType == 1 && userInfo.sysUserAuth[0].type == 4) {
                                this.isBackCityMap = false;
                                this.isBackCountyMap = false;
                                this.isBackSchool = false;
                                this.curId = res.data.id;
                                this.curUserId = userInfo.userId;
                                this.curSchoolTitle = res.data.name;
                                this.curSchoolId = res.data.id;
                                this.noUpdateTeacherOptions = true;
                                this.intoTeacherPage({teacher: userInfo.nickName, id: userInfo.userId});
                                this.getOrgDirectlyUp();
                            } else {
                                this.isBackCityMap = false;
                                this.isBackCountyMap = false;
                                this.isBackSchool = true;
                                this.curId = res.data.id;
                                this.curSchoolId = res.data.id;
                                this.noUpdateSchoolOptions = true;
                                this.intoSchoolPage(res.data.name, res.data.id);
                                this.getSchoolOptions(res.data.parentId);
                                this.getOrgDirectlyUp();
                            }
                        }
                    }
                });
            }
        },
        getCurOrg(id) {
            let params = {};
            params['orgId'] = id;
            params['orgLevel'] = this.orgLevel[this.curPage];
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            this.$axios.get('/ai/bigdata/getOrgDirectlySub', params).then((res) => {
                this.curCityId = res.data[0].id;
                this.curId = res.data[0].id;
                this.curCityName = res.data[0].name;
                this.updateData();
            });
        },
        /**
         * 获取机构上级
         */
        getOrgDirectlyUp() {
            let params = {};
            params['orgId'] = this.curId;
            this.$axios.get('/ai/bigdata/getOrgDirectlyUp', params).then((res) => {
                if (this.curPage == 'CITY') {
                    return res.data[res.data.length - 1].id;
                } else if (this.curPage == 'DISTRICT') {
                    this.curCityName = res.data[1].name;
                    this.curCityId = res.data[1].id;
                } else if (this.curPage == 'SCHOOL') {
                    this.curCityName = res.data[1].name;
                    this.curMapTitle = res.data[2].name;
                    this.curDistrictId = res.data[2].id;
                } else if (this.curPage == 'USER') {
                    // 市级底下的教师 获取上级只有机构，只把机构显示出来。对这种情况特殊处理
                    if (res.data.length == 1) {
                        this.curMapTitle = res.data[0].name;
                    } else {
                        this.curCityName = res.data[1].name;
                        this.curMapTitle = res.data[2].name;
                        this.curDistrictId = res.data[2].id;
                    }
                }
            });
        },
        /**
         * 获取机构直属下级
         */
        async getOrgDirectlySub() {
            let params = {};
            params['orgId'] = this.curId;
            params['orgLevel'] = this.orgLevel[this.curPage] + 1;
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            await this.$axios.get('/ai/bigdata/getOrgDirectlySub', params).then((res) => {
                if (this.curPage == 'CITY') {
                    this.countyOptions = [];
                    this.curDistrictOrgMap = {};
                    res.data.forEach((ite) => {
                        this.curDistrictOrgMap[ite.name] = ite.id;
                        this.curDistrictNameMap[ite.id] = ite.name;
                        this.countyOptions.push({name: ite.name, id: ite.id});
                    });
                } else if (this.curPage == 'DISTRICT') {
                    this.schoolData = [];
                    this.schoolOptions = [];
                    this.curSchoolOrgMap = {};
                    res.data.forEach((ite) => {
                        if (ite.longitude && ite.latitude) {
                            let schoolObj = {};
                            schoolObj['name'] = ite.name;
                            schoolObj['value'] = [ite.longitude, ite.latitude, 100];
                            this.schoolData.push(schoolObj);
                            this.curSchoolOrgMap[ite.name] = ite.id;
                            this.schoolOptions.push({name: ite.name, id: ite.id});
                        }
                    });
                }
            });
        },
        /**
         * 更新页面数据
         * @param isCurPageUpdate 是否当前页面刷新
         */
        async updateData(isCurPageUpdate) {
            // 需要等待学校地图数据请求成功之后再去渲染地图
            if (!isCurPageUpdate && this.curPage != 'SCHOOL' && this.curPage != 'USER') {
                await this.getOrgDirectlySub();
            }
            this.getCountData();
            this.drawPieChart1();
            this.drawRadar1();
            this.drawRadar2();
            this.drawPieChart2();
            this.drawPieChart3();
            this.drawPieChart4();
            if (this.curPage != 'USER') {
                this.getClassroomTeachingScoreRankingList();
            }
            if (this.curPage == 'CITY') {
                this.$nextTick(() => {
                    this.drawCityMap();
                });
            } else if (this.curPage == 'DISTRICT') {
                if (!this.noUpdateDistrictOptions) {
                    this.getDirectOptions(this.curCityId);
                }
                if (!this.isMunicipalSchool) {
                    this.$nextTick(() => {
                        this.drawCountyMap();
                    });
                }
            } else if (this.curPage == 'SCHOOL') {
                if (!this.noUpdateSchoolOptions) {
                    this.getSchoolOptions(this.curDistrictId);
                }
            } else if (this.curPage == 'USER') {
                this.getTeacherDistrictRankingList();
                if (!this.noUpdateTeacherOptions) {
                    this.getTeacherOptions(this.curSchoolId);
                }
            }
        },
        // 获取下拉
        getTermList() {
            this.$axios.get('ai/bigdata/listTerm').then((res) => {
                this.termOptions = this.$comjs.removeNullSubChildren(res.data);
            });
        },
        getSubjectList() {
            this.$axios.get('ai/bigdata/listSubject').then((res) => {
                this.courseOptions = res.data;
            });
        },
        getGradeList() {
            this.$axios.get('ai/bigdata/listGrade').then((res) => {
                this.gradeOptions = this.$comjs.removeNullSubChildren(res.data);
            });
        },
        /**
         * 获取通用参数的公共方法
         */
        getParams() {
            let params = {};
            params['aiBigDataTypeEnum'] = this.curPage;
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            params['startDate'] = this.dateValueArray ? this.dateValueArray[0] : '';
            params['endDate'] = this.dateValueArray ? this.dateValueArray[1] : '';
            if (this.curPage == 'USER') {
                params['teacherId'] = this.curUserId;
                params['orgId'] = this.curSchoolId;
            } else {
                params['orgId'] = this.curId;
                if (this.curUserPower) {
                    params['teacherId'] = this.curUserId;
                }
            }
            return params;
        },
        getCountData() {
            let params = this.getParams();
            this.$axios.get('ai/bigdata/loginBoard', params).then((res) => {
                this.countList = {};
                this.catchphraseArray = [];
                if (res.data) {
                    this.countList = res.data;
                    this.catchphraseArray = res.data.petPhrasesList ? res.data.petPhrasesList : [];
                }
            });
        },
        // 教学模式分布
        drawPieChart1() {
            let chartDom = document.getElementById('pieChart1');
            this.pie1Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('ai/bigdata/getClassTypeDistributionChart', params).then((res) => {
                this.classType_Data.data = res.data.classTypeDistributionChartVo;
                let options = this.createPie(this.classType_Data);
                this.pie1Chart.setOption(options, true);
            });
        },
        drawPieChart2() {
            let chartDom = document.getElementById('pieChart2');
            this.dbPie1Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('/ai/bigdata/getClassroomQuestionAnalysis', params).then((res) => {
                this.FWAnalysis_Data.series1.data = res.data.teacherReleaseDistribution;
                this.FWAnalysis_Data.series2.data = res.data.questionAnswerDistribution;
                let options = this.createDbPie(this.FWAnalysis_Data);
                this.dbPie1Chart.setOption(options, true);
            });
        },
        drawPieChart3() {
            let chartDom = document.getElementById('pieChart3');
            this.dbPie2Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('/ai/bigdata/getTeachingAndLearningStyle', params).then((res) => {
                this.styleAndLearn_Data.series1.data = res.data.teacherReleaseDistribution;
                this.styleAndLearn_Data.series2.data = res.data.questionAnswerDistribution;
                let options = this.createDbPie(this.styleAndLearn_Data);
                this.dbPie2Chart.setOption(options, true);
            });
        },
        drawPieChart4() {
            let chartDom = document.getElementById('pieChart4');
            this.pie2Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('/ai/bigdata/getIREInteractionAnalysis', params).then((res) => {
                this.IRE_Data.data = res.data.ireinteractionAnalysisVo;
                let options = this.createPie(this.IRE_Data);
                this.pie2Chart.setOption(options, true);
            });
        },
        /**
         * 单个饼图生成通用方法
         * @param pieParams 饼图数据 isDetail是否是查看详情（控制饼图显示大小）
         * @param isDetail 是否是在弹窗内使用
         */
        createPie(pieParams, isDetail) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter:
                        '{a} <br/>{b}:&nbsp;&nbsp;<b>{c}' +
                        (pieParams.title == '教学模式分布' ? '节' : '次') +
                        '</b>&nbsp;&nbsp;(<b>{d}%</b>)',
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                },
                color: ['#CB2223', '#0082D2', '#009B45', '#BA9100'],
                series: [
                    {
                        name: pieParams.title,
                        type: 'pie',
                        radius: isDetail ? ['50%', '65%'] : ['42%', '57%'],
                        center: ['50%', '50%'],
                        data: pieParams.data,
                        label: {
                            formatter: (param) => {
                                return param.name + ': ' + (param.percent ? param.percent : 0) + '%';
                            },
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: 'SourceHanSansCN-Regular',
                            overflow: 'truncate',
                            ellipsis: '...',
                            width: 120,
                        },
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 1,
                            borderColor: '#041d36',
                            borderWidth: isDetail ? 3 : 2,
                        },
                    },
                ],
            };
        },
        /**
         * 两个饼图通用方法
         * @param pieParams 饼图数据
         * @param isDisabled 是否禁用
         * series1：第一个饼图相关数据，属性包括name和data
         * series2：第二个饼图相关数据，属性包括name和data
         */
        createDbPie(pieParams, isDisabled) {
            return {
                title: [
                    {
                        subtext: pieParams.series1.name,
                        left: '26%',
                        top: '65%',
                        textAlign: 'center',
                        subtextStyle: {
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: 'SourceHanSansCN-Medium',
                        },
                    },
                    {
                        subtext: pieParams.series2.name,
                        left: '75%',
                        top: '65%',
                        textAlign: 'center',
                        subtextStyle: {
                            color: isDisabled ? '#FFFFFF40' : '#fff',
                            fontSize: 16,
                            fontFamily: 'SourceHanSansCN-Medium',
                        },
                    },
                ],
                grid: {
                    bottom: 10,
                },
                color: ['#CB2223', '#0082D2', '#009B45', '#BA9100'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}:&nbsp;&nbsp;&nbsp;&nbsp;<b>{d}%</b>',
                    valueFormatter: (value) => {
                        return value + '%';
                    },
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                },
                series: [
                    {
                        name: pieParams.series1.name,
                        type: 'pie',
                        radius: ['25%', '36%'],
                        center: ['26%', '36%'],
                        data: pieParams.series1.data,
                        itemStyle: {
                            borderRadius: 1,
                            borderColor: '#041d36',
                            borderWidth: 2,
                        },
                        label: {
                            color: '#fff',
                            fontSize: 12,
                            fontFamily: 'SourceHanSansCN-Regular',
                            overflow: 'truncate',
                            ellipsis: '...',
                            width: 45,
                        },
                    },
                    {
                        name: pieParams.series2.name,
                        type: 'pie',
                        radius: ['25%', '36%'],
                        center: ['75%', '36%'],
                        data: pieParams.series2.data,
                        itemStyle: {
                            borderRadius: 1,
                            borderColor: '#041d36',
                            borderWidth: 2,
                            opacity: isDisabled ? 0.3 : 1,
                        },
                        label: {
                            color: '#fff',
                            fontSize: 12,
                            fontFamily: 'SourceHanSansCN-Regular',
                        },
                        tooltip: {
                            show: !isDisabled,
                        },
                        emphasis: {
                            disabled: isDisabled,
                        },
                    },
                ],
            };
        },
        // 弹窗两个饼图生成通用方法
        createDbDetailPie(pieParams) {
            let options = {};
            options = {
                title: [
                    {
                        subtext: pieParams.name,
                        left: '50%',
                        top: '71%',
                        textAlign: 'center',
                        subtextStyle: {
                            color: this.curChart == pieParams.name ? '#ffffff' : '#FFFFFF40',
                            fontSize: 16,
                            fontFamily: 'SourceHanSansCN-Medium',
                        },
                    },
                ],
                color: ['#CB2223', '#0082D2', '#009B45', '#BA9100'],
                grid: {
                    bottom: 10,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}:&nbsp;&nbsp;&nbsp;&nbsp;<b>{d}%</b>',
                    valueFormatter: (value) => {
                        return value + '%';
                    },
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                },
                series: [
                    {
                        name: pieParams.name,
                        type: 'pie',
                        radius: ['35%', '46%'],
                        center: ['50%', '38%'],
                        data: pieParams.data,
                        itemStyle: {
                            borderRadius: 1,
                            borderColor: '#041d36',
                            borderWidth: 2.5,
                            opacity: this.curChart == pieParams.name ? 1 : 0.3,
                        },
                        label: {
                            color: '#fff',
                            fontSize: 12,
                            fontFamily: 'SourceHanSansCN-Regular',
                            overflow: 'truncate',
                            ellipsis: '...',
                            width: 50,
                        },
                        tooltip: {
                            show: this.curChart == pieParams.name,
                        },
                        emphasis: {
                            disabled: this.curChart !== pieParams.name,
                        },
                    },
                ],
            };
            return options;
        },
        // 获取雷达图
        drawRadar1() {
            let chartDom = document.getElementById('radarChart1');
            this.radar1Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('ai/bigdata/getClassroomTeachingSituation', params).then((res) => {
                this.classTeach_indicator = [];
                this.classTeach_averageScore = [];
                this.classTeach_standardScore = [];
                if (res.data.list.length != 0) {
                    res.data.list.forEach((item) => {
                        let obj = {};
                        obj['text'] = item.dimensionName;
                        obj['max'] = 14;
                        this.classTeach_indicator.push(obj);
                        this.classTeach_averageScore.push(item.averageScore);
                        this.classTeach_standardScore.push(item.standardScore);
                    });
                }
                let option = this.getRadar1Option();
                this.radar1Chart.setOption(option, true);
            });
        },
        getRadar1Option(isDetail) {
            if (this.classTeach_indicator.length == 0) return {};
            let symbolImg = 'image://' + SymbolImg;
            return {
                color: ['#3EF2FC', '#FFD12B'],
                tooltip: {
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                    show: true,
                    borderColor: '#99def0',
                    formatter: (params) => {
                        //自定义绘制tooltip
                        let str = '';
                        let colorArray = [
                            '#ed4848',
                            '#fe8b4c',
                            '#ffd12b',
                            '#29cf73',
                            '#17b0fc',
                            '#3ef2fc',
                            '#017feb',
                            '#5764d8',
                            '#ee85c2',
                            '#00aeae',
                        ];
                        str =
                            ` <div class="custom-tooltip-style" style="width:250px;font-family: Microsoft YaHei;box-sizing:border-box">
                                            <h3 style="height:14px;font-size:14px;font-weight:400;line-height:14px;">` +
                            '课堂教学情况' +
                            `</h3><ul style="margin:0;padding:0;list-style:none;font-size: 14px;">`;
                        str +=
                            `<li style="display:flex;margin-top:6px;height: 25px;width: 230px;margin-left:10px">
                                    <p style="width:50%"></p>
                                    <p style="margin-left: 5px;text-align:right;width:20%;font-size:14px;color:#91CEFF" >` +
                            '本区域' +
                            `</p>` +
                            `<p style="text-align:right;width:30%; font-size:14px; color:#91CEFF">` +
                            '参考标准' +
                            `</p>` +
                            `</li>`;
                        this.classTeach_indicator.forEach((item, index) => {
                            let color = index % 2 != 0 ? '#001c3b' : 'transparent';
                            str +=
                                `<li style="display:flex;margin-top:6px;width: 230px;align-items: center;padding: 2px 0;margin-left:10px;background-color:` +
                                color +
                                `">
                                    <p style="width:50%;display:flex;align-items: center">
                                        <span style="width:6px;height:6px;border-radius:0px;display: inline-block; border-left:2.5px solid ` +
                                colorArray[index] +
                                `; border-right: 7px solid transparent; border-top:3px solid transparent; border-bottom: 3px solid transparent"></span>` +
                                item.text +
                                `</p>
                                    <p style="margin-left: 1px;text-align:right;width:20%;color:#FFD12B" >` +
                                this.classTeach_averageScore[index] +
                                `</p>` +
                                `<p style="text-align:right;width:30%;color:#3EF2FC">` +
                                this.classTeach_standardScore[index] +
                                `</p>` +
                                `</li>`;
                        });
                        str += `</ul></div>`;
                        return str ? str : ''; //解决未在拐点悬浮undefine问题
                    },
                    confine: isDetail,
                    position: ['50%', '-50%'],
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemGap: 40,
                    top: '35%',
                    right: 30,
                    orient: 'vertical',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff',
                    },
                    show: !isDetail,
                    selectedMode: false,
                },
                radar: [
                    {
                        // 根据数据的个数显示多边形
                        indicator: this.classTeach_indicator,
                        symbol: 'circle',
                        center: !isDetail ? ['35%', '50%'] : ['50%', '50%'],
                        radius: 70,
                        axisName: {
                            color: '#91CEFF',
                            padding: [1, 2],
                            fontSize: 12,
                            fontFamily: 'SourceHanSansCN-Regular',
                        },
                        splitArea: {
                            areaStyle: {
                                color: ['#1e495e', '#1e2e2f', '#1d4457', '#03203d', '#03305a'],
                            },
                        },
                        shape: 'circle',
                        axisLine: {
                            lineStyle: {
                                color: '#446e94',
                                type: 'dashed',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#017dff80',
                            },
                        },
                    },
                ],
                series: [
                    {
                        type: 'radar',
                        // 取消悬浮高亮效果
                        emphasis: {
                            disabled: true,
                        },
                        data: [
                            {
                                value: this.classTeach_standardScore,
                                name: '参考标准',
                                symbol: 'none',
                                areaStyle: {
                                    color: '#1e3134',
                                },
                                lineStyle: {
                                    type: 'dashed',
                                },
                            },
                            {
                                value: this.classTeach_averageScore,
                                name: '本区域表现',
                                symbol: symbolImg,
                                symbolSize: 25,
                                areaStyle: {
                                    color: 'none',
                                },
                                lineStyle: {
                                    width: 1,
                                },
                            },
                        ],
                    },
                ],
            };
        },
        drawRadar2() {
            let chartDom = document.getElementById('radarChart2');
            this.radar2Chart = echarts.init(chartDom);
            let params = this.getParams();
            this.$axios.get('ai/bigdata/getFlandersInteractionAnalysis', params).then((res) => {
                this.Flanders_indicator = [];
                this.Flanders_averageScore = [];
                this.Flanders_standardScore = [];
                if (res.data.list.length != 0) {
                    res.data.list.forEach((item) => {
                        let obj = {};
                        obj['text'] = item.dimensionName.replace(/[\u4e00-\u9fa5]/g, '');
                        obj['allText'] = item.dimensionName;
                        obj['max'] = 1;
                        this.Flanders_indicator.push(obj);
                        this.Flanders_averageScore.push(item.regionalScore);
                        this.Flanders_standardScore.push(item.normStandardScore);
                    });
                }
                let option = this.getRadar2Option();
                this.radar2Chart.setOption(option, true);
            });
        },
        getRadar2Option(isDetail) {
            if (this.Flanders_indicator.length == 0) return {};
            let symbolImg = 'image://' + require('@/assets/imgs/green.png');
            return {
                color: ['#42acde', '#9DFFC9'],
                tooltip: {
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                    show: true,
                    borderColor: '#99def0',
                    formatter: (params) => {
                        //自定义绘制tooltip
                        let str = '';
                        let colorArray = [
                            '#ed4848',
                            '#fe8b4c',
                            '#ffd12b',
                            '#29cf73',
                            '#17b0fc',
                            '#3ef2fc',
                            '#017feb',
                            '#5764d8',
                            '#ee85c2',
                            '#00aeae',
                        ];
                        str =
                            ` <div class="custom-tooltip-style" style="width:280px;font-family: Microsoft YaHei;box-sizing:border-box">
                                            <h3 style="height:14px;font-size:14px;font-weight:400;line-height:14px;">` +
                            '弗兰德斯互动分析' +
                            `</h3><ul style="margin:0;padding:0;list-style:none;font-size: 14px;">`;
                        str +=
                            `<li style="display:flex;margin-top:6px;height: 25px;width: 270px;margin-left:10px">
                                    <p style="width:55%"></p>
                                    <p style="margin-left: 5px;text-align:right;width:20%;font-size:14px;color:#91CEFF" >` +
                            '本区域' +
                            `</p>` +
                            `<p style="text-align:right;width:25%; font-size:14px; color:#91CEFF">` +
                            '参考标准' +
                            `</p>` +
                            `</li>`;
                        this.Flanders_indicator.forEach((item, index) => {
                            let color = index % 2 != 0 ? '#001c3b' : 'transparent';
                            str +=
                                `<li style="display:flex;margin-top:6px;width: 270px;align-items: center;padding: 2px 0;margin-left:0px;background-color:` +
                                color +
                                `">
                                    <p style="width:55%;display:flex;align-items: center">
                                        <span style="width:6px;height:6px;border-radius:0px;display: inline-block; border-left:2.5px solid ` +
                                colorArray[index] +
                                `; border-right: 7px solid transparent; border-top:3px solid transparent; border-bottom: 3px solid transparent"></span>` +
                                item.allText +
                                `</p>
                                    <p style="margin-left: 1px;text-align:right;width:20%;color:#9DFFC9" >` +
                                this.Flanders_averageScore[index] +
                                `</p>` +
                                `<p style="text-align:right;width:25%;color:#42acde">` +
                                this.Flanders_standardScore[index] +
                                `</p>` +
                                `</li>`;
                        });
                        str += `</ul></div>`;
                        return str ? str : ''; //解决未在拐点悬浮undefine问题
                    },
                    confine: isDetail,
                    position: ['50%', '-70%'],
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemGap: 40,
                    top: '35%',
                    right: 30,
                    orient: 'vertical',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff',
                    },
                    show: !isDetail,
                    selectedMode: false,
                },
                radar: [
                    {
                        // 根据数据的个数显示多边形
                        indicator: this.Flanders_indicator,
                        symbol: 'circle',
                        center: !isDetail ? ['35%', '50%'] : ['50%', '50%'],
                        radius: 70,
                        axisName: {
                            color: '#91CEFF',
                            padding: [1, 2],
                            fontSize: 12,
                            fontFamily: 'SourceHanSansCN-Regular',
                        },
                        splitArea: {
                            areaStyle: {
                                color: ['#1e495e', '#1e2e2f', '#1d4457', '#03203d', '#03305a'],
                            },
                        },
                        shape: 'circle',
                        axisLine: {
                            lineStyle: {
                                color: '#446e94',
                                type: 'dashed',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#017dff80',
                            },
                        },
                    },
                ],
                series: [
                    {
                        type: 'radar',
                        // 取消悬浮高亮效果
                        emphasis: {
                            disabled: true,
                        },
                        data: [
                            {
                                value: this.Flanders_standardScore,
                                name: '参考标准',
                                symbol: 'none',
                                areaStyle: {
                                    color: '#1e3134',
                                },
                                lineStyle: {
                                    type: 'dashed',
                                },
                            },
                            {
                                value: this.Flanders_averageScore,
                                name: '本区域表现',
                                symbol: symbolImg,
                                symbolSize: 25,
                                areaStyle: {
                                    color: 'none',
                                },
                                lineStyle: {
                                    width: 1,
                                },
                            },
                        ],
                    },
                ],
            };
        },
        // 返回市级
        goBackCity() {
            if (!this.isBackCityMap) {
                return;
            }
            // 如果当前是城市地图，点击不需要效果
            if (this.isCityMap && !this.isMunicipalSchool) {
                return;
            }
            this.curPage = 'CITY';
            this.isCityMap = true;
            this.isSchool = false;
            this.isTeacher = false;
            this.isMunicipalSchool = false;
            this.curId = this.curCityId;
            this.myCountyChart && this.myCountyChart.dispose();
            this.columns = this.$comjs.setColumns(this.columns, ['rank'], true);
            this.columns = this.$comjs.setColumns(this.columns, ['districtRank'], false);
            this.columns[2].label = '区/县名称';
            this.updateData();
        },
        // 获取地图
        drawCityMap() {
            const curCity = require('@/assets/echartsMap/' + this.curCityName + '.json');
            let chartDom = document.getElementById('cityMap');
            this.myCityChart = echarts.init(chartDom);
            let option = {};
            echarts.registerMap(this.curCityName, curCity);
            if (!this.isMunicipalSchool) {
                this.curMapTitle = '';
                this.curPage = 'CITY';
                this.showAreaCount = true;
            }
            option = {
                geo: [
                    {
                        tooltip: {
                            show: true,
                        },
                        map: this.curCityName,
                        zoom: 1.09,
                        itemStyle: {
                            // 无操作时
                            normal: {
                                areaColor: '#02325d3d', // 区域颜色
                                shadowOffsetX: 3,
                                shadowOffsetY: 3,
                                borderWidth: 2, // 边框线粗细
                                borderColor: '#02325d3d',
                                shadowColor: '#000000ba',
                                //发光效果
                                shadowBlur: 12,
                            },
                            emphasis: {
                                areaColor: '#02325d3d', //鼠标划上去的时候颜色
                            },
                        },
                        label: {
                            normal: {
                                show: false,
                            },
                            emphasis: {
                                show: false,
                            },
                        },
                    },
                ],
                series: [
                    {
                        type: 'map',
                        zoom: 1.1,
                        top: 42,
                        z: 6,
                        map: this.curCityName,
                        itemStyle: {
                            normal: {
                                areaColor: '#00000000', // 区域颜色
                                borderWidth: 2, // 边框线粗细
                                borderColor: '#B9E0FF',
                                shadowOffsetX: 3,
                                shadowOffsetY: 6,
                                shadowColor: '#02afff',
                                shadowBlur: 5,
                            },
                            emphasis: {
                                areaColor: '#02335d1c', //鼠标划上去的时候颜色
                            },
                        },
                        select: {
                            itemStyle: {
                                areaColor: '#00000000', // 区域颜色
                            },
                            label: {
                                color: '#fff',
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                color: '#fff',
                                fontWeight: 700,
                            },
                            emphasis: {
                                show: true,
                                color: '#fcdc60',
                                fontWeight: 700,
                                fontSize: 16,
                            },
                        },
                    },
                ],
            };
            this.myCityChart.setOption(option, true);
            // 地图点击事件，点击获取当前区县，进行操作
            this.myCityChart.on('click', (params) => {
                // 根据是否存在id判断当前区县下是否存在数据，不存在就不跳转到区县层级
                if (this.curDistrictOrgMap[params.name]) {
                    this.intoCountyMap(params.name, this.curDistrictOrgMap[params.name]);
                } else {
                    this.$message(params.name + '暂无AI课堂分析数据！', 'warning');
                }
            });
            window.addEventListener('resize', () => {
                this.myCityChart.resize();
            });
        },
        // 切换到县级地图
        intoCountyMap(county, id) {
            if (!this.isBackCountyMap) return;
            // 移除省级地图的点击事件，虽然页面不在，但是监听事件依旧会进行
            this.isCityMap = false;
            this.curPage = 'DISTRICT';
            this.curId = id;
            this.curDistrictId = this.curId;
            this.curMapTitle = county;
            this.showAreaCount = false;
            this.isTeacher = false;
            this.isSchool = false;
            this.columns = this.$comjs.setColumns(this.columns, ['rank'], true);
            this.columns = this.$comjs.setColumns(this.columns, ['districtRank'], false);
            this.columns[2].label = '学校名称';
            if (county == '市属校') {
                this.myCountyChart && this.myCountyChart.dispose();
                this.isMunicipalSchool = true;
                this.$nextTick(() => {
                    this.drawCityMap();
                });
            } else {
                this.myCityChart && this.myCityChart.dispose();
                this.isMunicipalSchool = false;
            }
            this.updateData();
        },
        // 获取区县地图
        drawCountyMap() {
            const countyJson = require('@/assets/echartsMap/' + this.curMapTitle + '.json');
            let chartDom = document.getElementById('countyMap');
            this.myCountyChart = echarts.init(chartDom);
            let option = {};
            echarts.registerMap(this.curMapTitle, countyJson);
            option = {
                geo: {
                    tooltip: {
                        show: true,
                    },
                    map: this.curMapTitle,
                    zoom: 1.09,
                    itemStyle: {
                        // 无操作时
                        normal: {
                            areaColor: '#02325d3d', // 区域颜色
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            borderWidth: 2, // 边框线粗细
                            borderColor: '#02325d3d',
                            shadowColor: '#000000ba',
                            //发光效果
                            shadowBlur: 12,
                        },
                        emphasis: {
                            areaColor: '#02325d3d', //鼠标划上去的时候颜色
                        },
                    },
                    label: {
                        show: false,
                    },
                },
                series: [
                    {
                        type: 'map',
                        zoom: 1.1,
                        map: this.curMapTitle,
                        itemStyle: {
                            normal: {
                                areaColor: '#00000000', // 区域颜色
                                borderWidth: 2, // 边框线粗细
                                borderColor: '#B9E0FF',
                                shadowOffsetX: 3,
                                shadowOffsetY: 6,
                                shadowColor: '#02afff',
                                shadowBlur: 5,
                            },
                            emphasis: {
                                areaColor: '#02335d1c', //鼠标划上去的时候颜色
                            },
                        },
                        label: {
                            normal: {
                                show: true, //是否显示省份的名称
                                color: '#ffd133',
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                            emphasis: {
                                show: true,
                                color: '#ffd133',
                            },
                        },
                        select: {
                            disabled: true,
                        },
                    },
                    {
                        name: '数量',
                        // 如果不想要波轮效果，可以设置为scatter
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        map: this.curMapTitle,
                        roam: true,
                        mapLocation: {
                            y: 60,
                        },
                        symbol: 'image://' + require('../../assets/imgs/county-icon.png'),
                        itemStyle: {
                            color: '#b02a02', //图标颜色
                        },
                        //小圆点的大小
                        symbolSize: 15,
                        data: this.schoolData,
                        label: {
                            show: true,
                            formatter: '{b}',
                            padding: [4, 14],
                            position: 'bottom',
                            distance: 3,
                            color: '#fff',
                        },
                    },
                ],
            };
            this.myCountyChart.setOption(option, true);
            this.myCountyChart.on('click', 'series', (params) => {
                // series引入地图，所以点击第二个参数设置series不能限制点击空白处不会触发事件，所以多加一层判断
                if (params.data) {
                    this.intoSchoolPage(params.name, this.curSchoolOrgMap[params.name]);
                }
            });
            window.addEventListener('resize', () => {
                this.myCountyChart.resize();
            });
        },
        /**
         * 左上角下拉变动
         */
        selectChange() {
            this.allRangeText = '';
            this.updateData(true);
            if (this.termRangeText != '') {
                this.allRangeText = '【' + this.termRangeText + '】';
            }
            if (this.dateRangeText != '') {
                this.allRangeText += '【' + this.dateRangeText + '】';
            }
            if (this.courseRangeText != '') {
                this.allRangeText += '【' + this.courseRangeText + '】';
            }
            if (this.gradeRangeText != '') {
                this.allRangeText += '【' + this.gradeRangeText + '】';
            }
        },
        /**
         * 弹窗双图表切换
         * 课堂投放信息与课堂问答的四何分析和教学风格和学习风格
         * @param name 图表名
         */
        changeChart(name) {
            this.curChart = name;
            if (this.FWAnalysisDlg.visible) {
                this.pie1Options = this.createDbDetailPie(this.FWAnalysis_Data.series1);
                this.pie2Options = this.createDbDetailPie(this.FWAnalysis_Data.series2);
                this.$refs.FWAnalysisDlg.updateView(this.pie1Options, this.pie2Options);
            } else if (this.styleDlg.visible) {
                this.pie1Options = this.createDbDetailPie(this.styleAndLearn_Data.series1);
                this.pie2Options = this.createDbDetailPie(this.styleAndLearn_Data.series2);
                this.$refs.styleDlg.updateView(this.pie1Options, this.pie2Options);
            }
        },
        /**
         * 弹窗显示信息判断
         * 查看详情前先判断当前处于那个层级，判断当前要显示的对应层级内容
         * @param ref 弹窗的ref
         */
        setCurShowInfo(ref) {
            if (this.curPage == 'CITY') {
                ref.selectValue = 1;
                ref.selectChange(1, true);
            } else if (this.curPage == 'DISTRICT') {
                ref.selectValue = 2;
                ref.selectChange(2, true);
            } else if (this.curPage == 'SCHOOL') {
                ref.selectValue = 5;
                ref.selectChange(5, true);
            } else if (this.curPage == 'USER') {
                ref.selectValue = 6;
                ref.selectChange(6, true);
            }
        },
        // 教学模式分布-查看详情
        viewTypeDetail() {
            this.classTypeDlg.visible = true;
            this.chartOptions = this.createPie(this.classType_Data, true);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.classTypeDlg);
                this.$refs.classTypeDlg.getTableData(this.getParams());
            });
        },
        // 课堂教学情况-查看详情
        viewTeachDetail() {
            this.classTeachDlg.visible = true;
            this.chartOptions = this.getRadar1Option(true);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.classTeachDlg);
                this.$refs.classTeachDlg.getTableData(this.getParams());
            });
        },
        // 弗兰德斯互动分析-查看详情
        viewFlandersDetail() {
            this.FlandersDlg.visible = true;
            this.chartOptions = this.getRadar2Option(true);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.FlandersDlg);
                this.$refs.FlandersDlg.getTableData(this.getParams());
            });
        },
        // 四何分析-查看详情
        viewFWAnalysisDetail() {
            this.FWAnalysisDlg.visible = true;
            this.curChart = '教师课堂投放信息';
            this.pie1Options = this.createDbDetailPie(this.FWAnalysis_Data.series1);
            this.pie2Options = this.createDbDetailPie(this.FWAnalysis_Data.series2);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.FWAnalysisDlg);
                this.$refs.FWAnalysisDlg.getTableData(this.getParams());
            });
        },
        // 教学风格和学习风格-查看详情
        viewStyleDetail() {
            this.styleDlg.visible = true;
            this.curChart = '教师教学风格';
            this.pie1Options = this.createDbDetailPie(this.styleAndLearn_Data.series1);
            this.pie2Options = this.createDbDetailPie(this.styleAndLearn_Data.series2);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.styleDlg);
                this.$refs.styleDlg.getTableData(this.getParams());
            });
        },
        // IRE互动分析-查看详情
        viewIREAnalysisDetail() {
            this.IREAnalysisDlg.visible = true;
            this.chartOptions = this.createPie(this.IRE_Data, true);
            this.$nextTick(() => {
                this.setCurShowInfo(this.$refs.IREAnalysisDlg);
                this.$refs.IREAnalysisDlg.getTableData(this.getParams());
            });
        },
        // 课堂教学情况-查看趋势分析
        viewTrendDetail() {
            this.trendAnalysisDlg.visible = true;
            this.chartOptions = this.getRadar1Option(true);
            this.$nextTick(() => {
                if (this.curPage == 'CITY') {
                    // 市级
                    this.$refs.trendAnalysisDlg.$refs.detailCount.setCityType();
                } else if (this.curPage == 'DISTRICT') {
                    // 区县
                    this.$refs.trendAnalysisDlg.$refs.detailCount.setCountyType();
                } else if (this.curPage == 'SCHOOL') {
                    // 学校
                    this.$refs.trendAnalysisDlg.$refs.detailCount.setSchoolType();
                } else if (this.curPage == 'USER') {
                    // 教师
                    this.$refs.trendAnalysisDlg.$refs.detailCount.setTeacherType();
                }
                this.$refs.trendAnalysisDlg.getChartData(this.getParams());
            });
        },
        // 课堂教学综合评分排行-查看详情
        viewScoreDetail() {
            this.teachScoreDlg.visible = true;
            this.teachScoreDlg.text = '统计该区域下各教师的课堂教学综合评分平均分、AI课堂数量及教师在区/县排名。';
            this.$nextTick(() => {
                this.$refs.teachScoreDlg.setTeachScoreType();
                this.$refs.teachScoreDlg.getTableData(this.getParams());
            });
        },
        // 课堂教学综合评分分析 - 详情
        viewClassAnalysisDetail() {
            this.classAnalysisDlg.visible = true;
            this.$nextTick(() => {
                this.$refs.classAnalysisDlg.setScoreAnalysisType();
                this.$refs.classAnalysisDlg.getTableData(this.getParams());
                this.$refs.classAnalysisDlg.drawLineChart(this.getParams());
            });
        },
        /**
         * 进入学校层级
         * @param schoolName 学校名
         * @param id 学校id
         */
        intoSchoolPage(schoolName, id) {
            if (!this.isBackSchool) return;
            this.myCityChart && this.myCityChart.dispose();
            this.myCountyChart && this.myCountyChart.dispose();
            this.curSchoolTitle = schoolName;
            this.curPage = 'SCHOOL';
            this.isSchool = true;
            this.isTeacher = false;
            this.isCityMap = false;
            this.isMunicipalSchool = false;
            this.curId = id || this.curSchoolId;
            this.curSchoolId = this.curId;
            this.columns = this.$comjs.setColumns(this.columns, ['rank'], false);
            this.columns = this.$comjs.setColumns(this.columns, ['districtRank'], true);
            this.columns[2].label = '教师名称';
            this.updateData();
        },
        /**
         * 进入教师层级
         * @param row 教师信息
         */
        intoTeacherPage(row) {
            this.myCityChart && this.myCityChart.dispose();
            this.myCountyChart && this.myCountyChart.dispose();
            this.curPage = 'USER';
            this.isCityMap = false;
            this.isMunicipalSchool = false;
            this.isSchool = false;
            this.isTeacher = true;
            this.curUserId = row.id;
            this.curTeacherTitle = row.teacher + (row.subject ? '-' + row.subject : '');
            this.updateData();
        },
        getTeacherDistrictRankingList() {
            let params = this.getParams();
            params['orgId'] = this.curSchoolId;
            this.$axios.get('/ai/bigdata/getTeacherDistrictRankingList', params).then((res) => {
                if (res.data) {
                    this.chartDataList = res.data.courseScoreTrend.chartDataList;
                    this.detailList = res.data.courseScoreTrend.detailList;
                    this.scoreDataList = res.data.courseScoreTrend.scoreDataList;
                    this.$nextTick(() => {
                        this.drawAnalysisLineChart();
                    });
                }
            });
        },
        // 获取当前时间
        getNowTime() {
            let date = new Date();
            this.curDay = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            this.curTime =
                this.addZero(date.getHours()) +
                ':' +
                this.addZero(date.getMinutes()) +
                ':' +
                this.addZero(date.getSeconds());
        },
        addZero(s) {
            return s < 10 ? '0' + s : s;
        },
        // 教师层级-折线图-课堂教学综合评分分析
        drawAnalysisLineChart() {
            let chartDom = document.getElementById('analysisChart');
            this.lineChart = echarts.init(chartDom);
            let symbolImg = 'image://' + require('@/assets/imgs/yellow-icon.png');
            let option = {
                grid: {
                    top: 50,
                    bottom: 60,
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#00000099',
                    textStyle: {
                        fontFamily: 'SourceHanSansCN-Regular',
                        fontSize: 16,
                        color: '#fff',
                    },
                    borderColor: '#99def0',
                    formatter: (params) => {
                        let html = '';
                        html += '<div>';
                        html += '<p>综合评分：' + params[0].value + '</p>';
                        html += '<p>课程名称：《' + this.detailList[params[0].dataIndex] + '》</p>';
                        html += '<p>时间：' + params[0].name + '</p>';
                        html += '</div>';
                        return html;
                    },
                },
                xAxis: {
                    type: 'category',
                    name: '时间',
                    nameTextStyle: {
                        color: '#91CEFF',
                    },
                    data: this.chartDataList,
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
                        fontSize: 12,
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
                        symbolSize: 15,
                        itemStyle: {
                            color: '#FFD12B', //改变折线颜色
                        },
                    },
                ],
            };
            this.lineChart.setOption(option, true);
            window.addEventListener('resize', () => {
                this.lineChart.resize();
            });
        },
        // 当前位置-下拉切换
        changeCurMsg(item) {
            if (this.curPage == 'DISTRICT') {
                this.intoCountyMap(item.name, item.id);
            } else if (this.curPage == 'SCHOOL') {
                this.intoSchoolPage(item.name, item.id);
            } else if (this.curPage == 'USER') {
                this.intoTeacherPage({teacher: item.name, id: item.id});
            }
        },
        // 学期下拉修改
        termSelectChange(valArray) {
            this.termRangeText = '';
            this.termValueText = '';
            valArray.forEach((ite, index) => {
                this.termOptions.find((item) => {
                    if (item.analysisYear == ite[0]) {
                        this.termRangeText += item.analysisYearName + '-';
                        this.termRangeText += item.children.find(
                            (child) => child.analysisYear == ite[1]
                        ).analysisYearName;
                    }
                }) + '-';
                this.termValueText += ite.join('-');
                if (index != valArray.length - 1) {
                    this.termRangeText += ',';
                    this.termValueText += ',';
                }
            });
            this.selectChange();
        },
        // 学科下拉修改
        courseSelectChange(valArray) {
            this.courseRangeText = '';
            valArray.forEach((ite, index) => {
                this.courseRangeText += this.courseOptions.find(
                    (item) => item.analysisSubject == ite
                ).analysisSubjectName;
                if (index != valArray.length - 1) {
                    this.courseRangeText += ',';
                }
            });
            this.courseValueText = valArray.join(',');
            this.selectChange();
        },
        // 年级下拉修改
        gradeSelectChange(valArray) {
            this.gradeRangeText = '';
            this.gradeValueText = '';
            valArray.forEach((ite, index) => {
                this.gradeOptions.find((item) => {
                    if (item.analysisCode == ite[0]) {
                        this.gradeRangeText += item.analysisGradeName + '-';
                        this.gradeRangeText += item.children.find(
                            (child) => child.analysisCode == ite[1]
                        ).analysisGradeName;
                    }
                }) + '-';
                this.gradeValueText += ite[1];
                if (index != valArray.length - 1) {
                    this.gradeRangeText += ',';
                    this.gradeValueText += ',';
                }
            });
            this.selectChange();
        },
        changeDatePicker() {
            this.dateRangeText = '';
            if (this.dateValueArray) {
                this.dateRangeText = this.dateValueArray[0] + '至' + this.dateValueArray[1];
            }
            this.selectChange();
        },
        // 课堂教学综合评分排行
        getClassroomTeachingScoreRankingList() {
            let params = {...this.getParams(), ...this.sortParams};
            params['pageNum'] = 1;
            params['pageSize'] = 50;
            let countDimension = 1;
            if (this.curPage == 'CITY') {
                countDimension = 1;
            } else if (this.curPage == 'DISTRICT') {
                countDimension = 2;
            } else if (this.curPage == 'SCHOOL') {
                countDimension = 5;
            }
            params['countDimension'] = countDimension;
            this.tableLoading = true;
            this.$axios.get('/ai/bigdata/getClassroomTeachingScoreRankingList', params).then((res) => {
                if (res.data) {
                    this.tableData = res.data.pageList;
                    this.tableLoading = false;
                }
            });
        },
        // 点击表格，跳转到下一级
        intoNextPage(name, id) {
            if (this.curPage == 'CITY') {
                // 当前区县名称会显示如“庆阳市镇原县教育局”，无法匹配镇原县，需要通过id对照出name
                let districtName = this.curDistrictNameMap[id];
                this.intoCountyMap(districtName, id);
            } else if (this.curPage == 'DISTRICT') {
                this.intoSchoolPage(name, id);
            } else if (this.curPage == 'SCHOOL') {
                this.intoTeacherPage({teacher: name, id: id});
            }
        },
        /**
         * 弹窗表格跳转
         * @param msg 行数据
         * type：跳转到哪一层级
         * name：当前层级名称
         * id：当前层级id
         * schoolId：学校层级id，用于教师层级，获取当前学校下级教师列表
         * schoolName：学校名称，用于教师层级，显示学校名称
         * regionId：区县id，用于学校层级，获取当前区县下级学校列表
         */
        pageChange(msg) {
            const {type, name, id, schoolId, schoolName, regionId} = msg;
            if (type == 'DISTRICT') {
                // 当前区县名称会显示如“庆阳市镇原县教育局”，无法匹配镇原县，需要通过id对照出name
                let districtName = this.curDistrictNameMap[id];
                this.intoCountyMap(districtName, id);
            } else if (type == 'SCHOOL') {
                this.getSchoolOptions(regionId);
                this.intoSchoolPage(name, id);
                this.getOrgDirectlyUp();
            } else if (type == 'USER') {
                this.intoTeacherPage({teacher: name, id: id});
                this.curId = schoolId;
                this.curSchoolId = schoolId;
                this.getTeacherOptions(schoolId);
                if (schoolName) {
                    this.curSchoolTitle = schoolName;
                }
                this.getOrgDirectlyUp();
            }
        },
        // 当从弹窗跳转到学校层级，获取一下学校的下拉
        getSchoolOptions(id) {
            let params = {};
            params['orgId'] = id;
            params['orgLevel'] = 4;
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            this.$axios.get('/ai/bigdata/getOrgDirectlySub', params).then((res) => {
                this.curSchoolOrgMap = {};
                this.schoolOptions = [];
                res.data.forEach((ite) => {
                    this.curSchoolOrgMap[ite.name] = ite.id;
                    if (!this.noUpdateSchoolOptions) {
                        this.schoolOptions.push({name: ite.name, id: ite.id});
                    }
                });
            });
        },
        // 当从弹窗跳转到教师层级，获取一下教师的下拉
        getTeacherOptions(id) {
            let params = {};
            params['orgId'] = id;
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            this.$axios.get('/ai/bigdata/getOrgAllTeacher', params).then((res) => {
                this.teacherOptions = [];
                res.data.forEach((ite) => {
                    this.teacherOptions.push({name: ite.nickName, id: ite.id});
                });
            });
        },
        getDirectOptions(id) {
            let params = {};
            params['orgId'] = id;
            params['orgLevel'] = 3;
            params['termList'] = this.termValueText;
            params['subjectList'] = this.courseValueText;
            params['gradeList'] = this.gradeValueText;
            this.$axios.get('/ai/bigdata/getOrgDirectlySub', params).then((res) => {
                this.curDistrictOrgMap = {};
                this.countyOptions = [];
                res.data.forEach((ite) => {
                    this.curDistrictOrgMap[ite.name] = ite.id;
                    this.curDistrictNameMap[ite.id] = ite.name;
                    if (!this.noUpdateDistrictOptions) {
                        this.countyOptions.push({name: ite.name, id: ite.id});
                    }
                });
            });
        },
        // 控制按时间/学期筛选
        statisticsSelectChange(val) {
            this.isShowTermSelect = val == 1;
            this.termValue = '';
            this.termValueText = '';
            this.termRangeText = '';
            this.dateValueArray = [];
            this.dateRangeText = '';
            this.selectChange();
        },
    },
};
</script>

<style lang="scss">
.data-board {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: url(../../assets/imgs/dbbg.png) no-repeat;
    background-size: 100% 100%;
    background-color: #03294e;

    .data-board-title {
        width: 100%;
        height: 90px;
        text-align: center;
        font-size: 22px;
        font-weight: 700;
        background: url(../../assets/imgs/tt.png) no-repeat;
        background-size: 100% 100%;
        padding-top: 18px;
        box-sizing: border-box;
        position: relative;

        .text {
            font-family: Source Han Sans CN;
            font-weight: 800;
            font-size: 2rem;
            color: #ffffff;
            line-height: 37px;
            text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
            background: linear-gradient(0deg, rgba(42, 127, 204, 1) 0%, rgba(255, 255, 255, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .select-group {
            width: 50%;
            display: flex;
            position: absolute;
            top: 25px;
            left: 15px;
            box-sizing: border-box;
        }
        .time {
            display: flex;
            position: absolute;
            right: 19px;
            top: 31%;
            align-items: center;

            .time-text {
                font-family: ArialMT;
                font-weight: bold;
                font-size: 18px;
                color: #b9e0ff;

                &:nth-child(1) {
                    margin-right: 19px;
                }
            }
        }
    }
    .board {
        width: 100%;
        height: calc(100% - 90px);
        display: flex;
        justify-content: space-between;
        padding: 0 15px 15px;
        box-sizing: border-box;

        .left-board,
        .right-board,
        .center-board {
            width: 26%;
            height: 100%;
            box-sizing: border-box;

            .board-item {
                width: 100%;
                height: 32%;
                position: relative;
                box-sizing: border-box;
                font-size: 16px;
                background: url('../../assets/imgs/k1.png') no-repeat;
                background-size: 100% 100%;
            }
            .title {
                display: flex;
                color: #fff;
                justify-content: space-between;
                width: 100%;
                box-sizing: border-box;
                padding-top: 2.5%;
                padding-left: 7%;
                padding-right: 3%;
                position: relative;
                overflow: hidden;
                height: 13%;

                .light {
                    position: absolute;
                    top: 72%;
                    transform: translateX(-100%);
                    width: 50%;
                    height: 33%;
                    background: url(../../assets/imgs/guang.png) no-repeat;
                    background-size: 100% 100%;
                    animation: cross 3s infinite;
                    opacity: 0;
                    /* 限制动画元素的绘制区域 */
                    contain: paint;
                    will-change: transform, opacity;
                }

                @keyframes cross {
                    30% {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(200%);
                    }
                }
                .title-name {
                    font-family: SourceHanSansCN-Bold;
                    font-weight: 700;
                }

                .view-detail {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #b9e0ff;
                    font-weight: 400;
                    font-family: SourceHanSansCN-Normal;
                    padding-top: 1%;

                    img {
                        width: 6px;
                        height: 10px;
                        margin-left: 10px;
                    }
                }
                .right-btn {
                    display: flex;

                    .view-trend {
                        margin-right: 18px;
                        margin-top: 1%;
                    }
                }

                .view-trend {
                    width: 96px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    background: url(../../assets/imgs/bt01.png) no-repeat;
                    background-size: 100%;
                    border: 0;
                    color: #fff;
                    font-size: 12px;
                    font-family: Source Han Sans CN;
                }
            }
        }
        .left-board,
        .right-board {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .center-board {
            width: 45%;
            position: relative;

            .current-position {
                background: url(../../assets/imgs/6676.png) no-repeat;
                background-size: 100% 100%;
                height: 4%;
                display: flex;
                align-items: center;
                font-family: Source Han Sans CN;
                font-weight: 400;
                font-size: 16px;
                color: #17b0fc;
                .el-icon-caret-bottom {
                    color: #b9e0ff;
                }
                .el-icon-caret-right {
                    color: #b9e0ff;
                    margin: 0 2px 0 1px;
                }
                .white-text {
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    font-size: 16px;
                    color: #ffffff;
                    cursor: pointer;
                }
                .highlight-text {
                    font-family: Source Han Sans CN;
                    font-weight: bold;
                    font-size: 18px;
                    color: #ffd12b;
                    cursor: pointer;
                }
                img {
                    margin: 0 6px;
                }
            }
            .count {
                display: flex;
                height: 79px;
                flex-wrap: wrap;
                box-sizing: border-box;
                margin-top: 10px;
                justify-content: space-around;

                .count-item {
                    width: 24.5%;
                    height: 100%;
                    box-sizing: border-box;
                    margin-right: 0.5%;
                    position: relative;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    font-size: 14px;
                    color: #b9e0ff;

                    &:last-child {
                        margin-right: 0;
                    }

                    & p:nth-child(2) {
                        font-weight: 700;
                        font-size: 27px;
                        margin-top: 7px;
                        color: #ffffff;
                        font-family: DINCond-Bold;
                    }
                    .icon {
                        position: absolute;
                        top: 0;
                        left: 16px;
                    }
                    .dizuo {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                    }
                    .box {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                    .text {
                        position: absolute;
                        left: 85px;
                        top: 13px;
                    }
                }
            }
            .icon {
                animation: jumpBoxHandler 2.5s linear infinite; /* 2.5s 事件完成时间周期 infinite无限循环 */
                /* 限制动画元素的绘制区域 */
                contain: paint;
                will-change: transform;
            }
            @keyframes jumpBoxHandler {
                50% {
                    transform: translateY(3px); /* 可配置跳动方向 */
                }
                100% {
                    transform: translateY(0px);
                }
            }
            .school-count {
                width: 100%;
                height: 27%;
                background: url('../../assets/imgs/school-bg.png') no-repeat;
                background-size: 100% 100%;
                box-sizing: border-box;
                margin-top: 1%;
                display: flex;

                .img-box {
                    position: relative;
                    left: 4%;
                    top: 8%;
                    width: 444px;
                    height: 82%;
                    margin-right: 20px;
                    overflow: hidden;

                    .school-img {
                        width: 444px;
                        height: 100%;
                    }
                    .light {
                        position: absolute;
                        top: 52%;
                        transform: rotate(45deg);
                        left: -100%;
                        width: 100%;
                        height: 40%;
                        opacity: 0.3;
                        background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0));
                        animation: lightCross 6s infinite;
                        /* 限制动画元素的绘制区域 */
                        contain: paint;
                        will-change: left;
                    }
                    @keyframes lightCross {
                        50% {
                            left: 100%;
                        }
                        100% {
                            left: 100%;
                        }
                    }
                }
                .count-content {
                    width: 40%;
                    height: 90%;
                    margin-top: 1%;

                    .count-item {
                        width: 90%;
                        height: 40%;
                        box-sizing: border-box;
                        margin-right: 0.5%;
                        position: relative;
                        font-family: Source Han Sans CN;
                        font-weight: 400;
                        font-size: 14px;
                        color: #b9e0ff;
                        left: 10%;

                        &:last-child {
                            margin-right: 0;
                        }

                        & p:nth-child(2) {
                            font-weight: 700;
                            font-size: 27px;
                            margin-top: 7px;
                            color: #ffffff;
                            font-family: DINCond-Bold;
                        }
                        .icon {
                            position: absolute;
                            top: 30%;
                            left: 16px;
                        }
                        .dizuo {
                            position: absolute;
                            left: 0;
                            top: 42%;
                        }
                        .box {
                            position: absolute;
                            left: 15%;
                            top: 30%;
                        }
                        .text {
                            position: absolute;
                            left: 85px;
                            top: 40%;
                        }
                    }
                }
            }
            .teacher-count {
                width: 100%;
                height: 60%;
                background: url('../../assets/imgs/a1.png') no-repeat;
                background-size: 100% 100%;
                box-sizing: border-box;
                display: flex;
                margin-top: 2%;
                flex-wrap: wrap;

                .top-box {
                    display: flex;
                    width: 100%;
                    overflow-x: auto;
                    height: 40%;

                    .teacher-img {
                        left: 5%;
                        top: 5%;
                        width: 150px;
                        height: 180px;
                        position: relative;
                        overflow: hidden;
                        margin-right: 3%;

                        img {
                            width: 150px;
                            height: 180px;
                        }

                        .light {
                            position: absolute;
                            top: 32%;
                            left: -100%;
                            width: 200%;
                            height: 40%;
                            opacity: 0.3;
                            background-image: linear-gradient(
                                rgba(0, 0, 0, 0),
                                rgba(255, 255, 255, 0.3),
                                rgba(0, 0, 0, 0)
                            );
                            animation: lightCross 6s infinite;
                            /* 限制动画元素的绘制区域 */
                            contain: paint;
                            transform: rotate(45deg);
                            will-change: left;
                        }
                        @keyframes lightCross {
                            50% {
                                left: 100%;
                            }
                            100% {
                                left: 100%;
                            }
                        }
                    }
                    .count-content {
                        width: 65%;
                        height: 90%;
                        display: flex;
                        flex-wrap: wrap;
                        margin-left: 6%;

                        .count-item {
                            width: 49%;
                            height: 40%;
                            box-sizing: border-box;
                            margin-right: 0.5%;
                            position: relative;
                            font-family: Source Han Sans CN;
                            font-weight: 400;
                            font-size: 14px;
                            color: #b9e0ff;
                            top: 3%;

                            &:last-child {
                                margin-right: 0;
                            }

                            & p:nth-child(2) {
                                font-weight: 700;
                                font-size: 27px;
                                margin-top: 7px;
                                color: #ffffff;
                                font-family: DINCond-Bold;
                            }
                            .icon {
                                position: absolute;
                                top: 30%;
                                left: 16px;
                            }
                            .dizuo {
                                position: absolute;
                                left: 0;
                                top: 45%;
                            }
                            .box {
                                position: absolute;
                                left: 15%;
                                top: 30%;
                                width: 66%;
                            }
                            .text {
                                position: absolute;
                                left: 85px;
                                top: 50%;
                            }
                        }
                    }
                }

                .catchphrase-content {
                    position: relative;
                    width: 90%;
                    height: 50%;
                    top: 3%;

                    .catchphrase-item {
                        text-align: center;
                        position: absolute;
                        font-family: Adobe Heiti Std;
                        font-weight: normal;
                        font-size: 21px;
                        color: #ffffff;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        &:nth-child(1) {
                            left: 40%;
                            top: 18%;
                            font-family: Arial;
                            font-weight: bold;
                            font-size: 52px;
                            width: 160px;
                            height: 160px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(2) {
                            right: 1%;
                            bottom: 3%;
                            width: 117px;
                            height: 117px;
                            font-family: Arial;
                            font-weight: bold;
                            font-size: 38px;
                            animation: ballMoveUp 3.5s infinite;
                        }
                        &:nth-child(3) {
                            left: 10%;
                            top: 5%;
                            width: 100px;
                            height: 100px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(4) {
                            left: 15%;
                            bottom: 8%;
                            width: 100px;
                            height: 100px;
                            animation: ballMoveUp 3.5s infinite;
                        }
                        &:nth-child(5) {
                            right: 25%;
                            top: 5%;
                            width: 100px;
                            height: 100px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(6) {
                            right: 27%;
                            bottom: 5%;
                            width: 100px;
                            height: 100px;
                            animation: ballMoveUp 3.5s infinite;
                        }
                        &:nth-child(7) {
                            right: 18%;
                            bottom: 30%;
                            width: 80px;
                            height: 80px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(8) {
                            left: 31%;
                            top: 5%;
                            width: 80px;
                            height: 80px;
                            animation: ballMoveUp 3.5s infinite;
                        }
                        &:nth-child(9) {
                            left: 31%;
                            top: 65%;
                            width: 80px;
                            height: 80px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(10) {
                            right: 8%;
                            top: 8%;
                            width: 67px;
                            height: 67px;
                            animation: ballMoveUp 3.5s infinite;
                        }
                        &:nth-child(11) {
                            left: 28%;
                            top: 36%;
                            width: 67px;
                            height: 67px;
                            animation: ballMoveDown 3.5s infinite;
                        }
                        &:nth-child(12) {
                            left: 5%;
                            top: 42%;
                            width: 67px;
                            height: 67px;
                            animation: ballMoveUp 3.5s infinite;
                            /* 限制动画元素的绘制区域 */
                            contain: paint;
                            will-change: transform;
                        }
                        span {
                            font-weight: normal;
                            font-size: 14px;
                            left: 35%;
                        }
                        @keyframes ballMoveUp {
                            0% {
                                transform: translate(0px, 0px);
                            }
                            50% {
                                transform: translate(0px, -5px);
                            }
                            100% {
                                transform: translate(0px, 0px);
                            }
                        }
                        @keyframes ballMoveDown {
                            0% {
                                transform: translate(0px, 0px);
                            }
                            50% {
                                transform: translate(0px, 5px);
                            }
                            100% {
                                transform: translate(0px, 0px);
                            }
                        }
                    }
                }
            }
            .analysis-trend {
                width: 100%;
                height: 32%;
                background: url('../../assets/imgs/k.png') no-repeat;
                background-size: 100% 100%;
                margin-top: 2%;

                #analysisChart {
                    height: 90%;
                    width: 100%;
                }
                .title {
                    padding-top: 1.4%;
                    padding-left: 4%;

                    .view-detail {
                        padding-top: 0.5%;
                    }
                }
            }
            .map-chart {
                width: 70%;
                height: 57%;
                margin: 0 auto;
                margin-top: -12px;
                position: relative;

                #cityMap,
                #countyMap {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 99;
                    animation: scaleMap 5s linear infinite;
                    /* 限制动画元素的绘制区域 */
                    contain: paint;
                    will-change: transform;
                }
                .bg-img {
                    width: 100%;
                    height: 100%;
                    background: url('../../assets/imgs/map_bg.png') no-repeat;
                    background-size: 100% 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }
                #cityMap:hover,
                #countyMap:hover {
                    // 鼠标移入时暂停动画
                    animation-play-state: paused;
                }
            }
            @keyframes scaleMap {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.03);
                }
                100% {
                    transform: scale(1);
                }
            }
            .table {
                height: 32%;
                box-sizing: border-box;
                background: url('../../assets/imgs/k.png') no-repeat;
                background-size: 100% 100%;
                position: absolute;
                bottom: 0;
                width: 100%;
                z-index: 999;

                .title {
                    padding-top: 1.4%;
                    padding-left: 4%;
                    height: 13%;

                    .view-detail {
                        padding-top: 0.5%;
                    }
                }
                .common-table {
                    width: 92%;
                }
            }
        }
        .my-char {
            width: 100%;
            height: 87%;
        }
        #pieChart1,
        #pieChart4 {
            background: url(../../assets/imgs/circle.png) no-repeat;
            background-position: 49.5% 40%;
            background-size: 48%;
        }
        #pieChart2,
        #pieChart3 {
            z-index: 99;
        }
        .board-item5,
        .board-item4 {
            position: relative;

            .bg-content-left {
                width: 46%;
                height: 70%;
                position: absolute;
                top: 18%;
                left: 13px;
                background: url(../../assets/imgs/xxk.png) no-repeat;
                background-size: 100% 100%;
            }
            .bg-content-right {
                width: 46%;
                height: 70%;
                position: absolute;
                top: 18%;
                right: 12px;
                background: url(../../assets/imgs/xxk.png) no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    .underline-text {
        text-decoration: underline;
        cursor: pointer;
    }
    .btn {
        cursor: pointer;
    }
}
.el-table {
    .sort-caret.ascending {
        border-bottom-color: #b9e0ff;
    }
    .sort-caret.descending {
        border-top-color: #b9e0ff;
    }
}

.el-cascader {
    line-height: 30px;

    .el-cascader-menu__list {
        background-color: #000000e6;
    }
}
.el-cascader__dropdown {
    border-color: #17b0fc8f;
    background-color: #000000d9;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;

    .el-cascader-menu {
        border-color: #17b0fc8f;
        color: #b9e0ff;
    }
    .el-cascader-node:not(.is-disabled):hover {
        background-color: #017feb4d;
    }
    .el-cascader-node:not(.is-disabled):focus,
    .el-cascader-node:not(.is-disabled):hover {
        background-color: #017feb4d;
    }
    .el-checkbox__inner {
        background-color: #000000e6;
        border-color: #17b0fc8f;
    }
}
.el-cascader__tags {
    flex-wrap: nowrap;
    overflow: hidden;
    .el-tag {
        width: 90%;
        background: transparent;
        color: #ffffff;
        font-family: Source Han Sans CN;
        font-size: 14px;

        .el-icon-close {
            margin-top: 3px;
        }
    }
}
.el-select__tags {
    flex-wrap: nowrap;
    overflow: hidden;

    .el-tag.el-tag--info {
        background-color: transparent;
        color: #ffffff;
        font-family: Source Han Sans CN;
        font-size: 14px;
        border: none;
    }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    background-color: #017feb4d;
    color: #fff;
}

.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
    color: #b9e0ff;
    font-weight: 400;
    background-color: #017feb4d;
}
.el-popper[x-placement^='bottom'] .popper__arrow {
    border-bottom-color: #17b0fc8f;

    &::after {
        border-bottom-color: #000000d9;
    }
}
.el-avatar,
.el-cascader-panel,
.el-radio,
.el-radio--medium.is-bordered .el-radio__label,
.el-radio__label {
    font-size: 16px;
}
/*滚动条凹槽的颜色，还可以设置边框属性 */
::-webkit-scrollbar-track-piece {
    background-color: #072847;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
/*滚动条的设置*/
::-webkit-scrollbar-thumb {
    background-color: #17b0fc80;
    background-clip: padding-box;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 0;
}
/*滚动条鼠标移上去*/
::-webkit-scrollbar-thumb:hover {
    background-color: #17b0fc80;
}
/*横竖滚动条都有的时候，右下角有一块白色的*/
*::-webkit-scrollbar-corner {
    background: #072847;
}

/* 横向滚动条不显示 */
.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
}
</style>

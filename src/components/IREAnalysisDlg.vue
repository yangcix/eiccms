<template>
    <el-dialog :visible.sync="detailDlg.visible" width="100%" v-if="detailDlg.visible" :show-close="false">
        <div slot="title" class="dialog-title">
            <div>
                <span>{{ detailDlg.title }}</span>
                <el-tooltip
                    :content="detailDlg.text"
                    placement="bottom-start"
                    popper-class="tooltip-content"
                    class="tooltip-icon"
                >
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
            :aiBase="aiBase"
            @selectChange="selectChange"
            :isSinglePie="true"
        ></detailCount>
        <div class="bottom-content">
            <div class="statistics">
                <p class="sec-title">统计情况</p>
                <div class="select-group" v-show="showFilter">
                    <div class="rect-left">
                        <div class="white-rect"></div>
                        <div class="blue-rect"></div>
                    </div>
                    <el-select
                        v-model="selectValue"
                        @change="selectChange"
                        v-show="showSelect"
                        popper-class="statistics_select"
                    >
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
                    <el-input
                        :placeholder="inputPlaceholder"
                        v-model="inputValue"
                        suffix-icon="el-icon-search"
                        v-show="showInput"
                        @change="changeInput"
                        :clearable="true"
                    >
                    </el-input>
                    <div class="rect-right" v-show="showInput">
                        <div class="blue-rect"></div>
                        <div class="white-rect"></div>
                    </div>
                </div>
            </div>
            <commonTable
                :columns="columns"
                :tableData="tableData"
                :showPage="true"
                :pageInfo="pageInfo"
                :stripe="true"
                :getTableData="getTableData"
                :sortParams="sortParams"
            >
                <template #slotColumn="{row, column}">
                    <div
                        v-if="column.prop == 'regionPath'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.regionPath }}
                    </div>
                    <div
                        v-if="column.prop == 'schoolName'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.schoolName }}
                    </div>
                    <div
                        v-if="column.prop == 'teacherName'"
                        class="underline-text"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.teacherName }}
                    </div>
                    <div
                        v-if="column.prop == 'name'"
                        :class="{'underline-text': selectValue != 3 && selectValue != 4}"
                        @click="clickRowLine(row, column.prop)"
                    >
                        {{ row.name }}
                    </div>
                    <!-- 市级/区县级「按区/县统计」时，AI课堂数加对应区县基数 -->
                    <div v-if="column.prop == 'aiClassCount'">
                        {{ getAiClassCount(row) }}
                    </div>
                </template>
            </commonTable>
        </div>
    </el-dialog>
</template>

<script>
import detailCount from '@/components/detailCount';
import commonTable from '@/components/commonTable.vue';
export default {
    components: {
        detailCount,
        commonTable,
    },
    props: {
        countList: {
            type: Object,
            default: () => {
                return {};
            },
        },
        // 当前层级 AI课堂数量基数，由父组件传入
        aiBase: {
            type: Number,
            default: 0,
        },
        // 区县基数映射，由父组件传入，用于市级详情页列表
        baseMap: {
            type: Object,
            default: () => ({district: {}}),
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
        // 市级/区县级隐藏统计情况旁的过滤项；学校/教师保留
        showFilter: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            columns: [
                // 不设置宽度会自动填补表格剩余宽度
                {prop: 'name', label: '课程名称', slot: true, minWidth: '130'},
                {prop: 'teacherName', label: '教师名称', slot: true, isShow: false},
                {prop: 'schoolName', label: '学校名称', slot: true, isShow: false, minWidth: '130'},
                {prop: 'regionPath', label: '所在地区', slot: true, minWidth: '280'},
                {prop: 'courseTypeName', label: '课堂类型', isShow: false},
                {prop: 'subjectName', label: '学科名称', isShow: false},
                {prop: 'gradeName', label: '年级名称', isShow: false, minWidth: '100'},
                {prop: 'teacherCount', label: '参与教师数', sortable: 'custom'},
                {prop: 'aiClassCount', label: 'AI课堂数', sortable: 'custom', slot: true},
                {prop: 'simpleQuestionRatio', label: '简单型', width: '110', sortable: 'custom', suffix: '%'},
                {prop: 'followUpQuestionRatio', label: '追问型', width: '110', sortable: 'custom', suffix: '%'},
                {prop: 'thinkAgainQuestionRatio', label: '思考再答型', width: '130', sortable: 'custom', suffix: '%'},
                {prop: 'startTime', label: '上课时间', isShow: false, sortable: 'custom', minWidth: '180'},
            ],
            tableData: [],
            pageInfo: {
                total: 0,
                size: 10,
                index: 1,
            },
            selectValue: 1,
            optionArray: [],
            allOptionArray: [
                {value: 1, label: '按区/县统计'},
                {value: 2, label: '按学校统计'},
                {value: 3, label: '按学科统计'},
                {value: 4, label: '按年级统计'},
                {value: 5, label: '按教师统计'},
                {value: 6, label: '按课程统计'},
            ],
            inputPlaceholder: '',
            showInput: false,
            inputValue: '',
            showSelect: true,
            defaultParams: {},
            isFirstEnter: true,
            sortParams: {},
            initialValue: 1,
        };
    },
    methods: {
        getTableData(params) {
            this.$comjs.getDlgTableData(params, '/ai/bigdata/getIREInteractionStatsList', this);
        },
        // 区县基数匹配
        getDistrictBase(name) {
            if (!name) return 0;
            const map = (this.baseMap && this.baseMap.district) || {};
            if (map[name] !== undefined) return map[name];
            if (name.includes('市属校') || name.includes('庆阳市直属')) {
                return map['庆阳市直属'] || 0;
            }
            // 按 key 长度降序匹配，避免“正宁县”被“宁县”误匹配
            const keys = Object.keys(map).sort((a, b) => b.length - a.length);
            for (let key of keys) {
                if (name.includes(key)) {
                    return map[key];
                }
            }
            return 0;
        },
        // 列表 AI课堂数展示
        // 市级、区县级「按区/县统计」时，行是区县，加对应区县基数；
        // 其他维度、学校/教师层级不加基数
        getAiClassCount(row) {
            const origin = Number(row.aiClassCount) || 0;
            if (this.aiBase <= 0 || this.selectValue !== 1) {
                return origin;
            }
            return origin + this.getDistrictBase(row.name);
        },
        operateColumns(val) {
            let showColumnsArray = [];
            let hiddenColumnsArray = [];
            // 学校 || 教师 || 课程 需要显示搜索框
            if (val == 2 || val == 5 || val == 6) {
                if (val == 2) {
                    showColumnsArray = ['regionPath', 'teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '学校名称';
                } else if (val == 5) {
                    showColumnsArray = ['schoolName', 'regionPath', 'subjectName', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'teacherName',
                        'teacherCount',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '教师名称';
                } else if (val == 6) {
                    showColumnsArray = [
                        'teacherName',
                        'schoolName',
                        'regionPath',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    hiddenColumnsArray = ['teacherCount', 'aiClassCount'];
                    this.columns[0].label = '课程名称';
                }
            } else {
                if (val == 1) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '区/县名称';
                } else if (val == 3) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '学科名称';
                } else if (val == 4) {
                    showColumnsArray = ['teacherCount', 'aiClassCount'];
                    hiddenColumnsArray = [
                        'schoolName',
                        'regionPath',
                        'teacherName',
                        'subjectName',
                        'gradeName',
                        'classType',
                        'courseTypeName',
                        'startTime',
                    ];
                    this.columns[0].label = '年级名称';
                }
            }
            this.columns = this.$comjs.setColumns(this.columns, showColumnsArray, true);
            this.columns = this.$comjs.setColumns(this.columns, hiddenColumnsArray, false);
            // 根据层级判断列的显示隐藏
            this.columns = this.$comjs.setColumnsOperate(this.initialValue, this);
        },
        clickRowLine(row, prop) {
            let msg = this.$comjs.clickRowLine(row, prop, this);
            if (msg) {
                this.$emit('pageChange', msg);
                // 课程跳转，弹窗不关闭
                this.$comjs.closeDlg(this);
            }
        },
        closeDlg() {
            this.$comjs.closeDlg(this);
        },
        selectChange(val, isFirstEnter) {
            this.$comjs.staticSelectChange(val, this, isFirstEnter);
        },
        changeInput(val) {
            this.$comjs.staticInputChange(val, this);
        },
    },
};
</script>

<style lang="scss"></style>

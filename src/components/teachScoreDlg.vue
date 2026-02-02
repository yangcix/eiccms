<template>
    <el-dialog
        :visible.sync="detailDlg.visible"
        width="100%"
        v-if="detailDlg.visible"
        :show-close="false"
        class="teach-score-dlg"
    >
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
            :options="{}"
            :isOnlyCount="true"
        ></detailCount>
        <div class="bottom-content">
            <div class="statistics">
                <p class="sec-title">统计情况</p>
                <div class="select-group">
                    <div class="rect-left">
                        <div class="white-rect"></div>
                        <div class="blue-rect"></div>
                    </div>
                    <el-input
                        placeholder="请输入教师名称"
                        v-model="inputValue"
                        suffix-icon="el-icon-search"
                        @change="changeInput"
                        :clearable="true"
                    >
                    </el-input>
                    <div class="rect-right">
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
                :showIndex="false"
                :getTableData="getTableData"
                :sortParams="sortParams"
            >
                <template #header="{column}">
                    <div v-if="column.prop == 'districtRank'">
                        {{ column.label
                        }}<el-tooltip content="教师在区/县范围内的排名" placement="top" popper-class="tooltip-content">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </div>
                </template>
                <template #slotColumn="{row, column}">
                    <div v-if="column.prop == 'districtRank'" class="column-index">
                        <img src="../assets/imgs/1.png" alt="" v-if="row.districtRank == 1" />
                        <img src="../assets/imgs/2.png" alt="" v-else-if="row.districtRank == 2" />
                        <img src="../assets/imgs/3.png" alt="" v-else-if="row.districtRank == 3" />
                        <span v-else>{{ row.districtRank }}</span>
                    </div>
                    <div v-if="column.prop == 'name'" class="underline-text" @click="clickRowLine(row, column.prop)">
                        {{ row.name }}
                    </div>
                    <div v-if="column.prop == 'classroomScore'" class="classroom-score">
                        <el-progress
                            :percentage="parseFloat(row.classroomScore)"
                            :color="
                                row.districtRank == '1'
                                    ? '#FE4C4C'
                                    : row.districtRank == '2'
                                    ? '#ba9100'
                                    : row.districtRank == '3'
                                    ? '#29CF73'
                                    : '#17b0fc'
                            "
                            :define-back-color="
                                row.districtRank == '1'
                                    ? '#FE4C4C33'
                                    : row.districtRank == '2'
                                    ? '#ba910033'
                                    : row.districtRank == '3'
                                    ? '#29cf7333'
                                    : '#17b0fc33'
                            "
                            :style="{
                                'border-color':
                                    row.districtRank == '1'
                                        ? '#FE4C4C80'
                                        : row.districtRank == '2'
                                        ? '#ba910080'
                                        : row.districtRank == '3'
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
    },
    data() {
        return {
            columns: [
                {prop: 'districtRank', label: '区/县排名', width: '150', align: 'center', slot: true, slotHeader: true},
                {prop: 'name', label: '教师名称', slot: true, align: 'center'},
                {prop: 'aiClassCount', label: 'AI课堂数', width: '250', align: 'center', sortable: 'custom'},
                {prop: 'classroomScore', label: '课堂评分', slot: true, align: 'center', sortable: 'custom'},
            ],
            tableData: [],
            pageInfo: {
                total: 0,
                size: 10,
                index: 1,
            },
            inputValue: '',
            defaultParams: {},
            selectValue: 5,
            sortParams: {},
        };
    },
    methods: {
        getTableData(params) {
            this.$comjs.getDlgTableData(params, '/ai/bigdata/getClassroomTeachingScoreRankingList', this);
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
        changeInput(val) {
            this.$comjs.staticInputChange(val, this);
        },
        setTeachScoreType() {
            this.$refs.detailCount.setSchoolType();
        },
    },
};
</script>

<style lang="scss"></style>

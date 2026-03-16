<template>
    <div class="common-table">
        <el-table
            :data="newTableData"
            height="100%"
            :border="border"
            v-if="reFreshTable"
            :stripe="stripe"
            @sort-change="handleSortChange"
            v-loading="loading"
            element-loading-text="数据加载中..."
            element-loading-spinner="el-icon-loading"
        >
            <el-table-column type="selection" width="55" v-if="isShowSelection"> </el-table-column>
            <el-table-column
                type="index"
                :width="indexColumnWidth"
                v-if="showIndex"
                :index="setTableIndex"
                align="center"
                label="序号"
            >
            </el-table-column>
            <el-table-column
                v-for="(column, index) in newColumns"
                :key="index"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :align="column.align ? column.align : 'left'"
                :sortable="column.hasOwnProperty('sortable') ? column.sortable : false"
                :render-header="renderHeader"
                :class-name="getColumnClassName(column)"
                :show-overflow-tooltip="column.hiddenOverflowTooltip || true"
            >
                <!-- 表头 -->
                <span slot="header" slot-scope="scope">
                    <!-- 插槽自定义表头 -->
                    <template v-if="column.slotHeader">
                        <slot name="header" :rowIndex="scope.$index" :column="column"></slot>
                    </template>
                    <template v-else>
                        <span>{{ column.label }}</span>
                    </template>
                </span>

                <template slot-scope="scope">
                    <template v-if="column.slot">
                        <slot name="slotColumn" :row="scope.row" :rowIndex="scope.$index" :column="column"></slot>
                    </template>
                    <template v-else>
                        <span>{{ scope.row[column.prop] }}</span>
                    </template>
                    <label v-if="isShowSuffix(column, scope.row)">{{ column.suffix }}</label>
                </template>
                <!-- 多级表头 -->
                <el-table-column
                    v-for="(mulColumn, idx) in column?.mulHead"
                    :key="idx"
                    :prop="mulColumn['prop']"
                    :label="mulColumn['label']"
                    :width="mulColumn['width'] ? mulColumn['width'] : 100"
                    :align="column['align'] ? column['align'] : 'left'"
                    :sortable="mulColumn['sortable'] ? mulColumn['sortable'] : false"
                >
                    <!-- 表头 -->
                    <span slot="mulHeader" slot-scope="scope">
                        <!-- 插槽自定义表头 -->
                        <template v-if="mulColumn.slotHeader">
                            <slot name="mulHeader" :rowIndex="scope.$index" :mulColumn="mulColumn"></slot>
                        </template>
                        <template v-else>
                            <span>{{ mulColumn.label }}</span>
                        </template>
                    </span>
                    <template slot-scope="scope">
                        <template v-if="mulColumn.slot">
                            <slot
                                name="slotMulColumn"
                                :row="scope.row"
                                :rowIndex="scope.$index"
                                :column="mulColumn"
                            ></slot>
                        </template>
                        <template v-else>
                            <span>{{ scope.row[mulColumn.prop] }}</span>
                        </template>
                        <label v-if="isShowSuffix(mulColumn, scope.row)">{{ mulColumn.suffix }}</label>
                    </template>
                </el-table-column>
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column
                v-if="operates"
                align="center"
                label="操作"
                :width="operates['width'] ? operates['width'] : 100"
            >
                <template slot-scope="scope">
                    <div :class="operates.className ? operates.className : 'operate-group'">
                        <template v-for="(btn, index) in getBtnList(scope.row)">
                            <el-button
                                :type="btn.type"
                                :disabled="btn.disabled ? btn.disabled(scope.row) : false"
                                @click="btn.handleClick(scope.row, scope.$index)"
                                class="operate-btn"
                                >{{ btn.label }}</el-button
                            >
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="showPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.total"
            :page-size="pageInfo.size"
            :current-page="pageInfo.index"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            :page-sizes="[10, 20, 50, 100]"
            popper-class="statistics_select"
        ></el-pagination>
    </div>
</template>
<script>
export default {
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            default: () => [],
        },
        border: {
            type: Boolean,
            default: false,
        },
        showIndex: {
            type: Boolean,
            default: true,
        },
        isShowSelection: {
            type: Boolean,
            default: false,
        },
        showPage: {
            type: Boolean,
            default: false,
        },
        maxHeight: {
            type: Number,
            default: 700,
        },
        pageInfo: {
            type: Object,
            default: () => {
                return {
                    total: 0,
                    size: 20,
                    index: 1,
                };
            },
        },
        operates: {
            type: Object,
            default: () => {},
        },
        indexColumnWidth: {
            type: String,
            default: '80',
        },
        stripe: {
            type: Boolean,
            default: false,
        },
        renderHeader: {
            type: Function,
            default: null,
        },
        getTableData: Function,
        sortParams: {
            type: Object,
        },
        isRemoteSort: {
            type: Boolean | 'custom',
            default: true, // 默认后端排序
        },
        //是否后台分页
        remotePaging: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            newColumns: [],
            reFreshTable: true,
        };
    },
    mounted() {
        this.getNewColumns();
    },
    computed: {
        getBtnList() {
            return function (row) {
                return this.operates.list.filter((btn) => !btn.hasOwnProperty('isShow') || btn.isShow(row));
            };
        },
        getShowColumns() {
            return this.columns.filter((col) => !col.hasOwnProperty('isShow') || col.isShow);
        },
        newTableData() {
            if (this.remotePaging) {
                return this.tableData;
            } else {
                let pageIndex = this.pageInfo.pageIndex;
                let pageSize = this.pageInfo.pageSize;
                return this.tableData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
            }
        },
        getColumnClassName() {
            return function (column) {
                let className = [];
                if (!column.hiddenOverflowTooltip) {
                    className.push('overflow-hidden-column');
                }
                return className.join(' ');
            };
        },
        isShowSuffix() {
            return function (column, row) {
                let value = row[column.prop];
                return column.suffix && value && value !== 0;
            };
        },
    },
    methods: {
        handlePageChange(currentPage) {
            this.pageInfo.index = currentPage;
            this.getTableData();
        },
        setTableIndex(index) {
            return index + 1 + (this.pageInfo.index - 1) * this.pageInfo.size;
        },
        getNewColumns() {
            let curData = [];
            let originColumn = this.columns;
            originColumn.forEach((col) => {
                if (!col.hasOwnProperty('isShow') || col.isShow) {
                    curData.push(col);
                }
            });
            this.newColumns = curData;
            // 如果没有reloadTable，假如有列显示隐藏变化，会导致列显示错位
            this.reloadTable();
        },
        reloadTable() {
            this.reFreshTable = false;
            this.$nextTick(() => {
                this.reFreshTable = true;
            });
        },
        handleSizeChange(size) {
            this.pageInfo.size = size;
            this.getTableData();
        },
        /**
         * 排序
         * 只有当column.sortable == 'custom'的时候自定义排序方式才会生效，所以一旦需要后端排序和自定义排序sortable都要设置为custom
         * 当isRemoteSort为true时启用远程排序;为custom时启用自定义排序方式
         * @param {*} column 列信息
         * @param {*} prop 排序字段
         * @param {*} order 排序方式
         */
        handleSortChange({column, prop, order}) {
            if (!column) return;
            this.$emit('handleSortChange', column, prop, order);
            // 需要sortable设置为custom
            if (column.sortable != 'custom') {
                return;
            }
            if (this.isRemoteSort == 'custom') {
                return this.goCustomSortMethod(column, prop, order);
            } else if (this.isRemoteSort == true) {
                //远程排序
                // 升序
                if (order === 'ascending') {
                    this.sortParams['sortField'] = prop;
                    this.sortParams['sorType'] = 1;
                    return this.getTableData();
                }
                // 降序
                if (order === 'descending') {
                    this.sortParams['sortField'] = prop;
                    this.sortParams['sorType'] = 0;
                    return this.getTableData();
                }
            }
        },
        goCustomSortMethod(column, prop, order) {
            this.tableData.sort((x, y) => {
                if (y.topping == x.topping) {
                    let xtype = typeof x[prop];
                    let ytype = typeof y[prop];
                    if (xtype === 'string' && ytype === 'string') {
                        if (order === 'ascending') {
                            return (x[prop] != null) - (y[prop] != null) || x[prop].localeCompare(y[prop]);
                        }
                        if (order === 'descending') {
                            return (y[prop] != null) - (x[prop] != null) || y[prop].localeCompare(x[prop]);
                        }
                    } else {
                        x[prop] = !this.$comjs.isEmpty(x[prop]) ? parseFloat(x[prop]) : '';
                        y[prop] = !this.$comjs.isEmpty(y[prop]) ? parseFloat(y[prop]) : '';
                        if (order === 'ascending') {
                            return (x[prop] != null) - (y[prop] != null) || x[prop] - y[prop];
                        }
                        if (order === 'descending') {
                            return (y[prop] != null) - (x[prop] != null) || y[prop] - x[prop];
                        }
                    }
                }
                return y.topping - x.topping;
            });
            if (this.getTableData) {
                return this.getTableData();
            }
        },
    },
    watch: {
        columns: {
            handler: function () {
                this.getNewColumns();
            },
            deep: true,
        },
    },
};
</script>
<style lang="scss">
.common-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    height: 691px;
    width: 100%;
    overflow: hidden;
    
    .operate-btn {
        margin-right: 10px;
        height: 30px;
        font-size: 12px;
        line-height: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .el-table__empty-block {
        width: 100% !important;
    }
    th.el-table__cell > .cell {
        padding: 0;
        height: 34px;
        line-height: 34px;
    }
    td {
        .cell {
            padding: 0;
        }
        &.overflow-hidden-column {
            .cell {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                // 如果是slot，自定义节点为div，就要加一层样式才能生效
                div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
    /* 强制显示滚动条 */
    .el-table__body-wrapper {
        overflow-x: auto !important;
        overflow-y: auto !important;
    }

    /* 确保表头也同步滚动 */
    .el-table__header-wrapper {
        overflow-x: hidden !important;
    }
}
.operate-group {
    height: 24px;
    text-align: center;
    display: flex;

    .el-button {
        padding: 5px 0px;
        border-color: transparent !important;
        background-color: transparent !important;
    }
    .el-button--text {
        color: #409eff;
    }
    .el-button--danger {
        color: #f56c6c;
    }
    .el-button--text.is-disabled,
    .el-button--danger.is-disabled {
        color: #c0c4cc;
    }
}
</style>

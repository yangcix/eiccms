<template>
    <div
        class="content-main-wrap"
        v-if="aiType == 2 && aiOpenStatus == 1 && feeModel == 1 && (userId === 1 || userId === 2)"
    >
        <p class="content-title">AI分析次数充值</p>
        <div class="main-wrap" style="margin-left: 2px">
            <template>
                <div class="introduce">
                    <span style="margin-right: 15px; font-weight: bold">AI课堂分析剩余次数：{{ count + '次' }}</span>
                    <span style="font-weight: bold">大单元分析次数: {{ largeUnitCount + '次' }}</span>
                    <el-button type="primary" class="content" @click="AIRechargeShow = true" v-if="userId === 1"
                        >充值</el-button
                    >
                </div>
            </template>
            <el-dialog
                class="recharge"
                title="AI分析次数充值"
                :close-on-click-modal="false"
                :visible.sync="AIRechargeShow"
                width="500px"
                @close="cancel()"
            >
                <div class="popUp">
                    <em class="custom">*</em><span class="span-title">充值产品</span>
                    <el-select class="input" v-model.trim="products">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="popUp">
                    <em class="custom">*</em><span class="span-title">充值次数</span>
                    <el-input
                        class="input"
                        v-model="number"
                        placeholder="输入充值次数"
                        @input="(v) => (number = v.replace(/[^0-9]/g, ''))"
                        @blur="defocus()"
                    />
                    <!-- <el-input class="input" type="number" placeholder="输入充值次数" v-model.number="number" /> -->
                </div>
                <div class="popUp">(注：请根据购买情况合理充值！)</div>
                <div style="padding: 30px 0px 10px 0px; display: flex; justify-content: right">
                    <el-button @click="cancel()" style="margin-right: 10px">取 消</el-button>
                    <el-button type="primary" @click="save()" style="margin-right: 10px">确 定</el-button>
                </div>
            </el-dialog>
            <div class="data-table table-border">
                <el-table v-loading="loading" :data="tableData" style="width: 100%; min-width: 900px">
                    <el-table-column prop="products" align="center" label="充值产品"> </el-table-column>
                    <el-table-column prop="number" align="center" label="充值次数">
                        <template slot-scope="scope">
                            <span style="color: darkseagreen; font-weight: bold">
                                {{ scope.row.number }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="residue" align="center" label="剩余未消耗">
                        <template slot-scope="scope">
                            <span style="font-weight: bold">
                                {{ scope.row.residue }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" align="center" label="充值时间"> </el-table-column>
                    <el-table-column prop="invalidTime" align="center" label="失效时间"> </el-table-column>
                </el-table>
            </div>
            <div class="table-page">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :page-count="pages"
                    :current-page="pageNum"
                >
                </el-pagination>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="null-data">
            <img src="../../../assets/imgs/home-null.png" alt="" />
            <p>暂无访问权限</p>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            AIRechargeShow: false,
            userId: JSON.parse(localStorage.getItem('userInfo'))
                ? JSON.parse(localStorage.getItem('userInfo')).userId
                : '',
            aiType: JSON.parse(localStorage.getItem('sysInfo')).aiConfigId
                ? JSON.parse(localStorage.getItem('sysInfo')).aiConfigId
                : 1,
            aiOpenStatus: JSON.parse(localStorage.getItem('sysInfo'))
                ? JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus
                : 0,
            feeModel: JSON.parse(localStorage.getItem('sysInfo'))
                ? JSON.parse(localStorage.getItem('sysInfo')).type
                : 1,
            products: 1,
            number: '',
            count: 0,
            largeUnitCount: 0,
            residue: '',
            time: '',
            totalS: '',
            tableData: [],
            pageNum: 1,
            pages: 0,
            loading: false, // 表格加载
            options: [
                {
                    value: 1,
                    label: 'AI课堂分析（教师版&专业版）',
                },
                {
                    value: 2,
                    label: '大单元分析',
                },
            ],
            value: '',
        };
    },
    mounted() {
        if (this.userId === 1 || this.userId === 2) {
            this.getList();
            this.getAiNum();
        }
    },
    methods: {
        cancel() {
            this.AIRechargeShow = false;
            this.number = '';
            this.products = 1;
        },
        defocus() {
            if (this.number) {
                this.number = parseInt(this.number);
            }
        },
        save() {
            if (this.$verify.isEmpty(this.number)) {
                this.$message('充值次数不能为空', 'error');
                return;
            }
            if (this.number <= 0) {
                this.$message('请填写正整数', 'error');
                return;
            }
            if (this.number > 9999) {
                this.$message('充值次数不得超过4位数！', 'error');
                this.number = '';
                return;
            }
            let params = new FormData();
            params.append('products', this.products);
            params.append('number', this.number);
            this.$axios.post('/aiRecharge/save', params).then((res) => {
                if (res.code === 200) {
                    this.$message(res.message ? res.message : '充值成功', 'success');
                    this.AIRechargeShow = false;
                    this.clearData();
                    this.getAiNum();
                    this.getList();
                }
            });
        },
        //获取充值列表
        getList() {
            if (this.aiOpenStatus == 0) {
                this.$router.push('/aiConfig');
                this.$message('请先开启AI配置后访问！', 'error');
                return;
            }
            console.log('收费模式', this.feeModel);
            if (this.feeModel == 2) {
                this.$router.push('/aiConfig');
                this.$message('收费模式为不按量收费，无需充值！', 'error');
                return;
            }
            this.loading = true; // 表格加载
            let data = {
                pageNum: this.pageNum,
                pageSize: 10,
            };
            this.$axios.get('/aiRecharge/list', data).then((res) => {
                if (res.code === 200) {
                    this.loading = false; // 表格加载
                    this.tableData = res.data.pageList;
                    this.pages = res.data.pages;
                    this.totalS = res.data.total;
                }
                // else{
                //   this.$router.push("/aiConfig")
                // }
            });
        },
        //搜索
        search() {
            this.pageNum = 1;
            this.getList();
        },
        //分页点击
        pageChange(val) {
            this.pageNum = val;
            this.getList();
        },
        //获取总分析次数
        getAiNum() {
            this.$axios.get('/aiRecharge/countAll').then((res) => {
                this.count = res.data.aiClassAll === undefined ? 0 : res.data.aiClassAll;
                this.largeUnitCount = res.data.aiUnitAll === undefined ? 0 : res.data.aiUnitAll;
            });
        },
        //清空数据
        clearData() {
            this.number = '';
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.introduce {
    margin: -35px 0 0 0;
}
.width-4 {
    width: 110px;
}
.el-upload-dragger {
    width: 270px;
    height: 130px;
    padding-bottom: 28px;
}
.el-upload-dragger .el-icon-upload {
    margin-top: 20px;
}
.upload-demoad .el-upload-list {
    margin: -162px 0 0 25px;
    width: 222px;
}
.upload-demoad .el-upload-list__item-status-label {
    display: block;
}
.upload-wrap {
    border: 1px dashed #d9d9d9;
    height: 130px;
}
.adv-img {
    width: 143px;
    height: 35px;
}
.dialog-item {
    p:first-child {
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}

.tip_color {
    font-size: 12px;
    display: inline-block;
    color: #e6a23c;
}
.search-operat {
    min-width: 1100px;
}

.content {
    margin-left: 20px;
}

.popUp {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 25px;
    margin-bottom: 20px;
}

.input {
    width: 280px;
    margin-left: 20px;
}

.null-data {
    width: 100%;
    height: 692px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    img {
        width: 600px;
        height: 250px;
    }
    p {
        padding-top: 20px;
        text-align: center;
        color: rgb(117, 112, 112);
    }
}

.recharge {
    ::v-deep .el-dialog__title {
        padding-left: 20px;
    }
    ::v-deep .el-dialog__body {
        padding: 0px 20px;
    }
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}
::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
}

.custom {
    color: red;
    margin-right: 1px;
}
.span-title {
    color: black;
}
</style>

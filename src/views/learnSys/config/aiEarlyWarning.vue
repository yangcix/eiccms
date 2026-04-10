<template>
    <div class="content-main-wrap second-parent-wrap">
        <p class="content-title">分析次数预警</p>
        <el-main>
            <el-form :model="form" ref="form" label-width="120px">
                <el-form-item label="预警开关：" required>
                    <el-switch v-model="openEnable"></el-switch>
                </el-form-item>

                <el-form-item label="剩余分析次数：" v-if="openEnable" required>
                    <div>
                        <span style="float: left">{{ remainingAnalysis }} 次</span>
                        <div
                            style="
                                background-color: #fff7ea;
                                width: 340px;
                                float: left;
                                margin-left: 20px;
                                color: #f59a23;
                                border-radius: 5px;
                            "
                        >
                            <strong style="">&nbsp;&nbsp;当剩余分析次数等于/小于预警次数时触发次数预警！ </strong>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="预警次数：" v-if="openEnable" required>
                    <el-input-number
                        v-model="form.warningNumber"
                        :min="1"
                        :max="999999"
                        label="预警次数"
                    ></el-input-number>
                </el-form-item>

                <el-form-item label="提醒人员：" v-if="openEnable" required>
                    <el-select
                        multiple
                        filterable
                        v-model="form.users"
                        style="width: 320px"
                        placeholder="请选择提醒人员"
                        remote
                        clearable
                        :remote-method="getUsers"
                        @clear="getUsers"
                    >
                        <el-option
                            v-for="item in remindUsers"
                            :key="item.id"
                            :label="item.nickName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="提醒频次：" v-if="openEnable" required>
                    <el-radio-group v-model="form.remindType">
                        <el-radio :label="0">仅提醒一次</el-radio>
                        <el-radio :label="1">每日提醒一次</el-radio>
                        <el-radio :label="2">每次登录提醒</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" style="width: 140px" @click="confirm">保存</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            userId: JSON.parse(localStorage.getItem('userInfo'))
                ? JSON.parse(localStorage.getItem('userInfo')).userId
                : '',
            permission: '',
            openEnable: false,
            form: {
                openStatus: 0,
                warningNumber: 10,
                remindType: 0,
                users: [],
                aiConfigId: 2,
            },
            remainingAnalysis: 0,
            remindUsers: [],
            remindShow: false,
        };
    },
    components: {},
    mounted() {
        // this.$nextTick(() => {
        this.getConfig();
        this.getCount();
        // });
    },
    methods: {
        getConfig() {
            this.$axios.get('/aiEarlyWarning/getConfig').then((res) => {
                if (res.data) {
                    this.form = res.data;
                    this.openEnable = res.data.openStatus === 1;
                    console.log('分析次数预警：', this.form);
                    console.log('分析次数预警开启状态：', this.openEnable);
                }
            });
        },
        getUsers(val) {
            if (val) {
                this.$axios.get('/sys/user/listUserExcludeStudent', {keyWord: val}).then((res) => {
                    this.remindUsers = res.data;
                });
            } else {
                this.remindUsers = [];
            }
        },
        getCount() {
            this.$axios.get('/Api/getTotalRemaining').then((res) => {
                if (res.code == 200) {
                    this.remainingAnalysis = res.data;
                }
            });
        },
        confirm() {
            console.log('分析次数预警保存');
            if (this.form.warningNumber < 1) {
                return this.$message('预警次数不能为空！', 'error');
            }
            if (this.form.remindType === '' || this.form.remindType === null) {
                return this.$message('请选择提醒频次！', 'error');
            }
            if (
                this.form.users === '' ||
                this.form.users === null ||
                !Array.isArray(this.form.users) ||
                this.form.users.length === 0
            ) {
                return this.$message('请选择提醒人员！', 'error');
            }

            // let data = new FormData();
            // data.append("aiConfigId", this.form.aiConfigId);
            // data.append("openStatus", this.openEnable ? 1 : 0);
            // data.append("warningNumber", this.form.warningNumber);
            // data.append("remindType", this.form.remindType);
            // data.append("users", this.form.users);
            this.form.openStatus = this.openEnable ? 1 : 0;
            this.$axios.post('/aiEarlyWarning/updateConfig', this.form).then((res) => {
                if (res.code == 200) {
                    this.getConfig();
                    this.remindShow = false;
                    this.configShow = false;
                    this.$message('保存成功！', 'success');
                }
            });
        },
        enabled() {
            console.log('关闭预警开关');
            if (!this.openEnable) {
                this.form.openStatus = 0;
                this.$axios.post('/aiEarlyWarning/updateConfig', this.form).then((res) => {
                    if (res.code == 200) {
                        this.getConfig();
                        this.remindShow = false;
                        this.configShow = false;
                        this.$message('关闭成功！', 'success');
                    }
                });
            }
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.revise {
    color: red;
}
</style>

<template>
  <div class="content-main-wrap second-parent-wrap">
    <p class="content-title">试用设置</p>
    <el-main style="margin: 40px">
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="试用模式：" required>
          <!--      active-text="开" inactive-text="关"    -->
          <el-switch v-model="openEnable"></el-switch>
        </el-form-item>

        <el-form-item v-if="openEnable" label="试用到期时间：" required>
          <el-date-picker
              v-model="form.expirationDateStr"
              type="date"
              placeholder="年 / 月 / 日"
              :picker-options="pickerOptions"
              :style="{ width: '320px' }">
          </el-date-picker>
          <span style="margin-left: 28px;color: #827b76;">注：到期时间为所选日期的 23:59:59 </span>
        </el-form-item>

        <el-form-item label="是否提醒：" v-if="openEnable" required>
          <el-radio-group v-model="form.reminder">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="openEnable" label="提醒时间：" required>
          <span style="margin-right: 2px;color: #5b544f;">到期前 </span>
          <el-input-number v-model="form.reminderTime" :min="1" :max="30" label="天"
                           style="width: 220px"></el-input-number>
          <span style="color: #5b544f;"> 天</span>
          <!--          <el-checkbox style="margin-left: 20px" v-model="form.noReminder">不提醒</el-checkbox>-->
        </el-form-item>


        <el-form-item label="提醒人员：" v-if="openEnable" required>
          <el-select multiple filterable v-model="form.users" style="width: 320px;" placeholder="请搜索或选择提醒人员">
            <el-option v-for="item in remindUsers" :key="item.id" :label="item.nickName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 160px;margin-top: 20px;" @click="confirm">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import {formatDate} from '@/assets/js/utils.js';

export default {
  name: "",
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")).userId : "",
      permission: '',
      openEnable: false,
      form: {
        id: 1,
        trialMode: 0,
        expirationDate: null,
        reminderTime: 1,
        reminder: 1,
        remindFlag: 0,
        users: [],
        expirationDateStr: null,
      },

      remainingAnalysis: 0,
      remindUsers: [],
      remindShow: false,
      pickerOptions: {
        disabledDate(time) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 设置为今天的零点时间
          return time.getTime() <= today.getTime(); // 如果日期早于今天则禁用
        }
      }
    };
  },
  components: {},
  mounted() {
    if ( this.userId !== 1) {
      this.$message("暂无访问权限！","error");
      // 导航到主页
      this.$router.push('/sys/home');
    } else {
      // this.$nextTick(() => {
      this.getConfig();
      this.getUsers();

      // });
    }
  },
  methods: {
    getConfig() {
      this.$axios.get("/tryout/getConfig").then((res) => {
        if (res.data) {
          this.form = res.data;
          this.openEnable = res.data.trialMode === 1;
          console.log("到期配置：", this.form)
          console.log("到期开关：", this.openEnable)
        }
      });
    },
    getUsers() {
      this.$axios.get("/sys/user/listUserExcludeStudent").then((res) => {
        this.remindUsers = res.data;
      });
    },
    submitConfig() {

    },
    confirm() {
      if (this.openEnable) {
        if (this.form.expirationDateStr == null || this.form.expirationDateStr === '') {
          return this.$message("请选择试用到期时间！", "error");
        }
        if (!this.form.reminderTime) {
          return this.$message("请先输入提醒时间！", "error");
        }
        if (this.form.users === '' || this.form.users === null || !Array.isArray(this.form.users) || this.form.users.length === 0) {
          return this.$message("请选择提醒人员！", "error");
        }
      }
      this.submit();
    },
    enabled() {
      if (!this.openEnable) {
        console.log("关闭成功！");
        this.submit();
      }
    },
    submit() {
      this.form.trialMode = this.openEnable ? 1 : 0;
      if (this.form.expirationDateStr) {
        const date = new Date(this.form.expirationDateStr);
        date.setHours(23, 59, 59, 999);
        this.form.expirationDateStr = date.toISOString().split('T')[0];
      }
      this.$axios.post("/tryout/updateConfig", this.form).then((res) => {
        if (res.code == 200) {
          this.getConfig();
          this.$message("保存成功！", "success")
        }
      });
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.revise {
  color: red;
}
</style>

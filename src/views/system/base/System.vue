<template>
  <div class="content-main-wrap">
    <p class="content-title">系统设置</p>
    <div v-if="permission.length == 0" class="no-found">
      <img src="../../../assets/imgs/home-null.png" alt="" />
      <p>暂无访问权限！</p>
    </div>
    <div
      v-else
      class="main-wrap system-wrap"
      v-loading="loading"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <div class="menu-wrap">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="0" v-if="permission.info" class="menu-item"
            >基础配置</el-menu-item
          >
          <el-menu-item index="1" v-if="permission.updateGraduate"
            >毕业配置</el-menu-item
          >
          <!-- <el-menu-item index="2">时间配置</el-menu-item> -->
          <el-menu-item index="3" v-if="permission.setPort"
            >高级配置</el-menu-item
          >
          <el-menu-item index="4" v-if="permission.updateCloudInfo"
            >云直播配置</el-menu-item
          >
          <el-menu-item index="5" v-if="permission.productInfo"
            >产品相关</el-menu-item
          >
        </el-menu>
        <div class="line"></div>
      </div>

      <div class="content-wrap" v-if="activeIndex == 0">
        <div class="dialog-item">
          <p>平台名称</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.name"></el-input>
          <!-- <p style="margin-left: 20px">平台名称</p>
					<p><em>*</em>：</p>
					<el-input class="width-2" v-model="baseInfo.name"></el-input> -->
        </div>
        <!-- <div class="dialog-item">
					<p>智能录播</p>
					<p><em>*</em>：</p>
					<el-select v-model="baseInfo.recordType" style="width: 280px" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div> -->
        <!-- <div class="dialog-item">
					<p>前台版本</p>
					<p><em>*</em>：</p>
					<el-select v-model="baseInfo.uiType" style="width: 280px" placeholder="请选择">
						<el-option
							v-for="item in options2"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div> -->
        <div class="dialog-item">
          <p>主办单位</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.sponsor"></el-input>
        </div>
        <div class="dialog-item">
          <p>运维单位</p>
          <p><em>*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.company"></el-input>
        </div>
        <div class="dialog-item">
          <p>备案号</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.record"></el-input>
        </div>
        <div class="dialog-item">
          <p>备案号跳转链接</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.recordUrl"></el-input>
        </div>
        <div class="dialog-item">
          <p>ICP备案号</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.icpRecord"></el-input>
        </div>
        <div class="dialog-item">
          <p>ICP跳转链接</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input class="width-2" v-model="baseInfo.icpRecordUrl"></el-input>
        </div>
        <div class="dialog-item">
          <p>国家平台url</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input
            class="width-2"
            v-model="baseInfo.nationalPlatformUrl"
          ></el-input>
        </div>
        <div class="dialog-item upload-box">
          <p>平台logo</p>
          <p class="p1"><em style="opacity: 0">*</em>：</p>
          <div class="upload-wrap">
            <el-upload
              :limit="1"
              :on-exceed="handleOnExceed"
              class="upload-demosys"
              :action="uploadUrl"
              accept=".png,.jpg"
              :file-list="baseInfo.pcLogo"
              :on-change="handleSelectFile"
              :before-remove="beforeRemov1e1"
              list-type="picture"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png且不超过500kb(建议尺寸160*60)
              </div>
            </el-upload>
          </div>
        </div>

        <div class="dialog-item upload-box">
          <p>移动端logo</p>
          <p class="p1"><em style="opacity: 0">*</em>：</p>
          <div class="upload-wrap">
            <el-upload
              :limit="1"
              :on-exceed="handleOnExceed"
              class="upload-demosys"
              :action="uploadUrl"
              accept=".png,.jpg"
              :file-list="baseInfo.mobileLogo"
              :on-change="handleSelectFile2"
              :before-remove="beforeRemov1e2"
              list-type="picture"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png且不超过500kb(建议尺寸70*35)
              </div>
            </el-upload>
          </div>
        </div>

        <div class="dialog-item upload-box">
          <p>后台登录底图</p>
          <p class="p1"><em style="opacity: 0">*</em>：</p>
          <div class="upload-wrap">
            <el-upload
              :limit="1"
              :on-exceed="handleOnExceed"
              class="upload-demosys"
              :action="uploadUrl"
              accept=".png,.jpg"
              :file-list="baseInfo.loginImg"
              :on-change="handleSelectFile3"
              :before-remove="beforeRemov1e3"
              list-type="picture"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
          </div>
        </div>

        <div class="dialog-item upload-box">
          <p>组织架构图</p>
          <p class="p1"><em style="opacity: 0">*</em>：</p>
          <div class="upload-wrap">
            <el-upload
              :limit="1"
              :on-exceed="handleOnExceed"
              class="upload-demosys"
              :action="uploadUrl"
              accept=".png,.jpg"
              :file-list="baseInfo.orgImg"
              :on-change="handleSelectFile4"
              :before-remove="beforeRemov1e4"
              list-type="picture"
              :auto-upload="false"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em style="color: #409eff">点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过1M
              </div>
            </el-upload>
          </div>
        </div>
        <el-button type="primary" class="edit-btn" @click="httpRequest"
          >保存</el-button
        >
      </div>

      <div class="content-wrap" v-if="activeIndex == 1">
        <div class="dialog-item">
          <p style="margin-right: 70px">毕业年级：</p>
          <el-select
            v-model="orgId"
            @change="shcoolChange"
            placeholder="请选择学校"
            class="width-2"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in schoolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select v-model="gradeId" placeholder="请选择年级" class="width-7">
            <el-option
              v-for="item in gradeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="dialog-item">
          <span style="margin-right: 70px">毕业年级禁用：</span>
          <el-switch v-model="status"> </el-switch>
        </div>
        <p class="notice">
          注：禁用后则所有年级内的学生与班级状态将禁用，禁用后无法撤销，请谨慎操作。
        </p>

        <div class="dialog-item">
          <span>毕业所在班级的教室释放：</span>
          <el-switch v-model="freed"> </el-switch>
        </div>
        <p class="notice">
          注：释放后则所有毕业班的教室将解除绑定，释放后无法撤销，请谨慎操作。
        </p>

        <el-button type="primary" class="edit-btn" @click="setGrade(0)"
          >确认执行</el-button
        >
      </div>

      <div class="content-wrap" v-if="activeIndex == 2">
        <div class="dialog-item">
          <p style="margin-right: 80px">时间同步方式：</p>
          <el-select
            v-model="syncType"
            class="width-2"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in syncTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 80px">服务器时间：</p>
          <span>{{ serverTime }}</span>
        </div>
        <div class="dialog-item" v-if="syncType == 1">
          <p style="margin-right: 80px">同步时间：</p>
          <el-date-picker
            v-model="syncTime"
            type="datetime"
            style="width: 280px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="同步时间"
          >
          </el-date-picker>
        </div>
        <el-button type="primary" class="edit-btn" @click="syncChange"
          >确认执行</el-button
        >
      </div>

      <div class="content-wrap" v-if="activeIndex == 3">
        <div class="dialog-item">
          <p style="margin-right: 20px">平台访问端口：</p>
          <el-input
            class="width-2"
            placeholder="请输入访问端口号"
            v-model="port.platformAccessPort"
          ></el-input>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 20px">系统连接端口：</p>
          <el-input
            class="width-2"
            placeholder="请输入连接端口号"
            v-model="port.systemConnectPort"
          ></el-input>
        </div>
        <el-button type="primary" class="edit-btn" @click="portChange(0)"
          >确认执行</el-button
        >
      </div>

      <div class="content-wrap" v-if="activeIndex == 4">
        <div class="dialog-item">
          <span style="margin-right: 70px; width: 155px">艾课云直播：</span>
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="cloudInfoData.cloudLive"
          >
          </el-switch>
        </div>
        <div class="dialog-item">
          <p style="width: 155px">userid（账号ID）</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input class="width-2" v-model="cloudInfoData.appKey"></el-input>
        </div>
        <div class="dialog-item">
          <p style="width: 155px">AppSecret（应用密钥）</p>
          <p><em style="opacity: 0">*</em>：</p>
          <el-input
            class="width-2"
            v-model="cloudInfoData.appSecret"
          ></el-input>
        </div>
        <el-button type="primary" class="edit-btn" @click="handleSubmit"
          >提交</el-button
        >
      </div>

      <div class="content-wrap" v-if="activeIndex == 5">
        <div class="dialog-item">
          <p style="margin-right: 10px">设备名称：</p>
          <span>{{ productInfoData.name }}</span>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 10px">硬件型号：</p>
          <span>{{ productInfoData.hard }}</span>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 10px">服务器版本号：</p>
          <span>{{ productInfoData.server }}</span>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 10px">软件版本号：</p>
          <span>{{ productInfoData.software }}</span>
        </div>
        <div class="dialog-item">
          <p style="margin-right: 10px">设备码：</p>
          <span>{{ productInfoData.serial }}</span>
        </div>
      </div>

      <!-- 公网身份验证后续组件优化 -->
      <el-dialog
        title="身份验证"
        :close-on-click-modal="false"
        :visible.sync="operateShowCloud"
        :before-close="clearCloudPwd"
        width="420px"
      >
        <div class="dialog-wrap">
          <p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
          <div class="dialog-item">
            <p>登录密码</p>
            <p><em>*</em>：</p>
            <el-input
              class="width-3"
              v-model="cloudInfoData.password"
              type="password"
              onkeyup="this.value=this.value.replace(/[, ]/g,'')"
            ></el-input>
          </div>
          <div class="dialog-btn">
            <el-button type="primary" @click="handleAffirm">确 定</el-button>
            <el-button @click="clearCloudPwd">取 消</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="身份验证"
        :close-on-click-modal="false"
        :visible.sync="operateShow"
        :before-close="clearLoginPwd"
        width="420px"
      >
        <div class="dialog-wrap">
          <p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
          <div class="dialog-item">
            <p>登录密码</p>
            <p><em>*</em>：</p>
            <el-input
              class="width-3"
              v-model="loginPwd"
              type="password"
              onkeyup="this.value=this.value.replace(/[, ]/g,'')"
            ></el-input>
          </div>
          <div class="dialog-btn">
            <el-button
              type="primary"
              @click="portChange(1)"
              :loading="btnLoading"
              >确 定</el-button
            >
            <el-button @click="clearLoginPwd">取 消</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="毕业配置"
        :close-on-click-modal="false"
        :visible.sync="setGradeShow"
        :before-close="clearPwd"
        width="420px"
      >
        <div class="dialog-wrap">
          <p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
          <div class="dialog-item">
            <p>登录密码</p>
            <p><em>*</em>：</p>
            <el-input
              class="width-3"
              v-model="gradePwd"
              type="password"
            ></el-input>
          </div>
          <div class="dialog-btn">
            <el-button type="primary" @click="setGrade(1)">确 定</el-button>
            <el-button @click="clearPwd">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { baseUrl, formatDate } from "@/assets/js/utils";
import MD5 from "js-md5";
export default {
  name: "",
  data() {
    return {
      btnLoading: false,
      options: [
        {
          value: 1,
          label: "安装",
        },
        {
          value: 2,
          label: "不安装",
        },
      ],
      options2: [
        {
          value: 1,
          label: "智慧教育版",
        },
        {
          value: 2,
          label: "通用版",
        },
      ],
      radio: 1,
      radios: [3],
      radioss: 2,
      radioInput: 100,
      loading: false,
      operateShowCloud: false,
      uploadUrl: baseUrl + "/sm/label/save",
      activeIndex: "0",
      baseId: "",
      schoolList: [],
      gradeList: [],
      baseInfo: {},
      baseEditInfo: {},
      gradeId: "",
      orgId: "",
      freed: false,
      status: false,
      syncType: 0,
      syncTime: "",
      serverTime: "",
      version: localStorage.getItem("version"),
      syncTypeList: [
        { id: 0, name: "同步本地时间" },
        { id: 1, name: "手动同步时间" },
      ],
      port: { platformAccessPort: "", systemConnectPort: "" },
      operateShow: false,
      loginPwd: "",
      gradePwd: "",
      permission: null,
      setGradeShow: false,
      cloudInfoData: {
        appKey: "",
        appSecret: "",
        cloudLive: 1,
        password: "",
      },
      productInfoData: {},
    };
  },
  components: {},
  mounted() {
    this.getSystemList();
    this.getServerTime();
    // this.getRule();
  },
  methods: {
    getSystemList() {
      this.$axios.get("/sys/system/list").then((res) => {
        if (res.data.permit.length > 0) {
          this.permission = this.creatPermit(res.data.permit);
        } else {
          this.permission = [];
        }
        let list = [
          "info",
          "updateGraduate",
          "",
          "setPort",
          "updateCloudInfo",
          "productInfo",
        ];
        for (let index = 0; index < list.length; index++) {
          if (list[index] == res.data.permit[0]) {
            this.activeIndex = index.toString();
          }
        }
        for (let index = 0; index < res.data.permit.length; index++) {
          switch (res.data.permit[index]) {
            case "info":
              this.getBaseInfo();
              break;
            case "updateGraduate":
              this.getSchoolList();
              break;
            case "setPort":
              this.getPort();
              break;
            case "updateCloudInfo":
              this.handleGetCloudInfo();
              break;
            case "productInfo":
              this.handleGetProductInfo();
              break;
            default:
              break;
          }
        }
      });
    },
    clearCloudPwd() {
      this.cloudInfoData.password = "";
      this.operateShowCloud = false;
    },
    clearLoginPwd() {
      this.loginPwd = "";
      this.operateShow = false;
    },
    clearPwd() {
      this.gradePwd = "";
      this.setGradeShow = false;
    },
    //菜单切换
    handleSelect(index) {
      this.activeIndex = index;
    },
    handleOnExceed(files, fileList) {
      this.$message("只能上传一个图片", "error");
    },
    // 获取产品信息
    handleGetProductInfo() {
      this.$axios.get("/sys/system/productInfo").then((res) => {
        if (res.code === 200) {
          this.productInfoData = res.data;
        }
      });
    },
    // 获取云平台配置信息
    handleGetCloudInfo() {
      this.$axios.get("/sys/system/cloudInfo").then((res) => {
        if (res.code === 200) {
          this.cloudInfoData = res.data;
        }
      });
    },
    handleSubmit() {
      Message.closeAll();
      // if (this.cloudInfoData.cloudLive == 1) {
      if (!this.cloudInfoData.appKey) {
        this.$message("账号id必填！", "error");
        return;
      }
      if (!this.cloudInfoData.appSecret) {
        this.$message("应用密钥必填！", "error");
        return;
      }
      // }
      this.operateShowCloud = true;
    },
    handleAffirm() {
      if (!this.cloudInfoData.password) {
        return this.$message("请输入密码", "error");
        return;
      }
      const params = {
        cloudLive: this.cloudInfoData.cloudLive,
        appKey: this.cloudInfoData.appKey,
        appSecret: this.cloudInfoData.appSecret,
        password: MD5(this.cloudInfoData.password),
      };
      this.$axios.post("/sys/system/updateCloudInfo", params).then((res) => {
        if (res.code === 200) {
          this.operateShowCloud = false;
          this.cloudInfoData.password = "";
          this.handleGetCloudInfo();
          this.$message("修改成功", "success");
        }
      });
    },
    //获取基础配置
    getBaseInfo() {
      // this.loading = true
      this.$axios.get("/sys/system/info").then((res) => {
        // this.permission = this.creatPermit(res.data.permit)
        let data = res.data.resData;
        this.baseId = data.id;
        let baseInfo = {};
        baseInfo.name = data.name;
        baseInfo.sponsor = data.sponsor;
        baseInfo.company = data.company;
        baseInfo.record = data.record;
        baseInfo.recordUrl = data.recordUrl;
        baseInfo.icpRecord = data.icpRecord;
        baseInfo.icpRecordUrl = data.icpRecordUrl;
        baseInfo.nationalPlatformUrl = data.nationalPlatformUrl;
        baseInfo.recordType = data.recordType;
        baseInfo.uiType = data.uiType;
        if (data.pcLogo) {
          baseInfo.pcLogo = [{ name: "", url: data.pcLogo }];
        }
        if (data.mobileLogo) {
          baseInfo.mobileLogo = [{ name: "", url: data.mobileLogo }];
        }
        if (data.loginImg) {
          baseInfo.loginImg = [{ name: "", url: data.loginImg }];
        }
        if (data.orgImg) {
          baseInfo.orgImg = [{ name: "", url: data.orgImg }];
        }
        this.baseInfo = baseInfo;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    //1PC 2移动端 3登录底图 4组织架构图
    beforeRemov1e1() {
      this.baseEditInfo.pcLogo = null;
      this.baseInfo.pcLogo = null;
    },
    beforeRemov1e2() {
      this.baseEditInfo.mobileLogo = null;
      this.baseInfo.mobileLogo = null;
    },
    beforeRemov1e3() {
      this.baseEditInfo.loginImg = null;
      this.baseInfo.loginImg = null;
    },
    beforeRemov1e4() {
      this.baseEditInfo.orgImg = null;
      this.baseInfo.orgImg = null;
    },
    selectFile1(file) {
      this.baseEditInfo.pcLogo = file;
    },
    selectFile2(file) {
      this.baseEditInfo.mobileLogo = file;
    },
    selectFile3(file) {
      this.baseEditInfo.loginImg = file;
    },
    selectFile4(file) {
      this.baseEditInfo.orgImg = file;
    },
    handleSelectFile(file) {
      let isJpg;
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/jpg"
      ) {
        isJpg = true;
      } else {
        isJpg = false;
      }
      if (!isJpg) {
        this.baseInfo.pcLogo = [];
        this.$forceUpdate();
        return this.$message("上传失败，文件格式错误", "error");
      }
      if (file.raw.size / 1024 > 500) {
        this.baseInfo.pcLogo = [];
        this.$forceUpdate();
        return this.$message(
          "平台logo只能上传jpg/png文件，且不超过500kb",
          "error"
        );
      } else {
        this.baseEditInfo.pcLogo = file;
      }
    },
    handleSelectFile2(file) {
      let isJpg;
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/jpg"
      ) {
        isJpg = true;
      } else {
        isJpg = false;
      }
      if (!isJpg) {
        this.baseInfo.mobileLogo = [];
        this.$forceUpdate();
        return this.$message("上传失败，文件格式错误", "error");
      }
      if (file.raw.size / 1024 > 500) {
        this.baseInfo.mobileLogo = [];
        this.$forceUpdate();
        return this.$message(
          "移动端logo只能上传jpg/png文件，且不超过500kb",
          "error"
        );
      } else {
        this.baseEditInfo.mobileLogo = file;
      }
    },
    handleSelectFile3(file) {
      let isJpg;
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/jpg"
      ) {
        isJpg = true;
      } else {
        isJpg = false;
      }
      if (!isJpg) {
        this.baseInfo.loginImg = [];
        this.$forceUpdate();
        return this.$message("上传失败，文件格式错误", "error");
      }
      if (file.raw.size / 1024 > 1024) {
        this.baseInfo.loginImg = [];
        this.$forceUpdate();
        return this.$message(
          "后台登录底图只能上传jpg/png文件，且不超过1M",
          "error"
        );
      } else {
        this.baseEditInfo.loginImg = file;
      }
    },
    handleSelectFile4(file) {
      let isJpg;
      if (
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/png" ||
        file.raw.type == "image/jpg"
      ) {
        isJpg = true;
      } else {
        isJpg = false;
      }
      if (!isJpg) {
        this.baseInfo.orgImg = [];
        this.$forceUpdate();
        return this.$message("上传失败，文件格式错误", "error");
      }
      if (file.raw.size / 1024 > 1024) {
        this.baseInfo.orgImg = [];
        this.$forceUpdate();
        return this.$message(
          "组织架构图只能上传jpg/png文件，且不超过1M",
          "error"
        );
      } else {
        this.baseEditInfo.orgImg = file;
      }
    },
    //上传
    httpRequest(param) {
      if (this.baseInfo.name == "") {
        this.$message("平台名称必填", "error");
        return true;
      }
      if (this.baseInfo.name.length > 20) {
        this.$message("平台名称不能大于20字符！", "error");
        return true;
      }
      if (this.baseInfo.sponsor == "") {
        this.$message("主办单位必填！", "error");
        return true;
      }
      if (this.baseInfo.sponsor.length > 50) {
        this.$message("主办单位不能大于50字符！", "error");
        return true;
      }
      if (this.baseInfo.company == "") {
        this.$message("运维单位必填！", "error");
        return true;
      }
      if (this.baseInfo.company.length > 50) {
        this.$message("运维单位不能大于50字符！", "error");
        return true;
      }
      if (this.baseInfo.record && this.baseInfo.record.length > 20) {
        this.$message("备案号不能大于20字符！", "error");
        return true;
      }
      if (this.baseInfo.recordUrl && this.baseInfo.recordUrl.length > 100) {
        this.$message("备案号跳转链接不能大于100字符！", "error");
        return true;
      }
      if (this.baseInfo.icpRecord && this.baseInfo.icpRecord.length > 20) {
        this.$message("ICP备案号不能大于20字符！", "error");
        return true;
      }
      if (
        this.baseInfo.icpRecordUrl &&
        this.baseInfo.icpRecordUrl.length > 100
      ) {
        this.$message("ICP备案号跳转链接不能大于100字符！", "error");
        return true;
      }
      if (
        this.baseInfo.nationalPlatformUrl &&
        this.baseInfo.nationalPlatformUrl.length > 100
      ) {
        this.$message("国家平台url不能大于100字符！", "error");
        return true;
      }
      // if(this.baseEditInfo.pcLogo){
      // 	if((this.baseEditInfo.pcLogo.size / 1024) > 500){
      // 		return this.$message('请上传平台logo，只能上传jpg/png文件，且不超过500kb', 'error');
      // 	}
      // }
      // else if(!this.baseInfo.pcLogo){
      // 	return this.$message('请上传平台logo，只能上传jpg/png文件，且不超过500kb', 'error');
      // }

      // if(this.baseEditInfo.mobileLogo){
      // 	if((this.baseEditInfo.mobileLogo.size / 1024) > 500){
      // 		return this.$message('请上传移动端logo，只能上传jpg/png文件，且不超过500kb', 'error');
      // 	}
      // }
      // else if(!this.baseInfo.mobileLogo){
      // 	return this.$message('请上传移动端logo，只能上传jpg/png文件，且不超过500kb', 'error');
      // }

      // if(this.baseEditInfo.loginImg){
      // 	if((this.baseEditInfo.loginImg.size / 1024 / 1024) > 1){
      // 		return this.$message('请上传登录底图，只能上传jpg/png文件，且不超过1M', 'error');
      // 	}
      // }
      // else if(!this.baseInfo.loginImg){
      // 	return this.$message('请上传登录底图，只能上传jpg/png文件，且不超过1M', 'error');
      // }

      // if(this.baseEditInfo.orgImg){
      // 	if((this.baseEditInfo.orgImg.size / 1024 / 1024) > 1){
      // 		return this.$message('请上传组织架构图，只能上传jpg/png文件，且不超过1M', 'error');
      // 	}
      // }
      // else if(!this.baseInfo.orgImg){
      // 	return this.$message('请上传组织架构图，只能上传jpg/png文件，且不超过1M', 'error');
      // }
      let formData = new FormData();
      for (let key in this.baseEditInfo) {
        if (key) {
          if (this.baseEditInfo[key] && this.baseEditInfo[key].raw) {
            formData.append(key, this.baseEditInfo[key].raw);
          } else {
            formData.append(key, "");
          }
        }
      }
      formData.append(
        "pcLogoDetection",
        this.baseEditInfo.pcLogo !== null ? 0 : 1
      );
      formData.append(
        "mobileLogoDetection",
        this.baseEditInfo.mobileLogo !== null ? 0 : 1
      );
      formData.append(
        "loginImgDetection",
        this.baseEditInfo.loginImg !== null ? 0 : 1
      );
      formData.append(
        "orgImgDetection",
        this.baseEditInfo.orgImg !== null ? 0 : 1
      );
      formData.append("name", this.baseInfo.name);
      formData.append(
        "sponsor",
        this.baseInfo.sponsor ? this.baseInfo.sponsor : ""
      );
      formData.append(
        "company",
        this.baseInfo.company ? this.baseInfo.company : ""
      );
      formData.append(
        "record",
        this.baseInfo.record ? this.baseInfo.record : ""
      );
      formData.append(
        "recordUrl",
        this.baseInfo.recordUrl ? this.baseInfo.recordUrl : ""
      );
      formData.append(
        "icpRecord",
        this.baseInfo.icpRecord ? this.baseInfo.icpRecord : ""
      );
      formData.append(
        "icpRecordUrl",
        this.baseInfo.icpRecordUrl ? this.baseInfo.icpRecordUrl : ""
      );
      formData.append(
        "nationalPlatformUrl",
        this.baseInfo.nationalPlatformUrl
          ? this.baseInfo.nationalPlatformUrl
          : ""
      );
      formData.append("recordType", this.baseInfo.recordType);
      formData.append("uiType", this.baseInfo.uiType);
      formData.append("id", this.baseId);
      this.$axios.post("/sys/system/update", formData).then(
        (res) => {
          if (res.code == 200) {
            this.$message("保存成功", "success");
            setTimeout(() => {
              window.location.reload();
            }, 500);
            // this.getBaseInfo();
          }
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    },
    //获取学校列表
    getSchoolList() {
      this.$axios.get("/sys/org/listSchool").then((res) => {
        this.schoolList = res.data;
      });
    },
    //选择学校后 年级修改
    shcoolChange(id) {
      this.gradeId = "";
      this.getGradeList(id);
    },
    //获取年级
    getGradeList(orgId) {
      this.$axios
        .get("/sm/grade/listGradeByOrg", { orgId: orgId })
        .then((res) => {
          this.gradeList = res.data;
        });
    },
    //确认执行
    setGrade(type) {
      if (type == 0) {
        //确认执行
        if (this.$verify.isEmpty(this.gradeId)) {
          return this.$message("请选择年级", "error");
        }
        this.setGradeShow = true;
      } else {
        //密码确定
        if (this.$verify.isEmpty(this.gradePwd)) {
          return this.$message("请输入密码", "error");
        }
        this.$axios
          .post("/sys/system/updateGraduate", {
            gradeId: this.gradeId,
            status: this.status ? 0 : 1,
            freed: this.freed ? 0 : 1,
            password: MD5(this.gradePwd),
          })
          .then((res) => {
            if (res.code == 200) {
              this.clearPwd()
              this.$message("执行成功", "success");
            }
          });
      }
    },
    //获取服务器时间
    getServerTime() {
      this.$axios.get("/sys/system/getServerTime").then((res) => {
        this.serverTime = formatDate(res.data);
      });
    },
    //确认同步时间
    syncChange(id) {
      let syncTime = formatDate(new Date().getTime()).replace(/-/g, "");
      if (this.syncType == 1 && !this.syncTime) {
        return this.$message("请选择同步时间！", "error");
      }
      syncTime =
        this.syncType == 0 ? syncTime : this.syncTime.replace(/-/g, "");
      this.$axios
        .post("/sys/system/updateServerTime", { syncTime: syncTime })
        .then((res) => {
          if (res.code == 200) {
            this.$message(res.message, "success");
            this.getServerTime();
          }
        });
    },
    //获取高级配置端口
    getPort() {
      this.$axios.get("/sys/system/getPort").then((res) => {
        if (res.code == 200) {
          this.port = res.data;
        }
      });
    },
    //修改端口
    portChange(type) {
      if (type) {
        //确定
        if (!this.loginPwd) {
          return this.$message("请输入密码", "error");
        }
        this.btnLoading = true;
        this.port.password = MD5(this.loginPwd);
        this.port.platformAccessPort = parseInt(this.port.platformAccessPort);
        this.port.systemConnectPort = parseInt(this.port.systemConnectPort);
        let timer = setTimeout(() => {
          this.$message("修改成功，请访问新的地址", "success");
          this.operateShow = false;
          this.loginPwd = "";
        }, 5000);
        this.$axios.post("/sys/system/setPort", this.port).then((res) => {
          if (res.code == -10000) {
            this.btnLoading = false;
            clearTimeout(timer);
          }
        });
      } else {
        function regPort(v) {
          return (
            isNaN(Number(v)) ||
            v == undefined ||
            v <= 1 ||
            v > 65535 ||
            v == 22 ||
            v == 23 ||
            v == 53 ||
            v == 139 ||
            v == 445 ||
            v == 1935 ||
            v == 1985 ||
            v == 8081 ||
            v == 5432 ||
            v == 6379 ||
            v == 10080 ||
            v == 8443
          );
        }
        if(this.port.platformAccessPort == ''){
          return this.$message(
            "请输入平台访问端口",
            "error"
          );
        }
        if (
          regPort(this.port.platformAccessPort) ||
          Number.isInteger(Number(this.port.platformAccessPort)) == false
        ) {
          return this.$message(
            "平台访问端口范围为2-65535且不为22,23,53,139,445,1935,1985,8081,5432,6379,10080,8443的正整数",
            "error"
          );
        }
        if(this.port.systemConnectPort == ''){
          return this.$message(
            "请输入系统连接端口",
            "error"
          );
        }
        if (
          regPort(this.port.systemConnectPort) ||
          Number.isInteger(Number(this.port.systemConnectPort)) == false
        ) {
          return this.$message(
            "系统连接端口范围为2-65535且不为22,23,53,139,445,1935,1985,8081,5432,6379,10080,8443的正整数",
            "error"
          );
        } else {
          this.operateShow = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
.no-found {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 560px;
    margin-bottom: 17px;
  }
}

::v-deep .el-upload-list--picture .el-upload-list__item-thumbnail {
  width: 100%;
}
::v-deep .el-upload-dragger {
  width: 280px;
  height: 130px;
}
::v-deep .el-upload-dragger .el-icon-upload {
  margin-top: 20px;
}
.system-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content-wrap {
  overflow-y: scroll;
  margin-top: 25px;
  font-size: 14px;
}
.dialog-item {
  p:first-child {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
  }
}
.upload-box {
  margin-bottom: 50px;
  align-items: start;
  .p1 {
    line-height: 40px;
  }
}
.upload-wrap {
  height: 130px;
  width: 280px;
}
.edit-btn {
  width: 160px;
  height: 40px;
  margin: 0 0 60px 150px;
}
.notice {
  margin-top: -10px;
  margin-bottom: 25px;
  font-size: 12px;
  color: #b3b6ba;
}
</style>
<style>
.upload-demosys .el-upload-list {
  margin: -145px 0 0 15px;
  width: 250px;
}
.upload-demosys .el-upload-list__item-status-label {
  display: block;
}
</style>

<template>
    <div class="content-main-wrap second-parent-wrap">
        <p class="content-title">AI配置管理</p>
        <div class="tab-menu" v-if="userId == 1">
            <el-menu class="el-menu-demo" mode="horizontal" :default-active="activeIndex" @select="tabChange">
                <el-menu-item v-for="(val, index) in filteredTabMenu" :index="val.id" :key="index">
                    {{ val.name }}
                </el-menu-item>
            </el-menu>
            <div class="line"></div>
        </div>
        <!-- 在课堂分析模块下，没收到请求才需要loading。可能存在未开启状态，不需要显示loading -->
        <div
            v-loading="!(addEditInfo.openStatus == 1 || addEditInfo.openStatus == 0) && activeIndex == 1"
            :class="activeIndex == 1 && addEditInfo.openStatus !== 0 ? 'loading-panel' : ''"
        >
            <div v-if="addEditInfo.openStatus == 1 && activeIndex == 1" class="content-item">
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">系统访问名称：</p>
                    <span>{{ addEditInfo.name }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">用户名id：</p>
                    <span>{{ addEditInfo.appId }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">密钥：</p>
                    <span>********</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">AI服务器地址：</p>
                    <span>{{ addEditInfo.ip }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">访问端口：</p>
                    <span>{{ addEditInfo.port }}</span>
                </div>
                <div v-if="type == 2" :class="addEditInfo.status == 1 ? 'dialog-item' : 'dialog-item dangers'">
                    <p style="margin-right: 50px; width: 120px">连接状态：</p>
                    <span>{{ addEditInfo.status == 1 ? '在线' : '离线' }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">学科配置：</p>
                    <span>{{ addEditInfo.subject }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">年级配置：</p>
                    <span>{{ addEditInfo.grade }}</span>
                </div>
                <div v-if="type == 2" class="dialog-item">
                    <p style="margin-right: 50px; width: 120px">课堂类型配置：</p>
                    <span>{{ addEditInfo.classListName }}</span>
                </div>
                <!--      <div v-if="type == 2 && id == 2" class="dialog-item">
              <p style="margin-right: 50px; width: 120px">收费模式：</p>
              <span>{{ addEditInfo.type == 1 ? "按量收费" : "不按量收费" }}</span>
            </div>-->
                <div v-if="type == 2">
                    <el-button v-if="permission.off" style="width: 120px" @click="closeConfig()">关闭</el-button>
                    <el-button
                        v-if="permission.update"
                        type="primary"
                        style="margin-left: 30px; width: 120px"
                        @click="editConfig()"
                        >编辑
                    </el-button>
                </div>
            </div>
        </div>
        <div v-if="addEditInfo.openStatus == 0 && activeIndex == 1" class="noContent">
            <img :src="imgs" alt="" />
            <p>AI课堂分析未开启</p>
            <el-button v-if="permission.on" type="primary" style="width: 120px; margin-top: 10px" @click="openConfig()"
                >马上开启
            </el-button>
        </div>

        <!--    {{modelInfo.enabled}} &#45;&#45; {{activeIndex}}-->
        <div v-if="modelInfo.enabled == 1 && activeIndex == 2" class="content-item">
            <div class="dialog-item">
                <p style="margin-right: 50px; width: 120px">来源：</p>
                <span>{{ this.aiModelMap[modelInfo.modelType] }}</span>
            </div>
            <div class="dialog-item">
                <p style="margin-right: 50px; width: 120px">系统访问名称：</p>
                <span>{{ modelInfo.name }}</span>
            </div>
            <div class="dialog-item">
                <p style="margin-right: 50px; width: 120px">密钥：</p>
                <span>********</span>
            </div>
            <!-- 豆包才需要显示“获取数据形式” -->
            <div class="dialog-item" v-show="modelInfo.modelType == '2'">
                <p style="margin-right: 50px; width: 120px">获取数据形式：</p>
                <span>{{ this.dataTypeMap[modelInfo.useVisionModel] }}</span>
            </div>
            <div :class="modelInfo.connectStatus ? 'dialog-item' : 'dialog-item dangers'">
                <p style="margin-right: 50px; width: 120px">连接状态：</p>
                <span>{{ modelInfo.connectStatus == 1 ? '在线' : '离线' }}</span>
            </div>
            <div>
                <el-button style="width: 120px" @click="submitDisabledModelConfig()">关闭</el-button>
                <el-button type="primary" style="margin-left: 30px; width: 120px" @click="openModelConfig(2)"
                    >编辑
                </el-button>
            </div>
        </div>

        <div v-if="editModelEnabled == 0 && activeIndex == 2" class="noContent">
            <img :src="AIimgs" alt="" />
            <p>其他AI配置未开启</p>
            <el-button
                v-if="permission.on"
                type="primary"
                style="width: 120px; margin-top: 10px"
                @click="openModelConfig(1)"
                >马上开启
            </el-button>
        </div>

        <el-dialog
            :title="type == 1 ? '开启AI配置' : '编辑AI配置'"
            :close-on-click-modal="false"
            :visible.sync="configShow"
            width="460px"
            class="aiBox"
            :before-close="handleCloseConfigShow"
        >
            <div>
                <!--        <div class="dialog-item">
                  <p>AI模型</p>
                  <p><em>*</em>：</p>
                  <el-select
                    class="width-5"
                    v-model="id"
                    @change="selectModule"
                    clearable
                    placeholder="请选择"
                    filterable
                    :disabled="(type == 2 || used == 1) ? true : false"
                  >
                    <el-option
                      v-for="item in aiList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>-->
                <div class="dialog-item">
                    <p>系统访问名称</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="name" clearable class="width-5" :disabled="type == 1 ? false : true"></el-input>
                </div>
                <div class="dialog-item">
                    <p>用户名id</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="appId" clearable class="width-5"></el-input>
                </div>
                <div class="dialog-item">
                    <p>密钥</p>
                    <p><em>*</em>：</p>
                    <el-input
                        v-model="appSecret"
                        :type="type == 2 ? 'password' : 'text'"
                        clearable
                        class="width-5"
                    ></el-input>
                </div>
                <div class="dialog-item">
                    <p>AI服务器地址</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="address" clearable class="width-5"></el-input>
                </div>
                <div class="dialog-item">
                    <p>访问端口号</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="port" clearable class="width-5"></el-input>
                </div>
                <div class="dialog-item">
                    <p>学科配置</p>
                    <p><em>*</em>：</p>
                    <el-select class="width-5" v-model="subject" clearable placeholder="请选择" filterable multiple>
                        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item">
                    <p>年级配置</p>
                    <p><em>*</em>：</p>
                    <el-select class="width-5" v-model="grade" clearable placeholder="请选择" filterable multiple>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item">
                    <p>课堂类型配置</p>
                    <p><em>*</em>：</p>
                    <el-select
                        class="width-5"
                        v-model="classListIds"
                        clearable
                        placeholder="请选择"
                        filterable
                        multiple
                    >
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <!--        <div v-if="aiType == 2 && id == 2" class="dialog-item">
                  <p style="width: 99.69px;">收费模式</p>
                  <p><em>*</em>：</p>
                  <div>
                    <el-radio-group v-model="feeModel" :disabled="userId !== 1">
                      <el-radio :label="1">按量收费</el-radio>
                      <el-radio :label="2">不按量收费</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div v-if="aiType == 2" class="prompt">
                  <span>注：请根据实际情况配置好收费模式，将影响学校AI产品的使用，如需更改请联系管理员；</span>
                </div>-->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="loading" @click="submitConfig">确 定</el-button>
                <el-button @click="handleCloseConfigShow">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改提醒" :close-on-click-modal="false" :visible.sync="remindShow" width="520px">
            <div v-if="addEditInfo.type == 1 && feeModel == 2">
                <p class="revise">确定要修改收费模式吗？一旦修改，原本账号关联的AI分析次数将会被清空</p>
            </div>
            <div v-if="addEditInfo.type == 2 && feeModel == 1">
                <p class="revise">确定要修改收费模式吗？修改后需要充值次数分配次数后才可使用</p>
            </div>
            <div class="button-list">
                <el-button style="margin-right: 20px" type="primary" @click="confirm()">确定</el-button>
                <el-button @click="remindShow = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="关闭AI服务确认"
            :close-on-click-modal="false"
            :visible.sync="operateShow"
            :before-close="closePwd"
            width="420px"
        >
            <div class="dialog-wrap">
                <p class="err-delete">为了您的账户安全，敏感操作前须先验证身份！</p>
                <div class="dialog-item">
                    <p>登录密码</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="loginPwd" type="password"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button v-if="activeIndex == '1'" type="primary" @click="closeConfig(1)">确 定</el-button>
                    <el-button v-if="activeIndex == '2'" type="primary" @click="submitDisabledModelConfig(1)"
                        >确 定</el-button
                    >
                    <el-button
                        @click="
                            operateShow = false;
                            loginPwd = '';
                        "
                        >取 消</el-button
                    >
                </div>
            </div>
        </el-dialog>

        <el-dialog
            :title="modelType == 1 ? '开启AI配置' : '编辑AI配置'"
            :close-on-click-modal="false"
            :visible.sync="modelConfigShow"
            width="460px"
            class="aiBox"
            :before-close="handleCloseModelConfigShow"
        >
            <div>
                <div class="dialog-item">
                    <p>来源</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="editModel.modelType" class="width-5" @change="changeAiModelType">
                        <el-option
                            v-for="item in aiModelOptions"
                            :key="item.dictValue"
                            :label="item.dictName"
                            :value="item.dictValue"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item">
                    <p>系统访问名称</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="editModel.name" clearable class="width-5" :disabled="modelType !== 1"></el-input>
                </div>
                <div class="dialog-item">
                    <p>密钥</p>
                    <p><em>*</em>：</p>
                    <el-input v-model="editModel.appKey" type="text" clearable class="width-5"></el-input>
                </div>
                <!-- 来源为豆包时，才需要显示“数据获取形式”表单项 -->
                <div class="dialog-item" v-show="isShowDataType">
                    <p>数据获取形式</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="editModel.useVisionModel" class="width-5">
                        <el-option
                            v-for="item in dataTypeOptions"
                            :key="item.dictValue"
                            :label="item.dictName"
                            :value="item.dictValue"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="modelLoading" @click="submitModelConfig">确 定</el-button>
                <el-button @click="handleCloseModelConfigShow">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import MD5 from 'js-md5';
import imgs from '@/assets/imgs/ai_setting.png';
import AIimgs from '@/assets/imgs/otherAi_setting.png';

export default {
    name: '',
    data() {
        return {
            userId: JSON.parse(localStorage.getItem('userInfo'))
                ? JSON.parse(localStorage.getItem('userInfo')).userId
                : '',
            permission: '',
            used: 0,
            appSecret: '',
            appId: '',
            id: '',
            aiList: [
                // {
                //   id: 1,
                //   name: "模型A",
                // },
                {
                    id: 2,
                    name: '模型B',
                },
            ],
            classListIds: [],
            classList: [
                {
                    id: 1,
                    name: '新授课',
                },
                {
                    id: 2,
                    name: '练习课',
                },
                {
                    id: 3,
                    name: '复习课',
                },
                {
                    id: 4,
                    name: '讲评课',
                },
                {
                    id: 5,
                    name: '实验课',
                },
                {
                    id: 6,
                    name: '研究课',
                },
                {
                    id: 7,
                    name: '综合课',
                },
            ],
            tabMenu: [
                {id: '1', name: '课堂分析'},
                {id: '2', name: '其他AI配置'},
            ],
            operateShow: false,
            loginPwd: '',
            imgs: imgs,
            AIimgs: AIimgs,
            addEditInfo: {
                id: 2,
                name: '',
                ip: '',
                port: '',
                status: '',
                openStatus: 2,
                classListIds: [],
                type: 1,
            },
            editModel: {
                id: '',
                name: '',
                appKey: '',
                enabled: 0,
                connectStatus: false,
                modelType: '2',
                useVisionModel: '2',
            },
            modelInfo: {
                id: '',
                name: '',
                appKey: '',
                enabled: 0,
                connectStatus: false,
                modelType: '2',
                useVisionModel: '2',
            },
            activeIndex: '1',
            configShow: false,
            modelConfigShow: false,
            subjectList: [],
            gradeList: [],
            subject: [],
            grade: [],
            name: '',
            address: '',
            port: '',
            aiType: '',
            type: 1, // 1 开启  2  编辑
            modelType: 1, // 1 开启  2  编辑
            feeModel: 1, //收费模式
            remindShow: false,
            loading: false, // 加载中
            modelLoading: false,
            openStatus: 0,
            aiModelOptions: [],
            dataTypeOptions: [],
            aiModelMap: {},
            dataTypeMap: {},
            isShowDataType: false,
            editModelEnabled: 0,
        };
    },
    components: {},
    computed: {
        filteredTabMenu() {
            const baseTabs = [{id: '1', name: '课堂分析'}];
            if (this.openStatus == 1) {
                baseTabs.push({id: '2', name: '其他AI配置'});
            }
            return baseTabs;
        },
    },
    mounted() {
        this.getAIModelOptions();
        this.getDataTypeOptions();
        this.getConfig();
        if (this.userId === 1) {
            this.getModelConfig(this.editModel.modelType);
        }
        this.getSubjectList();
        this.getClassList();
        this.getGradeList();
    },
    methods: {
        selectModule(id) {
            if (id) {
                this.aiType = id;
            } else {
                this.aiType = '';
            }
        },
        closePwd() {
            this.operateShow = false;
            this.loginPwd = '';
        },
        regPort(v) {
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
        },
        openModelConfig(modelType) {
            this.getModelConfig(this.editModel.modelType);
            this.modelConfigShow = true;
            this.modelType = modelType;
            this.isShowDataType = this.editModel.modelType == '2';
        },
        openConfig() {
            this.addEditInfo.openStatus = 1;
            this.id = this.addEditInfo.id;
            this.appId = this.addEditInfo.appId;
            this.appSecret = this.addEditInfo.appSecret;
            this.classListIds = this.addEditInfo.classListIds;
            this.name = this.addEditInfo.name;
            this.address = this.addEditInfo.ip;
            this.port = this.addEditInfo.port;
            this.grade = this.addEditInfo.gradeListIds;
            this.subject = this.addEditInfo.subjectListIds;
            this.type = 1;
            this.configShow = true;
        },
        tabChange(index) {
            this.activeIndex = index;
            if (index === '2') {
                this.getByEnabled();
            }
        },

        submitModelConfig() {
            if (!this.editModel.name || this.editModel.name == '') {
                return this.$message('系统访问名称必填！', 'error');
            }
            if (this.editModel.name.length > 20) {
                return this.$message('系统访问名称需20字符内！', 'error');
            }
            if (this.editModel.appKey == '' || !this.editModel.appKey) {
                return this.$message('密钥不能为空！', 'error');
            }
            if (this.editModel.modelType == '2' && this.editModel.useVisionModel == '') {
                return this.$message('数据获取形式不能为空！', 'error');
            }
            this.modelLoading = true;
            let data = new FormData();
            data.append('id', this.editModel.id);
            data.append('name', this.editModel.name);
            data.append('appKey', this.editModel.appKey);
            data.append('modelType', this.editModel.modelType);
            if (this.editModel.modelType == '2') {
                data.append('useVisionModel', this.editModel.useVisionModel);
            }
            data.append('enabled', 1);
            let url = '';
            // 通过id是否为空，判断此次数据是新增还是更新
            if (this.editModel.id == '') {
                url = '/aiModelConfig/save';
            } else {
                url = '/aiModelConfig/update';
            }
            this.$axios
                .post(url, data)
                .then((res) => {
                    if (res.code == 200) {
                        this.$message('配置完成', 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    }
                })
                .catch((error) => {
                    this.$message.error('配置更新失败，请稍后再试', 'error');
                    console.error('更新配置时出错:', error);
                });
            this.modelLoading = false;
        },
        submitDisabledModelConfig(val) {
            if (val && val == 1) {
                if (this.loginPwd == '') {
                    return this.$message('密码不能为空！', 'error');
                }
                let data = new FormData();
                data.append('pwd', MD5(this.loginPwd));
                this.$axios.post('/sys/user/verifyPassword', data).then((res) => {
                    if (res.code == 200) {
                        this.$axios
                            .get('/aiModelConfig/updateDisabled', {id: this.modelInfo.id})
                            .then((res) => {
                                if (res.code == 200) {
                                    this.$message('配置完成', 'success');
                                    setTimeout(() => {
                                        location.reload();
                                    }, 100);
                                }
                            })
                            .catch((error) => {
                                this.$message.error('配置更新失败，请稍后再试', 'error');
                                console.error('更新配置时出错:', error);
                            });
                    }
                });

                this.loading = false;
            } else {
                this.operateShow = true;
            }
        },

        // AI课堂分析配置项
        submitConfig() {
            if (this.id == '') {
                return this.$message('AI模型不能为空！', 'error');
            }
            if (!this.name || this.name == '') {
                return this.$message('系统访问名称必填！', 'error');
            }
            if (this.name.length > 20) {
                return this.$message('系统访问名称需20字符内！', 'error');
            }
            if (this.appId == '' || !this.appId) {
                return this.$message('用户名id不能为空！', 'error');
            }
            if (this.appSecret == '' || !this.appSecret) {
                return this.$message('密钥不能为空！', 'error');
            }
            if (this.address == '' || !this.address) {
                return this.$message('AI服务器地址必填！', 'error');
            }
            if (this.$verify.ip(this.address) && this.id == 1) {
                return this.$message('AI服务器地址异常！', 'error');
            }
            if (this.port == '' || !this.port) {
                return this.$message('访问端口必填！', 'error');
            }
            if (this.regPort(this.port) || Number.isInteger(Number(this.port)) == false) {
                return this.$message(
                    '访问端口号范围为2-65535且不为22,23,53,139,445,1935,1985,8081,5432,6379,10080,8443的正整数',
                    'error'
                );
            }
            console.log(this.subject, 'this.subject');
            if (!this.subject || this.subject.length == 0) {
                return this.$message('学科配置必填！', 'error');
            }
            if (!this.grade || this.grade.length == 0) {
                return this.$message('年级配置必填！', 'error');
            }
            if (!this.classListIds || this.classListIds.length == 0) {
                return this.$message('课堂类型配置不能为空！', 'error');
            }
            if (this.addEditInfo.type == 1 && this.feeModel == 2) {
                this.remindShow = true;
            } else if (this.addEditInfo.type == 2 && this.feeModel == 1) {
                this.remindShow = true;
            } else {
                this.confirm();
            }
        },
        confirm() {
            this.loading = true;
            let data = new FormData();
            data.append('id', this.id);
            data.append('grade', this.grade);
            data.append('ip', 'http://' + this.address);
            data.append('name', this.name);
            data.append('openStatus', this.addEditInfo.openStatus);
            data.append('port', this.port);
            data.append('subject', this.subject);
            data.append('appId', this.appId);
            data.append('appSecret', this.appSecret);
            data.append('classListIds', this.classListIds);
            data.append('status', this.addEditInfo.status);
            data.append('type', this.feeModel);
            // this.$message('配置中...');
            this.$axios
                .post('/aiConfig/update', data)
                .then((res) => {
                    this.loading = false;
                    if (res.code == 200) {
                        this.$message('配置完成', 'success');
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                        this.remindShow = false;
                        this.configShow = false;
                    }
                })
                .catch((error) => {
                    this.loading = false;
                    this.$message.error('配置更新失败，请稍后再试', 'error');
                    console.error('更新配置时出错:', error);
                });
            this.activeIndex = '1';
        },
        closeConfig(val) {
            if (val && val == 1) {
                if (this.loginPwd == '') {
                    return this.$message('密码不能为空！', 'error');
                }
                let data = new FormData();
                data.append('pwd', MD5(this.loginPwd));
                this.$axios.post('/sys/user/verifyPassword', data).then((res) => {
                    if (res.code == 200) {
                        let data = new FormData();
                        data.append('classListIds', this.addEditInfo.classListIds);
                        data.append('status', this.addEditInfo.status);
                        data.append('appId', this.addEditInfo.appId);
                        data.append('appSecret', this.addEditInfo.appSecret);
                        data.append('id', this.addEditInfo.id);
                        data.append('grade', this.addEditInfo.gradeListIds);
                        data.append('ip', 'http://' + this.addEditInfo.ip);
                        data.append('name', this.addEditInfo.name);
                        data.append('openStatus', 0);
                        data.append('port', this.addEditInfo.port);
                        data.append('subject', this.addEditInfo.subjectListIds);
                        data.append('type', this.feeModel);
                        this.$axios
                            .post('/aiConfig/update', data)
                            .then((res) => {
                                if (res.code == 200) {
                                    this.loginPwd = '';
                                    this.$message('配置完成！', 'success');
                                    setTimeout(() => {
                                        this.operateShow = false;
                                        location.reload();
                                        // this.getConfig();
                                    }, 100);
                                }
                            })
                            .catch((error) => {
                                this.loading = false;
                                this.$message.error('配置更新失败，请稍后再试', 'error');
                                console.error('更新配置时出错:', error);
                            });
                    }
                });
            } else {
                this.operateShow = true;
            }
        },
        editConfig() {
            this.id = this.addEditInfo.id;
            this.name = this.addEditInfo.name;
            this.address = this.addEditInfo.ip;
            this.port = this.addEditInfo.port;
            this.grade = this.addEditInfo.gradeListIds;
            this.subject = this.addEditInfo.subjectListIds;
            this.appId = this.addEditInfo.appId;
            this.appSecret = this.addEditInfo.appSecret;
            this.classListIds = this.addEditInfo.classListIds;
            this.type = 2;
            this.configShow = true;
        },
        handleCloseConfigShow() {
            this.subject = '';
            this.grade = '';
            this.name = '';
            this.address = '';
            this.port = '';
            this.configShow = false;
            if (this.type == 1) {
                this.addEditInfo.openStatus = 0;
            }
            console.log(this.addEditInfo.type, 1111);
            this.feeModel = this.addEditInfo.type;
            if (!this.addEditInfo.appId) {
                this.aiType = '';
            }
        },
        handleCloseModelConfigShow() {
            this.modelConfigShow = false;
            this.activeIndex = '2';
        },
        getModelConfig(aiModelType) {
            this.$axios
                .get('/aiModelConfig/get', {
                    aiModelType: aiModelType,
                })
                .then((res) => {
                    if (res.data) {
                        this.editModel = res.data;
                        if (!this.modelConfigShow) {
                            this.modelInfo = res.data;
                        }
                        this.$forceUpdate();
                    } else {
                        this.editModel['name'] = '';
                        this.editModel['appKey'] = '';
                    }
                });
        },
        getConfig() {
            this.$axios.get('/aiConfig/list').then((res) => {
                if (res.data) {
                    this.type = res.data.resData.openStatus == 1 ? 2 : 1;
                    this.aiType = res.data.resData.id;
                    if (res.data.resData.appId) {
                        this.addEditInfo.id = res.data.resData.id;
                    }
                    this.permission = this.creatPermit(res.data.permit);
                    this.used = res.data.resData.used;
                    this.addEditInfo.openStatus = res.data.resData.openStatus;
                    this.openStatus = res.data.resData.openStatus;
                    this.addEditInfo.status = res.data.resData.status;
                    this.addEditInfo.ip = res.data.resData.ip ? res.data.resData.ip.split('http://')[1] : '';
                    this.addEditInfo.name = res.data.resData.name;
                    this.addEditInfo.appId = res.data.resData.appId;
                    this.addEditInfo.appSecret = res.data.resData.appSecret;
                    this.addEditInfo.classListName = res.data.resData.classListName.toString();
                    this.addEditInfo.classListIds = res.data.resData.classListIds;
                    this.addEditInfo.port = res.data.resData.port;
                    this.addEditInfo.subjectListIds = res.data.resData.subjectListIds;
                    this.addEditInfo.gradeListIds = res.data.resData.gradeListIds;
                    this.addEditInfo.grade = res.data.resData.gradeListName.toString();
                    this.addEditInfo.subject = res.data.resData.subjectListName.toString();
                    this.addEditInfo.type = res.data.resData.type;
                    this.feeModel = res.data.resData.type;
                    this.id = res.data.resData.id;
                    this.$forceUpdate();
                }
            });
        },
        getSubjectList() {
            this.$axios.get('/aiConfig/getSubject').then((res) => {
                this.subjectList = res.data;
            });
        },
        getClassList() {
            this.$axios.get('/aiConfig/getClassType').then((res) => {
                this.classList = res.data;
            });
        },
        getGradeList() {
            this.$axios.get('/aiConfig/getGrade').then((res) => {
                this.gradeList = res.data;
            });
        },
        getAIModelOptions() {
            this.$axios.get('/aiAnalysisDict/list', {dictModel: 'ai_analysis_model'}).then((res) => {
                this.aiModelOptions = res.data.resData;
                this.aiModelMap = Object.fromEntries(
                    this.aiModelOptions.map((product) => [product.dictValue, product.dictName])
                );
            });
        },
        getDataTypeOptions() {
            this.$axios.get('/aiAnalysisDict/list', {dictModel: 'dou_bao_use_vision_model'}).then((res) => {
                this.dataTypeOptions = res.data.resData;
                this.dataTypeMap = Object.fromEntries(
                    this.dataTypeOptions.map((product) => [product.dictValue, product.dictName])
                );
            });
        },
        changeAiModelType(val) {
            this.getModelConfig(val);
            this.isShowDataType = val == '2';
        },
        getByEnabled() {
            this.$axios.get('/aiModelConfig/getByEnabled', {enabled: 1}).then((res) => {
                this.editModelEnabled = res.data ? 1 : 0;
                this.getModelConfig(res.data ? res.data.modelType : '2');
            });
        },
    },
    filters: {
        getaiConfigId(index) {
            let arr = ['', '模型A', '模型B'];
            return arr[index];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.server-item {
    margin-left: 60px;
    padding-bottom: 70px;

    .type-title {
        margin-top: 48px;
        color: #303133;
        font-size: 14px;
        font-weight: bold;
    }
}

.dialog-item {
    margin-top: 20px;
    margin-bottom: 20px;

    p:first-child {
        width: 110px;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
    }
}

.noContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
        width: 317px;
    }

    p {
        margin-top: 50px;
    }
}

.aiBox {
    ::v-deep .el-dialog__body {
        padding: 0 20px;
    }
}

.dangers {
    color: red;
}

.content-item {
    margin-left: 60px;
    padding-bottom: 16px;
    overflow: auto;
}

.prompt {
    color: gray;
    display: flex;
    margin-bottom: 20px;
}

.button-list {
    margin-top: 40px;
    text-align: right;
}

.revise {
    color: red;
}
.loading-panel {
    width: 100%;
    height: 100%;
}
</style>

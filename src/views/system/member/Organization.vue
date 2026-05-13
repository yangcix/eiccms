<template>
    <div class="content-main-wrap">
        <p class="content-title">{{ pageName }}</p>
        <div v-if="!permission.manage && !permission.figure" class="no-found">
            <img src="../../../assets/imgs/home-null.png" alt="" />
            <p>暂无访问权限！</p>
        </div>
        <div v-else class="main-wrap">
            <div class="tab-menu">
                <el-button @click="showSyncOrgDialog()" class="sync-btn">同步机构</el-button>
                <el-menu class="el-menu-demo" mode="horizontal" :default-active="activeIndex" @select="tabChange">
                    <el-menu-item v-for="(val, index) in tabMenu" :index="val.id" :key="index">{{
                        val.name
                    }}</el-menu-item>
                </el-menu>
                <div class="line"></div>
            </div>

            <div class="table-border" v-show="activeIndex == 0">
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    row-key="id"
                    default-expand-all
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                >
                    <el-table-column label="组织机构层级" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.name }}
                            </span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.orgLevelName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="所在地区" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.ancestralStr }}
                        </template>
                    </el-table-column>
                    <el-table-column label="负责人" :show-overflow-tooltip="true" align="center">
                        <template slot-scope="scope">
                            <span>
                                {{ scope.row.principalNames }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.status | useStatus }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="250px" label="操作">
                        <template slot-scope="scope">
                            <ul class="operat-list">
                                <li @click="editCurData(scope, true)" v-if="permission.update">编辑</li>
                                <li @click="editCurData(scope, false)" v-if="permission.save">新增下级</li>
                                <li
                                    @click="addSchoolForCity()"
                                    v-if="scope.row.orgLevel == 2"
                                    :style="{
                                        color: isHaveCitySchool ? '#B3B6BA' : '#f56c6c',
                                    }"
                                >
                                    新增市属校
                                </li>
                                <li
                                    @click="deleteData(scope.row)"
                                    v-if="permission.delete"
                                    :style="{
                                        color: scope.row.code == '000001' ? '#B3B6BA' : '#f56c6c',
                                    }"
                                >
                                    删除
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="activeIndex == 1" class="org-img">
                <img :src="orgImg" alt="" />
            </div>
            <div v-show="activeIndex == 2" class="org-super">
                <div class="added" v-if="isAddSuper">
                    <el-row class="added-text"> 单位名称：{{ superInfo.companyName }} </el-row>
                    <el-row class="added-text"> 平台名称：{{ superInfo.platformName }} </el-row>
                    <el-row class="added-text"> 访问地址：{{ superInfo.ip }} </el-row>
                    <el-row class="added-text"> 通讯状态：{{ superLinkStatus }} </el-row>
                    <el-row class="added-text"> 审核状态：{{ superState }} </el-row>
                    <el-row class="added-text">
                        <el-button type="primary" @click="editSuper" style="margin-top: 15px">编辑</el-button>
                    </el-row>
                </div>
                <div class="no-add" v-else>
                    <div class="no-add-title">暂未添加上级单位</div>
                    <el-button type="primary" class="add-btn" @click="toAddSuper">立即添加</el-button>
                </div>
            </div>
        </div>
        <el-dialog
            :title="isAddSuper ? '编辑上级单位' : '添加上级单位'"
            :visible.sync="addSuperShow"
            :close-on-click-modal="false"
            :before-close="handleSuperClose"
            width="420px"
        >
            <div v-if="isConnect" class="connecting">
                <img src="../../../assets/imgs/connectLoding.png" alt="" class="loadingImg" />
                <div>连接中</div>
                <p>连接过程需要10s左右，请稍等</p>
            </div>
            <div class="dialog-wrap" v-else>
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <div class="dialog-item">
                    <p>单位名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addSuperInfo.companyName"></el-input>
                </div>

                <div class="dialog-item">
                    <p>平台网址</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addSuperInfo.platformUrl"></el-input>
                </div>

                <div class="dialog-item">
                    <p>平台名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addSuperInfo.platformName"></el-input>
                </div>

                <div class="dialog-item">
                    <p>访问地址</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-3" v-model="addSuperInfo.ip"></el-input>
                </div>

                <div class="dialog-item">
                    <p>端口</p>
                    <p><em style="opacity: 0">*</em>：</p>
                    <el-input class="width-3" v-model="addSuperInfo.port"></el-input>
                </div>

                <div class="dialog-btn">
                    <el-button type="primary" @click="addSuperConfirm(isAddSuper)">{{
                        isAddSuper ? '更 新' : '添加'
                    }}</el-button>
                    <el-button @click="hiddenAddSuper">取 消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="updateConfirmShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您修改的信息将影响其他信息的状态，确认修改？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="updateConfirm">确 定</el-button>
                    <el-button @click="updateConfirmShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="选择位置"
            :close-on-click-modal="false"
            :visible.sync="baiduMapShow"
            width="920px"
            class="mapDialog"
        >
            <div class="baiduMap" id="mapShow" ref="mapShow"></div>
        </el-dialog>

        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
            <div class="dialog-wrap">
                <p class="err-delete">您确定删除该组织？</p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="deleteData()">确 定</el-button>
                    <el-button @click="deleteShow = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="同步机构" :close-on-click-modal="false" :visible.sync="isShowSyncOrgDialog" width="550px">
            <div class="dialog-content">
                <div class="dialog-item">
                    <p>机构名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-4" v-model="orgName"></el-input>
                </div>
                <div class="dialog-btn">
                    <el-button @click="isShowSyncOrgDialog = false">取 消</el-button>
                    <el-button type="primary" @click="syncOrganization">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            :title="isEditData ? '编辑组织' : '新增组织'"
            :close-on-click-modal="false"
            :visible.sync="isShowOrgDialog"
            width="500px"
        >
            <div class="dialog-wrap">
                <p class="err-title" v-if="errorInfo">提示：{{ errorInfo }}</p>
                <!-- 组织所在级别，根据orgLevel判断：1代表省级，2代表市级，3代表区域，4代表学校 -->
                <div class="dialog-item">
                    <p>部门名称</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-4" v-model="addEditInfo.name"></el-input>
                </div>
                <div class="dialog-item" v-if="!topLevelEdit">
                    <p>上级部门</p>
                    <p><em>*</em>：</p>
                    <el-input class="width-4" :disabled="true" v-model="sectionName"></el-input>
                </div>
                <div class="dialog-item" v-if="curRow.id !== 2">
                    <p>类型</p>
                    <p><em>*</em>：</p>
                    <el-select
                        v-model="addEditInfo.orgType"
                        placeholder="请选择类型"
                        :class="
                            !(
                                curRow.orgLevel == 4 ||
                                addEditInfo.orgType == 2 ||
                                curRow.orgType == 3 ||
                                (curRow.orgLevel == 3 && !isEditData)
                            )
                                ? 'width-10'
                                : 'width-4'
                        "
                        @change="changeOrgType"
                        :disabled="isHaveChildren"
                    >
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <!-- 当前层级是学校/部门或者区县新增下级，则不显示第二个下拉框 -->

                    <el-select
                        v-model="addEditInfo.orgLevel"
                        placeholder="请选择"
                        class="width-10"
                        :disabled="!(topLevelEdit && !isHaveChildren)"
                        v-show="
                            !(
                                curRow.orgLevel == 4 ||
                                addEditInfo.orgType == 2 ||
                                curRow.orgType == 3 ||
                                (curRow.orgLevel == 3 && !isEditData)
                            )
                        "
                        @change="changeLevelType"
                    >
                        <el-option v-for="item in levelList" :key="item.label" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 类型选中部门的时候不显示所在地区 -->
                <div
                    class="dialog-item"
                    v-show="
                        !isSchoolOrPart
                            ? curRow.orgLevel == 3 && !isEditData
                                ? false
                                : addEditInfo.orgType !== 3
                            : false
                    "
                >
                    <p>所在地区</p>
                    <p>：</p>
                    <el-cascader
                        v-model="addEditInfo.ancestralStr"
                        :options="regionData"
                        placeholder="请选择所在地区"
                        clearable
                        class="width-4"
                        :props="{value: 'label'}"
                        :disabled="
                            (curRow.id == 2 && isEditData) ||
                            (curRow.orgLevel == 3 && !this.isEditData) ||
                            curRow.orgLevel > 3
                        "
                    />
                </div>
                <div class="dialog-item" v-if="isEditData">
                    <p style="width: 66px">负责人</p>
                    <p>：</p>
                    <el-select
                        v-model="addEditInfo.principalIdList"
                        @change="principalChange"
                        multiple
                        placeholder="请选择负责人"
                        class="width-4"
                        filterable
                    >
                        <el-option v-for="item in chargeList" :key="item.id" :label="item.nickName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-item">
                    <p>状态</p>
                    <p><em>*</em>：</p>
                    <el-select v-model="addEditInfo.status" placeholder="请选择" class="width-4">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialog-btn">
                    <el-button type="primary" @click="addEditConfirm">确 定</el-button>
                    <el-button @click="isShowOrgDialog = false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {creatTree, baseUrl} from '../../../assets/js/utils';
import {
    provinceAndCityData, // 省+市 两级数据
    regionData, // 省+市+区 三级数据
    provinceDataList, // 只包含省份的数据
} from 'element-china-area-data';
export default {
    name: '',
    data() {
        return {
            uiType: localStorage.getItem('uiType'),
            version: localStorage.getItem('version'),
            baiduMapShow: false,
            uploadImg: baseUrl + '/sm/label/save',
            fileLists: [],
            errorInfo: '',
            originalList: '',
            tabMenu: [],
            activeIndex: '0',
            addEditShow: false,
            updateConfirmShow: false,
            topLevelEdit: true, //是否是第一级数据
            deleteShow: false,
            deleteRow: false,
            pageName: '机构管理',
            sectionName: '', //上级部门名字
            chargeList: [], //负责人列表
            addEditInfo: {
                orgType: '',
                status: '',
                principalIdList: [],
                name: '',
                file: '',
                longitude: '',
                latitude: '',
            },
            addSuperInfo: {
                companyName: '',
                platformUrl: '',
                platformName: '',
                ip: '',
                port: '',
            },
            addEditType: 0, //新增还是编辑
            originList: [
                {value: 0, label: '教育厅'},
                {value: 1, label: '教育局'},
                {value: 2, label: '学校'},
                {value: 3, label: '部门'},
            ],
            typeList: [
                {value: 0, label: '教育厅'},
                {value: 1, label: '教育局'},
                {value: 2, label: '学校'},
            ],
            statusList: [
                {value: 0, label: '禁用'},
                {value: 1, label: '启用'},
            ],
            originStatus: 1, //初始化状态
            tableData: [], //表格列表
            permission: null,
            orgImg: '',
            superInfo: {}, // 上级单位的信息
            addSuperShow: false, // 添加上级对话框显示
            isConnect: false, // 添加上级链接中。。。
            isAddSuper: false, // 是否已添加上级
            loading: false, // 表格加载
            map: undefined,
            overView: undefined,
            marker: undefined,
            BMap: undefined,
            isShowSyncOrgDialog: false,
            orgName: '',
            isShowOrgDialog: false,
            isEditData: false, //是否是编辑
            regionData: [], // 省市区三级数据
            allLevelList: [
                {label: '省级', value: 1},
                {label: '市级', value: 2},
                {label: '区/县级/市属校', value: 3},
                {label: '学校', value: 4},
            ],
            levelList: [],
            curRow: {},
            upRow: {},
            preAreaList: [],
            isHaveChildren: false, //判断是否有下级，没有下级时可以随意编辑；有下级的话，类型和所在地区不可编辑
            isSchoolOrPart: true,
            isHaveCitySchool: false,
        };
    },
    components: {},
    computed: {
        superState() {
            let arr = ['待审核', '通过', '拒绝', '已删除'];
            if (this.superInfo.status === 2) {
                return `拒绝 ( ${this.superInfo.rejectReason ? this.superInfo.rejectReason : ' '} )`;
            }
            return arr[this.superInfo.status];
        },
        superLinkStatus() {
            let arr = ['正常', '异常'];
            if (this.superInfo.linkStatus === 1) {
                return `异常 ( ${this.superInfo.errMsg ? this.superInfo.errMsg : ' '} )`;
            }
            return arr[this.superInfo.linkStatus];
        },
    },
    mounted() {
        this.getList();
        this.getOrgImg();
        this.getSuperInfo();
        this.getHaveCitySchool();
    },
    methods: {
        getHaveCitySchool() {
            this.$axios.get('/sys/org/info', {orgId: 2}).then((res) => {
                if (res.data) {
                    this.isHaveCitySchool = true;
                }
            });
        },
        closeAddShow() {
            this.fileLists = [];
            this.addEditShow = false;
        },
        clearMap() {
            this.addEditInfo.longitude = '';
            this.addEditInfo.latitude = '';
            this.$forceUpdate();
        },
        openMap() {
            this.baiduMapShow = true;
            this.$nextTick(() => {
                this.baiduMap();
            });
        },
        baiduMap() {
            var map = new BMapGL.Map('mapShow', {
                maxZoom: 15,
                minZoom: 9,
            }); // 创建Map实例
            //初始化地图,设置中心点坐标和地图级别
            let val = JSON.parse(localStorage.getItem('mapVal'));
            map.centerAndZoom(new BMapGL.Point(val.lng, val.lat), 13);
            // map.setMapStyleV2({styleJson: stylejson});
            //开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);
            // var navi3DCtrl = new BMapGL.NavigationControl3D(); // 添加3D控件
            // map.addControl(navi3DCtrl);
            // var scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件
            // map.addControl(scaleCtrl);
            // var zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
            // map.addControl(zoomCtrl);
            let marker;
            let _this = this;
            if (this.addEditInfo.latitude) {
                marker = new BMapGL.Marker(new BMapGL.Point(this.addEditInfo.longitude, this.addEditInfo.latitude));
                map.addOverlay(marker);
            }
            map.addEventListener('click', function (e) {
                if (marker) {
                    map.removeOverlay(marker);
                }
                marker = new BMapGL.Marker(new BMapGL.Point(e.latlng.lng, e.latlng.lat));
                _this.addEditInfo.latitude = e.latlng.lat;
                _this.addEditInfo.longitude = e.latlng.lng;
                map.addOverlay(marker);
                _this.baiduMapShow = false;
            });
            this.map = map;
        },
        handleOnExceed(files, fileList) {
            this.$message('只能上传一个图片', 'error');
        },
        //上传的封面
        selectFiles(file) {
            let isJpg;
            if (file.raw.type == 'image/jpeg' || file.raw.type == 'image/png' || file.raw.type == 'image/jpg') {
                isJpg = true;
            } else {
                isJpg = false;
            }
            if (!isJpg) {
                this.fileLists = [];
                return this.$message('上传失败，文件格式错误', 'error');
            }
            if (file.raw.size / 1024 > 500) {
                this.fileLists = [];
                return this.$message('图片只能上传jpg/jpeg/png文件，且不超过500kb', 'error');
            } else {
                this.addEditInfo.file = file.raw;
            }
        },
        // 移除封面
        removeFile(file) {
            this.addEditInfo.file = null;
        },
        // 获取上级单位信息
        getSuperInfo() {
            this.$axios.get('/sys/superior/info').then((res) => {
                this.superInfo = res.data.resData;
                if (res.data.resData) {
                    this.isAddSuper = true;
                } else {
                    this.isAddSuper = false;
                }
            });
        },
        // 打开添加 上级单位 窗口
        toAddSuper() {
            (this.addSuperInfo = {
                companyName: '',
                platformUrl: '',
                platformName: '',
                ip: '',
                port: '',
            }),
                (this.addSuperShow = true);
        },
        // 添加or编辑  上级单位
        addSuperConfirm(isEdit) {
            this.errorInfo = '';
            if (this.superVerify()) {
                return;
            }
            this.isConnect = true;
            let url = isEdit ? '/sys/superior/update' : '/sys/superior/save';
            this.addSuperInfo.port = parseInt(this.addSuperInfo.port);
            this.$axios.post(url, this.addSuperInfo).then((res) => {
                this.getSuperInfo();
                this.addSuperShow = false;
                if (res.code == 200) {
                    this.$message(isEdit ? '更新成功,等待审核' : '添加成功,等待审核', 'success');
                }
                this.isConnect = false;
                this.isAddSuper = true;
            });
            // setTimeout(() => {
            // 	this.addSuperShow = false;
            // 	this.$message('添加成功,等待审核','success')
            // 	this.isAddSuper = true;
            // },8000)
        },
        // 取消添 加上级单位
        hiddenAddSuper() {
            this.addSuperShow = false;
        },
        // 关闭添加  上级单位 对话框前处理
        handleSuperClose() {
            this.addSuperShow = false;
            this.isConnect = false;
            // this.isAddSuper = false;
        },
        //  打开 编辑 上级单位
        editSuper() {
            this.errorInfo = '';
            console.log(this.superInfo);
            this.addSuperInfo = JSON.parse(JSON.stringify(this.superInfo));
            this.addSuperShow = true;
        },

        //获取组织架构图
        getOrgImg() {
            this.$axios.get('/index/systemInfo').then((res) => {
                document.title = res.data.name ? res.data.name : '劢联科技';
                this.orgImg = res.data.orgImg;
            });
        },
        //获取表格数据
        getList() {
            this.tabMenu = [];
            this.loading = true; // 表格加载
            this.$axios.get('/sys/org/list', '').then((res) => {
                this.loading = false; // 表格加载
                this.originalList = res.data.resData;
                this.permission = this.creatPermit(res.data.permit);
                if (this.permission.manage) {
                    this.tabMenu.push({
                        id: '0',
                        name: '组织架构管理',
                    });
                }
                if (this.permission.figure) {
                    this.tabMenu.push({
                        id: '1',
                        name: '组织架构图',
                    });
                    console.log(this.tabMenu, 'ttt');
                    if (this.tabMenu && this.tabMenu.length && this.tabMenu.length == 1) {
                        this.activeIndex = '1';
                    }
                }
                // if(this.permission.superiors){
                //   this.tabMenu.push({
                //     id: 2,
                //     name: "上级单位",
                //   })
                // }
                this.tableData = creatTree(res.data.resData);
            });
        },
        //获取上级信息
        getOriginInfo(parentId) {
            for (let i = 0; i < this.originalList.length; i++) {
                if (parentId == this.originalList[i].id) {
                    return this.originalList[i];
                }
            }
        },
        //删除
        deleteData(val) {
            if (val) {
                if (val.code) {
                    this.deleteShow = false;
                    return;
                }
                this.deleteShow = true;
                this.deleteRow = val;
            } else {
                let data = {};
                data.id = this.deleteRow.id;
                data.code = this.deleteRow.code;
                data.orgType = this.deleteRow.orgType;
                this.$axios.post('/sys/org/delete', data).then((res) => {
                    if (res.code == 200) {
                        this.deleteShow = false;
                        this.$message('删除成功！', 'success');
                        this.getList();
                    } else {
                        this.$message(res.message, 'error');
                    }
                });
            }
        },
        tabChange(index) {
            this.activeIndex = index;
            const arr = ['组织架构管理', '组织架构图', '上级单位'];
            // this.pageName = arr[index];
        },
        //新增编辑确定
        addEditConfirm() {
            this.errorInfo = '';
            if (this.verify()) {
                return;
            }
            if (this.isEditData) {
                //0编辑
                if (this.addEditInfo.status == this.originStatus) {
                    this.addEditInfo.statusUpdate = 0;
                    this.updateConfirm();
                } else {
                    //状态有修改
                    this.addEditShow = false;
                    this.updateConfirmShow = true;
                    this.addEditInfo.statusUpdate = 1;
                }
            } else {
                //1新增
                let data = new FormData();
                data.append('name', this.addEditInfo.name);
                data.append('orgType', this.addEditInfo.orgType);
                data.append('parentId', this.addEditInfo.parentId);
                data.append('parentType', this.addEditInfo.parentType);
                data.append('status', this.addEditInfo.status);
                if (this.addEditInfo.id == 2 || this.curRow.orgLevel > 3 || this.curRow.orgType == 3) {
                    // 市属校
                    data.append('ancestralStr', this.preAreaList.join('/'));
                } else {
                    // 学校和部门不需要显示所在地区
                    if (this.addEditInfo.orgType == 3 || this.addEditInfo.orgType == 2) {
                        data.append('ancestralStr', '');
                    } else {
                        data.append(
                            'ancestralStr',
                            this.addEditInfo.ancestralStr
                                ? this.preAreaList?.concat(this.addEditInfo.ancestralStr).join('/')
                                : ''
                        );
                    }
                }
                data.append('orgLevel', this.addEditInfo.orgLevel ? this.addEditInfo.orgLevel : '');
                this.$axios.post('/sys/org/save', data).then((res) => {
                    if (res.code == 200) {
                        this.isShowOrgDialog = false;
                        this.$message('新增成功！', 'success');
                        this.getList();
                    }
                });
            }
        },
        //确定修改
        updateConfirm() {
            let data = new FormData();
            data.append('id', this.addEditInfo.id);
            data.append('name', this.addEditInfo.name);
            data.append('orgType', this.addEditInfo.orgType);
            data.append('status', this.addEditInfo.status);
            data.append('statusUpdate', this.addEditInfo.statusUpdate);
            data.append('principalIdList', this.addEditInfo.principalIdList);
            if (!this.isSchoolOrPart) {
                if (this.topLevelEdit) {
                    data.append('ancestralStr', this.addEditInfo.ancestralStr.join('/'));
                } else if (this.addEditInfo.id == 2 || this.curRow.orgLevel > 3 || this.curRow.orgType == 3) {
                    // 市属校
                    data.append('ancestralStr', this.preAreaList.join('/'));
                } else {
                    data.append(
                        'ancestralStr',
                        this.addEditInfo.ancestralStr
                            ? this.preAreaList?.concat(this.addEditInfo.ancestralStr).join('/')
                            : ''
                    );
                }
                data.append('orgLevel', this.addEditInfo.orgLevel ? this.addEditInfo.orgLevel : '');
            }
            this.$axios.post('/sys/org/update', data).then((res) => {
                if (res.code == 200) {
                    this.isShowOrgDialog = false;
                    this.updateConfirmShow = false;
                    this.$message('编辑成功！', 'success');
                    this.getList();
                }
            });
        },
        //验证
        superVerify() {
            if (!this.addSuperInfo.companyName || this.addSuperInfo.companyName.length > 30) {
                this.errorInfo = '单位名称必填,限制30字节内！';
                return true;
            }
            if (!this.addSuperInfo.platformUrl || this.addSuperInfo.platformUrl.length > 30) {
                this.errorInfo = '平台网址必填,限制30字符内！';
                return true;
            }
            if (!this.addSuperInfo.platformName) {
                this.errorInfo = '平台名称不能为空！';
                return true;
            }
            if (this.addSuperInfo.platformName.length > 30) {
                this.errorInfo = '平台名称限制30字符内！';
                return true;
            }
            if (!this.addSuperInfo.ip || this.addSuperInfo.ip.length > 50) {
                this.errorInfo = '请输入访问地址限制50字符！';
                return true;
            }
            if (
                this.addSuperInfo.port &&
                (this.$verify.ports(this.addSuperInfo.port) ||
                    Number.isInteger(Number(this.addSuperInfo.port)) == false)
            ) {
                // this.errorInfo = '端口号为2-65535的正整数!';
                this.errorInfo = '端口号必须为正整数!';
                return true;
            }
            return false;
        },
        //验证
        verify() {
            if (!this.addEditInfo.name) {
                this.errorInfo = '部门名称不能为空！';
                return true;
            }
            if (this.$verify.chLetterNum(this.addEditInfo.name, 20)) {
                this.errorInfo = '部门名称由中文大小写字母数字组成，最长20位！';
                return true;
            }
            if (!this.addEditInfo.orgType && this.addEditInfo.orgType !== 0) {
                this.errorInfo = '类型不能为空！';
                return true;
            }
            return false;
        },
        //限制负责人最多三个
        principalChange() {
            if (this.addEditInfo.principalIdList.length > 3) {
                this.addEditInfo.principalIdList = this.addEditInfo.principalIdList.splice(0, 3);
                this.$message('最多选择三个负责人', 'error');
            }
        },
        showSyncOrgDialog() {
            this.orgName = '';
            this.isShowSyncOrgDialog = true;
        },
        // 同步机构
        syncOrganization() {
            if (this.$verify.chLetterNum(this.orgName, 20)) {
                this.$message('机构名称为必填，由中文或大小写字母或数字组成，最长20位！', 'error');
                return;
            }
            let params = {};
            params['orgName'] = this.orgName;
            this.$axios.post('/gansu/syncOrgData', params).then((res) => {
                if (res.code == 200) {
                    this.isShowSyncOrgDialog = false;
                    this.orgName = '';
                    this.$message('同步机构成功！', 'success');
                    this.getList();
                }
            });
        },
        /** 编辑/新增下级方法
         * rowObj 行数据对象
         * isEdit 是否是编辑
         */
        editCurData(rowObj, isEdit) {
            const {row, $index} = rowObj;
            this.curRow = row;
            console.log('编辑：当前的信息为：', row, '第几行：', $index);
            this.isEditData = isEdit;
            this.levelList = [];
            this.isHaveChildren = false;
            this.isSchoolOrPart = this.curRow.orgType == 2 || this.curRow.orgType == 3;
            this.errorInfo = '';
            if (isEdit) {
                this.$axios.get('/sys/org/getOrgSub', {orgId: row.id}).then((res) => {
                    if (res.code == 200) {
                        this.isHaveChildren = res.data !== 0;
                        if ($index == 0) {
                            this.topLevelEdit = true;
                            if (row.orgType || row.orgType == 0) {
                                this.changeOrgType(row.orgType);
                                this.changeLevelType(row.orgLevel);
                            }
                            // TODO 怎么判断是否是单校版，或者说怎么判断是否是学校层级的？是否需要这一层判断？
                            this.addEditInfo = {
                                name: row.name,
                                status: row.status,
                                id: row.id,
                                orgType: row?.orgType,
                                orgLevel: row?.orgLevel,
                                ancestralStr: row?.ancestralStr ? row.ancestralStr.split('/') : '',
                                principalIdList: row.principalIdList,
                            };
                            this.levelList = this.allLevelList;
                        } else {
                            this.topLevelEdit = false;
                            this.addEditInfo = {
                                orgLevel: row.orgLevel,
                                orgType: row.orgType,
                                status: 1,
                                name: row.name,
                                parentId: row.id,
                                id: row.id,
                                ancestralStr: row.ancestralStr ? row.ancestralStr.split('/').at(-1) : '',
                                principalIdList: row.principalIdList,
                            };
                            this.sectionName = this.getOriginInfo(row.parentId).name;
                            this.upRow = this.getOriginInfo(row.parentId);
                            this.filterAreaList(row.orgLevel);
                            this.levelList = this.allLevelList;
                        }
                        this.$axios.get('/sys/org/listPrincipal', {orgId: row.id}).then((res) => {
                            this.chargeList = res.data;
                            if (this.chargeList.length == 0) {
                                this.chargeList = row.principals;
                            }
                            this.filterOrgTypeList();
                            this.isShowOrgDialog = true;
                        });
                    }
                });
            } else {
                this.topLevelEdit = false;
                this.sectionName = row.name;
                this.addEditInfo = {
                    orgLevel: row.orgLevel + 1,
                    status: 1,
                    name: '',
                    parentId: row.id,
                    parentType: row.orgType,
                };
                this.levelList = this.allLevelList;
                this.filterAreaList(row.orgLevel + 1);
                this.filterOrgTypeList();
                this.isShowOrgDialog = true;
            }
        },
        changeOrgType(val) {
            if (this.topLevelEdit) {
                this.$set(this.addEditInfo, 'orgLevel', '');
                this.filterAreaList(val);
                this.levelList = this.allLevelList.slice(val, val == 0 ? 1 : 3);
                console.log('得到的levelList', this.levelList);
            }
        },
        changeLevelType(val) {
            this.filterAreaList(val - 1);
        },
        filterOrgTypeList() {
            if (this.topLevelEdit) {
                this.typeList = [
                    {value: 0, label: '教育厅'},
                    {value: 1, label: '教育局'},
                    {value: 2, label: '学校'},
                ];
            } else {
                // 市级
                if (this.curRow.orgLevel != 4 || (this.curRow.id == 2 && this.isEditData)) {
                    if (
                        (this.curRow.orgLevel == 3 && !this.isEditData) ||
                        (this.curRow.orgType == 3 && this.isEditData)
                    ) {
                        this.typeList = [
                            {value: 2, label: '学校'},
                            {value: 3, label: '部门'},
                        ];
                    } else if (this.curRow.orgType == 3 && !this.isEditData) {
                        this.typeList = [{value: 3, label: '部门'}];
                    } else {
                        this.typeList = [
                            {value: 1, label: '教育局'},
                            {value: 3, label: '部门'},
                        ];
                    }
                } else {
                    this.typeList = [
                        {value: 2, label: '学校'},
                        {value: 3, label: '部门'},
                    ];
                }
            }
        },
        /**
         * val 0省 1市
         */
        filterAreaList(val) {
            if (this.topLevelEdit) {
                if (val == 0) {
                    // 省 显示省份
                    this.regionData = regionData.map((province) => ({
                        ...province,
                        children: null,
                    }));
                    this.$set(this.addEditInfo, 'orgLevel', 1);
                } else if (val == 1) {
                    // 市 显示省+市
                    this.regionData = regionData.map((province) => ({
                        ...province,
                        children: province.children?.map((city) => ({
                            ...city,
                            children: null,
                        })),
                    }));
                } else {
                    // 区县/学校：显示省市区县
                    this.regionData = regionData;
                }
            } else {
                if (this.isEditData) {
                    this.preAreaList = this.upRow.ancestralStr?.split('/');
                } else {
                    console.log('this.curRow', this.curRow);
                    this.preAreaList = this.curRow.ancestralStr?.split('/');
                }
                let name = '';
                if (
                    (this.curRow.id == 2 && this.isEditData) ||
                    ((this.curRow.orgLevel == 3 || this.curRow.orgType == 3) && !this.isEditData) ||
                    this.curRow.orgLevel > 3
                ) {
                    name = this.preAreaList?.at(-2);
                    this.addEditInfo.ancestralStr = this.preAreaList?.at(-1);
                } else {
                    name = this.preAreaList?.at(-1);
                }
                // 省级新增下级/市属校编辑，显示市级城市名 市属校id == 2
                if (
                    val == 2 ||
                    (this.curRow.id == 2 && (this.isEditData || (this.curRow.orgLevel >= 3 && !this.isEditData)))
                ) {
                    this.regionData = this.getCitiesByProvince(name);
                } else {
                    // 区县/学校：显示区县
                    this.regionData = this.getDistrictsByCity(name);
                }
            }
        },
        // 根据省份value获取对应的城市列表
        getCitiesByProvince(provinceName) {
            const province = regionData.find((p) => p.label === provinceName);
            return (
                province?.children.map((city) => ({
                    ...city,
                    children: null,
                })) || []
            );
        },

        // 根据城市value获取对应的区县列表
        getDistrictsByCity(cityName) {
            for (const province of regionData) {
                const city = province.children?.find((c) => c.label === cityName);
                if (city) {
                    return city.children || [];
                }
            }
            return [];
        },
        addSchoolForCity() {
            if (this.isHaveCitySchool) return;
            this.$axios.get('/sys/org/saveCitySchools').then((res) => {
                if (res.code == 200) {
                    this.$message(res.message, 'success');
                    this.isHaveCitySchool = true;
                    this.getList();
                } else {
                    this.$message(res.message, 'error');
                }
            });
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
.content-main-wrap {
    position: relative;
    .org-super {
        .no-add {
            position: absolute;
            top: 52%;
            left: 50%;
            transform: translate3d(-50%, 0, 0);
            .no-add-title {
                text-align: center;
                margin-bottom: 24px;
            }
            .add-btn {
                width: 100% !important;
            }
        }
    }
    .added {
        width: 100%;
        height: auto;
        line-height: 38px;
        padding: 20px;

        .added-text {
            font-size: 14px;
        }
    }
    .connecting {
        .loadingImg {
            width: 224px;
            height: 194px;
            position: relative;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -10%, 0);
        }
        div {
            text-align: center;
            font-size: 20px;
            font-weight: 600;
        }
        p {
            text-align: center;
            margin: 23px 0;
        }
    }
}
.tab-menu {
    width: 100%;
    position: relative;

    .sync-btn {
        position: absolute;
        right: 0px;
        top: 10px;
        z-index: 999;
    }
}
.org-img {
    width: 100%;
    text-align: center;
    img {
        width: 71%;
        margin-top: 120px;
    }
}
</style>
<style lang="scss" scoped>
.el-table {
    .cell {
        cursor: pointer;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
    }
}
.upload-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 25px;
}
.upload-box p:first-child {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: justify;
}
::v-deep .upload-demo .el-upload-list {
    margin: -145px 0 0 15px;
    width: 220px;
}
.upload-wrap {
    height: 180px;
    width: 250px;
    ::v-deep .el-upload {
        width: 100%;
        height: 142px;
    }
    ::v-deep .el-upload-dragger {
        width: 100%;
        height: 100%;
    }
    textarea {
        height: 130px;
        width: 280px;
        border: solid #dcdfe6 1px;
        resize: none;
    }
}

.baiduMap {
    width: 100%;
    height: 700px;
}

::v-deep .anchorBL {
    display: none !important;
}
::v-deep .mapDialog {
    .el-dialog {
        margin-top: 3vh !important;
    }
}
.dialog-item-box {
    width: 330px;
    display: flex;
    justify-content: space-between;
}
.width-4 {
    width: 330px;
}
</style>

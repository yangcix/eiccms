import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        rightHome: localStorage.getItem('rightHome'),
        threeHome: localStorage.getItem('threeHome'),
        seeHome: localStorage.getItem('seeHome'), //是否显示概览 0不显示 1显示
        videoMsg: '视频接入中，请勿刷新...',
        applyMsg: 0, // 副讲麦状态
        isTrue: 0, // 是否请求上麦
        ifLogin: false, // 是否有登录
        sysInfo: [],
        account: '', // 登录当前账号
        searchKey: '', // 搜索关键字
        loginRefalsh: false, // 重新登录刷新数据
        chatLogin: false, // 聊天室登录
        uploadBoxVisible: false, // 上传文件弹窗
        uploadTable: [], // 上传列表
        aiUploadBoxVisible: false, // AI上传文件弹窗
        aiUploadTable: [], // 上传列表
        interactUploadBoxVisible: false, // 互动提示消息框
        interactUploadTable: [], // 互动提示消息框
        sysModule: localStorage.getItem('sysModule'), // 默认系统 1 直播 2 录播
        classInfo: JSON.parse(localStorage.getItem('classInfo')), // 录播教室详情
    },
    mutations: {
        // 通用赋值方法
        setState(state, val = {}) {
            for (let key in val) {
                state[key] = val[key];
            }
        },
        edit(state) {
            state.ifLogin = true;
        },
        delete(state) {
            state.ifLogin = false;
        },
        setAccount(state, val) {
            state.account = val;
        },
        setSearchKey(state, val) {
            state.searchKey = val;
        },
        setloginRefalsh(state, val) {
            state.loginRefalsh = val;
        },
        setChatLogin(state, val) {
            state.chatLogin = val;
        },
        setApplyMsg(state, val) {
            state.applyMsg = val;
        },
        setIsTrue(state, val) {
            state.isTrue = val;
        },
        setVideoMsg(state, val) {
            state.videoMsg = val;
        },
        setSeeHome(state, val) {
            state.seeHome = val;
        },
        setRightHome(state, val) {
            state.rightHome = val;
        },
        setThreeHome(state, val) {
            state.threeHome = val;
        },
        // 视频上传列表管理
        setUploadTable(state, val) {
            if (val.type == 'push') {
                state.uploadTable.push(val.item);
            }
            if (val.type == 'splice') {
                state.uploadTable.forEach((item, i) => {
                    console.log(item.uploadId, val.index);
                    if (item.uploadId == val.index) {
                        state.uploadTable.splice(i, 1);
                    }
                });
            }
        },
        // 视频上传列表显示管理
        setUploadBoxVisible(state, val) {
            state.uploadBoxVisible = val;
        },
        // 视频上传列表数据状态管理
        setUploadDataState(state, val) {
            state.uploadTable.forEach((item, i) => {
                if (item.uploadId == val.uploadId) {
                    state.uploadTable[i].status = val.status; //0 上传失败  1上传中  2 已取消
                }
            });
        },
        setAiUploadTable(state, val) {
            if (val.type == 'push') {
                state.aiUploadTable.push(val.item);
            }
            if (val.type == 'splice') {
                let name = val.detail.get('name');
                state.aiUploadTable = state.aiUploadTable.filter((item) => item.detail.get('name') !== name);
            }
        },
        // 视频上传列表显示管理
        setAiUploadBoxVisible(state, val) {
            state.aiUploadBoxVisible = val;
        },
        // 视频上传列表数据状态管理
        setAiUploadDataState(state, val) {
            state.aiUploadTable.forEach((item, i) => {
                console.log(item.uploadId, val.uploadId);
                if (item.uploadId == val.uploadId) {
                    state.aiUploadTable[i].status = val.status; //0 上传失败  1上传中  2 已取消
                }
            });
        },
        // 互动消息操作
        setInteractUploadTable(state, val) {
            if (val.type == 'push') {
                state.interactUploadTable.push(val.item);
            }
            if (val.type == 'splice') {
                console.log(state.interactUploadTable, '1', val);
                state.interactUploadTable.forEach((item, i) => {
                    if (item.id == val.index) {
                        state.interactUploadTable.splice(i, 1);
                    }
                });
            }
            if (val.type == 'clear') {
                state.interactUploadTable = [];
            }
            // localStorage.setItem('interactList',JSON.stringify(state.interactUploadTable))
        },
        setInteractUploadBoxVisible(state, val) {
            state.interactUploadBoxVisible = val;
        },
        setInteractUploadDataState(state, val) {
            state.interactUploadTable = val;
        },
        // 修改系统 类型
        setSysModule(state, val) {
            state.sysModule = val; // 1 直播  2录播
        },
        setSysInfo(state, val) {
            state.sysInfo = val;
        },
        // 更改教室
        setClassInfo(state, val) {
            state.classInfo = val; // 录播教室详情
        },
    },
    actions: {
        commitChatLogin: ({ commit }, data) => {
            commit('setChatLogin', data);
        },
        commitUploadTable: ({ commit }, data) => {
            commit('setUploadTable', data);
        },
        commitUploadBoxVisible: ({ commit }, data) => {
            commit('setUploadBoxVisible', data);
        },
        commitUploadDataState: ({ commit }, data) => {
            commit('setUploadDataState', data);
        },
        commitAiUploadTable: ({ commit }, data) => {
            commit('setAiUploadTable', data);
        },
        commitAiUploadBoxVisible: ({ commit }, data) => {
            commit('setAiUploadBoxVisible', data);
        },
        commitAiUploadDataState: ({ commit }, data) => {
            commit('setAiUploadDataState', data);
        },
        commitInteractUploadTable: ({ commit }, data) => {
            commit('setInteractUploadTable', data);
        },
        commitInteracUploadBoxVisible: ({ commit }, data) => {
            localStorage.setItem('interactShow', JSON.stringify(data));
            commit('setInteractUploadBoxVisible', data);
        },
        commitInteracUploadDataState: ({ commit }, data) => {
            commit('setInteractUploadDataState', data);
        },
        commitSysModule: ({ commit }, data) => {
            localStorage.setItem('sysModule', data);
            commit('setSysModule', data);
        },
        commitSysInfo: ({ commit }, data) => {
            localStorage.setItem('sysInfo', JSON.stringify(data));
            commit('setSysInfo', data);
        },
        commitClassInfo: ({ commit }, data) => {
            localStorage.setItem('classInfo', JSON.stringify(data));
            commit('setClassInfo', data);
        },
        commitApply: ({ commit }, data) => {
            localStorage.setItem('applyMsg', JSON.stringify(data));
            commit('applyMsg', data);
        },
        commitVideoMsg: ({ commit }, data) => {
            localStorage.setItem('videoMsg', JSON.stringify(data));
            commit('videoMsg', data);
        },
        commitSeeHome: ({ commit }, data) => {
            localStorage.setItem('seeHome', data);
            commit('setSeeHome', data);
        },
        commitRightHome: ({ commit }, data) => {
            localStorage.setItem('rightHome', data);
            commit('setRightHome', data);
        },
        commitThreeHome: ({ commit }, data) => {
            localStorage.setItem('threeHome', data);
            commit('setThreeHome', data);
        },
    },
    modules: {},
});
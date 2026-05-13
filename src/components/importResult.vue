<template>
    <div class="import-btn">
        <el-button class="width-1 import-btn1" icon="el-icon-upload2" v-if="isShowImportBtn" @click="judgePower()">导入</el-button>
        <el-upload
            ref="upload"
            class="upload-demo upload-btn"
            :action="uploadUrl"
            accept=".xls,.xlsx"
            :before-upload="selectFile"
            :show-file-list="false"
            :http-request="httpRequest"
            style="display: none"
        >
        </el-upload>

        <el-button class="width-1 template-btn" icon="el-icon-download" v-if="isShowTemplateBtn"
            ><a :href="templateUrl" id="downloadBtn">模板</a></el-button
        >
        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadErrorShow" width="420px">
            <div class="dialog-wrap">
                <p class="success-icon"><i class="el-icon-warning-outline err-icon"></i></p>
                <p class="success-title">
                    共{{ failSize + successSize }}条数据，上传成功{{ successSize }}条，异常数据{{ failSize }}条！
                </p>
                <div class="dialog-btn">
                    <el-button type="primary" @click="downloadError">下载异常数据</el-button>
                    <el-button @click="uploadErrorShow = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="uploadSuccessShow" width="420px">
            <div class="dialog-wrap">
                <p class="success-icon"><i class="el-icon-circle-check"></i></p>
                <p class="success-title">共{{ failSize + successSize }}条合法数据！</p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import {exportToExcel} from '@/utils/exportExcel';
export default {
    props: {
        isShowImportBtn: {
            type: Boolean,
            default: false,
        },
        isShowTemplateBtn: {
            type: Boolean,
            default: false,
        },
        uploadUrl: {
            type: String,
            default: '',
        },
        importUrl: {
            type: String,
            default: '',
        },
        templateUrl: {
            type: String,
            default: '',
        },
        templateParams: {
            type: Object,
            default: () => {},
        },
        fileConfig: {
            type: Object,
            default: () => {},
        },
        exceptionFileName: {
            type: String,
            default: '异常数据.xlsx',
        },
        exceptionSheetName: {
            type: String,
            default: '异常数据',
        },
        afterImportMethod: Function,
    },
    data() {
        return {
            uploadErrorShow: false,
            uploadSuccessShow: false,
            loading: null,
            failSize: 0,
            successSize: 0,
            downErrorInfo: {},
            exceptionFileData: [],
        };
    },
    methods: {
        downloadError() {
            exportToExcel(this.exceptionFileData, this.fileConfig, this.exceptionFileName, this.exceptionSheetName)
                .then(() => {
                    console.log('导出成功');
                })
                .catch((error) => {
                    console.error('导出失败', error);
                });
        },
        //选择上传文件
        selectFile() {
            this.loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        },
        judgePower() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!(userInfo.orgId == 1 || userInfo.orgId == 2 || userInfo.sysOrganization.orgType == 2)) {
                event.stopPropagation(); // 阻止事件冒泡
                event.preventDefault(); // 阻止默认行为
                this.$message('该功能仅限学校使用！', 'error');
                return;
            }
            const uploadEl = this.$refs.upload.$el;
            const input = uploadEl.querySelector('input[type="file"]');
            if (input) {
                input.click();
            } else {
                this.$refs.upload.$refs['upload-inner'].$refs.input.click();
            }
        },
        //覆盖默认上传，手动上传
        httpRequest(param) {
            let formData = new FormData();
            formData.append('file', param.file);
            axios({
                method: 'post',
                url: this.importUrl,
                data: formData,
            })
                .then(
                    (res) => {
                        this.loading.close();
                        if (res.code == 200) {
                            this.successSize = res.data.successCount;
                            this.failSize = res.data.failCount;
                            if (res.data.failCount != 0) {
                                this.uploadErrorShow = true;
                                this.exceptionFileData = res.data.failDataList;
                            } else {
                                this.uploadSuccessShow = true;
                            }
                            this.afterImportMethod();
                        }
                    },
                    (err) => {
                        this.loading.close();
                        console.log(err);
                        reject(err);
                    }
                )
                .then((res) => {
                    console.log(res);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.import-btn {
    display: inline-block;

    .import-btn1 {
        margin: 0 10px;
    }
}
.template-btn {
    a {
        color: #606266;
    }
}
</style>

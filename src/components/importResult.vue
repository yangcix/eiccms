<template>
    <div class="import-btn">
        <el-upload
            v-if="isShowImportBtn"
            class="upload-demo upload-btn"
            :action="uploadUrl"
            accept=".xls,.xlsx"
            :before-upload="selectFile"
            :show-file-list="false"
            :http-request="httpRequest"
        >
            <el-button class="width-1" icon="el-icon-upload2" v-if="isShowImportBtn">导入</el-button>
        </el-upload>
        <el-button class="width-1" icon="el-icon-download" @click="downloadTemplate" v-if="isShowTemplateBtn"
            >模板</el-button
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
        };
    },
    methods: {
        downloadError() {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = this.downErrorInfo.url;
            link.setAttribute('download', decodeURIComponent(this.downErrorInfo.filename));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.uploadErrorShow = false;
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
        //覆盖默认上传，手动上传
        httpRequest(param) {
            let fileObj = param.file;
            let formData = new FormData();
            formData.append('file', param.file);
            axios({
                method: 'post',
                url: this.importUrl,
                data: formData,
                responseType: 'blob',
            }).then(
                (response) => {
                    let res = '';
                    if (response.headers.result_data) {
                        res = JSON.parse(decodeURIComponent(response.headers.result_data));
                    }
                    if (res.code == 200) {
                        this.uploadSuccessShow = true;
                        this.successSize = res.data.successSize;
                        this.failSize = res.data.failSize;
                        this.afterImportMethod();
                    } else if (res.code == -10001) {
                        this.uploadErrorShow = true;
                        this.successSize = res.data.successSize;
                        this.failSize = res.data.failSize;
                        this.downErrorInfo.url = window.URL.createObjectURL(new Blob([response.data]));
                        this.downErrorInfo.filename = decodeURIComponent(response.headers.filename);
                        this.afterImportMethod();
                    } else {
                        if (response.config.responseType == 'blob' && !response.headers.result_data) {
                            this.afterImportMethod(); // token失效，取巧刷新token
                            this.$message('导入失败，请再次尝试导入', 'error');
                        } else {
                            this.$message(res.message, 'error');
                        }
                    }
                    this.loading.close();
                },
                (err) => {
                    this.loading.close();
                    console.log(err);
                    reject(err);
                }
            );
        },
        //下载模板
        downloadTemplate() {
            axios
                .get(this.templateUrl, {
                    params: this.templateParams,
                    responseType: 'blob',
                })
                .then((res) => {
                    let url = window.URL.createObjectURL(new Blob([res.data]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', decodeURIComponent(res.headers.filename));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.import-btn {
    display: inline-block;
}
</style>

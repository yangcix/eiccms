<template>
    <div class="content-main-wrap second-parent-wrap">
        <p class="content-title">
            <el-page-header
                @back="goBack"
                :content="`${$route.query.id ? '编辑' : '新增'}教学建议配置`"
            ></el-page-header>
        </p>
        <el-main style="margin: 20px 0 0 0">
            <el-form :model="editInfo" ref="form" label-width="120px">
                <el-form-item style="margin-bottom: 8px" label="学科：" required>
                    <el-radio-group v-model="editInfo.subjectId">
                        <el-radio
                            v-for="subject in subjectList"
                            :key="subject.id"
                            :disabled="editInfo.defaultFlag === 1"
                            :label="subject.id"
                            >{{ subject.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="margin-bottom: 8px" label="学段：">
                    <el-radio-group v-model="editInfo.gradeId">
                        <el-radio
                            v-for="grade in studyGradeList"
                            :key="grade.id"
                            :label="grade.id"
                            :disabled="editInfo.defaultFlag === 1"
                            >{{ grade.name }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="margin-bottom: 8px" label="课堂类型：">
                    <el-radio-group v-model="editInfo.classTypeId">
                        <el-radio
                            v-for="classType in classTypeList"
                            :key="classType.id"
                            :label="classType.id"
                            :disabled="editInfo.defaultFlag === 1"
                        >
                            {{ classType.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="提示词：" required>
                    <div>
                        <el-input
                            type="textarea"
                            :rows="17"
                            placeholder="请输入提示词内容"
                            show-word-limit
                            @input="handleInput"
                            v-model="editInfo.promptWords"
                        >
                        </el-input>
                        <div style="text-align: right" v-if="currentLength > 1">
                            {{ currentLength }} / {{ maxLength }}
                        </div>
                    </div>
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
            id: '',
            editInfo: {
                id: '',
                subjectId: '',
                gradeId: '',
                classTypeId: '',
                promptWords: '',
                defalutFlag: 0,
            },
            subjectList: [],
            studyGradeList: [],
            classTypeList: [],
            pageNum: 1,
            currentLength: 0,
            maxLength: 5000,
        };
    },
    components: {},
    mounted() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            this.getConfig();
        }
        if (this.$route.query.pageNum) {
            this.pageNum = this.$route.query.pageNum;
        }
        this.getSubjectList();
        this.getStudyGradeList();
        this.getClassTypeList();
    },
    methods: {
        getConfig() {
            this.$axios.get('/teachingSuggestionConfig/get', {id: this.id}).then((res) => {
                if (res.data) {
                    this.editInfo = res.data;
                    this.currentLength = this.countTextLength(this.editInfo.promptWords.length);
                    console.log('this.editInfo：', this.editInfo);
                }
            });
        },
        getSubjectList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 1}).then((res) => {
                this.subjectList = res.data;
            });
        },
        getStudyGradeList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 44}).then((res) => {
                this.studyGradeList = res.data;
            });
        },
        getClassTypeList() {
            this.$axios.get('/sm/label/listLabel', {parentId: 33}).then((res) => {
                this.classTypeList = res.data;
            });
        },
        confirm() {
            if (this.editInfo.subjectId == '' || this.editInfo.subjectId < 1) {
                return this.$message('请先选择学科！', 'error');
            }
            if (this.editInfo.promptWords == '' || this.editInfo.promptWords.length < 1) {
                return this.$message('请先填写提示词内容！', 'error');
            }
            console.log('this.currentLength', this.currentLength);
            // if (this.currentLength > 5000) {
            if (this.currentLength > 5000) {
                return this.$message('提示词内容不能超过5000个字符！', 'error');
            }
            let url = '';
            if (this.id) {
                url = '/teachingSuggestionConfig/update';
            } else {
                url = '/teachingSuggestionConfig/save';
            }
            let formData = new FormData();
            formData.append('id', this.editInfo.id);
            formData.append('subjectId', this.editInfo.subjectId);
            if (this.editInfo.gradeId) {
                formData.append('gradeId', this.editInfo.gradeId);
            }
            if (this.editInfo.classTypeId) {
                formData.append('classTypeId', this.editInfo.classTypeId);
            }
            formData.append('promptWords', this.editInfo.promptWords);
            this.$axios.post(url, formData).then((res) => {
                if (res.code == 200) {
                    this.getConfig();
                    this.$message(res.data, 'success');
                    this.goBack();
                }
            });
        },
        handleInput(val) {
            this.currentLength = this.getTextLength(val);
        },
        // 计算文本长度，中文算2，其他算1
        getTextLength(str) {
            return str.length;
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                if (code > 127) {
                    // 中文字符等
                    len += 2;
                } else {
                    // 英文、空格、标点等
                    len += 1;
                }
            }
            return len;
        },
        countTextLength(str) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                len += code > 127 ? 2 : 1;
            }
            return len;
        },
        goBack() {
            this.$router.push('/teachingSuggestionConfig');
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.revise {
    color: red;
}
</style>

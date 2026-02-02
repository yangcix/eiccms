<template>
    <div class="content-main-wrap">
        <!-- <p class="content-title">新增教学建议配置</p> -->
        <div class="content-title">
            <div @click="goback(1)">
                <img style="float: left; width: 25px;height: 25px;" src="../../../assets/img/icon-left.svg" alt="">
                <span
                    style=" float: left; width: 60px; height: 18px; padding-top: 10px; font-size: 16px;margin-left: 5px; border-right: 1px solid #555; ">返回</span>
            </div>
            <p style=" float: left; margin-left: 22px;">新增教学建议配置</p>
        </div>
        <div class="main-wrap">
            <form>
                <div class="form-group">
                    <label style="float: left;width: 70px;margin-right: 20px;" for="subjeck">
                        <div style="float: right;">
                            <span style="color: red;">*</span>
                            学科:
                        </div>
                    </label>
                    <div>
                        <input type="radio" id="chinese" v-memo="selectedSubject" value="语文">
                        <label for="chinese">语文</label>
                        <input type="radio" id="math" v-memo="selectedSubject" value="数学">
                        <label for="math">数学</label>
                        <input type="radio" id="english" v-memo="selectedSubject" value="英语">
                        <label for="english">英语</label>
                        <input type="radio" id="physics" v-memo="selectedSubject" value="物理">
                        <label for="physics">物理</label>
                        <input type="radio" id="chemistry" v-memo="selectedSubject" value="化学">
                        <label for="chemistry">化学</label>
                        <input type="radio" id="history" v-memo="selectedSubject" value="历史">
                        <label for="history">历史</label>
                        <input type="radio" id="biology" v-memo="selectedSubject" value="生物">
                        <label for="biology">生物</label>
                        <input type="radio" id="geography" v-memo="selectedSubject" value="地理">
                        <label for="geography">地理</label>
                        <input type="radio" id="morality" v-memo="selectedSubject" value="道德与法治">
                        <label for="morality">道德与法治</label>
                    </div>
                </div>
                <div class="form-group">
                    <label style="float: left;width: 70px;margin-right: 20px;" for="educationStage">
                        <div style="float: right;">学段:</div>
                    </label>
                    <div>
                        <input type="radio" id="primary" v-model="selectedStage" value="小学">
                        <label for="primary">小学</label>
                        <input type="radio" id="junior" v-model="selectedStage" value="初中">
                        <label for="junior">初中</label>
                        <input type="radio" id="senior" v-model="selectedStage" value="高中">
                        <label for="senior">高中</label>
                        <!-- <input type="radio" id="primary"> -->
                    </div>
                </div>
                <div class="form-group">
                    <label style="float: left;width: 70px;margin-right: 20px;" for="classType">
                        <div style="float: right;">课堂类型:</div>
                    </label>
                    <div>
                        <input type="radio" id="newLesson" v-model="selectedClassType" value="新授课">
                        <label for="newLesson">新授课</label>
                        <input type="radio" id="exerciseLesson" v-model="selectedClassType" value="练习课">
                        <label for="exerciseLesson">练习课</label>
                        <input type="radio" id="reviewLesson" v-model="selectedClassType" value="复习课">
                        <label for="reviewLesson">复习课</label>
                        <input type="radio" id="commentLesson" v-model="selectedClassType" value="讲评课">
                        <label for="commentLesson">讲评课</label>
                        <input type="radio" id="experimentLesson" v-model="selectedClassType" value="实验课">
                        <label for="experimentLesson">实验课</label>
                        <input type="radio" id="researchLesson" v-model="selectedClassType" value="研究课">
                        <label for="researchLesson">研究课</label>
                        <input type="radio" id="comprehensiveLesson" v-model="selectedClassType" value="综合课">
                        <label for="comprehensiveLesson">综合课</label>
                    </div>
                </div>
                <div class="form-group">
                    <label style="float: left; width: 70px;margin-right: 20px; " for="prompt">
                        <div style="float: right;">
                            <span style="color: red;">*</span>
                            提示词:
                        </div>
                    </label>
                    <textarea id="prompt"
                        style="width: 1300px;height: 450px;color: #d7d7d7; border: 1px solid #f2f2f2;border-radius: 5px; padding: 10px 0 0 10px; "
                        v-model="promptText" placeholder="请输入提示词内容" :maxlength="5000"></textarea>
                    <span class="char-count">
                        <!-- {{ promptText.length }}/5000 -->
                    </span>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-save" @click="saveData">保存</button>
                    <button type="button" class="btn-delete" @click="deleteData">删除</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

// 学科选择
const selectedSubject = ref('');
// 学段选择
const selectedStage = ref('');
// 课堂类型选择
const selectedClassType = ref('');
// 提示词内容
const promptText = ref('');

export default {
    data() {
        return {

        };
    },
    computed: {

    },
    methods: {
        goback() {
            this.$router.push('/teachingSuggestionConfig');
        },
        saveData() {
            // 这里可以添加保存数据到后端的逻辑，比如使用axios发送请求
            console.log('保存的数据：', {
                subject: selectedSubject.value,
                stage: selectedStage.value,
                classType: selectedClassType.value,
                prompt: promptText.value
            });
        },

        deleteData() {
            // 这里可以添加删除数据的逻辑，比如清空表单数据
            selectedSubject.value = '';
            selectedStage.value = '';
            selectedClassType.value = '';
            promptText.value = '';
            console.log('数据已删除');
        },
    },
    mounted() {

    }
}
</script>

<style scoped>
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: inline-block;
    width: 80px;
}

.form-actions {
    margin-top: 15px;
}

.btn-save {
    width: 140px;
    color: white;
    padding: 13px 20px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
    margin-left: 90px;
    background-color: #409eff;
}

.btn-delete {
    width: 140px;
    background-color: #fff;
    color: black;
    border-radius: 5px;
    padding: 13px 20px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #ddd;
    margin-left: 20px;
}

.char-count {
    float: right;
    font-size: 12px;
    color: #999;
}
</style>

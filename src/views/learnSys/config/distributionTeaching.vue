<template>
    <div class="content-main-wrap">
        <p class="content-title">教学建议配置</p>
        <div class="main-wrap">
            <div class="filter-container">
                <label class="sift-name" for="subject">学科：</label>
                <select class="sift-inp" v-model="filter.subject">
                    <option value="">全部</option>
                    <option v-for="subject in subjects" :value="subject">
                        {{ subject }}
                    </option>
                </select>
                <label class="sift-name" for="stage ">学段：</label>
                <select class="sift-inp" v-model="filter.stage">
                    <option value="">全部</option>
                    <option v-for="stage in stages" :value="stage">
                        {{ stage }}
                    </option>
                </select>
                <label class="sift-name" for="classType">课堂类型：</label>
                <select class="sift-inp" v-model="filter.classType">
                    <option value="">全部</option>
                    <option v-for="classType in classTypes" :value="classType">
                        {{ classType }}
                    </option>
                </select>
                <button class="Inquire" @click="query">查询</button>
                <button class="add" @click="addItem">+ 新增</button>
            </div>
            <table class="class-table">
                <thead>
                    <tr class="itemname">
                        <th>学科</th>
                        <th>学段</th>
                        <th>课堂类型</th>
                        <th>提示词</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="itemcontent" v-for="(item, index) in filteredData" :key="index">
                        <tb>{{ item.subject }} </tb>
                        <tb>{{ item.stage }}</tb>
                        <tb>{{ item.classType || '-' }}</tb>
                        <tb>
                            <a style="color: #409eff; font-weight: bold; " href="#" @click.prevent="viewItem(item)">
                                查看
                            </a>
                        </tb>
                        <tb>
                            <a style="color: #409eff; font-weight: bold;" href="#" @click.prevent="editItem(item)">
                                编辑
                            </a>
                            <a style="color: red; font-weight: bold;margin-left: 8px;" href="#"
                                @click.prevent="deleteItem(item)">
                                删除
                            </a>
                        </tb>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <el-pagination 
                    @current-change="handleCurrentChange" 
                    :current-page="currentPage" 
                    :page-sizes="[5, 10, 15, 20]" 
                    :page-size="pageSize" 
                    layout="prev, pager, next" 
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDate } from '@/assets/js/utils';

export default {
    data() {
        return {
            // 模拟学科数据
            subjects: ['语文', '数学', '英语', '物理', '生物'],
            // 模拟学段数据
            stages: ['小学', '初中', '高中'],
            // 模拟课堂类型数据
            classTypes: ['新授课', '复习课', '练习课', '讲评课', '实验课', '研究课', '综合课'],
            // 模拟数据列表
            dataList: [
                { subject: '语文', stage: '小学', classType: '新授课' },
                { subject: '数学', stage: '小学', classType: '-' },
                { subject: '英语', stage: '小学', classType: '-' },
                { subject: '物理', stage: '-', classType: '-' },
                { subject: '语文', stage: '小学', classType: '-' },
                { subject: '生物', stage: '初中', classType: '复习课' },
                { subject: '英语', stage: '高中', classType: '新授课' },
                { subject: '语文', stage: '高中', classType: '新授课' },
                { subject: '英语', stage: '初中', classType: '新授课' },
                { subject: '语文', stage: '小学', classType: '-' },
                { subject: '生物', stage: '初中', classType: '复习课' },
                { subject: '英语', stage: '高中', classType: '新授课' },
                { subject: '语文', stage: '高中', classType: '新授课' },
                { subject: '英语', stage: '初中', classType: '新授课' },
                { subject: '语文', stage: '小学', classType: '-' },
                { subject: '生物', stage: '初中', classType: '复习课' },
                { subject: '英语', stage: '高中', classType: '新授课' },
                { subject: '语文', stage: '高中', classType: '新授课' },
                { subject: '英语', stage: '初中', classType: '新授课' },
                { subject: '物理', stage: '高中', classType: '复习课' }
            ],
            filter: {
                subject: '',
                stage: '',
                classType: ''
            },
            currentPage: 1,
            pageSize: 10,
            total:0,
        };
    },
    computed: {
        filteredData() {
            const { subject, stage, classType } = this.filter;
            const filtered = this.dataList.filter(item => {
                return (!subject || item.subject === subject) &&
                    (!stage || item.stage === stage) &&
                    (!classType || item.classType === classType);
            });
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex);
        }
    },
    methods: {
        query() {
            this.currentPage = 1;
        },
        addItem() {
            // 新增功能逻辑，这里暂未实现具体操作
            console.log('新增功能');
            this.$router.push('/addteachingSuggestionConfig');
        },
        viewItem(item) {
            // 查看功能逻辑，这里暂未实现具体操作
            console.log('查看', item);
        },
        editItem(item) {
            // 编辑功能逻辑，这里暂未实现具体操作
            console.log('编辑', item);
        },
        deleteItem(item) {
            const index = this.dataList.indexOf(item);
            if (index > -1) {
                this.dataList.splice(index, 1);
                this.total = this.dataList.length;
            }
        },

        handleCurrentChange(val){
            this.currentPage = val;
        }
    },
    mounted() {
        this.total = this.dataList.length;
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.pagination{
    float: right;
    margin-top: 20px;
}


.sift-name {
    font-size: 16px;
    // font-weight: 500;
}

.sift-inp {
    width: 115px;
    font-size: 14px;
    border-radius: 5px;
    padding: 12px 0px;
    margin-right: 18px;
    border: 1px solid #dcdfe6;
}

.Inquire {
    width: 115px;
    font-size: 14px;
    padding: 12px 0px;
    border-radius: 5px;
    border: none;
    color: #fff;
    background-color: #409eff;
}

.add {
    width: 86px;
    float: right;
    padding: 9px 0px;
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
}

.main-wrap {
    min-width: 800px;
    overflow: auto;
    padding: 20px 50px 36px 50px;
}



.filter-container {
    margin-bottom: 20px;
}

.filter-container label {
    margin-right: 5px;
}

.class-table {
    font-size: 14px;
    border-collapse: collapse;
    width: 100%;
    border: 1px solid #f2f2f2;
}

.itemname {
    display: flex;
    justify-content: space-around;
    margin: 5px 0px;
    padding: 12px 0 0px 0;
}

.itemcontent {
    display: flex;
    padding: 15px 0 0 0;
    justify-content: space-around;
    border-top: 1px solid #f7f7f7;
    margin: 11px 0px;
}

.itemname th {
    width: 70px;
    text-align: left;
    // border: 1px solid #ddd;
}

.itemcontent tb {
    width: 70px;
    // background-color: orange;
    // padding: 8px;
    text-align: left;
}
</style>

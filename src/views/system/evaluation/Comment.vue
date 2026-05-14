<template>
    <div class="content-main-wrap">
        <p class="content-title">听评课管理</p>

        <div class="main-wrap">
            <div class="search-operat" style="min-width: 1350px">
                <div>
                    <el-input
                        class="width-3"
                        clearable
                        v-model="keyword"
                        placeholder="请输入名称关键字"
                        v-search="handleSearch"
                        style="width: 160px"
                    ></el-input>
                    <!-- 全部数据 或者是 教育局的下级数据 -->
                    <span class="search-desc" v-show="curShowType == 1 || (curOrgType == 1 && curShowType == 3)"
                        >学校：</span
                    >
                    <el-cascader
                        v-model="searchSchoolList"
                        :props="cascaderProps"
                        :options="departmentTree"
                        @change="handleChangeTeacher"
                        collapse-tags
                        clearable
                        filterable
                        class="width-3"
                        @visible-change="getDepartmentList"
                        style="width: 190px"
                        v-show="curShowType == 1 || (curOrgType == 1 && curShowType == 3)"
                    ></el-cascader>
                    <span class="search-desc">状态：</span>
                    <el-select v-model="searchThemeStatus" placeholder="请选择" class="width-4" style="width: 100px">
                        <el-option
                            v-for="item in searchThemeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <span class="search-desc" v-show="curShowType != 4">学科：</span>
                    <el-select
                        v-model="searchLiveStatus"
                        placeholder="选择学科"
                        style="width: 130px"
                        v-show="curShowType != 4"
                    >
                        <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="search-desc" v-show="curShowType != 4">资源来源：</span>
                    <el-select
                        v-model="searchResourcesStatus"
                        placeholder="选择资源来源"
                        style="width: 130px"
                        v-show="curShowType != 4"
                    >
                        <el-option
                            v-for="item in resourcesList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="primary" class="search-btn" @click="handleSearch()">查询 </el-button>
                </div>

                <div>
                    <el-button icon="el-icon-plus" @click="add(1)" v-if="permission.save">新增活动 </el-button>
                </div>
            </div>
            <div class="data-table table-border">
                <el-table
                    :row-style="{height: '10px'}"
                    :cell-style="{padding: '4px 0'}"
                    v-loading="loading"
                    :data="tableData"
                >
                    <el-table-column align="center" label="评课名称">
                        <template slot-scope="scope">
                            <p class="detail" @click="evaluationDetail(scope.row)">
                                {{ scope.row.name }}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="关联资源">
                        <template slot-scope="scope">
                            <p class="detail" @click="aboutDetail(scope.row)">
                                {{
                                    scope.row.resources != null && [2, 3, 4, 5].includes(Number(scope.row.resources))
                                        ? scope.row.name
                                        : scope.row.objectName
                                }}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="subjectName" align="center" label="学科"> </el-table-column>
                    <el-table-column align="center" prop="teacherName" label="授课教师"> </el-table-column>
                    <el-table-column align="center" prop="groupName" label="评课教师组"> </el-table-column>
                    <!-- 全部数据或者市级/区县的下级数据 -->
                    <el-table-column
                        prop="schoolName"
                        align="center"
                        label="学校"
                        v-if="curShowType == 1 || ((curOrgLevel == 2 || curOrgLevel == 3) && curShowType == 3)"
                    >
                    </el-table-column>
                    <!-- 全部数据或者市级的下级数据 -->
                    <el-table-column
                        prop="districtName"
                        align="center"
                        label="区县"
                        v-if="curShowType == 1 || (curOrgLevel == 2 && curShowType == 3)"
                    >
                    </el-table-column>
                    <el-table-column align="center" prop="resources" label="资源来源">
                        <template slot-scope="scope">
                            {{ scope.row.resources | resources }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status | evaluationState }}
                            <i
                                v-if="scope.row.status == 6"
                                :title="scope.row.reason ? scope.row.reason : '无理由'"
                                class="el-icon-question"
                            ></i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="createDate" label="添加时间"> </el-table-column>
                    <el-table-column align="center" width="330" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                @click="submit(0, scope.row)"
                                v-if="permission.submit"
                                :class="scope.row.status == 1 ? 'active' : 'actives'"
                                >送审
                            </el-button>
                            <el-button
                                type="text"
                                @click="audit(0, scope.row)"
                                v-if="permission.audit"
                                :class="scope.row.status == 2 ? 'active' : 'actives'"
                                >审核
                            </el-button>
                            <!-- <el-button type="text" @click="add(0,scope.row)" v-if="permission.update" :disabled="scope.row.status !== 0">编辑</el-button> -->
                            <el-button
                                type="text"
                                @click="add(0, scope.row)"
                                v-if="permission.update"
                                :class="scope.row.status == 1 || scope.row.status == 6 ? 'active' : 'actives'"
                                >编辑
                            </el-button>
                            <el-button
                                type="text"
                                @click="openView(scope.row)"
                                v-if="permission.reportAi"
                                :class="scope.row.status == 5 || scope.row.status == 4 ? 'active' : 'actives'"
                                >查看报告
                            </el-button>
                            <el-button
                                type="text"
                                @click="viewReportTwo(1, scope.row)"
                                :class="scope.row.status == 5 || scope.row.status == 4 ? 'active' : 'actives'"
                                v-if="permission.reportAi && scope.row.evaluationType == 2 && scope.row.aiStatus == 2"
                                >课堂复盘
                            </el-button>
                            <el-button
                                type="text"
                                v-if="(scope.row.status == 3 || scope.row.status == 4) && permission.share"
                                @click="openQrcodeShow(scope.row)"
                                >分享
                            </el-button>
                            <el-button
                                type="text"
                                style="color: #f56c6c"
                                @click="deleteData(scope.row)"
                                v-if="permission.delete"
                                >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-page">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="handlePageChange"
                    :page-count="pages"
                    :current-page="pageNum"
                >
                </el-pagination>
            </div>
            <el-dialog title="删除评课" :close-on-click-modal="false" :visible.sync="deleteShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">确认删除该评课？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="handleDelete()">确 定</el-button>
                        <el-button @click="deleteShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="系统提示" :close-on-click-modal="false" :visible.sync="submitShow" width="420px">
                <div class="dialog-wrap">
                    <p class="err-delete">送审后无法修改该评课，确认送审？</p>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="submit(1)">确 定</el-button>
                        <el-button @click="submitShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="评课审核" :close-on-click-modal="false" :visible.sync="auditShow" width="420px">
                <div class="dialog-wrap">
                    <div class="dialog-item">
                        <p style="width: 90px">审核结果</p>
                        <p><em>*</em>：</p>
                        <el-select v-model="auditStatus" placeholder="请选择" class="width-5">
                            <el-option v-for="item in auditList" :key="item.id" :label="item.value" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item" v-if="auditStatus == 0">
                        <p style="width: 90px">驳回理由</p>
                        <p style="margin-right: 5px"><em></em>：</p>
                        <el-input type="textarea" :rows="3" class="width-5" v-model="rejectReason"></el-input>
                    </div>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="audit(1)">确 定</el-button>
                        <el-button @click="auditShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog title="听评课活动海报" :close-on-click-modal="false" :visible.sync="qrcodeShow" width="420px">
                <div class="dialog-wrap">
                    <div class="qrcode-wrap" ref="downloadShare">
                        <img
                            :src="detailInfo.coverUrl ? detailInfo.coverUrl : defaultImg"
                            alt=""
                            :onerror="defaultImg"
                        />
                        <div class="content">
                            <div class="text-wrap">
                                <p>{{ detailInfo.name }}</p>
                                <p class="sec-p">{{ detailInfo.teacherName }}</p>
                                <p class="sec-p">扫码进入课堂学习</p>
                            </div>
                            <div class="qrcode-img">
                                <vueQr :text="mobilePlayUrl" :size="60" :margin="0"></vueQr>
                                <!-- <vueQr
                  :text="mobilePlayUrl"
                  v-show="false"
                  ref="Qrcode"
                  :size="320"
                ></vueQr> -->
                            </div>
                        </div>
                    </div>
                    <div class="dialog-btn">
                        <el-button type="primary" @click="downLoadCode">复制链接</el-button>
                        <el-button @click="qrcodeShow = false">取 消</el-button>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                title="听评课活动报告"
                :close-on-click-modal="false"
                :visible.sync="reportShow"
                width="500px"
                @close="closeReport"
            >
                <div>
                    <p>人工评课报告</p>
                    <div
                        v-for="(item, index) in reportList"
                        :key="index"
                        style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                    >
                        <span style="width: 300px; padding-top: 15px; padding-bottom: 15px">{{ item.name }}</span>
                        <el-button type="text" @click="viewReport(0, item)">查看</el-button>
                        <el-button type="text" @click="downloadReport(0, item)">下载 </el-button>
                    </div>
                    <div v-if="reportAi">
                        <div
                            style="padding: 0 10px"
                            v-if="reportAi.professionalReport !== null && reportAi.professionalReport !== ''"
                        >
                            <hr class="divider" />
                        </div>

                        <p>AI评课报告</p>
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                        >
                            <span style="width: 300px">教师版</span>
                            <!-- <el-button type="text" @click="downloadReport(0)">下载</el-button> -->
                            <!-- <el-button type="text" @click="downloadPDFReport(0)">下载</el-button> -->
                            <!--        <el-button v-if="dataList.teacherReport !== null && dataList.teacherReport !== ''" type="text" @click="downloadPDFReport(0)">下载</el-button>-->
                            <el-button
                                v-if="reportAi.teacherReport !== null && reportAi.teacherReport !== ''"
                                type="text"
                                @click="openAiReportNew(0, commentInfo.id)"
                                >查看</el-button
                            >
                            <el-button
                                v-if="reportAi.teacherReport !== null && reportAi.teacherReport !== ''"
                                type="text"
                                @click="openAiReportNew(1, commentInfo.id)"
                                >下载</el-button
                            >
                            <span v-else style="width: 180px">无报告，请联系管理员</span>
                        </div>
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                        >
                            <span style="width: 300px">专业版</span>
                            <!-- <el-button type="text" @click="downloadReport(1)">下载</el-button> -->
                            <!-- <el-button type="text" @click="downloadPDFReport(1)">下载</el-button> -->
                            <el-button
                                v-if="reportAi.professionalReport !== null && reportAi.professionalReport !== ''"
                                type="text"
                                @click="downloadPDFReport(1, commentInfo.id)"
                                >下载</el-button
                            >
                            <span v-else style="width: 180px">无报告，请联系管理员</span>
                        </div>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0 20px;
                                margin-bottom: 10px;
                            "
                        >
                            <span style="width: 300px">大数据报告</span>
                            <el-button
                                v-if="reportAi.bctiReport !== null && reportAi.bctiReport !== ''"
                                type="text"
                                @click="openBigDataReportNew(2, commentInfo.id)"
                                >查看</el-button
                            >
                            <el-button
                                v-if="reportAi.bctiReport !== null && reportAi.bctiReport !== ''"
                                type="text"
                                @click="openBigDataReportNew(1, commentInfo.id)"
                                >下载</el-button
                            >
                            <span v-else style="width: 180px">无报告，请联系管理员</span>
                        </div>
                        <div
                            style="padding: 0 10px"
                            v-if="
                                reportAi && reportAi.professionalReport !== null && reportAi.professionalReport !== ''
                            "
                        >
                            <hr class="divider" />
                        </div>

                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0 20px;
                                margin-bottom: 10px;
                            "
                        >
                            <span style="width: 300px">AI教学建议书</span>
                            <el-button
                                v-if="
                                    reportAi.teachingSuggestionReport !== null &&
                                    reportAi.teachingSuggestionReport !== ''
                                "
                                type="text"
                                @click="downloadPDFReport(4)"
                                >下载</el-button
                            >
                            <span v-else style="width: 94px">
                                <span v-if="aiDetail.aiParsingStatus == 0">请求中...</span>
                                <span v-if="aiDetail.aiParsingStatus == 1">生成中...</span>
                                <el-button
                                    v-if="aiDetail.aiParsingStatus == 3"
                                    type="text"
                                    :disabled="rebuildDisabled"
                                    @click="rebuildTeachingSuggestionReport(aiDetail)"
                                    >重新生成</el-button
                                >
                            </span>
                        </div>

                        <div
                            v-for="(item, index) in reportAiList"
                            :key="index"
                            style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                        >
                            <span style="width: 300px">{{ item.name }}</span>
                            <el-button v-if="commentInfo.aiStatus != 3" type="text" @click="viewReport(1, item)"
                                >查看</el-button
                            >
                            <el-button
                                v-if="
                                    commentInfo.isResetting == 0 &&
                                    commentInfo.aiConfigId == 2 &&
                                    commentInfo.aiStatus == 3
                                "
                                type="text"
                                @click="resetting()"
                                >重置分析
                            </el-button>
                            <el-button
                                style="color: #b3b6ba"
                                v-if="
                                    commentInfo.isResetting == 1 &&
                                    commentInfo.aiConfigId == 2 &&
                                    commentInfo.aiStatus == 3
                                "
                                type="text"
                                disabled
                                >重置分析
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                class="add-dialog"
                title="选择评课类型"
                :close-on-click-modal="false"
                :visible.sync="addShow"
                width="680px"
            >
                <div class="add-box">
                    <div class="add-item" @click="goEdit(1)">
                        <span style="font-size: 18px; font-weight: 600; color: #333333; margin-top: 70px"
                            >人工评价</span
                        >
                        <span style="font-size: 14px; margin-top: 30px">仅人工评课</span>
                    </div>
                    <div class="add-item" @click="goEdit(2)">
                        <span style="font-size: 18px; font-weight: 600; color: #333333; margin-top: 70px"
                            >人工评价+AI评价</span
                        >
                        <span style="font-size: 14px; margin-top: 30px">人工评课+AI分析评课</span>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                :close-on-click-modal="false"
                :visible.sync="evaluationTems"
                width="1000px"
                :before-close="handleCloses"
            >
                <div class="evaluation-title">{{ evaluationReport.name }}总报告</div>
                <div class="evaluation-content">
                    <el-table
                        v-if="evaluationReport.strategy == 1 && evaluationReport.wordDataDtos.length > 0"
                        :data="evaluationReport.wordDataDtos"
                        style="width: 100%"
                        border
                        default-expand-all
                    >
                        <el-table-column width="320" align="left" prop="levelOne" label="评价要素"> </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="分值"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.score }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="平均分"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.averageScore }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 1 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="评语"
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.type == 0">
                                    <el-input-number
                                        class="width-6"
                                        v-model="scope.row.userScore"
                                        clearable
                                        :min="1"
                                        :max="scope.row.score"
                                    ></el-input-number>
                                </div>
                                <span v-else>
                                    {{ scope.row.contentSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="evaluationReport.isOpenRemarks == 1"
                            align="center"
                            :label="evaluationReport.remarksName"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.remarksSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="evaluationReport.strategy == 2 && evaluationReport.wordDataDtos.length > 0"
                        :data="evaluationReport.wordDataDtos"
                        style="width: 100%"
                        border
                        default-expand-all
                        :span-method="(param) => objectSpanMethod(param, evaluationReport.wordDataDtos)"
                    >
                        <el-table-column width="150" align="center" prop="levelOne" label="评价项目"> </el-table-column>
                        <el-table-column width="320" align="left" prop="levelTwo" label="评价要素"> </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="分值"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.score }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="平均分"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.averageScore }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 1 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="评语"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.contentSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="evaluationReport.isOpenRemarks == 1"
                            align="center"
                            :label="evaluationReport.remarksName"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.remarksSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="evaluationReport.strategy == 3 && evaluationReport.wordDataDtos.length > 0"
                        :data="evaluationReport.wordDataDtos"
                        style="width: 100%"
                        border
                        default-expand-all
                        :header-cell-style="handerMethod"
                        :span-method="(param) => objectSpanMethod(param, evaluationReport.wordDataDtos)"
                    >
                        <el-table-column width="100" align="center" prop="levelOne" label="一级名称"> </el-table-column>
                        <el-table-column width="100" align="center" prop="levelTwo" label="评价项目"> </el-table-column>
                        <el-table-column width="320" align="left" prop="levelThree" label="评价要素"> </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="分值"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.score }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 0 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="平均分"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.averageScore }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="
                                evaluationReport.itemList[0] &&
                                (evaluationReport.itemList[0].type == 1 || evaluationReport.itemList[0].type == 2)
                            "
                            align="center"
                            label="评语"
                        >
                            <template slot-scope="scope">
                                <div v-if="scope.row.type == 0">
                                    <el-input-number
                                        class="width-6"
                                        v-model="scope.row.userScore"
                                        clearable
                                        :min="1"
                                        :max="scope.row.score"
                                    ></el-input-number>
                                </div>
                                <span v-else>
                                    {{ scope.row.contentSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="evaluationReport.isOpenRemarks == 1"
                            align="center"
                            :label="evaluationReport.remarksName"
                        >
                            <template slot-scope="scope">
                                <span>
                                    {{ scope.row.remarksSummarize }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="evaluation-parttwo" v-if="evaluationReport.isOpenSummary == 1">
                        <h3 class="part-title">{{ evaluationReport.summaryName }}</h3>
                        <textarea
                            class="evaluation-text"
                            v-model.trim="evaluationReport.commentSummary"
                            style="resize: none"
                            type="textarea"
                        ></textarea>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                class="resetting"
                title="重置分析"
                :close-on-click-modal="false"
                :visible.sync="resettingShow"
                width="500px"
            >
                <span class="popUp">确认要重新提交视频文件进行AI分析吗?</span>
                <span class="prompt">(注：报告生成失败，请联系管理员或尝试重置分析)</span>
                <div style="margin-top: 40px; display: flex; justify-content: right">
                    <el-button @click="resettingShow = false" style="margin-right: 10px">取 消</el-button>
                    <el-button type="primary" @click="resetAnalysis()" style="margin-right: 10px">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="项目次数选择"
                :close-on-click-modal="false"
                :visible.sync="showChooseProjectTimes"
                width="600px"
                class="videoBox"
            >
                <div class="dialog-content">
                    <div class="tips">原有项目次数已用完，请选择新的项目次数进行 AI分析！</div>
                    <div class="dialog-item">
                        <p style="width: 112px">AI分析剩余次数<em></em>：</p>
                        <p>{{ aiNum }}次</p>
                    </div>
                    <div class="dialog-item">
                        <p>优先使用<em>*</em>：</p>
                        <el-select :popper-append-to-body="false" v-model="resettingVal.aiProjectId" class="width-2">
                            <el-option
                                v-for="item in useList"
                                :key="item.allocationId"
                                :label="item.projectName + '-' + item.residueNum + '次'"
                                :value="item.allocationId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="resetAnalysis">确 定</el-button>
                    <el-button @click="handleCloseResetAnalysis">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {getNowDate} from '../../../assets/js/utils';
import vueQr from 'vue-qr';
import html2canvas from 'html2canvas';

export default {
    name: '',
    components: {vueQr},
    data() {
        return {
            searchResourcesStatus: '',
            resourcesList:
                JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2
                    ? [
                          {value: '', label: '全部'},
                          {value: 2, label: '排课录制'},
                          {value: 3, label: '本地上传'},
                          {value: 1, label: '站内资源'},
                          {value: 4, label: '智课终端'},
                          {value: 5, label: '历史录制资源'},
                      ]
                    : [
                          {value: '', label: '全部'},
                          {value: 2, label: '排课录制'},
                          {value: 3, label: '本地上传'},
                          {value: 1, label: '站内资源'},
                      ],
            aiOpenStatus: JSON.parse(localStorage.getItem('sysInfo')).aiOpenStatus,
            addShow: false,
            aiDetail: {},
            evaluationTems: false,
            searchThemeStatus: '',
            searchThemeList: [
                {value: '', label: '全部'},
                {value: 1, label: '待提交'},
                {value: 2, label: '待审核'},
                {value: 3, label: '待评课'},
                {value: 4, label: '评课中'},
                {value: 5, label: '已结束'},
                {value: 6, label: '驳回'},
            ],
            auditShow: false,
            submitShow: false,
            rejectReason: '',
            auditList: [
                {id: 1, value: '通过'},
                {id: 0, value: '不通过'},
            ],
            auditStatus: 1,
            deleteShow: false,
            deleteId: '',
            editId: 0, // 编辑save id
            addClass: false, // true===新增 !=编辑
            pageNum: 1, //请求当前页数
            pages: 0, // 总页数
            keyword: '', // 关键字
            loading: false, // 表格加载
            errorInfo: '',
            menuName: '',
            tableData: [], // 表格data
            totalS: '',
            permission: '', // 许可操作
            detailInfo: {},
            qrcodeShow: false,
            mobilePlayUrl: '',
            evaluationReport: {},
            reportAi: {},
            reportList: [],
            reportShow: false,
            defaultImg: 'this.src="' + require('@/assets/imgs/live.png') + '"', // 默认图片
            aiNum: 0,
            resettingShow: false,
            resettingVal: {},
            commentInfo: {},
            rebuildDisabled: false,
            teachingSuggestionEnabled: 0,
            searchTeacher: '',
            departmentTree: [],
            searchSchoolList: [],
            cascaderProps: {
                value: 'id',
                label: 'name',
                multiple: true,
            },
            orgIdList: [],
            isFirstTime: true,
            curShowType: 1,
            curOrgType: 1,
            curOrgLevel: 2,
            searchLiveStatus: '',
            subjectList: [],
            reportAiList: [],
            useList: [],
            showChooseProjectTimes: false,
        };
    },
    computed: {
        ...mapState({
            aiUploadTable: 'aiUploadTable',
        }),
    },
    mounted() {
        if (this.$route.query.type) {
            this.searchThemeStatus = Number(this.$route.query.type);
        }
        this.rebuildDisabled = false;
        this.handleGetData();
        this.$bus.off('getComment', this.handleGetData);
        this.$bus.on('getComment', this.handleGetData);
        this.getUserInfo();
        this.getSubjectList();
    },
    watch: {
        $route(to, from) {
            if (from.path == '/sm/commentdetail' || from.path == '/sm/themedetail' || from.path == '/sm/filedetail') {
                this.handleGetData();
            } else if (from.path == '/sm/commentaddedit') {
                if (from.query && from.query.evaluationid) {
                    this.handleGetData();
                } else {
                    this.pageNum = 1;
                    this.handleGetData();
                }
            } else if (from.path !== '/sm/comment') {
                this.keyword = '';
                this.searchResourcesStatus = '';
                this.searchLiveStatus = '';
                this.searchThemeStatus = '';
                this.searchSchoolList = [];
                this.orgIdList = [];
                if (from.path == '/traininghome') {
                    this.pageNum = 1;
                    this.searchThemeStatus = this.$route.query.type ? Number(this.$route.query.type) : '';
                    this.handleGetData();
                } else {
                    this.pageNum = 1;
                    this.handleGetData();
                }
            } else {
                this.handleGetData();
            }
        },
    },
    filters: {
        evaluationState(val) {
            let arr = ['未提交', '待提交', '待审核', '待评课', '评课中', '已结束', '驳回', '评课失败'];
            return arr[val];
        },
        resources(val) {
            let arr = ['', '站内资源', '排课录制', '本地上传', '智课终端', '历史录制资源'];
            return arr[val];
        },
    },
    methods: {
        getUserInfo() {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            // 角色权限（1全部数据，2全校数据，3下级数据, 4个人数据）
            this.curShowType = userInfo.sysUserAuth[0].type;
            // 1：教育局 2：学校 3：部门
            this.curOrgType = userInfo.sysOrganization.orgType;
            // admin和super的orgLevel为空
            // 1：省 2：市 3：区县 4：学校
            this.curOrgLevel = userInfo.sysOrganization.orgLevel ? userInfo.sysOrganization.orgLevel : 2;
        },
        goEdit(val) {
            this.addShow = false;
            this.$router.push({path: '/sm/commentaddedit', query: {type: val}});
        },
        handerMethod({row, column, rowIndex, columnIndex}) {
            //这里有个非常坑的bug 必须是row[0]=0 row[1]=2才会生效
            row[1].colSpan = 2;
            row[2].colSpan = 0;
            if (columnIndex === 0) {
                return {display: 'none'};
            }
        },
        getModelConfig() {
            this.$axios.get('/aiModelConfig/get').then((res) => {
                if (res.data) {
                    this.teachingSuggestionEnabled = res.data?.enabled;
                    this.$forceUpdate();
                }
            });
        },
        objectSpanMethod({row, column, rowIndex, columnIndex}, data) {
            if (columnIndex === 0) {
                // 表格数据修改
                const _row = this.flitterData(data).one[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col,
                };
            }
            if (columnIndex === 1) {
                // 表格数据修改
                const _row = this.flitterData(data).two[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col,
                };
            }
        },
        flitterData(arr) {
            let spanOneArr = [];
            let spanTwoArr = [];
            let concatOne = 0;
            let concatTwo = 0;
            arr.forEach((item, index) => {
                if (index === 0) {
                    spanOneArr.push(1);
                    spanTwoArr.push(1);
                } else {
                    if (item.levelOne == arr[index - 1].levelOne) {
                        //第一列需合并相同内容的判断条件（data_）
                        spanOneArr[concatOne] += 1;
                        spanOneArr.push(0);
                    } else {
                        spanOneArr.push(1);
                        concatOne = index;
                    }
                    if (item.levelTwo == arr[index - 1].levelTwo) {
                        //第二列需合并相同内容的判断条件（data_）
                        spanTwoArr[concatTwo] += 1;
                        spanTwoArr.push(0);
                    } else {
                        spanTwoArr.push(1);
                        concatTwo = index;
                    }
                }
            });
            return {
                one: spanOneArr,
                two: spanTwoArr,
            };
        },
        encodeSearchKey(key) {
            const encodeArr = [
                {
                    code: '%',
                    encode: '%25',
                },
                {
                    code: '?',
                    encode: '%3F',
                },
                {
                    code: '#',
                    encode: '%23',
                },
                {
                    code: '&',
                    encode: '%26',
                },
                {
                    code: '=',
                    encode: '%3D',
                },
            ];
            return key.replace(/[%?#&=]/g, ($, index, str) => {
                for (const k of encodeArr) {
                    if (k.code === $) {
                        return k.encode;
                    }
                }
            });
        },
        downloadReport(type, val) {
            if (type == 0) {
                let name = val.name;
                name = this.encodeSearchKey(name);
                console.log(name, 'name');
                this.$axios
                    .get('/sm/comment/exportCommentReportWord', {commentId: val.id}, 'blob')
                    .then((res) => {
                        let url = window.URL.createObjectURL(new Blob([res]));
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.setAttribute('download', decodeURIComponent(name + '.doc'));
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
            }
        },
        viewReport(type, val) {
            if (type == 0) {
                this.$axios.get('/sm/comment/getCommentSummarizeReport', {id: val.id}).then((res) => {
                    this.evaluationReport = res.data;
                    this.evaluationTems = true;
                });
            } else {
                if (this.aiDetail.aiStatus == 3) {
                    this.$message('报告生成失败，请联系管理员！');
                } else {
                    let data = this.tableData.find((el) => el.id == this.aiDetail.id);
                    if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                        window.open('/commentReport?id=' + data.id, '_blank');
                    } else {
                        window.open(data.aiReport, '_blank');
                    }
                }
            }
        },
        viewReportTwo(type, row) {
            if (type == 0) {
                this.$axios.get('/sm/comment/getCommentSummarizeReport', {id: val.id}).then((res) => {
                    this.evaluationReport = res.data;
                    this.evaluationTems = true;
                });
            } else {
                if (row.aiStatus == 3) {
                    this.$message('报告生成失败，请联系管理员！');
                } else {
                    let data = this.tableData.find((el) => el.id == row.id);
                    if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                        window.open('/commentReport?id=' + data.id, '_blank');
                    } else {
                        window.open(data.aiReport, '_blank');
                    }
                }
            }
        },
        async openAiReportNew(downloadReport, id) {
            const res = await this.$axios.get('/sm/comment/getOne', {id: id});
            if (res.code == 200) {
                console.log('analysisId: ', res.data.analysisId);
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/ai/teacherReport?analysisId=' + res.data.analysisId + '&analysisType=2';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        async openBigDataReportNew(downloadReport, id) {
            const res = await this.$axios.get('/sm/comment/getOne', {id: id});
            if (res.code == 200) {
                console.log('analysisId: ', res.data.analysisId);
                if (!res.data.analysisId) {
                    return;
                }
                let route = '/getNuBiAnalysisBctiData?analysisId=' + res.data.analysisId + '&analysisType=2';
                if (downloadReport === 1) {
                    route += '&downloadReport=1';
                }
                window.open(route, '_blank');
            }
        },
        downloadPDFReport(val, id) {
            if (val == 4) {
                id = this.aiDetail.id;
            }
            this.$axios.get('/sm/comment/exportPDFReport', {id: id, type: 1, form: val}, 'blob').then((res) => {
                let url = window.URL.createObjectURL(new Blob([res]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                if (val < 4) {
                    link.download =
                        this.commentInfo.name +
                        '_' +
                        (val == 1 ? '专业版' : val == 0 ? '教师版' : '大数据报告') +
                        '.pdf';
                } else if (val == 4) {
                    link.download = this.commentInfo.name + '_AI教学建议书.pdf';
                }
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
            });
        },
        rebuildTeachingSuggestionReport(row) {
            this.rebuildDisabled = true;
            // this.reportShow = false;
            this.$message('已提交至AI进行重新分析', 'success');
            this.$axios.post('/sm/comment/rebuildTeachingSuggestionReport', {id: row.id}).then((res) => {
                if (res.code == 200) {
                }
            });
            this.aiDetail.aiParsingStatus = 1;
            // setTimeout(() => {
            //   this.$nextTick(() => {
            //     this.handleGetData();
            //   });
            // },500)
        },
        closeReport() {
            setTimeout(() => {
                this.$nextTick(() => {
                    this.handleGetData();
                });
            }, 500);
        },
        handleCloses() {
            this.evaluationReport = {};
            this.evaluationTems = false;
        },
        async openView(val) {
            this.aiDetail = val;
            this.resettingVal = JSON.parse(JSON.stringify(val));
            if (val.status == 5 || val.status == 4) {
                const res = await this.$axios.get('/sm/comment/info', {id: val.id});
                if (res.code == 200) {
                    if (res.data.reportTotal > 0) {
                        const resReport = await this.$axios.get('/sm/comment/report', {id: res.data.id});
                        if (resReport.code == 200) {
                            let arr = resReport.data;
                            this.commentInfo = res.data;
                            let arr1 = [];
                            let arr2 = [];
                            if (arr.length > 0) {
                                arr.forEach((el) => {
                                    if (el.type == 1) {
                                        arr1.push(el);
                                    } else {
                                        arr2.push(el);
                                    }
                                });
                            }
                            this.reportList = arr1;
                        }
                        const resAiReport = await this.$axios.get('/sm/comment/downloadReport', {id: val.id});
                        if (resAiReport.code == 200) {
                            this.reportAi = resAiReport.data;
                            console.log('reportAi: ', this.reportAi);
                        }
                        this.reportShow = true;
                    }
                }
                /*this.$axios.get("/sm/comment/info", { id: val.id }).then((res) => {
          // if(res.data.reportTotal > 0 && (res.data.commented > 0 || res.data.aiStatus == 2)){
          if (res.data.reportTotal > 0) {
            this.$axios
              .get("/sm/comment/report", {
                id: res.data.id,
              })
              .then((ress) => {
                let arr = ress.data;
                this.commentInfo = res.data;
                let arr1 = [];
                let arr2 = [];
                if (arr.length > 0) {
                  arr.forEach((el) => {
                    if (el.type == 1) {
                      arr1.push(el);
                    } else {
                      arr2.push(el);
                    }
                  });
                }
                this.reportList = arr1;
                this.reportAiList = arr2;
              });
            this.reportShow = true;
          } else {
            // this.$message('该评课已过结束时间，无法操作', 'error');
          }
        });*/
            }
        },
        //重置分析弹窗
        resetting() {
            if (this.commentInfo.isResetting != 0) {
                return;
            }
            const powerResult = this.hasProjectTimes(this.resettingVal);
            powerResult.then((res) => {
                if (res) {
                    this.resettingShow = true;
                }
            });
        },
        async hasProjectTimes(row) {
            // 1AI课堂分析 2赛课辅导 3大单元及学情分析 4AI课前指导
            let params = {};
            params['productType'] = 1;
            params['currentUserId'] = row.teacherId;
            return await this.$axios.get('/aiAnalysisRecharge/quota', params).then((res) => {
                if (res.code == 200) {
                    this.useList = res.data.options;
                    this.aiNum = res.data.totalResidue;
                    // 全部次数都没有了，直接给提示
                    if (this.aiNum == 0) {
                        this.$message('当前无可用分析次数！', 'error');
                        return false;
                    } else {
                        const currentItem = this.useList.find((item) => item.allocationId === row.aiProjectId);
                        // 当前项目没有次数，但还有其他项目次数可选
                        if (!currentItem || currentItem.residueNum == 0) {
                            this.$set(this.resettingVal, 'aiProjectId', '');
                            this.showChooseProjectTimes = true;
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            });
        },
        downLoadCode() {
            let shareLink = '';
            if (this.detailInfo.resources == 2) {
                if (this.detailInfo.smTheme && this.detailInfo.smTheme.liveStatus == 2) {
                    shareLink =
                        location.origin + '/pplay?themeid=' + this.detailInfo.objectId + '&type=0&vtype=1&etype=1';
                } else {
                    shareLink =
                        location.origin + '/hplay?themeid=' + this.detailInfo.objectId + '&type=0&vtype=1&etype=1';
                }
            } else {
                if (this.detailInfo.type == 0) {
                    if (this.detailInfo.smTheme && this.detailInfo.smTheme.liveStatus == 2) {
                        shareLink = location.origin + '/pplay?themeid=' + this.detailInfo.objectId + '&type=0&vtype=1';
                    } else {
                        shareLink = location.origin + '/hplay?themeid=' + this.detailInfo.objectId + '&type=0&vtype=1';
                    }
                } else {
                    if (this.detailInfo.resources == 3 || this.detailInfo.resources == 4) {
                        shareLink = location.origin + '/Hplays?themeid=' + this.detailInfo.id;
                    } else {
                        shareLink = location.origin + '/vplay?themeid=' + this.detailInfo.objectId + '&type=2&vtype=1';
                    }
                }
            }
            var input = document.createElement('input');
            input.value = shareLink;
            document.body.appendChild(input);
            input.select();
            document.execCommand('Copy');
            document.body.removeChild(input);
            this.$message('已复制到剪贴板', 'success');
            // html2canvas(this.$refs.downloadShare).then(canvas => {
            // 	let dataURL = canvas.toDataURL("image/png");
            // 	let a = document.createElement('a');
            // 	let event = new MouseEvent('click');
            // 	a.download = this.detailInfo.name;
            // 	a.href = dataURL
            // 	a.dispatchEvent(event);
            // });
        },
        openQrcodeShow(val) {
            if (val.type == 0) {
                this.mobilePlayUrl = location.origin + '/mobile/hplay&themeid=' + val.objectId + '&type=0';
            } else {
                this.mobilePlayUrl = location.origin + '/mobile/pplay&themeid=' + val.objectId + '&type=1';
            }
            this.$axios.get('/sm/comment/info', {id: val.id}).then((res) => {
                this.detailInfo = res.data;
                this.qrcodeShow = true;
            });
        },
        judgeEndTime(time, type) {
            if (getNowDate() > time) {
                this.$message(
                    type == 1
                        ? '审核失败，听评课活动结束时间需大于当前时间'
                        : '送审失败，听评课活动结束时间需大于当前时间',
                    'error'
                );
                return true;
            }
            return false;
        },
        judgeEndTimes(time, type) {
            if (getNowDate() > time) {
                this.$message(
                    type == 1
                        ? '审核失败，听评课活动课堂开始时间需大于当前时间'
                        : '送审失败，听评课活动课堂开始时间需大于当前时间',
                    'error'
                );
                return true;
            }
            return false;
        },
        // openView(val){
        // 	if(val.aiStatus !== 2){
        // 		this.$message('报告生成中，请稍后再试！', 'error');
        // 		return;
        // 	}
        // 	window.open(val.aiReport, '_blank')
        // },
        //送审 0送审 1送审确定
        submit(type, val) {
            if (type == 0) {
                if (val.status != 1) {
                    return;
                }
                if (this.judgeEndTime(val.endTime)) {
                    return;
                }
                if (val.resources == 2 && this.judgeEndTimes(val.smTheme.startTime)) {
                    return;
                }
                this.submitRow = val;
                this.submitShow = true;
            } else {
                if (this.judgeEndTime(this.submitRow.endTime)) {
                    return;
                }
                if (this.submitRow.resources == 2 && this.judgeEndTimes(this.submitRow.smTheme.startTime)) {
                    return;
                }
                this.$axios.get('/sm/comment/submit', {id: this.submitRow.id}).then((res) => {
                    if (res.code == 200) {
                        this.submitShow = false;
                        this.$message('送审成功', 'success');
                        this.handleGetData();
                    }
                });
            }
        },
        //审核 0审核 1审核确定
        audit(type, val) {
            if (type == 0) {
                if (val.status != 2) {
                    return;
                }
                this.auditStatus = 1;
                this.rejectReason = '';
                this.auditRow = val;
                this.auditShow = true;
            } else {
                if (this.auditStatus == 1) {
                    if (this.judgeEndTime(this.auditRow.endTime, 1)) {
                        return;
                    }
                    if (this.auditRow.resources == 2 && this.judgeEndTimes(this.auditRow.smTheme.startTime, 1)) {
                        // this.$message('审核已超时', 'error')
                        return;
                    }
                }
                let data = new FormData();
                data.append('id', this.auditRow.id);
                data.append('status', this.auditStatus);
                data.append('reason', this.rejectReason);
                if (this.rejectReason && this.rejectReason.length > 20) {
                    this.$message('驳回理由不得超过20字符', 'error');
                    return;
                }
                this.$axios.post('/sm/comment/audit', data).then((res) => {
                    if (res.code == 200) {
                        this.auditShow = false;
                        this.$message(this.auditStatus == 1 ? '审核成功' : '驳回成功', 'success');
                        this.handleGetData();
                    }
                });
            }
        },
        deleteData(id) {
            this.deleteId = id;
            this.deleteShow = true;
        },
        //评课详情
        evaluationDetail(val) {
            if (this.permission.info) {
                this.$router.push({
                    path: '/sm/commentdetail',
                    query: {evaluationid: val.id},
                });
            } else {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
            }
        },
        //相关主题详情
        aboutDetail(val) {
            if (!this.permission.relevanceInfo) {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
                return;
            }
            if (val.resources == 2) {
                if (val.type === 0) {
                    this.$router.push({
                        path: '/sm/themedetail',
                        query: {themeid: val.objectId, val: 1},
                    });
                } else {
                    this.$router.push({
                        path: '/sm/filedetail',
                        query: {themeid: val.objectId, val: 1, vtype: 1},
                    });
                }
            } else if (val.resources == 1) {
                if (val.type === 0) {
                    this.$router.push({
                        path: '/sm/themedetail',
                        query: {themeid: val.objectId, vtype: 1},
                    });
                } else {
                    this.$router.push({
                        path: '/sm/filedetail',
                        query: {themeid: val.objectId, val: 1, vtype: 1},
                    });
                }
            } else {
                window.open('/Hplays?themeid=' + val.id, '_blank');
            }
        },
        // 删除
        handleDelete() {
            this.$axios
                .post('/sm/comment/delete', {
                    id: this.deleteId.id,
                    type: this.deleteId.type,
                    objectId: this.deleteId.objectId,
                })
                .then((res) => {
                    if (res.code === 200) {
                        this.totalS = this.totalS - 1;
                        if (this.pageNum * 10 - this.totalS === 10) {
                            this.pageNum = this.pageNum - 1 || 1;
                        }
                        this.deleteShow = false;
                        this.$message('删除成功', 'success');
                        this.handleGetData();
                    }
                });
        },
        scrollTo0() {
            let bodyWrapper = document.getElementsByClassName('el-table__body-wrapper');
            if (bodyWrapper && bodyWrapper.length > 0) {
                for (let item of bodyWrapper) {
                    item.scrollTo(0, 0);
                }
            }
            document.getElementsByClassName('main-wrap')[0].scrollTo(0, 0);
        },
        // 分页点击
        handlePageChange(val) {
            this.scrollTo0();
            this.pageNum = val;
            this.handleGetData();
        },
        // 搜索
        handleSearch() {
            this.scrollTo0();
            this.pageNum = 1;
            this.handleGetData();
        },
        handleGetData() {
            this.loading = true;
            this.$axios
                .post('/sm/comment/list', {
                    keyWord: this.keyword,
                    pageNum: this.pageNum,
                    pageSize: 10,
                    resources: this.searchResourcesStatus,
                    status: this.searchThemeStatus,
                    orgIdList: this.orgIdList,
                    subjectId: this.searchLiveStatus,
                })
                .then((res) => {
                    this.loading = false;
                    this.tableData = res.data.pageList;
                    this.pages = res.data.pages;
                    this.totalS = res.data.total;
                    this.permission = this.creatPermit(res.data.permit);
                });
        },
        // 新增
        add(type, val) {
            if (type == 0) {
                if (this.aiUploadTable.length > 0 && val) {
                    let check = this.aiUploadTable.find((el) => {
                        return el.type == 1 && el.detail.get('id') == val.id;
                    });
                    if (check) {
                        return this.$message('该评课正在编辑中，请稍后再试', 'success');
                    }
                }
                if (val.status !== 1 && val.status !== 6) {
                    return;
                }
                // this.$router.push({path: '/sm/commentaddedit', query: {evaluationid: val ? val.id : '', type: 2}});
                if (val.evaluationType == 2) {
                    this.$router.push({
                        path: '/sm/commentaddedit',
                        query: {evaluationid: val ? val.id : '', type: 2, teacherName: val ? val.teacherName : ''},
                    });
                } else {
                    this.$router.push({
                        path: '/sm/commentaddedit',
                        query: {evaluationid: val ? val.id : '', teacherName: val ? val.teacherName : ''},
                    });
                }
            } else {
                this.addShow = true;
            }
        },
        //重置分析
        resetAnalysis() {
            let data = new FormData();
            data.append('id', this.commentInfo.id);
            data.append('aiProjectId', this.resettingVal.aiProjectId);
            this.$axios.post('/sm/comment/resetAnalysis', data).then((res) => {
                if (res.code === 200) {
                    this.resettingShow = false;
                    this.showChooseProjectTimes = false;
                    this.$message(res.data, 'success');
                    this.handleGetData();
                }
            });
        },
        async getDepartmentList() {
            if (this.isFirstTime) {
                this.$message('下拉请求中，请稍等', 'success');
                await this.$axios.get('/sys/org/listDepartmentAndUser', {isAll: 1}).then((res) => {
                    this.departmentTree = [];
                    this.departmentTree = res.data;
                    let dataArray = JSON.parse(JSON.stringify(this.departmentTree));
                    // 如果第一级只有一项，跳过，显示下级
                    while (dataArray.length == 1) {
                        dataArray = JSON.parse(JSON.stringify(dataArray[0].children));
                    }
                    this.departmentTree = dataArray;
                    this.isFirstTime = false;
                });
            }
            return this.departmentTree;
        },

        handleChangeTeacher(valueArray) {
            // 取数组每项的最后一项，并转为数值类型。
            this.orgIdList = valueArray.map((subArray) => parseInt(subArray.at(-1)));
        },
        getSubjectList() {
            this.$axios.get('/aiGrinding/getSubject').then((res) => {
                this.subjectList = res.data;
                this.subjectList.unshift({
                    id: '',
                    name: '全部',
                });
            });
        },
        handleCloseResetAnalysis() {
            this.showChooseProjectTimes = false;
            this.aiNum = 0;
            this.useList = [];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.add-dialog {
    ::v-deep .el-dialog__header {
        padding: 20px 60px 20px 60px;
    }

    ::v-deep .el-dialog__body {
        padding: 0px 70px 70px 70px;
    }
}

.add-box {
    height: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .add-item {
        cursor: pointer;
        background: #f2f2f2;
        width: 230px;
        height: 170px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .add-item:hover {
        background: #8ccbff;
    }
}

.evaluation-title {
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
}

.qrcode-wrap {
    margin-bottom: 30px;
    text-align: center;

    img {
        width: 328px;
        height: 185px;
        border-radius: 10px;
    }

    .content {
        display: flex;
        align-items: center;
        width: 330px;
        margin-top: -2px;
        box-sizing: border-box;
        padding: 16px 20px 14px 20px;
        font-size: 18px;
        background: #85c1ff;
        color: #fff;

        .text-wrap {
            flex: 1;
            text-align: left;
            line-height: 25px;

            p:first-child {
                // -webkit-line-clamp:1;
                line-clamp: 1;
                width: 193px;
                overflow: hidden;
                text-overflow: ellipsis;
                // white-space:nowrap
            }

            .sec-p {
                font-size: 14px;
            }
        }

        .qrcode-img {
            width: 72px;
            height: 72px;
            margin-left: 25px;
            background: #fff;

            img {
                width: 60px;
                height: 60px;
                margin: 6px;
            }
        }
    }
}

.active {
    color: #409eff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.actives {
    color: #b3b6ba;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.detail {
    color: #409eff;
    cursor: pointer;
}

.evaluation-parttwo {
    .part-title {
        margin: 10px 0 0 0;
    }

    .evaluation-text {
        width: 100%;
        height: 118px;
        background: #ffffff;
        border: 1px solid #dbe2e7;
        opacity: 1;
        border-radius: 6px;
        margin: 18px 0 30px 0;
        padding: 10px;
        box-sizing: border-box;
    }
}
.divider {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #ddd;
}
.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #303133;
}

.prompt {
    color: gray;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.resetting {
    ::v-deep .el-dialog__title {
        padding-left: 20px;
    }

    ::v-deep .el-dialog__body {
        padding-top: 30px !important;
    }
}
</style>

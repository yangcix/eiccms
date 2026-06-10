<template>
    <div class="second-wrap">
        <p class="content-title"><el-page-header @back="goBack" content="听评课详情页"></el-page-header></p>

        <div class="content-wrap scroll-wrap">
            <ul class="detail-list">
                <div class="data-titile">数据统计：</div>
                <div class="total">
                    <div class="block-show">
                        <img src="@/assets/imgs/evaluation1.png" alt="" />
                        <div class="right-show" @click="toEvaluate">
                            <p>
                                <span>{{ detailInfo.commented }}</span
                                ><span>详情</span>
                            </p>
                            <p>已评课人数</p>
                        </div>
                    </div>
                    <div class="block-show">
                        <img src="@/assets/imgs/evaluation2.png" alt="" />
                        <div class="right-show" @click="toEvaluateUn">
                            <p>
                                <span>{{ detailInfo.uncomment }}</span
                                ><span>详情</span>
                            </p>
                            <p>未评课人数</p>
                        </div>
                    </div>
                    <div class="block-show">
                        <img src="@/assets/imgs/evaluation3.png" alt="" />
                        <div class="right-show" @click="toReport">
                            <!-- <p><span>{{detailInfo.reportTotal}}</span><span>{{(detailInfo.reportTotal > 0 && (detailInfo.commented > 0 || detailInfo.aiStatus == 2)) ? '查看报告' : ''}}</span></p> -->
                            <!-- <p><span>{{detailInfo.reportTotal}}</span><span>{{(detailInfo.reportTotal > 0 && (detailInfo.status == 4 || detailInfo.status == 5))? '查看报告' : ''}}</span></p> -->
                            <p>
                                <span>{{ detailInfo.reportTotal }}</span
                                ><span>详情</span>
                            </p>
                            <p>报告数量</p>
                        </div>
                    </div>
                </div>
                <div class="data-titile" style="margin-top: 10px">基础数据：</div>
                <li>
                    <p class="title">评课详情：</p>
                    <p class="value evaluatuionClick" @click="viewTem">查看评课模板</p>
                </li>
                <li>
                    <p class="title">评课名称：</p>
                    <p class="value">{{ detailInfo.name }}</p>
                    <!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
                </li>
                <li>
                    <p class="title">评课分类：</p>
                    <p class="value" style="margin-right: 8px">{{ detailInfo.categoryName }}</p>
                    <p
                        class="value"
                        v-show="detailInfo.labelNameList.length > 0"
                        v-for="(val, index) in detailInfo.labelNameList"
                        :key="index"
                    >
                        <span style="margin-right: 8px">—</span>{{ val }}
                    </p>
                    <!-- <p class="value" v-for="val in detailInfo.labelNameList">{{val}}</p> -->
                </li>
                <li v-if="detailInfo.evaluationType == 2">
                    <p class="title">课堂类型：</p>
                    <p class="value">{{ detailInfo.classTypeName }}</p>
                </li>
                <li>
                    <p class="title">授课教师：</p>
                    <p class="value">{{ detailInfo.teacherName }}</p>
                </li>
                <li v-if="detailInfo.evaluationType == 2">
                    <p class="title">AI次数来源：</p>
                    <p class="value">{{ detailInfo.aiProjectName }}</p>
                </li>
                <li>
                    <p class="title">创建者：</p>
                    <p class="value">{{ detailInfo.createUserName }}</p>
                </li>
                <li>
                    <p class="title">评课教师组：</p>
                    <p class="value">{{ detailInfo.groupName }}</p>
                </li>
                <li>
                    <p class="title">评课开始时间：</p>
                    <p class="value">{{ detailInfo.startTime }}</p>
                </li>
                <li>
                    <p class="title">评课结束时间：</p>
                    <p class="value">{{ detailInfo.endTime }}</p>
                </li>
                <li>
                    <p class="title">状态：</p>
                    <p class="value">{{ detailInfo.status | state }}</p>
                    <p v-if="detailInfo.status == 6" class="value">
                        (驳回理由：{{ detailInfo.reason ? detailInfo.reason : '无理由' }})
                    </p>
                </li>
                <li v-if="detailInfo.evaluationType == 2">
                    <p class="title">教案：</p>
                    <div v-if="detailInfo?.teachingFileList?.length > 0">
                        <div v-for="(item, index) in detailInfo.teachingFileList" :key="index">
                            <span>{{ item.name }}</span
                            ><span @click="downFile(item)" style="margin-left: 10px; color: #1e80ff; cursor: pointer"
                                >下载</span
                            >
                        </div>
                    </div>
                    <span v-else class="value">无</span>
                </li>
                <div
                    v-if="
                        detailInfo.resources == 3 &&
                        (detailInfo.status == 1 || detailInfo.status == 2 || detailInfo.status == 6)
                    "
                ></div>
                <div v-else>
                    <div
                        v-if="detailInfo.resources == 1 || detailInfo.resources == 2"
                        class="data-titile"
                        style="margin-top: 10px"
                    >
                        {{ detailInfo.type == 1 ? '视频资源：' : '直播资源：' }}
                    </div>
                    <li v-if="detailInfo.resources == 1 || detailInfo.resources == 2">
                        <p class="title">关联资源:</p>
                        <p class="value evaluatuionClick" @click="toTheme(detailInfo)">{{ detailInfo.objectName }}</p>
                    </li>
                </div>
                <div v-if="detailInfo.resources == 2">
                    <li>
                        <p class="title">课堂开始时间：</p>
                        <p class="value">{{ detailInfo.smTheme.startTime }}</p>
                    </li>
                    <li>
                        <p class="title">课堂结束时间：</p>
                        <p class="value">{{ detailInfo.smTheme.endTime }}</p>
                    </li>
                    <li v-if="detailInfo.terminalList.length > 0">
                        <p class="title">上课位置：</p>
                        <p class="value">
                            {{
                                detailInfo.terminalList[0].schoolName +
                                ' - ' +
                                detailInfo.terminalList[0].buildName +
                                ' - ' +
                                detailInfo.terminalList[0].className
                            }}
                        </p>
                    </li>
                </div>
            </ul>

            <el-dialog
                :close-on-click-modal="false"
                :visible.sync="evaluationTems"
                width="80%"
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
                :close-on-click-modal="false"
                :visible.sync="evaluationTem"
                width="1000px"
                :before-close="handleClose"
            >
                <div class="evaluation-title">{{ detailInfo.name }}在线评课</div>
                <el-tabs v-model="activeName">
                    <el-tab-pane
                        v-for="(item, index) in evaluationList"
                        :key="index"
                        :label="item.name"
                        :name="index.toString()"
                    >
                        <div class="evaluation-content">
                            <el-table
                                v-if="item.strategy == 1 && item.wordDataDtos.length > 0"
                                :data="item.wordDataDtos"
                                style="width: 100%"
                                border
                                default-expand-all
                            >
                                <el-table-column width="320" align="left" prop="levelOne" label="评价要素">
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
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
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评分"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评语"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="item.isOpenRemarks == 1"
                                    align="center"
                                    :label="item.remarksName"
                                >
                                    <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template> -->
                                </el-table-column>
                            </el-table>
                            <el-table
                                v-if="item.strategy == 2 && item.wordDataDtos.length > 0"
                                :data="item.wordDataDtos"
                                style="width: 100%"
                                border
                                default-expand-all
                                :span-method="(param) => objectSpanMethod(param, item.wordDataDtos)"
                            >
                                <el-table-column width="150" align="center" prop="levelOne" label="评价项目">
                                </el-table-column>
                                <el-table-column width="320" align="left" prop="levelTwo" label="评价要素">
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
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
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评分"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评语"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="item.isOpenRemarks == 1"
                                    align="center"
                                    :label="item.remarksName"
                                >
                                    <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template> -->
                                </el-table-column>
                            </el-table>
                            <el-table
                                v-if="item.strategy == 3 && item.wordDataDtos.length > 0"
                                :data="item.wordDataDtos"
                                style="width: 100%"
                                border
                                default-expand-all
                                :header-cell-style="handerMethod"
                                :span-method="(param) => objectSpanMethod(param, item.wordDataDtos)"
                            >
                                <el-table-column width="100" align="center" prop="levelOne" label="一级名称">
                                </el-table-column>
                                <el-table-column width="100" align="center" prop="levelTwo" label="评价项目">
                                </el-table-column>
                                <el-table-column width="320" align="left" prop="levelThree" label="评价要素">
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
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
                                        item.itemList[0] && (item.itemList[0].type == 0 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评分"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="
                                        item.itemList[0] && (item.itemList[0].type == 1 || item.itemList[0].type == 2)
                                    "
                                    align="center"
                                    label="评语"
                                >
                                    <!-- <template slot-scope="scope">
                <div v-if="scope.row.type == 0">
                  <el-input-number class="width-6" v-model="scope.row.userScore" clearable :min="1" :max="scope.row.score"></el-input-number>
                </div>
                <el-input v-else v-model="scope.row.content">
                </el-input>
              </template> -->
                                </el-table-column>
                                <el-table-column
                                    v-if="item.isOpenRemarks == 1"
                                    align="center"
                                    :label="item.remarksName"
                                >
                                    <!-- <template slot-scope="scope">
                <el-input v-model="scope.row.remarks"></el-input>
              </template> -->
                                </el-table-column>
                            </el-table>
                            <div class="evaluation-parttwo" v-if="item.isOpenSummary == 1">
                                <h3 class="part-title">{{ item.summaryName }}</h3>
                                <textarea
                                    class="evaluation-text"
                                    v-model.trim="item.summary"
                                    style="resize: none"
                                    type="textarea"
                                ></textarea>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>

            <el-dialog
                title="已评课详情"
                :close-on-click-modal="false"
                :visible.sync="evaluated"
                :before-close="evaluatedClose"
            >
                <div>
                    <!-- <el-select v-model="templateId" placeholder="请选择模板" @change="evaluation">
            <el-option v-for="item in detailInfo.templatesList" :key="item.id" :label="item.name" :value="item.commentId"></el-option>
          </el-select> -->
                    <el-input
                        style="margin-left: 20px"
                        class="width-2"
                        v-model="userKey"
                        clearable
                        placeholder="请输入用户姓名关键字"
                        v-search="searchLive"
                    ></el-input>
                    <el-button type="primary" class="search-btn" @click="searchLive">查询</el-button>
                </div>
                <div>
                    <el-table v-loading="loadingW" :data="userList" style="width: 100%">
                        <el-table-column align="center" prop="userName" label="用户姓名"> </el-table-column>
                        <el-table-column align="center" prop="account" label="用户账号"> </el-table-column>
                        <el-table-column align="center" prop="name" label="评课名称"> </el-table-column>
                        <el-table-column align="center" prop="commentTime" label="评课时间"> </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <div>
                                    <el-button type="text" @click="handleExportDataList(scope.row)">导出</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="table-page">
                    <el-pagination
                        :page-size="8"
                        layout="prev, pager, next"
                        @current-change="pageChange"
                        :current-page="pageNum"
                        :page-count="pages"
                    >
                    </el-pagination>
                </div>
            </el-dialog>

            <el-dialog
                title="未评课详情"
                :close-on-click-modal="false"
                :visible.sync="unevaluated"
                :before-close="unevaluatedClose"
            >
                <div>
                    <el-input
                        class="width-2"
                        v-model="userKey"
                        clearable
                        placeholder="请输入用户姓名关键字"
                        v-search="unsearchLive"
                    ></el-input>
                    <el-button type="primary" class="search-btn" @click="unsearchLive">查询</el-button>
                </div>
                <div>
                    <el-table v-loading="loadingUn" :data="userListUn" style="width: 100%">
                        <el-table-column align="center" prop="userName" label="用户姓名"> </el-table-column>
                        <el-table-column align="center" prop="account" label="用户账号"> </el-table-column>
                        <el-table-column align="center" prop="name" label="评课名称"> </el-table-column>
                    </el-table>
                </div>
                <div class="table-page">
                    <el-pagination
                        :page-size="8"
                        layout="prev, pager, next"
                        @current-change="pageChangeUn"
                        :current-page="pageNumUn"
                        :page-count="pagesUn"
                    >
                    </el-pagination>
                </div>
            </el-dialog>
            <el-dialog title="听评课活动报告" :close-on-click-modal="false" :visible.sync="reportShow" width="500px">
                <div>
                    <p>人工评课报告</p>
                    <div
                        v-for="(item, index) in reportList"
                        :key="index"
                        style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                    >
                        <span style="width: 300px">{{ item.name }}</span>
                        <el-button type="text" @click="downloadReport(0, item)">下载</el-button>
                        <el-button type="text" @click="viewReport(0, item)">查看</el-button>
                    </div>
                    <div v-if="reportAiList.length > 0">
                        <p>AI评课报告</p>
                        <div
                            v-for="(item, index) in reportAiList"
                            :key="index"
                            style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px"
                        >
                            <span style="width: 300px">{{ item.name }}</span>
                            <!-- <el-button type="text" @click="downloadReport(1, item)">下载</el-button> -->
                            <el-button v-if="detailInfo.aiStatus != 3" type="text" @click="viewReport(1, item)"
                                >查看复盘/报告</el-button
                            >
                            <el-button
                                v-if="
                                    detailInfo.isResetting == 0 &&
                                    detailInfo.aiConfigId == 2 &&
                                    detailInfo.aiStatus == 3
                                "
                                type="text"
                                @click="resetting()"
                                >重置分析</el-button
                            >
                            <el-button
                                style="color: #b3b6ba"
                                v-if="
                                    detailInfo.isResetting == 1 &&
                                    detailInfo.aiConfigId == 2 &&
                                    detailInfo.aiStatus == 3
                                "
                                type="text"
                                disabled
                                >重置分析</el-button
                            >
                            <!-- <div v-if="detailInfo.aiConfigId == 2 && detailInfo.aiStatus == 3">
                <el-button v-if="detailInfo.isResetting == 0" type="text" @click="resetting()">重置分析</el-button>
                <el-button style="color: #b3b6ba" v-else type="text" disabled>重置分析</el-button>
              </div> -->
                        </div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog
                class="resetting"
                title="重置分析"
                :append-to-body="true"
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
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: '',
    data() {
        return {
            permission: '',
            evaluationReport: {},
            reportAiList: [],
            reportList: [],
            reportShow: false,
            detailInfo: {},
            evaluationTem: false,
            evaluationTems: false,
            summary: '', // 评价总结
            colors: ['#FA8C47', '#FA8C47', '#FA8C47'],
            evaluationList: [], // 评课数组
            activeName: 0,
            userList: [], //评课用户列表
            userKey: '', // 直播搜索关键词
            pageNum: 1,
            pages: 1,
            loadingW: false, // 直播表格加载动画
            evaluated: false, // 评课详情
            templateId: '',
            userListUn: [], //评课用户列表
            pageNumUn: 1,
            pagesUn: 1,
            loadingUn: false, // 直播表格加载动画
            unevaluated: false, // 评课详情
            evaluatedType: '', //已评课
            resettingShow: false, // 重置分享弹窗
            aiNum: 0, // ai分析次数
            resettingVal: {},
        };
    },
    components: {},
    mounted() {
        this.getDetailInfo();
    },
    methods: {
        //重置分析弹窗
        resetting() {
            if (this.detailInfo.isResetting != 0) {
                return;
            }
            this.resettingVal = this.detailInfo;
            this.resettingShow = true;
        },
        //重置分析
        resetAnalysis() {
            this.$axios.get('/aiRecharge/count').then((res) => {
                this.aiNum = res.data.aiClass;
                if (this.aiNum === 0) {
                    this.$message('AI分析剩余次数不足！', 'error');
                    return;
                }
                let data = new FormData();
                data.append('id', this.resettingVal.id);
                this.$axios.post('/sm/comment/resetAnalysis', data).then((res) => {
                    if (res.code === 200) {
                        this.resettingShow = false;
                        this.$message(res.data, 'success');
                        this.getDetailInfo();
                    }
                });
            });
        },
        downFile(item) {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = item.url;
            link.setAttribute('download', decodeURIComponent(item.name));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
                this.$axios
                    .get('/sm/comment/exportCommentReportWord', {commentId: val.id}, 'blob')
                    .then((res) => {
                        let url = window.URL.createObjectURL(new Blob([res]));
                        console.log(url);
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
                if (this.detailInfo.aiStatus == 3) {
                    this.$message('报告生成失败，请联系管理员！');
                } else {
                    if (JSON.parse(localStorage.getItem('sysInfo')).aiConfigId == 2) {
                        window.open('/commentReport?id=' + this.detailInfo.id, '_blank');
                    } else {
                        window.open(this.detailInfo.aiReport, '_blank');
                    }
                }
            }
        },
        //获取主体信息
        getDetailInfo() {
            this.$axios.get('/sm/comment/info', {id: this.$route.query.evaluationid}).then((res) => {
                this.detailInfo = res.data;
            });
            this.$axios
                .post('/sm/comment/list', {
                    pageNum: 1,
                    pageSize: 10,
                })
                .then((res) => {
                    this.permission = this.creatPermit(res.data.permit);
                });
        },
        // 查看模板
        async viewTem() {
            this.activeName = '0';
            this.evaluationList = [];
            for (let i = 0; i < this.detailInfo.templatesList.length; i++) {
                let obj = await this.$axios.get('/sm/template/selectItemByTemplate', {
                    templateId: this.detailInfo.templatesList[i].id,
                });
                this.evaluationList.push(obj.data);
            }
            this.evaluationTem = true;
        },
        handerMethod({row, column, rowIndex, columnIndex}) {
            //这里有个非常坑的bug 必须是row[0]=0 row[1]=2才会生效
            row[1].colSpan = 2;
            row[2].colSpan = 0;
            if (columnIndex === 0) {
                return {display: 'none'};
            }
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
        // 关闭模板
        handleClose() {
            this.evaluationTem = false;
        },
        handleCloses() {
            this.evaluationReport = {};
            this.evaluationTems = false;
        },
        // 关联主题d
        toTheme(val) {
            if (!this.permission.relevanceInfo) {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
                return;
            }
            // if(val.status !== 3 && val.status !== 4 && val.status !== 5){
            //   return;
            // }
            if (val.resources == 2) {
                if (val.type === 0) {
                    this.$router.push({path: '/sm/themedetail', query: {themeid: val.objectId, val: 1}});
                } else {
                    this.$router.push({path: '/sm/filedetail', query: {themeid: val.objectId, val: 1}});
                }
            } else {
                if (val.type === 0) {
                    this.$router.push({path: '/sm/themedetail', query: {themeid: val.objectId, vtype: 1}});
                } else {
                    this.$router.push({path: '/sm/filedetail', query: {themeid: val.objectId, val: 1, vtype: 1}});
                }
            }
        },
        //开启已评课详情
        toEvaluate() {
            this.evaluated = true;
            this.pageNum = 1;
            this.templateId = Number(this.detailInfo.templatesList[0].commentId);
            this.evaluation();
        },
        //开启未评课详情
        toEvaluateUn() {
            this.pageNumUn = 1;
            this.unevaluated = true;
            this.unevaluation();
        },
        toReport() {
            if (!this.permission.reportAi) {
                this.$message('您没有当前操作的权限，请联系管理员', 'error');
                return;
            }
            // if(this.detailInfo.reportTotal > 0 && (this.detailInfo.commented > 0 || this.detailInfo.aiStatus == 2)){
            if (this.detailInfo.reportTotal > 0) {
                this.$axios
                    .get('/sm/comment/report', {
                        id: this.detailInfo.id,
                    })
                    .then((res) => {
                        let arr = res.data;
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
            }
        },
        // 关闭已评课详情
        evaluatedClose() {
            this.userKey = '';
            this.evaluated = false;
        },
        // 关闭未评课详情
        unevaluatedClose() {
            this.userKey = '';
            this.unevaluated = false;
        },

        // 已评课用户数据
        evaluation() {
            let url = '/sm/comment/commentList';
            this.loadingW = true;
            this.$axios
                .get(url, {
                    keyWord: this.userKey,
                    pageNum: this.pageNum,
                    pageSize: 8,
                    id: this.templateId,
                })
                .then((res) => {
                    this.loadingW = false;
                    this.userList = res.data.pageList;
                    this.pages = res.data.pages;
                });
        },
        // 未评课用户数据
        unevaluation() {
            let url = '/sm/comment/unCommentList';
            this.loadingUn = true;
            this.$axios
                .get(url, {
                    keyWord: this.userKey,
                    pageNum: this.pageNumUn,
                    pageSize: 8,
                    id: this.detailInfo.id,
                })
                .then((res) => {
                    this.loadingUn = false;
                    this.userListUn = res.data.pageList;
                    this.pagesUn = res.data.pages;
                });
        },

        // 已评课用户查询
        searchLive() {
            this.pageNum = 1;
            this.evaluation();
        },
        // 未评课用户查询
        unsearchLive() {
            this.pageNumUn = 1;
            this.unevaluation();
        },

        //分页点击
        pageChange(val) {
            this.pageNum = val;
            this.evaluation();
        },
        //未评课分页点击
        pageChangeUn(val) {
            this.pageNumUn = val;
            this.unevaluation();
        },

        // 导出列表
        handleExportDataList(item) {
            let data = {
                commentId: item.commentId,
                userId: item.userId,
            };
            axios
                .get('/sm/comment/exportCommentReportTwo', {
                    params: data,
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
                });
        },
        //返回
        goBack() {
            this.$router.go(-1);
        },
    },
    filters: {
        state(val) {
            let arr = ['未提交', '待提交', '待审核', '待评课', '评课中', '已结束', '驳回'];
            return arr[val];
        },
    },
};
</script>

<style lang="scss" type="text/scss" scoped>
.content-wrap {
    display: flex;
    padding: 66px 55px 0 55px;
    box-sizing: border-box;

    .evaluation-title {
        width: 100%;
        height: 30px;
        text-align: center;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
    }

    .evaluation-content {
        width: 100%;
        height: auto;
        padding: 0 10px 0 10px;
        box-sizing: border-box;

        .part-title {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333333;
        }

        .part-one-itemwrap {
            height: 494px;
            box-sizing: border-box;
            overflow: auto;
            .one-item {
                margin-top: 15px;
                .one-item-title {
                    font-size: 15px;
                    font-weight: bold;
                    line-height: 22px;
                    color: #333333;
                }
                .score {
                    margin: 10px 0 0 24px;
                }
            }
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
    }
}
.scroll-wrap {
    height: 90%;
}
.detail-list {
    .data-titile {
        display: block;
        font-size: 18px;
    }
    .total {
        display: flex;
        margin-top: 30px;

        .block-show {
            display: flex;
            min-width: 336px;
            height: 139px;
            background: #ffffff;
            box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.05);
            opacity: 1;
            border-radius: 8px;
            padding: 9px 19px;
            box-sizing: border-box;
            margin-right: 54px;
            img {
                width: 121px;
                height: 121px;
                transition: transform 0.2s;
            }
            .right-show {
                width: 100%;
                display: inline-block;
                text-align: center;
                margin-top: 32px;
                cursor: pointer;
                transition: transform 0.2s;
                p {
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    line-height: 17px;
                    span:first-child {
                        font-size: 25px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        line-height: 17px;
                        color: #000000;
                        margin-right: 10px;
                    }
                    span:last-child {
                        font-size: 12px;
                        font-family: MicrosoftYaHei;
                        line-height: 17px;
                        color: #5b8cff;
                    }
                }
                p:last-child {
                    margin-top: 7px;
                }
            }
        }
        .block-show:hover .right-show {
            transform: translateX(6px);
        }
        .block-show:hover img {
            transform: scale(1.15);
        }
        // .block-show:last-child >.right-show {
        // 	cursor: context-menu;
        // }
    }
    li {
        display: flex;
        margin-top: 20px;
        line-height: 40px;
        font-size: 14px;
        .title {
            min-width: 70px;
            margin-right: 20px;
            color: #303133;
        }
        .value {
            margin-right: 15px;
            color: #606266;
        }
        .evaluatuionClick {
            cursor: pointer;
            font-size: 12px;
            color: #5b8cff;
        }
        .detail-btn {
            margin-left: 30px;
        }
        .copy-url {
            margin-left: 20px;
            color: #409eff;
            cursor: pointer;
        }
    }
}
.dialog-item {
    p:first-child {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: justify;
    }
}
.video-wrap {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 9%;
    .content {
        position: relative;
        width: 250px;
        height: 167px;
        margin-bottom: 30px;
        .video-status {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 5;
            width: 100%;
            line-height: 40px;
            text-align: center;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            i {
                margin-right: 9px;
            }
        }
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
        .live-hover {
            position: absolute;
            z-index: 3;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 180px;
            background: rgba(0, 0, 0, 0.6);
            i {
                font-size: 40px;
                color: #fff;
            }
        }
    }
}
.select {
    padding-bottom: 30px;
    p {
        margin-bottom: 25px;
    }
    span {
        margin-left: 35px;
        color: #409eff;
    }
}
</style>
<style>
.el-rate__text {
    color: #fa8c47 !important;
}
</style>
<style lang="scss">
.popUp {
    margin-left: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: white;
}
.prompt {
    color: gray;
    display: flex;
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}
.resetting {
    .el-dialog__title {
        padding-left: 20px;
    }
}
</style>
